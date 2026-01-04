// ==UserScript==
// @name         YouTube Space Bar to Pause
// @namespace    YouTube Space Bar to Pause Fix
// @description  Force space bar to play/pause videos
// @version      2.3
// @author       DryChicken
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @exclude      https://*.youtube.com/embed/*
// @exclude      https://music.youtube.com/*
// @icon		 https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487340/YouTube%20Space%20Bar%20to%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/487340/YouTube%20Space%20Bar%20to%20Pause.meta.js
// ==/UserScript==

// Function to determine if on a YouTube Short
function isYouTubeShort() {
	const currentUrl = window.location.href;
	return currentUrl.includes('shorts')
}

function getKeyboardEvent(key, type) {
	return new KeyboardEvent(type, {
		key: key,
		keyCode: key.toUpperCase().charCodeAt(0),
		bubbles: true,
		cancelable: true,
	});
}

function simulateKeyDown(key) {
	let keydownEvent = getKeyboardEvent(key, 'keydown');
	document.dispatchEvent(keydownEvent);
}

function simulateKeyUp(key) {
	let keyupEvent = getKeyboardEvent(key, 'keyup');
	document.dispatchEvent(keyupEvent);
}

// Function to simulate the pressing and releasing of a key
function simulateKeyPress(key) {
	simulateKeyDown(key);
	simulateKeyUp(key);
}

function shortsPlayPause() {
	const shortsPlayer = document.querySelector('#shorts-player');
	if (shortsPlayer) shortsPlayer.click();
}

// Keyup on spacebar - when it works, is YouTube's default play/pause video
document.addEventListener("keyup", function(event) {
	if (event.key !== " ") return;

	// If in search bar or comment input
	let ae = document.activeElement;
	if (ae.tagName.toLowerCase() == "input" || ae.hasAttribute("contenteditable")) return;
	
	// if (isYouTubeShort()) return;

	event.preventDefault();
	event.stopImmediatePropagation();
}, true);

// Use keydown on spacebar to trigger our simulated play/pause action
document.addEventListener('keydown', function(event) {
	if (event.key !== " ") return;

	// If in search bar or comment input
	let ae = document.activeElement;
	if (ae.tagName.toLowerCase() == "input" || ae.hasAttribute("contenteditable")) return;
	
	event.preventDefault();
	// event.stopImmediatePropagation();

	simulateKeyDown('k');

}, true);