// ==UserScript==
// @name         B站直播去模糊遮罩
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除B站直播页面上的模糊遮罩
// @author       t1mmuz
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        noe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539988/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%A8%A1%E7%B3%8A%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/539988/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%A8%A1%E7%B3%8A%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMasks() {
        const panel = document.getElementById('web-player-module-area-mask-panel');
        if (panel) {
            panel.remove();
            console.log('[B站去遮罩] 模糊遮罩已移除');
        }

        const masks = document.querySelectorAll('.web-player-module-area-mask');
        masks.forEach(el => {
            el.remove();
        });
    }

    // 初次执行一次
    removeMasks();

    // 监听 DOM 变动，防止遮罩重新出现
    const observer = new MutationObserver(() => {
        removeMasks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[B站去遮罩] Tampermonkey脚本已运行');
})();
