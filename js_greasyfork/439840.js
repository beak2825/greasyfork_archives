// ==UserScript==
// @name        Pandora.com desktop player hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://www.pandora.com/*
// @grant       none
// @version     1.0.0
// @author      hobbycoder7
// @description keyboard short cuts to thumbs down, tired of track, thumbs up, and next track. J K L and N.
// @downloadURL https://update.greasyfork.org/scripts/439840/Pandoracom%20desktop%20player%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/439840/Pandoracom%20desktop%20player%20hotkeys.meta.js
// ==/UserScript==


(function () {
  document.addEventListener("keydown", function(e) {
    if (document.querySelector('.nowPlayingTopInfo__current__icon button') != null) { // so hotkeys only work on Now Playing Screen. 
      if (e.key === "j" || e.key === "J") { 
        // thumbs down
        document.querySelector('.ThumbDownButton.Tuner__Control__Button.Tuner__Control__ThumbDown__Button').click();
      } else if (e.key === "k" || e.key === "K") { 
        // tired of track
        document.querySelector('.nowPlayingTopInfo__current__icon button').click();
        document.querySelector("[data-qa='source_card_tired_of_track']").click();
      } else if (e.key === "l" || e.key === "L") { 
        // thumbs up
        document.querySelector('.ThumbUpButton.Tuner__Control__Button.Tuner__Control__ThumbUp__Button').click();
      } else if (e.key === "n" || e.key === "N") { 
        // next track/skip current
        document.querySelector('.SkipButton.Tuner__Control__Button.Tuner__Control__Skip__Button').click();
      }
    }
  });
})();
