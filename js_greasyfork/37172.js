// ==UserScript==
// @name reCAPTCHA E FARM NO A
// @author Reformed
// @email ...
// @namespace ...
// @version 1.0 (JAN/2018;)
// @grant Publico
// @description AutoFarm para Tribal Wars, com alerta sonoro para captcha.
// @include       https://*screen=am_farm*
// @downloadURL https://update.greasyfork.org/scripts/37172/reCAPTCHA%20E%20FARM%20NO%20A.user.js
// @updateURL https://update.greasyfork.org/scripts/37172/reCAPTCHA%20E%20FARM%20NO%20A.meta.js
// ==/UserScript==

var botProtect = $('body').data('bot-protect');
if (document.URL.indexOf('screen=am_farm') == -1)
	console.log('Você deve executar o script no assistente de farm!');
else if (botProtect !== undefined) {
	alert('Alerta Captcha!');
	$("<audio id='audio' autoplay><source src='http://protettordelinks.com/wp-content/baixar/bomba_relogio_alerta_www.toquesengracadosmp3.com.mp3' type='audio/mp3' /></audio>").appendTo("body");
} else if (game_data.player.farm_manager !== true)
	alert('Você não tem Assistente de Saque!');
else {
	var x				= 1,				// NÃO ALTERAR!
		menu			= $('#am_widget_Farm a.farm_icon_a'),
		tempo			= true,				// Tempo em milesegundos
		minhaVar		= "",				// NÃO ALTERAR!
		altAldTempo		= true,				// Tempo em milesegundos para alternar as aldeias (Use 'true' para aleatório)
		atualizarPagina	= false,			// Atualizar a página automaticamente? ('true' = SIM, 'false' = NÃO)
		boxCaptcha		= $("#bot_check");	// NÃO ALTERAR!

	var aleatorio = function(superior, inferior) {
		var numPosibilidades	= superior - inferior,
			aleat				= Math.random() * numPosibilidades;

		return Math.round(parseInt(inferior) + aleat);
	};

	$('img').each(function() {
		var tempStr = $(this).attr('src');
		if (tempStr.indexOf('attack') != -1)
			$(this).addClass('tooltip');
	});

	if (atualizarPagina === true) {
		setInterval(function() {
			window.location.reload();
		}, 60000);
	}

	if (tempo === true)
		tempo = aleatorio(5000, 10000);
    else
		tempo = parseInt(tempo) + parseInt(aleatorio(500, 1000));

	if (altAldTempo === true)
		altAldTempo = aleatorio(25000, 50000);
	else
		altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(500, 1000));

	for (i = 0; i < 50; i++) {
		$(menu).eq(i).each(function() {
			if (!($(this).parent().parent().find('img.tooltip').length)) {
				var tempoAgora = tempo * x;
				setTimeout(function(minhaVar) {
					$(minhaVar).click();
				}, tempoAgora, this);

				++x;
			}
		});
	}

	var altVillage = setInterval(function () {
		$('.arrowRight, .groupRight').click();

		clearInterval(altVillage);
	}, altAldTempo);

	var checkCaptcha = setInterval(function() {
		if (boxCaptcha.length) {
			$("<audio id='audio' autoplay><source src='http://protettordelinks.com/wp-content/baixar/bomba_relogio_alerta_www.toquesengracadosmp3.com.mp3' type='audio/mp3' /></audio>").appendTo("body");
			alert('Alerta Captcha!');

			clearInterval(checkCaptcha);
			clearInterval(altVillage);
		}
	}, 100);
}