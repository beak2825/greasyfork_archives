// ==UserScript==
// @name         🦖 SREX – Shopee Review Extractor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically parse Shopee reviews into JSON across pages with UI & dark mode
// @author       Ryu-Sena
// @match        https://shopee.co.id/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540935/%F0%9F%A6%96%20SREX%20%E2%80%93%20Shopee%20Review%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/540935/%F0%9F%A6%96%20SREX%20%E2%80%93%20Shopee%20Review%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'shopee_reviews_json';
    let reviews = [];
    try { reviews = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []; } catch (e) { reviews = []; }

    let autoMode = false;
    let stopFlag = false;

    GM_addStyle(`
        #review-parser-ui { position: fixed; top: 10%; right: 10px; width: 350px; max-height: 80%; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-family: sans-serif; display: none; flex-direction: column; z-index: 9999; }
        #review-parser-ui.dark { --bg: #1e1e1e; --fg: #ddd; --border: #333; }
        #review-parser-ui.light { --bg: #fff; --fg: #333; --border: #ccc; }
        #review-parser-ui header { padding: 8px; font-size: 1.1em; font-weight: bold; display: flex; justify-content: space-between; align-items: center; background: var(--border); }
        #review-parser-ui header button { background: transparent; border: none; color: var(--fg); cursor: pointer; font-size: 1em; }
        #review-parser-ui .controls { padding: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
        #review-parser-ui .controls button { flex: 1 0 48%; padding: 6px; border: none; border-radius: 4px; cursor: pointer; background: var(--fg); color: var(--bg); font-weight: bold; }
        #review-parser-ui .status { padding: 4px 8px; font-size: 0.9em; text-align: center; }
        #review-parser-ui textarea { flex: 1; margin: 0 8px 8px; width: calc(100% - 16px); resize: vertical; font-family: monospace; font-size: 0.9em; background: var(--bg); color: var(--fg); border: 1px solid var(--border); }
        #review-parser-toggle { position: fixed; top: 50%; right: 10px; transform: translateY(-50%); background: #007bff; color: #fff; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.2em; z-index: 9999; }
    `);

    const ui = document.createElement('div');
    ui.id = 'review-parser-ui';
    ui.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.appendChild(ui);
    ui.innerHTML = `
        <header>
            <span>Review Parser</span>
            <button id="ui-close">✖️</button>
        </header>
        <div class="controls">
            <button id="btn-parse">Parse</button>
            <button id="btn-clear">Clear</button>
            <button id="btn-copy">Copy</button>
            <button id="btn-start">Auto Start</button>
            <button id="btn-stop">Stop</button>
        </div>
        <div class="status" id="parser-status">Idle</div>
        <textarea id="json-output" rows="10" readonly placeholder="No data"></textarea>
    `;

    function toggleUI(show) { ui.style.display = show ? 'flex' : 'none'; }
    document.getElementById('ui-close').addEventListener('click', () => toggleUI(false));

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'review-parser-toggle';
    toggleBtn.textContent = '➤';
    document.body.appendChild(toggleBtn);
    toggleBtn.addEventListener('click', () => toggleUI(true));

    function updateOutput() {
        const ta = document.getElementById('json-output');
        ta.value = reviews.length ? JSON.stringify(reviews, null, 2) : '';
        ta.placeholder = reviews.length ? '' : 'No data';
    }

    function updateStatus(text) {
        document.getElementById('parser-status').textContent = text;
    }

    function parseReviews() {
        document.querySelectorAll('div.A7MThp').forEach(item => {
            if (item.dataset.parsed) return;
            const username = item.querySelector('a.InK5kS')?.textContent.trim() || '';
            const date = item.querySelector('div.XYk98l')?.textContent.trim() || '';
            const rating = item.querySelectorAll('svg.icon-rating-solid').length;
            const content = item.querySelector('div.YNedDV')?.textContent.trim() || '';
            reviews.push({ username, date, rating, content });
            item.dataset.parsed = 'true';
        });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        updateOutput();
    }

    function clickPageButton(pageNum) {
        const buttons = Array.from(document.querySelectorAll('nav.shopee-page-controller button'));
        const pageButton = buttons.find(btn => btn.textContent.trim() === pageNum.toString());
        if (pageButton) pageButton.click();
    }

    async function autoParsePages(maxPages = 5) {
        stopFlag = false;
        updateStatus('Waiting 15s...');
        await new Promise(res => setTimeout(res, 15000));
        for (let i = 1; i <= maxPages && !stopFlag; i++) {
            updateStatus(`Parsing page ${i}...`);
            if (i !== 1) clickPageButton(i);
            await new Promise(res => setTimeout(res, 4000));
            parseReviews();
            await new Promise(res => setTimeout(res, 2000));
        }
        updateStatus(stopFlag ? 'Stopped by user' : 'Finished auto parsing');
    }

    updateOutput();

    document.getElementById('btn-parse').addEventListener('click', parseReviews);
    document.getElementById('btn-clear').addEventListener('click', () => {
        reviews = [];
        sessionStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('div.A7MThp').forEach(item => delete item.dataset.parsed);
        updateOutput();
        updateStatus('Cleared');
    });
    document.getElementById('btn-copy').addEventListener('click', () => {
        GM_setClipboard(document.getElementById('json-output').value);
        alert('JSON copied');
    });
    document.getElementById('btn-start').addEventListener('click', () => autoParsePages());
    document.getElementById('btn-stop').addEventListener('click', () => { stopFlag = true; updateStatus('Stopping...'); });

    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === '1') toggleUI(ui.style.display === 'none');
    });
})();
