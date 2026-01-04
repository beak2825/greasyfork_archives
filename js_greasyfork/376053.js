// ==UserScript==
// @name          WaniKani Dashboard Next Burn
// @namespace     https://www.wanikani.com
// @description   Show next burn in the main Wanikani Dashboard
// @author        derpiesderp
// @version       1.0.2
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/dashboard
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/376053/WaniKani%20Dashboard%20Next%20Burn.user.js
// @updateURL https://update.greasyfork.org/scripts/376053/WaniKani%20Dashboard%20Next%20Burn.meta.js
// ==/UserScript==

/*
jshint esversion: 6
*/

(function() {
    'use strict';

    if (!window.wkof) {
        let response = confirm('WaniKani Dashboard Leech List script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    var config = {
        wk_items: {
            options: {
                assignments: true
            },
            filters: {
                srs: [8]
            }
        }
    };

    window.wkof.include('ItemData');
    window.wkof.ready('ItemData').then(getItems).then(determineNextBurn).then(updatePage);

    function getItems() {
        return window.wkof.ItemData.get_items(config);
    }

    function determineNextBurn(items) {
        return items.reduce((prev, curr) => {        
            const currDate = new Date(curr.assignments.available_at);
            const prevDate = new Date(prev.assignments.available_at);
            return currDate > prevDate ? prev : curr;
        });
    }

    function updatePage(nextBurn) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(nextBurn.assignments.available_at);
        
		$('head').append('<style id="nextBurnCss">.review-status>ul>.next-burn {width: 100% !important;}</style>');
        $('.review-status > ul').append('<li class="next-burn"><span>' + date.toLocaleDateString('en-US', options) + '</span><i class="icon-inbox"></i> Next Burn</li>');
    }

})();