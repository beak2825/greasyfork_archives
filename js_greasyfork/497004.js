// ==UserScript==
// @name         WST_PTS_Textarea & Date Enhancer (TW Timezone)
// @namespace    https://pts.wistron.com/
// @version      2.01
// @description  Modify textarea rows & show dates using Taiwan timezone (UTC+8)
// @author       Jacky MK Hu
// @match        https://pts.wistron.com/~pts/subsystem/tss/web_pages/application/my_time_sheet.php*
// @grant        none
// @license      CC BY-ND 4.0; https://creativecommons.org/licenses/by-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/497004/WST_PTS_Textarea%20%20Date%20Enhancer%20%28TW%20Timezone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497004/WST_PTS_Textarea%20%20Date%20Enhancer%20%28TW%20Timezone%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /*** -------------------------------------------------------------
     *  PART A — Textarea 行數調整
     * -------------------------------------------------------------***/
    function modifyTextareas() {
        const targetIDs = ['modify_task_description', 'task_description'];
        targetIDs.forEach(id => {
            let textarea = document.getElementById(id);
            if (textarea && textarea.rows !== 10) {
                textarea.rows = 10;
            }
        });
    }

    /*** -------------------------------------------------------------
     *  PART B — OT 按鈕功能（可即時偵測動態載入）
     * -------------------------------------------------------------***/
    function addOTButtonToTextarea(textarea) {

        // Prevent duplicates
        if (!textarea || textarea.dataset.otAdded === "1") return;

        const otBtn = document.createElement("button");
        otBtn.textContent = "OT";
        otBtn.type = "button"; // Prevent form submit
        otBtn.style.marginBottom = "5px";
        otBtn.style.marginRight = "5px";

        textarea.parentNode.insertBefore(otBtn, textarea);

        // Button logic
        otBtn.addEventListener("click", () => {
            if (!textarea.value.startsWith("===OT===")) {
                textarea.value = "===OT===\n" + textarea.value;
            }
            textarea.scrollTop = 0;
        });

        textarea.dataset.otAdded = "1"; // Mark as handled
    }

    /*** -------------------------------------------------------------
     *  PART C — 台灣時區日期處理
     * -------------------------------------------------------------***/
    function parseTaiwanDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const utcMillis = Date.UTC(year, month - 1, day) + (8 * 60 * 60 * 1000);
        return new Date(utcMillis);
    }

    function formatDate(date) {
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `(${month}/${day})`;
    }

    function updateDates() {
        const dateRangeText = document.querySelector('table[style*="width: 500px"] td[style*="font-weight: bold"]');
        if (!dateRangeText) return;

        const dateRangeMatch = dateRangeText.innerText.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
        if (!dateRangeMatch) return;

        const startDate = parseTaiwanDate(dateRangeMatch[1]);
        const days = ['MON.', 'TUE.', 'WED.', 'THU.', 'FRI.', 'SAT.', 'SUN.'];

        // Update main tablesorter
        const headers = document.querySelectorAll('.tablesorter-headerRow .tablesorter-header-inner');
        let currentDate = new Date(startDate);
        headers.forEach(header => {
            if (days.includes(header.textContent.trim())) {
                header.textContent = header.textContent.split('(')[0].trim();
                header.textContent += formatDate(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        // Update Work hours table
        const workHoursTable = document.querySelector('table > tbody > tr > td > table > tbody');
        if (workHoursTable) {
            const workHoursHeaderRow = workHoursTable.querySelector('tr:first-child');
            if (workHoursHeaderRow) {
                const workHoursHeaders = workHoursHeaderRow.querySelectorAll('td');

                if (Array.from(workHoursHeaders).some(h => days.includes(h.textContent.trim().toUpperCase()))) {

                    // Reset weekday headers
                    workHoursHeaders.forEach(header => {
                        if (days.includes(header.textContent.trim().toUpperCase())) {
                            header.textContent = header.textContent.split('(')[0].trim();
                        }
                    });

                    let dateRow = workHoursHeaderRow.nextElementSibling;
                    const isDateRow = dateRow && dateRow.querySelector('td')?.textContent.startsWith('(');

                    currentDate = new Date(startDate);

                    observer.disconnect(); // Avoid loop

                    if (!isDateRow) {
                        const newDateRow = document.createElement('tr');
                        days.forEach(() => {
                            const td = document.createElement('td');
                            td.textContent = formatDate(currentDate);
                            newDateRow.appendChild(td);
                            currentDate.setDate(currentDate.getDate() + 1);
                        });
                        workHoursHeaderRow.insertAdjacentElement('afterend', newDateRow);
                    } else {
                        const dateCells = dateRow.querySelectorAll('td');
                        dateCells.forEach(cell => {
                            cell.textContent = formatDate(currentDate);
                            currentDate.setDate(currentDate.getDate() + 1);
                        });
                    }

                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }
        }
    }

    /*** -------------------------------------------------------------
     *  PART D — MutationObserver 統合監控
     * -------------------------------------------------------------***/
    const observer = new MutationObserver(() => {
        modifyTextareas();

        // Add OT button to both textareas if they exist
        addOTButtonToTextarea(document.getElementById("task_description"));
        addOTButtonToTextarea(document.getElementById("modify_task_description"));

        updateDates();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /*** ▶ 初始執行 ***/
    modifyTextareas();
    addOTButtonToTextarea(document.getElementById("task_description"));
    addOTButtonToTextarea(document.getElementById("modify_task_description"));
    updateDates();

})();
