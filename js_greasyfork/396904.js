// ==UserScript==
// @name Readable Project Gutenberg
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Adds margins to books on Project Gutenberg.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gutenberg.org/*
// @downloadURL https://update.greasyfork.org/scripts/396904/Readable%20Project%20Gutenberg.user.js
// @updateURL https://update.greasyfork.org/scripts/396904/Readable%20Project%20Gutenberg.meta.js
// ==/UserScript==

(function() {
let css = `

p[id^="id"] {
   max-width:80%;
   margin-left:auto;
   margin-right:auto;
}

h1[id^="id"], h2[id^="id"], h3[id^="id"], h4[id^="id"], h5[id^="id"] {
   text-align:center;
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
