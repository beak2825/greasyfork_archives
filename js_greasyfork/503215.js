// ==UserScript==
// @name zattoo easily hide non-free channels
// @namespace usercss
// @version 0.0.1.20240810160754
// @description easily hide non-free channels from the channel list
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/503215/zattoo%20easily%20hide%20non-free%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/503215/zattoo%20easily%20hide%20non-free%20channels.meta.js
// ==/UserScript==

(function() {
let css = `section:has(svg)  {
visibility: hidden !important;
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
