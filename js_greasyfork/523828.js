// ==UserScript==
// @name         Forcefully remove webpage copy restrictions.
// @namespace    https://www.cnblogs.com/lusuo
// @version      1.0
// @description  "Remove the webpage's copy restrictions, and disable the right-click and text selection restrictions."
// @author       Joanne
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523828/Forcefully%20remove%20webpage%20copy%20restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/523828/Forcefully%20remove%20webpage%20copy%20restrictions.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // 解锁右键菜单
    document.addEventListener('contextmenu', function (e) {
        e.stopPropagation();
    }, true);
 
    // 解锁复制功能
    document.addEventListener('copy', function (e) {
        e.stopPropagation();
    }, true);
 
    // 解锁选择文本功能
    document.addEventListener('selectstart', function (e) {
        e.stopPropagation();
    }, true);
 
    // 遍历所有元素，移除相关属性
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.removeAttribute('oncopy');
        el.removeAttribute('onpaste');
        el.removeAttribute('oncut');
        el.removeAttribute('oncontextmenu');
        el.removeAttribute('onselectstart');
        el.removeAttribute('onmousedown');
    });
 
    // 设置样式来解除选择限制
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);
 
    console.log('脚本已运行：解除网页复制限制成功！');
})();