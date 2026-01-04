// ==UserScript==
// @name         Bilibili - 自动切换直播画质至最高画质
// @namespace    https://bilibili.com/
// @version      0.8
// @description  自动切换Bilibili直播画质至最高画质 | V0.8 移除多余的async
// @license      GPL-3.0
// @author       DD1969
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/467427/Bilibili%20-%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%9B%B4%E6%92%AD%E7%94%BB%E8%B4%A8%E8%87%B3%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/467427/Bilibili%20-%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%9B%B4%E6%92%AD%E7%94%BB%E8%B4%A8%E8%87%B3%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // jump to actual room if live streaming is nested
  setInterval(() => {
    const nestedPage = document.querySelector('iframe[src*=blanc]');
    if (nestedPage) unsafeWindow.location.href = nestedPage.src;
  }, 1000);

  // hide the loading gif
  const styleElement = document.createElement('style');
  styleElement.textContent = `.web-player-loading { opacity: 0; }`;
  document.head.appendChild(styleElement);

  // make sure the player is ready
  await new Promise(resolve => {
    const timer = setInterval(() => {
      if (
        unsafeWindow.livePlayer
        && unsafeWindow.livePlayer.getPlayerInfo
        && unsafeWindow.livePlayer.getPlayerInfo().playurl
        && unsafeWindow.livePlayer.switchQuality
      ) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });

  // get initial pathname of video source and number of highest quality
  const initialPathname = new URL(unsafeWindow.livePlayer.getPlayerInfo().playurl).pathname;
  const highestQualityNumber = unsafeWindow.livePlayer.getPlayerInfo().qualityCandidates[0].qn;

  // switch quality
  setInterval(() => {
    const currentPathname = new URL(unsafeWindow.livePlayer.getPlayerInfo().playurl).pathname;
    const currentQualityNumber = unsafeWindow.livePlayer.getPlayerInfo().quality;
    if (currentPathname === initialPathname || currentQualityNumber !== highestQualityNumber) {
      unsafeWindow.livePlayer.switchQuality(highestQualityNumber);
    }
  }, 1000);

})();