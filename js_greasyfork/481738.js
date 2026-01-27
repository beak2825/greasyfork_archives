// ==UserScript==
// @name            Bilibili-Live-Spamer
// @name:zh         Bilibili-Live-Spamer
// @namespace       https://github.com/ADJazzzz
// @version         1.5.0
// @author          ADJazz
// @description     B站直播文字、表情独轮车
// @description:zh  B站直播文字、表情独轮车
// @license         MIT
// @copyright       2026, ADJazz (https://github.com/ADJazzzz)
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+CgogPGc+CiAgPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTAuMzM4NSAxNy4zNTk3IDEyLjI5MzEpIiBzdHJva2U9Im51bGwiIGlkPSJsYXllcjEiICA+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjAzMzA3IiBpZD0ic3ZnXzMwIiBwLWlkPSIyMzA5IiBmaWxsPSIjMjBiMGUzIiBkPSJtMTEuNzkzOTMsNC4wMjgxN2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMS4xNTU4NiwwYTIuODI4NDcsMi43NDgyMyAwIDAgMSAwLjcwNzExLDAuNTAyMDhsMi43MTk2OCwyLjMxMjIybDEuOTQ0NTcsMGwyLjcxOTY3LC0yLjMxMjIyYTIuODU1NjUsMi43NzQ2NSAwIDAgMSAwLjcwNzExLC0wLjUwMjA4YTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAxLjgwODYsMS4wOTY2NmExLjM1OTgzLDEuMzIxMjYgMCAwIDEgLTAuMjk5MTYsMC44ODUyNWE3LjYwMTUsNy4zODU4NyAwIDAgMSAtMC41OTgzMywwLjUyODVhMy45Mjk5MywzLjgxODQ1IDAgMCAxIC0wLjM4MDc1LDAuMzAzODlsMS42OTk3OSwwYTIuODgyODYsMi44MDEwOCAwIDAgMSAxLjk5ODk3LDAuODcyMDNhMi44OTY0NSwyLjgxNDI5IDAgMCAxIDAuOTExMDksMS45NDIyNWwwLDcuNTk3MjdhNS41MDczNiw1LjM1MTEzIDAgMCAxIC0wLjA2OCwxLjE0OTVhMy4wMTg4NSwyLjkzMzIxIDAgMCAxIC0xLjM1OTgzLDEuODQ5NzdhMi45MjM2NiwyLjg0MDcyIDAgMCAxIC0xLjU2MzgyLDAuNDIyODFsLTEyLjQ4MzMzLDBhNS43NjU3Miw1LjYwMjE3IDAgMCAxIC0xLjIyMzg1LC0wLjA2NjA4YTMuMDA1MjQsMi45MTk5OSAwIDAgMSAtMS44NzY1NywtMS4zMjEyNmEyLjkxMDA1LDIuODI3NSAwIDAgMSAtMC40NjIzNiwtMS41MTk0NmwwLC03LjUxNzk4YTYuMDkyMDgsNS45MTkyNiAwIDAgMSAwLC0xLjA5NjY2YTIuOTkxNjQsMi45MDY3OCAwIDAgMSAyLjcxOTY5LC0yLjM1MTg0bDEuNzgxNCwwYy0wLjI4NTU4LC0wLjE5ODE5IC0wLjUzMDM0LC0wLjQzNjAyIC0wLjc4ODcxLC0wLjY0NzQzYTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAtMC40MzUxNSwtMS4wODM0M2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMC42NjYzMywtMS4wNDM4bS0wLjMxMjc5LDUuMTI2NTFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0xLjA3NDI4LDAuOTUxMzFhMS44MzU3OCwxLjc4MzcgMCAwIDAgMCwwLjUwMjA4bDAsNi4yNDk1OGExLjM1OTgzLDEuMzIxMjYgMCAwIDAgMC45MzgyOSwxLjMyMTI3YTEuNzk0OTgsMS43NDQwNyAwIDAgMCAwLjU4NDczLDAuMDkyNDhsMTEuMDU1NSwwYTEuMzU5ODMsMS4zMjEyNiAwIDAgMCAxLjI5MTgzLC0wLjc3OTU0YTEuOTAzNzgsMS44NDk3NyAwIDAgMCAwLjEzNTk5LC0wLjg3MjAzbDAsLTUuODEzNTZhMi4yODQ1MywyLjIxOTczIDAgMCAwIDAsLTAuNjM0MjFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0wLjg4Mzg5LC0wLjg5ODQ3YTIuMTg5MzQsMi4xMjcyNCAwIDAgMCAtMC44NDMwOSwtMC4xMTg5MWwtMTAuNTY1OTUsMGE0LjU0MTg2LDQuNDEzMDIgMCAwIDAgLTAuNjM5MTIsMHptMCwwIi8+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjUyNDE2IiBmaWxsPSIjMjBiMGUzIiAgZD0ibTEyLjgyMDE1LDEyLjEyMjUxYzAuMTg1NDYsMC4xODc0OSAwLjM4MDQ4LDAuMzcwNzMgMC41NTU5OCwwLjU2Njk1YzAuMzA0OTMsMC4zNDA5MyAwLjU3MTAzLDAuNTk0NDkgMC44NTA5NywwLjg5ODEyYy0wLjA2NTY2LC0wLjU1NDUxIDAuNjY2NCwtMC41OTQ5MSAwLjAzNzg5LC0wLjg3MjMzYy0wLjIwODMxLDAuMjA3MTMgLTAuNDgwOTgsMC40Mzg3NyAtMC42OTUyMSwwLjYwNzEzYy0wLjE5OTk3LDAuMTU3MTUgLTAuNDQwNTMsMC4zMzI4NiAtMC42MzA4NCwwLjQ3Mjc0Yy0wLjk3NDQzLDAuNzE2MjIgMC4xMTU0MiwyLjAxMjA3IDEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIDEuMDIxMzIsLTAuNzYyMTQgMS40MzQwOSwtMS4xNDI1OWMwLjIyNDYsLTAuMjA3MDMgMC4zNDczMywtMC40NzQ0NCAwLjM2NzQxLC0wLjc5MDE2YzAuMDIwNjUsLTAuMzI0NzEgLTAuMjczMDEsLTAuNjE2MDIgLTAuNDA1NDMsLTAuNzQzNzdjLTAuNDcwMjgsLTAuNDUzNjYgLTAuODkwMjYsLTAuOTc3MDUgLTEuMzAzMTgsLTEuMzk1OTVjLTAuODA0NiwtMC44OTM0IC0yLjEwNTAzLDAuMjEyMTMgLTEuMzAwNDMsMS4xMDU1MmwwLjAwMDAxLC0wLjAwMDExeiIgaWQ9InN2Z18zMSIvPgogICA8cGF0aCBzdHJva2U9Im51bGwiIHN0cm9rZS13aWR0aD0iMC41MjQxNiIgZmlsbD0iIzIwYjBlMyIgIGQ9Im0yMi4wMjE4OSwxMi4xMjI1MWMtMC4xODU0NywwLjE4NzQ5IC0wLjM4MDQ4LDAuMzcwNzMgLTAuNTU1OTksMC41NjY5NWMtMC4zMDQ5MywwLjM0MDkzIC0wLjU3MTAzLDAuNTk0NDkgLTAuODUwOTcsMC44OTgxMmMwLjA2NTY2LC0wLjU1NDUxIC0wLjY2NjQsLTAuNTk0OTEgLTAuMDM3OTEsLTAuODcyMzNjMC4yMDgzMSwwLjIwNzEzIDAuNDgwOTgsMC40Mzg3NyAwLjY5NTIxLDAuNjA3MTNjMC4xOTk5NywwLjE1NzE1IDAuNDQwNTMsMC4zMzI4NiAwLjYzMDg1LDAuNDcyNzRjMC45NzQ0MiwwLjcxNjIyIC0wLjExNTQzLDIuMDEyMDcgLTEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIC0xLjAyMTMyLC0wLjc2MjE0IC0xLjQzNDA4LC0xLjE0MjU5Yy0wLjIyNDYxLC0wLjIwNzAzIC0wLjM0NzM0LC0wLjQ3NDQ0IC0wLjM2NzQyLC0wLjc5MDE2Yy0wLjAyMDY0LC0wLjMyNDcxIDAuMjczMDEsLTAuNjE2MDIgMC40MDU0NCwtMC43NDM3N2MwLjQ3MDI4LC0wLjQ1MzY2IDAuODkwMjYsLTAuOTc3MDUgMS4zMDMxOCwtMS4zOTU5NWMwLjgwNDYsLTAuODkzNCAyLjEwNTAzLDAuMjEyMTMgMS4zMDA0MywxLjEwNTUybDAuMDAwMDIsLTAuMDAwMTF6IiBpZD0ic3ZnXzMyIi8+CiAgPC9nPgogIDxwYXRoIGlkPSJzdmdfMSIgZD0ibTI2LjYyMyw5Ljg1OWwwLjQ0LC01LjQzYzAuMDIyLC0wLjI3NCAwLjI2NSwtMC40OCAwLjUzOSwtMC40NThsMC4wMywwLjAwMmMwLjI3NCwwLjAyMiAwLjQ4LDAuMjY1IDAuNDU4LDAuNTM5bC0wLjQ0LDUuNDNjLTAuMDIyLDAuMjc0IC0wLjI2NSwwLjQ4IC0wLjUzOSwwLjQ1OGwtMC4wMywtMC4wMDJjLTAuMjc1LC0wLjAyMyAtMC40ODEsLTAuMjY1IC0wLjQ1OCwtMC41Mzl6IiBmaWxsPSIjNjY3NTdGIi8+CiAgPHBhdGggaWQ9InN2Z18yIiBkPSJtMTQuNDU3LDIwLjU0OGwwLDIuMDZzLTIuMDYsMCAtMi4wNiwyLjA2bDAsMy4wOWMwLDEuMDMgMS4wMywyLjA2IDIuMDYsMi4wNmwxMC4zMDIsMGMxLjAzLDAgMi4wNiwtMS4wMyAyLjA2LC0yLjA2bDAsLTUuMTUxYzAsLTEuMDMgLTEuMDMsLTIuMDYgLTIuMDYsLTIuMDZsLTEwLjMwMiwwLjAwMXoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzMiIGQ9Im0yMS42MjIsMjIuMTU0bC0xMC4xNDUsLTEuNzg5Yy0xLjAxNCwtMC4xNzkgLTEuMDE0LC0wLjE3OSAtMC44MzYsLTEuMTkzYzAuMDk4LC0wLjU1OCAwLjYzNSwtMC45MzQgMS4xOTMsLTAuODM2bDEwLjE0NSwxLjc4OWMwLjU1OCwwLjA5OCAwLjkzNCwwLjYzNSAwLjgzNiwxLjE5M2MtMC4xNzgsMS4wMTUgLTAuMTc4LDEuMDE1IC0xLjE5MywwLjgzNnoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzQiIGQ9Im0yMy45NzQsMTguNTExYy0wLjE5OSwwLjk0OSAtMC41NzQsMS44ODIgLTIuMTU3LDEuNTgzYy0xLjU4MywtMC4yOTggLTEuODM2LDEuMjYyIC0wLjg0OSwxLjUzOGMwLjk4NywwLjI3NSAzLjM1LDAuNjY2IDQuMDM5LC0wLjQ1OWMwLjY4OCwtMS4xMjQgMC44MDMsLTIuMjAzIDAuNzM0LC0yLjY4NWMtMC4wNjksLTAuNDgxIC0xLjYyLC0wLjY3OSAtMS43NjcsMC4wMjN6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z181IiBkPSJtMjIuMTM3LDIyLjUwNGwtMTEuMTg5LC0xLjk3M2MtMC4yNzEsLTAuMDQ4IC0wLjQ1MywtMC4zMDggLTAuNDA2LC0wLjU3OWwwLjAwNSwtMC4wM2MwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwxMS4xODksMS45NzNjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41NzlsLTAuMDA1LDAuMDNjLTAuMDQ3LDAuMjcxIC0wLjMwOCwwLjQ1MyAtMC41NzksMC40MDZ6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z182IiBkPSJtMjcuNzc4LDguODQ4bC0xLjc4OSwxMC4xNDVjLTAuMTc5LDEuMDE0IC0wLjE3OSwxLjAxNCAtMS4xOTMsMC44MzZjLTAuNTU4LC0wLjA5OCAtMC45MzQsLTAuNjM1IC0wLjgzNiwtMS4xOTNsMS43ODksLTEwLjE0NmMwLjA5OCwtMC41NTggMC42MzUsLTAuOTM0IDEuMTkzLC0wLjgzNmMxLjAxNSwwLjE3OSAxLjAxNSwwLjE3OSAwLjgzNiwxLjE5NHptMS4wMjIsLTcuNzE2bC0wLjczNCw0LjE0NmMtMC4wOSwwLjUwOCAtMC4xNzMsMS4wMzggLTEuMTg4LDAuODU5Yy0wLjU1OCwtMC4wOTkgLTAuOTA4LC0wLjczNyAtMC43ODYsLTEuNDQxbDAuNjU4LC0zLjcxOGMwLjE2OCwtMC41OTcgMC42NDUsLTEuMDM0IDEuMjAzLC0wLjkzNmMxLjAxNCwwLjE4IDAuOTM3LDAuNTgyIDAuODQ3LDEuMDl6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z183IiBkPSJtMjguMjcsOC40MDJsLTEuOTczLDExLjE4OWMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDUzIC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMS45NzMsLTExLjE4OWMwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwwLjAzLDAuMDA1YzAuMjcxLDAuMDQ4IDAuNDUzLDAuMzA4IDAuNDA2LDAuNTc5em0xLjI4LC03LjY4bC0wLjk0Myw1LjM2NmMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDU0IC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMC45NDMsLTUuMzY2YzAuMDQ4LC0wLjI3MSAwLjMwOCwtMC40NTMgMC41NzksLTAuNDA2bDAuMDMsMC4wMDVjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41Nzl6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z184IiBkPSJtMjQuMjM3LDE3LjkxMmwtNy42OTEsLTEuMzU2Yy0wLjc2OSwtMC4xMzYgLTAuNzY5LC0wLjEzNiAtMC42MzUsLTAuODk1YzAuMDc0LC0wLjQxOCAwLjQ4LC0wLjY5OCAwLjkwMywtMC42MjRsNy42OTEsMS4zNTZjMC40MjMsMC4wNzUgMC43MDksMC40NzcgMC42MzUsMC44OTVjLTAuMTM0LDAuNzU5IC0wLjEzNCwwLjc1OSAtMC45MDMsMC42MjR6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z185IiBkPSJtMjEuNzk0LDIxLjM5N2MxLjAyMywwLjE4IDMuMDQzLDAuNTM3IDMuNTgsLTIuNTA3YzAuNTM3LC0zLjA0MyAxLjU1MSwtMi44NjUgMS4wMTQsMC4xNzlzLTIuMzA0LDMuNzc4IC00Ljc3MywzLjM0MmMtMi4wMjksLTAuMzU3IC0xLjg1LC0xLjM3MiAwLjE3OSwtMS4wMTR6bS0xMC42NDEsLTEuODc2YzIuMDMsMC4zNSAyLjM0NSwxLjQ2NSAwLjMxNywxLjEwMmMtMC44OTksLTAuMTYxIC0xLjAxNCwwLjIxOCAtMS4yODksMC45ODdjLTAuMjU5LDAuNzIzIC0wLjYzLDEuODEgLTEuMTc4LDMuMzI4Yy0wLjQwMywxLjExNSAtMS4zMTcsMC42MjEgLTAuOTc5LC0wLjM1MmMwLjU2OCwtMS42MzYgMS4wOTMsLTMuMDU4IDEuNDM0LC0zLjk2MmMwLjM0OCwtMC45MjQgMC42MzIsLTEuMjg2IDEuNjk1LC0xLjEwM3oiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzEwIiBkPSJtOC45MjksMjMuNjU0bC0wLjAyOSwtMC4wMTFjLTAuMjU4LC0wLjA5NCAtMC41NDcsMC4wNCAtMC42NDEsMC4yOTlsLTIuMTI0LDUuODM2Yy0wLjA5NCwwLjI1OCAwLjA0LDAuNTQ3IDAuMjk5LDAuNjQxbDAuMDI4LDAuMDFjMC4yNTgsMC4wOTQgMC41NDcsLTAuMDQgMC42NDEsLTAuMjk5bDIuMTI0LC01LjgzNmMwLjA5NCwtMC4yNTggLTAuMDQsLTAuNTQ2IC0wLjI5OCwtMC42NHoiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzExIiBkPSJtNi40NjIsMzAuNDNsLTMuOSwtMS40MmMtMC4yNTgsLTAuMDk0IC0wLjM5MywtMC4zODIgLTAuMjk5LC0wLjY0MWwwLjAxLC0wLjAyOGMwLjA5NCwtMC4yNTggMC4zODIsLTAuMzkzIDAuNjQxLC0wLjI5OWwzLjksMS40MmMwLjI1OCwwLjA5NCAwLjM5MywwLjM4MiAwLjI5OSwwLjY0MWwtMC4wMSwwLjAyOGMtMC4wOTQsMC4yNTggLTAuMzgyLDAuMzkzIC0wLjY0MSwwLjI5OXoiIGZpbGw9IiM2Njc1N0YiLz4KICA8cGF0aCBpZD0ic3ZnXzEyIiBkPSJtMTIuMjI1LDMwLjcxOGwzLjA2LC0zLjA2YzAuMTk0LC0wLjE5NCAwLjE5NCwtMC41MTMgMCwtMC43MDdsLTAuMDIxLC0wLjAyMWMtMC4xOTQsLTAuMTk0IC0wLjUxMywtMC4xOTQgLTAuNzA3LDBsLTMuMDYsMy4wNmMtMC4xOTQsMC4xOTQgLTAuMTk0LDAuNTEzIDAsMC43MDdsMC4wMjEsMC4wMjFjMC4xOTQsMC4xOTQgMC41MTIsMC4xOTQgMC43MDcsMHptMTguNzQ0LDMuMjIybC0wLjA2LDBjLTAuNTUsMCAtMSwtMC40NSAtMSwtMWwwLC0zLjE1MWMwLC0wLjU1IDAuNDUsLTEgMSwtMWwwLjA2LDBjMC41NSwwIDEsMC40NSAxLDFsMCwzLjE1MWMwLDAuNTUgLTAuNDUsMSAtMSwxeiIgZmlsbD0iI0REMkU0NCIvPgogIDxwYXRoIGlkPSJzdmdfMTMiIGQ9Im0xMS45MTEsMzMuOTRsLTAuMDYsMGMtMC41NSwwIC0xLC0wLjQ1IC0xLC0xbDAsLTMuMTUxYzAsLTAuNTUgMC40NSwtMSAxLC0xbDAuMDYsMGMwLjU1LDAgMSwwLjQ1IDEsMWwwLDMuMTUxYzAsMC41NSAtMC40NSwxIC0xLDF6bTEzLjMyOSwtNi4xODZsMi4wOSwwYzAuMjc1LDAgMC41LC0wLjIyNSAwLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IC0wLjIyNSwtMC41IC0wLjUsLTAuNWwtMi4wOSwwYy0wLjI3NSwwIC0wLjUsMC4yMjUgLTAuNSwwLjVsMCwwLjAzYzAsMC4yNzUgMC4yMjUsMC41IDAuNSwwLjV6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNCIgZD0ibTMwLjA0NywzMC42NTdsLTMuMDYsLTMuMDZjLTAuMTk0LC0wLjE5NCAtMC4xOTQsLTAuNTEzIDAsLTAuNzA3bDAuMDIxLC0wLjAyMWMwLjE5NCwtMC4xOTQgMC41MTMsLTAuMTk0IDAuNzA3LDBsMy4wNiwzLjA2YzAuMTk0LDAuMTk0IDAuMTk0LDAuNTEzIDAsMC43MDdsLTAuMDIxLDAuMDIxYy0wLjE5NSwwLjE5NSAtMC41MTMsMC4xOTUgLTAuNzA3LDB6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNSIgZD0ibTkuOTk4LDE1LjUyOGMwLjc2NSwwLjMyOCAyLjExMSwwLjk2NCAyLjQxLDEuMDc5YzAsMCAwLjEzOCwtMC45MTggMC41MDUsLTAuOTE4YzAsMCAwLjEzOCwtMC40ODIgMC4yMjksLTAuNjg4YzAuMDkyLC0wLjIwNyAwLjM2NywtMC4xMzggMC4zOSwwLjI1MmMwLjAyMywwLjM5IC0wLjA5MiwwLjUyOCAtMC4wOTIsMC41MjhzMC4zNDQsMC40MzYgMC4xMzgsMS4wMzNjMCwwIDAuNDU5LDAuMDY5IDAuMzY3LDAuNjQzYy0wLjA5MiwwLjU3NCAwLjA2OSwxLjAxIC0wLjM0NCwxLjEyNGMtMC40MTMsMC4xMTUgLTEuOTc0LDAuNTUxIC0xLjk5NywtMC4wNjljLTAuMDIzLC0wLjYyIC0wLjQxMywtMS4xMDIgLTEuMTcsLTEuNTYxYy0wLjc1NywtMC40NTkgLTEuMzA4LC0wLjk2NCAtMS4yMTYsLTEuMjE2YzAuMDkxLC0wLjI1MyAwLjEzNywtMC40ODIgMC43OCwtMC4yMDd6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z18xNiIgZD0ibTI1LjI4OCwyNC42NjhsLTExLjM2MSwwYy0wLjI3NSwwIC0wLjUsLTAuMjI1IC0wLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IDAuMjI1LC0wLjUgMC41LC0wLjVsMTEuMzYyLDBjMC4yNzUsMCAwLjUsMC4yMjUgMC41LDAuNWwwLDAuMDNjLTAuMDAxLDAuMjc1IC0wLjIyNiwwLjUgLTAuNTAxLDAuNXoiIGZpbGw9IiNERDJFNDQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMTciIHI9IjQuNjM2IiBjeT0iMzEuMzY0IiBjeD0iMjAuMTIyIiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzE4IiByPSIyLjU3NSIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzY2NzU3RiIvPgogIDxjaXJjbGUgaWQ9InN2Z18xOSIgcj0iMi4wNiIgY3k9IjMzLjk0IiBjeD0iMzAuOTM5IiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzIwIiByPSIyLjU3NSIgY3k9IjMxLjM2NCIgY3g9IjIwLjEyMiIgZmlsbD0iI0NDRDZERCIvPgogIDxjaXJjbGUgaWQ9InN2Z18yMSIgcj0iMS41NDUiIGN5PSIzMy40MjUiIGN4PSIxMS44ODEiIGZpbGw9IiNDQ0Q2REQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMjIiIHI9IjEuMDMiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzI5MkYzMyIvPgogIDxnIGlkPSJzdmdfMjMiIGZpbGw9IiMyOTJGMzMiPgogICA8Y2lyY2xlIGlkPSJzdmdfMjQiIHI9IjAuNTE1IiBjeT0iMzAuNDcyIiBjeD0iMjAuNjM4Ii8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNSIgcj0iMC41MTUiIGN5PSIzMi4yNTYiIGN4PSIxOS42MDciLz4KICAgPGNpcmNsZSBpZD0ic3ZnXzI2IiByPSIwLjUxNSIgY3k9IjMwLjg0OSIgY3g9IjE5LjIzIi8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNyIgcj0iMC41MTUiIGN5PSIzMS44NzkiIGN4PSIyMS4wMTUiLz4KICA8L2c+CiAgPGNpcmNsZSBpZD0ic3ZnXzI4IiByPSIwLjc3MyIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzI5MkYzMyIvPgogIDxjaXJjbGUgaWQ9InN2Z18yOSIgcj0iMC41MTUiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzY2NzU3RiIvPgogPC9nPgo8L3N2Zz4=
// @homepageURL     https://github.com/ADJazzzz/BLSPAM
// @supportURL      https://github.com/ADJazzzz/BLSPAM/issues
// @match           *://live.bilibili.com/*
// @require         https://cdn.jsdelivr.net/npm/vue@3.5.27/dist/vue.global.prod.js
// @require         data:application/javascript,window.Vue%3DVue%3Bwindow.VueDemi%3DVue
// @require         https://cdn.jsdelivr.net/npm/pinia@3.0.4/dist/pinia.iife.prod.js
// @require         https://cdn.jsdelivr.net/npm/naive-ui@2.43.2/dist/index.prod.js
// @require         https://cdn.jsdelivr.net/npm/axios@1.13.3/dist/axios.min.js
// @require         https://cdn.jsdelivr.net/npm/lodash@4.17.23/lodash.min.js
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

  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
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
          clearInterval(timerPolling);
          clearTimeout(timerTimeout);
          resolve(ele);
        }
      }, interval);
      const timerTimeout = setTimeout(() => {
        clearInterval(timerPolling);
        reject(new Error(`在${timeout}ms内未发现对应元素 "${selectors}"`));
      }, timeout);
    });
  };
  const defaultValues = {
    ui: {
      activeMenuIndex: "TextView",
      isShowPanel: false,
      isCollapsed: true,
      theme: "light"
    },
    modules: {
      TextSpam: {
        enable: false,
        msg: "车",
        timeinterval: 5,
        textinterval: 20,
        timelimit: 0
      },
      EmotionSpam: {
        enable: false,
        timeinterval: 5,
        emotionViewSelectedID: 1,
        msg: [],
        timelimit: 0
      },
      Favorites: {
        enable: false,
        timeinterval: 5,
        favoritesTabsValue: 1,
        favoritesTabPanels: [
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
          enable: false,
          mode: "menu"
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
    module;
    get prefix() {
      const now = new Date();
      const time = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      return [
        `%c${this.NAME}%c[${time}][${this.module}]%c:`,
        "font-weight: bold; color: white; background-color: #23ade5; padding: 1px 4px; border-radius: 4px;",
        "font-weight: bold; color: #0093D3;",
        ""
      ];
    }
    log(...data) {
      console.log(...this.prefix, ...data);
    }
    info(...data) {
      console.info(...this.prefix, ...data);
    }
    warn(...data) {
      console.warn(...this.prefix, ...data);
    }
    error(...data) {
      console.error(...this.prefix, ...data);
    }
    constructor(module) {
      this.module = module.split("_").join("][");
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
          reject(this.logger.error("没有找到所需的 Cookie 值，请确保已登录。"));
        }
      });
    }
    async run() {
      useBiliStore().cookies = await this.getCookiesValue();
    }
  }
  axios.defaults.withCredentials = true;
  const BILIAPI = {
    sendMsg: async (msg, roomid, bubble = 0, color = 16777215, mode = 1, room_type = 0, jumpfrom = 0, reply_mid = 0, reply_attr = 0, replay_dmid = "", statistics = { appId: 100, platform: 5 }, reply_type = 0, reply_uname = "", data_extend = { trackid: "-99998" }, fontsize = 25) => {
      const biliStore = useBiliStore();
      const bili_jct = biliStore.cookies.bili_jct;
      const res = await axios.post(
        "https://api.live.bilibili.com/msg/send",
        {
          bubble,
          msg,
          color,
          mode,
          room_type,
          jumpfrom,
          reply_mid,
          reply_attr,
          replay_dmid,
          statistics,
          reply_type,
          reply_uname,
          data_extend,
          fontsize,
          rnd: Math.floor(Date.now() / 1e3),
          roomid,
          csrf: bili_jct,
          csrf_token: bili_jct
        },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data;
    },
    sendEmotion: async (msg, roomid, bubble = 0, color = 16777215, mode = 1, dm_type = 1, emoticonOptions = {}, data_extend = { trackid: "-99998" }, fontsize = 25) => {
      const biliStore = useBiliStore();
      const bili_jct = biliStore.cookies.bili_jct;
      const res = await axios.post(
        "https://api.live.bilibili.com/msg/send",
        {
          bubble,
          msg,
          color,
          mode,
          dm_type,
          emoticon_options: emoticonOptions,
          data_extend,
          fontsize,
          rnd: Math.floor(Date.now() / 1e3),
          roomid,
          csrf: bili_jct,
          csrf_token: bili_jct
        },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data;
    },
    getEmoticons: async (platform, room_id) => {
      const res = await axios.get(
        `https://api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=${platform}&room_id=${room_id}`
      );
      return res.data;
    },
    getInfoByUser: async (room_id) => {
      const res = await axios.get(
        `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${room_id}`
      );
      return res.data;
    },
    nav: async () => {
      const res = await axios.get(
        "https://api.bilibili.com/x/web-interface/nav"
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
    textConfig = this.moduleStore.moduleConfig.TextSpam;
    favoritesConfig = this.moduleStore.moduleConfig.Favorites;
    intervalId = null;
    timeLimitId = null;
    get roomId() {
      return useBiliStore().BilibiliLive?.ROOMID;
    }
    formatMsg(msg) {
      return msg.replace(/\n/g, "");
    }
    sliceMsg(msg, maxLength) {
      if (msg.length <= maxLength) return [msg];
      return msg.match(new RegExp(`.{1,${maxLength}}`, "g")) || [];
    }
    formatFavorites() {
      return _.flatMap(this.favoritesConfig.favoritesTabPanels, (item) => {
        if (!item.msg) return [];
        const processedMsg = this.formatMsg(item.msg);
        return this.sliceMsg(processedMsg, this.textConfig.textinterval);
      });
    }
    formatTime(seconds) {
      return seconds * 1e3;
    }
    cleanUP() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.timeLimitId) {
        clearTimeout(this.timeLimitId);
        this.timeLimitId = null;
      }
    }
    async sendMsg(message, roomid) {
      try {
        const response = await BILIAPI.sendMsg(message, roomid);
        const { notification } = useDiscreteAPI(
          ["notification"],
          !this.moduleStore.moduleConfig.setting.danmakuDetail.enable
        );
        if (response.code === 0) {
          this.logger.log(`弹幕 ${message} 发送成功`, response);
          return true;
        }
        this.logger.error(`弹幕 ${message} 发送失败`, response);
        notification.error({
          closable: false,
          content: `弹幕"${message}"发送失败: ${response.message}`,
          duration: 3e3
        });
        return false;
      } catch (error) {
        this.logger.error(`弹幕 ${message} 发送失败`, error);
        return false;
      }
    }
    createCycleSender(msgs, roomid, timeinterval, config) {
      let currentIndex = 0;
      const sendNext = async () => {
        if (!config.enable) {
          this.cleanUP();
          return;
        }
        await this.sendMsg(msgs[currentIndex], roomid);
        currentIndex = (currentIndex + 1) % msgs.length;
      };
      sendNext();
      this.intervalId = setInterval(sendNext, timeinterval);
    }
    async startTextSpam() {
      this.cleanUP();
      if (!this.roomId) return;
      const formattedMsg = this.formatMsg(this.textConfig.msg);
      const msgs = this.sliceMsg(formattedMsg, this.textConfig.textinterval);
      const timeinterval = this.formatTime(this.textConfig.timeinterval);
      const timelimit = this.formatTime(this.textConfig.timelimit);
      this.createCycleSender(msgs, this.roomId, timeinterval, this.textConfig);
      if (timelimit > 0) {
        this.timeLimitId = setTimeout(() => {
          this.stop("text");
        }, timelimit);
      }
    }
    async startFavoritesSpam() {
      this.cleanUP();
      if (!this.roomId) return;
      const msgs = this.formatFavorites();
      if (msgs.length === 0) return;
      const timeinterval = this.formatTime(this.favoritesConfig.timeinterval);
      this.createCycleSender(msgs, this.roomId, timeinterval, this.favoritesConfig);
    }
    stop(area) {
      const config = area === "text" ? this.textConfig : this.favoritesConfig;
      const log = area === "text" ? "文字独轮车已停止" : "收藏夹独轮车已停止";
      config.enable = false;
      this.cleanUP();
      this.logger.log(log);
    }
    async run() {
      this.moduleStore.emitter.off("TextSpam");
      this.moduleStore.emitter.off("Favorites");
      this.cleanUP();
      this.moduleStore.emitter.on("TextSpam", () => this.startTextSpam());
      this.moduleStore.emitter.on("Favorites", () => this.startFavoritesSpam());
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
          if (response.code === 0) {
            this.logger.log(`表情 ${emotion} 发送成功`, response);
          } else {
            this.logger.error(`表情 ${emotion} 发送失败`, response);
            notification.error({
              closable: false,
              content: `表情"${emotion}"发送失败: ${response.message}`,
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
        this.moduleStore.moduleConfig.Favorites.enable = false;
      }
    }
  }
  class checkUpdate extends BaseModule {
    config = this.moduleStore.moduleConfig.setting.autoCheckUpdate;
    async getLatestVersionRes() {
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "GET",
          url: "https://api.github.com/repos/ADJazzzz/BLSPAM/releases/latest",
          onload: (response) => {
            if (response.status === 200) {
              resolve({ response: JSON.parse(response.responseText) });
            } else {
              reject(this.logger.error("获取最新版本信息失败", response));
            }
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
  const _hoisted_1$8 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  };
  function render$6(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$8, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "currentColor",
        d: "M10 7H8v4H4v2h4v4h2v-4h4v-2h-4zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3z"
      }, null, -1)
    ])]);
  }
  const PlusIcon = { render: render$6 };
  const _hoisted_1$7 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  };
  function render$5(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$7, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "currentColor",
        d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
      }, null, -1)
    ])]);
  }
  const CopyIcon = { render: render$5 };
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
                if (this.config.mode === "menu") {
                  const msg = node.dataset.danmaku || "";
                  node.addEventListener("click", () => this.renderMenu(msg));
                } else {
                  this.renderDirectly(node);
                }
              }
            });
          });
        }).observe(dmArea, { childList: true, subtree: false });
      }
    }
    renderDirectly(node) {
      const msg = node.dataset.danmaku || "";
      const msgEle = node.querySelector(".danmaku-item-right");
      if (!msgEle) return;
      const btnContainer = document.createElement("div");
      btnContainer.style.cssText = "display: inline-block; vertical-align: middle;";
      msgEle.after(btnContainer);
      vue.render(
        vue.h(
          naive.NConfigProvider,
          {
            theme: useUIStore().uiConfig.theme === "dark" ? naive.darkTheme : naive.lightTheme,
            themeOverrides: {
              Button: {
                textColorHover: "#409eff",
                textColorFocus: "#409eff",
                textColorTextHover: "#409eff",
                textColorTextFocus: "#409eff"
              }
            },
            style: { marginLeft: "2px", paddingTop: "4px" }
          },
          {
            default: () => vue.h(vue.Fragment, [
              vue.h(
                naive.NButton,
                {
                  text: true,
                  focusable: false,
                  bordered: false,
                  style: {
                    marginLeft: "2px"
                  },
                  onClick: (e) => {
                    e.stopPropagation();
                    this.dmCopy(msg);
                  }
                },
                { default: () => vue.h(naive.NIcon, { component: CopyIcon, size: 16 }) }
              ),
              vue.h(
                naive.NButton,
                {
                  text: true,
                  focusable: false,
                  bordered: false,
                  onClick: (e) => {
                    e.stopPropagation();
                    this.dmRepeat(msg);
                  }
                },
                { default: () => vue.h(naive.NIcon, { component: PlusIcon, size: 16 }) }
              )
            ])
          }
        ),
        btnContainer
      );
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
          if (response.code === 0) {
            this.logger.log(`弹幕 ${msg} 发送成功`, response);
            message.success(`弹幕 ${msg} 发送成功`, { duration: 2500 });
          } else {
            this.logger.error(`弹幕 ${msg} 发送失败`, response);
            notification.error({
              closable: false,
              content: `弹幕"${msg}"发送失败: ${response.message}`,
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
          logger.warn(`重试次数: ${retryCount + 1}`, error);
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
  const _hoisted_1$6 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    viewBox: "0 0 32 32"
  };
  function render$4(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$6, [..._cache[0] || (_cache[0] = [
      vue.createStaticVNode('<path fill="#F3AD61" d="m4.891 11.302 9.541 3.474L8.61 6.46a.606.606 0 0 1 .99-.696l5.825 8.319V3.927c0-.334.272-.606.605-.606.334 0 .606.272.606.606v10.412l6.693-7.976a.605.605 0 1 1 .927.779l-6.527 7.778 9.806-2.63a.604.604 0 1 1 .31 1.17l-9.81 2.627 9.548 3.476a.605.605 0 1 1-.417 1.138l-9.538-3.474 5.823 8.318a.606.606 0 1 1-.994.692l-5.82-8.315v10.152a.605.605 0 1 1-1.212 0V17.668L8.732 25.64a.6.6 0 0 1-.85.073.605.605 0 0 1-.074-.852l6.526-7.777-9.811 2.625a.605.605 0 1 1-.31-1.167l9.808-2.627-9.543-3.476a.605.605 0 1 1 .413-1.138"></path><path fill="#A56953" d="M16.002 2C8.27 2 2 8.27 2 16.002c0 7.731 6.27 14.001 14.002 14.001 7.731 0 13.998-6.27 13.998-14.001C30 8.27 23.733 2 16.002 2m0 24.753c-6.222 0-10.769-4.533-10.769-10.755C5.233 9.777 9.78 5.22 16.002 5.22s10.765 4.557 10.765 10.778c-.003 6.226-4.543 10.755-10.765 10.755"></path><path fill="#6D4534" d="M16.002 5.737a10.24 10.24 0 0 1 9.456 6.267c.535 1.266.804 2.61.804 3.994s-.272 2.731-.804 3.994a10.2 10.2 0 0 1-2.2 3.264 10.23 10.23 0 0 1-7.256 3.003 10.228 10.228 0 0 1-7.257-3.003 10.23 10.23 0 0 1-3.004-7.258 10.228 10.228 0 0 1 3.004-7.257 10.23 10.23 0 0 1 7.257-3.004m0-1.003C9.78 4.734 4.734 9.78 4.734 16.001c0 6.222 5.046 11.268 11.268 11.268 6.221 0 11.267-5.046 11.267-11.268-.003-6.221-5.046-11.267-11.267-11.267"></path><path fill="#A56953" d="M16.002 19.377a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75"></path><path fill="#F3C07B" d="M16.002 17.576a1.574 1.574 0 1 0 0-3.148 1.574 1.574 0 0 0 0 3.148"></path>', 5)
    ])]);
  }
  const AppIcon = { render: render$4 };
  const _hoisted_1$5 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function render$3(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$5, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "#E1E8ED",
        d: "m32.415 9.586-9-9a2.001 2.001 0 0 0-2.829 2.829l-3.859 3.859 9 9 3.859-3.859a2 2 0 0 0 2.829-2.829"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#CCD6DD",
        d: "M22 0H7a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V11h-9c-1 0-2-1-2-2z"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#99AAB5",
        d: "M22 0h-2v9a4 4 0 0 0 4 4h9v-2h-9c-1 0-2-1-2-2zm-5 8a1 1 0 0 1-1 1H8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1m0 4a1 1 0 0 1-1 1H8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1m12 4a1 1 0 0 1-1 1H8a1 1 0 0 1 0-2h20a1 1 0 0 1 1 1m0 4a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h20a1 1 0 0 1 1 1m0 4a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h20a1 1 0 0 1 1 1m0 4a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h20a1 1 0 0 1 1 1"
      }, null, -1)
    ])]);
  }
  const TextIcon = { render: render$3 };
  const _hoisted_1$4 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$4, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("circle", {
        cx: "18",
        cy: "18",
        r: "18",
        fill: "#FFCC4D"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#65471B",
        d: "M6.001 11a1 1 0 0 1-.004-2c.156-.002 3.569-.086 6.205-3.6a1 1 0 0 1 1.6 1.2C10.539 10.95 6.185 11 6.001 11m24.986 2.393a1 1 0 0 1-1.945.468c-.038-.151-.911-3.452-4.941-5.201a1 1 0 0 1 .796-1.834c4.989 2.165 6.047 6.388 6.09 6.567"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#664500",
        d: "M23.186 29.526c-.993 0-1.952-.455-2.788-1.339-2.816-2.985-3.569-2.333-4.817-1.251-.781.679-1.754 1.523-3.205 1.523-2.351 0-3.969-2.302-4.036-2.4a1 1 0 0 1 1.644-1.14c.301.429 1.317 1.54 2.393 1.54.704 0 1.256-.479 1.895-1.033 1.816-1.578 3.764-2.655 7.583 1.388.823.873 1.452.774 1.908.592 1.659-.665 3.205-3.698 3.197-5.15a1 1 0 0 1 .994-1.005h.006a1 1 0 0 1 1 .995c.012 2.103-1.854 5.976-4.454 7.017a3.6 3.6 0 0 1-1.32.263"
      }, null, -1),
      vue.createElementVNode("path", {
        fill: "#65471B",
        d: "M14.815 15.375c-.584 2.114-1.642 3.083-3.152 2.666-1.509-.417-2.343-1.909-1.76-4.023.583-2.112 2.175-3.363 3.684-2.946 1.511.417 1.812 2.19 1.228 4.303m11.416-.755c.473 2.141-.675 4.838-2.204 5.176s-3.28-1.719-3.753-3.86.419-3.971 1.948-4.309 3.536.853 4.009 2.993"
      }, null, -1)
    ])]);
  }
  const EmotionIcon = { render: render$2 };
  const _hoisted_1$3 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$3, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "#FFAC33",
        d: "M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008 1.97 1.97 0 0 1-.721-2.194l3.034-9.792-8.062-5.681a1.98 1.98 0 0 1-.708-2.203 1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681 3.034 9.792a1.97 1.97 0 0 1-.72 2.194 1.96 1.96 0 0 1-1.16.379"
      }, null, -1)
    ])]);
  }
  const FavoritesIcon = { render: render$1 };
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 36 36"
  };
  function render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, [..._cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        fill: "#66757F",
        d: "M34 15h-3.362a12.9 12.9 0 0 0-1.582-3.814l2.379-2.379a2 2 0 0 0 0-2.829l-1.414-1.414a2 2 0 0 0-2.828 0l-2.379 2.379A13 13 0 0 0 21 5.362V2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v3.362a12.9 12.9 0 0 0-3.814 1.582L8.808 4.565a2 2 0 0 0-2.828 0L4.565 5.979a2 2 0 0 0-.001 2.829l2.379 2.379A12.9 12.9 0 0 0 5.362 15H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3.362a12.9 12.9 0 0 0 1.582 3.813l-2.379 2.379c-.78.78-.78 2.048.001 2.829l1.414 1.414c.78.78 2.047.78 2.828 0l2.379-2.379a12.9 12.9 0 0 0 3.814 1.582V34a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3.362a12.9 12.9 0 0 0 3.813-1.582l2.379 2.379a2 2 0 0 0 2.828 0l1.414-1.414a2 2 0 0 0 0-2.829l-2.379-2.379a12.9 12.9 0 0 0 1.582-3.814H34a2 2 0 0 0 2-2v-2A2 2 0 0 0 34 15M18 26a8 8 0 1 1 0-16 8 8 0 0 1 0 16"
      }, null, -1)
    ])]);
  }
  const SettingIcon = { render };
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
          label: "表情",
          key: "EmotionView",
          icon: renderIcon(EmotionIcon)
        },
        {
          label: "收藏夹",
          key: "FavoritesView",
          icon: renderIcon(FavoritesIcon)
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
  const _hoisted_1$1 = { style: { "display": "grid", "grid-template-columns": "repeat(auto-fill, minmax(32px, 1fr))", "gap": "8px", "padding": "8px" } };
  const _hoisted_2$1 = ["disabled"];
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
        tStop.stop("text");
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
                              placeholder: "默认5，单位为秒",
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
                            _cache[7] || (_cache[7] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为5秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
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
                }, null, 8, ["value"]),
                vue.createVNode(vue.unref(naive.NPopover), {
                  trigger: "click",
                  placement: "left",
                  style: { "width": "500px" }
                }, {
                  trigger: vue.withCtx(() => [
                    vue.createVNode(vue.unref(naive.NButton), {
                      text: "",
                      style: { "padding-left": "4px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(naive.NIcon), { size: 24 }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(vue.unref(EmotionIcon))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_1$1, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(biliStore).emotionData.find((data) => data.pkg_id === 100)?.emoticons, (data) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                          key: data.emoticon_id,
                          disabled: data.perm === 0
                        }, [
                          vue.createVNode(vue.unref(naive.NAvatar), {
                            color: vue.unref(uiStore).uiConfig.theme === "dark" ? "#48484E" : "white",
                            size: 24,
                            src: data.url,
                            "object-fit": "contain",
                            style: { "cursor": "pointer" },
                            onClick: ($event) => vue.unref(moduleStore).moduleConfig.TextSpam.msg += data.emoji
                          }, null, 8, ["color", "src", "onClick"])
                        ], 8, _hoisted_2$1);
                      }), 128))
                    ])
                  ]),
                  _: 1
                })
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
                                placeholder: "默认5，单位为秒",
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
                              _cache[7] || (_cache[7] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为5秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
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
    __name: "FavoritesView",
    setup(__props) {
      const moduleStore = useModuleStore();
      const uiStore = useUIStore();
      const message = naive.useMessage();
      const dialog = naive.useDialog();
      const favStop = new TextSpamer("StopFavoritesSpamer");
      const rules = {
        timeinterval: {
          required: true,
          message: "最小为1",
          trigger: ["input", "blur"],
          validator: () => {
            return moduleStore.moduleConfig.Favorites.timeinterval !== null;
          }
        }
      };
      const handleTabsValueUpdate = (value) => {
        moduleStore.moduleConfig.Favorites.favoritesTabsValue = value;
      };
      const closeDisable = vue.computed(() => {
        return moduleStore.moduleConfig.Favorites.favoritesTabPanels.length > 1;
      });
      const handleTabsAdd = () => {
        if (moduleStore.moduleConfig.Favorites.enable) {
          message.error("停车后才能添加");
        } else {
          const newKey = Math.max(
            ...moduleStore.moduleConfig.Favorites.favoritesTabPanels.map((panels) => panels.key)
          ) + 1;
          const newName = Math.max(
            ...moduleStore.moduleConfig.Favorites.favoritesTabPanels.map(
              (panels) => panels.name
            )
          ) + 1;
          moduleStore.moduleConfig.Favorites.favoritesTabPanels.push({
            key: newKey,
            name: newName,
            tab: "",
            msg: ""
          });
          moduleStore.moduleConfig.Favorites.favoritesTabsValue = newName;
        }
      };
      const handleTabsClose = (name) => {
        if (moduleStore.moduleConfig.Favorites.enable) {
          message.error("停车后才能删除");
        } else {
          dialog.warning({
            title: "删除",
            content: "确定要删除吗？",
            positiveText: "确定",
            negativeText: "再想想",
            onPositiveClick: () => {
              _.remove(moduleStore.moduleConfig.Favorites.favoritesTabPanels, { name });
              moduleStore.moduleConfig.Favorites.favoritesTabsValue = name - 1;
            }
          });
        }
      };
      const handleStartSpamer = () => {
        const panelsWithEmptyMsg = _.filter(
          moduleStore.moduleConfig.Favorites.favoritesTabPanels,
          (panels) => _.isEmpty(panels.msg)
        );
        if (!_.isEmpty(panelsWithEmptyMsg)) {
          _.forEach(panelsWithEmptyMsg, (panels) => {
            message.error(`${panels.tab}还没填内容呢`);
          });
        } else {
          if (moduleStore.moduleConfig.Favorites.timeinterval === null) {
            message.error("没参数你车什么?");
          } else {
            uiStore.uiConfig.isShowPanel = false;
            moduleStore.moduleConfig.Favorites.enable = true;
            moduleStore.emitter.emit("Favorites", {
              module: "Favorites"
            });
          }
        }
      };
      const handleStopSpamer = () => {
        favStop.stop("favorites");
      };
      const handleSendToText = () => {
        const currentTabValue = moduleStore.moduleConfig.Favorites.favoritesTabsValue;
        const currentPanel = moduleStore.moduleConfig.Favorites.favoritesTabPanels.find(
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
          disabled: vue.unref(moduleStore).moduleConfig.Favorites.enable
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(vue.unref(naive.NPageHeader), {
              subtitle: "收藏夹：这是一个收藏夹，当然你也可以车收藏夹😊",
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
                              value: vue.unref(moduleStore).moduleConfig.Favorites.timeinterval,
                              "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(moduleStore).moduleConfig.Favorites.timeinterval = $event),
                              placeholder: "默认5，单位为秒",
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
                            _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "弹幕发送时间间隔，默认为5秒，也是b站最快的发弹幕频率，当然这里可以设置小于该值", -1))
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
                  value: vue.unref(moduleStore).moduleConfig.Favorites.favoritesTabsValue,
                  "onUpdate:value": [
                    _cache[1] || (_cache[1] = ($event) => vue.unref(moduleStore).moduleConfig.Favorites.favoritesTabsValue = $event),
                    handleTabsValueUpdate
                  ],
                  addable: "",
                  closable: closeDisable.value,
                  onAdd: handleTabsAdd,
                  onClose: handleTabsClose
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(moduleStore).moduleConfig.Favorites.favoritesTabPanels, (panels) => {
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
                                placeholder: "默认每次弹幕发送字数为你文字独轮车设置的间隔，超出相应值将自动分割到下一条弹幕"
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
            !vue.unref(moduleStore).moduleConfig.Favorites.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
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
            vue.unref(moduleStore).moduleConfig.Favorites.enable ? (vue.openBlock(), vue.createBlock(vue.unref(naive.NFlex), {
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
          vue.h("span", "启用后，独轮车开关状态将会被保持，下次进入任意直播间时会自动恢复。"),
          vue.h("br"),
          vue.h("span", "该功能默认关闭。")
        ])
      },
      danmakuModules: {
        title: "弹幕+1和弹幕复制",
        content: () => vue.h("p", [
          vue.h("span", "菜单模式："),
          vue.h("br"),
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
          vue.h("span", "直接渲染模式："),
          vue.h("br"),
          vue.h(
            "span",
            "启用后，会在弹幕列表中直接渲染弹幕+1和弹幕复制按钮。（该功能只支持文字弹幕）"
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
    __name: "helpInfoDialog",
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
      const handleDanmakuModeChange = () => {
        if (moduleStore.moduleConfig.setting.danmakuModules.mode === "menu") {
          moduleStore.moduleConfig.setting.danmakuModules.mode = "direct";
        } else {
          moduleStore.moduleConfig.setting.danmakuModules.mode = "menu";
        }
      };
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
                  vue.createVNode(_sfc_main$3, { id: "SettingView.danmakuModules" }),
                  _cache[7] || (_cache[7] = vue.createTextVNode(" 目前模式为", -1)),
                  vue.createVNode(vue.unref(naive.NButton), {
                    focusable: false,
                    quaternary: "",
                    size: "tiny",
                    type: "info",
                    onClick: handleDanmakuModeChange
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(vue.unref(moduleStore).moduleConfig.setting.danmakuModules.mode === "menu" ? "菜单模式" : "直接渲染模式"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(vue.unref(naive.NFlex), { align: "center" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NSwitch), {
                    value: vue.unref(moduleStore).moduleConfig.setting.danmakuDetail.enable,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(moduleStore).moduleConfig.setting.danmakuDetail.enable = $event)
                  }, null, 8, ["value"]),
                  _cache[8] || (_cache[8] = vue.createTextVNode("显示弹幕详情", -1)),
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
                  _cache[10] || (_cache[10] = vue.createTextVNode("自动检测更新", -1)),
                  vue.createVNode(_sfc_main$3, { id: "SettingView.autoCheckUpdate" }),
                  vue.createVNode(vue.unref(naive.NButton), {
                    strong: "",
                    secondary: "",
                    round: "",
                    type: "primary",
                    onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(manualCheckUpdate).CheckUpdate("manual"))
                  }, {
                    default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
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
      FavoritesView: _sfc_main$4,
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
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
      const renderAppBtn = (ctrEleName, appStyle) => {
        pollingQuery(document, ctrEleName, 300, 1200).then((eleContent) => {
          const buttonNode = vue.h(
            naive.NButton,
            {
              class: "blspam_app_btn",
              text: true,
              style: appStyle,
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
                  offset: [-1, 2],
                  type: moduleStore.moduleConfig.TextSpam.enable || moduleStore.moduleConfig.EmotionSpam.enable || moduleStore.moduleConfig.Favorites.enable ? "success" : useBiliStore().loginInfo?.isLogin && useBiliStore().cookies ? "info" : "error"
                },
                {
                  default: () => vue.h(naive.NIcon, { component: AppIcon, size: 24 })
                }
              )
            }
          );
          vue.render(buttonNode, eleContent);
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
          renderAppBtn(".icon-left-part", {
            marginLeft: "4px",
            display: "inline-block"
          });
          observer.disconnect();
          logger.info("初始化完成");
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
    document.body.appendChild(div);
    app.mount(div);
  };

})(Vue, Pinia, naive, _, axios);