// ==UserScript==
// @name         YouTube Shorts URL to Normal URL (Enhanced)
// @namespace    https://example.com/
// @version      1.1
// @description  自动将 YouTube Shorts 链接替换为普通视频链接，包括动态导航
// @author       yy
// @match        https://*.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531149/YouTube%20Shorts%20URL%20to%20Normal%20URL%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531149/YouTube%20Shorts%20URL%20to%20Normal%20URL%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并转换 Shorts URL 的函数
    function convertShortsUrl() {
        const currentUrl = window.location.href;
        if (currentUrl.includes("/shorts/")) {
            const videoCode = currentUrl.split("/shorts/")[1];
            const normalUrl = `https://www.youtube.com/watch?v=${videoCode}`;
            window.location.replace(normalUrl);
        }
    }

    // 初始调用，处理页面加载时的 Shorts URL
    convertShortsUrl();

    // 监听 URL 变化（支持 YouTube 的动态导航）
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        const newUrl = window.location.href;
        if (newUrl !== lastUrl) {
            lastUrl = newUrl;
            convertShortsUrl();
        }
    });

    // 监听文档的变化
    observer.observe(document, { subtree: true, childList: true });
})();
