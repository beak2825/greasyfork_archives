// ==UserScript==
// @name         Lil_Landen | Bot for BHMS students
// @version      7.6.6
// @description  The Best NT Menu
// @author       Jake T
// @match        https://www.nitrotype.com/race/*
// @match        https://www.nitrotype.com/race
// @match        http://www.nitrotype.com/race
// @match        http://www.nitrotype.com/race/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/185165
// @downloadURL https://update.greasyfork.org/scripts/377666/Lil_Landen%20%7C%20Bot%20for%20BHMS%20students.user.js
// @updateURL https://update.greasyfork.org/scripts/377666/Lil_Landen%20%7C%20Bot%20for%20BHMS%20students.meta.js
// ==/UserScript==
(function() {
	"use strict";
	var OUT = "https://rawgit.com/ultratype/UltraTypeBot/master/OUT/OUT.js";
	var OUT_SCRIPT = "<script src='" + OUT + "'></script>\n";

	// Completely halt the loading of the window, to prevent the page from being loaded more than once
	window.stop();
	document.documentElement.innerHTML = null;

	// Request for the current document
	GM_xmlhttpRequest({
		method: "GET",
		url: window.location.href,
		onload: function(e) {
			// Write a modified page to the document
			var doc = e.responseText;
			document.open();
			document.write(OUT_SCRIPT + doc);
			document.close();
			// The extension script will now be loaded onto the document
		}
	})
})();