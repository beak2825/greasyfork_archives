// ==UserScript==
// @name         隐藏B站直播马赛克
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏B站直播间网页端马赛克
// @author       DinoAndCat
// @match        *://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499299/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499299/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // 使用一个小延迟来隐藏元素，减少被检测到的可能性
                setTimeout(hideElement, 500);
            }
        });
    });

    // 配置MutationObserver
    const config = { childList: true, subtree: true };

    // 观察页面的根元素
    observer.observe(document.body, config);

    // 尝试隐藏目标元素
    function hideElement() {
        const element = document.getElementById('web-player-module-area-mask-panel');
        if (element) {
            // 更改元素的CSS类而不是直接设置display
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            console.log('Element hidden');
        }
    }

    // 初始调用，隐藏元素
    hideElement();
})();