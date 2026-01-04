// ==UserScript==
// @name         Hide YouTube Avatars
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide comment author avatars (profile pictures) on YouTube without uBlock Origin
// @author       Ankit
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545509/Hide%20YouTube%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/545509/Hide%20YouTube%20Avatars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS to hide avatar images in comments
    GM_addStyle(`
        #author-thumbnail, #avatar {
            display: none !important;
        }
    `);

    // Observe for dynamically loaded comments
    const observer = new MutationObserver(() => {
        const avatars = document.querySelectorAll('#author-thumbnail, #avatar');
        avatars.forEach(el => el.style.display = 'none');
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();