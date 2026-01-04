// ==UserScript==
// @name         YouTube: Open Videos in New Tab
// @name:zh-CN   YouTube: 新标签页打开视频
// @namespace    https://www.gwlin.com/
// @version      1.0.1
// @description  Clicks on YouTube video links (homepage, search results, related videos, etc.) will open in a new tab instead of the current one.
// @description:zh-CN 在 YouTube 的任何地方（首页、搜索、侧边栏等）点击视频链接，都会在新标签页中打开，而不是当前页跳转。
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

    document.body.addEventListener('click', function(event) {
        // 1. 从被点击的元素开始，向上查找最近的<a>标签
        // 这样做是因为用户可能点击的是视频标题(<span>)或缩略图(<img>)，它们都在<a>标签内部
        const link = event.target.closest('a');

        // 2. 如果没有找到<a>标签，或者链接不存在，则什么也不做
        if (!link || !link.href) {
            return;
        }

        // 3. 检查链接是否是视频或Shorts的链接
        //    - /watch?v=  是标准视频链接
        //    - /shorts/   是Shorts短视频链接
        const isVideoLink = link.pathname.startsWith('/watch') || link.pathname.startsWith('/shorts/');

        // 4. 确认是视频链接，并且不是在同一个页面内导航的特殊链接（例如，点击播放列表中的下一个视频）
        if (isVideoLink) {
            // 检查点击的不是鼠标中键或带有Ctrl/Cmd键的点击（这些浏览器本身就会在新标签页打开）
            if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey) {

                // 阻止默认的点击行为（即在当前页面跳转）
                event.preventDefault();
                event.stopPropagation();

                // 在新标签页打开链接
                window.open(link.href, '_blank');
            }
        }
    }, true); // 使用捕获阶段，确保能比YouTube自己的脚本更早处理点击事件

})();