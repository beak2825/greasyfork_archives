// ==UserScript==
// @name        gamestop
// @namespace   gamestop
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://www.gamestop.com/video-games/playstation-5/accessories/products/sony-dualsense-wireless-controller/11106262.html?rrec=true
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/417851/gamestop.user.js
// @updateURL https://update.greasyfork.org/scripts/417851/gamestop.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.gamestop.com/video-games/playstation-5/accessories/products/sony-dualsense-wireless-controller/11106262.html?rrec=true

var player = document.createElement('audio');
player.src = 'https://sz-download-ipv6.ftn.qq.com/ftn_handler/58f00b9e4c3fffe9ab381d0a0082f821ee7e9ad98fdc8974fe8db60bfafb7802108539115570ff481175ae4afe3593476b5ad03b4eddb4545373f19157095d6e/?fname=eventually-590.mp3'
player.preload = 'auto';

if (/\ADD TO CART/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 4*1000);
}