// ==UserScript==
// @name         Grundos.Cafe - Highlight Item Names On Hover
// @namespace    Gorix [Jawsch]
// @description  Highlights the item name in your shop and SDB when you hover over it for quick and easy copying
// @match        http*://www.grundos.cafe/market/*
// @match        http*://www.grundos.cafe/safetydeposit/*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/452160/GrundosCafe%20-%20Highlight%20Item%20Names%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/452160/GrundosCafe%20-%20Highlight%20Item%20Names%20On%20Hover.meta.js
// ==/UserScript==

[].forEach.call(document.body.querySelectorAll('td[class="sdbname"]:first-child'), function (e) {
	e.addEventListener("mouseover", function () {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(e.querySelector('b'));
		selection.removeAllRanges();
		selection.addRange(range);
	})
});