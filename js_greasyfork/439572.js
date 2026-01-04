// ==UserScript==
// @name         Youtube shuffle bitbucket.io helper
// @namespace    https://youtube-playlist-randomizer.bitbucket.io/
// @version      1.4
// @description  Adds a few features from youtube playlists to youtube-playlist-randomizer
// @author       lopt24d
// @match        https://youtube-playlist-randomizer.bitbucket.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439572/Youtube%20shuffle%20bitbucketio%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439572/Youtube%20shuffle%20bitbucketio%20helper.meta.js
// ==/UserScript==


(function() {
      
  // Autostart bookmarked playlist
  var pid = new URL(window.location).searchParams.get("pid");
  if (pid != null) {
    document.getElementById("pid").value = pid;
    getVids();
  }
  
  var playerFound = false;
  
  var seekPlayer = setInterval(function () {
    if (player) {
      playerFound = true;
      clearInterval(seekPlayer);
    }
  }, 1000);
  
  var focus;
    
  window.addEventListener('keydown', function(event) {
    focus = document.activeElement.tagName;
    if (!(focus == "INPUT" || focus == "TEXTAREA") && playerFound) {
      switch (event.keyCode) {
        case ('N'.charCodeAt()):  // Next video
          playNext();
          break;
        case ('P'.charCodeAt()):  // Previous video
          playPrev();
          break;
        case ('R'.charCodeAt()):  // Reshuffle
          getVids();
          break;
        case ('H'.charCodeAt()):  // hide/show playlist
          document.getElementById("list").setAttribute("size", document.getElementById("list").getAttribute("size") ^ "10")
          break;
        case ('L'.charCodeAt()):  // seek forward 10 seconds
          player.seekTo(player.getCurrentTime() + 10);
          break;
        case ('J'.charCodeAt()):  // seek backwards 10 seconds
          player.seekTo(player.getCurrentTime() - 10);
          break;
        case ('K'.charCodeAt()):  // pause/unpause video
          if (player.getPlayerState() == 1)
            player.pauseVideo();
          else
            player.playVideo();
          break;
        case ('M'.charCodeAt()):  // mute/unmute video
          if (player.isMuted())
            player.unMute();
          else
            player.mute();
          break;
      }
    }
  });
  
})();
