// ==UserScript==
// @name              Lift Web Restrictions: Modified
// @description       A user extension that modifies many sites.
// @version           1.0
// @author            Somebody#0000
// @namespace         https://github.com/
// @supportURL        https://github.com/
// @license           N/A

// @match             https://google.com/*
// @match             https://classroom.google.com/*
// @match             https://docs.google.com/*
// @match             https://slides.google.com/*

// @match             https://www.bing.com/*
// @match             https://www.yahoo.com/*
// @match             https://duckduckgo.com/*
// @match             https://www.aol.com/*

// @match             https://youtube.com/*
// @match             https://www.netflix.com/*

// @match             https://www.facebook.com/*
// @match             https://www.instagram.com/*
// @match             https://twitter.com/*
// @match             https://www.reddit.com/*
// @match             https://discord.com/*

// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             unsafeWindow
// @run-at            document-start
// @antifeature       Tracking, slight analytics.
// @antifeature       Ads, replaces advertisements with our ads.
// @downloadURL https://update.greasyfork.org/scripts/468084/Lift%20Web%20Restrictions%3A%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/468084/Lift%20Web%20Restrictions%3A%20Modified.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // Ad video blocker
  const blockAdVideos = () => {
    const videoElements = document.querySelectorAll("video");
    for (let i = 0; i < videoElements.length; i++) {
      const videoElement = videoElements[i];
      if (videoElement.duration < 10) {
        // Assuming ads are usually shorter than 10 seconds
        videoElement.pause();
        videoElement.src = "";
        videoElement.remove();
      }
    }
  };

  // Click "Skip Ad" button
  const clickSkipAdButton = () => {
    const skipAdButton = document.querySelector(".skip-ad-button");
    if (skipAdButton) {
      skipAdButton.click();
    }
  };

  // Watch age-restricted YouTube videos
  const watchAgeRestrictedVideos = () => {
    const consentButton = document.querySelector(".consent-button");
    const playerContainer = document.querySelector(".html5-video-player");
    
    if (consentButton && playerContainer) {
      consentButton.click();
      playerContainer.classList.remove("age-restricted-mode");
    }
  };

  // Call the functions to modify the website
  blockAdVideos();
  clickSkipAdButton();
  watchAgeRestrictedVideos();

})();
