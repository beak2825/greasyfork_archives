// ==UserScript==
// @name            Bilibili-Live-Spamer
// @name:zh         Bilibili-Live-Spamer
// @namespace       https://github.com/ADJazzzz
// @version         1.4.3
// @author          ADJazz
// @description     B站直播文字、表情独轮车
// @description:zh  B站直播文字、表情独轮车
// @license         MIT
// @copyright       2023, ADJazz (https://github.com/ADJazzzz)
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+CgogPGc+CiAgPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTAuMzM4NSAxNy4zNTk3IDEyLjI5MzEpIiBzdHJva2U9Im51bGwiIGlkPSJsYXllcjEiICA+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjAzMzA3IiBpZD0ic3ZnXzMwIiBwLWlkPSIyMzA5IiBmaWxsPSIjMjBiMGUzIiBkPSJtMTEuNzkzOTMsNC4wMjgxN2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMS4xNTU4NiwwYTIuODI4NDcsMi43NDgyMyAwIDAgMSAwLjcwNzExLDAuNTAyMDhsMi43MTk2OCwyLjMxMjIybDEuOTQ0NTcsMGwyLjcxOTY3LC0yLjMxMjIyYTIuODU1NjUsMi43NzQ2NSAwIDAgMSAwLjcwNzExLC0wLjUwMjA4YTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAxLjgwODYsMS4wOTY2NmExLjM1OTgzLDEuMzIxMjYgMCAwIDEgLTAuMjk5MTYsMC44ODUyNWE3LjYwMTUsNy4zODU4NyAwIDAgMSAtMC41OTgzMywwLjUyODVhMy45Mjk5MywzLjgxODQ1IDAgMCAxIC0wLjM4MDc1LDAuMzAzODlsMS42OTk3OSwwYTIuODgyODYsMi44MDEwOCAwIDAgMSAxLjk5ODk3LDAuODcyMDNhMi44OTY0NSwyLjgxNDI5IDAgMCAxIDAuOTExMDksMS45NDIyNWwwLDcuNTk3MjdhNS41MDczNiw1LjM1MTEzIDAgMCAxIC0wLjA2OCwxLjE0OTVhMy4wMTg4NSwyLjkzMzIxIDAgMCAxIC0xLjM1OTgzLDEuODQ5NzdhMi45MjM2NiwyLjg0MDcyIDAgMCAxIC0xLjU2MzgyLDAuNDIyODFsLTEyLjQ4MzMzLDBhNS43NjU3Miw1LjYwMjE3IDAgMCAxIC0xLjIyMzg1LC0wLjA2NjA4YTMuMDA1MjQsMi45MTk5OSAwIDAgMSAtMS44NzY1NywtMS4zMjEyNmEyLjkxMDA1LDIuODI3NSAwIDAgMSAtMC40NjIzNiwtMS41MTk0NmwwLC03LjUxNzk4YTYuMDkyMDgsNS45MTkyNiAwIDAgMSAwLC0xLjA5NjY2YTIuOTkxNjQsMi45MDY3OCAwIDAgMSAyLjcxOTY5LC0yLjM1MTg0bDEuNzgxNCwwYy0wLjI4NTU4LC0wLjE5ODE5IC0wLjUzMDM0LC0wLjQzNjAyIC0wLjc4ODcxLC0wLjY0NzQzYTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAtMC40MzUxNSwtMS4wODM0M2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMC42NjYzMywtMS4wNDM4bS0wLjMxMjc5LDUuMTI2NTFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0xLjA3NDI4LDAuOTUxMzFhMS44MzU3OCwxLjc4MzcgMCAwIDAgMCwwLjUwMjA4bDAsNi4yNDk1OGExLjM1OTgzLDEuMzIxMjYgMCAwIDAgMC45MzgyOSwxLjMyMTI3YTEuNzk0OTgsMS43NDQwNyAwIDAgMCAwLjU4NDczLDAuMDkyNDhsMTEuMDU1NSwwYTEuMzU5ODMsMS4zMjEyNiAwIDAgMCAxLjI5MTgzLC0wLjc3OTU0YTEuOTAzNzgsMS44NDk3NyAwIDAgMCAwLjEzNTk5LC0wLjg3MjAzbDAsLTUuODEzNTZhMi4yODQ1MywyLjIxOTczIDAgMCAwIDAsLTAuNjM0MjFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0wLjg4Mzg5LC0wLjg5ODQ3YTIuMTg5MzQsMi4xMjcyNCAwIDAgMCAtMC44NDMwOSwtMC4xMTg5MWwtMTAuNTY1OTUsMGE0LjU0MTg2LDQuNDEzMDIgMCAwIDAgLTAuNjM5MTIsMHptMCwwIi8+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjUyNDE2IiBmaWxsPSIjMjBiMGUzIiAgZD0ibTEyLjgyMDE1LDEyLjEyMjUxYzAuMTg1NDYsMC4xODc0OSAwLjM4MDQ4LDAuMzcwNzMgMC41NTU5OCwwLjU2Njk1YzAuMzA0OTMsMC4zNDA5MyAwLjU3MTAzLDAuNTk0NDkgMC44NTA5NywwLjg5ODEyYy0wLjA2NTY2LC0wLjU1NDUxIDAuNjY2NCwtMC41OTQ5MSAwLjAzNzg5LC0wLjg3MjMzYy0wLjIwODMxLDAuMjA3MTMgLTAuNDgwOTgsMC40Mzg3NyAtMC42OTUyMSwwLjYwNzEzYy0wLjE5OTk3LDAuMTU3MTUgLTAuNDQwNTMsMC4zMzI4NiAtMC42MzA4NCwwLjQ3Mjc0Yy0wLjk3NDQzLDAuNzE2MjIgMC4xMTU0MiwyLjAxMjA3IDEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIDEuMDIxMzIsLTAuNzYyMTQgMS40MzQwOSwtMS4xNDI1OWMwLjIyNDYsLTAuMjA3MDMgMC4zNDczMywtMC40NzQ0NCAwLjM2NzQxLC0wLjc5MDE2YzAuMDIwNjUsLTAuMzI0NzEgLTAuMjczMDEsLTAuNjE2MDIgLTAuNDA1NDMsLTAuNzQzNzdjLTAuNDcwMjgsLTAuNDUzNjYgLTAuODkwMjYsLTAuOTc3MDUgLTEuMzAzMTgsLTEuMzk1OTVjLTAuODA0NiwtMC44OTM0IC0yLjEwNTAzLDAuMjEyMTMgLTEuMzAwNDMsMS4xMDU1MmwwLjAwMDAxLC0wLjAwMDExeiIgaWQ9InN2Z18zMSIvPgogICA8cGF0aCBzdHJva2U9Im51bGwiIHN0cm9rZS13aWR0aD0iMC41MjQxNiIgZmlsbD0iIzIwYjBlMyIgIGQ9Im0yMi4wMjE4OSwxMi4xMjI1MWMtMC4xODU0NywwLjE4NzQ5IC0wLjM4MDQ4LDAuMzcwNzMgLTAuNTU1OTksMC41NjY5NWMtMC4zMDQ5MywwLjM0MDkzIC0wLjU3MTAzLDAuNTk0NDkgLTAuODUwOTcsMC44OTgxMmMwLjA2NTY2LC0wLjU1NDUxIC0wLjY2NjQsLTAuNTk0OTEgLTAuMDM3OTEsLTAuODcyMzNjMC4yMDgzMSwwLjIwNzEzIDAuNDgwOTgsMC40Mzg3NyAwLjY5NTIxLDAuNjA3MTNjMC4xOTk5NywwLjE1NzE1IDAuNDQwNTMsMC4zMzI4NiAwLjYzMDg1LDAuNDcyNzRjMC45NzQ0MiwwLjcxNjIyIC0wLjExNTQzLDIuMDEyMDcgLTEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIC0xLjAyMTMyLC0wLjc2MjE0IC0xLjQzNDA4LC0xLjE0MjU5Yy0wLjIyNDYxLC0wLjIwNzAzIC0wLjM0NzM0LC0wLjQ3NDQ0IC0wLjM2NzQyLC0wLjc5MDE2Yy0wLjAyMDY0LC0wLjMyNDcxIDAuMjczMDEsLTAuNjE2MDIgMC40MDU0NCwtMC43NDM3N2MwLjQ3MDI4LC0wLjQ1MzY2IDAuODkwMjYsLTAuOTc3MDUgMS4zMDMxOCwtMS4zOTU5NWMwLjgwNDYsLTAuODkzNCAyLjEwNTAzLDAuMjEyMTMgMS4zMDA0MywxLjEwNTUybDAuMDAwMDIsLTAuMDAwMTF6IiBpZD0ic3ZnXzMyIi8+CiAgPC9nPgogIDxwYXRoIGlkPSJzdmdfMSIgZD0ibTI2LjYyMyw5Ljg1OWwwLjQ0LC01LjQzYzAuMDIyLC0wLjI3NCAwLjI2NSwtMC40OCAwLjUzOSwtMC40NThsMC4wMywwLjAwMmMwLjI3NCwwLjAyMiAwLjQ4LDAuMjY1IDAuNDU4LDAuNTM5bC0wLjQ0LDUuNDNjLTAuMDIyLDAuMjc0IC0wLjI2NSwwLjQ4IC0wLjUzOSwwLjQ1OGwtMC4wMywtMC4wMDJjLTAuMjc1LC0wLjAyMyAtMC40ODEsLTAuMjY1IC0wLjQ1OCwtMC41Mzl6IiBmaWxsPSIjNjY3NTdGIi8+CiAgPHBhdGggaWQ9InN2Z18yIiBkPSJtMTQuNDU3LDIwLjU0OGwwLDIuMDZzLTIuMDYsMCAtMi4wNiwyLjA2bDAsMy4wOWMwLDEuMDMgMS4wMywyLjA2IDIuMDYsMi4wNmwxMC4zMDIsMGMxLjAzLDAgMi4wNiwtMS4wMyAyLjA2LC0yLjA2bDAsLTUuMTUxYzAsLTEuMDMgLTEuMDMsLTIuMDYgLTIuMDYsLTIuMDZsLTEwLjMwMiwwLjAwMXoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzMiIGQ9Im0yMS42MjIsMjIuMTU0bC0xMC4xNDUsLTEuNzg5Yy0xLjAxNCwtMC4xNzkgLTEuMDE0LC0wLjE3OSAtMC44MzYsLTEuMTkzYzAuMDk4LC0wLjU1OCAwLjYzNSwtMC45MzQgMS4xOTMsLTAuODM2bDEwLjE0NSwxLjc4OWMwLjU1OCwwLjA5OCAwLjkzNCwwLjYzNSAwLjgzNiwxLjE5M2MtMC4xNzgsMS4wMTUgLTAuMTc4LDEuMDE1IC0xLjE5MywwLjgzNnoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzQiIGQ9Im0yMy45NzQsMTguNTExYy0wLjE5OSwwLjk0OSAtMC41NzQsMS44ODIgLTIuMTU3LDEuNTgzYy0xLjU4MywtMC4yOTggLTEuODM2LDEuMjYyIC0wLjg0OSwxLjUzOGMwLjk4NywwLjI3NSAzLjM1LDAuNjY2IDQuMDM5LC0wLjQ1OWMwLjY4OCwtMS4xMjQgMC44MDMsLTIuMjAzIDAuNzM0LC0yLjY4NWMtMC4wNjksLTAuNDgxIC0xLjYyLC0wLjY3OSAtMS43NjcsMC4wMjN6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z181IiBkPSJtMjIuMTM3LDIyLjUwNGwtMTEuMTg5LC0xLjk3M2MtMC4yNzEsLTAuMDQ4IC0wLjQ1MywtMC4zMDggLTAuNDA2LC0wLjU3OWwwLjAwNSwtMC4wM2MwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwxMS4xODksMS45NzNjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41NzlsLTAuMDA1LDAuMDNjLTAuMDQ3LDAuMjcxIC0wLjMwOCwwLjQ1MyAtMC41NzksMC40MDZ6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z182IiBkPSJtMjcuNzc4LDguODQ4bC0xLjc4OSwxMC4xNDVjLTAuMTc5LDEuMDE0IC0wLjE3OSwxLjAxNCAtMS4xOTMsMC44MzZjLTAuNTU4LC0wLjA5OCAtMC45MzQsLTAuNjM1IC0wLjgzNiwtMS4xOTNsMS43ODksLTEwLjE0NmMwLjA5OCwtMC41NTggMC42MzUsLTAuOTM0IDEuMTkzLC0wLjgzNmMxLjAxNSwwLjE3OSAxLjAxNSwwLjE3OSAwLjgzNiwxLjE5NHptMS4wMjIsLTcuNzE2bC0wLjczNCw0LjE0NmMtMC4wOSwwLjUwOCAtMC4xNzMsMS4wMzggLTEuMTg4LDAuODU5Yy0wLjU1OCwtMC4wOTkgLTAuOTA4LC0wLjczNyAtMC43ODYsLTEuNDQxbDAuNjU4LC0zLjcxOGMwLjE2OCwtMC41OTcgMC42NDUsLTEuMDM0IDEuMjAzLC0wLjkzNmMxLjAxNCwwLjE4IDAuOTM3LDAuNTgyIDAuODQ3LDEuMDl6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z183IiBkPSJtMjguMjcsOC40MDJsLTEuOTczLDExLjE4OWMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDUzIC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMS45NzMsLTExLjE4OWMwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwwLjAzLDAuMDA1YzAuMjcxLDAuMDQ4IDAuNDUzLDAuMzA4IDAuNDA2LDAuNTc5em0xLjI4LC03LjY4bC0wLjk0Myw1LjM2NmMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDU0IC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMC45NDMsLTUuMzY2YzAuMDQ4LC0wLjI3MSAwLjMwOCwtMC40NTMgMC41NzksLTAuNDA2bDAuMDMsMC4wMDVjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41Nzl6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z184IiBkPSJtMjQuMjM3LDE3LjkxMmwtNy42OTEsLTEuMzU2Yy0wLjc2OSwtMC4xMzYgLTAuNzY5LC0wLjEzNiAtMC42MzUsLTAuODk1YzAuMDc0LC0wLjQxOCAwLjQ4LC0wLjY5OCAwLjkwMywtMC42MjRsNy42OTEsMS4zNTZjMC40MjMsMC4wNzUgMC43MDksMC40NzcgMC42MzUsMC44OTVjLTAuMTM0LDAuNzU5IC0wLjEzNCwwLjc1OSAtMC45MDMsMC42MjR6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z185IiBkPSJtMjEuNzk0LDIxLjM5N2MxLjAyMywwLjE4IDMuMDQzLDAuNTM3IDMuNTgsLTIuNTA3YzAuNTM3LC0zLjA0MyAxLjU1MSwtMi44NjUgMS4wMTQsMC4xNzlzLTIuMzA0LDMuNzc4IC00Ljc3MywzLjM0MmMtMi4wMjksLTAuMzU3IC0xLjg1LC0xLjM3MiAwLjE3OSwtMS4wMTR6bS0xMC42NDEsLTEuODc2YzIuMDMsMC4zNSAyLjM0NSwxLjQ2NSAwLjMxNywxLjEwMmMtMC44OTksLTAuMTYxIC0xLjAxNCwwLjIxOCAtMS4yODksMC45ODdjLTAuMjU5LDAuNzIzIC0wLjYzLDEuODEgLTEuMTc4LDMuMzI4Yy0wLjQwMywxLjExNSAtMS4zMTcsMC42MjEgLTAuOTc5LC0wLjM1MmMwLjU2OCwtMS42MzYgMS4wOTMsLTMuMDU4IDEuNDM0LC0zLjk2MmMwLjM0OCwtMC45MjQgMC42MzIsLTEuMjg2IDEuNjk1LC0xLjEwM3oiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzEwIiBkPSJtOC45MjksMjMuNjU0bC0wLjAyOSwtMC4wMTFjLTAuMjU4LC0wLjA5NCAtMC41NDcsMC4wNCAtMC42NDEsMC4yOTlsLTIuMTI0LDUuODM2Yy0wLjA5NCwwLjI1OCAwLjA0LDAuNTQ3IDAuMjk5LDAuNjQxbDAuMDI4LDAuMDFjMC4yNTgsMC4wOTQgMC41NDcsLTAuMDQgMC42NDEsLTAuMjk5bDIuMTI0LC01LjgzNmMwLjA5NCwtMC4yNTggLTAuMDQsLTAuNTQ2IC0wLjI5OCwtMC42NHoiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzExIiBkPSJtNi40NjIsMzAuNDNsLTMuOSwtMS40MmMtMC4yNTgsLTAuMDk0IC0wLjM5MywtMC4zODIgLTAuMjk5LC0wLjY0MWwwLjAxLC0wLjAyOGMwLjA5NCwtMC4yNTggMC4zODIsLTAuMzkzIDAuNjQxLC0wLjI5OWwzLjksMS40MmMwLjI1OCwwLjA5NCAwLjM5MywwLjM4MiAwLjI5OSwwLjY0MWwtMC4wMSwwLjAyOGMtMC4wOTQsMC4yNTggLTAuMzgyLDAuMzkzIC0wLjY0MSwwLjI5OXoiIGZpbGw9IiM2Njc1N0YiLz4KICA8cGF0aCBpZD0ic3ZnXzEyIiBkPSJtMTIuMjI1LDMwLjcxOGwzLjA2LC0zLjA2YzAuMTk0LC0wLjE5NCAwLjE5NCwtMC41MTMgMCwtMC43MDdsLTAuMDIxLC0wLjAyMWMtMC4xOTQsLTAuMTk0IC0wLjUxMywtMC4xOTQgLTAuNzA3LDBsLTMuMDYsMy4wNmMtMC4xOTQsMC4xOTQgLTAuMTk0LDAuNTEzIDAsMC43MDdsMC4wMjEsMC4wMjFjMC4xOTQsMC4xOTQgMC41MTIsMC4xOTQgMC43MDcsMHptMTguNzQ0LDMuMjIybC0wLjA2LDBjLTAuNTUsMCAtMSwtMC40NSAtMSwtMWwwLC0zLjE1MWMwLC0wLjU1IDAuNDUsLTEgMSwtMWwwLjA2LDBjMC41NSwwIDEsMC40NSAxLDFsMCwzLjE1MWMwLDAuNTUgLTAuNDUsMSAtMSwxeiIgZmlsbD0iI0REMkU0NCIvPgogIDxwYXRoIGlkPSJzdmdfMTMiIGQ9Im0xMS45MTEsMzMuOTRsLTAuMDYsMGMtMC41NSwwIC0xLC0wLjQ1IC0xLC0xbDAsLTMuMTUxYzAsLTAuNTUgMC40NSwtMSAxLC0xbDAuMDYsMGMwLjU1LDAgMSwwLjQ1IDEsMWwwLDMuMTUxYzAsMC41NSAtMC40NSwxIC0xLDF6bTEzLjMyOSwtNi4xODZsMi4wOSwwYzAuMjc1LDAgMC41LC0wLjIyNSAwLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IC0wLjIyNSwtMC41IC0wLjUsLTAuNWwtMi4wOSwwYy0wLjI3NSwwIC0wLjUsMC4yMjUgLTAuNSwwLjVsMCwwLjAzYzAsMC4yNzUgMC4yMjUsMC41IDAuNSwwLjV6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNCIgZD0ibTMwLjA0NywzMC42NTdsLTMuMDYsLTMuMDZjLTAuMTk0LC0wLjE5NCAtMC4xOTQsLTAuNTEzIDAsLTAuNzA3bDAuMDIxLC0wLjAyMWMwLjE5NCwtMC4xOTQgMC41MTMsLTAuMTk0IDAuNzA3LDBsMy4wNiwzLjA2YzAuMTk0LDAuMTk0IDAuMTk0LDAuNTEzIDAsMC43MDdsLTAuMDIxLDAuMDIxYy0wLjE5NSwwLjE5NSAtMC41MTMsMC4xOTUgLTAuNzA3LDB6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNSIgZD0ibTkuOTk4LDE1LjUyOGMwLjc2NSwwLjMyOCAyLjExMSwwLjk2NCAyLjQxLDEuMDc5YzAsMCAwLjEzOCwtMC45MTggMC41MDUsLTAuOTE4YzAsMCAwLjEzOCwtMC40ODIgMC4yMjksLTAuNjg4YzAuMDkyLC0wLjIwNyAwLjM2NywtMC4xMzggMC4zOSwwLjI1MmMwLjAyMywwLjM5IC0wLjA5MiwwLjUyOCAtMC4wOTIsMC41MjhzMC4zNDQsMC40MzYgMC4xMzgsMS4wMzNjMCwwIDAuNDU5LDAuMDY5IDAuMzY3LDAuNjQzYy0wLjA5MiwwLjU3NCAwLjA2OSwxLjAxIC0wLjM0NCwxLjEyNGMtMC40MTMsMC4xMTUgLTEuOTc0LDAuNTUxIC0xLjk5NywtMC4wNjljLTAuMDIzLC0wLjYyIC0wLjQxMywtMS4xMDIgLTEuMTcsLTEuNTYxYy0wLjc1NywtMC40NTkgLTEuMzA4LC0wLjk2NCAtMS4yMTYsLTEuMjE2YzAuMDkxLC0wLjI1MyAwLjEzNywtMC40ODIgMC43OCwtMC4yMDd6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z18xNiIgZD0ibTI1LjI4OCwyNC42NjhsLTExLjM2MSwwYy0wLjI3NSwwIC0wLjUsLTAuMjI1IC0wLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IDAuMjI1LC0wLjUgMC41LC0wLjVsMTEuMzYyLDBjMC4yNzUsMCAwLjUsMC4yMjUgMC41LDAuNWwwLDAuMDNjLTAuMDAxLDAuMjc1IC0wLjIyNiwwLjUgLTAuNTAxLDAuNXoiIGZpbGw9IiNERDJFNDQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMTciIHI9IjQuNjM2IiBjeT0iMzEuMzY0IiBjeD0iMjAuMTIyIiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzE4IiByPSIyLjU3NSIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzY2NzU3RiIvPgogIDxjaXJjbGUgaWQ9InN2Z18xOSIgcj0iMi4wNiIgY3k9IjMzLjk0IiBjeD0iMzAuOTM5IiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzIwIiByPSIyLjU3NSIgY3k9IjMxLjM2NCIgY3g9IjIwLjEyMiIgZmlsbD0iI0NDRDZERCIvPgogIDxjaXJjbGUgaWQ9InN2Z18yMSIgcj0iMS41NDUiIGN5PSIzMy40MjUiIGN4PSIxMS44ODEiIGZpbGw9IiNDQ0Q2REQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMjIiIHI9IjEuMDMiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzI5MkYzMyIvPgogIDxnIGlkPSJzdmdfMjMiIGZpbGw9IiMyOTJGMzMiPgogICA8Y2lyY2xlIGlkPSJzdmdfMjQiIHI9IjAuNTE1IiBjeT0iMzAuNDcyIiBjeD0iMjAuNjM4Ii8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNSIgcj0iMC41MTUiIGN5PSIzMi4yNTYiIGN4PSIxOS42MDciLz4KICAgPGNpcmNsZSBpZD0ic3ZnXzI2IiByPSIwLjUxNSIgY3k9IjMwLjg0OSIgY3g9IjE5LjIzIi8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNyIgcj0iMC41MTUiIGN5PSIzMS44NzkiIGN4PSIyMS4wMTUiLz4KICA8L2c+CiAgPGNpcmNsZSBpZD0ic3ZnXzI4IiByPSIwLjc3MyIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzI5MkYzMyIvPgogIDxjaXJjbGUgaWQ9InN2Z18yOSIgcj0iMC41MTUiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzY2NzU3RiIvPgogPC9nPgo8L3N2Zz4=
// @homepageURL     https://github.com/ADJazzzz/BLSPAM
// @supportURL      https://github.com/ADJazzzz/BLSPAM/issues
// @match           *://live.bilibili.com/*
// @require         https://cdn.jsdelivr.net/npm/vue@3.5.21/dist/vue.global.prod.js
// @require         data:application/javascript,window.Vue%3DVue%3Bwindow.VueDemi%3DVue
// @require         https://cdn.jsdelivr.net/npm/pinia@3.0.3/dist/pinia.iife.prod.js
// @require         https://cdn.jsdelivr.net/npm/naive-ui@2.42.0/dist/index.prod.js
// @require         https://cdn.jsdelivr.net/npm/axios@1.11.0/dist/axios.min.js
// @require         https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @connect         api.bilibili.com
// @connect         api.live.bilibili.com
// @connect         live.bilibili.com
// @connect         api.github.com
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/481738/Bilibili-Live-Spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/481738/Bilibili-Live-Spamer.meta.js
// ==/UserScript==

(function (vue, pinia$1, naive, _, axios) {
  'use strict';

  const dq = document.querySelector.bind(document);
  document.querySelectorAll.bind(document);
  const dce = document.createElement.bind(document);
  const pollingQuery = (element, selectors, interval, timeout, immediate) => {
    return new Promise((resolve, reject) => {
      {
        const ele = element.querySelector(selectors);
        if (ele) {
          resolve(ele);
          return;
        }
      }
      const timerPolling = setInterval(() => {
        const ele = element.querySelector(selectors);
        if (ele) {
          clearTimeout(timerPolling);
          resolve(ele);
        }
      }, interval);
      const timerTimeout = setTimeout(() => {
        clearTimeout(timerPolling);
        clearTimeout(timerTimeout);
        reject();
      }, timeout);
    });
  };
  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const defaultValues = {
    ui: {
      activeMenuIndex: "TextView",
      isShowPanel: false,
      isCollapsed: false,
      theme: "light"
    },
    modules: {
      TextSpam: {
        enable: false,
        msg: "车了可能会被禁，但不车就等于一直被禁",
        timeinterval: 3,
        textinterval: 20,
        timelimit: 0
      },
      EmotionSpam: {
        enable: false,
        timeinterval: 3,
        emotionViewSelectedID: 1,
        msg: [],
        timelimit: 0
      },
      TextGroupSpam: {
        enable: false,
        timeinterval: 3,
        textGroupTabsValue: 1,
        textGroupTabPanels: [
          {
            key: 1,
            name: 1,
            tab: "第一个",
            msg: ""
          }
        ]
      },
      setting: {
        saveSpamerStatus: {
          enable: false
        },
        autoCheckUpdate: {
          enable: true
        },
        danmakuModules: {
          enable: false
        },
        danmakuDetail: {
          enable: true
        }
      }
    }
  };
  class Storage {
    static mergeConfigs(current_config_item, default_config_item) {
      const cleanConfig = _.pick(current_config_item, Object.keys(default_config_item));
      const result = {};
      Object.keys(default_config_item).forEach((key) => {
        if (_.isPlainObject(default_config_item[key])) {
          result[key] = this.mergeConfigs(cleanConfig[key], default_config_item[key]);
        } else {
          result[key] = cleanConfig[key] !== void 0 ? cleanConfig[key] : default_config_item[key];
        }
      });
      return _.omitBy(result, _.isUndefined);
    }
    static setUiConfig(uiConfig2) {
      _GM_setValue("ui", uiConfig2);
    }
    static getUiConfig() {
      const currentUiConfig = _GM_getValue("ui", {});
      return this.mergeConfigs(currentUiConfig, defaultValues.ui);
    }
    static setModuleConfig(moduleConfig) {
      _GM_setValue("modules", moduleConfig);
    }
    static getModuleConfig() {
      const currentModuleConfig = _GM_getValue("modules", {});
      return this.mergeConfigs(currentModuleConfig, defaultValues.modules);
    }
  }
  const useUIStore = pinia$1.defineStore("ui", () => {
    const uiConfig2 = vue.reactive(Storage.getUiConfig());
    const updateMenuValue = (key) => {
      uiConfig2.activeMenuIndex = key;
    };
    vue.watch(
      uiConfig2,
      _.debounce((newUiConfig) => Storage.setUiConfig(newUiConfig), 350)
    );
    return { uiConfig: uiConfig2, updateMenuValue };
  });
  const useBiliStore = pinia$1.defineStore("bili", () => {
    const cookies = vue.ref(null);
    const loginInfo = vue.ref(null);
    const emotionData = vue.ref([]);
    const BilibiliLive = vue.ref(null);
    const infoByuser = vue.ref(null);
    return { cookies, loginInfo, emotionData, BilibiliLive, infoByuser };
  });
  function mitt(n) {
    return { all: n = n || new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }
  class Logger {
    NAME = "BLSPAM";
    prefix_title_str;
    title;
    get prefix() {
      return [
        `%c${this.NAME}%c[${this.prefix_title_str}]%c:`,
        "font-weight: bold; color: white; background-color: #23ade5; padding: 1px 4px; border-radius: 4px;",
        "font-weight: bold; color: #0093D3;",
        "font-weight: bold;"
      ];
    }
    log(...data) {
      console.log(...this.prefix, ...data);
    }
    error(...data) {
      console.error(...this.prefix, ...data);
    }
    warn(...data) {
      console.warn(...this.prefix, ...data);
    }
    constructor(title) {
      this.title = title;
      this.prefix_title_str = title.split("_").join("][");
    }
  }
  class BaseModule {
    moduleName;
    logger;
    constructor(moduleName) {
      this.moduleName = moduleName;
      this.logger = new Logger(this.moduleName);
    }
    moduleStore = useModuleStore();
    run() {
      throw new Error("Method not implemented.");
    }
  }
  class Cookies extends BaseModule {
    getCookiesValue() {
      return new Promise((resolve, reject) => {
        const cookieNames = ["bili_jct"];
        const cookieValues = {};
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (cookieNames.includes(name)) {
            cookieValues[name] = value;
          }
        }
        if (Object.keys(cookieValues).length === cookieNames.length) {
          resolve(cookieValues);
        } else {
          reject(new Error(`没找到cookies`));
        }
      });
    }
    async run() {
      useBiliStore().cookies = await this.getCookiesValue();
    }
  }
  axios.defaults.withCredentials = true;
  const BILIAPI = {
    sendMsg: (msg, roomid, bubble = 0, color = 16777215, mode = 1, room_type = 0, jumpfrom = 0, reply_mid = 0, reply_attr = 0, reply_dmid = "", statistics = { appId: 100, platform: 5 }, fontsize = 25, reply_type = 0, reply_uname = "", data_extend = { trackid: "-99998" }) => {
      const biliStore = useBiliStore();
      const bili_jct = biliStore.cookies.bili_jct;
      const timestamp = () => Date.parse(( new Date()).toString()) / 1e3;
      return axios.post(
        "https://api.live.bilibili.com/msg/send",
        {
          msg,
          roomid,
          bubble,
          color,
          mode,
          room_type,
          jumpfrom,
          reply_mid,
          reply_attr,
          reply_dmid,
          fontsize,
          statistics: JSON.stringify(statistics),
          reply_type,
          reply_uname,
          data_extend: JSON.stringify(data_extend),
          rnd: timestamp(),
          csrf: bili_jct,
          csrf_token: bili_jct
        },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
    },
    sendEmotion: (msg, roomid, bubble = 0, color = 16777215, mode = 1, dm_type = 1, fontsize = 25, data_extend = { trackid: "-99998" }) => {
      const biliStore = useBiliStore();
      const bili_jct = biliStore.cookies.bili_jct;
      const timestamp = () => Date.parse(( new Date()).toString()) / 1e3;
      return axios.post(
        "https://api.live.bilibili.com/msg/send",
        {
          msg,
          roomid,
          bubble,
          color,
          mode,
          dm_type,
          fontsize,
          data_extend: JSON.stringify(data_extend),
          rnd: timestamp(),
          csrf: bili_jct,
          csrf_token: bili_jct
        },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
    },
    async getEmoticons(platform = "pc", room_id) {
      const res = await axios.get(
        `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=${platform}&room_id=${room_id}`
      );
      return res.data;
    },
    async nav() {
      const res = await axios.get("https://api.bilibili.com/x/web-interface/nav");
      return res.data;
    },
    async getInfoByUser(room_id) {
      const res = await axios.get(
        `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${room_id}`
      );
      return res.data;
    }
  };
  class UserInfo extends BaseModule {
    async getLoginInfo() {
      try {
        const response = await BILIAPI.nav();
        if (response.code === 0) {
          this.logger.log("LoginInfo", response);
          return Promise.resolve(response.data);
        } else {
          this.logger.error("获取登陆信息出错", response.message);
          return Promise.reject(response.message);
        }
      } catch (error) {
        this.logger.error("获取登陆信息出错", error);
        return Promise.reject(error);
      }
    }
    getWindowBiliLive() {
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          const windowBiliLive = _unsafeWindow.BilibiliLive;
          if (windowBiliLive) {
            clearInterval(timer);
            this.logger.log("windowBiliLive", windowBiliLive);
            resolve(windowBiliLive);
          }
        }, 200);
      });
    }
    async getEmotionData() {
      const roomID = useBiliStore().BilibiliLive?.ROOMID;
      if (!roomID) {
        this.logger.error("获取用户信息出错", "roomID 不存在");
        return Promise.reject("roomID 不存在");
      }
      const EmotionData = [];
      try {
        const response = await BILIAPI.getEmoticons("pc", roomID);
        if (response.code === 0) {
          this.logger.log("EmotionData", response);
          EmotionData.push(...response.data.data);
          return Promise.resolve(EmotionData);
        } else {
          this.logger.error("获取表情包出错", response.message);
          return Promise.reject(response.message);
        }
      } catch (error) {
        this.logger.error("获取表情包出错", error);
        return Promise.reject(error);
      }
    }
    async getInfoByUser() {
      const roomID = useBiliStore().BilibiliLive?.ROOMID;
      if (!roomID) {
        this.logger.error("获取用户信息出错", "roomID 不存在");
        return Promise.reject("roomID 不存在");
      }
      try {
        const response = await BILIAPI.getInfoByUser(roomID);
        if (response.code === 0) {
          this.logger.log("infoByuser", response);
          return Promise.resolve(response.data);
        } else {
          this.logger.error("获取用户信息出错", response.message);
          return Promise.reject(response.message);
        }
      } catch (error) {
        this.logger.error("获取用户信息出错", error);
        return Promise.reject(error);
      }
    }
    async run() {
      useBiliStore().BilibiliLive = await this.getWindowBiliLive();
      if (useBiliStore().BilibiliLive) {
        useBiliStore().emotionData = await this.getEmotionData();
      }
      useBiliStore().loginInfo = await this.getLoginInfo();
      useBiliStore().infoByuser = await this.getInfoByUser();
    }
  }
  const defaultModules = Object.freeze( Object.defineProperty({
    __proto__: null,
    Default_Cookies: Cookies,
    Default_UserInfo: UserInfo
  }, Symbol.toStringTag, { value: "Module" }));
  function useDiscreteAPI(apis, disable = false) {
    if (disable) {
      const emptyAPI = {};
      apis.forEach((api) => {
        emptyAPI[api] = new Proxy(
          {},
          {
            get: () => () => {
            }
          }
        );
      });
      return emptyAPI;
    }
    const uiStore = useUIStore();
    const discreteAPIConfig = vue.computed(() => ({
      theme: uiStore.uiConfig.theme === "dark" ? naive.darkTheme : naive.lightTheme
    }));
    const options = {
      configProviderProps: discreteAPIConfig
    };
    return naive.createDiscreteApi(apis, options);
  }
  class TextSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextSpam;
    intervalId = null;
    msgSlices = [];
    formatMsg(msg) {
      return msg.replace(/\n/g, "");
    }
    formatTime(time) {
      return time * 1e3;
    }
    cleanUP() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.msgSlices = [];
    }
    async cycleSendDanmu(msg, roomid, timeinterval, textinterval, timelimit) {
      const sendMsg = async (message) => {
        try {
          const response = await BILIAPI.sendMsg(message, roomid);
          const { notification } = useDiscreteAPI(
            ["notification"],
            !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
          );
          if (response.data.code === 0) {
            this.logger.log(`弹幕 ${message} 发送成功`, response);
          } else {
            this.logger.error(`弹幕 ${message} 发送失败`, response);
            notification.error({
              closable: false,
              content: `弹幕"${message}"发送失败: ${response.data.message}`,
              duration: 3e3
            });
          }
        } catch (error) {
          this.logger.error(`弹幕 ${message} 发送失败`, error);
        }
      };
      if (msg.length < textinterval) {
        const sendNext = async () => {
          if (this.config.enable) {
            await sendMsg(msg);
          } else {
            this.cleanUP();
          }
        };
        await sendNext();
        this.intervalId = setInterval(sendNext, timeinterval);
      } else {
        for (let i = 0; i < msg.length; i += textinterval) {
          this.msgSlices.push(msg.slice(i, i + textinterval));
        }
        let currentIndex = 0;
        const sendNextSlice = async () => {
          if (this.config.enable) {
            if (currentIndex < this.msgSlices.length) {
              await sendMsg(this.msgSlices[currentIndex]);
              currentIndex++;
            }
            if (currentIndex >= this.msgSlices.length) {
              currentIndex = 0;
            }
          } else {
            this.cleanUP();
          }
        };
        await sendNextSlice();
        this.intervalId = setInterval(sendNextSlice, timeinterval);
      }
      if (timelimit !== 0) {
        setTimeout(() => {
          this.config.enable = false;
          this.cleanUP();
          this.logger.log("文字独轮车已停止");
        }, timelimit);
      }
    }
    stop() {
      this.config.enable = false;
      this.cleanUP();
      this.logger.log("文字独轮车已停止");
    }
    async run() {
      this.moduleStore.emitter.off("TextSpam");
      this.cleanUP();
      this.moduleStore.emitter.on("TextSpam", async () => {
        const formattedMsg = this.formatMsg(this.config.msg);
        const roomid = useBiliStore().BilibiliLive?.ROOMID;
        const timeinterval = this.formatTime(this.config.timeinterval);
        const textinterval = this.config.textinterval;
        const formattedTime = this.formatTime(this.config.timelimit);
        if (roomid) {
          await this.cycleSendDanmu(
            formattedMsg,
            roomid,
            timeinterval,
            textinterval,
            formattedTime
          );
        }
      });
    }
  }
  class EmotionSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.EmotionSpam;
    intervalId = null;
    formatTime(time) {
      return time * 1e3;
    }
    cleanUP() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    async cycleSendEmotion(emotions, roomid, timeinterval, timelimit) {
      let currentIndex = 0;
      const sendEmotion = async (emotion) => {
        try {
          const response = await BILIAPI.sendEmotion(emotion, roomid);
          const { notification } = useDiscreteAPI(
            ["notification"],
            !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
          );
          if (response.data.code === 0) {
            this.logger.log(`表情 ${emotion} 发送成功`, response);
          } else {
            this.logger.error(`表情 ${emotion} 发送失败`, response);
            notification.error({
              closable: false,
              content: `表情"${emotion}"发送失败: ${response.data.message}`,
              duration: 3e3
            });
          }
        } catch (error) {
          this.logger.error(`表情 ${emotion} 发送失败`, error);
        }
      };
      const sendNextEmotion = async () => {
        if (this.config.enable) {
          if (currentIndex < emotions.length) {
            await sendEmotion(emotions[currentIndex]);
            currentIndex++;
          }
          if (currentIndex >= emotions.length) {
            currentIndex = 0;
          }
        } else {
          this.cleanUP();
        }
      };
      await sendNextEmotion();
      this.intervalId = setInterval(sendNextEmotion, timeinterval);
      if (timelimit !== 0) {
        setTimeout(() => {
          this.config.enable = false;
          this.cleanUP();
          this.logger.log("表情独轮车已停止");
        }, timelimit);
      }
    }
    stop() {
      this.config.enable = false;
      this.cleanUP();
      this.logger.log("表情独轮车已停止");
    }
    async run() {
      this.moduleStore.emitter.off("EmotionSpam");
      this.cleanUP();
      this.moduleStore.emitter.on("EmotionSpam", async () => {
        const msg = this.config.msg;
        const roomid = useBiliStore().BilibiliLive?.ROOMID;
        const formattedTimeInterval = this.formatTime(this.config.timeinterval);
        const formattedTime = this.formatTime(this.config.timelimit);
        if (roomid) {
          await this.cycleSendEmotion(msg, roomid, formattedTimeInterval, formattedTime);
        }
      });
    }
  }
  class TextGroupSpamer extends BaseModule {
    config = this.moduleStore.moduleConfig.TextGroupSpam;
    intervalId = null;
    formatMsg() {
      const slicedMsg = _.flatMap(this.config.textGroupTabPanels, (items) => {
        if (items.msg) {
          const processedMsg = items.msg.replace(/\n/g, "");
          if (processedMsg.length > 20) {
            return processedMsg.match(/.{1,20}/g) || [];
          } else {
            return [processedMsg];
          }
        }
        return [];
      });
      return slicedMsg;
    }
    formatTime(time) {
      return time * 1e3;
    }
    cleanUP() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    async cycleSendDanmuGroup(msg, roomid, timeinterval) {
      let currentIndex = 0;
      const sendMsg = async (msg2) => {
        try {
          const response = await BILIAPI.sendMsg(msg2, roomid);
          const { notification } = useDiscreteAPI(
            ["notification"],
            !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
          );
          if (response.data.code === 0) {
            this.logger.log(`弹幕 ${msg2} 发送成功`, response);
          } else {
            this.logger.error(`弹幕 ${msg2} 发送失败`, response);
            notification.error({
              closable: false,
              content: `弹幕"${msg2}"发送失败: ${response.data.message}`,
              duration: 3e3
            });
          }
        } catch (error) {
          this.logger.error(`弹幕 ${msg2} 发送失败`, error);
        }
      };
      const sendNextMsg = async () => {
        if (this.config.enable) {
          if (currentIndex < msg.length) {
            await sendMsg(msg[currentIndex]);
            currentIndex++;
          }
          if (currentIndex >= msg.length) {
            currentIndex = 0;
          }
        } else {
          this.cleanUP();
        }
      };
      await sendNextMsg();
      this.intervalId = setInterval(sendNextMsg, timeinterval);
    }
    stop() {
      this.config.enable = false;
      this.cleanUP();
      this.logger.log("文字池独轮车已停止");
    }
    async run() {
      this.moduleStore.emitter.off("TextGroupSpam");
      this.cleanUP();
      this.moduleStore.emitter.on("TextGroupSpam", async () => {
        const msg = this.formatMsg();
        const roomid = useBiliStore().BilibiliLive?.ROOMID;
        const formattedTimeInterval = this.formatTime(this.config.timeinterval);
        if (roomid) {
          await this.cycleSendDanmuGroup(msg, roomid, formattedTimeInterval);
        }
      });
    }
  }
  class SaveSpamerStatus extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.saveSpamerStatus;
    async run() {
      if (this.config.enable) {
        this.logger.log("将恢复上次独轮车开关状态");
        setTimeout(() => {
          const modules = ["TextSpam", "EmotionSpam", "TextGroupSpam"];
          for (const module of modules) {
            if (this.moduleStore.moduleConfig[module].enable) {
              this.moduleStore.emitter.emit(module, { module });
              const { notification } = useDiscreteAPI(["notification"]);
              notification.create({
                content: "将恢复独轮车开关状态，如需关闭请到控制面板关闭并刷新网页",
                closable: false,
                duration: 6e3
              });
              break;
            }
          }
        }, 200);
      } else {
        this.moduleStore.moduleConfig.TextSpam.enable = false;
        this.moduleStore.moduleConfig.EmotionSpam.enable = false;
        this.moduleStore.moduleConfig.TextGroupSpam.enable = false;
      }
    }
  }
  class checkUpdate extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.autoCheckUpdate;
    async getLatestVersionRes() {
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          url: "https://api.github.com/repos/ADJazzzz/BLSPAM/releases/latest",
          nocache: true,
          method: "GET",
          responseType: "json",
          onload: (res) => {
            resolve(res);
          },
          onerror: (res) => {
            reject(res);
          }
        });
      });
    }
    getCurrentVersion() {
      return _GM_info.script.version;
    }
    compareVersion(curVer, latVer) {
      const curVerParts = curVer.split(".").map(Number);
      const latVerParts = latVer.split(".").map(Number);
      for (let i = 0; i < Math.max(curVerParts.length, latVerParts.length); i++) {
        const curVerPart = curVerParts[i] ?? 0;
        const latVerPart = latVerParts[i] ?? 0;
        if (curVerPart !== latVerPart) {
          return curVerPart > latVerPart ? 1 : -1;
        }
      }
      return 0;
    }
    async CheckUpdate(updateType) {
      const currentVersion = this.getCurrentVersion();
      const getGitHubAPI = (await this.getLatestVersionRes()).response;
      const compareRes = this.compareVersion(currentVersion, getGitHubAPI.tag_name);
      const { notification } = useDiscreteAPI(["notification"]);
      if (compareRes === 0) {
        this.logger.log("当前已是最新的版本");
        if (updateType === "manual") {
          notification.create({
            content: "当前已是最新的版本",
            closable: false,
            duration: 3e3
          });
        }
      } else if (compareRes === -1) {
        this.logger.log(`发现新版本：${getGitHubAPI.tag_name}`);
        notification.create({
          title: `发现新版本：${getGitHubAPI.tag_name}`,
          action: () => [
            vue.h(
              naive.NButton,
              {
                text: true,
                type: "info",
                style: "margin-right: 10px",
                onClick: () => _unsafeWindow.open(
                  "https://github.com/ADJazzzz/BLSPAM/blob/main/CHANGELOG.md"
                )
              },
              { default: () => "查看更新日志" }
            ),
            vue.h(
              naive.NButton,
              {
                text: true,
                type: "primary",
                style: "margin-right: 10px",
                onClick: () => _unsafeWindow.open(getGitHubAPI.assets[0].browser_download_url)
              },
              {
                default: () => "安装"
              }
            ),
            ...updateType === "auto" ? [
              vue.h(
                naive.NButton,
                {
                  text: true,
                  type: "error",
                  onClick: () => {
                    this.config.enable = false;
                    notification.destroyAll();
                  }
                },
                { default: () => "关闭检测" }
              )
            ] : []
          ]
        });
      }
    }
    async run() {
      if (this.config.enable) {
        await this.CheckUpdate("auto");
      }
    }
  }
  class danmakuModules extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.danmakuModules;
    async dmOB() {
      const dmArea = dq(".chat-items");
      if (dmArea) {
        new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutationsList2) => {
            Array.from(mutationsList2.addedNodes).forEach((node) => {
              if (node instanceof HTMLElement && node.classList.contains("chat-item") && node.classList.contains("danmaku-item") &&
(node.classList.length === 2 ||
node.classList.contains("chat-colorful-bubble") && node.classList.contains("has-bubble") && node.classList.length === 4 ||
node.classList.contains("has-bubble") && node.classList.length === 3)) {
                node.addEventListener("click", (event) => this.handleNodeClick(event));
              }
            });
          });
        }).observe(dmArea, { childList: true, subtree: false });
      }
    }
    handleNodeClick(event) {
      const clickedElement = event.target;
      if (clickedElement instanceof HTMLElement && clickedElement.classList.contains("danmaku-item-right")) {
        this.renderMenu(clickedElement.innerText);
      }
    }
    renderMenu(msg) {
      const dmMenu = dq(".danmaku-menu.p-fixed.ts-dot-4.a-move-in-top.p-relative.z-danmaku-menu");
      if (dmMenu) {
        dmMenu.querySelectorAll(".none-select").forEach((element) => {
          if (!element.querySelector(".dm-repeat")) {
            const dmRepeat = document.createElement("div");
            dmRepeat.style.cursor = "pointer";
            dmRepeat.style.padding = "10px";
            dmRepeat.addEventListener("click", () => this.dmRepeat(msg));
            dmRepeat.classList.add("dm-repeat");
            const ATag = document.createElement("a");
            ATag.style.color = "#23ade5";
            ATag.innerText = "弹幕+1";
            dmRepeat.appendChild(ATag);
            element.appendChild(dmRepeat);
          }
          if (!element.querySelector(".danmaku-copy")) {
            const danmakuCopy = document.createElement("div");
            danmakuCopy.style.cursor = "pointer";
            danmakuCopy.style.padding = "10px";
            danmakuCopy.addEventListener("click", () => this.dmCopy(msg));
            danmakuCopy.classList.add("danmaku-copy");
            const ATag = document.createElement("a");
            ATag.style.color = "#23ade5";
            ATag.innerText = "弹幕复制";
            danmakuCopy.appendChild(ATag);
            element.appendChild(danmakuCopy);
          }
        });
        new MutationObserver((mutationsList, observer) => {
          mutationsList.forEach((mutation) => {
            if (mutation.attributeName === "style") {
              if (dmMenu.style.display === "none") {
                dmMenu.querySelectorAll(".dm-repeat, .danmaku-copy").forEach((element) => {
                  element.remove();
                  observer.disconnect();
                });
              }
            }
          });
        }).observe(dmMenu, { attributes: true, attributeFilter: ["style"] });
      }
    }
    async dmRepeat(msg) {
      const roomid = useBiliStore().BilibiliLive?.ROOMID;
      if (roomid) {
        try {
          const response = await BILIAPI.sendMsg(msg, roomid);
          const { message, notification } = useDiscreteAPI(["message", "notification"]);
          if (response.data.code === 0) {
            this.logger.log(`弹幕 ${msg} 发送成功`, response);
            message.success(`弹幕 ${msg} 发送成功`, { duration: 2500 });
          } else {
            this.logger.error(`弹幕 ${msg} 发送失败`, response);
            notification.error({
              closable: false,
              content: `弹幕"${msg}"发送失败: ${response.data.message}`,
              duration: 3e3
            });
          }
        } catch (error) {
          this.logger.error(`弹幕 ${msg} 发送失败`, error);
        }
      }
    }
    async dmCopy(msg) {
      try {
        await navigator.clipboard.writeText(msg);
        const { message } = useDiscreteAPI(["message"]);
        message.success(`弹幕 ${msg} 已复制`, { duration: 2500 });
      } catch (error) {
        this.logger.log("复制到剪切板失败", error);
      }
    }
    async run() {
      if (this.config.enable) {
        this.dmOB();
      }
    }
  }
  const functionModules = Object.freeze( Object.defineProperty({
    __proto__: null,
    Danmaku_DanmakuModules: danmakuModules,
    Setting_AutoCheckUpdate: checkUpdate,
    Setting_SaveSpamerStatus: SaveSpamerStatus,
    Spamer_EmotionSpamer: EmotionSpamer,
    Spamer_TextGroupSpamer: TextGroupSpamer,
    Spamer_TextSpamer: TextSpamer
  }, Symbol.toStringTag, { value: "Module" }));
  const useModuleStore = pinia$1.defineStore("modules", () => {
    const moduleConfig = vue.reactive(Storage.getModuleConfig());
    const emitter = mitt();
    function loadDefaultModules() {
      const promiseArray = [];
      for (const [name, module] of Object.entries(defaultModules)) {
        promiseArray.push(new module(name).run());
      }
      return Promise.all(promiseArray);
    }
    function loadFunctionModules() {
      const promiseArray = [];
      for (const [name, module] of Object.entries(functionModules)) {
        promiseArray.push(new module(name).run());
      }
      return Promise.all(promiseArray);
    }
    async function loadModules() {
      const logger = new Logger("LoadModules");
      let errorCount = 0;
      let retryCount = 0;
      const maxRetries = 2;
      const retryDelay = 2e3;
      while (retryCount <= maxRetries) {
        try {
          await loadDefaultModules();
          break;
        } catch (error) {
          logger.error(`重试次数: ${retryCount + 1}`, error);
          errorCount++;
          retryCount++;
          if (retryCount <= maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else {
            logger.error("达到最大重试次数，终止运行");
            break;
          }
        }
      }
      if (errorCount <= maxRetries) {
        try {
          await loadFunctionModules();
        } catch (error) {
          logger.error("加载模块出错", error);
        }
      }
    }
    vue.watch(
      moduleConfig,
      _.debounce(
        (newModuleConfig) => Storage.setModuleConfig(newModuleConfig),
        350
      )
    );
    return { moduleConfig, loadModules, emitter };
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$c = {};
  const _hoisted_1$5 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "20px",
    height: "20px",
    viewBox: "0 0 20 20",
    version: "1.1"
  };
  function _sfc_render$5(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$5, [..._cache[0] || (_cache[0] = [
      vue.createStaticVNode('<g id="surface1"><path style="stroke:none;fill-rule:nonzero;fill:rgb(83.921569%, 54.509804%, 32.156863%);fill-opacity:1;" d="M 10 2.1875 C 14.308594 2.1875 17.8125 5.691406 17.8125 10 C 17.8125 14.308594 14.308594 17.8125 10 17.8125 C 5.691406 17.8125 2.1875 14.308594 2.1875 10 C 2.1875 5.691406 5.691406 2.1875 10 2.1875 M 10 0.625 C 4.820312 0.625 0.625 4.820312 0.625 10 C 0.625 15.179688 4.820312 19.375 10 19.375 C 15.179688 19.375 19.375 15.179688 19.375 10 C 19.375 4.820312 15.179688 0.625 10 0.625 Z M 10 0.625 "></path><path style="stroke:none;fill-rule:nonzero;fill:rgb(47.058824%, 30.196078%, 18.823529%);fill-opacity:1;" d="M 10 2.191406 C 14.304688 2.191406 17.808594 5.695312 17.808594 10 C 17.808594 14.304688 14.304688 17.808594 10 17.808594 C 5.695312 17.808594 2.191406 14.304688 2.191406 10 C 2.191406 5.695312 5.695312 2.191406 10 2.191406 M 10 1.726562 C 5.429688 1.726562 1.726562 5.429688 1.726562 10 C 1.726562 14.570312 5.429688 18.273438 10 18.273438 C 14.570312 18.273438 18.273438 14.570312 18.273438 10 C 18.273438 5.429688 14.570312 1.726562 10 1.726562 Z M 10 1.726562 "></path><path style="stroke:none;fill-rule:nonzero;fill:rgb(65.098039%, 37.254902%, 24.313725%);fill-opacity:1;" d="M 17.371094 12.109375 L 11.535156 10.210938 L 17.527344 8.265625 C 17.769531 8.179688 17.898438 7.917969 17.820312 7.675781 C 17.742188 7.433594 17.484375 7.300781 17.238281 7.371094 L 11.246094 9.320312 L 14.992188 4.160156 C 15.144531 3.953125 15.101562 3.65625 14.890625 3.507812 C 14.679688 3.355469 14.386719 3.398438 14.234375 3.609375 L 10.488281 8.769531 L 10.488281 2.320312 C 10.488281 2.058594 10.277344 1.851562 10.019531 1.851562 C 9.757812 1.851562 9.550781 2.058594 9.550781 2.320312 L 9.550781 8.769531 L 5.789062 3.589844 C 5.714844 3.488281 5.605469 3.421875 5.480469 3.402344 C 5.359375 3.382812 5.234375 3.414062 5.132812 3.488281 C 5.03125 3.558594 4.964844 3.671875 4.945312 3.792969 C 4.925781 3.917969 4.957031 4.042969 5.03125 4.140625 L 8.792969 9.320312 L 2.761719 7.359375 C 2.515625 7.289062 2.257812 7.421875 2.179688 7.664062 C 2.101562 7.90625 2.230469 8.167969 2.472656 8.253906 L 8.5 10.210938 L 2.617188 12.125 C 2.371094 12.203125 2.234375 12.46875 2.3125 12.714844 C 2.351562 12.832031 2.4375 12.929688 2.546875 12.988281 C 2.65625 13.042969 2.785156 13.054688 2.90625 13.015625 L 8.789062 11.101562 L 5.210938 16.027344 C 5.0625 16.234375 5.105469 16.53125 5.316406 16.679688 C 5.398438 16.742188 5.496094 16.769531 5.589844 16.769531 C 5.734375 16.769531 5.878906 16.703125 5.96875 16.578125 L 9.546875 11.648438 L 9.546875 17.648438 C 9.546875 17.90625 9.757812 18.117188 10.015625 18.117188 C 10.277344 18.117188 10.484375 17.90625 10.484375 17.648438 L 10.484375 11.648438 L 14.074219 16.585938 C 14.164062 16.710938 14.308594 16.78125 14.453125 16.78125 C 14.628906 16.78125 14.789062 16.679688 14.871094 16.523438 C 14.949219 16.367188 14.933594 16.179688 14.832031 16.035156 L 11.242188 11.097656 L 17.078125 12.996094 C 17.128906 13.011719 17.175781 13.019531 17.226562 13.019531 C 17.421875 13.019531 17.605469 12.890625 17.671875 12.695312 C 17.75 12.453125 17.617188 12.1875 17.371094 12.109375 Z M 10 11.511719 C 9.296875 11.511719 8.726562 10.941406 8.726562 10.238281 C 8.726562 9.53125 9.296875 8.960938 10 8.960938 C 10.703125 8.960938 11.273438 9.535156 11.273438 10.238281 C 11.273438 10.941406 10.703125 11.511719 10 11.511719 Z M 10 11.511719 "></path><path style="stroke:none;fill-rule:nonzero;fill:rgb(83.921569%, 54.509804%, 32.156863%);fill-opacity:1;" d="M 10 8.597656 C 9.09375 8.597656 8.363281 9.332031 8.363281 10.234375 C 8.363281 11.140625 9.09375 11.875 10 11.875 C 10.90625 11.875 11.636719 11.140625 11.636719 10.238281 C 11.636719 9.332031 10.90625 8.597656 10 8.597656 Z M 10 10.703125 C 9.742188 10.703125 9.535156 10.492188 9.535156 10.238281 C 9.535156 9.980469 9.742188 9.773438 10 9.773438 C 10.257812 9.773438 10.464844 9.980469 10.464844 10.238281 C 10.464844 10.492188 10.257812 10.703125 10 10.703125 Z M 10 10.703125 "></path><path style="stroke:none;fill-rule:nonzero;fill:rgb(47.058824%, 30.196078%, 18.823529%);fill-opacity:1;" d="M 10 9.773438 C 10.257812 9.773438 10.464844 9.980469 10.464844 10.234375 C 10.464844 10.492188 10.257812 10.699219 10 10.699219 C 9.742188 10.699219 9.535156 10.492188 9.535156 10.234375 C 9.535156 9.980469 9.742188 9.773438 10 9.773438 M 10 9.460938 C 9.570312 9.460938 9.222656 9.808594 9.222656 10.234375 C 9.222656 10.664062 9.570312 11.011719 10 11.011719 C 10.429688 11.011719 10.777344 10.664062 10.777344 10.234375 C 10.777344 9.808594 10.429688 9.460938 10 9.460938 Z M 10 9.460938 "></path></g>', 1)
    ])]);
  }
  const MainIcon = _export_sfc(_sfc_main$c, [["render", _sfc_render$5]]);
  const _sfc_main$b = {};
  const _hoisted_1$4 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function _sfc_render$4(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$4, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "#3B88C3",
        d: "M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#FFF",
        d: "M12.821 22.328c0 .703 0 1.785-1.311 1.785-.798 0-1.121-.436-1.311-1.158-.703.836-1.558 1.273-2.603 1.273-2.565 0-4.521-2.186-4.521-5.263 0-3.001 2.014-5.3 4.521-5.3 1.007 0 1.995.399 2.603 1.254.076-.665.646-1.14 1.311-1.14 1.311 0 1.311 1.083 1.311 1.786v6.763zm-4.844-.607c1.425 0 2.109-1.444 2.109-2.755s-.665-2.792-2.109-2.792c-1.501 0-2.166 1.482-2.166 2.792.001 1.31.684 2.755 2.166 2.755zm6.403-10.829c0-.912.57-1.52 1.368-1.52.798 0 1.368.608 1.368 1.52v3.723a3.96 3.96 0 0 1 2.603-.95c2.944 0 4.407 2.754 4.407 5.415 0 2.584-1.747 5.148-4.503 5.148-.93 0-1.994-.418-2.507-1.254-.171.722-.608 1.139-1.368 1.139-.798 0-1.368-.607-1.368-1.52V10.892zm4.883 10.829c1.425 0 2.128-1.482 2.128-2.755 0-1.292-.703-2.792-2.128-2.792-1.463 0-2.146 1.368-2.146 2.697-.001 1.33.645 2.85 2.146 2.85zm12.824-5.016c-.684 0-1.292-.532-2.165-.532-1.559 0-2.299 1.387-2.299 2.792 0 1.349.817 2.755 2.299 2.755.684 0 1.709-.57 2.032-.57.647 0 1.178.551 1.178 1.197 0 1.405-2.355 1.881-3.344 1.881-2.944 0-4.901-2.413-4.901-5.263 0-2.773 2.015-5.3 4.901-5.3 1.083 0 3.344.399 3.344 1.729 0 .57-.399 1.311-1.045 1.311z"
      }, null, -1)
    ])]);
  }
  const TextIcon = _export_sfc(_sfc_main$b, [["render", _sfc_render$4]]);
  const _sfc_main$a = {};
  const _hoisted_1$3 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function _sfc_render$3(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$3, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("circle", {
        cx: "18",
        cy: "18",
        r: "18",
        fill: "#FFCC4D"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#664500",
        d: "M16 16.958c-.419 0-.809-.265-.949-.684-.203-.599-1.018-2.316-2.051-2.316-1.062 0-1.888 1.827-2.051 2.316a1 1 0 1 1-1.897-.633c.125-.377 1.304-3.684 3.949-3.684s3.823 3.307 3.949 3.684a1 1 0 0 1-.95 1.317zm10 0a.999.999 0 0 1-.948-.684c-.203-.599-1.019-2.316-2.052-2.316-1.062 0-1.889 1.827-2.052 2.316a1 1 0 0 1-1.897-.633c.125-.377 1.304-3.684 3.948-3.684s3.823 3.307 3.948 3.684A1 1 0 0 1 26 16.958zm1.335 3.733a.501.501 0 0 0-.635-.029c-.039.029-3.922 2.9-8.7 2.9-4.766 0-8.662-2.871-8.7-2.9a.5.5 0 0 0-.729.657c.129.215 3.217 5.243 9.429 5.243s9.301-5.028 9.429-5.243a.499.499 0 0 0-.094-.628z"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#FFAC33",
        d: "M21.229 3.947c0 .24.03.472.082.696.425 2.643 3.364 5.431 5.47 6.197 1.665-.605 3.846-2.476 4.898-4.539A18.027 18.027 0 0 0 23.75.939a3.059 3.059 0 0 0-2.521 3.008zm-7.486 25.131c.057-.242.09-.494.09-.754a3.319 3.319 0 0 0-3.319-3.319 3.312 3.312 0 0 0-2.697 1.389 3.314 3.314 0 0 0-2.697-1.389 3.304 3.304 0 0 0-2.88 1.698 18.071 18.071 0 0 0 8.068 7.574c1.637-1.351 3.131-3.307 3.435-5.199zm20.558-3.436a2.29 2.29 0 0 0-4.062-.685 2.299 2.299 0 0 0-4.105 1.859c.307 1.905 2.348 3.896 3.909 4.561a18.045 18.045 0 0 0 4.258-5.735z"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#DD2E44",
        d: "M33.625 3.269A3.063 3.063 0 0 0 30.562.206a3.057 3.057 0 0 0-2.489 1.282 3.063 3.063 0 0 0-5.47 2.477c.426 2.643 3.364 5.431 5.47 6.197 2.106-.766 5.044-3.554 5.469-6.196.053-.225.083-.457.083-.697zM12.208 28.408a3.319 3.319 0 0 0-3.319-3.319 3.312 3.312 0 0 0-2.697 1.389 3.311 3.311 0 0 0-2.697-1.389 3.319 3.319 0 0 0-3.23 4.073c.461 2.863 3.644 5.884 5.926 6.714 2.282-.829 5.465-3.85 5.926-6.713.058-.244.091-.496.091-.755zm23.74-2.281a2.299 2.299 0 0 0-4.167-1.337 2.299 2.299 0 0 0-4.105 1.859c.319 1.983 2.524 4.076 4.105 4.65 1.58-.574 3.786-2.667 4.104-4.65.04-.168.063-.342.063-.522z"
      }, null, -1)
    ])]);
  }
  const EmotionIcon = _export_sfc(_sfc_main$a, [["render", _sfc_render$3]]);
  const _sfc_main$9 = {};
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xml:space": "preserve",
    viewBox: "0 0 128 128"
  };
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, [..._cache[0] || (_cache[0] = [
      vue.createStaticVNode('<path d="M88.24 9.65v-2.3c0-1.85 1.5-3.35 3.35-3.35h22.62c1.85 0 3.35 1.5 3.35 3.35v8.26c1.2 0 2.17.97 2.17 2.17V92.1H8.26V18.81c0-1.77 1.43-3.2 3.2-3.2h70.81c3.3 0 5.97-2.67 5.97-5.96" style="fill:#f3ab47;"></path><path d="M8.26 34.42v-4.43c0-1.62 1.31-2.94 2.94-2.94h105.6c1.62 0 2.94 1.31 2.94 2.94v4.43z" style="fill:#de7340;"></path><path d="M78.66 24.78v-2.3c0-1.85-1.5-3.35-3.35-3.35H52.69a3.35 3.35 0 0 0-3.35 3.35v2.3c0 3.29-2.67 5.96-5.96 5.96H11.46c-1.77 0-3.2 1.43-3.2 3.2v75.94h111.47V33.94c0-1.77-1.43-3.2-3.2-3.2H84.62c-3.29 0-5.96-2.67-5.96-5.96" style="fill:#ffca28;"></path><path d="M8.26 49.66v-4.54c0-1.62 1.31-2.94 2.94-2.94h105.6c1.62 0 2.94 1.31 2.94 2.94v4.43z" style="fill:#f3ab47;"></path><path d="M39.76 39.9v-2.3c0-1.85-1.5-3.35-3.35-3.35H13.79a3.35 3.35 0 0 0-3.35 3.35v8.26c-1.2 0-2.17.97-2.17 2.17v73.13c0 1.56 1.27 2.83 2.83 2.83h105.81c1.56 0 2.83-1.27 2.83-2.83v-72.1c0-1.77-1.43-3.2-3.2-3.2H45.72c-3.29 0-5.96-2.67-5.96-5.96" style="fill:#ffe36c;"></path><path d="M39.76 39.9v-2.3c0-1.85-1.5-3.35-3.35-3.35H13.79a3.35 3.35 0 0 0-3.35 3.35v8.26h35.29c-3.3 0-5.97-2.67-5.97-5.96" style="fill:#f44336;"></path><path d="M78.66 24.78v-2.3c0-1.85-1.5-3.35-3.35-3.35H52.69a3.35 3.35 0 0 0-3.35 3.35v2.3c0 3.29-2.67 5.96-5.96 5.96h41.25c-3.3 0-5.97-2.67-5.97-5.96" style="fill:#0288d1;"></path><path d="M117.56 15.07V7.35c0-1.85-1.5-3.35-3.35-3.35H91.59a3.35 3.35 0 0 0-3.35 3.35v2.3c0 2.41-1.44 4.49-3.5 5.42z" style="fill:#7cb342;"></path>', 8)
    ])]);
  }
  const TextGroupIcon = _export_sfc(_sfc_main$9, [["render", _sfc_render$2]]);
  const _sfc_main$8 = {};
  const _hoisted_1$1 = {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$1, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        d: "M12.8472 3.83391C12.9336 2.79732 13.8001 2 14.8403 2H17.1597C18.1999 2 19.0664 2.79732 19.1528 3.83391L19.3882 6.6587C19.422 7.06373 19.8992 7.2614 20.2095 6.99887L22.3734 5.16789C23.1674 4.49599 24.3439 4.54493 25.0795 5.28045L26.7196 6.92056C27.4551 7.65608 27.504 8.8326 26.8321 9.62666L25.0012 11.7905C24.7386 12.1008 24.9363 12.578 25.3413 12.6118L28.1661 12.8472C29.2027 12.9336 30 13.8001 30 14.8403V17.1597C30 18.1999 29.2027 19.0664 28.1661 19.1528L25.3413 19.3882C24.9363 19.422 24.7386 19.8992 25.0012 20.2095L26.8321 22.3733C27.504 23.1674 27.4551 24.3439 26.7196 25.0794L25.0795 26.7196C24.3439 27.4551 23.1674 27.504 22.3734 26.8321L20.2095 25.0011C19.8992 24.7386 19.422 24.9363 19.3882 25.3413L19.1528 28.1661C19.0664 29.2027 18.1999 30 17.1597 30H14.8403C13.8001 30 12.9336 29.2027 12.8472 28.1661L12.6118 25.3413C12.578 24.9363 12.1008 24.7386 11.7905 25.0012L9.62666 26.8321C8.8326 27.504 7.65608 27.4551 6.92056 26.7196L5.28045 25.0795C4.54493 24.3439 4.496 23.1674 5.16789 22.3734L6.99888 20.2095C7.26141 19.8992 7.06373 19.422 6.65871 19.3882L3.83391 19.1528C2.79732 19.0664 2 18.1999 2 17.1597V14.8403C2 13.8001 2.79732 12.9336 3.83391 12.8472L6.65871 12.6118C7.06373 12.578 7.2614 12.1008 6.99888 11.7905L5.16789 9.62664C4.496 8.83258 4.54493 7.65606 5.28045 6.92054L6.92056 5.28043C7.65608 4.54491 8.8326 4.49597 9.62666 5.16787L11.7905 6.99884C12.1008 7.26137 12.578 7.06369 12.6118 6.65867L12.8472 3.83391ZM21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16Z",
        fill: "#B4ACBC"
      }, null, -1),
      vue.createElementVNode("path", {
        d: "M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16ZM20.5 16C20.5 13.5147 18.4853 11.5 16 11.5C13.5147 11.5 11.5 13.5147 11.5 16C11.5 18.4853 13.5147 20.5 16 20.5C18.4853 20.5 20.5 18.4853 20.5 16Z",
        fill: "#998EA4"
      }, null, -1),
      vue.createElementVNode("path", {
        d: "M10.5 16C10.5 12.9624 12.9624 10.5 16 10.5C19.0376 10.5 21.5 12.9624 21.5 16C21.5 19.0376 19.0376 21.5 16 21.5C12.9624 21.5 10.5 19.0376 10.5 16ZM21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16Z",
        fill: "#CDC4D6"
      }, null, -1)
    ])]);
  }
  const SettingIcon = _export_sfc(_sfc_main$8, [["render", _sfc_render$1]]);
  const _sfc_main$7 = vue.defineComponent({
    __name: "PanelMenu",
    setup(__props) {
      const uiStore = useUIStore();
      function renderIcon(icon) {
        return () => vue.h(naive.NIcon, null, { default: () => vue.h(icon) });
      }
      const menuOptions = [
        {
          label: "文字",
          key: "TextView",
          icon: renderIcon(TextIcon)
        },
        {
          label: "文字池",
          key: "TextGroupView",
          icon: renderIcon(TextGroupIcon)
        },
        {
          label: "表情",
          key: "EmotionView",
          icon: renderIcon(EmotionIcon)
        },
        {
          label: "全局设置",
          key: "SettingView",
          icon: renderIcon(SettingIcon)
        }
      ];
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naive.NMenu), {
          "collapsed-width": 64,
          "collapsed-icon-size": 22,
          options: menuOptions,
          "onUpdate:value": [
            vue.unref(uiStore).updateMenuValue,
            _cache[0] || (_cache[0] = ($event) => vue.unref(uiStore).uiConfig.activeMenuIndex = $event)
          ],
          value: vue.unref(uiStore).uiConfig.activeMenuIndex
        }, null, 8, ["onUpdate:value", "value"]);
      };
    }
  });
  const _sfc_main$6 = vue.defineComponent({
    __name: "TextView",
    setup(__props) {
      const uiStore = useUIStore();
      const moduleStore = useModuleStore();
      const biliStore = useBiliStore();
      const message = naive.useMessage();
      const tStop = new TextSpamer("StopTextSpamer");
      const handleStartSpamer = () => {
        if (moduleStore.moduleConfig.TextSpam.msg === "" || moduleStore.moduleConfig.TextSpam.msg === null) {
          message.error("没内容你车什么?");
        } else if (moduleStore.moduleConfig.TextSpam.textinterval === null || moduleStore.moduleConfig.TextSpam.timeinterval === null || moduleStore.moduleConfig.TextSpam.timelimit === null) {
          message.error("没参数你车什么?");
        } else {
          uiStore.uiConfig.isShowPanel = false;
          moduleStore.moduleConfig.TextSpam.enable = true;
          moduleStore.emitter.emit("TextSpam", {
            module: "TextSpam"
          });
        }
      };
      const handleStopSpamer = () => {
        tStop.stop();
      };
      const rules = {
        timeinterval: {
          required: true,
          message: "最小为1",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.TextSpam.timeinterval !== null;
          }
        },
        textinterval: {
          required: true,
          message: `输入一个大于0，小于的${biliStore.infoByuser?.property.danmu.length}的数字`,
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.TextSpam.textinterval !== null;
          }
        },
        timelimit: {
          required: true,
          message: "输入一个大于等于0的数字",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.TextSpam.timelimit !== null;
          }
        },
        msg: {
          required: true,
          message: "没内容你车什么",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.TextSpam.msg.length > 0;
          }
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naive.NForm), {
          rules,
          disabled: vue.unref(moduleStore).moduleConfig.TextSpam.enable
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(vue.unref(naive.NPageHeader), {
              subtitle: "文字独轮车",
              style: { "margin-bottom": "10px" }
            }),
            vue.createVNode(vue.unref(naive.NFormItem), { "show-label": false }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(naive.NFormItem), {
                      label: "时间间隔",
                      path: "timeinterval"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NPopover), {
                          trigger: "hover",
                          style: { "max-width": "300px" },
                          placement: "bottom"
                        }, {
                          trigger: vue.withCtx(() => [
                            vue.createVNode(vue.unref(naive.NInputNumber), {
                              clearable: "",
                              "show-button": false,
                              value: vue.unref(moduleStore).moduleConfig.TextSpam.timeinterval,
                              "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(moduleStore).moduleConfig.TextSpam.timeinterval = $event),
                              placeholder: "默认3，单位为秒",
                              min: "1",
                              precision: 0
                            }, {
                              suffix: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
                                vue.createTextVNode(" 秒 ", -1)
                              ])]),
                              _: 1
                            }, 8, ["value"])
                          ]),
                          default: vue.withCtx(() => [
                            _cache[7] || (_cache[7] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为3秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    vue.createVNode(vue.unref(naive.NFormItem), {
                      label: "数量间隔",
                      path: "textinterval"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NPopover), {
                          trigger: "hover",
                          placement: "bottom"
                        }, {
                          trigger: vue.withCtx(() => [
                            vue.createVNode(vue.unref(naive.NInputNumber), {
                              clearable: "",
                              "show-button": false,
                              value: vue.unref(moduleStore).moduleConfig.TextSpam.textinterval,
                              "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(moduleStore).moduleConfig.TextSpam.textinterval = $event),
                              placeholder: "默认20",
                              min: "1",
                              max: vue.unref(biliStore).infoByuser?.property.danmu.length,
                              precision: 0
                            }, null, 8, ["value", "max"])
                          ]),
                          default: vue.withCtx(() => [
                            vue.createElementVNode("span", null, "每次弹幕发送字数, 最大为 " + vue.toDisplayString(vue.unref(biliStore).infoByuser?.property.danmu.length), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    vue.createVNode(vue.unref(naive.NFormItem), {
                      label: "时间限制",
                      path: "timelimit"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NPopover), {
                          trigger: "hover",
                          placement: "bottom"
                        }, {
                          trigger: vue.withCtx(() => [
                            vue.createVNode(vue.unref(naive.NInputNumber), {
                              clearable: "",
                              "show-button": false,
                              value: vue.unref(moduleStore).moduleConfig.TextSpam.timelimit,
                              "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(moduleStore).moduleConfig.TextSpam.timelimit = $event),
                              placeholder: "默认0",
                              min: "0",
                              precision: 0
                            }, {
                              suffix: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                                vue.createTextVNode(" 秒 ", -1)
                              ])]),
                              _: 1
                            }, 8, ["value"])
                          ]),
                          default: vue.withCtx(() => [
                            _cache[9] || (_cache[9] = vue.createElementVNode("span", null, "设定一个时间，计时完成后自动停止，单位为秒，0为关闭该功能", -1))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            vue.createVNode(vue.unref(naive.NFormItem), {
              label: "发送内容",
              path: "msg"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NInput), {
                  round: "",
                  clearable: "",
                  type: "textarea",
                  "show-count": "",
                  value: vue.unref(moduleStore).moduleConfig.TextSpam.msg,
                  "onUpdate:value": _cache[3] || (_cache[3] = ($event) => vue.unref(moduleStore).moduleConfig.TextSpam.msg = $event),
                  placeholder: "车了可能会被禁，但不车就等于一直被禁"
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            !vue.unref(moduleStore).moduleConfig.TextSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
              key: 0,
              justify: "end",
              style: { "margin-top": "10px" }
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                }, {
                  default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
                    vue.createTextVNode("取消", -1)
                  ])]),
                  _: 1
                }),
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  type: "primary",
                  onClick: handleStartSpamer
                }, {
                  default: vue.withCtx(() => [..._cache[11] || (_cache[11] = [
                    vue.createTextVNode("开车", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })) : vue.createCommentVNode("", true),
            vue.unref(moduleStore).moduleConfig.TextSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
              key: 1,
              justify: "end",
              style: { "margin-top": "10px" }
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  onClick: _cache[5] || (_cache[5] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                }, {
                  default: vue.withCtx(() => [..._cache[12] || (_cache[12] = [
                    vue.createTextVNode("取消", -1)
                  ])]),
                  _: 1
                }),
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  type: "error",
                  onClick: handleStopSpamer
                }, {
                  default: vue.withCtx(() => [..._cache[13] || (_cache[13] = [
                    vue.createTextVNode("停车", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["disabled"]);
      };
    }
  });
  const _hoisted_1 = ["id", "onClick"];
  const _hoisted_2 = {
    key: 0,
    id: "emotionContent"
  };
  const _sfc_main$5 = vue.defineComponent({
    __name: "EmotionView",
    setup(__props) {
      const biliStore = useBiliStore();
      const moduleStore = useModuleStore();
      const uiStore = useUIStore();
      const message = naive.useMessage();
      const emStop = new EmotionSpamer("StopEmotionSpamer");
      const handleClick = (id) => {
        moduleStore.moduleConfig.EmotionSpam.emotionViewSelectedID = id;
      };
      const handleUpdateValue = (value) => {
        moduleStore.moduleConfig.EmotionSpam.msg = value.map(String);
      };
      const rules = {
        timeinterval: {
          required: true,
          message: "最小为1",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.EmotionSpam.timeinterval !== null;
          }
        },
        timelimit: {
          required: true,
          message: "输入一个大于等于0的数字",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.EmotionSpam.timelimit !== null;
          }
        }
      };
      const handleStartSpamer = () => {
        if (moduleStore.moduleConfig.EmotionSpam.msg.length === 0) {
          message.error("没选表情你车什么?");
        } else if (moduleStore.moduleConfig.EmotionSpam.timeinterval === null || moduleStore.moduleConfig.EmotionSpam.timelimit === null) {
          message.error("没参数你车什么?");
        } else {
          uiStore.uiConfig.isShowPanel = false;
          moduleStore.moduleConfig.EmotionSpam.enable = true;
          moduleStore.emitter.emit("EmotionSpam", {
            module: "EmotionSpam"
          });
        }
      };
      const handleStopSpamer = () => {
        emStop.stop();
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(naive.NPageHeader), {
            subtitle: "表情独轮车，好用爱用",
            style: { "margin-bottom": "10px" }
          }),
          vue.createVNode(vue.unref(naive.NFlex), {
            id: "emotionTab",
            justify: "start"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(biliStore).emotionData.filter((data) => data.pkg_id !== 100), (data) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  style: { "padding": "0 5px" },
                  key: data.pkg_id,
                  id: data.pkg_id.toString(),
                  onClick: ($event) => handleClick(data.pkg_id)
                }, [
                  vue.createVNode(vue.unref(naive.NAvatar), {
                    color: vue.unref(uiStore).uiConfig.theme === "dark" ? "#101014" : "white",
                    src: data.current_cover,
                    size: 35
                  }, null, 8, ["color", "src"])
                ], 8, _hoisted_1);
              }), 128))
            ]),
            _: 1
          }),
          vue.createVNode(vue.unref(naive.NDivider), { style: { "margin": "15px 0" } }),
          vue.unref(moduleStore).moduleConfig.EmotionSpam.emotionViewSelectedID !== null ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
            vue.createVNode(vue.unref(naive.NCheckboxGroup), {
              value: vue.unref(moduleStore).moduleConfig.EmotionSpam.msg,
              "onUpdate:value": [
                _cache[0] || (_cache[0] = ($event) => vue.unref(moduleStore).moduleConfig.EmotionSpam.msg = $event),
                handleUpdateValue
              ]
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NFlex), { style: { "padding-top": "5px" } }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(biliStore).emotionData.find(
                      (data) => data.pkg_id === vue.unref(moduleStore).moduleConfig.EmotionSpam.emotionViewSelectedID
                    )?.emoticons, (data) => {
                      return vue.openBlock(), vue.createBlock(vue.unref(naive.NCheckbox), {
                        value: data.emoticon_unique,
                        key: data.emoticon_id,
                        disabled: data.perm === 0 || vue.unref(moduleStore).moduleConfig.EmotionSpam.enable
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(naive.NPopover), null, {
                            trigger: vue.withCtx(() => [
                              vue.createVNode(vue.unref(naive.NAvatar), {
                                color: vue.unref(uiStore).uiConfig.theme === "dark" ? "#101014" : "white",
                                size: 60,
                                src: data.url,
                                "object-fit": "contain"
                              }, null, 8, ["color", "src"])
                            ]),
                            default: vue.withCtx(() => [
                              vue.createElementVNode("span", null, vue.toDisplayString(data.emoji), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["value", "disabled"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["value"])
          ])) : vue.createCommentVNode("", true),
          vue.createVNode(vue.unref(naive.NDivider), { style: { "margin": "15px 0" } }),
          vue.createVNode(vue.unref(naive.NFlex), {
            justify: "space-between",
            align: "center"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(naive.NForm), {
                rules,
                disabled: vue.unref(moduleStore).moduleConfig.EmotionSpam.enable
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NFlex), null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(naive.NFormItem), {
                        label: "时间间隔",
                        path: "timeinterval"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(naive.NPopover), {
                            trigger: "hover",
                            style: { "max-width": "300px" }
                          }, {
                            trigger: vue.withCtx(() => [
                              vue.createVNode(vue.unref(naive.NInputNumber), {
                                clearable: "",
                                "show-button": false,
                                value: vue.unref(moduleStore).moduleConfig.EmotionSpam.timeinterval,
                                "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(moduleStore).moduleConfig.EmotionSpam.timeinterval = $event),
                                placeholder: "默认3，单位为秒",
                                min: "1",
                                precision: 0
                              }, {
                                suffix: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
                                  vue.createTextVNode(" 秒 ", -1)
                                ])]),
                                _: 1
                              }, 8, ["value"])
                            ]),
                            default: vue.withCtx(() => [
                              _cache[7] || (_cache[7] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为3秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      vue.createVNode(vue.unref(naive.NFormItem), {
                        label: "时间限制",
                        path: "timelimit"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(naive.NPopover), { trigger: "hover" }, {
                            trigger: vue.withCtx(() => [
                              vue.createVNode(vue.unref(naive.NInputNumber), {
                                clearable: "",
                                "show-button": false,
                                value: vue.unref(moduleStore).moduleConfig.EmotionSpam.timelimit,
                                "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(moduleStore).moduleConfig.EmotionSpam.timelimit = $event),
                                placeholder: "默认0",
                                min: "0",
                                precision: 0
                              }, {
                                suffix: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                                  vue.createTextVNode(" 秒 ", -1)
                                ])]),
                                _: 1
                              }, 8, ["value"])
                            ]),
                            default: vue.withCtx(() => [
                              _cache[9] || (_cache[9] = vue.createElementVNode("span", null, "设定一个时间，计时完成后自动停止，单位为秒，0为关闭该功能", -1))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["disabled"]),
              !vue.unref(moduleStore).moduleConfig.EmotionSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
                key: 0,
                justify: "end",
                style: { "margin-top": "10px" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NButton), {
                    disabled: vue.unref(moduleStore).moduleConfig.EmotionSpam.msg.length === 0,
                    round: "",
                    type: "info",
                    onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(moduleStore).moduleConfig.EmotionSpam.msg = [])
                  }, {
                    default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
                      vue.createTextVNode("清空", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  vue.createVNode(vue.unref(naive.NButton), {
                    round: "",
                    onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                  }, {
                    default: vue.withCtx(() => [..._cache[11] || (_cache[11] = [
                      vue.createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(naive.NButton), {
                    round: "",
                    type: "primary",
                    onClick: handleStartSpamer
                  }, {
                    default: vue.withCtx(() => [..._cache[12] || (_cache[12] = [
                      vue.createTextVNode("开车", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.unref(moduleStore).moduleConfig.EmotionSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
                key: 1,
                justify: "end",
                style: { "margin-top": "10px" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NButton), {
                    round: "",
                    onClick: _cache[5] || (_cache[5] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                  }, {
                    default: vue.withCtx(() => [..._cache[13] || (_cache[13] = [
                      vue.createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(naive.NButton), {
                    round: "",
                    type: "error",
                    onClick: handleStopSpamer
                  }, {
                    default: vue.withCtx(() => [..._cache[14] || (_cache[14] = [
                      vue.createTextVNode("停车", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const _sfc_main$4 = vue.defineComponent({
    __name: "TextGroupView",
    setup(__props) {
      const moduleStore = useModuleStore();
      const uiStore = useUIStore();
      const message = naive.useMessage();
      const dialog = naive.useDialog();
      const tgStop = new TextGroupSpamer("StopTextGroupSpamer");
      const rules = {
        timeinterval: {
          required: true,
          message: "最小为1",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.TextGroupSpam.timeinterval !== null;
          }
        }
      };
      const handleTabsValueUpdate = (value) => {
        moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = value;
      };
      const closeDisable = vue.computed(() => {
        return moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.length > 1;
      });
      const handleTabsAdd = () => {
        if (moduleStore.moduleConfig.TextGroupSpam.enable) {
          message.error("停车后才能添加");
        } else {
          const newKey = Math.max(
            ...moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.map(
              (panels) => panels.key
            )
          ) + 1;
          const newName = Math.max(
            ...moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.map(
              (panels) => panels.name
            )
          ) + 1;
          moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.push({
            key: newKey,
            name: newName,
            tab: "",
            msg: ""
          });
          moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = newName;
        }
      };
      const handleTabsClose = (name) => {
        if (moduleStore.moduleConfig.TextGroupSpam.enable) {
          message.error("停车后才能删除");
        } else {
          dialog.warning({
            title: "删除",
            content: "确定要删除吗？",
            positiveText: "确定",
            negativeText: "再想想",
            onPositiveClick: () => {
              _.remove(moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels, { name });
              moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue = name - 1;
            }
          });
        }
      };
      const handleStartSpamer = () => {
        const panelsWithEmptyMsg = _.filter(
          moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels,
          (panels) => _.isEmpty(panels.msg)
        );
        if (!_.isEmpty(panelsWithEmptyMsg)) {
          _.forEach(panelsWithEmptyMsg, (panels) => {
            message.error(`${panels.tab}还没填内容呢`);
          });
        } else {
          if (moduleStore.moduleConfig.TextGroupSpam.timeinterval === null) {
            message.error("没参数你车什么?");
          } else {
            uiStore.uiConfig.isShowPanel = false;
            moduleStore.moduleConfig.TextGroupSpam.enable = true;
            moduleStore.emitter.emit("TextGroupSpam", {
              module: "TextGroupSpam"
            });
          }
        }
      };
      const handleStopSpamer = () => {
        tgStop.stop();
      };
      const handleSendToText = () => {
        const currentTabValue = moduleStore.moduleConfig.TextGroupSpam.textGroupTabsValue;
        const currentPanel = moduleStore.moduleConfig.TextGroupSpam.textGroupTabPanels.find(
          (panel) => panel.name === currentTabValue
        );
        if (currentPanel) {
          if (!_.isEmpty(currentPanel.msg)) {
            moduleStore.moduleConfig.TextSpam.msg = currentPanel.msg;
            uiStore.uiConfig.activeMenuIndex = "TextView";
          } else {
            message.error("没有内容发什么");
          }
        } else {
          message.error("未找到当前标签页");
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naive.NForm), {
          rules,
          disabled: vue.unref(moduleStore).moduleConfig.TextGroupSpam.enable
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(vue.unref(naive.NPageHeader), {
              subtitle: "文字池独轮车：循环发送所有弹幕组内容。当然，也可以当成一个收藏夹😀",
              style: { "margin-bottom": "10px" }
            }),
            vue.createVNode(vue.unref(naive.NFormItem), { "show-label": false }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NFlex), null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(naive.NFormItem), {
                      label: "时间间隔",
                      path: "timeinterval"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NPopover), {
                          trigger: "hover",
                          style: { "max-width": "300px" },
                          placement: "bottom"
                        }, {
                          trigger: vue.withCtx(() => [
                            vue.createVNode(vue.unref(naive.NInputNumber), {
                              clearable: "",
                              "show-button": false,
                              value: vue.unref(moduleStore).moduleConfig.TextGroupSpam.timeinterval,
                              "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(moduleStore).moduleConfig.TextGroupSpam.timeinterval = $event),
                              placeholder: "默认3，单位为秒",
                              min: "1",
                              precision: 0
                            }, {
                              suffix: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
                                vue.createTextVNode(" 秒 ", -1)
                              ])]),
                              _: 1
                            }, 8, ["value"])
                          ]),
                          default: vue.withCtx(() => [
                            _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为3秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            vue.createVNode(vue.unref(naive.NFormItem), {
              "show-feedback": false,
              "show-label": false
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NTabs), {
                  type: "card",
                  value: vue.unref(moduleStore).moduleConfig.TextGroupSpam.textGroupTabsValue,
                  "onUpdate:value": [
                    _cache[1] || (_cache[1] = ($event) => vue.unref(moduleStore).moduleConfig.TextGroupSpam.textGroupTabsValue = $event),
                    handleTabsValueUpdate
                  ],
                  addable: "",
                  closable: closeDisable.value,
                  onAdd: handleTabsAdd,
                  onClose: handleTabsClose
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(moduleStore).moduleConfig.TextGroupSpam.textGroupTabPanels, (panels) => {
                      return vue.openBlock(), vue.createBlock(vue.unref(naive.NTabPane), {
                        key: panels.key,
                        name: panels.name,
                        tab: panels.tab
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(naive.NFormItem), {
                            label: "标题，用于区分不同的弹幕组",
                            "show-require-mark": "",
                            "validation-status": panels.tab === "" ? "error" : void 0
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(vue.unref(naive.NInput), {
                                value: panels.tab,
                                "onUpdate:value": ($event) => panels.tab = $event,
                                clearable: "",
                                placeholder: "最好写一下标题吧"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 2
                          }, 1032, ["validation-status"]),
                          vue.createVNode(vue.unref(naive.NFormItem), {
                            label: "发送内容",
                            "show-require-mark": "",
                            "validation-status": panels.msg === "" ? "error" : void 0
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(vue.unref(naive.NInput), {
                                value: panels.msg,
                                "onUpdate:value": ($event) => panels.msg = $event,
                                round: "",
                                clearable: "",
                                "show-count": "",
                                type: "textarea",
                                placeholder: "默认每次弹幕发送字数为20，超出20将自动分割到下一条弹幕"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 2
                          }, 1032, ["validation-status"])
                        ]),
                        _: 2
                      }, 1032, ["name", "tab"]);
                    }), 128))
                  ]),
                  _: 1
                }, 8, ["value", "closable"])
              ]),
              _: 1
            }),
            !vue.unref(moduleStore).moduleConfig.TextGroupSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
              key: 0,
              justify: "end",
              style: { "margin-top": "10px" }
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  type: "info",
                  onClick: handleSendToText
                }, {
                  default: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
                    vue.createTextVNode("发送到文字独轮车", -1)
                  ])]),
                  _: 1
                }),
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                }, {
                  default: vue.withCtx(() => [..._cache[7] || (_cache[7] = [
                    vue.createTextVNode("取消", -1)
                  ])]),
                  _: 1
                }),
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  type: "primary",
                  onClick: handleStartSpamer
                }, {
                  default: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                    vue.createTextVNode("开车", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })) : vue.createCommentVNode("", true),
            vue.unref(moduleStore).moduleConfig.TextGroupSpam.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
              key: 1,
              justify: "end",
              style: { "margin-top": "10px" }
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = false)
                }, {
                  default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
                    vue.createTextVNode("取消", -1)
                  ])]),
                  _: 1
                }),
                vue.createVNode(vue.unref(naive.NButton), {
                  round: "",
                  type: "error",
                  onClick: handleStopSpamer
                }, {
                  default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
                    vue.createTextVNode("停车", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["disabled"]);
      };
    }
  });
  const spHelpInfo = {
    SettingView: {
      saveSpamerStatus: {
        title: "保持独轮车开关状态",
        content: () => vue.h("p", [
          vue.h("span", "启用后，独轮车开关状态将会被保持，下次启动时会自动恢复。"),
          vue.h("br"),
          vue.h("span", "该功能默认关闭。")
        ])
      },
      danmakuModules: {
        title: "弹幕+1和弹幕复制",
        content: () => vue.h("p", [
          vue.h(
            "span",
            "启用后，会在弹幕菜单中提供弹幕+1和弹幕复制功能。（点击弹幕列表即可触发弹幕菜单，该功能只支持文字弹幕）"
          ),
          vue.h("br"),
          vue.h(
            "span",
            { style: { color: "#FF0000", fontWeight: "bold" } },
            "温馨提示：B站的弹幕菜单有问题，如果在太低的地方触发，它有可能会无法完全显示所有选项。"
          ),
          vue.h("br"),
          vue.h("span", "该功能默认关闭。")
        ])
      },
      danmakuDetail: {
        title: "显示弹幕详情",
        content: () => vue.h("p", [
          vue.h(
            "span",
            "启用后，将会在发送弹幕失败时直接显示相关通知，而不是只显示在控制台中。"
          ),
          vue.h("br"),
          vue.h("span", "该功能默认开启。")
        ])
      },
      autoCheckUpdate: {
        title: "自动检测更新",
        content: () => vue.h("p", [
          vue.h(
            "span",
            "启用后，将会在脚本启动时自动检测更新，当然也可以手动检测更新。检测到新版本，会在左上角弹出通知。"
          ),
          vue.h("br"),
          vue.h("span", "该功能默认开启。")
        ])
      }
    }
  };
  const _sfc_main$3 = vue.defineComponent({
    __name: "InfoDialog",
    props: {
      id: {}
    },
    setup(__props) {
      const dialog = naive.useDialog();
      const props = __props;
      const openDialog = () => {
        const { title, content } = _.get(spHelpInfo, props.id);
        dialog.info({
          title,
          content,
          positiveText: "知道了"
        });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naive.NIcon), { onClick: openDialog }, {
          default: vue.withCtx(() => [..._cache[0] || (_cache[0] = [
            vue.createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 36 36"
            }, [
              vue.createElementVNode("path", {
                fill: "#3B88C3",
                d: "M0 4c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v28c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V4z"
              }),
              vue.createElementVNode("path", {
                fill: "#FFF",
                d: "M20.512 8.071c0 1.395-1.115 2.573-2.511 2.573-1.333 0-2.511-1.209-2.511-2.573 0-1.271 1.178-2.45 2.511-2.45 1.333.001 2.511 1.148 2.511 2.45zm-4.744 6.728c0-1.488.931-2.481 2.232-2.481 1.302 0 2.232.992 2.232 2.481v11.906c0 1.488-.93 2.48-2.232 2.48s-2.232-.992-2.232-2.48V14.799z"
              })
            ], -1)
          ])]),
          _: 1
        });
      };
    }
  });
  const _sfc_main$2 = vue.defineComponent({
    __name: "SettingView",
    setup(__props) {
      const moduleStore = useModuleStore();
      const manualCheckUpdate = new checkUpdate("ManualCheckUpdate");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(naive.NPageHeader), {
            subtitle: "设置",
            style: { "margin-bottom": "10px" }
          }),
          vue.createVNode(vue.unref(naive.NFlex), { vertical: "" }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NSwitch), {
                    value: vue.unref(moduleStore).moduleConfig.setting.saveSpamerStatus.enable,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(moduleStore).moduleConfig.setting.saveSpamerStatus.enable = $event)
                  }, null, 8, ["value"]),
                  _cache[5] || (_cache[5] = vue.createTextVNode("保持独轮车开关状态", -1)),
                  vue.createVNode(_sfc_main$3, { id: "SettingView.saveSpamerStatus" })
                ]),
                _: 1
              }),
              vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NSwitch), {
                    value: vue.unref(moduleStore).moduleConfig.setting.danmakuModules.enable,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(moduleStore).moduleConfig.setting.danmakuModules.enable = $event)
                  }, null, 8, ["value"]),
                  _cache[6] || (_cache[6] = vue.createTextVNode("弹幕+1和弹幕复制", -1)),
                  vue.createVNode(_sfc_main$3, { id: "SettingView.danmakuModules" })
                ]),
                _: 1
              }),
              vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NSwitch), {
                    value: vue.unref(moduleStore).moduleConfig.setting.danmakuDetail.enable,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(moduleStore).moduleConfig.setting.danmakuDetail.enable = $event)
                  }, null, 8, ["value"]),
                  _cache[7] || (_cache[7] = vue.createTextVNode("显示弹幕详情", -1)),
                  vue.createVNode(_sfc_main$3, { id: "SettingView.danmakuDetail" })
                ]),
                _: 1
              }),
              vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NSwitch), {
                    value: vue.unref(moduleStore).moduleConfig.setting.autoCheckUpdate.enable,
                    "onUpdate:value": _cache[3] || (_cache[3] = ($event) => vue.unref(moduleStore).moduleConfig.setting.autoCheckUpdate.enable = $event)
                  }, null, 8, ["value"]),
                  _cache[9] || (_cache[9] = vue.createTextVNode("自动检测更新", -1)),
                  vue.createVNode(_sfc_main$3, { id: "SettingView.autoCheckUpdate" }),
                  vue.createVNode(vue.unref(naive.NButton), {
                    strong: "",
                    secondary: "",
                    round: "",
                    type: "primary",
                    onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(manualCheckUpdate).CheckUpdate("manual"))
                  }, {
                    default: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                      vue.createTextVNode("检测更新", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const _sfc_main$1 = vue.defineComponent({
    components: {
      TextView: _sfc_main$6,
      TextGroupView: _sfc_main$4,
      EmotionView: _sfc_main$5,
      SettingView: _sfc_main$2
    },
    setup() {
      const uiStore = useUIStore();
      return {
        uiStore
      };
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.uiStore.uiConfig.activeMenuIndex));
  }
  const PanelContent = _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const logger = new Logger("App");
      const uiStore = useUIStore();
      const moduleStore = useModuleStore();
      uiStore.uiConfig.isShowPanel = false;
      const renderPanel = (elementName, ctrStyle) => {
        pollingQuery(document, elementName, 300, 300).then((controlPanelContent) => {
          const buttonNode = vue.h(
            naive.NButton,
            {
              class: "blspam_btn",
              text: true,
              tag: "div",
              style: ctrStyle,
              focusable: false,
              bordered: false,
              onClick: () => {
                if (!useBiliStore().loginInfo?.isLogin) {
                  uiStore.uiConfig.isShowPanel = false;
                } else {
                  uiStore.uiConfig.isShowPanel = true;
                  handleUpdateTheme();
                }
              }
            },
            {
              default: () => vue.h(
                naive.NBadge,
                {
                  dot: true,
                  processing: true,
                  type: moduleStore.moduleConfig.TextSpam.enable || moduleStore.moduleConfig.EmotionSpam.enable || moduleStore.moduleConfig.TextGroupSpam.enable ? "success" : useBiliStore().loginInfo?.isLogin && useBiliStore().cookies ? "info" : "error"
                },
                {
                  default: () => vue.h(naive.NIcon, { component: MainIcon, size: 24 }, { default: () => null })
                }
              )
            }
          );
          vue.render(buttonNode, controlPanelContent);
        });
      };
      const handleUpdateTheme = () => {
        const biliTheme = _unsafeWindow.bililiveThemeV2.getTheme();
        uiStore.uiConfig.theme = biliTheme;
      };
      const handleUpdateCollapse = (collapsed) => {
        uiStore.uiConfig.isCollapsed = collapsed;
      };
      new MutationObserver((_mutationsList, observer) => {
        const controlPanel = dq("#control-panel-ctnr-box");
        if (controlPanel) {
          setTimeout(() => {
            const oldTheme = dq(".icon-left-part");
            const newTheme = dq(".chat-input-ctnr-new.p-relative");
            if (oldTheme || newTheme) {
              if (oldTheme) {
                renderPanel(".icon-left-part", { marginLeft: "4px", display: "inline-block" });
              }
              if (newTheme) {
                renderPanel(".chat-input-ctnr-new.p-relative", {
                  marginRight: "4px",
                  alignSelf: "center"
                });
              }
            }
          }, 500);
          observer.disconnect();
          logger.log("初始化完成");
        }
      }).observe(document.body, { childList: true, subtree: true });
      _GM_addStyle("body { font-size: 12px }");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naive.NConfigProvider), {
          locale: vue.unref(naive.zhCN),
          theme: vue.unref(uiStore).uiConfig.theme === "dark" ? vue.unref(naive.darkTheme) : vue.unref(naive.lightTheme)
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(vue.unref(naive.NMessageProvider), null, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naive.NDialogProvider), null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(naive.NModal), {
                      show: vue.unref(uiStore).uiConfig.isShowPanel,
                      "onUpdate:show": _cache[0] || (_cache[0] = ($event) => vue.unref(uiStore).uiConfig.isShowPanel = $event),
                      style: { "max-width": "1200px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NLayout), { "has-sider": "" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(vue.unref(naive.NLayoutSider), {
                              bordered: "",
                              "show-trigger": "",
                              "collapse-mode": "width",
                              "collapsed-width": 64,
                              width: 240,
                              "native-scrollbar": false,
                              "content-style": "max-height: 320px; padding-top: 8px",
                              collapsed: vue.unref(uiStore).uiConfig.isCollapsed,
                              "on-update:collapsed": handleUpdateCollapse
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_sfc_main$7)
                              ]),
                              _: 1
                            }, 8, ["collapsed"]),
                            vue.createVNode(vue.unref(naive.NLayoutContent), { "content-style": "padding: 24px;" }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(PanelContent)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["show"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["locale", "theme"]);
      };
    }
  });
  const pinia = pinia$1.createPinia();
  _unsafeWindow.onload = () => {
    const app = vue.createApp(_sfc_main);
    app.use(pinia);
    app.use(naive);
    const moduleStore = useModuleStore(pinia);
    moduleStore.loadModules();
    const div = dce("div");
    div.id = "BLSPAM";
    document.body.append(div);
    app.mount(div);
  };

})(Vue, Pinia, naive, _, axios);