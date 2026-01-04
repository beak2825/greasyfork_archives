// ==UserScript==
// @name Strava Toolbox - Dark Mode
// @namespace typpi.online
// @version 1.0.2
// @description Dark mode for  Strava toolbox
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.marcellobrivio.com/*
// @downloadURL https://update.greasyfork.org/scripts/520814/Strava%20Toolbox%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520814/Strava%20Toolbox%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		#main #join.background_10,
		#footer
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	#main .menu,
	.button {
		border: 1px dashed #ff7152;
		background-color: #fff;
		color: #000;
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
