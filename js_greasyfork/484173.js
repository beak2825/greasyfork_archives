// ==UserScript==
// @name         Runescape Wiki Show IDs
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add ID to info box on Runescape Wiki
// @author       Higgins
// @match        https://runescape.wiki/*
// @icon         https://runescape.wiki/favicon.ico
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/484173/Runescape%20Wiki%20Show%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/484173/Runescape%20Wiki%20Show%20IDs.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(window).on('load', function() {
    $('table.rsw-infobox').each(function() {
        var infoboxTable = $(this);
        if (infoboxTable.length > 0) {
            var existingHeader = infoboxTable.find('th.infobox-header')
            var existingColspan = existingHeader.attr('colspan');
            var idSpans = $("span:contains('Object ID:'), span:contains('NPC ID:')");
            var uniqueIds = idSpans.length > 0 ? [...new Set(idSpans.map(function() {
                return $(this).text().replace(/(?:Object|NPC) ID:/, '').trim();
            }).get())] : null;

            if (uniqueIds && uniqueIds.length > 0) {
                var newTableRow = $('<tr>').html('<th colspan="' + existingColspan + '" class="infobox-header">' + uniqueIds.join(', ') + ', -- ' + existingHeader.text() + '</th>');
                infoboxTable.find('tbody tr:first').after(newTableRow);
            } else {
                var idValue = $("td[data-attr-param='id']").text().trim();
                if (idValue) {
                    var newTableRow = $('<tr>').html('<th colspan="' + existingColspan + '" class="infobox-header">' + idValue + ', -- ' + existingHeader.text() + '</th>');
                    infoboxTable.find('tbody tr:first').after(newTableRow);
                }
            }
        }
    });
});
})();