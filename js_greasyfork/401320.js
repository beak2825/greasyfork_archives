// ==UserScript==
// @name        NintendoRingFitUK
// @namespace   NintendoRingFitUK
// @description Play a sound if Ring Fit Adventure is in stock
// @version     3
// @include 	https://store.nintendo.co.uk/nintendo-switch-game/ring-fit-adventure/12291606*
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401320/NintendoRingFitUK.user.js
// @updateURL https://update.greasyfork.org/scripts/401320/NintendoRingFitUK.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://store.nintendo.co.uk/nintendo-switch-game/ring-fit-adventure/12291606.html

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Sorry, this product is currently out of stock./i.test (document.body.innerHTML) ))
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}