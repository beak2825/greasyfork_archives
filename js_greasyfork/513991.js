// ==UserScript==
// @name         ytkb
// @namespace    http://violentmonkey.net/
// @version      0.4.2
// @description  Add custom keyboard shortcuts for YouTube navigation with UI feedback and improved controls
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513991/ytkb.user.js
// @updateURL https://update.greasyfork.org/scripts/513991/ytkb.meta.js
// ==/UserScript==

(() => {
  const SEEK_TIME = 5; // Seconds to seek forward/backward
  const VOLUME_CHANGE = 5; // Percentage to change volume
  const MAX_SPEED = 3.0; // Maximum playback speed
  const MIN_SPEED = 0.1; // Minimum playback speed

  const state = {
    currentTime: 0,
    volume: 0,
    muted: false,
    playbackRate: 1.0,
    duration: 0,
  };

  // Helper functions
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const parts = [
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    ];
    return parts
      .map((part) => part.toString().padStart(2, "0"))
      .filter((part, index) => part !== "00" || index > 0)
      .join(":");
  };

  const getVideo = () => document.querySelector("video");

  // UI element creation and management
  const createUIElement = () => {
    const uiElement = document.createElement("div");
    uiElement.id = "ytkb-ui";
    uiElement.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 16px;
      z-index: 9999;
      display: none;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
      font-family: monospace;
    `;

    const playerContainer =
      document.getElementById("movie_player") || document.body;
    playerContainer.appendChild(uiElement);
    return uiElement;
  };

  const createCurrentStateElement = () => {
    const currentStateElement = document.createElement("div");
    currentStateElement.id = "ytkb-current-state";
    currentStateElement.style.cssText = `
      padding: 8px 12px;
      background-color: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      margin-top: 12px;
      color: white;
      border-radius: 5px;
      font-size: 14px;
      font-family: monospace;
      width: fit-content;
    `;
    return currentStateElement;
  };

  let uiElement;
  let stateUpdateInterval;

  const showUIFeedback = (message) => {
    if (!uiElement) {
      uiElement = createUIElement();
    }
    uiElement.textContent = message;
    uiElement.style.display = "block";
    setTimeout(() => {
      uiElement.style.display = "none";
    }, 1500);
  };

  // Video state management
  const updateVideoState = () => {
    const video = getVideo();
    if (!video) return;

    Object.assign(state, {
      currentTime: video.currentTime,
      volume: video.volume,
      muted: video.muted,
      playbackRate: video.playbackRate,
      duration: video.duration,
    });

    const stateText = `${formatTime(state.currentTime)} / ${formatTime(
      state.duration
    )} | Volume: ${Math.round(state.volume * 100)}% | Muted: ${
      state.muted ? "On" : "Off"
    } | Speed: ${state.playbackRate.toFixed(2)}x`;
    document.getElementById("ytkb-current-state").textContent = stateText;
  };

  const startVideoStateUpdate = () => {
    if (!stateUpdateInterval) {
      stateUpdateInterval = setInterval(updateVideoState, 1000);
    }
  };

  const stopVideoStateUpdate = () => {
    clearInterval(stateUpdateInterval);
    stateUpdateInterval = null;
  };

  // Keyboard event handling
  const handleKeydown = (e) => {
    if (
      e.target.tagName.toLowerCase() === "input" ||
      e.target.tagName.toLowerCase() === "textarea"
    ) {
      return;
    }

    const video = getVideo();
    if (!video) return;

    let handled = true;
    let feedbackMessage = "";
    const ctrl = e.ctrlKey;

    switch (e.key.toLowerCase()) {
      case "h":
      case "arrowleft": {
        // Rewind
        const seekBackward = ctrl ? SEEK_TIME * 2 : SEEK_TIME;
        video.currentTime = Math.max(0, video.currentTime - seekBackward);
        feedbackMessage = `Rewound ${seekBackward}s`;
        state.currentTime = video.currentTime;
        break;
      }
      case "j":
      case "arrowdown": {
        // Volume down
        const volumeDownChange = ctrl ? VOLUME_CHANGE * 2 : VOLUME_CHANGE;
        const newVolume = Math.max(0, video.volume - volumeDownChange / 100);
        video.volume = newVolume;
        feedbackMessage = `Volume: ${Math.round(newVolume * 100)}%`;
        state.volume = newVolume;
        break;
      }
      case "k":
      case "arrowup": {
        // Volume up
        const volumeUpChange = ctrl ? VOLUME_CHANGE * 2 : VOLUME_CHANGE;
        const newVolume = Math.min(1, video.volume + volumeUpChange / 100);
        video.volume = newVolume;
        feedbackMessage = `Volume: ${Math.round(newVolume * 100)}%`;
        state.volume = newVolume;
        break;
      }
      case "l":
      case "arrowright": {
        // Forward
        const seekForward = ctrl ? SEEK_TIME * 2 : SEEK_TIME;
        video.currentTime = Math.min(
          video.duration,
          video.currentTime + seekForward
        );
        feedbackMessage = `Forward ${seekForward}s`;
        state.currentTime = video.currentTime;
        break;
      }
      case "m": // Mute
        video.muted = !video.muted;
        feedbackMessage = `Muted: ${video.muted ? "On" : "Off"}`;
        state.muted = video.muted;
        break;
      case ",": // Decrease speed
        video.playbackRate = Math.max(MIN_SPEED, video.playbackRate - 0.25);
        feedbackMessage = `Speed: ${video.playbackRate.toFixed(2)}x`;
        state.playbackRate = video.playbackRate;
        break;
      case ".": // Increase speed
        video.playbackRate = Math.min(MAX_SPEED, video.playbackRate + 0.25);
        feedbackMessage = `Speed: ${video.playbackRate.toFixed(2)}x`;
        state.playbackRate = video.playbackRate;
        break;
      case "z": // Reset speed
        video.playbackRate = 1.0;
        feedbackMessage = `Speed: ${video.playbackRate.toFixed(2)}x`;
        state.playbackRate = video.playbackRate;
        break;
      case "i": // Toggle Picture-in-Picture
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
          feedbackMessage = "Picture-in-Picture: Off";
        } else if (document.pictureInPictureEnabled) {
          video.requestPictureInPicture();
          feedbackMessage = "Picture-in-Picture: On";
        }
        break;
      case "f": // Toggle fullscreen
        document
          .querySelector(".ytp-fullscreen-button")
          .dispatchEvent(new MouseEvent("click"));
        break;
      // case ' ': // Play/Pause
      //     if (video.paused) {
      //       video.play();
      //       feedbackMessage = 'Playing';
      //     } else {
      //       video.pause();
      //       feedbackMessage = 'Paused';
      //     }
      // break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
      showUIFeedback(feedbackMessage);
      updateVideoState();
    }
  };

  // Event listeners
  document.addEventListener("keydown", handleKeydown, {
    capture: true,
  });
  window.addEventListener("load", startVideoStateUpdate);
  window.addEventListener("unload", stopVideoStateUpdate);

  let stateElementCreated = false;
  const interval = setInterval(() => {
    if (stateElementCreated) {
      clearInterval(interval);
      return;
    }

    const topRow = document.getElementById("below");
    if (topRow) {
      topRow.insertBefore(createCurrentStateElement(), topRow.firstChild);
      stateElementCreated = true;
    }
  }, 500);
})();
