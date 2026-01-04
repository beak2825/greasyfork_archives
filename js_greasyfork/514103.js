// ==UserScript==
// @name         Livin' On Sweets Fullscreen Toggle
// @namespace    http://tampermonkey.net/
// @version      2024-10-26
// @description  Play in fullscreen because that's what the gods intended to
// @author       You
// @match        https://bluearchive.nexon.com/events/2024/10/minigame
// @icon         https://static.wikia.nocookie.net/blue-archive/images/b/b3/Event_35_-_Sugar_Rush_Icon_1.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514103/Livin%27%20On%20Sweets%20Fullscreen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/514103/Livin%27%20On%20Sweets%20Fullscreen%20Toggle.meta.js
// ==/UserScript==

(function () {
	"use strict";

	let fullscreen = false;

	// poll elements
	function checkElementsLoaded() {
		const nuxtDiv = document.getElementById("__nuxt");
		const gameDiv = document.getElementsByClassName("game")[0];
		const playDiv = document.getElementById("play");

		// init when all elements loaded
		if (nuxtDiv && gameDiv && playDiv) {
			initFullscreenToggle(nuxtDiv, gameDiv, playDiv);
		} else {
			// wait
			setTimeout(checkElementsLoaded, 100);
		}
	}

	// Main function to initialize fullscreen toggle
	function initFullscreenToggle(nuxtDiv, gameDiv, playDiv) {
		console.log("Fullscreen toggle loaded! Press \"P\" to toggle fullscreen");

		function toggleFullscreen() {
			fullscreen = !fullscreen;
			if (fullscreen) onFullscreen();
			else onNotFullscreen();
		}

		// hide all other elements and put the game to focus
		function onFullscreen() {
			document.body.appendChild(playDiv);
			nuxtDiv.style.display = "none";
			playDiv.style.height = "100vh";
		}

		// revert
		function onNotFullscreen() {
			gameDiv.appendChild(playDiv);
			nuxtDiv.style.display = "block";
			playDiv.style.height = "auto";
		}

		// listen for "p" key
		document.addEventListener("keydown", function (event) {
			if (event.key === "p" || event.key === "P") {
				toggleFullscreen();
				console.log("Fullscreen: " + fullscreen);
			}
		});
	}

	checkElementsLoaded();
})();
