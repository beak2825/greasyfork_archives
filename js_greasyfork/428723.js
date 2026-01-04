// ==UserScript==
// @name AlloCine - ByPass v.1.1 - UserCSS (userstyle)
// @namespace allocine.fr
// @version 1.01.0
// @description AlloCiné sans Nag Screen
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.allocine.fr/*
// @downloadURL https://update.greasyfork.org/scripts/428723/AlloCine%20-%20ByPass%20v11%20-%20UserCSS%20%28userstyle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428723/AlloCine%20-%20ByPass%20v11%20-%20UserCSS%20%28userstyle%29.meta.js
// ==/UserScript==

(function() {
let css = `

/* ==== AlloCine - ByPass v.1 ==== */

body.didomi-popup-open {
    overflow: visible !important;
}
#didomi-host .didomi-popup__backdrop {
    z-index: 2147483641;
    display: none !important;
}

/* ==== END ==== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
