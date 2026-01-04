// ==UserScript==
// @name         Yen Press Calendar Fix
// @version      1.3
// @description  automatically shows all entries and adds filtering by type
// @author       Hato4PL
// @match        https://yenpress.com/calendar*
// @icon         https://yenpress.com/images/favicon.png
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace    https://greasyfork.org/users/1060113
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464066/Yen%20Press%20Calendar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/464066/Yen%20Press%20Calendar%20Fix.meta.js
// ==/UserScript==

/* globals jQuery, $ */

var ID = 0;
var LOADED = false;

GM_addStyle("#filter-type.back { z-index: -1; }");

(function() {
    'use strict';

    var type = $("#type option:selected").val();
    var format = $("#format option:selected").val();

    showMoreALL();

    var x = new MutationObserver(function (e) {
        showMoreALL();
    });

    x.observe(document.querySelector('.calendar-container'), { childList: true });

    var y = new MutationObserver(function (e) {
        if (e[0].removedNodes.length && $(e[0].removedNodes[0]).find("#select2-type-results").length) checkType();
    });

    y.observe(document.querySelector('body'), { childList: true });

    $(".calendar-container").on("change", "#filter-type select", (function(e) {
        applyFilter();
    }));

    $(".calendar-container").on("click", ".date-range", (function(e) {
        $(this).hasClass("active") ? $("#filter-type").removeClass("back") : $("#filter-type").addClass("back");
    }));
    $(".calendar-container").on("click", ".show-range", (function(e) {
        e.stopPropagation();
    }));

    function showMoreALL() {
        LOADED = false;

        var selected = $("#format option").filter(function() {
            return $(this).attr("selected") == "selected";
        });

        if (selected.length > 1) {
            format = selected.last().val();
            $("#format").val(format).change();
            console.log('format changed - exist');
        }

        if ($(".releases-append").find("h4").html() == 'No results') {
            $("form#filter-genre").find("select").append($("<option></option>").attr("value", format).text(format));
            $("#format").val(format).change();
            console.log('format changed - not exist');
        }

        format = $("#format option:selected").val();

        addFilter(type);
        showMore(++ID);
    }

    function checkType() {
        var newType = $("#type option:selected").val();
        if (newType != type) {
            type = newType;
            applyFilter();
        }
    }

})();

function showMore(id = ID) {
    if (id != ID) return;
    var url = $(".show-more-calendar").data("url");
    if (!url) { LOADED = true; noResults(); return; }
    var grid_list_toggle = $("body").find(".grid-list-toggle").hasClass("active") ? "list" : "grid";
    $("body").find(".show-more-calendar").parent().remove();

    $.ajax({
        url: url,
        type: "get",
        data: "layout=".concat(grid_list_toggle)
    }).done((function(e) {
        if (id != ID) return;
        var g;
        var type = $("#type option:selected").val();
        switch (grid_list_toggle) {
            case 'grid':
                g = $(e.html).find("a").not(".show-more-calendar");
                if (type) {
                    g.each(function() {
                        if(!$(this).find(".white-label").hasClass(type)) $(this).hide();
                    });
                }
                $(".releases-append div div:first").append(g);
                break;
            case 'list':
                g = $(e.html).find(".book-releases");
                if (type) {
                    g.each(function() {
                        if(!$(this).find(".detail-labels .white-label").hasClass(type)) $(this).hide();
                    });
                }
                $(".releases-append div:first").append(g);
                break;
        }
        $(e.html).find(".show-more-calendar").parent().appendTo( $(".releases-append") );
        //if ($("#type option:selected").val()) applyFilter();
        showMore(id);
    })).fail((function(e) {}));
}

function addFilter(type = '') {
    var format = $("#filter-genre select").val();
    if (format == "" || format == "Physical") {
        var $filter = $("form#filter-genre").clone();
        $filter.attr("id","filter-type");
        $filter.find("label").attr("for","type");
        $filter.find("label").html("type:");
        $filter.find("select").attr("id","type").attr("name","type");
        $filter.find("select").empty();

        var newOptions = {"All" : "",
                          "Novels": "light-novels",
                          "Manga": "manga",
                          "Comics": "comics",
                          "Audio": "audio"};
        if (format == "Physical") delete newOptions.Audio;

        $.each(newOptions, function(key,value) {
            $filter.find("select").append($("<option></option>").attr("value", value).text(key));
        });

        $("form#filter-genre").parent().append($filter);

        if (format == "Physical" && type == 'audio') type = '';
        if (type) $("#type").val(type).change();
    }
}

function applyFilter(type = $("#type option:selected").val()) {
    var grid_list_toggle = $("body").find(".grid-list-toggle").hasClass("active") ? "list" : "grid";
    switch (grid_list_toggle) {
        case 'grid':
            $(".releases-append").find("a").show();
            if (type) {
                $(".releases-append").find("a").each(function() {
                    if(!$(this).find(".white-label").hasClass(type)) $(this).hide();
                });
            }
            break;
        case 'list':
            $(".book-releases").show();
            if (type) {
                $(".book-releases").each(function() {
                    if(!$(this).find(".detail-labels .white-label").hasClass(type)) $(this).hide();
                });
            }
            break;
    }
    if (LOADED) noResults();
}

function noResults() {
    $(".releases-append h4").remove();
    if ( ($(".releases-append a:visible").length == 0) && ($(".book-releases:visible").length == 0) ) {
        $(".releases-append").prepend('<h4 class="heading title-62">No results</h4>');
    }
}