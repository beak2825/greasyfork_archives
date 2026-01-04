// ==UserScript==
// @name        NintendoSwitchBestBuy
// @namespace   NintendoSwitchBestBuy
// @description Play a sound if Ring Fit Adventure is in stock
// @version     2
// @match 			https://www.bestbuy.com/site/nintendo-switch-32gb*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401384/NintendoSwitchBestBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/401384/NintendoSwitchBestBuy.meta.js
// ==/UserScript==

// Leave the browser on a bestbuy 32gb console 

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Sold Out<\/button>/i.test (document.body.innerHTML) ) )
{
  document.title = "IN STOCK!";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}