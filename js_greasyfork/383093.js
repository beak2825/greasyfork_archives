// ==UserScript==
// @name         Twitch - Disable automatic video downscale
// @namespace    CommanderRoot
// @copyright    CommanderRoot
// @license      Unlicense
// @version      1.2.8
// @description  Disables the automatic downscaling of Twitch streams while tabbed away
// @author       https://twitter.com/CommanderRoot
// @match        https://www.twitch.tv/*
// @match        https://m.twitch.tv/*
// @match        https://player.twitch.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383093/Twitch%20-%20Disable%20automatic%20video%20downscale.user.js
// @updateURL https://update.greasyfork.org/scripts/383093/Twitch%20-%20Disable%20automatic%20video%20downscale.meta.js
// ==/UserScript==
"use strict";


// CONFIG start ------
const doOnlySetting = false; // false = do some trickery with document hidden state / true = only set the localStorage option
// CONFIG end --------


// Code
if (doOnlySetting === false) {
  // Try to trick the site into thinking it's never hidden
  Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
  Object.defineProperty(document, 'webkitVisibilityState', { value: 'visible', writable: false });
  document.hasFocus = function () { return true; };
  const initialHidden = document.hidden;
  let didInitialPlay = false;
  let lastVideoPlaying = false;

  // visibilitychange events are captured and stopped
  document.addEventListener('visibilitychange', function (e) {
    if (document.hidden === false && initialHidden === true && didInitialPlay === false) {
      // Allow propagation to prevent black screen when a stream was opened in a new tab
    } else {
      e.stopImmediatePropagation();
    }
    if (document.hidden) {
      didInitialPlay = true;
    }

    // Try to play the video on Chrome
    if (typeof chrome !== 'undefined') {
      if (document.hidden === true) {
        const videos = document.getElementsByTagName('video');
        if (videos.length > 0) {
          lastVideoPlaying = !videos[0].paused && !videos[0].ended;
        } else {
          lastVideoPlaying = false;
        }
      } else {
        playVideo();
      }
    }
  }, true);

  function playVideo() {
    const videos = document.getElementsByTagName('video');
    if (videos.length > 0) {
      if ((didInitialPlay === false || lastVideoPlaying === true) && !videos[0].ended) {
        videos[0].play();
        didInitialPlay = true;
      }
    }
  }
}

function setQualitySettings() {
  // Set the player quality to "Source"
  try {
    window.localStorage.setItem('s-qs-ts', Math.floor(Date.now()));
    window.localStorage.setItem('quality-bitrate', '9840720');
    window.localStorage.setItem('video-quality', '{"default":"1440p60"}');
  } catch (e) {
    console.log(e);
  }
}

setQualitySettings();

// Add event handler for when we switch between pages
// This is useful when we switch for example from a Clip
// without "Source" to a livestream
window.addEventListener('popstate', () => {
  setQualitySettings();
});
