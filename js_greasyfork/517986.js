// ==UserScript==
// @name abcnews.go.com - Dark Mode
// @namespace typpi.online
// @version 20241106.05.19
// @description ABCNews.go.com - Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.abc12.com/*
// @downloadURL https://update.greasyfork.org/scripts/517986/abcnewsgocom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/517986/abcnewsgocom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(
			z#z.z[z],
			svg,
			a > img,
			#site-footer-container
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
