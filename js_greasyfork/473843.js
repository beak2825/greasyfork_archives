// ==UserScript==
// @name         BiliBili 长按加速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  长按 Tab 键加速 3 倍
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473843/BiliBili%20%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/473843/BiliBili%20%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("keydown", (event) => {
    const video = document.querySelector("video");
    if (!video) return;
    if (event.keyCode === 9) {
      video.playbackRate = 2;
      event.preventDefault();
    }
  });

  document.addEventListener("keyup", (event) => {
    const video = document.querySelector("video");
    if (!video) return;
    if (event.keyCode === 9) {
      video.playbackRate = 1;
      event.preventDefault();
    }
  });
})();
