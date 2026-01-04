// ==UserScript==
// @name Bilibili弹幕投票屏蔽
// @namespace http://tampermonkey.net/
// @version 1.4.1
// @description 挡住我看老婆了
// @author CLDXiang
// @website https://github.com/CLDXiang/tampermonkey
// @license MIT
// @match *://*bilibili.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/427757/Bilibili%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/427757/Bilibili%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/shared/css.ts
  function insertStyle(css, key) {
    const style = document.createElement("style");
    style.innerHTML = css;
    if (key)
      style.dataset[key] = "";
    document.head.appendChild(style);
  }

  // src/hide-bili-vote/main.mts
  insertStyle(".bilibili-player-video-popup-vote,.bili-vote { display: none !important; }");
})();
