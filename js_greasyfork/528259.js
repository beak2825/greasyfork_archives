// ==UserScript==
// @name Disable Writefull (Overleaf Debloat)
// @namespace Gresh1234
// @version 1.0
// @description Gets rid of the margins and padding in the web.whatsapp.com interface.
// @author Gresh1234
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528259/Disable%20Writefull%20%28Overleaf%20Debloat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528259/Disable%20Writefull%20%28Overleaf%20Debloat%29.meta.js
// ==/UserScript==

(function() {
let css = `#writefull-toolbar-launcher {
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
