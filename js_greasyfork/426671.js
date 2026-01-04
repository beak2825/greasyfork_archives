// ==UserScript==
// @name        prizm - target search "nba prizm"
// @namespace   prizm - target search "nba prizm"
// @description Play a sound if prizm is in stock
// @version     1
// @include 	https://www.target.com/s?searchTerm=nba+prizm
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/426671/prizm%20-%20target%20search%20%22nba%20prizm%22.user.js
// @updateURL https://update.greasyfork.org/scripts/426671/prizm%20-%20target%20search%20%22nba%20prizm%22.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/s?searchTerm=nba+prizm
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1152-swinging.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if (!(/We couldn’t find a match /i.test (document.body.innerHTML)))
    {
        var currentWindow = window
      window.open("http://localhost:3006/")
      document.title = "MATCH";
      currentWindow.focus()
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)