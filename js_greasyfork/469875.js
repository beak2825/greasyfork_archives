// ==UserScript==
// @name         Reddit Video Auto Pauser ▶️
// @description  Only Play Video if Visible
// @match        https://*.reddit.com/*
// @grant        none
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @namespace    old.reddit.com
// @version      1.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469875/Reddit%20Video%20Auto%20Pauser%20%E2%96%B6%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/469875/Reddit%20Video%20Auto%20Pauser%20%E2%96%B6%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Helper function to check if an element is at least 90% visible
  function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    const visiblePercentage = (Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)) / rect.height * 100;
    return vertInView && horInView && visiblePercentage >= 90; // <--Percentage!
  }

  // Function to stop all videos on the page
  function stopAllVideos() {
    const videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
      videos[i].pause();
    }
  }

  // Function to check video visibility and play/pause accordingly
  function checkVideoVisibility() {
    const videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      if (isElementVisible(video)) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  // Event listener to check video visibility when the page is scrolled or resized
  window.addEventListener('load', checkVideoVisibility);
  window.addEventListener('scroll', checkVideoVisibility);
  window.addEventListener('resize', checkVideoVisibility);

  // Initial check when the script is executed
  checkVideoVisibility();

})();
