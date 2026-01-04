// ==UserScript==
// @name         Youtube - Subtitle (PC Version)
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Automatically enable the subtitles.
// @author       hacker09
// @match        https://*.youtube.com/embed/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @require      https://unpkg.com/tesseract.js/dist/tesseract.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482236/Youtube%20-%20Subtitle%20%28PC%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482236/Youtube%20-%20Subtitle%20%28PC%20Version%29.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var video = document.querySelector('video'); // Select the video element on the page
  var SubsNotFound = true; // Tesseract has not recognized any subtitles yet
  var lastCaptureTime = 0; // Variable to store the last captured frame time

  video.addEventListener('playing', () => { // When the video is played
    document.querySelector(".ytp-subtitles-button.ytp-button").innerHTML.match('unavailable') === null && document.querySelector(".ytp-subtitles-button.ytp-button").ariaPressed === 'false' ? document.querySelector(".ytp-subtitles-button.ytp-button").click() : ''; // Auto enable the subtitles if available and they are disabled
  }, { once: true }); // Finishes the timeupdate event listener

  video.addEventListener('timeupdate', async () => { // When the video is playing
    lastCaptureTime = lastCaptureTime >= video.currentTime ? video.currentTime : lastCaptureTime; //Create a new variable to capture the last 1 sec, and fix the variable if the user seeks backwards
    if (video.currentTime - lastCaptureTime >= 1 && SubsNotFound && video.currentTime < 60 && document.querySelector(".ytp-subtitles-button.ytp-button").innerHTML.match('unavailable') === null) { //If 1 sec passed since last Tesseract check, if Tesseract didn't recognize any subs on the last try and if less than 1 min passed
      lastCaptureTime = video.currentTime; //Update the lastCaptureTime variable
      var currentSubtitle = await Tesseract.recognize(captureFrame(video), 'por+eng+spa'); // Capture a frame from the video and use Tesseract to recognize subtitles in Portuguese, English, and Spanish
      if (currentSubtitle.data.confidence > 80 && !['VERIFIQUE', 'CLASSIFICAÇÃO'].some(text => currentSubtitle.data.text.includes(text)) && document.querySelector(".ytp-subtitles-button.ytp-button").ariaPressed === 'true') { // If the subtitle confidence is above 85%, does not contain specific ignored texts, the subs are enabled and the subtitles are available
        SubsNotFound = false; // Tesseract has recognized subtitles
        document.querySelector(".ytp-subtitles-button.ytp-button").click(); // Disable the subtitles
      } // Finishes the if condition
    } // Finishes the if condition
  }); // Finishes the timeupdate event listener

  function captureFrame(video) { // Starts the captureFrame function
    var canvas = document.createElement('canvas'); // Create a new canvas element
    canvas.width = video.videoWidth; // Set the canvas width = the video width
    canvas.height = video.videoHeight / 5; // Set the canvas height = the video height /5 to capture only the bottom 20% of the video
    canvas.getContext('2d').drawImage(video, 0, video.videoHeight * 0.7, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height); // Capture a frame from the video
    return canvas.toDataURL('image/png'); // Return the captured frame as a data URL Base64 PNG img
  } // Finishes the captureFrame function
})();