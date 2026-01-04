// ==UserScript==
// @name Disable All CSS Animations
// @namespace url(http://www.w3.org/1999/xhtml);
// @version 1.0.0
// @description Disable all CSS animations.
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/396868/Disable%20All%20CSS%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/396868/Disable%20All%20CSS%20Animations.meta.js
// ==/UserScript==

(function() {
let css = `*, *:before, *:after {
/*CSS transitions*/
-o-transition-property: none !important;
-moz-transition-property: none !important;
-ms-transition-property: none !important;
-webkit-transition-property: none !important;
transition-property: none !important;

/*CSS transforms*/
-o-transform: none !important;
-moz-transform: none !important;
-ms-transform: none !important;
-webkit-transform: none !important;
transform: none !important;

/*CSS animations*/
-webkit-animation: none !important;
-moz-animation: none !important;
-o-animation: none !important;
-ms-animation: none !important;
animation: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
