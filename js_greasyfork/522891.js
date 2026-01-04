// ==UserScript==
// @name         Genspark Code Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Genspark.ai 代码区域添加复制按钮
// @author       Your name
// @match        https://www.genspark.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522891/Genspark%20Code%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522891/Genspark%20Code%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加复制按钮的样式
    const style = document.createElement('style');
    style.textContent = `
        .code-copy-btn {
            position: absolute;
            right: 10px;
            top: 10px;
            padding: 4px 8px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            z-index: 100;
        }
        .code-copy-btn:hover {
            opacity: 1;
        }
        .code-block-wrapper {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addCopyButtons();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function addCopyButtons() {
        // 只选择代码区域内的代码块
        const codeBlocks = document.querySelectorAll('.hljs');

        codeBlocks.forEach(codeBlock => {
            // 检查是否已经添加过按钮
            if (codeBlock.parentNode.querySelector('.code-copy-btn')) {
                return;
            }

            // 为代码块添加包装器
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            codeBlock.parentNode.insertBefore(wrapper, codeBlock);
            wrapper.appendChild(codeBlock);

            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-btn';
            copyButton.textContent = '复制';
            wrapper.appendChild(copyButton);

            // 添加点击事件
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);
                    copyButton.textContent = '已复制!';
                    setTimeout(() => {
                        copyButton.textContent = '复制';
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    copyButton.textContent = '复制失败';
                    setTimeout(() => {
                        copyButton.textContent = '复制';
                    }, 2000);
                }
            });
        });
    }

    // 初始执行一次
    addCopyButtons();
})();