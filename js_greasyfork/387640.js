// ==UserScript==
// @name         MDL Updates
// @namespace    http://hermanfassett.me
// @version      0.1
// @description  Small changes to mydramalist
// @author       You
// @match        *://mydramalist.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387640/MDL%20Updates.user.js
// @updateURL https://update.greasyfork.org/scripts/387640/MDL%20Updates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.airing.not { background-color: #f0ad4e !important; }');

    // Get api token
    function getToken() {
        var t = window.document.cookie.match("(^|;)\\s*jl_sess\\s*=\\s*([^;]*)\\s*(;|$)");
        return t ? decodeURIComponent(t[2]) : null
    }

    // Add a status (upcoming, airing, aired) column to watchlists and add upcoming tag in title column
    function addStatusColumnToWatchlist() {
        $("thead").each(function(index) {
            let tr = $(this).find("tr");
            if (tr) {
                let lastLink = tr.children().last().find("a").attr("href");
                let newLink = lastLink.replace(/sortTable\((\d+),(\d+)\)/, ($0, $1, $2) => `sortTable(${(parseInt($1)+1)},${$2})`);
                tr.append(`<th width="85" class="text-center"><a href="${newLink}">Status <i class="fa fa-caret-down"></i></a></th>`);
            }
        });

        $("tr[id]").each(function() {
            let tr = $(this);
            let id = $(this).attr("id").substring(2);
            let td = $(this).find("td").first();
            $.getJSON(`/v1/users/watchaction/${id}?token=${getToken()}`, function(json) {
                if (json.title.released === false) {
                    td.append(`<span class="not airing">upcoming</span>`);
                }
                let lastSort = tr.children().last().attr("class");
                let newSort = lastSort.replace(/sort(\d+)/, ($0, $1) => `sort${parseInt($1)+1}`);
                console.log(lastSort);
                tr.append(`<td class="${newSort}" width="50" abbr="${json.title.ended ? 2 : json.title.released ? 1 : 0}">${json.title.ended ? "Aired" : json.title.released ? "Airing" : "Upcoming"}</td>`);
            });
        });
    }

    if (/\/dramalist\//.test(window.location.pathname)) {
        addStatusColumnToWatchlist();
    }
})();