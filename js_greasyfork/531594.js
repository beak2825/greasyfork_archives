// ==UserScript==
// @license MIT
// @name         AutoFocusSearchBox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically focuses the search box on page load
// @author       aceitw
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531594/AutoFocusSearchBox.user.js
// @updateURL https://update.greasyfork.org/scripts/531594/AutoFocusSearchBox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility: Determine if the current hostname is in the user-defined list
    const hostname = window.location.hostname;
    const siteList = GM_getValue('siteList', []);

    // Try to focus the search box
    function focusSearchBox() {
        const inputTags = Array.from(document.querySelectorAll('input[type="search"], input[type="text"], input:not([type])'))
            .filter(el => el.offsetParent !== null && el.offsetHeight > 0 && el.offsetWidth > 0);

        // Try the first element that looks like a search bar
        const searchInput = inputTags.find(input =>
            input.placeholder?.toLowerCase().includes('search') ||
            input.name?.toLowerCase().includes('search') ||
            input.id?.toLowerCase().includes('search') ||
            input.ariaLabel?.toLowerCase().includes('search')
        );

        if (searchInput) {
            searchInput.focus();
        }
    }

    // Focus only if the site is allowed
    if (siteList.includes(hostname)) {
        window.addEventListener('load', () => {
            setTimeout(focusSearchBox, 200); // Delay to wait for page load
        });
    }

    // === SETTINGS UI ===
    GM_registerMenuCommand('🔧 Manage Focus Sites', () => {
        const currentList = GM_getValue('siteList', []);
        const input = prompt(
            `Enter a list of hostnames (one per line).\nExample:\nwww.google.com\ndocs.google.com`,
            currentList.join('\n')
        );
        if (input !== null) {
            const newList = input
                .split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 0);
            GM_setValue('siteList', newList);
            alert('✅ Site list updated!\n\nReload the page to apply changes.');
        }
    });
})();
