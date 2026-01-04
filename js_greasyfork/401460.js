// ==UserScript==
// @name        BestBuyRingFit (X)
// @namespace   BestBuyRingFit (X)
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 		https://www.bestbuy.com/site/ring-fit-adventure-nintendo-switch/6352149*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401460/BestBuyRingFit%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401460/BestBuyRingFit%20%28X%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/ring-fit-adventure-nintendo-switch/6352149

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (!(/Sold out/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}