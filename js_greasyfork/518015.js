// ==UserScript==
// @name fivethirtyeight.com Dark Mode
// @namespace typpi.online
// @version 20241106.04.60
// @description fivethirtyeight.com Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.projects.fivethirtyeight.com/*
// @downloadURL https://update.greasyfork.org/scripts/518015/fivethirtyeightcom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518015/fivethirtyeightcom%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(
			z#z.z[z],
			a.logo > img,
			a.abclogo > img
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
