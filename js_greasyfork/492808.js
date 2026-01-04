// ==UserScript==
// @name 调整归属地样式间距 5px
// @namespace https://userstyles.world/user/mscststs
// @version 20240907.05.55
// @description 调整评论区ip和时间的间距
// @author mscststs
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/492808/%E8%B0%83%E6%95%B4%E5%BD%92%E5%B1%9E%E5%9C%B0%E6%A0%B7%E5%BC%8F%E9%97%B4%E8%B7%9D%205px.user.js
// @updateURL https://update.greasyfork.org/scripts/492808/%E8%B0%83%E6%95%B4%E5%BD%92%E5%B1%9E%E5%9C%B0%E6%A0%B7%E5%BC%8F%E9%97%B4%E8%B7%9D%205px.meta.js
// ==/UserScript==

(function() {
let css = `
    .bili-comment.browser-pc .reply-time,
    .bili-comment.browser-pc .sub-reply-time
    {
        margin-right: 5px !important;
    }

    :root{
        --kaihe-ml: 5px;
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
