// ==UserScript==
// @name         Reddit Language Translation Redirect Remover
// @namespace    https://reddit.com
// @version      1.0
// @description  Redirects from translated Reddit pages to original. Automatically removes trailing /?tl=xx from Reddit URLs.
// @author       Xavia91
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512813/Reddit%20Language%20Translation%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/512813/Reddit%20Language%20Translation%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL ends with /?tl=xx (where xx is any 2-letter code)
    let currentUrl = window.location.href;
    let langRegex = /\/\?tl=[a-z]{2}$/;

    if (langRegex.test(currentUrl)) {
        // Remove the /?tl=xx part from the URL
        let newUrl = currentUrl.replace(langRegex, '');

        // Redirect to the new URL
        window.location.replace(newUrl);
    }
})();