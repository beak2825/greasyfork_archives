// ==UserScript==
// @name           Victory: Повысить аренду в 1 клик
// @author         BioHazard
// @version        1.01
// @namespace      Victory
// @description    На странице мэра во вкладке "аренда" повышает все активные арендные ставки в 1 клик.
// @include        /^http.://virtonomica\.ru/\w+/main/politics/mayor/\d+/rent$/
// @downloadURL https://update.greasyfork.org/scripts/403417/Victory%3A%20%D0%9F%D0%BE%D0%B2%D1%8B%D1%81%D0%B8%D1%82%D1%8C%20%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D1%83%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/403417/Victory%3A%20%D0%9F%D0%BE%D0%B2%D1%8B%D1%81%D0%B8%D1%82%D1%8C%20%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D1%83%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('.list').before('<div id="allRentUp">Повысить аренду: <img src="/img/forum/carma_up.gif" alt="Повысить аренду" title="Повысить аренду" border="0" style="cursor: pointer"></div>');

    $('#allRentUp').find('img').click(function () {
        $('a[href*="rent_up"]').each(function(){
            $.ajax({
                url:'https://virtonomica.ru/olga/main/politics/rent_up/'+this.href.match(/\d+/g)[0]+'/'+this.href.match(/\d+/g)[1]
            });
        });
    });
})();