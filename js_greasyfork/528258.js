// ==UserScript==
// @name Embiggen WhatsApp Web
// @namespace Gresh1234
// @version 1.0.0
// @description Gets rid of the margins and padding in the web.whatsapp.com interface.
// @author Gresh1234
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528258/Embiggen%20WhatsApp%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/528258/Embiggen%20WhatsApp%20Web.meta.js
// ==/UserScript==

(function() {
let css = `.app-wrapper-web ._aigs:not(._as6h) {
      width: calc(100%);
      height: calc(100%);
      top: 0px;
      max-width: 100%;
    }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
