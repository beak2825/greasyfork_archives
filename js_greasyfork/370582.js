// ==UserScript==
// @name         4chan WebM Auto-Resume
// @description  Resumes playback of paused WebM videos when scrolled into view
// @namespace    https://github.com/marktaiwan/
// @homepageURL  https://github.com/marktaiwan/4chan-Webm-Auto-Resume
// @supportURL   https://github.com/marktaiwan/4chan-Webm-Auto-Resume/issues
// @license      MIT
// @version      0.3
// @author       Marker
// @include      *//boards.4chan.org/*
// @include      *//boards.4channel.org/*
// @grant        none
// @noframe
// @downloadURL https://update.greasyfork.org/scripts/370582/4chan%20WebM%20Auto-Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/370582/4chan%20WebM%20Auto-Resume.meta.js
// ==/UserScript==

(function () {
'use strict';
const interval = 100; // millisecond
let lastExecution = Date.now();

function isVisible(ele) {
  const {top, bottom} = ele.getBoundingClientRect();
  return (top > 0 || bottom > 0) && (top < document.documentElement.clientHeight);
}

function pausedByUser(video) {
  return (video.dataset.userPauseState === '1');
}

function pauseHandler(event) {
  const video = event.target;

  // Video is still in view when paused, therefore it's triggered by the user
  if (isVisible(video)) video.dataset.userPauseState = '1';
}

function playHandler(event) {
  const video = event.target;
  if (pausedByUser(video)) video.dataset.userPauseState = '0';
}

function initVideoElement(video) {
  if (video.dataset.userPauseState === undefined) {
    video.dataset.userPauseState = '0';
    video.addEventListener('pause', pauseHandler);
    video.addEventListener('play', playHandler);
  }
}

document.addEventListener('scroll', () => {
  if (Date.now() - lastExecution > interval) {
    window.setTimeout(function () {
      const expandedVideos = document.querySelectorAll('.expandedWebm');
      for (const video of expandedVideos) {
        initVideoElement(video);
        if (video.paused && isVisible(video) && !pausedByUser(video)) {
          video.play().catch(() => {/* noop */});
        }
      }
    }, interval);
    lastExecution = Date.now();
  }
});
})();
