// ==UserScript==
// @name         AO3: [Wrangling] Mark Co- and Solo-Wrangled Fandoms
// @author       escctrl
// @description  On your wrangling homepage, mark whether the fandoms are co- or solo-wrangled. Refreshes once a month.
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      4.1
// @license      MIT
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475525/AO3%3A%20%5BWrangling%5D%20Mark%20Co-%20and%20Solo-Wrangled%20Fandoms.user.js
// @updateURL https://update.greasyfork.org/scripts/475525/AO3%3A%20%5BWrangling%5D%20Mark%20Co-%20and%20Solo-Wrangled%20Fandoms.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery */

/****************** CONFIGURATION ******************/

// set this to true if you don't want to see the icon indicating co/solo wrangled fandoms
// filtering would still work, even if the icon is hidden
const HIDE_MARKERS = false;

// supervisors: change these if you only want to use this script to help during the trainee checkins
const ENABLE_ON_OTHER_USERS = false; // true = enables a button to check cowrangling on other users' wrangling homepages (not stored)
const ENABLE_ON_MY_PAGE = true; // false = disables the script on your own wrangling homepage


(function($) {
    'use strict';

    if (!ENABLE_ON_MY_PAGE) {
        // if you want to laugh: "aia" stands for "am i alone" wrangling this fandom?
        localStorage.removeItem("aia_refdate");
        localStorage.removeItem("aia_ref");
    }

    // Am I looking at my own page?
    let MYOWNPAGE = window.location.pathname.match(/\/([^/]+)\/?$/i)[1] === $('#greeting').find('>ul.user.navigation>li:first-of-type>a')[0].innerText.match(/Hi, (.+)!/i)[1];

    const title = { 'co': "co-wrangled fandom", 'solo': "solo-wrangled fandom", 'load': "fandom wranglers loading", 'dunno': "fandom wranglers not yet checked" };
    const icons = { // icon SVGs from https://heroicons.com (MIT license Copyright (c) Tailwind Labs, Inc. https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
        'co':     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" fill="currentColor"><title>${title.co}</title><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" /></svg>`,
        'solo':   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" fill="none" stroke-width="1.5" stroke="currentColor"><title>${title.solo}</title><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>`,
        'load':   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" fill="none" stroke-width="1.5" stroke="currentColor"><title>${title.load}</title><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`,
        'dunno':  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" fill="none" stroke-width="1.5" stroke="currentColor"><title>${title.dunno}</title><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>`,
        'button': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`
    };

    $("head").append(`<style type="text/css"> .aia-check { display: inline-block; width: 1em; height: 1em; vertical-align: -0.125em;
            text-align: center; padding-right: 0.2em; }
            #aia-start { font-size: 80%; display: inline-block; }</style>`);

    // if this is wrangler's own page, add the button for forcing a refresh and immediately start the process as the page loads
    if (MYOWNPAGE && ENABLE_ON_MY_PAGE) {
        $('.assigned thead tr:first-of-type th:first-of-type').append(` <button id="aia-start" title="Reload markers for co/solo-wrangled fandoms"><span class="aia-check">${icons.button}</span> Reload</button> `);
        $('#aia-start').on("click", forceRefresh);
        fullPageReload();
    }
    // on other people's pages, add a button to start the check
    else if (!MYOWNPAGE && ENABLE_ON_OTHER_USERS) {
        $('.assigned thead tr:first-of-type th:first-of-type').append(` <button id="aia-start" title="Load markers for co/solo-wrangled fandoms"><span class="aia-check">${icons.button}</span> Load</button> `);
        $('#aia-start').on("click", fullPageReload);
    }

    function forceRefresh() {
        localStorage.removeItem("aia_ref");
        fullPageReload();
    }

    async function fullPageReload() {
        const fandomList = $('.assigned tbody tr th a'); // the full list of fandoms
        let fandomRef = new Map(); // here we'll build/load the reference list of fandoms and co-wrangling status

        // markers initiation
        $(fandomList).parent().find('.aia-check').remove();
        $(fandomList).before(`<span class="aia-check" data-aia="tba" ${ HIDE_MARKERS ? ' style="display: none;"' : "" }>${icons.load}</span>`);

        if (MYOWNPAGE) {
            // check if data is still recent enough
            let stored_date = new Date(localStorage.getItem("aia_refdate") || '1970'); // the date when the storage was last refreshed
            let compare_date = createDate(0, -1, 0); // a month before
            if (stored_date > compare_date) {
                fandomRef = new Map(JSON.parse(localStorage.getItem("aia_ref")));

                // update all the fandoms we already found in the Map
                $(fandomList).each((i, f) => { if (fandomRef.has(f.innerText)) writeMarker(f, fandomRef.get(f.innerText)); });
            }
            // if there never was one or it's outdated, we will start refreshing all the fandoms since fandomRef stayed empty. we can set the new date for the next check
            // gotta avoid setting it fresh any time a new fandom is added - old fandoms might then never refresh
            else localStorage.setItem('aia_refdate', new Date());
        }
        // if not on own page or data outdated, the fandomRef Map remains empty

        // we loop over those fandoms whose data-aia hasn't been set to "done" yet
        let remFandoms = $(fandomList).filter((i, f) => $(f).parent().find('.aia-check').attr('data-aia') === "tba").toArray();
        for (let f of remFandoms) {
            let res = await loadWranglers(f);

            if (res === "failed") { // if there was an error (like retry later)
                // set this and all remaining to dunno ?
                $(fandomList).filter((ir, rem) => $(rem).parent().find('.aia-check').attr('data-aia') === "tba").each((ir, rem) => writeMarker(rem, 'dunno'));
                return false; // stop the rest of the each() loop
            }
            else { // success returns res == "co" or res == "solo"
                fandomRef.set(f.innerText, res);
                if (MYOWNPAGE) localStorage.setItem('aia_ref', JSON.stringify(Array.from(fandomRef.entries())));
                writeMarker(f, res);
                await waitforXSeconds(2); // increase this number if you run into a lot of retry later's
            }
        }
    }

    function loadWranglers(a) {

        // turn the url from a /wrangle into an /edit and load the page
        let URI = $(a).prop('href').slice(0, -7);
        URI = URI + (!URI.endsWith("/") ? "/edit" : "edit");

        return new Promise((resolve) => {
            let xhr = $.ajax({url: URI, type: 'GET'})
            .fail(function(xhr, status) {
                console.log(`Error:`, status);
                resolve("failed");
            }).done(function(response) {
                // count the wranglers: pick the correct field in the form containing the assigned wranglers
                let assignedWranglers = $(response).find('#tag_name').parent().parent().find('dt').filter((ix, el) => el.childNodes[0].nodeType === 3 && el.childNodes[0].textContent.trim() === "Wranglers" );
                assignedWranglers = (assignedWranglers.next().text().indexOf(',') === -1) ? "solo" : "co"; // if there's a comma (multiple wranglers) this is co-wrangled
                resolve(assignedWranglers);
            });
        });
    }

    // update the marker with the appropriate icon
    function writeMarker(f, status) {

        // Redux uses "shared-", n-in-1 uses "co-" as prefixes (but both use "solo-")
        let cofilter = ($('p#fandom-filter').length > 0) ? "co-" : "shared-";

        // change the CSS classes for filters so they match the co/solo info this script has
        let classList = $(f).parent().parent().prop("classList");
        if (status === "solo") {
            for (let c of classList) {
                if (c.startsWith(cofilter)) classList.replace(c, c.replace(cofilter, 'solo-'));
            }
        }
        else if (status === "co") {
           for (let c of classList) {
                if (c.startsWith('solo-')) classList.replace(c, c.replace('solo-', cofilter));
            }
        }

        // set the co/solo icon and mark as handled
        $(f).parent().find('.aia-check').attr('data-aia', 'done').html(icons[status]);
    }

})(jQuery);

// convenience function to be able to pass minus values into a Date, so JS will automatically shift correctly over month/year boundaries
// thanks to Phil on Stackoverflow for the code snippet https://stackoverflow.com/a/37003268
function createDate(days, months, years) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date;
}

// a promise which resolves after a few seconds
function waitforXSeconds(x) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, x * 1000);
    });
}
