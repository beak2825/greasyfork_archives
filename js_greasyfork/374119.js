// ==UserScript==
// @name         打開按鈕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374119/%E6%89%93%E9%96%8B%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374119/%E6%89%93%E9%96%8B%E6%8C%89%E9%88%95.meta.js
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