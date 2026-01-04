// ==UserScript==
// @name         AO3: highlight author fandoms
// @namespace    https://greasyfork.org/en/users/757649-certifieddiplodocus
// @version      1.1.2
// @description  Highlight favourite fandoms in user page
// @author       CertifiedDiplodocus
// @match        http*://archiveofourown.org/users/*
// @exclude      http*://archiveofourown.org/users/YourUsernameHere*
// @exclude      /^https?:\/\/archiveofourown\.org\/users\/[^\/]+\/(?!pseuds)/
// @icon         https://raw.githubusercontent.com/EmeraldBoa/Userscripts-by-a-Certified-Diplodocus/refs/heads/main/images/icons/ao3-logo-by-bingeling-GPL.svg
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/424871/AO3%3A%20highlight%20author%20fandoms.user.js
// @updateURL https://update.greasyfork.org/scripts/424871/AO3%3A%20highlight%20author%20fandoms.meta.js
// ==/UserScript==

//cannibalised from fangirlishness's ao3 Highlight tags V1, with thanks

/* eslint-env jquery */ //           allows jQuery
/* jshint esversion:6 */ //          allows "let"

/* PURPOSE: Highlight your favourite fandoms when when visiting another user's dashboard.
Add your username to the second exclude line to keep from lighting up your own page.

(Will not highlight tags, by design. If that's your goal, use this: https://greasyfork.org/en/scripts/424852-ao3-highlight-tags-v2)*/

(function($) {
    'use strict';

    // check that config extension is loaded, throw error if not
    if (!window.fandomHighlighterConfig) {throw new Error("⚠ AO3 Fandom Highlighter CONFIG not loaded")}

    // pass variables from config script
    const config = window.fandomHighlighterConfig,
          fandomsToHighlight = config.fandomsToHighlight,
          fandomsInColour = config.fandomsInColour,
          highlightIsOn = config.highlightIsOn,
          boldIsOn = config.boldIsOn,
          customHighlightIsOn = config.customHighlightIsOn,
          highlightDefaultCol = config.highlightDefaultCol;

    // check that settings make sense; if not, throw error and halt script
    if (!highlightIsOn && !boldIsOn && !customHighlightIsOn && !highlightDefaultCol) {
        throw new Error("⚠ AO3 Fandom Highlighter CONFIG: no highlight/bold/colours selected")
    }
    if (!fandomsToHighlight.some(Boolean) && !fandomsInColour.some(Boolean)) {
        throw new Error("⚠ AO3 Fandom Highlighter CONFIG: no fandoms selected")
    }

    // for each fandom in the list, iterate through fandoms, check against list, then highlight and/or bold
    $('.fandom.listbox.group li>a').each(function() {

        const $fandom = $(this)
        const text = $fandom.text()

        // custom highlighting, if applicable (priority over normal highlighting).
        if (customHighlightIsOn) {
            for (const fandomRegex in fandomsInColour) {
                if (RegExp(fandomRegex, "gi").test(text)) {
                    formatFandom($fandom, fandomsInColour[fandomRegex])
                    return; // go to next fandom in loop - by exiting the .each(function()
                }
            }
        }

        // default highlighting (user-defined colour). For...in for objects, for... of for arrays.
        if (highlightIsOn || boldIsOn) {
            for (const fandomRegex of fandomsToHighlight) {
                if (RegExp(fandomRegex, "gi").test(text)) {
                    formatFandom($fandom, highlightDefaultCol)
                    return; // go to next fandom
                }
            }
        }
    });

    // ----------------------------------------------------------------

    function formatFandom($fandom, colour) {
        $fandom.css('background-color', colour);
        if(boldIsOn) $fandom.css('font-weight', 'bold');
    }

})(jQuery);