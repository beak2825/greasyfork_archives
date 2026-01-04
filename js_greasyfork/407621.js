// ==UserScript==
// @name        AB-3000 FID Adjustable Bench
// @namespace   AB-3000 FID Adjustable Bench
// @description Play a sound if AB-3000 FID Adjustable Bench is in stock
// @version     1
// @include 	https://www.repfitness.com/strength-equipment/strength-training/benches/rep-ab3000-fid-adj-bench
// @author      willhe

// @downloadURL https://update.greasyfork.org/scripts/407621/AB-3000%20FID%20Adjustable%20Bench.user.js
// @updateURL https://update.greasyfork.org/scripts/407621/AB-3000%20FID%20Adjustable%20Bench.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.amazon.com/Ring-Fit-Adventure-Nintendo-Switch/dp/B07XV4NHHN/
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if (!(/Out of stock/i.test (document.body.innerHTML)))
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)