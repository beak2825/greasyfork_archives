// ==UserScript==
// @name         WhatsApp Right-Click Dropdown Menu
// @namespace    https://web.whatsapp.com/
// @version      1.1
// @license      CC BY-NC-SA 4.0
// @description  Opens the options menu of a message on right-click in WhatsApp Web, replacing normal right click behavior.
// @author       Dan
// @match        *://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529665/WhatsApp%20Right-Click%20Dropdown%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/529665/WhatsApp%20Right-Click%20Dropdown%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function attachContextMenuHandler(node) {
        if (node.classList && (node.classList.contains('message-out') || node.classList.contains('message-in'))) {
            node.addEventListener('contextmenu', function(event) {
                // If the target is a link, image, or selected text, allow the default context menu
                const target = event.target;
                if (target.nodeName === 'A' || target.nodeName === 'IMG' || window.getSelection().toString().length > 0) {
                    return; // Don't prevent default behavior
                }

                event.preventDefault();

                // Try to find the contextual menu button for the message
                let menuButton = node.querySelector('._ahkm'); // Selector for the contextual menu button

                // If it's not found, try another selector (in case of changes in the structure)
                if (!menuButton) {
                    menuButton = node.querySelector('[role="button"][aria-label="Context menu"]');
                }

                if (menuButton) {
                    menuButton.click(); // Open the options menu
                }

                // Make the message blink
                blinkMessage(node);
            });
        }
    }

    function blinkMessage(node) {
        // Add the class that causes the blinking effect
        node.classList.add('blink');

        // Remove the class after a short period (blinking)
        setTimeout(function() {
            node.classList.remove('blink');
        }, 500); // The message will blink for 500ms
    }

    // CSS style for blinking
    const style = document.createElement('style');
    style.innerHTML = `
        .blink {
            animation: blink 0.5s alternate;
        }

        @keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Observe the chat container for new messages
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure it's an element
                    attachContextMenuHandler(node);
                    node.querySelectorAll('.message-out, .message-in').forEach(attachContextMenuHandler);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
