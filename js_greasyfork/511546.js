// ==UserScript==
// @name Bilibili 隐藏页脚
// @namespace bilibili_hide_footer
// @version 1.0.0
// @description 隐藏 Bilibili 的页脚
// @author lingbopro
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/511546/Bilibili%20%E9%9A%90%E8%97%8F%E9%A1%B5%E8%84%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/511546/Bilibili%20%E9%9A%90%E8%97%8F%E9%A1%B5%E8%84%9A.meta.js
// ==/UserScript==

(function() {
let css = `
    /* 移除页脚 */
    .footer, .help-footer, .bili-footer {
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
