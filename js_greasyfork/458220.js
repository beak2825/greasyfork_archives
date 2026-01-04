// ==UserScript==
// @name         Better Short Player
// @version      0.7
// @description  Replaces shorts player with the "normal" youtube player
// @author       Phorz
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        GM_addStyle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/458220/Better%20Short%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/458220/Better%20Short%20Player.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Regex to match video URLs with "shorts" in them
  const playerUrlRegex = /\/shorts\/(.+)/;

  // Flag to keep track if it's the first time starting the script
  let firstStart = true;

  /**
   * Replaces the shorts player with the normal YouTube player
   */
  function replacePlayer() {
    const match = window.location.href.match(playerUrlRegex);
    if (match) {
      const videoId = match[1];
      const player = document.querySelector(".video-stream.html5-main-video");
      if (player) {
        GM_addStyle(`
          ytd-reel-player-overlay-renderer #overlay.ytd-reel-player-overlay-renderer {
            visibility: hidden;
          }
          .player-controls.ytd-reel-video-renderer {
            display: none;
          }`);
        const oldPlayer = document.getElementById("embed-player");
        if (oldPlayer) {
          oldPlayer.remove();
        }
        const newPlayer = document.createElement("iframe");
        newPlayer.width = player.clientWidth;
        newPlayer.height = player.clientWidth * 1.776;
        newPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        newPlayer.frameBorder = "0";
        newPlayer.allow = "fullscreen";
        newPlayer.id = "embed-player";
        player.parentNode.replaceChild(newPlayer, player);
        firstStart = false;
      }
    }
  }

  /**
   * Called when a navigation event has finished
   */
  function onNavigationFinish() {
      setTimeout(replacePlayer, 500);
  }

  /**
   * Starts the script
   */
  function start() {
    // Listen for navigation events
    window.addEventListener('yt-navigate-finish', onNavigationFinish);
  }

  /**
   * Stops the script
   */
  function stop() {
    window.removeEventListener('yt-navigate-finish', onNavigationFinish);
  }

  // Start the script when the page is loaded
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }

  // Stop the script when the page is unloaded
  window.addEventListener("unload", stop);
})();
