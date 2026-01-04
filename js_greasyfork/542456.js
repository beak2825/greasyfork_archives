// ==UserScript==
// @name        Make scroll work at thebalancemoney.com
// @namespace   https://github.com/luigiMinardi
// @match       https://www.thebalancemoney.com/*
// @grant       none
// @version     1.1
// @author      luigiMinardi
// @license     MIT
// @description Make scroll work at thebalancemoney.com while using uBlock and other tools to block tracking, ads and popups
// @homepageURL https://greasyfork.org/en/scripts/542456-make-scroll-work-at-thebalancemoney-com
// @downloadURL https://update.greasyfork.org/scripts/542456/Make%20scroll%20work%20at%20thebalancemoneycom.user.js
// @updateURL https://update.greasyfork.org/scripts/542456/Make%20scroll%20work%20at%20thebalancemoneycom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Restore scrolling on body and html
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Optional: remove common overlay elements
    const selectors = [
        '[class*="overlay"]',
        '[class*="popup"]',
        '[class*="modal"]',
        '[id*="overlay"]',
        '[id*="popup"]',
        '[id*="modal"]'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.remove();
        });
    });

    // Remove inline scroll lock styles
    const unlockScroll = () => {
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';

        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.height = 'auto';
    };

    unlockScroll();

    // Also observe for DOM changes (e.g., if scroll lock is reapplied)
    const observer = new MutationObserver(unlockScroll);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();