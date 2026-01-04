// ==UserScript==
// @name YouTube - Hide End Cards (unless hovering)
// @namespace lednerg
// @version 20.10.11
// @description Hides those big links that sometimes show up over the endings of videos -- unless you hover over the player.
// @author lednerg
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/408725/YouTube%20-%20Hide%20End%20Cards%20%28unless%20hovering%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408725/YouTube%20-%20Hide%20End%20Cards%20%28unless%20hovering%29.meta.js
// ==/UserScript==

(function() {
let css = `

   div[class*="video-player"]:not(:hover) div[class^="ytp-ce"],
   div[class*="ytp-autohide"] div[class^="ytp-ce"] {
      display: none !important;
   }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
