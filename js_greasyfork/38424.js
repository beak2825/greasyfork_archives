// ==UserScript==
// @name           Victory: стандартное снабжение
// @version        1.00
// @namespace      Victory
// @description    Заказ сырья на заводы
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/38424/Victory%3A%20%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%BE%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/38424/Victory%3A%20%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%BE%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

var run = function() {
	//Получение типа предприятия
	var type = $("div.title script").text().split('\n')['4'];
	type = type.substring(type.indexOf('bgunit-')+7, type.length-5);

	//Проверка типа
	if (type == 'workshop' || type == 'mill' || type == 'animalfarm' || type == 'power') {
		var but = $('<button>').append('Стандартное снабжение').click( function() {
			//Считываем, какое сырьё необходимо, построчно
			$("tr[id^='product_row']").each( function() {
				//Считываем название сырья
				var title = $('tr:nth-child(1) > td:nth-child(1) > a', this).attr('title');
				//Считываем требуемое количество
				var requirement = parseInt($("tr td:contains('Требуется')", this).next().text().replace(/\s/g, ''));
				//Берём id предприятия
				var unitID = window.location.href.match(/\d+/)[0];
				
				//В целях дальнейшей проверки безопасности
				var orderID = 0;
				//Сверяем с списком складов
				switch(title) {
					//Сельхоз
					case('Апельсин'):
						orderID = 7451450;
						break;
					case('Воск'):
						orderID = 6051802;
						break;
					case('Вощина'):
						orderID = 6044215;
						break;
					case('Зерно'):
						orderID = 1059325;
						break;
					case('Какао'):
						orderID = 5020193;
						break;
					case('Картофель'):
						orderID = 4990614;
						break;
					case('Комбикорм'):
						orderID = 0;
						break;
					case('Кормовые культуры'):
						orderID = 4974501;
						break;
					case('Кофе'):
						orderID = 4002024;
						break;
					case('Кукуруза'):
						orderID = 5069872;
						break;
					case('Масло'):
						orderID = 3784817;
						break;
					case('Соусы'):
						orderID = 4990923;
						break;
					case('Специи'):
						orderID = 4990984;
						break;
					case('Молоко'):
						orderID = 6703443;
						break;
					case('Мясо'):
						orderID = 4987975;
						break;
					case('Мёд'):
						orderID = 6068836;
						break;
					case('Оливки'):
						orderID = 6015484;
						break;
					case('Подсолнечник'):
						orderID = 3184083;
						break;
					case('Помидоры'):
						orderID = 4611928;
						break;
					case('Рыбная мука'):
						orderID = 0;
						break;
					case('Мука'):
						orderID = 4456068;
						break;
					case('Сахар'):
						orderID = 4989753;
						break;
					case('Соя'):
						orderID = 0;
						break;
					case('Табак'):
						orderID = 4788314;
						break;
					case('Фрукты'):
						orderID = 1059330;
						break;
					case('Хлопок'):
						orderID = 2947496;
						break;
					case('Цветы и эфиромасличные культуры'):
						orderID = 6723843;
						break;
					case('Чайный лист'):
						orderID = 6625727;
						break;
					case('Яйца'):
						orderID = 4989776;
						break;
					
					//Руды
					case('Бокситы'):
						orderID = 3034005;
						break;
					case('Глина'):
						orderID = 1059320;
						break;
					case('Железная руда'):
						orderID = 1059324;
						break;
					case('Кремний'):
						orderID = 1059321;
						break;
					case('Природные минералы'):
						orderID = 1059323;
						break;
					case('Уголь'):
						orderID = 1059331;
						break;
					case('Хром'):
						orderID = 1059332;
						break;
					case('Марганец'):
						orderID = 1059328;
						break;
					case('Медный колчедан'):
						orderID = 4998666;
						break;
					case('Титановая руда'):
						orderID = 5014865;
						break;
					case('Полиметаллическая руда'):
						orderID = 6448769;
						break;
					case('Алмазы'):
						orderID = 0;
						break;
					case('Золото'):
						orderID = 0;
						break;
					
					//Древесина
					case('Древесина'):
						orderID = 4618223;
						break;
					
					//Нефтехим
					case('Нефть'):
						orderID = 0;
						break;
					case('Химикаты'):
						orderID = 0;
						break;
					case('Этанол'):
						orderID = 0;
						break;
					case('Мазут'):
						orderID = 0;
						break;
					
					//Рыбный мир
					case('Жемчуг'):
						orderID = 0;
						break;
					case('Крабы'):
						orderID = 4615781;
						break;
					case('Лосось'):
						orderID = 4615778;
						break;
					case('Осетр'):
						orderID = 4615779;
						break;
					case('Промысловая рыба'):
						orderID = 4615777;
						break;
					case('Треска'):
						orderID = 0;
						break;
					case('Устрицы'):
						orderID = 0;
						break;
					
					//Материалы
					case('LED'):
						orderID = 6471179;
						break;
					case('Автозапчасти'):
						orderID = 4972543;
						break;
					case('Алюминий'):
						orderID = 4972039;
						break;
					case('Бумага'):
						orderID = 4610673;
						break;
					case('Двигатель'):
						orderID = 4614046;
						break;
					case('Зеркальный лист'):
						orderID = 4972588;
						break;
					case('Кожа'):
						orderID = 6703946;
						break;
					case('Комплектующие'):
						orderID = 0;
						break;
					case('Косметическое масло'):
						orderID = 4976671;
						break;
					case('Краска'):
						orderID = 6704085;
						break;
					case('Литий'):
						orderID = 6442539;
						break;
					case('Литий-ионный аккумулятор'):
						orderID = 6415898;
						break;
					case('Медь'):
						orderID = 3702849;
						break;
					case('Микропроцессор'):
						orderID = 6415836;
						break;
					case('Натуральные лекарственные компоненты'):
						orderID = 5003303;
						break;
					case('Парфюмерная эссенция'):
						orderID = 6411398;
						break;
					case('Пластмасса'):
						orderID = 6706752;
						break;
					case('Резина'):
						orderID = 6713921;
						break;
					case('Сверхлёгкий алюминиевый сплав'):
						orderID = 4972488;
						break;
					case('Синтетическая ткань'):
						orderID = 6712615;
						break;
					case('Синтетические лекарственные компоненты'):
						orderID = 5979914;
						break;
					
					case('Сталь'):
						orderID = 7457195;
						break;
					case('Стекло'):
						orderID = 6725189;
						break;
					case('Термопластик'):
						orderID = 7741281;
						break;
					case('Термоэлемент'):
						orderID = 6453412;
						break;
					case('Титан'):
						orderID = 4972463;
						break;
					case('Ткань'):
						orderID = 6703736;
						break;
					case('Углепластик'):
						orderID = 6715944;
						break;
					case('Хлопковая ткань'):
						orderID = 6703737;
						break;
					case('Хлопковое волокно'):
						orderID = 6724813;
						break;
					case('Цинк'):
						orderID = 7163364;
						break;
					case('Шерсть'):
						orderID = 6727633;
						break;
					case('Электронные компоненты'):
						orderID = 4618037;
						break;
					case('Электропривод'):
						orderID = 4985847;
						break;
					case('Шины'):
						orderID = 4614745;
						break;	
					
					//Всякое разное
					case('GPS-навигаторы'):
						orderID = 0;
						break;
					case('Автомобильные диски'):
						orderID = 0;
						break;
					case('Бижутерия'):
						orderID = 4968398;
						break;
					case('Компьютерные аксессуары'):
						orderID = 0;
						break;
					case('Мебель'):
						orderID = 0;
						break;
					case('Ноутбук'):
						orderID = 0;
						break;
					case('Принтер'):
						orderID = 0;
						break;
					case('Светодиодная лампа'):
						orderID = 0;
						break;
					case('Серверная платформа'):
						orderID = 0;
						break;
					case('Система очистки дымовых газов'):
						orderID = 0;
						break;
					case('Теплообменное оборудование'):
						orderID = 0;
						break;
					case('Топливное оборудование'):
						orderID = 0;
						break;
					case('Топливораздаточная колонка'):
						orderID = 0;
						break;
					case('Угольная мельница'):
						orderID = 0;
						break;
				}
				
				if (orderID != 0) {
					//Отправка запроса для заказа
					$.ajax({
						url: 'https://virtonomica.ru/olga/ajax/unit/supply/create',
						async: false,
						type: "post",
						data: 'offer=' + orderID + '&unit=' + unitID + '&amount=' + requirement
					});
				}
			});
			//Перезагрузка страницы после заказа
			location.reload();
		});
		$('div.metro_header').append(but);
	}
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);