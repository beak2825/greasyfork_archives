// ==UserScript==
// @name ArtStation Show Mature Content
// @namespace https://sleazyfork.org/users/1468364
// @version 1.1
// @description Show mature content without requiring login
// @license public domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.artstation.com/*
// @downloadURL https://update.greasyfork.org/scripts/544055/ArtStation%20Show%20Mature%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/544055/ArtStation%20Show%20Mature%20Content.meta.js
// ==/UserScript==

(function() {
let css = `
	.matureContent,
	.mature-content-label {
		display: none !important;
	}
	.img-blur,
	.matureContent-blur {
		filter: none !important;
	}
	.matureContent-hide {
		opacity: 1 !important;
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
