// ==UserScript==
// @name         HWM ивент пиратов, выгодность перевозки
// @version      1
// @author       noname
// @include      https://www.heroeswm.ru/pirate_event.php
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @description  возле каждого ресурса пишется прибыль за тонну
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/377636/HWM%20%D0%B8%D0%B2%D0%B5%D0%BD%D1%82%20%D0%BF%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D0%B2%2C%20%D0%B2%D1%8B%D0%B3%D0%BE%D0%B4%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B7%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/377636/HWM%20%D0%B8%D0%B2%D0%B5%D0%BD%D1%82%20%D0%BF%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D0%B2%2C%20%D0%B2%D1%8B%D0%B3%D0%BE%D0%B4%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B7%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function (undefined) {
    $('td').each(function(){
        if( $(this).html() == 'Вес т.' ){
            $tablePirat = $(this).closest('table');
            $tablePirat.find('>tbody>tr').each(function(i){
                if( i > 0 ){
                    ves = parseInt( $(this).find('>td:eq(1)').html() );
                    priceStart = parseInt( $(this).find('>td:eq(2) td:last').html().replace(',','') );
                    priceEnd = parseInt( $(this).find('>td:eq(3) td:last').html().replace(',','') );
                    marga = ( ( priceEnd - priceStart ) / ves ).toFixed(2);
                    $(this).find('>td:last').append('<br>Выгода за 1т: '+marga);
                }
            });
        }
    });
}());
