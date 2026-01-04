// ==UserScript==
// @name         移除联合早报zaobao.com内容顺序干扰
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  修复联合早报网页段落顺序被打乱的问题。请用中国ip访问 联合早报 zaobao.com 以得到完整内容。
// @author       ChatGPT
// @license MIT
// @match        *://*.zaobao.com/*
// @match        *://*.zaobao.com.sg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537774/%E7%A7%BB%E9%99%A4%E8%81%94%E5%90%88%E6%97%A9%E6%8A%A5zaobaocom%E5%86%85%E5%AE%B9%E9%A1%BA%E5%BA%8F%E5%B9%B2%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537774/%E7%A7%BB%E9%99%A4%E8%81%94%E5%90%88%E6%97%A9%E6%8A%A5zaobaocom%E5%86%85%E5%AE%B9%E9%A1%BA%E5%BA%8F%E5%B9%B2%E6%89%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortAndRestore() {
        const container = document.querySelector('.article-body');
        if (!container) return;

        const elements = Array.from(container.querySelectorAll('[data-s]'));

        const withOrder = elements.map(el => {
            const orderStyle = window.getComputedStyle(el).order || 0;
            const orderAttr = el.getAttribute('style')?.match(/order\s*:\s*(-?\d+)/);
            const order = orderAttr ? parseInt(orderAttr[1]) : parseInt(orderStyle) || 0;
            return {el, order};
        });

        // 移除原始 order 样式
        withOrder.forEach(item => {
            item.el.style.order = '';
            item.el.removeAttribute('style');
        });

        // 按照 order 排序
        withOrder.sort((a, b) => a.order - b.order);

        // 清空并重插入排序后的内容
        container.innerHTML = '';
        withOrder.forEach(item => container.appendChild(item.el));
    }

    // 等页面加载完后执行
    window.addEventListener('load', () => {
        setTimeout(sortAndRestore, 1000);
    });
})();
