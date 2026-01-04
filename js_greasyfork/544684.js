// ==UserScript==
// @name         Heading Fragment Linker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add clickable fragment links to all headings
// @author       maanimis
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544684/Heading%20Fragment%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/544684/Heading%20Fragment%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a URL-safe ID from heading text
    function createIdFromText(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-')          // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
    }

    // Function to make headings clickable
    function makeHeadingsClickable() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headings.forEach((heading, index) => {
            // Skip if heading already has an ID
            if (heading.id) return;

            // Create ID from heading text or use fallback
            let id = createIdFromText(heading.textContent);

            // Ensure ID is unique
            if (!id || document.getElementById(id)) {
                id = `heading-${index + 1}`;
            }

            // Assign the ID
            heading.id = id;

            // Add click event to update URL
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', function(e) {
                // Only update URL if it's different from current hash
                if (window.location.hash !== `#${this.id}`) {
                    history.replaceState(null, null, `#${this.id}`);
                    // Scroll to the element after updating URL
                    this.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Function to scroll to heading if URL contains hash (only on initial load)
    function scrollToHashOnLoad() {
        if (window.location.hash) {
            // Wait a bit for content to load
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    // Run immediately
    makeHeadingsClickable();

    // Only scroll to hash on initial page load, not on subsequent hash changes
    if (!window.location.hash || !window.sessionStorage.getItem('hashScrolled')) {
        scrollToHashOnLoad();
        window.sessionStorage.setItem('hashScrolled', 'true');
    }

    // Re-run when new content is added (for SPAs)
    const observer = new MutationObserver(() => {
        makeHeadingsClickable();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
