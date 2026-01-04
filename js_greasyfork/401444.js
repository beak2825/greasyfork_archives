// ==UserScript==
// @name        TargetRingFit (X)
// @namespace   TargetRingFit (X)
// @description Play a sound if Ring Fit Adventure is in stock
// @version     8
// @include 	https://www.target.com/p/ring-fit-adventure-nintendo-switch/-/A-76593324*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401444/TargetRingFit%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401444/TargetRingFit%20%28X%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/ring-fit-adventure-nintendo-switch/-/A-76593324

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (!(/Not available/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}
