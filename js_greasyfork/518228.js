// ==UserScript==
// @name greasyfork.org - Dark Mode
// @namespace typpi.online
// @version 2.2
// @description Dark Mode for Greasyfork.org
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.greasyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/518228/greasyforkorg%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518228/greasyforkorg%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		h3,
		#script-info header h2
	),
	header,
	#script-description {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Ensure background images are not inverted */
	:is(html:not([stylus-iframe]), img, svg, video) {
		background-color: inherit !important;
	}

	#site-name > a {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	#greasyfork-plus-options > ul,
	h3,
	h2 {
		color: #670000;
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
