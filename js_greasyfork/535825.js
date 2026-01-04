// ==UserScript==
// @name         Whitelist Key Lock V2
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Whitelist lock screen with key verification, animated settings, and changelog
// @match        https://www.fluentu.com/spanish/learning/*
// @grant        GM_xmlhttpRequest
// @connect      drive.google.com
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/535825/Whitelist%20Key%20Lock%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/535825/Whitelist%20Key%20Lock%20V2.meta.js
// ==/UserScript==

// Global state
let WHITELIST = null;
let isLoadingWhitelist = false;
let whitelistCallbacks = [];
const FILE_ID = '1QL-7XnZWLY5iVdVOKWCxPLaqZoerYRa7';
const RAW_URL = `https://drive.google.com/uc?id=${FILE_ID}&export=download`;

// Global state
let overlay = null;
let statusCircle = null;
let isOverlayVisible = false;
let autoAnswerEnabled = false;
let hasValidKey = false;
let keyPromptShown = false;
let lastQuestionSnapshot = '';
let whitelistLoaded = false;

// Add a global flag to prevent multiple simultaneous fills
let isFillingDataWord = false;

// --- CONFIG ---
const CHANGELOG_FILE_ID = '1M5ALLc3lx1m23gOEhoHraeX0kiK8lw3W';
const CHANGELOG_URL = `https://drive.google.com/uc?id=${CHANGELOG_FILE_ID}&export=download`;
const CHANGELOG_LOCAL_KEY = 'wl_last_seen_changelog_version';
const AUTO_MODE_KEY = 'wl_auto_mode';
const DARK_MODE_KEY = 'wl_dark_mode';

// SVGs for icons (inline for portability)
const COG_ICON = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="5" fill="#888"/><g stroke="#444" stroke-width="2" stroke-linecap="round"><path d="M14 2v3M14 23v3M4.93 4.93l2.12 2.12M20.95 20.95l2.12 2.12M2 14h3M23 14h3M4.93 23.07l2.12-2.12M20.95 7.05l2.12-2.12"/></g><circle cx="14" cy="14" r="9" stroke="#444" stroke-width="2"/></svg>`;
const CHANGELOG_ICON = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="20" height="20" rx="5" fill="#fff" stroke="#222" stroke-width="2"/><rect x="7" y="8" width="14" height="2" rx="1" fill="#2196F3"/><rect x="7" y="12" width="10" height="2" rx="1" fill="#2196F3"/><rect x="7" y="16" width="6" height="2" rx="1" fill="#2196F3"/><rect x="7" y="20" width="2" height="2" rx="1" fill="#2196F3"/></svg>`;

// 1. Stop auto-answer interval when no questions are present
let autoAnswerInterval = null;

// Add whitelist caching for faster load
const WHITELIST_CACHE_KEY = 'wl_cached_whitelist_v2';
const WHITELIST_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

function getCachedWhitelist() {
    try {
        const cached = JSON.parse(localStorage.getItem(WHITELIST_CACHE_KEY));
        if (cached && cached.data && Date.now() - cached.time < WHITELIST_CACHE_TTL) {
            return cached.data;
        }
    } catch (e) {}
    return null;
}

function setCachedWhitelist(data) {
    localStorage.setItem(WHITELIST_CACHE_KEY, JSON.stringify({ data, time: Date.now() }));
}

function fetchWhitelistFromNetwork(callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: RAW_URL,
        headers: { 'Accept': '*/*', 'Cache-Control': 'no-cache' },
        nocache: true,
        onload: function(response) {
            try {
                const content = response.responseText;
                let parsed = null;
                try {
                    const whitelist = JSON.parse(content);
                    if (Array.isArray(whitelist)) {
                        parsed = whitelist;
                    }
                } catch (e) {
                    const arrayMatch = content.match(/\[\s*"[^"]+(?:",\s*"[^"]+)*"\s*\]/);
                    if (arrayMatch) {
                        parsed = JSON.parse(arrayMatch[0]);
                    }
                }
                callback(Array.isArray(parsed) ? parsed : null);
            } catch (error) {
                callback(null);
            }
        },
        onerror: function() { callback(null); }
    });
}

function loadWhitelist(callback) {
    // Try cache first
    const cached = getCachedWhitelist();
    if (cached) {
        callback(cached);
        // Also update in background
        fetchWhitelistFromNetwork((fresh) => {
            if (fresh) setCachedWhitelist(fresh);
        });
        return;
    }
    // Otherwise, fetch from network
    fetchWhitelistFromNetwork((fresh) => {
        if (fresh) setCachedWhitelist(fresh);
        callback(fresh);
    });
}

function verifyKeyWithWhitelist(key, callback) {
    console.log('=== VERIFYING KEY ===');

    if (!key || typeof key !== 'string') {
        console.log('Invalid key format');
        callback(false);
        return;
    }

    const trimmedKey = key.trim();

    loadWhitelist(whitelist => {
        if (!whitelist || !Array.isArray(whitelist)) {
            console.log('Invalid key');
            callback(false);
            return;
        }

        // Case-sensitive comparison of keys
        const isValid = whitelist.some(validKey => {
            if (typeof validKey !== 'string') return false;
            return validKey.trim() === trimmedKey;
        });

        if (!isValid) {
            console.log('Invalid key');
        }
        callback(isValid);
    });
}

function checkWhitelistKey(callback) {
    console.log('=== CHECKING SAVED KEY ===');
    const savedKey = localStorage.getItem('my_wl_key');

    if (!savedKey) {
        console.log('No saved key found');
        callback(false);
        return;
    }

    verifyKeyWithWhitelist(savedKey, (isValid) => {
        console.log('Saved key valid?', isValid);
        hasValidKey = isValid;
        callback(isValid);
    });
}

function removeScriptFeatures() {
    if (statusCircle) statusCircle.remove();
    if (overlay) overlay.remove();
    statusCircle = null;
    overlay = null;
    autoAnswerEnabled = false;
    isOverlayVisible = false;
}

function showLockScreen() {
    if (!window.location.href.startsWith('https://www.fluentu.com/spanish/learning/')) return;
    if (keyPromptShown) return;

    keyPromptShown = true;
    removeScriptFeatures();
    createLockScreenUI();
}

function createLockScreenUI() {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    `;
    overlay.innerHTML = `
        <div style="
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 90vw;
            width: 400px;
            position: relative;
        ">
            <div id="wlclose" style="
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                border-radius: 12px;
                background: #f0f0f0;
                color: #666;
                transition: all 0.2s;
            ">×</div>
            <div id="wlicon" style="font-size: 64px; margin-bottom: 24px;">🔒</div>
            <h2 style="color: #333; margin: 0 0 1rem 0; font-size: 24px;">Enter Whitelist Key</h2>
            <input id="wlkey" type="text" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                margin-bottom: 1rem;
                box-sizing: border-box;
                outline: none;
            " placeholder="Enter your key here" autofocus>
            <div id="wlerr" style="
                color: #ff4444;
                min-height: 20px;
                margin-bottom: 1rem;
                font-size: 14px;
            "></div>
            <button id="wlsubmit" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
                margin-right: 10px;
            ">Unlock</button>
            <button id="wlcontinue" style="
                display: none;
                background: #2196F3;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
            ">Continue</button>
            <button id="wlskip" style="
                background: #666;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
            ">Continue Without Key</button>
            <div style="
                margin-top: 1rem;
                font-size: 12px;
                color: #666;
            ">A valid whitelist key is required to use the script's features.</div>
        </div>
    `;
    document.body.appendChild(overlay);

    const keyInput = overlay.querySelector('#wlkey');
    const submitBtn = overlay.querySelector('#wlsubmit');
    const continueBtn = overlay.querySelector('#wlcontinue');
    const skipBtn = overlay.querySelector('#wlskip');
    const errorDiv = overlay.querySelector('#wlerr');
    const iconDiv = overlay.querySelector('#wlicon');
    const closeBtn = overlay.querySelector('#wlclose');

    function validateAndSubmit() {
        const key = keyInput.value.trim();
        if (!key) {
            errorDiv.textContent = 'Please enter a key';
            errorDiv.style.color = '#ff4444';
            return;
        }

        verifyKeyWithWhitelist(key, (isValid) => {
            if (isValid) {
                // Valid key - show success UI
                iconDiv.textContent = '✅';
                errorDiv.textContent = 'Valid key! Click Continue to proceed.';
                errorDiv.style.color = '#4CAF50';
                submitBtn.style.display = 'none';
                skipBtn.style.display = 'none';
                continueBtn.style.display = 'inline-block';
                keyInput.disabled = true;

                // Set up continue button
                continueBtn.onclick = () => {
                    localStorage.setItem('my_wl_key', key);
                    hasValidKey = true;
                    overlay.remove();
                    keyPromptShown = false;
                    initializeScriptFeatures();
                };
            } else {
                errorDiv.textContent = 'Invalid key. Please try again or continue without a key.';
                errorDiv.style.color = '#ff4444';
                keyInput.select();
            }
        });
    }

    submitBtn.onclick = validateAndSubmit;
    skipBtn.onclick = () => {
        hasValidKey = false;
        localStorage.removeItem('my_wl_key');
        removeScriptFeatures();
        overlay.remove();
        keyPromptShown = false;
    };

    closeBtn.onclick = () => {
        overlay.remove();
        keyPromptShown = false;
        // If we have a valid key, make sure script features are initialized
        if (hasValidKey) {
            initializeScriptFeatures();
        }
    };

    closeBtn.onmouseover = () => {
        closeBtn.style.background = '#e0e0e0';
        closeBtn.style.color = '#333';
    };

    closeBtn.onmouseout = () => {
        closeBtn.style.background = '#f0f0f0';
        closeBtn.style.color = '#666';
    };

    keyInput.onkeypress = (e) => {
        if (e.key === 'Enter') validateAndSubmit();
    };
}

function createStatusCircle() {
    statusCircle = document.createElement('div');
    statusCircle.style = `
        position: fixed;
        top: 10px;
        left: 10px;
        width: 12px;
        height: 12px;
        background: #ff4040;
        border-radius: 50%;
        z-index: 9998;
        cursor: pointer;
        transition: background-color 0.3s;
    `;
    statusCircle.title = 'Click to toggle auto-answer';
    statusCircle.onclick = () => {
        if (!hasValidKey) {
            showLockScreen();
            return;
        }
        autoAnswerEnabled = !autoAnswerEnabled;
        updateOverlayWithSecretPhrase();
        updateStatusCircle();
    };
    document.body.appendChild(statusCircle);
}

function createOverlay() {
    overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        top: 10px;
        left: 30px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: none;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(overlay);
}

function updateStatusCircle() {
    if (!statusCircle) return;
    statusCircle.style.background = autoAnswerEnabled ? '#40ff40' : '#ff4040';
}

function updateOverlayWithSecretPhrase() {
    let phrases = [];
    document.querySelectorAll('div[data-studied-phrase]').forEach(div => {
        const phrase = div.getAttribute('data-studied-phrase');
        if (phrase && !phrases.includes(phrase)) phrases.push(phrase);
    });
    document.querySelectorAll('.trans-content').forEach(div => {
        const phrase = div.textContent.trim();
        if (phrase && !phrases.includes(phrase)) phrases.push(phrase);
    });

    if (!overlay) createOverlay();
    const autoLabel = autoAnswerEnabled ? '<span style="color:#00ff00;">ON</span>' : '<span style="color:#ff4040;">OFF</span>';
    if (phrases.length === 0) {
        overlay.innerHTML = `<div>Secret phrase not found</div>
                           <div style="margin-top:6px;">Auto Answer: ${autoLabel}</div>`;
    } else {
        overlay.innerHTML = `<div>${phrases[0]?.trim() || 'Secret phrase not found'}</div>
                           <div style="margin-top:6px;">Auto Answer: ${autoLabel}</div>`;
    }
    updateStatusCircle();
}

function getAnswerWord() {
    const word = document.querySelector('.quiz-clip-preview-active-word[data-word]')?.getAttribute('data-word')?.trim() || '';
    // Clean up any ellipses and extra spaces
    return word.replace('...', ' ').replace(/\s+/g, ' ').trim();
}

function normalizeText(text) {
    if (!text) return '';
    return text
        .replace(/\.{3,}/g, ' ') // Replace ellipses with space
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .replace(/[.,!¡?¿;:()\[\]{}*_]/g, '') // Remove punctuation
        .trim()
        .toLowerCase();
}

async function simulateInputEvents(element, value) {
    // Focus the element
    element.focus();
    element.dispatchEvent(new Event('focus', { bubbles: true }));

    // Clear existing value
    element.value = '';
    element.dispatchEvent(new Event('input', { bubbles: true }));

    // Simulate typing each character with proper events
    for (let i = 0; i < value.length; i++) {
        const char = value[i];

        // Create events with proper properties
        const keyDown = new KeyboardEvent('keydown', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });

        const keyPress = new KeyboardEvent('keypress', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            charCode: char.charCodeAt(0)
        });

        const keyUp = new KeyboardEvent('keyup', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });

        // Update value and dispatch events in sequence
        element.dispatchEvent(keyDown);
        element.dispatchEvent(keyPress);

        // Update the value
        element.value = value.substring(0, i + 1);

        // Create and dispatch input event with proper data
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            composed: true,
            inputType: 'insertText',
            data: char
        });
        element.dispatchEvent(inputEvent);

        // Dispatch keyup
        element.dispatchEvent(keyUp);

        // Small delay between characters to mimic human typing
        if (i < value.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    // Final change event
    element.dispatchEvent(new Event('change', { bubbles: true }));

    // Blur the element
    element.dispatchEvent(new Event('blur', { bubbles: true }));

    // Trigger React's synthetic events if needed
    if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        const nativeInputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(nativeInputEvent);
    }
}

function getMCStringForClick() {
    let answer = document.querySelector('.quiz-clip-preview-active-word[data-word]')?.getAttribute('data-word');
    if (!answer) {
        answer = document.querySelector('.quiz-clip-preview-active-word[data-native-phrase], .pinyin-speak-click-element[data-native-phrase]')?.getAttribute('data-native-phrase');
    }
    if (!answer && overlay) {
        answer = overlay.textContent.split('\n')[0].trim();
    }
    return normalizeText(answer || '');
}

async function fillBlankFromDataWord() {
    if (isFillingDataWord) return;
    isFillingDataWord = true;
    try {
        const letterInputs = [...document.querySelectorAll('input[id^="word-input-"][class*="letter"], input[id^="word-input-"][class*="space"]')].filter(inp => !inp.disabled);
        if (!letterInputs.length) { isFillingDataWord = false; return; }

        // Check if already filled
        const filledInputs = letterInputs.filter(input => input.value.trim() !== '');
        if (filledInputs.length === letterInputs.length) {
            const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
            if (checkBtn && !checkBtn.disabled) {
                checkBtn.click();
                if (autoAnswerEnabled) {
                    setTimeout(() => {
                        const contBtn = document.querySelector('#quiz-next-round button[title="Shortcut: Enter"]');
                        if (contBtn) contBtn.click();
                    }, 100);
                }
            }
            isFillingDataWord = false;
            return;
        }

        // Get the full answer phrase
        let answer = '';
        const activeWord = document.querySelector('.quiz-clip-preview-active-word[data-word]');
        if (activeWord) {
            answer = activeWord.getAttribute('data-word');
        } else {
            const studiedPhrase = document.querySelector('[data-studied-phrase]');
            if (studiedPhrase) {
                answer = studiedPhrase.getAttribute('data-studied-phrase');
            }
        }

        answer = normalizeText(answer);
        if (!answer) { isFillingDataWord = false; return; }

        // Map out which inputs are space inputs
        const spaceInputs = letterInputs.map(input => input.className.includes('space'));

        // Convert answer into array of characters, preserving spaces
        const chars = answer.split('');
        let currentInputIndex = 0;
        let filledCount = 0;

        // Instantly fill all inputs
        for (let i = 0; i < chars.length && currentInputIndex < letterInputs.length; i++) {
            const input = letterInputs[currentInputIndex];
            const char = chars[i];
            if (spaceInputs[currentInputIndex] && char !== ' ') continue;
            if (!spaceInputs[currentInputIndex] && char === ' ') continue;
            input.value = char;
            filledCount++;
            currentInputIndex++;
        }

        if (filledCount > 0) {
            // Simulate a single key event on the last input to trigger UI update
            const lastInput = letterInputs[letterInputs.length - 1];
            lastInput.focus();
            lastInput.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, composed: true}));
            lastInput.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true, composed: true}));
            lastInput.dispatchEvent(new InputEvent('input', {bubbles: true, cancelable: true, composed: true, inputType: 'insertText', data: ''}));
            lastInput.dispatchEvent(new Event('change', { bubbles: true }));
            lastInput.blur();

            // Click check button
            const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
            if (checkBtn && !checkBtn.disabled) {
                checkBtn.click();
                if (autoAnswerEnabled) {
                    setTimeout(() => {
                        const contBtn = document.querySelector('#quiz-next-round button[title="Shortcut: Enter"]');
                        if (contBtn) contBtn.click();
                    }, 100);
                }
            }
        }

        if (window.wl_auto_mode === 'fast' && !window._fastAutoAnswered) {
            window._fastAutoAnswered = true;
            localStorage.setItem('wl_fast_auto_answered', 'true');
        }
    } finally {
        isFillingDataWord = false;
    }
}

async function fillBlankFromPhrase() {
    // Find the contenteditable input
    const input = document.querySelector('div[contenteditable="true"].js-quiz-answer-input-field, #translator-input');
    if (!input) {
        console.log('No input found');
        return;
    }

    // Try multiple methods to find the answer
    let answer = null;

    // Method 1: Check active word with data-word
    const activeWord = document.querySelector('.clip-preview-term-instance.word[data-word]');
    if (activeWord) {
        answer = activeWord.getAttribute('data-word');
    }

    // Method 2: Check data-studied-phrase elements
    if (!answer) {
        const studiedPhraseEl = document.querySelector('[data-studied-phrase]');
        if (studiedPhraseEl) {
            answer = studiedPhraseEl.getAttribute('data-studied-phrase');
        }
    }

    // Method 3: Check for native phrase
    if (!answer) {
        const nativePhraseEl = document.querySelector('[data-native-phrase]');
        if (nativePhraseEl) {
            answer = nativePhraseEl.getAttribute('data-native-phrase');
        }
    }

    if (!answer) {
        console.log('No answer found');
        return;
    }

    // Normalize the answer text
    answer = normalizeText(answer);
    console.log('Found answer:', answer);

    // Focus and click the input first
    input.focus();
    input.click();

    // Clear existing content
    input.textContent = '';

    // Type each character with proper events
    for (let i = 0; i < answer.length; i++) {
        const char = answer[i];

        // Create keyboard events
        const keyDown = new KeyboardEvent('keydown', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });

        const keyPress = new KeyboardEvent('keypress', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0),
            charCode: char.charCodeAt(0)
        });

        // Dispatch keydown and keypress
        input.dispatchEvent(keyDown);
        input.dispatchEvent(keyPress);

        // Update content
        input.textContent = answer.substring(0, i + 1);

        // Create and dispatch input event
        const inputEvent = new InputEvent('input', {
            inputType: 'insertText',
            data: char,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        input.dispatchEvent(inputEvent);

        // Dispatch keyup
        const keyUp = new KeyboardEvent('keyup', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true,
            keyCode: char.charCodeAt(0),
            which: char.charCodeAt(0)
        });
        input.dispatchEvent(keyUp);

        // Slightly faster delay between characters
        if (i < answer.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    }

    // Final change event
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Small delay before clicking check
    await new Promise(resolve => setTimeout(resolve, 25));

    // Simulate Enter key press
    const enterKeyDown = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
        composed: true
    });
    input.dispatchEvent(enterKeyDown);
    document.dispatchEvent(enterKeyDown);

    // Click check button
    const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
    if (checkBtn && !checkBtn.disabled) {
        checkBtn.click();
    }

    // If auto-answer is enabled, click continue after a short delay
    if (autoAnswerEnabled) {
        setTimeout(() => {
            const contBtn = document.querySelector('#quiz-next-round button[title="Shortcut: Enter"]');
            if (contBtn) contBtn.click();
        }, 100);
    }

    if (window.wl_auto_mode === 'fast' && !window._fastAutoAnswered) {
        window._fastAutoAnswered = true;
        localStorage.setItem('wl_fast_auto_answered', 'true');
    }
}

function clickCorrectAnswer() {
    const finalMCString = getMCStringForClick();
    if (!finalMCString) return;

    let clicked = false;
    const buttons = Array.from(document.querySelectorAll('button.btn-answer'));
    let idx = 0;
    function clickNext() {
        if (idx >= buttons.length) return;
        const button = buttons[idx];
        const label = button.querySelector('label');
        if (label) {
            const buttonText = normalizeText(label.textContent);
            if (buttonText.includes(finalMCString) || finalMCString.includes(buttonText)) {
                button.click();
                clicked = true;
                // Set fast auto answered flag ONLY after a real answer
                if (window.wl_auto_mode === 'fast' && !window._fastAutoAnswered) {
                    window._fastAutoAnswered = true;
                    localStorage.setItem('wl_fast_auto_answered', 'true');
                }
            }
        }
        idx++;
        setTimeout(clickNext, 100); // 100ms delay between each button
    }
    clickNext();

    if (clicked) {
        setTimeout(() => {
            const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
            if (checkBtn && !checkBtn.disabled) checkBtn.click();
        }, 150);
    }
}

// Improved helper for the new question type (button order)
async function answerButtonOrderQuestion() {
    // 1. Find all visible, enabled answer buttons with a data-place attribute
    const buttons = Array.from(document.querySelectorAll('button[data-place]')).filter(btn => {
        return btn.offsetParent !== null && !btn.disabled;
    });
    if (buttons.length === 0) {
        return false;
    }

    // 2. Sort buttons by their data-place value (as numbers)
    buttons.sort((a, b) => {
        return parseInt(a.getAttribute('data-place')) - parseInt(b.getAttribute('data-place'));
    });

    // 3. Click each button in order
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
    }
    // Wait for the Check button to appear and be enabled, then simulate Enter on it, or click it as fallback
    function tryCheckButton() {
        const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
        if (checkBtn && !checkBtn.disabled) {
            checkBtn.focus();
            // Try to simulate Enter keydown on the button
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            checkBtn.dispatchEvent(enterEvent);
            // Fallback: also click the button directly
            setTimeout(() => {
                if (!checkBtn.disabled) checkBtn.click();
            }, 50);
        } else {
            setTimeout(tryCheckButton, 100);
        }
    }
    tryCheckButton();
}

// Helper to check if there are any actionable elements (questions or buttons)
function isActionablePresent() {
    // Check for any question input/button
    if (document.querySelector('.quiz-clip-preview-active-word, div[contenteditable="true"].js-quiz-answer-input-field, #translator-input, button.btn-answer, button[data-place]')) {
        return true;
    }

    // Check for letter inputs
    const letterInputs = document.querySelectorAll('input[id^="word-input-"][class*="letter"], input[id^="word-input-"][class*="space"]');
    if (letterInputs.length > 0) {
        // Only return true if there are unfilled inputs
        return Array.from(letterInputs).some(input => !input.value.trim());
    }

    // Check for multi-word inputs
    const multiWordInputs = document.querySelectorAll('input[id^="word-input-"]:not([class*="letter"])');
    if (multiWordInputs.length > 0) {
        // Only return true if there are unfilled inputs
        return Array.from(multiWordInputs).some(input => !input.value.trim());
    }

    // Check for "Already Know" button
    if (document.querySelector('#quiz-already-know, .js-answer-tip, [title="Already Know"]')) {
        return true;
    }

    // Check for navigation buttons
    const btns = Array.from(document.querySelectorAll('button, a'));
    return btns.some(btn => {
        if (btn.disabled) return false;
        const txt = btn.textContent.trim().toLowerCase();
        return ["continue", "next", "check", "submit"].some(word => txt === word || txt.startsWith(word + ' '));
    });
}

function findContinueButton() {
    // Try common selectors first
    let btn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
    if (btn && !btn.disabled) return btn;
    // Fallback: search for button by text
    const btns = Array.from(document.querySelectorAll('button, a'));
    return btns.find(b => {
        if (b.disabled) return false;
        const txt = b.textContent.trim().toLowerCase();
        return ["continue", "next", "check", "submit"].some(word => txt === word || txt.startsWith(word + ' '));
    }) || null;
}

function performAnswerActions(skipContinue) {
    if (!hasValidKey) {
        showLockScreen();
        return;
    }

    // Turn off auto answer if 'Percentage of video learned' or 'Accuracy' is detected
    if (document.body && document.body.innerText && (document.body.innerText.includes('Percentage of video learned') || document.body.innerText.includes('Accuracy'))) {
        autoAnswerEnabled = false;
        updateStatusCircle && updateStatusCircle();
        updateOverlayWithSecretPhrase && updateOverlayWithSecretPhrase();
        console.log('Auto answer disabled: Summary screen detected.');
        return;
    }

    updateOverlayWithSecretPhrase();

    // Fast mode: only answer the first question, then click Already Know for the rest
    if (window.wl_auto_mode === 'fast' && window._fastAutoAnswered) {
        // Click Already Know as fast as possible
        const clickAlreadyKnow = () => {
            const alreadyKnowBtn = document.querySelector('#quiz-already-know, .js-answer-tip, [title="Already Know"]');
            if (alreadyKnowBtn) {
                alreadyKnowBtn.click();
            } else {
                // If not available, try again on next animation frame
                requestAnimationFrame(clickAlreadyKnow);
            }
        };
        clickAlreadyKnow();
        return;
    }

    // PRIORITY: Check for button order question type FIRST
    if (document.querySelectorAll('button[data-place]').length > 0) {
        answerButtonOrderQuestion();
        return;
    }

    // If secret phrase is not found and "Already Know" button exists, click it
    if (overlay && overlay.textContent.includes('Secret phrase not found')) {
        const alreadyKnowBtn = document.querySelector('#quiz-already-know, .js-answer-tip, [title="Already Know"]');
        if (alreadyKnowBtn) {
            alreadyKnowBtn.click();
            return;
        }
    }

    // Check for contenteditable input first
    const contentEditableInput = document.querySelector('div[contenteditable="true"].js-quiz-answer-input-field, #translator-input');
    if (contentEditableInput) {
        fillBlankFromPhrase();
        return;
    }

    // Then check for letter inputs
    const letterInputs = document.querySelectorAll('input[id^="word-input-"][class*="letter"]');
    const multiWordInputs = document.querySelectorAll('input[id^="word-input-"]:not([class*="letter"])');
    if (letterInputs.length > 0) {
        fillBlankFromDataWord();
        return;
    } else if (multiWordInputs.length > 0) {
        fillBlankFromPhrase();
        return;
    }

    // Only run MC logic if no other inputs are present
    if (document.querySelectorAll('button.btn-answer').length > 0) {
        clickCorrectAnswer();
    }

    // Auto-progress: always click Check if autoAnswerEnabled or skipContinue === false
    if (autoAnswerEnabled || skipContinue === false) {
        const checkBtn = document.querySelector('button[title="Shortcut: Enter"], a[title="Shortcut: Enter"]');
        if (checkBtn) {
            checkBtn.click();
        }
    }
    // Only click Continue/Next if autoAnswerEnabled is true
    if (autoAnswerEnabled) {
        setTimeout(() => {
            const contBtn = document.querySelector('#quiz-next-round button[title="Shortcut: Enter"]');
            if (contBtn) contBtn.click();
        }, 100);
    }
}

function initializeScriptFeatures() {
    if (!hasValidKey) return;
    createStatusCircle();
    createOverlay();
    updateStatusCircle();
    updateOverlayWithSecretPhrase();
    setInterval(() => {
        if (!hasValidKey) {
            removeScriptFeatures();
            return;
        }
        if (autoAnswerEnabled) {
            performAnswerActions();
        }
    }, 300);
    addTopRightIcons();
}

// Add settings and changelog icons to the top right
function addTopRightIcons() {
    let iconBar = document.getElementById('wl-icon-bar');
    if (!iconBar) {
        iconBar = document.createElement('div');
        iconBar.id = 'wl-icon-bar';
        iconBar.style = `
            position: fixed;
            top: 18px;
            right: 24px;
            z-index: 100010;
            display: flex;
            gap: 12px;
        `;
        document.body.appendChild(iconBar);
    }
    // Settings (cog)
    let cog = document.getElementById('wl-cog-icon');
    if (!cog) {
        cog = document.createElement('div');
        cog.id = 'wl-cog-icon';
        cog.innerHTML = COG_ICON;
        cog.style = 'width:38px;height:38px;cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:box-shadow 0.2s;';
        cog.onmousedown = () => { cog.style.boxShadow = '0 1px 4px rgba(0,0,0,0.18)'; cog.style.transform = 'scale(0.96)'; };
        cog.onmouseup = () => { cog.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; cog.style.transform = 'scale(1)'; };
        cog.onclick = () => {
            // If changelog is open, close it and open settings
            if (document.querySelector('.wl-changelog-modal-roblox')) {
                closeChangelogModal();
                setTimeout(() => showSettingsModal(), 10);
            } else if (!document.querySelector('.wl-settings-modal-roblox')) {
                showSettingsModal();
            }
        };
        iconBar.appendChild(cog);
    }
    // Changelog
    let changelog = document.getElementById('wl-changelog-icon');
    if (!changelog) {
        changelog = document.createElement('div');
        changelog.id = 'wl-changelog-icon';
        changelog.innerHTML = CHANGELOG_ICON;
        changelog.style = 'width:38px;height:38px;cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:box-shadow 0.2s;';
        changelog.onmousedown = () => { changelog.style.boxShadow = '0 1px 4px rgba(0,0,0,0.18)'; changelog.style.transform = 'scale(0.96)'; };
        changelog.onmouseup = () => { changelog.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; changelog.style.transform = 'scale(1)'; };
        changelog.onclick = () => {
            // If settings is open, close it and open changelog
            if (document.querySelector('.wl-settings-modal-roblox')) {
                document.querySelector('.wl-settings-modal-roblox')?.remove();
                document.querySelector('.wl-settings-overlay-roblox')?.remove();
                setTimeout(() => showChangelogModal(), 10);
            } else if (!document.querySelector('.wl-changelog-modal-roblox')) {
                showChangelogModal();
            }
        };
        iconBar.appendChild(changelog);
    }
}

// Settings modal
function showSettingsModal() {
    // If changelog modal is open, close it and open settings after a short delay
    if (document.querySelector('.wl-changelog-modal-roblox')) {
        document.querySelector('.wl-changelog-modal-roblox')?.remove();
        document.querySelector('.wl-changelog-overlay-roblox')?.remove();
        setTimeout(() => showSettingsModal(), 10);
        return;
    }
    closeModals();
    injectCartoonFont();
    injectChangelogStyles();
    let overlay = document.createElement('div');
    overlay.className = 'wl-settings-overlay-roblox';
    overlay.style = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(33,150,243,0.08); z-index: 100011; cursor: pointer;';
    overlay.onclick = () => {
        document.querySelector('.wl-settings-modal-roblox')?.remove();
        overlay.remove();
    };
    document.body.appendChild(overlay);
    let modal = document.createElement('div');
    modal.className = 'wl-settings-modal-roblox';
    modal.innerHTML = `
        <div class="wl-settings-header-roblox"><span>Settings</span><span class="wl-settings-close-roblox" id="wl-settings-close">×</span></div>
        <div class="wl-settings-content-roblox">
            <div style="margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:15px;">Auto Answer Mode:</span>
                <select id="wl-auto-mode-select" style="font-size:15px;padding:4px 10px;border-radius:8px;border:1px solid #2196F3;background:#f7faff;color:#222;outline:none;">
                    <option value="auto">Normal</option>
                    <option value="fast">Fast</option>
                </select>
            </div>
            <div style="font-size:12px;color:#888;margin-bottom:10px;">If it says <b>you have no words for review</b> switch from fast mode to normal mode.</div>
            <div style="margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:15px;">Dark Mode 🌓</span>
                <label class="wl-switch">
                    <input type="checkbox" id="wl-dark-mode-toggle">
                    <span class="wl-slider"></span>
                </label>
            </div>
        </div>
        <style>
        .wl-switch { position: relative; display: inline-block; width: 46px; height: 24px; }
        .wl-switch input { opacity: 0; width: 0; height: 0; }
        .wl-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #ccc; transition: .3s; border-radius: 24px; }
        .wl-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; transition: .3s; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
        input:checked + .wl-slider { background: #23272a; }
        input:checked + .wl-slider:before { transform: translateX(22px); background: #e0e0e0; }
        </style>
    `;
    document.body.appendChild(modal);
    animateIn(modal);
    document.getElementById('wl-settings-close').onclick = () => {
        animateOut(modal, () => modal.remove());
        overlay.remove();
    };
    // Dropdown logic
    const modeSelect = document.getElementById('wl-auto-mode-select');
    let mode = localStorage.getItem(AUTO_MODE_KEY) || 'auto';
    modeSelect.value = mode;
    modeSelect.onchange = () => {
        localStorage.setItem(AUTO_MODE_KEY, modeSelect.value);
        window.wl_auto_mode = modeSelect.value;
        resetFastAutoAnswered();
    };
    // Dark mode toggle logic
    const darkToggle = document.getElementById('wl-dark-mode-toggle');
    const darkPref = localStorage.getItem(DARK_MODE_KEY) === 'on';
    darkToggle.checked = darkPref;
    darkToggle.onchange = () => {
        if (darkToggle.checked) {
            localStorage.setItem(DARK_MODE_KEY, 'on');
            applyDarkMode(true);
        } else {
            localStorage.setItem(DARK_MODE_KEY, 'off');
            applyDarkMode(false);
        }
    };
}

// --- CHANGELOG MODAL ---
function injectCartoonFont() {
    if (!document.getElementById('wl-cartoon-font')) {
        const link = document.createElement('link');
        link.id = 'wl-cartoon-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap';
        document.head.appendChild(link);
    }
}

function injectChangelogStyles() {
    if (document.getElementById('wl-changelog-style')) return;
    const style = document.createElement('style');
    style.id = 'wl-changelog-style';
    style.textContent = `
    .wl-changelog-modal-roblox, .wl-settings-modal-roblox {
        font-family: 'Fredoka One', 'Baloo', Arial, sans-serif !important;
        border-radius: 24px !important;
        box-shadow: 0 6px 24px 0 rgba(0,0,0,0.16) !important;
        min-width: 220px !important;
        max-width: 96vw !important;
        width: 340px !important;
        background: #fff !important;
        border: 3px solid #2196F3 !important;
        overflow: visible !important;
        z-index: 100012 !important;
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        transition: box-shadow 0.2s;
    }
    .wl-changelog-overlay-roblox {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(33,150,243,0.08); z-index: 100011; cursor: pointer;
    }
    .wl-changelog-header-roblox, .wl-settings-header-roblox {
        background: linear-gradient(90deg, #2196F3 80%, #42a5f5 100%);
        color: #fff;
        font-size: 1.25rem;
        font-weight: 600;
        border-radius: 20px 20px 0 0;
        padding: 14px 18px 8px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        letter-spacing: 1px;
        box-shadow: 0 2px 8px rgba(33,150,243,0.08);
        text-shadow: 0 2px 8px rgba(33,150,243,0.18), 0 1px 0 #fff;
    }
    .wl-changelog-header-roblox span:first-child, .wl-settings-header-roblox span:first-child {
        text-shadow: 0 2px 8px rgba(33,150,243,0.18), 0 1px 0 #fff;
    }
    .wl-changelog-close-roblox, .wl-settings-close-roblox {
        width: 32px; height: 32px; border-radius: 50%; background: #fff; color: #2196F3;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem; font-weight: 700; cursor: pointer; transition: background 0.18s, color 0.18s, transform 0.18s;
        box-shadow: 0 2px 8px rgba(33,150,243,0.10);
        border: 2px solid #2196F3;
    }
    .wl-changelog-close-roblox:hover, .wl-settings-close-roblox:hover {
        background: #2196F3; color: #fff; transform: scale(1.08);
    }
    .wl-changelog-content-roblox, .wl-settings-content-roblox {
        padding: 18px 18px 12px 18px;
        max-height: 320px;
        overflow-y: auto;
        font-size: 1.02rem;
        background: #f7faff;
        border-radius: 0 0 20px 20px;
    }
    .wl-changelog-bubble {
        display: flex; align-items: flex-start; gap: 10px;
        background: #fff;
        border-left: 5px solid #2196F3;
        border-radius: 14px;
        box-shadow: 0 2px 8px rgba(33,150,243,0.08);
        margin-bottom: 10px;
        padding: 10px 12px 10px 12px;
        font-size: 0.98rem;
        color: #222;
        position: relative;
        animation: wl-bubble-in 0.5s cubic-bezier(.4,2,.6,1);
    }
    .wl-changelog-bubble-icon {
        font-size: 1.1rem; color: #2196F3; margin-top: 2px;
        flex-shrink: 0;
    }
    @keyframes wl-bubble-in {
        0% { opacity: 0; transform: translateY(20px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .wl-changelog-date-roblox {
        color: #2196F3; font-weight: 700; margin-bottom: 12px; font-size: 0.98rem;
        text-align: right;
    }
    .wl-changelog-error-roblox {
        color: #e74c3c; font-weight: 700; text-align: center; margin-top: 18px; font-size: 1.02rem;
    }
    .wl-loading-anim-roblox {
        display: flex; gap: 2px; font-family: 'Fredoka One', 'Baloo', Arial, sans-serif; font-size: 1.1rem; margin-top: 12px; justify-content: center;
    }
    .wl-loading-anim-roblox span {
        display: inline-block; transition: transform 0.3s cubic-bezier(.4,2,.6,1);
        animation: wl-bounce 1.1s infinite;
    }
    .wl-loading-anim-roblox span:nth-child(1) { animation-delay: 0s; }
    .wl-loading-anim-roblox span:nth-child(2) { animation-delay: 0.1s; }
    .wl-loading-anim-roblox span:nth-child(3) { animation-delay: 0.2s; }
    .wl-loading-anim-roblox span:nth-child(4) { animation-delay: 0.3s; }
    .wl-loading-anim-roblox span:nth-child(5) { animation-delay: 0.4s; }
    .wl-loading-anim-roblox span:nth-child(6) { animation-delay: 0.5s; }
    .wl-loading-anim-roblox span:nth-child(7) { animation-delay: 0.6s; }
    .wl-loading-anim-roblox span:nth-child(8) { animation-delay: 0.7s; }
    .wl-loading-anim-roblox span:nth-child(9) { animation-delay: 0.8s; }
    .wl-loading-anim-roblox span:nth-child(10) { animation-delay: 0.9s; }
    @keyframes wl-bounce {
        0%, 100% { transform: translateY(0); }
        40% { transform: translateY(-12px); }
        60% { transform: translateY(-7px); }
    }
    `;
    document.head.appendChild(style);
}

let wlChangelogCache = null;
function preloadChangelog() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: CHANGELOG_URL,
        headers: { 'Accept': 'application/json' },
        onload: function(response) {
            try {
                wlChangelogCache = JSON.parse(response.responseText);
            } catch (e) {
                wlChangelogCache = null;
            }
        },
        onerror: function() {
            wlChangelogCache = null;
        }
    });
}

function showChangelogModal(force) {
    // If settings modal is open, close it and open changelog after a short delay
    if (document.querySelector('.wl-settings-modal-roblox')) {
        document.querySelector('.wl-settings-modal-roblox')?.remove();
        document.querySelector('.wl-settings-overlay-roblox')?.remove();
        setTimeout(() => showChangelogModal(force), 10);
        return;
    }
    injectCartoonFont();
    injectChangelogStyles();
    document.querySelector('.wl-changelog-modal-roblox')?.remove();
    document.querySelector('.wl-changelog-overlay-roblox')?.remove();
    let overlay = document.createElement('div');
    overlay.className = 'wl-changelog-overlay-roblox';
    overlay.onclick = () => closeChangelogModal();
    document.body.appendChild(overlay);
    let modal = document.createElement('div');
    modal.className = 'wl-changelog-modal-roblox';
    modal.innerHTML = `
        <div class="wl-changelog-header-roblox"><span>Changelog</span><span class="wl-changelog-close-roblox" id="wl-changelog-close">×</span></div>
        <div class="wl-changelog-content-roblox" id="wl-changelog-content">
            <div class="wl-loading-anim-roblox">
                <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    animateIn(modal);
    function closeHandler() { closeChangelogModal(); }
    document.getElementById('wl-changelog-close').onclick = closeHandler;
    window.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeChangelogModal(); window.removeEventListener('keydown', escHandler); }
    });
    // Use cache if available
    if (wlChangelogCache) {
        let html = `<div class='wl-changelog-date-roblox' style='text-align:center;font-size:1.05em;margin-bottom:18px;'>Last updated: ${wlChangelogCache.date}</div>`;
        for (const entry of wlChangelogCache.entries) {
            html += `<div class='wl-changelog-bubble'><span class='wl-changelog-bubble-icon'>⭐</span><span>${entry}</span></div>`;
        }
        document.getElementById('wl-changelog-content').innerHTML = html;
        document.getElementById('wl-changelog-close').onclick = closeHandler;
        if (!force) localStorage.setItem(CHANGELOG_LOCAL_KEY, wlChangelogCache.version);
    } else {
        // Fallback: fetch if not yet loaded
        GM_xmlhttpRequest({
            method: 'GET',
            url: CHANGELOG_URL,
            headers: { 'Accept': 'application/json' },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    wlChangelogCache = data;
                    let html = `<div class='wl-changelog-date-roblox' style='text-align:center;font-size:1.05em;margin-bottom:18px;'>Last updated: ${data.date}</div>`;
                    for (const entry of data.entries) {
                        html += `<div class='wl-changelog-bubble'><span class='wl-changelog-bubble-icon'>⭐</span><span>${entry}</span></div>`;
                    }
                    document.getElementById('wl-changelog-content').innerHTML = html;
                    document.getElementById('wl-changelog-close').onclick = closeHandler;
                    if (!force) localStorage.setItem(CHANGELOG_LOCAL_KEY, data.version);
                } catch (e) {
                    document.getElementById('wl-changelog-content').innerHTML = '<div class="wl-changelog-error-roblox">Failed to load changelog.</div>';
                    document.getElementById('wl-changelog-close').onclick = closeHandler;
                }
            },
            onerror: function() {
                document.getElementById('wl-changelog-content').innerHTML = '<div class="wl-changelog-error-roblox">Failed to load changelog.</div>';
                document.getElementById('wl-changelog-close').onclick = closeHandler;
            }
        });
    }
}

function closeChangelogModal() {
    document.querySelector('.wl-changelog-modal-roblox')?.remove();
    document.querySelector('.wl-changelog-overlay-roblox')?.remove();
}

// --- MAIN ENTRY ---
(function() {
    if (!window.location.href.startsWith('https://www.fluentu.com/spanish/learning/')) return;
    // Run key check immediately
    let keyChecked = false;
    checkWhitelistKey((isValid) => {
        keyChecked = true;
        if (!isValid) {
            hasValidKey = false;
            removeScriptFeatures();
        } else {
            hasValidKey = true;
            initializeScriptFeatures();
        }
    });
    // Defer event listeners until key is checked
    document.addEventListener('keydown', function(e) {
        if (!window.location.href.startsWith('https://www.fluentu.com/spanish/learning/')) return;
        if (!keyChecked) return; // Ignore until key is checked

        // Handle backtick key - always shows whitelist screen
        if (e.key === '`') {
            e.preventDefault();
            showLockScreen();
            return;
        }

        // Only show prompt for hotkeys if no valid key
        if (!hasValidKey && (e.key === 'Tab' || e.key === 'Control' || e.key === '\\')) {
            e.preventDefault();
            showLockScreen();
            return;
        }

        // Only handle other hotkeys if we have a valid key
        if (hasValidKey) {
            if (e.key === '\\') {
                e.preventDefault();
                isOverlayVisible = !isOverlayVisible;
                if (!overlay) createOverlay();
                overlay.style.display = isOverlayVisible ? 'block' : 'none';
                if (isOverlayVisible) updateOverlayWithSecretPhrase();
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                autoAnswerEnabled = !autoAnswerEnabled;
                // Reset fast mode state when toggling auto answer
                window._fastAutoAnswered = false;
                updateOverlayWithSecretPhrase();
                updateStatusCircle();
            }
            if (e.key === 'Control') {
                e.preventDefault();
                // Enter the correct answer and click check (but do not click continue unless autoAnswerEnabled)
                performAnswerActions(false);
            }
        }
    });
    // Preload the whitelist when the script starts
    loadWhitelist(() => {});
    // Preload changelog as soon as possible
    preloadChangelog();
})();

// --- ANIMATION HELPERS ---
function animateIn(el) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
        el.style.transition = 'all 0.25s cubic-bezier(.4,2,.6,1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
    }, 10);
}
function animateOut(el, cb) {
    el.style.transition = 'all 0.2s cubic-bezier(.4,2,.6,1)';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    setTimeout(() => { if (cb) cb(); }, 200);
}
function closeModals() {
    document.getElementById('wl-settings-modal')?.remove();
}

// --- Ensure preferred mode is always loaded on script start ---
window.addEventListener('DOMContentLoaded', () => {
    window.wl_auto_mode = localStorage.getItem(AUTO_MODE_KEY) || 'auto';
});
window.wl_auto_mode = localStorage.getItem(AUTO_MODE_KEY) || 'auto';

function resetFastAutoAnswered() {
    window._fastAutoAnswered = false;
    localStorage.setItem('wl_fast_auto_answered', 'false');
}

// Optionally, reset fast mode state when quiz changes (e.g., on navigation)
window.addEventListener('popstate', resetFastAutoAnswered);
window.addEventListener('hashchange', resetFastAutoAnswered);

function applyDarkMode(enabled) {
    let style = document.getElementById('wl-dark-mode-style');
    if (enabled) {
        if (!style) {
            style = document.createElement('style');
            style.id = 'wl-dark-mode-style';
            style.textContent = `
                body, html, #app, .main-content, .content, .container, .card, .panel, .quiz-card, .quiz-panel, .quiz-content, .quiz-question, .trans-content, .vocab-card, .vocab-panel, .vocab-content, .vocab-section, .vocab-list, .vocab-header, .vocab-footer, .vocab-modal, .vocab-overlay, .vocab-popup, .vocab-dialog, .vocab-tooltip, .vocab-dropdown, .vocab-menu,
                .header, .footer, .video-player, .video-container, .sidebar, .nav, .navbar, .menu, .menu-bar, .menu-list, .menu-item, .dropdown, .dropdown-menu, .dropdown-item, .modal, .popup, .dialog, .tooltip, .panel, .card, .list, .list-item, .section, .content, .main, .background, .overlay, .input, .button, .form, .quiz, .quiz-header, .quiz-footer, .quiz-main, .quiz-side, .quiz-row, .quiz-col, .quiz-box, .quiz-container, .quiz-modal, .quiz-overlay, .quiz-popup, .quiz-dialog, .quiz-tooltip, .quiz-dropdown, .quiz-menu, .quiz-list, .quiz-list-item, .quiz-list-header, .quiz-list-footer, .quiz-list-content, .quiz-list-title, .quiz-list-description, .quiz-list-meta, .quiz-list-action, .quiz-list-icon, .quiz-list-avatar, .quiz-list-badge, .quiz-list-tag, .quiz-list-label, .quiz-list-value, .quiz-list-extra, .quiz-list-divider, .quiz-list-separator, .quiz-list-group, .quiz-list-subtitle, .quiz-list-note, .quiz-list-tip, .quiz-list-warning, .quiz-list-error, .quiz-list-success, .quiz-list-info, .quiz-list-empty, .quiz-list-loading, .quiz-list-more, .quiz-list-expand, .quiz-list-collapse, .quiz-list-toggle, .quiz-list-switch, .quiz-list-slider, .quiz-list-progress, .quiz-list-step, .quiz-list-dot, .quiz-list-circle, .quiz-list-bar, .quiz-list-line, .quiz-list-track, .quiz-list-thumb, .quiz-list-rail, .quiz-list-fill, .quiz-list-mask, .quiz-list-shadow, .quiz-list-glow, .quiz-list-blur, .quiz-list-fade, .quiz-list-zoom, .quiz-list-flip, .quiz-list-spin, .quiz-list-bounce, .quiz-list-shake, .quiz-list-wobble, .quiz-list-jump, .quiz-list-swing, .quiz-list-tada, .quiz-list-rubber, .quiz-list-pulse, .quiz-list-heart, .quiz-list-star, .quiz-list-fire, .quiz-list-spark, .quiz-list-flash, .quiz-list-light, .quiz-list-dark, .quiz-list-night, .quiz-list-day, .quiz-list-sun, .quiz-list-moon, .quiz-list-cloud, .quiz-list-rain, .quiz-list-snow, .quiz-list-wind, .quiz-list-thunder, .quiz-list-lightning, .quiz-list-storm, .quiz-list-fog, .quiz-list-mist, .quiz-list-haze, .quiz-list-smoke, .quiz-list-dust, .quiz-list-sand, .quiz-list-mud, .quiz-list-dirt, .quiz-list-grass, .quiz-list-leaf, .quiz-list-flower, .quiz-list-tree, .quiz-list-plant, .quiz-list-fruit, .quiz-list-vegetable, .quiz-list-meat, .quiz-list-fish, .quiz-list-egg, .quiz-list-milk, .quiz-list-bread, .quiz-list-cake, .quiz-list-cookie, .quiz-list-candy, .quiz-list-ice, .quiz-list-cream, .quiz-list-chocolate, .quiz-list-coffee, .quiz-list-tea, .quiz-list-juice, .quiz-list-water, .quiz-list-soda, .quiz-list-beer, .quiz-list-wine, .quiz-list-cocktail, .quiz-list-drink, .quiz-list-cup, .quiz-list-glass, .quiz-list-bottle, .quiz-list-can, .quiz-list-jar, .quiz-list-box, .quiz-list-bag, .quiz-list-basket {
                    background: #23272a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
            `;
            document.head.appendChild(style);
        }
        document.body.classList.add('wl-dark-mode');
    } else {
        if (style) style.remove();
        document.body.classList.remove('wl-dark-mode');
    }
}