// ==UserScript==
// @name         ChatGPT Temporary Chat Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects to temporary chat
// @author       Benny Smith
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501703/ChatGPT%20Temporary%20Chat%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/501703/ChatGPT%20Temporary%20Chat%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle redirections
    function handleRedirect() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (url.pathname === '/' && !params.has('temporary-chat')) {
            params.set('temporary-chat', 'true');
            url.search = params.toString();
            window.location.replace(url.toString());
        }
    }

    // Call the redirect function on page load
    window.addEventListener('load', handleRedirect);

})();
