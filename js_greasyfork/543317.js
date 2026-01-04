// ==UserScript==
// @name         Infognu 'Take this course' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically redirects to the Udemy URL from Infognu’s “Take this course” button on course pages.
// @author       Bernando Jr Minguita
// @match        https://infognu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infognu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543317/Infognu%20%27Take%20this%20course%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543317/Infognu%20%27Take%20this%20course%27%20Auto-Redirect.meta.js
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
     * Extracts the Udemy URL from the enroll button and redirects to it.
     */
    function redirectToUdemyCourse() {
        const anchor = document.querySelector('#enroll a[href*="/go/enroll?link="]');

        if (!anchor || !anchor.href) {
            console.log('[Infognu Redirect] "Take this course" button not found or missing href.');
            return null;
        }

        try {
            const url = new URL(anchor.href);
            const udemyParam = url.searchParams.get('link');

            if (!udemyParam) {
                console.log('[Infognu Redirect] "link" parameter not found in anchor href.');
                return null;
            }

            const decodedUdemyUrl = decodeURIComponent(udemyParam);
            console.log('[Infognu Redirect] Redirecting to:', decodedUdemyUrl);

            // Navigate to Udemy course (no back button return)
            window.location.replace(decodedUdemyUrl);
            return decodedUdemyUrl;
        } catch (err) {
            console.error('[Infognu Redirect] Failed to extract or parse Udemy URL:', err);
            return null;
        }
    }

    // Execute redirection once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToUdemyCourse);
    } else {
        redirectToUdemyCourse();
    }
})();
