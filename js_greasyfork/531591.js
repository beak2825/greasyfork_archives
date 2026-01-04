// ==UserScript==
// @name         Twitch Theatermode
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Auto activate theater mode on Twitch + remove front-page-carousel and reapply on page change
// @author       HaCk3Dq
// @match        http*://*.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531591/Twitch%20Theatermode.user.js
// @updateURL https://update.greasyfork.org/scripts/531591/Twitch%20Theatermode.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const waitForElement = (selector, timeout = 7000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        console.log(`Timeout waiting for element: ${selector}`);
        reject();
      }, timeout);
    });
  };

  function removeMainCarousel() {
    setTimeout(() => {
      const videoElement = document.querySelector(
        '[data-test-selector="featured-item-video"] video',
      );
      if (videoElement) {
        videoElement.pause();
      } else {
        console.log("video not found");
      }
    }, 3000);
  }

  function removePinned() {
    waitForElement('button[aria-label="Hide for yourself"]').then((el) =>
      el.click(),
    );
  }

  function hideMutedVOD() {
    waitForElement('button[aria-label="Dismiss muted audio notice"]').then(
      (el) => el.click(),
    );
  }

  function activateTheatreMode() {
    setTimeout(() => {
      const theatreModeButton = document.querySelector(
        'button[aria-label="Theatre Mode (alt+t)"]',
      );
      if (theatreModeButton) {
        theatreModeButton.click();
      }
    }, 1500);
  }

  const handlePageChange = () => {
    activateTheatreMode();
    removeMainCarousel();
    removePinned();
    hideMutedVOD();
  };

  function watchURL() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        handlePageChange();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  handlePageChange();
  watchURL();
})();
