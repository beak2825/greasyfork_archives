// ==UserScript==
// @name         BOBO米
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       bossrush
// @match        https://event.mi.com/tw/double-11-2020/supersales
// @include      https://event.mi.com/tw/double-11-2020/*
// @grant        none
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/415860/BOBO%E7%B1%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/415860/BOBO%E7%B1%B3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        $(".J_couponArea[data-coupon-id=1618]").removeAttr("aria-disabled").click();
        $(".J_couponArea[data-coupon-id=1616]").removeAttr("aria-disabled").click();
        $(".J_couponArea[data-coupon-id=1617]").removeAttr("aria-disabled").click();
    }

window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();