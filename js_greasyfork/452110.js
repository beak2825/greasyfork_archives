// ==UserScript==
// @name         anime1換頁置頂
// @name:zh-CN   anime1换页置顶
// @name:zh-TW   anime1換頁置頂
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  上一頁，下一頁時自動置頂
// @description:zh-cn anime1换页置顶.
// @description:zh-tw anime1換頁置頂.
// @license MIT
// @author       fydra
// @match        https://anime1.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime1.me
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452110/anime1%E6%8F%9B%E9%A0%81%E7%BD%AE%E9%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/452110/anime1%E6%8F%9B%E9%A0%81%E7%BD%AE%E9%A0%82.meta.js
// ==/UserScript==
(function() {
    'use strict';


    $(document).ready(function(event) {
        $("#table-list_next").click(function() { //偵測下一頁按鈕
            document.documentElement.scrollTop = 0; //置頂
            console.log('下一頁');
        });

         $("#table-list_previous").click(function() { //偵測上一頁按鈕
            document.documentElement.scrollTop = 0; //置頂
             console.log('上一頁');
        });

    });

       $(document).click(function(event) {
        $("#table-list_next").click(function() { //偵測下一頁按鈕
            document.documentElement.scrollTop = 0; //置頂
            console.log('下一頁');
        });

         $("#table-list_previous").click(function() { //偵測上一頁按鈕
            document.documentElement.scrollTop = 0; //置頂
             console.log('上一頁');
        });

    });






})();

