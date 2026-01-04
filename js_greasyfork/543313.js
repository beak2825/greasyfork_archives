// ==UserScript==
// @name         CouponScorpion 'Enroll Now' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically extracts and redirects to the coupon URL from CouponScorpion "Enroll Now" button.
// @author       Bernando Jr Minguita
// @match        https://couponscorpion.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=couponscorpion.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543313/CouponScorpion%20%27Enroll%20Now%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543313/CouponScorpion%20%27Enroll%20Now%27%20Auto-Redirect.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Bernando Jr Minguita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    /**
     * Extracts the href from the "Enroll Now" button and redirects to it.
     */
    function redirectToCoupon() {
        const anchor = document.querySelector('span.rh_button_wrapper a.re_track_btn');

        if (!anchor || !anchor.href) {
            console.log('[CouponScorpion Redirect] No valid link found.');
            return null;
        }

        const targetUrl = anchor.href;
        console.log('[CouponScorpion Redirect] Redirecting to:', targetUrl);

        // Use replace to avoid creating a history entry
        window.location.replace(targetUrl);
        return targetUrl;
    }

    // Ensure the function runs when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToCoupon);
    } else {
        redirectToCoupon();
    }
})();
