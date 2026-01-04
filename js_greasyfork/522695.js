// ==UserScript==
// @name          Hide Prices on Colosseum Reservation System
// @namespace     https://github.com/scrool/hide-colloseum-prices
// @version       1.10
// @description   Hides Prices on Colosseum Reservation System
// @match         https://online.colosseum.eu/*
// @grant         GM_addStyle
// @grant         GM.addStyle
// @grant         GM_log
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/522695/Hide%20Prices%20on%20Colosseum%20Reservation%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/522695/Hide%20Prices%20on%20Colosseum%20Reservation%20System.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function setup() {
        GM_log("Setup()");
        $('[data-toggle="tooltip"]').each(function() {
            if (!$(this).data('prices-hidden')) {
                const originalTitle = $(this).attr('data-original-title');
                if (originalTitle) {
                    GM_log(`Original title: ${originalTitle}`);
                    const titleParts = originalTitle.split('<br/>');
                    titleParts.pop();
                    const updatedTitle = titleParts.join('<br/>');
                    $(this).attr('data-original-title', updatedTitle);
                    $(this).data('prices-hidden', true);
                    GM_log(`Updated title: ${updatedTitle}`);
                }
            }
        });
    }

    const css = `
        .priceValue, .cart-ticket-price, .hallPrice, .PriceCategoryLabel {
            display: none !important;
        }
    `;
    if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
    } else if (typeof GM !== 'undefined' && typeof GM.addStyle === 'function') {
        GM.addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
    setup();
    $(document).ajaxComplete(setup);
})();