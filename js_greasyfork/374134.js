// ==UserScript==
// @name         小米成立訂單
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://buy.mi.com/tw/buy/checkout
// @include      https://buy.mi.com/tw/buy/checkout*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374134/%E5%B0%8F%E7%B1%B3%E6%88%90%E7%AB%8B%E8%A8%82%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/374134/%E5%B0%8F%E7%B1%B3%E6%88%90%E7%AB%8B%E8%A8%82%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        //成立訂單
        $('#checkoutFormBtn').click();
}
window.setInterval (checkForMoniDisplayChange, 600);
alert ={}

})();