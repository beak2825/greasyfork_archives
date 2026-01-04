// ==UserScript==
// @name         torn-crack
// @namespace    torn-crack
// @version      1.0.0
// @description  Simple Cracking Helper
// @author       SirAua [3785905]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        *://www.torn.com/page.php?sid=crimes*
// @grant        GM_xmlhttpRequest
// @connect      gitlab.com
// @connect      supabase.co
// @connect      *.supabase.co
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/544469/torn-crack.user.js
// @updateURL https://update.greasyfork.org/scripts/544469/torn-crack.meta.js
// ==/UserScript==


(function () {
    'use strict';
    if (window.CRACK_INJECTED) return;
    window.CRACK_INJECTED = true;

    /* --------------------------
       Config
       -------------------------- */
    const debug = false;
    const UPDATE_INTERVAL = 800;
    const MAX_SUG = 8;
    const MIN_LENGTH = 4;
    const MAX_LENGTH = 10;

    const WORDLIST_URL =
        'https://gitlab.com/kalilinux/packages/seclists/-/raw/kali/master/Passwords/Common-Credentials/Pwdb_top-1000000.txt?ref_type=heads';

    const DOWNLOAD_MIN_DELTA = 20;

    const SUPABASE_ADD_WORD_URL =
        'https://mthndavliqfbtaplgfau.supabase.co/functions/v1/add-word';
    const SUPABASE_STORAGE_BASE =
        'https://mthndavliqfbtaplgfau.supabase.co/storage/v1/object/public/words';
    const METADATA_URL = `${SUPABASE_STORAGE_BASE}/metadata.json`;

    /* --------------------------
        Rate-limiting / batching
        -------------------------- */
    const SYNC_MIN_INTERVAL_MS = 6 * 60 * 60 * 1000;
    const OUTBOX_FLUSH_INTERVAL_MS = 5 * 1000;
    const OUTBOX_POST_INTERVAL_MS = 2000;
    const OUTBOX_BATCH_SIZE = 5;

    const DB_NAME = 'crack';
    const STORE_NAME = 'dictionary';
    const STATUS_PREF_KEY = 'crack_show_badge';
    const EXCL_STORAGE_PREFIX = 'crack_excl_';

    /* --------------------------
       State
       -------------------------- */
    let dict = [];
    let dictLoaded = false;
    let dictLoading = false;
    let supabaseWords = new Set();
    let statusEl = null;
    const prevRowStates = new Map();
    const panelUpdateTimers = new Map();
    const LAST_INPUT = { key: null, time: 0 };

    let outboxFlushTimer = null;
    let lastOutboxPost = 0;

    /* --------------------------
       Utils
       -------------------------- */
    function crackLog(...args) { if (debug) console.log('[Crack]', ...args); }
    function getBoolPref(key, def = true) {
        const v = localStorage.getItem(key); return v === null ? def : v === '1';
    }
    function setBoolPref(key, val) { localStorage.setItem(key, val ? '1' : '0'); }

    function ensureStatusBadge() {
        if (statusEl) return statusEl;
        statusEl = document.createElement('div');
        statusEl.id = '__crack_status';
        statusEl.style.cssText = `
          position: fixed; right: 10px; bottom: 40px; z-index: 10000;
          background:#000; color:#0f0; border:1px solid #0f0; border-radius:6px;
          padding:6px 8px; font-size:11px; font-family:monospace; opacity:0.9;
        `;
        statusEl.textContent = 'Dictionary: Idle';
        document.body.appendChild(statusEl);
        const show = getBoolPref(STATUS_PREF_KEY, true);
        statusEl.style.display = show ? 'block' : 'none';
        return statusEl;
    }
    const __statusSinks = new Set();
    function registerStatusSink(el) { if (el) __statusSinks.add(el); }
    function unregisterStatusSink(el) { if (el) __statusSinks.delete(el); }
    function setStatus(msg) {
        const text = `Dictionary: ${msg}`;
        const badge = ensureStatusBadge();
        if (badge.textContent !== text) badge.textContent = text;
        __statusSinks.forEach(el => { if (el && el.textContent !== text) el.textContent = text; });
        crackLog('STATUS →', msg);
    }

    function gmRequest(opts) {
        return new Promise((resolve, reject) => {
            try {
                const safeOpts = Object.assign({}, opts);
                if (!('responseType' in safeOpts) || !safeOpts.responseType) safeOpts.responseType = 'text';
                safeOpts.headers = Object.assign({ Accept: 'application/json, text/plain, */*; q=0.1' }, safeOpts.headers || {});
                GM_xmlhttpRequest({ ...safeOpts, onload: resolve, onerror: reject, ontimeout: reject });
            } catch (err) { reject(err); }
        });
    }

    function getHeader(headers, name) {
        const re = new RegExp('^' + name + ':\\s*(.*)$', 'mi');
        const m = headers && headers.match ? headers.match(re) : null;
        return m ? m[1].trim() : null;
    }

    function metadataURL(force = false) {
        const ts = force ? Date.now() : Math.floor(Date.now() / 60000);
        return `${METADATA_URL}?cb=${ts}`;
    }

    function formatShortDuration(ms) {
        if (ms <= 0) return 'now';
        const s = Math.floor(ms / 1000);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (d > 0) return `${d}d ${h}h ${m}m`;
        if (h > 0) return `${h}h ${m}m ${sec}s`;
        if (m > 0) return `${m}m ${sec}s`;
        return `${sec}s`;
    }

    function cleanupView() {
        const btn = document.getElementById('__crack_menu_btn');
        if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        const pnl = document.querySelectorAll('.__crackhelp_panel');
        if (pnl) pnl.forEach(p => p.remove());
    }

    /* --------------------------
       Dynamic LZString loader
       -------------------------- */
    let LZ_READY = false;
    function loadLZString(url = 'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js') {
        return new Promise((resolve, reject) => {
            if (typeof LZString !== 'undefined') { LZ_READY = true; resolve(LZString); return; }
            const script = document.createElement('script');
            script.src = url; script.async = true;
            script.onload = () => {
                if (typeof LZString !== 'undefined') { LZ_READY = true; resolve(LZString); }
                else reject(new Error('LZString failed to load'));
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function compressPayload(obj) {
        try {
            if (!LZ_READY) return { compressed: false, payload: JSON.stringify(obj) };
            const json = JSON.stringify(obj);
            const b64 = LZString.compressToBase64(json);
            return { compressed: true, payload: b64 };
        } catch (e) {
            crackLog('Compression failed', e);
            return { compressed: false, payload: JSON.stringify(obj) };
        }
    }

    /* --------------------------
       IndexedDB
       -------------------------- */
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    async function idbSet(key, value) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put(value, key);
            tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
        });
    }
    async function idbGet(key) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async function idbClear() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
        });
    }
    async function clearLocalDictCache() {
        await idbClear();
        crackLog('Cleared cached dictionary from IndexedDB');
        setStatus('Cleared cache — reload');
    }

    /* --------------------------
       Key capture
       -------------------------- */
    function captureKey(k) {
        if (!k) return;
        const m = String(k).match(/^[A-Za-z0-9._]$/);
        if (!m) return;
        LAST_INPUT.key = k.toUpperCase();
        LAST_INPUT.time = performance.now();
    }
    window.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        captureKey(e.key);
    }, true);

    /* --------------------------
       Dictionary load
       -------------------------- */
    async function commitBucketsToIDB(buckets) {
        for (const lenStr of Object.keys(buckets)) {
            const L = Number(lenStr);
            const newArr = Array.from(buckets[lenStr]);
            let existing = await idbGet(`len_${L}`);
            if (!existing) existing = [];
            const merged = Array.from(new Set([...existing, ...newArr]));
            await idbSet(`len_${L}`, merged);
            dict[L] = merged;
        }
    }

    async function fetchAndIndex(url, onProgress) {
        setStatus('Downloading base wordlist …');
        let res;
        try {
            res = await gmRequest({ method: 'GET', url, timeout: 90000, responseType: 'text' });
        } catch (e) {
            throw e;
        }
        if (res.status < 200 || res.status >= 300 || !res.responseText) {
            const err = new Error(`Bad response from base wordlist: ${res.status}`);
            err.status = res.status;
            throw err;
        }
        setStatus('Indexing…');

        const lines = (res.responseText || '').split(/\r?\n/);
        const buckets = {};
        let processed = 0;

        for (const raw of lines) {
            processed++;
            const word = (raw || '').trim().toUpperCase();
            if (!word) continue;
            if (!/^[A-Z0-9_.]+$/.test(word)) continue;
            const L = word.length;
            if (L < MIN_LENGTH || L > MAX_LENGTH) continue;
            if (!buckets[L]) buckets[L] = new Set();
            buckets[L].add(word);

            if (processed % 5000 === 0 && typeof onProgress === 'function') {
                onProgress({ phase: '1M-index', processed, pct: null });
                await new Promise(r => setTimeout(r, 0));
            }
        }

        await commitBucketsToIDB(buckets);

        const perLengthCounts = {};
        for (let L = MIN_LENGTH; L <= MAX_LENGTH; L++) {
            perLengthCounts[L] = (await idbGet(`len_${L}`))?.length || 0;
        }
        setStatus('1M cached');
        return { totalProcessed: processed, perLengthCounts };
    }

    function needReloadAfterBaseLoad() {
        try {
            if (sessionStorage.getItem('__crack_base_reload_done') === '1') return false;
            sessionStorage.setItem('__crack_base_reload_done', '1');
            return true;
        } catch { return true; }
    }

    async function loadDict() {
        if (dictLoaded || dictLoading) return;
        dictLoading = true;
        setStatus('Loading from cache…');

        let hasData = false;
        dict = [];
        for (let len = MIN_LENGTH; len <= MAX_LENGTH; len++) {
            const chunk = await idbGet(`len_${len}`);
            if (chunk && chunk.length) { dict[len] = chunk; hasData = true; }
        }

        if (!hasData) {
            crackLog('No cache found. Downloading dictionary…');
            const MAX_TRIES = 4;
            const DELAYS = [0, 3000, 10000, 30000]; // ms
            let ok = false, lastErr = null;

            for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
                try {
                    await fetchAndIndex(WORDLIST_URL, ({ phase, processed }) => {
                        if (phase === '1M-index') setStatus(`Indexing 1M… processed ${processed}`);
                    });
                    ok = true;
                    break;
                } catch (e) {
                    lastErr = e;
                    const wait = DELAYS[Math.min(attempt, DELAYS.length - 1)];
                    crackLog(`Base download failed (try ${attempt + 1}/${MAX_TRIES})`, e);
                    setStatus(`Download failed (try ${attempt + 1}/${MAX_TRIES}) — retrying in ${Math.ceil(wait / 1000)}s…`);
                    if (wait) await new Promise(r => setTimeout(r, wait));
                }
            }

            if (!ok) {
                crackLog('Giving up on base download for now.', lastErr);
                dictLoading = false;
                dictLoaded = false;
                setTimeout(() => { loadDict().catch(() => { }); }, 60000);
                setStatus('Failed to fetch base wordlist (will retry)...');
                return;
            }

            if (needReloadAfterBaseLoad()) {
                setStatus('Dictionary cached — reloading…');
                setTimeout(() => location.reload(), 120);
                return;
            }
        } else {
            crackLog('Dictionary loaded from IndexedDB');
        }

        dictLoaded = true;
        dictLoading = false;
        setStatus('Ready');
    }

    async function fetchRemoteMeta(force = false) {
        try {
            const lastSync = Number(await idbGet('sb_last_sync_ts')) || 0;
            const now = Date.now();
            if (!force && (now - lastSync) < SYNC_MIN_INTERVAL_MS) {
                crackLog('Skipping fetchRemoteMeta (recent sync)');
                const cachedMeta = await idbGet('sb_metadata') || {};
                return {
                    count: cachedMeta.count || Number(await idbGet('sb_remote_count')) || 0,
                    etag: cachedMeta.etag || (await idbGet('sb_remote_etag')) || '',
                    snapshot_path: cachedMeta.snapshot_path || null,
                    diff_path: cachedMeta.diff_path || null,
                    generated_at: cachedMeta.generated_at || null
                };
            }

            const metaUrl = metadataURL(force);
            crackLog('Fetching metadata.json from Storage ->', metaUrl);
            const metaRes = await gmRequest({ method: 'GET', url: metaUrl, timeout: 10000, responseType: 'text' });

            if (metaRes.status !== 200) {
                crackLog('metadata.json not available; using cached meta only', metaRes.status);
                const cachedMeta = await idbGet('sb_metadata') || {};
                return {
                    count: cachedMeta.count || Number(await idbGet('sb_remote_count')) || 0,
                    etag: cachedMeta.etag || (await idbGet('sb_remote_etag')) || '',
                    snapshot_path: cachedMeta.snapshot_path || null,
                    diff_path: cachedMeta.diff_path || null,
                    generated_at: cachedMeta.generated_at || null
                };
            }

            const meta = JSON.parse(metaRes.responseText || '{}');
            const toSave = {
                count: meta.count || 0,
                etag: '',
                snapshot_path: meta.snapshot_path || meta.latest_path || null,
                diff_path: meta.diff_path || null,
                generated_at: meta.generated_at || null
            };

            if (toSave.snapshot_path) {
                const latestUrl = `${SUPABASE_STORAGE_BASE}/${toSave.snapshot_path}`;
                try {
                    const headRes = await gmRequest({ method: 'HEAD', url: latestUrl, timeout: 8000, headers: { Accept: 'text/plain' } });
                    const et = getHeader(headRes.responseHeaders, 'ETag') || '';
                    if (et) toSave.etag = et;
                } catch (e) {
                    crackLog('HEAD latest failed', e);
                }
            }

            await idbSet('sb_metadata', toSave);
            await idbSet('sb_remote_count', toSave.count);
            if (toSave.etag) await idbSet('sb_remote_etag', toSave.etag);
            await idbSet('sb_last_sync_ts', Date.now());

            return { count: toSave.count, etag: toSave.etag, snapshot_path: toSave.snapshot_path, diff_path: toSave.diff_path, generated_at: toSave.generated_at };
        } catch (e) {
            crackLog('fetchRemoteMeta failed:', e);
            return { count: Number(await idbGet('sb_remote_count')) || 0, etag: await idbGet('sb_remote_etag') || '', snapshot_path: null, diff_path: null, generated_at: null };
        }
    }

    async function mergeSupabaseIntoCache(words) {
        const byLen = {};
        for (const w of words) {
            if (!/^[A-Z0-9_.]+$/.test(w)) continue;
            const L = w.length;
            if (L < MIN_LENGTH || L > MAX_LENGTH) continue;
            if (!byLen[L]) byLen[L] = new Set();
            byLen[L].add(w);
        }
        let added = 0;
        for (let L = MIN_LENGTH; L <= MAX_LENGTH; L++) {
            const set = byLen[L]; if (!set || set.size === 0) continue;
            let chunk = await idbGet(`len_${L}`); if (!chunk) chunk = [];
            const existing = new Set(chunk);
            let changed = false;
            for (const w of set) {
                if (!existing.has(w)) { existing.add(w); added++; changed = true; }
            }
            if (changed) {
                const merged = Array.from(existing);
                await idbSet(`len_${L}`, merged);
                dict[L] = merged;
            }
        }
        return added;
    }

    async function applyDiffFromStorage(diffPath) {
        try {
            const url = `${SUPABASE_STORAGE_BASE}/${diffPath}`;
            crackLog('Fetching diff ->', url);
            const res = await gmRequest({ method: 'GET', url, timeout: 15000, responseType: 'text' });
            if (res.status !== 200) {
                crackLog('Diff fetch returned', res.status);
                return 0;
            }
            const ndjson = res.responseText || '';
            const words = [];
            for (const line of ndjson.split(/\r?\n/)) {
                if (!line) continue;
                try {
                    const o = JSON.parse(line);
                    if (o && o.w) words.push(String(o.w).toUpperCase());
                } catch { /* ignore */ }
            }
            const merged = await mergeSupabaseIntoCache(words);
            crackLog('Applied diff, added:', merged);
            if (merged > 0) setStatus(`Ready (+${merged})`);
            return merged;
        } catch (e) {
            crackLog('applyDiffFromStorage failed', e);
            return 0;
        }
    }

    async function downloadCommunityWordlist(ifNoneMatchEtag) {
        try {
            const meta = await fetchRemoteMeta(true);
            if (!meta.snapshot_path) {
                crackLog('No snapshot_path in metadata.');
                return 0;
            }

            const snapshotUrl = `${SUPABASE_STORAGE_BASE}/${meta.snapshot_path}`;
            crackLog('Fetching snapshot from storage ->', snapshotUrl);

            const headers = {};
            if (ifNoneMatchEtag) headers['If-None-Match'] = ifNoneMatchEtag;

            const res = await gmRequest({ method: 'GET', url: snapshotUrl, headers, timeout: 45000, responseType: 'text' });

            const remoteEtag = getHeader(res.responseHeaders, 'ETag') || '';
            if (remoteEtag) await idbSet('sb_remote_etag', remoteEtag);

            if (res.status === 304) {
                crackLog('Snapshot unchanged (304)');
                if (meta.diff_path) await applyDiffFromStorage(meta.diff_path);
                await idbSet('sb_last_downloaded_count', meta.count || 0);
                await idbSet('sb_last_sync_ts', Date.now());
                return 0;
            }

            if (res.status !== 200) {
                crackLog('Snapshot fetch failed, status:', res.status);
                return 0;
            }

            const text = res.responseText || '';
            setStatus('Indexing snapshot…');
            const lines = text.split(/\r?\n/);
            const buckets = {};
            let processed = 0;
            for (const raw of lines) {
                processed++;
                const word = (raw || '').trim().toUpperCase();
                if (!word) continue;
                if (!/^[A-Z0-9_.]+$/.test(word)) continue;
                const L = word.length;
                if (L < MIN_LENGTH || L > MAX_LENGTH) continue;
                if (!buckets[L]) buckets[L] = new Set();
                buckets[L].add(word);
                if (processed % 5000 === 0) await new Promise(r => setTimeout(r, 0));
            }
            await commitBucketsToIDB(buckets);
            setStatus('Snapshot indexed');

            if (meta.diff_path) await applyDiffFromStorage(meta.diff_path);

            await idbSet('sb_remote_count', meta.count || 0);
            await idbSet('sb_last_downloaded_count', meta.count || 0);
            await idbSet('sb_last_sync_ts', Date.now());
            if (remoteEtag) await idbSet('sb_remote_etag', remoteEtag);
            await idbSet('sb_metadata', {
                snapshot_path: meta.snapshot_path,
                diff_path: meta.diff_path,
                count: meta.count,
                generated_at: meta.generated_at,
                etag: remoteEtag
            });

            return 1;
        } catch (e) {
            crackLog('downloadCommunityWordlist failed:', e);
            return 0;
        }
    }

    async function checkRemoteAndMaybeDownload(force = false) {
        const meta = await fetchRemoteMeta(force);
        const lastDownloaded = (await idbGet('sb_last_downloaded_count')) || 0;
        const remoteCount = meta.count || Number(await idbGet('sb_remote_count')) || 0;
        const delta = Math.max(0, remoteCount - lastDownloaded);

        if (!force && delta < DOWNLOAD_MIN_DELTA) {
            crackLog(`Skip download: delta=${delta} < ${DOWNLOAD_MIN_DELTA}`);
            await idbSet('sb_pending_delta', delta);
            return 0;
        }

        setStatus(force ? 'Manual sync…' : `Syncing (+${delta})…`);
        const added = await downloadCommunityWordlist(meta.etag || (await idbGet('sb_remote_etag')) || '');
        await idbSet('sb_pending_delta', 0);
        return added;
    }

    let autoSyncTimer = null;
    let autoSyncInFlight = false;

    async function msUntilEligibleSync() {
        const last = Number(await idbGet('sb_last_sync_ts')) || 0;
        const remain = last + SYNC_MIN_INTERVAL_MS - Date.now();
        return Math.max(0, remain);
    }

    function startAutoSyncHeartbeat() {
        if (autoSyncTimer) return;
        autoSyncTimer = setInterval(async () => {
            if (autoSyncInFlight) return;
            try {
                const remain = await msUntilEligibleSync();
                if (remain > 0) return;

                autoSyncInFlight = true;
                setStatus('Auto-syncing community words…');

                const added = await checkRemoteAndMaybeDownload(false);

                const remoteCount = await idbGet('sb_remote_count');
                const delta = await idbGet('sb_pending_delta');
                if (added && added > 0) {
                    setStatus(`Ready (+${added}, remote: ${remoteCount})`);
                } else {
                    setStatus(`Ready (remote ${remoteCount}${delta ? `, +${delta} pending` : ''})`);
                }
            } catch (e) {
                crackLog('Auto-sync failed', e);
                setStatus('Ready');
            } finally {
                autoSyncInFlight = false;
            }
        }, 1000);
    }

    /* --------------------------
       Outbox
       -------------------------- */
    async function enqueueOutbox(word) {
        if (!word) return;
        const w = word.toUpperCase();
        let out = await idbGet('sb_outbox') || [];
        if (!out.includes(w)) {
            out.push(w);
            await idbSet('sb_outbox', out);
            crackLog('Enqueued word to outbox:', w);
            ensureOutboxFlushScheduled();
        }
    }

    function ensureOutboxFlushScheduled() {
        if (outboxFlushTimer) return;
        outboxFlushTimer = setTimeout(flushOutbox, OUTBOX_FLUSH_INTERVAL_MS);
    }

    async function flushOutbox() {
        outboxFlushTimer = null;
        let out = await idbGet('sb_outbox') || [];
        if (!out || out.length === 0) return;

        while (out.length > 0) {
            const batch = out.splice(0, OUTBOX_BATCH_SIZE);
            const now = Date.now();
            const sinceLast = now - lastOutboxPost;
            if (sinceLast < OUTBOX_POST_INTERVAL_MS) await new Promise(r => setTimeout(r, OUTBOX_POST_INTERVAL_MS - sinceLast));

            const compressed = compressPayload({ words: batch });
            const body = compressed.compressed ? { compressed: true, data: compressed.payload } : { words: batch };

            try {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: SUPABASE_ADD_WORD_URL,
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(body),
                        onload: (res) => {
                            if (res.status >= 200 && res.status < 300) resolve(res);
                            else reject(res);
                        }, onerror: reject, ontimeout: reject, timeout: 15000
                    });
                });
                crackLog('Flushed outbox batch:', batch.length, compressed.compressed ? '(compressed)' : '(raw)');
                for (const w of batch) { supabaseWords.add(w); await addWordToLocalCache(w); }
            } catch (e) {
                crackLog('Batch POST failed, falling back to single POSTs', e);
                for (const w of batch) {
                    const b = compressPayload({ word: w });
                    const singleBody = b.compressed ? { compressed: true, data: b.payload } : { word: w };
                    try {
                        await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST', url: SUPABASE_ADD_WORD_URL,
                                headers: { 'Content-Type': 'application/json' },
                                data: JSON.stringify(singleBody),
                                onload: (r) => (r.status >= 200 && r.status < 300) ? resolve(r) : reject(r),
                                onerror: reject, ontimeout: reject, timeout: 10000
                            });
                        });
                        crackLog('Flushed outbox (single):', w, b.compressed ? '(compressed)' : '(raw)');
                        supabaseWords.add(w);
                        await addWordToLocalCache(w);
                        await new Promise(r => setTimeout(r, OUTBOX_POST_INTERVAL_MS));
                    } catch (ee) {
                        crackLog('Single POST failed for', w, ee);
                        out.unshift(w);
                        break;
                    }
                }
            }

            lastOutboxPost = Date.now();
            await idbSet('sb_outbox', out);
        }
    }

    /* --------------------------
       Exclusions + suggestions
       -------------------------- */
    function loadExclusions(rowKey, len) {
        const raw = sessionStorage.getItem(EXCL_STORAGE_PREFIX + rowKey + '_' + len);
        let arr = [];
        if (raw) { try { arr = JSON.parse(raw); } catch { } }
        const out = new Array(len);
        for (let i = 0; i < len; i++) {
            const s = Array.isArray(arr[i]) ? arr[i] : (typeof arr[i] === 'string' ? arr[i].split('') : []);
            out[i] = new Set(s.map(c => String(c || '').toUpperCase()).filter(Boolean));
        }
        return out;
    }
    function saveExclusions(rowKey, len, sets) {
        const arr = new Array(len);
        for (let i = 0; i < len; i++) arr[i] = Array.from(sets[i] || new Set());
        sessionStorage.setItem(EXCL_STORAGE_PREFIX + rowKey + '_' + len, JSON.stringify(arr));
    }
    function schedulePanelUpdate(panel) {
        if (!panel) return;
        const key = panel.dataset.rowkey;
        if (panelUpdateTimers.has(key)) clearTimeout(panelUpdateTimers.get(key));
        panelUpdateTimers.set(key, setTimeout(() => {
            panel.updateSuggestions();
            panelUpdateTimers.delete(key);
        }, 50));
    }
    function addExclusion(rowKey, pos, letter, len) {
        letter = String(letter || '').toUpperCase();
        if (!letter) return;
        const sets = loadExclusions(rowKey, len);
        if (!sets[pos]) sets[pos] = new Set();
        const before = sets[pos].size;
        sets[pos].add(letter);
        if (sets[pos].size !== before) {
            saveExclusions(rowKey, len, sets);
            const panel = document.querySelector(`.__crackhelp_panel[data-rowkey="${rowKey}"]`);
            schedulePanelUpdate(panel);
        }
    }

    async function suggest(pattern, rowKey) {
        const len = pattern.length;
        if (len < MIN_LENGTH || len > MAX_LENGTH) return [];
        if (!dict[len]) {
            const chunk = await idbGet(`len_${len}`); if (!chunk) return [];
            dict[len] = chunk;
        }
        const maxCandidates = MAX_SUG * 50;
        const worker = new Worker(URL.createObjectURL(new Blob([`
          self.onmessage = function(e) {
            const { dictChunk, pattern, max } = e.data;
            const regex = new RegExp('^' + pattern.replace(/[*]/g, '.') + '$');
            const out = [];
            for (const word of dictChunk) {
              if (regex.test(word)) out.push(word);
              if (out.length >= max) break;
            }
            self.postMessage(out);
          };
        `], { type: 'application/javascript' })));
        const candidates = await new Promise((resolve) => {
            worker.onmessage = (e) => { worker.terminate(); resolve([...new Set(e.data)]); };
            worker.postMessage({ dictChunk: dict[len], pattern: pattern.toUpperCase(), max: maxCandidates });
        });

        const exSets = loadExclusions(rowKey, len);
        const filtered = candidates.filter(w => {
            for (let i = 0; i < len; i++) {
                const s = exSets[i];
                if (s && s.has(w[i])) return false;
            }
            return true;
        });
        return filtered.slice(0, MAX_SUG);
    }

    function prependPanelToRow(row, pat, rowKey) {
        let panel = row.querySelector('.__crackhelp_panel');

        if (!panel) {
            panel = document.createElement('div');
            panel.className = '__crackhelp_panel';
            panel.dataset.rowkey = rowKey;
            panel.dataset.pattern = pat;
            panel.style.cssText = 'background:#000; font-size:10px; text-align:center; position:absolute; z-index:9999;';

            const listDiv = document.createElement('div');
            listDiv.style.cssText = 'margin-top:2px;';
            panel.appendChild(listDiv);

            panel.updateSuggestions = async function () {
                const curPat = panel.dataset.pattern || '';
                const curRowKey = panel.dataset.rowkey;

                if (!dictLoaded && dictLoading) {
                    if (!listDiv.firstChild || listDiv.firstChild.textContent !== '(loading dictionary…)') {
                        listDiv.innerHTML = '<span style="padding:2px;color:#ff0;">(loading dictionary…)</span>';
                    }
                    return;
                }

                const sugs = await suggest(curPat, curRowKey);
                let i = 0;
                for (; i < sugs.length; i++) {
                    let sp = listDiv.children[i];
                    if (!sp) { sp = document.createElement('span'); sp.style.cssText = 'padding:2px;color:#0f0;'; listDiv.appendChild(sp); }
                    if (sp.textContent !== sugs[i]) sp.textContent = sugs[i];
                    if (sp.style.color !== 'rgb(0, 255, 0)' && sp.style.color !== '#0f0') sp.style.color = '#0f0';
                }
                while (listDiv.children.length > sugs.length) listDiv.removeChild(listDiv.lastChild);

                if (sugs.length === 0) {
                    if (!listDiv.firstChild) {
                        const sp = document.createElement('span');
                        sp.textContent = dictLoaded ? '(no matches)' : '(loading dictionary…)';
                        sp.style.color = dictLoaded ? '#a00' : '#ff0';
                        listDiv.appendChild(sp);
                    } else {
                        const sp = listDiv.firstChild;
                        const txt = dictLoaded ? '(no matches)' : '(loading dictionary…)';
                        if (sp.textContent !== txt) sp.textContent = txt;
                        sp.style.color = dictLoaded ? '#a00' : '#ff0';
                    }
                }
            };

            row.prepend(panel);
        } else {
            panel.dataset.pattern = pat;
        }
        schedulePanelUpdate(panel);
        return panel;
    }

    async function isWordInLocalDict(word) {
        const len = word.length;
        if (!dict[len]) {
            const chunk = await idbGet(`len_${len}`); if (!chunk) return false;
            dict[len] = chunk;
        }
        return dict[len].includes(word);
    }

    async function addWordToLocalCache(word) {
        const len = word.length;
        if (len < MIN_LENGTH || len > MAX_LENGTH) return;
        let chunk = await idbGet(`len_${len}`); if (!chunk) chunk = [];
        if (!chunk.includes(word)) {
            chunk.push(word); await idbSet(`len_${len}`, chunk);
            if (!dict[len]) dict[len] = [];
            if (!dict[len].includes(word)) dict[len].push(word);
            crackLog('Added to local cache:', word);
        }
    }

    function getRowKey(crimeOption) {
        if (!crimeOption.dataset.crackKey) {
            crimeOption.dataset.crackKey = String(Date.now()) + '-' + Math.floor(Math.random() * 100000);
        }
        return crimeOption.dataset.crackKey;
    }

    function attachSlotSensors(crimeOption, rowKey) {
        if (crimeOption.dataset.crackDelegated === '1') return;
        crimeOption.dataset.crackDelegated = '1';

        const slotSelector = '[class^="charSlot"]:not([class*="charSlotDummy"])';
        const badLineSelector = '[class*="incorrectGuessLine"]';

        const onVisualCue = (ev) => {
            const t = ev.target;
            const slot = t.closest && t.closest(slotSelector);
            if (!slot || !crimeOption.contains(slot)) return;

            const slots = crimeOption.querySelectorAll(slotSelector);
            const i = Array.prototype.indexOf.call(slots, slot);
            if (i < 0) return;
            if (getComputedStyle(slot).borderColor === 'rgb(130, 201, 30)') return;

            const now = performance.now();
            const shown = (slot.textContent || '').trim();
            if (shown && /^[A-Za-z0-9._]$/.test(shown)) return;

            const prev = prevRowStates.get(rowKey) || null;
            const hasRowLastInput = !!(prev && prev.lastInput && (now - prev.lastInput.time) <= 1800 && prev.lastInput.i === i);
            const isIncorrectLineEvent = t.matches && t.matches(badLineSelector);
            const freshGlobal = (now - (LAST_INPUT.time || 0)) <= 1800;

            let letter = null;
            if (hasRowLastInput) letter = prev.lastInput.letter;
            else if (isIncorrectLineEvent && freshGlobal && LAST_INPUT.key) letter = LAST_INPUT.key.toUpperCase();
            else return;

            if (!/^[A-Za-z0-9._]$/.test(letter)) return;

            const len = slots.length;
            addExclusion(rowKey, i, letter, len);

            const panel = document.querySelector(`.__crackhelp_panel[data-rowkey="${rowKey}"]`);
            if (panel && panel.updateSuggestions) schedulePanelUpdate(panel);
        };

        crimeOption.addEventListener('animationstart', onVisualCue, true);
        crimeOption.addEventListener('transitionend', onVisualCue, true);
    }

    function scanCrimePage() {
        if (!location.href.endsWith('cracking')) return;

        const currentCrime = document.querySelector('[class^="currentCrime"]');
        if (!currentCrime) return;

        const container = currentCrime.querySelector('[class^="virtualList"]');
        if (!container) return;

        const crimeOptions = container.querySelectorAll('[class^="crimeOptionWrapper"]');

        for (const crimeOption of crimeOptions) {
            let patText = '';
            const rowKey = getRowKey(crimeOption);
            attachSlotSensors(crimeOption, rowKey);

            const charSlots = crimeOption.querySelectorAll('[class^="charSlot"]:not([class*="charSlotDummy"])');
            const curChars = [];
            for (const charSlot of charSlots) {
                let ch = (charSlot.textContent || '').trim().toUpperCase();
                curChars.push(ch ? ch : '*');
            }
            patText = curChars.join('');

            const now = performance.now();
            const len = curChars.length;

            const prev = prevRowStates.get(rowKey) || { chars: Array(len).fill('*') };

            for (let i = 0; i < len; i++) {
                const was = prev.chars[i];
                const is = curChars[i];
                if (was === '*' && is !== '*') prev.lastInput = { i, letter: is, time: now };
                if (was !== '*' && is === '*') {
                    if (prev.lastInput && prev.lastInput.i === i && prev.lastInput.letter === was && (now - prev.lastInput.time) <= 1800) {
                        addExclusion(rowKey, i, was, len);
                    }
                }
            }
            prevRowStates.set(rowKey, { chars: curChars, lastInput: prev.lastInput, time: now });

            if (!/[*]/.test(patText)) {
                const newWord = patText.toUpperCase();
                if (!/^[A-Z0-9_.]+$/.test(newWord)) {
                    crackLog('Revealed word contains invalid chars. skippin:', newWord);
                } else {
                    (async () => {
                        const localHas = await isWordInLocalDict(newWord);
                        const supHas = supabaseWords.has(newWord);
                        if (!localHas && !supHas) {
                            await addWordToLocalCache(newWord);
                            await enqueueOutbox(newWord);
                        } else if (supHas && !localHas) {
                            await addWordToLocalCache(newWord);
                        }
                    })();
                }
            }

            if (!/^[*]+$/.test(patText)) prependPanelToRow(crimeOption, patText, rowKey);
        }
    }

    /* --------------------------
       Settings UI
       -------------------------- */
    async function showMenuOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); color: #fff;
        display: flex; align-items: center; justify-content: center;
        z-index: 10000; font-size: 14px;
      `;
        const box = document.createElement('div');
        box.style.cssText = `
        background: #111; padding: 20px; border: 1px solid #0f0;
        border-radius: 6px; text-align: center; min-width: 360px;
      `;
        box.innerHTML = `<div style="margin-bottom:12px; font-size:20px; color:#0f0;">Settings</div>`;

        const statusLine = document.createElement('div');
        statusLine.style.cssText = 'color:#0f0; font-size:12px; margin-bottom:8px;';
        statusLine.textContent = ensureStatusBadge().textContent;
        registerStatusSink(statusLine);
        box.appendChild(statusLine);

        const nextSyncDiv = document.createElement('div');
        nextSyncDiv.style.cssText = 'color:#0f0; font-size:12px; margin-bottom:10px;';
        nextSyncDiv.textContent = 'Calculating next sync time…';
        box.appendChild(nextSyncDiv);

        const wordCountDiv = document.createElement('div');
        wordCountDiv.style.cssText = 'color:#0f0; font-size:12px; margin-bottom:6px;';
        wordCountDiv.textContent = 'Loading dictionary stats...';
        box.appendChild(wordCountDiv);

        const outboxTitle = document.createElement('div');
        outboxTitle.style.cssText = 'color:#0f0; font-size:13px; margin-top:8px; margin-bottom:6px;';
        outboxTitle.textContent = 'Collected passwords to send';
        box.appendChild(outboxTitle);

        const outboxList = document.createElement('div');
        outboxList.style.cssText = 'color:#0f0; font-size:12px; text-align:left; max-height:220px; overflow:auto; border:1px solid #0f0; padding:6px; margin-bottom:8px; white-space:pre-wrap;';
        outboxList.textContent = '';
        box.appendChild(outboxList);

        const badgeRow = document.createElement('div');
        badgeRow.style.cssText = 'margin:8px 0; font-size:12px; color:#0f0; display:flex; align-items:center; justify-content:center; gap:8px;';
        const badgeLabel = document.createElement('label');
        badgeLabel.style.cssText = 'cursor:pointer; display:flex; align-items:center; gap:6px;';
        const badgeChk = document.createElement('input');
        badgeChk.type = 'checkbox';
        badgeChk.checked = getBoolPref(STATUS_PREF_KEY, true);
        badgeChk.onchange = () => {
            const show = badgeChk.checked;
            setBoolPref(STATUS_PREF_KEY, show);
            ensureStatusBadge().style.display = show ? 'block' : 'none';
        };
        const badgeText = document.createElement('span'); badgeText.textContent = 'Show status badge';
        badgeLabel.appendChild(badgeChk); badgeLabel.appendChild(badgeText);
        badgeRow.appendChild(badgeLabel);
        box.appendChild(badgeRow);

        const btnCache = document.createElement('button');
        btnCache.textContent = 'Clear Wordlist Cache';
        btnCache.style.cssText = 'margin:4px; padding:6px 10px; background:#a00; color:#fff; cursor:pointer; border-radius:4px;';
        btnCache.onclick = async () => { await clearLocalDictCache(); location.reload(); };
        box.appendChild(btnCache);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Close';
        cancelBtn.style.cssText = 'margin:4px; padding:6px 10px; background:#222; color:#fff; cursor:pointer; border-radius:4px;';
        cancelBtn.onclick = () => {
            unregisterStatusSink(statusLine);
            if (ticker) clearInterval(ticker);
            if (statsTimer) clearInterval(statsTimer);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        };
        box.appendChild(cancelBtn);

        const line = document.createElement('hr');
        line.style.cssText = 'border:none; border-top:1px solid #0f0; margin:10px 0;';
        box.appendChild(line);

        const pwrdByMsg = document.createElement('div');
        pwrdByMsg.style.cssText = 'color:#0f0; font-size:12px; margin-bottom:10px;';
        pwrdByMsg.textContent = 'Powered by Supabase / IndexedDB - Made with Love ❤ by SirAua [3785905] (and friends)';
        box.appendChild(pwrdByMsg);

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        let stats = [];
        (async () => {
            for (let len = MIN_LENGTH; len <= MAX_LENGTH; len++) {
                const chunk = await idbGet(`len_${len}`);
                stats.push(`${len}: ${chunk ? chunk.length : 0}`);
            }
            const remoteCount = await idbGet('sb_remote_count');
            const delta = await idbGet('sb_pending_delta');
            wordCountDiv.textContent =
                `Stored per length → ${stats.join(' | ')}  |  Remote cracked: ${remoteCount ?? 'n/a'}${delta ? ` ( +${delta} pending )` : ''}`;

            const out = await idbGet('sb_outbox') || [];
            if (out.length === 0) outboxList.textContent = '(empty)';
            else outboxList.textContent = out.join(' ; ');
        })();

        let ticker = null;
        let statsTimer = null;

        const updateNextSync = async () => {
            const lastSyncTs = Number(await idbGet('sb_last_sync_ts')) || 0;
            const nextAllowed = lastSyncTs + SYNC_MIN_INTERVAL_MS;
            const remaining = nextAllowed - Date.now();
            const eligible = remaining <= 0;
            const delta = Number(await idbGet('sb_pending_delta')) || 0;
            nextSyncDiv.textContent = eligible
                ? `Next sync: now${delta ? ` ( +${delta} pending )` : ''}`
                : `Next sync in ${formatShortDuration(remaining)}${delta ? ` ( +${delta} pending )` : ''}`;
        };

        const refreshRemoteStats = async () => {
            const remoteCount = await idbGet('sb_remote_count');
            const delta = await idbGet('sb_pending_delta');
            wordCountDiv.textContent =
                `Stored per length → ${stats.join(' | ')}  |  Remote cracked: ${remoteCount ?? 'n/a'}${delta ? ` ( +${delta} pending )` : ''}`;
        };

        await updateNextSync();
        ticker = setInterval(updateNextSync, 1000);
        statsTimer = setInterval(refreshRemoteStats, 15000);
    }

    function injectMenuButton() {
        if (!location.href.endsWith('cracking')) { cleanupView(); return; }
        if (document.getElementById('__crack_menu_btn')) return;
        const appHeader = document.querySelector('[class^="appHeaderDelimiter"]');
        if (!appHeader) return;
        const btn = document.createElement('button');
        btn.id = '__crack_menu_btn';
        btn.textContent = 'Bruteforce characters to show suggestions! (Click for settings)';
        btn.style.cssText = 'background:#000; color:#0f0; font-size:10px; text-align:left; z-index:9999; cursor:pointer;';
        btn.onclick = showMenuOverlay;
        appHeader.appendChild(btn);
        ensureStatusBadge();
    }

    /* --------------------------
       Init
       -------------------------- */
    (async function init() {
        ensureStatusBadge();
        try { if (sessionStorage.getItem('__crack_base_reload_done') === '1') sessionStorage.removeItem('__crack_base_reload_done'); } catch { }
        setStatus('Initializing…');

        try {
            await loadLZString();
            crackLog('LZString ready:', typeof LZString !== 'undefined');
        } catch (e) {
            crackLog('Failed to load LZString, compression disabled', e);
        }

        loadDict();
        scanCrimePage();
        setInterval(scanCrimePage, UPDATE_INTERVAL);
        setInterval(injectMenuButton, UPDATE_INTERVAL);

        startAutoSyncHeartbeat();
    })();
})();
