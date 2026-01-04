// ==UserScript==
// @name         3_Edit
// @namespace    http://tampermonkey.net/
// @version      1
// @description  修改元素
// @author       Your Name
// @match        https://gs.amazon.com.tw/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544253/3_Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/544253/3_Edit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 使用您最終確定的顏色，並預先生成所有 CSS 規則 ---
    const rainbowColors = ['#d78585', '#e6a779', '#e4d48a', '#8dbb9d', '#86a8d1', '#9897c8', '#c09cb9'];

    let dynamicStyles = '';
    rainbowColors.forEach((color, index) => {
        // 規則一：設定文字首字顏色 (不變)
        dynamicStyles += `
            .rainbow-wrapper-${index}::first-letter {
                color: ${color} !important;
            }
        `;
        // 【更新規則二】主導航底線：覆蓋 hover、open，以及新增的 current (當前頁面) 狀態
        dynamicStyles += `
            .nav-item-color-${index}.has-children-open::after,
            .nav-item-color-${index}.current::after,
            .nav-item-color-${index}:hover::after {
                background-color: ${color} !important;
            }
        `;
        // 【新增規則三】子選單左側垂直線：覆蓋 hover 狀態
        dynamicStyles += `
            .nav-item-color-${index} ul li a:hover::after {
                background-color: ${color} !important;
            }
        `;
    });
    // 一次性注入所有 CSS 規則
    GM_addStyle(dynamicStyles);


    // --- 2. 核心函式：包裹文字並賦予 class (不變) ---
    function wrapTextForStyling(linkElement, index) {
        if (linkElement.querySelector('[class^="rainbow-wrapper-"]')) return;
        const originalText = linkElement.textContent.trim();
        if (!originalText) return;

        const wrapperSpan = document.createElement('span');
        wrapperSpan.className = `rainbow-wrapper-${index}`;
        wrapperSpan.textContent = originalText;

        linkElement.innerHTML = '';
        linkElement.appendChild(wrapperSpan);
    }


    // --- 3. 主要執行邏輯 (不變) ---
    const applyRainbowEffect = () => {
        try {
            const mainNavItems = document.querySelectorAll('nav.nav-type-main > ul > li.has-children');
            if (mainNavItems.length === 0) return;

            mainNavItems.forEach((li, index) => {
                if (index >= rainbowColors.length) return;

                if (!li.classList.contains(`nav-item-color-${index}`)) {
                    li.classList.add(`nav-item-color-${index}`);
                }

                const mainLink = li.querySelector(':scope > a');
                if (mainLink) {
                    wrapTextForStyling(mainLink, index);
                }

                const subMenuLinks = li.querySelectorAll('ul li a');
                subMenuLinks.forEach(subLink => {
                    wrapTextForStyling(subLink, index);
                });
            });
        } catch (error) {
            console.error('Tampermonkey: 執行彩虹效果時出錯:', error);
        }
    };

    // --- 4. 使用 MutationObserver 持續監控 (不變) ---
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyRainbowEffect, 200);
    });

    const targetNode = document.body;
    if (targetNode) {
        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);
        applyRainbowEffect();
        console.log('Tampermonkey: 導航彩虹腳本 (全功能最終版) 已啟動。');
    }

})();