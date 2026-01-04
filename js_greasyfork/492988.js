// ==UserScript==
// @name         Click Element Five Times After Page Load
// @namespace    http://yourwebsite.com/
// @version      0.1
// @description  Clicks a specific element five times after the page has loaded completely.
// @author       Your Name
// @match        http://*/*
// @match        https://*/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492988/Click%20Element%20Five%20Times%20After%20Page%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/492988/Click%20Element%20Five%20Times%20After%20Page%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定點擊次數
    var clicks = 5;

    // 等待網頁完全加載
    window.addEventListener('load', function() {
        // 獲取元素
        var element = document.querySelector('.ctlListItem.listNext');

        // 如果找到元素
        if (element) {
            // 循環點擊元素
            for (var i = 0; i < clicks; i++) {
                // 模擬點擊
                element.click();
            }
        } else {
            console.error('找不到指定的元素');
        }
    });
})();