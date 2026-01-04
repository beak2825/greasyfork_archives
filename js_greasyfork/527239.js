// ==UserScript==
// @name         Auto Picture-in-Picture on Tab Change
// @name:ar      التبديل التلقائي إلى وضع الصورة داخل الصورة (PiP)
// @namespace    https://github.com/EzioTheGoat/EzioUserscripts
// @version      1.3.1
// @description  Auto-enables PiP for playing videos in Chromium browsers on tab switch. Requires an initial click to unlock and exits on return.
// @description:ar  يُفعّل وضع الصورة داخل الصورة (PiP) تلقائيًا لمقاطع الفيديو في متصفحات Chromium عند التبديل بين علامات التبويب. يتطلب نقرة أولى لإلغاء القفل ويخرج عند الرجوع.
// @author       Ezio Auditore
// @license      MIT
// @icon         https://img.icons8.com/ios-filled/64/000000/picture-in-picture.png
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527239/Auto%20Picture-in-Picture%20on%20Tab%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/527239/Auto%20Picture-in-Picture%20on%20Tab%20Change.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Auto PiP for Chromium browsers on tab change.
   *
   * The script waits for an initial user click to "unlock" the auto-PiP feature,
   * satisfying the user gesture requirement enforced by browsers. When the page loses focus,
   * if there is an actively playing video, the script requests Picture-in-Picture mode.
   * On regaining focus, it exits Picture-in-Picture mode.
   *
   * Note: PiP mode will not be activated if the video is paused.
   */

  // Flag to indicate that auto-PiP has been unlocked by a user gesture
  let unlocked = false;

  /**
   * Unlocks auto-PiP after the first user click.
   */
  function unlockPiP() {
    unlocked = true;
    document.removeEventListener("click", unlockPiP);
    console.log("Auto-PiP unlocked by user interaction.");
  }
  document.addEventListener("click", unlockPiP);

  /**
   * Returns the first available video element that is actively playing.
   * @returns {HTMLVideoElement|null} The active video element or null if none found.
   */
  function getActiveVideo() {
    const videos = document.querySelectorAll("video");
    for (const video of videos) {
      if (!video.paused && !video.ended) {
        return video;
      }
    }
    return videos.length ? videos[0] : null;
  }

  /**
   * Enters Picture-in-Picture mode if an active (playing) video is found.
   */
  async function enterPiP() {
    if (!unlocked) {
      console.log(
        "Auto-PiP is locked. Please click anywhere on the page to enable it."
      );
      return;
    }
    try {
      const video = getActiveVideo();
      // Only enter PiP if a video exists and it is playing
      if (
        video &&
        !video.paused &&
        document.pictureInPictureElement !== video
      ) {
        await video.requestPictureInPicture();
        console.log("Entered Picture-in-Picture mode.");
      } else {
        console.log("No active (playing) video available for PiP.");
      }
    } catch (error) {
      console.error("Error entering Picture-in-Picture mode:", error);
    }
  }

  /**
   * Exits Picture-in-Picture mode if active.
   */
  async function exitPiP() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        console.log("Exited Picture-in-Picture mode.");
      }
    } catch (error) {
      console.error("Error exiting Picture-in-Picture mode:", error);
    }
  }

  /**
   * Helper function to delay the execution of an action.
   * @param {Function} action - The action to perform after the delay.
   * @param {number} delay - The delay in milliseconds.
   */
  function delayedAction(action, delay = 100) {
    setTimeout(action, delay);
  }

  // Event listeners for tab focus and blur events to trigger PiP mode changes.
  window.addEventListener("blur", () => {
    delayedAction(enterPiP);
  });

  window.addEventListener("focus", () => {
    delayedAction(exitPiP);
  });

  // Additional visibility change handling for more robust behavior.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      delayedAction(enterPiP);
    } else if (document.visibilityState === "visible") {
      delayedAction(exitPiP);
    }
  });
})();
