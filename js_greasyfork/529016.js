// ==UserScript==
// @name         YouTube Autoplay Stopper For IOS
// @namespace    assistant-scripts
// @version      1.0
// @description  Prevents YouTube videos from autoplaying and allows manual playback control.
// @author       Assistant
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529016/YouTube%20Autoplay%20Stopper%20For%20IOS.user.js
// @updateURL https://update.greasyfork.org/scripts/529016/YouTube%20Autoplay%20Stopper%20For%20IOS.meta.js
// ==/UserScript==

(function() {
  // Function to pause videos and prevent autoplay
  function stopVideoAutoplay(video) {
    video.pause();
    video.autoplay = false;
    // Ensure video stays paused even if something tries to restart it
    video.addEventListener('play', function pauseOnPlay() {
      video.pause();
      // Remove the listener after first use to allow manual play
      video.removeEventListener('play', pauseOnPlay);
    });
  }

  // MutationObserver to catch video elements as they’re added
  const observer = new MutationObserver((mutations) => {
    const video = document.querySelector('video');
    if (video && !video.dataset.autoplayDisabled) {
      stopVideoAutoplay(video);
      video.dataset.autoplayDisabled = 'true'; // Mark as processed
    }
  });

  // Start observing the document as early as possible
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Check for existing video elements right away
  window.addEventListener('load', () => {
    const video = document.querySelector('video');
    if (video && !video.dataset.autoplayDisabled) {
      stopVideoAutoplay(video);
      video.dataset.autoplayDisabled = 'true';
    }
  });
})();