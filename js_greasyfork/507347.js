// ==UserScript==
// @name        API WhatsApp To WEB WhatsApp Redirect with Debug
// @icon        https://i.imgur.com/r2qkepk.png
// @namespace   Whatsapp API
// @include     *://api.whatsapp.com/*
// @version     1.2
// @author      SleepTheGod
// @namespace   SleepTheGod
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license     GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @run-at      document-start
// @description Redirects API WhatsApp links to Web WhatsApp and logs page information for debugging.
// @downloadURL https://update.greasyfork.org/scripts/507347/API%20WhatsApp%20To%20WEB%20WhatsApp%20Redirect%20with%20Debug.user.js
// @updateURL https://update.greasyfork.org/scripts/507347/API%20WhatsApp%20To%20WEB%20WhatsApp%20Redirect%20with%20Debug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debugging the entire page
    console.debug("Page URL: ", location.href);
    console.debug("Page Hostname: ", location.hostname);
    console.debug("Document Title: ", document.title);
    console.debug("Document Cookies: ", document.cookie);
    console.debug("User Agent: ", navigator.userAgent);
    console.debug("Full HTML of the page: ", document.documentElement.outerHTML);

    // Check if the URL contains 'api.whatsapp'
    if (location.hostname === 'api.whatsapp.com') {
        // Debug the redirection action
        console.debug("Redirecting from API to Web WhatsApp...");

        // Redirect to 'web.whatsapp.com' with the same path and query parameters
        const newUrl = location.href.replace('api.whatsapp.com', 'web.whatsapp.com');
        console.debug("New URL: ", newUrl);
        location.replace(newUrl);
    }
})();
