// ==UserScript==
// @name     Plex Skip right is 10 seconds
// @namespace   https://www.stardecimal.com/
// @include     http://127.0.0.1:32400/web/index.html#!/media/*
// @description Pressing the right arrow key skips 10 seconds instead of 30 seconds
// @author      lifeweaver
// @version  3
// @license MIT
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/489603/Plex%20Skip%20right%20is%2010%20seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/489603/Plex%20Skip%20right%20is%2010%20seconds.meta.js
// ==/UserScript==


(function() {
  document.body.addEventListener('keydown', (e) => {
    if(e.keyCode === 39 && document.querySelector('.show-video-player') != null) {
      e.preventDefault();
      e.stopImmediatePropagation();
      let player = document.querySelector('video')
      player.currentTime = player.currentTime + 10
    }
  });

})();