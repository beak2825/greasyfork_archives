// ==UserScript==
// @name        Remove "Play on TV" Button
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      umNeo
// @license     MIT
// @description Removes the dumb "Play On TV" button so you don't accidentally press it
// @downloadURL https://update.greasyfork.org/scripts/457824/Remove%20%22Play%20on%20TV%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/457824/Remove%20%22Play%20on%20TV%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){

        var PlayOnTV = document.querySelector("button.ytp-remote-button.ytp-button");
        if(PlayOnTV != null) {
          PlayOnTV.remove();
        }
      }, 1000);

})();