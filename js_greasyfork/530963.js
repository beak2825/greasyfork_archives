// ==UserScript==
// @name         Twonky host origin fix
// @namespace    https://greasyfork.org/en/users/1443383
// @version      1.0
// @license      MIT
// @description  Fixes image/link/url references to the local host automatically, allowing you to browse servers normally. Functionality inspired by 'Twonky Viewer' chrome extension developed by 
// @author       kryo
// @match        *://*:9000/*
// @match        *://*:9001/*
// @match        *://*:9002/*
// @match        *://*:9443/*
// @include      *://*:*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530963/Twonky%20host%20origin%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/530963/Twonky%20host%20origin%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TWONKY_PORTS = ['9000', '9001', '9002', '9443'];
    // Regex to match http(s)://127.0.0.1:PORT/... where PORT is one of the Twonky ports
    const urlPattern = new RegExp(`^https?:\/\/127\\.0\\.0\\.1:(${TWONKY_PORTS.join('|')})(\/|$)`);
    // Get the correct hostname from the current page URL
    const correctHostname = window.location.hostname;

    // --- Function to fix attributes of a given node ---
    function fixNodeAttributes(node) {
        // Only process element nodes
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        // List of attributes that commonly contain URLs
        const urlAttributes = ['src', 'href', 'action', 'data-url']; // Add other attributes if needed

        urlAttributes.forEach(attr => {
            if (node.hasAttribute(attr)) {
                const originalUrl = node.getAttribute(attr);
                if (originalUrl && urlPattern.test(originalUrl)) {
                    const newUrl = originalUrl.replace('127.0.0.1', correctHostname);
                    console.log(`Tampermonkey: Fixing URL in ${node.tagName} ${attr}: ${originalUrl} -> ${newUrl}`);
                    node.setAttribute(attr, newUrl);
                    // Special handling for anchors to potentially update text content if it mirrors the href
                    if (node.tagName === 'A' && node.textContent === originalUrl) {
                         node.textContent = newUrl;
                    }
                }
            }
        });

        // Add specific handling for other elements/attributes if necessary
        // e.g., <object data="...">, <embed src="...">, background-image styles
        if (node.style && node.style.backgroundImage) {
            const originalUrl = node.style.backgroundImage;
            // Basic check: url("http://127.0.0.1:9000/...")
            if (originalUrl.includes('url("') && originalUrl.includes('127.0.0.1:')) {
                 // More robust regex might be needed here depending on variations
                 const potentialUrl = originalUrl.substring(originalUrl.indexOf('url("') + 5, originalUrl.lastIndexOf('")'));
                 if (urlPattern.test(potentialUrl)) {
                     const newUrl = potentialUrl.replace('127.0.0.1', correctHostname);
                     console.log(`Tampermonkey: Fixing background-image URL: ${potentialUrl} -> ${newUrl}`);
                     node.style.backgroundImage = `url("${newUrl}")`;
                 }
            }
        }
    }

    // --- Function to recursively scan a node and its children ---
    function scanAndFixNodes(node) {
        fixNodeAttributes(node);
        // Recursively scan child elements
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                scanAndFixNodes(node.children[i]);
            }
        }
    }

    // --- MutationObserver to watch for dynamically added elements ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check added nodes
            mutation.addedNodes.forEach(newNode => {
                scanAndFixNodes(newNode); // Scan the new node and its children
            });

            // Check if attributes changed (less common for initial load, but good for dynamic updates)
            if (mutation.type === 'attributes' && mutation.target) {
                 fixNodeAttributes(mutation.target);
            }
        });
    });

    // --- Start observing ---
    // We run at document-start, so wait for the documentElement to be available
    // and observe it for additions/changes to head and body
    const observerConfig = {
        childList: true, // Watch for adding/removing child nodes
        subtree: true,   // Watch descendants as well
        attributes: true, // Watch for attribute changes
        attributeFilter: ['src', 'href', 'action', 'data-url', 'style'] // Optional: Be specific about watched attributes
    };

    // Function to start the observer once the document element exists
    function observeRoot() {
        if (document.documentElement) {
             console.log('Tampermonkey: Twonky Fixer - Starting MutationObserver.');
             observer.observe(document.documentElement, observerConfig);

             // --- Initial Scan ---
             // Perform an initial scan of the document in case elements already exist
             // when the script runs (especially important if @run-at is not document-start,
             // but good practice anyway).
             console.log('Tampermonkey: Twonky Fixer - Performing initial DOM scan.');
             scanAndFixNodes(document.documentElement);
        } else {
            // If documentElement is not yet ready (should be rare with document-start), retry shortly
            console.log('Tampermonkey: Twonky Fixer - documentElement not ready, retrying...');
            setTimeout(observeRoot, 50);
        }
    }

    observeRoot();

    // Optional: Disconnect observer when page unloads (usually not strictly necessary for userscripts)
    // window.addEventListener('unload', () => {
    //     if (observer) {
    //         observer.disconnect();
    //         console.log('Tampermonkey: Twonky Fixer - Disconnected MutationObserver.');
    //     }
    // });

})();