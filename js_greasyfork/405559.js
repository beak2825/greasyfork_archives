// ==UserScript==
// @name        Youtube playback rate shortcut 
// @namespace   Violentmonkey Scripts
// @match       *://youtube.com/*
// @match       *://*.youtube.com/*
// @grant       none
// @run-at      document-idle
// @version     1.0
// @author      qsniyg
// @description Press [ and ] to slow down/speed up the video, and shift+[ to reset the playback rate
// @downloadURL https://update.greasyfork.org/scripts/405559/Youtube%20playback%20rate%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/405559/Youtube%20playback%20rate%20shortcut.meta.js
// ==/UserScript==

(function() {
  var playback_increment = 0.25;

  var set_playback = function(diff) {
    var video_el = document.querySelector("video.video-stream.html5-main-video");
    if (video_el) {
      if (diff === 0)
        video_el.playbackRate = 1;
      else {
        var new_pr = video_el.playbackRate + diff * playback_increment;
        if (new_pr > 0)
          video_el.playbackRate = new_pr;
      }
    }
  }

  document.addEventListener("keydown", function(e) {
    if (e.target && e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
      return;
    
    if (e.key === "[" && !e.shiftKey) {
      set_playback(-1);
    } else if (e.key === "]") {
      set_playback(1);
    } else if (e.shiftKey && (e.key === "[" || e.key === "{")) {
      set_playback(0);
    }
  });
})();