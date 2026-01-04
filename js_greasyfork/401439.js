// ==UserScript==
// @name        BestBuySwitch(Neon Red/Neon Blue Joy-Con)
// @namespace   BestBuySwitch(Neon Red/Neon Blue Joy-Con)
// @description Play a sound if Nintendo Switch (Neon Red/Neon Blue Joy-Con) is in stock
// @version     3
// @include 	https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401439/BestBuySwitch%28Neon%20RedNeon%20Blue%20Joy-Con%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401439/BestBuySwitch%28Neon%20RedNeon%20Blue%20Joy-Con%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/c5ff2543b53f4cc0ad3819a36752467b/file-playful-jingle-bells.mp3';
player.preload = 'auto';

if (!(/Sold out/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 6*1000);
}