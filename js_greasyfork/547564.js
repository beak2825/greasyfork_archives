// ==UserScript==
// @name         Contentful Entry ID Extractor (Class Inheritance)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Inherits native Contentful classes for 100% color/style match.
// @author       @lfernandezcall
// @match        https://app.contentful.com/spaces/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547564/Contentful%20Entry%20ID%20Extractor%20%28Class%20Inheritance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547564/Contentful%20Entry%20ID%20Extractor%20%28Class%20Inheritance%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'copy-entry-ids-btn';
    const targetUrlRegex = /^\/spaces\/[^/]+\/environments\/[^/]+\/views\/entries$/;

    const addButton = () => {
        if (document.getElementById(BUTTON_ID)) return;

        // Target the button group
        const buttonGroup = document.querySelector('[data-test-id="cf-ui-button-group"]');
        if (!buttonGroup) return;

        // Target 'Add entry' to insert before it
        const addEntryBtn = buttonGroup.querySelector('[data-test-id="create-entry-button-menu-trigger"]');
        if (!addEntryBtn) return;

        // Minimal style just for the wrapper gap and icon spacing
        GM_addStyle(`
            #${BUTTON_ID}-wrapper {
                display: flex;
                align-items: center;
            }
            #${BUTTON_ID} svg {
                margin-right: 0.5rem;
                flex-shrink: 0;
            }
        `);

        // Create wrapper using the native span structure
        const wrapper = document.createElement('span');
        wrapper.id = `${BUTTON_ID}-wrapper`;
        wrapper.className = 'css-79elbk';

        // Create the button using the NATIVE class
        const copyButton = document.createElement('button');
        copyButton.id = BUTTON_ID;
        copyButton.type = 'button';
        copyButton.className = 'css-1odbk7n'; // Native button class

        // Create the text span using the NATIVE class
        copyButton.innerHTML = `
            <span class="css-3u52eb">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
                </svg>
            </span>
            <span class="css-40g50j">Copy IDs</span>
        `;

        wrapper.appendChild(copyButton);

        // Insert 'Copy IDs' before 'Add entry'
        buttonGroup.insertBefore(wrapper, addEntryBtn);

        // Click Logic
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const links = document.querySelectorAll('tr[data-test-id="entry-row"] td[data-test-id="name"] a');
            if (links.length === 0) return;

            const ids = Array.from(links).map(link => {
                const href = link.getAttribute('href');
                return href ? href.split('/').pop() : '';
            }).filter(id => id !== '');

            GM_setClipboard(ids.join('\n'), 'text');

            // Feedback
            const textSpan = copyButton.querySelector('.css-40g50j');
            textSpan.textContent = 'Copied!';
            setTimeout(() => { textSpan.textContent = 'Copy IDs'; }, 1500);
        });
    };

    const removeButton = () => {
        const button = document.getElementById(`${BUTTON_ID}-wrapper`);
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