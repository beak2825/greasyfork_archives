// ==UserScript==
// @name         YouTube: Open Videos in New Tab
// @name:zh-CN   YouTube: 新标签页打开视频
// @namespace    https://www.gwlin.com/
// @version      1.0.2
// @description  Clicks on YouTube video links (homepage, search results, related videos, etc.) will open in a new tab instead of the current one.
// @description:zh-CN 在 YouTube 的任何地方（首页、搜索、侧边栏等）点击视频链接，都会在新标签页中打开，而不是当前页跳转。修复了点击时间戳和章节会在新标签页打开的问题。
// @author       elevioux
// @match        *://www.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541589/YouTube%3A%20Open%20Videos%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/541589/YouTube%3A%20Open%20Videos%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 辅助函数：从URL中提取视频ID
    function getVideoId(urlStr) {
        try {
            const url = new URL(urlStr);
            // 标准视频链接 /watch?v=VIDEO_ID
            if (url.pathname.startsWith('/watch')) {
                return url.searchParams.get('v');
            }
            // Shorts 链接 /shorts/VIDEO_ID
            if (url.pathname.startsWith('/shorts/')) {
                return url.pathname.split('/')[2];
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    document.body.addEventListener('click', function(event) {
        // 1. 从被点击的元素开始，向上查找最近的<a>标签
        const link = event.target.closest('a');

        // 2. 如果没有找到<a>标签，或者链接不存在，则什么也不做
        if (!link || !link.href) {
            return;
        }

        // 3. 检查链接是否是视频或Shorts的链接
        const isVideoLink = link.pathname.startsWith('/watch') || link.pathname.startsWith('/shorts/');

        // 4. 确认是视频链接
        if (isVideoLink) {
            // =========================
            // FIX: 修复时间戳和章节跳转问题
            // =========================
            const currentVideoId = getVideoId(window.location.href);
            const targetVideoId = getVideoId(link.href);

            // 如果当前页面有视频ID，且点击的链接也是同一个视频ID
            // 说明这是：时间戳、章节标记、或者是“查看摘要”等页内跳转
            if (currentVideoId && targetVideoId && currentVideoId === targetVideoId) {
                // 不做任何处理，允许原生行为（在当前播放器跳转时间）
                return;
            }
            // =========================

            // 检查点击的不是鼠标中键或带有Ctrl/Cmd键的点击
            if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey) {

                // 阻止默认的点击行为
                event.preventDefault();
                event.stopPropagation();

                // 在新标签页打开链接
                window.open(link.href, '_blank');
            }
        }
    }, true); // 使用捕获阶段

})();