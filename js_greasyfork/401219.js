// ==UserScript==
// @name        WalmartRingFit/Switch
// @namespace   WalmartRingFit/Switch
// @description Play a sound if Ring Fit Adventure or switch is in stock
// @version     8
// @include 	https://www.walmart.com/ip/Nintendo-Switch-Ring-Fit-Adventure-Black/434503657*
// @include     https://www.walmart.com/ip/Nintendo-Switch-Bundle*
// @include     https://www.walmart.com/ip/Nintendo-Switch-Console*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401219/WalmartRingFitSwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/401219/WalmartRingFitSwitch.meta.js
// ==/UserScript==


var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Technical difficulties/i.test (document.body.innerHTML) ) && (/Nintendo/i.test (document.body.innerHTML)))
{ 
  if (!(/font-bold">Out of stock/i.test (document.body.innerHTML) ))
  {
    document.title = "MATCH";
    player.play()
  }
  else {
  setTimeout(function(){ location.reload(); }, 15*1000);
  }
}
else {
  setTimeout(function(){ location.reload(); }, 10*1000);
}