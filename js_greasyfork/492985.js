// ==UserScript==
// @name         Modify Booking Date and Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify booking date and time in HTML element
// @author       You
// @match        https://airrsv.net/villagekyoto/calendar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492985/Modify%20Booking%20Date%20and%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/492985/Modify%20Booking%20Date%20and%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 將日期和時間設置為所需值
    var newDate = "5/25";
    var newTime = "09:30";

    // 找到HTML元素
    var dataLinkBox = document.querySelector('.dataLinkBox');

    // 更新日期和時間
    if(dataLinkBox) {
        // 找到日期元素並更新
        var dataTitleElements = dataLinkBox.querySelectorAll('.dataTitle');
        if(dataTitleElements.length > 0) {
            for(var i = 0; i < dataTitleElements.length; i++) {
                dataTitleElements[i].innerText = '【' + newDate + '～' + newTime + '】京都予約';
            }
        }

        // 找到時間元素並更新
        var dataFromTimeElements = dataLinkBox.querySelectorAll('.dataFromTime span');
        if(dataFromTimeElements.length > 0) {
            for(var j = 0; j < dataFromTimeElements.length; j++) {
                dataFromTimeElements[j].innerText = newTime;
            }
        }
    }
})();