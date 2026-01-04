// ==UserScript==
// @name [Bilibili] 去他妈的评论区
// @namespace ckylin-style-deletefuckingcomments
// @version 1.0.1
// @description 移除网页版哔哩哔哩的评论区
// @author CKylinMC
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/412467/%5BBilibili%5D%20%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/412467/%5BBilibili%5D%20%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
let css = `
    #comment,
    .comment-m,
    .bb-comment,
    .forw-area
    {
        display:none!important;
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
