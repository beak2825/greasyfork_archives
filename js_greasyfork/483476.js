// ==UserScript==
// @name         微媒开发者工具
// @namespace    https://update.greasyfork.org/scripts/483476/%E5%BE%AE%E5%AA%92%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7.user.js
// @version      0.5.47
// @description  开发者工具
// @author       天火流光
// @match        *://*.wmnetwork.cc/*
// @match        *://*.tapd.cn/*
// @match        *://element.eleme.cn/*
// @match        *://*.iconfont.cn/*
// @match        *://*.apifox.com/*
// @match        *://*.apifox.cn/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzAzOTg4NTE3MzU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgyNzQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC5zZWFyY2hfaW5kZXguMC5pNS40MDY3M2E4MWdpWllqYyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xOTYuMjYgNzMzLjc0Yy00My45MiAwLTc5LjY0IDM1LjcyLTc5LjY0IDc5LjY0IDAgNDMuOSAzNS43MiA3OS42MiA3OS42NCA3OS42MiA0My45IDAgNzkuNjItMzUuNzIgNzkuNjItNzkuNjIgMC00My45Mi0zNS43Mi03OS42NC03OS42Mi03OS42NHogbTAgMTM5LjI2Yy0zMi44OCAwLTU5LjY0LTI2Ljc2LTU5LjY0LTU5LjYyIDAtMzIuODggMjYuNzYtNTkuNjQgNTkuNjQtNTkuNjQgMzIuODYgMCA1OS42MiAyNi43NiA1OS42MiA1OS42NCAwIDMyLjg2LTI2Ljc2IDU5LjYyLTU5LjYyIDU5LjYyeiIgZmlsbD0iIzIzMTMwRCIgcC1pZD0iODI3NSI+PC9wYXRoPjxwYXRoIGQ9Ik05MjQuNDYgNzUzLjhMNjYxLjIyIDQ5MC41Nmw5Ni40Mi0xMDYuNTJjOS4yNCAxLjU4IDE4LjQ4IDIuNDIgMjcuNjYgMi40MiA0Mi40NiAwIDgzLjU0LTE2LjcgMTE0LjI4LTQ3LjQ0IDQ2LjA4LTQ2LjEgNjAuMDYtMTE0LjkgMzUuNTgtMTc1LjMyYTguNTYgOC41NiAwIDAgMC0wLjk0LTEuOCA5Ljc2IDkuNzYgMCAwIDAtMi43OC0yLjhjLTAuMjQtMC4xNi0wLjUtMC4yOC0wLjc2LTAuNC0wLjMyLTAuMTgtMC42Mi0wLjM4LTAuOTYtMC41Mi0wLjI4LTAuMTItMC41OC0wLjE4LTAuODgtMC4yOC0wLjMyLTAuMS0wLjY0LTAuMjItMC45OC0wLjI4LTAuMjYtMC4wNi0wLjU0LTAuMDYtMC44LTAuMS0wLjM4LTAuMDQtMC43NC0wLjEtMS4xMi0wLjEtMC4yOCAwLTAuNTggMC4wNi0wLjg2IDAuMDgtMC4zNiAwLjAyLTAuNyAwLjAyLTEuMDYgMC4xLTEuMjggMC4yNC0yLjUyIDAuNzQtMy42NiAxLjQ4LTAuNTYgMC4zOC0xLjA4IDAuOC0xLjU2IDEuMjhsLTExNC43NCAxMTQuNzQtNjkuNTYtNjkuNTQgMTE0Ljc2LTExNC43NmE5Ljg2IDkuODYgMCAwIDAgMi43Ni01LjIyYzAuMDYtMC4zIDAuMDYtMC41OCAwLjA4LTAuODggMC4wNC0wLjM0IDAuMS0wLjcgMC4xLTEuMDQtMC4wMi0wLjM0LTAuMDYtMC42Ni0wLjEtMC45OC0wLjA0LTAuMzItMC4wNC0wLjY0LTAuMS0wLjk0LTAuMDgtMC4zLTAuMTgtMC42LTAuMjgtMC44OC0wLjA4LTAuMzQtMC4xNi0wLjY2LTAuMy0wLjk4LTAuMTItMC4zMi0wLjMtMC42LTAuNDgtMC45LTAuMTQtMC4yNi0wLjI2LTAuNTQtMC40Mi0wLjgtMC43Mi0xLjEtMS42OC0yLjA0LTIuOC0yLjgtMC41Ni0wLjM4LTEuMTYtMC42OC0xLjc4LTAuOTQtNjAuNDItMjQuNDYtMTI5LjI0LTEwLjUtMTc1LjM0IDM1LjYtMzcuNCAzNy4zOC01NCA5MC4wOC00NS4wNCAxNDEuOThsLTE2NC40OCAxNDguOS0yMTguNi0yMTguNTgtMjcuNTQtNzEuNTZhOS45NjggOS45NjggMCAwIDAtNS4xMi01LjQ4TDEyNS41IDY2LjJjLTMuOC0xLjc2LTguMy0wLjk4LTExLjI4IDJMNjYuODggMTE1LjU0YTkuOTk2IDkuOTk2IDAgMCAwLTIgMTEuMjhsMzkuMSA4NC4zMmMxLjA4IDIuMzYgMy4wNiA0LjIgNS40OCA1LjE0TDE4MSAyNDMuOGwyMTUuNTQgMjE1LjUyTDEwNS45IDcyMi4zNGMtMC4wNiAwLjA2LTAuMTIgMC4xNC0wLjE4IDAuMi0wLjA2IDAuMDQtMC4xMiAwLjA4LTAuMTYgMC4xMi01MCA1MC4wMi01MCAxMzEuNCAwIDE4MS40IDI1IDI1IDU3Ljg0IDM3LjUgOTAuNyAzNy41IDMyLjg0IDAgNjUuNjgtMTIuNSA5MC42OC0zNy41IDAuMDYtMC4wNCAwLjEtMC4xMiAwLjE2LTAuMThzMC4xNC0wLjEgMC4yLTAuMThsMjEwLjUtMjMyLjYgMjU0LjY4IDI1NC42OGMyMi45NiAyMi45NiA1My40OCAzNS42IDg1Ljk2IDM1LjZzNjMuMDItMTIuNjQgODUuOTgtMzUuNjJjMjIuOTgtMjIuOTYgMzUuNjItNTMuNSAzNS42NC04NS45OCAwLTMyLjQ4LTEyLjY0LTYzLjAyLTM1LjYtODUuOTh6TTY0My4xNCAyNjMuMWwwLjI0LTAuM2MwLjItMC4xOCAwLjM4LTAuNCAwLjU2LTAuNiAwLjI2LTAuMyAwLjUyLTAuNiAwLjcyLTAuOSAwLjE0LTAuMiAwLjI2LTAuNDIgMC4zOC0wLjYyIDAuMi0wLjM2IDAuNC0wLjcgMC41Ni0xLjA4IDAuMS0wLjIyIDAuMTYtMC40NiAwLjI0LTAuNjggMC4xMi0wLjM4IDAuMjYtMC43NCAwLjM0LTEuMTIgMC4wNC0wLjI2IDAuMDgtMC41NCAwLjEtMC44IDAuMDYtMC4zOCAwLjEtMC43NCAwLjEyLTEuMTIgMC0wLjI4LTAuMDItMC41NC0wLjA0LTAuOC0wLjAyLTAuNC0wLjA2LTAuNzgtMC4xMi0xLjE4LTAuMDItMC4xLTAuMDItMC4xOC0wLjA0LTAuMjgtOS44NC00Ny4wOCA0LjU2LTk1LjQ4IDM4LjU0LTEyOS40NGExNDEuNzA4IDE0MS43MDggMCAwIDEgMTM5LjA2LTM2LjIybC0xMTAuNSAxMTAuNTJhOS45NyA5Ljk3IDAgMCAwIDAgMTQuMTRsODMuNjggODMuN2MxLjg4IDEuODggNC40MiAyLjkyIDcuMDggMi45MiAyLjY0IDAgNS4xOC0xLjA0IDcuMDYtMi45MmwxMTAuNTItMTEwLjUyYzEzLjk2IDQ5LjE2IDAuNTIgMTAyLjM2LTM2LjIyIDEzOS4wOC0zMy45NiAzMy45OC04Mi4zNCA0OC4zOC0xMjkuNDIgMzguNTItMC4xMi0wLjAyLTAuMjIgMC0wLjMyLTAuMDJhNy43NCA3Ljc0IDAgMCAwLTAuOTgtMC4xYy0wLjM0LTAuMDQtMC42OC0wLjA2LTEuMDItMC4wNi0wLjI4IDAuMDItMC41MiAwLjA2LTAuNzggMC4wOC0wLjQgMC4wNC0wLjc4IDAuMDgtMS4xNiAwLjE2LTAuMjQgMC4wNi0wLjQ2IDAuMTQtMC42OCAwLjIyLTAuNCAwLjEyLTAuNzggMC4yMi0xLjE0IDAuNC0wLjIyIDAuMDgtMC40MiAwLjIyLTAuNjQgMC4zMi0wLjM2IDAuMi0wLjcyIDAuNC0xLjA2IDAuNjQtMC4xOCAwLjEyLTAuMzQgMC4yNi0wLjUyIDAuNC0wLjM0IDAuMjgtMC42OCAwLjU4LTEgMC45Mi0wLjA0IDAuMDQtMC4xIDAuMDgtMC4xNiAwLjE0bC05OS40OCAxMDkuOS0xOS40LTE5LjRhMTAuMDA2IDEwLjAwNiAwIDAgMC03LjA4LTIuOTRjLTIuNjYgMC01LjIgMS4wNi03LjA2IDIuOTRsLTQ4LjE4IDQ4LjE4LTkwLjEtOTAuMSAxNjcuOS0xNTEuOTh6TTE5My42MiAyMjguMTRjLTAuMDItMC4wMi0wLjA2LTAuMDQtMC4wOC0wLjA2LTAuMTgtMC4xOC0wLjM4LTAuMy0wLjU2LTAuNDYtMC4zMi0wLjI4LTAuNjYtMC41OC0xLjAyLTAuOC0wLjAyLTAuMDItMC4wOC0wLjA0LTAuMS0wLjA2LTAuNTQtMC4zNC0xLjEtMC42Mi0xLjctMC44NmgtMC4wMkwxMjAuNDIgMTk5LjA2IDg1Ljk2IDEyNC43NGwzNy40Ni0zNy40NiA3NC4zIDM0LjQ2IDI2LjgyIDY5LjY0YzAuNDQgMS4yIDEuMTQgMi4zMiAyLjA2IDMuMyAwLjA0IDAuMDQgMC4wOCAwLjEgMC4xMiAwLjE0IDAuMDQgMC4wNCAwLjA2IDAuMDggMC4xIDAuMTJMNTUxLjIgNTE5LjMyIDUxOCA1NTIuNSAxOTMuNjIgMjI4LjE0eiBtNzkuMTIgNjYxLjg0Yy00Mi4yMiA0Mi4xNC0xMTAuODQgNDIuMTItMTUzLjA0LTAuMDYtNDIuMTgtNDIuMTgtNDIuMi0xMTAuODItMC4wNi0xNTMuMDRsMjkxLjA2LTI2My40IDkzLjE2IDkzLjE2LTQ4LjE4IDQ4LjJhOS45NyA5Ljk3IDAgMCAwIDAgMTQuMTRsMjcuOTYgMjcuOTYtMjEwLjkgMjMzLjA0eiBtNjM3LjU0IDIxLjY0Yy0xOS4xOCAxOS4yLTQ0LjcgMjkuNzYtNzEuODQgMjkuNzZzLTUyLjY0LTEwLjU2LTcxLjgyLTI5Ljc0TDUwNC4xNiA2NDkuMTh2LTAuMDJoLTAuMDJsLTI3LjI2LTI3LjI2IDE0My43LTE0My43IDI4OS43NCAyODkuNzRjMTkuMTggMTkuMTggMjkuNzQgNDQuNyAyOS43NCA3MS44NC0wLjAyIDI3LjE0LTEwLjU4IDUyLjY0LTI5Ljc4IDcxLjg0eiIgZmlsbD0iIzIzMTMwRCIgcC1pZD0iODI3NiI+PC9wYXRoPjxwYXRoIGQ9Ik05MTAuMzIgNzY3Ljk0TDYyMC41OCA0NzguMmwtMTQzLjcgMTQzLjcgMjcuMjYgMjcuMjZoMC4wMnYwLjAybDI2Mi40NiAyNjIuNDZjMTkuMTggMTkuMTggNDQuNjggMjkuNzQgNzEuODIgMjkuNzQgMjcuMTQgMCA1Mi42Ni0xMC41NiA3MS44NC0yOS43NiAxOS4yLTE5LjIgMjkuNzYtNDQuNyAyOS43OC03MS44NCAwLTI3LjE0LTEwLjU2LTUyLjY2LTI5Ljc0LTcxLjg0eiBtLTgzLjUgMTA3LjU0YTkuODggOS44OCAwIDAgMS03LjA2IDIuOTIgOS45NiA5Ljk2IDAgMCAxLTcuMDgtMi45Mkw1NjIuMzggNjI1LjE2YTkuOTcgOS45NyAwIDAgMSAwLTE0LjE0IDEwLjAwNiAxMC4wMDYgMCAwIDEgMTQuMTQgMGwyNTAuMyAyNTAuMzJhMTAuMDA2IDEwLjAwNiAwIDAgMSAwIDE0LjE0eiBtNDcuMzQtNDcuMzJjLTEuOTQgMS45NC00LjUgMi45Mi03LjA2IDIuOTItMi41NiAwLTUuMTItMC45OC03LjA4LTIuOTJMNjA5LjcgNTc3Ljg0YTEwLjAwNiAxMC4wMDYgMCAwIDEgMC0xNC4xNCA5Ljk3IDkuOTcgMCAwIDEgMTQuMTQgMGwyNTAuMzIgMjUwLjMyYTkuOTcgOS45NyAwIDAgMSAwIDE0LjE0eiIgZmlsbD0iI0Y5QzEzOSIgcC1pZD0iODI3NyIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC5zZWFyY2hfaW5kZXguMC5pNi40MDY3M2E4MWdpWllqYyI+PC9wYXRoPjxwYXRoIGQ9Ik05MTAuMzIgNzY3Ljk0TDYyMC41OCA0NzguMmwtMjUgMjUgMjg5Ljc0IDI4OS43NGMxOS4xOCAxOS4xOCAyOS43NCA0NC43IDI5Ljc0IDcxLjg0LTAuMDIgMjEuMTYtNi40NCA0MS4zMi0xOC4zNiA1OC4yNiA0LjgtMy4zNiA5LjM0LTcuMTggMTMuNTgtMTEuNDIgMTkuMi0xOS4yIDI5Ljc2LTQ0LjcgMjkuNzgtNzEuODQgMC0yNy4xNC0xMC41Ni01Mi42Ni0yOS43NC03MS44NHoiIGZpbGw9IiMyMzEzMEQiIG9wYWNpdHk9Ii4yIiBwLWlkPSI4Mjc4Ij48L3BhdGg+PHBhdGggZD0iTTU1MS4yIDUxOS4zMkw1MTggNTUyLjUgMTkzLjYyIDIyOC4xNGMtMC4wMi0wLjAyLTAuMDYtMC4wNC0wLjA4LTAuMDYtMC4xOC0wLjE4LTAuMzgtMC4zLTAuNTYtMC40Ni0wLjMyLTAuMjgtMC42Ni0wLjU4LTEuMDItMC44LTAuMDItMC4wMi0wLjA4LTAuMDQtMC4xLTAuMDYtMC41NC0wLjM0LTEuMS0wLjYyLTEuNy0wLjg2aC0wLjAyTDEyMC40MiAxOTkuMDYgODUuOTYgMTI0Ljc0bDM3LjQ2LTM3LjQ2IDc0LjMgMzQuNDYgMjYuODIgNjkuNjRjMC40NCAxLjIgMS4xNCAyLjMyIDIuMDYgMy4zIDAuMDQgMC4wNCAwLjA4IDAuMSAwLjEyIDAuMTQgMC4wNCAwLjA0IDAuMDYgMC4wOCAwLjEgMC4xMkw1NTEuMiA1MTkuMzJ6IiBmaWxsPSIjRTFFMUU1IiBwLWlkPSI4Mjc5Ij48L3BhdGg+PHBhdGggZD0iTTU1MS4yIDUxOS4zMmwtMTYuNSAxNi41LTMyNC4zOC0zMjQuMzhjLTAuMDQtMC4wNC0wLjA2LTAuMDgtMC4xLTAuMTItMC4wNC0wLjA0LTAuMDgtMC4xLTAuMTItMC4xNC0wLjkyLTAuOTgtMS42Mi0yLjEtMi4wNi0zLjNMMTgxLjIyIDEzOC4yNCAxMDYuOTIgMTAzLjc4bDE2LjUtMTYuNSA3NC4zIDM0LjQ2IDI2LjgyIDY5LjY0YzAuNDQgMS4yIDEuMTQgMi4zMiAyLjA2IDMuMyAwLjA0IDAuMDQgMC4wOCAwLjEgMC4xMiAwLjE0IDAuMDQgMC4wNCAwLjA2IDAuMDggMC4xIDAuMTJMNTUxLjIgNTE5LjMyeiIgZmlsbD0iIzIzMTMwRCIgb3BhY2l0eT0iLjIiIHAtaWQ9IjgyODAiPjwvcGF0aD48cGF0aCBkPSJNNDU1LjY4IDYxNC44NGw0OC4xOC00OC4yLTkzLjE2LTkzLjE2LTI5MS4wNiAyNjMuNGMtNDIuMTQgNDIuMjItNDIuMTIgMTEwLjg2IDAuMDYgMTUzLjA0IDQyLjIgNDIuMTggMTEwLjgyIDQyLjIgMTUzLjA0IDAuMDZsMjEwLjktMjMzLjA0LTI3Ljk2LTI3Ljk2YTkuOTcgOS45NyAwIDAgMSAwLTE0LjE0ek0xOTYuMjYgODkzYy00My45MiAwLTc5LjY0LTM1LjcyLTc5LjY0LTc5LjYyIDAtNDMuOTIgMzUuNzItNzkuNjQgNzkuNjQtNzkuNjQgNDMuOSAwIDc5LjYyIDM1LjcyIDc5LjYyIDc5LjY0IDAgNDMuOS0zNS43MiA3OS42Mi03OS42MiA3OS42MnoiIGZpbGw9IiNFMUUxRTUiIHAtaWQ9IjgyODEiPjwvcGF0aD48cGF0aCBkPSJNNDEwLjcgNDczLjQ4TDExOS42NCA3MzYuODhhMTA5LjA5IDEwOS4wOSAwIDAgMC03LjQgOC4ybDI4Mi40Ni0yNTUuNiA5My4xNiA5My4xNiAxNi0xNi05My4xNi05My4xNnogbTQ0Ljk4IDE0MS4zNmwtMTYgMTZhOS45NyA5Ljk3IDAgMCAwIDAgMTQuMTRsMjcuOTYgMjcuOTYtMjAzLjEgMjI0LjQ0YzIuODItMi4zIDUuNTYtNC43NiA4LjItNy40bDIxMC45LTIzMy4wNC0yNy45Ni0yNy45NmE5Ljk3IDkuOTcgMCAwIDEgMC0xNC4xNHoiIGZpbGw9IiMyMzEzMEQiIG9wYWNpdHk9Ii4yIiBwLWlkPSI4MjgyIj48L3BhdGg+PHBhdGggZD0iTTg4NS40MiAzMjQuODhjLTMzLjk2IDMzLjk4LTgyLjM0IDQ4LjM4LTEyOS40MiAzOC41Mi0wLjEyLTAuMDItMC4yMiAwLTAuMzItMC4wMmE3Ljc0IDcuNzQgMCAwIDAtMC45OC0wLjFjLTAuMzQtMC4wNC0wLjY4LTAuMDYtMS4wMi0wLjA2LTAuMjggMC4wMi0wLjUyIDAuMDYtMC43OCAwLjA4LTAuNCAwLjA0LTAuNzggMC4wOC0xLjE2IDAuMTYtMC4yNCAwLjA2LTAuNDYgMC4xNC0wLjY4IDAuMjItMC40IDAuMTItMC43OCAwLjIyLTEuMTQgMC40LTAuMjIgMC4wOC0wLjQyIDAuMjItMC42NCAwLjMyLTAuMzYgMC4yLTAuNzIgMC40LTEuMDYgMC42NC0wLjE4IDAuMTItMC4zNCAwLjI2LTAuNTIgMC40LTAuMzQgMC4yOC0wLjY4IDAuNTgtMSAwLjkyLTAuMDQgMC4wNC0wLjEgMC4wOC0wLjE2IDAuMTRsLTk5LjQ4IDEwOS45LTE5LjQtMTkuNGExMC4wMDYgMTAuMDA2IDAgMCAwLTcuMDgtMi45NGMtMi42NiAwLTUuMiAxLjA2LTcuMDYgMi45NGwtNDguMTggNDguMTgtOTAuMS05MC4xIDE2Ny45LTE1MS45OCAwLjI0LTAuM2MwLjItMC4xOCAwLjM4LTAuNCAwLjU2LTAuNiAwLjI2LTAuMyAwLjUyLTAuNiAwLjcyLTAuOSAwLjE0LTAuMiAwLjI2LTAuNDIgMC4zOC0wLjYyIDAuMi0wLjM2IDAuNC0wLjcgMC41Ni0xLjA4IDAuMS0wLjIyIDAuMTYtMC40NiAwLjI0LTAuNjggMC4xMi0wLjM4IDAuMjYtMC43NCAwLjM0LTEuMTIgMC4wNC0wLjI2IDAuMDgtMC41NCAwLjEtMC44IDAuMDYtMC4zOCAwLjEtMC43NCAwLjEyLTEuMTIgMC0wLjI4LTAuMDItMC41NC0wLjA0LTAuOC0wLjAyLTAuNC0wLjA2LTAuNzgtMC4xMi0xLjE4LTAuMDItMC4xLTAuMDItMC4xOC0wLjA0LTAuMjgtOS44NC00Ny4wOCA0LjU2LTk1LjQ4IDM4LjU0LTEyOS40NGExNDEuNzA4IDE0MS43MDggMCAwIDEgMTM5LjA2LTM2LjIybC0xMTAuNSAxMTAuNTJhOS45NyA5Ljk3IDAgMCAwIDAgMTQuMTRsODMuNjggODMuN2MxLjg4IDEuODggNC40MiAyLjkyIDcuMDggMi45MiAyLjY0IDAgNS4xOC0xLjA0IDcuMDYtMi45MmwxMTAuNTItMTEwLjUyYzEzLjk2IDQ5LjE2IDAuNTIgMTAyLjM2LTM2LjIyIDEzOS4wOHoiIGZpbGw9IiNFMUUxRTUiIHAtaWQ9IjgyODMiPjwvcGF0aD48cGF0aCBkPSJNNDkzLjYyIDM5OC40Nmw4OS4yMiA4OS4yMi0xNy41IDE3LjUtOTAuMS05MC4xek02NDUuMTYgNDM5LjVsMTguNTIgMTguNTItMTYuNjIgMTguMzgtMTkuNC0xOS40YTEwLjAwNiAxMC4wMDYgMCAwIDAtNy4wOC0yLjk0Yy0yLjY2IDAtNS4yIDEuMDYtNy4wNiAyLjk0bDE3LjUtMTcuNWMxLjg2LTEuODggNC40LTIuOTQgNy4wNi0yLjk0IDIuNjYgMCA1LjIgMS4wNiA3LjA4IDIuOTR6IiBmaWxsPSIjMjMxMzBEIiBvcGFjaXR5PSIuMiIgcC1pZD0iODI4NCI+PC9wYXRoPjxwYXRoIGQ9Ik04MjYuODIgODc1LjQ4YTkuODggOS44OCAwIDAgMS03LjA2IDIuOTIgOS45NiA5Ljk2IDAgMCAxLTcuMDgtMi45Mkw1NjIuMzggNjI1LjE2YTkuOTcgOS45NyAwIDAgMSAwLTE0LjE0IDEwLjAwNiAxMC4wMDYgMCAwIDEgMTQuMTQgMGwyNTAuMyAyNTAuMzJhMTAuMDA2IDEwLjAwNiAwIDAgMSAwIDE0LjE0ek04NzQuMTYgODI4LjE2Yy0xLjk0IDEuOTQtNC41IDIuOTItNy4wNiAyLjkyLTIuNTYgMC01LjEyLTAuOTgtNy4wOC0yLjkyTDYwOS43IDU3Ny44NGExMC4wMDYgMTAuMDA2IDAgMCAxIDAtMTQuMTQgOS45NyA5Ljk3IDAgMCAxIDE0LjE0IDBsMjUwLjMyIDI1MC4zMmE5Ljk3IDkuOTcgMCAwIDEgMCAxNC4xNHoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjgyODUiPjwvcGF0aD48L3N2Zz4=
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      wmnetwork.cc
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483476/%E5%BE%AE%E5%AA%92%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483476/%E5%BE%AE%E5%AA%92%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
;(async function () {
  'use strict'
  /* */
  {
    !(function (t) {
      'function' == typeof define && define.amd
        ? define(['jquery'], t)
        : 'object' == typeof module && module.exports
        ? (module.exports = function (i, e) {
            return (
              void 0 === e &&
                (e =
                  'undefined' != typeof window
                    ? require('jquery')
                    : require('jquery')(i)),
              t(e),
              e
            )
          })
        : t(jQuery)
    })(function (t) {
      function i(i, e, n) {
        'string' == typeof n && (n = { className: n }),
          (this.options = v(b, t.isPlainObject(n) ? n : {})),
          this.loadHTML(),
          (this.wrapper = t(p.html)),
          this.options.clickToHide && this.wrapper.addClass(o + '-hidable'),
          this.wrapper.data(o, this),
          (this.arrow = this.wrapper.find('.' + o + '-arrow')),
          (this.container = this.wrapper.find('.' + o + '-container')),
          this.container.append(this.userContainer),
          i &&
            i.length &&
            ((this.elementType = i.attr('type')),
            (this.originalElement = i),
            (this.elem = F(i)),
            this.elem.data(o, this),
            this.elem.before(this.wrapper)),
          this.container.hide(),
          this.run(e)
      }
      var e =
          [].indexOf ||
          function (t) {
            for (var i = 0, e = this.length; e > i; i++)
              if (i in this && this[i] === t) return i
            return -1
          },
        n = 'notify',
        o = n + 'js',
        r = n + '!blank',
        s = {
          t: 'top',
          m: 'middle',
          b: 'bottom',
          l: 'left',
          c: 'center',
          r: 'right',
        },
        a = ['l', 'c', 'r'],
        l = ['t', 'm', 'b'],
        h = ['t', 'b', 'l', 'r'],
        A = { t: 'b', m: null, b: 't', l: 'r', c: null, r: 'l' },
        c = function (i) {
          var e
          return (
            (e = []),
            t.each(i.split(/\W+/), function (t, i) {
              var n
              return (n = i.toLowerCase().charAt(0)), s[n] ? e.push(n) : void 0
            }),
            e
          )
        },
        d = {},
        p = {
          name: 'core',
          html:
            '<div class="' +
            o +
            '-wrapper">\n	<div class="' +
            o +
            '-arrow"></div>\n	<div class="' +
            o +
            '-container"></div>\n</div>',
          css:
            '.' +
            o +
            '-corner {\n	position: fixed;\n	margin: 5px;\n	z-index: 1050;\n}\n\n.' +
            o +
            '-corner .' +
            o +
            '-wrapper,\n.' +
            o +
            '-corner .' +
            o +
            '-container {\n	position: relative;\n	display: block;\n	height: inherit;\n	width: inherit;\n	margin: 3px;\n}\n\n.' +
            o +
            '-wrapper {\n	z-index: 1;\n	position: absolute;\n	display: inline-block;\n	height: 0;\n	width: 0;\n}\n\n.' +
            o +
            '-container {\n	display: none;\n	z-index: 1;\n	position: absolute;\n}\n\n.' +
            o +
            '-hidable {\n	cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n	position: relative;\n}\n\n.' +
            o +
            '-arrow {\n	position: absolute;\n	z-index: 2;\n	width: 0;\n	height: 0;\n}',
        },
        u = { 'border-radius': ['-webkit-', '-moz-'] },
        f = function (t) {
          return d[t]
        },
        g = function (i, e) {
          if (!i) throw 'Missing Style name'
          if (!e) throw 'Missing Style definition'
          if (!e.html) throw 'Missing Style HTML'
          var r = d[i]
          r &&
            r.cssElem &&
            (window.console &&
              console.warn(n + ": overwriting style '" + i + "'"),
            d[i].cssElem.remove()),
            (e.name = i),
            (d[i] = e)
          var s = ''
          e.classes &&
            t.each(e.classes, function (i, n) {
              return (
                (s += '.' + o + '-' + e.name + '-' + i + ' {\n'),
                t.each(n, function (i, e) {
                  return (
                    u[i] &&
                      t.each(u[i], function (t, n) {
                        return (s += '	' + n + i + ': ' + e + ';\n')
                      }),
                    (s += '	' + i + ': ' + e + ';\n')
                  )
                }),
                (s += '}\n')
              )
            }),
            e.css && (s += '/* styles for ' + e.name + ' */\n' + e.css),
            s && ((e.cssElem = w(s)), e.cssElem.attr('id', 'notify-' + e.name))
          var a = {},
            l = t(e.html)
          m('html', l, a), m('text', l, a), (e.fields = a)
        },
        w = function (i) {
          var e
          ;(e = E('style')), e.attr('type', 'text/css'), t('head').append(e)
          try {
            e.html(i)
          } catch (n) {
            e[0].styleSheet.cssText = i
          }
          return e
        },
        m = function (i, e, n) {
          var o
          return (
            'html' !== i && (i = 'text'),
            (o = 'data-notify-' + i),
            y(e, '[' + o + ']').each(function () {
              var e
              ;(e = t(this).attr(o)), e || (e = r), (n[e] = i)
            })
          )
        },
        y = function (t, i) {
          return t.is(i) ? t : t.find(i)
        },
        b = {
          clickToHide: !0,
          autoHide: !0,
          autoHideDelay: 5e3,
          arrowShow: !0,
          arrowSize: 5,
          breakNewLines: !0,
          elementPosition: 'bottom',
          globalPosition: 'top right',
          style: 'bootstrap',
          className: 'error',
          showAnimation: 'slideDown',
          showDuration: 400,
          hideAnimation: 'slideUp',
          hideDuration: 200,
          gap: 5,
        },
        v = function (i, e) {
          var n
          return (
            (n = function () {}), (n.prototype = i), t.extend(!0, new n(), e)
          )
        },
        C = function (i) {
          return t.extend(b, i)
        },
        E = function (i) {
          return t('<' + i + '></' + i + '>')
        },
        x = {},
        F = function (i) {
          var e
          return (
            i.is('[type=radio]') &&
              ((e = i
                .parents('form:first')
                .find('[type=radio]')
                .filter(function (e, n) {
                  return t(n).attr('name') === i.attr('name')
                })),
              (i = e.first())),
            i
          )
        },
        S = function (t, i, e) {
          var n, o
          if ('string' == typeof e) e = parseInt(e, 10)
          else if ('number' != typeof e) return
          if (!isNaN(e))
            return (
              (n = s[A[i.charAt(0)]]),
              (o = i),
              void 0 !== t[n] && ((i = s[n.charAt(0)]), (e = -e)),
              void 0 === t[i] ? (t[i] = e) : (t[i] += e),
              null
            )
        },
        D = function (t, i, e) {
          if ('l' === t || 't' === t) return 0
          if ('c' === t || 'm' === t) return e / 2 - i / 2
          if ('r' === t || 'b' === t) return e - i
          throw 'Invalid alignment'
        },
        M = function (t) {
          return (M.e = M.e || E('div')), M.e.text(t).html()
        }
      ;(i.prototype.loadHTML = function () {
        var i
        ;(i = this.getStyle()),
          (this.userContainer = t(i.html)),
          (this.userFields = i.fields)
      }),
        (i.prototype.show = function (t, i) {
          var e, n, o, r, s
          if (
            ((n = (function (e) {
              return function () {
                return t || e.elem || e.destroy(), i ? i() : void 0
              }
            })(this)),
            (s = this.container.parent().parents(':hidden').length > 0),
            (o = this.container.add(this.arrow)),
            (e = []),
            s && t)
          )
            r = 'show'
          else if (s && !t) r = 'hide'
          else if (!s && t)
            (r = this.options.showAnimation), e.push(this.options.showDuration)
          else {
            if (s || t) return n()
            ;(r = this.options.hideAnimation), e.push(this.options.hideDuration)
          }
          return e.push(n), o[r].apply(o, e)
        }),
        (i.prototype.setGlobalPosition = function () {
          var i = this.getPosition(),
            e = i[0],
            n = i[1],
            r = s[e],
            a = s[n],
            l = e + '|' + n,
            h = x[l]
          if (!h) {
            h = x[l] = E('div')
            var A = {}
            ;(A[r] = 0),
              'middle' === a
                ? (A.top = '45%')
                : 'center' === a
                ? (A.left = '45%')
                : (A[a] = 0),
              h.css(A).addClass(o + '-corner'),
              t('body').append(h)
          }
          return h.prepend(this.wrapper)
        }),
        (i.prototype.setElementPosition = function () {
          var i,
            n,
            o,
            r,
            c,
            d,
            p,
            u,
            f,
            g,
            w,
            m,
            y,
            b,
            v,
            C,
            E,
            x,
            F,
            M,
            k,
            B,
            H,
            Q,
            R,
            U,
            X,
            z,
            j
          for (
            X = this.getPosition(),
              Q = X[0],
              B = X[1],
              H = X[2],
              w = this.elem.position(),
              u = this.elem.outerHeight(),
              m = this.elem.outerWidth(),
              f = this.elem.innerHeight(),
              g = this.elem.innerWidth(),
              j = this.wrapper.position(),
              c = this.container.height(),
              d = this.container.width(),
              x = s[Q],
              M = A[Q],
              k = s[M],
              p = {},
              p[k] = 'b' === Q ? u : 'r' === Q ? m : 0,
              S(p, 'top', w.top - j.top),
              S(p, 'left', w.left - j.left),
              z = ['top', 'left'],
              b = 0,
              C = z.length;
            C > b;
            b++
          )
            (R = z[b]),
              (F = parseInt(this.elem.css('margin-' + R), 10)),
              F && S(p, R, F)
          if (
            ((y = Math.max(
              0,
              this.options.gap - (this.options.arrowShow ? o : 0)
            )),
            S(p, k, y),
            this.options.arrowShow)
          ) {
            for (
              o = this.options.arrowSize,
                n = t.extend({}, p),
                i =
                  this.userContainer.css('border-color') ||
                  this.userContainer.css('border-top-color') ||
                  this.userContainer.css('background-color') ||
                  'white',
                v = 0,
                E = h.length;
              E > v;
              v++
            )
              (R = h[v]),
                (U = s[R]),
                R !== M &&
                  ((r = U === x ? i : 'transparent'),
                  (n['border-' + U] = o + 'px solid ' + r))
            S(p, s[M], o), e.call(h, B) >= 0 && S(n, s[B], 2 * o)
          } else this.arrow.hide()
          return (
            e.call(l, Q) >= 0
              ? (S(p, 'left', D(B, d, m)), n && S(n, 'left', D(B, o, g)))
              : e.call(a, Q) >= 0 &&
                (S(p, 'top', D(B, c, u)), n && S(n, 'top', D(B, o, f))),
            this.container.is(':visible') && (p.display = 'block'),
            this.container.removeAttr('style').css(p),
            n ? this.arrow.removeAttr('style').css(n) : void 0
          )
        }),
        (i.prototype.getPosition = function () {
          var t, i, n, o, r, s, A, d
          if (
            ((d =
              this.options.position ||
              (this.elem
                ? this.options.elementPosition
                : this.options.globalPosition)),
            (t = c(d)),
            0 === t.length && (t[0] = 'b'),
            (i = t[0]),
            e.call(h, i) < 0)
          )
            throw 'Must be one of [' + h + ']'
          return (
            (1 === t.length ||
              ((n = t[0]),
              e.call(l, n) >= 0 && ((o = t[1]), e.call(a, o) < 0)) ||
              ((r = t[0]),
              e.call(a, r) >= 0 && ((s = t[1]), e.call(l, s) < 0))) &&
              (t[1] = ((A = t[0]), e.call(a, A) >= 0 ? 'm' : 'l')),
            2 === t.length && (t[2] = t[1]),
            t
          )
        }),
        (i.prototype.getStyle = function (t) {
          var i
          if (
            (t || (t = this.options.style),
            t || (t = 'default'),
            (i = d[t]),
            !i)
          )
            throw 'Missing style: ' + t
          return i
        }),
        (i.prototype.updateClasses = function () {
          var i, e
          return (
            (i = ['base']),
            t.isArray(this.options.className)
              ? (i = i.concat(this.options.className))
              : this.options.className && i.push(this.options.className),
            (e = this.getStyle()),
            (i = t
              .map(i, function (t) {
                return o + '-' + e.name + '-' + t
              })
              .join(' ')),
            this.userContainer.attr('class', i)
          )
        }),
        (i.prototype.run = function (i, e) {
          var n, o, s, a, l
          if (
            (t.isPlainObject(e)
              ? t.extend(this.options, e)
              : 'string' === t.type(e) && (this.options.className = e),
            this.container && !i)
          )
            return void this.show(!1)
          if (this.container || i) {
            ;(o = {}), t.isPlainObject(i) ? (o = i) : (o[r] = i)
            for (s in o)
              (n = o[s]),
                (a = this.userFields[s]),
                a &&
                  ('text' === a &&
                    ((n = M(n)),
                    this.options.breakNewLines &&
                      (n = n.replace(/\n/g, '<br/>'))),
                  (l = s === r ? '' : '=' + s),
                  y(this.userContainer, '[data-notify-' + a + l + ']').html(n))
            this.updateClasses(),
              this.elem ? this.setElementPosition() : this.setGlobalPosition(),
              this.show(!0),
              this.options.autoHide &&
                (clearTimeout(this.autohideTimer),
                (this.autohideTimer = setTimeout(
                  this.show.bind(this, !1),
                  this.options.autoHideDelay
                )))
          }
        }),
        (i.prototype.destroy = function () {
          this.wrapper.data(o, null), this.wrapper.remove()
        }),
        (t[n] = function (e, o, r) {
          return (
            (e && e.nodeName) || e.jquery
              ? t(e)[n](o, r)
              : ((r = o), (o = e), new i(null, o, r)),
            e
          )
        }),
        (t.fn[n] = function (e, n) {
          return (
            t(this).each(function () {
              var r = F(t(this)).data(o)
              r && r.destroy()
              new i(t(this), e, n)
            }),
            this
          )
        }),
        t.extend(t[n], {
          defaults: C,
          addStyle: g,
          pluginOptions: b,
          getStyle: f,
          insertCSS: w,
        }),
        g('bootstrap', {
          html: '<div>\n<span data-notify-text></span>\n</div>',
          classes: {
            base: {
              'font-weight': 'bold',
              padding: '8px 15px 8px 14px',
              'text-shadow': '0 1px 0 rgba(255, 255, 255, 0.5)',
              'background-color': '#fcf8e3',
              border: '1px solid #fbeed5',
              'border-radius': '4px',
              'white-space': 'nowrap',
              'padding-left': '25px',
              'background-repeat': 'no-repeat',
              'background-position': '3px 7px',
            },
            error: {
              color: '#B94A48',
              'background-color': '#F2DEDE',
              'border-color': '#EED3D7',
              'background-image':
                'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)',
            },
            success: {
              color: '#468847',
              'background-color': '#DFF0D8',
              'border-color': '#D6E9C6',
              'background-image':
                'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)',
            },
            info: {
              color: '#3A87AD',
              'background-color': '#D9EDF7',
              'border-color': '#BCE8F1',
              'background-image':
                'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)',
            },
            warn: {
              color: '#C09853',
              'background-color': '#FCF8E3',
              'border-color': '#FBEED5',
              'background-image':
                'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)',
            },
          },
        }),
        t(function () {
          w(p.css).attr('id', 'core-notify'),
            t(document).on('click', '.' + o + '-hidable', function (i) {
              t(this).trigger('notify-hide')
            }),
            t(document).on('notify-hide', '.' + o + '-wrapper', function (i) {
              var e = t(this).data(o)
              e && e.show(!1)
            })
        })
    })
  }
  /* */

  /* */

  const pageUrl = new URL(location.href)
  const bodyEl = $('body')[0]
  console.log('pageUrl', pageUrl)
  if (pageUrl.pathname.startsWith('/manage_sub') && window.top === window) {
    if (pageUrl.searchParams.get('testMode') != 1) {
      pageUrl.searchParams.set('testMode', 1)
      location.search = pageUrl.search
    }
  }
  if (
    [
      '/manage/goods_list',
      '/manage/home_page_setting',
      '/manage_sub/page_edit',
    ].includes(pageUrl.pathname) &&
    pageUrl.searchParams.get('testMode') != 1 &&
    pageUrl.searchParams.get('new_home') != 1
  ) {
    pageUrl.searchParams.set('testMode', 1)
    pageUrl.searchParams.set('new_home', 1)
    location.search = pageUrl.search
  }
  if (
    pageUrl.pathname === '/login' &&
    pageUrl.searchParams.get('wm_t2_3721') != 1
  ) {
    pageUrl.searchParams.set('wm_t2_3721', 1)
    location.search = pageUrl.search
  }
  if (
    pageUrl.pathname === '/manage/membership_manage/page-list' &&
    pageUrl.searchParams.get('new_home') != 1
  ) {
    pageUrl.searchParams.set('new_home', 1)
    location.search = pageUrl.search
  }
  /*************************************** 微媒域名页面 *****************************************/
  if (pageUrl.host.includes('.wmnetwork.')) {
    localStorage.setItem('marketing-up-pop-key-annual-2023', new Date())

    // GM_registerMenuCommand(
    //   '设置页',
    //   function (event) {
    //     openSettingPage()
    //   },
    //   's'
    // )
    // 移除遮罩
    GM_registerMenuCommand(
      '移除升级遮罩',
      function (event) {
        const el = document.createElement('style')
        el.setAttribute('data-sign', 'wm-dev')
        el.innerHTML = `
        .v1_mc,.vipMask{display:none !important;}
        `
        document.head.appendChild(el)
      },
      'd'
    )
    GM_registerMenuCommand(
      '测试标记 TEST_FLG',
      function (event) {
        const url = new URL(location.href)
        url.searchParams.set('test_flg', 1)
        location.href = url.toString()
      },
      't'
    )
    GM_registerMenuCommand(
      '添加上传参数 UPLOAD',
      function (event) {
        const url = new URL(location.href)
        url.searchParams.set('upload', 1)
        location.href = url.toString()
      },
      't'
    )
    GM_registerMenuCommand(
      '打开子frame',
      function (event) {
        frames[0] && open(frames[0].location.href)
      },
      't'
    )
    GM_registerMenuCommand(
      '移动端标记 IS-WMOBILE',
      function (event) {
        const url = new URL(location.href)
        url.searchParams.set('isWMobile', 1)
        location.href = url.toString()
      },
      't'
    )
    GM_registerMenuCommand(
      '移动端标记 IS_DESKTOP',
      function (event) {
        const url = new URL(location.href)
        url.searchParams.set('is_desktop', 1)
        location.href = url.toString()
      },
      't'
    )

    GM_registerMenuCommand(
      '在钉钉内打开当前页',
      function (event) {
        if (location.href.includes('?')) {
          window.open(
            `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(
              location.href + '&ddtab=true'
            )}`
          )
        } else {
          window.open(
            `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(
              location.href + '?ddtab=true'
            )}`
          )
        }
      },
      'd'
    )
    GM_registerMenuCommand(
      'Copilot(隐藏/显示)',
      function (event) {
        if (GM_getValue('copilot-hide') == 1) {
          // 显示
          const target_el = document.getElementById('copilot-dev-tool-style')
          target_el && target_el.remove()
          GM_setValue('copilot-hide', 0)
        } else {
          // 隐藏
          hideCopilot()
          GM_setValue('copilot-hide', 1)
        }
      },
      'd'
    )
    if (GM_getValue('copilot-hide') == 1) {
      hideCopilot()
    }

    function hideCopilot() {
      styleInject(
        `
        div#copilot-sea-gull,
        div.copilot-area{
          display:none !important;
        }`,
        {},
        'copilot-dev-tool-style'
      )
      console.warn('已隐藏  div#copilot-sea-gull,div.copilot-area 元素')
    }

    if (location.pathname.includes('/manage/home_edit')) {
      GM_registerMenuCommand(
        '获取拷贝组件',
        function (event) {
          const home_copy_components =
            localStorage.getItem('home_copy_components') || ''
          if (home_copy_components) {
            GM_setClipboard(home_copy_components, 'text')
            $.notify('已获取组件数据', {
              className: 'success',
              position: 'top center',
            })
          } else {
            // 没有数据
            $.notify('未发现组件数据', {
              className: 'error',
              position: 'top center',
            })
          }
        },
        'c'
      )
      GM_registerMenuCommand(
        '设置拷贝组件',
        function (event) {
          navigator.clipboard
            .readText()
            .then(home_copy_components => {
              if (home_copy_components) {
                try {
                  JSON.parse(home_copy_components)
                  localStorage.setItem(
                    'home_copy_components',
                    home_copy_components
                  )
                  $.notify('组件数据已设置成功', {
                    className: 'success',
                    position: 'top center',
                  })
                  location.reload()
                } catch (error) {
                  console.error(error)
                  $.notify('组件数据格式异常', {
                    className: 'error',
                    position: 'top center',
                  })
                }
              }
            })
            .catch(err => {
              // TODO 提示异常
              console.error(err)
              $.notify('在页面内 右键执行该操作', {
                className: 'error',
                position: 'top center',
              })
            })
        },
        'v'
      )
      GM_registerMenuCommand('添加/删除 重置搜索组件选项', function () {
        const url = new URL(location.href)
        if (url.searchParams.has('reset_classified_search')) {
          url.searchParams.delete('reset_classified_search')
        } else {
          url.searchParams.set('reset_classified_search', 1)
        }
        location.href = url.toString()
      })
    }
  }
  /********************************  接口文档页  **********************************************/
  if (location.host == 'msp.wmnetwork.cc') {
    GM_registerMenuCommand(
      '获取 API 声明',
      function (event) {
        const table_el = document.querySelector(
          '.el-table.test-content.adjust-table.ms-table.el-table--fit.el-table--border.el-table--scrollable-x.el-table--enable-row-transition.ms-select-all-fixed'
        )
        if (!table_el) {
          $.notify('没有找到数据源元素', {
            className: 'error',
            position: 'top center',
          })
          return
        }
        const table_vue_el = table_el.__vue__
        const listObject = table_vue_el.data
        const results = listObject.map(item => {
          const fun_name = item.path.substring(item.path.lastIndexOf('/') + 1)
          // item.response
          return `${getApiDeclare(
            toCamelCase(fun_name),
            item.path.replace(/^\//, ''),
            item.method
          )}`
        })
        GM_setClipboard(results.join(''), 'text')
        $.notify('复制成功', {
          className: 'success',
          position: 'top center',
        })
        // $.notify('未发现组件数据', {
        //     className: "error", position: "top center"
        // })
      },
      'v'
    )

    // let timer = setInterval(() => {
    //   if ($('body #body')) {
    //     clearInterval(timer)
    //    const app = $('body #body')[0].__vue__
    //   }
    // }, 10);
    let timer = null
    let app = null
    const observer = new MutationObserver((mutationList, observer) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      // setCopyBtn()
      timer = setTimeout(() => {
        if ($('body #body .api-doc-page>div').length > 0) {
          if (app) {
            return
          }
          app = $('body #body .api-doc-page>div')[0].__vue__
          {
            app.$watch(
              'apiStepIndex',
              val => {
                app.$nextTick(() => {
                  setCopyBtn()
                })
              },
              { immediate: true }
            )
            app.$watch(
              'apiShowArray',
              val => {
                app.$nextTick(() => {
                  setCopyBtn()
                })
              },
              { deep: true, immediate: true }
            )
          }
        } else {
          app = null
        }
      }, 100)
    })
    observer.observe(bodyEl, {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      attributes: false, // 观察属性变动
      subtree: true,
    })

    function setCopyBtn() {
      // console.debug('set copy btn')
      $('.api-doc-page main>div:not([class]):last-child>div').each((_, el) => {
        $(el).find('.apiCopyDocBtn.apiCopyDocBtn').remove()
        const coptBtnBase = $(el)
          .find('.apiStatusTag')
          .clone()
          .css('cursor', 'pointer')
          .css('user-select', 'none')
          .addClass('apiCopyDocBtn')
        const coptBtnDoc = coptBtnBase.clone()
        const coptBtnApi_Doc = coptBtnBase.clone()
        coptBtnDoc
          .find('.el-tag')
          .css('color', '#14defa')
          .text('拷贝 JsDoc 文档')
          .on('click', function () {
            GM_setClipboard(getApiDoc(el))
            $.notify(`复制成功！`, {
              className: 'success',
              position: 'top center',
            })
          })
        coptBtnDoc.appendTo($(el).find('.apiStatusTag').parent())
        coptBtnApi_Doc
          .find('.el-tag')
          .css('color', '#8900fb')
          .text('拷贝 Api 及 JsDoc 文档')
          .on('click', function () {
            GM_setClipboard(getApi_Doc(el))
            $.notify(`复制成功！`, {
              className: 'success',
              position: 'top center',
            })
          })
        coptBtnApi_Doc.appendTo($(el).find('.apiStatusTag').parent())
      })
    }
    // 获取文档
    function getApiDoc(el) {
      const paramArr = []
      const apiDes =
        $(el).find('.apiStatusTag')[0]?.previousSibling.textContent?.trim() ||
        ''
      const apiMethod = $(el).find('.simpleFontClass>span').text().trim()

      const apiUrl = (
        $(el).find('.simpleFontClass>span')?.[0].nextSibling.textContent || ''
      ).trim()

      let resType = 'Res<any>'
      const resJsonStr = $(el)
        .find('.el-form code')
        .first()
        .text()
        .split('\n')
        .map(str => str.replace(/\/\/.*/, ''))
        .join('')
      let resJson = null
      try {
        resJson = JSON.parse(resJsonStr)
        if (apiUrl) {
          resType = toPascalCase(apiUrl + 'Type')
        }
      } catch (error) {
        console.error(error)
      }

      const arr = Array.from($(el).find('.apiInfoRow'))
        .filter((_, index) => [2, 3, 4].includes(index))
        .map(item => $(item).find('tbody tr'))
        .forEach((paramEls, index) => {
          if (index == 1) {
            $(paramEls).each((_, paramEl) => {
              const [nameEl, requiredEl, typeEl, desEl] = Array.from(
                $(paramEl).find('td')
              )
              paramArr.push({
                name: $(nameEl).text(),
                type: transformType($(typeEl).text()),
                des: $(desEl).text(),
                required: $(requiredEl).text(),
                val: '',
              })
            })
          } else {
            $(paramEls).each((_, paramEl) => {
              const [nameEl, typeEl, desEl, requiredEl, defaultVal] =
                Array.from($(paramEl).find('td'))
              paramArr.push({
                name: $(nameEl).text(),
                type: transformType($(typeEl).text()),
                des: $(desEl).text(),
                required: $(requiredEl).text(),
                val: $(defaultVal).text(),
              })
            })
          }
        })

      let jsDoc =
        `/**
 *
 * ${apiDes}
 * 
 * @param {Object} data 请求参数\n` +
        paramArr
          .map(({ name, type, des, required, val }) => {
            return ` * @param {${type}} ${
              ['是', 'true'].includes(required.trim())
                ? `data.${name}`
                : `[data.${name}]`
            }  -${des} ${val ? `例：${val}` : ''}`
          })
          .join('\n') +
        `${paramArr.length === 0 ? '' : '\n'} *
 * @returns {Promise<${resType}>}
 * @resolve {${resType}}
 */`

      if (resJson) {
        const typeDoc = jsonToJsdoc(resJson, resType)
        return `${typeDoc}\n${jsDoc}`
      }
      return jsDoc
    }
    // 获取接口 及 文档
    function getApi_Doc(el) {
      const [methodEl, pathEl] = $(el).find('.apiInfoRow>.simpleFontClass')[0]
        .childNodes
      const fun_name = pathEl.textContent
        .trim()
        .substring(pathEl.textContent.trim().lastIndexOf('/') + 1)
      return `${getApiDoc(el)}\n${getApiDeclare(
        toCamelCase(fun_name),
        pathEl.textContent.trim().replace(/^\//, ''),
        methodEl.textContent.trim().toUpperCase()
      )}`
    }
  }
  /**************************** Git 提交管理页   **************************************/
  if (location.pathname === '/wm_manage/technology_manage/git_manager') {
    //
    String.prototype._substring = String.prototype.substring
    String.prototype.substring = function () {
      return this
    }
    // 样式个性化
    const css_248z = `
      a {
        color: inherit; /* 使用父元素的颜色 */
        text-decoration: none; /* 移除下划线 */
        background-color: transparent; /* 移除背景色 */
        cursor: pointer; /* 鼠标悬停时显示手形指针 */
      }
      
      /* 科技风格链接样式 */
      a.tech-style {
          color: #007bff; /* 使用蓝色作为链接颜色 */
          transition: color 0.3s ease; /* 添加颜色过渡效果 */
      }
      
      a.tech-style:hover {
          color: #0056b3; /* 鼠标悬停时改变链接颜色 */
      }
      
      /* 科技风格链接在激活时的样式 */
      a.tech-style:active {
          color: #004085; /* 激活时的链接颜色 */
      }
        .search-input.el-input {
            width: 200px !important;
        }
        .loose .el-message-box__message p{
            word-spacing: 50px;

        }
 
        .loose .el-message-box__message p::selection{

        }
        .el-card.is-always-shadow{
          height: 98vh;
          overflow-y: auto;
        }
        .el-table{
          height: calc(100vh - 240px) !important;
        }
        .z-3000{
          z-index:3000;
        }
        .notifyjs-corner{
          z-index: 3000 !important;
          position: fixed;
        }
        `
    styleInject(css_248z)
    // 添加 hotfix 分支创建
    var vueApp = null
    function handle() {
      if ($('.clearfix .el-button.el-button--text').length === 0) {
        loop(handle)
      } else {
        const Element = (vueApp = $('#app')[0].__vue__)
        const vueapp = Element
        // 宽度调整
        $('col[name="el-table_1_column_4"]').each(function () {
          $(this).attr('width', 550)
        })
        $(
          'col[name="el-table_1_column_8"],col[name="el-table_1_column_9"]'
        ).each(function () {
          $(this).attr('width', 180)
        })
        if (GM_getValue('git_name') == '孤心') {
          vueapp.limit = 10
        }
        const $lcone_el = $('.clearfix .el-button.el-button--text')
          .last()
          .clone()
        // hotfix 提交链接复制改造
        vueapp._copyUrl = vueapp.copyUrl
        vueapp.copyUrl = function (url) {
          const commit_desc = this.pr?.info?.commit_desc?.split('\n')[0] || ''
          location.href = 'wechat://s'
          this._copyUrl(`${commit_desc} \n\n ${url} \n`)
        }
        //

        $(
          $lcone_el
            .clone()
            .html('<span>PREFIX</span>')
            .on('click', () => {
              let project_name = vueapp.new_branch.project_name || 'front_spa'
              QueryTheLatestBranch('prefix', project_name)
                .then(({ ref }) => {
                  vueapp.new_branch.project_name = project_name
                  let [old_branch_name, branch_name, new_branch_name] =
                    getGitFixName(ref, 'prefix')
                  vueapp.new_branch.branch_name = new_branch_name || branch_name
                  Element.$confirm(
                    `${old_branch_name}        ${branch_name}`,
                    '最新分支',
                    {
                      customClass: `loose
                            `.trim(),
                    }
                  )
                    .then(() => {})
                    .catch(() => {})
                })
                .catch()
            })
        ).insertAfter($('.clearfix .el-button.el-button--text').last())
        //
        $(
          $lcone_el
            .clone()
            .html('<span>HOTFIX</span>')
            .on('click', () => {
              let project_name = vueapp.new_branch.project_name || 'front_spa'
              QueryTheLatestBranch('hotfix', project_name)
                .then(({ ref }) => {
                  vueapp.new_branch.project_name = project_name
                  let [old_branch_name, branch_name, new_branch_name] =
                    getGitFixName(ref, 'hotfix')
                  vueapp.new_branch.branch_name = new_branch_name || branch_name
                  Element.$confirm(
                    `${old_branch_name}        ${branch_name}`,
                    '最新分支',
                    {
                      customClass: `loose
                            `.trim(),
                    }
                  )
                    .then(() => {})
                    .catch(() => {})
                })
                .catch()
            })
        ).insertAfter($('.clearfix .el-button.el-button--text').last())

        // $(
        //   $lcone_el
        //     .clone()
        //     .html('<span>重新打包</span>')
        //     .on('click', () => {

        //     })
        // ).insertAfter($('.clearfix .el-button.el-button--text').last())

        //
        $(
          $lcone_el
            .clone()
            .html('<span>修改提交人</span>')
            .css('float', 'right')
            .on('click', () => {
              setGitName()
            })
        ).insertAfter($('.clearfix .el-button.el-button--text').last())

        $('.clearfix .el-button.el-button--text')
          .last()
          .next()
          .css('margin-top', '20px')

        $($('<br/>')).insertAfter(
          $('.clearfix .el-button.el-button--text').last()
        )
        const urlRegex = /https?:\/\/[^\s]+/g
        const setbg = (select, color) => {
          $(`.el-table_1_column_2  .cell:contains(${select})`)
            .parent()
            .parent()
            .each((_, el) => {
              $(el)
                .css('background-color', color)
                .children('td.el-table__cell')
                .each((_, item) => {
                  $(item).css('background-color', color)
                })
            })
        }
        const showUrl = () => {
          Array.from(
            document.querySelectorAll(
              `[aria-describedby^="el-tooltip"]:not(.format)`
            )
          ).forEach(el => {
            let innerHTML = el.__vue__.$el.innerHTML
            // const nameHTML =
            //   innerHTML
            //     .match(/-([\w_]+)-/g)
            //     ?.map(name => {
            //       name = name.replace(/-/g, '')
            //       return `<span class="name-tag__${name}">${name}</span>`
            //     })
            //     .join('') || ''
            // innerHTML = innerHTML.replace(/-([\w_]+)-/g, '')

            if (urlRegex.test(innerHTML)) {
              const urlMatch = innerHTML.match(urlRegex)
              if (urlMatch && !el.innerHTML.includes('<a')) {
                const linkString =
                  '<a href="$&" class="tech-style" target="_blank">$&</a>'
                el.__vue__.$el.innerHTML = innerHTML.replace(
                  urlRegex,
                  linkString
                )
                el.__vue__.$el.classList.add('format')
              }
            }
          })
        }
        const setCustomizationBg = () => {
          if (GM_getValue('git_name') !== '孤心') {
            return
          }
          ;[
            ['master', 'color-mix(in a98-rgb, #F56C6C, #fff)'],
            ['prefix', '#FBEBD8'],
            ['hotfix', '#FEE2E1'],
            ['dev', '#E1F3D8'],
            ['bus', '#E9E9EB3'],
            ['pre_master', 'color-mix(in a98-rgb, #E6A23C, #fff)'],
          ].forEach(([select, color]) => {
            setbg(select, color)
          })
        }
        setCustomizationBg()
        showUrl()
        // 待处理
        const pendingIds = []
        // 监听打包结束
        vueapp.$watch(
          'list',
          function (val, oldVal) {
            let flg = true
            val.forEach(item => {
              if (item.sub_pro_list) {
                if (
                  item.sub_pro_list === '-mobile_uni-' &&
                  item.status == 0 &&
                  flg
                ) {
                  flg = false
                  getLogByGitDeployId(item.id).then(data => {
                    const list = data.other.split('\n')
                    const qrCode = list.find(str =>
                      /\W?data:image\/jpeg;base64/.test(str)
                    )
                    console.clear()
                    console.log(
                      '%c 小程序二维码:',
                      'color:#09f;font-size:24px;'
                    )
                    console.log(
                      '%c ',
                      "background: url('" +
                        qrCode +
                        "') left top / 240px auto no-repeat;font-size:400px;"
                    )
                  })
                }
                item.commit_desc = item.sub_pro_list + item.commit_desc
              }
              if (
                ['crm_spa', 'front_spa'].includes(item.project_name) &&
                item.status == 0
              ) {
                const { created_at, updated_at } = item
                vueApp.$set(
                  item,
                  'sub_pro_list',
                  (new Date(updated_at) - new Date(created_at)) / 1000 + '秒'
                )
              }
            })
            oldVal
              ?.filter((item, index) => {
                checkForUpdatesBatch(item)
                if (filterFun(item)) {
                  const error_list = GM_getValue('error_list') || []
                  if (item.status == 3 && !error_list.includes(item.id + '')) {
                    error_list.push(item.id)
                    GM_setValue('error_list', error_list)
                    GM_notification({
                      text: `发生错误---提交信息${item.commit_desc}`,
                      title: '发生错误',
                      onclick: () => {
                        //
                      },
                    })
                    audioPlay(
                      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
                        '打包发生错误'
                      )}&le=zh`
                    )
                  }
                  return item.status == 1 || item.status == 2
                }
                return false
              })
              .forEach(item => {
                if (!pendingIds.includes(item.id)) {
                  pendingIds.push(item.id)
                }
              })
            vueApp.$nextTick(() => {
              showUrl()
              setCustomizationBg()
            })

            const result = val
              .filter((item, index) => {
                return filterFun(item) && item.status == 0
              })
              .map(item => {
                if (pendingIds.includes(item.id)) {
                  return item
                }
                return null
              })
              .filter(item => item)

            if (result.length > 0 && 0) {
              const _pendingIds = new Set(pendingIds)
              pendingIds.length = 0
              const commit_desc = result
                .map(item => {
                  _pendingIds.delete(item.id)
                  return item.commit_desc
                })
                .join('')
              pendingIds.push(...Array.from(_pendingIds))
              GM_notification({
                text: `${commit_desc}`,
                title: '打包完成',
                onclick: () => {
                  //
                },
              })
              audioPlay(
                `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
                  '打包已完成'
                )}&le=zh`
              )
            }
          },
          {
            immediate: true,
          }
        )

        //
        // 设置 Git 提交者名称 邮箱
        console.debug(GM_getValue('git_name'), GM_getValue('get_email'))
        if (!GM_getValue('git_name')) {
          setGitName()
        }
        function setGitName() {
          Element.$confirm(
            ``,
            `请输入 Git 触发人和邮箱  
           例:devops,<devops@pp.cc>`,
            {
              showInput: true,
              showCancelButton: false,
            }
          )
            .then(({ value }) => {
              console.log(value)
              const [git_name, get_email] = value.split(',')
              GM_setValue('git_name', git_name.trim() || '--')
              GM_setValue('get_email', get_email.trim())
              console.log('value', git_name, get_email)
            })
            .catch(() => {})
        }
      }
    }
    handle()
    // 请求监控
    let oldOpen = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      const _url = new URL(url, location.origin)
      this._url = _url
      if (_url.pathname === '/task/git_manager/block_change') {
        // this._message = vueApp.$message({
        //   message: '正在合并中……',
        //   type: 'info',
        //   duration: 0,
        // })
        $.notify(`正在执行中……`, {
          className: 'warn z-3000',
          position: 'top center',
        })
      }

      return oldOpen.call(this, method, url, async, user, password)
    }
    let oldSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function () {
      /**
       * @type {URL}
       */
      const url = this._url

      if (url.pathname === '/task/git_manager/block_change') {
        this._message?.close()
        if (this.readyState === 4 && this.status === 200) {
          // vueApp.$message.success('合并成功！')
          $.notify(`合并成功！`, {
            className: 'success z-3000',
            position: 'top center',
          })
        }
      }
      return oldSend.apply(this, arguments)
    }
  }
  /******************************  TAPD   ***********************************/
  if (pageUrl.hostname.includes('tapd.cn')) {
    const CommitType = [
      {
        label: 'init',
        key: 'init',
        detail: '项目初始化',
        icon: '🎉',
      },
      {
        label: 'feat',
        key: 'feat',
        detail: '添加新特性',
        icon: '✨',
      },
      {
        label: 'fix',
        key: 'fix',
        detail: '修复bug',
        icon: '🐞',
      },
      {
        label: 'docs',
        key: 'docs',
        detail: '仅仅修改文档',
        icon: '📃',
      },
      {
        label: 'style',
        key: 'style',
        detail: '仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑',
        icon: '🌈',
      },
      {
        label: 'refactor',
        key: 'refactor',
        detail: '代码重构，没有加新功能或者修复bug',
        icon: '🦄',
      },
      {
        label: 'perf',
        key: 'perf',
        detail: '优化相关，比如提升性能、体验',
        icon: '🎈',
      },
      {
        label: 'test',
        key: 'test',
        detail: '增加测试用例',
        icon: '🧪',
      },
      {
        label: 'build',
        key: 'build',
        detail: '依赖相关的内容',
        icon: '🔧',
      },
      {
        label: 'ci',
        key: 'ci',
        detail: 'ci配置相关 例如对 k8s，docker的配置文件的修改',
        icon: '🐎',
      },
      {
        label: 'chore',
        key: 'chore',
        detail: '改变构建流程、或者增加依赖库、工具等',
        icon: '🐳',
      },
      {
        label: 'revert',
        key: 'revert',
        detail: '回滚到上一个版本',
        icon: '↩',
      },
      {
        label: '----------------',
        key: '',
        detail: '',
        icon: '--------',
      },
      {
        label: '',
        key: 'versions',
        detail: '区别与上版提交 增加版本号',
        icon: '🏷️',
      },
    ]
    // if (pageUrl.pathname.includes('/story/detail')) {
    //   const [workspacesId, id] = location.pathname.match(/(\d+)/g)
    //   location.href = `${location.origin}/${workspacesId}/prong/stories/view/${id}?only_content=true`
    // }
    // if (pageUrl.pathname.includes('/bug/detail')) {
    //   const [workspacesId, id] = location.pathname.match(/(\d+)/g)
    //   location.href = `${location.origin}/${workspacesId}/bugtrace/bugs/view/${id}?only_content=true`
    // }
    // tapd bug 页面
    $(function () {
      //   #el-popover-333  div  div> li:last-child
      // .custom-copy-link-item-name
      ;(async () => {
        await sleep(1e3)
        $('.title-area__copy-link-button')[0].__vue__.show()
        await sleep(1e3)
        $('.title-area__copy-link-button')[0].__vue__.hide()
        const $item = $(
          $('body >.el-popover.agi-popover  div  div> li:last-child').get(0)
        ).clone()
        const titleList = document.title.split('-').slice(0, -2)
        let value_key = ''

        const page_style = `
        .copy-info-link .dropdown-menu{
          width: 200px;
        }
        .copy-info-link .dropdown-menu ul{
          display: flex;
          flex-wrap: wrap;
        }

        .dropdown-box{
          margin-left:190px;
        }
        .dropdown-box .dropdown-menu{
          padding:10px;
        }
        .dropdown-menu .select-item{
          cursor: pointer;
          line-height: 1.5;
        }
        .batch-info{
        font-size:  14px;
        font-weight: 400;
        margin-left: 8px;
        }
        .detail-container-header-top--normal.detail-container-header-top--normal{
        overflow: inherit;
        }
      `
        styleInject(page_style)
        const TEMP_SELECT = `
        <div data-dropdown="click" class="dropdown  dropdown-box " >
        <a href="#" class="dropdown-toggle" style="font-size:16px;">
        Git commt prefix
        </a>
        <ul class="dropdown-menu">
        ${CommitType.map(
          item => `
          <li class="select-item" data-key="${item.key}" data-content="${item.icon} ${item.key}" > 
          <a title="${item.detail}">  
          ${item.icon} ${item.key} (${item.detail})
          </a>
          </li>
        `
        ).join('')}
        </ul>
     <div>`
        $(document).on(
          'click',
          '[data-dropdown="click"] .dropdown-toggle',
          function () {
            $(this).next().toggle('slow')
          }
        )
        $(TEMP_SELECT)
          .insertAfter('.title-area .title-area__id')
          .on('click', '.select-item', function () {
            //
            const prefix = $(this).attr('data-content')
            const key = $(this).attr('data-key')
            //
            const $target = $('.agi-dropdown-menu-item__text[data-git-commit]')
            const raw = $target.attr('data-clipboard-text')
            if (['versions'].includes(key)) {
              // 特殊处理
              switch (key) {
                case 'versions':
                  value_key =
                    $('.title-area__id').text()?.match(/\d+/g)?.join('') || ''
                  let versions =
                    localStorage.getItem(`git-commit-${key}-${value_key}`) ||
                    '1.0.0'
                  versions = incrementVersion(versions)
                  localStorage.setItem(
                    `git-commit-${key}-${value_key}`,
                    versions
                  )
                  const raw = $target.attr('data-clipboard-text')
                  $target.attr(
                    'data-clipboard-text',
                    raw.replace(/(--batch:\d+)/, `$1--v:${versions}`)
                  )
                  location.reload()
                  break
                default:
                  break
              }
              return
            } else if (pageUrl.pathname.includes('/bugs/view')) {
              value_key =
                $('.title-area__id').text()?.match(/\d+/g)?.join('') || ''
              localStorage.setItem(`git-commit-prefix-${value_key}`, prefix)
            } else if (pageUrl.pathname.includes('/stories/view')) {
              value_key =
                $('.title-area__id').text()?.match(/\d+/g)?.join('') || ''
              localStorage.setItem(`git-commit-prefix-${value_key}`, prefix)
            }

            $target.attr(
              'data-clipboard-text',
              raw.replace(/^.*\(/, `${prefix}(`)
            )
          })

        let prefix = ''
        if (pageUrl.pathname.includes('/bug/detail')) {
          $('.copy-info-link').addClass(' dropdown-open')
          $('.copy-info-link .dropdown-menu').css('display', 'block')
          value_key = $('.title-area__id').text()?.match(/\d+/g)?.join('') || ''
          let batch = GM_getValue(value_key) || 1
          let versions_text =
            localStorage.getItem(`git-commit-versions-${value_key}`) || ''
          // 获取与bug关联的需求id
          // const { id: bugStoryId, name: bugStoryName } =
          //   unsafeWindow?.current_bug?.BugStoryRelation_relative_id ?? {}
          let bugStoryId = ''
          //  BugStoryRelation_relative_id
          bugStoryId = $('[for="BugStoryRelation_relative_id"]')
            .next()
            .find('li')
            .attr('value')
          let bugStoryId_text =
            bugStoryId?.substring(bugStoryId.length - 7) || ''
          let bugStoryBatch_text = ''
          if (bugStoryId_text) {
            bugStoryBatch_text = `--story-batch:${
              GM_getValue(bugStoryId_text) || 0
            }`
            bugStoryId_text = `--story:${bugStoryId_text}`
          }

          if (versions_text) {
            versions_text = `--v:${versions_text}`
          }

          //

          if ($('.title-area .title-area__id+.batch-info').length == 0) {
            $('.title-area .title-area__id').after(
              `<span class="batch-info">提交数:${batch - 1}<span>`
            )
          }

          // bug 链接
          // $item
          //   .clone()
          //   .find('.agi-dropdown-menu-item__text')
          //   .removeAttr('id')
          //   .attr('data-clipboard-text', location.href)
          //   .attr('title', '复制链接')
          //   .text('复制链接')
          //   .on('click', function () {
          //     GM_setClipboard($(this).attr('data-clipboard-text'))
          //     $.notify(`复制成功`, {
          //       className: 'success',
          //       position: 'top center',
          //     })
          //   })
          //   .parent()
          //   .insertBefore('.title-area .title-area__id')
          // commit 提交信息
          prefix =
            localStorage.getItem(`git-commit-prefix-${value_key}`) || '🐞 fix'
          $item
            .clone()
            .find('.agi-dropdown-menu-item__text')
            .removeAttr('id')
            .attr(
              'data-clipboard-text',
              `${prefix}(${titleList
                .splice(0, titleList.length - 1)
                .join(
                  '-'
                )}): ${bugStoryId_text}${bugStoryBatch_text}--bug:${value_key}--batch:${batch}${versions_text}--${titleList.pop()}



${location.href}`
            )
            .attr('title', '复制 Commit')
            .attr('data-git-commit', '')
            .text('复制 Commit')
            .on('click', function () {
              GM_setClipboard($(this).attr('data-clipboard-text'))
              $.notify(`复制成功`, {
                className: 'success',
                position: 'top center',
              })
            })
            .parent()
            .insertBefore('.title-area .title-area__id')
        } else if (pageUrl.pathname.includes('/story/detail')) {
          value_key = $('.title-area__id').text()?.match(/\d+/g)?.join('') || ''
          prefix =
            localStorage.getItem(`git-commit-prefix-${value_key}`) || '✨ feat'
          let batch = GM_getValue(value_key) || 1
          let versions_text =
            localStorage.getItem(`git-commit-versions-${value_key}`) || ''
          if (versions_text) {
            versions_text = `--v:${versions_text}`
          }

          // if ($('.copy-info-link+.batch-info').length == 0) {
          //   $('.copy-info-link').after(
          //     `<span class="batch-info">提交数:${batch - 1}<span>`
          //   )
          // }
          if ($('.title-area .title-area__id+.batch-info').length == 0) {
            $('.title-area .title-area__id').after(
              `<span class="batch-info">提交数:${batch - 1}<span>`
            )
          }

          $item
            .clone()
            .find('.agi-dropdown-menu-item__text')
            .removeAttr('id')
            .attr(
              'data-clipboard-text',
              `${prefix}(${titleList
                .splice(0, titleList.length - 1)
                .join(
                  '-'
                )}): --story:${value_key}--batch:${batch}${versions_text}--${titleList.pop()}



${location.href}`
            )
            .attr('title', '复制 Commit')
            .attr('data-git-commit', '')
            .text('复制 Commit')
            .on('click', function () {
              GM_setClipboard($(this).attr('data-clipboard-text'))
              $.notify(`复制成功`, {
                className: 'success',
                position: 'top center',
              })
              const storyType = $('.story-wrap .workitem-icon')
                .text()
                .trim()
                .toLocaleLowerCase()
              if (storyType === 'story') {
                $.notify(`当前为父需求!!!`, {
                  className: 'warn',
                  position: 'top center',
                })
              }
            })
            .parent()
            .insertBefore('.title-area .title-area__id')
        }

        if (value_key) {
          GM_addValueChangeListener(
            value_key,
            function (key, oldValue, newValue, remote) {
              if (key == value_key) {
                const $target = $(
                  '.agi-dropdown-menu-item__text[data-git-commit]'
                )
                const raw = $target.attr('data-clipboard-text')
                $target.attr(
                  'data-clipboard-text',
                  raw.replace(/--batch:(\d+)/, `--batch:${newValue}`)
                )
                $('.title-area .title-area__id+.batch-info').html(
                  `提交数:${newValue - 1}`
                )
                $.notify(`更新 Commit 成功! batch ${newValue}`, {
                  className: 'success',
                  position: 'top center',
                })
              }
              console.log(
                'key, oldValue, newValue, remote',
                key,
                oldValue,
                newValue,
                remote
              )
            }
          )
        }
      })()
    })
    /********************************************* 故事墙 ***********************************************/
    if (pageUrl.pathname.includes('/storywall')) {
      // .storywall-column__title .openstatus-icon
      $(function () {
        $(document).on(
          'click',
          '.storywall-column__title .openstatus-icon',
          function () {
            queryNum()
          }
        )
        setTimeout(() => queryNum(), 2e3)
      })
      function queryNum() {
        $('.storywall-column-status__title').each((index, $el) => {
          $($el).find('.user-script_total-span').remove()
          const $container_ul = $($el).next().find('ul[data-items]')
          if (!$container_ul.attr('data-observe')) {
            $container_ul.attr('data-observe', 1)
            const observer = new MutationObserver(function (mutations) {
              mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'data-items') {
                  const data_items = $(mutation.target).attr('data-items') || ''
                  $($el).find('.user-script_total-span').remove()
                  if (data_items) {
                    $(
                      `<span class="user-script_total-span" >   ${
                        data_items.split(',').length
                      }</span>`
                    ).appendTo($el)
                  }
                }
              })
            })
            observer.observe($container_ul[0], {
              attributeFilter: ['data-items'],
            })
          }
          const data_items = $container_ul.attr('data-items') || ''
          if (data_items) {
            $(
              `<span class="user-script_total-span" >   ${
                data_items.split(',').length
              }</span>`
            ).appendTo($el)
          }
        })
      }
    } else if (
      pageUrl.pathname.includes('story/detail') ||
      pageUrl.pathname.includes('bugtrace/bugs')
    ) {
      if (pageUrl.hash) {
        setTimeout(() => {
          $(pageUrl.hash).find('span').click()
          $('.content-left.webkit-scrollbar.editor-scroll-container').scrollTop(
            0
          )
        }, 2.5e3)
      }
      $(document).on('click', 'ul.tab-container li[id]', function () {
        pageUrl.hash = $(this).attr('id')
        history.replaceState({}, null, pageUrl.toString())
      })
      //
      fetchTaskGitManager()
      document.addEventListener('visibilitychange', function () {
        // 用户打开或回到页面
        if (document.visibilityState === 'visible') {
          fetchTaskGitManager()
        }
      })
      $('#story_name_view > span.copy-info-link.dropdown-clipboard > i').hover(
        function () {
          // over
          fetchTaskGitManager()
        },
        function () {
          // out
        }
      )
    } else if (
      pageUrl.pathname.includes('prong/iterations/card_view') ||
      pageUrl.pathname.includes('/iteration/card/')
    ) {
      // setTimeout(() => {
      //   const list = []
      //   $('.tapd-table-content table tr[workspace_id]').each((index, el) => {
      //     const item = {
      //       id: '',
      //       title: '',
      //       tags: '',
      //       developer: '',
      //       owner: '',
      //     }
      //     console.log($(el).attr('id'))
      //     list.push(item)
      //   })
      // }, 4e3)
      // Array.from(document.querySelectorAll('[data-grid-field="id"]')).map(item=>`(${item.innerText})`).join('|')
      // GM_setClipboard('')
      // $.notify(`复制成功`, {
      //   className: 'success',
      //   position: 'top center',
      // })
      styleInject(`
        .copy-btn__ids{
          margin: 0 4px;
          cursor: pointer;
          text-align: center;
          color: #2cd09b;
        }
        `)
      const $copyBtn = $(
        '<div class="tapd-filter-item copy-btn__ids"> <div>复制已选任务ID</div> </div>'
      )
      debugger
      function copyBtnFun() {
        const idArr = $('table [type="checkbox"]:checked')
          .closest('tr')
          .find('[data-grid-field="id"]')
          .text()
          .split(' ')
          .filter(id => id?.trim())
        if (idArr.length === 0) {
          $.notify(`未发现已选中的任务`, {
            className: 'warn',
            position: 'top center',
          })
        } else {
          GM_setClipboard(`(${idArr.join('|')})`)
          $.notify(`复制成功`, {
            className: 'success',
            position: 'top center',
          })
        }
      }

      setTimeout(() => {
        $('.tapd-filter .tapd-filter__body').append(
          $copyBtn.on('click', copyBtnFun)
        )
        $('.iteration-progress .iteration-progress-operation').append(
          $copyBtn.clone().on('click', copyBtnFun)
        )
      }, 5e3)
    }
  }
  /*********************************** element ********************************************* */

  if (pageUrl.host.includes('element.eleme.')) {
    GM_addStyle(`
      .notifyjs-corner{
        z-index: 2000 !important;
        position: fixed;
      }
    `)
    console.info('element.eleme', $(document))
    $(document).on('click', 'i[class^="el-icon-"]', function () {
      if (location.hash.includes('/icon')) {
        GM_setClipboard($(this).attr('class'))
        // tts('复制成功')
        $.notify(`复制成功  ${$(this).attr('class')}`, {
          className: 'success',
          position: 'top center',
        })
      }
    })
  }
  if (pageUrl.host.includes('iconfont.cn')) {
    GM_addStyle(`
      .notifyjs-corner{
        z-index: 2000 !important;
        position: fixed;
      }
    `)

    $(document).on('click', '.copy-before', function () {
      const name = $(this).closest('li').find('.icon-code-show').text()
      if (name) {
        GM_setClipboard(`<wmIcon name="${name}"></wmIcon>`)
        // tts('复制成功')
        $.notify(`复制成功  ${name}`, {
          className: 'success',
          position: 'top center',
        })
      }
    })
  }
  if (
    pageUrl.host.includes('apifox.com') ||
    pageUrl.host.includes('apifox.cn')
  ) {
    const btn = $(
      `<button type="button" class="ui-btn ui-btn-primary ui-btn-flex h-full max-h-14 animate-none transition-none @[998px]:h-auto"><span class="@[500px]:inline-block"></span></button>`
    ).clone()

    const copyBtn = btn.clone()
    copyBtn
      .find('span')
      .text('COPY Api')
      .on('click', async () => {
        if ($('.Pane section>a').length > 0) {
          //
          const urlList = []
          $('.Pane section>a').each((index, el) => {
            urlList.push($(el).attr('href'))
          })
          getApiDetailsHTML(urlList).then(res => {
            console.log('urlList', res)
          })
          //
        } else {
          const apiDoc = getApiDoc($('html'))
          GM_setClipboard(apiDoc, 'text')
        }
        $.notify('复制成功', {
          className: 'success',
          position: 'top center',
        })
      })
    setTimeout(() => {
      $(copyBtn).appendTo(
        $('.Pane h1, [class*="baseInfo__copyText"]').closest('div')
      )
    }, 2000)
    new MutationObserver(function (mutations) {
      $(copyBtn).appendTo(
        $('.Pane h1, [class*="baseInfo__copyText"]').closest('div')
      )
    }).observe(document.querySelector('title'), {
      subtree: true,
      characterData: true,
      childList: true,
    })
    function getApiDetailsHTML(urlList) {
      return Promise.all(
        urlList.map(url => fetch(url).then(res => res.text()))
      ).then(resList => {
        resList.map(htmlFragment => {
          const $linkElList = $(htmlFragment).find('.Pane section>a')
          const list = []
          const url_list = []
          if ($linkElList.length > 0) {
            $linkElList.each((index, el) => {
              url_list.push($(el).attr('href'))
            })
            getApiDetailsHTML(url_list).then(_resList => {
              list.push(..._resList)
            })
            return list
          }
          return htmlFragment
        })
      })
    }

    /**
     *
     * @param {Document|String} el
     * @returns
     */
    function getApiDoc(el) {
      const apiDes = $(el).find('title').text().split('-')?.[0] || ''
      const apiMethod =
        $(
          $(el).find(`[aria-label="调试"]`).parent().siblings().get(0)
        ).text() || ''

      const apiUrl =
        $(
          $(el).find(`[aria-label="调试"]`).parent().siblings().get(1)
        ).text() || ''
      const paramArr = []
      const markdown = $(el).find('.markdown-body').text()
      let resType = 'Res<any>'

      $(el)
        .find(
          '.ui-card-head-wrapper:contains("Query 参数"),.ui-card-head-wrapper:contains("Query 参数"),.ui-card-head-wrapper:contains("Body 参数"),.ui-card-head-wrapper:contains("Body 参数")'
        )
        .closest('.ui-card')
        .find('.ui-card-body')
        .find('[class*="index_node"]')
        .each((index, el) => {
          const key = $(el).find('[class*="propertyName"]').text()

          paramArr.push({
            name: key,
            required: 'true',
            type: 'String',
          })
        })

      const resJsonStr = $(el)
        .find('[role="tabpanel"] pre code')
        .text()
        .split('\n')
        .join('')
      let resJson = null
      try {
        resJson = JSON.parse(resJsonStr)
        if (apiUrl) {
          resType = toPascalCase(apiUrl + 'Type')
        }
      } catch (error) {
        console.error(error)
      }
      const fun_name = apiUrl.substring(apiUrl.lastIndexOf('/') + 1)

      let jsDoc =
        `/**
 *
 * ${apiDes}
 * ${markdown}
 * @param {Object} data 请求参数\n` +
        paramArr
          .map(({ name, type, des, required, val }) => {
            return ` * @param {${type}} ${
              ['是', 'true'].includes(required.trim())
                ? `data.${name}`
                : `[data.${name}]`
            }  ${val ? `例：${val}` : ''}`
          })
          .join('\n') +
        `${paramArr.length === 0 ? '' : '\n'} *
 * @returns {Promise<${resType}>}
 * @resolve {${resType}}
 */
${getApiDeclare(toCamelCase(fun_name), apiUrl.replace(/^\//, ''), apiMethod)}
        `

      if (resJson) {
        const typeDoc = jsonToJsdoc(resJson, resType)
        return `${typeDoc}\n${jsDoc}`
      }
      return jsDoc
    }
  }
  /*********************************************************************************/

  let queryTaskListTime = null
  let selfActive = false

  $(document).on(
    'mouseover',
    '.agi-dropdown-menu-item__text[data-git-commit]',
    () => {
      fetchTaskGitManager(() => {
        console.debug('query Task ok')
      })
    }
  )
  document.addEventListener('visibilitychange', function () {
    // 用户离开了当前页面
    if (document.visibilityState === 'hidden') {
      if (selfActive) {
        GM_setValue('queryTaskState', 0)
        selfActive = false
      }
      queryTaskListTime && clearInterval(queryTaskListTime)
    }
    // 用户打开或回到页面
    if (document.visibilityState === 'visible') {
      taskStart()
    }
  })
  GM_addValueChangeListener(
    'queryTaskState',
    function (key, oldValue, newValue, remote) {
      if (remote && newValue == 0) {
        taskStart()
      }
    }
  )
  taskStart()
  function taskStart() {
    if (document.visibilityState !== 'visible') return
    if (GM_getValue('queryTaskState') == 1) return
    queryTaskListTime && clearInterval(queryTaskListTime)
    selfActive = true
    GM_setValue('queryTaskState', 1)
    queryTaskListTime = setInterval(() => {
      fetchTaskGitManager(() => {
        console.debug('query Task ok')
      })
    }, 5e3)
  }
  function fetchTaskGitManager(cd) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://testt2.wmnetwork.cc/task/git_manager/index_json?page=1&limit=50`,
      headers: {
        'Content-Type': 'application/json',
      },
      onload: function (response) {
        cd && cd(response)
        let res = null
        console.debug('fetchTaskGitManager')
        try {
          res = JSON.parse(response.responseText)
        } catch (error) {
          console.error(error)
        }
        if (res && res.error_code === 0) {
          res.data.data.forEach(item => {
            checkForUpdatesBatch(item)
          })
        }
      },
    })
  }
  /*********************************************************************************/
  /**
   * 检查更新 batch
   * @param {Object} item
   */
  function checkForUpdatesBatch(item) {
    if (filterFun(item) && item.branch != 'bus') {
      // console.log(item, item.commit_desc)
      // 从自己提交日志中查询 任务 ID (需求和缺陷) 和提交批次
      const res_tapd_id = item.commit_desc.match(/[story|bug]{1}:(\d+)--batch/)
      const res_batch = item.commit_desc.match(/--batch:(\d+)/)
      let tapd_id = '',
        batch = 0
      if (res_tapd_id && res_tapd_id.length > 1) {
        tapd_id = res_tapd_id[1]
      }
      if (res_batch && res_batch.length > 1) {
        batch = res_batch[1] * 1
      }
      if (res_tapd_id) {
        if (!batch) {
          batch = 0
        }
        batch++
        let old_batch = +GM_getValue(tapd_id)
        // 已经存储过的 要比较批次大小
        if (old_batch) {
          if (batch > old_batch) {
            GM_setValue(tapd_id, batch)
          }
        } else {
          GM_setValue(tapd_id, batch)
        }
      }
    }
  }

  /**
   * 获取 Git 分支名称
   * @param {*} ref
   * @param {*} pre
   * @returns
   */
  function getGitFixName(ref, pre) {
    const now = new Date()
    const result = ref?.match(/[hotfix|prefix]+_(\d{2})(\d{2})_(\d+)/)
    let new_branch_name = ''

    const nowMonty =
      now.getMonth() + 1 >= 10
        ? now.getMonth() + 1
        : '0'.concat(now.getMonth() + 1)
    const nowDay =
      now.getDate() >= 10 ? now.getDate() : '0'.concat(now.getDate())
    if (result?.length >= 3) {
      const month = result[1]
      const day = result[2]
      let number = result[3]
      if (nowMonty == month && day == nowDay) {
        number = Math.max(10, number * 1)
        number++
        number = `${number}`.padStart(2, '0')
        new_branch_name = `${pre}_${nowMonty}${nowDay}_${number}`
      } else {
        new_branch_name = `${pre}_${nowMonty}${nowDay}_11`
      }
    } else {
      new_branch_name = `${pre}_${nowMonty}${nowDay}_11`
    }
    return [`${ref ?? '🈚️'}`, `${pre}_${nowMonty}${nowDay}_1`, new_branch_name]
  }
  /**
   * 查询最新的分支信息
   * @param {string} branch
   * @returns Promise<Object>
   */
  function QueryTheLatestBranch(branch, project_name) {
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    const tomStart = todayStart.getTime() + 24 * 60 * 60 * 1000

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/task/git_manager/index_json',
        type: 'GET',
        data: {
          page: 1,
          limit: 10,
          search: {
            project_name: project_name,
            ref: branch,
            time_range: [todayStart.getTime(), tomStart],
          },
        },
        success: function (res) {
          if (res.error_code === 0) {
            const { data } = res.data
            data.sort((a, b) => {
              const aParts = a.ref.split('_')
              const bParts = b.ref.split('_')
              const aNumber = parseInt(aParts[aParts.length - 1], 10)
              const bNumber = parseInt(bParts[bParts.length - 1], 10)
              if (aNumber > bNumber) {
                return -1
              } else if (aNumber < bNumber) {
                return 1
              }
              return 0
            })
            data.forEach(item => {
              item.ref_ = item.ref.split('/').pop().replace(/\D/g, '')
            })
            let { ref } = data?.[0] ?? {}
            ref = ref?.split('/')?.pop()
            resolve({
              ref,
            })
          } else {
            reject()
          }
        },
        error: () => {
          reject()
        },
      })
    })
  }
  function getLogByGitDeployId(git_deploy_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/task/git_manager/get_log_by_git_deploy_id',
        type: 'GET',
        data: {
          git_deploy_id,
        },
        success: function (res) {
          if (res.error_code === 0) {
            resolve(res.data)
          } else {
            reject()
          }
        },
        error: () => {
          reject()
        },
      })
    })
  }

  function loop(cb = () => {}) {
    setTimeout(cb, 200)
  }
  function styleInject(css, ref, id) {
    if (ref === void 0) ref = {}
    var insertAt = ref.insertAt

    if (!css || typeof document === 'undefined') {
      return
    }

    var head = document.head || document.getElementsByTagName('head')[0]
    var style = document.createElement('style')
    style.type = 'text/css'
    style.id = id

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild)
      } else {
        head.appendChild(style)
      }
    } else {
      head.appendChild(style)
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }
  }
  function tts(text) {
    audioPlay(
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
        text
      )}&le=zh`
    )
  }
  function audioPlay(src) {
    ;(audio => {
      console.info('自动播放', src)
      audio.oncanplay = function () {
        audio.play()
      }
      audio.onpause = function () {
        audio.remove()
      }
      audio.src = src
      audio.autoplay = true
      audio.style.display = 'none'
      document.body.appendChild(audio)
    })(document.createElement('audio'))
  }
  /**
   *
   * @param {string} fun_name
   * @param {string} path
   * @param {'get'|'post'} method
   * @param {string} pre
   * @returns
   */
  function getApiDeclare(fun_name, path, method = 'get', pre = 'prePath') {
    return `${fun_name}: data => ajax(${pre} + '${path}', data, '${method}'),\n`
  }
  function isCamelCase(str) {
    // 使用正则表达式检查字符串是否为驼峰命名
    return /^[a-z][a-zA-Z0-9]*$/.test(str)
  }

  function toCamelCase(str) {
    // 判断字符串是否为驼峰命名
    if (isCamelCase(str)) {
      return str // 如果已经是驼峰命名，则不需要转换
    }

    // 使用正则表达式将字符串转换为驼峰命名
    return str.replace(/[_-](.)/g, function (match, group1) {
      return group1.toUpperCase()
    })
  }

  function filterFun(item) {
    return (
      item.author === GM_getValue('git_name') ||
      item.commit_desc.includes(GM_getValue('get_email') || void 0)
    )
  }
  function incrementVersion(version) {
    const parts = version.split('.')
    if (parts.length !== 3) {
      throw new Error('版本号格式不正确，应为MAJOR.MINOR.PATCH')
    }

    let [major, minor, patch] = parts.map(Number)

    // 如果修订号为0，递增次版本号
    if (patch === 0) {
      minor++
      // 如果次版本号也为0，递增主版本号
      if (minor === 0) {
        major++
      }
      patch = 0 // 重置修订号为0
    }

    return `${major}.${minor}.${patch}`
  }
  function openSettingPage() {}

  /**
   * 将 JSON 对象转换为 JSDoc 类型声明
   * @param {Object} json - 要转换的 JSON 对象
   * @param {string} typeName - 生成的类型名
   * @returns {string} - JSDoc 类型声明字符串
   */
  function jsonToJsdoc(json, typeName = 'Root') {
    // 存储所有类型声明的数组
    const typeDeclarations = []

    // 生成类型声明的递归函数
    function generateTypeDeclaration(obj, name) {
      let result = `/**\n * @typedef {Object} ${name}\n`

      for (const [key, value] of Object.entries(obj)) {
        const valueType = getType(value)
        if (valueType === 'Object') {
          const subTypeName = `${name}_${capitalizeFirstLetter(key)}`
          result += ` * @property {${subTypeName}} ${key} - 描述 ${key}\n`
          generateTypeDeclaration(value, subTypeName)
        } else if (valueType === 'Array') {
          const arrayItemType = getType(value[0])
          if (arrayItemType === 'Object') {
            const subTypeName = `${name}_${capitalizeFirstLetter(key)}Item`
            result += ` * @property {${subTypeName}[]} ${key} - 描述 ${key}\n`
            generateTypeDeclaration(value[0], subTypeName)
          } else {
            result += ` * @property {${arrayItemType}[]} ${key} - 描述 ${key}\n`
          }
        } else {
          result += ` * @property {${valueType}} ${key} - 描述 ${key}\n`
        }
      }

      result += ` */\n`

      // 将生成的类型声明添加到数组中
      typeDeclarations.push(result)
    }

    // 获取值的类型
    function getType(value) {
      if (Array.isArray(value)) return 'Array'
      if (value === null) return 'any' //'null'
      const type = typeof value === 'object' ? 'Object' : typeof value
      return type === 'undefined' ? 'any' : type
    }

    // 首字母大写
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    // 生成根类型声明
    generateTypeDeclaration(json, typeName)

    // 返回所有类型声明的字符串
    return typeDeclarations.join('\n')
  }
  /**
   * 将字符串转换为大驼峰格式（PascalCase）
   * @param {string} str - 要转换的字符串
   * @returns {string} - 转换后的大驼峰格式字符串
   */
  function toPascalCase(str) {
    // 使用正则表达式匹配斜杠 `/` 和下划线 `_`，并将每个单词的首字母转换为大写
    return str
      .split(/\/|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  function transformType(type) {
    if (type.includes('json')) {
      return 'Object'
    }
    if (type.includes('text')) {
      return 'String'
    }
    return 'any'
  }
  function sleep(ms = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms)
    })
  }
})()
