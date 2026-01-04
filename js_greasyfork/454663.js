// ==UserScript==
// @name True Black Ars Technica
// @namespace https://arstechnica.com*
// @version 1.0.0
// @description Better blacken the Ars Technica dark theme.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.arstechnica.com/*
// @downloadURL https://update.greasyfork.org/scripts/454663/True%20Black%20Ars%20Technica.user.js
// @updateURL https://update.greasyfork.org/scripts/454663/True%20Black%20Ars%20Technica.meta.js
// ==/UserScript==

(function() {
let css = `

body, #content, footer#page-footer {
   background-color: black !important;
}

.thick-divide-top {
   border-top: 1px solid;
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
