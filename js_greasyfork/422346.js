// ==UserScript==
// @name         Canadian BestBuy Autocart
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto add to cart
// @author       AxizY
// @match        https://www.bestbuy.ca/en-ca/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422346/Canadian%20BestBuy%20Autocart.user.js
// @updateURL https://update.greasyfork.org/scripts/422346/Canadian%20BestBuy%20Autocart.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (Notification.Permission != "Granted") Notification.requestPermission();
    if (document.getElementsByClassName("availabilityMessage_ig-s5 container_3LC03")[0].textContent == "Available to ship") {
        document.getElementsByClassName("addToCartLabel_YZaVX")[0].click();
        setTimeout(() => {document.getElementsByClassName("basketIcon_1lhg2")[0].click();}, 2000);
        const notif = new Notification ("OUT",{
            "body":"DONE"
        })
    } else {
        location.reload();
    }
})();