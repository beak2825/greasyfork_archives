// ==UserScript==
// @name         YouTube - Hide chat by default
// @namespace    amekusa.yt-hide-chat
// @author       amekusa
// @version      2.0.0
// @description  Hide chat on YouTube live videos by default.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepage     https://github.com/amekusa/monkeyscripts
// @downloadURL https://update.greasyfork.org/scripts/507558/YouTube%20-%20Hide%20chat%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/507558/YouTube%20-%20Hide%20chat%20by%20default.meta.js
// ==/UserScript==

(function (doc) {
	// --- config ---
	let wait     = 4000; // initial wait time (ms)
	let interval = 2000; // update interval (ms)
	let match    = /^https:\/\/www\.youtube\.com\/(?:watch\?|clip\/)/; // url pattern
	let debug    = false ? console.debug : (() => {});
	// --------------

	let watcher;
	let paused;
	let hide;

	function findCloseButton() {
		try {
			let fr = doc.querySelector('iframe#chatframe'); // frame
			if (!fr) return null;
			fr = fr.contentWindow.document;
			if (!fr.querySelector('yt-live-chat-item-list-renderer #items [id], yt-live-chat-item-list-renderer #empty-state-message')) return null;
			return fr.querySelector('yt-live-chat-header-renderer #close-button button');
		} catch (e) {
			return null;
		}
	}

	function unhide() {
		debug('unhide.');
		hide = false;
	}

	function update() {
		if (paused || !hide) return; // do nothing

		// find & click the close button
		let btn = findCloseButton();
		if (btn) {
			debug('click:', btn);
			return btn.dispatchEvent(new Event('click'));
		}

		// hook "Show chat" button
		btn = doc.querySelector('#chat-container #show-hide-button button');
		if (btn) {
			btn.removeEventListener('click', unhide);
			btn.addEventListener('click', unhide);
		}
	}

	function pause() {
		if (paused) return;
		debug('pause.');
		paused = true;
		if (watcher) {
			clearTimeout(watcher);
			clearInterval(watcher);
			watcher = null;
		}
	}

	function init() {
		if (watcher) return; // already running
		if (!location.href.match(match)) {
			debug('url mismatch:', location.href);
			return;
		}
		if (paused) {
			debug('resume.');
			paused = false;
		}
		debug('initializing...');
		hide = true;
		watcher = setTimeout(() => {
			watcher = setInterval(update, interval);
			debug('initialized.');
			update();
		}, wait);
	}

	doc.addEventListener('DOMContentLoaded', init);
	doc.addEventListener('yt-navigate-finish', init);
	doc.addEventListener('yt-navigate-start', pause);

})(document);

