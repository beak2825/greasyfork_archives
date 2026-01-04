// ==UserScript==
// @name         Wistron Overtime Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Calculate the total overtime hours for each month and display on hover.
// @author       aa2468291
// @match        https://hr.wistron.com/psc/PRD/EMPLOYEE/HRMS/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL*ADMN_OVERTIME_APPLICATION*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/527236/Wistron%20Overtime%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/527236/Wistron%20Overtime%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.overtimeData = {}; 

    function calculateOvertime() { 
        console.log("開始計算加班時數...");
        window.overtimeData = {}; 

        let monthCells = document.querySelectorAll('td.ps_grid-cell.PAYMT_DT'); 
        let overtimeCells = document.querySelectorAll('.ps_grid-cell.PAY_OT .ps_box-value'); 

        console.log(`找到 ${monthCells.length} 個月份欄位`);
        console.log(`找到 ${overtimeCells.length} 個加班時數欄位`);

        if (monthCells.length === 0 || overtimeCells.length === 0) {
            console.warn("未找到任何月份或加班時數，請確認選擇器是否正確！");
            return;
        }

        monthCells.forEach((cell) => {
            let month = cell.innerText.trim(); 
            if (!month) {
                month = "Pending (Current Month)";
            }

            let row = cell.closest('tr');
            if (row && row.innerText.includes("已取消")) {
                console.log(`跳過已取消的加班申請: ${month}`);
                return;
            }

 
            let overtimeCell = row ? row.querySelector('.ps_grid-cell.PAY_OT .ps_box-value') : null;

            if (overtimeCell) {
                let overtimeText = overtimeCell.innerText.trim();
                let overtimeHours = parseFloat(overtimeText.replace('小時', '')) || 0;

                console.log(`月份: ${month}, 單筆加班: ${overtimeHours} 小時`);

                if (!window.overtimeData[month]) {
                    window.overtimeData[month] = 0;
                }

                window.overtimeData[month] += overtimeHours;

                // **綁定 hover 事件**
                cell.addEventListener("mouseenter", showTooltip);
                cell.addEventListener("mouseleave", hideTooltip);
            } else {
                console.warn(`找不到 ${month} 的加班時數欄位，請檢查 HTML 結構！`);
            }
        });

        console.log("當月加班時數統計:", window.overtimeData);
        console.table(window.overtimeData);
    }

    // **顯示 Tooltip**
    function showTooltip(event) {
        let month = event.target.innerText.trim();
        if (!month) {
            month = "Pending (Current Month)";
        }

        let totalOvertime = window.overtimeData[month] || 0;
        let tooltipText = `Month: ${month}\nTotal: ${totalOvertime} Hours`;

        let tooltip = document.createElement('div');
        tooltip.innerText = tooltipText;
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#000';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '9999';
        tooltip.style.fontSize = '14px';
        tooltip.style.whiteSpace = 'pre-line'; // 允許換行
        tooltip.style.top = `${event.target.getBoundingClientRect().top + window.scrollY - 30}px`;
        tooltip.style.left = `${event.target.getBoundingClientRect().left + window.scrollX}px`;
        tooltip.classList.add('overtime-tooltip');

        document.body.appendChild(tooltip);
    }

    // **隱藏 Tooltip**
    function hideTooltip() {
        document.querySelectorAll('.overtime-tooltip').forEach(el => el.remove());
    }

    // **強制初始運行一次**
    calculateOvertime();

    // **監聽 DOM 變化，應對動態載入**
    const observer = new MutationObserver(() => {
        console.log("檢測到 DOM 變化，重新計算加班時數...");
        calculateOvertime();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
