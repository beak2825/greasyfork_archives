// ==UserScript==
// @name        Gamestop2k20
// @namespace   Gamestop2k20
// @description  2k20 checks stock
// @version     1
// @include 		https://www.gamestop.com/video-games/playstation-4/games/products/nba-2k20/11094999.html
// @author      Dawdie

// @downloadURL https://update.greasyfork.org/scripts/401869/Gamestop2k20.user.js
// @updateURL https://update.greasyfork.org/scripts/401869/Gamestop2k20.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.gamestop.com/video-games/playstation-4/games/products/nba-2k20/11094999.html
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';

  setTimeout(function(){
    if ((/availability-in-stock"/.test (document.body.innerHTML)) )
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 15*1000);
    }
  }, 5*1000)
  