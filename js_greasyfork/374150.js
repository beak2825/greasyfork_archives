
// ==UserScript==
// @name         小米定時自動搶折價卷
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  2018雙十一自動搶折價卷
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374150/%E5%B0%8F%E7%B1%B3%E5%AE%9A%E6%99%82%E8%87%AA%E5%8B%95%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/374150/%E5%B0%8F%E7%B1%B3%E5%AE%9A%E6%99%82%E8%87%AA%E5%8B%95%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function correct_time(){
    var flag = false;
	var d = new Date();
    var hours = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if((hours == 12&& min <=1) || ( hours == 11 && min == 59 && sec == 59)){
        flag = true;
    } else if ((hours == 14&& min <=1) || ( hours == 13 && min == 59 && sec == 59) ){
       flag = true;
   }  else if ((hours == 16&& min <=1) || ( hours == 15 && min == 59 && sec == 59) ){
       flag = true;
   } else if ((hours == 18&& min <=1) || ( hours == 17 && min == 59 && sec == 59) ){
       flag = true;
   } else if ((hours == 20&& min <=1) || ( hours == 19 && min == 59 && sec == 59) ){
       flag = true;
   } else if ((hours == 22&& min <=1) || ( hours == 21 && min == 59 && sec == 59) ){
       flag = true;
   }
    return flag
    }
    function checkForMoniDisplayChange () {
    $(".J_couponArea").removeAttr("disabled");
        if(correct_time()){
            $(".J_couponArea").click();
        }
    }
window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();
