// ==UserScript==
// @name         YouTube Seekbar Enhancer
// @namespace    YTSeekEnhancer
// @version      1.1.0
// @description  Enhances YouTube seekbar with smooth, precise scrolling (1s/5s) across videos, Shorts, and mini player without interference.
// @author       Farhan Sakib Socrates
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542575/YouTube%20Seekbar%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/542575/YouTube%20Seekbar%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const REGULAR_SEEK_STEP = 5; // seconds
  const SHORTS_SEEK_STEP = 1; // seconds

  const REGULAR_SELECTORS = ['.ytp-progress-bar-padding', '.ytp-progress-bar'];
  const SHORTS_SELECTOR = '.ytPlayerProgressBarDragContainer';

  function getHoveredSeekbarVideo(target) {
    // If hovering over shorts seekbar
    if (target.closest(SHORTS_SELECTOR)) {
      const shortsContainer = target.closest('ytd-reel-video-renderer');
      if (shortsContainer) {
        return shortsContainer.querySelector('video');
      }
    }

    // If hovering over regular player or mini player
    for (const sel of REGULAR_SELECTORS) {
      const bar = target.closest(sel);
      if (bar) {
        const player = bar.closest('.html5-video-player');
        if (player) {
          return player.querySelector('video');
        }
      }
    }

    return null;
  }

  function onWheel(e) {
    const target = e.target;
    const video = getHoveredSeekbarVideo(target);
    if (!video || isNaN(video.duration)) return;

    const isShorts = !!target.closest(SHORTS_SELECTOR);
    const seekAmount = isShorts ? SHORTS_SEEK_STEP : REGULAR_SEEK_STEP;
    const direction = Math.sign(e.deltaY) * -1;

    e.preventDefault();
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seekAmount * direction));
  }

  function bindSeek() {
    window.removeEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
  }

  // Observe DOM changes to ensure it stays active across SPA navigations
  const observer = new MutationObserver(bindSeek);
  observer.observe(document.body, { childList: true, subtree: true });

  bindSeek();
})();
