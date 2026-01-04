// ==UserScript==
// @name         Opium Pulses middle click fix
// @namespace    vkjpy4t5b830p2
// @version      0.1
// @description  Allows you to enter giveaways with middle click (new tab)
// @match        https://www.opiumpulses.com/giveaways
// @match        https://www.opiumpulses.com/giveaways?*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425757/Opium%20Pulses%20middle%20click%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/425757/Opium%20Pulses%20middle%20click%20fix.meta.js
// ==/UserScript==

(function() {
	"use strict";

	document.addEventListener("auxclick", function (event) {
		// Dispatch a neutral "click" event to fix the broken site.
		// Since this is not a MouseEvent, it will not actually
		// activate the link, but will trigger the onclick handler.
		event.target.closest?.("a")?.dispatchEvent(
			new CustomEvent("click", { bubbles: true, cancelable: true, composed: true })
		);
	});
})();
