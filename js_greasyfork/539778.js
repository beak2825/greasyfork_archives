// ==UserScript==
// @name         B站自动跳片头片尾
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  支持设置自定义片头片尾，播放时自动跳转
// @author       mankaki
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539778/B%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/539778/B%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const KEY_HEAD = 'bili_skip_head';
  const KEY_TAIL = 'bili_skip_tail';
  const KEY_ENABLED = 'bili_skip_enabled';

  let headSec = parseFloat(localStorage.getItem(KEY_HEAD)) || null;
  let tailSec = parseFloat(localStorage.getItem(KEY_TAIL)) || null;
  let enabled = localStorage.getItem(KEY_ENABLED) === 'true';
  let hasJumpedToTail = false; // 标志变量，记录是否已跳转到片尾

  // 创建浮窗
  const infoDiv = document.createElement('div');
  Object.assign(infoDiv.style, {
    position: 'fixed', bottom: '80px', right: '20px',
    padding: '8px 12px', background: 'rgba(0,0,0,0.7)',
    color: '#fff', fontSize: '14px', borderRadius: '4px',
    zIndex: 9999, fontFamily: 'sans-serif',
    opacity: 0, display: 'none', transition: 'opacity 0.5s'
  });
  document.body.appendChild(infoDiv);

  let hideTimer = null;
  function showInfo() {
    const head = headSec !== null ? formatTime(headSec) : '—';
    const tail = tailSec !== null ? formatTime(tailSec) : '—';
    const status = enabled ? '✅ 开启' : '❌ 关闭';
    infoDiv.textContent = `片头: ${head}  片尾: ${tail}  状态: ${status}`;
    infoDiv.style.display = 'block';
    infoDiv.style.opacity = '1';
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      infoDiv.style.opacity = '0';
      setTimeout(() => infoDiv.style.display = 'none', 500);
    }, 3000);
  }

  function formatTime(sec) {
    const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = Math.floor(sec % 60);
    return (h > 0 ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function parseTime(str) {
    if (!str) return null;
    let sec = 0;
    if (str.includes(':')) {
      const p = str.split(':').map(Number).reverse();
      sec = (p[0] || 0) + (p[1] || 0) * 60 + (p[2] || 0) * 3600;
    } else sec = parseFloat(str);
    return isNaN(sec) ? null : sec;
  }

  // 设置片头/尾
  function setTimes() {
    let h = prompt('设置片头时间（mm:ss 或 秒数，不跳请留空）:', headSec !== null ? formatTime(headSec) : '');
    let t = prompt('设置片尾时间（mm:ss 或 秒数，不跳请留空）:', tailSec !== null ? formatTime(tailSec) : '');
    const hSec = parseTime(h);
    const tSec = parseTime(t);
    if ((h && hSec === null) && (t && tSec === null)) return alert('至少设置一个有效时间');
    headSec = hSec;
    tailSec = tSec;
    localStorage.setItem(KEY_HEAD, headSec === null ? '' : headSec);
    localStorage.setItem(KEY_TAIL, tailSec === null ? '' : tailSec);
    enabled = true;
    localStorage.setItem(KEY_ENABLED, 'true');
    showInfo();
  }

  // 监控播放跳转片头/尾
  function monitor(video) {
    video.addEventListener('timeupdate', () => {
      if (!enabled) return;
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (headSec !== null && currentTime < headSec) {
        video.currentTime = headSec;
      } else if (tailSec !== null && duration - currentTime <= tailSec) {
        // 在片尾时间段内，跳转到视频的最后一秒，仅跳转一次
        if (!hasJumpedToTail) {
          video.currentTime = duration - 1;
          hasJumpedToTail = true;
        }
      } else {
        // 重置标志变量，以便下次进入片尾时间段时可以跳转
        hasJumpedToTail = false;
      }
    });
  }

  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    // Shift + M 设置片头片尾时间
    if (e.key.toLowerCase() === 'm' && e.shiftKey) {
      e.preventDefault();
      setTimes();
    }
    // O 键开启/关闭功能
    if (e.key.toLowerCase() === 'o') {
      e.preventDefault();
      enabled = !enabled;
      localStorage.setItem(KEY_ENABLED, enabled ? 'true' : 'false');
      showInfo();
    }
  });

  // 初次加载进来，显示一次浮窗
  showInfo();
  const video = document.querySelector('video');
  if (video) monitor(video);
  else {
    new MutationObserver((_, obs) => {
      const v = document.querySelector('video');
      if (v) { monitor(v); obs.disconnect(); }
    }).observe(document.body, { childList: true, subtree: true });
  }
})();