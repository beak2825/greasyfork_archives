// ==UserScript==
// @name         Video Background Play Fix2
// @namespace    https://greasyfork.org/en/users/xxoo110
// @version      1.5
// @description  Prevents YouTube and Vimeo from pausing videos when minimizing or switching tabs. Cross-browser port of https://addons.mozilla.org/en-US/firefox/addon/video-background-play-fix/
// @author       xxoo110
// @match        *://*.youtube.com/*
// @match        *://*.vimeo.com/*
// @grant        none
// @run-at       document-start
// @background
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/543336/Video%20Background%20Play%20Fix2.user.js
// @updateURL https://update.greasyfork.org/scripts/543336/Video%20Background%20Play%20Fix2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const IS_YOUTUBE = window.location.hostname.search(/(?:^|.+\.)youtube\.com/) > -1 ||
    window.location.hostname.search(/(?:^|.+\.)youtube-nocookie\.com/) > -1;
  const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
  const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;
  const IS_VIMEO = window.location.hostname.search(/(?:^|.+\.)vimeo\.com/) > -1;

  const IS_ANDROID = window.navigator.userAgent.indexOf('Android') > -1;


  // Page Visibility API
  // if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
  //   Object.defineProperties(document,
  //     { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
  // }


  window.addEventListener(
    'visibilitychange', evt => {
      evt.stopImmediatePropagation();
      // 新增：页面切换时自动恢复播放
      logPanel.log('visibilitychange', document.hidden);
      if (document.hidden) {
        const video = document.querySelector('video');
        logPanel.log('video?.paused', video?.paused);
        if (video?.paused || 1) {
          logPanel.log('trigger video play');
          video.play().catch(() => {
            logPanel.log('video play failed');
          });
        }
      }
    }, true);

  // Fullscreen API
  if (IS_VIMEO) {
    window.addEventListener(
      'fullscreenchange', evt => evt.stopImmediatePropagation(), true);
  }

  // User activity tracking
  if (IS_YOUTUBE) {
    loop(pressKey, 60 * 1000, 10 * 1000); // every minute +/- 10 seconds
  }

  function pressKey() {
    const key = 18;
    sendKeyEvent("keydown", key);
    sendKeyEvent("keyup", key);
  }

  function sendKeyEvent(aEvent, aKey) {
    document.dispatchEvent(new KeyboardEvent(aEvent, {
      bubbles: true,
      cancelable: true,
      keyCode: aKey,
      which: aKey,
    }));
  }

  function loop(aCallback, aDelay, aJitter) {
    let jitter = getRandomInt(-aJitter / 2, aJitter / 2);
    let delay = Math.max(aDelay + jitter, 0);

    window.setTimeout(() => {
      aCallback();
      loop(aCallback, aDelay, aJitter);
    }, delay);
  }

  function getRandomInt(aMin, aMax) {
    let min = Math.ceil(aMin);
    let max = Math.floor(aMax);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 日志面板
  const logPanel = (() => {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.right = '10px';
    panel.style.bottom = '10px';
    panel.style.width = '400px';
    panel.style.maxHeight = '200px';
    panel.style.overflowY = 'auto';
    panel.style.background = 'rgba(0,0,0,0.8)';
    panel.style.color = '#0f0';
    panel.style.fontSize = '12px';
    panel.style.zIndex = 999999;
    panel.style.padding = '8px';
    panel.style.borderRadius = '6px';
    panel.style.fontFamily = 'monospace';
    panel.style.pointerEvents = 'auto';
    // 安全地添加标题和分隔线
    const title = document.createElement('div');
    title.textContent = '日志面板';
    panel.appendChild(title);
    const hr = document.createElement('hr');
    hr.style.border = '1px solid #333';
    panel.appendChild(hr);
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel));
    function log(...args) {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      const line = document.createElement('div');
      line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      panel.appendChild(line);
      panel.scrollTop = panel.scrollHeight;
    }
    return { log };
  })();

  // Example usage of the logPanel
  logPanel.log('脚本已加载');
  if (IS_YOUTUBE) {
    logPanel.log('检测到 YouTube');
  } else if (IS_VIMEO) {
    logPanel.log('检测到 Vimeo');
  } else {
    logPanel.log('未检测到 YouTube 或 Vimeo');
  }
})();
