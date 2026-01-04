// ==UserScript==
// @name         Copy URL on Shift+Cmd/Ctrl+X (快捷键复制URL信息) Learn Arc !!!
// @namespace    https://github.com/cloudmoonocus
// @version      0.1
// @description  使用 Shift+Cmd/Ctrl+X 复制当前页面的完整 URL | Copy the full URL of the current page with Shift+Cmd/Ctrl+X
// @author       seanfeng
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547502/Copy%20URL%20on%20Shift%2BCmdCtrl%2BX%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6URL%E4%BF%A1%E6%81%AF%29%20Learn%20Arc%20%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/547502/Copy%20URL%20on%20Shift%2BCmdCtrl%2BX%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6URL%E4%BF%A1%E6%81%AF%29%20Learn%20Arc%20%21%21%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取浏览器语言
    const userLanguage = navigator.language || navigator.userLanguage;

    // 设置中文和英文的提示信息
    const messages = {
        en: 'URL copied to clipboard!',
        zh: 'URL已复制到剪贴板！'
    };

    // 监听键盘事件
    window.addEventListener('keydown', function (event) {
        if (event.shiftKey && (event.key === 'X' || event.key === 'x') && (event.metaKey || event.ctrlKey)) {
            // 复制当前页面的URL到剪贴板
            GM_setClipboard(window.location.href);
            console.log('URL copied:', window.location.href);

            // 创建提示框
            var messageBox = document.createElement('div');
            messageBox.style.position = 'fixed';
            messageBox.style.top = '20px';
            messageBox.style.left = '50%';
            messageBox.style.transform = 'translateX(-50%)';
            messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            messageBox.style.color = 'white';
            messageBox.style.padding = '10px 20px';
            messageBox.style.borderRadius = '5px';
            messageBox.style.fontSize = '14px';
            messageBox.style.zIndex = '9999';
            messageBox.textContent = messages[userLanguage.startsWith('zh') ? 'zh' : 'en'];
            document.body.appendChild(messageBox);
            setTimeout(function () {
                document.body.removeChild(messageBox);
            }, 1500);
        }
    });
})();
