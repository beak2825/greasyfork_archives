// ==UserScript==
// @name        Greasy Fork Total Installs
// @version     0.1.1
// @description A userscript that shows the total installs for any page on Greasy Fork
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @include     https://greasyfork.org/*
// @run-at      document-idle
// @grant       none
// @icon        https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @downloadURL https://update.greasyfork.org/scripts/33064/Greasy%20Fork%20Total%20Installs.user.js
// @updateURL https://update.greasyfork.org/scripts/33064/Greasy%20Fork%20Total%20Installs.meta.js
// ==/UserScript==
(() => {
	"use strict";

	const wrapper = $("#browse-script-list, #user-script-list");
	if (wrapper) {
		const els = [...wrapper.querySelectorAll("dd.script-list-total-installs")];
		const nonDigits = /[^\d]/g;
		const getNum = txt => parseFloat(txt.replace(nonDigits, ""));
		const total = els.reduce((acc, el) => acc + getNum(el.textContent), 0);
		if (total) {
			const span = document.createElement("span");
			let target = $("#script-list-sort .list-option:nth-child(2)");
			span.textContent = ` (${(total).toLocaleString()})`;
			if ($("a", target)) {
				target = $("a", target);
			}
			target.appendChild(span);
		}
	}

	function $(str, el) {
		return (el || document).querySelector(str);
	}

})();
