// ==UserScript==
// @name favero.com - Dark Mode
// @namespace typpi.online
// @version 1.0.2
// @description Dark mode for Favero.com
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.favero.com/*
// @downloadURL https://update.greasyfork.org/scripts/521683/faverocom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/521683/faverocom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		.bg-dark-grey,
		.footer
	),
	p.legalese {
		filter: invert(1) hue-rotate(180deg);
	}

	.header .logo a img,
	.header .icon-cart {
		filter: unset !important;
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
