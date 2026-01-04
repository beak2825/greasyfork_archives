// ==UserScript==
// @name           Victory: Множители на ценник в торговом зале + распродажа
// @author         BioHazard
// @version        1.02
// @namespace      Victory
// @description    Множители на ценник в торговом зале магазина + распродажа
// @include        /^http.://virtonomica\.ru/\w+/main/unit/view/\d+/trading_hall$/

// @downloadURL https://update.greasyfork.org/scripts/402780/Victory%3A%20%D0%9C%D0%BD%D0%BE%D0%B6%D0%B8%D1%82%D0%B5%D0%BB%D0%B8%20%D0%BD%D0%B0%20%D1%86%D0%B5%D0%BD%D0%BD%D0%B8%D0%BA%20%D0%B2%20%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BB%D0%B5%20%2B%20%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/402780/Victory%3A%20%D0%9C%D0%BD%D0%BE%D0%B6%D0%B8%D1%82%D0%B5%D0%BB%D0%B8%20%D0%BD%D0%B0%20%D1%86%D0%B5%D0%BD%D0%BD%D0%B8%D0%BA%20%D0%B2%20%D1%82%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BB%D0%B5%20%2B%20%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let unitId = location.href.match(/\d+/)[0];

    $.getJSON('https://virtonomica.ru/api/olga/main/unit/summary?id='+unitId,function(unitInfo){
        if (unitInfo['unit_class_kind']==='shop'){ //проверка только на магазины, можно добавать заправки
            $('#mainContent').prepend('<div id="priceButtons" style="float:right;"><button value="saleOut">Распродажа</button><button  value="1.1">x1.1</button><button  value="1.25">x1.25</button><button  value="1.5">x1.5</button><button  value="2">x2</button><button  value="0">0</button></div><br style="clear:both">');
            $('#priceButtons').find('button').click(function(){
                changePrice(this.value);
            })
        }
    });

    function changePrice(param) {
        if (param==='saleOut'){
            $.ajax({
                url: 'https://virtonomica.ru/olga/main/unit/view/'+unitId,
                type: "post",
                data: 'auto_Price=Распродажные+цены',
                success:function(){location.reload()}
            });
        }
        else {
            $('tr > td:nth-child(10) > input').val(function(i, val){return parseInt(val*param*100)/100});
        }
    }
})();