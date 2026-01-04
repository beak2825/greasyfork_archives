// ==UserScript==
// @name         Yan_小米折價券搶券程式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yan
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374038/Yan_%E5%B0%8F%E7%B1%B3%E6%8A%98%E5%83%B9%E5%88%B8%E6%90%B6%E5%88%B8%E7%A8%8B%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/374038/Yan_%E5%B0%8F%E7%B1%B3%E6%8A%98%E5%83%B9%E5%88%B8%E6%90%B6%E5%88%B8%E7%A8%8B%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert = function() {};
    window.addEventListener('load', function() {
    $(".J_couponArea").removeAttr("disabled");
    }, false);

    $( ".J_couponBtn" ).click(function() {
        $(".J_couponArea").removeAttr("disabled");
    });

})();