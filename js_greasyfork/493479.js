// ==UserScript==
// @version      3.5
// @name         嗨皮漫畫 - 隱藏特定位置的 導覽列
// @name:zh-TW   嗨皮漫畫 - 隱藏特定位置的 導覽列
// @name:zh-CN   嗨皮漫畫 - 隱藏特定位置的 導覽列
// @name:en Happy Comics - Hide Specific Position AppBar
// @namespace    https://www.youtube.com/c/ScottDoha
// @description  隱藏除了頂部和底部以外的 導覽列
// @description:zh-cn 隱藏除了頂部和底部以外的 導覽列
// @description:en Hide AppBar except at the top and bottom of the page
// @author       Scott
// @match        *://m.happymh.com/reads/*
// @match        *://m.happymh.com/*
// @match        *://hihimanga.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493479/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E9%9A%B1%E8%97%8F%E7%89%B9%E5%AE%9A%E4%BD%8D%E7%BD%AE%E7%9A%84%20%E5%B0%8E%E8%A6%BD%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/493479/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E9%9A%B1%E8%97%8F%E7%89%B9%E5%AE%9A%E4%BD%8D%E7%BD%AE%E7%9A%84%20%E5%B0%8E%E8%A6%BD%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目標元素的選擇器
    var divSelector = "header.MuiAppBar-root.MuiAppBar-positionSticky.MuiAppBar-colorPrimary";
    let isVisible = true;

    // 在頁面中插入 CSS 動畫
    GM_addStyle(`
        .hidden {
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(-100%);
            pointer-events: none;
        }
        .visible {
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 1;
            transform: translateY(0);
        }
    `);

    function toggleVisibility(element) {
        if (!element) return;

        var currentScroll = window.pageYOffset;
        if (currentScroll > 0 && isVisible) {
            element.classList.remove('visible');
            element.classList.add('hidden');
            isVisible = false;
        } else if (currentScroll === 0 && !isVisible) {
            element.classList.remove('hidden');
            element.classList.add('visible');
            isVisible = true;
        }
    }

    // 監控 DOM 變化
    var observer = new MutationObserver(() => {
        var targetElement = document.querySelector(divSelector);
        if (targetElement) {
            observer.disconnect(); // 找到目標後停止觀察
            // 默認給目標元素新增可見類
            targetElement.classList.add('visible');
            // 監聽滾動事件
            window.addEventListener('scroll', () => toggleVisibility(targetElement));
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();