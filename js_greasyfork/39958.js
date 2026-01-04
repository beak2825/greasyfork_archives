// ==UserScript==
// @name         Spacom: разрешение на стройку
// @version      1.04
// @description  ОК / НЕ ОК для зергов
// @author       Agor71
// @include      http*://*spacom.ru/?act=game/planet&planet_id=*
// @run-at       document-end
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/39958/Spacom%3A%20%D1%80%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/39958/Spacom%3A%20%D1%80%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D1%83.meta.js
// ==/UserScript==

(function (w) {
	setInterval(function() {
		if ($('div.planetData').eq(1).find(':contains("КЕК")').length === 0) {
			//Запрос json с параметрами планеты
			$.ajax({
				url: 'https://spacom.ru/api/?player_id=' + player_id + '&server_id=' + server_id + '&token=' + token + '&rand=0.20799929886476787&act=planet&planet_id=' + planet_id + '&format=json',
				type: "GET",
				async: false,
				success: function(json){
					storage = $(json);
				}
			});

			//Базовый прирост еды на планете, без бонусов
			var baseFood = +storage[0].planet.food_base;

			//Текущее население планеты
			var currentPopulation = +storage[0].planet.population;

			//Максимальное население планеты
			var maxPopulation = +storage[0].planet.population_max;

			//Ожидаемое население в текущий ход
			var waitedPopulation = +storage[0].planet.population_wait;

			//Определение ожидаемого прироста населения в зависимости от базовой еды планеты (не везде получится всегда по +5)
			if (baseFood >= 7) { expectedGrowth = 5; }
			if (7 > baseFood && baseFood >= 5) { expectedGrowth = 4; }
			if (5 > baseFood && baseFood >= 3) { expectedGrowth = 3; }

			//Текущее количество уровней ферм
			var currentFarms = 0;
			$.each(storage[0].buildings, function(j) {
				if (storage[0].buildings[j].name == 'Ферма') { currentFarms += +storage[0].buildings[j].level; }
			});

			//Прирост еды с учётом построенных ферм и всех бонусов
			var currentFoodProd = (currentFarms + 1) * baseFood * 1.6;

			//На сколько ходов вперёд просчитывать
			var queueCounter = 0;
			$.each(storage[0].queue, function(j) {
				if (storage[0].queue[j].building_wait != '0' && storage[0].queue[j].building_position == '0') { queueCounter += +storage[0].queue[j].building_wait; }
                if (storage[0].queue[j].building_wait != '0') { queueCounter += 1; }
			});

			//Сколько будет ферм
			var queueCounterFarms = 0;
			$.each(storage[0].queue, function(j) {
				if (storage[0].queue[j].building_wait != '0' && storage[0].queue[j].name == 'Ферма') { queueCounterFarms += 1; }
			});

			//Какая ожидается еда через n ходов
			var expectedFoodProd = currentFoodProd + (queueCounterFarms * baseFood * 1.6);

			//Какое ожидается население через n ходов
			var expectedPopulation = currentPopulation + queueCounter * expectedGrowth;

			//Проверка на достижение максимального населения
			if (expectedPopulation >= maxPopulation) { expectedPopulation = maxPopulation; }

			//Можно ли строить не ферму
			if (Math.round(expectedFoodProd) >= (maxPopulation * 1.5) || (Math.round(expectedFoodProd) >= maxPopulation && (maxPopulation - expectedPopulation) <= 10)) { $('div.planetData').eq(1).append('<span style="color:blue; font-size: 200%; font-weight: bold">КЕК ХВАТИТ.</span><span style="font-size: 200%; font-weight: bold"> Еды: ' + expectedFoodProd.toFixed(1) + ' Людей: ' + expectedPopulation + '</span>'); }
			else {
				if (Math.round(expectedFoodProd) >= ((expectedPopulation + 5) * 2)) { $('div.planetData').eq(1).append('<span style="color:green; font-size: 200%; font-weight: bold">КЕК.</span><span style="font-size: 200%; font-weight: bold"> Еды: ' + expectedFoodProd.toFixed(1) + ' Людей: ' + expectedPopulation + '</span>'); }
				else { $('div.planetData').eq(1).append('<span style="color:red; font-size: 200%; font-weight: bold">НЕ КЕК.</span><span style="font-size: 200%; font-weight: bold"> Еды: ' + expectedFoodProd.toFixed(1) + ' Людей: ' + expectedPopulation + '</span>'); }
			}
		}
	}, 200);
})(unsafeWindow);