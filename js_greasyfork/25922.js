// ==UserScript==
// @name         YouTube Resume
// @namespace    https://greasyfork.org/en/users/88735-lacour
// @version      1.1
// @description  Resume YouTube videos where you left off.
// @author       laCour
// @license      MIT
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/tv*
// @exclude      *://www.youtube.com/live_chat*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/25922/YouTube%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/25922/YouTube%20Resume.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var player = document.getElementById("movie_player");

  if (typeof player === undefined || player === null) {
    console.warn("[Youtube Resume] Player not defined.");
    return;
  }

  var video_id = player.getVideoData().video_id;
  var video_duration = player.getDuration();

  function saved_progress() {
    return GM_getValue("p_" + video_id, 0);
  }

  function save_progress() {
    GM_setValue("p_" + video_id, player.getCurrentTime());
  }

  function resume_progress() {
    var resume_to = saved_progress();
    var should_resume = true;

    if (video_duration > 0) {
      should_resume = (video_duration - resume_to) >= video_duration * 0.05;
    }

    if (resume_to > 10) {
      resume_to -= 5;
    }

    if (should_resume) {
      player.seekTo(resume_to, true);
    }
  }

  if (player.getCurrentTime() < 2) {
    resume_progress();
  }

  if (video_duration > 2 || video_duration === 0) {
    setInterval(save_progress, 1500);
  }
})();