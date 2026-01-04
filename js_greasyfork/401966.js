// ==UserScript==
// @name        BestBuyCart
// @namespace   BestBuyCart
// @description Play a sound if Cart Ship Avaialble
// @version     4
// @include 	https://www.bestbuy.com/cart*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401966/BestBuyCart.user.js
// @updateURL https://update.greasyfork.org/scripts/401966/BestBuyCart.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/oculus-rift-s-pc-powered-vr-gaming-headset-black/6343150.p?skuId=6343150

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if ((/Shipping to/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}