
// ==UserScript==
// @name         2019 小米自動搶折價卷
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  2019 500強 九年青春 始終熱血
// @author       You
// @match        https://event.mi.com/tw/sales2019/global500
// @include      https://event.mi.com/tw/sales2019/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/387770/2019%20%E5%B0%8F%E7%B1%B3%E8%87%AA%E5%8B%95%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/387770/2019%20%E5%B0%8F%E7%B1%B3%E8%87%AA%E5%8B%95%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
    //$(".coupon-area J_couponArea").removeAttr("disabled");   
            $(".J_couponArea").click();   
    }
window.setInterval (checkForMoniDisplayChange, 100);
alert ={}

})();
