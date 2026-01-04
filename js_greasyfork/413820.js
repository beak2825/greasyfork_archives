// ==UserScript==
// @name        TotalCards	
// @namespace   TotalCards
// @description TotalCards ETB is out of stock
// @version     1
// @match 			https://www.totalcards.net/pokemon-hidden-fates-elite-trainer-box-reprint*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/413820/TotalCards.user.js
// @updateURL https://update.greasyfork.org/scripts/413820/TotalCards.meta.js
// ==/UserScript==


var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Sold Out/i.test (document.body.innerHTML) ) )
{
  document.title = "IN STOCK!";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 30*1000);}
