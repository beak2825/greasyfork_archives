// ==UserScript==
// @name itch.io small user tools
// @namespace https://mkps.app/
// @version 1.0.2
// @description Prevents itch.io game page user tools from covering page content on large screens
// @author MK
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.itch.io/*
// @downloadURL https://update.greasyfork.org/scripts/526609/itchio%20small%20user%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/526609/itchio%20small%20user%20tools.meta.js
// ==/UserScript==

(function() {
let css = `
	.user_tools {
		position: static;
		margin: 0;
		white-space: nowrap;
		overflow: auto;
		text-align: left;
		padding: 8px 0 8px 10px;
		background: #2b2b2b;
		background: var(--itchio_ui_bg_dark, #2b2b2b);
		width: 100%;
		box-sizing: border-box;
		box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.5);
	}

	.user_tools > li {
		display: inline-block;
		vertical-align: top;
		margin: 0 10px 0 0;
	}

	.user_tools .action_btn {
		font-size: 13px;
		padding: 0 6px;
		height: 26px;
	}

	.randomizer_embed .user_tools {
		display: none;
	}

	.user_tools, .user_tools.hidden {
		opacity: unset;
		transition: unset;
		transform: unset;
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
