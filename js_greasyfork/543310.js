// ==UserScript==
// @name         CourseCouponClub 'Enroll Now' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically redirects to Udemy URL (with coupon) from CourseCouponClub button link structures.
// @author       Bernando Jr Minguita
// @match        https://coursecouponclub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursecouponclub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543310/CourseCouponClub%20%27Enroll%20Now%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543310/CourseCouponClub%20%27Enroll%20Now%27%20Auto-Redirect.meta.js
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
     * Extracts and redirects to the Udemy course URL with coupon code, if available.
     */
    function redirectToUdemy() {
        const anchor = document.querySelector('span.rh_button_wrapper a.re_track_btn');
        if (!anchor || !anchor.href) {
            console.log('[Udemy Auto-Redirect] No anchor tag with valid href found.');
            return;
        }

        try {
            const url = new URL(anchor.href);
            const murl = url.searchParams.get('murl');

            if (murl) {
                const decodedUrl = decodeURIComponent(murl);
                console.log('[Udemy Auto-Redirect] Redirecting to:', decodedUrl);
                window.location.href = decodedUrl;
            } else {
                console.log('[Udemy Auto-Redirect] No "murl" parameter found in href:', anchor.href);
            }
        } catch (err) {
            console.error('[Udemy Auto-Redirect] Error parsing URL:', err);
        }
    }

    // Ensure the function runs once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToUdemy);
    } else {
        redirectToUdemy();
    }
})();
