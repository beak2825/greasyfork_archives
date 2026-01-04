// ==UserScript==
// @name         No toolbars for slack lists (Toggleable), aka Fullscreen Lists
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hides toolbars for any given Slack List, toggleable with Command + . Useful when combined with Chrome's ability to turn any webpage into an App.
// @author       Tim Kersten
// @match        https://app.slack.com/client/*/lists
// @grant        GM_addStyle
// @homepageURL  https://gist.github.com/io41/7ff3dfa815dd7566237234f7b699a529
// @downloadURL https://update.greasyfork.org/scripts/501755/No%20toolbars%20for%20slack%20lists%20%28Toggleable%29%2C%20aka%20Fullscreen%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/501755/No%20toolbars%20for%20slack%20lists%20%28Toggleable%29%2C%20aka%20Fullscreen%20Lists.meta.js
// ==/UserScript==

/* Changelog:
 * v0.6 - Fix opening item width. Open links in new tab/window to prevent navigating away from the list.
 * v0.5 - Style fixes after Slack update.
 */

(function() {
    'use strict';

    // Custom CSS styles to override page styles
    const customCSS = `
        .p-ia4_client.p-ia4_client--narrow-feature-on .p-client_workspace_wrapper:not(.p-client_workspace_wrapper--with-split-view) {
            grid-template-columns: 0 auto !important;
        }
        .p-client_workspace__layout {
          grid-template-columns: 0 auto !important;
        }
        .p-ia4_client--narrow-feature-on .p-tab_rail {
            width: 0 !important;
        }
        .p-ia4_client .p-ia4_top_nav {
            height: 0 !important;
        }
        .p-flexpane {
            min-width: 700px !important;
        }
    `;

    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.id = 'slackListToolbarToggleStyle';
    styleElement.textContent = customCSS;

    // Function to toggle the style
    function toggleStyle() {
        if (styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        } else {
            document.head.appendChild(styleElement);
        }
    }

    // Event listener for the key combination
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is '.' and the Command key is held down
        if (event.key === '.' && event.metaKey) {
            event.preventDefault(); // Prevent the default action
            toggleStyle();
        }
    });

    // Function to update a link to open in a new tab
    function updateLink(link) {
        if (link.tagName === 'A') {
            link.setAttribute('target', '_blank');
            link.addEventListener('click', function(event) {
                // Prevent SPA navigation
                event.stopPropagation();
            }, true);
        }
    }

    // Function to disable button actions if it contains a link with class "c-timestamp"
    function disableButton(button) {
        if (button.tagName === 'BUTTON') {
            let timestampLink = button.querySelector('a.c-timestamp');
            if (timestampLink) {
                button.addEventListener('click', function(event) {
                    // Prevent any action and open the link in a new tab
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(timestampLink.href, '_blank');
                }, true);
            }
        }
    }

    // Initial update of all links and disable certain buttons
    document.querySelectorAll('a').forEach(updateLink);
    document.querySelectorAll('button').forEach(disableButton);

    // Set up a MutationObserver to detect new links and buttons
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Check if the added node is an element
                    if (node.tagName === 'A') {
                        updateLink(node);
                    } else if (node.tagName === 'BUTTON') {
                        disableButton(node);
                    } else {
                        node.querySelectorAll('a').forEach(updateLink);
                        node.querySelectorAll('button').forEach(disableButton);
                    }
                }
            });
        });
    });

    // Configure the observer to watch for changes in the child list and subtree
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle the case where the SPA modifies existing links or buttons without adding new ones
    var observerConfig = { attributes: true, attributeFilter: ['href'], subtree: true };
    var attributeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.tagName === 'A') {
                updateLink(mutation.target);
            } else if (mutation.target.tagName === 'BUTTON') {
                disableButton(mutation.target);
            }
        });
    });

    attributeObserver.observe(document.body, observerConfig);

    // Initially add the style
    document.head.appendChild(styleElement);
})();