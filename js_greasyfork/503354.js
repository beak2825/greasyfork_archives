// ==UserScript==
// @name         Twitter Media Downloader
// @version      2.2
// @namespace    http://tampermonkey.net/
// @description  Download images and videos from Twitter/X posts and pack them into a ZIP archive with metadata.
// @author       Dramorian
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_registerMenuCommand
// @resource     TMD_CSS https://gist.githubusercontent.com/Dramorian/fb73c37d112773176973252417fa8daa/raw/36ab45324efebafa062f9ef873bb9d2d379eb530/tmd.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503354/Twitter%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/503354/Twitter%20Media%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    //  Central configuration
    // =========================

    const CONFIG = {
        api: {
            url: 'https://x.com/i/api/graphql/zAz9764BcLZOJ0JU2wrd1A/TweetResultByRestId',
            bearerToken: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            retries: 3,
            retryDelayMs: 600,
        },
        storage: {
            keys: {
                zipTemplate: 'tmd_zip_template',
                mediaTemplate: 'tmd_media_template',
                concurrency: 'tmd_concurrency',
                processed: 'processedTweets',
                // Key used to store an array of download history entries in localStorage
                history: 'tmd_history',
            },
            // Maximum number of processed tweet IDs to keep
            maxProcessed: 2000,
            // Maximum number of history entries to retain
            maxHistory: 500,
        },
        defaults: {
            zipTemplate: '{author}_{tweetId}',
            mediaTemplate: '{author}_{tweetId}_{index}.{ext}',
            // Default concurrency for downloads
            concurrency: 3,
            // Upper limit for allowed concurrency
            maxConcurrency: 6,
        },
        ui: {
            btnClass: 'download-media-btn',
            toastHostId: 'tmd_toast_host',
            modalId: 'tmd_settings_modal',
            observerDebounceMs: 120,

            observerMaxPending: 600,
            maxTemplateLength: 220,
        },
    };

    // =========================
    //  CSS Injector
    // =========================

    const injectExternalCss = () => {
        try {
            const css = GM_getResourceText('TMD_CSS');
            if (!css) {
                console.warn('[TMD] CSS resource is empty');
                return;
            }
            GM_addStyle(css);
        } catch (err) {
            console.error('[TMD] Failed to inject CSS resource', err);
        }
    };



    // =========================
    //  Runtime helpers
    // =========================

    /**
     * Deep-freeze a plain object so configuration can't be mutated at runtime.
     * @template T
     * @param {T} obj
     * @returns {T}
     */
    const deepFreeze = (obj) => {
        if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
        Object.freeze(obj);
        for (const v of Object.values(obj)) deepFreeze(v);
        return obj;
    };

    deepFreeze(CONFIG);

    // Single abort controller for the entire script lifetime.
    const RUNTIME_ABORT = new AbortController();

    /**
     * Combine multiple AbortSignals into one.
     * Uses AbortSignal.any when available, with a small fallback for older engines.
     * @param {Array<AbortSignal | undefined | null>} signals
     * @returns {AbortSignal | undefined}
     */
    const anySignal = (signals) => {
        const list = signals.filter(Boolean);
        if (list.length === 0) return undefined;
        if (list.length === 1) return list[0];

        if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
            return AbortSignal.any( /** @type {AbortSignal[]} */(list));
        }

        const c = new AbortController();
        const onAbort = () => c.abort();
        for (const s of list) s.addEventListener('abort', onAbort, {
            once: true
        });
        return c.signal;
    };


    // =========================
    //  Small utilities
    // =========================

    /** @param {unknown} obj @param {string} path @param {any} fallback */
    const getSafeValue = (obj, path, fallback = null) => {
        try {
            return path
                .split('.')
                .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), /** @type {any} */(obj)) ?? fallback;
        } catch {
            return fallback;
        }
    };

    /** @param {string} name */
    const getCookieValue = (name) => document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

    /** @param {number} n @param {number} min @param {number} max */
    const clampNumber = (n, min, max) => Math.max(min, Math.min(max, n));

    /** @param {number} ms */
    const sleepMs = (ms, signal) =>
        new Promise((resolve, reject) => {
            const t = window.setTimeout(resolve, ms);
            if (!signal) return;
            if (signal.aborted) {
                clearTimeout(t);
                reject(new DOMException('Aborted', 'AbortError'));
                return;
            }
            signal.addEventListener(
                'abort',
                () => {
                    clearTimeout(t);
                    reject(new DOMException('Aborted', 'AbortError'));
                }, {
                once: true
            },
            );
        });

    /** @param {string} s */
    const safeDecodeURIComponent = (s) => {
        try {
            return decodeURIComponent(s);
        } catch {
            return s;
        }
    };

    class HttpError extends Error {
        /** @param {number} status @param {string} message @param {string} bodyText */
        constructor(status, message, bodyText = '') {
            super(message);
            this.name = 'HttpError';
            /** @type {number} */
            this.status = status;
            /** @type {string} */
            this.bodyText = bodyText;
        }
    }

    /** @param {any} err */
    const isRetryableError = (err) => {
        if (!err) return false;
        if (err.name === 'AbortError') return false;

        const status = Number(err.status ?? err?.res?.status ?? err?.response?.status ?? NaN);
        if (Number.isFinite(status)) {
            return [429, 500, 502, 503, 504].includes(status);
        }

        // Fetch network failures generally surface as TypeError("Failed to fetch") in browsers.
        if (err instanceof TypeError) return true;

        const msg = String(err?.message || err);
        return /failed to fetch|networkerror|network error|timeout|temporarily unavailable/i.test(msg);
    };

    /**
     * Retry helper with exponential backoff + jitter.
     * Only retries errors that `isRetryableError()` considers transient.
     *
     * @template T
     * @param {() => Promise<T>} fn
     * @param {{retries?: number, delayMs?: number, signal?: AbortSignal}} [options]
     * @returns {Promise<T>}
     */
    const withRetry = async (fn, options = {}) => {
        const {
            retries = 2, delayMs = 500, signal
        } = options;

        /** @type {any} */
        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            try {
                return await fn();
            } catch (e) {
                lastError = e;

                if (!isRetryableError(e) || attempt >= retries) break;

                const backoff = delayMs * (2 ** attempt);
                const jitter = Math.random() * Math.min(250, backoff * 0.2);
                await sleepMs(backoff + jitter, signal);
            }
        }

        throw lastError;
    };


    /**
     * Security: prevent path traversal / zip-slip via `..` components.
     * @param {unknown} value
     * @param {number} maxLen
     */
    const sanitizeFileComponent = (value, maxLen = 80) => {
        // Decode encoded traversal like %2e%2e%2f and normalize before sanitizing.
        let v = String(value ?? '').trim();

        // Decode percent-encoded sequences a couple of times (handles double-encoding).
        for (let i = 0; i < 2; i++) v = safeDecodeURIComponent(v);

        // Strip separators/control chars and illegal filename chars.
        v = v
            .replace(/[\\/]+/g, '_')
            .replace(/[\u0000-\u001F\u007F<>:"|?*]+/g, '_')
            .replace(/\s+/g, ' ')
            .trim();

        // Remove dot-segments and dot-only names.
        // After separator normalization, dot segments are only dangerous if they survive as standalone components.
        v = v.replace(/(^|[_\s.-])\.(?=[_\s.-]|$)/g, '$1_');
        v = v.replace(/(^|[_\s.-])\.\.(?=[_\s.-]|$)/g, '$1_');

        // Defensive: collapse any remaining ".." runs and strip leading/trailing dots.
        v = v.replace(/\.{2,}/g, '_').replace(/^\.+/g, '_').replace(/\.+$/g, '_');

        // Keep it reasonably small and never empty.
        v = v.replace(/_+/g, '_').trim();
        if (!v) v = '_';

        // Final guard: no separators after decoding/sanitizing.
        v = v.replace(/[\\/]/g, '_');

        return v.length > maxLen ? v.slice(0, maxLen).trim() : v;
    };
    /** @param {string} template @param {Record<string, unknown>} vars */
    const renderTemplate = (template, vars) => {
        const tpl = String(template ?? '');
        return tpl.replace(/\{(\w+)\}/g, (_, key) => {
            const v = vars[key];
            return v === undefined || v === null ? '' : String(v);
        });
    };

    /** @param {string} createdAt */
    const parseTwitterDate = (createdAt) => {
        // Example: "Mon Dec 22 19:38:26 +0000 2025"
        const d = new Date(createdAt);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    /** @param {number} n */
    const pad2 = (n) => String(n).padStart(2, '0');

    /** @param {Date | null} d */
    const formatDateYYYYMMDD = (d) => (d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : '');

    /** @param {Date | null} d */
    const formatTimeHHMMSS = (d) => (d ? `${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}` : '');

    /** @param {string} url @param {string} fallback */
    const inferExtFromUrl = (url, fallback = 'bin') => {
        try {
            const pathname = new URL(url).pathname;
            const m = pathname.match(/\.([a-z0-9]+)$/i);
            return (m?.[1] || fallback).toLowerCase();
        } catch {
            return fallback;
        }
    };

    /** @param {string} html */
    const decodeHtml = (html) => {
        if (!html) return '';
        const el = document.createElement('textarea');
        el.innerHTML = html;
        return el.value;
    };

    /** @param {unknown} html */
    const stripHtml = (html) => decodeHtml(String(html).replace(/<[^>]*>/g, ''));

    // =========================
    //  Settings store
    // =========================

    const storage_load = (key, fallback) => {
        const v = localStorage.getItem(key);
        if (v === null || v === undefined || v === '') return fallback;

        // Basic hardening against gigantic / control-char payloads.
        const s = String(v);
        if (s.length > 5000) return fallback;
        return s.replace(/[\u0000-\u001F\u007F]/g, '').trim();
    };

    /** @param {string} value */
    const sanitizeTemplateString = (value) => {
        let v = String(value ?? '').trim();
        for (let i = 0; i < 2; i++) v = safeDecodeURIComponent(v);

        // Disallow anything that could become a path segment or HTML injection if ever echoed.
        v = v
            .replace(/[\\/]+/g, '_')
            .replace(/[\u0000-\u001F\u007F<>`"']/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const maxLen = CONFIG.ui.maxTemplateLength || 220;
        return v.length > maxLen ? v.slice(0, maxLen).trim() : v;
    };

    const storage_loadTemplate = (key, fallback) => {
        const v = storage_load(key, String(fallback));
        const s = sanitizeTemplateString(v);
        return s || String(fallback);
    };

    const storage_loadNumber = (key, fallback) => {
        const raw = storage_load(key, String(fallback));
        const n = Number(raw);
        return Number.isFinite(n) ? n : fallback;
    };

    /** @param {string} key @param {unknown} value */
    const storage_save = (key, value) => {
        localStorage.setItem(key, String(value));
    };

    // =========================
    //  Download history management
    // =========================

    /**
     * Append a new record to the download history stored in localStorage. The
     * history is capped by CONFIG.storage.maxHistory and stores simple
     * information about each successful download.
     *
     * @param {{ tweetId: string, tweetLink: string, date: string, files: string[] | null, zip: string }} entry
     */
    const history_addEntry = (entry) => {
        try {
            const raw = localStorage.getItem(CONFIG.storage.keys.history);
            let arr = [];
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) arr = parsed;
                } catch { }
            }
            arr.push(entry);
            const max = CONFIG.storage.maxHistory || 500;
            if (arr.length > max) arr = arr.slice(-max);
            localStorage.setItem(CONFIG.storage.keys.history, JSON.stringify(arr));
        } catch (e) {
            console.error('Failed to save download history', e);
        }
    };

    /**
     * Export the download history as a Markdown file. The history is read
     * from localStorage and a simple table is generated with columns for
     * the entry index, tweet ID, date, file(s) and original link. If no
     * history exists, an informational toast is shown instead. When a
     * history file is saved, a success toast is displayed.
     */
    const history_export = () => {
        try {
            const raw = localStorage.getItem(CONFIG.storage.keys.history);
            let arr = [];
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) arr = parsed;
                } catch { }
            }
            if (!arr || arr.length === 0) {
                toast_show({
                    title: 'Download history',
                    message: 'No download history found.',
                    type: 'info',
                    timeoutMs: 4000,
                });
                return;
            }
            const lines = [];
            lines.push('| # | Tweet ID | Date | Files | Link |');
            lines.push('|---|---------|------|-------|------|');
            arr.forEach((entry, idx) => {
                const i = idx + 1;
                const id = entry?.tweetId ?? '';
                const date = entry?.date ?? '';
                const files = Array.isArray(entry?.files) ? entry.files.join(', ') : (entry?.zip || '');
                const link = entry?.tweetLink ?? '';
                // Escape vertical bars in table cells
                const esc = (str) => String(str).replace(/\|/g, '\\|');
                lines.push(`| ${i} | ${esc(id)} | ${esc(date)} | ${esc(files)} | ${esc(link)} |`);
            });
            const md = lines.join('\n');
            const blob = new Blob([md], { type: 'text/markdown' });
            const now = new Date();
            const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            saveAs(blob, `twitter_media_history_${ts}.md`);
            toast_show({
                title: 'History exported',
                message: 'Download history exported as Markdown.',
                type: 'success',
                timeoutMs: 5000,
            });
        } catch (e) {
            console.error('Failed to export history', e);
            toast_show({
                title: 'Export failed',
                message: String(e?.message || e || 'Unknown error'),
                type: 'error',
                persistent: true,
            });
        }
    };

    /**
     * Export the download history as a JSON file. This reads the history
     * array from localStorage, serializes it to a pretty-printed JSON
     * document and prompts the user to save the file. If no history is
     * available, a toast notification is shown instead.
     */
    const history_export_json = () => {
        try {
            const raw = localStorage.getItem(CONFIG.storage.keys.history);
            let arr = [];
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) arr = parsed;
                } catch { }
            }
            if (!arr || arr.length === 0) {
                toast_show({
                    title: 'Download history',
                    message: 'No download history found.',
                    type: 'info',
                    timeoutMs: 4000,
                });
                return;
            }
            const json = JSON.stringify(arr, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const now = new Date();
            const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            saveAs(blob, `twitter_media_history_${ts}.json`);
            toast_show({
                title: 'History exported',
                message: 'Download history exported as JSON.',
                type: 'success',
                timeoutMs: 5000,
            });
        } catch (e) {
            console.error('Failed to export history as JSON', e);
            toast_show({
                title: 'Export failed',
                message: String(e?.message || e || 'Unknown error'),
                type: 'error',
                persistent: true,
            });
        }
    };

    /**
     * Import a JSON file containing download history entries. The user is
     * presented with a file picker; after selection, the JSON is parsed
     * and each entry is added to the history (if not already present) and
     * marked as processed. This allows users to restore their history
     * across browsers or devices. A summary toast reports how many new
     * entries were imported.
     */
    const history_import = () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.style.display = 'none';
            input.addEventListener('change', async () => {
                const file = input.files?.[0];
                if (!file) {
                    input.remove();
                    return;
                }
                try {
                    const text = await file.text();
                    let entries;
                    try {
                        entries = JSON.parse(text);
                    } catch (ex) {
                        throw new Error('Selected file is not valid JSON');
                    }
                    if (!Array.isArray(entries)) {
                        throw new Error('JSON must represent an array of history entries');
                    }
                    let imported = 0;
                    // Load existing history
                    let historyRaw = localStorage.getItem(CONFIG.storage.keys.history);
                    let historyArr = [];
                    if (historyRaw) {
                        try {
                            const p = JSON.parse(historyRaw);
                            if (Array.isArray(p)) historyArr = p;
                        } catch { }
                    }
                    const existingIds = new Set(historyArr.map((item) => String(item?.tweetId)));
                    const max = CONFIG.storage.maxHistory || 500;
                    for (const entry of entries) {
                        const id = entry?.tweetId;
                        if (!id) continue;
                        const idStr = String(id);
                        // Mark processed using the app cache if available
                        try {
                            if (typeof app !== 'undefined' && app?.cache?.mark) {
                                app.cache.mark(idStr);
                            } else if (typeof processedCache !== 'undefined' && processedCache?.mark) {
                                processedCache.mark(idStr);
                            }
                        } catch { }
                        if (!existingIds.has(idStr)) {
                            existingIds.add(idStr);
                            historyArr.push(entry);
                            imported++;
                        }
                    }
                    // Trim to maximum history size
                    if (historyArr.length > max) {
                        historyArr = historyArr.slice(-max);
                    }
                    localStorage.setItem(CONFIG.storage.keys.history, JSON.stringify(historyArr));
                    toast_show({
                        title: 'Import complete',
                        message: imported ? `Imported ${imported} entr${imported === 1 ? 'y' : 'ies'}` : 'No new entries imported',
                        type: imported ? 'success' : 'info',
                        timeoutMs: 5000,
                    });
                } catch (e) {
                    console.error('Failed to import history', e);
                    toast_show({
                        title: 'Import failed',
                        message: e?.message || 'Failed to import download history',
                        type: 'error',
                        persistent: true,
                    });
                } finally {
                    input.remove();
                }
            });
            document.body.appendChild(input);
            input.click();
        } catch (e) {
            console.error('History import error', e);
            toast_show({
                title: 'Import error',
                message: String(e?.message || e),
                type: 'error',
                persistent: true,
            });
        }
    };

    // =========================
    //  HistoryStore facade
    // =========================
    // Wrap the standalone history functions into a single object. This object
    // exposes the same behaviour via methods on HistoryStore, which makes
    // future refactoring easier and groups related functionality together.
    const HistoryStore = {
        /**
         * Append a history entry (alias for history_addEntry).
         * @param {{ tweetId: string, tweetLink: string, date: string, files: string[] | null, zip: string }} entry
         */
        addEntry: history_addEntry,
        /**
         * Export history as Markdown (alias for history_export).
         */
        exportMarkdown: history_export,
        /**
         * Export history as JSON (alias for history_export_json).
         */
        exportJson: history_export_json,
        /**
         * Import history from a JSON file (alias for history_import).
         */
        import: history_import,
    };

    // =========================
    //  Toast / Progress UI
    // =========================



    const toast_getOrCreateHost = () => {
        let host = document.getElementById(CONFIG.ui.toastHostId);
        if (!host) {
            host = document.createElement('div');
            host.id = CONFIG.ui.toastHostId;
            document.body.appendChild(host);
        }
        return host;
    };

    /**
     * @param {{
     *   id?: string,
     *   title?: string,
     *   message?: string,
     *   progress?: number | 'indeterminate' | null,
     *   metaLeft?: string,
     *   metaRight?: string,
     *   type?: 'info'|'success'|'error',
     *   persistent?: boolean,
     *   timeoutMs?: number
     * }} opts
     */
    const toast_show = (opts) => {
        const {
            id,
            title,
            message,
            progress = null,
            metaLeft = '',
            metaRight = '',
            type = 'info',
            persistent = false,
            timeoutMs = 4500
        } = opts;
        const host = toast_getOrCreateHost();
        const toastId = id || `tmd_${Math.random().toString(16).slice(2)}`;

        let el = document.getElementById(toastId);
        if (!el) {
            el = document.createElement('div');
            el.id = toastId;
            el.className = 'tmd-toast';
            el.innerHTML = `
        <div class="tmd-toast__row">
          <div class="tmd-toast__title"></div>
          <div class="tmd-toast__btns">
            <button class="tmd-toast__iconbtn" data-action="close" title="Close">✕</button>
          </div>
        </div>
        <div class="tmd-toast__msg"></div>
        <div class="tmd-toast__bar" style="display:none"><div></div></div>
        <div class="tmd-toast__meta" style="display:none">
          <span class="tmd-toast__meta-left"></span>
          <span class="tmd-toast__meta-right"></span>
        </div>
      `;
            host.appendChild(el);
        }

        const titleEl = el.querySelector('.tmd-toast__title');
        const msgEl = el.querySelector('.tmd-toast__msg');
        const bar = el.querySelector('.tmd-toast__bar');
        const barInner = bar.querySelector('div');
        const meta = el.querySelector('.tmd-toast__meta');
        const metaL = el.querySelector('.tmd-toast__meta-left');
        const metaR = el.querySelector('.tmd-toast__meta-right');

        titleEl.textContent = title || 'Twitter Media Downloader';
        msgEl.textContent = message || '';

        // subtle status coloring via border
        el.style.borderColor =
            type === 'error' ?
                'rgba(255, 80, 80, 0.55)' :
                type === 'success' ?
                    'rgba(80, 255, 160, 0.35)' :
                    'rgba(255,255,255,0.12)';

        if (progress === null || progress === undefined) {
            bar.style.display = 'none';
        } else {
            bar.style.display = '';
            if (progress === 'indeterminate') {
                bar.classList.add('tmd-toast__bar--indeterminate');
            } else {
                bar.classList.remove('tmd-toast__bar--indeterminate');
                barInner.style.width = `${clampNumber(progress, 0, 100)}%`;
            }
        }

        if (metaLeft || metaRight) {
            meta.style.display = '';
            metaL.textContent = metaLeft || '';
            metaR.textContent = metaRight || '';
        } else {
            meta.style.display = 'none';
        }

        if (!persistent) {
            if (type === 'success' || type === 'info') {
                setTimeout(() => document.getElementById(toastId)?.remove(), timeoutMs);
            }
        }

        return toastId;
    };



    // =========================
    //  Settings modal
    // =========================

    const settings_ensureModal = () => {
        let modal = document.getElementById(CONFIG.ui.modalId);
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = CONFIG.ui.modalId;
        modal.innerHTML = `
      <div class="tmd-modal" role="dialog" aria-modal="true" aria-label="Downloader Settings">
        <h2>Downloader Settings</h2>

        <div class="tmd-field">
          <label>ZIP name template</label>
          <input type="text" data-field="zip" />
        </div>

        <div class="tmd-field">
          <label>Media filename template</label>
          <input type="text" data-field="media" />
        </div>

        <div class="tmd-field">
          <label data-role="concurrency-label">Download concurrency</label>
          <input type="number" min="1" max="${CONFIG.defaults.maxConcurrency || 6}" step="1" data-field="concurrency" />
        </div>

        <div class="tmd-help">
          Available tokens: <code>{author}</code>, <code>{tweetId}</code>, <code>{date}</code>, <code>{time}</code>,
          <code>{text}</code>, <code>{index}</code>, <code>{ext}</code>, <code>{mediaType}</code>.
          <br/>Tip: keep templates short to avoid very long filenames.
        </div>

        <div class="tmd-actions">
          <button data-action="cancel">Cancel</button>
          <button data-action="save" data-primary="1">Save</button>
        </div>
      </div>
    `;
        document.body.appendChild(modal);

        // Update concurrency label and constraints after insertion.
        const concLabel = modal.querySelector('[data-role="concurrency-label"]');
        if (concLabel) {
            concLabel.textContent = `Download concurrency (1–${CONFIG.defaults.maxConcurrency || 6})`;
        }
        const concInput = modal.querySelector('input[data-field="concurrency"]');
        if (concInput) {
            concInput.setAttribute('max', String(CONFIG.defaults.maxConcurrency || 6));
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) settings_closeModal();
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;

            const act = btn.getAttribute('data-action');
            if (act === 'cancel') settings_closeModal();
            if (act === 'save') {
                const zip = sanitizeTemplateString(modal.querySelector('input[data-field="zip"]').value.trim() || CONFIG.defaults.zipTemplate);
                const media = sanitizeTemplateString(modal.querySelector('input[data-field="media"]').value.trim() || CONFIG.defaults.mediaTemplate);
                const conc = clampNumber(Number(modal.querySelector('input[data-field="concurrency"]').value || CONFIG.defaults.concurrency), 1, CONFIG.defaults.maxConcurrency || 6);

                storage_save(CONFIG.storage.keys.zipTemplate, zip);
                storage_save(CONFIG.storage.keys.mediaTemplate, media);
                storage_save(CONFIG.storage.keys.concurrency, String(conc));

                settings_closeModal();
                toast_show({
                    title: 'Settings saved',
                    message: 'Templates and concurrency were updated.',
                    type: 'success'
                });
            }
        });

        return modal;
    };

    const settings_openModal = () => {
        const modal = settings_ensureModal();
        modal.querySelector('input[data-field="zip"]').value = storage_loadTemplate(CONFIG.storage.keys.zipTemplate, CONFIG.defaults.zipTemplate);
        modal.querySelector('input[data-field="media"]').value = storage_loadTemplate(CONFIG.storage.keys.mediaTemplate, CONFIG.defaults.mediaTemplate);
        modal.querySelector('input[data-field="concurrency"]').value = String(clampNumber(storage_loadNumber(CONFIG.storage.keys.concurrency, CONFIG.defaults.concurrency), 1, CONFIG.defaults.maxConcurrency || 6));
        modal.setAttribute('data-open', '1');
    };

    const settings_closeModal = () => {
        const modal = document.getElementById(CONFIG.ui.modalId);
        if (modal) modal.removeAttribute('data-open');
    };



    // =========================
    //  API Interaction
    // =========================

    const BASE_TWEET_FEATURES = {
        articles_preview_enabled: true,
        c9s_tweet_anatomy_moderator_badge_enabled: true,
        communities_web_enable_tweet_community_results_fetch: false,
        creator_subscriptions_quote_tweet_preview_enabled: false,
        creator_subscriptions_tweet_preview_api_enabled: false,
        freedom_of_speech_not_reach_fetch_enabled: true,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
        longform_notetweets_consumption_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        longform_notetweets_rich_text_read_enabled: true,
        longform_notetweets_richtext_consumption_enabled: true,
        rweb_tipjar_consumption_enabled: true,
        responsive_web_edit_tweet_api_enabled: true,
        responsive_web_enhance_cards_enabled: false,
        responsive_web_graphql_exclude_directive_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        responsive_web_graphql_timeline_navigation_enabled: true,
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        standardized_nudges_misinfo: true,
        tweet_awards_web_tipping_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
        tweetypie_unmention_optimization_enabled: true,
        verified_phone_label_enabled: false,
        view_counts_everywhere_api_enabled: true,
        view_counts_public_visibility_enabled: true,
    };

    /** @param {string} tweetId @param {Record<string, boolean> | null} extraFeatures */
    const api_createTweetUrl = (tweetId, extraFeatures = null) => {
        const variables = {
            tweetId,
            with_rux_injections: false,
            rankingMode: 'Relevance',
            includePromotedContent: true,
            withCommunity: true,
            withQuickPromoteEligibilityTweetFields: true,
            withBirdwatchNotes: true,
            withVoice: true,
        };

        const features = extraFeatures ? {
            ...BASE_TWEET_FEATURES,
            ...extraFeatures
        } : BASE_TWEET_FEATURES;

        const fieldToggles = {
            withArticleRichContentState: false
        };

        return `${CONFIG.api.url}?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;
    };

    const api_createHeaders = () => {
        const csrfToken = getCookieValue('ct0');
        return {
            authorization: `Bearer ${CONFIG.api.bearerToken}`,
            'x-csrf-token': csrfToken,
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session',
            'content-type': 'application/json',
        };
    };

    /** @param {string} bodyText */
    const api_parseMissingFeatureNames = (bodyText) => {
        if (!bodyText) return [];
        try {
            const parsed = JSON.parse(bodyText);
            const msg = parsed?.errors?.[0]?.message;
            if (typeof msg !== 'string') return [];

            // Example: "The following features cannot be null: a, b, c"
            const marker = 'features cannot be null:';
            const idx = msg.toLowerCase().indexOf(marker);
            if (idx === -1) return [];

            const tail = msg.slice(idx + marker.length).trim();
            return tail
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => s.replace(/\s+/g, ' '))
                .map((s) => s.split(' ')[0])
                .filter((s) => /^[a-z0-9_]+$/i.test(s));
        } catch {
            return [];
        }
    };

    /** @param {string} tweetId */
    const api_fetchTweetData = async (tweetId, {
        signal
    } = {}) => {
        const attempt = async (extraFeatures) => {
            const url = api_createTweetUrl(tweetId, extraFeatures);
            const res = await fetch(url, {
                method: 'GET',
                headers: api_createHeaders(),
                credentials: 'include',
                signal
            });
            if (res.ok) return {
                ok: true,
                json: await res.json()
            };

            const bodyText = await res.text().catch(() => '');
            return {
                ok: false,
                res,
                bodyText
            };
        };

        const first = await attempt(null);
        if (first.ok) return first.json;

        // Adaptive fix for X occasionally introducing new required feature flags.
        // Keeps the same endpoint, but ensures required flags aren't treated as null.
        if (first.res?.status === 400) {
            const missing = api_parseMissingFeatureNames(first.bodyText);
            if (missing.length) {
                const extra = Object.fromEntries(missing.map((k) => [k, false]));
                const second = await attempt(extra);
                if (second.ok) return second.json;

                throw new HttpError(second.res.status, `Tweet API error HTTP ${second.res.status}. ${second.bodyText ? second.bodyText.slice(0, 220) : ''}`, second.bodyText || '');
            }
        }

        throw new HttpError(first.res.status, `Tweet API error HTTP ${first.res.status}. ${first.bodyText ? first.bodyText.slice(0, 220) : ''}`, first.bodyText || '');
    };

    // =========================
    //  Tweet parsing + Media normalization
    // =========================

    /**
     * Validate the minimum structure before parsing deeply, to avoid silent failures.
     * @param {any} data
     * @param {string} tweetId
     * @returns {{ok: true} | {ok:false, reason:string}}
     */
    const validateTweetData = (data, tweetId) => {
        if (!data || typeof data !== 'object') return {
            ok: false,
            reason: 'Empty response'
        };
        if (Array.isArray(data?.errors) && data.errors.length) return {
            ok: false,
            reason: `API error: ${data.errors[0]?.message || 'unknown'}`
        };

        const maybe = getSafeValue(data, 'data.tweetResult.result', null) ?? getSafeValue(data, 'data.tweetResult.result.tweet', null);
        if (!maybe) return {
            ok: false,
            reason: 'Missing tweetResult.result'
        };

        const restId = maybe?.rest_id || getSafeValue(maybe, 'legacy.id_str', '');
        if (String(restId) !== String(tweetId)) {
            // Not always fatal (some shapes), but usually indicates mismatch
            // We still allow parsing fallback logic to try other locations.
        }
        return {
            ok: true
        };
    };

    /** @param {any} data @param {string} tweetId */
    const parse_getTweetObjectFromResponse = (data, tweetId) => {
        // Common shape
        const direct = getSafeValue(data, 'data.tweetResult.result');
        if (direct && (direct.rest_id === tweetId || getSafeValue(direct, 'legacy.id_str') === tweetId)) return direct;

        // Some shapes wrap inside result.tweet
        const wrapped = getSafeValue(data, 'data.tweetResult.result.tweet');
        if (wrapped && (wrapped.rest_id === tweetId || getSafeValue(wrapped, 'legacy.id_str') === tweetId)) return wrapped;

        // Timeline shape fallback
        const entries = getSafeValue(data, 'data.threaded_conversation_with_injections_v2.instructions.0.entries', []);
        if (Array.isArray(entries)) {
            const tweetEntry = entries.find((e) => e?.entryId === `tweet-${tweetId}`);
            const tweetResult = getSafeValue(tweetEntry, 'content.itemContent.tweet_results.result');
            const candidate = tweetResult?.tweet || tweetResult;
            if (candidate) return candidate;
        }

        return null;
    };

    /**
     * @typedef {{
     *   url: string,
     *   kind: 'photo'|'video'|'animated_gif',
     *   contentType?: string,
     *   bitrate?: number|null,
     *   ext?: string,
     *   width?: number,
     *   height?: number,
     *   expandedUrl?: string,
     * }} MediaItem
     */

    /** @param {any} tweetObj @returns {MediaItem[]} */
    const media_extractItems = (tweetObj) => {
        if (!tweetObj) return [];

        const media =
            getSafeValue(tweetObj, 'legacy.extended_entities.media', null) ||
            getSafeValue(tweetObj, 'legacy.entities.media', null) ||
            tweetObj.media || [];

        if (!Array.isArray(media) || media.length === 0) return [];

        return media.flatMap((item) => {
            const type = item?.type;

            if (type === 'photo') {
                const baseUrl = item?.media_url_https;
                if (!baseUrl) return [];
                const url = `${baseUrl}?name=orig`;

                const w = getSafeValue(item, 'original_info.width', null);
                const h = getSafeValue(item, 'original_info.height', null);

                return [{
                    url,
                    kind: 'photo',
                    contentType: 'image/jpeg',
                    ext: inferExtFromUrl(baseUrl, 'jpg'),
                    width: Number.isFinite(Number(w)) ? Number(w) : undefined,
                    height: Number.isFinite(Number(h)) ? Number(h) : undefined,
                    expandedUrl: item?.expanded_url,
                },];
            }

            if (type === 'video') return media_extractVideoItem(item);
            if (type === 'animated_gif') return media_extractGifItem(item);

            return [];
        });
    };

    /** @param {any} item @returns {MediaItem[]} */
    const media_extractVideoItem = (item) => {
        const variants = getSafeValue(item, 'video_info.variants', []).filter((v) => v?.content_type === 'video/mp4');
        if (!variants.length) return [];

        const withBitrate = variants.filter((v) => typeof v.bitrate === 'number');
        const best = (withBitrate.length ? withBitrate : variants)
            .slice()
            .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

        if (!best?.url) return [];

        const w = getSafeValue(item, 'original_info.width', null);
        const h = getSafeValue(item, 'original_info.height', null);

        return [{
            url: best.url,
            kind: 'video',
            contentType: best.content_type,
            bitrate: typeof best.bitrate === 'number' ? best.bitrate : null,
            ext: 'mp4',
            width: Number.isFinite(Number(w)) ? Number(w) : undefined,
            height: Number.isFinite(Number(h)) ? Number(h) : undefined,
            expandedUrl: item?.expanded_url,
        },];
    };

    /** @param {any} item @returns {MediaItem[]} */
    const media_extractGifItem = (item) => {
        const v = getSafeValue(item, 'video_info.variants', []).find((x) => x?.content_type === 'video/mp4');
        if (!v?.url) return [];

        const w = getSafeValue(item, 'original_info.width', null);
        const h = getSafeValue(item, 'original_info.height', null);

        return [{
            url: v.url,
            kind: 'animated_gif',
            contentType: v.content_type,
            bitrate: typeof v.bitrate === 'number' ? v.bitrate : null,
            ext: 'mp4',
            width: Number.isFinite(Number(w)) ? Number(w) : undefined,
            height: Number.isFinite(Number(h)) ? Number(h) : undefined,
            expandedUrl: item?.expanded_url,
        },];
    };

    // =========================
    //  Metadata building
    // =========================

    /** @param {HTMLElement} tweetElement */
    const dom_extractTweetInfo = (tweetElement) => {
        const tweetLinkElement = tweetElement.querySelector('a[href*="/status/"]');
        if (!tweetLinkElement) return null;

        const tweetLink = tweetLinkElement.href;
        const tweetId = tweetLink.split('/status/')[1]?.split(/[/?]/)[0];
        if (!tweetId) return null;

        // Prefer handle from DOM, but API can override for correctness
        const authorHandle = tweetLink.split('/status/')[0].split('/').pop() || 'unknown';

        return {
            tweetLink,
            tweetId,
            authorHandle
        };
    };

    /**
     * @param {{ tweetObj: any, tweetLink: string, authorHandleFromDom: string }} args
     */
    const meta_buildMetadata = ({
        tweetObj,
        tweetLink,
        authorHandleFromDom
    }) => {
        const legacy = tweetObj?.legacy || {};
        const userLegacy = getSafeValue(tweetObj, 'core.user_results.result.legacy', {}) || {};
        const views = tweetObj?.views || null;

        const authorHandle = userLegacy.screen_name || authorHandleFromDom || 'unknown';
        const sourceText = stripHtml(tweetObj?.source || '');

        const metadata = {
            schema_version: 1,
            tweet: {
                id: tweetObj?.rest_id || legacy.id_str || '',
                url: tweetLink || '',
                created_at: legacy.created_at || '',
                text: legacy.full_text || '',
                lang: legacy.lang || '',
                conversation_id: legacy.conversation_id_str || '',
                source: sourceText || '',
                possibly_sensitive: !!legacy.possibly_sensitive,
                is_quote_status: !!legacy.is_quote_status,
                counts: {
                    replies: legacy.reply_count ?? null,
                    retweets: legacy.retweet_count ?? null,
                    likes: legacy.favorite_count ?? null,
                    quotes: legacy.quote_count ?? null,
                    bookmarks: legacy.bookmark_count ?? null,
                    views: views?.count ?? null,
                },
            },
            author: {
                id: getSafeValue(tweetObj, 'core.user_results.result.rest_id', '') ||
                    getSafeValue(tweetObj, 'core.user_results.result.id', '') ||
                    '',
                handle: authorHandle,
                name: userLegacy.name || '',
                profile_image_url: userLegacy.profile_image_url_https || '',
                created_at: userLegacy.created_at || '',
                followers: userLegacy.followers_count ?? null,
                following: userLegacy.friends_count ?? null,
                statuses: userLegacy.statuses_count ?? null,
                verified: !!userLegacy.verified,
                blue_verified: !!getSafeValue(tweetObj, 'core.user_results.result.is_blue_verified', false),
            },
            quoted_tweet: null,
            media: [],
        };

        const quoted = getSafeValue(tweetObj, 'quoted_status_result.result', null);
        if (quoted && quoted?.legacy) {
            const qLegacy = quoted.legacy;
            metadata.quoted_tweet = {
                id: quoted.rest_id || qLegacy.id_str || '',
                created_at: qLegacy.created_at || '',
                text: qLegacy.full_text || '',
                lang: qLegacy.lang || '',
                counts: {
                    replies: qLegacy.reply_count ?? null,
                    retweets: qLegacy.retweet_count ?? null,
                    likes: qLegacy.favorite_count ?? null,
                    quotes: qLegacy.quote_count ?? null,
                    bookmarks: qLegacy.bookmark_count ?? null,
                    views: quoted?.views?.count ?? null,
                },
            };
        }

        return metadata;
    };

    // =========================
    //  File naming
    // =========================

    /**
     * @param {{authorHandle: string, tweetId: string, createdAt: string, text: string}} tweet
     * @param {number} mediaIndex
     * @param {MediaItem} mediaItem
     */
    const buildFileNames = (tweet, mediaIndex, mediaItem, templates = null) => {
        const d = tweet.createdAt ? parseTwitterDate(tweet.createdAt) : null;
        const vars = {
            author: sanitizeFileComponent(tweet.authorHandle || 'unknown'),
            tweetId: sanitizeFileComponent(tweet.tweetId || ''),
            date: formatDateYYYYMMDD(d),
            time: formatTimeHHMMSS(d),
            text: sanitizeFileComponent(tweet.text || '', 60),
            index: mediaIndex,
            ext: mediaItem.ext || inferExtFromUrl(mediaItem.url, mediaItem.kind === 'video' ? 'mp4' : 'jpg'),
            mediaType: mediaItem.kind || '',
        };

        const zipTemplate = templates?.zipTemplate ?? storage_loadTemplate(CONFIG.storage.keys.zipTemplate, CONFIG.defaults.zipTemplate);
        const mediaTemplate = templates?.mediaTemplate ?? storage_loadTemplate(CONFIG.storage.keys.mediaTemplate, CONFIG.defaults.mediaTemplate);

        const zipBase = sanitizeFileComponent(renderTemplate(zipTemplate, vars) || `${vars.author}_${vars.tweetId}`, 120);
        const mediaName = sanitizeFileComponent(renderTemplate(mediaTemplate, vars) || `${vars.author}_${vars.tweetId}_${vars.index}.${vars.ext}`, 140);

        // Ensure mediaName contains extension
        const finalMediaName = /\.[a-z0-9]{2,5}$/i.test(mediaName) ? mediaName : `${mediaName}.${vars.ext}`;
        return {
            zipBase,
            mediaFileName: finalMediaName,
            vars
        };
    };

    // =========================
    //  Download & ZIP helpers
    // =========================

    /**
     * @param {JSZip} zip
     * @param {MediaItem} mediaItem
     * @param {string} fileName
     * @returns {Promise<{ok:true, contentType:string, contentLength:number} | {ok:false, error:string}>}
     */
    const zip_fetchAndAddMedia = async (zip, mediaItem, fileName, signal) => {
        try {
            // Media is served from twitter/x CDNs (pbs.twimg.com, video.twimg.com, etc.).
            // Those responses typically do NOT allow credentialed CORS requests.
            // Use credentials: 'omit' for cross-origin to avoid CORS errors.
            const mediaUrl = new URL(mediaItem.url, location.href);
            const credentials = mediaUrl.origin === location.origin ? 'include' : 'omit';
            const res = await fetch(mediaUrl.toString(), {
                credentials,
                signal
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const rawCt = (res.headers.get('content-type') || mediaItem.contentType || '').toLowerCase();
            const ct = rawCt.split(';', 1)[0].trim();
            const cl = Number(res.headers.get('content-length') || '0') || 0;

            const ext = inferExtFromUrl(mediaItem.url, mediaItem.ext || '');
            const allowedByExt = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'mkv']);

            const isMediaMime = ct.startsWith('image/') || ct.startsWith('video/');
            const isGenericMime = ct === '' || ct === 'application/octet-stream' || ct === 'binary/octet-stream';

            if (!isMediaMime) {
                if (!(isGenericMime && allowedByExt.has(ext))) {
                    throw new Error(`Unexpected content-type "${ct || 'unknown'}" for .${ext || 'unknown'}`);
                }
            }

            zip.file(fileName, await res.blob());
            return {
                ok: true,
                contentType: ct || mediaItem.contentType || '',
                contentLength: cl
            };
        } catch (e) {
            console.error(`Failed to fetch media: ${mediaItem.url}`, e);
            return {
                ok: false,
                error: String(e?.message || e)
            };
        }
    };

    /** @param {JSZip} zip @param {{metadata: any, tweetLink: string, zipBase: string}} extras */
    const zip_addExtras = (zip, extras) => {
        zip.file('metadata.json', JSON.stringify(extras.metadata, null, 2));
        zip.file(`${extras.zipBase}.url`, `[InternetShortcut]\nURL=${extras.tweetLink}`);
    };

    /**
     * @template T
     * @param {T[]} items
     * @param {number} concurrency
     * @param {(item: T, idx: number) => Promise<any>} mapper
     */
    const mapWithConcurrency = async (items, concurrency, mapper) => {
        // Clamp concurrency to the configured maximum to prevent runaway workers.
        const limit = clampNumber(concurrency, 1, CONFIG.defaults.maxConcurrency || 6);
        const results = new Array(items.length);
        let idx = 0;

        const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
            while (idx < items.length) {
                const i = idx++;
                results[i] = await mapper(items[i], i);
            }
        });

        await Promise.all(workers);
        return results;
    };

    // =========================
    //  Processed tweets cache (service)
    // =========================

    class ProcessedCache {
        /**
         * @param {{ key: string, max: number, storage: Storage }} args
         */
        constructor({
            key,
            max,
            storage
        }) {
            this.key = key;
            this.max = max;
            this.storage = storage;
            this.set = new Set(this.#parseStored(storage.getItem(key)));
            this._onStorage = null;
        }

        /** @param {string} id */
        has(id) {
            return this.set.has(String(id));
        }

        /** @param {string} id */
        mark(id) {
            const s = String(id);
            if (!s) return;
            if (this.set.has(s)) return;
            this.set.add(s);
            this.#mergeAndPersist(s);
        }

        startSync() {
            if (this._onStorage) return;
            this._onStorage = (e) => {
                if (!e || e.storageArea !== this.storage) return;
                if (e.key !== this.key) return;

                const next = this.#parseStored(e.newValue || '[]');
                this.set.clear();
                next.forEach((x) => this.set.add(String(x)));
            };
            window.addEventListener('storage', this._onStorage, true);
        }

        stopSync() {
            if (!this._onStorage) return;
            window.removeEventListener('storage', this._onStorage, true);
            this._onStorage = null;
        }

        /** @param {string | null} raw */
        #parseStored(raw) {
            try {
                const arr = JSON.parse(raw || '[]');
                if (!Array.isArray(arr)) return [];
                return arr.map(String).filter(Boolean);
            } catch {
                return [];
            }
        }

        /** @param {string} id */
        #mergeAndPersist(id) {
            const latest = new Set(this.#parseStored(this.storage.getItem(this.key)));
            latest.add(id);
            // Keep only last N entries
            const finalArr = [...latest].slice(-this.max);
            this.storage.setItem(this.key, JSON.stringify(finalArr));
            this.set = new Set(finalArr);
        }
    }

    /** @type {ProcessedCache} */
    let processedCache;


    // =========================
    //  UI: button visuals
    // =========================

    /** @param {boolean} isSuccess */
    const ui_getDownloadIcon = (isSuccess = false) => {
        const fillColor = isSuccess ? '#2ecc71' : '#1da1f2';
        return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${fillColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>`;
    };



    // New loading spinner icon using the user-provided SVG. This spinner rotates in place and uses
    // a custom color defined in HSL. It replaces the older three-dot loader but is kept separate
    // so the original loader can still be referenced if needed.
    const ui_getLoadingIconNew = () => `
<svg fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>`;

    /** @param {HTMLElement} button @param {boolean} isLoading */
    const ui_setButtonLoading = (button, isLoading) => {
        const svg = button.querySelector('svg');
        if (!svg) return;
        svg.outerHTML = isLoading ? ui_getLoadingIconNew() : ui_getDownloadIcon(processedCache.has(button.dataset.tweetId));
        button.disabled = !!isLoading;
    };

    /** @param {HTMLElement} button @param {boolean} success */
    const ui_setButtonSuccess = (button, success) => {
        const svg = button.querySelector('svg');
        if (svg) svg.outerHTML = ui_getDownloadIcon(!!success);
    };

    /** @param {HTMLElement} tweetElement */
    const dom_hasMedia = (tweetElement) => {
        // Quick DOM heuristic: photo links or play button
        const selectors = ['a[href*="/photo/1"]', 'button[data-testid="playButton"]', 'div[data-testid="tweetPhoto"]'];
        return selectors.some((s) => tweetElement.querySelector(s));
    };

    /** @param {HTMLElement} tweetElement */
    const ui_addDownloadButton = (tweetElement) => {
        if (!tweetElement || tweetElement.querySelector(`.${CONFIG.ui.btnClass}`)) return;
        if (!dom_hasMedia(tweetElement)) return;

        const domInfo = dom_extractTweetInfo(tweetElement);
        if (!domInfo?.tweetId) return;

        const tweetId = domInfo.tweetId;
        const processedFlag = processedCache.has(tweetId);

        const buttonGroup = tweetElement.querySelector('div[role="group"]:last-of-type');
        if (!buttonGroup) return;

        const buttonShare = Array.from(buttonGroup.querySelectorAll(':scope > div > div')).pop()?.parentNode;
        if (!buttonShare) return;

        const buttonDownload = buttonShare.cloneNode(true);
        const svg = buttonDownload.querySelector('svg');
        if (svg) svg.outerHTML = ui_getDownloadIcon(processedFlag);

        buttonDownload.style.marginLeft = '10px';
        buttonDownload.classList.add(CONFIG.ui.btnClass);
        buttonDownload.dataset.tweetId = tweetId;
        // Add an accessible label for screen readers
        buttonDownload.setAttribute('aria-label', 'Download media from this tweet');

        buttonShare.parentNode.insertBefore(buttonDownload, buttonShare.nextSibling);
    };

    // =========================
    //  Media processing class
    // =========================

    class TweetMediaProcessor {
        /**
         * @param {{
         *   button: HTMLElement,
         *   tweetElement: HTMLElement,
         *   api: ApiClient,
         *   ui: UiService,
         *   settings: SettingsStore,
         *   cache: ProcessedCache,
         *   signal?: AbortSignal
         * }} args
         */
        constructor({
            button,
            tweetElement,
            api,
            ui,
            settings,
            cache,
            signal
        }) {
            this.button = button;
            this.tweetElement = tweetElement;

            this.api = api;
            this.ui = ui;
            this.settings = settings;
            this.cache = cache;

            this.tweetId = String(button?.dataset?.tweetId || '');
            this.toastId = `tmd_toast_${this.tweetId}`;

            // Abort controller for this specific download run.
            this.abortController = new AbortController();
            this.signal = anySignal([this.abortController.signal, signal, RUNTIME_ABORT.signal]);
        }
        async process() {
            if (!this.tweetId) return;

            const domInfo = dom_extractTweetInfo(this.tweetElement);
            const tweetLink = domInfo?.tweetLink || `https://x.com/i/status/${this.tweetId}`;
            const authorHandleFromDom = domInfo?.authorHandle || 'unknown';

            this.ui.setButtonLoading(this.button, true);
            this.ui.toastShow({
                id: this.toastId,
                title: 'Downloading…',
                message: `Tweet ${this.tweetId}: fetching data`,
                progress: 5,
                persistent: true
            });

            try {
                const tweetData = await withRetry(() => this.api.fetchTweetData(this.tweetId, {
                    signal: this.signal
                }), {
                    retries: CONFIG.api.retries,
                    delayMs: CONFIG.api.retryDelayMs,
                    signal: this.signal
                });

                const validity = validateTweetData(tweetData, this.tweetId);
                if (!validity.ok) {
                    this.ui.toastShow({
                        id: this.toastId,
                        title: 'Download failed',
                        message: validity.reason,
                        type: 'error',
                        persistent: true
                    });
                    return;
                }

                const tweetObj = parse_getTweetObjectFromResponse(tweetData, this.tweetId);
                if (!tweetObj) {
                    this.ui.toastShow({
                        id: this.toastId,
                        title: 'Download failed',
                        message: 'Could not parse tweet data (unexpected response shape).',
                        type: 'error',
                        persistent: true
                    });
                    return;
                }

                const mediaItems = media_extractItems(tweetObj);
                if (!mediaItems.length) {
                    this.ui.toastShow({
                        id: this.toastId,
                        title: 'No media found',
                        message: 'No downloadable media found in this tweet.',
                        type: 'error',
                        persistent: false
                    });
                    return;
                }

                const authorHandle = getSafeValue(tweetObj, 'core.user_results.result.legacy.screen_name', authorHandleFromDom) || authorHandleFromDom;
                const legacy = tweetObj.legacy || {};
                const createdAt = legacy.created_at || '';
                const text = legacy.full_text || '';

                // Build names from template
                const {
                    zipBase
                } = buildFileNames({
                    authorHandle,
                    tweetId: this.tweetId,
                    createdAt,
                    text
                }, 1, mediaItems[0], this.settings.getTemplates());

                const zip = new JSZip();
                const metadata = meta_buildMetadata({
                    tweetObj,
                    tweetLink,
                    authorHandleFromDom
                });

                const concurrency = this.settings.getConcurrency();
                const isIndeterminate = mediaItems.length === 1;

                this.ui.toastShow({
                    id: this.toastId,
                    title: 'Downloading…',
                    message: `Tweet ${this.tweetId}: ${mediaItems.length} file(s)`,
                    progress: isIndeterminate ? 'indeterminate' : 12,
                    metaLeft: `${mediaItems.length} item(s)`,
                    metaRight: `concurrency ${concurrency}`,
                    persistent: true,
                });

                let completed = 0;
                const total = mediaItems.length;

                await mapWithConcurrency(mediaItems, concurrency, async (mediaItem, i) => {
                    const index = i + 1;
                    const {
                        mediaFileName
                    } = buildFileNames({
                        authorHandle,
                        tweetId: this.tweetId,
                        createdAt,
                        text
                    }, index, mediaItem);

                    this.ui.toastShow({
                        id: this.toastId,
                        title: 'Downloading…',
                        message: `Downloading ${index}/${total}: ${mediaItem.kind}`,
                        progress: isIndeterminate ? 'indeterminate' : (12 + Math.floor((completed / total) * 70)),
                        metaLeft: `${completed}/${total} done`,
                        metaRight: mediaFileName,
                        persistent: true,
                    });

                    const res = await zip_fetchAndAddMedia(zip, mediaItem, mediaFileName, this.signal);
                    if (res.ok) {
                        metadata.media.push({
                            url: mediaItem.url,
                            type: mediaItem.kind === 'photo' ? 'photo' : 'video',
                            kind: mediaItem.kind,
                            file_name: mediaFileName,
                            content_type: res.contentType || mediaItem.contentType || '',
                            bitrate: mediaItem.bitrate ?? null,
                            width: mediaItem.width ?? null,
                            height: mediaItem.height ?? null,
                            expanded_url: mediaItem.expandedUrl ?? null,
                        });
                    } else {
                        metadata.media.push({
                            url: mediaItem.url,
                            type: mediaItem.kind === 'photo' ? 'photo' : 'video',
                            kind: mediaItem.kind,
                            file_name: null,
                            error: res.error || 'download_failed',
                        });
                    }

                    completed += 1;

                    this.ui.toastShow({
                        id: this.toastId,
                        title: 'Downloading…',
                        message: `Downloaded ${completed}/${total}`,
                        progress: isIndeterminate ? 'indeterminate' : (12 + Math.floor((completed / total) * 70)),
                        metaLeft: `${completed}/${total} done`,
                        metaRight: '',
                        persistent: true,
                    });
                });

                this.ui.toastShow({
                    id: this.toastId,
                    title: 'Packaging ZIP…',
                    message: 'Generating archive',
                    progress: 90,
                    persistent: true
                });
                zip_addExtras(zip, {
                    metadata,
                    tweetLink,
                    zipBase
                });

                const blob = await zip.generateAsync({
                    type: 'blob'
                });
                saveAs(blob, `${zipBase}.zip`);

                // Record this download in the history store. Capture the date
                // separately from metadata.created_at, as that may be missing or
                // incomplete when the API response lacks a timestamp.
                try {
                    HistoryStore.addEntry({
                        tweetId: this.tweetId,
                        tweetLink,
                        date: new Date().toISOString().split('T')[0],
                        files: metadata.media.filter((m) => m?.file_name).map((m) => m.file_name),
                        zip: `${zipBase}.zip`,
                    });
                } catch (e) {
                    console.error('Failed to record download history', e);
                }

                this.cache.mark(this.tweetId);
                this.ui.setButtonSuccess(this.button, true);

                this.ui.toastShow({
                    id: this.toastId,
                    title: 'Done',
                    message: `${zipBase}.zip saved`,
                    progress: 100,
                    type: 'success',
                    persistent: false
                });
            } catch (e) {
                console.error(`Failed to process tweetId ${this.tweetId}:`, e);
                this.ui.toastShow({
                    id: this.toastId,
                    title: 'Download failed',
                    message: String(e?.message || e || 'Unknown error'),
                    type: 'error',
                    persistent: true,
                });
            } finally {
                this.abortController.abort();
                // stop spinner + re-enable the button
                this.ui.setButtonLoading(this.button, false);
            }
        }
    }
    // =========================
    //  App structure
    // =========================

    /**
     * Add an event listener that is automatically removed when the signal aborts.
     * @template {EventTarget} T
     * @param {T} target
     * @param {string} type
     * @param {(ev: any) => void} handler
     * @param {AddEventListenerOptions | boolean | undefined} options
     * @param {AbortSignal | undefined} signal
     */
    const addAbortableListener = (target, type, handler, options, signal) => {
        target.addEventListener(type, handler, options);
        signal?.addEventListener(
            'abort',
            () => {
                try {
                    target.removeEventListener(type, handler, options);
                } catch { }
            }, {
            once: true
        }
        );
    };

    class SettingsStore {
        constructor() { }

        getTemplates() {
            return {
                zipTemplate: storage_loadTemplate(CONFIG.storage.keys.zipTemplate, CONFIG.defaults.zipTemplate),
                mediaTemplate: storage_loadTemplate(CONFIG.storage.keys.mediaTemplate, CONFIG.defaults.mediaTemplate),
            };
        }

        getZipTemplate() {
            return storage_loadTemplate(CONFIG.storage.keys.zipTemplate, CONFIG.defaults.zipTemplate);
        }

        getMediaTemplate() {
            return storage_loadTemplate(CONFIG.storage.keys.mediaTemplate, CONFIG.defaults.mediaTemplate);
        }

        getConcurrency() {
            // Return the stored concurrency value clamped to the allowed range.
            const raw = storage_loadNumber(CONFIG.storage.keys.concurrency, CONFIG.defaults.concurrency);
            return clampNumber(raw, 1, CONFIG.defaults.maxConcurrency || 6);
        }

        setZipTemplate(v) {
            storage_save(CONFIG.storage.keys.zipTemplate, sanitizeTemplateString(String(v ?? '')));
        }

        setMediaTemplate(v) {
            storage_save(CONFIG.storage.keys.mediaTemplate, sanitizeTemplateString(String(v ?? '')));
        }

        setConcurrency(n) {
            const num = Number(n);
            // Clamp the provided value to the configured concurrency range and round.
            const v = Number.isFinite(num)
                ? Math.round(clampNumber(num, 1, CONFIG.defaults.maxConcurrency || 6))
                : CONFIG.defaults.concurrency;
            storage_save(CONFIG.storage.keys.concurrency, String(v));
        }
    }

    class ApiClient {
        /**
         * @param {{ signal?: AbortSignal }} args
         */
        constructor({
            signal
        } = {}) {
            this.signal = signal;
        }

        async fetchTweetData(tweetId, {
            signal
        } = {}) {
            return api_fetchTweetData(tweetId, {
                signal: anySignal([signal, this.signal])
            });
        }
    }

    class UiService {
        /**
         * @param {{ settings: SettingsStore, signal?: AbortSignal }} args
         */
        constructor({
            settings,
            signal
        } = {}) {
            this.settings = settings;
            this.signal = signal;
        }

        mount() {
            // No-op: removed discoverability toast. The settings modal can now
            // be opened via the userscript menu provided by Tampermonkey.
        }

        unmount() {
            document.getElementById(CONFIG.ui.toastHostId)?.remove();
            document.getElementById(CONFIG.ui.modalId)?.remove();
        }

        ensureButtons(articles) {
            for (const a of articles) ui_addDownloadButton(a);
        }

        setButtonLoading(button, isLoading) {
            ui_setButtonLoading(button, isLoading);
        }

        setButtonSuccess(button, success) {
            ui_setButtonSuccess(button, success);
        }

        toastShow(args) {
            toast_show(args);
        }

        openSettingsModal() {
            settings_openModal();
        }

        closeSettingsModal() {
            settings_closeModal();
        }

        /**
         * Delegated click handling for both download buttons and toast controls.
         * @param {{
         *   onDownloadClick: (button: HTMLElement, tweetElement: HTMLElement, event: MouseEvent) => void | Promise<void>
         * }} args
         */
        bindGlobalHandlers({
            onDownloadClick
        }) {
            const onClick = (event) => {
                const toastBtn = event.target?.closest?.('.tmd-toast button[data-action]');
                if (toastBtn) {
                    const toastEl = toastBtn.closest?.('.tmd-toast');
                    if (!toastEl) return;

                    const act = toastBtn.getAttribute('data-action');
                    if (act === 'close') toastEl.remove();
                    if (act === 'settings') this.openSettingsModal();
                    return;
                }

                const btn = event.target?.closest?.(`.${CONFIG.ui.btnClass}`);
                if (!btn) return;

                // Alt+Click opens settings
                if (event?.altKey) {
                    this.openSettingsModal();
                    return;
                }

                const tweetElement = btn.closest?.('article');
                if (!tweetElement) return;

                void onDownloadClick(btn, tweetElement, event);
            };

            const onKeydown = (e) => {
                if (e.key === 'Escape') this.closeSettingsModal();
            };

            addAbortableListener(document, 'click', onClick, true, this.signal);
            addAbortableListener(window, 'keydown', onKeydown, true, this.signal);
        }
    }

    class ObserverService {
        /**
         * @param {{
         *   root: HTMLElement,
         *   debounceMs: number,
         *   maxPending: number,
         *   onArticles: (articles: HTMLElement[]) => void,
         *   signal?: AbortSignal
         * }} args
         */
        constructor({
            root,
            debounceMs,
            maxPending,
            onArticles,
            signal
        }) {
            this.root = root;
            this.debounceMs = debounceMs;
            this.maxPending = maxPending;
            this.onArticles = onArticles;
            this.signal = signal;

            this.pending = new Set();
            this.timer = null;
            this.observer = null;
        }

        start() {
            if (this.observer) return;

            const flushPending = () => {
                this.timer = null;
                if (!this.pending.size) return;
                const batch = [...this.pending];
                this.pending.clear();
                this.onArticles(batch);
            };

            const scheduleFlush = () => {
                if (this.timer !== null) return;
                this.timer = window.setTimeout(() => {
                    requestAnimationFrame(flushPending);
                }, this.debounceMs);
            };

            this.observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        if (!(n instanceof HTMLElement)) continue;

                        if (n.matches?.('article')) {
                            this.pending.add(n);
                        } else {
                            n.querySelectorAll?.('article')?.forEach((a) => this.pending.add(a));
                        }

                        // Hard cap to avoid unbounded growth during heavy DOM churn.
                        if (this.pending.size >= this.maxPending) {
                            if (this.timer !== null) {
                                clearTimeout(this.timer);
                                this.timer = null;
                            }
                            flushPending();
                        }
                    }
                }
                scheduleFlush();
            });

            this.observer.observe(this.root, {
                childList: true,
                subtree: true
            });

            this.signal?.addEventListener('abort', () => this.stop(), {
                once: true
            });
        }

        stop() {
            try {
                this.observer?.disconnect();
            } catch { }
            this.observer = null;

            if (this.timer !== null) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.pending.clear();
        }
    }

    class TwitterMediaDownloaderApp {
        constructor({
            config
        }) {
            this.config = config;
            this.controller = new AbortController();
            this.signal = anySignal([this.controller.signal, RUNTIME_ABORT.signal]);

            this.settings = new SettingsStore();
            this.cache = new ProcessedCache({
                key: config.storage.keys.processed,
                max: config.storage.maxProcessed,
                storage: localStorage,
            });
            this.api = new ApiClient({
                signal: this.signal
            });
            this.ui = new UiService({
                settings: this.settings,
                signal: this.signal
            });

            this.observer = new ObserverService({
                root: document.body,
                debounceMs: config.ui.observerDebounceMs,
                maxPending: config.ui.observerMaxPending || 600,
                onArticles: (articles) => this.ui.ensureButtons(articles),
                signal: this.signal,
            });
        }

        start() {
            // Make cache available for UI helpers that still reference the shared instance.
            processedCache = this.cache;

            this.cache.startSync();
            this.ui.mount();
            this.ui.bindGlobalHandlers({
                onDownloadClick: (button, tweetElement, event) => this.#handleDownload(button, tweetElement, event),
            });

            this.observer.start();

            // Initial scan
            const initial = Array.from(document.querySelectorAll('article'));
            this.ui.ensureButtons( /** @type {HTMLElement[]} */(initial));
        }

        stop() {
            this.controller.abort();
            this.observer.stop();
            this.cache.stopSync();
            this.ui.unmount();
        }

        async #handleDownload(button, tweetElement, event) {
            const tweetId = String(button?.dataset?.tweetId || '');
            if (!tweetId) return;

            if (this.cache.has(tweetId)) {
                this.ui.toastShow({
                    title: 'Already processed',
                    message: `Tweet ${tweetId} was already downloaded in this browser.`,
                    type: 'info',
                    timeoutMs: 2500,
                });
                return;
            }

            const processor = new TweetMediaProcessor({
                button,
                tweetElement,
                api: this.api,
                ui: this.ui,
                settings: this.settings,
                cache: this.cache,
                signal: this.signal,
            });

            await processor.process();
        }
    }

    // =========================
    //  Boot + cleanup
    // =========================

    const app = new TwitterMediaDownloaderApp({
        config: CONFIG
    });
    injectExternalCss();
    app.start();

    // Register Tampermonkey menu entries for opening settings and exporting/importing history.
    try {
        const registerCommand = (typeof GM_registerMenuCommand === 'function')
            ? GM_registerMenuCommand
            : (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function'
                ? GM.registerMenuCommand
                : null);
        if (registerCommand) {
            registerCommand('Open Downloader Settings', () => {
                try {
                    app.ui.openSettingsModal();
                } catch (e) {
                    console.error('Failed to open settings modal via menu', e);
                }
            });
            registerCommand('Export Download History (Markdown)', () => {
                try {
                    HistoryStore.exportMarkdown();
                } catch (e) {
                    console.error('Failed to export history via menu', e);
                }
            });
            registerCommand('Export Download History (JSON)', () => {
                try {
                    HistoryStore.exportJson();
                } catch (e) {
                    console.error('Failed to export JSON history via menu', e);
                }
            });
            registerCommand('Import Download History', () => {
                try {
                    HistoryStore.import();
                } catch (e) {
                    console.error('Failed to import history via menu', e);
                }
            });
        }
    } catch (e) {
        console.error('Menu registration failed', e);
    }

    const cleanup = () => {
        try {
            RUNTIME_ABORT.abort();
        } catch { }
        try {
            app.stop();
        } catch { }
    };

    // Clean up on navigation/unload (fixes long-session memory growth)
    window.addEventListener('pagehide', cleanup, {
        capture: true,
        once: true
    });
    window.addEventListener('beforeunload', cleanup, {
        capture: true,
        once: true
    });

})();
