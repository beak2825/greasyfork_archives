// ==UserScript==
// @name         Prime Video - X-ray/Shadow Removal
// @namespace    PV - X/SR
// @version      1.1
// @description  Cleans up Prime Video player: removes X-Ray, black shadow overlays, and PiP button.
// @author       Lone Strider
// @match        *://*.primevideo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=primevideo.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546151/Prime%20Video%20-%20X-rayShadow%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/546151/Prime%20Video%20-%20X-rayShadow%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_ID = "pv-cleanup-style";

    const css = `
        /* Hide X-Ray quick view overlay */
        .atvwebplayersdk-player-container .hideUntilCssLoaded .xrayQuickView {
            display: none !important;
        }

        /* Remove black shadow/overlay backgrounds (current hashed classes) */
        .fkpovp9,
        .f1makowq,
        .f10i0hvc,
        .fvtlr3b {
            background: none !important;
        }

        /* Hide PiP button */
        #pip-button {
            display: none !important;
        }
    `;

    function injectStyle() {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // Inject initially
    injectStyle();

    // Re-inject if SPA nav or DOM rebuild removes styles
    new MutationObserver(injectStyle).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
