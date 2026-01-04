// ==UserScript==
// @name         YouTube to Invidious
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds an Invidious button to YouTube's interface
// @author       Kenzo Portela
// @license      MIT
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539017/YouTube%20to%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/539017/YouTube%20to%20Invidious.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - change this to your preferred Invidious instance
    const invidiousInstance = 'yewtu.be';

    // Function to create and add the Invidious button
    function addInvidiousButton() {
        // Find the button container (near like/dislike/share buttons)
        const buttonContainer = document.querySelector('#top-level-buttons-computed, #menu-container .ytd-menu-renderer');

        if (!buttonContainer) {
            // Try again in case the page isn't fully loaded
            setTimeout(addInvidiousButton, 1000);
            return;
        }

        // Check if we've already added the button
        if (document.getElementById('invidious-button')) {
            return;
        }

        // Get current video ID
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        // Create the button element
        const invidiousButton = document.createElement('button');
        invidiousButton.id = 'invidious-button';
        invidiousButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
        invidiousButton.title = 'Open this video in Invidious';

        // Create the button icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'yt-spec-button-shape-next__icon';

        // Create the SVG icon
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('viewBox', '0 0 24 24');
        svgIcon.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgIcon.style.width = '24px';
        svgIcon.style.height = '24px';
        svgIcon.style.fill = 'currentColor';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z');
        svgIcon.appendChild(path);
        iconContainer.appendChild(svgIcon);

        // Create the button text
        const buttonText = document.createElement('span');
        buttonText.className = 'yt-spec-button-shape-next__button-text-content';
        buttonText.textContent = 'Invidious';

        // Assemble the button
        invidiousButton.appendChild(iconContainer);
        invidiousButton.appendChild(buttonText);

        // Add click handler to open in current tab
        invidiousButton.addEventListener('click', () => {
            window.location.href = `https://${invidiousInstance}/watch?v=${videoId}`;
        });

        // Insert the button in the container (before the share button if possible)
        const shareButton = buttonContainer.querySelector('#button-shape-share, [aria-label="Share"]');
        if (shareButton) {
            shareButton.parentNode.insertBefore(invidiousButton, shareButton);
        } else {
            buttonContainer.appendChild(invidiousButton);
        }

        // Add custom styling
        const style = document.createElement('style');
        style.textContent = `
            #invidious-button {
                margin-left: 8px;
                color: var(--yt-spec-text-primary);
                background-color: #272727 !important;
                border-radius: 18px !important;
                padding: 0 16px !important;
                transition: background-color 0.2s ease !important;
                border: none;
                cursor: pointer;
            }
            #invidious-button:hover {
                background-color: #3F3F3F !important;
            }
            #invidious-button .yt-spec-button-shape-next__icon {
                margin-right: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    // Run the function when the page loads
    addInvidiousButton();

    // Also run it when YouTube's dynamic content loads (for SPA navigation)
    const observer = new MutationObserver(function(mutations) {
        addInvidiousButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();