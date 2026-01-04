// ==UserScript==
// @name         AO3: [Wrangling] Highlight Matched Chars in Rels
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      0.3
// @description  Compares attached chars (without disambigs) and the canonical rel name to quickly determine typos or shortened rels
// @author       escctrl
// @match        *://*.archiveofourown.org/tags/*/wrangle?*show=relationships*status=canonical*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*status=canonical*show=relationships*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530024/AO3%3A%20%5BWrangling%5D%20Highlight%20Matched%20Chars%20in%20Rels.user.js
// @updateURL https://update.greasyfork.org/scripts/530024/AO3%3A%20%5BWrangling%5D%20Highlight%20Matched%20Chars%20in%20Rels.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery */

(function($) {
    'use strict';

    // CSS styling for the highlighted chars
    $('head').append(`<style type="text/css">
        .highlight-found { background-color: #313c36; }
        .highlight-notfound { background-color: #664040; }
        </style>`);

    let rows = $('#wrangulator').find('tbody tr').toArray();

    rows.forEach((row) => {

        let chars = $(row).find('td[title="characters"] a').toArray();

        let rel = $(row).find('th label');
        let reltxt = $(rel).text();

        chars.forEach((char) => {
            let chartxt = char.innerText;

            // get rid of disambigs
            let disambig = chartxt.lastIndexOf('(');
            if (chartxt.slice(disambig) !== "(s)" && disambig > -1) chartxt = chartxt.slice(0, disambig-1);

            let regex = chartxt.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&'); // make special chars literal
            regex = `${/\w/.test(regex.slice(0,1)) ? "\\b" : ""}${regex}${/\w/.test(regex.slice(-1)) ? "\\b" : ""}`; // add word boundary at start and end (if a letter)

            // not global: we want the first found match (per "nothing before something" an exact match should always come first)
            // otherwise a "Ken & Ken's Mother" -> first character /\bKen\b/ -> "\rKen\t & \rKen\t's Mother" -> the added tab causes /\bKen's Mother\b/ to not match anymore
            regex = new RegExp(regex, "");

            // highlight the char in the rel
            if (regex.test(reltxt)) reltxt = reltxt.replace(regex, "\r$&\t"); // we add only a placeholder, so we won't start matching against the HTML characters
            else $(char).addClass('highlight-notfound');
        });
        // once done with finding matches, we can turn the placeholders into actual HTML and display that
        $(rel).html(reltxt.replace(/\r/g, "<span class='highlight-found'>").replace(/\t/g, "</span>"));
    });

})(jQuery);