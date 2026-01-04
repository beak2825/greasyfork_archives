// ==UserScript==
// @name        NintendoSwitchAmazonCA
// @namespace   NintendoSwitchAmazonCA
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @match 			https://www.amazon.ca/gp/offer-listing*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401527/NintendoSwitchAmazonCA.user.js
// @updateURL https://update.greasyfork.org/scripts/401527/NintendoSwitchAmazonCA.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (/<b>Platform:<\/b> Nintendo Switch/i.test (document.body.innerHTML) )
{
  document.title = "Watching: " + document.title
  
  if (/<img alt="Amazon.ca"/i.test (document.body.innerHTML) ) 
  {
    document.title = "IN STOCK!";
    player.play()
  }
  else {
    setTimeout(function(){ location.reload(); }, 15*1000);
  }
}