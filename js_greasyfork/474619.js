// ==UserScript==
// @name         Spotify Redirect
// @namespace    spotifyredirect
// @homepage     spotifyredirect
// @license MIT 
// @version      3.0.1
// @encoding     utf-8
// @description  Spotify Redirect for IOS
// @author       AZ
// @match        *://open.spotify.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474619/Spotify%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/474619/Spotify%20Redirect.meta.js
// ==/UserScript==

(function () {
	"use strict";
	if (window.location.href.includes("/track/") || window.location.href.includes("/album/")) {
		window.location.href = `spotify://${window.location.href.split(".com/")[1]}`;
	}

	if (window.location.href.includes("/collection/tracks")) {
		setTimeout(() => {
			document.querySelector('[aria-label="Play"]')?.click();
			document.querySelector('[aria-label="Pause"]')?.click();
			document.querySelector('[aria-label="Play"]')?.click();
			document.querySelector('[aria-label="Play"]')?.click();
		}, 2000);
	}

	if (window.location.href.includes("/playlist/")) {
		setTimeout(() => {
			document.querySelector('[aria-label="Play"]')?.click();
			document.querySelector('[aria-label="Pause"]')?.click();
			document.querySelector('[aria-label="Play"]')?.click();
		}, 2000);

		setTimeout(() => {
			document.querySelector('[aria-label="Play"]')?.click();
			document.querySelector('[aria-label="Pause"]')?.click();
			document.querySelector('[aria-label="Play"]')?.click();
		}, 3000);
	}
})();
