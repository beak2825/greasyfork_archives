// ==UserScript==
// @name         YouTube 動態銷毀播放清單推薦影片與續載元件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  動態移除播放清單推薦影片與續載元件
// @author       shanlan(ChatGPT o3-mini)
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547386/YouTube%20%E5%8B%95%E6%85%8B%E9%8A%B7%E6%AF%80%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87%E8%88%87%E7%BA%8C%E8%BC%89%E5%85%83%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547386/YouTube%20%E5%8B%95%E6%85%8B%E9%8A%B7%E6%AF%80%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87%E8%88%87%E7%BA%8C%E8%BC%89%E5%85%83%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEEP_COUNT = 2;
  let scheduled = false;
  const schedule = (fn) => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fn();
    });
  };

  function pruneContainer(container) {
    const items = container.querySelectorAll(':scope > ytd-item-section-renderer');
    if (!items.length) return;
    for (let i = KEEP_COUNT; i < items.length; i++) {
      const el = items[i];
      if (el && el.isConnected) el.remove();
    }
    const conts = container.querySelectorAll(':scope > ytd-continuation-item-renderer');
    conts.forEach((el) => el.remove());
  }

  function prune() {
    const containers = document.querySelectorAll('#contents');
    if (!containers.length) return;
    containers.forEach(pruneContainer);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (!m.addedNodes || !m.addedNodes.length) continue;
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (
          n.matches?.('ytd-item-section-renderer, ytd-continuation-item-renderer') ||
          n.querySelector?.('ytd-item-section-renderer, ytd-continuation-item-renderer')
        ) {
          schedule(prune);
          return;
        }
      }
    }
  });

  function start() {
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    prune();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('yt-navigate-finish', () => schedule(prune));
  window.addEventListener('yt-page-data-updated', () => schedule(prune));
})();