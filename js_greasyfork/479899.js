// ==UserScript==
// @name        Click Video To Pause
// @description Userscript that enables pause on click for kick.com video player
// @version     13.0
// @grant       none
// @author      Trilla_G
// @match       *://kick.com/*
// @namespace   https://greasyfork.org/en/users/1200587-trilla-g
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479899/Click%20Video%20To%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/479899/Click%20Video%20To%20Pause.meta.js
// ==/UserScript==

window.addEventListener('click', (event) => {
  // Target the video player using the ID selector
  const videoElement = document.getElementById('video-player');

  // Check if the clicked target is the video player
  if (event.target === videoElement) {
    if (!videoElement.paused) {
      videoElement.pause();  // Pause the video if it is playing
    }
  }
});

