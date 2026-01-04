// ==UserScript==
// @name           Victory: Заказ доли рынка (магазины)
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description    Заказ доли рынка на странице снабжения магазинов
// @include        /^http.://virtonomica\.ru/\w+/main/unit/view/\d+/supply$/

// @downloadURL https://update.greasyfork.org/scripts/402774/Victory%3A%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BE%D0%BB%D0%B8%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%28%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D1%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402774/Victory%3A%20%D0%97%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BE%D0%BB%D0%B8%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%28%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D1%8B%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let unitId = location.href.match(/\d+/)[0],
        city_id,
        region_id,
        country_id,
        marketPercentage;

    $.getJSON('https://virtonomica.ru/api/olga/main/unit/summary?id='+unitId,function(unitInfo){
        if (unitInfo['unit_class_kind']==='shop'){ //проверка только на магазины, можно добавать заправки
            city_id = unitInfo['city_id'];
            $('#mainContent').prepend('<div id="percentageFromCityMarket">Заказать долю рынка: <input type="text" size="5" value="15"> <button>Рассчитать</button></div>');
            $('#percentageFromCityMarket').find('button').click(function(){
                marketPercentage = $('#percentageFromCityMarket').find('input').val()/100;
                changeValues();
            });
        }
    });

    function changeValues() {
        $.getJSON('https://virtonomica.ru/api/olga/main/geo/city/browse',function(geoBrowse){
            region_id = geoBrowse[city_id]['region_id'];
            country_id = geoBrowse[city_id]['country_id'];

            $('[id ^= "quantityField"]').each(function(i,item){
                $.getJSON('https://virtonomica.ru/api/olga/main/marketing/report/retail/metrics?product_id='+item.id.match(/\d+/)[0]+'&geo='+country_id+'/'+region_id+'/'+city_id,function (metrics) {
                    item.firstElementChild.value=Math.round(+metrics['local_market_size']*marketPercentage);
                });
            });
        });
    }
})();