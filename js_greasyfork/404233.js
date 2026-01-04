// ==UserScript==
// @name         Toggle Archived Geocaches
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to the Owned Caches page to toggle between hiding/showing archived caches
// @author       Michel ten Voorde
// @match        https://www.geocaching.com/my/owned.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404233/Toggle%20Archived%20Geocaches.user.js
// @updateURL https://update.greasyfork.org/scripts/404233/Toggle%20Archived%20Geocaches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var notArchived = 0;

	$('.MyOwnedCachesTable').before('<a id="toggleArchivedBtn" class="btn btn-primary" style="margin-top: 14px; background-color: #17a2b8" data-show="true"><span id="hideShowToggle">Hide</span> archived caches</a>');

    $('#toggleArchivedBtn').click(function() {
        if ($('#toggleArchivedBtn').data('show') === true) {
            $('#hideShowToggle').text('Show');
            $('#toggleArchivedBtn').data('show', false);
            $('a.OldWarning').parent().parent().hide(500);

            if (notArchived === 0) {
                notArchived = $('table.MyOwnedCachesTable tr.UserOwned').length - $('a.OldWarning').parent().parent().length;
                $("#ctl00_ContentBody_lbHeading").text($("#ctl00_ContentBody_lbHeading").text() + ", of which " + notArchived + " are active.");
            }
        } else {
            $('#hideShowToggle').text('Hide');
            $('#toggleArchivedBtn').data('show', true);
            $('a.OldWarning').parent().parent().show(500);
        }
    });
})();

