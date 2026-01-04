// ==UserScript==
// @name joyn easily hide non-free/vod channels
// @namespace usercss
// @version 0.0.1.20240810162741
// @description easily hide non-free/vod channels from the channel list
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/503218/joyn%20easily%20hide%20non-freevod%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/503218/joyn%20easily%20hide%20non-freevod%20channels.meta.js
// ==/UserScript==

(function() {
let css = `li:has(svg)  {
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
