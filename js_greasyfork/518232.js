// ==UserScript==
// @name Streams Black Night Mode
// @namespace typpi.online
// @version 20241116.05.47
// @description Black Mode for your streams
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.streameast.gd/*
// @match *://*.1stream.eu/*
// @match *://*.methstreamer.com/*
// @match *://*.chatango.com/*
// @match *://*.methstreams.com/*
// @downloadURL https://update.greasyfork.org/scripts/518232/Streams%20Black%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518232/Streams%20Black%20Night%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* General Inversion for Light Backgrounds */
	*,
	a {
		filter: invert(1) hue-rotate(180deg) !important;
		/* Invert and adjust hue */
	}

	/* Exclude Dark Mode Elements */
	*:not(
			[style*='background-color: #121212'],
			[style*='background-color: black']
		) {
		filter: none !important;
		/* Reset filter for dark backgrounds */
	}

	/* Specific Exclusions */
	body,
	#primaryNav,
	#primaryNav > div > div.primary-links > ul {
		background-color: #000 !important;
		/* Ensure body stays dark */
	}

	.dark-mode,
	[class*='dark'],
	[style*='background-color: #121212'],
	[style*='background-color: black'] {
		filter: none !important;
		/* Preserve dark mode elements */
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
