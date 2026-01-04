// ==UserScript==
// @name         视频播放完后自动退出全屏+回车切换全屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       ChatGPT
// @match        *://www.bilibili.com/video/*
// @grant        none
// @description Exit fullscreen mode after video playback ends, and toggle fullscreen when pressing Enter key
// @downloadURL https://update.greasyfork.org/scripts/471846/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E5%90%8E%E8%87%AA%E5%8A%A8%E9%80%80%E5%87%BA%E5%85%A8%E5%B1%8F%2B%E5%9B%9E%E8%BD%A6%E5%88%87%E6%8D%A2%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471846/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E5%90%8E%E8%87%AA%E5%8A%A8%E9%80%80%E5%87%BA%E5%85%A8%E5%B1%8F%2B%E5%9B%9E%E8%BD%A6%E5%88%87%E6%8D%A2%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听视频播放事件
  const videoElement = document.querySelector('video');
  if (!videoElement) return;

  // 退出全屏函数
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

    function triggerFullScreenButton() {
        const fullScreenButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-full');
        if (fullScreenButton) {
            fullScreenButton.click();
        }
    }

    // 监听回车键事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            triggerFullScreenButton();
        }
    });

  videoElement.addEventListener('ended', () => {
    // 判断当前是否处于全屏状态
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      // 连播状态是否开启，开启状态则不退出
      const switchButtonSpan = document.querySelector('.switch-button:not(.on)');
      if (switchButtonSpan) {
        // 退出全屏
        exitFullscreen();
      }
    }
  });

})();