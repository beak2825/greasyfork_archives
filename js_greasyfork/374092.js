// ==UserScript==
// @name         Yan_小米搶特價商品(2)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Yan
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374092/Yan_%E5%B0%8F%E7%B1%B3%E6%90%B6%E7%89%B9%E5%83%B9%E5%95%86%E5%93%81%282%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374092/Yan_%E5%B0%8F%E7%B1%B3%E6%90%B6%E7%89%B9%E5%83%B9%E5%95%86%E5%93%81%282%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        $(".J_couponArea").removeAttr("disabled");
        $("a").removeAttr("disabled");
}

window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();