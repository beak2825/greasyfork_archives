// ==UserScript==
// @name         WaniKani Hide Listing Spoilers
// @namespace    https://www.wanikani.com
// @version      0.1
// @description  Hide spoilers in the listings until hovered:
//               - mnemonic -> name
//               - kanji -> reading & meaning
//               - vocabulary -> reading & meaning
// @author       Ao
// @include      *://www.wanikani.com/level/*
// @include      *://www.wanikani.com/kanji?difficulty=*
// @include      *://www.wanikani.com/radicals?difficulty=*
// @include      *://www.wanikani.com/vocabulary?difficulty=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40877/WaniKani%20Hide%20Listing%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/40877/WaniKani%20Hide%20Listing%20Spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var characterItems = $('.character-item');
    characterItems.each(function(index) {
        var spoilers = $(this).find('a ul');

        $(this).hover(
            function() {
                spoilers.css('visibility','visible');
            },
            function() {
                spoilers.css('visibility','hidden');
            }
         );

        spoilers.css('visibility','hidden');
    });

})();