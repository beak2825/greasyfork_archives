// ==UserScript==
// @name         Redirect Medium URLs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button at the beginning of the body on medium.com to redirect to a modified URL
// @author       Your name
// @match        *://*.medium.com/*
// @grant        none

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/491941/Redirect%20Medium%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/491941/Redirect%20Medium%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    var redirectButton = document.createElement('button');
    redirectButton.textContent = 'Read on Medium-Free';
    redirectButton.style.position = 'fixed';
    redirectButton.style.top = '20px';
    redirectButton.style.left = '20px';
    redirectButton.style.zIndex = '9999';
    redirectButton.style.padding = '10px';
    redirectButton.style.backgroundColor = '#007bff';
    redirectButton.style.color = '#fff';
    redirectButton.style.border = 'none';
    redirectButton.style.borderRadius = '5px';
    redirectButton.style.cursor = 'pointer';

    // Get the current URL
    var currentUrl = window.location.href;

    // Modify the URL
    var redirectUrl = currentUrl.replace("medium.com", "medium-free.vercel.app/read?url=" + encodeURIComponent(currentUrl));

    // Add click event listener to redirect the page
    redirectButton.addEventListener('click', function() {
        window.location.href = redirectUrl;
    });

    // Add the button to the body
    document.body.appendChild(redirectButton);
})();