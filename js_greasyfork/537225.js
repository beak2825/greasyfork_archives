// ==UserScript==
// @name         WTL Hotkeys
// @namespace    https://weteachleague.com/
// @version      2025-05-25
// @description  Space to play/pause and F for fullscreen on the last-focused video in WTL.
// @author       You
// @match        https://*.weteachleague.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537225/WTL%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/537225/WTL%20Hotkeys.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let lastFocusedVideo = null;

  // Get the currently relevant video
  function getTargetVideo() {
    if (lastFocusedVideo && document.body.contains(lastFocusedVideo)) {
      return lastFocusedVideo;
    }
    // Fallback to first visible LearnDash video
    return document.querySelector('.ld-tab-content.ld-visible video');
  }

  // Track video focus
  document.addEventListener('focusin', function (e) {
    if (e.target.tagName === 'VIDEO') {
      lastFocusedVideo = e.target;
    }
  });

  // Key controls
  window.addEventListener('keydown', function (e) {
    const video = getTargetVideo();
    if (!video) return;

    // Ignore spacebar if native behavior will handle it
    if ((e.code === 'Space' || e.key === ' ') && document.activeElement !== video) {
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    // Fullscreen toggle
    if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen().catch(err => {
          console.error('Fullscreen failed:', err);
        });
      }
    }
  });
})();
