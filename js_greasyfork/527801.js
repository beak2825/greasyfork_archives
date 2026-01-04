// ==UserScript==
// @name         LeetCode 题目链接复制助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 LeetCode 题目页面添加复制题目链接的按钮
// @author       Your name
// @match        https://leetcode.cn/problems/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527801/LeetCode%20%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527801/LeetCode%20%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        .copy-btn {
            margin-left: 10px;
            padding: 2px;
            border: 1px solid #40a9ff;
            border-radius: 4px;
            background: #fff;
            color: #40a9ff;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            vertical-align: middle;
            line-height: 23px;
        }
        .copy-btn:hover {
            background: #40a9ff;
            color: #fff;
        }
    `);

    // 创建并插入复制按钮
    function createCopyButton(targetElement) {
        // 检查是否已经存在按钮
        if (targetElement.nextElementSibling?.classList.contains('copy-btn')) {
            return;
        }

        const copyButton = document.createElement('button');
        copyButton.textContent = '拷贝';
        copyButton.className = 'copy-btn';

        copyButton.addEventListener('click', function() {
            const link = window.location.href;
            const text = targetElement.textContent;
            const copyText = `# ${text} \n${link}`;

            navigator.clipboard.writeText(copyText).then(() => {
                // 临时改变按钮文字显示复制成功
                const originalText = copyButton.textContent;
                copyButton.textContent = '已复制！';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('复制失败:', err);
                copyButton.textContent = '复制失败';
                setTimeout(() => {
                    copyButton.textContent = '拷贝';
                }, 1500);
            });
        });

        targetElement.parentNode.insertBefore(copyButton, targetElement.nextSibling);
    }

    // 使用 MutationObserver 监听 DOM 变化
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const titleDiv = document.querySelector('.text-title-large.font-semibold.text-text-primary.dark\\:text-text-primary');
                    if (titleDiv) {
                        const link = titleDiv.querySelector('a');
                        if (link) {
                            createCopyButton(link);
                            // 找到后就可以断开观察器了，因为标题只有一个
                            observer.disconnect();
                        }
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // 页面加载完成后开始观察 DOM 变化
    window.addEventListener('load', observeDOM);

    // 同时也在脚本运行时尝试添加按钮，以应对页面已加载的情况
    setTimeout(() => {
        const titleDiv = document.querySelector('.text-title-large.font-semibold.text-text-primary.dark\\:text-text-primary');
        if (titleDiv) {
            const link = titleDiv.querySelector('a');
            if (link) {
                createCopyButton(link);
            }
        }
    }, 1000);
})();