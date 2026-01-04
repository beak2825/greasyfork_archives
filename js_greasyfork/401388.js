// ==UserScript==
// @name        NintendoSwitchAmazonUS
// @namespace   NintendoSwitchAmazonUS
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @match 			https://www.amazon.com/gp/offer-listing*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401388/NintendoSwitchAmazonUS.user.js
// @updateURL https://update.greasyfork.org/scripts/401388/NintendoSwitchAmazonUS.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (/<span class="a-size-base a-text-bold">Lite Console<\/span>/i.test (document.body.innerHTML) || /<span class="a-size-base a-text-bold">Console<\/span>/i.test (document.body.innerHTML) )
{
  document.title = "Watching: " + document.title
  
  if (/<img alt="Amazon.com"/i.test (document.body.innerHTML) ) 
  {
    document.title = "IN STOCK!";
    player.play()
  }
  else {
    setTimeout(function(){ location.reload(); }, 15*1000);
  }
}