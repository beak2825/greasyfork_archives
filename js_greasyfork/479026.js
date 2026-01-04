// ==UserScript==
// @name         AO3: Use Arrow-Keys to Navigate
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      2.0
// @description  use the left/right arrow keys to jump between pages
// @author       escctrl
// @match        https://*.archiveofourown.org/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479026/AO3%3A%20Use%20Arrow-Keys%20to%20Navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/479026/AO3%3A%20Use%20Arrow-Keys%20to%20Navigate.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // this uses the first of whichever is encountered:
    // (A) the "jump to page" links at the top of lists, like on works/bookmarks listings, tag search results, etc
    // (B) then the chapters in a work
    // (C) and finally the works in a series
    // meaning that if you're on chapter 1 of work #3 in a series, pressing the left-arrow key will take you to work #2 in the series
    // if a work is in multiple series, it's not quite reliable because it will use the first one that shows up in the metadata
    let page_prev = $('.pagination .previous a, .work.navigation .chapter.previous a, .work.meta .series a.previous');
    let page_next = $('.pagination .next a, .work.navigation .chapter.next a, .work.meta .series a.next');

    // if this is a bin and we're on a page without tags
    if ($('#main').hasClass('tags-wrangle') && $('#wrangulator').length == 0) {
        let search = new URLSearchParams(window.location.search);
        let page = parseInt(search.get('page')) || 0;

        // if we're not on the first page, create a button to jump to the previous page
        if (page > 1) {
            search.set('page', page-1);
            $('.notes')
                .text($('.notes').text().replace(/(.*tags) (in.*)/i, "$1 on page "+page+" $2"))
                .after(`<p><a href="${window.location.pathname}?${search.toString()}" class="action">Go to Page ${page-1}</a></p>`);
            page_prev = $('.notes ~ p a');
        }
    }

    $(document).keydown(function(event){
        var key = event.which;
        // don't do anything if we're holding down ctrl/shift/alt as well, as we might be highlighting text
        if (event.ctrlKey || event.shiftKey || event.altKey) return;
        // don't do anything if we're inside a textarea or textfield where the cursor might need to move left/right
        if (event.target.nodeName.toUpperCase() == "TEXTAREA" || event.target.nodeName.toUpperCase() == "INPUT") return;
        switch(key) {
            case 37: // key left
                if (page_prev.length > 0) window.location.assign(page_prev[0].href);
                break;
            case 39: // key right
                if (page_next.length > 0) window.location.assign(page_next[0].href);
                break;
            default:
                break;
        }
    });

})(jQuery);