// ==UserScript==
// @name                Long Race Replay
// @namespace	        http://hajnrych.pl
// @description	        Extending refresh time for Race Replay History to add some extra hours in account statistics
// @include				http://gpro.net/*/RaceReplayHistory.asp*
// @include				http://www.gpro.net/*/RaceReplayHistory.asp*
// @require 			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version				0.07	
// @downloadURL https://update.greasyfork.org/scripts/22695/Long%20Race%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/22695/Long%20Race%20Replay.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

jq(document).ready(function(){

	var secToNext = jq('#secToNextLap').html();

	var addMoreSec = "<option value='540' selected=''>540&nbsp;sec</option>";

	secToNext += addMoreSec;

	jq("#secToNextLap").html(secToNext);

});
