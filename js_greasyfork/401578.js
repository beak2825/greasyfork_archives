// ==UserScript==
// @name         Spotifresh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reload and autoplay Spotify when it stops (because I'm blocking ads)
// @author       Your neighbor
// @include        https://open.spotify.com/playlist/*
// @include        https://open.spotify.com/album/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401578/Spotifresh.user.js
// @updateURL https://update.greasyfork.org/scripts/401578/Spotifresh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
const ONE_SECOND = 1000;
    
const playOnLoad = () => {
  const intervalLoop = () => {
    const playButton = document.getElementsByClassName("spoticon-play-16")[0];
    const playbackTimeEl = document.getElementsByClassName(
      "playback-bar__progress-time"
    )[0];
    const playbackTime = playbackTimeEl ? playbackTimeEl.textContent : null;
    const pausedAndNotAdvancing = playbackTime === "0:00" && playButton;
    setTimeout(() => {
      pausedAndNotAdvancing ? playButton.click() : intervalLoop();
    }, ONE_SECOND);
  };
  intervalLoop();
};
    
setTimeout(() => {
    playOnLoad();
}, 5 * ONE_SECOND);


const callAfterNSecondsOfTrue = (callback, seconds, condition) => {
  const intervalLoop = secondsLeft => {
    if (secondsLeft < seconds) {
      console.log("tick ", secondsLeft);
    }
    if (secondsLeft <= 0) {
      callback();
    }
    setTimeout(() => {
      condition() ? intervalLoop(secondsLeft - 1) : intervalLoop(seconds);
    }, ONE_SECOND);
  };
  intervalLoop(seconds);
};

function playingAndNotAdvancing() {
  const pauseButton = document.getElementsByClassName("spoticon-pause-16")[0];
  const playbackTimeEl = document.getElementsByClassName(
    "playback-bar__progress-time"
  )[0];
  const playbackTime = playbackTimeEl ? playbackTimeEl.textContent : null;
  return playbackTime === "0:00" && pauseButton;
}

const reload = () => {
  console.log("reloading...");
  location.reload();
};

callAfterNSecondsOfTrue(reload, 10, playingAndNotAdvancing);
})();