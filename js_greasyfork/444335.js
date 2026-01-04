// ==UserScript==
// @name         AO3: [Wrangling] Highlight Bins with Overdue Tags
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Highlight a bin on the Wrangling Home if the oldest tag in it is overdue
// @author       escctrl
// @version      2.0
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444335/AO3%3A%20%5BWrangling%5D%20Highlight%20Bins%20with%20Overdue%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/444335/AO3%3A%20%5BWrangling%5D%20Highlight%20Bins%20with%20Overdue%20Tags.meta.js
// ==/UserScript==

// ******* CONFIGURATION OPTIONS *******

// speed in which the bins are checked (in seconds)
// set this number higher if you run into Retry Later errors often
const interval = 3;

// add here how you'd like the link and/or the cell to appear, e.g. bold text on the link, yellow cell background color
const css_link = `font-weight: bold; position: relative; z-index: 1`;
const css_link_before = `background-color: #ffdf35; content: ""; position: absolute; width: calc(100% + 4px); height: 60%; right: -2px; bottom: 2px; z-index: -1; transform: rotate(-8deg);`;
const css_cell = "";

// ********* END CONFIGURATION *********

(function($) {
    'use strict';

    // some CSS to make this look palatable
    $('head').append(`<style type="text/css">#age-check { font-size: 80%; padding: 0.2em; } #age-check[disabled] { opacity: 80%; }
    td a.has_agedout { ${css_link} } td a.has_agedout::before { ${css_link_before} } td.has_agedout { ${css_cell} }</style>`);

    // add a button to start checking
    $('.assigned table thead tr:nth-child(1) th:nth-child(3)').append(
        ` <button id='age-check' type='button'><span id='age-status'>Check Age</span><span id='age-progress'></span></button>`);
    $('#age-check').on('click', () => { startCheck(); });

    let maxage = createDate(0, -1, 0); // one month ago

    // load sessionStorage (remember what we've checked while this tab is open)
    let agedout_stored = JSON.parse(sessionStorage.getItem('overdue_bin')) || [];
    
    // load snoozed tags in case the script is installed
    let snoozed = new Map(JSON.parse(localStorage.getItem('tags_saved_date_map') || "[]"));
    
    $('.assigned tbody td[title~="unwrangled"] a').each((i, a) => {
        // build the same "FANDOM/TAGTYPE" text that's stored for easy comparison
        let bin = $(a).attr('href').match(/tags\/(.*?)\/wrangle.*show=(characters|relationships|freeforms)/i);
        bin = bin[1] + '/' + bin[2];
        if (agedout_stored.includes(bin)) {
            // show those as outdated already on pageload (will be overwritten by later checks on buttonclick)
            $(a).addClass('has_agedout');
            $(a).parent().addClass('has_agedout');
        }
    });

    function startCheck() {
        // select all the bins with unwrangled tags
        let bins = $('.assigned tbody tr:visible td[title~="unwrangled"] a').toArray();

        // set a loading indicator to user
        $('#age-check').attr('disabled', true);
        $('#age-status').text('Checking ');
        $('#age-progress').text(bins.length+' bins');

        performCheck(bins);
    }

    function performCheck(bins) {
        setTimeout(() => {
            // bins is an array of <a> Nodes
            $('#age-progress').text(bins.length+' bins');

            // build the URL to check (oldest tag on first page at the top)
            let link = new URL($(bins[0]).prop('href'));
            let xhrlink = link.protocol + '//' + link.hostname + link.pathname +
                `?show=${link.searchParams.get('show')}&status=unwrangled&sort_column=created_at&sort_direction=ASC`;

            // check the bin for old tags
            $.get(xhrlink, () => {}).done((response) => {

                // find the first tag that isn't snoozed and check its age
                let rows = $(response).find('#wrangulator tbody tr');
                for (let row of rows) {
                    let tagName = $(row).find('th label').text();
                    if (snoozed.has(tagName)) continue; // skip this tag if it's been snoozed and check the next-oldest instead
                    else {
                        let tagCreated = new Date($(row).find('td[title="created"]').text());
                        setAgeCSS(bins[0], (tagCreated < maxage));
                        break; // this was the oldest un-snoozed tag, don't need to look any further
                    }
                }

                bins.shift(); // removes the first node we just checked

                if (bins.length == 0) finishCheck('Recheck Age'); // if we're done, tell so
                else performCheck(bins); // start next loop

            }).fail(function(data, textStatus, xhr) {
                //This shows status code eg. 429
                console.log("Bins AgeCheck: bin "+xhrlink+" error", data.status);
                finishCheck('Error :( Try Again');
            });

        }, interval * 1000, bins);
    }

    function finishCheck(btnText) {
        // update the button appropriately
        $('#age-check').attr('disabled', false);
        $('#age-status').text(btnText);
        $('#age-progress').text('');

        // save the latest checked list for the moment (while the tab remains open)
        let outdated_list = [];
        $('table a.has_agedout').each((i, e) => {
            let link = $(e).attr('href').match(/tags\/(.*?)\/wrangle.*show=(characters|relationships|freeforms)/i);
            link = link[1] + '/' + link[2];
            outdated_list.push(link);
        });
        // stores an array of "FANDOM/TAGTYPE" strings
        sessionStorage.setItem('overdue_bin', JSON.stringify(outdated_list));
    }

    function setAgeCSS(a, outdated) {
        var ageClass = (outdated) ? 'has_agedout' : 'not_agedout';

        // reset CSS classes on <a> and on its parent <td>, then set the class we actually want
        $(a).removeClass('has_agedout not_agedout').addClass(ageClass);
        $(a).parent().removeClass('has_agedout not_agedout').addClass(ageClass);
    }

    // migration: removing old Storage that won't be used anymore
    localStorage.removeItem('ao3jail');
    localStorage.removeItem('agecheck_old');
    localStorage.removeItem('agecheck_new');


})(jQuery);

function createDate(years, months, days) {
    let date = new Date();
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date;
}