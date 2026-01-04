// ==UserScript==
// @name         ChatGPT Enhanced Interface
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Enhances ChatGPT interface with various features.
// @author       lundeen-bryan
// @match        https://chat.openai.com/*
// @grant        none
// @license      GPL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482427/ChatGPT%20Enhanced%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/482427/ChatGPT%20Enhanced%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle key presses
    function handleKeyPress(event) {
        const inputBox = document.querySelector('textarea');
        if (event.key === 'Enter' && !event.metaKey && inputBox) {
            event.stopPropagation();
        }
        if (event.key === 'Enter' && event.ctrlKey) { // Check if Ctrl+Enter are pressed together
            document.querySelector('[data-testid="send-button"]').click(); // Simulate click on the send button
        }
    }


    // Add or remove the key press event listener
    function overrideEnterKey() {
        const inputBox = document.querySelector('textarea');
        if (inputBox) {
            inputBox.removeEventListener('keydown', handleKeyPress, true);
            inputBox.addEventListener('keydown', handleKeyPress, true);
        }
    }

    // Observe for changes to reapply the key press event listener
    const observerForKeyPress = new MutationObserver(overrideEnterKey);
    observerForKeyPress.observe(document, { childList: true, subtree: true });

    // Custom styles
    const customStyle = document.createElement('style');
    customStyle.textContent = `
        /* Style for focused button */
        .focused-gizmo {
            background-color: #19c37d !important; /* New button color */
        }
        .focused-gizmo svg {
            color: white !important; /* New arrow color */
        }

        /* Specific style for the send button */
        [data-testid="send-button"] {
            max-height: 200px;
            height: 30px;
            overflow-y: hidden;
            min-height: 30px;
            padding-right: 5px;
            padding-left: 5px;
        }
        /* Style for the textarea with ID 'prompt-textarea' */
        #prompt-textarea {
            padding-left: 45px;
            padding-right: 60px;
            padding-bottom: 10px;
            padding-top: 10px;
            font-size: 1.1em;
        }
        /* Style for elements with the class .md\\:right-3 */
        .md\\:right-3 {
            right: 2.75rem;
        }
        /* Style for elements with the class.md\\:left-3 */
        p {
            font-size: 1.4em;
            width: 100%;
        }
        .w-full {
            /* wide scrollbar */
            width: 99%;
        }
        /* Move text area far to the left to give more room to write */
        .xl\:max-w-3xl {
            max-width: 59rem;
            margin-left: 30px;
        }
        /* Adjust padding values for the result counter */
        .text-token-text-tertiary {
            padding-left: 54px !important; /* Adjust left padding */
            padding-bottom: 4px !important; /* Adjust bottom padding */
        }
    `;
    document.head.appendChild(customStyle);


    // Function to toggle focus style
    function toggleFocusStyle(event) {
        const button = document.querySelector('[data-testid="send-button"]');
        if (button) {
            if (event.type === 'focus') {
                button.classList.add('focused-gizmo');
            } else if (event.type === 'blur') {
                button.classList.remove('focused-gizmo');
            }
        }
    }

    // Add focus and blur event listeners to the button
    function addButtonFocusListener() {
        const button = document.querySelector('[data-testid="send-button"]');
        if (button) {
            button.addEventListener('focus', toggleFocusStyle);
            button.addEventListener('blur', toggleFocusStyle);
        }
    }

    // Observe for button to add focus and blur listeners
    const observerForButtonFocus = new MutationObserver(addButtonFocusListener);
    observerForButtonFocus.observe(document.body, { childList: true, subtree: true });

    // Keyboard shortcut functionality
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'k') {
            const targetButton = document.getElementById('expand-sidebar-bottom-button');
            if (targetButton) {
                targetButton.click();
            }
        }
    });
})();
