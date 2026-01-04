// ==UserScript==
// @name        TheSourceRingFitCA
// @namespace   TheSourceRingFitCA
// @description Play a sound if Ring Fit Adventure is in stock on TheSource. Script originally created by reddit user /u/Lawdie123 (https://www.reddit.com/r/RingFitAdventure/comments/g35n70/amazon_ukna_auto_alerter_faster_then_stock/)
// @version     1
// @include 	https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-games/ring-fit-adventure-for-nintendo-switch/p/108085230*
// @author      Dawdie (original) | IvyPug (CA modification)

// @downloadURL https://update.greasyfork.org/scripts/401514/TheSourceRingFitCA.user.js
// @updateURL https://update.greasyfork.org/scripts/401514/TheSourceRingFitCA.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-games/ring-fit-adventure-for-nintendo-switch/p/108085230

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/out of stock online/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}