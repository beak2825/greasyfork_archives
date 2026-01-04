// ==UserScript==
// @name            RapidCityJournal Paywall Bypass
// @description     Bypass paywalls for RapidCityJournal.com
// @version         1.0.1
// @author          NonprofitProphet
// @match           https://*.rapidcityjournal.com/*
// @grant           none
// @namespace https://greasyfork.org/users/1490770
// @downloadURL https://update.greasyfork.org/scripts/541380/RapidCityJournal%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/541380/RapidCityJournal%20Paywall%20Bypass.meta.js
// ==/UserScript==
(function () {
    setTimeout(function(){
        document.getElementById("asset-content").removeAttribute("hidden");
        document.getElementsByTagName("body")[0].classList.remove("modal-open");
        document.getElementById("access-offers-modal").remove();
        document.getElementsByClassName("modal-backdrop")[0].remove();
    }, 500);
})();