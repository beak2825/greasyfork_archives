// ==UserScript==
// @name        YouTube Wait for Me - Pause and Start Player in Background Tabs
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.7
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @description Pause the video in YouTube tabs opened in the background, play on activation 2016-08-18 (I know, it doesn't pause fast enough)
// @include     http*://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22426/YouTube%20Wait%20for%20Me%20-%20Pause%20and%20Start%20Player%20in%20Background%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/22426/YouTube%20Wait%20for%20Me%20-%20Pause%20and%20Start%20Player%20in%20Background%20Tabs.meta.js
// ==/UserScript==
// See: https://developer.mozilla.org/docs/Web/API/Page_Visibility_API

var videoElement = document.querySelector('#movie_player video');
if (videoElement){
  if (document["hidden"]) { // background tab
    // Mute the player ASAP
    videoElement.muted = true;
    // Pause the player
    videoElement.pause();
    // Seek to the beginning
    videoElement.currentTime = 0;
    // Set up event handler to watch for tab becoming visible
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
  }
}

function handleVisibilityChange() {
  if (document["hidden"]) {
    // Pause the player
    videoElement.pause();
  } else {
    // Resume the video after a quarter second
    window.setTimeout(function(){videoElement.play()}, 250);
    videoElement.muted = false;
    // We're not going to pause again, so remove event listener
    document.removeEventListener("visibilitychange", handleVisibilityChange, false);
  }
}