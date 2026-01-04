// ==UserScript==
// @name           Victory Снабжение СУ
// @version        1.00
// @author         Agor71
// @description    Снабжение СУ
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/394825/Victory%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%A1%D0%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/394825/Victory%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%A1%D0%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Получение типа предприятия
	let type = $("div.title script").text().split('\n')[4];
	type = type.substring(type.indexOf('bgunit-')+7, type.length-5);

	//Проверка типа
	if (type == 'medicine' || type == 'restaurant' || type == 'repair' || type == 'educational') {
	    let supply_button = $('<button>').append('Заказать').on('click', function() {
			start();
        }),
            input_field = $('<input id="my_input" type="text" size="14">');

        $('#childMenu').after(input_field, supply_button);
    }


    //Функция считывания потребления на клиента, замены заказываемого количества
    function start() {
	    $('tr[id*="product_row_"]').each(function() {
            let k = +$('#my_input').prop('value'),
                quantityPerVis = $('td:contains("Расх. на клиента")', this).next()[1].childNodes[0].data,
                newQuantity = k * quantityPerVis;
            
            $('input[type = "type"]', this).attr('value', newQuantity);
        });
	    
	    //Кликаем на кнопку изменения заказа
        $("input[value='Изменить']").trigger('click');
    }


})(window);