// ==UserScript==
// @name             MAL Public Score in MangaList
// @version          1.0.3
// @author           Jery 
// @icon             https://www.google.com/s2/favicons?domain=myanimelist.net
// @include          https://myanimelist.net/mangalist/*
// @grant            GM_registerMenuCommand
// @require          http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace        https://greasyfork.org/users/781076
// @description      Adds new column with public score to the MangaList. WARNING! this script only works on Modern Lists, and, not the Classic ones (I think so)
// @description-2    This is a tweaked version of this script : https://greasyfork.org/en/scripts/396023 which could only show the scores in animelist 
// @downloadURL https://update.greasyfork.org/scripts/427909/MAL%20Public%20Score%20in%20MangaList.user.js
// @updateURL https://update.greasyfork.org/scripts/427909/MAL%20Public%20Score%20in%20MangaList.meta.js
// ==/UserScript==
// If u wanna ask me somethin, then u can find me on MAL : https://myanimelist.net/profile/jery_js (just hit the comments!)
// The 4 lines below are for adding 4 clickable buttons under the script in ur extension (like Tampermonkey or violentmonkey)
GM_registerMenuCommand("Show public scores", activate_script, "p");
GM_registerMenuCommand("Refresh public scores", refresh_public_score, "r");
GM_registerMenuCommand("Show oldest public score timestamp", function(){alert("Oldest entry from: " + new Date(1*window.localStorage.getItem("oldest_entry_timestamp")));}, "o");
GM_registerMenuCommand("Toggle manual activation", toggle_manual_activation, "t");

var $ = jQuery;

function activate_script() {
    if (document.getElementsByClassName("data mal_score")[0]) {
        console.log("Script Deactivated: The Mal Score column is already enabled on this list.")
        return
    }
    add_public_score_column();
    make_public_score_column_sortable();
    populate_public_score_column();
}

function refresh_public_score() {
    clear_store();
    populate_public_score_column();
}

function toggle_manual_activation() {
    var is_manual_activation = window.localStorage.getItem("manual_activation");
    if (is_manual_activation == null || is_manual_activation === "false") {
        window.localStorage.setItem("manual_activation", true);
    } else {
        window.localStorage.setItem("manual_activation", false);
    }
}

function clear_store() {
    var store = window.localStorage;
    store.clear();
}

function add_public_score_column() {
    var public_score_column_header = $('<th class="header-title public-score click">Public score</th>');
    $('.header-title.score').before(public_score_column_header);
    $('.list-table tr td.score').before('<td class="data public-score"></td>');
}

function populate_public_score_column() {
    function fetch_top_public_scores(limit) {
        var scores = {};
        $.get( "/topmanga.php?limit=" + limit, function( data ) {
            var scores = $( data ).find(".ranking-list").each(function(){
                var manga_id = $(this).find(".detail a[rel]").attr("href").match(/\/manga\/(\d+)\//)[1];
                var score = $(this).find(".js-top-ranking-score-col .text").text().trim();
                store_public_score(manga_id, score);
            });
        });
    }
    function fetch_top_500_public_scores() {
        var store = window.localStorage;
        if (store.getItem("fetch_top_500") == null) {
            for (var i = 0; i < 10; i++) {
                fetch_top_public_scores(i*50);
            }
            store.setItem("fetch_top_500", true);
        }
    }
    function get_public_score_for_manga(manga_id, set_score_callback) {
        var stored_score = get_stored_public_score(manga_id);
        if (stored_score == null) {
            fetch_public_score_for_manga(manga_id, function (fresh_score) {
                set_score_callback(fresh_score);
            });
        } else {
            set_score_callback(stored_score);
        }
    }
    function get_stored_public_score(manga_id) {
        var store = window.localStorage;
        var oldest_entry_timestamp = store.getItem("oldest_entry_timestamp");
        return store.getItem(manga_id);
    }
    function store_public_score(manga_id, score) {
        var store = window.localStorage;
        if (store.getItem("oldest_entry_timestamp") == null) {
            store.setItem("oldest_entry_timestamp", Date.now());
        }
        return store.setItem(manga_id, score);
    }
    function fetch_public_score_for_manga(manga_id, set_score_callback) {
        $.get( "/manga/" + manga_id, function( data ) {
            var score = $( data ).find(".score").text().trim();
            set_score_callback(score);
            store_public_score(manga_id, score);
        });
    }

    function for_each_public_score_column_cell_do(callback) {
        $('.list-table td.data.public-score').each(function(){
            var cell = $(this);
            var url = cell.siblings('.title').find('a').attr('href');
            // "/manga/123/title" => "123"
            var manga_id = url.match(/\/manga\/(\d+)/)[1];
            callback(cell, manga_id);
        });
    }

    fetch_top_500_public_scores();

    for_each_public_score_column_cell_do(function(cell, manga_id){
        get_public_score_for_manga(manga_id, function (score) {
            cell.html('<a href="#" class="link">'+score+'</a>');
        });
    });

}

function make_public_score_column_sortable() {
    function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
    function comparer(index) {
        return function(a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index)
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
        }
    }

    var table_header = $('.list-table th');
    // makes cursor change so that column appears to be clickable
    table_header.contents() .filter(function() { return this.nodeType == Node.TEXT_NODE; }).wrap('<a href="#"></a>');
    table_header.click(function() {
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        // default sort order is descending
        if (this.asc){
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++){
            table.append(rows[i]);
        }
    });
}

$(function(){
    var is_manual_activation = window.localStorage.getItem("manual_activation");
    console.log("is_manual_activation: " + is_manual_activation);
    if (is_manual_activation == null || is_manual_activation === "false") {
        console.log("script is activated!");
        activate_script();
    }
});