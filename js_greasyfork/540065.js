// ==UserScript==
// @name         Google SignIn Popup Blocker
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-06-08
// @description  Blocks DOM based Google One Tap signin popup on all sites
// @author       mo
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540065/Google%20SignIn%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540065/Google%20SignIn%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCKED_SCRIPT_URLS = [
        'accounts.google.com/gsi/client',
        'accounts.google.com/gsi/intermediate',
        'accounts.google.com/gsi/intermediatesupport'
    ];

    // 1. Block Google One Tap scripts from loading (Firefox)
    document.addEventListener('beforescriptexecute', e => {
        if (BLOCKED_SCRIPT_URLS.some(url => e.target.src.includes(url))) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // 2. Target multiple container elements
    function disableContainers() {
        const containers = [
            'g_id_onload', // Standard container
            'g_id_intermediate_iframe', // Iframe container
            'credential_picker_container' // Dynamic container[6]
        ];

        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.setAttribute('data-auto_prompt', 'false');
                el.remove(); // Remove container entirely
            }
        });
    }

    // 3. Periodically check for new containers
    const observer = new MutationObserver(disableContainers);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 4. If all else fails, hide Google iframes
    // const style = document.createElement('style');
    // style.textContent = `
    //     iframe[src*="accounts.google.com/gsi/iframe"] {
    //         display: none !important;
    //         visibility: hidden !important;
    //     }
    // `;
    // document.documentElement.appendChild(style);

    // Initial cleanup
    disableContainers();
    setInterval(disableContainers, 1000);
})();