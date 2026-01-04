// ==UserScript==
// @name cppreference 中文样式调整
// @namespace windowsair-style-cppreference
// @version 0.0.1
// @description 修改cppreference中文站布局,使其更易阅读
// @author windowsair
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zh.cppreference.com/*
// @downloadURL https://update.greasyfork.org/scripts/431861/cppreference%20%E4%B8%AD%E6%96%87%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/431861/cppreference%20%E4%B8%AD%E6%96%87%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
let css = `
    code {
        line-height: 2.0em !important;
    }
    p {
        line-height: 1.5em !important;
    }
    i {
        margin-left: 0.1em;
        margin-right: 0.3em;
    }
    tbody {
        line-height: 1.4em;
    }
    .t-dsc > td {
        line-height: 1.4em !important;
    }
    .t-dsc > td:last-child {
        padding: 0.2em 0 0 0.75em !important;
    }
    .t-lines > span {
        line-height: 1.3em;
    }
    .cpp.source-cpp {
        line-height: 1.3em;
    }
    .t-nv {
        line-height: 1.3em !important;
    }
    .dsctable > tbody > tr > td {
        padding: 0.3em 0.1em 0.25em 0.75em !important;
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
