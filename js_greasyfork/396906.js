// ==UserScript==
// @name Dreamwidth - Fade out inactive icons
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Fades out inactive icons when you're looking at your own icons page.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.dreamwidth.org/*
// @downloadURL https://update.greasyfork.org/scripts/396906/Dreamwidth%20-%20Fade%20out%20inactive%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/396906/Dreamwidth%20-%20Fade%20out%20inactive%20icons.meta.js
// ==/UserScript==

(function() {
let css = `

.icon-container .icon.icon-inactive img {
	opacity: 0.3;
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
