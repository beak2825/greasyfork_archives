// ==UserScript==
// @name         Force new.reddit.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force new.reddit.com.
// @author       You
// @match        https://new.reddit.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/506307/Force%20newredditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/506307/Force%20newredditcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        work();
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            work();
        });
    }
})();

function work() {

    // Check the condition to prevent a redirect loop
    const shouldNotRedirect = document.querySelectorAll('shreddit-app').length === 0;

    // Function to check if we're already on the messages page
    function isOnMessagesPage() {
        const url = window.location.href.split('?')[0];
        return url === 'https://new.reddit.com/message/messages';
    }

    // If shouldNotRedirect is true and we are not on the messages page, exit the script
    if (shouldNotRedirect && !isOnMessagesPage()) {
        console.log("don't redirect", document.querySelectorAll('shreddit-app'), window.location.href, 'https://new.reddit.com/message/messages' === window.location.href);
        return;
    }

    // Check if we're not on the messages page
    if (!isOnMessagesPage()) {
        // Save the current URL in sessionStorage if not already set
        if (!sessionStorage.getItem('originalUrl')) {
            sessionStorage.setItem('originalUrl', window.location.href);
        }

        // Redirect to the messages page with a full page refresh
        document.location.replace('https://new.reddit.com/message/messages');
    } else {
        // We are on the messages page

        // Retrieve the original URL from sessionStorage
        const originalUrl = sessionStorage.getItem('originalUrl');

        // If there is an original URL stored, navigate back to it
        if (originalUrl) {
            console.log("nav back", originalUrl, window.location.href);
            setTimeout(() => {
                // Use history.pushState to navigate back to the original Reddit page
                history.pushState({}, '', originalUrl);

                // Dispatch a popstate event to notify the React Router of the URL change
                window.dispatchEvent(new PopStateEvent('popstate'));

                // Clear the stored original URL after navigation
                sessionStorage.removeItem('originalUrl');
            }, 1); // Adjust the delay as needed to ensure messages are checked
        }
    }
}