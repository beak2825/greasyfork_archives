// ==UserScript==
// @name         Reddit - Block Search History (Local Storage Method)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Prevents Reddit from saving search history by repeatedly clearing the 'recent-searches-store' key from Local Storage.
// @author       Andrino Cauduro - https://github.com/AndrinoC
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541460/Reddit%20-%20Block%20Search%20History%20%28Local%20Storage%20Method%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541460/Reddit%20-%20Block%20Search%20History%20%28Local%20Storage%20Method%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The name of the key Reddit uses in Local Storage to save search history.
    const STORAGE_KEY = 'recent-searches-store';

    // A function to remove the search history key.
    function deleteSearchHistory() {
        // Only attempt to remove if the key actually exists.
        if (localStorage.getItem(STORAGE_KEY)) {
            localStorage.removeItem(STORAGE_KEY);
            console.log('Reddit search history key found and deleted.');
        }
    }

    deleteSearchHistory();

    setInterval(deleteSearchHistory, 500); // Checks and deletes every 500ms.

})();