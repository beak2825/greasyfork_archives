// ==UserScript==
// @name        NintendoSwitchBH
// @namespace   NintendoSwitchBH
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @match 			https://www.bhphotovideo.com/c/product/*_switch_with_*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401387/NintendoSwitchBH.user.js
// @updateURL https://update.greasyfork.org/scripts/401387/NintendoSwitchBH.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Notify when available/i.test (document.body.innerHTML) ) )
{
  document.title = "IN STOCK!";
  player.play()
  setTimeout(function(){ document.title = "IN STOCK!"; }, 2*1000);
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}