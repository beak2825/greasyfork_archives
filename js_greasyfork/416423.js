// ==UserScript==
// @name readmanganato (former manganelo) - continous reading
// @namespace aningan@zoho.com
// @version 1.1.1
// @description Style for readmanganato (former manganelo) that removes margins between pages, makes reading continous.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.manganelo.com/*
// @match *://*.readmanganato.com/*
// @downloadURL https://update.greasyfork.org/scripts/416423/readmanganato%20%28former%20manganelo%29%20-%20continous%20reading.user.js
// @updateURL https://update.greasyfork.org/scripts/416423/readmanganato%20%28former%20manganelo%29%20-%20continous%20reading.meta.js
// ==/UserScript==

(function() {
let css = `
	/*Removes margins from images in the reading area*/
	.container-chapter-reader > img {
		margin-top: 0px !important;
		margin-bottom: 0px !important;
		padding-top: 0px !important;
		padding-bottom: 0px !important;
	}
    
        .container-chapter-reader > div[style*="block"] {
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
