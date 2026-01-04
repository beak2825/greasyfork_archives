// ==UserScript==
// @name My Custom Style
// @namespace http://example.com
// @version 1.0
// @description This is a custom style to enhance the appearance of a website.
// @author Your Name
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/516291/My%20Custom%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/516291/My%20Custom%20Style.meta.js
// ==/UserScript==

(function() {
let css = `/* Your custom CSS goes here */
body {
    background-color: #f0f0f0;
    color: #333;
}

a {
    color: #007BFF;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
