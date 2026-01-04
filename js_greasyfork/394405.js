// ==UserScript==
// @name         DC_Safe_zone
// @author       Ladoria, N2CV
// @version		 1.4
// @namespace    DC_custom
// @description  Calque d'un quadrillage de forme sonar permettant d'estimer facilement la distance en ST et dans la mine.
// @description  Basé sur le script de Ladoria et adapté par N2CV. [Script vu et analysé par Alpha le 090518]
// @include https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394405/DC_Safe_zone.user.js
// @updateURL https://update.greasyfork.org/scripts/394405/DC_Safe_zone.meta.js
// ==/UserScript==

$(document).ready( function() {
	$('body').append('<style>#dc_safe_zone {display: none;background: url(https://i.imgur.com/x0yq23Y.png) no-repeat;height: 500px;width: 500px;margin: 3px 0 0 3px;top: -238px;left: -238px;}#dc_cadre_position {background: ' + $('#cadre_position').css('background-image') + ' no-repeat;width: 31px;height: 31px;position: absolute;top: 0px;}#zone_page #zone_carte #carte #cadre_position {background-image: none !important;}</style>'); // CSS de la zone.
	$('#cadre_position').append('<div id="dc_safe_zone"></div><div id="dc_cadre_position"></div>'); // HTML du viseur.
});

function display_safezone() {
	if (false !== /SOUTERRAIN/gi.test($('#lieu_actuel .titre1').html())) { // Si souterrain
		$('#dc_safe_zone').show(); // Afficher
		return; // Retour à la fonction appelante pour retester la condition
	}

    if (false !== /AILLEURS/gi.test($('#lieu_actuel .titre1').html())) { // Si mine
		$('#dc_safe_zone').show(); // Afficher
		return; // Retour à la fonction appelante pour retester la condition
	}

	if(1 === $('#combat_barre_out').length) { // Si combat
		$('#dc_safe_zone').hide(); // Cacher
		return; // Retour à la fonction appelante pour retester la condition
	}

	$('#dc_safe_zone').hide(); // Sinon, cacher la zone.
}

$(document).ajaxComplete( function(a,b,c) { // A chaque refresh même invisible
	if(/Check/.test(c.url)) { // Durant certains refresh
		display_safezone();
	}
});

console.log('DC - Save Zone started');