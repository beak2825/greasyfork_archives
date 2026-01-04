// ==UserScript==
// @name 小米2020積分
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description XS.Shop and learn.201811
// @author Foris
// @match https://buy.mi.com/tw/user/points-center
// @include https://buy.mi.com/tw/user/points-center
// @grant none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415782/%E5%B0%8F%E7%B1%B32020%E7%A9%8D%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/415782/%E5%B0%8F%E7%B1%B32020%E7%A9%8D%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function checkForMoniDisplayChange() {
        $(".points-exchange-section__item:has(h2:contains(雙11積分-NT$500現金券)) button").removeClass('points-exchange-section__exchange--disable').addClass('points-exchange-section__exchange--enable');
        $(".points-exchange-section__item:has(h2:contains(雙11積分-NT$500現金券)) button").click();

    }
    window.setInterval(checkForMoniDisplayChange, 200);
    alert ={}

})();
