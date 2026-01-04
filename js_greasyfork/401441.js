// ==UserScript==
// @name        GameStopOculusRiftS
// @namespace   GameStopOculusRiftS
// @description Play a sound if Oculus Rift S is in stock
// @version     11
// @include 	https://www.gamestop.com/video-games/switch/accessories/faceplates-protectors-skins/products/nintendo-switch-tempered-glass-screen-protector/11099172.html?rrec=true*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401441/GameStopOculusRiftS.user.js
// @updateURL https://update.greasyfork.org/scripts/401441/GameStopOculusRiftS.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.gamestop.com/video-games/switch/accessories/faceplates-protectors-skins/products/nintendo-switch-tempered-glass-screen-protector/11099172.html?rrec=true

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if ((/"availability-in-stock">In Stock/i.test (document.body.innerHTML)))
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}