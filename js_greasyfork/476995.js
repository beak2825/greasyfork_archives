// ==UserScript==
// @name         MORS CLIENT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates an overlay with a styled side panel and content area that can be toggled with the "]" key.
// @author       Your Name
// @match        *://*.educationperfect.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476995/MORS%20CLIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/476995/MORS%20CLIENT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the overlay div
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlayDiv.style.display = 'none';
    overlayDiv.style.zIndex = '9999';
    document.body.appendChild(overlayDiv);

    // Create the side panel div
    const sidePanelDiv = document.createElement('div');
    sidePanelDiv.style.width = '200px';
    sidePanelDiv.style.height = '100%';
    sidePanelDiv.style.backgroundColor = '#333';
    sidePanelDiv.style.color = '#fff';
    sidePanelDiv.style.float = 'left';
    sidePanelDiv.style.display = 'flex'; // Center-align the buttons
    sidePanelDiv.style.flexDirection = 'column'; // Stack buttons vertically
    sidePanelDiv.style.alignItems = 'center'; // Center horizontally
    sidePanelDiv.style.justifyContent = 'flex-start'; // Push buttons up
    overlayDiv.appendChild(sidePanelDiv);

    // Create the content area div
    const contentDiv = document.createElement('div');
    contentDiv.style.width = 'calc(100% - 200px)';
    contentDiv.style.height = '100%';
    contentDiv.style.float = 'right';
    contentDiv.style.padding = '20px';
    contentDiv.style.overflowY = 'auto';
    contentDiv.style.color = '#333';
    contentDiv.style.backgroundColor = '#fff';
    contentDiv.style.borderLeft = '1px solid #333';
    contentDiv.style.borderRadius = '0 10px 10px 0'; // Rounded corners on the right
    contentDiv.innerHTML = 'Select a button to show content.';
    overlayDiv.appendChild(contentDiv);

    // Create buttons in the side panel
    const buttonLabels = ["Google", "ls", "Chat", "Button 4", "Button 5"];
    for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.textContent = buttonLabels[i];
        button.style.display = 'block';
        button.style.marginTop = '10px'; // Push buttons up
        button.style.padding = '15px'; // Increase button padding
        button.style.width = '150px'; // Increase button width
        button.style.backgroundColor = '#555';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '10px'; // Rounded corners
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            if (buttonLabels[i] === "Google") {
                contentDiv.innerHTML = `<iframe src="https://a.rare1k.space/" style="width: 100%; height: 100%; border: none;"></iframe>`;
            } else if (buttonLabels[i] === "Chat") {
                contentDiv.innerHTML = `<iframe src="https://chatify.jwz6.repl.co/" style="width: 100%; height: 100%; border: none;"></iframe>`;
            } else {
                contentDiv.innerHTML = `Content for ${buttonLabels[i]}`;
            }
        });
        sidePanelDiv.appendChild(button);
    }

    // Toggle the overlay with the "]" key, but only if not inside the iframe
    document.addEventListener('keydown', (event) => {
        if (event.key === ']' && window.self === window.top) {
            overlayDiv.style.display = overlayDiv.style.display === 'none' ? 'block' : 'none';
        }
    });
})();
