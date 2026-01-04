// ==UserScript==
// @name         oxlife - 廣告元素移除
// @namespace    https://www.facebook.com/airlife917339
// @version      1.0
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://oxlife.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392152/oxlife%20-%20%E5%BB%A3%E5%91%8A%E5%85%83%E7%B4%A0%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/392152/oxlife%20-%20%E5%BB%A3%E5%91%8A%E5%85%83%E7%B4%A0%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a = document.querySelector('div > article > a:first-child').parentNode.parentNode;
    var parrent_a = a.parentNode
    parrent_a.removeChild(a)

    var b = document.querySelector('panel b-a adblock adblock1').parentNode;
    var parrent_b = b.parentNode
    parrent_b.removeChild(b)

})();