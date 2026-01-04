// ==UserScript==
// @name        NintendoSwitchTarget
// @namespace   NintendoSwitchTarget
// @description Play a sound if switch is in stock
// @version     1
// @match 			https://www.target.com/p/nintendo-switch*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401385/NintendoSwitchTarget.user.js
// @updateURL https://update.greasyfork.org/scripts/401385/NintendoSwitchTarget.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Temporarily out of stock/i.test (document.body.innerHTML) ) )
{
  document.title = "IN STOCK!";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}