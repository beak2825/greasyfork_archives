// ==UserScript==
// @name nbcwashington.com - Dark Mode
// @namespace typpi.online
// @version 20241107.04.55
// @description NBC Washington Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nbcwashington.com/*
// @downloadURL https://update.greasyfork.org/scripts/517993/nbcwashingtoncom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/517993/nbcwashingtoncom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(png) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	[style*='text-decoration'] {
		filter: invert(1) hue-rotate(180deg) !important;
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
