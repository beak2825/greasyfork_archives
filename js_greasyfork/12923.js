// ==UserScript==
// @name         Virtonomica: Исправляем ссылки из писем на исследования
// @namespace    virtonomica
// @version      0.05
// @description  Разработчики игры сделали доброе дело — объединили кучу писем одной тематики, но об удобстве подумать забыли ;)
// @author       Otetz
// @include      http*://virtonomic*.*/*/main/user/privat/persondata/message/system/*
// @icon         http://virtonomica.ru/img/unit_types/24/lab.gif
// @downloadURL https://update.greasyfork.org/scripts/12923/Virtonomica%3A%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B8%D0%B7%20%D0%BF%D0%B8%D1%81%D0%B5%D0%BC%20%D0%BD%D0%B0%20%D0%B8%D1%81%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/12923/Virtonomica%3A%20%D0%98%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B8%D0%B7%20%D0%BF%D0%B8%D1%81%D0%B5%D0%BC%20%D0%BD%D0%B0%20%D0%B8%D1%81%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {
    var subject = $('table td:nth-child(1) > table tr:nth-child(3) > td')[0].innerText;
    if (subject != 'Эврика!' && subject != 'Предварительное исследование завершено!' && subject != 'Гипотеза верна!')
        return;
    
    $('table.unit-list-2014 > tbody > tr').each(function() {
        var cell = $('td:nth-child(3)', this)[0];
        var link = cell.children[0].href
        //var unit_id = /\/(\d+)$/.exec(link)[1];
        var inv_link = link + '/investigation'
        $('&nbsp;<a href="' + inv_link + '" target="_blank"><img src="/img/icon/invention.gif" width="16" height="16" style="vertical-align: baseline;" title="Исследования"></a>').appendTo(cell);
    });
}

// Хак, что бы получить полноценный доступ к DOM
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
