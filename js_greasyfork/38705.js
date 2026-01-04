// ==UserScript==
// @name         Torn City Forum Idiot Remover
// @namespace    TornCity
// @version      21
// @description  Hides various idiots on the Torn City forums.
// @include      *.torn.com/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38705/Torn%20City%20Forum%20Idiot%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/38705/Torn%20City%20Forum%20Idiot%20Remover.meta.js
// ==/UserScript==

// Enormous thank you to Alexstrasza, who wrote this
// original script. I have added a few more idiots
// and posted this here so that I can have it all over.

(function() {
    'use strict';

    var duckObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Quacking? I don't see any quacking!
                var idiots = [
                    '1182047', // Duck
                    '1028023', // DUDE
                    '1833276', // SharpMid
                    '595049',  // Tadd
                    '1002535', // -BC-M16
                    '1834716', // IdentityUnknown
                    '2056079', // Krombopulos
                    '2048880', // TheLamia
                    '2097572', // meow-_- / ScarsCanBeGiven
                    '1337797'  // MarlonBrando
                ];

                for (var i = 0; i < idiots.length; i++) {
                    $('ul.threads-list > li > div.thread-info-wrap > ul.thread > li.starter > a.user[data-placeholder*="' + idiots[i] + '"]').parent().parent().parent().parent().remove();
                    $('ul.threads-list > li > div.thread-info-wrap > ul.thread > li.starter > a.user[href*="' + idiots[i] + '"]').parent().parent().parent().parent().remove();
                    $('ul.thread-list > li > div.column-wrap > div.post-wrap[data-author="' + idiots[i] + '"]').parent().parent().remove();
                }
            }
        });
    });
    duckObserver.observe($('#forums-page-wrap')[0], { attributes: true, childList: true, characterData: true });

})();