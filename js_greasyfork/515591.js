// ==UserScript==
// @name         Navigation Lock for QuickConnect
// @namespace    https://github.com/DennisGHUA/Navigation-Lock
// @version      1.2.1
// @description  Prevents backward and forward navigation on the QuickConnect domain to avoid unintended navigations.
// @match        *://*.quickconnect.to/*
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/DennisGHUA/Navigation-Lock/refs/heads/main/Icon.png
// @downloadURL https://update.greasyfork.org/scripts/515591/Navigation%20Lock%20for%20QuickConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/515591/Navigation%20Lock%20for%20QuickConnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Anchor the user in the current page by setting the same state repeatedly.
    history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
        history.pushState(null, document.title, window.location.href);
    });

    // Prevent any unload or navigation attempts.
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });

})();
