// ==UserScript==
// @name         Drawaria No Censor Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass Drawaria.online censorship by converting text to bold Unicode characters.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544358/Drawaria%20No%20Censor%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/544358/Drawaria%20No%20Censor%20Words.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A simple utility to create DOM elements, ensuring the script is truly standalone.
    const domMake = {
        Tree: function(tagName, attributes = {}, children = []) {
            const element = document.createElement(tagName);
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    if (key === 'style' && typeof attributes[key] === 'string') {
                        element.style.cssText = attributes[key];
                    } else if (key in element && tagName !== 'input') { // Avoid setting value attribute as property for inputs
                        element[key] = attributes[key];
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                }
            }
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
            return element;
        },
        Button: function(text, attributes = {}) {
            const button = document.createElement('button');
            button.textContent = text;
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    if (key === 'style' && typeof attributes[key] === 'string') {
                        button.style.cssText = attributes[key];
                    } else {
                        button.setAttribute(key, attributes[key]);
                    }
                }
            }
            return button;
        }
    };


    // --- Character map for Bold Text ---
    const BOLD_TEXT_MAP = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };

    class NoCensorWords {
        #panel = null;
        #toggleButton = null;
        #isCensorBypassActive = false;
        #chatInputObserver = null;
        #currentChatInput = null; // Reference to the currently active chat input element
        #inputListener = null; // Store the listener reference for proper removal
        #observerTarget = null;
        #_attachInputDebounceTimer = null; // Private property for the debounce timer

        constructor() {
            console.log("NoCensorWords: Initializing...");
            this.#addStyles();
            this.#createPanel();
            this.#setupChatInputMonitoring();
            console.log("NoCensorWords: Initialization complete.");
        }

        #addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .no-censor-button {
                    background: #f0f0f0; /* Light background */
                    color: #333; /* Dark text */
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 8px 12px;
                    font-size: 1em;
                    cursor: pointer;
                    transition: background 0.16s ease-in-out, color 0.16s ease-in-out;
                    width: 100%; /* Make button fill panel width */
                    box-sizing: border-box; /* Include padding and border in width */
                }
                .no-censor-button:hover {
                    background: #e0e0e0; /* Slightly darker on hover */
                }
                .no-censor-button.active {
                    background: #4CAF50; /* Green for active */
                    border-color: #4CAF50;
                    color: #fff; /* White text for active */
                    font-weight: bold;
                }
                .no-censor-button.active:hover {
                    background: #5cb85c;
                }
                .no-censor-panel {
                    position: fixed;
                    top: 100px; /* Default position */
                    right: 20px;
                    width: 220px; /* Adjusted width to be more compact */
                    background: #ffffff; /* White background for the panel */
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 100000; /* High z-index to be on top */
                    color: #333; /* Default text color for panel content */
                    font-family: Arial, sans-serif;
                    padding: 10px;
                    box-sizing: border-box;
                    user-select: none; /* Prevent text selection on the panel itself */
                }
                .no-censor-panel-header {
                    cursor: grab;
                    padding: 5px;
                    background: #f0f0f0; /* Light header background */
                    border-bottom: 1px solid #e0e0e0;
                    margin: -10px -10px 10px -10px; /* Negative margin to pull it to edges */
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none; /* Prevent text selection on the header */
                }
                .no-censor-panel-header span {
                    font-weight: bold;
                    font-size: 1.1em;
                    margin-left: 10px;
                    color: #333; /* Dark text for title */
                }
                .no-censor-panel-close-btn {
                    background: none;
                    border: none;
                    color: #666; /* Darker close button color */
                    font-size: 1.5em;
                    cursor: pointer;
                    padding: 0 5px;
                }
                .no-censor-panel-close-btn:hover {
                    color: #ff0000;
                }
            `;
            document.head.appendChild(style);
            console.log("NoCensorWords: Styles added.");
        }

        #createPanel() {
            this.#panel = domMake.Tree('div', { class: 'no-censor-panel' });

            const header = domMake.Tree('div', { class: 'no-censor-panel-header' });
            const title = domMake.Tree('span', {}, ["No Censor Words"]);
            const closeButton = domMake.Button('×', { class: 'no-censor-panel-close-btn' });
            closeButton.onclick = () => {
                this.#panel.remove();
                if (this.#chatInputObserver) {
                    this.#chatInputObserver.disconnect();
                    console.log("NoCensorWords: MutationObserver disconnected on panel close.");
                }
                if (this.#currentChatInput && this.#inputListener) {
                    this.#currentChatInput.removeEventListener('input', this.#inputListener);
                    console.log("NoCensorWords: Chat input listener removed on panel close.");
                }
                console.log("NoCensorWords: Panel removed.");
            };

            // FIX: Use standard appendChild instead of custom appendAll
            header.appendChild(title);
            header.appendChild(closeButton);

            this.#panel.appendChild(header);

            this.#toggleButton = domMake.Button('Activar Bypass', { class: 'no-censor-button' });
            this.#toggleButton.onclick = () => this.#toggleCensorBypass();
            this.#panel.appendChild(this.#toggleButton);

            document.body.appendChild(this.#panel);
            this.#makeDraggable(this.#panel, header);
            console.log("NoCensorWords: Panel created and appended to body.");
        }

        #makeDraggable(element, handle) {
            let offsetX, offsetY;
            let isDragging = false;

            const startDrag = (e) => {
                // Ensure event target is the handle itself, not a child of the handle
                if (e.target !== handle && e.target !== handle.firstElementChild) {
                    // Check if the target is the close button, don't drag if so
                    if (e.target.classList.contains('no-censor-panel-close-btn')) {
                        return;
                    }
                }

                e.preventDefault(); // Prevent default browser drag behavior

                const rect = element.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                isDragging = true;
                handle.style.cursor = 'grabbing';
                document.body.style.userSelect = 'none'; // Prevent text selection on body

                document.addEventListener('mousemove', doDrag);
                document.addEventListener('mouseup', stopDrag);
            };

            const doDrag = (e) => {
                if (!isDragging) return;
                e.preventDefault();

                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Clamp to viewport boundaries
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            };

            const stopDrag = () => {
                isDragging = false;
                handle.style.cursor = 'grab';
                document.body.style.userSelect = 'auto'; // Restore text selection

                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            };

            handle.addEventListener('mousedown', startDrag);
            handle.style.cursor = 'grab'; // Set default cursor for handle
            console.log("NoCensorWords: Panel made draggable.");
        }

        #toggleCensorBypass() {
            this.#isCensorBypassActive = !this.#isCensorBypassActive;
            if (this.#isCensorBypassActive) {
                this.#toggleButton.textContent = 'Desactivar Bypass';
                this.#toggleButton.classList.add('active');
                this.#applyConversionToCurrentInput(); // Apply to existing text if any
                console.log("NoCensorWords: Censura bypass ACTIVADO.");
            } else {
                this.#toggleButton.textContent = 'Activar Bypass';
                this.#toggleButton.classList.remove('active');
                // Reverting text is complex, simply stop future conversions.
                // The user would need to retype if they want original characters.
                console.log("NoCensorWords: Censura bypass DESACTIVADO.");
            }
        }

        #getChatInput() {
            // This attempts to get the chat input. It targets the id used by Drawaria,
            // which could be the original input or a textarea replaced by other scripts.
            return document.querySelector('#chatbox_textinput');
        }

        #setupChatInputMonitoring() {
            // Find a stable parent element to observe for chat input changes
            this.#observerTarget = document.querySelector('#chatattop') || document.body;
            if (!this.#observerTarget) {
                console.error("NoCensorWords: Could not find chat container or body to observe for input changes.");
                return;
            }

            this.#chatInputObserver = new MutationObserver(() => {
                // Debounce the attachment to avoid multiple calls on rapid DOM changes
                clearTimeout(this.#_attachInputDebounceTimer); // Use the private property
                this.#_attachInputDebounceTimer = setTimeout(() => { // Assign to private property
                    this.#attachInputListener();
                }, 100); // Small delay to let DOM settle
            });

            // Observe for changes in the chat container or body for the input element
            this.#chatInputObserver.observe(this.#observerTarget, { childList: true, subtree: true, attributes: false });
            console.log("NoCensorWords: MutationObserver set up on", this.#observerTarget === document.body ? "body" : "#chatattop");

            // Initial attachment in case input is already present when script loads
            this.#attachInputListener();
        }

        #attachInputListener() {
            const newChatInput = this.#getChatInput();

            if (newChatInput && newChatInput !== this.#currentChatInput) {
                // Remove old listener if it exists and is different from new input
                if (this.#currentChatInput && this.#inputListener) {
                    this.#currentChatInput.removeEventListener('input', this.#inputListener);
                    console.log("NoCensorWords: Removed old chat input listener.");
                }

                this.#currentChatInput = newChatInput;
                this.#inputListener = (event) => this.#handleChatInput(event);
                this.#currentChatInput.addEventListener('input', this.#inputListener);
                console.log("NoCensorWords: Attached new chat input listener to:", this.#currentChatInput);
                this.#applyConversionToCurrentInput(); // Apply conversion immediately upon attaching
            } else if (!newChatInput && this.#currentChatInput) {
                // Input disappeared
                this.#currentChatInput.removeEventListener('input', this.#inputListener);
                this.#currentChatInput = null;
                this.#inputListener = null;
                console.log("NoCensorWords: Chat input disappeared, listener removed.");
            } else if (newChatInput === this.#currentChatInput) {
                // console.log("NoCensorWords: Chat input is the same, no re-attachment needed.");
            } else {
                // console.log("NoCensorWords: Chat input not found yet.");
            }
        }

        #handleChatInput(event) {
            if (!this.#isCensorBypassActive || !this.#currentChatInput) {
                return;
            }

            const currentText = this.#currentChatInput.value;
            const originalSelectionStart = this.#currentChatInput.selectionStart;
            const originalSelectionEnd = this.#currentChatInput.selectionEnd;

            let convertedText = '';
            let charOffset = 0; // Tracks the change in length due to conversion

            for (let i = 0; i < currentText.length; i++) {
                const originalChar = currentText[i];
                // Convert uppercase and lowercase letters, and digits
                const convertedChar = BOLD_TEXT_MAP[originalChar] || BOLD_TEXT_MAP[originalChar.toUpperCase()] || originalChar;

                convertedText += convertedChar;

                // Adjust charOffset if character length changes
                if (convertedChar.length !== originalChar.length) {
                    charOffset += (convertedChar.length - originalChar.length);
                }
            }

            // Only update if conversion actually changed the text to prevent infinite loops
            if (this.#currentChatInput.value !== convertedText) {
                // FIX: Directly assign the value. This is the safest way to update.
                this.#currentChatInput.value = convertedText;

                // Restore cursor and selection, adjusting for length changes
                this.#currentChatInput.selectionStart = originalSelectionStart + charOffset;
                this.#currentChatInput.selectionEnd = originalSelectionEnd + charOffset;

                // Optionally, dispatch an input event manually after setting value
                // if framework relies on it, though direct .value usually doesn't trigger 'input'
                // and we already have a wrapper dispatching in #applyConversionToCurrentInput.
                // No need to dispatch here unless required by a specific framework.
            }
        }

        // Applies conversion to the current input value immediately when toggled on
        #applyConversionToCurrentInput() {
            if (this.#currentChatInput && this.#isCensorBypassActive) {
                // Dispatch a synthetic 'input' event to trigger #handleChatInput
                // This is crucial because directly setting .value doesn't fire 'input'.
                const inputEvent = new Event('input', { bubbles: true });
                this.#currentChatInput.dispatchEvent(inputEvent);
            }
        }
    }

    // Initialize the module
    function initNoCensorWordsScript() {
        console.log("NoCensorWords: DOMContentLoaded or script executed.");
        // Add a small delay to ensure the main Drawaria chat input is ready,
        // especially if other scripts (like AdvancedChatEnhancements) are also modifying it.
        setTimeout(() => {
            new NoCensorWords();
        }, 1500); // 1.5 seconds delay
    }

    // Ensure the script runs after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNoCensorWordsScript);
    } else {
        initNoCensorWordsScript();
    }

})();