// ==UserScript==
// @name         CourseJoiner 'APPLY HERE' Auto-Redirect
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically redirects to the Udemy course link from CourseJoiner's "APPLY HERE" button on free course pages.
// @author       Bernando Jr Minguita
// @match        https://www.coursejoiner.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursejoiner.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543316/CourseJoiner%20%27APPLY%20HERE%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543316/CourseJoiner%20%27APPLY%20HERE%27%20Auto-Redirect.meta.js
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
     * Finds the Udemy course URL in the "APPLY HERE" button and redirects to it.
     */
    function redirectToUdemyCourse() {
        const anchor = document.querySelector(
            'a.wp-block-button__link.has-black-color.wp-element-button'
        );

        if (!anchor || !anchor.href) {
            console.log('[CourseJoiner Redirect] "APPLY HERE" button not found or href missing.');
            return null;
        }

        const udemyUrl = anchor.href;
        console.log('[CourseJoiner Redirect] Redirecting to:', udemyUrl);

        // Use replace() to avoid keeping this page in history
        window.location.replace(udemyUrl);
        return udemyUrl;
    }

    // Run once DOM is fully parsed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToUdemyCourse);
    } else {
        redirectToUdemyCourse();
    }
})();
