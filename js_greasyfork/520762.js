// ==UserScript==
// @name         Shorts Redirectinator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects shorts to where videos should be played
// @author       The Man Studios
// @match        https://www.youtube.com/*
// @grant        none
// @license      Zero-Clause BSD
// @downloadURL https://update.greasyfork.org/scripts/520762/Shorts%20Redirectinator.user.js
// @updateURL https://update.greasyfork.org/scripts/520762/Shorts%20Redirectinator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectIfNeeded = () => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/shorts/')) {
            const newUrl = currentUrl.replace('/shorts/', '/watch?v=');
            window.location.replace(newUrl);
        }
    };
    redirectIfNeeded();
    const observer = new MutationObserver(() => {
        redirectIfNeeded();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
