// ==UserScript==
// @name        OPM
// @version     2.0.7
// @match       https://ourworldofpixels.com/*
// @exclude     https://ourworldofpixels.com/api/*
// @author      DD&DD (DimDen & DayDun) | uaBArt flickering fix
// @description OWOP Package Manager 2 is a package manager for OWOP that makes it easy for anyone to install, upload and use scripts.
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/222541
// @downloadURL https://update.greasyfork.org/scripts/391764/OPM.user.js
// @updateURL https://update.greasyfork.org/scripts/391764/OPM.meta.js
// ==/UserScript==
// OPM
(function() {
	function init() {
		window.stop();
		document.open();
		if(document.body) {
			window.location.reload();
			return;
		}
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", "https://opm.glitch.me/client/");
		xhttp.addEventListener("load", function() {
			document.write(xhttp.response);
			document.close();
		});
		xhttp.send();
		console.log("OPM loaded");
	};
	let check = setInterval(function() { // Check if OWOP exist
		if(typeof OWOP != 'undefined') {
			init();
			clearInterval(check); // Stop check
		}
	})
})();