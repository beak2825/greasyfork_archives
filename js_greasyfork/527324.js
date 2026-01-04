// ==UserScript==
// @name         Wikipedia Simple Redirect with Button
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Provide a button to switch to Simple Wikipedia and back to Normal Wikipedia
// @author       Drewby123
// @match        https://en.wikipedia.org/*
// @match        https://simple.wikipedia.org/*
// @match        https://en.m.wikipedia.org/*
// @match        https://simple.m.wikipedia.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527324/Wikipedia%20Simple%20Redirect%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527324/Wikipedia%20Simple%20Redirect%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to toggle between Simple and Normal Wikipedia
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '12px 18px'; // Slightly larger padding for easier tapping
    button.style.borderRadius = '8px'; // Slightly rounder corners for better design
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.fontSize = '14px'; // Ensure text is readable on smaller screens
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Add shadow for visibility

    // Adjust button size for small screens
    if (window.innerWidth <= 600) {
        button.style.padding = '10px 15px'; // Smaller padding on very small screens
        button.style.fontSize = '12px'; // Adjust font size for small screens
    }

    // Function to update the button text based on the current site
    function updateButtonText() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('https://en.wikipedia.org/wiki/')) {
            button.textContent = 'Switch to Simple Wikipedia';
        } else if (currentUrl.includes('https://simple.wikipedia.org/wiki/')) {
            button.textContent = 'Switch to Normal Wikipedia';
        } else if (currentUrl.includes('https://en.m.wikipedia.org/wiki/')) {
            button.textContent = 'Switch to Simple Wikipedia Mobile';
        } else if (currentUrl.includes('https://simple.m.wikipedia.org/wiki/')) {
            button.textContent = 'Switch to Normal Wikipedia Mobile';
        }
    }

    // Add button to the page
    document.body.appendChild(button);

    // Update the button text when the page loads
    updateButtonText();

    // Function to toggle between Simple and Normal Wikipedia
    button.addEventListener('click', () => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('https://en.wikipedia.org/wiki/')) {
            // Redirect to Simple Wikipedia
            const newUrl = currentUrl.replace('en.wikipedia.org', 'simple.wikipedia.org');
            window.location.href = newUrl;
        } else if (currentUrl.includes('https://simple.wikipedia.org/wiki/')) {
            // Redirect to Normal Wikipedia
            const newUrl = currentUrl.replace('simple.wikipedia.org', 'en.wikipedia.org');
            window.location.href = newUrl;
        } else if (currentUrl.includes('https://en.m.wikipedia.org/wiki/')) {
            // Redirect to Simple Wikipedia Mobile
            const newUrl = currentUrl.replace('en.m.wikipedia.org', 'simple.m.wikipedia.org');
            window.location.href = newUrl;
        } else if (currentUrl.includes('https://simple.m.wikipedia.org/wiki/')) {
            // Redirect to Normal Wikipedia Mobile
            const newUrl = currentUrl.replace('simple.m.wikipedia.org', 'en.m.wikipedia.org');
            window.location.href = newUrl;
        }
    });
})();
