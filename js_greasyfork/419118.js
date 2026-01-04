// ==UserScript==
// @name wiki.SuperFamicom.org Dark
// @namespace gitlab.com/Neui/userstyles
// @version 2.0.2
// @description Dark mode for wiki.superfamicom.org
// @author Neui
// @homepageURL https://gitlab.com/Neui/userstyles
// @supportURL https://gitlab.com/Neui/userstyles/issues
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wiki.superfamicom.org/*
// @downloadURL https://update.greasyfork.org/scripts/419118/wikiSuperFamicomorg%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/419118/wikiSuperFamicomorg%20Dark.meta.js
// ==/UserScript==

(function() {
let css = `
	html, body {
		background-color: black;
		color: white;
	}

	a {
		color: #D7D7D7;
	}

	a:hover, a:focus {
		color: #EEE;
	}
	.content a:hover {
		color: #FFF;
	}

	/* Buttons */
	.button {
		color: white;
		border-color: white;
	}

	/* Tables */
	table {
		background: unset; /* With border-radius it otherwise show white corners */
	}

	.content tr td, #content tr {
		background: #303030;
	}

	.content tr:nth-child(2n) td, #content tr:nth-child(2n) {
		background: #3F3F3F;
	}

	.content tbody tr:hover td {
		background: #555;
	}

	.content td, .content th, .content table, .content tbody, .content thead {
		border-color: #666;
		border-bottom: 1px solid #666;
	}

	/* Code */
	.content table pre, .content table code {
		/* Fixes <code> in tables */
		background-color: inherit;
		color: inherit;
	}

	/* Fix comments otherwise they are somewhat hard to read */
	span.hljs-comment {
		color: #554;
	}

	/* Table of Contents (the box to the right) */
	.toc {
		background: #252525;
		border-color: #111;
	}

	/* Editing and creating */
	form textarea.form-control, form input[type=text] {
		background: black;
		color: white;
		border-color: grey;
	}

	form textarea.form-control::placeholder, form input[type=text]::placeholder {
		color: darkgrey;
	}

	form#fileupload {
		background: black;
		color: white;
		border-color: grey;
	}

	.form-control:focus {
		border-color: #D7D7D7;
	}

	/* Footer */
	.content-sections .section h2 {
		color: #EEE;
	}

	.content-sections .section ul li a {
		color: #EEE;
	}

	/* Search */
	.search .result {
		border-bottom-color: rgba(255, 255, 255, 0.25);
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
