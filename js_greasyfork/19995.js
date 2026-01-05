// ==UserScript==
// @name         Filter Ideabox
// @namespace    pxgamer
// @version      0.3
// @description  Sort ideabox ideas by different methods
// @author       pxgamer
// @include      *kat.cr/ideabox/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19995/Filter%20Ideabox.user.js
// @updateURL https://update.greasyfork.org/scripts/19995/Filter%20Ideabox.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    var rows = [];

    $('.buttonsline.floatleft').append('<select id="sortIdeas-select" style="letter-spacing: 0px; width: 220px !important;"><option value="all">Show all</option><option value="az">Sort Alphabetically (A-Z)</option><option value="no">Sort by Age (Newest to Oldest)</option><option value="views">Sort by Views (High to Low)</option></select> <button class="siteButton bigButton" id="sortIdeas"><span>Sort</span></button>');

    $('.ideaBox').each(function(){
        var html  = $(this).html();
        var title = $('.ideaBoxBody h3 a', $(this)).text();
        var age   = $('.ideaBoxBody div.lightgrey:last', $(this)).html().split('</span> ')[6].trim();
        var views = parseInt($('.ideaBoxBody div.lightgrey:last', $(this)).html().split('</span> ')[2].split(' views')[0], 10);
        rows.push({"title":title,"age":age,"views":views,"html":html});
    });

    console.log(rows);
    $('#sortIdeas').on('click', function() {
        var ideaSortType = $('#sortIdeas-select').val();

        switch (ideaSortType) {
            case 'all':
                $('div.ideaBox').show();
                break;
            case 'az':    // Sort alphabetically (A-Z)
                $('div.ideaBox').show();
                sortIdeas('title', 'desc');
                break;
            case 'no':    // Sort by age (Newest to Oldest)
                $('div.ideaBox').show();
                sortIdeas('age', 'desc');
                break;
            case 'views': // Sort by views (High to Low)
                $('div.ideaBox').show();
                sortIdeas('views', 'desc');
                break;
            default:
                $('div.ideaBox').show();
                break;
        }
    });

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if (typeof x == "string") {
                x = x.toLowerCase();
                y = y.toLowerCase();
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function sortIdeas(sortName, sortType) {
        sortByKey(rows, sortName);
        if (sortName !== 'views') { rows.reverse(); }
        $('div.ideaBox').remove();
        for (var i=0;i<rows.length;i++) {
            $('.buttonsline.floatleft').after('<div class="ideaBox">'+rows[i].html+'</div>');
        }

    }
})();
