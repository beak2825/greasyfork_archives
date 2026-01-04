// ==UserScript==
// @name           Ziggo GO - Skip Ads
// @name:nl        Ziggo GO - Reclame overslaan
// @namespace      http://tampermonkey.net/
// @version        1.2.1
// @description    Automatically skip ads on Ziggo GO by skipping directly to the end of each ad break.
// @description:nl Spoel automatisch de reclames door op Ziggo GO naar het einde van de reclame.
// @author         JxxIT
// @license        MIT
// @match          *://*.ziggogo.tv/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ziggogo.tv
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/521880/Ziggo%20GO%20-%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/521880/Ziggo%20GO%20-%20Skip%20Ads.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let video = null;
  let adBreaks = [];
  let currentSegment = -1;

  /**
   * Debugging helper to log information to the console.
   */
  function logDebugInfo(message, data) {
    console.groupCollapsed(`DEBUG: ${message}`);
    if (data) console.log(data);
    console.groupEnd();
  }

  /**
   * Find the segment in which the current time is or the nearest future segment.
   */
  function findCurrentSegment() {
    logDebugInfo("Finding current segment...", {
      video,
      adBreaks,
      currentSegment,
    });

    if (!video || adBreaks.length === 0) {
      logDebugInfo("No video or ad breaks found.");
      return;
    }

    const currentTime = video.currentTime * 1000; // Convert to milliseconds
    const previousSegment = currentSegment;

    logDebugInfo("Current time...", currentTime);

    // Find the current or next segment
    currentSegment = adBreaks.findIndex(
      (ad) => currentTime >= ad.startTime && currentTime < ad.endTime
    );

    logDebugInfo("Current segment index...", currentSegment);

    if (currentSegment === -1) {
      logDebugInfo("No current segment found. Finding next segment...");
      currentSegment = adBreaks.findIndex((ad) => currentTime < ad.startTime);
    }

    logDebugInfo("Segment checked", {
      currentTime,
      previousSegment,
      currentSegment,
    });
  }

  /**
   * Check and skip if the user is in an advertising block.
   */
  function handleAdSkipping() {
    logDebugInfo("Handling ad skipping...", {
      currentSegment,
      adBreaks,
    });

    if (currentSegment < 0 || currentSegment >= adBreaks.length) {
      logDebugInfo("No valid current segment. Skipping ad skipping.");
      return;
    }

    const ad = adBreaks[currentSegment];
    const adStart = ad.startTime / 1000; // Convert to seconds
    const adEnd = ad.endTime / 1000;

    logDebugInfo("Ad start and end times...", {
      adStart,
      adEnd,
    });

    if (video.currentTime >= adStart && video.currentTime < adEnd) {
      logDebugInfo(`Ad detected. Skipping to ${adEnd}`, {
        adStart,
        adEnd,
      });
      //video.pause();
      video.currentTime = adEnd;
      //video.play();
    } else {
      logDebugInfo("No ad detected. Not skipping.");
    }
  }

  /**
   * Add time update and interaction events to check jumping and playing times.
   */
  function attachListeners() {
    logDebugInfo("Attaching listeners...", {
      video,
    });

    if (!video.adBypassAttached) {
      video.adBypassAttached = true;

      video.addEventListener("timeupdate", () => {
        logDebugInfo("Time update event...", {
          video,
        });
        findCurrentSegment(); // Check which segment we are in
        handleAdSkipping(); // Skip if necessary
      });

      video.addEventListener("seeked", () => {
        logDebugInfo("Seeked event...", {
          video,
        });
        findCurrentSegment();
        handleAdSkipping();
      });
    } else {
      logDebugInfo("Listeners already attached.");
    }
  }

  /**
   * Merge consecutive ad segments into a single segment.
   */
  function mergeAdSegments(adBreaks) {
    const mergedAdBreaks = [adBreaks[0]];

    for (let i = 1; i < adBreaks.length; i++) {
      const currentAd = adBreaks[i];
      const lastMergedAd = mergedAdBreaks[mergedAdBreaks.length - 1];

      if (currentAd.startTime === lastMergedAd.endTime) {
        // Consecutive ad segments, merge them
        lastMergedAd.endTime = currentAd.endTime;
      } else {
        mergedAdBreaks.push(currentAd);
      }
    }

    return mergedAdBreaks;
  }

  /**
   * Process new advertising blocks and set the video.
   */
  function handleVideo(newAdBreaks) {
    logDebugInfo("Handling video...", {
      newAdBreaks,
    });

    video = document.querySelector("video");

    if (!video) {
      logDebugInfo("No video element found!");
      return;
    }

    if (newAdBreaks.length === 0) {
      logDebugInfo("No ads found :)");
      return;
    }

    adBreaks = mergeAdSegments(newAdBreaks);
    logDebugInfo("Merged ad breaks", adBreaks);

    findCurrentSegment(); // Calculate the right segment
    handleAdSkipping(); // Check the current time immediately
    attachListeners(); // Adding Eventlistans
  }

  // Override console.info to intercept advertising updates
  const originalConsoleInfo = console.info;
  console.info = function (...args) {
    if (args[2] === "event::adBreaksUpdateEvent") {
      logDebugInfo("Ad update received", args[3]);
      handleVideo(args[3]?.adBreaks || []);
    } else {
      originalConsoleInfo.apply(console, args);
    }
  };
})();