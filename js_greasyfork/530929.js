// ==UserScript==
// @name brawlhalla.com - Dark Mode
// @namespace typpi.online
// @version 1.1.0
// @description Dark Mode for Brawlhalla Website
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.brawlhalla.com/*
// @downloadURL https://update.greasyfork.org/scripts/530929/brawlhallacom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530929/brawlhallacom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	:root {
		--highlight: #30f1dd;
		--blue: #073747;
		--cyan: #0d5268;
		--blue-cyan: #0a475c;
		--off-white: #f3f3f3;
		--orange: #f49b0c;
		--yellow: #ffed2e;
		--dark-1: #0b283f;
	}

	/* Invert colors except images and videos */
	html,
	img,
	svg,
	video,
	iframe {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.svelte-xktl6u div.svelte-xktl6u div.svelte-xktl6u {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.container.svelte-mdwp6y.svelte-mdwp6y.svelte-mdwp6y.svelte-mdwp6y.svelte-mdwp6y {
		background: #fff !important;
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
