// ==UserScript==
// @name         Clip all QFC or Fred Meyer coupons
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Click every "clip" coupon button on the QFC coupons page www.qfc.com/savings/cl/coupons/
// @author       peckjon
// @authorurl    https://greasyfork.org/en/users/824205-peckjon
// @include      http*://*qfc.com/savings/cl/coupons*
// @include      http*://*fredmeyer.com/savings/cl/coupons*
// @icon         https://www.google.com/s2/favicons?domain=qfc.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487591/Clip%20all%20QFC%20or%20Fred%20Meyer%20coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/487591/Clip%20all%20QFC%20or%20Fred%20Meyer%20coupons.meta.js
// ==/UserScript==

var offerButtons = []

var offerClicker = function(index) {
    if(index < offerButtons.length) {
        if (document.body.textContent.includes("reached the maximum")) {
            console.log("Maximum number of coupons reached");
        } else {
            console.log("Clicking offer button "+(index+1)+" of "+offerButtons.length);
            offerButtons[index].click();
            setTimeout(function(){ offerClicker(index+1) }, 500);
            if (offerButtons.length>0 && index>=offerButtons.length-1) {
                console.log("Scrolling to obtain more coupons...");
                window.scrollBy(0,1000);
                setTimeout(offerKickoff, 3000);
            }
        }
    }
}

var offerKickoff = function() {
    offerButtons = Array.from(document.getElementsByClassName("CouponCard-button")).filter(btn => btn.textContent.startsWith("Clip"));
    console.log("Found "+offerButtons.length+" QFC offer buttons");
    if(offerButtons.length > 0) {
        offerClicker(0);
    } else {
        console.log("Scrolling to obtain more coupons...");
        window.scrollBy(0,1000);
        setTimeout(offerKickoff, 3000);
    }
}

setTimeout(offerKickoff, 3000);
