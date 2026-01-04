// ==UserScript==
// @name         Close Reels
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Closes tab when URL contains "/reel/" including dynamic changes
// @match        *://*facebook.com/*
// @run-at       document-start
// @author harvastum
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527107/Close%20Reels.user.js
// @updateURL https://update.greasyfork.org/scripts/527107/Close%20Reels.meta.js
// ==/UserScript==


    'use strict';

    let isClosing = false;
    const targetPath = '/reel/';

    function checkAndClose() {
        if (isClosing) return;

        if (window.location.href.toLowerCase().includes(targetPath)) {
            isClosing = true;
            console.log('Closing reel tab:', window.location.href);
            window.close();
            // Add slight delay for better reliability
            setTimeout(() => {
                window.close();
                // Fallback if close fails
                if (!window.closed) {
                    window.close()
                    window.location.href = 'about:blank';
                    window.close()
                }
            }, 100);
        }
    }

    // Monitor history API changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        checkAndClose();
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        checkAndClose();
    };

    // Monitor various navigation events
    window.addEventListener('popstate', checkAndClose);
    window.addEventListener('hashchange', checkAndClose);
    window.addEventListener('load', checkAndClose);
    window.addEventListener('spalocationchange', checkAndClose);

    // Monitor DOM changes as last resort
    const observer = new MutationObserver(checkAndClose);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Initial check
    checkAndClose();
