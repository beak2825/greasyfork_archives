// ==UserScript==
// @name         Udemy Transcript Copier (Floating Button)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Adds a floating button to copy the Udemy transcript when the panel is open.
// @author       Gemini
// @match        https://www.udemy.com/course/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545536/Udemy%20Transcript%20Copier%20%28Floating%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545536/Udemy%20Transcript%20Copier%20%28Floating%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    // STYLING FOR THE FLOATING BUTTON AND MODAL
    // The button is positioned fixed to the viewport. A high z-index ensures
    // it floats above other content on the page.
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    GM_addStyle(`
        .floating-copy-button {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 10000; /* High z-index to stay on top */
            background-color: #a435f0; /* Udemy's primary purple */
            color: #fff;
            border: none;
            padding: 12px 18px;
            font-weight: bold;
            font-family: "Udemy Sans", "SF Pro Text", -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 16px;
            border-radius: 50px; /* Pill shape */
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            transition: all 0.2s ease-in-out;
        }

        .floating-copy-button:hover {
            background-color: #8710d8; /* Darker purple on hover */
            transform: translateY(-2px); /* Slight lift effect */
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .floating-copy-button.copied {
            background-color: #2e8a5b; /* Green for success feedback */
            transform: translateY(0);
        }
    `);

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    // BUTTON CREATION LOGIC
    // This function creates the button and defines its copy behavior.
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    function createFloatingButton() {
        // Avoid creating a duplicate button.
        if (document.getElementById('floating-transcript-copier')) {
            return;
        }

        const copyButton = document.createElement('button');
        copyButton.id = 'floating-transcript-copier';
        copyButton.className = 'floating-copy-button';
        copyButton.innerText = 'Copy Transcript';

        copyButton.addEventListener('click', () => {
            // The main transcript panel, which is a stable selector.
            const transcriptPanel = document.querySelector('div[data-purpose="transcript-panel"]');
            if (!transcriptPanel) {
                console.error("Transcript panel not found. This should not happen if the button is visible.");
                alert("Error: Could not find the transcript panel. The script may need an update.");
                return;
            }

            // UPDATED SELECTOR: Based on the provided HTML, the transcript cues are now
            // `p` tags with a `data-purpose="transcript-cue"`. This is a more stable selector
            // than the dynamically generated class names.
            const cueElements = transcriptPanel.querySelectorAll('p[data-purpose="transcript-cue"]');
            if (cueElements.length === 0) {
                console.error("No transcript cues found within the panel. The selector for the text lines might need to be changed.");
                alert("Error: Could not find the transcript text lines. The script may need an update.");
                return;
            }

            // Extract text from each cue and join with double newlines for readability.
            const fullTranscript = Array.from(cueElements)
                .map(cue => cue.innerText.trim())
                .join('\n\n');

            // Copy the formatted text to the clipboard.
            try {
                navigator.clipboard.writeText(fullTranscript).then(() => {
                    // Provide visual feedback to the user.
                    copyButton.innerText = 'Copied!';
                    copyButton.classList.add('copied');
                    setTimeout(() => {
                        copyButton.innerText = 'Copy Transcript';
                        copyButton.classList.remove('copied');
                    }, 2000); // Reset after 2 seconds
                }).catch(err => {
                    console.error('Failed to copy using navigator.clipboard:', err);
                    GM_setClipboard(fullTranscript, 'text'); // Fallback
                });
            } catch (err) {
                console.error('Error with clipboard API, using fallback:', err);
                GM_setClipboard(fullTranscript, 'text'); // Fallback
            }
        });

        // Add the button to the main document body so it can float freely.
        document.body.appendChild(copyButton);
    }

    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    // OBSERVER TO MANAGE BUTTON VISIBILITY
    // We use a MutationObserver to watch for the transcript panel appearing
    // or disappearing from the DOM. This is the most efficient way to manage
    // the button's lifecycle.
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    const observer = new MutationObserver(() => {
        // The selector for the overall panel seems to be more stable.
        const transcriptPanel = document.querySelector('div[data-purpose="transcript-panel"]');
        const floatingButton = document.getElementById('floating-transcript-copier');

        // If the transcript panel exists AND our button doesn't, create the button.
        if (transcriptPanel && !floatingButton) {
            createFloatingButton();
        }
        // If the transcript panel is gone AND our button still exists, remove it.
        else if (!transcriptPanel && floatingButton) {
            floatingButton.remove();
        }
    });

    // Start observing the entire document for changes. This allows us to react
    // when the user opens or closes the transcript tab.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
