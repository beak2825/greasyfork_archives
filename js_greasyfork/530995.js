// ==UserScript==
// @name         GitHub Commits Time Formatter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  GitHub 仓库的 /commits 页面，每个 commit 的头像前面 增加时间 YYYY-MM-DD HH:MM
// @author       You
// @match        https://github.com/*/commits/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530995/GitHub%20Commits%20Time%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/530995/GitHub%20Commits%20Time%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 title 属性中提取并格式化时间的函数
    function formatDateTimeFromTitle(title) {
        const parts = title.match(/(\w+ \d+, \d{4}), (\d+:\d+ [AP]M)/);
        if (!parts) {
            return "";
        }
        const [, datePart, timePart] = parts;
        const fullDateStr = `${datePart} ${timePart}`;
        const date = new Date(fullDateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 处理时间元素的函数
    function processTimeElements() {
        const relativeTimeElements = document.querySelectorAll('relative-time[class^="sc-aXZVg"][class*="pl-1"]');
        relativeTimeElements.forEach((timeElement) => {
            const title = timeElement.getAttribute('title');
            if (title) {
                const formattedTime = formatDateTimeFromTitle(title);
                const targetDiv = timeElement.closest('li').querySelector('div[data-testid="author-avatar"]');
                if (targetDiv) {
                    // 检查是否已经存在格式化后的时间元素
                    const existingTimeSpan = targetDiv.previousElementSibling;
                    if (existingTimeSpan && existingTimeSpan.tagName === 'SPAN' && existingTimeSpan.textContent === formattedTime) {
                        return; // 如果已经存在则跳过
                    }
                    // 创建新的 <span> 元素来显示格式化后的时间
                    const timeSpan = document.createElement('span');
                    timeSpan.textContent = formattedTime;
                    timeSpan.style.whiteSpace = 'pre'; // 确保空格显示正常
                    timeSpan.style.marginRight = '10px'; // 添加右边距
                    // 在指定的 div 元素前面插入新的 <span> 元素
                    targetDiv.parentNode.insertBefore(timeSpan, targetDiv);
                }
            }
        });
    }

    // 节流函数
    function throttle(func, delay) {
        let timer = null;
        return function() {
            if (!timer) {
                func.apply(this, arguments);
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            }
        };
    }

    // 初始化 MutationObserver
    function initMutationObserver() {
        const throttledProcessTimeElements = throttle(processTimeElements, 500); // 每 500 毫秒最多执行一次
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    throttledProcessTimeElements();
                }
            }
        });

        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        observer.observe(targetNode, config);
    }

    // 主函数
    function main() {
        processTimeElements();
        initMutationObserver();
    }

    main();

})();