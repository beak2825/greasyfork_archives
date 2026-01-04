// ==UserScript==
// @name         Canvas Tab Expander
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically expands all tabs in Canvas assignments and combines content
// @author       You
// @match        https://*.instructure.com/courses/*/assignments/*
// @match        https://elearn.ucr.edu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514021/Canvas%20Tab%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/514021/Canvas%20Tab%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandAllTabs() {
        // Get all tab content divs
        const tabContents = document.querySelectorAll('.tab-pane.dp-panel-content');

        // Remove classes and attributes that hide content
        tabContents.forEach(content => {
            // Remove Bootstrap's tab hiding classes
            content.classList.remove('fade');
            content.classList.add('show', 'active');

            // Remove any inline display:none styling
            content.style.removeProperty('display');

            // Remove hidden attribute
            content.removeAttribute('hidden');

            // Force display block
            content.style.display = 'block';

            // Remove aria-hidden attribute
            content.removeAttribute('aria-hidden');
        });

        // Modify the tab navigation to show all tabs as active
        const tabNavs = document.querySelectorAll('.nav-link.dp-panel-heading');
        tabNavs.forEach(tab => {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        });

        // Also expand any nested accordion panels
        const accordionPanels = document.querySelectorAll('.dp-panel-content[style*="display: none"]');
        accordionPanels.forEach(panel => {
            panel.style.display = 'block';
            const toggler = panel.previousElementSibling?.querySelector('.dp-panel-toggler');
            if (toggler) {
                toggler.setAttribute('aria-expanded', 'true');
            }
        });

        // Remove the tab-content active class restriction
        const tabContentContainer = document.querySelector('.tab-content');
        if (tabContentContainer) {
            tabContentContainer.classList.remove('active');
            // Add custom CSS to override Bootstrap's tab display logic
            const style = document.createElement('style');
            style.textContent = `
                .tab-content > .tab-pane {
                    display: block !important;
                    opacity: 1 !important;
                }
                .dp-panel-content {
                    display: block !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Function to create and add the expand button
    function addExpandButton() {
        const existingButton = document.getElementById('expandAllTabsButton');
        if (!existingButton) {
            const expandButton = document.createElement('button');
            expandButton.id = 'expandAllTabsButton';
            expandButton.textContent = 'Expand All Tabs';
            expandButton.className = 'Button Button--primary';
            expandButton.style.margin = '10px 0';
            expandButton.addEventListener('click', expandAllTabs);

            const contentArea = document.querySelector('.description.user_content');
            if (contentArea) {
                contentArea.insertBefore(expandButton, contentArea.firstChild);
            }
        }
    }

    // Wait for the page to load
    function init() {
        addExpandButton();
        expandAllTabs();

        // Add a mutation observer to handle dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    expandAllTabs();
                }
            });
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run after a short delay to catch any dynamic content
    setTimeout(init, 1000);
})();
