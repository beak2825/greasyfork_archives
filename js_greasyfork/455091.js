// ==UserScript==
// @name         Youtube Autoliker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically sets a "Like" after watching 80% of the video in Youtube
// @author       Mazayw
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://www.youtube.com/*
// @match        https://www.youtube.com/watch?v=*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/455091/Youtube%20Autoliker.user.js
// @updateURL https://update.greasyfork.org/scripts/455091/Youtube%20Autoliker.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //settings
  const WHEN_TO_LIKE_VIDEO = 0.7;

  function getRandomTime() {
    const min = WHEN_TO_LIKE_VIDEO - 0.1 < 0 ? 0 : WHEN_TO_LIKE_VIDEO - 0.1;
    const max = WHEN_TO_LIKE_VIDEO + 0.1 > 1 ? 1 : WHEN_TO_LIKE_VIDEO + 0.1;

    return Math.random() * (max - min) + min;
  }

  setInterval(() => {
    const ytPlayer = document.getElementById('movie_player');
    const duration = ytPlayer.getDuration();
    const curTime = ytPlayer.getCurrentTime();
    const timeToLike = duration * getRandomTime();
    const button = document.querySelector(
      '#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button'
    );

    if (button.getAttribute('aria-pressed') === 'false' && curTime >= timeToLike) {
      button.click();
      console.log('Video liked');
    }
  }, 5000);
})();