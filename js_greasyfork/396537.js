// ==UserScript==
// @name Example UserCSS style
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description testing this out
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.example.com/*
// @downloadURL https://update.greasyfork.org/scripts/396537/Example%20UserCSS%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/396537/Example%20UserCSS%20style.meta.js
// ==/UserScript==

(function() {
let css = `
  a {
    color: red;
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
