// ==UserScript==
// @name Unroll.me Dark Mode
// @namespace Unroll.me
// @version 20241013.22.60
// @description Dark Mode for Unroll.me
// @author Nick2bad4u
// @license The UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.unroll.me/*
// @downloadURL https://update.greasyfork.org/scripts/513429/Unrollme%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/513429/Unrollme%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    filter: invert(1);
    /*            background-color: black; */
  }
  img:not(.mwe-math-fallback-image-display):not(.mwe-math-fallback-image-inline):not(
      img[alt='GPS']
    ) {
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
