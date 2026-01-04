// ==UserScript==
// @name         2018小米搶折價卷
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374078/2018%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/374078/2018%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function correct_time(){
    var flag = false;
	var d = new Date();
    var hours = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if((hours == 20 && min <=1) || ( hours == 19 && min == 59 && sec == 59)||
      (hours == 16 && min <=1) || ( hours == 15 && min == 59 && sec == 59)||
      (hours == 18 && min <=1) || ( hours == 17 && min == 59 && sec == 59)){
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
window.setInterval (checkForMoniDisplayChange, 1);
alert ={}

})();