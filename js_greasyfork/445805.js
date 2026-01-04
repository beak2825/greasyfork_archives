// ==UserScript==
// @name         AO3: [Wrangling] Rainbow Tables
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  adds CSS classes to style table rows as a rainbow, and updates dynamically when filters are applied
// @author       escctrl
// @version      6.0
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @match        *://*.archiveofourown.org/tags/search?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445805/AO3%3A%20%5BWrangling%5D%20Rainbow%20Tables.user.js
// @updateURL https://update.greasyfork.org/scripts/445805/AO3%3A%20%5BWrangling%5D%20Rainbow%20Tables.meta.js
// ==/UserScript==
 
// CONFIGURATION
    // choose if you want to use your AO3 skin to define the colors (skin), or if you'll add the css in this script (script)
    // if you use a skin, note that the classes are added to the table rows (tr) and named .rainbow0 through .rainbow5
    const SOURCE = 'script';
 
    // choose if you'd like the rainbow coloring on the wrangling homepage and/or on the bins
    const ONHOMEPAGE = true;
    const ONBINS = true;
    const ONSEARCH = true;
 
    // set the six different background colors here, for example "rgba(255, 21, 164, 0.86)" or "#ff15a4"
    // tip: rgba let's you define the color in order red-green-blue. the fourth number (alpha) is transparency between 0 (transparent) and 1 (opaque)
    const RAINBOW = ["rgba(246,  48,  63, .2)",
                     "rgba(241, 137,   4, .2)",
                     "rgba(253, 221,   0, .2)",
                     "rgba(119, 189,  30, .2)",
                     "rgba(  1, 152, 207, .2)",
                     "rgba(114,  32, 130, .2)" ];
 
    const TEXT = "#000000"; // color of the link text in the table
    const BORDER = "#FFFFFF"; // color of the borders in the table
    const HIGHLIGHT = "#FFFFFF"; // background color of the highlighted row (on mouseover)
 
(function($) {
    'use strict';

    let main = $('#main'); 
	
    // quit script if this page is disabled
    if (ONHOMEPAGE === false && $(main).hasClass('tag_wranglers-show')) return;
    if (ONBINS === false && $(main).hasClass('tags-wrangle')) return;
    if (ONSEARCH === false && $(main).hasClass('tags-search')) return;
 
    if (SOURCE == 'script') {
        var fullCSS = RAINBOW.map((e, i) => ".rainbow"+i+" { background-color: "+e+"; color: inherit !important }" );
 
        $('head').append(`<style type="text/css">
            .assigned thead th, #wrangulator thead th { text-align: center; vertical-align: bottom; }
            .assigned thead, #wrangulator thead, #resulttable thead { border-bottom: 0px; }
            .assigned tbody th { background: transparent !important; border: 1px solid ${BORDER}; vertical-align: middle; padding: 0.2em 0.5em; }
            .assigned tbody td { vertical-align: middle; border: 1px solid ${BORDER}; padding: 0.2em 0.5em; text-align: right; }
            #wrangulator tbody th, #resulttable tbody th { background: transparent !important; border: 1px solid ${BORDER}; vertical-align: middle; }
            #wrangulator tbody td, #resulttable tbody td { vertical-align: middle; border: 1px solid ${BORDER}; }
            .assigned tbody tr:hover, #wrangulator tbody tr:hover, #resulttable tr:hover { background-color: ${HIGHLIGHT}; }
 
            .assigned tbody a, #wrangulator tbody a, #resulttable tbody a,
            .assigned tbody a:hover, #wrangulator tbody a:hover, #resulttable tbody a:hover,
            .assigned tbody a:visited, #wrangulator tbody a:visited, #resulttable tbody a:visited,
            .assigned tbody a:active, #wrangulator tbody a:active, #resulttable tbody a:active {
              color: ${TEXT}; border-bottom: 0; }
            #resulttable tbody a:hover { background-color: unset; }
            ${fullCSS.join(' ')}
        </style>`);
    }
 
    function resetRainbow() {
        $('.assigned tbody tr, #wrangulator tbody tr, #resulttable tbody tr').removeClass('rainbow0 rainbow1 rainbow2 rainbow3 rainbow4 rainbow5');
        $('.assigned tbody tr:visible, #wrangulator tbody tr:visible, #resulttable tbody tr').each( (it, row) => $(row).addClass('rainbow'+it%6) );
    }
 
    if (ONHOMEPAGE === true && $(main).hasClass('tag_wranglers-show')) {
        // add events for dynamic updates of the CSS classes when filters are applied. delegated to allow any script order
        $(document).on('click', 'p:contains(Show only fandoms with) a', resetRainbow); // Standard (doesn't specify a p#id so we have to go by text content)
        $(document).on('click', '#filter-fandoms *', resetRainbow); // Redux
        $(document).on('click', '#media-filter a, #source-filter a, #fandom-filter a, #setup-filter a, #reset-filter a', resetRainbow); // N-in-1
        $(document).on('click', '#sortunwrangled, #sortname, #sortchars, #sortrels, #sortff', resetRainbow); // Sorting by Total Unwrangled
        $(document).on('click', 'p:contains(Show:) a, tr a:contains([Snooze])', resetRainbow); // Snooze fandom buttons/filters
 
        // Search
        $(document).on('keyup', '#fandom_search', resetRainbow);
    }
 
    if (ONBINS === true && $(main).hasClass('tags-wrangle')) {
        // Snooze "Drafts" button is "slow" because it loads a bunch of pages in the background, and needs a little bit of a delay
        // has to use document for delegation because the snooze script removes the button before it bubbles up to #wrangulator (!?!?)
        $(document).on('click', 'a#snooze_drafts', function(e) { setTimeout(resetRainbow, 500); });
        // other snooze buttons/filters are pretty instantaneous
        $('#wrangulator').on('click', 'td[title="snooze"] a, p:contains(Show:) a', function(e) { setTimeout(resetRainbow, 10); } );
    }
    
    if (ONSEARCH === true && $(main).hasClass('tags-search')) {
        // Fetch All Tag Info script still allows some reordering within the results page
        $(document).on('click', '#resulttable thead th', resetRainbow);
    }
 
    $(document).ready(function() {
        // executes on page load for initial coloring
        resetRainbow();
    });
 
})(jQuery);