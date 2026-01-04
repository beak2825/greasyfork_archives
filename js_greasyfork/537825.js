// ==UserScript==
// @name         TierMaker AdBlock Scroll Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes page scrolling issue after using ad blockers | 修复使用广告屏蔽工具后页面无法滚动的问题
// @author       jotenbai
// @match        *://tiermaker.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537825/TierMaker%20AdBlock%20Scroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/537825/TierMaker%20AdBlock%20Scroll%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心修复函数
    const fixScroll = () => {
        // 强制覆盖HTML和body元素的overflow样式
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        // 创建防篡改样式标签
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                overflow: auto !important;
                position: static !important;
            }
            body.prevent-scroll {
                overflow: auto !important;
            }
        `;
        document.head.appendChild(style);
    };

    // 初始执行
    fixScroll();

    // 持续监控防止网站重新锁定
    const observer = new MutationObserver((mutations) => {
        if (document.documentElement.style.overflow === 'hidden' ||
            document.body.style.overflow === 'hidden') {
            fixScroll();
        }
    });

    // 监控HTML和body的属性变化
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
    });
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style']
    });

    // 添加定时保险（每2秒检查一次）
    setInterval(fixScroll, 2000);
})();