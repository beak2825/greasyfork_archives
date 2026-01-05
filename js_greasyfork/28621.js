// ==UserScript==
// @name           Virtonomica: политика
// @version        1.02
// @namespace      Virtonomica
// @author         Agor71
// @description    Муахаха
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/28621/Virtonomica%3A%20%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/28621/Virtonomica%3A%20%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0.meta.js
// ==/UserScript==

var run = function() {
	//Считываем тип предприятия
	$( document ).ready(function() {
		var img = $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);
    
		//Запускаем только в виллах
		if (img == 'villa') {
			
			var pol = $('<button>').append('Politics').click( function() {
			
			$('div#artf_content').html(`
			<div><table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$5 000 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368601,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$1 000 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368600,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$450 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368599,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$200 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368598,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$70 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368597,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$12 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368596,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			<table class="artf_priser"><tbody><tr><td class="apprise">$0</td><td class="apdop_prise"><nobr>$1 000 000</nobr></td><td class="aptitle">Политическая агитация</td><td class="aplife">10 недель</td></tr></tbody></table><table class="apdesc"><tbody><tr><td class="artf_icon"><img src="/pub/artefact/anna/agitation_1.gif" id="pic_368595"></td><td>Политическая агитация</td><td class="artf_but"><nobr><a href="#" onclick="attachArtefact(368595,368592,'%u041F%u043E%u043B%u0438%u0442%u0438%u0447%u0435%u0441%u043A%u0430%u044F%20%u0430%u0433%u0438%u0442%u0430%u0446%u0438%u044F')"><img src="/img/artefact/artf_green.gif"></a></nobr></td></tr></tbody></table><br>
			</div>
			`);
			});
			$(".artf_slots").after(pol);
		};
	});
};	
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);