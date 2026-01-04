// ==UserScript==
// @name         Fast-forward for YT shorts & TikTok
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1.1
// @description  This Userscript adds keyboard shortcuts to YouTube and TikTok videos. It enables quick navigation using the "Left Arrow" key for rewind and the "Right Arrow" key for fast-forwarding in short videos. This feature saves time and helps locate specific moments in a video, making video-watching more efficient.
// @author       crazy-cat-108
// @match https://www.youtube.com/*
// @match https://www.tiktok.com/*
// @run-at document-start
// @icon         https://cdn-icons-png.flaticon.com/512/7696/7696578.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466438/Fast-forward%20for%20YT%20shorts%20%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/466438/Fast-forward%20for%20YT%20shorts%20%20TikTok.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener('keydown', function (event) {
    if (location.pathname.includes('/shorts') || location.host.includes('tiktok.com')) {
      const video = document.querySelector("video[loop]") || document.querySelector("video");
      if (event.code === 'ArrowLeft') {
        video.currentTime -= Math.floor(video.duration * 0.10);
      } else if (event.code === 'ArrowRight') {
        // Right arrow was pressed
        video.currentTime += Math.floor(video.duration * 0.10);
      }
    }
  });
})();