// ==UserScript==
// @name         Y键网页全屏
// @namespace    https://github.com/Nouchi-Kousu/KeyY_webFullScreen/
// @version      2024-11-27_1
// @description  B 站播放页面 Y 键网页全屏
// @author       Nouchi
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/*
// @icon         http://bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519015/Y%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/519015/Y%E9%94%AE%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(() => {
    'use strict'
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const webFullScreen = document.querySelector('div[aria-label="网页全屏"]')
                if (webFullScreen) {
                    console.log('目标元素已加载:', webFullScreen)
                    document.addEventListener('keydown',(e)=>{
                        if(e.code == 'KeyY'){
                            webFullScreen.click()
                        }
                    })
                    observer.disconnect()
                    break
                }
            }
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })


})()