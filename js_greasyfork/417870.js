// ==UserScript==
// @name         iCard Timer Remover
// @namespace    https://gitlab.com/user890104
// @version      2025-08-07
// @author       Vencislav Atanasov
// @description  Disables logout timer in iCard
// @match        https://icard.com/account/*
// @match        https://icard.com/client/*/accountv2*
// @connect      self
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/417870/iCard%20Timer%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/417870/iCard%20Timer%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url;

    if (location.href.startsWith('https://icard.com/account/')) {
        // personal
        url = '/account/bg/presettings-payment';
    }
    else {
        if (location.href.startsWith('https://icard.com/client/')) {
            // business
            url = '/client/bg/accountv2/get-last-transactions';
        }
        else {
            console.warn('Unable to determine which iCard portal you\'re using. Please check for script updates or send a report to the developer.');
            return;
        }
    }

    setInterval(function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url
        });
    }, 30 * 1000);
})();