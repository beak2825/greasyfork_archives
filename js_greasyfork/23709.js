// ==UserScript==
// @name           Victory: регулировка сферы услуг
// @version        1.05
// @namespace      Victory
// @description    Регулирование цены в сфере услуг
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/23709/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D1%84%D0%B5%D1%80%D1%8B%20%D1%83%D1%81%D0%BB%D1%83%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/23709/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D1%84%D0%B5%D1%80%D1%8B%20%D1%83%D1%81%D0%BB%D1%83%D0%B3.meta.js
// ==/UserScript==

var run = function() {
	//Запускать только на тех страницах, которые являются предприятиями сферы услуг
		//Задаём необходимую реализацию наборов
		var spec = $("td.title:contains('Специализация')").next().text();
			switch(spec)
			{
				case('Чайная'):
					valueHyp = 20000;
					break;
				case('Авторемонтная мастерская'):
					valueHyp = 10000;
					break;
				case('Кузовные работы'):
					valueHyp = 5000;
					break;
				case('Салон автосигнализаций'):
					valueHyp = 25000;
					break;
				case('Косметологический центр'):
					valueHyp = 6000;
					break;
				case('Кафе-кондитерская'):
					valueHyp = 20000;
					break;	
				case('Шиномонтаж'):
					valueHyp = 8000;
					break;
				case('Станция сезонного ремонта'):
					valueHyp = 2000;
					break;
				case('Ресторан мексиканской кухни'):
					valueHyp = 15000;
					break;
			}
		
		//Считываем фактические продажи наборов
		var valueFact;
		$("td:contains('Количество посетителей')").next().each(function() {
			var str = this.innerHTML;
			
			var per = str.match(/\d[.\s\d]*(?=)/g);
			per = [per[0].replace(/[^\d\.]/g,''), per[1].replace(/[^\d\.]/g,'')];
			valueFact = per[0];
		});
		
		//Считываем цену
		var priceFact = parseInt( $("td:contains('Цена (на момент пересчёта)')").next().text().replace(/[^\d\.]/g,'').replace(' ','').replace(' ','').replace(' ','') );
		
		//Если фактически меньше гипотетического, то кнопка понижения цены, иначе повышения
		var btn = $('<button>Регулировать</button>').click(function() {
			var priceHyp;
			if (valueFact <= 0.25 * valueHyp) priceHyp = 0.3 * priceFact;
			if (valueFact <= 0.5 * valueHyp && valueFact > 0.25 * valueHyp) priceHyp = 0.60 * priceFact;
			if (valueFact > 0.5 * valueHyp && valueFact <= 0.75 * valueHyp) priceHyp = 0.75 * priceFact;
			if (valueFact > 0.75 * valueHyp && valueFact <= 0.85 * valueHyp) priceHyp = 0.87 * priceFact;
			if (valueFact > 0.85 * valueHyp && valueFact <= 0.9 * valueHyp) priceHyp = 0.94 * priceFact;
			if (valueFact > 0.9 * valueHyp && valueFact < valueHyp) priceHyp = 0.96 * priceFact;
			if (valueFact < 1.07 * valueHyp && valueFact >= valueHyp) priceHyp = 1.04 * priceFact;
			if (valueFact < 1.25 * valueHyp && valueFact >= 1.07 * valueHyp) priceHyp = 1.10 * priceFact;
			if (valueFact < 1.5 * valueHyp && valueFact >= 1.25 * valueHyp) priceHyp = 1.22 * priceFact;
			if (valueFact >= 1.5 * valueHyp) priceHyp = 1.32 * priceFact;
			$("input[name*='servicePrice']").val(priceHyp.toFixed(0));
			return false;
			});
		$("input[name*='servicePrice']").after(btn);
};	
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);