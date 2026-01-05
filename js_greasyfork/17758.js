// ==UserScript==
// @name           Multiple Game Opener *OLD*
// @namespace      Kongregate
// @description    Opens all games in new tabs
// @include        http://*.kongregate.com/games*
// @include        http://kongregate.com/games*
// @include        http://*.kongregate.com/*games*
// @include        http://kongregate.com/*games*
// @include        http://*.kongregate.com/my_favorites*
// @include        http://kongregate.com/my_favorites*
// @include        http://*.kongregate.com/game_groups*
// @include        http://kongregate.com/game_groups*
// @version 0.0.1.20160422224725
// @downloadURL https://update.greasyfork.org/scripts/17758/Multiple%20Game%20Opener%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17758/Multiple%20Game%20Opener%20%2AOLD%2A.meta.js
// ==/UserScript==

var feat = document.getElementById( "feature" ).childNodes[1];
feat.style.textDecoration = "underline";
feat.style.cursor = "pointer";
feat.title = "Click to open these games in new tabs/windows.";
feat.addEventListener('click',function () {
  var games = document.getElementsByClassName("play_link");
	for( var link in games ) {
    if( link >= 0 )
    window.open( games[link].href, "Kong" + link );
  }
},false)