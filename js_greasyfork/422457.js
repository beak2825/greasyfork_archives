// ==UserScript==
// @name        Half Speed - koinegreek.github.io
// @namespace   Violentmonkey Scripts
// @match       https://koinegreek.github.io/
// @match       https://*.koinegreek.com/greek-audio-reader
// @grant       none
// @version     1.0.3
// @author      lordratte
// @description Half speed audio for the Koine Greek Practice Reader.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/422457/Half%20Speed%20-%20koinegreekgithubio.user.js
// @updateURL https://update.greasyfork.org/scripts/422457/Half%20Speed%20-%20koinegreekgithubio.meta.js
// ==/UserScript==


function rep() {
  setTimeout(function(){
    try {
      document.getElementById('audioID').playbackRate = 0.5;
      rep();
    } catch (e) {}
  }, 1000);
}

rep();