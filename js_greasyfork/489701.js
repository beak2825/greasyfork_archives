// ==UserScript==
// @name         Click Data Tab
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clicks the Data tab on page load
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489701/Click%20Data%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/489701/Click%20Data%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const executeButton = document.createElement('button');
    executeButton.textContent = '执行命令';
    executeButton.style.position = 'fixed';
    executeButton.style.left = '50%';
    executeButton.style.bottom = '20px';
    executeButton.style.transform = 'translateX(-50%)';

    // 将按钮添加到页面中
    document.body.appendChild(executeButton);

    // 添加按钮点击事件监听器
    executeButton.addEventListener('click', function() {
        // 执行命令：点击 "Data" 标签
        const tabMore = document.getElementById('tabMore');
        if (tabMore) {
            tabMore.click();
        }
    });
})();