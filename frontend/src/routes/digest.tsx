import { Grid, GridItem, Container, Text, Textarea, Box, Button, Table } from "@chakra-ui/react"
import {
    createFileRoute,
} from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Field } from "@/components/ui/field"

export const Route = createFileRoute("/digest")({
    component: Digest,
})

function Digest() {
    const { register, handleSubmit, reset } = useForm<{ content: string }>()
    const [result, setResult] = useState("")
    const [history, setHistory] = useState<{ time: string, digest: string }[]>([])
    const [page, setPage] = useState(1)
    const pageSize = 5

    // 示例提交处理
    const onSubmit = async (data: { content: string }) => {
        // TODO: 替换为实际 API 调用
        const fakeResult = `Server response: ${data.content.slice(0, 10)}...`
        setResult(fakeResult)
        setHistory(prev => [
            { time: new Date().toLocaleString(), digest: data.content },
            ...prev,
        ])
        reset()
        // toaster.create({ title: "Submitted successfully", status: "success", duration: 1500, isClosable: true })
    }

    // 分页数据
    const pagedHistory = history.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(history.length / pageSize)

    return (
        <Container maxW="container.lg" py={8}>
            <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center">
                AI Meeting Digest
            </Text>
            {/* 第一行：输入、提交、结果 */}
            <Grid templateColumns="2fr 1fr 2fr" gap={4} mb={8}>
                <GridItem>
                    <Textarea
                        placeholder="Enter meeting minutes"
                        minH="120px"
                        {...register("content", { required: true })}
                    />
                </GridItem>
                <GridItem display="flex" alignItems="center" justifyContent="center">
                    <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                </GridItem>
                <GridItem>
                    <Box borderWidth={1} borderRadius="md" p={4} minH="120px" bg="gray.50">
                        <Text fontWeight="bold" mb={2}>Server Result</Text>
                        <Text whiteSpace="pre-wrap">{result}</Text>
                    </Box>
                </GridItem>
            </Grid>

            {/* 第二行：历史数据表格 */}
            <Box borderWidth={1} borderRadius="md" p={4} bg="white">
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell>Time</Table.Cell>
                            <Table.Cell>Meeting Minutes</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pagedHistory.map((item, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{item.time}</Table.Cell>
                                <Table.Cell>{item.digest}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
                {/* 分页控件 */}
                <Box mt={4} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Text fontSize="sm">Page {page} / {totalPages}</Text>
                    <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </Box>
            </Box>
        </Container>
    )
}
