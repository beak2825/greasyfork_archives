// ==UserScript==
// @name        LegoMariotarget
// @namespace   LegoMariotarget
// @description Play a sound if switch is in stock
// @match 			https://www.target.com/p/lego-super-mario-adventures-with-mario-starter-course*
// @author      Dawdie

// @version 0.0.1.20200419225610
// @downloadURL https://update.greasyfork.org/scripts/401438/LegoMariotarget.user.js
// @updateURL https://update.greasyfork.org/scripts/401438/LegoMariotarget.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Preorders have sold out./i.test (document.body.innerHTML) ))
{
  document.title = "IN STOCK!";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}