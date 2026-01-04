// ==UserScript==
// @name         GitHub Classic Fonts
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      1.0.0
// @description  Use the pre-2017 fonts on GitHub, instead of whatever fonts GitHub's designers fancy each week
// @author       joeytwiddle
// @license      ISC
// @match        https://github.com/*
// @match        https://*.github.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454985/GitHub%20Classic%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/454985/GitHub%20Classic%20Fonts.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// Copied from my fork of Make GitHub Great Again, a Chrome extension which reverts a lot of GitHub's style changes
	// https://github.com/joeytwiddle/MakeGithubGreatAgain

	// This version actually uses the monospace font set in your browser, so you can configure it more easily.

    GM_addStyle(`
		/* main font */
		body,
		.markdown-body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
			/* font-size: 14px; line-height: 1.5; color: #24292e; background-color: #fff; */
		}

		/* monospace font styles from frameworks.css 2017/01/01 */
		code,
		kbd,
		pre,
		samp {
			font-family: monospace, monospace;
		}
		tt,
		code {
			font-family: monospace;
		}
		pre {
			font: 12px monospace
		}
		.CodeMirror,
		.CodeMirror-dialog input,
		.file-editor-textarea,
		.input-monospace {
			font-family: monospace, monospace;
		}
		.cm-s-github .CodeMirror-lines {
			font-family: monospace;
		}

		/* monospace font styles from github.css 2017/01/01 */
		.branch-name {
			font: 12px monospace;
		}
		.commit-ref {
			font: 0.75em/2 monospace;
		}
		.commit .sha-block,
		.commit .sha {
			font-family: monospace;
		}
		.commit-desc pre {
			font-family: monospace;
		}
		.commit-tease-sha {
			font-family: monospace;
		}
		.blob-num {
			font-family: monospace;
		}
		.blob-code-inner {
			font-family: monospace;
		}
		.gollum-editor .gollum-editor-body {
			font-family: monospace;
		}
		.gollum-editor .expanded textarea {
			font-family: monospace;
		}
		.gollum-dialog-dialog-body fieldset .code {
			font-family: monospace;
		}
		kbd {
			font: 11px monospace;
		}
		.credit-card .cvv {
			font-family: monospace;
		}
		.credit-card .text {
			font-family: monospace;
		}
		.default-label .sha {
			font-family: monospace;
		}

		/* monospace font styles from site.css 2017/01/01 */
		.alt-mono-font {
			font-family: monospace;
		}
		.pullquote {
			font-family: monospace;
		}
		.casestudy-body blockquote {
			font-family: monospace;
		}
		.file-info {
			font-family: monospace;
		}
		.text-mono {
			font-family: monospace;
		}
	`);
})();
