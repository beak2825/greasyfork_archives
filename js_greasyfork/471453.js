// ==UserScript==
// @name         华为云空间“备忘录”UI改善
// @version      0.1
// @description  优化华为云空间“备忘录”UI呈现，更符合新版设计风格。
// @author       leisurefire
// @match        https://cloud.huawei.com/*
// @match        http://cloud.huawei.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huawei.com
// @namespace https://greasyfork.org/users/1005211
// @downloadURL https://update.greasyfork.org/scripts/471453/%E5%8D%8E%E4%B8%BA%E4%BA%91%E7%A9%BA%E9%97%B4%E2%80%9C%E5%A4%87%E5%BF%98%E5%BD%95%E2%80%9DUI%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/471453/%E5%8D%8E%E4%B8%BA%E4%BA%91%E7%A9%BA%E9%97%B4%E2%80%9C%E5%A4%87%E5%BF%98%E5%BD%95%E2%80%9DUI%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = '*{\n' +
        '    font-family: HarmonyOS Sans, serif !important;\n' +
        '}\n' +
        'body{\n' +
        '  height: 100vh !important;\n' +
        '  width: 100vw !important;\n' +
        '  overflow: hidden !important;\n' +
        '}\n' +
        '#appLoading{display:none}' +
        '.pop_box_son{\n' +
        '  box-shadow: none !important;\n' +
        '  border:none;\n' +
        '  border-radius: 18px !important;\n' +
        '  padding: 16px 24px 16px 24px !important;\n' +
        '  background-color: rgba(255,255,255,0.64) !important;\n' +
        '  backdrop-filter: blur(20px) saturate(200%) !important;\n' +
        '}\n' +
        '.pop_tip_title{\n' +
        '  font-size: 21px !important;\n' +
        '  font-weight: 500;\n' +
        '}\n' +
        '.buttons{\n' +
        '  margin-top: 18px !important;\n' +
        '}\n' +
        '.pop_button{\n' +
        '  background-color: transparent !important;\n' +
        '  font-size: 16px !important;\n' +
        '  width: 50% !important;\n' +
        '  border: none !important;\n' +
        '  margin-left: 0 !important;\n' +
        '  height: 42px !important;\n' +
        '  line-height: 42px !important;\n' +
        '  border-radius: 42px !important;\n' +
        '}\n' +
        '.pop_button:hover{\n' +
        '    background-color: rgba(0,0,0,.04) !important;\n' +
        '}\n' +
        '.mb48{\n' +
        '    margin-top: 12px !important;\n' +
        '}\n' +
        '.notepad{' +
        '   width: 100vw !important;' +
        '   height: 100vh !important;' +
        '   overflow: hidden;' +
        '}' +
        '.notepad_nav_down{\n' +
        '    display: none;\n' +
        '}\n' +
        '.notepad_nav{\n' +
        '    pointer-events: none;\n' +
        '    height: 64px !important;\n' +
        '    line-height: 64px !important;\n' +
        '    background-color: white;\n' +
        '    width: 100vw;\n' +
        '    z-index: 100;\n' +
        '}\n' +
        '.notepad_nav_icon{\n' +
        '  margin-left: 56px !important;\n' +
        '  margin-right: 8px !important;\n' +
        '  margin-top: 8px !important;\n' +
        '  margin-bottom: 12px !important;\n' +
        '  width: 48px !important;\n' +
        '  height: 48px !important;\n' +
        '  background-repeat: no-repeat !important;\n' +
        '  background-size: contain !important;\n' +
        '}\n' +
        '.notepad_nav_title{\n' +
        '  font-size: 21px !important;\n' +
        '}\n' +
        '.notepad_left{width: 48px !important}' +
        '.notepad_tab{\n' +
        '  display: block !important;\n' +
        '  position: fixed;\n' +
        '  top: 64px;\n' +
        '  left: 0;\n' +
        '  width: 48px;\n' +
        '  height: 100vh !important;\n' +
        '   background-color: white;\n' +
        '  z-index: 99;\n' +
        '   cursor: default !important;' +
        '   overflow: hidden;' +
        'transition: all 0.32s;' +
        '}\n' +
        '.notepad_tab *{\n' +
        '   display: block !important;\n' +
        '   height: calc(48px) !important;\n' +
        '   border: none !important;\n' +
        '   border-radius: 12px !important;\n' +
        '   margin-bottom: 8px !important;' +
        '   cursor:pointer;' +
        '   padding-left: 48px;' +
        '   line-height: 48px !important;' +
        '   font-size: 16px !important;' +
        '   text-align: left !important;' +
        '   transition: all 0.32s;' +
        '}\n' +
        '.notepad_tab *:hover{\n' +
        ' \tbackground-color: rgb(225,225,225);\n' +
        '}\n' +
        '.notepad_tab *:before{\n' +
        '  margin-top: calc(0px);\n' +
        '  display: inline-block;\n' +
        '  content: "";\n' +
        '  position: absolute;\n' +
        '  height: 48px;\n' +
        '  width: 48px;\n' +
        '  background-size: 54%;\n' +
        '  background-repeat: no-repeat;\n' +
        '  background-position: center;' +
        '   left: 8px;\n' +
        '}\n' +
        '.notepad_tab *:first-child:before{\n' +
        '\tbackground-image: url(\'data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj4KICAgIDx0aXRsZT5QdWJsaWMvaWNfcHVibGljX25vdGVzPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGQ9Ik0xNS44NzIyMjk2LDEgQzE3LjYxNzMzMDEsMSAxOC4yNzM4MTE0LDEuMTc3ODM1MjEgMTguOTEyMDgsMS41MTIyMzQ5NyBMMTguOTUzNjkxNCwxLjUzNDI2NTQxIEMxOS41NzQ1MDI3LDEuODY2Mjc4OTIgMjAuMDY4MDgwNywyLjM0NjEwNDY0IDIwLjQxNDgyNjQsMi45NTQxNDM2IEwyMC40NjU3MzQ2LDMuMDQ2MzA4NTkgQzIwLjgxNDM0ODgsMy42OTgxNjA0NCAyMSw0LjM0NDczMjkyIDIxLDYuMTI3NzcwNCBMMjEsMTcuODcyMjI5NiBMMjAuOTk4OTkzMiwxOC4wOTM3NjU3IEMyMC45ODQyNDAxLDE5LjY3NDM4MSAyMC44MDc2MjU3LDIwLjMwMTU2MjIgMjAuNDg3NzY1LDIwLjkxMjA4IEwyMC40NjU3MzQ2LDIwLjk1MzY5MTQgQzIwLjEzMzcyMTEsMjEuNTc0NTAyNyAxOS42NTM4OTU0LDIyLjA2ODA4MDcgMTkuMDQ1ODU2NCwyMi40MTQ4MjY0IEwxOC45NTM2OTE0LDIyLjQ2NTczNDYgQzE4LjMwMTgzOTYsMjIuODE0MzQ4OCAxNy42NTUyNjcxLDIzIDE1Ljg3MjIyOTYsMjMgTDguMTI3NzcwNCwyMyBMNy45MDYyMzQyNiwyMi45OTg5OTMyIEM2LjMyNTYxODk5LDIyLjk4NDI0MDEgNS42OTg0Mzc4MywyMi44MDc2MjU3IDUuMDg3OTE5OTksMjIuNDg3NzY1IEw1LjA0NjMwODU5LDIyLjQ2NTczNDYgQzQuNDI1NDk3MzEsMjIuMTMzNzIxMSAzLjkzMTkxOTMxLDIxLjY1Mzg5NTQgMy41ODUxNzM1OCwyMS4wNDU4NTY0IEwzLjUzNDI2NTQxLDIwLjk1MzY5MTQgQzMuMTg1NjUxMjIsMjAuMzAxODM5NiAzLDE5LjY1NTI2NzEgMywxNy44NzIyMjk2IEwzLDYuMTI3NzcwNCBDMyw0LjM4MjY2OTg5IDMuMTc3ODM1MjEsMy43MjYxODg2NCAzLjUxMjIzNDk3LDMuMDg3OTE5OTkgTDMuNTM0MjY1NDEsMy4wNDYzMDg1OSBDMy44NjYyNzg5MiwyLjQyNTQ5NzMxIDQuMzQ2MTA0NjQsMS45MzE5MTkzMSA0Ljk1NDE0MzYsMS41ODUxNzM1OCBMNS4wNDYzMDg1OSwxLjUzNDI2NTQxIEM1LjY5ODE2MDQ0LDEuMTg1NjUxMjIgNi4zNDQ3MzI5MiwxIDguMTI3NzcwNCwxIEwxNS44NzIyMjk2LDEgWiBNMTYuMDc1MzM4MSwyLjUwMDcwNjU1IEw4LjAyNDUzODMzLDIuNTAwMTc1NDEgTDcuODIzMDU4MDQsMi41MDE2NTggQzYuNjU1MDgxNiwyLjUxNTE3NjcgNi4yMDk4MTYwOCwyLjYxMzA1NTM0IDUuNzUzNzA2ODgsMi44NTY5ODUyIEM1LjM2MzI1Nzc0LDMuMDY1Nzk5NjkgNS4wNjU3OTk2OSwzLjM2MzI1Nzc0IDQuODU2OTg1MiwzLjc1MzcwNjg4IEM0LjU5MjkwMTU5LDQuMjQ3NTAwMzIgNC41LDQuNzI4NTg0MjEgNC41LDYuMTI3NzcwNCBMNC41MDAxNzU0MSwxNy45NzU0NjE3IEw0LjUwMTY1OCwxOC4xNzY5NDIgQzQuNTE1MTc2NywxOS4zNDQ5MTg0IDQuNjEzMDU1MzQsMTkuNzkwMTgzOSA0Ljg1Njk4NTIsMjAuMjQ2MjkzMSBDNS4wNjU3OTk2OSwyMC42MzY3NDIzIDUuMzYzMjU3NzQsMjAuOTM0MjAwMyA1Ljc1MzcwNjg4LDIxLjE0MzAxNDggQzYuMjIyODEwNjQsMjEuMzkzODk0MiA2LjY4MDQ0NDA1LDIxLjQ5MDI4MTkgNy45MjQ2NjE4OSwyMS40OTkyOTM1IEw4LjEyNzc3MDQsMjEuNSBMMTUuODcyMjI5NiwyMS41IEMxNy4yNzE0MTU4LDIxLjUgMTcuNzUyNDk5NywyMS40MDcwOTg0IDE4LjI0NjI5MzEsMjEuMTQzMDE0OCBDMTguNjM2NzQyMywyMC45MzQyMDAzIDE4LjkzNDIwMDMsMjAuNjM2NzQyMyAxOS4xNDMwMTQ4LDIwLjI0NjI5MzEgQzE5LjM5Mzg5NDIsMTkuNzc3MTg5NCAxOS40OTAyODE5LDE5LjMxOTU1NiAxOS40OTkyOTM1LDE4LjA3NTMzODEgTDE5LjUsMTcuODcyMjI5NiBMMTkuNSw2LjEyNzc3MDQgQzE5LjUsNC43Mjg1ODQyMSAxOS40MDcwOTg0LDQuMjQ3NTAwMzIgMTkuMTQzMDE0OCwzLjc1MzcwNjg4IEMxOC45MzQyMDAzLDMuMzYzMjU3NzQgMTguNjM2NzQyMywzLjA2NTc5OTY5IDE4LjI0NjI5MzEsMi44NTY5ODUyIEMxNy43NzcxODk0LDIuNjA2MTA1NzcgMTcuMzE5NTU2LDIuNTA5NzE4MTEgMTYuMDc1MzM4MSwyLjUwMDcwNjU1IFogTTEyLDE2LjI1IEMxMi40MTQyMTM2LDE2LjI1IDEyLjc1LDE2LjU4NTc4NjQgMTIuNzUsMTcgQzEyLjc1LDE3LjQxNDIxMzYgMTIuNDE0MjEzNiwxNy43NSAxMiwxNy43NSBMNy41LDE3Ljc1IEM3LjA4NTc4NjQ0LDE3Ljc1IDYuNzUsMTcuNDE0MjEzNiA2Ljc1LDE3IEM2Ljc1LDE2LjU4NTc4NjQgNy4wODU3ODY0NCwxNi4yNSA3LjUsMTYuMjUgTDEyLDE2LjI1IFogTTE2LjUsMTEuMjUgQzE2LjkxNDIxMzYsMTEuMjUgMTcuMjUsMTEuNTg1Nzg2NCAxNy4yNSwxMiBDMTcuMjUsMTIuNDE0MjEzNiAxNi45MTQyMTM2LDEyLjc1IDE2LjUsMTIuNzUgTDcuNSwxMi43NSBDNy4wODU3ODY0NCwxMi43NSA2Ljc1LDEyLjQxNDIxMzYgNi43NSwxMiBDNi43NSwxMS41ODU3ODY0IDcuMDg1Nzg2NDQsMTEuMjUgNy41LDExLjI1IEwxNi41LDExLjI1IFogTTE2LjUsNi4yNSBDMTYuOTE0MjEzNiw2LjI1IDE3LjI1LDYuNTg1Nzg2NDQgMTcuMjUsNyBDMTcuMjUsNy40MTQyMTM1NiAxNi45MTQyMTM2LDcuNzUgMTYuNSw3Ljc1IEw3LjUsNy43NSBDNy4wODU3ODY0NCw3Ljc1IDYuNzUsNy40MTQyMTM1NiA2Ljc1LDcgQzYuNzUsNi41ODU3ODY0NCA3LjA4NTc4NjQ0LDYuMjUgNy41LDYuMjUgTDE2LjUsNi4yNSBaIiBpZD0iX3BhdGgtMSIvPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Il9QdWJsaWMvaWNfcHVibGljX25vdGVzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8bWFzayBpZD0iX21hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNfcGF0aC0xIi8+CiAgICAgICAgPC9tYXNrPgogICAgICAgIDx1c2UgaWQ9Il/lvaLnirbnu5PlkIgiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgeGxpbms6aHJlZj0iI19wYXRoLTEiLz4KICAgIDwvZz4KPC9zdmc+\');\n' +
        '}\n' +
        '.notepad_tab *:last-child:before{\n' +
        '  background-image: url(\'data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj4KICAgIDx0aXRsZT5QdWJsaWMvaWNfcHVibGljX3RvZG88L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTEyLDEgQzE4LjA3NTEzMjIsMSAyMyw1LjkyNDg2Nzc1IDIzLDEyIEMyMywxOC4wNzUxMzIyIDE4LjA3NTEzMjIsMjMgMTIsMjMgQzUuOTI0ODY3NzUsMjMgMSwxOC4wNzUxMzIyIDEsMTIgQzEsNS45MjQ4Njc3NSA1LjkyNDg2Nzc1LDEgMTIsMSBaIE0xMiwyLjUgQzYuNzUzMjk0ODgsMi41IDIuNSw2Ljc1MzI5NDg4IDIuNSwxMiBDMi41LDE3LjI0NjcwNTEgNi43NTMyOTQ4OCwyMS41IDEyLDIxLjUgQzE3LjI0NjcwNTEsMjEuNSAyMS41LDE3LjI0NjcwNTEgMjEuNSwxMiBDMjEuNSw2Ljc1MzI5NDg4IDE3LjI0NjcwNTEsMi41IDEyLDIuNSBaIE0xOC4xODcxODQzLDguNzE5NjY5OTEgQzE4LjQ2OTYxNzEsOS4wMDIxMDI2NiAxOC40Nzk3MDQsOS40NTM3NDk0MyAxOC4yMTc0NDUsOS43NDgyNjg5IEwxOC4xODcxODQzLDkuNzgwMzMwMDkgTDEyLjIzNzQzNjksMTUuNzMwMDc3NiBDMTEuNTY4MjU3MiwxNi4zOTkyNTcyIDEwLjQ5MTk2NDYsMTYuNDEzMTk4NCA5LjgwNTgyMTk0LDE1Ljc3MTkwMTMgTDkuNzYyNTYzMTMsMTUuNzMwMDc3NiBMNi4zMTI4MTU2NiwxMi4yODAzMzAxIEM2LjIwNjMwOTA0LDEyLjE3MzgyMzUgNi4xMzg1MzIxLDEyLjA0MzI1MzMgNi4xMDk0ODQ4NCwxMS45MDYxMjAzIEw2LjA5NDk2MTIsMTEuODAyMzEzNiBMNi4wOTQ5NjEyLDExLjY5NzY4NjQgQzYuMTA3MDY0MjMsMTEuNTIzNTM1OCA2LjE3OTY4MjM4LDExLjM1MjgwMzIgNi4zMTI4MTU2NiwxMS4yMTk2Njk5IEM2LjU5NTI0ODQxLDEwLjkzNzIzNzIgNy4wNDY4OTUxOCwxMC45MjcxNTAzIDcuMzQxNDE0NjUsMTEuMTg5NDA5MyBMNy4zNzM0NzU4NCwxMS4yMTk2Njk5IEwxMC40Njk2Njk5LDE0LjMxNTg2NCBDMTAuNzUyMTAyNywxNC41OTgyOTY3IDExLjIwMzc0OTQsMTQuNjA4MzgzNiAxMS40OTgyNjg5LDE0LjM0NjEyNDYgTDExLjUzMDMzMDEsMTQuMzE1ODY0IEwxNy4xMjY1MjQyLDguNzE5NjY5OTEgQzE3LjQxOTQxNzQsOC40MjY3NzY3IDE3Ljg5NDI5MTEsOC40MjY3NzY3IDE4LjE4NzE4NDMsOC43MTk2Njk5MSBaIiBpZD0iX3BhdGgtMSIvPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Il9QdWJsaWMvaWNfcHVibGljX3RvZG8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxtYXNrIGlkPSJfbWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI19wYXRoLTEiLz4KICAgICAgICA8L21hc2s+CiAgICAgICAgPHVzZSBpZD0iX+W9oueKtue7k+WQiCIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiB4bGluazpocmVmPSIjX3BhdGgtMSIvPgogICAgPC9nPgo8L3N2Zz4=\')\n' +
        '}\n' +
        '.notepad_tab_active:first-child:before{\n' +
        '  background-image: url(\'data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj4KICAgIDx0aXRsZT5QdWJsaWMvaWNfcHVibGljX25vdGVzX2ZpbGxlZDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNMTUuODcyMjI5NiwxIEMxNy42MTczMzAxLDEgMTguMjczODExNCwxLjE3NzgzNTIxIDE4LjkxMjA4LDEuNTEyMjM0OTcgTDE4Ljk1MzY5MTQsMS41MzQyNjU0MSBDMTkuNTc0NTAyNywxLjg2NjI3ODkyIDIwLjA2ODA4MDcsMi4zNDYxMDQ2NCAyMC40MTQ4MjY0LDIuOTU0MTQzNiBMMjAuNDY1NzM0NiwzLjA0NjMwODU5IEMyMC44MTQzNDg4LDMuNjk4MTYwNDQgMjEsNC4zNDQ3MzI5MiAyMSw2LjEyNzc3MDQgTDIxLDE3Ljg3MjIyOTYgTDIwLjk5ODk5MzIsMTguMDkzNzY1NyBDMjAuOTg0MjQwMSwxOS42NzQzODEgMjAuODA3NjI1NywyMC4zMDE1NjIyIDIwLjQ4Nzc2NSwyMC45MTIwOCBMMjAuNDY1NzM0NiwyMC45NTM2OTE0IEMyMC4xMzM3MjExLDIxLjU3NDUwMjcgMTkuNjUzODk1NCwyMi4wNjgwODA3IDE5LjA0NTg1NjQsMjIuNDE0ODI2NCBMMTguOTUzNjkxNCwyMi40NjU3MzQ2IEMxOC4zMDE4Mzk2LDIyLjgxNDM0ODggMTcuNjU1MjY3MSwyMyAxNS44NzIyMjk2LDIzIEw4LjEyNzc3MDQsMjMgTDcuOTA2MjM0MjYsMjIuOTk4OTkzMiBDNi4zMjU2MTg5OSwyMi45ODQyNDAxIDUuNjk4NDM3ODMsMjIuODA3NjI1NyA1LjA4NzkxOTk5LDIyLjQ4Nzc2NSBMNS4wNDYzMDg1OSwyMi40NjU3MzQ2IEM0LjQyNTQ5NzMxLDIyLjEzMzcyMTEgMy45MzE5MTkzMSwyMS42NTM4OTU0IDMuNTg1MTczNTgsMjEuMDQ1ODU2NCBMMy41MzQyNjU0MSwyMC45NTM2OTE0IEMzLjE4NTY1MTIyLDIwLjMwMTgzOTYgMywxOS42NTUyNjcxIDMsMTcuODcyMjI5NiBMMyw2LjEyNzc3MDQgQzMsNC4zODI2Njk4OSAzLjE3NzgzNTIxLDMuNzI2MTg4NjQgMy41MTIyMzQ5NywzLjA4NzkxOTk5IEwzLjUzNDI2NTQxLDMuMDQ2MzA4NTkgQzMuODY2Mjc4OTIsMi40MjU0OTczMSA0LjM0NjEwNDY0LDEuOTMxOTE5MzEgNC45NTQxNDM2LDEuNTg1MTczNTggTDUuMDQ2MzA4NTksMS41MzQyNjU0MSBDNS42OTgxNjA0NCwxLjE4NTY1MTIyIDYuMzQ0NzMyOTIsMSA4LjEyNzc3MDQsMSBMMTUuODcyMjI5NiwxIFogTTEyLDE2LjI1IEw3LjUsMTYuMjUgQzcuMDg1Nzg2NDQsMTYuMjUgNi43NSwxNi41ODU3ODY0IDYuNzUsMTcgQzYuNzUsMTcuNDE0MjEzNiA3LjA4NTc4NjQ0LDE3Ljc1IDcuNSwxNy43NSBMNy41LDE3Ljc1IEwxMiwxNy43NSBDMTIuNDE0MjEzNiwxNy43NSAxMi43NSwxNy40MTQyMTM2IDEyLjc1LDE3IEMxMi43NSwxNi41ODU3ODY0IDEyLjQxNDIxMzYsMTYuMjUgMTIsMTYuMjUgTDEyLDE2LjI1IFogTTE2LjUsMTEuMjUgTDcuNSwxMS4yNSBDNy4wODU3ODY0NCwxMS4yNSA2Ljc1LDExLjU4NTc4NjQgNi43NSwxMiBDNi43NSwxMi40MTQyMTM2IDcuMDg1Nzg2NDQsMTIuNzUgNy41LDEyLjc1IEw3LjUsMTIuNzUgTDE2LjUsMTIuNzUgQzE2LjkxNDIxMzYsMTIuNzUgMTcuMjUsMTIuNDE0MjEzNiAxNy4yNSwxMiBDMTcuMjUsMTEuNTg1Nzg2NCAxNi45MTQyMTM2LDExLjI1IDE2LjUsMTEuMjUgTDE2LjUsMTEuMjUgWiBNMTYuNSw2LjI1IEw3LjUsNi4yNSBDNy4wODU3ODY0NCw2LjI1IDYuNzUsNi41ODU3ODY0NCA2Ljc1LDcgQzYuNzUsNy40MTQyMTM1NiA3LjA4NTc4NjQ0LDcuNzUgNy41LDcuNzUgTDcuNSw3Ljc1IEwxNi41LDcuNzUgQzE2LjkxNDIxMzYsNy43NSAxNy4yNSw3LjQxNDIxMzU2IDE3LjI1LDcgQzE3LjI1LDYuNTg1Nzg2NDQgMTYuOTE0MjEzNiw2LjI1IDE2LjUsNi4yNSBMMTYuNSw2LjI1IFoiIGlkPSJfcGF0aC0xIi8+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iX1B1YmxpYy9pY19wdWJsaWNfbm90ZXNfZmlsbGVkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8bWFzayBpZD0iX21hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNfcGF0aC0xIi8+CiAgICAgICAgPC9tYXNrPgogICAgICAgIDx1c2UgaWQ9Il/lvaLnirbnu5PlkIgiIGZpbGw9InJnYigxMCw4OSwyNDcpIiB4bGluazpocmVmPSIjX3BhdGgtMSIvPgogICAgPC9nPgo8L3N2Zz4=\')\n' +
        '}\n' +
        '.notepad_tab_active:last-child:before{\n' +
        '  background-image: url(\'data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj4KICAgIDx0aXRsZT5QdWJsaWMvaWNfcHVibGljX3RvZG9fZmlsbGVkPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGQ9Ik0xMiwxIEMxOC4wNzUxMzIyLDEgMjMsNS45MjQ4Njc3NSAyMywxMiBDMjMsMTguMDc1MTMyMiAxOC4wNzUxMzIyLDIzIDEyLDIzIEM1LjkyNDg2Nzc1LDIzIDEsMTguMDc1MTMyMiAxLDEyIEMxLDUuOTI0ODY3NzUgNS45MjQ4Njc3NSwxIDEyLDEgWiBNMTguMTg3MTg0Myw4LjcxOTY2OTkxIEMxNy44OTQyOTExLDguNDI2Nzc2NyAxNy40MTk0MTc0LDguNDI2Nzc2NyAxNy4xMjY1MjQyLDguNzE5NjY5OTEgTDE3LjEyNjUyNDIsOC43MTk2Njk5MSBMMTEuNTMwMzMwMSwxNC4zMTU4NjQgTDExLjQ5ODI2ODksMTQuMzQ2MTI0NiBDMTEuMjAzNzQ5NCwxNC42MDgzODM2IDEwLjc1MjEwMjcsMTQuNTk4Mjk2NyAxMC40Njk2Njk5LDE0LjMxNTg2NCBMMTAuNDY5NjY5OSwxNC4zMTU4NjQgTDcuMzczNDc1ODQsMTEuMjE5NjY5OSBMNy4zNDE0MTQ2NSwxMS4xODk0MDkzIEM3LjA0Njg5NTE4LDEwLjkyNzE1MDMgNi41OTUyNDg0MSwxMC45MzcyMzcyIDYuMzEyODE1NjYsMTEuMjE5NjY5OSBDNi4xNzk2ODIzOCwxMS4zNTI4MDMyIDYuMTA3MDY0MjMsMTEuNTIzNTM1OCA2LjA5NDk2MTIsMTEuNjk3Njg2NCBMNi4wOTQ5NjEyLDExLjY5NzY4NjQgTDYuMDk0OTYxMiwxMS44MDIzMTM2IEw2LjEwOTQ4NDg0LDExLjkwNjEyMDMgQzYuMTM4NTMyMSwxMi4wNDMyNTMzIDYuMjA2MzA5MDQsMTIuMTczODIzNSA2LjMxMjgxNTY2LDEyLjI4MDMzMDEgTDYuMzEyODE1NjYsMTIuMjgwMzMwMSBMOS43NjI1NjMxMywxNS43MzAwNzc2IEw5LjgwNTgyMTk0LDE1Ljc3MTkwMTMgQzEwLjQ5MTk2NDYsMTYuNDEzMTk4NCAxMS41NjgyNTcyLDE2LjM5OTI1NzIgMTIuMjM3NDM2OSwxNS43MzAwNzc2IEwxMi4yMzc0MzY5LDE1LjczMDA3NzYgTDE4LjE4NzE4NDMsOS43ODAzMzAwOSBMMTguMjE3NDQ1LDkuNzQ4MjY4OSBDMTguNDc5NzA0LDkuNDUzNzQ5NDMgMTguNDY5NjE3MSw5LjAwMjEwMjY2IDE4LjE4NzE4NDMsOC43MTk2Njk5MSBaIiBpZD0iX3BhdGgtMSIvPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Il9QdWJsaWMvaWNfcHVibGljX3RvZG9fZmlsbGVkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8bWFzayBpZD0iX21hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNfcGF0aC0xIi8+CiAgICAgICAgPC9tYXNrPgogICAgICAgIDx1c2UgaWQ9Il/lvaLnirbnu5PlkIgiIGZpbGw9InJnYigxMCw4OSwyNDcpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHhsaW5rOmhyZWY9IiNfcGF0aC0xIi8+CiAgICA8L2c+Cjwvc3ZnPg==\')\n' +
        '}\n' +
        '.category_list{\n' +
        '  margin-top: 68px;\n' +
        '  margin-left: 12px;\n' +
        '  display: none;\n' +
        '  position: fixed;\n' +
        '  left: 52px;\n' +
        '  width: unset;\n' +
        '  z-index: 99;\n' +
        '  height: calc(100vh - 96px) !important;\n' +
        '  transition: none;\n' +
        '  border-radius: 0 0 16px 16px;' +
        '  padding-right: 8px;' +
        '  padding-left: 12px;' +
        '  background-color: rgb(241, 243, 245);' +
        '   animation: list 0.36s ease-in-out;' +
        '}\n' +
        '@keyframes list{' +
        '  from{margin-top: 48px; opacity:0;}' +
        '   to{margin-top: 68px; opacity:1}' +
        '}'+
        '.category_list_title{\n' +
        '    padding: 12px;\n' +
        '    line-height: 26px;\n' +
        '    font-size: 26px;\n' +
        '    display: block;\n' +
        '    top: 78px;\n' +
        '    left: 72px;\n' +
        '    position: fixed;\n' +
        '    height: 36px;\n' +
        '    width: unset;\n' +
        '    z-index: 98;\n' +
        '    cursor: pointer;\n' +
        '}\n' +
        '.category_list::-webkit-scrollbar {\n' +
        '    display:none;\n' +
        '}\n' +
        '.category_item{\n' +
        '  width: calc(100% - 18px);\n' +
        '  margin-left: 8px;\n' +
        '  color: black !important;\n' +
        '  cursor: pointer;\n' +
        '  position: relative;\n' +
        '  background-color: white;\n' +
        '  padding-top: 6px;\n' +
        '  padding-bottom: 6px;\n' +
        '}\n' +
        '.category_item:hover{\n' +
        '  color: black;\n' +
        ' \tbackground-color: rgb(225,225,225);\n' +
        '}\n' +
        '.category_item:after{\n' +
        '  display: block;\n' +
        '  content: "";\n' +
        '  width: calc(80% - 8px);\n' +
        '  height: 1px;\n' +
        '  border-bottom: solid 0.8px rgb(204,204,204);\n' +
        '  position: absolute;\n' +
        '  bottom: 0;\n' +
        '  left: 20%;\n' +
        '}\n' +
        '.category_item:last-child:after{\n' +
        '  display: none;\n' +
        '}\n' +
        '.category_item_active{' +
        '   color: rgb(10,89,247) !important}' +
        '.category_item_active::before{\n' +
        '  display: none !important;\n' +
        '}\n' +
        '.category_item_icon{\n' +
        '  margin-left: 8px !important;\n' +
        '}\n' +
        '.category_item_name{\n' +
        '  margin-left: 8px;\n' +
        '}\n' +
        '.category_item_number{\n' +
        '  position: relative;\n' +
        '  float: right;\n' +
        '  right: 16px;\n' +
        '}\n' +
        '.category_title{\n' +
        '  margin-top: 12px;\n' +
        '}\n' +
        '.categoryList_0{\n' +
        '  border-radius: 12px 12px 0 0;\n' +
        '}\n' +
        '.unCategorized{\n' +
        '  border-radius: 0 0 12px 12px;\n' +
        '}\n' +
        '#allNote{\n' +
        '  position: relative;\n' +
        '  border-radius: 12px 12px 0 0;\n' +
        '}\n' +
        '#allTask{\n' +
        '  border-radius: 12px;\n' +
        '}\n' +
        '#allTask:after{\n' +
        '  display: none;\n' +
        '}\n' +
        '#noteFavorite{\n' +
        '\tborder-radius: 0 0 12px 12px;\n' +
        '}\n' +
        '#noteFavorite:after{\n' +
        '\tdisplay: none;\n' +
        '}\n' +
        '.notepad_center{\n' +
        '\tposition: relative;\n' +
        '  left: calc(16px);\n' +
        '  top: 64px;\n' +
        '  background-color: rgb(241,243,245) !important;\n' +
        '   border-radius: 16px 0 0 0;' +
        '   border: none !important;' +
        '}\n' +
        '.note_item_title{\n' +
        '    cursor: pointer;\n' +
        '}\n' +
        '.note_list_create, .task_list_create{\n' +
        '  position: absolute;\n' +
        '  top: calc(100vh - 132px);\n' +
        '  left: calc(100% - 64px);\n' +
        '  z-index: 99;\n' +
        '  height: 48px !important;\n' +
        '  width: 48px !important;\n' +
        '  background-color: rgb(10,89,247);\n' +
        '  border-radius: 50%;\n' +
        '  color: white !important;\n' +
        '  box-shadow: 0 2px 12px rgba(10,89,247,0.48);\n' +
        '  transform: scale(1.2);\n' +
        '  cursor: pointer;\n' +
        '  background-image: url(\'data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj4KICAgIDx0aXRsZT5QdWJsaWMvaWNfcHVibGljX2FkZF9maWxsZWQ8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTEyLDIgQzEyLjU1MjI4NDcsMiAxMywyLjQ0NzcxNTI1IDEzLDMgTDEzLDIxIEMxMywyMS41NTIyODQ3IDEyLjU1MjI4NDcsMjIgMTIsMjIgQzExLjQ0NzcxNTMsMjIgMTEsMjEuNTUyMjg0NyAxMSwyMSBMMTEsMTMgTDMsMTMgQzIuNDQ3NzE1MjUsMTMgMiwxMi41NTIyODQ3IDIsMTIgQzIsMTEuNDQ3NzE1MyAyLjQ0NzcxNTI1LDExIDMsMTEgTDExLDExIEwxMSwzIEMxMSwyLjQ0NzcxNTI1IDExLjQ0NzcxNTMsMiAxMiwyIFogTTIxLDExIEMyMS41NTIyODQ3LDExIDIyLDExLjQ0NzcxNTMgMjIsMTIgQzIyLDEyLjU1MjI4NDcgMjEuNTUyMjg0NywxMyAyMSwxMyBMMTMuOTk5LDEzIEwxMy45OTksMTEgTDIxLDExIFoiIGlkPSJfcGF0aC0xIi8+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iX1B1YmxpYy9pY19wdWJsaWNfYWRkX2ZpbGxlZCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPG1hc2sgaWQ9Il9tYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjX3BhdGgtMSIvPgogICAgICAgIDwvbWFzaz4KICAgICAgICA8dXNlIGlkPSJfQ29tYmluZWQtU2hhcGUiIGZpbGw9IndoaXRlIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHhsaW5rOmhyZWY9IiNfcGF0aC0xIi8+CiAgICA8L2c+Cjwvc3ZnPg==\');'+
        '  background-size: 60%;'+
        '  background-repeat: no-repeat;' +
        '  background-position: center;' +
        '  transition: all 0.24s;' +
        '}\n' +
        '.note_list_create:hover, .task_list_create:hover{\n' +
        '   transform: scale(1.16);\n' +
        '  background-size: 72%;'+
        '}\n' +
        '.note_list_create span, .task_list_create span{\n'+
        'opacity:0;'+
        '}\n'+
        '.note_list_type, .task_list_type{\n' +
        '  display: none;\n' +
        '  position: relative;\n' +
        '  left: 100%;\n' +
        '\ttop: 12px;\n' +
        '}\n' +
        '.listTypeBox{\n' +
        '  position: absolute;\n' +
        '  left: 100%;\n' +
        '}\n' +
        '.note_list_search{\n' +
        '   position:fixed !important;' +
        '   top: 6px !important;' +
        '   left: 240px;' +
        '   background-color: rgb(241,243,245) !important;\n' +
        '   z-index: 100;' +
        '   width: 240px !important;' +
        '   height: 36px !important;' +
        '}\n' +
        '.note_list_content{' +
        '   margin-top: 72px !important;' +
        '}' +
        '.note_item, .task_item{\n' +
        '  cursor: pointer;\n' +
        '  width: calc(100% - 14px) !important;\n' +
        '  border-radius: 12px !important;\n' +
        '  margin-bottom: 8px;\n' +
        '  margin-left: 8px;\n' +
        '  transition: all 0.32s;\n' +
        '  background-color: white;\n' +
        '}\n' +
        '.task_item{\n' +
        '  width: calc(100% - 56px) !important;\n' +
        '}\n' +
        '.task_item_titleTxt{\n' +
        '  position: relative;\n' +
        ' left: 2px !important;\n' +
        '}\n' +
        '.task_item_titleTxt{\n' +
        '  cursor: pointer !important;\n' +
        '}\n' +
        '.note_item:hover, .task_item:hover{\n' +
        '  background-color: rgb(225,225,225);\n' +
        '  transform: scale(0.96);\n' +
        '}\n' +
        '.scrollable-container{\n' +
        '  border-radius: 12px;\n' +
        '}\n' +
        '.task_list_title{\n' +
        '  margin-left: 8px;\n' +
        '}\n' +
        '.task_list_content .scrollable-container{\n' +
        '  margin-top: 64px !important;\n' +
        '}\n' +
        '.notepad_right{\n' +
        '  position: relative;\n' +
        '  left: 16px;\n'+
        '  top: 64px;\n' +
        '}\n' +
        '.note_view{' +
        '   background-color:rgb(241,243,245);' +
        '   border-radius: 0 16px 0 0;' +
        '}' +
        '.notepad_header{\n' +
        '  width: 75vw;\n' +
        '   background-color: rgb(241,243,245) !important;' +
        '}\n' +
        '.note_detail_title{\n' +
        '  padding-top: 12px !important;\n' +
        '   background-color:white;border-radius:12px 0 0 0;' +
        '}\n' +
        '.note_detail_title span{\n' +
        '  font-weight: 600 !important;\n' +
        '  font-size: 24px !important;\n' +
        '}\n' +
        '.note_detail_timeLine{\n' +
        '  margin-top: -8px !important;\n' +
        '}\n' +
        '.note_detail_content{background-color:white;}' +
        '.text_setting, .notepad_list_pop{\n' +
        '  border: none !important;\n' +
        '  margin-top: 8px;\n' +
        '  border-radius: 12px !important;;\n' +
        '  box-shadow: 0 0 18px 0 rgba(0,0,0,.1), 0 0 24px 0 rgba(0,0,0,.1) !important;;\n' +
        '}\n' +
        '.text_setting_title{\n' +
        '  display: none !important;\n' +
        '}\n' +
        '.zoom_active_line{\n' +
        '  height: 14px !important;\n' +
        '  top: 12.5px !important;\n' +
        '  border-radius: 14px 0 0 14px;\n' +
        '  background-color: rgba(10,89,247,1) !important;\n' +
        '}\n' +
        '.zoom_runway{\n' +
        '  height: 14px !important;\n' +
        '  top: 12.5px !important;\n' +
        '  border-radius: 14px;\n' +
        '}\n' +
        '.zoom_ball{\n' +
        '  border: none !important;\n' +
        '}\n' +
        '.zoom_point{\n' +
        '  width: 4px !important;\n' +
        '  height: 4px !important;\n' +
        '  border-radius: 50%;\n' +
        '  top: 17.5px !important;\n' +
        '}\n' +
        '.colorPick_item{\n' +
        '  transition: all 0.32s;\n' +
        '}\n' +
        '.bgPick_itemWrap{\n' +
        '  border-radius: 6px !important;\n' +
        '}\n' +
        '.list_pop_item{\n' +
        '  border-radius: 6px;\n' +
        '  margin-left: 2.5%;\n' +
        '  width: 80% !important;\n' +
        '}\n' +
        '.userAndHelp{\n' +
        '  position: fixed;\n' +
        '  top: 10px;\n' +
        '  right: 32px !important;\n' +
        '  float: right;\n' +
        '  z-index: 100 !important;\n' +
        '}\n' +
        '.userBox{\n' +
        '  color: black !important;\n' +
        '  padding: 0 8px;\n' +
        '  border-radius: 50%;\n' +
        '  width: 42px !important;\n' +
        '  height: 42px !important;\n' +
        '  overflow: hidden;' +
        '}\n' +
        '.userBox:hover{\n' +
        '  color: black !important;\n' +
        '  background-color: rgb(225,225,225) !important;\n' +
        '}\n' +
        '.userLeftHelp{\n' +
        '  display: none;\n' +
        '}\n' +
        '.user_panel{\n' +
        '  right: -24px !important;\n' +
        '  border: none !important;\n' +
        '  border-radius: 12px !important;\n' +
        '  box-shadow: 0 0 18px 0 rgba(0,0,0,.1), 0 0 24px 0 rgba(0,0,0,.1) !important;\n' +
        '  margin-top: 8px !important;' +
        '}\n' +
        '.userLeftarrow{\n' +
        '  display: none !important;\n' +
        '}'+
        '.userImg{' +
        '   width: 42px !important;' +
        '   margin: 0 !important;' +
        '   border-radius: 50% !important;' +
        '}';
    let head = document.head;
    let style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    let note_tab = "全部笔记▾";
    let task_tab = "全部待办▾";
    let tab = 0;

    let h2 = document.createElement('h2');
        if(window.location.href.includes("task")){
            h2.innerText = task_tab;
            tab = 1;
        }
        else {
            h2.innerText = note_tab;
        }
        h2.className = 'category_list_title';

        h2.onclick = ()=>{
            // h2.innerText = h2.innerText.slice(0, h2.innerText.length - 1) + (h2.innerText.at(-1) === '▾' ? '▴' : '▾');
            let list = document.getElementsByClassName('category_list')[0];
            list.style.display = list.style.display === 'block' ? 'none' : 'block';

            let width = document.getElementsByClassName('notepad_center')[0].offsetWidth - 20;
            document.getElementsByClassName('category_list')[0].style.width = width + 'px';
            let items = document.getElementsByClassName('category_item');

            for (let item of items) {
                for (let child of item.children[0].children) {
                    if(child.className === 'category_item_number'){
                        child.innerText = child.innerText.replace(/[()]/g, '');
                        break;
                    }
                }
                item.onclick = ()=> {
                    for (let child of item.children[0].children) {
                        if(child.className === 'category_item_name'){
                            if(tab){
                                task_tab = child.getAttribute("title");
                                h2.innerText = task_tab;
                            }
                            else {
                                note_tab = child.getAttribute('title');
                                h2.innerText = note_tab;
                            }
                            document.getElementsByClassName('category_list')[0].style.display = 'none';
                        }
                    }
                }
            }
        }

    let elSet = setInterval(()=>{
        let list = document.getElementsByClassName('category_list')[0];
        if(list){
            document.getElementsByClassName('notepad_center')[0].appendChild(h2);
            let width = document.getElementsByClassName('notepad_center')[0].offsetWidth - 20;
            document.getElementsByClassName('notepad_right')[0].style.width = "calc(100vw - 68px - " + width + "px)";

            document.getElementById('userName').innerText = "";

            document.getElementsByClassName('notepad_tab_note')[0].style.width = '0';
            document.getElementsByClassName('notepad_tab_note')[0].onclick = () => {
                document.getElementsByClassName('category_list')[0].style.display = 'none';
                h2.innerText = note_tab;
                tab = 0;
            }

            document.getElementsByClassName('notepad_tab_task')[0].style.width = '0';
            document.getElementsByClassName('notepad_tab_task')[0].onclick = () => {
                document.getElementsByClassName('category_list')[0].style.display = 'none';
                h2.innerText = task_tab;
                tab = 1;
            }


            document.getElementsByClassName('notepad_tab')[0].onmouseover = function(){
                this.style.width = '240px';
                for (let child of this.children) {
                    child.style.width = (240 - 48) + 'px';
                }
            }
            document.getElementsByClassName('notepad_tab')[0].onmouseleave = function () {
                this.style.width = '48px';
                for (let child of this.children) {
                    child.style.width = '0px';
                }
            }
            // let cate = document.getElementsByClassName('search-placeholder')[0].innterText;
            clearInterval(elSet);
            elSet = null;
        }
    }, 100);
    window.onresize = ()=>{
        let width = document.getElementsByClassName('notepad_center')[0].offsetWidth - 20;
        document.getElementsByClassName('category_list')[0].style.width = width + 'px';
        document.getElementsByClassName('notepad_right')[0].style.width = "calc(100vw - 68px - " + width + "px)";
    }
})();