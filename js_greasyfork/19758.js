// ==UserScript==
// @name         Filter Requests by Category
// @namespace    pxgamer
// @version      0.3
// @description  Adds a dropdown to filter the requests search by category.
// @author       pxgamer
// @include      *kat.cr/request/search/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/19758/Filter%20Requests%20by%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/19758/Filter%20Requests%20by%20Category.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Allows you to save your last used value over tabs.
    var saveVal = false;

    $('.buttonsline.floatleft').append(' <select class="sortReqsOpt" style="vertical-align: middle;letter-spacing: 0px; width: 160px !important;"><option value="All">All</option><option value="Movies">Movies</option><option value="TV">TV</option><option value="Music">Music</option><option value="Games">Games</option><option value="Applications">Applications</option><option value="Books">Books</option><option value="Anime">Anime</option><option value="Other">Other</option><option value="XXX">XXX</option><option value="Unassigned">Unassigned</option></select> <button class="siteButton bigButton sortReqs">Filter</button>');

    $('.sortReqs').on('click', function() {
        $('.request-item.ideaBox').show();
        GM_setValue('filterReqType', $('.sortReqsOpt').val());
        if ($('.sortReqsOpt').val() != 'All') {
            $('h6.lightgrey a[href^="/request/popular/"]').each(function() {
                if ($(this).text() != $('.sortReqsOpt').val()) {
                    $(this).parent().parent().parent().hide();
                }
            });
        }
    });

    if (saveVal) {
        var fType = GM_getValue('filterReqType', 'All');
        $('.request-item.ideaBox').show();
        if (fType != 'All') {
            $('h6.lightgrey a[href^="/request/popular/"]').each(function() {
                if ($(this).text() != fType) {
                    $(this).parent().parent().parent().hide();
                }
            });
        }
    }
})();
