// ==UserScript==
// @name         Torn Item & Armory Notes 2
// @version      1.4
// @description  Add/edit personal notes and colour tags to items in Torn inventory, faction armory, and the trade screen with shared keys.
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/trade.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @author       aquagloop 
// @license      MIT
// @namespace    https://greasyfork.org/users/1476871
// @downloadURL https://update.greasyfork.org/scripts/537870/Torn%20Item%20%20Armory%20Notes%202.user.js
// @updateURL https://update.greasyfork.org/scripts/537870/Torn%20Item%20%20Armory%20Notes%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let deletionMode = false;

    function makeNoteButton() {
        const btn = document.createElement('button');
        btn.textContent = '📝';
        btn.title = 'Click to add/edit note & colour';
        btn.style.cssText = `
            background: none;
            border: none;
            padding: 0;
            margin-left: 4px;
            cursor: pointer;
            font-size: 90%;
            display: inline-block;
            vertical-align: middle;
        `;
        btn.classList.add('torn-note-btn');
        return btn;
    }

    function makecolourBox(colour) {
        const box = document.createElement('span');
        box.classList.add('torn-colour-box');
        box.style.cssText = `
            display: ${colour ? 'inline-block' : 'none'};
            width: 10px;
            height: 10px;
            margin-left: 4px;
            vertical-align: middle;
            background: ${colour || 'transparent'};
            border: 1px solid #000;
        `;
        return box;
    }

    function loadData(key) {
        const raw = GM_getValue(key, '');
        if (!raw) return { note: '', colour: '' };
        try {
            return JSON.parse(raw);
        } catch {
            return { note: raw, colour: '' };
        }
    }

    function saveData(key, data) {
        GM_setValue(key, JSON.stringify(data));
    }

    function deleteData(key, li, colourBox) {
        GM_deleteValue(key);
        li.title = '';
        colourBox.style.background = 'transparent';
        colourBox.style.display = 'none';
    }

    function handleNoteButtonClick(key, li, colourBox, label) {
        if (deletionMode) {
            if (confirm(`Delete note and colour for ${label}?`)) {
                deleteData(key, li, colourBox);
            }
            return;
        }

        const current = loadData(key);
        const note = prompt(`Note for ${label}:`, current.note);
        if (note === null) return;

        setTimeout(() => {
            const colour = prompt('Colour tag (CSS/hex):', current.colour);
            if (colour === null) return;

            const newData = { note: note.trim(), colour: colour.trim() };
            saveData(key, newData);
            li.title = newData.note || '';
            colourBox.style.background = newData.colour || 'transparent';
            colourBox.style.display = newData.colour ? 'inline-block' : 'none';
        }, 100);
    }

    function generateSharedKey(name, stats) {
        return `shared|${name}|${stats}`;
    }

    function processInventory() {
        document.querySelectorAll('li[data-item]').forEach(li => {
            if (li.querySelector('.torn-note-btn')) return;

            const nameEl = li.querySelector('.name');
            if (!nameEl) return;

            const name = nameEl.textContent.trim();
            const nums = li.innerText.match(/\d+\.\d+/g) || [];
            const stats = nums.slice(0, 2).join('_') || 'nostats';
            const key = generateSharedKey(name, stats);
            const data = loadData(key);

            const btn = makeNoteButton();
            const colourBox = makecolourBox(data.colour);

            nameEl.appendChild(btn);
            nameEl.appendChild(colourBox);
            if (data.note) li.title = data.note;

            btn.addEventListener('click', e => {
                e.stopPropagation();
                handleNoteButtonClick(key, li, colourBox, `"${name}" (Inventory)`);
            });
        });
    }

    function processArmory() {
        const cat = getArmoryCategory();
        document.querySelectorAll('ul.item-list > li, ul[class*="items-list"] > li[class*="item"]').forEach(li => {
            if (li.querySelector('.torn-note-btn')) return;

            const nameEl = li.querySelector('.name, .item-name__');
            if (!nameEl) return;

            const name = nameEl.textContent.trim();
            const nums = li.innerText.match(/\d+\.\d+/g) || [];
            const stats = nums.slice(0, 2).join('_') || 'nostats';
            const key = generateSharedKey(name, stats);
            const data = loadData(key);

            const btn = makeNoteButton();
            const colourBox = makecolourBox(data.colour);

            nameEl.appendChild(btn);
            nameEl.appendChild(colourBox);
            if (data.note) li.title = data.note;

            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                handleNoteButtonClick(key, li, colourBox, `"${name}" (Armory - ${cat})`);
            });
        });
    }

    function getArmoryCategory() {
        const hash = window.location.hash.substring(1);
        return new URLSearchParams(hash).get('sub') || 'armoury';
    }

    function processTradeAdd() {
        const tradeItems = document.querySelectorAll(
            'li.clearfix[data-group="child"], .item___jLJcf'
        );

        tradeItems.forEach(elem => {
            if (elem.querySelector('.torn-note-btn')) return;

            const nameEl = elem.querySelector('.t-overflow, .desc___VJSNQ span b');
            if (!nameEl) return;

            const name = nameEl.textContent.trim();
            const nums = elem.innerText.match(/\d+\.\d+/g) || [];
            const stats = nums.slice(0, 2).join('_') || 'nostats';
            const key = generateSharedKey(name, stats);
            const data = loadData(key);

            const btn = makeNoteButton();
            const colourBox = makecolourBox(data.colour);

            const container = nameEl.parentElement;
            container.appendChild(btn);
            container.appendChild(colourBox);

            if (data.note) elem.title = data.note;

            btn.addEventListener('click', e => {
                e.stopPropagation();
                handleNoteButtonClick(key, elem, colourBox, `"${name}" (Trade Add)`);
            });
        });
    }

    function initAll() {
        processInventory();
        processArmory();
        processTradeAdd();
    }

    GM_registerMenuCommand('🗑️ Clear All Notes & colours', async () => {
        if (!confirm('Are you sure you want to delete ALL notes and colour tags?')) return;
        const keys = await GM_listValues();
        keys.filter(k => k.startsWith('shared|'))
            .forEach(k => GM_deleteValue(k));
        alert('All shared notes and colour tags have been cleared. Reload page to see changes.');
    });

    GM_registerMenuCommand('🧨 Toggle Deletion Mode (OFF)', function toggleDeletionMode() {
        deletionMode = !deletionMode;
        alert(`Deletion Mode is now ${deletionMode ? 'ON' : 'OFF'}.`);
        this.caption = `🧨 Toggle Deletion Mode (${deletionMode ? 'ON' : 'OFF'})`;
    });

    initAll();
    new MutationObserver(initAll).observe(document.body, {
        childList: true,
        subtree: true
    });

})();