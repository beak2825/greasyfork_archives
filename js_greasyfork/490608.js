// ==UserScript==
// @name         AO3: [Wrangling] Empty Bin links to Previous Page
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      1.1
// @description  adds a button to the previous page, if there are no more tags on this page
// @author       escctrl
// @license      MIT
// @match        https://archiveofourown.org/tags/*/wrangle?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490608/AO3%3A%20%5BWrangling%5D%20Empty%20Bin%20links%20to%20Previous%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/490608/AO3%3A%20%5BWrangling%5D%20Empty%20Bin%20links%20to%20Previous%20Page.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // if there are no tags to be wrangled on this page
    if (!$('#main.wrangle-tags form#wrangulator').length) {

        let search = new URLSearchParams(window.location.search);
        let page = parseInt(search.get('page')) || 0;

        // if we're not on the first page, create a button to jump to the previous page
        if (page > 1) {
            search.set('page', page-1);
            $('.notes')
                .text($('.notes').text().replace(/(.*tags) (in.*)/i, "$1 on page "+page+" $2"))
                .after(`<p><a href="${window.location.pathname}?${search.toString()}" class="action">Go to Page ${page-1}</a></p>`);
        }
    }

})(jQuery);