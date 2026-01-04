// ==UserScript==
// @name teststyle
// @namespace example.com
// @version 1
// @description test style
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/487764/teststyle.user.js
// @updateURL https://update.greasyfork.org/scripts/487764/teststyle.meta.js
// ==/UserScript==

(function() {
let css = `body {
    background-color: black;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
