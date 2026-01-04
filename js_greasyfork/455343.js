// ==UserScript==
// @name         AO3 Publication date
// @namespace    https://greasyfork.org/en/scripts/455343/
// @version      2.1
// @description  Adds AO3 publication date i.e. date of publication of first chapter to AO3 search/sort page
// @author       MM
// @match        https://archiveofourown.org/tags/*
// @match        https://archiveofourown.org/works?commit=Sort+and+Filter*
// @match        https://archiveofourown.org/works?utf8=%E2%9C%93&commit=Sort+and+Filter*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/455343/AO3%20Publication%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/455343/AO3%20Publication%20date.meta.js
// ==/UserScript==




(function ao3firstpubdate() {
    'use strict';

    // Define the HTML template for the date display with a span for styling
    var html_date_heading = '&nbsp;&nbsp;&nbsp;<span class="date-published" style="font-size: 12px; color: #555; font-family: monospace;"> Date Published: <strong><span style="font-size: 14px; font-family: inherit;">';

    // Check for story headings in the index page
    if (jQuery('.header h4.heading').length) {
        jQuery('.header h4.heading').each(function() {
            var sStoryPath = jQuery(this).find('a').first().attr('href');
            var oHeader = this;

            // Check if link is for an individual work
            var aMatch = sStoryPath.match(/works\/(\d+)/);
            if (aMatch !== null) {
                var iStoryId = aMatch[1];

                // Fetch the work page
                jQuery.get('https://archiveofourown.org/works/' + iStoryId, function(oData) {
                    // Extract and reformat the publication date
                    var rawDate = jQuery(oData).find('dd.published').text().trim();
                    if (rawDate) {
                        // Reformat the date to '05 Oct 2020'
                        var formattedDate = new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }).format(new Date(rawDate));

                        // Append the formatted date to the story header
                        jQuery(oHeader).append(html_date_heading + '&nbsp;' +  formattedDate + '</span></strong></span>&nbsp;');
                    }
                }).fail(function() {
                    console.log('Failed to fetch publication date for story ID:', iStoryId);
                });
            }
        });
    }

})();



