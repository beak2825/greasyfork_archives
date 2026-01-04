// ==UserScript==
// @name         小米打開折價券按鈕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2021/newfestival
// @include      https://event.mi.com/tw/sales2020/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/420592/%E5%B0%8F%E7%B1%B3%E6%89%93%E9%96%8B%E6%8A%98%E5%83%B9%E5%88%B8%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420592/%E5%B0%8F%E7%B1%B3%E6%89%93%E9%96%8B%E6%8A%98%E5%83%B9%E5%88%B8%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        $('.J_couponArea[data-coupon-id="1698"]').removeAttr("aria-disabled");
}
window.setInterval (checkForMoniDisplayChange, 50);
alert ={}

})();
