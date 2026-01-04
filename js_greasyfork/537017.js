// ==UserScript==
// @name                YouTube +
// @name:en             YouTube +
// @name:de             YouTube +
// @name:ja             YouTube +
// @name:tr             YouTube +
// @name:zh-CN          YouTube +
// @name:zh-TW          YouTube +
// @name:fr             YouTube +
// @name:ko             YouTube +
// @namespace           by
// @version             2.3.3
// @author              diorhc
// @description         Вкладки для информации, комментариев, видео, плейлиста и скачивание видео и другие функции ↴
// @description:en      Tabview YouTube and Download and others features ↴
// @description:de      Tabview YouTube und Download und andere Funktionen ↴
// @description:fr      Tabview YouTube et Télécharger et autres fonctionnalités ↴
// @description:zh-CN   标签视图 YouTube、下载及其他功能 ↴
// @description:zh-TW   標籤檢視 YouTube 及下載及其他功能 ↴
// @description:ko      Tabview YouTube 및 다운로드 및 기타 기능 ↴
// @description:ja      タブビューYouTubeとダウンロードおよびその他の機能 ↴
// @description:tr      Sekmeli Görünüm YouTube ve İndir ve diğer özellikler ↴
// @match               https://*.youtube.com/*
// @match               https://music.youtube.com/*
// @match               *://myactivity.google.com/*
// @include             *://www.youtube.com/feed/history/*
// @include             https://www.youtube.com
// @include             *://*.youtube.com/**
// @exclude             *://accounts.youtube.com/*
// @exclude             *://www.youtube.com/live_chat_replay*
// @exclude             *://www.youtube.com/persist_identity*
// @exclude             /^https?://\w+\.youtube\.com\/live_chat.*$/
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license             MIT
// @require             https://cdn.jsdelivr.net/npm/@preact/signals-core@1.12.1/dist/signals-core.min.js
// @require             https://cdn.jsdelivr.net/npm/browser-id3-writer@4.4.0/dist/browser-id3-writer.min.js
// @require             https://cdn.jsdelivr.net/npm/preact@10.27.2/dist/preact.min.js
// @require             https://cdn.jsdelivr.net/npm/preact@10.27.2/hooks/dist/hooks.umd.js
// @require             https://cdn.jsdelivr.net/npm/@preact/signals@2.5.0/dist/signals.min.js
// @require             https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               unsafeWindow
// @connect             api.livecounts.io
// @connect             cnv.cx
// @connect             mp3yt.is
// @connect             web.archive.org
// @connect             *
// @connect             ytplaylist.robert.wesner.io
// @connect             youtube.com
// @connect             googlevideo.com
// @connect             self
// @run-at              document-start
// @noframes
// @homepageURL         https://github.com/diorhc/YTP
// @supportURL          https://github.com/diorhc/YTP/issues
// @downloadURL https://update.greasyfork.org/scripts/537017/YouTube%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/537017/YouTube%20%2B.meta.js
// ==/UserScript==

(function () {
 'use strict';
 const logError = (module, message, error) => {
 try {
 const errorDetails = {
 module,
 message,
 error:
 error instanceof Error
 ? {
 name: error.name,
 message: error.message,
 stack: error.stack,
 }
 : error,
 timestamp: new Date().toISOString(),
 userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
 url: typeof window !== 'undefined' ? window.location.href : 'unknown',
 };
 console.error(`[YouTube+][${module}] ${message}:`, error);
 console.warn('[YouTube+] Error details:', errorDetails);
 } catch (loggingError) {
 console.error('[YouTube+] Error logging failed:', loggingError);
 }
 };
 const createLogger = () => {
 const isDebugEnabled = (() => {
 try {
 if (typeof window === 'undefined') {
 return false;
 }
 const cfg = (window).YouTubePlusConfig;
 if (cfg && cfg.debug) {
 return true;
 }
 if (typeof ( (window).YTP_DEBUG) !== 'undefined') {
 return !!( (window).YTP_DEBUG);
 }
 return false;
 } catch {
 return false;
 }
 })();
 return {
 debug: (...args) => {
 if (isDebugEnabled && console?.warn) {
 console.warn('[YouTube+][DEBUG]', ...args);
 }
 },
 info: (...args) => {
 if (isDebugEnabled && console?.warn) {
 console.warn('[YouTube+][INFO]', ...args);
 }
 },
 warn: (...args) => {
 if (console?.warn) {
 console.warn('[YouTube+]', ...args);
 }
 },
 error: (...args) => {
 if (console?.error) {
 console.error('[YouTube+]', ...args);
 }
 },
 };
 };
 const debounce = (fn, ms, options = {}) => {
 let timeout = null;
 let lastArgs = null;
 let lastThis = null;
 const debounced = function (...args) {
 lastArgs = args;
 lastThis = this;
 clearTimeout(timeout);
 if (options.leading && !timeout) {
 (fn).apply(this, args);
 }
 timeout = setTimeout(() => {
 if (!options.leading) (fn).apply(lastThis, lastArgs);
 timeout = null;
 lastArgs = null;
 lastThis = null;
 }, ms);
 };
 debounced.cancel = () => {
 clearTimeout(timeout);
 timeout = null;
 lastArgs = null;
 lastThis = null;
 };
 return (debounced);
 };
 const throttle = (fn, limit) => {
 let inThrottle = false;
 let lastResult;
 const throttled = function (...args) {
 if (!inThrottle) {
 lastResult = (fn).apply(this, args);
 inThrottle = true;
 setTimeout(() => (inThrottle = false), limit);
 }
 return lastResult;
 };
 return (throttled);
 };
 const StyleManager = (function () {
 const styles = new Map();
 return {
 add(id, css) {
 try {
 let el = document.getElementById(id);
 if (!el) {
 el = document.createElement('style');
 el.id = id;
 document.head.appendChild(el);
 }
 styles.set(id, css);
 el.textContent = Array.from(styles.values()).join('\n\n');
 } catch (e) {
 logError('StyleManager', 'add failed', e);
 }
 },
 remove(id) {
 try {
 styles.delete(id);
 const el = document.getElementById(id);
 if (el) el.remove();
 } catch (e) {
 logError('StyleManager', 'remove failed', e);
 }
 },
 clear() {
 for (const id of Array.from(styles.keys())) this.remove(id);
 },
 };
 })();
 const EventDelegator = (() => {
 const delegations = new Map();
 return {
 delegate(parent, selector, event, handler) {
 const delegateHandler = e => {
 const target = (e.target);
 const match = target.closest(selector);
 if (match && parent.contains(match)) {
 handler.call(match, e);
 }
 };
 parent.addEventListener(event, delegateHandler, { passive: true });
 const key = `${event}_${selector}`;
 if (!delegations.has(parent)) {
 delegations.set(parent, new Map());
 }
 delegations.get(parent).set(key, delegateHandler);
 return () => {
 parent.removeEventListener(event, delegateHandler);
 const parentMap = delegations.get(parent);
 if (parentMap) {
 parentMap.delete(key);
 if (parentMap.size === 0) delegations.delete(parent);
 }
 };
 },
 clearFor(parent) {
 const parentMap = delegations.get(parent);
 if (!parentMap) return;
 parentMap.forEach((handler, key) => {
 const event = key.split('_')[0];
 parent.removeEventListener(event, handler);
 });
 delegations.delete(parent);
 },
 clearAll() {
 delegations.forEach((map, parent) => {
 map.forEach((handler, key) => {
 const event = key.split('_')[0];
 parent.removeEventListener(event, handler);
 });
 });
 delegations.clear();
 },
 };
 })();
 const cleanupManager = (function () {
 const observers = new Set();
 const listeners = new Map();
 const intervals = new Set();
 const timeouts = new Set();
 const animationFrames = new Set();
 const callbacks = new Set();
 const elementObservers = new WeakMap();
 return {
 registerObserver(o, el) {
 try {
 if (o) observers.add(o);
 if (el && typeof el === 'object') {
 try {
 let set = elementObservers.get(el);
 if (!set) {
 set = new Set();
 elementObservers.set(el, set);
 }
 set.add(o);
 } catch {}
 }
 } catch {}
 return o;
 },
 registerListener(target, ev, fn, opts) {
 try {
 target.addEventListener(ev, fn, opts);
 const key = Symbol();
 listeners.set(key, { target, ev, fn, opts });
 return key;
 } catch (e) {
 logError('cleanupManager', 'registerListener failed', e);
 return null;
 }
 },
 registerInterval(id) {
 intervals.add(id);
 return id;
 },
 registerTimeout(id) {
 timeouts.add(id);
 return id;
 },
 registerAnimationFrame(id) {
 animationFrames.add(id);
 return id;
 },
 register(cb) {
 if (typeof cb === 'function') callbacks.add(cb);
 },
 cleanup() {
 try {
 for (const cb of callbacks) {
 try {
 cb();
 } catch (e) {
 logError('cleanupManager', 'callback failed', e);
 }
 }
 callbacks.clear();
 for (const o of observers) {
 try {
 if (o && typeof o.disconnect === 'function') o.disconnect();
 } catch {}
 }
 observers.clear();
 try {
 } catch {}
 for (const keyEntry of listeners.values()) {
 try {
 keyEntry.target.removeEventListener(keyEntry.ev, keyEntry.fn, keyEntry.opts);
 } catch {}
 }
 listeners.clear();
 for (const id of intervals) clearInterval(id);
 intervals.clear();
 for (const id of timeouts) clearTimeout(id);
 timeouts.clear();
 for (const id of animationFrames) cancelAnimationFrame(id);
 animationFrames.clear();
 } catch (e) {
 logError('cleanupManager', 'cleanup failed', e);
 }
 },
 observers,
 elementObservers,
 disconnectForElement(el) {
 try {
 const set = elementObservers.get(el);
 if (!set) return;
 for (const o of set) {
 try {
 if (o && typeof o.disconnect === 'function') o.disconnect();
 observers.delete(o);
 } catch {}
 }
 elementObservers.delete(el);
 } catch (e) {
 logError('cleanupManager', 'disconnectForElement failed', e);
 }
 },
 disconnectObserver(o) {
 try {
 if (!o) return;
 try {
 if (typeof o.disconnect === 'function') o.disconnect();
 } catch {}
 observers.delete(o);
 try {
 } catch {}
 } catch (e) {
 logError('cleanupManager', 'disconnectObserver failed', e);
 }
 },
 listeners,
 intervals,
 timeouts,
 animationFrames,
 };
 })();
 const createElement = (tag, props = {}, children = []) => {
 try {
 const element = document.createElement(tag);
 Object.entries(props).forEach(([k, v]) => {
 if (k === 'className') element.className = v;
 else if (k === 'style' && typeof v === 'object') Object.assign(element.style, v);
 else if (k === 'dataset' && typeof v === 'object') Object.assign(element.dataset, v);
 else if (k.startsWith('on') && typeof v === 'function') {
 element.addEventListener(k.slice(2), v);
 } else element.setAttribute(k, v);
 });
 children.forEach(c => {
 if (typeof c === 'string') element.appendChild(document.createTextNode(c));
 else if (c instanceof Node) element.appendChild(c);
 });
 return element;
 } catch (e) {
 logError('createElement', 'failed', e);
 return document.createElement('div');
 }
 };
 const waitForElement = (selector, timeout = 5000, parent = document.body) =>
 new Promise((resolve, reject) => {
 if (!selector || typeof selector !== 'string') return reject(new Error('Invalid selector'));
 try {
 const el = parent.querySelector(selector);
 if (el) return resolve(el);
 } catch (e) {
 return reject(e);
 }
 const obs = new MutationObserver(() => {
 const el = parent.querySelector(selector);
 if (el) {
 try {
 obs.disconnect();
 } catch {}
 resolve(el);
 }
 });
 obs.observe(parent, { childList: true, subtree: true });
 const id = setTimeout(() => {
 try {
 obs.disconnect();
 } catch {}
 reject(new Error('timeout'));
 }, timeout);
 cleanupManager.registerTimeout(id);
 });
 const sanitizeHTML = html => {
 if (typeof html !== 'string') return '';
 if (html.length > 1000000) {
 console.warn('[YouTube+] HTML content too large, truncating');
 html = html.substring(0, 1000000);
 }
 const map = {
 '<': '&lt;',
 '>': '&gt;',
 '&': '&amp;',
 '"': '&quot;',
 "'": '&#39;',
 '/': '&#x2F;',
 '`': '&#x60;',
 '=': '&#x3D;',
 };
 return html.replace(/[<>&"'\/`=]/g, char => map[char] || char);
 };
 const escapeHTMLAttribute = str => {
 if (typeof str !== 'string') return '';
 const map = {
 '<': '&lt;',
 '>': '&gt;',
 '&': '&amp;',
 '"': '&quot;',
 "'": '&#39;',
 '/': '&#x2F;',
 '`': '&#x60;',
 '=': '&#x3D;',
 '\n': '&#10;',
 '\r': '&#13;',
 '\t': '&#9;',
 };
 return str.replace(/[<>&"'\/`=\n\r\t]/g, char => map[char] || char);
 };
 const isValidURL = url => {
 if (typeof url !== 'string') return false;
 if (url.length > 2048) return false;
 if (/^\s|\s$/.test(url)) return false;
 try {
 const parsed = new URL(url);
 if (!['http:', 'https:'].includes(parsed.protocol)) return false;
 return true;
 } catch {
 return false;
 }
 };
 const safeMerge = (target, source) => {
 if (!source || typeof source !== 'object') return target;
 if (!target || typeof target !== 'object') return target;
 const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
 for (const key in source) {
 if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
 if (dangerousKeys.includes(key)) {
 console.warn(`[YouTube+][Security] Blocked attempt to set dangerous key: ${key}`);
 continue;
 }
 const value = source[key];
 if (value && typeof value === 'object' && !Array.isArray(value)) {
 target[key] = safeMerge(target[key] || {}, value);
 } else {
 target[key] = value;
 }
 }
 return target;
 };
 const validateVideoId = videoId => {
 if (typeof videoId !== 'string') return null;
 if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;
 return videoId;
 };
 const validatePlaylistId = playlistId => {
 if (typeof playlistId !== 'string') return null;
 if (!/^[a-zA-Z0-9_-]+$/.test(playlistId) || playlistId.length < 2 || playlistId.length > 50) {
 return null;
 }
 return playlistId;
 };
 const validateChannelId = channelId => {
 if (typeof channelId !== 'string') return null;
 if (!/^UC[a-zA-Z0-9_-]{22}$/.test(channelId) && !/^@[\w-]{3,30}$/.test(channelId)) {
 return null;
 }
 return channelId;
 };
 const validateNumber = (value, min = -Infinity, max = Infinity, defaultValue = 0) => {
 const num = Number(value);
 if (Number.isNaN(num) || !Number.isFinite(num)) return defaultValue;
 return Math.max(min, Math.min(max, num));
 };
 const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
 let lastError;
 for (let i = 0; i < maxRetries; i++) {
 try {
 return await fn();
 } catch (error) {
 lastError = error;
 if (i < maxRetries - 1) {
 const delay = baseDelay * Math.pow(2, i);
 await new Promise(resolve => setTimeout(resolve, delay));
 }
 }
 }
 throw lastError;
 };
 const storage = {
 get(key, def = null) {
 if (typeof key !== 'string' || !/^[a-zA-Z0-9_\-\.]+$/.test(key)) {
 logError('storage', 'Invalid key format', new Error(`Invalid key: ${key}`));
 return def;
 }
 try {
 const v = localStorage.getItem(key);
 if (v === null) return def;
 if (v.length > 5 * 1024 * 1024) {
 logError('storage', 'Stored value too large', new Error(`Key: ${key}`));
 return def;
 }
 return JSON.parse(v);
 } catch (e) {
 logError('storage', 'Failed to parse stored value', e);
 return def;
 }
 },
 set(key, val) {
 if (typeof key !== 'string' || !/^[a-zA-Z0-9_\-\.]+$/.test(key)) {
 logError('storage', 'Invalid key format', new Error(`Invalid key: ${key}`));
 return false;
 }
 try {
 const serialized = JSON.stringify(val);
 if (serialized.length > 5 * 1024 * 1024) {
 logError('storage', 'Value too large to store', new Error(`Key: ${key}`));
 return false;
 }
 localStorage.setItem(key, serialized);
 return true;
 } catch (e) {
 logError('storage', 'Failed to store value', e);
 return false;
 }
 },
 remove(key) {
 try {
 localStorage.removeItem(key);
 } catch (e) {
 logError('storage', 'Failed to remove value', e);
 }
 },
 clear() {
 try {
 localStorage.clear();
 } catch (e) {
 logError('storage', 'Failed to clear storage', e);
 }
 },
 has(key) {
 try {
 return localStorage.getItem(key) !== null;
 } catch {
 return false;
 }
 },
 };
 const DOMCache = (() => {
 const cache = new Map();
 const MAX_CACHE_SIZE = 200;
 const CACHE_TTL = 5000;
 return {
 get(selector, parent = document) {
 const key = `${selector}_${parent === document ? 'doc' : ''}`;
 const cached = cache.get(key);
 if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
 return cached.element;
 }
 const element = parent.querySelector(selector);
 if (element) {
 cache.set(key, { element, timestamp: Date.now() });
 if (cache.size > MAX_CACHE_SIZE) {
 const oldestKey = cache.keys().next().value;
 cache.delete(oldestKey);
 }
 }
 return element;
 },
 clear(selector) {
 const keys = Array.from(cache.keys()).filter(k => k.startsWith(selector));
 keys.forEach(k => cache.delete(k));
 },
 clearAll() {
 cache.clear();
 },
 };
 })();
 const ScrollManager = (() => {
 const listeners = new WeakMap();
 const addScrollListener = (element, callback, options = {}) => {
 try {
 const { debounce: debounceMs = 0, throttle: throttleMs = 0, runInitial = false } = options;
 let handler = callback;
 if (debounceMs > 0) {
 handler = debounce(handler, debounceMs);
 }
 if (throttleMs > 0) {
 handler = throttle(handler, throttleMs);
 }
 if (!listeners.has(element)) {
 listeners.set(element, new Set());
 }
 listeners.get(element).add(handler);
 element.addEventListener('scroll', handler, { passive: true });
 if (runInitial) {
 try {
 callback();
 } catch (err) {
 logError('ScrollManager', 'Initial callback error', err);
 }
 }
 return () => {
 try {
 element.removeEventListener('scroll', handler);
 const set = listeners.get(element);
 if (set) {
 set.delete(handler);
 if (set.size === 0) {
 listeners.delete(element);
 }
 }
 } catch (err) {
 logError('ScrollManager', 'Cleanup error', err);
 }
 };
 } catch (err) {
 logError('ScrollManager', 'addScrollListener error', err);
 return () => {};
 }
 };
 const removeAllListeners = element => {
 try {
 const set = listeners.get(element);
 if (!set) return;
 set.forEach(handler => {
 try {
 element.removeEventListener('scroll', handler);
 } catch {}
 });
 listeners.delete(element);
 } catch (err) {
 logError('ScrollManager', 'removeAllListeners error', err);
 }
 };
 const scrollToTop = (element, options = {}) => {
 const { duration = 300, easing = 'ease-out' } = options;
 try {
 if ('scrollBehavior' in document.documentElement.style) {
 element.scrollTo({ top: 0, behavior: 'smooth' });
 return;
 }
 const start = element.scrollTop;
 const startTime = performance.now();
 const scroll = currentTime => {
 const elapsed = currentTime - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const easeOutQuad = t => t * (2 - t);
 const easedProgress = easing === 'ease-out' ? easeOutQuad(progress) : progress;
 element.scrollTop = start * (1 - easedProgress);
 if (progress < 1) {
 requestAnimationFrame(scroll);
 }
 };
 requestAnimationFrame(scroll);
 } catch (err) {
 logError('ScrollManager', 'scrollToTop error', err);
 }
 };
 return {
 addScrollListener,
 removeAllListeners,
 scrollToTop,
 };
 })();
 if (typeof window !== 'undefined') {
 (window).YouTubeUtils = (window).YouTubeUtils || {};
 const U = (window).YouTubeUtils;
 U.logError = U.logError || logError;
 U.debounce = U.debounce || debounce;
 U.throttle = U.throttle || throttle;
 U.StyleManager = U.StyleManager || StyleManager;
 U.cleanupManager = U.cleanupManager || cleanupManager;
 U.EventDelegator = U.EventDelegator || EventDelegator;
 U.DOMCache = U.DOMCache || DOMCache;
 U.ScrollManager = U.ScrollManager || ScrollManager;
 U.createElement = U.createElement || createElement;
 U.waitForElement = U.waitForElement || waitForElement;
 U.storage = U.storage || storage;
 U.sanitizeHTML = U.sanitizeHTML || sanitizeHTML;
 U.escapeHTMLAttribute = U.escapeHTMLAttribute || escapeHTMLAttribute;
 U.safeMerge = U.safeMerge || safeMerge;
 U.validateVideoId = U.validateVideoId || validateVideoId;
 U.validatePlaylistId = U.validatePlaylistId || validatePlaylistId;
 U.validateChannelId = U.validateChannelId || validateChannelId;
 U.validateNumber = U.validateNumber || validateNumber;
 U.isValidURL = U.isValidURL || isValidURL;
 U.logger = U.logger || createLogger();
 U.retryWithBackoff = U.retryWithBackoff || retryWithBackoff;
 U.channelStatsHelpers = U.channelStatsHelpers || null;
 try {
 const w = window;
 if (w && !w.__ytp_timers_wrapped) {
 const origSetTimeout = w.setTimeout.bind(w);
 const origSetInterval = w.setInterval.bind(w);
 const origRaf = w.requestAnimationFrame ? w.requestAnimationFrame.bind(w) : null;
 w.setTimeout = function (fn, ms, ...args) {
 const id = origSetTimeout(fn, ms, ...args);
 try {
 U.cleanupManager.registerTimeout(id);
 } catch {}
 return id;
 };
 w.setInterval = function (fn, ms, ...args) {
 const id = origSetInterval(fn, ms, ...args);
 try {
 U.cleanupManager.registerInterval(id);
 } catch {}
 return id;
 };
 if (origRaf) {
 w.requestAnimationFrame = function (cb) {
 const id = origRaf(cb);
 try {
 U.cleanupManager.registerAnimationFrame(id);
 } catch {}
 return id;
 };
 }
 w.__ytp_timers_wrapped = true;
 }
 } catch (e) {
 logError('utils', 'timer wrapper failed', e);
 }
 if (!window.YouTubePlusChannelStatsHelpers) {
 window.YouTubePlusChannelStatsHelpers = {
 async fetchWithRetry(fetchFn, maxRetries = 2, logger = console) {
 let attempt = 0;
 while (attempt <= maxRetries) {
 try {
 const res = await fetchFn();
 return res;
 } catch (err) {
 attempt += 1;
 if (attempt > maxRetries) {
 logger &&
 logger.warn &&
 logger.warn('[ChannelStatsHelpers] fetch failed after retries', err);
 return null;
 }
 await new Promise(r => setTimeout(r, 300 * attempt));
 }
 }
 return null;
 },
 cacheStats(mapLike, channelId, stats) {
 try {
 if (!mapLike || typeof mapLike.set !== 'function') return;
 mapLike.set(channelId, stats);
 } catch {}
 },
 getCachedStats(mapLike, channelId, cacheDuration = 60000) {
 try {
 if (!mapLike || typeof mapLike.get !== 'function') return null;
 const s = mapLike.get(channelId);
 if (!s) return null;
 if (s.timestamp && Date.now() - s.timestamp > cacheDuration) return null;
 return s;
 } catch {
 return null;
 }
 },
 extractSubscriberCountFromPage() {
 try {
 const el =
 document.querySelector('yt-formatted-string#subscriber-count') ||
 document.querySelector('[id*="subscriber-count"]');
 if (!el) return 0;
 const txt = el.textContent || '';
 const digits = txt.replace(/[^0-9]/g, '');
 return digits ? parseInt(digits, 10) : 0;
 } catch {
 return 0;
 }
 },
 createFallbackStats(followerCount = 0) {
 return {
 followerCount: followerCount || 0,
 bottomOdos: [0, 0],
 error: true,
 timestamp: Date.now(),
 };
 },
 };
 }
 }
})();
(function () {
 'use strict';
 function isValidVideoId(id) {
 if (!id || typeof id !== 'string') return false;
 return /^[a-zA-Z0-9_-]{11}$/.test(id);
 }
 function isValidChannelId(id) {
 if (!id || typeof id !== 'string') return false;
 return /^UC[a-zA-Z0-9_-]{22}$/.test(id);
 }
 function isYouTubeUrl(url) {
 if (!url || typeof url !== 'string') return false;
 try {
 const parsed = new URL(url);
 const hostname = parsed.hostname.toLowerCase();
 return (
 hostname === 'www.youtube.com' ||
 hostname === 'youtube.com' ||
 hostname === 'm.youtube.com' ||
 hostname === 'music.youtube.com' ||
 hostname.endsWith('.youtube.com')
 );
 } catch {
 return false;
 }
 }
 function sanitizeText(text) {
 if (!text || typeof text !== 'string') return '';
 return text
 .replace(/[<>]/g, '')
 .replace(/javascript:/gi, '')
 .replace(/on\w+=/gi, '')
 .trim();
 }
 function escapeHtml(html) {
 if (!html || typeof html !== 'string') return '';
 const div = document.createElement('div');
 div.textContent = html;
 return div.innerHTML;
 }
 function createSafeHTML(html) {
 if (typeof window._ytplusCreateHTML === 'function') {
 return window._ytplusCreateHTML(html);
 }
 return html;
 }
 function setInnerHTMLSafe(element, html, sanitize = false) {
 if (!element || !(element instanceof HTMLElement)) {
 console.error('[Security] Invalid element for setInnerHTMLSafe');
 return;
 }
 const content = sanitize ? escapeHtml(html) : html;
 element.innerHTML = createSafeHTML(content);
 }
 function setTextContentSafe(element, text) {
 if (!element || !(element instanceof HTMLElement)) {
 console.error('[Security] Invalid element for setTextContentSafe');
 return;
 }
 element.textContent = text || '';
 }
 function sanitizeAttribute(attrName, attrValue) {
 if (!attrName || typeof attrName !== 'string') return null;
 if (attrValue === null || attrValue === undefined) return '';
 const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover'];
 if (dangerousAttrs.some(attr => attrName.toLowerCase().startsWith(attr))) {
 console.warn(`[Security] Blocked dangerous attribute: ${attrName}`);
 return null;
 }
 const valueStr = String(attrValue);
 if (attrName.toLowerCase() === 'href' || attrName.toLowerCase() === 'src') {
 if (valueStr.toLowerCase().startsWith('javascript:')) {
 console.warn(`[Security] Blocked javascript protocol in ${attrName}`);
 return null;
 }
 if (
 valueStr.toLowerCase().startsWith('data:') &&
 !valueStr.toLowerCase().startsWith('data:image/')
 ) {
 console.warn(`[Security] Blocked non-image data: URI in ${attrName}`);
 return null;
 }
 }
 return valueStr;
 }
 function setAttributeSafe(element, attrName, attrValue) {
 if (!element || !(element instanceof HTMLElement)) {
 console.error('[Security] Invalid element for setAttributeSafe');
 return false;
 }
 const sanitizedValue = sanitizeAttribute(attrName, attrValue);
 if (sanitizedValue === null) return false;
 try {
 element.setAttribute(attrName, sanitizedValue);
 return true;
 } catch (error) {
 console.error('[Security] setAttribute failed:', error);
 return false;
 }
 }
 function validateNumber(value, min = -Infinity, max = Infinity) {
 const num = Number(value);
 if (isNaN(num) || !isFinite(num)) return null;
 if (num < min || num > max) return null;
 return num;
 }
 class RateLimiter {
 constructor(maxRequests = 10, timeWindow = 60000) {
 this.maxRequests = maxRequests;
 this.timeWindow = timeWindow;
 this.requests = new Map();
 }
 canRequest(key) {
 const now = Date.now();
 const requests = this.requests.get(key) || [];
 const recentRequests = requests.filter(time => now - time < this.timeWindow);
 if (recentRequests.length >= this.maxRequests) {
 console.warn(
 `[Security] Rate limit exceeded for ${key}. Max ${this.maxRequests} requests per ${this.timeWindow}ms.`
 );
 return false;
 }
 recentRequests.push(now);
 this.requests.set(key, recentRequests);
 return true;
 }
 clear() {
 this.requests.clear();
 }
 }
 function fetchWithTimeout(url, options = {}, timeout = 10000) {
 return Promise.race([
 fetch(url, options),
 new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout)),
 ]);
 }
 function validateJSONSchema(data, schema) {
 if (!data || typeof data !== 'object') return false;
 if (!schema || typeof schema !== 'object') return true;
 for (const key in schema) {
 if (schema[key].required && !(key in data)) {
 console.warn(`[Security] Missing required field: ${key}`);
 return false;
 }
 if (key in data && schema[key].type && typeof data[key] !== schema[key].type) {
 console.warn(
 `[Security] Invalid type for field ${key}: expected ${schema[key].type}, got ${typeof data[key]}`
 );
 return false;
 }
 }
 return true;
 }
 if (typeof window !== 'undefined') {
 window.YouTubeSecurityUtils = {
 isValidVideoId,
 isValidChannelId,
 isYouTubeUrl,
 sanitizeText,
 escapeHtml,
 createSafeHTML,
 setInnerHTMLSafe,
 setTextContentSafe,
 sanitizeAttribute,
 setAttributeSafe,
 validateNumber,
 RateLimiter,
 fetchWithTimeout,
 validateJSONSchema,
 };
 }
})();
const YouTubeUtils = (() => {
 'use strict';
 const Security = window.YouTubePlusSecurity || {};
 const Storage = window.YouTubePlusStorage || {};
 const Performance = window.YouTubePlusPerformance || {};
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const logError = (module, message, error) => {
 console.error(`[YouTube+][${module}] ${message}:`, error);
 };
 const safeExecute =
 Security.safeExecute ||
 ((fn, context = 'Unknown') => {
 return function (...args) {
 try {
 return fn.call(this, ...args);
 } catch (error) {
 logError(context, 'Execution failed', error);
 return null;
 }
 };
 });
 const safeExecuteAsync =
 Security.safeExecuteAsync ||
 ((fn, context = 'Unknown') => {
 return async function (...args) {
 try {
 return await fn.call(this, ...args);
 } catch (error) {
 logError(context, 'Async execution failed', error);
 return null;
 }
 };
 });
 const sanitizeHTML =
 Security.sanitizeHTML ||
 (html => {
 if (typeof html !== 'string') return '';
 return html.replace(/[<>&"'\/`=]/g, '');
 });
 const isValidURL =
 Security.isValidURL ||
 (url => {
 if (typeof url !== 'string') return false;
 try {
 const parsed = new URL(url);
 return ['http:', 'https:'].includes(parsed.protocol);
 } catch {
 return false;
 }
 });
 const storage = Storage || {
 get: (key, defaultValue = null) => {
 try {
 const value = localStorage.getItem(key);
 return value ? JSON.parse(value) : defaultValue;
 } catch {
 return defaultValue;
 }
 },
 set: (key, value) => {
 try {
 localStorage.setItem(key, JSON.stringify(value));
 return true;
 } catch {
 return false;
 }
 },
 remove: key => {
 try {
 localStorage.removeItem(key);
 return true;
 } catch {
 return false;
 }
 },
 };
 const debounce =
 Performance?.debounce ||
 ((func, wait, options = {}) => {
 let timeout = null;
 const debounced = function (...args) {
 if (timeout !== null) clearTimeout(timeout);
 if (options.leading && timeout === null) {
 func.call(this, ...args);
 }
 timeout = setTimeout(() => {
 if (!options.leading) func.call(this, ...args);
 timeout = null;
 }, wait);
 };
 debounced.cancel = () => {
 if (timeout !== null) clearTimeout(timeout);
 timeout = null;
 };
 return debounced;
 });
 const throttle =
 Performance?.throttle ||
 ((func, limit) => {
 let inThrottle = false;
 return function (...args) {
 if (!inThrottle) {
 func.call(this, ...args);
 inThrottle = true;
 setTimeout(() => {
 inThrottle = false;
 }, limit);
 }
 };
 });
 const createElement = (tag, props = {}, children = []) => {
 const validTags = /^[a-z][a-z0-9-]*$/i;
 if (!validTags.test(tag)) {
 logError('createElement', 'Invalid tag name', new Error(`Tag "${tag}" is not allowed`));
 return document.createElement('div');
 }
 const element = document.createElement(tag);
 Object.entries(props).forEach(([key, value]) => {
 if (key === 'className') {
 element.className = value;
 } else if (key === 'style' && typeof value === 'object') {
 Object.assign(element.style, value);
 } else if (key.startsWith('on') && typeof value === 'function') {
 element.addEventListener(key.substring(2).toLowerCase(), value);
 } else if (key === 'dataset' && typeof value === 'object') {
 Object.assign(element.dataset, value);
 } else if (key === 'innerHTML' || key === 'outerHTML') {
 logError(
 'createElement',
 'Direct HTML injection prevented',
 new Error('Use children array instead')
 );
 } else {
 try {
 element.setAttribute(key, value);
 } catch (e) {
 logError('createElement', `Failed to set attribute ${key}`, e);
 }
 }
 });
 children.forEach(child => {
 if (typeof child === 'string') {
 element.appendChild(document.createTextNode(child));
 } else if (child instanceof Node) {
 element.appendChild(child);
 }
 });
 return element;
 };
 const selectorCache = new Map();
 const CACHE_MAX_SIZE = 100;
 const CACHE_MAX_AGE = 10000;
 const querySelector = (selector, nocache = false) => {
 if (nocache) return document.querySelector(selector);
 const now = Date.now();
 const cached = selectorCache.get(selector);
 if (cached?.element?.isConnected && now - cached.timestamp < CACHE_MAX_AGE) {
 return cached.element;
 }
 if (cached) {
 selectorCache.delete(selector);
 }
 const element = document.querySelector(selector);
 if (element) {
 if (selectorCache.size >= CACHE_MAX_SIZE) {
 const firstKey = selectorCache.keys().next().value;
 selectorCache.delete(firstKey);
 }
 selectorCache.set(selector, { element, timestamp: now });
 }
 return element;
 };
 const validateWaitParams = (selector, parent) => {
 if (!selector || typeof selector !== 'string') {
 return new Error('Selector must be a non-empty string');
 }
 if (!parent || !(parent instanceof Element)) {
 return new Error('Parent must be a valid DOM element');
 }
 return null;
 };
 const tryQuerySelector = (parent, selector) => {
 try {
 const element = parent.querySelector(selector);
 return { element, error: null };
 } catch {
 return { element: null, error: new Error(`Invalid selector: ${selector}`) };
 }
 };
 const cleanupWaitResources = (observer, timeoutId, controller) => {
 controller.abort();
 if (observer) {
 try {
 observer.disconnect();
 } catch (e) {
 logError('waitForElement', 'Observer disconnect failed', e);
 }
 }
 clearTimeout(timeoutId);
 };
 const createWaitObserver = (parent, selector, resolve, timeoutId) => {
 return new MutationObserver(() => {
 try {
 const element = parent.querySelector(selector);
 if (element) {
 clearTimeout(timeoutId);
 resolve( ( (element)));
 }
 } catch (e) {
 logError('waitForElement', 'Observer callback error', e);
 }
 });
 };
 const startWaitObservation = (observer, parent) => {
 try {
 if (!(parent instanceof Element) && parent !== document) {
 throw new Error('Parent does not support observation');
 }
 observer.observe(parent, { childList: true, subtree: true });
 return null;
 } catch {
 try {
 observer.observe(parent, { childList: true, subtree: true });
 return null;
 } catch {
 return new Error('Failed to observe DOM');
 }
 }
 };
 const waitForElement = (selector, timeout = 5000, parent = document.body) => {
 return new Promise((resolve, reject) => {
 const validationError = validateWaitParams(selector, parent);
 if (validationError) {
 reject(validationError);
 return;
 }
 const { element, error } = tryQuerySelector(parent, selector);
 if (error) {
 reject(error);
 return;
 }
 if (element) {
 resolve( ( (element)));
 return;
 }
 const controller = new AbortController();
 let observer = null;
 const timeoutId = setTimeout(() => {
 cleanupWaitResources(observer, timeoutId, controller);
 reject(new Error(`Element ${selector} not found within ${timeout}ms`));
 }, timeout);
 observer = createWaitObserver(parent, selector, resolve, timeoutId);
 const observeError = startWaitObservation(observer, parent);
 if (observeError) {
 clearTimeout(timeoutId);
 reject(observeError);
 }
 });
 };
 const cleanupManager = {
 observers: new Set(),
 listeners: new Map(),
 intervals: new Set(),
 timeouts: new Set(),
 animationFrames: new Set(),
 cleanupFunctions: new Set(),
 register: fn => {
 if (typeof fn === 'function') {
 cleanupManager.cleanupFunctions.add(fn);
 }
 return fn;
 },
 unregister: fn => {
 cleanupManager.cleanupFunctions.delete(fn);
 },
 registerObserver: observer => {
 cleanupManager.observers.add(observer);
 return observer;
 },
 unregisterObserver: observer => {
 if (observer) {
 try {
 observer.disconnect();
 } catch (e) {
 logError('Cleanup', 'Observer disconnect failed', e);
 }
 cleanupManager.observers.delete(observer);
 }
 },
 registerListener: (element, event, handler, options) => {
 const key = Symbol('listener');
 cleanupManager.listeners.set(key, { element, event, handler, options });
 try {
 element.addEventListener(event, (handler), options);
 } catch {
 }
 return key;
 },
 unregisterListener: key => {
 const listener = cleanupManager.listeners.get(key);
 if (listener) {
 const { element, event, handler, options } = listener;
 try {
 element.removeEventListener(event, handler, options);
 } catch (e) {
 logError('Cleanup', 'Listener removal failed', e);
 }
 cleanupManager.listeners.delete(key);
 }
 },
 registerInterval: id => {
 cleanupManager.intervals.add(id);
 return id;
 },
 unregisterInterval: id => {
 clearInterval(id);
 cleanupManager.intervals.delete(id);
 },
 registerTimeout: id => {
 cleanupManager.timeouts.add(id);
 return id;
 },
 unregisterTimeout: id => {
 clearTimeout(id);
 cleanupManager.timeouts.delete(id);
 },
 registerAnimationFrame: id => {
 cleanupManager.animationFrames.add(id);
 return id;
 },
 unregisterAnimationFrame: id => {
 cancelAnimationFrame(id);
 cleanupManager.animationFrames.delete(id);
 },
 cleanup: () => {
 cleanupManager.cleanupFunctions.forEach(fn => {
 try {
 fn();
 } catch (e) {
 logError('Cleanup', 'Cleanup function failed', e);
 }
 });
 cleanupManager.cleanupFunctions.clear();
 cleanupManager.observers.forEach(obs => {
 try {
 obs.disconnect();
 } catch (e) {
 logError('Cleanup', 'Observer disconnect failed', e);
 }
 });
 cleanupManager.observers.clear();
 cleanupManager.listeners.forEach(({ element, event, handler, options }) => {
 try {
 element.removeEventListener(event, handler, options);
 } catch (e) {
 logError('Cleanup', 'Listener removal failed', e);
 }
 });
 cleanupManager.listeners.clear();
 cleanupManager.intervals.forEach(id => clearInterval(id));
 cleanupManager.intervals.clear();
 cleanupManager.timeouts.forEach(id => clearTimeout(id));
 cleanupManager.timeouts.clear();
 cleanupManager.animationFrames.forEach(id => cancelAnimationFrame(id));
 cleanupManager.animationFrames.clear();
 },
 };
 const SettingsManager = {
 storageKey: 'youtube_plus_all_settings_v2',
 defaults: {
 speedControl: { enabled: true, currentSpeed: 1 },
 screenshot: { enabled: true },
 download: { enabled: true },
 updateChecker: { enabled: true },
 adBlocker: { enabled: true },
 pip: { enabled: true },
 timecodes: { enabled: true },
 },
 load() {
 const saved = storage.get(this.storageKey);
 return saved ? { ...this.defaults, ...saved } : { ...this.defaults };
 },
 save(settings) {
 storage.set(this.storageKey, settings);
 window.dispatchEvent(
 new CustomEvent('youtube-plus-settings-changed', {
 detail: settings,
 })
 );
 },
 get(path) {
 const settings = this.load();
 return path.split('.').reduce((obj, key) => (obj)?.[key], settings);
 },
 set(path, value) {
 const settings = this.load();
 const keys = path.split('.');
 const last = keys.pop();
 const target = keys.reduce((obj, key) => {
 (obj)[key] = (obj)[key] || {};
 return (obj)[key];
 }, settings);
 (target)[ (last)] = value;
 this.save(settings);
 },
 };
 const StyleManager = {
 styles: new Map(),
 element: null,
 add(id, css) {
 if (typeof id !== 'string' || !id) {
 logError('StyleManager', 'Invalid style ID', new Error('ID must be a non-empty string'));
 return;
 }
 if (typeof css !== 'string') {
 logError('StyleManager', 'Invalid CSS', new Error('CSS must be a string'));
 return;
 }
 this.styles.set(id, css);
 this.update();
 },
 remove(id) {
 this.styles.delete(id);
 this.update();
 },
 update() {
 try {
 if (!this.element) {
 this.element = document.createElement('style');
 this.element.id = 'youtube-plus-styles';
 this.element.type = 'text/css';
 (document.head || document.documentElement).appendChild(this.element);
 }
 this.element.textContent = Array.from(this.styles.values()).join('\n');
 } catch (error) {
 logError('StyleManager', 'Failed to update styles', error);
 }
 },
 clear() {
 this.styles.clear();
 if (this.element) {
 try {
 this.element.remove();
 } catch (e) {
 logError('StyleManager', 'Failed to remove style element', e);
 }
 this.element = null;
 }
 },
 };
 const NotificationManager = {
 queue: [],
 activeNotifications: new Set(),
 maxVisible: 3,
 defaultDuration: 3000,
 show(message, options = {}) {
 if (!message || typeof message !== 'string') {
 logError(
 'NotificationManager',
 'Invalid message',
 new Error('Message must be a non-empty string')
 );
 return null;
 }
 const {
 duration = this.defaultDuration,
 position = null,
 action = null,
 } = options;
 this.activeNotifications.forEach(notif => {
 if (notif.dataset.message === message) {
 this.remove(notif);
 }
 });
 const positions = {
 'top-right': { top: '20px', right: '20px' },
 'top-left': { top: '20px', left: '20px' },
 'bottom-right': { bottom: '20px', right: '20px' },
 'bottom-left': { bottom: '20px', left: '20px' },
 };
 try {
 const notification = createElement('div', {
 className: 'youtube-enhancer-notification',
 dataset: { message },
 style: {
 zIndex: '10001',
 width: 'auto',
 display: 'flex',
 alignItems: 'center',
 gap: '10px',
 ...(position && (positions)[position]
 ? (positions)[position]
 : {}),
 },
 });
 notification.setAttribute('role', 'status');
 notification.setAttribute('aria-live', 'polite');
 notification.setAttribute('aria-atomic', 'true');
 const messageSpan = createElement(
 'span',
 {
 style: { flex: '1' },
 },
 [message]
 );
 notification.appendChild(messageSpan);
 if (action && action.text && typeof action.callback === 'function') {
 const actionBtn = createElement(
 'button',
 {
 style: {
 background: 'rgba(255,255,255,0.2)',
 border: '1px solid rgba(255,255,255,0.3)',
 color: 'white',
 padding: '4px 12px',
 borderRadius: '4px',
 cursor: 'pointer',
 fontSize: '12px',
 fontWeight: '600',
 transition: 'background 0.2s',
 },
 onClick: () => {
 action.callback();
 this.remove(notification);
 },
 },
 [action.text]
 );
 notification.appendChild(actionBtn);
 }
 const _notifContainerId = 'youtube-enhancer-notification-container';
 let _notifContainer = document.getElementById(_notifContainerId);
 if (!_notifContainer) {
 _notifContainer = createElement('div', {
 id: _notifContainerId,
 className: 'youtube-enhancer-notification-container',
 });
 try {
 document.body.appendChild(_notifContainer);
 } catch {
 document.body.appendChild(notification);
 this.activeNotifications.add(notification);
 }
 }
 try {
 _notifContainer.insertBefore(notification, _notifContainer.firstChild);
 } catch {
 document.body.appendChild(notification);
 }
 try {
 notification.style.pointerEvents = 'auto';
 } catch {}
 this.activeNotifications.add(notification);
 try {
 notification.style.animation = 'slideInFromBottom 0.38s ease-out forwards';
 } catch {}
 if (duration > 0) {
 const timeoutId = setTimeout(() => this.remove(notification), duration);
 cleanupManager.registerTimeout(timeoutId);
 }
 if (this.activeNotifications.size > this.maxVisible) {
 const oldest = Array.from(this.activeNotifications)[0];
 this.remove(oldest);
 }
 return notification;
 } catch (error) {
 logError('NotificationManager', 'Failed to show notification', error);
 return null;
 }
 },
 remove(notification) {
 if (!notification || !notification.isConnected) return;
 try {
 try {
 notification.style.animation = 'slideOutToBottom 0.32s ease-in forwards';
 const timeoutId = setTimeout(() => {
 try {
 notification.remove();
 this.activeNotifications.delete(notification);
 } catch (e) {
 logError('NotificationManager', 'Failed to remove notification', e);
 }
 }, 340);
 cleanupManager.registerTimeout(timeoutId);
 } catch {
 try {
 notification.remove();
 this.activeNotifications.delete(notification);
 } catch (e) {
 logError('NotificationManager', 'Failed to remove notification (fallback)', e);
 }
 }
 } catch (error) {
 logError('NotificationManager', 'Failed to animate notification removal', error);
 notification.remove();
 this.activeNotifications.delete(notification);
 }
 },
 clearAll() {
 this.activeNotifications.forEach(notif => {
 try {
 notif.remove();
 } catch (e) {
 logError('NotificationManager', 'Failed to clear notification', e);
 }
 });
 this.activeNotifications.clear();
 },
 };
 StyleManager.add(
 'notification-animations',
 `
 @keyframes slideInFromBottom {
 from { transform: translateY(100%); opacity: 0; }
 to { transform: translateY(0); opacity: 1; }
 }
 @keyframes slideOutToBottom {
 from { transform: translateY(0); opacity: 1; }
 to { transform: translateY(100%); opacity: 0; }
 }
 `
 );
 window.addEventListener('beforeunload', () => {
 cleanupManager.cleanup();
 selectorCache.clear();
 StyleManager.clear();
 NotificationManager.clearAll();
 });
 const cacheCleanup = () => {
 const now = Date.now();
 for (const [key, value] of selectorCache.entries()) {
 if (!value.element?.isConnected || now - value.timestamp > CACHE_MAX_AGE) {
 selectorCache.delete(key);
 }
 }
 };
 const cacheCleanupInterval = setInterval(() => {
 if (typeof requestIdleCallback === 'function') {
 requestIdleCallback(cacheCleanup, { timeout: 2000 });
 } else {
 cacheCleanup();
 }
 }, 30000);
 cleanupManager.registerInterval(cacheCleanupInterval);
 window.addEventListener('unhandledrejection', event => {
 logError('Global', 'Unhandled promise rejection', event.reason);
 event.preventDefault();
 });
 window.addEventListener('error', event => {
 if (event.filename && event.filename.includes('youtube')) {
 logError(
 'Global',
 'Uncaught error',
 new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`)
 );
 }
 });
 const measurePerformance = (label, fn) => {
 return function (...args) {
 const start = performance.now();
 try {
 const result = fn.apply(this, args);
 const duration = performance.now() - start;
 if (duration > 100) {
 console.warn(`[YouTube+][Performance] ${label} took ${duration.toFixed(2)}ms`);
 }
 return result;
 } catch (error) {
 logError('Performance', `${label} failed`, error);
 throw error;
 }
 };
 };
 const measurePerformanceAsync = (label, fn) => {
 return async function (...args) {
 const start = performance.now();
 try {
 const result = await fn.apply(this, args);
 const duration = performance.now() - start;
 if (duration > 100) {
 console.warn(`[YouTube+][Performance] ${label} took ${duration.toFixed(2)}ms`);
 }
 return result;
 } catch (error) {
 logError('Performance', `${label} failed`, error);
 throw error;
 }
 };
 };
 const isMobile = () => {
 return (
 /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
 window.innerWidth <= 768
 );
 };
 const getViewport = () => ({
 width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
 height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
 });
 const retryAsync = async (fn, retries = 3, delay = 1000) => {
 for (let i = 0; i < retries; i++) {
 try {
 return await fn();
 } catch (error) {
 if (i === retries - 1) throw error;
 await new Promise(resolve => {
 setTimeout(resolve, delay * (i + 1));
 });
 }
 }
 };
 return {
 logError,
 safeExecute,
 safeExecuteAsync,
 sanitizeHTML,
 isValidURL,
 storage,
 debounce,
 throttle,
 createElement,
 querySelector,
 waitForElement,
 cleanupManager,
 SettingsManager,
 StyleManager,
 NotificationManager,
 clearCache: () => selectorCache.clear(),
 isMobile,
 getViewport,
 retryAsync,
 measurePerformance,
 measurePerformanceAsync,
 t,
 };
})();
if (typeof window !== 'undefined') {
 (window).YouTubeUtils = (window).YouTubeUtils || {};
 const existing = (window).YouTubeUtils;
 try {
 for (const k of Object.keys(YouTubeUtils)) {
 if (existing[k] === undefined) existing[k] = YouTubeUtils[k];
 }
 } catch {}
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+ v2.3.3] Core utilities merged');
 (window).YouTubePlusDebug = {
 version: '2.3.3',
 cacheSize: () =>
 YouTubeUtils.cleanupManager.observers.size +
 YouTubeUtils.cleanupManager.listeners.size +
 YouTubeUtils.cleanupManager.intervals.size,
 clearAll: () => {
 YouTubeUtils.cleanupManager.cleanup();
 YouTubeUtils.clearCache();
 YouTubeUtils.StyleManager.clear();
 YouTubeUtils.NotificationManager.clearAll();
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+] All resources cleared');
 },
 stats: () => ({
 observers: YouTubeUtils.cleanupManager.observers.size,
 listeners: YouTubeUtils.cleanupManager.listeners.size,
 intervals: YouTubeUtils.cleanupManager.intervals.size,
 timeouts: YouTubeUtils.cleanupManager.timeouts.size,
 animationFrames: YouTubeUtils.cleanupManager.animationFrames.size,
 styles: YouTubeUtils.StyleManager.styles.size,
 notifications: YouTubeUtils.NotificationManager.activeNotifications.size,
 }),
 };
 if (!sessionStorage.getItem('youtube_plus_started')) {
 sessionStorage.setItem('youtube_plus_started', 'true');
 setTimeout(() => {
 if (YouTubeUtils.NotificationManager) {
 YouTubeUtils.NotificationManager.show('YouTube+ v2.3.3 loaded', {
 type: 'success',
 duration: 2000,
 position: 'bottom-right',
 });
 }
 }, 1000);
 }
}
(function () {
 'use strict';
 const { t } = YouTubeUtils;
 const YouTubeEnhancer = {
 speedControl: {
 currentSpeed: 1,
 activeAnimationId: null,
 storageKey: 'youtube_playback_speed',
 },
 _initialized: false,
 settings: {
 enableSpeedControl: true,
 enableScreenshot: true,
 enableDownload: true,
 downloadSites: {
 direct: true,
 y2mate: true,
 ytdl: true,
 },
 downloadSiteCustomization: {
 y2mate:
 typeof window !== 'undefined' && window.YouTubePlusConstants
 ? window.YouTubePlusConstants.DOWNLOAD_SITES.Y2MATE
 : { name: 'Y2Mate', url: 'https://www.y2mate.com/youtube/{videoId}' },
 },
 storageKey: 'youtube_plus_settings',
 hideSideGuide: false,
 },
 _cache: new Map(),
 getElement(selector, useCache = true) {
 if (useCache && this._cache.has(selector)) {
 const element = this._cache.get(selector);
 if (element?.isConnected) return element;
 this._cache.delete(selector);
 }
 const element = document.querySelector(selector);
 if (element && useCache) this._cache.set(selector, element);
 return element;
 },
 loadSettings() {
 try {
 const saved = localStorage.getItem(this.settings.storageKey);
 if (saved) {
 const parsed = JSON.parse(saved);
 if (window.YouTubeUtils && window.YouTubeUtils.safeMerge) {
 window.YouTubeUtils.safeMerge(this.settings, parsed);
 } else {
 for (const key in parsed) {
 if (
 Object.prototype.hasOwnProperty.call(parsed, key) &&
 !['__proto__', 'constructor', 'prototype'].includes(key)
 ) {
 this.settings[key] = parsed[key];
 }
 }
 }
 return;
 }
 try {
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 YouTubeUtils.SettingsManager
 ) {
 const globalSettings = YouTubeUtils.SettingsManager.load();
 if (!globalSettings) return;
 const sc = globalSettings.speedControl;
 if (sc && typeof sc.enabled === 'boolean') {
 this.settings.enableSpeedControl = sc.enabled;
 }
 const ss = globalSettings.screenshot;
 if (ss && typeof ss.enabled === 'boolean') this.settings.enableScreenshot = ss.enabled;
 const dl = globalSettings.download;
 if (dl && typeof dl.enabled === 'boolean') this.settings.enableDownload = dl.enabled;
 if (globalSettings.downloadSites && typeof globalSettings.downloadSites === 'object') {
 this.settings.downloadSites = {
 ...(this.settings.downloadSites || {}),
 ...globalSettings.downloadSites,
 };
 }
 }
 } catch {
 }
 } catch (e) {
 console.error('Error loading settings:', e);
 }
 },
 init() {
 if (this._initialized) {
 return;
 }
 this._initialized = true;
 try {
 this.loadSettings();
 } catch (error) {
 console.warn('[YouTube+][Basic]', 'Failed to load settings during init:', error);
 }
 this.insertStyles();
 this.addSettingsButtonToHeader();
 this.setupNavigationObserver();
 if (location.href.includes('watch?v=')) {
 this.setupCurrentPage();
 }
 document.addEventListener('visibilitychange', () => {
 if (!document.hidden && location.href.includes('watch?v=')) {
 this.setupCurrentPage();
 }
 });
 try {
 const screenshotKeyHandler = e => {
 if (!e || !e.key) return;
 if (!(e.key === 's' || e.key === 'S')) return;
 if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
 const active = document.activeElement;
 if (active) {
 const tag = (active.tagName || '').toLowerCase();
 if (
 tag === 'input' ||
 tag === 'textarea' ||
 tag === 'select' ||
 active.isContentEditable
 ) {
 return;
 }
 }
 if (!this.settings.enableScreenshot) return;
 try {
 this.captureFrame();
 } catch (err) {
 if (YouTubeUtils && YouTubeUtils.logError) {
 YouTubeUtils.logError('Basic', 'Keyboard screenshot failed', err);
 }
 }
 };
 YouTubeUtils.cleanupManager.registerListener(
 document,
 'keydown',
 screenshotKeyHandler,
 true
 );
 } catch (e) {
 if (YouTubeUtils && YouTubeUtils.logError) {
 YouTubeUtils.logError('Basic', 'Failed to register screenshot keyboard shortcut', e);
 }
 }
 },
 saveSettings() {
 localStorage.setItem(this.settings.storageKey, JSON.stringify(this.settings));
 this.updatePageBasedOnSettings();
 this.refreshDownloadButton();
 },
 updatePageBasedOnSettings() {
 const settingsMap = {
 'ytp-screenshot-button': 'enableScreenshot',
 'ytp-download-button': 'enableDownload',
 'speed-control-btn': 'enableSpeedControl',
 };
 Object.entries(settingsMap).forEach(([className, setting]) => {
 const button = this.getElement(`.${className}`, false);
 if (button) button.style.display = this.settings[setting] ? '' : 'none';
 });
 const speedOptions = document.querySelector('.speed-options');
 if (speedOptions) {
 speedOptions.style.display = this.settings.enableSpeedControl ? '' : 'none';
 }
 },
 refreshDownloadButton() {
 if (typeof window !== 'undefined' && window.YouTubePlusDownloadButton) {
 const manager = window.YouTubePlusDownloadButton.createDownloadButtonManager({
 settings: this.settings,
 t,
 getElement: this.getElement.bind(this),
 YouTubeUtils,
 });
 manager.refreshDownloadButton();
 }
 },
 setupCurrentPage() {
 this.waitForElement('#player-container-outer .html5-video-player, .ytp-right-controls', 5000)
 .then(() => {
 this.addCustomButtons();
 this.setupVideoObserver();
 this.applyCurrentSpeed();
 this.updatePageBasedOnSettings();
 this.refreshDownloadButton();
 })
 .catch(() => {});
 },
 insertStyles() {
 const styles = `:root{--yt-accent:#ff0000;--yt-accent-hover:#cc0000;--yt-radius-sm:6px;--yt-radius-md:10px;--yt-radius-lg:16px;--yt-transition:all .2s ease;--yt-space-xs:4px;--yt-space-sm:8px; --yt-space-md:16px;--yt-space-lg:24px;--yt-glass-blur:blur(18px) saturate(180%);--yt-glass-blur-light:blur(12px) saturate(160%);--yt-glass-blur-heavy:blur(24px) saturate(200%);}
 html[dark],html:not([dark]):not([light]){--yt-bg-primary:rgba(15,15,15,.85);--yt-bg-secondary:rgba(28,28,28,.85);--yt-bg-tertiary:rgba(34,34,34,.85);--yt-text-primary:#fff;--yt-text-secondary:#aaa;--yt-border-color:rgba(255,255,255,.2);--yt-hover-bg:rgba(255,255,255,.1);--yt-shadow:0 4px 12px rgba(0,0,0,.25);--yt-glass-bg:rgba(255,255,255,.1);--yt-glass-border:rgba(255,255,255,.2);--yt-glass-shadow:0 8px 32px rgba(0,0,0,.2);--yt-modal-bg:rgba(0,0,0,.75);--yt-notification-bg:rgba(28,28,28,.9);--yt-panel-bg:rgba(34,34,34,.3);--yt-header-bg:rgba(20,20,20,.6);--yt-input-bg:rgba(255,255,255,.1);--yt-button-bg:rgba(255,255,255,.2);--yt-text-stroke:white;}
 html[light]{--yt-bg-primary:rgba(255,255,255,.85);--yt-bg-secondary:rgba(248,248,248,.85);--yt-bg-tertiary:rgba(240,240,240,.85);--yt-text-primary:#030303;--yt-text-secondary:#606060;--yt-border-color:rgba(0,0,0,.2);--yt-hover-bg:rgba(0,0,0,.05);--yt-shadow:0 4px 12px rgba(0,0,0,.15);--yt-glass-bg:rgba(255,255,255,.7);--yt-glass-border:rgba(0,0,0,.1);--yt-glass-shadow:0 8px 32px rgba(0,0,0,.1);--yt-modal-bg:rgba(0,0,0,.5);--yt-notification-bg:rgba(255,255,255,.95);--yt-panel-bg:rgba(255,255,255,.7);--yt-header-bg:rgba(248,248,248,.8);--yt-input-bg:rgba(0,0,0,.05);--yt-button-bg:rgba(0,0,0,.1);--yt-text-stroke:#030303;}
 .ytp-screenshot-button,.ytp-cobalt-button,.ytp-pip-button{position:relative;width:44px;height:100%;display:inline-flex;align-items:center;justify-content:center;vertical-align:top;transition:opacity .15s,transform .15s;}
 .ytp-screenshot-button:hover,.ytp-cobalt-button:hover,.ytp-pip-button:hover{transform:scale(1.1);}
 .speed-control-btn{width:4em!important;position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;height:100%!important;vertical-align:top!important;text-align:center!important;border-radius:var(--yt-radius-sm);font-size:13px;color:var(--yt-text-primary);cursor:pointer;user-select:none;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;transition:color .2s;}
 .speed-control-btn:hover{color:var(--yt-accent);font-weight:bold;}
 .speed-options{position:fixed!important;background:var(--yt-glass-bg)!important;color:var(--yt-text-primary)!important;border-radius:var(--yt-radius-md)!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;transform:translate(-50%,12px)!important;width:92px!important;z-index:2147483647!important;box-shadow:var(--yt-glass-shadow);border:1px solid var(--yt-glass-border);overflow:hidden;backdrop-filter:var(--yt-glass-blur);-webkit-backdrop-filter:var(--yt-glass-blur);opacity:0;pointer-events:none!important;transition:opacity .18s ease,transform .18s ease;box-sizing:border-box;}
 .speed-options.visible{opacity:1;pointer-events:auto!important;transform:translate(-50%,0)!important;}
 .speed-option-item{cursor:pointer!important;height:28px!important;line-height:28px!important;font-size:12px!important;text-align:center!important;transition:background-color .15s,color .15s;}
 .speed-option-active,.speed-option-item:hover{color:var(--yt-accent)!important;font-weight:bold!important;background:var(--yt-hover-bg)!important;}
 #speed-indicator{position:absolute!important;margin:auto!important;top:0!important;right:0!important;bottom:0!important;left:0!important;border-radius:24px!important;font-size:30px!important;background:var(--yt-glass-bg)!important;color:var(--yt-text-primary)!important;z-index:99999!important;width:80px!important;height:80px!important;line-height:80px!important;text-align:center!important;display:none;box-shadow:var(--yt-glass-shadow);backdrop-filter:var(--yt-glass-blur);-webkit-backdrop-filter:var(--yt-glass-blur);border:1px solid var(--yt-glass-border);}
 .youtube-enhancer-notification-container{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;z-index:2147483647;pointer-events:none;max-width:calc(100% - 32px);width:100%;box-sizing:border-box;padding:0 16px;}
 .youtube-enhancer-notification{position:relative;max-width:700px;width:auto;background:var(--yt-glass-bg);color:var(--yt-text-primary);padding:8px 14px;font-size:13px;border-radius:var(--yt-radius-md);z-index:inherit;transition:opacity .35s,transform .32s;box-shadow:var(--yt-glass-shadow);border:1px solid var(--yt-glass-border);backdrop-filter:var(--yt-glass-blur); -webkit-backdrop-filter:var(--yt-glass-blur);font-weight:500;box-sizing:border-box;display:flex;align-items:center;gap:10px;pointer-events:auto;}
 .ytp-plus-settings-button{background:transparent;border:none;color:var(--yt-text-secondary);cursor:pointer;padding:var(--yt-space-sm);margin-right:var(--yt-space-sm);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color .2s,transform .2s;}
 .ytp-plus-settings-button svg{width:24px;height:24px;}
 .ytp-plus-settings-button:hover{background:var(--yt-hover-bg);transform:rotate(30deg);color:var(--yt-text-secondary);}
 .ytp-plus-settings-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:100000;backdrop-filter:blur(8px) saturate(140%);-webkit-backdrop-filter:blur(8px) saturate(140%);animation:ytEnhanceFadeIn .25s ease-out;}
 .ytp-plus-settings-panel{background:var(--yt-glass-bg);color:var(--yt-text-primary);border-radius:20px;width:760px;max-width:94%;max-height:60vh;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.45);animation:ytEnhanceScaleIn .28s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1.5px solid var(--yt-glass-border);will-change:transform,opacity;display:flex;flex-direction:row}
 .ytp-plus-settings-sidebar{width:240px;background:var(--yt-header-bg);border-right:1px solid var(--yt-glass-border);display:flex;flex-direction:column;backdrop-filter:var(--yt-glass-blur-light);-webkit-backdrop-filter:var(--yt-glass-blur-light);}
 .ytp-plus-settings-sidebar-header{padding:var(--yt-space-md) var(--yt-space-lg);border-bottom:1px solid var(--yt-glass-border);display:flex;justify-content:space-between;align-items:center;}
 .ytp-plus-settings-title{font-size:18px;font-weight:500;margin:0;color:var(--yt-text-primary);}
 .ytp-plus-settings-sidebar-close{padding:var(--yt-space-md) var(--yt-space-lg);display:flex;justify-content:flex-end;background:transparent;}
 .ytp-plus-settings-close{background:none;border:none;cursor:pointer;padding:var(--yt-space-sm);margin:-8px;color:var(--yt-text-primary);transition:color .2s,transform .2s;}
 .ytp-plus-settings-close:hover{color:var(--yt-accent);transform:scale(1.25) rotate(90deg);}
 .ytp-plus-settings-nav{flex:1;padding:var(--yt-space-md) 0;}
 .ytp-plus-settings-nav-item{display:flex;align-items:center;padding:12px var(--yt-space-lg);cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);font-size:14px;border-left:3px solid transparent;color:var(--yt-text-primary);}
 .ytp-plus-settings-nav-item:hover{background:var(--yt-hover-bg);}
 .ytp-plus-settings-nav-item.active{background:rgba(255,0,0,.1);border-left-color:var(--yt-accent);color:var(--yt-accent);font-weight:500;}
 .ytp-plus-settings-nav-item svg{width:18px;height:18px;margin-right:12px;opacity:.8;transition:opacity .2s,transform .2s;}
 .ytp-plus-settings-nav-item.active svg{opacity:1;transform:scale(1.1);}
 .ytp-plus-settings-nav-item:hover svg{transform:scale(1.05);}
 .ytp-plus-settings-main{flex:1;display:flex;flex-direction:column;overflow-y:auto;}
 .ytp-plus-settings-header{padding:var(--yt-space-md) var(--yt-space-lg);border-bottom:1px solid var(--yt-glass-border);background:var(--yt-header-bg);backdrop-filter:var(--yt-glass-blur-light);-webkit-backdrop-filter:var(--yt-glass-blur-light);}
 .ytp-plus-settings-content{flex:1;padding:var(--yt-space-md) var(--yt-space-lg);overflow-y:auto;}
 .ytp-plus-settings-section{margin-bottom:var(--yt-space-lg);}
 .ytp-plus-settings-section-title{font-size:16px;font-weight:500;margin-bottom:var(--yt-space-md);color:var(--yt-text-primary);}
 .ytp-plus-settings-section.hidden{display:none;}
 .ytp-plus-settings-item{display:flex;align-items:center;margin-bottom:var(--yt-space-md);padding:14px 18px;background:transparent;transition:all .25s cubic-bezier(.4,0,.2,1);border-radius:var(--yt-radius-md);}
 .ytp-plus-settings-item:hover{background:var(--yt-hover-bg);transform:translateX(6px);box-shadow:0 2px 8px rgba(0,0,0,.1);}
 .ytp-plus-settings-item-label{flex:1;font-size:14px;color:var(--yt-text-primary);}
 .ytp-plus-settings-item-description{font-size:12px;color:var(--yt-text-secondary);margin-top:4px;}
 .ytp-plus-settings-checkbox{appearance:none;-webkit-appearance:none;-moz-appearance:none;width:15px;height:15px;margin-left:auto;border:1px solid var(--yt-glass-border);border-radius:50%;background:transparent;display:inline-flex;align-items:center;justify-content:center;transition:all 250ms cubic-bezier(.4,0,.23,1);cursor:pointer;position:relative;flex-shrink:0;color:#fff;}
 html:not([dark]) .ytp-plus-settings-checkbox{border-color:rgba(0,0,0,.25);color:#222;}
 .ytp-plus-settings-checkbox:focus-visible{outline:2px solid var(--yt-accent);outline-offset:2px;}
 .ytp-plus-settings-checkbox:hover{background:var(--yt-hover-bg);transform:scale(1.1);}
 .ytp-plus-settings-checkbox::before{content:"";width:4px;height:2px;background:var(--yt-text-primary);position:absolute;transform:rotate(45deg);top:4px;left:3px;transition:width 100ms ease 50ms,opacity 50ms;transform-origin:0% 0%;opacity:0;}
 .ytp-plus-settings-checkbox::after{content:"";width:0;height:2px;background:var(--yt-text-primary);position:absolute;transform:rotate(305deg);top:9px;left:6px;transition:width 100ms ease,opacity 50ms;transform-origin:0% 0%;opacity:0;}
 .ytp-plus-settings-checkbox:checked{transform:rotate(0deg) scale(1.2);}
 .ytp-plus-settings-checkbox:checked::before{width:8px;opacity:1;background:#fff;transition:width 150ms ease 100ms,opacity 150ms ease 100ms;}
 .ytp-plus-settings-checkbox:checked::after{width:15px;opacity:1;background:#fff;transition:width 150ms ease 250ms,opacity 150ms ease 250ms;}
 .ytp-plus-footer{padding:var(--yt-space-md) var(--yt-space-lg);border-top:1px solid var(--yt-glass-border);display:flex;justify-content:flex-end;background:transparent;}
 .ytp-plus-button{padding:var(--yt-space-sm) var(--yt-space-md);border-radius:18px;border:none;font-size:14px;font-weight:500;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);}
 .ytp-plus-button-primary{background:transparent;border:1px solid var(--yt-glass-border);color:var(--yt-text-primary);}
 .ytp-plus-button-primary:hover{background:var(--yt-accent);color:#fff;box-shadow:0 6px 16px rgba(255,0,0,.35);transform:translateY(-2px);}
 .app-icon{fill:var(--yt-text-primary);stroke:var(--yt-text-primary);transition:all .3s;}
 @keyframes ytEnhanceFadeIn{from{opacity:0;}to{opacity:1;}}
 @keyframes ytEnhanceScaleIn{from{opacity:0;transform:scale(.92) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);}}
 @media(max-width:768px){.ytp-plus-settings-panel{width:95%;max-height:80vh;flex-direction:column;}
 .ytp-plus-settings-sidebar{width:100%;max-height:120px;flex-direction:row;overflow-x:auto;}
 .ytp-plus-settings-nav{display:flex;flex-direction:row;padding:0;}
 .ytp-plus-settings-nav-item{white-space:nowrap;border-left:none;border-bottom:3px solid transparent;}
 .ytp-plus-settings-nav-item.active{border-left:none;border-bottom-color:var(--yt-accent);}
 .ytp-plus-settings-item{padding:10px 12px;}}
 .ytp-plus-settings-section h1{margin:-95px 90px 8px;font-family:'Montserrat',sans-serif;font-size:52px;font-weight:600;color:transparent;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:var(--yt-text-stroke);cursor:pointer;transition:color .2s;}
 .ytp-plus-settings-section h1:hover{color:var(--yt-accent);-webkit-text-stroke-width:1px;-webkit-text-stroke-color:transparent;}
 .download-options{position:fixed;background:var(--yt-glass-bg);color:var(--yt-text-primary);border-radius:var(--yt-radius-md);width:150px;z-index:2147483647;box-shadow:var(--yt-glass-shadow);border:1px solid var(--yt-glass-border);overflow:hidden;backdrop-filter:var(--yt-glass-blur);-webkit-backdrop-filter:var(--yt-glass-blur);opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease;transform:translateY(8px);box-sizing:border-box;}
 .download-options.visible{opacity:1;pointer-events:auto;transform:translateY(0);}
 .download-options-list{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;}
 .download-option-item{cursor:pointer;padding:12px;text-align:center;transition:background .2s,color .2s;width:100%;}
 .download-option-item:hover{background:var(--yt-hover-bg);color:var(--yt-accent);}
 .ytp-download-button{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;height:100%!important;vertical-align:top!important;padding:0 10px!important;cursor:pointer!important;}
 .glass-panel{background:var(--yt-glass-bg);border:1px solid var(--yt-glass-border);border-radius:var(--yt-radius-md);backdrop-filter:var(--yt-glass-blur);-webkit-backdrop-filter:var(--yt-glass-blur);box-shadow:var(--yt-glass-shadow);}
 .glass-card{background:var(--yt-panel-bg);border:1px solid var(--yt-glass-border);border-radius:var(--yt-radius-md);padding:var(--yt-space-md);backdrop-filter:var(--yt-glass-blur-light);-webkit-backdrop-filter:var(--yt-glass-blur-light);box-shadow:var(--yt-shadow);}
 .glass-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:var(--yt-modal-bg);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:var(--yt-glass-blur);-webkit-backdrop-filter:var(--yt-glass-blur);}
 .glass-button{background:var(--yt-button-bg);border:1px solid var(--yt-glass-border);border-radius:var(--yt-radius-md);padding:var(--yt-space-sm) var(--yt-space-md);color:var(--yt-text-primary);cursor:pointer;transition:all .2s ease;backdrop-filter:var(--yt-glass-blur-light);-webkit-backdrop-filter:var(--yt-glass-blur-light);}
 .glass-button:hover{background:var(--yt-hover-bg);transform:translateY(-1px);box-shadow:var(--yt-shadow);}
 .download-site-option{display:flex;flex-direction:column;align-items:stretch;gap:8px;}
 .download-site-header{display:flex;flex-direction:row;align-items:center;justify-content:space-between;width:100%;gap:8px;}
 .download-site-controls{width:100%;margin-top:6px;}
 .download-site-cta{display:flex;flex-direction:row;gap:8px;margin-top:6px;}
 .download-site-cta .glass-button{width:100%;}
 .download-site-option .ytp-plus-settings-checkbox{margin:0;}
 .download-site-name{font-weight:600;color:var(--yt-text-primary);}
 .download-site-desc{font-size:12px;color:var(--yt-text-secondary);margin-top:2px;}
 .ytSearchboxComponentInputBox { background: transparent !important; }
 .ytp-plus-settings-panel select,
 .ytp-plus-settings-panel select option {background: var(--yt-panel-bg) !important; color: var(--yt-text-primary) !important;}
 .ytp-plus-settings-panel select {-webkit-appearance: menulist !important; appearance: menulist !important; padding: 6px 8px !important; border-radius: 6px !important; border: 1px solid var(--yt-glass-border) !important;}
 `;
 if (!document.getElementById('yt-enhancer-styles')) {
 YouTubeUtils.StyleManager.add('yt-enhancer-main', styles);
 }
 },
 addSettingsButtonToHeader() {
 this.waitForElement('ytd-masthead #end', 5000)
 .then(headerEnd => {
 if (!this.getElement('.ytp-plus-settings-button')) {
 const settingsButton = document.createElement('div');
 settingsButton.className = 'ytp-plus-settings-button';
 settingsButton.setAttribute('title', t('youtubeSettings'));
 settingsButton.innerHTML = `
 <svg width="24" height="24" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M39.23,26a16.52,16.52,0,0,0,.14-2,16.52,16.52,0,0,0-.14-2l4.33-3.39a1,1,0,0,0,.25-1.31l-4.1-7.11a1,1,0,0,0-1.25-.44l-5.11,2.06a15.68,15.68,0,0,0-3.46-2l-.77-5.43a1,1,0,0,0-1-.86H19.9a1,1,0,0,0-1,.86l-.77,5.43a15.36,15.36,0,0,0-3.46,2L9.54,9.75a1,1,0,0,0-1.25.44L4.19,17.3a1,1,0,0,0,.25,1.31L8.76,22a16.66,16.66,0,0,0-.14,2,16.52,16.52,0,0,0,.14,2L4.44,29.39a1,1,0,0,0-.25,1.31l4.1,7.11a1,1,0,0,0,1.25.44l5.11-2.06a15.68,15.68,0,0,0,3.46,2l.77,5.43a1,1,0,0,0,1,.86h8.2a1,1,0,0,0,1-.86l.77-5.43a15.36,15.36,0,0,0,3.46-2l5.11,2.06a1,1,0,0,0,1.25-.44l4.1-7.11a1,1,0,0,0-.25-1.31ZM24,31.18A7.18,7.18,0,1,1,31.17,24,7.17,7.17,0,0,1,24,31.18Z"/>
 </svg>
 `;
 settingsButton.addEventListener('click', this.openSettingsModal.bind(this));
 const avatarButton = headerEnd.querySelector('ytd-topbar-menu-button-renderer');
 if (avatarButton) {
 headerEnd.insertBefore(settingsButton, avatarButton);
 } else {
 headerEnd.appendChild(settingsButton);
 }
 }
 })
 .catch(() => {});
 },
 handleModalClickActions(target, modal, handlers, markDirty, context, translate) {
 const navItem = (
 target.classList && target.classList.contains('ytp-plus-settings-nav-item')
 ? target
 : target.closest && target.closest('.ytp-plus-settings-nav-item')
 );
 if (navItem) {
 handlers.handleSidebarNavigation(navItem, modal);
 return;
 }
 if (target.classList.contains('ytp-plus-settings-checkbox')) {
 const { dataset } = (target);
 const { setting } = dataset;
 if (!setting) return;
 if (setting.startsWith('downloadSite_')) {
 const key = setting.replace('downloadSite_', '');
 handlers.handleDownloadSiteToggle(
 target,
 key,
 this.settings,
 markDirty,
 this.saveSettings.bind(this)
 );
 return;
 }
 handlers.handleSimpleSettingToggle(
 target,
 setting,
 this.settings,
 context,
 markDirty,
 this.saveSettings.bind(this),
 modal
 );
 return;
 }
 if (target.classList.contains('download-site-input')) {
 const { dataset } = (target);
 const { site, field } = dataset;
 if (!site || !field) return;
 handlers.handleDownloadSiteInput(target, site, field, this.settings, markDirty, translate);
 return;
 }
 if (target.id === 'ytp-plus-save-settings' || target.id === 'ytp-plus-save-settings-icon') {
 this.saveSettings();
 modal.remove();
 this.showNotification(translate('settingsSaved'));
 return;
 }
 if (target.id === 'download-y2mate-save') {
 handlers.handleY2MateSave(
 target,
 this.settings,
 this.saveSettings.bind(this),
 this.showNotification.bind(this),
 translate
 );
 return;
 }
 if (target.id === 'download-y2mate-reset') {
 handlers.handleY2MateReset(
 modal,
 this.settings,
 this.saveSettings.bind(this),
 this.showNotification.bind(this),
 translate
 );
 }
 },
 createSettingsModal() {
 const modal = document.createElement('div');
 modal.className = 'ytp-plus-settings-modal';
 const helpers = window.YouTubePlusSettingsHelpers;
 const handlers = window.YouTubePlusModalHandlers;
 modal.innerHTML = `<div class="ytp-plus-settings-panel">${helpers.createSettingsSidebar(t)}${helpers.createMainContent(this.settings, t)}</div>`;
 let dirty = false;
 const saveIconBtn = modal.querySelector('#ytp-plus-save-settings-icon');
 if (saveIconBtn) saveIconBtn.style.display = 'none';
 const markDirty = () => {
 if (dirty) return;
 dirty = true;
 if (saveIconBtn) saveIconBtn.style.display = '';
 };
 const context = {
 settings: this.settings,
 getElement: this.getElement.bind(this),
 addDownloadButton: this.addDownloadButton.bind(this),
 addSpeedControlButton: this.addSpeedControlButton.bind(this),
 refreshDownloadButton: this.refreshDownloadButton.bind(this),
 updatePageBasedOnSettings: this.updatePageBasedOnSettings.bind(this),
 };
 const handleModalClick = e => {
 const { target } = (e);
 if (target === modal) {
 modal.remove();
 return;
 }
 if (
 target.id === 'ytp-plus-close-settings' ||
 target.id === 'ytp-plus-close-settings-icon' ||
 target.classList.contains('ytp-plus-settings-close') ||
 target.closest('.ytp-plus-settings-close') ||
 target.closest('#ytp-plus-close-settings') ||
 target.closest('#ytp-plus-close-settings-icon')
 ) {
 modal.remove();
 return;
 }
 if (target.id === 'open-ytdl-github' || target.closest('#open-ytdl-github')) {
 window.open('https://github.com/diorhc/YTDL', '_blank');
 return;
 }
 this.handleModalClickActions(target, modal, handlers, markDirty, context, t);
 };
 modal.addEventListener('click', handleModalClick);
 modal.addEventListener('input', e => {
 const { target } = (e);
 if (target.classList.contains('download-site-input')) {
 const { dataset } = (target);
 const { site, field } = dataset;
 if (!site || !field) return;
 handlers.handleDownloadSiteInput(target, site, field, this.settings, markDirty, t);
 }
 });
 try {
 if (
 typeof window !== 'undefined' &&
 (window).youtubePlusReport &&
 typeof ( (window).youtubePlusReport.render) === 'function'
 ) {
 try {
 (window).youtubePlusReport.render(modal);
 } catch (e) {
 YouTubeUtils.logError('Report', 'report.render failed', e);
 }
 }
 } catch (e) {
 YouTubeUtils.logError('Report', 'Failed to initialize report section', e);
 }
 return modal;
 },
 openSettingsModal() {
 const existingModal = this.getElement('.ytp-plus-settings-modal', false);
 if (existingModal) existingModal.remove();
 document.body.appendChild(this.createSettingsModal());
 },
 waitForElement(selector, timeout = 5000) {
 return YouTubeUtils.waitForElement(selector, timeout);
 },
 addCustomButtons() {
 const controls = this.getElement('.ytp-right-controls');
 if (!controls) return;
 if (!this.getElement('.ytp-screenshot-button')) this.addScreenshotButton(controls);
 if (!this.getElement('.ytp-download-button')) this.addDownloadButton(controls);
 if (!this.getElement('.speed-control-btn')) this.addSpeedControlButton(controls);
 if (!document.getElementById('speed-indicator')) {
 const indicator = document.createElement('div');
 indicator.id = 'speed-indicator';
 const player = document.getElementById('movie_player');
 if (player) player.appendChild(indicator);
 }
 this.handleFullscreenChange();
 },
 addScreenshotButton(controls) {
 const button = document.createElement('button');
 button.className = 'ytp-button ytp-screenshot-button';
 button.setAttribute('title', t('takeScreenshot'));
 button.innerHTML = `
 <svg width="24" height="24" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19.83,8.77l-2.77,2.84H6.29A1.79,1.79,0,0,0,4.5,13.4V36.62a1.8,1.8,0,0,0,1.79,1.8H41.71a1.8,1.8,0,0,0,1.79-1.8V13.4a1.79,1.79,0,0,0-1.79-1.79H30.94L28.17,8.77Zm18.93,5.74a1.84,1.84,0,1,1,0,3.68A1.84,1.84,0,0,1,38.76,14.51ZM24,17.71a8.51,8.51,0,1,1-8.51,8.51A8.51,8.51,0,0,1,24,17.71Z"/>
 </svg>
 `;
 button.addEventListener('click', this.captureFrame.bind(this));
 controls.insertBefore(button, controls.firstChild);
 },
 addDownloadButton(controls) {
 if (typeof window !== 'undefined' && window.YouTubePlusDownloadButton) {
 const manager = window.YouTubePlusDownloadButton.createDownloadButtonManager({
 settings: this.settings,
 t,
 getElement: this.getElement.bind(this),
 YouTubeUtils,
 });
 manager.addDownloadButton(controls);
 } else {
 console.warn('[YouTube+] Download button module not loaded');
 }
 },
 addSpeedControlButton(controls) {
 if (!this.settings.enableSpeedControl) return;
 const speedBtn = document.createElement('button');
 speedBtn.type = 'button';
 speedBtn.className = 'ytp-button speed-control-btn';
 speedBtn.setAttribute('aria-label', t('speedControl'));
 speedBtn.setAttribute('aria-haspopup', 'true');
 speedBtn.setAttribute('aria-expanded', 'false');
 speedBtn.innerHTML = `<span>${this.speedControl.currentSpeed}×</span>`;
 const speedOptions = document.createElement('div');
 speedOptions.className = 'speed-options';
 speedOptions.setAttribute('role', 'menu');
 const selectSpeed = speed => {
 this.changeSpeed(speed);
 hideDropdown();
 };
 [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0].forEach(speed => {
 const option = document.createElement('div');
 option.className = `speed-option-item${Number(speed) === this.speedControl.currentSpeed ? ' speed-option-active' : ''}`;
 option.textContent = `${speed}x`;
 option.dataset.speed = String(speed);
 option.setAttribute('role', 'menuitem');
 option.tabIndex = 0;
 option.addEventListener('click', () => selectSpeed(speed));
 option.addEventListener('keydown', event => {
 if (event.key === 'Enter' || event.key === ' ') {
 event.preventDefault();
 selectSpeed(speed);
 }
 });
 speedOptions.appendChild(option);
 });
 speedBtn.appendChild(speedOptions);
 const existingSpeed = document.querySelector('.speed-options');
 if (existingSpeed) existingSpeed.remove();
 try {
 document.body.appendChild(speedOptions);
 } catch {
 }
 const positionDropdown = () => {
 const rect = speedBtn.getBoundingClientRect();
 speedOptions.style.left = `${rect.left + rect.width / 2}px`;
 speedOptions.style.bottom = `${window.innerHeight - rect.top + 8}px`;
 };
 const hideDropdown = () => {
 speedOptions.classList.remove('visible');
 speedBtn.setAttribute('aria-expanded', 'false');
 };
 const showDropdown = () => {
 positionDropdown();
 speedOptions.classList.add('visible');
 speedBtn.setAttribute('aria-expanded', 'true');
 };
 const toggleDropdown = () => {
 if (speedOptions.classList.contains('visible')) {
 hideDropdown();
 } else {
 showDropdown();
 }
 };
 let documentClickKey;
 const documentClickHandler = event => {
 if (!speedBtn.isConnected) {
 if (documentClickKey) {
 YouTubeUtils.cleanupManager.unregisterListener(documentClickKey);
 documentClickKey = undefined;
 }
 return;
 }
 if (!speedOptions.classList.contains('visible')) return;
 if (
 speedBtn.contains( (event.target)) ||
 speedOptions.contains( (event.target))
 ) {
 return;
 }
 hideDropdown();
 };
 const documentKeydownHandler = event => {
 if (event.key === 'Escape' && speedOptions.classList.contains('visible')) {
 hideDropdown();
 speedBtn.focus();
 }
 };
 documentClickKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'click',
 documentClickHandler,
 true
 );
 YouTubeUtils.cleanupManager.registerListener(
 document,
 'keydown',
 documentKeydownHandler,
 true
 );
 YouTubeUtils.cleanupManager.registerListener(window, 'resize', () => {
 if (speedOptions.classList.contains('visible')) {
 positionDropdown();
 }
 });
 YouTubeUtils.cleanupManager.registerListener(
 window,
 'scroll',
 () => {
 if (speedOptions.classList.contains('visible')) {
 positionDropdown();
 }
 },
 true
 );
 let speedHideTimer;
 speedBtn.addEventListener('mouseenter', () => {
 clearTimeout(speedHideTimer);
 showDropdown();
 });
 speedBtn.addEventListener('mouseleave', () => {
 clearTimeout(speedHideTimer);
 speedHideTimer = setTimeout(hideDropdown, 200);
 });
 speedOptions.addEventListener('mouseenter', () => {
 clearTimeout(speedHideTimer);
 showDropdown();
 });
 speedOptions.addEventListener('mouseleave', () => {
 clearTimeout(speedHideTimer);
 speedHideTimer = setTimeout(hideDropdown, 200);
 });
 speedBtn.addEventListener('keydown', event => {
 if (event.key === 'Enter' || event.key === ' ') {
 event.preventDefault();
 toggleDropdown();
 } else if (event.key === 'Escape') {
 hideDropdown();
 }
 });
 controls.insertBefore(speedBtn, controls.firstChild);
 },
 applyGuideVisibility() {
 try {
 const enabled = Boolean(YouTubeUtils.storage.get('ytplus.hideGuide', false));
 document.documentElement.classList.toggle('ytp-hide-guide', enabled);
 const btn = document.getElementById('ytplus-guide-toggle-btn');
 if (btn) {
 btn.setAttribute('aria-pressed', String(enabled));
 btn.title = enabled ? 'Show side guide' : 'Hide side guide';
 }
 } catch (e) {
 console.warn('[YouTube+] applyGuideVisibility failed:', e);
 }
 },
 toggleSideGuide() {
 try {
 const current = Boolean(YouTubeUtils.storage.get('ytplus.hideGuide', false));
 const next = !current;
 YouTubeUtils.storage.set('ytplus.hideGuide', next);
 this.applyGuideVisibility();
 } catch (e) {
 console.warn('[YouTube+] toggleSideGuide failed:', e);
 }
 },
 createGuideToggleButton() {
 try {
 if (document.getElementById('ytplus-guide-toggle-btn')) return;
 const btn = document.createElement('button');
 btn.id = 'ytplus-guide-toggle-btn';
 btn.type = 'button';
 btn.style.cssText =
 'position:fixed;right:12px;bottom:12px;z-index:100000;background:var(--yt-spec-call-to-action);color:#fff;border:none;border-radius:8px;padding:8px 10px;box-shadow:0 6px 18px rgba(0,0,0,0.3);cursor:pointer;opacity:0.95;font-size:13px;';
 btn.setAttribute('aria-pressed', 'false');
 btn.title = 'Hide side guide';
 btn.textContent = 'Toggle Guide';
 btn.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 this.toggleSideGuide();
 });
 btn.addEventListener('keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 this.toggleSideGuide();
 }
 });
 document.body.appendChild(btn);
 this.applyGuideVisibility();
 } catch (e) {
 console.warn('[YouTube+] createGuideToggleButton failed:', e);
 }
 },
 captureFrame() {
 const video = this.getElement('video', false);
 if (!video) return;
 const canvas = document.createElement('canvas');
 canvas.width = video.videoWidth;
 canvas.height = video.videoHeight;
 const ctx = canvas.getContext('2d');
 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 const videoTitle = document.title.replace(/\s-\sYouTube$/, '').trim();
 const link = document.createElement('a');
 link.href = canvas.toDataURL('image/png');
 link.download = `${videoTitle}.png`;
 try {
 link.click();
 try {
 const translated = typeof t === 'function' ? t('screenshotSaved') : null;
 const message =
 translated && translated !== 'screenshotSaved' ? translated : 'Screenshot saved';
 this.showNotification(message, 2000);
 } catch {
 this.showNotification('Screenshot saved', 2000);
 }
 } catch (err) {
 if (YouTubeUtils && YouTubeUtils.logError) {
 YouTubeUtils.logError('Basic', 'Screenshot download failed', err);
 }
 try {
 const translatedFail = typeof t === 'function' ? t('screenshotFailed') : null;
 const failMsg =
 translatedFail && translatedFail !== 'screenshotFailed'
 ? translatedFail
 : 'Screenshot failed';
 this.showNotification(failMsg, 3000);
 } catch {
 this.showNotification('Screenshot failed', 3000);
 }
 }
 },
 showNotification(message, duration = 2000) {
 YouTubeUtils.NotificationManager.show(message, { duration, type: 'info' });
 },
 handleFullscreenChange() {
 const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
 document.querySelectorAll('.ytp-screenshot-button, .ytp-cobalt-button').forEach(button => {
 button.style.bottom = isFullscreen ? '0px' : '0px';
 });
 },
 changeSpeed(speed) {
 const numericSpeed = Number(speed);
 this.speedControl.currentSpeed = numericSpeed;
 localStorage.setItem(this.speedControl.storageKey, String(numericSpeed));
 const speedBtn = this.getElement('.speed-control-btn span', false);
 if (speedBtn) speedBtn.textContent = `${numericSpeed}×`;
 document.querySelectorAll('.speed-option-item').forEach(option => {
 option.classList.toggle(
 'speed-option-active',
 parseFloat(option.dataset.speed) === numericSpeed
 );
 });
 this.applyCurrentSpeed();
 this.showSpeedIndicator(numericSpeed);
 },
 applyCurrentSpeed() {
 document.querySelectorAll('video').forEach(video => {
 if (video && video.playbackRate !== this.speedControl.currentSpeed) {
 video.playbackRate = this.speedControl.currentSpeed;
 }
 });
 },
 setupVideoObserver() {
 if (this._speedInterval) clearInterval(this._speedInterval);
 this._speedInterval = setInterval(() => this.applyCurrentSpeed(), 1000);
 YouTubeUtils.cleanupManager.registerInterval(this._speedInterval);
 },
 setupNavigationObserver() {
 let lastUrl = location.href;
 document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
 document.addEventListener('yt-navigate-finish', () => {
 if (location.href.includes('watch?v=')) this.setupCurrentPage();
 this.addSettingsButtonToHeader();
 });
 const observer = new MutationObserver(() => {
 if (lastUrl !== location.href) {
 lastUrl = location.href;
 if (location.href.includes('watch?v=')) {
 setTimeout(() => this.setupCurrentPage(), 500);
 }
 this.addSettingsButtonToHeader();
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(observer);
 if (document.body) {
 observer.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, { childList: true, subtree: true });
 });
 }
 },
 showSpeedIndicator(speed) {
 const indicator = document.getElementById('speed-indicator');
 if (!indicator) return;
 if (this.speedControl.activeAnimationId) {
 cancelAnimationFrame(this.speedControl.activeAnimationId);
 YouTubeUtils.cleanupManager.unregisterAnimationFrame(this.speedControl.activeAnimationId);
 this.speedControl.activeAnimationId = null;
 }
 indicator.textContent = `${speed}×`;
 indicator.style.display = 'block';
 indicator.style.opacity = '0.8';
 const startTime = performance.now();
 const fadeOut = timestamp => {
 const elapsed = timestamp - startTime;
 const progress = Math.min(elapsed / 1500, 1);
 indicator.style.opacity = String(0.8 * (1 - progress));
 if (progress < 1) {
 this.speedControl.activeAnimationId = YouTubeUtils.cleanupManager.registerAnimationFrame(
 requestAnimationFrame(fadeOut)
 );
 } else {
 indicator.style.display = 'none';
 this.speedControl.activeAnimationId = null;
 }
 };
 this.speedControl.activeAnimationId = YouTubeUtils.cleanupManager.registerAnimationFrame(
 requestAnimationFrame(fadeOut)
 );
 },
 };
 const initFunction = YouTubeEnhancer.init.bind(YouTubeEnhancer);
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initFunction);
 } else {
 initFunction();
 }
})();
(function () {
 'use strict';
 const CircuitState = {
 CLOSED: 'closed',
 OPEN: 'open',
 HALF_OPEN: 'half_open',
 };
 const ErrorBoundaryConfig = {
 maxErrors: 10,
 errorWindow: 60000,
 enableLogging: true,
 enableRecovery: true,
 storageKey: 'youtube_plus_errors',
 circuitBreaker: {
 enabled: true,
 failureThreshold: 5,
 resetTimeout: 30000,
 halfOpenAttempts: 3,
 },
 };
 const errorState = {
 errors: [],
 errorCount: 0,
 lastErrorTime: 0,
 isRecovering: false,
 circuitState: CircuitState.CLOSED,
 circuitFailureCount: 0,
 circuitLastFailureTime: 0,
 circuitSuccessCount: 0,
 };
 const ErrorSeverity = {
 LOW: 'low',
 MEDIUM: 'medium',
 HIGH: 'high',
 CRITICAL: 'critical',
 };
 const categorizeSeverity = error => {
 const message = error.message?.toLowerCase() || '';
 if (
 message.includes('cannot read') ||
 message.includes('undefined') ||
 message.includes('null')
 ) {
 return ErrorSeverity.MEDIUM;
 }
 if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
 return ErrorSeverity.LOW;
 }
 if (message.includes('syntax') || message.includes('reference') || message.includes('type')) {
 return ErrorSeverity.HIGH;
 }
 if (message.includes('security') || message.includes('csp')) {
 return ErrorSeverity.CRITICAL;
 }
 return ErrorSeverity.MEDIUM;
 };
 const checkCircuitBreaker = success => {
 if (!ErrorBoundaryConfig.circuitBreaker.enabled) return true;
 const now = Date.now();
 const { circuitBreaker } = ErrorBoundaryConfig;
 if (
 errorState.circuitState === CircuitState.OPEN &&
 now - errorState.circuitLastFailureTime >= circuitBreaker.resetTimeout
 ) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+] Circuit breaker transitioning to HALF_OPEN');
 errorState.circuitState = CircuitState.HALF_OPEN;
 errorState.circuitSuccessCount = 0;
 }
 if (success) {
 if (errorState.circuitState === CircuitState.HALF_OPEN) {
 errorState.circuitSuccessCount++;
 if (errorState.circuitSuccessCount >= circuitBreaker.halfOpenAttempts) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+] Circuit breaker CLOSED - system recovered');
 errorState.circuitState = CircuitState.CLOSED;
 errorState.circuitFailureCount = 0;
 errorState.circuitSuccessCount = 0;
 }
 } else if (errorState.circuitState === CircuitState.CLOSED) {
 errorState.circuitFailureCount = Math.max(0, errorState.circuitFailureCount - 1);
 }
 return true;
 }
 errorState.circuitFailureCount++;
 errorState.circuitLastFailureTime = now;
 if (errorState.circuitState === CircuitState.CLOSED) {
 if (errorState.circuitFailureCount >= circuitBreaker.failureThreshold) {
 console.error('[YouTube+] Circuit breaker OPEN - too many failures');
 errorState.circuitState = CircuitState.OPEN;
 return false;
 }
 } else if (errorState.circuitState === CircuitState.HALF_OPEN) {
 console.error('[YouTube+] Circuit breaker reopened - recovery failed');
 errorState.circuitState = CircuitState.OPEN;
 errorState.circuitSuccessCount = 0;
 return false;
 }
 return errorState.circuitState !== CircuitState.OPEN;
 };
 const logError = (error, context = {}) => {
 if (!ErrorBoundaryConfig.enableLogging) return;
 checkCircuitBreaker(false);
 const fallbackMessage = error.message?.trim() || '';
 if (!fallbackMessage || fallbackMessage === '(no message)') {
 if (!error.stack && !context.filename) {
 return;
 }
 }
 const displayMessage =
 fallbackMessage ||
 (context.filename ? `Error in ${context.filename}:${context.lineno}` : 'Unknown error');
 const errorInfo = {
 timestamp: new Date().toISOString(),
 message: displayMessage,
 stack: error.stack,
 severity: categorizeSeverity(error),
 context: {
 url: window.location.href,
 userAgent: navigator.userAgent,
 ...context,
 },
 };
 console.error('[YouTube+][Error Boundary]', `${errorInfo.message}`, errorInfo);
 errorState.errors.push(errorInfo);
 if (errorState.errors.length > 50) {
 errorState.errors.shift();
 }
 try {
 const stored = JSON.parse(localStorage.getItem(ErrorBoundaryConfig.storageKey) || '[]');
 stored.push(errorInfo);
 if (stored.length > 20) stored.shift();
 localStorage.setItem(ErrorBoundaryConfig.storageKey, JSON.stringify(stored));
 } catch {}
 };
 const isErrorRateExceeded = () => {
 const now = Date.now();
 const windowStart = now - ErrorBoundaryConfig.errorWindow;
 const recentErrors = errorState.errors.filter(
 e => new Date(e.timestamp).getTime() > windowStart
 );
 return recentErrors.length >= ErrorBoundaryConfig.maxErrors;
 };
 const getErrorRate = () => {
 const now = Date.now();
 const oneMinuteAgo = now - 60000;
 const recentErrors = errorState.errors.filter(
 e => new Date(e.timestamp).getTime() > oneMinuteAgo
 );
 return recentErrors.length;
 };
 const shouldSuppressNotification = error => {
 const rate = getErrorRate();
 if (rate > 5) {
 return true;
 }
 const tenSecondsAgo = Date.now() - 10000;
 const recentSimilar = errorState.errors.filter(
 e =>
 new Date(e.timestamp).getTime() > tenSecondsAgo &&
 e.message === error.message &&
 e.severity === categorizeSeverity(error)
 );
 return recentSimilar.length > 0;
 };
 const showErrorNotification = (error, _context) => {
 try {
 const Y = window.YouTubeUtils;
 if (!Y || !Y.NotificationManager || typeof Y.NotificationManager.show !== 'function') {
 return;
 }
 const severity = categorizeSeverity(error);
 let message = 'An error occurred';
 let duration = 3000;
 switch (severity) {
 case ErrorSeverity.LOW:
 message = 'A minor issue occurred. Functionality should continue normally.';
 duration = 2000;
 break;
 case ErrorSeverity.MEDIUM:
 message = 'An error occurred. Some features may not work correctly.';
 duration = 3000;
 break;
 case ErrorSeverity.HIGH:
 message = 'A serious error occurred. Please refresh the page if issues persist.';
 duration = 5000;
 break;
 case ErrorSeverity.CRITICAL:
 message =
 'A critical error occurred. YouTube+ may not function properly. Please report this issue.';
 duration = 7000;
 break;
 }
 Y.NotificationManager.show(message, { duration, type: 'error' });
 } catch (notificationError) {
 console.error('[YouTube+] Failed to show error notification:', notificationError);
 }
 };
 const attemptRecovery = (error, context) => {
 if (!ErrorBoundaryConfig.enableRecovery || errorState.isRecovering) return;
 const severity = categorizeSeverity(error);
 if (severity === ErrorSeverity.CRITICAL) {
 console.error('[YouTube+] Critical error detected. Script may not function properly.');
 showErrorNotification(error, context);
 return;
 }
 errorState.isRecovering = true;
 try {
 if (severity !== ErrorSeverity.LOW && !shouldSuppressNotification(error)) {
 showErrorNotification(error, context);
 }
 const RecoveryUtils = window.YouTubePlusErrorRecovery;
 if (RecoveryUtils && RecoveryUtils.attemptRecovery) {
 RecoveryUtils.attemptRecovery(error, context);
 } else {
 performLegacyRecovery(error, context);
 }
 setTimeout(() => {
 errorState.isRecovering = false;
 }, 5000);
 } catch (recoveryError) {
 console.error('[YouTube+] Recovery attempt failed:', recoveryError);
 errorState.isRecovering = false;
 }
 };
 const performLegacyRecovery = (error, context) => {
 if (context.module) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(`[YouTube+] Attempting recovery for module: ${context.module}`);
 const Y = window.YouTubeUtils;
 if (Y && Y.cleanupManager) {
 switch (context.module) {
 case 'StyleManager':
 break;
 case 'NotificationManager':
 break;
 default:
 break;
 }
 }
 if (
 error.message &&
 (error.message.includes('null') || error.message.includes('undefined')) &&
 context.element
 ) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+] Attempting to re-query DOM element');
 }
 }
 };
 const handleError = event => {
 const error = event.error || new Error(event.message);
 const message = (error.message || event.message || '').trim();
 if (message.includes('ResizeObserver loop')) {
 return false;
 }
 const source = event.filename || '';
 const isCrossOriginSource =
 source && !source.startsWith(window.location.origin) && !/YouTube\+/.test(source);
 if (!message && isCrossOriginSource) {
 return false;
 }
 if (!message || (message === '(no message)' && isCrossOriginSource)) {
 return false;
 }
 errorState.errorCount++;
 errorState.lastErrorTime = Date.now();
 logError(error, {
 type: 'uncaught',
 filename: event.filename,
 lineno: event.lineno,
 colno: event.colno,
 });
 if (isErrorRateExceeded()) {
 console.error(
 '[YouTube+] Error rate exceeded! Too many errors in short period. Some features may be disabled.'
 );
 return false;
 }
 attemptRecovery(error, { type: 'uncaught' });
 return false;
 };
 const handleUnhandledRejection = event => {
 const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
 logError(error, {
 type: 'unhandledRejection',
 promise: event.promise,
 });
 if (isErrorRateExceeded()) {
 console.error('[YouTube+] Promise rejection rate exceeded!');
 return;
 }
 attemptRecovery(error, { type: 'unhandledRejection' });
 };
 const withErrorBoundary = (fn, context = 'unknown') => {
 return function (...args) {
 try {
 const fnAny = (fn);
 return fnAny.call(this, ...args);
 } catch (error) {
 logError(error, { module: context, args });
 attemptRecovery(error, { module: context });
 return null;
 }
 };
 };
 const withAsyncErrorBoundary = (fn, context = 'unknown') => {
 return async function (...args) {
 try {
 const fnAny = (fn);
 return await fnAny.call(this, ...args);
 } catch (error) {
 logError(error, { module: context, args });
 attemptRecovery(error, { module: context });
 return null;
 }
 };
 };
 const getErrorStats = () => {
 return {
 totalErrors: errorState.errorCount,
 recentErrors: errorState.errors.length,
 lastErrorTime: errorState.lastErrorTime,
 isRecovering: errorState.isRecovering,
 errorsByType: errorState.errors.reduce((acc, e) => {
 acc[e.severity] = (acc[e.severity] || 0) + 1;
 return acc;
 }, {}),
 };
 };
 const clearErrors = () => {
 errorState.errors = [];
 try {
 localStorage.removeItem(ErrorBoundaryConfig.storageKey);
 } catch {}
 };
 if (typeof window !== 'undefined') {
 window.addEventListener('error', handleError, true);
 window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
 window.YouTubeErrorBoundary = {
 withErrorBoundary,
 withAsyncErrorBoundary,
 getErrorStats,
 clearErrors,
 logError,
 getErrorRate,
 config: ErrorBoundaryConfig,
 };
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+][Error Boundary]', 'Error boundary initialized');
 }
})();
(function () {
 'use strict';
 const PerformanceConfig = {
 enabled: true,
 sampleRate: 1.0,
 storageKey: 'youtube_plus_performance',
 metricsRetention: 100,
 enableConsoleOutput: false,
 logLevel: 'info',
 };
 const metrics = {
 timings: new Map(),
 marks: new Map(),
 measures: [],
 resources: [],
 webVitals: {
 LCP: null,
 CLS: 0,
 FID: null,
 INP: null,
 FCP: null,
 TTFB: null,
 },
 };
 const mark = name => {
 if (!PerformanceConfig.enabled) return;
 try {
 if (typeof performance !== 'undefined' && performance.mark) {
 performance.mark(name);
 }
 metrics.marks.set(name, Date.now());
 } catch (e) {
 console.warn('[YouTube+ Perf] Failed to create mark:', e);
 }
 };
 const measure = (name, startMark, endMark) => {
 if (!PerformanceConfig.enabled) return 0;
 try {
 const startTime = metrics.marks.get(startMark);
 if (!startTime) {
 return 0;
 }
 const endTime = endMark ? metrics.marks.get(endMark) : Date.now();
 const duration = endTime - startTime;
 const measureData = {
 name,
 startMark,
 endMark: endMark || 'now',
 duration,
 timestamp: Date.now(),
 };
 metrics.measures.push(measureData);
 if (metrics.measures.length > PerformanceConfig.metricsRetention) {
 metrics.measures.shift();
 }
 if (PerformanceConfig.enableConsoleOutput) {
 window.YouTubeUtils?.logger?.debug?.(`[YouTube+ Perf] ${name}: ${duration.toFixed(2)}ms`);
 }
 if (typeof performance !== 'undefined' && performance.measure) {
 try {
 performance.measure(name, startMark, endMark);
 } catch {}
 }
 return duration;
 } catch (e) {
 console.warn('[YouTube+ Perf] Failed to measure:', e);
 return 0;
 }
 };
 const timeFunction = (name, fn) => {
 if (!PerformanceConfig.enabled) return fn;
 return function (...args) {
 const startMark = `${name}-start-${Date.now()}`;
 mark(startMark);
 try {
 const fnAny = (fn);
 const result = fnAny.apply(this, args);
 if (result && typeof result.then === 'function') {
 return result.finally(() => {
 measure(name, startMark, undefined);
 });
 }
 measure(name, startMark, undefined);
 return result;
 } catch (error) {
 measure(name, startMark, undefined);
 throw error;
 }
 };
 };
 const timeAsyncFunction = (name, fn) => {
 if (!PerformanceConfig.enabled) return fn;
 return async function (...args) {
 const startMark = `${name}-start-${Date.now()}`;
 mark(startMark);
 try {
 const fnAny = (fn);
 const result = await fnAny.apply(this, args);
 measure(name, startMark, undefined);
 return result;
 } catch (error) {
 measure(name, startMark, undefined);
 throw error;
 }
 };
 };
 const recordMetric = (name, value, metadata = {}) => {
 if (!PerformanceConfig.enabled) return;
 const metric = {
 name,
 value,
 timestamp: Date.now(),
 ...metadata,
 };
 metrics.timings.set(name, metric);
 if (PerformanceConfig.enableConsoleOutput) {
 window.YouTubeUtils?.logger?.debug?.(`[YouTube+ Perf] ${name}: ${value}`, metadata);
 }
 };
 const getStats = metricName => {
 if (metricName) {
 const filtered = metrics.measures.filter(m => m.name === metricName);
 if (filtered.length === 0) return null;
 const durations = filtered.map(m => m.duration);
 return {
 name: metricName,
 count: durations.length,
 min: Math.min(...durations),
 max: Math.max(...durations),
 avg: durations.reduce((a, b) => a + b, 0) / durations.length,
 latest: durations[durations.length - 1],
 };
 }
 const allMetrics = {};
 const metricNames = [...new Set(metrics.measures.map(m => m.name))];
 metricNames.forEach(name => {
 allMetrics[name] = getStats(name);
 });
 return {
 metrics: allMetrics,
 webVitals: { ...metrics.webVitals },
 totalMeasures: metrics.measures.length,
 totalMarks: metrics.marks.size,
 customMetrics: Object.fromEntries(metrics.timings),
 };
 };
 const getMemoryUsage = () => {
 if (typeof performance === 'undefined' || !performance.memory) {
 return null;
 }
 try {
 const memory = performance.memory;
 return {
 usedJSHeapSize: memory.usedJSHeapSize,
 totalJSHeapSize: memory.totalJSHeapSize,
 jsHeapSizeLimit: memory.jsHeapSizeLimit,
 usedPercent: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2),
 };
 } catch {
 return null;
 }
 };
 const trackMemory = () => {
 const memory = getMemoryUsage();
 if (memory) {
 recordMetric('memory-usage', memory.usedJSHeapSize, {
 totalJSHeapSize: memory.totalJSHeapSize,
 usedPercent: memory.usedPercent,
 });
 }
 };
 const checkThresholds = thresholds => {
 const violations = [];
 const allStats = getStats(undefined);
 if (!allStats || !allStats.metrics) return violations;
 Object.entries(thresholds).forEach(([metricName, threshold]) => {
 const stat = allStats.metrics[metricName];
 if (stat && stat.avg > threshold) {
 violations.push({
 metric: metricName,
 threshold,
 actual: stat.avg,
 exceeded: stat.avg - threshold,
 });
 }
 });
 return violations;
 };
 const exportMetrics = () => {
 const data = {
 timestamp: new Date().toISOString(),
 userAgent: navigator.userAgent,
 url: window.location.href,
 memory: getMemoryUsage(),
 stats: getStats(undefined),
 measures: metrics.measures,
 customMetrics: Object.fromEntries(metrics.timings),
 webVitals: metrics.webVitals,
 };
 return JSON.stringify(data, null, 2);
 };
 const exportToFile = (filename = 'youtube-plus-performance.json') => {
 try {
 const data = exportMetrics();
 if (typeof Blob === 'undefined') {
 console.warn('[YouTube+ Perf] Blob API not available');
 return false;
 }
 const blob = new Blob([data], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = filename;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
 return true;
 } catch (e) {
 console.error('[YouTube+ Perf] Failed to export to file:', e);
 return false;
 }
 };
 const aggregateByPeriod = (periodMs = 60000) => {
 const periods = new Map();
 metrics.measures.forEach(measure => {
 const periodStart = Math.floor(measure.timestamp / periodMs) * periodMs;
 if (!periods.has(periodStart)) {
 periods.set(periodStart, []);
 }
 periods.get(periodStart).push(measure);
 });
 const aggregated = [];
 periods.forEach((measures, periodStart) => {
 const durations = measures.map(m => m.duration);
 aggregated.push({
 period: new Date(periodStart).toISOString(),
 count: durations.length,
 min: Math.min(...durations),
 max: Math.max(...durations),
 avg: durations.reduce((a, b) => a + b, 0) / durations.length,
 });
 });
 return aggregated;
 };
 const clearMetrics = () => {
 metrics.timings.clear();
 metrics.marks.clear();
 metrics.measures = [];
 metrics.resources = [];
 metrics.webVitals = {
 LCP: null,
 CLS: 0,
 FID: null,
 INP: null,
 FCP: null,
 TTFB: null,
 };
 try {
 localStorage.removeItem(PerformanceConfig.storageKey);
 } catch {}
 if (typeof performance !== 'undefined' && performance.clearMarks) {
 try {
 performance.clearMarks();
 performance.clearMeasures();
 } catch {}
 }
 };
 const monitorMutations = (element, name) => {
 if (!PerformanceConfig.enabled) return null;
 let mutationCount = 0;
 const startTime = Date.now();
 const observer = new MutationObserver(mutations => {
 mutationCount += mutations.length;
 recordMetric(`${name}-mutations`, mutationCount, {
 elapsed: Date.now() - startTime,
 });
 });
 observer.observe(element, {
 childList: true,
 subtree: true,
 attributes: true,
 });
 return observer;
 };
 const getPerformanceEntries = type => {
 if (typeof performance === 'undefined' || !performance.getEntriesByType) {
 return [];
 }
 try {
 return performance.getEntriesByType(type);
 } catch {
 return [];
 }
 };
 const initPerformanceObserver = () => {
 if (typeof PerformanceObserver === 'undefined') return;
 try {
 new PerformanceObserver(entryList => {
 const entries = entryList.getEntries();
 const lastEntry = entries[entries.length - 1];
 metrics.webVitals.LCP = lastEntry.startTime;
 if (PerformanceConfig.enableConsoleOutput) {
 console.warn(`[YouTube+ Perf] LCP: ${lastEntry.startTime.toFixed(2)}ms`, lastEntry);
 }
 }).observe({ type: 'largest-contentful-paint', buffered: true });
 new PerformanceObserver(entryList => {
 for (const entry of entryList.getEntries()) {
 if (!entry.hadRecentInput) {
 metrics.webVitals.CLS += entry.value;
 }
 }
 if (PerformanceConfig.enableConsoleOutput && PerformanceConfig.logLevel === 'debug') {
 console.warn(`[YouTube+ Perf] CLS: ${metrics.webVitals.CLS.toFixed(4)}`);
 }
 }).observe({ type: 'layout-shift', buffered: true });
 new PerformanceObserver(entryList => {
 const firstInput = entryList.getEntries()[0];
 metrics.webVitals.FID = firstInput.processingStart - firstInput.startTime;
 if (PerformanceConfig.enableConsoleOutput) {
 console.warn(`[YouTube+ Perf] FID: ${metrics.webVitals.FID.toFixed(2)}ms`);
 }
 }).observe({ type: 'first-input', buffered: true });
 try {
 new PerformanceObserver(entryList => {
 const entries = entryList.getEntries();
 const maxDuration = Math.max(...entries.map(e => e.duration));
 metrics.webVitals.INP = maxDuration;
 }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
 } catch (e) {
 void e;
 }
 } catch (e) {
 console.warn('[YouTube+ Perf] Failed to init PerformanceObserver:', e);
 }
 };
 const logPageLoadMetrics = () => {
 if (!PerformanceConfig.enabled) return;
 try {
 const navigation = getPerformanceEntries('navigation')[0];
 if (navigation) {
 recordMetric('page-load-time', navigation.loadEventEnd - navigation.fetchStart);
 recordMetric('dom-content-loaded', navigation.domContentLoadedEventEnd);
 recordMetric('dom-interactive', navigation.domInteractive);
 }
 } catch (e) {
 console.warn('[YouTube+ Perf] Failed to log page metrics:', e);
 }
 };
 if (typeof window !== 'undefined') {
 if (document.readyState === 'complete') {
 logPageLoadMetrics();
 } else {
 window.addEventListener('load', logPageLoadMetrics, { once: true });
 }
 initPerformanceObserver();
 const RAFScheduler = (() => {
 let rafId = null;
 const callbacks = new Set();
 const flush = () => {
 rafId = null;
 Array.from(callbacks).forEach(cb => {
 try {
 cb();
 } catch (e) {
 console.error('[RAF] Error:', e);
 }
 });
 callbacks.clear();
 };
 return {
 schedule: callback => {
 callbacks.add(callback);
 if (!rafId) rafId = requestAnimationFrame(flush);
 return () => callbacks.delete(callback);
 },
 cancelAll: () => {
 if (rafId) cancelAnimationFrame(rafId);
 rafId = null;
 callbacks.clear();
 },
 };
 })();
 const LazyLoader = (() => {
 const observers = new Map();
 return {
 create: (options = {}) => {
 const { root = null, rootMargin = '50px', threshold = 0.01, onIntersect } = options;
 const observer = new IntersectionObserver(
 entries => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 onIntersect(entry.target, entry);
 observer.unobserve(entry.target);
 }
 });
 },
 { root, rootMargin, threshold }
 );
 observers.set(observer, new Set());
 return {
 observe: el => {
 if (el instanceof Element) {
 observer.observe(el);
 observers.get(observer).add(el);
 }
 },
 unobserve: el => {
 if (el instanceof Element) {
 observer.unobserve(el);
 observers.get(observer)?.delete(el);
 }
 },
 disconnect: () => {
 observer.disconnect();
 observers.delete(observer);
 },
 };
 },
 disconnectAll: () => {
 observers.forEach((_, o) => o.disconnect());
 observers.clear();
 },
 };
 })();
 const DOMBatcher = (() => {
 const batches = new Map();
 return {
 batch: (container, elements) => {
 if (!batches.has(container)) batches.set(container, []);
 batches.get(container).push(...elements);
 },
 flush: () => {
 RAFScheduler.schedule(() => {
 batches.forEach((elements, container) => {
 if (!container.isConnected) {
 batches.delete(container);
 return;
 }
 const frag = document.createDocumentFragment();
 elements.forEach(el => frag.appendChild(el));
 container.appendChild(frag);
 });
 batches.clear();
 });
 },
 clear: container => batches.delete(container),
 };
 })();
 const ElementCache = (() => {
 const cache = new WeakMap();
 return {
 get: (el, key) => cache.get(el)?.[key],
 set: (el, key, val) => {
 let data = cache.get(el);
 if (!data) {
 data = {};
 cache.set(el, data);
 }
 data[key] = val;
 },
 has: (el, key) => {
 const data = cache.get(el);
 return data ? key in data : false;
 },
 delete: (el, key) => {
 const data = cache.get(el);
 if (data) delete data[key];
 },
 };
 })();
 window.YouTubePerformance = {
 mark,
 measure,
 timeFunction,
 timeAsyncFunction,
 recordMetric,
 getStats,
 exportMetrics,
 exportToFile,
 clearMetrics,
 monitorMutations,
 getPerformanceEntries,
 getMemoryUsage,
 trackMemory,
 checkThresholds,
 aggregateByPeriod,
 config: PerformanceConfig,
 RAFScheduler,
 LazyLoader,
 DOMBatcher,
 ElementCache,
 };
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+] Performance monitoring initialized');
 }
})();
(function () {
 'use strict';
 class DOMCache {
 constructor() {
 this.cache = new Map();
 this.multiCache = new Map();
 this.maxAge = 5000;
 this.nullMaxAge = 250;
 this.maxSize = 500;
 this.cleanupInterval = null;
 this.enabled = true;
 this.stats = { hits: 0, misses: 0, evictions: 0 };
 this.contextUids = new WeakMap();
 this.uidCounter = 0;
 this.observerCallbacks = new Set();
 this.sharedObserver = null;
 this.startCleanup();
 }
 getContextUid(ctx) {
 if (ctx === document) return 'doc';
 let uid = this.contextUids.get(ctx);
 if (!uid) {
 uid = ++this.uidCounter;
 this.contextUids.set(ctx, uid);
 }
 return uid;
 }
 querySelector(selector, context = document, skipCache = false) {
 if (!this.enabled || skipCache) {
 return context.querySelector(selector);
 }
 const cacheKey = `${selector}::${this.getContextUid(context)}`;
 const cached = this.cache.get(cacheKey);
 const now = Date.now();
 const ttl = cached && cached.element ? this.maxAge : this.nullMaxAge;
 if (cached && now - cached.timestamp < ttl) {
 if (cached.element) {
 if (this.isElementInDOM(cached.element)) {
 this.stats.hits++;
 return cached.element;
 }
 } else {
 this.stats.hits++;
 return null;
 }
 }
 this.stats.misses++;
 if (this.cache.size >= this.maxSize) {
 const firstKey = this.cache.keys().next().value;
 this.cache.delete(firstKey);
 this.stats.evictions++;
 }
 const element = context.querySelector(selector);
 this.cache.set(cacheKey, { element, timestamp: now });
 return element;
 }
 querySelectorAll(selector, context = document, skipCache = false) {
 if (!this.enabled || skipCache) {
 return context.querySelectorAll(selector);
 }
 const cacheKey = `ALL::${selector}::${this.getContextUid(context)}`;
 const cached = this.multiCache.get(cacheKey);
 if (cached && this.areElementsValid(cached)) {
 return cached;
 }
 const elements = Array.from(context.querySelectorAll(selector));
 this.multiCache.set(cacheKey, elements);
 const ttl = elements.length > 0 ? this.maxAge : this.nullMaxAge;
 setTimeout(() => this.multiCache.delete(cacheKey), ttl);
 return elements;
 }
 getElementById(id) {
 if (!this.enabled) {
 return document.getElementById(id);
 }
 const cacheKey = `ID::${id}`;
 const cached = this.cache.get(cacheKey);
 const now = Date.now();
 if (cached && now - cached.timestamp < this.maxAge) {
 if (cached.element && this.isElementInDOM(cached.element)) {
 return cached.element;
 }
 }
 const element = document.getElementById(id);
 this.cache.set(cacheKey, { element, timestamp: now });
 return element;
 }
 isElementInDOM(element) {
 return element && document.contains(element);
 }
 areElementsValid(elements) {
 if (!elements || elements.length === 0) return true;
 return this.isElementInDOM(elements[0]) && this.isElementInDOM(elements[elements.length - 1]);
 }
 invalidate(selector) {
 if (selector) {
 for (const key of this.cache.keys()) {
 if (key.includes(selector)) {
 this.cache.delete(key);
 }
 }
 for (const key of this.multiCache.keys()) {
 if (key.includes(selector)) {
 this.multiCache.delete(key);
 }
 }
 } else {
 this.cache.clear();
 this.multiCache.clear();
 }
 }
 startCleanup() {
 if (this.cleanupInterval) return;
 const cleanupFn = () => {
 const now = Date.now();
 let deletedCount = 0;
 const maxDeletesPerRun = 50;
 for (const [key, value] of this.cache.entries()) {
 if (
 now - value.timestamp > this.maxAge ||
 (value.element && !this.isElementInDOM(value.element))
 ) {
 this.cache.delete(key);
 deletedCount++;
 if (deletedCount >= maxDeletesPerRun) break;
 }
 }
 };
 this.cleanupInterval = setInterval(() => {
 if (typeof requestIdleCallback !== 'undefined') {
 requestIdleCallback(cleanupFn, { timeout: 1000 });
 } else {
 cleanupFn();
 }
 }, 5000);
 }
 destroy() {
 if (this.cleanupInterval) {
 clearInterval(this.cleanupInterval);
 this.cleanupInterval = null;
 }
 this.cache.clear();
 this.multiCache.clear();
 if (this.sharedObserver) {
 this.sharedObserver.disconnect();
 this.sharedObserver = null;
 }
 this.observerCallbacks.clear();
 }
 getStats() {
 return {
 size: this.cache.size,
 multiSize: this.multiCache.size,
 enabled: this.enabled,
 };
 }
 initSharedObserver() {
 if (this.sharedObserver) return;
 this.sharedObserver = new MutationObserver(mutations => {
 if (this.observerCallbacks.size === 0) return;
 for (const callback of this.observerCallbacks) {
 callback(mutations);
 }
 });
 this.sharedObserver.observe(document.body || document.documentElement, {
 childList: true,
 subtree: true,
 });
 }
 }
 class ScopedDOMCache {
 constructor() {
 this.scopedCaches = new Map();
 }
 getScope(scope) {
 if (!this.scopedCaches.has(scope)) {
 this.scopedCaches.set(scope, new WeakMap());
 }
 return this.scopedCaches.get(scope);
 }
 set(scope, element, value) {
 this.getScope(scope).set(element, value);
 }
 get(scope, element) {
 return this.getScope(scope).get(element);
 }
 has(scope, element) {
 return this.getScope(scope).has(element);
 }
 }
 const OptimizedSelectors = {
 player: '#movie_player',
 video: 'video.video-stream.html5-main-video',
 videoAlt: '#movie_player video',
 chromeBottom: '.ytp-chrome-bottom',
 watchFlexy: 'ytd-watch-flexy',
 secondary: '#secondary',
 rightTabs: '#right-tabs',
 playlistPanel: 'ytd-playlist-panel-renderer',
 tabInfo: '#tab-info',
 tabComments: '#tab-comments',
 tabVideos: '#tab-videos',
 likeButton: 'like-button-view-model button',
 dislikeButton: 'dislike-button-view-model button',
 subscribeButton: '#subscribe-button',
 shorts: 'ytd-shorts',
 activeReel: 'ytd-reel-video-renderer[is-active]',
 masthead: 'ytd-masthead',
 ytdApp: 'ytd-app',
 };
 function batchQuery(queries) {
 return queries.map(({ selector, multi = false, context = document }) => {
 if (multi) {
 return Array.from(context.querySelectorAll(selector));
 }
 return context.querySelector(selector);
 });
 }
 const globalCache = new DOMCache();
 const scopedCache = new ScopedDOMCache();
 function waitForElement(selector, timeout = 5000, context = document) {
 return new Promise(resolve => {
 const existing = context.querySelector(selector);
 if (existing) {
 resolve(existing);
 return;
 }
 const useShared = context === document || context === document.body;
 if (useShared) {
 globalCache.initSharedObserver();
 const checkCallback = () => {
 const element = context.querySelector(selector);
 if (element) {
 globalCache.observerCallbacks.delete(checkCallback);
 resolve(element);
 return true;
 }
 return false;
 };
 globalCache.observerCallbacks.add(checkCallback);
 setTimeout(() => {
 globalCache.observerCallbacks.delete(checkCallback);
 resolve(null);
 }, timeout);
 } else {
 const observer = new MutationObserver(() => {
 const element = context.querySelector(selector);
 if (element) {
 observer.disconnect();
 resolve(element);
 }
 });
 observer.observe(context, {
 childList: true,
 subtree: true,
 });
 setTimeout(() => {
 observer.disconnect();
 resolve(null);
 }, timeout);
 }
 });
 }
 if (typeof window !== 'undefined') {
 window.YouTubeDOMCache = globalCache;
 window.YouTubeScopedCache = scopedCache;
 window.YouTubeSelectors = OptimizedSelectors;
 window.batchQueryDOM = batchQuery;
 window.waitForElement = waitForElement;
 if (window.YouTubeUtils) {
 window.YouTubeUtils.domCache = globalCache;
 window.YouTubeUtils.scopedCache = scopedCache;
 window.YouTubeUtils.selectors = OptimizedSelectors;
 window.YouTubeUtils.batchQuery = batchQuery;
 window.YouTubeUtils.waitFor = waitForElement;
 }
 }
 if (typeof window !== 'undefined' && window.addEventListener) {
 window.addEventListener('yt-navigate-finish', () => {
 globalCache.invalidate();
 });
 window.addEventListener('spfdone', () => {
 globalCache.invalidate();
 });
 }
 if (typeof window !== 'undefined' && window.addEventListener) {
 window.addEventListener('beforeunload', () => {
 globalCache.destroy();
 });
 }
})();
if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
 const s = s => s;
 trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
}
const defaultPolicy = (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy) || {
 createHTML: s => s,
};
function createHTML(s) {
 return defaultPolicy.createHTML(s);
}
let trustHTMLErr = null;
try {
 document.createElement('div').innerHTML = createHTML('1');
} catch (e) {
 trustHTMLErr = e;
}
if (trustHTMLErr) {
 console.log(`trustHTMLErr`, trustHTMLErr);
 trustHTMLErr();
}
const executionScript = () => {
 const DEBUG_5084 = false;
 const DEBUG_5085 = false;
 const DEBUG_handleNavigateFactory = false;
 const TAB_AUTO_SWITCH_TO_COMMENTS = false;
 if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
 const s = s => s;
 trustedTypes.createPolicy('default', { createHTML: s, createScriptURL: s, createScript: s });
 }
 const defaultPolicy = (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy) || {
 createHTML: s => s,
 };
 function createHTML(s) {
 return defaultPolicy.createHTML(s);
 }
 let trustHTMLErr = null;
 try {
 document.createElement('div').innerHTML = createHTML('1');
 } catch (e) {
 trustHTMLErr = e;
 }
 if (trustHTMLErr) {
 console.log(`trustHTMLErr`, trustHTMLErr);
 trustHTMLErr();
 }
 try {
 let _executionFinished = 0;
 if (typeof CustomElementRegistry === 'undefined') return;
 if (CustomElementRegistry.prototype.define000) return;
 if (typeof CustomElementRegistry.prototype.define !== 'function') return;
 const HTMLElement_ = HTMLElement.prototype.constructor;
 const qsOne = (elm, selector) => {
 if (window.YouTubeDOMCache) {
 return window.YouTubeDOMCache.querySelector(selector, elm);
 }
 return HTMLElement_.prototype.querySelector.call(elm, selector);
 };
 const _qs = selector => {
 if (window.YouTubeDOMCache) {
 return window.YouTubeDOMCache.querySelector(selector, document);
 }
 return document.querySelector(selector);
 };
 function qs(a, b) {
 if (arguments.length === 1) return _qs(a);
 return qsOne(a, b);
 }
 const defineProperties = (p, o) => {
 if (!p) {
 console.warn(`defineProperties ERROR: Prototype is undefined`);
 return;
 }
 for (const k of Object.keys(o)) {
 if (!o[k]) {
 console.warn(`defineProperties ERROR: Property ${k} is undefined`);
 delete o[k];
 }
 }
 return Object.defineProperties(p, o);
 };
 const replaceChildrenPolyfill = function replaceChildren(...new_children) {
 while (this.firstChild) {
 this.removeChild(this.firstChild);
 }
 this.append(...new_children);
 };
 const pdsBaseDF = Object.getOwnPropertyDescriptors(DocumentFragment.prototype);
 if (pdsBaseDF.replaceChildren) {
 defineProperties(DocumentFragment.prototype, {
 replaceChildren000: pdsBaseDF.replaceChildren,
 });
 } else {
 DocumentFragment.prototype.replaceChildren000 = replaceChildrenPolyfill;
 }
 const pdsBaseNode = Object.getOwnPropertyDescriptors(Node.prototype);
 if (!pdsBaseNode.appendChild000 && !pdsBaseNode.insertBefore000) {
 defineProperties(Node.prototype, {
 appendChild000: pdsBaseNode.appendChild,
 insertBefore000: pdsBaseNode.insertBefore,
 });
 }
 const pdsBaseElement = Object.getOwnPropertyDescriptors(Element.prototype);
 if (!pdsBaseElement.setAttribute000 && !pdsBaseElement.querySelector000) {
 const nPdsElement = {
 setAttribute000: pdsBaseElement.setAttribute,
 getAttribute000: pdsBaseElement.getAttribute,
 hasAttribute000: pdsBaseElement.hasAttribute,
 removeAttribute000: pdsBaseElement.removeAttribute,
 querySelector000: pdsBaseElement.querySelector,
 };
 if (pdsBaseElement.replaceChildren) {
 nPdsElement.replaceChildren000 = pdsBaseElement.replaceChildren;
 } else {
 Element.prototype.replaceChildren000 = replaceChildrenPolyfill;
 }
 defineProperties(Element.prototype, nPdsElement);
 }
 Element.prototype.setAttribute111 = function (p, v) {
 v = `${v}`;
 if (this.getAttribute000(p) === v) return;
 this.setAttribute000(p, v);
 };
 Element.prototype.incAttribute111 = function (p) {
 let v = +this.getAttribute000(p) || 0;
 v = v > 1e9 ? v + 1 : 9;
 this.setAttribute000(p, `${v}`);
 return v;
 };
 Element.prototype.assignChildren111 = function (previousSiblings, node, nextSiblings) {
 let nodeList = [];
 for (let t = this.firstChild; t instanceof Node; t = t.nextSibling) {
 if (t === node) continue;
 nodeList.push(t);
 }
 inPageRearrange = true;
 if (node.parentNode === this) {
 let fm = new DocumentFragment();
 if (nodeList.length > 0) {
 fm.replaceChildren000(...nodeList);
 }
 if (previousSiblings && previousSiblings.length > 0) {
 fm.replaceChildren000(...previousSiblings);
 this.insertBefore000(fm, node);
 }
 if (nextSiblings && nextSiblings.length > 0) {
 fm.replaceChildren000(...nextSiblings);
 this.appendChild000(fm);
 }
 fm.replaceChildren000();
 fm = null;
 } else {
 if (!previousSiblings) previousSiblings = [];
 if (!nextSiblings) nextSiblings = [];
 this.replaceChildren000(...previousSiblings, node, ...nextSiblings);
 }
 inPageRearrange = false;
 if (nodeList.length > 0) {
 for (const t of nodeList) {
 if (t instanceof Element && t.isConnected === false) t.remove();
 }
 }
 nodeList.length = 0;
 nodeList = null;
 };
 let secondaryInnerHold = 0;
 const secondaryInnerFn = cb => {
 if (secondaryInnerHold) {
 secondaryInnerHold++;
 let err, r;
 try {
 r = cb();
 } catch (e) {
 err = e;
 }
 secondaryInnerHold--;
 if (err) throw err;
 return r;
 } else {
 const ea = document.querySelector('#secondary-inner');
 const eb = document.querySelector('secondary-wrapper#secondary-inner-wrapper');
 if (ea && eb) {
 secondaryInnerHold++;
 let err, r;
 ea.id = 'secondary-inner-';
 eb.id = 'secondary-inner';
 try {
 r = cb();
 } catch (e) {
 err = e;
 }
 ea.id = 'secondary-inner';
 eb.id = 'secondary-inner-wrapper';
 secondaryInnerHold--;
 if (err) throw err;
 return r;
 } else {
 return cb();
 }
 }
 };
 const DISABLE_FLAGS_SHADYDOM_FREE = true;
 (() => {
 const e =
 'undefined' != typeof unsafeWindow ? unsafeWindow : this instanceof Window ? this : window;
 if (!e._ytConfigHacks) {
 let t = 4;
 class n extends Set {
 add(e) {
 if (t <= 0) {
 return console.warn('yt.config_ is already applied on the page.');
 }
 'function' == typeof e && super.add(e);
 }
 }
 let a = (async () => {})().constructor,
 i = (e._ytConfigHacks = new n()),
 l = () => {
 const t = e.ytcsi.originalYtcsi;
 t && ((e.ytcsi = t), (l = null));
 },
 c = null,
 o = () => {
 if (t >= 1) {
 const n = (e.yt || 0).config_ || (e.ytcfg || 0).data_ || 0;
 if ('string' == typeof n.INNERTUBE_API_KEY && 'object' == typeof n.EXPERIMENT_FLAGS) {
 for (const a of (--t <= 0 && l && l(), (c = !0), i)) a(n);
 }
 }
 },
 f = 1,
 d = t => {
 if ((t = t || e.ytcsi)) {
 return (
 (e.ytcsi = new Proxy(t, {
 get: (e, t, _n) =>
 'originalYtcsi' === t ? e : (o(), c && --f <= 0 && l && l(), e[t]),
 })),
 !0
 );
 }
 };
 d() ||
 Object.defineProperty(e, 'ytcsi', {
 get() {},
 set: t => (t && (delete e.ytcsi, d(t)), !0),
 enumerable: !1,
 configurable: !0,
 });
 const { addEventListener: s, removeEventListener: y } = Document.prototype;
 function r(t) {
 (o(), t && e.removeEventListener('DOMContentLoaded', r, !1));
 }
 (new a(e => {
 if ('undefined' != typeof AbortSignal) {
 (s.call(document, 'yt-page-data-fetched', e, { once: !0 }),
 s.call(document, 'yt-navigate-finish', e, { once: !0 }),
 s.call(document, 'spfdone', e, { once: !0 }));
 } else {
 const t = () => {
 (e(),
 y.call(document, 'yt-page-data-fetched', t, !1),
 y.call(document, 'yt-navigate-finish', t, !1),
 y.call(document, 'spfdone', t, !1));
 };
 (s.call(document, 'yt-page-data-fetched', t, !1),
 s.call(document, 'yt-navigate-finish', t, !1),
 s.call(document, 'spfdone', t, !1));
 }
 }).then(o),
 new a(e => {
 if ('undefined' != typeof AbortSignal) {
 s.call(document, 'yt-action', e, { once: !0, capture: !0 });
 } else {
 const t = () => {
 (e(), y.call(document, 'yt-action', t, !0));
 };
 s.call(document, 'yt-action', t, !0);
 }
 }).then(o),
 a.resolve().then(() => {
 'loading' !== document.readyState ? r() : e.addEventListener('DOMContentLoaded', r, !1);
 }));
 }
 })();
 let configOnce = false;
 window._ytConfigHacks.add(config_ => {
 if (configOnce) return;
 configOnce = true;
 const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS || 0;
 const EXPERIMENTS_FORCED_FLAGS = config_.EXPERIMENTS_FORCED_FLAGS || 0;
 for (const flags of [EXPERIMENT_FLAGS, EXPERIMENTS_FORCED_FLAGS]) {
 if (flags) {
 flags.web_watch_chat_hide_button_killswitch = false;
 flags.web_watch_theater_chat = false;
 flags.suppress_error_204_logging = true;
 flags.kevlar_watch_grid = false;
 if (DISABLE_FLAGS_SHADYDOM_FREE) {
 flags.enable_shadydom_free_scoped_node_methods = false;
 flags.enable_shadydom_free_scoped_query_methods = false;
 flags.enable_shadydom_free_scoped_readonly_properties_batch_one = false;
 flags.enable_shadydom_free_parent_node = false;
 flags.enable_shadydom_free_children = false;
 flags.enable_shadydom_free_last_child = false;
 }
 }
 }
 });
 const mWeakRef =
 typeof WeakRef === 'function' ? o => (o ? new WeakRef(o) : null) : o => o || null;
 const kRef = wr => (wr && wr.deref ? wr.deref() : wr);
 const Promise = (async () => {})().constructor;
 const delayPn = delay => new Promise(fn => setTimeout(fn, delay));
 const insp = o => (o ? o.polymerController || o.inst || o || 0 : o || 0);
 const setTimeout_ = setTimeout.bind(window);
 const PromiseExternal = ((resolve_, reject_) => {
 const h = (resolve, reject) => {
 resolve_ = resolve;
 reject_ = reject;
 };
 return class PromiseExternal extends Promise {
 constructor(cb = h) {
 super(cb);
 if (cb === h) {
 this.resolve = resolve_;
 this.reject = reject_;
 }
 }
 };
 })();
 var nextBrowserTick =
 void 0 !== nextBrowserTick && nextBrowserTick.version >= 2
 ? nextBrowserTick
 : (() => {
 'use strict';
 const e =
 typeof globalThis !== 'undefined'
 ? globalThis
 : typeof window !== 'undefined'
 ? window
 : this;
 let t = !0;
 if (
 !(function n(s) {
 return s
 ? (t = !1)
 : e.postMessage && !e.importScripts && e.addEventListener
 ? (e.addEventListener('message', n, !1),
 e.postMessage('$$$', '*'),
 e.removeEventListener('message', n, !1),
 t)
 : void 0;
 })()
 ) {
 return void console.warn('Your browser environment cannot use nextBrowserTick');
 }
 const n = (async () => {})().constructor;
 let s = null;
 const o = new Map(),
 { floor: r, random: i } = Math;
 let l;
 do {
 l = `$$nextBrowserTick$$${(i() + 8).toString().slice(2)}$$`;
 } while (l in e);
 const a = l,
 c = a.length + 9;
 e[a] = 1;
 e.addEventListener(
 'message',
 e => {
 if (0 !== o.size) {
 const t = (e || 0).data;
 if ('string' == typeof t && t.length === c && e.source === (e.target || 1)) {
 const e = o.get(t);
 e && ('p' === t[0] && (s = null), o.delete(t), e());
 }
 }
 },
 !1
 );
 const d = (t = o) => {
 if (t === o) {
 if (s) return s;
 let t;
 do {
 t = `p${a}${r(314159265359 * i() + 314159265359).toString(36)}`;
 } while (o.has(t));
 return (
 (s = new n(e => {
 o.set(t, e);
 })),
 e.postMessage(t, '*'),
 (t = null),
 s
 );
 }
 {
 let n;
 do {
 n = `f${a}${r(314159265359 * i() + 314159265359).toString(36)}`;
 } while (o.has(n));
 (o.set(n, t), e.postMessage(n, '*'));
 }
 };
 return ((d.version = 2), d);
 })();
 const isPassiveArgSupport = typeof IntersectionObserver === 'function';
 const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;
 class Attributer {
 constructor(list) {
 this.list = list;
 this.flag = 0;
 }
 makeString() {
 let k = 1;
 let s = '';
 let i = 0;
 while (this.flag >= k) {
 if (this.flag & k) {
 s += this.list[i];
 }
 i++;
 k <<= 1;
 }
 return s;
 }
 }
 const mLoaded = new Attributer('icp');
 const wrSelfMap = new WeakMap();
 const elements = new Proxy(
 {
 related: null,
 comments: null,
 infoExpander: null,
 },
 {
 get(target, prop) {
 return kRef(target[prop]);
 },
 set(target, prop, value) {
 if (value) {
 let wr = wrSelfMap.get(value);
 if (!wr) {
 wr = mWeakRef(value);
 wrSelfMap.set(value, wr);
 }
 target[prop] = wr;
 } else {
 target[prop] = null;
 }
 return true;
 },
 }
 );
 const getMainInfo = () => {
 const infoExpander = elements.infoExpander;
 if (!infoExpander) return null;
 const mainInfo = infoExpander.matches('[tyt-main-info]')
 ? infoExpander
 : infoExpander.querySelector000('[tyt-main-info]');
 return mainInfo || null;
 };
 let pageType = null;
 let pageLang = 'en';
 const langWords = {
 en: {
 info: 'Info',
 videos: 'Videos',
 playlist: 'Playlist',
 },
 jp: {
 info: '情報',
 videos: '動画',
 playlist: '再生リスト',
 },
 tw: {
 info: '資訊',
 videos: '影片',
 playlist: '播放清單',
 },
 cn: {
 info: '资讯',
 videos: '视频',
 playlist: '播放列表',
 },
 du: {
 info: 'Info',
 videos: 'Videos',
 playlist: 'Playlist',
 },
 fr: {
 info: 'Info',
 videos: 'Vidéos',
 playlist: 'Playlist',
 },
 kr: {
 info: '정보',
 videos: '동영상',
 playlist: '재생목록',
 },
 ru: {
 info: 'Описание',
 videos: 'Видео',
 playlist: 'Плейлист',
 },
 };
 const svgComments =
 `<path d="M80 27H12A12 12 90 0 0 0 39v42a12 12 90 0 0 12 12h12v20a2 2 90 0 0 3.4 2L47 93h33a12
 12 90 0 0 12-12V39a12 12 90 0 0-12-12zM20 47h26a2 2 90 1 1 0 4H20a2 2 90 1 1 0-4zm52 28H20a2 2 90 1 1 0-4h52a2 2 90
 1 1 0 4zm0-12H20a2 2 90 1 1 0-4h52a2 2 90 1 1 0 4zm36-58H40a12 12 90 0 0-12 12v6h52c9 0 16 7 16 16v42h0v4l7 7a2 2 90
 0 0 3-1V71h2a12 12 90 0 0 12-12V17a12 12 90 0 0-12-12z"/>`.trim();
 const svgVideos =
 `<path d="M89 10c0-4-3-7-7-7H7c-4 0-7 3-7 7v70c0 4 3 7 7 7h75c4 0 7-3 7-7V10zm-62 2h13v10H27V12zm-9
 66H9V68h9v10zm0-56H9V12h9v10zm22 56H27V68h13v10zm-3-25V36c0-2 2-3 4-2l12 8c2 1 2 4 0 5l-12 8c-2 1-4 0-4-2zm25
 25H49V68h13v10zm0-56H49V12h13v10zm18 56h-9V68h9v10zm0-56h-9V12h9v10z"/>`.trim();
 const svgInfo =
 `<path d="M30 0C13.3 0 0 13.3 0 30s13.3 30 30 30 30-13.3 30-30S46.7 0 30 0zm6.2 46.6c-1.5.5-2.6
 1-3.6 1.3a10.9 10.9 0 0 1-3.3.5c-1.7 0-3.3-.5-4.3-1.4a4.68 4.68 0 0 1-1.6-3.6c0-.4.2-1 .2-1.5a20.9 20.9 90 0 1
 .3-2l2-6.8c.1-.7.3-1.3.4-1.9a8.2 8.2 90 0 0 .3-1.6c0-.8-.3-1.4-.7-1.8s-1-.5-2-.5a4.53 4.53 0 0 0-1.6.3c-.5.2-1
 .2-1.3.4l.6-2.1c1.2-.5 2.4-1 3.5-1.3s2.3-.6 3.3-.6c1.9 0 3.3.6 4.3 1.3s1.5 2.1 1.5 3.5c0 .3 0 .9-.1 1.6a10.4 10.4
 90 0 1-.4 2.2l-1.9 6.7c-.2.5-.2 1.1-.4 1.8s-.2 1.3-.2 1.6c0 .9.2 1.6.6 1.9s1.1.5 2.1.5a6.1 6.1 90 0 0 1.5-.3 9 9 90
 0 0 1.4-.4l-.6 2.2zm-3.8-35.2a1 1 0 010 8.6 1 1 0 010-8.6z"/>`.trim();
 const svgPlayList =
 `<path d="M0 3h12v2H0zm0 4h12v2H0zm0 4h8v2H0zm16 0V7h-2v4h-4v2h4v4h2v-4h4v-2z"/>`.trim();
 function getWord(tag) {
 return langWords[pageLang][tag] || langWords['en'][tag] || '';
 }
 const svgElm = (w, h, vw, vh, p, m) =>
 `<svg${m ? ` class=${m}` : ''} width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${p}</svg>`;
 const hiddenTabsByUserCSS = 0;
 function getTabsHTML() {
 const sTabBtnVideos = `${svgElm(16, 16, 90, 90, svgVideos)}<span>${getWord('videos')}</span>`;
 const sTabBtnInfo = `${svgElm(16, 16, 60, 60, svgInfo)}<span>${getWord('info')}</span>`;
 const sTabBtnPlayList = `${svgElm(16, 16, 20, 20, svgPlayList)}<span>${getWord('playlist')}</span>`;
 const str1 = `
 <paper-ripple class="style-scope yt-icon-button">
 <div id="background" class="style-scope paper-ripple" style="opacity:0;"></div>
 <div id="waves" class="style-scope paper-ripple"></div>
 </paper-ripple>
 `;
 const str_fbtns = `
 <div class="font-size-right">
 <div class="font-size-btn font-size-plus" tyt-di="8rdLQ">
 <svg width="12" height="12" viewbox="0 0 50 50" preserveAspectRatio="xMidYMid meet"
 stroke="currentColor" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-size">
 <path d="M12 25H38M25 12V38"/>
 </svg>
 </div><div class="font-size-btn font-size-minus" tyt-di="8rdLQ">
 <svg width="12" height="12" viewbox="0 0 50 50" preserveAspectRatio="xMidYMid meet"
 stroke="currentColor" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-size">
 <path d="M12 25h26"/>
 </svg>
 </div>
 </div>
 `.replace(/[\r\n]+/g, '');
 const str_tabs = [
 `<a id="tab-btn1" tyt-di="q9Kjc" tyt-tab-content="#tab-info" class="tab-btn${(hiddenTabsByUserCSS & 1) === 1 ? ' tab-btn-hidden' : ''}">${sTabBtnInfo}${str1}${str_fbtns}</a>`,
 `<a id="tab-btn3" tyt-di="q9Kjc" tyt-tab-content="#tab-comments" class="tab-btn${(hiddenTabsByUserCSS & 2) === 2 ? ' tab-btn-hidden' : ''}">${svgElm(16, 16, 120, 120, svgComments)}<span id="tyt-cm-count"></span>${str1}${str_fbtns}</a>`,
 `<a id="tab-btn4" tyt-di="q9Kjc" tyt-tab-content="#tab-videos" class="tab-btn${(hiddenTabsByUserCSS & 4) === 4 ? ' tab-btn-hidden' : ''}">${sTabBtnVideos}${str1}${str_fbtns}</a>`,
 `<a id="tab-btn5" tyt-di="q9Kjc" tyt-tab-content="#tab-list" class="tab-btn tab-btn-hidden">${sTabBtnPlayList}${str1}${str_fbtns}</a>`,
 ].join('');
 const addHTML = `
 <div id="right-tabs">
 <tabview-view-pos-thead></tabview-view-pos-thead>
 <header>
 <div id="material-tabs">
 ${str_tabs}
 </div>
 </header>
 <div class="tab-content">
 <div id="tab-info" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
 <div id="tab-comments" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
 <div id="tab-videos" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
 <div id="tab-list" class="tab-content-cld tab-content-hidden" tyt-hidden userscript-scrollbar-render></div>
 </div>
 </div>
 `;
 return addHTML;
 }
 function getLang() {
 let lang = 'en';
 const htmlLang = ((document || 0).documentElement || 0).lang || '';
 switch (htmlLang) {
 case 'en':
 case 'en-GB':
 lang = 'en';
 break;
 case 'de':
 case 'de-DE':
 lang = 'du';
 break;
 case 'fr':
 case 'fr-CA':
 case 'fr-FR':
 lang = 'fr';
 break;
 case 'zh-Hant':
 case 'zh-Hant-HK':
 case 'zh-Hant-TW':
 lang = 'tw';
 break;
 case 'zh-Hans':
 case 'zh-Hans-CN':
 lang = 'cn';
 break;
 case 'ja':
 case 'ja-JP':
 lang = 'jp';
 break;
 case 'ko':
 case 'ko-KR':
 lang = 'kr';
 break;
 case 'ru':
 case 'ru-RU':
 lang = 'ru';
 break;
 default:
 lang = 'en';
 }
 return lang;
 }
 function getLangForPage() {
 const lang = getLang();
 if (langWords[lang]) pageLang = lang;
 else pageLang = 'en';
 }
 const _locks = {};
 const lockGet = new Proxy(_locks, {
 get(target, prop) {
 return target[prop] || 0;
 },
 set(_target, _prop, _val) {
 return true;
 },
 });
 const lockSet = new Proxy(_locks, {
 get(target, prop) {
 if (target[prop] > 1e9) target[prop] = 9;
 return (target[prop] = (target[prop] || 0) + 1);
 },
 set(_target, _prop, _val) {
 return true;
 },
 });
 const videosElementProvidedPromise = new PromiseExternal();
 const navigateFinishedPromise = new PromiseExternal();
 let isRightTabsInserted = false;
 const rightTabsProvidedPromise = new PromiseExternal();
 const infoExpanderElementProvidedPromise = new PromiseExternal();
 const pluginsDetected = {};
 const pluginDetectObserver = new MutationObserver(mutations => {
 let changeOnRoot = false;
 const newPlugins = [];
 const attributeChangedSet = new Set();
 for (const mutation of mutations) {
 if (mutation.target === document) changeOnRoot = true;
 let detected = '';
 switch (mutation.attributeName) {
 case 'data-ytlstm-new-layout':
 case 'data-ytlstm-overlay-text-shadow':
 case 'data-ytlstm-theater-mode':
 detected = 'external.ytlstm';
 attributeChangedSet.add(detected);
 break;
 }
 if (detected && !pluginsDetected[detected]) {
 pluginsDetected[detected] = true;
 newPlugins.push(detected);
 }
 }
 if (elements.flexy && attributeChangedSet.has('external.ytlstm')) {
 elements.flexy.setAttribute(
 'tyt-external-ytlstm',
 document.querySelector('[data-ytlstm-theater-mode]') ? '1' : '0'
 );
 }
 if (changeOnRoot) {
 pluginDetectObserver.observe(document.body, { attributes: true });
 }
 for (const detected of newPlugins) {
 const pluginItem = plugin[`${detected}`];
 if (pluginItem) {
 pluginItem.activate();
 } else {
 console.warn(`No Plugin Activator for ${detected}`);
 }
 }
 });
 pluginDetectObserver.observe(document.documentElement, { attributes: true });
 if (document.body) pluginDetectObserver.observe(document.body, { attributes: true });
 navigateFinishedPromise.then(() => {
 pluginDetectObserver.observe(document.documentElement, { attributes: true });
 if (document.body) pluginDetectObserver.observe(document.body, { attributes: true });
 });
 const funcCanCollapse = function (_s) {
 const content = this.content || this.$.content;
 this.canToggle =
 this.shouldUseNumberOfLines &&
 (this.alwaysCollapsed || this.collapsed || this.isToggled === false)
 ? this.alwaysToggleable ||
 this.isToggled ||
 (content && content.offsetHeight < content.scrollHeight)
 : this.alwaysToggleable ||
 this.isToggled ||
 (content && content.scrollHeight > this.collapsedHeight);
 };
 const aoChatAttrChangeFn = async lockId => {
 if (lockGet['aoChatAttrAsyncLock'] !== lockId) return;
 const chatElm = elements.chat;
 const ytdFlexyElm = elements.flexy;
 if (chatElm && ytdFlexyElm) {
 const isChatCollapsed = chatElm.hasAttribute000('collapsed');
 if (isChatCollapsed) {
 ytdFlexyElm.setAttribute111('tyt-chat-collapsed', '');
 } else {
 ytdFlexyElm.removeAttribute000('tyt-chat-collapsed');
 }
 ytdFlexyElm.setAttribute111('tyt-chat', isChatCollapsed ? '-' : '+');
 }
 };
 const aoPlayListAttrChangeFn = async lockId => {
 if (lockGet['aoPlayListAttrAsyncLock'] !== lockId) return;
 const playlistElm = elements.playlist;
 const ytdFlexyElm = elements.flexy;
 let doAttributeChange = 0;
 if (playlistElm && ytdFlexyElm) {
 if (playlistElm.closest('[hidden]')) {
 doAttributeChange = 2;
 } else if (playlistElm.hasAttribute000('collapsed')) {
 doAttributeChange = 2;
 } else {
 doAttributeChange = 1;
 }
 } else if (ytdFlexyElm) {
 doAttributeChange = 2;
 }
 if (doAttributeChange === 1) {
 if (ytdFlexyElm.getAttribute000('tyt-playlist-expanded') !== '') {
 ytdFlexyElm.setAttribute111('tyt-playlist-expanded', '');
 }
 } else if (doAttributeChange === 2) {
 if (ytdFlexyElm.hasAttribute000('tyt-playlist-expanded')) {
 ytdFlexyElm.removeAttribute000('tyt-playlist-expanded');
 }
 }
 };
 const aoChat = new MutationObserver(() => {
 Promise.resolve(lockSet['aoChatAttrAsyncLock']).then(aoChatAttrChangeFn).catch(console.warn);
 });
 const aoPlayList = new MutationObserver(() => {
 Promise.resolve(lockSet['aoPlayListAttrAsyncLock'])
 .then(aoPlayListAttrChangeFn)
 .catch(console.warn);
 });
 let aoCommentThrottleTimer = null;
 let aoCommentPendingMutations = [];
 const aoComment = new MutationObserver(async mutations => {
 aoCommentPendingMutations.push(...mutations);
 if (aoCommentThrottleTimer) return;
 aoCommentThrottleTimer = setTimeout(() => {
 aoCommentThrottleTimer = null;
 const allMutations = aoCommentPendingMutations;
 aoCommentPendingMutations = [];
 processCommentMutations(allMutations);
 }, 50);
 });
 const processCommentMutations = async mutations => {
 const commentsArea = elements.comments;
 const ytdFlexyElm = elements.flexy;
 if (!commentsArea) return;
 let bfHidden = false;
 let bfCommentsVideoId = false;
 let bfCommentDisabled = false;
 for (const mutation of mutations) {
 if (mutation.attributeName === 'hidden' && mutation.target === commentsArea) {
 bfHidden = true;
 } else if (
 mutation.attributeName === 'tyt-comments-video-id' &&
 mutation.target === commentsArea
 ) {
 bfCommentsVideoId = true;
 } else if (
 mutation.attributeName === 'tyt-comments-data-status' &&
 mutation.target === commentsArea
 ) {
 bfCommentDisabled = true;
 }
 }
 if (bfHidden) {
 if (!commentsArea.hasAttribute000('hidden')) {
 Promise.resolve(commentsArea)
 .then(eventMap['settingCommentsVideoId'])
 .catch(console.warn);
 }
 Promise.resolve(lockSet['removeKeepCommentsScrollerLock'])
 .then(removeKeepCommentsScroller)
 .catch(console.warn);
 }
 if ((bfHidden || bfCommentsVideoId || bfCommentDisabled) && ytdFlexyElm) {
 const commentsDataStatus = +commentsArea.getAttribute000('tyt-comments-data-status');
 if (commentsDataStatus === 2) {
 ytdFlexyElm.setAttribute111('tyt-comment-disabled', '');
 } else if (commentsDataStatus === 1) {
 ytdFlexyElm.removeAttribute000('tyt-comment-disabled');
 }
 Promise.resolve(lockSet['checkCommentsShouldBeHiddenLock'])
 .then(eventMap['checkCommentsShouldBeHidden'])
 .catch(console.warn);
 const lockId = lockSet['rightTabReadyLock01'];
 await rightTabsProvidedPromise.then();
 if (lockGet['rightTabReadyLock01'] !== lockId) return;
 if (elements.comments !== commentsArea) return;
 if (commentsArea.isConnected === false) return;
 if (commentsArea.closest('#tab-comments')) {
 const shouldTabVisible = !commentsArea.closest('[hidden]');
 document
 .querySelector('[tyt-tab-content="#tab-comments"]')
 .classList.toggle('tab-btn-hidden', !shouldTabVisible);
 }
 }
 };
 const ioComment = new IntersectionObserver(
 entries => {
 requestAnimationFrame(() => {
 for (const entry of entries) {
 const target = entry.target;
 const cnt = insp(target);
 if (
 entry.isIntersecting &&
 target instanceof HTMLElement_ &&
 typeof cnt.calculateCanCollapse === 'function'
 ) {
 void lockSet['removeKeepCommentsScrollerLock'];
 cnt.calculateCanCollapse(true);
 target.setAttribute111('io-intersected', '');
 const ytdFlexyElm = elements.flexy;
 if (ytdFlexyElm && !ytdFlexyElm.hasAttribute000('keep-comments-scroller')) {
 ytdFlexyElm.setAttribute111('keep-comments-scroller', '');
 }
 } else if (target.hasAttribute000('io-intersected')) {
 target.removeAttribute000('io-intersected');
 }
 }
 });
 },
 {
 threshold: [0],
 rootMargin: '100px',
 }
 );
 let bFixForResizedTabLater = false;
 let lastRoRightTabsWidth = 0;
 let resizeDebounceTimer = null;
 const roRightTabs = new ResizeObserver(entries => {
 if (resizeDebounceTimer) return;
 resizeDebounceTimer = setTimeout(() => {
 resizeDebounceTimer = null;
 const entry = entries[entries.length - 1];
 const width = Math.round(entry.borderBoxSize.inlineSize);
 if (lastRoRightTabsWidth !== width) {
 lastRoRightTabsWidth = width;
 if ((tabAStatus & 2) === 2) {
 bFixForResizedTabLater = false;
 Promise.resolve(1).then(eventMap['fixForTabDisplay']);
 } else {
 bFixForResizedTabLater = true;
 }
 }
 }, 100);
 });
 let cachedTabLinks = null;
 let cachedTabContents = new Map();
 const switchToTab = activeLink => {
 if (typeof activeLink === 'string') {
 activeLink = document.querySelector(`a[tyt-tab-content="${activeLink}"]`) || null;
 }
 const ytdFlexyElm = elements.flexy;
 if (!cachedTabLinks || cachedTabLinks.length === 0 || !cachedTabLinks[0].isConnected) {
 cachedTabLinks = document.querySelectorAll('#material-tabs a[tyt-tab-content]');
 cachedTabContents.clear();
 }
 const links = cachedTabLinks;
 for (const link of links) {
 let content = cachedTabContents.get(link);
 if (!content || !content.isConnected) {
 content = document.querySelector(link.getAttribute000('tyt-tab-content'));
 if (content) cachedTabContents.set(link, content);
 }
 if (link && content) {
 if (link !== activeLink) {
 link.classList.remove('active');
 content.classList.add('tab-content-hidden');
 if (!content.hasAttribute000('tyt-hidden')) {
 content.setAttribute111('tyt-hidden', '');
 }
 } else {
 link.classList.add('active');
 if (content.hasAttribute000('tyt-hidden')) {
 content.removeAttribute000('tyt-hidden');
 }
 content.classList.remove('tab-content-hidden');
 }
 }
 }
 const switchingTo = activeLink ? activeLink.getAttribute000('tyt-tab-content') : '';
 if (switchingTo) {
 lastTab = lastPanel = switchingTo;
 }
 if (ytdFlexyElm.getAttribute000('tyt-chat') === '') {
 ytdFlexyElm.removeAttribute000('tyt-chat');
 }
 ytdFlexyElm.setAttribute111('tyt-tab', switchingTo);
 if (switchingTo) {
 bFixForResizedTabLater = false;
 Promise.resolve(0).then(eventMap['fixForTabDisplay']);
 }
 };
 let tabAStatus = 0;
 const calculationFn = (r = 0, flag) => {
 const ytdFlexyElm = elements.flexy;
 if (!ytdFlexyElm) return r;
 if (flag & 1) {
 r |= 1;
 if (!ytdFlexyElm.hasAttribute000('theater')) r -= 1;
 }
 if (flag & 2) {
 r |= 2;
 if (!ytdFlexyElm.getAttribute000('tyt-tab')) r -= 2;
 }
 if (flag & 4) {
 r |= 4;
 if (ytdFlexyElm.getAttribute000('tyt-chat') !== '-') r -= 4;
 }
 if (flag & 8) {
 r |= 8;
 if (ytdFlexyElm.getAttribute000('tyt-chat') !== '+') r -= 8;
 }
 if (flag & 16) {
 r |= 16;
 if (!ytdFlexyElm.hasAttribute000('is-two-columns_')) r -= 16;
 }
 if (flag & 32) {
 r |= 32;
 if (!ytdFlexyElm.hasAttribute000('tyt-egm-panel_')) r -= 32;
 }
 if (flag & 64) {
 r |= 64;
 if (!document.fullscreenElement) r -= 64;
 }
 if (flag & 128) {
 r |= 128;
 if (!ytdFlexyElm.hasAttribute000('tyt-playlist-expanded')) r -= 128;
 }
 if (flag & 4096) {
 r |= 4096;
 if (ytdFlexyElm.getAttribute('tyt-external-ytlstm') !== '1') r -= 4096;
 }
 return r;
 };
 function isTheater() {
 const ytdFlexyElm = elements.flexy;
 return ytdFlexyElm && ytdFlexyElm.hasAttribute000('theater');
 }
 function ytBtnCancelTheater() {
 if (isTheater()) {
 const sizeBtn = document.querySelector(
 'ytd-watch-flexy #ytd-player button.ytp-size-button'
 );
 if (sizeBtn) sizeBtn.click();
 }
 }
 function getSuitableElement(selector) {
 const elements = document.querySelectorAll(selector);
 let j = -1,
 h = -1;
 for (let i = 0, l = elements.length; i < l; i++) {
 const d = elements[i].getElementsByTagName('*').length;
 if (d > h) {
 h = d;
 j = i;
 }
 }
 return j >= 0 ? elements[j] : null;
 }
 function ytBtnExpandChat() {
 const dom = getSuitableElement('ytd-live-chat-frame#chat');
 const cnt = insp(dom);
 if (cnt && typeof cnt.collapsed === 'boolean') {
 if (typeof cnt.setCollapsedState === 'function') {
 cnt.setCollapsedState({
 setLiveChatCollapsedStateAction: {
 collapsed: false,
 },
 });
 if (cnt.collapsed === false) return;
 }
 cnt.collapsed = false;
 if (cnt.collapsed === false) return;
 if (cnt.isHiddenByUser === true && cnt.collapsed === true) {
 cnt.isHiddenByUser = false;
 cnt.collapsed = false;
 }
 }
 let button = document.querySelector(
 'ytd-live-chat-frame#chat[collapsed] > .ytd-live-chat-frame#show-hide-button'
 );
 if (button) {
 button =
 button.querySelector000('div.yt-spec-touch-feedback-shape') ||
 button.querySelector000('ytd-toggle-button-renderer');
 if (button) button.click();
 }
 }
 function ytBtnCollapseChat() {
 const dom = getSuitableElement('ytd-live-chat-frame#chat');
 const cnt = insp(dom);
 if (cnt && typeof cnt.collapsed === 'boolean') {
 if (typeof cnt.setCollapsedState === 'function') {
 cnt.setCollapsedState({
 setLiveChatCollapsedStateAction: {
 collapsed: true,
 },
 });
 if (cnt.collapsed === true) return;
 }
 cnt.collapsed = true;
 if (cnt.collapsed === true) return;
 if (cnt.isHiddenByUser === false && cnt.collapsed === false) {
 cnt.isHiddenByUser = true;
 cnt.collapsed = true;
 }
 }
 let button = document.querySelector(
 'ytd-live-chat-frame#chat:not([collapsed]) > .ytd-live-chat-frame#show-hide-button'
 );
 if (button) {
 button =
 button.querySelector000('div.yt-spec-touch-feedback-shape') ||
 button.querySelector000('ytd-toggle-button-renderer');
 if (button) button.click();
 }
 }
 function ytBtnEgmPanelCore(arr) {
 if (!arr) return;
 if (!('length' in arr)) arr = [arr];
 const ytdFlexyElm = elements.flexy;
 if (!ytdFlexyElm) return;
 let actions = [];
 for (const entry of arr) {
 if (!entry) continue;
 const panelId = entry.panelId;
 const toHide = entry.toHide;
 const toShow = entry.toShow;
 if (toHide === true && !toShow) {
 actions.push({
 changeEngagementPanelVisibilityAction: {
 targetId: panelId,
 visibility: 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN',
 },
 });
 } else if (toShow === true && !toHide) {
 actions.push({
 showEngagementPanelEndpoint: {
 panelIdentifier: panelId,
 },
 });
 }
 if (actions.length > 0) {
 const cnt = insp(ytdFlexyElm);
 cnt.resolveCommand(
 {
 signalServiceEndpoint: {
 signal: 'CLIENT_SIGNAL',
 actions: actions,
 },
 },
 {},
 false
 );
 }
 actions = null;
 }
 }
 function ytBtnCloseEngagementPanels() {
 const actions = [];
 for (const panelElm of document.querySelectorAll(
 `ytd-watch-flexy[tyt-tab] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility]:not([hidden])`
 )) {
 if (
 panelElm.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' &&
 !panelElm.closest('[hidden]')
 ) {
 actions.push({
 panelId: panelElm.getAttribute000('target-id'),
 toHide: true,
 });
 }
 }
 ytBtnEgmPanelCore(actions);
 }
 function ytBtnOpenPlaylist() {
 const cnt = insp(elements.playlist);
 if (cnt && typeof cnt.collapsed === 'boolean') {
 cnt.collapsed = false;
 }
 }
 function ytBtnClosePlaylist() {
 const cnt = insp(elements.playlist);
 if (cnt && typeof cnt.collapsed === 'boolean') {
 cnt.collapsed = true;
 }
 }
 const updateChatLocation498 = function () {
 if (this.is !== 'ytd-watch-grid') {
 secondaryInnerFn(() => {
 this.updatePageMediaQueries();
 this.schedulePlayerSizeUpdate_();
 });
 }
 };
 const mirrorNodeWS = new WeakMap();
 const dummyNode = document.createElement('noscript');
 const __j4836__ = Symbol();
 const __j5744__ = Symbol();
 const __j5733__ = Symbol();
 const monitorDataChangedByDOMMutation = async function (_mutations) {
 const nodeWR = this;
 const node = kRef(nodeWR);
 if (!node) return;
 const cnt = insp(node);
 const __lastChanged__ = cnt[__j5733__];
 const val = cnt.data ? cnt.data[__j4836__] || 1 : 0;
 if (__lastChanged__ !== val) {
 cnt[__j5733__] = val > 0 ? (cnt.data[__j4836__] = Date.now()) : 0;
 await Promise.resolve();
 attributeInc(node, 'tyt-data-change-counter');
 }
 };
 const moChangeReflection = function (mutations) {
 const nodeWR = this;
 const node = kRef(nodeWR);
 if (!node) return;
 const originElement = kRef(node[__j5744__] || null) || null;
 if (!originElement) return;
 const cnt = insp(node);
 const oriCnt = insp(originElement);
 if (mutations) {
 let bfDataChangeCounter = false;
 for (const mutation of mutations) {
 if (
 mutation.attributeName === 'tyt-clone-refresh-count' &&
 mutation.target === originElement
 ) {
 bfDataChangeCounter = true;
 } else if (
 mutation.attributeName === 'tyt-data-change-counter' &&
 mutation.target === originElement
 ) {
 bfDataChangeCounter = true;
 }
 }
 if (bfDataChangeCounter && oriCnt.data) {
 node.replaceWith(dummyNode);
 cnt.data = Object.assign({}, oriCnt.data);
 dummyNode.replaceWith(node);
 }
 }
 };
 const attributeInc = (elm, prop) => {
 let v = (+elm.getAttribute000(prop) || 0) + 1;
 if (v > 1e9) v = 9;
 elm.setAttribute000(prop, v);
 return v;
 };
 const isChannelId = x => {
 if (typeof x === 'string' && x.length === 24) {
 return /UC[-_a-zA-Z0-9+=.]{22}/.test(x);
 }
 return false;
 };
 const infoFix = lockId => {
 if (lockId !== null && lockGet['infoFixLock'] !== lockId) return;
 const infoExpander = elements.infoExpander;
 const infoContainer =
 (infoExpander ? infoExpander.parentNode : null) || document.querySelector('#tab-info');
 const ytdFlexyElm = elements.flexy;
 if (!infoContainer || !ytdFlexyElm) return;
 if (infoExpander) {
 const match =
 infoExpander.matches('#tab-info > [class]') ||
 infoExpander.matches('#tab-info > [tyt-main-info]');
 if (!match) return;
 }
 const requireElements = [
 ...document.querySelectorAll(
 'ytd-watch-metadata.ytd-watch-flexy div[slot="extra-content"] > *, ytd-watch-metadata.ytd-watch-flexy #extra-content > *'
 ),
 ]
 .filter(elm => {
 return typeof elm.is == 'string';
 })
 .map(elm => {
 const is = elm.is;
 while (elm instanceof HTMLElement_) {
 const q = [...elm.querySelectorAll(is)].filter(e => insp(e).data);
 if (q.length >= 1) return q[0];
 elm = elm.parentNode;
 }
 })
 .filter(elm => !!elm && typeof elm.is === 'string');
 const source = requireElements.map(entry => {
 const inst = insp(entry);
 return {
 data: inst.data,
 tag: inst.is,
 elm: entry,
 };
 });
 let noscript_ = document.querySelector('noscript#aythl');
 if (!noscript_) {
 noscript_ = document.createElement('noscript');
 noscript_.id = 'aythl';
 inPageRearrange = true;
 ytdFlexyElm.insertBefore000(noscript_, ytdFlexyElm.firstChild);
 inPageRearrange = false;
 }
 const noscript = noscript_;
 let requiredUpdate = false;
 const mirrorElmSet = new Set();
 const targetParent = infoContainer;
 for (const { data, tag: tag, elm: s } of source) {
 let mirrorNode = mirrorNodeWS.get(s);
 mirrorNode = mirrorNode ? kRef(mirrorNode) : mirrorNode;
 if (!mirrorNode) {
 const cnt = insp(s);
 const cProto = cnt.constructor.prototype;
 const element = document.createElement(tag);
 noscript.appendChild(element);
 mirrorNode = element;
 mirrorNode[__j5744__] = mWeakRef(s);
 const nodeWR = mWeakRef(mirrorNode);
 new MutationObserver(moChangeReflection.bind(nodeWR)).observe(s, {
 attributes: true,
 attributeFilter: ['tyt-clone-refresh-count', 'tyt-data-change-counter'],
 });
 s.jy8432 = 1;
 if (
 !(cProto instanceof Node) &&
 !cProto._dataChanged496 &&
 typeof cProto._createPropertyObserver === 'function'
 ) {
 cProto._dataChanged496 = function () {
 const cnt = this;
 const node = cnt.hostElement || cnt;
 if (node.jy8432) {
 attributeInc(node, 'tyt-data-change-counter');
 }
 };
 cProto._createPropertyObserver('data', '_dataChanged496', undefined);
 } else if (
 !(cProto instanceof Node) &&
 !cProto._dataChanged496 &&
 cProto.useSignals === true &&
 insp(s).signalProxy
 ) {
 const dataSignal = cnt?.signalProxy?.signalCache?.data;
 if (
 dataSignal &&
 typeof dataSignal.setWithPath === 'function' &&
 !dataSignal.setWithPath573 &&
 !dataSignal.controller573
 ) {
 dataSignal.controller573 = mWeakRef(cnt);
 dataSignal.setWithPath573 = dataSignal.setWithPath;
 dataSignal.setWithPath = function () {
 const cnt = kRef(this.controller573 || null) || null;
 cnt &&
 typeof cnt._dataChanged496k === 'function' &&
 Promise.resolve(cnt).then(cnt._dataChanged496k).catch(console.warn);
 return this.setWithPath573(...arguments);
 };
 cProto._dataChanged496 = function () {
 const cnt = this;
 const node = cnt.hostElement || cnt;
 if (node.jy8432) {
 attributeInc(node, 'tyt-data-change-counter');
 }
 };
 cProto._dataChanged496k = cnt => cnt._dataChanged496();
 }
 }
 if (!cProto._dataChanged496) {
 new MutationObserver(
 monitorDataChangedByDOMMutation.bind(mirrorNode[__j5744__])
 ).observe(s, { attributes: true, childList: true, subtree: true });
 }
 mirrorNodeWS.set(s, nodeWR);
 requiredUpdate = true;
 } else {
 if (mirrorNode.parentNode !== targetParent) {
 requiredUpdate = true;
 }
 }
 if (!requiredUpdate) {
 const cloneNodeCnt = insp(mirrorNode);
 if (cloneNodeCnt.data !== data) {
 requiredUpdate = true;
 }
 }
 mirrorElmSet.add(mirrorNode);
 source.mirrored = mirrorNode;
 }
 const mirroElmArr = [...mirrorElmSet];
 mirrorElmSet.clear();
 if (!requiredUpdate) {
 let e = infoExpander ? -1 : 0;
 for (let n = targetParent.firstChild; n instanceof Node; n = n.nextSibling) {
 const target = e < 0 ? infoExpander : mirroElmArr[e];
 e++;
 if (n !== target) {
 requiredUpdate = true;
 break;
 }
 }
 if (!requiredUpdate && e !== mirroElmArr.length + 1) requiredUpdate = true;
 }
 if (requiredUpdate) {
 if (infoExpander) {
 targetParent.assignChildren111(null, infoExpander, mirroElmArr);
 } else {
 targetParent.replaceChildren000(...mirroElmArr);
 }
 for (const mirrorElm of mirroElmArr) {
 const j = attributeInc(mirrorElm, 'tyt-clone-refresh-count');
 const oriElm = kRef(mirrorElm[__j5744__] || null) || null;
 if (oriElm) {
 oriElm.setAttribute111('tyt-clone-refresh-count', j);
 }
 }
 }
 mirroElmArr.length = 0;
 source.length = 0;
 };
 const layoutFix = lockId => {
 if (lockGet['layoutFixLock'] !== lockId) return;
 const secondaryWrapper = qs(
 '#secondary-inner.style-scope.ytd-watch-flexy > secondary-wrapper'
 );
 if (secondaryWrapper) {
 const secondaryInner = secondaryWrapper.parentNode;
 const chatContainer = qs('#columns.style-scope.ytd-watch-flexy [tyt-chat-container]');
 const hasExtraNodes = () => {
 for (let node = secondaryInner.firstChild; node; node = node.nextSibling) {
 if (node === secondaryWrapper) continue;
 if (node === chatContainer) continue;
 if (node.nodeType === 3 && !node.textContent.trim()) continue;
 return true;
 }
 return false;
 };
 if (hasExtraNodes() || (chatContainer && !chatContainer.closest('secondary-wrapper'))) {
 const w = [];
 const w2 = [];
 for (
 let node = secondaryInner.firstChild;
 node instanceof Node;
 node = node.nextSibling
 ) {
 if (node === chatContainer && chatContainer) {
 } else if (node === secondaryWrapper) {
 for (
 let node2 = secondaryWrapper.firstChild;
 node2 instanceof Node;
 node2 = node2.nextSibling
 ) {
 if (node2 === chatContainer && chatContainer) {
 } else {
 if (node2.id === 'right-tabs' && chatContainer) {
 w2.push(chatContainer);
 }
 w2.push(node2);
 }
 }
 } else {
 w.push(node);
 }
 }
 inPageRearrange = true;
 secondaryWrapper.replaceChildren000(...w, ...w2);
 inPageRearrange = false;
 const chatElm = elements.chat;
 const chatCnt = insp(chatElm);
 if (
 chatCnt &&
 typeof chatCnt.urlChanged === 'function' &&
 secondaryWrapper.contains(chatElm)
 ) {
 if (typeof chatCnt.urlChangedAsync12 === 'function') {
 DEBUG_5085 && console.log('elements.chat urlChangedAsync12', 61);
 chatCnt.urlChanged();
 } else {
 DEBUG_5085 && console.log('elements.chat urlChangedAsync12', 62);
 setTimeout(() => chatCnt.urlChanged(), 136);
 }
 }
 }
 }
 };
 let lastPanel = '';
 let lastTab = '';
 let egmPanelsDebounceTimer = null;
 const aoEgmPanels = new MutationObserver(() => {
 if (egmPanelsDebounceTimer) return;
 egmPanelsDebounceTimer = setTimeout(() => {
 egmPanelsDebounceTimer = null;
 Promise.resolve(lockSet['updateEgmPanelsLock']).then(updateEgmPanels).catch(console.warn);
 }, 16);
 });
 const removeKeepCommentsScroller = async lockId => {
 if (lockGet['removeKeepCommentsScrollerLock'] !== lockId) return;
 await Promise.resolve();
 if (lockGet['removeKeepCommentsScrollerLock'] !== lockId) return;
 const ytdFlexyFlm = elements.flexy;
 if (ytdFlexyFlm) {
 ytdFlexyFlm.removeAttribute000('keep-comments-scroller');
 }
 };
 const egmPanelsCache = new Set();
 const updateEgmPanels = async lockId => {
 if (lockId !== lockGet['updateEgmPanelsLock']) return;
 await navigateFinishedPromise.then().catch(console.warn);
 if (lockId !== lockGet['updateEgmPanelsLock']) return;
 const ytdFlexyElm = elements.flexy;
 if (!ytdFlexyElm) return;
 let newVisiblePanels = [];
 let newHiddenPanels = [];
 let allVisiblePanels = [];
 const panels = egmPanelsCache;
 for (const panelElm of panels) {
 if (!panelElm.isConnected) {
 egmPanelsCache.delete(panelElm);
 continue;
 }
 const visibility = panelElm.getAttribute000('visibility');
 if (visibility === 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN' || panelElm.closest('[hidden]')) {
 if (panelElm.hasAttribute000('tyt-visible-at')) {
 panelElm.removeAttribute000('tyt-visible-at');
 newHiddenPanels.push(panelElm);
 }
 } else if (
 visibility === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' &&
 !panelElm.closest('[hidden]')
 ) {
 const visibleAt = panelElm.getAttribute000('tyt-visible-at');
 if (!visibleAt) {
 panelElm.setAttribute111('tyt-visible-at', Date.now());
 newVisiblePanels.push(panelElm);
 }
 allVisiblePanels.push(panelElm);
 }
 }
 if (newVisiblePanels.length >= 1 && allVisiblePanels.length >= 2) {
 const targetVisible = newVisiblePanels[newVisiblePanels.length - 1];
 const actions = [];
 for (const panelElm of allVisiblePanels) {
 if (panelElm === targetVisible) continue;
 actions.push({
 panelId: panelElm.getAttribute000('target-id'),
 toHide: true,
 });
 }
 if (actions.length >= 1) {
 ytBtnEgmPanelCore(actions);
 }
 }
 if (allVisiblePanels.length >= 1) {
 ytdFlexyElm.setAttribute111('tyt-egm-panel_', '');
 } else {
 ytdFlexyElm.removeAttribute000('tyt-egm-panel_');
 }
 newVisiblePanels.length = 0;
 newVisiblePanels = null;
 newHiddenPanels.length = 0;
 newHiddenPanels = null;
 allVisiblePanels.length = 0;
 allVisiblePanels = null;
 };
 const checkElementExist = (css, exclude) => {
 const elms = window.YouTubeDOMCache
 ? window.YouTubeDOMCache.querySelectorAll(css, document)
 : document.querySelectorAll(css);
 for (const p of elms) {
 if (!p.closest(exclude)) return p;
 }
 return null;
 };
 let fixInitialTabStateK = 0;
 const { handleNavigateFactory } = (() => {
 let isLoadStartListened = false;
 function findLcComment(lc) {
 if (arguments.length === 1) {
 const element = qs(
 `#tab-comments ytd-comments ytd-comment-renderer #header-author a[href*="lc=${lc}"]`
 );
 if (element) {
 const commentRendererElm = closestFromAnchor.call(element, 'ytd-comment-renderer');
 if (commentRendererElm && lc) {
 return {
 lc,
 commentRendererElm,
 };
 }
 }
 } else if (arguments.length === 0) {
 const element = qs(
 `#tab-comments ytd-comments ytd-comment-renderer > #linked-comment-badge span:not(:empty)`
 );
 if (element) {
 const commentRendererElm = closestFromAnchor.call(element, 'ytd-comment-renderer');
 if (commentRendererElm) {
 const header = _querySelector.call(commentRendererElm, '#header-author');
 if (header) {
 const anchor = _querySelector.call(header, 'a[href*="lc="]');
 if (anchor) {
 const href = anchor.getAttribute('href') || '';
 const m = /[&?]lc=([\w_.-]+)/.exec(href);
 if (m) {
 lc = m[1];
 }
 }
 }
 }
 if (commentRendererElm && lc) {
 return {
 lc,
 commentRendererElm,
 };
 }
 }
 }
 return null;
 }
 function lcSwapFuncA(targetLcId, currentLcId) {
 let done = 0;
 try {
 const r1 = findLcComment(currentLcId).commentRendererElm;
 const r2 = findLcComment(targetLcId).commentRendererElm;
 if (
 typeof insp(r1).data.linkedCommentBadge === 'object' &&
 typeof insp(r2).data.linkedCommentBadge === 'undefined'
 ) {
 const p = Object.assign({}, insp(r1).data.linkedCommentBadge);
 if (((p || 0).metadataBadgeRenderer || 0).trackingParams) {
 delete p.metadataBadgeRenderer.trackingParams;
 }
 const v1 = findContentsRenderer(r1);
 const v2 = findContentsRenderer(r2);
 if (
 v1.parent === v2.parent &&
 (v2.parent.nodeName === 'YTD-COMMENTS' ||
 v2.parent.nodeName === 'YTD-ITEM-SECTION-RENDERER')
 ) {
 } else {
 return false;
 }
 if (v2.index >= 0) {
 if (v2.parent.nodeName === 'YTD-COMMENT-REPLIES-RENDERER') {
 if (lcSwapFuncB(targetLcId, currentLcId, p)) {
 done = 1;
 }
 done = 1;
 } else {
 const v2pCnt = insp(v2.parent);
 const v2Conents = (v2pCnt.data || 0).contents || 0;
 if (!v2Conents) console.warn('v2Conents is not found');
 v2pCnt.data = Object.assign({}, v2pCnt.data, {
 contents: [].concat(
 [v2Conents[v2.index]],
 v2Conents.slice(0, v2.index),
 v2Conents.slice(v2.index + 1)
 ),
 });
 if (lcSwapFuncB(targetLcId, currentLcId, p)) {
 done = 1;
 }
 }
 }
 }
 } catch (e) {
 console.warn(e);
 }
 return done === 1;
 }
 function lcSwapFuncB(targetLcId, currentLcId, _p) {
 let done = 0;
 try {
 const r1 = findLcComment(currentLcId).commentRendererElm;
 const r1cnt = insp(r1);
 const r2 = findLcComment(targetLcId).commentRendererElm;
 const r2cnt = insp(r2);
 const r1d = r1cnt.data;
 const p = Object.assign({}, _p);
 r1d.linkedCommentBadge = null;
 delete r1d.linkedCommentBadge;
 const q = Object.assign({}, r1d);
 q.linkedCommentBadge = null;
 delete q.linkedCommentBadge;
 r1cnt.data = Object.assign({}, q);
 r2cnt.data = Object.assign({}, r2cnt.data, { linkedCommentBadge: p });
 done = 1;
 } catch (e) {
 console.warn(e);
 }
 return done === 1;
 }
 const loadStartFx = async evt => {
 const media = (evt || 0).target || 0;
 if (media.nodeName === 'VIDEO' || media.nodeName === 'AUDIO') {
 } else return;
 const newMedia = media;
 const media1 = common.getMediaElement(0);
 const media2 = common.getMediaElements(2);
 if (media1 !== null && media2.length > 0) {
 if (newMedia !== media1 && media1.paused === false) {
 if (isVideoPlaying(media1)) {
 Promise.resolve(newMedia)
 .then(video => video.paused === false && video.pause())
 .catch(console.warn);
 }
 } else if (newMedia === media1) {
 for (const s of media2) {
 if (s.paused === false) {
 Promise.resolve(s)
 .then(s => s.paused === false && s.pause())
 .catch(console.warn);
 break;
 }
 }
 } else {
 Promise.resolve(media1)
 .then(video1 => video1.paused === false && video1.pause())
 .catch(console.warn);
 }
 }
 };
 const getBrowsableEndPoint = req => {
 let valid = false;
 let endpoint = req ? req.command : null;
 if (
 endpoint &&
 (endpoint.commandMetadata || 0).webCommandMetadata &&
 endpoint.watchEndpoint
 ) {
 const videoId = endpoint.watchEndpoint.videoId;
 const url = endpoint.commandMetadata.webCommandMetadata.url;
 if (typeof videoId === 'string' && typeof url === 'string' && url.indexOf('lc=') > 0) {
 const m = /^\/watch\?v=([\w_-]+)&lc=([\w_.-]+)$/.exec(url);
 if (m && m[1] === videoId) {
 const targetLc = findLcComment(m[2]);
 const currentLc = targetLc ? findLcComment() : null;
 if (targetLc && currentLc) {
 const done =
 targetLc.lc === currentLc.lc ? 1 : lcSwapFuncA(targetLc.lc, currentLc.lc) ? 1 : 0;
 if (done === 1) {
 common.xReplaceState(history.state, url);
 return;
 }
 }
 }
 }
 }
 if (
 endpoint &&
 (endpoint.commandMetadata || 0).webCommandMetadata &&
 endpoint.browseEndpoint &&
 isChannelId(endpoint.browseEndpoint.browseId)
 ) {
 valid = true;
 } else if (
 endpoint &&
 (endpoint.browseEndpoint || endpoint.searchEndpoint) &&
 !endpoint.urlEndpoint &&
 !endpoint.watchEndpoint
 ) {
 if (endpoint.browseEndpoint && endpoint.browseEndpoint.browseId === 'FEwhat_to_watch') {
 const playerMedia = common.getMediaElement(1);
 if (playerMedia && playerMedia.paused === false) valid = true;
 } else if (endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata) {
 const meta = endpoint.commandMetadata.webCommandMetadata;
 if (meta && meta.url && meta.webPageType) {
 valid = true;
 }
 }
 }
 if (!valid) endpoint = null;
 return endpoint;
 };
 const shouldUseMiniPlayer = () => {
 const isSubTypeExist = document.querySelector(
 'ytd-page-manager#page-manager > ytd-browse[page-subtype]'
 );
 if (isSubTypeExist) return true;
 const movie_player = [...document.querySelectorAll('#movie_player')].filter(
 e => !e.closest('[hidden]')
 )[0];
 if (movie_player) {
 const media = qsOne(movie_player, 'video[class], audio[class]');
 if (
 media &&
 media.currentTime > 3 &&
 media.duration - media.currentTime > 3 &&
 media.paused === false
 ) {
 return true;
 }
 }
 return false;
 };
 const conditionFulfillment = req => {
 const command = req ? req.command : null;
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 0801', command);
 if (!command) return;
 if (command && (command.commandMetadata || 0).webCommandMetadata && command.watchEndpoint) {
 } else if (
 command &&
 (command.commandMetadata || 0).webCommandMetadata &&
 command.browseEndpoint &&
 isChannelId(command.browseEndpoint.browseId)
 ) {
 } else if (
 command &&
 (command.browseEndpoint || command.searchEndpoint) &&
 !command.urlEndpoint &&
 !command.watchEndpoint
 ) {
 } else {
 return false;
 }
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 0802');
 if (!shouldUseMiniPlayer()) return false;
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 0803');
 if (pageType !== 'watch') return false;
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 0804');
 return true;
 };
 let u38 = 0;
 const fixChannelAboutPopup = async t38 => {
 let promise = new PromiseExternal();
 const f = () => {
 promise && promise.resolve();
 promise = null;
 };
 document.addEventListener('yt-navigate-finish', f, false);
 await promise.then();
 promise = null;
 document.removeEventListener('yt-navigate-finish', f, false);
 if (t38 !== u38) return;
 setTimeout(() => {
 const currentAbout = [...document.querySelectorAll('ytd-about-channel-renderer')].filter(
 e => !e.closest('[hidden]')
 )[0];
 let okay = false;
 if (!currentAbout) okay = true;
 else {
 const popupContainer = currentAbout.closest('ytd-popup-container');
 if (popupContainer) {
 const cnt = insp(popupContainer);
 let arr = null;
 try {
 arr = cnt.handleGetOpenedPopupsAction_();
 } catch {}
 if (arr && arr.length === 0) okay = true;
 } else {
 okay = false;
 }
 }
 if (okay) {
 const descriptionModel = [
 ...document.querySelectorAll('yt-description-preview-view-model'),
 ].filter(e => !e.closest('[hidden]'))[0];
 if (descriptionModel) {
 const button = [...descriptionModel.querySelectorAll('button')].filter(
 e => !e.closest('[hidden]') && `${e.textContent}`.trim().length > 0
 )[0];
 if (button) {
 button.click();
 }
 }
 }
 }, 80);
 };
 const handleNavigateFactory = handleNavigate => {
 return function (req) {
 if (u38 > 1e9) u38 = 9;
 const t38 = ++u38;
 const $this = this;
 const $arguments = arguments;
 let endpoint = null;
 if (conditionFulfillment(req)) {
 endpoint = getBrowsableEndPoint(req);
 DEBUG_handleNavigateFactory &&
 console.log('handleNavigateFactory - 1000', req, endpoint);
 }
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 1001', req, endpoint);
 if (!endpoint || !shouldUseMiniPlayer()) return handleNavigate.apply($this, $arguments);
 const ytdAppElm = document.querySelector('ytd-app');
 const ytdAppCnt = insp(ytdAppElm);
 let object = null;
 try {
 object = ytdAppCnt.data.response.currentVideoEndpoint.watchEndpoint || null;
 } catch {
 object = null;
 }
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 1002', object);
 if (typeof object !== 'object') object = null;
 const once = { once: true };
 if (object !== null && !('playlistId' in object)) {
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - 1003', object);
 let wObject = mWeakRef(object);
 const N = 3;
 let count = 0;
 Object.defineProperty(kRef(wObject) || {}, 'playlistId', {
 get() {
 DEBUG_handleNavigateFactory && console.log('handleNavigateFactory - get', count);
 count++;
 if (count === N) {
 delete this.playlistId;
 }
 return '*';
 },
 set(value) {
 DEBUG_handleNavigateFactory &&
 console.log('handleNavigateFactory - set', count, value);
 delete this.playlistId;
 this.playlistId = value;
 },
 enumerable: false,
 configurable: true,
 });
 let playlistClearout = null;
 let timeoutid = 0;
 Promise.race([
 new Promise(r => {
 timeoutid = setTimeout(r, 4000);
 }),
 new Promise(r => {
 playlistClearout = () => {
 if (timeoutid > 0) {
 clearTimeout(timeoutid);
 timeoutid = 0;
 }
 r();
 };
 document.addEventListener('yt-page-type-changed', playlistClearout, once);
 }),
 ])
 .then(() => {
 if (timeoutid !== 0) {
 playlistClearout &&
 document.removeEventListener('yt-page-type-changed', playlistClearout, once);
 timeoutid = 0;
 }
 playlistClearout = null;
 count = N - 1;
 const object = kRef(wObject);
 wObject = null;
 return object ? object.playlistId : null;
 })
 .catch(console.warn);
 }
 if (!isLoadStartListened) {
 isLoadStartListened = true;
 document.addEventListener('loadstart', loadStartFx, true);
 }
 const endpointURL = `${endpoint?.commandMetadata?.webCommandMetadata?.url || ''}`;
 if (
 endpointURL &&
 endpointURL.endsWith('/about') &&
 /\/channel\/UC[-_a-zA-Z0-9+=.]{22}\/about/.test(endpointURL)
 ) {
 fixChannelAboutPopup(t38);
 }
 handleNavigate.apply($this, $arguments);
 };
 };
 return { handleNavigateFactory };
 })();
 const common = (() => {
 let mediaModeLock = 0;
 const _getMediaElement = i => {
 if (mediaModeLock === 0) {
 const e =
 document.querySelector('.video-stream.html5-main-video') ||
 document.querySelector('#movie_player video, #movie_player audio') ||
 document.querySelector('body video[src], body audio[src]');
 if (e) {
 if (e.nodeName === 'VIDEO') mediaModeLock = 1;
 else if (e.nodeName === 'AUDIO') mediaModeLock = 2;
 }
 }
 if (!mediaModeLock) return null;
 if (mediaModeLock === 1) {
 switch (i) {
 case 1:
 return 'ytd-player#ytd-player video[src]';
 case 2:
 return 'ytd-browse[role="main"] video[src]';
 case 0:
 default:
 return '#movie_player video[src]';
 }
 } else if (mediaModeLock === 2) {
 switch (i) {
 case 1:
 return 'ytd-player#ytd-player audio.video-stream.html5-main-video[src]';
 case 2:
 return 'ytd-browse[role="main"] audio.video-stream.html5-main-video[src]';
 case 0:
 default:
 return '#movie_player audio.video-stream.html5-main-video[src]';
 }
 }
 return null;
 };
 return {
 xReplaceState(s, u) {
 try {
 history.replaceState(s, '', u);
 } catch {
 }
 if (s.endpoint) {
 try {
 const ytdAppElm = document.querySelector('ytd-app');
 const ytdAppCnt = insp(ytdAppElm);
 ytdAppCnt.replaceState(s.endpoint, '', u);
 } catch {}
 }
 },
 getMediaElement(i) {
 const s = _getMediaElement(i) || '';
 if (s) return document.querySelector(s);
 return null;
 },
 getMediaElements(i) {
 const s = _getMediaElement(i) || '';
 if (s) return document.querySelectorAll(s);
 return [];
 },
 };
 })();
 let inPageRearrange = false;
 let tmpLastVideoId = '';
 const getCurrentVideoId = () => {
 const ytdFlexyElm = elements.flexy;
 const ytdFlexyCnt = insp(ytdFlexyElm);
 if (ytdFlexyCnt && typeof ytdFlexyCnt.videoId === 'string') return ytdFlexyCnt.videoId;
 if (ytdFlexyElm && typeof ytdFlexyElm.videoId === 'string') return ytdFlexyElm.videoId;
 console.log('video id not found');
 return '';
 };
 const _holdInlineExpanderAlwaysExpanded = inlineExpanderCnt => {
 console.log('holdInlineExpanderAlwaysExpanded');
 if (inlineExpanderCnt.alwaysShowExpandButton === true) {
 inlineExpanderCnt.alwaysShowExpandButton = false;
 }
 if (typeof (inlineExpanderCnt.collapseLabel || 0) === 'string') {
 inlineExpanderCnt.collapseLabel = '';
 }
 if (typeof (inlineExpanderCnt.expandLabel || 0) === 'string') {
 inlineExpanderCnt.expandLabel = '';
 }
 if (inlineExpanderCnt.showCollapseButton === true) {
 inlineExpanderCnt.showCollapseButton = false;
 }
 if (inlineExpanderCnt.showExpandButton === true) inlineExpanderCnt.showExpandButton = false;
 if (inlineExpanderCnt.expandButton instanceof HTMLElement_) {
 inlineExpanderCnt.expandButton = null;
 inlineExpanderCnt.expandButton.remove();
 }
 };
 const fixInlineExpanderDisplay = inlineExpanderCnt => {
 try {
 inlineExpanderCnt.updateIsAttributedExpanded();
 } catch {}
 try {
 inlineExpanderCnt.updateIsFormattedExpanded();
 } catch {}
 try {
 inlineExpanderCnt.updateTextOnSnippetTypeChange();
 } catch {}
 try {
 inlineExpanderCnt.updateStyles();
 } catch {}
 };
 const setExpand = cnt => {
 if (typeof cnt.set === 'function') {
 cnt.set('isExpanded', true);
 if (typeof cnt.isExpandedChanged === 'function') cnt.isExpandedChanged();
 } else if (cnt.isExpanded === false) {
 cnt.isExpanded = true;
 if (typeof cnt.isExpandedChanged === 'function') cnt.isExpandedChanged();
 }
 };
 const cloneMethods = {
 updateTextOnSnippetTypeChange() {
 if (this.isResetMutation === false) this.isResetMutation = true;
 if (this.isExpanded === true) this.isExpanded = false;
 setExpand(this, true);
 if (this.isResetMutation === false) this.isResetMutation = true;
 try {
 true || (this.isResetMutation && this.mutationCallback());
 } catch (e) {
 console.error(e);
 }
 },
 collapse() {},
 computeExpandButtonOffset() {
 return 0;
 },
 dataChanged() {},
 };
 const fixInlineExpanderMethods = inlineExpanderCnt => {
 if (inlineExpanderCnt && !inlineExpanderCnt.__$$idncjk8487$$__) {
 inlineExpanderCnt.__$$idncjk8487$$__ = true;
 inlineExpanderCnt.dataChanged = cloneMethods.dataChanged;
 inlineExpanderCnt.updateTextOnSnippetTypeChange =
 cloneMethods.updateTextOnSnippetTypeChange;
 if (typeof inlineExpanderCnt.collapse === 'function') {
 inlineExpanderCnt.collapse = cloneMethods.collapse;
 }
 if (typeof inlineExpanderCnt.computeExpandButtonOffset === 'function') {
 inlineExpanderCnt.computeExpandButtonOffset = cloneMethods.computeExpandButtonOffset;
 }
 if (typeof inlineExpanderCnt.isResetMutation === 'boolean') {
 inlineExpanderCnt.isResetMutation = true;
 }
 if (typeof inlineExpanderCnt.collapseLabel === 'string') {
 inlineExpanderCnt.collapseLabel = '';
 }
 fixInlineExpanderDisplay(inlineExpanderCnt);
 }
 };
 const fixInlineExpanderContent = () => {
 const mainInfo = getMainInfo();
 if (!mainInfo) return;
 const inlineExpanderElm = mainInfo.querySelector('ytd-text-inline-expander');
 const inlineExpanderCnt = insp(inlineExpanderElm);
 fixInlineExpanderMethods(inlineExpanderCnt);
 };
 const plugin = {
 minibrowser: {
 activated: false,
 toUse: true,
 activate() {
 if (this.activated) return;
 const isPassiveArgSupport = typeof IntersectionObserver === 'function';
 if (!isPassiveArgSupport) return;
 this.activated = true;
 const ytdAppElm = document.querySelector('ytd-app');
 const ytdAppCnt = insp(ytdAppElm);
 if (!ytdAppCnt) return;
 const cProto = ytdAppCnt.constructor.prototype;
 if (!cProto.handleNavigate) return;
 if (cProto.handleNavigate.__ma355__) return;
 cProto.handleNavigate = handleNavigateFactory(cProto.handleNavigate);
 cProto.handleNavigate.__ma355__ = 1;
 },
 },
 autoExpandInfoDesc: {
 activated: false,
 toUse: false,
 mo: null,
 promiseReady: new PromiseExternal(),
 moFn(lockId) {
 if (lockGet['autoExpandInfoDescAttrAsyncLock'] !== lockId) return;
 const mainInfo = getMainInfo();
 if (!mainInfo) return;
 switch (((mainInfo || 0).nodeName || '').toLowerCase()) {
 case 'ytd-expander':
 if (mainInfo.hasAttribute000('collapsed')) {
 let success = false;
 try {
 insp(mainInfo).handleMoreTap(new Event('tap'));
 success = true;
 } catch {}
 if (success) mainInfo.setAttribute111('tyt-no-less-btn', '');
 }
 break;
 case 'ytd-expandable-video-description-body-renderer':
 const inlineExpanderElm = mainInfo.querySelector('ytd-text-inline-expander');
 const inlineExpanderCnt = insp(inlineExpanderElm);
 if (inlineExpanderCnt && inlineExpanderCnt.isExpanded === false) {
 setExpand(inlineExpanderCnt, true);
 }
 break;
 }
 },
 activate() {
 if (this.activated) return;
 this.moFn = this.moFn.bind(this);
 this.mo = new MutationObserver(() => {
 Promise.resolve(lockSet['autoExpandInfoDescAttrAsyncLock'])
 .then(this.moFn)
 .catch(console.warn);
 });
 this.activated = true;
 this.promiseReady.resolve();
 },
 async onMainInfoSet(mainInfo) {
 await this.promiseReady.then();
 if (mainInfo.nodeName.toLowerCase() === 'ytd-expander') {
 this.mo.observe(mainInfo, {
 attributes: true,
 attributeFilter: ['collapsed', 'attr-8ifv7'],
 });
 } else {
 this.mo.observe(mainInfo, { attributes: true, attributeFilter: ['attr-8ifv7'] });
 }
 mainInfo.incAttribute111('attr-8ifv7');
 },
 },
 fullChannelNameOnHover: {
 activated: false,
 toUse: true,
 mo: null,
 ro: null,
 promiseReady: new PromiseExternal(),
 checkResize: 0,
 mouseEnterFn(evt) {
 const target = evt ? evt.target : null;
 if (!(target instanceof HTMLElement_)) return;
 const metaDataElm = target.closest('ytd-watch-metadata');
 metaDataElm.classList.remove('tyt-metadata-hover-resized');
 this.checkResize = Date.now() + 300;
 metaDataElm.classList.add('tyt-metadata-hover');
 },
 mouseLeaveFn(evt) {
 const target = evt ? evt.target : null;
 if (!(target instanceof HTMLElement_)) return;
 const metaDataElm = target.closest('ytd-watch-metadata');
 metaDataElm.classList.remove('tyt-metadata-hover-resized');
 metaDataElm.classList.remove('tyt-metadata-hover');
 },
 moFn(lockId) {
 if (lockGet['fullChannelNameOnHoverAttrAsyncLock'] !== lockId) return;
 const uploadInfo = document.querySelector(
 '#primary.ytd-watch-flexy ytd-watch-metadata #upload-info'
 );
 if (!uploadInfo) return;
 const evtOpt = { passive: true, capture: false };
 uploadInfo.removeEventListener('pointerenter', this.mouseEnterFn, evtOpt);
 uploadInfo.removeEventListener('pointerleave', this.mouseLeaveFn, evtOpt);
 uploadInfo.addEventListener('pointerenter', this.mouseEnterFn, evtOpt);
 uploadInfo.addEventListener('pointerleave', this.mouseLeaveFn, evtOpt);
 },
 async onNavigateFinish() {
 await this.promiseReady.then();
 const uploadInfo = document.querySelector(
 '#primary.ytd-watch-flexy ytd-watch-metadata #upload-info'
 );
 if (!uploadInfo) return;
 this.mo.observe(uploadInfo, {
 attributes: true,
 attributeFilter: ['hidden', 'attr-3wb0k'],
 });
 uploadInfo.incAttribute111('attr-3wb0k');
 this.ro.observe(uploadInfo);
 },
 activate() {
 if (this.activated) return;
 const isPassiveArgSupport = typeof IntersectionObserver === 'function';
 if (!isPassiveArgSupport) return;
 this.activated = true;
 this.mouseEnterFn = this.mouseEnterFn.bind(this);
 this.mouseLeaveFn = this.mouseLeaveFn.bind(this);
 this.moFn = this.moFn.bind(this);
 this.mo = new MutationObserver(() => {
 Promise.resolve(lockSet['fullChannelNameOnHoverAttrAsyncLock'])
 .then(this.moFn)
 .catch(console.warn);
 });
 this.ro = new ResizeObserver(mutations => {
 if (Date.now() > this.checkResize) return;
 for (const mutation of mutations) {
 const uploadInfo = mutation.target;
 if (uploadInfo && mutation.contentRect.width > 0 && mutation.contentRect.height > 0) {
 const metaDataElm = uploadInfo.closest('ytd-watch-metadata');
 if (metaDataElm.classList.contains('tyt-metadata-hover')) {
 metaDataElm.classList.add('tyt-metadata-hover-resized');
 }
 break;
 }
 }
 });
 this.promiseReady.resolve();
 },
 },
 'external.ytlstm': {
 activated: false,
 toUse: true,
 activate() {
 if (this.activated) return;
 this.activated = true;
 document.documentElement.classList.add('external-ytlstm');
 },
 },
 };
 if (sessionStorage.__$$tmp_UseAutoExpandInfoDesc$$__) plugin.autoExpandInfoDesc.toUse = true;
 const __attachedSymbol__ = Symbol();
 const makeInitAttached = tag => {
 const inPageRearrange_ = inPageRearrange;
 inPageRearrange = false;
 for (const elm of document.querySelectorAll(`${tag}`)) {
 const cnt = insp(elm) || 0;
 if (typeof cnt.attached498 === 'function' && !elm[__attachedSymbol__]) {
 Promise.resolve(elm).then(eventMap[`${tag}::attached`]).catch(console.warn);
 }
 }
 inPageRearrange = inPageRearrange_;
 };
 const getGeneralChatElement = async () => {
 for (let i = 2; i-- > 0; ) {
 const t = document.querySelector(
 '#columns.style-scope.ytd-watch-flexy ytd-live-chat-frame#chat'
 );
 if (t instanceof Element) return t;
 if (i > 0) {
 console.log('ytd-live-chat-frame::attached - delayPn(200)');
 await delayPn(200);
 }
 }
 return null;
 };
 const nsTemplateObtain = () => {
 let nsTemplate = document.querySelector('ytd-watch-flexy noscript[ns-template]');
 if (!nsTemplate) {
 nsTemplate = document.createElement('noscript');
 nsTemplate.setAttribute('ns-template', '');
 document.querySelector('ytd-watch-flexy').appendChild(nsTemplate);
 }
 return nsTemplate;
 };
 const isPageDOM = (elm, selector) => {
 if (!elm || !(elm instanceof Element) || !elm.nodeName) return false;
 if (!elm.closest(selector)) return false;
 if (elm.isConnected !== true) return false;
 return true;
 };
 const invalidFlexyParent = hostElement => {
 if (hostElement instanceof HTMLElement) {
 const hasFlexyParent = HTMLElement.prototype.closest.call(hostElement, 'ytd-watch-flexy');
 if (!hasFlexyParent) return true;
 const currentFlexy = elements.flexy;
 if (currentFlexy && currentFlexy !== hasFlexyParent) return true;
 }
 return false;
 };
 let headerMutationObserver = null;
 let headerMutationTmpNode = null;
 const eventMap = {
 ceHack: () => {
 mLoaded.flag |= 2;
 document.documentElement.setAttribute111('tabview-loaded', mLoaded.makeString());
 retrieveCE('ytd-watch-flexy')
 .then(eventMap['ytd-watch-flexy::defined'])
 .catch(console.warn);
 retrieveCE('ytd-expander').then(eventMap['ytd-expander::defined']).catch(console.warn);
 retrieveCE('ytd-watch-next-secondary-results-renderer')
 .then(eventMap['ytd-watch-next-secondary-results-renderer::defined'])
 .catch(console.warn);
 retrieveCE('ytd-comments-header-renderer')
 .then(eventMap['ytd-comments-header-renderer::defined'])
 .catch(console.warn);
 retrieveCE('ytd-live-chat-frame')
 .then(eventMap['ytd-live-chat-frame::defined'])
 .catch(console.warn);
 retrieveCE('ytd-comments').then(eventMap['ytd-comments::defined']).catch(console.warn);
 retrieveCE('ytd-engagement-panel-section-list-renderer')
 .then(eventMap['ytd-engagement-panel-section-list-renderer::defined'])
 .catch(console.warn);
 retrieveCE('ytd-watch-metadata')
 .then(eventMap['ytd-watch-metadata::defined'])
 .catch(console.warn);
 retrieveCE('ytd-playlist-panel-renderer')
 .then(eventMap['ytd-playlist-panel-renderer::defined'])
 .catch(console.warn);
 retrieveCE('ytd-expandable-video-description-body-renderer')
 .then(eventMap['ytd-expandable-video-description-body-renderer::defined'])
 .catch(console.warn);
 },
 fixForTabDisplay: isResize => {
 bFixForResizedTabLater = false;
 const runLowPriority = () => {
 for (const element of document.querySelectorAll('[io-intersected]')) {
 const cnt = insp(element);
 if (element instanceof HTMLElement_ && typeof cnt.calculateCanCollapse === 'function') {
 try {
 cnt.calculateCanCollapse(true);
 } catch {}
 }
 }
 };
 if (typeof requestIdleCallback === 'function') {
 requestIdleCallback(runLowPriority, { timeout: 100 });
 } else {
 setTimeout(runLowPriority, 0);
 }
 if (!isResize && lastTab === '#tab-info') {
 requestAnimationFrame(() => {
 for (const element of document.querySelectorAll(
 '#tab-info ytd-video-description-infocards-section-renderer, #tab-info yt-chip-cloud-renderer, #tab-info ytd-horizontal-card-list-renderer, #tab-info yt-horizontal-list-renderer'
 )) {
 const cnt = insp(element);
 if (element instanceof HTMLElement_ && typeof cnt.notifyResize === 'function') {
 try {
 cnt.notifyResize();
 } catch {}
 }
 }
 for (const element of document.querySelectorAll('#tab-info ytd-text-inline-expander')) {
 const cnt = insp(element);
 if (element instanceof HTMLElement_ && typeof cnt.resize === 'function') {
 cnt.resize(false);
 }
 fixInlineExpanderDisplay(cnt);
 }
 });
 }
 if (!isResize && typeof lastTab === 'string' && lastTab.startsWith('#tab-')) {
 const tabContent = document.querySelector('.tab-content-cld:not(.tab-content-hidden)');
 if (tabContent) {
 const renderers = tabContent.querySelectorAll('yt-chip-cloud-renderer');
 for (const renderer of renderers) {
 const cnt = insp(renderer);
 if (typeof cnt.notifyResize === 'function') {
 try {
 cnt.notifyResize();
 } catch {}
 }
 }
 }
 }
 },
 'ytd-watch-flexy::defined': cProto => {
 if (
 !cProto.updateChatLocation498 &&
 typeof cProto.updateChatLocation === 'function' &&
 cProto.updateChatLocation.length === 0
 ) {
 cProto.updateChatLocation498 = cProto.updateChatLocation;
 cProto.updateChatLocation = updateChatLocation498;
 }
 if (
 !cProto.isTwoColumnsChanged498_ &&
 typeof cProto.isTwoColumnsChanged_ === 'function' &&
 cProto.isTwoColumnsChanged_.length === 2
 ) {
 cProto.isTwoColumnsChanged498_ = cProto.isTwoColumnsChanged_;
 cProto.isTwoColumnsChanged_ = function (arg1, arg2, ...args) {
 const r = secondaryInnerFn(() => {
 const r = this.isTwoColumnsChanged498_(arg1, arg2, ...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.defaultTwoColumnLayoutChanged498 &&
 typeof cProto.defaultTwoColumnLayoutChanged === 'function' &&
 cProto.defaultTwoColumnLayoutChanged.length === 0
 ) {
 cProto.defaultTwoColumnLayoutChanged498 = cProto.defaultTwoColumnLayoutChanged;
 cProto.defaultTwoColumnLayoutChanged = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.defaultTwoColumnLayoutChanged498(...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.updatePlayerLocation498 &&
 typeof cProto.updatePlayerLocation === 'function' &&
 cProto.updatePlayerLocation.length === 0
 ) {
 cProto.updatePlayerLocation498 = cProto.updatePlayerLocation;
 cProto.updatePlayerLocation = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.updatePlayerLocation498(...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.updateCinematicsLocation498 &&
 typeof cProto.updateCinematicsLocation === 'function' &&
 cProto.updateCinematicsLocation.length === 0
 ) {
 cProto.updateCinematicsLocation498 = cProto.updateCinematicsLocation;
 cProto.updateCinematicsLocation = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.updateCinematicsLocation498(...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.updatePanelsLocation498 &&
 typeof cProto.updatePanelsLocation === 'function' &&
 cProto.updatePanelsLocation.length === 0
 ) {
 cProto.updatePanelsLocation498 = cProto.updatePanelsLocation;
 cProto.updatePanelsLocation = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.updatePanelsLocation498(...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.swatcherooUpdatePanelsLocation498 &&
 typeof cProto.swatcherooUpdatePanelsLocation === 'function' &&
 cProto.swatcherooUpdatePanelsLocation.length === 6
 ) {
 cProto.swatcherooUpdatePanelsLocation498 = cProto.swatcherooUpdatePanelsLocation;
 cProto.swatcherooUpdatePanelsLocation = function (
 arg1,
 arg2,
 arg3,
 arg4,
 arg5,
 arg6,
 ...args
 ) {
 const r = secondaryInnerFn(() => {
 const r = this.swatcherooUpdatePanelsLocation498(
 arg1,
 arg2,
 arg3,
 arg4,
 arg5,
 arg6,
 ...args
 );
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.updateErrorScreenLocation498 &&
 typeof cProto.updateErrorScreenLocation === 'function' &&
 cProto.updateErrorScreenLocation.length === 0
 ) {
 cProto.updateErrorScreenLocation498 = cProto.updateErrorScreenLocation;
 cProto.updateErrorScreenLocation = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.updateErrorScreenLocation498(...args);
 return r;
 });
 return r;
 };
 }
 if (
 !cProto.updateFullBleedElementLocations498 &&
 typeof cProto.updateFullBleedElementLocations === 'function' &&
 cProto.updateFullBleedElementLocations.length === 0
 ) {
 cProto.updateFullBleedElementLocations498 = cProto.updateFullBleedElementLocations;
 cProto.updateFullBleedElementLocations = function (...args) {
 const r = secondaryInnerFn(() => {
 const r = this.updateFullBleedElementLocations498(...args);
 return r;
 });
 return r;
 };
 }
 },
 'ytd-watch-next-secondary-results-renderer::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-watch-next-secondary-results-renderer::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-watch-next-secondary-results-renderer::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 makeInitAttached('ytd-watch-next-secondary-results-renderer');
 },
 'ytd-watch-next-secondary-results-renderer::attached': hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-watch-next-secondary-results-renderer::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (
 hostElement instanceof HTMLElement_ &&
 hostElement.matches('#columns #related ytd-watch-next-secondary-results-renderer') &&
 !hostElement.matches(
 '#right-tabs ytd-watch-next-secondary-results-renderer, [hidden] ytd-watch-next-secondary-results-renderer'
 )
 ) {
 elements.related = hostElement.closest('#related');
 hostElement.setAttribute111('tyt-videos-list', '');
 }
 },
 'ytd-watch-next-secondary-results-renderer::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-watch-next-secondary-results-renderer::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('tyt-videos-list')) {
 elements.related = null;
 hostElement.removeAttribute000('tyt-videos-list');
 }
 console.log('ytd-watch-next-secondary-results-renderer::detached', hostElement);
 },
 settingCommentsVideoId: hostElement => {
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 const cnt = insp(hostElement);
 const commentsArea = elements.comments;
 if (
 commentsArea !== hostElement ||
 hostElement.isConnected !== true ||
 cnt.isAttached !== true ||
 !cnt.data ||
 cnt.hidden !== false
 ) {
 return;
 }
 const ytdFlexyElm = elements.flexy;
 const ytdFlexyCnt = ytdFlexyElm ? insp(ytdFlexyElm) : null;
 if (ytdFlexyCnt && ytdFlexyCnt.videoId) {
 hostElement.setAttribute111('tyt-comments-video-id', ytdFlexyCnt.videoId);
 } else {
 hostElement.removeAttribute000('tyt-comments-video-id');
 }
 },
 checkCommentsShouldBeHidden: lockId => {
 if (lockGet['checkCommentsShouldBeHiddenLock'] !== lockId) return;
 const commentsArea = elements.comments;
 const ytdFlexyElm = elements.flexy;
 if (commentsArea && ytdFlexyElm && !commentsArea.hasAttribute000('hidden')) {
 const ytdFlexyCnt = insp(ytdFlexyElm);
 if (typeof ytdFlexyCnt.videoId === 'string') {
 const commentsVideoId = commentsArea.getAttribute('tyt-comments-video-id');
 if (commentsVideoId && commentsVideoId !== ytdFlexyCnt.videoId) {
 commentsArea.setAttribute111('hidden', '');
 }
 }
 }
 },
 'ytd-comments::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 cProto._createPropertyObserver('data', '_dataChanged498', undefined);
 cProto._dataChanged498 = function () {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments::_dataChanged498'])
 .catch(console.warn);
 };
 makeInitAttached('ytd-comments');
 },
 'ytd-comments::_dataChanged498': hostElement => {
 if (!hostElement.hasAttribute000('tyt-comments-area')) return;
 let commentsDataStatus = 0;
 const cnt = insp(hostElement);
 const data = cnt ? cnt.data : null;
 const contents = data ? data.contents : null;
 if (data) {
 if (contents && contents.length === 1 && contents[0].messageRenderer) {
 commentsDataStatus = 2;
 }
 if (contents && contents.length > 1 && contents[0].commentThreadRenderer) {
 commentsDataStatus = 1;
 }
 }
 if (commentsDataStatus) {
 hostElement.setAttribute111('tyt-comments-data-status', commentsDataStatus);
 } else {
 hostElement.removeAttribute000('tyt-comments-data-status');
 }
 Promise.resolve(hostElement).then(eventMap['settingCommentsVideoId']).catch(console.warn);
 },
 'ytd-comments::attached': async hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-comments::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (!hostElement || hostElement.id !== 'comments') return;
 elements.comments = hostElement;
 console.log('ytd-comments::attached');
 Promise.resolve(hostElement).then(eventMap['settingCommentsVideoId']).catch(console.warn);
 aoComment.observe(hostElement, { attributes: true });
 hostElement.setAttribute111('tyt-comments-area', '');
 const lockId = lockSet['rightTabReadyLock02'];
 await rightTabsProvidedPromise.then();
 if (lockGet['rightTabReadyLock02'] !== lockId) return;
 if (elements.comments !== hostElement) return;
 if (hostElement.isConnected === false) return;
 DEBUG_5085 && console.log(7932, 'comments');
 if (hostElement && !hostElement.closest('#right-tabs')) {
 document.querySelector('#tab-comments').assignChildren111(null, hostElement, null);
 } else {
 const shouldTabVisible =
 elements.comments &&
 elements.comments.closest('#tab-comments') &&
 !elements.comments.closest('[hidden]');
 document
 .querySelector('[tyt-tab-content="#tab-comments"]')
 .classList.toggle('tab-btn-hidden', !shouldTabVisible);
 Promise.resolve(lockSet['removeKeepCommentsScrollerLock'])
 .then(removeKeepCommentsScroller)
 .catch(console.warn);
 }
 TAB_AUTO_SWITCH_TO_COMMENTS && switchToTab('#tab-comments');
 },
 'ytd-comments::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-comments::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('tyt-comments-area')) {
 hostElement.removeAttribute000('tyt-comments-area');
 aoComment.disconnect();
 aoComment.takeRecords();
 elements.comments = null;
 document
 .querySelector('[tyt-tab-content="#tab-comments"]')
 .classList.add('tab-btn-hidden');
 Promise.resolve(lockSet['removeKeepCommentsScrollerLock'])
 .then(removeKeepCommentsScroller)
 .catch(console.warn);
 }
 },
 'ytd-comments-header-renderer::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments-header-renderer::attached'])
 .catch(console.warn);
 }
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments-header-renderer::dataChanged'])
 .catch(console.warn);
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments-header-renderer::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 if (!cProto.dataChanged498 && typeof cProto.dataChanged === 'function') {
 cProto.dataChanged498 = cProto.dataChanged;
 cProto.dataChanged = function () {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-comments-header-renderer::dataChanged'])
 .catch(console.warn);
 return this.dataChanged498();
 };
 }
 makeInitAttached('ytd-comments-header-renderer');
 },
 'ytd-comments-header-renderer::attached': hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-comments-header-renderer::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (!hostElement || !hostElement.classList.contains('ytd-item-section-renderer')) return;
 const targetElement = document.querySelector(
 '[tyt-comments-area] ytd-comments-header-renderer'
 );
 if (hostElement === targetElement) {
 hostElement.setAttribute111('tyt-comments-header-field', '');
 } else {
 const parentNode = hostElement.parentNode;
 if (
 parentNode instanceof HTMLElement_ &&
 parentNode.querySelector('[tyt-comments-header-field]')
 ) {
 hostElement.setAttribute111('tyt-comments-header-field', '');
 }
 }
 },
 'ytd-comments-header-renderer::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-comments-header-renderer::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('field-of-cm-count')) {
 hostElement.removeAttribute000('field-of-cm-count');
 const cmCount = document.querySelector('#tyt-cm-count');
 if (
 cmCount &&
 !document.querySelector('#tab-comments ytd-comments-header-renderer[field-of-cm-count]')
 ) {
 cmCount.textContent = '';
 }
 }
 if (hostElement.hasAttribute000('tyt-comments-header-field')) {
 hostElement.removeAttribute000('tyt-comments-header-field');
 }
 },
 'ytd-comments-header-renderer::dataChanged': hostElement => {
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 const ytdFlexyElm = elements.flexy;
 let b = false;
 const cnt = insp(hostElement);
 if (
 cnt &&
 hostElement.closest('#tab-comments') &&
 document.querySelector('#tab-comments ytd-comments-header-renderer') === hostElement
 ) {
 b = true;
 } else if (
 hostElement instanceof HTMLElement_ &&
 hostElement.parentNode instanceof HTMLElement_ &&
 hostElement.parentNode.querySelector('[tyt-comments-header-field]')
 ) {
 b = true;
 }
 if (b) {
 hostElement.setAttribute111('tyt-comments-header-field', '');
 ytdFlexyElm && ytdFlexyElm.removeAttribute000('tyt-comment-disabled');
 }
 if (
 hostElement.hasAttribute000('tyt-comments-header-field') &&
 hostElement.isConnected === true
 ) {
 if (!headerMutationObserver) {
 headerMutationObserver = new MutationObserver(
 eventMap['ytd-comments-header-renderer::deferredCounterUpdate']
 );
 }
 headerMutationObserver.observe(hostElement.parentNode, {
 subtree: false,
 childList: true,
 });
 if (!headerMutationTmpNode) {
 headerMutationTmpNode = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
 }
 const tmpNode = headerMutationTmpNode;
 hostElement.insertAdjacentElement('afterend', tmpNode);
 tmpNode.remove();
 }
 },
 'ytd-comments-header-renderer::deferredCounterUpdate': () => {
 const nodes = document.querySelectorAll(
 '#tab-comments ytd-comments-header-renderer[class]'
 );
 if (nodes.length === 1) {
 const hostElement = nodes[0];
 const cnt = insp(hostElement);
 const data = cnt.data;
 if (!data) return;
 let ez = '';
 if (
 data.commentsCount &&
 data.commentsCount.runs &&
 data.commentsCount.runs.length >= 1
 ) {
 let max = -1;
 const z = data.commentsCount.runs
 .map(e => {
 const c = e.text.replace(/\D+/g, '').length;
 if (c > max) max = c;
 return [e.text, c];
 })
 .filter(a => a[1] === max);
 if (z.length >= 1) {
 ez = z[0][0];
 }
 } else if (data.countText && data.countText.runs && data.countText.runs.length >= 1) {
 let max = -1;
 const z = data.countText.runs
 .map(e => {
 const c = e.text.replace(/\D+/g, '').length;
 if (c > max) max = c;
 return [e.text, c];
 })
 .filter(a => a[1] === max);
 if (z.length >= 1) {
 ez = z[0][0];
 }
 }
 const cmCount = document.querySelector('#tyt-cm-count');
 if (ez) {
 hostElement.setAttribute111('field-of-cm-count', '');
 cmCount && (cmCount.textContent = ez.trim());
 } else {
 hostElement.removeAttribute000('field-of-cm-count');
 cmCount && (cmCount.textContent = '');
 console.warn('no text for #tyt-cm-count');
 }
 }
 },
 'ytd-expander::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-expander::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-expander::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 if (!cProto.calculateCanCollapse498 && typeof cProto.calculateCanCollapse === 'function') {
 cProto.calculateCanCollapse498 = cProto.calculateCanCollapse;
 cProto.calculateCanCollapse = funcCanCollapse;
 }
 if (!cProto.childrenChanged498 && typeof cProto.childrenChanged === 'function') {
 cProto.childrenChanged498 = cProto.childrenChanged;
 cProto.childrenChanged = function () {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-expander::childrenChanged'])
 .catch(console.warn);
 return this.childrenChanged498();
 };
 }
 makeInitAttached('ytd-expander');
 },
 'ytd-expander::childrenChanged': hostElement => {
 if (
 hostElement instanceof Node &&
 hostElement.hasAttribute000('hidden') &&
 hostElement.hasAttribute000('tyt-main-info') &&
 hostElement.firstElementChild
 ) {
 hostElement.removeAttribute('hidden');
 }
 },
 'ytd-expandable-video-description-body-renderer::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-expandable-video-description-body-renderer::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-expandable-video-description-body-renderer::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 makeInitAttached('ytd-expandable-video-description-body-renderer');
 },
 'ytd-expandable-video-description-body-renderer::attached': async hostElement => {
 if (
 hostElement instanceof HTMLElement_ &&
 isPageDOM(hostElement, '[tyt-info-renderer]') &&
 !hostElement.matches('[tyt-main-info]')
 ) {
 elements.infoExpander = hostElement;
 console.log(128384, elements.infoExpander);
 infoExpanderElementProvidedPromise.resolve();
 hostElement.setAttribute111('tyt-main-info', '');
 if (plugin.autoExpandInfoDesc.toUse) {
 plugin.autoExpandInfoDesc.onMainInfoSet(hostElement);
 }
 const lockId = lockSet['rightTabReadyLock03'];
 await rightTabsProvidedPromise.then();
 if (lockGet['rightTabReadyLock03'] !== lockId) return;
 if (elements.infoExpander !== hostElement) return;
 if (hostElement.isConnected === false) return;
 console.log(7932, 'infoExpander');
 elements.infoExpander.classList.add('tyt-main-info');
 const infoExpander = elements.infoExpander;
 const inlineExpanderElm = infoExpander.querySelector('ytd-text-inline-expander');
 if (inlineExpanderElm) {
 const mo = new MutationObserver(() => {
 const p = document.querySelector('#tab-info ytd-text-inline-expander');
 sessionStorage.__$$tmp_UseAutoExpandInfoDesc$$__ =
 p && p.hasAttribute('is-expanded') ? '1' : '';
 if (p) fixInlineExpanderContent();
 });
 mo.observe(inlineExpanderElm, {
 attributes: ['is-expanded', 'attr-6v8qu', 'hidden'],
 subtree: true,
 });
 inlineExpanderElm.incAttribute111('attr-6v8qu');
 const cnt = insp(inlineExpanderElm);
 if (cnt) fixInlineExpanderDisplay(cnt);
 }
 if (infoExpander && !infoExpander.closest('#right-tabs')) {
 document.querySelector('#tab-info').assignChildren111(null, infoExpander, null);
 } else {
 if (document.querySelector('[tyt-tab-content="#tab-info"]')) {
 const shouldTabVisible =
 elements.infoExpander && elements.infoExpander.closest('#tab-info');
 document
 .querySelector('[tyt-tab-content="#tab-info"]')
 .classList.toggle('tab-btn-hidden', !shouldTabVisible);
 }
 }
 Promise.resolve(lockSet['infoFixLock']).then(infoFix).catch(console.warn);
 }
 DEBUG_5084 && console.log(5084, 'ytd-expandable-video-description-body-renderer::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (isPageDOM(hostElement, '#tab-info [tyt-main-info]')) {
 } else if (!hostElement.closest('#tab-info')) {
 const bodyRenderer = hostElement;
 let bodyRendererNew = document.querySelector(
 'ytd-expandable-video-description-body-renderer[tyt-info-renderer]'
 );
 if (!bodyRendererNew) {
 bodyRendererNew = document.createElement(
 'ytd-expandable-video-description-body-renderer'
 );
 bodyRendererNew.setAttribute('tyt-info-renderer', '');
 nsTemplateObtain().appendChild(bodyRendererNew);
 }
 const cnt = insp(bodyRendererNew);
 cnt.data = Object.assign({}, insp(bodyRenderer).data);
 const inlineExpanderElm = bodyRendererNew.querySelector('ytd-text-inline-expander');
 const inlineExpanderCnt = insp(inlineExpanderElm);
 fixInlineExpanderMethods(inlineExpanderCnt);
 elements.infoExpanderRendererBack = bodyRenderer;
 elements.infoExpanderRendererFront = bodyRendererNew;
 bodyRenderer.setAttribute('tyt-info-renderer-back', '');
 bodyRendererNew.setAttribute('tyt-info-renderer-front', '');
 }
 },
 'ytd-expandable-video-description-body-renderer::detached': async hostElement => {
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('tyt-main-info')) {
 DEBUG_5084 &&
 console.log(5084, 'ytd-expandable-video-description-body-renderer::detached');
 elements.infoExpander = null;
 hostElement.removeAttribute000('tyt-main-info');
 }
 },
 'ytd-expander::attached': async hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (
 hostElement instanceof HTMLElement_ &&
 hostElement.matches('[tyt-comments-area] #contents ytd-expander#expander') &&
 !hostElement.matches('[hidden] ytd-expander#expander')
 ) {
 hostElement.setAttribute111('tyt-content-comment-entry', '');
 ioComment.observe(hostElement);
 }
 },
 'ytd-expander::detached': hostElement => {
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('tyt-content-comment-entry')) {
 ioComment.unobserve(hostElement);
 hostElement.removeAttribute000('tyt-content-comment-entry');
 } else if (hostElement.hasAttribute000('tyt-main-info')) {
 DEBUG_5084 && console.log(5084, 'ytd-expander::detached');
 elements.infoExpander = null;
 hostElement.removeAttribute000('tyt-main-info');
 }
 },
 'ytd-live-chat-frame::defined': cProto => {
 let _lastDomAction = 0;
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 _lastDomAction = Date.now();
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-live-chat-frame::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 _lastDomAction = Date.now();
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-live-chat-frame::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 if (
 typeof cProto.urlChanged === 'function' &&
 !cProto.urlChanged66 &&
 !cProto.urlChangedAsync12 &&
 cProto.urlChanged.length === 0
 ) {
 cProto.urlChanged66 = cProto.urlChanged;
 let ath = 0;
 cProto.urlChangedAsync12 = async function () {
 await this.__urlChangedAsyncT689__;
 const t = (ath = (ath & 1073741823) + 1);
 const chatframe = this.chatframe || (this.$ || 0).chatframe || 0;
 if (chatframe instanceof HTMLIFrameElement) {
 if (chatframe.contentDocument === null) {
 await Promise.resolve('#').catch(console.warn);
 if (t !== ath) return;
 }
 await new Promise(resolve => setTimeout_(resolve, 1)).catch(console.warn);
 if (t !== ath) return;
 const isBlankPage = !this.data || this.collapsed;
 const p1 = new Promise(resolve => setTimeout_(resolve, 706)).catch(console.warn);
 const p2 = new Promise(resolve => {
 new IntersectionObserver((entries, observer) => {
 for (const entry of entries) {
 const rect = entry.boundingClientRect || 0;
 if (isBlankPage || (rect.width > 0 && rect.height > 0)) {
 observer.disconnect();
 resolve('#');
 break;
 }
 }
 }).observe(chatframe);
 }).catch(console.warn);
 await Promise.race([p1, p2]);
 if (t !== ath) return;
 }
 this.urlChanged66();
 };
 cProto.urlChanged = function () {
 const t = (this.__urlChangedAsyncT688__ =
 (this.__urlChangedAsyncT688__ & 1073741823) + 1);
 nextBrowserTick(() => {
 if (t !== this.__urlChangedAsyncT688__) return;
 this.urlChangedAsync12();
 });
 };
 }
 makeInitAttached('ytd-live-chat-frame');
 },
 'ytd-live-chat-frame::attached': async hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-live-chat-frame::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (!hostElement || hostElement.id !== 'chat') return;
 console.log('ytd-live-chat-frame::attached');
 const lockId = lockSet['ytdLiveAttachedLock'];
 const chatElem = await getGeneralChatElement();
 if (lockGet['ytdLiveAttachedLock'] !== lockId) return;
 if (chatElem === hostElement) {
 elements.chat = chatElem;
 aoChat.observe(chatElem, { attributes: true });
 const isFlexyReady = elements.flexy instanceof Element;
 chatElem.setAttribute111('tyt-active-chat-frame', isFlexyReady ? 'CF' : 'C');
 const chatContainer = chatElem ? chatElem.closest('#chat-container') || chatElem : null;
 if (chatContainer && !chatContainer.hasAttribute000('tyt-chat-container')) {
 for (const p of document.querySelectorAll('[tyt-chat-container]')) {
 p.removeAttribute000('[tyt-chat-container]');
 }
 chatContainer.setAttribute111('tyt-chat-container', '');
 }
 const cnt = insp(hostElement);
 const q = cnt.__urlChangedAsyncT688__;
 const p = (cnt.__urlChangedAsyncT689__ = new PromiseExternal());
 setTimeout_(() => {
 if (p !== cnt.__urlChangedAsyncT689__) return;
 if (cnt.isAttached === true && hostElement.isConnected === true) {
 p.resolve();
 if (q === cnt.__urlChangedAsyncT688__) {
 cnt.urlChanged();
 }
 }
 }, 320);
 Promise.resolve(lockSet['layoutFixLock']).then(layoutFix);
 } else {
 console.log('Issue found in ytd-live-chat-frame::attached', chatElem, hostElement);
 }
 },
 'ytd-live-chat-frame::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-live-chat-frame::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 console.log('ytd-live-chat-frame::detached');
 if (hostElement.hasAttribute000('tyt-active-chat-frame')) {
 aoChat.disconnect();
 aoChat.takeRecords();
 hostElement.removeAttribute000('tyt-active-chat-frame');
 elements.chat = null;
 const ytdFlexyElm = elements.flexy;
 if (ytdFlexyElm) {
 ytdFlexyElm.removeAttribute000('tyt-chat-collapsed');
 ytdFlexyElm.setAttribute111('tyt-chat', '');
 }
 }
 },
 'ytd-engagement-panel-section-list-renderer::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-engagement-panel-section-list-renderer::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-engagement-panel-section-list-renderer::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 makeInitAttached('ytd-engagement-panel-section-list-renderer');
 },
 'ytd-engagement-panel-section-list-renderer::bindTarget': hostElement => {
 if (
 hostElement.matches(
 '#panels.ytd-watch-flexy > ytd-engagement-panel-section-list-renderer[target-id][visibility]'
 )
 ) {
 hostElement.setAttribute111('tyt-egm-panel', '');
 egmPanelsCache.add(hostElement);
 Promise.resolve(lockSet['updateEgmPanelsLock']).then(updateEgmPanels).catch(console.warn);
 aoEgmPanels.observe(hostElement, {
 attributes: true,
 attributeFilter: ['visibility', 'hidden'],
 });
 }
 },
 'ytd-engagement-panel-section-list-renderer::attached': hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-engagement-panel-section-list-renderer::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (
 !hostElement.matches(
 '#panels.ytd-watch-flexy > ytd-engagement-panel-section-list-renderer'
 )
 ) {
 return;
 }
 if (hostElement.hasAttribute000('target-id') && hostElement.hasAttribute000('visibility')) {
 Promise.resolve(hostElement)
 .then(eventMap['ytd-engagement-panel-section-list-renderer::bindTarget'])
 .catch(console.warn);
 } else {
 hostElement.setAttribute000('tyt-egm-panel-jclmd', '');
 moEgmPanelReady.observe(hostElement, {
 attributes: true,
 attributeFilter: ['visibility', 'target-id'],
 });
 }
 },
 'ytd-engagement-panel-section-list-renderer::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-engagement-panel-section-list-renderer::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 if (hostElement.hasAttribute000('tyt-egm-panel')) {
 hostElement.removeAttribute000('tyt-egm-panel');
 Promise.resolve(lockSet['updateEgmPanelsLock']).then(updateEgmPanels).catch(console.warn);
 } else if (hostElement.hasAttribute000('tyt-egm-panel-jclmd')) {
 hostElement.removeAttribute000('tyt-egm-panel-jclmd');
 moEgmPanelReadyClearFn();
 }
 },
 'ytd-watch-metadata::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-watch-metadata::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-watch-metadata::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 makeInitAttached('ytd-watch-metadata');
 },
 'ytd-watch-metadata::attached': hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-watch-metadata::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 if (plugin.fullChannelNameOnHover.activated) {
 plugin.fullChannelNameOnHover.onNavigateFinish();
 }
 },
 'ytd-watch-metadata::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-watch-metadata::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 },
 'ytd-playlist-panel-renderer::defined': cProto => {
 if (!cProto.attached498 && typeof cProto.attached === 'function') {
 cProto.attached498 = cProto.attached;
 cProto.attached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-playlist-panel-renderer::attached'])
 .catch(console.warn);
 }
 return this.attached498();
 };
 }
 if (!cProto.detached498 && typeof cProto.detached === 'function') {
 cProto.detached498 = cProto.detached;
 cProto.detached = function () {
 if (!inPageRearrange) {
 Promise.resolve(this.hostElement)
 .then(eventMap['ytd-playlist-panel-renderer::detached'])
 .catch(console.warn);
 }
 return this.detached498();
 };
 }
 makeInitAttached('ytd-playlist-panel-renderer');
 },
 'ytd-playlist-panel-renderer::attached': hostElement => {
 if (invalidFlexyParent(hostElement)) return;
 DEBUG_5084 && console.log(5084, 'ytd-playlist-panel-renderer::attached');
 if (hostElement instanceof Element) hostElement[__attachedSymbol__] = true;
 if (
 !(hostElement instanceof HTMLElement_) ||
 !(hostElement.classList.length > 0) ||
 hostElement.closest('noscript')
 ) {
 return;
 }
 if (hostElement.isConnected !== true) return;
 elements.playlist = hostElement;
 aoPlayList.observe(hostElement, {
 attributes: true,
 attributeFilter: ['hidden', 'collapsed', 'attr-1y6nu'],
 });
 hostElement.incAttribute111('attr-1y6nu');
 },
 'ytd-playlist-panel-renderer::detached': hostElement => {
 DEBUG_5084 && console.log(5084, 'ytd-playlist-panel-renderer::detached');
 if (!(hostElement instanceof HTMLElement_) || hostElement.closest('noscript')) return;
 if (hostElement.isConnected !== false) return;
 },
 _yt_playerProvided: () => {
 mLoaded.flag |= 4;
 document.documentElement.setAttribute111('tabview-loaded', mLoaded.makeString());
 },
 relatedElementProvided: target => {
 if (target.closest('[hidden]')) return;
 elements.related = target;
 console.log('relatedElementProvided');
 videosElementProvidedPromise.resolve();
 },
 onceInfoExpanderElementProvidedPromised: () => {
 console.log('hide-default-text-inline-expander');
 const ytdFlexyElm = elements.flexy;
 if (ytdFlexyElm) {
 ytdFlexyElm.setAttribute111('hide-default-text-inline-expander', '');
 }
 },
 refreshSecondaryInner: lockId => {
 if (lockGet['refreshSecondaryInnerLock'] !== lockId) return;
 const ytdFlexyElm = elements.flexy;
 if (
 ytdFlexyElm &&
 ytdFlexyElm.matches(
 'ytd-watch-flexy[theater][full-bleed-player]:not([full-bleed-no-max-width-columns])'
 )
 ) {
 ytdFlexyElm.setAttribute111('full-bleed-no-max-width-columns', '');
 }
 const related = elements.related;
 if (related && related.isConnected && !related.closest('#right-tabs #tab-videos')) {
 document.querySelector('#tab-videos').assignChildren111(null, related, null);
 }
 const infoExpander = elements.infoExpander;
 if (
 infoExpander &&
 infoExpander.isConnected &&
 !infoExpander.closest('#right-tabs #tab-info')
 ) {
 document.querySelector('#tab-info').assignChildren111(null, infoExpander, null);
 } else {
 }
 const commentsArea = elements.comments;
 if (commentsArea) {
 const isConnected = commentsArea.isConnected;
 if (isConnected && !commentsArea.closest('#right-tabs #tab-comments')) {
 const tab = document.querySelector('#tab-comments');
 tab.assignChildren111(null, commentsArea, null);
 } else {
 }
 }
 },
 'yt-navigate-finish': _evt => {
 const ytdAppElm = document.querySelector(
 'ytd-page-manager#page-manager.style-scope.ytd-app'
 );
 const ytdAppCnt = insp(ytdAppElm);
 pageType = ytdAppCnt ? (ytdAppCnt.data || 0).page : null;
 if (!document.querySelector('ytd-watch-flexy #player')) return;
 const flexyArr = [...document.querySelectorAll('ytd-watch-flexy')].filter(
 e => !e.closest('[hidden]') && e.querySelector('#player')
 );
 if (flexyArr.length === 1) {
 elements.flexy = flexyArr[0];
 if (isRightTabsInserted) {
 Promise.resolve(lockSet['refreshSecondaryInnerLock'])
 .then(eventMap['refreshSecondaryInner'])
 .catch(console.warn);
 Promise.resolve(lockSet['removeKeepCommentsScrollerLock'])
 .then(removeKeepCommentsScroller)
 .catch(console.warn);
 } else {
 navigateFinishedPromise.resolve();
 if (plugin.minibrowser.toUse) plugin.minibrowser.activate();
 if (plugin.autoExpandInfoDesc.toUse) plugin.autoExpandInfoDesc.activate();
 if (plugin.fullChannelNameOnHover.toUse) plugin.fullChannelNameOnHover.activate();
 }
 const chat = elements.chat;
 if (chat instanceof Element) {
 chat.setAttribute111('tyt-active-chat-frame', 'CF');
 }
 const infoExpander = elements.infoExpander;
 if (infoExpander && infoExpander.closest('#right-tabs')) {
 Promise.resolve(lockSet['infoFixLock']).then(infoFix).catch(console.warn);
 }
 Promise.resolve(lockSet['layoutFixLock']).then(layoutFix);
 if (plugin.fullChannelNameOnHover.activated) {
 plugin.fullChannelNameOnHover.onNavigateFinish();
 }
 }
 },
 onceInsertRightTabs: () => {
 const related = elements.related;
 let rightTabs = document.querySelector('#right-tabs');
 if (!document.querySelector('#right-tabs') && related) {
 getLangForPage();
 const docTmp = document.createElement('template');
 docTmp.innerHTML = createHTML(getTabsHTML());
 const newElm = docTmp.content.firstElementChild;
 if (newElm !== null) {
 inPageRearrange = true;
 related.parentNode.insertBefore000(newElm, related);
 inPageRearrange = false;
 }
 rightTabs = newElm;
 rightTabs
 .querySelector('[tyt-tab-content="#tab-comments"]')
 .classList.add('tab-btn-hidden');
 const secondaryWrapper = document.createElement('secondary-wrapper');
 secondaryWrapper.classList.add('tabview-secondary-wrapper');
 secondaryWrapper.id = 'secondary-inner-wrapper';
 const secondaryInner = document.querySelector(
 '#secondary-inner.style-scope.ytd-watch-flexy'
 );
 inPageRearrange = true;
 secondaryWrapper.replaceChildren000(...secondaryInner.childNodes);
 secondaryInner.insertBefore000(secondaryWrapper, secondaryInner.firstChild);
 inPageRearrange = false;
 rightTabs
 .querySelector('#material-tabs')
 .addEventListener('click', eventMap['tabs-btn-click'], true);
 inPageRearrange = true;
 if (!rightTabs.closest('secondary-wrapper')) secondaryWrapper.appendChild000(rightTabs);
 inPageRearrange = false;
 }
 if (rightTabs) {
 isRightTabsInserted = true;
 const ioTabBtns = new IntersectionObserver(
 entries => {
 for (const entry of entries) {
 const rect = entry.boundingClientRect;
 entry.target.classList.toggle('tab-btn-visible', rect.width && rect.height);
 }
 },
 { rootMargin: '0px' }
 );
 for (const btn of document.querySelectorAll('.tab-btn[tyt-tab-content]')) {
 ioTabBtns.observe(btn);
 }
 if (!related.closest('#right-tabs')) {
 document.querySelector('#tab-videos').assignChildren111(null, related, null);
 }
 const infoExpander = elements.infoExpander;
 if (infoExpander && !infoExpander.closest('#right-tabs')) {
 document.querySelector('#tab-info').assignChildren111(null, infoExpander, null);
 }
 const commentsArea = elements.comments;
 if (commentsArea && !commentsArea.closest('#right-tabs')) {
 document.querySelector('#tab-comments').assignChildren111(null, commentsArea, null);
 }
 rightTabsProvidedPromise.resolve();
 roRightTabs.disconnect();
 roRightTabs.observe(rightTabs);
 const ytdFlexyElm = elements.flexy;
 const aoFlexy = new MutationObserver(eventMap['aoFlexyFn']);
 aoFlexy.observe(ytdFlexyElm, { attributes: true });
 Promise.resolve(lockSet['fixInitialTabStateLock'])
 .then(eventMap['fixInitialTabStateFn'])
 .catch(console.warn);
 ytdFlexyElm.incAttribute111('attr-7qlsy');
 }
 },
 aoFlexyFn: () => {
 Promise.resolve(lockSet['checkCommentsShouldBeHiddenLock'])
 .then(eventMap['checkCommentsShouldBeHidden'])
 .catch(console.warn);
 Promise.resolve(lockSet['refreshSecondaryInnerLock'])
 .then(eventMap['refreshSecondaryInner'])
 .catch(console.warn);
 Promise.resolve(lockSet['tabsStatusCorrectionLock'])
 .then(eventMap['tabsStatusCorrection'])
 .catch(console.warn);
 const videoId = getCurrentVideoId();
 if (videoId !== tmpLastVideoId) {
 tmpLastVideoId = videoId;
 Promise.resolve(lockSet['updateOnVideoIdChangedLock'])
 .then(eventMap['updateOnVideoIdChanged'])
 .catch(console.warn);
 }
 },
 twoColumnChanged10: lockId => {
 if (lockId !== lockGet['twoColumnChanged10Lock']) return;
 for (const continuation of document.querySelectorAll(
 '#tab-videos ytd-watch-next-secondary-results-renderer ytd-continuation-item-renderer'
 )) {
 if (continuation.closest('[hidden]')) continue;
 const cnt = insp(continuation);
 if (typeof cnt.showButton === 'boolean') {
 if (cnt.showButton === false) continue;
 cnt.showButton = false;
 const behavior = cnt.ytRendererBehavior || cnt;
 if (typeof behavior.invalidate === 'function') {
 behavior.invalidate(!1);
 }
 }
 }
 },
 tabsStatusCorrection: lockId => {
 if (lockId !== lockGet['tabsStatusCorrectionLock']) return;
 const ytdFlexyElm = elements.flexy;
 if (!ytdFlexyElm) return;
 const p = tabAStatus;
 const q = calculationFn(p, 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 4096);
 let resetForPanelDisappeared = false;
 const wasTheaterBeforeFullscreen = (p & 1) === 1;
 const isEnteringFullscreen = (p & 64) === 0 && (q & 64) === 64;
 const isExitingFullscreen = (p & 64) === 64 && (q & 64) === 0;
 if (p !== q) {
 console.log(388, p, q);
 let actioned = false;
 let special = 0;
 if (plugin['external.ytlstm'].activated) {
 if (q & 64) {
 if (isEnteringFullscreen && wasTheaterBeforeFullscreen) {
 setTimeout(() => {
 if (isTheater()) {
 } else {
 const sizeBtn = document.querySelector(
 'ytd-watch-flexy #ytd-player button.ytp-size-button'
 );
 if (sizeBtn && !isTheater()) {
 sizeBtn.click();
 }
 }
 }, 300);
 }
 } else if (
 (p & (1 | 2 | 4 | 8 | 16 | 4096)) === (1 | 0 | 0 | 8 | 16 | 4096) &&
 (q & (1 | 2 | 4 | 8 | 16 | 4096)) === (1 | 0 | 4 | 0 | 16 | 4096)
 ) {
 special = 3;
 } else if (
 (q & (1 | 16)) === (1 | 16) &&
 document.querySelector('[data-ytlstm-theater-mode]')
 ) {
 special = 1;
 } else if (
 (q & (1 | 8 | 16)) === (1 | 8 | 16) &&
 document.querySelector('[is-two-columns_][theater][tyt-chat="+"]')
 ) {
 special = 2;
 }
 } else {
 if (isExitingFullscreen && wasTheaterBeforeFullscreen) {
 setTimeout(() => {
 if (!isTheater()) {
 const sizeBtn = document.querySelector(
 'ytd-watch-flexy #ytd-player button.ytp-size-button'
 );
 if (sizeBtn) {
 sizeBtn.click();
 }
 }
 }, 300);
 }
 }
 if (special) {
 } else if ((p & 128) === 0 && (q & 128) === 128) {
 lastPanel = 'playlist';
 } else if ((p & 8) === 0 && (q & 8) === 8) {
 lastPanel = 'chat';
 } else if (
 (((p & 4) === 4 && (q & (4 | 8)) === (0 | 0)) ||
 ((p & 8) === 8 && (q & (4 | 8)) === (0 | 0))) &&
 lastPanel === 'chat'
 ) {
 lastPanel = lastTab || '';
 resetForPanelDisappeared = true;
 } else if ((p & (4 | 8)) === 8 && (q & (4 | 8)) === 4 && lastPanel === 'chat') {
 lastPanel = lastTab || '';
 resetForPanelDisappeared = true;
 } else if ((p & 128) === 128 && (q & 128) === 0 && lastPanel === 'playlist') {
 lastPanel = lastTab || '';
 resetForPanelDisappeared = true;
 }
 tabAStatus = q;
 if (special) {
 if (special === 1) {
 if (ytdFlexyElm.getAttribute('tyt-chat') !== '+') {
 ytBtnExpandChat();
 }
 if (ytdFlexyElm.getAttribute('tyt-tab')) {
 switchToTab(null);
 }
 } else if (special === 2) {
 ytBtnCollapseChat();
 } else if (special === 3) {
 ytBtnCancelTheater();
 if (lastTab) {
 switchToTab(lastTab);
 }
 }
 return;
 }
 let bFixForResizedTab = false;
 if ((q ^ 2) === 2 && bFixForResizedTabLater) {
 bFixForResizedTab = true;
 }
 if (((p & 16) === 16) & ((q & 16) === 0)) {
 Promise.resolve(lockSet['twoColumnChanged10Lock'])
 .then(eventMap['twoColumnChanged10'])
 .catch(console.warn);
 }
 if (((p & 2) === 2) ^ ((q & 2) === 2) && (q & 2) === 2) {
 bFixForResizedTab = true;
 }
 if ((p & 2) === 0 && (q & 2) === 2 && (p & 128) === 128 && (q & 128) === 128) {
 lastPanel = lastTab || '';
 ytBtnClosePlaylist();
 actioned = true;
 }
 if (
 (p & (8 | 128)) === (0 | 128) &&
 (q & (8 | 128)) === (8 | 128) &&
 lastPanel === 'chat'
 ) {
 lastPanel = lastTab || '';
 ytBtnClosePlaylist();
 actioned = true;
 }
 if (
 (p & (1 | 2 | 4 | 8 | 16 | 32 | 64 | 128)) === (1 | 2 | 0 | 8 | 16) &&
 (q & (1 | 2 | 4 | 8 | 16 | 32 | 64 | 128)) === (0 | 2 | 0 | 8 | 16)
 ) {
 lastPanel = lastTab || '';
 ytBtnCollapseChat();
 actioned = true;
 }
 if (
 (p & (2 | 128)) === (2 | 0) &&
 (q & (2 | 128)) === (2 | 128) &&
 lastPanel === 'playlist'
 ) {
 switchToTab(null);
 actioned = true;
 }
 if (
 (p & (8 | 128)) === (8 | 0) &&
 (q & (8 | 128)) === (8 | 128) &&
 lastPanel === 'playlist'
 ) {
 lastPanel = lastTab || '';
 ytBtnCollapseChat();
 actioned = true;
 }
 if ((p & (1 | 16 | 128)) === (1 | 16) && (q & (1 | 16 | 128)) === (1 | 16 | 128)) {
 ytBtnCancelTheater();
 actioned = true;
 }
 if ((p & (1 | 16 | 128)) === (16 | 128) && (q & (1 | 16 | 128)) === (1 | 16 | 128)) {
 lastPanel = lastTab || '';
 ytBtnClosePlaylist();
 actioned = true;
 }
 if ((q & 64) === 64) {
 actioned = false;
 } else if ((p & 64) === 64 && (q & 64) === 0) {
 if ((q & 32) === 32) {
 ytBtnCloseEngagementPanels();
 }
 if ((q & (2 | 8)) === (2 | 8)) {
 if (lastPanel === 'chat') {
 switchToTab(null);
 actioned = true;
 } else if (lastPanel) {
 ytBtnCollapseChat();
 actioned = true;
 }
 }
 } else if (
 (p & (1 | 2 | 8 | 16 | 32)) === (1 | 0 | 0 | 16 | 0) &&
 (q & (1 | 2 | 8 | 16 | 32)) === (1 | 0 | 8 | 16 | 0)
 ) {
 ytBtnCancelTheater();
 actioned = true;
 } else if (
 (p & (1 | 16 | 32)) === (0 | 16 | 0) &&
 (q & (1 | 16 | 32)) === (0 | 16 | 32) &&
 (q & (2 | 8)) > 0
 ) {
 if (q & 2) {
 switchToTab(null);
 actioned = true;
 }
 if (q & 8) {
 ytBtnCollapseChat();
 actioned = true;
 }
 } else if (
 (p & (1 | 16 | 8 | 2)) === (16 | 8) &&
 (q & (1 | 16 | 8 | 2)) === 16 &&
 (q & 128) === 0
 ) {
 if (lastTab) {
 switchToTab(lastTab);
 actioned = true;
 }
 } else if ((p & 1) === 0 && (q & 1) === 1) {
 if ((q & 32) === 32) {
 ytBtnCloseEngagementPanels();
 }
 if ((p & 9) === 8 && (q & 9) === 9) {
 ytBtnCollapseChat();
 }
 switchToTab(null);
 actioned = true;
 } else if ((p & 3) === 1 && (q & 3) === 3) {
 ytBtnCancelTheater();
 actioned = true;
 } else if ((p & 10) === 2 && (q & 10) === 10) {
 switchToTab(null);
 actioned = true;
 } else if ((p & (8 | 32)) === (0 | 32) && (q & (8 | 32)) === (8 | 32)) {
 ytBtnCloseEngagementPanels();
 actioned = true;
 } else if ((p & (2 | 32)) === (0 | 32) && (q & (2 | 32)) === (2 | 32)) {
 ytBtnCloseEngagementPanels();
 actioned = true;
 } else if ((p & (2 | 8)) === (0 | 8) && (q & (2 | 8)) === (2 | 8)) {
 ytBtnCollapseChat();
 actioned = true;
 } else if ((p & 1) === 1 && (q & (1 | 32)) === (0 | 0)) {
 if (lastPanel === 'chat') {
 ytBtnExpandChat();
 actioned = true;
 } else if (lastPanel === lastTab && lastTab) {
 switchToTab(lastTab);
 actioned = true;
 }
 }
 if (!actioned && (q & 128) === 128) {
 lastPanel = 'playlist';
 if ((q & 2) === 2) {
 switchToTab(null);
 actioned = true;
 }
 }
 let shouldDoAutoFix = false;
 if ((p & 2) === 2 && (q & (2 | 128)) === (0 | 128)) {
 } else if ((p & 8) === 8 && (q & (8 | 128)) === (0 | 128)) {
 } else if (
 !actioned &&
 (p & (1 | 16)) === 16 &&
 (q & (1 | 16 | 8 | 2 | 32 | 64)) === (16 | 0 | 0)
 ) {
 shouldDoAutoFix = true;
 } else if ((q & (1 | 2 | 4 | 8 | 16 | 32 | 64 | 128)) === (4 | 16)) {
 shouldDoAutoFix = true;
 }
 if (shouldDoAutoFix) {
 console.log(388, 'd');
 if (lastPanel === 'chat') {
 console.log(388, 'd1c');
 ytBtnExpandChat();
 actioned = true;
 } else if (lastPanel === 'playlist') {
 console.log(388, 'd1p');
 ytBtnOpenPlaylist();
 actioned = true;
 } else if (lastTab) {
 console.log(388, 'd2t');
 switchToTab(lastTab);
 actioned = true;
 } else if (resetForPanelDisappeared) {
 console.log(388, 'd2d');
 Promise.resolve(lockSet['fixInitialTabStateLock'])
 .then(eventMap['fixInitialTabStateFn'])
 .catch(console.warn);
 actioned = true;
 }
 }
 if (bFixForResizedTab) {
 bFixForResizedTabLater = false;
 Promise.resolve(0).then(eventMap['fixForTabDisplay']).catch(console.warn);
 }
 if (((p & 16) === 16) ^ ((q & 16) === 16)) {
 Promise.resolve(lockSet['infoFixLock']).then(infoFix).catch(console.warn);
 Promise.resolve(lockSet['removeKeepCommentsScrollerLock'])
 .then(removeKeepCommentsScroller)
 .catch(console.warn);
 Promise.resolve(lockSet['layoutFixLock']).then(layoutFix).catch(console.warn);
 }
 }
 },
 updateOnVideoIdChanged: lockId => {
 if (lockId !== lockGet['updateOnVideoIdChangedLock']) return;
 const videoId = tmpLastVideoId;
 if (!videoId) return;
 const bodyRenderer = elements.infoExpanderRendererBack;
 const bodyRendererNew = elements.infoExpanderRendererFront;
 if (bodyRendererNew && bodyRenderer) {
 insp(bodyRendererNew).data = insp(bodyRenderer).data;
 }
 Promise.resolve(lockSet['infoFixLock']).then(infoFix).catch(console.warn);
 },
 fixInitialTabStateFn: async lockId => {
 if (lockGet['fixInitialTabStateLock'] !== lockId) return;
 const delayTime = fixInitialTabStateK > 0 ? 200 : 1;
 await delayPn(delayTime);
 if (lockGet['fixInitialTabStateLock'] !== lockId) return;
 const kTab = document.querySelector('[tyt-tab]');
 const qTab =
 !kTab || kTab.getAttribute('tyt-tab') === ''
 ? checkElementExist('ytd-watch-flexy[is-two-columns_]', '[hidden]')
 : null;
 if (checkElementExist('ytd-playlist-panel-renderer#playlist', '[hidden], [collapsed]')) {
 DEBUG_5085 && console.log('fixInitialTabStateFn 1p');
 switchToTab(null);
 } else if (checkElementExist('ytd-live-chat-frame#chat', '[hidden], [collapsed]')) {
 DEBUG_5085 && console.log('fixInitialTabStateFn 1a');
 switchToTab(null);
 if (checkElementExist('ytd-watch-flexy[theater]', '[hidden]')) {
 ytBtnCollapseChat();
 }
 } else if (qTab) {
 const hasTheater = qTab.hasAttribute('theater');
 if (!hasTheater) {
 DEBUG_5085 && console.log('fixInitialTabStateFn 1b');
 const btn0 = document.querySelector('.tab-btn-visible');
 if (btn0) {
 switchToTab(btn0);
 } else {
 switchToTab(null);
 }
 } else {
 DEBUG_5085 && console.log('fixInitialTabStateFn 1c');
 switchToTab(null);
 }
 } else {
 DEBUG_5085 && console.log('fixInitialTabStateFn 1z');
 }
 fixInitialTabStateK++;
 },
 'tabs-btn-click': evt => {
 const target = evt.target;
 if (
 target instanceof HTMLElement_ &&
 target.classList.contains('tab-btn') &&
 target.hasAttribute000('tyt-tab-content')
 ) {
 evt.preventDefault();
 evt.stopPropagation();
 evt.stopImmediatePropagation();
 const activeLink = target;
 switchToTab(activeLink);
 }
 },
 };
 Promise.all([videosElementProvidedPromise, navigateFinishedPromise])
 .then(eventMap['onceInsertRightTabs'])
 .catch(console.warn);
 Promise.all([navigateFinishedPromise, infoExpanderElementProvidedPromise])
 .then(eventMap['onceInfoExpanderElementProvidedPromised'])
 .catch(console.warn);
 const isCustomElementsProvided =
 typeof customElements !== 'undefined' &&
 typeof (customElements || 0).whenDefined === 'function';
 const promiseForCustomYtElementsReady = isCustomElementsProvided
 ? Promise.resolve(0)
 : new Promise(callback => {
 const EVENT_KEY_ON_REGISTRY_READY = 'ytI-ce-registry-created';
 if (typeof customElements === 'undefined') {
 if (!('__CE_registry' in document)) {
 Object.defineProperty(document, '__CE_registry', {
 get() {
 },
 set(nv) {
 if (typeof nv == 'object') {
 delete this.__CE_registry;
 this.__CE_registry = nv;
 this.dispatchEvent(new CustomEvent(EVENT_KEY_ON_REGISTRY_READY));
 }
 return true;
 },
 enumerable: false,
 configurable: true,
 });
 }
 let eventHandler = _evt => {
 document.removeEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
 const f = callback;
 callback = null;
 eventHandler = null;
 f();
 };
 document.addEventListener(EVENT_KEY_ON_REGISTRY_READY, eventHandler, false);
 } else {
 callback();
 }
 });
 const _retrieveCE = async nodeName => {
 try {
 isCustomElementsProvided || (await promiseForCustomYtElementsReady);
 await customElements.whenDefined(nodeName);
 } catch (e) {
 console.warn(e);
 }
 };
 const retrieveCE = async nodeName => {
 try {
 isCustomElementsProvided || (await promiseForCustomYtElementsReady);
 await customElements.whenDefined(nodeName);
 const dummy = document.querySelector(nodeName) || document.createElement(nodeName);
 const cProto = insp(dummy).constructor.prototype;
 return cProto;
 } catch (e) {
 console.warn(e);
 }
 };
 const moOverallRes = {
 _yt_playerProvided: () => (window || 0)._yt_player || 0 || 0,
 };
 let promiseWaitNext = null;
 const moOverall = new MutationObserver(() => {
 if (promiseWaitNext) {
 promiseWaitNext.resolve();
 promiseWaitNext = null;
 }
 if (typeof moOverallRes._yt_playerProvided === 'function') {
 const r = moOverallRes._yt_playerProvided();
 if (r) {
 moOverallRes._yt_playerProvided = r;
 eventMap._yt_playerProvided();
 }
 }
 });
 moOverall.observe(document, { subtree: true, childList: true });
 const moEgmPanelReady = new MutationObserver(mutations => {
 for (const mutation of mutations) {
 const target = mutation.target;
 if (!target.hasAttribute000('tyt-egm-panel-jclmd')) continue;
 if (target.hasAttribute000('target-id') && target.hasAttribute000('visibility')) {
 target.removeAttribute000('tyt-egm-panel-jclmd');
 moEgmPanelReadyClearFn();
 Promise.resolve(target)
 .then(eventMap['ytd-engagement-panel-section-list-renderer::bindTarget'])
 .catch(console.warn);
 }
 }
 });
 const moEgmPanelReadyClearFn = () => {
 if (document.querySelector('[tyt-egm-panel-jclmd]') === null) {
 moEgmPanelReady.takeRecords();
 moEgmPanelReady.disconnect();
 }
 };
 document.addEventListener('yt-navigate-finish', eventMap['yt-navigate-finish'], false);
 document.addEventListener(
 'animationstart',
 evt => {
 const f = eventMap[evt.animationName];
 if (typeof f === 'function') f(evt.target);
 },
 capturePassive
 );
 mLoaded.flag |= 1;
 document.documentElement.setAttribute111('tabview-loaded', mLoaded.makeString());
 promiseForCustomYtElementsReady.then(eventMap['ceHack']).catch(console.warn);
 _executionFinished = 1;
 } catch (e) {
 console.log('error 0xF491');
 console.error(e);
 }
};
const styles = {
 main: `
 @keyframes relatedElementProvided{0%{background-position-x:3px;}100%{background-position-x:4px;}}
html[tabview-loaded="icp"] #related.ytd-watch-flexy{animation:relatedElementProvided 1ms linear 0s 1 normal forwards;}
html[tabview-loaded="icp"] #right-tabs #related.ytd-watch-flexy,html[tabview-loaded="icp"] [hidden] #related.ytd-watch-flexy,html[tabview-loaded="icp"] #right-tabs ytd-expander#expander,html[tabview-loaded="icp"] [hidden] ytd-expander#expander,html[tabview-loaded="icp"] ytd-comments ytd-expander#expander{animation:initial;}
#secondary.ytd-watch-flexy{position:relative;}
#secondary-inner.style-scope.ytd-watch-flexy{height:100%;}
#secondary-inner secondary-wrapper{display:flex;flex-direction:column;flex-wrap:nowrap;box-sizing:border-box;padding:0;margin:0;border:0;height:100%;max-height:calc(100vh - var(--ytd-toolbar-height,56px));position:absolute;top:0;right:0;left:0;contain:strict;padding:var(--ytd-margin-6x) var(--ytd-margin-6x) var(--ytd-margin-6x) 0;}
#right-tabs{position:relative;display:flex;padding:0;margin:0;flex-grow:1;flex-direction:column;}
[tyt-tab=""] #right-tabs{flex-grow:0;}
[tyt-tab=""] #right-tabs .tab-content{border:0;}
#right-tabs .tab-content{flex-grow:1;}
ytd-watch-flexy[hide-default-text-inline-expander] #primary.style-scope.ytd-watch-flexy ytd-text-inline-expander{display:none;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden{--comment-pre-load-sizing:90px;visibility:collapse;z-index:-1;position:absolute!important;left:2px;top:2px;width:var(--comment-pre-load-sizing)!important;height:var(--comment-pre-load-sizing)!important;display:block!important;pointer-events:none!important;overflow:hidden;contain:strict;border:0;margin:0;padding:0;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments>ytd-item-section-renderer#sections{display:block!important;overflow:hidden;height:var(--comment-pre-load-sizing);width:var(--comment-pre-load-sizing);contain:strict;border:0;margin:0;padding:0;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments>ytd-item-section-renderer#sections>#contents{display:flex!important;flex-direction:row;gap:60px;overflow:hidden;height:var(--comment-pre-load-sizing);width:var(--comment-pre-load-sizing);contain:strict;border:0;margin:0;padding:0;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments #contents{--comment-pre-load-display:none;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments #contents>*:only-of-type,ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments #contents>*:last-child{--comment-pre-load-display:block;}
ytd-watch-flexy:not([keep-comments-scroller]) #tab-comments.tab-content-hidden ytd-comments#comments #contents>*{display:var(--comment-pre-load-display)!important;}
ytd-watch-flexy #tab-comments:not(.tab-content-hidden){pointer-events:auto!important;}
ytd-watch-flexy #tab-comments:not(.tab-content-hidden) *{pointer-events:auto!important;}
ytd-watch-flexy #tab-comments:not(.tab-content-hidden) button,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) yt-button-renderer,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) a,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) tp-yt-paper-button,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) [role="button"],ytd-watch-flexy #tab-comments:not(.tab-content-hidden) yt-button-shape{pointer-events:auto!important;}
ytd-watch-flexy #tab-comments:not(.tab-content-hidden) ytd-comment-action-buttons-renderer,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) ytd-button-renderer,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) #action-buttons,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) ytd-menu-renderer,ytd-watch-flexy #tab-comments:not(.tab-content-hidden) yt-dropdown-menu{pointer-events:auto!important;}
#right-tabs #material-tabs{position:relative;display:flex;padding:0;border:1px solid var(--ytd-searchbox-legacy-border-color);overflow:hidden;}
[tyt-tab] #right-tabs #material-tabs{border-radius:12px;}
[tyt-tab^="#"] #right-tabs #material-tabs{border-radius:12px 12px 0 0;}
ytd-watch-flexy:not([is-two-columns_]) #right-tabs #material-tabs{outline:0;}
#right-tabs #material-tabs a.tab-btn[tyt-tab-content]>*{pointer-events:none;}
#right-tabs #material-tabs a.tab-btn[tyt-tab-content]>.font-size-right{pointer-events:initial;display:none;}
ytd-watch-flexy #right-tabs .tab-content{padding:0;box-sizing:border-box;display:block;border:1px solid var(--ytd-searchbox-legacy-border-color);border-top:0;position:relative;top:0;display:flex;flex-direction:row;overflow:hidden;border-radius:0 0 12px 12px;}
ytd-watch-flexy:not([is-two-columns_]) #right-tabs .tab-content{height:100%;}
ytd-watch-flexy #right-tabs .tab-content-cld{box-sizing:border-box;position:relative;display:block;width:100%;overflow:auto;--tab-content-padding:var(--ytd-margin-4x);padding:var(--tab-content-padding);contain:layout paint;will-change:scroll-position;}
.tab-content-cld,#right-tabs,.tab-content{transition:none;animation:none;}
ytd-watch-flexy #right-tabs .tab-content-cld::-webkit-scrollbar{width:8px;height:8px;}
ytd-watch-flexy #right-tabs .tab-content-cld::-webkit-scrollbar-track{background:transparent;}
ytd-watch-flexy #right-tabs .tab-content-cld::-webkit-scrollbar-thumb{background:rgba(144,144,144,.5);border-radius:4px;}
ytd-watch-flexy #right-tabs .tab-content-cld::-webkit-scrollbar-thumb:hover{background:rgba(170,170,170,.7);}
#right-tabs #emojis.ytd-commentbox{inset:auto 0 auto 0;width:auto;}
ytd-watch-flexy[is-two-columns_] #right-tabs .tab-content-cld{height:100%;width:100%;contain:size layout paint style;position:absolute;}
ytd-watch-flexy #right-tabs .tab-content-cld.tab-content-hidden{display:none;width:100%;contain:size layout paint style;}
@supports (color:var(--tabview-tab-btn-define)){
ytd-watch-flexy #right-tabs .tab-btn{background:var(--yt-spec-general-background-a);}
html{--tyt-tab-btn-flex-grow:1;--tyt-tab-btn-flex-basis:0%;--tyt-tab-bar-color-1-def:#ff4533;--tyt-tab-bar-color-2-def:var(--yt-brand-light-red);--tyt-tab-bar-color-1:var(--main-color,var(--tyt-tab-bar-color-1-def));--tyt-tab-bar-color-2:var(--main-color,var(--tyt-tab-bar-color-2-def));}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content]{flex:var(--tyt-tab-btn-flex-grow) 1 var(--tyt-tab-btn-flex-basis);position:relative;display:inline-block;text-decoration:none;text-transform:uppercase;--tyt-tab-btn-color:var(--yt-spec-text-secondary);color:var(--tyt-tab-btn-color);text-align:center;padding:14px 8px 10px;border:0;border-bottom:4px solid transparent;font-weight:500;font-size:12px;line-height:18px;cursor:pointer;transition:border 200ms linear 100ms;background-color:var(--ytd-searchbox-legacy-button-color);text-transform:var(--yt-button-text-transform,inherit);user-select:none!important;overflow:hidden;white-space:nowrap;text-overflow:clip;}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content]>svg{height:18px;padding-right:0;vertical-align:bottom;opacity:.5;margin-right:0;color:var(--yt-button-color,inherit);fill:var(--iron-icon-fill-color,currentcolor);stroke:var(--iron-icon-stroke-color,none);pointer-events:none;}
ytd-watch-flexy #right-tabs .tab-btn{--tabview-btn-txt-ml:8px;}
ytd-watch-flexy[tyt-comment-disabled] #right-tabs .tab-btn[tyt-tab-content="#tab-comments"]{--tabview-btn-txt-ml:0;}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content]>svg+span{margin-left:var(--tabview-btn-txt-ml);}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content].active{font-weight:500;outline:0;--tyt-tab-btn-color:var(--yt-spec-text-primary);background-color:var(--ytd-searchbox-legacy-button-focus-color);border-bottom:2px var(--tyt-tab-bar-color-2) solid;}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content].active svg{opacity:.9;}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content]:not(.active):hover{background-color:var(--ytd-searchbox-legacy-button-hover-color);--tyt-tab-btn-color:var(--yt-spec-text-primary);}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content]:not(.active):hover svg{opacity:.9;}
ytd-watch-flexy #right-tabs .tab-btn[tyt-tab-content].tab-btn-hidden{display:none;}
ytd-watch-flexy[tyt-comment-disabled] #right-tabs .tab-btn[tyt-tab-content="#tab-comments"],ytd-watch-flexy[tyt-comment-disabled] #right-tabs .tab-btn[tyt-tab-content="#tab-comments"]:hover{--tyt-tab-btn-color:var(--yt-spec-icon-disabled);}
ytd-watch-flexy[tyt-comment-disabled] #right-tabs .tab-btn[tyt-tab-content="#tab-comments"] span#tyt-cm-count:empty{display:none;}
ytd-watch-flexy #right-tabs .tab-btn span#tyt-cm-count:empty::after{display:inline-block;width:4em;text-align:left;font-size:inherit;color:currentColor;transform:scaleX(.8);}}
@supports (color:var(--tyt-cm-count-define)){
ytd-watch-flexy{--tyt-x-loading-content-letter-spacing:2px;}
html{--tabview-text-loading:"Loading";--tabview-text-fetching:"Fetching";--tabview-panel-loading:var(--tabview-text-loading);}
html:lang(ja){--tabview-text-loading:"読み込み中";--tabview-text-fetching:"フェッチ..";}
html:lang(ko){--tabview-text-loading:"로딩..";--tabview-text-fetching:"가져오기..";}
html:lang(zh-Hant){--tabview-text-loading:"載入中";--tabview-text-fetching:"擷取中";}
html:lang(zh-Hans){--tabview-text-loading:"加载中";--tabview-text-fetching:"抓取中";}
html:lang(ru){--tabview-text-loading:"Загрузка";--tabview-text-fetching:"Получение";}
ytd-watch-flexy #right-tabs .tab-btn span#tyt-cm-count:empty::after{content:var(--tabview-text-loading);letter-spacing:var(--tyt-x-loading-content-letter-spacing);}}
@supports (color:var(--tabview-font-size-btn-define)){
.font-size-right{display:inline-flex;flex-direction:column;position:absolute;right:0;top:0;bottom:0;width:16px;padding:4px 0;justify-content:space-evenly;align-content:space-evenly;pointer-events:none;}
html body ytd-watch-flexy.style-scope .font-size-btn{user-select:none!important;}
.font-size-btn{--tyt-font-size-btn-display:none;display:var(--tyt-font-size-btn-display,none);width:12px;height:12px;color:var(--yt-spec-text-secondary);background-color:var(--yt-spec-badge-chip-background);box-sizing:border-box;cursor:pointer;transform-origin:left top;margin:0;padding:0;position:relative;font-family:'Menlo','Lucida Console','Monaco','Consolas',monospace;line-height:100%;font-weight:900;transition:background-color 90ms linear,color 90ms linear;pointer-events:all;}
.font-size-btn:hover{background-color:var(--yt-spec-text-primary);color:var(--yt-spec-general-background-a);}
@supports (zoom:.5){
.tab-btn .font-size-btn{--tyt-font-size-btn-display:none;}
.tab-btn.active:hover .font-size-btn{--tyt-font-size-btn-display:inline-block;}
body ytd-watch-flexy:not([is-two-columns_]) #columns.ytd-watch-flexy{flex-direction:column;}
body ytd-watch-flexy:not([is-two-columns_]) #secondary.ytd-watch-flexy{display:block;width:100%;box-sizing:border-box;}
body ytd-watch-flexy:not([is-two-columns_]) #secondary.ytd-watch-flexy secondary-wrapper{padding-left:var(--ytd-margin-6x);contain:content;height:initial;}
body ytd-watch-flexy:not([is-two-columns_]) #secondary.ytd-watch-flexy secondary-wrapper #right-tabs{overflow:auto;}
[tyt-chat="+"] { --tyt-chat-grow: 1;}
[tyt-chat="+"] secondary-wrapper>[tyt-chat-container]{flex-grow:var(--tyt-chat-grow);flex-shrink:0;display:flex;flex-direction:column;}
[tyt-chat="+"] secondary-wrapper>[tyt-chat-container]>#chat{flex-grow:var(--tyt-chat-grow);}
ytd-watch-flexy[is-two-columns_]:not([theater]) #columns.style-scope.ytd-watch-flexy{min-height:calc(100vh - var(--ytd-toolbar-height,56px));}
ytd-watch-flexy[is-two-columns_]:not([full-bleed-player]) ytd-live-chat-frame#chat{min-height:initial!important;height:initial!important;}
ytd-watch-flexy[tyt-tab^="#"]:not([is-two-columns_]):not([tyt-chat="+"]) #right-tabs{min-height:var(--ytd-watch-flexy-chat-max-height);}
body ytd-watch-flexy:not([is-two-columns_]) #chat.ytd-watch-flexy{margin-top:0;}
body ytd-watch-flexy:not([is-two-columns_]) ytd-watch-metadata.ytd-watch-flexy{margin-bottom:0;}
ytd-watch-metadata.ytd-watch-flexy ytd-metadata-row-container-renderer{display:none;}
#tab-info [show-expand-button] #expand-sizer.ytd-text-inline-expander{visibility:initial;}
#tab-info #collapse.button.ytd-text-inline-expander {display: none;}
#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>#left-arrow-container.ytd-video-description-infocards-section-renderer>#left-arrow,#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>#right-arrow-container.ytd-video-description-infocards-section-renderer>#right-arrow{border:6px solid transparent;opacity:.65;}
#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>#left-arrow-container.ytd-video-description-infocards-section-renderer>#left-arrow:hover,#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>#right-arrow-container.ytd-video-description-infocards-section-renderer>#right-arrow:hover{opacity:1;}
#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>div#left-arrow-container::before{content:'';background:transparent;width:40px;display:block;height:40px;position:absolute;left:-20px;top:0;z-index:-1;}
#tab-info #social-links.style-scope.ytd-video-description-infocards-section-renderer>div#right-arrow-container::before{content:'';background:transparent;width:40px;display:block;height:40px;position:absolute;right:-20px;top:0;z-index:-1;}
body ytd-watch-flexy[is-two-columns_][tyt-egm-panel_] #columns.style-scope.ytd-watch-flexy #panels.style-scope.ytd-watch-flexy{flex-grow:1;flex-shrink:0;display:flex;flex-direction:column;}
body ytd-watch-flexy[is-two-columns_][tyt-egm-panel_] #columns.style-scope.ytd-watch-flexy #panels.style-scope.ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]{height:initial;max-height:initial;min-height:initial;flex-grow:1;flex-shrink:0;display:flex;flex-direction:column;}
secondary-wrapper [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] ytd-transcript-renderer:not(:empty),secondary-wrapper [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #body.ytd-transcript-renderer:not(:empty),secondary-wrapper [visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"] #content.ytd-transcript-renderer:not(:empty){flex-grow:1;height:initial;max-height:initial;min-height:initial;}
secondary-wrapper #content.ytd-engagement-panel-section-list-renderer{position:relative;}
secondary-wrapper #content.ytd-engagement-panel-section-list-renderer>[panel-target-id]:only-child{contain:style size;}
secondary-wrapper #content.ytd-engagement-panel-section-list-renderer ytd-transcript-segment-list-renderer.ytd-transcript-search-panel-renderer{flex-grow:1;contain:strict;}
secondary-wrapper #content.ytd-engagement-panel-section-list-renderer ytd-transcript-segment-renderer.style-scope.ytd-transcript-segment-list-renderer{contain:layout paint style;}
secondary-wrapper #content.ytd-engagement-panel-section-list-renderer ytd-transcript-segment-renderer.style-scope.ytd-transcript-segment-list-renderer>.segment{contain:layout paint style;}
body ytd-watch-flexy[theater] #secondary.ytd-watch-flexy{margin-top:var(--ytd-margin-3x);padding-top:0;}
body ytd-watch-flexy[theater] secondary-wrapper{margin-top:0;padding-top:0;}
body ytd-watch-flexy[theater] #chat.ytd-watch-flexy{margin-bottom:var(--ytd-margin-2x);}
ytd-watch-flexy[theater] #right-tabs .tab-btn[tyt-tab-content]{padding:8px 4px 6px;border-bottom:0 solid transparent;}
ytd-watch-flexy[theater] #playlist.ytd-watch-flexy{margin-bottom:var(--ytd-margin-2x);}
ytd-watch-flexy[theater] ytd-playlist-panel-renderer[collapsible][collapsed] .header.ytd-playlist-panel-renderer{padding:6px 8px;}
#tab-comments ytd-comments#comments [field-of-cm-count]{margin-top:0;}
#tab-info>ytd-expandable-video-description-body-renderer{margin-bottom:var(--ytd-margin-3x);}
#tab-info [class]:last-child{margin-bottom:0;padding-bottom:0;}
#tab-info ytd-rich-metadata-row-renderer ytd-rich-metadata-renderer{max-width:initial;}
ytd-watch-flexy[is-two-columns_] secondary-wrapper #chat.ytd-watch-flexy{margin-bottom:var(--ytd-margin-3x);}
ytd-watch-flexy[tyt-tab] tp-yt-paper-tooltip{white-space:nowrap;contain:content;}
ytd-watch-info-text tp-yt-paper-tooltip.style-scope.ytd-watch-info-text{margin-bottom:-300px;margin-top:-96px;}
[hide-default-text-inline-expander] #bottom-row #description.ytd-watch-metadata{font-size:1.2rem;line-height:1.8rem;}
[hide-default-text-inline-expander] #bottom-row #description.ytd-watch-metadata yt-animated-rolling-number{font-size:inherit;}
[hide-default-text-inline-expander] #bottom-row #description.ytd-watch-metadata #info-container.style-scope.ytd-watch-info-text{align-items:center;}
ytd-watch-flexy[hide-default-text-inline-expander]{--tyt-bottom-watch-metadata-margin:6px;}
[hide-default-text-inline-expander] #bottom-row #description.ytd-watch-metadata>#description-inner.ytd-watch-metadata{margin:6px 12px;}
[hide-default-text-inline-expander] ytd-watch-metadata[title-headline-xs] h1.ytd-watch-metadata{font-size:1.8rem;}
ytd-watch-flexy[is-two-columns_][hide-default-text-inline-expander] #below.style-scope.ytd-watch-flexy ytd-merch-shelf-renderer{padding:0;border:0;margin:0;}
ytd-watch-flexy[is-two-columns_][hide-default-text-inline-expander] #below.style-scope.ytd-watch-flexy ytd-watch-metadata.ytd-watch-flexy{margin-bottom:6px;}
#tab-info yt-video-attribute-view-model .yt-video-attribute-view-model--horizontal .yt-video-attribute-view-model__link-container .yt-video-attribute-view-model__hero-section{flex-shrink:0;}
#tab-info yt-video-attribute-view-model .yt-video-attribute-view-model__overflow-menu{background:var(--yt-emoji-picker-category-background-color);border-radius:99px;}
#tab-info yt-video-attribute-view-model .yt-video-attribute-view-model--image-square.yt-video-attribute-view-model--image-large .yt-video-attribute-view-model__hero-section{max-height:128px;}
#tab-info yt-video-attribute-view-model .yt-video-attribute-view-model--image-large .yt-video-attribute-view-model__hero-section{max-width:128px;}
#tab-info ytd-reel-shelf-renderer #items.yt-horizontal-list-renderer ytd-reel-item-renderer.yt-horizontal-list-renderer{max-width:142px;}
ytd-watch-info-text#ytd-watch-info-text.style-scope.ytd-watch-metadata #view-count.style-scope.ytd-watch-info-text,ytd-watch-info-text#ytd-watch-info-text.style-scope.ytd-watch-metadata #date-text.style-scope.ytd-watch-info-text{align-items:center;}
ytd-watch-info-text:not([detailed]) #info.ytd-watch-info-text a.yt-simple-endpoint.yt-formatted-string{pointer-events:none;}
body ytd-app>ytd-popup-container>tp-yt-iron-dropdown>#contentWrapper>[slot="dropdown-content"]{backdrop-filter:none;}
#tab-info [tyt-clone-refresh-count]{overflow:visible!important;}
#tab-info #items.ytd-horizontal-card-list-renderer yt-video-attribute-view-model.ytd-horizontal-card-list-renderer{contain:layout;}
#tab-info #thumbnail-container.ytd-structured-description-channel-lockup-renderer,#tab-info ytd-media-lockup-renderer[is-compact] #thumbnail-container.ytd-media-lockup-renderer{flex-shrink:0;}
secondary-wrapper ytd-donation-unavailable-renderer{--ytd-margin-6x:var(--ytd-margin-2x);--ytd-margin-5x:var(--ytd-margin-2x);--ytd-margin-4x:var(--ytd-margin-2x);--ytd-margin-3x:var(--ytd-margin-2x);}
[tyt-no-less-btn] #less{display:none;}
.tyt-metadata-hover-resized #purchase-button,.tyt-metadata-hover-resized #sponsor-button,.tyt-metadata-hover-resized #analytics-button,.tyt-metadata-hover-resized #subscribe-button{display:none!important;}
.tyt-metadata-hover #upload-info{max-width:max-content;min-width:max-content;flex-basis:100vw;flex-shrink:0;}
.tyt-info-invisible{display:none;}
[tyt-playlist-expanded] secondary-wrapper>ytd-playlist-panel-renderer#playlist{overflow:auto;flex-shrink:1;flex-grow:1;max-height:unset!important;}
[tyt-playlist-expanded] secondary-wrapper>ytd-playlist-panel-renderer#playlist>#container{max-height:unset!important;}
secondary-wrapper ytd-playlist-panel-renderer{--ytd-margin-6x:var(--ytd-margin-3x);}
#tab-info ytd-structured-description-playlist-lockup-renderer[collections] #playlist-thumbnail.style-scope.ytd-structured-description-playlist-lockup-renderer{max-width:100%;}
#tab-info ytd-structured-description-playlist-lockup-renderer[collections] #lockup-container.ytd-structured-description-playlist-lockup-renderer{padding:1px;}
#tab-info ytd-structured-description-playlist-lockup-renderer[collections] #thumbnail.ytd-structured-description-playlist-lockup-renderer{outline:1px solid rgba(127,127,127,.5);}
ytd-live-chat-frame#chat[collapsed] ytd-message-renderer~#show-hide-button.ytd-live-chat-frame>ytd-toggle-button-renderer.ytd-live-chat-frame{padding:0;}
ytd-watch-flexy{--tyt-bottom-watch-metadata-margin:12px;}
ytd-watch-flexy[rounded-info-panel],ytd-watch-flexy[rounded-player-large]{--tyt-rounded-a1:12px;}
#bottom-row.style-scope.ytd-watch-metadata .item.ytd-watch-metadata{margin-right:var(--tyt-bottom-watch-metadata-margin,12px);margin-top:var(--tyt-bottom-watch-metadata-margin,12px);}
#cinematics{contain:layout style size;}
ytd-watch-flexy[is-two-columns_]{contain:layout style;}
.yt-spec-touch-feedback-shape--touch-response .yt-spec-touch-feedback-shape__fill{background-color:transparent;}
 body[data-ytlstm-theater-mode] #secondary-inner[class] > secondary-wrapper[class]:not(#chat-container):not(#chat) {display: flex !important;}
 body[data-ytlstm-theater-mode] secondary-wrapper {all: unset;height: 100vh;}
 body[data-ytlstm-theater-mode] #right-tabs {display: none;}
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] [tyt-chat="+"] {--tyt-chat-grow: unset;}
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] #columns.style-scope.ytd-watch-flexy,
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] #secondary.style-scope.ytd-watch-flexy,
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] #secondary-inner.style-scope.ytd-watch-flexy,
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] secondary-wrapper,
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] #chat-container.style-scope,
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] [tyt-chat-container].style-scope {pointer-events: none;}
 body[data-ytlstm-theater-mode] [data-ytlstm-chat-over-video] #chat[class] {pointer-events: auto;}
 .playlist-items.ytd-playlist-panel-renderer {background-color: transparent !important;}
 @supports (color: var(--tyt-fix-20251124)) { #below ytd-watch-metadata .ytTextCarouselItemViewModelImageType { height: 16px; width: 16px;}
 #below ytd-watch-metadata yt-text-carousel-item-view-model { column-gap: 6px;}
 #below ytd-watch-metadata ytd-watch-info-text#ytd-watch-info-text { font-size: inherit; line-height: inherit;}
 `,
};
(async () => {
 var nextBrowserTick =
 void 0 !== nextBrowserTick && nextBrowserTick.version >= 2
 ? nextBrowserTick
 : (() => {
 'use strict';
 const e =
 typeof globalThis !== 'undefined'
 ? globalThis
 : typeof window !== 'undefined'
 ? window
 : this;
 let t = !0;
 if (
 !(function n(s) {
 return s
 ? (t = !1)
 : e.postMessage && !e.importScripts && e.addEventListener
 ? (e.addEventListener('message', n, !1),
 e.postMessage('$$$', '*'),
 e.removeEventListener('message', n, !1),
 t)
 : void 0;
 })()
 ) {
 return void console.warn('Your browser environment cannot use nextBrowserTick');
 }
 const n = (async () => {}).constructor;
 let s = null;
 const o = new Map(),
 { floor: r, random: i } = Math;
 let l;
 do {
 l = `$$nextBrowserTick$$${(i() + 8).toString().slice(2)}$$`;
 } while (l in e);
 const a = l,
 c = a.length + 9;
 e[a] = 1;
 e.addEventListener(
 'message',
 e => {
 if (0 !== o.size) {
 const t = (e || 0).data;
 if ('string' == typeof t && t.length === c && e.source === (e.target || 1)) {
 const e = o.get(t);
 e && ('p' === t[0] && (s = null), o.delete(t), e());
 }
 }
 },
 !1
 );
 const d = (t = o) => {
 if (t === o) {
 if (s) return s;
 let t;
 do {
 t = `p${a}${r(314159265359 * i() + 314159265359).toString(36)}`;
 } while (o.has(t));
 return (
 (s = new n(e => {
 o.set(t, e);
 })),
 e.postMessage(t, '*'),
 (t = null),
 s
 );
 }
 {
 let n;
 do {
 n = `f${a}${r(314159265359 * i() + 314159265359).toString(36)}`;
 } while (o.has(n));
 (o.set(n, t), e.postMessage(n, '*'));
 }
 };
 return ((d.version = 2), d);
 })();
 const communicationKey = `ck-${Date.now()}-${Math.floor(Math.random() * 314159265359 + 314159265359).toString(36)}`;
 const Promise = (async () => {})().constructor;
 if (!document.documentElement) {
 await Promise.resolve(0);
 while (!document.documentElement) {
 await new Promise(resolve => nextBrowserTick(resolve)).then().catch(console.warn);
 }
 }
 const sourceURL = 'debug://tabview-youtube/tabview.execution.js';
 const textContent = `(${executionScript})("${communicationKey}");${'\n\n'}//# sourceURL=${sourceURL}${'\n'}`;
 let button = document.createElement('button');
 button.setAttribute('onclick', createHTML(textContent));
 button.click();
 button = null;
 const style = document.createElement('style');
 const sourceURLMainCSS = 'debug://tabview-youtube/tabview.main.css';
 const cssContent = `${styles['main'].trim()}${'\n\n'}/*# sourceURL=${sourceURLMainCSS} */${'\n'}`;
 const gmAddStyle = (typeof window !== 'undefined' && window['GM_addStyle']) || null;
 if (typeof gmAddStyle === 'function') {
 gmAddStyle(cssContent);
 } else {
 style.textContent = cssContent;
 document.documentElement.appendChild(style);
 }
})();
(function () {
 'use strict';
 const GITHUB_CONFIG = {
 owner: 'diorhc',
 repo: 'YTP',
 branch: 'main',
 basePath: 'locales',
 };
 const CDN_URLS = {
 github: `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.basePath}`,
 jsdelivr: `https://cdn.jsdelivr.net/gh/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}@${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.basePath}`,
 };
 const AVAILABLE_LANGUAGES = ['en', 'ru', 'kr', 'fr', 'du', 'cn', 'tw', 'jp', 'tr'];
 const LANGUAGE_NAMES = {
 en: 'English',
 ru: 'Русский',
 kr: '한국어',
 fr: 'Français',
 du: 'Nederlands',
 cn: '简体中文',
 tw: '繁體中文',
 jp: '日本語',
 tr: 'Türkçe',
 };
 const translationsCache = new Map();
 const loadingPromises = new Map();
 async function fetchTranslation(lang) {
 try {
 if (typeof window !== 'undefined' && window.YouTubePlusEmbeddedTranslations) {
 const embedded = window.YouTubePlusEmbeddedTranslations[lang];
 if (embedded) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(
 '[YouTube+][i18n]',
 `Using embedded translations for ${lang}`
 );
 return embedded;
 }
 }
 } catch (e) {
 console.warn('[YouTube+][i18n]', 'Error reading embedded translations', e);
 }
 try {
 const url = `${CDN_URLS.jsdelivr}/${lang}.json`;
 const response = await fetch(url, {
 cache: 'default',
 headers: { Accept: 'application/json' },
 });
 if (!response.ok) throw new Error(`HTTP ${response.status}`);
 return await response.json();
 } catch {
 try {
 const url = `${CDN_URLS.github}/${lang}.json`;
 console.warn('[YouTube+][i18n]', `Primary CDN failed, trying GitHub raw: ${url}`);
 const response = await fetch(url, {
 cache: 'default',
 headers: { Accept: 'application/json' },
 });
 if (!response.ok) throw new Error(`HTTP ${response.status}`);
 return await response.json();
 } catch (err) {
 console.error('[YouTube+][i18n]', `Failed to fetch translations for ${lang}:`, err);
 throw err;
 }
 }
 }
 function loadTranslationsFromLoader(lang) {
 const languageCode = AVAILABLE_LANGUAGES.includes(lang) ? lang : 'en';
 if (translationsCache.has(languageCode)) return translationsCache.get(languageCode);
 if (loadingPromises.has(languageCode)) return loadingPromises.get(languageCode);
 const loadPromise = (async () => {
 try {
 const translations = await fetchTranslation(languageCode);
 translationsCache.set(languageCode, translations);
 loadingPromises.delete(languageCode);
 return translations;
 } catch (error) {
 loadingPromises.delete(languageCode);
 if (languageCode !== 'en') return loadTranslationsFromLoader('en');
 throw error;
 }
 })();
 loadingPromises.set(languageCode, loadPromise);
 return loadPromise;
 }
 let currentLanguage = 'en';
 let translations = {};
 const translationCache = new Map();
 const languageChangeListeners = new Set();
 let loadingPromise = null;
 const languageMap = {
 ko: 'kr',
 'ko-kr': 'kr',
 fr: 'fr',
 'fr-fr': 'fr',
 nl: 'du',
 'nl-nl': 'du',
 'nl-be': 'du',
 zh: 'cn',
 'zh-cn': 'cn',
 'zh-hans': 'cn',
 'zh-tw': 'tw',
 'zh-hk': 'tw',
 'zh-hant': 'tw',
 ja: 'jp',
 'ja-jp': 'jp',
 tr: 'tr',
 'tr-tr': 'tr',
 };
 function detectLanguage() {
 try {
 const ytLang =
 document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
 if (ytLang) {
 const mapped = languageMap[ytLang.toLowerCase()] || ytLang.toLowerCase().substr(0, 2);
 if (AVAILABLE_LANGUAGES.includes(mapped)) {
 return mapped;
 }
 }
 const browserLang = navigator.language || navigator.userLanguage || 'en';
 const mapped = languageMap[browserLang.toLowerCase()] || browserLang.split('-')[0];
 if (AVAILABLE_LANGUAGES.includes(mapped)) {
 return mapped;
 }
 return 'en';
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Error detecting language:', error);
 return 'en';
 }
 }
 async function loadTranslations() {
 if (loadingPromise) {
 await loadingPromise;
 return true;
 }
 loadingPromise = (async () => {
 try {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(
 '[YouTube+][i18n]',
 `Loading translations for ${currentLanguage}...`
 );
 translations = await loadTranslationsFromLoader(currentLanguage);
 translationCache.clear();
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(
 '[YouTube+][i18n]',
 `✓ Loaded ${Object.keys(translations).length} translations for ${currentLanguage}`
 );
 return true;
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Failed to load translations:', error);
 if (currentLanguage !== 'en') {
 currentLanguage = 'en';
 return loadTranslations();
 }
 return false;
 } finally {
 loadingPromise = null;
 }
 })();
 return loadingPromise;
 }
 function translate(key, params = {}) {
 const cacheKey = `${key}:${JSON.stringify(params)}`;
 if (translationCache.has(cacheKey)) {
 return translationCache.get(cacheKey);
 }
 let text = translations[key];
 if (!text) {
 if (Object.keys(translations).length > 0) {
 console.warn('[YouTube+][i18n]', `Missing translation for key: ${key}`);
 }
 text = key;
 }
 if (Object.keys(params).length > 0) {
 Object.keys(params).forEach(param => {
 text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
 });
 }
 translationCache.set(cacheKey, text);
 return text;
 }
 function getLanguage() {
 return currentLanguage;
 }
 async function setLanguage(lang) {
 if (lang === currentLanguage) {
 return true;
 }
 const oldLang = currentLanguage;
 currentLanguage = lang;
 try {
 const success = await loadTranslations();
 if (success) {
 languageChangeListeners.forEach(listener => {
 try {
 listener(currentLanguage, oldLang);
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Error in language change listener:', error);
 }
 });
 }
 return success;
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Failed to change language:', error);
 currentLanguage = oldLang;
 return false;
 }
 }
 function getAllTranslations() {
 return { ...translations };
 }
 function getAvailableLanguages() {
 return AVAILABLE_LANGUAGES;
 }
 function hasTranslation(key) {
 return translations[key] !== undefined;
 }
 function addTranslation(key, value) {
 translations[key] = value;
 translationCache.clear();
 }
 function addTranslations(newTranslations) {
 Object.assign(translations, newTranslations);
 translationCache.clear();
 }
 function onLanguageChange(callback) {
 languageChangeListeners.add(callback);
 return () => languageChangeListeners.delete(callback);
 }
 function formatNumber(num, options = {}) {
 try {
 const lang = getLanguage();
 const localeMap = {
 ru: 'ru-RU',
 kr: 'ko-KR',
 fr: 'fr-FR',
 du: 'nl-NL',
 cn: 'zh-CN',
 tw: 'zh-TW',
 jp: 'ja-JP',
 tr: 'tr-TR',
 };
 const locale = localeMap[lang] || 'en-US';
 return new Intl.NumberFormat(locale, options).format(num);
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Error formatting number:', error);
 return String(num);
 }
 }
 function formatDate(date, options = {}) {
 try {
 const lang = getLanguage();
 const localeMap = {
 ru: 'ru-RU',
 kr: 'ko-KR',
 fr: 'fr-FR',
 du: 'nl-NL',
 cn: 'zh-CN',
 tw: 'zh-TW',
 jp: 'ja-JP',
 tr: 'tr-TR',
 };
 const locale = localeMap[lang] || 'en-US';
 const dateObj = date instanceof Date ? date : new Date(date);
 return new Intl.DateTimeFormat(locale, options).format(dateObj);
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Error formatting date:', error);
 return String(date);
 }
 }
 function pluralize(count, singular, plural, few = null) {
 const lang = getLanguage();
 if (lang === 'ru' && few) {
 const mod10 = count % 10;
 const mod100 = count % 100;
 if (mod10 === 1 && mod100 !== 11) {
 return singular;
 }
 if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
 return few;
 }
 return plural;
 }
 return count === 1 ? singular : plural;
 }
 function clearCache() {
 translationCache.clear();
 }
 function getCacheStats() {
 return {
 size: translationCache.size,
 currentLanguage,
 availableLanguages: getAvailableLanguages(),
 translationsLoaded: Object.keys(translations).length,
 };
 }
 async function initialize() {
 try {
 currentLanguage = detectLanguage();
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(
 '[YouTube+][i18n]',
 `Detected language: ${currentLanguage} (${LANGUAGE_NAMES[currentLanguage] || currentLanguage})`
 );
 await loadTranslations();
 } catch (error) {
 console.error('[YouTube+][i18n]', 'Initialization error:', error);
 currentLanguage = 'en';
 }
 }
 const i18nAPI = {
 t: translate,
 translate,
 getLanguage,
 setLanguage,
 detectLanguage,
 getAllTranslations,
 getAvailableLanguages,
 hasTranslation,
 addTranslation,
 addTranslations,
 onLanguageChange,
 formatNumber,
 formatDate,
 pluralize,
 clearCache,
 getCacheStats,
 loadTranslations,
 initialize,
 };
 if (typeof window !== 'undefined') {
 window.YouTubePlusI18n = i18nAPI;
 window.YouTubePlusI18nLoader = {
 loadTranslations: loadTranslationsFromLoader,
 AVAILABLE_LANGUAGES,
 LANGUAGE_NAMES,
 CDN_URLS,
 };
 if (window.YouTubeUtils) {
 window.YouTubeUtils.i18n = i18nAPI;
 window.YouTubeUtils.t = translate;
 window.YouTubeUtils.getLanguage = getLanguage;
 }
 }
 if (typeof module !== 'undefined' && module.exports) {
 module.exports = i18nAPI;
 }
 initialize().then(() => {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+][i18n]', 'i18n system initialized successfully');
 });
})();
function createSettingsSidebar(t) {
 return `
 <div class="ytp-plus-settings-sidebar">
 <div class="ytp-plus-settings-sidebar-header">
 <h2 class="ytp-plus-settings-title">${t('settingsTitle')}</h2>
 </div>
 <div class="ytp-plus-settings-nav">
 ${createNavItem('basic', t('basicTab'), createBasicIcon(), true)}
 ${createNavItem('advanced', t('advancedTab'), createAdvancedIcon())}
 ${createNavItem('experimental', t('experimentalTab'), createExperimentalIcon())}
 ${createNavItem('report', t('reportTab'), createReportIcon())}
 ${createNavItem('about', t('aboutTab'), createAboutIcon())}
 </div>
 </div>
 `;
}
function createNavItem(section, label, icon, active = false) {
 const activeClass = active ? ' active' : '';
 return `
 <div class="ytp-plus-settings-nav-item${activeClass}" data-section="${section}">
 ${icon}
 ${label}
 </div>
 `;
}
function createBasicIcon() {
 return `
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
 <circle cx="9" cy="9" r="2"/>
 <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H13l-2-2v3h6l3 3"/>
 </svg>
 `;
}
function createAdvancedIcon() {
 return `
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <circle cx="12" cy="12" r="3"/>
 <path d="m12 1 0 6m0 6 0 6"/>
 <path d="m17.5 6.5-4.5 4.5m0 0-4.5 4.5m9-9L12 12l5.5 5.5"/>
 </svg>
 `;
}
function createExperimentalIcon() {
 return `
 <svg width="64px" height="64px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M18.019 4V15.0386L6.27437 39.3014C5.48686 40.9283 6.16731 42.8855 7.79421 43.673C8.23876 43.8882 8.72624 44 9.22013 44H38.7874C40.5949 44 42.0602 42.5347 42.0602 40.7273C42.0602 40.2348 41.949 39.7488 41.7351 39.3052L30.0282 15.0386V4H18.019Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"></path>
 <path d="M10.9604 29.9998C13.1241 31.3401 15.2893 32.0103 17.4559 32.0103C19.6226 32.0103 21.7908 31.3401 23.9605 29.9998C26.1088 28.6735 28.2664 28.0103 30.433 28.0103C32.5997 28.0103 34.7755 28.6735 36.9604 29.9998" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
 </svg>
 `;
}
function createReportIcon() {
 return `
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
 <polyline points="14 2 14 8 20 8"></polyline>
 <line x1="12" y1="18" x2="12" y2="12"></line>
 <line x1="12" y1="9" x2="12.01" y2="9"></line>
 </svg>
 `;
}
function createAboutIcon() {
 return `
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <circle cx="12" cy="12" r="10"/>
 <path d="m9 12 2 2 4-4"/>
 </svg>
 `;
}
function createSettingsItem(label, description, setting, checked) {
 return `
 <div class="ytp-plus-settings-item">
 <div>
 <label class="ytp-plus-settings-item-label">${label}</label>
 <div class="ytp-plus-settings-item-description">${description}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" data-setting="${setting}" ${checked ? 'checked' : ''}>
 </div>
 `;
}
function createDownloadSiteOption(site, _t) {
 const { key, name, description, checked, hasControls, controls } = site;
 return `
 <div class="download-site-option">
 <div class="download-site-header">
 <div>
 <div class="download-site-name">${name}</div>
 <div class="download-site-desc">${description}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" data-setting="downloadSite_${key}" ${checked ? 'checked' : ''}>
 </div>
 ${hasControls ? `<div class="download-site-controls" style="display:${checked ? 'block' : 'none'};">${controls}</div>` : ''}
 </div>
 `;
}
function createY2MateControls(customization, t) {
 const name = customization?.name || 'Y2Mate';
 const url = customization?.url || 'https://www.y2mate.com/youtube/{videoId}';
 return `
 <input type="text" placeholder="${t('siteName')}" value="${name}"
 data-site="y2mate" data-field="name" class="download-site-input"
 style="width:100%;margin-top:6px;padding:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:white;font-size:12px;">
 <input type="text" placeholder="${t('urlTemplate')}" value="${url}"
 data-site="y2mate" data-field="url" class="download-site-input"
 style="width:100%;margin-top:4px;padding:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:white;font-size:11px;">
 <div class="download-site-cta">
 <button class="glass-button" id="download-y2mate-save" style="padding:6px 10px;font-size:12px;">${t('saveButton')}</button>
 <button class="glass-button" id="download-y2mate-reset" style="padding:6px 10px;font-size:12px;background:rgba(255,0,0,0.12);">${t('resetButton')}</button>
 </div>
 `;
}
function createYTDLControls() {
 return `
 <div style="display:flex;gap:8px;align-items:center;width:100%;">
 <button class="glass-button" id="open-ytdl-github" style="margin:0;padding:10px 14px;font-size:13px;flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
 <polyline points="15,3 21,3 21,9"/>
 <line x1="10" y1="14" x2="21" y2="3"/>
 </svg>
 GitHub
 </button>
 </div>
 `;
}
function createDownloadSubmenu(settings, t) {
 const display = settings.enableDownload ? 'block' : 'none';
 const sites = [
 {
 key: 'y2mate',
 name: settings.downloadSiteCustomization?.y2mate?.name || 'Y2Mate',
 description: t('customDownloader'),
 checked: settings.downloadSites?.y2mate,
 hasControls: true,
 controls: createY2MateControls(settings.downloadSiteCustomization?.y2mate, t),
 },
 {
 key: 'ytdl',
 name: t('byYTDL'),
 description: t('customDownload'),
 checked: settings.downloadSites?.ytdl,
 hasControls: true,
 controls: createYTDLControls(),
 },
 {
 key: 'direct',
 name: t('directDownload'),
 description: t('directDownloadDesc'),
 checked: settings.downloadSites?.direct,
 hasControls: false,
 },
 ];
 return `
 <div class="download-submenu" style="display:${display};margin-left:12px;margin-bottom:12px;">
 <div class="glass-card" style="display:flex;flex-direction:column;gap:8px;">
 ${sites.map(site => createDownloadSiteOption(site, t)).join('')}
 </div>
 </div>
 `;
}
function createBasicSettingsSection(settings, t) {
 return `
 <div class="ytp-plus-settings-section" data-section="basic">
 ${createSettingsItem(t('speedControl'), t('speedControlDesc'), 'enableSpeedControl', settings.enableSpeedControl)}
 ${createSettingsItem(t('screenshotButton'), t('screenshotButtonDesc'), 'enableScreenshot', settings.enableScreenshot)}
 ${createSettingsItem(t('downloadButton'), t('downloadButtonDesc'), 'enableDownload', settings.enableDownload)}
 ${createDownloadSubmenu(settings, t)}
 </div>
 `;
}
function createAboutSection() {
 return `
 <div class="ytp-plus-settings-section hidden" data-section="about">
 <svg class="app-icon" width="90" height="90" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" version="1.1">
 <path d="m23.24,4.62c-0.85,0.45 -2.19,2.12 -4.12,5.13c-1.54,2.41 -2.71,4.49 -3.81,6.8c-0.55,1.14 -1.05,2.2 -1.13,2.35c-0.08,0.16 -0.78,0.7 -1.66,1.28c-1.38,0.91 -1.8,1.29 -1.4,1.28c0.08,0 0.67,-0.35 1.31,-0.77c0.64,-0.42 1.19,-0.76 1.2,-0.74c0.02,0.02 -0.1,0.31 -0.25,0.66c-1.03,2.25 -1.84,5.05 -1.84,6.37c0.01,1.89 0.84,2.67 2.86,2.67c1.08,0 1.94,-0.31 3.66,-1.29c1.84,-1.06 3.03,-1.93 4.18,-3.09c1.69,-1.7 2.91,-3.4 3.28,-4.59c0.59,-1.9 -0.1,-3.08 -2.02,-3.44c-0.87,-0.16 -2.85,-0.14 -3.75,0.06c-1.78,0.38 -2.74,0.76 -2.5,1c0.03,0.03 0.5,-0.1 1.05,-0.28c1.49,-0.48 2.34,-0.59 3.88,-0.53c1.64,0.07 2.09,0.19 2.69,0.75l0.46,0.43l0,0.87c0,0.74 -0.05,0.98 -0.35,1.6c-0.69,1.45 -2.69,3.81 -4.37,5.14c-0.93,0.74 -2.88,1.94 -4.07,2.5c-1.64,0.77 -3.56,0.72 -4.21,-0.11c-0.39,-0.5 -0.5,-1.02 -0.44,-2.11c0.05,-0.85 0.16,-1.32 0.67,-2.86c0.34,-1.01 0.86,-2.38 1.15,-3.04c0.52,-1.18 0.55,-1.22 1.6,-2.14c4.19,-3.65 8.42,-9.4 9.02,-12.26c0.2,-0.94 0.13,-1.46 -0.21,-1.7c-0.31,-0.22 -0.38,-0.21 -0.89,0.06m0.19,0.26c-0.92,0.41 -3.15,3.44 -5.59,7.6c-1.05,1.79 -3.12,5.85 -3.02,5.95c0.07,0.07 1.63,-1.33 2.58,-2.34c1.57,-1.65 3.73,-4.39 4.88,-6.17c1.31,-2.03 2.06,-4.11 1.77,-4.89c-0.13,-0.34 -0.16,-0.35 -0.62,-0.15m11.69,13.32c-0.3,0.6 -1.19,2.54 -1.98,4.32c-1.6,3.62 -1.67,3.71 -2.99,4.34c-1.13,0.54 -2.31,0.85 -3.54,0.92c-0.99,0.06 -1.08,0.04 -1.38,-0.19c-0.28,-0.22 -0.31,-0.31 -0.26,-0.7c0.03,-0.25 0.64,-1.63 1.35,-3.08c1.16,-2.36 2.52,-5.61 2.52,-6.01c0,-0.49 -0.36,0.19 -1.17,2.22c-0.51,1.26 -1.37,3.16 -1.93,4.24c-0.55,1.08 -1.04,2.17 -1.09,2.43c-0.1,0.59 0.07,1.03 0.49,1.28c0.78,0.46 3.3,0.06 5.13,-0.81l0.93,-0.45l-0.66,1.25c-0.7,1.33 -3.36,6.07 -4.31,7.67c-2.02,3.41 -3.96,5.32 -6.33,6.21c-2.57,0.96 -4.92,0.74 -6.14,-0.58c-0.81,-0.88 -0.82,-1.71 -0.04,-3.22c1.22,-2.36 6.52,-6.15 10.48,-7.49c0.52,-0.18 0.95,-0.39 0.95,-0.46c0,-0.21 -0.19,-0.18 -1.24,0.2c-1.19,0.43 -3.12,1.37 -4.34,2.11c-2.61,1.59 -5.44,4.09 -6.13,5.43c-1.15,2.2 -0.73,3.61 1.4,4.6c0.59,0.28 0.75,0.3 2.04,0.3c1.67,0 2.42,-0.18 3.88,-0.89c1.87,-0.92 3.17,-2.13 4.72,-4.41c0.98,-1.44 4.66,-7.88 5.91,-10.33c0.25,-0.49 0.68,-1.19 0.96,-1.56c0.28,-0.37 0.76,-1.15 1.06,-1.73c0.82,-1.59 2.58,-6.1 2.58,-6.6c0,-0.06 -0.07,-0.1 -0.17,-0.1c-0.10,0 -0.39,0.44 -0.71,1.09m-1.34,3.7c-0.93,2.08 -1.09,2.48 -0.87,2.2c0.19,-0.24 1.66,-3.65 1.6,-3.71c-0.02,-0.02 -0.35,0.66 -0.73,1.51" fill="none" fill-rule="evenodd" stroke="currentColor" />
 </svg>
 <h1>YouTube +</h1><br><br>
 </div>
 `;
}
function createMainContent(settings, t) {
 return `
 <div class="ytp-plus-settings-main">
 <div class="ytp-plus-settings-sidebar-close">
 <button class="ytp-plus-settings-close" aria-label="${t('closeButton')}">
 <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
 </svg>
 </button>
 </div>
 <div class="ytp-plus-settings-content">
 ${createBasicSettingsSection(settings, t)}
 <div class="ytp-plus-settings-section hidden" data-section="advanced"></div>
 <div class="ytp-plus-settings-section hidden" data-section="experimental"></div>
 <div class="ytp-plus-settings-section hidden" data-section="report"></div>
 ${createAboutSection()}
 </div>
 <div class="ytp-plus-footer">
 <button class="ytp-plus-button ytp-plus-button-primary" id="ytp-plus-save-settings">${t('saveChanges')}</button>
 </div>
 </div>
 `;
}
if (typeof window !== 'undefined') {
 window.YouTubePlusSettingsHelpers = {
 createSettingsSidebar,
 createMainContent,
 createSettingsItem,
 createDownloadSiteOption,
 createBasicSettingsSection,
 };
}
const initializeDownloadSites = settings => {
 if (!settings.downloadSites) {
 settings.downloadSites = { y2mate: true, ytdl: true, direct: true };
 }
};
const toggleDownloadSiteControls = checkbox => {
 try {
 const container = checkbox.closest('.download-site-option');
 if (container) {
 const controls = container.querySelector('.download-site-controls');
 if (controls) {
 controls.style.display = checkbox.checked ? 'block' : 'none';
 }
 }
 } catch (err) {
 console.warn('[YouTube+] toggle download-site-controls failed:', err);
 }
};
const safelySaveSettings = saveSettings => {
 try {
 saveSettings();
 } catch (err) {
 console.warn('[YouTube+] autosave downloadSite toggle failed:', err);
 }
};
const handleDownloadSiteToggle = (target, key, settings, markDirty, saveSettings) => {
 initializeDownloadSites(settings);
 const checkbox = (target);
 settings.downloadSites[key] = checkbox.checked;
 try {
 markDirty();
 } catch {}
 toggleDownloadSiteControls(checkbox);
 rebuildDownloadDropdown(settings);
 safelySaveSettings(saveSettings);
};
const handleDownloadButtonToggle = context => {
 const { settings, getElement, addDownloadButton } = context;
 const controls = getElement('.ytp-right-controls');
 const existing = getElement('.ytp-download-button', false);
 if (settings.enableDownload) {
 if (controls && !existing) addDownloadButton(controls);
 } else {
 if (existing) existing.remove();
 const dropdown = document.querySelector('.download-options');
 if (dropdown) dropdown.remove();
 }
};
const handleSpeedControlToggle = context => {
 const { settings, getElement, addSpeedControlButton } = context;
 const controls = getElement('.ytp-right-controls');
 const existing = getElement('.speed-control-btn', false);
 if (settings.enableSpeedControl) {
 if (controls && !existing) addSpeedControlButton(controls);
 } else {
 if (existing) existing.remove();
 const speedOptions = document.querySelector('.speed-options');
 if (speedOptions) speedOptions.remove();
 }
};
const updateGlobalSettings = settings => {
 if (typeof window !== 'undefined' && window.youtubePlus) {
 window.youtubePlus.settings = window.youtubePlus.settings || settings;
 }
};
const applySettingLive = (setting, context) => {
 const { settings, refreshDownloadButton } = context;
 try {
 if (context.updatePageBasedOnSettings) {
 context.updatePageBasedOnSettings();
 }
 if (setting === 'enableDownload') {
 handleDownloadButtonToggle(context);
 } else if (setting === 'enableSpeedControl') {
 handleSpeedControlToggle(context);
 }
 if (refreshDownloadButton) {
 refreshDownloadButton();
 }
 } catch (innerErr) {
 console.warn('[YouTube+] live apply specific toggle failed:', innerErr);
 }
 updateGlobalSettings(settings);
};
const handleSimpleSettingToggle = (
 target,
 setting,
 settings,
 context,
 markDirty,
 saveSettings,
 modal
) => {
 settings[setting] = (target).checked;
 try {
 markDirty();
 } catch {}
 try {
 applySettingLive(setting, context);
 } catch (err) {
 console.warn('[YouTube+] apply settings live failed:', err);
 }
 try {
 saveSettings();
 } catch (err) {
 console.warn('[YouTube+] autosave simple setting failed:', err);
 }
 if (setting === 'enableDownload') {
 const submenu = modal.querySelector('.download-submenu');
 if (submenu) {
 submenu.style.display = (target).checked ? 'block' : 'none';
 }
 }
};
const initializeDownloadCustomization = settings => {
 if (!settings.downloadSiteCustomization) {
 settings.downloadSiteCustomization = {
 y2mate: { name: 'Y2Mate', url: 'https://www.y2mate.com/youtube/{videoId}' },
 };
 }
};
const initializeDownloadSite = (settings, site) => {
 if (!settings.downloadSiteCustomization[site]) {
 settings.downloadSiteCustomization[site] = { name: '', url: '' };
 }
};
const getDownloadSiteFallbackName = (site, t) => {
 if (site === 'y2mate') return 'Y2Mate';
 if (site === 'ytdl') return t('byYTDL');
 return t('directDownload');
};
const updateDownloadSiteName = (target, site, t) => {
 const nameDisplay = target.closest('.download-site-option')?.querySelector('.download-site-name');
 if (nameDisplay) {
 const inputValue = (target).value;
 const fallbackName = getDownloadSiteFallbackName(site, t);
 nameDisplay.textContent = inputValue || fallbackName;
 }
};
const rebuildDownloadDropdown = settings => {
 try {
 if (
 typeof window !== 'undefined' &&
 window.youtubePlus &&
 typeof window.youtubePlus.rebuildDownloadDropdown === 'function'
 ) {
 window.youtubePlus.settings = window.youtubePlus.settings || settings;
 window.youtubePlus.rebuildDownloadDropdown();
 }
 } catch (err) {
 console.warn('[YouTube+] rebuildDownloadDropdown call failed:', err);
 }
};
const handleDownloadSiteInput = (target, site, field, settings, markDirty, t) => {
 initializeDownloadCustomization(settings);
 initializeDownloadSite(settings, site);
 settings.downloadSiteCustomization[site][field] = (target).value;
 try {
 markDirty();
 } catch {}
 if (field === 'name') {
 updateDownloadSiteName(target, site, t);
 }
 rebuildDownloadDropdown(settings);
};
const ensureY2MateStructure = settings => {
 if (!settings.downloadSiteCustomization) {
 settings.downloadSiteCustomization = {
 y2mate: { name: 'Y2Mate', url: 'https://www.y2mate.com/youtube/{videoId}' },
 };
 }
 if (!settings.downloadSiteCustomization.y2mate) {
 settings.downloadSiteCustomization.y2mate = { name: '', url: '' };
 }
};
const readY2MateInputs = (container, settings) => {
 const nameInput = container.querySelector(
 'input.download-site-input[data-site="y2mate"][data-field="name"]'
 );
 const urlInput = container.querySelector(
 'input.download-site-input[data-site="y2mate"][data-field="url"]'
 );
 if (nameInput) settings.downloadSiteCustomization.y2mate.name = nameInput.value;
 if (urlInput) settings.downloadSiteCustomization.y2mate.url = urlInput.value;
};
const triggerRebuildDropdown = () => {
 try {
 if (
 typeof window !== 'undefined' &&
 window.youtubePlus &&
 typeof window.youtubePlus.rebuildDownloadDropdown === 'function'
 ) {
 window.youtubePlus.rebuildDownloadDropdown();
 }
 } catch (err) {
 console.warn('[YouTube+] rebuildDownloadDropdown call failed:', err);
 }
};
const handleY2MateSave = (target, settings, saveSettings, showNotification, t) => {
 ensureY2MateStructure(settings);
 const container = target.closest('.download-site-option');
 if (container) {
 readY2MateInputs(container, settings);
 }
 saveSettings();
 if (window.youtubePlus) {
 window.youtubePlus.settings = window.youtubePlus.settings || settings;
 }
 triggerRebuildDropdown();
 showNotification(t('y2mateSettingsSaved'));
};
const resetY2MateToDefaults = settings => {
 ensureY2MateStructure(settings);
 settings.downloadSiteCustomization.y2mate = {
 name: 'Y2Mate',
 url: 'https://www.y2mate.com/youtube/{videoId}',
 };
};
const updateY2MateModalInputs = (container, settings) => {
 const nameInput = container.querySelector(
 'input.download-site-input[data-site="y2mate"][data-field="name"]'
 );
 const urlInput = container.querySelector(
 'input.download-site-input[data-site="y2mate"][data-field="url"]'
 );
 const nameDisplay = container.querySelector('.download-site-name');
 const y2mateSettings = settings.downloadSiteCustomization.y2mate;
 if (nameInput) nameInput.value = y2mateSettings.name;
 if (urlInput) urlInput.value = y2mateSettings.url;
 if (nameDisplay) nameDisplay.textContent = y2mateSettings.name;
};
const handleY2MateReset = (modal, settings, saveSettings, showNotification, t) => {
 resetY2MateToDefaults(settings);
 const container = modal.querySelector('.download-site-option');
 if (container) {
 updateY2MateModalInputs(container, settings);
 }
 saveSettings();
 if (window.youtubePlus) {
 window.youtubePlus.settings = window.youtubePlus.settings || settings;
 }
 triggerRebuildDropdown();
 showNotification(t('y2mateReset'));
};
const handleSidebarNavigation = (navItem, modal) => {
 const { dataset } = navItem;
 const { section } = dataset;
 modal
 .querySelectorAll('.ytp-plus-settings-nav-item')
 .forEach(item => item.classList.remove('active'));
 modal.querySelectorAll('.ytp-plus-settings-section').forEach(s => s.classList.add('hidden'));
 navItem.classList.add('active');
 const targetSection = modal.querySelector(
 `.ytp-plus-settings-section[data-section="${section}"]`
 );
 if (targetSection) targetSection.classList.remove('hidden');
};
if (typeof window !== 'undefined') {
 window.YouTubePlusModalHandlers = {
 handleDownloadSiteToggle,
 handleSimpleSettingToggle,
 handleDownloadSiteInput,
 handleY2MateSave,
 handleY2MateReset,
 handleSidebarNavigation,
 applySettingLive,
 };
}
(function () {
 'use strict';
 if (typeof YouTubeUtils === 'undefined') {
 console.error('[YouTube+ Download] YouTubeUtils not found!');
 return;
 }
 function createSubtitleSelect() {
 const subtitleSelect = document.createElement('div');
 subtitleSelect.setAttribute('role', 'listbox');
 Object.assign(subtitleSelect.style, {
 position: 'relative',
 width: '100%',
 marginBottom: '8px',
 fontSize: '14px',
 color: '#fff',
 cursor: 'pointer',
 });
 const _ssDisplay = document.createElement('div');
 Object.assign(_ssDisplay.style, {
 padding: '10px 12px',
 borderRadius: '10px',
 background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
 border: '1px solid rgba(255,255,255,0.06)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 gap: '8px',
 backdropFilter: 'blur(6px)',
 boxShadow: '0 4px 18px rgba(0,0,0,0.35) inset',
 });
 const _ssLabel = document.createElement('div');
 _ssLabel.style.flex = '1';
 _ssLabel.style.overflow = 'hidden';
 _ssLabel.style.textOverflow = 'ellipsis';
 _ssLabel.style.whiteSpace = 'nowrap';
 _ssLabel.textContent = t('loading');
 const _ssChevron = document.createElement('div');
 _ssChevron.textContent = '▾';
 _ssChevron.style.opacity = '0.8';
 _ssDisplay.appendChild(_ssLabel);
 _ssDisplay.appendChild(_ssChevron);
 const _ssList = document.createElement('div');
 Object.assign(_ssList.style, {
 position: 'absolute',
 top: 'calc(100% + 8px)',
 left: '0',
 right: '0',
 maxHeight: '220px',
 overflowY: 'auto',
 borderRadius: '10px',
 background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
 border: '1px solid rgba(255,255,255,0.06)',
 boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
 backdropFilter: 'blur(8px)',
 zIndex: '9999',
 display: 'none',
 });
 subtitleSelect.appendChild(_ssDisplay);
 subtitleSelect.appendChild(_ssList);
 subtitleSelect._options = [];
 subtitleSelect._value = '';
 subtitleSelect._disabled = false;
 subtitleSelect.setPlaceholder = text => {
 _ssLabel.textContent = text || '';
 subtitleSelect._options = [];
 _ssList.innerHTML = '';
 subtitleSelect._value = '';
 };
 subtitleSelect.setOptions = options => {
 subtitleSelect._options = options || [];
 _ssList.innerHTML = '';
 subtitleSelect._options.forEach(opt => {
 const item = document.createElement('div');
 item.textContent = opt.text;
 item.dataset.value = String(opt.value);
 Object.assign(item.style, {
 padding: '10px 12px',
 cursor: 'pointer',
 borderBottom: '1px solid rgba(255,255,255,0.02)',
 color: '#fff',
 });
 item.addEventListener('click', () => {
 subtitleSelect.value = item.dataset.value;
 _ssList.style.display = 'none';
 });
 item.addEventListener('mouseenter', () => {
 item.style.background = 'rgba(255,255,255,0.02)';
 });
 item.addEventListener('mouseleave', () => {
 item.style.background = 'transparent';
 });
 _ssList.appendChild(item);
 });
 if (subtitleSelect._options.length > 0) {
 subtitleSelect.value = String(subtitleSelect._options[0].value);
 } else {
 subtitleSelect._value = '';
 _ssLabel.textContent = t('noSubtitles');
 }
 };
 Object.defineProperty(subtitleSelect, 'value', {
 get() {
 return subtitleSelect._value;
 },
 set(v) {
 subtitleSelect._value = String(v);
 const found = subtitleSelect._options.find(o => String(o.value) === subtitleSelect._value);
 _ssLabel.textContent = found ? found.text : '';
 },
 });
 Object.defineProperty(subtitleSelect, 'disabled', {
 get() {
 return subtitleSelect._disabled;
 },
 set(v) {
 subtitleSelect._disabled = !!v;
 _ssDisplay.style.opacity = subtitleSelect._disabled ? '0.5' : '1';
 subtitleSelect.style.pointerEvents = subtitleSelect._disabled ? 'none' : 'auto';
 },
 });
 _ssDisplay.addEventListener('click', () => {
 if (subtitleSelect._disabled) return;
 _ssList.style.display = _ssList.style.display === 'none' ? '' : 'none';
 });
 document.addEventListener('click', e => {
 if (!subtitleSelect.contains(e.target)) _ssList.style.display = 'none';
 });
 return subtitleSelect;
 }
 const { NotificationManager } = YouTubeUtils;
 function t(key, params = {}) {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 const str = String(key || '');
 if (!params || Object.keys(params).length === 0) return str;
 let result = str;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 }
 const logger =
 typeof YouTubePlusLogger !== 'undefined' && YouTubePlusLogger
 ? YouTubePlusLogger.createLogger('Download')
 : {
 debug: () => {},
 info: () => {},
 warn: console.warn.bind(console),
 error: console.error.bind(console),
 };
 const DownloadConfig = {
 API: {
 KEY_URL: 'https://cnv.cx/v2/sanity/key',
 CONVERT_URL: 'https://cnv.cx/v2/converter',
 },
 HEADERS: {
 'Content-Type': 'application/json',
 Origin: 'https://mp3yt.is',
 Accept: '*/*',
 'User-Agent':
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
 },
 VIDEO_QUALITIES: ['144', '240', '360', '480', '720', '1080', '1440', '2160'],
 AUDIO_BITRATES: ['64', '128', '192', '256', '320'],
 DEFAULTS: {
 format: 'video',
 videoQuality: '1080',
 audioBitrate: '320',
 embedThumbnail: true,
 },
 };
 function getVideoId() {
 const params = new URLSearchParams(window.location.search);
 return params.get('v') || null;
 }
 function getVideoUrl() {
 const videoId = getVideoId();
 return videoId ? `https://www.youtube.com/watch?v=${videoId}` : window.location.href;
 }
 function getVideoTitle() {
 try {
 const titleElement =
 document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string') ||
 document.querySelector('h1.title yt-formatted-string') ||
 document.querySelector('ytd-watch-metadata h1');
 return titleElement ? titleElement.textContent.trim() : 'video';
 } catch {
 return 'video';
 }
 }
 function sanitizeFilename(filename) {
 return filename
 .replace(/[<>:"/\\|?*]/g, '')
 .replace(/\s+/g, ' ')
 .trim()
 .substring(0, 200);
 }
 function formatBytes(bytes) {
 if (bytes === 0) return '0 B';
 const k = 1024;
 const sizes = ['B', 'KB', 'MB', 'GB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
 }
 function createGmRequestOptions(options, resolve, reject) {
 return {
 ...options,
 onload: response => {
 if (options.onload) options.onload(response);
 resolve(response);
 },
 onerror: error => {
 if (options.onerror) options.onerror(error);
 reject(error);
 },
 ontimeout: () => {
 if (options.ontimeout) options.ontimeout();
 reject(new Error('Request timeout'));
 },
 };
 }
 function buildResponseObject(resp) {
 return {
 status: resp.status,
 statusText: resp.statusText,
 finalUrl: resp.url,
 headers: {},
 responseText: null,
 response: null,
 };
 }
 async function extractResponseText(resp, responseLike) {
 try {
 responseLike.responseText = await resp.text();
 } catch {
 responseLike.responseText = null;
 }
 }
 async function extractResponseBlob(resp, responseLike, responseType) {
 if (responseType === 'blob') {
 try {
 responseLike.response = await resp.blob();
 } catch {
 responseLike.response = null;
 }
 }
 }
 async function executeFetchFallback(options) {
 const fetchOpts = {
 method: options.method || 'GET',
 headers: options.headers || {},
 body: options.data || options.body || undefined,
 };
 const resp = await fetch(options.url, fetchOpts);
 const responseLike = buildResponseObject(resp);
 await extractResponseText(resp, responseLike);
 await extractResponseBlob(resp, responseLike, options.responseType);
 if (options.onload) options.onload(responseLike);
 return responseLike;
 }
 function gmXmlHttpRequest(options) {
 return new Promise((resolve, reject) => {
 if (typeof GM_xmlhttpRequest !== 'undefined') {
 GM_xmlhttpRequest(createGmRequestOptions(options, resolve, reject));
 return;
 }
 (async () => {
 try {
 const responseLike = await executeFetchFallback(options);
 resolve(responseLike);
 } catch (err) {
 if (options.onerror) options.onerror(err);
 reject(err);
 }
 })();
 });
 }
 function createSquareAlbumArt(thumbnailUrl) {
 return new Promise((resolve, reject) => {
 const img = document.createElement('img');
 img.crossOrigin = 'anonymous';
 img.onload = () => {
 const canvas = document.createElement('canvas');
 const size = Math.min(img.width, img.height);
 canvas.width = size;
 canvas.height = size;
 const ctx = canvas.getContext('2d');
 if (!ctx) {
 reject(new Error('Failed to get canvas context'));
 return;
 }
 const sx = (img.width - size) / 2;
 const sy = (img.height - size) / 2;
 ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
 canvas.toBlob(
 blob => {
 if (blob) resolve(blob);
 else reject(new Error('Failed to create blob'));
 },
 'image/jpeg',
 0.95
 );
 };
 img.onerror = () => reject(new Error('Failed to load thumbnail'));
 img.src = thumbnailUrl;
 });
 }
 async function embedAlbumArtToMP3(mp3Blob, albumArtBlob, metadata) {
 try {
 if (typeof window.ID3Writer === 'undefined') {
 logger.warn('ID3Writer not available, skipping album art embedding');
 return mp3Blob;
 }
 const arrayBuffer = await mp3Blob.arrayBuffer();
 const writer = new window.ID3Writer(arrayBuffer);
 if (metadata.title) {
 writer.setFrame('TIT2', metadata.title);
 }
 if (metadata.artist) {
 writer.setFrame('TPE1', [metadata.artist]);
 }
 if (metadata.album) {
 writer.setFrame('TALB', metadata.album);
 }
 if (albumArtBlob) {
 const coverArrayBuffer = await albumArtBlob.arrayBuffer();
 writer.setFrame('APIC', {
 type: 3,
 data: coverArrayBuffer,
 description: 'Cover',
 });
 }
 writer.addTag();
 return new Blob([writer.arrayBuffer], { type: 'audio/mpeg' });
 } catch (error) {
 logger.error('Error embedding album art:', error);
 return mp3Blob;
 }
 }
 async function fetchPlayerData(videoId) {
 const response = await gmXmlHttpRequest({
 method: 'POST',
 url: 'https://www.youtube.com/youtubei/v1/player',
 headers: {
 'Content-Type': 'application/json',
 'User-Agent': DownloadConfig.HEADERS['User-Agent'],
 },
 data: JSON.stringify({
 context: {
 client: {
 clientName: 'WEB',
 clientVersion: '2.20240304.00.00',
 },
 },
 videoId,
 }),
 });
 if (response.status !== 200) {
 throw new Error(`Failed to get player data: ${response.status}`);
 }
 return JSON.parse(response.responseText);
 }
 function buildSubtitleUrl(baseUrl) {
 if (!baseUrl.includes('fmt=')) {
 return `${baseUrl}&fmt=srv1`;
 }
 return baseUrl;
 }
 function parseCaptionTracks(captionTracks) {
 return captionTracks.map(track => ({
 name: track.name?.simpleText || track.languageCode,
 languageCode: track.languageCode,
 url: buildSubtitleUrl(track.baseUrl),
 isAutoGenerated: track.kind === 'asr',
 }));
 }
 function parseTranslationLanguages(translationLanguages, baseUrl) {
 return translationLanguages.map(lang => ({
 name: lang.languageName?.simpleText || lang.languageCode,
 languageCode: lang.languageCode,
 baseUrl: baseUrl || '',
 isAutoGenerated: true,
 }));
 }
 function createEmptySubtitleResult(videoId, videoTitle) {
 return {
 videoId,
 videoTitle,
 subtitles: [],
 autoTransSubtitles: [],
 };
 }
 async function getSubtitles(videoId) {
 try {
 const data = await fetchPlayerData(videoId);
 const videoTitle = data.videoDetails?.title || 'video';
 const captions = data.captions?.playerCaptionsTracklistRenderer;
 if (!captions) {
 return createEmptySubtitleResult(videoId, videoTitle);
 }
 const captionTracks = captions.captionTracks || [];
 const translationLanguages = captions.translationLanguages || [];
 const baseUrl = captionTracks[0]?.baseUrl || '';
 return {
 videoId,
 videoTitle,
 subtitles: parseCaptionTracks(captionTracks),
 autoTransSubtitles: parseTranslationLanguages(translationLanguages, baseUrl),
 };
 } catch (error) {
 logger.error('Error getting subtitles:', error);
 return null;
 }
 }
 function parseSubtitleXML(xml) {
 const cues = [];
 const textTagRegex = /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/gi;
 let match;
 while ((match = textTagRegex.exec(xml)) !== null) {
 const start = parseFloat(match[1] || '0');
 const duration = parseFloat(match[2] || '0');
 let text = match[3] || '';
 text = text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
 text = decodeHTMLEntities(text.trim());
 cues.push({ start, duration, text });
 }
 return cues;
 }
 function decodeHTMLEntities(text) {
 const entities = {
 '&amp;': '&',
 '&lt;': '<',
 '&gt;': '>',
 '&quot;': '"',
 '&#39;': "'",
 '&apos;': "'",
 '&nbsp;': ' ',
 };
 let decoded = text;
 for (const [entity, char] of Object.entries(entities)) {
 decoded = decoded.replace(new RegExp(entity, 'g'), char);
 }
 decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
 decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
 String.fromCharCode(parseInt(hex, 16))
 );
 return decoded;
 }
 function convertToSRT(cues) {
 let srt = '';
 cues.forEach((cue, index) => {
 const startTime = formatSRTTime(cue.start);
 const endTime = formatSRTTime(cue.start + cue.duration);
 const text = cue.text.replace(/\n/g, ' ').trim();
 srt += `${index + 1}\n`;
 srt += `${startTime} --> ${endTime}\n`;
 srt += `${text}\n\n`;
 });
 return srt;
 }
 function formatSRTTime(seconds) {
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 const secs = Math.floor(seconds % 60);
 const milliseconds = Math.floor((seconds % 1) * 1000);
 return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
 }
 function convertToTXT(cues) {
 return cues.map(cue => cue.text.trim()).join('\n');
 }
 async function downloadSubtitle(options = {}) {
 const {
 videoId,
 url: baseUrl,
 languageCode,
 languageName,
 format = 'srt',
 translateTo = null,
 } = options;
 if (!videoId || !baseUrl) {
 throw new Error('Video ID and URL are required');
 }
 const title = getVideoTitle();
 let subtitleUrl = baseUrl;
 if (!subtitleUrl.includes('fmt=')) {
 subtitleUrl += '&fmt=srv1';
 }
 if (translateTo) {
 subtitleUrl += `&tlang=${translateTo}`;
 }
 NotificationManager.show(t('subtitleDownloading'), {
 duration: 2000,
 type: 'info',
 });
 try {
 const response = await gmXmlHttpRequest({
 method: 'GET',
 url: subtitleUrl,
 headers: {
 'User-Agent': DownloadConfig.HEADERS['User-Agent'],
 Referer: 'https://www.youtube.com/',
 },
 });
 if (response.status !== 200) {
 throw new Error(`Failed to download subtitle: ${response.status}`);
 }
 const xmlText = response.responseText;
 if (!xmlText || xmlText.length === 0) {
 throw new Error('Empty subtitle response');
 }
 let content;
 let extension;
 if (format === 'xml') {
 content = xmlText;
 extension = 'xml';
 } else {
 const cues = parseSubtitleXML(xmlText);
 if (cues.length === 0) {
 throw new Error('No subtitle cues found');
 }
 if (format === 'srt') {
 content = convertToSRT(cues);
 extension = 'srt';
 } else if (format === 'txt') {
 content = convertToTXT(cues);
 extension = 'txt';
 } else {
 content = xmlText;
 extension = 'xml';
 }
 }
 const langSuffix = translateTo ? `${languageCode}-${translateTo}` : languageCode;
 const filename = sanitizeFilename(`${title} - ${languageName} (${langSuffix}).${extension}`);
 const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
 const blobUrl = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = blobUrl;
 a.download = filename;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(blobUrl);
 NotificationManager.show(t('subtitleDownloaded'), {
 duration: 3000,
 type: 'success',
 });
 logger.debug('Subtitle downloaded:', filename);
 } catch (error) {
 logger.error('Error downloading subtitle:', error);
 NotificationManager.show(`${t('subtitleDownloadFailed')} ${error.message}`, {
 duration: 5000,
 type: 'error',
 });
 throw error;
 }
 }
 async function downloadVideo(options = {}) {
 const {
 format = DownloadConfig.DEFAULTS.format,
 quality = DownloadConfig.DEFAULTS.videoQuality,
 audioBitrate = DownloadConfig.DEFAULTS.audioBitrate,
 embedThumbnail = DownloadConfig.DEFAULTS.embedThumbnail,
 onProgress = null,
 } = options;
 const videoId = getVideoId();
 if (!videoId) {
 throw new Error('Video ID not found');
 }
 const videoUrl = getVideoUrl();
 const title = getVideoTitle();
 NotificationManager.show(t('startingDownload'), {
 duration: 2000,
 type: 'info',
 });
 try {
 logger.debug('Fetching API key...');
 const keyResponse = await gmXmlHttpRequest({
 method: 'GET',
 url: DownloadConfig.API.KEY_URL,
 headers: DownloadConfig.HEADERS,
 });
 if (keyResponse.status !== 200) {
 throw new Error(`Failed to get API key: ${keyResponse.status}`);
 }
 const keyData = JSON.parse(keyResponse.responseText);
 if (!keyData || !keyData.key) {
 throw new Error('API key not found in response');
 }
 const { key } = keyData;
 logger.debug('API key obtained');
 let payload;
 if (format === 'video') {
 const codec = parseInt(quality, 10) > 1080 ? 'vp9' : 'h264';
 payload = {
 link: videoUrl,
 format: 'mp4',
 audioBitrate: '128',
 videoQuality: quality,
 filenameStyle: 'pretty',
 vCodec: codec,
 };
 } else {
 payload = {
 link: videoUrl,
 format: 'mp3',
 audioBitrate,
 filenameStyle: 'pretty',
 };
 }
 logger.debug('Requesting conversion...', payload);
 const customHeaders = {
 ...DownloadConfig.HEADERS,
 key,
 };
 const downloadResponse = await gmXmlHttpRequest({
 method: 'POST',
 url: DownloadConfig.API.CONVERT_URL,
 headers: customHeaders,
 data: JSON.stringify(payload),
 });
 if (downloadResponse.status !== 200) {
 throw new Error(`Conversion failed: ${downloadResponse.status}`);
 }
 const apiDownloadInfo = JSON.parse(downloadResponse.responseText);
 logger.debug('Conversion response:', apiDownloadInfo);
 if (!apiDownloadInfo.url) {
 throw new Error('No download URL received from API');
 }
 logger.debug('Downloading file from:', apiDownloadInfo.url);
 return new Promise((resolve, reject) => {
 if (typeof GM_xmlhttpRequest === 'undefined') {
 logger.warn('GM_xmlhttpRequest not available, opening in new tab');
 window.open(apiDownloadInfo.url, '_blank');
 resolve();
 return;
 }
 GM_xmlhttpRequest({
 method: 'GET',
 url: apiDownloadInfo.url,
 responseType: 'blob',
 headers: {
 'User-Agent': DownloadConfig.HEADERS['User-Agent'],
 Referer: 'https://mp3yt.is/',
 Accept: '*/*',
 },
 onprogress: progress => {
 if (onProgress) {
 onProgress({
 loaded: progress.loaded,
 total: progress.total,
 percent: progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0,
 });
 }
 },
 onload: async response => {
 if (response.status === 200 && response.response) {
 let blob = response.response;
 if (blob.size === 0) {
 reject(new Error(t('zeroBytesError')));
 return;
 }
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(`[Download] File downloaded: ${formatBytes(blob.size)}`);
 if (format === 'audio' && embedThumbnail) {
 try {
 logger.debug('Embedding album art...');
 const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
 const albumArt = await createSquareAlbumArt(thumbnailUrl);
 blob = await embedAlbumArtToMP3(blob, albumArt, { title });
 logger.debug('Album art embedded successfully');
 } catch (error) {
 logger.error('Failed to embed album art:', error);
 }
 }
 const blobUrl = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = blobUrl;
 const filename =
 apiDownloadInfo.filename || `${title}.${format === 'video' ? 'mp4' : 'mp3'}`;
 a.download = sanitizeFilename(filename);
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
 NotificationManager.show(t('downloadCompleted'), {
 duration: 3000,
 type: 'success',
 });
 logger.debug('Download completed:', filename);
 resolve();
 } else {
 reject(new Error(`Download failed: ${response.status}`));
 }
 },
 onerror: () => reject(new Error('Download failed - network error')),
 ontimeout: () => reject(new Error('Download timeout')),
 });
 });
 } catch (error) {
 logger.error('Error:', error);
 NotificationManager.show(`${t('downloadFailed')} ${error.message}`, {
 duration: 5000,
 type: 'error',
 });
 throw error;
 }
 }
 let _modalElements = null;
 function createTabButtons(onTabChange) {
 const tabContainer = document.createElement('div');
 Object.assign(tabContainer.style, {
 display: 'flex',
 gap: '8px',
 padding: '12px',
 justifyContent: 'center',
 alignItems: 'center',
 background: 'transparent',
 });
 const videoTab = document.createElement('button');
 videoTab.textContent = t('videoTab');
 videoTab.dataset.format = 'video';
 const audioTab = document.createElement('button');
 audioTab.textContent = t('audioTab');
 audioTab.dataset.format = 'audio';
 const subTab = document.createElement('button');
 subTab.textContent = t('subtitleTab');
 subTab.dataset.format = 'subtitle';
 [videoTab, audioTab, subTab].forEach(btn => {
 Object.assign(btn.style, {
 flex: 'initial',
 padding: '8px 18px',
 border: '1px solid rgba(255,255,255,0.06)',
 background: 'transparent',
 cursor: 'pointer',
 fontSize: '13px',
 fontWeight: '600',
 transition: 'all 0.18s ease',
 color: '#666',
 borderRadius: '999px',
 });
 btn.type = 'button';
 btn.style.outline = 'none';
 btn.style.userSelect = 'none';
 btn.setAttribute('aria-pressed', 'false');
 });
 function setActive(btn) {
 [videoTab, audioTab, subTab].forEach(b => {
 b.style.background = 'transparent';
 b.style.color = '#666';
 b.style.border = '1px solid rgba(255,255,255,0.06)';
 b.style.boxShadow = 'none';
 b.setAttribute('aria-pressed', 'false');
 });
 Object.assign(btn.style, {
 background: '#10c56a',
 color: '#fff',
 border: '1px solid rgba(0,0,0,0.06)',
 boxShadow: '0 1px 0 rgba(0,0,0,0.04) inset',
 });
 btn.setAttribute('aria-pressed', 'true');
 try {
 onTabChange(btn.dataset.format);
 } catch {
 }
 }
 [videoTab, audioTab, subTab].forEach(btn => {
 btn.addEventListener('click', () => {
 setActive(btn);
 try {
 btn.blur();
 } catch {
 }
 });
 });
 tabContainer.appendChild(videoTab);
 tabContainer.appendChild(audioTab);
 tabContainer.appendChild(subTab);
 setTimeout(() => setActive(videoTab), 0);
 return tabContainer;
 }
 function buildModalForm() {
 const qualitySelect = document.createElement('div');
 qualitySelect.role = 'radiogroup';
 qualitySelect.value = DownloadConfig.DEFAULTS.videoQuality;
 Object.assign(qualitySelect.style, {
 display: 'flex',
 flexWrap: 'wrap',
 gap: '10px',
 padding: '12px 6px',
 borderRadius: '10px',
 width: '100%',
 alignItems: 'center',
 justifyContent: 'center',
 background: 'transparent',
 });
 const embedCheckbox = document.createElement('input');
 embedCheckbox.type = 'checkbox';
 embedCheckbox.checked = DownloadConfig.DEFAULTS.embedThumbnail;
 const embedLabel = document.createElement('label');
 embedLabel.style.fontSize = '13px';
 embedLabel.style.display = 'flex';
 embedLabel.style.alignItems = 'center';
 embedLabel.style.gap = '6px';
 embedLabel.style.color = '#fff';
 embedLabel.style.display = 'none';
 embedLabel.appendChild(embedCheckbox);
 embedLabel.appendChild(document.createTextNode(t('embedThumbnail')));
 const subtitleWrapper = document.createElement('div');
 subtitleWrapper.style.display = 'none';
 const subtitleSelect = createSubtitleSelect();
 const formatSelect = document.createElement('div');
 formatSelect.role = 'radiogroup';
 formatSelect.value = 'srt';
 Object.assign(formatSelect.style, {
 display: 'flex',
 gap: '8px',
 padding: '6px 0',
 borderRadius: '6px',
 width: '100%',
 alignItems: 'center',
 justifyContent: 'center',
 background: 'transparent',
 });
 ['srt', 'txt', 'xml'].forEach(fmt => {
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.dataset.value = fmt;
 btn.textContent = fmt.toUpperCase();
 Object.assign(btn.style, {
 padding: '6px 12px',
 borderRadius: '999px',
 border: '1px solid rgba(255,255,255,0.08)',
 background: 'rgba(255,255,255,0.02)',
 color: '#fff',
 cursor: 'pointer',
 fontSize: '13px',
 fontWeight: '600',
 });
 btn.addEventListener('click', () => {
 Array.from(formatSelect.children).forEach(c => {
 c.style.background = 'transparent';
 c.style.color = '#fff';
 c.style.border = '1px solid rgba(255,255,255,0.08)';
 });
 btn.style.background = '#111';
 btn.style.color = '#10c56a';
 btn.style.border = '1px solid rgba(16,197,106,0.15)';
 formatSelect.value = fmt;
 });
 formatSelect.appendChild(btn);
 });
 const _defaultFmtBtn = Array.from(formatSelect.children).find(
 c => c.dataset.value === formatSelect.value
 );
 if (_defaultFmtBtn) _defaultFmtBtn.click();
 subtitleWrapper.appendChild(subtitleSelect);
 subtitleWrapper.appendChild(formatSelect);
 const cancelBtn = document.createElement('button');
 cancelBtn.textContent = t('cancel');
 Object.assign(cancelBtn.style, {
 padding: '8px 16px',
 borderRadius: '8px',
 border: '1px solid rgba(255,255,255,0.12)',
 background: 'transparent',
 cursor: 'pointer',
 fontSize: '14px',
 color: '#fff',
 });
 const downloadBtn = document.createElement('button');
 downloadBtn.textContent = t('download');
 Object.assign(downloadBtn.style, {
 padding: '8px 20px',
 borderRadius: '8px',
 border: '1px solid rgba(255,255,255,0.12)',
 background: 'transparent',
 color: '#fff',
 cursor: 'pointer',
 fontSize: '14px',
 fontWeight: '600',
 });
 const progressWrapper = document.createElement('div');
 progressWrapper.style.display = 'none';
 progressWrapper.style.marginTop = '12px';
 const progressBar = document.createElement('div');
 Object.assign(progressBar.style, {
 width: '100%',
 height: '3px',
 background: '#e0e0e0',
 borderRadius: '5px',
 overflow: 'hidden',
 marginBottom: '6px',
 });
 const progressFill = document.createElement('div');
 Object.assign(progressFill.style, {
 width: '0%',
 height: '100%',
 background: '#1a73e8',
 transition: 'width 200ms linear',
 });
 progressBar.appendChild(progressFill);
 const progressText = document.createElement('div');
 progressText.style.fontSize = '12px';
 progressText.style.color = '#666';
 progressWrapper.appendChild(progressBar);
 progressWrapper.appendChild(progressText);
 return {
 qualitySelect,
 embedLabel,
 subtitleWrapper,
 subtitleSelect,
 formatSelect,
 cancelBtn,
 downloadBtn,
 progressWrapper,
 progressFill,
 progressText,
 };
 }
 function disableFormControls(formParts) {
 formParts.qualitySelect.disabled = true;
 formParts.downloadBtn.disabled = true;
 formParts.cancelBtn.disabled = true;
 }
 function enableFormControls(formParts) {
 formParts.qualitySelect.disabled = false;
 formParts.downloadBtn.disabled = false;
 formParts.cancelBtn.disabled = false;
 }
 function initializeProgress(formParts) {
 formParts.progressWrapper.style.display = '';
 formParts.progressFill.style.width = '0%';
 formParts.progressText.textContent = t('starting');
 }
 async function handleSubtitleDownload(formParts, getSubtitlesData) {
 const subtitlesData = getSubtitlesData();
 const selectedIndex = parseInt(formParts.subtitleSelect.value, 10);
 const subtitle = subtitlesData.all[selectedIndex];
 const subtitleFormat = formParts.formatSelect.value;
 if (!subtitle) {
 throw new Error(t('noSubtitleSelected'));
 }
 const videoId = getVideoId();
 await downloadSubtitle({
 videoId,
 url: subtitle.url,
 languageCode: subtitle.languageCode,
 languageName: subtitle.name,
 format: subtitleFormat,
 translateTo: subtitle.translateTo || null,
 });
 }
 async function handleMediaDownload(formParts, format) {
 const opts = {
 format,
 quality: formParts.qualitySelect.value,
 audioBitrate: formParts.qualitySelect.value,
 embedThumbnail: format === 'audio',
 onProgress: p => {
 formParts.progressFill.style.width = `${p.percent || 0}%`;
 formParts.progressText.textContent = `${p.percent || 0}% � ${formatBytes(p.loaded || 0)} / ${p.total ? formatBytes(p.total) : '�'}`;
 },
 };
 await downloadVideo(opts);
 }
 function completeDownload(formParts) {
 formParts.progressText.textContent = t('completed');
 setTimeout(() => closeModal(), 800);
 }
 function handleDownloadError(formParts, err) {
 formParts.progressText.textContent = `${t('downloadFailed')} ${err?.message || 'error'}`;
 enableFormControls(formParts);
 }
 function wireModalEvents(formParts, activeFormatGetter, getSubtitlesData) {
 formParts.cancelBtn.addEventListener('click', () => closeModal());
 formParts.downloadBtn.addEventListener('click', async () => {
 disableFormControls(formParts);
 initializeProgress(formParts);
 const format = activeFormatGetter();
 try {
 if (format === 'subtitle') {
 await handleSubtitleDownload(formParts, getSubtitlesData);
 } else {
 await handleMediaDownload(formParts, format);
 }
 completeDownload(formParts);
 } catch (err) {
 handleDownloadError(formParts, err);
 }
 });
 }
 async function loadSubtitlesForForm(formParts, subtitlesData) {
 const videoId = getVideoId();
 if (!videoId) return;
 formParts.subtitleSelect.setPlaceholder(t('loading'));
 formParts.subtitleSelect.disabled = true;
 try {
 const data = await getSubtitles(videoId);
 if (!data) {
 formParts.subtitleSelect.setPlaceholder(t('noSubtitles'));
 return;
 }
 subtitlesData.original = data.subtitles;
 subtitlesData.translated = data.autoTransSubtitles.map(autot => ({
 ...autot,
 url: data.subtitles[0]?.url || '',
 translateTo: autot.languageCode,
 }));
 subtitlesData.all = [...subtitlesData.original, ...subtitlesData.translated];
 if (subtitlesData.all.length === 0) {
 formParts.subtitleSelect.setPlaceholder(t('noSubtitles'));
 return;
 }
 const opts = subtitlesData.all.map((sub, idx) => ({
 value: idx,
 text: sub.name + (sub.translateTo ? t('autoTranslateSuffix') : ''),
 }));
 formParts.subtitleSelect.setOptions(opts);
 formParts.subtitleSelect.disabled = false;
 } catch (err) {
 logger.error('Failed to load subtitles:', err);
 formParts.subtitleSelect.setPlaceholder(t('subtitleLoadError'));
 }
 }
 function updateQualityOptionsForForm(formParts, activeFormat, subtitlesData) {
 if (activeFormat === 'subtitle') {
 formParts.qualitySelect.style.display = 'none';
 formParts.embedLabel.style.display = 'none';
 formParts.subtitleWrapper.style.display = 'block';
 loadSubtitlesForForm(formParts, subtitlesData);
 return;
 }
 if (activeFormat === 'video') {
 formParts.qualitySelect.style.display = 'flex';
 formParts.embedLabel.style.display = 'none';
 formParts.subtitleWrapper.style.display = 'none';
 formParts.qualitySelect.innerHTML = '';
 const lowQuals = DownloadConfig.VIDEO_QUALITIES.filter(q => parseInt(q, 10) <= 1080);
 const highQuals = DownloadConfig.VIDEO_QUALITIES.filter(q => parseInt(q, 10) > 1080);
 function makeQualityButton(q) {
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.dataset.value = q;
 btn.textContent = `${q}p`;
 Object.assign(btn.style, {
 display: 'inline-flex',
 alignItems: 'center',
 gap: '8px',
 padding: '8px 12px',
 borderRadius: '999px',
 border: '1px solid rgba(255,255,255,0.08)',
 background: 'rgba(255,255,255,0.02)',
 color: '#fff',
 cursor: 'pointer',
 fontSize: '13px',
 fontWeight: '600',
 });
 btn.addEventListener('click', () => {
 Array.from(formParts.qualitySelect.children).forEach(c => {
 if (c.dataset && c.dataset.value) {
 c.style.background = 'transparent';
 c.style.color = '#fff';
 c.style.border = '1px solid rgba(255,255,255,0.08)';
 }
 });
 btn.style.background = '#111';
 btn.style.color = '#10c56a';
 btn.style.border = '1px solid rgba(16,197,106,0.15)';
 formParts.qualitySelect.value = q;
 });
 return btn;
 }
 lowQuals.forEach(q => formParts.qualitySelect.appendChild(makeQualityButton(q)));
 if (highQuals.length > 0) {
 const labelWrap = document.createElement('div');
 Object.assign(labelWrap.style, {
 display: 'flex',
 alignItems: 'center',
 gap: '12px',
 width: '100%',
 margin: '8px 0',
 });
 const lineLeft = document.createElement('div');
 lineLeft.style.flex = '1';
 lineLeft.style.borderTop = '1px solid rgba(255,255,255,0.06)';
 const label = document.createElement('div');
 label.textContent = t('vp9Label');
 Object.assign(label.style, {
 fontSize: '12px',
 color: 'rgba(255,255,255,0.7)',
 padding: '0 8px',
 });
 const lineRight = document.createElement('div');
 lineRight.style.flex = '1';
 lineRight.style.borderTop = '1px solid rgba(255,255,255,0.06)';
 labelWrap.appendChild(lineLeft);
 labelWrap.appendChild(label);
 labelWrap.appendChild(lineRight);
 formParts.qualitySelect.appendChild(labelWrap);
 highQuals.forEach(q => formParts.qualitySelect.appendChild(makeQualityButton(q)));
 }
 formParts.qualitySelect.value = DownloadConfig.DEFAULTS.videoQuality;
 const defaultBtn = Array.from(formParts.qualitySelect.children).find(
 c => c.dataset && c.dataset.value === formParts.qualitySelect.value
 );
 if (defaultBtn) defaultBtn.click();
 return;
 }
 formParts.qualitySelect.style.display = 'flex';
 formParts.embedLabel.style.display = 'flex';
 formParts.subtitleWrapper.style.display = 'none';
 formParts.qualitySelect.innerHTML = '';
 DownloadConfig.AUDIO_BITRATES.forEach(b => {
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.dataset.value = b;
 btn.textContent = `${b} kbps`;
 Object.assign(btn.style, {
 display: 'inline-flex',
 alignItems: 'center',
 gap: '8px',
 padding: '8px 12px',
 borderRadius: '999px',
 border: '1px solid rgba(255,255,255,0.08)',
 background: 'rgba(255,255,255,0.02)',
 color: '#fff',
 cursor: 'pointer',
 fontSize: '13px',
 fontWeight: '600',
 });
 btn.addEventListener('click', () => {
 Array.from(formParts.qualitySelect.children).forEach(c => {
 c.style.background = 'transparent';
 c.style.color = '#fff';
 c.style.border = '1px solid rgba(255,255,255,0.08)';
 });
 btn.style.background = '#111';
 btn.style.color = '#10c56a';
 btn.style.border = '1px solid rgba(16,197,106,0.15)';
 formParts.qualitySelect.value = b;
 });
 formParts.qualitySelect.appendChild(btn);
 });
 formParts.qualitySelect.value = DownloadConfig.DEFAULTS.audioBitrate;
 const defaultAudioBtn = Array.from(formParts.qualitySelect.children).find(
 c => c.dataset.value === formParts.qualitySelect.value
 );
 if (defaultAudioBtn) defaultAudioBtn.click();
 formParts.embedLabel.style.display = 'none';
 }
 function createModalUI() {
 if (_modalElements) return _modalElements;
 let activeFormat = 'video';
 const subtitlesData = { all: [], original: [], translated: [] };
 const overlay = document.createElement('div');
 Object.assign(overlay.style, {
 position: 'fixed',
 inset: '0',
 background: 'rgba(0,0,0,0.6)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: '999999',
 });
 const box = document.createElement('div');
 Object.assign(box.style, {
 width: '420px',
 maxWidth: '94%',
 background: 'rgba(20,20,20,0.64)',
 color: '#fff',
 borderRadius: '12px',
 boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
 fontFamily: 'Arial, sans-serif',
 border: '1px solid rgba(255,255,255,0.06)',
 backdropFilter: 'blur(8px)',
 });
 const formParts = buildModalForm();
 const tabContainer = createTabButtons(format => {
 activeFormat = format;
 updateQualityOptionsForForm(formParts, activeFormat, subtitlesData);
 });
 const content = document.createElement('div');
 content.style.padding = '16px';
 content.appendChild(formParts.qualitySelect);
 content.appendChild(formParts.embedLabel);
 content.appendChild(formParts.subtitleWrapper);
 content.appendChild(formParts.progressWrapper);
 const btnRow = document.createElement('div');
 Object.assign(btnRow.style, {
 display: 'flex',
 gap: '8px',
 padding: '16px',
 justifyContent: 'center',
 });
 btnRow.appendChild(formParts.cancelBtn);
 btnRow.appendChild(formParts.downloadBtn);
 box.appendChild(tabContainer);
 box.appendChild(content);
 box.appendChild(btnRow);
 overlay.appendChild(box);
 updateQualityOptionsForForm(formParts, activeFormat, subtitlesData);
 wireModalEvents(
 formParts,
 () => activeFormat,
 () => subtitlesData
 );
 _modalElements = { overlay, box, ...formParts };
 return _modalElements;
 }
 function openModal() {
 const els = createModalUI();
 if (!els) return;
 try {
 if (!document.body.contains(els.overlay)) document.body.appendChild(els.overlay);
 } catch {
 }
 }
 function closeModal() {
 if (!_modalElements) return;
 try {
 if (_modalElements.overlay && _modalElements.overlay.parentNode) {
 _modalElements.overlay.parentNode.removeChild(_modalElements.overlay);
 }
 } catch {
 }
 _modalElements = null;
 }
 const waitForDownloadAPI = timeout =>
 new Promise(resolve => {
 const interval = 200;
 let waited = 0;
 if (typeof window.YouTubePlusDownload !== 'undefined') {
 return resolve(window.YouTubePlusDownload);
 }
 const id = setInterval(() => {
 waited += interval;
 if (typeof window.YouTubePlusDownload !== 'undefined') {
 clearInterval(id);
 return resolve(window.YouTubePlusDownload);
 }
 if (waited >= timeout) {
 clearInterval(id);
 return resolve(undefined);
 }
 }, interval);
 });
 const fallbackCopyToClipboard = (text, tFn, notificationMgr) => {
 const input = document.createElement('input');
 input.value = text;
 document.body.appendChild(input);
 input.select();
 document.execCommand('copy');
 document.body.removeChild(input);
 notificationMgr.show(tFn('copiedToClipboard'), {
 duration: 2000,
 type: 'success',
 });
 };
 const buildUrl = (template, videoId, videoUrl) =>
 (template || '')
 .replace('{videoId}', videoId || '')
 .replace('{videoUrl}', encodeURIComponent(videoUrl || ''));
 const createButtonElement = tFn => {
 const button = document.createElement('div');
 button.className = 'ytp-button ytp-download-button';
 button.setAttribute('title', tFn('downloadOptions'));
 button.setAttribute('tabindex', '0');
 button.setAttribute('role', 'button');
 button.setAttribute('aria-haspopup', 'true');
 button.setAttribute('aria-expanded', 'false');
 button.innerHTML = `
 <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto;vertical-align:middle;">
 <path d="M83.17188,112.83984a4.00026,4.00026,0,0,1,5.65624-5.6582L124,142.34473V40a4,4,0,0,1,8,0V142.34473l35.17188-35.16309a4.00026,4.00026,0,0,1,5.65624,5.6582l-42,41.98926a4.00088,4.00088,0,0,1-5.65624,0ZM216,148a4.0002,4.0002,0,0,0-4,4v56a4.00427,4.00427,0,0,1-4,4H48a4.00427,4.00427,0,0,1-4-4V152a4,4,0,0,0-8,0v56a12.01343,12.01343,0,0,0,12,12H208a12.01343,12.01343,0,0,0,12-12V152A4.0002,4.0002,0,0,0,216,148Z"/>
 </svg>
 `;
 return button;
 };
 const positionDropdown = (button, dropdown) => {
 const rect = button.getBoundingClientRect();
 const left = Math.max(8, rect.left + rect.width / 2 - 75);
 const bottom = Math.max(8, window.innerHeight - rect.top + 12);
 dropdown.style.left = `${left}px`;
 dropdown.style.bottom = `${bottom}px`;
 };
 const createDownloadActions = (tFn, ytUtils) => {
 const handleDirectDownload = async () => {
 const api = await waitForDownloadAPI(2000);
 if (!api) {
 console.error('[YouTube+] Direct download module not loaded');
 ytUtils.NotificationManager.show(tFn('directDownloadModuleNotAvailable'), {
 duration: 3000,
 type: 'error',
 });
 return;
 }
 try {
 if (typeof api.openModal === 'function') {
 api.openModal();
 return;
 }
 if (typeof api.downloadVideo === 'function') {
 await api.downloadVideo({ format: 'video', quality: '1080' });
 return;
 }
 } catch (err) {
 console.error('[YouTube+] Direct download invocation failed:', err);
 }
 ytUtils.NotificationManager.show(tFn('directDownloadModuleNotAvailable'), {
 duration: 3000,
 type: 'error',
 });
 };
 const handleYTDLDownload = url => {
 const videoId = new URLSearchParams(location.search).get('v');
 const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : location.href;
 navigator.clipboard
 .writeText(videoUrl)
 .then(() => {
 ytUtils.NotificationManager.show(tFn('copiedToClipboard'), {
 duration: 2000,
 type: 'success',
 });
 })
 .catch(() => {
 fallbackCopyToClipboard(videoUrl, tFn, ytUtils.NotificationManager);
 });
 window.open(url, '_blank');
 };
 const openDownloadSite = (url, isYTDL, isDirect, dropdown, button) => {
 dropdown.classList.remove('visible');
 button.setAttribute('aria-expanded', 'false');
 if (isDirect) {
 handleDirectDownload();
 return;
 }
 if (isYTDL) {
 handleYTDLDownload(url);
 return;
 }
 window.open(url, '_blank');
 };
 return { handleDirectDownload, handleYTDLDownload, openDownloadSite };
 };
 const createDownloadSitesBuilder = tFn => {
 return (customization, enabledSites, videoId, videoUrl) => {
 const baseSites = [
 {
 key: 'y2mate',
 name: customization?.y2mate?.name || 'Y2Mate',
 url: buildUrl(
 customization?.y2mate?.url || `https://www.y2mate.com/youtube/{videoId}`,
 videoId,
 videoUrl
 ),
 isYTDL: false,
 isDirect: false,
 },
 {
 key: 'ytdl',
 name: 'by YTDL',
 url: `http://localhost:5005`,
 isYTDL: true,
 isDirect: false,
 },
 {
 key: 'direct',
 name: tFn('directDownload'),
 url: '#',
 isYTDL: false,
 isDirect: true,
 },
 ];
 const downloadSites = baseSites.filter(s => enabledSites[s.key] !== false);
 return { baseSites, downloadSites };
 };
 };
 const createDropdownOptions = (downloadSites, button, openDownloadSiteFn) => {
 const options = document.createElement('div');
 options.className = 'download-options';
 options.setAttribute('role', 'menu');
 const list = document.createElement('div');
 list.className = 'download-options-list';
 downloadSites.forEach(site => {
 const opt = document.createElement('div');
 opt.className = 'download-option-item';
 opt.textContent = site.name;
 opt.setAttribute('role', 'menuitem');
 opt.setAttribute('tabindex', '0');
 opt.addEventListener('click', () =>
 openDownloadSiteFn(site.url, site.isYTDL, site.isDirect, options, button)
 );
 opt.addEventListener('keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 openDownloadSiteFn(site.url, site.isYTDL, site.isDirect, options, button);
 }
 });
 list.appendChild(opt);
 });
 options.appendChild(list);
 return options;
 };
 const setupDropdownHoverBehavior = (button, dropdown) => {
 let downloadHideTimer;
 const showDropdown = () => {
 clearTimeout(downloadHideTimer);
 positionDropdown(button, dropdown);
 dropdown.classList.add('visible');
 button.setAttribute('aria-expanded', 'true');
 };
 const hideDropdown = () => {
 clearTimeout(downloadHideTimer);
 downloadHideTimer = setTimeout(() => {
 dropdown.classList.remove('visible');
 button.setAttribute('aria-expanded', 'false');
 }, 180);
 };
 button.addEventListener('mouseenter', () => {
 clearTimeout(downloadHideTimer);
 showDropdown();
 });
 button.addEventListener('mouseleave', () => {
 clearTimeout(downloadHideTimer);
 downloadHideTimer = setTimeout(hideDropdown, 180);
 });
 dropdown.addEventListener('mouseenter', () => {
 clearTimeout(downloadHideTimer);
 showDropdown();
 });
 dropdown.addEventListener('mouseleave', () => {
 clearTimeout(downloadHideTimer);
 downloadHideTimer = setTimeout(hideDropdown, 180);
 });
 button.addEventListener('keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 if (dropdown.classList.contains('visible')) {
 hideDropdown();
 } else {
 showDropdown();
 }
 }
 });
 };
 const createDownloadButtonManager = config => {
 const { settings, t: tFn, getElement, YouTubeUtils: ytUtils } = config;
 const actions = createDownloadActions(tFn, ytUtils);
 const buildDownloadSites = createDownloadSitesBuilder(tFn);
 const addDownloadButton = controls => {
 if (!settings.enableDownload) return;
 try {
 const existingBtn = controls.querySelector('.ytp-download-button');
 if (existingBtn) existingBtn.remove();
 } catch {
 }
 const videoId = new URLSearchParams(location.search).get('v');
 const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : location.href;
 const customization = settings.downloadSiteCustomization || {
 y2mate: { name: 'Y2Mate', url: 'https://www.y2mate.com/youtube/{videoId}' },
 };
 const enabledSites = settings.downloadSites || { y2mate: true, ytdl: true, direct: true };
 const { downloadSites } = buildDownloadSites(customization, enabledSites, videoId, videoUrl);
 const button = createButtonElement(tFn);
 if (downloadSites.length === 1) {
 const singleSite = downloadSites[0];
 button.style.cursor = 'pointer';
 const tempDropdown = document.createElement('div');
 button.addEventListener('click', () =>
 actions.openDownloadSite(
 singleSite.url,
 singleSite.isYTDL,
 singleSite.isDirect,
 tempDropdown,
 button
 )
 );
 controls.insertBefore(button, controls.firstChild);
 return;
 }
 const dropdown = createDropdownOptions(downloadSites, button, actions.openDownloadSite);
 const existingDownload = document.querySelector('.download-options');
 if (existingDownload) existingDownload.remove();
 try {
 document.body.appendChild(dropdown);
 } catch {
 button.appendChild(dropdown);
 }
 setupDropdownHoverBehavior(button, dropdown);
 try {
 if (typeof window !== 'undefined') {
 window.youtubePlus = window.youtubePlus || {};
 window.youtubePlus.downloadButtonManager = window.youtubePlus.downloadButtonManager || {};
 window.youtubePlus.downloadButtonManager.addDownloadButton = controlsArg =>
 addDownloadButton(controlsArg);
 window.youtubePlus.downloadButtonManager.refreshDownloadButton = () => {
 try {
 const btn = document.querySelector('.ytp-download-button');
 const dd = document.querySelector('.download-options');
 if (settings.enableDownload && (!btn || !dd)) {
 try {
 const controlsEl = document.querySelector('.ytp-right-controls');
 if (controlsEl) {
 addDownloadButton(controlsEl);
 }
 } catch {
 }
 }
 if (settings.enableDownload) {
 if (btn) btn.style.display = '';
 if (dd) dd.style.display = '';
 } else {
 if (btn) btn.style.display = 'none';
 if (dd) dd.style.display = 'none';
 }
 } catch {
 }
 };
 window.youtubePlus.rebuildDownloadDropdown = () => {
 try {
 const controlsEl = document.querySelector('.ytp-right-controls');
 if (!controlsEl) return;
 window.youtubePlus.downloadButtonManager.addDownloadButton(controlsEl);
 window.youtubePlus.settings = window.youtubePlus.settings || settings;
 } catch (e) {
 console.warn('[YouTube+] rebuildDownloadDropdown failed:', e);
 }
 };
 }
 } catch (e) {
 console.warn('[YouTube+] expose rebuildDownloadDropdown failed:', e);
 }
 controls.insertBefore(button, controls.firstChild);
 };
 const refreshDownloadButton = () => {
 const button = getElement('.ytp-download-button');
 let dropdown = document.querySelector('.download-options');
 if (settings.enableDownload && (!button || !dropdown)) {
 try {
 const controlsEl = document.querySelector('.ytp-right-controls');
 if (controlsEl) {
 addDownloadButton(controlsEl);
 dropdown = document.querySelector('.download-options');
 }
 } catch (e) {
 logger && logger.warn && logger.warn('[YouTube+] recreate download button failed:', e);
 }
 }
 if (settings.enableDownload) {
 if (button) button.style.display = '';
 if (dropdown) dropdown.style.display = '';
 } else {
 if (button) button.style.display = 'none';
 if (dropdown) dropdown.style.display = 'none';
 }
 };
 return {
 addDownloadButton,
 refreshDownloadButton,
 };
 };
 function init() {
 try {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+ Download] Unified module loaded');
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(
 '[YouTube+ Download] Use window.YouTubePlusDownload.downloadVideo() to download'
 );
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+ Download] Button manager available');
 } catch {}
 }
 if (typeof window !== 'undefined') {
 window.YouTubePlusDownload = {
 downloadVideo,
 getSubtitles,
 downloadSubtitle,
 getVideoId,
 getVideoUrl,
 getVideoTitle,
 sanitizeFilename,
 formatBytes,
 DownloadConfig,
 openModal,
 init,
 };
 window.YouTubePlusDownloadButton = { createDownloadButtonManager };
 }
 if (typeof window !== 'undefined') {
 window.YouTubeDownload = {
 init,
 openModal,
 getVideoId,
 getVideoTitle,
 version: '3.0',
 };
 }
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
})();
const _getDOMCache = () => typeof window !== 'undefined' && window.YouTubeDOMCache;
const $ = (sel, ctx) =>
 _getDOMCache()?.querySelector(sel, ctx) || (ctx || document).querySelector(sel);
const $$ = (sel, ctx) =>
 _getDOMCache()?.querySelectorAll(sel, ctx) || Array.from((ctx || document).querySelectorAll(sel));
const byId = id => _getDOMCache()?.getElementById(id) || document.getElementById(id);
(function () {
 'use strict';
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const _getLanguage = () => {
 try {
 if (_globalI18n && typeof _globalI18n.getLanguage === 'function') {
 return _globalI18n.getLanguage();
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.getLanguage === 'function'
 ) {
 return window.YouTubeUtils.getLanguage();
 }
 } catch {
 }
 const htmlLang = document.documentElement.lang || 'en';
 return htmlLang.startsWith('ru') ? 'ru' : 'en';
 };
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const config = {
 enabled: true,
 storageKey: 'youtube_top_button_settings',
 };
 const addStyles = () => {
 if (byId('custom-styles')) return;
 const style = document.createElement('style');
 style.id = 'custom-styles';
 style.textContent = `
 :root{--scrollbar-width:8px;--scrollbar-track:transparent;--scrollbar-thumb:rgba(144,144,144,.5);--scrollbar-thumb-hover:rgba(170,170,170,.7);--scrollbar-thumb-active:rgba(190,190,190,.9);}
 ::-webkit-scrollbar{width:var(--scrollbar-width)!important;height:var(--scrollbar-width)!important;}
 ::-webkit-scrollbar-track{background:var(--scrollbar-track)!important;border-radius:4px!important;}
 ::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb)!important;border-radius:4px!important;transition:background .2s!important;}
 ::-webkit-scrollbar-thumb:hover{background:var(--scrollbar-thumb-hover)!important;}
 ::-webkit-scrollbar-thumb:active{background:var(--scrollbar-thumb-active)!important;}
 ::-webkit-scrollbar-corner{background:transparent!important;}
 *{scrollbar-width:thin;scrollbar-color:var(--scrollbar-thumb) var(--scrollbar-track);}
 html[dark]{--scrollbar-thumb:rgba(144,144,144,.4);--scrollbar-thumb-hover:rgba(170,170,170,.6);--scrollbar-thumb-active:rgba(190,190,190,.8);}
 .top-button{position:fixed;bottom:16px;right:16px;width:40px;height:40px;background:var(--yt-top-btn-bg,rgba(0,0,0,.7));color:var(--yt-top-btn-color,#fff);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2100;opacity:0;visibility:hidden;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);backdrop-filter:blur(12px) saturate(180%);-webkit-backdrop-filter:blur(12px) saturate(180%);border:1px solid var(--yt-top-btn-border,rgba(255,255,255,.1));background:rgba(255,255,255,.12);box-shadow:0 8px 32px 0 rgba(31,38,135,.18);}
 .top-button:hover{background:var(--yt-top-btn-hover,rgba(0,0,0,.15));transform:translateY(-2px) scale(1.07);box-shadow:0 8px 32px rgba(0,0,0,.25);}
 .top-button:active{transform:translateY(-1px) scale(1.03);}
 .top-button:focus{outline:2px solid rgba(255,255,255,0.5);outline-offset:2px;}
 .top-button.visible{opacity:1;visibility:visible;}
 .top-button svg{transition:transform .2s ease;}
 .top-button:hover svg{transform:translateY(-1px) scale(1.1);}
 html[dark]{--yt-top-btn-bg:rgba(255,255,255,.10);--yt-top-btn-color:#fff;--yt-top-btn-border:rgba(255,255,255,.18);--yt-top-btn-hover:rgba(255,255,255,.18);}
 html:not([dark]){--yt-top-btn-bg:rgba(255,255,255,.12);--yt-top-btn-color:#222;--yt-top-btn-border:rgba(0,0,0,.08);--yt-top-btn-hover:rgba(255,255,255,.18);}
 #right-tabs .top-button{position:absolute;z-index:1000;}
 ytd-watch-flexy:not([tyt-tab^="#"]) #right-tabs .top-button{display:none;}
 ytd-playlist-panel-renderer .top-button{position:absolute;z-index:1000;}
 ytd-watch-flexy[flexy] #movie_player, ytd-watch-flexy[flexy] #movie_player .html5-video-container, ytd-watch-flexy[flexy] .html5-main-video{width:100%!important; max-width:100%!important;}
 ytd-watch-flexy[flexy] .html5-main-video{height:auto!important; max-height:100%!important; object-fit:contain!important; transform:none!important;}
 ytd-watch-flexy[flexy] #player-container-outer, ytd-watch-flexy[flexy] #movie_player{display:flex!important; align-items:center!important; justify-content:center!important;}
 dislike-button-view-model button{min-width:fit-content!important;width:auto!important;}
 dislike-button-view-model .yt-spec-button-shape-next__button-text-content{display:inline-flex!important;align-items:center!important;justify-content:center!important;}
 #ytp-plus-dislike-text{display:inline-block!important;visibility:visible!important;opacity:1!important;margin-left:6px!important;font-size:1.4rem!important;line-height:2rem!important;font-weight:500!important;}
 ytd-segmented-like-dislike-button-renderer dislike-button-view-model button{min-width:fit-content!important;}
 ytd-segmented-like-dislike-button-renderer .yt-spec-button-shape-next__button-text-content{min-width:2.4rem!important;}
 ytd-reel-video-renderer dislike-button-view-model #ytp-plus-dislike-text{font-size:1.2rem!important;line-height:1.8rem!important;margin-left:4px!important;}
 ytd-reel-video-renderer dislike-button-view-model button{padding:8px 12px!important;min-width:auto!important;}
 ytd-shorts dislike-button-view-model .yt-spec-button-shape-next__button-text-content{display:inline-flex!important;min-width:auto!important;}
 `;
 (document.head || document.documentElement).appendChild(style);
 };
 const handleScroll = (scrollContainer, button) => {
 try {
 if (!button || !scrollContainer) return;
 button.classList.toggle('visible', scrollContainer.scrollTop > 100);
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in handleScroll:', error);
 }
 };
 const setupScrollListener = (() => {
 let timeout;
 return () => {
 if (timeout) clearTimeout(timeout);
 timeout = setTimeout(() => {
 try {
 $$('.tab-content-cld').forEach(tab => {
 if (tab._topButtonScrollHandler) {
 tab.removeEventListener('scroll', tab._topButtonScrollHandler);
 delete tab._topButtonScrollHandler;
 }
 if (tab._scrollObserver) {
 tab._scrollObserver.disconnect();
 delete tab._scrollObserver;
 }
 window.YouTubePlusScrollManager?.removeAllListeners?.(tab);
 });
 const activeTab = $('#right-tabs .tab-content-cld:not(.tab-content-hidden)');
 const button = byId('right-tabs-top-button');
 if (activeTab && button) {
 if (window.YouTubePlusScrollManager) {
 const cleanup = window.YouTubePlusScrollManager.addScrollListener(
 activeTab,
 () => handleScroll(activeTab, button),
 { debounce: 100, runInitial: true }
 );
 activeTab._scrollCleanup = cleanup;
 } else {
 const debounceFunc =
 typeof YouTubeUtils !== 'undefined' && YouTubeUtils.debounce
 ? YouTubeUtils.debounce
 : (fn, delay) => {
 let timeoutId;
 return (...args) => {
 clearTimeout(timeoutId);
 timeoutId = setTimeout(() => fn(...args), delay);
 };
 };
 const scrollHandler = debounceFunc(() => handleScroll(activeTab, button), 100);
 activeTab._topButtonScrollHandler = scrollHandler;
 activeTab.addEventListener('scroll', scrollHandler, {
 passive: true,
 capture: false,
 });
 handleScroll(activeTab, button);
 }
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in setupScrollListener:', error);
 }
 }, 100);
 };
 })();
 const createButton = () => {
 try {
 const rightTabs = $('#right-tabs');
 if (!rightTabs || byId('right-tabs-top-button')) return;
 if (!config.enabled) return;
 const button = document.createElement('button');
 button.id = 'right-tabs-top-button';
 button.className = 'top-button';
 button.title = t('scrollToTop');
 button.setAttribute('aria-label', t('scrollToTop'));
 button.innerHTML =
 '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
 button.addEventListener('click', () => {
 try {
 const activeTab = $('#right-tabs .tab-content-cld:not(.tab-content-hidden)');
 if (activeTab) {
 if ('scrollBehavior' in document.documentElement.style) {
 activeTab.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 activeTab.scrollTop = 0;
 }
 button.setAttribute('aria-label', t('scrolledToTop') || 'Scrolled to top');
 setTimeout(() => {
 button.setAttribute('aria-label', t('scrollToTop'));
 }, 1000);
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error scrolling to top:', error);
 }
 });
 rightTabs.style.position = 'relative';
 rightTabs.appendChild(button);
 setupScrollListener();
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error creating button:', error);
 }
 };
 const createUniversalButton = () => {
 try {
 if (byId('universal-top-button')) return;
 if (!config.enabled) return;
 const button = document.createElement('button');
 button.id = 'universal-top-button';
 button.className = 'top-button';
 button.title = t('scrollToTop');
 button.setAttribute('aria-label', t('scrollToTop'));
 button.innerHTML =
 '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
 const scrollToTop = () => {
 try {
 if ('scrollBehavior' in document.documentElement.style) {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 window.scrollTo(0, 0);
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error scrolling to top:', error);
 }
 };
 button.addEventListener('click', scrollToTop);
 button.addEventListener('keydown', ev => {
 if (ev.key === 'Enter' || ev.key === ' ') {
 ev.preventDefault();
 scrollToTop();
 }
 });
 document.body.appendChild(button);
 const debounceFunc =
 typeof YouTubeUtils !== 'undefined' && YouTubeUtils.debounce
 ? YouTubeUtils.debounce
 : (fn, delay) => {
 let timeoutId;
 return (...args) => {
 clearTimeout(timeoutId);
 timeoutId = setTimeout(() => fn(...args), delay);
 };
 };
 const scrollHandler = debounceFunc(() => {
 button.classList.toggle('visible', window.scrollY > 100);
 }, 100);
 window.addEventListener('scroll', scrollHandler, { passive: true });
 button.classList.toggle('visible', window.scrollY > 100);
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error creating universal button:', error);
 }
 };
 const createPlaylistPanelButton = () => {
 try {
 const playlistPanel = $('ytd-playlist-panel-renderer');
 if (!playlistPanel || byId('playlist-panel-top-button')) return;
 if (!config.enabled) return;
 const button = document.createElement('button');
 button.id = 'playlist-panel-top-button';
 button.className = 'top-button';
 button.title = t('scrollToTop');
 button.setAttribute('aria-label', t('scrollToTop'));
 button.innerHTML =
 '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
 const scrollContainer = $('#items', playlistPanel);
 if (!scrollContainer) return;
 const scrollToTop = () => {
 try {
 if ('scrollBehavior' in document.documentElement.style) {
 scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 scrollContainer.scrollTop = 0;
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error scrolling to top:', error);
 }
 };
 button.addEventListener('click', scrollToTop);
 button.addEventListener('keydown', ev => {
 if (ev.key === 'Enter' || ev.key === ' ') {
 ev.preventDefault();
 scrollToTop();
 }
 });
 playlistPanel.style.position = playlistPanel.style.position || 'relative';
 button.style.position = 'absolute';
 button.style.bottom = '16px';
 button.style.right = '16px';
 button.style.zIndex = '1000';
 playlistPanel.appendChild(button);
 const debounceFunc =
 typeof YouTubeUtils !== 'undefined' && YouTubeUtils.debounce
 ? YouTubeUtils.debounce
 : (fn, delay) => {
 let timeoutId;
 return (...args) => {
 clearTimeout(timeoutId);
 timeoutId = setTimeout(() => fn(...args), delay);
 };
 };
 const scrollHandler = debounceFunc(() => handleScroll(scrollContainer, button), 100);
 scrollContainer.addEventListener('scroll', scrollHandler, { passive: true });
 handleScroll(scrollContainer, button);
 const updateVisibility = () => {
 try {
 if (!playlistPanel.isConnected || playlistPanel.hidden) {
 button.style.display = 'none';
 return;
 }
 const cs = window.getComputedStyle(playlistPanel);
 if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
 button.style.display = 'none';
 return;
 }
 const rect = playlistPanel.getBoundingClientRect();
 if (!rect || rect.width < 40 || rect.height < 40) {
 button.style.display = 'none';
 return;
 }
 if (
 !scrollContainer ||
 scrollContainer.offsetHeight === 0 ||
 scrollContainer.scrollHeight === 0
 ) {
 button.style.display = 'none';
 return;
 }
 button.style.display = '';
 } catch {
 try {
 button.style.display = 'none';
 } catch {}
 }
 };
 let ro = null;
 try {
 if (typeof ResizeObserver !== 'undefined') {
 ro = new ResizeObserver(updateVisibility);
 ro.observe(playlistPanel);
 if (scrollContainer) ro.observe(scrollContainer);
 }
 } catch {
 ro = null;
 }
 const mo = new MutationObserver(updateVisibility);
 try {
 mo.observe(playlistPanel, {
 attributes: true,
 attributeFilter: ['class', 'style', 'hidden'],
 });
 } catch {}
 updateVisibility();
 try {
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.register(() => {
 try {
 if (ro) ro.disconnect();
 } catch {}
 try {
 mo.disconnect();
 } catch {}
 });
 }
 } catch {}
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error creating playlist panel button:', error);
 }
 };
 const RETURN_DISLIKE_API = 'https://returnyoutubedislikeapi.com/votes';
 const DISLIKE_CACHE_TTL = 10 * 60 * 1000;
 const dislikeCache = new Map();
 let dislikeObserver = null;
 let dislikePollTimer = null;
 const formatCompactNumber = number => {
 try {
 return new Intl.NumberFormat(_getLanguage() || 'en', {
 notation: 'compact',
 compactDisplay: 'short',
 }).format(Number(number) || 0);
 } catch {
 return String(number || 0);
 }
 };
 const fetchDislikes = async videoId => {
 if (!videoId) return 0;
 const cached = dislikeCache.get(videoId);
 if (cached && Date.now() < cached.expiresAt) return cached.value;
 try {
 if (typeof GM_xmlhttpRequest !== 'undefined') {
 const text = await new Promise((resolve, reject) => {
 const timeoutId = setTimeout(() => reject(new Error('timeout')), 8000);
 GM_xmlhttpRequest({
 method: 'GET',
 url: `${RETURN_DISLIKE_API}?videoId=${encodeURIComponent(videoId)}`,
 timeout: 8000,
 headers: { Accept: 'application/json' },
 onload: r => {
 clearTimeout(timeoutId);
 if (r.status >= 200 && r.status < 300) resolve(r.responseText);
 else reject(new Error(`HTTP ${r.status}`));
 },
 onerror: e => {
 clearTimeout(timeoutId);
 reject(e || new Error('network'));
 },
 ontimeout: () => {
 clearTimeout(timeoutId);
 reject(new Error('timeout'));
 },
 });
 });
 const parsed = JSON.parse(text || '{}');
 const val = Number(parsed.dislikes || 0) || 0;
 dislikeCache.set(videoId, { value: val, expiresAt: Date.now() + DISLIKE_CACHE_TTL });
 return val;
 }
 const controller = new AbortController();
 const id = setTimeout(() => controller.abort(), 8000);
 try {
 const resp = await fetch(`${RETURN_DISLIKE_API}?videoId=${encodeURIComponent(videoId)}`, {
 method: 'GET',
 cache: 'no-cache',
 signal: controller.signal,
 headers: { Accept: 'application/json' },
 });
 clearTimeout(id);
 if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
 const json = await resp.json();
 const val = Number(json.dislikes || 0) || 0;
 dislikeCache.set(videoId, { value: val, expiresAt: Date.now() + DISLIKE_CACHE_TTL });
 return val;
 } finally {
 clearTimeout(id);
 }
 } catch {
 return 0;
 }
 };
 const getVideoIdForDislike = () => {
 try {
 const urlObj = new URL(window.location.href);
 const pathname = urlObj.pathname || '';
 if (pathname.startsWith('/shorts/')) return pathname.slice(8);
 if (pathname.startsWith('/clip/')) {
 const meta = $("meta[itemprop='videoId'], meta[itemprop='identifier']");
 return meta?.getAttribute('content') || null;
 }
 return urlObj.searchParams.get('v');
 } catch {
 return null;
 }
 };
 const getButtonsContainer = () => {
 return (
 $('ytd-menu-renderer.ytd-watch-metadata > div#top-level-buttons-computed') ||
 $('ytd-menu-renderer.ytd-video-primary-info-renderer > div') ||
 $('#menu-container #top-level-buttons-computed') ||
 null
 );
 };
 const getDislikeButtonShorts = () => {
 const activeReel = $('ytd-reel-video-renderer[is-active]');
 if (activeReel) {
 const btn =
 $('dislike-button-view-model', activeReel) ||
 $('like-button-view-model', activeReel)
 ?.parentElement?.querySelector('[aria-label*="islike"]')
 ?.closest('button')?.parentElement ||
 $('#dislike-button', activeReel);
 if (btn) return btn;
 }
 const shortsContainer = $('ytd-shorts');
 if (shortsContainer) {
 const btn =
 $('dislike-button-view-model', shortsContainer) || $('#dislike-button', shortsContainer);
 if (btn) return btn;
 }
 return $('dislike-button-view-model') || $('#dislike-button') || null;
 };
 const getDislikeButtonFromContainer = buttons => {
 if (!buttons) return null;
 const segmented = buttons.querySelector('ytd-segmented-like-dislike-button-renderer');
 if (segmented) {
 const dislikeViewModel =
 segmented.querySelector('dislike-button-view-model') ||
 segmented.querySelector('#segmented-dislike-button') ||
 segmented.children[1];
 if (dislikeViewModel) return dislikeViewModel;
 }
 const viewModel = buttons.querySelector('dislike-button-view-model');
 if (viewModel) return viewModel;
 const dislikeBtn =
 buttons.querySelector('button[aria-label*="islike"]') ||
 buttons.querySelector('button[aria-label*="Не нравится"]');
 if (dislikeBtn) {
 return dislikeBtn.closest('dislike-button-view-model') || dislikeBtn.parentElement;
 }
 return buttons.children && buttons.children[1] ? buttons.children[1] : null;
 };
 const getDislikeButton = () => {
 const isShorts = window.location.pathname.startsWith('/shorts');
 if (isShorts) {
 return getDislikeButtonShorts();
 }
 const buttons = getButtonsContainer();
 return getDislikeButtonFromContainer(buttons);
 };
 const getOrCreateDislikeText = dislikeButton => {
 if (!dislikeButton) return null;
 const existingCustom = dislikeButton.querySelector('#ytp-plus-dislike-text');
 if (existingCustom) return existingCustom;
 const textSpan =
 dislikeButton.querySelector('span.yt-core-attributed-string:not(#ytp-plus-dislike-text)') ||
 dislikeButton.querySelector('#text') ||
 dislikeButton.querySelector('yt-formatted-string') ||
 dislikeButton.querySelector('span[role="text"]:not(#ytp-plus-dislike-text)') ||
 dislikeButton.querySelector('.yt-spec-button-shape-next__button-text-content');
 if (textSpan && textSpan.id !== 'ytp-plus-dislike-text') {
 textSpan.id = 'ytp-plus-dislike-text';
 return textSpan;
 }
 const viewModelHost = dislikeButton.closest('ytDislikeButtonViewModelHost') || dislikeButton;
 const buttonShape =
 viewModelHost.querySelector('button-view-model button') ||
 viewModelHost.querySelector('button[aria-label]') ||
 dislikeButton.querySelector('button') ||
 dislikeButton;
 let textContainer = buttonShape.querySelector(
 '.yt-spec-button-shape-next__button-text-content'
 );
 const created = document.createElement('span');
 created.id = 'ytp-plus-dislike-text';
 created.setAttribute('role', 'text');
 created.className = 'yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap';
 const isShorts = window.location.pathname.startsWith('/shorts');
 created.style.cssText = isShorts
 ? 'margin-left: 4px; font-size: 1.2rem; line-height: 1.8rem; font-weight: 500;'
 : 'margin-left: 6px; font-size: 1.4rem; line-height: 2rem; font-weight: 500;';
 try {
 if (!textContainer) {
 textContainer = document.createElement('div');
 textContainer.className = 'yt-spec-button-shape-next__button-text-content';
 textContainer.appendChild(created);
 buttonShape.appendChild(textContainer);
 } else {
 textContainer.appendChild(created);
 }
 buttonShape.style.minWidth = 'auto';
 buttonShape.style.width = 'auto';
 if (viewModelHost !== dislikeButton) {
 viewModelHost.style.minWidth = 'auto';
 }
 } catch (e) {
 console.warn('YTP: Failed to create dislike text:', e);
 }
 return created;
 };
 const setDislikeDisplay = (dislikeButton, count) => {
 try {
 const container = getOrCreateDislikeText(dislikeButton);
 if (!container) return;
 const formatted = formatCompactNumber(count);
 if (container.innerText !== String(formatted)) {
 container.innerText = String(formatted);
 container.style.display = 'inline-block';
 container.style.visibility = 'visible';
 container.style.opacity = '1';
 const buttonShape = container.closest('button') || dislikeButton.querySelector('button');
 if (buttonShape) {
 buttonShape.style.minWidth = 'fit-content';
 buttonShape.style.width = 'auto';
 }
 }
 } catch (e) {
 console.warn('YTP: Failed to set dislike display:', e);
 }
 };
 const setupDislikeObserver = dislikeButton => {
 if (!dislikeButton) return;
 if (dislikeObserver) {
 dislikeObserver.disconnect();
 dislikeObserver = null;
 }
 const existingText = dislikeButton.querySelector('#ytp-plus-dislike-text');
 if (existingText?.textContent && existingText.textContent !== '0') {
 return;
 }
 dislikeObserver = new MutationObserver(() => {
 const vid = getVideoIdForDislike();
 const cached = dislikeCache.get(vid);
 if (cached) {
 const btn = getDislikeButton();
 if (btn) setDislikeDisplay(btn, cached.value);
 }
 });
 try {
 dislikeObserver.observe(dislikeButton, { childList: true, subtree: true, attributes: true });
 } catch {}
 };
 const initReturnDislike = () => {
 try {
 if (dislikePollTimer) return;
 let attempts = 0;
 const maxAttempts = window.location.pathname.startsWith('/shorts') ? 100 : 50;
 const interval = window.location.pathname.startsWith('/shorts') ? 100 : 200;
 dislikePollTimer = setInterval(async () => {
 attempts++;
 const btn = getDislikeButton();
 if (btn || attempts >= maxAttempts) {
 clearInterval(dislikePollTimer);
 dislikePollTimer = null;
 if (btn) {
 const vid = getVideoIdForDislike();
 const val = await fetchDislikes(vid);
 setDislikeDisplay(btn, val);
 setupDislikeObserver(btn);
 }
 }
 }, interval);
 } catch {
 }
 };
 const cleanupReturnDislike = () => {
 try {
 if (dislikePollTimer) {
 clearInterval(dislikePollTimer);
 dislikePollTimer = null;
 }
 if (dislikeObserver) {
 dislikeObserver.disconnect();
 dislikeObserver = null;
 }
 $$('#ytp-plus-dislike-text').forEach(el => {
 try {
 if (el.parentNode) el.parentNode.removeChild(el);
 } catch {}
 });
 dislikeCache.clear();
 } catch (e) {
 console.warn('YTP: Dislike cleanup error:', e);
 }
 };
 const observeTabChanges = () => {
 try {
 const observer = new MutationObserver(mutations => {
 try {
 if (
 mutations.some(
 m =>
 m.type === 'attributes' &&
 m.attributeName === 'class' &&
 m.target instanceof Element &&
 m.target.classList.contains('tab-content-cld')
 )
 ) {
 setTimeout(setupScrollListener, 100);
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in mutation observer:', error);
 }
 });
 const rightTabs = $('#right-tabs');
 if (rightTabs) {
 observer.observe(rightTabs, {
 attributes: true,
 subtree: true,
 attributeFilter: ['class'],
 });
 return observer;
 }
 return null;
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in observeTabChanges:', error);
 return null;
 }
 };
 const needsUniversalButton = () => {
 const path = window.location.pathname;
 const { search } = window.location;
 if (path === '/results' && search.includes('search_query=')) return true;
 if (path === '/playlist' && search.includes('list=')) return true;
 if (path === '/' || path === '/feed/subscriptions') return true;
 return false;
 };
 const handleTabButtonClick = e => {
 try {
 const { target } = (e);
 const tabButton = target?.closest?.('.tab-btn[tyt-tab-content]');
 if (tabButton) {
 setTimeout(setupScrollListener, 100);
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in click handler:', error);
 }
 };
 const setupEvents = () => {
 try {
 document.addEventListener('click', handleTabButtonClick, true);
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in setupEvents:', error);
 }
 };
 const init = () => {
 try {
 addStyles();
 setupEvents();
 const checkForTabs = () => {
 try {
 if ($('#right-tabs')) {
 createButton();
 observeTabChanges();
 } else {
 setTimeout(checkForTabs, 500);
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error checking for tabs:', error);
 }
 };
 const checkForPlaylistPanel = () => {
 try {
 const playlistPanel = $('ytd-playlist-panel-renderer');
 if (playlistPanel && !byId('playlist-panel-top-button')) {
 createPlaylistPanelButton();
 }
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error checking for playlist panel:', error);
 }
 };
 const checkPageType = () => {
 try {
 if (needsUniversalButton() && !byId('universal-top-button')) {
 createUniversalButton();
 }
 checkForPlaylistPanel();
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error checking page type:', error);
 }
 };
 checkForTabs();
 setTimeout(checkPageType, 500);
 try {
 initReturnDislike();
 } catch {}
 let observerThrottle = null;
 const observer = new MutationObserver(() => {
 if (observerThrottle) return;
 observerThrottle = setTimeout(() => {
 observerThrottle = null;
 checkForPlaylistPanel();
 }, 200);
 });
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 attributes: false,
 characterData: false,
 });
 window.addEventListener('yt-navigate-finish', () => {
 try {
 cleanupReturnDislike();
 } catch {}
 setTimeout(() => {
 checkPageType();
 checkForTabs();
 try {
 initReturnDislike();
 } catch {}
 }, 300);
 });
 } catch (error) {
 console.error('[YouTube+][Enhanced] Error in initialization:', error);
 }
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
})();
(function () {
 'use strict';
 const CONFIG = {
 enabled: true,
 storageKey: 'youtube_endscreen_settings',
 selectors:
 '.ytp-ce-element-show,.ytp-ce-element,.ytp-endscreen-element,.ytp-ce-covering-overlay,.ytp-cards-teaser,.teaser-carousel,.ytp-cards-button,.iv-drawer,.iv-branding,.video-annotations,.ytp-cards-teaser-text',
 debounceMs: 32,
 batchSize: 20,
 };
 const state = {
 observer: null,
 styleEl: null,
 isActive: false,
 removeCount: 0,
 lastCheck: 0,
 ytNavigateListenerKey: null,
 settingsNavListenerKey: null,
 };
 const debounce = (fn, ms) => {
 try {
 return (
 window.YouTubeUtils?.debounce ||
 ((f, t) => {
 let id;
 return (...args) => {
 clearTimeout(id);
 id = setTimeout(() => f(...args), t);
 };
 })(fn, ms)
 );
 } catch {
 let id;
 return (...args) => {
 clearTimeout(id);
 id = setTimeout(() => fn(...args), ms);
 };
 }
 };
 const fastRemove = elements => {
 const len = Math.min(elements.length, CONFIG.batchSize);
 for (let i = 0; i < len; i++) {
 const el = elements[i];
 if (el?.isConnected) {
 el.style.cssText = 'display:none!important;visibility:hidden!important';
 try {
 el.remove();
 state.removeCount++;
 } catch {}
 }
 }
 };
 const settings = {
 load: () => {
 try {
 const data = localStorage.getItem(CONFIG.storageKey);
 CONFIG.enabled = data ? (JSON.parse(data).enabled ?? true) : true;
 } catch {
 CONFIG.enabled = true;
 }
 },
 save: () => {
 try {
 localStorage.setItem(CONFIG.storageKey, JSON.stringify({ enabled: CONFIG.enabled }));
 } catch {}
 settings.apply();
 },
 apply: () => (CONFIG.enabled ? init() : cleanup()),
 };
 const injectCSS = () => {
 if (state.styleEl || !CONFIG.enabled) return;
 const styles = `${CONFIG.selectors}{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:scale(0)!important}`;
 YouTubeUtils.StyleManager.add('end-screen-remover', styles);
 state.styleEl = 'end-screen-remover';
 };
 const removeEndScreens = () => {
 if (!CONFIG.enabled) return;
 const now = performance.now();
 if (now - state.lastCheck < CONFIG.debounceMs) return;
 state.lastCheck = now;
 const elements = $$(CONFIG.selectors);
 if (elements.length) fastRemove(elements);
 };
 const getClassNameValue = node => {
 if (typeof node.className === 'string') {
 return node.className;
 }
 if (node.className && typeof node.className === 'object' && 'baseVal' in node.className) {
 return (node.className).baseVal;
 }
 return '';
 };
 const isRelevantNode = node => {
 if (!(node instanceof Element)) return false;
 const classNameValue = getClassNameValue(node);
 return classNameValue.includes('ytp-') || node.querySelector?.('.ytp-ce-element');
 };
 const hasRelevantChanges = mutations => {
 for (const { addedNodes } of mutations) {
 for (const node of addedNodes) {
 if (isRelevantNode(node)) return true;
 }
 }
 return false;
 };
 const createEndScreenObserver = throttledRemove => {
 return new MutationObserver(mutations => {
 if (hasRelevantChanges(mutations)) {
 throttledRemove();
 }
 });
 };
 const setupWatcher = () => {
 if (state.observer || !CONFIG.enabled) return;
 const throttledRemove = debounce(removeEndScreens, CONFIG.debounceMs);
 state.observer = createEndScreenObserver(throttledRemove);
 YouTubeUtils.cleanupManager.registerObserver(state.observer);
 const target = $('#movie_player') || document.body;
 state.observer.observe(target, {
 childList: true,
 subtree: true,
 attributeFilter: ['class', 'style'],
 });
 };
 const cleanup = () => {
 state.observer?.disconnect();
 state.observer = null;
 if (state.styleEl) {
 try {
 YouTubeUtils.StyleManager.remove(state.styleEl);
 } catch {}
 }
 state.styleEl = null;
 state.isActive = false;
 };
 const init = () => {
 if (state.isActive || !CONFIG.enabled) return;
 state.isActive = true;
 injectCSS();
 removeEndScreens();
 setupWatcher();
 };
 const addSettingsUI = () => {
 const section = $('.ytp-plus-settings-section[data-section="advanced"]');
 if (!section || $('.endscreen-settings', section)) return;
 const container = document.createElement('div');
 container.className = 'ytp-plus-settings-item endscreen-settings';
 container.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${YouTubeUtils.t('endscreenHideLabel')}</label>
 <div class="ytp-plus-settings-item-description">${YouTubeUtils.t('endscreenHideDesc')}${state.removeCount ? ` (${state.removeCount} ${YouTubeUtils.t('removedSuffix').replace('{n}', '')?.trim() || 'removed'})` : ''}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" ${CONFIG.enabled ? 'checked' : ''}>
 `;
 section.appendChild(container);
 container.querySelector('input').addEventListener(
 'change',
 e => {
 const { target } = (e);
 const { checked } = (target);
 CONFIG.enabled = checked;
 settings.save();
 },
 { passive: true }
 );
 };
 const handlePageChange = debounce(() => {
 if (location.pathname === '/watch') {
 cleanup();
 requestIdleCallback ? requestIdleCallback(init) : setTimeout(init, 1);
 }
 }, 50);
 settings.load();
 const { readyState } = document;
 if (readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init, { once: true });
 } else {
 init();
 }
 const handleSettingsNavClick = e => {
 const { target } = (e);
 if (target?.dataset?.section === 'advanced') {
 setTimeout(addSettingsUI, 10);
 }
 };
 if (!state.ytNavigateListenerKey) {
 state.ytNavigateListenerKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'yt-navigate-finish',
 (handlePageChange),
 { passive: true }
 );
 }
 const settingsObserver = new MutationObserver(mutations => {
 for (const { addedNodes } of mutations) {
 for (const node of addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addSettingsUI, 25);
 return;
 }
 }
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(settingsObserver);
 if (document.body) {
 settingsObserver.observe(document.body, { childList: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 settingsObserver.observe(document.body, { childList: true });
 });
 }
 if (!state.settingsNavListenerKey) {
 state.settingsNavListenerKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'click',
 handleSettingsNavClick,
 { passive: true, capture: true }
 );
 }
})();
(function () {
 'use strict';
 const RESUME_STORAGE_KEY = 'youtube_resume_times_v1';
 const OVERLAY_ID = 'yt-resume-overlay';
 const AUTO_HIDE_MS = 10000;
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const _localFallback = {
 resumePlayback: { en: 'Resume playback?', ru: 'Продолжить воспроизведение?' },
 resume: { en: 'Resume', ru: 'Продолжить' },
 startOver: { en: 'Start over', ru: 'Начать сначала' },
 };
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {}
 const htmlLang = document.documentElement.lang || 'en';
 const lang = htmlLang.startsWith('ru') ? 'ru' : 'en';
 const val =
 (_localFallback[key] && (_localFallback[key][lang] || _localFallback[key].en)) || key;
 if (!params || Object.keys(params).length === 0) return val;
 let result = val;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const readStorage = () => {
 try {
 return JSON.parse(localStorage.getItem(RESUME_STORAGE_KEY) || '{}');
 } catch {
 return {};
 }
 };
 const writeStorage = obj => {
 try {
 localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(obj));
 } catch {}
 };
 const getVideoId = () => {
 try {
 const urlParams = new URLSearchParams(window.location.search);
 const videoIdFromUrl = urlParams.get('v');
 if (videoIdFromUrl) return videoIdFromUrl;
 const meta = document.querySelector('link[rel="canonical"]');
 if (meta && meta.href) {
 const u = new URL(meta.href);
 const vParam = u.searchParams.get('v');
 if (vParam) return vParam;
 const pathMatch = u.pathname.match(/\/(watch|shorts)\/([^\/\?]+)/);
 if (pathMatch && pathMatch[2]) return pathMatch[2];
 }
 if (
 window.ytInitialPlayerResponse &&
 window.ytInitialPlayerResponse.videoDetails &&
 window.ytInitialPlayerResponse.videoDetails.videoId
 ) {
 return window.ytInitialPlayerResponse.videoDetails.videoId;
 }
 const pathMatch = window.location.pathname.match(/\/(watch|shorts)\/([^\/\?]+)/);
 if (pathMatch && pathMatch[2]) return pathMatch[2];
 return null;
 } catch {
 return null;
 }
 };
 const createOverlay = (seconds, onResume, onRestart) => {
 if (document.getElementById(OVERLAY_ID)) return null;
 const wrap = document.createElement('div');
 wrap.id = OVERLAY_ID;
 const player = document.querySelector('#movie_player');
 const inPlayer = !!player;
 const resumeOverlayStyles = `
 .ytp-resume-overlay{min-width:180px;max-width:36vw;background:rgba(24, 24, 24, 0.3);color:var(--yt-spec-text-primary,#fff);padding:12px 14px;border-radius:12px;backdrop-filter:blur(8px) saturate(150%);-webkit-backdrop-filter:blur(8px) saturate(150%);box-shadow:0 14px 40px rgba(0,0,0,0.48);border:1.25px solid rgba(255,255,255,0.06);font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column;align-items:center;text-align:center;animation:ytp-resume-fadein 0.3s ease-out}
 @keyframes ytp-resume-fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
 .ytp-resume-overlay .ytp-resume-title{font-weight:600;margin-bottom:8px;font-size:13px}
 .ytp-resume-overlay .ytp-resume-actions{display:flex;gap:8px;justify-content:center;margin-top:6px}
 .ytp-resume-overlay .ytp-resume-btn{padding:6px 12px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-weight:500;transition:all 0.2s ease;outline:none}
 .ytp-resume-overlay .ytp-resume-btn:focus{box-shadow:0 0 0 2px rgba(255,255,255,0.3);outline:2px solid transparent}
 .ytp-resume-overlay .ytp-resume-btn:hover{transform:translateY(-1px)}
 .ytp-resume-overlay .ytp-resume-btn:active{transform:translateY(0)}
 .ytp-resume-overlay .ytp-resume-btn.primary{background:#1e88e5;color:#fff}
 .ytp-resume-overlay .ytp-resume-btn.primary:hover{background:#1976d2}
 .ytp-resume-overlay .ytp-resume-btn.ghost{background:rgba(255,255,255,0.06);color:#fff}
 .ytp-resume-overlay .ytp-resume-btn.ghost:hover{background:rgba(255,255,255,0.12)}
 `;
 try {
 if (window.YouTubeUtils && YouTubeUtils.StyleManager) {
 YouTubeUtils.StyleManager.add('ytp-resume-overlay-styles', resumeOverlayStyles);
 } else if (!byId('ytp-resume-overlay-styles')) {
 const s = document.createElement('style');
 s.id = 'ytp-resume-overlay-styles';
 s.textContent = resumeOverlayStyles;
 (document.head || document.documentElement).appendChild(s);
 }
 } catch {}
 if (inPlayer) {
 try {
 const playerStyle = window.getComputedStyle(
 ( (player))
 );
 if (playerStyle.position === 'static') player.style.position = 'relative';
 } catch {}
 wrap.className = 'ytp-resume-overlay';
 wrap.style.cssText =
 'position:absolute;left:50%;bottom:5%;transform:translate(-50%,-50%);z-index:9999;pointer-events:auto;';
 player.appendChild(wrap);
 } else {
 wrap.className = 'ytp-resume-overlay';
 wrap.style.cssText =
 'position:fixed;left:50%;bottom:5%;transform:translate(-50%,-50%);z-index:1200;pointer-events:auto;';
 document.body.appendChild(wrap);
 }
 const title = document.createElement('div');
 title.className = 'ytp-resume-title';
 title.textContent = `${t('resumePlayback')} (${formatTime(seconds)})`;
 const btnResume = document.createElement('button');
 btnResume.className = 'ytp-resume-btn primary';
 btnResume.textContent = t('resume');
 btnResume.setAttribute('aria-label', `${t('resume')} at ${formatTime(seconds)}`);
 btnResume.tabIndex = 0;
 const btnRestart = document.createElement('button');
 btnRestart.className = 'ytp-resume-btn ghost';
 btnRestart.textContent = t('startOver');
 btnRestart.setAttribute('aria-label', t('startOver'));
 btnRestart.tabIndex = 0;
 const handleResume = () => {
 try {
 onResume();
 } catch (err) {
 console.error('[YouTube+] Resume error:', err);
 }
 try {
 wrap.remove();
 } catch {}
 };
 const handleRestart = () => {
 try {
 onRestart();
 } catch (err) {
 console.error('[YouTube+] Restart error:', err);
 }
 try {
 wrap.remove();
 } catch {}
 };
 btnResume.addEventListener('click', handleResume);
 btnRestart.addEventListener('click', handleRestart);
 btnResume.addEventListener('keydown', ev => {
 if (ev.key === 'Enter' || ev.key === ' ') {
 ev.preventDefault();
 handleResume();
 }
 });
 btnRestart.addEventListener('keydown', ev => {
 if (ev.key === 'Enter' || ev.key === ' ') {
 ev.preventDefault();
 handleRestart();
 }
 });
 const actions = document.createElement('div');
 actions.className = 'ytp-resume-actions';
 actions.appendChild(btnResume);
 actions.appendChild(btnRestart);
 wrap.appendChild(title);
 wrap.appendChild(actions);
 try {
 requestAnimationFrame(() => {
 btnResume.focus();
 });
 } catch {}
 const to = setTimeout(() => {
 try {
 wrap.remove();
 } catch {}
 }, AUTO_HIDE_MS);
 const cancel = () => clearTimeout(to);
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.register(() => {
 try {
 cancel();
 } catch {}
 try {
 wrap.remove();
 } catch {}
 });
 }
 return cancel;
 };
 const formatTime = secs => {
 const s = Math.floor(secs % 60)
 .toString()
 .padStart(2, '0');
 const m = Math.floor((secs / 60) % 60).toString();
 const h = Math.floor(secs / 3600);
 return h ? `${h}:${m.padStart(2, '0')}:${s}` : `${m}:${s}`;
 };
 const attachResumeHandlers = videoEl => {
 if (!videoEl || videoEl.tagName !== 'VIDEO') {
 console.warn('[YouTube+] Invalid video element for resume handlers');
 return;
 }
 if (videoEl._ytpResumeAttached) return;
 videoEl._ytpResumeAttached = true;
 const getCurrentVideoId = () => getVideoId();
 const vid = getCurrentVideoId();
 if (!vid) return;
 const storage = readStorage();
 const saved = storage[vid];
 let timeUpdateHandler = null;
 let lastSavedAt = 0;
 const SAVE_THROTTLE_MS = 800;
 const startSaving = () => {
 if (timeUpdateHandler) return;
 timeUpdateHandler = () => {
 try {
 const currentVid = getCurrentVideoId();
 if (!currentVid) return;
 const t = Math.floor(videoEl.currentTime || 0);
 const now = Date.now();
 if (t && (!lastSavedAt || now - lastSavedAt > SAVE_THROTTLE_MS)) {
 const s = readStorage();
 s[currentVid] = t;
 writeStorage(s);
 lastSavedAt = now;
 }
 } catch {}
 };
 videoEl.addEventListener('timeupdate', timeUpdateHandler, { passive: true });
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.register(() => {
 try {
 videoEl.removeEventListener('timeupdate', timeUpdateHandler);
 } catch {}
 });
 }
 };
 const stopSaving = () => {
 if (!timeUpdateHandler) return;
 try {
 videoEl.removeEventListener('timeupdate', timeUpdateHandler);
 } catch {}
 timeUpdateHandler = null;
 lastSavedAt = 0;
 };
 if (saved && saved > 5 && !byId(OVERLAY_ID)) {
 const cancelTimeout = createOverlay(
 saved,
 () => {
 try {
 videoEl.currentTime = saved;
 videoEl.play();
 } catch {}
 },
 () => {
 try {
 videoEl.currentTime = 0;
 videoEl.play();
 } catch {}
 }
 );
 try {
 const overlayEl = byId(OVERLAY_ID);
 if (overlayEl && vid) overlayEl.dataset.vid = vid;
 } catch {}
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager && cancelTimeout) {
 YouTubeUtils.cleanupManager.register(cancelTimeout);
 }
 }
 const onPlay = () => startSaving();
 const onPause = () => stopSaving();
 videoEl.addEventListener('play', onPlay, { passive: true });
 videoEl.addEventListener('pause', onPause, { passive: true });
 const cleanupHandlers = () => {
 try {
 videoEl.removeEventListener('play', onPlay);
 videoEl.removeEventListener('pause', onPause);
 if (timeUpdateHandler) {
 videoEl.removeEventListener('timeupdate', timeUpdateHandler);
 }
 delete videoEl._ytpResumeAttached;
 } catch (err) {
 console.error('[YouTube+] Resume cleanup error:', err);
 }
 };
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.register(cleanupHandlers);
 }
 return cleanupHandlers;
 };
 const findVideoElement = () => {
 const selectors = [
 'video.html5-main-video',
 'video.video-stream',
 '#movie_player video',
 'video',
 ];
 for (const selector of selectors) {
 const video = document.querySelector(selector);
 if (video && video.tagName === 'VIDEO') {
 return (video);
 }
 }
 return null;
 };
 const initResume = () => {
 if (window.location.pathname !== '/watch') {
 const existingOverlay = byId(OVERLAY_ID);
 if (existingOverlay) {
 existingOverlay.remove();
 }
 return;
 }
 const currentVid = getVideoId();
 const existingOverlay = document.getElementById(OVERLAY_ID);
 if (existingOverlay) {
 try {
 if (existingOverlay.dataset && existingOverlay.dataset.vid === currentVid) {
 } else {
 existingOverlay.remove();
 }
 } catch {
 try {
 existingOverlay.remove();
 } catch {}
 }
 }
 const videoEl = findVideoElement();
 if (videoEl) {
 attachResumeHandlers(videoEl);
 } else {
 setTimeout(initResume, 500);
 }
 };
 const onNavigate = () => setTimeout(initResume, 150);
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initResume, { once: true });
 } else {
 initResume();
 }
 if (window && window.document) {
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.registerListener(document, 'yt-navigate-finish', onNavigate, {
 passive: true,
 });
 } else {
 document.addEventListener('yt-navigate-finish', onNavigate, { passive: true });
 }
 }
})();
(async function () {
 'use strict';
 const globalContext =
 typeof unsafeWindow !== 'undefined'
 ? (unsafeWindow)
 : (window);
 const gmApi = globalContext?.GM ?? null;
 const gmInfo = globalContext?.GM_info ?? null;
 const scriptVersion = gmInfo?.script?.version ?? null;
 if (scriptVersion && /-(alpha|beta|dev|test)$/.test(scriptVersion)) {
 try {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.info &&
 YouTubeUtils.logger.info(
 '%cytp - YouTube Play All\n',
 'color: #bf4bcc; font-size: 32px; font-weight: bold',
 'You are currently running a test version:',
 scriptVersion
 );
 } catch {}
 }
 if (
 Object.prototype.hasOwnProperty.call(window, 'trustedTypes') &&
 !window.trustedTypes.defaultPolicy
 ) {
 window.trustedTypes.createPolicy('default', { createHTML: string => string });
 }
 const insertStylesSafely = html => {
 try {
 const target = document.head || document.documentElement;
 if (target && typeof target.insertAdjacentHTML === 'function') {
 target.insertAdjacentHTML('beforeend', html);
 return;
 }
 const onReady = () => {
 try {
 const t = document.head || document.documentElement;
 if (t && typeof t.insertAdjacentHTML === 'function') {
 t.insertAdjacentHTML('beforeend', html);
 }
 } catch {}
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', onReady, { once: true });
 } else {
 onReady();
 }
 } catch {}
 };
 insertStylesSafely(`<style>
 .ytp-btn {border-radius: 8px; font-family: 'Roboto', 'Arial', sans-serif; font-size: 1.4rem; line-height: 2rem; font-weight: 500; padding: 0.5em; margin-left: 0.6em; user-select: none;}
 .ytp-btn, .ytp-btn > * {text-decoration: none; cursor: pointer;}
 .ytp-btn-sections {padding: 0;}
 .ytp-btn-sections > .ytp-btn-section {padding: 0.5em; display: inline-block;}
 .ytp-btn-sections > .ytp-btn-section:first-child {border-top-left-radius: 8px; border-bottom-left-radius: 8px;}
 .ytp-btn-sections > .ytp-btn-section:nth-last-child(1 of .ytp-btn-section) {border-top-right-radius: 8px; border-bottom-right-radius: 8px;}
 .ytp-badge {border-radius: 8px; padding: 0.2em; font-size: 0.8em; vertical-align: top;}
 .ytp-play-all-btn {background-color: #bf4bcc; color: white;}
 .ytp-play-all-btn:hover {background-color: #d264de;}
 .ytp-random-btn > .ytp-btn-section, .ytp-random-badge, .ytp-random-notice, .ytp-random-popover > * {background-color: #2b66da; color: white;}
 .ytp-random-btn > .ytp-btn-section:hover, .ytp-random-popover > *:hover {background-color: #6192ee;}
 .ytp-play-all-btn.ytp-unsupported {background-color: #828282; color: white;}
 .ytp-random-popover {position: absolute; border-radius: 8px; font-size: 1.6rem; transform: translate(-100%, 0.4em);}
 .ytp-random-popover > * {display: block; text-decoration: none; padding: 0.4em;}
 .ytp-random-popover > :first-child {border-top-left-radius: 8px; border-top-right-radius: 8px;}
 .ytp-random-popover > :last-child {border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;}
 .ytp-random-popover > *:not(:last-child) {border-bottom: 1px solid #6e8dbb;}
 .ytp-button-container {display: flex; width: 100%; margin-top: 1em; margin-bottom: -1em;}
 ytd-rich-grid-renderer .ytp-button-container > :first-child {margin-left: 0;}
 .ytp-play-all-btn ~ .ytp-play-all-btn, .ytp-random-btn ~ .ytp-random-btn {display: none;}
 ytm-feed-filter-chip-bar-renderer .ytp-btn {margin-right: 12px; padding: 0.4em;}
 body:has(#secondary ytd-playlist-panel-renderer[ytp-random]) .ytp-prev-button.ytp-button, body:has(#secondary ytd-playlist-panel-renderer[ytp-random]) .ytp-next-button.ytp-button:not([ytp-random="applied"]) {display: none !important;}
 #secondary ytd-playlist-panel-renderer[ytp-random] ytd-menu-renderer.ytd-playlist-panel-renderer {height: 1em; visibility: hidden;}
 #secondary ytd-playlist-panel-renderer[ytp-random]:not(:hover) ytd-playlist-panel-video-renderer {filter: blur(2em);}
 .ytp-random-notice {padding: 1em; z-index: 1000;}
 .ytp-playlist-emulator {margin-bottom: 1.6rem; border-radius: 1rem;}
 .ytp-playlist-emulator > .title {border-top-left-radius: 1rem; border-top-right-radius: 1rem; font-size: 2rem; background-color: #323232; color: white; padding: 0.8rem;}
 .ytp-playlist-emulator > .information {font-size: 1rem; background-color: #2b2a2a; color: white; padding: 0.8rem;}
 .ytp-playlist-emulator > .footer {border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; background-color: #323232; padding: 0.8rem;}
 .ytp-playlist-emulator > .items {max-height: 500px; overflow-y: auto; overflow-x: hidden;}
 .ytp-playlist-emulator:not([data-failed]) > .items:empty::before {content: 'Loading playlist...'; background-color: #626262; padding: 0.8rem; color: white; font-size: 2rem; display: block;}
 .ytp-playlist-emulator[data-failed="rejected"] > .items:empty::before {content: "Make sure to allow the external API call to ytplaylist.robert.wesner.io to keep viewing playlists that YouTube doesn't natively support!"; background-color: #491818; padding: 0.8rem; color: #ff7c7c; font-size: 1rem; display: block;}
 .ytp-playlist-emulator > .items > .item {background-color: #2c2c2c; padding: 0.8rem; border: 1px solid #1b1b1b; font-size: 1.6rem; color: white; min-height: 5rem; cursor: pointer;}
 .ytp-playlist-emulator > .items > .item:hover {background-color: #505050;}
 .ytp-playlist-emulator > .items > .item:not(:last-of-type) {border-bottom: 0;}
 .ytp-playlist-emulator > .items > .item[data-current] {background-color: #767676;}
 body:has(.ytp-playlist-emulator) .ytp-prev-button.ytp-button, body:has(.ytp-playlist-emulator) .ytp-next-button.ytp-button:not([ytp-emulation="applied"]) {display: none !important;}
 ytm-feed-filter-chip-bar-renderer > div :nth-child(3).selected ~ .ytp-btn:not(.ytp-unsupported), ytd-feed-filter-chip-bar-renderer iron-selector#chips :nth-child(3).iron-selected ~ .ytp-btn:not(.ytp-unsupported) {display: none;}
 </style>`);
 const getVideoId = url => {
 try {
 return new URLSearchParams(new URL(url).search).get('v');
 } catch {
 return null;
 }
 };
 const queryHTMLElement = selector => {
 const el = document.querySelector(selector);
 return el instanceof HTMLElement ? el : null;
 };
 const getPlayer = () => ($('#movie_player'));
 const isAdPlaying = () => !!document.querySelector('.ad-interrupting');
 const redirect = (v, list, ytpRandom = null) => {
 if (location.host === 'm.youtube.com') {
 const url = `/watch?v=${v}&list=${list}${ytpRandom !== null ? `&ytp-random=${ytpRandom}` : ''}`;
 window.location.href = url;
 } else {
 try {
 const playlistPanel = $('ytd-playlist-panel-renderer #items');
 if (playlistPanel) {
 const redirector = document.createElement('a');
 redirector.className = 'yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer';
 redirector.setAttribute('hidden', '');
 redirector.data = {
 commandMetadata: {
 webCommandMetadata: {
 url: `/watch?v=${v}&list=${list}${ytpRandom !== null ? `&ytp-random=${ytpRandom}` : ''}`,
 webPageType: 'WEB_PAGE_TYPE_WATCH',
 rootVe: 3832,
 },
 },
 watchEndpoint: {
 videoId: v,
 playlistId: list,
 },
 };
 playlistPanel.append(redirector);
 redirector.click();
 } else {
 const url = `/watch?v=${v}&list=${list}${ytpRandom !== null ? `&ytp-random=${ytpRandom}` : ''}`;
 window.location.href = url;
 }
 } catch {
 const url = `/watch?v=${v}&list=${list}${ytpRandom !== null ? `&ytp-random=${ytpRandom}` : ''}`;
 window.location.href = url;
 }
 }
 };
 let id = '';
 const apply = () => {
 if (id === '') {
 console.warn('[Play All] Channel ID not yet determined');
 return;
 }
 let parent =
 location.host === 'm.youtube.com'
 ?
 queryHTMLElement(
 'ytm-feed-filter-chip-bar-renderer .chip-bar-contents, ytm-feed-filter-chip-bar-renderer > div'
 )
 :
 queryHTMLElement('ytd-feed-filter-chip-bar-renderer iron-selector#chips');
 if (parent === null) {
 const grid = queryHTMLElement('ytd-rich-grid-renderer, ytm-rich-grid-renderer');
 if (!grid) {
 try {
 const sel = 'ytd-rich-grid-renderer, ytm-rich-grid-renderer';
 window.YouTubeUtils && YouTubeUtils.logger && YouTubeUtils.logger.debug
 ? YouTubeUtils.logger.debug('[Play All] Grid container not found', sel)
 : console.warn('[Play All] Grid container not found', sel);
 } catch {}
 return;
 }
 let existingContainer = grid.querySelector('.ytp-button-container');
 if (!existingContainer) {
 grid.insertAdjacentHTML('afterbegin', '<div class="ytp-button-container"></div>');
 existingContainer = grid.querySelector('.ytp-button-container');
 }
 parent = existingContainer instanceof HTMLElement ? existingContainer : null;
 }
 if (!parent) {
 console.warn('[Play All] Could not find parent container');
 return;
 }
 if (parent.querySelector('.ytp-play-all-btn, .ytp-random-btn')) {
 try {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[Play All] Buttons already exist, skipping');
 } catch {}
 return;
 }
 const [allPlaylist, popularPlaylist] = window.location.pathname.endsWith('/videos')
 ?
 ['UULF', 'UULP']
 :
 window.location.pathname.endsWith('/shorts')
 ? ['UUSH', 'UUPS']
 :
 ['UULV', 'UUPV'];
 const playlistSuffix = id.startsWith('UC') ? id.substring(2) : id;
 if (parent.querySelector(':nth-child(2).selected, :nth-child(2).iron-selected')) {
 parent.insertAdjacentHTML(
 'beforeend',
 `<a class="ytp-btn ytp-play-all-btn" href="/playlist?list=${popularPlaylist}${playlistSuffix}&playnext=1">Play Popular</a>`
 );
 } else if (parent.querySelector(':nth-child(1).selected, :nth-child(1).iron-selected')) {
 parent.insertAdjacentHTML(
 'beforeend',
 `<a class="ytp-btn ytp-play-all-btn" href="/playlist?list=${allPlaylist}${playlistSuffix}&playnext=1">Play All</a>`
 );
 } else {
 parent.insertAdjacentHTML(
 'beforeend',
 `<a class="ytp-btn ytp-play-all-btn ytp-unsupported" href="https://github.com/RobertWesner/YouTube-Play-All/issues/39" target="_blank">No Playlist Found</a>`
 );
 }
 const navigate = href => {
 window.location.assign(href);
 };
 if (location.host === 'm.youtube.com') {
 parent.querySelectorAll('.ytp-btn').forEach(btn => {
 btn.addEventListener('click', event => {
 event.preventDefault();
 navigate(btn.href);
 });
 });
 } else {
 const attachNavigationHandler = elements => {
 elements.forEach(btn => {
 btn.addEventListener('click', event => {
 event.preventDefault();
 event.stopPropagation();
 navigate(btn.href);
 });
 });
 };
 attachNavigationHandler(parent.querySelectorAll('.ytp-play-all-btn:not(.ytp-unsupported)'));
 parent.insertAdjacentHTML(
 'beforeend',
 `
 <span class="ytp-btn ytp-random-btn ytp-btn-sections">
 <a class="ytp-btn-section" href="/playlist?list=${allPlaylist}${playlistSuffix}&playnext=1&ytp-random=random&ytp-random-initial=1">
 Play Random
 </a><!--
 --><span class="ytp-btn-section ytp-random-more-options-btn ytp-hover-popover">
 &#x25BE
 </span>
 </span>
 `
 );
 document.querySelectorAll('.ytp-random-popover').forEach(popover => popover.remove());
 document.body.insertAdjacentHTML(
 'beforeend',
 `
 <div class="ytp-random-popover" hidden="">
 <a href="/playlist?list=${allPlaylist}${playlistSuffix}&playnext=1&ytp-random=prefer-newest">
 Prefer newest
 </a>
 <a href="/playlist?list=${allPlaylist}${playlistSuffix}&playnext=1&ytp-random=prefer-oldest&ytp-random-initial=1">
 Prefer oldest
 </a>
 </div>
 `
 );
 attachNavigationHandler(parent.querySelectorAll('.ytp-random-btn a'));
 const randomPopover = document.querySelector('.ytp-random-popover');
 if (randomPopover) {
 attachNavigationHandler(randomPopover.querySelectorAll('a'));
 }
 const randomMoreOptionsBtn = document.querySelector('.ytp-random-more-options-btn');
 if (randomMoreOptionsBtn && randomPopover) {
 randomMoreOptionsBtn.addEventListener('click', () => {
 const rect = randomMoreOptionsBtn.getBoundingClientRect();
 randomPopover.style.top = `${rect.bottom}px`;
 randomPopover.style.left = `${rect.right}px`;
 randomPopover.removeAttribute('hidden');
 });
 randomPopover.addEventListener('mouseleave', () => {
 randomPopover.setAttribute('hidden', '');
 });
 }
 }
 };
 const observer = new MutationObserver(() => {
 removeButton();
 apply();
 });
 const addButton = async () => {
 observer.disconnect();
 if (
 !(
 window.location.pathname.endsWith('/videos') ||
 window.location.pathname.endsWith('/shorts') ||
 window.location.pathname.endsWith('/streams')
 )
 ) {
 return;
 }
 const element = document.querySelector(
 'ytd-rich-grid-renderer, ytm-feed-filter-chip-bar-renderer .iron-selected, ytm-feed-filter-chip-bar-renderer .chip-bar-contents .selected'
 );
 if (element) {
 observer.observe(element, {
 attributes: true,
 childList: false,
 subtree: false,
 });
 }
 if (document.querySelector('.ytp-play-all-btn')) {
 return;
 }
 try {
 const canonical = document.querySelector('link[rel="canonical"]');
 if (canonical && canonical.href) {
 const match = canonical.href.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
 if (match && match[1]) {
 id = match[1];
 apply();
 return;
 }
 const handleMatch = canonical.href.match(/\/@([^\/]+)/);
 if (handleMatch) {
 const pageData = document.querySelector('ytd-browse[page-subtype="channels"]');
 if (pageData) {
 const channelId = pageData.getAttribute('channel-id');
 if (channelId && channelId.startsWith('UC')) {
 id = channelId;
 apply();
 return;
 }
 }
 }
 }
 } catch (e) {
 console.warn('[Play All] Error extracting channel ID from canonical:', e);
 }
 try {
 const html = await (await fetch(location.href)).text();
 const canonicalMatch = html.match(
 /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})"/
 );
 if (canonicalMatch && canonicalMatch[1]) {
 id = canonicalMatch[1];
 } else {
 const channelIdMatch = html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/);
 if (channelIdMatch && channelIdMatch[1]) {
 id = channelIdMatch[1];
 }
 }
 if (id) {
 apply();
 } else {
 console.warn('[Play All] Could not extract channel ID');
 }
 } catch (e) {
 console.error('[Play All] Error fetching channel data:', e);
 }
 };
 const removeButton = () =>
 document.querySelectorAll('.ytp-btn').forEach(element => element.remove());
 if (location.host === 'm.youtube.com') {
 setInterval(addButton, 1000);
 } else {
 window.addEventListener('yt-navigate-start', removeButton);
 window.addEventListener('yt-navigate-finish', addButton);
 try {
 setTimeout(addButton, 300);
 } catch {}
 }
 (() => {
 const getItems = playlist => {
 return new Promise(resolve => {
 const payload = {
 uri: `https://www.youtube.com/playlist?list=${playlist}`,
 requestType: `ytp ${gmInfo?.script?.version ?? 'unknown'}`,
 };
 const markFailure = () => {
 const emulator = $('.ytp-playlist-emulator');
 if (emulator instanceof HTMLElement) {
 emulator.setAttribute('data-failed', 'rejected');
 }
 };
 const handleSuccess = data => {
 resolve(data);
 };
 const handleError = () => {
 markFailure();
 resolve({ status: 'error', items: [] });
 };
 if (gmApi && typeof gmApi.xmlHttpRequest === 'function') {
 gmApi.xmlHttpRequest({
 method: 'POST',
 url: 'https://ytplaylist.robert.wesner.io/api/list',
 data: JSON.stringify(payload),
 headers: {
 'Content-Type': 'application/json',
 },
 onload: response => {
 try {
 handleSuccess(JSON.parse(response.responseText));
 } catch (parseError) {
 console.error('[Play All] Failed to parse playlist response:', parseError);
 handleError();
 }
 },
 onerror: _error => {
 handleError();
 },
 });
 return;
 }
 fetch('https://ytplaylist.robert.wesner.io/api/list', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify(payload),
 })
 .then(resp => resp.json())
 .then(handleSuccess)
 .catch(err => {
 console.error('[Play All] Playlist fetch failed:', err);
 handleError();
 });
 });
 };
 const processItems = items => {
 const itemsContainer = $('.ytp-playlist-emulator .items');
 const params = new URLSearchParams(window.location.search);
 const list = params.get('list');
 if (!(itemsContainer instanceof HTMLElement)) {
 return;
 }
 items.forEach(
 item => {
 const element = document.createElement('div');
 element.className = 'item';
 element.textContent = item.title;
 element.setAttribute('data-id', item.videoId);
 element.addEventListener('click', () => redirect(item.videoId, list));
 itemsContainer.append(element);
 }
 );
 markCurrentItem(params.get('v'));
 };
 const playNextEmulationItem = () => {
 $(`.ytp-playlist-emulator .items .item[data-current] + .item`)?.click();
 };
 const markCurrentItem = videoId => {
 const existing = $(`.ytp-playlist-emulator .items .item[data-current]`);
 if (existing) {
 existing.removeAttribute('data-current');
 }
 const current = document.querySelector(
 `.ytp-playlist-emulator .items .item[data-id="${videoId}"]`
 );
 if (current instanceof HTMLElement) {
 current.setAttribute('data-current', '');
 const parentElement = current.parentElement;
 if (parentElement instanceof HTMLElement) {
 const docElement = (document.documentElement);
 const fontSize = parseFloat(getComputedStyle(docElement).fontSize || '16');
 parentElement.scrollTop = current.offsetTop - 12 * fontSize;
 }
 }
 };
 const emulatePlaylist = () => {
 if (!window.location.pathname.endsWith('/watch')) {
 return;
 }
 const params = new URLSearchParams(window.location.search);
 const list = params.get('list');
 if (!list) {
 return;
 }
 if (params.has('ytp-random')) {
 return;
 }
 if (list.startsWith('TLPQ')) {
 return;
 }
 if (list.length <= 4) {
 return;
 }
 const existingEmulator = $('.ytp-playlist-emulator');
 if (existingEmulator) {
 if (list === existingEmulator.getAttribute('data-list')) {
 markCurrentItem(params.get('v'));
 return;
 } else {
 window.location.reload();
 }
 }
 if (!new URLSearchParams(window.location.search).has('list')) {
 return;
 }
 if (
 !document.querySelector(
 '#secondary-inner > ytd-playlist-panel-renderer#playlist #items:empty'
 )
 ) {
 return;
 }
 const playlistEmulator = document.createElement('div');
 playlistEmulator.className = 'ytp-playlist-emulator';
 playlistEmulator.innerHTML = `
 <div class="title">
 Playlist emulator
 </div>
 <div class="information">
 It looks like YouTube is unable to handle this large playlist.
 Playlist emulation is a <b>limited</b> fallback feature of ytp to enable you to watch even more content. <br>
 </div>
 <div class="items"></div>
 <div class="footer"></div>
 `;
 playlistEmulator.setAttribute('data-list', list);
 const playlistHost = document.querySelector(
 '#secondary-inner > ytd-playlist-panel-renderer#playlist'
 );
 if (playlistHost instanceof HTMLElement) {
 playlistHost.insertAdjacentElement('afterend', (playlistEmulator));
 }
 getItems(list).then(response => {
 if (response?.status === 'running') {
 setTimeout(
 () =>
 getItems(list).then(nextResponse => {
 if (nextResponse && Array.isArray(nextResponse.items)) {
 processItems(nextResponse.items);
 }
 }),
 5000
 );
 return;
 }
 if (response && Array.isArray(response.items)) {
 processItems(response.items);
 }
 });
 const nextButtonInterval = setInterval(() => {
 const nextButton = document.querySelector(
 '#ytd-player .ytp-next-button.ytp-button:not([ytp-emulation="applied"])'
 );
 if (nextButton) {
 clearInterval(nextButtonInterval);
 const newButton = document.createElement('span');
 newButton.className = nextButton.className;
 newButton.innerHTML = nextButton.innerHTML;
 nextButton.replaceWith(newButton);
 newButton.setAttribute('ytp-emulation', 'applied');
 newButton.addEventListener('click', () => playNextEmulationItem());
 }
 }, 1000);
 document.addEventListener(
 'keydown',
 event => {
 if (event.shiftKey && event.key.toLowerCase() === 'n') {
 event.stopImmediatePropagation();
 event.preventDefault();
 playNextEmulationItem();
 }
 },
 true
 );
 setInterval(() => {
 const player = getPlayer();
 if (!player || typeof player.getProgressState !== 'function') {
 return;
 }
 const progressState = player.getProgressState();
 if (!progressState) {
 return;
 }
 if (!isAdPlaying()) {
 if (
 typeof progressState.current === 'number' &&
 typeof progressState.duration === 'number' &&
 progressState.current >= progressState.duration - 2
 ) {
 if (typeof player.pauseVideo === 'function') player.pauseVideo();
 if (typeof player.seekTo === 'function') player.seekTo(0);
 playNextEmulationItem();
 }
 }
 }, 500);
 };
 if (location.host === 'm.youtube.com') {
 try {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.info &&
 YouTubeUtils.logger.info('[Play All] Mobile playlist emulation not yet supported');
 } catch {}
 } else {
 window.addEventListener('yt-navigate-finish', () => setTimeout(emulatePlaylist, 1000));
 }
 })();
 (() => {
 if (location.host === 'm.youtube.com') {
 return;
 }
 const urlParams = new URLSearchParams(window.location.search);
 if (!urlParams.has('ytp-random') || urlParams.get('ytp-random') === '0') {
 return;
 }
 const ytpRandomParam = urlParams.get('ytp-random');
 const ytpRandom =
 ytpRandomParam === 'prefer-newest' || ytpRandomParam === 'prefer-oldest'
 ? ytpRandomParam
 : 'random';
 const getStorageKey = () => `ytp-random-${urlParams.get('list')}`;
 const getStorage = () => JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
 const isWatched = videoId => getStorage()[videoId] || false;
 const markWatched = videoId => {
 localStorage.setItem(getStorageKey(), JSON.stringify({ ...getStorage(), [videoId]: true }));
 document
 .querySelectorAll('#wc-endpoint[href*=zsA3X40nz9w]')
 .forEach(element => element.parentElement.setAttribute('hidden', ''));
 };
 try {
 if (Array.isArray(getStorage())) {
 localStorage.removeItem(getStorageKey());
 }
 } catch {
 localStorage.removeItem(getStorageKey());
 }
 const playNextRandom = (reload = false) => {
 const playerInstance = getPlayer();
 if (playerInstance && typeof playerInstance.pauseVideo === 'function') {
 playerInstance.pauseVideo();
 }
 const videos = Object.entries(getStorage()).filter(([_, watched]) => !watched);
 const params = new URLSearchParams(window.location.search);
 if (videos.length === 0) {
 return;
 }
 const preferredCount = Math.max(1, Math.min(Math.floor(videos.length * 0.2), 20));
 let videoIndex;
 switch (ytpRandom) {
 case 'prefer-newest':
 videoIndex = Math.floor(Math.random() * preferredCount);
 break;
 case 'prefer-oldest':
 videoIndex = videos.length - preferredCount + Math.floor(Math.random() * preferredCount);
 break;
 default:
 videoIndex = Math.floor(Math.random() * videos.length);
 }
 if (videoIndex < 0) videoIndex = 0;
 if (videoIndex >= videos.length) videoIndex = videos.length - 1;
 if (reload) {
 params.set('v', videos[videoIndex][0]);
 params.set('ytp-random', ytpRandom);
 params.delete('t');
 params.delete('index');
 params.delete('ytp-random-initial');
 window.location.href = `${window.location.pathname}?${params.toString()}`;
 } else {
 try {
 redirect(videos[videoIndex][0], params.get('list'), ytpRandom);
 } catch (error) {
 console.error(
 '[Play All] Error using redirect(), falling back to manual redirect:',
 error
 );
 const redirector = document.createElement('a');
 redirector.className = 'yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer';
 redirector.setAttribute('hidden', '');
 redirector.data = {
 commandMetadata: {
 webCommandMetadata: {
 url: `/watch?v=${videos[videoIndex][0]}&list=${params.get('list')}&ytp-random=${ytpRandom}`,
 webPageType: 'WEB_PAGE_TYPE_WATCH',
 rootVe: 3832,
 },
 },
 watchEndpoint: {
 videoId: videos[videoIndex][0],
 playlistId: params.get('list'),
 },
 };
 const listContainer = $('ytd-playlist-panel-renderer #items');
 if (listContainer instanceof HTMLElement) {
 listContainer.append(redirector);
 } else {
 document.body.appendChild(redirector);
 }
 redirector.click();
 }
 }
 };
 let isIntervalSet = false;
 const applyRandomPlay = () => {
 if (!window.location.pathname.endsWith('/watch')) {
 return;
 }
 const playlistContainer = $('#secondary ytd-playlist-panel-renderer');
 if (playlistContainer === null) {
 return;
 }
 if (playlistContainer.hasAttribute('ytp-random')) {
 return;
 }
 playlistContainer.setAttribute('ytp-random', 'applied');
 const headerContainer = playlistContainer.querySelector('.header');
 if (headerContainer) {
 headerContainer.insertAdjacentHTML(
 'afterend',
 `
 <div class="ytp-random-notice">
 This playlist is using random play.<br>
 The videos will <strong>not be played in the order</strong> listed here.
 </div>
 `
 );
 }
 const storage = getStorage();
 const anchorSelectors = [
 '#wc-endpoint',
 'ytd-playlist-panel-video-renderer a#wc-endpoint',
 'ytd-playlist-panel-video-renderer a',
 'a#video-title',
 '#secondary ytd-playlist-panel-renderer a[href*="/watch?"]',
 ];
 const anchors = [];
 anchorSelectors.forEach(sel => {
 playlistContainer.querySelectorAll(sel).forEach(a => {
 if (a instanceof Element && a.tagName === 'A') anchors.push( (a));
 });
 });
 const uniq = [];
 const seen = new Set();
 anchors.forEach(a => {
 const href = a.href || a.getAttribute('href') || '';
 if (!seen.has(href)) {
 seen.add(href);
 uniq.push(a);
 }
 });
 const navigate = href => (window.location.href = href);
 uniq.forEach(element => {
 let videoId = null;
 try {
 videoId = new URL(element.href, window.location.origin).searchParams.get('v');
 } catch {
 videoId = new URLSearchParams(element.search || '').get('v');
 }
 if (!videoId) return;
 if (!isWatched(videoId)) {
 storage[videoId] = false;
 }
 try {
 const u = new URL(element.href, window.location.origin);
 u.searchParams.set('ytp-random', ytpRandom);
 element.href = u.toString();
 } catch {}
 element.addEventListener('click', event => {
 event.preventDefault();
 navigate(element.href);
 });
 const entryKey = getVideoId(element.href);
 if (isWatched(entryKey)) {
 element.parentElement?.setAttribute('hidden', '');
 }
 });
 localStorage.setItem(getStorageKey(), JSON.stringify(storage));
 if (urlParams.get('ytp-random-initial') === '1' || isWatched(getVideoId(location.href))) {
 playNextRandom();
 return;
 }
 const header = playlistContainer.querySelector('h3 a');
 if (header && header.tagName === 'A') {
 const anchorHeader = ( (header));
 anchorHeader.innerHTML += ` <span class="ytp-badge ytp-random-badge">${ytpRandom} <span style="font-size: 2rem; vertical-align: top">&times;</span></span>`;
 anchorHeader.href = '#';
 const badge = anchorHeader.querySelector('.ytp-random-badge');
 if (badge) {
 badge.addEventListener('click', event => {
 event.preventDefault();
 localStorage.removeItem(getStorageKey());
 const params = new URLSearchParams(location.search);
 params.delete('ytp-random');
 window.location.href = `${window.location.pathname}?${params.toString()}`;
 });
 }
 }
 document.addEventListener(
 'keydown',
 event => {
 if (event.shiftKey && event.key.toLowerCase() === 'n') {
 event.stopImmediatePropagation();
 event.preventDefault();
 const videoId = getVideoId(location.href);
 markWatched(videoId);
 playNextRandom(true);
 }
 },
 true
 );
 if (isIntervalSet) {
 return;
 }
 isIntervalSet = true;
 setInterval(() => {
 const videoId = getVideoId(location.href);
 const params = new URLSearchParams(location.search);
 params.set('ytp-random', ytpRandom);
 window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
 const player = getPlayer();
 if (!player || typeof player.getProgressState !== 'function') {
 return;
 }
 const progressState = player.getProgressState();
 if (
 !progressState ||
 typeof progressState.current !== 'number' ||
 typeof progressState.duration !== 'number'
 ) {
 return;
 }
 if (!isAdPlaying()) {
 if (progressState.current / progressState.duration >= 0.9) {
 if (videoId) markWatched(videoId);
 }
 if (progressState.current >= progressState.duration - 2) {
 if (typeof player.pauseVideo === 'function') player.pauseVideo();
 if (typeof player.seekTo === 'function') player.seekTo(0);
 playNextRandom();
 }
 }
 const nextButton = document.querySelector(
 '#ytd-player .ytp-next-button.ytp-button:not([ytp-random="applied"])'
 );
 if (nextButton instanceof HTMLElement) {
 const newButton = document.createElement('span');
 newButton.className = nextButton.className;
 newButton.innerHTML = nextButton.innerHTML;
 nextButton.replaceWith(newButton);
 newButton.setAttribute('ytp-random', 'applied');
 newButton.addEventListener('click', () => {
 if (videoId) markWatched(videoId);
 playNextRandom();
 });
 }
 }, 1000);
 };
 setInterval(applyRandomPlay, 1000);
 })();
})().catch(error =>
 console.error(
 '%cytp - YouTube Play All\n',
 'color: #bf4bcc; font-size: 32px; font-weight: bold',
 error
 )
);
const ZOOM_PAN_STORAGE_KEY = 'ytp_zoom_pan';
const RESTORE_LOG_KEY = 'ytp_zoom_restore_log';
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.05;
const FULLSCREEN_APPLY_DELAY = 80;
const FULLSCREEN_APPLY_RETRIES = 4;
const FULLSCREEN_APPLY_RETRY_DELAY = 120;
function readZoomPan() {
 try {
 const raw = localStorage.getItem(ZOOM_PAN_STORAGE_KEY);
 if (!raw) return { zoom: DEFAULT_ZOOM, panX: 0, panY: 0 };
 const obj = JSON.parse(raw);
 const zoom = Number(obj && obj.zoom) || DEFAULT_ZOOM;
 const panX = Number(obj && obj.panX) || 0;
 const panY = Number(obj && obj.panY) || 0;
 return { zoom, panX, panY };
 } catch {
 return { zoom: DEFAULT_ZOOM, panX: 0, panY: 0 };
 }
}
function saveZoomPan(zoom, panX, panY) {
 try {
 const obj = {
 zoom: Number(zoom) || DEFAULT_ZOOM,
 panX: Number(panX) || 0,
 panY: Number(panY) || 0,
 };
 localStorage.setItem(ZOOM_PAN_STORAGE_KEY, JSON.stringify(obj));
 } catch {}
}
function logRestoreEvent(evt) {
 try {
 const entry = Object.assign({ time: new Date().toISOString() }, evt);
 try {
 const raw = sessionStorage.getItem(RESTORE_LOG_KEY);
 const arr = raw ? JSON.parse(raw) : [];
 arr.push(entry);
 if (arr.length > 200) arr.splice(0, arr.length - 200);
 sessionStorage.setItem(RESTORE_LOG_KEY, JSON.stringify(arr));
 } catch {
 }
 console.warn('[YouTube+] Zoom restore:', entry);
 } catch {}
}
const findVideoElement = () => {
 const selectors = ['#movie_player video', 'video.video-stream', 'video'];
 for (const s of selectors) {
 const v = document.querySelector(s);
 if (v && v.tagName === 'VIDEO') return (v);
 }
 return null;
};
let _lastTransformApplied = '';
let _isApplyingTransform = false;
const applyZoomToVideo = (
 videoEl,
 zoom,
 panX = 0,
 panY = 0,
 skipTransformTracking = false,
 skipTransition = false
) => {
 if (!videoEl) return;
 const container = videoEl.parentElement || videoEl;
 try {
 if (!skipTransformTracking) {
 _isApplyingTransform = true;
 }
 container.style.overflow = 'visible';
 if (!container.style.position || container.style.position === 'static') {
 container.style.position = 'relative';
 }
 videoEl.style.transformOrigin = 'center center';
 const transformStr = `translate(${panX.toFixed(2)}px, ${panY.toFixed(2)}px) scale(${zoom.toFixed(3)})`;
 videoEl.style.transform = transformStr;
 if (!skipTransformTracking) {
 _lastTransformApplied = transformStr;
 }
 videoEl.style.willChange = zoom !== 1 ? 'transform' : 'auto';
 videoEl.style.transition = skipTransition ? 'none' : 'transform .08s ease-out';
 if (!skipTransformTracking) {
 setTimeout(() => {
 _isApplyingTransform = false;
 }, 100);
 }
 } catch (e) {
 console.error('[YouTube+] applyZoomToVideo error:', e);
 _isApplyingTransform = false;
 }
};
function createZoomUI() {
 const player = document.querySelector('#movie_player');
 if (!player) return null;
 if (document.getElementById('ytp-zoom-control')) {
 return document.getElementById('ytp-zoom-control');
 }
 if (!byId('ytp-zoom-styles')) {
 const s = document.createElement('style');
 s.id = 'ytp-zoom-styles';
 s.textContent = `
 #ytp-zoom-control{position: absolute; left: 12px; bottom: 64px; z-index: 2200; display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 24px; background: rgba(0,0,0,0.35); color: #fff; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); backdrop-filter: blur(6px);}
 #ytp-zoom-control input[type=range]{width: 120px; -webkit-appearance: none; background: transparent; height: 24px;}
 #ytp-zoom-control input[type=range]::-webkit-slider-runnable-track{height: 4px; background: rgba(255,255,255,0.12); border-radius: 3px;}
 #ytp-zoom-control input[type=range]::-webkit-slider-thumb{-webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 6px rgba(255,255,255,0.06); margin-top: -4px;}
 #ytp-zoom-control input[type=range]::-moz-range-track{height: 4px; background: rgba(255,255,255,0.12); border-radius: 3px;}
 #ytp-zoom-control input[type=range]::-moz-range-thumb{width: 12px; height: 12px; border-radius: 50%; background: #fff; border: none;}
 #ytp-zoom-control .zoom-label{min-width:36px;text-align:center;font-size:11px;padding:0 6px;user-select:none}
 #ytp-zoom-control::after{content:'Shift + Wheel to zoom';position:absolute;bottom:100%;right:0;padding:4px 8px;background:rgba(0,0,0,0.8);color:#fff;font-size:10px;border-radius:4px;white-space:nowrap;opacity:0;pointer-events:none;transform:translateY(4px);transition:opacity .2s,transform .2s}
 #ytp-zoom-control:hover::after{opacity:1;transform:translateY(-4px)}
 #ytp-zoom-control .zoom-reset{background: rgba(255,255,255,0.06); border: none; color: inherit; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; width: 28px; height: 28px;}
 #ytp-zoom-control .zoom-reset:hover{background: rgba(255,255,255,0.12)}
 #ytp-zoom-control .zoom-reset svg{display:block;width:14px;height:14px}
 #ytp-zoom-control.ytp-hidden{opacity:0;transform:translateY(6px);pointer-events:none}
 #ytp-zoom-control{transition:opacity .18s ease, transform .18s ease}
 `;
 (document.head || document.documentElement).appendChild(s);
 }
 const wrap = document.createElement('div');
 wrap.id = 'ytp-zoom-control';
 const input = document.createElement('input');
 input.type = 'range';
 input.min = String(MIN_ZOOM);
 input.max = String(MAX_ZOOM);
 input.step = String(ZOOM_STEP);
 const label = document.createElement('div');
 label.className = 'zoom-label';
 label.setAttribute('role', 'status');
 label.setAttribute('aria-live', 'polite');
 label.setAttribute('aria-label', 'Current zoom level');
 const reset = document.createElement('button');
 reset.className = 'zoom-reset';
 reset.type = 'button';
 reset.setAttribute('aria-label', 'Reset zoom');
 reset.title = 'Reset zoom';
 reset.innerHTML = `
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
 <path d="M12 4V1l-5 5 5 5V7a7 7 0 1 1-7 7" stroke="currentColor" stroke-width="2" fill="none"/>
 </svg>
 `;
 wrap.appendChild(input);
 wrap.appendChild(label);
 wrap.appendChild(reset);
 let video = findVideoElement();
 const stored = readZoomPan().zoom;
 const initZoomVal = Number.isFinite(stored) && !Number.isNaN(stored) ? stored : DEFAULT_ZOOM;
 const setZoom = z => {
 const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(z)));
 input.value = String(clamped);
 const percentage = Math.round(clamped * 100);
 label.textContent = `${percentage}%`;
 label.setAttribute('aria-label', `Current zoom level ${percentage} percent`);
 if (video) {
 clampPan(clamped);
 requestAnimationFrame(() => {
 try {
 applyZoomToVideo(video, clamped, panX, panY);
 try {
 video.style.cursor = clamped > 1 ? 'grab' : '';
 } catch {}
 } catch (err) {
 console.error('[YouTube+] Apply zoom error:', err);
 }
 });
 }
 try {
 saveZoomPan(clamped, panX, panY);
 } catch (err) {
 console.error('[YouTube+] Save zoom error:', err);
 }
 };
 input.addEventListener('input', e => setZoom(e.target.value));
 reset.addEventListener('click', () => {
 try {
 panX = 0;
 panY = 0;
 setZoom(DEFAULT_ZOOM);
 try {
 saveZoomPan(DEFAULT_ZOOM, 0, 0);
 } catch {}
 reset.style.transform = 'scale(0.9)';
 setTimeout(() => {
 reset.style.transform = '';
 }, 150);
 } catch (err) {
 console.error('[YouTube+] Reset zoom error:', err);
 }
 });
 let wheelThrottleTimer = null;
 let panSaveTimer = null;
 const scheduleSavePan = () => {
 try {
 if (panSaveTimer) clearTimeout(panSaveTimer);
 panSaveTimer = setTimeout(() => {
 try {
 const currentZoom = parseFloat(input.value) || readZoomPan().zoom || DEFAULT_ZOOM;
 saveZoomPan(currentZoom, panX, panY);
 } catch (err) {
 console.error('[YouTube+] Save pan error:', err);
 }
 panSaveTimer = null;
 }, 220);
 } catch (err) {
 console.error('[YouTube+] Schedule save pan error:', err);
 }
 };
 const wheelHandler = ev => {
 try {
 if (!ev.shiftKey) return;
 ev.preventDefault();
 if (wheelThrottleTimer) return;
 wheelThrottleTimer = setTimeout(() => {
 wheelThrottleTimer = null;
 }, 50);
 const delta = ev.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
 const current = readZoomPan().zoom || DEFAULT_ZOOM;
 const newZoom = current + delta;
 if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
 setZoom(newZoom);
 }
 } catch (err) {
 console.error('[YouTube+] Wheel zoom error:', err);
 }
 };
 player.addEventListener('wheel', wheelHandler, { passive: false });
 if (video) {
 try {
 video.addEventListener('wheel', wheelHandler, { passive: false });
 } catch (err) {
 console.error('[YouTube+] Failed to attach wheel handler to video:', err);
 }
 }
 const keydownHandler = ev => {
 try {
 const active = document.activeElement;
 if (
 active &&
 (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)
 ) {
 return;
 }
 if (ev.key === '+' || ev.key === '=') {
 ev.preventDefault();
 const current = readZoomPan().zoom || DEFAULT_ZOOM;
 setZoom(Math.min(MAX_ZOOM, current + ZOOM_STEP));
 } else if (ev.key === '-') {
 ev.preventDefault();
 const current = readZoomPan().zoom || DEFAULT_ZOOM;
 setZoom(Math.max(MIN_ZOOM, current - ZOOM_STEP));
 }
 } catch {}
 };
 window.addEventListener('keydown', keydownHandler);
 let panX = 0;
 let panY = 0;
 let videoStyleObserver = null;
 let dragging = false;
 let dragStartX = 0;
 let dragStartY = 0;
 let dragStartPanX = 0;
 let dragStartPanY = 0;
 const clampPan = (zoom = readZoomPan().zoom) => {
 try {
 if (!video) return;
 const container = video.parentElement || video;
 if (!container) return;
 const containerRect = container.getBoundingClientRect();
 if (!containerRect || containerRect.width === 0 || containerRect.height === 0) return;
 const baseW = video.videoWidth || video.offsetWidth || containerRect.width;
 const baseH = video.videoHeight || video.offsetHeight || containerRect.height;
 if (!baseW || !baseH || !Number.isFinite(baseW) || !Number.isFinite(baseH)) return;
 const scaledW = baseW * zoom;
 const scaledH = baseH * zoom;
 const maxX = Math.max(0, (scaledW - containerRect.width) / 2);
 const maxY = Math.max(0, (scaledH - containerRect.height) / 2);
 if (Number.isFinite(maxX) && Number.isFinite(panX)) {
 panX = Math.max(-maxX, Math.min(maxX, panX));
 }
 if (Number.isFinite(maxY) && Number.isFinite(panY)) {
 panY = Math.max(-maxY, Math.min(maxY, panY));
 }
 } catch (err) {
 console.error('[YouTube+] Clamp pan error:', err);
 }
 };
 const pointers = new Map();
 let initialPinchDist = null;
 let pinchStartZoom = null;
 let prevTouchAction = null;
 const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
 const pointerDown = ev => {
 try {
 pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
 try {
 ev.target.setPointerCapture(ev.pointerId);
 } catch {}
 try {
 if (ev.pointerType === 'mouse' && ev.button === 0 && pointers.size <= 1 && video) {
 dragging = true;
 dragStartX = ev.clientX;
 dragStartY = ev.clientY;
 dragStartPanX = panX;
 dragStartPanY = panY;
 try {
 video.style.cursor = 'grabbing';
 } catch {}
 }
 } catch {}
 if (pointers.size === 2) {
 const pts = Array.from(pointers.values());
 initialPinchDist = getDistance(pts[0], pts[1]);
 pinchStartZoom = readZoomPan().zoom;
 prevTouchAction = player.style.touchAction;
 try {
 player.style.touchAction = 'none';
 } catch {}
 }
 } catch {}
 };
 const pointerMove = ev => {
 try {
 if (pointers.has(ev.pointerId)) pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
 if (dragging && ev.pointerType === 'mouse' && video) {
 const dx = ev.clientX - dragStartX;
 const dy = ev.clientY - dragStartY;
 panX = dragStartPanX + dx;
 panY = dragStartPanY + dy;
 clampPan();
 applyZoomToVideo(video, parseFloat(input.value) || DEFAULT_ZOOM, panX, panY);
 scheduleSavePan();
 ev.preventDefault();
 return;
 }
 if (pointers.size === 2 && initialPinchDist && pinchStartZoom != null) {
 const pts = Array.from(pointers.values());
 const dist = getDistance(pts[0], pts[1]);
 if (dist <= 0) return;
 const ratio = dist / initialPinchDist;
 const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartZoom * ratio));
 setZoom(newZoom);
 ev.preventDefault();
 }
 } catch {}
 };
 const pointerUp = ev => {
 try {
 pointers.delete(ev.pointerId);
 try {
 ev.target.releasePointerCapture(ev.pointerId);
 } catch {}
 try {
 if (dragging && ev.pointerType === 'mouse') {
 dragging = false;
 try {
 if (video) video.style.cursor = parseFloat(input.value) > 1 ? 'grab' : '';
 } catch {}
 }
 } catch {}
 if (pointers.size < 2) {
 initialPinchDist = null;
 pinchStartZoom = null;
 if (prevTouchAction != null) {
 try {
 player.style.touchAction = prevTouchAction;
 } catch {}
 prevTouchAction = null;
 }
 }
 } catch {}
 };
 player.addEventListener('pointerdown', pointerDown, { passive: true });
 player.addEventListener('pointermove', pointerMove, { passive: false });
 player.addEventListener('pointerup', pointerUp, { passive: true });
 player.addEventListener('pointercancel', pointerUp, { passive: true });
 let touchDragging = false;
 let touchDragStartX = 0;
 let touchDragStartY = 0;
 let touchDragStartPanX = 0;
 let touchDragStartPanY = 0;
 let touchInitialDist = null;
 let touchPinchStartZoom = null;
 const getTouchDistance = (t1, t2) => Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
 const touchStart = ev => {
 try {
 if (!video) return;
 if (ev.touches.length === 1) {
 const currentZoom = parseFloat(input.value) || readZoomPan().zoom || DEFAULT_ZOOM;
 if (currentZoom > 1) {
 touchDragging = true;
 touchDragStartX = ev.touches[0].clientX;
 touchDragStartY = ev.touches[0].clientY;
 touchDragStartPanX = panX;
 touchDragStartPanY = panY;
 ev.preventDefault();
 }
 } else if (ev.touches.length === 2) {
 touchInitialDist = getTouchDistance(ev.touches[0], ev.touches[1]);
 touchPinchStartZoom = parseFloat(input.value) || readZoomPan().zoom || DEFAULT_ZOOM;
 try {
 prevTouchAction = player.style.touchAction;
 player.style.touchAction = 'none';
 } catch {}
 ev.preventDefault();
 }
 } catch (e) {
 console.error('[YouTube+] touchStart error:', e);
 }
 };
 const touchMove = ev => {
 try {
 if (!video) return;
 if (ev.touches.length === 1 && touchDragging) {
 const dx = ev.touches[0].clientX - touchDragStartX;
 const dy = ev.touches[0].clientY - touchDragStartY;
 panX = touchDragStartPanX + dx;
 panY = touchDragStartPanY + dy;
 clampPan();
 applyZoomToVideo(video, parseFloat(input.value) || DEFAULT_ZOOM, panX, panY);
 scheduleSavePan();
 ev.preventDefault();
 return;
 }
 if (ev.touches.length === 2 && touchInitialDist && touchPinchStartZoom != null) {
 const dist = getTouchDistance(ev.touches[0], ev.touches[1]);
 if (dist <= 0) return;
 const ratio = dist / touchInitialDist;
 const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, touchPinchStartZoom * ratio));
 setZoom(newZoom);
 ev.preventDefault();
 }
 } catch (e) {
 console.error('[YouTube+] touchMove error:', e);
 }
 };
 const touchEnd = ev => {
 try {
 if (touchDragging && ev.touches.length === 0) {
 touchDragging = false;
 }
 if (ev.touches.length < 2) {
 touchInitialDist = null;
 touchPinchStartZoom = null;
 if (prevTouchAction != null) {
 try {
 player.style.touchAction = prevTouchAction;
 } catch {}
 prevTouchAction = null;
 }
 }
 } catch (e) {
 console.error('[YouTube+] touchEnd error:', e);
 }
 };
 try {
 player.addEventListener('touchstart', touchStart, { passive: false });
 player.addEventListener('touchmove', touchMove, { passive: false });
 player.addEventListener('touchend', touchEnd, { passive: true });
 player.addEventListener('touchcancel', touchEnd, { passive: true });
 } catch (e) {
 console.error('[YouTube+] Failed to attach touch handlers:', e);
 }
 const mouseDownHandler = ev => {
 try {
 if (ev.button !== 0 || !video) return;
 dragging = true;
 dragStartX = ev.clientX;
 dragStartY = ev.clientY;
 dragStartPanX = panX;
 dragStartPanY = panY;
 try {
 video.style.cursor = 'grabbing';
 } catch {}
 ev.preventDefault();
 } catch {}
 };
 const mouseMoveHandler = ev => {
 try {
 if (!dragging || !video) return;
 const dx = ev.clientX - dragStartX;
 const dy = ev.clientY - dragStartY;
 panX = dragStartPanX + dx;
 panY = dragStartPanY + dy;
 clampPan();
 if (!video._panRAF) {
 video._panRAF = requestAnimationFrame(() => {
 applyZoomToVideo(video, parseFloat(input.value) || DEFAULT_ZOOM, panX, panY);
 scheduleSavePan();
 video._panRAF = null;
 });
 }
 ev.preventDefault();
 } catch (err) {
 console.error('[YouTube+] Mouse move error:', err);
 }
 };
 const mouseUpHandler = _ev => {
 try {
 if (dragging) {
 dragging = false;
 try {
 if (video) video.style.cursor = parseFloat(input.value) > 1 ? 'grab' : '';
 } catch {}
 }
 } catch {}
 };
 if (video) {
 try {
 video.addEventListener('mousedown', mouseDownHandler);
 } catch {}
 try {
 window.addEventListener('mousemove', mouseMoveHandler);
 } catch {}
 try {
 window.addEventListener('mouseup', mouseUpHandler);
 } catch {}
 try {
 const attachStyleObserver = () => {
 try {
 if (videoStyleObserver) {
 try {
 videoStyleObserver.disconnect();
 } catch {}
 videoStyleObserver = null;
 }
 if (!video) return;
 videoStyleObserver = new MutationObserver(muts => {
 try {
 if (_isApplyingTransform) return;
 for (const m of muts) {
 if (m.type === 'attributes' && m.attributeName === 'style') {
 const current = (video && video.style && video.style.transform) || '';
 const expectedZoom =
 readZoomPan().zoom || parseFloat(input.value) || DEFAULT_ZOOM;
 const expected = `translate(${panX.toFixed(2)}px, ${panY.toFixed(2)}px) scale(${expectedZoom.toFixed(3)})`;
 if (
 expectedZoom !== DEFAULT_ZOOM &&
 current !== expected &&
 current !== _lastTransformApplied
 ) {
 requestAnimationFrame(() => {
 try {
 applyZoomToVideo(video, expectedZoom, panX, panY);
 try {
 logRestoreEvent({
 action: 'restore_transform',
 currentTransform: current,
 expectedTransform: expected,
 zoom: expectedZoom,
 panX,
 panY,
 });
 } catch {}
 } catch {}
 });
 }
 }
 }
 } catch {}
 });
 videoStyleObserver.observe(video, { attributes: true, attributeFilter: ['style'] });
 } catch {}
 };
 attachStyleObserver();
 } catch {}
 }
 const playerObserver = new MutationObserver(() => {
 try {
 const newVideo = findVideoElement();
 if (newVideo && newVideo !== video) {
 try {
 if (video) {
 video.removeEventListener('mousedown', mouseDownHandler);
 video.removeEventListener('wheel', wheelHandler);
 if (video._panRAF) {
 cancelAnimationFrame(video._panRAF);
 video._panRAF = null;
 }
 }
 } catch (err) {
 console.error('[YouTube+] Error detaching from old video:', err);
 }
 video = newVideo;
 try {
 if (videoStyleObserver) {
 try {
 videoStyleObserver.disconnect();
 } catch {}
 videoStyleObserver = null;
 }
 if (video) {
 videoStyleObserver = new MutationObserver(muts => {
 try {
 if (_isApplyingTransform) return;
 for (const m of muts) {
 if (m.type === 'attributes' && m.attributeName === 'style') {
 const current = (video && video.style && video.style.transform) || '';
 const expectedZoom =
 readZoomPan().zoom || parseFloat(input.value) || DEFAULT_ZOOM;
 const expected = `translate(${panX.toFixed(2)}px, ${panY.toFixed(2)}px) scale(${expectedZoom.toFixed(3)})`;
 if (
 expectedZoom !== DEFAULT_ZOOM &&
 current !== expected &&
 current !== _lastTransformApplied
 ) {
 requestAnimationFrame(() => {
 try {
 applyZoomToVideo(video, expectedZoom, panX, panY);
 try {
 logRestoreEvent({
 action: 'restore_transform',
 currentTransform: current,
 expectedTransform: expected,
 zoom: expectedZoom,
 panX,
 panY,
 });
 } catch {}
 } catch {}
 });
 }
 }
 }
 } catch {}
 });
 videoStyleObserver.observe(video, { attributes: true, attributeFilter: ['style'] });
 }
 } catch (err) {
 console.error('[YouTube+] Error attaching style observer to new video:', err);
 }
 try {
 const current = readZoomPan().zoom || DEFAULT_ZOOM;
 clampPan(current);
 applyZoomToVideo(video, current, panX, panY);
 } catch (err) {
 console.error('[YouTube+] Error applying zoom to new video:', err);
 }
 try {
 video.addEventListener('mousedown', mouseDownHandler);
 } catch (err) {
 console.error('[YouTube+] Error attaching mousedown to new video:', err);
 }
 try {
 video.addEventListener('wheel', wheelHandler, { passive: false });
 } catch (err) {
 console.error('[YouTube+] Error attaching wheel to new video:', err);
 }
 }
 } catch (err) {
 console.error('[YouTube+] Player observer error:', err);
 }
 });
 try {
 playerObserver.observe(player, { childList: true, subtree: true });
 } catch (err) {
 console.error('[YouTube+] Failed to observe player for video changes:', err);
 }
 const fullscreenHandler = () => {
 try {
 const current = readZoomPan().zoom || DEFAULT_ZOOM;
 setTimeout(() => {
 try {
 let attempts = 0;
 const tryApply = () => {
 try {
 const newVideo = findVideoElement();
 let swapped = false;
 if (newVideo && newVideo !== video) {
 try {
 if (video) video.removeEventListener('wheel', wheelHandler);
 } catch {}
 video = newVideo;
 swapped = true;
 try {
 video.addEventListener('wheel', wheelHandler, { passive: false });
 } catch {}
 }
 clampPan(current);
 if (video) applyZoomToVideo(video, current, panX, panY, false, true);
 if (!swapped && (!video || attempts < FULLSCREEN_APPLY_RETRIES)) {
 attempts += 1;
 setTimeout(tryApply, FULLSCREEN_APPLY_RETRY_DELAY);
 }
 } catch (e) {
 console.error('[YouTube+] Fullscreen apply attempt error:', e);
 }
 };
 tryApply();
 } catch (e) {
 console.error('[YouTube+] Fullscreen inner apply error:', e);
 }
 }, FULLSCREEN_APPLY_DELAY);
 } catch (err) {
 console.error('[YouTube+] Fullscreen handler error:', err);
 }
 };
 [
 'fullscreenchange',
 'webkitfullscreenchange',
 'mozfullscreenchange',
 'MSFullscreenChange',
 ].forEach(evt => document.addEventListener(evt, fullscreenHandler));
 try {
 try {
 const s = readZoomPan();
 if (Number.isFinite(s.panX)) panX = s.panX;
 if (Number.isFinite(s.panY)) panY = s.panY;
 clampPan(initZoomVal);
 } catch (err) {
 console.error('[YouTube+] Restore pan error:', err);
 }
 } catch (err) {
 console.error('[YouTube+] Initial zoom setup error:', err);
 }
 try {
 const initialTransform = `translate(${panX.toFixed(2)}px, ${panY.toFixed(2)}px) scale(${initZoomVal.toFixed(3)})`;
 _lastTransformApplied = initialTransform;
 } catch {}
 setZoom(initZoomVal);
 const updateZoomPosition = () => {
 try {
 const chrome = player.querySelector('.ytp-chrome-bottom');
 if (chrome && chrome.offsetHeight) {
 const offset = chrome.offsetHeight + 8;
 wrap.style.bottom = `${offset}px`;
 } else {
 wrap.style.bottom = '';
 }
 } catch {
 }
 };
 updateZoomPosition();
 const ro = new ResizeObserver(_entries => {
 try {
 if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
 requestAnimationFrame(() => {
 try {
 updateZoomPosition();
 } catch (e) {
 try {
 YouTubeUtils &&
 YouTubeUtils.logError &&
 YouTubeUtils.logError('Enhanced', 'updateZoomPosition failed', e);
 } catch {}
 }
 });
 } else {
 updateZoomPosition();
 }
 } catch (e) {
 try {
 YouTubeUtils &&
 YouTubeUtils.logError &&
 YouTubeUtils.logError('Enhanced', 'ResizeObserver callback error', e);
 } catch {}
 }
 });
 try {
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.registerObserver(ro);
 }
 } catch {}
 try {
 const chromeEl = player.querySelector('.ytp-chrome-bottom');
 if (chromeEl) ro.observe(chromeEl);
 } catch (e) {
 try {
 YouTubeUtils &&
 YouTubeUtils.logError &&
 YouTubeUtils.logError('Enhanced', 'Failed to observe chrome element', e);
 } catch {}
 }
 try {
 window.addEventListener('resize', updateZoomPosition);
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.registerListener(window, 'resize', updateZoomPosition);
 }
 } catch {}
 [
 'fullscreenchange',
 'webkitfullscreenchange',
 'mozfullscreenchange',
 'MSFullscreenChange',
 ].forEach(evt => {
 try {
 document.addEventListener(evt, updateZoomPosition);
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.registerListener(document, evt, updateZoomPosition);
 }
 } catch {}
 });
 player.appendChild(wrap);
 const chromeBottom = player.querySelector('.ytp-chrome-bottom');
 const isControlsHidden = () => {
 try {
 if (
 player.classList.contains('ytp-autohide') ||
 player.classList.contains('ytp-hide-controls')
 ) {
 return true;
 }
 if (chromeBottom) {
 const style = window.getComputedStyle(chromeBottom);
 if (
 style &&
 (style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none')
 ) {
 return true;
 }
 }
 } catch {}
 return false;
 };
 const updateHidden = () => {
 try {
 if (isControlsHidden()) {
 wrap.classList.add('ytp-hidden');
 } else {
 wrap.classList.remove('ytp-hidden');
 }
 } catch {}
 };
 const visObserver = new MutationObserver(() => updateHidden());
 try {
 visObserver.observe(player, { attributes: true, attributeFilter: ['class', 'style'] });
 if (chromeBottom) {
 visObserver.observe(chromeBottom, { attributes: true, attributeFilter: ['class', 'style'] });
 }
 } catch {}
 let showTimer = null;
 const mouseMoveShow = () => {
 try {
 wrap.classList.remove('ytp-hidden');
 if (showTimer) clearTimeout(showTimer);
 showTimer = setTimeout(updateHidden, 2200);
 } catch {}
 };
 player.addEventListener('mousemove', mouseMoveShow, { passive: true });
 updateHidden();
 const cleanup = () => {
 try {
 if (wheelThrottleTimer) {
 clearTimeout(wheelThrottleTimer);
 wheelThrottleTimer = null;
 }
 if (panSaveTimer) {
 clearTimeout(panSaveTimer);
 panSaveTimer = null;
 }
 if (video && video._panRAF) {
 cancelAnimationFrame(video._panRAF);
 video._panRAF = null;
 }
 player.removeEventListener('wheel', wheelHandler);
 player.removeEventListener('pointerdown', pointerDown);
 player.removeEventListener('pointermove', pointerMove);
 player.removeEventListener('pointerup', pointerUp);
 player.removeEventListener('pointercancel', pointerUp);
 player.removeEventListener('mousemove', mouseMoveShow);
 window.removeEventListener('keydown', keydownHandler);
 if (video) {
 try {
 video.removeEventListener('mousedown', mouseDownHandler);
 } catch {}
 try {
 video.removeEventListener('wheel', wheelHandler);
 } catch {}
 try {
 window.removeEventListener('mousemove', mouseMoveHandler);
 } catch {}
 try {
 window.removeEventListener('mouseup', mouseUpHandler);
 } catch {}
 try {
 video.style.cursor = '';
 video.style.transform = '';
 video.style.willChange = 'auto';
 video.style.transition = '';
 } catch {}
 }
 if (videoStyleObserver) {
 try {
 videoStyleObserver.disconnect();
 } catch {}
 videoStyleObserver = null;
 }
 if (visObserver) {
 try {
 visObserver.disconnect();
 } catch {}
 }
 try {
 if (playerObserver) playerObserver.disconnect();
 } catch {}
 try {
 document.removeEventListener('fullscreenchange', fullscreenHandler);
 } catch {}
 if (showTimer) {
 clearTimeout(showTimer);
 showTimer = null;
 }
 wrap.remove();
 } catch (err) {
 console.error('[YouTube+] Cleanup error:', err);
 }
 };
 if (window.YouTubeUtils && YouTubeUtils.cleanupManager) {
 YouTubeUtils.cleanupManager.register(cleanup);
 }
 return wrap;
}
function initZoom() {
 try {
 const ensure = () => {
 const player = document.querySelector('#movie_player');
 if (!player) return setTimeout(ensure, 400);
 createZoomUI();
 };
 ensure();
 window.addEventListener('yt-navigate-finish', () => setTimeout(() => createZoomUI(), 300));
 } catch {
 console.error('initZoom error');
 }
}
try {
 initZoom();
} catch {}
(function () {
 'use strict';
 function t(key, params = {}) {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 }
 const AdBlocker = {
 config: {
 skipInterval: 500,
 removeInterval: 1500,
 enableLogging: false,
 maxRetries: 2,
 enabled: true,
 storageKey: 'youtube_adblocker_settings',
 },
 state: {
 isYouTubeShorts: false,
 isYouTubeMusic: location.hostname === 'music.youtube.com',
 lastSkipAttempt: 0,
 retryCount: 0,
 initialized: false,
 },
 cache: {
 moviePlayer: null,
 ytdPlayer: null,
 lastCacheTime: 0,
 cacheTimeout: 10000,
 },
 selectors: {
 ads: '#player-ads,.ytp-ad-module,.ad-showing,.ytp-ad-timed-pie-countdown-container,.ytp-ad-survey-questions,ytd-ad-slot-renderer',
 elements:
 '#masthead-ad,ytd-merch-shelf-renderer,.yt-mealbar-promo-renderer,ytmusic-mealbar-promo-renderer,ytmusic-statement-banner-renderer,.ytp-featured-product,ytd-ad-slot-renderer',
 video: 'video.html5-main-video',
 removal: 'ytd-reel-video-renderer .ytd-ad-slot-renderer, ytd-ad-slot-renderer',
 },
 wrappers: [
 'ytd-rich-item-renderer',
 'ytd-grid-video-renderer',
 'ytd-compact-video-renderer',
 'ytd-rich-grid-media',
 'ytd-rich-shelf-renderer',
 'ytd-rich-grid-row',
 'ytd-video-renderer',
 'ytd-playlist-renderer',
 'ytd-reel-video-renderer',
 ],
 settings: {
 load() {
 try {
 const saved = localStorage.getItem(AdBlocker.config.storageKey);
 if (!saved) return;
 const parsed = JSON.parse(saved);
 if (typeof parsed !== 'object' || parsed === null) {
 console.warn('[AdBlocker] Invalid settings format');
 return;
 }
 if (typeof parsed.enabled === 'boolean') {
 AdBlocker.config.enabled = parsed.enabled;
 } else {
 AdBlocker.config.enabled = true;
 }
 if (typeof parsed.enableLogging === 'boolean') {
 AdBlocker.config.enableLogging = parsed.enableLogging;
 } else {
 AdBlocker.config.enableLogging = false;
 }
 } catch (error) {
 console.error('[AdBlocker] Error loading settings:', error);
 AdBlocker.config.enabled = true;
 AdBlocker.config.enableLogging = false;
 }
 },
 save() {
 try {
 const settingsToSave = {
 enabled: AdBlocker.config.enabled,
 enableLogging: AdBlocker.config.enableLogging,
 };
 localStorage.setItem(AdBlocker.config.storageKey, JSON.stringify(settingsToSave));
 } catch (error) {
 console.error('[AdBlocker] Error saving settings:', error);
 }
 },
 },
 getPlayer() {
 const now = Date.now();
 if (now - AdBlocker.cache.lastCacheTime > AdBlocker.cache.cacheTimeout) {
 AdBlocker.cache.moviePlayer = document.querySelector('#movie_player');
 AdBlocker.cache.ytdPlayer = document.querySelector('#ytd-player');
 AdBlocker.cache.lastCacheTime = now;
 }
 const playerEl = AdBlocker.cache.ytdPlayer;
 return {
 element: AdBlocker.cache.moviePlayer,
 player: playerEl?.getPlayer?.() || playerEl,
 };
 },
 skipAd() {
 if (!AdBlocker.config.enabled) return;
 const now = Date.now();
 if (now - AdBlocker.state.lastSkipAttempt < 300) return;
 AdBlocker.state.lastSkipAttempt = now;
 if (location.pathname.startsWith('/shorts/')) return;
 const adElement = document.querySelector(
 '.ad-showing, .ytp-ad-timed-pie-countdown-container'
 );
 if (!adElement) {
 AdBlocker.state.retryCount = 0;
 return;
 }
 try {
 const { player } = AdBlocker.getPlayer();
 if (!player) return;
 const video = document.querySelector(AdBlocker.selectors.video);
 if (video) video.muted = true;
 if (AdBlocker.state.isYouTubeMusic && video) {
 (video).currentTime = video.duration || 999;
 } else if (video) {
 if (!isNaN(video.duration)) {
 video.currentTime = video.duration;
 }
 const skipButton = document.querySelector(
 '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton'
 );
 if (skipButton) {
 skipButton.click();
 }
 }
 AdBlocker.state.retryCount = 0;
 } catch {
 if (AdBlocker.state.retryCount < AdBlocker.config.maxRetries) {
 AdBlocker.state.retryCount++;
 setTimeout(AdBlocker.skipAd, 800);
 }
 }
 },
 addCss() {
 if (document.querySelector('#yt-ab-styles') || !AdBlocker.config.enabled) return;
 const styles = `${AdBlocker.selectors.ads},${AdBlocker.selectors.elements}{display:none!important;}`;
 YouTubeUtils.StyleManager.add('yt-ab-styles', styles);
 },
 removeCss() {
 YouTubeUtils.StyleManager.remove('yt-ab-styles');
 },
 removeElements() {
 if (!AdBlocker.config.enabled || AdBlocker.state.isYouTubeMusic) return;
 const remove = () => {
 const elements = document.querySelectorAll(AdBlocker.selectors.removal);
 elements.forEach(el => {
 try {
 for (const w of AdBlocker.wrappers) {
 const wrap = el.closest(w);
 if (wrap) {
 wrap.remove();
 return;
 }
 }
 const reel = el.closest('ytd-reel-video-renderer');
 if (reel) {
 reel.remove();
 return;
 }
 const container =
 el.closest('ytd-ad-slot-renderer') || el.closest('.ad-container') || el;
 if (container && container.remove) container.remove();
 } catch (e) {
 if (AdBlocker.config.enableLogging) console.warn('[AdBlocker] removeElements error', e);
 }
 });
 try {
 const rowCandidates = document.querySelectorAll(
 'ytd-rich-grid-row, ytd-rich-grid-renderer, #contents > ytd-rich-item-renderer'
 );
 rowCandidates.forEach(row => {
 try {
 const visibleChildren = Array.from(row.children).filter(c => {
 if (!(c instanceof Element)) return false;
 const style = window.getComputedStyle(c);
 return (
 style &&
 style.display !== 'none' &&
 style.visibility !== 'hidden' &&
 c.offsetHeight > 0
 );
 });
 if (visibleChildren.length === 0) {
 row.remove();
 }
 } catch {
 }
 });
 } catch {
 }
 };
 if (window.requestIdleCallback) {
 requestIdleCallback(remove, { timeout: 100 });
 } else {
 setTimeout(remove, 0);
 }
 },
 addSettingsUI() {
 const section = document.querySelector('.ytp-plus-settings-section[data-section="basic"]');
 if (!section || section.querySelector('.ab-settings')) return;
 try {
 const item = document.createElement('div');
 item.className = 'ytp-plus-settings-item ab-settings';
 item.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('adBlocker')}</label>
 <div class="ytp-plus-settings-item-description">${t('adBlockerDescription')}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" ${AdBlocker.config.enabled ? 'checked' : ''}>
 `;
 section.appendChild(item);
 item.querySelector('input').addEventListener('change', e => {
 const target = (e.target);
 AdBlocker.config.enabled = target.checked;
 AdBlocker.settings.save();
 AdBlocker.config.enabled ? AdBlocker.addCss() : AdBlocker.removeCss();
 });
 } catch (error) {
 YouTubeUtils.logError('AdBlocker', 'Failed to add settings UI', error);
 }
 },
 init() {
 if (AdBlocker.state.initialized) return;
 AdBlocker.state.initialized = true;
 AdBlocker.settings.load();
 if (AdBlocker.config.enabled) {
 AdBlocker.addCss();
 AdBlocker.removeElements();
 }
 const skipInterval = setInterval(AdBlocker.skipAd, AdBlocker.config.skipInterval);
 const removeInterval = setInterval(AdBlocker.removeElements, AdBlocker.config.removeInterval);
 YouTubeUtils.cleanupManager.registerInterval(skipInterval);
 YouTubeUtils.cleanupManager.registerInterval(removeInterval);
 const handleNavigation = () => {
 AdBlocker.state.isYouTubeShorts = location.pathname.startsWith('/shorts/');
 AdBlocker.cache.lastCacheTime = 0;
 };
 const originalPushState = history.pushState;
 history.pushState = function () {
 const result = originalPushState.apply(this, arguments);
 setTimeout(handleNavigation, 50);
 return result;
 };
 const settingsObserver = new MutationObserver(_mutations => {
 for (const { addedNodes } of _mutations) {
 for (const node of addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(AdBlocker.addSettingsUI, 50);
 return;
 }
 }
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(settingsObserver);
 if (document.body) {
 settingsObserver.observe(document.body, { childList: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 settingsObserver.observe(document.body, { childList: true });
 });
 }
 try {
 const adSlotObserver = new MutationObserver(mutations => {
 for (const m of mutations) {
 for (const node of m.addedNodes) {
 if (!(node instanceof Element)) continue;
 try {
 if (
 node.matches &&
 node.matches(
 'ytd-ad-slot-renderer, ytd-reel-video-renderer, .ad-showing, .ytp-ad-module'
 )
 ) {
 AdBlocker.removeElements();
 return;
 }
 if (
 node.querySelector &&
 node.querySelector('ytd-ad-slot-renderer, .ad-showing, .ytp-ad-module')
 ) {
 AdBlocker.removeElements();
 return;
 }
 } catch (e) {
 if (AdBlocker.config.enableLogging) {
 console.warn('[AdBlocker] adSlotObserver node check', e);
 }
 }
 }
 }
 });
 if (document.body) {
 adSlotObserver.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 adSlotObserver.observe(document.body, { childList: true, subtree: true });
 });
 }
 YouTubeUtils.cleanupManager.registerObserver(adSlotObserver);
 } catch (e) {
 if (AdBlocker.config.enableLogging) {
 console.warn('[AdBlocker] Failed to create adSlotObserver', e);
 }
 }
 const clickHandler = e => {
 const target = (e.target);
 if (target.dataset?.section === 'basic') {
 setTimeout(AdBlocker.addSettingsUI, 25);
 }
 };
 YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler, {
 passive: true,
 capture: true,
 });
 if (AdBlocker.config.enabled) {
 setTimeout(AdBlocker.skipAd, 200);
 }
 },
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', AdBlocker.init, { once: true });
 } else {
 AdBlocker.init();
 }
})();
(function () {
 'use strict';
 function t(key, params = {}) {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 }
 const pipSettings = {
 enabled: true,
 shortcut: { key: 'P', shiftKey: true, altKey: false, ctrlKey: false },
 storageKey: 'youtube_pip_settings',
 };
 const PIP_SESSION_KEY = 'youtube_plus_pip_session';
 const getVideoElement = () => {
 try {
 const candidate =
 (typeof YouTubeUtils?.querySelector === 'function' &&
 YouTubeUtils.querySelector('video')) ||
 document.querySelector('video');
 if (candidate && candidate.tagName && candidate.tagName.toLowerCase() === 'video') {
 return (candidate);
 }
 return null;
 } catch (error) {
 console.error('[PiP] Error getting video element:', error);
 return null;
 }
 };
 const waitForMetadata = video => {
 if (!video) {
 return Promise.reject(new Error('[PiP] Invalid video element'));
 }
 if (video.readyState >= 1 && !video.seeking) {
 return Promise.resolve();
 }
 return new Promise((resolve, reject) => {
 let settled = false;
 const cleanup = () => {
 video.removeEventListener('loadedmetadata', onLoaded);
 video.removeEventListener('error', onError);
 if (timeoutId) {
 clearTimeout(timeoutId);
 }
 };
 const onLoaded = () => {
 if (settled) return;
 settled = true;
 cleanup();
 resolve();
 };
 const onError = () => {
 if (settled) return;
 settled = true;
 cleanup();
 reject(new Error('[PiP] Video metadata failed to load'));
 };
 let timeoutId = setTimeout(() => {
 if (settled) return;
 settled = true;
 cleanup();
 reject(new Error('[PiP] Timed out waiting for video metadata'));
 }, 3000);
 const registeredTimeout = YouTubeUtils?.cleanupManager?.registerTimeout?.(timeoutId);
 if (registeredTimeout) {
 timeoutId = registeredTimeout;
 }
 video.addEventListener('loadedmetadata', onLoaded, { once: true });
 video.addEventListener('error', onError, { once: true });
 });
 };
 const setSessionActive = isActive => {
 try {
 if (isActive) {
 sessionStorage.setItem(PIP_SESSION_KEY, 'true');
 } else {
 sessionStorage.removeItem(PIP_SESSION_KEY);
 }
 } catch {}
 };
 const wasSessionActive = () => {
 try {
 return sessionStorage.getItem(PIP_SESSION_KEY) === 'true';
 } catch {
 return false;
 }
 };
 const loadSettings = () => {
 try {
 const saved = localStorage.getItem(pipSettings.storageKey);
 if (!saved) return;
 const parsed = JSON.parse(saved);
 if (typeof parsed !== 'object' || parsed === null) {
 console.warn('[PiP] Invalid settings format');
 return;
 }
 if (typeof parsed.enabled === 'boolean') {
 pipSettings.enabled = parsed.enabled;
 }
 if (parsed.shortcut && typeof parsed.shortcut === 'object') {
 if (typeof parsed.shortcut.key === 'string' && parsed.shortcut.key.length > 0) {
 pipSettings.shortcut.key = parsed.shortcut.key;
 }
 if (typeof parsed.shortcut.shiftKey === 'boolean') {
 pipSettings.shortcut.shiftKey = parsed.shortcut.shiftKey;
 }
 if (typeof parsed.shortcut.altKey === 'boolean') {
 pipSettings.shortcut.altKey = parsed.shortcut.altKey;
 }
 if (typeof parsed.shortcut.ctrlKey === 'boolean') {
 pipSettings.shortcut.ctrlKey = parsed.shortcut.ctrlKey;
 }
 }
 } catch (e) {
 console.error('[PiP] Error loading settings:', e);
 }
 };
 const saveSettings = () => {
 try {
 const settingsToSave = {
 enabled: pipSettings.enabled,
 shortcut: pipSettings.shortcut,
 };
 localStorage.setItem(pipSettings.storageKey, JSON.stringify(settingsToSave));
 } catch (e) {
 console.error('[PiP] Error saving settings:', e);
 }
 };
 const getCurrentPiPElement = () => {
 const current = document.pictureInPictureElement;
 if (current && typeof current === 'object' && 'tagName' in current) {
 const tag = (current).tagName;
 if (typeof tag === 'string' && tag.toLowerCase() === 'video') {
 return ( (current));
 }
 }
 return null;
 };
 const togglePictureInPicture = async video => {
 if (!pipSettings.enabled || !video) return;
 try {
 const currentPiP = getCurrentPiPElement();
 if (currentPiP && currentPiP !== video) {
 await document.exitPictureInPicture();
 setSessionActive(false);
 }
 if (getCurrentPiPElement() === video) {
 await document.exitPictureInPicture();
 setSessionActive(false);
 return;
 }
 if (video.disablePictureInPicture) {
 throw new Error('Picture-in-Picture is disabled by the video element');
 }
 await waitForMetadata(video);
 await video.requestPictureInPicture();
 setSessionActive(true);
 } catch (error) {
 console.error('[YouTube+][PiP] Failed to toggle Picture-in-Picture:', error);
 }
 };
 const addPipSettingsToModal = () => {
 const advancedSection = YouTubeUtils.querySelector(
 '.ytp-plus-settings-section[data-section="advanced"]'
 );
 if (!advancedSection || YouTubeUtils.querySelector('.pip-settings-item')) return;
 if (!document.getElementById('pip-styles')) {
 const styles = `
 .pip-shortcut-editor { display: flex; align-items: center; gap: 8px; }
 .pip-shortcut-editor select, #pip-key {background: rgba(34, 34, 34, var(--yt-header-bg-opacity)); color: var(--yt-spec-text-primary); border: 1px solid var(--yt-spec-10-percent-layer); border-radius: var(--yt-radius-sm); padding: 4px;}
 `;
 YouTubeUtils.StyleManager.add('pip-styles', styles);
 }
 const enableItem = document.createElement('div');
 enableItem.className = 'ytp-plus-settings-item pip-settings-item';
 enableItem.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('pipTitle')}</label>
 <div class="ytp-plus-settings-item-description">${t('pipDescription')}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" data-setting="enablePiP" id="pip-enable-checkbox" ${pipSettings.enabled ? 'checked' : ''}>
 `;
 advancedSection.appendChild(enableItem);
 const shortcutItem = document.createElement('div');
 shortcutItem.className = 'ytp-plus-settings-item pip-shortcut-item';
 shortcutItem.style.display = pipSettings.enabled ? 'flex' : 'none';
 const { ctrlKey, altKey, shiftKey } = pipSettings.shortcut;
 const modifierValue =
 ctrlKey && altKey && shiftKey
 ? 'ctrl+alt+shift'
 : ctrlKey && altKey
 ? 'ctrl+alt'
 : ctrlKey && shiftKey
 ? 'ctrl+shift'
 : altKey && shiftKey
 ? 'alt+shift'
 : ctrlKey
 ? 'ctrl'
 : altKey
 ? 'alt'
 : shiftKey
 ? 'shift'
 : 'none';
 shortcutItem.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('pipShortcutTitle')}</label>
 <div class="ytp-plus-settings-item-description">${t('pipShortcutDescription')}</div>
 </div>
 <div class="pip-shortcut-editor">
 <!-- hidden native select kept for compatibility -->
 <select id="pip-modifier-combo" style="display:none;">
 ${[
 'none',
 'ctrl',
 'alt',
 'shift',
 'ctrl+alt',
 'ctrl+shift',
 'alt+shift',
 'ctrl+alt+shift',
 ]
 .map(
 v =>
 `<option value="${v}" ${v === modifierValue ? 'selected' : ''}>${
 v === 'none'
 ? t('none')
 : v
 .replace(/\+/g, '+')
 .split('+')
 .map(k => t(k.toLowerCase()))
 .join('+')
 .split('+')
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+')
 }</option>`
 )
 .join('')}
 </select>
 <div class="glass-dropdown" id="pip-modifier-dropdown" tabindex="0" role="listbox" aria-expanded="false">
 <button class="glass-dropdown__toggle" type="button" aria-haspopup="listbox">
 <span class="glass-dropdown__label">${
 modifierValue === 'none'
 ? t('none')
 : modifierValue
 .replace(/\+/g, '+')
 .split('+')
 .map(k => t(k.toLowerCase()))
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+')
 }</span>
 <svg class="glass-dropdown__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
 </button>
 <ul class="glass-dropdown__list" role="presentation">
 ${[
 'none',
 'ctrl',
 'alt',
 'shift',
 'ctrl+alt',
 'ctrl+shift',
 'alt+shift',
 'ctrl+alt+shift',
 ]
 .map(v => {
 const label =
 v === 'none'
 ? t('none')
 : v
 .replace(/\+/g, '+')
 .split('+')
 .map(k => t(k.toLowerCase()))
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+');
 const sel = v === modifierValue ? ' aria-selected="true"' : '';
 return `<li class="glass-dropdown__item" data-value="${v}" role="option"${sel}>${label}</li>`;
 })
 .join('')}
 </ul>
 </div>
 <span>+</span>
 <input type="text" id="pip-key" value="${pipSettings.shortcut.key}" maxlength="1" style="width: 30px; text-align: center;">
 </div>
 `;
 advancedSection.appendChild(shortcutItem);
 const initPipDropdown = () => {
 const hidden = document.getElementById('pip-modifier-combo');
 const dropdown = document.getElementById('pip-modifier-dropdown');
 if (!hidden || !dropdown) return;
 const toggle = dropdown.querySelector('.glass-dropdown__toggle');
 const list = dropdown.querySelector('.glass-dropdown__list');
 const label = dropdown.querySelector('.glass-dropdown__label');
 let items = Array.from(list.querySelectorAll('.glass-dropdown__item'));
 let idx = items.findIndex(it => it.getAttribute('aria-selected') === 'true');
 if (idx < 0) idx = 0;
 const openList = () => {
 dropdown.setAttribute('aria-expanded', 'true');
 list.style.display = 'block';
 items = Array.from(list.querySelectorAll('.glass-dropdown__item'));
 };
 const closeList = () => {
 dropdown.setAttribute('aria-expanded', 'false');
 list.style.display = 'none';
 };
 toggle.addEventListener('click', () => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (expanded) closeList();
 else openList();
 });
 document.addEventListener('click', e => {
 if (!dropdown.contains(e.target)) closeList();
 });
 dropdown.addEventListener('keydown', e => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (e.key === 'ArrowDown') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.min(idx + 1, items.length - 1);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.max(idx - 1, 0);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 if (!expanded) {
 openList();
 return;
 }
 const it = items[idx];
 if (it) {
 hidden.value = it.dataset.value;
 hidden.dispatchEvent(new Event('change', { bubbles: true }));
 label.textContent = it.textContent;
 closeList();
 }
 } else if (e.key === 'Escape') {
 closeList();
 }
 });
 list.addEventListener('click', e => {
 const it = e.target.closest('.glass-dropdown__item');
 if (!it) return;
 const val = it.dataset.value;
 hidden.value = val;
 list
 .querySelectorAll('.glass-dropdown__item')
 .forEach(li => li.removeAttribute('aria-selected'));
 it.setAttribute('aria-selected', 'true');
 label.textContent = it.textContent;
 hidden.dispatchEvent(new Event('change', { bubbles: true }));
 closeList();
 });
 };
 setTimeout(initPipDropdown, 0);
 document.getElementById('pip-enable-checkbox').addEventListener('change', e => {
 const target = (e.target);
 pipSettings.enabled = target.checked;
 shortcutItem.style.display = pipSettings.enabled ? 'flex' : 'none';
 saveSettings();
 });
 document.getElementById('pip-modifier-combo').addEventListener('change', e => {
 const target = (e.target);
 const value = target.value;
 pipSettings.shortcut.ctrlKey = value.includes('ctrl');
 pipSettings.shortcut.altKey = value.includes('alt');
 pipSettings.shortcut.shiftKey = value.includes('shift');
 saveSettings();
 });
 document.getElementById('pip-key').addEventListener('input', e => {
 const target = (e.target);
 if (target.value) {
 pipSettings.shortcut.key = target.value.toUpperCase();
 saveSettings();
 }
 });
 document.getElementById('pip-key').addEventListener('keydown', e => e.stopPropagation());
 };
 loadSettings();
 document.addEventListener('keydown', e => {
 if (!pipSettings.enabled) return;
 const { shiftKey, altKey, ctrlKey, key } = pipSettings.shortcut;
 if (
 e.shiftKey === shiftKey &&
 e.altKey === altKey &&
 e.ctrlKey === ctrlKey &&
 e.key.toUpperCase() === key
 ) {
 const video = getVideoElement();
 if (video) {
 void togglePictureInPicture(video);
 }
 e.preventDefault();
 }
 });
 window.addEventListener('storage', e => {
 if (e.key === pipSettings.storageKey) {
 loadSettings();
 }
 });
 window.addEventListener('load', () => {
 if (!pipSettings.enabled || !wasSessionActive() || document.pictureInPictureElement) {
 return;
 }
 const resumePiP = () => {
 const video = getVideoElement();
 if (!video) return;
 togglePictureInPicture(video).catch(() => {
 setSessionActive(false);
 });
 };
 const ensureCleanup = handler => {
 if (!handler) return;
 try {
 document.removeEventListener('pointerdown', handler, true);
 } catch {}
 };
 const cleanupListeners = () => {
 ensureCleanup(pointerListener);
 ensureCleanup(keyListener);
 };
 const pointerListener = () => {
 cleanupListeners();
 resumePiP();
 };
 const keyListener = () => {
 cleanupListeners();
 resumePiP();
 };
 document.addEventListener('pointerdown', pointerListener, { once: true, capture: true });
 document.addEventListener('keydown', keyListener, { once: true, capture: true });
 });
 const observer = new MutationObserver(mutations => {
 for (const mutation of mutations) {
 for (const node of mutation.addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addPipSettingsToModal, 100);
 }
 }
 }
 document.addEventListener('leavepictureinpicture', () => {
 setSessionActive(false);
 });
 if (YouTubeUtils.querySelector('.ytp-plus-settings-nav-item[data-section="advanced"].active')) {
 if (!YouTubeUtils.querySelector('.pip-settings-item')) {
 setTimeout(addPipSettingsToModal, 50);
 }
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(observer);
 if (document.body) {
 observer.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, { childList: true, subtree: true });
 });
 }
 const clickHandler = e => {
 const target = (e.target);
 if (target.classList && target.classList.contains('ytp-plus-settings-nav-item')) {
 if (target.dataset?.section === 'advanced') {
 setTimeout(addPipSettingsToModal, 50);
 }
 }
 };
 YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler, true);
})();
(function () {
 'use strict';
 const getCache = () => typeof window !== 'undefined' && window.YouTubeDOMCache;
 const $ = (sel, ctx) =>
 getCache()?.querySelector(sel, ctx) || (ctx || document).querySelector(sel);
 const $$ = (sel, ctx) =>
 getCache()?.querySelectorAll(sel, ctx) || Array.from((ctx || document).querySelectorAll(sel));
 const byId = id => getCache()?.getElementById(id) || document.getElementById(id);
 if (window.location.hostname !== 'www.youtube.com' || window.frameElement) {
 return;
 }
 if (window._timecodeModuleInitialized) return;
 window._timecodeModuleInitialized = true;
 const t = (key, params = {}) => {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 };
 const config = {
 enabled: true,
 autoDetect: true,
 shortcut: { key: 'T', shiftKey: true, altKey: false, ctrlKey: false },
 storageKey: 'youtube_timecode_settings',
 autoSave: true,
 autoTrackPlayback: true,
 panelPosition: null,
 export: true,
 };
 const state = {
 timecodes: new Map(),
 dom: {},
 isReloading: false,
 activeIndex: null,
 trackingId: 0,
 dragging: false,
 editingIndex: null,
 resizeListenerKey: null,
 };
 let initStarted = false;
 const scheduleInitRetry = () => {
 const timeoutId = setTimeout(init, 250);
 YouTubeUtils.cleanupManager?.registerTimeout?.(timeoutId);
 };
 const loadSettings = () => {
 try {
 const saved = localStorage.getItem(config.storageKey);
 if (!saved) return;
 const parsed = JSON.parse(saved);
 if (typeof parsed !== 'object' || parsed === null) {
 console.warn('[Timecode] Invalid settings format');
 return;
 }
 if (typeof parsed.enabled === 'boolean') {
 config.enabled = parsed.enabled;
 }
 if (typeof parsed.autoDetect === 'boolean') {
 config.autoDetect = parsed.autoDetect;
 }
 if (typeof parsed.autoSave === 'boolean') {
 config.autoSave = parsed.autoSave;
 }
 if (typeof parsed.autoTrackPlayback === 'boolean') {
 config.autoTrackPlayback = parsed.autoTrackPlayback;
 }
 if (typeof parsed.export === 'boolean') {
 config.export = parsed.export;
 }
 if (parsed.shortcut && typeof parsed.shortcut === 'object') {
 if (typeof parsed.shortcut.key === 'string') {
 config.shortcut.key = parsed.shortcut.key;
 }
 if (typeof parsed.shortcut.shiftKey === 'boolean') {
 config.shortcut.shiftKey = parsed.shortcut.shiftKey;
 }
 if (typeof parsed.shortcut.altKey === 'boolean') {
 config.shortcut.altKey = parsed.shortcut.altKey;
 }
 if (typeof parsed.shortcut.ctrlKey === 'boolean') {
 config.shortcut.ctrlKey = parsed.shortcut.ctrlKey;
 }
 }
 if (parsed.panelPosition && typeof parsed.panelPosition === 'object') {
 const { left, top } = parsed.panelPosition;
 if (
 typeof left === 'number' &&
 typeof top === 'number' &&
 !isNaN(left) &&
 !isNaN(top) &&
 left >= 0 &&
 top >= 0
 ) {
 config.panelPosition = { left, top };
 }
 }
 } catch (error) {
 console.error('[Timecode] Error loading settings:', error);
 }
 };
 const saveSettings = () => {
 try {
 const settingsToSave = {
 enabled: config.enabled,
 autoDetect: config.autoDetect,
 shortcut: config.shortcut,
 autoSave: config.autoSave,
 autoTrackPlayback: config.autoTrackPlayback,
 panelPosition: config.panelPosition,
 export: config.export,
 };
 localStorage.setItem(config.storageKey, JSON.stringify(settingsToSave));
 } catch (error) {
 console.error('[Timecode] Error saving settings:', error);
 }
 };
 const clampPanelPosition = (panel, left, top) => {
 try {
 if (!panel || !(panel instanceof HTMLElement)) {
 console.warn('[Timecode] Invalid panel element');
 return { left: 0, top: 0 };
 }
 if (typeof left !== 'number' || typeof top !== 'number' || isNaN(left) || isNaN(top)) {
 console.warn('[Timecode] Invalid position coordinates');
 return { left: 0, top: 0 };
 }
 const rect = panel.getBoundingClientRect();
 const width = rect.width || panel.offsetWidth || 0;
 const height = rect.height || panel.offsetHeight || 0;
 const maxLeft = Math.max(0, window.innerWidth - width);
 const maxTop = Math.max(0, window.innerHeight - height);
 return {
 left: Math.min(Math.max(0, left), maxLeft),
 top: Math.min(Math.max(0, top), maxTop),
 };
 } catch (error) {
 console.error('[Timecode] Error clamping panel position:', error);
 return { left: 0, top: 0 };
 }
 };
 const savePanelPosition = (left, top) => {
 try {
 if (typeof left !== 'number' || typeof top !== 'number' || isNaN(left) || isNaN(top)) {
 console.warn('[Timecode] Invalid position coordinates for saving');
 return;
 }
 config.panelPosition = { left, top };
 saveSettings();
 } catch (error) {
 console.error('[Timecode] Error saving panel position:', error);
 }
 };
 const applySavedPanelPosition = panel => {
 if (!panel || !config.panelPosition) return;
 requestAnimationFrame(() => {
 const { left, top } = clampPanelPosition(
 panel,
 config.panelPosition.left,
 config.panelPosition.top
 );
 panel.style.left = `${left}px`;
 panel.style.top = `${top}px`;
 panel.style.right = 'auto';
 });
 };
 const showNotification = (message, duration = 2000, type = 'info') => {
 YouTubeUtils.NotificationManager.show(message, { duration, type });
 };
 const formatTime = seconds => {
 if (isNaN(seconds)) return '00:00';
 seconds = Math.round(seconds);
 const h = Math.floor(seconds / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = seconds % 60;
 return h > 0
 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
 : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
 };
 const removeDuplicateText = text => {
 if (!text || text.length < 10) return text;
 let cleaned = text.trim();
 cleaned = cleaned.replace(/\s*\.{2,}$/, '').replace(/\s*…$/, '');
 const words = cleaned.split(/\s+/);
 if (words.length < 4) return cleaned;
 const half = Math.floor(words.length / 2);
 if (half >= 2) {
 const firstHalf = words.slice(0, half).join(' ');
 const secondHalf = words.slice(half, half * 2).join(' ');
 if (firstHalf === secondHalf) {
 return firstHalf;
 }
 }
 const minPatternLength = Math.max(2, Math.floor(words.length / 4));
 const maxPatternLength = Math.floor(words.length / 2);
 for (let len = maxPatternLength; len >= minPatternLength; len--) {
 const pattern = words.slice(0, len).join(' ');
 const patternWords = words.slice(0, len);
 for (let offset = 1; offset <= words.length - len; offset++) {
 let matchCount = 0;
 let partialWordMatch = false;
 const testWords = words.slice(offset, Math.min(offset + len, words.length));
 for (let i = 0; i < patternWords.length; i++) {
 const patternWord = patternWords[i];
 const testWord = testWords[i];
 if (!testWord) break;
 if (patternWord === testWord) {
 matchCount++;
 }
 else if (testWord.length >= 3 && patternWord.startsWith(testWord)) {
 matchCount += 0.8;
 partialWordMatch = true;
 } else if (patternWord.length >= 3 && testWord.startsWith(patternWord)) {
 matchCount += 0.8;
 partialWordMatch = true;
 }
 }
 const similarity = matchCount / patternWords.length;
 const effectiveMatches = Math.floor(matchCount);
 if (
 similarity >= 0.7 &&
 (effectiveMatches >= 2 || (matchCount >= 1.5 && partialWordMatch))
 ) {
 return pattern;
 }
 }
 }
 return cleaned;
 };
 const parseTime = timeStr => {
 try {
 if (!timeStr || typeof timeStr !== 'string') return null;
 const str = timeStr.trim();
 if (str.length === 0 || str.length > 12) return null;
 let match = str.match(/^(\d+):(\d{1,2}):(\d{2})$/);
 if (match) {
 const [, h, m, s] = match.map(Number);
 if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
 if (m >= 60 || s >= 60 || h < 0 || m < 0 || s < 0) return null;
 const total = h * 3600 + m * 60 + s;
 return total <= 86400 ? total : null;
 }
 match = str.match(/^(\d{1,2}):(\d{2})$/);
 if (match) {
 const [, m, s] = match.map(Number);
 if (isNaN(m) || isNaN(s)) return null;
 if (m >= 60 || s >= 60 || m < 0 || s < 0) return null;
 return m * 60 + s;
 }
 return null;
 } catch (error) {
 console.error('[Timecode] Error parsing time:', error);
 return null;
 }
 };
 const extractTimecodes = text => {
 try {
 if (!text || typeof text !== 'string') return [];
 if (text.length > 50000) {
 console.warn('[Timecode] Text too long, truncating');
 text = text.substring(0, 50000);
 }
 const timecodes = [];
 const seen = new Set();
 const patterns = [
 /(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*(.+?)$/gm,
 /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+?)$/gm,
 /(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—:]\s*([^\n\r]{1,100}?)(?=\s*\d{1,2}:\d{2}|\s*$)/g,
 /(\d{1,2}:\d{2}(?::\d{2})?)\s*[–—-]\s*([^\n]+)/gm,
 /^(\d{1,2}:\d{2}(?::\d{2})?)\s*(.+)$/gm,
 ];
 for (const pattern of patterns) {
 let match;
 let iterations = 0;
 const maxIterations = 1000;
 while ((match = pattern.exec(text)) !== null && iterations++ < maxIterations) {
 const time = parseTime(match[1]);
 if (time !== null && !seen.has(time)) {
 seen.add(time);
 let label = (match[2] || '')
 .trim()
 .replace(/^\d+[\.\)]\s*/, '')
 .replace(/\s+/g, ' ')
 .substring(0, 100);
 const originalLabel = label;
 label = label.replace(/[<>\"']/g, '');
 label = removeDuplicateText(label);
 if (originalLabel !== label && label.length > 0) {
 console.warn('[Timecode] Description deduplicated:', originalLabel, '->', label);
 }
 timecodes.push({ time, label: label || '', originalText: match[1] });
 }
 }
 if (iterations >= maxIterations) {
 console.warn('[Timecode] Maximum iterations reached during extraction');
 }
 }
 return timecodes.sort((a, b) => a.time - b.time);
 } catch (error) {
 console.error('[Timecode] Error extracting timecodes:', error);
 return [];
 }
 };
 const DESCRIPTION_SELECTORS = [
 '#description-inline-expander yt-attributed-string',
 '#description-inline-expander yt-formatted-string',
 '#description-inline-expander ytd-text-inline-expander',
 '#description-inline-expander .yt-core-attributed-string',
 '#description ytd-text-inline-expander',
 '#description ytd-expandable-video-description-body-renderer',
 '#description.ytd-watch-metadata yt-formatted-string',
 '#description.ytd-watch-metadata #description-inline-expander',
 '#tab-info ytd-expandable-video-description-body-renderer yt-formatted-string',
 '#tab-info ytd-expandable-video-description-body-renderer yt-attributed-string',
 '#structured-description ytd-text-inline-expander',
 '#structured-description yt-formatted-string',
 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"] yt-formatted-string',
 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"] yt-attributed-string',
 'ytd-watch-metadata #description',
 'ytd-watch-metadata #description-inline-expander',
 '#description',
 ];
 const DESCRIPTION_SELECTOR_COMBINED = DESCRIPTION_SELECTORS.join(',');
 const DESCRIPTION_EXPANDERS = [
 '#description-inline-expander yt-button-shape button',
 '#description-inline-expander tp-yt-paper-button#expand',
 '#description-inline-expander tp-yt-paper-button[aria-label]',
 'ytd-watch-metadata #description-inline-expander yt-button-shape button',
 'ytd-text-inline-expander[collapsed] yt-button-shape button',
 'ytd-text-inline-expander[collapsed] tp-yt-paper-button#expand',
 'ytd-expandable-video-description-body-renderer #expand',
 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"] #expand',
 ];
 const sleep = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));
 const collectDescriptionText = () => {
 const snippets = [];
 DESCRIPTION_SELECTORS.forEach(selector => {
 $$(selector).forEach(node => {
 const text = node?.textContent?.trim();
 if (text) {
 snippets.push(text);
 }
 });
 });
 return snippets.join('\n');
 };
 const COMMENT_SELECTORS = [
 'ytd-comment-thread-renderer #content-text',
 'ytd-comment-renderer #content-text',
 'ytd-comment-thread-renderer yt-formatted-string#content-text',
 'ytd-comment-renderer yt-formatted-string#content-text',
 '#comments ytd-comment-thread-renderer #content-text',
 ];
 const collectCommentsText = (maxComments = 30) => {
 try {
 const snippets = [];
 for (const sel of COMMENT_SELECTORS) {
 $$(sel).forEach(node => {
 if (snippets.length >= maxComments) return;
 const text = node?.textContent?.trim();
 if (text) snippets.push(text);
 });
 if (snippets.length >= maxComments) break;
 }
 return snippets.join('\n');
 } catch (error) {
 YouTubeUtils.logError('TimecodePanel', 'collectCommentsText failed', error);
 return '';
 }
 };
 const expandDescriptionIfNeeded = async () => {
 for (const selector of DESCRIPTION_EXPANDERS) {
 const button = $(selector);
 if (!button) continue;
 const ariaExpanded = button.getAttribute('aria-expanded');
 if (ariaExpanded === 'true') return false;
 const ariaLabel = button.getAttribute('aria-label')?.toLowerCase();
 if (ariaLabel && ariaLabel.includes('less')) return false;
 if (button.offsetParent !== null) {
 try {
 (button).click();
 await sleep(400);
 return true;
 } catch (error) {
 console.warn('[Timecode] Failed to click expand button:', error);
 }
 }
 }
 const inlineExpander = $('ytd-text-inline-expander[collapsed]');
 if (inlineExpander) {
 try {
 inlineExpander.removeAttribute('collapsed');
 } catch (error) {
 YouTubeUtils.logError('TimecodePanel', 'Failed to expand description', error);
 }
 await sleep(300);
 return true;
 }
 return false;
 };
 const ensureDescriptionReady = async () => {
 const initialText = collectDescriptionText();
 if (initialText) return;
 const maxAttempts = 3;
 for (let attempt = 0; attempt < maxAttempts; attempt++) {
 try {
 await YouTubeUtils.waitForElement(DESCRIPTION_SELECTOR_COMBINED, 1500);
 } catch {
 }
 await sleep(200);
 const expanded = await expandDescriptionIfNeeded();
 await sleep(expanded ? 500 : 200);
 const text = collectDescriptionText();
 if (text && text.length > initialText.length) {
 return;
 }
 }
 };
 const getCurrentVideoId = () => new URLSearchParams(window.location.search).get('v');
 const detectTimecodes = async (options = {}) => {
 const { force = false } = options;
 if (!config.enabled) return [];
 if (!force && !config.autoDetect) return [];
 const videoId = getCurrentVideoId();
 if (!videoId) return [];
 const cacheKey = `detect_${videoId}`;
 if (!force && state.timecodes.has(cacheKey)) {
 const cached = state.timecodes.get(cacheKey);
 if (Array.isArray(cached) && cached.length) {
 return cached;
 }
 state.timecodes.delete(cacheKey);
 }
 await ensureDescriptionReady();
 const uniqueMap = new Map();
 const descriptionText = collectDescriptionText();
 if (descriptionText) {
 const extracted = extractTimecodes(descriptionText);
 extracted.forEach(tc => {
 if (tc.time >= 0) {
 uniqueMap.set(tc.time.toString(), tc);
 }
 });
 }
 const chapters = getYouTubeChapters();
 chapters.forEach(chapter => {
 if (chapter.time >= 0) {
 const key = chapter.time.toString();
 const existing = uniqueMap.get(key);
 if (existing && chapter.label && chapter.label.length > existing.label.length) {
 uniqueMap.set(key, { ...existing, label: chapter.label, isChapter: true });
 } else if (!existing) {
 uniqueMap.set(key, chapter);
 } else {
 uniqueMap.set(key, { ...existing, isChapter: true });
 }
 }
 });
 if (uniqueMap.size === 0) {
 try {
 const commentsText = collectCommentsText();
 if (commentsText) {
 const extractedComments = extractTimecodes(commentsText);
 extractedComments.forEach(tc => {
 if (tc.time >= 0) uniqueMap.set(tc.time.toString(), tc);
 });
 }
 } catch (error) {
 YouTubeUtils.logError('TimecodePanel', 'Comment scanning failed', error);
 }
 }
 const result = Array.from(uniqueMap.values()).sort((a, b) => a.time - b.time);
 const hadExistingItems = state.dom.list?.childElementCount > 0;
 if (result.length > 0) {
 updateTimecodePanel(result);
 state.timecodes.set(cacheKey, result);
 if (config.autoSave) saveTimecodesToStorage(result);
 } else {
 if (force || !hadExistingItems) {
 updateTimecodePanel([]);
 }
 if (force) {
 state.timecodes.delete(cacheKey);
 }
 }
 return result;
 };
 const reloadTimecodes = async (buttonOverride = null) => {
 const button = buttonOverride || state.dom.reloadButton || byId('timecode-reload');
 if (state.isReloading || !config.enabled) return;
 state.isReloading = true;
 if (button) {
 button.disabled = true;
 button.classList.add('loading');
 }
 try {
 const result = await detectTimecodes({ force: true });
 if (Array.isArray(result) && result.length) {
 showNotification(t('foundTimecodes').replace('{count}', result.length));
 } else {
 updateTimecodePanel([]);
 showNotification(t('noTimecodesFound'));
 }
 } catch (error) {
 YouTubeUtils.logError('TimecodePanel', 'Reload failed', error);
 showNotification(t('reloadError'));
 } finally {
 if (button) {
 button.disabled = false;
 button.classList.remove('loading');
 }
 state.isReloading = false;
 }
 };
 const getYouTubeChapters = () => {
 const selectors = [
 'ytd-macro-markers-list-item-renderer',
 'ytd-chapter-renderer',
 'ytd-engagement-panel-section-list-renderer[target-id*="description-chapters"] ytd-macro-markers-list-item-renderer',
 'ytd-engagement-panel-section-list-renderer[target-id*="description-chapters"] #details',
 '#structured-description ytd-horizontal-card-list-renderer ytd-macro-markers-list-item-renderer',
 ];
 const items = $$(selectors.join(', '));
 const chapters = new Map();
 items.forEach(item => {
 const timeSelectors = ['.time-info', '.timestamp', '#time', 'span[id*="time"]'];
 const titleSelectors = ['.marker-title', '.chapter-title', '#details', 'h4', '.title'];
 let timeText = null;
 for (const sel of timeSelectors) {
 const el = item.querySelector(sel);
 if (el?.textContent) {
 timeText = el.textContent;
 break;
 }
 }
 let titleText = null;
 for (const sel of titleSelectors) {
 const el = item.querySelector(sel);
 if (el?.textContent) {
 titleText = el.textContent;
 break;
 }
 }
 if (timeText) {
 const time = parseTime(timeText.trim());
 if (time !== null) {
 let cleanTitle = titleText?.trim().replace(/\s+/g, ' ') || '';
 if (cleanTitle && cleanTitle.length > 0) {
 console.warn('[Timecode Debug] Raw chapter title:', cleanTitle);
 }
 cleanTitle = cleanTitle.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*[-–—:]?\s*/, '');
 const deduplicated = removeDuplicateText(cleanTitle);
 if (cleanTitle !== deduplicated) {
 console.warn('[Timecode] Removed duplicate:', cleanTitle, '->', deduplicated);
 }
 cleanTitle = deduplicated;
 chapters.set(time.toString(), {
 time,
 label: cleanTitle,
 isChapter: true,
 });
 }
 }
 });
 const result = Array.from(chapters.values()).sort((a, b) => a.time - b.time);
 return result;
 };
 const addTimecodePanelSettings = () => {
 const advancedSection = YouTubeUtils.querySelector
 ? YouTubeUtils.querySelector('.ytp-plus-settings-section[data-section="advanced"]')
 : $('.ytp-plus-settings-section[data-section="advanced"]');
 if (
 !advancedSection ||
 (YouTubeUtils.querySelector
 ? YouTubeUtils.querySelector('.timecode-settings-item')
 : $('.timecode-settings-item'))
 ) {
 return;
 }
 const { ctrlKey, altKey, shiftKey } = config.shortcut;
 const modifierValue =
 [
 ctrlKey && altKey && shiftKey && 'ctrl+alt+shift',
 ctrlKey && altKey && 'ctrl+alt',
 ctrlKey && shiftKey && 'ctrl+shift',
 altKey && shiftKey && 'alt+shift',
 ctrlKey && 'ctrl',
 altKey && 'alt',
 shiftKey && 'shift',
 ].find(Boolean) || 'none';
 const enableDiv = document.createElement('div');
 enableDiv.className = 'ytp-plus-settings-item timecode-settings-item';
 enableDiv.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('enableTimecode')}</label>
 <div class="ytp-plus-settings-item-description">${t('enableDescription')}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" data-setting="enabled" ${config.enabled ? 'checked' : ''}>
 `;
 const shortcutDiv = document.createElement('div');
 shortcutDiv.className = 'ytp-plus-settings-item timecode-settings-item timecode-shortcut-item';
 shortcutDiv.style.display = config.enabled ? 'flex' : 'none';
 shortcutDiv.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('keyboardShortcut')}</label>
 <div class="ytp-plus-settings-item-description">${t('shortcutDescription')}</div>
 </div>
 <div style="display: flex; align-items: center; gap: 8px;">
 <!-- Hidden native select kept for programmatic compatibility -->
 <select id="timecode-modifier-combo" style="display:none;">
 ${[
 'none',
 'ctrl',
 'alt',
 'shift',
 'ctrl+alt',
 'ctrl+shift',
 'alt+shift',
 'ctrl+alt+shift',
 ]
 .map(
 v =>
 `<option value="${v}" ${v === modifierValue ? 'selected' : ''}>${
 v === 'none'
 ? 'None'
 : v
 .split('+')
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+')
 }</option>`
 )
 .join('')}
 </select>
 <div class="glass-dropdown" id="timecode-modifier-dropdown" tabindex="0" role="listbox" aria-expanded="false">
 <button class="glass-dropdown__toggle" type="button" aria-haspopup="listbox">
 <span class="glass-dropdown__label">${
 modifierValue === 'none'
 ? 'None'
 : modifierValue
 .split('+')
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+')
 }</span>
 <svg class="glass-dropdown__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
 </button>
 <ul class="glass-dropdown__list" role="presentation">
 ${[
 'none',
 'ctrl',
 'alt',
 'shift',
 'ctrl+alt',
 'ctrl+shift',
 'alt+shift',
 'ctrl+alt+shift',
 ]
 .map(v => {
 const label =
 v === 'none'
 ? 'None'
 : v
 .split('+')
 .map(k => k.charAt(0).toUpperCase() + k.slice(1))
 .join('+');
 const sel = v === modifierValue ? ' aria-selected="true"' : '';
 return `<li class="glass-dropdown__item" data-value="${v}" role="option"${sel}>${label}</li>`;
 })
 .join('')}
 </ul>
 </div>
 <span style="color:inherit;opacity:0.8;">+</span>
 <input type="text" id="timecode-key" value="${config.shortcut.key}" maxlength="1" style="width: 30px; text-align: center; background: rgba(34, 34, 34, var(--yt-header-bg-opacity)); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px;">
 </div>
 `;
 advancedSection.append(enableDiv, shortcutDiv);
 const initGlassDropdown = () => {
 const hiddenSelect = byId('timecode-modifier-combo');
 const dropdown = byId('timecode-modifier-dropdown');
 if (!hiddenSelect || !dropdown) return;
 const toggle = $('.glass-dropdown__toggle', dropdown);
 const list = $('.glass-dropdown__list', dropdown);
 const label = $('.glass-dropdown__label', dropdown);
 let items = Array.from($$('.glass-dropdown__item', list));
 let idx = items.findIndex(it => it.getAttribute('aria-selected') === 'true');
 if (idx < 0) idx = 0;
 const closeList = () => {
 dropdown.setAttribute('aria-expanded', 'false');
 list.style.display = 'none';
 };
 const openList = () => {
 dropdown.setAttribute('aria-expanded', 'true');
 list.style.display = 'block';
 items = Array.from($$('.glass-dropdown__item', list));
 };
 closeList();
 toggle.addEventListener('click', () => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (expanded) closeList();
 else openList();
 });
 document.addEventListener('click', e => {
 if (!dropdown.contains(e.target)) closeList();
 });
 list.addEventListener('click', e => {
 const it = e.target.closest('.glass-dropdown__item');
 if (!it) return;
 const val = it.dataset.value;
 hiddenSelect.value = val;
 list
 .querySelectorAll('.glass-dropdown__item')
 .forEach(li => li.removeAttribute('aria-selected'));
 it.setAttribute('aria-selected', 'true');
 idx = items.indexOf(it);
 label.textContent = it.textContent;
 hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
 closeList();
 });
 dropdown.addEventListener('keydown', e => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (e.key === 'ArrowDown') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.min(idx + 1, items.length - 1);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.max(idx - 1, 0);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 if (!expanded) {
 openList();
 return;
 }
 const it = items[idx];
 if (it) {
 hiddenSelect.value = it.dataset.value;
 hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
 label.textContent = it.textContent;
 closeList();
 }
 } else if (e.key === 'Escape') {
 closeList();
 }
 });
 };
 setTimeout(initGlassDropdown, 0);
 advancedSection.addEventListener('change', e => {
 const target = (e.target);
 if (target.matches && target.matches('.ytp-plus-settings-checkbox[data-setting="enabled"]')) {
 config.enabled = (target).checked;
 shortcutDiv.style.display = config.enabled ? 'flex' : 'none';
 toggleTimecodePanel(config.enabled);
 saveSettings();
 }
 });
 byId('timecode-modifier-combo')?.addEventListener('change', e => {
 const target = (e.target);
 const value = target.value;
 config.shortcut.ctrlKey = value.includes('ctrl');
 config.shortcut.altKey = value.includes('alt');
 config.shortcut.shiftKey = value.includes('shift');
 saveSettings();
 });
 byId('timecode-key')?.addEventListener('input', e => {
 const target = (e.target);
 if (target.value) {
 config.shortcut.key = target.value.toUpperCase();
 saveSettings();
 }
 });
 };
 const insertTimecodeStyles = () => {
 if (byId('timecode-panel-styles')) return;
 const styles = `
 :root{--tc-panel-bg:rgba(255,255,255,0.06);--tc-panel-border:rgba(255,255,255,0.12);--tc-panel-color:#fff}
 html[dark],body[dark]{--tc-panel-bg:rgba(34,34,34,0.75);--tc-panel-border:rgba(255,255,255,0.12);--tc-panel-color:#fff}
 html:not([dark]){--tc-panel-bg:rgba(255,255,255,0.95);--tc-panel-border:rgba(0,0,0,0.08);--tc-panel-color:#222}
 #timecode-panel{position:fixed;right:20px;top:80px;background:var(--tc-panel-bg);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.45);width:320px;max-height:70vh;z-index:10000;color:var(--tc-panel-color);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1.5px solid var(--tc-panel-border);transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .28s;overflow:hidden;display:flex;flex-direction:column}
 #timecode-panel.hidden{transform:translateX(300px);opacity:0;pointer-events:none}
 #timecode-panel.auto-tracking{box-shadow:0 12px 48px rgba(255,0,0,0.12);border-color:rgba(255,0,0,0.25)}
 #timecode-header{display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid rgba(255,255,255,0.04);background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);cursor:move}
 #timecode-title{font-weight:600;margin:0;font-size:15px;user-select:none;display:flex;align-items:center;gap:8px}
 #timecode-tracking-indicator{width:8px;height:8px;background:red;border-radius:50%;opacity:0;transition:opacity .3s}
 #timecode-panel.auto-tracking #timecode-tracking-indicator{opacity:1}
 #timecode-current-time{font-family:monospace;font-size:12px;padding:2px 6px;background:rgba(255,0,0,.3);border-radius:3px;margin-left:auto}
 #timecode-header-controls{display:flex;align-items:center;gap:6px}
 #timecode-reload,#timecode-close{background:transparent;border:none;color:inherit;cursor:pointer;width:28px;height:28px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:background .18s,color .18s}
 #timecode-reload:hover,#timecode-close:hover{background:rgba(255,255,255,0.04)}
 #timecode-reload.loading{animation:timecode-spin .8s linear infinite}
 #timecode-list{overflow-y:auto;padding:8px 0;max-height:calc(70vh - 80px);scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.3) transparent}
 #timecode-list::-webkit-scrollbar{width:6px}
 #timecode-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.3);border-radius:3px}
 .timecode-item{padding:10px 14px;display:flex;align-items:center;cursor:pointer;transition:background-color .16s,transform .12s;border-left:3px solid transparent;position:relative;border-radius:8px;margin:6px 10px}
 .timecode-item:hover{background:rgba(255,255,255,0.04);transform:translateY(-2px)}
 .timecode-item:hover .timecode-actions{opacity:1}
 .timecode-item.active{background:linear-gradient(90deg, rgba(255,68,68,0.12), rgba(255,68,68,0.04));border-left-color:#ff6666;box-shadow:inset 0 0 0 1px rgba(255,68,68,0.03)}
 .timecode-item.active.pulse{animation:pulse .8s ease-out}
 .timecode-item.editing{background:linear-gradient(90deg, rgba(255,170,0,0.08), rgba(255,170,0,0.03));border-left-color:#ffaa00}
 .timecode-item.editing .timecode-actions{opacity:1}
 @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
 @keyframes timecode-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
 .timecode-time{font-family:monospace;margin-right:10px;color:rgba(255,255,255,.8);font-size:13px;min-width:45px;flex-shrink:0}
 .timecode-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;flex:1;margin-left:4px}
 .timecode-item:not(:has(.timecode-label)) .timecode-time{flex:1;text-align:left}
 .timecode-item.has-chapter .timecode-time{color:#ff4444}
 .timecode-progress{width:0;height:2px;background:#ff4444;position:absolute;bottom:0;left:0;transition:width .3s;opacity:.8}
 .timecode-actions{position:absolute;right:8px;top:50%;transform:translateY(-50%);display:flex;gap:4px;opacity:0;transition:opacity .2s;background:rgba(0,0,0,.8);border-radius:4px;padding:2px}
 .timecode-action{background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer;padding:4px;font-size:12px;border-radius:2px;transition:color .2s,background-color .2s}
 .timecode-action:hover{color:#fff;background:rgba(255,255,255,.2)}
 .timecode-action.edit:hover{color:#ffaa00}
 .timecode-action.delete:hover{color:#ff4444}
 #timecode-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;color:rgba(255,255,255,.7);font-size:13px}
 #timecode-form{padding:12px;border-top:1px solid rgba(255,255,255,.04);display:none}
 #timecode-form.visible{display:block}
 #timecode-form input{width:100%;margin-bottom:8px;padding:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:4px;color:#fff;font-size:13px}
 #timecode-form input::placeholder{color:rgba(255,255,255,.6)}
 #timecode-form-buttons{display:flex;gap:8px;justify-content:flex-end}
 #timecode-form-buttons button{padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;transition:background-color .2s}
 #timecode-form-cancel{background:rgba(255,255,255,.2);color:#fff}
 #timecode-form-cancel:hover{background:rgba(255,255,255,.3)}
 #timecode-form-save{background:#ff4444;color:#fff}
 #timecode-form-save:hover{background:#ff6666}
 #timecode-actions{padding:10px;border-top:1px solid rgba(255,255,255,.04);display:flex;gap:8px;background:linear-gradient(180deg,transparent,rgba(0,0,0,0.03))}
 #timecode-actions button{padding:8px 12px;border:none;border-radius:8px;cursor:pointer;font-size:13px;transition:background .18s;color:inherit;background:rgba(255,255,255,0.02)}
 #timecode-actions button:hover{background:rgba(255,255,255,0.04)}
 #timecode-track-toggle.active{background:linear-gradient(90deg,#ff6b6b,#ff4444);color:#fff}
 `;
 YouTubeUtils.StyleManager.add('timecode-panel-styles', styles);
 };
 const createTimecodePanel = () => {
 if (state.dom.panel) return state.dom.panel;
 $$('#timecode-panel').forEach(p => p.remove());
 const panel = document.createElement('div');
 panel.id = 'timecode-panel';
 panel.className = config.enabled ? '' : 'hidden';
 if (config.autoTrackPlayback) panel.classList.add('auto-tracking');
 panel.innerHTML = `
 <div id="timecode-header">
 <h3 id="timecode-title">
 <div id="timecode-tracking-indicator"></div>
 ${t('timecodes')}
 <span id="timecode-current-time"></span>
 </h3>
 <div id="timecode-header-controls">
 <button id="timecode-reload" title="${t('reload')}" aria-label="${t('reload')}">⟳</button>
 <button id="timecode-close" title="${t('close')}" aria-label="${t('close')}">
 <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
 </svg>
 </button>
 </div>
 </div>
 <div id="timecode-list"></div>
 <div id="timecode-empty">
 <div>${t('noTimecodesFound')}</div>
 <div style="margin-top:5px;font-size:12px">${t('clickToAdd')}</div>
 </div>
 <div id="timecode-form">
 <input type="text" id="timecode-form-time" placeholder="${t('timePlaceholder')}">
 <input type="text" id="timecode-form-label" placeholder="${t('labelPlaceholder')}">
 <div id="timecode-form-buttons">
 <button type="button" id="timecode-form-cancel">${t('cancel')}</button>
 <button type="button" id="timecode-form-save" class="save">${t('save')}</button>
 </div>
 </div>
 <div id="timecode-actions">
 <button id="timecode-add-btn">${t('add')}</button>
 <button id="timecode-export-btn" ${config.export ? '' : 'style="display:none"'}>${t('export')}</button>
 <button id="timecode-track-toggle" class="${config.autoTrackPlayback ? 'active' : ''}">${config.autoTrackPlayback ? t('tracking') : t('track')}</button>
 </div>
 `;
 state.dom = {
 panel,
 list: panel.querySelector('#timecode-list'),
 empty: panel.querySelector('#timecode-empty'),
 form: panel.querySelector('#timecode-form'),
 timeInput: panel.querySelector('#timecode-form-time'),
 labelInput: panel.querySelector('#timecode-form-label'),
 currentTime: panel.querySelector('#timecode-current-time'),
 trackToggle: panel.querySelector('#timecode-track-toggle'),
 reloadButton: panel.querySelector('#timecode-reload'),
 };
 panel.addEventListener('click', handlePanelClick);
 makeDraggable(panel);
 document.body.appendChild(panel);
 applySavedPanelPosition(panel);
 return panel;
 };
 const handlePanelClick = e => {
 const { target } = e;
 const item = target.closest('.timecode-item');
 const reloadButton = target.closest
 ? target.closest('#timecode-reload')
 : target.id === 'timecode-reload'
 ? target
 : null;
 if (reloadButton) {
 e.preventDefault();
 reloadTimecodes(reloadButton);
 return;
 }
 const closeButton = target.closest
 ? target.closest('#timecode-close')
 : target.id === 'timecode-close'
 ? target
 : null;
 if (closeButton) {
 toggleTimecodePanel(false);
 } else if (target.id === 'timecode-add-btn') {
 const video = YouTubeUtils.querySelector ? YouTubeUtils.querySelector('video') : $('video');
 if (video) showTimecodeForm(video.currentTime);
 } else if (target.id === 'timecode-track-toggle') {
 config.autoTrackPlayback = !config.autoTrackPlayback;
 target.textContent = config.autoTrackPlayback ? t('tracking') : t('track');
 target.classList.toggle('active', config.autoTrackPlayback);
 state.dom.panel.classList.toggle('auto-tracking', config.autoTrackPlayback);
 saveSettings();
 if (config.autoTrackPlayback) startTracking();
 } else if (target.id === 'timecode-export-btn') {
 exportTimecodes();
 } else if (target.id === 'timecode-form-cancel') {
 hideTimecodeForm();
 } else if (target.id === 'timecode-form-save') {
 saveTimecodeForm();
 } else if (target.classList.contains('timecode-action')) {
 e.stopPropagation();
 const action = target.dataset.action;
 const index = parseInt(target.closest('.timecode-item').dataset.index, 10);
 if (action === 'edit') {
 editTimecode(index);
 } else if (action === 'delete') {
 deleteTimecode(index);
 }
 } else if (item && !target.closest('.timecode-actions')) {
 const time = parseFloat(item.dataset.time);
 const video = document.querySelector('video');
 if (video && !isNaN(time)) {
 (video).currentTime = time;
 if (video.paused) video.play();
 updateActiveItem(item);
 }
 }
 };
 const editTimecode = index => {
 const timecodes = getCurrentTimecodes();
 if (index < 0 || index >= timecodes.length) return;
 const timecode = timecodes[index];
 state.editingIndex = index;
 const item = state.dom.list.querySelector(`.timecode-item[data-index="${index}"]`);
 if (item) {
 item.classList.add('editing');
 state.dom.list.querySelectorAll('.timecode-item.editing').forEach(el => {
 if (el !== item) el.classList.remove('editing');
 });
 }
 showTimecodeForm(timecode.time, timecode.label);
 };
 const deleteTimecode = index => {
 const timecodes = getCurrentTimecodes();
 if (index < 0 || index >= timecodes.length) return;
 const timecode = timecodes[index];
 if (timecode.isChapter && !timecode.isUserAdded) {
 showNotification(t('cannotDeleteChapter'));
 return;
 }
 if (!confirm(t('confirmDelete').replace('{label}', timecode.label))) return;
 timecodes.splice(index, 1);
 updateTimecodePanel(timecodes);
 saveTimecodesToStorage(timecodes);
 showNotification(t('timecodeDeleted'));
 };
 const showTimecodeForm = (currentTime, existingLabel = '') => {
 const { form, timeInput, labelInput } = state.dom;
 form.classList.add('visible');
 timeInput.value = formatTime(currentTime);
 labelInput.value = existingLabel;
 requestAnimationFrame(() => labelInput.focus());
 };
 const hideTimecodeForm = () => {
 state.dom.form.classList.remove('visible');
 state.editingIndex = null;
 state.dom.list?.querySelectorAll('.timecode-item.editing').forEach(el => {
 el.classList.remove('editing');
 });
 };
 const saveTimecodeForm = () => {
 const { timeInput, labelInput } = state.dom;
 const timeValue = timeInput.value.trim();
 const labelValue = labelInput.value.trim();
 const time = parseTime(timeValue);
 if (time === null) {
 showNotification(t('invalidTimeFormat'));
 return;
 }
 const timecodes = getCurrentTimecodes();
 const newTimecode = {
 time,
 label: labelValue || '',
 isUserAdded: true,
 isChapter: false,
 };
 if (state.editingIndex !== null) {
 const oldTimecode = timecodes[state.editingIndex];
 if (oldTimecode.isChapter && !oldTimecode.isUserAdded) {
 showNotification(t('cannotEditChapter'));
 hideTimecodeForm();
 return;
 }
 timecodes[state.editingIndex] = { ...oldTimecode, ...newTimecode };
 showNotification(t('timecodeUpdated'));
 } else {
 timecodes.push(newTimecode);
 showNotification(t('timecodeAdded'));
 }
 const sorted = timecodes.sort((a, b) => a.time - b.time);
 updateTimecodePanel(sorted);
 saveTimecodesToStorage(sorted);
 hideTimecodeForm();
 };
 const exportTimecodes = () => {
 const timecodes = getCurrentTimecodes();
 if (!timecodes.length) {
 showNotification(t('noTimecodesToExport'));
 return;
 }
 const exportBtn = state.dom.panel?.querySelector('#timecode-export-btn');
 if (exportBtn) {
 exportBtn.textContent = t('copied');
 exportBtn.style.backgroundColor = 'rgba(0,220,0,0.8)';
 setTimeout(() => {
 exportBtn.textContent = t('export');
 exportBtn.style.backgroundColor = '';
 }, 2000);
 }
 const videoTitle = document.title.replace(/\s-\sYouTube$/, '');
 let content = `${videoTitle}\n\nTimecodes:\n`;
 timecodes.forEach(tc => {
 const label = tc.label?.trim();
 content += label ? `${formatTime(tc.time)} - ${label}\n` : `${formatTime(tc.time)}\n`;
 });
 if (navigator.clipboard?.writeText) {
 navigator.clipboard.writeText(content).then(() => {
 showNotification(t('timecodesCopied'));
 });
 }
 };
 const updateTimecodePanel = timecodes => {
 const { list, empty } = state.dom;
 if (!list || !empty) return;
 const isEmpty = !timecodes.length;
 empty.style.display = isEmpty ? 'flex' : 'none';
 list.style.display = isEmpty ? 'none' : 'block';
 if (isEmpty) {
 list.innerHTML = '';
 return;
 }
 list.innerHTML = timecodes
 .map((tc, i) => {
 const timeStr = formatTime(tc.time);
 let rawLabel = tc.label?.trim() || '';
 const timePattern = /^\d{1,2}:\d{2}(?::\d{2})?\s*[-–—:]?\s*/;
 rawLabel = rawLabel.replace(timePattern, '');
 const beforeDedup = rawLabel;
 rawLabel = removeDuplicateText(rawLabel);
 if (beforeDedup !== rawLabel && rawLabel.length > 0) {
 console.warn('[Timecode] Display deduplicated:', beforeDedup, '->', rawLabel);
 }
 const normalizedTime = timeStr.replace(/^0+:/, '');
 const normalizedLabel = rawLabel.replace(/^0+:/, '');
 const hasCustomLabel =
 rawLabel &&
 rawLabel !== timeStr &&
 normalizedLabel !== normalizedTime &&
 rawLabel !== tc.originalText &&
 rawLabel.length > 0;
 const displayLabel = hasCustomLabel ? rawLabel : '';
 const safeLabel = displayLabel.replace(
 /[<>&"']/g,
 c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]
 );
 const isEditable = !tc.isChapter || tc.isUserAdded;
 return `
 <div class="timecode-item ${tc.isChapter ? 'has-chapter' : ''}" data-time="${tc.time}" data-index="${i}">
 <div class="timecode-time">${timeStr}</div>
 ${safeLabel ? `<div class="timecode-label" title="${safeLabel}">${safeLabel}</div>` : ''}
 <div class="timecode-progress"></div>
 ${
 isEditable
 ? `
 <div class="timecode-actions">
 <button class="timecode-action edit" data-action="edit" title="${t('edit')}">✎</button>
 <button class="timecode-action delete" data-action="delete" title="${t('delete')}">✕</button>
 </div>
 `
 : ''
 }
 </div>
 `;
 })
 .join('');
 };
 const updateActiveItem = activeItem => {
 const items = state.dom.list?.querySelectorAll('.timecode-item');
 if (!items) return;
 items.forEach(item => item.classList.remove('active', 'pulse'));
 if (activeItem) {
 activeItem.classList.add('active', 'pulse');
 setTimeout(() => activeItem.classList.remove('pulse'), 800);
 }
 };
 const startTracking = () => {
 if (state.trackingId) return;
 const track = () => {
 try {
 const video = document.querySelector('video');
 const { panel, currentTime, list } = state.dom;
 if (!video || !panel || panel.classList.contains('hidden') || !config.autoTrackPlayback) {
 if (state.trackingId) {
 cancelAnimationFrame(state.trackingId);
 state.trackingId = 0;
 }
 return;
 }
 if (currentTime && !isNaN(video.currentTime)) {
 currentTime.textContent = formatTime(video.currentTime);
 }
 const items = list?.querySelectorAll('.timecode-item');
 if (items?.length) {
 let activeIndex = -1;
 let nextIndex = -1;
 for (let i = 0; i < items.length; i++) {
 const timeData = items[i].dataset.time;
 if (!timeData) continue;
 const time = parseFloat(timeData);
 if (isNaN(time)) continue;
 if (video.currentTime >= time) {
 activeIndex = i;
 } else if (nextIndex === -1) {
 nextIndex = i;
 }
 }
 if (state.activeIndex !== activeIndex) {
 if (state.activeIndex !== null && state.activeIndex >= 0 && items[state.activeIndex]) {
 items[state.activeIndex].classList.remove('active');
 }
 if (activeIndex >= 0 && items[activeIndex]) {
 items[activeIndex].classList.add('active');
 try {
 items[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
 } catch {
 items[activeIndex].scrollIntoView(false);
 }
 }
 state.activeIndex = activeIndex;
 }
 if (activeIndex >= 0 && nextIndex >= 0 && items[activeIndex]) {
 const currentTimeData = items[activeIndex].dataset.time;
 const nextTimeData = items[nextIndex].dataset.time;
 if (currentTimeData && nextTimeData) {
 const current = parseFloat(currentTimeData);
 const next = parseFloat(nextTimeData);
 if (!isNaN(current) && !isNaN(next) && next > current) {
 const progress = ((video.currentTime - current) / (next - current)) * 100;
 const progressEl = items[activeIndex].querySelector('.timecode-progress');
 if (progressEl) {
 const clampedProgress = Math.min(100, Math.max(0, progress));
 progressEl.style.width = `${clampedProgress}%`;
 }
 }
 }
 }
 }
 if (config.autoTrackPlayback) {
 state.trackingId = requestAnimationFrame(track);
 }
 } catch (error) {
 console.warn('Timecode tracking error:', error);
 if (state.trackingId) {
 cancelAnimationFrame(state.trackingId);
 state.trackingId = 0;
 }
 }
 };
 state.trackingId = requestAnimationFrame(track);
 };
 const stopTracking = () => {
 if (state.trackingId) {
 cancelAnimationFrame(state.trackingId);
 state.trackingId = 0;
 }
 };
 const makeDraggable = panel => {
 const header = panel.querySelector('#timecode-header');
 if (!header) return;
 let startX, startY, startLeft, startTop;
 const mouseDownHandler = e => {
 if (e.button !== 0) return;
 state.dragging = true;
 startX = e.clientX;
 startY = e.clientY;
 const rect = panel.getBoundingClientRect();
 if (!panel.style.left) {
 panel.style.left = `${rect.left}px`;
 }
 if (!panel.style.top) {
 panel.style.top = `${rect.top}px`;
 }
 panel.style.right = 'auto';
 startLeft = parseFloat(panel.style.left) || rect.left;
 startTop = parseFloat(panel.style.top) || rect.top;
 const handleMove = event => {
 if (!state.dragging) return;
 const deltaX = event.clientX - startX;
 const deltaY = event.clientY - startY;
 const { left, top } = clampPanelPosition(panel, startLeft + deltaX, startTop + deltaY);
 panel.style.left = `${left}px`;
 panel.style.top = `${top}px`;
 panel.style.right = 'auto';
 };
 const handleUp = () => {
 if (!state.dragging) return;
 state.dragging = false;
 document.removeEventListener('mousemove', handleMove);
 document.removeEventListener('mouseup', handleUp);
 const rectAfter = panel.getBoundingClientRect();
 const { left, top } = clampPanelPosition(panel, rectAfter.left, rectAfter.top);
 panel.style.left = `${left}px`;
 panel.style.top = `${top}px`;
 panel.style.right = 'auto';
 savePanelPosition(left, top);
 };
 document.addEventListener('mousemove', handleMove);
 document.addEventListener('mouseup', handleUp);
 };
 YouTubeUtils.cleanupManager.registerListener(header, 'mousedown', mouseDownHandler);
 };
 const saveTimecodesToStorage = timecodes => {
 const videoId = new URLSearchParams(window.location.search).get('v');
 if (!videoId) return;
 try {
 const minimal = timecodes.map(tc => ({
 t: tc.time,
 l: tc.label?.trim() || '',
 c: tc.isChapter || false,
 u: tc.isUserAdded || false,
 }));
 localStorage.setItem(`yt_tc_${videoId}`, JSON.stringify(minimal));
 } catch {}
 };
 const loadTimecodesFromStorage = () => {
 const videoId = new URLSearchParams(window.location.search).get('v');
 if (!videoId) return null;
 try {
 const data = localStorage.getItem(`yt_tc_${videoId}`);
 return data
 ? JSON.parse(data)
 .map(tc => ({
 time: tc.t,
 label: tc.l,
 isChapter: tc.c,
 isUserAdded: tc.u || false,
 }))
 .sort((a, b) => a.time - b.time)
 : null;
 } catch {
 return null;
 }
 };
 const getCurrentTimecodes = () => {
 const items = state.dom.list?.querySelectorAll('.timecode-item');
 if (!items) return [];
 return Array.from(items)
 .map(item => {
 const time = parseFloat(item.dataset.time);
 const labelEl = item.querySelector('.timecode-label');
 const label = labelEl?.textContent?.trim() || '';
 return {
 time,
 label: label,
 isChapter: item.classList.contains('has-chapter'),
 isUserAdded: !item.classList.contains('has-chapter') || false,
 };
 })
 .sort((a, b) => a.time - b.time);
 };
 const toggleTimecodePanel = show => {
 document.querySelectorAll('#timecode-panel').forEach(panel => {
 if (panel !== state.dom.panel) panel.remove();
 });
 const panel = state.dom.panel || createTimecodePanel();
 if (show === undefined) show = panel.classList.contains('hidden');
 panel.classList.toggle('hidden', !show);
 if (show) {
 applySavedPanelPosition(panel);
 const saved = loadTimecodesFromStorage();
 if (saved?.length) {
 updateTimecodePanel(saved);
 } else if (config.autoDetect) {
 detectTimecodes().catch(err => console.error('[Timecode] Detection failed:', err));
 }
 if (config.autoTrackPlayback) startTracking();
 } else if (state.trackingId) {
 cancelAnimationFrame(state.trackingId);
 state.trackingId = 0;
 }
 };
 const setupNavigation = () => {
 let currentVideoId = new URLSearchParams(window.location.search).get('v');
 const handleNavigationChange = () => {
 const newVideoId = new URLSearchParams(window.location.search).get('v');
 if (newVideoId === currentVideoId || window.location.pathname !== '/watch') return;
 currentVideoId = newVideoId;
 state.activeIndex = null;
 state.editingIndex = null;
 state.timecodes.clear();
 if (config.enabled && state.dom.panel && !state.dom.panel.classList.contains('hidden')) {
 const saved = loadTimecodesFromStorage();
 if (saved?.length) {
 updateTimecodePanel(saved);
 } else if (config.autoDetect) {
 setTimeout(
 () =>
 detectTimecodes().catch(err => console.error('[Timecode] Detection failed:', err)),
 500
 );
 }
 if (config.autoTrackPlayback) startTracking();
 }
 };
 document.addEventListener('yt-navigate-finish', handleNavigationChange);
 const observer = new MutationObserver(() => {
 const newVideoId = new URLSearchParams(window.location.search).get('v');
 if (newVideoId !== currentVideoId) {
 handleNavigationChange();
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(observer);
 if (document.body) {
 observer.observe(document.body, { subtree: true, childList: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, { subtree: true, childList: true });
 });
 }
 };
 const setupKeyboard = () => {
 document.addEventListener('keydown', e => {
 if (!config.enabled) return;
 const target = (e.target);
 if (target.matches && target.matches('input, textarea, [contenteditable]')) return;
 const { key, shiftKey, altKey, ctrlKey } = config.shortcut;
 if (
 e.key.toUpperCase() === key &&
 e.shiftKey === shiftKey &&
 e.altKey === altKey &&
 e.ctrlKey === ctrlKey
 ) {
 e.preventDefault();
 toggleTimecodePanel();
 }
 });
 };
 const cleanup = () => {
 stopTracking();
 if (state.dom.panel) {
 state.dom.panel.remove();
 state.dom.panel = null;
 }
 };
 const init = () => {
 if (initStarted) return;
 const appRoot =
 (typeof YouTubeUtils?.querySelector === 'function' &&
 YouTubeUtils.querySelector('ytd-app')) ||
 document.querySelector('ytd-app');
 if (!appRoot) {
 scheduleInitRetry();
 return;
 }
 initStarted = true;
 loadSettings();
 insertTimecodeStyles();
 setupKeyboard();
 setupNavigation();
 const observer = new MutationObserver(mutations => {
 for (const mutation of mutations) {
 for (const node of mutation.addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addTimecodePanelSettings, 100);
 return;
 }
 }
 }
 if (
 document.querySelector(
 '.ytp-plus-settings-section[data-section="advanced"]:not(.hidden)'
 ) &&
 !document.querySelector('.timecode-settings-item')
 ) {
 setTimeout(addTimecodePanelSettings, 50);
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(observer);
 if (document.body) {
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 attributes: true,
 attributeFilter: ['class'],
 });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 attributes: true,
 attributeFilter: ['class'],
 });
 });
 }
 const clickHandler = e => {
 if (
 (e.target).classList?.contains('ytp-plus-settings-nav-item') &&
 (e.target).dataset.section === 'advanced'
 ) {
 setTimeout(addTimecodePanelSettings, 50);
 }
 };
 YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler, true);
 if (config.enabled && !state.resizeListenerKey) {
 const onResize = YouTubeUtils.throttle(() => {
 if (!state.dom.panel) return;
 const rect = state.dom.panel.getBoundingClientRect();
 const { left, top } = clampPanelPosition(state.dom.panel, rect.left, rect.top);
 state.dom.panel.style.left = `${left}px`;
 state.dom.panel.style.top = `${top}px`;
 state.dom.panel.style.right = 'auto';
 savePanelPosition(left, top);
 }, 200);
 state.resizeListenerKey = YouTubeUtils.cleanupManager.registerListener(
 window,
 'resize',
 onResize
 );
 }
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init, { once: true });
 } else {
 init();
 }
 window.addEventListener('beforeunload', cleanup);
})();
(function () {
 'use strict';
 if (window._playlistSearchInitialized) return;
 window._playlistSearchInitialized = true;
 const t = (key, params = {}) => {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 };
 const debounce = (func, wait) => {
 let timeout;
 return function executedFunction(...args) {
 const later = () => {
 clearTimeout(timeout);
 func(...args);
 };
 clearTimeout(timeout);
 timeout = setTimeout(later, wait);
 };
 };
 const throttle = (func, limit) => {
 let inThrottle;
 return function executedFunction(...args) {
 if (!inThrottle) {
 func(...args);
 inThrottle = true;
 setTimeout(() => (inThrottle = false), limit);
 }
 };
 };
 const config = {
 enabled: true,
 storageKey: 'youtube_playlist_search_settings',
 searchDebounceMs: 150,
 observerThrottleMs: 300,
 maxPlaylistItems: 10000,
 maxQueryLength: 300,
 };
 const state = {
 searchInput: null,
 searchResults: null,
 originalItems: [],
 currentPlaylistId: null,
 mutationObserver: null,
 rafId: null,
 itemsCache: new Map(),
 };
 const loadSettings = () => {
 try {
 const saved = localStorage.getItem(config.storageKey);
 if (saved) {
 const parsed = JSON.parse(saved);
 if (window.YouTubeUtils && window.YouTubeUtils.safeMerge) {
 window.YouTubeUtils.safeMerge(config, parsed);
 } else {
 if (typeof parsed.enabled === 'boolean') config.enabled = parsed.enabled;
 }
 }
 } catch (error) {
 console.warn('[Playlist Search] Failed to load settings:', error);
 }
 };
 const getCurrentPlaylistId = () => {
 try {
 const urlParams = new URLSearchParams(window.location.search);
 const listId = urlParams.get('list');
 if (listId && /^[a-zA-Z0-9_-]+$/.test(listId)) {
 return listId;
 }
 return null;
 } catch (error) {
 console.warn('[Playlist Search] Failed to get playlist ID:', error);
 return null;
 }
 };
 const getPlaylistDisplayName = (playlistPanel, listId) => {
 try {
 const sel = ['.title', 'h3 a', '#header-title', '#title', '.playlist-title', 'h1.title'];
 for (const s of sel) {
 const el = playlistPanel.querySelector(s) || document.querySelector(s);
 if (el && el.textContent && el.textContent.trim()) {
 const title = el.textContent.trim();
 return title.length > 100 ? title.substring(0, 100) + '...' : title;
 }
 }
 const meta =
 document.querySelector('meta[name="title"]') ||
 document.querySelector('meta[property="og:title"]');
 if (meta && meta.content) {
 const title = meta.content.trim();
 return title.length > 100 ? title.substring(0, 100) + '...' : title;
 }
 } catch (error) {
 console.warn('[Playlist Search] Failed to get display name:', error);
 }
 if (listId && typeof listId === 'string') {
 return listId.substring(0, 50);
 }
 return 'playlist';
 };
 const addSearchUI = () => {
 if (!config.enabled) return;
 const playlistId = getCurrentPlaylistId();
 if (!playlistId) return;
 const playlistPanel = document.querySelector('ytd-playlist-panel-renderer');
 if (!playlistPanel) {
 const observer = new MutationObserver((_mutations, obs) => {
 const panel = document.querySelector('ytd-playlist-panel-renderer');
 if (panel) {
 obs.disconnect();
 addSearchUI();
 }
 });
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 });
 setTimeout(() => observer.disconnect(), 5000);
 return;
 }
 if (playlistPanel.querySelector('.ytplus-playlist-search')) return;
 state.currentPlaylistId = playlistId;
 const searchContainer = document.createElement('div');
 searchContainer.className = 'ytplus-playlist-search';
 searchContainer.style.cssText = `
 padding: 8px 16px;
 background: transparent;
 border-bottom: 1px solid var(--yt-spec-10-percent-layer);
 position: sticky;
 top: 0;
 z-index: 1;
 `;
 const searchInput = document.createElement('input');
 searchInput.type = 'text';
 const playlistName = getPlaylistDisplayName(playlistPanel, playlistId);
 searchInput.placeholder = t('searchPlaceholder').replace('{playlist}', playlistName);
 searchInput.className = 'ytplus-playlist-search-input';
 searchInput.style.cssText = `
 width: 93%;
 padding: 8px 16px;
 border: 1px solid var(--yt-spec-10-percent-layer);
 border-radius: 20px;
 background: var(--yt-spec-badge-chip-background);
 color: var(--yt-spec-text-primary);
 font-size: 14px;
 font-family: 'Roboto', Arial, sans-serif;
 outline: none;
 transition: border-color 0.2s;
 `;
 searchInput.addEventListener('focus', () => {
 searchInput.style.borderColor = 'var(--yt-spec-call-to-action)';
 });
 searchInput.addEventListener('blur', () => {
 searchInput.style.borderColor = 'var(--yt-spec-10-percent-layer)';
 });
 const debouncedFilter = debounce(value => {
 if (value.length > config.maxQueryLength) {
 searchInput.value = value.substring(0, config.maxQueryLength);
 return;
 }
 filterPlaylistItems(value);
 }, config.searchDebounceMs);
 searchInput.addEventListener(
 'input',
 e => {
 const target = (e.target);
 debouncedFilter(target.value);
 },
 { passive: true }
 );
 searchContainer.appendChild(searchInput);
 state.searchInput = searchInput;
 const rawItemsContainer =
 playlistPanel.querySelector('#items') ||
 playlistPanel.querySelector('.playlist-items.style-scope.ytd-playlist-panel-renderer') ||
 playlistPanel.querySelector('.playlist-items');
 if (rawItemsContainer) {
 const itemsContainer = (
 (rawItemsContainer)
 );
 const firstVideo = itemsContainer.querySelector('ytd-playlist-panel-video-renderer');
 if (firstVideo && firstVideo.parentElement === itemsContainer) {
 itemsContainer.insertBefore(searchContainer, (firstVideo));
 } else {
 itemsContainer.appendChild(searchContainer);
 }
 } else {
 if (playlistPanel.firstChild) {
 playlistPanel.insertBefore(searchContainer, playlistPanel.firstChild);
 } else {
 playlistPanel.appendChild(searchContainer);
 }
 }
 collectOriginalItems();
 setupPlaylistObserver();
 };
 const setupPlaylistObserver = () => {
 if (state.mutationObserver) {
 state.mutationObserver.disconnect();
 }
 const playlistPanel = document.querySelector('ytd-playlist-panel-renderer');
 if (!playlistPanel) return;
 let lastUpdateCount = state.originalItems.length;
 let updateScheduled = false;
 const handleMutations = throttle(mutations => {
 if (updateScheduled) return;
 const hasRelevantChange = mutations.some(mutation => {
 if (mutation.type !== 'childList') return false;
 if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) return false;
 for (let i = 0; i < mutation.addedNodes.length; i++) {
 const node = mutation.addedNodes[i];
 if (node.nodeType === 1) {
 const element = (node);
 if (element.tagName === 'YTD-PLAYLIST-PANEL-VIDEO-RENDERER') return true;
 }
 }
 for (let i = 0; i < mutation.removedNodes.length; i++) {
 const node = mutation.removedNodes[i];
 if (node.nodeType === 1) {
 const element = (node);
 if (element.tagName === 'YTD-PLAYLIST-PANEL-VIDEO-RENDERER') return true;
 }
 }
 return false;
 });
 if (!hasRelevantChange) return;
 updateScheduled = true;
 requestAnimationFrame(() => {
 const currentCount = lastUpdateCount;
 const newItems = document.querySelectorAll(
 'ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer'
 );
 if (newItems.length !== currentCount) {
 lastUpdateCount = newItems.length;
 collectOriginalItems();
 if (state.searchInput && state.searchInput.value) {
 filterPlaylistItems(state.searchInput.value);
 }
 }
 updateScheduled = false;
 });
 }, config.observerThrottleMs);
 state.mutationObserver = new MutationObserver(handleMutations);
 const itemsContainer = playlistPanel.querySelector('#items, .playlist-items');
 const targetElement = itemsContainer || playlistPanel;
 state.mutationObserver.observe(targetElement, {
 childList: true,
 subtree: itemsContainer ? false : true,
 });
 };
 const collectOriginalItems = () => {
 const items = document.querySelectorAll(
 'ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer'
 );
 if (items.length > config.maxPlaylistItems) {
 console.warn(
 `[Playlist Search] Playlist has ${items.length} items, limiting to ${config.maxPlaylistItems}`
 );
 }
 const currentVideoIds = new Set();
 const itemsArray = Array.from(items).slice(0, config.maxPlaylistItems);
 state.originalItems = itemsArray.map((item, index) => {
 const videoId = item.getAttribute('video-id') || `item-${index}`;
 currentVideoIds.add(videoId);
 if (state.itemsCache.has(videoId)) {
 const cached = state.itemsCache.get(videoId);
 if (cached.element === item) {
 return cached;
 }
 }
 const titleEl = item.querySelector('#video-title');
 const bylineEl = item.querySelector('#byline');
 const title = titleEl?.textContent || '';
 const channel = bylineEl?.textContent || '';
 const itemData = {
 element: item,
 videoId,
 titleOriginal: title,
 channelOriginal: channel,
 title: title.trim().toLowerCase(),
 channel: channel.trim().toLowerCase(),
 };
 state.itemsCache.set(videoId, itemData);
 return itemData;
 });
 for (const [videoId] of state.itemsCache) {
 if (!currentVideoIds.has(videoId)) {
 state.itemsCache.delete(videoId);
 }
 }
 };
 const filterPlaylistItems = query => {
 if (state.rafId) {
 cancelAnimationFrame(state.rafId);
 }
 if (query && typeof query !== 'string') {
 console.warn('[Playlist Search] Invalid query type');
 return;
 }
 if (query && query.length > config.maxQueryLength) {
 query = query.substring(0, config.maxQueryLength);
 }
 if (!query || query.trim() === '') {
 state.rafId = requestAnimationFrame(() => {
 state.originalItems.forEach(item => {
 item.element.style.display = '';
 });
 state.rafId = null;
 });
 return;
 }
 const searchTerm = query.toLowerCase().trim();
 let visibleCount = 0;
 state.rafId = requestAnimationFrame(() => {
 const updates = [];
 state.originalItems.forEach(item => {
 const matches = item.title.includes(searchTerm) || item.channel.includes(searchTerm);
 if (matches) {
 if (item.element.style.display === 'none') {
 updates.push({ element: item.element, display: '' });
 }
 visibleCount++;
 } else {
 if (item.element.style.display !== 'none') {
 updates.push({ element: item.element, display: 'none' });
 }
 }
 });
 updates.forEach(update => {
 update.element.style.display = update.display;
 });
 updateResultsCount(visibleCount, state.originalItems.length);
 state.rafId = null;
 });
 };
 const updateResultsCount = (visible, total) => {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(`[Playlist Search] Showing ${visible} of ${total} videos`);
 };
 const cleanup = () => {
 const searchUI = document.querySelector('.ytplus-playlist-search');
 if (searchUI) {
 searchUI.remove();
 }
 if (state.mutationObserver) {
 state.mutationObserver.disconnect();
 state.mutationObserver = null;
 }
 if (state.rafId) {
 cancelAnimationFrame(state.rafId);
 state.rafId = null;
 }
 state.itemsCache.clear();
 state.searchInput = null;
 state.originalItems = [];
 state.currentPlaylistId = null;
 };
 const handleNavigation = debounce(() => {
 const newPlaylistId = getCurrentPlaylistId();
 if (
 newPlaylistId === state.currentPlaylistId &&
 document.querySelector('.ytplus-playlist-search')
 ) {
 return;
 }
 cleanup();
 if (newPlaylistId) {
 setTimeout(addSearchUI, 300);
 }
 }, 250);
 const init = () => {
 loadSettings();
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', addSearchUI, { once: true });
 } else {
 addSearchUI();
 }
 document.addEventListener('yt-navigate-finish', handleNavigation);
 window.addEventListener('beforeunload', cleanup);
 };
 init();
})();
(function () {
 'use strict';
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 function extractVideoId(thumbnailSrc) {
 try {
 if (!thumbnailSrc || typeof thumbnailSrc !== 'string') return null;
 const match = thumbnailSrc.match(/\/vi\/([^\/]+)\//);
 const videoId = match ? match[1] : null;
 if (videoId && !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
 console.warn('[YouTube+][Thumbnail]', 'Invalid video ID format:', videoId);
 return null;
 }
 return videoId;
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Error extracting video ID:', error);
 return null;
 }
 }
 function extractShortsId(href) {
 try {
 if (!href || typeof href !== 'string') return null;
 const match = href.match(/\/shorts\/([^\/\?]+)/);
 const shortsId = match ? match[1] : null;
 if (shortsId && !/^[a-zA-Z0-9_-]{11}$/.test(shortsId)) {
 console.warn('[YouTube+][Thumbnail]', 'Invalid shorts ID format:', shortsId);
 return null;
 }
 return shortsId;
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Error extracting shorts ID:', error);
 return null;
 }
 }
 function isValidUrlString(url) {
 if (!url || typeof url !== 'string') {
 console.warn('[YouTube+][Thumbnail]', 'Invalid URL provided');
 return false;
 }
 return true;
 }
 function hasValidProtocol(parsedUrl) {
 if (parsedUrl.protocol !== 'https:') {
 console.warn('[YouTube+][Thumbnail]', 'Only HTTPS URLs are allowed');
 return false;
 }
 return true;
 }
 function hasValidDomain(parsedUrl) {
 const { hostname } = parsedUrl;
 if (!hostname.endsWith('ytimg.com') && !hostname.endsWith('youtube.com')) {
 console.warn('[YouTube+][Thumbnail]', 'Only YouTube image domains are allowed');
 return false;
 }
 return true;
 }
 function parseAndValidateUrl(url) {
 try {
 const parsedUrl = new URL(url);
 if (!hasValidProtocol(parsedUrl)) return null;
 if (!hasValidDomain(parsedUrl)) return null;
 return parsedUrl;
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Invalid URL:', error);
 return null;
 }
 }
 async function checkViaHeadRequest(url) {
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 5000);
 try {
 const response = await fetch(url, {
 method: 'HEAD',
 signal: controller.signal,
 }).catch(() => null);
 clearTimeout(timeoutId);
 return response ? response.ok : true;
 } catch {
 clearTimeout(timeoutId);
 return null;
 }
 }
 function cleanupImageElement(img) {
 if (img.parentNode) {
 document.body.removeChild(img);
 }
 }
 function checkViaImageLoad(url) {
 return new Promise(resolve => {
 const img = document.createElement('img');
 img.style.display = 'none';
 const timeout = setTimeout(() => {
 cleanupImageElement(img);
 resolve(false);
 }, 3000);
 img.onload = () => {
 clearTimeout(timeout);
 cleanupImageElement(img);
 resolve(true);
 };
 img.onerror = () => {
 clearTimeout(timeout);
 cleanupImageElement(img);
 resolve(false);
 };
 document.body.appendChild(img);
 img.src = url;
 });
 }
 async function checkImageExists(url) {
 try {
 if (!isValidUrlString(url)) return false;
 const parsedUrl = parseAndValidateUrl(url);
 if (!parsedUrl) return false;
 const headResult = await checkViaHeadRequest(url);
 if (headResult !== null) return headResult;
 return await checkViaImageLoad(url);
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Error checking image:', error);
 return false;
 }
 }
 function createSpinner() {
 const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 spinner.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
 spinner.setAttribute('width', '16');
 spinner.setAttribute('height', '16');
 spinner.setAttribute('viewBox', '0 0 24 24');
 spinner.setAttribute('fill', 'none');
 spinner.setAttribute('stroke', 'white');
 spinner.setAttribute('stroke-width', '2');
 spinner.setAttribute('stroke-linecap', 'round');
 spinner.setAttribute('stroke-linejoin', 'round');
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute('d', 'M21 12a9 9 0 1 1-6.219-8.56');
 spinner.appendChild(path);
 spinner.style.animation = 'spin 1s linear infinite';
 if (!document.querySelector('#spinner-keyframes')) {
 const style = document.createElement('style');
 style.id = 'spinner-keyframes';
 style.textContent = `
 @keyframes spin {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
 }
 `;
 (document.head || document.documentElement).appendChild(style);
 }
 return spinner;
 }
 function isValidVideoId(videoId) {
 return videoId && typeof videoId === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(videoId);
 }
 function isValidOverlayElement(overlayElement) {
 return overlayElement && overlayElement instanceof HTMLElement;
 }
 function getShortsThumbnailUrls(videoId) {
 return {
 primary: `https://i.ytimg.com/vi/${videoId}/oardefault.jpg`,
 fallback: `https://i.ytimg.com/vi/${videoId}/oar2.jpg`,
 };
 }
 function getVideoThumbnailUrls(videoId) {
 return {
 primary: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
 fallback: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
 };
 }
 async function loadAndShowThumbnail(videoId, isShorts) {
 const urls = isShorts ? getShortsThumbnailUrls(videoId) : getVideoThumbnailUrls(videoId);
 const isPrimaryAvailable = await checkImageExists(urls.primary);
 showImageModal(isPrimaryAvailable ? urls.primary : urls.fallback);
 }
 function replaceWithSpinner(overlayElement, originalSvg) {
 const spinner = createSpinner();
 overlayElement.replaceChild(spinner, originalSvg);
 return spinner;
 }
 function restoreOriginalSvg(overlayElement, spinner, originalSvg) {
 try {
 if (spinner && spinner.parentNode) {
 overlayElement.replaceChild(originalSvg, spinner);
 }
 } catch (restoreError) {
 console.error('[YouTube+][Thumbnail]', 'Error restoring original SVG:', restoreError);
 if (spinner && spinner.parentNode) {
 spinner.parentNode.removeChild(spinner);
 }
 }
 }
 async function openThumbnail(videoId, isShorts, overlayElement) {
 try {
 if (!isValidVideoId(videoId)) {
 console.error('[YouTube+][Thumbnail]', 'Invalid video ID:', videoId);
 return;
 }
 if (!isValidOverlayElement(overlayElement)) {
 console.error('[YouTube+][Thumbnail]', 'Invalid overlay element');
 return;
 }
 const originalSvg = overlayElement.querySelector('svg');
 if (!originalSvg) {
 console.warn('[YouTube+][Thumbnail]', 'No SVG found in overlay element');
 return;
 }
 const spinner = replaceWithSpinner(overlayElement, originalSvg);
 try {
 await loadAndShowThumbnail(videoId, isShorts);
 } finally {
 restoreOriginalSvg(overlayElement, spinner, originalSvg);
 }
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Error opening thumbnail:', error);
 }
 }
 (function addThumbnailStyles() {
 try {
 const css = `
 :root { --thumbnail-btn-bg-light: rgba(255, 255, 255, 0.85); --thumbnail-btn-bg-dark: rgba(0, 0, 0, 0.7); --thumbnail-btn-hover-bg-light: rgba(255, 255, 255, 1); --thumbnail-btn-hover-bg-dark: rgba(0, 0, 0, 0.9); --thumbnail-btn-color-light: #222; --thumbnail-btn-color-dark: #fff; --thumbnail-modal-bg-light: rgba(255, 255, 255, 0.95); --thumbnail-modal-bg-dark: rgba(34, 34, 34, 0.85); --thumbnail-modal-title-light: #222; --thumbnail-modal-title-dark: #fff; --thumbnail-modal-btn-bg-light: rgba(0, 0, 0, 0.08); --thumbnail-modal-btn-bg-dark: rgba(255, 255, 255, 0.08); --thumbnail-modal-btn-hover-bg-light: rgba(0, 0, 0, 0.18); --thumbnail-modal-btn-hover-bg-dark: rgba(255, 255, 255, 0.18); --thumbnail-modal-btn-color-light: #222; --thumbnail-modal-btn-color-dark: #fff; --thumbnail-modal-btn-hover-color-light: #ff4444; --thumbnail-modal-btn-hover-color-dark: #ff4444; --thumbnail-glass-blur: blur(18px) saturate(180%); --thumbnail-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); --thumbnail-glass-border: rgba(255, 255, 255, 0.2); }
 html[dark], body[dark] { --thumbnail-btn-bg: var(--thumbnail-btn-bg-dark); --thumbnail-btn-hover-bg: var(--thumbnail-btn-hover-bg-dark); --thumbnail-btn-color: var(--thumbnail-btn-color-dark); --thumbnail-modal-bg: var(--thumbnail-modal-bg-dark); --thumbnail-modal-title: var(--thumbnail-modal-title-dark); --thumbnail-modal-btn-bg: var(--thumbnail-modal-btn-bg-dark); --thumbnail-modal-btn-hover-bg: var(--thumbnail-modal-btn-hover-bg-dark); --thumbnail-modal-btn-color: var(--thumbnail-modal-btn-color-dark); --thumbnail-modal-btn-hover-color: var(--thumbnail-modal-btn-hover-color-dark); }
 html:not([dark]) { --thumbnail-btn-bg: var(--thumbnail-btn-bg-light); --thumbnail-btn-bg: var(--thumbnail-btn-bg-light); --thumbnail-btn-hover-bg: var(--thumbnail-btn-hover-bg-light); --thumbnail-btn-color: var(--thumbnail-btn-color-light); --thumbnail-modal-bg: var(--thumbnail-modal-bg-light); --thumbnail-modal-title: var(--thumbnail-modal-title-light); --thumbnail-modal-btn-bg: var(--thumbnail-modal-btn-bg-light); --thumbnail-modal-btn-hover-bg: var(--thumbnail-modal-btn-hover-bg-light); --thumbnail-modal-btn-color: var(--thumbnail-modal-btn-color-light); --thumbnail-modal-btn-hover-color: var(--thumbnail-modal-btn-hover-color-light); }
 .thumbnail-overlay-container { position: absolute; bottom: 8px; left: 8px; z-index: 9999; opacity: 0; transition: opacity 0.2s ease; }
 .thumbnail-overlay-button { width: 28px; height: 28px; background: var(--thumbnail-btn-bg); border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--thumbnail-btn-color); position: relative; box-shadow: var(--thumbnail-glass-shadow); backdrop-filter: var(--thumbnail-glass-blur); -webkit-backdrop-filter: var(--thumbnail-glass-blur); border: 1px solid var(--thumbnail-glass-border); }
 .thumbnail-overlay-button:hover { background: var(--thumbnail-btn-hover-bg); }
 .thumbnail-dropdown { position: absolute; bottom: 100%; left: 0; background: var(--thumbnail-btn-hover-bg); border-radius: 8px; padding: 4px; margin-bottom: 4px; display: none; flex-direction: column; min-width: 140px; box-shadow: var(--thumbnail-glass-shadow); z-index: 10000; backdrop-filter: var(--thumbnail-glass-blur); -webkit-backdrop-filter: var(--thumbnail-glass-blur); border: 1px solid var(--thumbnail-glass-border); }
 .thumbnail-dropdown.show { display: flex !important; }
 .thumbnail-dropdown-item { background: none; border: none; color: var(--thumbnail-btn-color); padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 12px; text-align: left; white-space: nowrap; transition: background-color 0.2s ease; }
 .thumbnail-dropdown-item:hover { background: rgba(255,255,255,0.06); }
 .thumbnailPreview-button { position: absolute; bottom: 10px; left: 5px; background-color: var(--thumbnail-btn-bg); color: var(--thumbnail-btn-color); border: none; border-radius: 6px; padding: 3px; font-size: 18px; cursor: pointer; z-index: 2000; opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center; box-shadow: var(--thumbnail-glass-shadow); backdrop-filter: var(--thumbnail-glass-blur); -webkit-backdrop-filter: var(--thumbnail-glass-blur); border: 1px solid var(--thumbnail-glass-border); }
 .thumbnailPreview-container { position: relative; }
 .thumbnailPreview-container:hover .thumbnailPreview-button { opacity: 1; }
 .thumbnail-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); z-index: 100000; display: flex; align-items: center; justify-content: center; animation: fadeInModal 0.22s cubic-bezier(.4,0,.2,1); backdrop-filter: blur(8px) saturate(140%); -webkit-backdrop-filter: blur(8px) saturate(140%); }
 .thumbnail-modal-content { background: var(--thumbnail-modal-bg); border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.45); max-width: 78vw; max-height: 90vh; overflow: auto; position: relative; display: flex; flex-direction: column; align-items: center; animation: scaleInModal 0.22s cubic-bezier(.4,0,.2,1); border: 1.5px solid var(--thumbnail-glass-border); backdrop-filter: blur(14px) saturate(150%); -webkit-backdrop-filter: blur(14px) saturate(150%);}
 .thumbnail-modal-wrapper { display: flex; align-items: flex-start; gap: 12px; }
 .thumbnail-modal-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
 .thumbnail-modal-action-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--thumbnail-modal-btn-bg); border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.2); transition: transform 0.12s ease, background 0.12s ease; color: var(--thumbnail-modal-btn-color); }
 .thumbnail-modal-action-btn:hover { transform: translateY(-2px); }
 .thumbnail-modal-close { }
 .thumbnail-modal-open { }
 .thumbnail-modal-img { max-width: 72vw; max-height: 70vh; box-shadow: var(--thumbnail-glass-shadow); background: #222; border: 1px solid var(--thumbnail-glass-border); }
 .thumbnail-modal-options { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
 .thumbnail-modal-option-btn { background: var(--thumbnail-modal-btn-bg); color: var(--thumbnail-modal-btn-color); border: none; border-radius: 8px; padding: 8px 18px; font-size: 14px; cursor: pointer; transition: background 0.2s; margin-bottom: 6px; box-shadow: var(--thumbnail-glass-shadow); backdrop-filter: var(--thumbnail-glass-blur); -webkit-backdrop-filter: var(--thumbnail-glass-blur); border: 1px solid var(--thumbnail-glass-border); }
 .thumbnail-modal-option-btn:hover { background: var(--thumbnail-modal-btn-hover-bg); color: var(--thumbnail-modal-btn-hover-color); }
 .thumbnail-modal-title { font-size: 18px; font-weight: 600; color: var(--thumbnail-modal-title); margin-bottom: 10px; text-align: center; text-shadow: 0 2px 8px rgba(0,0,0,0.15); }
 @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
 @keyframes scaleInModal { from { transform: scale(0.95); } to { transform: scale(1); } }
 `;
 if (
 window.YouTubeUtils &&
 YouTubeUtils.StyleManager &&
 typeof YouTubeUtils.StyleManager.add === 'function'
 ) {
 YouTubeUtils.StyleManager.add('thumbnail-viewer-styles', css);
 } else {
 const s = document.createElement('style');
 s.id = 'ytplus-thumbnail-styles';
 s.textContent = css;
 (document.head || document.documentElement).appendChild(s);
 }
 } catch {
 if (!document.getElementById('ytplus-thumbnail-styles')) {
 const s = document.createElement('style');
 s.id = 'ytplus-thumbnail-styles';
 s.textContent = '.thumbnail-modal-img{max-width:72vw;max-height:70vh;}';
 (document.head || document.documentElement).appendChild(s);
 }
 }
 })();
 function validateModalUrl(url) {
 if (!url || typeof url !== 'string') {
 console.error('[YouTube+][Thumbnail]', 'Invalid URL provided to modal');
 return false;
 }
 try {
 const parsedUrl = new URL(url);
 if (parsedUrl.protocol !== 'https:') {
 console.error('[YouTube+][Thumbnail]', 'Only HTTPS URLs are allowed');
 return false;
 }
 const allowedDomains = ['ytimg.com', 'youtube.com', 'ggpht.com', 'googleusercontent.com'];
 if (!allowedDomains.some(d => parsedUrl.hostname.endsWith(d))) {
 console.error('[YouTube+][Thumbnail]', 'Image domain not allowed:', parsedUrl.hostname);
 return false;
 }
 return true;
 } catch (urlError) {
 console.error('[YouTube+][Thumbnail]', 'Invalid URL format:', urlError);
 return false;
 }
 }
 function createModalImage(url) {
 const img = document.createElement('img');
 img.className = 'thumbnail-modal-img';
 img.src = url;
 img.alt = t('thumbnailPreview');
 img.title = '';
 img.style.cursor = 'pointer';
 img.addEventListener('click', () => window.open(img.src, '_blank'));
 return img;
 }
 function createCloseButton(overlay) {
 const closeBtn = document.createElement('button');
 closeBtn.className = 'thumbnail-modal-close thumbnail-modal-action-btn';
 closeBtn.innerHTML = `\n <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>\n            </svg>\n `;
 closeBtn.title = t('close');
 closeBtn.setAttribute('aria-label', t('close'));
 closeBtn.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 overlay.remove();
 });
 return closeBtn;
 }
 function createNewTabButton(img) {
 const newTabBtn = document.createElement('button');
 newTabBtn.className = 'thumbnail-modal-open thumbnail-modal-action-btn';
 newTabBtn.innerHTML = `\n <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">\n        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>\n <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>\n        <g id="SVGRepo_iconCarrier"><path d="M14.293,9.707a1,1,0,0,1,0-1.414L18.586,4H16a1,1,0,0,1,0-2h5a1,1,0,0,1,1,1V8a1,1,0,0,1-2,0V5.414L15.707,9.707a1,1,0,0,1-1.414,0ZM3,22H8a1,1,0,0,0,0-2H5.414l4.293-4.293a1,1,0,0,0-1.414-1.414L4,18.586V16a1,1,0,0,0-2,0v5A1,1,0,0,0,3,22Z"></path></g>\n      </svg>\n `;
 newTabBtn.title = t('clickToOpen');
 newTabBtn.setAttribute('aria-label', t('clickToOpen'));
 newTabBtn.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 window.open(img.src, '_blank');
 });
 return newTabBtn;
 }
 async function downloadImageAsBlob(imgSrc) {
 const response = await fetch(imgSrc);
 if (!response.ok) throw new Error('Network response was not ok');
 const blob = await response.blob();
 const blobUrl = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = blobUrl;
 try {
 const urlObj = new URL(imgSrc);
 const segments = urlObj.pathname.split('/');
 a.download = segments[segments.length - 1] || 'thumbnail.jpg';
 } catch {
 a.download = 'thumbnail.jpg';
 }
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
 }
 function createDownloadButton(img) {
 const downloadBtn = document.createElement('button');
 downloadBtn.className = 'thumbnail-modal-download thumbnail-modal-action-btn';
 downloadBtn.innerHTML = `\n <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>\n                <polyline points="7 10 12 15 17 10"/>\n <line x1="12" y1="15" x2="12" y2="3"/>\n            </svg>\n `;
 downloadBtn.title = t('download');
 downloadBtn.setAttribute('aria-label', t('download'));
 downloadBtn.addEventListener('click', async e => {
 e.preventDefault();
 e.stopPropagation();
 try {
 await downloadImageAsBlob(img.src);
 } catch {
 window.open(img.src, '_blank');
 }
 });
 return downloadBtn;
 }
 function setupModalKeyboard(overlay) {
 function escHandler(e) {
 if (e.key === 'Escape') {
 overlay.remove();
 window.removeEventListener('keydown', escHandler, true);
 }
 }
 window.addEventListener('keydown', escHandler, true);
 }
 function setupImageErrorHandler(img, content) {
 img.addEventListener('error', () => {
 const err = document.createElement('div');
 err.textContent = t('thumbnailLoadFailed');
 err.style.color = 'white';
 content.appendChild(err);
 });
 }
 function showImageModal(url) {
 try {
 if (!validateModalUrl(url)) return;
 document.querySelectorAll('.thumbnail-modal-overlay').forEach(m => m.remove());
 const overlay = document.createElement('div');
 overlay.className = 'thumbnail-modal-overlay';
 const content = document.createElement('div');
 content.className = 'thumbnail-modal-content';
 const img = createModalImage(url);
 const optionsDiv = document.createElement('div');
 optionsDiv.className = 'thumbnail-modal-options';
 const closeBtn = createCloseButton(overlay);
 const newTabBtn = createNewTabButton(img);
 const downloadBtn = createDownloadButton(img);
 content.appendChild(img);
 content.appendChild(optionsDiv);
 const wrapper = document.createElement('div');
 wrapper.className = 'thumbnail-modal-wrapper';
 const actionsDiv = document.createElement('div');
 actionsDiv.className = 'thumbnail-modal-actions';
 actionsDiv.appendChild(closeBtn);
 actionsDiv.appendChild(newTabBtn);
 actionsDiv.appendChild(downloadBtn);
 wrapper.appendChild(content);
 wrapper.appendChild(actionsDiv);
 overlay.appendChild(wrapper);
 overlay.addEventListener('click', ({ target }) => {
 if (target === overlay) overlay.remove();
 });
 setupModalKeyboard(overlay);
 setupImageErrorHandler(img, content);
 document.body.appendChild(overlay);
 } catch (error) {
 console.error('[YouTube+][Thumbnail]', 'Error showing modal:', error);
 }
 }
 let thumbnailPreviewCurrentVideoId = '';
 let thumbnailPreviewClosed = false;
 let thumbnailInsertionAttempts = 0;
 const MAX_ATTEMPTS = 10;
 const RETRY_DELAY = 500;
 function isWatchPage() {
 const url = new URL(window.location.href);
 return url.pathname === '/watch' && url.searchParams.has('v');
 }
 function getCurrentVideoId() {
 return new URLSearchParams(window.location.search).get('v');
 }
 function removeOldOverlay() {
 const oldOverlay = document.querySelector('#thumbnailPreview-player-overlay');
 if (oldOverlay) {
 oldOverlay.remove();
 }
 }
 function shouldSkipThumbnailUpdate(newVideoId) {
 return !newVideoId || newVideoId === thumbnailPreviewCurrentVideoId || thumbnailPreviewClosed;
 }
 function findPlayerElement() {
 return document.querySelector('#movie_player') || document.querySelector('ytd-player');
 }
 function createPlayerThumbnailOverlay(videoId, player) {
 const overlay = (createThumbnailOverlay(videoId, player));
 overlay.id = 'thumbnailPreview-player-overlay';
 overlay.dataset.videoId = videoId;
 overlay.style.cssText = `
 position: absolute;
 top: 10%;
 right: 8px;
 width: 36px;
 height: 36px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 6px;
 cursor: pointer;
 z-index: 1001;
 transition: all 0.15s ease;
 opacity: 0;
 `;
 return overlay;
 }
 function attemptInsertion() {
 const player = findPlayerElement();
 if (!player) {
 thumbnailInsertionAttempts++;
 if (thumbnailInsertionAttempts < MAX_ATTEMPTS) {
 setTimeout(attemptInsertion, RETRY_DELAY);
 } else {
 thumbnailInsertionAttempts = 0;
 }
 return;
 }
 const overlayId = 'thumbnailPreview-player-overlay';
 let overlay = player.querySelector(`#${overlayId}`);
 if (!overlay) {
 overlay = createPlayerThumbnailOverlay(thumbnailPreviewCurrentVideoId, player);
 overlay.tabIndex = 0;
 overlay.onmouseenter = () => {
 try {
 overlay.style.opacity = '0.5';
 } catch {}
 };
 overlay.onmouseleave = () => {
 try {
 overlay.style.opacity = '0';
 } catch {}
 };
 overlay.onfocus = () => {
 try {
 overlay.style.opacity = '0.5';
 } catch {}
 };
 overlay.onblur = () => {
 try {
 overlay.style.opacity = '0';
 } catch {}
 };
 overlay.addEventListener('keydown', e => {
 const ke = (e);
 if (ke && (ke.key === 'Enter' || ke.key === ' ')) {
 ke.preventDefault();
 overlay.click();
 }
 });
 const playerAny = (player);
 if ( (getComputedStyle(playerAny)).position === 'static') {
 playerAny.style.position = 'relative';
 }
 playerAny.appendChild(overlay);
 return;
 }
 if (overlay.dataset.videoId !== thumbnailPreviewCurrentVideoId) {
 overlay.remove();
 attemptInsertion();
 }
 thumbnailInsertionAttempts = 0;
 }
 function addOrUpdateThumbnailImage() {
 if (!isWatchPage()) return;
 const newVideoId = getCurrentVideoId();
 if (newVideoId !== thumbnailPreviewCurrentVideoId) {
 thumbnailPreviewClosed = false;
 removeOldOverlay();
 }
 if (shouldSkipThumbnailUpdate(newVideoId)) {
 return;
 }
 thumbnailPreviewCurrentVideoId = newVideoId;
 attemptInsertion();
 }
 function createThumbnailOverlay(videoId, container) {
 const overlay = document.createElement('div');
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('width', '16');
 svg.setAttribute('height', '16');
 svg.setAttribute('viewBox', '0 0 24 24');
 svg.setAttribute('fill', 'none');
 svg.setAttribute('stroke', 'white');
 svg.setAttribute('stroke-width', '2');
 svg.setAttribute('stroke-linecap', 'round');
 svg.setAttribute('stroke-linejoin', 'round');
 svg.style.transition = 'stroke 0.2s ease';
 const mainRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
 mainRect.setAttribute('width', '18');
 mainRect.setAttribute('height', '18');
 mainRect.setAttribute('x', '3');
 mainRect.setAttribute('y', '3');
 mainRect.setAttribute('rx', '2');
 mainRect.setAttribute('ry', '2');
 svg.appendChild(mainRect);
 const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
 circle.setAttribute('cx', '9');
 circle.setAttribute('cy', '9');
 circle.setAttribute('r', '2');
 svg.appendChild(circle);
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute('d', 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21');
 svg.appendChild(path);
 overlay.appendChild(svg);
 overlay.style.cssText = `
 position: absolute;
 bottom: 8px;
 left: 8px;
 background: rgba(0, 0, 0, 0.3);
 width: 28px;
 height: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 4px;
 cursor: pointer;
 z-index: 1000;
 opacity: 0;
 transition: all 0.2s ease;
 `;
 overlay.onmouseenter = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.7)';
 };
 overlay.onmouseleave = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.3)';
 };
 overlay.onclick = async e => {
 e.preventDefault();
 e.stopPropagation();
 const isShorts =
 container.closest('ytm-shorts-lockup-view-model') ||
 container.closest('.shortsLockupViewModelHost') ||
 container.closest('[class*="shortsLockupViewModelHost"]') ||
 container.querySelector('a[href*="/shorts/"]');
 await openThumbnail(videoId, !!isShorts, overlay);
 };
 return overlay;
 }
 function findThumbnailContainerFromImage(img) {
 return img.closest('yt-thumbnail-view-model') || img.parentElement;
 }
 function findShortsThumbnailContainer(shortsImg) {
 if (!shortsImg) return null;
 return (
 shortsImg.closest('.ytCoreImageHost') ||
 shortsImg.closest('[class*="ThumbnailContainer"]') ||
 shortsImg.closest('[class*="ImageHost"]') ||
 shortsImg.parentElement
 );
 }
 function extractVideoInfo(container) {
 const img = container.querySelector('img[src*="ytimg.com"]');
 if (!img?.src) return { videoId: null, thumbnailContainer: null };
 const videoId = extractVideoId(img.src);
 const thumbnailContainer = findThumbnailContainerFromImage(img);
 return { videoId, thumbnailContainer };
 }
 function extractShortsInfo(container) {
 const link = container.querySelector('a[href*="/shorts/"]');
 if (!link?.href) return { videoId: null, thumbnailContainer: null };
 const videoId = extractShortsId(link.href);
 const shortsImg = container.querySelector('img[src*="ytimg.com"]');
 const thumbnailContainer = findShortsThumbnailContainer(shortsImg);
 return { videoId, thumbnailContainer };
 }
 function ensureRelativePosition(thumbnailContainer) {
 if (getComputedStyle(thumbnailContainer).position === 'static') {
 thumbnailContainer.style.position = 'relative';
 }
 }
 function setupOverlayHoverEffects(thumbnailContainer, overlay) {
 thumbnailContainer.onmouseenter = () => {
 overlay.style.opacity = '1';
 };
 thumbnailContainer.onmouseleave = () => {
 overlay.style.opacity = '0';
 };
 }
 function addThumbnailOverlay(container) {
 if (container.querySelector('.thumb-overlay')) return;
 let { videoId, thumbnailContainer } = extractVideoInfo(container);
 if (!videoId) {
 ({ videoId, thumbnailContainer } = extractShortsInfo(container));
 }
 if (!videoId || !thumbnailContainer) return;
 ensureRelativePosition(thumbnailContainer);
 const overlay = createThumbnailOverlay(videoId, container);
 overlay.className = 'thumb-overlay';
 thumbnailContainer.appendChild(overlay);
 setupOverlayHoverEffects(thumbnailContainer, overlay);
 }
 function createAvatarOverlay() {
 const overlay = document.createElement('div');
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('width', '16');
 svg.setAttribute('height', '16');
 svg.setAttribute('viewBox', '0 0 24 24');
 svg.setAttribute('fill', 'none');
 svg.setAttribute('stroke', 'white');
 svg.setAttribute('stroke-width', '2');
 svg.setAttribute('stroke-linecap', 'round');
 svg.setAttribute('stroke-linejoin', 'round');
 svg.style.transition = 'stroke 0.2s ease';
 const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
 circle.setAttribute('cx', '12');
 circle.setAttribute('cy', '8');
 circle.setAttribute('r', '5');
 svg.appendChild(circle);
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute('d', 'M20 21a8 8 0 0 0-16 0');
 svg.appendChild(path);
 overlay.appendChild(svg);
 overlay.style.cssText = `
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 background: rgba(0, 0, 0, 0.7);
 width: 28px;
 height: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 50%;
 cursor: pointer;
 z-index: 1000;
 opacity: 0;
 transition: all 0.2s ease;
 `;
 overlay.onmouseenter = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.9)';
 };
 overlay.onmouseleave = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.7)';
 };
 return overlay;
 }
 function addAvatarOverlay(img) {
 const container = img.parentElement;
 if (!container) return;
 if (
 img.closest('.avatar-btn, #avatar-btn') ||
 container.closest('.avatar-btn, #avatar-btn') ||
 img.closest('button') ||
 container.closest('button') ||
 img.closest('.thumbnail-modal-wrapper') ||
 container.closest('.thumbnail-modal-wrapper')
 ) {
 return;
 }
 if (
 img.closest('ytm-shorts-lockup-view-model') ||
 container.closest('ytm-shorts-lockup-view-model') ||
 img.closest('.shortsLockupViewModelHost') ||
 container.closest('.shortsLockupViewModelHost') ||
 img.closest('[class*="shortsLockupViewModelHost"]') ||
 container.closest('[class*="shortsLockupViewModelHost"]') ||
 img.closest('[class*="shorts"]') ||
 container.closest('[class*="shorts"]')
 ) {
 return;
 }
 if (container.querySelector('.avatar-overlay')) return;
 if (getComputedStyle(container).position === 'static') {
 container.style.position = 'relative';
 }
 const overlay = createAvatarOverlay();
 overlay.className = 'avatar-overlay';
 overlay.onclick = e => {
 e.preventDefault();
 e.stopPropagation();
 const highResUrl = img.src.replace(/=s\d+-c-k-c0x00ffffff-no-rj.*/, '=s0');
 showImageModal(highResUrl);
 };
 container.appendChild(overlay);
 container.onmouseenter = () => {
 overlay.style.opacity = '1';
 };
 container.onmouseleave = () => {
 overlay.style.opacity = '0';
 };
 }
 function createBannerOverlay() {
 const overlay = document.createElement('div');
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('width', '16');
 svg.setAttribute('height', '16');
 svg.setAttribute('viewBox', '0 0 24 24');
 svg.setAttribute('fill', 'none');
 svg.setAttribute('stroke', 'white');
 svg.setAttribute('stroke-width', '2');
 svg.setAttribute('stroke-linecap', 'round');
 svg.setAttribute('stroke-linejoin', 'round');
 svg.style.transition = 'stroke 0.2s ease';
 const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
 rect.setAttribute('x', '3');
 rect.setAttribute('y', '3');
 rect.setAttribute('width', '18');
 rect.setAttribute('height', '18');
 rect.setAttribute('rx', '2');
 rect.setAttribute('ry', '2');
 svg.appendChild(rect);
 const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
 circle.setAttribute('cx', '9');
 circle.setAttribute('cy', '9');
 circle.setAttribute('r', '2');
 svg.appendChild(circle);
 const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
 polyline.setAttribute('points', '21,15 16,10 5,21');
 svg.appendChild(polyline);
 overlay.appendChild(svg);
 overlay.style.cssText = `
 position: absolute;
 bottom: 8px;
 left: 8px;
 background: rgba(0, 0, 0, 0.7);
 width: 28px;
 height: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 4px;
 cursor: pointer;
 z-index: 1000;
 opacity: 0;
 transition: all 0.2s ease;
 `;
 overlay.onmouseenter = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.9)';
 };
 overlay.onmouseleave = () => {
 overlay.style.background = 'rgba(0, 0, 0, 0.7)';
 };
 return overlay;
 }
 function addBannerOverlay(img) {
 const container = img.parentElement;
 if (container.querySelector('.banner-overlay')) return;
 if (getComputedStyle(container).position === 'static') {
 container.style.position = 'relative';
 }
 const overlay = createBannerOverlay();
 overlay.className = 'banner-overlay';
 overlay.onclick = e => {
 e.preventDefault();
 e.stopPropagation();
 const highResUrl = img.src.replace(/=w\d+-.*/, '=s0');
 showImageModal(highResUrl);
 };
 container.appendChild(overlay);
 container.onmouseenter = () => {
 overlay.style.opacity = '1';
 };
 container.onmouseleave = () => {
 overlay.style.opacity = '0';
 };
 }
 function processAvatars() {
 const avatarSelectors = [
 'yt-avatar-shape img',
 '#avatar img',
 'ytd-channel-avatar-editor img',
 '.ytd-video-owner-renderer img[src*="yt"]',
 'img[src*="yt3.ggpht.com"]',
 'img[src*="yt4.ggpht.com"]',
 ];
 avatarSelectors.forEach(selector => {
 document.querySelectorAll(selector).forEach(img => {
 if (!img.src) return;
 if (!img.src.includes('yt')) return;
 if (img.closest('.avatar-overlay')) return;
 const isAvatar = img.naturalWidth > 0 && img.naturalWidth === img.naturalHeight;
 if (isAvatar || img.src.includes('ggpht.com')) {
 addAvatarOverlay(img);
 }
 });
 });
 }
 function processBanners() {
 const bannerSelectors = [
 'yt-image-banner-view-model img',
 'ytd-c4-tabbed-header-renderer img[src*="yt"]',
 '#channel-header img[src*="banner"]',
 'img[src*="banner"]',
 ];
 bannerSelectors.forEach(selector => {
 document.querySelectorAll(selector).forEach(img => {
 if (!img.src) return;
 if (img.closest('.banner-overlay')) return;
 const isBanner =
 (img.src.includes('banner') || img.src.includes('yt')) &&
 img.naturalWidth > img.naturalHeight * 2;
 if (isBanner || img.src.includes('banner')) {
 addBannerOverlay(img);
 }
 });
 });
 }
 function processThumbnails() {
 const n1 = document.querySelectorAll('yt-thumbnail-view-model');
 for (let i = 0; i < n1.length; i++) addThumbnailOverlay(n1[i]);
 const n2 = document.querySelectorAll('.ytd-thumbnail');
 for (let i = 0; i < n2.length; i++) addThumbnailOverlay(n2[i]);
 const n3 = document.querySelectorAll('ytm-shorts-lockup-view-model');
 for (let i = 0; i < n3.length; i++) addThumbnailOverlay(n3[i]);
 const n4 = document.querySelectorAll('.shortsLockupViewModelHost');
 for (let i = 0; i < n4.length; i++) addThumbnailOverlay(n4[i]);
 const n5 = document.querySelectorAll('[class*="shortsLockupViewModelHost"]');
 for (let i = 0; i < n5.length; i++) addThumbnailOverlay(n5[i]);
 }
 function processAll() {
 processThumbnails();
 processAvatars();
 processBanners();
 addOrUpdateThumbnailImage();
 }
 function setupMutationObserver() {
 const observer = new MutationObserver(() => {
 setTimeout(processAll, 50);
 });
 if (document.body) {
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 });
 });
 }
 }
 function setupUrlChangeDetection() {
 let currentUrl = location.href;
 const originalPushState = history.pushState;
 const originalReplaceState = history.replaceState;
 history.pushState = function (...args) {
 originalPushState.call(history, ...args);
 setTimeout(() => {
 if (location.href !== currentUrl) {
 currentUrl = location.href;
 setTimeout(addOrUpdateThumbnailImage, 500);
 }
 }, 100);
 };
 history.replaceState = function (...args) {
 originalReplaceState.call(history, ...args);
 setTimeout(() => {
 if (location.href !== currentUrl) {
 currentUrl = location.href;
 setTimeout(addOrUpdateThumbnailImage, 500);
 }
 }, 100);
 };
 window.addEventListener('popstate', () => {
 setTimeout(() => {
 if (location.href !== currentUrl) {
 currentUrl = location.href;
 setTimeout(addOrUpdateThumbnailImage, 500);
 }
 }, 100);
 });
 setInterval(() => {
 if (location.href !== currentUrl) {
 currentUrl = location.href;
 setTimeout(addOrUpdateThumbnailImage, 300);
 }
 }, 500);
 }
 function initialize() {
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', () => {
 setTimeout(init, 100);
 });
 } else {
 setTimeout(init, 100);
 }
 }
 function init() {
 setupUrlChangeDetection();
 setupMutationObserver();
 processAll();
 setTimeout(processAll, 500);
 setTimeout(processAll, 1000);
 setTimeout(processAll, 2000);
 }
 initialize();
})();
(function () {
 'use strict';
 const _globalI18n_shorts =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n_shorts && typeof _globalI18n_shorts.t === 'function') {
 return _globalI18n_shorts.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 let text = key;
 if (Object.keys(params).length === 0) return key;
 for (const [paramKey, val] of Object.entries(params)) {
 text = text.split(`{${paramKey}}`).join(String(val));
 }
 return text;
 };
 const config = {
 enabled: true,
 get shortcuts() {
 return {
 seekBackward: {
 key: 'ArrowLeft',
 get description() {
 return t('seekBackward');
 },
 },
 seekForward: {
 key: 'ArrowRight',
 get description() {
 return t('seekForward');
 },
 },
 volumeUp: {
 key: '+',
 get description() {
 return t('volumeUp');
 },
 },
 volumeDown: {
 key: '-',
 get description() {
 return t('volumeDown');
 },
 },
 mute: {
 key: 'm',
 get description() {
 return t('muteUnmute');
 },
 },
 toggleCaptions: {
 key: 'c',
 get description() {
 return t('toggleCaptions');
 },
 },
 showHelp: {
 key: '?',
 get description() {
 return t('showHideHelp');
 },
 editable: false,
 },
 };
 },
 storageKey: 'youtube_shorts_keyboard_settings',
 };
 const state = {
 helpVisible: false,
 lastAction: null,
 actionTimeout: null,
 editingShortcut: null,
 cachedVideo: null,
 lastVideoCheck: 0,
 };
 const getCurrentVideo = (() => {
 const selectors = ['ytd-reel-video-renderer[is-active] video', '#shorts-player video', 'video'];
 return () => {
 const now = Date.now();
 if (state.cachedVideo?.isConnected && now - state.lastVideoCheck < 100) {
 return state.cachedVideo;
 }
 for (const selector of selectors) {
 const video = YouTubeUtils.querySelector(selector);
 if (video) {
 state.cachedVideo = video;
 state.lastVideoCheck = now;
 return video;
 }
 }
 state.cachedVideo = null;
 return null;
 };
 })();
 const utils = {
 isInShortsPage: () => location.pathname.startsWith('/shorts/'),
 isInputFocused: () => {
 const el = document.activeElement;
 return el?.matches?.('input, textarea, [contenteditable="true"]') || el?.isContentEditable;
 },
 loadSettings: () => {
 try {
 const saved = localStorage.getItem(config.storageKey);
 if (!saved) return;
 const parsed = JSON.parse(saved);
 if (typeof parsed !== 'object' || parsed === null) {
 console.warn('[YouTube+][Shorts]', 'Invalid settings format');
 return;
 }
 if (typeof parsed.enabled === 'boolean') {
 config.enabled = parsed.enabled;
 }
 if (parsed.shortcuts && typeof parsed.shortcuts === 'object') {
 const defaultShortcuts = utils.getDefaultShortcuts();
 for (const [action, shortcut] of Object.entries(parsed.shortcuts)) {
 if (!defaultShortcuts[action]) continue;
 if (!shortcut || typeof shortcut !== 'object') continue;
 const { key: sKey, editable: sEditable } =
 (shortcut);
 if (typeof sKey === 'string' && sKey.length > 0 && sKey.length <= 20) {
 config.shortcuts[action] = {
 key: sKey,
 description: defaultShortcuts[action].description,
 editable: sEditable !== false,
 };
 }
 }
 }
 } catch (error) {
 console.error('[YouTube+][Shorts]', 'Error loading settings:', error);
 }
 },
 saveSettings: () => {
 try {
 const settingsToSave = {
 enabled: config.enabled,
 shortcuts: config.shortcuts,
 };
 localStorage.setItem(config.storageKey, JSON.stringify(settingsToSave));
 } catch (error) {
 console.error('[YouTube+][Shorts]', 'Error saving settings:', error);
 }
 },
 getDefaultShortcuts: () => ({
 seekBackward: {
 key: 'ArrowLeft',
 get description() {
 return t('seekBackward');
 },
 },
 seekForward: {
 key: 'ArrowRight',
 get description() {
 return t('seekForward');
 },
 },
 volumeUp: {
 key: '+',
 get description() {
 return t('volumeUp');
 },
 },
 volumeDown: {
 key: '-',
 get description() {
 return t('volumeDown');
 },
 },
 mute: {
 key: 'm',
 get description() {
 return t('muteUnmute');
 },
 },
 toggleCaptions: {
 key: 'c',
 get description() {
 return t('toggleCaptions');
 },
 },
 showHelp: {
 key: '?',
 get description() {
 return t('showHideHelp');
 },
 editable: false,
 },
 }),
 };
 const feedback = (() => {
 let element = null;
 const create = () => {
 if (element) return element;
 element = document.createElement('div');
 element.id = 'shorts-keyboard-feedback';
 element.style.cssText = `
 position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
 background:var(--shorts-feedback-bg,rgba(255,255,255,.1));
 backdrop-filter:blur(16px) saturate(150%);
 border:1px solid var(--shorts-feedback-border,rgba(255,255,255,.15));
 border-radius:20px;
 color:var(--shorts-feedback-color,#fff);
 padding:18px 32px;font-size:20px;font-weight:700;
 z-index:10000;opacity:0;visibility:hidden;pointer-events:none;
 transition:all .3s cubic-bezier(.4,0,.2,1);text-align:center;
 box-shadow:0 8px 32px rgba(0,0,0,.4);
 background: rgba(155, 155, 155, 0.15);
 border: 1px solid rgba(255,255,255,0.2);
 box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
 backdrop-filter: blur(12px) saturate(180%);
 -webkit-backdrop-filter: blur(12px) saturate(180%);
 `;
 document.body.appendChild(element);
 return element;
 };
 return {
 show: text => {
 state.lastAction = text;
 clearTimeout(state.actionTimeout);
 const el = create();
 el.textContent = text;
 requestAnimationFrame(() => {
 el.style.opacity = '1';
 el.style.visibility = 'visible';
 el.style.transform = 'translate(-50%, -50%) scale(1.05)';
 });
 state.actionTimeout = setTimeout(() => {
 el.style.opacity = '0';
 el.style.visibility = 'hidden';
 el.style.transform = 'translate(-50%, -50%) scale(0.95)';
 }, 1500);
 },
 };
 })();
 const actions = {
 seekBackward: () => {
 const video = getCurrentVideo();
 if (video) {
 video.currentTime = Math.max(0, video.currentTime - 5);
 feedback.show('-5s');
 }
 },
 seekForward: () => {
 const video = getCurrentVideo();
 if (video) {
 video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
 feedback.show('+5s');
 }
 },
 toggleCaptions: () => {
 try {
 const buttons = document.querySelectorAll('button[aria-label]');
 for (const b of buttons) {
 const aria = (b.getAttribute('aria-label') || '').toLowerCase();
 if (
 aria.includes('subtit') ||
 aria.includes('caption') ||
 aria.includes('субтит') ||
 aria.includes('субтитр') ||
 aria.includes('cc')
 ) {
 if (b.offsetParent !== null) {
 b.click();
 break;
 }
 }
 }
 } catch {
 }
 const video = getCurrentVideo();
 if (video && video.textTracks && video.textTracks.length) {
 const tracks = Array.from(video.textTracks).filter(
 tr => tr.kind === 'subtitles' || tr.kind === 'captions' || !tr.kind
 );
 if (tracks.length) {
 const anyShowing = tracks.some(tr => tr.mode === 'showing');
 tracks.forEach(tr => {
 tr.mode = anyShowing ? 'hidden' : 'showing';
 });
 feedback.show(anyShowing ? t('captionsOff') : t('captionsOn'));
 return;
 }
 }
 feedback.show(t('captionsUnavailable'));
 },
 volumeUp: () => {
 const video = getCurrentVideo();
 if (video) {
 video.volume = Math.min(1, video.volume + 0.1);
 feedback.show(`${Math.round(video.volume * 100)}%`);
 }
 },
 volumeDown: () => {
 const video = getCurrentVideo();
 if (video) {
 video.volume = Math.max(0, video.volume - 0.1);
 feedback.show(`${Math.round(video.volume * 100)}%`);
 }
 },
 mute: () => {
 const video = getCurrentVideo();
 try {
 const buttons = document.querySelectorAll('button[aria-label]');
 for (const b of buttons) {
 const aria = (b.getAttribute('aria-label') || '').toLowerCase();
 if (
 aria.includes('mute') ||
 aria.includes('unmute') ||
 aria.includes('sound') ||
 aria.includes('volume') ||
 aria.includes('звук') ||
 aria.includes('громк')
 ) {
 if (b.offsetParent !== null) {
 b.click();
 setTimeout(() => {
 const v = getCurrentVideo();
 if (v) feedback.show(v.muted ? '🔇' : '🔊');
 }, 60);
 return;
 }
 }
 }
 } catch {
 }
 if (video) {
 video.muted = !video.muted;
 feedback.show(video.muted ? '🔇' : '🔊');
 }
 },
 showHelp: () => helpPanel.toggle(),
 };
 const helpPanel = (() => {
 let panel = null;
 const create = () => {
 if (panel) return panel;
 panel = document.createElement('div');
 panel.id = 'shorts-keyboard-help';
 panel.className = 'glass-panel shorts-help-panel';
 panel.setAttribute('role', 'dialog');
 panel.setAttribute('aria-modal', 'true');
 panel.tabIndex = -1;
 const render = () => {
 panel.innerHTML = `
 <div class="help-header">
 <h3>${t('keyboardShortcuts')}</h3>
 <button class="ytp-plus-settings-close help-close" type="button" aria-label="${t('closeButton')}">
 <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
 </svg>
 </button>
 </div>
 <div class="help-content">
 ${Object.entries(config.shortcuts)
 .map(
 ([action, shortcut]) =>
 `<div class="help-item">
 <kbd data-action="${action}" ${shortcut.editable === false ? 'class="non-editable"' : ''}>${shortcut.key === ' ' ? 'Space' : shortcut.key}</kbd>
 <span>${shortcut.description}</span>
 </div>`
 )
 .join('')}
 </div>
 <div class="help-footer">
 <button class="ytp-plus-button ytp-plus-button-primary reset-all-shortcuts">${t('resetAll')}</button>
 </div>
 `;
 panel.querySelector('.help-close').onclick = () => helpPanel.hide();
 panel.querySelector('.reset-all-shortcuts').onclick = () => {
 if (confirm(t('resetAllConfirm'))) {
 config.shortcuts = utils.getDefaultShortcuts();
 utils.saveSettings();
 feedback.show(t('shortcutsReset'));
 render();
 }
 };
 panel.querySelectorAll('kbd[data-action]:not(.non-editable)').forEach(kbd => {
 kbd.onclick = () =>
 editShortcut(kbd.dataset.action, config.shortcuts[kbd.dataset.action].key);
 });
 };
 render();
 document.body.appendChild(panel);
 return panel;
 };
 return {
 show: () => {
 const p = create();
 p.classList.add('visible');
 state.helpVisible = true;
 p.focus();
 },
 hide: () => {
 if (panel) {
 panel.classList.remove('visible');
 state.helpVisible = false;
 }
 },
 toggle: () => (state.helpVisible ? helpPanel.hide() : helpPanel.show()),
 refresh: () => {
 if (panel) {
 panel.remove();
 panel = null;
 }
 },
 };
 })();
 const editShortcut = (actionKey, currentKey) => {
 const dialog = document.createElement('div');
 dialog.className = 'glass-modal shortcut-edit-dialog';
 dialog.setAttribute('role', 'dialog');
 dialog.setAttribute('aria-modal', 'true');
 dialog.innerHTML = `
 <div class="glass-panel shortcut-edit-content">
 <h4>${t('editShortcut')}: ${config.shortcuts[actionKey].description}</h4>
 <p>${t('pressAnyKey')}</p>
 <div class="current-shortcut">${t('current')}: <kbd>${currentKey === ' ' ? 'Space' : currentKey}</kbd></div>
 <button class="ytp-plus-button ytp-plus-button-primary shortcut-cancel" type="button">${t('cancel')}</button>
 </div>
 `;
 document.body.appendChild(dialog);
 state.editingShortcut = actionKey;
 const handleKey = e => {
 e.preventDefault();
 e.stopPropagation();
 if (e.key === 'Escape') return cleanup();
 const conflict = Object.keys(config.shortcuts).find(
 key => key !== actionKey && config.shortcuts[key].key === e.key
 );
 if (conflict) {
 feedback.show(t('keyAlreadyUsed', { key: e.key }));
 return;
 }
 config.shortcuts[actionKey].key = e.key;
 utils.saveSettings();
 feedback.show(t('shortcutUpdated'));
 helpPanel.refresh();
 cleanup();
 };
 const cleanup = () => {
 document.removeEventListener('keydown', handleKey, true);
 dialog.remove();
 state.editingShortcut = null;
 };
 dialog.querySelector('.shortcut-cancel').onclick = cleanup;
 dialog.onclick = ({ target }) => {
 if (target === dialog) cleanup();
 };
 document.addEventListener('keydown', handleKey, true);
 };
 const addStyles = () => {
 if (document.getElementById('shorts-keyboard-styles')) return;
 const styles = `
 :root{--shorts-feedback-bg:rgba(255,255,255,.15);--shorts-feedback-border:rgba(255,255,255,.2);--shorts-feedback-color:#fff;--shorts-help-bg:rgba(255,255,255,.15);--shorts-help-border:rgba(255,255,255,.2);--shorts-help-color:#fff;}
 html[dark],body[dark]{--shorts-feedback-bg:rgba(34,34,34,.7);--shorts-feedback-border:rgba(255,255,255,.15);--shorts-feedback-color:#fff;--shorts-help-bg:rgba(34,34,34,.7);--shorts-help-border:rgba(255,255,255,.1);--shorts-help-color:#fff;}
 html:not([dark]){--shorts-feedback-bg:rgba(255,255,255,.95);--shorts-feedback-border:rgba(0,0,0,.08);--shorts-feedback-color:#222;--shorts-help-bg:rgba(255,255,255,.98);--shorts-help-border:rgba(0,0,0,.08);--shorts-help-color:#222;}
 .shorts-help-panel{position:fixed;top:50%;left:25%;transform:translate(-50%,-50%) scale(.9);z-index:10001;opacity:0;visibility:hidden;transition:all .3s ease;width:340px;max-width:95vw;max-height:80vh;overflow:hidden;outline:none;color:var(--shorts-help-color,#fff);}
 .shorts-help-panel.visible{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1);}
 .help-header{display:flex;justify-content:space-between;align-items:center;padding:24px 24px 12px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);}
 html:not([dark]) .help-header{background:rgba(0,0,0,.04);border-bottom:1px solid rgba(0,0,0,.08);}
 .help-header h3{margin:0;font-size:20px;font-weight:700;}
 .help-close{display:flex;align-items:center;justify-content:center;padding:4px;}
 .help-content{padding:18px 24px;max-height:400px;overflow-y:auto;}
 .help-item{display:flex;align-items:center;margin-bottom:14px;gap:18px;}
 .help-item kbd{background:rgba(255,255,255,.15);color:inherit;padding:7px 14px;border-radius:8px;font-family:monospace;font-size:15px;font-weight:700;min-width:60px;text-align:center;border:1.5px solid rgba(255,255,255,.2);cursor:pointer;transition:all .2s;position:relative;}
 html:not([dark]) .help-item kbd{background:rgba(0,0,0,.06);color:#222;border:1.5px solid rgba(0,0,0,.08);}
 .help-item kbd:hover{background:rgba(255,255,255,.22);transform:scale(1.07);}
 .help-item kbd:after{content:"✎";position:absolute;top:-7px;right:-7px;font-size:11px;opacity:0;transition:opacity .2s;}
 .help-item kbd:hover:after{opacity:.7;}
 .help-item kbd.non-editable{cursor:default;opacity:.7;}
 .help-item kbd.non-editable:hover{background:rgba(255,255,255,.15);transform:none;}
 .help-item kbd.non-editable:after{display:none;}
 .help-item span{font-size:15px;color:rgba(255,255,255,.92);}
 html:not([dark]) .help-item span{color:#222;}
 .help-footer{padding:16px 24px 20px;border-top:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);text-align:center;}
 html:not([dark]) .help-footer{background:rgba(0,0,0,.04);border-top:1px solid rgba(0,0,0,.08);}
 .reset-all-shortcuts{display:inline-flex;align-items:center;justify-content:center;gap:var(--yt-space-sm);}
 .shortcut-edit-dialog{z-index:10002;}
 .shortcut-edit-content{padding:28px 32px;min-width:320px;text-align:center;display:flex;flex-direction:column;gap:var(--yt-space-md);color:inherit;}
 html:not([dark]) .shortcut-edit-content{color:#222;}
 .shortcut-edit-content h4{margin:0 0 14px;font-size:17px;font-weight:700;}
 .shortcut-edit-content p{margin:0 0 18px;font-size:15px;color:rgba(255,255,255,.85);}
 html:not([dark]) .shortcut-edit-content p{color:#222;}
 .current-shortcut{margin:18px 0;font-size:15px;}
 .current-shortcut kbd{background:rgba(255,255,255,.15);padding:5px 12px;border-radius:6px;font-family:monospace;border:1.5px solid rgba(255,255,255,.2);}
 html:not([dark]) .current-shortcut kbd{background:rgba(0,0,0,.06);color:#222;border:1.5px solid rgba(0,0,0,.08);}
 .shortcut-cancel{display:inline-flex;align-items:center;justify-content:center;gap:var(--yt-space-sm);}
 @media(max-width:480px){.shorts-help-panel{width:98vw;max-height:85vh}.help-header{padding:16px 10px 8px 10px}.help-content{padding:12px 10px}.help-item{gap:10px}.help-item kbd{min-width:44px;font-size:13px;padding:5px 7px}.shortcut-edit-content{margin:20px;min-width:auto}}
 #shorts-keyboard-feedback{background:var(--shorts-feedback-bg,rgba(255,255,255,.15));color:var(--shorts-feedback-color,#fff);border:1.5px solid var(--shorts-feedback-border,rgba(255,255,255,.2));border-radius:20px;box-shadow:0 8px 32px 0 rgba(31,38,135,.37);backdrop-filter:blur(12px) saturate(180%);-webkit-backdrop-filter:blur(12px) saturate(180%);}
 html:not([dark]) #shorts-keyboard-feedback{background:var(--shorts-feedback-bg,rgba(255,255,255,.95));color:var(--shorts-feedback-color,#222);border:1.5px solid var(--shorts-feedback-border,rgba(0,0,0,.08));}
 `;
 YouTubeUtils.StyleManager.add('shorts-keyboard-styles', styles);
 };
 const handleKeydown = e => {
 if (
 !config.enabled ||
 !utils.isInShortsPage() ||
 utils.isInputFocused() ||
 state.editingShortcut
 ) {
 return;
 }
 let { key } = e;
 if (e.code === 'NumpadAdd') key = '+';
 else if (e.code === 'NumpadSubtract') key = '-';
 const action = Object.keys(config.shortcuts).find(k => config.shortcuts[k].key === key);
 if (action && actions[action]) {
 e.preventDefault();
 e.stopPropagation();
 actions[action]();
 }
 };
 const init = () => {
 utils.loadSettings();
 addStyles();
 YouTubeUtils.cleanupManager.registerListener(document, 'keydown', handleKeydown, true);
 const clickHandler = ({ target }) => {
 if (state.helpVisible && target?.closest && !target.closest('#shorts-keyboard-help')) {
 helpPanel.hide();
 }
 };
 YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler);
 document.addEventListener('keydown', e => {
 if (e.key === 'Escape' && state.helpVisible) {
 e.preventDefault();
 helpPanel.hide();
 }
 });
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
 if (utils.isInShortsPage() && !localStorage.getItem('shorts_keyboard_help_shown')) {
 setTimeout(() => {
 feedback.show('Press ? for shortcuts');
 localStorage.setItem('shorts_keyboard_help_shown', 'true');
 }, 2000);
 }
})();
(function () {
 'use strict';
 const getCache = () => typeof window !== 'undefined' && window.YouTubeDOMCache;
 const $ = (sel, ctx) =>
 getCache()?.querySelector(sel, ctx) || (ctx || document).querySelector(sel);
 const $$ = (sel, ctx) =>
 getCache()?.querySelectorAll(sel, ctx) || Array.from((ctx || document).querySelectorAll(sel));
 const byId = id => getCache()?.getElementById(id) || document.getElementById(id);
 const isStudioPage = () => {
 try {
 const host = location.hostname || '';
 const href = location.href || '';
 return (
 host.includes('studio.youtube.com') ||
 host.includes('studio.') ||
 href.includes('studio.youtube.com')
 );
 } catch {
 return false;
 }
 };
 if (isStudioPage()) return;
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const styles = `
 .videoStats{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:8px;background:rgba(255,255,255,0.12);box-shadow:0 12px 30px rgba(0,0,0,0.32);backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);border:1.25px solid rgba(255,255,255,0.12);transition:transform .18s ease,background .18s}
 html[dark] .videoStats{background:rgba(24,24,24,0.68);border:1.25px solid rgba(255,255,255,0.08)}html:not([dark]) .videoStats{background:rgba(255,255,255,0.12);border:1.25px solid rgba(0,0,0,0.06)}.videoStats:hover{transform:translateY(-2px)}.videoStats svg{width:18px;height:18px;fill:var(--yt-spec-text-primary,#030303)}html[dark] .videoStats svg{fill:#fff}html:not([dark]) .videoStats svg{fill:#222}
 .shortsStats{display:flex;align-items:center;justify-content:center;margin-top:16px;margin-bottom:16px;width:48px;height:48px;border-radius:50%;cursor:pointer;background:rgba(255,255,255,0.12);box-shadow:0 12px 30px rgba(0,0,0,0.32);backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);border:1.25px solid rgba(255,255,255,0.12);transition:transform .22s ease}html[dark] .shortsStats{background:rgba(24,24,24,0.68);border:1.25px solid rgba(255,255,255,0.08)}html:not([dark]) .shortsStats{background:rgba(255,255,255,0.12);border:1.25px solid rgba(0,0,0,0.06)}
 .shortsStats:hover{transform:translateY(-3px)}.shortsStats svg{width:24px;height:24px;fill:#222}html[dark] .shortsStats svg{fill:#fff}html:not([dark]) .shortsStats svg{fill:#222}
 .stats-menu-container{position:relative;display:inline-block}.stats-horizontal-menu{position:absolute;display:flex;left:100%;top:0;height:100%;visibility:hidden;opacity:0;transition:visibility 0s,opacity 0.2s linear;z-index:100}.stats-menu-container:hover .stats-horizontal-menu{visibility:visible;opacity:1}.stats-menu-button{margin-left:8px;white-space:nowrap}
 .stats-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.55));z-index:99999;display:flex;align-items:center;justify-content:center;animation:fadeInModal .18s;backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%)}
 .stats-modal-container{max-width:1100px;max-height:calc(100vh - 32px);display:flex;flex-direction:column}
 .stats-modal-content{background:rgba(24,24,24,0.92);border-radius:20px;box-shadow:0 18px 40px rgba(0,0,0,0.45);overflow:hidden;display:flex;flex-direction:column;animation:scaleInModal .18s;border:1.5px solid rgba(255,255,255,0.08);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%)}
 html[dark] .stats-modal-content{background:rgba(24, 24, 24, 0.25)}
 html:not([dark]) .stats-modal-content{background:rgba(255,255,255,0.95);color:#222;border:1.25px solid rgba(0,0,0,0.06)}
 .stats-modal-close{background:transparent;border:none;color:#fff;font-size:36px;line-height:1;width:36px;height:36px;cursor:pointer;transition:transform .15s ease,color .15s;display:flex;align-items:center;justify-content:center;border-radius:8px;padding:0}
 .stats-modal-close:hover{color:#ff6b6b;transform:scale(1.1)}
 html:not([dark]) .stats-modal-close{color:#666}
 html:not([dark]) .stats-modal-close:hover{color:#ff6b6b}
 .stats-modal-body{padding:16px;overflow:visible;flex:1;display:flex;flex-direction:column}
 .stats-thumb-title-centered{font-size:16px;font-weight:600;color:#fff;margin:0 0 12px 0;text-align:center}
 html:not([dark]) .stats-thumb-title-centered{color:#111}
 .stats-thumb-row{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
 .stats-thumb-img{width:36vw;max-width:420px;height:auto;object-fit:cover;border-radius:8px;flex-shrink:0;border:1px solid rgba(255,255,255,0.06);max-height:44vh}
 html:not([dark]) .stats-thumb-img{border:1px solid rgba(0,0,0,0.06)}
 .stats-thumb-row .stats-grid{flex:1;min-width:0}
 .stats-thumb-left{display:flex;flex-direction:column;align-items:center;gap:8px}
 .stats-thumb-left .stats-thumb-sub{font-size:13px;color:rgba(255,255,255,0.65)}
 html:not([dark]) .stats-thumb-left .stats-thumb-sub{color:rgba(0,0,0,0.6)}
 .stats-thumb-extras{display:flex;flex-direction:row;gap:10px;align-items:center;margin-top:8px}
 .stats-thumb-extras .stats-card{padding:8px 10px}
 .stats-thumb-meta{display:flex;flex-direction:column;justify-content:center}
 .stats-thumb-sub{font-size:13px;color:rgba(255,255,255,0.65)}
 html:not([dark]) .stats-thumb-sub{color:rgba(0,0,0,0.6)}
 .stats-loader{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:#fff}
 html:not([dark]) .stats-loader{color:#666}
 .stats-spinner{width:60px;height:60px;animation:spin 1s linear infinite;margin-bottom:16px}
 .stats-spinner circle{stroke-dasharray:80;stroke-dashoffset:60;animation:dash 1.5s ease-in-out infinite}
 .stats-error{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:#ff6b6b;text-align:center}
 .stats-error-icon{width:60px;height:60px;margin-bottom:16px;stroke:#ff6b6b}
 .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
 .stats-card{background:rgba(255,255,255,0.05);border-radius:12px;padding:12px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.08);transition:transform .18s ease,box-shadow .18s ease}
 html:not([dark]) .stats-card{background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.1)}
 .stats-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.3)}
 .stats-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
 .stats-icon svg{width:24px;height:24px}
 .stats-icon-views{background:rgba(59,130,246,0.15);color:#3b82f6}
 .stats-icon-likes{background:rgba(34,197,94,0.15);color:#22c55e}
 .stats-icon-dislikes{background:rgba(239,68,68,0.15);color:#ef4444}
 .stats-icon-comments{background:rgba(168,85,247,0.15);color:#a855f7}
 .stats-icon-viewers{background:rgba(234,179,8,0.15);color:#eab308}
 .stats-icon-subscribers{background:rgba(236,72,153,0.15);color:#ec4899}
 .stats-icon-videos{background:rgba(14,165,233,0.15);color:#0ea5e9}
 .stats-card-pair{display:flex;gap:8px;align-items:stretch}
 .stats-card-pair .stats-card{flex:1;margin:0}
 @media(max-width:480px){.stats-card-pair{flex-direction:column}}
 .stats-info{flex:1;min-width:0}
 .stats-label{font-size:13px;color:rgba(255,255,255,0.72);margin-bottom:4px;font-weight:500}
 html:not([dark]) .stats-label{color:rgba(0,0,0,0.6)}
 .stats-value{font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:2px}
 html:not([dark]) .stats-value{color:#111}
 .stats-exact{font-size:13px;color:rgba(255,255,255,0.5);font-weight:400}
 html:not([dark]) .stats-exact{color:rgba(0,0,0,0.5)}
 @keyframes fadeInModal{from{opacity:0}to{opacity:1}}
 @keyframes scaleInModal{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
 @keyframes spin{to{transform:rotate(360deg)}}
 @keyframes dash{0%{stroke-dashoffset:80}50%{stroke-dashoffset:10}100%{stroke-dashoffset:80}}
 @media(max-width:768px){.stats-modal-container{width:95vw}.stats-grid{grid-template-columns:1fr}.stats-card{padding:16px}}
 `;
 const SETTINGS_KEY = 'youtube_stats_button_enabled';
 let statsButtonEnabled = localStorage.getItem(SETTINGS_KEY) !== 'false';
 let previousUrl = location.href;
 let isChecking = false;
 let experimentalNavListenerKey = null;
 let channelFeatures = {
 hasStreams: false,
 hasShorts: false,
 };
 const rateLimiter = {
 requests: new Map(),
 maxRequests: 10,
 timeWindow: 60000,
 canRequest: key => {
 const now = Date.now();
 const requests = rateLimiter.requests.get(key) || [];
 const recentRequests = requests.filter(time => now - time < rateLimiter.timeWindow);
 if (recentRequests.length >= rateLimiter.maxRequests) {
 console.warn(
 `[YouTube+][Stats] Rate limit exceeded for ${key}. Max ${rateLimiter.maxRequests} requests per minute.`
 );
 return false;
 }
 recentRequests.push(now);
 rateLimiter.requests.set(key, recentRequests);
 return true;
 },
 clear: () => {
 rateLimiter.requests.clear();
 },
 };
 function addStyles() {
 if (!byId('youtube-enhancer-styles')) {
 YouTubeUtils.StyleManager.add('youtube-enhancer-styles', styles);
 }
 }
 function isValidVideoId(id) {
 return id && /^[a-zA-Z0-9_-]{11}$/.test(id);
 }
 function getVideoIdFromParams() {
 const urlParams = new URLSearchParams(window.location.search);
 const videoId = urlParams.get('v');
 return isValidVideoId(videoId) ? `https://www.youtube.com/watch?v=${videoId}` : null;
 }
 function getVideoIdFromShorts(url) {
 const shortsMatch = url.match(/\/shorts\/([^?]+)/);
 if (shortsMatch && isValidVideoId(shortsMatch[1])) {
 return `https://www.youtube.com/shorts/${shortsMatch[1]}`;
 }
 return null;
 }
 function getCurrentVideoUrl() {
 try {
 const url = window.location.href;
 if (!url.includes('youtube.com')) {
 return null;
 }
 const fromParams = getVideoIdFromParams();
 if (fromParams) return fromParams;
 return getVideoIdFromShorts(url);
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', 'Failed to get video URL', error);
 return null;
 }
 }
 function getChannelIdentifier() {
 try {
 const url = window.location.href;
 let identifier = '';
 if (url.includes('/channel/')) {
 identifier = url.split('/channel/')[1].split('/')[0];
 } else if (url.includes('/@')) {
 identifier = url.split('/@')[1].split('/')[0];
 }
 if (identifier && /^[a-zA-Z0-9_-]+$/.test(identifier)) {
 return identifier;
 }
 return '';
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', 'Failed to get channel identifier', error);
 return '';
 }
 }
 function validateYouTubeUrl(url) {
 if (!url || typeof url !== 'string') {
 return false;
 }
 try {
 const parsedUrl = new URL(url);
 if (parsedUrl.hostname !== 'www.youtube.com' && parsedUrl.hostname !== 'youtube.com') {
 console.warn('[YouTube+][Stats] Invalid domain for channel check');
 return false;
 }
 return true;
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', 'Invalid URL for channel check', error);
 return false;
 }
 }
 async function fetchChannelHtml(url) {
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 10000);
 try {
 const response = await fetch(url, {
 credentials: 'same-origin',
 signal: controller.signal,
 headers: {
 Accept: 'text/html',
 },
 });
 clearTimeout(timeoutId);
 if (!response.ok) {
 console.warn(`[YouTube+][Stats] HTTP ${response.status} when checking channel tabs`);
 return null;
 }
 const html = await response.text();
 if (html.length > 5000000) {
 console.warn('[YouTube+][Stats] Response too large, skipping parse');
 return null;
 }
 return html;
 } catch (error) {
 if (error.name === 'AbortError') {
 console.warn('[YouTube+][Stats] Channel check timed out');
 }
 throw error;
 }
 }
 function extractYouTubeData(html) {
 const match = html.match(/var ytInitialData = (.+?);<\/script>/);
 if (!match || !match[1]) {
 return null;
 }
 try {
 return JSON.parse(match[1]);
 } catch (parseError) {
 YouTubeUtils?.logError?.('Stats', 'Failed to parse ytInitialData', parseError);
 return null;
 }
 }
 function getTabUrl(tab) {
 return tab?.tabRenderer?.endpoint?.commandMetadata?.webCommandMetadata?.url || null;
 }
 function tabMatches(url, pattern) {
 return typeof url === 'string' && pattern.test(url);
 }
 function isStreamsTab(tabUrl) {
 return tabMatches(tabUrl, /\/streams$/);
 }
 function isShortsTab(tabUrl) {
 return tabMatches(tabUrl, /\/shorts$/);
 }
 function hasBothContentTypes(hasStreams, hasShorts) {
 return hasStreams && hasShorts;
 }
 function updateContentTypeFlags(tabUrl, flags) {
 if (!flags.hasStreams && isStreamsTab(tabUrl)) {
 flags.hasStreams = true;
 }
 if (!flags.hasShorts && isShortsTab(tabUrl)) {
 flags.hasShorts = true;
 }
 }
 function analyzeChannelTabs(data) {
 const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
 const flags = { hasStreams: false, hasShorts: false };
 for (const tab of tabs) {
 const tabUrl = getTabUrl(tab);
 if (!tabUrl) continue;
 updateContentTypeFlags(tabUrl, flags);
 if (hasBothContentTypes(flags.hasStreams, flags.hasShorts)) break;
 }
 return flags;
 }
 function refreshStatsMenu() {
 const existingMenu = $('.stats-menu-container');
 if (existingMenu) {
 existingMenu.remove();
 createStatsMenu();
 }
 }
 async function checkChannelTabs(url) {
 if (isChecking) return;
 if (!validateYouTubeUrl(url)) {
 return;
 }
 if (!rateLimiter.canRequest('checkChannelTabs')) {
 return;
 }
 isChecking = true;
 try {
 const html = await fetchChannelHtml(url);
 if (!html) {
 isChecking = false;
 return;
 }
 const data = extractYouTubeData(html);
 if (!data) {
 isChecking = false;
 return;
 }
 channelFeatures = analyzeChannelTabs(data);
 refreshStatsMenu();
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', 'Failed to check channel tabs', error);
 } finally {
 isChecking = false;
 }
 }
 function isChannelPage(url) {
 try {
 return (
 url &&
 typeof url === 'string' &&
 url.includes('youtube.com/') &&
 (url.includes('/channel/') || url.includes('/@')) &&
 !url.includes('/video/') &&
 !url.includes('/watch')
 );
 } catch {
 return false;
 }
 }
 const checkUrlChange =
 YouTubeUtils?.debounce?.(() => {
 try {
 const currentUrl = location.href;
 if (currentUrl !== previousUrl) {
 previousUrl = currentUrl;
 if (isChannelPage(currentUrl)) {
 setTimeout(() => checkChannelTabs(currentUrl), 500);
 }
 }
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', 'URL change check failed', error);
 }
 }, 300) ||
 function () {
 try {
 const currentUrl = location.href;
 if (currentUrl !== previousUrl) {
 previousUrl = currentUrl;
 if (isChannelPage(currentUrl)) {
 setTimeout(() => checkChannelTabs(currentUrl), 500);
 }
 }
 } catch (error) {
 console.error('[YouTube+][Stats] URL change check failed:', error);
 }
 };
 function createStatsIcon() {
 const icon = document.createElement('div');
 icon.className = 'videoStats';
 const SVG_NS = window.YouTubePlusConstants?.SVG_NS || 'http://www.w3.org/2000/svg';
 const svg = document.createElementNS(SVG_NS, 'svg');
 svg.setAttribute('viewBox', '0 0 512 512');
 const path = document.createElementNS(SVG_NS, 'path');
 path.setAttribute(
 'd',
 'M500 89c13.8-11 16-31.2 5-45s-31.2-16-45-5L319.4 151.5 211.2 70.4c-11.7-8.8-27.8-8.5-39.2 .6L12 199c-13.8 11-16 31.2-5 45s31.2 16 45 5L192.6 136.5l108.2 81.1c11.7 8.8 27.8 8.5 39.2-.6L500 89zM160 256l0 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-192c0-17.7-14.3-32-32-32s-32 14.3-32 32zM32 352l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32zm288-64c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128c0-17.7-14.3-32-32-32zm96-32l0 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-192c0-17.7-14.3-32-32-32s-32 14.3-32 32z'
 );
 svg.appendChild(path);
 icon.appendChild(svg);
 icon.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 const videoUrl = getCurrentVideoUrl();
 if (videoUrl) {
 const urlParams = new URLSearchParams(new URL(videoUrl).search);
 const videoId = urlParams.get('v') || videoUrl.match(/\/shorts\/([^?]+)/)?.[1];
 if (videoId) {
 openStatsModal('video', videoId);
 }
 }
 });
 return icon;
 }
 function insertUniversalIcon() {
 if (!statsButtonEnabled) return;
 let masthead = $('ytd-masthead.style-scope');
 if (!masthead) masthead = $('ytd-masthead');
 if (!masthead || $('.videoStats')) return;
 const statsIcon = createStatsIcon();
 let endElem = $('#end.style-scope.ytd-masthead', masthead);
 if (!endElem) endElem = $('#end', masthead);
 if (endElem) {
 endElem.insertBefore(statsIcon, endElem.firstChild);
 } else {
 masthead.appendChild(statsIcon);
 }
 }
 function createButton(text, svgPath, viewBox, className, onClick) {
 const buttonViewModel = document.createElement('button-view-model');
 buttonViewModel.className = `yt-spec-button-view-model ${className}-view-model`;
 const button = document.createElement('button');
 button.className = `yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment ${className}-button`;
 button.setAttribute('aria-disabled', 'false');
 button.setAttribute('aria-label', text);
 button.style.display = 'flex';
 button.style.alignItems = 'center';
 button.style.justifyContent = 'center';
 button.style.gap = '8px';
 button.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 onClick();
 });
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('viewBox', viewBox);
 svg.style.width = '20px';
 svg.style.height = '20px';
 svg.style.fill = 'currentColor';
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute('d', svgPath);
 svg.appendChild(path);
 const buttonText = document.createElement('div');
 buttonText.className = `yt-spec-button-shape-next__button-text-content ${className}-text`;
 buttonText.textContent = text;
 buttonText.style.display = 'flex';
 buttonText.style.alignItems = 'center';
 const touchFeedback = document.createElement('yt-touch-feedback-shape');
 touchFeedback.style.borderRadius = 'inherit';
 const touchFeedbackDiv = document.createElement('div');
 touchFeedbackDiv.className =
 'yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response';
 touchFeedbackDiv.setAttribute('aria-hidden', 'true');
 const strokeDiv = document.createElement('div');
 strokeDiv.className = 'yt-spec-touch-feedback-shape__stroke';
 const fillDiv = document.createElement('div');
 fillDiv.className = 'yt-spec-touch-feedback-shape__fill';
 touchFeedbackDiv.appendChild(strokeDiv);
 touchFeedbackDiv.appendChild(fillDiv);
 touchFeedback.appendChild(touchFeedbackDiv);
 button.appendChild(svg);
 button.appendChild(buttonText);
 button.appendChild(touchFeedback);
 buttonViewModel.appendChild(button);
 return buttonViewModel;
 }
 const INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
 const INNERTUBE_CLIENT_VERSION = '2.20201209.01.00';
 function createInnerTubeRequestBody(videoId) {
 return {
 context: {
 client: {
 clientName: 'WEB',
 clientVersion: INNERTUBE_CLIENT_VERSION,
 hl: 'en',
 gl: 'US',
 },
 },
 videoId,
 };
 }
 function createInnerTubeFetchOptions(videoId) {
 return {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-YouTube-Client-Name': '1',
 'X-YouTube-Client-Version': INNERTUBE_CLIENT_VERSION,
 },
 body: JSON.stringify(createInnerTubeRequestBody(videoId)),
 };
 }
 function extractThumbnailUrl(details) {
 const thumbnails = details.thumbnail?.thumbnails;
 return thumbnails?.[thumbnails.length - 1]?.url || null;
 }
 function parseVideoStatsFromResponse(data) {
 const details = data.videoDetails || {};
 const microformat = data.microformat?.playerMicroformatRenderer || {};
 return {
 videoId: details.videoId,
 title: details.title,
 views: details.viewCount ? parseInt(details.viewCount, 10) : null,
 likes: null,
 thumbnail: extractThumbnailUrl(details),
 duration: details.lengthSeconds,
 country: microformat.availableCountries?.[0] || null,
 monetized: microformat.isFamilySafe !== undefined,
 channelId: details.channelId,
 };
 }
 async function fetchVideoStatsInnerTube(videoId) {
 if (!videoId) return null;
 try {
 const url = `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_API_KEY}&prettyPrint=false`;
 const response = await fetch(url, createInnerTubeFetchOptions(videoId));
 if (!response.ok) {
 console.warn(`[YouTube+][Stats] InnerTube API failed:`, response.status);
 return null;
 }
 const data = await response.json();
 return parseVideoStatsFromResponse(data);
 } catch (error) {
 console.error('[YouTube+][Stats] InnerTube fetch error:', error);
 return null;
 }
 }
 async function fetchDislikesData(videoId) {
 if (!videoId) return null;
 try {
 const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
 if (!response.ok) return null;
 const data = await response.json();
 return {
 likes: data.likes || null,
 dislikes: data.dislikes || null,
 rating: data.rating || null,
 };
 } catch (error) {
 console.error('[YouTube+][Stats] Failed to fetch dislikes:', error);
 return null;
 }
 }
 async function fetchStats(type, id) {
 if (!id) return { ok: false, status: 0, data: null };
 try {
 if (type === 'video') {
 const videoData = await fetchVideoStatsInnerTube(id);
 if (!videoData) {
 return { ok: false, status: 404, data: null };
 }
 const dislikeData = await fetchDislikesData(id);
 if (dislikeData) {
 videoData.likes = dislikeData.likes;
 videoData.dislikes = dislikeData.dislikes;
 videoData.rating = dislikeData.rating;
 }
 return { ok: true, status: 200, data: videoData };
 }
 const endpoint = `https://api.livecounts.io/youtube-live-subscriber-counter/stats/${id}`;
 const response = await fetch(endpoint, {
 method: 'GET',
 headers: {
 Accept: 'application/json',
 },
 });
 if (!response.ok) {
 console.warn(`[YouTube+][Stats] Failed to fetch ${type} stats:`, response.status);
 return { ok: false, status: response.status, data: null, url: endpoint };
 }
 const data = await response.json();
 return { ok: true, status: response.status, data, url: endpoint };
 } catch (error) {
 YouTubeUtils?.logError?.('Stats', `Failed to fetch ${type} stats`, error);
 return { ok: false, status: 0, data: null };
 }
 }
 function getPageVideoStats() {
 try {
 const helpers = window.YouTubeStatsHelpers || {};
 const fallbackHelpers = {
 extractViews() {
 try {
 const el = $('yt-view-count-renderer, #count .view-count');
 const text = el && el.textContent ? el.textContent.trim() : '';
 const match = text.replace(/[^0-9,\.]/g, '').replace(/,/g, '');
 return match ? { views: Number(match) || null } : {};
 } catch {
 return {};
 }
 },
 extractLikes() {
 try {
 const btn =
 document.querySelector(
 'ytd-toggle-button-renderer[is-icon-button] yt-formatted-string'
 ) ||
 document.querySelector(
 '#top-level-buttons-computed ytd-toggle-button-renderer:first-child yt-formatted-string'
 );
 const text = btn && btn.textContent ? btn.textContent.trim() : '';
 const match = text.replace(/[^0-9,\.]/g, '').replace(/,/g, '');
 return match ? { likes: Number(match) || null } : {};
 } catch {
 return {};
 }
 },
 extractDislikes() {
 return {};
 },
 extractComments() {
 try {
 const el = document.querySelector(
 '#count > ytd-comment-thread-renderer, ytd-comments-header-renderer #count'
 );
 const text = el && el.textContent ? el.textContent.trim() : '';
 const match = text.replace(/[^0-9,\.]/g, '').replace(/,/g, '');
 return match ? { comments: Number(match) || null } : {};
 } catch {
 return {};
 }
 },
 extractSubscribers() {
 try {
 const el = $('#owner-sub-count, #subscriber-count');
 const text = el && el.textContent ? el.textContent.trim() : '';
 return text ? { subscribers: text } : {};
 } catch {
 return {};
 }
 },
 extractThumbnail() {
 try {
 const meta = $('link[rel="image_src"]') || $('meta[property="og:image"]');
 const url = meta && (meta.href || meta.content) ? meta.href || meta.content : null;
 return url ? { thumbnail: url } : {};
 } catch {
 return {};
 }
 },
 extractTitle() {
 try {
 const el = $('h1.title yt-formatted-string') || $('h1');
 const text = el && el.textContent ? el.textContent.trim() : '';
 return text ? { title: text } : {};
 } catch {
 return {};
 }
 },
 };
 const use = helpers && helpers.extractViews ? helpers : fallbackHelpers;
 const result = Object.assign(
 {},
 use.extractViews?.() || {},
 use.extractLikes?.() || {},
 use.extractDislikes?.() || {},
 use.extractComments?.() || {},
 use.extractSubscribers?.() || {},
 use.extractThumbnail?.() || {},
 use.extractTitle?.() || {}
 );
 return Object.keys(result).length > 0 ? result : null;
 } catch (e) {
 YouTubeUtils?.logError?.('Stats', 'Failed to read page stats', e);
 return null;
 }
 }
 function buildPageStatCard(value, labelKey, iconClass, iconSvg) {
 if (value === undefined || value === null) return '';
 return `
 <div class="stats-card">
 <div class="stats-icon ${iconClass}">
 ${iconSvg}
 </div>
 <div class="stats-info">
 <div class="stats-label">${t(labelKey)}</div>
 <div class="stats-value">${formatNumber(value)}</div>
 <div class="stats-exact">${(value || 0).toLocaleString()}</div>
 </div>
 </div>
 `;
 }
 function buildValueOnlyCard(
 value,
 iconOrClass = '',
 options = { showValue: true, showIcon: true }
 ) {
 const { showValue, showIcon } = options;
 if (!showValue && !showIcon) return '';
 let displayVal = '';
 if (showValue) {
 displayVal = value === undefined || value === null ? t('unknown') : value;
 }
 let iconContent = '';
 let extraClass = '';
 if (showIcon) {
 if (iconOrClass && typeof iconOrClass === 'string' && iconOrClass.indexOf('<') >= 0) {
 iconContent = iconOrClass;
 } else if (iconOrClass && typeof iconOrClass === 'string') {
 extraClass = ` ${iconOrClass}`;
 }
 }
 return `
 <div class="stats-card">
 <div class="stats-icon${extraClass}">${iconContent}</div>
 <div class="stats-info">
 ${showValue ? `<div class="stats-value">${displayVal}</div>` : ''}
 </div>
 </div>
 `;
 }
 function buildStatCards(pageStats) {
 const cardConfigs = [
 {
 value: pageStats.views,
 key: 'views',
 icon: 'stats-icon-views',
 svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
 },
 {
 value: pageStats.likes,
 key: 'likes',
 icon: 'stats-icon-likes',
 svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
 },
 {
 value: pageStats.dislikes,
 key: 'dislikes',
 icon: 'stats-icon-dislikes',
 svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>',
 },
 {
 value: pageStats.comments,
 key: 'comments',
 icon: 'stats-icon-comments',
 svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
 },
 ];
 return cardConfigs
 .map(config => buildPageStatCard(config.value, config.key, config.icon, config.svg))
 .filter(card => card);
 }
 function getThumbnailUrl(id, pageStats) {
 if (pageStats && pageStats.thumbnail) {
 return pageStats.thumbnail;
 }
 if (id) {
 return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
 }
 return '';
 }
 function buildExtraCards(extras) {
 const monetizationText = extras.monetization || t('unknown');
 const countryText = extras.country || t('unknown');
 const durationText = extras.duration || t('unknown');
 const extraMonCard = buildValueOnlyCard(monetizationText, 'stats-icon-subscribers', {
 showValue: false,
 showIcon: true,
 });
 const extraCountryCard = buildValueOnlyCard(countryText, 'stats-icon-views', {
 showValue: false,
 showIcon: true,
 });
 const extraDurationCard = buildValueOnlyCard(durationText, 'stats-icon-videos', {
 showValue: true,
 showIcon: false,
 });
 return `${extraMonCard}${extraCountryCard}${extraDurationCard}`;
 }
 function buildThumbnailLayout(titleHtml, thumbUrl, gridHtml, extras) {
 const extraCards = buildExtraCards(extras);
 const leftHtml = `<div class="stats-thumb-left"><img class="stats-thumb-img" src="${thumbUrl}" alt="thumbnail"><div class="stats-thumb-extras">${extraCards}</div></div>`;
 return `${titleHtml}<div class="stats-thumb-row">${leftHtml}${gridHtml}</div>`;
 }
 function renderPageFallback(container, pageStats, id) {
 const cards = buildStatCards(pageStats);
 const gridHtml = `<div class="stats-grid">${cards.join('')}</div>`;
 const title = (pageStats && pageStats.title) || document.title || '';
 const titleHtml = title ? `<div class="stats-thumb-title-centered">${title}</div>` : '';
 const thumbUrl = getThumbnailUrl(id, pageStats);
 const extras = getVideoExtras(null, pageStats, id);
 if (thumbUrl) {
 container.innerHTML = buildThumbnailLayout(titleHtml, thumbUrl, gridHtml, extras);
 } else {
 container.innerHTML = `${titleHtml}${gridHtml}`;
 }
 }
 function formatNumber(num) {
 if (!num || isNaN(num)) return '0';
 const absNum = Math.abs(num);
 if (absNum >= 1e9) {
 return `${(num / 1e9).toFixed(1)}B`;
 }
 if (absNum >= 1e6) {
 return `${(num / 1e6).toFixed(1)}M`;
 }
 if (absNum >= 1e3) {
 return `${(num / 1e3).toFixed(1)}K`;
 }
 return num.toLocaleString();
 }
 function makeStatsCard(labelKey, value, exact, iconClass, iconSvg) {
 const display = value == null ? t('unknown') : formatNumber(value);
 let exactText = '—';
 if (exact !== null && exact !== undefined) {
 const numExact = Number(exact);
 exactText = !isNaN(numExact) ? Math.floor(numExact).toLocaleString() : String(exact);
 }
 return `
 <div class="stats-card">
 <div class="stats-icon ${iconClass}">
 ${iconSvg}
 </div>
 <div class="stats-info">
 <div class="stats-label">${t(labelKey)}</div>
 <div class="stats-value">${display}</div>
 <div class="stats-exact">${exactText}</div>
 </div>
 </div>
 `;
 }
 function getFirstAvailableField(stats, ...fields) {
 for (const field of fields) {
 if (stats?.[field] != null) return stats[field];
 }
 return null;
 }
 function getThumbnailUrl(stats, id) {
 return stats?.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
 }
 function extractVideoFields(stats, id) {
 return {
 views: getFirstAvailableField(stats, 'liveViews', 'views', 'viewCount'),
 likes: getFirstAvailableField(stats, 'liveLikes', 'likes', 'likeCount'),
 dislikes: getFirstAvailableField(stats, 'dislikes', 'liveDislikes', 'dislikeCount'),
 comments: getFirstAvailableField(stats, 'liveComments', 'comments', 'commentCount'),
 liveViewer: getFirstAvailableField(stats, 'liveViewer', 'live_viewers'),
 title: stats?.title || document.title || '',
 thumbUrl: getThumbnailUrl(stats, id),
 country: getFirstAvailableField(stats, 'country'),
 monetized: stats?.monetized ?? null,
 duration: getFirstAvailableField(stats, 'duration'),
 };
 }
 function mergeVideoStats(apiStats, pageStats) {
 if (!pageStats) return apiStats || {};
 const getValue = (...fields) => {
 for (const field of fields) {
 if (apiStats?.[field] != null) return apiStats[field];
 }
 for (const field of fields) {
 if (pageStats?.[field] != null) return pageStats[field];
 }
 return null;
 };
 return {
 ...apiStats,
 views: getValue('views', 'viewCount'),
 likes: getValue('likes', 'likeCount'),
 dislikes: getValue('dislikes'),
 comments: getValue('comments', 'commentCount'),
 thumbnail: getValue('thumbnail'),
 title: getValue('title'),
 liveViewer: getValue('liveViewer'),
 duration: getValue('duration'),
 country: getValue('country'),
 monetized: getValue('monetized', 'isMonetized', 'monetization'),
 };
 }
 function getVideoExtras(apiStats, pageStats) {
 const helpers = window.YouTubeStatsHelpers || {};
 const duration =
 apiStats?.duration ??
 pageStats?.duration ??
 helpers.getDurationFromSources?.(apiStats, pageStats) ??
 null;
 const country =
 apiStats?.country ??
 pageStats?.country ??
 helpers.getCountryFromSources?.(apiStats, pageStats) ??
 null;
 let monetization = null;
 if (apiStats?.monetized != null) {
 monetization = apiStats.monetized === true ? t('yes') : t('no');
 } else if (pageStats?.monetized != null) {
 monetization = pageStats.monetized === true ? t('yes') : t('no');
 } else {
 monetization = helpers.getMonetizationFromSources?.(apiStats, pageStats, t) ?? null;
 }
 return { duration, country, monetization };
 }
 function createStatsModalCloseButton(overlay) {
 const closeBtn = document.createElement('button');
 closeBtn.className = 'thumbnail-modal-close thumbnail-modal-action-btn';
 closeBtn.innerHTML = `
 <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
 </svg>
 `;
 closeBtn.title = t('close');
 closeBtn.setAttribute('aria-label', t('close'));
 closeBtn.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 overlay.remove();
 });
 return closeBtn;
 }
 function createLoadingSpinner() {
 const loader = document.createElement('div');
 loader.className = 'stats-loader';
 loader.innerHTML = `
 <svg class="stats-spinner" viewBox="0 0 50 50">
 <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4"></circle>
 </svg>
 <p>${t('loadingStats')}</p>
 `;
 return loader;
 }
 function createStatsModalStructure(overlay) {
 const container = document.createElement('div');
 container.className = 'stats-modal-container';
 const content = document.createElement('div');
 content.className = 'stats-modal-content';
 const body = document.createElement('div');
 body.className = 'stats-modal-body';
 body.appendChild(createLoadingSpinner());
 content.appendChild(body);
 const wrapper = document.createElement('div');
 wrapper.className = 'thumbnail-modal-wrapper';
 const actionsDiv = document.createElement('div');
 actionsDiv.className = 'thumbnail-modal-actions';
 actionsDiv.appendChild(createStatsModalCloseButton(overlay));
 wrapper.appendChild(content);
 wrapper.appendChild(actionsDiv);
 container.appendChild(wrapper);
 return { body, container };
 }
 function setupModalEventHandlers(overlay) {
 overlay.addEventListener('click', ({ target }) => {
 if (target === overlay) overlay.remove();
 });
 function escHandler(e) {
 if (e.key === 'Escape') {
 overlay.remove();
 window.removeEventListener('keydown', escHandler, true);
 }
 }
 window.addEventListener('keydown', escHandler, true);
 }
 function renderErrorMessage(body, result) {
 const statusText = result?.status ? ` (${result.status})` : '';
 const endpointHint = result?.url
 ? `<div style="margin-top:8px;font-size:12px;opacity:0.8;word-break:break-all">${result.url}</div>`
 : '';
 body.innerHTML = `
 <div class="stats-error">
 <svg class="stats-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <circle cx="12" cy="12" r="10"></circle>
 <line x1="12" y1="8" x2="12" y2="12"></line>
 <line x1="12" y1="16" x2="12.01" y2="16"></line>
 </svg>
 <p>${t('failedToLoadStats')}${statusText}</p>
 ${endpointHint}
 </div>
 `;
 }
 function handleFailedFetch(body, result, id) {
 const pageStats = getPageVideoStats();
 if (pageStats) {
 renderPageFallback(body, pageStats, id);
 } else {
 renderErrorMessage(body, result);
 }
 }
 function displayStatsBasedOnType(body, type, stats, id) {
 if (type === 'video') {
 try {
 const pageStats = getPageVideoStats();
 const merged = mergeVideoStats(stats, pageStats);
 displayVideoStats(body, merged, id);
 } catch {
 displayVideoStats(body, stats, id);
 }
 } else {
 displayChannelStats(body, stats);
 }
 }
 async function openStatsModal(type, id) {
 if (!type || !id) {
 console.error('[YouTube+][Stats] Invalid parameters for modal');
 return;
 }
 const existingOverlays = $$('.stats-modal-overlay');
 for (let i = 0; i < existingOverlays.length; i++) {
 try {
 existingOverlays[i].remove();
 } catch {
 }
 }
 const overlay = document.createElement('div');
 overlay.className = 'stats-modal-overlay';
 const { body, container } = createStatsModalStructure(overlay);
 overlay.appendChild(container);
 setupModalEventHandlers(overlay);
 document.body.appendChild(overlay);
 const result = await fetchStats(type, id);
 if (!result?.ok) {
 handleFailedFetch(body, result, id);
 return;
 }
 displayStatsBasedOnType(body, type, result.data, id);
 }
 function getVideoStatDefinitions(fields) {
 const { views, likes, dislikes, comments } = fields;
 return [
 {
 label: 'views',
 value: views,
 exact: views,
 iconClass: 'stats-icon-views',
 iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
 },
 {
 label: 'likes',
 value: likes,
 exact: likes,
 iconClass: 'stats-icon-likes',
 iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
 },
 {
 label: 'dislikes',
 value: dislikes,
 exact: dislikes,
 iconClass: 'stats-icon-dislikes',
 iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>`,
 },
 {
 label: 'comments',
 value: comments,
 exact: comments,
 iconClass: 'stats-icon-comments',
 iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
 },
 ];
 }
 function createLiveViewerCard(liveViewer) {
 if (liveViewer === undefined || liveViewer === null) return '';
 return makeStatsCard(
 'liveViewers',
 liveViewer,
 liveViewer,
 'stats-icon-viewers',
 `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
 );
 }
 function createMonetizationCard(extras, stats) {
 const monetizationValue = extras.monetization || t('unknown');
 const isMonetized = extras.monetization === t('yes') || stats?.monetized === true;
 const monIcon = isMonetized
 ? `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
 : `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
 return `<div class="stats-card" style="padding:10px;"><div class="stats-icon stats-icon-subscribers">${monIcon}</div><div class="stats-info"><div class="stats-label" style="font-size:12px;">${t('monetization')}</div><div class="stats-value" style="font-size:16px;">${monetizationValue}</div></div></div>`;
 }
 function createCountryCard(extras) {
 const countryValue = extras.country || t('unknown');
 const countryCode =
 extras.country && extras.country !== t('unknown') ? extras.country.toUpperCase() : '';
 const globeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
 if (countryCode) {
 const flagUrl = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/${countryCode.toLowerCase()}.svg`;
 return `<div class="stats-card" style="padding:10px;"><div class="stats-icon stats-icon-views" data-fallback-icon="globe"><img class="country-flag" src="${flagUrl}" alt="${countryCode}" width="32" height="24" style="border-radius:4px;"/></div><div class="stats-info"><div class="stats-label" style="font-size:12px;">${t('country')}</div><div class="stats-value" style="font-size:16px;">${countryCode}</div></div></div>`;
 }
 return `<div class="stats-card" style="padding:10px;"><div class="stats-icon stats-icon-views">${globeIcon}</div><div class="stats-info"><div class="stats-label" style="font-size:12px;">${t('country')}</div><div class="stats-value" style="font-size:16px;">${countryValue}</div></div></div>`;
 }
 function formatDuration(value) {
 if (value == null) return null;
 function pad(n) {
 return String(n).padStart(2, '0');
 }
 function secToHms(sec) {
 sec = Math.max(0, Math.floor(Number(sec) || 0));
 const h = Math.floor(sec / 3600);
 const m = Math.floor((sec % 3600) / 60);
 const s = sec % 60;
 if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
 return `${m}:${pad(s)}`;
 }
 if (typeof value === 'number' && Number.isFinite(value)) return secToHms(value);
 if (typeof value === 'string') {
 const s = value.trim();
 if (/^\d+$/.test(s)) return secToHms(Number(s));
 const iso = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(s);
 if (iso) {
 const h = parseInt(iso[1] || '0', 10);
 const m = parseInt(iso[2] || '0', 10);
 const sec = parseInt(iso[3] || '0', 10);
 const total = h * 3600 + m * 60 + sec;
 return secToHms(total);
 }
 if (/^\d+:\d{1,2}(:\d{1,2})?$/.test(s)) {
 const parts = s.split(':').map(p => p.replace(/^0+(\d)/, '$1'));
 if (parts.length === 2) {
 const [mm, ss] = parts;
 return `${Number(mm)}:${pad(Number(ss))}`;
 }
 if (parts.length === 3) {
 const [hh, mm, ss] = parts;
 return `${Number(hh)}:${pad(Number(mm))}:${pad(Number(ss))}`;
 }
 }
 return s || null;
 }
 return null;
 }
 function createDurationCard(extras) {
 const raw = extras?.duration ?? null;
 const formatted = formatDuration(raw);
 const durationValue = formatted || (raw ? String(raw) : null) || t('unknown');
 const durationIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
 return `<div class="stats-card" style="padding:10px;"><div class="stats-icon stats-icon-videos">${durationIcon}</div><div class="stats-info"><div class="stats-label" style="font-size:12px;">${t('duration')}</div><div class="stats-value" style="font-size:16px;">${durationValue}</div></div></div>`;
 }
 function buildMetaCardsHtml(stats, extras) {
 const cards = [
 createMonetizationCard(extras, stats),
 createCountryCard(extras),
 createDurationCard(extras),
 ];
 return cards.filter(Boolean).join('');
 }
 function displayVideoStats(container, stats, id) {
 const fields = extractVideoFields(stats, id);
 const { liveViewer, title, thumbUrl } = fields;
 const titleHtml = title ? `<div class="stats-thumb-title-centered">${title}</div>` : '';
 const defs = getVideoStatDefinitions(fields);
 const viewsDef = defs.find(d => d.label === 'views');
 const likesDef = defs.find(d => d.label === 'likes');
 const dislikesDef = defs.find(d => d.label === 'dislikes');
 const commentsDef = defs.find(d => d.label === 'comments');
 const viewsHtml = viewsDef
 ? makeStatsCard(
 viewsDef.label,
 viewsDef.value,
 viewsDef.exact,
 viewsDef.iconClass,
 viewsDef.iconSvg
 )
 : '';
 const likesHtml = likesDef
 ? makeStatsCard(
 likesDef.label,
 likesDef.value,
 likesDef.exact,
 likesDef.iconClass,
 likesDef.iconSvg
 )
 : '';
 const dislikesHtml = dislikesDef
 ? makeStatsCard(
 dislikesDef.label,
 dislikesDef.value,
 dislikesDef.exact,
 dislikesDef.iconClass,
 dislikesDef.iconSvg
 )
 : '';
 const commentsHtml = commentsDef
 ? makeStatsCard(
 commentsDef.label,
 commentsDef.value,
 commentsDef.exact,
 commentsDef.iconClass,
 commentsDef.iconSvg
 )
 : '';
 const pairHtml =
 likesHtml || dislikesHtml
 ? `<div class="stats-card-pair">${likesHtml}${dislikesHtml}</div>`
 : '';
 const parts = [viewsHtml, pairHtml, commentsHtml].filter(Boolean);
 const liveViewerCard = createLiveViewerCard(liveViewer);
 if (liveViewerCard) parts.push(liveViewerCard);
 const gridHtml = `<div class="stats-grid">${parts.join('')}</div>`;
 if (thumbUrl) {
 const extras = getVideoExtras(stats, null);
 const metaCardsHtml = buildMetaCardsHtml(stats, extras);
 const metaExtrasHtml = metaCardsHtml
 ? `<div class="stats-thumb-extras" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">${metaCardsHtml}</div>`
 : '';
 const leftHtml = `<div class="stats-thumb-left"><img class="stats-thumb-img" src="${thumbUrl}" alt="thumbnail">${metaExtrasHtml}</div>`;
 container.innerHTML = `${titleHtml}<div class="stats-thumb-row">${leftHtml}${gridHtml}</div>`;
 } else {
 container.innerHTML = `${titleHtml}${gridHtml}`;
 }
 setupFlagImageErrorHandlers(container);
 }
 function setupFlagImageErrorHandlers(container) {
 const flagImages = $$('.country-flag', container);
 const globeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
 flagImages.forEach(img => {
 img.addEventListener(
 'error',
 function () {
 const iconContainer = this.parentElement;
 if (iconContainer && iconContainer.dataset.fallbackIcon === 'globe') {
 this.style.display = 'none';
 iconContainer.innerHTML = globeIcon;
 }
 },
 { once: true }
 );
 });
 }
 function displayChannelStats(container, stats) {
 const { liveSubscriber, liveViews, liveVideos } = stats;
 container.innerHTML = `
 <div class="stats-grid">
 <div class="stats-card">
 <div class="stats-icon stats-icon-subscribers">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
 <circle cx="9" cy="7" r="4"></circle>
 <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
 <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
 </svg>
 </div>
 <div class="stats-info">
 <div class="stats-label">${t('subscribers')}</div>
 <div class="stats-value">${formatNumber(liveSubscriber)}</div>
 <div class="stats-exact">${(liveSubscriber || 0).toLocaleString()}</div>
 </div>
 </div>
 <div class="stats-card">
 <div class="stats-icon stats-icon-views">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
 <circle cx="12" cy="12" r="3"></circle>
 </svg>
 </div>
 <div class="stats-info">
 <div class="stats-label">${t('totalViews')}</div>
 <div class="stats-value">${formatNumber(liveViews)}</div>
 <div class="stats-exact">${(liveViews || 0).toLocaleString()}</div>
 </div>
 </div>
 <div class="stats-card">
 <div class="stats-icon stats-icon-videos">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <polygon points="23 7 16 12 23 17 23 7"></polygon>
 <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
 </svg>
 </div>
 <div class="stats-info">
 <div class="stats-label">${t('totalVideos')}</div>
 <div class="stats-value">${formatNumber(liveVideos)}</div>
 <div class="stats-exact">${(liveVideos || 0).toLocaleString()}</div>
 </div>
 </div>
 </div>
 `;
 }
 function createStatsMenu() {
 if (!statsButtonEnabled) return undefined;
 if ($('.stats-menu-container')) {
 return undefined;
 }
 const containerDiv = document.createElement('div');
 containerDiv.className = 'yt-flexible-actions-view-model-wiz__action stats-menu-container';
 const mainButtonViewModel = document.createElement('button-view-model');
 mainButtonViewModel.className = 'yt-spec-button-view-model main-stats-view-model';
 const mainButton = document.createElement('button');
 mainButton.className =
 'yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment main-stats-button';
 mainButton.setAttribute('aria-disabled', 'false');
 mainButton.setAttribute('aria-label', t('stats'));
 mainButton.style.display = 'flex';
 mainButton.style.alignItems = 'center';
 mainButton.style.justifyContent = 'center';
 mainButton.style.gap = '8px';
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('viewBox', '0 0 512 512');
 svg.style.width = '20px';
 svg.style.height = '20px';
 svg.style.fill = 'currentColor';
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute(
 'd',
 'M500 89c13.8-11 16-31.2 5-45s-31.2-16-45-5L319.4 151.5 211.2 70.4c-11.7-8.8-27.8-8.5-39.2 .6L12 199c-13.8 11-16 31.2-5 45s31.2 16 45 5L192.6 136.5l108.2 81.1c11.7 8.8 27.8 8.5 39.2-.6L500 89zM160 256l0 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-192c0-17.7-14.3-32-32-32s-32 14.3-32 32zM32 352l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32zm288-64c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128c0-17.7-14.3-32-32-32zm96-32l0 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-192c0-17.7-14.3-32-32-32s-32 14.3-32 32z'
 );
 svg.appendChild(path);
 const buttonText = document.createElement('div');
 buttonText.className = 'yt-spec-button-shape-next__button-text-content main-stats-text';
 buttonText.textContent = t('stats');
 buttonText.style.display = 'flex';
 buttonText.style.alignItems = 'center';
 const touchFeedback = document.createElement('yt-touch-feedback-shape');
 touchFeedback.style.borderRadius = 'inherit';
 const touchFeedbackDiv = document.createElement('div');
 touchFeedbackDiv.className =
 'yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response';
 touchFeedbackDiv.setAttribute('aria-hidden', 'true');
 const strokeDiv = document.createElement('div');
 strokeDiv.className = 'yt-spec-touch-feedback-shape__stroke';
 const fillDiv = document.createElement('div');
 fillDiv.className = 'yt-spec-touch-feedback-shape__fill';
 touchFeedbackDiv.appendChild(strokeDiv);
 touchFeedbackDiv.appendChild(fillDiv);
 touchFeedback.appendChild(touchFeedbackDiv);
 mainButton.appendChild(svg);
 mainButton.appendChild(buttonText);
 mainButton.appendChild(touchFeedback);
 mainButtonViewModel.appendChild(mainButton);
 containerDiv.appendChild(mainButtonViewModel);
 const horizontalMenu = document.createElement('div');
 horizontalMenu.className = 'stats-horizontal-menu';
 const channelButtonContainer = document.createElement('div');
 channelButtonContainer.className = 'stats-menu-button channel-stats-container';
 const channelButton = createButton(
 t('channel'),
 'M64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l512 0c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48zM0 64C0 28.7 28.7 0 64 0L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 416c-35.3 0-64-28.7-64-64L0 64zM120 464l400 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-400 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z',
 '0 0 640 512',
 'channel-stats',
 () => {
 const channelId = getChannelIdentifier();
 if (channelId) {
 openStatsModal('channel', channelId);
 }
 }
 );
 channelButtonContainer.appendChild(channelButton);
 horizontalMenu.appendChild(channelButtonContainer);
 if (channelFeatures.hasStreams) {
 const liveButtonContainer = document.createElement('div');
 liveButtonContainer.className = 'stats-menu-button live-stats-container';
 const liveButton = createButton(
 t('live'),
 'M99.8 69.4c10.2 8.4 11.6 23.6 3.2 33.8C68.6 144.7 48 197.9 48 256s20.6 111.3 55 152.8c8.4 10.2 7 25.3-3.2 33.8s-25.3 7-33.8-3.2C24.8 389.6 0 325.7 0 256S24.8 122.4 66 72.6c8.4-10.2 23.6-11.6 33.8-3.2zm376.5 0c10.2-8.4 25.3-7 33.8 3.2c41.2 49.8 66 113.8 66 183.4s-24.8 133.6-66 183.4c-8.4 10.2-23.6 11.6-33.8 3.2s-11.6-23.6-3.2-33.8c34.3-41.5 55-94.7 55-152.8s-20.6-111.3-55-152.8c-8.4-10.2-7-25.3 3.2-33.8zM248 256a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zm-61.1-78.5C170 199.2 160 226.4 160 256s10 56.8 26.9 78.5c8.1 10.5 6.3 25.5-4.2 33.7s-25.5 6.3-33.7-4.2c-23.2-29.8-37-67.3-37-108s13.8-78.2 37-108c8.1-10.5 23.2-12.3 33.7-4.2s12.3 23.2 4.2 33.7zM427 148c23.2 29.8 37 67.3 37 108s-13.8 78.2-37 108c-8.1 10.5-23.2 12.3-33.7 4.2s-12.3-23.2-4.2-33.7C406 312.8 416 285.6 416 256s-10-56.8-26.9-78.5c-8.1-10.5-6.3-25.5 4.2-33.7s25.5-6.3 33.7 4.2z',
 '0 0 576 512',
 'live-stats',
 () => {
 const channelId = getChannelIdentifier();
 if (channelId) {
 openStatsModal('channel', channelId);
 }
 }
 );
 liveButtonContainer.appendChild(liveButton);
 horizontalMenu.appendChild(liveButtonContainer);
 }
 if (channelFeatures.hasShorts) {
 const shortsButtonContainer = document.createElement('div');
 shortsButtonContainer.className = 'stats-menu-button shorts-stats-container';
 const shortsButton = createButton(
 t('shorts'),
 'M80 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l224 0c8.8 0 16-7.2 16-16l0-384c0-8.8-7.2-16-16-16L80 48zM16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM160 400l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z',
 '0 0 384 512',
 'shorts-stats',
 () => {
 const channelId = getChannelIdentifier();
 if (channelId) {
 openStatsModal('channel', channelId);
 }
 }
 );
 shortsButtonContainer.appendChild(shortsButton);
 horizontalMenu.appendChild(shortsButtonContainer);
 }
 containerDiv.appendChild(horizontalMenu);
 const joinButton = document.querySelector(
 '.yt-flexible-actions-view-model-wiz__action:not(.stats-menu-container)'
 );
 if (joinButton) {
 joinButton.parentNode.appendChild(containerDiv);
 } else {
 const buttonContainer = document.querySelector('#subscribe-button + #buttons');
 if (buttonContainer) {
 buttonContainer.appendChild(containerDiv);
 }
 }
 return containerDiv;
 }
 function checkAndAddMenu() {
 if (!statsButtonEnabled) return;
 const joinButton = document.querySelector(
 '.yt-flexible-actions-view-model-wiz__action:not(.stats-menu-container)'
 );
 const statsMenu = document.querySelector('.stats-menu-container');
 if (joinButton && !statsMenu) {
 createStatsMenu();
 }
 }
 function checkAndInsertIcon() {
 if (!statsButtonEnabled) return;
 insertUniversalIcon();
 }
 function addSettingsUI() {
 const section = $('.ytp-plus-settings-section[data-section="experimental"]');
 if (!section || $('.stats-button-settings-item', section)) return;
 const item = document.createElement('div');
 item.className = 'ytp-plus-settings-item stats-button-settings-item';
 item.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('statisticsButton')}</label>
 <div class="ytp-plus-settings-item-description">${t('statisticsButtonDescription')}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" ${statsButtonEnabled ? 'checked' : ''}>
 `;
 section.appendChild(item);
 item.querySelector('input').addEventListener('change', e => {
 const { target } = e;
 const input = (target);
 statsButtonEnabled = input.checked;
 localStorage.setItem(SETTINGS_KEY, statsButtonEnabled ? 'true' : 'false');
 $$('.videoStats,.stats-menu-container').forEach(el => el.remove());
 if (statsButtonEnabled) {
 checkAndInsertIcon();
 checkAndAddMenu();
 }
 });
 }
 const settingsObserver = new MutationObserver(mutations => {
 for (const { addedNodes } of mutations) {
 for (const node of addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addSettingsUI, 50);
 }
 }
 }
 if (document.querySelector('.ytp-plus-settings-nav-item[data-section="experimental"].active')) {
 setTimeout(addSettingsUI, 50);
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(settingsObserver);
 if (document.body) {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 });
 }
 const handleExperimentalNavClick = e => {
 const { target } = e;
 const el = (target);
 if (
 el.classList?.contains('ytp-plus-settings-nav-item') &&
 el.dataset?.section === 'experimental'
 ) {
 setTimeout(addSettingsUI, 50);
 }
 };
 if (!experimentalNavListenerKey) {
 experimentalNavListenerKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'click',
 handleExperimentalNavClick,
 true
 );
 }
 function init() {
 addStyles();
 if (statsButtonEnabled) {
 checkAndInsertIcon();
 checkAndAddMenu();
 }
 history.pushState = (function (f) {
 return function (...args) {
 const fAny = (f);
 const result = fAny.call(this, ...args);
 checkUrlChange();
 return result;
 };
 })(history.pushState);
 history.replaceState = (function (f) {
 return function (...args) {
 const fAny = (f);
 const result = fAny.call(this, ...args);
 checkUrlChange();
 return result;
 };
 })(history.replaceState);
 window.addEventListener('popstate', checkUrlChange);
 if (isChannelPage(location.href)) {
 checkChannelTabs(location.href);
 }
 }
 const observer = new MutationObserver(mutations => {
 for (const mutation of mutations) {
 if (mutation.type === 'childList') {
 if (statsButtonEnabled) {
 checkAndInsertIcon();
 checkAndAddMenu();
 }
 }
 }
 });
 if (document.body) {
 observer.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, { childList: true, subtree: true });
 });
 }
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
 window.addEventListener('yt-navigate-finish', () => {
 if (statsButtonEnabled) {
 checkAndInsertIcon();
 checkAndAddMenu();
 if (isChannelPage(location.href)) {
 checkChannelTabs(location.href);
 }
 }
 });
 document.addEventListener('yt-action', event => {
 const ev = (event);
 if (ev.detail && ev.detail.actionName === 'yt-reload-continuation-items-command') {
 if (statsButtonEnabled) {
 checkAndInsertIcon();
 checkAndAddMenu();
 }
 }
 });
})();
(function () {
 'use strict';
 const isStudioPageCount = () => {
 try {
 const host = location.hostname || '';
 const href = location.href || '';
 return (
 host.includes('studio.youtube.com') ||
 host.includes('studio.') ||
 href.includes('studio.youtube.com')
 );
 } catch {
 return false;
 }
 };
 if (isStudioPageCount()) return;
 const _globalI18n_stats =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n_stats && typeof _globalI18n_stats.t === 'function') {
 return _globalI18n_stats.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const CONFIG = {
 OPTIONS: ['subscribers', 'views', 'videos'],
 FONT_LINK: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap',
 STATS_API_URL: 'https://api.livecounts.io/youtube-live-subscriber-counter/stats/',
 DEFAULT_UPDATE_INTERVAL: 2000,
 DEFAULT_OVERLAY_OPACITY: 0.75,
 MAX_RETRIES: 3,
 CACHE_DURATION: 300000,
 DEBOUNCE_DELAY: 100,
 STORAGE_KEY: 'youtube_channel_stats_settings',
 };
 const state = {
 overlay: null,
 isUpdating: false,
 intervalId: null,
 currentChannelName: null,
 enabled: localStorage.getItem(CONFIG.STORAGE_KEY) !== 'false',
 updateInterval:
 parseInt(localStorage.getItem('youtubeEnhancerInterval'), 10) ||
 CONFIG.DEFAULT_UPDATE_INTERVAL,
 overlayOpacity:
 parseFloat(localStorage.getItem('youtubeEnhancerOpacity')) || CONFIG.DEFAULT_OVERLAY_OPACITY,
 lastSuccessfulStats: new Map(),
 previousStats: new Map(),
 previousUrl: location.href,
 isChecking: false,
 documentListenerKeys: new Set(),
 };
 const utils = {
 log: (message, ...args) => {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug('[YouTube+][Stats]', message, ...args);
 },
 warn: (message, ...args) => {
 console.warn('[YouTube+][Stats]', message, ...args);
 },
 error: (message, ...args) => {
 console.error('[YouTube+][Stats]', message, ...args);
 },
 debounce:
 window.YouTubeUtils?.debounce ||
 ((func, wait) => {
 let timeout;
 return function executedFunction(...args) {
 const later = () => {
 clearTimeout(timeout);
 func(...args);
 };
 clearTimeout(timeout);
 timeout = setTimeout(later, wait);
 };
 }),
 };
 const { OPTIONS } = CONFIG;
 const { FONT_LINK } = CONFIG;
 const { STATS_API_URL } = CONFIG;
 async function fetchChannel(url) {
 if (state.isChecking) return null;
 state.isChecking = true;
 try {
 const response = await fetch(url, {
 credentials: 'same-origin',
 });
 if (!response.ok) return null;
 const html = await response.text();
 const match = html.match(/var ytInitialData = (.+?);<\/script>/);
 return match && match[1] ? JSON.parse(match[1]) : null;
 } catch (error) {
 utils.warn('Failed to fetch channel data:', error);
 return null;
 } finally {
 state.isChecking = false;
 }
 }
 async function getChannelInfo(url) {
 const data = await fetchChannel(url);
 if (!data) return null;
 try {
 const channelName = data?.metadata?.channelMetadataRenderer?.title || t('unknown');
 const channelId = data?.metadata?.channelMetadataRenderer?.externalId || null;
 return { channelName, channelId };
 } catch {
 return null;
 }
 }
 function isChannelPageUrl(url) {
 return (
 url.includes('youtube.com/') &&
 (url.includes('/channel/') || url.includes('/@')) &&
 !url.includes('/video/') &&
 !url.includes('/watch')
 );
 }
 function checkUrlChange() {
 const currentUrl = location.href;
 if (currentUrl !== state.previousUrl) {
 state.previousUrl = currentUrl;
 if (isChannelPageUrl(currentUrl)) {
 setTimeout(() => getChannelInfo(currentUrl), 500);
 }
 }
 }
 history.pushState = (function (f) {
 return function (...args) {
 f.call(this, ...args);
 checkUrlChange();
 };
 })(history.pushState);
 history.replaceState = (function (f) {
 return function (...args) {
 f.call(this, ...args);
 checkUrlChange();
 };
 })(history.replaceState);
 window.addEventListener('popstate', checkUrlChange);
 setInterval(checkUrlChange, 1000);
 function init() {
 try {
 utils.log('Initializing YouTube Enhancer v1.6');
 loadFonts();
 initializeLocalStorage();
 addStyles();
 if (state.enabled) {
 observePageChanges();
 addNavigationListener();
 if (isChannelPageUrl(location.href)) {
 getChannelInfo(location.href);
 }
 }
 utils.log('YouTube Enhancer initialized successfully');
 } catch (error) {
 utils.error('Failed to initialize YouTube Enhancer:', error);
 }
 }
 function loadFonts() {
 const fontLink = document.createElement('link');
 fontLink.rel = 'stylesheet';
 fontLink.href = FONT_LINK;
 (document.head || document.documentElement).appendChild(fontLink);
 }
 function initializeLocalStorage() {
 OPTIONS.forEach(option => {
 if (localStorage.getItem(`show-${option}`) === null) {
 localStorage.setItem(`show-${option}`, 'true');
 }
 });
 }
 function addStyles() {
 const styles = `
 .channel-banner-overlay{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;z-index:10;display:flex;justify-content:space-around;align-items:center;color:#fff;font-family:var(--stats-font-family,'Rubik',sans-serif);font-size:var(--stats-font-size,24px);box-sizing:border-box;transition:background-color .3s ease;backdrop-filter:blur(2px)}
 .settings-button{position:absolute;top:8px;right:8px;width:24px;height:24px;cursor:pointer;z-index:2;transition:transform .2s;opacity:.7}
 .settings-button:hover{transform:scale(1.1);opacity:1}
 .settings-menu{position:absolute;top:35px;right:8px;background:rgba(0,0,0,.95);padding:12px;border-radius:8px;z-index:10;display:none;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);min-width:320px}
 .settings-menu.show{display:block}
 .stat-container{display:flex;flex-direction:column;align-items:center;justify-content:center;visibility:hidden;width:33%;height:100%;padding:0 1rem}
 .number-container{display:flex;align-items:center;justify-content:center;font-weight:700;min-height:3rem}
 .label-container{display:flex;align-items:center;margin-top:.5rem;font-size:1.2rem;opacity:.9}
 .label-container svg{width:1.5rem;height:1.5rem;margin-right:.5rem}
 .difference{font-size:1.8rem;height:2rem;margin-bottom:.5rem;transition:opacity .3s}
 .spinner-container{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center}
 .loading-spinner{animation:spin 1s linear infinite}
 @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
 @media(max-width:768px){.channel-banner-overlay{flex-direction:column;padding:8px;min-height:160px}.settings-menu{width:280px;right:4px}}
 .setting-group{margin-bottom:12px}
 .setting-group:last-child{margin-bottom:0}
 .setting-group label{display:block;margin-bottom:4px;font-weight:600;color:#fff;font-size:14px}
 .setting-group input[type="range"]{width:100%;margin:4px 0}
 .setting-group input[type="checkbox"]{margin-right:8px}
 .setting-value{color:#aaa;font-size:12px;margin-top:2px}
 `;
 YouTubeUtils.StyleManager.add('channel-stats-overlay', styles);
 }
 function createSettingsButton() {
 const button = document.createElement('div');
 button.className = 'settings-button';
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
 svg.setAttribute('viewBox', '0 0 512 512');
 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 path.setAttribute('fill', 'white');
 path.setAttribute(
 'd',
 'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z'
 );
 svg.appendChild(path);
 button.appendChild(svg);
 return button;
 }
 function createSettingsMenu() {
 const menu = document.createElement('div');
 menu.className = 'settings-menu';
 menu.style.gap = '15px';
 menu.style.width = '360px';
 menu.setAttribute('tabindex', '-1');
 menu.setAttribute('aria-modal', 'true');
 const displaySection = createDisplaySection();
 const controlsSection = createControlsSection();
 menu.appendChild(displaySection);
 menu.appendChild(controlsSection);
 return menu;
 }
 function createDisplaySection() {
 const displaySection = document.createElement('div');
 displaySection.style.flex = '1';
 const displayLabel = document.createElement('label');
 displayLabel.textContent = t('displayOptions');
 displayLabel.style.marginBottom = '10px';
 displayLabel.style.display = 'block';
 displayLabel.style.fontSize = '16px';
 displayLabel.style.fontWeight = 'bold';
 displaySection.appendChild(displayLabel);
 OPTIONS.forEach(option => {
 const checkboxContainer = document.createElement('div');
 checkboxContainer.style.display = 'flex';
 checkboxContainer.style.alignItems = 'center';
 checkboxContainer.style.marginTop = '5px';
 const checkbox = document.createElement('input');
 checkbox.type = 'checkbox';
 checkbox.id = `show-${option}`;
 checkbox.checked = localStorage.getItem(`show-${option}`) !== 'false';
 checkbox.className = 'ytp-plus-settings-checkbox';
 const checkboxLabel = document.createElement('label');
 checkboxLabel.htmlFor = `show-${option}`;
 checkboxLabel.textContent = t(option);
 checkboxLabel.style.cursor = 'pointer';
 checkboxLabel.style.color = 'white';
 checkboxLabel.style.fontSize = '14px';
 checkboxLabel.style.marginLeft = '8px';
 checkbox.addEventListener('change', () => {
 localStorage.setItem(`show-${option}`, String(checkbox.checked));
 updateDisplayState();
 });
 checkboxContainer.appendChild(checkbox);
 checkboxContainer.appendChild(checkboxLabel);
 displaySection.appendChild(checkboxContainer);
 });
 return displaySection;
 }
 function createControlsSection() {
 const controlsSection = document.createElement('div');
 controlsSection.style.flex = '1';
 const fontLabel = document.createElement('label');
 fontLabel.textContent = t('fontFamily');
 fontLabel.style.display = 'block';
 fontLabel.style.marginBottom = '5px';
 fontLabel.style.fontSize = '16px';
 fontLabel.style.fontWeight = 'bold';
 const fontSelect = document.createElement('select');
 fontSelect.className = 'font-family-select';
 fontSelect.style.width = '100%';
 fontSelect.style.marginBottom = '10px';
 const fonts = [
 { name: 'Rubik', value: 'Rubik, sans-serif' },
 { name: 'Impact', value: 'Impact, Charcoal, sans-serif' },
 { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
 { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
 ];
 const savedFont = localStorage.getItem('youtubeEnhancerFontFamily') || 'Rubik, sans-serif';
 fonts.forEach(f => {
 const opt = document.createElement('option');
 opt.value = f.value;
 opt.textContent = f.name;
 if (f.value === savedFont) opt.selected = true;
 fontSelect.appendChild(opt);
 });
 fontSelect.addEventListener('change', e => {
 const { target } = e;
 const select = (target);
 localStorage.setItem('youtubeEnhancerFontFamily', select.value);
 if (state.overlay) {
 state.overlay
 .querySelectorAll('.subscribers-number,.views-number,.videos-number')
 .forEach(el => {
 el.style.fontFamily = select.value;
 });
 }
 });
 const fontSizeLabel = document.createElement('label');
 fontSizeLabel.textContent = t('fontSize');
 fontSizeLabel.style.display = 'block';
 fontSizeLabel.style.marginBottom = '5px';
 fontSizeLabel.style.fontSize = '16px';
 fontSizeLabel.style.fontWeight = 'bold';
 const fontSizeSlider = document.createElement('input');
 fontSizeSlider.type = 'range';
 fontSizeSlider.min = '16';
 fontSizeSlider.max = '72';
 fontSizeSlider.value = localStorage.getItem('youtubeEnhancerFontSize') || '24';
 fontSizeSlider.step = '1';
 fontSizeSlider.className = 'font-size-slider';
 const fontSizeValue = document.createElement('div');
 fontSizeValue.className = 'font-size-value';
 fontSizeValue.textContent = `${fontSizeSlider.value}px`;
 fontSizeValue.style.fontSize = '14px';
 fontSizeValue.style.marginBottom = '15px';
 fontSizeSlider.addEventListener('input', e => {
 const { target } = e;
 const input = (target);
 fontSizeValue.textContent = `${input.value}px`;
 localStorage.setItem('youtubeEnhancerFontSize', input.value);
 if (state.overlay) {
 state.overlay
 .querySelectorAll('.subscribers-number,.views-number,.videos-number')
 .forEach(el => {
 el.style.fontSize = `${input.value}px`;
 });
 }
 });
 const intervalLabel = document.createElement('label');
 intervalLabel.textContent = t('updateInterval');
 intervalLabel.style.display = 'block';
 intervalLabel.style.marginBottom = '5px';
 intervalLabel.style.fontSize = '16px';
 intervalLabel.style.fontWeight = 'bold';
 const intervalSlider = document.createElement('input');
 intervalSlider.type = 'range';
 intervalSlider.min = '2';
 intervalSlider.max = '10';
 intervalSlider.value = String(state.updateInterval / 1000);
 intervalSlider.step = '1';
 intervalSlider.className = 'interval-slider';
 const intervalValue = document.createElement('div');
 intervalValue.className = 'interval-value';
 intervalValue.textContent = `${intervalSlider.value}s`;
 intervalValue.style.marginBottom = '15px';
 intervalValue.style.fontSize = '14px';
 intervalSlider.addEventListener('input', e => {
 const { target } = e;
 const input = (target);
 const newInterval = parseInt(input.value, 10) * 1000;
 intervalValue.textContent = `${input.value}s`;
 state.updateInterval = newInterval;
 localStorage.setItem('youtubeEnhancerInterval', String(newInterval));
 if (state.intervalId) {
 clearInterval(state.intervalId);
 state.intervalId = setInterval(() => {
 updateOverlayContent(state.overlay, state.currentChannelName);
 }, newInterval);
 YouTubeUtils.cleanupManager.registerInterval(state.intervalId);
 }
 });
 const opacityLabel = document.createElement('label');
 opacityLabel.textContent = t('backgroundOpacity');
 opacityLabel.style.display = 'block';
 opacityLabel.style.marginBottom = '5px';
 opacityLabel.style.fontSize = '16px';
 opacityLabel.style.fontWeight = 'bold';
 const opacitySlider = document.createElement('input');
 opacitySlider.type = 'range';
 opacitySlider.min = '50';
 opacitySlider.max = '90';
 opacitySlider.value = String(state.overlayOpacity * 100);
 opacitySlider.step = '5';
 opacitySlider.className = 'opacity-slider';
 const opacityValue = document.createElement('div');
 opacityValue.className = 'opacity-value';
 opacityValue.textContent = `${opacitySlider.value}%`;
 opacityValue.style.fontSize = '14px';
 opacitySlider.addEventListener('input', e => {
 const { target } = e;
 const input = (target);
 const newOpacity = parseInt(input.value, 10) / 100;
 opacityValue.textContent = `${input.value}%`;
 state.overlayOpacity = newOpacity;
 localStorage.setItem('youtubeEnhancerOpacity', String(newOpacity));
 if (state.overlay) {
 state.overlay.style.backgroundColor = `rgba(0, 0, 0, ${newOpacity})`;
 }
 });
 controlsSection.appendChild(fontLabel);
 controlsSection.appendChild(fontSelect);
 controlsSection.appendChild(fontSizeLabel);
 controlsSection.appendChild(fontSizeSlider);
 controlsSection.appendChild(fontSizeValue);
 controlsSection.appendChild(intervalLabel);
 controlsSection.appendChild(intervalSlider);
 controlsSection.appendChild(intervalValue);
 controlsSection.appendChild(opacityLabel);
 controlsSection.appendChild(opacitySlider);
 controlsSection.appendChild(opacityValue);
 return controlsSection;
 }
 function createSpinner() {
 const spinnerContainer = document.createElement('div');
 spinnerContainer.style.position = 'absolute';
 spinnerContainer.style.top = '0';
 spinnerContainer.style.left = '0';
 spinnerContainer.style.width = '100%';
 spinnerContainer.style.height = '100%';
 spinnerContainer.style.display = 'flex';
 spinnerContainer.style.justifyContent = 'center';
 spinnerContainer.style.alignItems = 'center';
 spinnerContainer.classList.add('spinner-container');
 const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 spinner.setAttribute('viewBox', '0 0 512 512');
 spinner.setAttribute('width', '64');
 spinner.setAttribute('height', '64');
 spinner.classList.add('loading-spinner');
 spinner.style.animation = 'spin 1s linear infinite';
 const secondaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 secondaryPath.setAttribute(
 'd',
 'M0 256C0 114.9 114.1 .5 255.1 0C237.9 .5 224 14.6 224 32c0 17.7 14.3 32 32 32C150 64 64 150 64 256s86 192 192 192c69.7 0 130.7-37.1 164.5-92.6c-3 6.6-3.3 14.8-1 22.2c1.2 3.7 3 7.2 5.4 10.3c1.2 1.5 2.6 3 4.1 4.3c.8 .7 1.6 1.3 2.4 1.9c.4 .3 .8 .6 1.3 .9s.9 .6 1.3 .8c5 2.9 10.6 4.3 16 4.3c11 0 21.8-5.7 27.7-16c-44.3 76.5-127 128-221.7 128C114.6 512 0 397.4 0 256z'
 );
 secondaryPath.style.opacity = '0.4';
 secondaryPath.style.fill = 'white';
 const primaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 primaryPath.setAttribute(
 'd',
 'M224 32c0-17.7 14.3-32 32-32C397.4 0 512 114.6 512 256c0 46.6-12.5 90.4-34.3 128c-8.8 15.3-28.4 20.5-43.7 11.7s-20.5-28.4-11.7-43.7c16.3-28.2 25.7-61 25.7-96c0-106-86-192-192-192c-17.7 0-32-14.3-32-32z'
 );
 primaryPath.style.fill = 'white';
 spinner.appendChild(secondaryPath);
 spinner.appendChild(primaryPath);
 spinnerContainer.appendChild(spinner);
 return spinnerContainer;
 }
 function createSVGIcon(path) {
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('viewBox', '0 0 640 512');
 svg.setAttribute('width', '2rem');
 svg.setAttribute('height', '2rem');
 svg.style.marginRight = '0.5rem';
 svg.style.display = 'none';
 const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 svgPath.setAttribute('d', path);
 svgPath.setAttribute('fill', 'white');
 svg.appendChild(svgPath);
 return svg;
 }
 function createStatContainer(className, iconPath) {
 const container = document.createElement('div');
 Object.assign(container.style, {
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 visibility: 'hidden',
 width: '33%',
 height: '100%',
 padding: '0 1rem',
 });
 const numberContainer = document.createElement('div');
 Object.assign(numberContainer.style, {
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 });
 const differenceElement = document.createElement('div');
 differenceElement.classList.add(`${className}-difference`);
 Object.assign(differenceElement.style, {
 fontSize: '2.5rem',
 height: '2.5rem',
 marginBottom: '1rem',
 });
 const digitContainer = createNumberContainer();
 digitContainer.classList.add(`${className}-number`);
 Object.assign(digitContainer.style, {
 fontSize: `${localStorage.getItem('youtubeEnhancerFontSize') || '24'}px`,
 fontWeight: 'bold',
 lineHeight: '1',
 height: '4rem',
 fontFamily: localStorage.getItem('youtubeEnhancerFontFamily') || 'Rubik, sans-serif',
 letterSpacing: '0.025em',
 });
 numberContainer.appendChild(differenceElement);
 numberContainer.appendChild(digitContainer);
 const labelContainer = document.createElement('div');
 Object.assign(labelContainer.style, {
 display: 'flex',
 alignItems: 'center',
 marginTop: '0.5rem',
 });
 const icon = createSVGIcon(iconPath);
 Object.assign(icon.style, {
 width: '2rem',
 height: '2rem',
 marginRight: '0.75rem',
 });
 const labelElement = document.createElement('div');
 labelElement.classList.add(`${className}-label`);
 labelElement.style.fontSize = '2rem';
 labelContainer.appendChild(icon);
 labelContainer.appendChild(labelElement);
 container.appendChild(numberContainer);
 container.appendChild(labelContainer);
 return container;
 }
 function createOverlayElement() {
 const overlay = document.createElement('div');
 overlay.classList.add('channel-banner-overlay');
 Object.assign(overlay.style, {
 position: 'absolute',
 top: '0',
 left: '0',
 width: '100%',
 height: '100%',
 backgroundColor: `rgba(0, 0, 0, ${state.overlayOpacity})`,
 borderRadius: '15px',
 zIndex: '10',
 display: 'flex',
 justifyContent: 'space-around',
 alignItems: 'center',
 color: 'white',
 fontFamily: localStorage.getItem('youtubeEnhancerFontFamily') || 'Rubik, sans-serif',
 fontSize: `${localStorage.getItem('youtubeEnhancerFontSize') || '24'}px`,
 boxSizing: 'border-box',
 transition: 'background-color 0.3s ease',
 });
 return overlay;
 }
 function applyOverlayAccessibility(overlay) {
 overlay.setAttribute('role', 'region');
 overlay.setAttribute('aria-label', t('overlayAriaLabel'));
 overlay.setAttribute('tabindex', '-1');
 }
 function applyMobileResponsiveness(overlay) {
 if (window.innerWidth <= 768) {
 overlay.style.flexDirection = 'column';
 overlay.style.padding = '10px';
 overlay.style.minHeight = '200px';
 }
 }
 function setupSettingsButton() {
 const button = createSettingsButton();
 button.setAttribute('tabindex', '0');
 button.setAttribute('aria-label', t('settingsAriaLabel'));
 button.setAttribute('role', 'button');
 return button;
 }
 function setupSettingsMenu() {
 const menu = createSettingsMenu();
 menu.setAttribute('aria-label', t('settingsMenuAriaLabel'));
 menu.setAttribute('role', 'dialog');
 return menu;
 }
 function attachMenuEventHandlers(settingsButton, settingsMenu) {
 const toggleMenu = show => {
 settingsMenu.classList.toggle('show', show);
 settingsButton.setAttribute('aria-expanded', show);
 if (show) settingsMenu.focus();
 };
 settingsButton.addEventListener('click', e => {
 e.stopPropagation();
 toggleMenu(!settingsMenu.classList.contains('show'));
 });
 settingsButton.addEventListener('keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 toggleMenu(!settingsMenu.classList.contains('show'));
 }
 });
 const clickHandler = e => {
 const node = (e.target);
 if (!settingsMenu.contains(node) && !settingsButton.contains(node)) {
 toggleMenu(false);
 }
 };
 const keyHandler = e => {
 if (e.key === 'Escape' && settingsMenu.classList.contains('show')) {
 toggleMenu(false);
 settingsButton.focus();
 }
 };
 const clickKey = YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler);
 const keyKey = YouTubeUtils.cleanupManager.registerListener(document, 'keydown', keyHandler);
 state.documentListenerKeys.add(clickKey);
 state.documentListenerKeys.add(keyKey);
 }
 function addStatContainers(overlay) {
 const subscribersElement = createStatContainer(
 'subscribers',
 'M144 160c-44.2 0-80-35.8-80-80S99.8 0 144 0s80 35.8 80 80s-35.8 80-80 80zm368 0c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM416 224c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z'
 );
 const viewsElement = createStatContainer(
 'views',
 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'
 );
 const videosElement = createStatContainer(
 'videos',
 'M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z'
 );
 overlay.appendChild(subscribersElement);
 overlay.appendChild(viewsElement);
 overlay.appendChild(videosElement);
 }
 function createOverlay(bannerElement) {
 clearExistingOverlay();
 if (!bannerElement) return null;
 const overlay = createOverlayElement();
 applyOverlayAccessibility(overlay);
 applyMobileResponsiveness(overlay);
 const settingsButton = setupSettingsButton();
 const settingsMenu = setupSettingsMenu();
 overlay.appendChild(settingsButton);
 overlay.appendChild(settingsMenu);
 attachMenuEventHandlers(settingsButton, settingsMenu);
 const spinner = createSpinner();
 overlay.appendChild(spinner);
 addStatContainers(overlay);
 bannerElement.appendChild(overlay);
 updateDisplayState();
 return overlay;
 }
 function fetchWithGM(url, headers = {}) {
 const requestHeaders = {
 Accept: 'application/json',
 ...headers,
 };
 const gm = (window).GM_xmlhttpRequest;
 if (typeof gm === 'function') {
 return new Promise((resolve, reject) => {
 gm({
 method: 'GET',
 url,
 headers: requestHeaders,
 timeout: 10000,
 onload: response => {
 if (response.status >= 200 && response.status < 300) {
 try {
 resolve(JSON.parse(response.responseText));
 } catch (parseError) {
 reject(new Error(`Failed to parse response: ${parseError.message}`));
 }
 } else {
 reject(new Error(`Failed to fetch: ${response.status}`));
 }
 },
 onerror: error => reject(error),
 ontimeout: () => reject(new Error('Request timed out')),
 });
 });
 }
 utils.warn('GM_xmlhttpRequest unavailable, falling back to fetch API');
 return fetch(url, {
 method: 'GET',
 headers: requestHeaders,
 credentials: 'omit',
 mode: 'cors',
 })
 .then(response => {
 if (!response.ok) {
 throw new Error(`Failed to fetch: ${response.status}`);
 }
 return response.json();
 })
 .catch(error => {
 utils.error('Fallback fetch failed:', error);
 throw error;
 });
 }
 async function fetchChannelId(_channelName) {
 const metaTag = document.querySelector('meta[itemprop="channelId"]');
 if (metaTag && metaTag.content) return metaTag.content;
 const urlMatch = window.location.href.match(/channel\/(UC[\w-]+)/);
 if (urlMatch && urlMatch[1]) return urlMatch[1];
 const channelInfo = await getChannelInfo(window.location.href);
 if (channelInfo && channelInfo.channelId) return channelInfo.channelId;
 throw new Error('Could not determine channel ID');
 }
 async function fetchChannelStats(channelId) {
 const helpers =
 typeof window !== 'undefined' && window.YouTubePlusChannelStatsHelpers
 ? window.YouTubePlusChannelStatsHelpers
 : null;
 if (!helpers) {
 utils.error('Channel stats helpers not loaded');
 return {
 followerCount: 0,
 bottomOdos: [0, 0],
 error: true,
 timestamp: Date.now(),
 };
 }
 try {
 const fetchFn = () =>
 fetchWithGM(`${STATS_API_URL}${channelId}`, {
 origin: 'https://livecounts.io',
 referer: 'https://livecounts.io/',
 });
 const stats = await helpers.fetchWithRetry(fetchFn, CONFIG.MAX_RETRIES, utils);
 if (stats) {
 helpers.cacheStats(state.lastSuccessfulStats, channelId, stats);
 return stats;
 }
 const cachedStats = helpers.getCachedStats(
 state.lastSuccessfulStats,
 channelId,
 CONFIG.CACHE_DURATION,
 utils
 );
 if (cachedStats) {
 return cachedStats;
 }
 const fallbackCount = helpers.extractSubscriberCountFromPage();
 if (fallbackCount > 0) {
 utils.log('Extracted fallback subscriber count:', fallbackCount);
 }
 return helpers.createFallbackStats(fallbackCount);
 } catch (error) {
 utils.error('Failed to fetch channel stats:', error);
 return helpers.createFallbackStats(0);
 }
 }
 function clearExistingOverlay() {
 const existingOverlay = document.querySelector('.channel-banner-overlay');
 if (existingOverlay) {
 try {
 existingOverlay.remove();
 } catch {
 console.warn('[YouTube+] Failed to remove overlay');
 }
 }
 if (state.intervalId) {
 try {
 clearInterval(state.intervalId);
 YouTubeUtils.cleanupManager.unregisterInterval(state.intervalId);
 } catch {
 console.warn('[YouTube+] Failed to clear interval');
 }
 state.intervalId = null;
 }
 if (state.documentListenerKeys && state.documentListenerKeys.size) {
 state.documentListenerKeys.forEach(key => {
 try {
 YouTubeUtils.cleanupManager.unregisterListener(key);
 } catch {
 console.warn('[YouTube+] Failed to unregister listener');
 }
 });
 state.documentListenerKeys.clear();
 }
 if (state.lastSuccessfulStats) state.lastSuccessfulStats.clear();
 if (state.previousStats) state.previousStats.clear();
 state.isUpdating = false;
 state.overlay = null;
 utils.log('Cleared existing overlay');
 }
 function createDigitElement() {
 const digit = document.createElement('span');
 Object.assign(digit.style, {
 display: 'inline-block',
 width: '0.6em',
 textAlign: 'center',
 marginRight: '0.025em',
 marginLeft: '0.025em',
 });
 return digit;
 }
 function createCommaElement() {
 const comma = document.createElement('span');
 comma.textContent = ',';
 Object.assign(comma.style, {
 display: 'inline-block',
 width: '0.3em',
 textAlign: 'center',
 });
 return comma;
 }
 function createNumberContainer() {
 const container = document.createElement('div');
 Object.assign(container.style, {
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 letterSpacing: '0.025em',
 });
 return container;
 }
 function splitIntoDigitGroups(valueStr) {
 const digits = [];
 for (let i = valueStr.length - 1; i >= 0; i -= 3) {
 const start = Math.max(0, i - 2);
 digits.unshift(valueStr.slice(start, i + 1));
 }
 return digits;
 }
 function clearContainer(container) {
 while (container.firstChild) {
 container.removeChild(container.firstChild);
 }
 }
 function renderDigitGroups(container, digitGroups) {
 for (let i = 0; i < digitGroups.length; i++) {
 const group = digitGroups[i];
 for (let j = 0; j < group.length; j++) {
 const digitElement = createDigitElement();
 digitElement.textContent = group[j];
 container.appendChild(digitElement);
 }
 if (i < digitGroups.length - 1) {
 container.appendChild(createCommaElement());
 }
 }
 }
 function animateDigitChanges(container, digitGroups) {
 let elementIndex = 0;
 for (let i = 0; i < digitGroups.length; i++) {
 const group = digitGroups[i];
 for (let j = 0; j < group.length; j++) {
 const digitElement = container.children[elementIndex];
 const newDigit = parseInt(group[j], 10);
 const currentDigit = parseInt(digitElement.textContent || '0', 10);
 if (currentDigit !== newDigit) {
 animateDigit(digitElement, currentDigit, newDigit);
 }
 elementIndex++;
 }
 if (i < digitGroups.length - 1) {
 elementIndex++;
 }
 }
 }
 function updateDigits(container, newValue) {
 const newValueStr = newValue.toString();
 const digitGroups = splitIntoDigitGroups(newValueStr);
 clearContainer(container);
 renderDigitGroups(container, digitGroups);
 animateDigitChanges(container, digitGroups);
 }
 function animateDigit(element, start, end) {
 const duration = 1000;
 const startTime = performance.now();
 function update(currentTime) {
 const elapsed = currentTime - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const easeOutQuart = 1 - Math.pow(1 - progress, 4);
 const current = Math.round(start + (end - start) * easeOutQuart);
 element.textContent = current;
 if (progress < 1) {
 requestAnimationFrame(update);
 }
 }
 requestAnimationFrame(update);
 }
 function showContent(overlay) {
 const spinnerContainer = overlay.querySelector('.spinner-container');
 if (spinnerContainer) {
 spinnerContainer.remove();
 }
 const containers = overlay.querySelectorAll('div[style*="visibility: hidden"]');
 containers.forEach(container => {
 container.style.visibility = 'visible';
 });
 const icons = overlay.querySelectorAll('svg[style*="display: none"]');
 icons.forEach(icon => {
 icon.style.display = 'block';
 });
 }
 function updateDifferenceElement(element, currentValue, previousValue) {
 if (!previousValue) return;
 const difference = currentValue - previousValue;
 if (difference === 0) {
 element.textContent = '';
 return;
 }
 const sign = difference > 0 ? '+' : '';
 element.textContent = `${sign}${difference.toLocaleString()}`;
 element.style.color = difference > 0 ? '#1ed760' : '#f3727f';
 setTimeout(() => {
 element.textContent = '';
 }, 1000);
 }
 function updateDisplayState() {
 const overlay = document.querySelector('.channel-banner-overlay');
 if (!overlay) return;
 const statContainers = overlay.querySelectorAll('div[style*="width"]');
 if (!statContainers.length) return;
 let visibleCount = 0;
 const visibleContainers = [];
 statContainers.forEach(container => {
 const numberContainer = container.querySelector('[class$="-number"]');
 if (!numberContainer) return;
 const type = numberContainer.className.replace('-number', '');
 const isVisible = localStorage.getItem(`show-${type}`) !== 'false';
 if (isVisible) {
 container.style.display = 'flex';
 visibleCount++;
 visibleContainers.push(container);
 } else {
 container.style.display = 'none';
 }
 });
 visibleContainers.forEach(container => {
 container.style.width = '';
 container.style.margin = '';
 switch (visibleCount) {
 case 1:
 container.style.width = '100%';
 break;
 case 2:
 container.style.width = '50%';
 break;
 case 3:
 container.style.width = '33.33%';
 break;
 default:
 container.style.display = 'none';
 }
 });
 const fontSize = localStorage.getItem('youtubeEnhancerFontSize') || '24';
 const fontFamily = localStorage.getItem('youtubeEnhancerFontFamily') || 'Rubik, sans-serif';
 overlay.querySelectorAll('.subscribers-number,.views-number,.videos-number').forEach(el => {
 el.style.fontSize = `${fontSize}px`;
 el.style.fontFamily = fontFamily;
 });
 overlay.style.display = 'flex';
 }
 function shouldUpdateOverlay(channelName) {
 return !state.isUpdating && channelName === state.currentChannelName;
 }
 function handleStatsError(overlay, stats) {
 const containers = overlay.querySelectorAll('[class$="-number"]');
 containers.forEach(container => {
 if (container.classList.contains('subscribers-number') && stats.followerCount > 0) {
 updateDigits(container, stats.followerCount);
 } else {
 container.textContent = '---';
 }
 });
 utils.warn('Using fallback stats due to API error');
 }
 function getPreviousStatValue(channelId, className) {
 const prevStats = state.previousStats.get(channelId);
 if (!prevStats) return null;
 if (className === 'subscribers') {
 return prevStats.followerCount;
 }
 const index = className === 'views' ? 0 : 1;
 return prevStats.bottomOdos[index];
 }
 function updateStatElement(overlay, channelId, className, value, label) {
 const numberContainer = overlay.querySelector(`.${className}-number`);
 const differenceElement = overlay.querySelector(`.${className}-difference`);
 const labelElement = overlay.querySelector(`.${className}-label`);
 if (numberContainer) {
 updateDigits(numberContainer, value);
 }
 if (differenceElement && state.previousStats.has(channelId)) {
 const previousValue = getPreviousStatValue(channelId, className);
 if (previousValue !== null) {
 updateDifferenceElement(differenceElement, value, previousValue);
 }
 }
 if (labelElement) {
 labelElement.textContent = label;
 }
 }
 function updateAllStatElements(overlay, channelId, stats) {
 updateStatElement(overlay, channelId, 'subscribers', stats.followerCount, 'Subscribers');
 updateStatElement(overlay, channelId, 'views', stats.bottomOdos[0], 'Views');
 updateStatElement(overlay, channelId, 'videos', stats.bottomOdos[1], 'Videos');
 }
 function showOverlayError(overlay) {
 const containers = overlay.querySelectorAll('[class$="-number"]');
 containers.forEach(container => {
 container.textContent = '---';
 });
 }
 async function updateOverlayContent(overlay, channelName) {
 if (!shouldUpdateOverlay(channelName)) return;
 state.isUpdating = true;
 try {
 const channelId = await fetchChannelId(channelName);
 const stats = await fetchChannelStats(channelId);
 if (channelName !== state.currentChannelName) {
 return;
 }
 if (stats.error) {
 handleStatsError(overlay, stats);
 return;
 }
 updateAllStatElements(overlay, channelId, stats);
 if (!state.previousStats.has(channelId)) {
 showContent(overlay);
 utils.log('Displayed initial stats for channel:', channelName);
 }
 state.previousStats.set(channelId, stats);
 } catch (error) {
 utils.error('Failed to update overlay content:', error);
 showOverlayError(overlay);
 } finally {
 state.isUpdating = false;
 }
 }
 function addSettingsUI() {
 const section = document.querySelector(
 '.ytp-plus-settings-section[data-section="experimental"]'
 );
 if (!section || section.querySelector('.count-settings-item')) return;
 const item = document.createElement('div');
 item.className = 'ytp-plus-settings-item count-settings-item';
 item.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('channelStatsTitle')}</label>
 <div class="ytp-plus-settings-item-description">${t('channelStatsDescription')}</div>
 </div>
 <input type="checkbox" class="ytp-plus-settings-checkbox" ${state.enabled ? 'checked' : ''}>
 `;
 section.appendChild(item);
 item.querySelector('input').addEventListener('change', e => {
 const { target } = e;
 const input = (target);
 state.enabled = input.checked;
 localStorage.setItem(CONFIG.STORAGE_KEY, state.enabled ? 'true' : 'false');
 if (state.enabled) {
 observePageChanges();
 addNavigationListener();
 setTimeout(() => {
 const bannerElement = document.getElementById('page-header-banner-sizer');
 if (bannerElement && isChannelPage()) {
 addOverlay(bannerElement);
 }
 }, 100);
 } else {
 clearExistingOverlay();
 }
 });
 }
 const settingsObserver = new MutationObserver(mutations => {
 for (const { addedNodes } of mutations) {
 for (const node of addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addSettingsUI, 100);
 return;
 }
 }
 }
 if (document.querySelector('.ytp-plus-settings-nav-item[data-section="experimental"].active')) {
 setTimeout(addSettingsUI, 50);
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(settingsObserver);
 if (document.body) {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 });
 }
 const experimentalNavClickHandler = e => {
 const { target } = e;
 const el = (target);
 if (
 el.classList?.contains('ytp-plus-settings-nav-item') &&
 el.dataset?.section === 'experimental'
 ) {
 setTimeout(addSettingsUI, 50);
 }
 };
 const listenerKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'click',
 experimentalNavClickHandler,
 true
 );
 state.documentListenerKeys.add(listenerKey);
 function extractChannelName(pathname) {
 if (pathname.startsWith('/@')) {
 return pathname.split('/')[1].replace('@', '');
 }
 if (pathname.startsWith('/channel/')) {
 return pathname.split('/')[2];
 }
 if (pathname.startsWith('/c/')) {
 return pathname.split('/')[2];
 }
 if (pathname.startsWith('/user/')) {
 return pathname.split('/')[2];
 }
 return null;
 }
 function shouldSkipOverlay(channelName) {
 return !channelName || (channelName === state.currentChannelName && state.overlay);
 }
 function ensureBannerPosition(bannerElement) {
 if (bannerElement && !bannerElement.style.position) {
 bannerElement.style.position = 'relative';
 }
 }
 function clearUpdateInterval() {
 if (state.intervalId) {
 clearInterval(state.intervalId);
 state.intervalId = null;
 }
 }
 function createDebouncedUpdate(overlay, channelName) {
 let lastUpdateTime = 0;
 return () => {
 const now = Date.now();
 if (now - lastUpdateTime >= state.updateInterval - 100) {
 updateOverlayContent(overlay, channelName);
 lastUpdateTime = now;
 }
 };
 }
 function setupUpdateInterval(overlay, channelName) {
 const debouncedUpdate = createDebouncedUpdate(overlay, channelName);
 state.intervalId = setInterval(debouncedUpdate, state.updateInterval);
 YouTubeUtils.cleanupManager.registerInterval(state.intervalId);
 }
 function addOverlay(bannerElement) {
 const channelName = extractChannelName(window.location.pathname);
 if (shouldSkipOverlay(channelName)) {
 return;
 }
 ensureBannerPosition(bannerElement);
 state.currentChannelName = channelName;
 state.overlay = createOverlay(bannerElement);
 if (state.overlay) {
 clearUpdateInterval();
 setupUpdateInterval(state.overlay, channelName);
 updateOverlayContent(state.overlay, channelName);
 utils.log('Added overlay for channel:', channelName);
 }
 }
 function isChannelPage() {
 return (
 window.location.pathname.startsWith('/@') ||
 window.location.pathname.startsWith('/channel/') ||
 window.location.pathname.startsWith('/c/')
 );
 }
 function findBannerElement() {
 let bannerElement = document.getElementById('page-header-banner-sizer');
 if (!bannerElement) {
 const alternatives = [
 '[id*="banner"]',
 '.ytd-c4-tabbed-header-renderer',
 '#channel-header',
 '.channel-header',
 ];
 for (const selector of alternatives) {
 bannerElement = document.querySelector(selector);
 if (bannerElement) break;
 }
 }
 return bannerElement;
 }
 function ensureBannerPositioning(bannerElement) {
 if (bannerElement.style.position !== 'relative') {
 bannerElement.style.position = 'relative';
 }
 }
 function handleBannerUpdate() {
 const bannerElement = findBannerElement();
 if (bannerElement && isChannelPage()) {
 ensureBannerPositioning(bannerElement);
 addOverlay(bannerElement);
 } else if (!isChannelPage()) {
 clearExistingOverlay();
 state.currentChannelName = null;
 }
 }
 function clearObserverTimeout(observer) {
 if ( (observer)._timeout) {
 YouTubeUtils.cleanupManager.unregisterTimeout( (observer)._timeout);
 clearTimeout( (observer)._timeout);
 }
 }
 function setupObserver(observer) {
 const observerConfig = {
 childList: true,
 subtree: true,
 attributes: false,
 };
 if (document.body) {
 observer.observe(document.body, observerConfig);
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, observerConfig);
 });
 }
 }
 function observePageChanges() {
 if (!state.enabled) return undefined;
 const observer = new MutationObserver(_mutations => {
 clearObserverTimeout(observer);
 (observer)._timeout = YouTubeUtils.cleanupManager.registerTimeout(
 setTimeout(handleBannerUpdate, 100)
 );
 });
 setupObserver(observer);
 (observer)._timeout = null;
 if (typeof state.observers === 'undefined') {
 state.observers = [];
 }
 state.observers.push(observer);
 return observer;
 }
 function addNavigationListener() {
 if (!state.enabled) return;
 window.addEventListener('yt-navigate-finish', () => {
 if (isChannelPage()) {
 const bannerElement = document.getElementById('page-header-banner-sizer');
 if (bannerElement) {
 addOverlay(bannerElement);
 utils.log('Navigated to channel page');
 }
 } else {
 clearExistingOverlay();
 state.currentChannelName = null;
 utils.log('Navigated away from channel page');
 }
 });
 }
 function cleanup() {
 if (state.observers && Array.isArray(state.observers)) {
 state.observers.forEach(observer => {
 try {
 observer.disconnect();
 } catch (e) {
 console.warn('[YouTube+] Failed to disconnect observer:', e);
 }
 });
 state.observers = [];
 }
 clearExistingOverlay();
 utils.log('Cleanup completed');
 }
 window.addEventListener('beforeunload', cleanup);
 if (typeof window !== 'undefined') {
 window.YouTubeStats = {
 init,
 cleanup,
 version: '2.3.1',
 };
 }
 init();
})();
(function () {
 'use strict';
 function t(key, params = {}) {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 }
 const CONFIG = {
 selectors: {
 deleteButtons: 'div[class^="VfPpkd-Bz112c-"]',
 menuButton: '[aria-haspopup="menu"]',
 },
 classes: {
 checkbox: 'comment-checkbox',
 checkboxAnchor: 'comment-checkbox-anchor',
 checkboxFloating: 'comment-checkbox-floating',
 container: 'comment-controls-container',
 panel: 'comment-controls-panel',
 header: 'comment-controls-header',
 title: 'comment-controls-title',
 actions: 'comment-controls-actions',
 button: 'comment-controls-button',
 buttonDanger: 'comment-controls-button--danger',
 buttonPrimary: 'comment-controls-button--primary',
 buttonSuccess: 'comment-controls-button--success',
 close: 'comment-controls-close',
 deleteButton: 'comment-controls-button-delete',
 },
 debounceDelay: 100,
 deleteDelay: 200,
 enabled: true,
 storageKey: 'youtube_comment_manager_settings',
 };
 const state = {
 observer: null,
 isProcessing: false,
 settingsNavListenerKey: null,
 panelCollapsed: false,
 };
 const settings = {
 load: () => {
 try {
 const saved = localStorage.getItem(CONFIG.storageKey);
 if (saved) CONFIG.enabled = JSON.parse(saved).enabled ?? true;
 } catch {}
 },
 save: () => {
 try {
 localStorage.setItem(CONFIG.storageKey, JSON.stringify({ enabled: CONFIG.enabled }));
 } catch {}
 },
 };
 const debounce = (func, wait) => {
 try {
 const utilDebounce = window.YouTubeUtils && window.YouTubeUtils.debounce;
 if (typeof utilDebounce === 'function') {
 const debounced = utilDebounce(func, wait);
 if (typeof debounced === 'function') return debounced;
 }
 return ((f, w) => {
 let timeout;
 return (...args) => {
 clearTimeout(timeout);
 timeout = setTimeout(() => f(...args), w);
 };
 })(func, wait);
 } catch {
 let timeout;
 return (...args) => {
 clearTimeout(timeout);
 timeout = setTimeout(() => func(...args), wait);
 };
 }
 };
 const $ = selector => (document.querySelector(selector));
 const $$ = selector =>
 (document.querySelectorAll(selector));
 const logError = (context, error) => {
 const errorObj = error instanceof Error ? error : new Error(String(error));
 if (window.YouTubeErrorBoundary) {
 window.YouTubeErrorBoundary.logError(errorObj, { context });
 } else {
 console.error(`[YouTube+][CommentManager] ${context}:`, error);
 }
 };
 const withErrorBoundary = (fn, context) => {
 if (window.YouTubeErrorBoundary?.withErrorBoundary) {
 return (window.YouTubeErrorBoundary.withErrorBoundary(fn, 'CommentManager'));
 }
 return (
 (...args) => {
 try {
 return fn(...args);
 } catch (error) {
 logError(context, error);
 return null;
 }
 }
 );
 };
 const addCheckboxes = withErrorBoundary(() => {
 if (!CONFIG.enabled || state.isProcessing) return;
 const deleteButtons = $$(CONFIG.selectors.deleteButtons);
 deleteButtons.forEach(button => {
 const parent = button.parentNode;
 if (
 button.closest(CONFIG.selectors.menuButton) ||
 (parent && parent.querySelector && parent.querySelector(`.${CONFIG.classes.checkbox}`))
 ) {
 return;
 }
 const commentElement =
 button.closest('[class*="comment"]') || button.closest('[role="article"]') || parent;
 if (commentElement && commentElement instanceof Element) {
 if (!commentElement.hasAttribute('data-comment-text')) {
 commentElement.setAttribute(
 'data-comment-text',
 (commentElement.textContent || '').toLowerCase()
 );
 }
 }
 const checkbox = document.createElement('input');
 checkbox.type = 'checkbox';
 checkbox.className = `${CONFIG.classes.checkbox} ytp-plus-settings-checkbox`;
 checkbox.setAttribute('aria-label', t('selectComment'));
 checkbox.addEventListener('change', updateDeleteButtonState);
 checkbox.addEventListener('click', e => e.stopPropagation());
 const dateElement =
 commentElement && commentElement.querySelector
 ? commentElement.querySelector(
 '[class*="date"],[class*="time"],time,[title*="20"],[aria-label*="ago"]'
 )
 : null;
 if (dateElement && dateElement instanceof Element) {
 dateElement.classList.add(CONFIG.classes.checkboxAnchor);
 checkbox.classList.add(CONFIG.classes.checkboxFloating);
 dateElement.appendChild(checkbox);
 } else if (parent && parent.insertBefore) {
 parent.insertBefore(checkbox, button);
 }
 });
 }, 'addCheckboxes');
 const addControlButtons = withErrorBoundary(() => {
 if (!CONFIG.enabled || $(`.${CONFIG.classes.container}`)) return;
 const deleteButtons = $$(CONFIG.selectors.deleteButtons);
 if (!deleteButtons.length) return;
 const first = deleteButtons[0];
 const container = first && first.parentNode && first.parentNode.parentNode;
 if (!container || !(container instanceof Element)) return;
 const panel = document.createElement('div');
 panel.className = `${CONFIG.classes.container} ${CONFIG.classes.panel} glass-panel`;
 panel.setAttribute('role', 'region');
 panel.setAttribute('aria-label', t('commentManagerControls'));
 const header = document.createElement('div');
 header.className = CONFIG.classes.header;
 const title = document.createElement('div');
 title.className = CONFIG.classes.title;
 title.textContent = t('commentManager');
 const collapseButton = document.createElement('button');
 collapseButton.className = `${CONFIG.classes.close} ytp-plus-settings-close`;
 collapseButton.setAttribute('type', 'button');
 collapseButton.setAttribute('aria-expanded', String(!state.panelCollapsed));
 collapseButton.setAttribute('aria-label', t('togglePanel'));
 collapseButton.innerHTML = `
 <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
 </svg>
 `;
 const togglePanelState = collapsed => {
 state.panelCollapsed = collapsed;
 header.classList.toggle('is-collapsed', collapsed);
 actions.classList.toggle('is-hidden', collapsed);
 collapseButton.setAttribute('aria-expanded', String(!collapsed));
 panel.classList.toggle('is-collapsed', collapsed);
 };
 collapseButton.addEventListener('click', () => {
 state.panelCollapsed = !state.panelCollapsed;
 togglePanelState(state.panelCollapsed);
 });
 header.append(title, collapseButton);
 const actions = document.createElement('div');
 actions.className = CONFIG.classes.actions;
 const createActionButton = (label, className, onClick, options = {}) => {
 const button = document.createElement('button');
 button.type = 'button';
 button.textContent = label;
 button.className = `${CONFIG.classes.button} ${className}`;
 if (options.id) button.id = options.id;
 if (options.disabled) button.disabled = true;
 button.addEventListener('click', onClick);
 return button;
 };
 const deleteAllButton = createActionButton(
 t('deleteSelected'),
 `${CONFIG.classes.buttonDanger} ${CONFIG.classes.deleteButton}`,
 deleteSelectedComments,
 { disabled: true }
 );
 const selectAllButton = createActionButton(t('selectAll'), CONFIG.classes.buttonPrimary, () => {
 $$(`.${CONFIG.classes.checkbox}`).forEach(cb => (cb.checked = true));
 updateDeleteButtonState();
 });
 const clearAllButton = createActionButton(t('clearAll'), CONFIG.classes.buttonSuccess, () => {
 $$(`.${CONFIG.classes.checkbox}`).forEach(cb => (cb.checked = false));
 updateDeleteButtonState();
 });
 actions.append(deleteAllButton, selectAllButton, clearAllButton);
 togglePanelState(state.panelCollapsed);
 panel.append(header, actions);
 const refNode = deleteButtons[0] && deleteButtons[0].parentNode;
 if (refNode && refNode.parentNode) {
 container.insertBefore(panel, refNode);
 } else {
 container.appendChild(panel);
 }
 }, 'addControlButtons');
 const updateDeleteButtonState = withErrorBoundary(() => {
 const deleteAllButton = $(`.${CONFIG.classes.deleteButton}`);
 if (!deleteAllButton) return;
 const hasChecked = Array.from($$(`.${CONFIG.classes.checkbox}`)).some(cb => cb.checked);
 deleteAllButton.disabled = !hasChecked;
 deleteAllButton.style.opacity = hasChecked ? '1' : '0.6';
 }, 'updateDeleteButtonState');
 const deleteSelectedComments = withErrorBoundary(() => {
 const checkedBoxes = Array.from($$(`.${CONFIG.classes.checkbox}`)).filter(cb => cb.checked);
 if (!checkedBoxes.length || !confirm(`Delete ${checkedBoxes.length} comment(s)?`)) return;
 state.isProcessing = true;
 checkedBoxes.forEach((checkbox, index) => {
 setTimeout(() => {
 const deleteButton =
 checkbox.nextElementSibling ||
 checkbox.parentNode.querySelector(CONFIG.selectors.deleteButtons);
 deleteButton?.click();
 }, index * CONFIG.deleteDelay);
 });
 setTimeout(() => (state.isProcessing = false), checkedBoxes.length * CONFIG.deleteDelay + 1000);
 }, 'deleteSelectedComments');
 const cleanup = withErrorBoundary(() => {
 $$(`.${CONFIG.classes.checkbox}`).forEach(el => el.remove());
 $(`.${CONFIG.classes.container}`)?.remove();
 }, 'cleanup');
 const initializeScript = withErrorBoundary(() => {
 if (CONFIG.enabled) {
 addCheckboxes();
 addControlButtons();
 updateDeleteButtonState();
 } else {
 cleanup();
 }
 }, 'initializeScript');
 const addStyles = withErrorBoundary(() => {
 if ($('#comment-delete-styles')) return;
 const styles = `
 .${CONFIG.classes.checkboxAnchor}{position:relative;display:inline-flex;align-items:center;gap:8px;width:auto;}
 .${CONFIG.classes.checkboxFloating}{position:absolute;top:-4px;right:-32px;margin:0;}
 .${CONFIG.classes.panel}{position:fixed;top:50%;right:24px;transform:translateY(-50%);display:flex;flex-direction:column;gap:14px;z-index:10000;padding:16px 18px;background:var(--yt-glass-bg);border:1.5px solid var(--yt-glass-border);border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,0.45);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);min-width:220px;max-width:300px;color:var(--yt-text-primary);transition:transform .22s cubic-bezier(.4,0,.2,1),opacity .22s,box-shadow .2s}
 html:not([dark]) .${CONFIG.classes.panel}{background:var(--yt-glass-bg);}
 .${CONFIG.classes.header}{display:flex;align-items:center;justify-content:space-between;gap:12px;}
 .${CONFIG.classes.panel}.is-collapsed{padding:14px 18px;}
 .${CONFIG.classes.panel}.is-collapsed .${CONFIG.classes.title}{font-weight:500;opacity:.85;}
 .${CONFIG.classes.panel}.is-collapsed .${CONFIG.classes.close}{transform:rotate(45deg);}
 .${CONFIG.classes.panel}.is-collapsed .${CONFIG.classes.actions}{display:none!important;}
 .${CONFIG.classes.title}{font-size:15px;font-weight:600;letter-spacing:.3px;}
 .${CONFIG.classes.close}{background:transparent;border:none;cursor:pointer;padding:6px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--yt-text-primary);transition:all .2s ease;}
 .${CONFIG.classes.close}:hover{transform:rotate(90deg) scale(1.05);color:var(--yt-accent);}
 .${CONFIG.classes.actions}{display:flex;flex-direction:column;gap:10px;}
 .${CONFIG.classes.actions}.is-hidden{display:none!important;}
 .${CONFIG.classes.button}{padding:12px 16px;border-radius:var(--yt-radius-md);border:1px solid var(--yt-glass-border);cursor:pointer;font-size:13px;font-weight:500;background:var(--yt-button-bg);color:var(--yt-text-primary);transition:all .2s ease;text-align:center;}
 .${CONFIG.classes.button}:disabled{opacity:.5;cursor:not-allowed;}
 .${CONFIG.classes.button}:not(:disabled):hover{transform:translateY(-1px);box-shadow:var(--yt-shadow);}
 .${CONFIG.classes.buttonDanger}{background:rgba(255,99,71,.12);border-color:rgba(255,99,71,.25);color:#ff5c5c;}
 .${CONFIG.classes.buttonPrimary}{background:rgba(33,150,243,.12);border-color:rgba(33,150,243,.25);color:#2196f3;}
 .${CONFIG.classes.buttonSuccess}{background:rgba(76,175,80,.12);border-color:rgba(76,175,80,.25);color:#4caf50;}
 .${CONFIG.classes.buttonDanger}:not(:disabled):hover{background:rgba(255,99,71,.22);}
 .${CONFIG.classes.buttonPrimary}:not(:disabled):hover{background:rgba(33,150,243,.22);}
 .${CONFIG.classes.buttonSuccess}:not(:disabled):hover{background:rgba(76,175,80,.22);}
 @media(max-width:1280px){
 .${CONFIG.classes.panel}{top:auto;bottom:24px;transform:none;right:16px;}
 }
 @media(max-width:768px){
 .${CONFIG.classes.panel}{position:fixed;left:16px;right:16px;bottom:16px;top:auto;transform:none;max-width:none;}
 .${CONFIG.classes.actions}{flex-direction:row;flex-wrap:wrap;}
 .${CONFIG.classes.button}{flex:1;min-width:140px;}
 }
 `;
 YouTubeUtils.StyleManager.add('comment-delete-styles', styles);
 }, 'addStyles');
 const addCommentManagerSettings = withErrorBoundary(() => {
 const advancedSection = $('.ytp-plus-settings-section[data-section="advanced"]');
 if (!advancedSection) return;
 const existing = $('.comment-manager-settings-item');
 if (existing) {
 try {
 advancedSection.appendChild(existing);
 } catch {
 }
 return;
 }
 const settingsItem = document.createElement('div');
 settingsItem.className = 'ytp-plus-settings-item comment-manager-settings-item';
 settingsItem.innerHTML = `
 <div>
 <label class="ytp-plus-settings-item-label">${t('commentManagement')}</label>
 <div class="ytp-plus-settings-item-description">${t('bulkDeleteDescription')}</div>
 </div>
 <button class="ytp-plus-button" id="open-comment-history-page" style="margin:0 0 0 30px;padding:12px 16px;font-size:13px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2">
 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
 <polyline points="15,3 21,3 21,9"/>
 <line x1="10" y1="14" x2="21" y2="3"/>
 </svg>
 </button>
 `;
 advancedSection.appendChild(settingsItem);
 $('#open-comment-history-page').addEventListener('click', () => {
 window.open('https://www.youtube.com/feed/history/comment_history', '_blank');
 });
 }, 'addCommentManagerSettings');
 const init = withErrorBoundary(() => {
 settings.load();
 addStyles();
 state.observer?.disconnect();
 state.observer = new MutationObserver(debounce(initializeScript, CONFIG.debounceDelay));
 YouTubeUtils.cleanupManager.registerObserver(state.observer);
 if (document.body) {
 state.observer.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 state.observer.observe(document.body, { childList: true, subtree: true });
 });
 }
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initializeScript);
 } else {
 initializeScript();
 }
 const settingsObserver = new MutationObserver(mutations => {
 for (const mutation of mutations) {
 for (const node of mutation.addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 setTimeout(addCommentManagerSettings, 100);
 return;
 }
 }
 }
 });
 YouTubeUtils.cleanupManager.registerObserver(settingsObserver);
 if (document.body) {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 settingsObserver.observe(document.body, { childList: true, subtree: true });
 });
 }
 const handleAdvancedNavClick = e => {
 const target = (e.target);
 if (target.dataset?.section === 'advanced') {
 setTimeout(addCommentManagerSettings, 50);
 }
 };
 if (!state.settingsNavListenerKey) {
 state.settingsNavListenerKey = YouTubeUtils.cleanupManager.registerListener(
 document,
 'click',
 handleAdvancedNavClick,
 { passive: true, capture: true }
 );
 }
 }, 'init');
 init();
})();
(function () {
 'use strict';
 const Y = (window).YouTubeUtils || {};
 function t(key, params = {}) {
 try {
 if (typeof window !== 'undefined') {
 if (window.YouTubePlusI18n?.t && typeof window.YouTubePlusI18n.t === 'function') {
 return window.YouTubePlusI18n.t(key, params);
 }
 if (window.YouTubeUtils?.t && typeof window.YouTubeUtils.t === 'function') {
 return window.YouTubeUtils.t(key, params);
 }
 }
 } catch {
 }
 return key;
 }
 function mk(tag, props = {}, children = []) {
 const el = document.createElement(tag);
 Object.entries(props).forEach(([k, v]) => {
 if (k === 'class') {
 el.className = (v);
 } else if (k === 'html') {
 if (typeof window._ytplusCreateHTML === 'function') {
 el.innerHTML = window._ytplusCreateHTML( (v));
 } else {
 el.innerHTML = sanitizeHTML( (v));
 }
 } else if (k.startsWith('on') && typeof v === 'function') {
 el.addEventListener(k.substring(2).toLowerCase(), (v));
 } else {
 el.setAttribute(k, String(v));
 }
 });
 children.forEach(c =>
 typeof c === 'string' ? el.appendChild(document.createTextNode(c)) : el.appendChild(c)
 );
 return el;
 }
 function sanitizeHTML(html) {
 if (Y?.sanitizeHTML && typeof Y.sanitizeHTML === 'function') {
 return Y.sanitizeHTML(html);
 }
 if (typeof html !== 'string') return '';
 const map = {
 '<': '&lt;',
 '>': '&gt;',
 '&': '&amp;',
 '"': '&quot;',
 "'": '&#39;',
 '/': '&#x2F;',
 '`': '&#x60;',
 '=': '&#x3D;',
 };
 return html.replace(/[<>&"'\/`=]/g, char => map[char] || char);
 }
 function isValidEmail(email) {
 if (!email || typeof email !== 'string') return false;
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailRegex.test(email) && email.length <= 254;
 }
 function validateTitle(title) {
 if (!title || typeof title !== 'string') return '';
 return sanitizeHTML(title.trim().substring(0, 200));
 }
 function validateDescription(description) {
 if (!description || typeof description !== 'string') return '';
 return sanitizeHTML(description.trim().substring(0, 5000));
 }
 function getDebugInfo() {
 try {
 const debug = {
 version: (window.YouTubePlusDebug)?.version || 'unknown',
 userAgent: navigator?.userAgent || 'unknown',
 url: location?.href || 'unknown',
 language: document.documentElement?.lang || navigator?.language || 'unknown',
 settings: typeof Y?.SettingsManager === 'object' ? Y.SettingsManager.load() : null,
 };
 return debug;
 } catch (err) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'Failed to collect debug info', err);
 }
 return {
 version: 'unknown',
 userAgent: 'unknown',
 url: 'unknown',
 language: 'unknown',
 settings: null,
 error: 'Failed to collect debug info',
 };
 }
 }
 function buildIssuePayload({ type, title, description, email, includeDebug }) {
 const debug = includeDebug ? getDebugInfo() : null;
 const lines = [];
 const typeLabel =
 type === 'bug' ? t('typeBug') : type === 'feature' ? t('typeFeature') : t('typeOther');
 lines.push(`**Type:** ${typeLabel}`);
 if (email) lines.push(`**Reporter email (optional):** ${email}`);
 lines.push('\n**Description:**\n');
 lines.push(description || '(no description)');
 if (debug) {
 lines.push('\n---\n**Debug info**\n');
 lines.push('```json');
 try {
 lines.push(JSON.stringify(debug, null, 2));
 } catch (err) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'Failed to stringify debug info', err);
 }
 const minimalDebug = {
 version: debug.version || 'unknown',
 userAgent: debug.userAgent || 'unknown',
 url: debug.url || 'unknown',
 };
 try {
 lines.push(JSON.stringify(minimalDebug, null, 2));
 } catch {
 lines.push('{ "error": "Failed to stringify debug info" }');
 }
 }
 lines.push('```');
 lines.push('\n_Please do not include sensitive personal data._');
 }
 const body = lines.join('\n');
 const issueTitle =
 `${type === 'bug' ? '[Bug]' : type === 'feature' ? '[Feature]' : '[Report]'} ${title || ''}`.trim();
 return { title: issueTitle, body };
 }
 function openGitHubIssue(payload) {
 try {
 const repoOwner = 'diorhc';
 const repo = 'YTP';
 const url = `https://github.com/${repoOwner}/${repo}/issues/new?title=${encodeURIComponent(
 payload.title
 )}&body=${encodeURIComponent(payload.body)}`;
 window.open(url, '_blank');
 } catch (err) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'Failed to open GitHub issue', err);
 }
 throw err;
 }
 }
 function copyToClipboard(text) {
 if (navigator.clipboard && navigator.clipboard.writeText) {
 return navigator.clipboard.writeText(text);
 }
 return new Promise((resolve, reject) => {
 const ta = document.createElement('textarea');
 ta.value = text;
 ta.style.position = 'fixed';
 ta.style.left = '-9999px';
 ta.style.opacity = '0';
 document.body.appendChild(ta);
 try {
 ta.select();
 ta.setSelectionRange(0, text.length);
 const success = document.execCommand('copy');
 document.body.removeChild(ta);
 if (success) {
 resolve();
 } else {
 reject(new Error('execCommand failed'));
 }
 } catch (err) {
 document.body.removeChild(ta);
 reject(err);
 }
 });
 }
 function renderReportSection(modal) {
 if (!modal || !modal.querySelector) return;
 const section = modal.querySelector('.ytp-plus-settings-section[data-section="report"]');
 if (!section) return;
 section.innerHTML = '';
 const form = mk('div', {
 style:
 'display:flex;flex-direction:column;gap:var(--yt-space-sm);margin-top:var(--yt-space-md);',
 });
 const typeSelect = mk('select', { style: 'display:none;' }, []);
 const typeOptions = [
 { v: 'bug', l: t('typeBug') },
 { v: 'feature', l: t('typeFeature') },
 { v: 'other', l: t('typeOther') },
 ];
 typeOptions.forEach(opt => {
 const o = mk('option', { value: opt.v }, [opt.l]);
 typeSelect.appendChild(o);
 });
 const typeDropdown = mk('div', {
 class: 'glass-dropdown',
 id: 'report-type-dropdown',
 tabindex: '0',
 role: 'listbox',
 'aria-expanded': 'false',
 });
 const defaultLabel = typeOptions[0].l;
 const toggleBtn = mk(
 'button',
 { class: 'glass-dropdown__toggle', type: 'button', 'aria-haspopup': 'listbox' },
 [mk('span', { class: 'glass-dropdown__label' }, [defaultLabel])]
 );
 toggleBtn.appendChild(
 mk(
 'svg',
 {
 class: 'glass-dropdown__chev',
 width: '12',
 height: '12',
 viewBox: '0 0 24 24',
 fill: 'none',
 stroke: 'currentColor',
 'stroke-width': '2',
 },
 [mk('polyline', { points: '6 9 12 15 18 9' }, [])]
 )
 );
 const listEl = mk('ul', { class: 'glass-dropdown__list', role: 'presentation' }, []);
 typeOptions.forEach((opt, i) => {
 const li = mk('li', { class: 'glass-dropdown__item', 'data-value': opt.v, role: 'option' }, [
 opt.l,
 ]);
 if (i === 0) li.setAttribute('aria-selected', 'true');
 listEl.appendChild(li);
 });
 typeDropdown.appendChild(toggleBtn);
 typeDropdown.appendChild(listEl);
 const inputStyle =
 'padding:var(--yt-space-sm);border-radius:var(--yt-radius-sm);background:var(--yt-input-bg);color:var(--yt-text-primary);border:1px solid var(--yt-glass-border);backdrop-filter:var(--yt-glass-blur-light);-webkit-backdrop-filter:var(--yt-glass-blur-light);font-size:14px;transition:var(--yt-transition);box-sizing:border-box;';
 const titleInput = mk('input', {
 placeholder: t('shortTitle'),
 style: inputStyle,
 });
 const emailInput = mk('input', {
 placeholder: t('emailOptional'),
 type: 'email',
 style: inputStyle,
 });
 const descInput = mk('textarea', {
 placeholder: t('descriptionPlaceholder'),
 rows: 6,
 style: inputStyle + 'resize:vertical;font-family:inherit;',
 });
 const debugCheckboxInput = mk('input', {
 type: 'checkbox',
 class: 'ytp-plus-settings-checkbox',
 });
 const includeDebug = mk(
 'label',
 {
 style:
 'font-size:13px;display:flex;gap:var(--yt-space-sm);align-items:center;color:var(--yt-text-primary);cursor:pointer;align-self:center;',
 },
 [debugCheckboxInput, ' ' + t('includeDebug')]
 );
 const actions = mk('div', {
 style: 'display:flex;gap:var(--yt-space-sm);margin-top:var(--yt-space-sm);flex-wrap:wrap;',
 });
 const submitBtn = mk('button', { class: 'glass-button' }, [t('openGitHub')]);
 const copyBtn = mk('button', { class: 'glass-button' }, [t('copyReport')]);
 const emailBtn = mk('button', { class: 'glass-button' }, [t('prepareEmail')]);
 actions.appendChild(submitBtn);
 actions.appendChild(copyBtn);
 actions.appendChild(emailBtn);
 form.appendChild(typeSelect);
 form.appendChild(typeDropdown);
 form.appendChild(titleInput);
 form.appendChild(emailInput);
 form.appendChild(descInput);
 form.appendChild(includeDebug);
 const debugPreview = mk(
 'div',
 {
 class: 'glass-card',
 style:
 'overflow:auto;max-height:240px;font-size:11px;display:none;margin-top:var(--yt-space-sm);padding:8px;box-sizing:border-box;',
 },
 []
 );
 form.appendChild(debugPreview);
 form.appendChild(actions);
 const privacy = mk(
 'div',
 {
 class: 'ytp-plus-settings-item-description',
 style: 'margin-top:var(--yt-space-sm);font-size:12px;color:var(--yt-text-secondary);',
 },
 [t('privacy')]
 );
 section.appendChild(form);
 section.appendChild(privacy);
 (function initReportTypeDropdown() {
 try {
 const hidden = typeSelect;
 const dropdown = typeDropdown;
 const toggle = dropdown.querySelector('.glass-dropdown__toggle');
 const list = dropdown.querySelector('.glass-dropdown__list');
 const label = dropdown.querySelector('.glass-dropdown__label');
 let items = Array.from(list.querySelectorAll('.glass-dropdown__item'));
 let idx = items.findIndex(it => it.getAttribute('aria-selected') === 'true');
 if (idx < 0) idx = 0;
 const openList = () => {
 dropdown.setAttribute('aria-expanded', 'true');
 list.style.display = 'block';
 items = Array.from(list.querySelectorAll('.glass-dropdown__item'));
 };
 const closeList = () => {
 dropdown.setAttribute('aria-expanded', 'false');
 list.style.display = 'none';
 };
 const selectedItem = items[idx];
 if (selectedItem) {
 hidden.value = selectedItem.dataset.value || '';
 label.textContent = selectedItem.textContent || '';
 }
 toggle.addEventListener('click', () => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (expanded) closeList();
 else openList();
 });
 document.addEventListener('click', e => {
 if (!dropdown.contains(e.target)) closeList();
 });
 list.addEventListener('click', e => {
 const it = e.target.closest('.glass-dropdown__item');
 if (!it) return;
 const val = it.dataset.value;
 hidden.value = val;
 list
 .querySelectorAll('.glass-dropdown__item')
 .forEach(li => li.removeAttribute('aria-selected'));
 it.setAttribute('aria-selected', 'true');
 label.textContent = it.textContent;
 hidden.dispatchEvent(new Event('change', { bubbles: true }));
 closeList();
 });
 dropdown.addEventListener('keydown', e => {
 const expanded = dropdown.getAttribute('aria-expanded') === 'true';
 if (e.key === 'ArrowDown') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.min(idx + 1, items.length - 1);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 if (!expanded) openList();
 idx = Math.max(idx - 1, 0);
 items.forEach(it => it.removeAttribute('aria-selected'));
 items[idx].setAttribute('aria-selected', 'true');
 items[idx].scrollIntoView({ block: 'nearest' });
 } else if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 if (!expanded) {
 openList();
 return;
 }
 const it = items[idx];
 if (it) {
 hidden.value = it.dataset.value;
 hidden.dispatchEvent(new Event('change', { bubbles: true }));
 label.textContent = it.textContent;
 closeList();
 }
 } else if (e.key === 'Escape') {
 closeList();
 }
 });
 } catch (err) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'initReportTypeDropdown', err);
 }
 }
 })();
 function updateDebugPreview() {
 try {
 if (debugCheckboxInput.checked) {
 const d = getDebugInfo();
 debugPreview.innerHTML = '';
 const header = mk(
 'div',
 { style: 'display:flex;flex-direction:column;gap:6px;margin-bottom:6px;' },
 []
 );
 header.appendChild(
 mk('div', {}, ['Version: ', mk('strong', {}, [String(d.version || 'unknown')])])
 );
 header.appendChild(
 mk('div', {}, [
 'User agent: ',
 mk('code', { style: 'font-size:11px;color:var(--yt-text-secondary);' }, [
 String(d.userAgent || ''),
 ]),
 ])
 );
 const urlStr = String(d.url || 'unknown');
 let urlEl = mk('span', {}, [urlStr]);
 try {
 if (/^https?:\/\//i.test(urlStr)) {
 urlEl = mk(
 'a',
 {
 href: urlStr,
 target: '_blank',
 rel: 'noopener noreferrer',
 style: 'color:var(--yt-accent);word-break:break-all;',
 },
 [urlStr]
 );
 }
 } catch (e) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'URL link creation failed', e);
 }
 urlEl = mk('span', {}, [String(urlStr)]);
 }
 header.appendChild(mk('div', {}, ['URL: ', urlEl]));
 header.appendChild(
 mk('div', {}, ['Language: ', mk('code', {}, [String(d.language || '')])])
 );
 debugPreview.appendChild(header);
 if (d.settings) {
 const settingsDetails = mk('details', {}, [mk('summary', {}, ['Settings'])]);
 settingsDetails.appendChild(
 mk('pre', { style: 'white-space:pre-wrap;margin:6px 0 0 0;font-size:11px;' }, [
 JSON.stringify(d.settings, null, 2),
 ])
 );
 debugPreview.appendChild(settingsDetails);
 }
 const fullDetails = mk('details', {}, [mk('summary', {}, ['Full debug JSON'])]);
 fullDetails.appendChild(
 mk('pre', { style: 'white-space:pre-wrap;margin:6px 0 0 0;font-size:11px;' }, [
 JSON.stringify(d, null, 2),
 ])
 );
 debugPreview.appendChild(fullDetails);
 debugPreview.style.display = 'block';
 } else {
 debugPreview.innerHTML = '';
 debugPreview.style.display = 'none';
 }
 } catch (err) {
 if (Y && typeof Y.logError === 'function') {
 Y.logError('Report', 'updateDebugPreview failed', err);
 }
 }
 }
 debugCheckboxInput.addEventListener('change', updateDebugPreview);
 function gather() {
 const type = (typeSelect).value;
 const rawTitle = (titleInput).value.trim();
 const rawDescription = (descInput).value.trim();
 const rawEmail = (emailInput).value.trim();
 const includeDebugValue = (
 includeDebug.querySelector('input')
 ).checked;
 const errors = [];
 if (!rawTitle) {
 errors.push(t('titleRequired'));
 } else if (rawTitle.length < 5) {
 errors.push(t('titleMin'));
 }
 if (!rawDescription) {
 errors.push(t('descRequired'));
 } else if (rawDescription.length < 10) {
 errors.push(t('descMin'));
 }
 if (rawEmail && !isValidEmail(rawEmail)) {
 errors.push(t('invalidEmail'));
 }
 return {
 type,
 title: validateTitle(rawTitle),
 description: validateDescription(rawDescription),
 email: rawEmail && isValidEmail(rawEmail) ? rawEmail : '',
 includeDebug: includeDebugValue,
 errors,
 };
 }
 submitBtn.addEventListener('click', e => {
 e.preventDefault();
 if (submitBtn.disabled) return;
 try {
 const data = gather();
 if (data.errors && data.errors.length > 0) {
 const errorMsg = t('fixErrorsPrefix') + data.errors.join('\n• ');
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(errorMsg, { duration: 4000, type: 'error' });
 } else {
 console.warn('[Report] Validation errors:', data.errors);
 }
 return;
 }
 const originalText = submitBtn.textContent;
 submitBtn.disabled = true;
 submitBtn.textContent = t('opening');
 submitBtn.style.opacity = '0.6';
 const payload = buildIssuePayload(data);
 openGitHubIssue(payload);
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(t('openingGithubNotification'), { duration: 2500 });
 }
 setTimeout(() => {
 submitBtn.disabled = false;
 submitBtn.textContent = originalText;
 submitBtn.style.opacity = '1';
 }, 2000);
 } catch (err) {
 if (Y.logError) Y.logError('Report', 'Failed to open GitHub issue', err);
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(t('failedOpenGithub'), {
 duration: 3000,
 type: 'error',
 });
 }
 submitBtn.disabled = false;
 submitBtn.textContent = t('openGitHub');
 submitBtn.style.opacity = '1';
 }
 });
 copyBtn.addEventListener('click', e => {
 e.preventDefault();
 if (copyBtn.disabled) return;
 try {
 const data = gather();
 if (data.errors && data.errors.length > 0) {
 const errorMsg = t('fixErrorsPrefix') + data.errors.join('\n• ');
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(errorMsg, { duration: 4000, type: 'error' });
 } else {
 console.warn('[Report] Validation errors:', data.errors);
 }
 return;
 }
 const originalText = copyBtn.textContent;
 copyBtn.disabled = true;
 copyBtn.textContent = t('copying');
 copyBtn.style.opacity = '0.6';
 const payload = buildIssuePayload(data);
 const full = `Title: ${payload.title}\n\n${payload.body}`;
 copyToClipboard(full)
 .then(() => {
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(t('reportCopied'), { duration: 2000 });
 }
 copyBtn.textContent = t('copied');
 copyBtn.style.opacity = '1';
 setTimeout(() => {
 copyBtn.disabled = false;
 copyBtn.textContent = originalText;
 }, 2000);
 })
 .catch(err => {
 if (Y && typeof Y.logError === 'function') Y.logError('Report', 'copy failed', err);
 if (Y && Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(t('copyFailed'), {
 duration: 3000,
 type: 'error',
 });
 } else {
 console.warn('Copy failed; please copy manually', err);
 }
 copyBtn.disabled = false;
 copyBtn.textContent = originalText;
 copyBtn.style.opacity = '1';
 });
 } catch (err) {
 if (Y.logError) Y.logError('Report', 'Failed to copy report', err);
 copyBtn.disabled = false;
 copyBtn.textContent = t('copyReport');
 copyBtn.style.opacity = '1';
 }
 });
 emailBtn.addEventListener('click', e => {
 e.preventDefault();
 if (emailBtn.disabled) return;
 try {
 const data = gather();
 if (data.errors && data.errors.length > 0) {
 const errorMsg = t('fixErrorsPrefix') + data.errors.join('\n• ');
 if (Y.NotificationManager && typeof Y.NotificationManager.show === 'function') {
 Y.NotificationManager.show(errorMsg, { duration: 4000, type: 'error' });
 } else {
 console.warn('[Report] Validation errors:', data.errors);
 }
 return;
 }
 const originalText = emailBtn.textContent;
 emailBtn.disabled = true;
 emailBtn.textContent = t('opening');
 emailBtn.style.opacity = '0.6';
 const payload = buildIssuePayload(data);
 const subject = payload.title;
 const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
 payload.body
 )}`;
 window.location.href = mailto;
 setTimeout(() => {
 emailBtn.disabled = false;
 emailBtn.textContent = originalText;
 emailBtn.style.opacity = '1';
 }, 2000);
 } catch (err) {
 if (Y.logError) Y.logError('Report', 'Failed to prepare email', err);
 emailBtn.disabled = false;
 emailBtn.textContent = t('prepareEmail');
 emailBtn.style.opacity = '1';
 }
 });
 }
 try {
 (window).youtubePlusReport =
 (window).youtubePlusReport || {};
 (window).youtubePlusReport.render = renderReportSection;
 } catch (e) {
 if (Y.logError) Y.logError('Report', 'Failed to attach report module to window', e);
 }
})();
(function () {
 'use strict';
 const _globalI18n =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const t = (key, params = {}) => {
 try {
 if (_globalI18n && typeof _globalI18n.t === 'function') {
 return _globalI18n.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 const getLanguage = () => {
 try {
 if (_globalI18n && typeof _globalI18n.getLanguage === 'function') {
 return _globalI18n.getLanguage();
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.getLanguage === 'function'
 ) {
 return window.YouTubeUtils.getLanguage();
 }
 } catch {
 }
 const lang = document.documentElement.lang || navigator.language || 'en';
 return lang.startsWith('ru') ? 'ru' : 'en';
 };
 const UPDATE_CONFIG = {
 enabled: true,
 checkInterval: 24 * 60 * 60 * 1000,
 updateUrl: 'https://update.greasyfork.org/scripts/537017/YouTube%20%2B.meta.js',
 currentVersion: '2.3.1',
 storageKey: 'youtube_plus_update_check',
 notificationDuration: 8000,
 autoInstallUrl: 'https://update.greasyfork.org/scripts/537017/YouTube%20%2B.user.js',
 autoInstallOnCheck: false,
 showNotificationIcon: false,
 };
 const windowRef = typeof window === 'undefined' ? null : window;
 const GM_namespace = windowRef?.GM || null;
 const GM_info_safe = windowRef?.GM_info || null;
 const GM_openInTab_safe = (() => {
 if (windowRef) {
 if (typeof windowRef.GM_openInTab === 'function') {
 return windowRef.GM_openInTab.bind(windowRef);
 }
 if (GM_namespace?.openInTab) {
 return GM_namespace.openInTab.bind(GM_namespace);
 }
 }
 return null;
 })();
 if (GM_info_safe?.script?.version) {
 UPDATE_CONFIG.currentVersion = GM_info_safe.script.version;
 }
 const updateState = {
 lastCheck: 0,
 lastVersion: UPDATE_CONFIG.currentVersion,
 updateAvailable: true,
 checkInProgress: false,
 updateDetails: null,
 };
 function getRussianPluralIndex(num) {
 const mod10 = num % 10;
 const mod100 = num % 100;
 if (mod10 === 1 && mod100 !== 11) return 0;
 if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 1;
 return 2;
 }
 function getRussianForms(unit) {
 return {
 day: ['день', 'дня', 'дней'],
 hour: ['час', 'часа', 'часов'],
 minute: ['минута', 'минуты', 'минут'],
 }[unit];
 }
 function getEnglishForms(unit) {
 return {
 day: ['day', 'days'],
 hour: ['hour', 'hours'],
 minute: ['minute', 'minutes'],
 }[unit];
 }
 function pluralizeTime(n, unit) {
 const lang = getLanguage();
 const num = Math.abs(Number(n)) || 0;
 if (lang === 'ru') {
 const forms = getRussianForms(unit);
 const idx = getRussianPluralIndex(num);
 return `${num} ${forms[idx]}`;
 }
 const enForms = getEnglishForms(unit);
 return `${num} ${num === 1 ? enForms[0] : enForms[1]}`;
 }
 const utils = {
 loadSettings: () => {
 try {
 const saved = localStorage.getItem(UPDATE_CONFIG.storageKey);
 if (!saved) {
 return;
 }
 const parsed = JSON.parse(saved);
 if (typeof parsed !== 'object' || parsed === null) {
 console.error('[YouTube+][Update]', 'Invalid settings structure');
 return;
 }
 if (typeof parsed.lastCheck === 'number' && parsed.lastCheck >= 0) {
 updateState.lastCheck = parsed.lastCheck;
 }
 if (typeof parsed.lastVersion === 'string') {
 const ver = parsed.lastVersion.replace(/^v/i, '');
 if (/^\d+(?:\.\d+){0,2}$/.test(ver)) {
 updateState.lastVersion = ver;
 }
 }
 if (typeof parsed.updateAvailable === 'boolean') {
 updateState.updateAvailable = parsed.updateAvailable;
 }
 if (parsed.updateDetails && typeof parsed.updateDetails === 'object') {
 if (
 typeof parsed.updateDetails.version === 'string' &&
 /^\d+\.\d+\.\d+/.test(parsed.updateDetails.version)
 ) {
 updateState.updateDetails = parsed.updateDetails;
 }
 }
 } catch (e) {
 console.error('[YouTube+][Update]', 'Failed to load update settings:', e);
 }
 },
 saveSettings: () => {
 try {
 const dataToSave = {
 lastCheck: updateState.lastCheck,
 lastVersion: updateState.lastVersion,
 updateAvailable: updateState.updateAvailable,
 updateDetails: updateState.updateDetails,
 };
 localStorage.setItem(UPDATE_CONFIG.storageKey, JSON.stringify(dataToSave));
 } catch (e) {
 console.error('[YouTube+][Update]', 'Failed to save update settings:', e);
 }
 },
 compareVersions: (v1, v2) => {
 if (typeof v1 !== 'string' || typeof v2 !== 'string') {
 console.error('[YouTube+][Update]', 'Invalid version format - must be strings');
 return 0;
 }
 const normalize = v =>
 v
 .replace(/[^\d.]/g, '')
 .split('.')
 .map(n => parseInt(n, 10) || 0);
 const [parts1, parts2] = [normalize(v1), normalize(v2)];
 const maxLength = Math.max(parts1.length, parts2.length);
 for (let i = 0; i < maxLength; i++) {
 const diff = (parts1[i] || 0) - (parts2[i] || 0);
 if (diff !== 0) {
 return diff;
 }
 }
 return 0;
 },
 parseMetadata: text => {
 if (typeof text !== 'string' || text.length > 100000) {
 console.error('[YouTube+][Update]', 'Invalid metadata text');
 return { version: null, description: '', downloadUrl: UPDATE_CONFIG.autoInstallUrl };
 }
 const extractField = field =>
 text.match(new RegExp(`@${field}\\s+([^\\r\\n]+)`))?.[1]?.trim();
 let version = extractField('version');
 const description = extractField('description') || '';
 const downloadUrl = extractField('downloadURL') || UPDATE_CONFIG.autoInstallUrl;
 if (version) {
 version = version.replace(/^v/i, '').trim();
 if (!/^\d+(?:\.\d+){0,2}$/.test(version)) {
 console.error('[YouTube+][Update]', 'Invalid version format in metadata:', version);
 return { version: null, description: '', downloadUrl: UPDATE_CONFIG.autoInstallUrl };
 }
 }
 return {
 version,
 description: description.substring(0, 500),
 downloadUrl,
 };
 },
 formatTimeAgo: timestamp => {
 if (!timestamp) return t('never');
 const diffMs = Date.now() - timestamp;
 const diffDays = Math.floor(diffMs / 86400000);
 const diffHours = Math.floor(diffMs / 3600000);
 const diffMinutes = Math.floor(diffMs / 60000);
 if (diffDays > 0) return pluralizeTime(diffDays, 'day');
 if (diffHours > 0) return pluralizeTime(diffHours, 'hour');
 if (diffMinutes > 0) return pluralizeTime(diffMinutes, 'minute');
 return t('justNow');
 },
 showNotification: (text, type = 'info', duration = 3000) => {
 try {
 YouTubeUtils.NotificationManager.show(text, { type, duration });
 } catch (error) {
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(`[YouTube+] ${type.toUpperCase()}:`, text, error);
 }
 },
 };
 const validateDownloadUrl = downloadUrl => {
 if (!downloadUrl || typeof downloadUrl !== 'string') {
 return { valid: false, error: 'Invalid download URL for installation' };
 }
 try {
 const parsedUrl = new URL(downloadUrl);
 const allowedDomains = ['update.greasyfork.org', 'greasyfork.org'];
 if (parsedUrl.protocol !== 'https:') {
 return { valid: false, error: 'Only HTTPS URLs allowed for updates' };
 }
 if (!allowedDomains.includes(parsedUrl.hostname)) {
 return { valid: false, error: `Update URL domain not in allowlist: ${parsedUrl.hostname}` };
 }
 return { valid: true, error: null };
 } catch (error) {
 return { valid: false, error: `Invalid URL format: ${error.message}` };
 }
 };
 const markUpdateDismissed = details => {
 if (details?.version && typeof details.version === 'string') {
 try {
 sessionStorage.setItem('update_dismissed', details.version);
 } catch (err) {
 console.error('[YouTube+][Update]', 'Failed to persist dismissal state:', err);
 }
 }
 };
 const tryOpenUpdateUrl = url => {
 if (GM_openInTab_safe) {
 try {
 GM_openInTab_safe(url, { active: true, insert: true, setParent: true });
 return true;
 } catch (gmError) {
 console.error('[YouTube+] GM_openInTab update install failed:', gmError);
 }
 }
 try {
 const popup = window.open(url, '_blank', 'noopener');
 if (popup) return true;
 } catch (popupError) {
 console.error('[YouTube+] window.open update install failed:', popupError);
 }
 try {
 window.location.assign(url);
 return true;
 } catch (navigationError) {
 console.error('[YouTube+] Navigation to update URL failed:', navigationError);
 }
 return false;
 };
 const installUpdate = (details = updateState.updateDetails) => {
 const downloadUrl = details?.downloadUrl || UPDATE_CONFIG.autoInstallUrl;
 const validation = validateDownloadUrl(downloadUrl);
 if (!validation.valid) {
 console.error('[YouTube+][Update]', validation.error);
 return false;
 }
 const success = tryOpenUpdateUrl(downloadUrl);
 if (success) {
 markUpdateDismissed(details);
 }
 return success;
 };
 const showUpdateNotification = updateDetails => {
 const iconHtml = UPDATE_CONFIG.showNotificationIcon
 ? `<div style="background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
 border-radius: 10px; padding: 10px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08);
 backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path d="M21 12c0 1-1 2-1 2s-1-1-1-2 1-2 1-2 1 1 1 2z"/>
 <path d="m21 12-5-5v3H8v4h8v3l5-5z"/>
 </svg>
 </div>`
 : '';
 const notification = document.createElement('div');
 notification.className = 'youtube-enhancer-notification update-notification';
 notification.style.cssText = `
 z-index: 10001; max-width: 360px;
 background: rgba(255,255,255,0.04); padding: 16px 18px; border-radius: 14px;
 color: rgba(255,255,255,0.95);
 box-shadow: 0 8px 30px rgba(11, 15, 25, 0.45), inset 0 1px 0 rgba(255,255,255,0.02);
 border: 1px solid rgba(255,255,255,0.08);
 -webkit-backdrop-filter: blur(10px) saturate(120%);
 backdrop-filter: blur(10px) saturate(120%);
 animation: slideInFromBottom 0.4s ease-out;
 `;
 notification.innerHTML = `
 <div style="position: relative; display: flex; align-items: flex-start; gap: 12px;">
 ${iconHtml}
 <div style="flex: 1; min-width: 0;">
 <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px;">${t('updateAvailableTitle')}</div>
 <div style="font-size: 13px; opacity: 0.9; margin-bottom: 8px;">
 ${t('version')} ${updateDetails.version}
 </div>
 ${
 updateDetails.changelog || updateDetails.description
 ? (function () {
 const header = t('changelogHeader');
 const raw =
 updateDetails.changelog && updateDetails.changelog.length > 0
 ? updateDetails.changelog
 : updateDetails.description || '';
 const sanitize = s =>
 String(s)
 .replace(/<br\s*\/?>/gi, '\n')
 .replace(/<\/p>/gi, '\n')
 .replace(/<[^>]+>/g, '')
 .replace(/&amp;/g, '&')
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>')
 .replace(/&quot;/g, '"')
 .replace(/&#039;/g, "'")
 .trim();
 const text = sanitize(raw);
 const lines = text
 .split(/\n+/)
 .map(l => l.trim())
 .filter(Boolean);
 const listHtml = lines
 .map(
 l =>
 `<div style="font-size:12px; opacity:0.85; margin-bottom:6px;">${l}</div>`
 )
 .join('');
 return (
 `<div style="font-size:12px; font-weight:600; opacity:0.95; margin-bottom:6px;">${header}</div>` +
 `<div style="font-size:12px; line-height:1.4; max-height:120px; overflow-y:auto; padding:8px; background: rgba(0,0,0,0.2); border-radius:6px; border:1px solid rgba(255,255,255,0.05); white-space:normal;">${listHtml}</div>`
 );
 })()
 : `<div style="font-size: 12px; opacity: 0.85; margin-bottom: 12px;">${t('newFeatures')}</div>`
 }
 <div style="display: flex; gap: 8px;">
 <button id="update-install-btn" style="
 background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
 color: #ff5a1a; border: 1px solid rgba(255,90,30,0.12);
 padding: 8px 16px; border-radius: 8px; cursor: pointer;
 font-size: 13px; font-weight: 700; transition: transform 0.15s ease;
 box-shadow: 0 6px 18px rgba(90,30,0,0.12);
 backdrop-filter: blur(6px);
 ">${t('installUpdate')}</button>
 <button id="update-dismiss-btn" style="
 background: transparent; color: rgba(255,255,255,0.9);
 border: 1px solid rgba(255,255,255,0.06); padding: 8px 12px;
 border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.12s ease;
 ">${t('later')}</button>
 </div>
 </div>
 <button id="update-close-btn" aria-label="${t('dismiss')}" style="
 position: absolute; top: -8px; right: -8px; width: 28px; height: 28px;
 border-radius: 50%; border: none; cursor: pointer; display: flex;
 align-items: center; justify-content: center; font-size: 16px; line-height: 1;
 background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); transition: background 0.18s ease;
 border: 1px solid rgba(255,255,255,0.06);
 ">&times;</button>
 </div>
 <style>
 @keyframes slideInFromBottom {
 from { transform: translateY(100%); opacity: 0; }
 to { transform: translateY(0); opacity: 1; }
 }
 @keyframes slideOutToBottom {
 from { transform: translateY(0); opacity: 1; }
 to { transform: translateY(100%); opacity: 0; }
 }
 #update-close-btn:hover {
 background: rgba(255, 255, 255, 0.25);
 }
 </style>
 `;
 const _containerId = 'youtube-enhancer-notification-container';
 let _container = document.getElementById(_containerId);
 if (!_container) {
 _container = document.createElement('div');
 _container.id = _containerId;
 _container.className = 'youtube-enhancer-notification-container';
 try {
 document.body.appendChild(_container);
 } catch {
 document.body.appendChild(notification);
 }
 }
 try {
 _container.insertBefore(notification, _container.firstChild);
 } catch {
 document.body.appendChild(notification);
 }
 const removeNotification = () => {
 notification.style.animation = 'slideOutToBottom 0.35s ease-in forwards';
 setTimeout(() => notification.remove(), 360);
 };
 const installBtn = notification.querySelector('#update-install-btn');
 if (installBtn) {
 installBtn.addEventListener('click', () => {
 const success = installUpdate(updateDetails);
 if (success) {
 removeNotification();
 setTimeout(() => utils.showNotification(t('installing')), 500);
 } else {
 utils.showNotification(t('manualInstallHint'), 'error', 5000);
 window.open('https://greasyfork.org/en/scripts/537017-youtube', '_blank');
 }
 });
 }
 const dismissBtn = notification.querySelector('#update-dismiss-btn');
 if (dismissBtn) {
 dismissBtn.addEventListener('click', () => {
 if (updateDetails?.version) {
 sessionStorage.setItem('update_dismissed', updateDetails.version);
 }
 removeNotification();
 });
 }
 const closeBtn = notification.querySelector('#update-close-btn');
 if (closeBtn) {
 closeBtn.addEventListener('click', () => {
 if (updateDetails?.version) {
 sessionStorage.setItem('update_dismissed', updateDetails.version);
 }
 removeNotification();
 });
 }
 setTimeout(() => {
 if (notification.isConnected) removeNotification();
 }, UPDATE_CONFIG.notificationDuration);
 };
 const validateUpdateUrl = url => {
 const parsedUrl = new URL(url);
 if (parsedUrl.protocol !== 'https:') {
 throw new Error('Update URL must use HTTPS');
 }
 if (!parsedUrl.hostname.includes('greasyfork.org')) {
 throw new Error('Update URL must be from greasyfork.org');
 }
 };
 const fetchUpdateMetadata = async (url = UPDATE_CONFIG.updateUrl) => {
 const fetchMeta = async requestUrl => {
 if (typeof GM_xmlhttpRequest !== 'undefined') {
 return new Promise((resolve, reject) => {
 const timeoutId = setTimeout(() => reject(new Error('Update check timeout')), 10000);
 GM_xmlhttpRequest({
 method: 'GET',
 url: requestUrl,
 timeout: 10000,
 headers: { Accept: 'text/plain', 'User-Agent': 'YouTube+ UpdateChecker' },
 onload: response => {
 clearTimeout(timeoutId);
 if (response.status >= 200 && response.status < 300) resolve(response.responseText);
 else reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
 },
 onerror: e => {
 clearTimeout(timeoutId);
 reject(new Error(`Network error: ${e}`));
 },
 ontimeout: () => {
 clearTimeout(timeoutId);
 reject(new Error('Update check timeout'));
 },
 });
 });
 }
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 10000);
 try {
 const res = await fetch(requestUrl, {
 method: 'GET',
 cache: 'no-cache',
 signal: controller.signal,
 headers: { Accept: 'text/plain', 'User-Agent': 'YouTube+ UpdateChecker' },
 });
 if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
 return await res.text();
 } finally {
 clearTimeout(timeoutId);
 }
 };
 return fetchMeta(url);
 };
 const handleUpdateResult = (updateDetails, force) => {
 const shouldShowNotification =
 updateState.updateAvailable &&
 (force || sessionStorage.getItem('update_dismissed') !== updateDetails.version);
 if (shouldShowNotification) {
 showUpdateNotification(updateDetails);
 window.YouTubeUtils &&
 YouTubeUtils.logger &&
 YouTubeUtils.logger.debug &&
 YouTubeUtils.logger.debug(`YouTube + Update available: ${updateDetails.version}`);
 return;
 }
 if (force) {
 const message = updateState.updateAvailable
 ? t('updateAvailableMsg').replace('{version}', updateDetails.version)
 : t('upToDateMsg').replace('{version}', UPDATE_CONFIG.currentVersion);
 utils.showNotification(message);
 }
 };
 const isTransientError = error => {
 return (
 error.name === 'AbortError' ||
 error.name === 'NetworkError' ||
 (error.message && error.message.includes('fetch')) ||
 (error.message && error.message.includes('network'))
 );
 };
 const fetchChangelog = async version => {
 try {
 const lang = getLanguage();
 const url = `https://greasyfork.org/${lang}/scripts/537017-youtube/versions`;
 const fetchPage = async requestUrl => {
 if (typeof GM_xmlhttpRequest !== 'undefined') {
 return new Promise((resolve, reject) => {
 const timeoutId = setTimeout(() => reject(new Error('Changelog fetch timeout')), 10000);
 GM_xmlhttpRequest({
 method: 'GET',
 url: requestUrl,
 timeout: 10000,
 headers: { Accept: 'text/html' },
 onload: response => {
 clearTimeout(timeoutId);
 if (response.status >= 200 && response.status < 300) resolve(response.responseText);
 else reject(new Error(`HTTP ${response.status}`));
 },
 onerror: _e => {
 clearTimeout(timeoutId);
 reject(new Error('Network error'));
 },
 ontimeout: () => {
 clearTimeout(timeoutId);
 reject(new Error('Timeout'));
 },
 });
 });
 }
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 10000);
 try {
 const res = await fetch(requestUrl, {
 method: 'GET',
 cache: 'no-cache',
 signal: controller.signal,
 headers: { Accept: 'text/html' },
 });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 return await res.text();
 } finally {
 clearTimeout(timeoutId);
 }
 };
 const html = await fetchPage(url);
 const escapedVersion = version.replace(/\./g, '\\.');
 const versionRegex = new RegExp(
 `>[^<]*?${escapedVersion}</a>[\\s\\S]*?class="version-changelog"[^>]*>([\\s\\S]*?)</span>`,
 'i'
 );
 const match = html.match(versionRegex);
 if (match && match[1]) {
 let changelog = match[1].trim();
 changelog = changelog
 .replace(/<br\s*\/?>/gi, '\n')
 .replace(/<\/p>/gi, '\n')
 .replace(/<[^>]+>/g, '')
 .replace(/&amp;/g, '&')
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>')
 .replace(/&quot;/g, '"')
 .replace(/&#039;/g, "'");
 changelog = changelog
 .split('\n')
 .map(line => line.trim())
 .filter(line => line.length > 0)
 .join('\n');
 return changelog || '';
 }
 return '';
 } catch (error) {
 console.warn('[YouTube+][Update] Failed to fetch changelog:', error.message);
 return '';
 }
 };
 const retrieveUpdateDetails = async () => {
 let metaText = await fetchUpdateMetadata(UPDATE_CONFIG.updateUrl);
 let details = utils.parseMetadata(metaText);
 if (!details.version) {
 try {
 const fallbackText = await fetchUpdateMetadata(UPDATE_CONFIG.autoInstallUrl);
 const fallbackDetails = utils.parseMetadata(fallbackText);
 if (fallbackDetails.version) {
 details = fallbackDetails;
 metaText = fallbackText;
 }
 } catch (fallbackErr) {
 if (typeof console !== 'undefined' && console.warn) {
 console.warn('[YouTube+][Update] Fallback metadata fetch failed:', fallbackErr.message);
 }
 }
 }
 if (details.version) {
 try {
 const changelog = await fetchChangelog(details.version);
 details.changelog = typeof changelog === 'string' && changelog.length > 0 ? changelog : '';
 } catch (changelogErr) {
 console.warn('[YouTube+][Update] Failed to fetch changelog:', changelogErr.message);
 details.changelog = '';
 }
 } else {
 details.changelog = '';
 }
 return details;
 };
 const shouldCheckForUpdates = (force, now) => {
 if (!UPDATE_CONFIG.enabled || updateState.checkInProgress) {
 return false;
 }
 return force || now - updateState.lastCheck >= UPDATE_CONFIG.checkInterval;
 };
 const validateUpdateConfiguration = () => {
 try {
 validateUpdateUrl(UPDATE_CONFIG.updateUrl);
 return true;
 } catch (urlError) {
 console.error('[YouTube+][Update]', 'Invalid update URL configuration:', urlError);
 throw urlError;
 }
 };
 const processUpdateDetails = (updateDetails, force, now) => {
 updateState.lastCheck = now;
 updateState.lastVersion = updateDetails.version;
 updateState.updateDetails = updateDetails;
 const comparison = utils.compareVersions(UPDATE_CONFIG.currentVersion, updateDetails.version);
 updateState.updateAvailable = comparison < 0;
 handleUpdateResult(updateDetails, force);
 utils.saveSettings();
 if (updateState.updateAvailable && UPDATE_CONFIG.autoInstallOnCheck) {
 try {
 const dismissed = sessionStorage.getItem('update_dismissed');
 if (dismissed !== updateDetails.version) {
 const started = installUpdate(updateDetails);
 if (started) {
 markUpdateDismissed(updateDetails);
 try {
 utils.showNotification(t('installing'));
 } catch {}
 } else {
 console.warn(
 '[YouTube+][Update] Auto-install could not be initiated for',
 updateDetails.downloadUrl
 );
 }
 }
 } catch (e) {
 console.error('[YouTube+][Update] Auto-installation failed:', e);
 }
 }
 };
 const handleMissingUpdateInfo = force => {
 updateState.updateAvailable = false;
 if (force) {
 utils.showNotification(
 t('updateCheckFailed').replace('{msg}', t('noUpdateInfo')),
 'error',
 4000
 );
 }
 };
 const handleUpdateRetry = async (error, force, retryCount) => {
 const MAX_RETRIES = 2;
 const RETRY_DELAY = 2000;
 if (isTransientError(error) && retryCount < MAX_RETRIES) {
 console.warn(
 `[YouTube+][Update] Retry ${retryCount + 1}/${MAX_RETRIES} after error:`,
 error.message
 );
 await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
 return checkForUpdates(force, retryCount + 1);
 }
 console.error('[YouTube+][Update] Check failed after retries:', error);
 if (force) {
 utils.showNotification(t('updateCheckFailed').replace('{msg}', error.message), 'error', 4000);
 }
 };
 const checkForUpdates = async (force = false, retryCount = 0) => {
 const now = Date.now();
 if (!shouldCheckForUpdates(force, now)) {
 return;
 }
 updateState.checkInProgress = true;
 try {
 validateUpdateConfiguration();
 const updateDetails = await retrieveUpdateDetails();
 if (updateDetails.version) {
 processUpdateDetails(updateDetails, force, now);
 } else {
 handleMissingUpdateInfo(force);
 }
 } catch (error) {
 await handleUpdateRetry(error, force, retryCount);
 } finally {
 updateState.checkInProgress = false;
 }
 };
 const addUpdateSettings = () => {
 const aboutSection = YouTubeUtils.querySelector(
 '.ytp-plus-settings-section[data-section="about"]'
 );
 if (!aboutSection || YouTubeUtils.querySelector('.update-settings-container')) return;
 const updateContainer = document.createElement('div');
 updateContainer.className = 'update-settings-container';
 updateContainer.style.cssText = `
 padding: 16px; margin-top: 20px; border-radius: 12px;
 background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
 -webkit-backdrop-filter: blur(10px) saturate(120%);
 backdrop-filter: blur(10px) saturate(120%);
 box-shadow: 0 6px 20px rgba(6, 10, 20, 0.45);
 `;
 const lastCheckTime = utils.formatTimeAgo(updateState.lastCheck);
 updateContainer.innerHTML = `
 <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
 <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--yt-spec-text-primary);">
 ${t('enhancedExperience')}
 </h3>
 </div>
 <div style="display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
 padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; margin-bottom: 16px;">
 <div>
 <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
 <span style="font-size: 14px; font-weight: 600; color: var(--yt-spec-text-primary);">${t('currentVersion')}</span>
 <span style="font-size: 13px; font-weight: 600; color: var(--yt-spec-text-primary);
 padding: 3px 10px; background: rgba(255, 255, 255, 0.1); border-radius: 12px;
 border: 1px solid rgba(255, 255, 255, 0.2);">${UPDATE_CONFIG.currentVersion}</span>
 </div>
 <div style="font-size: 12px; color: var(--yt-spec-text-secondary);">
 ${t('lastChecked')}: <span style="font-weight: 500;">${lastCheckTime}</span>
 ${
 updateState.lastVersion && updateState.lastVersion !== UPDATE_CONFIG.currentVersion
 ? `<br>${t('latestAvailable')}: <span style="color: #ff6666; font-weight: 600;">${updateState.lastVersion}</span>`
 : ''
 }
 </div>
 </div>
 ${
 updateState.updateAvailable
 ? `
 <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
 <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px;
 background: linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 68, 68, 0.3));
 border: 1px solid rgba(255, 68, 68, 0.4); border-radius: 20px;">
 <div style="width: 6px; height: 6px; background: #ff4444; border-radius: 50%; animation: pulse 2s infinite;"></div>
 <span style="font-size: 11px; color: #ff6666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
 ${t('updateAvailable')}
 </span>
 </div>
 <button id="install-update-btn" style="background: linear-gradient(135deg, #ff4500, #ff6b35);
 color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;
 font-size: 12px; font-weight: 600; transition: all 0.3s ease;
 box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);">${t('installUpdate')}</button>
 </div>
 `
 : `
 <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px;
 background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.3));
 border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 20px;">
 <div style="width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></div>
 <span style="font-size: 11px; color: #22c55e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
 ${t('upToDate')}
 </span>
 </div>
 `
 }
 </div>
 <div style="display: flex; gap: 12px;">
 <button class="ytp-plus-button ytp-plus-button-primary" id="manual-update-check"
 style="flex: 1; padding: 12px; font-size: 13px; font-weight: 600;">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
 <path d="M21.5 2v6h-6M2.5 22v-6h6M19.13 11.48A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12c0 .34.02.67.05 1M4.87 12.52A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10 0-.34-.02-.67-.05-1"/>
 </svg>
 ${t('checkForUpdates')}
 </button>
 <button class="ytp-plus-button" id="open-update-page"
 style="padding: 12px 16px; font-size: 13px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2">
 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
 <polyline points="15,3 21,3 21,9"/>
 <line x1="10" y1="14" x2="21" y2="3"/>
 </svg>
 </button>
 </div>
 <style>
 @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
 </style>
 `;
 aboutSection.appendChild(updateContainer);
 const attachClickHandler = (id, handler) => {
 const element = document.getElementById(id);
 if (element) YouTubeUtils.cleanupManager.registerListener(element, 'click', handler);
 };
 attachClickHandler('manual-update-check', async ({ target }) => {
 const button = (target);
 const originalHTML = button.innerHTML;
 button.innerHTML = `
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
 style="margin-right: 6px; animation: spin 1s linear infinite;">
 <path d="M21.5 2v6h-6M2.5 22v-6h6M19.13 11.48A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12c0 .34.02.67.05 1M4.87 12.52A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10 0-.34-.02-.67-.05-1"/>
 </svg>
 ${t('checkingForUpdates')}
 `;
 button.disabled = true;
 await checkForUpdates(true);
 setTimeout(() => {
 button.innerHTML = originalHTML;
 button.disabled = false;
 }, 1000);
 });
 attachClickHandler('install-update-btn', () => {
 const success = installUpdate();
 if (success) {
 utils.showNotification(t('installing'));
 } else {
 utils.showNotification(t('manualInstallHint'), 'error', 5000);
 window.open('https://greasyfork.org/en/scripts/537017-youtube', '_blank');
 }
 });
 attachClickHandler('open-update-page', () => {
 utils.showNotification(t('updatePageFallback'));
 window.open('https://greasyfork.org/en/scripts/537017-youtube', '_blank');
 });
 };
 const setupUpdateChecks = () => {
 setTimeout(() => checkForUpdates(), 3000);
 const intervalId = setInterval(() => checkForUpdates(), UPDATE_CONFIG.checkInterval);
 YouTubeUtils.cleanupManager.registerInterval(intervalId);
 window.addEventListener('beforeunload', () => clearInterval(intervalId));
 };
 const handleSettingsModalMutation = (mutation, state) => {
 for (const node of mutation.addedNodes) {
 if (node instanceof Element && node.classList?.contains('ytp-plus-settings-modal')) {
 state.settingsObserved = true;
 setTimeout(addUpdateSettings, 100);
 return true;
 }
 }
 return false;
 };
 const handleAboutNavItemMutation = () => {
 const aboutNavItem = YouTubeUtils.querySelector(
 '.ytp-plus-settings-nav-item[data-section="about"].active:not([data-observed])'
 );
 if (aboutNavItem) {
 aboutNavItem.setAttribute('data-observed', '');
 setTimeout(addUpdateSettings, 50);
 }
 };
 const createSettingsObserver = () => {
 const state = { settingsObserved: false };
 const observer = new MutationObserver(mutations => {
 if (state.settingsObserved) return;
 for (const mutation of mutations) {
 if (handleSettingsModalMutation(mutation, state)) {
 return;
 }
 }
 handleAboutNavItemMutation();
 });
 return observer;
 };
 const setupSettingsObserver = () => {
 const observer = createSettingsObserver();
 YouTubeUtils.cleanupManager.registerObserver(observer);
 if (document.body) {
 observer.observe(document.body, { childList: true, subtree: true });
 } else {
 document.addEventListener('DOMContentLoaded', () => {
 observer.observe(document.body, { childList: true, subtree: true });
 });
 }
 };
 const setupAboutClickHandler = () => {
 const clickHandler = ({ target }) => {
 const el = (target);
 if (el.classList?.contains('ytp-plus-settings-nav-item') && el.dataset?.section === 'about') {
 setTimeout(addUpdateSettings, 50);
 }
 };
 YouTubeUtils.cleanupManager.registerListener(document, 'click', clickHandler, {
 passive: true,
 capture: true,
 });
 };
 const logInitialization = () => {
 try {
 if (window.YouTubeUtils && YouTubeUtils.logger && YouTubeUtils.logger.debug) {
 YouTubeUtils.logger.debug('YouTube + Update Checker initialized', {
 version: UPDATE_CONFIG.currentVersion,
 enabled: UPDATE_CONFIG.enabled,
 lastCheck: new Date(updateState.lastCheck).toLocaleString(),
 updateAvailable: updateState.updateAvailable,
 });
 }
 } catch {}
 };
 const init = () => {
 utils.loadSettings();
 setupUpdateChecks();
 setupSettingsObserver();
 setupAboutClickHandler();
 logInitialization();
 };
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
})();
(function () {
 try {
 const host = typeof location === 'undefined' ? '' : location.hostname;
 if (!host) return;
 if (!/(^|\.)youtube\.com$/.test(host) && !/\.youtube\.google/.test(host)) return;
 const css = `
#inline-preview-player {transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s !important; transform: scale(1) !important;}
#video-preview-container:has(#inline-preview-player) {transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; border-radius: 1.2em !important; overflow: hidden !important; transform: scale(1) !important;}
#video-preview-container:has(#inline-preview-player):hover {transform: scale(1.25) !important; box-shadow: #0008 0px 0px 60px !important; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 2s !important;}
ytd-app #content {opacity: 1 !important; transition: opacity 0.3s ease-in-out !important;}
ytd-app:has(#video-preview-container:hover) #content {opacity: 0.5 !important; transition: opacity 4s ease-in-out 1s !important;}
#page-manager, yt-searchbox {transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.35) !important;}
#masthead yt-searchbox button[aria-label="Search"] {display: none !important;}
.ytSearchboxComponentInputBox {border-radius: 2em !important;}
yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) {position: relative !important; left: 0vw !important; top: -30vh !important; height: 40px !important; max-width: 600px !important; transform: scale(1) !important;}
@media only screen and (min-width: 1400px) {yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) { height: 60px !important; max-width: 700px !important; transform: scale(1.1) !important;}
}
yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) .ytSearchboxComponentInputBox, yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) #i0 {background-color: #fffb !important; box-shadow: black 0 0 30px !important;}
@media (prefers-color-scheme: dark) {yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) .ytSearchboxComponentInputBox, yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) #i0 {background-color: #000b !important;}}
yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) #i0 {margin-top: 10px !important;}
@media only screen and (min-width: 1400px) {yt-searchbox:has(.ytSearchboxComponentInputBoxHasFocus) #i0 {margin-top: 30px !important;}}
.ytd-masthead #center:has(.ytSearchboxComponentInputBoxHasFocus) {height: 100vh !important; width: 100vw !important; left: 0 !important; top: 0 !important; position: fixed !important; justify-content: center !important; align-items: center !important;}
#content:has(.ytSearchboxComponentInputBoxHasFocus) #page-manager {filter: blur(20px) !important; transform: scale(1.05) !important;}
#voice-search-button {display: none !important;}
#masthead-container {#background.ytd-masthead {background-color: #00000000 !important;}}
ytd-mini-guide-renderer, [theater=""] #contentContainer::after {display: none !important;}
tp-yt-app-drawer > #contentContainer:not([opened=""]), #contentContainer:not([opened=""]) #guide-content, ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer {background-color: var(--yt-spec-text-primary-inverse) !important; background: var(--yt-spec-text-primary-inverse) !important;}
#content:not(:has(#contentContainer[opened=""])) #page-manager {margin-left: 0 !important;}
ytd-app:not([guide-persistent-and-visible=""]) tp-yt-app-drawer > #contentContainer {background-color: var(--yt-spec-text-primary-inverse) !important;}
ytd-alert-with-button-renderer {align-items: center !important; justify-content: center !important;}
ytd-guide-section-renderer:has([title="YouTube Premium"]),
ytd-guide-renderer #footer {display: none !important;}
ytd-guide-section-renderer, ytd-guide-collapsible-section-entry-renderer {border: none !important;}
.glass-dropdown{position:relative;display:inline-block;min-width:110px}
.glass-dropdown__toggle{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:6px 8px;border-radius:8px;background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));color:inherit;border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(8px) saturate(120%);-webkit-backdrop-filter:blur(8px) saturate(120%);cursor:pointer}
.glass-dropdown__toggle:focus{outline:2px solid rgba(255,255,255,0.06)}
.glass-dropdown__label{font-size:12px}
.glass-dropdown__chev{opacity:0.9}
.glass-dropdown__list{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:20000;display:none;margin:0;padding:6px;border-radius:10px;list-style:none;background:var(--yt-header-bg);border:1px solid rgba(255,255,255,0.06);box-shadow:0 8px 30px rgba(0,0,0,0.5);backdrop-filter:blur(10px) saturate(130%);-webkit-backdrop-filter:blur(10px) saturate(130%);max-height:220px;overflow:auto}
.glass-dropdown__item{padding:8px 10px;border-radius:6px;margin:4px 0;cursor:pointer;color:inherit;font-size:13px}
.glass-dropdown__item:hover{background:rgba(255,255,255,0.04)}
.glass-dropdown__item[aria-selected="true"]{background:linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));box-shadow:inset 0 0 0 1px rgba(255,255,255,0.02)}
`;
 const ID = 'ytp-zen-features-style';
 if (document.getElementById(ID)) return;
 const style = document.createElement('style');
 style.id = ID;
 style.appendChild(document.createTextNode(css));
 (document.head || document.documentElement).appendChild(style);
 } catch (err) {
 console.error('zen-youtube-features injection failed', err);
 }
})();
(function () {
 'use strict';
 const enhancedStyles = `
 ytmusic-app-layout[is-bauhaus-sidenav-enabled] #nav-bar-background.ytmusic-app-layout { border-bottom: none !important; box-shadow: none !important; }
 ytmusic-app-layout[is-bauhaus-sidenav-enabled] #nav-bar-divider.ytmusic-app-layout { border-top: none !important; }
 ytmusic-app-layout[is-bauhaus-sidenav-enabled] #mini-guide-background.ytmusic-app-layout { border-right: 0 !important; }
 ytmusic-nav-bar, ytmusic-app-layout[is-bauhaus-sidenav-enabled] .ytmusic-nav-bar { border: none !important; box-shadow: none !important; }
 ytmusic-settings-button.style-scope.ytmusic-nav-bar, ytmusic-nav-bar ytmusic-settings-button.style-scope.ytmusic-nav-bar {position: absolute !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; bottom: auto !important; margin: 0 !important; z-index: 1000 !important;}
 ytmusic-search-box, ytmusic-nav-bar ytmusic-search-box, ytmusic-searchbox, ytmusic-nav-bar ytmusic-searchbox {position: absolute !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; margin: 0 !important; max-width: 75% !important; width: auto !important; z-index: 900 !important;}
 ytmusic-search-box:has(input:focus), ytmusic-searchbox:has(input:focus), ytmusic-search-box:focus-within, ytmusic-searchbox:focus-within {position: fixed !important; left: 50% !important; top: 12vh !important; transform: translateX(-50%) !important; height: auto !important; max-width: 900px !important; width: min(90vw, 900px) !important; z-index: 1200 !important; display: block !important;}
 @media only screen and (min-width: 1400px) {ytmusic-search-box:has(input:focus), ytmusic-searchbox:has(input:focus) {top: 10vh !important; max-width: 1000px !important; transform: translateX(-50%) scale(1.05) !important;}}
 ytmusic-search-box:has(input:focus) input, ytmusic-searchbox:has(input:focus) input, ytmusic-search-box:focus-within input, ytmusic-searchbox:focus-within input {background-color: #fffb !important; box-shadow: black 0 0 30px !important;}
 @media (prefers-color-scheme: dark) {ytmusic-search-box:has(input:focus) input, ytmusic-searchbox:has(input:focus) input {background-color: #000b !important;}}
 ytmusic-app-layout:has(ytmusic-search-box:has(input:focus)) #main-panel, ytmusic-app-layout:has(ytmusic-searchbox:has(input:focus)) #main-panel {filter: blur(18px) !important; transform: scale(1.03) !important;}
 `;
 const hoverStyles = `
 .ytmusic-guide-renderer {opacity: 0.01 !important; transition: opacity 0.5s ease-in-out !important;}
 .ytmusic-guide-renderer:hover { opacity: 1 !important;}
 ytmusic-app[is-bauhaus-sidenav-enabled] #guide-wrapper.ytmusic-app {background-color: transparent !important; border: none !important;}
 `;
 const playerSidebarStyles = `
 #side-panel {width: 40em !important; height: 80vh !important; padding: 0 2em !important; right: -30em !important; top: 10vh !important; opacity: 0 !important; position: absolute !important; transition: all 0.3s ease-in-out !important; backdrop-filter: blur(5px) !important; background-color: #0005 !important; border-radius: 1em !important; box-shadow: rgba(0, 0, 0, 0.15) 0px -36px 30px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px !important;}
 #side-panel tp-yt-paper-tabs {transition: height 0.3s ease-in-out !important; height: 0 !important;}
 #side-panel:hover {right: 0 !important; opacity: 1 !important;}
 #side-panel:hover tp-yt-paper-tabs {height: 4em !important;}
 #side-panel:has(ytmusic-tab-renderer[page-type="MUSIC_PAGE_TYPE_TRACK_LYRICS"]):not(:has(ytmusic-message-renderer:not([style="display: none;"]))) {right: 0 !important; opacity: 1 !important;}
 #side-panel {min-width: auto !important;}
 #side-panel .ytmusic-top-button { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
 #side-panel .ytmusic-top-button {position: absolute !important; bottom: 20px !important; right: 20px !important; z-index: 1200 !important;}
 `;
 const centeredPlayerStyles = `
 ytmusic-app-layout:not([player-ui-state="FULLSCREEN"]) #main-panel {position: absolute !important; height: 70vh !important; max-width: 70vw !important; aspect-ratio: 1 !important; top: 50vh !important; left: 50vw !important; transform: translate(-50%, -50%) !important;}
 #player-page {padding: 0 !important; margin: 0 !important; left: 0 !important; top: 0 !important; height: 100% !important; width: 100% !important;}
 `;
 const playerBarStyles = `
 ytmusic-player-bar, #player-bar-background {margin: 1vw !important; width: 98vw !important; border-radius: 1em !important; overflow: hidden !important; transition: all 0.5s ease-in-out !important; background-color: #0002 !important; box-shadow: rgba(0, 0, 0, 0.15) 0px -36px 30px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px !important;}
 #layout:not([player-ui-state="PLAYER_PAGE_OPEN"]) #player-bar-background {background-color: #0005 !important;}
 `;
 const centeredPlayerBarStyles = `
 #left-controls {position: absolute !important; left: 49vw !important; bottom: 15px !important; transform: translateX(-50%) !important; width: fit-content !important; order: 1 !important;}
 .time-info {position: absolute !important; bottom: -10px !important; left: 0 !important; width: 100% !important; text-align: center !important; padding: 0 !important; margin: 0 !important;}
 .middle-controls {position: absolute !important; left: 1vw !important; bottom: 15px !important; max-width: 30vw !important; order: 0 !important;}
 `;
 const miniPlayerStyles = `
 #main-panel:has(ytmusic-player[player-ui-state="MINIPLAYER"]) {position: fixed !important; width: 100vw !important; height: 100vh !important; top: -100vh !important; left: 0 !important; margin: 0 !important; padding: 0 !important; transform: none !important; max-width: 100vw !important;}
 ytmusic-player[player-ui-state="MINIPLAYER"] {position: fixed !important; bottom: calc(100vh + 120px) !important; right: 30px !important; width: 350px !important; height: fit-content !important;}
 #av-id:has(ytmusic-av-toggle) {position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; top: -4em !important; opacity: 0 !important; transition: all 0.3s ease-in-out !important;}
 #av-id:has(ytmusic-av-toggle):hover {opacity: 1 !important;}
 #player[player-ui-state="MINIPLAYER"] {display: none !important;}
 #av-id {position: absolute !important; left: 50% !important; transform: translateX(-50%) translateZ(0) !important; top: -4em !important; z-index: 10000 !important; pointer-events: auto !important; display: block !important; visibility: visible !important; width: auto !important; height: auto !important; will-change: transform, opacity !important;}
 #av-id ytmusic-av-toggle {pointer-events: auto !important;}
 #av-id:hover {opacity: 1 !important;}
 #av-id:hover, #av-id:active { filter: none !important; }
 `;
 const scrollToTopStyles = `
 .ytmusic-top-button {position: fixed !important; bottom: 100px !important; right: 20px !important; width: 48px; height: 48px; background: rgba(255,255,255,.12); color: #fff; border: none; border-radius: 50%; cursor: pointer; display: flex !important; align-items: center; justify-content: center; z-index: 10000 !important; opacity: 0; visibility: hidden; transition: all .3s cubic-bezier(0.4, 0, 0.2, 1); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 8px 32px 0 rgba(31,38,135,.18); pointer-events: auto !important;}
 html[dark] .ytmusic-top-button {background: rgba(255,255,255,.15); border-color: rgba(255,255,255,.25);}
 html:not([dark]) .ytmusic-top-button {background: rgba(0,0,0,.08); color: #030303; border-color: rgba(0,0,0,.1);}
 .ytmusic-top-button:hover {background: rgba(255,255,255,.25); transform: translateY(-2px) scale(1.07); box-shadow: 0 8px 32px rgba(0,0,0,.35);}
 html[dark] .ytmusic-top-button:hover {background: rgba(255,255,255,.28);}
 html:not([dark]) .ytmusic-top-button:hover {background: rgba(0,0,0,.15);}
 .ytmusic-top-button.visible {opacity: 1 !important; visibility: visible !important;}
 .ytmusic-top-button.force-show {opacity: 1 !important; visibility: visible !important; display: flex !important;}
 .ytmusic-top-button svg {transition: transform .2s ease;}
 .ytmusic-top-button:hover svg {transform: translateY(-1px) scale(1.1);}
 .ytmusic-top-button:focus {outline: 2px solid rgba(255,255,255,0.5); outline-offset: 2px; box-shadow: 0 8px 32px rgba(0,0,0,.25);}
 .ytmusic-top-button:active {transform: translateY(0) scale(0.98);}
 @media (max-height: 600px) {.ytmusic-top-button {bottom: 80px !important;}}
 .ytmusic-top-button.top-button { }
 `;
 function applyStyles() {
 if (window.location.hostname !== 'music.youtube.com') {
 return;
 }
 const allStyles = `
 ${enhancedStyles}
 ${hoverStyles}
 ${playerSidebarStyles}
 ${centeredPlayerStyles}
 ${playerBarStyles}
 ${centeredPlayerBarStyles}
 ${miniPlayerStyles}
 ${scrollToTopStyles}
 `;
 if (typeof GM_addStyle === 'undefined') {
 const style = document.createElement('style');
 style.textContent = allStyles;
 document.head.appendChild(style);
 } else {
 GM_addStyle(allStyles);
 }
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Стили применены');
 }
 const _globalI18n_music =
 typeof window !== 'undefined' && window.YouTubePlusI18n ? window.YouTubePlusI18n : null;
 const getDebounce = () => {
 if (window.YouTubeUtils?.debounce) {
 return window.YouTubeUtils.debounce;
 }
 return (fn, delay) => {
 let timeoutId;
 return (...args) => {
 clearTimeout(timeoutId);
 timeoutId = setTimeout(() => fn(...args), delay);
 };
 };
 };
 const t = (key, params = {}) => {
 try {
 if (_globalI18n_music && typeof _globalI18n_music.t === 'function') {
 return _globalI18n_music.t(key, params);
 }
 if (
 typeof window !== 'undefined' &&
 window.YouTubeUtils &&
 typeof window.YouTubeUtils.t === 'function'
 ) {
 return window.YouTubeUtils.t(key, params);
 }
 } catch {
 }
 if (!key || typeof key !== 'string') return '';
 if (Object.keys(params).length === 0) return key;
 let result = key;
 for (const [k, v] of Object.entries(params)) result = result.split(`{${k}}`).join(String(v));
 return result;
 };
 function createButton() {
 const button = document.createElement('button');
 button.id = 'ytmusic-side-panel-top-button';
 button.className = 'ytmusic-top-button top-button';
 button.title = t('scrollToTop');
 button.setAttribute('aria-label', t('scrollToTop'));
 button.innerHTML =
 '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
 button.setAttribute('data-ytmusic-scroll-button', 'true');
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Button element created', {
 id: button.id,
 className: button.className,
 });
 return button;
 }
 const scrollContainerCache = new WeakMap();
 function findScrollContainer(sidePanel, MusicUtils) {
 if (scrollContainerCache.has(sidePanel)) {
 const cached = scrollContainerCache.get(sidePanel);
 if (
 cached &&
 document.body.contains(cached) &&
 cached.scrollHeight > cached.clientHeight + 10
 ) {
 return cached;
 }
 scrollContainerCache.delete(sidePanel);
 }
 if (MusicUtils.findScrollContainer) {
 const result = MusicUtils.findScrollContainer(sidePanel);
 if (result) scrollContainerCache.set(sidePanel, result);
 return result;
 }
 const selectors = [
 'ytmusic-tab-renderer[tab-identifier="FEmusic_queue"] #contents',
 'ytmusic-tab-renderer[tab-identifier="FEmusic_up_next"] #contents',
 'ytmusic-tab-renderer[tab-identifier="FEmusic_lyrics"] #contents',
 'ytmusic-tab-renderer[selected] #contents',
 'ytmusic-tab-renderer #contents',
 'ytmusic-queue-renderer #contents',
 'ytmusic-playlist-shelf-renderer #contents',
 '#side-panel #contents',
 '#contents.ytmusic-tab-renderer',
 '.ytmusic-section-list-renderer',
 '[role="tabpanel"]',
 '.ytmusic-player-queue',
 'ytmusic-tab-renderer',
 '.scroller',
 '[scroll-container]',
 ];
 for (const selector of selectors) {
 const container = sidePanel?.querySelector(selector);
 if (container) {
 const isScrollable = container.scrollHeight > container.clientHeight + 10;
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Checking ${selector}: scrollHeight=${container.scrollHeight}, clientHeight=${container.clientHeight}, isScrollable=${isScrollable}`
 );
 if (isScrollable) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `✓ Found scroll container: ${selector}`
 );
 scrollContainerCache.set(sidePanel, container);
 return container;
 }
 }
 }
 if (sidePanel && sidePanel.scrollHeight > sidePanel.clientHeight + 10) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 '✓ Using side-panel as scroll container'
 );
 scrollContainerCache.set(sidePanel, sidePanel);
 return sidePanel;
 }
 if (sidePanel) {
 const allElements = Array.from(sidePanel.querySelectorAll('*'));
 let best = null;
 let bestScore = 0;
 for (const el of allElements) {
 try {
 const sh = el.scrollHeight || 0;
 const ch = el.clientHeight || 0;
 const delta = sh - ch;
 if (delta <= 10) continue;
 const style = window.getComputedStyle?.(el) || {};
 const overflowY = (style.overflowY || '').toLowerCase();
 let score = delta;
 if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
 score += 100000;
 }
 if (el.getAttribute && el.getAttribute('role') === 'tabpanel') {
 score += 5000;
 }
 if (score > bestScore) {
 bestScore = score;
 best = el;
 }
 } catch {
 }
 }
 if (best) {
 const tag = best.tagName.toLowerCase();
 const id = best.id ? `#${best.id}` : '';
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `✓ Best scroll container chosen: ${tag}${id}`,
 { scrollHeight: best.scrollHeight, clientHeight: best.clientHeight, score: bestScore }
 );
 scrollContainerCache.set(sidePanel, best);
 return best;
 }
 }
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 '✗ No scroll container found. Available elements:',
 Array.from(sidePanel?.querySelectorAll('*') || [])
 .map(el => {
 let classes = '';
 try {
 if (typeof el.className === 'string') {
 const s = el.className.trim();
 classes = s ? '.' + s.split(/\s+/).join('.') : '';
 } else if (el.classList && typeof el.classList === 'object') {
 const list = Array.from(el.classList).filter(Boolean);
 classes = list.length ? '.' + list.join('.') : '';
 }
 } catch {
 classes = '';
 }
 const scrollInfo =
 el.scrollHeight > el.clientHeight
 ? ` [scrollable: ${el.scrollHeight}/${el.clientHeight}]`
 : '';
 return el.tagName + (el.id ? `#${el.id}` : '') + classes + scrollInfo;
 })
 .slice(0, 30)
 );
 return null;
 }
 function setupScrollBehavior(button, sc, MusicUtils, sidePanel) {
 if (MusicUtils.setupScrollToTop) {
 MusicUtils.setupScrollToTop(button, sc);
 return;
 }
 const findNearestScrollable = startEl => {
 let el = startEl;
 while (el && el !== document.body) {
 try {
 if (el.scrollHeight > el.clientHeight + 10) return el;
 } catch {
 }
 el = el.parentElement;
 }
 return null;
 };
 const clickHandler = ev => {
 try {
 ev.preventDefault?.();
 } catch {}
 try {
 ev.stopPropagation?.();
 } catch {}
 let target = sc;
 if (!target || !(target.scrollHeight > target.clientHeight + 1)) {
 target = sidePanel && findNearestScrollable(sidePanel);
 }
 if (!target) {
 target = findNearestScrollable(button.parentElement);
 }
 if (!target) {
 target = document.scrollingElement || document.documentElement || document.body;
 }
 try {
 const info = {
 chosen: target && (target.id || target.tagName || '(window)'),
 scrollTop: target && 'scrollTop' in target ? target.scrollTop : null,
 scrollHeight: target && 'scrollHeight' in target ? target.scrollHeight : null,
 clientHeight: target && 'clientHeight' in target ? target.clientHeight : null,
 };
 try {
 window.YouTubeMusic = window.YouTubeMusic || {};
 window.YouTubeMusic._lastClickDebug = info;
 } catch {}
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'ScrollToTop click target', info);
 } catch {}
 const tryScroll = el => {
 if (!el) return false;
 try {
 if (typeof el.scrollTo === 'function') {
 el.scrollTo({ top: 0, behavior: 'smooth' });
 return true;
 }
 if ('scrollTop' in el) {
 el.scrollTop = 0;
 return true;
 }
 } catch {
 }
 return false;
 };
 let scrolled = false;
 scrolled = tryScroll(target) || scrolled;
 if (sc && sc !== target) scrolled = tryScroll(sc) || scrolled;
 scrolled =
 tryScroll(document.scrollingElement || document.documentElement || document.body) ||
 scrolled;
 if (!scrolled) {
 try {
 window.scrollTo(0, 0);
 } catch (err2) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Final scroll fallback failed',
 err2
 );
 }
 }
 };
 button.addEventListener('click', clickHandler, { passive: false });
 }
 function setupButtonPosition(button, sidePanel, MusicUtils, options = {}) {
 if (MusicUtils.setupButtonStyles) {
 MusicUtils.setupButtonStyles(button, sidePanel, options);
 return;
 }
 if (options.insideSidePanel && sidePanel) {
 button.style.setProperty('position', 'absolute', 'important');
 button.style.setProperty('bottom', '20px', 'important');
 button.style.setProperty('right', '20px', 'important');
 button.style.setProperty('z-index', '1200', 'important');
 button.style.setProperty('pointer-events', 'auto', 'important');
 button.style.display = 'flex';
 } else {
 button.style.position = 'fixed';
 button.style.bottom = '100px';
 button.style.right = '20px';
 button.style.zIndex = '10000';
 button.style.pointerEvents = 'auto';
 button.style.display = 'flex';
 }
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Button positioned:', {
 position: button.style.position,
 bottom: button.style.bottom,
 right: button.style.right,
 zIndex: button.style.zIndex,
 insideSidePanel: !!options.insideSidePanel,
 });
 }
 function setupScrollVisibility(button, sc, MusicUtils) {
 if (window.YouTubePlusScrollManager && window.YouTubePlusScrollManager.addScrollListener) {
 try {
 const cleanup = window.YouTubePlusScrollManager.addScrollListener(
 sc,
 () => {
 const shouldShow = sc.scrollTop > 100;
 button.classList.toggle('visible', shouldShow);
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Scroll position: ${sc.scrollTop}px, button visible: ${shouldShow}`
 );
 },
 { debounce: 100, runInitial: true }
 );
 button._scrollCleanup = cleanup;
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Using ScrollManager for scroll handling'
 );
 return;
 } catch {
 console.error('[YouTube+][Music] ScrollManager failed, using fallback');
 }
 }
 if (MusicUtils.setupScrollVisibility) {
 MusicUtils.setupScrollVisibility(button, sc, 100);
 return;
 }
 let isTabVisible = !document.hidden;
 let rafId = null;
 const updateVisibility = () => {
 if (rafId) {
 cancelAnimationFrame(rafId);
 }
 rafId = requestAnimationFrame(() => {
 if (!isTabVisible) return;
 const currentScroll = sc.scrollTop || 0;
 const shouldShow = currentScroll > 100;
 const wasVisible = button.classList.contains('visible');
 button.classList.toggle('visible', shouldShow);
 if (shouldShow !== wasVisible) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Button visibility changed: ${shouldShow ? 'SHOWN' : 'HIDDEN'} (scroll: ${currentScroll}px)`
 );
 }
 });
 };
 const debounce = getDebounce();
 const scrollHandler = debounce(updateVisibility, 100);
 const visibilityHandler = () => {
 isTabVisible = !document.hidden;
 if (isTabVisible) {
 updateVisibility();
 }
 };
 sc.addEventListener('scroll', scrollHandler, { passive: true });
 document.addEventListener('visibilitychange', visibilityHandler);
 setTimeout(updateVisibility, 100);
 setTimeout(updateVisibility, 500);
 button._scrollCleanup = () => {
 if (rafId) cancelAnimationFrame(rafId);
 sc.removeEventListener('scroll', scrollHandler);
 document.removeEventListener('visibilitychange', visibilityHandler);
 };
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Using fallback scroll handler');
 }
 function attachButtonToContainer(button, sidePanel, sc, MusicUtils) {
 try {
 setupScrollBehavior(button, sc, MusicUtils, sidePanel);
 const attachInsidePanel = !!sidePanel;
 setupButtonPosition(button, sidePanel, MusicUtils, { insideSidePanel: attachInsidePanel });
 document.body.appendChild(button);
 if (attachInsidePanel) {
 try {
 sidePanel.appendChild(button);
 } catch (err) {
 document.body.appendChild(button);
 void err;
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Appending to sidePanel failed, appended to body',
 err
 );
 }
 } else {
 document.body.appendChild(button);
 }
 setupScrollVisibility(button, sc, MusicUtils);
 const initialScroll = sc.scrollTop || 0;
 if (initialScroll > 100) {
 button.classList.add('visible');
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Button shown immediately (scroll: ${initialScroll}px)`
 );
 }
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Scroll to top button created successfully',
 {
 buttonId: button.id,
 scrollContainer: sc.tagName,
 scrollContainerId: sc.id || 'no-id',
 scrollHeight: sc.scrollHeight,
 clientHeight: sc.clientHeight,
 scrollTop: initialScroll,
 position: button.style.position,
 computedDisplay: window.getComputedStyle(button).display,
 computedOpacity: window.getComputedStyle(button).opacity,
 computedVisibility: window.getComputedStyle(button).visibility,
 }
 );
 } catch (err) {
 console.error('[YouTube+][Music] attachButton error:', err);
 }
 }
 const buttonCreationState = {
 attempts: 0,
 maxAttempts: 5,
 lastAttempt: 0,
 minInterval: 500,
 };
 function createScrollToTopButton() {
 try {
 if (window.location.hostname !== 'music.youtube.com') return;
 const existingButton = document.getElementById('ytmusic-side-panel-top-button');
 if (existingButton) {
 if (document.body.contains(existingButton) && existingButton._scrollCleanup) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Button already exists and is properly attached'
 );
 return;
 } else {
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Removing orphaned button');
 existingButton.remove();
 }
 }
 const now = Date.now();
 if (now - buttonCreationState.lastAttempt < buttonCreationState.minInterval) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Rate limited, skipping button creation'
 );
 return;
 }
 buttonCreationState.attempts++;
 buttonCreationState.lastAttempt = now;
 if (buttonCreationState.attempts > buttonCreationState.maxAttempts) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Max attempts (${buttonCreationState.maxAttempts}) reached, stopping retries`
 );
 return;
 }
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 `Creating button (attempt ${buttonCreationState.attempts}/${buttonCreationState.maxAttempts})`
 );
 const sidePanel = document.querySelector('#side-panel');
 const MusicUtils = window.YouTubePlusMusicUtils || {};
 const button = createButton();
 if (!sidePanel) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'No side-panel found, checking for main content or queue'
 );
 const queueRenderer = document.querySelector('ytmusic-queue-renderer');
 if (queueRenderer) {
 const queueContents = queueRenderer.querySelector('#contents');
 if (queueContents) {
 attachButtonToContainer(button, queueRenderer, queueContents, MusicUtils);
 buttonCreationState.attempts = 0;
 return;
 }
 }
 const mainContent = document.querySelector('ytmusic-browse');
 if (mainContent) {
 const scrollContainer = mainContent.querySelector('ytmusic-section-list-renderer');
 if (scrollContainer) {
 attachButtonToContainer(button, mainContent, scrollContainer, MusicUtils);
 buttonCreationState.attempts = 0;
 return;
 }
 }
 setTimeout(createScrollToTopButton, 1000);
 return;
 }
 const scrollContainer = findScrollContainer(sidePanel, MusicUtils);
 if (!scrollContainer) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'No scroll container found, will retry with backoff'
 );
 const backoffDelay = Math.min(500 * buttonCreationState.attempts, 3000);
 setTimeout(createScrollToTopButton, backoffDelay);
 return;
 }
 attachButtonToContainer(button, sidePanel, scrollContainer, MusicUtils);
 buttonCreationState.attempts = 0;
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', '✓ Button created successfully');
 } catch (error) {
 console.error('[YouTube+][Music] Error creating scroll to top button:', error);
 if (buttonCreationState.attempts < buttonCreationState.maxAttempts) {
 setTimeout(createScrollToTopButton, 1000);
 }
 }
 }
 function checkAndCreateButton() {
 try {
 const existingButton = document.getElementById('ytmusic-side-panel-top-button');
 if (existingButton) {
 if (!existingButton._scrollCleanup || !document.body.contains(existingButton)) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Cleaning up orphaned/detached button'
 );
 if (existingButton._scrollCleanup) {
 try {
 existingButton._scrollCleanup();
 } catch {
 }
 }
 if (existingButton._positionCleanup) {
 try {
 existingButton._positionCleanup();
 } catch {
 }
 }
 existingButton.remove();
 } else {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Button is healthy, no action needed'
 );
 return;
 }
 }
 const sidePanel = document.querySelector('#side-panel');
 const mainContent = document.querySelector('ytmusic-browse');
 const queueRenderer = document.querySelector('ytmusic-queue-renderer');
 const tabRenderer = document.querySelector('ytmusic-tab-renderer[tab-identifier]');
 if (sidePanel || mainContent || queueRenderer || tabRenderer) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Found container, scheduling button creation'
 );
 setTimeout(createScrollToTopButton, 300);
 } else {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'No suitable container found yet'
 );
 }
 } catch (error) {
 console.error('[YouTube+][Music] Error in checkAndCreateButton:', error);
 }
 }
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', () => {
 applyStyles();
 checkAndCreateButton();
 });
 } else {
 applyStyles();
 checkAndCreateButton();
 }
 const originalPushState = history.pushState;
 const originalReplaceState = history.replaceState;
 const debounce = getDebounce();
 const handleNavigation = debounce(() => {
 applyStyles();
 buttonCreationState.attempts = 0;
 buttonCreationState.lastAttempt = 0;
 checkAndCreateButton();
 }, 150);
 history.pushState = function (...args) {
 originalPushState.call(this, ...args);
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Navigation: pushState');
 handleNavigation();
 };
 history.replaceState = function (...args) {
 originalReplaceState.call(this, ...args);
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Navigation: replaceState');
 handleNavigation();
 };
 window.addEventListener('popstate', () => {
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Navigation: popstate');
 handleNavigation();
 });
 window.addEventListener('yt-navigate-finish', () => {
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Navigation: yt-navigate-finish');
 handleNavigation();
 });
 let observer = null;
 const createObserver = () => {
 const debounce = getDebounce();
 const debouncedCheck = debounce(checkAndCreateButton, 250);
 let lastCheckTime = 0;
 const minCheckInterval = 500;
 return new MutationObserver(mutations => {
 const now = Date.now();
 if (now - lastCheckTime < minCheckInterval) return;
 const existingButton = document.getElementById('ytmusic-side-panel-top-button');
 if (
 existingButton &&
 document.body.contains(existingButton) &&
 existingButton._scrollCleanup
 ) {
 return;
 }
 const hasRelevantChange = mutations.some(mutation => {
 if (mutation.addedNodes.length === 0) return false;
 let hasElements = false;
 for (let i = 0; i < mutation.addedNodes.length; i++) {
 if (mutation.addedNodes[i].nodeType === 1) {
 hasElements = true;
 break;
 }
 }
 if (!hasElements) return false;
 return Array.from(mutation.addedNodes).some(node => {
 if (node.nodeType !== 1) return false;
 const element = (node);
 if (element.id === 'side-panel' || element.id === 'contents') return true;
 const tagName = element.tagName;
 if (
 tagName === 'YTMUSIC-BROWSE' ||
 tagName === 'YTMUSIC-PLAYER-PAGE' ||
 tagName === 'YTMUSIC-QUEUE-RENDERER' ||
 tagName === 'YTMUSIC-TAB-RENDERER'
 ) {
 return true;
 }
 return (
 element.querySelector?.(
 '#side-panel, #contents, ytmusic-browse, ytmusic-queue-renderer, ytmusic-tab-renderer'
 ) != null
 );
 });
 });
 const hasTabChange = mutations.some(
 mutation =>
 mutation.type === 'attributes' &&
 mutation.attributeName === 'selected' &&
 mutation.target instanceof Element &&
 mutation.target.matches?.('ytmusic-tab-renderer, tp-yt-paper-tab')
 );
 if (hasRelevantChange || hasTabChange) {
 lastCheckTime = now;
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Detected relevant DOM change, checking button'
 );
 debouncedCheck();
 }
 });
 };
 const observeDocumentBodySafely = () => {
 if (observer) return;
 const startObserving = () => {
 if (!document.body) return;
 try {
 observer = createObserver();
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 attributes: true,
 attributeFilter: ['selected', 'tab-identifier', 'page-type'],
 });
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 '✓ Observer started with enhanced config'
 );
 } catch (observeError) {
 console.error('[YouTube+][Music] Failed to observe document.body:', observeError);
 try {
 observer = createObserver();
 observer.observe(document.body, {
 childList: true,
 subtree: true,
 });
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 '✓ Observer started with basic config'
 );
 } catch (retryError) {
 console.error('[YouTube+][Music] Failed to start observer (retry):', retryError);
 }
 }
 };
 if (document.body) {
 startObserving();
 } else {
 document.addEventListener('DOMContentLoaded', startObserving, { once: true });
 }
 };
 if (typeof window !== 'undefined') {
 window.YouTubeMusic = {
 observeDocumentBodySafely,
 checkAndCreateButton,
 createScrollToTopButton,
 version: '2.3',
 };
 }
 observeDocumentBodySafely();
 const healthCheckInterval = setInterval(() => {
 try {
 if (document.hidden) return;
 const button = document.getElementById('ytmusic-side-panel-top-button');
 if (button && (!button._scrollCleanup || !document.body.contains(button))) {
 window.YouTubeUtils?.logger?.debug?.(
 '[YouTube+][Music]',
 'Health check: removing unhealthy button'
 );
 button.remove();
 checkAndCreateButton();
 }
 if (!button) {
 const sidePanel = document.querySelector('#side-panel');
 if (sidePanel) {
 checkAndCreateButton();
 }
 }
 } catch (error) {
 console.error('[YouTube+][Music] Health check error:', error);
 }
 }, 30000);
 window.addEventListener('beforeunload', () => {
 try {
 clearInterval(healthCheckInterval);
 if (observer) {
 observer.disconnect();
 observer = null;
 }
 const button = document.getElementById('ytmusic-side-panel-top-button');
 if (button?._scrollCleanup) {
 try {
 button._scrollCleanup();
 } catch (cleanupError) {
 console.error('[YouTube+][Music] Button cleanup error:', cleanupError);
 }
 }
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Cleanup completed');
 } catch (error) {
 console.error('[YouTube+][Music] Cleanup error:', error);
 }
 });
 window.YouTubeUtils?.logger?.debug?.('[YouTube+][Music]', 'Module loaded', {
 version: '2.3',
 features: ['scroll-to-top', 'enhanced-styles', 'immersive-search', 'health-check'],
 hostname: window.location.hostname,
 });
})();