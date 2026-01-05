// ==UserScript==
// @name		Autoforum (Forum Expander)
// @author		SpyDeX
// @namespace		PSVScripts
// @description		Автоматический разворот форума, для показа первых постов в списке раздач rutracker и ... т.д.
// @include		https*
// @include		http*
// @version		0.0.0.11
// @grant		GM_xmlhttpRequest
// @grant		GM_openInTab
// @grant		GM_registerMenuCommand
// @contributionURL	https://www.paypal.me/GreasyScripts/1.5usd
// @supportURL		https://phantomcity.github.io/GS/AF/
// @icon		data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNjA2LjE5MSA2MDYuMTkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MDYuMTkxIDYwNi4xOTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTkwLjU3MSw0MTMuNzkzYzEwLjU5OSwxMC42LDI0LjYzNCwxNi40MzYsMzkuNTIxLDE2LjQzNmMxNC4zMTIsMCwyNy45NTctNS4zODEsMzguNDIyLTE1LjE1NiAgICAgYzUuNTA0LTUuMTM5LDkuODQxLTExLjIyNywxMi44OS0xOC4wODhjMy4xOTEtNy4xODgsNC44MS0xNC44NTksNC44MS0yMi44MDdWMjMyLjAxNWMwLTcuOTQ3LTEuNjE4LTE1LjYxOS00LjgwOS0yMi44MDUgICAgIGMtMy4wNDgtNi44NjMtNy4zODQtMTIuOTUtMTIuODg5LTE4LjA5MWMtMTAuNDY1LTkuNzczLTI0LjExLTE1LjE1Ny0zOC40MjMtMTUuMTU3Yy0xNC44ODYsMC0yOC45MjIsNS44MzctMzkuNTIxLDE2LjQzNiAgICAgbC02OC43NSw2OC43NTFjLTIzLjEyOSwyMy4xMjktMjMuMTI5LDYwLjc2NCwwLDgzLjg5M0w5MC41NzEsNDEzLjc5M3ogTTUyLjExMywyOTEuNDQybDY4Ljc1LTY4Ljc1ICAgICBjMi42ODYtMi42ODYsNS45ODgtMy44ODgsOS4yMjgtMy44ODhjNi43NzgsMCwxMy4yOCw1LjI2NCwxMy4yOCwxMy4yMTF2MTQyLjE2M2MwLDcuOTQ3LTYuNTAyLDEzLjIxMS0xMy4yOCwxMy4yMTEgICAgIGMtMy4yNCwwLTYuNTQyLTEuMjAxLTkuMjI4LTMuODg5bC02OC43NS02OC43NUM0NS42NzcsMzA4LjMxNCw0NS42NzcsMjk3Ljg3OCw1Mi4xMTMsMjkxLjQ0MnoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTEzMC4wOTEsNDMwLjcyOWMtMTUuMDIxLDAtMjkuMTgyLTUuODg5LTM5Ljg3NC0xNi41ODJsLTY4Ljc1LTY4Ljc1Yy0xMS4yODEtMTEuMjgtMTcuNDk0LTI2LjMwMy0xNy40OTQtNDIuMyAgICAgczYuMjEzLTMxLjAyLDE3LjQ5NC00Mi4zbDY4Ljc1LTY4Ljc1MWMxMC42OTMtMTAuNjkzLDI0Ljg1NC0xNi41ODMsMzkuODc0LTE2LjU4M2MxNC40MzgsMCwyOC4yMDUsNS40MzEsMzguNzY0LDE1LjI5MiAgICAgYzUuNTUzLDUuMTg2LDkuOTI5LDExLjMyOCwxMy4wMDQsMTguMjUzYzMuMjIsNy4yNTEsNC44NTIsMTQuOTkyLDQuODUyLDIzLjAwOHYxNDIuMTYzYzAsOC4wMTctMS42MzMsMTUuNzU4LTQuODUzLDIzLjAxICAgICBjLTMuMDc4LDYuOTI3LTcuNDUzLDEzLjA2Ni0xMy4wMDUsMTguMjVDMTU4LjI5OSw0MjUuMjk4LDE0NC41MzIsNDMwLjcyOSwxMzAuMDkxLDQzMC43Mjl6IE0xMzAuMDkyLDE3Ni40NjIgICAgIGMtMTQuNzUzLDAtMjguNjYzLDUuNzg1LTM5LjE2NywxNi4yOWwtNjguNzUsNjguNzUxYy0xMS4wOTIsMTEuMDkyLTE3LjIwMSwyNS44NjMtMTcuMjAxLDQxLjU5MyAgICAgYzAsMTUuNzI5LDYuMTA5LDMwLjUwMSwxNy4yMDEsNDEuNTkzbDY4Ljc1LDY4Ljc1YzEwLjUwMywxMC41MDQsMjQuNDEzLDE2LjI4OSwzOS4xNjcsMTYuMjg5ICAgICBjMTQuMTg3LDAsMjcuNzEtNS4zMzUsMzguMDgxLTE1LjAyMWM1LjQ1NC01LjA5Miw5Ljc1MS0xMS4xMjIsMTIuNzc0LTE3LjkyNmMzLjE2My03LjEyMyw0Ljc2Ny0xNC43MjgsNC43NjctMjIuNjA0VjIzMi4wMTUgICAgIGMwLTcuODc1LTEuNjA0LTE1LjQ3OS00Ljc2Ni0yMi42MDJjLTMuMDIxLTYuODAyLTcuMzE4LTEyLjgzNC0xMi43NzMtMTcuOTI5QzE1Ny44LDE4MS43OTcsMTQ0LjI3NiwxNzYuNDYyLDEzMC4wOTIsMTc2LjQ2MnogICAgICBNMTMwLjA5MSwzODcuODg5Yy0zLjU3OCwwLTYuOTgtMS40MzMtOS41ODEtNC4wMzVsLTY4Ljc1LTY4Ljc1Yy0zLjIwOC0zLjIwNy00Ljk3NC03LjQ3MS00Ljk3NC0xMi4wMDcgICAgIGMwLTQuNTM3LDEuNzY3LTguODAxLDQuOTc0LTEyLjAwOGw2OC43NS02OC43NWMyLjYwMi0yLjYwMiw2LjAwNC00LjAzNSw5LjU4MS00LjAzNWM4LjYyNiwwLDEzLjc4LDYuOTcyLDEzLjc4LDEzLjcxMXYxNDIuMTYzICAgICBDMTQzLjg3MiwzODAuOTE3LDEzOC43MTcsMzg3Ljg4OSwxMzAuMDkxLDM4Ny44ODl6IE0xMzAuMDkxLDIxOS4zMDNjLTMuMzU3LDAtNi40MjYsMS4yOTQtOC44NzQsMy43NDJsLTY4Ljc1LDY4Ljc1ICAgICBjLTMuMDE5LDMuMDE5LTQuNjgxLDcuMDMyLTQuNjgxLDExLjMwMWMwLDQuMjY5LDEuNjYzLDguMjgxLDQuNjgxLDExLjNsNjguNzUsNjguNzVjMi40NDcsMi40NDgsNS41MTYsMy43NDIsOC44NzQsMy43NDIgICAgIGM2LjI4MiwwLDEyLjc4LTQuNzU1LDEyLjc4LTEyLjcxMVYyMzIuMDE1QzE0Mi44NzIsMjI0LjA1OCwxMzYuMzc0LDIxOS4zMDMsMTMwLjA5MSwyMTkuMzAzeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCQk8Zz4KCQkJPHBhdGggZD0iTTU0My41NzksMC41SDI3OS44ODhjLTMyLjA1OSwwLTU4LjE0LDI2LjA4Mi01OC4xNCw1OC4xNHY2NC43NWMwLDMyLjA1OSwyNi4wODIsNTguMTQsNTguMTQsNTguMTRoMjYzLjY4OSAgICAgYzMyLjA1OSwwLDU4LjE0MS0yNi4wODIsNTguMTQxLTU4LjE0VjU4LjY0QzYwMS43MiwyNi41ODIsNTc1LjYzOCwwLjUsNTQzLjU3OSwwLjV6IE01NTguODc4LDEyMy4zOSAgICAgYzAsOC40NS02Ljg1LDE1LjMtMTUuMjk5LDE1LjNIMjc5Ljg4OGMtOC40NSwwLTE1LjMtNi44NS0xNS4zLTE1LjNWNTguNjRjMC04LjQ1LDYuODUtMTUuMywxNS4zLTE1LjNoMjYzLjY4OSAgICAgYzguNDUxLDAsMTUuMzAxLDYuODUsMTUuMzAxLDE1LjNWMTIzLjM5TDU1OC44NzgsMTIzLjM5eiIgZmlsbD0iIzAwMDAwMCIvPgoJCQk8cGF0aCBkPSJNNTQzLjU3NywxODIuMDNIMjc5Ljg4OGMtMzIuMzM0LDAtNTguNjQtMjYuMzA2LTU4LjY0LTU4LjY0VjU4LjY0YzAtMzIuMzM0LDI2LjMwNi01OC42NCw1OC42NC01OC42NGgyNjMuNjkxICAgICBjMTUuNjM5LDAsMzAuMzU3LDYuMTA2LDQxLjQ0NSwxNy4xOTRjMTEuMDg5LDExLjA4OCwxNy4xOTQsMjUuODA4LDE3LjE5Myw0MS40NDZ2NjQuNzUgICAgIEM2MDIuMjE4LDE1NS43MjUsNTc1LjkxMiwxODIuMDMsNTQzLjU3NywxODIuMDN6IE0yNzkuODg4LDFjLTMxLjc4MywwLTU3LjY0LDI1Ljg1Ny01Ny42NCw1Ny42NHY2NC43NSAgICAgYzAsMzEuNzgzLDI1Ljg1Nyw1Ny42NCw1Ny42NCw1Ny42NGgyNjMuNjg5YzMxLjc4MywwLDU3LjY0MS0yNS44NTcsNTcuNjQxLTU3LjY0VjU4LjY0YzAuMDAxLTE1LjM3MS02LjAwMS0yOS44MzktMTYuOS00MC43MzggICAgIEM1NzMuNDE5LDcuMDAyLDU1OC45NSwxLDU0My41NzksMUgyNzkuODg4eiBNNTQzLjU3OSwxMzkuMTlIMjc5Ljg4OGMtOC43MTIsMC0xNS44LTcuMDg4LTE1LjgtMTUuOFY1OC42NCAgICAgYzAtOC43MTIsNy4wODgtMTUuOCwxNS44LTE1LjhoMjYzLjY4OWM4LjcxMywwLDE1LjgwMSw3LjA4OCwxNS44MDEsMTUuOHY2NC43NUM1NTkuMzc4LDEzMi4xMDMsNTUyLjI5MSwxMzkuMTksNTQzLjU3OSwxMzkuMTl6ICAgICAgTTI3OS44ODgsNDMuODRjLTguMTYxLDAtMTQuOCw2LjYzOS0xNC44LDE0Ljh2NjQuNzVjMCw4LjE2MSw2LjYzOSwxNC44LDE0LjgsMTQuOGgyNjMuNjkxYzguMTYsMCwxNC43OTktNi42MzksMTQuNzk5LTE0LjggICAgIFY1OC42NGMwLTguMTYxLTYuNjQtMTQuOC0xNC44MDEtMTQuOEgyNzkuODg4eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCQk8Zz4KCQkJPHBhdGggZD0iTTU0My41NzksMjEyLjU4MkgyNzkuODg4Yy0zMi4wNTksMC01OC4xNCwyNi4wODItNTguMTQsNTguMTR2NjQuNzVjMCwzMi4wNTksMjYuMDgyLDU4LjE0MSw1OC4xNCw1OC4xNDFoMjYzLjY4OSAgICAgYzMyLjA1OSwwLDU4LjE0MS0yNi4wODIsNTguMTQxLTU4LjE0MXYtNjQuNzVDNjAxLjcyLDIzOC42NjMsNTc1LjYzOCwyMTIuNTgyLDU0My41NzksMjEyLjU4MnogTTU1OC44NzgsMzM1LjQ3MSAgICAgYzAsOC40NDktNi44NSwxNS4zMDEtMTUuMjk5LDE1LjMwMUgyNzkuODg4Yy04LjQ1LDAtMTUuMy02Ljg1Mi0xNS4zLTE1LjMwMXYtNjQuNzVjMC04LjQ1LDYuODUtMTUuMywxNS4zLTE1LjNoMjYzLjY4OSAgICAgYzguNDUxLDAsMTUuMzAxLDYuODUsMTUuMzAxLDE1LjNWMzM1LjQ3MUw1NTguODc4LDMzNS40NzF6IiBmaWxsPSIjMDAwMDAwIi8+CgkJCTxwYXRoIGQ9Ik01NDMuNTc3LDM5NC4xMTFIMjc5Ljg4OGMtMzIuMzM0LDAtNTguNjQtMjYuMzA2LTU4LjY0LTU4LjY0MXYtNjQuNzVjMC0zMi4zMzQsMjYuMzA2LTU4LjY0LDU4LjY0LTU4LjY0aDI2My42OTEgICAgIGMxNS42MzksMCwzMC4zNTcsNi4xMDYsNDEuNDQ1LDE3LjE5NGMxMS4wODksMTEuMDg4LDE3LjE5NCwyNS44MDcsMTcuMTkzLDQxLjQ0NXY2NC43NSAgICAgQzYwMi4yMTgsMzY3LjgwNiw1NzUuOTEyLDM5NC4xMTEsNTQzLjU3NywzOTQuMTExeiBNMjc5Ljg4OCwyMTMuMDgyYy0zMS43ODMsMC01Ny42NCwyNS44NTctNTcuNjQsNTcuNjR2NjQuNzUgICAgIGMwLDMxLjc4MywyNS44NTcsNTcuNjQxLDU3LjY0LDU3LjY0MWgyNjMuNjg5YzMxLjc4MywwLDU3LjY0MS0yNS44NTcsNTcuNjQxLTU3LjY0MXYtNjQuNzUgICAgIGMwLjAwMS0xNS4zNzEtNi4wMDEtMjkuODM5LTE2LjktNDAuNzM4Yy0xMC44OTgtMTAuODk5LTI1LjM2Ni0xNi45MDEtNDAuNzM4LTE2LjkwMUgyNzkuODg4eiBNNTQzLjU3OSwzNTEuMjcxSDI3OS44ODggICAgIGMtOC43MTIsMC0xNS44LTcuMDg4LTE1LjgtMTUuODAxdi02NC43NWMwLTguNzEyLDcuMDg4LTE1LjgsMTUuOC0xNS44aDI2My42ODljOC43MTMsMCwxNS44MDEsNy4wODgsMTUuODAxLDE1Ljh2NjQuNzUgICAgIEM1NTkuMzc4LDM0NC4xODQsNTUyLjI5MSwzNTEuMjcxLDU0My41NzksMzUxLjI3MXogTTI3OS44ODgsMjU1LjkyMWMtOC4xNjEsMC0xNC44LDYuNjM5LTE0LjgsMTQuOHY2NC43NSAgICAgYzAsOC4xNjEsNi42MzksMTQuODAxLDE0LjgsMTQuODAxaDI2My42OTFjOC4xNiwwLDE0Ljc5OS02LjY0LDE0Ljc5OS0xNC44MDF2LTY0Ljc1YzAtOC4xNjEtNi42NC0xNC44LTE0LjgwMS0xNC44SDI3OS44ODh6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPC9nPgoJCTxnPgoJCQk8cGF0aCBkPSJNNTQzLjU3OSw0MjQuNjYySDI3OS44ODhjLTMyLjA1OSwwLTU4LjE0LDI2LjA4Mi01OC4xNCw1OC4xNDF2NjQuNzVjMCwzMi4wNTksMjYuMDgyLDU4LjEzOSw1OC4xNCw1OC4xMzloMjYzLjY4OSAgICAgYzMyLjA1OSwwLDU4LjE0MS0yNi4wOCw1OC4xNDEtNTguMTM5di02NC43NUM2MDEuNzIsNDUwLjc0NCw1NzUuNjM4LDQyNC42NjIsNTQzLjU3OSw0MjQuNjYyeiBNNTU4Ljg3OCw1NDcuNTUzICAgICBjMCw4LjQ0OS02Ljg1LDE1LjI5OS0xNS4yOTksMTUuMjk5SDI3OS44ODhjLTguNDUsMC0xNS4zLTYuODUtMTUuMy0xNS4yOTl2LTY0Ljc1YzAtOC40NTEsNi44NS0xNS4zMDEsMTUuMy0xNS4zMDFoMjYzLjY4OSAgICAgYzguNDUxLDAsMTUuMzAxLDYuODUsMTUuMzAxLDE1LjMwMVY1NDcuNTUzTDU1OC44NzgsNTQ3LjU1M3oiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTU0My41NzcsNjA2LjE5MUgyNzkuODg4Yy0zMi4zMzQsMC01OC42NC0yNi4zMDYtNTguNjQtNTguNjM5di02NC43NWMwLTMyLjMzNSwyNi4zMDYtNTguNjQxLDU4LjY0LTU4LjY0MWgyNjMuNjkxICAgICBjMTUuNjM5LDAsMzAuMzU3LDYuMTA2LDQxLjQ0NSwxNy4xOTRjMTEuMDg5LDExLjA4OSwxNy4xOTQsMjUuODA4LDE3LjE5Myw0MS40NDZ2NjQuNzUgICAgIEM2MDIuMjE4LDU3OS44ODYsNTc1LjkxMiw2MDYuMTkxLDU0My41NzcsNjA2LjE5MXogTTI3OS44ODgsNDI1LjE2MmMtMzEuNzgzLDAtNTcuNjQsMjUuODU3LTU3LjY0LDU3LjY0MXY2NC43NSAgICAgYzAsMzEuNzgyLDI1Ljg1Nyw1Ny42MzksNTcuNjQsNTcuNjM5aDI2My42ODljMzEuNzgzLDAsNTcuNjQxLTI1Ljg1Niw1Ny42NDEtNTcuNjM5di02NC43NSAgICAgYzAuMDAxLTE1LjM3MS02LjAwMS0yOS44MzktMTYuOS00MC43MzhjLTEwLjg5OC0xMC44OTktMjUuMzY3LTE2LjkwMi00MC43MzgtMTYuOTAySDI3OS44ODh6IE01NDMuNTc5LDU2My4zNTJIMjc5Ljg4OCAgICAgYy04LjcxMiwwLTE1LjgtNy4wODctMTUuOC0xNS43OTl2LTY0Ljc1YzAtOC43MTMsNy4wODgtMTUuODAxLDE1LjgtMTUuODAxaDI2My42ODljOC43MTMsMCwxNS44MDEsNy4wODgsMTUuODAxLDE1LjgwMXY2NC43NSAgICAgQzU1OS4zNzgsNTU2LjI2NSw1NTIuMjkxLDU2My4zNTIsNTQzLjU3OSw1NjMuMzUyeiBNMjc5Ljg4OCw0NjguMDAyYy04LjE2MSwwLTE0LjgsNi42NC0xNC44LDE0LjgwMXY2NC43NSAgICAgYzAsOC4xNiw2LjYzOSwxNC43OTksMTQuOCwxNC43OTloMjYzLjY5MWM4LjE2LDAsMTQuNzk5LTYuNjM5LDE0Ljc5OS0xNC43OTl2LTY0Ljc1YzAtOC4xNjEtNi42NC0xNC44MDEtMTQuODAxLTE0LjgwMUgyNzkuODg4eiAgICAgIiBmaWxsPSIjMDAwMDAwIi8+CgkJPC9nPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/4264/Autoforum%20%28Forum%20Expander%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4264/Autoforum%20%28Forum%20Expander%29.meta.js
// ==/UserScript==


///////////////////////////////////
// Впринципе развернуть можно кучу phpBB сайтов, но либо надо делать 
// окно настроек, либо кастомизацию в коде
///////////////////////////////////

// 23:08 05.05.2013	*.*.*.*		заливка на us.org
// 09:00 16.08.2014	0.0.0.1		Сброс версии
// 09:03 16.08.2014	0.0.0.2		заливка на GitHUb + синхронизация с GitForge
// 13:25 08.11.2014	0.0.0.3 	Поправил хоткеи, теперь если находимся не в области постов, хоткеи не срабатывают (мешали вводу поискового запроса на форме)
// 23:58 18.12.2014	0.0.0.4		Поправлена загрузка картинок (пропускались некоторые)
// 2017 09 27 16 13	0.0.0.5		Добавлены Grant, т.к. обязательны, убрано название обрабатываемых сайтов, потом прикрутить редактор списка обрабатываемых хостов.
// 2017 09 27 17 07	0.0.0.6		Pal Donate
// 2017 09 27 17 16	0.0.0.7		Support url
// 2017 09 27 17 28	0.0.0.8		+Icon
// 2017 11 10 17 10	0.0.0.9		Переехала ссылка синхронизации в индивидуальную подпапку
// 2017 11 15 19 05	0.0.0.10	Переехала ссылка главной страницы скрипта
// 2017 11 15 19 09	0.0.0.11	@match => @include не разобрался в чём отличия


var http = new XMLHttpRequest();
var tempdoc = new DOMParser();
var origtitle = document.title;
var msgidx = -1;
var msgs = Array();
var cellidx = 1;
var topics = Array();
var hasscipts = 0;



var allrows = document.getElementsByTagName('tr');

for (var i = 0; i<allrows.length; i++)
{
  // if (allrows[i].className.indexOf('hl-tr') >= 0)
    topics.push(allrows[i]);
};

if (0 === topics.length)
for (var i = 0; i<allrows.length; i++)
{
  if (allrows[i].id.indexOf('tr-') == 0)
    topics.push(allrows[i]);
};

// 

if ('viewforum.php' === location.pathname.split('/')[2])
{
  cellidx = 1;
  document.title = '['+  topics.length +'] ' +origtitle;
}
else
if ('tracker.php' === location.pathname.split('/')[2])
{
  cellidx = 3;
  document.title = '['+  topics.length +'] ' +origtitle;
}
else
if ('search.php' === location.pathname.split('/')[2])
{
  cellidx = 2;
  document.title = '['+  topics.length +'] ' +origtitle;
}
else
if ('search_cse.php' === location.pathname.split('/')[2])
{
  cellidx = 0;
  document.title = '['+  topics.length +'] ' +origtitle;
}
else
  return null;



function pause(ms)
{
  return;
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < ms);
}

function getcontent(url)
{
  try
  {
    http.open('GET', url+'&tmp='+Math.random(), false);
    http.send(null);
  }
  catch(e)
  { return null; };

  if (http.status == 200)
    return tempdoc.parseFromString(http.responseText, 'text/html');
  return null;
}

function makeImages(dom)
{
  var spans = dom.getElementsByTagName('var');
  var mwidth = window.innerWidth * 0.8;
  for (var i = spans.length -1; i>=0; i--)
  if (spans[i].className.indexOf('postImg') >= 0)
  {
    var aimg = document.createElement('img');
    var src = spans[i].getAttribute('title');

    var img = new Image();
    img.src = src;
    var divider = 1;
    if (img.width > mwidth )
    {
      divider = (img.width / mwidth);
      aimg.setAttribute('width', Math.round(img.width / divider));
      aimg.setAttribute('height', Math.round(img.height / divider));
    }

    aimg.setAttribute('src', src);
    aimg.className = spans[i].className;
    spans[i].parentNode.insertBefore(aimg, spans[i]);
    spans[i].parentNode.removeChild(spans[i]);
  }

  var spans = dom.getElementsByTagName('div');
  for (var i = spans.length -1; i>=0; i--)
  if (spans[i].className.indexOf('sp-') >= 0)
  {
    var imgs = spans[i].getElementsByTagName('img');
    if ((imgs.length > 0) && (imgs.length < 25))
    {
      spans[i].style.display = 'block';
    }
  }

  var spans = dom.getElementsByTagName('a');
  for (var i = 0; i < spans.length; i++)
    spans[i].setAttribute('target', '_blank');
}

function GetFirstPost(url)
{
  var dom = getcontent(url);
  if (null == dom) 
    return null;

  if (hasscipts)
  {
   hasscipts = 1;
   var scripts = dom.getElementsByTagName('script');
   for (var i = 0; i < scripts.length; i++)
     document.documentElement.appendChild(scripts[i]);
   alert('scripts copied');
  }

  var atable = dom.getElementById('topic_main');
  if (null == atable)
    return -1;

  var amessages = atable.getElementsByTagName('td');
  for (var i = 0; i < amessages.length; i++)
    if (amessages[i].className == 'message td2') 
    {
      makeImages(amessages[i]);
      return amessages[i];
    }
  return -1;
}

var topicsprocessed = 0;

function findtable(element)
{
  while (1)
  {
    if (element == null) return null;
    if (element == document.body) return null;
    if (element.nodeName.toLowerCase() == 'table') return element;
    element = element.parentNode;
  }
}

function strip_tags( str )
	// Strip HTML and PHP tags from a string
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
{
  return str.replace(/<\/?[^>]+>/gi, '');
}

for (var i = 0; i<topics.length; i++)
{
  var textcell = topics[i].getElementsByTagName('td')[cellidx];
  if (!textcell) 
    continue;

  var lnks = textcell.getElementsByTagName('a');
  var lnk = lnks[0];

  if (cellidx != 2)
  for (var n = 0; n < lnks.length; n++)
    if (lnks[n].className == 'torTopic bold tt-text') lnk = lnks[n];

  if (cellidx == 2)
  for (var n = 0; n < lnks.length; n++)
    if (lnks[n].className == 'topictitle') lnk = lnks[n];

  if (!lnk)
    continue;

  if (String(lnk).indexOf('viewtopic.php') <0)
    continue;

  textcell.setAttribute('lnk', lnk);
  textcell.setAttribute('ttl', strip_tags(lnk.innerHTML) );

  document.title = '[...'+ (topicsprocessed +1) +'/' +topics.length +'] ' +lnk;
  textcell.scrollIntoView();
  var amsg = null;
  for (var n = 0; n< 5; n++)
  {
    amsg = GetFirstPost(lnk);
    if (-1 === amsg)
      break;

    if (null != amsg)
    {
      msgs.push(textcell);
      textcell.innerHTML = amsg.innerHTML;
      break;
    }
    // alert(lnk +' : no page');
    document.title = '[$..'+ (n +1) +'] ' +lnk;
  }
  // if (-1 === amsg) alert(lnk +' : no first post content');

  topicsprocessed++;
  document.title = '['+ topicsprocessed +'/' +topics.length +'] ' +origtitle;
}

if (msgs.length > 0)
{
  var atbl = findtable(msgs[0]);
  atbl.innerHTML = '';
  for (var i = 0; i < msgs.length; i++)
  {
    var tr = document.createElement('tr');
    tr.appendChild(msgs[i]);
    atbl.appendChild(tr);
  }
  msgs[0].scrollIntoView();
}

function setDocTitle(idx)
{
  document.title = '[>'+ (1 +idx)+'/' +msgs.length +'] ' +msgs[idx].getAttribute('ttl');
}



function keypresshandler(e)
{
  if (((e.charCode == 106)&&(msgidx != -1)) || (e.keyCode == 37))
  {
    msgidx++;
    if (msgidx >= msgs.length) msgidx = 0;
    msgs[msgidx].scrollIntoView();
    return false;
  }

  if (((e.charCode == 107)&&(msgidx != -1)) || (e.keyCode == 39))
  {
    msgidx--;
    if (msgidx < 0) msgidx = msgs.length -1;
    msgs[msgidx].scrollIntoView();
    return false;
  }

  if ((e.charCode == 32)&&(msgidx != -1))
  {
    window.open(msgs[msgidx].getAttribute('lnk'),  '_blank');
    return false;
  }
  
  if (((e.charCode == 108)&&(msgidx != -1)) || (e.keyCode == 45))
  {
    window.sidebar.addPanel(msgs[msgidx].getAttribute('ttl'), msgs[msgidx].getAttribute('lnk'), ''); 
    return false;
  }

  // alert(e.charCode +' '+e.keyCode);
}

function scrollhandler(e)
{
  for (var i = 0; i < msgs.length; i++)
  if ((msgs[i].getBoundingClientRect().top < 1) && (msgs[i].getBoundingClientRect().bottom >= 1))
  {
    setDocTitle(i);
    msgidx = i;
    return false;
  }
  msgidx = -1;
  document.title = origtitle;
}

document.title = origtitle;
window.onkeypress = keypresshandler;
window.onscroll = scrollhandler;
window.onmousedown = keypresshandler;
