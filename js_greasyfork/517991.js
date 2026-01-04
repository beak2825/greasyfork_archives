// ==UserScript==
// @name michigan.gov - Dark Mode
// @namespace typpi.online
// @version 20241107.04.44
// @description Michigan.gov Simple Dark Mode!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.michigan.gov/*
// @downloadURL https://update.greasyfork.org/scripts/517991/michigangov%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/517991/michigangov%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(png) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Ensure background images are not inverted */
	:is(html:not([stylus-iframe]), img, svg, video):not(
			z#z.z[z]
		) {
		background-color: inherit !important;
	}

	/* Additional styling for the Michigan Department of State */
	#footer > section > div > div > div > div > div.row {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	#footer
		> section
		> div
		> div
		> div
		> div
		> div.footer__section-logo
		> div
		> div
		> div.col-lg-3.col-md-4.footer__section-logo-img
		> img {
		filter: invert(0) hue-rotate(180deg) !important;
	}

	*[style*='background-image'] {
		filter: invert(1) hue-rotate(180deg);
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
