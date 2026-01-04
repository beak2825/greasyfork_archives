// ==UserScript==
// @name         YouTube Toggle Description Button and collapse on empty space click
// @version      1.14
// @description  Displays a "Toggle Description" button to the right of the video publication date to collapse/expand the description. In addition, a hook is added to collapse the description when clicking on empty areas.
// @match        https://www.youtube.com/*
// @author       ChatGPT + Human
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/526319/YouTube%20Toggle%20Description%20Button%20and%20collapse%20on%20empty%20space%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/526319/YouTube%20Toggle%20Description%20Button%20and%20collapse%20on%20empty%20space%20click.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function that simulates a click on the built-in expand/collapse buttons.
    function toggleDescription() {
        //const descriptionContainer = document.querySelector('#description-inline-expander');
        const collapser = document.querySelector("tp-yt-paper-button#collapse");
        if (collapser.hidden) {
          const expander = document.querySelector("tp-yt-paper-button#expand");
          expander.click();
        } else {
          collapser.click()
        }
    }

    // Create a toggle button styled similarly to YouTube’s native button.
    // We use flex properties to dock the button to the right.
    function createStyledToggleButton() {
        const btn = document.createElement('tp-yt-paper-button');
        btn.id = 'subtle-toggle-button';
        btn.textContent = 'Toggle Description';
        btn.className = 'style-scope tp-yt-paper-button button ytd-text-inline-expander';
        btn.setAttribute('elevation', '0');
        btn.setAttribute('role', 'button');

        btn.style.cssText = `
            color: var(--ytd-text-inline-expander-button-color, var(--yt-spec-text-secondary));
            margin: 0;
            padding: 0;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4rem;
            line-height: 2rem;
            font-weight: 500;
            text-transform: none;
            background: transparent;
            border: none;
            cursor: pointer;
            white-space: pre;
            text-align: right;
            margin-left: auto;
        `;

        // Clicking the button toggles the description.
        btn.addEventListener('click', toggleDescription);
        return btn;
    }

    // Insert the toggle button into the info container and force flex layout.
    function addToggleButton() {
        const infoContainer = document.querySelector('#info-container');
        if (!infoContainer) return;

        // Force the container into a flex layout.
        infoContainer.style.setProperty('display', 'flex', 'important');
        infoContainer.style.setProperty('align-items', 'center', 'important');

        // Avoid duplicates.
        if (document.querySelector('#subtle-toggle-button')) return;
        const toggleButton = createStyledToggleButton();
        infoContainer.appendChild(toggleButton);
    }

    // Add an event listener to the description expander so that when it is expanded,
    // clicking on any non-interactive (empty) space collapses the description.
    function addDescriptionCollapseListener() {
        const descExpander = document.querySelector('#description-inline-expander');
        if (!descExpander) return;
        // Only add once.
        if (descExpander.dataset.collapseListenerAdded) return;
        descExpander.addEventListener('click', function(e) {
            // Check if the description is expanded (collapse button is visible)
            const collapser = descExpander.querySelector('tp-yt-paper-button#collapse');
            if (!collapser.hidden) {
                // Only act if you did not click on an interactive element (like a link or a button).
                if (!e.target.closest('a, button, tp-yt-paper-button')) {
                    collapser.click();
                    // Prevent any other click handling (for example, YouTube’s own expand logic).
                    e.stopPropagation();
                }
            }
        });
        descExpander.dataset.collapseListenerAdded = 'true';
    }

    // Combine the toggle button and the collapse listener setup.
    function addToggleButtonAndCollapseListener() {
        addToggleButton();
        // Comment below line to disable empty space collapse behaviour
        addDescriptionCollapseListener();
    }

    // Use a persistent MutationObserver to re-add the button and listener if needed.
    const observer = new MutationObserver(() => {
        addToggleButtonAndCollapseListener();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
