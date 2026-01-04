// ==UserScript==
// @name [jable]禁用评论功能
// @description 移除网页jable的评论区
// @author edit from CKylinMC
// @namespace style-deletefuckingcomments
// @version 1.0.0
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @include https://jable.tv/*
// @downloadURL https://update.greasyfork.org/scripts/502256/%5Bjable%5D%E7%A6%81%E7%94%A8%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502256/%5Bjable%5D%E7%A6%81%E7%94%A8%E8%AF%84%E8%AE%BA%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
let css = `
    #video_comments_video_comments
    {
        display:none!important;
    }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();