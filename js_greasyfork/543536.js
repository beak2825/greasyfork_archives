// ==UserScript==
// @name         you should call me kawaii lay it like a hentai-e :3 <3
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  https://github.com/codedfusi/stake-script/tree/main
// @author       fusi
// @match        *://*.stake.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543536/you%20should%20call%20me%20kawaii%20lay%20it%20like%20a%20hentai-e%20%3A3%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/543536/you%20should%20call%20me%20kawaii%20lay%20it%20like%20a%20hentai-e%20%3A3%20%3C3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const u = `<svg fill="none" viewBox="0 0 96 96" class="svg-icon"><title></title><path fill="#6CDE07" d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48"></path><path fill="#1B3802" d="M51.517 73.319v6.56h-5.8v-6.48c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48v-14.04c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84zm-5.8-30.96v-11.32c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36m12.88 16.92c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4"></path></svg>`;

    function a(s) {
        const h = s.outerHTML;

        if (/ARS/i.test(h)) {
            return true;
        }

        if (h.includes('m27.8 62.4-1.24-5.08H16.52l-1.24 5.08H7.16l9.64-32.6h9.52l9.64 32.6')) {
            return true;
        }

        if (h.includes('M53.36 62.4l-4.32-11.24h-2.92V62.4H38.2V29.8h13.28c6.36 0 10.4 4.6 10.4 10.6')) {
            return true;
        }

        if (h.includes('#FFC800') && h.includes('#276304')) {
            return true;
        }

        const p = s.querySelectorAll('path');
        for (const x of p) {
            const d = x.getAttribute('d') || '';
            if (d.includes('27.8 62.4') || d.includes('53.36 62.4')) {
                return true;
            }
        }

        return false;
    }

    function b() {
        document.querySelectorAll('*:not(script):not(style)').forEach(el => {
            el.childNodes.forEach(n => {
                if (n.nodeType === 3 && n.nodeValue.includes('ARS')) {
                    n.nodeValue = n.nodeValue.replace(/ARS/g, '$');
                }
            });
        });

        document.querySelectorAll('img').forEach(i => {
            if (!i.dataset.larped && /ARS/i.test(i.alt + i.title + i.src)) {
                i.dataset.larped = '1';
                const w = document.createElement('div');
                w.innerHTML = u;
                i.replaceWith(w.firstChild);
            }
        });

        document.querySelectorAll('svg').forEach(s => {
            if (!s.dataset.larped && a(s)) {
                s.dataset.larped = '1';
                const w = document.createElement('div');
                w.innerHTML = u;
                const ns = w.firstChild;
                ns.dataset.larped = '1';

                try {
                    if (s.getAttribute('class')) {
                        ns.setAttribute('class', s.getAttribute('class'));
                    }
                    if (s.style.cssText) {
                        ns.style.cssText = s.style.cssText;
                    }
                } catch (e) {
                }

                s.replaceWith(ns);
            }
        });
    }

    function c() {
        try {
            b();
        } catch (e) {
            console.error('LARP fail:', e);
        }
        requestAnimationFrame(c);
    }

    requestAnimationFrame(c);
})();