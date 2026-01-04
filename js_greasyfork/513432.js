// ==UserScript==
// @name Wigle.net Dark Mode
// @namespace wigle.net
// @version 20240926.22.60
// @description Dark Mode for Wigle.net
// @author Nick2bad4u
// @license The UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wigle.net/*
// @downloadURL https://update.greasyfork.org/scripts/513432/Wiglenet%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/513432/Wiglenet%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    filter: invert(1);
    /*            background-color: black; */
  }
  img:not(.mwe-math-fallback-image-display):not(.mwe-math-fallback-image-inline):not(
      img[alt='GPS']
    ):not(img[alt='Cell']):not(img[alt='WiFi']):not(img[alt='BT']) {
    filter: invert(1);
  }
  .mw-logo {
    filter: invert(100%);
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
