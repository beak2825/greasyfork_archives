// ==UserScript==
// @name Chinese Font Fix
// @namespace uxin.ca
// @version 1.0
// @description Force PingFang on some sites
// @license Unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.uxin.ca/*
// @downloadURL https://update.greasyfork.org/scripts/480854/Chinese%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/480854/Chinese%20Font%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
    .book-content {
        font-family: "PingFang SC" !important;
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
