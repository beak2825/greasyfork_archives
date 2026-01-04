// ==UserScript==
// @name AutoClickYouTubeSkipAdButton
// @namespace net.maiware.userscript
// @description user.js for click "Skip Ad" button automatically.
// @version 1.1.4
// @grant none
// @match https://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/408509/AutoClickYouTubeSkipAdButton.user.js
// @updateURL https://update.greasyfork.org/scripts/408509/AutoClickYouTubeSkipAdButton.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
  // callback for `MutationObserver` constructor
  const callback = (mutationRecords, observer) => {
    const selectors = [".ytp-ad-skip-button", ".ytp-ad-skip-button-modern"];
    selectors.forEach((selector) => {
      const skipButtons = document.querySelectorAll(selector);
      for (const skipButton of skipButtons) {
        skipButton.click();
      }
    })

    // make overlay-ads hidden
    const overlayAds = document.querySelectorAll(".ytp-ad-overlay-slot");
    for (const overlayAd of overlayAds) {
      overlayAd.style.visibility = "hidden";
    }
  };

  // observer instance
  const observer = new MutationObserver(callback);

  // observation options
  const options = {
    childList: true,
    subtree: true,
  };

  // start MutationObserver#observe()
  const startObservation = (targetNode) => {
    if (targetNode) {
      observer.observe(targetNode, options);
    }
  };

  const target = document.documentElement;
  startObservation(target);
})();