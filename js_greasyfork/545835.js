// ==UserScript==
// @name         Anich 视频键盘控制（v2.0，持久监听）
// @namespace    https://anich.emmmm.eu.org/
// @version      2.0
// @description  强化键盘控制：使用 window 级捕获 + 定时重绑 + 仅 video 聚焦时生效
// @author       chatGPT
// @match        https://anich.emmmm.eu.org/*
// @match        https://*.anich.emmmm.eu.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545835/Anich%20%E8%A7%86%E9%A2%91%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%EF%BC%88v20%EF%BC%8C%E6%8C%81%E4%B9%85%E7%9B%91%E5%90%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545835/Anich%20%E8%A7%86%E9%A2%91%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%EF%BC%88v20%EF%BC%8C%E6%8C%81%E4%B9%85%E7%9B%91%E5%90%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const bindController = () => {
    const video = document.querySelector('video');
    if (!video) return;

    video.setAttribute('tabindex', '0');
    video.addEventListener('click', () => video.focus());

    if (window._anich_v2_bound) return;
    window._anich_v2_bound = true;
    console.log('1');
    window.addEventListener('keydown', e => {
    console.log('2');
      //if (document.activeElement !== video) return;
    console.log('3');

      switch (e.key) {
        case ' ':
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime += 5;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime -= 5;
          break;
      }
    }, true);

    console.log('[Anich v2.0] 键盘控制已启用');
  };

  setInterval(bindController, 500);
})();
