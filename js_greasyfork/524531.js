// ==UserScript==
// @name         Medium to Periscope Viewer (Unlock Premium Articles)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a minimal button to open premium Medium articles in Periscope.
// @author       Adish Sagarawat
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @match        https://*.medium.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524531/Medium%20to%20Periscope%20Viewer%20%28Unlock%20Premium%20Articles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524531/Medium%20to%20Periscope%20Viewer%20%28Unlock%20Premium%20Articles%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Function to create and add button
    function addPeriscopeButton() {
        // Check if button already exists
        if (document.getElementById('periscope-button')) return;
        // Create container
        const container = document.createElement('div');
        container.id = 'periscope-button';
        // Set styles for container
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',  // Changed from top to bottom
            right: '20px',
            zIndex: '9999999',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            color: 'black',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(0,0,0,0.1)'
        });
        // Add button content
        container.innerHTML = `
            <svg style="margin-right: 8px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Open in Periscope
        `;
        // Add hover effects
        container.addEventListener('mouseover', () => {
            container.style.transform = 'translateY(-2px)';
            container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        container.addEventListener('mouseout', () => {
            container.style.transform = 'translateY(0)';
            container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
        // Add click handler
        container.addEventListener('click', () => {
            const currentUrl = window.location.href;
            window.location.href = `https://periscope.corsfix.com/?${currentUrl}`;
        });
        // Add to page
        document.body.appendChild(container);
    }
    // Initial addition of button
    setTimeout(addPeriscopeButton, 1000);
    // Handle dynamic page changes (for Single Page Applications)
    const observer = new MutationObserver((mutations) => {
        setTimeout(addPeriscopeButton, 1000);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();