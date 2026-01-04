// ==UserScript==
// @name         Aternos Adblocker
// @license MIT
// @namespace    https://github.com/tapetenputzer/aternos-adblock-skipper
// @version      1.1
// @author       tapetenputzer
// @description  Skips the 3-second cooldown triggered by adblock detection so you can access Aternos instantly.
// @match        https://aternos.org/*
// @match        https://*.aternos.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536956/Aternos%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/536956/Aternos%20Adblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    if (src.startsWith('data:text/javascript;base64') || node.innerHTML.includes('base64')) {
                        node.remove();
                    }
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    function skipAdblock() {
        const bodyDiv = document.querySelector('div.body#read-our-tos');
        if (bodyDiv) {
            bodyDiv.style.removeProperty('display');
            bodyDiv.style.removeProperty('height');
        }
        const header = document.querySelector('header.header');
        if (header) {
            header.style.removeProperty('display');
            header.style.removeProperty('height');
        }
        const startBtn = document.getElementById('start');
        if (startBtn) {
            startBtn._ready = true;
        }
        document.querySelectorAll('div').forEach(div => {
            const s = div.getAttribute('style') || '';
            if (s.includes('background: #F62451')) {
                div.style.display = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', skipAdblock);
    } else {
        skipAdblock();
    }
})();
