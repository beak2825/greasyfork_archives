// ==UserScript==
// @name        Amazon US Ring Fit
// @namespace   Amazon US Ring Fit
// @description Play a sound if Amazon US Ring Fit is in stock
// @version     1
// @include 	https://www.amazon.com/Ring-Fit-Adventure-Nintendo-Switch/dp/B07XV4NHHN/
// @author      willhe

// @downloadURL https://update.greasyfork.org/scripts/401906/Amazon%20US%20Ring%20Fit.user.js
// @updateURL https://update.greasyfork.org/scripts/401906/Amazon%20US%20Ring%20Fit.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.amazon.com/Ring-Fit-Adventure-Nintendo-Switch/dp/B07XV4NHHN/
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if (/Add to Cart/i.test (document.body.innerHTML))
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)