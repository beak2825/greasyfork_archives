// ==UserScript==
// @name         AO3: [Wrangling] Sort Unwrangled Bin Links by Tag Age
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  change the Unwrangled bin links on the Wrangling Home page to sort by tag creation date
// @author       escctrl
// @version      1.2
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445803/AO3%3A%20%5BWrangling%5D%20Sort%20Unwrangled%20Bin%20Links%20by%20Tag%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/445803/AO3%3A%20%5BWrangling%5D%20Sort%20Unwrangled%20Bin%20Links%20by%20Tag%20Age.meta.js
// ==/UserScript==

// CONFIGURATION OPTION
    // The bins will sort tags by age. Which direction should the bins sort, and on which page do you want to start wrangling?
    //   "oldest first" = old -> new, go to the oldest tags on page 1
    //   "oldest last"  = new -> old, go to the oldest tags on the last page
    //   "newest first" = new -> old, go to the newest tags on page 1
    //   "newest last"  = old -> new, go to the newest tags on the last page
    const url_mode = "newest first";

(function($) {
    'use strict';

    // loop through the unwrangled bins
    $('.assigned tbody tr td[title~="unwrangled"] a').each(function() {

        let link = new URL($(this).prop('href'));
        let params = new URLSearchParams(link.search);

        params.set('sort_column', 'created_at');

        if (url_mode == "oldest first" || url_mode == "newest last") params.set('sort_direction', 'ASC');
        else params.set('sort_direction', 'DESC');

        if (url_mode.includes('first')) params.set('page', '1');
        else params.set('page', Math.ceil(parseInt($(this).text(), 10)/20).toString()); // some math to find the last page in a bin

        // status=X has to be the last parameter in the URL for compatibility with other scripts
        params.delete('status');
        params.append('status', 'unwrangled');

        // create the new URL and set it on the <a>
        link.search = "?" + params.toString();
        $(this).prop('href', link.toString());
    });
})(jQuery);