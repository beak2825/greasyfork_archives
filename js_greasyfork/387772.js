// ==UserScript==
// @name         2019 小米test
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  2019 
// @author       You
// @match        https://event.mi.com/tw/sales2019/global500
// @include      https://event.mi.com/tw/sales2019/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/387772/2019%20%E5%B0%8F%E7%B1%B3test.user.js
// @updateURL https://update.greasyfork.org/scripts/387772/2019%20%E5%B0%8F%E7%B1%B3test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
  
            $(".bottom-info").get(0).click();   
    }
window.setInterval (checkForMoniDisplayChange, 1000);
alert ={}

})();