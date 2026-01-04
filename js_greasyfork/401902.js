// ==UserScript==
// @name        Supreme COVID
// @namespace   Supreme COVID
// @description Play a sound if Supreme COVID is in stock
// @version     1
// @include 	https://www.supremenewyork.com/shop/t-shirts/k0ju451hy
// @author      willhe

// @downloadURL https://update.greasyfork.org/scripts/401902/Supreme%20COVID.user.js
// @updateURL https://update.greasyfork.org/scripts/401902/Supreme%20COVID.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.supremenewyork.com/shop/t-shirts/k0ju451hy
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if (/Small/i.test (document.body.innerHTML) || /Medium/i.test (document.body.innerHTML) || /Large/i.test (document.body.innerHTML) || /XLarge/i.test (document.body.innerHTML)) 
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)