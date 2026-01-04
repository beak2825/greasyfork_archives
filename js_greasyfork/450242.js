// ==UserScript==
// @name Reddit Inline Ad Removal
// @namespace cascadea2369008074
// @version 1.0.0
// @description Finds all CSS classes that contain "promotedlink" and hides them.
// @author Michael Spurlock
// @license CC
// @grant GM_addStyle
// @run-at document-start
// @match *://*.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/450242/Reddit%20Inline%20Ad%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/450242/Reddit%20Inline%20Ad%20Removal.meta.js
// ==/UserScript==

(function() {
let css = `
	
	[class*="promotedlink"] {
		display: none;
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
