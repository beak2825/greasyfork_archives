// ==UserScript==
// @name     Auto Farm For Speed - Send only and always C
// @description Farms automatically with loot assistant
// @version 1.1.3
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @include https://*/game.php?village=*&screen=am_farm*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/33756/Auto%20Farm%20For%20Speed%20-%20Send%20only%20and%20always%20C.user.js
// @updateURL https://update.greasyfork.org/scripts/33756/Auto%20Farm%20For%20Speed%20-%20Send%20only%20and%20always%20C.meta.js
// ==/UserScript==

// Captcha regognition
setInterval(function() {
    if(document.getElementsByClassName("rc-anchor-center-item").length > 0) {
		document.getElementsByClassName("rc-anchor-center-item")[0].click();
	} else{}
}, 10);

// Set maximum farm distance
window.maxDistance = 20; // Change this value to set maximum farm distance for A

var atualizarPagina = 1; // No idea what this is
var tempo = 300;
var x = 0;
var minhaVar = "";
var remove_atacadas = 0;
var menu = $('#am_widget_Farm a.farm_icon_c');
var altAldTempo = 1;
var jaEnviados = $(menu).parent().parent().find('img.tooltip').length + "000";
if (remove_atacadas == 1) {
	$('img').each(function() {
		var tempStr = $(this).attr('src');
		if (tempStr.indexOf('attack') != -1) {
			$(this).addClass('tooltip')
		}
	});
}
if (atualizarPagina == 1) {
	setInterval(function() {
		window.location.reload();
	}, 1500);
}
console.log("Ja existe " + jaEnviados.substring(0, (jaEnviados.length - 3)) + " aldeia com ataque.");
if (altAldTempo == "1") {
	var altAldTempo = aleatorio(2000, 4000);
} else {
	var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(82353, 35356));
}
console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");

function aleatorio(superior, inferior) {
	numPosibilidades = superior - inferior
	aleat = Math.random() * numPosibilidades
	return Math.round(parseInt(inferior) + aleat)
}

var distance = 0;
for (i = 0; i < 1000; i++) {
	distance = $("#plunder_list").children().children().eq(2 + i).children().eq(7).text();
	var distanceInt = parseInt(distance);
	if (distanceInt <= window.maxDistance) {
		$(menu).eq(i).each(function() {
			if (!($(this).parent().parent().find('img.tooltip').length)) {
				var tempoAgora = (tempo * ++x) - aleatorio(250, 400);
				setTimeout(function(minhaVar) {
					$(minhaVar).click();
				}, tempoAgora, this);
			}
		})
	}
}

function altAldeia() {
	$('.arrowRight').click();
	$('.groupRight').click();
}
setInterval(altAldeia, altAldTempo);
console.log("Changed by FunnyPocketBook");// JavaScript Document