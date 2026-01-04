// ==UserScript==
// @name           Victory: бросок Кобры
// @version        1.01
// @namespace      Victory
// @description    Бросок Кобры
// @include        http*://*virtonomic*.*/*/main/tender/*
// @downloadURL https://update.greasyfork.org/scripts/33549/Victory%3A%20%D0%B1%D1%80%D0%BE%D1%81%D0%BE%D0%BA%20%D0%9A%D0%BE%D0%B1%D1%80%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/33549/Victory%3A%20%D0%B1%D1%80%D0%BE%D1%81%D0%BE%D0%BA%20%D0%9A%D0%BE%D0%B1%D1%80%D1%8B.meta.js
// ==/UserScript==

var run = function() {
	if ($('span:contains("Диктатура еды")').length || $('span:contains("Вакцинация")').length || $('span:contains("Тачки на прокачку")').length || $('span:contains("Цветы жизни")').length) {
		var But = document.createElement('li');
		var spec = $('#mainContent > div:nth-child(5) > a')['0'].href.match(/\d+/g)['0'];
		var country = $('#mainContent > div:nth-child(5) > a')['0'].href.match(/\d+/g)['1'];
		var specID = $('#mainContent > div:nth-child(5) > a')['0'].innerText;
			switch(specID)
				{
					case'Центр иммунологии':
					case'Салон автосигнализаций':
					case'Ясли':
					case'ЭКО-ресторан':
						specID = 0;
						break;
					case'Диагностический центр':
					case'Авторемонтная мастерская':
					case'Детский сад':
					case'Чайная':
						specID = 1;
						break;
					case'Косметологический центр':
					case'Станция обслуживания медицинской техники':
					case'Группы подготовки к школе':
					case'Фастфуд':
						specID = 2;
						break;
					case'Поликлиника':
					case'Кузовные работы':
					case'Студия детского творчества':
					case'Fish and chips':
						specID = 3;
						break;
					case'Центр народной медицины':
					case'Шиномонтаж':
					case'Пивной ресторан':
						specID = 4;
						break;
					case'Стоматологическая клиника':
					case'Станция профилактики':
					case'Ресторан итальянской кухни':
						specID = 5;
						break;
					case'Больница':
					case'Тюнинг-салон':
					case'Рыбный ресторан':
						specID = 6;
						break;
					case'Кардиологическая клиника':
					case'Станция капитального ремонта':
					case'Стейк ресторан':
						specID = 7;
						break;
					case'Станция сезонного ремонта':
					case'Кафе-мороженое':
						specID = 8;
						break;
					case'Сырный ресторан':
						specID = 9;
						break;
					case'Вегетарианский ресторан':
						specID = 10;
						break;
					case'Кафе-кондитерская':
						specID = 11;
						break;
					case'Кофейня':
						specID = 12;
						break;
					case'Устричный ресторан':
						specID = 13;
						break;
					case'Ресторан греческой кухни':
						specID = 14;
						break;
					case'Блинная':
						specID = 15;
						break;
					case'Ресторан мексиканской кухни':
						specID = 16;
						break;
				}
		But.innerHTML = '<a href="http://cobr123.github.io/by_service/#id_service=' + spec + '&id_service_spec=' + specID + '&realm=olga&id_country=' + country + '&id_region=&id_town=&percent_from=0&percent_to=100&price_from=0&price_to=1000000000&sort_col_id=cbs_lpr&sort_dir=desc" target="_blank">Бросок Кобры</a>';
		
		$("li:contains('Правила тендеров')").after(But);
	}
	if ($('span:contains("Гурман")').length || $('span:contains("Диспансеризация")').length || $('span:contains("День жестянщика")').length || $('span:contains("Тендероняня")').length) {
		var But = document.createElement('li');
		var spec = $('#mainContent > div:nth-child(5) > a')['0'].href.match(/\d+/g)['0'];
		var country = $('#mainContent > div:nth-child(5) > a')['0'].href.match(/\d+/g)['1'];
		var city = $('#mainContent > div:nth-child(5) > a')['0'].href.match(/\d+/g)['3'];
		But.innerHTML = '<a href="http://cobr123.github.io/by_service/#id_service=' + spec + '&id_service_spec=0&realm=olga&id_country=' + country + '&id_region=&id_town=' + city + '&percent_from=0&percent_to=100&price_from=0&price_to=1000000000&sort_col_id=cbs_lpr&sort_dir=desc" target="_blank">Бросок Кобры</a>';
		
		$("li:contains('Правила тендеров')").after(But);
	}
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);