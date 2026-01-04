// ==UserScript==
// @name         Show Retweeters
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a button to view retweeters on x.com tweet pages.
// @author       anthonymo
// @match        https://x.com/*/status/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509757/Show%20Retweeters.user.js
// @updateURL https://update.greasyfork.org/scripts/509757/Show%20Retweeters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    const button = document.createElement('button');
    button.textContent = 'Show Retweeters';
    button.style.position = 'fixed';
    button.style.bottom = '60px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#1DA1F2';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener('click', () => {
        const currentUrl = window.location.href;
        // Check if '/retweets' is already appended
        if (!currentUrl.includes('/retweets')) {
            // Redirect to the retweets page
            window.location.href = `${currentUrl}/retweets`;
        }
    });
})();