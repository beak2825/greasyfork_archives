// ==UserScript==
// @name Be grayscale!
// @namespace https://greasyfork.org/ja/users/135110-shino
// @version 1.0.1
// @description Joke style to make all websites grayscale. Turn it on only if you need it.
// @author shino
// @license Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/420864/Be%20grayscale%21.user.js
// @updateURL https://update.greasyfork.org/scripts/420864/Be%20grayscale%21.meta.js
// ==/UserScript==

(function() {
let css = `html, body{
    -webkit-filter: grayscale(1);
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    background:url('https://localhost');
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
