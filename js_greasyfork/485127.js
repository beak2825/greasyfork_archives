// ==UserScript==
// @name            bilibili直播隐藏底部弹幕
// @namespace       https://github.com/RengeRenge
// @version         2024102700
// @description     bilibili直播隐藏底部弹幕 b站直播隐藏底部弹幕
// @author          RengeRenge
// @license         MIT
// @match           *://live.bilibili.com/*
// @icon            https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @icon64          https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo.png
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/485127/bilibili%E7%9B%B4%E6%92%AD%E9%9A%90%E8%97%8F%E5%BA%95%E9%83%A8%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/485127/bilibili%E7%9B%B4%E6%92%AD%E9%9A%90%E8%97%8F%E5%BA%95%E9%83%A8%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let timer = setInterval(() => {
        if (start()) {
            clearInterval(timer)
        }
    }, 2000)

    function start() {
        const targetNode = document.getElementsByClassName('danmaku-item-container')[0]
        console.log("found danmaku-item-container result", targetNode)
        if (!targetNode) {
            return 0
        }
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        observeDanmu(node)
                    })
                    hiddenBottomDanmu()
                }
            }
        })
        const config = { childList: true}
        observer.observe(targetNode, config)
        return 1

        function observeDanmu(node) {
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        hiddenBottomDanmu()
                    }
                }
            })

            const config = { attributes: true, className: true, characterData: true }
            observer.observe(node, config)
        }

        function hiddenBottomDanmu() {
            for (const obj of document.getElementsByClassName('bili-danmaku-x-center')) {
                obj.style.opacity = 0
            }
        }
    }
})();