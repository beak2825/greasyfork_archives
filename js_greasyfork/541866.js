// ==UserScript==
// @name         Open All Thread Pages
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.0.2
// @description  Adds a convenient "Open All" button to forum threads, allowing you to load every page into a new tab with a single click.
// @author       TheSina
// @match        *://*.*/threads/*
// @grant        GM.openInTab
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541866/Open%20All%20Thread%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/541866/Open%20All%20Thread%20Pages.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(function () {
    'use strict';

    const CONFIRM_KEY = 'openAllSuppressConfirm';
    const MAX_TABS = 50;

    GM.addStyle(`
    #openAllBtn {
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    }
    #openAllBtn:hover { background: #1565c0; }
    `);

    GM.registerMenuCommand('Toggle Confirm Open-All', async () => {
        const on = await GM.getValue(CONFIRM_KEY, true);
        await GM.setValue(CONFIRM_KEY, !on);
        alert(`Confirmation is now ${!on ? 'ON' : 'OFF'}`);
    });

    function getPageInfo() {
        const links = Array.from(
            document.querySelectorAll('.pageNav-page a[href*="/page-"]'),
        );
        let total = 1;
        if (links.length) {
            total = links
                .map(a =>
                    parseInt((a.href.match(/page-(\d+)/) || [])[1] || '1', 10),
                )
                .reduce((max, v) => Math.max(max, v), 1);
        }
        const currEl =
            document.querySelector('.pageNav-page--current a') ||
            document.querySelector('.pageNavSimple-el--current');
        const current = currEl
            ? parseInt(currEl.textContent.trim(), 10) || 1
            : 1;
        return {current, total};
    }

    function generateUrls(total) {
        const base = new URL(location);
        base.hash = '';
        base.pathname = base.pathname.replace(/\/page-\d+/, '');
        return Array.from({length: total}, (_, i) => {
            const u = new URL(base);
            if (i > 0)
                u.pathname = `${base.pathname.replace(/\/$/, '')}/page-${i + 1}`;
            return u.href;
        });
    }

    async function openAllPages() {
        const {total} = getPageInfo();
        if (total <= 1) return alert('Only one page detected.');
        if (total > MAX_TABS && !confirm(`Open ${total} tabs?`)) return;
        if (
            (await GM.getValue(CONFIRM_KEY, true)) &&
            !confirm(`Open all ${total} pages?`)
        )
            return;

        // Fire them all off in parallel:
        generateUrls(total)
            .reverse()
            .forEach((url, i) => GM.openInTab(url, {active: i === 0}));
    }

    function addButton() {
        const nav = document.querySelector('.pageNavWrapper');
        if (!nav || nav.querySelector('#openAllBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'openAllBtn';
        btn.textContent = '📄 Open All';
        btn.onclick = openAllPages;
        nav.appendChild(btn);
    }

    document.addEventListener('DOMContentLoaded', addButton);
    new MutationObserver(addButton).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
