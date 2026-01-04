// ==UserScript==
// @name         DeepSeek Conversation Search [DSCS]
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds icon to the sidebar that opens a modal with chat search functionality
// @author       Dramorian
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525223/DeepSeek%20Conversation%20Search%20%5BDSCS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/525223/DeepSeek%20Conversation%20Search%20%5BDSCS%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =======================
    // CONFIG (editable via localStorage keys)
    // =======================
    const CONFIG = {
        PAGE_COUNT: Number(localStorage.getItem('dscs_page_count')) || 50,
        CONTENT_SEARCH_COUNT: Number(localStorage.getItem('dscs_content_count')) || 20,
        MAX_CONTENT_PAGES: Number(localStorage.getItem('dscs_max_pages')) || 10,

        // modal pagination
        RESULTS_PAGE_SIZE: Number(localStorage.getItem('dscs_results_page_size')) || 20,

        // concurrency & throttling (more conservative defaults to reduce rate limit)
        REQUEST_CONCURRENCY: Number(localStorage.getItem('dscs_request_concurrency')) || 2,
        HISTORY_CONCURRENCY: Number(localStorage.getItem('dscs_history_concurrency')) || 4,
        MIN_REQUEST_DELAY_MS: Number(localStorage.getItem('dscs_min_delay')) || 400,
        FETCH_TIMEOUT_MS: Number(localStorage.getItem('dscs_fetch_timeout')) || 20000,
        MAX_RETRIES: Number(localStorage.getItem('dscs_max_retries')) || 5,
        BACKOFF_BASE_MS: Number(localStorage.getItem('dscs_backoff_base')) || 1000,


        // request headers (override via localStorage if needed)
        APP_VERSION: localStorage.getItem('dscs_app_version') || '20241129.1',
        CLIENT_LOCALE: localStorage.getItem('dscs_client_locale') || 'en_US',
        CLIENT_VERSION: localStorage.getItem('dscs_client_version') || '1.3.0-auto-resume',
        ACCEPT_LANGUAGE: localStorage.getItem('dscs_accept_language') || 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',

        // caching TTLs
        PAGE_TTL_MS: Number(localStorage.getItem('dscs_page_ttl')) || 24 * 60 * 60 * 1000, // 24 hours
        HISTORY_TTL_MS: Number(localStorage.getItem('dscs_history_ttl')) || 7 * 24 * 60 * 60 * 1000, // 7 days

        // token bucket rate limiter (tokens = capacity; refillRate = tokens/sec)
        TOKEN_BUCKET_CAPACITY: Number(localStorage.getItem('dscs_token_capacity')) || 4,
        TOKEN_BUCKET_REFILL_PER_SEC: Number(localStorage.getItem('dscs_token_refill')) || 0.5, // half token per second

        AUTO_SYNC_ENABLED: (localStorage.getItem('dscs_auto_sync') ?? '1') !== '0',
        AUTO_SYNC_INTERVAL_MS: Number(localStorage.getItem('dscs_auto_sync_interval_ms')) || 5 * 60_000, // 5 min
        AUTO_SYNC_PAGES: Number(localStorage.getItem('dscs_auto_sync_pages')) || 2, // newest N pages
        AUTO_PREFETCH_NEW_HISTORIES: (localStorage.getItem('dscs_auto_prefetch_new_histories') ?? '0') === '1',
        AUTO_PREFETCH_LIMIT: Number(localStorage.getItem('dscs_auto_prefetch_limit')) || 20
    };

    // =======================
    // Auto sync checkpoints
    // =======================
    const DSCS_LAST_AUTO_SYNC_AT_KEY = 'dscs_last_auto_sync_at';
    const DSCS_LAST_SYNC_UPDATED_AT_KEY = 'dscs_last_sync_updated_at';

    function toNum(x) {
        const n = Number(x);
        return Number.isFinite(n) ? n : 0;
    }

    async function autoSyncRecentSessions({ signal, force = false } = {}) {
        if (!CONFIG.AUTO_SYNC_ENABLED) return { skipped: true, reason: 'disabled' };

        const token = getStoredToken();
        if (!token) return { skipped: true, reason: 'no_token' };

        const now = Date.now();
        const lastRun = toNum(localStorage.getItem(DSCS_LAST_AUTO_SYNC_AT_KEY));
        if (!force && (now - lastRun < CONFIG.AUTO_SYNC_INTERVAL_MS)) {
            return { skipped: true, reason: 'interval' };
        }
        localStorage.setItem(DSCS_LAST_AUTO_SYNC_AT_KEY, String(now));

        const checkpointUpdatedAt = toNum(localStorage.getItem(DSCS_LAST_SYNC_UPDATED_AT_KEY));

        let lastSeq = null;
        let maxSeenUpdatedAt = checkpointUpdatedAt;
        const newOrUpdatedSessions = [];

        const perPage = Math.min(200, Math.max(50, CONFIG.PAGE_COUNT));
        const pagesToFetch = Math.max(1, Math.min(10, Number(CONFIG.AUTO_SYNC_PAGES) || 1));

        for (let page = 0; page < pagesToFetch; page++) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            const url =
                  `https://chat.deepseek.com/api/v0/chat_session/fetch_page?count=${perPage}` +
                  (lastSeq ? `&before_seq_id=${lastSeq}` : '');

            const res = await requestQueue.enqueue(
                () => fetchWithRetries(url, { method: 'GET', headers: makeHeaders(token), signal }),
                { signal }
            );

            const data = await res.json();
            const biz = data?.data?.biz_data;
            if (!(data && data.code === 0 && biz)) break;

            const sessions = biz.chat_sessions || [];
            if (sessions.length === 0) break;

            // Upsert sessions into IDB
            await idbSessionsPutMany(sessions).catch(() => { });

            // Update checkpoint / collect "newer than checkpoint"
            let oldestUpdatedAtOnPage = Infinity;
            for (const s of sessions) {
                const ua = toNum(s?.updated_at);
                if (ua > maxSeenUpdatedAt) maxSeenUpdatedAt = ua;
                if (ua > 0 && ua < oldestUpdatedAtOnPage) oldestUpdatedAtOnPage = ua;
                if (ua > checkpointUpdatedAt) newOrUpdatedSessions.push(s);
            }

            // Prepare next page cursor
            const seqIds = sessions.map(s => Number(s?.seq_id)).filter(Number.isFinite);
            if (seqIds.length > 0) lastSeq = Math.min(...seqIds);

            // Early stop: we've reached sessions older than what we already synced
            if (checkpointUpdatedAt > 0 && oldestUpdatedAtOnPage <= checkpointUpdatedAt) break;

            if (!biz.has_more) break;
        }

        if (maxSeenUpdatedAt > checkpointUpdatedAt) {
            localStorage.setItem(DSCS_LAST_SYNC_UPDATED_AT_KEY, String(maxSeenUpdatedAt));
        }

        // Optional: prefetch histories for the newest sessions (bounded)
        if (CONFIG.AUTO_PREFETCH_NEW_HISTORIES && newOrUpdatedSessions.length > 0) {
            const newest = newOrUpdatedSessions.slice(0, CONFIG.AUTO_PREFETCH_LIMIT);
            const ids = newest.map(s => String(s?.id)).filter(Boolean);

            const cached = await idbHistoriesGetMany(ids).catch(() => new Map());
            const toFetch = [];

            for (const id of ids) {
                if (!cached.has(id)) toFetch.push(id);
                if (toFetch.length >= CONFIG.AUTO_PREFETCH_LIMIT) break;
            }

            const batches = chunkArray(toFetch, CONFIG.HISTORY_CONCURRENCY);
            for (const batch of batches) {
                if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
                await Promise.allSettled(batch.map(id => fetchHistoryMessages(id, { signal })));
            }
        }

        return { skipped: false, newCount: newOrUpdatedSessions.length };
    }

    // =======================
    // Styles
    // =======================
    GM_addStyle(`
        .dscs-icon { cursor: pointer; padding: 8px; display:flex; align-items:center; justify-content:center; }
        .dscs-icon svg { width:20px; height:20px; }

        .dscs-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 99999; width: 560px; max-width: calc(100% - 24px); max-height: 80vh; display: flex; flex-direction: column; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); overflow: hidden; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .dscs-modal.light { background: #fff; color: #111; border: 1px solid #ddd; }
        .dscs-modal.dark { background: #222; color: #eee; border: 1px solid #333; }

        .dscs-header { padding: 12px 14px; display:flex; gap:10px; align-items:center; border-bottom:1px solid rgba(0,0,0,0.06); }
        .dscs-header.dark { border-bottom:1px solid rgba(255,255,255,0.06); }

        .dscs-search { flex:1; min-height:34px; border-radius:6px; padding:8px 12px; outline:none; border:1px solid #ddd; background:transparent; }
        .dscs-search.dark { border:1px solid #444; }

        .dscs-close { cursor:pointer; }

        .dscs-options { display:flex; align-items:center; gap:8px; font-size:13px; margin-left:6px; }

        .dscs-list { position:relative; padding:12px; overflow:auto; max-height:46vh; display:flex; flex-direction:column; gap:8px; }

        .dscs-item { padding:10px; border-radius:6px; cursor:pointer; user-select:none; }
        .dscs-item.light:hover { background:#f6f6f6; }
        .dscs-item.dark:hover { background:#2b2b2b; }

        .dscs-snippet { font-size:0.85em; color: #666; margin-top:6px; white-space:pre-wrap; }
        .dscs-modal.dark .dscs-snippet { color: #b8b8b8; }

        .dscs-snippet mark { padding: 0 2px; border-radius: 3px; background: rgba(255,235,59,0.55); color: inherit; }
        .dscs-modal.dark .dscs-snippet mark { background: rgba(255,235,59,0.25); }

        .dscs-loading { padding:12px; text-align:center;color:#888; }
        .dscs-error { padding:12px; text-align:center; color:#b44; }

        .dscs-spinner { display:inline-block; width:16px; height:16px; border:2px solid rgba(0,0,0,0.1); border-left-color: currentColor; border-radius:50%; animation:dscs-spin .8s linear infinite; vertical-align:middle; margin-right:8px; }
        @keyframes dscs-spin { to { transform: rotate(360deg); } }

        .dscs-footer { padding:8px 12px; border-top:1px solid rgba(0,0,0,0.06); display:flex; justify-content:space-between; align-items:center; font-size:12px; }
        .dscs-modal.dark .dscs-footer { border-top:1px solid rgba(255,255,255,0.06); }

        .dscs-small { font-size:12px; color:#888; }
        .dscs-modal.dark .dscs-small { color:#aaa; }

        .dscs-button { padding:6px 8px; border-radius:6px; cursor:pointer; border:1px solid #ccc; background:transparent; }
        .dscs-modal.dark .dscs-button { border-color:#444; color:#eee; }

        /* Pagination */
        .dscs-pagination {
            padding: 12px;
            border-top: 1px solid rgba(0,0,0,0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }
        .dscs-modal.dark .dscs-pagination { border-top: 1px solid rgba(255,255,255,0.06); }

        .dscs-pagination-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .dscs-pagination-info { font-size: 13px; color: #666; }
        .dscs-modal.dark .dscs-pagination-info { color:#aaa; }

        .dscs-page-info { font-size: 13px; min-width: 110px; text-align: center; }

        .dscs-prev-btn:disabled,
        .dscs-next-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .dscs-page-jump { font-size: 13px; display: flex; align-items: center; gap: 4px; }
        .dscs-page-input {
            width: 50px;
            padding: 4px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
            font-size: 13px;
            background: transparent;
            color: inherit;
        }
        .dscs-modal.dark .dscs-page-input { border-color: #444; }

        .dscs-list-loading {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .dscs-modal.dark .dscs-list-loading { background: rgba(0,0,0,0.3); }
    `);

    // =======================
    // IndexedDB
    // =======================
    const IDB_NAME = 'dscs-cache-v2';
    const IDB_VERSION = 2;
    const IDB_STORE_SESSIONS = 'sessions';
    const IDB_STORE_HISTORIES = 'histories';

    let dbPromise = null;
    function openDb() {
        if (dbPromise) return dbPromise;

        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, IDB_VERSION);

            req.onupgradeneeded = () => {
                const db = req.result;
                const tx = req.transaction;

                // Sessions store + index
                const sessionsStore = db.objectStoreNames.contains(IDB_STORE_SESSIONS)
                ? tx.objectStore(IDB_STORE_SESSIONS)
                : db.createObjectStore(IDB_STORE_SESSIONS, { keyPath: "id" });

                if (!sessionsStore.indexNames.contains("updated_at")) {
                    sessionsStore.createIndex("updated_at", "updated_at", { unique: false });
                }

                // Histories store + index
                const historiesStore = db.objectStoreNames.contains(IDB_STORE_HISTORIES)
                ? tx.objectStore(IDB_STORE_HISTORIES)
                : db.createObjectStore(IDB_STORE_HISTORIES, { keyPath: "id" });

                if (!historiesStore.indexNames.contains("session_id")) {
                    historiesStore.createIndex("session_id", "session_id", { unique: true });
                }
            };

            req.onsuccess = () => {
                const db = req.result;

                // Close this connection if another tab upgrades the DB
                db.onversionchange = () => {
                    try {
                        db.close();
                    } catch (_) { }
                };

                resolve(db);
            };

            req.onerror = () => {
                dbPromise = null; // allow retry
                reject(req.error);
            };

            req.onblocked = () => {
                // Upgrade is blocked by another open connection (another tab/userscript instance)
                console.warn(
                    `[DSCS] IndexedDB open/upgrade blocked for "${IDB_NAME}". Close other tabs using it and try again.`
                );
            };
        });

        return dbPromise;
    }


    function reqToPromise(req) {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    function txDone(tx) {
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
            tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction error'));
        });
    }

    function unwrapSessionRecord(record) {
        if (!record) return null;
        return record.value || record;
    }

    async function idbSessionPut(session) {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readwrite');
            const store = tx.objectStore(IDB_STORE_SESSIONS);
            // keep backward-compatible wrapper + also keep top-level fields for indexing
            const record = Object.assign({}, session, {
                id: String(session.id),
                storedAt: Date.now(),
                value: session
            });
            store.put(record);
            await txDone(tx);
            sessionsSnapshot.invalidate();
            return true;
        } catch (_) {
            return false;
        }
    }

    async function idbSessionsPutMany(sessions) {
        const list = Array.isArray(sessions) ? sessions : [];
        if (list.length === 0) return false;

        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readwrite');
            const store = tx.objectStore(IDB_STORE_SESSIONS);
            const storedAt = Date.now();

            for (const session of list) {
                if (!session || session.id == null) continue;
                const record = Object.assign({}, session, {
                    id: String(session.id),
                    storedAt,
                    value: session
                });
                store.put(record);
            }

            await txDone(tx);
            sessionsSnapshot.invalidate();
            return true;
        } catch (_) {
            return false;
        }
    }


    async function idbSessionsCount() {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readonly');
            const store = tx.objectStore(IDB_STORE_SESSIONS);
            const countReq = store.count();
            const total = await reqToPromise(countReq);
            await txDone(tx);
            return Number(total || 0);
        } catch (_) {
            return 0;
        }
    }

    async function idbSessionsGetPage(page = 1, pageSize = 20, sortField = 'updated_at') {
        const safePage = Math.max(1, Number(page) || 1);
        const safeSize = Math.max(1, Math.min(200, Number(pageSize) || 20));

        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readonly');
            const store = tx.objectStore(IDB_STORE_SESSIONS);
            const index = store.index(sortField);

            const items = [];
            let skip = (safePage - 1) * safeSize;
            let didAdvance = false;

            let totalCount = 0;
            let countDone = false;
            let itemsDone = false;

            const promise = new Promise((resolve) => {
                const maybeResolve = () => {
                    if (!countDone || !itemsDone) return;
                    resolve({
                        items: items.filter(Boolean),
                        total: Number(totalCount || 0),
                        page: safePage,
                        pageSize: safeSize,
                        totalPages: Math.ceil((Number(totalCount || 0)) / safeSize)
                    });
                };

                const countReq = store.count();
                countReq.onsuccess = () => {
                    totalCount = Number(countReq.result || 0);
                    countDone = true;
                    maybeResolve();
                };
                countReq.onerror = () => {
                    totalCount = 0;
                    countDone = true;
                    maybeResolve();
                };

                const cursorReq = index.openCursor(null, 'prev');
                cursorReq.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (!cursor) {
                        itemsDone = true;
                        maybeResolve();
                        return;
                    }

                    if (!didAdvance && skip > 0) {
                        didAdvance = true;
                        const adv = skip;
                        skip = 0;
                        cursor.advance(adv);
                        return;
                    }

                    items.push(unwrapSessionRecord(cursor.value));
                    if (items.length >= safeSize) {
                        itemsDone = true;
                        maybeResolve();
                        return;
                    }

                    cursor.continue();
                };
                cursorReq.onerror = () => {
                    itemsDone = true;
                    maybeResolve();
                };
            });

            const result = await promise;
            try { await txDone(tx); } catch (_) { }
            return result;
        } catch (_) {
            return { items: [], total: 0, page: 1, pageSize: safeSize, totalPages: 0 };
        }
    }

    async function idbSessionsGetAllByUpdatedAt() {
        // Used for title search + content search building
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readonly');
            const store = tx.objectStore(IDB_STORE_SESSIONS);
            const index = store.index('updated_at');

            const out = [];
            const cursorReq = index.openCursor(null, 'prev');
            await new Promise((resolve, reject) => {
                cursorReq.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (!cursor) return resolve(true);
                    const s = unwrapSessionRecord(cursor.value);
                    if (s) out.push(s);
                    cursor.continue();
                };
                cursorReq.onerror = () => reject(cursorReq.error);
            });
            await txDone(tx);
            return out;
        } catch (_) {
            return [];
        }
    }

    async function idbHistoryGetRecord(sessionId) {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readonly');
            const store = tx.objectStore(IDB_STORE_HISTORIES);
            const rec = await reqToPromise(store.get(String(sessionId)));
            await txDone(tx);
            if (!rec) return null;
            if (rec.expiresAt && Number(rec.expiresAt) < Date.now()) {
                // Best-effort cleanup of expired records
                idbHistoryDelete(sessionId).catch(() => { });
                return null;
            }
            return rec;
        } catch (_) {
            return null;
        }
    }

    async function idbHistoryPut(sessionId, messages) {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readwrite');
            const store = tx.objectStore(IDB_STORE_HISTORIES);
            const record = {
                id: String(sessionId),
                session_id: String(sessionId),
                messages,
                storedAt: Date.now(),
                expiresAt: Date.now() + CONFIG.HISTORY_TTL_MS
            };
            store.put(record);
            await txDone(tx);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function idbHistoryDelete(sessionId) {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readwrite');
            const store = tx.objectStore(IDB_STORE_HISTORIES);
            store.delete(String(sessionId));
            await txDone(tx);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function idbHistoriesPruneExpired() {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readwrite');
            const store = tx.objectStore(IDB_STORE_HISTORIES);
            const now = Date.now();

            await new Promise((resolve, reject) => {
                const req = store.openCursor();
                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (!cursor) return resolve(true);

                    const rec = cursor.value;
                    const expiresAt = Number(rec?.expiresAt || 0);
                    if (expiresAt && expiresAt < now) {
                        try { cursor.delete(); } catch (_) { }
                    }
                    cursor.continue();
                };
                req.onerror = () => reject(req.error);
            });

            await txDone(tx);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function idbSessionsPruneOld(maxAgeMs) {
        const ttl = Math.max(0, Number(maxAgeMs) || 0);
        if (!ttl) return false;

        try {
            const cutoff = Date.now() - ttl;
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readwrite');
            const store = tx.objectStore(IDB_STORE_SESSIONS);

            await new Promise((resolve, reject) => {
                const req = store.openCursor();
                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (!cursor) return resolve(true);

                    const rec = cursor.value;
                    const storedAt = Number(rec?.storedAt || 0);
                    if (storedAt && storedAt < cutoff) {
                        try { cursor.delete(); } catch (_) { }
                    }
                    cursor.continue();
                };
                req.onerror = () => reject(req.error);
            });

            await txDone(tx);
            sessionsSnapshot.invalidate();
            return true;
        } catch (_) {
            return false;
        }
    }


    async function idbHistoriesGetMany(sessionIds) {
        // Single transaction batched gets (much cheaper than N transactions)
        const ids = Array.isArray(sessionIds) ? sessionIds.map(String) : [];
        if (ids.length === 0) return new Map();

        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readonly');
            const store = tx.objectStore(IDB_STORE_HISTORIES);

            const reads = ids.map((id) => reqToPromise(store.get(id)).then((rec) => [id, rec]).catch(() => [id, null]));
            const pairs = await Promise.all(reads);
            await txDone(tx);

            const map = new Map();
            for (const [id, rec] of pairs) {
                if (!rec) continue;
                if (rec.expiresAt && Number(rec.expiresAt) < Date.now()) { idbHistoryDelete(id).catch(() => { }); continue; }
                map.set(id, rec);
            }
            return map;
        } catch (_) {
            return new Map();
        }
    }

    async function idbSessionsClear() {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_SESSIONS, 'readwrite');
            tx.objectStore(IDB_STORE_SESSIONS).clear();
            await txDone(tx);
            sessionsSnapshot.invalidate();
            return true;
        } catch (_) {
            return false;
        }
    }

    async function idbHistoriesClear() {
        try {
            const db = await openDb();
            const tx = db.transaction(IDB_STORE_HISTORIES, 'readwrite');
            tx.objectStore(IDB_STORE_HISTORIES).clear();
            await txDone(tx);
            return true;
        } catch (_) {
            return false;
        }
    }

    // =======================
    // Token Bucket Rate Limiter (non-busy-wait)
    // =======================
    class TokenBucket {
        constructor(capacity, refillPerSec) {
            this.capacity = Math.max(1, Number(capacity) || 1);
            this.tokens = this.capacity;
            this.refillPerSec = Math.max(0, Number(refillPerSec) || 0);
            this.lastRefill = Date.now();
            this.waitQueue = [];
            this._timer = null;
        }

        refill() {
            const now = Date.now();
            const elapsed = (now - this.lastRefill) / 1000;
            if (elapsed <= 0) return;

            const add = elapsed * this.refillPerSec;
            if (add > 0) {
                this.tokens = Math.min(this.capacity, this.tokens + add);
                this.lastRefill = now;
                this._processQueue();
            }
            this._scheduleRefillIfNeeded();
        }

        _processQueue() {
            while (this.waitQueue.length > 0 && this.tokens >= 1) {
                this.tokens -= 1;
                const entry = this.waitQueue.shift();
                entry.resolve(true);
            }
        }

        _scheduleRefillIfNeeded() {
            if (this._timer) return;
            if (this.waitQueue.length === 0) return;
            if (this.tokens >= 1) return;
            if (this.refillPerSec <= 0) return;

            const deficit = Math.max(0, 1 - this.tokens);
            const ms = Math.ceil((deficit / this.refillPerSec) * 1000);

            this._timer = setTimeout(() => {
                this._timer = null;
                this.refill();
                this._scheduleRefillIfNeeded();
            }, Math.max(1, ms));
        }


        removeToken({ signal, timeoutMs = 60000 } = {}) {
            this.refill();

            if (signal?.aborted) {
                return Promise.reject(new DOMException('Aborted', 'AbortError'));
            }

            if (this.tokens >= 1) {
                this.tokens -= 1;
                return Promise.resolve(true);
            }

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    cleanup();
                    reject(new Error('Rate limiter timeout'));
                }, timeoutMs);

                const onAbort = () => {
                    cleanup();
                    reject(new DOMException('Aborted', 'AbortError'));
                };

                const entry = {
                    resolve: (val) => {
                        cleanup();
                        resolve(val);
                    }
                };

                const cleanup = () => {
                    clearTimeout(timeout);
                    if (signal) signal.removeEventListener('abort', onAbort);
                    const idx = this.waitQueue.indexOf(entry);
                    if (idx >= 0) this.waitQueue.splice(idx, 1);
                };

                if (signal) signal.addEventListener('abort', onAbort, { once: true });
                this.waitQueue.push(entry);
            });
        }

        destroy() {
            if (this._timer) clearTimeout(this._timer);
            this._timer = null;
            for (const entry of this.waitQueue) {
                try { entry.resolve(false); } catch (_) { }
            }
            this.waitQueue = [];
        }
    }

    const tokenBucket = new TokenBucket(CONFIG.TOKEN_BUCKET_CAPACITY, CONFIG.TOKEN_BUCKET_REFILL_PER_SEC);

    // =======================
    // Request queue with concurrency + minDelay + tokenBucket
    // =======================
    class RequestQueue {
        constructor({ concurrency = 2, minDelayMs = 300 } = {}) {
            this.concurrency = Math.max(1, Number(concurrency) || 1);
            this.minDelayMs = Math.max(0, Number(minDelayMs) || 0);
            this.queue = [];
            this.active = 0;
            this.nextAllowedAt = 0;
        }

        enqueue(taskFn, { signal } = {}) {
            if (signal?.aborted) {
                return Promise.reject(new DOMException('Aborted', 'AbortError'));
            }

            return new Promise((resolve, reject) => {
                const item = { taskFn, resolve, reject, signal };

                const onAbort = () => {
                    // Remove from queue if not started yet
                    const idx = this.queue.indexOf(item);
                    if (idx >= 0) this.queue.splice(idx, 1);
                    reject(new DOMException('Aborted', 'AbortError'));
                };

                if (signal) signal.addEventListener('abort', onAbort, { once: true });
                item._cleanupAbort = () => { if (signal) signal.removeEventListener('abort', onAbort); };

                this.queue.push(item);
                this._next();
            });
        }

        _next() {
            if (this.active >= this.concurrency) return;
            const item = this.queue.shift();
            if (!item) return;

            if (item.signal?.aborted) {
                try { item._cleanupAbort?.(); } catch (_) { }
                item.reject(new DOMException('Aborted', 'AbortError'));
                setTimeout(() => this._next(), 0);
                return;
            }

            const now = Date.now();
            const startAt = Math.max(now, this.nextAllowedAt);
            const wait = Math.max(0, startAt - now);
            this.nextAllowedAt = startAt + this.minDelayMs;
            this.active++;

            setTimeout(async () => {
                try {
                    await tokenBucket.removeToken({ signal: item.signal });
                    const res = await item.taskFn();
                    item.resolve(res);
                } catch (err) {
                    item.reject(err);
                } finally {
                    try { item._cleanupAbort?.(); } catch (_) { }
                    this.active--;
                    setTimeout(() => this._next(), 0);
                }
            }, wait);
        }
    }

    const requestQueue = new RequestQueue({
        concurrency: CONFIG.REQUEST_CONCURRENCY,
        minDelayMs: CONFIG.MIN_REQUEST_DELAY_MS
    });

    // =======================
    // Fetch with retries & 429 handling & jitter
    // =======================
    async function fetchWithRetries(url, options = {}, { maxRetries = CONFIG.MAX_RETRIES } = {}) {
        let attempt = 0;
        let backoff = CONFIG.BACKOFF_BASE_MS;

        while (true) {
            attempt++;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT_MS);
            const signal = options.signal
            ? combineAbortSignals(options.signal, controller.signal)
            : controller.signal;

            try {
                const opts = Object.assign({}, options, { signal });
                const res = await fetch(url, opts);
                clearTimeout(timeoutId);

                if (res.status === 429) {
                    const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
                    if (attempt > maxRetries) throw new Error('429 Too Many Requests (max retries reached)');
                    const waitMs = (retryAfter != null) ? retryAfter : backoff + jitter(300);
                    await delay(waitMs);
                    backoff *= 2;
                    continue;
                }

                if (!res.ok) {
                    if (res.status >= 500 && attempt <= maxRetries) {
                        const waitMs = backoff + jitter(300);
                        await delay(waitMs);
                        backoff *= 2;
                        continue;
                    }

                    const body = await safeText(res);
                    throw new Error(`HTTP ${res.status}: ${body}`);
                }

                return res;
            } catch (err) {
                clearTimeout(timeoutId);
                if (err?.name === 'AbortError') throw err;
                if (attempt >= maxRetries) throw err;
                const waitMs = backoff + jitter(300);
                await delay(waitMs);
                backoff *= 2;
            }
        }
    }

    function parseRetryAfter(val) {
        if (!val) return null;
        const n = Number(val);
        if (!Number.isNaN(n)) return Math.max(1000, n * 1000);
        const t = Date.parse(val);
        if (!Number.isNaN(t)) {
            const ms = t - Date.now();
            return Math.max(0, ms);
        }
        return null;
    }

    function jitter(max) { return Math.floor(Math.random() * max); }
    function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
    async function safeText(response) { try { return await response.text(); } catch (_) { return response.statusText || ''; } }

    function combineAbortSignals(a, b) {
        const signals = [a, b].filter(Boolean);
        if (signals.length === 0) {
            return new AbortController().signal;
        }

        // Prefer native any() when available
        try {
            if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
                return AbortSignal.any(signals);
            }
        } catch (_) { }

        const controller = new AbortController();

        const onAbort = () => {
            cleanup();
            try { controller.abort(); } catch (_) { }
        };

        const cleanup = () => {
            for (const s of signals) {
                try { s.removeEventListener('abort', onAbort); } catch (_) { }
            }
        };

        for (const s of signals) {
            if (s.aborted) {
                onAbort();
                break;
            }
            try { s.addEventListener('abort', onAbort, { once: true }); } catch (_) { }
        }

        return controller.signal;
    }

    // =======================
    // Token retrieval & headers
    // =======================
    function getStoredToken() {
        try {
            const candidates = ['userToken', 'token', 'authToken'];
            for (const k of candidates) {
                const raw = localStorage.getItem(k);
                if (!raw) continue;
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.value) return parsed.value;
                } catch (_) {
                    return raw;
                }
            }
            const cookieMatch = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
            if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
        } catch (_) { }
        return null;
    }

    function makeHeaders(token) {
        const headers = {
            'accept': '*/*',
            'x-app-version': CONFIG.APP_VERSION,
            'x-client-locale': CONFIG.CLIENT_LOCALE,
            'x-client-platform': 'web',
            'x-client-version': CONFIG.CLIENT_VERSION,
            'accept-language': CONFIG.ACCEPT_LANGUAGE,
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
        };

        if (token) headers['authorization'] = `Bearer ${token}`;
        return headers;
    }

    // =======================
    // Session snapshot cache (for title/content search)
    // =======================
    const sessionsSnapshot = {
        _items: null,
        _at: 0,
        invalidate() { this._items = null; this._at = 0; },
        async get({ maxAgeMs = 10_000 } = {}) {
            if (this._items && (Date.now() - this._at) < maxAgeMs) return this._items;
            const items = await idbSessionsGetAllByUpdatedAt();
            this._items = items;
            this._at = Date.now();
            return items;
        }
    };

    // =======================
    // Global modal state + abort tracking
    // =======================
    let modalState = { open: false, abortControllers: new Set(), closedSignal: false };

    function abortAllModalRequests() {
        for (const c of modalState.abortControllers) {
            try { c.abort(); } catch (_) { }
        }
        modalState.abortControllers.clear();
    }

    // =======================
    // Pagination
    // =======================
    class PaginationManager {
        constructor(pageSize = 20) {
            this.pageSize = pageSize;
            this.currentPage = 1;
            this.totalItems = 0;
            this.cache = new Map();
            this.dataSource = null;
        }

        setDataSource(fetchFn) {
            this.dataSource = fetchFn;
        }

        async loadPage(pageNum) {
            if (this.cache.has(pageNum)) return this.cache.get(pageNum);
            if (!this.dataSource) throw new Error('Data source not configured');

            const result = await this.dataSource(pageNum, this.pageSize);
            this.totalItems = Number(result.total || 0);

            this.cache.set(pageNum, result.items);
            return result.items;
        }

        async goToPage(pageNum) {
            const safe = Math.max(1, Number(pageNum) || 1);
            const totalPages = this.getTotalPages();
            if (totalPages > 0 && safe > totalPages) return null;

            this.currentPage = safe;
            return await this.loadPage(safe);
        }

        async nextPage() { return await this.goToPage(this.currentPage + 1); }
        async prevPage() { return await this.goToPage(this.currentPage - 1); }

        getTotalPages() {
            return Math.ceil((Number(this.totalItems || 0)) / (Number(this.pageSize || 1)));
        }

        hasNextPage() { return this.currentPage < this.getTotalPages(); }
        hasPrevPage() { return this.currentPage > 1; }

        clearCache() { this.cache.clear(); }

        reset() {
            this.currentPage = 1;
            this.totalItems = 0;
            this.clearCache();
        }
    }

    // =======================
    // UI helpers
    // =======================
    function setText(el, text) {
        el.textContent = text == null ? '' : String(text);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    function toEpochMs(value, fallbackMs = Date.now()) {
        const n = Number(value);
        if (!Number.isFinite(n) || n <= 0) return fallbackMs;
        // Heuristic: seconds timestamps are typically < 1e12; milliseconds are >= 1e12.
        return n < 1e12 ? n * 1000 : n;
    }

    function escapeRegExp(str) {
        return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function setHighlightedText(el, text, query) {
        const raw = text == null ? '' : String(text);
        const q = String(query || '').trim();
        if (!q) {
            el.textContent = raw;
            return;
        }

        // Build DOM safely (no innerHTML from untrusted content)
        const re = new RegExp(escapeRegExp(q), 'ig');
        el.textContent = '';

        let lastIndex = 0;
        for (const match of raw.matchAll(re)) {
            const idx = match.index ?? -1;
            if (idx < 0) continue;

            if (idx > lastIndex) {
                el.appendChild(document.createTextNode(raw.slice(lastIndex, idx)));
            }

            const mark = document.createElement('mark');
            mark.textContent = raw.slice(idx, idx + match[0].length);
            el.appendChild(mark);

            lastIndex = idx + match[0].length;
        }

        if (lastIndex < raw.length) {
            el.appendChild(document.createTextNode(raw.slice(lastIndex)));
        }
    }

    function createChatElement(session, isDarkTheme, highlightQuery) {
        const div = document.createElement('div');
        div.className = `dscs-item ${isDarkTheme ? 'dark' : 'light'}`;

        const title = document.createElement('div');
        setText(title, session.title || '(untitled)');
        title.style.fontWeight = '600';

        const meta = document.createElement('div');
        meta.className = 'dscs-small';
        const createdDate = session.inserted_at ? new Date(toEpochMs(session.inserted_at)).toLocaleString() : null;
        const updatedDate = new Date(toEpochMs(session.updated_at || session.create_time)).toLocaleString();
        setText(meta, createdDate ? `Created: ${createdDate} · Updated: ${updatedDate}` : `Updated: ${updatedDate}`);

        div.append(title, meta);

        if (session._snippet) {
            const sn = document.createElement('div');
            sn.className = 'dscs-snippet';
            setHighlightedText(sn, session._snippet, highlightQuery);
            div.appendChild(sn);
        }

        div.addEventListener('click', () => {
            window.location.href = `/a/chat/s/${session.id}`;
        });

        div.dataset.title = (session.title || '').toLowerCase();
        div.dataset.id = String(session.id);
        return div;
    }

    function createPaginatedModal(isDark) {
        const modal = document.createElement('div');
        modal.className = `dscs-modal ${isDark ? 'dark' : 'light'}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        // Header
        const header = document.createElement('div');
        header.className = `dscs-header ${isDark ? 'dark' : ''}`;

        const input = document.createElement('input');
        input.className = `dscs-search ${isDark ? 'dark' : ''}`;
        input.type = 'search';
        input.placeholder = 'Search conversations…';
        input.setAttribute('aria-label', 'Search conversations');

        const options = document.createElement('div');
        options.className = 'dscs-options';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'dscs-search-content';

        const label = document.createElement('label');
        label.htmlFor = 'dscs-search-content';
        label.textContent = 'Content';

        options.append(checkbox, label);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'dscs-close dscs-button';
        closeBtn.textContent = '×';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.padding = '4px 10px';
        closeBtn.setAttribute('aria-label', 'Close');

        header.append(input, options, closeBtn);

        // List
        const list = document.createElement('div');
        list.className = 'dscs-list';
        list.style.minHeight = '400px';

        // Pagination controls
        const pagination = document.createElement('div');
        pagination.className = 'dscs-pagination';
        pagination.innerHTML = `
            <div class="dscs-pagination-info"></div>
            <div class="dscs-pagination-controls">
                <button class="dscs-button dscs-prev-btn" disabled>← Previous</button>
                <span class="dscs-page-jump">
                    Page <input type="number" class="dscs-page-input" value="1" min="1"> of <span class="dscs-total-pages">1</span>
                </span>
                <button class="dscs-button dscs-next-btn" disabled>Next →</button>
            </div>
        `;

        // Footer
        const footer = document.createElement('div');
        footer.className = 'dscs-footer';

        const status = document.createElement('div');
        status.className = 'dscs-small';
        setText(status, 'Ready');

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'dscs-button';
        settingsBtn.textContent = 'Settings';

        footer.append(status, settingsBtn);

        modal.append(header, list, pagination, footer);

        return {
            modal,
            elements: {
                input,
                checkbox,
                closeBtn,
                list,
                status,
                settingsBtn,
                pagination: {
                    container: pagination,
                    info: pagination.querySelector('.dscs-pagination-info'),
                    pageInput: pagination.querySelector('.dscs-page-input'),
                    totalPages: pagination.querySelector('.dscs-total-pages'),
                    prevBtn: pagination.querySelector('.dscs-prev-btn'),
                    nextBtn: pagination.querySelector('.dscs-next-btn')
                }
            }
        };
    }

    // =======================
    // Search helpers
    // =======================
    function findInMessages(messages, lowerQ) {
        for (const msg of messages || []) {
            const content = (msg?.content || '').toLowerCase();
            if (content.includes(lowerQ)) return makeSnippet(msg.content || '', lowerQ);
        }
        return null;
    }

    function makeSnippet(content, lowerQ) {
        const lc = String(content).toLowerCase();
        const pos = lc.indexOf(lowerQ);
        if (pos === -1) return '';
        const start = Math.max(0, pos - 60);
        const end = Math.min(content.length, pos + lowerQ.length + 120);
        const sn = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
        return sn.replace(/\s+/g, ' ');
    }

    // De-dupe per-session history fetches to avoid races
    const historyFetchInFlight = new Map();

    async function fetchHistoryMessages(sessionId, { signal } = {}) {
        const id = String(sessionId);
        if (historyFetchInFlight.has(id)) return await historyFetchInFlight.get(id);

        const token = getStoredToken();
        if (!token) return null;

        const p = (async () => {
            const url = `https://chat.deepseek.com/api/v0/chat/history_messages?chat_session_id=${encodeURIComponent(id)}`;
            const controller = new AbortController();
            modalState.abortControllers.add(controller);

            try {
                const combinedSignal = signal ? combineAbortSignals(signal, controller.signal) : controller.signal;
                const res = await requestQueue.enqueue(
                    () => fetchWithRetries(url, { method: 'GET', headers: makeHeaders(token), signal: combinedSignal }),
                    { signal: combinedSignal }
                );
                const data = await res.json();
                const messages = (data && data.code === 0 && data.data?.biz_data?.chat_messages)
                ? data.data.biz_data.chat_messages
                : [];

                await idbHistoryPut(id, messages).catch(() => { });
                return messages;
            } finally {
                modalState.abortControllers.delete(controller);
                historyFetchInFlight.delete(id);
            }
        })();

        historyFetchInFlight.set(id, p);
        return await p;
    }

    // =======================
    // Search controllers
    // =======================
    class TitleSearchController {
        constructor() {
            this.query = '';
            this.results = [];
        }

        reset() {
            this.query = '';
            this.results = [];
        }

        async ensure(query) {
            const q = String(query || '').trim().toLowerCase();
            if (q === this.query && this.results) return;

            this.query = q;
            if (!q) {
                this.results = [];
                return;
            }

            const sessions = await sessionsSnapshot.get();
            const matches = [];
            for (const s of sessions) {
                const title = String(s?.title || '').toLowerCase();
                if (title.includes(q)) matches.push(s);
            }
            this.results = matches;
        }

        async getPage(query, page, pageSize) {
            await this.ensure(query);
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const items = this.results.slice(start, end);
            return { items, total: this.results.length, page, pageSize, totalPages: Math.ceil(this.results.length / pageSize) };
        }
    }

    class ContentSearchController {
        constructor() {
            this.query = '';
            this.matches = []; // array of session objects with _snippet
            this._idSet = new Set();
            this._building = null;
            this._builtAt = 0;
            this._runId = 0;
            this._hasBuilt = false;
        }

        reset() {
            // Bump run id to invalidate any in-flight build.
            this._runId = (this._runId || 0) + 1;

            this.query = '';
            this.matches = [];
            this._idSet = new Set();
            this._building = null;
            this._builtAt = 0;
            this._hasBuilt = false;
        }

        async ensure(query, { signal, onProgress } = {}) {
            const q = String(query || '').trim().toLowerCase();
            if (!q) {
                this.reset();
                return;
            }

            // Reuse cache for same query within short window (including 0-result queries)
            if (q === this.query && this._hasBuilt && (Date.now() - this._builtAt) < 30_000) return;

            // If already building for the same query, await it
            if (q === this.query && this._building) {
                await this._building;
                return;
            }

            // Start a new run
            this._runId = (this._runId || 0) + 1;
            const runId = this._runId;

            this.query = q;
            this.matches = [];
            this._idSet = new Set();
            this._hasBuilt = false;
            this._builtAt = 0;

            const building = this._buildAll({ signal, onProgress, runId });
            this._building = building;

            try {
                await building;
                if (this._runId === runId && this.query === q) {
                    this._hasBuilt = true;
                    this._builtAt = Date.now();
                }
            } finally {
                if (this._building === building) this._building = null;
            }
        }

        async _buildAll({ signal, onProgress, runId } = {}) {
            const q = this.query;
            const isCurrentRun = () => (this._runId === runId && this.query === q);

            const sessions = await sessionsSnapshot.get({ maxAgeMs: 5_000 });
            if (!isCurrentRun()) return;

            const totalSessions = sessions.length;
            let scanned = 0;
            let fetchedHistories = 0;

            const chunkSize = 50;
            const maxNetworkFetch = Math.max(0, CONFIG.CONTENT_SEARCH_COUNT * CONFIG.MAX_CONTENT_PAGES);

            const matches = [];
            const idSet = new Set();

            const pushMatch = (session, snippet) => {
                if (!isCurrentRun()) return;
                const id = String(session?.id);
                if (!id || idSet.has(id)) return;
                idSet.add(id);
                matches.push(Object.assign({}, session, { _snippet: snippet || '' }));
            };

            // Title matches first (cheap)
            for (const s of sessions) {
                if (!isCurrentRun()) return;
                if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
                const title = String(s?.title || '').toLowerCase();
                if (title.includes(q)) pushMatch(s, `Title match: ${s.title || '(untitled)'}`);
            }

            // Scan cached histories + optionally fetch missing (bounded)
            for (let i = 0; i < sessions.length; i += chunkSize) {
                if (!isCurrentRun()) return;
                if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

                const chunk = sessions.slice(i, i + chunkSize);
                const ids = chunk.map(s => String(s?.id)).filter(Boolean);

                const cached = await idbHistoriesGetMany(ids);

                const missing = [];
                for (const s of chunk) {
                    if (!isCurrentRun()) return;
                    scanned++;

                    const id = String(s?.id);
                    const rec = cached.get(id);

                    if (rec?.messages && Array.isArray(rec.messages)) {
                        const sn = findInMessages(rec.messages, q);
                        if (sn) pushMatch(s, sn);
                    } else {
                        missing.push(s);
                    }
                }

                if (typeof onProgress === 'function') {
                    onProgress({
                        phase: 'scan',
                        query: q,
                        scanned,
                        totalSessions,
                        matches: matches.length,
                        fetchedHistories
                    });
                }

                // bounded fetch of missing histories
                if (missing.length > 0 && fetchedHistories < maxNetworkFetch) {
                    const remainingBudget = maxNetworkFetch - fetchedHistories;
                    const toFetch = missing.slice(0, remainingBudget);

                    const batches = chunkArray(toFetch, CONFIG.HISTORY_CONCURRENCY);
                    for (const batch of batches) {
                        if (!isCurrentRun()) return;
                        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

                        const promises = batch.map(async (sess) => {
                            const msgs = await fetchHistoryMessages(sess.id, { signal });
                            fetchedHistories++;
                            if (!isCurrentRun()) return;
                            if (msgs && Array.isArray(msgs)) {
                                const sn = findInMessages(msgs, q);
                                if (sn) pushMatch(sess, sn);
                            }
                        });

                        await Promise.all(promises);

                        if (typeof onProgress === 'function') {
                            onProgress({
                                phase: 'fetch',
                                query: q,
                                scanned,
                                totalSessions,
                                matches: matches.length,
                                fetchedHistories,
                                fetchBudget: maxNetworkFetch
                            });
                        }

                        await delay(0);
                    }
                }
            }

            matches.sort((a, b) => Number(b?.updated_at || b?.create_time || 0) - Number(a?.updated_at || a?.create_time || 0));

            if (typeof onProgress === 'function') {
                onProgress({
                    phase: 'done',
                    query: q,
                    scanned: totalSessions,
                    totalSessions,
                    matches: matches.length,
                    fetchedHistories
                });
            }

            if (isCurrentRun()) {
                this.matches = matches;
                this._idSet = idSet;
            }
        }

        async getPage(query, page, pageSize, { signal, onProgress } = {}) {
            await this.ensure(query, { signal, onProgress });
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const items = this.matches.slice(start, end);
            return { items, total: this.matches.length, page, pageSize, totalPages: Math.ceil(this.matches.length / pageSize) };
        }
    }

    // =======================
    // Modal Controller
    // =======================
    class ModalController {
        constructor() {
            this.modal = null;
            this.elements = null;

            this.paginationManager = new PaginationManager(CONFIG.RESULTS_PAGE_SIZE);
            this.titleSearch = new TitleSearchController();
            this.contentSearch = new ContentSearchController();

            this.currentMode = 'browse';
            this.isDark = false;

            this._disposers = [];
            this._debounceTimer = null;
            this._searchAbort = null;
        }

        async open() {
            if (this.modal) return;

            modalState.open = true;
            modalState.closedSignal = false;

            Promise.resolve().then(() => {
                idbSessionsPruneOld(CONFIG.PAGE_TTL_MS).catch(() => { });
                idbHistoriesPruneExpired().catch(() => { });
            });

            this.isDark = document.body.hasAttribute('data-ds-dark-theme');
            const { modal, elements } = createPaginatedModal(this.isDark);
            this.modal = modal;
            this.elements = elements;

            this.paginationManager.setDataSource(async (page, pageSize) => {
                return await this._fetchPage(page, pageSize);
            });

            this._setupEventListeners();

            document.body.appendChild(this.modal);
            this.elements.input.focus();

            // Incremental sync of newest sessions (keeps search up-to-date without manual reindex)
            setText(this.elements.status, 'Syncing latest…');
            await autoSyncRecentSessions({ signal: this._getAbortSignal(), force: true }).catch(() => { });
            setText(this.elements.status, 'Ready');

            // Ensure we have at least some index
            const total = await idbSessionsCount();
            if (total === 0) {
                setText(this.elements.status, 'Building index…');
                await seedIndexFromPages(this.elements.status, { signal: this._getAbortSignal() });
            }

            await this.loadCurrentPage();
        }

        _getAbortSignal() {
            if (!this._searchAbort) this._searchAbort = new AbortController();
            return this._searchAbort.signal;
        }

        _resetAbortSignal() {
            if (this._searchAbort) {
                try { this._searchAbort.abort(); } catch (_) { }
            }
            this._searchAbort = new AbortController();
        }

        _setupEventListeners() {
            const { input, checkbox, closeBtn, settingsBtn, pagination } = this.elements;

            const onClose = () => this.close();
            closeBtn.addEventListener('click', onClose);
            this._disposers.push(() => closeBtn.removeEventListener('click', onClose));

            const onKeydown = (e) => {
                if (e.key === 'Escape') this.close();
            };
            window.addEventListener('keydown', onKeydown);
            this._disposers.push(() => window.removeEventListener('keydown', onKeydown));

            const onInput = () => {
                clearTimeout(this._debounceTimer);
                this._debounceTimer = setTimeout(() => {
                    this.handleSearch().catch(() => { });
                }, 350);
            };
            input.addEventListener('input', onInput);
            this._disposers.push(() => input.removeEventListener('input', onInput));

            const onCheckbox = () => {
                // No query => mode is browse anyway; don't reload the list / show loader.
                if (!input.value.trim()) return;
                this.handleSearch().catch(() => { });
            };

            checkbox.addEventListener('change', onCheckbox);
            this._disposers.push(() => checkbox.removeEventListener('change', onCheckbox));

            const onPrev = () => this.prevPage().catch(() => { });
            const onNext = () => this.nextPage().catch(() => { });
            pagination.prevBtn.addEventListener('click', onPrev);
            pagination.nextBtn.addEventListener('click', onNext);
            this._disposers.push(() => pagination.prevBtn.removeEventListener('click', onPrev));
            this._disposers.push(() => pagination.nextBtn.removeEventListener('click', onNext));

            const onPageJump = (e) => {
                if (e.type === 'keydown' && e.key !== 'Enter') return;
                const targetPage = parseInt(pagination.pageInput.value, 10);
                if (Number.isFinite(targetPage) && targetPage >= 1) {
                    this.jumpToPage(targetPage).catch(() => { });
                }
            };
            pagination.pageInput.addEventListener('keydown', onPageJump);
            pagination.pageInput.addEventListener('blur', onPageJump);
            this._disposers.push(() => pagination.pageInput.removeEventListener('keydown', onPageJump));
            this._disposers.push(() => pagination.pageInput.removeEventListener('blur', onPageJump));

            const onSettings = () => this.openSettings();
            settingsBtn.addEventListener('click', onSettings);
            this._disposers.push(() => settingsBtn.removeEventListener('click', onSettings));
        }

        async handleSearch() {
            const query = this.elements.input.value.trim();

            if (query === '') {
                this.currentMode = 'browse';
            } else if (this.elements.checkbox.checked) {
                this.currentMode = 'content-search';
            } else {
                this.currentMode = 'search';
            }

            this._resetAbortSignal();
            this.paginationManager.reset();
            this.titleSearch.reset();
            this.contentSearch.reset();

            await this.loadCurrentPage();
        }

        async _fetchPage(page, pageSize) {
            const query = this.elements.input.value.trim();
            const signal = this._getAbortSignal();

            if (this.currentMode === 'browse') {
                const res = await idbSessionsGetPage(page, pageSize, 'updated_at');
                return { items: res.items, total: res.total };
            }

            if (this.currentMode === 'search') {
                const res = await this.titleSearch.getPage(query, page, pageSize);
                return { items: res.items, total: res.total };
            }

            // content-search
            const res = await this.contentSearch.getPage(query, page, pageSize, {
                signal,
                onProgress: (p) => {
                    if (!this.elements) return;

                    if (p.phase === 'scan') {
                        setText(this.elements.status, `Scanning cached content… ${p.scanned}/${p.totalSessions}, matches: ${p.matches}`);
                    } else if (p.phase === 'fetch') {
                        setText(this.elements.status, `Fetching missing histories… ${p.fetchedHistories}/${p.fetchBudget}, matches: ${p.matches}`);
                    } else if (p.phase === 'done') {
                        const budget = Math.max(0, CONFIG.CONTENT_SEARCH_COUNT * CONFIG.MAX_CONTENT_PAGES);
                        const note = (budget > 0 && p.fetchedHistories >= budget)
                        ? ' (results may be incomplete; increase max_pages or run index_all)'
                        : '';
                        setText(this.elements.status, `Content search done. Matches: ${p.matches}${note}`);
                    }
                }
            });

            return { items: res.items, total: res.total };
        }

        async loadCurrentPage() {
            try {
                this.showLoading(true);

                const items = await this.paginationManager.goToPage(this.paginationManager.currentPage);
                if (!items) {
                    this.showError('Invalid page');
                    return;
                }

                this.renderResults(items);
                this.updatePaginationUI();

                if (this.currentMode !== 'content-search') {
                    setText(this.elements.status, `Showing ${items.length} of ${this.paginationManager.totalItems} results`);
                }

            } catch (error) {
                if (error?.name === 'AbortError') return;
                console.error('Load page error:', error);
                this.showError(error.message || String(error));
                setText(this.elements.status, 'Error');
            } finally {
                this.showLoading(false);
            }
        }

        async nextPage() {
            if (!this.paginationManager.hasNextPage()) return;
            const items = await this.paginationManager.nextPage();
            if (!items) return;
            this.renderResults(items);
            this.updatePaginationUI();
            this.elements.list.scrollTop = 0;
        }

        async prevPage() {
            if (!this.paginationManager.hasPrevPage()) return;
            const items = await this.paginationManager.prevPage();
            if (!items) return;
            this.renderResults(items);
            this.updatePaginationUI();
            this.elements.list.scrollTop = 0;
        }

        async jumpToPage(pageNum) {
            const totalPages = this.paginationManager.getTotalPages();
            const targetPage = Math.max(1, Math.min(pageNum, totalPages || 1));
            if (targetPage === this.paginationManager.currentPage) return;

            try {
                this.showLoading(true);
                const items = await this.paginationManager.goToPage(targetPage);
                if (!items) return;
                this.renderResults(items);
                this.updatePaginationUI();
                this.elements.list.scrollTop = 0;
            } catch (error) {
                if (error?.name === 'AbortError') return;
                this.showError(error.message || String(error));
            } finally {
                this.showLoading(false);
            }
        }

        updatePaginationUI() {
            const { pagination } = this.elements;
            const pm = this.paginationManager;

            const totalPages = pm.getTotalPages() || 1;
            pagination.prevBtn.disabled = !pm.hasPrevPage();
            pagination.nextBtn.disabled = !pm.hasNextPage();

            pagination.pageInput.value = pm.currentPage;
            pagination.pageInput.max = totalPages;
            setText(pagination.totalPages, totalPages);

            if (pm.totalItems > 0) {
                const start = (pm.currentPage - 1) * pm.pageSize + 1;
                const end = Math.min(pm.currentPage * pm.pageSize, pm.totalItems);
                setText(pagination.info, `${start}-${end} of ${pm.totalItems}`);
            } else {
                setText(pagination.info, 'No results');
            }
        }

        renderResults(items) {
            const list = this.elements.list;
            list.innerHTML = '';

            if (!items || items.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'dscs-loading';
                setText(empty, 'No conversations found');
                list.appendChild(empty);
                return;
            }

            for (const item of items) {
                list.appendChild(createChatElement(item, this.isDark, this.elements?.input?.value?.trim?.() || ''));
            }
        }

        showLoading(show) {
            const list = this.elements.list;
            let loader = list.querySelector('.dscs-list-loading');

            if (show && !loader) {
                loader = document.createElement('div');
                loader.className = 'dscs-list-loading';
                loader.innerHTML = '<span class="dscs-spinner"></span>';
                list.appendChild(loader);
            } else if (!show && loader) {
                loader.remove();
            }
        }

        showError(message) {
            const list = this.elements.list;
            list.innerHTML = `
                <div class="dscs-error">
                    Error: ${escapeHtml(message)}
                </div>
            `;
        }

        openSettings() {
            openSettingsModal(this.modal, this.elements.status);
        }

        close() {
            if (!this.modal) return;

            modalState.open = false;
            modalState.closedSignal = true;

            this._resetAbortSignal();
            abortAllModalRequests();

            // disposers
            for (const dispose of this._disposers.splice(0)) {
                try { dispose(); } catch (_) { }
            }

            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;

            this.paginationManager.clearCache();

            try { this.modal.remove(); } catch (_) { }
            this.modal = null;
            this.elements = null;
        }
    }

    // =======================
    // Sidebar icon + hotkey (single binding)
    // =======================
    function findSidebar() {
        const tries = ['._6969ec9', '.sidebar', 'aside[role="complementary"]', 'aside', '.ds-sidebar', '.left-rail'];
        for (const s of tries) {
            try {
                const el = document.querySelector(s);
                if (el) return el;
            } catch (_) { }
        }

        const possible = Array.from(document.querySelectorAll('div')).find(d => {
            const r = d.getBoundingClientRect();
            return r.height > 400 && r.width < window.innerWidth * 0.3 && r.left < window.innerWidth * 0.5;
        });

        return possible || null;
    }

    let sidebarObserver = null;
    let modalController = null;
    let hotkeyBound = false;

    function addSearchIcon(container) {
        if (!container) return false;
        if (container.querySelector('.dscs-icon')) return false;

        const icon = document.createElement('div');
        icon.className = 'dscs-icon';
        icon.title = 'DeepSeek Conversation Search (Ctrl/Cmd+K)';
        icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 4.25C7.16015 4.25 4.25 7.16015 4.25 10.75C4.25 14.3399 7.16015 17.25 10.75 17.25C14.3399 17.25 17.25 14.3399 17.25 10.75C17.25 7.16015 14.3399 4.25 10.75 4.25ZM2.25 10.75C2.25 6.05558 6.05558 2.25 10.75 2.25C15.4444 2.25 19.25 6.05558 19.25 10.75C19.25 12.7369 18.5683 14.5645 17.426 16.0118L21.4571 20.0429C21.8476 20.4334 21.8476 21.0666 21.4571 21.4571C21.0666 21.8476 20.4334 21.8476 20.0429 21.4571L16.0118 17.426C14.5645 18.5683 12.7369 19.25 10.75 19.25C6.05558 19.25 2.25 15.4444 2.25 10.75Z" fill="currentColor"></path></svg>`;

        icon.addEventListener('click', openSearchModal);
        try { container.prepend(icon); } catch (_) { container.appendChild(icon); }

        bindGlobalHotkeyOnce();
        return true;
    }

    function bindGlobalHotkeyOnce() {
        if (hotkeyBound) return;
        hotkeyBound = true;

        const onHotkey = (e) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const isK = e.key && e.key.toLowerCase() === 'k';
            if (!isK) return;

            const pressed = (isMac && e.metaKey) || (!isMac && e.ctrlKey);
            if (!pressed) return;

            e.preventDefault();
            openSearchModal();
        };

        window.addEventListener('keydown', onHotkey, { passive: false });

        // cleanup on unload
        window.addEventListener('beforeunload', () => {
            try { window.removeEventListener('keydown', onHotkey); } catch (_) { }
        });
    }

    function createIconAndObserve() {
        if (sidebarObserver) {
            try { sidebarObserver.disconnect(); } catch (_) { }
            sidebarObserver = null;
        }

        let lastScanAt = 0;
        let scanThrottleTimer = null;
        let recheckTimer = null;
        const SCAN_MIN_INTERVAL_MS = 350;

        const stopObserver = () => {
            if (sidebarObserver) {
                try { sidebarObserver.disconnect(); } catch (_) { }
                sidebarObserver = null;
            }
        };

        const scheduleRecheck = () => {
            // Sidebar can re-render after initial injection; verify icon still exists.
            if (recheckTimer) clearTimeout(recheckTimer);
            recheckTimer = setTimeout(() => {
                recheckTimer = null;
                const sb = findSidebar();
                if (!sb || !sb.querySelector('.dscs-icon')) {
                    createIconAndObserve();
                }
            }, 2000);
        };

        const tryInject = () => {
            const sidebar = findSidebar();
            if (!sidebar) return false;

            if (sidebar.querySelector('.dscs-icon')) {
                stopObserver();
                return true;
            }

            const added = addSearchIcon(sidebar);
            if (added) {
                stopObserver();
                scheduleRecheck();
                return true;
            }

            return false;
        };

        const scheduleScan = () => {
            if (scanThrottleTimer) return;
            const now = Date.now();
            const wait = Math.max(0, SCAN_MIN_INTERVAL_MS - (now - lastScanAt));
            scanThrottleTimer = setTimeout(() => {
                scanThrottleTimer = null;
                lastScanAt = Date.now();
                tryInject();
            }, wait);
        };

        sidebarObserver = new MutationObserver(scheduleScan);
        sidebarObserver.observe(document.body, { childList: true, subtree: true });

        tryInject();

        window.addEventListener('beforeunload', stopObserver, { once: true });
    }

    let dscsNavHookInstalled = false;
    function installNavigationReinitHook() {
        if (dscsNavHookInstalled) return;
        dscsNavHookInstalled = true;

        const notify = () => {
            try { window.dispatchEvent(new Event('dscs:navigation')); } catch (_) { }
        };

        const wrap = (methodName) => {
            const original = history && history[methodName];
            if (typeof original !== 'function') return;
            try {
                history[methodName] = function (...args) {
                    const ret = original.apply(this, args);
                    notify();
                    return ret;
                };
            } catch (_) { }
        };

        wrap('pushState');
        wrap('replaceState');

        window.addEventListener('popstate', notify, true);
        window.addEventListener('dscs:navigation', () => {
            autoSyncRecentSessions().catch(() => { });
            setTimeout(() => createIconAndObserve(), 0);
        }, true);
    }


    function openSearchModal() {
        if (modalController) return;
        modalController = new ModalController();
        modalController.open().catch((error) => {
            console.error('Failed to open DSCS modal:', error);
            alert('Failed to open search: ' + (error?.message || String(error)));
            try { modalController?.close(); } catch (_) { }
            modalController = null;
        });

        const originalClose = modalController.close.bind(modalController);
        modalController.close = function () {
            originalClose();
            modalController = null;
        };
    }

    // =======================
    // Index seeding
    // =======================
    async function seedIndexFromPages(statusEl, { signal } = {}) {
        const token = getStoredToken();
        if (!token) return;

        idbSessionsPruneOld(CONFIG.PAGE_TTL_MS).catch(() => { });
        idbHistoriesPruneExpired().catch(() => { });


        let last = null;
        let page = 0;
        let hasMore = true;
        const perPage = Math.min(200, Math.max(50, CONFIG.PAGE_COUNT));

        while (hasMore && page < 50) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            page++;
            setText(statusEl, `Indexing page ${page}…`);

            const url = `https://chat.deepseek.com/api/v0/chat_session/fetch_page?count=${perPage}${last ? `&before_seq_id=${last}` : ''}`;
            const controller = new AbortController();
            modalState.abortControllers.add(controller);

            try {
                const combinedSignal = signal ? combineAbortSignals(signal, controller.signal) : controller.signal;
                const res = await requestQueue.enqueue(
                    () => fetchWithRetries(url, { method: 'GET', headers: makeHeaders(token), signal: combinedSignal }),
                    { signal: combinedSignal }
                );

                const data = await res.json();
                const biz = data?.data?.biz_data;
                if (!(data && data.code === 0 && biz)) break;

                const sessions = biz.chat_sessions || [];
                hasMore = Boolean(biz.has_more);
                if (sessions.length > 0) {
                    const seqIds = sessions.map(s => Number(s?.seq_id)).filter(Number.isFinite);
                    if (seqIds.length > 0) last = Math.min(...seqIds);
                }

                await idbSessionsPutMany(sessions).catch(() => { });

            } catch (err) {
                if (err?.name === 'AbortError') throw err;
                console.warn('seedIndex error', err);
                break;
            } finally {
                modalState.abortControllers.delete(controller);
            }
        }
    }

    // =======================
    // Settings & manual indexing control
    // =======================
    let settingsModalOpen = false;

    function openSettingsModal(parentModal, statusEl) {
        if (settingsModalOpen) return;
        settingsModalOpen = true;

        const isDark = document.body.hasAttribute('data-ds-dark-theme');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dscs-settings-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 100000;
            display: flex; align-items: center; justify-content: center;
        `;

        // Create settings modal
        const modal = document.createElement('div');
        modal.className = `dscs-settings-modal ${isDark ? 'dark' : 'light'}`;
        modal.style.cssText = `
            background: ${isDark ? '#2a2a2a' : '#fff'};
            color: ${isDark ? '#eee' : '#111'};
            border-radius: 10px; width: 480px; max-width: calc(100% - 40px);
            max-height: 80vh; display: flex; flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px 20px; border-bottom: 1px solid ${isDark ? '#444' : '#ddd'};
            display: flex; justify-content: space-between; align-items: center;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 18px;">Settings</h3>
            <button class="dscs-settings-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: inherit; padding: 0 8px;">×</button>
        `;

        // Content
        const content = document.createElement('div');
        content.style.cssText = 'padding: 20px; overflow-y: auto; flex: 1;';

        const createSection = (title) => {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 20px;';
            section.innerHTML = `<h4 style="margin: 0 0 12px 0; font-size: 14px; color: ${isDark ? '#aaa' : '#666'}; text-transform: uppercase; letter-spacing: 0.5px;">${title}</h4>`;
            return section;
        };

        const createField = (label, inputHtml, hint = '') => {
            const field = document.createElement('div');
            field.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; gap: 12px;';
            field.innerHTML = `
                <label style="flex: 1; font-size: 13px;">${label}${hint ? `<br><small style="color: ${isDark ? '#888' : '#999'};">${hint}</small>` : ''}</label>
                <div style="width: 120px;">${inputHtml}</div>
            `;
            return field;
        };

        const inputStyle = `
            width: 100%; padding: 6px 10px; border: 1px solid ${isDark ? '#555' : '#ccc'};
            border-radius: 4px; background: ${isDark ? '#333' : '#fff'}; color: inherit;
            font-size: 13px; box-sizing: border-box;
        `;

        // Pagination section
        const paginationSection = createSection('Pagination');
        paginationSection.appendChild(createField('Results per page',
                                                  `<input type="number" id="dscs-s-results-page-size" value="${CONFIG.RESULTS_PAGE_SIZE}" min="1" max="100" style="${inputStyle}">`));
        paginationSection.appendChild(createField('Sessions per API page',
                                                  `<input type="number" id="dscs-s-page-count" value="${CONFIG.PAGE_COUNT}" min="10" max="200" style="${inputStyle}">`));

        // Content Search section
        const contentSection = createSection('Content Search');
        contentSection.appendChild(createField('Histories to fetch',
                                               `<input type="number" id="dscs-s-content-count" value="${CONFIG.CONTENT_SEARCH_COUNT}" min="1" max="100" style="${inputStyle}">`,
                                               'Per page during search'));
        contentSection.appendChild(createField('Max pages to search',
                                               `<input type="number" id="dscs-s-max-pages" value="${CONFIG.MAX_CONTENT_PAGES}" min="1" max="50" style="${inputStyle}">`));

        // Cache TTL section
        const cacheSection = createSection('Cache TTL');
        cacheSection.appendChild(createField('Session cache (days)',
                                             `<input type="number" id="dscs-s-page-ttl" value="${Math.round(CONFIG.PAGE_TTL_MS / (24 * 3600 * 1000))}" min="1" max="365" style="${inputStyle}">`));
        cacheSection.appendChild(createField('History cache (days)',
                                             `<input type="number" id="dscs-s-history-ttl" value="${Math.round(CONFIG.HISTORY_TTL_MS / (24 * 3600 * 1000))}" min="1" max="365" style="${inputStyle}">`));

        // Auto Sync section
        const syncSection = createSection('Auto Sync');
        syncSection.appendChild(createField('Enable auto sync',
                                            `<input type="checkbox" id="dscs-s-auto-sync" ${CONFIG.AUTO_SYNC_ENABLED ? 'checked' : ''} style="width: 18px; height: 18px;">`));
        syncSection.appendChild(createField('Sync interval (min)',
                                            `<input type="number" id="dscs-s-sync-interval" value="${Math.round(CONFIG.AUTO_SYNC_INTERVAL_MS / 60000)}" min="1" max="60" style="${inputStyle}">`));
        syncSection.appendChild(createField('Pages to sync',
                                            `<input type="number" id="dscs-s-sync-pages" value="${CONFIG.AUTO_SYNC_PAGES}" min="1" max="10" style="${inputStyle}">`));
        syncSection.appendChild(createField('Prefetch new histories',
                                            `<input type="checkbox" id="dscs-s-prefetch" ${CONFIG.AUTO_PREFETCH_NEW_HISTORIES ? 'checked' : ''} style="width: 18px; height: 18px;">`));
        syncSection.appendChild(createField('Prefetch limit',
                                            `<input type="number" id="dscs-s-prefetch-limit" value="${CONFIG.AUTO_PREFETCH_LIMIT}" min="1" max="100" style="${inputStyle}">`));

        // Rate Limiting section
        const rateSection = createSection('Rate Limiting');
        rateSection.appendChild(createField('Token capacity',
                                            `<input type="number" id="dscs-s-token-capacity" value="${CONFIG.TOKEN_BUCKET_CAPACITY}" min="1" max="20" style="${inputStyle}">`));
        rateSection.appendChild(createField('Refill per second',
                                            `<input type="number" id="dscs-s-token-refill" value="${CONFIG.TOKEN_BUCKET_REFILL_PER_SEC}" min="0.1" max="5" step="0.1" style="${inputStyle}">`));

        // Actions section
        const actionsSection = createSection('Actions');
        const buttonStyle = `
            padding: 10px 16px; border: 1px solid ${isDark ? '#555' : '#ccc'};
            border-radius: 6px; background: ${isDark ? '#333' : '#f5f5f5'};
            color: inherit; cursor: pointer; font-size: 13px; margin-right: 8px; margin-bottom: 8px;
        `;
        const dangerButtonStyle = buttonStyle + `border-color: #c44; color: #c44;`;

        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; flex-wrap: wrap;';
        actionsDiv.innerHTML = `
            <button id="dscs-btn-index-all" style="${buttonStyle}">Index All Chats</button>
            <button id="dscs-btn-clear-index" style="${dangerButtonStyle}">Clear Session Index</button>
            <button id="dscs-btn-clear-histories" style="${dangerButtonStyle}">Clear Histories</button>
        `;
        actionsSection.appendChild(actionsDiv);

        content.append(paginationSection, contentSection, cacheSection, syncSection, rateSection, actionsSection);

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 20px; border-top: 1px solid ${isDark ? '#444' : '#ddd'};
            display: flex; justify-content: flex-end; gap: 10px;
        `;
        footer.innerHTML = `
            <button id="dscs-btn-cancel" style="${buttonStyle}">Cancel</button>
            <button id="dscs-btn-save" style="${buttonStyle} background: #4a9eff; border-color: #4a9eff; color: #fff;">Save & Reload</button>
        `;

        modal.append(header, content, footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event handlers
        // track the Escape key handler so we can clean it up when closing
        let onEsc;
        const closeSettings = () => {
            settingsModalOpen = false;
            // remove the overlay from the DOM
            overlay.remove();
            // remove keydown listener if present to avoid leaks
            if (onEsc) {
                try { window.removeEventListener('keydown', onEsc); } catch (_) { }
                onEsc = null;
            }
        };

        header.querySelector('.dscs-settings-close').addEventListener('click', closeSettings);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSettings(); });
        footer.querySelector('#dscs-btn-cancel').addEventListener('click', closeSettings);

        footer.querySelector('#dscs-btn-save').addEventListener('click', () => {
            // Save all settings
            localStorage.setItem('dscs_results_page_size', modal.querySelector('#dscs-s-results-page-size').value);
            localStorage.setItem('dscs_page_count', modal.querySelector('#dscs-s-page-count').value);
            localStorage.setItem('dscs_content_count', modal.querySelector('#dscs-s-content-count').value);
            localStorage.setItem('dscs_max_pages', modal.querySelector('#dscs-s-max-pages').value);
            localStorage.setItem('dscs_page_ttl', String(Number(modal.querySelector('#dscs-s-page-ttl').value) * 24 * 3600 * 1000));
            localStorage.setItem('dscs_history_ttl', String(Number(modal.querySelector('#dscs-s-history-ttl').value) * 24 * 3600 * 1000));
            localStorage.setItem('dscs_auto_sync', modal.querySelector('#dscs-s-auto-sync').checked ? '1' : '0');
            localStorage.setItem('dscs_auto_sync_interval_ms', String(Number(modal.querySelector('#dscs-s-sync-interval').value) * 60000));
            localStorage.setItem('dscs_auto_sync_pages', modal.querySelector('#dscs-s-sync-pages').value);
            localStorage.setItem('dscs_auto_prefetch_new_histories', modal.querySelector('#dscs-s-prefetch').checked ? '1' : '0');
            localStorage.setItem('dscs_auto_prefetch_limit', modal.querySelector('#dscs-s-prefetch-limit').value);
            localStorage.setItem('dscs_token_capacity', modal.querySelector('#dscs-s-token-capacity').value);
            localStorage.setItem('dscs_token_refill', modal.querySelector('#dscs-s-token-refill').value);

            closeSettings();
            location.reload();
        });

        actionsDiv.querySelector('#dscs-btn-index-all').addEventListener('click', () => {
            closeSettings();
            setText(statusEl, 'Indexing all chats (this may take a while)…');
            indexAllChats(statusEl).catch((e) => console.warn('indexAllChats', e));
        });

        actionsDiv.querySelector('#dscs-btn-clear-index').addEventListener('click', () => {
            if (confirm('Clear local session index? This cannot be undone.')) {
                idbSessionsClear().then(() => {
                    setText(statusEl, 'Session index cleared.');
                    closeSettings();
                }).catch(() => setText(statusEl, 'Failed to clear index.'));
            }
        });

        actionsDiv.querySelector('#dscs-btn-clear-histories').addEventListener('click', () => {
            if (confirm('Clear cached histories? This cannot be undone.')) {
                idbHistoriesClear()
                    .then(() => {
                    try { localStorage.removeItem(DSCS_LAST_SYNC_UPDATED_AT_KEY); } catch (_) { }
                    try { localStorage.removeItem(DSCS_LAST_AUTO_SYNC_AT_KEY); } catch (_) { }
                    setText(statusEl, 'Histories cleared.');
                    closeSettings();
                })
                    .catch(() => setText(statusEl, 'Failed to clear histories.'));
            }
        });

        // Escape to close
        // assign the handler to the captured variable so closeSettings can remove it
        onEsc = (e) => {
            if (e.key === 'Escape') {
                closeSettings();
            }
        };
        window.addEventListener('keydown', onEsc);
    }

    // Index all chats by paging through API (with a safety cap)
    async function indexAllChats(statusEl) {
        const token = getStoredToken();
        if (!token) { alert('No auth token found'); return; }

        idbSessionsPruneOld(CONFIG.PAGE_TTL_MS).catch(() => { });
        idbHistoriesPruneExpired().catch(() => { });

        let last = null;
        let page = 0;
        let hasMore = true;
        let totalSessionsIndexed = 0;
        let totalHistoriesFetched = 0;
        const perPage = Math.min(200, Math.max(50, CONFIG.PAGE_COUNT));
        const safetyPages = 1000;

        while (hasMore && page < safetyPages && !modalState.closedSignal) {
            page++;
            setText(statusEl, `Fetching page ${page}… (${totalSessionsIndexed} chats indexed, ${totalHistoriesFetched} histories fetched)`);

            const url = `https://chat.deepseek.com/api/v0/chat_session/fetch_page?count=${perPage}${last ? `&before_seq_id=${last}` : ''}`;
            const controller = new AbortController();
            modalState.abortControllers.add(controller);

            try {
                const res = await requestQueue.enqueue(
                    () => fetchWithRetries(url, { method: 'GET', headers: makeHeaders(token), signal: controller.signal }),
                    { signal: controller.signal }
                );
                const data = await res.json();
                const biz = data?.data?.biz_data;
                if (!(data && data.code === 0 && biz)) break;

                const sessions = biz.chat_sessions || [];
                hasMore = Boolean(biz.has_more);
                if (sessions.length > 0) {
                    const seqIds = sessions.map(s => Number(s?.seq_id)).filter(Number.isFinite);
                    if (seqIds.length > 0) last = Math.min(...seqIds);
                }

                // Show what we're indexing
                for (const sess of sessions) {
                    totalSessionsIndexed++;
                    const title = sess.title || '(untitled)';
                    const truncatedTitle = title.length > 40 ? title.slice(0, 40) + '…' : title;
                    setText(statusEl, `Indexing chat: "${truncatedTitle}" (${totalSessionsIndexed} chats, ${totalHistoriesFetched} histories)`);
                }

                await idbSessionsPutMany(sessions).catch(() => { });

                // Prefetch histories for sessions without cached history
                const missing = [];
                try {
                    const cached = await idbHistoriesGetMany(sessions.map(s => s.id));
                    for (const s of sessions) {
                        if (!cached.has(String(s.id))) missing.push(s);
                    }
                } catch (_) {
                    for (const s of sessions) {
                        const rec = await idbHistoryGetRecord(s.id);
                        if (!rec) missing.push(s);
                    }
                }

                if (missing.length > 0) {
                    setText(statusEl, `Fetching ${missing.length} histories… (${totalSessionsIndexed} chats, ${totalHistoriesFetched} histories)`);
                    const batches = chunkArray(missing, CONFIG.HISTORY_CONCURRENCY);
                    let batchHistoriesFetched = 0;
                    for (const batch of batches) {
                        if (modalState.closedSignal) break;
                        const promises = batch.map(async (sess) => {
                            try {
                                await fetchHistoryMessages(sess.id);
                                batchHistoriesFetched++;
                                totalHistoriesFetched++;
                                const title = sess.title || '(untitled)';
                                const truncatedTitle = title.length > 30 ? title.slice(0, 30) + '…' : title;
                                setText(statusEl, `Fetching history: "${truncatedTitle}" (${batchHistoriesFetched}/${missing.length} this page, ${totalHistoriesFetched} total)`);
                            } catch (_) { }
                        });
                        await Promise.allSettled(promises);
                    }
                }

            } catch (err) {
                console.warn('indexAllChats error', err);
                break;
            } finally {
                modalState.abortControllers.delete(controller);
            }
        }

        setText(statusEl, `Done! Indexed ${totalSessionsIndexed} chats, fetched ${totalHistoriesFetched} histories.`);
        sessionsSnapshot.invalidate();
    }

    // =======================
    // Small helpers
    // =======================
    function chunkArray(arr, size) {
        const n = Math.max(1, Number(size) || 1);
        const out = [];
        for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
    }

    // =======================
    // Init
    // =======================
    installNavigationReinitHook();
    createIconAndObserve();

    // expose quick methods - use unsafeWindow for Greasemonkey compatibility
    const globalObj = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    globalObj.DSCS = globalObj.DSCS || {};
    globalObj.DSCS.clearSessionIndex = async function () {
        await idbSessionsClear();
        try { localStorage.removeItem(DSCS_LAST_SYNC_UPDATED_AT_KEY); } catch (_) { }
        try { localStorage.removeItem(DSCS_LAST_AUTO_SYNC_AT_KEY); } catch (_) { }
        alert('Session index cleared');
    };
    globalObj.DSCS.clearHistories = async function () {
        await idbHistoriesClear();
        alert('Histories cleared');
    };
    globalObj.DSCS.autoSyncRecentSessions = async function () {
        return await autoSyncRecentSessions({ force: true });
    };

    globalObj.DSCS.indexAllChats = async function () {
        const status = document.createElement('div');
        document.body.appendChild(status);
        await indexAllChats(status);
        status.remove();
        alert('Indexing finished');
    };

    // global unload cleanup
    window.addEventListener('beforeunload', () => {
        try { modalController?.close(); } catch (_) { }
        abortAllModalRequests();
        tokenBucket.destroy();
    });

})();
