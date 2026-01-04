// ==UserScript==
// @name         ÖBA Auto video skipper
// @namespace    https://www.oba.gov.tr/
// @version      1.0
// @description  ÖBA videolarının arka planda otomatik olarak sırayla oynatılmasını sağlar
// @author       İrfan Subaşı
// @match        https://www.oba.gov.tr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522209/%C3%96BA%20Auto%20video%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/522209/%C3%96BA%20Auto%20video%20skipper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const videoPlayer = document.querySelector('video');
  videoPlayer.muted = true;

  const observer = new MutationObserver((mutationsList, observer) => {
    videoPlayer.play();
  });

  const config = { childList: true, subtree: true };

  observer.observe(document.body, config);

  videoPlayer.addEventListener('ended', () => {
    goToNextVideo();
  });

  function goToNextVideo() {
    const allVideos = document.querySelectorAll(
      '.course-player-object-item:not(.isDisabled)'
    );

    if (allVideos.length > 0) {
      const nextVideo = allVideos[allVideos.length - 1];
      nextVideo.click();
    }
  }

  setInterval(() => {
    videoPlayer.play();
  }, 1000);

  setTimeout(function () {
    location.reload();
  }, 25 * 60 * 1000);
})();
