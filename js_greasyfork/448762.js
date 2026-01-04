// ==UserScript==
// @name         Smartcat Pending Payment Calculator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A very basic script to calculate the sum of the pending uninvoiced payments! It uses Alt+Q keystroke on jobs or invoices page to calculate the page total.
// @author       You
// @match        *://smartcat.com/billing/*
// @match        *://*.smartcat.com/billing/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartcat.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448762/Smartcat%20Pending%20Payment%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/448762/Smartcat%20Pending%20Payment%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function onAltQ() {
        var amounts = document.querySelectorAll('div.freelancer-payments__block > div');
		var total = 0.00;
		var text = ""
        var split = ""

		for (var i = 0; i < amounts.length; i++) {
		text = amounts[i].textContent;
		if (text.includes("Paid") || text.includes("Invitation canceled") || text.includes("Marked as paid")) {
			continue; }
		split = text.split(" ");
		split = parseFloat(split[split.indexOf("Language") - 1]);
		total = total + parseFloat(split);
		}
		alert("Page Total: " + total.toFixed(2) + " USD")

    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey && evt.keyCode == 81) {
            onAltQ();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();