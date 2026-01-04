// ==UserScript==
// @name Example UserCSS style1
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description I took this from https://github.com/openstyles/stylus/wiki/UserCSS-authors
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.example.com/*
// @downloadURL https://update.greasyfork.org/scripts/391902/Example%20UserCSS%20style1.user.js
// @updateURL https://update.greasyfork.org/scripts/391902/Example%20UserCSS%20style1.meta.js
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
