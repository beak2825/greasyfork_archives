// ==UserScript==
// @name            Facebook Block Sponsored figuccio
// @namespace       https://greasyfork.org/users/237458
// @version         0.9
// @author          figuccio
// @description     rimuove Sponsoredon right Facebook
// @match           https://*.facebook.com/*
// @run-at          document-start
// @grant           GM_addStyle
// @icon            https://facebook.com/favicon.ico
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/465968/Facebook%20Block%20Sponsored%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/465968/Facebook%20Block%20Sponsored%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
 //nasconde  la scritta sponsorizzato maggio 2025
GM_addStyle('.x1n2onr6.x1iyjqo2.xdt5ytf.x78zum5 > .x1y1aw1k > div:nth-of-type(1) > div > .x1n2onr6{display:none!important;}');

    function hideSponsoredSections() {
        var sponsor = document.querySelectorAll('[aria-label="Inserzionista"]');
        sponsor.forEach(function(sponsor) {
            sponsor.style.display = 'none';
        });
    }

    hideSponsoredSections();

    // Observe changes in the DOM to hide sections if added later via AJAX
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                hideSponsoredSections();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

  
})();
