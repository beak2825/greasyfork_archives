// ==UserScript==
// @name bilibili忽略各种中配版
// @namespace giligili
// @version 1.0.0
// @description 简化番剧时间表
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match https://www.bilibili.com/anime/timeline/*
// @downloadURL https://update.greasyfork.org/scripts/439648/bilibili%E5%BF%BD%E7%95%A5%E5%90%84%E7%A7%8D%E4%B8%AD%E9%85%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/439648/bilibili%E5%BF%BD%E7%95%A5%E5%90%84%E7%A7%8D%E4%B8%AD%E9%85%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
let css = `a[title$='配版']{display:none!important}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
