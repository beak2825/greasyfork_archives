// ==UserScript==
// @name         florr.io | Playtime counter
// @namespace    Furaken
// @version      2.0.5
// @description  Shows how no life you are
// @author       Furaken / sk
// @match        https://florr.io/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.3.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0
// @downloadURL https://update.greasyfork.org/scripts/460719/florrio%20%7C%20Playtime%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/460719/florrio%20%7C%20Playtime%20counter.meta.js
// ==/UserScript==

var getTodayDateLocalString = new Date().toString().substring(0,15),
    allAvailableServersNumber = 7,
    icons = {
        hamburger: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyBmaWxsPSIjZmZmZmZmIiB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPgoNPHBhdGggZD0iTTYuMDAxIDcuMTI4TDYgMTAuNDM4bDE5Ljk5OC0uMDA1TDI2IDcuMTI0ek02LjAwMSAyMS41NjZMNiAyNC44NzZsMTkuOTk4LS4wMDYuMDAyLTMuMzA4ek02LjAwMSAxNC4zNDFMNiAxNy42NWwxOS45OTgtLjAwNC4wMDItMy4zMDl6Ii8+Cg08L2c+Cg08L3N2Zz4=",
        brackets: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBkPSJNOSAyMUM3Ljg5NTQzIDIxIDcgMjAuMTA0NiA3IDE5VjE1LjMyNTVDNyAxNC44MzYzIDcgMTQuNTkxNyA2Ljk0NDc0IDE0LjM2MTVDNi44OTU3NSAxNC4xNTc1IDYuODE0OTQgMTMuOTYyNCA2LjcwNTI4IDEzLjc4MzRDNi41ODE2IDEzLjU4MTYgNi40MDg2MyAxMy40MDg2IDYuMDYyNzQgMTMuMDYyN0w1IDEyTDYuMDYyNzQgMTAuOTM3M0M2LjQwODY0IDEwLjU5MTQgNi41ODE2IDEwLjQxODQgNi43MDUyOCAxMC4yMTY2QzYuODE0OTQgMTAuMDM3NiA2Ljg5NTc1IDkuODQyNTQgNi45NDQ3NCA5LjYzODQ2QzcgOS40MDgyOSA3IDkuMTYzNyA3IDguNjc0NTJWNUM3IDMuODk1NDMgNy44OTU0MyAzIDkgM00xNSAyMUMxNi4xMDQ2IDIxIDE3IDIwLjEwNDYgMTcgMTlWMTUuMzI1NUMxNyAxNC44MzYzIDE3IDE0LjU5MTcgMTcuMDU1MyAxNC4zNjE1QzE3LjEwNDMgMTQuMTU3NSAxNy4xODUxIDEzLjk2MjQgMTcuMjk0NyAxMy43ODM0QzE3LjQxODQgMTMuNTgxNiAxNy41OTE0IDEzLjQwODYgMTcuOTM3MyAxMy4wNjI3TDE5IDEyTDE3LjkzNzMgMTAuOTM3M0MxNy41OTE0IDEwLjU5MTQgMTcuNDE4NCAxMC40MTg0IDE3LjI5NDcgMTAuMjE2NkMxNy4xODUxIDEwLjAzNzYgMTcuMTA0MyA5Ljg0MjU0IDE3LjA1NTMgOS42Mzg0NkMxNyA5LjQwODI5IDE3IDkuMTYzNyAxNyA4LjY3NDUyVjVDMTcgMy44OTU0MyAxNi4xMDQ2IDMgMTUgMyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+IDwvZz4KDTwvc3ZnPg==",
        palette: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBkPSJNMTUuNSA4LjVIMTUuNTFNMTAuNSA3LjVIMTAuNTFNNy41IDExLjVINy41MU0xMiAyMUM3LjAyOTQ0IDIxIDMgMTYuOTcwNiAzIDEyQzMgNy4wMjk0NCA3LjAyOTQ0IDMgMTIgM0MxNi45NzA2IDMgMjEgNy4wMjk0NCAyMSAxMkMyMSAxMy42NTY5IDE5LjY1NjkgMTUgMTggMTVIMTcuNEMxNy4wMjg0IDE1IDE2Ljg0MjYgMTUgMTYuNjg3MSAxNS4wMjQ2QzE1LjgzMTMgMTUuMTYwMiAxNS4xNjAyIDE1LjgzMTMgMTUuMDI0NiAxNi42ODcxQzE1IDE2Ljg0MjYgMTUgMTcuMDI4NCAxNSAxNy40VjE4QzE1IDE5LjY1NjkgMTMuNjU2OSAyMSAxMiAyMVpNMTYgOC41QzE2IDguNzc2MTQgMTUuNzc2MSA5IDE1LjUgOUMxNS4yMjM5IDkgMTUgOC43NzYxNCAxNSA4LjVDMTUgOC4yMjM4NiAxNS4yMjM5IDggMTUuNSA4QzE1Ljc3NjEgOCAxNiA4LjIyMzg2IDE2IDguNVpNMTEgNy41QzExIDcuNzc2MTQgMTAuNzc2MSA4IDEwLjUgOEMxMC4yMjM5IDggMTAgNy43NzYxNCAxMCA3LjVDMTAgNy4yMjM4NiAxMC4yMjM5IDcgMTAuNSA3QzEwLjc3NjEgNyAxMSA3LjIyMzg2IDExIDcuNVpNOCAxMS41QzggMTEuNzc2MSA3Ljc3NjE0IDEyIDcuNSAxMkM3LjIyMzg2IDEyIDcgMTEuNzc2MSA3IDExLjVDNyAxMS4yMjM5IDcuMjIzODYgMTEgNy41IDExQzcuNzc2MTQgMTEgOCAxMS4yMjM5IDggMTEuNVoiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4gPC9nPgoNPC9zdmc+",
        reset: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0LjAwIDI0LjAwIiBmaWxsPSJub25lIiB0cmFuc2Zvcm09InJvdGF0ZSgwKSIgc3Ryb2tlPSIjMDAwMDAwIj4KCjxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+Cgo8ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KCjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPHBhdGggZD0iTTIxIDNWOE0yMSA4SDE2TTIxIDhMMTggNS4yOTE2OEMxNi40MDc3IDMuODY2NTYgMTQuMzA1MSAzIDEyIDNDNy4wMjk0NCAzIDMgNy4wMjk0NCAzIDEyQzMgMTYuOTcwNiA3LjAyOTQ0IDIxIDEyIDIxQzE2LjI4MzIgMjEgMTkuODY3NSAxOC4wMDggMjAuNzc3IDE0IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+IDwvZz4KCjwvc3ZnPg==",
        cross: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyBmaWxsPSIjZmZmZmZmIiB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC4wMDAxNiI+Cg08ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgoNPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cg08ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxwYXRoIGQ9Ik0wIDE0LjU0NUwxLjQ1NSAxNiA4IDkuNDU1IDE0LjU0NSAxNiAxNiAxNC41NDUgOS40NTUgOCAxNiAxLjQ1NSAxNC41NDUgMCA4IDYuNTQ1IDEuNDU1IDAgMCAxLjQ1NSA2LjU0NSA4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+IDwvZz4KDTwvc3ZnPg==",
        eyeOpen: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KDTxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+Cg08ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KDTxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPHBhdGggZD0iTTE1LjAwMDcgMTJDMTUuMDAwNyAxMy42NTY5IDEzLjY1NzYgMTUgMTIuMDAwNyAxNUMxMC4zNDM5IDE1IDkuMDAwNzMgMTMuNjU2OSA5LjAwMDczIDEyQzkuMDAwNzMgMTAuMzQzMSAxMC4zNDM5IDkgMTIuMDAwNyA5QzEzLjY1NzYgOSAxNS4wMDA3IDEwLjM0MzEgMTUuMDAwNyAxMloiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4gPHBhdGggZD0iTTEyLjAwMTIgNUM3LjUyMzU0IDUgMy43MzMyNiA3Ljk0Mjg4IDIuNDU4OTggMTJDMy43MzMyNCAxNi4wNTcxIDcuNTIzNTQgMTkgMTIuMDAxMiAxOUMxNi40Nzg4IDE5IDIwLjI2OTEgMTYuMDU3MSAyMS41NDM0IDEyQzIwLjI2OTEgNy45NDI5MSAxNi40Nzg4IDUgMTIuMDAxMiA1WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPiA8L2c+Cg08L3N2Zz4=",
        eyeClose: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KDTxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+Cg08ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KDTxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPHBhdGggZD0iTTIuOTk5MDIgM0wyMC45OTkgMjFNOS44NDMzIDkuOTEzNjRDOS4zMjA2NiAxMC40NTM2IDguOTk5MDIgMTEuMTg5MiA4Ljk5OTAyIDEyQzguOTk5MDIgMTMuNjU2OSAxMC4zNDIyIDE1IDExLjk5OSAxNUMxMi44MjE1IDE1IDEzLjU2NjcgMTQuNjY5IDE0LjEwODYgMTQuMTMzTTYuNDk5MDIgNi42NDcxNUM0LjU5OTcyIDcuOTAwMzQgMy4xNTMwNSA5Ljc4Mzk0IDIuNDU3MDMgMTJDMy43MzEyOCAxNi4wNTcxIDcuNTIxNTkgMTkgMTEuOTk5MiAxOUMxMy45ODgxIDE5IDE1Ljg0MTQgMTguNDE5NCAxNy4zOTg4IDE3LjQxODRNMTAuOTk5IDUuMDQ5MzlDMTEuMzI4IDUuMDE2NzMgMTEuNjYxNyA1IDExLjk5OTIgNUMxNi40NzY5IDUgMjAuMjY3MiA3Ljk0MjkxIDIxLjU0MTQgMTJDMjEuMjYwNyAxMi44OTQgMjAuODU3NyAxMy43MzM4IDIwLjM1MjIgMTQuNSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPiA8L2c+Cg08L3N2Zz4=",
        capture: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBkPSJNMTIgMTZDMTMuNjU2OSAxNiAxNSAxNC42NTY5IDE1IDEzQzE1IDExLjM0MzEgMTMuNjU2OSAxMCAxMiAxMEMxMC4zNDMxIDEwIDkgMTEuMzQzMSA5IDEzQzkgMTQuNjU2OSAxMC4zNDMxIDE2IDEyIDE2WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+IDxwYXRoIGQ9Ik0zIDE2LjhWOS4yQzMgOC4wNzk5IDMgNy41MTk4NCAzLjIxNzk5IDcuMDkyMDJDMy40MDk3MyA2LjcxNTY5IDMuNzE1NjkgNi40MDk3MyA0LjA5MjAyIDYuMjE3OTlDNC41MTk4NCA2IDUuMDc5OSA2IDYuMiA2SDcuMjU0NjRDNy4zNzc1OCA2IDcuNDM5MDUgNiA3LjQ5NTc2IDUuOTkzNUM3Ljc5MTY2IDUuOTU5NjEgOC4wNTcwNSA1Ljc5NTU5IDguMjE5NjkgNS41NDYwOUM4LjI1MDg2IDUuNDk4MjcgOC4yNzgzNiA1LjQ0MzI4IDguMzMzMzMgNS4zMzMzM0M4LjQ0MzI5IDUuMTEzNDIgOC40OTgyNyA1LjAwMzQ2IDguNTYwNjIgNC45MDc4MkM4Ljg4NTkgNC40MDg4MiA5LjQxNjY4IDQuMDgwNzggMTAuMDA4NSA0LjAxMjk5QzEwLjEyMTkgNCAxMC4yNDQ4IDQgMTAuNDkwNyA0SDEzLjUwOTNDMTMuNzU1MiA0IDEzLjg3ODEgNCAxMy45OTE1IDQuMDEyOTlDMTQuNTgzMyA0LjA4MDc4IDE1LjExNDEgNC40MDg4MiAxNS40Mzk0IDQuOTA3ODJDMTUuNTAxNyA1LjAwMzQ1IDE1LjU1NjcgNS4xMTM0NSAxNS42NjY3IDUuMzMzMzNDMTUuNzIxNiA1LjQ0MzI5IDE1Ljc0OTEgNS40OTgyNyAxNS43ODAzIDUuNTQ2MDlDMTUuOTQzIDUuNzk1NTkgMTYuMjA4MyA1Ljk1OTYxIDE2LjUwNDIgNS45OTM1QzE2LjU2MSA2IDE2LjYyMjQgNiAxNi43NDU0IDZIMTcuOEMxOC45MjAxIDYgMTkuNDgwMiA2IDE5LjkwOCA2LjIxNzk5QzIwLjI4NDMgNi40MDk3MyAyMC41OTAzIDYuNzE1NjkgMjAuNzgyIDcuMDkyMDJDMjEgNy41MTk4NCAyMSA4LjA3OTkgMjEgOS4yVjE2LjhDMjEgMTcuOTIwMSAyMSAxOC40ODAyIDIwLjc4MiAxOC45MDhDMjAuNTkwMyAxOS4yODQzIDIwLjI4NDMgMTkuNTkwMyAxOS45MDggMTkuNzgyQzE5LjQ4MDIgMjAgMTguOTIwMSAyMCAxNy44IDIwSDYuMkM1LjA3OTkgMjAgNC41MTk4NCAyMCA0LjA5MjAyIDE5Ljc4MkMzLjcxNTY5IDE5LjU5MDMgMy40MDk3MyAxOS4yODQzIDMuMjE3OTkgMTguOTA4QzMgMTguNDgwMiAzIDE3LjkyMDEgMyAxNi44WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIuNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+IDwvZz4KDTwvc3ZnPg==",
        chart: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCA1MC44IDUwLjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIj4KDTxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+Cg08ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KDTxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPGcgc3R5bGU9ImRpc3BsYXk6aW5saW5lIj4gPHBhdGggZD0iTTcuODU0IDMzLjU0NiAxNiAyMi44OTNsNy41MiAxNi4yOTMgNi4yNjctMjcuNTcyIDMuNzYgOC43NzMgNS42NC02Ljg5MyAzLjc2IDguMTQ2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDo1LjA4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIvPiA8L2c+IDwvZz4KDTwvc3ZnPg=="
    },
    availableRegions = ["NA", "EU", "AS"],
    defaultColors = {
        "Garden": "#1EA761",
        "Desert": "#E0D1AF",
        "Ocean": "#66869E",
        "Jungle": "#3AA049",
        "Ant Hell": "#8E603F",
        "Sewers": "#752F08",
        "Hel / PvP": "#8F3838"
    },
    allAvailableMaps = Object.keys(defaultColors),
    defaultBarColors = {
        NA: "#EF476F",
        EU: "#FFD166",
        AS: "#06D6A0"
    },
    timeObject = JSON.stringify([
        {
            date: getTodayDateLocalString,
            region: {
                NA: 0,
                EU: 0,
                AS: 0
            },
            map: {
                Garden: 0
            }
        }
    ]),
    previewIndex = 0

function sumValuesInObject(obj) {
    var sum = 0
    for (var el in obj) {
        if(obj.hasOwnProperty(el)) {
            sum += Number(obj[el])
        }
    }
    return sum
}
function timeFormatting(input) {
    input = Number(input)
    var days = Math.floor(input / (24 * 60 * 60))
    var hours = Math.floor((input - days * (24 * 60 * 60)) / (60 * 60))
    var mins = Math.floor((input - days * (24 * 60 * 60) - hours * (60 * 60)) / 60)
    var seconds = input - days * (24 * 60 * 60) - hours * (60 * 60) - mins * 60
    seconds = Math.round(seconds * 100) / 100
    var output = `${days}d ${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}:${seconds < 10 ? "0" + seconds : seconds}`
    return output
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array()
    var dateArrayTemporary = new Array()
    var currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate).toString().slice(8, 10))
        dateArrayTemporary.push(new Date(currentDate).toString().slice(0, 15))
        currentDate = currentDate.addDays(1)
    }
    return {dateArray, dateArrayTemporary}
}

function calcColor(min, max, val) {
    var minHue = 240, maxHue = 0
    var curPercent = (val - min) / (max - min)
    var colString = "hsl(" + ((curPercent * (maxHue - minHue)) + minHue) + ",100%,50%)"
    return colString
}

let cp6 = unsafeWindow.cp6
let url = "";
const nativeWebsocketFinder = unsafeWindow.WebSocket;
unsafeWindow.WebSocket = function (...args) {
    const wss = new nativeWebsocketFinder(...args);
    url = wss.url
    return wss;
};

var currentServers = [],
    currentCodes = [],
    currentServerName = ""

function getCp6Codes() {
    for (let i = 0; i <= allAvailableServersNumber; i++) {
        fetch(`https://api.n.m28.io/endpoint/florrio-map-${i}-green/findEach/`).then((response) => response.json()).then((data) => {
            currentServers[i] = `${data.servers["vultr-miami"].id} ${data.servers["vultr-frankfurt"].id} ${data.servers["vultr-tokyo"].id}`
        });
    }
}
getCp6Codes()

function findCurrentServer() {
    var AlternativeWSS = url.slice(6, url.indexOf("."))
    if (!currentServers.join(" ").includes(AlternativeWSS)) getCp6Codes()
    currentServers.forEach((item, index) => {
        if (item.includes(AlternativeWSS)) {
            currentCodes = item.split(" ")
            if (AlternativeWSS == currentCodes[0]) currentServerName = "NA"
            else if (AlternativeWSS == currentCodes[1]) currentServerName = "EU"
            else if (AlternativeWSS == currentCodes[2]) currentServerName = "AS"
        }
    })
}

if (!localStorage.getItem("playtimeCounter2")) localStorage.setItem("playtimeCounter2", timeObject)
var thisTimeObject = JSON.parse(localStorage.getItem("playtimeCounter2"))

var FurakenContainer = document.createElement('div')
FurakenContainer.style = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 100%;
`
document.querySelector('body').appendChild(FurakenContainer)

var playtimeCounterContainer = document.createElement('div')
playtimeCounterContainer.className = "options-button"
playtimeCounterContainer.style = `
    background-color: #BB5555;
    width: fit-content;
    height: auto;
    border-radius: 5px;
    border: 6px solid rgba(0, 0, 0, 0.3);
    padding: 5px;
    position: absolute;
    bottom: 0;
    right: 0;
    color: white;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    font-family: 'Ubuntu';
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-align: center;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
    opacity: 0;
`
playtimeCounterContainer.innerHTML = `
    <div style="background-image: url(${icons.hamburger}); background-repeat: no-repeat; background-position: center; background-size: 35px; height: 30px; width: 30px;"></div>
`
playtimeCounterContainer.onclick = function() {
    playtimeCounterOptions.style.display = playtimeCounterOptions.style.display == "block" ? "none" : "block"
}
playtimeCounterContainer.onmouseover = function() {
    playtimeDataPreview.style.opacity = 1
    playtimeCounterContainer.style.opacity = 1
}
playtimeCounterContainer.onmouseout = function() {
    playtimeDataPreview.style.opacity = 0
    playtimeCounterContainer.style.opacity = 0
}
FurakenContainer.appendChild(playtimeCounterContainer)

var playtimeDataPreview = document.createElement('div')
playtimeDataPreview.className = "options-button"
playtimeDataPreview.style = `
    background-color: #BB5555;
    width: auto;
    height: 20px;
    line-height: 18px;
    border-radius: 5px;
    border: 6px solid rgba(0, 0, 0, 0.3);
    padding: 5px 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 60px;
    color: white;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    font-family: 'Ubuntu';
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-align: center;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
    opacity: 0;
    pointer-events: all;
`
playtimeDataPreview.innerHTML = "Fetching datas..."
playtimeDataPreview.onclick = function() {
    previewIndex = (previewIndex + 1) % 3
}
FurakenContainer.appendChild(playtimeDataPreview)

var playtimeCounterOptions = document.createElement('div')
playtimeCounterOptions.style = `
    height: auto;
    width: 30px;
    right: 0px;
    bottom: 60px;
    position: absolute;
    display: none;
`
FurakenContainer.appendChild(playtimeCounterOptions)

/*
var playtimeCounterOptions_EditableBox = document.createElement('div')
playtimeCounterOptions_EditableBox.contentEditable = "true"
playtimeCounterOptions_EditableBox.style = `
    overflow-y: auto;
    width: 300px;
    height: 83%;
    border-radius: 5px;
    background-color: #C52A61;
    border: 6px solid rgba(0, 0, 0, 0.3);
    position: absolute;
    margin-inline: -340px;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
    color: white;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    font-family: 'Ubuntu';
    font-size: 12px;
    padding: 10px;
`
playtimeCounterOptions.appendChild(playtimeCounterOptions_EditableBox)

var playtimeCounterOptions_Customize = document.createElement('div')
playtimeCounterOptions_Customize.innerHTML = `
    <div class="label">
        Customize
    </div>
`
playtimeCounterOptions.appendChild(playtimeCounterOptions_Customize)

var playtimeCounterOptions_Brackets = document.createElement('div')
playtimeCounterOptions_Brackets.innerHTML = `
    <div class="label">
        Datas
    </div>
`
playtimeCounterOptions.appendChild(playtimeCounterOptions_Brackets)
*/
var playtimeCounterOptions_Reset_Confirm = document.createElement('div')
playtimeCounterOptions_Reset_Confirm.innerHTML = `Clear all datas?`
playtimeCounterOptions_Reset_Confirm.className = "options-button"
playtimeCounterOptions_Reset_Confirm.style = `
    background-color: rgb(187, 85, 85);
    width: 100px;
    height: 20px;
    border-radius: 5px;
    border: 3px solid rgba(0, 0, 0, 0.3);
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.3) 5px 5px;
    transition: all 0.2s ease-in-out 0s;
    position: absolute;
    right: 34px;
    color: white;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
    font-family: 'Ubuntu';
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    padding: 2px 5px;
    display: none;
    z-index: 1;
`
playtimeCounterOptions_Reset_Confirm.onclick = function() {
    localStorage.setItem("playtimeCounter2", JSON.stringify([{
        date: getTodayDateLocalString,
        region: {
            NA: 0,
            EU: 0,
            AS: 0
        },
        map: {
            Garden: 0
        }
    }]))
}
playtimeCounterOptions.appendChild(playtimeCounterOptions_Reset_Confirm)

var playtimeCounterOptions_Reset = document.createElement('div')
playtimeCounterOptions_Reset.innerHTML = `
    <div class="label">
        Reset
    </div>
`
playtimeCounterOptions_Reset.onclick = function() {
    playtimeCounterOptions_Reset_Confirm.style.display = playtimeCounterOptions_Reset_Confirm.style.display == "block" ? "none" : "block"
    playtimeCounterOptions_Reset.style.backgroundImage = playtimeCounterOptions_Reset_Confirm.style.display == "block" ? `url(${icons.cross})` : `url(${icons.reset})`
}
playtimeCounterOptions.appendChild(playtimeCounterOptions_Reset)

var ifEyeClose = false
var playtimeCounterOptions_Eye = document.createElement('div')
playtimeCounterOptions_Eye.innerHTML = `
    <div class="label">
        Toggle
    </div>
`
playtimeCounterOptions_Eye.onclick = function() {
    if (ifEyeClose) {
        ifEyeClose = false
        playtimeCounterOptions_Eye.style.backgroundImage = `url(${icons.eyeOpen})`
        playtimeDataPreview.style.pointerEvents = "all"
        playtimeDataPreview.classList.add("alwaysShow")
        playtimeCounterContainer.classList.add("alwaysShow")
    } else {
        ifEyeClose = true
        playtimeCounterOptions_Eye.style.backgroundImage = `url(${icons.eyeClose})`
        playtimeDataPreview.style.pointerEvents = "none"
        playtimeDataPreview.classList.remove("alwaysShow")
        playtimeCounterContainer.classList.remove("alwaysShow")
    }
}
playtimeCounterOptions.appendChild(playtimeCounterOptions_Eye)

var playtimeCounterOptions_Capture = document.createElement('div')
playtimeCounterOptions_Capture.innerHTML = `
    <div class="label">
        Capture
    </div>
`
playtimeCounterOptions_Capture.onclick = function() {
    var graph = document.getElementById("lineGraph")
    var image = new Image()
    image.src = graph.toDataURL()
    var blank_ = window.open("")
    blank_.document.body.appendChild(image)
    blank_.document.body.style.margin = 0
}
playtimeCounterOptions.appendChild(playtimeCounterOptions_Capture)

var playtimeCounterOptions_Chart = document.createElement('div')
playtimeCounterOptions_Chart.innerHTML = `
    <div class="label">
        Chart
    </div>
`
playtimeCounterOptions_Chart.onclick = function() {
    playtimeChart.style.opacity == 1 ? 0 : updateChartData()
    playtimeChart.style.opacity = playtimeChart.style.opacity == 1 ? 0 : 1
    playtimeChart.style.pointerEvents = playtimeChart.style.pointerEvents == "all" ? "none" : "all"
}
playtimeCounterOptions.appendChild(playtimeCounterOptions_Chart);

[/*playtimeCounterOptions_Brackets, playtimeCounterOptions_Customize, */playtimeCounterOptions_Reset, playtimeCounterOptions_Eye, playtimeCounterOptions_Capture, playtimeCounterOptions_Chart].forEach(item => {
    item.className = "options-button label-con"
    item.style = `
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 3px solid rgba(0, 0, 0, 0.3);
        margin-bottom: 2px;
        background-size: 20px;
        background-repeat: no-repeat;
        background-position: center;
        padding: 2px;
        cursor: pointer;
        box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease-in-out;
    `
})

playtimeDataPreview.classList.add("alwaysShow")
playtimeCounterContainer.classList.add("alwaysShow")
/*
playtimeCounterOptions_Customize.style.backgroundImage = `url(${icons.palette})`
playtimeCounterOptions_Customize.style.backgroundColor = `#C52A61`
playtimeCounterOptions_Brackets.style.backgroundImage = `url(${icons.brackets})`
playtimeCounterOptions_Brackets.style.backgroundColor = `#FFD166`
*/
playtimeCounterOptions_Reset.style.backgroundImage = `url(${icons.reset})`
playtimeCounterOptions_Reset.style.backgroundColor = `#BB5555`
playtimeCounterOptions_Eye.style.backgroundImage = `url(${icons.eyeOpen})`
playtimeCounterOptions_Eye.style.backgroundColor = `#2ACACC`
playtimeCounterOptions_Capture.style.backgroundImage = `url(${icons.capture})`
playtimeCounterOptions_Capture.style.backgroundColor = `#E83473`
playtimeCounterOptions_Chart.style.backgroundImage = `url(${icons.chart})`
playtimeCounterOptions_Chart.style.backgroundColor = `#2BFFA3`

var playtimeChart = document.createElement('div')
playtimeChart.style = `
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 100;
    top: 0;
    margin: 0;
    opacity: 0;
    transform: scale(0.9);
    transition: 0.4s ease-in-out;
    pointer-events: none;
`
playtimeChart.innerHTML = `
    <canvas id="lineGraph" style="border-radius: 15px;transition: 0.4s ease-in-out;position: absolute;z-index: 1;"></canvas>
`
document.querySelector('body').appendChild(playtimeChart)

Chart.defaults.font.family = 'Ubuntu';
Chart.defaults.font.size = 15;
Chart.defaults.font.weight = 600;
Chart.defaults.color = '#E7E7E7';
var lineGraph = new Chart(document.getElementById('lineGraph'), {
    data: {
        labels: [""],
        datasets: [{
            type: "line",
            data: [],
            label: ""
        }]
    },
    options: {
        // animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            customCanvasBackgroundColor: {
                color: "#2A2A2A",
            },
            legend: {
                labels: {
                    boxWidth: 15,
                    boxHeight: 15
                },
                position: "top"
            },
            datalabels: {
                formatter: (value, context) => {
                    if (context.dataset.label == "Total" && value != 0) return value.toFixed(2)
                    else if (context.dataset.label == "Average" && context.dataIndex == 0) return value.toFixed(2)
                    else return ""
                },
                color: "#E7E7E7",
                font: {
                    size: 12,
                    weight: 600
                },
                align: 'end'
            }
        },
        layout: {
            padding: 50
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: ["Date", `Last 30 days - ${new Date().toString().slice(4, 7)}`]
                },
                grid: {
                    color: "#E7E7E71A"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Hours"
                },
                grid: {
                    color: "#E7E7E71A"
                },
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
        },
    },
    plugins: [{
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = options.color || '#000000';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }, ChartDataLabels]
});

function updateChartData() {
    var priorDate = new Date()
    priorDate.setDate(priorDate.getDate() - 29)
    priorDate = new Date(priorDate.toString().slice(0, 15))

    var today = new Date(new Date().toString().slice(0, 15))
    var temporaryTimeObjForChart = JSON.parse(localStorage.getItem("playtimeCounter2")),
        chartLabels = getDates(priorDate, today).dateArray,
        matchingDateArray = getDates(priorDate, today).dateArrayTemporary,
        chartDataSets = [],
        chartRegionDataSets = [],
        dataOfDataSets = [],
        totalPlaytimeData = [],
        averagePlaytimeData = []

    for (let index = 0; index < allAvailableMaps.length; index++) {
        chartDataSets[index] = {
            type: "line",
            label: allAvailableMaps[index] + "​",
            data: [],
            borderColor: defaultColors[allAvailableMaps[index]],
            borderWidth: 2.5,
            tension: 0.3
        }
        for (let i = 0; i < chartLabels.length; i++) {
            chartDataSets[index].data.push(0)
        }
    }

    for (let index = 0; index < availableRegions.length; index++) {
        chartRegionDataSets[index] = {
            type: "bar",
            label: availableRegions[index] + "​",
            data: [],
            fill: true,
            backgroundColor: defaultBarColors[availableRegions[index]],
        }
        for (let i = 0; i < chartLabels.length; i++) {
            chartRegionDataSets[index].data.push(0)
        }
    }

    temporaryTimeObjForChart.forEach((item, index) => {
        if (matchingDateArray.includes(item.date)) {
            for (const property in temporaryTimeObjForChart[index].map) {
                chartDataSets[allAvailableMaps.indexOf(property)].data[matchingDateArray.indexOf(item.date)] = temporaryTimeObjForChart[index].map[property] / 3600
                if (!totalPlaytimeData[matchingDateArray.indexOf(item.date)]) totalPlaytimeData[matchingDateArray.indexOf(item.date)] = 0
                totalPlaytimeData[matchingDateArray.indexOf(item.date)] += temporaryTimeObjForChart[index].map[property] / 3600
            }
            for (const property in temporaryTimeObjForChart[index].region) chartRegionDataSets[availableRegions.indexOf(property)].data[matchingDateArray.indexOf(item.date)] = temporaryTimeObjForChart[index].region[property] / 3600
        }
    })

    var thisIndex = 0,
        thisChartDataSetsLength = chartDataSets.length
    for (let i = 0; i < thisChartDataSetsLength; i++) {
        var isAllZero = chartDataSets[thisIndex].data.every(item => item == 0)
        if (isAllZero) {
            chartDataSets.splice(chartDataSets.indexOf(chartDataSets[thisIndex]), 1)
            thisIndex--
        }
        thisIndex++
    }

    totalPlaytimeData = Array.from(totalPlaytimeData, item => item || 0)
    var sumOfTotalPlaytimeData = totalPlaytimeData.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)
    sumOfTotalPlaytimeData = sumOfTotalPlaytimeData / 30
    for (let i = 0; i < matchingDateArray.length; i++) averagePlaytimeData.push(sumOfTotalPlaytimeData)

    chartDataSets.unshift({
        type: "line",
        label: "Average",
        data: averagePlaytimeData,
        borderColor: "#2BFFA399",
        borderWidth: 3,
        pointRadius: 0
    })
    chartDataSets.unshift({
        type: "line",
        label: "Total",
        data: totalPlaytimeData,
        borderColor: "#E7E7E7",
        borderWidth: 3,
        tension: 0.3
    })
    chartDataSets = chartDataSets.concat(chartRegionDataSets)

    lineGraph.data.labels = chartLabels
    lineGraph.data.datasets = chartDataSets
    lineGraph.update()
}

// Credit to: Florr.io 汉化
function getFlorrioCanvas() {
    if (typeof (OffscreenCanvasRenderingContext2D) == 'undefined') {
        return [CanvasRenderingContext2D]
    }
    return [OffscreenCanvasRenderingContext2D, CanvasRenderingContext2D];
}

for (const { prototype } of getFlorrioCanvas()) {
    if (prototype.getArcPrototype == undefined) {
        prototype.getFillTextPrototype = prototype.fillText;
    } else { break }
}

var lastMapName,
    thisStartTime = 0,
    lastRegion,
    thisStartTimeOfRegions = 0,
    lastOnScreenTime = Date.now(),
    og_text

for (const { prototype } of getFlorrioCanvas()) {
    prototype.fillText = function(text, x, y) {
        if (allAvailableMaps.includes(text) || /\b([0-9]|[1-9][0-9])\b Flowers?/.test(text)) {
            if (/\b([0-9]|[1-9][0-9])\b Flowers?/.test(text)) {
                og_text = text
                text = "Hel / PvP"
            } else og_text = text
            lastOnScreenTime = Date.now()
            thisTimeObject = JSON.parse(localStorage.getItem("playtimeCounter2"))
            if (!thisTimeObject[0].map[text]) thisTimeObject[0].map[text] = 0
            if (lastMapName != text) thisStartTime = Date.now() - thisTimeObject[0].map[text] * 1000
            if (lastRegion != currentServerName) thisStartTimeOfRegions = Date.now() - thisTimeObject[0].region[currentServerName] * 1000
            var thisDelta = Date.now() - thisStartTime
            var thisDeltaOfRegions = Date.now() - thisStartTimeOfRegions
            thisTimeObject[0].map[text] = Math.floor(thisDelta / 1000)
            thisTimeObject[0].region[currentServerName] = Math.floor(thisDeltaOfRegions / 1000)
            lastMapName = text
            lastRegion = currentServerName
            localStorage.setItem("playtimeCounter2", JSON.stringify(thisTimeObject))
            var totalPlaytime = 0,
                thisMapPlaytime = 0
            thisTimeObject.forEach(item => {
                totalPlaytime += sumValuesInObject(item.map)
                thisMapPlaytime += item.map[text] == null ? 0 : item.map[text]
            })
            var playtimeDatasArray = [
                `<td>Since ${thisTimeObject[thisTimeObject.length - 1].date}:</td><td>${timeFormatting(totalPlaytime)}</td>`,
                `<td>${text}:</td><td>${timeFormatting(thisMapPlaytime)}</td>`,
                `<td>Today:</td><td>${timeFormatting(sumValuesInObject(thisTimeObject[0].map)).slice(3)}</td>`
            ]
            playtimeDataPreview.innerHTML = `
                <table style="border-spacing: 15px 0; pointer-events: none;">
                    <tr>
                        ${playtimeDatasArray[previewIndex]}
                    </tr>
                </table>
            `
            text = og_text
        }
        return this.getFillTextPrototype(text, x, y);
    }
}

document.querySelector('canvas').onclick = function() {
    playtimeChart.style.display = "none"
}

var WSSArray = []
setInterval(() => {
    WSSArray.unshift(url)
    if (WSSArray.length > 2) WSSArray.splice(2)
    if (WSSArray[WSSArray.length - 1] != WSSArray[0]) findCurrentServer()

    getTodayDateLocalString = new Date().toString().substring(0,15)
    var temporaryTimeObj = JSON.parse(localStorage.getItem("playtimeCounter2"))
    temporaryTimeObj = temporaryTimeObj.filter((value, index, self) => index === self.findIndex((t) => (
        t.date == value.date
    )))
    localStorage.setItem("playtimeCounter2", JSON.stringify(temporaryTimeObj))

    if (Date.now() - lastOnScreenTime > 1000 && lastMapName != "Hel / PvP") {
        thisStartTime = Date.now() - thisTimeObject[0].map[lastMapName] * 1000
        thisStartTimeOfRegions = Date.now() - thisTimeObject[0].region[currentServerName] * 1000
    }

    if (temporaryTimeObj[0].date != getTodayDateLocalString) {
        thisStartTime = Date.now()
        thisStartTimeOfRegions = Date.now()
        temporaryTimeObj.unshift({
            date: getTodayDateLocalString,
            region: {
                NA: 0,
                EU: 0,
                AS: 0
            },
            map: {
                Garden: 0
            }
        })
        localStorage.setItem("playtimeCounter2", JSON.stringify(temporaryTimeObj))
    }
}, 1000)

GM_addStyle(`
    .alwaysShow {
        opacity: 1!important
    }
    .options-button:hover {
        filter: brightness(1.1)
    }
    .label {
        pointer-events: none;
        z-index: 1;
        width: fit-content;
        height: auto;
        line-height: 14px;
        padding: 5px 15px;
        background: rgba(0, 0, 0, 0.5);
        text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
        font-family: 'Ubuntu';
        color: white;
        position: absolute;
        right: 130%;
        margin-block: -1px;
        border-radius: 5px;
        font-size: 12px;
        transition: all 0.3s ease-in-out;
        opacity: 0;
    }
    .label-con:hover .label {
        opacity: 1;
    }
`)