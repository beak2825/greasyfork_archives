// ==UserScript==
// @name         pythonanywhere link open in a new tab
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Asks user if they want to open a link in a new tab or current tab
// @author       acronot
// @license MIT
// @match        https://www.pythonanywhere.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512092/pythonanywhere%20link%20open%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/512092/pythonanywhere%20link%20open%20in%20a%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS styles for the hover popup
    const style = `
        .hover-popup {
            position: absolute;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: none;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-radius: 6px;
        }
        .hover-popup button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 0 5px;
            cursor: pointer;
            border-radius: 4px;
        }
        .hover-popup button:hover {
            background-color: #0056b3;
        }
    `;

    // Add styles to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);

    // Create a hover popup element
    const popup = document.createElement('div');
    popup.className = 'hover-popup';
    popup.innerHTML = `
        <p>Open link in:</p>
        <button id="open-same-tab">Current Tab</button>
        <button id="open-new-tab">New Tab</button>
    `;
    document.body.appendChild(popup);

    let currentLink = null;

    // Function to handle mouseover on links
    function handleLinkHover(event) {
        currentLink = event.target.href;

        // Position the popup near the cursor
        popup.style.left = event.pageX + 'px';
        popup.style.top = event.pageY + 'px';
        popup.style.display = 'block';
    }

    // Function to handle mouseout from links
    function handleLinkOut(event) {
        // If the mouse moves out of the link but not onto the popup, hide the popup
        const relatedTarget = event.relatedTarget;
        if (!popup.contains(relatedTarget)) {
            popup.style.display = 'none';
        }
    }

    // Function to keep the popup visible when hovering over it
    function handlePopupHover() {
        popup.style.display = 'block';
    }

    // Function to hide the popup when moving out of it
    function handlePopupOut(event) {
        // Hide the popup only when the mouse leaves the popup and isn't over a link
        const relatedTarget = event.relatedTarget;
        if (!relatedTarget || !relatedTarget.tagName || relatedTarget.tagName.toLowerCase() !== 'a') {
            popup.style.display = 'none';
        }
    }

    // Attach event listeners to all links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', handleLinkHover);
        link.addEventListener('mouseout', handleLinkOut);
    });

    // Keep the popup visible when hovered
    popup.addEventListener('mouseover', handlePopupHover);
    popup.addEventListener('mouseout', handlePopupOut);

    // Handle button clicks in the popup
    popup.addEventListener('click', (event) => {
        if (event.target.id === 'open-same-tab') {
            window.location.href = currentLink;  // Open in current tab
        } else if (event.target.id === 'open-new-tab') {
            window.open(currentLink, '_blank');  // Open in new tab
        }
        popup.style.display = 'none';  // Hide popup after selection
    });
})();
