// ==UserScript==
// @name         CustomYTSpeed
// @version      0.4
// @description  Allows the user to set a custom playback speed on YouTube.com videos
// @match        *://*.youtube.com/watch*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/526811/CustomYTSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/526811/CustomYTSpeed.meta.js
// ==/UserScript==
// deno-lint-ignore-file no-window

(function () {
  "use strict";
  const playbackSpeedSettingsKey = "yt-player-playback-rate";

  function createUI() {
    const uiContainer = document.createElement("div");
    uiContainer.style.position = "fixed";
    uiContainer.style.top = "10px";
    uiContainer.style.right = "10px";
    uiContainer.style.zIndex = 1000;
    uiContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    uiContainer.style.padding = "10px";
    uiContainer.style.border = "1px solid rgba(0, 0, 0, 0.5)";
    uiContainer.style.borderRadius = "5px";
    uiContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    uiContainer.style.color = "rgba(0, 0, 0, 0.8)";

    const label = document.createElement("label");
    label.textContent = "Playback Speed: ";
    uiContainer.appendChild(label);

    const speedSelect = document.createElement("select");
    speedSelect.id = "playbackSpeedSelect";
    [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3.0, 3.25, 3.5, 4.0].forEach(
      (speed) => {
        const option = document.createElement("option");
        option.value = speed;
        option.textContent = speed + "x";
        speedSelect.appendChild(option);
      },
    );

    // Set the default value of the speed selector
    const storedSettings = JSON.parse(
      sessionStorage[playbackSpeedSettingsKey] || '{"data":"1"}',
    );
    speedSelect.value = storedSettings.data;

    speedSelect.addEventListener("change", () => {
      const selectedSpeed = parseFloat(speedSelect.value);
      const playbackSpeedSettings = {
        "data": selectedSpeed.toString(),
        "creation": Date.now(),
      };
      sessionStorage[playbackSpeedSettingsKey] = JSON.stringify(
        playbackSpeedSettings,
      );
      applyPlaybackSpeed();
    });

    uiContainer.appendChild(speedSelect);
    document.body.appendChild(uiContainer);
  }

  function applyPlaybackSpeed() {
    const storedSettings = JSON.parse(
      sessionStorage[playbackSpeedSettingsKey] || '{"data":"1"}',
    );
    const player = document.querySelector("video");
    if (player) {
      player.playbackRate = parseFloat(storedSettings.data);
    }
  }

  // Check if the current page is a video page
  if (window.location.pathname.includes("/watch")) {
    createUI();
    applyPlaybackSpeed();
  }
})();
