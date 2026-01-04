// ==UserScript==
// @name         YouTube Volume and Time Mouse Controlled
// @namespace    PoKeRGT
// @version      1.04
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description  Volume/Time mouse control for Youtube
// @author       PoKeRGT
// @match        https://www.youtube.com/watch*
// @grant        none
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493044/YouTube%20Volume%20and%20Time%20Mouse%20Controlled.user.js
// @updateURL https://update.greasyfork.org/scripts/493044/YouTube%20Volume%20and%20Time%20Mouse%20Controlled.meta.js
// ==/UserScript==

var videoElement = document.getElementById('movie_player');

function volumeControl(event) {
  if (event.deltaY > 0) { // mouse wheel up
    videoElement.setVolume(videoElement.getVolume() - 5);
  } else { // mouse wheel down
    videoElement.setVolume(videoElement.getVolume() + 5);
  }
  console.log(videoElement.getVolume());
}

function timeControl(event, shiftKey) {
  let time_to_seek = 5;
  if (shiftKey) {
    time_to_seek = 0.5;
  }

  if (event.deltaY > 0) { // mouse wheel up
    videoElement.seekToStreamTime(videoElement.getCurrentTime() - time_to_seek);
  } else { // mouse wheel down
    videoElement.seekToStreamTime(videoElement.getCurrentTime() + time_to_seek);
  }
  console.log(videoElement.getCurrentTime());
}

document.addEventListener('wheel', function (event) {
  var rect = videoElement.getBoundingClientRect();
  if (event.clientX > rect.left && event.clientX < rect.right &&
    event.clientY > rect.top && event.clientY < rect.bottom) {
    cancelScroll(event);
    if (event.clientX < window.innerWidth / 2) { // left half of the screen
      volumeControl(event);
    }
    else { // right half of the screen
      timeControl(event, event.shiftKey);
    }
  }
}, { passive: false });

function cancelScroll(event) {
  event.preventDefault();
}