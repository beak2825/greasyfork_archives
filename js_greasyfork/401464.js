// ==UserScript==
// @name        AmazonRingFit (X)
// @namespace   AmazonRingFit (X)
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://www.amazon.com/gp/offer-listing/B07XV4NHHN*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401464/AmazonRingFit%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401464/AmazonRingFit%20%28X%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.com/gp/offer-listing/B07XV4NHHN/

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (/\$79.99/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}