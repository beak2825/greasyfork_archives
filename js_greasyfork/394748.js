// ==UserScript==
// @name           Victory Подгон рабов под выпуск
// @version        1.00
// @namespace      victory_podgon
// @description    Подгон рабов под выпуск
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/394748/Victory%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D0%BD%20%D1%80%D0%B0%D0%B1%D0%BE%D0%B2%20%D0%BF%D0%BE%D0%B4%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394748/Victory%20%D0%9F%D0%BE%D0%B4%D0%B3%D0%BE%D0%BD%20%D1%80%D0%B0%D0%B1%D0%BE%D0%B2%20%D0%BF%D0%BE%D0%B4%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Получение типа предприятия
	let type = $("div.title script").text().split('\n')[4];
	type = type.substring(type.indexOf('bgunit-')+7, type.length-5);

	//Проверка типа. Запускаем только на заводах и мельницах
	if (type == 'workshop' || type == 'mill') {
	    //Создаём кнопку для запуска скрипта
        let button = $('<button>').append('Подгон').on('click', find_coef_for_workers);

        //Добавление кнопки на панель
	    $("#childMenu").after(button);
    }

    //Определяем коэффициент производимых товаров к заказываемому сырью
    function find_coef_for_workers() {
        let unit_id = document.location.href.match(/\d+/g)[0],//Айди предприятия
            input_volume,//Объём заказываемого сырья
            output_volume,//Объём потребляемого сырья при таком количестве рабов
            needed_number_of_workers,//Количество необходимых для производства рабов
            current_number_of_workers = +$("td:contains('Количество рабочих')").next().text().replace(/\s/g,'').match(/\d+/)[0];//Текущее число рабов

        //Если рабов 0, то скрипт не выполняем
        if (current_number_of_workers === 0) {
            location.reload();
            return;
        }

        //Грузим страницу снабжения
        $.ajax({
				url: 'https://virtonomica.ru/olga/main/unit/view/' + unit_id + '/supply',
				type: 'get',
				success: function(response) {
                    output_volume = +$(response).find('td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').eq(0).text().replace(/\D/g,'');//Определяем по строке "Требуется"
                    input_volume = +$(response).find('td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)').eq(0).text().replace(/\D/g,'');//Определяем по строке "Заказ"

                    //Подсчитываем необходимое число работников
                    needed_number_of_workers = current_number_of_workers * (input_volume / output_volume);

                    let k;//Используем для небольшого округления вверх
                    if (needed_number_of_workers === 0) {
                        k = 0;
                    }
                    else {
                        k = 100;
                    }
                    //Округляем вверх до сотни для подстраховки, ещё сотню сверху
                    needed_number_of_workers = Math.ceil(needed_number_of_workers / 100) * 100 + k;

                    set_workers(needed_number_of_workers, unit_id);
                },
                error: function() {
                    setTimeout(find_coef_for_workers, 2000);
                }
		});
    }


    //Отправляем запрос на изменение числа работников
    function set_workers(number_of_workers, unit_id) {
        $.ajax({
            url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unit_id,
            type: 'post',
            data: 'unitEmployeesData[quantity]=' + number_of_workers + '&salary_max=100000&target_level=&trigger=2',
            success: function() {
                location.reload();
            },
            error: function() {
                setTimeout(set_workers, 2000, number_of_workers, unit_id);
            }
        });
    }

})(window);