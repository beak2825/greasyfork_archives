// ==UserScript==
// @name         网页内容复制增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除网页复制限制，并可在复制时自动添加来源信息
// @author       AI助手
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543818/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543818/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解除复制限制
    function enableCopy() {
        document.body.oncopy = null;
        document.body.onselectstart = null;
        document.body.oncontextmenu = null;
        document.body.onpaste = null;

        // 移除可能阻止复制的CSS样式
        const style = document.createElement('style');
        style.id = '__tampermonkey_copy_style__';
        style.innerHTML = `
            body, * {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 复制时添加来源信息
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection();
        let clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const originalText = selection.toString();
        const pageTitle = document.title;
        const pageUrl = window.location.href;

        const newText = originalText + '\n\n--------------------\n来源：' + pageTitle + '\n链接：' + pageUrl;

        clipboardData.setData('text/plain', newText);
        e.preventDefault();
    });

    // 页面加载时立即解除复制限制
    enableCopy();

})();