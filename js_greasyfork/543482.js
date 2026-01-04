// ==UserScript==
// @name         Logic Masters Puzzle Watcher
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Watch favorite users and custom searches for new/unsolved puzzles on Logic Masters Deutschland
// @author       Oliver Burgert
// @match        https://logic-masters.de/*
// @license      GPL-3.0-or-later
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/543482/Logic%20Masters%20Puzzle%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/543482/Logic%20Masters%20Puzzle%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

    const STORAGE_KEYS = {
        FAVORITE_USERS: 'lm_favorite_users',
        FAVORITE_SEARCHES: 'lm_favorite_searches',
        LAST_CHECK: 'lm_last_check',
        PUZZLE_DATA: 'lm_puzzle_data'
    };

    // ---------- Storage helpers ----------
    function initStorage() {
        if (!GM_getValue(STORAGE_KEYS.FAVORITE_USERS)) GM_setValue(STORAGE_KEYS.FAVORITE_USERS, JSON.stringify([]));
        if (!GM_getValue(STORAGE_KEYS.FAVORITE_SEARCHES)) GM_setValue(STORAGE_KEYS.FAVORITE_SEARCHES, JSON.stringify([]));
        if (!GM_getValue(STORAGE_KEYS.PUZZLE_DATA)) GM_setValue(STORAGE_KEYS.PUZZLE_DATA, JSON.stringify({}));
    }

    function getFavoriteUsers() {
        return JSON.parse(GM_getValue(STORAGE_KEYS.FAVORITE_USERS, '[]'));
    }

    function saveFavoriteUsers(users) {
        GM_setValue(STORAGE_KEYS.FAVORITE_USERS, JSON.stringify(users));
    }

    function getFavoriteSearches() {
        return JSON.parse(GM_getValue(STORAGE_KEYS.FAVORITE_SEARCHES, '[]'));
    }

    function saveFavoriteSearches(searches) {
        GM_setValue(STORAGE_KEYS.FAVORITE_SEARCHES, JSON.stringify(searches));
    }

    function getPuzzleData() {
        return JSON.parse(GM_getValue(STORAGE_KEYS.PUZZLE_DATA, '{}'));
    }

    function savePuzzleData(data) {
        GM_setValue(STORAGE_KEYS.PUZZLE_DATA, JSON.stringify(data));
    }

    function getLastCheck() {
        return GM_getValue(STORAGE_KEYS.LAST_CHECK, 0);
    }

    function saveLastCheck(ts) {
        GM_setValue(STORAGE_KEYS.LAST_CHECK, ts);
    }

    function shouldCheck() {
        return Date.now() - getLastCheck() >= CHECK_INTERVAL;
    }

    // ---------- Data fetching ----------
    function parsePuzzleData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const errorElement = doc.querySelector('p.rp_error');
        if (errorElement) throw new Error('No results');

        const puzzleRows = doc.querySelectorAll('table.rp_raetselliste tr');
        // console.log(puzzleRows)
        const puzzles = [];
        for (let i = 1; i < puzzleRows.length; i++) {
            const cells = puzzleRows[i].querySelectorAll('td');
            // console.log(cells)
            if (cells.length >= 4) {
                // console.log(cells[1].innerText)
                let image_index = 0; // Start with the default index for users
                // Check the computed style of the first cell for right alignment to detect free search resutls
                if (cells[0].style.textAlign === "right") {
                    image_index = 1;
                }
                const statusImg = cells[image_index + 0].querySelector('img');
                const puzzleLink = cells[image_index + 1].querySelector('a');
                const solvedCount = cells[image_index + 2].textContent.trim();
                const ratingCell = cells[image_index + 3];

                if (statusImg && puzzleLink) {
                    const status = statusImg.getAttribute('title');
                    const difficultyImg = ratingCell.querySelector('img');
                    const ratingSpan = ratingCell.querySelector('span');

                    const descriptionSpan = cells[image_index + 1].querySelector('span');
                    const descriptionText = descriptionSpan ? descriptionSpan.textContent.trim().toLowerCase() : '';
                    const isSolved = /gelöst (am|heute|gestern)|solved (on|today|yesterday)/.test(descriptionText);
                    // console.log(descriptionText, isSolved)

                    if (!isSolved) {
                        puzzles.push({
                            name: puzzleLink.textContent.trim(),
                            link: puzzleLink.getAttribute('href'),
                            status,
                            solved: solvedCount,
                            difficulty: difficultyImg ? difficultyImg.getAttribute('alt') : '?',
                            difficultyTitle: difficultyImg ? difficultyImg.getAttribute('title') : '',
                            rating: ratingSpan ? ratingSpan.textContent.trim() : 'N/A'
                        });
                    }
                }
            }
        }
        return puzzles;
    }

    function fetchUserPuzzles(username) {
        const url = `https://logic-masters.de/Raetselportal/Benutzer/eingestellt.php?name=${encodeURIComponent(username)}`;
        return fetchPuzzlesGeneric('user:' + username, url);
    }

    function fetchSearchPuzzles(shortName, searchString) {
        const url = `https://logic-masters.de/Raetselportal/Suche/erweitert.php?${searchString}`;
        return fetchPuzzlesGeneric('search:' + shortName, url);
    }

    function fetchPuzzlesGeneric(key, url) {
        //console.log('fetching Key:', key, url);
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: response => {
                    if (response.status === 200) {
                        try {
                            const puzzles = parsePuzzleData(response.responseText);
                            //console.log('parsing result:', puzzles)
                            resolve({ key, puzzles, error: null });
                        } catch (e) {
                            resolve({ key, puzzles: [], error: 'Failed to parse puzzle data' });
                        }
                    } else {
                        resolve({ key, puzzles: [], error: 'Request failed' });
                    }
                },
                onerror: () => resolve({ key, puzzles: [], error: 'Network error' })
            });
        });
    }

    async function updatePuzzleData() {
        const users = getFavoriteUsers();
        const searches = getFavoriteSearches();
        const puzzleData = {};

        const requests = [
            ...users.map(u => fetchUserPuzzles(u)),
            ...searches.map(s => fetchSearchPuzzles(s.shortName, s.searchString))
        ];

        const results = await Promise.all(requests);
        results.forEach(r => {
            puzzleData[r.key] = {
                puzzles: r.puzzles,
                error: r.error,
                lastUpdate: Date.now()
            };
        });
        savePuzzleData(puzzleData);
        saveLastCheck(Date.now());
        return puzzleData;
    }

    // ---------- UI ----------
    function createWidget() {
        const w = document.createElement('div');
        w.className = 'box menu';
        w.id = 'puzzle-watcher-widget';
        w.innerHTML = `
            <h2>Puzzle Watcher</h2>
            <div style="margin-bottom:10px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                <input id="new-user-input" placeholder="Username" style="width:100px;">
                <button id="add-user-btn" style="font-size:11px;">Add User</button>
                <button id="refresh-btn" style="font-size:11px;">Refresh</button>
            </div>
            <div style="margin-bottom:10px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                <input id="new-search-shortname" placeholder="Short name" style="width:90px;">
                <input id="new-search-string" placeholder="Search string" style="width:150px;">
                <button id="add-search-btn" style="font-size:11px;">Add Search</button>
            </div>
            <div id="puzzle-results"></div>`;
        return w;
    }

    function updateWidgetDisplay() {
        const resultsDiv = document.getElementById('puzzle-results');
        if (!resultsDiv) return;

        const users = getFavoriteUsers();
        const searches = getFavoriteSearches();
        const data = getPuzzleData();
        let html = '';

        if (users.length === 0 && searches.length === 0) {
            html = '<p style="font-size:11px;">No users or searches being watched.</p>';
        } else {
            // Users
            users.forEach(u => html += buildEntryHTML('user', u, data['user:' + u], `/Raetselportal/Benutzer/eingestellt.php?name=${encodeURIComponent(u)}`));
            // Searches
            searches.forEach(s => html += buildEntryHTML('search', s.shortName, data['search:' + s.shortName], `/Raetselportal/Suche/erweitert.php?${s.searchString}`));
        }

        resultsDiv.innerHTML = html;

        resultsDiv.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type, key = this.dataset.key;
                if (type === 'user') removeUser(key);
                else removeSearch(key);
            });
        });
    }

    function buildEntryHTML(type, label, entryData, link) {
        let html = `<div style="border-bottom:1px solid #ccc;margin-bottom:5px;padding:3px 0;">`;
        html += `<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:bold;">`;
        html += `<a href="${link}" style="text-decoration:none;">${label}</a>`;
        html += `<button class="remove-btn" data-type="${type}" data-key="${label}" style="font-size:9px;">Remove</button></div>`;
        if (!entryData) html += `<p style="font-size:10px;color:#666;">Not checked yet...</p>`;
        else if (entryData.error) html += `<p style="font-size:10px;color:#f00;">${entryData.error}</p>`;
        else if (entryData.puzzles.length === 0) html += `<p style="font-size:10px;color:#666;">No new puzzles</p>`;
        else entryData.puzzles.forEach(p => {
            html += `<div style="margin:2px 0 2px 15px;font-size:10px;display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap;">`;
            html += `<a href="${p.link}" style="text-decoration:none;">${p.name}</a>`;
            html += `<span style="color:#666;font-size:9px;"> (Level ${p.difficulty}, ${p.rating}, ${p.solved} solved)</span>`;
            html += `</div>`;
        });
        html += `</div>`;
        return html;
    }

    // ---------- User / Search management ----------
    function addUser() {
        const inp = document.getElementById('new-user-input');
        const val = inp.value.trim();
        if (!val) return;
        const users = getFavoriteUsers();
        if (!users.includes(val)) {
            users.push(val);
            saveFavoriteUsers(users);
            refreshData();
            updateWidgetDisplay();
        }
        inp.value = '';
    }

    function removeUser(username) {
        const users = getFavoriteUsers().filter(u => u !== username);
        saveFavoriteUsers(users);
        const data = getPuzzleData();
        delete data['user:' + username];
        savePuzzleData(data);
        updateWidgetDisplay();
    }

    function addSearch() {
        const sn = document.getElementById('new-search-shortname').value.trim();
        const ss = document.getElementById('new-search-string').value.trim();
        if (!sn || !ss) return alert('Both short name and search string are required.');
        const searches = getFavoriteSearches();
        if (!searches.some(s => s.shortName === sn)) {
            searches.push({ shortName: sn, searchString: ss });
            saveFavoriteSearches(searches);
            refreshData();
            updateWidgetDisplay();
        }
        document.getElementById('new-search-shortname').value = '';
        document.getElementById('new-search-string').value = '';
    }

    function removeSearch(shortName) {
        const searches = getFavoriteSearches().filter(s => s.shortName !== shortName);
        saveFavoriteSearches(searches);
        const data = getPuzzleData();
        delete data['search:' + shortName];
        savePuzzleData(data);
        updateWidgetDisplay();
    }

    // ---------- Refresh ----------
    async function refreshData() {
        const btn = document.getElementById('refresh-btn');
        if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }
        try { await updatePuzzleData(); updateWidgetDisplay(); }
        finally { if (btn) { btn.textContent = 'Refresh'; btn.disabled = false; } }
    }

    // ---------- Init ----------
    function init() {
        initStorage();
        const col = document.querySelector('.leftcolumn');
        if (!col) return;
        const widget = createWidget();
        col.appendChild(widget);

        document.getElementById('add-user-btn').addEventListener('click', addUser);
        document.getElementById('add-search-btn').addEventListener('click', addSearch);
        document.getElementById('refresh-btn').addEventListener('click', refreshData);

        document.getElementById('new-user-input').addEventListener('keypress', e => { if (e.key === 'Enter') addUser(); });
        document.getElementById('new-search-string').addEventListener('keypress', e => { if (e.key === 'Enter') addSearch(); });

        updateWidgetDisplay();
        if (shouldCheck()) refreshData();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
