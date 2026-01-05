// ==UserScript==
// @name              fastDescription
// @namespace         virtonomica
// @version      0.01
// @description  Показывает быструю справку
// @author       noname
// @match        http://virtonomica.ru/vera/main/unit/view/*
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @require      http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11348/fastDescription.user.js
// @updateURL https://update.greasyfork.org/scripts/11348/fastDescription.meta.js
// ==/UserScript==

var info = new Array('',
                     'Производимая продукция по определенному рецепту из 1го или более возможных', '', '', '', '', '', '', '', '', '', 
                     'В сочетании с количеством сотрудников оказывает нагрузку на Топ2. При неполной нагрузке на Топ3 за счет него может компенсироваться перегрузка на Топ2.',
                     '',
                     'Уровень соответсвия необходимых мощностей офиса и нагрузки всех подопечных предприятий. Может компенсироваться за счет избытка квалификации сотрудников в отношении требуемой от оборудования и технологии.');
$( document ).ready(function() {
    $('head').append("<style>.title{cursor: pointer;}</style>");
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css') );
    $( document ).tooltip();
    $.each($(".title"), function (i,obj)
           {
               $(obj).attr('title',info[i]);
           });
});
