// ==UserScript==
// @name         【推荐版本】智慧职教 | 职教云 —— 课件下载
// @namespace    https://greasyfork.org/zh-CN/users/856720
// @version      0.9.1
// @description  专门用于对智慧职教旗下的职教云、MOOC学院和资源库的课件下载
// @license      GPL License
// @author       a我还是少年a
// @match        *://zjy2.icve.com.cn/common/directory/directory.html?*
// @match        *://www.zjy2.icve.com.cn/common/directory/directory.html?*
// @match        *://mooc-old.icve.com.cn/study/courseLearn/resourcesStudy.html?*
// @match        *://www.icve.com.cn/study/directory/dir_course.html?*
// @match        *://www.icve.com.cn/portal_new/sourcematerial/edit_seematerial.html?*
// @match        *://www.icve.com.cn/portal/manage-sourcematerialofindex-editmaterial?*
// @match        *://www.icve.com.cn/portal/sourcematerial/edit_seematerial.html?*
// @match        *://zyk.icve.com.cn/icve-study/coursePreview/courseware?*
// @match        *://user.icve.com.cn/learning/u/*
// @match        *://icve-mooc.icve.com.cn/learning/u/*
// @match        *://mooc.icve.com.cn/learning/u/*
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/content_video.action*
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/content_text.action*
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/content_audio.action*
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/content_doc.action*
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/courseware_index.action*
// @match        *://mooc.icve.com.cn/patch/zhzj/studentMooc_selectMoocCourse.action
// @require      https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js
// @icon         https://zjy2.icve.com.cn/favicon.ico
// @connect      spoc-yunpan.icve.com.cn
// @connect      spoc-res.icve.com.cn
// @connect      zyk.icve.com.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437458/%E3%80%90%E6%8E%A8%E8%8D%90%E7%89%88%E6%9C%AC%E3%80%91%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%20%7C%20%E8%81%8C%E6%95%99%E4%BA%91%20%E2%80%94%E2%80%94%20%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437458/%E3%80%90%E6%8E%A8%E8%8D%90%E7%89%88%E6%9C%AC%E3%80%91%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%20%7C%20%E8%81%8C%E6%95%99%E4%BA%91%20%E2%80%94%E2%80%94%20%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let icveStyle = `
        /*资源库的CSS样式*/
        .resource-bank-download {
            float: right;
            padding: 1.5em 20px;
        }

        .download-btn {
            border: none;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
            font-size: 1.5em;
            padding: .5em 1em;
            border-radius: 6px;
            box-shadow: 0 5px 0 0 #2e8b57;
            background: #8fbc8f;
            color: #fff;
            transition: all .1s ease-out;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .download-btn:hover {
            background: #73b173;
            box-shadow: 0 4px 0 0 #2e8b57;
            transform: translateY(1px);
        }

        .download-btn:hover:active {
            box-shadow: 0 1px 0 0 #2e8b57;
            transform: translateY(4px);
        }

        /*旧版职教云的CSS样式*/
        .icve-director {
            position:absolute;
            top:8px;
            right:10px;
            z-index:999;
        }

        .icve-resourcesStudy{
            position:absolute;
            top:12px;
            right:10px;
            z-index:999;
        }

        /*权限激活界面*/
        .icve-active-download {
            width: 150px;
            margin-left: 10px;
        }

        /*新版音频下载界面*/
        .audio-download{
            position: absolute;
            top: 5px;
            right: 50px;
        }

        /*新版文档下载界面*/
        .doc_download{
            position: absolute;
            top: 25px;
            right: 25px;
            z-index: 999;
        }

        .doc-areat{
            position: absolute;
            top: 100px;
            left:0;
            right:0;
            margin:0 auto;
            z-index: 999999999;
            width: 400px;
            height: 200px;
            background-color: #2b2b2b;
            opacity:0.8;
            filter: Alpha(opacity=80);
            -moz-opacity:0.8;
            color: #9876aa;
            border-radius: 10px;
        }

        .text-center {
            text-align: center;
            margin: 10px 0;
        }

        .areat-title {
            margin: 40px 0;
            font-size: 18px;
        }

        .areat-text a {
            font-size: 14px;
            color: #f7fff7;
        }

        /*新版图文下载界面*/
        .icve-img-download {
            margin: -10px 0 0 10px;
        }


        /*新版视频下载界面*/
        .video-setting-btn {
            position: absolute;
            right: 0px;
            bottom: 100px;
            z-index: 99999;
            width: 30px;
            height: 30px;
            background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjczNTc1NjUxMDcxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwLjE5NTMxMjUiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNjE2LjU5NjQ4IDMzLjkzNDg2NUM2MTYuNTk2NDggMTUuMTkzMTU2IDYwMS40MDMzMjEgMCA1ODIuNjYxNjUgMEw0NDEuMzQwODIyIDBDNDIyLjU5OTE1IDAgNDA3LjQwNTk5MiAxNS4xOTMxNTYgNDA3LjQwNTk5MiAzMy45MzQ4NjVMNDA3LjQwNTk5MiAxMzYuNjEyNzcxIDQzNS4yMzA1NDMgMTAzLjIzMjU1NkMzNjMuMjA2MjY4IDExNi40MTY4MDEgMjk2LjQ3OTQyNiAxNDkuMDUyNTkyIDI0MS4yOTk5NSAxOTcuMzA2OTk1TDI4NC45OTQ5MTMgMTk2LjQ3OTU4NyAyMDcuNzExNjkxIDEzMy44OTY5MDVDMTkzLjE0NjcwMyAxMjIuMTAyMzY2IDE3MS43Nzc5NDIgMTI0LjM0ODMwMyAxNTkuOTgzNDA0IDEzOC45MTMzNDZMNzEuMDQ3NDE1IDI0OC43NDAyNDFDNTkuMjUyODc3IDI2My4zMDUyODUgNjEuNDk4NzkyIDI4NC42NzM5NDcgNzYuMDYzNzc5IDI5Ni40Njg0ODdMMTU0Ljc3MTA2OCAzNjAuMjA0NDQzIDE0Ni4wOTQ5NjMgMzE4LjAzMTY5NEMxMTQuMTUwNzUzIDM3OC43NDg0NDIgOTcuMTkyMDc3IDQ0Ni43NTkxMTUgOTcuMTkyMDc3IDUxNy4xOTQ2OTIgOTcuMTkyMDc3IDUyMy4xNTk0MDIgOTcuMzEzNzIxIDUyOS4xMTA0MTcgOTcuNTU1OTUgNTM1LjA0NTE0MUwxMzEuNDYyNzA5IDUzMy42NjAyOTggMTIzLjgyODk2NiA1MDAuNTk1MTgyIDI2LjMwOTkxNCA1MjMuMTA5MjE3QzguMDQ4NjQgNTI3LjMyNTE4NC0zLjMzNzUzNCA1NDUuNTQ2NjU3IDAuODc4NTIxIDU2My44MDgwMTZMMzIuNjY4Nzc4IDcwMS41MDY3ODJDMzYuODg0NjU3IDcxOS43NjgxNDIgNTUuMTA2MjA3IDczMS4xNTQxODEgNzMuMzY3NjU4IDcyNi45MzgyMTRMMTcwLjAwMTY1NSA3MDQuNjI4NDk0IDEzMS4xMzY0NDEgNjg0LjgzNjQ5N0MxNjAuMzY3MjI4IDc1My42MTU3NjQgMjA3LjIxNDY5OCA4MTMuMjUxNDU3IDI2Ni40MzA0OTkgODU3LjM4Njc3NUwyNTYuMjA5NTY3IDgxNS4zMDE5NTIgMjExLjczNzc3NyA5MDYuNDgyNDUzQzIwMy41MjE5NDIgOTIzLjMyNzM4OSAyMTAuNTE3Mjc0IDk0My42NDMxNDggMjI3LjM2MjI1MSA5NTEuODU4OTcyTDM1NC4zODA0NDcgMTAxMy44MDk5MzhDMzcxLjIyNTQyMyAxMDIyLjAyNTc2MiAzOTEuNTQxMjMgMTAxNS4wMzA0ODYgMzk5Ljc1NzA2NSA5OTguMTg1NTVMNDQ0LjQ1MjE5MyA5MDYuNTQ3MDY0IDQxMy45NTE2NDcgODkxLjY3MDk5OSA0MDUuMzA1MjAzIDkyNC40ODU4NTZDNDM4LjU4OTk3IDkzMy4yNTYwNTMgNDczLjAxMjc4OSA5MzcuNzM3NDE5IDUwNy45ODI1NjYgOTM3LjczNzQxOSA1NDUuNjgwNzcyIDkzNy43Mzc0MTkgNTgyLjczNjY4NCA5MzIuNTI5MjkgNjE4LjQwNTQyOSA5MjIuMzYxNjQ0TDYwOS4xMDI1NjYgODg5LjcyNjgwOCA1NzguNjAyMDE5IDkwNC42MDI4NzUgNjI0LjI0NTQwNyA5OTguMTg1NTVDNjMyLjQ2MTI0MSAxMDE1LjAzMDQ4NiA2NTIuNzc3MDQ4IDEwMjIuMDI1NzYyIDY2OS42MjIwMjUgMTAxMy44MDk5MzhMNzk2LjY0MDIyMSA5NTEuODU4OTcyQzgxMy40ODUxOTcgOTQzLjY0MzE0OCA4MjAuNDgwNTMgOTIzLjMyNzM4OSA4MTIuMjY0Njk1IDkwNi40ODI0NTNMNzY1LjYxODE0MSA4MTAuODQyOTk4IDc1NS45MjIwOTcgODUyLjUyODU5MUM4MTIuNjc3NDczIDgwOC40ODU4OTMgODU3LjQ5NDQyMiA3NTAuMDE2MDc0IDg4NS42MDQ0NTggNjgyLjk5ODQ0OUw4NDYuNjc3Mjc0IDcwMi45Mzc3MDYgOTUwLjYzNDgxNCA3MjYuOTM4MjE0Qzk2OC44OTYyNjUgNzMxLjE1NDE4MSA5ODcuMTE3ODE1IDcxOS43NjgxNDIgOTkxLjMzMzY5NCA3MDEuNTA2NzgyTDEwMjMuMTIzOTUgNTYzLjgwODAxNkMxMDI3LjM0MDAwNiA1NDUuNTQ2NjU3IDEwMTUuOTUzODMyIDUyNy4zMjUxODQgOTk3LjY5MjU1NyA1MjMuMTA5MjE3TDg5Mi4yMDY5NjMgNDk4Ljc1NTk0OSA4ODQuNTczMjE5IDUzMS44MjEwNjcgOTE4LjQ4NTgwNCA1MzMuMDUwNjI5QzkxOC42NzcwMSA1MjcuNzc3MjkxIDkxOC43NzI4NzcgNTIyLjQ5MTM3MyA5MTguNzcyODc3IDUxNy4xOTQ2OTIgOTE4Ljc3Mjg3NyA0NDguNjk5NjY0IDkwMi43MzcyMTQgMzgyLjQ4NTI1MyA4NzIuNDUxMTc4IDMyMy4wMTc4MTNMODYzLjU2Nzk3OCAzNjQuNzkwNTU2IDk0Ny45Mzg2OTIgMjk2LjQ2ODQ4N0M5NjIuNTAzNjggMjg0LjY3Mzk0NyA5NjQuNzQ5NTk0IDI2My4zMDUyODUgOTUyLjk1NTA1NyAyNDguNzQwMjQxTDg2NC4wMTkwNjggMTM4LjkxMzM0NkM4NTIuMjI0NTMgMTI0LjM0ODMwMyA4MzAuODU1NzY4IDEyMi4xMDIzNjYgODE2LjI5MDc4MSAxMzMuODk2OTA1TDczNC44MDczOTMgMTk5Ljg4MDkzMiA3NzguODQzMjc3IDIwMS4wMTA1ODJDNzI1LjE0ODYwMSAxNTIuNzY3MjA1IDY2MC4wNDg2ODQgMTE5LjQ4NzY1NyA1ODkuNTE1OTE3IDEwNC45NDE1NDNMNjE2LjU5NjQ4IDEzOC4xNzY5OTEgNjE2LjU5NjQ4IDMzLjkzNDg2NVpNNTc1LjgwNzM4MiAxNzEuNDEyNDM5QzYzNC40NDUzMyAxODMuNTA1NDI3IDY4OC42NTIzNTkgMjExLjIxNjUxMSA3MzMuNDgzMjU1IDI1MS40OTU5NyA3NDUuODg5NzIxIDI2Mi42NDI5MzUgNzY0LjU1NzQxOCAyNjMuMTIxODE0IDc3Ny41MTkxMzkgMjUyLjYyNTYxOEw4NTkuMDAyNTI3IDE4Ni42NDE1OTIgODExLjI3NDQxNyAxODEuNjI1MTUgOTAwLjIxMDQwNiAyOTEuNDUyMDQ1IDkwNS4yMjY5NDYgMjQzLjcyMzgwMSA4MjAuODU2MDU1IDMxMi4wNDU4N0M4MDguNDA2MTU3IDMyMi4xMjc3MiA4MDQuNzAyNjMyIDMzOS41NDMxMjEgODExLjk3MzAzMiAzNTMuODE4NjEzIDgzNy40MjIwOCA0MDMuNzg4NTE4IDg1MC45MDMwNCA0NTkuNDU0NjMyIDg1MC45MDMwNCA1MTcuMTk0NjkyIDg1MC45MDMwNCA1MjEuNjcxNDA4IDg1MC44MjIxNzkgNTI2LjEzNzQ4MiA4NTAuNjYwNjM0IDUzMC41OTE1MDQgODUwLjA3MTQ4MSA1NDYuODQzMDE2IDg2MS4wOTQxMzUgNTYxLjIyNzk4NiA4NzYuOTM5NjUyIDU2NC44ODYxODJMOTgyLjQyNTI0NyA1ODkuMjM5NDUgOTU2Ljk5MzY3NyA1NDguNTQwNjQ5IDkyNS4yMDM0MjEgNjg2LjIzOTQxNCA5NjUuOTAyMzAxIDY2MC44MDc5ODIgODYxLjk0NDU4NSA2MzYuODA3NDcyQzg0NS44NDUwMSA2MzMuMDkwNTgxIDgyOS40MDgzOTcgNjQxLjUwOTY4NSA4MjMuMDE3NDAxIDY1Ni43NDY3MjkgNzk5LjQyNzA5IDcxMi45ODg2NDIgNzYxLjgzNTg3MyA3NjIuMDMxNTQ5IDcxNC4zMTMyNjkgNzk4LjkwOTUzOSA3MDEuNjIxODQ4IDgwOC43NTgxNjQgNjk3LjU3NTEwNiA4MjYuMTU2NDk2IDcwNC42MTcyMjUgODQwLjU5NTEyOUw3NTEuMjYzNzc5IDkzNi4yMzQ1ODQgNzY2Ljg4ODA3NyA4OTAuODU4MDYzIDYzOS44Njk4ODEgOTUyLjgwOTAyOSA2ODUuMjQ2MzIzIDk2OC40MzM0MTkgNjM5LjYwMjkzNSA4NzQuODUwNzQ0QzYzMi4zOTI1NjMgODYwLjA2NzAyMyA2MTUuNjE4MDMgODUyLjU4Mjg0OCA1OTkuNzk5NzAyIDg1Ny4wOTE5NzIgNTcwLjE2NTMxOSA4NjUuNTM5NTI2IDUzOS4zNzAyODQgODY5Ljg2NzY4OSA1MDcuOTgyNTY2IDg2OS44Njc2ODkgNDc4Ljg2NDA2NiA4NjkuODY3Njg5IDQ1MC4yNTI4IDg2Ni4xNDI5MDkgNDIyLjU5ODA5MSA4NTguODU2MTQxIDQwNi45NDA0MjUgODU0LjczMDUyMiAzOTAuNTQ5MzYzIDg2Mi4yNDE2NzUgMzgzLjQ1MTI3NyA4NzYuNzk0OTMzTDMzOC43NTYxNDkgOTY4LjQzMzQxOSAzODQuMTMyNTkgOTUyLjgwOTAyOSAyNTcuMTE0Mzk0IDg5MC44NTgwNjMgMjcyLjczODY5MiA5MzYuMjM0NTg0IDMxNy4yMTA0ODMgODQ1LjA1NDA4M0MzMjQuMzYxMzU3IDgzMC4zOTI1NzEgMzIwLjA2ODY3OSA4MTIuNzE3NTgyIDMwNi45ODk1NSA4MDIuOTY5MjU5IDI1Ny40MTg5NDYgNzY2LjAyMjc4NSAyMTguMTI4NTk2IDcxNi4wMDcxMzYgMTkzLjU5OTIwNiA2NTguMjkwMjU5IDE4Ny4xNjAxODggNjQzLjEzOTA0MiAxNzAuNzc0OTUyIDYzNC43OTQ5NDggMTU0LjczNDE2OCA2MzguNDk4MjYyTDU4LjEwMDE3MSA2NjAuODA3OTgyIDk4Ljc5OTA1MSA2ODYuMjM5NDE0IDY3LjAwODc5NCA1NDguNTQwNjQ5IDQxLjU3NzIyNSA1ODkuMjM5NDUgMTM5LjA5NjI3NiA1NjYuNzI1NDE1QzE1NC45OTg2NDMgNTYzLjA1NDA1NSAxNjYuMDM1MjQ0IDU0OC41ODI1NjQgMTY1LjM2OTI5MSA1MzIuMjc1NDU2IDE2NS4xNjQ0OTEgNTI3LjI2MzQwNSAxNjUuMDYxOTE0IDUyMi4yMzU4MSAxNjUuMDYxOTE0IDUxNy4xOTQ2OTIgMTY1LjA2MTkxNCA0NTcuODIxODM1IDE3OS4zMTc5MzcgNDAwLjY0OTg4NyAyMDYuMTU5MDk1IDM0OS42MzI1MDggMjEzLjY5Njk3MSAzMzUuMzA1MDY0IDIxMC4wNjQ0MTkgMzE3LjY0ODA2OCAxOTcuNDgyOTkgMzA3LjQ1OTc1OUwxMTguNzc1NTI2IDI0My43MjM4MDEgMTIzLjc5MjA2NiAyOTEuNDUyMDQ1IDIxMi43MjgwNTUgMTgxLjYyNTE1IDE2NC45OTk5NDUgMTg2LjY0MTU5MiAyNDIuMjgyOTkgMjQ5LjIyNDI3M0MyNTUuMTEwODg2IDI1OS42MTIwMzMgMjczLjU1MjU5NiAyNTkuMjYyODIxIDI4NS45Nzc5NTMgMjQ4LjM5Njg2NSAzMzIuMDM2NTkgMjA4LjExODY4NSAzODcuNTgwMTE2IDE4MC45NTI1NDggNDQ3LjQ1MTEwMSAxNjkuOTkyOTg2IDQ2My41NjgzMzEgMTY3LjA0MjY5NSA0NzUuMjc1NjUyIDE1Mi45OTc3MzEgNDc1LjI3NTY1MiAxMzYuNjEyNzcxTDQ3NS4yNzU2NTIgMzMuOTM0ODY1IDQ0MS4zNDA4MjIgNjcuODY5NzI5IDU4Mi42NjE2NSA2Ny44Njk3MjkgNTQ4LjcyNjgxOSAzMy45MzQ4NjUgNTQ4LjcyNjgxOSAxMzguMTc2OTkxQzU0OC43MjY4MTkgMTU0LjI3Njc4OSA1NjAuMDM5NTQ4IDE2OC4xNjA1ODUgNTc1LjgwNzM4MiAxNzEuNDEyNDM5Wk03MzAuMzQ1MDQ4IDUxNy4xOTQ2OTJDNzMwLjM0NTA0OCAzOTEuODg1NDY5IDYzMC45ODY2ODEgMjg5Ljk1NTg5NiA1MDcuOTgyNTY2IDI4OS45NTU4OTYgMzg0Ljk3ODI3MyAyODkuOTU1ODk2IDI4NS42MTk5MDYgMzkxLjg4NTQ2OSAyODUuNjE5OTA2IDUxNy4xOTQ2OTIgMjg1LjYxOTkwNiA2NDIuNTAzOTE1IDM4NC45NzgyNzMgNzQ0LjQzMzQ4NyA1MDcuOTgyNTY2IDc0NC40MzM0ODcgNjMwLjk4NjY4MSA3NDQuNDMzNDg3IDczMC4zNDUwNDggNjQyLjUwMzkxNSA3MzAuMzQ1MDQ4IDUxNy4xOTQ2OTJaTTM1My40ODk1NjcgNTE3LjE5NDY5MkMzNTMuNDg5NTY3IDQyOC45ODYyODkgNDIyLjg1NTE1IDM1Ny44MjU2MjYgNTA3Ljk4MjU2NiAzNTcuODI1NjI2IDU5My4xMDk4MDQgMzU3LjgyNTYyNiA2NjIuNDc1Mzg4IDQyOC45ODYyODkgNjYyLjQ3NTM4OCA1MTcuMTk0NjkyIDY2Mi40NzUzODggNjA1LjQwMzA5NSA1OTMuMTA5ODA0IDY3Ni41NjM3NTggNTA3Ljk4MjU2NiA2NzYuNTYzNzU4IDQyMi44NTUxNSA2NzYuNTYzNzU4IDM1My40ODk1NjcgNjA1LjQwMzA5NSAzNTMuNDg5NTY3IDUxNy4xOTQ2OTJaIiBmaWxsPSIjMzg5QkZGIiBwLWlkPSIxMDQ0Ij48L3BhdGg+PC9zdmc+');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .icve-video-download {
            position:fixed;
            top:0px;
            left:0px;
            font-size:14px;
            border-radius: 5px;
            background-color: #2b2b2b;
            opacity:0.99;
            filter: Alpha(opacity=99);
            -moz-opacity:0.99;
            box-shadow:  20px 20px 60px #bebebe,-20px -20px 60px #ffffff;
            width:100%;
            height:100%;
            overflow:auto;
            z-index:9999999999;
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc0Mzg1OTQ2Mjc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExODQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTU4MC4xOTggNTA5LjQ4N2wxNzYuNzc3LTE3Ni43NzZMNjg2LjI2NSAyNjIgNTA5LjQ4NiA0MzguNzc3IDMzMi43MTEgMjYyIDI2MiAzMzIuNzFsMTc2Ljc3NyAxNzYuNzc3TDI2MiA2ODYuMjY0bDcwLjcxIDcwLjcxIDE3Ni43NzctMTc2Ljc3NiAxNzYuNzc3IDE3Ni43NzcgNzAuNzEtNzAuNzEtMTc2Ljc3Ni0xNzYuNzc4ek01MTIgOTYyQzI2My40NzIgOTYyIDYyIDc2MC41MjggNjIgNTEyUzI2My40NzIgNjIgNTEyIDYyczQ1MCAyMDEuNDcyIDQ1MCA0NTAtMjAxLjQ3MiA0NTAtNDUwIDQ1MHoiIGZpbGw9IiMxQUE1RkYiIHAtaWQ9IjExODUiPjwvcGF0aD48L3N2Zz4=');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .video-title {
            margin-top: 100px;
            text-align: center;
            font-size: 2em;
            color: #fff;
        }

        .icve-video-content {
            width: 600px;
            margin: 40px auto;
        }

        .icve-content-item {
            margin: 40px 0;
        }

        .icve-content-item-name {
            display: inline-block;
            width: 180px;
            padding: 10px 0;
            border-radius: 10px;
            text-align: center;
            background-color: #999999;
            color: #fff;
            cursor: text;
        }

        .video-url-btn {
            margin-left: 100px;
            display: inline-block;
            width:140px;
            padding: 10px 0;
            border-radius: 10px;
            cursor: pointer;
            background-color: #313335;
            text-align: center;
            color: #979797;
            font-weight: bold;
        }

        .video-url-btn:hover {
            background-color: #3c3f41;
        }

        .video-url-btn:hover:active{
            box-shadow: 0 0 5px 0 #999999;
        }

        .m3u8-btn {
            float: right;
            display: inline-block;
            width: 160px;
            padding: 10px 0;
            border-radius: 10px;
            background-color: #313335;
            color: #588759;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
        }

        .m3u8-btn:hover {
            background-color: #3c3f41;
        }

        .m3u8-btn:hover:active{
            box-shadow: 0 0 5px 0 #999999;
        }

        .msgs {
            position: absolute;
            bottom: 0.5rem;
            right: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: end;
        }

        .msgsAreat {
            margin: 0.8rem;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,rgba(0, 0, 0, 0.22) 0px 15px 12px;
        }

        .copyTitle {
            width: 150px;
            margin: 50px auto;
        }

        .videoDownloadApi {
            display: block;
            text-align:center;
            width: 150px;
            padding: 15px 0;
            font-size: 16px;
            border-radius: 10px;
            background-color: #e8c627;
            color: #fff;
        }

        .btnTitleText {
            width: 150px;
            padding: 15px 0;
            font-size: 16px;
            border-radius: 10px;
            background-color: #428ce9;
            color: #fff;
        }

        .msgs-copy-title {
            background-color: #1bc1a1;
            color: #fff;
        }

        .msgs-copy-title-error{
            background-color: #ff5627;
        }

        .msgs-copy-url {
            background-color: #438eec;
            color: #fff;
        }

        .msgs-copy-url-error {
            background-color: #555555;
        }

        .msgs-m3u8-post-ok {
            background-color: #fdfd34;
            color: #fa5a57;
        }

        .msgs-m3u8-post-error {
            background-color: #92d5fe;
        }
    `
    GM_addStyle(icveStyle);

    // 下载文件
    function DownloadFile(url,name,hrefType="_self"){
        let aDom = document.createElement('a');
        aDom.style.display = 'none';
        aDom.href = url;
        aDom.target = hrefType;
        aDom.setAttribute('download',name);
        document.body.appendChild(aDom);
        aDom.click();
        document.body.removeChild(aDom);
    }

    // 保存文件
    function SaveFile(url,name){
        const fileStream = streamSaver.createWriteStream(name);
        fetch(url).then(res => {
          const readableStream = res.body
          if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream)
              .then(() => console.log('done writing'));
          }
          window.writer = fileStream.getWriter()
          const reader = res.body.getReader()
          const pump = () => reader.read()
            .then(res => res.done
              ? writer.close()
              : writer.write(res.value).then(pump))
          pump()
        })
    }

    // 发送POST请求
    function postUrl(url,value){
        let a = $.ajax({
            url : url,
            type : "post",
            data :value,
            dataType : 'json',
            async: false,
            success: function(data){
            }
        });
        return a.responseText;
    }

    // 获取链接中的对应参数
    function getQueryVariable(query,variable){
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function areatDom(dom){
        let docAreat = document.createElement("div");
        dom.appendChild(docAreat);
        docAreat.className = "doc-areat";
        docAreat.innerHTML = `
            <p class="text-center areat-title">暂无权限，请前往首页激活权限！</p>
            <p class="text-center areat-text">
                <a href="https://user.icve.com.cn/learning/u/student/teaching/index.action"
                    target="_blank">
                    职教云首页
                </a>
            </p>
            <p class="text-center areat-text">
                <a href="https://mooc.icve.com.cn/learning/u/student/student/mooc_index.action"
                    target="_blank">
                    MOOC首页
                </a>
            </p>
        `;
        setTimeout(() => {
            docAreat.remove();
        }, 10000);
    }

    // 判断文件名是否是图片
    function checkImgType(fileName) {
        if (!/\.(jpg|jpeg|png|gif|webp|svg|GIF|JPG|PNG|JPEG)$/.test(fileName)) {
            return false;
        } else {
            return true;
        }
    }

    // 获取清晰度
    function getVideo(b) {
        var a = "";
        switch (b) {
        case "FD":
            a = "流畅";
            break;
        case "LD":
            a = "标清";
            break;
        case "SD":
            a = "高清";
            break;
        case "HD":
            a = "超清";
            break;
        case "FHD":
            a = "全高清";
            break;
        case "OD":
            a = "原画";
            break;
        case "2K":
            a = "2K";
            break;
        case "4K":
            a = "4K"
        }
        return a
    }

    // M3U8下载器推送
    function m3u8Post(name,url){
        let a = $.ajax({
            url : 'http://127.0.0.1:8787/',
            type : "post",
            data: {
                'data':name+','+url,
                'type':'2',
            },
            dataType : 'json',
            async: false,
            success: function(data){
            }
        });
        return a.responseJSON;
    }

    // 消息提示
    function sendMsg(msgsDom, msg, classname, type = "info", duration = 10000) {
        const newMsgDom = document.createElement("div");
        newMsgDom.innerText = msg;
        newMsgDom.className = "msgsAreat " + classname;
        newMsgDom.classList.add("msg");
        newMsgDom.classList.add(type);
        msgsDom.appendChild(newMsgDom);
        setTimeout(() => {
            newMsgDom.remove();
        }, duration);
    }

    // 判断文件名是否是视频
    function checkVideoType(fileName) {
        if (!/\.(mp4|flv|wmv|avi|mov|rmvb|webm|asf)$/.test(fileName)) {
            return false;
        } else {
            return true;
        }
    }

    // 新版MOOC过期课程处理
    function newMoocClass(){
        let classLength = document.getElementsByClassName("class-foot clearfix").length;
        for(let i = 0; i < classLength; i++)
        {
            let divElement = document.getElementsByClassName("class-foot clearfix")[i];
            let contentElement = divElement.getElementsByClassName("pull-right")[0];
            let classElement = divElement.getElementsByClassName("appointment-btn")[0];
            let a = document.createElement("a");
            contentElement.appendChild(a);
            a.className = "btn btn-solid-warning btn-sm rounded class-enterbtn mr10";
            let url = classElement.href;
            url = url.replace("已结束", "进行中");
            url = url.replace("%E5%B7%B2%E7%BB%93%E6%9D%9F", "进行中");
            a.href = url;
            a.text = '观看课程';
        }
    }

    // 新版智慧职教和MOOC视频官方接口下载
    function newVideoDownload(title)
    {
        let url = document.getElementById("captionUrl").value;
        var metaId,downUrl;
        if(url.indexOf("?") == -1){
            let docUrlLength = url.split('\/').length;
            metaId = url.split('\/')[docUrlLength-1];
            downUrl = 'https://spoc-res.icve.com.cn/front/fileops/generateDownloadUrl?metaId='+metaId;
        }else{
            metaId = getQueryVariable(url,"metaId");
            downUrl = 'https://spoc-yunpan.icve.com.cn/cloud/operation/fileops/generateDownloadUrl?metaId='+metaId;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: downUrl,
            onload: function(response){
                let data = response.responseText;
                if(data.length >= 300 && data.length <= 500){
                    let docData = $.parseJSON(data),
                        downloadUrl = docData.currentPath;
                    const regex = /.*\.([^\.?]+)\?/;
                    const match = regex.exec(downloadUrl);
                    var videoType
                    if (match) {
                        videoType = match[1];
                    }
                    SaveFile(downloadUrl,title+"."+videoType);
                }
            },
        });
    }

    // 获取指定cookie值
    function getCookie(cookieName) {
        const strCookie = document.cookie
        const cookieList = strCookie.split(';')

        for(let i = 0; i < cookieList.length; i++) {
            const arr = cookieList[i].split('=')
            if (cookieName === arr[0].trim()) {
                return arr[1]
            }
        }

        return ''
    }


    let path = window.location.pathname.split("/"),
    pathLength = path.length,
    page = path[pathLength-1].split(".")[0];

    // 资源库-素材
    if(page == 'edit_seematerial'|| page == 'manage-sourcematerialofindex-editmaterial'){
        window.onload = function () {
            let gold = document.getElementsByClassName("gold")[0];
            if(gold == undefined){
                let download = document.getElementsByClassName("download clefix")[0],
                    data_id = document.getElementsByClassName("Collection")[0].getAttribute('data-id');
                download.innerHTML = `<div class = "gold"></div>
                    <a href="#" class="downloadMaterial" data-id="`+data_id+`">
                       <div class="download-icon" data-id="`+data_id+`">下载 </div>
                    </a>`;
            }
        }
    }

    // 职业教育专业教学资源库
    if(page == "courseware")
    {

        let url = window.location.href;
        let id = url.split("=")[1];
        var Date = setTimeout(function() {
            let courseBtn = document.getElementsByClassName("courseBtn")[0];
            let div = document.createElement("div");
            courseBtn.appendChild(div);
            div.className = "customBtn";
            div.innerText = "下载";
            let auth = getCookie("Token");
            auth = "Bearer " + auth;
            div.onclick = ()=>{
                let url = "https://zyk.icve.com.cn/prod-api/teacher/courseContent/" + id;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        Authorization: auth,
                    },
                    onload: function(response){
                        let data = response.responseText;
                        data = JSON.parse(data)
                        let name = data.data.name;
                        let downloadUrl = data.data.fileUrl;
                        let type = data.data.fileType;
                        let groupUrl = downloadUrl + "?response-content-disposition=attachment;filename=" + name + "." + type;
                        window.open(groupUrl);
                    },
                });
            }
        },1000)
    }

    // 资源库-课程、技能培训
    if(page == "dir_course"){
        let header_draw = document.getElementsByClassName("header-draw")[0],
            div = document.createElement("div");
        div.innerHTML = '<button class="resource-bank-btn download-btn">点击下载</button>';
        div.className = 'resource-bank-download';
        header_draw.appendChild(div);
        document.getElementsByClassName("resource-bank-btn")[0].addEventListener("click", downloadData);
        function downloadData(){
            let url = document.querySelector("[data-downloadurl]").getAttribute('data-downloadurl'),
                name = url.split("=")[2];
            DownloadFile(url,name);
        }
    }

    // 旧版职教云
    if(page == "directory"){
        let web = document.getElementById("directoryData");
        if(web != null){
            let div = document.createElement("div");
            div.className = 'icve-director';
            div.innerHTML = `<a class="directory-btn" href="javascript:;">
                <button class="download-btn">点击下载</button>
            </a>`;
            document.body.appendChild(div);
            document.getElementsByClassName("directory-btn")[0].addEventListener("click", downloadData);
        }
        function downloadData(){
            let courseOpenId = document.querySelector("input[name=courseOpenId]").value,
                openClassId = document.querySelector("input[name=openClassId]").value,
                moduleId = document.querySelector("input[name=moduleId]").value,
                cellId = document.querySelector("input[name=cellId]").value,
                value = {'courseOpenId':courseOpenId,'openClassId':openClassId,'moduleId':moduleId,'cellId':cellId};
            let data = postUrl('https://zjy2.icve.com.cn/api/common/Directory/viewDirectory',value),
                url = $.parseJSON(data).downLoadUrl,
                name = url.split("=")[2];
            DownloadFile(url,name);
        }
    }

    // 旧版MOOC
    if(page == "resourcesStudy"){
        let web = document.getElementById("directoryData");
        if(web != null){
            let div = document.createElement("div");
            div.className = 'icve-resourcesStudy';
            div.innerHTML = `<a class="resourcesStudy-btn" href="javascript:;">
                <button class="download-btn">点击下载</button>
            </a>`;
            document.body.appendChild(div);
            document.getElementsByClassName("resourcesStudy-btn")[0].addEventListener("click", downloadData);
        }
        function downloadData(){
            let courseOpenId = document.querySelector("input[name=courseOpenId]").value,
                moduleId = document.querySelector("input[name=moduleId]").value,
                processCellId = document.querySelector("input[name=processCellId]").value,
                value = {"courseOpenId":courseOpenId,"cellId":processCellId,"moduleId":moduleId};
            let data = postUrl('https://mooc.icve.com.cn/study/learn/viewDirectory',value),
                url = $.parseJSON(data).downLoadUrl,
                name = url.split("=")[2];
            SaveFile(url,name);
       }
    }

    // 激活新版职教云和MOOC学院的文档下载权限
    if(window.location.hostname == 'user.icve.com.cn' || window.location.hostname == 'icve-mooc.icve.com.cn' || window.location.hostname == 'mooc.icve.com.cn'){
        let loginToken = {'token':loginIdToken};
        let CloudUrl = 'https://'+window.location.hostname+'/zhzj/zhzjTeacher_generateEnterCloudUrl.action';
        let security = postUrl(CloudUrl,loginToken),
            securityToken = $.parseJSON(security).data.token;
        let url = 'https://spoc-res.icve.com.cn/login/authorizeByToken?securityToken='+securityToken + '&indexType=1';
        document.getElementsByClassName("logoarea pull-left")[0].style = "";
        let icveElement = document.getElementsByClassName("logoarea pull-left")[0];
        let a = document.createElement("a");
        icveElement.appendChild(a);
        a.className = "icve-active-download btn btn-solid-warning";
        a.href = url;
        a.target = "_blank";
        a.text = '激活本次下载权限';
    }

    // 新版MOOC学院过期课程进入页面
    if(page == "mooc_index"){
        let modeHead = document.getElementsByClassName("mode-head")[0];
        let a = document.createElement("a");
        modeHead.appendChild(a);
        a.className = "icve-active-download btn btn-solid-primary";
        a.onclick = ()=>{
            newMoocClass();
        }
        a.text = "过期课程刷新观看";

    }

    // 新版职教云和MOOC学院的音频下载
    if(page == "content_audio"){
        let audioData = $.parseJSON(resource),
            audioKbsName = resource.split(":")[0].replace(/\"/g, "").replace("{","");
        let audio160 = audioData[audioKbsName],
            dom = document.getElementsByClassName("kj webWidth2")[0],
            div = document.createElement("div");
        dom.appendChild(div);
        div.className = "audio-download";
        div.innerHTML = '<button class="download-btn" id="$start" >下载音频</button>';
        let name = document.getElementsByClassName("h3 audio-title ell")[0].textContent;
        name += '.mp3';
        $start.onclick = () => {
            SaveFile(audio160,name);
        }
    }

    // 新版职教云和MOOC学院的文件下载
    if(page == 'content_doc'){
        let url = document.getElementById("mainFrame_doc").src;
        var metaId,downUrl;
        if(url.indexOf("?") == -1){
            let docUrlLength = url.split('\/').length;
            metaId = url.split('\/')[docUrlLength-1];
            downUrl = 'https://spoc-res.icve.com.cn/front/fileops/generateDownloadUrl?metaId='+metaId;
        }else{
            metaId = getQueryVariable(url,"metaId");
            downUrl = 'https://spoc-yunpan.icve.com.cn/cloud/operation/fileops/generateDownloadUrl?metaId='+metaId;
        }
        let dom = document.getElementsByClassName("shadow")[0];
        let div = document.createElement("div");
        dom.appendChild(div);
        div.className = "doc_download";
        div.innerHTML = '<button class="download-btn" id="$start" >下载文档</button>';
        $start.onclick = () => {
            GM_xmlhttpRequest({
                method: "GET",
                url: downUrl,
                onload: function(response){
                    let data = response.responseText;
                    if(data.length >= 300 && data.length <= 500){
                        let docData = $.parseJSON(data),
                            downloadUrl = docData.currentPath;
                        DownloadFile(downloadUrl,"文档");
                    }else{
                        areatDom(dom);
                    }
                },
                onerror: function(response){
                    areatDom(dom);
                }
            });
        }
    }

    // 新版职教云和MOOC学院的图片下载
    if(page == "content_text"){
        let op = document.getElementsByClassName("op")[0],
            button = document.createElement("button");
        op.appendChild(button);
        button.className = "download-btn icve-img-download";
        button.id = "$start";
        button.innerText = "下载全部图片";
        $start.onclick = () => {
            let img = document.getElementsByTagName("img");
            let imgLength = img.length;
            for(let i = 0; i < imgLength; i++){
                let name = img[i].title,
                    url = img[i].src;
                if(name.indexOf(".") == -1 || !checkImgType(name)){
                    let urlLength = url.split('.').length,
                        urlSuffix = url.split('.')[urlLength-1];
                    name += '.'+urlSuffix;
                }
                SaveFile(url,name);
            }
        }
    }

    // 新版职教云与智慧职教目录下载功能调用
    if(page == "courseware_index")
    {
        let course_root = document.getElementsByClassName("s_point"),
            course_length = document.getElementsByClassName("s_point").length;
        for(let i = 0; i < course_length; i++)
        {
            let text = course_root[i].id,
                course_resource_id = text.split('_')[2];
            let div_length = course_root[i].getElementsByTagName("div").length;
            if(div_length<4)
            {
                let div = document.createElement("div");
                course_root[i].appendChild(div);
                div.className = "s_download";
                div.setAttribute("onclick","download('"+course_resource_id+"')");
            }
        }
    }

    // 新版职教云和MOOC学院的视频下载
    if(page == "content_video"){
        let sp = document.getElementsByClassName("sp")[0],
            set_up = document.createElement("div");
        sp.appendChild(set_up);
        set_up.id = "set_up";
        set_up.className = "video-setting-btn";
        set_up.title = "设置";
        let div = document.createElement("div");
        sp.appendChild(div);
        div.className = "icve-video-download";
        div.style = "display:none;";
        let title = document.getElementsByTagName("title")[0].textContent,
            closeBtn = `<div id="closebtn" class="close-btn" title="关闭"></div>`,
            videoTitle = `<h3 class="video-title">`+title+`</h3>`,
            videoData = $.parseJSON(resource),
            videoContent = `<div class="icve-video-content"></div>`,
            msgs = '<div class="msgs"></div>',
            copyTitle = `<div class="copyTitle">
                <button class="btnTitleText" data-clipboard-text="`+title+`">点击复制标题</botton>
            </div>`;
        let aElement = `<div class="copyTitle">
            <a class="videoDownloadApi">官方接口下载</a>
        </div>`;

        div.innerHTML = videoTitle+copyTitle+aElement+closeBtn+videoContent+msgs;
        const msgsDom = document.querySelector(".msgs");
        for(let key in videoData){
            let content = document.getElementsByClassName("icve-video-content")[0];
            let contentItem = document.createElement("div"),
                name = getVideo(key);
            content.appendChild(contentItem);
            contentItem.className = "icve-content-item";
            let classname = "video-url-btn " + key,
                videoFormatLength = videoData[key].split('.').length,
                videoFormat = videoData[key].split('.')[videoFormatLength-1];
            contentItem.innerHTML = `<span class="icve-content-item-name">`+name+`-`+videoFormat+`</span>
            <button class="`+classname+`" data-clipboard-text="`+videoData[key]+`">点此复制视频地址</button>
            `;
            if(videoFormat == "m3u8"){
                let m3u8Btn = document.createElement("botton");
                contentItem.appendChild(m3u8Btn);
                m3u8Btn.className = "m3u8-btn m3u8Btn"+key;
                m3u8Btn.innerText = "发送信息到M3U8下载器";
                document.getElementsByClassName("m3u8Btn"+key)[0].onclick = function() {
                    let isok = m3u8Post(title,videoData[key]);
                    if(isok == undefined){
                        sendMsg(msgsDom,"发送失败，请查看是否打开M3U8下载器","msgs-m3u8-post-ok");
                    }else{
                        sendMsg(msgsDom,"已成功发送，正在下载","msgs-m3u8-post-error");
                    }
                }
            }else{
                let videoDownBtn = document.createElement("botton");
                contentItem.appendChild(videoDownBtn);
                videoDownBtn.className = "m3u8-btn";
                videoDownBtn.innerText = "点击下载视频";
                videoDownBtn.onclick = () => {
                    if(!checkVideoType(title)){
                        title += "."+videoFormat
                    }
                    SaveFile(videoData[key],title);
                }
            }
            let btnclass = "."+key,
                btnName = name + "视频地址复制成功",
                btnVideoUrl = new ClipboardJS(btnclass);
            btnVideoUrl.on('success', function(e) {
                sendMsg(msgsDom,btnName,"msgs-copy-url");
            });
            btnVideoUrl.on('error', function(e) {
                sendMsg(msgsDom,"地址复制失败","msgs-copy-url-error");
            });
        }
        let btnTitleText = new ClipboardJS('.btnTitleText');
        btnTitleText.on('success', function(e) {
            sendMsg(msgsDom,"标题复制成功","msgs-copy-title");
        });
        btnTitleText.on('error', function(e) {
            sendMsg(msgsDom,"标题复制失败","msgs-copy-title-error");
        });

        var close_btn=document.getElementById("closebtn");
        close_btn.addEventListener('click', function(){
            div.style = "display:none;";
            document.documentElement.style.overflow = 'auto';
            $('.back-top-button').fadeIn();
        })
        set_up.addEventListener('click',function(){
            div.style = "display:block;";
            document.documentElement.style.overflow = 'hidden';
            $('.back-top-button').fadeOut();
        })

        let downloadApi = document.getElementsByClassName("videoDownloadApi")[0];
        downloadApi.onclick = () => {
            newVideoDownload(title);
        }
    }
})();