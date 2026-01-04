// ==UserScript==
// @name         Steam inventory keyboard steering
// @namespace    https://github.com/lopezloo
// @version      1.0
// @description  Adds possibility to navigate Steam inventory using keyboard.
// @author       lopezloo
// @license      GPL-3.0
// @match        http://steamcommunity.com/id/*/inventory/
// @match        http://steamcommunity.com/profiles/*/inventory/
// @match        https://steamcommunity.com/id/*/inventory/
// @match        https://steamcommunity.com/profiles/*/inventory/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438832/Steam%20inventory%20keyboard%20steering.user.js
// @updateURL https://update.greasyfork.org/scripts/438832/Steam%20inventory%20keyboard%20steering.meta.js
// ==/UserScript==

(function ($) {
$(document).ready(function() {
$(document).keydown(function(e) {
	console.log(e.which);
	switch(e.which) {
		// left
		case 37:
			$("#pagebtn_previous").click();
			break;

		// right
		case 39:
			$("#pagebtn_next").click();
			break;

		default: return;
	}
	e.preventDefault();
});
});
})(jQuery);
