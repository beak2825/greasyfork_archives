// ==UserScript==
// @name nytimes.com - Dark Mode Simple
// @namespace typpi.online
// @version 20241106.05.28
// @description Dark New York Times Simple!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nytimes.com/*
// @downloadURL https://update.greasyfork.org/scripts/517994/nytimescom%20-%20Dark%20Mode%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/517994/nytimescom%20-%20Dark%20Mode%20Simple.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(
			z#z.z[z],
			svg,
			a > img
		) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Ensure background images are not inverted */
	:is(html:not([stylus-iframe]), img, svg, video):not(
			z#z.z[z]
		) {
		background-color: inherit !important;
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
