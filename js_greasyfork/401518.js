// ==UserScript==
// @name        BestBuyRingFitCA
// @namespace   BestBuyRingFitCA
// @description Play a sound if Ring Fit Adventure is in stock on BestBuy. Script originally created by reddit user /u/Lawdie123 (https://www.reddit.com/r/RingFitAdventure/comments/g35n70/amazon_ukna_auto_alerter_faster_then_stock/)
// @version     1.2
// @include 	https://www.bestbuy.ca/en-ca/product/ring-fit-adventure-switch/13961770*
// @author      Dawdie (original) | IvyPug (CA modification)

// @downloadURL https://update.greasyfork.org/scripts/401518/BestBuyRingFitCA.user.js
// @updateURL https://update.greasyfork.org/scripts/401518/BestBuyRingFitCA.meta.js
// ==/UserScript==

//LOAD & LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.ca/en-ca/product/ring-fit-adventure-switch/13961770

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

//if (!(/Page not found/i.test (document.body.innerHTML) ) &&  !(/Page introuvable/i.test (document.body.innerHTML) ))
if (!(/Sold out online/i.test (document.body.innerHTML) ))
{
  document.title = "MATCH";
  player.play();
  window.open('https://www.youtube.com/watch?v=wqd81s0vrAQ', '_blank');
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}