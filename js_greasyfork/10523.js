// ==UserScript==
// @name        YouTube - Always Theater Mode
// @namespace   r-a-y/youtube/theater
// @description Set the default viewing mode to Theater Mode.
// @include     https://www.youtube.com/*
// @version     1.4.4
// @grant       none
// @run-at      document-start
// @license     GPL v3
// @downloadURL https://update.greasyfork.org/scripts/10523/YouTube%20-%20Always%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/10523/YouTube%20-%20Always%20Theater%20Mode.meta.js
// ==/UserScript==

// Toggle Theater Mode after YouTube finishes loading a video.
window.addEventListener("yt-navigate-finish", function(event) {
  var newPlayer = document.querySelector('button.ytp-size-button')

  setTimeout(()=> {
    if ( newPlayer && null === document.getElementsByTagName('ytd-watch-flexy')[0].getAttribute('full-bleed-player') ) {
      newPlayer.click()
    }
  }, 600)
})