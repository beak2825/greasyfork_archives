// ==UserScript==
// @name         Add all AMEX offers
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Click every "Add to Card" and "Activate Offer" button on the AMEX offers page
// @author       peckjon
// @authorurl    https://greasyfork.org/en/users/824205-peckjon
// @include      http*://*americanexpress.*
// @icon         https://www.google.com/s2/favicons?domain=americanexpress.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433741/Add%20all%20AMEX%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/433741/Add%20all%20AMEX%20offers.meta.js
// ==/UserScript==

var amexOfferButtons = []

var amexOfferClicker = function(index) {
    if(index < amexOfferButtons.length) {
        console.log("Clicking offer button "+index+" of "+amexOfferButtons.length);
        amexOfferButtons[index].click();
        setTimeout(function(){ amexOfferClicker(index+1) }, 500);
    }
}

var amexOfferKickoff = function() {
    amexOfferButtons = Array.from(document.getElementsByTagName("button")).filter(btn => btn.title == "add to list card" || btn.title == "Add to Card" || btn.title == "Activate Offer");
    console.log("Found "+amexOfferButtons.length+" AMEX offer buttons");
    if(amexOfferButtons.length > 0) {
        amexOfferClicker(0);
    } else {
        setTimeout(amexOfferKickoff, 3000);
    }
}

setTimeout(amexOfferKickoff, 3000);


