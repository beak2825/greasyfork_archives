// ==UserScript==
// @name         Bilibili 自动跳转到上次观看的选集
// @namespace    http://tampermonkey.net/
// @version      2025-03-31
// @description  进入视频后自动跳转到上次观看的选集（代替用户点击‘跳转播放’）
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506332/Bilibili%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8A%E6%AC%A1%E8%A7%82%E7%9C%8B%E7%9A%84%E9%80%89%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/506332/Bilibili%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8A%E6%AC%A1%E8%A7%82%E7%9C%8B%E7%9A%84%E9%80%89%E9%9B%86.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const timer = setInterval(() => {
    document.querySelector(".bpx-player-toast-confirm")?.click() &&
      clearInterval(timer);
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
  }, 1000 * 10);
})();
