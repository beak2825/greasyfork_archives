// ==UserScript==
// @name        YouTube通知回報工具
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/
// @grant       none
// @version     1.1
// @author      Artin Lin
// @license MIT
// @description 截圖通知欄變空白的畫面
// @downloadURL https://update.greasyfork.org/scripts/512419/YouTube%E9%80%9A%E7%9F%A5%E5%9B%9E%E5%A0%B1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/512419/YouTube%E9%80%9A%E7%9F%A5%E5%9B%9E%E5%A0%B1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function waitForButton(callback, maxAttempts = 10) {
    let attempts = 0;

    function checkButton() {
        const targetButton = document.querySelector('button#button[aria-label="通知"]');

        if (targetButton) {
            console.log('找到通知按鈕');
            callback(targetButton);
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`尋找按鈕中... 嘗試 ${attempts}/${maxAttempts}`);
                setTimeout(checkButton, 1000); // 每秒檢查一次
            } else {
                console.error('無法找到通知按鈕，已超過最大嘗試次數');
            }
        }
    }

    checkButton();
}

window.addEventListener('load', function() {
    // 等待頁面完全加載
    waitForButton(function(targetButton) {
        let hasClicked = false;

        window.addEventListener('blur', function() {
            if (window.location.hostname.includes('youtube.com') && !hasClicked) {
                targetButton.click();
                hasClicked = true;
                console.log('頁面失去焦點，已點擊通知按鈕');
            }
        });

        console.log('腳本已啟動，當YouTube頁面首次失去焦點時將觸發通知按鈕');
    });
});