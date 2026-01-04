// ==UserScript==
// @name         [buyi] 抖音工具
// @namespace    buyi
// @version      1.0.9
// @description  抖音工具
// @author       buyi
// @match        *://*.douyin.com/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wgARCAAgACADAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABgcJCAX/xAAZAQACAwEAAAAAAAAAAAAAAAACBQEDBAD/2gAMAwEAAhADEAAAAKox09suonov3EyW8eJlkoet0SoK5QLYeyQtZaSAzG+oUkVUecgnmJkY/wD/xAArEAABBAIBAwIEBwAAAAAAAAABAgMEBQYREgAHIQgyExQiQRYjMTNhcZL/2gAIAQEAAT8A/Qfx16qPVNn9n3nd7VYO/ZQKTH3A3NagLLT9g+ByWXXR7GUAgEf669LPfDJIWS10W7v7OfjWYzDGrkWDqnVsSeXA/DKySEcykbB4nn0NdZS3ZO0UlirSlTro4LBdU0S2feEqAJSojYB14J312SnY1A78X+HX2Mxp9c3Kky48uS1zkQnWljiHSCQpBGwdE7Urq1po+R9z4U3FKG0YRVWDaoLiJX7k08EpZYjAkMsAhK1khO/JA2dhgq4Dn7gBv+/v1MzdJVkdLLlLkEuSURULSWikp0kthST9SdEqGwD4IO+se7MPzvVo9axWJq66/rX7OUtDgQWlIAQ6gJ3pQLgbA2D09h6aZxOYUTsBqM0pMpaUOH5lggJC1ggbUCEaUkkaBUR9wTbZDN7hU7cKyDFY7XF5xjjsPnkdkedA64kHz467zU7+KtyMpoWQs2khBkoUdBLyUkBST9gsDRB8A6PVIxUHJIfcKVfR6idJhOQ5kF+SlXNkLUtooJIKFpUSokDyDojwCMkvKyNi70urtYVlZKKPhwoz4W4tkn8xR47I+gqJ2B4BJ67Lz7TJ3vxBbOJcciwUREKSkgJHI6HnzvQ2T1//xAAeEQACAgICAwAAAAAAAAAAAAABAgADBBESIRMUQf/aAAgBAgEBPwDQEyLQomPdswHcIJmYpmIkUaEV+exL6zYCkpx2pHKNa/mVRMpvX7ETvTxw4Gphlrbix+T/xAAfEQACAgICAwEAAAAAAAAAAAABAgADBDESExEhQQX/2gAIAQMBAT8AGpioxMyKVI5zcT1Pzip3M26pR1qJo+pxmNf0NyGpflJc3H7FqToZjuYdQywUjL1+ajKuJbz9maq00BRsz//Z
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546889/%5Bbuyi%5D%20%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546889/%5Bbuyi%5D%20%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function main() {

        // 标题尾部增加复制按钮
        function addCopyTitleIcon() {
            let titleNodes = document.querySelectorAll('#video-info-wrap > div.video-info-detail.isVideoInfoOptimise > div > div.title > div > div > span > span')
            if (!titleNodes || titleNodes.length == 0) {
                log.log("未找到标题节点")
                return
            }
            for (let i = 0; i < titleNodes.length; i++) {
                let titleNode = titleNodes[i]
                if (!titleNode) {
                    // log.log("未找到标题节点")
                    continue
                }

                let titleWrapNode = titleNode.parentNode.parentNode.parentNode.parentNode
                // 如果已添加，则不重复添加
                if (titleWrapNode.querySelector('.byjs-copyIcon')) {
                    // log.log("已添加复制按钮")
                    continue
                }
                titleWrapNode.style.position = "relative"

                // 添加样式，如果已添加就跳过
                if (!document.querySelector('#byjs-iconWrapStyle')) {
                    var style = document.createElement('style')
                    style.id = "byjs-iconWrapStyle"
                    style.textContent = `
                        .byjs-iconWrap {
                            position: absolute;
                            left: 100%;
                            bottom: 2px;
                            z-index: 999999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .byjs-copyIcon {
                            width: 20px;
                            height: 20px;
                            cursor: pointer;
                            margin-left: 10px;
                            display: inline-block;
                            vertical-align: middle;
                        }
                    `
                    document.head.appendChild(style);
                }

                let copyTitleWithAuthor = document.createRange().createContextualFragment(`<span class="byjs-iconWrap">
                        <span class="byjs-tooltip">
                            <span class="byjs-tooltiptext">复制标题</span>
                            <img id="copyTitle" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                        </span>
                        
                        <span class="byjs-tooltip">
                            <span class="byjs-tooltiptext">复制作者</span>
                            <img id="copyAuthor" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                        </span>
                        
                        <span class="byjs-tooltip">
                            <span class="byjs-tooltiptext">复制标题+作者</span>
                            <img id="copyTitleWithAuthor" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                        </span>

                        <style>
                            
                        </style>
                    </span>
                    `)
                titleWrapNode.appendChild(copyTitleWithAuthor)
                titleWrapNode.querySelector('#copyTitle').onclick = function () {
                    let title = titleNode.innerText
                    navigator.clipboard.writeText(title)
                    showToast("复制成功")
                    log.log("复制成功: " + title)
                }
                titleWrapNode.querySelector('#copyAuthor').onclick = function () {
                    let author = titleWrapNode.parentNode.childNodes[0].childNodes[0].innerText
                    navigator.clipboard.writeText(author)
                    showToast("复制成功")
                    log.log("复制成功: " + author)
                }
                titleWrapNode.querySelector('#copyTitleWithAuthor').onclick = function () {
                    let title = titleNode.innerText
                    let author = titleWrapNode.parentNode.childNodes[0].childNodes[0].innerText
                    navigator.clipboard.writeText(title + " - " + author)
                    showToast("复制成功")
                    log.log("复制成功: " + title + " - " + author)
                }
            }
        }

        // 详情页标题下方增加复制按钮
        function addCopyTitleIconForDetail() {
            let titleNode = document.querySelector('#douyin-right-container > div.parent-route-container.route-scroll-container.IhmVuo1S > div > div > div.leftContainer.MRADF45Z > div.sJhfX08v > div > div.b3uZicw5.cb5piKg6 > div > h1')

            if (!titleNode) {
                log.log("未找到标题节点")
                return
            }

            let addPositionNode = titleNode.childNodes[0].parentNode.parentNode.parentNode.parentNode

            // 如果已添加，则不重复添加
            if (addPositionNode.querySelector('.byjs-copyIcon')) {
                // log.log("已添加复制按钮")
                return
            }

            // 添加样式，如果已添加就跳过
            if (!document.querySelector('#byjs-detail-iconWrapStyle')) {
                var style = document.createElement('style')
                style.id = "byjs-iconWrapStyle"
                style.textContent = `
                    .byjs-detail-iconWrap {
                        z-index: 999999;
                    }
                    .byjs-copyIcon {
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        margin-left: 10px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                `
                document.head.appendChild(style);
            }

            let copyTitleWithAuthor = document.createRange().createContextualFragment(`<span class="byjs-detail-iconWrap">
                    <span class="byjs-tooltip">
                        <span class="byjs-tooltiptext">复制标题</span>
                        <img id="copyTitle" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                    </span>
                    
                    <span class="byjs-tooltip">
                        <span class="byjs-tooltiptext">复制作者</span>
                        <img id="copyAuthor" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                    </span>
                    
                    <span class="byjs-tooltip">
                        <span class="byjs-tooltiptext">复制标题+作者</span>
                        <img id="copyTitleWithAuthor" class="byjs-copyIcon" src="${iconCopyBase64}"/>
                    </span>

                    <style>
                        
                    </style>
                </span>
                `)
            addPositionNode.insertBefore(copyTitleWithAuthor, addPositionNode.childNodes[1])
            addPositionNode.querySelector('#copyTitle').onclick = function () {
                let title = titleNode.innerText
                navigator.clipboard.writeText(title)
                showToast("复制成功")
                log.log("复制成功: " + title)
            }
            let authorSelector = '#douyin-right-container > div.parent-route-container.route-scroll-container.IhmVuo1S > div > div > div.detailPage.W_7gCbBd > div > div.cHwSTMd3 > div.OMAnlCHg > a > div > span > span'
            addPositionNode.querySelector('#copyAuthor').onclick = function () {
                let author = '@' + document.querySelector(authorSelector).innerText
                navigator.clipboard.writeText(author)
                showToast("复制成功")
                log.log("复制成功: " + author)
            }
            addPositionNode.querySelector('#copyTitleWithAuthor').onclick = function () {
                let title = titleNode.innerText
                let author = '@' + document.querySelector(authorSelector).innerText
                navigator.clipboard.writeText(title + " - " + author)
                showToast("复制成功")
                log.log("复制成功: " + title + " - " + author)
            }
        }

        setInterval(() => {
            if ([
                /.*douyin.com\/root\/live\/.*/,
                /live.douyin.com\/.*/
            ].findIndex(regexp => RegExp(regexp).test(window.location.href)) != -1) {
                log.log("跳过当前域名：" + window.location.href)
            }
            else if (RegExp(/.*douyin.com\/video\/.*/).test(window.location.href)) {
                log.log("setInterval 执行 addCopyTitleIconForDetail")
                addCopyTitleIconForDetail()
            }
            else {
                log.log("setInterval 执行 main")
                addCopyTitleIcon()
            }
        }, 2000);
    }
    // ==========================================  main函数结束  ==========================================


    const iconCopyBase64 = 'data:image/png;base64,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'

    const tool = {
        print(level, msg, ...args) {
            const now = new Date()
            const year = now.getFullYear()
            const month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1)
            const day = (now.getDate() < 10 ? "0" : "") + now.getDate()
            const hour = (now.getHours() < 10 ? "0" : "") + now.getHours()
            const minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
            const second = (now.getSeconds() < 10 ? "0" : "") + now.getSeconds()
            const timenow = "[" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "]"
            const host = location.host
            console[level](`[🚀 ~ 抖音工具 ${host} 🎉]` + timenow + " > ", msg, ...args)
        }
    }

    const log = {
        log(msg, ...args) {
            tool.print("log", msg, ...args)
        },
        info(msg, ...args) {
            tool.print("info", msg, ...args)
        },
        warn(msg, ...args) {
            tool.print("warn", msg, ...args)
        },
        error(msg, ...args) {
            tool.print("error", msg, ...args)
        },
        debug(msg, ...args) {
            tool.print("debug", msg, ...args)
        }
    }
    // ===================================================== log end ===============================================

    // ========================= toast =============================
    function showToast(msg) {
        const toast = document.createElement("div")
        const style = document.createElement("style")
        style.id = "byjs-toast-style"
        style.textContent = `
        .byjs-toast {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 16px;
            z-index: 9999;
        }
        `
        toast.className = "byjs-toast"
        toast.innerHTML = msg
        toast.appendChild(style)
        document.body.appendChild(toast)
        setTimeout(() => {
            document.body.removeChild(toast)
        }, 3000)
    }
    // ========================= toast end =============================

    // ========================= tooltip ==================================
    (function initTooltip() {
        const style = document.createElement("style")
        style.id = "byjs-tooltip-style"
        style.textContent = `
        .byjs-tooltip {
            position: relative;
        }
        .byjs-tooltip .byjs-tooltiptext {
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;

            /* 定位 */
            position: absolute;
            top: calc(-10px - 100%);
            left: -50%;
        }
        .byjs-tooltip:hover .byjs-tooltiptext {
            visibility: visible;
        }
        `
        document.body.appendChild(style)
    })()
    // ========================= tooltip end ==================================

    // if (!unsafeWindow.$ || !unsafeWindow.jQuery || !unsafeWindow.jQuery.fn.jquery) {
    //     log.log("获取不到$，网站匹配失败 @buyi")
    //     return
    // }

    // 域名匹配
    if (['lf-zt.douyin.com'].includes(location.host)) {
        log.log(`非工作目标域名: ${location.host}`)
        return
    }

    log.log("启动中 @buyi")

    main()

    log.log("启动完成 @buyi")

})();