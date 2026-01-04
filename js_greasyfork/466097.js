// ==UserScript==
// @name Lenna's Fet Tag Request Hider v2
// @namespace https://lenna.gay
// @version 0.5.1
// @description Removes tag requests on a notice page that supports Fet.
// @author MissLenna
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/466097/Lenna%27s%20Fet%20Tag%20Request%20Hider%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/466097/Lenna%27s%20Fet%20Tag%20Request%20Hider%20v2.meta.js
// ==/UserScript==

(function() {
let css = `#friendship-requests .mb4:first-of-type {
    display:none!important;
  }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
