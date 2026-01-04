// ==UserScript==
// @name         CambridgeDict Routine WordSearch
// @namespace    http://tampermonkey.net/
// @version      2025-02-06
// @description  Better ergonomics for word search on Cambridge Dictionary (dictionary.cambridge.org). Inspired by (dict.cc).
// @author       Jared Tang
// @match        https://dictionary.cambridge.org/*/*
// @exclude      https://dictionary.cambridge.org/plus/quiz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520039/CambridgeDict%20Routine%20WordSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/520039/CambridgeDict%20Routine%20WordSearch.meta.js
// ==/UserScript==

/*
BACKGROUND INFO
The cambridge.dictionary.org website uses the AMP framework. (https://amp.dev/)
Our script exploits this fact.

FEATURES
[x] Highlight entire search text after pressing 'Enter'. (This allows me to begin typing the next word immediately without having to delete the previous word.)
[x] Begin typing from anywhere on the page to search words. (This means I do not need to click inside the search bar.)
[x] Reveal the search bar when I begin to type so I can see what I am typing.
*/

(function() {
    'use strict';
    const searchWord = document.querySelector('input[id="searchword"]');
    const stateHdrEl = document.querySelector('#stateHdr');
    const stateStore = JSON.parse(Array.from(stateHdrEl.children)[0].textContent);
    console.assert(searchWord !== null, 'searchWord is null');
    console.assert(stateHdrEl !== null, 'stateHdrEl is null');

    // Select entire search input after search
    searchWord.addEventListener('change', function selectSearchText(e) {
        searchWord.focus();
        searchWord.select();
    });

    // Reveal the search bar header
    searchWord.addEventListener('input', () => {
        console.debug('stateStore', stateStore);
        // Check AMP is available globally
        console.assert(AMP !== null, 'AMP is null');
        console.assert(AMP !== undefined, 'AMP is undefined');
        AMP.setState({ stateHdr: { searchDesk: true }});
    });

    window.addEventListener('keydown', () => {
        searchWord.focus();
    });
    // 1. The input element has 'autofocus' toggled.
    // 2. Searching for a word induces a page refresh.
    // Highlight search text immediately after search request
    // so we can start typing a new word immediately
    // without needing to delete the previous word.
    searchWord.focus();
    searchWord.select();
})();