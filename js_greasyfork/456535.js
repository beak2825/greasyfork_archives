// ==UserScript==
// @name         YouTube stop already
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This program allows you to try bruteforce stopping on a video, so this oftentimes works when a space key or a click doesn't work.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456535/YouTube%20stop%20already.user.js
// @updateURL https://update.greasyfork.org/scripts/456535/YouTube%20stop%20already.meta.js
// ==/UserScript==

document.addEventListener('keyup', async function(e){
  const sleep = m => new Promise(r => setTimeout(r, m))

  if (e.key == "v") {
    if (document.querySelector('#movie_player > div.html5-video-container > video').matches(':hover') == true) {
      for (i = 0; i < 200 / 20 ; i++){
          document.querySelector('#movie_player > div.html5-video-container > video').pause()
          await sleep(20) ;
      }
    }
  }

} , false);