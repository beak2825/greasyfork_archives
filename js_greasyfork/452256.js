// ==UserScript==
// @name         AnkiWeb: Click anywhere on the screen to play audio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AnkiWeb: Click anywhere on the browser to play the audio sound
// @author       MKL
// @match        https://ankiuser.net/study/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ankiuser.net
// @grant        none
// @license      MKL
// @downloadURL https://update.greasyfork.org/scripts/452256/AnkiWeb%3A%20Click%20anywhere%20on%20the%20screen%20to%20play%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/452256/AnkiWeb%3A%20Click%20anywhere%20on%20the%20screen%20to%20play%20audio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(
      function () {
          document.addEventListener('click', audioPlay);
          function audioPlay() {
              const audio = document.querySelector("audio");
              if (audio.paused) {
                  audio.play();
              }else{
                  audio.currentTime = 0
              }
          }

      },
      1000
    );
})();