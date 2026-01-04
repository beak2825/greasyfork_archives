// ==UserScript==
// @name kom.club - Dark Mode
// @namespace typpi.online
// @version 1.0.2
// @description Dark mode for KOM.club website
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.kom.club/*
// @downloadURL https://update.greasyfork.org/scripts/520802/komclub%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520802/komclub%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video),
	#main-banner {
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
