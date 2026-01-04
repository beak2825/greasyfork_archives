// ==UserScript==
// @name        Enhanced player controls for piped.video
// @namespace   Violentmonkey Scripts
// @match       https://piped.video/watch
// @grant       none
// @version     0.0.1
// @author      William Grant
// @license MIT
// @description Enhances the piped.video player controls with tooltips on hover, looping, fast forward, rewind, seek forwards 10s, seek backwards 10s, etc.
// @downloadURL https://update.greasyfork.org/scripts/480631/Enhanced%20player%20controls%20for%20pipedvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/480631/Enhanced%20player%20controls%20for%20pipedvideo.meta.js
// ==/UserScript==

// Acknowledgements:
//   Thanks to SchubmannM for giving me a starting point for this script.

// References:
//   https://greasyfork.org/en/scripts/471587-oqee-tv-enable-video-seek-bar/code
//   https://shaka-player-demo.appspot.com/docs/api/tutorial-ui-customization.html

(function () {
  "use strict";

  const INTERVAL_TIME = 500; // milliseconds

  // This function configures the Shaka Player UI
  function configureShakaPlayerUI(videoElement) {
    const videoUI = videoElement["ui"];

    // Grab the current config and update it
    const currentConfig = videoUI.getConfiguration();
    const controlPanelElements = currentConfig.controlPanelElements;
    controlPanelElements.splice(0, 0, "rewind");
    controlPanelElements.splice(2, 0, "fast_forward");
    controlPanelElements.splice(-2, 0, "loop");

    const config = {
      ...currentConfig,
      controlPanelElements,
      enableTooltips: true,
    };

    // Configure the Shaka Player UI with the config object
    videoUI.configure(config);
  }

  function addSeekButtons() {
    const seekBackwardButton = document.createElement("button");
    seekBackwardButton.classList.add(
      "material-icons-round",
      "shaka-seek-backward-button",
      "shaka-tooltip-status"
    );
    seekBackwardButton.setAttribute("aria-label", "Seek Backwards");
    seekBackwardButton.setAttribute("shaka-status", "10s");
    seekBackwardButton.textContent = "↩";
    seekBackwardButton.addEventListener("click", function (event) {
      const videoElement = document.getElementsByTagName("video").item(0);
      videoElement.currentTime = videoElement.currentTime - 10;
      event.preventDefault();
      event.stopPropagation();
    });

    const seekForwardButton = document.createElement("button");
    seekForwardButton.classList.add(
      "material-icons-round",
      "shaka-seek-forward-button",
      "shaka-tooltip-status"
    );
    seekForwardButton.setAttribute("aria-label", "Seek Forwards");
    seekForwardButton.setAttribute("shaka-status", "10s");
    seekForwardButton.textContent = "↪";
    seekForwardButton.addEventListener("click", function (event) {
      const videoElement = document.getElementsByTagName("video").item(0);
      videoElement.currentTime = videoElement.currentTime + 10;
      event.preventDefault();
      event.stopPropagation();
    });

    // Add Seek buttons into controls at the correct positions
    const controls = document.querySelector(".shaka-controls-button-panel");
    const fastForwardButton = document.querySelector(
      "button.material-icons-round.shaka-fast-forward-button"
    );
    const playButton = document.querySelector(
      "button.material-icons-round.shaka-small-play-button"
    );
    controls.insertBefore(seekForwardButton, fastForwardButton);
    controls.insertBefore(seekBackwardButton, playButton);
  }

  // This function will be executed every INTERVAL_TIME milliseconds until the video player and its UI are fully loaded
  function checkVideoAndUI() {
    try {
      // Try to find the video player element in the DOM
      const videoElement = document.getElementsByTagName("video").item(0);

      // Check if the video player element and its 'ui' property both exist
      if (videoElement && videoElement.ui) {
        // If they do, clear the interval to stop executing this function
        clearInterval(intervalId);

        // Then, configure the Shaka Player UI using the video element
        configureShakaPlayerUI(videoElement);

        // Then, add seek buttons to the Shaka Player UI
        addSeekButtons();
      }
    } catch (err) {
      console.error("Piped enhanced player controls error", err);
    }
  }

  // Start the interval, storing its ID in 'intervalId'
  const intervalId = setInterval(checkVideoAndUI, INTERVAL_TIME);
})();
