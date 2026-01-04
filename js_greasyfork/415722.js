// ==UserScript==

// @name 小米2020
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description XS.Shop and learn.201811
// @author Foris
// @match https://event.mi.com/tw/double-11-2020/supersales
// @include https://event.mi.com/tw/double-11-2020/*
// @grant none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415722/%E5%B0%8F%E7%B1%B32020.user.js
// @updateURL https://update.greasyfork.org/scripts/415722/%E5%B0%8F%E7%B1%B32020.meta.js
// ==/UserScript==

var $ = window.jQuery;
(function () {
    'use strict';
    function checkForMoniDisplayChange() {

        $(".J_couponArea.coupon-area[data-coupon-id='1618']").css("background-color", "lightgreen")
        $(".J_couponArea.coupon-area[data-coupon-id='1617']").css("background-color", "lightgreen")
        $(".J_couponArea.coupon-area[data-coupon-id='1618']").attr("aria-disabled", "false");
        $(".J_couponArea.coupon-area[data-coupon-id='1617']").attr("aria-disabled", "false");
        $(".J_couponArea.coupon-area[data-coupon-id='1618']").click();

        $(".J_couponArea.coupon-area[data-coupon-id='1617']").click();
    }
    window.setInterval(checkForMoniDisplayChange, 200);
    //alert ={} /*幫你按鈕永遠打開*/

})();
