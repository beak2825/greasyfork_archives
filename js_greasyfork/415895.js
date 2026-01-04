// ==UserScript==
// @name Pink Hue
// @namespace SPENGLER Scripts
// @version 0.3.3
// @description Adds a background hue to target websites (to identify PROD/DEV/QA)
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.online.tableau.com/*
// @downloadURL https://update.greasyfork.org/scripts/415895/Pink%20Hue.user.js
// @updateURL https://update.greasyfork.org/scripts/415895/Pink%20Hue.meta.js
// ==/UserScript==

(function() {
let css = `
  body {
    width: 100%;
    height: 100%;
    margin: 0; /* Space from this element (entire page) and others*/
    padding: 0; /*space from content and border*/
    border: solid LightPink;
    border-width: thick;
    overflow:hidden;
    display:block;
    box-sizing: border-box;
    background-color: LightPink;
  }
  .tb-app {
    background-color: LightPink;
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
