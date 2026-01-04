// ==UserScript==
// @name         CB Quick Silence + Image Hash Guard
// @namespace    aravvn.tools
// @version      3.1.5
// @description  Original Quick Silence + image dHash matching (upload refs) and optional audio queue on detection
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://*.chaturbate.com/*
// @match        https://*.testbed.cb.dev/*
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *.supabase.co
// @connect      supabase.co
// @connect      static-pub.highwebmedia.com
// @downloadURL https://update.greasyfork.org/scripts/547110/CB%20Quick%20Silence%20%2B%20Image%20Hash%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/547110/CB%20Quick%20Silence%20%2B%20Image%20Hash%20Guard.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ===================== CONFIG =====================
    const SUPABASE_URL = 'https://gbscowfidfdiaywktqal.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdic2Nvd2ZpZGZkaWF5d2t0cWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDU0MzUsImV4cCI6MjA3MTcyMTQzNX0.BITW_rG0-goeo8VCgl-ZTSWfa8BDYsmT2xhIg-9055g';
    const SUPABASE_TABLE_USERS = 'auto_silence_users';
    const SUPABASE_TABLE_WORDS = 'trigger_words';
    const DEFAULT_POLL_MS = 300_000;

    const FALLBACK_USERS = [];
    const FALLBACK_WORDS = [];

    const CONFIG_DEFAULTS = {
        enableAutoSilence: true,
        enableHighlighting: true,
        showSilenceButtons: true,
        pollMs: DEFAULT_POLL_MS,
    };

    // ===================== CONFIG (Image Hash + Audio) ======================
    const HASH_DEFAULTS = {
        hashEnabled: true,            // turn hash-based detection on/off
        threshold: 10,                // Hamming distance 0..64
        includeMods: false,           // detect in mod/broadcaster messages (no autosilence)
        cooldownMs: 15000,            // per-image URL cooldown

        beepOnMatch: true,
        beepVolume: 0.18,             // gentler default volume (0..1)
        beepOncePerMessage: true,
        beepToneHz: 660,              // soft "ping" tone (A5-ish)
        beepDuration: 0.12,           // seconds
        beepLowpassHz: 1200           // smooth the tone with a lowpass
    };

    const KEY_HASH_REFS = 'qs_img_hash_refs';     // [{id,name,mime,size,hashHex}]
    const KEY_HASH_CFG  = 'qs_img_hash_cfg';      // {...HASH_DEFAULTS}

    // ===================== CONSTANTS / SELECTORS ====================
    const EXCLUDE_CLASSES = ['broadcaster', 'mod'];
    const SEL = {
        rootMessage: 'div[data-testid="chat-message"]',
        usernameContainer: 'div[data-testid="chat-message-username"]',
        username: 'span[data-testid="username"]',
        viewerUsername: '.user_information_header_username, [data-testid="user-information-username"]',
        msgImages: 'img[data-testid="emoticonImg"], img.emoticonImage, picture img',
        msgVideos: 'video',
        msgVideoSources: 'video source'
    };

    // ===================== LOG/UTIL =====================
    const DEBUG = true;
    const log = (...a) => DEBUG && console.log('[QS]', ...a);
    const getCfg = (k) => GM_getValue(k, CONFIG_DEFAULTS[k]);
    const setCfg = (k, v) => GM_setValue(k, v);

    const getHashCfg = () => {
        const cur = GM_getValue(KEY_HASH_CFG, null);
        if (!cur) { GM_setValue(KEY_HASH_CFG, HASH_DEFAULTS); return { ...HASH_DEFAULTS }; }
        return { ...HASH_DEFAULTS, ...cur };
    };
    const setHashCfg = (obj) => { try { GM_setValue(KEY_HASH_CFG, { ...getHashCfg(), ...obj }); } catch(e) { console.warn('[QS] GM_setValue failed:', e); } };

    const getHashRefs = () => GM_getValue(KEY_HASH_REFS, []);
    const setHashRefs = (arr) => GM_setValue(KEY_HASH_REFS, Array.isArray(arr) ? arr : []);

    function toast(msg) {
        const t = document.createElement('div');
        t.className = 'qs_toast';
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 180); }, 1600);
    }
    function stripTs(s) { return String(s || '').replace(/^[\[]\d{2}:\d{2}[]]\s*/, '').trim(); }
    function extractUsernameFromText(text) {
        const t = String(text || '').trim();
        const m = t.match(/([A-Za-z0-9_]+)\s*$/);
        if (m) return m[1];
        const cleaned = t.replace(/^\s*(\[[^\]]*?\]\s*)+/g, '').trim();
        const parts = cleaned.split(/\s+/);
        return parts[parts.length - 1] || '';
    }
    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }
    function waitForSelector(selector, timeout = 5000) {
        return new Promise((resolve) => {
            const found = document.querySelector(selector);
            if (found) return resolve(found);
            const obs = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
        });
    }

    // URLs/Rooms
    function getRoomFromURL() {
        const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
        if (!parts[0]) return '';
        if (parts[0] === 'b') return parts[1] || '';
        if (['p','tags','api','auth','proxy'].includes(parts[0])) return '';
        return parts[0];
    }
    function isBroadcasterView() {
        const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
        return parts[0] === 'b' && !!parts[1];
    }

    // ===================== DOM/CSS =====================
    const style = document.createElement('style');
    style.textContent = `
    .qs_sil_btn{display:inline-block;margin-left:6px;padding:0 6px;font:11px/18px system-ui,sans-serif;border-radius:4px;cursor:pointer;user-select:none;background:#d13b3b;color:#fff;border:0}
    .qs_sil_btn:hover{filter:brightness(1.06)}
    .qs_toast{position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#151515;color:#e9e9ea;border:1px solid #3a3a3d;border-radius:8px;padding:8px 10px;font:12px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.45);opacity:0;transform:translateY(8px);transition:all .2s ease}
    .qs_toast.show{opacity:1;transform:translateY(0)}
    .qs_flagged_user { border-left: 4px solid #f40 !important; background: rgba(255,80,80,0.08) !important; }
    .qs_flagged_word { border-left: 4px solid #f93 !important; background: rgba(255,160,60,0.08) !important; }

    /* Floating Settings Button + Panel */
    #qs_cfg_btn{position:fixed;left:12px;bottom:12px;z-index:2147483647;background:#2b2d31;color:#fff;border:1px solid #3a3a3d;border-radius:999px;padding:8px 10px;font:12px system-ui;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.45)}
    #qs_cfg_btn:hover{filter:brightness(1.08)}
    #qs_cfg_panel{position:fixed;left:16px;bottom:56px;z-index:2147483647;width:min(560px,92vw);max-height:min(78vh,720px);display:none;flex-direction:column;background:#101014cc;border:1px solid #3a3a3d;border-radius:10px;color:#e9e9ea;backdrop-filter:blur(4px);box-shadow:0 10px 28px rgba(0,0,0,.55);overflow:hidden}
    #qs_cfg_panel header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #2a2a2e;font:600 13px system-ui}
    #qs_cfg_panel .qs_body{padding:10px;overflow:auto;font:12px system-ui}
    #qs_cfg_panel .row{display:flex;align-items:center;gap:8px;margin:6px 0;flex-wrap:wrap}
    #qs_cfg_panel label{display:flex;align-items:center;gap:6px}
    #qs_cfg_panel input[type="number"], #qs_cfg_panel input[type="text"], #qs_cfg_panel input[type="range"]{background:#17181c;border:1px solid #2c2e34;border-radius:6px;color:#e9e9ea;padding:4px 6px}
    #qs_cfg_panel button{background:#2a2c31;border:1px solid #3a3a3d;border-radius:6px;color:#e9e9ea;font:12px/24px system-ui;padding:0 10px;cursor:pointer}
    #qs_cfg_panel button:hover{filter:brightness(1.08)}
    #qs_cfg_panel table{width:100%;border-collapse:collapse;margin-top:6px}
    #qs_cfg_panel th,#qs_cfg_panel td{border-bottom:1px solid #2a2a2e;padding:6px 4px;vertical-align:top}
    #qs_cfg_panel .muted{opacity:.7}
  `;
    document.head.appendChild(style);

    // ===================== Supabase helpers =====================
    function gmRequestJSON(method, url, headers = {}, data = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data,
                responseType: 'json',
                onload: (res) => {
                    const status = res.status;
                    const text = res.responseText;
                    if (status >= 200 && status < 300) {
                        try { resolve(JSON.parse(text || 'null')); } catch { resolve(res.response ?? null); }
                    } else reject(new Error(`HTTP ${res.status}: ${text?.slice(0, 200)}`));
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout')),
            });
        });
    }
    const hasSupabase = () => SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20;
    function buildUrl(path, params = {}) {
        const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
        const defaultParams = { select: '*', order: 'updated_at.desc', limit: '10000' };
        url.search = new URLSearchParams({ ...defaultParams, ...params }).toString();
        return url.toString();
    }
    async function sbGet(path, params = {}) {
        const url = buildUrl(path, params);
        return gmRequestJSON('GET', url, {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Accept: 'application/json',
        });
    }

    async function fetchUsers() {
        const rows = await sbGet(SUPABASE_TABLE_USERS, { select: 'username,is_active,updated_at', 'is_active': 'eq.true' });
        return rows.filter(r => r && r.username).map(r => String(r.username).toLowerCase().trim()).filter(Boolean);
    }
    async function fetchWords() {
        const rows = await sbGet(SUPABASE_TABLE_WORDS, { select: 'word,is_active,updated_at', 'is_active': 'eq.true' });
        return rows.filter(r => r && r.word).map(r => String(r.word).toLowerCase().trim()).filter(Boolean);
    }
    async function fetchUsersDetailed() {
        const rows = await sbGet(SUPABASE_TABLE_USERS, { select: '*', order: 'updated_at.desc', limit: '10000', 'is_active': 'eq.true' });
        const norm = (v) => (v == null ? '' : String(v));
        return (rows || []).map(r => ({
            username: norm(r.username).toLowerCase(),
            note: norm(r.note || r.comment || r.description || ''),
            reason: norm(r.reason || ''),
            source: norm(r.source || r.origin || ''),
            is_active: (typeof r.is_active === 'boolean') ? r.is_active : true,
            created_at: r.created_at || r.inserted_at || '',
            updated_at: r.updated_at || r.modified_at || r.changed_at || '',
        })).filter(e => e.username);
    }

    // ===================== State =====================
    let AUTO_SILENCE_USERS = [...FALLBACK_USERS.map(s => s.toLowerCase())];
    let TRIGGER_WORDS = [...FALLBACK_WORDS.map(s => s.toLowerCase())];
    let pollTimer = null;

    function applyNewLists(users, words) {
        let changed = false;
        if (users) { AUTO_SILENCE_USERS = Array.from(new Set([...FALLBACK_USERS.map(s => s.toLowerCase()), ...users])); changed = true; }
        if (words) { TRIGGER_WORDS = Array.from(new Set([...FALLBACK_WORDS.map(s => s.toLowerCase()), ...words])); changed = true; }
        if (changed) rescanExistingForHighlights();
    }

    async function syncFromSupabaseOnce() {
        if (!hasSupabase()) return;
        try {
            const [users, words] = await Promise.all([fetchUsers(), fetchWords()]);
            applyNewLists(users, words);
            GM_setValue('sb_last_ok', Date.now());
        } catch (e) {
            log('Supabase sync failed:', e.message || e);
            const lastOk = GM_getValue('sb_last_ok', 0);
            if (!lastOk) toast('⚠️ Supabase unreachable, using fallback lists');
        }
    }

    function startPolling() {
        if (pollTimer) clearInterval(pollTimer);
        const ms = Math.max(10_000, Number(getCfg('pollMs')) || DEFAULT_POLL_MS);
        pollTimer = setInterval(syncFromSupabaseOnce, ms);
    }

    // LOCAL silence log
    const SILENCE_DB_KEY = 'qs_silenced_users_db';
    function readSilenceDB() {
        const raw = GM_getValue(SILENCE_DB_KEY, {});
        return (raw && typeof raw === 'object') ? raw : {};
    }
    function writeSilenceDB(obj) { GM_setValue(SILENCE_DB_KEY, obj); }
    function upsertSilenced(entry) {
        const db = readSilenceDB();
        const key = String(entry.username || '').toLowerCase();
        if (!key) return;
        const prev = db[key] || {};
        db[key] = {
            username: entry.username,
            firstTs: prev.firstTs || entry.ts,
            ts: entry.ts,
            note: entry.note || prev.note || '',
            mode: entry.mode || prev.mode || 'auto',
            reason: entry.reason || prev.reason || '',
            room: entry.room || prev.room || '',
            count: (prev.count || 0) + 1,
        };
        writeSilenceDB(db);
    }

    // ===================== CB actions / logic =====================
    async function fetchIsPrivileged(viewer, room) {
        const url = `${location.origin}/api/ts/chatmessages/user_info/${encodeURIComponent(viewer)}/?room=${encodeURIComponent(room)}`;
        try {
            const res = await fetch(url, { credentials: 'include', headers: { 'Accept': 'application/json' } });
            const data = await res.json();
            return !!(data?.user?.is_mod || data?.user?.is_broadcaster);
        } catch { return false; }
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function postSilence(username) {
        const room = currentRoom || getRoomFromURL();
        if (!room) return false;

        await sleep(500);

        const url = `${location.origin}/roomsilence/${encodeURIComponent(username)}/${encodeURIComponent(room)}/`;
        const csrf = getCookie('csrftoken') || getCookie('CSRF-TOKEN') || getCookie('XSRF-TOKEN');
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            ...(csrf ? { 'X-CSRFToken': csrf, 'X-CSRF-Token': csrf } : {}),
            'Referer': `${location.origin}/${encodeURIComponent(room)}/`
  };
    const body = 'source=chat';
    const res = await fetch(url, { method: 'POST', credentials: 'include', headers, body, redirect: 'manual' });
    return res.ok;
}


    function getUsernameFromRoot(root) {
        const span = root.querySelector(SEL.username) || root.querySelector(`${SEL.usernameContainer} ${SEL.username}`);
        if (span && span.textContent) return extractUsernameFromText(stripTs(span.textContent));
        const cont = root.querySelector(SEL.usernameContainer);
        return extractUsernameFromText(cont?.textContent || '');
    }

    let running = false;
    let currentRoom = '';
    let isPrivileged = false;
    let viewerNameLc = '';

    function shouldExcludeByClass(nameWrap) {
        return EXCLUDE_CLASSES.some(cls => nameWrap.classList.contains(cls));
    }

    // ===================== AUDIO CUE (soft) =====================
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch { /* ignore */ }
        }
        return audioCtx;
    }
    function playBeep() {
        const cfg = getHashCfg();
        if (!cfg.beepOnMatch) return;
        const ctx = getAudioCtx();
        if (!ctx) return;

        const now = ctx.currentTime;
        const dur = Math.max(0.05, Math.min(1.0, Number(cfg.beepDuration) || 0.12)); // seconds
        const tone = Math.max(200, Math.min(4000, Number(cfg.beepToneHz) || 660));
        const lowpassHz = Math.max(200, Math.min(8000, Number(cfg.beepLowpassHz) || 1200));
        const vol = Math.max(0, Math.min(1, Number(cfg.beepVolume) || 0.18));

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(lowpassHz, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * 0.002), now + dur);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone, now);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur + 0.03);
    }

    // ===================== IMAGE HASHING (dHash) =====================
    function gmFetchArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'arraybuffer',
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        const ct = res.responseHeaders?.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || '';
                        resolve({ buf: res.response, contentType: ct });
                    } else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout')),
            });
        });
    }
    function guessMime(url, hdrCt) {
        const u = (url || '').toLowerCase();
        if (hdrCt) return hdrCt.split(';')[0].trim();
        if (u.includes('.webp')) return 'image/webp';
        if (u.includes('.gif'))  return 'image/gif';
        if (u.includes('.png'))  return 'image/png';
        if (u.includes('.jpg') || u.includes('.jpeg')) return 'image/jpeg';
        return 'image/*';
    }
    async function computeDHashFromBlob(blob, size = 8) {
        const bitmap = await createImageBitmap(blob);
        const w = size + 1, h = size;
        const cnv = ('OffscreenCanvas' in window) ? new OffscreenCanvas(w, h) : document.createElement('canvas');
        cnv.width = w; cnv.height = h;
        const ctx = cnv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0, w, h);
        const img = ctx.getImageData(0, 0, w, h).data;

        const gray = new Array(w * h);
        for (let i = 0, p = 0; i < img.length; i += 4, p++) {
            const r = img[i], g = img[i+1], b = img[i+2];
            gray[p] = (0.299 * r + 0.587 * g + 0.114 * b) | 0;
        }

        let bits = 0n;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < size; x++) {
                const left  = gray[y * w + x];
                const right = gray[y * w + (x + 1)];
                const bit = left > right ? 1n : 0n;
                bits = (bits << 1n) | bit;
            }
        }
        return bits.toString(16).padStart(16, '0');
    }
    function hammingHex(aHex, bHex) {
        const a = BigInt('0x' + aHex);
        const b = BigInt('0x' + bHex);
        let x = a ^ b, cnt = 0;
        while (x) { cnt += Number(x & 1n); x >>= 1n; }
        return cnt;
    }
    function collectImages(root) {
        const urls = new Set();
        root.querySelectorAll(SEL.msgImages).forEach(i => i.src && urls.add(i.src));
        root.querySelectorAll(SEL.msgVideos).forEach(v => v.poster && urls.add(v.poster));
        root.querySelectorAll(SEL.msgVideoSources).forEach(s => s.src && urls.add(s.src));
        return [...urls];
    }

    const processedGlobal = new Map();
    const msgUrlSeen = new WeakMap();
    const isCooldownGlobal = (src, ms) => processedGlobal.has(src) && (Date.now() - processedGlobal.get(src)) < ms;
    const markGlobal = (src) => processedGlobal.set(src, Date.now());
    const msgHasSeen = (root, url) => !!(msgUrlSeen.get(root)?.has(url));
    function msgMarkSeen(root, url) { let s = msgUrlSeen.get(root); if (!s) { s = new Set(); msgUrlSeen.set(root, s); } s.add(url); }

    async function hashUrlToHex(url) {
        const { buf, contentType } = await gmFetchArrayBuffer(url);
        const mime = guessMime(url, contentType);
        const blob = new Blob([buf], { type: mime || 'image/*' });
        return await computeDHashFromBlob(blob, 8);
    }

    async function analyzeImagesForMessage(root) {
        const hashCfg = getHashCfg();
        if (!hashCfg.hashEnabled) return;
        if (!(root instanceof HTMLElement)) return;

        if (root.getAttribute('data-qs-hash-scanned') === '1') return;

        const urls = collectImages(root);
        if (!urls.length) { root.setAttribute('data-qs-hash-scanned', '1'); return; }

        let beepedForThisMessage = false;

        for (const url of urls) {
            if (!/^https?:\/\//i.test(url)) continue;
            if (isCooldownGlobal(url, hashCfg.cooldownMs)) continue;
            if (msgHasSeen(root, url)) continue;

            markGlobal(url);
            msgMarkSeen(root, url);

            try {
                const username = getUsernameFromRoot(root);
                if (!username) continue;

                const usernameLcTmp = username.toLowerCase();
                if (viewerNameLc && usernameLcTmp === viewerNameLc) continue;

                const nameWrap = root.querySelector(SEL.usernameContainer);
                if (!nameWrap) continue;

                const isTargetModOrBroadcaster =
                      nameWrap.classList.contains('mod') || nameWrap.classList.contains('broadcaster');

                if (isTargetModOrBroadcaster && !hashCfg.includeMods) continue;

                const myHash = await hashUrlToHex(url);
                const refs = getHashRefs();
                if (!refs.length) continue;

                let best = { ref: null, dist: Infinity };
                for (const r of refs) {
                    const d = hammingHex(myHash, r.hashHex);
                    if (d < best.dist) best = { ref: r, dist: d };
                }

                const thr = hashCfg.threshold;
                log(`[QS][HASH] @${username} ${myHash} → best=${best.dist} (thr=${thr}) ${best.ref ? `vs ${best.ref.name}` : ''}`);

                if (best.dist <= thr) {
                    if (!beepedForThisMessage || !hashCfg.beepOncePerMessage) {
                        playBeep();
                        beepedForThisMessage = true;
                        root.setAttribute('data-qs-hash-beeped', '1');
                    }

                    if (isPrivileged && getCfg('enableAutoSilence') && !isTargetModOrBroadcaster) {
                        const ok = await postSilence(username);
                        toast(ok ? `🤫 Auto-silenced @${username} (image hash)` : `⚠️ Auto-silence failed @${username}`);
                        root.setAttribute('data-qs-silenced', ok ? '1' : '0');
                        if (ok) {
                            upsertSilenced({ username, note: 'image-hash', mode: 'auto', reason: `hash≤${thr}`, room: currentRoom, ts: Date.now() });
                        }
                    } else if (getCfg('enableHighlighting')) {
                        root.classList.add('qs_flagged_word');
                        root.setAttribute('data-qs-silenced', '0');
                    }
                }
            } catch (e) {
                console.warn('[QS][HASH] analyze error', e);
            }
        }

        root.setAttribute('data-qs-hash-scanned', '1');
    }

    // ===================== QS core (text/users) =====================
    function mountButtonForMessage(root) {
        if (!(root instanceof HTMLElement) || root.dataset.qsBtn === '1') return;
        const nameWrap = root.querySelector(SEL.usernameContainer);
        if (!nameWrap) return;
        const username = getUsernameFromRoot(root);
        if (!username) return;
        const usernameLcTmp = username.toLowerCase();
        const msgText = (root.textContent || '').toLowerCase();

        if (viewerNameLc && usernameLcTmp === viewerNameLc) {
            root.dataset.qsBtn = '1';
            return;
        }

        if (shouldExcludeByClass(nameWrap)) {
            root.dataset.qsBtn = '1';
            return;
        }

        const triggeredByWord = TRIGGER_WORDS.find(word => word && msgText.includes(word));
        const triggeredByUser = AUTO_SILENCE_USERS.includes(usernameLcTmp);

        if (isPrivileged && getCfg('showSilenceButtons')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'qs_sil_btn';
            btn.textContent = 'Silence';
            btn.addEventListener('click', async (ev) => {
                ev.preventDefault(); ev.stopPropagation();
                const ok = await postSilence(username);
                toast(ok ? `🛑 Silenced @${username}` : `⚠️ Forbidden @${username}`);
                root.setAttribute('data-qs-silenced', ok ? '1' : '0');
                if (ok) {
                    upsertSilenced({
                        username,
                        note: 'manual',
                        mode: 'manual',
                        reason: 'manual',
                        room: currentRoom,
                        ts: Date.now(),
                    });
                }
            });
            nameWrap.appendChild(btn);
            root.dataset.qsBtn = '1';
        }

        if ((triggeredByUser || triggeredByWord) && root.getAttribute('data-qs-silenced') !== '1') {
            if (isPrivileged && getCfg('enableAutoSilence')) {
                postSilence(username).then(ok => {
                    toast(ok
                          ? `🤫 Auto-silenced @${username}${triggeredByWord ? ` for "${triggeredByWord}"` : ''}`
            : `⚠️ Auto-silence failed @${username}`);
            if (ok || getCfg('enableHighlighting')) playBeep(); // soft cue
            root.setAttribute('data-qs-silenced', ok ? '1' : '0');
            if (ok) {
                const note = triggeredByUser ? 'listed user' : (triggeredByWord ? `trigger: "${triggeredByWord}"` : 'auto');
                upsertSilenced({ username, note, mode: 'auto', reason: triggeredByWord || (triggeredByUser ? 'listed user' : ''), room: currentRoom, ts: Date.now() });
            }
        });
      } else if (!isPrivileged && getCfg('enableHighlighting')) {
          if (triggeredByUser) root.classList.add('qs_flagged_user');
          if (triggeredByWord) root.classList.add('qs_flagged_word');
          playBeep();
          root.setAttribute('data-qs-silenced', '0');
      }
    }

      analyzeImagesForMessage(root);
  }

    function scanExisting() {
        document.querySelectorAll(SEL.rootMessage).forEach(mountButtonForMessage);
    }
    function rescanExistingForHighlights() {
        if (!getCfg('enableHighlighting')) return;
        document.querySelectorAll(SEL.rootMessage).forEach(root => {
            root.classList.remove('qs_flagged_user','qs_flagged_word');
            root.removeAttribute('data-qs-silenced');
            mountButtonForMessage(root);
        });
    }

    const msgObserver = new MutationObserver((muts) => {
        for (const m of muts) for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.matches?.(SEL.rootMessage)) {
                mountButtonForMessage(node);
            } else {
                node.querySelectorAll?.(SEL.rootMessage).forEach(mountButtonForMessage);
            }
        }
    });

    function stopAll() {
        if (!running) return;
        msgObserver.disconnect();
        document.querySelectorAll('.qs_sil_btn').forEach(btn => btn.remove());
        running = false;
        isPrivileged = false;
    }

    async function startForRoom(room) {
        stopAll();

        const broadcasterMode = isBroadcasterView();

        const viewerEl = await waitForSelector(SEL.viewerUsername, 5000);
        const viewer = viewerEl?.textContent?.trim() || '';
        viewerNameLc = (viewer || '').toLowerCase();

        if (!viewer && !broadcasterMode) return;

        if (broadcasterMode) {
            isPrivileged = true;
        } else {
            isPrivileged = await fetchIsPrivileged(viewer, room);
        }

        log('Room:', room, 'Viewer:', viewer, 'BroadcasterMode:', broadcasterMode, 'isPrivileged:', isPrivileged);
        running = true;

        if (hasSupabase()) {
            await syncFromSupabaseOnce();
            startPolling();
        } else {
            toast('ℹ️ Using local fallback lists (no Supabase config)');
        }

        scanExisting();
        msgObserver.observe(document.body, { childList: true, subtree: true });
    }

    function handleRoomEnter() {
        const room = getRoomFromURL();
        if (!room || room === currentRoom) return;
        currentRoom = room;
        startForRoom(room);
    }

    (() => {
        const _ps = history.pushState, _rs = history.replaceState;
        history.pushState = function (...a) { const r = _ps.apply(this, a); window.dispatchEvent(new Event('locationchange')); return r; };
        history.replaceState = function (...a) { const r = _rs.apply(this, a); window.dispatchEvent(new Event('locationchange')); return r; };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', handleRoomEnter);
    })();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleRoomEnter, { once: true });
    } else {
        handleRoomEnter();
    }

    // ===================== DB Overlay =====================
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    }
    function fmtTs(ts) {
        if (!ts) return '';
        try {
            const d = new Date(ts);
            const p = (n)=>String(n).padStart(2,'0');
            return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        } catch { return String(ts); }
    }
    function ensureDbOverlay() {
        let el = document.getElementById('qs_db_overlay');
        if (el) return el;
        el = document.createElement('div');
        el.id = 'qs_db_overlay';
        el.innerHTML = `
      <header>
        <span>DB: Auto-silence users (active)</span>
        <div class="qs_actions">
          <button type="button" data-action="refresh">Refresh</button>
          <button type="button" data-action="export">Export JSON</button>
          <button type="button" data-action="close">Close</button>
        </div>
      </header>
      <div class="qs_body"><div class="qs_empty">Loading…</div></div>
    `;
      el.querySelector('[data-action="close"]').addEventListener('click', () => el.remove());
      el.querySelector('[data-action="export"]').addEventListener('click', async () => {
          const data = await fetchUsersDetailed().catch(()=>[]);
          const pretty = JSON.stringify(data, null, 2);
          const w = window.open('', '_blank', 'noopener,noreferrer,width=700,height=700');
          if (w) {
              w.document.write(`<pre style="white-space:pre-wrap;font:12px/1.4 monospace;padding:12px;margin:0;background:#0e0e10;color:#e9e9ea">${escapeHtml(pretty)}</pre>`);
              w.document.close();
          } else {
              prompt('Copy JSON:', pretty);
          }
      });
      el.querySelector('[data-action="refresh"]').addEventListener('click', () => renderDbOverlay(el, true));
      document.body.appendChild(el);
      return el;
  }
    async function renderDbOverlay(el = ensureDbOverlay(), force = false) {
        const body = el.querySelector('.qs_body');
        body.innerHTML = `<div class="qs_empty">Loading…</div>`;
        try {
            if (!hasSupabase()) { body.innerHTML = `<div class="qs_empty">Supabase config missing.</div>`; return; }
            const rows = await fetchUsersDetailed();
            if (!rows.length) { body.innerHTML = `<div class="qs_empty">No active DB entries.</div>`; return; }
            rows.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
            const html = [
                `<table>`,
                `<thead><tr><th style="width:30%">Username</th><th style="width:36%">Note/Reason</th><th style="width:14%">Source</th><th style="width:20%">Updated</th></tr></thead>`,
                `<tbody>`,
                ...rows.map(r => `
          <tr>
            <td><strong>@${escapeHtml(r.username)}</strong><div class="qs_small">${r.is_active ? 'active' : 'inactive'}</div></td>
            <td>${escapeHtml(r.note || r.reason || '')}</td>
            <td>${escapeHtml(r.source || '')}</td>
            <td><span title="created: ${escapeHtml(fmtTs(r.created_at))}">${escapeHtml(fmtTs(r.updated_at))}</span></td>
          </tr>
        `),
          `</tbody></table>`
      ].join('');
        body.innerHTML = html;
    } catch (e) {
        body.innerHTML = `<div class="qs_empty">Error loading DB list: ${escapeHtml(e.message||String(e))}</div>`;
    }
  }
    function openDbOverlay() {
        const el = ensureDbOverlay();
        renderDbOverlay(el, true);
    }

    // ===================== Floating Settings Window =====================
    function ensureSettingsUI() {
        if (document.getElementById('qs_cfg_btn')) return;

        const btn = document.createElement('button');
        btn.id = 'qs_cfg_btn';
        btn.textContent = 'QS ⚙️';
        btn.title = 'Quick Silence Settings';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'qs_cfg_panel';
        panel.innerHTML = `
      <header>
        <span>Quick Silence Settings</span>
        <div>
          <button type="button" data-action="close">Close</button>
        </div>
      </header>
      <div class="qs_body">
        <div class="row"><strong class="muted">Core</strong></div>
        <div class="row">
          <label><input type="checkbox" data-k="enableAutoSilence"> Auto Silence</label>
          <label><input type="checkbox" data-k="enableHighlighting"> Highlight Matches</label>
          <label><input type="checkbox" data-k="showSilenceButtons"> Show Silence Buttons (mods)</label>
        </div>
        <div class="row">
          <label>Poll interval (sec) <input type="number" min="10" step="1" style="width:80px" data-k="pollSec"></label>
          <button type="button" data-action="sync">Sync now (Supabase)</button>
          <button type="button" data-action="db">Show DB list</button>
        </div>

        <hr style="border:none;border-top:1px solid #2a2a2e;margin:8px 0">

        <div class="row"><strong>Image Hash Guard</strong> <span class="muted">(dHash 64-bit)</span></div>
        <div class="row">
          <label><input type="checkbox" data-hk="hashEnabled"> Enable image-hash detection</label>
          <label>Threshold (0..64) <input type="number" min="0" max="64" step="1" style="width:80px" data-hk="threshold"></label>
          <label><input type="checkbox" data-hk="includeMods"> Detect in mod/broadcaster messages</label>
        </div>
        <div class="row">
          <button type="button" data-action="addRefs">Add reference images…</button>
          <button type="button" data-action="clearRefs">Clear references</button>
        </div>
        <div class="row">
          <table>
            <thead><tr><th style="width:46%">Name</th><th style="width:36%">Hash</th><th>Actions</th></tr></thead>
            <tbody id="qs_refs_tbody"><tr><td colspan="3" class="muted">No references yet.</td></tr></tbody>
          </table>
        </div>

        <hr style="border:none;border-top:1px solid #2a2a2e;margin:8px 0">

        <div class="row"><strong>Audio (soft)</strong></div>
        <div class="row">
          <label><input type="checkbox" data-hk="beepOnMatch"> Beep on match</label>
          <label>Volume <input type="range" min="0" max="1" step="0.01" style="width:150px" data-hk="beepVolume"></label>
          <label>Tone (Hz) <input type="number" min="200" max="4000" step="10" style="width:90px" data-hk="beepToneHz"></label>
          <label>Duration (s) <input type="number" min="0.05" max="1" step="0.01" style="width:80px" data-hk="beepDuration"></label>
          <label>Lowpass (Hz) <input type="number" min="200" max="8000" step="50" style="width:90px" data-hk="beepLowpassHz"></label>
          <label><input type="checkbox" data-hk="beepOncePerMessage"> Once per message</label>
          <button type="button" data-action="testBeep">Test</button>
        </div>

      </div>
    `;
      document.body.appendChild(panel);

      function refreshPanelValues() {
          const pollSec = Math.max(10, ((Number(getCfg('pollMs')) || DEFAULT_POLL_MS) / 1000) | 0);
          panel.querySelector('[data-k="enableAutoSilence"]').checked = !!getCfg('enableAutoSilence');
          panel.querySelector('[data-k="enableHighlighting"]').checked = !!getCfg('enableHighlighting');
          panel.querySelector('[data-k="showSilenceButtons"]').checked = !!getCfg('showSilenceButtons');
          panel.querySelector('[data-k="pollSec"]').value = String(pollSec);

          const hc = getHashCfg();
          panel.querySelector('[data-hk="hashEnabled"]').checked = !!hc.hashEnabled;
          panel.querySelector('[data-hk="threshold"]').value = String(hc.threshold);
          panel.querySelector('[data-hk="includeMods"]').checked = !!hc.includeMods;

          panel.querySelector('[data-hk="beepOnMatch"]').checked = !!hc.beepOnMatch;
          panel.querySelector('[data-hk="beepVolume"]').value = String(Math.max(0, Math.min(1, hc.beepVolume)));
          panel.querySelector('[data-hk="beepOncePerMessage"]').checked = !!hc.beepOncePerMessage;
          panel.querySelector('[data-hk="beepToneHz"]').value = String(hc.beepToneHz);
          panel.querySelector('[data-hk="beepDuration"]').value = String(hc.beepDuration);
          panel.querySelector('[data-hk="beepLowpassHz"]').value = String(hc.beepLowpassHz);

          renderRefsTable();
      }

      function renderRefsTable() {
          const tbody = panel.querySelector('#qs_refs_tbody');
          const refs = getHashRefs();
          if (!refs.length) { tbody.innerHTML = `<tr><td colspan="3" class="muted">No references yet.</td></tr>`; return; }
          tbody.innerHTML = refs.map(r => `
        <tr data-id="${r.id}">
          <td>${escapeHtml(r.name || '(unnamed)')}</td>
          <td><code>${escapeHtml(r.hashHex)}</code></td>
          <td><button type="button" data-action="delRef" data-id="${r.id}">Delete</button></td>
        </tr>
      `).join('');
    }

      btn.addEventListener('click', () => {
          if (panel.style.display === 'flex') { panel.style.display = 'none'; return; }
          refreshPanelValues();
          panel.style.display = 'flex';
          try { getAudioCtx()?.resume?.(); } catch {}
      });
      panel.querySelector('[data-action="close"]').addEventListener('click', () => { panel.style.display = 'none'; });

      panel.querySelector('[data-k="enableAutoSilence"]').addEventListener('change', (e) => setCfg('enableAutoSilence', !!e.target.checked));
      panel.querySelector('[data-k="enableHighlighting"]').addEventListener('change', (e) => { setCfg('enableHighlighting', !!e.target.checked); rescanExistingForHighlights(); });
      panel.querySelector('[data-k="showSilenceButtons"]').addEventListener('change', (e) => setCfg('showSilenceButtons', !!e.target.checked));
      panel.querySelector('[data-k="pollSec"]').addEventListener('change', (e) => {
          const sec = Math.max(10, Number(e.target.value) || (DEFAULT_POLL_MS/1000));
          setCfg('pollMs', sec * 1000);
          startPolling();
          toast(`⏱️ Polling every ${sec}s`);
      });
      panel.querySelector('[data-action="sync"]').addEventListener('click', async () => { await syncFromSupabaseOnce(); toast('Supabase synced'); });
      panel.querySelector('[data-action="db"]').addEventListener('click', () => openDbOverlay());

      panel.querySelector('[data-hk="hashEnabled"]').addEventListener('change', (e) => setHashCfg({ hashEnabled: !!e.target.checked }));
      panel.querySelector('[data-hk="threshold"]').addEventListener('change', (e) => {
          const n = Math.max(0, Math.min(64, Number(e.target.value) || HASH_DEFAULTS.threshold));
          setHashCfg({ threshold: n });
          e.target.value = String(n);
      });
      panel.querySelector('[data-hk="includeMods"]').addEventListener('change', (e) => setHashCfg({ includeMods: !!e.target.checked }));

      panel.querySelector('[data-hk="beepOnMatch"]').addEventListener('change', (e) => setHashCfg({ beepOnMatch: !!e.target.checked }));
      panel.querySelector('[data-hk="beepVolume"]').addEventListener('input', (e) => setHashCfg({ beepVolume: Math.max(0, Math.min(1, Number(e.target.value))) }));
      panel.querySelector('[data-hk="beepOncePerMessage"]').addEventListener('change', (e) => setHashCfg({ beepOncePerMessage: !!e.target.checked }));
      panel.querySelector('[data-hk="beepToneHz"]').addEventListener('change', (e) => setHashCfg({ beepToneHz: Number(e.target.value) || HASH_DEFAULTS.beepToneHz }));
      panel.querySelector('[data-hk="beepDuration"]').addEventListener('change', (e) => setHashCfg({ beepDuration: Number(e.target.value) || HASH_DEFAULTS.beepDuration }));
      panel.querySelector('[data-hk="beepLowpassHz"]').addEventListener('change', (e) => setHashCfg({ beepLowpassHz: Number(e.target.value) || HASH_DEFAULTS.beepLowpassHz }));
      panel.querySelector('[data-action="testBeep"]').addEventListener('click', () => { try { getAudioCtx()?.resume?.(); } catch {}; playBeep(); });

      panel.addEventListener('click', (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;
          const act = t.getAttribute('data-action');

          if (act === 'addRefs') {
              const input = document.createElement('input');
              input.type = 'file'; input.multiple = true; input.accept = 'image/*'; input.style.display = 'none';
              document.body.appendChild(input);
              input.addEventListener('change', async () => {
                  const files = Array.from(input.files || []);
                  input.remove();
                  if (!files.length) return;
                  const refs = getHashRefs();
                  for (const f of files) {
                      try {
                          const buf = await f.arrayBuffer();
                          const blob = new Blob([buf], { type: f.type || 'image/*' });
                          const hashHex = await computeDHashFromBlob(blob, 8);
                          refs.push({ id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`, name: f.name, mime: f.type, size: f.size, hashHex });
                          log('[QS][HASH] added', f.name, hashHex);
                      } catch (err) {
                          console.warn('[QS][HASH] failed to hash', f.name, err);
                      }
                  }
                  setHashRefs(refs);
                  renderRefsTable();
              }, { once: true });
              input.click();
          }

          if (act === 'clearRefs') {
              if (!confirm('Remove all stored reference hashes?')) return;
              setHashRefs([]);
              renderRefsTable();
          }

          if (act === 'delRef') {
              const id = t.getAttribute('data-id');
              if (!id) return;
              const refs = getHashRefs().filter(r => r.id !== id);
              setHashRefs(refs);
              renderRefsTable();
          }
      });

      try { GM_registerMenuCommand?.('Open Quick Silence Settings', () => { refreshPanelValues(); panel.style.display = 'flex'; try { getAudioCtx()?.resume?.(); } catch {}; }); } catch {}
  }
    ensureSettingsUI();

})();