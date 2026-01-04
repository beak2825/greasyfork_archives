// ==UserScript==
// @name         Parking
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  for Parking car
// @author       You
// @match        https://api.rtd.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rtd.com.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523890/Parking.user.js
// @updateURL https://update.greasyfork.org/scripts/523890/Parking.meta.js
// ==/UserScript==

// 自動點擊單一按鈕 (type="submit")
function autoClickSingleButton() {
    const button = document.querySelector('button[type="submit"]'); // 选择提交按钮
    if (button) {
        button.click(); // 觸發按鈕的點擊事件
    }
}

// 自動點擊多個按鈕 (class="swal2-confirm")
function autoClickMultipleButtons() {
    // 選擇所有符合條件的按鈕
    const buttons = document.querySelectorAll('button.swal2-confirm');
    // 逐一觸發點擊事件
    buttons.forEach(button => button.click());
}

// 主程序：執行按鈕點擊並呼叫 completion
function main() {
    // 自動點擊單一按鈕
    autoClickSingleButton();

    // 設置延遲後自動點擊多個按鈕
    setTimeout(autoClickMultipleButtons, 1000);

    // 呼叫 completion，假設 `result` 是預定的結果資料
    const result = "按鈕點擊完成"; // 替換為實際資料
    completion(result);
}

// 設置延遲時間執行主程序
setInterval(main, 3300000);