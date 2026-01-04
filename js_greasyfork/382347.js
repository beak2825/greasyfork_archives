// ==UserScript==
// @name         Old Vermillion Userbars
// @namespace    https://www.v3rmillion.net
// @version      1.0
// @description  A userscript to swap v3rmillion userbars to their old versions.
// @author       SegFault
// @match        https://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382347/Old%20Vermillion%20Userbars.user.js
// @updateURL https://update.greasyfork.org/scripts/382347/Old%20Vermillion%20Userbars.meta.js
// ==/UserScript==

(function() {
	jQuery.each(document.querySelectorAll("img[src*=UserBars]"), function(i, v) {
		v.src = v.src.replace("Redesigned/", "");
	});
})();