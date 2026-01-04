// ==UserScript==
// @name         VNDB Card/Grid view buttons for producer page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add buttons «Go to Card view» and «Go to Grid view» on https://vndb.org/PID pages.
// @author       mleaqaavwv
// @match        https://vndb.org/p*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537692/VNDB%20CardGrid%20view%20buttons%20for%20producer%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/537692/VNDB%20CardGrid%20view%20buttons%20for%20producer%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const suffixAlphabet = [
        ...Array.from({length: 10}, (_, i) => String(i)),
        ...Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)),
        ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)),
        '_', '-'
    ];

    function encodeNumber(n) {
        if (n <= 9) {
            return String(n);
        }
        if (n <= 35) {
            return String.fromCharCode(97 + (n - 10));
        }
        if (n <= 48) {
            return String.fromCharCode(65 + (n - 36));
        }

        let offset = n - 49;
        const base = suffixAlphabet.length; // 64


        const block1 = 10 * base;
        if (offset < block1) {
            const prefix = String.fromCharCode(78 + Math.floor(offset / base)); // 'N' → 78
            return prefix + suffixAlphabet[offset % base];
        }

        offset -= block1;


        const block2 = base * base;
        if (offset < block2) {
            const d1 = Math.floor(offset / base);
            const d2 = offset % base;
            return 'X' + suffixAlphabet[d1] + suffixAlphabet[d2];
        }

        offset -= block2;


        const d1 = Math.floor(offset / (base * base));
        const d2 = Math.floor(offset / base) % base;
        const d3 = offset % base;
        return 'Y' + suffixAlphabet[d1] + suffixAlphabet[d2] + suffixAlphabet[d3];
    }


    const match = window.location.pathname.match(/^\/p(\d+)/);
    if (!match) return;
    const vnId = parseInt(match[1], 10);
    const enc = encodeNumber(vnId);


    const cardUrl = `https://vndb.org/v?f=12N18N6830${enc}N6830${enc}&s=221`;
    const gridUrl = `https://vndb.org/v?f=12N18N6830${enc}N6830${enc}&p=1&s=222`;


    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        zIndex: '9999'
    });


    function makeButton(label, href) {
        const btn = document.createElement('a');
        btn.textContent = label;
        btn.href = href;
        btn.style.cssText = `
            display: inline-block;
            padding: 6px 12px;
            background: #4CAF50;
            color: #fff;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            font-size: 0.9em;
            text-align: center;
        `;

        btn.addEventListener('mouseover', function() {
            btn.style.background = '#45A049';
        });
        btn.addEventListener('mouseout', function() {
            btn.style.background = '#4CAF50';
        });
        return btn;
    }

    container.appendChild(makeButton('Go to Card view', cardUrl));
    container.appendChild(makeButton('Go to Grid view', gridUrl));

    document.body.appendChild(container);
})();