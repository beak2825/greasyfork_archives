// ==UserScript==
// @name         Disable YouTube Miniplayer
// @author       u/IStoleThePies
// @description  disables the YouTube miniplayer
// @match        https://*.youtube.com/*
// @version 0.0.1.20200213082330
// @namespace https://greasyfork.org/users/123592
// @downloadURL https://update.greasyfork.org/scripts/396382/Disable%20YouTube%20Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/396382/Disable%20YouTube%20Miniplayer.meta.js
// ==/UserScript==

document.body.addEventListener("yt-navigate-finish", function(event) {
  if (document.getElementsByTagName('ytd-miniplayer').length) {
    document.querySelector('ytd-miniplayer').parentNode.removeChild(document.querySelector('ytd-miniplayer'));
  }
  if (document.getElementsByClassName('ytp-miniplayer-button').length) {
    document.querySelector('.ytp-miniplayer-button').parentNode.removeChild(document.querySelector('.ytp-miniplayer-button'))
  }
  if (window.location.pathname != "/watch") {
    document.querySelector('#movie_player video').parentNode.removeChild(document.querySelector('#movie_player video'));
  }
});