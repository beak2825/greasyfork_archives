// ==UserScript==
// @name         Identify Unicode in Selection
// @namespace    https://github.com/AnnaRoblox
// @version      1.1.1
// @description  Highlight text → right-click → User Script Commands → Identify Unicode in Selection. Shows character, U+XXXX, decimal, and Unicode name in a page modal.
// @author       annablox
// @match        *://*/*
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      unicode.org
// @downloadURL https://update.greasyfork.org/scripts/535678/Identify%20Unicode%20in%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/535678/Identify%20Unicode%20in%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load or fetch the full UnicodeData.txt mapping codepoint → name
    async function loadUnicodeNames() {
        let stored = GM_getValue('unicodeMap');
        if (stored) {
            return JSON.parse(stored);
        }
        // Fetch the UnicodeData.txt file
        const data = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.unicode.org/Public/UNIDATA/UnicodeData.txt',
                onload: res => resolve(res.responseText),
                onerror: err => reject(err)
            });
        });
        const map = {};
        for (const line of data.split(/\r?\n/)) {
            if (!line) continue;
            const parts = line.split(';');
            const cp = parseInt(parts[0], 16);
            const name = parts[1];
            map[cp] = name;
        }
        // Cache for next time
        GM_setValue('unicodeMap', JSON.stringify(map));
        return map;
    }

    function createModal(htmlContent) {
        // Remove any existing modal
        const existing = document.getElementById('unicode-identify-modal');
        if (existing) existing.remove();

        // backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'unicode-identify-modal';
        Object.assign(backdrop.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: '9999', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        });

        // modal container
        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#fff', color: '#000', padding: '1em', borderRadius: '8px',
            maxWidth: '80%', maxHeight: '80%', overflowY: 'auto',
            fontFamily: 'monospace', whiteSpace: 'pre-wrap', position: 'relative'
        });

        // close button
        const close = document.createElement('button');
        close.textContent = '× Close';
        Object.assign(close.style, {
            position: 'absolute', top: '0.5em', right: '0.5em',
            background: 'transparent', border: 'none', fontSize: '1.5em',
            cursor: 'pointer', color: '#000'
        });
        close.onclick = () => backdrop.remove();

        box.innerHTML = htmlContent;
        box.appendChild(close);
        backdrop.appendChild(box);
        document.body.appendChild(backdrop);
    }

    GM_registerMenuCommand('Identify Unicode in Selection', async () => {
        const sel = window.getSelection().toString();
        if (!sel) {
            alert('No text selected. Please highlight some text first.');
            return;
        }

        const nameMap = await loadUnicodeNames();

        const lines = [];
        for (let i = 0; i < sel.length; ) {
            const codePoint = sel.codePointAt(i);
            const char = String.fromCodePoint(codePoint);
            const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
            const name = nameMap[codePoint] || '<no name>';
            lines.push(`${char}    U+${hex}    (${codePoint})    ${name}`);
            i += codePoint > 0xFFFF ? 2 : 1;
        }

        const header = 'Char    Code Point    Decimal    Name\n' +
                       '----    ----------    -------    ----\n';
        createModal(header + lines.join('\n'));
    });
})();
