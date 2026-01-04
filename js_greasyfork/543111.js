// ==UserScript==
// @name         Qobuz Mobile Overlay Bypass
// @namespace    https://tesla.com
// @version      1.0.0
// @description  Bypass Qobuz's mobile width warning by spoofing width and removing overlay
// @author       AI :)
// @license      MIT
// @locale       en
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fqobuz.com
// @match        https://*.qobuz.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543111/Qobuz%20Mobile%20Overlay%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/543111/Qobuz%20Mobile%20Overlay%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const spoofWidth = 1280;

    const spoofProperty = (obj, prop) => {
        Object.defineProperty(obj, prop, {
            get: () => spoofWidth,
            configurable: true
        });
    };

    spoofProperty(window, 'innerWidth');
    spoofProperty(screen, 'width');
    spoofProperty(document.documentElement, 'clientWidth');

    const removeOverlay = () => {
        const overlay = document.querySelector('.mobileOverlay');
        if (overlay) overlay.remove();

        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        document.body.classList.remove('no-scroll', 'no-interaction', 'mobile-only');
    };

    window.addEventListener('DOMContentLoaded', removeOverlay);
    window.addEventListener('load', removeOverlay);
    setTimeout(removeOverlay, 1000);
})();
