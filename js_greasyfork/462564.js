// ==UserScript==
// @name hideretweet🐘
// @namespace editit
// @version 1.0.0
// @description hide retweet
// @author editit
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.o3o.ca/*
// @match *://*.m.cmx.im/*
// @downloadURL https://update.greasyfork.org/scripts/462564/hideretweet%F0%9F%90%98.user.js
// @updateURL https://update.greasyfork.org/scripts/462564/hideretweet%F0%9F%90%98.meta.js
// ==/UserScript==

(function() {
let css = `
    .status__prepend:has(>.status__prepend-icon-wrapper>i.fa-retweet.status__prepend-icon) + div {
        height: 0;
        min-height: 0;
        padding: 0;
    }

    div.status__wrapper:has(>.status__prepend>.status__prepend-icon-wrapper>i.fa-retweet.status__prepend-icon) {
        overflow: hidden;
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
