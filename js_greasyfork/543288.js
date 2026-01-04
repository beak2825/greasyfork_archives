// ==UserScript==
// @name         DiscUdemy 'Take Course' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Auto-clicks 'Take Course' or navigates directly to Udemy on Discudemy "go" pages.
// @author       Bernando Jr Minguita
// @match        https://www.discudemy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discudemy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543288/DiscUdemy%20%27Take%20Course%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543288/DiscUdemy%20%27Take%20Course%27%20Auto-Redirect.meta.js
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

    // Determine if the current page is a "go" redirect page
    const isGoPage = location.pathname.startsWith('/go/');

    // Create a MutationObserver to watch for dynamically loaded content
    const observer = new MutationObserver(() => {
        // Handle either "go" page or regular course listing
        if (isGoPage ? handleGoPage() : handleCoursePage()) {
            observer.disconnect(); // Stop observing after successful action
        }
    });

    // Start observing the page for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Also attempt to handle immediately in case content is already loaded
    if ((isGoPage && handleGoPage()) || (!isGoPage && handleCoursePage())) {
        observer.disconnect();
    }

    /**
     * Handles logic for "go" redirect pages by navigating to the Udemy URL
     * @returns {boolean} true if Udemy link is found and navigation started
     */
    function handleGoPage() {
        // Look for the Udemy course link inside div.ui.segment
        const link = document.querySelector('div.ui.segment a[href*="udemy.com/course/"][href*="couponCode="]');
        if (link?.href) {
            // Redirect browser to the Udemy course URL
            location.href = link.href;
            return true;
        }
        return false; // Link not found yet
    }

    /**
     * Handles logic for regular course pages by clicking the "Take Course" button
     * @returns {boolean} true if button was found and clicked
     */
    function handleCoursePage() {
        // Find the "Take Course" button with expected class names
        const button = document.querySelector('a.ui.big.inverted.green.button.discBtn');
        if (button) {
            button.click(); // Trigger the click to go to course
            return true;
        }
        return false; // Button not found yet
    }
})();