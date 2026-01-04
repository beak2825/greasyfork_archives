// ==UserScript==
// @name Remove Falabella Sponsored
// @namespace Gresh1234
// @version 1.0
// @description Gets rid of sponsored product placement in the falabella interface.
// @author Gresh1234
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528262/Remove%20Falabella%20Sponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/528262/Remove%20Falabella%20Sponsored.meta.js
// ==/UserScript==

(function() {
let css = `.styles-module_sponsored-brand-container__DYujK {
      display: none
    }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
