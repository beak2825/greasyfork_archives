// ==UserScript==
// @name         Udemy.com Courses Auto-Enroll
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.1
// @description  Auto-clicks the "Enroll now" button on Udemy if a valid 100% off coupon is detected in the URL and course is not already purchased or paid-only.
// @author       Bernando Jr Minguita
// @match        https://www.udemy.com/course/*?*couponCode=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543297/Udemycom%20Courses%20Auto-Enroll.user.js
// @updateURL https://update.greasyfork.org/scripts/543297/Udemycom%20Courses%20Auto-Enroll.meta.js
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

    let clicked = false; // Prevent multiple clicks
    let observer = null;

    /**
     * Checks if a valid "Enroll now" button should be clicked, and clicks it if found.
     */
    function tryEnroll() {
        if (clicked) return;

        const pageText = document.body.textContent;

        if (pageText.includes('Buy now')) {
            console.log('[Udemy Auto-Enroll] Paid course detected. Stopping script.');
            disconnectObserver();
            return;
        }

        if (pageText.includes('You purchased this course on')) {
            console.log('[Udemy Auto-Enroll] Course already owned. Stopping script.');
            disconnectObserver();
            return;
        }

        if (!pageText.includes('Enroll now')) {
            return; // Wait for content to load
        }

        const enrollButton = document.querySelector('button[data-purpose="buy-this-course-button"]');
        if (enrollButton) {
            enrollButton.click();
            clicked = true;
            console.log('[Udemy Auto-Enroll] "Enroll now" button clicked.');
            disconnectObserver();
        }
    }

    /**
     * Disconnects the mutation observer if active.
     */
    function disconnectObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('[Udemy Auto-Enroll] MutationObserver disconnected.');
        }
    }

    // Handle static page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryEnroll);
    } else {
        tryEnroll();
    }

    // Observe for dynamic page changes (e.g., SPA loading)
    observer = new MutationObserver(() => tryEnroll());
    observer.observe(document.body, { childList: true, subtree: true });
})();
