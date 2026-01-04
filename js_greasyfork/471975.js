// ==UserScript==
// @name         Honeygain Auto Click
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Automatically collect daily bouns. Support by using referral link:https://r.honeygain.me/TIGER75692 referral code:TIGER75692
// @author       Tiger
// @match        https://dashboard.honeygain.com/
// @grant        none
// @run-at       document-end
// @license      AGPL license
// @downloadURL https://update.greasyfork.org/scripts/471975/Honeygain%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/471975/Honeygain%20Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const refreshInterval = Math.random() * (2 * 60 * 60 * 1000 - 60 * 60 * 1000) + 60 * 60 * 1000; // Random interval between 1 and 2 hours
    let luckyPotButtonClicked = false;

    function clickLuckyPotButton() {
        const buttons = document.querySelectorAll('button');

        buttons.forEach(button => {
            if (button.textContent.trim() === "Open Lucky Pot") {
                button.click();
                console.log("Clicked 'Open Lucky Pot' button.");
                luckyPotButtonClicked = true; // 設置為已點擊
                return; // 找到後退出循環
            }
        });

        if (!luckyPotButtonClicked) {
            return
            console.log("Button 'Open Lucky Pot' not found on this page.");
        }
    }
    // 主函數
    async function main() {
        setInterval(() => {
            location.reload();
        }, refreshInterval);

        // 持續檢查過濾按鈕和復選框
        const intervalId = setInterval(() => {
            if (!luckyPotButtonClicked) {
                clickLuckyPotButton();
            } else {
                clearInterval(intervalId); // 如果所有操作都已完成，停止檢查
                console.log('All actions completed.');

                // 返回指定的 URL
                window.location.href = 'https://dashboard.honeygain.com/';
            }
        }, 15000); // 每 15 秒檢查一次
    }

    // 啟動主函數
    main();
})();