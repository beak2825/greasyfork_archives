// ==UserScript==
// @name             MAL Public Score (Manga & Anime lists version)
// @version          1.0.0
// @description      Modified version of the last "MAL Public Score" which has been enhanced to work with both MyAnimeList (MAL) anime and manga lists
// @author           Jeb32_%
// @icon             https://www.google.com/s2/favicons?domain=myanimelist.net
// @match            *://myanimelist.net/animelist/*
// @match            *://myanimelist.net/mangalist/*
// @grant            GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1265868
// @downloadURL https://update.greasyfork.org/scripts/488116/MAL%20Public%20Score%20%28Manga%20%20Anime%20lists%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488116/MAL%20Public%20Score%20%28Manga%20%20Anime%20lists%20version%29.meta.js
// ==/UserScript==
GM_registerMenuCommand("Show public scores", activate_script, "p");
GM_registerMenuCommand("Refresh public scores", refresh_public_score, "r");
GM_registerMenuCommand("Show oldest public score timestamp", function () { alert("Oldest entry date:\n" + new Date(1 * window.localStorage.getItem("oldest_entry_timestamp"))); }, "o");
GM_registerMenuCommand("Toggle manual activation", toggle_manual_activation, "t");

// planed features:
// full rewrite for improved readability, maintainability, and future-proofing
// webui toggle for manual activation, simplifying visualization without console access
// additional score sites and data scraping from their apis (?)
// implementation of a settings page for toggling features, such as choosing score sites
// fix the limitation on adding more than 300 scores by finding a proper bulk search method (more research required)

let $ = jQuery;
let store = window.localStorage;
let listType;
let regex = /\/(anime|manga)\/(\d+)/; // the previous one only had "manga" and now it has been modified to have a global scope for easier editing

function activate_script() {
    if (document.getElementsByClassName("header-title public-score")[0]) {
        log("the script is already enabled on this list!");
        return;
    }
    check_list_type();
    add_public_score_column();
    make_public_score_column_sortable();
    populate_public_score_column();
}

function check_list_type() {
    let siteType = document.location.pathname.split("/")[1]; // "/animelist/username" => "animelist"
    listType = siteType.replace("list", "");
}

function log(text) {
    console.log(`%c[MAL Public Score]\x1b[0m ${text}`, "color: #0080ff");
}

function refresh_public_score() {
    clear_store();
    populate_public_score_column();
}

function toggle_manual_activation() {
    let manual_activation = !(store.getItem("manual_activation") === "true");
    store.setItem("manual_activation", manual_activation);
    log(`manual_activation changed to ${manual_activation}`);
}

function clear_store() {
    store.clear();
}

function add_public_score_column() {
    let public_score_column_header = $("<th class='header-title public-score click'>Public score</th>");
    $(".header-title.score").before(public_score_column_header);
    $(".list-table tr td.score").before("<td class='data public-score'></td>");
}

function populate_public_score_column() {
    function fetch_top_public_scores(limit) {
        let scores = {};
        $.get(`/top${listType}.php?limit=` + limit, function (data) {
            scores = $(data).find(".ranking-list").each(function () {
                let id = $(this).find(".detail a[rel]").attr("href").match(regex)[1];
                let score = $(this).find(".js-top-ranking-score-col .text").text().trim();
                store_public_score(id, score);
            });
        });
    }
    function fetch_top_500_public_scores() {
        if (store.getItem("fetch_top_500") == null) {
            for (let i = 0; i < 10; i++) {
                fetch_top_public_scores(i * 50);
            }
            store.setItem("fetch_top_500", true);
        }
    }
    function get_public_score(id, set_score_callback) {
        let stored_score = get_stored_public_score(id);
        if (stored_score == null) {
            fetch_public_score(id, function (fresh_score) {
                set_score_callback(fresh_score);
            });
        } else {
            set_score_callback(stored_score);
        }
    }
    function get_stored_public_score(id) {
        return store.getItem(id);
    }
    function store_public_score(id, score) {

        if (store.getItem("oldest_entry_timestamp") == null) {
            store.setItem("oldest_entry_timestamp", Date.now());
        }
        return store.setItem(id, score);
    }
    function fetch_public_score(id, set_score_callback) {
        $.get(`/${listType}/` + id, function (data) {
            let score = $(data).find(".score").text().trim();
            set_score_callback(score);
            store_public_score(id, score);
        });
    }

    function for_each_public_score_column_cell_do(callback) {
        $(".list-table td.data.public-score").each(function () {
            let cell = $(this);
            let url = cell.siblings(".title").find("a").attr("href");
            let id = url.match(regex)[2]; // "/manga/123/title" => "123"
            callback(cell, id);
        });
    }

    fetch_top_500_public_scores();

    for_each_public_score_column_cell_do(function (cell, id) {
        get_public_score(id, function (score) {
            cell.html("<a href='#' class='link'>" + score + "</a>");
        });
    });

}

function make_public_score_column_sortable() {
    function getCellValue(row, index) { return $(row).children("td").eq(index).text(); }
    function comparer(index) {
        return function (a, b) {
            let valA = getCellValue(a, index),
                valB = getCellValue(b, index);
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
        };
    }

    let table_header = $(".list-table th");
    // makes cursor change so that column appears to be clickable
    table_header.contents().filter(function () { return this.nodeType == Node.TEXT_NODE; }).wrap("<a href='#'></a>");
    table_header.click(function () {
        let table = $(this).parents("table").eq(0);
        let rows = table.find("tr:gt(0)").toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        // default sort order is descending
        if (this.asc) {
            rows = rows.reverse();
        }
        for (let i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }
    });
}

$(function () {
    let manual_activation = window.localStorage.getItem("manual_activation");
    if (manual_activation == null || manual_activation === "false") {
        log("script activated!");
        activate_script();
    }
    log(`manual_activation: ${manual_activation}`);
});