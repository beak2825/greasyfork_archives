// ==UserScript==
// @name        Twitter Notification Hider
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description hide div with specific aria-label
// @author      You
// @match       https://twitter.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466005/Twitter%20Notification%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/466005/Twitter%20Notification%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var divStatus = false; // false means div is visible

    // Create new button
    var button = document.createElement('button');
    button.innerHTML = 'Toggle Div';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 9999;

    // Append to body
    document.body.appendChild(button);

    // Event Listener
    button.addEventListener('click', function() {
        // Search for div
        var divs = document.querySelectorAll('div[aria-label="New Tweets are available. Push the period key to go to the them."]');
        for(var i = 0; i < divs.length; i++) {
            if(divStatus) {
                divs[i].style.display = 'block'; // Show the div
            } else {
                divs[i].style.display = 'none'; // Hide the div
            }
        }
        // Toggle status
        divStatus = !divStatus;
    });
})();
