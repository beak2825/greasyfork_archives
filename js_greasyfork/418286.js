// ==UserScript==
// @name        walmart
// @namespace   walmart
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://www.walmart.com/browse/video-games/playstation-5-consoles*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/418286/walmart.user.js
// @updateURL https://update.greasyfork.org/scripts/418286/walmart.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.walmart.com/browse/video-games/playstation-5-consoles/2636_3475115_2762884
var player = document.createElement('audio');
player.src = 'https://sz-download-ipv6.ftn.qq.com/ftn_handler/8a252fbe1f7a05137a12486da9290aa3a2360322833163aca62e216c732ed832c027688cb942dc121ea2f29fbc47c825085c06f223ebb2484ddd74a422b5bcaf/?fname=eventually-590.mp3'
player.preload = 'auto';

if (/\ADD TO CART/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}