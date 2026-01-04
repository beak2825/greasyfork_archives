// ==UserScript==
// @name UserScript Template
// @namespace typpi.online
// @version 1.0.3
// @description Description
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*./*
// @downloadURL https://update.greasyfork.org/scripts/519991/UserScript%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/519991/UserScript%20Template.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	html,
	img,
	svg,
	video,
	iframe {
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
