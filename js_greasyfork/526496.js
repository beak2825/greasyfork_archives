// ==UserScript==
// @name         什么值得买动态加载评论过滤
// @namespace    https://example.com/
// @version      1.0
// @description  屏蔽什么值得买评论数为0的推荐内容，并支持动态加载
// @author       Your Name
// @match        https://www.smzdm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526496/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E5%8A%A8%E6%80%81%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/526496/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E5%8A%A8%E6%80%81%E5%8A%A0%E8%BD%BD%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义脚本的主要逻辑
    function runScript() {
        // 查找所有推荐内容的容器
        const feedItems = document.querySelectorAll('.J_feed_za.feed-row-wide');

        // 遍历每个推荐内容
        feedItems.forEach((feedItem) => {
            // 查找评论数图标（类名为 icon-comment-o-thin）
            const commentIcon = feedItem.querySelector('.icon-comment-o-thin');
            if (commentIcon) {
                // 查找评论数文本（假设评论数在评论图标后面的文本节点）
                const commentText = commentIcon.nextSibling?.textContent?.trim();

                // 使用正则表达式提取评论数
                const commentCount = (commentText && commentText.match(/\d+/)) ? parseInt(commentText.match(/\d+/)[0], 10) : 0;

                // 检查评论数是否大于5
                if (commentCount < 3) {
                    // 如果评论数大于5，隐藏该推荐内容
                    feedItem.style.display = 'none';
                }
            }
        });
    }

    // 每次页面加载时运行脚本
    runScript();

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver(runScript);

    // 开始监听页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();