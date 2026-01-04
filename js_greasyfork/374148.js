// ==UserScript==
// @name         2018小米搶電鍋
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  2018雙十一自動搶折價卷
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374148/2018%E5%B0%8F%E7%B1%B3%E6%90%B6%E9%9B%BB%E9%8D%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374148/2018%E5%B0%8F%E7%B1%B3%E6%90%B6%E9%9B%BB%E9%8D%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function correct_time(){
    var flag = false;
	var d = new Date();
    var hours = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if((hours == 12 && min <=2) || ( hours == 11 && min == 59 && sec == 59)){
        flag = true;
    }
    return flag
    }
    function checkForMoniDisplayChange () {
    $(".buy-now .J_cmsBuyBtn").removeAttr("disabled");
       //if(correct_time()){
            $(".buy-now .J_cmsBuyBtn").click();
       // }
    }
window.setInterval (checkForMoniDisplayChange, 10);
//alert ={}

})();