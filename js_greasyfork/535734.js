// ==UserScript==
// @name         Notion auto copy text on select
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 Notion 中选中文本后自动复制到剪贴板
// @author       You
// @match        https://*.notion.so/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535734/Notion%20auto%20copy%20text%20on%20select.user.js
// @updateURL https://update.greasyfork.org/scripts/535734/Notion%20auto%20copy%20text%20on%20select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('mouseup', function(event) {
        // 确保是鼠标左键
        if (event.button === 0) {
            // 添加小延迟确保选择已完成稳定
            setTimeout(function() {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    copyTextToClipboard(selectedText);
                }
            }, 10); // 10毫秒延迟，通常足够但不影响体验
        }
    });

    function copyTextToClipboard(text) {
        // 方法1：使用Clipboard API（现代浏览器）
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showNotification('已复制');
                    console.log('文本已复制到剪贴板 (Clipboard API)');
                })
                .catch(err => {
                    console.error('复制失败 (Clipboard API): ', err);
                    fallbackCopy(text); // 尝试回退方法
                });
        } else {
            // 方法2：传统方法
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '0';
        textarea.style.top = '0';
        document.body.appendChild(textarea);

        try {
            textarea.focus();
            textarea.select();

            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('已复制');
                console.log('文本已复制到剪贴板 (execCommand)');
            } else {
                console.error('复制失败 (execCommand)');
                showNotification('复制失败', true);
            }
        } catch (err) {
            console.error('复制失败: ', err);
            showNotification('复制失败', true);
        }

        document.body.removeChild(textarea);
    }

    function showNotification(message, isError = false) {
        const notificationDiv = document.createElement('div');
        notificationDiv.textContent = message;
        notificationDiv.style.position = 'fixed';
        notificationDiv.style.bottom = '20px';
        notificationDiv.style.right = '20px';
        notificationDiv.style.padding = '10px';
        notificationDiv.style.backgroundColor = isError ? 'rgba(220, 53, 69, 0.8)' : 'rgba(0, 0, 0, 0.7)';
        notificationDiv.style.color = 'white';
        notificationDiv.style.borderRadius = '5px';
        notificationDiv.style.zIndex = '9999';
        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 2000);
    }
})();