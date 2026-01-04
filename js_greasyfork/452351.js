// ==UserScript==
// @name eBay Range Listing Removal
// @namespace https://joshcantco.de
// @version 1.0.0
// @description Removes range-priced items from your search results using simple CSS
// @author Joshua Fountain
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/452351/eBay%20Range%20Listing%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/452351/eBay%20Range%20Listing%20Removal.meta.js
// ==/UserScript==

(function() {
let css = `li.s-item:not(.s-item--watch-at-corner) {
    display: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
