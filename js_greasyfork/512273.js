// ==UserScript==
// @name         Torn Halloween Profile Navigator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Navigate to the next profile in numerical order on Torn
// @author       TLDR [3348219]
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512273/Torn%20Halloween%20Profile%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/512273/Torn%20Halloween%20Profile%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Next Profile';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';

    // Add click event listener
    button.addEventListener('click', () => {
        const currentURL = window.location.href;
        const xidMatch = currentURL.match(/XID=(\d+)/);
        
        if (xidMatch) {
            const currentXID = parseInt(xidMatch[1]);
            const nextXID = currentXID + 1;
            window.location.href = `https://www.torn.com/profiles.php?XID=${nextXID}`;
        }
    });

    // Add the button to the page
    document.body.appendChild(button);
})();