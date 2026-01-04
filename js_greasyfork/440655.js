// ==UserScript==
// @name         Roblox Friend Remover
// @namespace    https://spin.rip/
// @version      3000
// @description  Remove all of your friends on Roblox
// @author       Spinfal
// @match        https://www.roblox.com/users/*/profile*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @license      AGPL-3.0 License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440655/Roblox%20Friend%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/440655/Roblox%20Friend%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const params = new URLSearchParams(window.location.search);
    const rmf = params.get('rmf') === 'true';

    // first‑pass: ask & reload
    if (!rmf) {
        setTimeout(() => {
          const userID = Roblox?.CurrentUser?.userId || prompt('Your Roblox user ID (must be yours):');
          if (!userID) return alert('No Roblox user ID was available. Try reloading the page.');
          if (!confirm('Remove all friends?')) return;
          sessionStorage.setItem("csrfToken", Roblox?.XsrfToken?.getToken());
          params.set('rmf', 'true');
          params.set('userId', userID);
          window.location.search = params.toString();
          return;
        }, 3000);
    }

    // second‑pass: rmf=true -> we already reloaded, now fetch CSRF + headers and unfriend
    (async function() {
        'use strict';
        const userId = params.get('userId');
        if (!userId) return;

        // 1. GET to grab response headers & friend list
        let resp;
        try {
            resp = await fetch(
                `https://friends.roblox.com/v1/users/${userId}/friends?sortOrder=Desc`,
                { method: 'GET', credentials: 'include' }
            );
        } catch (e) {
            console.error('[Friend Remover] Error fetching friends:', e);
            return alert('Error fetching friends. See console.');
        }

        // collect all response headers
        const responseHeaders = {};
        resp.headers.forEach((v, k) => { responseHeaders[k] = v; });

        // parse friend list from GET response
        let list;
        try {
            list = await resp.json();
        } catch (e) {
            console.error('[Friend Remover] Error parsing friend list:', e);
            return alert('Error parsing friend list. See console.');
        }

        // 2. check fresh CSRF token
        const csrfToken = sessionStorage.getItem("csrfToken");
        if (!csrfToken) return alert('failed to get fresh csrf token. try refreshing the page.');

        // merge captured headers + fresh CSRF
        const headers = {
            ...responseHeaders,
            'x-csrf-token': csrfToken
        };

        // 3. loop and unfriend
        for (const u of list.data) {
            fetch(
                `https://friends.roblox.com/v1/users/${u.id}/unfriend`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: headers
                }
            ).then(r => {
                if (!r.ok) console.warn('[Friend Remover] Failed to unfriend', u.id, r.statusText);
            });
        }
        alert('Friend removal initiated. Check console for status.');
    })();
})();