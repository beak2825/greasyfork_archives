// ==UserScript==
// @name         2019米粉10元
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Lin
// @match        *://event.mi.com/tw/mff2019/sales/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381319/2019%E7%B1%B3%E7%B2%8910%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/381319/2019%E7%B1%B3%E7%B2%8910%E5%85%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function correct_time(){
        var flag = false;
        var d = new Date();
        var hours = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        if((hours == 10 && min == 0) || ( hours == 9 && min == 59 && sec == 59) ||
           (hours == 12 && min == 0) || ( hours == 11 && min == 59 && sec == 59) ||
           (hours == 15 && min == 0) || ( hours == 14 && min == 59 && sec == 59) ||
           (hours == 18 && min == 0) || ( hours == 17 && min == 59 && sec == 59)){
            flag = true;
        }
        return flag
    }
    function checkForMoniDisplayChange () {
        $(".buy-now.J_flashBuyBtn").removeAttr("disabled");
        if(correct_time()){
            $(".buy-now.J_flashBuyBtn").click()
        }
    }
    window.setInterval (checkForMoniDisplayChange, 0.1);

})();