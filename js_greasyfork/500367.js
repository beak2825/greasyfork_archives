// ==UserScript==
// @name         Add redirect confirmation to reddit links (written for old)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Confirm navigation for links containing 'user', 'permalink', or 'parent' on Reddit
// @author       cgpt
// @match        *://*.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500367/Add%20redirect%20confirmation%20to%20reddit%20links%20%28written%20for%20old%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500367/Add%20redirect%20confirmation%20to%20reddit%20links%20%28written%20for%20old%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the modal
    function showModal(link) {
        // Create the modal container
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '10000';

        // Function to remove the modal
        function removeModal() {
            document.body.removeChild(modal);
        }

        // Event listener for modal close scenarios
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                removeModal();
            }
        });

        // Escape key handler
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                removeModal();
            }
        }, { once: true }); // Automatically removes listener after first use

        // Create the modal content
        const modalContent = document.createElement('div');
        modalContent.style.padding = '20px';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '5px';
        modalContent.innerText = `Navigate to ${link.href}?`;

        // Create Yes button
        const yesButton = document.createElement('button');
        yesButton.innerText = 'Yes';
        yesButton.onclick = function() {
            window.location.href = link.href;
        };

        // Create No button
        const noButton = document.createElement('button');
        noButton.innerText = 'No';
        noButton.onclick = removeModal;

        modalContent.appendChild(yesButton);
        modalContent.appendChild(document.createTextNode(' ')); // Spacer
        modalContent.appendChild(noButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Function to check if the hash fragment has a significant change
    function isHashFragmentChanged(oldUrl, newUrl) {
        const oldUrlObj = new URL(oldUrl);
        const newUrlObj = new URL(newUrl);

        // Check if the base URL (without the hash) is the same
        if (oldUrlObj.origin + oldUrlObj.pathname !== newUrlObj.origin + newUrlObj.pathname) {
            return true; // Base URL is different, so show the modal
        }

        // Check if the hash has significantly changed
        if (oldUrlObj.hash !== newUrlObj.hash && newUrlObj.hash) {
            const oldHash = oldUrlObj.hash.replace(/^#/, '');
            const newHash = newUrlObj.hash.replace(/^#/, '');
            // Compare hash changes. If they are not minor, return true to show the modal
            return oldHash !== newHash;
        }

        // No significant change
        return false;
    }

    // Function to determine if a URL is just appending a query or fragment
    function isNavigationRelevant(oldUrl, newUrl) {
        const ignoredParameters = ['utm_source', 'utm_medium', 'utm_name', 'utm_content'];
        const newUrlObj = new URL(newUrl);

        // Check if the URL has any ignored parameters or a new fragment
        if (newUrlObj.hash || ignoredParameters.some(param => newUrlObj.searchParams.has(param))) {
            // Check for relevant hash changes
            return isHashFragmentChanged(oldUrl, newUrl);
        }

        // No utm params and no relevant fragment change, so navigation is not relevant
        return true;
    }

    // Event listener for all 'a' elements
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        const currentUrl = window.location.href;

        if (target && isNavigationRelevant(currentUrl, target.href) &&
            (target.href.includes('user') || target.textContent.toLowerCase().includes('permalink') || target.textContent.toLowerCase().includes('parent'))) {
            e.preventDefault();
            showModal(target);
        }
    }, true);
})();
