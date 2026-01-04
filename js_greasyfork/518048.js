// ==UserScript==
// @name         CSOZ Copy Code Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a copy button to code blocks with improved styling
// @author       Y.V
// @license      AGPL-3.0-or-later
// @match        https://oj.czos.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518048/CSOZ%20Copy%20Code%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518048/CSOZ%20Copy%20Code%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 添加全局样式
        const style = document.createElement('style');
        style.innerHTML = `
            .copy-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background-color: #007bff;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
                font-size: 12px;
                transition: background-color 0.3s ease, transform 0.2s ease;
                z-index: 1000;
            }
            .copy-btn:hover {
                background-color: #0056b3;
                transform: scale(1.1);
            }
            .code-container {
                position: relative;
            }
            .copy-notification {
                position: fixed;
                top: 20px;    /* 距离顶部20px */
                right: 20px;  /* 距离右侧20px */
                background-color: #28a745;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transform: translateY(-20px); /* 向上淡入 */
                transition: opacity 0.5s ease, transform 0.5s ease;
                z-index: 9999;
            }
            .copy-notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        // 创建通知框
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerText = '代码已复制到剪贴板！';
        document.body.appendChild(notification);

        function showNotification() {
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 2000);
        }

        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('div.markdown pre code');
        codeBlocks.forEach(codeBlock => {
            // 包裹代码块以添加相对定位
            const container = document.createElement('div');
            container.className = 'code-container';
            codeBlock.parentNode.replaceChild(container, codeBlock);
            container.appendChild(codeBlock);

            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.innerText = '复制';
            copyButton.className = 'copy-btn';

            // 将按钮插入到代码块右上角
            container.appendChild(copyButton);

            // 添加点击事件
            copyButton.addEventListener('click', function() {
                const codeText = codeBlock.innerText;
                navigator.clipboard.writeText(codeText).then(function() {
                    showNotification();
                }).catch(function(err) {
                    console.error('复制失败: ', err);
                });
            });
        });
    });
})();