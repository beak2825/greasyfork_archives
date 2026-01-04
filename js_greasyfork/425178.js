// ==UserScript==
// @name         AO3: highlight author fandoms CONFIG
// @namespace    https://greasyfork.org/en/users/757649-certifieddiplodocus
// @version      1.0
// @description  Config script for AO3 fandom highlighter
// @author       CertifiedDiplodocus
// @match        http*://archiveofourown.org/users/*
// @exclude      http*://archiveofourown.org/users/YourUsernameHere*
// @exclude      /^https?:\/\/archiveofourown\.org\/users\/[^\/]+\/(?!pseuds)/
// @icon         https://upload.wikimedia.org/wikipedia/commons/8/8c/Cib-archive-of-our-own_%28CoreUI_Icons_v1.0.0%29.svg
// @license      GPL-3.0-or-later
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425178/AO3%3A%20highlight%20author%20fandoms%20CONFIG.user.js
// @updateURL https://update.greasyfork.org/scripts/425178/AO3%3A%20highlight%20author%20fandoms%20CONFIG.meta.js
// ==/UserScript==

/* Icon by FSock on Wikimedia Commons. Licensed under CC4.0 https://creativecommons.org/licenses/by/4.0/deed.en
https://commons.wikimedia.org/wiki/File:Cib-archive-of-our-own_(CoreUI_Icons_v1.0.0).svg */

(function() {
    'use strict';

    window.fandomHighlighterConfig = {

        /******************************** CONFIG **********************************/
        // Edit this file with your own settings, then check that both it and     //
        // "AO3 fandom highlighter" are enabled in Greasemonkey/Tampermonkey.     //
        // When the main script updates, your configuration will be unchanged.    //
        /**************************************************************************/

        // Fill in your own username in the @exclude line above
        // to avoid lighting up your own dashboard.

        // Favourite fandoms list (regexp can be used - see below for tips)
        fandomsToHighlight: ["Original Work", "Critical Role", "Doctor Who", "Naruto", "Scooby.Doo",
                             "Holmes", "^Avatar:", "The Avengers .Marvel"],

        // Fandoms to highlight in a different colour (specify colour for each).
        //    - overrides the default colour
        //    - you can add fandoms here without removing them from the first list

        fandomsInColour: {"Die Hard":"#fda7d1", //    pink
                          "Scooby Doo":"#adf7d1", //  light green
                          "^Putin RPF":"red", //      regexp patterns can be used
                          "Naruto": "orange", // named colors work too
                         },

        // SOME NOTES ON REGEXP AND SEARCH RESULTS *******************************/

        // By default, the search matches any string containing the text in quotes:
        //     "Sherlock" matches "Sherlock (TV)", "Sherlock Holmes" and "Young Sherlock Holmes"
        // For more control, use the regex symbols "^" (string start) and/or "$" (string end):
        //     "^Sherlock" matches "Sherlock Holmes" but not "Young Sherlock Holmes"
        //     "^Star Trek$" matches only "Star Trek", not "Star Trek: The Original Series" or "Star Trek: Picard"
        // "." matches any single character:
        //     "Scooby.Doo" matches "Scooby Doo" and "Scooby-Doo"

        // SPECIAL CHARACTERS: If a fandom contains any of the following characters
        // . + * ? ^ $ { } | \
        // they must be preceded (escaped) with a backslash (e.g. "House M\.D\.")
        // for the script to work.
        //
        // ( ) and [ ]
        // must be escaped with a double backslash: "Thor \\(Marvel\\)"
        // Or just use a period, which matches any character: "Thor .Marvel."

        // FORMAT: enable/disable bold text, highlighting, and custom highlighting
        boldIsOn: true,
        highlightIsOn: true,
        customHighlightIsOn: true,

        highlightDefaultCol: 'LightYellow', // default highlight colour

    }

})();