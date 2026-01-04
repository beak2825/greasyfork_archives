// ==UserScript==
// @namespace https://github.com/evanc577/
// @name Gfycat Native Video
// @author ipwnmice
// @include /^https?://gfycat\.com.*/
// @license GPLv3
// @version 0.1.1
// @description Replaces Gfycat's video player with the browser's native video player.
// @downloadURL https://update.greasyfork.org/scripts/440697/Gfycat%20Native%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/440697/Gfycat%20Native%20Video.meta.js
// ==/UserScript==

// Watch for Gfycat's video player to appear
const observer = new MutationObserver(function() {
  try {
    const video_wrapper = document.getElementsByClassName("video-player-wrapper");
    if (video_wrapper.length !== 0) {
        replace_video();
    }
  } catch (e) {
    console.error(e);
  }
});
const config = {subtree: true, childList: true};
observer.observe(document, config);

// Replace Gfycat's video player with the browser's native player
function replace_video() {
  console.log("GNV: Replacing with native video player...");

  // Create video element
  const video = document.createElement("video");
  video.setAttribute("controls", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.style.height = "100%";
  video.style.width = "100%";

  // Add source to video
  video.appendChild(find_giant_video());

  // Replace video wrapper
  const video_wrapper = document.getElementsByClassName("video-player-wrapper")[0];
  video_wrapper.replaceWith(video);
}

// Find highest resolution video
function find_giant_video() {
  const sources = document.querySelectorAll(".video, .media")[0].children;
  const re = /^giant\.gfycat\.com$/;
  for (let i = 0; i < sources.length; i++) {
    const hostname = new URL(sources[i].src).hostname;
    if (re.test(hostname)) {
      return sources[i];
    }
  }

  throw "Could not find original video!";
}