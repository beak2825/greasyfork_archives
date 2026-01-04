// ==UserScript==
// @name         Insales Orders Quantity Color
// @namespace    http://tampermonkey.net/
// @version      v1.4
// @description  Красит строку товара, если количество товара более 1шт.
// @author       kaur
// @match        */admin2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=insales.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501422/Insales%20Orders%20Quantity%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/501422/Insales%20Orders%20Quantity%20Color.meta.js
// ==/UserScript==

$('*').on('blur change hover load mouseenter mouseleave mousemove mouseout mouseover resize scroll', function(){
    var check_quantity = 0;
    var quantity_counter = 0;
    var quantity_color = '';
    var quantity_option_color = '';
    //
    var color1 = '#fce3e3';
    var color2 = '#f9cdcd';
    //
    var color3 = '#d5e4fb';
    var color4 = '#b3ccf2';
    $('#order-lines-table').addClass('color-complete');
    $('#order-lines-table td.quantity .editable-content a').each(function() {
        check_quantity = parseInt($(this).html().replace(/ шт/g, ''));
        quantity_counter = quantity_counter + 1;
        if (quantity_counter % 2 === 0){quantity_color = color2;} else {quantity_color = color1;}
        if (check_quantity > 1 && $(this).parents().eq(2).is(':not(.colored)')){
            $(this).parents().eq(2).attr('style', 'background: '+quantity_color+';').addClass('colored');
            //$(this).parents().eq(2).find('td').css({'border-color':'#cb0000'});
            $(this).css({
                'font-weight':'600',
                'color':'#cb0000',
                'white-space':'nowrap',
                'font-size':'17px'
            });
        }
    });
    quantity_counter = 0;
    $('tr:contains("Изменить опции")').each(function() {
        quantity_counter = quantity_counter + 1;
        if (quantity_counter % 2 === 0){quantity_option_color = color4;} else {quantity_option_color = color3;}
        if ($(this).is(':not(.colored-options)')){
            $(this).attr('style', 'background: '+quantity_option_color+';').addClass('colored-options');
            $(this).find('td:contains("Изменить опции")+td').attr('colspan', '10');
            $(this).next().attr('style', 'background: '+quantity_option_color+';');
            $(this).prev().attr('style', 'background: '+quantity_option_color+';');
        }
    });
});

