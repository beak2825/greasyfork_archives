// ==UserScript==
// @name         小米搶500券
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Hello world!
// @author       H
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374207/%E5%B0%8F%E7%B1%B3%E6%90%B6500%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/374207/%E5%B0%8F%E7%B1%B3%E6%90%B6500%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {

        $(".J_couponArea[data-coupon-id=898]").removeAttr("disabled");
        $(".J_couponArea[data-coupon-id=898]").click();
}

window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();