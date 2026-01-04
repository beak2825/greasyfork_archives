// ==UserScript==
// @name         Amazon - Decline Prime Offer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Skip prompt to enter phone number, skip Prime offer, hide Prime advertisements
// @author       Kiki
// @match        https://www.amazon.de/gp/cart/desktop/*
// @match        https://www.amazon.de/gp/buy/primeinterstitial/*
// @match        https://www.amazon.de/gp/buy/spc/*
// @match        https://www.amazon.de/ap/accountfixup*
// @match        https://www.amazon.de/checkout/p/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487950/Amazon%20-%20Decline%20Prime%20Offer.user.js
// @updateURL https://update.greasyfork.org/scripts/487950/Amazon%20-%20Decline%20Prime%20Offer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //alert("a");
    window.setTimeout(doItAll, 2000);

})();

function doItAll()
{
    //alert("b");
    // first two selector skip prime
    // third selector skips entering pnone number
    var x = document.querySelector("a#prime-declineCTA,span.prime-no-button button,a#ap-account-fixup-phone-skip-link");
    if(x != null)
    {
        x.click();
        console.log('Prime offer declined');
    }

    // hide Prime ad
    x = document.querySelector("div.prime-ad-banner-content,div#prime-spc-stripe-recommendations");
    if(x != null)
    {
        x.style.display = "none";
        console.log('Prime ad hidden');
    }
}