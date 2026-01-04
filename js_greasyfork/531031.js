// ==UserScript==
// @name powerpyx.com - Dark Mode
// @namespace typpi.online
// @version 1.0.1
// @description Dark Mode for PowerPyx.com
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.powerpyx.com/*
// @downloadURL https://update.greasyfork.org/scripts/531031/powerpyxcom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/531031/powerpyxcom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	html,
	img,
	svg,
	video,
	iframe,
	.footer-widgets,
	.site-footer, .site-footer a
	{
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
