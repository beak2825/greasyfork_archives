// ==UserScript==
// @name         YouTube 展开评论
// @namespace    https://greasyfork.org/users/1171320
// @version      1.0
// @description  自动展开六条以内的评论，支持手动缩起。
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539177/YouTube%20%E5%B1%95%E5%BC%80%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539177/YouTube%20%E5%B1%95%E5%BC%80%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processedSet = new WeakSet();

    const clickLimitedReplies = () => {
        const buttons = document.querySelectorAll('ytd-comment-replies-renderer #more-replies');

        buttons.forEach(button => {
            // 已处理的按钮跳过
            if (processedSet.has(button)) return;

            // 查找按钮对应的回复数文本，例如 "查看 3 条回复"
            const text = button.innerText || "";

            const match = text.match(/(\d+)\s*条/);
            const count = match ? parseInt(match[1], 10) : NaN;

            if (!isNaN(count) && count <= 6) {
                button.click();
                processedSet.add(button); // 标记为已点击
            }
        });
    };

    const observer = new MutationObserver(() => {
        clickLimitedReplies();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始延迟展开
    setTimeout(clickLimitedReplies, 2000);
})();
