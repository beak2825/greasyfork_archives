// ==UserScript==
// @name Coveo AI Answer Removal
// @namespace https://greasyfork.org/en/users/844240-madmanmoon
// @version 1
// @description Removes annoying AI crap.
// @author MadManMoon
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/524032/Coveo%20AI%20Answer%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/524032/Coveo%20AI%20Answer%20Removal.meta.js
// ==/UserScript==

(function() {
let css = `div:has( > .CoveoGeneratedAnswer ), .CoveoGeneratedAnswer {
  display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
