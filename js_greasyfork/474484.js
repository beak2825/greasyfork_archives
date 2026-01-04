// ==UserScript==
// @name        B站自动点赞收藏
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/11/9 15:06:11
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474484/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/474484/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

window.onload = function() {
  // 点赞
  setTimeout(() => {
    document.querySelector(".video-like").click();
  }, 3000);
  // 收藏
  setTimeout(() => {
    document.querySelector(".video-fav").click();
  }, 3000);
  setTimeout(() => {
    document.querySelector(".fav-title").click();
  }, 5000);
  setTimeout(() => {
    document.querySelector(".submit-move").click();
  }, 5000);
}
