// ==UserScript==
// @name        Auto unmute Instagram stories and keyboard shortcut for fullscreen video
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.3.0
// @author      Ricky
// @description Automatically unmute stories / turn story audio on with fullscreen toggle for video
// @downloadURL https://update.greasyfork.org/scripts/486309/Auto%20unmute%20Instagram%20stories%20and%20keyboard%20shortcut%20for%20fullscreen%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/486309/Auto%20unmute%20Instagram%20stories%20and%20keyboard%20shortcut%20for%20fullscreen%20video.meta.js
// ==/UserScript==

var mainLoop = setInterval(() => {
  try {
    var videoElement = document.querySelector('video');

    // New Instagram UI: volume slider with muted indicator
    var volumeSlider = document.querySelector('div[aria-label="Adjust volume"][role="slider"]');
    var mutedIcon = document.querySelector('svg[aria-label="Audio is muted"]');

    // Fallback to old selector
    var audioButton = document.querySelector('button[aria-label="Toggle audio"]');

    if (videoElement && volumeSlider && mutedIcon) {
      // New UI: click the volume slider area to unmute
      if (!volumeSlider.getAttribute('jside_done')) {
        volumeSlider.click();
        volumeSlider.setAttribute('jside_done', 'true');
      }
    } else if (videoElement && volumeSlider && !mutedIcon) {
      // Audio is not muted, reset the flag
      volumeSlider.removeAttribute('jside_done');
    } else if (videoElement && audioButton) {
      // Old UI fallback
      if (videoElement.muted && !audioButton.getAttribute('jside_done')) {
        audioButton.click();
        audioButton.setAttribute('jside_done', 'true');
      } else if (!videoElement.muted) {
        audioButton.removeAttribute('jside_done');
      }
    }
  } catch (err) {
    // Handle errors, or you can log them to the console for debugging
  }
}, 1000);

// Function to toggle fullscreen on video
function toggleVideoFullscreen() {
  var videoElement = document.querySelector('video');
  if (videoElement) {
    if (!document.fullscreenElement) {
      videoElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

// Event listener for key press
document.addEventListener('keydown', (event) => {
  if (event.key === 'f') {
    toggleVideoFullscreen();
  }
});
