// ==UserScript==
// @name         F1tv play/skip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip/rewind and pause with arrow keys and spacebar on F1tv
// @author       Reddit
// @include    https://f1tv.formula1.com/*
// @downloadURL https://update.greasyfork.org/scripts/394176/F1tv%20playskip.user.js
// @updateURL https://update.greasyfork.org/scripts/394176/F1tv%20playskip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(event) {
      // Cancel the default action, if needed
      event.preventDefault();
      if (event.keyCode === 32) {
        document.getElementsByClassName("play-pause-button")[0].click();
      }
      if (event.keyCode === 37) {
        document.getElementById("hlsjsContent").currentTime -= 5;
      }
      if (event.keyCode === 39) {
        document.getElementById("hlsjsContent").currentTime += 5;
      }
    });

    document.getElementsByClassName("playerContainer")[0].addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementsByClassName("play-pause-button")[0].click()
  });

})();