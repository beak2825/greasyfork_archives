// ==UserScript==
// @name         CMCC邮件插件
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  自动关闭网页版本每次启动后右边的烦人AI
// @author       You
// @match        https://mail.chinamobile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinamobile.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522964/CMCC%E9%82%AE%E4%BB%B6%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/522964/CMCC%E9%82%AE%E4%BB%B6%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
 // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找目标元素
        const closeButton = document.querySelector('span.icon-wrap i.toolIcon.toolClose');

        if (closeButton) {
            console.log('找到关闭按钮，正在点击...');
            closeButton.click(); // 执行点击操作
        } else {
            console.warn('未找到关闭按钮，请检查元素选择器是否正确。');
        }
    });
})();