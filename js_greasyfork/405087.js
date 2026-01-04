// ==UserScript==
// @name Make Matters Wide Again
// @namespace im.outv.stylus.matters
// @version 1.0.2
// @description Give a wider main column for Matters.news.
// @author Outvi V (github.com/outloudvi)
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.matters.news/*
// @downloadURL https://update.greasyfork.org/scripts/405087/Make%20Matters%20Wide%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/405087/Make%20Matters%20Wide%20Again.meta.js
// ==/UserScript==

(function() {
let css = `
    main {
      max-width: 85vw !important;
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
