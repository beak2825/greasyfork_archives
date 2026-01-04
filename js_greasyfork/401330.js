// ==UserScript==
// @name        AmazonRingFitSG
// @namespace   AmazonRingFitSG
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 		https://www.amazon.sg/dp/B07XV8VSZT*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401330/AmazonRingFitSG.user.js
// @updateURL https://update.greasyfork.org/scripts/401330/AmazonRingFitSG.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.sg/dp/B07XV8VSZT

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Currently unavailable./i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}
