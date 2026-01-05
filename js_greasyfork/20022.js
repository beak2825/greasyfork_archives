// ==UserScript==
// @author     Fra85
// @name        Tom's Hardware Paginator Remover
// @namespace   greasemonkey.tomshardware.paginator_remover
// @description Visualizza gli articoli multipagina in una pagina sola.
// @include     http://www.tomshw.it/
// @version     1.2
// @domain          tomshw.it
// @match           http://www.tomshw.it/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20022/Tom%27s%20Hardware%20Paginator%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/20022/Tom%27s%20Hardware%20Paginator%20Remover.meta.js
// ==/UserScript==
if (document.getElementsByTagName("title").length === 0) return;


$(function() {

    var ll = $("#sticky-pagination ol li:last-child a").attr("href");
    if (!ll) return;

    function getPageNum(url) {
        var n = url.substring(url.lastIndexOf('-p') + 2);
        return isFinite(n) ? n : 1;
    };

    function getPageUrl(base, page) {
        return (page == 1) ? base : base + "-p" + page;
    }

    function contains(str, key) {
        return (str.indexOf(key) > -1);
    }

    var titles = [];
    $("#sticky-pagination ol li a").each(function() {
        titles.push($(this).text());
    });

    function getTitle(page) {
        return "<h3>" + titles[page - 1] + "</h3>";
    }

    var npages = ll.substring(ll.lastIndexOf('-p') + 2);
    var baseurl = ll.substring(0, ll.lastIndexOf('-p'));
    var start = 1;

    if (getPageNum(window.location.pathname) == 1) {
        if (!contains($("#intelliTxt").html(), "<h3"))
            $("#intelliTxt").prepend(getTitle(1));
        start = 2;
    } else
        $("#intelliTxt").empty();

    $("#sticky-pagination, .pagination_summary").remove();
    $("#intelliTxt").css("background-color", "#FFF");

    for (var i = start; i <= npages; i++) {
        $("#intelliTxt").append('<div class="load-image" id="thpr-' + i + '"><i class="fa fa-spinner fa-pulse"></i></div>');
        (function(i) {
            $.get(getPageUrl(baseurl, i), {}, function(msg) {
                    var line = (i == 1) ? "" : "<hr style='border-width:4px 0 0'></hr>";
                    var title = contains(msg, "<h3") ? "" : getTitle(i);
                    $("#thpr-" + i).after(line + title + msg);
                    $("#thpr-" + i).remove();
                })
                .fail(function() {
                    alert("Errore download pagina " + i);
                });
        })(i);
    }
});