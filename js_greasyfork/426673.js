// ==UserScript==
// @name        prizm - target filter "nba"
// @namespace   prizm - target filter "nba"
// @description Play a sound if prizm is in stock
// @version     1
// @include 	https://www.target.com/c/collectible-trading-cards-hobby-collectibles-toys/nba/-/N-27p31Zndktu
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/426673/prizm%20-%20target%20filter%20%22nba%22.user.js
// @updateURL https://update.greasyfork.org/scripts/426673/prizm%20-%20target%20filter%20%22nba%22.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/c/collectible-trading-cards-hobby-collectibles-toys/nba/-/N-27p31Zndktu
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1152-swinging.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if (!(/try removing some filters/i.test (document.body.innerHTML)))
    {
        var currentWindow = window
      window.open("http://localhost:3007/")
      document.title = "MATCH";
      currentWindow.focus()
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)