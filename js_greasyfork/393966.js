// ==UserScript==
// @name          Virtonomica: Info KO
// @namespace     дополнительная информация о чужом магазине
// @version 	  1
// @author		  Stepanov
// @description   для парсинга данных вирты через апи
// @include       http*://virtonomic*.*/*/main/unit/view/*
// @include       https://virtonomica.ru/*/main/globalreport/marketing/?product_id=351577&geo=422653/422655/422660


// @downloadURL https://update.greasyfork.org/scripts/393966/Virtonomica%3A%20Info%20KO.user.js
// @updateURL https://update.greasyfork.org/scripts/393966/Virtonomica%3A%20Info%20KO.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    var strn=window.location.href;
    strn=strn.split("/")
    var realm = strn[3];
    var mag = strn[7];
    var link = 'https://virtonomica.ru/api/'+realm+'/main/unit/summary?id='+mag+'';
// https://virtonomica.ru/api/nika/main/unit/summary?id=8242322&format=debug
    $.ajax({
        url: link,
        async: false,
        type: 'POST',
        dataType : 'json',
        success: function(data){ //'service_type' fame 'advertising_cost'
            $("#mainContent > div.unit_box-container > div > div:nth-child(1) > table > tbody").append('<Tr><Td>Количество посетителей <Td>'+data['customers_count']);
            $("#mainContent > div.unit_box-container > div > div:nth-child(1) > table > tbody").append('<Tr><Td>Уровень сервиса <Td>'+data['service_type']);
            $("#mainContent > div.unit_box-container > div > div:nth-child(1) > table > tbody").append('<Tr><Td>Размер рекламы <Td>'+data['advertising_cost']);
            $("#mainContent > div.unit_box-container > div > div:nth-child(1) > table > tbody").append('<Tr><Td>Требуется продавцов <Td>'+data['employee_required']);//employee_required
        }
    })


}


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}