// ==UserScript==
// @name           Victory: Требуется снабжение в 1 клик
// @author         BioHazard
// @version        1.01
// @namespace      Vironomica
// @description    Снабжение в 1 клик
// @include        /^http.://virtonomica\.ru/\w+/main/unit/view/\d+/supply$/
// @downloadURL https://update.greasyfork.org/scripts/374138/Victory%3A%20%D0%A2%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D1%82%D1%81%D1%8F%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374138/Victory%3A%20%D0%A2%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D1%82%D1%81%D1%8F%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function (){
    $('.tabu').append('<li id="wroomWroom" style="cursor: pointer;"><img src="https://virtonomica.ru/img/supplier_add.gif"></li>');
    $('#wroomWroom').on('click', function(){
        $('.reqspan.pseudolink').click();
        saveAll();
    });
})(window);