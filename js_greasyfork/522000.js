// ==UserScript==
// @name garminrumors.com - Dark Theme
// @namespace typpi.online
// @version 1.0.2
// @description Dark theme for Garmin Rumours
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.garminrumors.com/*
// @downloadURL https://update.greasyfork.org/scripts/522000/garminrumorscom%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/522000/garminrumorscom%20-%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
			html:not([stylus-iframe]),
			img,
			svg,
			video,
			#uc_ue_listing_carousel_elementor_1d30439 *
		):not(
			.elementor-910
				.elementor-element.elementor-element-a5979ca
				img
		) {
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
