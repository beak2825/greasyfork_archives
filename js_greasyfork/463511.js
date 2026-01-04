// ==UserScript==
// @name        Eggladder
// @namespace   https://github.com/tobytorn
// @description Easter egg finder for Torn players w/o access to Google
// @author      tobytorn [1617955]
// @match       https://www.torn.com/*
// @version     1.0.0
// @run-at      document-start
// @supportURL  https://github.com/tobytorn/eggladder
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/463511/Eggladder.user.js
// @updateURL https://update.greasyfork.org/scripts/463511/Eggladder.meta.js
// ==/UserScript==

// Note: choose START on TornPDA

(function() {
    'use strict';

    // Avoid redundant injections in TornPDA
    if (window.PDA_EGGLADDER) {
        return;
    }
    window.PDA_EGGLADDER = true;

    // Ban scripts from accounts.google.com
    const header_ob = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName !== "SCRIPT") {
                    continue;
                }
                const src = node.getAttribute('src') || '';
                if (src.startsWith('https://accounts.google.com/')) {
                    node.setAttribute("src", "");
                }
            }
        }
    });
    header_ob.observe(document, {childList: true, subtree: true});

    const egg_ob = new MutationObserver(function(mutations) {
        if (document.getElementById("easter-egg-hunt-root")) {
            egg_ob.disconnect();
            alert('蛋来！Egg on page.');
        }
    });
    egg_ob.observe(document, {childList: true, subtree: true});
})();