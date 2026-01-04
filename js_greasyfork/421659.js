// ==UserScript==
// @name         Quest Table - Kappa Mod
// @namespace    quest-eft-gamepedia
// @version      0.21
// @description  Adds a column to quest tables that show whether task is Kappa or not
// @author       PlatinumLyfe
// @match        https://escapefromtarkov.gamepedia.com/Quests
// @match        https://escapefromtarkov.fandom.com/wiki/Quests
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421659/Quest%20Table%20-%20Kappa%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/421659/Quest%20Table%20-%20Kappa%20Mod.meta.js
// ==/UserScript==

(function() {
    // We find the quests tables on the Quests page (there is one table for each trader)
    $('.mw-parser-output .wikitable').each(function(idx, itm) { 
        // In each Table we:

        // Add a column heading for Kappa AFTER Quest
        $(itm).find('tr:nth-child(2) th:first-child').after('<th>Kappa</th>');

        // Find each row in the table ('tr' aka tablerow element)
        $(itm).find('tr').each(function (idxi, tr) {

            // Find each table header cell in the tablerow
            $(tr).find('th').each(function(id, th) {
                var thx = $(th);

                if (!thx.attr('colspan')) {
                    // If this isn't a cell that has a column span
                    thx.find('a').each(function(i, a) {
                        // Find each hyperlink (so we can get the subpages off the wiki)
                        window.jQuery.get($(a).attr('href')).then(function (data) {
                            // Load the sub-pages for each task and find the table on the right that has whether it is kappa or not
                            thx.after($('<td>' + $(data).find('.mw-parser-output .va-infobox-group:nth-child(3) tr:last-child .va-infobox-content').html() + '</td>'));
                            // We insert it into the table
                        });
                    });
                } else if (thx.attr('colspan') == 10) {
                    // If this is the big column span cell that says things like "Prapor's quests", "Therapists Quests", etc.
                    // We need to make it go one bigger to accomodate the added Kappa cells
                    thx.attr('colspan', '11');
                }
            });
        });
    });
})();