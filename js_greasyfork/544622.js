// ==UserScript==
// @name         Bilibili 自动播放视频
// @description  打开网页时自动开始播放B站视频。
// @version      1.02
// @author       yzcjd
// @author2       ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @match        https://www.bilibili.com/*
// @match1        https://m.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544622/Bilibili%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/544622/Bilibili%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getMainVideo() {
    let video = document.querySelector('video[src^="blob:"]');
    if (!video) {
      const candidates = Array.from(document.querySelectorAll('video'))
        .filter(v => v.offsetWidth * v.offsetHeight > 0);
      candidates.sort((a, b) => (b.offsetWidth * b.offsetHeight) - (a.offsetWidth * a.offsetHeight));
      video = candidates[0] || null;
    }
    return video;
  }

  function attemptPlay() {
    const video = getMainVideo();
    if (!video) return;

    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.muted = false; // 前台正常有声音

    video.play().then(() => {
      console.log('[B站自动播放] 播放成功');
    }).catch(err => {
      console.warn('[B站自动播放] 播放失败:', err?.name || err);
    });
  }

  // 页面加载完成后，延迟 1 秒再尝试播放
  window.addEventListener('load', () => {
    setTimeout(attemptPlay, 1700);
  });

})();

