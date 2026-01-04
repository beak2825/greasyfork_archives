// ==UserScript==
// @name          Twitch Re Enable Save Clip
// @namespace     http://userstyles.org
// @description   Re Enables Right Click Save As
// @author        636597
// @include       *://clips.twitch.tv/*
// @include       *://*twitch.tv/*/clip/*
// @run-at        document-start
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/371927/Twitch%20Re%20Enable%20Save%20Clip.user.js
// @updateURL https://update.greasyfork.org/scripts/371927/Twitch%20Re%20Enable%20Save%20Clip.meta.js
// ==/UserScript==


(function() {
	console.log( "Twitch Renable Save Clip Loaded" );
	var ready = setInterval(function(){
		var player_element = document.getElementsByClassName( "player-overlay" );
		if ( player_element ) {
			player_element = player_element[0];
			//clearInterval( ready );
			player_element.style.display = "none";
		}
	} , 500 );
	setTimeout( function() { clearInterval( ready ); } , 10000 );
})();