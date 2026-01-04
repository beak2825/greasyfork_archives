// ==UserScript==
// @name         Nuke amp_cookie_test* cookies on old.reddit.com
// @namespace    https://jackharrhy.dev
// @version      0.1
// @description  TATICAL NUKE INCOMING
// @author       /u/CakeComa
// @match        old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419456/Nuke%20amp_cookie_test%2A%20cookies%20on%20oldredditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/419456/Nuke%20amp_cookie_test%2A%20cookies%20on%20oldredditcom.meta.js
// ==/UserScript==

function nuke() {
    // iterate over every cookie
    document.cookie.split(';').forEach((cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        // if its the stupid amp_cookie_test cookie
        if (name.startsWith('amp_cookie_test')) {
            // NUKE IT!
            console.log(`%c ☢ Nuking ${name} ☢ `, 'background: red; color: white');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    });
}

(function() {
    'use strict';

    nuke(); // invoke nuke right now, on page load
    setInterval(nuke, 30 * 1000); // invoke nuke every 30s
})();