// ==UserScript==
// @name         step1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自動點擊立即訂購按鈕，並處理其他購票相關點擊事件。
// @author       你
// @match        https://tixcraft.com/activity/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517302/step1.user.js
// @updateURL https://update.greasyfork.org/scripts/517302/step1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let orderIndex = 0; // 0 表示搶第一天，可以根據需求修改這個值

          const buyLink = document.querySelector(".buy a");
        if (buyLink) {
            buyLink.click();
            console.log(".buy 內的 <a> 連結已被點擊");
        }

       const orderButton = Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.includes('立即訂購') );

       //[0] 設定搶第一天
        if (orderButton) {
            orderButton[orderIndex].click();
            console.log("立即訂購按鈕已被點擊");
            clearInterval(intervalId); // 點擊後停止定時器
        }

    // 每秒檢查一次頁面上的 "立即訂購" 按鈕和其他購票按鈕
    const intervalId = setInterval(function() {
        // 查找包含 "立即訂購" 且不包含 "選購一空" 的按鈕
     const orderButton = Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.includes('立即訂購') );

        if (orderButton) {
            orderButton[orderIndex].click();
            clearInterval(intervalId); // 點擊後停止定時器
        }

        // 查找 .buy 內的 <a> 連結並點擊
        const buyLink = document.querySelector(".buy a");
        if (buyLink) {
            buyLink.click();
        }
    }, 1000); // 每秒執行一次
})();
