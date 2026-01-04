// ==UserScript==
// @name         更好的Bilibili直播马赛克清除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  基于页面元素监听实现的Bilibili(哔哩哔哩/B站)直播间马赛克清除
// @author       Hell
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510445/%E6%9B%B4%E5%A5%BD%E7%9A%84Bilibili%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/510445/%E6%9B%B4%E5%A5%BD%E7%9A%84Bilibili%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const mask_panel = "web-player-module-area-mask-panel"

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeName === 'DIV' && node.id === mask_panel) {
                    node.remove();
                    break;
                }
            }
        }
    });

    observer.observe(document.querySelector(".live-player-mounter"), {
        childList: true
    });
})();