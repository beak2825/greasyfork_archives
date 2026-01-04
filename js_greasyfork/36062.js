// ==UserScript==
// @name           Victory: полуавтораспределениеснабжения
// @version        1.01
// @namespace      virtonomica
// @description    полуавтораспределениеснабжения
// @include        http*://*virtonomic*.*/*/window/unit/supply/multiple/vendor:*/product:*/brandname:*
// @downloadURL https://update.greasyfork.org/scripts/36062/Victory%3A%20%D0%BF%D0%BE%D0%BB%D1%83%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/36062/Victory%3A%20%D0%BF%D0%BE%D0%BB%D1%83%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
	'use strict';


	function find_supply() {
		let product_name = $('body > span:nth-child(3)').text().replace('Продукция: ',''),
			unit_id = window.location.href.match(/\d+/g)[0];

		$.ajax({
			url: 'https://virtonomica.ru/olga/main/unit/view/' + unit_id +'/supply',
			type: 'get',
			success: function(response) {
				$(response).find('strong').each(function() {
					if ($(this).text() == product_name) {
						let distribution_volume = +$(this).parent().parent().parent().parent().next().find('input').eq(1).val();

						main(distribution_volume);
					}
				})
			}
		})

	}


	function main(distribution_volume) {
		let realm_name = window.location.href.match(/\/(\w+)\/window\//)[1],
			product_id = window.location.href.match(/\d+/g)[1],
			storage,//хранилище для ответа api
			volume_delivery,//Объём товара, отгружаемый в предприятие
			checkbox_length,//длина элементов "выделенный чекбокс"
			global_volume = 0,//используется для подсчёта суммы  объёмов рынка по всем городам
			city_name,//название города
			check = false,//используется для проверки на чётность/нечётность
			check_volume = 0;//сверка фактического объёма распределения с запланированным

		$.ajax({
			url: 'https://cobr123.github.io/by_trade_at_cities/' + realm_name + '/tradeAtCity_' + product_id + '.json',
			async: true,
			dataType: 'json',
			type: 'get',
			success: function(response){
				storage = $(response);

				//Проходим по всем отмеченным предприятиям
				$('td > input[type="checkbox"]:checked').each(function() {
					//Берём название города
					city_name = $(this).parent().next().eq(0).children().text();

					//Берём объём рынка в соответствии с названием города. Суммируем.
					global_volume += $.grep(storage, function(city) { return city['tc'] === city_name })[0]['v'];
				});

				//Считаем количество чекбоксов. Оно необходимо, чтобы в самом конце не оставалась лишняя единица товара
				checkbox_length = $('td > input[type="checkbox"]:checked').length;

				//Проходим второй раз, заполняем данные по объёмам
				$('td > input[type="checkbox"]:checked').each(function(i) {
					//Берём название города
					city_name = $(this).parent().next().eq(0).children().text();

					//Проверяем на чётность/нечётность, проводим соответствующее округление
					if (check == false) {
						volume_delivery = Math.floor($.grep(storage, function(city) { return city.tc === city_name })[0].v / global_volume * distribution_volume);
						check = true;
					}
					else {
						volume_delivery = Math.ceil($.grep(storage, function(city) { return city.tc === city_name })[0].v / global_volume * distribution_volume);
						check = false;
					}

					check_volume += volume_delivery;

					//Если достигли последнего элемента, то значение выставляем с учётом накопившейся ошибки
					if (i == (checkbox_length - 1)) {
						$(this).next().eq(0).val(distribution_volume - check_volume + volume_delivery);
					}
					else {
						$(this).next().eq(0).val(volume_delivery);
					}
				});
			}
		});
		//return false;
	}


	//Создаём кнопку и поле для ввода суммы под распределение
	let input = $('<input id="myInput" type="text" size="10">');
	let button_1 = $('<button>').append('Распределить').click(function() {
			main(
				+$('#myInput').val()//Вытаскиваем значение из инпута
			);
			return false;
		}),
		button_2 = $('<button>').append('Распределить по закупу').click(function() {
			find_supply();

			return false;
		});

	$('input[name*="contractit"]').after(button_1, input, button_2);


})();