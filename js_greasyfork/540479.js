// ==UserScript==
// @name         IMEI & Email Duplicate Detector with Scroll & Nav
// @namespace    fiverr.com/web_coder_nsd
// @version      1.4
// @description  Detects duplicate IMEIs (by structure) and Emails, excluding same‑row duplicates. Lists, highlights all occurrences, and provides up/down navigation.
// @author       noushadBug
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540479/IMEI%20%20Email%20Duplicate%20Detector%20with%20Scroll%20%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/540479/IMEI%20%20Email%20Duplicate%20Detector%20with%20Scroll%20%20Nav.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- UI ---------- */
    const floatPanel = document.createElement('div');
    floatPanel.id = 'duplicates-float-panel';
    floatPanel.style.cssText = `
        position: fixed; top: 100px; right: 30px; width: 310px; max-height: 70vh;
        overflow-y: auto; z-index: 99999; background:#111; color:#fff; font-family:monospace;
        font-size:12px; padding:10px; border-radius:8px; box-shadow:0 0 15px rgba(0,0,0,.5);
        animation: popin .4s ease-out;
    `;
    floatPanel.innerHTML = `<h4 style="margin:0 0 8px;font-size:14px;">🔁 Duplicates</h4><div id="duplicate-contents">Scanning…</div>`;
    document.body.appendChild(floatPanel);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes popin {from{opacity:0;transform:translateX(50px)} to{opacity:1;transform:translateX(0)}}
        .dupe-label{margin-bottom:6px;padding:4px;background:#222;border-left:4px solid red;cursor:pointer;animation:fadein .3s ease-in-out;}
        .dupe-label:hover{background:#333}
        @keyframes fadein{from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)}}
        .imei-highlight{outline:2px solid red;background:#ffe9a5;transition:all .5s ease;}
        .nav-btn{flex:1;background:#444;color:#fff;border:none;cursor:pointer;font-size:12px;padding:2px 0;}
        .nav-btn:hover{background:#555}
    `;
    document.head.appendChild(style);

    /* ---------- Core ---------- */
    function scanForDuplicates() {
        const rows = [...document.querySelectorAll('table tbody tr')];
        const imeiMap = new Map();
        const emailMap = new Map();
        const imeiRe = /\b\d{14,15}\b/g;
        const emailRe = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/g;

        rows.forEach(row => {
            const txt = row.innerText;
            [...new Set(txt.match(imeiRe) || [])].forEach(i => {
                if (!imeiMap.has(i)) imeiMap.set(i, []);
                imeiMap.get(i).push(row);
            });
            [...new Set(txt.match(emailRe) || [])].forEach(e => {
                e = e.toLowerCase();
                if (!emailMap.has(e)) emailMap.set(e, []);
                emailMap.get(e).push(row);
            });
        });

        const container = document.getElementById('duplicate-contents');
        container.innerHTML = '';

        const clearHighlights = () => document.querySelectorAll('.imei-highlight').forEach(el => el.classList.remove('imei-highlight'));
        let activeNav = null;

        const makeLabel = (type, value, rows) => {
            const div = document.createElement('div');
            div.className = 'dupe-label';
            div.textContent = `${type}: ${value} (${rows.length})`;
            div.onclick = () => {
                clearHighlights();
                if (activeNav) activeNav.remove();

                const cells = [];
                rows.forEach(r => {
                    const c = [...r.querySelectorAll('td')].find(td => td.innerText.includes(value));
                    if (c) {
                        c.classList.add('imei-highlight');
                        cells.push(c);
                    }
                });

                /* nav */
                const nav = document.createElement('div');
                nav.style.cssText = 'display:flex;gap:4px;margin:4px 0;';
                const up = document.createElement('button'); up.textContent = '▲'; up.className = 'nav-btn';
                const dn = document.createElement('button'); dn.textContent = '▼'; dn.className = 'nav-btn';
                nav.appendChild(up); nav.appendChild(dn);
                div.after(nav);
                activeNav = nav;

                let idx = 0;
                const jump = () => cells[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                up.onclick = () => { idx = (idx - 1 + cells.length) % cells.length; jump(); };
                dn.onclick = () => { idx = (idx + 1) % cells.length; jump(); };
                jump();
            };
            container.appendChild(div);
        };

        [...imeiMap].forEach(([k, v]) => [...new Set(v)].length > 1 && makeLabel('IMEI', k, v));
        [...emailMap].forEach(([k, v]) => [...new Set(v)].length > 1 && makeLabel('Email', k, v));

        if (!container.childElementCount) container.innerHTML = '<div style="opacity:.6;">No duplicates found.</div>';
    }

    const observer = new MutationObserver(scanForDuplicates);
    const ready = setInterval(() => {
        const tbody = document.querySelector('table tbody');
        if (tbody) {
            clearInterval(ready);
            observer.observe(tbody, { childList: true, subtree: true });
            scanForDuplicates();
        }
    }, 500);
})();