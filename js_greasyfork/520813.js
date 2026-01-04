// ==UserScript==
// @name mywindsock.com - Dark Mode
// @namespace typpi.online
// @version 1.0.3
// @description Dark mode for MyWindSock
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mywindsock.com/*
// @downloadURL https://update.greasyfork.org/scripts/520813/mywindsockcom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520813/mywindsockcom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		#app_btns,
		.hide_show,
		#splash-overlay,
		#splash,
		#chartarea
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}
	#options-underlay,
	#login-underlay,
	#notice-underlay,
	.underlay,
	#chartarea_premium {
		opacity: 0%;
	}
	#premium-chart-cta,
	#chartarea_premium,
	#popup-modal,
	#popup_modal_underlay {
		display: none !important;
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
