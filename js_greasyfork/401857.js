// ==UserScript==
// @name        GamestopRingFit
// @namespace   GamestopRingFit
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 		https://www.gamestop.com/video-games/switch/games/products/ring-fit-adventure/11097187.html
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401857/GamestopRingFit.user.js
// @updateURL https://update.greasyfork.org/scripts/401857/GamestopRingFit.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.gamestop.com/video-games/switch/games/products/ring-fit-adventure/11097187.html
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if ((/availability-in-stock"/.test (document.body.innerHTML)) )
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)