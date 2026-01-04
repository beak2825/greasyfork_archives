// ==UserScript==
// @name reversi style fix for tag hider
// @namespace ao3reversi
// @version 0.0.1.20230414144729
// @description custom css
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/464009/reversi%20style%20fix%20for%20tag%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/464009/reversi%20style%20fix%20for%20tag%20hider.meta.js
// ==/UserScript==

(function() {
let css = `.dropdown-menu {color: #eee;}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
