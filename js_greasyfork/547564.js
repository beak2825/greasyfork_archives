// ==UserScript==
// @name         Contentful Entry ID Extractor
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a native-looking button to copy entry IDs on any Contentful space's entries list.
// @author       Your Name or Handle
// @match        https://app.contentful.com/spaces/*
// @homepageURL  https://github.com/YourUsername/contentful-id-extractor
// @supportURL   https://github.com/YourUsername/contentful-id-extractor/issues
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547564/Contentful%20Entry%20ID%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/547564/Contentful%20Entry%20ID%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'copy-entry-ids-btn';
    const targetUrlRegex = /^\/spaces\/[^/]+\/environments\/[^/]+\/views\/entries$/;

    // Function to add the button to the page
    const addButton = () => {
        if (document.getElementById(BUTTON_ID)) return;

        GM_addStyle(`
            #${BUTTON_ID} {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                align-items: center; justify-content: center; display: inline-flex;
                background-color: var(--color-blue-base, #0059c8);
                color: var(--color-white, #fff);
                font-family: var(--font-stack-primary, sans-serif);
                font-size: var(--font-size-m, 0.875rem);
                font-weight: var(--font-weight-demi-bold, 600);
                line-height: 1; padding: 12px 18px; border: 1px solid transparent;
                border-radius: 6px; cursor: pointer;
                transition: background-color 0.2s ease; white-space: nowrap;
            }
            #${BUTTON_ID}:hover { background-color: var(--color-blue-dark, #0041ab); }
            #${BUTTON_ID}:active { background-color: var(--blue600, #0059c8); }
            #${BUTTON_ID} > span {
                display: inline-block; max-width: 100%; overflow: hidden;
                text-overflow: ellipsis; vertical-align: middle;
            }
        `);

        const copyButton = document.createElement('button');
        copyButton.id = BUTTON_ID;
        copyButton.type = 'button';

        const buttonTextSpan = document.createElement('span');
        buttonTextSpan.textContent = '📋 Copy Entry IDs';
        copyButton.appendChild(buttonTextSpan);

        document.body.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const links = document.querySelectorAll('tr[data-test-id="entry-row"] td[data-test-id="name"] a');
            if (links.length === 0) {
                alert('No entry IDs found on the page.');
                return;
            }
            // **FIXED LINE**
            const ids = Array.from(links).map(link => link.getAttribute('href').split('/').pop());
            const idString = ids.join('\n');
            GM_setClipboard(idString, 'text');
            alert(`${ids.length} entry IDs copied to clipboard!`);
        });
    };

    const removeButton = () => {
        const button = document.getElementById(BUTTON_ID);
        if (button) button.remove();
    };

    const toggleButtonVisibility = () => {
        if (targetUrlRegex.test(window.location.pathname)) {
            addButton();
        } else {
            removeButton();
        }
    };

    const observer = new MutationObserver(toggleButtonVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    toggleButtonVisibility();

})();