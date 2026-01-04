// ==UserScript==
// @name         Block + Redirect YouTube Shorts
// @namespace    http://github.com/chunjee
// @version      0.1.0
// @description  Hide YouTube Shorts everywhere and redirect shorts URLs to normal watch pages.
// @author       Chunjee
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542667/Block%20%2B%20Redirect%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/542667/Block%20%2B%20Redirect%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 🚫 Redirect if on a Shorts URL
	if (location.pathname.startsWith('/shorts/')) {
		location.replace('https://www.youtube.com/');
		return;
	}

	// 🧹 Hide Shorts previews everywhere else
	const observer = new MutationObserver(() => {
		document.querySelectorAll('a[href*="/shorts/"]').forEach(link => {
			let container = link.closest(
				'ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-shelf-renderer, ytd-rich-grid-media'
			);
			if (!container) container = link;
			container.style.display = 'none';
		});
	});

	observer.observe(document, {
		childList: true,
		subtree: true
	});
})();