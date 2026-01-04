// ==UserScript==
// @name         Моя страница
// @author       AveAcVale
// @description  Добавляет кнопку "Моя страница" справа от "Сообщения". Требуется редактирование скрипта под себя.
// @icon         https://www.google.com/s2/favicons?domain=boosty.to
// @match        https://boosty.to/*
// @version      0.2
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license     CC BY-NC-SA 4.0
// @namespace https://greasyfork.org/users/1237672
// @downloadURL https://update.greasyfork.org/scripts/482870/%D0%9C%D0%BE%D1%8F%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482870/%D0%9C%D0%BE%D1%8F%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0.meta.js
// ==/UserScript==

$(document).ready(function() {
    var hrefs = new Array();
    var elements = $('.headline > a');
    elements.each(function() {
        hrefs.push($(this).attr('href'))
    });

    $('body').append('<input type="button" value="МОЯ СТРАНИЦА" id="BtnMP">')
    $("#BtnMP").css("position", "fixed").css("z-index", 999999).css("top", 15).css("left", 350)
    .css("align-items", "center").css("background", "white").css("border-radius", 8).css("border", "thin solid")
    .css("border-color", "#eaeaea").css("display", "flex").css("font-weight", 600).css("height", 40).css("width", 160);
    $('#BtnMP').click(function(){
        var target = "boosty"; //Вместо boosty написать свой id
        window.location.replace("https://boosty.to/" + target);
    });
});