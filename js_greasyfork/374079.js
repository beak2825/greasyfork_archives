// ==UserScript==
// @name         電子鍋
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to heat the world!
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374079/%E9%9B%BB%E5%AD%90%E9%8D%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374079/%E9%9B%BB%E5%AD%90%E9%8D%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function checkForMoniDisplayChange () {$(".buy-now J_flashBuyBtn").removeAttr("disabled");
}
window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();