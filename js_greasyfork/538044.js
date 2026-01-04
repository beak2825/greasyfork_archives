// ==UserScript==
// @name         YTCWBypass
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Bypasses YouTube content warning on possibly unsafe content.
// @author       Dormy
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/538044/YTCWBypass.user.js
// @updateURL https://update.greasyfork.org/scripts/538044/YTCWBypass.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const SKIPPER_STATE_KEY = 'yt-bypass-enabled-state';
    const TOGGLE_BUTTON_ID = 'yt-bypass-toggle-button';
    let isBypassEnabled = true;

    function performMultiProngedClick(element) {
        try {
            element.focus();
            element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        } catch (e) { /* Silently fail */ }
        try { element.click(); } catch (e) { /* Silently fail */ }
        try {
            const eventInit = { bubbles: true, cancelable: true, view: unsafeWindow };
            element.dispatchEvent(new MouseEvent('mousedown', eventInit));
            element.dispatchEvent(new MouseEvent('mouseup', eventInit));
            element.dispatchEvent(new MouseEvent('click', eventInit));
        } catch (e) { /* Silently fail */ }
    }

    /**
     * Finds and clicks the warning button if it's visible.
     * @returns {boolean} - True if the button was found and clicked, otherwise false.
     */
    function findAndClickWarningButton() {
        const buttonIdentifiers = ["I understand and wish to proceed", "Continue"];
        for (const text of buttonIdentifiers) {
            const xpath = `(//button | //*[@role="button"] | //yt-button-shape | //yt-button-renderer)[contains(., "${text}") or @aria-label="${text}"]`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const container = result.singleNodeValue;
            if (container && container.offsetParent !== null) {
                const elementToClick = container.querySelector('button') || container;
                performMultiProngedClick(elementToClick);
                return true; // Success
            }
        }
        return false; // Not found
    }

    /**
     * Starts a polling process that checks for the warning button every 500ms for 15 seconds.
     */
    function attemptBypassWithPolling() {
        if (!isBypassEnabled) return;

        const intervalId = setInterval(() => {
            if (findAndClickWarningButton()) {
                clearInterval(intervalId); // Stop polling on success
            }
        }, 500); // Check every half-second

        setTimeout(() => {
            clearInterval(intervalId); // Stop polling after 15 seconds
        }, 15000);
    }

    function updateButtonAppearance() {
        const button = document.getElementById(TOGGLE_BUTTON_ID);
        if (!button) return;
        const textElement = button.querySelector('.ytcwb-text');
        if (textElement) {
            textElement.style.color = isBypassEnabled ? '#2ecc71' : '#e74c3c';
        }
    }

    async function toggleBypassState() {
        isBypassEnabled = !isBypassEnabled;
        await GM_setValue(SKIPPER_STATE_KEY, isBypassEnabled);
        updateButtonAppearance();

        // --- NEW: Trigger the bypass action immediately when toggled on ---
        if (isBypassEnabled) {
            attemptBypassWithPolling();
        }
    }

    function injectHeaderButton() {
        if (document.getElementById(TOGGLE_BUTTON_ID)) return;
        const buttonsContainer = document.querySelector('ytd-masthead #end #buttons');
        if (!buttonsContainer) return;

        const buttonWrapper = document.createElement('div');
        buttonWrapper.id = TOGGLE_BUTTON_ID;
        buttonWrapper.style.marginRight = '15px';

        const buttonEl = document.createElement('button');
        Object.assign(buttonEl.style, {
            width: '36px', height: '36px', borderRadius: '50%', border: 'none', padding: '0',
            backgroundColor: '#212121', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer'
        });
        buttonEl.onmouseover = () => buttonEl.style.backgroundColor = '#3d3d3d';
        buttonEl.onmouseout = () => buttonEl.style.backgroundColor = '#212121';

        const textElement = document.createElement('div');
        textElement.textContent = 'YTCW';
        textElement.className = 'ytcwb-text';
        Object.assign(textElement.style, {
            fontFamily: 'Roboto, Arial, sans-serif', fontSize: '11px', fontWeight: 'bold',
            lineHeight: 'normal', pointerEvents: 'none'
        });

        buttonEl.appendChild(textElement);
        buttonWrapper.appendChild(buttonEl);
        buttonEl.setAttribute('aria-label', 'Toggle YTCWBypass');
        buttonEl.addEventListener('click', toggleBypassState);
        buttonsContainer.insertBefore(buttonWrapper, buttonsContainer.firstChild);
        updateButtonAppearance();
    }

    async function initialize() {
        isBypassEnabled = await GM_getValue(SKIPPER_STATE_KEY, true);

        // --- NEW: Start the initial bypass attempt on page load ---
        attemptBypassWithPolling();

        // The observer is now ONLY for injecting the button when the header changes
        const uiObserver = new MutationObserver(() => injectHeaderButton());
        uiObserver.observe(document.body, { childList: true, subtree: true });
    }

    initialize();

})();