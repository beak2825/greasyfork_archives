// ==UserScript==
// @name           Victory: Повысить энерготарифы в 1 клик
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description    На странице губернатора во вкладке "тарифы на электроэнергию" повышает все активные тарифы в 1 клик.
// @include        /^http.://virtonomica\.ru/\w+/main/politics/governor/\d+/tariff$/
// @downloadURL https://update.greasyfork.org/scripts/403032/Victory%3A%20%D0%9F%D0%BE%D0%B2%D1%8B%D1%81%D0%B8%D1%82%D1%8C%20%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%82%D0%B0%D1%80%D0%B8%D1%84%D1%8B%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/403032/Victory%3A%20%D0%9F%D0%BE%D0%B2%D1%8B%D1%81%D0%B8%D1%82%D1%8C%20%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%82%D0%B0%D1%80%D0%B8%D1%84%D1%8B%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let regionId = location.href.match(/\d+/)[0],
        industryId;

    $('fieldset').append('<div id="allEnergyTariffUp">Повысить все тарифы: <img src="/img/forum/carma_up.gif" alt="Повысить тарифы" title="Повысить тарифы" border="0" style="cursor: pointer"></div>');

    $('#allEnergyTariffUp').find('img').click(function () {

        $('a[href="#"]:not(:first):even').each(function(){

           industryId = $(this).attr('onclick').match(/\d+/)[0];
           
            $.ajax({
                url:'https://virtonomica.ru/olga/main/politics/manage',
                type:'post',
                data:{'region_id': regionId,
                    'industry_id': industryId,
                    'command': 'tariff_up'}

            });
        });
    });
})();