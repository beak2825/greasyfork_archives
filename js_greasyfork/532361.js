// ==UserScript==
// @name         Player controls for Mako
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Adds player controls
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://www.mako.co.il/mako-vod-keshet/*
// @match        https://www.mako.co.il/mako-vod-podcasts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mako.co.il
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532361/Player%20controls%20for%20Mako.user.js
// @updateURL https://update.greasyfork.org/scripts/532361/Player%20controls%20for%20Mako.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("keydown", e => {
    switch (e.code) {
      // Playback speed
      case "Comma":
      case "Period": {
        if (!e.shiftKey) {
          return;
        }

        const elPlaybackSpeedLabel = [...document.querySelectorAll("#idButtonsWrapper span > span")].find(elSpan => elSpan.textContent === "מהירות ניגון");
        const elPlaybackSpeedButtonWrapper = elPlaybackSpeedLabel.closest("button");
        const elPlaybackSpeedMenuOpener = elPlaybackSpeedButtonWrapper.firstElementChild;
        const currentSpeed = elPlaybackSpeedMenuOpener.querySelector("path").getAttribute("d");
        elPlaybackSpeedMenuOpener.click();
        const elPlaybackSpeeds = elPlaybackSpeedButtonWrapper.firstElementChild.children;
        const elPlaybackSpeedLabels = [...elPlaybackSpeeds].map(elButton => elButton.querySelector("path"));
        const elPlaybackSpeedButtons = elPlaybackSpeedLabels.map(elPath => elPath.closest("div"));
        const playbackSpeeds = elPlaybackSpeedButtons.map(elDiv => elDiv.querySelector("path").getAttribute("d"));

        const iSpeedCurrent = playbackSpeeds.indexOf(currentSpeed);
        const keyToElementMapper = {
          Comma: iSpeedCurrent + 1,
          Period: iSpeedCurrent - 1
        };
        const elSpeedToChangeTo = elPlaybackSpeedButtons[keyToElementMapper[e.code]];
        if (elSpeedToChangeTo) {
          elSpeedToChangeTo.click();
          return;
        }

        elPlaybackSpeedButtons[iSpeedCurrent].click();
      }
        break;
    }
  })
})();
