// ==UserScript==
// @name         OpenFront.io - Lobby Player List [Nightly Build]
// @namespace    https://openfront.io/
// @version      2.7
// @description  Floating lobby player list, highlight, snipe, all in one floating panel.
// @author       SyntaxMenace + DeepSeek
// @match        https://openfront.io/
// @grant        GM_getValue
// @grant        GM_setValue
// @license      UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/541535/OpenFrontio%20-%20Lobby%20Player%20List%20%5BNightly%20Build%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/541535/OpenFrontio%20-%20Lobby%20Player%20List%20%5BNightly%20Build%5D.meta.js
// ==/UserScript==

/*
   ⚠️ Incomplete features notice ⚠️:

   The SNIPE feature is incredibly buggy, if you want a regular openfront.io experience DO NOT USE IT.

   The "position" dropdown menu in the settings menu is incomplete, it will not work yet.
   The "Theme" menu is also incomplete, it will also not work yet.

   Other than that, use this to your liking!
*/

/*
   Hello modders!

   This is a quick notice so I'd like it if you were to read this.
   Most of the front-end code was written by DeepSeek (hence why it's incredibly buggy, & I dont like writing frontend code so whatever lmao), so any and all code you see here is
   in the public domain and you are hereby free to modify, distribute or sell any part of this code code to your liking!

   ~ SyntaxMenace
*/

(function() {
'use strict';

// ---- Constants ----
const THREAD_COUNT = 20; // This is for figuring out which worker the lobby is hosted in.
const POLL_INTERVAL = 500; // Interval at which we will refresh the player-list (default is 750ms)
const RECHECK_INTERVAL = 650; // for rejoin debounce when sniping a user

const ROOT_URL = 'https://openfront.io/'; // This is mostly for checking if we're currently in a game or not.

const STORAGE_KEY = 'OF_PLAYER_LIST_SETTINGS';
const HIGHLIGHTED_KEY = 'OF_HIGHLIGHTED_PLAYERS';
const SNIPE_KEY = 'OF_SNIPE_PATTERNS';
const AUTOJOIN_KEY = 'OF_SNIPE_AUTOJOIN';
const SNIPESESSION_KEY = 'OF_SNIPE_SESSION_TRACK';

// ---- CSS ----
const css = `
.of-player-list-container {
    position: fixed; top: 20px; right: 20px; width: 320px; height: 650px;
    background: rgba(34, 40, 52, 0.93); border-radius: 12px;
    box-shadow: 0 4px 24px rgba(20,25,38,0.27);
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
    overflow: hidden; backdrop-filter: blur(7px);
    border: 1.5px solid rgba(98,110,134,0.13); display: flex;
    flex-direction: column; user-select: none; z-index: 9999;
}
.of-player-list-header {
    padding: 13px 18px; background: rgba(0,0,0,0.16); color: #eaf2ff;
    font-weight: 600; display: flex; justify-content: space-between;
    align-items: center; cursor: move; flex-shrink: 0;
    font-size: 1.1em; border-bottom: 1.3px solid rgba(100,115,145,0.13);
    letter-spacing: 0.5px;
}
.of-player-list-count {
    background: rgba(110,130,180,0.13); border-radius: 13px; padding: 2.5px 10px;
    font-size: 0.91em; color: #b7bdd8;
}
.of-player-debug-info {
    font-size: 0.83em; color: #96a4cc; padding: 2px 6px; display: none;
}
.of-player-list-tabs {
    display: flex; border-bottom: 1.5px solid rgba(100,115,145,0.13);
    background: rgba(0,0,0,0.10); margin-bottom: 0;
}
.of-player-list-tab {
    flex: 1; padding: 10px 0 10px 0; text-align: center;
    color: #a3b4df; background: transparent; cursor: pointer;
    font-size: 1em; font-weight: 600; border: none; outline: none;
    transition: background 0.14s, color 0.13s;
    border-radius: 0; border-bottom: 2.5px solid transparent;
}
.of-player-list-tab.active {
    color: #eaf2ff; background: rgba(110,130,180,0.11);
    border-bottom: 2.5px solid #6caaff;
}
.of-player-search {
    padding: 12px 18px; background: rgba(46,54,72,0.12);
    border-top: 1px solid rgba(80,90,115,0.10);
    border-bottom: 1px solid rgba(80,90,115,0.10); flex-shrink: 0;
}
.of-player-search input {
    width: 100%; padding: 8.5px 11px; background: rgba(210,215,235,0.12);
    border: 1.4px solid rgba(130,140,180,0.15); border-radius: 6px;
    color: #eaf2ff; font-size: 1em; outline: none; box-shadow: none;
    transition: border .14s, background .18s;
}
.of-player-search input:focus {
    border: 1.4px solid #86a6ff; background: rgba(110,130,180,0.11);
}
.of-player-list-content {
    flex: 1; overflow-y: auto; scrollbar-width: thin;
    scrollbar-color: rgba(128,150,180,0.15) transparent;
    background: none;
}
.of-player-list-content::-webkit-scrollbar { width: 7px; }
.of-player-list-content::-webkit-scrollbar-thumb {
    background: rgba(110,130,180,0.12); border-radius: 5px;
}
.of-player-item {
    padding: 7px 18px; border-bottom: 1px solid rgba(110,130,180,0.08);
    font-size: 0.97em; line-height: 1.55; position: relative;
    transition: background-color .33s;
    cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
}
.of-player-name {
    color: #eaf2ff; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; font-weight: 400; flex: 1;
}
.of-player-highlighted {
    background: linear-gradient(90deg, rgba(255,235,133,0.18) 40%, rgba(255,210,80,0.10));
    border-left: 3.5px solid #FFD900;
    box-shadow: 0 0 0.5em 0.1em rgba(255,230,80,0.07);
}
.of-player-enter {
    animation: playerEnter 0.33s cubic-bezier(.27,.82,.48,1.06) forwards;
}
.of-player-enter-highlight {
    background-color: rgba(110,160,255,0.14) !important;
}
.of-player-exit-highlight {
    background-color: rgba(220, 70, 90, 0.18);
}
.of-player-exit {
    animation: playerExit 0.25s cubic-bezier(.51,.01,1,1.01) forwards;
}
@keyframes playerEnter {
    from { opacity: 0; transform: translateY(-10px);}
    to { opacity: 1; transform: translateY(0);}
}
@keyframes playerExit {
    from { opacity: 1; transform: translateY(0);}
    to { opacity: 0; transform: translateY(-13px);}
}
.of-player-list-footer {
    padding: 11px 18px; display: flex; justify-content: space-between;
    background: rgba(0,0,0,0.11); font-size: 1em; flex-shrink: 0;
    border-top: 1px solid rgba(80,90,115,0.10);
}
.of-player-list-button {
    background: rgba(125,140,170,0.10); border: none; color: #eaf2ff;
    padding: 6px 13px; border-radius: 6px; cursor: pointer;
    font-size: 1em; font-weight: 600; transition: background 0.11s, color 0.11s;
    outline: none;
}
.of-player-list-button:hover, .of-player-list-button:focus {
    background: rgba(100,125,190,0.15); color: #b3cdf7;
}
.of-snipe-bar {
    padding: 12px 18px 0 18px;
}
.of-snipe-list-regexitem {
    padding: 7px 0; border-bottom: 1px solid rgba(110,130,180,0.07);
    display: flex; align-items: center; gap: 5px;
}
.of-snipe-list-regex { font-family: monospace; color: #fee074; background: none; border: none; font-size: 1em; flex: 1; }
.of-snipe-delete-btn {
    background: none; border: none; color: #ff7575; font-weight: 700; font-size: 1.1em; cursor: pointer; margin-left: 6px;
}
.of-snipe-add-form { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
.of-snipe-input { flex: 1; padding: 7px 11px; border-radius: 6px; border: 1.4px solid rgba(130,140,180,0.15); background: rgba(210,215,235,0.10); color: #eaf2ff; font-size: 1em;}
.of-snipe-btn { padding: 6px 13px; border-radius: 6px; border: none; background: rgba(90,180,250,0.13); color: #eaf2ff; font-weight: 600; cursor: pointer; }
.of-snipe-btn:hover { background: rgba(120,180,250,0.22); }
.of-snipe-regex-test { margin-top: 10px; font-size: 0.97em; color: #a3b9e3;}
.of-snipe-regex-test-match { color: #42f59e;}
.of-snipe-regex-test-fail { color: #f25656;}
.of-player-snipe-btn {
    margin-left: 10px; font-size: .98em;
    display: inline-block; vertical-align: middle; line-height: 1.2;
    height: 28px; min-width: 70px;
    border: none; cursor: pointer; background: linear-gradient(to right,#2563eb,#3b82f6); color: #fff;
    border-radius: 13px; font-weight: 600;
    transition: background 0.14s, opacity 0.12s;
}
.of-player-snipe-btn.sniping { background: repeating-linear-gradient(90deg,#3b82f6 0 10px,#2563eb 10px 20px) }
.of-player-snipe-btn:disabled { opacity: .65; cursor: wait;}
.of-snipe-autojoin-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px; margin-top: 4px;
}
.of-snipe-autojoin-toggle {
    width: 34px; height: 18px; border-radius: 11px; background: #2d3c62; border: none; outline: none;
    position: relative; transition: background 0.17s;
    cursor: pointer;
}
.of-snipe-autojoin-toggle.on { background: #5fd785;}
.of-snipe-autojoin-toggle-ball {
    position: absolute; left: 2px; top: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: left 0.16s;
}
.of-snipe-autojoin-toggle.on .of-snipe-autojoin-toggle-ball { left: 18px;}
/* Modal fix */
.of-player-list-settings {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
    background: rgba(42, 48, 62, 0.98); border-radius: 14px; padding: 22px 23px 18px 23px;
    z-index: 10000; box-shadow: 0 12px 48px rgba(24,28,38,0.18);
    width: 325px; max-width: 98%; border: 1.7px solid rgba(120,130,160,0.13);
    color: #eaf2ff; display: none;
}
.of-player-list-settings h3 { margin-top: 0; border-bottom: 1.3px solid rgba(120,130,160,0.11); padding-bottom: 10px; color: #eaf2ff; font-size: 1.19em; font-weight: 600;}
.of-settings-group { margin-bottom: 17px; }
.of-settings-label { display: block; margin-bottom: 7px; color: #b1bbd6; font-size: 1em; font-weight: 500;}
.of-settings-select, .of-player-list-settings select {
    width: 100%; padding: 9px 32px 9px 11px; margin: 0;
    background: rgba(66,74,98,0.92);
    border: 1.6px solid #92a3ce;
    border-radius: 7px; color: #eaf2ff; font-size: 1.07em; font-weight: 500;
    appearance: none; -webkit-appearance: none; outline: none; box-shadow: none;
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='10' viewBox='0 0 18 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3L9 8L15 3' stroke='%23bdd4fd' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat; background-position: right 13px center;
    transition: border .18s, box-shadow .17s, background 0.14s;
}
.of-player-list-settings select:focus { border: 1.6px solid #bdd4fd; background: rgba(66,74,98,0.99);}
.of-player-list-settings input[type="text"] {
    width: 100%; padding: 9px 11px; background: rgba(200,220,255,0.11);
    border: 1.4px solid #92a3ce; border-radius: 7px; color: #eaf2ff; font-size: 1em;
    outline: none; margin-top: 3px; box-shadow: none; transition: border 0.14s;
}
.of-player-list-settings input[type="text"]:focus { border: 1.4px solid #bdd4fd; background: rgba(220,230,255,0.13);}
.of-player-list-settings label.of-checkbox-label {
    display: flex; align-items: center; cursor: pointer; margin-bottom: 10px;
    font-size: 1.01em; color: #b1bbd6; font-weight: 500;
}
.of-player-list-settings input[type="checkbox"] {
    appearance: none; -webkit-appearance: none; width: 23px; height: 23px;
    border: 2.1px solid #96a4cc; border-radius: 7px;
    background: rgba(110,120,150,0.16); margin-right: 14px; position: relative;
    transition: border-color 0.17s, background 0.19s; vertical-align: middle; cursor: pointer;
}
.of-player-list-settings input[type="checkbox"]:checked {
    border-color: #bdd4fd; background: rgba(150,180,255,0.17);
}
.of-player-list-settings input[type="checkbox"]:checked:after {
    content: ""; display: block; position: absolute; left: 7px; top: 3px; width: 6px; height: 12px;
    border: solid #bdd4fd; border-width: 0 3px 3px 0; border-radius: 2.5px;
    transform: rotate(45deg) scale(1.08);
}
.of-settings-buttons { display: flex; justify-content: flex-end; margin-top: 20px;}
.of-settings-close { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.3em; color: #b1bbd6; cursor: pointer;}
`;
var styleTag = document.createElement('style');
styleTag.textContent = css;
document.head.appendChild(styleTag);

// ---- Sound ----
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 1320;
        g.gain.value = 0.23;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => { g.gain.setValueAtTime(0, ctx.currentTime); o.stop(); ctx.close(); }, 350);
    } catch(e) {}
}

// ---- Lobby detection helpers ----
function getLobbyButton() {
    return document.querySelector('button.isolate.grid.h-40');
}
function isInLobby() {
    // Green = "in", Blue = "not in"
    let btn = getLobbyButton();
    if (!btn) return false;
    return btn.className.includes('from-green-600');
}
function canJoinLobby() {
    let btn = getLobbyButton();
    if (!btn) return false;
    // Only if it's not disabled and visible
    return btn.className.includes('from-blue-600') && !btn.disabled && btn.offsetParent !== null;
}
function tryJoinLobby() {
    let btn = getLobbyButton();
    if (btn && btn.className.includes('from-blue-600') && !btn.disabled && btn.offsetParent !== null) {
        btn.click();
        return true;
    }
    return false;
}
function tryLeaveLobby() {
    let btn = getLobbyButton();
    if (btn && btn.className.includes('from-green-600') && !btn.disabled && btn.offsetParent !== null) {
        btn.click();
        return true;
    }
    return false;
}

const DEFAULT_SETTINGS = {
    position: 'right',
    theme: 'dark',
    autoRefresh: true,
    showPlayerCount: true,
    animationsEnabled: true,
    highlightedPlayers: [],
    debug: false
};

let LAST_GAME_ID = null;
let LAST_WORKER_ID = null;

function simpleHash(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; } return Math.abs(h);}
function findWorkerId(gameId) { return simpleHash(gameId) % THREAD_COUNT; }

async function getCurrentLobby() {
    const r = await fetch("/api/public_lobbies");
    return r.json();
}
async function fetchGameData(gameId, workerId) {
    try {
        const r = await fetch(`w${workerId}/api/game/${gameId}`);
        if (r.headers.get('content-type')?.includes('text/html')) throw new Error('Game started');
        return r.json();
    } catch {
        return { clients: {} };
    }
}
async function fetchPlayersInLobby() {
    try {
        const { lobbies } = await getCurrentLobby();
        if (!lobbies?.length) { LAST_GAME_ID = LAST_WORKER_ID = null; return []; }
        const gameId = lobbies[0].gameID;
        const workerId = findWorkerId(gameId);
        LAST_GAME_ID = gameId;
        LAST_WORKER_ID = workerId;
        const data = await fetchGameData(gameId, workerId);
        const names = [];
        for (const st of Object.values(data.clients || {})) names.push(st.username);
        return names;
    } catch {
        LAST_GAME_ID = LAST_WORKER_ID = null;
        return [];
    }
}

// ---- Main UI class ----

class PlayerListUI {
    constructor() {
        this.settings = GM_getValue(STORAGE_KEY)
            ? { ...DEFAULT_SETTINGS, ...GM_getValue(STORAGE_KEY) }
            : { ...DEFAULT_SETTINGS };
        this.highlightedPlayers = GM_getValue(HIGHLIGHTED_KEY, []);
        this.snipePatterns = GM_getValue(SNIPE_KEY, []);
        this.snipeAutoJoin = GM_getValue(AUTOJOIN_KEY, true);
        this.snipingState = {};
        this.currentPlayers     = [];
        this.previousPlayers    = new Set();
        this.pollInterval       = null;
        this.isActive           = location.href === ROOT_URL;
        this.sleeping           = !this.isActive;
        this.debugSequence      = [];
        this.inSearchMode       = false;
        this.lastSearchTerm     = "";
        this.activeTab = "players";
        this.lastSnipedFound = new Set();

        this.snipeSession = {
            active: false,
            player: null,
            rejoinInterval: null,
            joinedByScript: false,
        };

        this.initUI();
        this.initDebugKey();
        this.updateSleepState();
        this.observeURL();
        if (!this.sleeping) this.startPolling();

        this.monitorLobbyRejoin();
    }

    // ---- UI ----

    initUI() {
        this.container = document.createElement('div');
        this.container.className = 'of-player-list-container';
        document.body.appendChild(this.container);

        // Header
        this.header = document.createElement('div');
        this.header.className = 'of-player-list-header';
        this.header.innerHTML =
            `<span>Players</span><span class="of-player-list-count">0</span>`;
        this.container.appendChild(this.header);

        this.debugInfo = document.createElement('div');
        this.debugInfo.className = 'of-player-debug-info';
        this.header.appendChild(this.debugInfo);

        // Tabs
        this.tabsBar = document.createElement('div');
        this.tabsBar.className = 'of-player-list-tabs';
        this.playersTabBtn = document.createElement('button');
        this.playersTabBtn.className = 'of-player-list-tab active';
        this.playersTabBtn.innerText = "Players";
        this.playersTabBtn.addEventListener('click', () => this.switchTab('players'));
        this.snipeTabBtn = document.createElement('button');
        this.snipeTabBtn.className = 'of-player-list-tab';
        this.snipeTabBtn.innerText = "Snipe";
        this.snipeTabBtn.addEventListener('click', () => this.switchTab('snipe'));
        this.tabsBar.appendChild(this.playersTabBtn);
        this.tabsBar.appendChild(this.snipeTabBtn);
        this.container.appendChild(this.tabsBar);

        // Search
        this.searchBox = document.createElement('div');
        this.searchBox.className = 'of-player-search';
        this.searchInput = document.createElement('input');
        this.searchInput.placeholder = 'Search players...';
        this.searchInput.addEventListener('input', () => this.onSearchInput());
        this.searchBox.appendChild(this.searchInput);
        this.container.appendChild(this.searchBox);

        // Content (player list or snipe tab)
        this.content = document.createElement('div');
        this.content.className = 'of-player-list-content';
        this.container.appendChild(this.content);

        // Footer
        this.footer = document.createElement('div');
        this.footer.className = 'of-player-list-footer';
        this.footer.innerHTML =
            `<button class="of-player-list-button of-refresh-btn">Refresh</button>` +
            `<button class="of-player-list-button of-settings-btn">Settings</button>`;
        this.container.appendChild(this.footer);
        this.footer.querySelector('.of-refresh-btn')
            .addEventListener('click', () => this.updatePlayerList());
        this.footer.querySelector('.of-settings-btn')
            .addEventListener('click', () =>
                this.settingsModal.style.display === 'block' ? this.hideSettings() : this.showSettings()
            );

        // DRAG
        this.dragHandler = new DragHandler(this.container, (x, y) => {
            this.container.style.left = x + 'px';
            this.container.style.top = y + 'px';
            this.container.style.right = 'auto';
        });

        // snipe tab
        this.snipeBar = this.makeSnipeBar();

        this.initSettingsModal();
        this.applySettings();
    }

    switchTab(tab) {
        this.activeTab = tab;
        if (tab === 'players') {
            this.playersTabBtn.classList.add('active');
            this.snipeTabBtn.classList.remove('active');
            this.searchBox.style.display = '';
            this.content.className = 'of-player-list-content';
            this.renderPlayerList(this.inSearchMode ? this.filteredPlayers : this.currentPlayers);
        } else {
            this.snipeTabBtn.classList.add('active');
            this.playersTabBtn.classList.remove('active');
            this.searchBox.style.display = 'none';
            this.renderSnipeTab();
        }
    }

    makeSnipeBar() {
        const snipeBar = document.createElement('div');
        snipeBar.className = 'of-snipe-bar';
        snipeBar.innerHTML = `
            <div class="of-snipe-autojoin-row">
                <span style="color:#eaf2ff;font-size:.98em;font-weight:500;">Auto-join on match</span>
                <button type="button" class="of-snipe-autojoin-toggle"><div class="of-snipe-autojoin-toggle-ball"></div></button>
            </div>
            <form class="of-snipe-add-form">
                <input type="text" class="of-snipe-input" placeholder="Add regex pattern (case-insensitive)">
                <button class="of-snipe-btn" type="submit">Add</button>
            </form>
            <div class="of-snipe-regex-test">
                <input type="text" class="of-snipe-input of-snipe-test-input" style="margin-bottom:3px;" placeholder="Test string (live)">
                <span class="of-snipe-regex-test-result"></span>
            </div>
            <div style="margin-top:14px;font-weight:600;color:#ffc352;">Snipe Patterns</div>
            <div class="of-snipe-list"></div>
        `;
        // Autojoin toggle
        const toggleBtn = snipeBar.querySelector('.of-snipe-autojoin-toggle');
        const updateToggle = () => {
            toggleBtn.classList.toggle('on', this.snipeAutoJoin);
        };
        updateToggle();
        toggleBtn.addEventListener('click', () => {
            this.snipeAutoJoin = !this.snipeAutoJoin;
            updateToggle();
            GM_setValue(AUTOJOIN_KEY, this.snipeAutoJoin);
        });

        // Add regex
        snipeBar.querySelector('.of-snipe-add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const val = snipeBar.querySelector('.of-snipe-input').value.trim();
            if (!val) return;
            try { new RegExp(val, 'i'); } catch { alert('Invalid regex!'); return;}
            if (this.snipePatterns.includes(val)) return;
            this.snipePatterns.push(val);
            this.saveSnipePatterns();
            snipeBar.querySelector('.of-snipe-input').value = '';
            this.refreshSnipeTab();
        });
        const testInput = snipeBar.querySelector('.of-snipe-test-input');
        const testResult = snipeBar.querySelector('.of-snipe-regex-test-result');
        testInput.addEventListener('input', () => {
            const str = testInput.value;
            let out = '';
            for (const pat of this.snipePatterns) {
                let ok = false;
                try {
                    ok = new RegExp(pat, 'i').test(str);
                } catch (e) {
                    out += `<div><span class="of-snipe-regex-test-fail">/${pat}/i: Invalid Regex</span></div>`;
                    continue;
                }
                out += `<div><span class="${ok?'of-snipe-regex-test-match':'of-snipe-regex-test-fail'}">/${pat}/i: ${ok?'MATCH':'NO'}</span></div>`;
            }
            testResult.innerHTML = out || '<span style="color:#a1aac3">No patterns</span>';
        });
        return snipeBar;
    }
    renderSnipeTab() {
        this.content.innerHTML = '';
        this.content.appendChild(this.snipeBar);
        this.refreshSnipeTab();
    }
    refreshSnipeTab() {
        const list = this.snipeBar.querySelector('.of-snipe-list');
        list.innerHTML = '';
        this.snipePatterns.forEach((pat, idx) => {
            const row = document.createElement('div');
            row.className = 'of-snipe-list-regexitem';
            const patBox = document.createElement('input');
            patBox.type = 'text'; patBox.value = pat;
            patBox.className = 'of-snipe-list-regex';
            patBox.addEventListener('change', () => {
                try { new RegExp(patBox.value, 'i'); }
                catch { alert('Invalid regex!'); patBox.value = pat; return;}
                this.snipePatterns[idx] = patBox.value;
                this.saveSnipePatterns();
            });
            row.appendChild(patBox);
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'of-snipe-delete-btn';
            delBtn.innerHTML = '&times;';
            delBtn.title = 'Remove';
            delBtn.addEventListener('click', () => {
                this.snipePatterns.splice(idx, 1);
                this.saveSnipePatterns();
                this.refreshSnipeTab();
            });
            row.appendChild(delBtn);
            list.appendChild(row);
        });
        const evt = new Event('input');
        this.snipeBar.querySelector('.of-snipe-test-input').dispatchEvent(evt);
    }
    saveSnipePatterns() {
        GM_setValue(SNIPE_KEY, this.snipePatterns);
    }

    // ---- Snipe: updatePlayerList (auto-join logic, with session state) ----

    async updatePlayerList() {
        if (this.sleeping) return;
        const names = await fetchPlayersInLobby();
        this.currentPlayers = names;
        if (this.settings.debug && LAST_GAME_ID != null) {
            this.debugInfo.textContent = `GameID: ${LAST_GAME_ID} | WorkerID: ${LAST_WORKER_ID}`;
        }
        const atBottom = this.content.scrollTop + this.content.clientHeight
            >= this.content.scrollHeight - 5;
        const nowSet = new Set(names);

        // ----------- Snipe logic: beep and autojoin/rejoin ---------
        let snipedPlayer = null;
        let foundNewMatch = false;
        for (const name of names) {
            if (this.snipePatterns.some(pat => {
                try { return new RegExp(pat, 'i').test(name);}
                catch { return false;}
            })) {
                snipedPlayer = name;
                if (!this.lastSnipedFound.has(name)) {
                    foundNewMatch = true;
                    playBeep();
                }
            }
        }
        this.lastSnipedFound = new Set(names.filter(name =>
            this.snipePatterns.some(pat => {
                try { return new RegExp(pat, 'i').test(name);}
                catch { return false;}
            })
        ));

        // --- Manage snipe session ---
        if (snipedPlayer && this.snipeAutoJoin) {
            // If not already sniping, start sniping!
            if (!this.snipeSession.active || this.snipeSession.player !== snipedPlayer) {
                this.startSniping(snipedPlayer);
            }
        } else if (this.snipeSession.active && (!snipedPlayer || !this.snipeAutoJoin)) {
            // If player gone, or autojoin off, stop sniping.
            this.stopSniping();
        }

        // Players Tab rendering
        if (this.activeTab === "players") {
            if (this.inSearchMode) {
                this.filteredPlayers = names.filter(n => n.toLowerCase().includes(this.lastSearchTerm));
                this.renderPlayerList(this.filteredPlayers);
            } else {
                this.renderWithAnim(names, nowSet);
            }
            if (this.settings.showPlayerCount) {
                this.header.querySelector('.of-player-list-count').textContent = names.length;
            }
        }
        if (atBottom && !this.lastSearchTerm && this.activeTab === "players") {
            this.content.scrollTop = this.content.scrollHeight;
        }
        this.previousPlayers = nowSet;
        this.updateSnipingButtons();
    }

    // ---- "Sniping" session logic ----

    startSniping(player) {
        this.stopSniping(); // clear previous
        this.snipeSession.active = true;
        this.snipeSession.player = player;
        this.snipeSession.joinedByScript = false;
        this.snipeSession.rejoinInterval = setInterval(() => this.doSnipingTick(), RECHECK_INTERVAL);
        this.doSnipingTick(); // instant first
    }
    stopSniping() {
        if (this.snipeSession.rejoinInterval) clearInterval(this.snipeSession.rejoinInterval);
        this.snipeSession.active = false;
        this.snipeSession.player = null;
        this.snipeSession.joinedByScript = false;
    }
    doSnipingTick() {
        if (!this.snipeSession.active || !this.snipeSession.player) return;
        // If we are not in lobby, and can join, join!
        if (!isInLobby() && canJoinLobby()) {
            if (tryJoinLobby()) {
                this.snipeSession.joinedByScript = true;
            }
        }
        // If we *are* in lobby, but the sniped player is gone, and we joined by script: leave & requeue!
        else if (isInLobby() && this.snipeSession.joinedByScript) {
            // If player no longer present, leave lobby and set joinedByScript = false
            if (!this.currentPlayers.includes(this.snipeSession.player)) {
                // Try to leave and requeue on next tick
                if (tryLeaveLobby()) {
                    setTimeout(() => {
                        // Try to rejoin after delay, if still needed
                        if (canJoinLobby()) {
                            tryJoinLobby();
                            this.snipeSession.joinedByScript = true;
                        }
                    }, 650);
                }
            }
        }
    }

    // ---- UI render: player list, highlight, snipe buttons ----

    renderWithAnim(names, nowSet) {
        this.previousPlayers.forEach(name => {
            if (!nowSet.has(name)) {
                const el = this.content.querySelector(`.of-player-item[data-name="${name}"]`);
                if (el) {
                    if (this.settings.animationsEnabled) {
                        el.classList.add('of-player-exit-highlight');
                        setTimeout(() => {
                            el.classList.add('of-player-exit');
                            el.addEventListener('animationend', () => el.remove(), { once: true });
                        }, 50);
                    } else {
                        el.remove();
                    }
                }
            }
        });
        names.forEach(name => {
            if (!this.previousPlayers.has(name)) {
                const el = this.createPlayerEl(name);
                if (this.settings.animationsEnabled) {
                    el.classList.add('of-player-enter', 'of-player-enter-highlight');
                    setTimeout(() => el.classList.remove('of-player-enter-highlight'), 500);
                }
                this.content.appendChild(el);
            }
        });
    }
    createPlayerEl(name) {
        const isH = this.highlightedPlayers.some(h =>
            name.toLowerCase().includes(h.toLowerCase())
        );
        const el = document.createElement('div');
        el.className = 'of-player-item' + (isH ? ' of-player-highlighted' : '');
        el.dataset.name = name;
        el.innerHTML = `<div class="of-player-name" title="${name}">${name}</div>`;
        el.addEventListener('click', () => this.toggleHighlight(name));
        if (this.snipePatterns.some(pat => {
            try { return new RegExp(pat, 'i').test(name);}
            catch { return false;}
        })) {
            const snipeBtn = document.createElement('button');
            snipeBtn.className = 'of-player-snipe-btn';
            snipeBtn.textContent = this.snipeSession.active && this.snipeSession.player === name ? 'Sniping...' : 'Snipe';
            snipeBtn.disabled = this.snipeSession.active && this.snipeSession.player === name;
            if (this.snipeSession.active && this.snipeSession.player === name) snipeBtn.classList.add('sniping');
            snipeBtn.addEventListener('click', e => {
                e.stopPropagation();
                if (!this.snipeSession.active) this.startSniping(name);
                else this.stopSniping();
            });
            el.appendChild(snipeBtn);
        }
        return el;
    }
    toggleHighlight(name) {
        const idx = this.highlightedPlayers.findIndex(h => h.toLowerCase() === name.toLowerCase());
        if (idx >= 0) this.highlightedPlayers.splice(idx, 1);
        else this.highlightedPlayers.push(name);
        GM_setValue(HIGHLIGHTED_KEY, this.highlightedPlayers);
        if (this.inSearchMode) {
            this.renderPlayerList(this.filteredPlayers);
        } else {
            this.renderPlayerList(this.currentPlayers);
        }
    }
    renderPlayerList(players) {
        if (this.activeTab !== "players") return;
        this.content.innerHTML = '';
        players.forEach(n => this.content.appendChild(this.createPlayerEl(n)));
    }
    updateSnipingButtons() {
        if (this.activeTab !== "players") return;
        this.currentPlayers.forEach(name => {
            const btn = this.content.querySelector(`.of-player-item[data-name="${name}"] .of-player-snipe-btn`);
            if (btn) {
                if (this.snipeSession.active && this.snipeSession.player === name) {
                    btn.textContent = 'Sniping...';
                    btn.disabled = true;
                    btn.classList.add('sniping');
                } else {
                    btn.textContent = 'Snipe';
                    btn.disabled = false;
                    btn.classList.remove('sniping');
                }
            }
        });
    }

    // ---- Search ----
    onSearchInput() {
        this.lastSearchTerm = this.searchInput.value.toLowerCase();
        this.inSearchMode = !!this.lastSearchTerm;
        if (this.inSearchMode) {
            this.filteredPlayers = this.currentPlayers.filter(n => n.toLowerCase().includes(this.lastSearchTerm));
        } else {
            this.filteredPlayers = [];
        }
        this.renderPlayerList(this.inSearchMode ? this.filteredPlayers : this.currentPlayers);
    }

    // ---- Settings Modal ----

    initSettingsModal() {
        this.settingsModal = document.createElement('div');
        this.settingsModal.className = 'of-player-list-settings';
        this.settingsModal.innerHTML =
            `<button class="of-settings-close">&times;</button>
            <h3>Player List Settings</h3>
            <div class="of-settings-group">
                <label class="of-settings-label">Position</label>
                <select class="of-settings-select of-position-select">
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                </select>
            </div>
            <div class="of-settings-group">
                <label class="of-settings-label">Theme</label>
                <select class="of-settings-select of-theme-select">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>
            <div class="of-settings-group">
                <label class="of-checkbox-label"><input type="checkbox" class="of-auto-refresh"> Auto-refresh</label>
                <label class="of-checkbox-label"><input type="checkbox" class="of-show-count"> Show player count</label>
                <label class="of-checkbox-label"><input type="checkbox" class="of-animations-enabled"> Enable animations</label>
            </div>
            <div class="of-settings-group">
                <label class="of-settings-label">Highlight players (comma-separated)</label>
                <input type="text" class="of-highlighted-input" />
            </div>
            <div class="of-settings-buttons">
                <button class="of-player-list-button of-save-settings">Save</button>
            </div>`;
        document.body.appendChild(this.settingsModal);

        this.settingsModal.querySelector('.of-position-select').value = this.settings.position;
        this.settingsModal.querySelector('.of-theme-select').value = this.settings.theme;
        this.settingsModal.querySelector('.of-auto-refresh').checked = this.settings.autoRefresh;
        this.settingsModal.querySelector('.of-show-count').checked = this.settings.showPlayerCount;
        this.settingsModal.querySelector('.of-animations-enabled').checked = this.settings.animationsEnabled;
        this.settingsModal.querySelector('.of-highlighted-input').value = this.highlightedPlayers.join(', ');

        this.settingsModal.querySelector('.of-settings-close')
            .addEventListener('click', () => this.hideSettings());
        this.settingsModal.querySelector('.of-save-settings')
            .addEventListener('click', () => this.saveFromModal());
    }
    showSettings() { this.settingsModal.style.display = 'block'; }
    hideSettings() { this.settingsModal.style.display = 'none'; }
    saveFromModal() {
        this.settings.position = this.settingsModal.querySelector('.of-position-select').value;
        this.settings.theme = this.settingsModal.querySelector('.of-theme-select').value;
        this.settings.autoRefresh = this.settingsModal.querySelector('.of-auto-refresh').checked;
        this.settings.showPlayerCount = this.settingsModal.querySelector('.of-show-count').checked;
        this.settings.animationsEnabled = this.settingsModal.querySelector('.of-animations-enabled').checked;
        const list = this.settingsModal.querySelector('.of-highlighted-input').value
            .split(',').map(s => s.trim()).filter(Boolean);
        this.highlightedPlayers = list;
        GM_setValue(HIGHLIGHTED_KEY, this.highlightedPlayers);
        GM_setValue(STORAGE_KEY, this.settings);
        this.applySettings();
        this.hideSettings();
        if (this.inSearchMode) {
            this.renderPlayerList(this.filteredPlayers);
        } else {
            this.renderPlayerList(this.currentPlayers);
        }
    }
    applySettings() {
        this.container.classList.toggle('left', this.settings.position === 'left');
        this.header.querySelector('.of-player-list-count')
            .style.display = this.settings.showPlayerCount ? 'inline-block' : 'none';
        this.debugInfo.style.display = this.settings.debug ? 'block' : 'none';
        this.startPolling();
    }
    updateSleepState() {
        const isLobby = location.href === ROOT_URL;
        if (!isLobby) {
            this.container.style.display = 'none';
            this.sleeping = true;
            this.stopPolling();
        } else {
            this.container.style.display = 'flex';
            if (this.sleeping) {
                this.sleeping = false;
                this.content.style.display = '';
                this.header.style.display = '';
                this.footer.style.display = '';
                this.startPolling();
            }
        }
    }
    observeURL() {
        let last = location.href;
        const check = () => {
            if (location.href !== last) {
                last = location.href;
                this.updateSleepState();
            }
            setTimeout(check, 200);
        };
        check();
    }
    initDebugKey() {
        window.addEventListener('keydown', e => {
            this.debugSequence.push(e.key.toUpperCase());
            if (this.debugSequence.length > 6) this.debugSequence.shift();
            if (this.debugSequence.join('') === 'SYNTAX') {
                this.settings.debug = !this.settings.debug;
                GM_setValue(STORAGE_KEY, this.settings);
                this.applySettings();
                console.log(`Debug mode ${this.settings.debug ? 'ON' : 'OFF'}`);
            }
        });
    }
    startPolling() {
        this.stopPolling();
        if (this.settings.autoRefresh && !this.sleeping) {
            this.pollInterval = setInterval(() => {
                this.updatePlayerList();
            }, POLL_INTERVAL);
            this.updatePlayerList();
        }
    }
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
    cleanup() {
        this.stopPolling();
        this.dragHandler.destroy();
        if (this.settingsModal) document.body.removeChild(this.settingsModal);
        if (this.snipeSession.rejoinInterval) clearInterval(this.snipeSession.rejoinInterval);
    }

    // ---- Keep checking lobby/join/leave for user manual actions ----

    monitorLobbyRejoin() {
        let wasInLobby = isInLobby();
        setInterval(() => {
            const nowInLobby = isInLobby();
            // If we joined manually, end snipe session
            if (this.snipeSession.active && nowInLobby && !this.snipeSession.joinedByScript) {
                this.stopSniping();
            }
            wasInLobby = nowInLobby;
        }, 800);
    }
}

class DragHandler {
    constructor(el, onMove) {
        this.el = el; this.onMove = onMove; this.isDragging = false;
        this.startX = 0; this.startY = 0; this.elX = 0; this.elY = 0;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp   = this.handleMouseUp.bind(this);
        this.animate         = this.animate.bind(this);
        el.addEventListener('mousedown', this.handleMouseDown);
    }
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX; this.startY = e.clientY;
        this.elX = this.el.offsetLeft; this.elY = this.el.offsetTop;
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        requestAnimationFrame(this.animate);
    }
    handleMouseMove(e) {
        if (!this.isDragging) return;
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        this.onMove(this.elX + dx, this.elY + dy);
    }
    handleMouseUp() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
    animate() { if (this.isDragging) requestAnimationFrame(this.animate);}
    destroy() {
        this.el.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
}

if (!window.__of_playerlist_ui) {
    window.__of_playerlist_ui = true;
    const ui = new PlayerListUI();
    window.addEventListener('beforeunload', () => ui.cleanup());
}
})();
