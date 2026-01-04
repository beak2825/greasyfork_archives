// ==UserScript==
// @name         xm-clean
// @namespace    https://rachpt.cn/
// @version      2024-07-14
// @description  线下大象环境 雷达事件 批量 -> 收进消息助手且不提醒
// @author       rachpt
// @license      MIT
// @match        https://xm-web.it.test.sankuai.com/*
// @icon         https://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/appIcon/c2439476-beb0-45a3-ae62-2e3a2224d990
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/500599/xm-clean.user.js
// @updateURL https://update.greasyfork.org/scripts/500599/xm-clean.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    const iconURL =
          'https://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/appIcon/c2439476-beb0-45a3-ae62-2e3a2224d990'
    const rightClickEvent = new MouseEvent('contextmenu', {
        view: unsafeWindow,
        cancelable: true,
        bubbles: true,
        buttons: 2,
        button: 2,
    })

    function handlerOne() {
        const menu = document.querySelector('.comp-contextmenu.open')
        if (!menu) return
        const el = menu.querySelector('.menu-item.add_msg_helper')
        el?.click()
    }

    function closeDownload() {
        const downloadEl = document.querySelector('.download-pc-announcement-container')
        if (!downloadEl) return
        const closeEl = downloadEl.querySelector('.mtdicon-close')
        closeEl?.click()
        changeFavicon()
    }

    function changeFavicon() {
        const link = document.querySelector('link')
        if (!link) return
        link.href = iconURL
    }

    async function callback() {
        for (const item of Array.from(document.querySelectorAll('.comp-session-list > li'))) {
            const isTarget = item.title?.includes('事件')
            if (!isTarget) continue
            item.dispatchEvent(rightClickEvent)

            await new Promise(resolve => setTimeout(resolve, 100))
            handlerOne()
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('执行归档', callback)
    requestAnimationFrame(closeDownload)
    setTimeout(closeDownload, 3000)
    setTimeout(closeDownload, 6000)
})()
