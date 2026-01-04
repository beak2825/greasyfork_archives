// ==UserScript==
// @name        AmazonRingFitNA
// @namespace   AmazonRingFitNA
// @description Play a sound if Ring Fit Adventure is in stock
// @version     4
// @include 	https://www.amazon.com/gp/offer-listing/B07XV4NHHN*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401215/AmazonRingFitNA.user.js
// @updateURL https://update.greasyfork.org/scripts/401215/AmazonRingFitNA.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.com/gp/offer-listing/B07XV4NHHN/

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (/<img alt="Amazon.com/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}