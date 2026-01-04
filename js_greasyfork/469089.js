// ==UserScript==
// @name         B站直播自动原画切换
// @namespace    liuxingbaoyu
// @version      0.1
// @description  自动将B站直播切换为原画，需要B站已登录
// @author       流星暴雨
// @match        *://live.bilibili.com/*
// @grant        none
// @homepageURL  https://greasyfork.org/zh-CN/scripts/469089
// @downloadURL https://update.greasyfork.org/scripts/469089/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8E%9F%E7%94%BB%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469089/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8E%9F%E7%94%BB%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const timer = setInterval(() => {
    try {
      const { quality, qualityCandidates } = window.livePlayer.getPlayerInfo();
      const maxQuality = qualityCandidates[0].qn;
      if (quality !== maxQuality) {
        window.livePlayer.switchQuality(maxQuality);
      }
      clearInterval(timer);
    } catch (error) {}
  }, 1000);
})();
