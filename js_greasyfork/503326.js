// ==UserScript==
// @name        GitHub Releases - Show all assets
// @description Clicks the first "Show all xxx assets" button for you on the Releases page.
// @namespace   RainSlide
// @author      RainSlide
// @license     Unlicense
// @version     1.0
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @match       https://github.com/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/503326/GitHub%20Releases%20-%20Show%20all%20assets.user.js
// @updateURL https://update.greasyfork.org/scripts/503326/GitHub%20Releases%20-%20Show%20all%20assets.meta.js
// ==/UserScript==

"use strict";

const click = () => document.querySelector(".js-release-asset-untruncate-btn")?.click();

click();

/* When GitHub load a page with pjax,
it adds (then removes) a div.turbo-progress-bar under <html>, between <head> and <body>.
So we can just watch its removal for pjax page load complete. */
new MutationObserver(mutations => {
	for (const { removedNodes } of mutations) {
		if (removedNodes.length === 1 && removedNodes[0].className === "turbo-progress-bar") {
			click();
			break;
		}
	}
}).observe(document.documentElement, { childList: true });
