// ==UserScript==
// @name        TargetSwitch(Gray)
// @namespace   TargetSwitch(Gray)
// @description Play a sound if Nintendo Switch (Gray) is in stock
// @version     9
// @include 	https://www.target.com/p/nintendo-switch-with-gray-joy-con/-/A-77464002*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401445/TargetSwitch%28Gray%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401445/TargetSwitch%28Gray%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/nintendo-switch-with-gray-joy-con/-/A-77464002

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