// ==UserScript==
// @name        reddit fake subscriber status
// @namespace   k21np2rnmxy2s8dg8
// @match       https://*.reddit.com/r/*
// @grant       none
// @version     1.0
// @description Makes subreddits appear as if you are subscribed.
// @license     MIT
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/435039/reddit%20fake%20subscriber%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/435039/reddit%20fake%20subscriber%20status.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// STEP 1: Override CSS that messes with the 'join' button
	const style = document.createElement("style");
	// Increase specificity of our selector by repeating .active a bunch
	const bloatedSelector = ".option.add" + (".active".repeat(16));
	style.textContent = `${bloatedSelector}::after,${bloatedSelector}::before{content:none!important;display:none!important;pointer-events:none!important;visibility:hidden!important;width:0!important;height:0!important;padding:0!important;z-index:-2147483648!important;}`;

	function addStyle() {
		addStyle = null; // only insert style once
		document.head.prepend(style);
	}

	// STEP 2: Add class="subscriber" to the body tag, to fool
	// custom stylesheets which style by this class.
	function addSubscriberClass() {
		document.body.classList.add("subscriber");
	}


	// Try to apply both fixes.
	// Returns true if this happened,
	// false if we need to keep waiting.
	function tryModifyPage() {
		if (document.body) {
			addStyle?.();
			addSubscriberClass();

			return true;
		} else if (document.head) {
			// Apply style while we wait for the body
			addStyle?.();
		}

		return false;
	}


	if (!tryModifyPage()) {
		// Wait for <head> and/or <body> to show up,
		// then try again.
		new MutationObserver(function () {
			if (tryModifyPage()) {
				this.disconnect();
			}
		}).observe(document.documentElement, { childList: true });
	}
})();
