// ==UserScript==
// @name         小米搶11物品
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Lin
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374195/%E5%B0%8F%E7%B1%B3%E6%90%B611%E7%89%A9%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/374195/%E5%B0%8F%E7%B1%B3%E6%90%B611%E7%89%A9%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function correct_time(){
        var flag = false;
        var d = new Date();
        var hours = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        if((hours == 12 && min <=1) || ( hours == 11 && min == 59 && sec == 59) ||
           (hours == 15 && min <=1) || ( hours == 14 && min == 59 && sec == 59) ||
           (hours == 18 && min <=1) || ( hours == 17 && min == 59 && sec == 59)){
            flag = true;
        }
        return flag
    }
    function checkForMoniDisplayChange () {
        $('.J_flashBuyBtn').removeAttr("disabled");
        if(correct_time()){
            $('.J_flashBuyBtn').click();
        }
    }
    window.setInterval (checkForMoniDisplayChange, 1);
    alert ={}

})();