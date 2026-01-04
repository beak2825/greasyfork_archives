// ==UserScript==
// @name         BloxdHUB Ray Remover
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Removes annoying popups, sponsored posts, and other distractions on BloxdHUB.
// @author       Fizuk
// @match        https://bloxdhub.com/*
// @grant        none
// @license      CC BY 4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520703/BloxdHUB%20Ray%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/520703/BloxdHUB%20Ray%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vaowix = {
        create: document.createElement.bind(document),
        find: document.querySelector.bind(document),
        findAll: document.querySelectorAll.bind(document)
    };

    const kiuxva = () => {
        const voahiw = document.createElement.bind(document);
        document.createElement = function(zxiopq) {
            const ymnbvc = voahiw(zxiopq);
            if (zxiopq.toLowerCase() === 'script') {
                const qwerty = ymnbvc.setAttribute.bind(ymnbvc);
                ymnbvc.setAttribute = function(poiuyt, lkjhgf) {
                    if (poiuyt === 'src' && typeof lkjhgf === 'string') {
                        const mnbvcx = ['ray-', 'detector', 'popup'];
                        if (mnbvcx.some(p => lkjhgf.includes(p))) return;
                    }
                    return qwerty(poiuyt, lkjhgf);
                };
            }
            return ymnbvc;
        };
    };

    const asdfgh = () => {
        const zxcvbn = ['scriptDetected', 'userScriptEnabled'];
        zxcvbn.forEach(qazwsx => {
            Object.defineProperty(window, qazwsx, {
                get: () => false,
                set: () => {},
                configurable: false
            });
        });
    };

    const edcrfv = () => {
        const tgbyhn = [
            '.ray-overlay',
            '#ray-notice',
            '.script-warning-overlay',
            '.post[style*="background:#1e2124"]',
            '[class*="warning"]',
            '[id*="notice"]'
        ];

        const ujmikl = (plmokn) => {
            plmokn.style.cssText = 'position:absolute;opacity:0;pointer-events:none;height:0;width:0;overflow:hidden;';
        };

        tgbyhn.forEach(ijbuhv => {
            vaowix.findAll(ijbuhv).forEach(ujmikl);
        });
    };

    const wertyu = () => {
        const vfrtgb = new MutationObserver(() => {
            setTimeout(edcrfv, 50);
        });

        vfrtgb.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    kiuxva();
    asdfgh();

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            edcrfv();
            wertyu();
        }, 100);
    });
})();