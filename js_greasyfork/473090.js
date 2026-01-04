// ==UserScript==
// @name Remove IEEE Spectrum Nav Bar
// @namespace spectrum.ieee.org
// @version 1.2.0
// @description Fixes scrolling bug when using touch screens by simply removing the top navigation bar.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.spectrum.ieee.org/*
// @downloadURL https://update.greasyfork.org/scripts/473090/Remove%20IEEE%20Spectrum%20Nav%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/473090/Remove%20IEEE%20Spectrum%20Nav%20Bar.meta.js
// ==/UserScript==

(function() {
let css = `
  .announcement-show {
    display: none;
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
