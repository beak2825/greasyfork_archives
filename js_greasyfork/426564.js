// ==UserScript==
// @name Bilibili 分P多行显示优化
// @namespace JimmyZJX
// @version 1.0.1
// @description 分P标题：换行显示
// @author JimmyZJX
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/426564/Bilibili%20%E5%88%86P%E5%A4%9A%E8%A1%8C%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426564/Bilibili%20%E5%88%86P%E5%A4%9A%E8%A1%8C%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    .multi-page .cur-list .list-box li {
        white-space: normal!important;
        height: auto!important;
        line-height: 20px!important;
        padding: 4px 10px!important;
        /* border-top: 1px solid gray; */
    }

    .multi-page .cur-list .list-box li a {
        align-items: center;
    }

    .multi-page .cur-list .list-box li:after {
        content: "";
        border-top: 1px solid #fff;
        display: block;
        transform: translateY(5px);
    }

    .multi-page .cur-list .list-box li .duration {
        margin-left: 5px;
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
