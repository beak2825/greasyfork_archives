// Fights Burned
//
// ==UserScript==
// @name          Fights Burned
// @description   Find out how many fights you've burned!
// @include       *127.0.0.1:*peevpee.php?place=logs*
// @include       *kingdomofloathing.com*peevpee.php?place=logs*
// @include       *localhost*peevpee.php?place=logs*
// @version 0.1
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/5223/Fights%20Burned.user.js
// @updateURL https://update.greasyfork.org/scripts/5223/Fights%20Burned.meta.js
// ==/UserScript==


$(document).ready(function() {
	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
		return function( elem ) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});
	
	$('b:contains("My Records")').parent().append('<div style="position: absolute; padding: 5px; margin-top: -24px; border: solid 1px black; background: blue;"><input style="border: solix 1px black;padding: 3px 2px; color: black;" type="text" name="fightswasted" id="fightswasted" /><br /><span id="calculatefights" style="cursor: pointer; color: white;">Count Burned Fites</span></div>');
	
	$('#calculatefights').click(function(){
		fightsname = $('#fightswasted').val();
		fightcount = $('table.small td:contains('+fightsname+'):nth-child(2)').length;
		alert(fightcount);
	});
});