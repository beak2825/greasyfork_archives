// ==UserScript==
// @name         YouTube link on Piped websites
// @namespace    https://devture.com
// @license      AGPL-3.0-or-later
// @version      1.2
// @description  Shows a YouTube link on Piped websites like https://piped.kavin.rocks.
// @copyright 2022, Slavi Pantaleev (https://devture.com)
// @author       s.pantaleev
// @grant        none
// @match        https://piped.kavin.rocks/*
// @match        https://piped.video/*
// @downloadURL https://update.greasyfork.org/scripts/452406/YouTube%20link%20on%20Piped%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/452406/YouTube%20link%20on%20Piped%20websites.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let injectButtonNextToOther = function (otherButton) {
		let queryString = window.location.href.split('?')[1];

		let queryParamsMap = {};
		let keyValPairs = queryString.split('&');
		keyValPairs.forEach(function (keyValPairString) {
			let keyValPair = keyValPairString.split('=');
			queryParamsMap[keyValPair[0]] = keyValPair[1];
		});

		if (typeof(queryParamsMap.v) === 'undefined') {
			console.log('Could not find "v" query-string parameter. Likely not on a /watch page.');
			return;
		}

		let youtubeUrl = 'https://www.youtube.com/watch?v=' + queryParamsMap.v;

		let containerElement = otherButton.closest('div');

		let newButton = document.createElement('a');
		newButton.href = youtubeUrl;
		newButton.target = '_blank';
		newButton.classList = ['btn', 'flex-col'];
		newButton.textContent = '📺 YouTube';

		containerElement.appendChild(newButton);
	};

	// Piped is a SPA application. We can't inject a new button into it until it has loaded.
	// With the mutation observer below, we're waiting for some known button element to appear
	// (signifying that the page has loaded), before running our logic above.
	//
	// The observer below may run more than just once.
	// Piped intercepts link clicks and loads new pages into the same DOM, without a full page reload (PJAX-style).
	let rssButtonSelector = 'a[title="RSS feed"]';

	let observer = new MutationObserver(mutations => {
		for (let mutation of mutations) {
			for (let node of mutation.addedNodes) {
				// Skip text nodes, etc.
				if (!(node instanceof HTMLElement)) {
					continue;
				}

				let rssButton = null;

				// Check if the added node is the button itself,
				// or fall back to looking for the button within the added node's children.
				if (node.matches(rssButtonSelector)) {
					rssButton = node;
				} else {
					rssButton = node.querySelector(rssButtonSelector);
				}

				if (rssButton !== null) {
					injectButtonNextToOther(rssButton);
				}
			}
		}
	});

	observer.observe(window.document, {childList: true, subtree: true});
})();