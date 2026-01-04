// ==UserScript==
// @name Flaschenpost shift offers
// @name:de Flaschenpost Schichtangebote
// @description You will receive a notification when free shift offers are available.
// @description:de Sie erhalten eine Meldung wenn freie Schichtangebote verfügbar sind.
// @version 0.0.0.6
// @icon https://personal.flaschenpost.de/favicon.ico
// @author JAS1998
// @copyright 2023+ , JAS1998
// @namespace https://greasyfork.org/users/4792
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @run-at document-end
// @include *personal.flaschenpost.*/scheduleoffers.aspx
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/448886/Flaschenpost%20shift%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/448886/Flaschenpost%20shift%20offers.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

checkForShiftOffers();

function checkForShiftOffers() {
    if (document.getElementsByClassName("shftapi_offer_button").length > 0) {
        GM_notification({
            title: GM_info.script.name,
            text: "New shift offer",
            timeout: "5000",
        });
    } else {
        // Wenn keine Schichtangebote gefunden wurden, laden Sie die Seite neu
        location.reload();
    }
}

setInterval(checkForShiftOffers, 2700000);
