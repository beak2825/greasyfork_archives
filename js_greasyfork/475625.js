// ==UserScript==
// @license MIT
// @name         RBXGold Rain Bot
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Working as of 4/26/2024
// @match        *://*.rbxgold.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475625/RBXGold%20Rain%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/475625/RBXGold%20Rain%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // Create the popup element
    const popup = document.createElement('div');
    popup.id = 'rbxgold-popup';
    popup.style.position = 'fixed';
    popup.style.left = '0';
    popup.style.top = '0';
    popup.style.background = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.zIndex = '9999';
 
    // Add the content to the popup
    popup.innerHTML = `
        <div id="status">Inactive</div>
    `;
 
    // Append the popup to the document body
    document.body.appendChild(popup);
 
    // Function to update the popup status and click the button if found
    function updatePopup() {
        const statusElement = document.getElementById('status');
        if (window.location.hostname === 'rbxgold.com') {
            statusElement.textContent = 'Active https://discord.gg/u3uJ7sTBG5';
 
            // Find the target HTML element
            const targetElement = document.querySelector('div.BaseElement.Box.align-end button.BaseElement.Box.Button.goldButton.primary.size-xs.justify-center.align-center.border-radius.hover.background-color-s2 span.BaseElement.Span.size-xs');
 
            if (targetElement) {
                // Click the button if found
                targetElement.click();
            }
        } else {
            statusElement.textContent = 'Inactive';
        }
    }
 
    // Call the updatePopup function when the page loads
    window.addEventListener('load', updatePopup);
 
    // Check for the element and click it every 5 seconds (you can adjust the interval as needed)
    setInterval(updatePopup, 500);
})();