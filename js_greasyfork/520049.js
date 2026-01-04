// ==UserScript==
// @name         Remove All Neat Download Bars (移除NDM的视频下载条)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  智能移除 Neat Download Manager 的视频下载条
// @author       YuoHira
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520049/Remove%20All%20Neat%20Download%20Bars%20%28%E7%A7%BB%E9%99%A4NDM%E7%9A%84%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9D%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520049/Remove%20All%20Neat%20Download%20Bars%20%28%E7%A7%BB%E9%99%A4NDM%E7%9A%84%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9D%A1%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPageLoaded = false;
    let frameCheckActive = true;
    let lastCheck = 0;
    const CHECK_INTERVAL = 5000; // 5秒检查间隔

    // 移除所有以 neatDiv 开头的元素
    function removeNeatDivs() {
        const elements = document.querySelectorAll('[id^="neatDiv"]');
        elements.forEach(element => {
            element.remove();
        });
    }

    // 每帧检查函数
    function frameCheck() {
        if (!frameCheckActive) return;

        removeNeatDivs();
        requestAnimationFrame(frameCheck);
    }

    // 定期检查函数
    function periodicCheck() {
        const now = Date.now();
        if (now - lastCheck >= CHECK_INTERVAL) {
            removeNeatDivs();
            lastCheck = now;
        }
    }

    // 创建 MutationObserver 来监视 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        removeNeatDivs();
    });

    // 页面加载完成后的处理
    function onPageLoad() {
        isPageLoaded = true;
        frameCheckActive = false; // 停止每帧检查

        // 启动 MutationObserver
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 设置定期检查
        setInterval(periodicCheck, 1000); // 每秒检查一次是否需要执行清理

        // 最后执行一次清理
        removeNeatDivs();
    }

    // 添加CSS规则
    const style = document.createElement('style');
    style.textContent = `
        [id^="neatDiv"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: fixed !important;
            z-index: -9999 !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }
    `;

    // 确保样式表最早被添加
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }

    // 启动初始检查
    requestAnimationFrame(frameCheck);

    // 监听页面加载完成事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPageLoad);
    } else {
        onPageLoad();
    }

    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isPageLoaded) {
            removeNeatDivs(); // 页面变为可见时检查一次
        }
    });
})();
