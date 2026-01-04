// ==UserScript==
// @name FlowUs 样式
// @namespace prettylikeme
// @version 0.1.0
// @description FlowUs 溪流页面的显示样式
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.flowus.cn/*
// @downloadURL https://update.greasyfork.org/scripts/497996/FlowUs%20%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497996/FlowUs%20%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
    tbody > tr:first-child td {
        font-weight: bold;
        color: white;
        background: black;
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
