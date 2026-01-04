// ==UserScript==
// @name Dark Google Workplace
// @namespace djshigel
// @version 0.2
// @description Darken Google Spreadsheets and the others
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528884/Dark%20Google%20Workplace.user.js
// @updateURL https://update.greasyfork.org/scripts/528884/Dark%20Google%20Workplace.meta.js
// ==/UserScript==

(function() {
let css = `@media (prefers-color-scheme: dark) {
    html {
        filter: invert() hue-rotate(180deg) contrast(0.85);
    }
 
    div[jsdata="deferred-i2"] {
        filter: invert() hue-rotate(180deg) contrast(0.85);
    }
 
    iframe, img, svg:has(image) {
        filter: contrast(1.05) hue-rotate(180deg) invert();
    }
 
    mat-card {
        box-shadow: 0 0 1px 1px #aaa !important;
    }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
