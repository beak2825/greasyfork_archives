// ==UserScript==
// @name         Roblox Badge Deleter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Deletes all badges from your roblox profile
// @author       WLRW
// @match        https://www.roblox.com/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536375/Roblox%20Badge%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/536375/Roblox%20Badge%20Deleter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const UserId = window.location.pathname.split("/")[2];
    let XCSRF = '';

    async function GetCSRFToken() {
        const res = await fetch('https://auth.roblox.com/v2/logout', {
            method: 'POST',
            credentials: 'include'
        });
        XCSRF = res.headers.get('x-csrf-token') || '';
    }

    async function GetBadges() {
        const res = await fetch(`https://badges.roblox.com/v1/users/${UserId}/badges`, {
            credentials: 'include'
        });
        const json = await res.json();
        return json.data.map(b => b.id);
    }

    async function DeleteBadge(BadgeId) {
        const res = await fetch(`https://badges.roblox.com/v1/user/badges/${BadgeId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'x-csrf-token': XCSRF
            }
        });

        if (res.ok) {
            console.log(`EVIL - Deleted badge ${BadgeId}`);
        } else {
            console.warn(`EVIL - Failed to delete ${BadgeId}`, await res.text());
        }
    }

    await GetCSRFToken();
    const BadgeIds = await GetBadges();

    for (const id of BadgeIds) {
        await DeleteBadge(id);
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('EVIL - $$');
})();
