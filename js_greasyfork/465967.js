// ==UserScript==
// @name           GLB Cut CPU Players - Rc26 fix
// @namespace      GLB
// @description    Cuts CPU players to the minimum
// @author	       DDCUnderground
// @match          https://glb.warriorgeneral.com/game/roster.pl?team_id=*
// @require        https://greasyfork.org/scripts/12092-jquery-javascript-library-v1-4-2/code/jQuery%20JavaScript%20Library%20v142.js?version=71384
// @version	       23.05.10-RyanCane26
// @downloadURL https://update.greasyfork.org/scripts/465967/GLB%20Cut%20CPU%20Players%20-%20Rc26%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/465967/GLB%20Cut%20CPU%20Players%20-%20Rc26%20fix.meta.js
// ==/UserScript==
//

$(document).ready(function(){

	// functions
	var buildobj = function(a){
		var newobj = document.createElement(arguments[0]);
		for (var varval = 1; varval < arguments.length; varval++) {
			newobj.setAttribute(arguments[varval],arguments[varval+1]);
			varval++;
		};
		return newobj;
	};



	function cutAllCPUS(){
		$('#ddccutcpus').attr('value','Working');
		$('#ddccutcpus').attr("disabled", "true");

		$('tr[class="alternating_color1"],tr[class="alternating_color2"]').each(function(z){
			//if (z<2) {
				if ($('span[class="cpu"]',$(this)).length > 0) {
					var playerid  = $('a[href*="/game/player.pl?player_id="]',$(this)).attr('href');
					playerid = playerid.substring(playerid.indexOf('player_id=')+10,playerid.length);
					var upgradeData = 'action=Confirm Release&&player_id=' + playerid;
					$.ajax({
						 async: false,
						 type: 'POST',
						 url: "/game/cut_player.pl?player_id="+playerid,
						 data: encodeURI(upgradeData),
						 success: function(returned_data) {
						}
					})
				}
			//}
		})
		window.location.reload();

	}

	var cutcpusbut = buildobj('input','type','button','id','ddccutcpus','Value','Cut CPUs');
	var linebreak = buildobj('br');
	$('.medium_head:first').append(linebreak);
	$('.medium_head:first').append(cutcpusbut);
	$('#ddccutcpus').bind('click',cutAllCPUS, false);

})
