// ==UserScript==
// @name         百度百科美化
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  精简页面
// @author       Silver
// @match        *://baike.baidu.com/item/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397231/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397231/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var listByClassName = [
    "header-wrapper", // 顶栏
    "navbar-wrapper", // 导航栏
    "lemmaWgt-searchHeader", // 悬浮搜索框
    "posterFlag", // 特色词条图标
    "btn-list", // 编辑、讨论等按钮
    "audio-play", // 播报按钮
    "edit-icon", // 编辑按钮
    "top-tool", // 收藏、点赞、转发等按钮
    "second-container", // 顶部介绍视频
    "side-content", // 侧边栏
    "after-content", // 底部推荐、猜你喜欢
    "wgt-footer-main", // 底栏
    "new-bdsharebuttonbox", // QQ空间、微博、微信等转发
    "tashuo-bottom", // “他说”
  ];

  var done = false;
  while (!done) {
    done = true;
    for (var i = 0, len = listByClassName.length; i < len; ++i) {
      var items = document.getElementsByClassName(listByClassName[i]);
      if (items.length > 0) done = false;
      else continue;
      while (items.length > 0) items[0].remove();
    }
  }
  console.log("Done.");
  var content = document.getElementsByClassName("main-content")[0];
  content.style.fontFamily = "sans-serif";
  content.style.fontWeight = "500";
})();
