// ==UserScript==
// @name asus.com - Dark Mode
// @namespace typpi.online
// @version 1.0.2
// @description Easy Dark mode for Asus
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.asus.com/*
// @downloadURL https://update.greasyfork.org/scripts/537237/asuscom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/537237/asuscom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	html,
	img,
	svg,
	video,
	iframe,
	[dir] .Header__headerWrapper__4ipKk,
	.Footer__footerContainer__4paCr,
	.mobileMenu.Header__headerMenu__lncT7 {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.Header__header__iNAJ6 *
	{
		fill: red !important;
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
