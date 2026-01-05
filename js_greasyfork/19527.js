// ==UserScript==
// @name         User Uploads Search
// @namespace    pxgamer
// @version      0.2
// @description  Search a user's uploads... kinda.
// @author       pxgamer
// @include      *kat.cr/user/*/uploads/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19527/User%20Uploads%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/19527/User%20Uploads%20Search.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $('h2').after(' <input type="text" id="uploadsSearch" style="border-radius: 2px; padding: 3px 13px 3px; margin-top: 1px;"> <button class="siteButton bigButton searchFor ka ka-search"></button>');
    $('.searchFor').on('click', function() {
        $('tr td div.torrentname div a.cellMainLink').each(function() {
            $(this).parent().parent().parent().parent().show();
        });
        var searchParam = $('input#uploadsSearch').val().toLowerCase();
        $('tr td div.torrentname div a.cellMainLink').each(function() {
        if ($(this).html().toLowerCase().indexOf(searchParam) === -1) {
          $(this).parent().parent().parent().parent().hide();
        }
    });
    });
})();
