// ==UserScript==
// @name         Clear chat input - Bonk.io
// @version      1.0.4
// @description  Clears the chat input after a delay when you return to the lobby or go into a game
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433234/Clear%20chat%20input%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/433234/Clear%20chat%20input%20-%20Bonkio.meta.js
// ==/UserScript==

// I have not thoroughly tested this to see if it works. Preliminary testing suggests it does.

// What this does:
// - Clears the chat inputs after a delay after the round ends so some characters don't stay
//   bonk.io does it, but sometimes leaves a few characters if you're typing whilst the round ends

// I need to use semicolons correc;tky;;;;;

(() => {
	// Where the actual game is shown
	const gamerenderer = document.getElementById("gamerenderer");

	// In-game chat input
	const ingamechatinputtext = document.getElementById("ingamechatinputtext");
	// Lobby chat input
	const newbonklobby_chat_input = document.getElementById("newbonklobby_chat_input");

	// If all elements are found, run the code. If they're not found it'll error
	// shouldn't ever be false unless the button's IDs are renamed
	if (gamerenderer) {
		new MutationObserver(mutationsList => {
			for (const mutation of mutationsList) {
				// The "gamerenderer" has been hidden (this is used to render the match and stuffs)
				// In short, this means we have left the game or returned to the lobby
				if (gamerenderer.style.visibility === "hidden") {
					// Reset the chat in game after a small delay (should be copied to lobby chat by bonk)
					// Will "fix" bonk not clearing the chat properly (hopefully)
					setTimeout(() => {
						// Check if it's still hidden, otherwise it will break with map cycler
						if (gamerenderer.style.visibility === "hidden") ingamechatinputtext.value = "";
					}, 100);
				} else if (gamerenderer.style.visibility === "inherit") {
					// Reset the lobby chat due to the game starting
					setTimeout(() => {
						if (gamerenderer.style.visibility === "inherit") newbonklobby_chat_input.value = "";
					}, 100);
				}
			}
		}).observe(gamerenderer, {
			attributeFilter: ["style"]
		});
	}
})();