// ==UserScript==
// @name My Custom Style
// @namespace https://example.com
// @version 1.0
// @description A custom CSS style to improve the appearance of a website.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/529969/My%20Custom%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/529969/My%20Custom%20Style.meta.js
// ==/UserScript==

(function() {
let css = `/* Your custom styles go here */

/* Example: Change background color of the body */
body {
    background-color: #f0f0f0;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
