// ==UserScript==
// @name         Delete Annoying Coupons
// @namespace    http://tampermonkey.net/
// @version      2025-04-08
// @description  Delete Coupon's on SHEIN pages
// @author       filmodeon
// @match        https://*.shein.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shein.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532177/Delete%20Annoying%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/532177/Delete%20Annoying%20Coupons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to remove the coupon modal
    function removeCouponModal() {
        const modal = document.querySelector('.j-vue-coupon-package-container');
        if (modal) {
            console.log('Coupon modal found and removed');
            modal.remove();
            return true;
        }
        return false;
    }

    // First attempt to remove it if it's already in the DOM
    if (removeCouponModal()) {
        return;
    }

    // If not found, set up a mutation observer to watch for it
    const observer = new MutationObserver((mutations) => {
        if (removeCouponModal()) {
            // Once found and removed, disconnect the observer
            observer.disconnect();
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback method - try again after a short delay
    setTimeout(() => {
        removeCouponModal();
    }, 2000);
})();