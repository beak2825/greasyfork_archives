// ==UserScript==
// @name [Bilibili] 去他妈的评分
// @namespace ckylin-style-deletefuckingscores
// @version 1.0.0
// @description 移除网页版哔哩哔哩的番剧点评和评分
// @author CKylinMC
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match https://www.bilibili.com/bangumi/play/*
// @match https://www.bilibili.com/bangumi/media/*
// @match https://search.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/420673/%5BBilibili%5D%20%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/420673/%5BBilibili%5D%20%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.bilibili.com/bangumi/play/")) {
  css += `
      .media-rating,.btn-rating,#review_module{
          display:none;
      }
      .webkit-ellipsis{
          -webkit-line-clamp:unset!important;
      }
  `;
}
if (location.href.startsWith("https://www.bilibili.com/bangumi/media/")) {
  css += `
      .media-info-score,.bangumi-media{
          display:none;
      }
      .media-tab-nav>ul>li:nth-child(2),.media-tab-nav>ul>li:nth-child(3){
          display:none;
      }
  `;
}
if (location.href.startsWith("https://search.bilibili.com/")) {
  css += `
      div.score{
          display:none;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
