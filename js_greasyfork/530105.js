// ==UserScript==
// @name         GPRO: Hide driver face
// @namespace    taviandir.gpro.driverface
// @version      0.0.3
// @description  Remove the driver profile image on the driver profile pages.
// @author       Taviandir
// @match        https://gpro.net/*
// @match        https://app.gpro.net/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530105/GPRO%3A%20Hide%20driver%20face.user.js
// @updateURL https://update.greasyfork.org/scripts/530105/GPRO%3A%20Hide%20driver%20face.meta.js
// ==/UserScript==

// Run on page load
(function(){
	// check the URL of the current page to see if we are on a GPRO site
	var host = document.location.host;
	
	// on the old version of the app?
	if (host === "gpro.net") {
		// try and find the driver profile image element
		var el = document.querySelector("table#tableone tbody tr td a div img");
		// if found, then remove it
		if (el) {
			el.remove();
		}
	}
	// on the new version of the app?
	else if (host === "app.gpro.net") {
		// NOTE : we have to check every 0.1 seconds because during the 
		// new version of GPRO is a Single Page Application and thus,
		// the content won't be available directly on load.
		var intervalId = setInterval(() => {
			// try and find the driver profile image element (office page)
			var el = document.querySelector(".faceTd #driverFace img");
			
			if (!el) {
				// try and find the driver profile image element (driver profile page)
				el = document.querySelector(".driverProfileHighRes #driverFace img");
			}
			
			// if found, then remove it
			if (el) {
				el.remove();
				clearInterval(intervalId);
			}
		}, 100);		
	}
})();
