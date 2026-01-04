// ==UserScript==
// @name         数据酷客大数据综合实训平台解除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow copying text in specific section on specific website
// @author       Your Name
// @match        http://pm.cookdata.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498143/%E6%95%B0%E6%8D%AE%E9%85%B7%E5%AE%A2%E5%A4%A7%E6%95%B0%E6%8D%AE%E7%BB%BC%E5%90%88%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/498143/%E6%95%B0%E6%8D%AE%E9%85%B7%E5%AE%A2%E5%A4%A7%E6%95%B0%E6%8D%AE%E7%BB%BC%E5%90%88%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var leftPart = document.querySelector('.left-part');
    if (leftPart) {
        
        leftPart.addEventListener('copy', (e) => {
            e.stopPropagation();
        }, true);
        leftPart.addEventListener('cut', (e) => {
            e.stopPropagation();
        }, true);
        leftPart.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
        }, true);
        leftPart.addEventListener('selectstart', (e) => {
            e.stopPropagation();
        }, true);
        leftPart.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        }, true);

        // 移除可能的禁用CSS样式
        const styles = document.createElement('style');
        styles.innerHTML = `
            .left-part * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(styles);

        const eventTypes = ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown'];
        eventTypes.forEach((eventType) => {
            leftPart.addEventListener(eventType, (event) => {
                event.stopImmediatePropagation();
            }, true);
        });
    }

})();