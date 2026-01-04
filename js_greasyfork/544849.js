// ==UserScript==
// @name         LinkedIn Wide Messaging
// @namespace    https://github.com/tahatariq19
// @version      1.0
// @description  Changes layout of LinkedIn Messaging to Full Screen for a wider, more immersive experience.
// @author       Taha Tariq
// @match        https://*.linkedin.com/messaging/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544849/LinkedIn%20Wide%20Messaging.user.js
// @updateURL https://update.greasyfork.org/scripts/544849/LinkedIn%20Wide%20Messaging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object to hold all selectors and styles.
     * This makes it easy to update the script if LinkedIn changes its class names or IDs.
     */
    const layoutConfig = {
        selectors: {
            rightSidebar: "#messaging .scaffold-layout__aside",
            mainContent: "#messaging .scaffold-layout__inner",
            contentRow: "#messaging .scaffold-layout__row",
            threadList: "#messaging .scaffold-layout__list",
            chatPane: "#messaging .scaffold-layout__detail",
            chatFooter: "footer.msg-form__footer",
            messageOverlay: "#msg-overlay",
            pillButtonRow: "div.msg-conversations-container__title-row:nth-child(2)",
            allPillButtons: ".msg-conversations-container__title-row > div",
            pillDestination: ".msg-search-form",
            mainContainerTrigger: ".msg-s-message-list-container"
        },
        styles: {
            mainContent: "width: 100%",
            contentRow: "grid-template-columns: 100%; margin-top: 5px !important;",
            threadList: "flex: 1",
            chatPane: "flex: 4",
            chatFooter: "padding-top: 10px !important; padding-bottom: 2px !important;",
            messageOverlay: "padding-right: 120px"
        }
    };

    /**
     * A helper function to apply CSS styles to a given element.
     * @param {string} selector - The CSS selector for the target element.
     * @param {string} styleString - The CSS styles to apply.
     */
    function applyStyles(selector, styleString) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.cssText = styleString;
        }
    }

    /**
     * A helper function to remove an element from the DOM.
     * @param {string} selector - The CSS selector for the element to remove.
     */
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    }

    /**
     * Main function to apply all the visual changes for the wide layout.
     */
    function applyWideLayout() {
        console.log("Applying wide layout for LinkedIn Messaging...");

        // 1. Remove the right sidebar to create space.
        removeElement(layoutConfig.selectors.rightSidebar);

        // 2. Apply styles to expand the main layout components.
        applyStyles(layoutConfig.selectors.mainContent, layoutConfig.styles.mainContent);
        applyStyles(layoutConfig.selectors.contentRow, layoutConfig.styles.contentRow);
        applyStyles(layoutConfig.selectors.threadList, layoutConfig.styles.threadList);
        applyStyles(layoutConfig.selectors.chatPane, layoutConfig.styles.chatPane);
        applyStyles(layoutConfig.selectors.chatFooter, layoutConfig.styles.chatFooter);
        applyStyles(layoutConfig.selectors.messageOverlay, layoutConfig.styles.messageOverlay);

        // 3. Relocate the filter "pill" buttons to the row above.
        const pillDestination = document.querySelector(layoutConfig.selectors.pillDestination);
        const pillButtons = document.querySelectorAll(layoutConfig.selectors.allPillButtons);

        if (pillDestination && pillButtons.length > 0) {
            const destinationParent = pillDestination.parentNode;
            // Using forEach as an alternative to a for...of loop.
            pillButtons.forEach(button => {
                destinationParent.appendChild(button);
            });
        }

        // 4. Remove the old, now-empty row that contained the pill buttons.
        removeElement(layoutConfig.selectors.pillButtonRow);
    }

    /**
     * MutationObserver to watch for dynamic content loading.
     * LinkedIn is a Single-Page Application (SPA), so content is loaded dynamically
     * without full page reloads. This observer waits for the messaging pane to be
     * added to the page before trying to apply our layout changes.
     */
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // We only care about element nodes.
                    if (node.nodeType !== 1) continue;

                    // When the main message container appears, apply the layout.
                    if (node.matches(layoutConfig.selectors.mainContainerTrigger)) {
                        applyWideLayout();
                    }
                    
                    // The message overlay sometimes loads after everything else.
                    // We apply its style again just in case it was missed.
                    if (node.matches(layoutConfig.selectors.messageOverlay)) {
                        applyStyles(layoutConfig.selectors.messageOverlay, layoutConfig.styles.messageOverlay);
                    }
                }
            }
        }
    });

    // Start observing the entire document body for changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
