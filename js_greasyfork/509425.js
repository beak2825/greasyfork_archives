// ==UserScript==
// @name         Search for me button
// @namespace    http://tampermonkey.net/
// @version      2024-09-21
// @description  Adds a 'Search for me' button to Mastodon instances for quick self-mention searches
// @author       Sevi Che
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509425/Search%20for%20me%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/509425/Search%20for%20me%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the list of Mastodon instances
    function getMastodonInstances() {
        return GM_getValue('mastodonInstances', ['mastodon.social']);
    }

    // Function to save the list of Mastodon instances
    function saveMastodonInstances(instances) {
        GM_setValue('mastodonInstances', instances);
    }

    // Function to prompt user for Mastodon instances
    function promptForInstances() {
        const currentInstances = getMastodonInstances().join(', ');
        const input = prompt('Enter Mastodon instance URLs (comma-separated):', currentInstances);
        if (input !== null) {
            const instances = input.split(',').map(url => url.trim()).filter(url => url);
            saveMastodonInstances(instances);
            alert('Mastodon instances updated. Please refresh the page for changes to take effect.');
        }
    }

    // Register menu command to customize instances
    GM_registerMenuCommand('Customize Mastodon Instances', promptForInstances);

    function setReactInputValue(input, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function handleSearchForMe() {
        const searchInput = document.querySelector('input.search__input[type="text"]');
        if (searchInput) {
            const currentValue = searchInput.value.trim();
            const newValue = currentValue ? `from:me ${currentValue} ` : 'from:me ';
            setReactInputValue(searchInput, newValue);
            searchInput.focus();
        }
    }

    function addSearchForMeButton() {
        const searchInput = document.querySelector('input.search__input[type="text"]');
        if (searchInput && !document.querySelector('#search-for-me-button')) {
            const button = document.createElement('button');
            button.id = 'search-for-me-button';
            button.textContent = 'Me';
            button.style.cssText = `
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--color-accent-bg, #f7e7ed);
                color: var(--color-accent, #d3487f);
                border: 1px solid var(--color-accent, #d3487f);
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 12px;
                cursor: pointer;
                z-index: 1;
                transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            `;
            button.addEventListener('click', handleSearchForMe);
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = 'var(--color-accent, #d3487f)';
                button.style.color = 'var(--color-accent-fg, #ffffff)';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = 'var(--color-accent-bg, #f7e7ed)';
                button.style.color = 'var(--color-accent, #d3487f)';
            });
            searchInput.style.paddingLeft = '40px';  // Make room for the button
            searchInput.parentNode.style.position = 'relative';
            searchInput.parentNode.insertBefore(button, searchInput);
        }
    }

    function init() {
        const instances = getMastodonInstances();
        const currentHost = window.location.hostname;

        if (instances.includes(currentHost)) {
            addSearchForMeButton();
            const observer = new MutationObserver((mutations) => {
                if (!document.querySelector('#search-for-me-button')) {
                    addSearchForMeButton();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();