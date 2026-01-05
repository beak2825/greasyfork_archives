// ==UserScript==
// @name          Alert Total Youtube Playlist Time Amount
// @namespace     http://userstyles.org
// @description	  totalPlaylistTime
// @author        ceberous
// @homepage      https://creatitees.info
// @include       https://www.youtube.com/playlist?list=*
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/23174/Alert%20Total%20Youtube%20Playlist%20Time%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/23174/Alert%20Total%20Youtube%20Playlist%20Time%20Amount.meta.js
// ==/UserScript==

(function() {

	var r_Hours = 0;
	var r_Minutes = 0;
	var r_Seconds = 0;
	var t_Days = 0;
	var t_Hours = 0;
	var t_Minutes = 0;
	var t_Seconds = 0;

	var alertString = "\nTotal = ";

	$(document).ready( function() {
		
		$(".pl-video-time").each( function( ) {

			var x = $(this).children(":first").children(":first").text().split(":");

			if ( x.length === 3 ) { // hours , minutes , seconds
				r_Hours += parseInt(x[0]);
				r_Minutes += parseInt(x[1]);
				r_Seconds += parseInt(x[2]);
			}
			else if ( x.length === 2 ) { // minutes , seconds
				r_Minutes += parseInt(x[0]);
				r_Seconds += parseInt(x[1]);
			}

		});

		var x_PHours = Math.floor(r_Minutes / 60);
		var xy1 = r_Minutes - (60 * x_PHours);
		var x_PMinutes = Math.floor(r_Seconds / 60);
		var xy2 = r_Seconds - ( 60 * x_PMinutes );

		// Add in Divided Totals
		t_Hours 	= r_Hours + x_PHours; 
		t_Minutes 	= xy1 + x_PMinutes;
		t_Seconds 	= xy2;

		if ( t_Hours > 24 ) {
			t_Days = Math.floor( t_Hours / 24 );
			t_Hours = t_Hours - ( 24 * t_Days );
			alertString += "\n\t[days] = " + t_Days.toString();
		}
		alertString += "\n\t[hours] = " + t_Hours.toString();
		alertString += "\n\t[minutes] = " + t_Minutes.toString();
		alertString += "\n\t[seconds] = " + t_Seconds.toString();

		console.log(alertString);
		alert(alertString);

	});

})();




