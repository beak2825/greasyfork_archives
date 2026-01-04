// ==UserScript==
// @name no more view counts
// @namespace rinsuki.net
// @version 1.0.1
// @description A new userstyle
// @author rinsuki
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/457025/no%20more%20view%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/457025/no%20more%20view%20counts.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    article[data-testid="tweet"] div[role="group"] > div:has(a[href$="/analytics"]):not(:only-child) {
        display: none;
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
