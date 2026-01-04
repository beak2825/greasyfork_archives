// ==UserScript==
// @name         YouTube Volume Fix
// @description  Makes YouTube usable for listening to music :)
// @author       kapinzzal02
// @license      MIT
// @match        https://www.youtube.com/*
// @version      1.0
// @run-at       document-start
// @namespace https://greasyfork.org/users/1419143
// @downloadURL https://update.greasyfork.org/scripts/522718/YouTube%20Volume%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/522718/YouTube%20Volume%20Fix.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const addStyle = () => {
      const style = document.createElement("style");
      style.textContent = `
        .rocket-indicator {
          position: relative;
          left: 5px;
          display: none;
          margin-right: 5px; /* Added margin for the gap */
        }
      `;
      document.head.appendChild(style);
  }

  const handleVideo = (video) => {
    const player = video.closest("#movie_player");
    if (!player) return;

    const volumeButton = player.querySelector(".ytp-mute-button");
    const volumePanel = player.querySelector(".ytp-volume-panel");
    if (!volumeButton || !volumePanel) return;

    const rocket = document.createElement("span");
    rocket.textContent = "🚀";
    rocket.classList.add("rocket-indicator");

    volumePanel.parentNode.insertBefore(rocket, volumePanel.nextSibling);

    const setVolumeFromPanel = () => {
      const desiredVolume = Number(volumePanel.getAttribute("aria-valuenow")) / 100;
      if (video.volume !== desiredVolume) {
        video.volume = desiredVolume;
      }
    };

    const volumePanelObserver = new MutationObserver(setVolumeFromPanel);
    volumePanelObserver.observe(volumePanel, { attributeFilter: ["aria-valuenow"] });

    const videoVolumeObserver = new MutationObserver(setVolumeFromPanel);
    videoVolumeObserver.observe(video, { attributes: true, attributeFilter: ["volume"] });

    setVolumeFromPanel();

    volumeButton.addEventListener("mouseover", () => {
      rocket.style.display = "inline-block";
    });

    volumeButton.addEventListener("mouseout", () => {
      rocket.style.display = "none";
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "VIDEO") {
          handleVideo(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.querySelectorAll("video").forEach(handleVideo);
  addStyle();
})();