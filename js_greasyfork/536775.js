// ==UserScript==
// @name         河北教师教育网 | 视频10倍播放 |
// @namespace   http://tampermonkey.net/
// @version      1.3.1
// @description  实现视频10倍速播放
// @match        http://cas.study.yanxiu.jsyxsq.com/*
// @match        https://www.ttcdw.cn/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536775/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%20%7C%20%E8%A7%86%E9%A2%9110%E5%80%8D%E6%92%AD%E6%94%BE%20%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/536775/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%20%7C%20%E8%A7%86%E9%A2%9110%E5%80%8D%E6%92%AD%E6%94%BE%20%7C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 设置目标播放速率
  const TARGET_SPEED = 10;

  // 劫持 Date.now 实现加速
  const _DateNow = Date.now;
  let startRealTime = _DateNow();
  let startFakeTime = startRealTime;

  Date.now = function () {
    return startFakeTime + (superDate.now() - startRealTime) * TARGET_SPEED;
  };

  const superDate = new Date();
  const _Date = Date;
  window.Date = class extends _Date {
    constructor(...args) {
      if (args.length === 0) {
        const now = startFakeTime + (_DateNow() - startRealTime) * TARGET_SPEED;
        return new _Date(now);
      }
      return new _Date(...args);
    }

    static now() {
      return startFakeTime + (_DateNow() - startRealTime) * TARGET_SPEED;
    }
  };

  // 劫持 setTimeout / setInterval 以加快执行
  const _setTimeout = window.setTimeout;
  const _setInterval = window.setInterval;

  window.setTimeout = function (handler, timeout, ...args) {
    return _setTimeout(handler, timeout / TARGET_SPEED, ...args);
  };

  window.setInterval = function (handler, interval, ...args) {
    return _setInterval(handler, interval / TARGET_SPEED, ...args);
  };

  // 定期扫描并设置 video 的播放速度
  const applyVideoSpeed = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.playbackRate !== TARGET_SPEED) {
        video.playbackRate = TARGET_SPEED;
      }
    });
  };

  const observer = new MutationObserver(applyVideoSpeed);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('load', applyVideoSpeed);
  setInterval(applyVideoSpeed, 1000); // 防止切换视频时倍率被重置
})();
