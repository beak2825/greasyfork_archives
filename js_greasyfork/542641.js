// ==UserScript==
// @name         Grok 4 Jailbreak
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Encodes your prompt to bypass restrictions on grok.com
// @author       Blankspeaker
// @match        https://grok.com/*
// @match        https://*.grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542641/Grok%204%20Jailbreak.user.js
// @updateURL https://update.greasyfork.org/scripts/542641/Grok%204%20Jailbreak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ZW_0 = '\u200C'; // Zero Width Non-Joiner for 0
    const ZW_1 = '\u200D'; // Zero Width Joiner for 1

    // Function to convert text to binary
    function textToBinary(text) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        let binary = '';
        for (let byte of bytes) {
            binary += byte.toString(2).padStart(8, '0');
        }
        return binary;
    }

    // Function to encode hidden text into cover
    function encodeMessage(cover, hidden) {
        if (!hidden) {
            return cover;
        }

        const binary = textToBinary(hidden);
        const zwSequence = binary.split('').map(bit => bit === '0' ? ZW_0 : ZW_1).join('');

        const coverChars = [...cover];
        if (coverChars.length <= 1) {
            return cover + zwSequence;
        }

        const numGaps = coverChars.length - 1;
        const baseSize = Math.floor(binary.length / numGaps);
        const extra = binary.length % numGaps;

        const gapSizes = new Array(numGaps).fill(baseSize);
        for (let i = 0; i < extra; i++) {
            gapSizes[i] += 1;
        }

        let result = coverChars[0];
        let index = 0;
        for (let i = 0; i < numGaps; i++) {
            const gapSize = gapSizes[i];
            const gap = zwSequence.substr(index, gapSize);
            result += gap;
            index += gapSize;
            result += coverChars[i + 1];
        }

        return result;
    }

    // Function to insert toggle and attach listeners
    function insertToggleAndAttachListeners() {
        const targetTextarea = document.querySelector('textarea[aria-label="Ask Grok anything"]');
        if (!targetTextarea) return;

        const submitButton = document.querySelector('button[type="submit"][aria-label="Submit"]');
        if (!submitButton) return;

        const modelButton = Array.from(document.querySelectorAll('button[type="button"][aria-haspopup="menu"]')).find(btn => btn.textContent.includes('Grok'));
        if (!modelButton) return;

        const modelSpan = modelButton.querySelector('span');
        const isGrok4 = modelSpan && modelSpan.textContent.trim() === 'Grok 4';

        // Check if toggle already exists as previous sibling
        let toggle = modelButton.previousSibling;
        if (toggle && toggle.nodeType === 1 && toggle.role === 'switch') {
            // Toggle exists
        } else {
            if (!isGrok4) return; // Don't create if not Grok 4

            // Create the toggle button
            toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.role = 'switch';
            toggle.setAttribute('aria-checked', 'false');
            toggle.setAttribute('data-state', 'unchecked');
            toggle.className = 'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-[1px] border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ring-card-border ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-dove dark:data-[state=checked]:bg-ivory dark:data-[state=unchecked]:bg-button-secondary-selected';

            // Create the knob span
            const knob = document.createElement('span');
            knob.setAttribute('data-state', 'unchecked');
            knob.className = 'pointer-events-none block h-4 w-4 rounded-full bg-white dark:bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 ms-0.5 data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5 dark:data-[state=unchecked]:bg-overlay';
            toggle.appendChild(knob);

            // Toggle click handler to switch state
            toggle.addEventListener('click', function() {
                const checked = toggle.getAttribute('aria-checked') === 'true';
                toggle.setAttribute('aria-checked', !checked ? 'true' : 'false');
                toggle.setAttribute('data-state', !checked ? 'checked' : 'unchecked');
                knob.setAttribute('data-state', !checked ? 'checked' : 'unchecked');
            });

            // Insert toggle to the left of modelButton
            modelButton.parentNode.insertBefore(toggle, modelButton);

            // Add margin or spacing if needed
            toggle.style.marginRight = '8px'; // Adjust as necessary for spacing
        }

        // Show or hide toggle based on isGrok4
        toggle.style.display = isGrok4 ? '' : 'none';

        // Attach listener to submitButton if not attached
        if (!submitButton.dataset.listenerAttached) {
            submitButton.addEventListener('click', function(e) {
                const checked = toggle.getAttribute('data-state') === 'checked';
                if (checked && isGrok4) {  // Double-check isGrok4 on submit
                    const hiddenText = targetTextarea.value.trim();
                    if (hiddenText) {
                        const cover = 'Decode me';
                        const encoded = encodeMessage(cover, hiddenText);
                        targetTextarea.value = encoded;
                        // Trigger input and change events
                        targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        targetTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                // Do not prevent default; let the original submit handler proceed
            }, true); // Use capture phase to run early
            submitButton.dataset.listenerAttached = 'true';
        }
    }

    // Initial call
    insertToggleAndAttachListeners();

    // Set up MutationObserver to handle dynamic changes
    const observer = new MutationObserver(insertToggleAndAttachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
})();