// ==UserScript==
// @name Dark mode for Simon Tatham's Portable Puzzle Collection
// @namespace https://github.com/Calciferz
// @version 1.0.1
// @description Very simple dark mode for webassembly rendered canvas
// @author Calcifer
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chiark.greenend.org.uk/*
// @downloadURL https://update.greasyfork.org/scripts/518261/Dark%20mode%20for%20Simon%20Tatham%27s%20Portable%20Puzzle%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/518261/Dark%20mode%20for%20Simon%20Tatham%27s%20Portable%20Puzzle%20Collection.meta.js
// ==/UserScript==

(function() {
let css = `
  html {
    background: #ddd;
    filter: invert(1) hue-rotate(230deg) contrast(1.2);
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
