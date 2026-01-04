// ==UserScript==
// @name         XTRF Pending Payment Calculator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A very basic script to calculate the sum of the pending uninvoiced payments! It uses Alt+Q keystroke on jobs or invoices page to calculate the page total.
// @author       Mustafa Cem Çakır
// @match        https://belugalinguistics.s.xtrf.eu/vendors/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xtrf.eu
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448480/XTRF%20Pending%20Payment%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/448480/XTRF%20Pending%20Payment%20Calculator.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function onAltQ() {
        var amounts = document.querySelectorAll('tr.ng-scope td:nth-child(3)');
        var total = 0.00;

        for (var i = 0; i < amounts.length; i++) {
            var text = amounts[i].textContent;
            var strip = text.trim();
            if (strip.includes("▸")) {
                continue; }
            var noeur = parseFloat(strip.replace(' EUR', ''));
            total = noeur + total;
        }
        alert("Page Total: " + Math.round((total) * 1e12) / 1e12 + " EUR");

    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey && evt.keyCode == 81) {
            onAltQ();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();