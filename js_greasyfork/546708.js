// ==UserScript==
// @name         xHamster Constant HTML5 Player
// @namespace    https://xhamster-html5
// @version      2.0
// @description  Always force xHamster’s player into a clean HTML5 <video> with highest quality, resisting resets.
// @match        *://xhamster.com/*
// @match        *://*.xhamster.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546708/xHamster%20Constant%20HTML5%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/546708/xHamster%20Constant%20HTML5%20Player.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function forceHTML5() {
    const video = document.querySelector('video');
    if (!video) return;

    // Collect available sources
    const sources = Array.from(video.querySelectorAll('source')).map(s => ({
      src: s.src,
      res: parseInt((s.getAttribute('res') || s.src.match(/(\d{3,4})p/) || [])[1] || 0, 10)
    })).filter(s => s.src);

    // Pick the highest resolution
    let best = null;
    if (sources.length) {
      best = sources.sort((a, b) => b.res - a.res)[0];
    } else {
      best = { src: video.currentSrc || video.src, res: 0 };
    }

    if (!best || !best.src) return;

    // If we already replaced and video is correct, skip
    const existing = document.querySelector('video[data-forced="true"]');
    if (existing && existing.src === best.src) return;

    // Build new HTML5 player
    const newPlayer = document.createElement('video');
    newPlayer.src = best.src;
    newPlayer.controls = true;
    newPlayer.autoplay = false;
    newPlayer.setAttribute("playsinline", "true");
    newPlayer.dataset.forced = "true";
    newPlayer.style.width = "100%";
    newPlayer.style.maxHeight = "80vh";

    // Replace wrapper
    const wrapper = video.closest('.player, .video-player, .xh-video, .video-js') || video;
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.replaceChild(newPlayer, wrapper);
      console.log(`[xHamster++] Forced HTML5 @ ${best.res || "default"}p`);
    }
  }

  // Run immediately
  forceHTML5();

  // Keep enforcing every second
  setInterval(forceHTML5, 1000);

  // Watch for DOM changes
  const mo = new MutationObserver(forceHTML5);
  mo.observe(document.body, { childList: true, subtree: true });
})();
