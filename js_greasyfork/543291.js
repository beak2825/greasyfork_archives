// ==UserScript==
// @name         UdemyXpert 'Get Coupon' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Finds Udemy URLs with 'couponCode' within a specific div and navigates to the first one found.
// @author       Bernando Jr Minguita
// @match        https://udemyxpert.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemyxpert.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543291/UdemyXpert%20%27Get%20Coupon%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543291/UdemyXpert%20%27Get%20Coupon%27%20Auto-Redirect.meta.js
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

(() => {
    'use strict';

    /**
     * Attempts to find the Udemy coupon link in the main content div
     * and navigates to it if found.
     * @returns {boolean} true if a coupon link was found and navigation occurred
     */
    function navigateToCouponLink() {
        // Target div containing the coupon links (Tailwind-styled layout)
        const container = document.querySelector('.w-full.lg\\:w-2\\/3.mx-auto.mt-6');

        if (!container) return false;

        // Search all links inside the container
        const couponLink = [...container.querySelectorAll('a')].find(
            a => a.href?.includes('udemy.com') && a.href.includes('couponCode')
        );

        if (couponLink) {
            console.log('[udemyxpert] Navigating to Udemy coupon link:', couponLink.href);
            window.location.replace(couponLink.href); // Prevents history entry
            return true;
        }

        console.log('[udemyxpert] No Udemy coupon link found.');
        return false;
    }

    // Observe DOM mutations to catch dynamically loaded content
    const observer = new MutationObserver((_, obs) => {
        if (navigateToCouponLink()) {
            obs.disconnect(); // Stop watching after successful navigation
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Attempt once immediately on page load in case content is already available
    window.addEventListener('load', () => {
        if (navigateToCouponLink()) observer.disconnect();
    });
})();
