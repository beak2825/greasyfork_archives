// ==UserScript==
// @name         WST_Eye_FC2_CountUp_Fixer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Update countUp dynamically for blocks with 00:00:00 initial value.
// @author       Jacky
// @match        http://10.38.250.158/*
// @match        http://10.38.250.159/*
// @match        http://10.38.250.172/*
// @match        http://10.38.250.184/*
// @match        http://10.38.248.180/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518284/WST_Eye_FC2_CountUp_Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/518284/WST_Eye_FC2_CountUp_Fixer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 保存需要持續更新的區塊
    const blocksToUpdate = new Set();

    // Function to calculate and update the elapsed time for each countUp element
    function updateAllCountUps() {
        // 選取所有包含計時器的區塊
        const blocks = document.querySelectorAll('.list-group-item.node-uut');

        blocks.forEach(block => {
            // 找到當前區塊內的 `countUp` 元素
            const countUpElement = block.querySelector('.countUp');

            // 若初始值為 `00:00:00`，加入持續更新列表
            if (countUpElement && countUpElement.textContent.trim() === "00:00:00") {
                blocksToUpdate.add(block);
            }
        });

        // 更新持續更新列表中的區塊
        blocksToUpdate.forEach(block => {
            const errorHints = block.parentElement.querySelectorAll('.error_hint');
            const countUpElement = block.querySelector('.countUp');

            if (!errorHints || errorHints.length === 0 || !countUpElement) {
                console.warn("Missing .error_hint or .countUp element in block:", block);
                blocksToUpdate.delete(block); // 移除無效的區塊
                return;
            }

            // 選取正確的 `error_hint`（通常是最後一個區塊的 hint_StartTime）
            const targetErrorHint = errorHints[errorHints.length - 1];
            const hintStartTime = targetErrorHint.querySelector('.hint_StartTime');

            if (!hintStartTime) {
                console.warn("No .hint_StartTime found in error_hint for block:", block);
                blocksToUpdate.delete(block); // 移除無效的區塊
                return;
            }

            // 取得 `.hint_StartTime` 的值
            const startTimeValue = hintStartTime.textContent.trim();
            const startTime = new Date(startTimeValue);

            if (isNaN(startTime.getTime())) {
                console.error("Invalid StartTime value:", startTimeValue);
                countUpElement.textContent = "Invalid StartTime";
                blocksToUpdate.delete(block); // 移除無效的區塊
                return;
            }

            // 計算現在時間與 StartTime 的差距（毫秒）
            const now = new Date();
            const elapsedMilliseconds = now - startTime;

            if (elapsedMilliseconds < 0) {
                console.warn("StartTime is in the future:", startTimeValue);
                countUpElement.textContent = "00:00:00"; // 預設值
                return;
            }

            // 計算經過的時間（以秒為單位）
            const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
            const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

            // 更新 countUp 的內容
            countUpElement.textContent = `${hours}:${minutes}:${seconds}`;
        });
    }

    // 每秒執行一次更新函式
    setInterval(updateAllCountUps, 1000);

    // 立即執行一次以初始化
    updateAllCountUps();
})();
