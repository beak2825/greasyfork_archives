// ==UserScript==
// @name         AM_hwm_remove_trash
// @namespace    AlaMote
// @version      0.3.1
// @description  Удаление ненужного
// @author       AlaMote
// @include      http://*heroeswm.ru/*
// @include      *178.248.235.15/*
// @include      http://*lordswm.com/*
// @icon         http://www.hwm-img.totalh.net/favicon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28586/AM_hwm_remove_trash.user.js
// @updateURL https://update.greasyfork.org/scripts/28586/AM_hwm_remove_trash.meta.js
// ==/UserScript==

(function (window, undefined) {

    var host = ["http://www.heroeswm.ru/", "http://178.248.235.15/", "http://www.lordswm.com/"];
    if (host.indexOf(location.href) != -1)
        return;


    if (location.href.match(/home.php/))
        $("center div object").remove();

    var arrows = $("div");
    for (var i = 0; i < arrows.length; i++) {
        if (arrows[i].id.match(/arrows_/)) {
            $("#" + arrows[i].id).remove();
        }
    }

    $("b:contains('Знаете ли Вы что')").parent().parent().parent().hide();
    $("center:contains('Ваш IP адрес')").parent().parent().parent().hide();





})(window);






