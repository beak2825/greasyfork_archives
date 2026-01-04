// ==UserScript==
// @name         YouTube Video Duration Checker
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Shows the duration of YouTube videos on mobile browsers.
// @author       hacker09
// @match        https://*.youtube.com/embed/*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478670/YouTube%20Video%20Duration%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/478670/YouTube%20Video%20Duration%20Checker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".notranslate").style.display = 'unset'; //Display the time
  document.querySelector('.video-stream').addEventListener('timeupdate', function() { //When the YT video is playing
    var currentSecs = Math.floor(document.querySelector('.video-stream').currentTime % 60); //Create a variable to hold the current secs
    var totalSecs = Math.floor(document.querySelector('.video-stream').duration % 60); //Create a variable to hold the total mins
    document.querySelector(".ytp-time-current").innerText = `${Math.floor(document.querySelector('.video-stream').currentTime / 60)}:${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;
    document.querySelector(".ytp-time-duration").innerText = `${Math.floor(document.querySelector('.video-stream').duration / 60)}:${(/^\d$/.test(totalSecs)) ? '0' + totalSecs : totalSecs}`;
  }); //Update the content of the time display element
})();