// ==UserScript==
// @name         Hide YouTube Sign Out Button
// @namespace    https://youtube.com/
// @version      1
// @description  Hides the annoying Sign Out Button from YouTube
// @author       Blumsie
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535007/Hide%20YouTube%20Sign%20Out%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535007/Hide%20YouTube%20Sign%20Out%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideLogout = () => {
        const logoutItems = Array.from(document.querySelectorAll('ytd-compact-link-renderer, ytd-menu-service-item-renderer'))
            .filter(el => {
                const data = el.__data || el.data || {};
                if (data.serviceEndpoint && data.serviceEndpoint.logoutEndpoint) return true;
                const urlMatch = el.innerHTML.includes('/logout') || el.innerHTML.includes('LogoutEndpoint');
                return urlMatch;
            });

        logoutItems.forEach(el => {
            el.style.display = 'none';
        });
    };

    const observer = new MutationObserver(hideLogout);
    observer.observe(document.body, { childList: true, subtree: true });

    hideLogout();
})();
