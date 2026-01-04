// ==UserScript==
// @name         Vercel Project Deletion Form Filler
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically fills in project deletion form fields on Vercel. This script extracts the project name from the page and fills it into the appropriate input field, along with the verification text. Use with caution as it automates deletion form filling.
// @author       YourName
// @match        https://vercel.com/*/settings
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505742/Vercel%20Project%20Deletion%20Form%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/505742/Vercel%20Project%20Deletion%20Form%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract project name from HTML
    function getProjectName() {
        const selectors = [
            'b[style*="overflow-wrap: anywhere"]',
            'p strong',
            'label b',
            'p b'
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return null;
    }

    // Function to fill the form
    function fillForm() {
        const projectName = getProjectName();
        if (!projectName) {
            console.error('Could not find project name');
            return;
        }

        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));

        const projectNameInput = inputs.find(input =>
            input.getAttribute('aria-label')?.toLowerCase().includes('resource name') ||
            input.getAttribute('name')?.toLowerCase().includes('resourcename') ||
            input.getAttribute('placeholder')?.toLowerCase().includes('project name')
        );
        if (projectNameInput) {
            projectNameInput.value = projectName;
            projectNameInput.dispatchEvent(new Event('input', { bubbles: true }));
            projectNameInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const verificationInput = inputs.find(input =>
            input.getAttribute('aria-label')?.toLowerCase().includes('verification') ||
            input.getAttribute('name')?.toLowerCase().includes('verification') ||
            input.getAttribute('placeholder')?.toLowerCase().includes('delete my project')
        );
        if (verificationInput) {
            verificationInput.value = 'delete my project';
            verificationInput.dispatchEvent(new Event('input', { bubbles: true }));
            verificationInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', fillForm);

    // Also run it immediately in case the page is already loaded
    fillForm();

    // Add a mutation observer to handle dynamic content loading
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                fillForm();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();