// ==UserScript==
// @name         LauncherLeaks Popup & Scroll Fix
// @namespace    https://launcherleaks.net/
// @version      1.1
// @description  Block popups and restore scrolling on LauncherLeaks.net
// @author       You
// @match        https://launcherleaks.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541872/LauncherLeaks%20Popup%20%20Scroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/541872/LauncherLeaks%20Popup%20%20Scroll%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Block window.open to stop popup windows
    window.open = function () {
        console.log('🛑 Blocked window.open');
        return null;
    };

    // Unlock scrolling by resetting overflow styles
    function unlockScroll() {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
    }

    // Remove common popup overlays
    function removeOverlays() {
        const selectors = [
            '.swal2-container',  // SweetAlert modal
            '.swal2-popup',
            '.modal-backdrop',
            '.popup', 
            '.overlay',
            '#popup',
            '.blocker'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        unlockScroll();
    }

    // Observe for new popups and fix scroll
    const observer = new MutationObserver(() => {
        removeOverlays();
    });

    window.addEventListener('load', () => {
        removeOverlays();
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
