// ==UserScript==
// @name     MAL Public Score in Animelist
// @version  5
// @include  https://myanimelist.net/animelist/*
// @grant    GM_registerMenuCommand
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/440979
// @description Adds new column with public score to the animelist
// @downloadURL https://update.greasyfork.org/scripts/396023/MAL%20Public%20Score%20in%20Animelist.user.js
// @updateURL https://update.greasyfork.org/scripts/396023/MAL%20Public%20Score%20in%20Animelist.meta.js
// ==/UserScript==

/* Version 2 - Changes
   1. Public score column is only added and populated when the large table header is being clicked, e.g. "Plan to Watch"
   2. Public score is being cached locally to reduce number of requests
   3. Public score can be completely refreshed by clicking the large table header again, when the column "Public score" is already visible
   4. All top 500 public scores will always be loaded with 10 requests
   Version 3 - Changes
   1. Add context menu entries instead of relying on large header table being visible
   Version 4 - Changes
   1. Add context menu entry for manually enabling the script instead of always load public scores. Scores are loaded automatically until the menu entry is used
   Version 5 - Changes
   1. Bugfix for manual activiation toggling
*/

GM_registerMenuCommand("Show public scores", activate_script, "p");
GM_registerMenuCommand("Refresh public scores", refresh_public_score, "r");
GM_registerMenuCommand("Show oldest public score timestamp", function(){alert("Oldest entry from: " + new Date(1*window.localStorage.getItem("oldest_entry_timestamp")));}, "o");
GM_registerMenuCommand("Toggle manual activation", toggle_manual_activation, "t");

var $ = jQuery;

function activate_script() {
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
        $.get( "/topanime.php?limit=" + limit, function( data ) {
            var scores = $( data ).find(".ranking-list").each(function(){
                var anime_id = $(this).find(".detail a[rel]").attr("href").match(/\/anime\/(\d+)\//)[1];
                var score = $(this).find(".js-top-ranking-score-col .text").text().trim();
                store_public_score(anime_id, score);
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
    function get_public_score_for_anime(anime_id, set_score_callback) {
        var stored_score = get_stored_public_score(anime_id);
        if (stored_score == null) {
            fetch_public_score_for_anime(anime_id, function (fresh_score) {
                set_score_callback(fresh_score);
            });
        } else {
            set_score_callback(stored_score);
        }
    }
    function get_stored_public_score(anime_id) {
        var store = window.localStorage;
        var oldest_entry_timestamp = store.getItem("oldest_entry_timestamp");
        return store.getItem(anime_id);
    }
    function store_public_score(anime_id, score) {
        var store = window.localStorage;
        if (store.getItem("oldest_entry_timestamp") == null) {
            store.setItem("oldest_entry_timestamp", Date.now());
        }
        return store.setItem(anime_id, score);
    }
    function fetch_public_score_for_anime(anime_id, set_score_callback) {
        $.get( "/anime/" + anime_id, function( data ) {
            var score = $( data ).find(".score").text().trim();
            set_score_callback(score);
            store_public_score(anime_id, score);
        });
    }

    function for_each_public_score_column_cell_do(callback) {
        $('.list-table td.data.public-score').each(function(){
            var cell = $(this);
            var url = cell.siblings('.title').find('a').attr('href');
            // "/anime/123/title" => "123"
            var anime_id = url.match(/\/anime\/(\d+)/)[1];
            callback(cell, anime_id);
        });
    }

    fetch_top_500_public_scores();

    for_each_public_score_column_cell_do(function(cell, anime_id){
        get_public_score_for_anime(anime_id, function (score) {
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