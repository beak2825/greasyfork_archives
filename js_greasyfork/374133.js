// ==UserScript==
// @name         小米搶特價11_18點整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374133/%E5%B0%8F%E7%B1%B3%E6%90%B6%E7%89%B9%E5%83%B911_18%E9%BB%9E%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/374133/%E5%B0%8F%E7%B1%B3%E6%90%B6%E7%89%B9%E5%83%B911_18%E9%BB%9E%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        $(".J_flashBuyBtn").removeAttr("disabled");
        location.href = "https://buy.mi.com/tw/cart/add/3181700050";
        location.href = "https://buy.mi.com/tw/cart/add/3171900009";
        //https://buy.mi.com/tw/cart/add/3180200002
    }, false);

    //$(".J_couponArea").click();
})();