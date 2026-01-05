// ==UserScript==
// @name         DC_safe_zone
// @author       Ladoria
// @version		 0.2
// @namespace    DC_custom
// @description  Try to take over the world!
// @match        http://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24848/DC_safe_zone.user.js
// @updateURL https://update.greasyfork.org/scripts/24848/DC_safe_zone.meta.js
// ==/UserScript==

$(document).ready( function() {
	$('body').append('<style>#dc_safe_zone {display: none;background: url(http://img4.hostingpics.net/pics/703237distancerats.png) no-repeat;height: 225px;width: 225px;margin: 3px 0 0 3px;top: -100px;left: -100px;}#dc_cadre_position {background: ' + $('#cadre_position').css('background-image') + ' no-repeat;width: 31px;height: 31px;position: absolute;top: 0px;}#zone_page #zone_carte #carte #cadre_position {background-image: none !important;}</style>'); // CSS de la zone.
	$('#cadre_position').append('<div id="dc_safe_zone"></div><div id="dc_cadre_position"></div>'); // HTML de la zone.
});

function display_safezone() {
	if (true !== /SOUTERRAIN/gi.test($('#lieu_actuel .titre1').html())) { // Pas de souseterrain ? Quitter.
		return;
	}
	
	if(0 === $('#combat_barre_out').length) { // Pas de combat ? Cacher la zone, quitter.
		$('#dc_safe_zone').hide();
		return;
	}
	
	$('#dc_safe_zone').show(); // Sinon, afficher la zone.
}

$(document).ajaxComplete( function(a,b,c) { // A chaque refresh même invisible
	if(/Check/.test(c.url)) { // Durant certains refresh
		display_safezone();
	}
});

console.log('DC - Save Zone started');