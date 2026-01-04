// ==UserScript==
// @name Rust 文档样式优化
// @namespace fireloong
// @version 0.0.2
// @description Rust 文档样式优化显示
// @author Itsky71
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://doc.rust-lang.org/*
// @downloadURL https://update.greasyfork.org/scripts/514356/Rust%20%E6%96%87%E6%A1%A3%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/514356/Rust%20%E6%96%87%E6%A1%A3%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    #help code {
        white-space: pre-wrap;
        background-color: #f5f5f5;
        border-radius: 3px;
        padding: 0 0.125em;
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
