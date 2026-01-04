// ==UserScript==
// @name         Discord User Auth Scope Purger
// @namespace    http://github.com/Bluscream
// @version      1.0
// @description Remove guilds.join scope from Discord user authorization URLs
// @author       Bluscream, phind.com
// @match        *://discord.com/oauth2/authorize?*scope=*
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/491065/Discord%20User%20Auth%20Scope%20Purger.user.js
// @updateURL https://update.greasyfork.org/scripts/491065/Discord%20User%20Auth%20Scope%20Purger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the scope contains 'guilds.join'
    function hasGuildsJoinScope(scope) {
        const scopes = scope.split(/[ +%20]/); // Split by space, plus, or encoded space
        return scopes.includes('guilds.join');
    }

    // Function to remove 'guilds.join' from the scope
    function removeGuildsJoinScope(scope) {
        const scopes = scope.split(/[ +%20]/);
        const filteredScopes = scopes.filter(s => s !== 'guilds.join');
        return filteredScopes.join(' '); // Rejoin with space as separator
    }

    // Function to show confirmation dialog
    function showConfirmationDialog() {
        return new Promise((resolve) => {
            const autoPurge = GM_getValue('Automatically remove "guilds.join" from user auth scope', false);
            if (autoPurge) {
                resolve(true);
            } else {
                const confirmation = window.confirm('The scope includes "guilds.join". Do you want to remove it?');
                resolve(confirmation);
            }
        });
    }

    // Intercept the URL and show confirmation dialog
    const url = new URL(window.location.href);
    const scope = url.searchParams.get('scope');
    if (hasGuildsJoinScope(scope)) {
        showConfirmationDialog().then((confirmed) => {
            if (confirmed) {
                const newScope = removeGuildsJoinScope(scope);
                url.searchParams.set('scope', newScope);
                window.location.href = url.toString();
            }
        });
    }
})();
