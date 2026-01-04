// ==UserScript==
// @name         Nyaa link
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Provides nyaa link
// @author       You
// @match        *://*.kitsu.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520417/Nyaa%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/520417/Nyaa%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the main logic
    const processPage = () => {
        try {
            // Find the <li> element containing <strong>Japanese (Romaji)</strong>
            const targetLi = Array.from(document.querySelectorAll('li')).find(li => {
                return li.querySelector('strong')?.textContent.trim() === 'Japanese (Romaji)';
            });

            if (!targetLi) return; // Exit if not found

            // Extract the text inside the <span> element within the found <li>
            const spanContent = targetLi.querySelector('span')?.textContent.trim();

            if (!spanContent) return; // Exit if no span content

            // Sanitize the string for use in a URL
            const sanitizedString = encodeURIComponent(spanContent);

            // Construct the URL
            const queryUrl = `https://nyaa.si/?q=${sanitizedString}`;

            // Check if the link already exists to avoid duplicates
            if (document.querySelector(`a[href='${queryUrl}']`)) return;

            // Create an image element for the favicon
            const faviconImg = document.createElement('img');
            faviconImg.src = 'https://nyaa.si/static/favicon.png';
            faviconImg.alt = 'Link';
            faviconImg.style.width = '16px'; // Optional: Adjust the size
            faviconImg.style.height = '16px';

            // Create the link element
            const linkElement = document.createElement('a');
            linkElement.href = queryUrl;
            linkElement.target = '_blank'; // Open in a new tab
            linkElement.appendChild(faviconImg);
            linkElement.className = 'nyaa-link'; // Add a unique class name

            // Append the link to the end of the element with class "media--title"
            const targetContainer = document.querySelector('.media--title');

            if (targetContainer) {
                const existingLinks = document.querySelectorAll('.nyaa-link');
                existingLinks.forEach(link => link.remove());
                targetContainer.appendChild(linkElement);
            }
        } catch (error) {
            console.error('Error occurred in the script:', error);
        }
    };

    // Observe DOM changes continuously for dynamic React updates
    const observeDOMChanges = () => {
        const observer = new MutationObserver(() => {
            processPage(); // Check and process whenever the DOM changes
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Observe URL changes (useful for React sites)
    let previousUrl = location.href;
    const observeURLChanges = () => {
        const urlObserver = new MutationObserver(() => {
            if (location.href !== previousUrl) {
                previousUrl = location.href;
                processPage(); // Re-run the logic on URL change
            }
        });

        urlObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Initial setup
    processPage();
    observeDOMChanges();
    observeURLChanges();
})();