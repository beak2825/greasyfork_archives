// ==UserScript==
// @name         禁用B站直播间活动样式
// @namespace    https://greasyfork.org/users/350509
// @version      0.2
// @description  将部分进行活动的直播间样式还原，避免屏幕适配以及深色模式等功能失效
// @author       Yucc
// @match        *://live.bilibili.com/*
// @exclude      *://live.bilibili.com/blanc/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444515/%E7%A6%81%E7%94%A8B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B4%BB%E5%8A%A8%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444515/%E7%A6%81%E7%94%A8B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B4%BB%E5%8A%A8%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const m = location.pathname.match(/^\/(\d+)(?:\/|$)/);
  if (!m) return;
  const roomId = m[1];
  const blancPath = `/blanc/${roomId}` + location.search + location.hash;

  try { window.stop(); } catch(e){}

  if (!location.pathname.startsWith(`/blanc/${roomId}`)) {
    location.replace(blancPath);
  }
})();
