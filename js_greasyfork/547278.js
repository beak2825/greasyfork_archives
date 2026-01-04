// ==UserScript==
// @name         Chaturbate Enhancer (compat build)
// @namespace    http://tampermonkey.net/
// @version      5.3.8
// @description  Lag fixes, safer observers, ES2018 syntax, seamless loading, no notification spam
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @match        https://auth.camschedule.com/
// @match        https://*.camschedule.com/*
// @run-at       document-start
// @author       shadow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547278/Chaturbate%20Enhancer%20%28compat%20build%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547278/Chaturbate%20Enhancer%20%28compat%20build%29.meta.js
// ==/UserScript==
console.log("✅ Enhancer userscript loaded");
(function () {
  'use strict';

  /***********************
   * Configuration & Constants
   ***********************/
  const CONFIG = Object.freeze({
    STORAGE: Object.freeze({
      PREFIX: 'chaturbateEnhancer:',
      HIDDEN_KEY: 'hiddenModels',
      TOKENS_KEY: 'tokensSpent',
      SETTINGS_KEY: 'settings',
      BACKUP_KEY: 'backup'
    }),
    TIMERS: Object.freeze({
      TOKEN_MONITOR_RETRY_DELAY: 500,
      TOKEN_MONITOR_MAX_RETRIES: 20,
      CHAT_TIMESTAMP_INTERVAL: 1000,
      PATH_CHECK_INTERVAL: 900,
      MUTATION_DEBOUNCE: 150
    }),
    SELECTORS: Object.freeze({
      ROOM_CARDS: 'li.roomCard.camBgColor',
      TOKEN_BALANCE_SELECTORS: ['span.balance', 'span.token_balance', 'span.tokencount'],
      SCAN_CAMS: '[data-testid="scan-cams"]',
      CHAT_MESSAGES: '[data-testid="chat-message"]',
      CHAT_USERNAME: '[data-testid="chat-message-username"]',
      ROOM_NOTICE: '[data-testid="room-notice-viewport"]'
    }),
EXTERNAL_LINKS: Object.freeze({
  RECU_ME: 'https://recu.me/performer/',
  CAMWHORES_TV: 'https://www.camwhores.tv/search/',
  CAMGIRLFINDER: 'https://camgirlfinder.net/models/cb/'
})
  });

  /* ======================
     Inject Critical Styles Early
     ====================== */
  function injectCriticalStyles() {
    try {
      const style = document.createElement('style');
      style.textContent = `
        /* Hide gender tabs if enabled */
        a.gender-tab[href*="/trans-cams/"], a[href*="/male-cams"], a[href*="/trans-cams"], li a#merch, li a#merch + li {
          display: none !important;
        }

        /* Ensure grid layout is applied early */
        ul.list.endless_page_template.show-location {
          display: grid !important;
          gap: 12px !important;
        }
        ul.list.endless_page_template.show-location li.roomCard.camBgColor {
          width: 100% !important;
          max-width: 100% !important;
          position: relative !important;
        }
        ul.list.endless_page_template.show-location li.roomCard.camBgColor img {
          width: 100% !important;
          height: auto !important;
          object-fit: cover !important;
        }

        /* Hide model buttons (to be shown after script applies them) */
        .hide-model-button {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          cursor: pointer;
          font-size: 13px;
          font-weight: bold;
          line-height: 1;
          transition: background 0.2s;
          display: none;
        }
        .hide-model-button:hover, .hide-model-button:focus {
          background: rgba(220, 38, 38, 0.85);
        }

        /* Temporary loading overlay */
        .chaturbate-loading-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 99999;
          opacity: 1;
          transition: opacity 0.3s ease-out;
        }
        .chaturbate-loading-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    } catch (e) {
      console.error('[ChaturbateEnhancer] Failed to inject critical styles:', e);
    }
  }

  // Inject critical styles immediately
  injectCriticalStyles();

  /* ======================
     Loading Overlay
     ====================== */
  function addLoadingOverlay() {
    try {
      const overlay = document.createElement('div');
      overlay.className = 'chaturbate-loading-overlay';
      (document.body || document.documentElement).appendChild(overlay);
      return overlay;
    } catch (e) {
      console.error('[ChaturbateEnhancer] Failed to add loading overlay:', e);
      return null;
    }
  }

  function removeLoadingOverlay(overlay) {
    try {
      if (overlay && overlay.parentNode) {
        overlay.classList.add('hidden');
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
      }
    } catch (e) {
      console.error('[ChaturbateEnhancer] Failed to remove loading overlay:', e);
    }
  }

  /* ======================
     Logger (robust & safe)
     ====================== */
  class Logger {
    constructor(maxErrors = 200) {
      if (Logger._inst) return Logger._inst;
      Logger._inst = this;
      this.errors = [];
      this.maxErrors = maxErrors;
    }
    static getInstance() { return new Logger(); }
    _fmt(msg) { return `[ChaturbateEnhancer ${new Date().toISOString()}] ${msg}`; }
    log(level, message, obj = null) {
      try {
        const formatted = this._fmt(message);
        const extra = obj || '';
        if (level === 'error') console.error(formatted, extra);
        else if (level === 'warn') console.warn(formatted, extra);
        else if (level === 'info') console.info(formatted, extra);
        else console.debug(formatted, extra);

        if (level === 'error' && this.errors.length < this.maxErrors) {
          this.errors.push({ ts: Date.now(), message, extra: obj ? (obj.stack || String(obj)) : null });
        }
      } catch (e) { /* don't break app on logging failure */ }
    }
    error(m, o) { this.log('error', m, o); }
    warn(m, o) { this.log('warn', m, o); }
    info(m, o) { this.log('info', m, o); }
    debug(m, o) { this.log('debug', m, o); }
  }
  Logger._inst = null;
  const logger = Logger.getInstance();

  /* ======================
     Utils (stable helpers)
     ====================== */
  const Utils = {
    getCurrentModelFromPath() {
      try {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length !== 1) return null;
        const segment = parts[0];
        if (segment.includes('-') ||
            segment === 'female' ||
            segment === 'male' ||
            segment === 'couple' ||
            segment === 'trans') {
          return null;
        }
        return segment;
      } catch (e) {
        logger.error('getCurrentModelFromPath failed', e);
        return null;
      }
    },
    safeParseInt(str) {
      try { const s = String(str || '').replace(/[^\d\-]/g, ''); const n = parseInt(s, 10); return Number.isNaN(n) ? 0 : n; }
      catch (e) { logger.error('safeParseInt', e); return 0; }
    },
    safeString(val, fallback = '') {
      try { return String(val || '').trim(); } catch { return fallback; }
    },
    isObject(val) { return val && typeof val === 'object' && !Array.isArray(val); },
    createElement(tag, className = '', attrs = {}) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      for (const k in (attrs || {})) {
        const v = attrs[k];
        if (k === 'textContent' || k === 'innerHTML') el[k] = v;
        else if (k.startsWith('data-') || ['id','href','title','aria-label','role','type','value','style'].includes(k)) el.setAttribute(k, v);
        else el[k] = v;
      }
      return el;
    },
    findElement(selectors = [], ctx = document) {
      for (let i=0;i<selectors.length;i++) {
        try {
          const el = ctx.querySelector(selectors[i]);
          if (el) return el;
        } catch {}
      }
      return null;
    },
    debounce(fn, wait = 100) {
      let t = null;
      return function() {
        const args = arguments, self = this;
        clearTimeout(t);
        t = setTimeout(() => { try { fn.apply(self, args); } catch (err) { logger.error('debounce handler error', err); } }, wait);
      };
    },
    throttle(fn, limit = 200) {
      let last = 0;
      return function() {
        const now = Date.now();
        if (now - last >= limit) {
          last = now;
          try { fn.apply(this, arguments); } catch (err) { logger.error('throttle handler error', err); }
        }
      };
    },
    safeJSONParse(raw, fallback = null) { try { return JSON.parse(raw); } catch { return fallback; } },
    downloadAsFile(content, filename = 'export.json') {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = Utils.createElement('a', '', { href: url });
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  // Define SVG icons
  const gGridIconSvg2 = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" fill="#3b82f6"/>
      <rect x="9" y="1" width="6" height="6" fill="#f97316"/>
      <rect x="1" y="9" width="6" height="6" fill="#3b82f6"/>
      <rect x="9" y="9" width="6" height="6" fill="#f97316"/>
    </svg>
  `;

  const gGridIconSvg3 = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="4" height="4" fill="#3b82f6"/>
      <rect x="6" y="1" width="4" height="4" fill="#f97316"/>
      <rect x="11" y="1" width="4" height="4" fill="#3b82f6"/>
      <rect x="1" y="6" width="4" height="4" fill="#f97316"/>
      <rect x="6" y="6" width="4" height="4" fill="#3b82f6"/>
      <rect x="11" y="6" width="4" height="4" fill="#f97316"/>
      <rect x="1" y="11" width="4" height="4" fill="#3b82f6"/>
      <rect x="6" y="11" width="4" height="4" fill="#f97316"/>
      <rect x="11" y="11" width="4" height="4" fill="#3b82f6"/>
    </svg>
  `;

  const gGridIconSvg4 = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="3" height="3" fill="#3b82f6"/>
      <rect x="5" y="1" width="3" height="3" fill="#f97316"/>
      <rect x="9" y="1" width="3" height="3" fill="#3b82f6"/>
      <rect x="13" y="1" width="3" height="3" fill="#f97316"/>
      <rect x="1" y="5" width="3" height="3" fill="#f97316"/>
      <rect x="5" y="5" width="3" height="3" fill="#3b82f6"/>
      <rect x="9" y="5" width="3" height="3" fill="#f97316"/>
      <rect x="13" y="5" width="3" height="3" fill="#3b82f6"/>
      <rect x="1" y="9" width="3" height="3" fill="#3b82f6"/>
      <rect x="5" y="9" width="3" height="3" fill="#f97316"/>
      <rect x="9" y="9" width="3" height="3" fill="#3b82f6"/>
      <rect x="13" y="9" width="3" height="3" fill="#f97316"/>
      <rect x="1" y="13" width="3" height="3" fill="#f97316"/>
      <rect x="5" y="13" width="3" height="3" fill="#3b82f6"/>
      <rect x="9" y="13" width="3" height="3" fill="#f97316"/>
      <rect x="13" y="13" width="3" height="3" fill="#3b82f6"/>
    </svg>
  `;

  const gGridIconSvg6 = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="2" height="2" fill="#3b82f6"/>
      <rect x="4" y="1" width="2" height="2" fill="#f97316"/>
      <rect x="7" y="1" width="2" height="2" fill="#3b82f6"/>
      <rect x="10" y="1" width="2" height="2" fill="#f97316"/>
      <rect x="13" y="1" width="2" height="2" fill="#3b82f6"/>
      <rect x="1" y="4" width="2" height="2" fill="#f97316"/>
      <rect x="4" y="4" width="2" height="2" fill="#3b82f6"/>
      <rect x="7" y="4" width="2" height="2" fill="#f97316"/>
      <rect x="10" y="4" width="2" height="2" fill="#3b82f6"/>
      <rect x="13" y="4" width="2" height="2" fill="#f97316"/>
    </svg>
  `;


/* =========================
   GridManager
   ========================= */
class GridManager {
  static init() {
    try {
      if (Utils.getCurrentModelFromPath()) return; // Skip model pages
      if (document.querySelector("#grid-size-controls")) return; // Prevent re-initialization
      const saved = Utils.safeParseInt(localStorage.getItem("chaturbateEnhancer:gridCols"));
      const defaultCols = saved > 0 ? saved : 4; // Default to 4 columns if no saved value
      // Apply grid size after DOM is ready
      GridManager.applyGridWhenReady(defaultCols);
      // Set up grid control buttons
      const container = Utils.findElement(["ul.advanced-search-button-container", "ul.top-nav", "nav ul", "ul#nav"]);
      if (!container) return;
      const li = Utils.createElement("li", "", { id: "grid-size-controls" });
      const wrap = Utils.createElement("div", "grid-buttons-wrap");
      li.appendChild(wrap);
      const iconOptions = [
        { cols: 2, svg: gGridIconSvg2, title: "Large thumbnails (2 columns)" },
        { cols: 3, svg: gGridIconSvg3, title: "Medium thumbnails (3 columns)" },
        { cols: 4, svg: gGridIconSvg4, title: "Small thumbnails (4 columns)" },
        { cols: 6, svg: gGridIconSvg6, title: "Extra small thumbnails (6 columns)" },
      ];
      iconOptions.forEach(opt => {
        const btn = Utils.createElement("button", "grid-btn", {
          type: "button",
          title: opt.title,
          innerHTML: opt.svg,
          style: "margin: 0 4px;"
        });
        if (defaultCols === opt.cols) {
          btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
          wrap.querySelectorAll(".grid-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          GridManager.setColumns(opt.cols, false); // Notify on user action
        });
        wrap.appendChild(btn);
      });
      const filterDiv = container.querySelector('div[data-testid="filter-button"]');
      if (filterDiv) {
        container.insertBefore(li, filterDiv);
      } else {
        container.appendChild(li);
      }
    } catch (e) {
      logger.error("GridManager.init failed", e);
    }
  }

  static applyGridWhenReady(cols) {
    const applyGrid = () => {
      const grid = document.querySelector("ul.list.endless_page_template.show-location");
      if (grid) {
        GridManager.setColumns(cols, true); // Silent mode for initial load
        if (GridManager.observer) {
          GridManager.observer.disconnect();
          GridManager.observer = null;
        }
      }
    };
    // Try applying immediately
    applyGrid();
    // If grid not found, set up observer to wait for it
    if (!document.querySelector("ul.list.endless_page_template.show-location")) {
      GridManager.observer = new MutationObserver((mutations, observer) => {
        if (document.querySelector("ul.list.endless_page_template.show-location")) {
          applyGrid();
        }
      });
      GridManager.observer.observe(document.body, { childList: true, subtree: true });
      // Fallback: stop observer after 5 seconds
      setTimeout(() => {
        if (GridManager.observer) {
          GridManager.observer.disconnect();
          GridManager.observer = null;
        }
      }, 5000);
    }
  }

  static setColumns(cols, silent = false) {
    try {
      const grid = document.querySelector("ul.list.endless_page_template.show-location");
      if (grid) {
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gap = "12px";
        const cards = grid.querySelectorAll("li.roomCard.camBgColor");
        cards.forEach(card => {
          card.style.width = "100%";
          card.style.maxWidth = "100%";
        });
        const thumbs = grid.querySelectorAll("li.roomCard.camBgColor img");
        thumbs.forEach(img => {
          img.style.width = "100%";
          img.style.height = "auto";
          img.style.objectFit = "cover";
        });
      }
      localStorage.setItem("chaturbateEnhancer:gridCols", cols);
      if (!silent) {
        NotificationManager.show(`Grid set to ${cols} columns`, "success");
      }
    } catch (e) {
      logger.error("GridManager.setColumns failed", e);
    }
  }

  static restoreGridIfNeeded() {
    try {
      const saved = Utils.safeParseInt(localStorage.getItem("chaturbateEnhancer:gridCols"));
      const cols = saved > 0 ? saved : 4; // Default to 4 columns
      GridManager.applyGridWhenReady(cols);
    } catch (e) {
      logger.error("GridManager.restoreGridIfNeeded failed", e);
    }
  }
}
GridManager.observer = null;

  /* =========================
     StorageManager (localStorage)
     ========================= */
  class StorageManager {
    static _prefix(key) { return CONFIG.STORAGE.PREFIX + key; }
    static migrateOldKeys() {
      try {
        const map = {
          hiddenModels: CONFIG.STORAGE.HIDDEN_KEY,
          tokensSpent: CONFIG.STORAGE.TOKENS_KEY,
          chaturbateHiderSettings: CONFIG.STORAGE.SETTINGS_KEY,
          chaturbate_backup: CONFIG.STORAGE.BACKUP_KEY
        };
        for (const oldKey in map) {
          const newKey = map[oldKey];
          const oldVal = localStorage.getItem(oldKey);
          if (oldVal && !localStorage.getItem(this._prefix(newKey))) {
            localStorage.setItem(this._prefix(newKey), oldVal);
            logger.info('Migrated ' + oldKey + ' → ' + this._prefix(newKey));
          }
          if (oldVal) localStorage.removeItem(oldKey);
        }
      } catch (e) { logger.error('migrateOldKeys failed', e); }
    }
    static _safeGet(key, fallback = null) {
      try {
        const raw = localStorage.getItem(this._prefix(key));
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (e) { logger.error('StorageManager.get ' + key + ' parse failed', e); return fallback; }
    }
    static _safeSet(key, value) {
      try { localStorage.setItem(this._prefix(key), JSON.stringify(value)); return true; }
      catch (e) { logger.error('StorageManager.set ' + key + ' failed', e); return false; }
    }
    static getHiddenModels() { return this._safeGet(CONFIG.STORAGE.HIDDEN_KEY, []); }
    static saveHiddenModels(arr) { if (!Array.isArray(arr)) return false; return this._safeSet(CONFIG.STORAGE.HIDDEN_KEY, arr); }
    static getTokensSpent() { return this._safeGet(CONFIG.STORAGE.TOKENS_KEY, {}); }
    static saveTokensSpent(obj) { if (!Utils.isObject(obj)) return false; return this._safeSet(CONFIG.STORAGE.TOKENS_KEY, obj); }
    static getSettings() {
      return this._safeGet(CONFIG.STORAGE.SETTINGS_KEY, {
        hideGenderTabs: true,
        showTimestamps: true,
        autoBackup: false,
        performanceMode: false,
        animateThumbnails: true
      });
    }
    static saveSettings(obj) { return this._safeSet(CONFIG.STORAGE.SETTINGS_KEY, obj); }
    static createBackupObject() {
      try {
        return {
          hiddenModels: this.getHiddenModels(),
          tokensSpent: this.getTokensSpent(),
          settings: this.getSettings(),
          timestamp: Date.now(),
          version: 'patched-compat'
        };
      } catch (e) { logger.error('createBackupObject error', e); return null; }
    }
    static saveBackupToLocal(backupObj) {
      try {
        if (!backupObj) backupObj = this.createBackupObject();
        if (!backupObj) return false;
        return this._safeSet(CONFIG.STORAGE.BACKUP_KEY, backupObj);
      } catch (e) { logger.error('saveBackupToLocal error', e); return false; }
    }
    static loadBackupFromLocal() { return this._safeGet(CONFIG.STORAGE.BACKUP_KEY, null); }
    static resetAll() {
      try {
        const vals = CONFIG.STORAGE;
        for (const k in vals) localStorage.removeItem(this._prefix(vals[k]));
        return true;
      } catch (e) { logger.error('resetAll error', e); return false; }
    }
  }

  /* =========================
     DataManager — Backup / Import
     ========================= */
  class DataManager {
    static exportData(filename = null) {
      try {
        const backup = StorageManager.createBackupObject();
        if (!backup) { NotificationManager.show('Nothing to export', 'error'); return; }
        Utils.downloadAsFile(JSON.stringify(backup, null, 2), filename || `chaturbate_backup_${new Date().toISOString().slice(0,10)}.json`);
        NotificationManager.show('Backup exported', 'success');
      } catch (e) { logger.error('exportData failed', e); NotificationManager.show('Export failed: ' + e.message, 'error'); }
    }
    static async importData(fileOrString, options = { mergeMode: 'replace' }) {
      try {
        let payload = null;
        if (typeof fileOrString === 'string') {
          payload = Utils.safeJSONParse(fileOrString, null);
          if (!payload) throw new Error('Invalid JSON string');
        } else if (fileOrString && fileOrString.text) {
          const t = await fileOrString.text();
          payload = Utils.safeJSONParse(t, null);
          if (!payload) throw new Error('Invalid JSON file');
        } else throw new Error('Unsupported input for importData');
        if (!Utils.isObject(payload)) throw new Error('Payload not object');
        const incomingHidden = Array.isArray(payload.hiddenModels) ? payload.hiddenModels : [];
        const incomingTokens = Utils.isObject(payload.tokensSpent) ? payload.tokensSpent : {};
        const incomingSettings = Utils.isObject(payload.settings) ? payload.settings : {};
        if (options.mergeMode === 'merge') {
          const existingHidden = new Set(StorageManager.getHiddenModels());
          for (let i=0;i<incomingHidden.length;i++) existingHidden.add(incomingHidden[i]);
          StorageManager.saveHiddenModels(Array.from(existingHidden));
          const currentTokens = StorageManager.getTokensSpent();
          for (const k in incomingTokens) {
            const v = Utils.safeParseInt(incomingTokens[k]);
            currentTokens[k] = (currentTokens[k] || 0) + v;
          }
          StorageManager.saveTokensSpent(currentTokens);
          const curSettings = StorageManager.getSettings();
          StorageManager.saveSettings(Object.assign({}, curSettings, incomingSettings));
        } else {
          StorageManager.saveHiddenModels(incomingHidden);
          StorageManager.saveTokensSpent(incomingTokens);
          StorageManager.saveSettings(Object.assign(StorageManager.getSettings(), incomingSettings));
        }
        StorageManager.saveBackupToLocal();
        NotificationManager.show('Data imported successfully', 'success');
        try { localStorage.setItem('chaturbate_enhancer_data_imported', JSON.stringify({ ts: Date.now() })); localStorage.removeItem('chaturbate_enhancer_data_imported'); } catch {}
        return true;
      } catch (e) {
        logger.error('importData error', e);
        NotificationManager.show('Import failed: ' + e.message, 'error');
        return false;
      }
    }
  }

  /* =========================
     NotificationManager (stacked toasts)
     ========================= */
  class NotificationManager {
    static show(message, type = 'info', duration = 3000) {
      try {
        NotificationManager._toasts = NotificationManager._toasts || new Set();
        const el = Utils.createElement('div', 'toast-notification ' + type, { textContent: message });
        el.style.position = 'fixed';
        el.style.top = (20 + NotificationManager._toasts.size * 50) + 'px';
        el.style.right = '20px';
        el.style.zIndex = 10001;
        el.style.padding = '8px 12px';
        el.style.background = 'rgba(0,0,0,0.7)';
        el.style.color = '#fff';
        el.style.borderRadius = '8px';
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
        el.style.transition = 'opacity .25s';
        document.body.appendChild(el);
        NotificationManager._toasts.add(el);
        setTimeout(() => NotificationManager.remove(el), duration);
        return el;
      } catch (e) { logger.error('Notification show failed', e); return null; }
    }
    static remove(el) {
      try {
        if (el && el.parentNode) el.parentNode.removeChild(el);
        if (NotificationManager._toasts) NotificationManager._toasts.delete(el);
        NotificationManager.reposition();
      } catch {}
    }
    static clear() { if (!NotificationManager._toasts) return; for (const t of Array.from(NotificationManager._toasts)) NotificationManager.remove(t); }
    static reposition() {
      if (!NotificationManager._toasts) return;
      Array.from(NotificationManager._toasts).forEach((el, idx) => { el.style.top = (20 + idx * 50) + 'px'; });
    }
  }

  /* =========================
     ThumbnailManager (animated previews)
     ========================= */
  class ThumbnailManager {
    static init() {
      try {
        const settings = StorageManager.getSettings();
        if (!('animateThumbnails' in settings)) {
          settings.animateThumbnails = true;
          StorageManager.saveSettings(settings);
        }
        ThumbnailManager.setupListeners();
        ThumbnailManager.observeDomCleanup();
      } catch (e) { logger.error('ThumbnailManager.init failed', e); }
    }
    static setupListeners() {
      const onEnter = Utils.debounce(function(ev) {
        try {
          const img = ev.target;
          if (!(img instanceof Element)) return;
          if (!img.matches('.room_list_room img, .roomElement img, .roomCard img')) return;
          if (!StorageManager.getSettings().animateThumbnails) return;
          ThumbnailManager.clearIntervalFor(img);
          ThumbnailManager.updateRoomThumb(img);
          const perf = StorageManager.getSettings().performanceMode;
          const interval = perf ? 400 : 150;
          const id = setInterval(() => ThumbnailManager.updateRoomThumb(img), interval);
          ThumbnailManager._hoverIntervals.set(img, id);
        } catch (e) { logger.error('thumb mouseenter', e); }
      }, 60);
      const onLeave = function(ev) {
        try {
          const img = ev.target;
          if (!(img instanceof Element)) return;
          if (!img.matches('.room_list_room img, .roomElement img, .roomCard img')) return;
          ThumbnailManager.clearIntervalFor(img);
        } catch (e) { logger.error('thumb mouseleave', e); }
      };
      document.addEventListener('mouseenter', onEnter, true);
      document.addEventListener('mouseleave', onLeave, true);
    }
    static observeDomCleanup() {
      if (ThumbnailManager._cleanupObserver) ThumbnailManager._cleanupObserver.disconnect();
      ThumbnailManager._cleanupObserver = new MutationObserver(function(muts) {
        for (let i=0;i<muts.length;i++) {
          const removed = muts[i].removedNodes;
          if (!removed) continue;
          for (let j=0;j<removed.length;j++) {
            const n = removed[j];
            if (n && n.querySelectorAll) {
              const imgs = n.querySelectorAll('img');
              for (let k=0;k<imgs.length;k++) ThumbnailManager.clearIntervalFor(imgs[k]);
            }
          }
        }
      });
      ThumbnailManager._cleanupObserver.observe(document.body, { childList: true, subtree: true });
    }
    static clearIntervalFor(img) {
      const id = ThumbnailManager._hoverIntervals.get(img);
      if (id) {
        clearInterval(id);
        ThumbnailManager._hoverIntervals.delete(img);
      }
    }
    static async updateRoomThumb(img) {
      try {
        const parent = img.parentElement;
        let username = null;
        if (parent) {
          username = (parent.dataset && parent.dataset.room) || null;
          if (!username) {
            const card = parent.closest ? parent.closest('li.roomCard') : null;
            username = ModelManager.extractUsername(card);
          }
        }
        if (!username) return;
        const now = Date.now();
        const perf = StorageManager.getSettings().performanceMode;
        const minGap = perf ? 260 : 120;
        const last = ThumbnailManager._lastReqTime.get(username) || 0;
        if (now - last < minGap) return;
        ThumbnailManager._lastReqTime.set(username, now);
        const url = 'https://thumb.live.mmcdn.com/minifwap/' + encodeURIComponent(username) + '.jpg?' + Math.random();
        const controller = new AbortController();
        const timeout = setTimeout(() => { try { controller.abort(); } catch {} }, perf ? 1500 : 2500);
        const resp = await fetch(url, { cache: 'no-cache', signal: controller.signal });
        clearTimeout(timeout);
        if (!resp || !resp.ok) return;
        const blob = await resp.blob();
        const prev = img.getAttribute('data-__thumb-obj-url');
        if (prev) { try { URL.revokeObjectURL(prev); } catch {} }
        const objUrl = URL.createObjectURL(blob);
        img.src = objUrl;
        img.setAttribute('data-__thumb-obj-url', objUrl);
      } catch (e) { if (!e || e.name !== 'AbortError') logger.error('updateRoomThumb error', e); }
    }
    static stopAll() {
      for (const [img, id] of ThumbnailManager._hoverIntervals.entries()) {
        clearInterval(id);
      }
      ThumbnailManager._hoverIntervals.clear();
      const imgs = document.querySelectorAll('img[data-__thumb-obj-url]');
      for (let i=0;i<imgs.length;i++) {
        const img = imgs[i];
        const u = img.getAttribute('data-__thumb-obj-url');
        if (u) { try { URL.revokeObjectURL(u); } catch {} }
        img.removeAttribute('data-__thumb-obj-url');
      }
      if (ThumbnailManager._cleanupObserver) {
        ThumbnailManager._cleanupObserver.disconnect();
        ThumbnailManager._cleanupObserver = null;
      }
    }
  }
  ThumbnailManager._hoverIntervals = new Map();
  ThumbnailManager._lastReqTime = new Map();
  ThumbnailManager._cleanupObserver = null;

  /* =========================
     ModelManager
     ========================= */
  class ModelManager {
    static extractUsername(card) {
      if (!card) return null;
      try {
        const slug = card.querySelector('[data-slug]');
        if (slug) return slug.getAttribute('data-slug') || null;
        const a = card.querySelector('a[href*="/"]');
        if (a) {
          const href = a.getAttribute('href') || '';
          const parts = href.split('/').filter(Boolean);
          return parts[0] || null;
        }
      } catch (e) { logger.error('extractUsername failed', e); }
      return null;
    }
  }

  /* =========================
     ModalManager
     ========================= */
  class ModalManager {
    static createModal(title, bodyElement, buttons = []) {
      console.log('Creating modal:', title);
      if (ModalManager._active) {
        console.log('Closing existing modal before creating new one');
        ModalManager.closeModal();
      }
      const overlay = Utils.createElement('div', 'chaturbate-hider-overlay');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      const modal = Utils.createElement('div', 'chaturbate-hider-modal', { tabindex: '-1' });
      const header = Utils.createElement('div', 'chaturbate-hider-header');
      const h3 = Utils.createElement('h3', '', { textContent: title, id: 'ce-modal-title' });
      const closeBtn = Utils.createElement('button', 'chaturbate-hider-close', { type: 'button', 'aria-label': 'Close' });
      closeBtn.innerHTML = '&times;';
      header.appendChild(h3); header.appendChild(closeBtn);
      const body = Utils.createElement('div', 'chaturbate-hider-body');
      body.appendChild(bodyElement);
      const footer = Utils.createElement('div', 'chaturbate-hider-footer');
      for (let i = 0; i < buttons.length; i++) {
        const cfg = buttons[i] || {};
        const b = Utils.createElement('button', 'chaturbate-hider-btn ' + (cfg.class || ''), {
          type: 'button',
          textContent: cfg.text || 'OK'
        });
        if (cfg.ariaLabel) b.setAttribute('aria-label', cfg.ariaLabel);
        if (cfg.onClick) b.addEventListener('click', function(e) {
          e.preventDefault();
          try { cfg.onClick(); } catch (err) { logger.error('modal btn cb', err); }
        });
        footer.appendChild(b);
      }
      modal.appendChild(header);
      modal.appendChild(body);
      modal.appendChild(footer);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      const escHandler = function(e) { if (e.key === 'Escape') ModalManager.closeModal(); };
      const overlayClick = function(e) { if (e.target === overlay) ModalManager.closeModal(); };
      closeBtn.addEventListener('click', function() { ModalManager.closeModal(); });
      document.addEventListener('keydown', escHandler);
      overlay.addEventListener('click', overlayClick);
      const focusable = function() {
        return overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      };
      const keydownTrap = function(e) {
        if (e.key !== 'Tab') return;
        const f = Array.from(focusable());
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      };
      document.addEventListener('keydown', keydownTrap);
      ModalManager._active = { overlay, modal, escHandler, overlayClick, keydownTrap };
      console.log('Modal created, adding visible class');
      requestAnimationFrame(function() {
        overlay.classList.add('visible');
        console.log('Visible class added to overlay');
      });
      setTimeout(function() {
        try {
          modal.focus();
          console.log('Modal focused');
        } catch (e) {
          logger.error('Modal focus error', e);
        }
      }, 80);
      return overlay;
    }
    static closeModal() {
      if (!ModalManager._active) return;
      const st = ModalManager._active;
      try {
        document.removeEventListener('keydown', st.escHandler);
        document.removeEventListener('keydown', st.keydownTrap);
        st.overlay.removeEventListener('click', st.overlayClick);
        st.overlay.classList.remove('visible');
        setTimeout(function(){ if (st.overlay.parentNode) st.overlay.parentNode.removeChild(st.overlay); }, 200);
      } catch (e) { logger.error('closeModal error', e); }
      ModalManager._active = null;
    }
  }
  ModalManager._active = null;

  /* =========================
     SettingsModal
     ========================= */
  class SettingsModal {
    static _makeToggle(settings, key, label) {
      const wrap = Utils.createElement('label', 'enhancer-toggle');
      const span = Utils.createElement('span', '', { textContent: label });
      const input = Utils.createElement('input', '', { type: 'checkbox' });
      input.checked = !!settings[key];
      input.addEventListener('change', function() {
        settings[key] = input.checked;
        StorageManager.saveSettings(settings);
        NotificationManager.show(label + ' ' + (input.checked ? 'enabled' : 'disabled'), 'info');
      });
      wrap.appendChild(span); wrap.appendChild(input);
      return wrap;
    }
    static _makeActionsRow() {
      const wrap = Utils.createElement('div', 'settings-actions');
      const exportBtn = Utils.createElement('button', 'primary', { textContent: 'Export Backup', type: 'button' });
      const importBtn = Utils.createElement('button', 'secondary', { textContent: 'Import Backup', type: 'button' });
      exportBtn.addEventListener('click', function(){ DataManager.exportData(); });
      importBtn.addEventListener('click', function(){ SettingsModal.showImportDialog(); });
      wrap.appendChild(exportBtn); wrap.appendChild(importBtn);
      return wrap;
    }
    static showImportDialog() {
      try {
        const container = Utils.createElement('div', '', { style: 'display:flex;flex-direction:column;gap:12px;padding:6px 0' });
        const fileInput = Utils.createElement('input', '', { type: 'file', accept: 'application/json' });
        const radioWrap = Utils.createElement('div', '', { style: 'display:flex;gap:8px;align-items:center' });
        radioWrap.appendChild(Utils.createElement('label', '', { innerHTML: '<input type="radio" name="importMode" value="replace" checked /> Replace existing' }));
        radioWrap.appendChild(Utils.createElement('label', '', { innerHTML: '<input type="radio" name="importMode" value="merge" /> Merge (recommended)' }));
        const hint = Utils.createElement('div', '', {
          textContent: 'Choose a backup file (.json). Merge adds hidden models and sums token counts; Replace overwrites.',
          style:'font-size:12px;color:var(--ch-text-muted)'
        });
        const btnRow = Utils.createElement('div', '', { style: 'display:flex;gap:8px;justify-content:flex-end' });
        const importBtn = Utils.createElement('button', 'chaturbate-hider-btn primary', { textContent: 'Import', type: 'button' });
        const cancelBtn = Utils.createElement('button', 'chaturbate-hider-btn secondary', { textContent: 'Cancel', type: 'button' });
        btnRow.appendChild(cancelBtn); btnRow.appendChild(importBtn);
        container.appendChild(fileInput);
        container.appendChild(radioWrap);
        container.appendChild(hint);
        container.appendChild(btnRow);
        ModalManager.createModal('Import Backup', container, []);
        cancelBtn.addEventListener('click', function(){ ModalManager.closeModal(); });
        importBtn.addEventListener('click', async function() {
          const f = fileInput.files && fileInput.files[0];
          if (!f) { NotificationManager.show('Please select a file', 'error'); return; }
          const modeEl = document.querySelector('input[name="importMode"]:checked');
          const mode = (modeEl && modeEl.value) || 'replace';
          importBtn.disabled = true;
          const ok = await DataManager.importData(f, { mergeMode: mode });
          importBtn.disabled = false;
          if (ok) {
            ModalManager.closeModal();
            setTimeout(function(){ window.location.reload(); }, 600);
          }
        });
      } catch (e) { logger.error('showImportDialog error', e); NotificationManager.show('Failed to open import dialog', 'error'); }
    }
    static show() {
      try {
        const settings = StorageManager.getSettings();
        const container = Utils.createElement('div', 'enhancer-settings-group');
        const toggles = [
          ['hideGenderTabs', 'Hide gender tabs'],
          ['showTimestamps', 'Show chat timestamps'],
          ['animateThumbnails', 'Animate thumbnails on hover'],
          ['autoBackup', 'Auto-backup data daily'],
          ['performanceMode', 'Performance mode (less animations/requests)']
        ];
        for (let i=0;i<toggles.length;i++) {
          const [key, label] = toggles[i];
          container.appendChild(SettingsModal._makeToggle(settings, key, label));
        }
        container.appendChild(SettingsModal._makeActionsRow());
        const tokenStatsBtn = Utils.createElement('button', 'chaturbate-hider-btn', {
          textContent: 'Show Token Stats',
          type: 'button',
          style: 'margin-top:10px;'
        });
        tokenStatsBtn.addEventListener('click', function(){ StatsManager.showTokenStats(); });
        container.appendChild(tokenStatsBtn);
        ModalManager.createModal('Enhancer Settings', container, [
          { text: 'Close', class: 'secondary', onClick: function(){ ModalManager.closeModal(); } }
        ]);
      } catch (e) { logger.error('SettingsModal.show failed', e); }
    }
  }

  /* =========================
     ButtonManager (hide models)
     ========================= */
  class ButtonManager {
    static addHideButtons() {
      try {
        ButtonManager._processed = ButtonManager._processed || new WeakSet();
        const cards = document.querySelectorAll(CONFIG.SELECTORS.ROOM_CARDS);
        if (!cards.length) return;
        const hidden = new Set(StorageManager.getHiddenModels());
        let added = 0, hiddenCount = 0;
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (ButtonManager._processed.has(card)) continue;
          ButtonManager._processed.add(card);
          const username = ModelManager.extractUsername(card);
          if (!username) continue;
          if (hidden.has(username)) {
            card.style.display = 'none';
            card.setAttribute('data-hidden', 'true');
            hiddenCount++;
            continue;
          }
          const btn = ButtonManager.createHideButton(card, username);
          if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
          card.appendChild(btn);
          btn.style.display = 'block';
          added++;
        }
        if (added > 0 || hiddenCount > 0) StatsManager.updateHiddenModelsStat();
      } catch (e) { logger.error('addHideButtons failed', e); }
    }
    static createHideButton(card, username) {
      const button = Utils.createElement('button', 'hide-model-button', {
        'aria-label': 'Hide ' + username,
        title: 'Hide ' + username,
        textContent: '✕',
        type: 'button'
      });
      button.addEventListener('click', function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        card.style.display = 'none';
        card.setAttribute('data-hidden', 'true');
        const hidden = StorageManager.getHiddenModels();
        if (hidden.indexOf(username) === -1) {
          hidden.push(username);
          StorageManager.saveHiddenModels(hidden);
          StatsManager.updateHiddenModelsStat();
          NotificationManager.show('Hidden: ' + username, 'success');
        }
      });
      return button;
    }
    static clearProcessedCards() { ButtonManager._processed = new WeakSet(); }
  }
  ButtonManager._processed = new WeakSet();

  /* =========================
   ChatTimestampManager
   ========================= */
class ChatTimestampManager {
  constructor() {
    this.observer = null;
    this.processed = new WeakSet();
    this.settings = StorageManager.getSettings();
    this.maxProcessed = 5000;
    this.counter = 0;
  }
  start() {
    if (!this.settings.showTimestamps) return;
    this.addTimestamps();
    this.setupMonitoring();
  }
  addTimestamps() {
    try {
      this.processChatMessages();
      this.processStandaloneNotices();
    } catch (e) { logger.error('addTimestamps failed', e); }
  }
  processChatMessages() {
    const messages = document.querySelectorAll(CONFIG.SELECTORS.CHAT_MESSAGES);
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (this.processed.has(msg)) continue;
      if (msg.querySelector('div[data-testid="room-notice"]')) {
        this.markProcessed(msg);
        continue;
      }
      try {
        let tsNum = parseInt(msg.getAttribute('data-ts'), 10);
        if (isNaN(tsNum)) {
          tsNum = Date.now();
        }
        const opts = this.settings.performanceMode
          ? { hour: '2-digit', minute: '2-digit' }
          : { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Date(tsNum).toLocaleTimeString([], opts);
        this.addTimestampToMessage(msg, timeString);
        this.markProcessed(msg);
      } catch (e) {
        logger.error('processChatMessages error', e);
      }
    }
  }
  processStandaloneNotices() {
    const notices = document.querySelectorAll('div[data-testid="room-notice"]');
    for (let i = 0; i < notices.length; i++) {
      const notice = notices[i];
      if (this.processed.has(notice)) continue;
      let target = notice.querySelector('[data-testid="room-notice-viewport"] span') ||
                   notice.querySelector('span') ||
                   notice;
      if (target.querySelector('.chat-timestamp')) {
        this.markProcessed(notice);
        continue;
      }
      const opts = this.settings.performanceMode
        ? { hour: '2-digit', minute: '2-digit' }
        : { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const ts = new Date().toLocaleTimeString([], opts);
      const color = this.getTimestampColor(target || notice);
      const sp = Utils.createElement('span', 'chat-timestamp', {
        textContent: `[${ts}] `,
        style: `color:${color}; font-size:11px; margin-right:4px; font-weight:normal; display:inline;`
      });
      // Check for white background and adjust notice text color
      const cs = getComputedStyle(notice);
      const bg = cs.backgroundColor || '';
      if (bg.includes('255, 255, 255')) {
        // Apply dark color to all child spans for better readability
        const spans = notice.querySelectorAll('span:not(.chat-timestamp)');
        spans.forEach(span => {
          span.style.color = 'rgba(0, 0, 0, 0.85)';
        });
        // Ensure the target itself has dark color if it’s the fallback
        target.style.color = 'rgba(0, 0, 0, 0.85)';
      }
      target.insertBefore(sp, target.firstChild);
      this.markProcessed(notice);
    }
  }
  addTimestampToMessage(message, timeString) {
    if (message.querySelector('.chat-timestamp')) return;
    const containerEl =
      message.querySelector('div[dm-adjust-bg]') ||
      message.querySelector('div[dm-adjust-fg]') ||
      message;
    if (!containerEl) return;
    const colorBase = this.getColorBaseFor(message, null);
    const color = this.getTimestampColor(colorBase);
    const sp = Utils.createElement('span', 'chat-timestamp', {
      textContent: `[${timeString}] `,
      style: `color:${color}; font-size:11px; margin-right:4px; font-weight:normal; display:inline;`
    });
    containerEl.insertBefore(sp, containerEl.firstChild);
  }
  getColorBaseFor(message, notice) {
    return (message && message.querySelector('div[data-testid="room-notice"]')) ||
           notice ||
           message ||
           document.body;
  }
 getTimestampColor(el) {
  try {
    let current = el;
    let bg = '';
    let fg = '';

    // Walk up the DOM until we find a non-transparent background
    while (current && current !== document.body) {
      const cs = getComputedStyle(current);
      bg = cs.backgroundColor || '';
      fg = cs.color || fg;
      if (bg && !bg.includes('rgba(0, 0, 0, 0)') && !bg.includes('transparent')) {
        break;
      }
      current = current.parentElement;
    }

    // Parse RGB
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      if (brightness > 180) {
        return 'rgba(0, 0, 0, 0.85)'; // dark text on light bg
      }
    }

    // If foreground text is already dark, match it
    if (fg && (fg === 'rgb(0, 0, 0)' || fg.startsWith('rgba(0, 0, 0'))) {
      return 'rgba(0, 0, 0, 0.75)';
    }

    return 'rgba(255, 255, 255, 0.85)';
  } catch {
    return 'rgba(255, 255, 255, 0.85)';
  }
}


  setupMonitoring() {
    const self = this;
    setTimeout(function () {
      const chatContainer = Utils.findElement([
  '#chat-messages',
  '.chat-messages',
  '#messages',
  '.messages',
  '.messages-list',
  '#message-list'
]);
      if (chatContainer) {
        self.observer = new MutationObserver(
          Utils.debounce(function () { self.addTimestamps(); }, CONFIG.TIMERS.MUTATION_DEBOUNCE)
        );
        self.observer.observe(chatContainer, { childList: true, subtree: true });
      }
    }, 500);
  }
  markProcessed(node) {
    this.processed.add(node);
    this.counter++;
    if (this.counter > this.maxProcessed) {
      this.processed = new WeakSet();
      this.counter = 0;
    }
  }
  stop() {
    if (this.observer) this.observer.disconnect();
    this.observer = null;
    this.processed = new WeakSet();
  }
}

  /* =========================
     TabManager (hide gender tabs)
     ========================= */
  class TabManager {
    static hideGenderTabs() {
      try {
        if (!StorageManager.getSettings().hideGenderTabs) return;
        const selectors = [
          'a.gender-tab[href*="/trans-cams/"]',
          'a[href*="/male-cams"]',
          'a[href*="/trans-cams"]'
        ];
        const els = document.querySelectorAll(selectors.join(','));
        for (let i=0;i<els.length;i++) els[i].style.display = 'none';
      } catch (e) { logger.error('hideGenderTabs failed', e); }
      const merch = document.querySelector('li a#merch');
      if (merch && merch.closest('li')) {
        merch.closest('li').style.display = 'none';
      }
    }
  }

  /* =========================
     StatsManager
     ========================= */
  class StatsManager {
    static updateHiddenModelsStat() {
      try {
        const merch = Utils.findElement(['li a#merch', 'a#merch']);
        const merchLi = merch && merch.closest ? merch.closest('li') : null;
        let statLi = document.querySelector('#hidden-models-stat-li');
        if (!statLi) {
          statLi = Utils.createElement('li', '', { id: 'hidden-models-stat-li' });
          const parent = (merchLi && merchLi.parentNode) || Utils.findElement(['ul.top-nav', 'ul.main-nav', 'nav ul', "ul#nav" ]);
          if (parent) {
            if (merchLi) merchLi.insertAdjacentElement('afterend', statLi);
            else parent.appendChild(statLi);
          }
        }
        let statA = document.querySelector('#hidden-models-stat');
        if (!statA) {
          statA = Utils.createElement('a', '', {
            id: 'hidden-models-stat',
            href: 'javascript:void(0);',
            style: 'color:#fff;margin-right:12px;'
          });
          statA.addEventListener('click', function(e) {
            e.preventDefault();
            ModalManager.createModal('Hidden Models', StatsManager.createHiddenList(), [
              { text: 'Close', class: 'secondary', onClick: function(){ ModalManager.closeModal(); } }
            ]);
          });
          statLi.appendChild(statA);
          const settingsBtn = Utils.createElement('a', '', {
            id: 'enhancer-settings-btn',
            href: 'javascript:void(0);',
            style: 'color:#fff;font-weight:600;margin-left:10px;'
          });
          settingsBtn.textContent = '⚙ Settings';
          settingsBtn.addEventListener('click', function(e){ e.preventDefault(); SettingsModal.show(); });
          statLi.appendChild(settingsBtn);
        }
        const stats = StatsManager.calculateHiddenStats();
        statA.textContent = 'Hidden Models: ' + stats.currentHidden + '/' + stats.totalHidden;
      } catch (e) { logger.error('updateHiddenModelsStat failed', e); }
    }
    static calculateHiddenStats() {
      const hidden = StorageManager.getHiddenModels();
      const total = hidden.length;
      const set = new Set(hidden);
      const cards = document.querySelectorAll(CONFIG.SELECTORS.ROOM_CARDS);
      let currentHidden = 0;
      for (let i=0;i<cards.length;i++) {
        const c = cards[i];
        const u = ModelManager.extractUsername(c);
        if (u && set.has(u) && (c.style.display === 'none' || c.getAttribute('data-hidden') === 'true')) currentHidden++;
      }
      return { totalHidden: total, currentHidden };
    }
    static createHiddenList(showAll = false) {
      const container = Utils.createElement('div', '', { style: 'padding:10px;' });

      // Toggle button
      const toggleBtn = Utils.createElement('button', 'chaturbate-hider-btn', {
        textContent: showAll ? 'Show Current Only' : 'Show All Hidden',
        type: 'button',
        style: 'margin-bottom:10px;'
      });
      toggleBtn.addEventListener('click', () => {
        ModalManager.closeModal();
        ModalManager.createModal(
          'Hidden Models',
          StatsManager.createHiddenList(!showAll), // toggle mode
          [{ text: 'Close', class: 'secondary', onClick: () => ModalManager.closeModal() }]
        );
      });
      container.appendChild(toggleBtn);

      const ul = Utils.createElement('ul', 'hidden-models-list');
      const hidden = StorageManager.getHiddenModels();
      const hiddenSet = new Set(hidden);

      let models = [];
      if (showAll) {
        // Show ALL hidden models in storage
        models = hidden;
      } else {
        // Show ONLY those hidden on the current page
        const cards = document.querySelectorAll(CONFIG.SELECTORS.ROOM_CARDS);
        models = Array.from(cards)
          .map(card => {
            const u = ModelManager.extractUsername(card);
            if (
              u &&
              hiddenSet.has(u) &&
              (card.style.display === 'none' || card.getAttribute('data-hidden') === 'true')
            ) {
              return u;
            }
            return null;
          })
          .filter(Boolean);
      }

      if (!models.length) {
        ul.appendChild(Utils.createElement('li', '', { textContent: 'No models to show' }));
      }

      models.forEach(name => {
        const li = Utils.createElement('li', 'hidden-models-item');
        li.appendChild(Utils.createElement('span', '', { textContent: name }));

        const btn = Utils.createElement('button', 'chaturbate-hider-btn danger', {
          textContent: 'Unhide',
          type: 'button'
        });
        btn.addEventListener('click', () => {
          const filtered = StorageManager.getHiddenModels().filter(n => n !== name);
          StorageManager.saveHiddenModels(filtered);
          NotificationManager.show(name + ' unhidden', 'success');
          setTimeout(() => window.location.reload(), 500);
        });

        li.appendChild(btn);
        ul.appendChild(li);
      });

      container.appendChild(ul);
      return container;
    }

    static showTokenStats() {
      try {
        const tokens = StorageManager.getTokensSpent();
        const entries = [];
        for (const k in tokens) if (tokens[k] > 0) entries.push([k, tokens[k]]);
        if (!entries.length) { NotificationManager.show('No token data available', 'info'); return; }
        entries.sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((sum, e) => sum + e[1], 0);
        const container = Utils.createElement('div', 'token-stats-container');
        const table = Utils.createElement('table', 'token-stats-table');
        const thead = Utils.createElement('thead');
        thead.innerHTML = '<tr><th>Model</th><th>Tokens Spent</th><th>Edit</th></tr>';
        table.appendChild(thead);
        const tbody = Utils.createElement('tbody');
        for (let i = 0; i < entries.length; i++) {
          const [model, spent] = entries[i];
          const tr = Utils.createElement('tr');
          const tdModel = Utils.createElement('td', '', { textContent: model });
          const tdSpent = Utils.createElement('td', '', { textContent: spent.toLocaleString() });
          const tdEdit = Utils.createElement('td');
          const editBtn = Utils.createElement('button', 'token-edit-btn', { textContent: '✎ Edit' });
          editBtn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
          editBtn.style.color = '#000';
          editBtn.style.fontWeight = '700';
          editBtn.style.padding = '4px 10px';
          editBtn.style.borderRadius = '999px';
          editBtn.style.border = 'none';
          editBtn.style.cursor = 'pointer';
          editBtn.style.transition = 'all 0.25s ease';
          editBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
          editBtn.addEventListener('mouseenter', () => {
            editBtn.style.transform = 'translateY(-2px) scale(1.05)';
            editBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          });
          editBtn.addEventListener('mouseleave', () => {
            editBtn.style.transform = 'translateY(0) scale(1)';
            editBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
          });
          editBtn.addEventListener('click', () => {
            const val = prompt('Set tokens spent for ' + model, spent);
            if (val !== null && !isNaN(val)) {
              const newVal = Utils.safeParseInt(val);
              const data = StorageManager.getTokensSpent();
              data[model] = newVal;
              StorageManager.saveTokensSpent(data);
              tdSpent.textContent = newVal.toLocaleString();
              NotificationManager.show('Updated tokens for ' + model, 'success');
            }
          });
          tdEdit.appendChild(editBtn);
          tr.appendChild(tdModel);
          tr.appendChild(tdSpent);
          tr.appendChild(tdEdit);
          tbody.appendChild(tr);
        }
        const totalTr = Utils.createElement('tr', 'total-row');
        totalTr.innerHTML = '<td><strong>Total</strong></td><td colspan="2"><strong>' + total.toLocaleString() + '</strong></td>';
        tbody.appendChild(totalTr);
        table.appendChild(tbody);
        container.appendChild(table);
        ModalManager.createModal('Token Statistics', container, [
          { text: 'Close', class: 'secondary', onClick: function(){ ModalManager.closeModal(); } }
        ]);
      } catch (e) { logger.error('showTokenStats failed', e); }
    }
  }

  /* =========================
     TokenMonitor (track tokens spent)
     ========================= */
  class TokenMonitor {
    constructor() {
      this.observer = null;
      this.lastTokenCount = null;
      this.isActive = false;
      this.tokenCountSpan = null;
      this.currentModel = null;
    }
    async start() {
      if (this.isActive) return;
      this.isActive = true;
      const tokenCountSpan = Utils.findElement(CONFIG.SELECTORS.TOKEN_BALANCE_SELECTORS);
      const scanCamsSpan = document.querySelector(CONFIG.SELECTORS.SCAN_CAMS);
      if (!tokenCountSpan || !scanCamsSpan) return;
      const currentModel = Utils.getCurrentModelFromPath();
      if (!currentModel) return;
      this.tokenCountSpan = tokenCountSpan;
      this.currentModel = currentModel;
      this.setupTokenTracking(currentModel, tokenCountSpan);
      this.createTokenInterface(currentModel, scanCamsSpan);
    }
    setupTokenTracking(currentModel, tokenCountSpan) {
      const tokens = StorageManager.getTokensSpent();
      if (!(currentModel in tokens)) {
        tokens[currentModel] = 0;
        StorageManager.saveTokensSpent(tokens);
      }
      this.lastTokenCount = Utils.safeParseInt(tokenCountSpan.textContent);
      if (this.observer) this.observer.disconnect();
      const handleChange = (currentBalance) => {
        if (currentBalance < this.lastTokenCount) {
          const spent = this.lastTokenCount - currentBalance;
          const data = StorageManager.getTokensSpent();
          data[currentModel] = (data[currentModel] || 0) + spent;
          StorageManager.saveTokensSpent(data);
          localStorage.setItem(
            "chaturbateEnhancer:lastTokenUpdate",
            JSON.stringify({ model: currentModel, total: data[currentModel], ts: Date.now() })
          );
          this.updateTokenDisplay(currentModel, data[currentModel]);
        }
        this.lastTokenCount = currentBalance;
      };
      this.observer = new MutationObserver(() => {
        if (!this.isActive) return;
        const currentTokenCount = Utils.safeParseInt(tokenCountSpan.textContent);
        handleChange(currentTokenCount);
      });
      this.observer.observe(tokenCountSpan, { childList: true, characterData: true, subtree: true });
      window.addEventListener("storage", (e) => {
        if (e.key === "chaturbateEnhancer:lastTokenUpdate") {
          try {
            const payload = JSON.parse(e.newValue || "{}");
            if (payload.model === currentModel) {
              this.updateTokenDisplay(currentModel, payload.total);
            }
          } catch {}
        }
      });
    }
createTokenInterface(currentModel, scanCamsSpan) {
  let container = document.querySelector('#tokens-bar-container');
  if (container) {
    this.updateTokenDisplay(currentModel);
    return;
  }
  container = Utils.createElement('div', 'tokens-bar-container', { id: 'tokens-bar-container' });
  const left = Utils.createElement('div', 'tokens-bar-left');
  const spentDiv = Utils.createElement('span', 'tokens-spent-stat', { id: 'tokens-spent-stat' });
  left.appendChild(spentDiv);
  container.appendChild(left);
  const right = Utils.createElement('div', 'tokens-bar-right');
  const recu = this.makeLinkBtn('RecuMe', 'RecuMe', CONFIG.EXTERNAL_LINKS.RECU_ME + encodeURIComponent(currentModel));
  const cw = this.makeLinkBtn('CamWhoresTV', 'CamWhoresTV', CONFIG.EXTERNAL_LINKS.CAMWHORES_TV + encodeURIComponent(currentModel) + '/');
  const cgf = this.makeLinkBtn('CamGirlFinder', 'CamGirlFinder', CONFIG.EXTERNAL_LINKS.CAMGIRLFINDER + encodeURIComponent(currentModel) + '#1');
  right.appendChild(recu);
  right.appendChild(cw);
  right.appendChild(cgf);
  container.appendChild(right);
  const toolbar = document.querySelector('.genderTabs');
  if (toolbar && toolbar.parentElement) {
    toolbar.parentElement.insertBefore(container, toolbar);
  } else {
    document.body.prepend(container);
  }
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.alignItems = 'center';
  container.style.margin = '6px 0 6px 0';
  container.style.padding = '6px 10px';
  container.style.background = 'rgba(0,0,0,0.5)';
  container.style.borderRadius = '6px';
  this.updateTokenDisplay(currentModel);
}
makeLinkBtn(title, text, url) {
  const btn = Utils.createElement('button', 'token-action-btn', {
    type: 'button',
    title: title,
    'aria-label': title,
    textContent: text
  });
  if (text === 'RecuMe') {
    btn.style.background = 'linear-gradient(135deg, #f97316, #fbbf24)';
    btn.style.color = '#000';
  } else if (text === 'CamWhoresTV') {
    btn.style.background = 'linear-gradient(135deg, #dc2626, #2563eb)';
    btn.style.color = '#fff';
  } else if (text === 'CamGirlFinder') {
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.style.color = '#fff';
  }
  btn.style.fontWeight = '700';
  btn.style.padding = '6px 14px';
  btn.style.borderRadius = '999px';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.transition = 'all 0.25s ease';
  btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px) scale(1.05)';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0) scale(1)';
    btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  });
  btn.addEventListener('click', function() {
    try { window.open(url, '_blank', 'noopener,noreferrer'); }
    catch (e) {
      logger.error('open ' + title + ' fail', e);
      NotificationManager.show('Failed to open ' + title, 'error');
    }
  });
  return btn;
}
    updateTokenDisplay(currentModel, tokenCount = null) {
      const el = document.querySelector('#tokens-spent-stat');
      if (!el) return;
      if (tokenCount === null) {
        const tokens = StorageManager.getTokensSpent();
        tokenCount = tokens[currentModel] || 0;
      }
      el.textContent = 'Tokens spent on ' + currentModel + ': ' + tokenCount.toLocaleString();
    }
    stop() {
      this.isActive = false;
      this.currentModel = null;
      if (this.observer) { this.observer.disconnect(); this.observer = null; }
      this.tokenCountSpan = null;
    }
  }

  /* =========================
     Main Controller
     ========================= */
  class ChaturbateEnhancer {
    constructor() {
      this.tokenMonitor = null;
      this.chatTimestamps = null;
      this.lastPath = location.pathname;
      this.mutationObserver = null;
      this.pathCheckInterval = null;
      this.isInitialized = false;
      this.loadingOverlay = null;
    }
    async init() {
      if (this.isInitialized) return;
      try {
        this.loadingOverlay = addLoadingOverlay();
        StorageManager.migrateOldKeys();
        this.injectStyles();
        await this.runInitialSetup();
        this.observeDynamicChanges();
        this.setupPathMonitoring();
        this.exposeGlobals();
        this.isInitialized = true;
        setTimeout(() => removeLoadingOverlay(this.loadingOverlay), 100);
      } catch (e) {
        logger.error('Enhancer init failed', e);
        removeLoadingOverlay(this.loadingOverlay);
      }
    }
    async runInitialSetup() {
      try {
        const isModelPage = !!Utils.getCurrentModelFromPath();
        if (!isModelPage) {
          GridManager.init(); // Handles grid restoration internally
          ThumbnailManager.init();
        } else {
          ThumbnailManager.stopAll();
        }
        if (this.tokenMonitor) this.tokenMonitor.stop();
        this.tokenMonitor = new TokenMonitor();
        await this.tokenMonitor.start();
        if (this.chatTimestamps) this.chatTimestamps.stop();
        this.chatTimestamps = new ChatTimestampManager();
        this.chatTimestamps.start();
        ButtonManager.addHideButtons();
        TabManager.hideGenderTabs();
        StatsManager.updateHiddenModelsStat();
      } catch (e) { logger.error('runInitialSetup error', e); }
    }
    observeDynamicChanges() {
      const debounced = Utils.debounce(() => this.runInitialSetup(), CONFIG.TIMERS.MUTATION_DEBOUNCE);
      const targets = [
        document.querySelector('#room_list, .room_list'),
        document.querySelector('#main, .main-content')
      ].filter(function(n){ return !!n; });
      this.mutationObserver = new MutationObserver(function(mutations) {
        for (let i=0;i<mutations.length;i++) {
          const mut = mutations[i];
          if ((mut.addedNodes && mut.addedNodes.length) || (mut.removedNodes && mut.removedNodes.length)) {
            debounced();
            break;
          }
        }
      });
      for (let i=0;i<targets.length;i++) this.mutationObserver.observe(targets[i], { childList: true, subtree: true });
    }
    setupPathMonitoring() {
      const self = this;
      this.pathCheckInterval = setInterval(function() {
        if (location.pathname !== self.lastPath) self.handlePathChange();
      }, CONFIG.TIMERS.PATH_CHECK_INTERVAL);
    }
    async handlePathChange() {
      this.lastPath = location.pathname;
      if (this.tokenMonitor) this.tokenMonitor.stop();
      if (this.chatTimestamps) this.chatTimestamps.stop();
      ThumbnailManager.stopAll();
      ButtonManager.clearProcessedCards();
      setTimeout(() => this.runInitialSetup(), 500);
    }
    exposeGlobals() {
      window.showChaturbateStats = function(){ SettingsModal.show(); };
      window.exportChaturbateData = function(){ DataManager.exportData(); };
      window.importChaturbateData = function(){ SettingsModal.showImportDialog(); };
      window.resetChaturbateData = function(){
        if (confirm('Reset all hidden models and token data?')) {
          StorageManager.resetAll();
          NotificationManager.show('Data reset', 'success');
          setTimeout(function(){ location.reload(); }, 600);
        }
      };
    }
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .chaturbate-hider-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .chaturbate-hider-overlay.visible {
          opacity: 1;
        }
        .chaturbate-hider-modal {
          background: #1f2937;
          border-radius: 8px;
          padding: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          color: #fff;
        }
        .chaturbate-hider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .chaturbate-hider-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .chaturbate-hider-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
        }
        .chaturbate-hider-close:hover {
          color: #3b82f6;
        }
        .chaturbate-hider-body {
          margin-bottom: 12px;
        }
        .chaturbate-hider-footer {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .chaturbate-hider-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          background: #4b5563;
          color: #fff;
        }
        .chaturbate-hider-btn.primary {
          background: #3b82f6;
        }
        .chaturbate-hider-btn.primary:hover {
          background: #2563eb;
        }
        .chaturbate-hider-btn.secondary {
          background: #6b7280;
        }
        .chaturbate-hider-btn.secondary:hover {
          background: #4b5563;
        }
        .chaturbate-hider-btn.danger {
          background: #dc262
        }
        .chaturbate-hider-btn.danger:hover {
          background: #b91c1c;
        }
        .settings-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        .settings-actions button {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #3b82f6;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .settings-actions button:hover {
          background: #2563eb;
        }
        .enhancer-settings-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .enhancer-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .enhancer-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .enhancer-toggle span {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }
        .enhancer-toggle input[type="checkbox"] {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #3b82f6;
          border-radius: 4px;
          background: #1f2937;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        .enhancer-toggle input[type="checkbox"]:checked {
          background: #3b82f6;
          border-color: #2563eb;
        }
        .enhancer-toggle input[type="checkbox"]:checked::after {
      content: "✔";
      font-size: 12px;
      color: #fff;
    }
    .tokens-bar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      padding: 8px 12px;
      border-radius: 8px;
      margin: 8px 0;
      gap: 12px;
    }
    .tokens-bar-left {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }
    .tokens-bar-right {
      display: flex;
      gap: 8px;
    }
    .token-action-btn {
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      background: #3b82f6;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;
    }
    .token-action-btn:hover, .token-action-btn:focus {
      background: #2563eb;
      outline: none;
    }
    .hide-model-button {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
      line-height: 1;
      transition: background 0.2s;
    }
    .hide-model-button:hover, .hide-model-button:focus {
      background: rgba(220, 38, 38, 0.85);
    }
    .toast-notification {
      transition: opacity 0.25s;
    }
    .hidden-models-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .hidden-models-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .token-stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .token-stats-table th, .token-stats-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .token-stats-table th {
      font-weight: 600;
    }
    .total-row {
      font-weight: 600;
      background: rgba(255, 255, 255, 0.05);
    }
    #grid-size-controls {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      margin-right: 8px;
      background: transparent;
    }
    .grid-buttons-wrap {
      display: flex;
      gap: 4px;
      background: transparent;
    }
    .grid-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      background: #1a252f;
      cursor: pointer;
      padding: 0;
      transition: background 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .grid-btn:hover {
      background: #2a3b4f;
    }
    .grid-btn svg {
      pointer-events: none;
      fill: #3b82f6;
    }
    .grid-btn:nth-child(2) svg { fill: #f97316; }
    .grid-btn:nth-child(3) svg { fill: #3b82f6; }
    .grid-btn:nth-child(4) svg { fill: #f97316; }
    .grid-btn:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
    .grid-btn.active {
      background: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }
      /* Chat timestamp style */
.chat-timestamp {
  font-size: 11px;
  font-weight: normal;
  opacity: 0.85;
  margin-right: 6px;
  display: inline-block;
  vertical-align: middle;
  color: rgba(255, 255, 255, 0.85);
}

/* Keep timestamp aligned with username */
[data-testid="chat-message-username"] {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
  `;
  document.head.appendChild(style);
}
  }

  /* =========================
     Bootstrap
     ========================= */
  let enhancer = null;
  function initEnhancer() {
    if (enhancer) return;
    enhancer = new ChaturbateEnhancer();
    enhancer.init();
    GridManager.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancer);
  } else {
    setTimeout(initEnhancer, 80);
  }
})();