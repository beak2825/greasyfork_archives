// ==UserScript==
// @name         Hami自動點選廣告腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LINE購物APP簽到gogo
// @author       fase
// @match        https://rewards.hamimall.com.tw/1
// @exclude      
// @exclude      
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idv.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466539/Hami%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8%E5%BB%A3%E5%91%8A%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466539/Hami%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8%E5%BB%A3%E5%91%8A%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==
 







// ==/UserScript==

(function() {
    'use strict';

    // 建立定時器，每隔一段時間檢查名額狀態
    var interval = setInterval(function() {
        checkQuota();
    }, 1000); // 1秒檢查一次

    // 檢查名額狀態的函數
    function checkQuota() {
        var quotaElement = document.querySelector('.points-count span');
        var failMessageElement = document.getElementById('failMessage');

        if (quotaElement) {
            var quota = parseInt(quotaElement.textContent);

            if (quota > 0) {
                // 名額大於0，自動點擊廣告
                var adElement = document.querySelector('[onclick="clickAd();"]');
                if (adElement) {
                    adElement.click();
                }
            } else {
                // 檢查是否是已完成任務或點數已發完
                if (failMessageElement) {
                    var message = failMessageElement.textContent;
                    if (message === '本日已完成任務') {
                        // 提示已完成任務
                        alert('本日已完成任務');
                    } else if (message === '本日點數已發完') {
                        // 重新執行檢查
                        clearInterval(interval);
                        interval = setInterval(function() {
                            checkQuota();
                        }, 1000);
                    }
                }
            }
        }
    }
})();
