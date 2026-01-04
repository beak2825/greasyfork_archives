// ==UserScript==
// @name         小米11元
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  try
// @author       GMA
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374042/%E5%B0%8F%E7%B1%B311%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/374042/%E5%B0%8F%E7%B1%B311%E5%85%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function _do () {
        $('.J_flashBuyBtn[data-gid="4183200024"]').removeAttr("disabled");
        $('.J_flashBuyBtn[data-gid="4183200024"]').click();

        $('.J_couponArea[data-coupon-id="898"]').removeAttr("disabled");
        $('.J_couponArea[data-coupon-id="898"]').click();

    }
    window.setInterval (_do, 200);
    alert = {}

})();