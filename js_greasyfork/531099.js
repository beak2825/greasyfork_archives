// ==UserScript==
// @name         知乎评论弹窗快捷关闭
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击知乎网页评论框左右两侧空白区域关闭评论框
// @author       AI
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531099/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%BC%B9%E7%AA%97%E5%BF%AB%E6%8D%B7%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/531099/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%BC%B9%E7%AA%97%E5%BF%AB%E6%8D%B7%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到评论框的容器
    function findCommentBoxContainer(closeButton) {
        let currentElement = closeButton.parentElement;
        while (currentElement && currentElement !== document.body) {
            if (currentElement.querySelector('span[data-focus-scope-start="true"]') &&
                currentElement.querySelector('span[data-focus-scope-end="true"]')) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    // 找到评论框内容区域
    function findCommentContentArea(commentBox) {
        return commentBox.querySelector('div[tabindex="0"]') || commentBox;
    }

    // 设置点击空白关闭逻辑
    function setupCloseOnClickOutside() {
        if (window._zhihuCommentCloserBound) return;
        window._zhihuCommentCloserBound = true;

        const handler = (event) => {
            const closeButton = document.querySelector('button[aria-label="关闭"]');
            if (!closeButton) {
                document.removeEventListener('click', handler, true);
                window._zhihuCommentCloserBound = false;
                return;
            }

            const commentBox = findCommentBoxContainer(closeButton);
            if (!commentBox) return;

            const commentContent = findCommentContentArea(commentBox);
            const target = event.target;
            const { clientX, clientY } = event;

            // 获取评论框内容区域的边界
            const rect = commentContent.getBoundingClientRect();

            // 判断点击是否在评论框左右两侧
            const isLeft = clientX < rect.left;
            const isRight = clientX > rect.right;
            const isWithinY = clientY >= rect.top && clientY <= rect.bottom;

            // 排除点击在评论框内部或可交互元素
            if (commentContent.contains(target) ||
                target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
                return;
            }

            // 只有点击在左右两侧且在 Y 轴范围内才关闭
            if ((isLeft || isRight) && isWithinY) {
                closeButton.click();
            }
        };

        document.addEventListener('click', handler, true);
    }

    // 动态检测评论框
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('button[aria-label="关闭"]')) {
            setupCloseOnClickOutside();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始检查
    if (document.querySelector('button[aria-label="关闭"]')) {
        setupCloseOnClickOutside();
    }
})();