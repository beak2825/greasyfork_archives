// ==UserScript==
// @name        Auto skip I understand and wish to proceed message - music.youtube.com
// @namespace   marcusmors.com
// @match       https://music.youtube.com/watch
// @grant       none
// @version     1.0.1
// @author      Jose Vilca <@marcusmors>
// @description skips the annoying content warning of youtube music
// @license     AGPLv3
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/457445/Auto%20skip%20I%20understand%20and%20wish%20to%20proceed%20message%20-%20musicyoutubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/457445/Auto%20skip%20I%20understand%20and%20wish%20to%20proceed%20message%20-%20musicyoutubecom.meta.js
// ==/UserScript==

// based on this great script https://greasyfork.org/en/scripts/425136-auto-agree-skip-youtube-consent-sign-in-pages

((waitTime = 10) => {
  // Select the "I understand and wish to proceed" button
  const button = document.querySelector('.yt-player-error-message-renderer tp-yt-paper-button[aria-label="I understand and wish to proceed"]');
  // If the button is found, click it
  if (button) {
    button.click();
    return;
  }
  // Otherwise, set a timer to check for the button at regular intervals
  const timer = setInterval(() => {
    // Select the "I understand and wish to proceed" button
    const button = document.querySelector('.yt-player-error-message-renderer tp-yt-paper-button[aria-label="I understand and wish to proceed"]');
    // If the button is found, click it and clear the timer
    if (button) {
      button.click();
      clearInterval(timer);
    }
  }, 100);
  // Clear the timer after the specified wait time
  setTimeout(() => clearInterval(timer), waitTime * 1000);
})();
