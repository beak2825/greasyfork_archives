// ==UserScript==
// @name         Mac适用，YouTube字幕三指翻译。
// @namespace    https://tampermonkey.net/
// @version      6.0
// @description  只在Mac Safari 测试过，调用系统自带词典翻译，极简适用体验，内存占用少。
// @author       雅典大学堂独立学者
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542581/Mac%E9%80%82%E7%94%A8%EF%BC%8CYouTube%E5%AD%97%E5%B9%95%E4%B8%89%E6%8C%87%E7%BF%BB%E8%AF%91%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/542581/Mac%E9%80%82%E7%94%A8%EF%BC%8CYouTube%E5%AD%97%E5%B9%95%E4%B8%89%E6%8C%87%E7%BF%BB%E8%AF%91%E3%80%82.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* 1. 等视频 ready 后注入覆盖样式 */
  function inject() {
    const style = document.createElement('style');
    style.id = 'yt-caption-fix';
    style.textContent = `
      /* 新版 Shadow-DOM 字幕行 */
      video + div > div > div > div > div,
      .ytp-caption-segment,
      .ytp-caption-window-container * {
        user-select: text !important;
        -webkit-user-select: text !important;
        cursor: text !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  /* 2. 启动：页面加载后执行一次即可 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();