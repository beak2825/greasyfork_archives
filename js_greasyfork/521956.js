// ==UserScript==
// @name         ISBN自動選擇申請書名
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動將查詢欄位設置為 "申請書名"
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=Step2
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521956/ISBN%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E7%94%B3%E8%AB%8B%E6%9B%B8%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/521956/ISBN%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E7%94%B3%E8%AB%8B%E6%9B%B8%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 設定最大重試次數和重試間隔
    const MAX_RETRY = 10;
    const RETRY_INTERVAL = 500; // 每次重試間隔 500ms

    let retryCount = 0;

    // 使用 setInterval 進行重複檢查
    const intervalId = setInterval(() => {
        const queryFieldSelect = document.getElementById('FO_查詢欄位');

        if (queryFieldSelect) {
            queryFieldSelect.value = 'Title';
            console.log("已自動選擇申請書名");
            clearInterval(intervalId); // 找到目標元素後停止重試
        } else {
            retryCount++;
            if (retryCount >= MAX_RETRY) {
                console.log("未能找到查詢欄位元素，重試次數已達上限");
                clearInterval(intervalId); // 達到最大重試次數後停止
            }
        }
    }, RETRY_INTERVAL);
})();
