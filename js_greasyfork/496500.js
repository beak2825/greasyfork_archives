// ==UserScript==
// @name        Auto-Pause Redgifs
// @description Auto-pauses videos from redgif on reddit
// @namespace   redgifs.com
// @match       *://*redgifs.com/*
// @match       *redgifs.com/*
// @include     *redgifs.com/*
// @match       https://www.redgifs.com/*
// @grant       none
// @license     GPLv2
// @author      laclcia
// @version     1.14
// @downloadURL https://update.greasyfork.org/scripts/496500/Auto-Pause%20Redgifs.user.js
// @updateURL https://update.greasyfork.org/scripts/496500/Auto-Pause%20Redgifs.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Script loaded on Redgifs page'); // Debug message

  const waitTime = 1000; // Wait time between attempts in milliseconds (1 second)
  const maxAttempts = 6; // Maximum number of attempts to find the video

  let videoPaused = false; // Flag to track if video is paused

  function findAndPauseVideo() {
    const video = document.querySelector('a.videoLink video[src]'); // Use previous selector

    if (video && !videoPaused) { // Check video and paused flag
      console.log('Video element found'); // Debug message
      video.pause();
      console.log('Paused Redgif video');
      videoPaused = true; // Set flag to true after pausing
    }

    console.log('Video not found (attempt ', arguments[0], ')'); // Debug message with attempt count
  }

  for (let i = 0; i < maxAttempts && !videoPaused; i++) { // Check videoPaused in loop condition
    setTimeout(findAndPauseVideo.bind(null, i + 1), waitTime * i); // Call with attempt count
  }
})();