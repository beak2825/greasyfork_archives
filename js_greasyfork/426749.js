// ==UserScript==
// @name        prizm - hanger
// @namespace   prizm - hanger
// @description Play a sound if prizm is in stock
// @version     1
// @include 	https://www.walmart.com/ip/Panini-2020-21-Prizm-NBA-Basketball-Trading-Cards-Hanger-Box-20-Cards/674730375
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/426749/prizm%20-%20hanger.user.js
// @updateURL https://update.greasyfork.org/scripts/426749/prizm%20-%20hanger.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.walmart.com/ip/Panini-2020-21-Prizm-NBA-Basketball-Trading-Cards-Hanger-Box-20-Cards/674730375
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1152-swinging.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if ((/Add to cart/i.test (document.body.innerHTML)))
    {
        var currentWindow = window
      window.open("http://localhost:3008/")
      document.title = "MATCH";
      currentWindow.focus()
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)