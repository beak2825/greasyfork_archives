// ==UserScript==
// @name         Stop videos looping
// @namespace    http://tampermonkey.net/
// @version      0.74
// @description  Stop videos looping (Youtube, Twitter, Tiktok, Instagram, Facebook)
// @author       @dmtri
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://*.x.com/*
// @match        https://*.tiktok.com/*
// @match        https://*.instagram.com/*
// @match        https://*.facebook.com/*
// @match        https://bsky.app/*
// @license MIT

// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474877/Stop%20videos%20looping.user.js
// @updateURL https://update.greasyfork.org/scripts/474877/Stop%20videos%20looping.meta.js
// ==/UserScript==

if (location.hostname === "music.youtube.com") {
  return;
}

(function () {
  "use strict";

  // Keep track of processed videos
  const processedVideos = new WeakSet();

  const init = () => {
    const vids = document.querySelectorAll("video");
    vids.forEach((vid) => {
      if (processedVideos.has(vid)) return;
      processedVideos.add(vid);

      vid.removeAttribute("loop");

      let arr = [];

      const setupTimeout = (extra = 0) => {
        let vidLen = vid.duration;
        let vidCurr = vid.currentTime;
        // ignore any buggy timeout triggered < 500ms
        if ((vidLen - vidCurr) * 1000 < 500) return
        // Ensure duration is available
        if (isNaN(vid.duration) || vid.duration === Infinity) return;

        console.log(vidLen > vidCurr, 'setting a timeout', (vidLen - vidCurr - 0.05) * 1000)
        if (vidLen > vidCurr) {
          const timeout = setTimeout(() => {
           // hack: sometimes video just stops randomly, so need to stop that behavior here
            vidLen = vid.duration;
            vidCurr = vid.currentTime;
            const remaining = (vidLen - vidCurr) * 1000
            console.log(remaining)
            if (remaining < 500) vid.pause();
          }, (vidLen - vidCurr - 0.01) * 1000 + extra); // Adjusted to account for potential delays
          arr.push(timeout);
        }
      };

      // need this for the initial load, 1st time playing. Some extra buffer for 1st time too
      vid.addEventListener('loadedmetadata', () => setupTimeout(-200));

      vid.addEventListener('seeked', () => {
        clearAll(arr);
        setupTimeout();
      });

      vid.addEventListener("pause", () => {
        clearAll(arr);
      });

      vid.addEventListener("play", () => {
        setupTimeout();
      });

      vid.addEventListener("ended", () => {
        setTimeout(() => vid.pause(), 10);
      });
    });
  };

  const clearAll = (arr) => {
    arr.forEach((timeout) => {
      clearTimeout(timeout);
    });
    arr = [];
  };

  const observer = new MutationObserver(init);
  observer.observe(document.body, { childList: true, subtree: true });

  init();
})();
