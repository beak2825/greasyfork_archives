// ==UserScript==
// @name Fedex.com - Dark Mode
// @namespace typpi.online
// @version 20241115.04.36
// @description Dark mode for Fedex!
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.fedex.com/*
// @downloadURL https://update.greasyfork.org/scripts/517987/Fedexcom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/517987/Fedexcom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Base dark mode filter */
	html {
		filter: invert(1) hue-rotate(0deg) !important;
		background: #ffffff;
	}

	img,
	video,
	#fx-global-header > div,
	#fx-global-footer > div.fdx-sjson-c-footer__bottom,
	#nuance-fab-container > button,
	trk-shared-icon > svg > use,
	header > nav,
	#container-2387742967
		> div
		> div
		> div
		> div:nth-child(n)
		> div
		> div.fxg-col,
	.fxg-landing-hero__background-image,
	.layout5.clearfix {
		filter: invert(1) hue-rotate(0deg) !important;
	}

	#container-2387742967 {
		filter: invert(1) hue-rotate(0deg) !important;
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
