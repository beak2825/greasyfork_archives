// ==UserScript==
// @name        YouTube, STOP CHANGING MY VOLUME!
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.2
// @author      Elara6331 <elara@elara.ws>
// @license     GPLv3
// @description Detects when YouTube tries to do "loudness normalization" and sets the volume back to what's set on the volume slider.
// @downloadURL https://update.greasyfork.org/scripts/466080/YouTube%2C%20STOP%20CHANGING%20MY%20VOLUME%21.user.js
// @updateURL https://update.greasyfork.org/scripts/466080/YouTube%2C%20STOP%20CHANGING%20MY%20VOLUME%21.meta.js
// ==/UserScript==


window.onload = () => {
  player = document.querySelector('video');
  volumeHandle = document.querySelector('.ytp-volume-slider-handle');

  function sliderDistance() {
    if (player.parentElement.parentElement.classList.contains('ytp-big-mode')) {
      return 60;
    } else {
      return 40;
    }
  }
  
  function checkVolume() {
    // Get the distance in pixels of the volume slider handle from the beginning of the slider
    var volumeHandleLeft = volumeHandle.style.left.substr(0, volumeHandle.style.left.length - 2);
    // Divide by the maximum distance to get the desired volume value
    var volumeHandleValue = parseFloat(volumeHandleLeft) / sliderDistance();

    if (volumeHandleValue != player.volume) {
      console.warn("Volume discrepancy detected. YouTube is up to its shenanigans again. Changing volume from " + player.volume * 100 + "% to " + volumeHandleValue * 100 + "%");
      player.volume = volumeHandleValue;
    }
  }

  player.onvolumechange = checkVolume;
  player.onplaying = checkVolume;
}

