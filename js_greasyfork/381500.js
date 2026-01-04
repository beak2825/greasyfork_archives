// ==UserScript==
// @name YouTube Grey-out Seen Videos
// @namespace https://jacobbundgaard.dk
// @version 1.0
// @description Greys out seen videos in the YouTube watch next sidebar, on the subscriptions page and elsewhere.
// @match https://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/381500/YouTube%20Grey-out%20Seen%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/381500/YouTube%20Grey-out%20Seen%20Videos.meta.js
// ==/UserScript==

(function() {
  function markWatchedVideos() {
    const watchedVideos = Array.from(document.getElementsByTagName("ytd-thumbnail")).filter(e => {
      const r = e.querySelector(".ytd-thumbnail-overlay-resume-playback-renderer");
      return r != null && r.style.width === "100%";
    });
    
    for (const watchedVideo of watchedVideos.filter(e => e.style.opacity != 0.5)) {
      watchedVideo.style.opacity = 0.5;
      console.log("Marked", watchedVideo);
    }
  }
  
  const observer = new MutationObserver(markWatchedVideos);
  observer.observe(document.body, {
      'childList': true,
      'subtree': true
  });
})();