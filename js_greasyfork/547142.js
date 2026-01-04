// ==UserScript==
// @name         Faction HUB
// @namespace    http://tampermonkey.net/
// @version      3.022
// @license MIT
// @description  Track rations, influence and deposits of your Faction Members using the official API. No DOM scraping; auto backfill; configurable goals, pace-aware & celebrations.
// @match        *://*.zed.city/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547142/Faction%20HUB.user.js
// @updateURL https://update.greasyfork.org/scripts/547142/Faction%20HUB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* eslint-disable no-multi-spaces */

    // ─────────────────────────────────────────────────────────────────────────────
    // Config / Storage keys
    // ─────────────────────────────────────────────────────────────────────────────
    const API = 'https://api.zed.city';
    const KEYS = {
        MEMBERS: 'zedcity_faction_members',
        HISTORY: 'zedcity_member_history',
        RATIONS: 'zedcity_ration_logs',
        INFL: 'zedcity_influence_logs',
        DEPOSITS: 'zedcity_deposit_logs',
        META: 'fh_meta',
        GOALS: 'fh_goals',                // numeric goals kept for back-compat (weekly only)
        SETTINGS: 'fh_settings',          // rich settings container
        MEMBERS_LAST_GOOD: 'fh_members_last_good',
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Sync Tuning and Data Tuning
    // ─────────────────────────────────────────────────────────────────────────────
    const RETAIN_DAYS = 365;
    const LOCK_KEY = 'fh_lock_ts';
    const LOCK_TTL_MS = 25000;              // 25s lock to avoid multi-tab double runs
    const CATCHUP_MAX_PER_RUN = 3;          // acceptance test: fresh install backfills 3 pages per run
    const MEMBERS_REFRESH_MS = 6 * 3600 * 1000; // refresh members at most every 6h

    // v3.01 — API Statistics (10s buckets, last 10min, multi-tab)
    const TAB_ID = Math.random().toString(36).slice(2);
    const APISTATS = {
        total: 0, notif: 0, members: 0, otherFaction: 0, errors: 0,
        buckets: new Array(60).fill(0),
        lastTick: Math.floor(Date.now() / 10000) // 10s ticks
    };
    const SUPPORT_BC = typeof BroadcastChannel !== 'undefined';
    const apiChan = SUPPORT_BC ? new BroadcastChannel('fh_api_stats') : null;
    const STORAGE_EVENT_KEY = 'fh_api_stats_evt';
    const SEEN_EVT = new Set();

    function tick10s(ts = Date.now()) { return Math.floor(ts / 10000); }
    function ensureFresh(toTick) {
        const last = APISTATS.lastTick;
        if (toTick - last >= 60) {
            APISTATS.buckets.fill(0);
        } else if (toTick > last) {
            for (let t = last + 1; t <= toTick; t++) APISTATS.buckets[t % 60] = 0;
        }
        APISTATS.lastTick = toTick;
    }
    function applyIncrement(delta) {
        const toTick = tick10s(delta.ts || Date.now());
        ensureFresh(toTick);
        APISTATS.total  += delta.total  || 0;
        APISTATS.notif  += delta.notif  || 0;
        APISTATS.members+= delta.members|| 0;
        APISTATS.otherFaction += delta.otherFaction || 0;
        APISTATS.errors += delta.errors || 0;
        APISTATS.buckets[toTick % 60] += delta.total || 0;
    }
    function publishIncrement(delta) {
        delta.ts = Date.now();
        delta.id = `${TAB_ID}:${delta.ts}:${Math.random().toString(36).slice(2)}`;
        delta.sender = TAB_ID;
        if (apiChan) apiChan.postMessage(delta);
        else localStorage.setItem(STORAGE_EVENT_KEY, JSON.stringify(delta));
    }
    apiChan && apiChan.addEventListener('message', ev => {
        const m = ev.data; if (!m || m.sender === TAB_ID || SEEN_EVT.has(m.id)) return;
        SEEN_EVT.add(m.id); applyIncrement(m);
    });
    window.addEventListener('storage', e => {
        if (e.key !== STORAGE_EVENT_KEY || !e.newValue) return;
        try {
            const m = JSON.parse(e.newValue);
            if (!m || m.sender === TAB_ID || SEEN_EVT.has(m.id)) return;
            SEEN_EVT.add(m.id); applyIncrement(m);
        } catch {}
    });
    function bumpApiStats(url, ok = true) {
        const toTick = tick10s(); ensureFresh(toTick);
        const delta = {
            total: 1,
            notif: /getFactionNotifications/i.test(url) ? 1 : 0,
            members: /getFactionMembers/i.test(url) ? 1 : 0,
            otherFaction: (/\/getFaction/i.test(url) && !/getFaction(Notifications|Members)/i.test(url)) ? 1 : 0,
            errors: ok ? 0 : 1
        };
        // local + broadcast to other tabs
        applyIncrement({ ...delta, ts: Date.now() });
        publishIncrement(delta);
    }



    // ─────────────────────────────────────────────────────────────────────────────
    // Small helpers (UTC-safe dates, clamps, pct)
    // ─────────────────────────────────────────────────────────────────────────────
    const clamp = (v, lo = 0, hi = Infinity) => Math.max(lo, Math.min(hi, v));
    const pct   = (num, den) => den > 0 ? Math.round((num / den) * 100) : 0;
    const ymd   = (s) => new Date(s + 'T00:00:00Z');       // 'YYYY-MM-DD' → UTC midnight
    const ymdEnd= (s) => new Date(s + 'T23:59:59Z');       // end-of-day UTC

    const cutoffMs  = Date.now() - RETAIN_DAYS * 24 * 3600 * 1000;
    const epochToIso= (sec) => new Date(sec * 1000).toISOString();
    const toAbs     = (u) => { try { return new URL(u, location.origin).href; } catch { return String(u || ''); } };

    function debounce(fn, ms = 120) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
    function todayStr() { return new Date().toISOString().split('T')[0]; }
    function dayIndexFromStr(s) { const [y, m, d] = s.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000); }

    function currentStreakFromSet(idxSet, today = todayStr(), carryToday = true) {
        const t = dayIndexFromStr(today);
        const start = idxSet.has(t) ? t : (carryToday && idxSet.has(t - 1) ? t - 1 : null);
        if (start === null) return 0;
        let idx = start, streak = 0;
        while (idxSet.has(idx)) { streak++; idx--; }
        return streak;
    }
    function bestStreakFromSet(idxSet) {
        const arr = Array.from(idxSet).sort((a, b) => a - b);
        let best = 0, run = 0, prev = null;
        for (const v of arr) { run = (prev !== null && v === prev + 1) ? run + 1 : 1; if (run > best) best = run; prev = v; }
        return best;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Safe storage helpers
    // ─────────────────────────────────────────────────────────────────────────────
    const STORE = {
        get(k, d = []) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
        del(k) { try { localStorage.removeItem(k); } catch {} }
    };
    const META = (function () { try { return JSON.parse(localStorage.getItem(KEYS.META)) || {}; } catch { return {}; } })();

    // If current members is empty, restore last good snapshot (if any)
    try {
        const cur = STORE.get(KEYS.MEMBERS, []);
        const lastGood = STORE.get(KEYS.MEMBERS_LAST_GOOD, []);
        if ((!cur || cur.length === 0) && lastGood && lastGood.length > 0) {
            STORE.set(KEYS.MEMBERS, lastGood);
        }
    } catch {}

    function getCurrentMembers() {
        const cur = STORE.get(KEYS.MEMBERS, []);
        if (Array.isArray(cur) && cur.length) return cur;
        const last = STORE.get(KEYS.MEMBERS_LAST_GOOD, []);
        if (Array.isArray(last) && last.length) {
            STORE.set(KEYS.MEMBERS, last);
            return last;
        }
        return [];
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Goals & Settings
    // ─────────────────────────────────────────────────────────────────────────────
    // Legacy goals loader (weekly only, monthly auto x4)
    function loadGoals() {
        const g = STORE.get(KEYS.GOALS, null);
        const def = { influence: { weekly: 2500 }, deposits: { weekly: 0 }, rations: { weekly: 5 } };
        if (!g || typeof g !== 'object') return def;
        return {
            influence: { weekly: Math.max(0, Number(g.influence?.weekly) || 2500) },
            deposits:  { weekly: Math.max(0, Number(g.deposits?.weekly)  || 0) },
            rations:   { weekly: Math.max(0, Number(g.rations?.weekly)   || 5) }
        };
    }
    function saveGoals(g) {
        STORE.set(KEYS.GOALS, {
            influence: { weekly: Math.max(0, Number(g.influence?.weekly) || 0) },
            deposits:  { weekly: Math.max(0, Number(g.deposits?.weekly)  || 0) },
            rations:   { weekly: Math.max(0, Number(g.rations?.weekly)   || 0) }
        });
    }
    const weeklyToMonthly = (w) => Math.round((Number(w) || 0) * 4);
    const weeklyToYearly  = (w) => Math.round((Number(w) || 0) * 52);

    // New settings (visuals, per-period toggles, missing lines, celebrations)
    function defaultSettings() {
        return {
            paceAware: true,            // scales goals to elapsed days inside current week/month (also join pro-rating aware)
            showPercent: true,

            ui: { minPanelHeight: 360 },

            progress: {
                mode: 'tricolor',         // 'tricolor' | 'bicolor' | 'none'
                overrides: {
                    influence: { enabled: true },
                    rations:   { enabled: true },
                    deposits:  { enabled: true }
                },
                showOn: {                 // where bars are shown globally (weekly unaffected; kept visible)
                    daily: true, monthly: true, yearly: true
                }
            },

            missing: {
                showOn: { daily: true, monthly: true, yearly: true },
                influenceEstimation: 'auto'   // 'auto' | 'store' | 'hospital' | 'farm'
            },

            celebrate: {
                starOnComplete: true,     // make name gold + add ⭐ at 100% of goal used by the bar (paced for week)
                goldShimmer120: true      // animate bar when ≥ 120%
            },

            api: {
                members: {
                    mode: 'perRefresh',              // 'perRefresh' | 'interval'
                    interval: { days: 0, hours: 6, minutes: 0 } // used when mode==='interval'
                }
            },

            deposits: {

                detailed: { enabled: false, rules: [] } // [{item:'Iron Bar', weekly:100}]
            }
        };
    }
    function loadSettings() {
        const saved = STORE.get(KEYS.SETTINGS, null);
        const base = defaultSettings();
        if (!saved || typeof saved !== 'object') return base;
        const out = { ...base, ...saved };
        out.ui = { ...base.ui, ...saved.ui };
        out.progress = { ...base.progress, ...(saved.progress || {}) };
        out.progress.overrides = { ...base.progress.overrides, ...(saved.progress?.overrides || {}) };
        out.progress.showOn = { ...base.progress.showOn, ...(saved.progress?.showOn || {}) };
        out.deposits = { ...base.deposits, ...(saved.deposits || {}) };
        out.deposits.detailed = { ...base.deposits.detailed, ...(saved.deposits?.detailed || {}) };
        out.missing = { ...base.missing, ...(saved.missing || {}) };
        out.missing.showOn = { ...base.missing.showOn, ...(saved.missing?.showOn || {}) };
        out.celebrate = { ...base.celebrate, ...(saved.celebrate || {}) };
        // NEW: API settings merge
        out.api = { ...base.api, ...(saved.api || {}) };
        out.api.members = { ...base.api.members, ...(saved.api?.members || {}) };
        out.api.members.interval = { ...base.api.members.interval, ...(saved.api?.members?.interval || {}) };
        return out;

    }
    function saveSettings(s) { STORE.set(KEYS.SETTINGS, s); }

    function effProgress(tabKey, settings) {
        const o = settings.progress?.overrides?.[tabKey] || {};
        return {
            enabled: (o.enabled !== undefined ? !!o.enabled : (settings.progress.mode !== 'none')),
            mode: (o.mode || settings.progress.mode || 'tricolor'),
            paceAware: (o.paceAware !== undefined ? !!o.paceAware : !!settings.paceAware),
            showPercent: (o.showPercent !== undefined ? !!o.showPercent : !!settings.showPercent),
            celebrateStar: (o.starOnComplete !== undefined ? !!o.starOnComplete : !!settings.celebrate?.starOnComplete),
            shimmer120:    (o.shimmer120    !== undefined ? !!o.shimmer120    : !!settings.celebrate?.goldShimmer120)
        };
    }

    // Migrations / schema versioning
    const SCHEMA_VERSION = 1;
    (function migrate() {
        const meta = STORE.get(KEYS.META, {});
        if ((meta.schemaVersion|0) >= SCHEMA_VERSION) return;
        // (no migrations needed today; scaffold left here)
        meta.schemaVersion = SCHEMA_VERSION;
        STORE.set(KEYS.META, meta);
    })();

    // ─────────────────────────────────────────────────────────────────────────────
    // API → storage (members, notifications)
    // ─────────────────────────────────────────────────────────────────────────────
    function upsertMembers(json) {
        if (!json || !Array.isArray(json.members)) return;
        const roles = json.roles || {};
        const arr = json.members;
        if (arr.length === 0) { console.debug('[Faction HUB] Ignoring empty getFactionMembers payload.'); return; }

        const mapped = arr.map(m => ({
            name: m.username || m.name || 'Unknown',
            role: m.role_name || m.role || roles[m.role_id]?.name || 'Member',
            level: m.level ?? null,
            online: !!m.online,
            id: m.id ?? null
        }));

        const prev = STORE.get(KEYS.MEMBERS, []);
        const hist = STORE.get(KEYS.HISTORY, []);
        const prevS = new Set(prev.map(x => x.name));
        const nextS = new Set(mapped.map(x => x.name));

        for (const m of mapped) {
            if (!prevS.has(m.name)) hist.push({ name: m.name, joined: new Date().toISOString(), left: null });
        }
        for (const m of prev) {
            if (!nextS.has(m.name)) {
                for (let i = hist.length - 1; i >= 0; i--) {
                    const h = hist[i];
                    if (h.name === m.name && !h.left) { h.left = new Date().toISOString(); break; }
                }
            }
        }

        STORE.set(KEYS.HISTORY, hist);
        STORE.set(KEYS.MEMBERS, mapped);
        STORE.set(KEYS.MEMBERS_LAST_GOOD, mapped);
        META.lastMembersAt = new Date().toISOString();
        localStorage.setItem(KEYS.META, JSON.stringify(META));
    }

    function addFromNotifications(list, stopAtFirstKnown = false) {
        if (!Array.isArray(list) || !list.length) return 0;

        const rations = STORE.get(KEYS.RATIONS, []);
        const infl    = STORE.get(KEYS.INFL, []);
        const deps    = STORE.get(KEYS.DEPOSITS, []);

        const rIDs = new Set(rations.map(x => `${x.name}|${x.item}|${x.amount}|${x.iso || x.date}`));
        const iIDs = new Set(infl.map(x    => `${x.name}|${x.amount}|${x.iso || x.date}`));
        const dIDs = new Set(deps.map(x    => `${x.name}|${x.item}|${x.amount}|${x.iso || x.date}`));

        let added = 0;

        outer: for (const n of list) {
            const type = n?.type;
            const d    = n?.data || {};
            const ts   = typeof n?.date === 'number' ? n.date : null;
            if (!ts) continue;
            if (ts * 1000 < cutoffMs) continue;

            const iso  = epochToIso(ts);
            const date = iso.slice(0, 10);
            const name = d.username || d.user || 'Unknown';

            if (type === 'faction_add_item') { // deposits
                const item = String(d.name || '').trim();
                const amount = Number(d.qty) || 0;
                const id = `${name}|${item}|${amount}|${iso}`;
                if (dIDs.has(id)) { if (stopAtFirstKnown) break outer; }
                else { deps.push({ name, amount, item, date, iso }); dIDs.add(id); added++; }

            } else if (type === 'faction_claim_rations') { // rations
                const items = Array.isArray(d.items) ? d.items : [];
                for (const it of items) {
                    const item = String(it.name || '').trim();
                    const amount = Number(it.qty) || 0;
                    const id = `${name}|${item}|${amount}|${iso}`;
                    if (rIDs.has(id)) { if (stopAtFirstKnown) break outer; }
                    else { rations.push({ name, amount, item, date, iso }); rIDs.add(id); added++; }
                }

            } else if (type === 'faction_raid') { // influence
                const amount = Math.floor(Number(d.influence) || 0);
                if (amount > 0) {
                    const id = `${name}|${amount}|${iso}`;
                    if (iIDs.has(id)) { if (stopAtFirstKnown) break outer; }
                    else { infl.push({ name, amount, date, iso }); iIDs.add(id); added++; }
                }
            }
        }

        const keepRecent = arr => arr.filter(e => new Date(e.iso || e.date).getTime() >= cutoffMs);
        STORE.set(KEYS.RATIONS,  keepRecent(rations));
        STORE.set(KEYS.INFL,     keepRecent(infl));
        STORE.set(KEYS.DEPOSITS, keepRecent(deps));

        return added;
    }


    function onFactionJSON(url, json) {
        const path = url.replace(/^https?:\/\/[^/]+/, '');
        if (/\/getFactionMembers/i.test(path)) {
            upsertMembers(json);
        } else if (/\/getFactionNotifications/i.test(path)) {
            const list = Array.isArray(json?.notify) ? json.notify : [];
            if (list.length) addFromNotifications(list);
        }
    }

    if (!XMLHttpRequest.prototype.__fh_patched__) {
        XMLHttpRequest.prototype.__fh_patched__ = true;
        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (m, u) { this._fh_url = toAbs(u); return _open.apply(this, arguments); };
        XMLHttpRequest.prototype.send = function (b) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState !== 4) return;
                try {
                    const url = this.responseURL || this._fh_url || '';
                    if (!/api\.zed\.city/i.test(url) || !/\/getFaction/i.test(url)) return;
                    bumpApiStats(url, this.status >= 200 && this.status < 300);
                    const ct = this.getResponseHeader('content-type') || '';
                    if (!ct.includes('application/json')) return;
                    const json = JSON.parse(this.responseText);
                    onFactionJSON(url, json);
                } catch {}
            });
            return _send.apply(this, arguments);
        };
    }

    if (!window.__fh_patched_fetch__) {
        window.__fh_patched_fetch__ = true;
        const _fetch = window.fetch;
        window.fetch = async function (...args) {
            const res = await _fetch.apply(this, args);
            try {
                const reqUrl = toAbs(args[0]?.url || args[0]);
                if (/api\.zed\.city/i.test(reqUrl) && /\/getFaction/i.test(reqUrl)) {
                    bumpApiStats(reqUrl, res.ok);
                    const clone = res.clone();
                    const ct = clone.headers.get('content-type') || '';
                    if (ct.includes('application/json')) {
                        const json = await clone.json().catch(() => null);
                        if (json) onFactionJSON(reqUrl, json);
                    }
                }
            } catch {}
            return res;
        };
    }

    // Active backfill
    async function fetchJSON(u) {
        const r = await fetch(u, { credentials: 'include' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return null;
        return r.json();
    }

    // v3.01 — Efficient sync (Only-new + Smart catch-up)
    let syncStarted = false;
    async function runSyncV301() {
        if (syncStarted) return;
        syncStarted = true;

        // Simple multi-tab lock
        const now = Date.now();
        const lockTs = Number(localStorage.getItem(LOCK_KEY) || '0');
        if (now - lockTs < LOCK_TTL_MS) { console.debug('[Faction HUB] Skip: another tab is syncing.'); return; }
        localStorage.setItem(LOCK_KEY, String(now));

        try {
            // Ensure META.catchup shape (auto-enable on fresh install)
            META.catchup = META.catchup || {};
            const preRunEmpty = (STORE.get(KEYS.RATIONS, []).length +
                                 STORE.get(KEYS.INFL, []).length +
                                 STORE.get(KEYS.DEPOSITS, []).length) === 0;
            if (typeof META.catchup.needed !== 'boolean') {
                META.catchup = { needed: preRunEmpty, nextPage: 2, consecutiveNoAdds: 0 };
            } else {
                META.catchup.nextPage = Math.max(2, Number(META.catchup.nextPage || 2));
                META.catchup.consecutiveNoAdds = Math.max(0, Number(META.catchup.consecutiveNoAdds || 0));
            }

            // Members refresh — default every page refresh; optional custom interval
            const settingsNow = loadSettings();
            const mode = settingsNow.api?.members?.mode || 'perRefresh';
            const iv = settingsNow.api?.members?.interval || { days:0, hours:6, minutes:0 };
            const intervalMs = ((Math.max(0, iv.days|0) * 24 + Math.max(0, iv.hours|0)) * 60 + Math.max(0, iv.minutes|0)) * 60 * 1000;

            let shouldFetchMembers = true;
            if (mode === 'interval') {
                const lastMemAt = Date.parse(META.lastMembersAt || 0) || 0;
                shouldFetchMembers = !lastMemAt || (intervalMs <= 0) || (Date.now() - lastMemAt >= intervalMs);
            }

            if (shouldFetchMembers) {
                const mem = await fetchJSON(`${API}/getFactionMembers`).catch(() => null);
                if (mem && Array.isArray(mem.members) && mem.members.length > 0) {
                    upsertMembers(mem); // sets META.lastMembersAt internally
                } else {
                    // if the API answered (even error JSON), set timestamp to avoid hammering on interval mode
                    META.lastMembersAt = new Date().toISOString();
                }
            }

            // Step 1: page 1 only-new (stop at first known)
            const page1 = await fetchJSON(`${API}/getFactionNotifications?page=1`).catch(() => null);
            if (page1 && page1.error) {
                console.log(`[Faction HUB] Page 1 skipped: ${page1.error} (code ${page1.errorCode ?? '-'})`);
                return; // leave catchup state unchanged; will try next run
            }
            const page1List = Array.isArray(page1?.notify) ? page1.notify : [];
            const addedP1 = addFromNotifications(page1List, true);
            console.log(`[Faction HUB] Page 1: added=${addedP1}`);

            // Catch-up only when appropriate:
            // - normal runs: only if page 1 added nothing and catch-up is needed
            // - fresh install: continue regardless (so we backfill immediately)
            let didBacklog = false;
            const shouldBacklogNow =
                  (addedP1 === 0 && META.catchup.needed) || preRunEmpty;

            if (shouldBacklogNow) {
                let pagesDone = 0;
                let page = META.catchup.nextPage;
                let endSignal = false;

                while (pagesDone < CATCHUP_MAX_PER_RUN && !endSignal) {
                    const json = await fetchJSON(`${API}/getFactionNotifications?page=${page}`).catch(() => null);
                    const list = Array.isArray(json?.notify) ? json.notify : [];

                    if (!list.length) { // zero-length page
                        endSignal = true;
                        break;
                    }

                    const added = addFromNotifications(list); // normal dedupe
                    console.log(`[Faction HUB] Catch-up p${page}: added=${added}`);

                    if (added === 0) {
                        META.catchup.consecutiveNoAdds = (META.catchup.consecutiveNoAdds || 0) + 1;
                        if (META.catchup.consecutiveNoAdds >= 2) endSignal = true;
                    } else {
                        META.catchup.consecutiveNoAdds = 0;
                    }

                    META.catchup.nextPage = page + 1; // advance pointer after each page
                    pagesDone++;
                    page++;
                }

                if (endSignal) {
                    META.catchup.needed = false;
                    META.catchup.nextPage = 2;
                    META.catchup.consecutiveNoAdds = 0;
                    console.log('[Faction HUB] Catch-up complete — end signal reached.');
                } else {
                    didBacklog = true; // we processed some pages and will resume later if still needed
                }
            }

            META.lastBackfillAt = new Date().toISOString();
            localStorage.setItem(KEYS.META, JSON.stringify(META));
            console.log(`[Faction HUB] Sync done. p1.added=${addedP1}, catchup=${META.catchup.needed ? 'on' : 'off'}${didBacklog ? ', did backlog' : ''}.`);
        } catch (e) {
            // Network error / 429: keep catch-up state and nextPage as-is
            console.warn('[Faction HUB] Sync failed (kept catch-up state):', e);
        } finally {
            // release lock (TTL is also a safety)
            try { localStorage.removeItem(LOCK_KEY); } catch {}
        }
    }

    // Schedule like before
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(runSyncV301, 700), { once: true });
    } else {
        setTimeout(runSyncV301, 700);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Helpers: period bounds & pace ratios, raid averages
    // ─────────────────────────────────────────────────────────────────────────────
    function boundsFor(selectedYear, selectedMonth) {
        // WEEKLY: selectedMonth is "YYYY-MM-DD_YYYY-MM-DD"
        if (selectedYear === 'WEEKLY' && selectedMonth && selectedMonth.includes('_')) {
            const [s, e] = selectedMonth.split('_');
            return { start: ymd(s), end: ymdEnd(e), type: 'week' };
        }
        if (typeof selectedYear === 'string' && selectedYear !== 'DAILY' && selectedYear !== 'WEEKLY') selectedYear = parseInt(selectedYear, 10);
        if (typeof selectedYear === 'number') {
            if (selectedMonth) {
                const y = selectedYear, m = parseInt(selectedMonth, 10);
                const start = new Date(Date.UTC(y, m - 1, 1));
                const end = new Date(Date.UTC(y, m, 0, 23, 59, 59));
                return { start, end, type: 'month', year: y, month: m };
            } else {
                const y = selectedYear;
                const start = new Date(Date.UTC(y, 0, 1));
                const end = new Date(Date.UTC(y, 11, 31, 23, 59, 59));
                return { start, end, type: 'year', year: y };
            }
        }
        return null;
    }
    // Whole days between (exclusive of +1). Callers add +1 when they need inclusive ranges.
    function daysBetween(a, b) {
        const A = (a instanceof Date) ? a : new Date(a);
        const B = (b instanceof Date) ? b : new Date(b);
        const ms = (B - A);
        if (!Number.isFinite(ms)) return 0;
        return Math.max(0, Math.floor(ms / 86400000));
    }

    function getHistory(name) {
        const hist = STORE.get(KEYS.HISTORY, []);
        return hist.filter(h => h.name === name);
    }

    function membershipDaysInRange(name, start, end) {
        const now = new Date();
        start = (start instanceof Date) ? start : new Date(start);
        end   = (end   instanceof Date) ? end   : (end ? new Date(end) : now);

        const periods = getHistory(name);
        const totalDays = daysBetween(start, end) + 1;

        if (!periods.length) {
            const clipEnd = now < end ? now : end;
            const elapsed = Math.max(0, daysBetween(start, clipEnd) + 1);
            return { present: totalDays, total: totalDays, elapsedPresent: elapsed };
        }

        let present = 0;
        for (const p of periods) {
            const j = new Date(p.joined || p.start || start);
            const l = p.left ? new Date(p.left) : (p.end ? new Date(p.end) : now);
            const s = (j > start ? j : start);
            const e = (l < end ? l : end);
            if (e >= s) present += (daysBetween(s, e) + 1);
        }
        const today = new Date();
        const clipEnd = (today < end ? today : end);
        let elapsedPresent = 0;
        for (const p of periods) {
            const j = new Date(p.joined || p.start || start);
            const l = p.left ? new Date(p.left) : (p.end ? new Date(p.end) : now);
            const s = (j > start ? j : start);
            const e = (l < clipEnd ? l : clipEnd);
            if (e >= s) elapsedPresent += (daysBetween(s, e) + 1);
        }
        return { present: Math.max(0, present), total: Math.max(1, totalDays), elapsedPresent };
    }

    // Unified helpers for period key, goal sizing and pacing (week-only)
    const periodKeyOf = (selectedYear, bounds) =>
    selectedYear === 'DAILY' ? 'daily' :
    bounds?.type === 'month' ? 'monthly' :
    bounds?.type === 'year'  ? 'yearly' : null;

    const goalForPeriod = (weekly, bounds) => {
        if (!bounds) return 0;
        if (bounds.type === 'week')  return Math.max(0, Number(weekly)||0);
        if (bounds.type === 'month') return weeklyToMonthly(weekly);
        if (bounds.type === 'year')  return weeklyToYearly(weekly);
        return 0;
    };

    const pacedTarget = (fullGoal, bounds, paceOn) => {
        if (!(paceOn && (bounds?.type === 'week' || bounds?.type === 'month')) || fullGoal <= 0) return fullGoal;
        const total = daysBetween(bounds.start, bounds.end) + 1;
        const clip  = new Date() < bounds.end ? new Date() : bounds.end;
        const elapsed = clamp(daysBetween(bounds.start, clip) + 1, 0, total);
        return Math.max(1, Math.round(fullGoal * (elapsed / total)));
    };

    const displayTarget = (fullGoal, bounds, eff) =>
    pacedTarget(fullGoal, bounds, eff.paceAware);

    // Learn influence averages by raid type from last 100 raid "clusters"
    function learnRaidAverages(influenceLogs) {
        const byIso = new Map();
        for (const l of influenceLogs) {
            const key = l.iso || (l.date + 'T00:00:00Z');
            if (!byIso.has(key)) byIso.set(key, []);
            byIso.get(key).push(l);
        }
        const clusters = Array.from(byIso.entries()).map(([iso, arr]) => {
            const participants = arr.length;
            const perMemberAvg = arr.reduce((s, a) => s + (a.amount || 0), 0) / Math.max(1, participants);
            let type = 'unknown';
            if (participants === 4) type = 'store';
            else if (participants === 3) type = 'hospital';
            else if (participants === 2) type = 'farm';
            const t = new Date(iso);
            return { iso, t, participants, type, perMemberAvg };
        }).sort((a, b) => b.t - a.t).slice(0, 100);

        const sums = { store: { sum:0, n:0 }, hospital: { sum:0, n:0 }, farm: { sum:0, n:0 }, unknown:{ sum:0, n:0 } };
        for (const c of clusters) {
            sums[c.type].sum += c.perMemberAvg;
            sums[c.type].n += 1;
        }

        function avgFor(t){ return sums[t].n ? Math.round(sums[t].sum / sums[t].n) : 0; }
        const out = {
            store: avgFor('store'),
            hospital: avgFor('hospital'),
            farm: avgFor('farm'),
            unknown: avgFor('unknown'),
            dominant: (['store','hospital','farm','unknown'].sort((a,b)=>sums[b].n - sums[a].n)[0]) || 'store'
        };
        if (!out.store && !out.hospital && !out.farm) {
            const mean = influenceLogs.length ? Math.round(influenceLogs.reduce((s,l)=>s+(l.amount||0),0) / influenceLogs.length) : 1000;
            out.store = out.hospital = out.farm = mean;
            out.dominant = 'store';
        }
        return out;
    }
    let FH_ESC_HANDLER = null;
    let ACTIVE_VIEW = null; // tracks the open settings subpage


    // ─────────────────────────────────────────────────────────────────────────────
    // SPA navigation watcher
    // ─────────────────────────────────────────────────────────────────────────────
    let bodyObserver = null;
    (function () {
        const fire = () => { onPageChange(location.href); };
        const wrap = (type) => {
            const orig = history[type];
            return function (...args) {
                const ret = orig.apply(this, args);
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            };
        };
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', fire);
        fire();
    })();

    function insertStatisticsTabInto(tabBar) {
        if (tabBar.querySelector('#open-stats-tab')) return;
        const statsTab = document.createElement('a');
        statsTab.id = 'open-stats-tab';
        statsTab.className = 'q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-focusable q-hoverable cursor-pointer';
        statsTab.tabIndex = 0;
        statsTab.role = 'tab';
        statsTab.innerHTML = `
      <div class="q-focus-helper" tabindex="-1"></div>
      <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
        <div class="q-tab__label">Statistics</div>
      </div>
      <div class="q-tab__indicator absolute-bottom text-transparent"></div>
    `;
        statsTab.onclick = () => {
            const panel = document.getElementById('stats-panel');
            if (panel) panel.remove();
            else renderStatisticsPanel(statsTab);
        };
        tabBar.appendChild(statsTab);
    }

    function monitorTabBar() {
        const tabBars = document.querySelectorAll('.q-tabs__content');
        for (const tabBar of tabBars) {
            const tabEls = tabBar.querySelectorAll('.q-tab__label');
            const tabTexts = Array.from(tabEls).map(el => el.textContent.trim().toLowerCase());
            const baseIndex = tabTexts.findIndex(text => text.includes('base'));
            const likelyActivityTab = tabTexts.findIndex((text, i) =>
                                                         i !== baseIndex && (text.includes('activity') || text.includes('logs') || text.length < 6)
                                                        );
            const isValid = baseIndex >= 0 && likelyActivityTab >= 0;
            if (isValid) {
                insertStatisticsTabInto(tabBar);
                const tabObserver = new MutationObserver(debounce(() => insertStatisticsTabInto(tabBar), 120));
                tabObserver.observe(tabBar, { childList: true, subtree: true });
                break;
            }
        }
    }


    function onPageChange(url) {
        closeStatisticsPanel();
        if (/\/(faction(\/.*)?|raids)$/.test(url)) {
            monitorTabBar();
            if (bodyObserver) bodyObserver.disconnect();
            bodyObserver = new MutationObserver(debounce(() => monitorTabBar(), 120));
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            if (bodyObserver) { bodyObserver.disconnect(); bodyObserver = null; }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PANEL + CONTENT
    // ─────────────────────────────────────────────────────────────────────────────

    function renderStatisticsPanel(anchorTab) {
        const existing = document.getElementById('stats-panel');
        if (existing) return;

        const settings = loadSettings();

        const panel = document.createElement('div');
        panel.id = 'stats-panel';
        Object.assign(panel.style, {
            position: 'absolute',
            backgroundColor: '#1c1c1c',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            zIndex: 100001,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            maxHeight: '80vh',
            minWidth: '400px',
            minHeight: (settings.ui?.minPanelHeight || 360) + 'px',
            transform: 'translateY(10px)',
            opacity: '0',
            transition: 'transform .18s ease, opacity .18s ease',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });

        document.body.appendChild(panel);
        if (!document.getElementById('fh-styles')) {
            const s = document.createElement('style');
            s.id = 'fh-styles';
            s.textContent = `
        #stats-panel .fh-row { position: relative; }
        #stats-panel .fh-streak { margin-left: 6px; color: #ff944d; opacity: 0; transition: opacity .15s ease; pointer-events: none; }
        /* Progress container — taller, fixed length, left aligned */
        #stats-panel .fh-progress{
          height:14px;
          width:50%;
          max-width:520px;
          margin:6px 0 0 12px;
          background:#2a2a2a;
          border-radius:7px;
          position:relative;
          overflow:hidden;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.45);
        }
        #stats-panel .fh-progress > .fh-fill{ height:100%; border-radius:7px; }
        #stats-panel .fh-progress .fh-pct{
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;
        }
        #stats-panel .fh-progress .fh-pct .fh-pct-inner{
          display:inline-block; padding:1px 4px; border-radius:999px; font-size:10px; font-weight:700; line-height:1;
          letter-spacing:.2px; color:#fff; background:rgba(0,0,0,.35); backdrop-filter: blur(1px) saturate(1.05);
          text-shadow: 0 1px 2px rgba(0,0,0,.85), 0 -1px 2px rgba(0,0,0,.6), 1px 0 2px rgba(0,0,0,.6), -1px 0 2px rgba(0,0,0,.6);
        }
        #stats-panel .fh-progress.over{ overflow:hidden !important; }
        #stats-panel .fh-100tick{ display:none !important; }

        #stats-panel .fh-row:hover .fh-streak { opacity: 1; }
        #stats-panel .fh-pill { background:#444;color:#fff;border:none;border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin-right:8px;margin-bottom:8px }
        #stats-panel .fh-pill.active { background:#3a7 }
        #stats-panel .fh-card { background:#242424; border:1px solid #333; border-radius:8px; padding:10px; }
        #stats-panel .fh-list-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0; }
        #stats-panel .fh-switch { width:36px; height:20px; border-radius:999px; background:#555; position:relative; cursor:pointer; }
        #stats-panel .fh-switch::after { content:""; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:#aaa; transition:left .16s ease, background .16s ease; }
        #stats-panel .fh-switch.on { background:#3a7; }
        #stats-panel .fh-switch.on::after { left:18px; background:#fff; }
        #stats-panel .fh-gold { color:#ffd54a }

/* Shimmer ≥120% */
@keyframes fh-shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
#stats-panel .fh-fill.shimmer {

          background: linear-gradient(90deg, #b38600, #ffd54a, #b38600);
          background-size: 200% 100%;
          animation: fh-shine 2.4s linear infinite;
        }
      `;
            document.head.appendChild(s);
        }
        const rect = anchorTab.getBoundingClientRect();
        const fallbackTop = window.scrollY + 100;
        const fallbackLeft = window.innerWidth / 2 - 200;
        const calculatedTop = rect.bottom + window.scrollY + 10;
        const calculatedLeft = rect.left + rect.width / 2 - 200;
        const validTop = isFinite(calculatedTop) && calculatedTop > 0 && calculatedTop < window.innerHeight + 500;
        const validLeft = isFinite(calculatedLeft) && calculatedLeft > 0 && calculatedLeft < window.innerWidth + 500;

        panel.style.top = `${validTop ? calculatedTop : fallbackTop}px`;
        panel.style.left = `${validLeft ? calculatedLeft : fallbackLeft}px`;
        requestAnimationFrame(() => { panel.style.transform = 'translateY(0)'; panel.style.opacity = '1'; });

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '5px', right: '8px', cursor: 'pointer', color: '#ccc', fontSize: '16px', fontWeight: 'bold'
        });
        closeBtn.onclick = () => { closePopovers(); closeStatisticsPanel(); };
        panel.appendChild(closeBtn);
        function closePopovers(){ const p = document.getElementById('zedcity-popup'); if (p) p.remove(); }
        function escHandler(e){ if (e.key === 'Escape') { closePopovers(); closeStatisticsPanel(); } }
        FH_ESC_HANDLER = escHandler;
        document.addEventListener('keydown', escHandler);

        // scrollable content wrapper (fix footer-at-bottom)
        const scrollWrap = document.createElement('div');
        Object.assign(scrollWrap.style,{ display:'flex', flexDirection:'column', gap:'8px', flex:'1 1 auto', overflowY:'auto' });
        panel.appendChild(scrollWrap);

        const tabButtons = document.createElement('div');
        const yearButtons = document.createElement('div');
        const monthButtons = document.createElement('div');
        const results = document.createElement('div');
        const toggleFormer = document.createElement('button');
        toggleFormer.textContent = '👥 Show former members';
        toggleFormer.className = 'fh-pill';
        toggleFormer.style.display = 'none';

        scrollWrap.appendChild(tabButtons);
        scrollWrap.appendChild(yearButtons);
        scrollWrap.appendChild(monthButtons);
        scrollWrap.appendChild(results);

        // footer (no sticky; sits at true bottom)
        const footerRow = document.createElement('div');
        Object.assign(footerRow.style,{display:'flex',gap:'8px',padding:'8px 12px',background:'#1c1c1c',borderTop:'1px solid #333'});
        const footerLeft = document.createElement('div');
        footerRow.appendChild(footerLeft);
        panel.appendChild(footerRow);

        renderStatisticsPanelContent(tabButtons, yearButtons, monthButtons, results, toggleFormer, settings, panel, footerLeft);
    }

    function enableMainControls(enable, excludeEl = null) {
        const statsPanel = document.getElementById('stats-panel');
        if (!statsPanel) return;
        const buttons = statsPanel.querySelectorAll('button');
        buttons.forEach(btn => {
            if (excludeEl && excludeEl.contains(btn)) return;
            btn.disabled = !enable;
            btn.style.opacity = enable ? '1' : '0.5';
            btn.style.pointerEvents = enable ? 'auto' : 'none';
        });
    }

    function closeStatisticsPanel() {
        const pop = document.getElementById('zedcity-popup');
        if (pop) pop.remove();
        const panel = document.getElementById('stats-panel');
        if (panel) panel.remove();
        if (FH_ESC_HANDLER) { document.removeEventListener('keydown', FH_ESC_HANDLER); FH_ESC_HANDLER = null; }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Settings sub-pages (unchanged except tiny polish)
    // ─────────────────────────────────────────────────────────────────────────────
    function renderSettingsSubpanel(parent, settings, goals) {
        const subId = 'fh-settings-sub';
        const existing = document.getElementById(subId);
        if (existing) existing.remove();

        const sub = document.createElement('div');
        sub.id = subId;
        Object.assign(sub.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: '#1c1c1c', color: 'white', zIndex: 10001,
            transform: 'translate3d(100%,0,0)',
            transition: 'transform 260ms cubic-bezier(.22,.61,.36,1)',
            willChange: 'transform',
            display: 'flex', flexDirection: 'column'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', alignItems: 'center', padding: '10px 12px',
            backgroundColor: '#222', borderBottom: '1px solid #333', fontSize: '14px'
        });

        const backBtn = document.createElement('span');
        backBtn.textContent = '←';
        Object.assign(backBtn.style, { cursor: 'pointer', fontSize: '16px', marginRight: '10px', color: '#ccc' });
        backBtn.onclick = () => {
            // stop live API Statistics timer if running
            if (typeof sub.__apiStatsStop === 'function') sub.__apiStatsStop();
            sub.style.transform = 'translate3d(100%,0,0)';
            setTimeout(() => { sub.remove(); enableMainControls(true); }, 300);
        };
        header.appendChild(backBtn);

        const title = document.createElement('span');
        title.innerHTML = `<strong>Settings</strong>`;
        header.appendChild(title);

        sub.appendChild(header);

        const body = document.createElement('div');
        body.style.padding = '12px';
        body.style.overflowY = 'auto';
        body.style.maxHeight = 'calc(100vh - 60px)';
        sub.appendChild(body);

        const footer = document.createElement('div');
        footer.style.borderTop = '1px solid #333';
        footer.style.padding = '8px 12px';
        footer.style.color = '#bbb';
        footer.textContent = 'Settings • Manage Faction HUB preferences.';
        sub.appendChild(footer);

        // Draft/Dirty bar
        const dirtyBar = document.createElement('div');
        Object.assign(dirtyBar.style,{position:'sticky',bottom:'0',display:'none',gap:'8px',padding:'8px 12px',background:'#1c1c1c',borderTop:'1px solid #333',justifyContent:'flex-end',alignItems:'center'});
        const dirtyMsg = document.createElement('div'); dirtyMsg.textContent = 'Unsaved changes — Save or Discard.'; dirtyMsg.style.opacity='.95';
        const discardBtn = document.createElement('button'); discardBtn.className='fh-pill'; discardBtn.textContent='Discard';
        const saveBtn = document.createElement('button'); saveBtn.className='fh-pill'; saveBtn.textContent='Save';
        dirtyBar.append(dirtyMsg, discardBtn, saveBtn);
        sub.appendChild(dirtyBar);
        // toast (top-right)
        const toast = document.createElement('div');
        Object.assign(toast.style,{position:'absolute',top:'8px',right:'12px',background:'#2a6b3f',color:'#fff',padding:'4px 8px',borderRadius:'6px',fontSize:'12px',display:'none'});
        sub.appendChild(toast);
        function showToast(text, ok=true){ toast.textContent=text; toast.style.background= ok ? '#2a6b3f' : '#7a2b2b'; toast.style.display='block'; setTimeout(() => { toast.style.display = 'none'; }, 1500);
                                         }

        let PENDING_S = null, PENDING_G = null;
        let HAS_CONFIG_ERROR = false;
        function deepEq(a,b){ try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; } }
        function markDirty(_category, draftS, draftG){
            const curS = loadSettings();
            const curG = loadGoals();
            const sDraft = draftS || PENDING_S;
            const gDraft = draftG || PENDING_G;
            const sChanged = !!sDraft && !deepEq(sDraft, curS);
            const gChanged = !!gDraft && !deepEq(gDraft, curG);
            PENDING_S = sChanged ? sDraft : null;
            PENDING_G = gChanged ? gDraft : null;
            dirtyBar.style.display = (sChanged || gChanged) && !HAS_CONFIG_ERROR ? 'flex' : 'none';
        }
        discardBtn.onclick = () => {
            PENDING_S = null; PENDING_G = null;
            dirtyBar.style.display = 'none';
            ACTIVE_VIEW && ACTIVE_VIEW();     // re-render current page from persisted values
            showToast('Changes Discarded', false);
        };

        saveBtn.onclick = () => {
            if (HAS_CONFIG_ERROR) { showToast('Fix input errors first', false); return; } // NEW
            if (PENDING_S) saveSettings(PENDING_S);
            if (PENDING_G) saveGoals(PENDING_G);
            PENDING_S = null; PENDING_G = null;
            dirtyBar.style.display = 'none';
            ACTIVE_VIEW && ACTIVE_VIEW();     // refresh controls to saved values
            const panel = document.getElementById('stats-panel');
            if (panel && typeof panel.__fh_refresh === 'function') panel.__fh_refresh(); // live-apply
            showToast('Changes Saved', true);
        };


        function pills(options, currentSet, onToggle) {
            const wrap = document.createElement('div');
            options.forEach(([val, label]) => {
                const b = document.createElement('button');
                b.className = 'fh-pill' + (currentSet.has(val) ? ' active' : '');
                b.textContent = label;
                b.onclick = () => {
                    const isActive = currentSet.has(val);
                    if (isActive) currentSet.delete(val); else currentSet.add(val);
                    onToggle(new Set(currentSet)); // pass new copy
                    Array.from(wrap.children).forEach(x => x.classList.remove('active'));
                    Array.from(wrap.children).forEach(x => {
                        const v = options[Array.from(wrap.children).indexOf(x)][0];
                        if (currentSet.has(v)) x.classList.add('active');
                    });
                };
                wrap.appendChild(b);
            });
            return wrap;
        }
        function pillsSingle(options, current, onPick) {
            const wrap = document.createElement('div');
            options.forEach(([val, label]) => {
                const b = document.createElement('button');
                b.className = 'fh-pill' + (current === val ? ' active' : '');
                b.textContent = label;
                b.onclick = () => {
                    onPick(val);
                    Array.from(wrap.children).forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                };
                wrap.appendChild(b);
            });
            return wrap;
        }
        function makeSwitch(initial, onToggle) {
            const s = document.createElement('div');
            s.className = 'fh-switch';
            if (initial) s.classList.add('on');
            s.onclick = () => {
                const on = !s.classList.contains('on');
                if (on) s.classList.add('on'); else s.classList.remove('on');
                onToggle(on);
            };
            return s;
        }
        function rowMain(label, controlEl) {
            const r = document.createElement('div');
            r.className = 'fh-list-row';
            const l = document.createElement('div'); l.textContent = label; r.appendChild(l);
            r.appendChild(controlEl);
            return r;
        }
        function row(label, controlEl, help = '') {
            const r = document.createElement('div');
            r.className = 'fh-list-row';
            const l = document.createElement('div'); l.textContent = label; r.appendChild(l);
            r.appendChild(controlEl);
            if (help) {
                const h = document.createElement('div');
                h.textContent = help; h.style.opacity = '.6'; h.style.fontSize = '11px'; h.style.marginLeft = 'auto';
                r.appendChild(h);
            }
            return r;
        }
        function rowSub(desc) {
            const h = document.createElement('div');
            h.textContent = desc;
            h.style.opacity = '.65';
            h.style.fontSize = '11px';
            h.style.margin = '-6px 0 8px 0';
            return h;
        }
        function hr() { const d = document.createElement('div'); d.style.borderTop = '1px solid #333'; d.style.margin = '10px 0'; return d; }

        function showIndex() {
            body.innerHTML = '';
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1fr';
            grid.style.gap = '10px';

            function addCard(titleText, subtitle, onClick) {
                const c = document.createElement('div');
                c.className = 'fh-card';
                c.style.cursor = 'pointer';
                c.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${titleText}</div><div style="opacity:.8">${subtitle}</div>`;
                c.onclick = onClick;
                grid.appendChild(c);
            }

            addCard('General', 'Bars & Missing visibility, estimation', () => showGeneral());
            addCard('Influence Settings', 'Weekly per-member goal & visuals', () => showInfluence());
            addCard('Rations Settings', 'Weekly claims goal & visuals', () => showRations());
            addCard('Deposits Settings', 'Weekly goal and optional per-item rules', () => showDeposits());

            body.appendChild(grid);
            footer.textContent = 'Settings • Manage Faction HUB preferences.';
        }

        // GENERAL
        function showGeneral() {
            body.innerHTML = '';
            footer.textContent = 'General Settings • Global visibility and estimation.';
            ACTIVE_VIEW = showGeneral;

            const sPersisted = loadSettings();
            let draftS = JSON.parse(JSON.stringify(sPersisted));

            const card = document.createElement('div'); card.className = 'fh-card';

            // Progress bar visibility by period (multi-select)
            const activeBars = new Set(Object.entries(draftS.progress.showOn).filter(([,v])=>v).map(([k])=>k));
            const barsPills = pills([['daily','Daily'], ['monthly','Monthly'], ['yearly','Yearly']], activeBars, (newSet) => {
                draftS.progress.showOn.daily   = newSet.has('daily');
                draftS.progress.showOn.monthly = newSet.has('monthly');
                draftS.progress.showOn.yearly  = newSet.has('yearly');
                markDirty('general', draftS);
            });
            card.appendChild(rowMain('Show progress bar on:', barsPills));
            card.appendChild(rowSub('Choose the timeframes where bars appear (Weekly is always shown).'));

            // “Missing to 100%” visibility
            const activeMissing = new Set(Object.entries(draftS.missing.showOn).filter(([,v])=>v).map(([k])=>k));
            const missPills = pills([['daily','Daily'], ['monthly','Monthly'], ['yearly','Yearly']], activeMissing, (newSet) => {
                draftS.missing.showOn.daily   = newSet.has('daily');
                draftS.missing.showOn.monthly = newSet.has('monthly');
                draftS.missing.showOn.yearly  = newSet.has('yearly');
                markDirty('general', draftS);
            });
            card.appendChild(rowMain('Show “Missing to 100%” on:', missPills));
            card.appendChild(rowSub('Displays how far each member is from the goal (paced during current week).'));

            card.appendChild(hr());

            // Influence “Missing” estimation: Auto / Store / Hospital / Farm
            const influenceLogs = STORE.get(KEYS.INFL, []);
            const learned = learnRaidAverages(influenceLogs);
            const curMode = draftS.missing.influenceEstimation || 'auto';
            const estPills = pillsSingle(
                [['auto','Auto'], ['store',`Store (${learned.store || '–'})`],
                 ['hospital',`Hospital (${learned.hospital || '–'})`],
                 ['farm',`Farm (${learned.farm || '–'})`]],
                curMode,
                (val)=>{ draftS.missing.influenceEstimation = val; markDirty('general', draftS); }
            );
            card.appendChild(rowMain('Influence “Missing” estimation', estPills));
            card.appendChild(rowSub('Use learned averages from your last 100 raids, or pick a specific raid type.'));

            body.appendChild(card);

            // ── NEW: API Settings (accordion with live graph + members refresh policy)
            const statsCard = document.createElement('div'); statsCard.className = 'fh-card';
            const statHeader = document.createElement('div');
            statHeader.style.display='flex'; statHeader.style.alignItems='center';
            statHeader.style.cursor='pointer'; statHeader.style.gap='8px';
            statHeader.innerHTML = '<div style="font-weight:600">API Settings</div><div id="apiChevron" style="margin-left:auto;opacity:.7">▾</div>';
            const statPanel = document.createElement('div'); statPanel.style.display='none'; statPanel.style.marginTop='8px';

            // live chart
            const canvas = document.createElement('canvas');
            canvas.width = 520; canvas.height = 90; canvas.style.width='100%'; canvas.style.border='1px solid #333'; canvas.style.borderRadius='6px';
            const metaLine = document.createElement('div'); metaLine.style.marginTop='6px'; metaLine.style.opacity='.85';
            statPanel.appendChild(canvas);
            statPanel.appendChild(metaLine);

            // Members refresh policy
            const apiS = loadSettings(); // persisted
            // reuse existing draftS declared earlier in showGeneral()
            const policyWrap = document.createElement('div'); policyWrap.style.marginTop = '10px';


            const labelRow = document.createElement('div');
            labelRow.textContent = 'How to load current Faction Members / Roles';
            labelRow.style.marginBottom = '6px'; labelRow.style.opacity = '.9';
            policyWrap.appendChild(labelRow);

            const pillsWrap = document.createElement('div'); // two-mode pills (mutually exclusive)
            pillsWrap.style.display='flex'; pillsWrap.style.gap='6px';
            const makePill = (text, active) => {
                const b = document.createElement('button');
                b.className = 'fh-pill' + (active ? ' active' : '');
                b.textContent = text;
                return b;
            };
            const perRefreshBtn = makePill('Each Page Refresh', (draftS.api?.members?.mode ?? 'perRefresh') === 'perRefresh');
            const intervalBtn   = makePill('For specific intervals', (draftS.api?.members?.mode ?? 'perRefresh') === 'interval');
            pillsWrap.append(perRefreshBtn, intervalBtn);
            policyWrap.appendChild(pillsWrap);

            // interval inputs
            const intervalRow = document.createElement('div');
            intervalRow.style.display='flex'; intervalRow.style.gap='8px'; intervalRow.style.marginTop='8px';

            const mkBox = (ph, val, width='90px') => {
                const w = document.createElement('div');
                const i = document.createElement('input');
                i.type='number'; i.min='0'; i.value = String(val ?? 0);
                Object.assign(i.style,{ background:'#2a2a2a', color:'#fff', border:'1px solid #555', borderRadius:'6px', padding:'6px 8px', width });
                const c = document.createElement('div'); c.style.fontSize='11px'; c.style.opacity='.7'; c.style.marginTop='2px'; c.textContent = ph;
                w.append(i,c); return {wrap:w, input:i};
            };
            const daysBox  = mkBox('Days',    draftS.api.members.interval.days);
            const hoursBox = mkBox('Hours (0–24)', draftS.api.members.interval.hours);
            const minsBox  = mkBox('Minutes (0–60)', draftS.api.members.interval.minutes);

            intervalRow.append(daysBox.wrap, hoursBox.wrap, minsBox.wrap);
            policyWrap.appendChild(intervalRow);

            // small error line
            const errorLine = document.createElement('div');
            errorLine.style.color='#ff6b6b'; errorLine.style.fontSize='12px'; errorLine.style.marginTop='4px'; errorLine.style.display='none';
            policyWrap.appendChild(errorLine);

            // enable/disable inputs based on mode
            function setMode(mode, isInit=false){
                const prev = draftS.api.members.mode;
                draftS.api.members.mode = mode;
                perRefreshBtn.className = 'fh-pill' + (mode==='perRefresh' ? ' active' : '');
                intervalBtn.className   = 'fh-pill' + (mode==='interval'   ? ' active' : '');
                const on = (mode==='interval');
                [daysBox.input,hoursBox.input,minsBox.input].forEach(i => { i.disabled = !on; i.style.opacity = on ? '1' : '.5'; });
                if (!isInit && mode !== prev) markDirty('api', draftS);
            }
            perRefreshBtn.onclick = () => setMode('perRefresh', false);
            intervalBtn.onclick   = () => setMode('interval', false);

            // validation + write to draft
            function validate(isInit=false){
                errorLine.style.display='none'; errorLine.textContent='';
                let hasError = false;
                const d = Math.max(0, Number(daysBox.input.value || 0) | 0);
                const h = Math.max(0, Number(hoursBox.input.value || 0) | 0);
                const m = Math.max(0, Number(minsBox.input.value || 0) | 0);

                if (h > 24) { errorLine.textContent = 'Hours must be 0–24'; hasError = true; }
                else if (m > 60) { errorLine.textContent = 'Minutes must be 0–60'; hasError = true; }

                const prev = JSON.stringify(draftS.api.members.interval);
                draftS.api.members.interval.days = d;
                draftS.api.members.interval.hours = h;
                draftS.api.members.interval.minutes = m;
                const next = JSON.stringify(draftS.api.members.interval);

                if (!isInit && prev !== next) markDirty('api', draftS);
                HAS_CONFIG_ERROR = hasError;
                errorLine.style.display = hasError ? 'block' : 'none';
            }
            [daysBox.input,hoursBox.input,minsBox.input].forEach(i => i.addEventListener('input', () => validate(false)));

            // initial state
            setMode(draftS.api.members.mode || 'perRefresh', true);
            validate(true);

            statPanel.appendChild(policyWrap);

            // mount the card + toggle behavior
            statsCard.appendChild(statHeader);
            statsCard.appendChild(statPanel);
            body.appendChild(statsCard);

            // live chart (same as before)
            let apiTimer = null;
            function drawApiChart(){
                ensureFresh(Math.floor(Date.now()/10000));
                const ctx = canvas.getContext('2d');
                const w = canvas.width, h = canvas.height;
                ctx.clearRect(0,0,w,h);
                const oldestTick = APISTATS.lastTick - 59;
                const vals = new Array(60).fill(0).map((_,i)=>APISTATS.buckets[(oldestTick + i) % 60] || 0);
                const maxV = Math.max(4, ...vals);
                const barW = Math.max(1, Math.floor((w - 61) / 60)); // 1px gaps
                let x = 1;
                ctx.fillStyle = '#6cf';
                for (const v of vals) {
                    const bh = Math.round((h - 12) * (v / maxV));
                    ctx.fillRect(x, h - 2 - bh, barW, bh);
                    x += barW + 1;
                }
                const sum10m = vals.reduce((s,v)=>s+v,0);
                const last6  = vals.slice(-6).reduce((s,v)=>s+v,0);
                const avgPerMin10 = (sum10m / 10).toFixed(2);
                const curPerMin   = (last6 * 10).toFixed(2);
                metaLine.textContent =
                    `Total since refresh: ${APISTATS.total}  •  Avg/min (10m): ${avgPerMin10}  •  Current/min (≈60s): ${curPerMin}` +
                    `  •  [Notif: ${APISTATS.notif} Members: ${APISTATS.members} Other: ${APISTATS.otherFaction} Errors: ${APISTATS.errors}]`;
            }
            function toggleStats(){
                const open = statPanel.style.display === 'none';
                statPanel.style.display = open ? 'block' : 'none';
                const chev = statsCard.querySelector('#apiChevron'); if (chev) chev.textContent = open ? '▴' : '▾';
                if (open && !apiTimer) { drawApiChart(); apiTimer = setInterval(drawApiChart, 1000); }
                if (!open && apiTimer) { clearInterval(apiTimer); apiTimer = null; }
            }
            statHeader.onclick = toggleStats;
            // allow Settings panel to stop the timer on close
            if (typeof sub.__apiStatsStop !== 'function') {
                sub.__apiStatsStop = () => { if (apiTimer) { clearInterval(apiTimer); apiTimer = null; } };
            }

        }


        // INFLUENCE
        function showInfluence() {
            body.innerHTML = '';
            footer.textContent = 'Influence Settings • Per-member weekly goal & visuals.';

            const s = loadSettings();
            const card = document.createElement('div');
            card.className = 'fh-card';

            // goal numbers (weekly input, monthly auto)
            const g = loadGoals();
            const iw = g.influence.weekly;
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1.2fr .8fr .8fr';
            grid.style.gap = '8px';
            grid.style.alignItems = 'center';
            grid.innerHTML = `
        <div></div><div style="opacity:.8">Weekly</div><div style="opacity:.6">Monthly (auto)</div>
        <div>Influence goal</div>
        <input id="i_w" type="number" min="0" value="${iw}" style="background:#2a2a2a;color:#fff;border:1px solid #555;border-radius:6px;padding:6px 8px">
        <input id="i_m" type="number" disabled value="${weeklyToMonthly(iw)}" style="background:#1d1d1d;color:#aaa;border:1px solid #333;border-radius:6px;padding:6px 8px">
      `;
            card.appendChild(grid);

            const iW = grid.querySelector('#i_w');
            const iM = grid.querySelector('#i_m');
            let draftG = JSON.parse(JSON.stringify(g));
            iW.addEventListener('input', () => {
                iM.value = weeklyToMonthly(iW.value || 0);
                draftG.influence.weekly = Math.max(0, +iW.value || 0);
                markDirty('influence_goal', null, draftG);
            });

            card.appendChild(document.createElement('hr')).style.borderColor = '#333';

            let draftS = JSON.parse(JSON.stringify(s));
            const eff = effProgress('influence', draftS);
            const modeWrap = pillsSingle([['tricolor','Inherit/Tricolor'],['bicolor','Bicolor'],['none','No color']],
                                         eff.mode, (val) => { draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), mode: val }; markDirty('influence', draftS); });

            const enSw  = makeSwitch(!!eff.enabled,    (on) => { draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), enabled: on }; markDirty('influence', draftS); });
            const paceSw= makeSwitch(!!eff.paceAware,  (on) => { draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), paceAware: on }; markDirty('influence', draftS); });
            const pctSw = makeSwitch(!!eff.showPercent,(on) => { draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), showPercent: on }; markDirty('influence', draftS); });

            card.appendChild(row('Enable progress bar', enSw, 'Show/hide bar in this category'));
            card.appendChild(row('Bar style override', modeWrap, 'Use tricolor/bicolor or disable color'));
            card.appendChild(row('Pace-aware thresholds', paceSw, 'Scale targets inside current week/month'));
            card.appendChild(row('Show % label on bar', pctSw, 'Show completion percentage inside bar'));
            const starSw = makeSwitch(!!(draftS.progress?.overrides?.influence?.starOnComplete ?? s.celebrate.starOnComplete),
                                      (on)=>{ draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), starOnComplete: on }; markDirty('influence', draftS); });
            const shimSw = makeSwitch(!!(draftS.progress?.overrides?.influence?.shimmer120 ?? s.celebrate.goldShimmer120),
                                      (on)=>{ draftS.progress.overrides.influence = { ...(draftS.progress.overrides.influence||{}), shimmer120: on }; markDirty('influence', draftS); });

            card.appendChild(row('Celebrate at target (⭐)', starSw, 'Star when the bar target is reached (paced in current week)'));
            card.appendChild(row('Shimmer when >120%', shimSw));

            body.appendChild(card);
            ACTIVE_VIEW = showInfluence;
        }

        // RATIONS
        function showRations() {
            body.innerHTML = '';
            footer.textContent = 'Rations Settings • Goal is number of claims (not items).';

            const s = loadSettings();
            const card = document.createElement('div');
            let draftS = JSON.parse(JSON.stringify(s));
            card.className = 'fh-card';

            const g = loadGoals();
            const rw = g.rations.weekly;
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1.2fr .8fr .8fr';
            grid.style.gap = '8px';
            grid.style.alignItems = 'center';
            grid.innerHTML = `
        <div></div><div style="opacity:.8">Weekly</div><div style="opacity:.6">Monthly (auto)</div>
        <div>Claims goal</div>
        <input id="r_w" type="number" min="0" value="${rw}" style="background:#2a2a2a;color:#fff;border:1px solid #555;border-radius:6px;padding:6px 8px">
        <input id="r_m" type="number" disabled value="${weeklyToMonthly(rw)}" style="background:#1d1d1d;color:#aaa;border:1px solid #333;border-radius:6px;padding:6px 8px">
      `;
            card.appendChild(grid);
            const rW = grid.querySelector('#r_w');
            const rM = grid.querySelector('#r_m');
            let draftG = JSON.parse(JSON.stringify(g));
            rW.addEventListener('input', () => {
                rM.value = weeklyToMonthly(rW.value || 0);
                draftG.rations.weekly = Math.max(0, +rW.value || 0);
                markDirty('rations_goal', null, draftG);
            });

            card.appendChild(document.createElement('hr')).style.borderColor = '#333';

            const eff = effProgress('rations', draftS);
            const modeWrap = pillsSingle([['tricolor','Inherit/Tricolor'],['bicolor','Bicolor'],['none','No color']],
                                         eff.mode, (val) => { draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), mode: val }; markDirty('rations', draftS); });

            const enSw  = makeSwitch(!!eff.enabled,    (on)=>{ draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), enabled: on }; markDirty('rations', draftS); });
            const paceSw= makeSwitch(!!eff.paceAware,  (on)=>{ draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), paceAware: on }; markDirty('rations', draftS); });
            const pctSw = makeSwitch(!!eff.showPercent,(on)=>{ draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), showPercent: on }; markDirty('rations', draftS); });

            card.appendChild(row('Enable progress bar', enSw, 'Show/hide bar in this category'));
            card.appendChild(row('Bar style override', modeWrap, 'Use tricolor/bicolor or disable color'));
            card.appendChild(row('Pace-aware thresholds', paceSw, 'Scale targets inside current week/month'));
            card.appendChild(row('Show % label on bar', pctSw, 'Show completion percentage inside bar'));
            const starSw = makeSwitch(!!(draftS.progress?.overrides?.rations?.starOnComplete ?? s.celebrate.starOnComplete),
                                      (on)=>{ draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), starOnComplete: on }; markDirty('rations', draftS); });
            const shimSw = makeSwitch(!!(draftS.progress?.overrides?.rations?.shimmer120 ?? s.celebrate.goldShimmer120),
                                      (on)=>{ draftS.progress.overrides.rations = { ...(draftS.progress.overrides.rations||{}), shimmer120: on }; markDirty('rations', draftS); });

            card.appendChild(row('Celebrate at target (⭐)', starSw));
            card.appendChild(row('Shimmer when >120%', shimSw));

            body.appendChild(card);
            ACTIVE_VIEW = showRations;
        }

        // DEPOSITS
        function showDeposits() {
            body.innerHTML = '';
            footer.textContent = 'Deposits Settings • Weekly goal. Optional per-item “Detailed” goals.';

            const s = loadSettings();
            const card = document.createElement('div');
            let draftS = JSON.parse(JSON.stringify(s));
            card.className = 'fh-card';

            const g = loadGoals();
            const dw = g.deposits.weekly;
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1.2fr .8fr .8fr';
            grid.style.gap = '8px';
            grid.style.alignItems = 'center';
            grid.innerHTML = `
        <div></div><div style="opacity:.8">Weekly</div><div style="opacity:.6">Monthly (auto)</div>
        <div>Total items goal</div>
        <input id="d_w" type="number" min="0" value="${dw}" style="background:#2a2a2a;color:#fff;border:1px solid #555;border-radius:6px;padding:6px 8px">
        <input id="d_m" type="number" disabled value="${weeklyToMonthly(dw)}" style="background:#1d1d1d;color:#aaa;border:1px solid #333;border-radius:6px;padding:6px 8px">
      `;
            card.appendChild(grid);
            const dW = grid.querySelector('#d_w');
            const dM = grid.querySelector('#d_m');
            let draftG = JSON.parse(JSON.stringify(g));
            if (s.deposits?.detailed?.enabled) { dW.disabled = true; dW.style.opacity = '.5'; }
            dW.addEventListener('input', () => {
                dM.value = weeklyToMonthly(dW.value || 0);
                draftG.deposits.weekly = Math.max(0, +dW.value || 0);
                markDirty('deposits_goal', null, draftG);
            });

            card.appendChild(document.createElement('hr')).style.borderColor = '#333';

            // Visual overrides
            const eff = effProgress('deposits', draftS);
            const modeWrap = pillsSingle([['tricolor','Inherit/Tricolor'],['bicolor','Bicolor'],['none','No color']],
                                         eff.mode, (val) => { draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), mode: val }; markDirty('deposits', draftS); });

            const enSw  = makeSwitch(!!eff.enabled,    (on)=>{ draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), enabled: on }; markDirty('deposits', draftS); });
            const paceSw= makeSwitch(!!eff.paceAware,  (on)=>{ draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), paceAware: on }; markDirty('deposits', draftS); });
            const pctSw = makeSwitch(!!eff.showPercent,(on)=>{ draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), showPercent: on }; markDirty('deposits', draftS); });

            card.appendChild(row('Enable progress bar', enSw, 'Show/hide bar in this category'));
            card.appendChild(row('Bar style override', modeWrap, 'Use tricolor/bicolor or disable color'));
            card.appendChild(row('Pace-aware thresholds', paceSw, 'Scale targets inside current week/month'));
            card.appendChild(row('Show % label on bar', pctSw, 'Show completion percentage inside bar'));
            const starSw = makeSwitch(!!(draftS.progress?.overrides?.deposits?.starOnComplete ?? s.celebrate.starOnComplete),
                                      (on)=>{ draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), starOnComplete: on }; markDirty('deposits', draftS); });
            const shimSw = makeSwitch(!!(draftS.progress?.overrides?.deposits?.shimmer120 ?? s.celebrate.goldShimmer120),
                                      (on)=>{ draftS.progress.overrides.deposits = { ...(draftS.progress.overrides.deposits||{}), shimmer120: on }; markDirty('deposits', draftS); });

            card.appendChild(row('Celebrate at target (⭐)', starSw));
            card.appendChild(row('Shimmer when >120%', shimSw));

            // Detailed goals editor
            const detCard = document.createElement('div');
            detCard.className = ''; detCard.style.margin = '6px 0 0 0';
            detCard.style.marginTop = '10px';

            const detOn = makeSwitch(!!draftS.deposits?.detailed?.enabled, (on) => {
                draftS.deposits.detailed.enabled = on;
                if (dW) { dW.disabled = !!on; dW.style.opacity = on ? '.5' : '1'; }
                markDirty('deposits', draftS);
            });
            detCard.appendChild(row('Use detailed per-item goals instead', detOn, 'Only listed items count towards the goal'));

            const listWrap = document.createElement('div');
            listWrap.style.marginTop = '6px';
            detCard.appendChild(listWrap);

            function renderRules() {
                listWrap.innerHTML = '';
                const rules = draftS.deposits?.detailed?.rules || [];
                if (!rules.length) {
                    const empty = document.createElement('div');
                    empty.style.opacity = '.7';
                    empty.textContent = 'No item rules yet.';
                    listWrap.appendChild(empty);
                } else {
                    rules.forEach((r, idx) => {
                        const rowEl = document.createElement('div');
                        rowEl.className = 'fh-list-row';
                        const label = document.createElement('div');
                        label.textContent = r.item;
                        const qty = document.createElement('div');
                        qty.textContent = `Weekly: ${r.weekly}`;
                        const del = document.createElement('button');
                        del.className = 'fh-pill';
                        del.textContent = 'Remove';
                        del.onclick = () => {
                            draftS.deposits.detailed.rules.splice(idx, 1);
                            markDirty('deposits', draftS);
                            renderRules();
                        };
                        rowEl.appendChild(label);
                        rowEl.appendChild(qty);
                        rowEl.appendChild(del);
                        listWrap.appendChild(rowEl);
                    });
                }
            }
            renderRules();

            const addWrap = document.createElement('div');
            addWrap.style.marginTop = '8px';
            addWrap.style.display = 'flex';
            addWrap.style.gap = '6px';
            const itemIn = document.createElement('input');
            Object.assign(itemIn, { placeholder: 'Item name' });
            Object.assign(itemIn.style, { background: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: '6px', padding: '6px 8px', flex: '1' });
            const qtyIn = document.createElement('input');
            qtyIn.type = 'number'; qtyIn.min = '0'; qtyIn.placeholder = 'Weekly amount';
            Object.assign(qtyIn.style, { background: '#2a2a2a', color: '#fff', border: '1px solid #555', borderRadius: '6px', padding: '6px 8px', width: '140px' });
            const addBtn = document.createElement('button');
            addBtn.className = 'fh-pill'; addBtn.textContent = 'Add rule';
            addBtn.onclick = () => {
                const item = (itemIn.value || '').trim();
                const weekly = Math.max(0, +qtyIn.value || 0);
                if (!item) return;
                (draftS.deposits.detailed.rules ||= []).push({ item, weekly });
                markDirty('deposits', draftS);
                itemIn.value = ''; qtyIn.value = '';
                renderRules();
            };
            addWrap.appendChild(itemIn);
            addWrap.appendChild(qtyIn);
            addWrap.appendChild(addBtn);
            detCard.appendChild(addWrap);

            body.appendChild(card);
            card.insertBefore(detCard, card.querySelector('hr'));
            ACTIVE_VIEW = showDeposits;
        }

        showIndex();
        parent.appendChild(sub);
        requestAnimationFrame(() => { sub.style.transform = 'translate3d(0,0,0)'; });
        enableMainControls(false, sub);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Main content (stats & lists) — uses unified targets so bar & “Missing” match
    // ─────────────────────────────────────────────────────────────────────────────
    function renderStatisticsPanelContent(tabButtons, yearButtons, monthButtons, results, toggleFormer, settings, panelEl, footerLeft) {
        const members = getCurrentMembers();
        const rations = STORE.get(KEYS.RATIONS, []);
        const influence = STORE.get(KEYS.INFL, []);
        const deposits = STORE.get(KEYS.DEPOSITS, []);
        let goals = loadGoals();

        // Precompute dates and streaks
        const rationDatesByName = new Map();
        const influenceDatesByName = new Map();
        for (const r of rations) { const s = rationDatesByName.get(r.name) || new Set(); s.add(dayIndexFromStr(r.date)); rationDatesByName.set(r.name, s); }
        for (const i of influence) { const s = influenceDatesByName.get(i.name) || new Set(); s.add(dayIndexFromStr(i.date)); influenceDatesByName.set(i.name, s); }

        const rationStreaks = new Map();
        const influenceStreaks = new Map();
        for (const [name, set] of rationDatesByName) rationStreaks.set(name, { current: currentStreakFromSet(set, todayStr(), true), best: bestStreakFromSet(set) });
        for (const [name, set] of influenceDatesByName) influenceStreaks.set(name, { current: currentStreakFromSet(set, todayStr(), true), best: bestStreakFromSet(set) });

        let activeTab = 'rations';
        let selectedYear = null;
        let weekOffset = 0;
        let selectedMonth = null; // for WEEKLY: is weekKey; for year: month number
        let showFormer = false;
        let showAll = false;

        const learnedAverages = learnRaidAverages(influence);
        // reloadable so Settings can live-refresh the panel
        let settingsNow = loadSettings();


        const styleButton = (btn, active) => { btn.className = 'fh-pill' + (active ? ' active' : ''); };
        const pill = (label, active, onclick) => { const b = document.createElement('button'); b.className = 'fh-pill' + (active ? ' active' : ''); b.textContent = label; b.onclick = onclick; return b; };

        function makeProgressBar(value, goal, color, showPercent, shimmer = false) {
            if (!goal || goal <= 0) return null;
            const pctExact = pct(value, goal);
            const wrap = document.createElement('div'); wrap.className = 'fh-progress';
            const fill = document.createElement('div'); fill.className = 'fh-fill';
            fill.style.width = clamp(pctExact, 0, 100) + '%';
            shimmer ? fill.classList.add('shimmer') : (fill.style.background = color);
            wrap.appendChild(fill);
            if (showPercent) {
                const pctEl = document.createElement('div'); pctEl.className = 'fh-pct';
                pctEl.innerHTML = `<span class="fh-pct-inner">${pctExact}%</span>`;
                wrap.appendChild(pctEl);
            }
            return wrap;
        }

        function openSettings() { renderSettingsSubpanel(panelEl, loadSettings(), loadGoals()); }

        function getPastWeeks(count, offset = 0) {
            const weeks = [];
            const t = new Date();
            const currentMonday = new Date(t);
            currentMonday.setDate(t.getDate() - (t.getDay() === 0 ? 6 : t.getDay() - 1));
            for (let i = offset; i < offset + count; i++) {
                const start = new Date(currentMonday);
                start.setDate(currentMonday.getDate() - i * 7);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                weeks.push({ key: `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`, label: `${start.getDate()}–${end.getDate()} ${end.toLocaleString('default', { month: 'short' })}` });
            }
            return weeks.reverse();
        }

        function colorFromMode(mode, v, yT, gT) {
            if (mode === 'none') return '#bbb';
            if (mode === 'bicolor') return v >= gT ? '#3f3' : '#f66';
            if (v >= gT) return '#3f3';
            if (v >= yT) return '#ff3';
            return '#f66';
        }

        const sPlural = (n, s, p = s + 's') => n === 1 ? s : p;
        function missingInfluenceLine(missing, settings, learned) {
            const mode = settings.missing.influenceEstimation || 'auto';
            const pick = mode === 'auto' ? (learned.dominant || 'store') : mode;
            const avg  = learned[pick] || learned.store || 1000;
            const raids = Math.ceil(missing / Math.max(1, avg));
            const raidLabel = pick.charAt(0).toUpperCase() + pick.slice(1);
            return `Missing ${missing} influence • ≈ ${raids} ${raidLabel} ${sPlural(raids, 'raid')}`;
        }

        function rebuild() {
            settingsNow = loadSettings();
            goals = loadGoals();
            const currentSet = new Set(members.map(m => m.name));
            const today = todayStr();

            tabButtons.innerHTML = '';
            yearButtons.innerHTML = '';
            monthButtons.innerHTML = '';
            results.innerHTML = '';
            footerLeft.innerHTML = '';

            const gearBtn = pill('⚙️ Settings', false, openSettings);
            tabButtons.appendChild(gearBtn);

            const tabs = [
                { key: 'members', label: '👥 Members' },
                { key: 'rations', label: '📦 Rations' },
                { key: 'influence', label: '💪 Influence' },
                { key: 'deposits', label: '🏗️ Deposits' }
            ];
            tabs.forEach(({ key, label }) => {
                const b = pill(label, activeTab === key, () => { activeTab = key; selectedYear = null; selectedMonth = null; showAll = false; rebuild(); });
                tabButtons.appendChild(b);
            });

            if (activeTab === 'rations' || activeTab === 'influence' || activeTab === 'deposits') {
                yearButtons.appendChild(pill('📅 Daily', selectedYear === 'DAILY', () => { selectedYear = selectedYear === 'DAILY' ? null : 'DAILY'; selectedMonth = null; showAll = false; rebuild(); }));
                yearButtons.appendChild(pill('📆 Weekly', selectedYear === 'WEEKLY', () => { selectedYear = selectedYear === 'WEEKLY' ? null : 'WEEKLY'; selectedMonth = null; showAll = false; weekOffset = 0; rebuild(); }));
            }

            const logs = activeTab === 'rations' ? rations : activeTab === 'influence' ? influence : deposits;

            if (selectedYear !== 'DAILY' && activeTab !== 'members') {
                const years = [...new Set(logs.map(x => x.date.split('-')[0]))].sort();
                years.forEach(year => yearButtons.appendChild(pill(year, selectedYear === year, () => { selectedYear = selectedYear === year ? null : year; selectedMonth = null; showAll = false; rebuild(); })));
            }

            if (activeTab === 'members') {
                const currentMembers = members.slice().sort((a, b) => a.name.localeCompare(b.name));
                const frag = document.createDocumentFragment();
                currentMembers.forEach(member => {
                    const div = document.createElement('div');
                    div.classList.add('fh-row');
                    div.style.display = 'flex'; div.style.alignItems = 'center'; div.style.marginBottom = '6px';
                    div.style.cursor = 'pointer'; div.style.color = '#ccc';
                    const nameSpan = document.createElement('span'); nameSpan.textContent = member.name;
                    const roleSpan = document.createElement('span');
                    roleSpan.textContent = member.role ? ` [${member.role}]` : '';
                    roleSpan.style.fontSize = '11px'; roleSpan.style.color = '#aaa'; roleSpan.style.marginLeft = '4px'; roleSpan.style.display = 'none';
                    const levelSpan = document.createElement('span');
                    levelSpan.textContent = member.level ? `Level ${member.level}` : '';
                    levelSpan.style.fontSize = '11px'; levelSpan.style.color = '#999'; levelSpan.style.marginLeft = 'auto';
                    div.append(nameSpan, roleSpan, levelSpan);
                    div.onmouseenter = () => { roleSpan.style.display = 'inline'; div.style.color = '#6cf'; };
                    div.onmouseleave = () => { roleSpan.style.display = 'none'; div.style.color = '#ccc'; };
                    div.onclick = () => renderMemberSubPanel(member.name);
                    frag.appendChild(div);
                });
                results.appendChild(frag);
                toggleFormer.style.display = 'none';
                return;
            }

            if (selectedYear !== 'DAILY' && activeTab !== 'members') {
                const months = [...new Set(logs.filter(x => x.date.startsWith(selectedYear)).map(x => x.date.split('-')[1]))].sort();
                months.forEach(month => monthButtons.appendChild(pill(new Date(`${selectedYear}-${month}-01`).toLocaleString('default', { month: 'short' }), selectedMonth === month, () => { selectedMonth = selectedMonth === month ? null : month; showAll = false; rebuild(); })));
            }

            if (selectedYear === 'WEEKLY' && (activeTab === 'rations' || activeTab === 'influence' || activeTab === 'deposits')) {
                const weekList = getPastWeeks(4, weekOffset);
                if (!selectedMonth) selectedMonth = weekList[weekList.length - 1].key;

                monthButtons.appendChild(pill('⬅', false, () => { weekOffset += 4; rebuild(); }));

                weekList.forEach(({ key, label }) => {
                    monthButtons.appendChild(pill(label, selectedMonth === key, () => { selectedMonth = selectedMonth === key ? null : key; rebuild(); }));
                });

                if (weekOffset > 0) {
                    monthButtons.appendChild(pill('➡', false, () => { weekOffset = Math.max(0, weekOffset - 4); rebuild(); }));
                }
            }

            // UTC-safe filtering
            const filtered = logs.filter(x => {
                if (selectedYear === 'DAILY') return x.date === today;
                if (selectedYear === 'WEEKLY' && selectedMonth) {
                    const [startStr, endStr] = selectedMonth.split('_');
                    const start = ymd(startStr), end = ymdEnd(endStr);
                    const d = ymd(x.date);
                    return d >= start && d <= end;
                }
                return selectedYear ? x.date.startsWith(selectedYear + (selectedMonth ? '-' + selectedMonth : '')) : false;
            });

            const grouped = {};
            if (activeTab === 'rations') {
                // claims-first view
                const claimsByName = new Map();
                const itemsByName = new Map();
                for (const log of filtered) {
                    const name = log.name;
                    const claimId = log.iso || (log.date + '|' + name);
                    if (!claimsByName.has(name)) claimsByName.set(name, new Set());
                    claimsByName.get(name).add(claimId);
                    const bag = itemsByName.get(name) || {};
                    bag[log.item] = (bag[log.item] || 0) + (log.amount || 0);
                    itemsByName.set(name, bag);
                }
                for (const [name, set] of claimsByName.entries()) {
                    grouped[name] = { __claims: set.size, __items: itemsByName.get(name) || {} };
                }
            } else {
                for (const log of filtered) {
                    const name = log.name;
                    if (!grouped[name]) grouped[name] = {};
                    const key = activeTab === 'deposits' ? log.item : 'influence';
                    grouped[name][key] = (grouped[name][key] || 0) + (log.amount || 0);
                }
            }

            if (selectedYear) {
                const showAllBtn = document.createElement('button');
                showAllBtn.textContent = showAll ? 'Hide all' : 'Show all';
                showAllBtn.className = 'fh-pill';
                showAllBtn.onclick = () => { showAll = !showAll; rebuild(); };
                footerLeft.appendChild(showAllBtn);
            }

            const canShowFormer =
                  (activeTab === 'rations' || activeTab === 'influence' || activeTab === 'deposits') &&
                  selectedYear && selectedYear !== 'DAILY' &&
                  !(selectedYear === 'WEEKLY' && !selectedMonth);
            if (canShowFormer) {
                toggleFormer.style.display = 'inline-block';
                toggleFormer.className = 'fh-pill';
                toggleFormer.textContent = showFormer ? '👥 Hide former members' : '👥 Show former members';
                if (!toggleFormer.parentNode) footerLeft.appendChild(toggleFormer);
            } else {
                toggleFormer.style.display = 'none';
            }

            if (!selectedYear) return;

            const shownNames = showAll ? members.map(m => m.name) : Object.keys(grouped);
            const names = [...new Set(shownNames)].sort((a, b) => {
                if (activeTab === 'rations') {
                    const ca = grouped[a]?.__claims || 0; const cb = grouped[b]?.__claims || 0; return cb - ca;
                }
                const totA = grouped[a] ? Object.values(grouped[a]).reduce((s, v) => s + v, 0) : 0;
                const totB = grouped[b] ? Object.values(grouped[b]).reduce((s, v) => s + v, 0) : 0;
                return totB - totA;
            });

            const effInf = effProgress('influence', settingsNow);
            const effRat = effProgress('rations', settingsNow);
            const effDep = effProgress('deposits', settingsNow);

            const bounds = boundsFor(selectedYear, selectedMonth);
            const pkey = periodKeyOf(selectedYear, bounds);

            function applyCategory(ctx, params, items) {
                const { resultsItemDiv, nameStrong, memberName } = ctx;
                const {
                    value,
                    weeklyGoal,
                    eff,
                    label,
                    isClaims,
                    detailedForDeposits = null,
                    addValueLine = true
                } = params;

                // 1) full goal for period
                let full = goalForPeriod(weeklyGoal, bounds);
                let valueForBar = value;

                // deposits: detailed override (only listed items count)
                if (activeTab === 'deposits' && detailedForDeposits?.enabled) {
                    const rules = detailedForDeposits.rules || [];
                    const listedWeekly = rules.reduce((s, r) => s + Math.max(0, Number(r.weekly) || 0), 0);
                    full = goalForPeriod(listedWeekly, bounds);
                    valueForBar = rules.reduce((acc, r) => acc + (items[r.item] || 0), 0);
                }

                // 2) thresholds & color
                const target = displayTarget(full, bounds, eff); // shared by bar and "Missing"
                const yellowT = Math.round(target * 0.5);
                const color = colorFromMode(eff.mode, valueForBar, yellowT, target);

                // 3) value line (skip for deposits summary)
                if (addValueLine) {
                    const row = document.createElement('div');
                    row.style.marginLeft = '12px';
                    row.style.color = color;
                    if (isClaims) {
                        const itemMap = items?.__items || {};
                        const itemStr = Object.keys(itemMap).length
                        ? ' (' + Object.entries(itemMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join(', ') + ')'
                        : '';
                        row.textContent = `${label}: ${value} ${sPlural(value, 'time')}${itemStr}`;
                    } else {
                        row.textContent = `${label}: ${value}`;
                    }
                    resultsItemDiv.appendChild(row);
                }

                // 4) ⭐ celebrate when bar target reached (paced during week)
                const targetPct = target > 0 ? (valueForBar / target) : 0;
                if (eff.celebrateStar && targetPct >= 1) {
                    nameStrong.classList.add('fh-gold');
                    nameStrong.textContent = nameStrong.textContent + ' ⭐';
                }

                // 5) progress bar?
                let showBar = eff.enabled;
                if (pkey === 'daily'   && !settingsNow.progress.showOn.daily)   showBar = false;
                if (pkey === 'monthly' && !settingsNow.progress.showOn.monthly) showBar = false;
                if (pkey === 'yearly'  && !settingsNow.progress.showOn.yearly)  showBar = false;

                if (showBar && full > 0) {
                    const shimmer = eff.shimmer120 && (valueForBar / target) >= 1.2;
                    const bar = makeProgressBar(valueForBar, target, color, eff.showPercent, shimmer);
                    if (bar) resultsItemDiv.appendChild(bar);
                }

                // 6) “Missing …” line (same target as the bar)
                let showMissing = true;
                if (pkey === 'daily'   && !settingsNow.missing.showOn.daily)   showMissing = false;
                if (pkey === 'monthly' && !settingsNow.missing.showOn.monthly) showMissing = false;
                if (pkey === 'yearly'  && !settingsNow.missing.showOn.yearly)  showMissing = false;

                if (showMissing && full > 0) {
                    const missing = clamp(target - valueForBar, 0);
                    if (missing > 0) {
                        const miss = document.createElement('div');
                        miss.style.marginLeft = '12px';
                        miss.style.opacity = '.85';

                        if (activeTab === 'influence') {
                            miss.textContent = missingInfluenceLine(missing, settingsNow, learnedAverages);
                        } else if (activeTab === 'rations') {
                            miss.textContent = `Missing ${missing} ${sPlural(missing, 'claim')} for 100%`;
                        } else if (activeTab === 'deposits' && detailedForDeposits?.enabled) {
                            const rules = detailedForDeposits.rules || [];
                            const parts = rules.map(r => {
                                let g = goalForPeriod(r.weekly, bounds);
                                if ((bounds?.type === 'week' || bounds?.type === 'month') && eff.paceAware) g = pacedTarget(g, bounds, true);
                                const need = clamp(g - (items[r.item] || 0), 0);
                                return need > 0 ? `${need} ${r.item}` : null;
                            }).filter(Boolean);
                            if (parts.length) {
                                miss.textContent = 'Missing ' + (parts.length === 2 ? parts.join(' and ') : parts.join(' & '));
                            } else {
                                const fallbackMissing = clamp(target - valueForBar, 0);
                                if (fallbackMissing > 0) miss.textContent = `Missing ${fallbackMissing} items for 100%`;
                            }
                        } else {
                            miss.textContent = `Missing ${missing} items for 100%`;
                        }
                        resultsItemDiv.appendChild(miss);
                    }
                }
            }

            const frag = document.createDocumentFragment();

            names.forEach((memberName) => {
                const isCurrent = currentSet.has(memberName);
                if (!isCurrent && !showFormer) return;

                const resultsItemDiv = document.createElement('div');
                resultsItemDiv.classList.add('fh-row');

                const nameStrong = document.createElement('strong');
                nameStrong.textContent = memberName + (isCurrent ? '' : ' (not in faction)');
                resultsItemDiv.appendChild(nameStrong);

                if (activeTab === 'rations' || activeTab === 'influence') {
                    const s = activeTab === 'rations' ? (rationStreaks.get(memberName) || { current: 0 }) : (influenceStreaks.get(memberName) || { current: 0 });
                    if (s.current > 0) {
                        const streak = document.createElement('span');
                        streak.className = 'fh-streak';
                        streak.title = `Streak: x${s.current}`;
                        streak.textContent = ` 🔥 x${s.current}`;
                        resultsItemDiv.appendChild(streak);
                    }
                }

                const items = grouped[memberName] || {};

                if (selectedYear === 'DAILY') {
                    let done = false;
                    if (activeTab === 'rations') {
                        done = (grouped[memberName]?.__claims || 0) > 0;
                    } else if (activeTab === 'influence') {
                        done = (grouped[memberName]?.influence || 0) > 0;
                    } else if (activeTab === 'deposits') {
                        const bag = grouped[memberName] || {};
                        done = Object.values(bag).reduce((s, v) => s + (Number(v) || 0), 0) > 0;
                    }

                    const row = document.createElement('div');
                    row.textContent =
                        activeTab === 'rations'   ? `Claimed: ${done ? '✅' : '❌'}` :
                    activeTab === 'influence' ? `Raided: ${done ? '✅' : '❌'}` :
                    `Deposited: ${done ? '✅' : '❌'}`;
                    row.style.marginLeft = '12px';
                    resultsItemDiv.appendChild(row);
                } else {

                    if (activeTab === 'rations') {
                        const claims = items?.__claims || 0;
                        applyCategory(
                            { resultsItemDiv, nameStrong, memberName },
                            { value: claims, weeklyGoal: goals.rations?.weekly ?? 5, eff: effRat, label: 'Claimed', isClaims: true },
                            items
                        );

                    } else if (activeTab === 'deposits') {
                        const total = Object.values(items).reduce((s, v) => s + v, 0);

                        const summary = document.createElement('div');
                        summary.style.cursor = 'pointer'; summary.style.marginLeft = '15px'; summary.style.fontSize = '13px'; summary.style.color = '#ccc';
                        const totalText = document.createElement('span'); totalText.textContent = `Total Deposits: ${total} Items `;
                        const toggleIcon = document.createElement('span'); toggleIcon.textContent = '+'; toggleIcon.style.fontWeight = 'bold'; toggleIcon.style.fontSize = '12px'; toggleIcon.style.color = '#aaa';
                        summary.append(totalText, toggleIcon);
                        const details = document.createElement('div'); details.style.display = 'none'; details.style.marginLeft = '30px'; details.style.marginTop = '4px';
                        for (const [k, v] of Object.entries(items)) { const row = document.createElement('div'); row.textContent = `${k}: ${v}`; row.style.marginLeft = '12px'; details.appendChild(row); }
                        summary.onclick = () => { const hidden = details.style.display === 'none'; details.style.display = hidden ? 'block' : 'none'; toggleIcon.textContent = hidden ? '−' : '+'; };
                        resultsItemDiv.append(summary, details);

                        const det = settingsNow.deposits?.detailed || { enabled:false, rules:[] };
                        applyCategory(
                            { resultsItemDiv, nameStrong, memberName },
                            {
                                value: total,
                                weeklyGoal: goals.deposits?.weekly ?? 0,
                                eff: effDep,
                                label: 'Deposited',
                                isClaims: false,
                                detailedForDeposits: { ...det, rules: det.rules, itemsByName: items },
                                addValueLine: false
                            },
                            items
                        );

                    } else if (activeTab === 'influence') {
                        const v = items.influence || 0;
                        applyCategory(
                            { resultsItemDiv, nameStrong, memberName },
                            { value: v, weeklyGoal: goals.influence?.weekly ?? 2500, eff: effInf, label: 'Influence', isClaims: false },
                            items
                        );
                    }
                }

                resultsItemDiv.style.marginBottom = '10px';
                frag.appendChild(resultsItemDiv);
            });

            results.appendChild(frag);
        }

        toggleFormer.onclick = () => { showFormer = !showFormer; rebuild(); };

        // Refresh hook (called after Save in Settings)
        panelEl.__fh_refresh = () => rebuild();

        // Initial draw
        rebuild();

    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Member sub-panel (as before with tiny polish)
    // ─────────────────────────────────────────────────────────────────────────────
    function renderMemberSubPanel(name) {
        const subPanelId = 'member-subpanel';
        const existing = document.getElementById(subPanelId);
        if (existing) existing.remove();

        const member = getCurrentMembers().find(m => m.name === name);
        const role = member?.role || 'Unknown';
        let filterMode = 'total';
        let selectedYear = null;
        let selectedMonth = null;
        const level = member?.level ? `Level ${member.level}` : 'Unknown';

        const parentPanelEl = document.getElementById('stats-panel');
        if (!parentPanelEl) return;

        const subPanel = document.createElement('div');
        subPanel.id = subPanelId;
        Object.assign(subPanel.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: '#1c1c1c', color: 'white', zIndex: 10001,
            transform: 'translate3d(100%,0,0)',
            transition: 'transform 260ms cubic-bezier(.22,.61,.36,1)',
            willChange: 'transform',
            display: 'flex', flexDirection: 'column'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', alignItems: 'center', padding: '10px 12px',
            backgroundColor: '#222', borderBottom: '1px solid #333', fontSize: '14px'
        });

        const backBtn = document.createElement('span');
        backBtn.textContent = '←';
        Object.assign(backBtn.style, { cursor: 'pointer', fontSize: '16px', marginRight: '10px', color: '#ccc' });
        backBtn.onclick = () => {
            subPanel.style.transform = 'translateX(100%)';
            setTimeout(() => { subPanel.remove(); enableMainControls(true); }, 300);
        };
        header.appendChild(backBtn);

        const title = document.createElement('span');
        title.innerHTML = `<strong>${name}</strong> [${role}] - ${level}`;
        title.style.marginRight = '10px';
        header.appendChild(title);
        const spacer = document.createElement('div'); spacer.style.flex = '1'; header.appendChild(spacer);

        const filterWrapper = document.createElement('div');
        filterWrapper.style.display = 'flex'; filterWrapper.style.gap = '4px';
        const modes = ['Total', 'Year', 'Month']; const buttons = {};
        modes.forEach(mode => {
            const key = mode.toLowerCase();
            const btn = document.createElement('button');
            btn.textContent = mode;
            Object.assign(btn.style, { fontSize: '11px', padding: '2px 6px', border: 'none', borderRadius: '4px', background: '#444', color: '#fff', cursor: 'pointer', position: 'relative', zIndex: '10003' });
            const isMonth = key === 'month'; const isDisabled = isMonth && filterMode !== 'year';
            btn.disabled = isDisabled; btn.style.opacity = isDisabled ? '0.3' : '1'; btn.style.pointerEvents = isDisabled ? 'none' : 'auto';
            btn.onclick = () => {
                if (btn.disabled) return;
                filterMode = key;
                if (key === 'total') { selectedYear = null; selectedMonth = null; updateStatsSection(); }
                if (key === 'year')  { showYearPicker(y => { selectedYear = y; selectedMonth = null; updateStatsSection(); }, btn); }
                if (key === 'month') {
                    if (!selectedYear) { alert('Please select a year first.'); return; }
                    showMonthPicker(m => { selectedMonth = m; updateStatsSection(); }, selectedYear, btn);
                }
            };
            buttons[key] = btn; filterWrapper.appendChild(btn);
        });

        header.appendChild(filterWrapper);
        subPanel.appendChild(header);

        const rations = STORE.get(KEYS.RATIONS, []).filter(x => x.name === name);
        const influence = STORE.get(KEYS.INFL, []).filter(x => x.name === name);
        const deposits = STORE.get(KEYS.DEPOSITS, []).filter(x => x.name === name);

        const rIdx = new Set(rations.map(l => dayIndexFromStr(l.date)));
        const iIdx = new Set(influence.map(l => dayIndexFromStr(l.date)));
        const rCur = currentStreakFromSet(rIdx, todayStr(), true), rBest = bestStreakFromSet(rIdx);
        const iCur = currentStreakFromSet(iIdx, todayStr(), true), iBest = bestStreakFromSet(iIdx);

        const body = document.createElement('div');
        body.style.padding = '12px'; body.style.overflowY = 'auto'; body.style.maxHeight = 'calc(100vh - 60px)';

        function createSection(titleText, dataMap) {
            const section = document.createElement('div'); section.style.marginBottom = '18px';
            const sectionTitle = document.createElement('div'); sectionTitle.innerHTML = titleText;
            sectionTitle.style.fontWeight = 'bold'; sectionTitle.style.marginBottom = '6px'; sectionTitle.style.color = '#6cf';
            section.appendChild(sectionTitle);
            if (!Object.keys(dataMap).length) {
                const empty = document.createElement('div'); empty.textContent = 'No data found.'; empty.style.fontSize = '12px'; empty.style.color = '#888'; section.appendChild(empty);
            } else {
                Object.entries(dataMap).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
                    const row = document.createElement('div'); row.textContent = `${k}: ${v}`; row.style.marginLeft = '10px'; row.style.fontSize = '13px'; section.appendChild(row);
                });
            }
            return section;
        }

        function updateStatsSection() {
            body.innerHTML = '';
            function isMatch(dateStr) {
                if (filterMode === 'total') return true;
                if (filterMode === 'year')  return dateStr.startsWith(selectedYear);
                if (filterMode === 'month') return dateStr.startsWith(`${selectedYear}-${selectedMonth}`);
                return false;
            }
            const rFiltered = rations.filter(log => isMatch(log.date));
            const iFiltered = influence.filter(log => isMatch(log.date));
            const dFiltered = deposits.filter(log => isMatch(log.date));

            const rTotals = {}; rFiltered.forEach(l => { rTotals[l.item] = (rTotals[l.item]||0) + l.amount; });
            const iTotal  = iFiltered.reduce((s,l)=>s + l.amount, 0);
            const dTotals = {}; dFiltered.forEach(l => { dTotals[l.item] = (dTotals[l.item]||0) + l.amount; });

            const rTitle = `📦 Rations Claimed <span style="color:#ff944d">🔥 x${rCur}</span> <span style="color:#aaa">best ${rBest}</span>`;
            const iTitle = `💪 Influence Gained <span style="color:#ff944d">🔥 x${iCur}</span> <span style="color:#aaa">best ${iBest}</span>`;
            body.appendChild(createSection(rTitle, rTotals));
            body.appendChild(createSection(iTitle, { Total: iTotal }));
            body.appendChild(createSection('🏗️ Deposits Made', dTotals));

            Object.keys(buttons).forEach(k => {
                const btn = buttons[k];
                const isMonth = k === 'month';
                const isDisabled = isMonth && filterMode !== 'year';
                btn.disabled = isDisabled;
                btn.style.pointerEvents = isDisabled ? 'none' : 'auto';
                btn.style.opacity = isDisabled ? '0.3' : '1';
                btn.style.backgroundColor = (k === filterMode) ? '#3a7' : '#444';
            });
        }
        updateStatsSection();
        subPanel.appendChild(body);

        const footer = document.createElement('div');
        footer.style.display = 'flex'; footer.style.justifyContent = 'space-between';
        footer.style.alignItems = 'center'; footer.style.borderTop = '1px solid #333';
        footer.style.padding = '8px 12px'; footer.style.fontSize = '13px'; footer.style.marginTop = 'auto'; footer.style.color = '#ccc';

        const memberHistory = STORE.get(KEYS.HISTORY, []).filter(h => h.name === name);
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm   = String(now.getMonth() + 1).padStart(2, '0');
        const daysInMonth = new Date(yyyy, now.getMonth() + 1, 0).getDate();

        const activeDays = new Set();
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${yyyy}-${mm}-${String(d).padStart(2, '0')}`;
            const date = new Date(dateStr);
            for (const period of memberHistory) {
                const start = new Date(period.joined || period.start);
                const end   = period.left ? new Date(period.left) : (period.end ? new Date(period.end) : now);
                if (!isNaN(start) && date >= start && date <= end) activeDays.add(dateStr);
            }
        }
        const eligibleDays  = Array.from(activeDays);
        const monthlyR      = rations.filter(x => x.date.startsWith(`${yyyy}-${mm}`));
        const monthlyI      = influence.filter(x => x.date.startsWith(`${yyyy}-${mm}`));
        const rationDays    = new Set(monthlyR.map(x => x.date));
        const raidDays      = new Set(monthlyI.map(x => x.date));
        const totalEligible = eligibleDays.length;
        const rScore = totalEligible > 0 ? (rationDays.size / totalEligible) * 20 : 0;
        const iScore = totalEligible > 0 ? (raidDays.size   / totalEligible) * 80 : 0;
        const finalScore = Math.round(rScore + iScore);

        const left  = document.createElement('div'); left.textContent  = `📦 ${rationDays.size}/${totalEligible}   💪 ${raidDays.size}/${totalEligible}`;
        const right = document.createElement('div'); right.textContent = `Activity Score: ${finalScore}%`;
        right.style.fontWeight = 'bold'; right.style.color = finalScore >= 90 ? '#3f3' : finalScore >= 60 ? '#ff3' : '#f66';
        footer.append(left, right);
        subPanel.appendChild(footer);

        parentPanelEl.appendChild(subPanel);
        requestAnimationFrame(() => { subPanel.style.transform = 'translateX(0)'; });
        enableMainControls(false, subPanel);
    }

    // Year / Month pickers
    function showYearPicker(onSelect, buttonEl) {
        const existing = document.getElementById('zedcity-popup');
        if (existing) { existing.remove(); return; }
        const rect = buttonEl.getBoundingClientRect();
        const popup = document.createElement('div'); popup.id = 'zedcity-popup';
        const popupWidth = 160; let left = rect.left + window.scrollX; if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 10;
        Object.assign(popup.style, { position: 'absolute', top: `${rect.bottom + window.scrollY + 6}px`, left: `${left}px`, width: `${popupWidth}px`, backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px', zIndex: 10002, color: 'white', fontSize: '13px', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' });

        const logs = STORE.get(KEYS.RATIONS, [])
        .concat(STORE.get(KEYS.INFL, []))
        .concat(STORE.get(KEYS.DEPOSITS, []));
        const years = [...new Set(logs.map(log => log.date.split('-')[0]))].sort().reverse();

        years.forEach(y => {
            const row = document.createElement('div'); row.textContent = y; row.style.padding = '4px 8px'; row.style.cursor = 'pointer';
            row.onmouseenter = () => { row.style.backgroundColor = '#444'; };
            row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
            row.onclick = () => { document.body.removeChild(popup); onSelect(y); };
            popup.appendChild(row);
        });
        document.body.appendChild(popup);
    }

    function showMonthPicker(onSelect, year, buttonEl) {
        const existing = document.getElementById('zedcity-popup');
        if (existing) { existing.remove(); return; }
        const rect = buttonEl.getBoundingClientRect();
        const popup = document.createElement('div'); popup.id = 'zedcity-popup';
        const popupWidth = 180; let left = rect.left + window.scrollX; if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 10;
        Object.assign(popup.style, { position: 'absolute', top: `${rect.bottom + window.scrollY + 6}px`, left: `${left}px`, width: `${popupWidth}px`, backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '8px', zIndex: 10002, color: 'white', fontSize: '13px', boxShadow: '0 4px 10px rgba(0,0,0,0.6)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' });
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        months.forEach(m => {
            const label = new Date(`${year}-${String(m).padStart(2, '0')}-01`).toLocaleString('default', { month: 'short' });
            const row = document.createElement('div'); row.textContent = label; row.style.padding = '4px 6px'; row.style.cursor = 'pointer'; row.style.textAlign = 'center';
            row.onmouseenter = () => { row.style.backgroundColor = '#444'; };
            row.onmouseleave = () => { row.style.backgroundColor = 'transparent'; };
            row.onclick = () => { document.body.removeChild(popup); onSelect(String(m).padStart(2, '0')); };
            popup.appendChild(row);
        });
        document.body.appendChild(popup);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // HUB top-bar icon & menu
    // ─────────────────────────────────────────────────────────────────────────────
    function injectHubIcon() {
        const maxRetries = 20; let attempts = 0;
        const interval = setInterval(() => {
            const topBar = document.querySelector('header .q-toolbar .items-center');
            if (!topBar) { if (++attempts >= maxRetries) clearInterval(interval); return; }
            if (document.getElementById('zedcity-hub-icon')) { clearInterval(interval); return; }

            const hubIcon = document.createElement('div');
            hubIcon.id = 'zedcity-hub-icon';
            const hubIconImg = document.createElement('img');
            hubIconImg.src = 'https://i.imgur.com/6CaVJMO.png';
            hubIconImg.onerror = () => {
                hubIcon.innerHTML = 'HUB';
                Object.assign(hubIcon.style, { fontWeight: 'bold', fontSize: '12px', color: '#fff', marginTop: '4px' });
            };
            hubIconImg.alt = 'Hub Icon';
            Object.assign(hubIcon.style, {
                width: '38px', height: '38px', marginLeft: '6px', marginTop: '4px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent',
                borderRadius: '6px', transition: 'background-color 0.2s ease'
            });
            Object.assign(hubIconImg.style, { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' });
            hubIcon.appendChild(hubIconImg);
            hubIcon.title = 'Open HUB';
            hubIcon.onclick = (e) => { e.stopPropagation(); showHubMainMenu(hubIcon); };
            hubIcon.onmouseenter = () => { hubIcon.style.backgroundColor = '#203447'; };
            hubIcon.onmouseleave = () => { hubIcon.style.backgroundColor = 'transparent'; };
            document.addEventListener('click', () => { const menu = document.getElementById('hub-main-menu'); if (menu) menu.remove(); });
            topBar.appendChild(hubIcon);
            clearInterval(interval);
        }, 300);
    }
    injectHubIcon();

    function showHubMainMenu(anchor) {
        const existing = document.getElementById('hub-main-menu');
        if (existing) return existing.remove();

        const menu = document.createElement('div');
        menu.id = 'hub-main-menu';
        Object.assign(menu.style, {
            position: 'absolute',
            top: `${anchor.getBoundingClientRect().bottom + window.scrollY + 6}px`,
            left: `${anchor.getBoundingClientRect().left + window.scrollX}px`,
            backgroundColor: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '8px',
            zIndex: 100002,
            color: 'white',
            fontSize: '14px',
            minWidth: '160px'
        });

        const item = document.createElement('div');
        item.textContent = '🏛️ Faction HUB';
        item.style.padding = '6px 10px';
        item.style.cursor = 'pointer';
        item.onmouseenter = () => { item.style.backgroundColor = '#333'; };
        item.onmouseleave = () => { item.style.backgroundColor = 'transparent'; };
        item.onclick = (e) => { menu.remove(); renderStatisticsPanel(e.currentTarget); };

        menu.appendChild(item);
        document.body.appendChild(menu);
    }
})();
