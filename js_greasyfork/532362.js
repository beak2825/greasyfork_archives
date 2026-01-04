// ==UserScript==
// @name         Player controls for NVIDIA GTC
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Adds player controls
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://register.nvidia.com/flow/nvidia/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nvidia.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532362/Player%20controls%20for%20NVIDIA%20GTC.user.js
// @updateURL https://update.greasyfork.org/scripts/532362/Player%20controls%20for%20NVIDIA%20GTC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const OBSERVER_OPTIONS = {childList: true, subtree: true};

  let elVideo;
  new MutationObserver((_, observer) => {
    elVideo = document.querySelector("video");
    if (!elVideo) {
      return;
    }

    observer.disconnect();

    const elInitialMute = document.querySelector(".playkit-unmute-button");
    if (elInitialMute) {
      elInitialMute.click();
    }
  }).observe(document, OBSERVER_OPTIONS);

  document.addEventListener("keydown", async e => {
    if (!elVideo) {
      return;
    }

    switch (e.code) {
      // Pause/play
      case "KeyK":
      case "Space":
        e.preventDefault();

        if (elVideo.paused) {
          await elVideo.play();
        } else {
          await elVideo.pause();
        }
        break;

      // Seek backward/forward
      case "KeyJ":
      case "KeyL":
      case "ArrowLeft":
      case "ArrowRight": {
        if (document.activeElement.matches(["input", "textarea"])) {
          return;
        }

        const keyToSeekMapper = {
          KeyJ: 10,
          KeyL: 10,
          ArrowLeft: 5,
          ArrowRight: 5
        };

        const secondsToSeek = keyToSeekMapper[e.code];

        const isBackward = Boolean(e.code.match(/KeyJ|ArrowLeft/));

        if (isBackward) {
          elVideo.currentTime = Math.max(0, elVideo.currentTime - secondsToSeek);
        } else {
          elVideo.currentTime = Math.min(elVideo.duration, elVideo.currentTime + secondsToSeek);
        }
      }
        break;

      // Mute/unmute
      case "KeyM": {
        const elMute = document.querySelector(".playkit-volume-control");
        elMute.click();
      }
        break;

      // Playback speed
      case "Comma":
      case "Period": {
        if (!e.shiftKey) {
          return;
        }

        const elSettingsButtonContainer = document.querySelector(".playkit-control-settings");
        const elSettingsButton = elSettingsButtonContainer.querySelector("button");

        new MutationObserver((_, observer) => {
          observer.disconnect();

          const elSpeedSetting = document.querySelector("[aria-labelledby*=speedActive]");

          new MutationObserver((_, observer) => {
            observer.disconnect();
            const elSpeedCurrent = elSpeedSetting.querySelector("[role=menuitemradio][aria-checked=true]");
            const keyToElementMapper = {
              Comma: "previousElementSibling",
              Period: "nextElementSibling"
            };
            const elSpeedToChangeTo = elSpeedCurrent[keyToElementMapper[e.code]];
            if (elSpeedToChangeTo) {
              elSpeedToChangeTo.click();
            } else {
              elSpeedCurrent.click();
            }

            elVideo.click();
          }).observe(elSpeedSetting, OBSERVER_OPTIONS);
          elSpeedSetting.click();

        }).observe(elSettingsButtonContainer, OBSERVER_OPTIONS);

        elSettingsButton.click();
      }
        break;

      // Seek to start/end
      case "Home":
      case "End": {
        const keyToSeekMapper = {
          Home: 0,
          End: elVideo.duration
        };
        elVideo.currentTime = keyToSeekMapper[e.code];
      }
        break;

      // Seek to percentage
      default:
        if (!isNaN(e.key) && !e.ctrlKey) {
          elVideo.currentTime = e.key / 10 * elVideo.duration;
        }
    }
  })
})();
