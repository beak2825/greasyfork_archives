// ==UserScript==
// @name               TW Darkness
// @version            0.05
// @license            LGPLv3
// @description        We need more darkness
// @author             krcsirke
// @match              https://*.the-west.hu/*
// @match              https://*.the-west.net/*
// @grant              none
// @namespace          https://greasyfork.org/hu/users/177516

// @downloadURL https://update.greasyfork.org/scripts/40154/TW%20Darkness.user.js
// @updateURL https://update.greasyfork.org/scripts/40154/TW%20Darkness.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	$("#map").css({ "filter": "brightness(40%)", "-webkit-filter": "brightness(40%)" });
});