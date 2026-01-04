// ==UserScript==
// @name         Accept all donations
// @namespace    https://greasyfork.org/users/2402
// @version      0.3
// @description  autoaccept all donations
// @author       Nikolai Tsvetkov
// @match        *.erepublik.com/*/main/notifications/community
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373156/Accept%20all%20donations.user.js
// @updateURL https://update.greasyfork.org/scripts/373156/Accept%20all%20donations.meta.js
// ==/UserScript==

var $ = jQuery;

function accept() {
    $('a[href*="accept"]:first').each(
        function () {
            var donateId = parseInt($('a[href*="acceptRejectDonation"]:first').attr("href").match(/\d+/));
            erepublik.functions.acceptRejectDonation('accept', donateId);
            return false;
        });
}

(function() {
    'use strict';
    setTimeout (function() {
        accept()
    }, 3e3)
})();