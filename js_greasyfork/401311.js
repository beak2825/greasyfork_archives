// ==UserScript==
// @name        BestBuyRingFit
// @namespace   BestBuyRingFit
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 		https://www.bestbuy.com/site/ring-fit-adventure-nintendo-switch/6352149*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401311/BestBuyRingFit.user.js
// @updateURL https://update.greasyfork.org/scripts/401311/BestBuyRingFit.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/ring-fit-adventure-nintendo-switch/6352149.p?acampID=614286&irclickid=yYiRc3xL1xyOT1q0UfQwQyYMUki2xtSAET2qX80&irgwc=1&loc=yYiRc3xL1xyOT1q0UfQwQyYMUki2xtSAET2qX80&mpid=10078&ref=198&skuId=6352149&intl=nosplash

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Sold out/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}