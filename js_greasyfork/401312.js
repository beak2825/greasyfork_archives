// ==UserScript==
// @name        TargetRingFit
// @namespace   TargetRingFit
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 		https://www.target.com/p/ring-fit-adventure-nintendo-switch/-/A-76593324*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401312/TargetRingFit.user.js
// @updateURL https://update.greasyfork.org/scripts/401312/TargetRingFit.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/ring-fit-adventure-nintendo-switch/-/A-76593324

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Not available/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}

