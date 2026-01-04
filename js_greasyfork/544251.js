// ==UserScript==
// @name         1_Add
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  新增元素
// @author       Your Name
// @match        https://gs.amazon.com.tw/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544251/1_Add.user.js
// @updateURL https://update.greasyfork.org/scripts/544251/1_Add.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 注入 CSS 樣式 ---
    GM_addStyle(`
        /* 從 Google Fonts 引入字體 */
        @import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap');

        /* **核心修正：將整個頂部橫條容器設為 Flexbox** */
        .pre-nav-background-desktop {
            display: flex !important;
            /* **不再使用 space-between，讓元素預設靠左對齊** */
            align-items: center !important;         /* 垂直置中 */
            padding-right: 1.5em !important;        /* 只保留右邊的間距即可 */
            box-sizing: border-box;
        }

        /* **為我們新增的日期資訊區塊設定獨立樣式** */
        .custom-top-bar-date-info {
            font-family: 'Huninn', sans-serif !important;
            font-size: 14px !important;
            color: #333333;
            white-space: nowrap;
            flex-shrink: 0;
            /* **關鍵技巧：自動左邊距會將此元素推到最右邊** */
            margin-left: auto !important;
            padding-left: 20px; /* 在日期和藍色橫幅之間增加一些間距 */
        }
    `);

    // --- 2. 日期時間計算函式 (與前版相同) ---

    const today = new Date();
    const year = today.getFullYear();

    function isLeapYear(year) { return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0); }
    function getDayOfYear(date) { const start = new Date(date.getFullYear(), 0, 0); const diff = date - start; const oneDay = 1000 * 60 * 60 * 24; return Math.floor(diff / oneDay); }
    function getWeekNumber(date) { return Math.ceil(getDayOfYear(date) / 7); }
    function getDaysUntilChristmas() { let christmas = new Date(year, 11, 25); if (today > christmas) { christmas.setFullYear(year + 1); } const oneDay = 1000 * 60 * 60 * 24; return Math.ceil((christmas - today) / oneDay); }
    function getDaysRemainingInYear() { const endOfYear = new Date(year, 11, 31); const oneDay = 1000 * 60 * 60 * 24; return Math.floor((endOfYear - today) / oneDay); }
    function getYearProgressPercentage() { const totalDays = isLeapYear(year) ? 366 : 365; const dayOfYear = getDayOfYear(today); const percentage = (dayOfYear / totalDays) * 100; return percentage.toFixed(2); }

    // --- 3. 組合資訊並附加到 "父層容器" ---

    function addDateInfoToTopBar() {
        const targetContainer = document.querySelector('.pre-nav-background-desktop');
        if (!targetContainer) { return; }
        if (targetContainer.querySelector('.custom-top-bar-date-info')) { return; }

        const dateString = `${year}年${today.getMonth() + 1}月${today.getDate()}日`;
        const weekString = `第 ${getWeekNumber(today)} 週`;
        const remainingString = `距離聖誕節還剩 ${getDaysRemainingInYear()} 天`;
        const progressString = `今年已過${getYearProgressPercentage()}%`;

        const finalString = [dateString, weekString, remainingString, progressString].join('   ||   ');

        const dateInfoDiv = document.createElement('div');
        dateInfoDiv.className = 'custom-top-bar-date-info';
        dateInfoDiv.textContent = finalString;
        targetContainer.appendChild(dateInfoDiv);
    }

    // --- 4. 執行腳本 ---
    const checkInterval = setInterval(() => {
        const targetElement = document.querySelector('.pre-nav-background-desktop');
        if (targetElement) {
            clearInterval(checkInterval);
            addDateInfoToTopBar();
        }
    }, 500);

})();