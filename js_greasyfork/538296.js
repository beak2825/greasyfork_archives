// ==UserScript==
// @name         Reverse Alias Arrow Handler (for Steam)
// @namespace    steam.raah
// @version      1337
// @description  An automatic toggle for a Steam username exploit.
// @match        https://steamcommunity.com/id/*/edit/info
// @grant        GM_xmlhttpRequest
// @connect      pastebin.com
// @downloadURL https://update.greasyfork.org/scripts/538296/Reverse%20Alias%20Arrow%20Handler%20%28for%20Steam%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538296/Reverse%20Alias%20Arrow%20Handler%20%28for%20Steam%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PASTEBIN_RAW_URL = 'https://pastebin.com/raw/gBrYZNcJ';
    const BUTTON_ID = 'alias-arrow-button';
    const FALLBACK_SEQUENCE = '\u{E01D3}\u2067\u2067 '; // Fallback: 󠁳⁧⁧ + space

    function fetchSequence(callback) {
        console.log('Fetching sequence from Pastebin...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: PASTEBIN_RAW_URL,
            onload: function (response) {
                if (response.status === 200) {
                    let sequence = response.responseText.trim();
                    console.log('Raw Pastebin response:', sequence, 'Length:', sequence.length, 'Codes:', Array.from(sequence).map(c => c.charCodeAt(0).toString(16).padStart(4, '0')));
                    // Sanitize: Ensure sequence is valid (4 chars: tag, RLO, RLO, space)
                    if (sequence && sequence.length === 4) {
                        console.log('Valid sequence fetched:', sequence);
                        callback(sequence);
                    } else {
                        console.error('Invalid sequence from Pastebin, length:', sequence.length);
                        callback(FALLBACK_SEQUENCE);
                    }
                } else {
                    console.error('Pastebin fetch failed, status:', response.status);
                    callback(FALLBACK_SEQUENCE);
                }
            },
            onerror: function () {
                console.error('Network error fetching Pastebin sequence');
                callback(FALLBACK_SEQUENCE);
            }
        });
    }

    function removeSteamErrorMessages() {
        const errorElems = document.querySelectorAll('.form_error, .profile_error_msg, .DialogError, .error');
        errorElems.forEach(elem => {
            if (!elem.textContent.includes('You are changing username too fast!')) {
                elem.remove();
            }
        });
    }

    function clickSaveButton() {
        const saveButton = document.querySelector('.DialogButton._DialogLayout.Primary.Focusable');
        if (saveButton) {
            console.log('Clicking save button');
            saveButton.click();
        } else {
            console.warn('Save button not found');
        }
    }

    function setInputValue(input, value) {
        console.log('Setting input value to:', value);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function insertStyledToggleButton(sequence) {
        const nameInput = document.querySelector('input[name="personaName"]');
        if (!nameInput) {
            console.warn('Name input field not found');
            return;
        }

        const prefix = sequence; // Use sequence as-is (󠁳⁧⁧ + space)
        console.log('Using prefix:', prefix, 'Length:', prefix.length);
        if (document.getElementById(BUTTON_ID)) {
            console.log('Button already exists, skipping creation');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'flex-end';
        wrapper.style.marginTop = '4px';

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.innerHTML = '↺';
        btn.title = 'Toggle Alias Arrow Position';
        btn.type = 'button';
        btn.style.marginLeft = 'auto';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background-color 0.3s';

        // Prevent Enter key from triggering button
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('Preventing Enter key trigger');
                e.preventDefault();
            }
        });

        // Detect if alias arrow sequence is already active
        function isSequenceActive(value) {
            const active = value.startsWith(prefix);
            console.log('Checking if sequence active:', value, 'Result:', active);
            return active;
        }

        // Color indicator
        function updateButtonVisual(active) {
            btn.innerHTML = active ? '↻' : '↺';
            btn.style.backgroundColor = active ? '#5cb85c' : '';
            btn.style.color = active ? 'white' : '';
            console.log('Button visual updated, active:', active);
        }

        // Initial visual state
        let currentName = nameInput.value || '';
        console.log('Initial name:', currentName);
        updateButtonVisual(isSequenceActive(currentName));

        btn.onclick = function () {
            let current = nameInput.value || '';
            console.log('Current name on click:', current);
            let cleanName = current.replace(new RegExp('^' + prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), ''), '').replace(/\?\?/g, '');
            console.log('Cleaned name:', cleanName);

            const shouldAdd = !isSequenceActive(current);
            console.log('Should add sequence:', shouldAdd);

            if (shouldAdd) {
                // Step 1: Set name with Pastebin sequence
                const tempName = prefix + cleanName;
                console.log('Step 1: Setting name with sequence:', tempName);
                setInputValue(nameInput, tempName);
                removeSteamErrorMessages();
                clickSaveButton();

                // Step 2: After delay, remove ?? and preserve sequence
                setTimeout(() => {
                    let currentAfterSave = nameInput.value || '';
                    console.log('Step 2: Current name after save:', currentAfterSave);
                    let finalName = currentAfterSave.replace(/\?\?/g, '');
                    console.log('Step 2: Final name (?? removed):', finalName);
                    setInputValue(nameInput, finalName);
                    removeSteamErrorMessages();
                    clickSaveButton();
                }, 2000);
            } else {
                // Remove sequence to revert to normal
                console.log('Removing sequence, setting name:', cleanName);
                setInputValue(nameInput, cleanName);
                removeSteamErrorMessages();
                clickSaveButton();
            }

            // Update visuals
            updateButtonVisual(shouldAdd);
        };

        wrapper.appendChild(btn);
        nameInput.parentElement.appendChild(wrapper);
        console.log('Toggle button inserted');
    }

    window.addEventListener('load', () => {
        console.log('Page loaded, initializing script');
        setTimeout(() => {
            fetchSequence((seq) => {
                console.log('Sequence received, codes:', Array.from(seq).map(c => c.charCodeAt(0).toString(16).padStart(4, '0')));
                insertStyledToggleButton(seq);
                removeSteamErrorMessages();
            });
        }, 1000);
    });
})();