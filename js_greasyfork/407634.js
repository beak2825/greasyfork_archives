// ==UserScript==
// @name        PowerBlock Elite 2020 EXP
// @namespace   PowerBlock Elite 2020 EXP
// @description Play a sound if PowerBlock Elite 2020 EXP is in stock
// @version     1
// @include 	https://www.dickssportinggoods.com/p/powerblock-elite-2020-exp-adjustable-dumbbell-20pwkultxpdmbbll2dmb/20pwkultxpdmbbll2dmb
// @author      willhe

// @downloadURL https://update.greasyfork.org/scripts/407634/PowerBlock%20Elite%202020%20EXP.user.js
// @updateURL https://update.greasyfork.org/scripts/407634/PowerBlock%20Elite%202020%20EXP.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.amazon.com/Ring-Fit-Adventure-Nintendo-Switch/dp/B07XV4NHHN/
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if (!(/not available to ship/i.test (document.body.innerHTML)))
    {
      window.open("http://localhost:3005/")
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)