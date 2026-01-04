// ==UserScript==
// @name codacy.com
// @namespace typpi.online
// @version 1.0.1
// @description Description
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.codacy.com/*
// @downloadURL https://update.greasyfork.org/scripts/543729/codacycom.user.js
// @updateURL https://update.greasyfork.org/scripts/543729/codacycom.meta.js
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
