// ==UserScript==
// @name         强制解除网页复制限制
// @namespace    https://www.cnblogs.com/lusuo
// @version      1.1
// @description  去除网页的复制限制，解除右键和选择文本的限制。
// @author       Joanne
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523755/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523755/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
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
