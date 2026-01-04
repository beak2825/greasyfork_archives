// ==UserScript==
// @name        prizm
// @namespace   prizm
// @description Play a sound if prizm is in stock
// @version     1
// @include 	https://www.walmart.com/ip/Panini-Prizm-2020-21-NBA-Basketball-Trading-Cards-Blaster-Box-24-Cards/500335814
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/426643/prizm.user.js
// @updateURL https://update.greasyfork.org/scripts/426643/prizm.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.walmart.com/ip/Panini-Prizm-2020-21-NBA-Basketball-Trading-Cards-Blaster-Box-24-Cards/500335814
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1152-swinging.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if ((/Add to cart/i.test (document.body.innerHTML)))
    {
        var currentWindow = window
      window.open("http://localhost:3005/")
      document.title = "MATCH";
      currentWindow.focus()
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)