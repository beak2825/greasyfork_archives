// ==UserScript==
// @name         Youtube - Subtitle
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Automatically enable the subtitles.
// @author       hacker09
// @match        https://*.youtube.com/embed/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479068/Youtube%20-%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/479068/Youtube%20-%20Subtitle.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector('video').addEventListener('playing', () => { //When the video is played
      document.querySelector(".ytp-subtitles-button.ytp-button").innerHTML.match('unavailable') === null && document.querySelector(".ytp-subtitles-button.ytp-button").ariaPressed === 'false' ? document.querySelector(".ytp-subtitles-button.ytp-button").click() : ''; //Auto enable the subtitles if available and they are disabled
  }, { once: true }); //Finishes the timeupdate event listener
})();