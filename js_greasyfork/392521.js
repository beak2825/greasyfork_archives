// ==UserScript==
// @name       Snatched Sorter for filelist.ro
// @namespace  Snatched Sorter FL
// @version    1.4.1
// @description Sort items in filelist.ro by most snatched per page.
// @include     *filelist.ro/*
// @copyright   2019, SyShade
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392521/Snatched%20Sorter%20for%20filelistro.user.js
// @updateURL https://update.greasyfork.org/scripts/392521/Snatched%20Sorter%20for%20filelistro.meta.js
// ==/UserScript==

$(function () {
    $(".torrentrow div:nth-child(8)").each(function () {
        var th = $(this).parent();
        var vl = $(this).text().slice(0, -5);
        var vls = vl.replace(/,/g, "");
        var vlint = parseInt(vls);
        $(this).parent().attr("data-value", vlint);
    });
    var rows = $('.torrentrow [data-value]');
    $('.visitedlinks').append("<div class='table'>");
    $('.table').append(rows);
    $('[data-value]').sort(function (a, b) {
        return $(b).data('value') - $(a).data('value');
    }).appendTo('.table');
});