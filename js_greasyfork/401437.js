// ==UserScript==
// @name        LegoMarioBB
// @namespace   LegoMarioBB
// @description Play a sound if lego mario is in stock
// @version     1
// @match 			https://www.bestbuy.com/site/lego-super-mario-adventures-with-mario-starter-course*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401437/LegoMarioBB.user.js
// @updateURL https://update.greasyfork.org/scripts/401437/LegoMarioBB.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Coming Soon/i.test (document.body.innerHTML) ) ) 
{
  document.title = "IN STOCK!";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}