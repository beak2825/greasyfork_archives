// ==UserScript==
// @name         DC_Neuvopack_Alert_Debug
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Emit a sound when your neuvopack is full
// @author       Nasty
// @match        https://www.dreadcast.net/Main
// @license      CC-BY-NC-ND - https://creativecommons.org/licenses/by-nc-nd/2.0/fr/
// VERSION DE DEBUG
// @downloadURL https://update.greasyfork.org/scripts/438221/DC_Neuvopack_Alert_Debug.user.js
// @updateURL https://update.greasyfork.org/scripts/438221/DC_Neuvopack_Alert_Debug.meta.js
// ==/UserScript==

var proprioId = new Array();
var proprioNom = new Array();
var alert = 'none'
console.log("Basic arrays created");


for (var i = 10; i <= 13; i++)
$("#ingame").append('<div id="last_alert'+i+'"></div>');
$("#last_alert" + i).css("display", "none").text("none");
console.log("Basic div created");



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
				$('body').append('<audio id="DC_Neuvopack_Full_Alert" src="https://bacon-network.net/dreadcast/neuvopack_full.wav" type="audio/waw"></audio><audio id="DC_Neuvopack_AlmostFull_Alert" src="https://bacon-network.net/dreadcast/neuvopack_almost_full.wav" type="audio/waw"></audio>');
				$("#DC_Neuvopack_Full_Alert").prop('volume', '1');
				$("#DC_Neuvopack_AlmostFull_Alert").prop('volume', '1');
				console.log("Alerting div created");
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
		console.log("Last_alert_value="+last_alert_value);

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
			console.log("Alerts Array's created");
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
			console.log("Alert none to high");
		}
		if (last_alert_value == 'none' && neuvopack_filling == 'full') {
            neuvoalertsong.load();
			neuvoalertsong.play();
			$("#last_alert"+zone_case).text("full");
			console.log("Alert none to Full");
		}
		if (last_alert_value == 'high' && neuvopack_filling == 'full') {
            neuvoalertsong.load();
			neuvoalertsong.play();
			$("#last_alert"+zone_case).text("full");
			console.log("Alert high to full");

		}
		if (last_alert_value == 'high' && neuvopack_filling == 'high') {
			console.log("No alert high to high");
			return;
		}
		if (last_alert_value == 'full' && neuvopack_filling == 'full') {
			console.log("No alert full to full");
			return;
		}
		if ($("#last_alert"+zone_case).text() == 'full' && neuvopack_filling == 'none') {
			$("#last_alert"+zone_case).text("none");
			console.log("Neuvopack emptied");
		} else {
			return;
		}

	}

	function showCristals(zone_case) {
		var idOjb = $("#zone_gauche_inventaire > #zone_inventaire > #annexe_inventaire_ext > .content >.zone_case" + zone_case).find(".objet_type_Neuvopack").parent().attr('id');
		var quantite = $("#" + idOjb + ' [class*="contenance_appareil"]').text();
		$("#" + idOjb + " .quantite").text("x" + quantite + " CF").removeClass("hidden");
		console.log("Quantity is :"+quantite+" on neuvopack number "+idOjb);
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
		console.log("Color is :"+color);
	}

	loadArray("1OmBJfaU_lIosSta0d9bLu8ujbM8vSFRY", 0);


	function am_i_premium() {
		if ($("#DC_Neuvopack_Full_Alert").length == 0) {
			console.log("Is NOT Premium");
			return;
		} else {
			for (var i = 10; i <= 13; i++)
				neuvo_alert(i);
				console.log("Is Premium");
		}
	}

	$(document).ajaxComplete(function(a, b, c) {
		if (/Check/.test(c.url)) {
			am_i_premium();
		}
	})

});
console.log("Neuvopack++ - Started");