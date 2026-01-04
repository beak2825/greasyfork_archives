// ==UserScript==
// @name        Grok’s Twitch AdBlaster
// @namespace   http://www.example.com/
// @match       https://www.twitch.tv/*
// @match       https://player.twitch.tv/*
// @version     3.3
// @author      fromaaage
// @license     MIT
// @description Blocks Twitch.tv ads with Grok’s power
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/536311/Grok%E2%80%99s%20Twitch%20AdBlaster.user.js
// @updateURL https://update.greasyfork.org/scripts/536311/Grok%E2%80%99s%20Twitch%20AdBlaster.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Erweiterte Liste der Werbecontainer
  const adContainers = [
    ".video-player__ad-container",
    ".ffz--player-ad-overlay",
    "[data-test-selector='ad-banner-default-container']",
    "[data-test-selector='ad-banner-top']",
    ".player-twitch-ad-overlay__container",
    ".channel-root__player--ads",
    ".video-ads",
    ".player-ad",
    ".in-stream-ad",
    ".twitch-ad",
    ".ad-container-2025",
    ".tw-ad-overlay",
    "[data-a-target='video-ad']",
    ".tw-video-ad",
    ".tw-ad-slot",
    ".tw-player-ad",
    ".video-player__overlay",
    ".tw-ad-video",
    ".tw-ad-2025",
    ".InjectLayout-sc-1i43xsx-0.qeepv",
    "[aria-label='Play']",
    ".tw-ad-wrapper",
    ".video-ad-container",
    "[data-a-target='player-controls']",
    ".player-controls",
    ".ccYfUB",
    ".tw-ad-dynamic", // Neuer Selektor
    ".ad-video-wrapper" // Neuer Selektor
  ];

  const adSelectors = [
    ".player-twitch-ad-header",
    "[data-test-selector='unmuted-ads-text']",
    "[data-test-selector='muted-ads-text']",
    ".leaderboard-ads",
    ".ad-card-container",
    ".twitch-ad-new",
    ".tw-ad-label",
    ".tw-ad-countdown",
    "video[src^='blob:']",
    "button[aria-label='Play']",
    "[data-a-target='player-controls']"
  ];

  // Regex für UUID-Format (8-4-4-4-12)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // Werbecontainer beim Laden der Seite entfernen
  window.addEventListener("load", () => {
    setTimeout(() => {
      const prerollContainer = document.querySelector(".player-overlay--fullscreen, .tw-ad-overlay, .tw-video-ad, .video-player__overlay, .tw-ad-video, .tw-ad-2025, .tw-ad-wrapper, .video-ad-container, [data-a-target='player-controls'], .player-controls, .ccYfUB, .tw-ad-dynamic, .ad-video-wrapper");
      if (prerollContainer) {
        prerollContainer.remove();
      }
      // Entferne Play-Button und Blob-Videos
      document.querySelectorAll("button[aria-label='Play'], video[src^='blob:']").forEach(element => {
        if (
          element.classList.contains("InjectLayout-sc-1i43xsx-0") ||
          element.classList.contains("qeepv") ||
          element.closest(".video-player__overlay, .tw-ad-overlay, .tw-video-ad, .tw-ad-2025, .tw-ad-wrapper, .video-ad-container, .player-controls, .ccYfUB, .tw-ad-dynamic, .ad-video-wrapper") ||
          (element.tagName === "VIDEO" && element.src.startsWith("blob:https://www.twitch.tv/") && uuidRegex.test(element.src.split("blob:https://www.twitch.tv/")[1]))
        ) {
          element.remove();
        }
      });
    }, 800); // Kürzere Verzögerung für schnellere Reaktion

    adContainers.forEach(selector => {
      document.querySelectorAll(selector).forEach(adContainer => {
        adContainer.remove();
      });
    });
  });

  // MutationObserver für dynamische Werbeelemente
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.matches(".twitch-ad, .tw-ad-overlay, [data-a-target='video-ad'], .tw-video-ad, .tw-ad-slot, .tw-player-ad, .video-player__overlay, .tw-ad-video, .tw-ad-2025, .InjectLayout-sc-1i43xsx-0.qeepv, [aria-label='Play'], video[src^='blob:'], .tw-ad-wrapper, .video-ad-container, [data-a-target='player-controls'], .player-controls, .ccYfUB, .tw-ad-dynamic, .ad-video-wrapper") ||
            node.querySelector(".twitch-ad, .tw-ad-label, .tw-ad-countdown, button[aria-label='Play'], video[src^='blob:'], [data-a-target='player-controls']") ||
            (node.tagName === "VIDEO" && node.src.startsWith("blob:https://www.twitch.tv/") && uuidRegex.test(node.src.split("blob:https://www.twitch.tv/")[1]))
          ) {
            node.remove();
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Werbeslots entfernen
  document.querySelectorAll(".ad-slot, .tw-ad-slot").forEach(adSlot => adSlot.remove());

  // Iframe-Werbung blockieren
  const iframeObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.classList.contains("video-player__container")) {
        const iframe = mutation.target.querySelector("iframe");
        if (iframe && (iframe.src.includes("googleads") || iframe.src.includes("twitchads") || iframe.src.includes("ads.twitch") || iframe.src.includes("amazon-ads"))) {
          iframe.remove();
        }
      }
    });
  });

  iframeObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["src"] });

  // Werbe-Scripts blockieren
  const scriptObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
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

  // Netzwerkanfragen blockieren
  const networkObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === "IMG" || node.nodeName === "IFRAME" || node.nodeName === "VIDEO") {
          const src = node.getAttribute("src");
          if (src && (isAdServerRequest(src) || src.startsWith("blob:") && node.closest(".video-player__overlay, .tw-ad-overlay, .tw-video-ad, .tw-ad-2025, .tw-ad-wrapper, .video-ad-container, .player-controls, .ccYfUB, .tw-ad-dynamic, .ad-video-wrapper") || (src.startsWith("blob:https://www.twitch.tv/") && uuidRegex.test(src.split("blob:https://www.twitch.tv/")[1])))) {
            node.remove();
          }
        }
      });
    });
  });

  networkObserver.observe(document.body, { childList: true, subtree: true });

  // Hilfsfunktion für Werbe-Scripts
  function isAdScript(scriptUrl) {
    const adKeywords = ["ad", "doubleclick", "googlesyndication", "twitchads", "ads.twitch", "adservice", "scorecardresearch", "amazon-ads"];
    return adKeywords.some(keyword => scriptUrl.includes(keyword));
  }

  // Hilfsfunktion für Werbe- und Tracking-Anfragen
  function isAdServerRequest(url) {
    const adServerUrls = ["doubleclick.net", "googlesyndication.com", "twitchads.com", "ads.twitch.tv", "scorecardresearch.com", "amazon-adsystem.com"];
    const trackingUrls = ["google-analytics.com", "googletagmanager.com", "adsrvr.org"];
    if (url.includes("7tv.io") || url.includes("twitch.tv")) return false; // Ausnahmen für 7TV und Twitch
    return adServerUrls.some(adServerUrl => url.includes(adServerUrl)) ||
           trackingUrls.some(trackingUrl => url.includes(trackingUrl));
  }
})();