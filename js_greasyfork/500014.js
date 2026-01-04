// ==UserScript==
// @name         freshdesk-expand-conversations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically click '+N conversations' button
// @author       Bruce Sharpe
// @match        https://heardthat.freshdesk.com/a/tickets/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500014/freshdesk-expand-conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/500014/freshdesk-expand-conversations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Custom log function
    function tmLog(message) {
        console.log('tm: ' + message);
    }

    // Function to show the popup message
    function showPopupMessage() {
        // Create the popup element
        const popup = document.createElement('div');
        popup.textContent = 'Conversations expanded';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#47aab5',
            color: 'white',
            fontWeight: 'bold',
            border: '1px solid #ddd',
            padding: '10px',
            zIndex: 1000,
            fontSize: '16px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            textAlign: 'center'
        });


        // Add the popup to the body
        document.body.appendChild(popup);

        // Remove the popup after 2 seconds
        setTimeout(function () {
            popup.remove();
        }, 2000);
    }

    // Function to click the button and show the popup
    function clickLoadMoreButton() {
        tmLog('Searching for the load more button');
        const loadMoreButton = document.querySelector('button[data-test-button="load-more"]');

        if (loadMoreButton) {
            tmLog('Load more button found, clicking it');
            loadMoreButton.click();
            showPopupMessage();
        } else {
            tmLog('Load more button not found');
        }
    }

    // Function to observe DOM changes
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (!mutation.addedNodes) return;

                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    // Check if the added node is the button you're looking for
                    let node = mutation.addedNodes[i];
                    if (node.matches && node.matches('button[data-test-button="load-more"][type="submit"]')) {
                        tmLog('Load more button added to DOM, clicking it');
                        node.click();
                        showPopupMessage();
                        observer.disconnect(); // Stop observing after finding and clicking the button
                        return;
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Modify handleScriptLoad function to use observeDOMChanges
    function handleScriptLoad() {
        tmLog('Handling script load');
        if (document.readyState === "complete" || document.readyState === "interactive") {
            tmLog('Document is already loaded, checking for button immediately');
            clickLoadMoreButton(); // Check once immediately
            observeDOMChanges(); // Then observe for changes
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                tmLog('DOMContentLoaded event fired, checking for button');
                clickLoadMoreButton(); // Check once immediately after DOMContentLoaded
                observeDOMChanges(); // Then observe for changes
            });
        }
    }

    // Run the handling function
    handleScriptLoad();

})();
