// ==UserScript==
// @name         mitmweb检测并复制指定内容
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  检测指定元素并添加复制按钮，并以气泡提示反馈复制结果
// @match        http://10.10.10.8:*/*
// @grant        GM_setClipboard
// @license      MIT
// @auther       stephen
// @downloadURL https://update.greasyfork.org/scripts/515889/mitmweb%E6%A3%80%E6%B5%8B%E5%B9%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9A%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/515889/mitmweb%E6%A3%80%E6%B5%8B%E5%B9%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9A%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义显示气泡提示的函数
    function showTooltip(message, success = true) {
        const tooltip = document.createElement('div');
        tooltip.innerText = message;
        tooltip.style.position = 'fixed';
        tooltip.style.bottom = '60px';
        tooltip.style.right = '20px';
        tooltip.style.padding = '10px 15px';
        tooltip.style.borderRadius = '12px';
        tooltip.style.color = '#ffffff';
        tooltip.style.backgroundColor = success ? '#333333' : '#ff3b30'; // 黑色和红色提示
        tooltip.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '9999';
        tooltip.style.opacity = '1';
        tooltip.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(tooltip);

        // 1.5 秒后淡出并移除提示
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 500);
        }, 1500);
    }

    // 定义一个函数来查找目标元素并添加固定按钮
    function addCopyButton() {
        if (!document.getElementById('copy-button')) {
            // 创建固定在页面右下角的按钮
            const copyButton = document.createElement('button');
            copyButton.innerText = '复制内容';
            copyButton.id = 'copy-button';

            // 黑白风格的按钮样式
            copyButton.style.position = 'fixed';
            copyButton.style.bottom = '20px';
            copyButton.style.right = '20px';
            copyButton.style.padding = '10px 20px';
            copyButton.style.fontSize = '14px';
            copyButton.style.color = '#ffffff'; // 白色文字
            copyButton.style.backgroundColor = '#333333'; // 黑色背景
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '12px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
            copyButton.style.transition = 'background-color 0.3s ease';
            copyButton.style.zIndex = '9999';

            // 悬停效果
            copyButton.addEventListener('mouseover', () => {
                copyButton.style.backgroundColor = '#555555'; // 灰色悬停效果
            });
            copyButton.addEventListener('mouseout', () => {
                copyButton.style.backgroundColor = '#333333';
            });

            // 定义按钮点击事件
            copyButton.addEventListener('click', () => {
                const contentElement = document.evaluate(
                    '/html/body/div[2]/div/div[1]/div[3]/section/div[3]/pre',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (contentElement) {
                    const textToCopy = contentElement.innerText;
                    GM_setClipboard(textToCopy); // 复制到剪贴板
                    showTooltip('内容已复制到剪贴板!'); // 成功气泡提示
                } else {
                    showTooltip('找不到内容元素!', false); // 失败气泡提示
                }
            });

            // 将按钮添加到页面
            document.body.appendChild(copyButton);
        }
    }

    // 使用 MutationObserver 来监听 DOM 变化，确保目标元素加载完成后添加按钮
    const observer = new MutationObserver(addCopyButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // 在页面加载后延迟执行，以确保元素已加载
    setTimeout(addCopyButton, 3000); // 延迟 3 秒执行
})();
