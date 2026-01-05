// ==UserScript==
// @name         prevent-playlist-autoplay
// @namespace    https://github.com/ahuanguchi
// @version      1.1.0
// @description  Prevent autoplay for HTML5 video playlists (particularly on YouTube) by making them pause before they can move on. Works on videos in iframes too.
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10996/prevent-playlist-autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/10996/prevent-playlist-autoplay.meta.js
// ==/UserScript==

(function () {
  var video, duration, currentSrc, previousSrc;
  var waitTime = 1500;
  function checkTime() {
    if (duration - video.currentTime < 0.5) {
      video.pause();
      video.removeEventListener("timeupdate", checkTime);
    }
  }
  function preventPlaylistAutoplay() {
    var loc = document.location;
    video = document.getElementsByTagName("video")[0];
    if (video) {
      if (!currentSrc) {
        currentSrc = video.src;
      }
      duration = video.duration;
      if (loc.hostname === "www.youtube.com" && loc.search.indexOf("list=") === -1) {
        return;
      }
      video.addEventListener("timeupdate", checkTime);
      console.info("Tracking video time.");
    } else {
      console.info("No video found.");
    }
  }
  function checkSrc() {
    if (video) {
      previousSrc = currentSrc;
      currentSrc = video.src;
      if (currentSrc !== previousSrc) {
        console.info("Finding next video.");
        preventPlaylistAutoplay();
      }
    }
  }
  window.addEventListener("load", function () {
    window.setTimeout(preventPlaylistAutoplay, waitTime);
  });
  window.addEventListener("click", function () {
    window.setTimeout(checkSrc, waitTime);
  });
  window.addEventListener("keyup", function () {
    window.setTimeout(checkSrc, waitTime);
  });
}());
