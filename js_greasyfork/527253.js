// ==UserScript==
// @name         Perplexity Text Size Fix
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Forces smaller text in input areas
// @match        *://www.perplexity.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527253/Perplexity%20Text%20Size%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/527253/Perplexity%20Text%20Size%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the notification element
    const notification = document.createElement('div');

    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '14px';
    notification.style.textAlign = 'center';

    // Set the notification message
    notification.textContent = 'Perplexity fixed the user prompt text being too big, this script is no longer needed you can delete it';

    // Add the notification to the page
    document.body.appendChild(notification);
})();