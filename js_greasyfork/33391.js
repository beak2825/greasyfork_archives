// ==UserScript==
// @name           Victory: закупка оборудования
// @version        1.03
// @namespace      Victory
// @description    Закупка оборудования
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/33391/Victory%3A%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/33391/Victory%3A%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {
    $( document ).ready(function() {
		//Считываем тип предприятия
		var img =  $('.picture').attr('class').substring(28);
		//ID оборудования
		var id = 0;
		//ID склада - можно менять под разные типы (ниже)
		var storageID = 4728384;
		//Максимальное закупаемое количество оборудования (сделано для вышек)
		var kol = 0;
		
		if (img == 'animalfarm') {
			var spec = $('td.title:contains("Специализация")').next().text();
			switch (spec) {
				case('Свиноферма (комбикорм)'):
				case('Разведение свиней (картофель)'):
				case('Разведение свиней (клевер)'):
				case('Разведение свиней (комбикорм)'):
				case('Свиноферма (клевер)'):
				case('Разведение свиней'):
				case('Свиноферма (картофель)'):
				case('Свиноферма'):
					img = 'Свиноферма';
					break;
				case('Овцеферма (картофель)'):
				case('Разведение овец'):
				case('Разведение овец (картофель)'):
				case('Овцеферма (клевер)'):
				case('Разведение овец (комбикорм)'):
				case('Овцеферма'):
				case('Разведение овец (клевер)'):
				case('Овцеферма (комбикорм)'):
					img = 'Овцеферма';
					break;
				case('Птицеферма (картофель)'):
				case('Бройлерная птицеферма'):
				case('Разведение кур (картофель)'):
				case('Яичная ферма (зерно)'):
				case('Птицеферма (комбикорм)'):
				case('Разведение кур (комбикорм)'):
				case('Яичная ферма (картофель)'):
				case('Бройлерная птицеферма (картофель)'):
				case('Бройлерная птицеферма (комбикорм)'):
				case('Яичная ферма (комбикорм) 	Домашняя птица'):
				case('Разведение кур'):
				case('Птицеферма'):
					img = 'Птицеферма';
					break;
				case('Разведение коров'):
				case('Молочная ферма (клевер)'):
				case('Коровник (картофель)'):
				case('Коровник (клевер)'):
				case('Молочная ферма (комбикорм)'):
				case('Разведение коров (комбикорм)'):
				case('Молочная ферма (зерно)'):
				case('Разведение коров (картофель)'):
				case('Разведение коров (клевер)'):
				case('Коровник (комбикорм)'):
				case('Молочная ферма (картофель)'):
				case('Коровник'):
					img = 'Коровник';
					break;
			}
		}
		
		switch(img) {
			case('network')://Коммуникационная сеть
				id = 423745;
				storageID = 6411520;
				kol = 1;
				break;
			case('fishingbase')://Рыболовная база
				id = 335182;
				storageID = 4092271;
				break;
			case('lab')://Лаборатория
				id = 1528;
				storageID = 5462060;
				break;
			case('medicine')://Медцентр
				id = 359855;
				storageID = 5481630;
				break;
			case('oil_power')://Мазутная электростанция
				id = 422710;
				storageID = storageID;
				break;
			case('incinerator_power')://Мусоросжигательная электростанция
				id = 422712;
				storageID = storageID;
				break;
			case('sun_power')://Солнечная электростанция
				id = 423728;
				storageID = 6891337;
				break;
			case('coal_power')://Угольная электростанция
				id = 422135;
				storageID = 5421636;
				break;
			case('apiary')://Пасека
				id = 423138;
				storageID = 5997181;
				break;
			case('Коровник')://Коровник
				id = 2548;
				storageID = storageID;
				break;
			case('Овцеферма')://Овцеферма
				id = 2555;
				storageID = 6065138;
				break;
			case('Свиноферма')://Свиноферма
				id = 2554;
				storageID = storageID;
				break;
			case('Птицеферма')://Птицеферма
				id = 2556;
				storageID = storageID;
				break;
			case('orchard')://Плантация
			case('farm')://Землеферма
				id = 1530;
				storageID = 6036403;
				break;
			case('mill')://Мельница
			case('workshop')://Завод
				id = 1529;
				storageID = 4689384;
				break;
			case('sawmill')://Лесопилка
				id = 10717;
				storageID = 3931930;
				break;
			case('office')://Офис
				id = 1515;
				storageID = storageID;
				break;
			case('fuel')://АЗС
				id = 422708;
				storageID = storageID;
				break;
			case('kindergarten')://Детсад
				id = 423689;
				storageID = storageID;
				break;
			case('fitness')://Фитнес
				id = 15337;
				storageID = storageID;
				break;
			case('hairdressing')://Парикмахерская
				id = 373197;
				storageID = storageID;
				break;
			case('laundry')://Прачечная
				id = 3867;
				storageID = storageID;
				break;
			case('restaurant')://Ресторан
				id = 373198;
				storageID = 4459262;
				break;
			case('repair')://Мастерская
				id = 422709;
				storageID = 5586156;
				break;
			case('cellular')://Оператор связи
				id = 423275;
				storageID = storageID;
				kol = 1;
				break;
			case('mine')://Шахта
				id = 12097;
				storageID = 6285098;
				break;
			case('shop')://Магазин
			case('villa')://Вилла
			case('warehouse')://Склад
				break;
		}
		

		if (img != 'shop' && img != 'villa' && img != 'warehouse' && img != 'cellular') {
			var obor = $('<button>').append('Оборудование').click( function() {
				//var maxObor = $("td:contains('Количество оборудования')").next().text().replace(' ','').match(/\d[.\s\d]*(?=)/g)[1].replace(/[^\d\.]/g,'');
				var maxObor = $("td:contains('Количество ')").eq(0).next().text().replace(' ','').match(/\d[.\s\d]*(?=)/g)[1].replace(/[^\d\.]/g,'');
				if (kol > 0) {	maxObor = (maxObor > kol) ? kol : maxObor;	}
				//var link = window.location.href;
				var unitID = window.location.href.match(/\d+/)[0];
				
				if (img != 'workshop') {
					$.ajax({
						url: 'https://virtonomica.ru/olga/window/management_units/equipment/multiple/vendor:' + storageID + '/product:' + id,
						async: false,
						type: 'post',
						data: 'unit[' + unitID + '][operation]=buy&unit[' + unitID + '][qty]=' + maxObor
					});
				}
				else {
					$.ajax({
						url: 'https://virtonomica.ru/olga/ajax/unit/supply/equipment',
						async: false,
						type: "post",
						data: 'operation=buy&offer=6715974&unit=' + unitID + '&supplier=6715974&amount=' + maxObor
					});
				}

				location.reload();
			});
			$("#childMenu").after(obor);
		}
	})
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);