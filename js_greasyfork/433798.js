// ==UserScript==
// @name         Double-click Ready to Start - Bonk.io
// @version      1.0.0
// @description  Starts the game without a countdown if you doubleclick the Ready button.
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/433798/Double-click%20Ready%20to%20Start%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/433798/Double-click%20Ready%20to%20Start%20-%20Bonkio.meta.js
// ==/UserScript==

(() => {
	// Whether Ready was double clicked
	let quickStart = false;

	// Main canvas where the game is drawn on
	const gamerenderer = document.getElementById("gamerenderer");
	// Test button that starts the game right away from the map editor
	const mapeditor_midbox_testbutton = document.getElementById("mapeditor_midbox_testbutton");
	// Close map editor
	const mapeditor_close = document.getElementById("mapeditor_close");
	// Button to open map editor
	const newbonklobby_editorbutton = document.getElementById("newbonklobby_editorbutton");
	// Ready button
	const newbonklobby_readybutton = document.getElementById("newbonklobby_readybutton");
	// Start button
	const newbonklobby_startbutton = document.getElementById("newbonklobby_startbutton");

	// Detect double click
	newbonklobby_readybutton.addEventListener("dblclick", () => {
		if (!newbonklobby_startbutton.classList.contains("brownButtonDisabled")) {
			quickStart = true;
			// Open the editor
			newbonklobby_editorbutton.click();
			// Start the game using the button from the editor
			mapeditor_midbox_testbutton.click();
		}
	});

	new MutationObserver(mutationsList => {
		for (const mutation of mutationsList) {
			// The "gamerenderer" has been hidden (this is used to render the match and stuffs)
			// In short, this means we have left the game or returned to the lobby
			if (gamerenderer.style.visibility === "hidden") {
				// If quick start was used, then close the map editor
				// because the map editor will open after the round ends
				if (quickStart) {
					mapeditor_close.click();
					quickStart = false;
				}
			}
		}
	}).observe(gamerenderer, {
		attributeFilter: ["style"]
	});
})();