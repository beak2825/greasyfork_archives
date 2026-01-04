// ==UserScript==
// @name         B站推荐视频新标签页打开（修复原页面跳转问题）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  点击B站右侧推荐视频时，强制在新标签页中打开，并阻止原页面跳转
// @author       Your Name
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524317/B%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E4%BF%AE%E5%A4%8D%E5%8E%9F%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E9%97%AE%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/524317/B%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E4%BF%AE%E5%A4%8D%E5%8E%9F%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E9%97%AE%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 监听点击事件，处理推荐视频链接
    function handleRecommendClicks(event) {
        // 获取点击的目标元素
        const target = event.target;

        // 检查点击的是否是推荐视频的链接
        const videoLink = target.closest('a[href^="/video/"]');
        if (videoLink) {
            // 阻止默认行为（在当前页面打开）
            event.preventDefault();
            event.stopPropagation(); // 阻止事件冒泡

            // 获取视频的完整链接
            const videoUrl = new URL(videoLink.href, window.location.origin).href;

            // 在新标签页中打开视频
            window.open(videoUrl, '_blank');
        }
    }

    // 监听整个文档的点击事件
    document.addEventListener('click', handleRecommendClicks, true); // 使用捕获阶段

    // 监听动态加载的内容
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                console.log('检测到新内容加载，重新绑定事件。');
            }
        });
    });

    // 开始观察文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log('B站推荐视频新标签页打开脚本已启用！');
})();