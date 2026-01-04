// ==UserScript==
// @name         哔哩哔哩倍速与网页全屏
// @namespace    http://tampermonkey.net/
// @version      4.1.1
// @description  B站视频快捷键调整倍速和网页全屏：更多倍速调节选项，按g键切换网页全屏，+/-/*//等快捷键调整倍速
// @author       Longlong
// @match        http*://www.bilibili.com/video/*
// @match        http*://www.bilibili.com/cheese/play/*
// @match        http*://www.bilibili.com/bangumi/*
// @match        *://*.bilibili.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529731/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%80%8D%E9%80%9F%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529731/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%80%8D%E9%80%9F%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加更多倍速选项
  function addHighSpeedOptions() {
    const observer = new MutationObserver(function (mutations) {
      const ulElement = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
      if (ulElement) {
        const newLiHTML =
          '<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="3.5">3.5x</li>' +
          '<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="3">3.0x</li>' +
          '<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="2.5">1坤x</li>';
        ulElement.insertAdjacentHTML('afterbegin', newLiHTML);
        observer.disconnect(); // 完成任务后断开观察器
      }
    });

    // 开始观察文档变化
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // 检查是否在输入框中
  function isInInputField() {
    return document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.isContentEditable;
  }

  // 使用对象映射替代多个if语句，提高代码可读性和执行效率
  const speedActions = {
    // 小键盘+ 或 >
    '107': () => {
      const video = document.querySelector('video');
      video.playbackRate += 0.25;
      return video.playbackRate;
    },
    '190': () => {
      const video = document.querySelector('video');
      video.playbackRate += 0.25;
      return video.playbackRate;
    },
    // 小键盘*
    '106': () => {
      const video = document.querySelector('video');
      video.playbackRate += 0.125;
      return video.playbackRate;
    },
    // 小键盘- 或 <
    '109': () => {
      const video = document.querySelector('video');
      video.playbackRate -= 0.25;
      return video.playbackRate;
    },
    '188': () => {
      const video = document.querySelector('video');
      video.playbackRate -= 0.25;
      return video.playbackRate;
    },
    // 小键盘/
    '111': () => {
      const video = document.querySelector('video');
      video.playbackRate -= 0.125;
      return video.playbackRate;
    },
    // ? 或 小键盘.
    '191': () => {
      const video = document.querySelector('video');
      video.playbackRate = 1;
      return video.playbackRate;
    },
    '110': () => {
      const video = document.querySelector('video');
      video.playbackRate = 1;
      return video.playbackRate;
    }
  };

  // 合并键盘事件处理函数，减少事件监听器数量
  function handleKeyboardEvent(event) {
    // 如果在输入框中，不执行快捷键功能
    if (isInInputField()) return;

    // 处理G键网页全屏功能 (keydown事件)
    if (event.type === 'keydown' && (event.key === 'g' || event.key === 'G')) {
      event.preventDefault();
      const webFullscreenButton = document.querySelector('.bpx-player-ctrl-web, [data-name="ctrl:webscreen"]');
      if (webFullscreenButton) {
        webFullscreenButton.click();
      }
      return;
    }

    // 处理倍速调整功能 (keyup事件)
    if (event.type === 'keyup' && speedActions[event.keyCode]) {
      speedActions[event.keyCode]();
    }
  }

  // 初始化所有功能
  function initializeScript() {
    // 添加高倍速选项
    addHighSpeedOptions();

    // 添加键盘事件监听器，合并为一个函数处理
    document.addEventListener('keydown', handleKeyboardEvent);
    document.addEventListener('keyup', handleKeyboardEvent);
  }

  // 页面加载完成后初始化脚本
  window.addEventListener('load', initializeScript);
})();