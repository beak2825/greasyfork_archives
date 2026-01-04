// ==UserScript==
// @name        fastrating
// @namespace   kuzstu
// @description Быстрое проставление контрольных точек
// @include     https://portal.kuzstu.ru/learning/progress/current/rating
// @require	    https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34210/fastrating.user.js
// @updateURL https://update.greasyfork.org/scripts/34210/fastrating.meta.js
// ==/UserScript==

$(function () {
    var myDiv = $("<div/>")
        .attr("id", "autorating")
        .attr("class", "text-left text-black")
        .append($('<label for="autorate">Поставить выбранным</label>'));
    myDiv.append('&nbsp;');
    myDiv.append('&nbsp;');
    var rate = $('<input type="number" min="0" max="100" step="5" value="0" id="autorate" maxlength="3" class="input-mini" name="autorate" />');
    myDiv.append(rate);
    var bt = $('<button class="btn btn-primary" name="auto">Применить</button>');
    bt.click(autorate);
    bt.prepend('<i class="icon-ok-circle"></i>');
    myDiv.append('&nbsp;');
    myDiv.append('&nbsp;');
    myDiv.append(bt);
    $("#rating_main").before(myDiv);
    add_checks();
});

function autorate() {
    var value = $("#autorate").val();
    var sels = $('#table_students').children().last().children();
    sels.each(function () {
        if (! $(this).children().first().children().first().prop('checked'))
            return;
        var td = $(this).children()[4];
        var bt = $(td).children().last().children().first();
        $(bt).attr("title", value);
        $(bt).children().first().text(value);
        var select = $(td).children().first();
        var found = false;
        select.children().each(function() {
            $(this).removeAttr("selected");
            if ($(this).val() == value) {
                $(this).attr("selected", "selected");
                found = true;
            }
        });
        if (!found) {
            var opt = $("<option/>").val(value).text(value).attr("selected", "selected");
            $(select).append(opt);
        }
    });
}

function add_checks() {
    var table = $("#table_students");
    var head_row = table.children().first().children().first();
    var main_checkbox = $('<input type="checkbox" id="all_check" />').on('click', all_checks);
    var th = $('<th rowspan="2" />').append(main_checkbox);
    $(head_row).prepend(th);
    var trs = table.children().last().children();
    trs.each(function() {
        var ch = $('<input type="checkbox" class="autocheck" />');
        var td = $("<td />").append(ch);
        $(this).prepend(td);
    });
}

function all_checks() {
    var ch = document.getElementById('all_check').checked;
    $('.autocheck').each(function() {this.checked = ch;});
}