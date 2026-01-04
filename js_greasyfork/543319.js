// ==UserScript==
// @name         UdemyFreebies 'GO TO COURSE' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically redirects to the Udemy course from the "GO TO COURSE" button on UdemyFreebies pages.
// @author       Bernando Jr Minguita
// @match        https://www.udemyfreebies.com/free-udemy-course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemyfreebies.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543319/UdemyFreebies%20%27GO%20TO%20COURSE%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543319/UdemyFreebies%20%27GO%20TO%20COURSE%27%20Auto-Redirect.meta.js
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
     * Finds the Udemy redirect link from the "GO TO COURSE" button and redirects to it.
     */
    function redirectToUdemyCourse() {
        const buttonSpan = document.querySelector('a.button-icon > span');

        // Ensure the element exists and belongs to an anchor with a valid href
        const anchor = buttonSpan?.parentElement;
        const href = anchor?.href;

        if (!href || anchor.tagName !== 'A') {
            console.log('[UdemyFreebies Redirect] "GO TO COURSE" button not found or malformed.');
            return null;
        }

        // Confirm that this is the expected redirect format
        if (!href.includes('/out/')) {
            console.log('[UdemyFreebies Redirect] URL does not match expected pattern ("/out/"):', href);
            return null;
        }

        console.log('[UdemyFreebies Redirect] Redirecting to Udemy:', href);
        window.location.replace(href);
        return href;
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToUdemyCourse);
    } else {
        redirectToUdemyCourse();
    }
})();
