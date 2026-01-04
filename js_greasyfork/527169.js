// ==UserScript==
// @name         [WST] FusionEye Auto-Calculated Elapsed Test Time
// @namespace    http://tampermonkey.net/
// @version      1.98
// @description  Elapsed Test Time will show on search page at each EDDH00 FusionEye Web.
// @author       aa2468291
// @match        http://10.38.250.180/search/*
// @match        http://10.38.248.180/search/*
// @match        http://10.38.250.184/search/*
// @match        http://10.48.161.130/search/*
// @match        http://10.38.247.180/search/*
// @match        http://10.121.186.180/search/*
// @match        http://10.28.158.180/search/*
// @match        http://10.28.156.180/search/*
// @grant        none
// @run-at       document-end
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/527169/%5BWST%5D%20FusionEye%20Auto-Calculated%20Elapsed%20Test%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/527169/%5BWST%5D%20FusionEye%20Auto-Calculated%20Elapsed%20Test%20Time.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function updateTimeDifference() {
        console.log("🔄 更新時間相差欄位...");
        $("#search_table tbody tr").each(function () {
            let timeCells = $(this).find("td.dt-type-date");

            if (timeCells.length === 2) {  // 確保有 Start Time 和 End Time
                const startTime = new Date(timeCells.eq(0).text().trim());
                const endTime = new Date(timeCells.eq(1).text().trim());

                let durationText = "";
                if (!isNaN(startTime) && !isNaN(endTime)) {
                    const diffMs = Math.abs(endTime - startTime);
                    const diffSeconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(diffSeconds / 60);
                    const seconds = diffSeconds % 60;

                    // **確保分鐘 & 秒數都是 2 位數，補 0**
                    const formattedMinutes = String(minutes).padStart(2, '0');
                    const formattedSeconds = String(seconds).padStart(2, '0');

                    // **確保 `Duration` 佔固定長度**
                    durationText = `[Duration: ${formattedMinutes}m ${formattedSeconds}s] `;
                }

                // **確保 `End Time` 內容不會變動**
                let endTimeText = timeCells.eq(1).text().trim().replace(/\[Duration:.*?\]\s*/g, ""); // 移除舊的 Duration
                if (!timeCells.eq(1).text().includes("Duration")) {  // **避免重複插入**
                    timeCells.eq(1).html(`${durationText}${endTimeText}`);
                }
            }
        });
    }

    function waitForDataTable() {
        if (typeof $.fn.DataTable === 'undefined') {
            console.log("⌛ DataTables 尚未載入，等待中...");
            setTimeout(waitForDataTable, 500);
        } else {
            console.log("🚀 DataTables 已載入，啟動 Duration 更新...");

            let table = $('#search_table').DataTable();

            // **監聽 DataTables `init.dt` 事件，確保第一次載入時 `Duration` 顯示**
            table.on('init.dt', function () {
                console.log("✅ DataTables 初始化 (`init.dt` 事件觸發)");
                setTimeout(updateTimeDifference, 500);  // **延遲 500ms，確保數據已載入**
            });

            // **監聽 DataTables `draw.dt` 事件，確保換頁時 `Duration` 不會消失**
            table.on('draw.dt', function () {
                console.log("🔄 DataTables 重新繪製 (`draw.dt` 事件觸發)");
                setTimeout(updateTimeDifference, 300);
            });

            // **確保 `Duration` 只執行一次，不會反覆插入**
            setTimeout(updateTimeDifference, 1000);
        }
    }

    waitForDataTable();
})();
