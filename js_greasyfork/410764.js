// ==UserScript==
// @name         Torn: Company Icon Link Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the link on the company icon to change which tab is shown by default
// @author       Untouchable [1360035]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410764/Torn%3A%20Company%20Icon%20Link%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/410764/Torn%3A%20Company%20Icon%20Link%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pages = [
        'income-chart',        // [0]
        'employees',
        'company-positions',
        'applications',
        'pricing',
        'stock',
        'advertising',
        'funds',
        'upgrades',
        'edit-profile',
        'change-director',
        'sell-company'
    ]

    $('.icon73___XrhOo')[0].children[0].href = 'https://www.torn.com/companies.php#/option=' + pages[7]

})();