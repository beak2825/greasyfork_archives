// ==UserScript==
// @name         小米搶折價卷
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/mff2021/sales
// @include      https://event.mi.com/tw/sales2020/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415583/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/415583/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7.meta.js
// ==/UserScript==

//僅打開按鈕
(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        $(".J_couponArea").removeAttr("aria-disabled");
}
window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();