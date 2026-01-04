// ==UserScript==
// @name         CursosDev 'Obtener Cupón' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically redirects to the first Udemy coupon URL found on cursosdev.com coupon pages, including through affiliate wrappers (murl param support). 🧭✨
// @author       Bernando Jr Minguita
// @match        https://www.cursosdev.com/coupons-udemy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cursosdev.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543302/CursosDev%20%27Obtener%20Cup%C3%B3n%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543302/CursosDev%20%27Obtener%20Cup%C3%B3n%27%20Auto-Redirect.meta.js
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
     * Searches the page for the first Udemy coupon URL and navigates to it.
     */
    function redirectToFirstUdemyCoupon() {
        console.log('[CursosDev Auto-Redirect] Scanning for Udemy coupon URLs...');

        const links = [...document.querySelectorAll('a')];

        const matched = links.find(link => {
            const href = link.href;
            return href.includes('udemy.com') && href.includes('couponCode=');
        });

        if (!matched) {
            console.log('[CursosDev Auto-Redirect] No matching Udemy coupon link found.');
            return;
        }

        try {
            const parsedUrl = new URL(matched.href);
            const redirectTarget = parsedUrl.searchParams.get('murl') || matched.href;

            console.log('[CursosDev Auto-Redirect] Redirecting to:', redirectTarget);
            window.location.href = redirectTarget;
        } catch (err) {
            console.error('[CursosDev Auto-Redirect] Invalid URL detected:', matched.href, err);
        }
    }

    // Run the script once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToFirstUdemyCoupon);
    } else {
        redirectToFirstUdemyCoupon();
    }
})();
