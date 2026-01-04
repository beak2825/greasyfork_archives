// ==UserScript==
// @name         Crunchyroll - Overlay Remover
// @namespace    Cr-OR
// @version      1.3
// @description  Removes most overlays
// @author       Lone Strider
// @match        *://*.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546055/Crunchyroll%20-%20Overlay%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/546055/Crunchyroll%20-%20Overlay%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* Remove player hover shadow overlay */
        #velocity-controls-package > div:nth-child(1) {
            background: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            opacity: 0 !important;
        }

        /* Remove grey overlay behind menus/dropdowns */
        .app-layout__overlay--HKKQN {
            background: transparent !important;
            opacity: 0 !important;
            pointer-events: none !important; /* optional: prevents blocking clicks */
        }
    `;
    document.head.appendChild(style);

    // Keep styles active during SPA navigation
    const observer = new MutationObserver(() => {
        if (!document.head.contains(style)) document.head.appendChild(style);
    });
    observer.observe(document.head, { childList: true });
})();
