// ==UserScript==
// @name        Show Original Plugin names on FestingerVault
// @namespace   FestingerOriginal
// @match       https://festingervault.com/*
// @grant       none
// @version     1.6
// @author      Ignasiuz
// @description Show original titles in card elements.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526888/Show%20Original%20Plugin%20names%20on%20FestingerVault.user.js
// @updateURL https://update.greasyfork.org/scripts/526888/Show%20Original%20Plugin%20names%20on%20FestingerVault.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalStateActive = false; // To track if the original titles are shown
    const originalTitlesMap = new Map(); // Map to store original titles

    // Function to update card titles based on current state
    const updateCardTitles = () => {
        document.querySelectorAll('.ts-preview').forEach(card => {
            const subtitleElement = card.querySelector('span.elementor-heading-title');
            const titleElement = card.querySelector('.elementor-heading-title a');

            if (subtitleElement && titleElement) {
                const currentTitle = titleElement.textContent;

                // Store the original title on the first toggle
                if (!originalTitlesMap.has(card)) {
                    const original = {
                        subtitle: subtitleElement.textContent,
                        title: currentTitle
                    };
                    originalTitlesMap.set(card, original);
                }

                const originalTitles = originalTitlesMap.get(card);

                if (originalTitles) {
                    const originalTitleMatch = originalTitles.subtitle.match(/forked from (.+?) by/);
                    const originalTitle = originalTitleMatch ? originalTitleMatch[1] : '';
                    const version = extractVersion(currentTitle);

                    if (originalStateActive && originalTitle) {
                        // Show original title details
                        subtitleElement.textContent = `fork name: ${currentTitle}`;
                        titleElement.innerHTML = `${originalTitle} ${styleVersion(version)}`;
                    } else {
                        // Revert to the original titles
                        subtitleElement.textContent = originalTitles.subtitle;
                        titleElement.textContent = originalTitles.title;
                    }
                }
            }
        });
    };

    // Style the version number
    const styleVersion = version => {
        return `<span style="
            background-color: #f0f0f0;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
            padding: 2px 5px;
            display: inline-block;
            vertical-align: middle;
        ">${version}</span>`;
    };

    // Helper function to extract a version number from the title
    const extractVersion = title => {
        const match = title.match(/(\d+\.\d+\.\d+)/);
        return match ? match[0] : '';
    };

    // Function to create and append a toggle button
    const addShowOriginalButton = () => {
        const header = document.querySelector('.post-feed-header');
        if (header && !document.getElementById('toggle-button')) {
            const button = document.createElement('button');
            button.id = 'toggle-button';
            button.innerText = 'Toggle Titles';
            button.style.borderRadius = '15px';
            button.style.backgroundColor = 'white';
            button.style.color = '#2c3e50';
            button.style.border = '1px solid #2c3e50';
            button.style.padding = '5px 10px';
            button.style.marginLeft = '10px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.position = 'relative';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

            // Add a green dot indicator here if needed
            let isButtonActive = false;

            button.onclick = () => {
                originalStateActive = !originalStateActive;
                updateCardTitles();
                isButtonActive = !isButtonActive;
                button.style.boxShadow = isButtonActive ? '0 0 10px green' : '0 2px 4px rgba(0, 0, 0, 0.1)';
            };

            header.appendChild(button);
        }
    };

    // Set up observers for dynamic content changes
    const observeContentChanges = () => {
        const feed = document.querySelector('.post-feed-grid');
        if (feed) {
            const observer = new MutationObserver(() => {
                updateCardTitles();
            });

            observer.observe(feed, {
                childList: true,
                subtree: true
            });
        }
    };

    // Initialize on page load
    window.addEventListener('load', () => {
        addShowOriginalButton();
        observeContentChanges();
    });

})();
