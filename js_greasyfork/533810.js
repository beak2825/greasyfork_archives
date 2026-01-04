// ==UserScript==
// @name         YouTube 评论自动翻译
// @namespace    https://example.com/
// @version      1.3
// @description  自动点击“展开”和“翻译成中文（中国）”按钮，持续监控、支持动态加载评论
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533810/YouTube%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533810/YouTube%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const interval = 2000; // 每隔多少毫秒检测一次

  // 自动点击“展开”按钮
  const clickExpandButtons = () => {
    document.querySelectorAll('tp-yt-paper-button span.more-button').forEach((btn) => {
      const button = btn.closest('tp-yt-paper-button');
      if (button && btn.textContent.trim() === '展开' && !button.hasAttribute('data-expanded')) {
        button.click();
        button.setAttribute('data-expanded', 'true');
        console.log('[自动展开] 已展开评论');
      }
    });
  };

  // 自动点击“翻译成中文（中国）”按钮（新版 YouTube）
  const clickTranslateButtons = () => {
    const buttons = document.querySelectorAll('ytd-tri-state-button-view-model.translate-button.ytd-comment-view-model');
    buttons.forEach((btn) => {
      const button = btn.querySelector('tp-yt-paper-button');
      const label = button?.textContent?.trim();
      if (
        button &&
        (label.includes('翻译成中文') || label.includes('Translate to Chinese')) &&
        !button.hasAttribute('data-translated')
      ) {
        button.click();
        button.setAttribute('data-translated', 'true');
        console.log('[自动翻译] 已点击翻译按钮:', label);
      }
    });
  };

  // 主执行函数，持续运行
  const run = () => {
    clickExpandButtons();
    clickTranslateButtons();
  };

  // 设置定时器持续执行
  setInterval(run, interval);

  // 初始执行一次
  run();
})();