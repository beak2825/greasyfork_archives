// ==UserScript==
// @name GMAIL Highlight Unread mail v.2.1
// @namespace https://userstyles.world/user/decembre
// @version 2.1.0
// @description Gmail unread email with more darker background
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/448900/GMAIL%20Highlight%20Unread%20mail%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/448900/GMAIL%20Highlight%20Unread%20mail%20v21.meta.js
// ==/UserScript==

(function() {
let css = `

/* === 0- GMAIL Highlight Unread mail v.2  ==== */

/* MAIL NOT READ */

/* BACKROUND */
.zA:not(.yO) {
    background: #dfe6ef !important;
}

/* BOLDER */
.zA:not(.yO) .xS span  .bqe {
    font-family: arial !important;
    font-weight: 600 !important;
/* color: red !important; */
/* background: blue !important; */
}

/* ==== END ==== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
