// ==UserScript==
// @name         TeamBlind Storage Nuker
// @description  Wipe all storage on teamblind.com with a keyboard shortcut (Alt+Shift+X)
// @match        https://*.teamblind.com/*
// @version 0.0.1.20250420115626
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/533423/TeamBlind%20Storage%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/533423/TeamBlind%20Storage%20Nuker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function nukeStorage() {
        console.log("Nuking TeamBlind storage...");

        // 1. Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // 2. Clear cookies
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.teamblind.com";
        });

        // 3. Clear all IndexedDB databases
        if (indexedDB && indexedDB.databases) {
            indexedDB.databases().then(dbs => {
                dbs.forEach(db => {
                    indexedDB.deleteDatabase(db.name);
                });
            });
        }

        // 4. Clear Cache Storage
        if ('caches' in window) {
            caches.keys().then(names => {
                for (let name of names) caches.delete(name);
            });
        }

        console.log("TeamBlind storage cleared.");
    }

    // Set up keyboard shortcut: Alt + Shift + X
    window.addEventListener('keydown', function (e) {
        if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            nukeStorage();
        }
    });
})();
