// ==UserScript==
// @name Typeracer Dark Theme
// @namespace askplays
// @version 2.2.7
// @description A UserCSS stylesheet to give Typeracer a dark theme.
// @author AskPlays
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/420512/Typeracer%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/420512/Typeracer%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `.main {
  background-color: #0a151f;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
