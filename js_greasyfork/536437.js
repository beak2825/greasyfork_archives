// ==UserScript==
// @name         Poxel.io Dev Premium Unlock (Client-Side)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unlock premium items for dev/test accounts in Poxel.io for testing purposes
// @author       YourName
// @license      MIT
// @match        *://*.poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536437/Poxelio%20Dev%20Premium%20Unlock%20%28Client-Side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536437/Poxelio%20Dev%20Premium%20Unlock%20%28Client-Side%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const devUsernames = ['DevUser1', 'TestUser2']; // Replace with real dev usernames

    const tryUnlock = setInterval(() => {
        let user = window?.game?.player || window?.user || null;

        if (user && user.username) {
            console.log(`[DEV PREMIUM] Detected user: ${user.username}`);

            if (devUsernames.includes(user.username)) {
                console.log(`[DEV PREMIUM] Unlocking premium for ${user.username}`);

                user.isPremium = true;
                user.coins = 999999;
                user.gems = 999999;
                user.inventory = {
                    skins: 'all',
                    weapons: 'all',
                    hats: 'all',
                    ...user.inventory
                };

                alert(`[DEV PREMIUM] Premium unlocked for: ${user.username}`);
            } else {
                console.log('[DEV PREMIUM] Not a dev account, skipping unlock.');
            }

            clearInterval(tryUnlock);
        }
    }, 500);
})();