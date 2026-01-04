// ==UserScript==
// @name           Victory: Снабжение по выпуску
// @version        1.00
// @namespace      Victory
// @description    Снабжение по выпуску
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/379356/Victory%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/379356/Victory%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Получение типа предприятия
	let type = $("div.title script").text().split('\n')[3];
    type = type.substring(type.indexOf('bgunit-')+'bgunit-'.length, type.length-5);

	//Проверка типа
	if (type == 'workshop' || type == 'mill') {
	    let supply_button_1 = $('<button>').append('Выставить для').on('click', function() {
			start(1);
        }),
            supply_button_2 = $('<button>').append('Увеличить на').on('click', function() {
			start(2);
        }),
            input_field = $('<input id="my_input" type="text" size="14">');

        $('div.metro_header').append('<br>', supply_button_1, supply_button_2, input_field);
    }


    function start(button_type) {
	    let unit_id = document.location.href.match(/\d+/g)[0];

	    get_unit_summary(unit_id, button_type);
    }

    function get_unit_summary(unit_id, button_type) {
	    $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unit_id,
            success: function(response) {
                let unit_type_id = response.unit_type_id,
                    unit_product_type_id = response.unit_type_produce_id;

                get_product_recipe(unit_type_id, unit_product_type_id, button_type);
            },
            error: function() {
                setTimeout( function() { get_unit_summary(unit_id, button_type); }, 2000);
            }
        })
    }

    function get_product_recipe(unit_type_id, unit_product_type_id, button_type) {
	    $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/unittype/produce?id=' + unit_type_id,
            success: function(response) {
                for (let response_product_type_id in response) {
                    if (response_product_type_id == unit_product_type_id) {
                        let //output_quantity,
                            needed_quantity = +$('#my_input').prop('value');

                        /*for (let output_product in response[response_product_type_id].output) {
                            output_quantity = +response[response_product_type_id].output[output_product].qty;
                        }*/

                        for (let input_product in response[response_product_type_id].input) {
                            let product_input = $('#quantityField_' + input_product + '_0 > input').eq(0),
                                input_quantity = +response[response_product_type_id].input[input_product].qty;

                            if (button_type == 1) {
                                product_input.val(needed_quantity * input_quantity);

                            }
                            if (button_type == 2) {
                                product_input.val(+product_input.prop('value') + needed_quantity * input_quantity);
                            }
                        }

                        $('.button160').click();
                    }
                }
            },
            error: function() {
                setTimeout( function() { get_product_recipe(unit_type_id, unit_product_type_id, button_type); }, 2000);
            }
        })
    }

})(window);