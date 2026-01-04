// ==UserScript==
// @name        YouTube Better Keys
// @author      Dev Amr Hejazi
// @namespace   namespace_devamrhejazi
// @license     MIT
// @match       https://www.youtube.com/*
// @noframes
// @grant       none
// @version     2021.11.26
// @description arrow keys controls even if player not selected + fine tune settings
// @downloadURL https://update.greasyfork.org/scripts/436126/YouTube%20Better%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/436126/YouTube%20Better%20Keys.meta.js
// ==/UserScript==

// tested in ViolentMonkey

(function() {
   "use strict";

   // ------- SETTINGS ---------
   const seekJump = 10; // in seconds
   const volStep = 10; // in %


   // ------- Main Code ---------
   function main() {
      let player = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
      //console.log(Object.getOwnPropertyNames(player));
      window.onkeydown = function(e) { 
         if(e.keyCode == 38) { // Arrow key UP
            e.preventDefault();
            player.unMute();
            player.setVolume(player.getVolume() + volStep);
            
         }
         if(e.keyCode == 40) { // Arrow key Down
            e.preventDefault();
            player.setVolume(player.getVolume() - volStep);
         }
         
         // TODO: figure out how to disable yt 5 second seek when arrow keys are pressed
         
         if(e.keyCode == 37) { // Arrow key LEFT
            player.seekTo(player.getCurrentTime() - seekJump + 5);
         }
         if(e.keyCode == 39) { // Arrow key RIGHT
            player.seekTo(player.getCurrentTime() + seekJump - 5);
         }
         
      }
      window.removeEventListener("yt-navigate-finish", main, true);
   }

   main();
   window.addEventListener("yt-navigate-finish", main, true);

})();