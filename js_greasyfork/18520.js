// ==UserScript==
// @name        GitHub Remove Diff Signs
// @version     1.3.2
// @description A userscript that hides the "+" and "-" from code diffs
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @match       https://github.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @supportURL  https://github.com/Mottie/GitHub-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/18520/GitHub%20Remove%20Diff%20Signs.user.js
// @updateURL https://update.greasyfork.org/scripts/18520/GitHub%20Remove%20Diff%20Signs.meta.js
// ==/UserScript==

(() => {
	"use strict";

	GM_addStyle(`
		.blob-code-inner:before,
		.blob-code-marker-context:before,
		.blob-code-marker-addition:before,
		.blob-code-marker-deletion:before {
			visibility: hidden !important;
		}`
	);

})();
