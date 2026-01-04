// ==UserScript==
// @name         拓元 step1 購買第幾天票
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license      MIT
// @description  自動點擊立即訂購按鈕，並處理其他購票相關點擊事件。
// @author       你
// @match        https://tixcraft.com/activity/detail/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520386/%E6%8B%93%E5%85%83%20step1%20%E8%B3%BC%E8%B2%B7%E7%AC%AC%E5%B9%BE%E5%A4%A9%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520386/%E6%8B%93%E5%85%83%20step1%20%E8%B3%BC%E8%B2%B7%E7%AC%AC%E5%B9%BE%E5%A4%A9%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var choseDay =0 //使否開啟選擇天數 0關閉/1開啟
    let day = 0; // 0 表示搶第一天，可以根據需求修改這個值
    let eventCount = 1; // 總共幾場

    localStorage.setItem('eventCount', JSON.stringify(eventCount));

    if(choseDay ==1){
        localStorage.setItem('day', JSON.stringify(day));
        localStorage.removeItem('urls');
    }else{
        localStorage.removeItem('urls');
        localStorage.removeItem('day');
    }
    const buyLink = document.querySelector(".buy a");
        if (buyLink) {
            buyLink.click();
            console.log(".buy 內的 <a> 連結已被點擊");
        }

    const orderButton = Array.from(document.querySelectorAll("button")).filter(btn => btn.textContent.includes('立即訂購'));
       //[0] 設定搶第一天
        if (orderButton.length >0) {
            if(choseDay==1){
            orderButton[day].click();
            }else{
                 orderButton[0].click();
            }
            console.log("立即訂購按鈕已被點擊");
            clearInterval(intervalId); // 點擊後停止定時器
        }

    // 每秒檢查一次頁面上的 "立即訂購" 按鈕和其他購票按鈕
    const intervalId = setInterval(function() {

        // 查找 .buy 內的 <a> 連結並點擊
        const buyLink = document.querySelector(".buy a");
        if (buyLink) {
            buyLink.click();
        }
        // 查找包含 "立即訂購" 且不包含 "選購一空" 的按鈕
        const orderButton = Array.from(document.querySelectorAll("button")).filter(btn => btn.textContent.includes('立即訂購'));

        if (orderButton.length >0) {
            if(choseDay==1){
            orderButton[day].click();
            }else{
                 orderButton[0].click();
            }
            clearInterval(intervalId); // 點擊後停止定時器
        }
    }, 100); // 每秒執行一次
})();
