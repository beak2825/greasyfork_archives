// ==UserScript==
// @name         Medium to Freedium
// @name:ru [VOT] - Medium в Freedium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace medium.com with freedium.cfd
// @description:ru  Заменяет medium.com на freedium.cfd
// @author       Stakancheck
// @license      MIT
// @match        https://medium.com/*
// @grant        none
// @icon         https://www.svgrepo.com/show/354057/medium-icon.svg
// @namespace vot
// @downloadURL https://update.greasyfork.org/scripts/484854/Medium%20to%20Freedium.user.js
// @updateURL https://update.greasyfork.org/scripts/484854/Medium%20to%20Freedium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if there is a button with aria-label="Member-only story"
    var memberOnlyButton = document.querySelector('button[aria-label="Member-only story"]');
    if (!memberOnlyButton) {
        // If there is no such button, stop the script
        return;
    }

    // Create a button
    var button = document.createElement('button');
    button.textContent = 'freedium';
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.bottom = '10px';
    button.style.zIndex = 9999;

    // Add click event to the button
    button.addEventListener('click', function() {
        // Replace medium.com with freedium.cfd in the current URL
        var newUrl = window.location.href.replace('medium.com', 'freedium.cfd');
        // Open the new URL in the same tab
        window.location.href = newUrl;
    });

    // Add the button to the body of the document
    document.body.appendChild(button);
})();
