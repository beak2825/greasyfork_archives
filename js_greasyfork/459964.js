// ==UserScript==
// @name        Chat GPT Twitch Adblocker
// @namespace   http://www.example.com/
// @match     https://www.twitch.tv/*
// @version     1.5
// @license MIT
// @description  Blocks Twitch.tv ads
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459964/Chat%20GPT%20Twitch%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/459964/Chat%20GPT%20Twitch%20Adblocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const adContainers = [
    ".video-player__ad-container",
    ".ffz--player-ad-overlay",
    "[data-test-selector='ad-banner-default-container']",
    "[data-test-selector='community-points-event-banner']",
    "[data-test-selector='ad-banner-top']",
    ".player-twitch-ad-overlay__container",
    ".channel-root__player--ads",
    ".video-ads",
    ".player-overlay",
    ".player-ad",
    ".in-stream-ad",
    ".streamMarkerAd"
  ];

  const adSelectors = [
    ".player-twitch-ad-header",
    ".channel-root__right-column [data-a-target='side-nav-link:subscriptions'] .tw-relative.tw-inline-flex.tw-items-center.tw-space-x-1",
    "[data-test-selector='unmuted-ads-text']",
    "[data-test-selector='muted-ads-text']",
    "[data-test-selector='picture-in-picture-toggle']",
    ".predictor__button-wrap",
    ".leaderboard-ads",
    ".ffz-top-nav .ads-control",
    ".side-nav-ads",
    ".side-nav-games__list--item .side-nav-games__ad",
    ".side-nav-recently-viewed__ad",
    ".side-nav-browse__container",
    ".side-nav-followed__ad",
    ".ad-card-container",
    ".live-channel-card__ad-container",
    ".stream-schedule__ad",
    ".community-points-summary__event-banner"
  ];

  // Remove ad containers on page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      const prerollContainer = document.querySelector(".player-overlay.player-overlay--fullscreen.player-overlay--click-handler");
      if (prerollContainer) {
        prerollContainer.remove();
      }
    }, 5000);

    adContainers.forEach((selector) => {
      document.querySelectorAll(selector).forEach((adContainer) => {
        adContainer.remove();
      });
    });

    document.querySelectorAll('.tw-absolute.tw-top-0.tw-full-width.tw-flex.tw-flex-column.tw-flex-nowrap.tw-flex-shrink-0.tw-z-above-video.tw-pd-t-1.tw-pd-l-1.tw-pd-r-1.tw-pd-b-05').forEach((adContainer) => {
      adContainer.remove();
    });
  });

  // Remove ad containers on page load 2
  window.addEventListener("load", () => {
    document.querySelectorAll('.tw-absolute.tw-top-0.tw-full-width.tw-flex.tw-flex-column.tw-flex-nowrap.tw-flex-shrink-0.tw-z-above-video.tw-pd-t-1.tw-pd-l-1.tw-pd-r-1.tw-pd-b-05').forEach((adContainer) => {
      adContainer.remove();
    });
  });

  // Mutation observer to remove ad elements from the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "DIV" && node.classList.contains("player-ad-overlay__container")) {
          node.remove();
        }
      });
    });
  });

  observer.observe(document, { childList: true });

  const adSlots = document.querySelectorAll(".ad-slot");

  adSlots.forEach((adSlot) => {
    adSlot.remove();
  });
})();

  // Mutation observer to watch for changes to video player iframe source
  const iframeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains("video-player__container")) {
        const iframe = mutation.target.querySelector("iframe");
        if (iframe && iframe.src.includes("googleads")) {
          iframe.remove();
        }
      }
    });
  });

  iframeObserver.observe(document, { subtree: true, attributes: true, attributeFilter: ["src"] });

  // Mutation observer to block ad-related scripts from executing
  const scriptObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "SCRIPT") {
          const src = node.getAttribute("src");
          if (src && isAdScript(src)) {
            node.remove();
          }
        }
      });
    });
  });

  scriptObserver.observe(document.head, { childList: true });

  // Mutation observer to block ad server requests and tracking scripts
  const networkObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "IMG" || node.nodeName === "IFRAME") {
          const src = node.getAttribute("src");
          if (src && isAdServerRequest(src)) {
            node.remove();
          }
        }
      });
    });
  });

  networkObserver.observe(document, { childList: true, subtree: true });

  // Block ad containers
  const hideAdContainers = () => {
    const adContainers = document.querySelectorAll("[data-a-target^='ad-banner'], .tw-absolute.tw-balloon.tw-block");
    adContainers.forEach((adContainer) => adContainer.remove());
  };

  hideAdContainers();

  // Helper function to determine if a script is related to ads or tracking
  function isAdScript(scriptUrl) {
    const adKeywords = ["ad", "doubleclick", "googlesyndication", "scorecardresearch"];
    return adKeywords.some((keyword) => scriptUrl.includes(keyword));
  }

  // Helper function to determine if a network request is an ad server request or tracking
  function isAdServerRequest(url) {
    const adServerUrls = ["doubleclick.net", "googlesyndication.com", "scorecardresearch.com"];
    const trackingUrls = ["google-analytics.com", "googletagmanager.com", "facebook.com/tr", "adsrvr.org"];
    return adServerUrls.some((adServerUrl) => url.includes(adServerUrl)) ||
      trackingUrls.some((trackingUrl) => url.includes(trackingUrl));
  }

