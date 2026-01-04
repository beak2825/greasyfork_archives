// ==UserScript==
// @name         Discord Screen Share as Webcam
// @namespace    https://greasyfork.org/users/fdslalkad
// @version      1.0
// @description  Overrides Discord Web webcam with your screen share stream (mirrored preview locally, normal to others).
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540154/Discord%20Screen%20Share%20as%20Webcam.user.js
// @updateURL https://update.greasyfork.org/scripts/540154/Discord%20Screen%20Share%20as%20Webcam.meta.js
// ==/UserScript==

(() => {
  // Store original getUserMedia
  if (!window._originalGetUserMedia) {
    window._originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  }

  let fakeStream = null;

  // Request screen share stream once and save it
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then((stream) => {
    fakeStream = stream;
    console.log("Screen capture stream ready for override.");

    // Create a mirrored preview video for local user
    const previewVideo = document.createElement('video');
    previewVideo.style.position = 'fixed';
    previewVideo.style.bottom = '10px';
    previewVideo.style.right = '10px';
    previewVideo.style.width = '320px';
    previewVideo.style.zIndex = 9999;
    previewVideo.style.transform = 'scaleX(-1)'; // mirror horizontally locally
    previewVideo.autoplay = true;
    previewVideo.muted = true;
    previewVideo.srcObject = stream;
    document.body.appendChild(previewVideo);
  }).catch((err) => {
    console.error("Failed to get screen capture:", err);
  });

  // Override getUserMedia to provide fake stream
  navigator.mediaDevices.getUserMedia = function (constraints) {
    if (constraints && constraints.video && fakeStream) {
      console.log("Returning fake screen capture stream.");
      return Promise.resolve(fakeStream);
    }
    return window._originalGetUserMedia(constraints);
  };

  console.log("getUserMedia overridden to provide screen share stream.");
})();
