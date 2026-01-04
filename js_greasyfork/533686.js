// ==UserScript==
// @name         Gemini Export Button
// @namespace    https://x.com/TakashiSasaki/tampermonkey/gemini-export
// @version      0.9.3
// @description  Adds a 📃 button that opens the menu, clicks “Export to…”, then highlights and clicks the “Export to Docs” button when it appears.
// @author       Takashi Sasaki
// @homepage     https://x.com/TakashiSasaki
// @supportURL   https://x.com/TakashiSasaki
// @license      MIT
// @match        https://gemini.google.com/app/*
// @icon         https://x.com/TakashiSasaki/path/to/icon.png
// @compatible   tampermonkey
// @compatible   violentmonkey
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533686/Gemini%20Export%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533686/Gemini%20Export%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_CLASS = 'tm-cascade-highlight-click-button';

    /**
     * Dispatches a click event on the given element.
     * @param {Element} el
     */
    function simulateClick(el) {
        if (!el) return;
        el.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    /**
     * Waits for an element matching `selector` to appear in the DOM,
     * then calls `callback` with that element.
     * Polls every 100ms, gives up after `timeout` ms.
     * @param {string} selector
     * @param {function(Element):void} callback
     * @param {number} timeout
     */
    function waitForSelector(selector, callback, timeout = 5000) {
        const interval = 100;
        let elapsed = 0;
        const handle = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(handle);
                callback(el);
            } else if ((elapsed += interval) >= timeout) {
                clearInterval(handle);
                console.warn(`waitForSelector timed out: ${selector}`);
            }
        }, interval);
    }

    /**
     * Handles the cascade:
     * 1) Open the “︙” menu
     * 2) Click “Export to…”
     * 3) Highlight and click “Export to Docs”
     * @param {Element} menuBtn
     */
    function handleCascade(menuBtn) {
        // Step 1: open the menu
        simulateClick(menuBtn);

        // Step 2: wait for “Export to…” button and click it
        waitForSelector('button[data-test-id="export-button"]', exportBtn => {
            simulateClick(exportBtn);

            // Step 3: wait for “Export to Docs” button, highlight it, and click it
            const docsSelector = '[id^="cdk-dialog-"] actions-bottom-sheet > div > div.options.ng-star-inserted > div > button:nth-child(1)';
            waitForSelector(docsSelector, docsBtn => {
                // Highlight the button itself
                docsBtn.style.setProperty('background-color', 'yellow', 'important');
                docsBtn.style.setProperty('border', '2px solid red', 'important');
                docsBtn.style.setProperty('outline', '2px solid orange', 'important');
                // Highlight its content container
                const content = docsBtn.querySelector('.item-button-content');
                if (content) {
                    content.style.setProperty('background-color', 'yellow', 'important');
                    content.style.setProperty('border', '1px dashed orange', 'important');
                }
                // Step 4: click the highlighted button
                simulateClick(docsBtn);
            });
        });
    }

    /**
     * Creates the custom 📃 button next to the existing menu button.
     * @param {Element} menuButtonElement
     * @returns {HTMLButtonElement}
     */
    function createCustomButton(menuButtonElement) {
        const btn = document.createElement('button');
        btn.innerText = '📃';
        btn.className = BUTTON_CLASS;
        Object.assign(btn.style, {
            marginLeft: '8px',
            padding: '4px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#e8f0fe',
            color: '#202124',
            cursor: 'pointer',
            fontSize: '14px'
        });
        btn.title = 'Export cascade: menu → export → highlight & click Docs';

        btn.addEventListener('click', e => {
            e.stopPropagation();
            handleCascade(menuButtonElement);
        });

        return btn;
    }

    /**
     * Injects the custom button into each response header.
     */
    function addButtons() {
        document.querySelectorAll('div.menu-button-wrapper').forEach(wrapper => {
            if (wrapper.nextSibling?.classList?.contains(BUTTON_CLASS)) return;
            const menuBtn = wrapper.querySelector('button');
            if (menuBtn) {
                const customBtn = createCustomButton(menuBtn);
                wrapper.parentNode.insertBefore(customBtn, wrapper.nextSibling);
            }
        });
    }

    // Observe the page for dynamic content changes
    new MutationObserver(addButtons).observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial injection
    addButtons();
})();
