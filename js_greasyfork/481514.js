// ==UserScript==
// @name         91pu 廣告移除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove specified HTML elements on 91pu.com.tw automatically
// @author       YC
// @match        https://www.91pu.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481514/91pu%20%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/481514/91pu%20%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待文檔完全加載後執行
    window.addEventListener('load', function() {
        // 在文檔完全加載後，刪除 id 為 viptoneWindow 的元素
        var viptoneWindow = document.getElementById('viptoneWindow');

        // 檢查元素是否存在，並刪除
        if (viptoneWindow) {
            viptoneWindow.parentNode.removeChild(viptoneWindow);
        }

        // 等待2秒後執行
        setTimeout(function() {
            // 同時刪除指定的 <div> 元素
            var additionalDivElement1 = document.querySelector('div[style="padding-top: 15px;margin: 0 auto;"]');
            if (additionalDivElement1) {
                additionalDivElement1.parentNode.removeChild(additionalDivElement1);
            }

            // 同時刪除指定的 <div> 元素
            var additionalDivElement2 = document.querySelector('div[style="display: flex; justify-content: space-around; padding-top: 10px; padding-bottom: 10px;"]');
            if (additionalDivElement2) {
                additionalDivElement2.parentNode.removeChild(additionalDivElement2);

                // 同時刪除指定的 <div> 元素
                var adGeekDiv = document.querySelector('div[id="adGeek-slot-div-gpt-ad-1624530373449-0"]');
                if (adGeekDiv) {
                    adGeekDiv.parentNode.removeChild(adGeekDiv);
                }
            }

            // 等待3秒後執行
            setTimeout(function() {
                // 選擇並刪除指定的 <ins> 元素
                var insElement = document.querySelector('ins.adsbygoogle.adsbygoogle-noablate[data-adsbygoogle-status="done"]');
                if (insElement) {
                    insElement.outerHTML = '';
                }
            }, 3000); // 3秒後執行
        }, 2000); // 2秒後執行
    });
})();
