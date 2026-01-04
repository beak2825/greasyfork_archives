// ==UserScript==
// @name        REP AB-3100
// @namespace   REP AB-3100
// @description Play a sound if REP AB-3100 is in stock
// @version     1
// @include 	https://www.repfitness.com/rep-ab-3100-fi-bench
// @author      willhe

// @downloadURL https://update.greasyfork.org/scripts/407620/REP%20AB-3100.user.js
// @updateURL https://update.greasyfork.org/scripts/407620/REP%20AB-3100.meta.js
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