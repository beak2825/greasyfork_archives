// ==UserScript==
// @name         Pop-Up Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block all pop-up ads in Chrome
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525755/Pop-Up%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/525755/Pop-Up%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Save the original window.open function
    const originalWindowOpen = window.open;

    // Override the window.open function
    window.open = function(url, name, specs, replace) {
        console.log(`Blocked pop-up: ${url}`);
        return null; // Return null to block the pop-up
    };

    // Listen for pop-up events
    window.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A' && target.target === '_blank') {
            event.preventDefault();
            console.log(`Blocked pop-up from link: ${target.href}`);
        }
    });

    // Block pop-ups from JavaScript events
    window.addEventListener('beforeunload', function(event) {
        console.log('Blocked pop-up from beforeunload event');
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
    });

    console.log('Pop-Up Blocker is active!');
})();