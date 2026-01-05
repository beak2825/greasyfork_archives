// ==UserScript==
// @name         Comment filter
// @namespace    pxgamer
// @version      0.2
// @description  Filter comments with keywords
// @author       pxgamer
// @include      *kat.cr/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19742/Comment%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19742/Comment%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchStrings = ["Denuvo"];

    $('.commentText').each(
        function() {
            for (var i = 0; i < searchStrings.length; i++) {
                if ($(this).html().toLowerCase().indexOf(searchStrings[i].toLowerCase()) > -1) {
                    $(this).parent().parent().parent().hide();
                }
            }
        }
    );
})();
