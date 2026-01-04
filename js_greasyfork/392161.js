// ==UserScript==
// @name reCAPTCHA E FARM NO A
// @author superluyz
// @version 1.2 (SET/2019;)
// @grant Publico
// @description Script facilitador de saques para Tribal Wars.
// @include        http*://*.tribalwars.com.pt/*screen=am_farm*
// @namespace https://greasyfork.org/users/163899
// @downloadURL https://update.greasyfork.org/scripts/392161/reCAPTCHA%20E%20FARM%20NO%20A.user.js
// @updateURL https://update.greasyfork.org/scripts/392161/reCAPTCHA%20E%20FARM%20NO%20A.meta.js
// ==/UserScript==

var botProtect = $('body').data('bot-protect');
if (document.URL.indexOf('screen=am_farm') == -1)
	console.log('Você deve executar o script no assistente de farm!');
else if (botProtect !== undefined) {
	alert('Alerta Captcha!');
}
else {
	var x				= 1,				// NÃO ALTERAR!
		menu			= $('#am_widget_Farm a.farm_icon_a'),
		tempo			= "random",
		minhaVar		= "",				// NÃO ALTERAR!
		alteraraldeia   = true,
		altAldTempo		= true,				// Tempo em milesegundos para alternar as aldeias (Use 'true' para aleatório)
		atualizarPagina	= true,			// Atualizar a página automaticamente? ('true' = SIM, 'false' = NÃO)
        atlPagTempo     = "random",
		boxCaptcha		= $("#bot_check");	// NÃO ALTERAR!

	var aleatorio = function(superior, inferior) {
		var numPosibilidades	= superior - inferior,
			aleat				= Math.random() * numPosibilidades;

		return Math.round(parseInt(inferior) + aleat);
	};

	if (tempo === "random") {
		tempo = aleatorio(5000, 10000);
	}
    if (atlPagTempo === "random") {
		atlPagTempo = aleatorio(700000, 800000);
	}

	$('img').each(function() {
		var tempStr = $(this).attr('src');
		if (tempStr.indexOf('attack') != -1)
			$(this).addClass('tooltip');
	});

	if (atualizarPagina === true) {
		setInterval(function() {
			window.location.reload();
		}, atlPagTempo);
	}

	if (altAldTempo !== false) {
		if (altAldTempo === true)
            if($('#light').text() >= 5 && $('#spy').text() >= 1)
                altAldTempo = aleatorio(100000, 150000);
            else
                altAldTempo = aleatorio(3000, 5000);
		else
			altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(500, 1000));
		}
	}

		for (i = 0; i < 100; i++) {
				if(parseInt($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == 0 || isNaN($('#plunder_list tr:not(:first, :last)').eq(i + 1).find('td').eq(6).text()) == true){
                    $(menu).eq(i).each(function() {
						var tempoAgora = tempo * x;
						setTimeout(function(minhaVar) {
                            if($('#light').text() >= 5 && $('#spy').text() >= 1)
                                $(minhaVar).click();
						}, tempoAgora, this);
						++x;
			
				});
             }
        }


	if (alteraraldeia === true) {
		var altVillage = setInterval(function () {
			$('.arrowRight, .groupRight').click();

			clearInterval(altVillage);
		}, altAldTempo);
	}


	var checkCaptcha = setInterval(function() {
		if (boxCaptcha.length) {
			alert('Captcha bloqueado');
			clearInterval(checkCaptcha);
			clearInterval(altVillage);
		}
	}, 100);
