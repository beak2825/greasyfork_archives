// ==UserScript==
// @name Greasy Fork Total Installs(modified)
// @version 0.1.2
// @description A userscript that shows the total installs for any page on Greasy Fork
// @license MIT
// @namespace Rob Garrison
// @author Rob Garrison
// @modifiedBy NotYou
// @namespace https://github.com/Mottie
// @include https://greasyfork.org/*
// @run-at document-idle
// @grant none
// @icon https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @downloadURL https://update.greasyfork.org/scripts/438584/Greasy%20Fork%20Total%20Installs%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438584/Greasy%20Fork%20Total%20Installs%28modified%29.meta.js
// ==/UserScript==

/* What's New?
 *  Counts of total daily installs
 *  Replaced icon URL to new
 */

(() => {
	"use strict";

	const wrapper = $("#browse-script-list, #user-script-list");
	if (wrapper) {
        // CONSTANTAS //
		const els = [...wrapper.querySelectorAll("dd.script-list-total-installs")];
        const els2 = [...wrapper.querySelectorAll("dd.script-list-daily-installs")];
		const nonDigits = /[^\d]/g;
		const getNum = txt => parseFloat(txt.replace(nonDigits, ""));
		const total = els.reduce((acc, el) => acc + getNum(el.textContent), 0);
        const totald = els2.reduce((acc, el) => acc + getNum(el.textContent), 0); // NEW LET
        // IFs //
		if (total) {
			const span = document.createElement("span");
			let target = $("#script-list-sort .list-option:nth-child(2)");
			span.textContent = ` (${(total).toLocaleString()})`;
			if ($("a", target)) {
				target = $("a", target);
			}
			target.appendChild(span);
		}
        // MODIFICATION START //
        if (totald) {
			const span = document.createElement("span");
			let target = $("#script-list-sort .list-option:nth-child(1)");
			span.textContent = ` (${(totald).toLocaleString()})`;
			if ($("a", target)) {
				target = $("a", target);
			}
			target.appendChild(span);
		}
	}
    // MODIFICATION END //

    // FUNCTIONS //
	function $(str, el) {
		return (el || document).querySelector(str);
	}

})();

