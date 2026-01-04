// ==UserScript==
// @name Google Photos without slide transition
// @namespace https://greasyfork.org/users/971713
// @version 1.0
// @description Disable the sliding transition between photos and videos in Google Photos
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/453192/Google%20Photos%20without%20slide%20transition.user.js
// @updateURL https://update.greasyfork.org/scripts/453192/Google%20Photos%20without%20slide%20transition.meta.js
// ==/UserScript==

(function() {
let css = `.TTxCae {
    transform: matrix(1, 0, 0, 1, 0, 0) !important;
    opacity: 1 !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
