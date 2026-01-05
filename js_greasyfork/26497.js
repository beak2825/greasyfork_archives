// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.nativamc.com.ar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26497/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/26497/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var no = function(){
        $('#idPreviousSummaries').hide();
        $('#idAnualSummary').hide();
        $('#idEResumen').hide();
        $('#tablaMonthlyBill2').hide();
    };
    setInterval(no, 100);

    // Your code here...
})();