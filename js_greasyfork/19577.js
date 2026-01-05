// ==UserScript==
// @name         Filter user uploads by type
// @namespace    pxgamer
// @version      0.1
// @description  Filter user uploads by their type
// @author       pxgamer
// @include      *kat.cr/user/*/uploads/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19577/Filter%20user%20uploads%20by%20type.user.js
// @updateURL https://update.greasyfork.org/scripts/19577/Filter%20user%20uploads%20by%20type.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var types      = ["exeType", "zipType", "pdfType", "filmType", "musicType", "pictureType", "undefinedType"];
    var typesNames = ["Application", "Archived", "Book", "Film", "Music", "Pictures", "Undefined"];
    var typeHTML   = "";

    for (var i = 0; i < types.length; i++) {
        typeHTML = typeHTML + '<option value="'+types[i]+'">'+typesNames[i]+'</option>';
    }

    $('h2').after(' <select id="tfilter">'+typeHTML+'</select> <button class="siteButton bigButton filterTypes ka ka-search"></button>');
    $('.filterTypes').on('click', function() {
        var type = $('#tfilter').val();

        $('tr td div.torrentname div a.cellMainLink').each(function() {
            $(this).parent().parent().parent().parent().show();
        });

        $('tr td div.torrentname div a.cellMainLink').each(function() {
            if (!$(this).parent().hasClass(type)) {
                $(this).parent().parent().parent().parent().hide();
            }
        });
    });
})();