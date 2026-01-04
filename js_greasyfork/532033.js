// ==UserScript==
// @name         页面下拉刷新（稳重版）
// @namespace    https://example.com
// @version      1.4
// @description  页面顶部下拉自动刷新，防止误触，排除特定网站
// @match        *://*/*
// @exclude      https://greasyfork.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532033/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%EF%BC%88%E7%A8%B3%E9%87%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532033/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%EF%BC%88%E7%A8%B3%E9%87%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let startY = 0;
    let startX = 0;
    let triggered = false;
    const threshold = 160; // 触发距离更长
    const maxXOffset = 40; // 横向偏移限制，避免斜拉误触

    document.addEventListener('touchstart', e => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            triggered = false;
        }
    });

    document.addEventListener('touchmove', e => {
        if (triggered || window.scrollY > 0) return;

        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = currentY - startY;
        const deltaX = Math.abs(currentX - startX);

        if (deltaY > threshold && deltaX < maxXOffset) {
            triggered = true;
            location.reload();
        }
    });
})();