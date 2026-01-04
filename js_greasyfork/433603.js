// ==UserScript==
// @name         DC_Neuvopack_Alert_Premium
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  Emit a sound when your neuvopack is full
// @author       Nasty
// @match        https://www.dreadcast.net/Main
// @license      CC-BY-NC-ND - https://creativecommons.org/licenses/by-nc-nd/2.0/fr/
// 1.1 : Ajout du visuel rapide du niveau d'énergie
// 1.2 : Correctifs + sécurité supplémentaire de la DB
// 1.3 : Correctif d'un bug introduit par la version précédente.
// 1.4 : Ajout du support de plusieurs neuvo + changement de license.
// 1.4.2 : Fix de la valeur "presque remplie"
// 1.4.3 : Fix d'un bug concernant l'activation du module sur les neuvopacks des autres
// 1.4.4 : Fix d'un bug concernant les alertes qui ne jouaient plus
// 1.4.5 : Réduction du poids des sons + nouvelle façon de load (Merci JD Skeelu!)
// @downloadURL https://update.greasyfork.org/scripts/433603/DC_Neuvopack_Alert_Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/433603/DC_Neuvopack_Alert_Premium.meta.js
// ==/UserScript==


var proprioId = new Array();
var proprioNom = new Array();
var alert = 'none'

for (var i = 10; i <= 13; i++)
$("#ingame").append('<div id="last_alert'+i+'"></div>');
$("#last_alert" + i).css("display", "none").text("none");


function loadArray(url, callbackNumber) {
	$.ajax({
		type: 'GET',
		url: "https://docs.google.com/uc?export=download&id=" + url,
		async: true,
		jsonpCallback: 'jsonCallbackNeuvo' + callbackNumber,
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json) {
			for (var i = 0; i < json.personnage.length; i++) {
				proprioId[json.personnage[i][0]] = json.personnage[i][1];
				if (json.personnage[i].length >= 3)
					proprioNom[(json.personnage[i][2]).toLowerCase()] = json.personnage[i][1];
			}


			var pseudo = $("#txt_pseudo").text().toLowerCase();
			if (proprioNom[pseudo]) {
				$('body').append('<audio id="DC_Neuvopack_Full_Alert" src="https://bacon-network.net/dreadcast/neuvopack_full.mp3" preload auto type="audio/mp3"></audio><audio id="DC_Neuvopack_AlmostFull_Alert" src="https://bacon-network.net/dreadcast/neuvopack_almost_full.mp3" preload auto  type="audio/mp3"></audio>');
				$("#DC_Neuvopack_Full_Alert").prop('volume', '1');
				$("#DC_Neuvopack_AlmostFull_Alert").prop('volume', '1');
			}
			if (json.liens)
				for (var i = 0; i < json.liens.length; i++)
					loadArray(json.liens[i], callbackNumber + "_" + (i + 1));
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}

$(document).ready(function() {
	function neuvo_alert(zone_case) {
		var howMuchCristals = $("#zone_gauche_inventaire > #zone_inventaire > #annexe_inventaire_ext > .content >.zone_case" + zone_case + ' [class*="contenance_appareil"]').text();
		var howMuchCristalsNb = Number(howMuchCristals);
		var howMuchCristalsArray = new Array();
		var neuvopackIsFull = 2000;
		var neuvopackIsAlmostFull = 1500;
		var neuvopack_filling;
        var last_alert_value = $("#last_alert"+zone_case).text();

		if (neuvopackIsFull == howMuchCristalsNb) {
			neuvopack_filling = 'full';
			showCristals(zone_case);
			color_my_neuvopack('red', zone_case);
		} else if (neuvopackIsAlmostFull <= howMuchCristalsNb) {
			neuvopack_filling = 'high'
			showCristals(zone_case);
			color_my_neuvopack('yellow', zone_case);
		} else {
			color_my_neuvopack('none', zone_case);
			showCristals(zone_case);
			neuvopack_filling = 'none'
		}
		var neuvopackContent = howMuchCristalsNb;

		if (-1 == $.inArray(neuvopackContent, Object.keys(howMuchCristalsArray))) {
			howMuchCristalsArray[neuvopackContent] = {
				previous_howMuchCristalsNb: -1,
				alert: neuvopack_filling
			};
		}
		if (howMuchCristalsNb != howMuchCristalsArray[neuvopackContent].previous_howMuchCristalsNb) {
			howMuchCristalsArray[neuvopackContent].alert = neuvopack_filling;

			howMuchCristalsArray[neuvopackContent].previous_howMuchCristalsNb = howMuchCristalsNb;
		}


		for (var key in howMuchCristalsArray) {
			if ('full' != alert) {
				if ('full' == howMuchCristalsArray[key].alert)
					alert = 'full';
				if ('high' == howMuchCristalsArray[key].alert)
					alert = 'high';
				else {
					$("#last_alert"+zone_case).text("none");
				}
			}

			howMuchCristalsArray[key].alert = 'none';
		}

		if ('none' == alert)
			return;

		var neuvoalertsong = ('full' == alert) ? neuvoalertsong = $('#DC_Neuvopack_Full_Alert')[0] :
			neuvoalertsong = $('#DC_Neuvopack_AlmostFull_Alert')[0];

		neuvoalertsong.loop = false;

		if (last_alert_value == 'none' && neuvopack_filling == 'high') {
            neuvoalertsong.load();
			neuvoalertsong.play();
			$("#last_alert"+zone_case).text("high");
		}
		if (last_alert_value == 'none' && neuvopack_filling == 'full') {
            neuvoalertsong.load();
			neuvoalertsong.play();
			$("#last_alert"+zone_case).text("full");
		}
		if (last_alert_value == 'high' && neuvopack_filling == 'full') {
            neuvoalertsong.load();
			neuvoalertsong.play();
			$("#last_alert"+zone_case).text("full");

		}
		if (last_alert_value == 'high' && neuvopack_filling == 'high') {
			return;
		}
		if (last_alert_value == 'full' && neuvopack_filling == 'full') {
			return;
		}
		if ($("#last_alert"+zone_case).text() == 'full' && neuvopack_filling == 'none') {
			$("#last_alert"+zone_case).text("none");
		} else {
			return;
		}

	}

	function showCristals(zone_case) {
		var idOjb = $("#zone_gauche_inventaire > #zone_inventaire > #annexe_inventaire_ext > .content >.zone_case" + zone_case).find(".objet_type_Neuvopack").parent().attr('id');
		var quantite = $("#" + idOjb + ' [class*="contenance_appareil"]').text();
		$("#" + idOjb + " .quantite").text("x" + quantite + " CF").removeClass("hidden");
	}


	function color_my_neuvopack(color, zone_case) {
		var rgba = 'rgba(0,0,0,0)';
		if ('red' == color)
			rgba = 'rgba(255,0,0,0.5)';
		if ('yellow' == color)
			rgba = 'rgba(255,125,0,0.5)';

		$("#zone_gauche_inventaire > #zone_inventaire > #annexe_inventaire_ext > .content >.zone_case" + zone_case + ' [class*="objet_type_Neuvopack"]').css({
			'backgroundColor': rgba
		});
	}

	loadArray("1OmBJfaU_lIosSta0d9bLu8ujbM8vSFRY", 0);


	function am_i_premium() {
		if ($("#DC_Neuvopack_Full_Alert").length == 0) {
			return;
		} else {
			for (var i = 10; i <= 13; i++)
				neuvo_alert(i);
		}
	}

	$(document).ajaxComplete(function(a, b, c) {
		if (/Check/.test(c.url)) {
			am_i_premium();
		}
	})

});
console.log("Neuvopack++ - Started");