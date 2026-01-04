// ==UserScript==
// @name        TargetSwitch(Neon)
// @namespace   TargetSwitch(Neon)
// @description Play a sound if Nintendo Switch (Neon) is in stock
// @version     9
// @include 	https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401446/TargetSwitch%28Neon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401446/TargetSwitch%28Neon%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (!(/Temporarily out of stock/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}