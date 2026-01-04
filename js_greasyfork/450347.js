// ==UserScript==
// @name         AO3: Glossary Definition Previews
// @description  click a glossary term in the AO3 FAQ to get its definition in a dialog without leaving the FAQ page
// @version      2.0
// @author       escctrl
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @match        https://archiveofourown.org/faq/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450347/AO3%3A%20Glossary%20Definition%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/450347/AO3%3A%20Glossary%20Definition%20Previews.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // localstorage glossary DB Map as global variable:
    // refreshed -> last refreshed date, lang -> glossary language stored, #anchor -> content
    // load the glossary text from localstorage
    var gDB = new Map(JSON.parse(localStorage.getItem('glossary')));

    // which language are we viewing? that's the glossary we want to load
    var lang = new URLSearchParams(location.search);
    lang = lang.get('language_id');

    loadGlossary();

    function loadGlossary() {
        // reload the glossary text into localstorage...
        if (gDB.size == 0 || // if nonexistant
            new Date(gDB.get('refreshed')) < createDate(0, -6, 0) || // if more than 6 months old (FAQs don't get updated very often)
            gDB.get('lang') !== lang) // if wrong language
        {
            gDB = new Map([["refreshed", new Date().toString()], ["lang", lang]]); // reset any old loaded data

            // read the matching language glossary page and load the descriptions
            $.get('https://archiveofourown.org/faq/glossary?language_id='+lang, function(response) {
                // nothing to do here, all interactions are in done() and failed()
            }).done(function(response) {
                // not all languages have a translated Glossary, yet the FAQs still link to it. automatically switch back to English in that case
                if ($(response).find('div#faq h3').length === 0) {
                    lang = "en";
                    loadGlossary();
                    return;
                }

                // pull all the headings and their anchors into gDB
                $(response).find('div#faq h3').each(function() {
                    // anchor is the id on the <h3>
                    let anchor = $(this).attr('id');
                    // content is the following text until the next <h3>
                    let content = "";
                    $(this).nextUntil('h3').each(function() {
                        // fixing the fact that crosslinks inside the Glossary need a full relative URL to work within the dialog
                        $(this).find('a[href^="#"]').each(function(i, elem) {
                            let href = $(elem).attr('href');
                            $(elem).attr('href', '/faq/glossary'+href);
                        });
                        content += this.outerHTML;
                    });
                    // updating that anchor -> content in the Map
                    gDB.set(anchor, content);
                });
                // gDB is updated in memory, now saving to localstorage
                localStorage.setItem('glossary', JSON.stringify(Array.from(gDB.entries())));

                // display called after async storage refresh
                displayGlossary();

            // thanks to Przemysław Sienkiewicz on Stackoverflow for the code to catch error responses https://stackoverflow.com/a/40256829
            }).fail(function(data, textStatus, xhr) {
                //This shows status code eg. 429
                console.log("Loading Glossary in background failed. Error:", data.status);
            });
        }
        // display called immediately if storage is still up-to-date
        else displayGlossary();
    }

    function displayGlossary() {
        // if the background is dark, use the dark UI theme to match
        let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "vader" /*"ui-darkness"*/ : "base";
        let highlight = dialogtheme == "vader" ? "#970000" : "gold";

        var dlg = "#glossary-entry";

        $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
        .append(`<style tyle="text/css">${dlg}, .ui-dialog {font-size: revert; line-height: 1.286; clear: both;} /* needs clear to avoid header getting huge on Ctrl+F5 */
        ${dlg} a {cursor:pointer;} .glossary-highlight { background-color: ${highlight}; }
        .ui-dialog-titlebar button {background: revert; box-shadow: revert;} ${dlg} { font-size: inherit; }</style>`);

        // optimizing the size of the GUI in case it's a mobile device
        let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
        dialogwidth = dialogwidth > 700 ? 700 : dialogwidth * 0.9;

        // we gotta work with dialogs if we want to allow users to click a link within the glossary text.
        $("body").append(`<div id="glossary-entry"></div>`);
        $(dlg).dialog({
            modal: false,
            autoOpen: false,
            resizable: false,
            width: dialogwidth,
            title: "Glossary Definition",
            // remove highlight of clicked glossary term when the dialog closes
            close: function( event, ui ) { $('a.glossary-highlight').removeClass('glossary-highlight'); }
        });

        // the html collection of all glossary links is different if we're already viewing the glossary
        let gLinks = (location.pathname === "/faq/glossary") ? 'a[href^="#"]' : 'a[href*="/faq/glossary#"]';

        // on links leading to the glossary
        $(gLinks)
            .after(`<sup>&#x1f6c8;</sup>`) // add a special icon 🛈
            .prop("title", "click to view glossary definition")
            .on("click", function(e) { // add an event handler for managing the clicks
                e.preventDefault(); // stop it from going to the glossary page
                e.cancelBubble = true;

                // grab the anchor
                let anchor = new URL($(this).prop("href")); // prop will always contain the full URL
                anchor = anchor.hash.slice(1); // we're only interested in the anchor, minus the hash sign
                let content = gDB.get(anchor); // grab the glossary text for that anchor as the dialog content

                // prepare the (still hidden) dialog:
                $(dlg)
                    .html(content) // add the dynamic content
                    .dialog("option", "position", { my: "left top", at: "left bottom", of: e.target } ) // position the dialog at the clicked term
                    .dialog('open'); // finally, open the dialog

                // remove previous highlighting, in case user clicked from one glossary term directly to the next without closing the dialog
                $('a.glossary-highlight').removeClass('glossary-highlight');
                // highlight the term which the user clicked on, for visual reference
                $(e.target).addClass("glossary-highlight");
            });
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
// helper function to determine whether a color (the background in use) is light or dark
// https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {
    var r, g, b, hsp;
    if (color.match(/^rgb/)) { color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1]; g = color[2]; b = color[3]; }
    else { color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
        r = color >> 16; g = color >> 8 & 255; b = color & 255; }
    hsp = Math.sqrt( 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b) );
    if (hsp>127.5) { return 'light'; } else { return 'dark'; }
}