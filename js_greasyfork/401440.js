// ==UserScript==
// @name        BestBuySwitch(Gray Joy-Con)
// @namespace   BestBuySwitch(Gray Joy-Con)
// @description Play a sound if Nintendo Switch (Gray Joy-Con) is in stock
// @version     3
// @include 	https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401440/BestBuySwitch%28Gray%20Joy-Con%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401440/BestBuySwitch%28Gray%20Joy-Con%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/2421fcb1263b9530df88f7f002e78ea5/file-39_martian-gun.mp3';
player.preload = 'auto';

if (!(/Sold out/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 6*1000);
}