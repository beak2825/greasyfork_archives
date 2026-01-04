// ==UserScript==
// @name         YouTube 标准画质
// @description  Support mobile web YouTube。只允许 YouTube 选择 1080P60、1080P30、720P60、720P30 画质。避免由于网络问题卡顿：高画质用不上费流量、低网速降画质瞎眼睛。
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @version       1.02
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @namespace   https://greasyfork.org/users/1171320
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533652/YouTube%20%E6%A0%87%E5%87%86%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533652/YouTube%20%E6%A0%87%E5%87%86%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 定义优先顺序
  const preferredQualities = ['hd1080', 'hd720'];

  // 监听播放状态变化
  function hookPlayer() {
    const checkPlayer = () => {
      const player = document.getElementById('movie_player');

      if (!player || typeof player.getAvailableQualityLevels !== 'function') {
        setTimeout(checkPlayer, 500);
        return;
      }

      console.log('[YouTube Quality Filter] Player ready, binding events.');

      player.addEventListener('onStateChange', function(state) {
        if (state === 1) { // 播放开始
          console.log('[YouTube Quality Filter] Playing - enforcing quality.');
          enforceQuality(player);
        }
      });

      // 视频切换或重新加载时，也重新检测
      setInterval(() => {
        enforceQuality(player);
      }, 30000); // 每30秒强制一次，确保不会被降回高画质
    };

    checkPlayer();
  }

  function enforceQuality(player) {
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return;

    const levels = player.getAvailableQualityLevels(); // 获取当前可用画质
    console.log('[YouTube Quality Filter] Available qualities:', levels);

    let targetQuality = null;

    if (levels.includes('hd1080')) {
      targetQuality = 'hd1080';
    } else if (levels.includes('hd720')) {
      targetQuality = 'hd720';
    }

    if (targetQuality) {
      console.log('[YouTube Quality Filter] Setting quality to:', targetQuality);
      player.setPlaybackQualityRange(targetQuality, targetQuality);
      player.setPlaybackQuality(targetQuality);
    }
  }

  // 监听YouTube内部的导航完成
  window.addEventListener('yt-navigate-finish', () => {
    console.log('[YouTube Quality Filter] Navigation detected - Re-hooking player.');
    setTimeout(hookPlayer, 1000);
  });

  // 初次加载
  hookPlayer();
})();