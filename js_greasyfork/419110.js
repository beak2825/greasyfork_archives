// ==UserScript==
// @name YouTube Dark Search Suggestions Box
// @namespace gitlab.com/Neui/userstyles
// @version 1.0.2
// @description Makes YouTubes search suggestions box also dark when in dark mode
// @author Neui
// @homepageURL https://gitlab.com/Neui/userstyles
// @supportURL https://gitlab.com/Neui/userstyles/issues
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/419110/YouTube%20Dark%20Search%20Suggestions%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/419110/YouTube%20Dark%20Search%20Suggestions%20Box.meta.js
// ==/UserScript==

(function() {
let css = `
	html[dark] .gsfs, /* Main thing */
	html[dark] .sbfl_b, /* Report autocompletion line */
	html[dark] .sbsb_a, /* Top/bottom border */
	html[dark] .sbdd_b /* Final border */ {
		background: hsla(0, 0%, 8%, .8) !important;
		border-color: black;
	}

	/* Make main text white to be readable */
	html[dark] .gsfs { color: white !important; }

	/* Seach entry hover */
	html[dark] .sbsb_d { background: hsla(0, 0%, 20%, .8) !important; }

	/* Remove this to get rid of the border */
	html[dark] .sbdd_b /* Final border */ {
		border-top: 1px solid;
		border-color: #3a3b42 /* #1c62b9 */ ;
	}

	/* To the left of each result is a search icon whose colour needs adjusting. */
	html[dark] .sbqs_c::before {
		background-image: url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNy4zOTE3IDE2LjgwODNMMTIuNzMzMyAxMi4xNUMxMy42MjUgMTEuMTI1IDE0LjE2NjcgOS43OTE2NyAxNC4xNjY3IDguMzMzMzNDMTQuMTY2NyA1LjEwODMzIDExLjU1ODMgMi41IDguMzMzMzMgMi41QzUuMTA4MzMgMi41IDIuNSA1LjEwODMzIDIuNSA4LjMzMzMzQzIuNSAxMS41NTgzIDUuMTA4MzMgMTQuMTY2NyA4LjMzMzMzIDE0LjE2NjdDOS43OTE2NyAxNC4xNjY3IDExLjEyNSAxMy42MjUgMTIuMTUgMTIuNzQxN0wxNi44MDgzIDE3LjRMMTcuMzkxNyAxNi44MDgzWk04LjMzMzMzIDEzLjMzMzNDNS41NzUgMTMuMzMzMyAzLjMzMzMzIDExLjA5MTcgMy4zMzMzMyA4LjMzMzMzQzMuMzMzMzMgNS41NzUgNS41NzUgMy4zMzMzMyA4LjMzMzMzIDMuMzMzMzNDMTEuMDkxNyAzLjMzMzMzIDEzLjMzMzMgNS41NzUgMTMuMzMzMyA4LjMzMzMzQzEzLjMzMzMgMTEuMDkxNyAxMS4wOTE3IDEzLjMzMzMgOC4zMzMzMyAxMy4zMzMzWiIgZmlsbD0iI2YzZjNmMyIvPjwvc3ZnPg==");
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
