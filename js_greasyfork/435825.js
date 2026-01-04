// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.8
// @description  Fixes incorrectly escaped characters in links on Old Reddit
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435825/Old%20Reddit%20Broken%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/435825/Old%20Reddit%20Broken%20Link%20Fixer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Fix links on load
	new MutationObserver((_, observer) => {
		// Wait for comments to exist
		if (!document.getElementsByClassName('commentarea').length) return;

		runLinkFixer(observer);
		addMoreButtonListener();
	}).observe(document, {
		childList: true,
		subtree: true
	});

	function runLinkFixer(observer) {
		observer.disconnect();
		fixAllLinks();
	}

	// For link with backslash, remove backslashes in link
	function fixAllLinks() {
		for (const link of document.querySelectorAll('.thing a[href*="%5C"]')) {
			removeBackslashes(link);
		}
	}

	// Not sure if quotes or dashes are incorrectly escaped anymore,
	// but I've seen a few old posts/comments where they are
	function removeBackslashes(a) {
		a.href = a.href.replace(/%5C([-_"])/g, '$1');
		a.innerText = a.innerText.replace(/\\([-_"])/g, '$1');
	}

	// Hijack 'load more comments' button onclick to run fixer
	function addMoreButtonListener() {
		window.morechildren = (function () {
			const _morechildren = window.morechildren;
			return function () {
				const result = _morechildren.apply(this, arguments);
				observeNewComments();
				return result;
			};
		})();
	}

	// When the 'load more comments' button is pressed,
	// it waits for new comments to load and then runs the link fixer
	const commentObserver = new MutationObserver((_, observer) => {
		runLinkFixer(observer);
	});
	function observeNewComments() {
		commentObserver.observe(document.querySelector('.commentarea > .sitetable'), {
			childList: true,
			subtree: true
		});
	}
})();
