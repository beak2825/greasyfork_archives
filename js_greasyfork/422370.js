// ==UserScript==
// @name     B站直播间防休眠
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description 防止B站直播间自动停止播放
// @grant    none
// @include	 https://live.bilibili.com/*
// @include	 https://www.bilibili.com/blackboard/live/*
// @run-at   document-idle
// @version   2023.08.27+d75203f6
// @downloadURL https://update.greasyfork.org/scripts/422370/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%98%B2%E4%BC%91%E7%9C%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/422370/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%98%B2%E4%BC%91%E7%9C%A0.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/bilibili.com/live-anti-idle.user.ts
  (() => {
    setInterval(() => {
      setTimeout(() => {
        document.body.dispatchEvent(
          new MouseEvent("mousemove", { bubbles: true })
        );
      }, Math.random() * 2e3);
    }, 1e4);
  })();
})();
