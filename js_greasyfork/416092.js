// ==UserScript==
// @name        codetantra.com Fullscreen
// @namespace   Violentmonkey Scripts
// @match       https://*.codetantra.com/playback/presentation/2.0/playback.html
// @grant       none
// @version     1.3
// @author      Ujjwal Goel
// @description 11/10/2020, 9:43:13 PM
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/416092/codetantracom%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/416092/codetantracom%20Fullscreen.meta.js
// ==/UserScript==

var viewFullScreen = document.getElementById("presentation-area");
if (viewFullScreen) {
  viewFullScreen.addEventListener("click", function() {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      viewFullScreen.requestFullscreen();
    };
  })
}

document.addEventListener("keydown", event => {
  var video = document.getElementById('video');
  if (event.key === ' ') {
    if (video.paused) {
      video.play();
      viewFullScreen.requestFullscreen();
    }
    else {
      video.pause();
    }}
});

document.addEventListener("keydown", event => {
  if (event.key === 'f') {
    viewFullScreen.requestFullscreen();
  }
})