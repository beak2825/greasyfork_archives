// ==UserScript==
// @name Lainchan - Centered posts
// @namespace death
// @version 26-06-2025
// @description center OP threads and posts on Lainchan. Based on https://userstyles.world/style/8693/4chan-centered
// @grant GM_addStyle
// @run-at document-start
// @match *://*.lainchan.org/*
// @downloadURL https://update.greasyfork.org/scripts/544338/Lainchan%20-%20Centered%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/544338/Lainchan%20-%20Centered%20posts.meta.js
// ==/UserScript==

(function() {
let css = `
.thread {
        width: 64% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    .post {
        width: 100% !important;
    }

    header, .bar.top, .bar.bottom {
        width: 64% !important;
        margin-left: auto !important;
        margin-right: auto !important;
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
