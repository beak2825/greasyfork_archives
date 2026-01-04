// ==UserScript==
// @name         Fix App Image Not Found
// @namespace    https://greasyfork.org/users/2205
// @version      0.1
// @description  Fix App Image Not Found on steam pages
// @author       Rudokhvist
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @license      Apache-2.0
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434913/Fix%20App%20Image%20Not%20Found.user.js
// @updateURL https://update.greasyfork.org/scripts/434913/Fix%20App%20Image%20Not%20Found.meta.js
// ==/UserScript==

(function() {
    'use strict';
 	var images=document.querySelectorAll("img[src$='338200c5d6c4d9bdcf6632642a2aeb591fb8a5c2.gif']");
        if (!images.length) { return; }
	for (var index = 0;index<images.length;index++) {
		var appidRegex = images[index].parentElement.href.match(/(?:store\.steampowered|steamcommunity)\.com\/(app|market\/listings)\/(\d+)\/?/);
		if (appidRegex != null) {
			var appid = appidRegex[2];
			if (appid != 223530) { //TODO: check if there is other exceptions. if there are - make more complex condition here
				images[index].src="https://steamcdn-a.akamaihd.net/steam/apps/" + appid + "/capsule_184x69.jpg";
			}
		}
	}
})();