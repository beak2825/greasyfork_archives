// ==UserScript==
// @name         Bluesky Handle Link Button
// @version      1.1
// @namespace    lexd0g.eu.org
// @description  Adds a globe button next to domain handles on Bluesky profiles to open the URL in a new tab.
// @author       @lexd0g.eu.org
// @match        https://*.bsky.app/*
// @grant        none
// @license      CC BY-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/518436/Bluesky%20Handle%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518436/Bluesky%20Handle%20Link%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the globe button
    function addGlobeButton() {
        // Look for handle elements
        const handleElements = document.evaluate(
            "//div[starts-with(@class, 'css-')][starts-with(text(), '@') and string-length(text()) > 1]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < handleElements.snapshotLength; i++) {
            const element = handleElements.snapshotItem(i);

            // Skip if it's inside a post
            if (element.closest('[data-testid="postText"]')) continue;

            const handle = element.textContent.trim().replace('@', '');

            if (element.nextElementSibling?.classList.contains('domain-link-btn')) continue;

            // Get the computed color of the handle text
            const textColor = window.getComputedStyle(element).color;

            // Get link colour
            const linkColor = window.getComputedStyle(document.querySelector('a[target="_blank"]')).color

            const globeButton = document.createElement('button');
            globeButton.innerHTML = '🌐';
            globeButton.className = 'domain-link-btn';
            globeButton.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                vertical-align: text-top;
                font-family: -apple-system, BlinkMacSystemFont;
                position: relative;
                z-index: 1000;
                pointer-events: all;
                color: transparent;
                text-shadow: 0 0 0 ${textColor};
                transition: 0.2s;
            `;

            globeButton.addEventListener('mouseenter', () => {
                globeButton.style.textShadow = `0 0 0 ${linkColor}`;
            });
            globeButton.addEventListener('mouseleave', () => {
                globeButton.style.textShadow = `0 0 0 ${textColor}`;
            });

            globeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.open(`https://${handle}`, '_blank');
            });

            // Find closest link parent and ensure button events don't bubble
            const parentLink = element.closest('a');
            if (parentLink) {
                globeButton.style.position = 'relative';
                globeButton.style.zIndex = '1000';
            }

            element.parentNode.insertBefore(globeButton, element.nextSibling);
        }
    }

    // Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addGlobeButton, 500);
        }
    }).observe(document, {subtree: true, childList: true});

    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        const hasNewNodes = mutations.some(mutation =>
            mutation.addedNodes.length > 0 ||
            mutation.type === 'childList'
        );
        if (hasNewNodes) {
            addGlobeButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    addGlobeButton();
})();