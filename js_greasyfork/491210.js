// ==UserScript==
// @name         Youtube Spacebar resume/pause fix
// @namespace    https://github.com/lucassilvas1/youtube-spacebar-fix
// @description  Fixes Spacebar not resuming/pausing YouTube videos after alt-tabbing
// @version      1.1.1
// @author       lucassilvas1
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491210/Youtube%20Spacebar%20resumepause%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/491210/Youtube%20Spacebar%20resumepause%20fix.meta.js
// ==/UserScript==

(function () {
  const LISTENER_TRIGGER_DELAY = 10; // Try increasing this number if the script doesn't always work for you

  const playerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };
  Object.freeze(playerState);

  /**
   * @type {(() => void) | null}
   */
  let playVideo = null;
  /**
   * @type {(() => void) | null}
   */
  let pauseVideo = null;
  /**
   * @type {(() => -1 | 0 | 1 | 2 | 3 | 5) | null}
   */
  let getPlayerState = null;

  addKeyListener();
  document.addEventListener("yt-player-updated", onUpdate);

  function onUpdate({ detail }) {
    playVideo = detail.playVideo;
    pauseVideo = detail.pauseVideo;
    getPlayerState = detail.getPlayerState;
  }

  /**
   * Ignore keyboard events if they came from an input so the user can still type comments/search
   * @param {Element} element
   * @returns
   */
  function isInput(element) {
    if (element.getAttribute("contenteditable") === "true") {
      return true;
    }

    if (
      element.tagName.toLowerCase() === "input" ||
      element.tagName.toLowerCase() === "textarea" ||
      element.tagName.toLowerCase() === "select"
    ) {
      return true;
    }

    return false;
  }

  function addKeyListener() {
    window.addEventListener(
      "keyup",
      (e) => {
        // Ignore event if it came from a text input
        if (e.key !== " " || isInput(document.activeElement)) return;

        const oldState = getPlayerState();

        setTimeout(() => {
          const state = getPlayerState();

          if (oldState !== state) return;

          switch (state) {
            case playerState.PLAYING:
              pauseVideo();
              break;
            case playerState.PAUSED:
            case playerState.CUED:
            case playerState.ENDED:
            case playerState.UNSTARTED:
              playVideo();
              break;
            // Do nothing if video is buffering
          }
        }, LISTENER_TRIGGER_DELAY);
      },
      { capture: true }
    );
  }
})();
