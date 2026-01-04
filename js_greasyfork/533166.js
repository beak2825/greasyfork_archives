// ==UserScript==
// @name         Hide sell skimmer button
// @namespace    heasley.hide-skim-seller
// @version      1.0
// @description  Hide that pesky sell skimmer button
// @author       You
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533166/Hide%20sell%20skimmer%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/533166/Hide%20sell%20skimmer%20button.meta.js
// ==/UserScript==
const skim_observer = new MutationObserver(function(mutations) {
    const url = window.location.href;
    if (url.includes("sid=crimes") && url.includes("cardskimming")) {
        var sell_skim_row = $("[class*='crimeOptionSection_']:contains(Sell Card Details)");
        var sell_skim_button = sell_skim_row.parent().find("[class*='crimeOptionSection_'][class*='commitButtonSection_'] > button.commit-button");
    if (sell_skim_button.length && !sell_skim_button.hasClass("wb-hidden")) {
            sell_skim_button.hide().addClass("wb-hidden");
        }
    }
});


(function() {
    'use strict';

    skim_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();

