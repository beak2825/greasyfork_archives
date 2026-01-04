// ==UserScript==
// @name		Steam Link App Opener
// @namespace	https://github.com/jaxellis
// @version		2.1.0
// @description	Opens Steam Links in the Steam Application
// @author		Jaxellis
// @icon		https://store.steampowered.com/favicon.ico
// @homepage	https://github.com/jaxellis/Steam-Link-App-Opener
// @supportURL	https://github.com/jaxellis/Steam-Link-App-Opener/issues/
// @match		http://*/*
// @match		https://*/*
// @exclude		http://store.steampowered.com/*
// @exclude		https://store.steampowered.com/*
// @exclude		http://steamcommunity.com/*
// @exclude		https://steamcommunity.com/*
// @grant		none
// @run-at      document-start
// @license		GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/436231/Steam%20Link%20App%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/436231/Steam%20Link%20App%20Opener.meta.js
// ==/UserScript==

/* Global Variables and Constants */
const CUSTOMKEY = 'Control'; // Valid Keys: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
const PREFIX = 'steam://openurl/'; // Default: steam://openurl/
const STEAM_URLS = ['store.steampowered.com', 'steamcommunity.com']; // List of Steam domains to open in app
let customKeyPressed = false; // Variable to tell if our custom key is being pressed

// This event listener is delegated to the document to find all steam links
document.addEventListener('click', (event) => {

	// Allow native browser behavior for clicks with modifiers (e.g., Ctrl+Click to open in new tab)
	if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;

	// Find the closest link that matches any of the specified steam URLs
	const link = event.target.closest('a[href]');
	if (!link || !STEAM_URLS.includes(new URL(link.href).hostname)) return;

	// Prevent the default link behavior
	event.preventDefault();

	// If a custom key is pressed, open the default link
	const url = customKeyPressed ? link.href : `${PREFIX}${encodeURI(link.href)}`;
	window.open(url, '_blank');

	// Reset custom key state
	customKeyPressed = false;
});

/* Update Custom Key Variable */
if (CUSTOMKEY) {
	// Add event listener to the document for keydown events
	document.addEventListener('keydown', (event) => {
		// Check if the pressed key is the custom key
		if (event.key === CUSTOMKEY && !customKeyPressed) {
			customKeyPressed = true; // Set the custom key as pressed
		}
	});

	// Add event listener to the document for keyup event
	document.addEventListener('keyup', (event) => {
		// Check if the key pressed is the custom key
		if (event.key === CUSTOMKEY) {
			customKeyPressed = false; // Set the custom key as not pressed
		}
	});
}
