// ==UserScript==
// @name        ToysRUsRingFitCA
// @namespace   ToysRUsRingFitCA
// @description Play a sound if Ring Fit Adventure is in stock on ToysRUs. Script originally created by reddit user /u/Lawdie123 (https://www.reddit.com/r/RingFitAdventure/comments/g35n70/amazon_ukna_auto_alerter_faster_then_stock/)
// @version     1
// @include 	https://www.toysrus.ca/en/Ring-Fit-Adventure/34EF2972.html*
// @author      Dawdie (original) | IvyPug (CA modification)

// @downloadURL https://update.greasyfork.org/scripts/401515/ToysRUsRingFitCA.user.js
// @updateURL https://update.greasyfork.org/scripts/401515/ToysRUsRingFitCA.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.toysrus.ca/en/Ring-Fit-Adventure/34EF2972.html

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

if (!(/Out of stock/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}