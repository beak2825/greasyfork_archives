// ==UserScript==
// @name        EBGamesRingFitCA
// @namespace   EBGamesRingFitCA
// @description Play a sound if Ring Fit Adventure is in stock on EBGames. Script originally created by reddit user /u/Lawdie123 (https://www.reddit.com/r/RingFitAdventure/comments/g35n70/amazon_ukna_auto_alerter_faster_then_stock/)
// @version     1.1
// @include 	https://www.ebgames.ca/Platform/Games/773971*
// @author      Dawdie (original) | IvyPug (CA modification)

// @downloadURL https://update.greasyfork.org/scripts/401513/EBGamesRingFitCA.user.js
// @updateURL https://update.greasyfork.org/scripts/401513/EBGamesRingFitCA.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.ebgames.ca/Platform/Games/773971

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

var badreq = document.creatElement('audio');
badreq.src = 'https://notificationsounds.com/soundfiles/d490d7b4576290fa60eb31b5fc917ad1/file-sounds-1141-glitch-in-the-matrix.mp3';
badreq.preload = 'auto';

if (!(/Out of stock/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else if (/504 Gateway Time-out/i.test (document.body.innerHTML) ) {
  document.title = "TIME OUT";
  badreq.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}