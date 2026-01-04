// ==UserScript==
// @name         Geohive
// @namespace    https://gist.github.com/Kadauchi/
// @version      1.2.2
// @description  Removes the instructions popup and makes enter submit.
// @author       Kadauchi
// @icon         http://www.mturkgrind.com/data/avatars/l/1/1084.jpg?1432698290
// @include      https://www.tomnod.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/39612/Geohive.user.js
// @updateURL https://update.greasyfork.org/scripts/39612/Geohive.meta.js
// ==/UserScript==

$(document).ready(function() {
	window.setTimeout(function() {
		$(".region-campaign-map-modal.in").remove();
	}, 1000);
});

// Enter will sunmit the HIT.
document.onkeydown = function(event) {
	if (event.keyCode === 13) {
		$("button[type='submit']").click();
	}
};