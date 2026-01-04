// ==UserScript==
// @name         Player controls for Coursera
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Adds player controls
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://www.coursera.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532359/Player%20controls%20for%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/532359/Player%20controls%20for%20Coursera.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const OBSERVER_OPTIONS = {childList: true, subtree: true};

  let elVideoContainer;
  let elVideo;

  const observerVideoControls = new MutationObserver(async (_, observer) => {
    elVideo = document.querySelector(".item-page-content video");
    if (!elVideo?.id) {
      return;
    }
    elVideoContainer = document.querySelector("#persistent_fullscreen");
    addIdleListener();
    observer.disconnect();
  });
  observerVideoControls.observe(document, OBSERVER_OPTIONS);

  new MutationObserver(() => {
    observerVideoControls.observe(document, OBSERVER_OPTIONS);
  }).observe(document.querySelector("title"), OBSERVER_OPTIONS);

  document.addEventListener("click", () => {
    const isElementVideoDiv = document.activeElement === document.querySelector(".video-js");
    if (isElementVideoDiv) {
      elVideo?.focus();
    }
  });

  addEventListener("focus", () => {
    if (!elVideo) {
      return;
    }

    if (document.webkitIsFullScreen) {
      elVideoContainer.focus();
    }
  });

  function clickPlay() {
    const elPlayToggle = document.querySelector(".rc-PlayToggle");
    elPlayToggle.click();
  }

  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) {
      return;
    }

    switch (e.code) {
      case "KeyP":
      case "KeyN": {
        if (!e.shiftKey) {
          return;
        }

        const [elButtonPrevious, elButtonNext] = [...document.querySelectorAll(".rc-PreviousAndNextItem a")];
        if (e.code === "KeyP") {
          elButtonPrevious.click();
          return;
        }
        elButtonNext.click();
        return;
      }
    }

    if (!elVideo) {
      return;
    }

    switch (e.code) {
      case "KeyK":
      case "Space":
        e.preventDefault();
        clickPlay();
        break;

      case "KeyJ":
      case "KeyL":
      case "ArrowLeft":
      case "ArrowRight": {
        const seekMapping = {
          KeyJ: 10,
          KeyL: 10,
          ArrowLeft: 5,
          ArrowRight: 5
        };

        const secondsToSeek = seekMapping[e.code];

        const isBackward = Boolean(e.code.match(/KeyJ|ArrowLeft/));

        if (isBackward) {
          elVideo.currentTime = Math.max(0, elVideo.currentTime - secondsToSeek);
        } else {
          elVideo.currentTime = Math.min(elVideo.duration, elVideo.currentTime + secondsToSeek);
        }
      }
        break;

      case "ArrowUp":
      case "ArrowDown": {
        e.preventDefault();

        const volumeChangeRate = 0.05;
        if (e.key === "ArrowUp") {
          elVideo.volume = Math.min(1, elVideo.volume + volumeChangeRate);
          return;
        }
        elVideo.volume = Math.max(0, elVideo.volume - volumeChangeRate);
        return;
      }

      case "KeyM": {
        const elMute = document.querySelector(".rc-VolumeMenu button");
        elMute.click();
        return;
      }

      case "KeyC": {
        const elSubtitles = [...document.querySelectorAll(".subtitle-button")];
        const elCheckbox = elSubtitles[0].querySelector(".c-subtitles-menu-item-selected-icon");
        const isSubtitlesOn =
          elCheckbox && getComputedStyle(elCheckbox, "::before").getPropertyValue("content") === "none";
        if (isSubtitlesOn) {
          elSubtitles[0].click();
          return;
        }
        const elEnglishSubtitle = elSubtitles.find(elSubtitle => elSubtitle.textContent.includes("English"));
        elEnglishSubtitle.click();
        return;
      }

      case "Comma":
      case "Period": {
        if (!e.shiftKey) {
          return;
        }

        const keyToButtons = {
          Comma: "minus",
          Period: "plus"
        };

        const elPlaybackButton = document.querySelector(`.playback-rate-change-controls button:has(.cif-${keyToButtons[e.code]})`);
        elPlaybackButton.click();
        return;
      }

      case "Home":
        elVideo.currentTime = 0;
        return;

      case "End":
        elVideo.currentTime = elVideo.duration;
        return;

      default:
        if (!isNaN(e.key) && !e.ctrlKey && !document.activeElement.matches("input, textarea")) {
          elVideo.currentTime = (e.key / 10) * elVideo.duration;
        }
    }
  });

  function getIsPaused() {
    return Boolean(document.querySelector(".rc-PlayToggle .cif-play"));
  }

  function addIdleListener() {
    let timeoutMouseMove;

    const secondsBeforeHidingControls = 1;

    const onMouseMoveOrSeeked = () => {
      clearTimeout(timeoutMouseMove);
      timeoutMouseMove = setTimeout(() => {
        if (document.webkitIsFullScreen && !getIsPaused()) {
          hidePlayerControls();
        }
      }, secondsBeforeHidingControls * 1000);
    };
    elVideoContainer.addEventListener("mousemove", onMouseMoveOrSeeked);

    elVideo.addEventListener("pause", () => {
      clearTimeout(timeoutMouseMove);
    });

    elVideo.addEventListener("seeked", onMouseMoveOrSeeked);
  }

  async function hidePlayerControls() {
    const elPlayToggle = document.querySelector(".rc-PlayToggle");
    elPlayToggle.click();
    await elVideo.play();
  }
})();
