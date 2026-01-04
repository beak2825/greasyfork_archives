// ==UserScript==
// @name         AnimeFlV auto skip
// @namespace    https://grayapps.es/
// @version      0.0.3
// @description  This script will try to autoplay videos and also when its ending the episode, will reproduce next.
// @author       Javiergg
// @match        https://www3.animeflv.net/ver/*
// @icon         https://www3.animeflv.net/favicon.ico
// @grant        none
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502760/AnimeFlV%20auto%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/502760/AnimeFlV%20auto%20skip.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Use Jquery
  var $ = window.jQuery;

  // Function to handle received video data
  function handleVideoData(event) {
    if (event.data && event.data.type === "VIDEO_DATA") {
      const videoData = event.data.data;
      if (videoData.currentTime > 0 && videoData.duration > 0) {
        if (videoData.currentTime / videoData.duration > 0.95) {
          console.log("play next!");
          const btn = $(".CapNvNx");
          if (btn.size() > 0) {
            btn[0].click();
          }
        }
      }
    }
  }

  // Listen for messages from other scripts
  window.addEventListener("message", handleVideoData);
})();
