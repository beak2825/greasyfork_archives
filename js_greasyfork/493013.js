// ==UserScript==
// @name         隐藏B站部分直播间马赛克
// @namespace    XHYYD
// @version      1.10
// @description  一个非常简单的脚本
// @author       YDYYD
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493013/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%83%A8%E5%88%86%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493013/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%83%A8%E5%88%86%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    const scanInterval = 100; // 扫描间隔为100ms
    const maxAttempts = 200; // 最大尝试次数 (20秒)
    let attempts = 0;
    const delayBeforeRemove = 2000; // 元素变透明后等待2秒再删除

    const intervalId = setInterval(() => {
        const elements = document.querySelectorAll(".web-player-module-area-mask");
        if (elements.length > 0) {
            elements.forEach(element => {
                // 立即将元素变为完全透明
                element.style.transition = "none";
                element.style.opacity = "0";

                // 为每个元素分别设置删除的定时器
                setTimeout(() => {
                    element.remove();
                }, delayBeforeRemove);
            });
            console.log('已删除所有马赛克');
            clearInterval(intervalId);
        } else if (++attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, scanInterval);
})();