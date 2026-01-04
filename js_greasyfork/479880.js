// ==UserScript==
// @name         Redirect Reddit Homepage to /new
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Redirects reddit.com to reddit.com/new
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479880/Redirect%20Reddit%20Homepage%20to%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/479880/Redirect%20Reddit%20Homepage%20to%20new.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectIfHomePage() {
        // Check if the current URL is the Reddit homepage
        if (window.location.hostname === 'www.reddit.com' && window.location.pathname === '/') {
            // Redirect to reddit.com/new
            window.location.replace('https://www.reddit.com/new');
        }
    }

    // Call the function immediately
    redirectIfHomePage();

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(redirectIfHomePage);

    // Observe changes in the document
    observer.observe(document.body, { childList: true, subtree: true });
})();
