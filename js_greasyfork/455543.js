// ==UserScript==
// @name        在B站网页端个性装扮预览页启用滚动
// @namespace   myitian.bili.enableScrollingOnPreviewPage
// @version     1.0
// @description 对B站网页端的个性装扮预览页iframe启用滚动
// @author      Myitian
// @license     Unlicense
// @match       https://www.bilibili.com/blackboard/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/455543/%E5%9C%A8B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%AA%E6%80%A7%E8%A3%85%E6%89%AE%E9%A2%84%E8%A7%88%E9%A1%B5%E5%90%AF%E7%94%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455543/%E5%9C%A8B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%AA%E6%80%A7%E8%A3%85%E6%89%AE%E9%A2%84%E8%A7%88%E9%A1%B5%E5%90%AF%E7%94%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

var ele = document.querySelector("body>main.main-page>section.left-panel>iframe.preview");
if (ele) ele.style = "z-index:0;pointer-events:all;";