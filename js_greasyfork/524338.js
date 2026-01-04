// ==UserScript==
// @name         Baselinker retry all listings
// @namespace    http://tampermonkey.net/
// @version      2025-01-21
// @description  Add button to retry all listings
// @author       You
// @license MIT
// @match        https://*.baselinker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524338/Baselinker%20retry%20all%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/524338/Baselinker%20retry%20all%20listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the table auction service sell form is present on the page
    if (document.querySelector('#table_auction_service_sell_form')) {
        if (!document.querySelector('#action_buttons_box')) {
            $('.sell_form_starter').after('<div id="action_buttons_box" class="panel panel-body"></div>');
        }
        $('#action_buttons_box').append('<button id="retry_all_listings" class="btn btn-primary" style="margin-top: 10px;">Retry all listings</button>');
        $('#retry_all_listings').on('click', function() {
            const errorButtons = document.querySelectorAll('.result_error td button');

            errorButtons.forEach(button => {
                button.click();
            });
        });
    }
})();