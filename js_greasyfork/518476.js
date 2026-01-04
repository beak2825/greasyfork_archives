// ==UserScript==
// @name         yoasobi
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       You
// @match        https://ticketplus.com.tw/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ticketplus.com.tw
// @grant        none
// @license      MIT
// @description  zh-tw
// @downloadURL https://update.greasyfork.org/scripts/518476/yoasobi.user.js
// @updateURL https://update.greasyfork.org/scripts/518476/yoasobi.meta.js
// ==/UserScript==

(function() {
    'use strict';
let intervalId = null; // 用於儲存 setInterval 的 ID，方便停止
let isProcessing = false; // 標記是否正在處理中，避免重複啟動

    function processHeaders() {
        if (isProcessing) {
            console.log('已經在處理中，請勿重複啟動');
            return;
        }
        isProcessing = true; // 標記為正在處理
        console.log('流程啟動');

        intervalId = setInterval(function () {
            const headers = Array.from(document.querySelectorAll('div.v-expansion-panel-content .v-expansion-panel-header'));

            console.log(headers)
            if (headers.length > 0) {
                let currentIndex = 3; // 用於追蹤當前處理的元素
                clearInterval(intervalId); // 暫停 interval，避免重疊執行

                function clickNextHeader() {
                    if (currentIndex >= headers.length) {
                        console.log('已處理所有面板');
                        isProcessing = false; // 標記為處理完成
                        processHeaders();
                        return;
                    }

                    const header = headers[currentIndex];
                    header.click(); // 點擊當前 header
                    let deleay = 10
                    setTimeout(async () => {
                        const parent = header.parentElement;
                        const closestDiv = parent.querySelector('div.v-expansion-panel-content');
                        const hasDisabledText = closestDiv.querySelector('span.disabled-text') !== null;
                        const hasNineText = closestDiv.querySelector('span.font-weight-bold') !== null;
                        const hasCountText = closestDiv.querySelector('div.count-button') !== null;

                        if(hasNineText){
                            document.querySelector('button [data-v-56cb0484]').click();
                            await sleep(1000); // 添加 1 秒的延迟
                            clickNextHeader();
                        }else if (hasDisabledText ) {
                            console.log(`面板 ${currentIndex + 1} 有條件不符合，跳過`);
                            deleay = 10
                            currentIndex++; // 跳到下一個
                            clickNextHeader(); // 遞迴調用，處理下一個
                        } else if(hasCountText) {
                            console.log(`面板 ${currentIndex + 1} 無條件不符合，執行目標邏輯`);
                            isProcessing = false; // 標記為處理完成
                            step2(); // 執行目標函數
                        }
                    }, 1); // 延遲 10ms
                }

                clickNextHeader();
            } else {
                console.log('找不到符合條件的元素');
                isProcessing = false; // 標記為處理完成
            }
        }, 500); // 每 500 毫秒檢查一次
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function stopProcessing() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            isProcessing = false; // 標記為停止狀態
            console.log('流程已停止');
        } else {
            console.log('流程未在執行');
        }
    }

    // 監聽鍵盤按鍵
    document.addEventListener('keydown', function (event) {
        if (event.key === '5') { // 按數字鍵 5 啟動
            processHeaders();
        } else if (event.key === '6') { // 按數字鍵 6 停止
            stopProcessing();
        }
    });



     function step2(){
         const intervalId = setInterval(function() {
             // 選擇所有 .v-expansion-panel-content 並過濾出 display !== 'none' 的元素
             const firstVisiblePanel = document.querySelector('div.v-expansion-panel--active[aria-expanded="true"]:not(.v-expansion-panel--next-active)')

                 const button = firstVisiblePanel.querySelector('.light-primary-2 i.mdi-plus'); // 查找 .light-primary-2 的按
                 if (button) {
                     button.click(); // 如果需要，點擊按鈕
                     clearInterval(intervalId);
                     step3()
                 }

         }, 100); // 每秒執行一次
     }
    function step3(){
        const intervalId = setInterval(function() {
            const bt2 = document.querySelector('button.nextBtn'); // 查找 .light-primary-2 的按鈕
            if (bt2) {
                bt2.click(); // 如果需要，點擊按鈕
                clearInterval(intervalId);
            }
        }, 100); // 每秒執行一次
    }
    // Your code here...
})();