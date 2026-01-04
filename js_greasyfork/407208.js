// ==UserScript==
// @name         BK Banking
// @namespace    https://politicsandwar.com
// @version      1.4.0
// @description  Sleek BK accounts bar + deposit codes with robust parsing, hover popovers, and single-line auto-fit
// @author       Rin Misaki, Yosodog, LoneTechWiz
// @match        https://politicsandwar.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bkpw.net
// @downloadURL https://update.greasyfork.org/scripts/407208/BK%20Banking.user.js
// @updateURL https://update.greasyfork.org/scripts/407208/BK%20Banking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- CONFIG ----------
    const API_BASE = 'https://bkpw.net/api/v1';
    const API_TOKEN_KEY = 'bk_api_token';
    const UI_STATE_KEY = 'bk_ui_state'; // { bankBar:boolean, depositBox:boolean }
    const API_TOKEN_DEFAULT = ''; // optional default token
    const FETCH_TIMEOUT_MS = 15000;

    const RESOURCE_KEYS = ['coal', 'oil', 'uranium', 'lead', 'iron', 'bauxite', 'gas', 'munitions', 'steel', 'aluminum', 'food'];
    const MONEY_KEY = 'money';

    // ---------- STATE ----------
    let apiToken = '';
    const numberFmt = new Intl.NumberFormat('en-US');
    const initialUIState = {
        bankBar: true,
        depositBox: false
    };

    // ---------- UTIL ----------
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function withTimeout(promise, ms, err = new Error('Request timed out')) {
        let id;
        const timeout = new Promise((_, rej) => {
            id = setTimeout(() => rej(err), ms);
        });
        return Promise.race([promise, timeout]).finally(() => clearTimeout(id));
    }

    function loadUIState() {
        try {
            return {
                ...initialUIState,
                ...(JSON.parse(localStorage.getItem(UI_STATE_KEY) || '{}'))
            };
        } catch {
            return {
                ...initialUIState
            };
        }
    }

    function saveUIState(s) {
        localStorage.setItem(UI_STATE_KEY, JSON.stringify(s));
    }

    function fmt(x) {
        return numberFmt.format(Math.round(Number(x || 0)));
    }

    function sum(values) {
        return values.reduce((a, b) => a + (Number(b) || 0), 0);
    }

    async function apiGet(path) {
        const url = `${API_BASE}${path}?api_token=${encodeURIComponent(apiToken)}`;
        const res = await withTimeout(fetch(url, {
            credentials: 'omit'
        }), FETCH_TIMEOUT_MS);
        if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
        return res.json();
    }
    async function apiPost(path, body = {}) {
        const url = `${API_BASE}${path}`;
        const form = new URLSearchParams({
            ...body,
            api_token: apiToken
        });
        const res = await withTimeout(fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form
        }), FETCH_TIMEOUT_MS);
        if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
        return res.json();
    }

    // --- token persistence (GM storage with localStorage fallback) ---
    function getStoredToken() {
        try {
            if (typeof GM_getValue === 'function') return GM_getValue(API_TOKEN_KEY) || '';
        } catch {}
        return localStorage.getItem(API_TOKEN_KEY) || '';
    }

    function storeToken(t) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(API_TOKEN_KEY, t);
                return;
            }
        } catch {}
        localStorage.setItem(API_TOKEN_KEY, t);
    }
    async function ensureToken() {
        apiToken = getStoredToken() || API_TOKEN_DEFAULT || '';
        if (apiToken) return;
        apiToken = window.prompt('Enter your BK API token (https://bkpw.net):', '');
        if (!apiToken) {
            console.warn('[BK] No API token provided');
            return;
        }
        storeToken(apiToken);
    }

    function onInformationBarReady(cb) {
        const check = () => {
            const el = document.querySelector('.informationbar');
            if (el) cb(el);
        };
        check();
        const mo = new MutationObserver(() => check());
        mo.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Finds the first numeric text between this <img> and the next resource <img>
    function grabNumberAfterIcon($img) {
        const $siblings = $img.nextAll(); // all following siblings at this level
        let num = null;

        for (let i = 0; i < $siblings.length; i++) {
            const $el = $($siblings[i]);

            // If we hit the next resource icon, stop — the number for THIS icon should have appeared already
            const isNextIcon = $el.is('img') && String($el.attr('src') || '').includes('/img/resources/');
            if (isNextIcon) break;

            // Look for a number in this node
            const text = $el.text ? $el.text() : ($el[0]?.textContent || '');
            if (!text) continue;

            // Accept formats like "94,127", "$1,234,567", etc.
            const match = text.replace(/\s+/g, ' ').match(/[$]?\s*([0-9][0-9,.\s]*)/);
            if (match) {
                num = Number(match[1].replace(/[^0-9.-]/g, ''));
                if (Number.isFinite(num)) return Math.round(num);
            }
        }
        return 0;
    }

    function parseHeaderResources($bar) {
        // canonical keys we care about
        const keys = ['coal', 'oil', 'uranium', 'lead', 'iron', 'bauxite', 'gas', 'munitions', 'steel', 'aluminum', 'food', 'money'];
        const data = Object.fromEntries(keys.map(k => [k, 0]));

        // Map icon src to our key
        function iconToKey(src) {
            src = String(src || '').toLowerCase();
            if (src.includes('/resources/coal.png')) return 'coal';
            if (src.includes('/resources/oil.png')) return 'oil';
            if (src.includes('/resources/uranium.png')) return 'uranium';
            if (src.includes('/resources/lead.png')) return 'lead';
            if (src.includes('/resources/iron.png')) return 'iron';
            if (src.includes('/resources/bauxite.png')) return 'bauxite';
            if (src.includes('/resources/gasoline.png')) return 'gas';
            if (src.includes('/resources/munitions.png')) return 'munitions';
            if (src.includes('/resources/steel.png')) return 'steel';
            if (src.includes('/resources/aluminum.png')) return 'aluminum';
            // food is a special icon path in your HTML
            if (src.includes('/icons/16/steak_meat.png') || src.includes('/resources/food.png')) return 'food';
            return null;
        }

        // Find all anchor tags that contain an icon we care about OR the money anchor
        const anchors = Array.from($bar.find('a')).filter(a => {
            const img = a.querySelector('img');
            const isMoney = a.querySelector('b')?.textContent?.trim() === '$';
            if (isMoney) return true;
            if (!img) return false;
            return !!iconToKey(img.getAttribute('src'));
        });

        // For each anchor, gather text nodes until the next anchor, then parse number
        anchors.forEach((a, idx) => {
            // Determine key
            let key = 'money';
            const img = a.querySelector('img');
            if (img) {
                key = iconToKey(img.getAttribute('src')) || key;
            } else {
                // money anchor has <b>$</b> inside
                const isMoney = a.querySelector('b')?.textContent?.trim() === '$';
                if (!isMoney) return; // unknown; skip
            }

            // Walk DOM siblings after this anchor up to (but not including) the next anchor
            let text = '';
            let node = a.nextSibling;
            const stopAt = anchors[idx + 1] || null; // stop when hitting the next <a>
            while (node && node !== stopAt) {
                if (node.nodeType === Node.TEXT_NODE) {
                    text += node.textContent || '';
                }
                // if we reach another <a> (some themes might insert extra anchors), stop
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') break;
                node = node.nextSibling;
            }

            // Extract first number like "94,127" or "$ 1,234,567"
            const match = String(text).match(/([0-9][0-9,.\s]*)/);
            if (match) {
                const val = Number(match[1].replace(/[^0-9.-]/g, ''));
                if (Number.isFinite(val)) data[key] = Math.round(val);
            }
        });

        return data;
    }


    // ---------- STYLES & TOOLTIPS ----------
    function injectStyles() {
        if (document.getElementById('bk-banking-styles')) return;
        const css = `
      :root { --bk-bg:#2a2a8f; --bk-btn:#1f1f6b; --bk-btn-hover:#2b2ba1; }
      .bk-toolbar {
        width:100%; background:var(--bk-bg); color:#fff; padding:6px 10px;
        display:flex; align-items:center; justify-content:space-between; gap:10px;
        border-radius:10px; box-shadow:0 4px 14px rgba(0,0,0,.18); margin-top:4px;
        overflow:hidden;
      }
      .bk-left { display:flex; align-items:center; gap:8px; flex:0 0 auto; }
      .bk-right-wrap { flex:1 1 auto; overflow:visible; }
      .bk-right {
        display:flex; align-items:center; gap:8px;
        flex-wrap: nowrap; white-space:nowrap;
        transform-origin: left center;  /* enables smooth scale fit */
      }
      .bk-btn {
        background:var(--bk-btn); color:#fff; padding:8px 12px; border:none; border-radius:8px; cursor:pointer;
        font-weight:600; line-height:1; transition:transform .05s ease, background .15s ease, opacity .15s ease;
      }
      .bk-btn:hover { background:var(--bk-btn-hover); }
      .bk-btn:active { transform:translateY(1px); }
      .bk-chip {
        display:inline-flex; align-items:center; gap:6px; font-size:12px; line-height:1;
        background:rgba(255,255,255,.08); padding:4px 8px; border-radius:999px;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);
      }
      .bk-chip img { width:16px; height:16px; filter: drop-shadow(0 1px 1px rgba(0,0,0,.2)); }
      .bk-badge {
        padding:4px 8px; border-radius:999px; background:rgba(255,255,255,.18); font-size:12px; font-weight:700;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);
      }
      .bk-box {
        position:fixed; top:64px; right:10px; z-index:1000; background:#fff; color:#111;
        padding:12px; border:1px solid #e5e5e5; width: 320px; border-radius:10px;
        box-shadow:0 8px 24px rgba(0,0,0,.18);
      }
      .bk-box h3 { margin:0 0 8px; font-size:14px; }
      .bk-account { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0; }
      .bk-copy { cursor:pointer; text-decoration:underline; }
      .bk-muted { opacity:.75; }
      .bk-toast { position:fixed; bottom:16px; right:16px; background:#1f1f6b; color:#fff; padding:10px 12px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.25); z-index: 1001; }
      .bk-tip { position: fixed; z-index: 1002; pointer-events: none; background: #111; color: #fff; padding:8px 10px; border-radius:8px; font-size:12px; box-shadow: 0 6px 16px rgba(0,0,0,.28); white-space: nowrap; opacity: 0; transform: translateY(6px); transition: opacity .08s ease, transform .08s ease; }
      .bk-tip.show { opacity: 1; transform: translateY(0); }
      .bk-tip .bk-tip-combined { font-weight: 800; }
      .bk-tip .bk-tip-row { opacity: .85; }
    `;
        const style = document.createElement('style');
        style.id = 'bk-banking-styles';
        style.textContent = css;
        document.head.appendChild(style);
        if (!document.getElementById('bk-tip-el')) {
            const tip = document.createElement('div');
            tip.id = 'bk-tip-el';
            tip.className = 'bk-tip';
            document.body.appendChild(tip);
        }
    }

    function showToast(msg) {
        const el = document.createElement('div');
        el.className = 'bk-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1800);
    }

    function bindTooltips() {
        const tip = document.getElementById('bk-tip-el');
        let tipVisible = false;

        $(document).on('mouseenter', '[data-bk-tip]', function() {
            const t = $(this).data('bkTip');
            if (!t) return;
            tip.innerHTML = `
        <div class="bk-tip-combined">Combined: ${fmt(t.combined)}</div>
        <div class="bk-tip-row">Bank: ${fmt(t.bank)} • On-hand: ${fmt(t.onhand)}</div>
      `;
            tip.classList.add('show');
            tipVisible = true;
        });
        $(document).on('mousemove', '[data-bk-tip]', function(e) {
            if (!tipVisible) return;
            const pad = 14;
            let x = e.clientX + pad,
                y = e.clientY + pad;
            const rect = tip.getBoundingClientRect(),
                vw = window.innerWidth,
                vh = window.innerHeight;
            if (x + rect.width + 10 > vw) x = vw - rect.width - 10;
            if (y + rect.height + 10 > vh) y = vh - rect.height - 10;
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        });
        $(document).on('mouseleave', '[data-bk-tip]', function() {
            tip.classList.remove('show');
            tipVisible = false;
        });
    }

    function buildChipHTML(key, src, bankAmount) {
        return `
      <span class="bk-chip" data-key="${key}">
        <img alt="${key}" src="${src}"><span class="bk-num">${fmt(bankAmount)}</span>
      </span>
    `;
    }

    // --- one-line auto-fit (no scroll, no wrap) ---
    function fitOneLine() {
        const wrap = document.querySelector('.bk-right-wrap');
        const row = document.querySelector('.bk-right');
        if (!wrap || !row) return;

        // reset scale then measure
        row.style.transform = 'scale(1)';
        // margin/padding buffer to keep a little breathing room
        const buffer = 6;
        const available = wrap.clientWidth - buffer;
        const needed = row.scrollWidth;

        const scale = Math.min(1, available / Math.max(needed, 1));
        row.style.transform = `scale(${scale})`;
    }

    // Observe size changes and refit
    function startFitObserver() {
        const wrap = document.querySelector('.bk-right-wrap');
        if (!wrap) return;
        const ro = new ResizeObserver(() => fitOneLine());
        ro.observe(wrap);
        window.addEventListener('resize', fitOneLine);
        // slight delay to catch fonts/images
        setTimeout(fitOneLine, 50);
        setTimeout(fitOneLine, 300);
    }

    function renderToolbar($bar, totals, combined, moneyCombined, totalValue, uiState, headerOnHand) {
        $('.bk-toolbar').remove();

        const resIcons = {
            coal: 'https://politicsandwar.com/img/resources/coal.png',
            oil: 'https://politicsandwar.com/img/resources/oil.png',
            uranium: 'https://politicsandwar.com/img/resources/uranium.png',
            lead: 'https://politicsandwar.com/img/resources/lead.png',
            iron: 'https://politicsandwar.com/img/resources/iron.png',
            bauxite: 'https://politicsandwar.com/img/resources/bauxite.png',
            gas: 'https://politicsandwar.com/img/resources/gasoline.png',
            munitions: 'https://politicsandwar.com/img/resources/munitions.png',
            steel: 'https://politicsandwar.com/img/resources/steel.png',
            aluminum: 'https://politicsandwar.com/img/resources/aluminum.png',
            food: 'https://politicsandwar.com/img/resources/food.png',
            money: 'https://politicsandwar.com/img/resources/money.png'
        };

        const chips = RESOURCE_KEYS.map(k => buildChipHTML(k, resIcons[k], totals[k]))
            .join('') + buildChipHTML('money', resIcons.money, totals.money);

        const html = `
      <div class="bk-toolbar" role="region" aria-label="BK Banking">
        <div class="bk-left">
          <button class="bk-btn" id="bk-toggle">${uiState.bankBar ? 'Hide' : 'Show'} Bank Data</button>
          <button class="bk-btn" id="bk-pig" aria-label="Open Deposit Code Generator" title="Deposit Code Generator">🐷</button>
        </div>
        <div class="bk-right-wrap">
          <div class="bk-right">
            ${chips}
            <span class="bk-badge" title="Total value of all cash and resources">$${fmt(totalValue)}</span>
          </div>
        </div>
      </div>
    `;
        $bar.append(html);

        // Visibility
        $('.bk-right-wrap').toggle(uiState.bankBar);

        // Tooltip data
        RESOURCE_KEYS.forEach(k => {
            const $chip = $(`.bk-chip[data-key="${k}"]`);
            $chip.attr('data-bk-tip', '1');
            $chip.data('bkTip', {
                bank: totals[k] || 0,
                onhand: headerOnHand[k] || 0,
                combined: combined[k] || 0
            });
        });
        const $moneyChip = $('.bk-chip[data-key="money"]');
        $moneyChip.attr('data-bk-tip', '1');
        $moneyChip.data('bkTip', {
            bank: totals.money || 0,
            onhand: headerOnHand.money || 0,
            combined: moneyCombined || 0
        });

        // Buttons
        $('#bk-toggle').on('click', () => {
            const s = loadUIState();
            s.bankBar = !s.bankBar;
            saveUIState(s);
            $('.bk-right-wrap').toggle(s.bankBar);
            $('#bk-toggle').text(s.bankBar ? 'Hide Bank Data' : 'Show Bank Data');
            fitOneLine();
        });
        $('#bk-pig').on('click', () => {
            const s = loadUIState();
            s.depositBox = !s.depositBox;
            saveUIState(s);
            $('#bk-deposit-box').toggle(s.depositBox);
        });

        // ensure single-line fit
        startFitObserver();
    }

    function renderDepositBox(accounts, uiState) {
        $('#bk-deposit-box').remove();
        const box = document.createElement('div');
        box.id = 'bk-deposit-box';
        box.className = 'bk-box';
        box.style.display = uiState.depositBox ? 'block' : 'none';
        box.innerHTML = `
      <h3>Deposit Code Generator</h3>
      <div id="bk-accounts">${accounts && accounts.length ? '' : '<div class="bk-muted">No accounts found.</div>'}</div>
    `;
        document.body.appendChild(box);

        const $container = $('#bk-accounts');
        (accounts || []).forEach(acc => {
            const row = $(`
        <div class="bk-account" data-id="${acc.id}">
          <div class="bk-name" title="${acc.name}">${acc.name}</div>
          <button class="bk-btn bk-gen">Generate</button>
        </div>
      `);
            $container.append(row);
            row.find('.bk-gen').on('click', async () => {
                const $btn = row.find('.bk-gen');
                $btn.prop('disabled', true).text('Working…');
                try {
                    const resp = await apiPost(`/user/accounts/${acc.id}/deposit`);
                    const code = Array.isArray(resp) && resp[0] && resp[0].code ? resp[0].code : '';
                    if (!code) {
                        row.append(`<div class="bk-muted">No code returned</div>`);
                    } else {
                        const codeEl = $(`<div>Code: <span class="bk-copy" title="Click to copy">${code}</span></div>`);
                        codeEl.find('.bk-copy').on('click', async () => {
                            try {
                                await navigator.clipboard.writeText(code);
                                showToast('Copied deposit code');
                            } catch {
                                showToast('Copy failed');
                            }
                        });
                        row.append(codeEl);
                    }
                } catch (e) {
                    row.append(`<div class="bk-muted">Error: ${String(e.message || e)}</div>`);
                } finally {
                    $btn.prop('disabled', false).text('Generate');
                }
            });
        });
    }

    // ---------- MAIN ----------
    async function run($infoBar) {
        await ensureToken();
        if (!apiToken) return;
        injectStyles();
        bindTooltips();

        const uiState = loadUIState();
        try {
            const [accounts, prices] = await Promise.all([apiGet('/user/accounts'), apiGet('/trade/prices')]);

            const bankTotals = Object.fromEntries([...RESOURCE_KEYS, MONEY_KEY].map(k => [k, 0]));
            for (const a of accounts || []) {
                for (const k of RESOURCE_KEYS) bankTotals[k] += Math.round(Number(a[k] || 0));
                bankTotals[MONEY_KEY] += Math.round(Number(a[MONEY_KEY] || 0));
            }

            const header = parseHeaderResources($infoBar);

            const combined = Object.fromEntries(RESOURCE_KEYS.map(k => [k, bankTotals[k] + header[k]]));
            const moneyCombined = bankTotals[MONEY_KEY] + (header[MONEY_KEY] || 0);

            const resourceValue = sum(RESOURCE_KEYS.map(k => (Number(prices[k] || 0) * (combined[k] || 0))));
            const totalValue = resourceValue + moneyCombined;

            renderToolbar($infoBar, bankTotals, combined, moneyCombined, totalValue, uiState, header);
            renderDepositBox(accounts, uiState);
        } catch (e) {
            const err = document.createElement('div');
            err.className = 'bk-toolbar';
            err.innerHTML = `<div class="bk-left"><strong>BK Banking:</strong> <span class="bk-muted">Error loading data</span></div><div class="bk-right-wrap"><div class="bk-right bk-muted">${String(e.message||e)}</div></div>`;
            $infoBar.append(err);
            console.error('[BK] Load error:', e);
        }
    }

    $(function() {
        onInformationBarReady(($el) => {
            if (!$el || $el.classList?.contains('bk-wired')) return;
            $el.classList?.add('bk-wired');
            run($($el));
        });
    });
})();