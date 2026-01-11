// ==UserScript==
// @name         kuplafix
// @namespace    kuplafix
// @version      2.1.1
// @description  kuplahotelli UI fixes & enhancements (ScriptCat edition)
// @author       res
// @match        *://kuplahotelli.com/game/nitro*
// @noframes
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/542873/kuplafix.user.js
// @updateURL https://update.greasyfork.org/scripts/542873/kuplafix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Avoid running twice (e.g. userscript + bookmarklet, or injected into iframes).
  // kuplafix reads/patches the game iframe from the top window, so we skip frame execution.
  if (window.top !== window.self) return;

  // Polyfills for Bookmarklet / Non-Userscript Manager environment
  if (typeof GM_getValue === 'undefined') {
    const prefix = 'kuplafix_gm_';
    window.GM_getValue = function(key, defaultValue) {
      const value = localStorage.getItem(prefix + key);
      return value === null ? defaultValue : JSON.parse(value);
    };
    window.GM_setValue = function(key, value) {
      localStorage.setItem(prefix + key, JSON.stringify(value));
    };
    window.GM_deleteValue = function(key) {
      localStorage.removeItem(prefix + key);
    };
    window.GM_xmlhttpRequest = function(details) {
      const method = details.method || 'GET';
      fetch(details.url, { method, headers: details.headers })
        .then(async response => {
          const text = await response.text();
          if (details.onload) {
            details.onload({
              status: response.status,
              statusText: response.statusText,
              responseText: text,
              readyState: 4
            });
          }
        })
        .catch(error => {
          if (details.onerror) details.onerror(error);
        });
    };
  }

  // Keep startup quiet; use `log` for controlled output.
  const SCRIPT_NAME = 'kuplafix';
  const SCRIPT_VERSION = '2.1.1';
  const CONFIG_KEY = 'kuplafix_config';
  const DEBUG_ENABLED = false;

  const GLOBAL_SINGLETON_KEY = '__kuplafix_singleton__';
  if (window[GLOBAL_SINGLETON_KEY]) {
    const tryRepairConfigButton = () => {
      try {
        const bind = (docRef) => {
          if (!docRef) return;
          const btn = docRef.getElementById('kuplafix-config-btn');
          if (!btn) return;
          // Force-bind click to the existing instance's exported openMenu (if available)
          btn.onclick = (e) => {
            try {
              e?.preventDefault?.();
              e?.stopPropagation?.();
            } catch (_) {}
            try {
              window.kuplafix?.openMenu?.();
            } catch (_) {}
          };
        };

        bind(document);
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentDocument) bind(iframe.contentDocument);
      } catch (_) {
        // ignore
      }
    };

    try {
      console.warn(`[${SCRIPT_NAME}] already running (v${window[GLOBAL_SINGLETON_KEY].version || '?'}) - skipping duplicate init`);
    } catch (_) {}

    // If the page got re-rendered and the old listener was lost, rebind it.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        tryRepairConfigButton();
        setTimeout(tryRepairConfigButton, 1000);
        setTimeout(tryRepairConfigButton, 3000);
      });
    } else {
      tryRepairConfigButton();
      setTimeout(tryRepairConfigButton, 1000);
      setTimeout(tryRepairConfigButton, 3000);
    }

    return;
  }
  window[GLOBAL_SINGLETON_KEY] = { version: SCRIPT_VERSION, startedAt: Date.now() };

  const ASCII_HEADER = [
    '                                                                                                 ',
    '                                                 .---.                                          ',
    '     .                   _________   _...._      |   |                   .--.                   ',
    "   .'|                   \\        |.'      '-.   |   |              _.._ |__|                    ",
    " .'  |                    \\        .'```'.    '. |   |            .' .._|.--.                    ",
    "<    |                     \\      |       \\     \\|   |    __      | '    |  | ____     _____    ",
    " |   | ____      _    _     |     |        |    ||   | .:--.'.  __| |__  |  |`.   \\  .'    /    ",
    " |   | \\ .'     | '  / |    |      \\      /    . |   |/ |   \\ ||__   __| |  |  `.  `'    .'     ",
    " |   |/  .     .' | .' |    |     |\\`'-.-'   .'  |   |`\" __ | |   | |    |  |    '.    .'       ",
    " |    /\\  \\    /  | /  |    |     | '-....-'`    |   | .'.''| |   | |    |__|    .'     `.      ",
    " |   |  \\  \\  |   `'.  |   .'     '.             '---'/ /   | |_  | |          .'  .'`.   `.    ",
    " '    \\  \\  \\ '   .'|  '/'-----------'                \\ \\._,\\ '/  | |        .'   /    `.   `.  ",
    "'------'  '---'`-'  `--'                               `--'  `\"   |_|       '----'       '----' ",
    '  '
  ].join('\n');

  // ─────────────────────────────────────────────────────────────────
  // Logging utilities
  // ─────────────────────────────────────────────────────────────────
  const log = {
    info: (...args) => console.log(`[${SCRIPT_NAME}]`, ...args),
    warn: (...args) => console.warn(`[${SCRIPT_NAME}]`, ...args),
    error: (...args) => console.error(`[${SCRIPT_NAME}]`, ...args),
    debug: (...args) => DEBUG_ENABLED && console.debug(`[${SCRIPT_NAME}]`, ...args),
  };

  log.info(`v${SCRIPT_VERSION} loading...`);

  // ─────────────────────────────────────────────────────────────────
  // Configuration Management
  // ─────────────────────────────────────────────────────────────────
  const defaultConfig = {
    browserEnabled: false,
    onlineCountEnabled: true,
    onlineCountInterval: 60000,
    gifBlockerEnabled: false,
    gifBlockerMode: 'spoiler', // 'allow-selected', 'spoiler', 'block-all'
    gifBlockerWhitelist: [],
    bubbleAlertsEnabled: true,
    bubbleAlertsShowTimestamp: true,
    bubbleAlertsAutoDespawn: {
      friendoffline: true,
      friendonline: false,
      achievement: true,
      badge_received: false,
      gift: false,
      respect: true,
      currencies: true,
    },
    menuPosition: null,
    livekitEnabled: false,
    livekitTokenEndpoint: 'https://kuplafix-livekit-auth.kuplafix.workers.dev/', // URL to Cloudflare Worker
    voiceMessagesEnabled: false,
    voiceHideRecordButton: false,
    voiceMessageCharLimit: 100,
    voiceMessageMaxDurationMs: 4000,
    voiceMessageSampleRate: 8000,
    voiceMessageUploadUrl: 'https://kuplafix-voice-worker.kuplafix.workers.dev/upload',
    chatHistoryCacheEnabled: true,
    chatHistoryCacheSize: 1000,
    chatHistoryCacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    roomLightingEnabled: false,
    roomBrightness: 1,
    roomTemperature: 0, // 0-100 yövalo (päivänvalo lämmin) aste
    fastLoadEnabled: true, // Preconnect & preload hints for faster loading
    rendererConfigHijackEnabled: false,
    rendererConfigOverrides: {},
    uiConfigOverrides: {},
    packetMacros: '[]', // JSON string of macros
    ignoredOutgoingHeaders: '[]', // JSON string of header IDs
    ignoredIncomingHeaders: '[]', // JSON string of header IDs
    featureOrder: ['online-count', 'gif-blocker', 'bubble-alerts', 'chat-history', 'room-lighting', 'livekit', 'browser', 'voice-messages', 'renderer-config', 'packet-tools'],
    collapsedFeatures: {},
  };

  const config = {
    data: {
      ...defaultConfig,
      bubbleAlertsAutoDespawn: { ...defaultConfig.bubbleAlertsAutoDespawn },
    },

    load() {
      try {
        const saved = GM_getValue(CONFIG_KEY);
        if (saved && typeof saved === 'object') {
          this.data = {
            ...defaultConfig,
            ...saved,
            bubbleAlertsAutoDespawn: {
              ...defaultConfig.bubbleAlertsAutoDespawn,
              ...(saved.bubbleAlertsAutoDespawn || {}),
            },
          };
          log.debug('Config loaded:', this.data);
        }
      } catch (e) {
        log.warn('Failed to load config:', e);
      }
    },

    save() {
      try {
        GM_setValue(CONFIG_KEY, this.data);
        log.debug('Config saved');
      } catch (e) {
        log.warn('Failed to save config:', e);
      }
    },

    get(key) {
      return this.data[key];
    },

    set(key, value) {
      if (!Object.prototype.hasOwnProperty.call(this.data, key)) {
        return;
      }

      if (key === 'bubbleAlertsAutoDespawn' && value && typeof value === 'object') {
        this.data[key] = {
          ...defaultConfig.bubbleAlertsAutoDespawn,
          ...value,
        };
      } else {
        this.data[key] = value;
      }

      this.save();
    },

    reset() {
      this.data = {
        ...defaultConfig,
        bubbleAlertsAutoDespawn: { ...defaultConfig.bubbleAlertsAutoDespawn },
      };
      this.save();
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // Safe DOM utilities
  // ─────────────────────────────────────────────────────────────────
  const DOM = {
    ready: new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve());
      } else {
        resolve();
      }
    }),

    _nitroIframeCallbacks: new Set(),
    _nitroIframeObserver: null,
    _nitroLastIframeDoc: null,
    _nitroBoundIframes: new WeakSet(),

    getNitroIframe() {
      try {
        return document.getElementById('nitro');
      } catch {
        return null;
      }
    },

    _emitNitroIframeDoc(iframeDoc) {
      if (!iframeDoc) return;
      if (iframeDoc === this._nitroLastIframeDoc) return;
      this._nitroLastIframeDoc = iframeDoc;
      this._nitroIframeCallbacks.forEach((cb) => {
        try {
          cb(iframeDoc);
        } catch (_) {
          // ignore
        }
      });
    },

    _bindNitroIframe() {
      const iframe = this.getNitroIframe();
      if (!iframe) return;

      const tryEmit = () => {
        try {
          const iframeDoc = iframe.contentDocument || null;
          if (iframeDoc) this._emitNitroIframeDoc(iframeDoc);
        } catch (_) {
          // ignore (cross-origin / not ready)
        }
      };

      // Bind load handler once per iframe element
      if (!this._nitroBoundIframes.has(iframe)) {
        try {
          iframe.addEventListener('load', () => {
            tryEmit();
          }, { passive: true });
        } catch (_) {
          // ignore
        }
        this._nitroBoundIframes.add(iframe);
      }

      // Also try immediately (already loaded)
      tryEmit();
    },

    onNitroIframeDocReady(callback) {
      if (typeof callback !== 'function') return () => {};
      this._nitroIframeCallbacks.add(callback);

      // If we already have a doc, call it soon (async to avoid re-entrancy issues)
      if (this._nitroLastIframeDoc) {
        const doc = this._nitroLastIframeDoc;
        Promise.resolve().then(() => {
          if (this._nitroIframeCallbacks.has(callback)) {
            try { callback(doc); } catch (_) {}
          }
        });
      }

      // Ensure we bind to the current iframe (if present)
      this._bindNitroIframe();

      // Observe DOM for iframe creation/replacement
      if (!this._nitroIframeObserver) {
        this._nitroIframeObserver = new MutationObserver(() => {
          this._bindNitroIframe();
        });

        try {
          this._nitroIframeObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
          });
        } catch (_) {
          // ignore
        }
      }

      return () => {
        this._nitroIframeCallbacks.delete(callback);
      };
    },

    // Get the iframe's document if available
    getIframeDoc() {
      try {
        const iframe = this.getNitroIframe();
        return iframe?.contentDocument || null;
      } catch {
        return null;
      }
    },

    // Query selector that works in iframe or main doc
    querySelector(selector, context = null) {
      if (context) return context.querySelector(selector);
      let el = document.querySelector(selector);
      if (el) return el;
      // Try iframe if main doc doesn't have it
      const iframeDoc = this.getIframeDoc();
      if (iframeDoc) {
        el = iframeDoc.querySelector(selector);
      }
      return el;
    },

    waitFor(selector, timeout = 5000) {
      return new Promise((resolve) => {
        let done = false;
        let unsubscribeIframe = null;
        let observer = null;

        const finish = (value) => {
          if (done) return;
          done = true;
          try {
            if (observer) observer.disconnect();
          } catch (_) {}
          try {
            if (unsubscribeIframe) unsubscribeIframe();
          } catch (_) {}
          resolve(value);
        };

        const checkNow = () => {
          const el = this.querySelector(selector);
          if (el) finish(el);
        };

        // Immediate check
        checkNow();
        if (done) return;

        observer = new MutationObserver(() => {
          checkNow();
        });

        try {
          observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
          });
        } catch (_) {}

        // When the Nitro iframe document becomes available (or reloads), also observe it.
        unsubscribeIframe = this.onNitroIframeDocReady((iframeDoc) => {
          try {
            if (iframeDoc?.body) {
              observer.observe(iframeDoc.body, {
                childList: true,
                subtree: true,
                attributes: false,
              });
            }
          } catch (_) {}
          checkNow();
        });

        if (timeout > 0) {
          setTimeout(() => {
            finish(null);
          }, timeout);
        }
      });
    },

    inject(tag = 'style', props = {}, targetDoc = document) {
      const docRef = targetDoc || document;
      const el = docRef.createElement(tag);
      Object.assign(el, props);
      if (tag === 'style') {
        (docRef.head || docRef.documentElement).appendChild(el);
      } else {
        (docRef.body || docRef.documentElement).appendChild(el);
      }
      return el;
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // Safe execution wrapper
  // ─────────────────────────────────────────────────────────────────
  const safe = (fn, label = 'operation') => {
    try {
      return fn();
    } catch (err) {
      log.error(`Failed in ${label}:`, err);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Feature modules
  // ─────────────────────────────────────────────────────────────────

  // Module: Styles & Theming
  const Styles = {
    async init() {
      log.debug('Styles.init()');
      await DOM.ready;
      safe(() => this.injectBaseStyles(), 'injectBaseStyles');

      // The game UI lives inside the #nitro iframe; ensure styles are also injected once it loads/reloads.
      DOM.onNitroIframeDocReady(() => {
        safe(() => this.injectBaseStyles(), 'injectBaseStyles (iframe ready)');
      });
    },

    injectBaseStyles() {
      const styleContent = `
        /* kuplafix v${SCRIPT_VERSION} base styles */

        :root {
          --kuplafix-primary: #176f8f;
          --kuplafix-accent: #7cb1c8;
          --kuplafix-bg: rgba(31, 41, 46, 0.95);
          --kuplafix-border: #364951;
        }

        /* Custom Scrollbar */
        .kuplafix-menu::-webkit-scrollbar,
        .kuplafix-console-content::-webkit-scrollbar,
        .pb-header-dropdown::-webkit-scrollbar,
        .kuplafix-chat-history-content::-webkit-scrollbar,
        #pb-content::-webkit-scrollbar {
          width: 6px;
        }

        .kuplafix-menu::-webkit-scrollbar-track,
        .kuplafix-console-content::-webkit-scrollbar-track,
        .pb-header-dropdown::-webkit-scrollbar-track,
        .kuplafix-chat-history-content::-webkit-scrollbar-track,
        #pb-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .kuplafix-menu::-webkit-scrollbar-thumb,
        .kuplafix-console-content::-webkit-scrollbar-thumb,
        .pb-header-dropdown::-webkit-scrollbar-thumb,
        .kuplafix-chat-history-content::-webkit-scrollbar-thumb,
        #pb-content::-webkit-scrollbar-thumb {
          background: var(--kuplafix-border);
          border-radius: 10px;
        }

        .kuplafix-menu::-webkit-scrollbar-thumb:hover,
        .kuplafix-console-content::-webkit-scrollbar-thumb:hover,
        .pb-header-dropdown::-webkit-scrollbar-thumb:hover,
        .kuplafix-chat-history-content::-webkit-scrollbar-thumb:hover,
        #pb-content::-webkit-scrollbar-thumb:hover {
          background: var(--kuplafix-accent);
        }

        .kuplafix-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--kuplafix-bg);
          border: 1px solid var(--kuplafix-border);
          border-radius: 8px;
          color: white;
          padding: 15px;
          width: 92%;
          max-width: 440px;
          z-index: 99999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          max-height: 80vh;
          overflow-y: auto;
        }

        .kuplafix-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center; /* center vertically so ascii and close btn align */
          gap: 10px;
          margin-bottom: 12px;
          cursor: move;
          position: relative; /* anchor close button */
          padding-right: 60px; /* leave space for the close button hovering top-right */
        }

        /* Render ASCII header as plain preformatted text without a separate "boxed" background
           so it visually matches the old script. Allow it to extend (overflow visible) and keep
           monospace formatting. */
        .kuplafix-menu-ascii {
          flex: 1 1 auto;
          display: block;
          font-family: 'Courier New', Courier, monospace;
          font-size: 6px; /* smaller so full ascii fits without clipping */
          line-height: 0.95;
          color: var(--kuplafix-accent);
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          margin: 0;
          white-space: pre; /* preserve ASCII spacing */
          max-height: none;
          overflow: visible; /* no scrollbars, let ASCII render fully */
          box-sizing: content-box;
        }

        /* Place the close button as a hoverable control in the top-right corner of the menu */
        .kuplafix-close-btn {
          position: absolute;
          right: 8px;
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(54, 73, 81, 0.7);
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.08s ease;
          font-size: 14px;
          z-index: 100001;
        }

        .kuplafix-close-btn:hover {
          background: rgba(23, 111, 143, 0.22);
          border-color: var(--kuplafix-accent);
          transform: translateY(-1px);
        }

        .kuplafix-menu-subtitle {
          margin: 0 0 18px 0;
          font-size: 13px;
          color: #a9c0cc;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .kuplafix-feature-card {
          background: rgba(17, 23, 27, 0.7);
          border: 1px solid rgba(54, 73, 81, 0.7);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 4px;
        }

        .kuplafix-feature-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .kuplafix-feature-actions-top {
          display: flex;
          justify-content: flex-end;
        }

        .kuplafix-feature-meta {
          flex: 1 1 auto;
          min-width: 0;
        }

        .kuplafix-feature-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .kuplafix-feature-description {
          font-size: 12px;
          color: #cbd6dc;
          margin-top: 4px;
          line-height: 1.4;
        }

        .kuplafix-feature-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .kuplafix-feature-status-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
        }

        .kuplafix-feature-status {
          font-size: 12px;
          color: #9fb6c1;
        }

        .kuplafix-feature-toggle-area {
          display: flex;
          justify-content: flex-end;
        }

        .kuplafix-toggle {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .kuplafix-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .kuplafix-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #2c3b43;
          transition: 0.3s;
          border-radius: 24px;
        }

        .kuplafix-toggle-slider:before {
          position: absolute;
          content: '';
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: #718792;
          transition: 0.3s;
          border-radius: 50%;
        }

        .kuplafix-toggle input:checked + .kuplafix-toggle-slider {
          background-color: var(--kuplafix-primary);
        }

        .kuplafix-toggle input:checked + .kuplafix-toggle-slider:before {
          transform: translateX(20px);
          background-color: var(--kuplafix-accent);
        }

        .kuplafix-btn {
          background: var(--kuplafix-primary);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .kuplafix-btn:hover {
          background: var(--kuplafix-accent);
        }

        .kuplafix-btn-secondary {
          background: transparent;
          color: var(--kuplafix-accent);
          border: 1px solid var(--kuplafix-border);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .kuplafix-btn-secondary:hover {
          border-color: var(--kuplafix-accent);
          color: #ffffff;
        }

        .kuplafix-btn-secondary.kuplafix-active,
        .kuplafix-btn-secondary.kuplafix-active:hover {
          background: rgba(23, 111, 143, 0.35);
          border-color: var(--kuplafix-accent);
          color: #ffffff;
        }

        .kuplafix-feature-options-panel {
          display: none;
          background: rgba(12, 18, 22, 0.7);
          border: 1px solid rgba(54, 73, 81, 0.7);
          border-radius: 6px;
          padding: 12px;
        }

        .kuplafix-feature-options-panel.kuplafix-open {
          display: block;
        }

        .kuplafix-options-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .kuplafix-options-label {
          font-size: 12px;
          color: #cbd6dc;
        }

        .kuplafix-options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .kuplafix-options-input {
          flex: 1 1 120px;
          background: rgba(12, 18, 22, 0.8);
          border: 1px solid rgba(54, 73, 81, 0.8);
          border-radius: 4px;
          padding: 6px 8px;
          color: #ffffff;
          font-size: 12px;
        }

        .kuplafix-range {
          flex: 1 1 180px;
          accent-color: var(--kuplafix-accent);
        }

        .kuplafix-inline-number {
          width: 86px;
          min-width: 70px;
        }

        .kuplafix-options-input:focus {
          outline: none;
          border-color: var(--kuplafix-accent);
          box-shadow: 0 0 0 1px rgba(124, 177, 200, 0.4);
        }

        .kuplafix-input-error {
          border-color: #c0392b !important;
        }

        /* Custom checkbox styling for macros */
        .kuplafix-macro-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(124, 177, 200, 0.4);
          border-radius: 3px;
          background: rgba(12, 18, 22, 0.8);
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .kuplafix-macro-checkbox:hover {
          border-color: rgba(124, 177, 200, 0.7);
          background: rgba(12, 18, 22, 0.95);
        }

        .kuplafix-macro-checkbox:checked {
          background: var(--kuplafix-accent);
          border-color: var(--kuplafix-accent);
        }

        .kuplafix-macro-checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          font-size: 11px;
          font-weight: bold;
          line-height: 1;
        }

        .kuplafix-macro-checkbox:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .kuplafix-options-buttons {
          display: flex;
          gap: 8px;
        }

        .kuplafix-menu-footer {
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid var(--kuplafix-border);
        }

        /* Upscale the spritesheet icon without stretching; scale the glyph 1.2x */
        #kuplafix-config-btn.kuplafix-config-button {
          width: 32px !important;
          height: 32px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-top: 0 !important;
          transform: scale(1.2) !important; /* upscale the spritesheet icon without distortion */
          font-size: inherit !important;
          line-height: 1 !important;
          padding: 0 !important;
          transform-origin: center;
        }

        /* ensure the label stays aligned with the icon */
        #kuplafix-config-btn-container .w-100.text-center {
          margin-top: 4px !important;
        }

        /* GIF Blocker styles */
        .kuplafix-gif-hidden {
          display: none !important;
          visibility: hidden !important;
        }

        .kuplafix-gif-spoiler {
          position: relative !important;
          overflow: hidden !important;
        }

        .kuplafix-gif-spoiler .chat-bubble,
        .kuplafix-gif-spoiler .chat-content {
          visibility: hidden !important;
        }

        .kuplafix-gif-spoiler-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          transition: opacity 0.2s ease;
          min-width: 200px;
          min-height: 120px;
        }

        .kuplafix-gif-spoiler-overlay:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        .kuplafix-gif-spoiler-text {
          color: #999999;
          font-size: 12px;
          text-align: center;
          font-weight: 500;
          padding: 8px;
          user-select: none;
          pointer-events: none;
        }

        .kuplafix-gif-spoiler-overlay.revealed {
          display: none !important;
        }

        .kuplafix-gif-spoiler-placeholder {
          opacity: 0.6;
          font-style: italic;
        }

        .kuplafix-whitelist-user-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(23, 111, 143, 0.3);
          border: 1px solid #7cb1c8;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          color: #ffffff;
          margin: 4px 4px 4px 0;
        }

        .kuplafix-whitelist-user-tag button {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0;
          font-size: 12px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .kuplafix-whitelist-user-tag button:hover {
          opacity: 1;
        }

        .kuplafix-whitelist-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          margin-top: 8px;
          min-height: 24px;
        }

        /* Persistent Notification Clone Styling */
        #kuplafix-notification-clones {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.25rem !important;
          pointer-events: none !important;
          width: 100% !important;
          position: relative !important;
          z-index: auto !important;
          overflow: visible !important;
          flex-shrink: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Native-like fadeInDown animation for persistent notifications */
        @keyframes kuplafix-fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #kuplafix-notification-clones .animate__animated {
          animation: kuplafix-fadeInDown 0.3s ease-out forwards;
        }

        #kuplafix-notification-clones .nitro-notification-bubble {
          background: rgba(17, 23, 27, 0.95) !important;
          border: 1px solid rgba(124, 177, 200, 0.3) !important;
          border-radius: 6px !important;
          padding: 12px 16px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
          color: #ffffff !important;
          position: relative !important;
          z-index: auto !important;
          margin: 0 !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        /* Event Invite Notification Styling */
        .kuplafix-event-notification {
          background: rgba(17, 23, 27, 0.95) !important;
          border: 1px solid rgba(124, 177, 200, 0.3) !important;
          border-radius: 6px !important;
          padding: 12px 16px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(8px);
          color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          transition: all 0.2s ease;
        }

        .kuplafix-event-notification:hover {
          border-color: rgba(124, 177, 200, 0.6) !important;
          box-shadow: 0 4px 16px rgba(23, 111, 143, 0.3) !important;
        }

        .kuplafix-event-notification-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .kuplafix-event-notification-content {
          flex: 1;
          min-width: 0;
        }

        .kuplafix-event-notification-title {
          font-weight: bold;
          font-size: 12px;
          color: #7cb1c8;
          margin-bottom: 2px;
        }

        .kuplafix-event-notification-text {
          font-size: 11px;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kuplafix-event-notification-button {
          background: var(--kuplafix-primary);
          color: white;
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .kuplafix-event-notification-button:hover {
          background: var(--kuplafix-accent);
        }

        /* Console Log Styles */
        .kuplafix-console {
          background: #0c1216;
          border: 1px solid var(--kuplafix-border);
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 11px;
          color: #cbd6dc;
          height: 400px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .kuplafix-console-header {
          background: rgba(23, 111, 143, 0.15);
          border-bottom: 1px solid var(--kuplafix-border);
          padding: 4px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kuplafix-console-content {
          flex: 1;
          overflow-y: auto;
          padding: 4px 0;
          scroll-behavior: smooth;
        }

        .kuplafix-console-line {
          padding: 2px 8px;
          border-bottom: 1px solid rgba(54, 73, 81, 0.2);
          display: flex;
          gap: 8px;
          cursor: pointer;
          transition: background 0.1s;
          white-space: nowrap;
        }

        .kuplafix-console-line:hover {
          background: rgba(23, 111, 143, 0.1);
        }

        .kuplafix-console-time {
          color: #5c707a;
          flex-shrink: 0;
          width: 55px;
        }

        .kuplafix-console-id {
          color: #7cb1c8;
          font-weight: bold;
          flex-shrink: 0;
          width: 40px;
        }

        .kuplafix-console-name {
          color: #fff;
          flex-shrink: 0;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kuplafix-console-hex {
          color: #888;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Searchable Dropdown Styles */
        .pb-header-search-container {
          position: relative;
          width: 100%;
        }

        .pb-header-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #1a2429;
          border: 1px solid var(--kuplafix-border);
          border-top: none;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .pb-header-dropdown.open {
          display: block;
        }

        .pb-header-item {
          padding: 6px 10px;
          cursor: pointer;
          font-size: 12px;
          color: #cbd6dc;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
        }

        .pb-header-item:hover {
          background: var(--kuplafix-primary);
          color: #fff;
        }

        .pb-header-item-id {
          color: #7cb1c8;
          font-weight: bold;
          font-family: monospace;
        }

        /* In-Game Browser Styles */
        .kuplafix-browser {
          position: fixed;
          background: var(--kuplafix-bg);
          border: 1px solid var(--kuplafix-border);
          border-radius: 8px;
          z-index: 100002;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          width: 800px;
          height: 600px;
          resize: both;
          min-width: 320px;
          min-height: 240px;
        }

        /* Fix white corner on resize handle/scrollbars */
        .kuplafix-browser::-webkit-scrollbar { width: 8px; height: 8px; }
        .kuplafix-browser::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .kuplafix-browser::-webkit-scrollbar-thumb { background: var(--kuplafix-border); border-radius: 4px; }
        .kuplafix-browser::-webkit-scrollbar-corner { background: transparent; }

        .kuplafix-browser-header {
          background: rgba(23, 111, 143, 0.15);
          border-bottom: 1px solid var(--kuplafix-border);
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: move;
        }

        .kuplafix-browser-title {
            font-size: 13px;
            color: #cbd6dc;
            font-weight: 600;
        }

        .kuplafix-browser-content {
            flex: 1;
            background: #000;
            position: relative;
        }

        .kuplafix-browser iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            color-scheme: dark;
            background-color: #1a2429; /* Dark background to prevent white flash/corners */
        }
        
        #kuplafix-notification-clones .nitro-notification-bubble:hover {
          border-color: rgba(124, 177, 200, 0.6) !important;
          box-shadow: 0 4px 16px rgba(23, 111, 143, 0.3) !important;
        }

        /* Ensure text content is visible */
        #kuplafix-notification-clones .nitro-notification-bubble .text-white {
          color: #ffffff !important;
        }

        /* Timestamp styling inside cloned notifications */
        #kuplafix-notification-clones .kuplafix-alert-timestamp {
          font-size: 10px !important;
          color: #7cb1c8 !important;
          opacity: 0.7 !important;
          margin-top: 4px !important;
          text-align: right !important;
        }

        /* Icon container for cloned notifications */
        #kuplafix-notification-clones .bubble-image-container {
          min-width: 24px;
          min-height: 24px;
          flex-shrink: 0;
          opacity: 0.9;
        }

        /* LiveKit Integration */
        .kuplafix-livekit-window {
          position: fixed;
          width: 960px;
          height: 600px;
          background: var(--kuplafix-bg);
          border: 1px solid var(--kuplafix-border);
          border-radius: 8px;
          z-index: 100000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          resize: both;
          overflow: hidden;
        }

        .kuplafix-livekit-header {
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid var(--kuplafix-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: move;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .kuplafix-livekit-iframe {
          flex: 1;
          border: none;
          width: 100%;
          height: 100%;
          background: #000;
        }

        /* Chat History Window */
        .kuplafix-chat-history-window {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          z-index: 9000; /* High z-index */
          display: flex;
          flex-direction: column;
          resize: both;
          overflow: hidden;
          background: rgba(20, 25, 30, 0.85);
          border: 1px solid var(--kuplafix-border);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          padding-right: 12px;
          padding-bottom: 12px;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .kuplafix-chat-history-header {
          min-height: 33px;
          max-height: 33px;
          background: transparent;
          border-bottom: 1px solid var(--kuplafix-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          cursor: move;
          position: relative;
        }

        .kuplafix-chat-history-title {
          color: #fff;
          font-weight: bold;
          font-size: 13px;
          margin-top: 0;
        }

        .kuplafix-chat-history-close {
          cursor: pointer;
          width: 20px;
          height: 20px;
          background: transparent;
          border: 1px solid rgba(54, 73, 81, 0.7);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          line-height: 1;
          transition: all 0.15s ease;
        }

        .kuplafix-chat-history-close:hover {
          background: rgba(23, 111, 143, 0.22);
          border-color: var(--kuplafix-accent);
        }

        .kuplafix-chat-history-search-bar {
          padding: 8px;
          background: transparent;
          border-bottom: 1px solid var(--kuplafix-border);
        }

        .kuplafix-chat-history-search-bar input[type="checkbox"] {
          width: 10px;
          height: 10px;
          margin: 0;
          transform: scale(0.7);
        }

        .kuplafix-chat-history-search-input {
          width: 100%;
          background: rgba(12, 18, 22, 0.8);
          border: 1px solid rgba(54, 73, 81, 0.8);
          border-radius: 4px;
          padding: 6px 8px;
          color: #ffffff;
          font-size: 12px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .kuplafix-chat-history-search-input:focus {
          outline: none;
          border-color: var(--kuplafix-accent);
        }

        .kuplafix-chat-history-content {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          background: transparent;
          display: flex;
          flex-direction: column;
          width: 100% !important; /* Ensure full width */
          box-sizing: border-box;
          font-family: 'Ubuntu', 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 500;
        }

        /* Last message highlight animation */
        @keyframes kuplafix-highlight-pulse {
          0% { background-color: transparent; }
          20% { background-color: rgba(124, 177, 200, 0.3); }
          40% { background-color: transparent; }
          60% { background-color: rgba(124, 177, 200, 0.3); }
          80% { background-color: transparent; }
          100% { background-color: rgba(124, 177, 200, 0.15); }
        }

        .kuplafix-last-message-highlight {
          animation: kuplafix-highlight-pulse 2s ease-out forwards;
          border-radius: 4px;
          position: relative;
        }

        .kuplafix-last-message-tooltip {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(23, 111, 143, 0.9);
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 10;
          opacity: 0;
          animation: kuplafix-tooltip-fade 4s ease-out forwards;
          pointer-events: none;
        }

        .kuplafix-last-message-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: rgba(23, 111, 143, 0.9);
        }

        @keyframes kuplafix-tooltip-fade {
          0% { opacity: 0; transform: translateX(-50%) translateY(5px); }
          10% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Session divider */
        .kuplafix-session-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 12px 0;
          color: #7cb1c8;
          font-size: 10px;
          opacity: 0.8;
        }

        .kuplafix-session-divider::before,
        .kuplafix-session-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(124, 177, 200, 0.4), transparent);
        }

        .kuplafix-session-divider span {
          white-space: nowrap;
          padding: 2px 8px;
          background: rgba(23, 111, 143, 0.2);
          border-radius: 10px;
        }

        /* Click timestamp tooltip */
        .kuplafix-timestamp-popup {
          position: fixed;
          background: rgba(23, 111, 143, 0.95);
          color: white;
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 99999999;
          pointer-events: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          animation: kuplafix-popup-appear 0.2s ease-out;
          transition: opacity 0.3s;
        }

        @keyframes kuplafix-popup-appear {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes kuplafix-toast-appear {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .kuplafix-toast {
          animation: kuplafix-toast-appear 0.3s ease-out !important;
        }

        .kuplafix-chat-history-content .d-flex.p-1 {
          cursor: pointer;
          transition: background 0.15s ease;
          border-radius: 4px;
        }

        .kuplafix-chat-history-content .d-flex.p-1:hover {
          background: rgba(124, 177, 200, 0.1);
        }

        /* Chat Bubble Overrides for History */
        .kuplafix-chat-history-content .bubble-container {
          position: relative !important; /* Override absolute from widget */
          top: auto !important;
          left: auto !important;
          transform: none !important;
          margin-bottom: 0 !important;
          width: fit-content !important;
          height: auto !important; /* Prevent collapse */
          min-height: 28px;
          display: block !important;
        }
        
        .kuplafix-chat-history-content .chat-bubble {
            position: relative !important; /* Fix overlap */
            top: auto !important;
            left: auto !important;
            max-width: 100% !important;
            width: auto !important;
            height: auto !important;
            transform: none !important;
            margin: 0 !important;
        }

        .kuplafix-chat-history-content .user-container {
            position: absolute !important;
            top: 0px;
            width: 24px !important;
            height: 24px !important;
            overflow: hidden !important;
            pointer-events: none;
            z-index: 1;
            display: block !important;
        }

        .kuplafix-chat-history-content .user-image {
            width: 64px;
            height: 110px;
            background-position: -20px -17px;
            background-repeat: no-repeat;
            display: block;
        }
        
        .kuplafix-chat-history-content .chat-content {
            position: relative;
            z-index: 2;
            padding-left: 32px; /* Make room for avatar */
            line-height: 1.2;
        }

        .kuplafix-chat-history-content .user-container-bg {
            height: 100% !important; /* Fix height issue in relative mode */
        }

        /* Voice message button (docked inside chat input) */
        .kuplafix-voice-selector {
          display: none; /* Hidden by default, only shown inside container */
        }

        .kuplafix-voice-progress {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: conic-gradient(var(--kuplafix-accent) calc(var(--kuplafix-progress, 0) * 1%), transparent 0);
          opacity: 0.4;
          mask: radial-gradient(circle 18px at 50% 50%, transparent 60%, black 61%);
          pointer-events: none;
        }

        .kuplafix-voice-fab-label {
          position: relative;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.4px;
          z-index: 1;
          color: #ffffff;
        }

        /* Voice playback chip inside chat */
        .kuplafix-voice-chip {
          display: inline-flex;
          align-items: center;
          margin-left: 2px;
          gap: 12px;
          border-radius: 16px;
          background: rgba(15, 20, 25, 0.92);
          font-family: inherit;
          font-size: 12px;
          cursor: default;
          user-select: none;
          position: relative;
          min-width: 220px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .kuplafix-voice-chip.playing {
          border-color: var(--kuplafix-accent);
          background: rgba(20, 25, 30, 0.96);
        }

        .kuplafix-voice-play {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: var(--kuplafix-bg);
          color: var(--kuplafix-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          padding: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          scale: 1.05;
        }

        .kuplafix-voice-play:hover {
          transform: scale(1.1);
          background: #ffffff;
          color: var(--kuplafix-bg);
        }

        .kuplafix-voice-play svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }

        /* Waveform Styling */
        .kuplafix-voice-waveform-container {
          position: relative;
          flex: 1;
          height: 24px;
          display: flex;
          align-items: center;
        }

        .kuplafix-voice-waveform-bg,
        .kuplafix-voice-waveform-fg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .kuplafix-voice-waveform-bg {
          opacity: 1;
          z-index: 1;
        }

        .kuplafix-voice-waveform-fg {
          z-index: 2;
          clip-path: inset(0 100% 0 0);
          /* No transition here, we use requestAnimationFrame for smoothness */
        }

        .kuplafix-voice-bar {
          width: 2px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 1px;
          flex-shrink: 0;
        }

        .kuplafix-voice-waveform-fg .kuplafix-voice-bar {
          background: var(--kuplafix-primary);
        }

        .kuplafix-voice-status {
          font-size: 11px;
          color: #ffffff;
          font-weight: 700;
          min-width: 35px;
          opacity: 0.9;
        }

        .nitro-chat-input-container .nitro-chat-input-control {
            font-size: 14px;
            margin-left: 5px;
            margin-top: 3px;
            outline: none;
            background: transparent;
            border-color: transparent;
            color: #fff;
            -webkit-box-shadow: none;
            box-shadow: none;
        }

        .nitro-chat-input-container.has-voice-button .nitro-chat-input-control {
            width: 50% !important;
        }

        /* Voice button docked inside chat input next to emoji/gif selectors */
        .nitro-chat-input-container .kuplafix-voice-holder {
          position: absolute;
          right: 79px;
          bottom: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          pointer-events: auto;
        }

        .nitro-chat-input-container .kuplafix-voice-selector {
          display: flex !important;
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(17, 23, 27, 0.9);
          border: 1px solid rgba(124, 177, 200, 0.5);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease, border-color 0.15s ease;
          overflow: hidden;
        }

        .nitro-chat-input-container .kuplafix-voice-selector:active {
          transform: scale(0.95);
        }

        .nitro-chat-input-container .kuplafix-voice-selector:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55);
          border-color: var(--kuplafix-accent);
        }

        .nitro-chat-input-container .kuplafix-voice-selector.recording {
          background: rgba(231, 76, 60, 0.9);
          border-color: #ff5b4d;
          box-shadow: 0 0 10px rgba(231, 76, 60, 0.4);
        }

        .nitro-chat-input-container .kuplafix-voice-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          pointer-events: none;
          background: conic-gradient(var(--kuplafix-accent) calc(var(--kuplafix-progress) * 1%), transparent 0);
          opacity: 0.3;
          mask: radial-gradient(circle 18px at 50% 50%, transparent 60%, black 61%);
        }

        /* Reorderable & Minimizable Cards */
        .kuplafix-features-list {
          display: flex;
          flex-direction: column;
          margin-bottom: 4px;
        }

        .kuplafix-feature-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
        }
        
        .kuplafix-feature-card.dragging {
          opacity: 0.5;
          border: 1px dashed var(--kuplafix-accent);
        }

        .kuplafix-feature-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 0;
          min-height: 26px;
        }

        .kuplafix-drag-handle {
          color: #546e7a;
          cursor: grab;
          font-size: 18px;
          line-height: 1;
          user-select: none;
          padding: 0 4px;
          display: flex;
          align-items: center;
        }
        
        .kuplafix-drag-handle:active {
          cursor: grabbing;
        }

        .kuplafix-feature-title-row {
          flex: 1;
          min-width: 0;
        }

        .kuplafix-header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .kuplafix-minimize-btn {
          background: transparent;
          border: none;
          color: #cbd6dc;
          cursor: pointer;
          font-size: 10px;
          transition: transform 0.2s;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .kuplafix-minimize-btn:hover {
          color: #fff;
        }

        .kuplafix-feature-card.collapsed .kuplafix-minimize-btn {
          transform: rotate(-90deg);
        }

        .kuplafix-feature-content {
          display: block;
          margin-top: 0;
          overflow: hidden;
        }

        .kuplafix-feature-card.collapsed .kuplafix-feature-content {
          display: none;
        }
        
        .kuplafix-feature-actions-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
          margin-bottom: 4px;
          padding-right: 2px;
        }

        /* Add margin to body if it follows description directly (no settings button) */
        .kuplafix-feature-description + .kuplafix-feature-body {
          margin-top: 12px;
        }
      `;

      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      docs.forEach((docRef) => {
        const existing = docRef.getElementById('kuplafix-styles');
        if (existing) existing.remove();
        DOM.inject('style', { id: 'kuplafix-styles', textContent: styleContent }, docRef);
      });
    },
  };

  // Module: UI Controls
  const UI = {
    configButton: null,
    configMenu: null,
    buttonDoc: null,

    async init() {
      log.debug('UI.init()');
      await DOM.ready;
      safe(() => this.addConfigButton(), 'addConfigButton');

      // Re-add button if iframe reloads
      DOM.onNitroIframeDocReady(() => {
        safe(() => this.addConfigButton(), 'addConfigButton (iframe ready)');
      });
    },

    addConfigButton() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      let target = null;
      let contextDoc = null;
      let placement = null;

      for (const docRef of docs) {
        const sidebar = docRef.querySelector('.side-toolbar-container');
        if (sidebar) {
          target = sidebar;
          contextDoc = docRef;
          placement = 'sidebar';
          break;
        }
      }

      if (!target) {
        for (const docRef of docs) {
          const toolbar = docRef.querySelector('.nitro-toolbar-main-icons');
          if (toolbar) {
            target = toolbar;
            contextDoc = docRef;
            placement = 'toolbar';
            break;
          }
        }
      }

      if (!target) {
        log.debug('Toolbar container not ready, retrying in 500ms...');
        setTimeout(() => this.addConfigButton(), 500);
        return;
      }

      // If a previous instance already injected the button, re-use it.
      const existingBtn = contextDoc && contextDoc.getElementById('kuplafix-config-btn');
      if (existingBtn && existingBtn.isConnected) {
        this.configButton = existingBtn;
        this.buttonDoc = contextDoc;
        // Always (re)bind using onclick so a stale dataset flag can't break clicks.
        existingBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openMenu();
        };
        existingBtn.onmouseenter = () => (existingBtn.style.opacity = '0.7');
        existingBtn.onmouseleave = () => (existingBtn.style.opacity = '1');
        safe(() => Styles.injectBaseStyles(), 'ensure styles injected into host document');
        return;
      }

      if (this.configButton && this.configButton.isConnected) return;

      let btn = null;

      if (placement === 'sidebar') {
        const wrapper = contextDoc.createElement('div');
        wrapper.className = 'mb-4';
        wrapper.id = 'kuplafix-config-btn-container';

        const iconRow = contextDoc.createElement('div');
        iconRow.className = 'text-center';

        btn = contextDoc.createElement('div');
        btn.id = 'kuplafix-config-btn';
        btn.title = 'kuplafix settings';
        btn.className = 'cursor-pointer navigation-item nitro-toolbar-icon nitro-space-right sidebar-navigation-icon icon icon-me-forums';
        btn.style.transition = 'opacity 0.2s';
  btn.classList.add('kuplafix-config-button');

        const labelRow = contextDoc.createElement('div');
        labelRow.className = 'w-100 text-center';
        labelRow.style.marginTop = '5px';

        const label = contextDoc.createElement('div');
        label.className = 'd-inline text-white fw-bold text-center nitro-small-size-text';
        label.textContent = 'kuplaFix';

        labelRow.appendChild(label);
        iconRow.appendChild(btn);
        wrapper.appendChild(iconRow);
        wrapper.appendChild(labelRow);

        target.appendChild(wrapper);
      } else {
        const container = contextDoc.createElement('div');
        container.className = 'text-center';
        container.style.marginRight = '0px';
        container.id = 'kuplafix-config-btn-container';

        btn = contextDoc.createElement('div');
        btn.id = 'kuplafix-config-btn';
        btn.className = 'cursor-pointer navigation-item icon icon-me-forums nitro-toolbar-icon';
        btn.title = 'kuplafix settings';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'opacity 0.2s';
  btn.classList.add('kuplafix-config-button');

        const labelWrap = contextDoc.createElement('div');
        labelWrap.className = 'w-100 text-center';
        labelWrap.style.marginTop = '5px';

        const label = contextDoc.createElement('div');
        label.className = 'd-inline text-white fw-bold text-center';
        label.style.fontSize = '11px';
        label.textContent = 'kuplaFix';

        labelWrap.appendChild(label);
        container.appendChild(btn);
        container.appendChild(labelWrap);

        target.appendChild(container);
      }

      if (!btn) {
        log.error('Failed to create config button');
        return;
      }

      // Use onclick handlers for idempotency (avoids multi-binding if the UI re-renders).
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openMenu();
      };
      btn.onmouseenter = () => (btn.style.opacity = '0.7');
      btn.onmouseleave = () => (btn.style.opacity = '1');

      this.configButton = btn;
      this.buttonDoc = contextDoc;
      safe(() => Styles.injectBaseStyles(), 'ensure styles injected into host document');
      log.info('✓ Config button added');
    },

    openMenu() {
      log.debug('openMenu()');
      
      // Check for updates when menu opens
      if (UpdateChecker && UpdateChecker.checkForUpdates) {
        UpdateChecker.checkForUpdates().catch(err => {
          log.debug('Update check in openMenu failed:', err);
        });
      }
      
      // Use document that hosts the config button for menu placement
      const targetDoc = this.buttonDoc || DOM.getIframeDoc() || document;

      // If any menu already exists (even from another instance), treat this as toggle-close.
      // Also prevents duplicate IDs/menus when init ran twice.
      const existingMenus = targetDoc.querySelectorAll('#kuplafix-menu');
      if (existingMenus && existingMenus.length) {
        existingMenus.forEach((m) => {
          try { m.remove(); } catch (_) {}
        });
        this.configMenu = null;
        log.debug('Existing menu(s) removed (global)');
        return;
      }
      
      if (this.configMenu && this.configMenu.isConnected) {
        this.configMenu.remove();
        log.debug('Existing menu removed');
        return;
      }

      const menu = targetDoc.createElement('div');
      menu.className = 'kuplafix-menu';
      menu.id = 'kuplafix-menu';

      const intervalSeconds = Math.max(5, Math.round((config.get('onlineCountInterval') || 60000) / 1000));
      const onlineEnabled = !!config.get('onlineCountEnabled');
      const gifBlockerEnabled = !!config.get('gifBlockerEnabled');
      const gifBlockerMode = config.get('gifBlockerMode') || 'block-all';
      const gifBlockerWhitelist = config.get('gifBlockerWhitelist') || [];
      const roomBrightness = Number.parseFloat(config.get('roomBrightness') ?? 1).toFixed(2);
        const roomTemperatureRaw = Number.parseInt(config.get('roomTemperature') ?? 0, 10);
      const roomTemperature = Number.isFinite(roomTemperatureRaw) ? Math.max(0, Math.min(100, roomTemperatureRaw)) : 0;

      const asciiHtml = ASCII_HEADER.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      // Check for pending update
      const pendingUpdate = GM_getValue('kuplafix_pending_update', null);
      let subtitleHtml = `kuplafix ${SCRIPT_VERSION} - uusin`;
      if (pendingUpdate && UpdateChecker.isNewerVersion(pendingUpdate, SCRIPT_VERSION)) {
        subtitleHtml = `
          <a href="${UpdateChecker.GREASYFORK_URL}" target="_blank" style="
            color: #7cb1c8;
            text-decoration: none;
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          " onmouseover="this.style.background='rgba(124, 177, 200, 0.1)'; this.style.border='1px solid #7cb1c8';"
             onmouseout="this.style.background='transparent'; this.style.border='1px solid transparent';">
            kuplafix ${SCRIPT_VERSION} → <span style="color: #4ade80;">${pendingUpdate}</span>
          </a>
        `;
      }

      // Feature Definitions
      const features = {
        'online-count': {
          title: 'kävijämäärä chatboxissa',
          description: 'Näytä monta hahmoa on paikalla chatboxissa ja päivitä lukema automaattisesti.',
          toggleId: 'kf-online-count',
          configKey: 'onlineCountEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-online-count" title="Muuta päivitysväliä">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-online-count">
              <form class="kuplafix-options-form" id="kuplafix-form-online-count">
                <label for="kuplafix-interval-input" class="kuplafix-options-label">Päivitysväli (sekunteina)</label>
                <div class="kuplafix-options-row">
                  <input type="number" min="5" id="kuplafix-interval-input" class="kuplafix-options-input" value="${intervalSeconds}">
                  <div class="kuplafix-options-buttons">
                    <button type="submit" class="kuplafix-btn">Tallenna</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="interval-label">Päivitysväli: ${intervalSeconds} s</div>
            </div>
          `
        },
        'gif-blocker': {
          title: 'piilota gifit',
          description: 'salli valituilta käyttäjiltä, näytä spoiler tai estä viestit kokonaan.',
          toggleId: 'kf-gif-blocker',
          configKey: 'gifBlockerEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-gif-blocker" title="Hallinnoi whitelistia">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-gif-blocker">
              <form class="kuplafix-options-form" id="kuplafix-form-gif-blocker">
                <label for="kuplafix-gif-mode-select" class="kuplafix-options-label">GIF-eston tila</label>
                <div class="kuplafix-options-row">
                  <select id="kuplafix-gif-mode-select" class="kuplafix-options-input" style="padding: 6px; font-size: 12px;">
                    <option value="allow-selected" ${gifBlockerMode === 'allow-selected' ? 'selected' : ''}>Salli valitut käyttäjät</option>
                    <option value="spoiler" ${gifBlockerMode === 'spoiler' ? 'selected' : ''}>Valikoiva (spoiler)</option>
                    <option value="block-all" ${gifBlockerMode === 'block-all' ? 'selected' : ''}>Estä kaikki</option>
                  </select>
                </div>

                <div id="kuplafix-gif-allow-section" style="display: ${gifBlockerMode === 'block-all' ? 'none' : 'block'};">
                  <label for="kuplafix-gif-username-input" class="kuplafix-options-label" style="margin-top: 12px;">Lisää käyttäjä whitelistille</label>
                  <div class="kuplafix-options-row">
                    <input type="text" id="kuplafix-gif-username-input" class="kuplafix-options-input" placeholder="Käyttäjänimi">
                    <button type="submit" class="kuplafix-btn">Lisää</button>
                  </div>
                  <label class="kuplafix-options-label" style="margin-top: 8px;">Sallitut käyttäjät:</label>
                  <div class="kuplafix-whitelist-container" id="kuplafix-gif-whitelist-list">
                    ${gifBlockerWhitelist.map(u => `<span class="kuplafix-whitelist-user-tag" data-username="${u}">${u}<button type="button" class="kuplafix-remove-whitelist-btn">✕</button></span>`).join('')}
                  </div>
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="gif-status">
                ${gifBlockerMode === 'block-all' ? 'Kaikki GIFit piilotettu' : `Sallitut: ${gifBlockerWhitelist.length > 0 ? gifBlockerWhitelist.length : 'Ei ketään'}`}
              </div>
            </div>
          `
        },
        'bubble-alerts': {
          title: 'säilytä ilmoitukset',
          description: 'valitse mitkä ilmoitukset pysyvät näkyvillä ja mitkä katoavat normaalisti (8s).',
          toggleId: 'kf-bubble-alerts',
          configKey: 'bubbleAlertsEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-bubble-alerts" title="Muuta ilmoitusasetuksia">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-bubble-alerts">
              <form class="kuplafix-options-form" id="kuplafix-form-bubble-alerts">
                <label class="kuplafix-options-label">
                  <input type="checkbox" id="kuplafix-alert-timestamp" ${config.get('bubbleAlertsShowTimestamp') ? 'checked' : ''}>
                  Näytä ilmoituksissa aikaleima
                </label>

                <label class="kuplafix-options-label" style="margin-top: 12px;">Valitse säilytettävät ilmoitustyypit:</label>
                <div id="kuplafix-alert-types" style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                  ${[
                    { id: 'friendonline', label: 'Kaveri online' },
                    { id: 'friendoffline', label: 'Kaveri offline' },
                    { id: 'respect', label: 'Respektit' },
                    { id: 'achievement', label: 'Saavutukset' },
                    { id: 'gift', label: 'Lahjat' },
                    { id: 'currencies', label: 'Valuutat' },
                  ]
                    .map(
                      (type) => `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer;">
                      <input type="checkbox" class="kuplafix-alert-type-checkbox" data-type="${type.id}" 
                        ${!(config.get('bubbleAlertsAutoDespawn')?.[type.id] ?? true) ? 'checked' : ''}>
                      <span>${type.label}</span>
                    </label>
                  `
                    )
                    .join('')}
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="alert-status" style="white-space: pre-line;">
                ${(() => {
                  const autoDespawn = config.get('bubbleAlertsAutoDespawn') || {};
                  const persistingTypes = Object.entries(autoDespawn)
                    .filter(([type, shouldDespawn]) => !shouldDespawn)
                    .map(([type]) => {
                      const typeLabels = {
                        friendonline: 'Online',
                        friendoffline: 'Offline', 
                        achievement: 'Saavutukset',
                        badge_received: 'Merkit',
                        gift: 'Lahjat',
                        respect: 'Respektit',
                        currencies: 'Valuutat'
                      };
                      return typeLabels[type] || type;
                    });
                  
                  const timeEnabled = config.get('bubbleAlertsShowTimestamp') ? '✓' : '✗';
                  const persistingText = persistingTypes.length > 0 ? persistingTypes.join(', ') : 'Ei pysyviä';
                  
                  return `Näytä aikaleima: ${timeEnabled}\nPysyvät: ${persistingText}`;
                })()}
              </div>
            </div>
          `
        },
        'room-lighting': {
          title: 'huoneen kirkkaus ja yövalo',
          description: 'säädä kirkkautta ja lisää lämmin päivänvalo -yövalo (sinivalon vähennys).',
          toggleId: 'kf-room-lighting',
          configKey: 'roomLightingEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-room-lighting" title="Kirkkaus ja värilämpötila">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-room-lighting">
              <form class="kuplafix-options-form" id="kuplafix-form-room-lighting">
                <label class="kuplafix-options-label">Kirkkaus</label>
                <div class="kuplafix-options-row" style="align-items: center;">
                  <input type="range" min="0.1" max="1.5" step="0.01" id="kuplafix-room-brightness-range" class="kuplafix-range" value="${roomBrightness}">
                  <input type="number" min="0.1" max="1.5" step="0.01" id="kuplafix-room-brightness-input" class="kuplafix-options-input kuplafix-inline-number" value="${roomBrightness}">
                </div>

                <label class="kuplafix-options-label" style="margin-top: 4px;">Yövalo / päivänvalo (0–100%)</label>
                <div class="kuplafix-options-row" style="align-items: center;">
                  <input type="range" min="0" max="100" step="1" id="kuplafix-room-temp-range" class="kuplafix-range" value="${roomTemperature}">
                  <input type="number" min="0" max="100" step="1" id="kuplafix-room-temp-input" class="kuplafix-options-input kuplafix-inline-number" value="${roomTemperature}">
                </div>

                <div class="kuplafix-options-buttons" style="flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                  <button type="button" class="kuplafix-btn" id="kuplafix-temp-preset-neutral">Pois</button>
                  <button type="button" class="kuplafix-btn" id="kuplafix-temp-preset-cool">Kevyt</button>
                  <button type="button" class="kuplafix-btn" id="kuplafix-temp-preset-warm">Vahva</button>
                  <button type="button" class="kuplafix-btn-secondary" id="kuplafix-room-reset">Palauta</button>
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="room-lighting-status">
                Kirkkaus: ${roomBrightness} · Yövalo: ${roomTemperature}%
              </div>
            </div>
          `
        },
        'livekit': {
          title: 'kupla Meetings (LiveKit)',
          description: 'näytä kuplafix meetings — voice ja näytönjako käyttäen livekit kokousta.',
          toggleId: 'kf-livekit',
          configKey: 'livekitEnabled',
          settingsBtn: '', // Settings button removed
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-livekit">
              <form class="kuplafix-options-form" id="kuplafix-form-livekit">
                <label for="kuplafix-endpoint-input" class="kuplafix-options-label">Token-palvelimen URL (Cloudflare Worker)</label>
                <div class="kuplafix-options-row">
                  <input type="text" id="kuplafix-endpoint-input" class="kuplafix-options-input" placeholder="https://..." value="${config.get('livekitTokenEndpoint') || ''}">
                  <div class="kuplafix-options-buttons">
                    <button type="submit" class="kuplafix-btn">Tallenna</button>
                  </div>
                </div>
                <div style="font-size: 10px; color: #9fb6c1; margin-top: 4px;">
                  Jätä tyhjäksi käyttääksesi oletustokenia (vain yksi käyttäjä kerrallaan).
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="livekit-status">
                ${config.get('livekitEnabled') ? 'Käytössä' : 'Pois käytöstä'}
              </div>
            </div>
          `
        },
        'chat-history': {
          title: 'parempi chat historia',
          description: 'tallenna chattiviestit välimuistiin ja paranna chat-ikkunan käytettävyyttä.',
          toggleId: 'kf-chat-history',
          configKey: 'chatHistoryCacheEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-chat-history" title="Muuta välimuistin asetuksia">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-chat-history">
              <form class="kuplafix-options-form" id="kuplafix-form-chat-history">
                <label for="kuplafix-chat-size-input" class="kuplafix-options-label">Välimuistin koko (viestejä)</label>
                <div class="kuplafix-options-row">
                  <input type="number" min="100" max="5000" id="kuplafix-chat-size-input" class="kuplafix-options-input" value="${config.get('chatHistoryCacheSize') || 1000}">
                </div>
                
                <label for="kuplafix-chat-expiry-input" class="kuplafix-options-label" style="margin-top: 8px;">Vanhenemisaika (päivää)</label>
                <div class="kuplafix-options-row">
                  <input type="number" min="1" max="30" id="kuplafix-chat-expiry-input" class="kuplafix-options-input" value="${Math.round((config.get('chatHistoryCacheExpiry') || 604800000) / 86400000)}">
                </div>
                
                <div class="kuplafix-options-buttons" style="margin-top: 12px;">
                  <button type="submit" class="kuplafix-btn">Tallenna asetukset</button>
                  <button type="button" class="kuplafix-btn" id="kuplafix-clear-chat-btn" style="background: #c0392b;">Tyhjennä välimuisti</button>
                </div>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="chat-status">
                Viestejä: max ${config.get('chatHistoryCacheSize') || 1000}<br>
                Vanhentuu: ${Math.round((config.get('chatHistoryCacheExpiry') || 604800000) / 86400000)} päivässä
              </div>
            </div>
          `
        },
        'voice-messages': {
          title: 'ääniviestit',
          description: 'nauhoita ja lähetä se ääniviesti chatissa.<br>vain muut kuplafix käyttäjät voi kuunnella ääniviestejä.',
          toggleId: 'kf-voice-messages',
          configKey: 'voiceMessagesEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-voice-messages" title="Ääniviestien asetukset">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-voice-messages">
              <form class="kuplafix-options-form" id="kuplafix-form-voice-messages">
                <label class="kuplafix-options-label">
                  <input type="checkbox" id="kuplafix-voice-hide-record" ${config.get('voiceHideRecordButton') ? 'checked' : ''}>
                  piilota äänitys nappi
                </label>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status" data-role="voice-status">
                nauhoitus nappi: ${config.get('voiceHideRecordButton') ? 'piilossa' : 'näkyvissä'}
              </div>
            </div>
          `
        },
        'renderer-config': {
          title: 'client muokkaus',
          description: 'muokkaa pelin renderer-config.json tiedostoa ennen latausta.',
          toggleId: 'kf-renderer-config',
          configKey: 'rendererConfigHijackEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-options-renderer-config" title="Muokkaa muuttujia">Asetukset</button>`,
          content: `
            <div class="kuplafix-feature-options-panel" id="kuplafix-panel-renderer-config">
              <form class="kuplafix-options-form" id="kuplafix-form-renderer-config">
                <div style="margin-bottom: 8px;">
                  <label class="kuplafix-options-label" style="display: block; margin-bottom: 4px;">Renderer Config (JSON):</label>
                  <textarea id="kuplafix-renderer-overrides" style="width: 100%; height: 60px; background: rgba(0,0,0,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; font-family: monospace; font-size: 11px; padding: 4px; resize: vertical;" placeholder='{"system.packet.log": true}'>${JSON.stringify(config.get('rendererConfigOverrides') || {}, null, 2)}</textarea>
                </div>
                <div style="margin-bottom: 8px;">
                  <label class="kuplafix-options-label" style="display: block; margin-bottom: 4px;">UI Config (JSON):</label>
                  <textarea id="kuplafix-ui-overrides" style="width: 100%; height: 60px; background: rgba(0,0,0,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; font-family: monospace; font-size: 11px; padding: 4px; resize: vertical;" placeholder='{"catalog.links.enabled": false}'>${JSON.stringify(config.get('uiConfigOverrides') || {}, null, 2)}</textarea>
                </div>
                <button type="submit" class="kuplafix-btn">Tallenna muuttujat</button>
              </form>
            </div>
            <div class="kuplafix-feature-status-row">
              <div class="kuplafix-feature-status">
                Muuttujia: ${Object.keys(config.get('rendererConfigOverrides') || {}).length + Object.keys(config.get('uiConfigOverrides') || {}).length} kpl
              </div>
            </div>
          `
        },
        'packet-tools': {
          title: 'packet tools',
          description: 'työkaluja pakettien lähettämiseen ja tutkimiseen.',
          headerBtn: '<button id="kuplafix-open-builder-header" class="kuplafix-btn" style="padding: 2px 8px; font-size: 11px; height: auto;">Packet Builder</button>',
          content: ''
        },
        'browser': {
          title: 'kupla etusivu -nappi',
          description: 'lisää painike vasempaan valikkoon, josta voit selata etusivua poistumatta pelistä.',
          toggleId: 'kf-browser',
          configKey: 'browserEnabled',
          settingsBtn: `<button class="kuplafix-btn-secondary" id="kuplafix-open-browser-now">Avaa</button>`,
          content: ``
        }
      };

      // Generate HTML based on order
      let featureOrder = config.get('featureOrder') || ['online-count', 'gif-blocker', 'browser', 'bubble-alerts', 'room-lighting', 'livekit', 'chat-history', 'voice-messages', 'renderer-config', 'packet-tools'];
      
      // Ensure all defined features are in the list (in case config is stale)
      const definedFeatures = Object.keys(features);
      const missingFeatures = definedFeatures.filter(f => !featureOrder.includes(f));
      if (missingFeatures.length > 0) {
          featureOrder = [...featureOrder, ...missingFeatures];
      }

      const collapsedFeatures = config.get('collapsedFeatures') || {};

      const featuresHtml = featureOrder.map(id => {
        const f = features[id];
        if (!f) return '';
        const isCollapsed = !!collapsedFeatures[id];
        const isEnabled = !!config.get(f.configKey);
        
        return `
        <div class="kuplafix-feature-card ${isCollapsed ? 'collapsed' : ''}" data-feature="${id}">
          <div class="kuplafix-feature-header">
            <div class="kuplafix-drag-handle" title="Raahaa muuttaaksesi järjestystä">⋮⋮</div>
            <div class="kuplafix-feature-title-row">
              <div class="kuplafix-feature-title">${f.title}</div>
            </div>
            <div class="kuplafix-header-controls">
              ${f.headerBtn || ''}
              ${f.toggleId ? `
              <label class="kuplafix-toggle" title="Ota ominaisuus käyttöön tai pois">
                <input type="checkbox" id="${f.toggleId}" ${isEnabled ? 'checked' : ''}>
                <span class="kuplafix-toggle-slider"></span>
              </label>
              ` : ''}
              ${(f.content || f.settingsBtn) ? `<button class="kuplafix-minimize-btn" title="${isCollapsed ? 'Laajenna' : 'Pienennä'}">▼</button>` : ''}
            </div>
          </div>
          <div class="kuplafix-feature-content">
            <div class="kuplafix-feature-description">${f.description}</div>
            ${f.settingsBtn ? `<div class="kuplafix-feature-actions-row">${f.settingsBtn}</div>` : ''}
            <div class="kuplafix-feature-body">
              ${f.content}
            </div>
          </div>
        </div>
        `;
      }).join('');

      menu.innerHTML = `
        <div class="kuplafix-menu-header" data-kuplafix-drag-handle>
          <pre class="kuplafix-menu-ascii">${asciiHtml}</pre>
          <button class="kuplafix-close-btn" id="kuplafix-close-btn" aria-label="Sulje asetukset">✕</button>
        </div>
        <div class="kuplafix-menu-subtitle">${subtitleHtml}</div>

        <div class="kuplafix-features-list">
          ${featuresHtml}
        </div>

        <div class="kuplafix-menu-footer" style="padding-top:15px; margin-top:15px; border-top:1px solid var(--kuplafix-border);">
          <button class="kuplafix-btn" id="kuplafix-reset-btn" style="width: 100%; background: #7f8c8d; cursor: pointer;">Palauta oletukset</button>
        </div>
      `;

      (targetDoc.body || targetDoc.documentElement).appendChild(menu);
      this.configMenu = menu;
      log.info('✓ Config menu opened');

      // Bind handlers
      const browserBtn = targetDoc.getElementById('kuplafix-open-browser-now');
      if (browserBtn) {
          browserBtn.onclick = () => Browser.open();
      }

      this.applyStoredPosition(menu, targetDoc);
      const viewForPosition = targetDoc.defaultView || window;
      if (viewForPosition && typeof viewForPosition.requestAnimationFrame === 'function') {
        viewForPosition.requestAnimationFrame(() => this.applyStoredPosition(menu, targetDoc));
      }

      // Make menu draggable by header
      const dragHandle = menu.querySelector('[data-kuplafix-drag-handle]');
      if (dragHandle) {
        this.makeDraggable(menu, dragHandle, targetDoc, this.handleDragEnd.bind(this));
      }

      // --- Drag and Drop Logic for Features ---
      const featuresList = menu.querySelector('.kuplafix-features-list');
      let draggedItem = null;

      // Enable dragging only when handle is held
      featuresList.addEventListener('mousedown', (e) => {
        if (e.target.closest('.kuplafix-drag-handle')) {
          const card = e.target.closest('.kuplafix-feature-card');
          if (card) card.setAttribute('draggable', 'true');
        }
      });

      featuresList.addEventListener('mouseup', (e) => {
        const card = e.target.closest('.kuplafix-feature-card');
        if (card) card.setAttribute('draggable', 'false');
      });

      featuresList.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.kuplafix-feature-card');
        if (draggedItem && draggedItem.getAttribute('draggable') === 'true') {
          draggedItem.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', draggedItem.dataset.feature);
        } else {
          e.preventDefault();
        }
      });

      featuresList.addEventListener('dragend', (e) => {
        if (draggedItem) {
          draggedItem.classList.remove('dragging');
          draggedItem.setAttribute('draggable', 'false');
          draggedItem = null;
          
          // Save new order
          const newOrder = Array.from(featuresList.querySelectorAll('.kuplafix-feature-card'))
            .map(card => card.dataset.feature);
          config.set('featureOrder', newOrder);
        }
      });

      featuresList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(featuresList, e.clientY);
        const currentDraggable = featuresList.querySelector('.dragging');
        if (!currentDraggable) return;
        
        if (afterElement == null) {
          featuresList.appendChild(currentDraggable);
        } else {
          featuresList.insertBefore(currentDraggable, afterElement);
        }
      });

      function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kuplafix-feature-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
      }

      // --- Minimize/Expand Logic ---
      featuresList.addEventListener('click', (e) => {
        const minimizeBtn = e.target.closest('.kuplafix-minimize-btn');
        if (minimizeBtn) {
          const card = minimizeBtn.closest('.kuplafix-feature-card');
          const featureId = card.dataset.feature;
          const isCollapsed = card.classList.toggle('collapsed');
          
          minimizeBtn.title = isCollapsed ? 'Laajenna' : 'Pienennä';
          
          const collapsedState = config.get('collapsedFeatures') || {};
          collapsedState[featureId] = isCollapsed;
          config.set('collapsedFeatures', collapsedState);
        }
      });

      // Event listeners
      const closeBtn = menu.querySelector('#kuplafix-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          menu.remove();
          this.configMenu = null;
          log.debug('Menu closed');
        });
      }

      // Helper function to close all other panels
      const closeOtherPanels = (excludePanel) => {
        const allPanels = menu.querySelectorAll('[id^="kuplafix-panel-"]');
        const allBtns = menu.querySelectorAll('[id^="kuplafix-options-"]');
        
        allPanels.forEach((panel) => {
          if (panel !== excludePanel && panel.classList.contains('kuplafix-open')) {
            panel.classList.remove('kuplafix-open');
            // Find and deactivate corresponding button
            const btnId = panel.id.replace('kuplafix-panel-', 'kuplafix-options-');
            const btn = menu.querySelector(`#${btnId}`);
            if (btn) btn.classList.remove('kuplafix-active');
          }
        });
      };

      // Helper for toggle binding
      const bindFeatureToggle = (id, configKey, name, callback) => {
        const toggle = menu.querySelector('#' + id);
        if (toggle) {
          toggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            config.set(configKey, enabled);
            UI.showToast(`${name} ${enabled ? 'käytössä' : 'pois käytöstä'}`);
            if (callback) callback(enabled);
          });
        }
      };

      bindFeatureToggle('kf-online-count', 'onlineCountEnabled', 'Kävijämäärä', () => {
        ChatEnhancements.refreshState(true);
      });

      bindFeatureToggle('kf-browser', 'browserEnabled', 'Kupla Etusivu', (enabled) => {
        if (typeof Browser !== 'undefined') {
          if (enabled) {
            Browser.addButton();
          } else {
            Browser.removeButton();
            Browser.closeWindow(); // Close window if disabling feature
          }
        }
      });
      
      const onlineOptionsBtn = menu.querySelector('#kuplafix-options-online-count');
      const onlineOptionsPanel = menu.querySelector('#kuplafix-panel-online-count');
      const onlineOptionsForm = menu.querySelector('#kuplafix-form-online-count');
      const intervalInput = menu.querySelector('#kuplafix-interval-input');
      const intervalLabel = menu.querySelector('[data-role="interval-label"]');

      if (onlineOptionsBtn && onlineOptionsPanel) {
        onlineOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(onlineOptionsPanel);
          
          const opened = onlineOptionsPanel.classList.toggle('kuplafix-open');
          if (opened) {
            onlineOptionsBtn.classList.add('kuplafix-active');
            if (intervalInput) {
              intervalInput.classList.remove('kuplafix-input-error');
              intervalInput.focus();
            }
          } else {
            onlineOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (onlineOptionsForm && intervalInput && onlineOptionsPanel && onlineOptionsBtn) {
        onlineOptionsForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const parsed = Number.parseInt(intervalInput.value, 10);
          if (!Number.isFinite(parsed) || parsed < 5) {
            intervalInput.classList.add('kuplafix-input-error');
            intervalInput.focus();
            return;
          }
          intervalInput.classList.remove('kuplafix-input-error');
          intervalInput.value = String(parsed);
          config.set('onlineCountInterval', parsed * 1000);
          if (intervalLabel) {
            intervalLabel.textContent = `Päivitysväli: ${parsed} s`;
          }
          onlineOptionsPanel.classList.remove('kuplafix-open');
          onlineOptionsBtn.classList.remove('kuplafix-active');
          ChatEnhancements.refreshState(true);
          UI.showToast('Päivitysväli tallennettu.');
        });
      }

      const resetBtn = menu.querySelector('#kuplafix-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Palautetaanko asetukset oletuksiin?')) {
            config.reset();
            ChatEnhancements.refreshState(true);
            GifBlocker.updateAllDocuments();
            this.saveMenuPosition(null);
            menu.remove();
            this.configMenu = null;
            this.openMenu();
          }
        });
      }

      bindFeatureToggle('kf-gif-blocker', 'gifBlockerEnabled', 'GIF-esto', (enabled) => {
          GifBlocker.toggleFeature(enabled);
      });

      const gifBlockerOptionsBtn = menu.querySelector('#kuplafix-options-gif-blocker');
      const gifBlockerPanel = menu.querySelector('#kuplafix-panel-gif-blocker');
      const gifBlockerForm = menu.querySelector('#kuplafix-form-gif-blocker');
      const gifUsernameInput = menu.querySelector('#kuplafix-gif-username-input');
      const gifWhitelistContainer = menu.querySelector('#kuplafix-gif-whitelist-list');
      const gifStatusLabel = menu.querySelector('[data-role="gif-status"]');

      if (gifBlockerOptionsBtn && gifBlockerPanel) {
        gifBlockerOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(gifBlockerPanel);
          
          const opened = gifBlockerPanel.classList.toggle('kuplafix-open');
          if (opened) {
            gifBlockerOptionsBtn.classList.add('kuplafix-active');
            if (gifUsernameInput) {
              gifUsernameInput.focus();
            }
          } else {
            gifBlockerOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (gifBlockerForm && gifUsernameInput) {
        gifBlockerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const username = gifUsernameInput.value.trim();
          if (!username) {
            gifUsernameInput.classList.add('kuplafix-input-error');
            return;
          }
          gifUsernameInput.classList.remove('kuplafix-input-error');
          
          const currentMode = config.get('gifBlockerMode') || 'block-all';
          
          if (currentMode !== 'block-all') {
            GifBlocker.addToWhitelist(username);
            const whitelist = config.get('gifBlockerWhitelist') || [];
            gifWhitelistContainer.innerHTML = whitelist.map(u => `<span class="kuplafix-whitelist-user-tag" data-username="${u}">${u}<button type="button" class="kuplafix-remove-whitelist-btn">✕</button></span>`).join('');
            gifStatusLabel.textContent = `Sallitut: ${whitelist.length > 0 ? whitelist.length : 'Ei ketään'}`;
            
            // Re-attach remove listeners
            gifWhitelistContainer.querySelectorAll('.kuplafix-remove-whitelist-btn').forEach(btn => {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tag = btn.closest('.kuplafix-whitelist-user-tag');
                const user = tag.getAttribute('data-username');
                GifBlocker.removeFromWhitelist(user);
                tag.remove();
                const updated = config.get('gifBlockerWhitelist') || [];
                gifStatusLabel.textContent = `Sallitut: ${updated.length}`;
              });
            });
            UI.showToast(`Käyttäjä ${username} lisätty sallittuihin.`);
          }
          
          gifUsernameInput.value = '';
        });
      }

      if (gifWhitelistContainer) {
        gifWhitelistContainer.querySelectorAll('.kuplafix-remove-whitelist-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = btn.closest('.kuplafix-whitelist-user-tag');
            const user = tag.getAttribute('data-username');
            GifBlocker.removeFromWhitelist(user);
            tag.remove();
            const updated = config.get('gifBlockerWhitelist') || [];
            const currentMode = config.get('gifBlockerMode') || 'block-all';
            if (currentMode !== 'block-all') {
              gifStatusLabel.textContent = `Sallitut: ${updated.length > 0 ? updated.length : 'Ei ketään'}`;
            }
          });
        });
      }

      // Mode selector handler - toggle visibility of sections and update status
      const gifModeSelect = menu.querySelector('#kuplafix-gif-mode-select');
      const gifAllowSection = menu.querySelector('#kuplafix-gif-allow-section');
      
      if (gifModeSelect) {
        gifModeSelect.addEventListener('change', (e) => {
          const newMode = e.target.value;
          config.set('gifBlockerMode', newMode);
          
          // Show/hide sections based on mode
          if (gifAllowSection) {
            gifAllowSection.style.display = newMode === 'block-all' ? 'none' : 'block';
          }
          
          // Update status label
          const whitelist = config.get('gifBlockerWhitelist') || [];
          if (newMode === 'block-all') {
            gifStatusLabel.textContent = 'Kaikki GIF:t estetään';
          } else {
            gifStatusLabel.textContent = `Sallitut: ${whitelist.length > 0 ? whitelist.length : 'Ei ketään'}`;
          }
          
          GifBlocker.updateAllDocuments();
        });
      }

      // Room lighting handlers
      const roomLightingToggle = menu.querySelector('#kf-room-lighting');
      const roomLightingOptionsBtn = menu.querySelector('#kuplafix-options-room-lighting');
      const roomLightingPanel = menu.querySelector('#kuplafix-panel-room-lighting');
      const roomLightingForm = menu.querySelector('#kuplafix-form-room-lighting');
      const roomBrightnessRange = menu.querySelector('#kuplafix-room-brightness-range');
      const roomBrightnessInput = menu.querySelector('#kuplafix-room-brightness-input');
      const roomTempRange = menu.querySelector('#kuplafix-room-temp-range');
      const roomTempInput = menu.querySelector('#kuplafix-room-temp-input');
      const roomStatusLabel = menu.querySelector('[data-role="room-lighting-status"]');
      const tempPresetCool = menu.querySelector('#kuplafix-temp-preset-cool');
      const tempPresetNeutral = menu.querySelector('#kuplafix-temp-preset-neutral');
      const tempPresetWarm = menu.querySelector('#kuplafix-temp-preset-warm');
      const roomResetBtn = menu.querySelector('#kuplafix-room-reset');

      const updateRoomStatus = () => {
        if (!roomStatusLabel) return;
        const bright = RoomLighting.clamp(roomBrightnessInput?.value ?? 1, 0.1, 1.5);
        const temp = Math.round(RoomLighting.clamp(roomTempInput?.value ?? 0, 0, 100));
        roomStatusLabel.textContent = `Kirkkaus: ${bright.toFixed(2)} · Sinivalon vähennys: ${temp}%`;
      };

      const applyRoomLighting = () => {
        if (!roomBrightnessRange || !roomBrightnessInput || !roomTempRange || !roomTempInput) return;

        const bright = RoomLighting.clamp(roomBrightnessRange.value, 0.1, 1.5);
        const temp = Math.round(RoomLighting.clamp(roomTempRange.value, -100, 100));

        roomBrightnessRange.value = bright;
        roomBrightnessInput.value = bright.toFixed(2);
        roomTempRange.value = temp;
        roomTempInput.value = temp;

        config.set('roomBrightness', bright);
        config.set('roomTemperature', temp);

        updateRoomStatus();
        RoomLighting.refresh();
      };

      bindFeatureToggle('kf-room-lighting', 'roomLightingEnabled', 'Huonevalaistus', (enabled) => {
        if (enabled) {
          RoomLighting.refresh();
        } else {
          RoomLighting.clear();
        }
      });

      if (roomLightingOptionsBtn && roomLightingPanel) {
        roomLightingOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(roomLightingPanel);
          const opened = roomLightingPanel.classList.toggle('kuplafix-open');
          if (opened) {
            roomLightingOptionsBtn.classList.add('kuplafix-active');
            roomBrightnessRange?.focus();
          } else {
            roomLightingOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      const syncBrightness = (value) => {
        if (!roomBrightnessRange || !roomBrightnessInput) return;
        const v = RoomLighting.clamp(value, 0.1, 1.5);
        roomBrightnessRange.value = v;
        roomBrightnessInput.value = Number.parseFloat(v).toFixed(2);
        config.set('roomBrightness', v);
        updateRoomStatus();
      };

      const syncTemperature = (value) => {
        if (!roomTempRange || !roomTempInput) return;
        const v = Math.round(RoomLighting.clamp(value, 0, 100));
        roomTempRange.value = v;
        roomTempInput.value = v;
        config.set('roomTemperature', v);
        updateRoomStatus();
      };

      if (roomLightingForm) {
        roomLightingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          applyRoomLighting();
          UI.showToast('Huonevalaistuksen asetukset tallennettu.');
        });
      }

      roomBrightnessRange?.addEventListener('input', () => {
        syncBrightness(roomBrightnessRange.value);
        RoomLighting.refresh();
      });

      roomBrightnessInput?.addEventListener('change', () => {
        syncBrightness(roomBrightnessInput.value);
        RoomLighting.refresh();
      });

      roomTempRange?.addEventListener('input', () => {
        syncTemperature(roomTempRange.value);
        RoomLighting.refresh();
      });

      roomTempInput?.addEventListener('change', () => {
        syncTemperature(roomTempInput.value);
        RoomLighting.refresh();
      });

      tempPresetCool?.addEventListener('click', () => {
        syncTemperature(35);
        RoomLighting.refresh();
      });

      tempPresetNeutral?.addEventListener('click', () => {
        syncTemperature(0);
        RoomLighting.refresh();
      });

      tempPresetWarm?.addEventListener('click', () => {
        syncTemperature(65);
        RoomLighting.refresh();
      });

      roomResetBtn?.addEventListener('click', () => {
        syncBrightness(defaultConfig.roomBrightness);
        syncTemperature(defaultConfig.roomTemperature);
        RoomLighting.refresh();
      });

      updateRoomStatus();

      // Bubble Alerts handlers
      bindFeatureToggle('kf-bubble-alerts', 'bubbleAlertsEnabled', 'Kuplailmoitukset', () => {
        BubbleAlerts.init();
      });

      // LiveKit handler
      bindFeatureToggle('kf-livekit', 'livekitEnabled', 'LiveKit', (enabled) => {
        const statusLabel = menu.querySelector('[data-role="livekit-status"]');
        if (statusLabel) {
          statusLabel.textContent = enabled ? 'Käytössä' : 'Pois käytöstä';
        }
        if (enabled) {
          LiveKit.addButton();
        } else {
          LiveKit.removeButton();
        }
      });

      const livekitOptionsBtn = menu.querySelector('#kuplafix-options-livekit');
      const livekitPanel = menu.querySelector('#kuplafix-panel-livekit');
      const livekitForm = menu.querySelector('#kuplafix-form-livekit');
      const livekitEndpointInput = menu.querySelector('#kuplafix-endpoint-input');

      if (livekitOptionsBtn && livekitPanel) {
        livekitOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(livekitPanel);
          const opened = livekitPanel.classList.toggle('kuplafix-open');
          if (opened) {
            livekitOptionsBtn.classList.add('kuplafix-active');
            if (livekitEndpointInput) livekitEndpointInput.focus();
          } else {
            livekitOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (livekitForm && livekitEndpointInput) {
        livekitForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const url = livekitEndpointInput.value.trim();
          config.set('livekitTokenEndpoint', url);
          livekitPanel.classList.remove('kuplafix-open');
          livekitOptionsBtn.classList.remove('kuplafix-active');
          UI.showToast('LiveKit-tokenin päätepiste tallennettu.');
        });
      }

      const bubbleAlertsOptionsBtn = menu.querySelector('#kuplafix-options-bubble-alerts');
      const bubbleAlertsPanel = menu.querySelector('#kuplafix-panel-bubble-alerts');
      const alertTimestampCheckbox = menu.querySelector('#kuplafix-alert-timestamp');
      const alertStatusLabel = menu.querySelector('[data-role="alert-status"]');

      // Function to update alert status display
      const updateAlertStatusDisplay = () => {
        if (!alertStatusLabel) return;
        
        const autoDespawn = config.get('bubbleAlertsAutoDespawn') || {};
        const persistingTypes = Object.entries(autoDespawn)
          .filter(([type, shouldDespawn]) => !shouldDespawn)
          .map(([type]) => {
            const typeLabels = {
              friendonline: 'Online',
              friendoffline: 'Offline', 
              achievement: 'Saavutukset',
              badge_received: 'Merkit',
              gift: 'Lahjat',
              respect: 'Respektit',
              currencies: 'Valuutat'
            };
            return typeLabels[type] || type;
          });
        
        const timeEnabled = config.get('bubbleAlertsShowTimestamp') ? '✓' : '✗';
        const persistingText = persistingTypes.length > 0 ? persistingTypes.join(', ') : 'Ei pysyviä';
        
        alertStatusLabel.textContent = `Näytä aikaleima: ${timeEnabled}\nPysyvät: ${persistingText}`;
        alertStatusLabel.style.whiteSpace = 'pre-line';
      };

      if (bubbleAlertsOptionsBtn && bubbleAlertsPanel) {
        bubbleAlertsOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(bubbleAlertsPanel);
          
          const opened = bubbleAlertsPanel.classList.toggle('kuplafix-open');
          if (opened) {
            bubbleAlertsOptionsBtn.classList.add('kuplafix-active');
          } else {
            bubbleAlertsOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      // Auto-save on timestamp checkbox change
      if (alertTimestampCheckbox) {
        alertTimestampCheckbox.addEventListener('change', (e) => {
          config.set('bubbleAlertsShowTimestamp', e.target.checked);
          updateAlertStatusDisplay();
          BubbleAlerts.init();
        });
      }

      // Auto-save on alert type checkbox changes
      const alertTypeCheckboxes = menu.querySelectorAll('.kuplafix-alert-type-checkbox');
      alertTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const autoDespawn = {};
          alertTypeCheckboxes.forEach(cb => {
            autoDespawn[cb.dataset.type] = !cb.checked;
          });
          config.set('bubbleAlertsAutoDespawn', autoDespawn);
          updateAlertStatusDisplay();
          BubbleAlerts.init();
        });
      });

      // Chat History handlers
      bindFeatureToggle('kf-chat-history', 'chatHistoryCacheEnabled', 'Chat-historia', (enabled) => {
        if (enabled) {
          ChatHistoryCache.init();
          ChatHistoryUI.init();
        }
      });

      const chatHistoryOptionsBtn = menu.querySelector('#kuplafix-options-chat-history');
      const chatHistoryPanel = menu.querySelector('#kuplafix-panel-chat-history');
      const chatHistoryForm = menu.querySelector('#kuplafix-form-chat-history');
      const chatSizeInput = menu.querySelector('#kuplafix-chat-size-input');
      const chatExpiryInput = menu.querySelector('#kuplafix-chat-expiry-input');
      const chatClearBtn = menu.querySelector('#kuplafix-clear-chat-btn');
      const chatStatusLabel = menu.querySelector('[data-role="chat-status"]');

      if (chatHistoryOptionsBtn && chatHistoryPanel) {
        chatHistoryOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(chatHistoryPanel);
          const opened = chatHistoryPanel.classList.toggle('kuplafix-open');
          if (opened) {
            chatHistoryOptionsBtn.classList.add('kuplafix-active');
          } else {
            chatHistoryOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (chatHistoryForm) {
        chatHistoryForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const size = parseInt(chatSizeInput.value, 10);
          const expiryDays = parseInt(chatExpiryInput.value, 10);
          
          if (size && size >= 100) {
            config.set('chatHistoryCacheSize', size);
            ChatHistoryCache.maxCacheSize = size;
          }
          
          if (expiryDays && expiryDays >= 1) {
            const ms = expiryDays * 24 * 60 * 60 * 1000;
            config.set('chatHistoryCacheExpiry', ms);
            ChatHistoryCache.expiryTime = ms;
          }
          
          if (chatStatusLabel) {
            chatStatusLabel.innerHTML = `Viestejä: max ${config.get('chatHistoryCacheSize')}<br>Vanhentuu: ${Math.round(config.get('chatHistoryCacheExpiry') / 86400000)} päivässä`;
          }
          
          chatHistoryPanel.classList.remove('kuplafix-open');
          chatHistoryOptionsBtn.classList.remove('kuplafix-active');
          UI.showToast('Välimuistin asetukset tallennettu.');
        });
      }
      
      if (chatClearBtn) {
        chatClearBtn.addEventListener('click', () => {
          if (confirm('Haluatko varmasti tyhjentää viestihistorian välimuistin?')) {
            ChatHistoryCache.clearCache();
            UI.showToast('Välimuisti tyhjennetty.');
          }
        });
      }

      // Voice messages toggle
      bindFeatureToggle('kf-voice-messages', 'voiceMessagesEnabled', 'Ääniviestit', (enabled) => {
        if (enabled) {
          VoiceMessages.init();
        } else {
          VoiceMessages.teardown?.();
        }
      });

      // Voice messages options
      const voiceOptionsBtn = menu.querySelector('#kuplafix-options-voice-messages');
      const voicePanel = menu.querySelector('#kuplafix-panel-voice-messages');
      const voiceHideRecordCheckbox = menu.querySelector('#kuplafix-voice-hide-record');
      const voiceStatusLabel = menu.querySelector('[data-role="voice-status"]');

      if (voiceOptionsBtn && voicePanel) {
        voiceOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(voicePanel);
          const opened = voicePanel.classList.toggle('kuplafix-open');
          if (opened) {
            voiceOptionsBtn.classList.add('kuplafix-active');
          } else {
            voiceOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (voiceHideRecordCheckbox) {
        voiceHideRecordCheckbox.addEventListener('change', (e) => {
          const hide = !!e.target.checked;
          config.set('voiceHideRecordButton', hide);

          // Update status label in the open menu
          if (voiceStatusLabel) {
            voiceStatusLabel.textContent = `Kesto: ${(config.get('voiceMessageMaxDurationMs') || 4000) / 1000} s · Silta: ${config.get('voiceMessageCharLimit') || 100} merkkiä · Näyte: ${config.get('voiceMessageSampleRate') || 8000} Hz (sopeutuu limiitille) · REC: ${hide ? 'piilossa' : 'näkyvissä'}`;
          }

          // Apply to both documents (main + Nitro iframe)
          try {
            if (typeof VoiceMessages !== 'undefined' && VoiceMessages.applyFabVisibility) {
              VoiceMessages.applyFabVisibility(document);
              const iframeDoc = DOM.getIframeDoc?.();
              if (iframeDoc) VoiceMessages.applyFabVisibility(iframeDoc);
            }
          } catch (_) {
            // ignore
          }
          UI.showToast(`Tallennuspainike ${hide ? 'piilotettu' : 'näkyvissä'}.`);
        });
      }

      // Renderer Config options
      const rendererOptionsBtn = menu.querySelector('#kuplafix-options-renderer-config');
      const rendererPanel = menu.querySelector('#kuplafix-panel-renderer-config');
      const rendererForm = menu.querySelector('#kuplafix-form-renderer-config');
      const rendererOverridesTextarea = menu.querySelector('#kuplafix-renderer-overrides');
      const uiOverridesTextarea = menu.querySelector('#kuplafix-ui-overrides');

      if (rendererOptionsBtn && rendererPanel) {
        rendererOptionsBtn.addEventListener('click', () => {
          closeOtherPanels(rendererPanel);
          const opened = rendererPanel.classList.toggle('kuplafix-open');
          if (opened) {
            rendererOptionsBtn.classList.add('kuplafix-active');
          } else {
            rendererOptionsBtn.classList.remove('kuplafix-active');
          }
        });
      }

      if (rendererForm && rendererOverridesTextarea && uiOverridesTextarea) {
        rendererForm.addEventListener('submit', (e) => {
          e.preventDefault();
          try {
            const rVal = rendererOverridesTextarea.value.trim();
            const uVal = uiOverridesTextarea.value.trim();
            
            const rParsed = JSON.parse(rVal);
            const uParsed = JSON.parse(uVal);
            
            config.set('rendererConfigOverrides', rParsed);
            config.set('uiConfigOverrides', uParsed);
            
            UI.showToast('Muuttujat tallennettu. Päivitä sivu (F5) jotta muutokset tulevat voimaan.');
          } catch (err) {
            UI.showToast('Virheellinen JSON-muoto: ' + err.message, 'error');
          }
        });
      }

      bindFeatureToggle('kf-renderer-config', 'rendererConfigHijackEnabled', 'Renderöijän konfiguraatio', (enabled) => {
        if (enabled) {
          ConfigHijacker.init();
        }
      });

      // Packet Tools Listeners
      const openBuilderBtn = menu.querySelector('#kuplafix-open-builder-header');
      if (openBuilderBtn) {
        log.debug('Packet Builder button found, attaching listener');
        openBuilderBtn.addEventListener('click', (e) => {
          e.preventDefault();
          log.info('Packet Builder button clicked');
          try {
              if (typeof PacketBuilder !== 'undefined') {
                  PacketBuilder.toggle();
              } else {
                  log.error('PacketBuilder not found');
                  UI.showToast('Internal Error: PacketBuilder not found', 'error');
              }
          } catch (err) {
              log.error('Error opening PacketBuilder:', err);
          }
        });
      } else {
          log.warn('Packet Builder button NOT found in menu');
      }

      bindFeatureToggle('kuplafix-packet-logging', 'packetLoggingEnabled', 'Pakettiloki', (enabled) => {
          PacketManager.loggingEnabled = enabled;
      });
      
      log.debug('Config menu event handlers attached');
    },

    showToast(message, type = 'info', docRef = document) {
      const doc = docRef || document;
      const existing = doc.querySelector('.kuplafix-toast');
      if (existing) existing.remove();

      const toast = doc.createElement('div');
      toast.className = 'kuplafix-timestamp-popup kuplafix-toast';
      if (type === 'error') toast.style.background = 'rgba(220, 53, 69, 0.95)';
      toast.textContent = message;
      
      toast.style.position = 'fixed';
      toast.style.bottom = '5%';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.zIndex = '100000000';
      toast.style.pointerEvents = 'none';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      
      (doc.body || doc.documentElement).appendChild(toast);

      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(10px) scale(0.9)';
          setTimeout(() => {
            if (toast.parentElement) toast.remove();
          }, 300);
        }
      }, 3000);
    },

    makeDraggable(element, handle, docRef = document, onDragEnd) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      
      handle.style.cursor = 'move';
      handle.addEventListener('mousedown', dragMouseDown);

      function dragMouseDown(e) {
        if (e.target.closest('#kuplafix-close-btn')) {
          return;
        }
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Prevent text selection while dragging
        docRef.body.style.userSelect = 'none';
        docRef.body.style.webkitUserSelect = 'none';

        const rect = element.getBoundingClientRect();
        element.style.transform = 'translate(0, 0)';
        element.style.left = `${rect.left}px`;
        element.style.top = `${rect.top}px`;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        docRef.addEventListener('mouseup', closeDragElement);
        docRef.addEventListener('mousemove', elementDrag);
      }

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const view = docRef.defaultView || window;
        const viewportWidth = view.innerWidth || docRef.documentElement.clientWidth;
        const viewportHeight = view.innerHeight || docRef.documentElement.clientHeight;
        const maxLeft = Math.max(0, viewportWidth - element.offsetWidth);
        const maxTop = Math.max(0, viewportHeight - element.offsetHeight);
        const candidateLeft = element.offsetLeft - pos1;
        const candidateTop = element.offsetTop - pos2;
        const nextLeft = Math.min(Math.max(0, candidateLeft), maxLeft);
        const nextTop = Math.min(Math.max(0, candidateTop), maxTop);
        element.style.left = `${nextLeft}px`;
        element.style.top = `${nextTop}px`;
      }

      function closeDragElement() {
        docRef.removeEventListener('mouseup', closeDragElement);
        docRef.removeEventListener('mousemove', elementDrag);
        
        // Restore text selection
        docRef.body.style.userSelect = '';
        docRef.body.style.webkitUserSelect = '';

        if (typeof onDragEnd === 'function') {
          onDragEnd(element, docRef);
        }
      }
    },

    applyStoredPosition(menu, docRef) {
      const stored = config.get('menuPosition');
      if (!stored || typeof stored !== 'object') {
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        return;
      }

      const view = docRef?.defaultView || window;
      const rect = menu.getBoundingClientRect();
      const width = rect.width || menu.offsetWidth;
      const height = rect.height || menu.offsetHeight;
      const viewportWidth = view?.innerWidth || docRef?.documentElement?.clientWidth || window.innerWidth;
      const viewportHeight = view?.innerHeight || docRef?.documentElement?.clientHeight || window.innerHeight;
      const maxLeft = Math.max(0, viewportWidth - width);
      const maxTop = Math.max(0, viewportHeight - height);
      const left = Math.min(Math.max(0, Number(stored.x) || 0), maxLeft);
      const top = Math.min(Math.max(0, Number(stored.y) || 0), maxTop);

      menu.style.transform = 'translate(0, 0)';
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.right = 'auto';
      menu.style.bottom = 'auto';
    },

    handleDragEnd(element, docRef) {
      this.saveMenuPosition(element, docRef);
    },

    saveMenuPosition(element, docRef) {
      if (element === null) {
        config.set('menuPosition', null);
        return;
      }

      if (!element) return;
      const rect = element.getBoundingClientRect();
      const view = docRef?.defaultView || window;
      const viewportWidth = view?.innerWidth || docRef?.documentElement?.clientWidth || window.innerWidth;
      const viewportHeight = view?.innerHeight || docRef?.documentElement?.clientHeight || window.innerHeight;
      const maxLeft = Math.max(0, viewportWidth - rect.width);
      const maxTop = Math.max(0, viewportHeight - rect.height);
      const left = Math.min(Math.max(0, rect.left), maxLeft);
      const top = Math.min(Math.max(0, rect.top), maxTop);
      config.set('menuPosition', { x: Math.round(left), y: Math.round(top) });
    },

    applyStyles() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      docs.forEach((docRef) => {
        const styleEl = docRef.getElementById('kuplafix-styles');
        if (styleEl) styleEl.remove();
      });

      safe(() => Styles.injectBaseStyles(), 'reinjection styles after config change');
    },
  };

  // Module: Chat Enhancements
  /**
   * Module: Chat Input Observer
   * Watches for the chat input area to appear/disappear and re-hooks features.
   */
  const ChatInputObserver = {
    observers: new Map(),

    async init() {
      log.debug('ChatInputObserver.init()');
      await DOM.ready;
      
      // Observe main document
      this.observe(document);
      
      // Observe iframe when it's ready
      DOM.onNitroIframeDocReady((doc) => {
        this.observe(doc);
      });
    },

    observe(doc) {
      if (!doc || this.observers.has(doc)) return;

      log.debug('Starting ChatInputObserver for', doc === document ? 'main' : 'iframe');

      const observer = new MutationObserver((mutations) => {
        let shouldRehook = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) {
                if (node.classList?.contains('nitro-chat-input-container') || 
                    node.classList?.contains('nitro-chat-input-control') ||
                    node.querySelector?.('.nitro-chat-input-container, .nitro-chat-input-control')) {
                  shouldRehook = true;
                  break;
                }
              }
            }
          }
          if (shouldRehook) break;
        }

        if (shouldRehook) {
          log.debug('Chat input detected, re-hooking features');
          this.rehook(doc);
        }
      });

      try {
        observer.observe(doc.body || doc.documentElement, {
          childList: true,
          subtree: true
        });
        this.observers.set(doc, observer);
      } catch (e) {
        log.warn('Failed to start MutationObserver on doc', e);
      }
      
      // Initial check
      this.rehook(doc);
    },

    rehook(doc) {
      // Re-hook online count
      if (config.get('onlineCountEnabled')) {
        if (typeof ChatEnhancements !== 'undefined' && ChatEnhancements.updateOnlineCount) {
          ChatEnhancements.updateOnlineCount(true);
        }
      }
      
      // Re-hook voice record button
      if (config.get('voiceMessagesEnabled')) {
        if (typeof VoiceMessages !== 'undefined' && VoiceMessages.applyFabVisibility) {
          VoiceMessages.applyFabVisibility(doc);
        }
      }
    }
  };

  const ChatEnhancements = {
    intervalId: null,
    pendingRequest: false,
    defaultPlaceholder: null,

    async init() {
      log.debug('ChatEnhancements.init()');
      await DOM.ready;
      this.refreshState(true);

      // Re-apply placeholder if iframe reloads
      DOM.onNitroIframeDocReady(() => {
        if (config.get('onlineCountEnabled')) {
          this.updateOnlineCount(true);
        }
      });
    },

    refreshState(forceRestart = false) {
      const enabled = !!config.get('onlineCountEnabled');
      if (!enabled) {
        this.stop();
        this.restorePlaceholder();
        return;
      }

      if (forceRestart) {
        this.start(true);
        return;
      }

      this.start();
    },

    start(immediate = false) {
      this.stop();
      this.captureDefaultPlaceholder();
      if (immediate) {
        this.updateOnlineCount(true);
      } else {
        this.updateOnlineCount();
      }
      const interval = this.getInterval();
      this.intervalId = setInterval(() => this.updateOnlineCount(), interval);
      log.debug('Online count updater started with interval', interval, 'ms');
    },

    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        log.debug('Online count updater stopped');
      }
    },

    getInterval() {
      const configured = Number(config.get('onlineCountInterval'));
      if (!Number.isFinite(configured) || configured < 5000) return 60000;
      return configured;
    },

    captureDefaultPlaceholder() {
      const chatInput = this.resolveChatInput();
      if (!chatInput) return;
      if (chatInput.hasAttribute('data-kuplafix-default-placeholder')) {
        this.defaultPlaceholder = chatInput.getAttribute('data-kuplafix-default-placeholder');
        return;
      }
      const fallback = chatInput.placeholder || 'Paina tähän chattaaksesi';
      chatInput.setAttribute('data-kuplafix-default-placeholder', fallback);
      this.defaultPlaceholder = fallback;
    },

    resolveChatInput() {
      return DOM.querySelector('.nitro-chat-input-control');
    },

    setPlaceholder(text) {
      const chatInput = this.resolveChatInput();
      if (!chatInput) return;
      chatInput.placeholder = text;
    },

    restorePlaceholder() {
      if (!this.defaultPlaceholder) return;
      this.setPlaceholder(this.defaultPlaceholder);
    },

    updateOnlineCount(isImmediate = false) {
      if (!config.get('onlineCountEnabled')) return;

      const chatInput = this.resolveChatInput();
      if (!chatInput) {
        if (isImmediate) {
          setTimeout(() => this.updateOnlineCount(true), 1000);
        }
        return;
      }

      this.captureDefaultPlaceholder();

      if (this.pendingRequest) return;
      this.pendingRequest = true;

      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://kuplahotelli.com/api/online-count',
        onload: (response) => {
          this.pendingRequest = false;
          try {
                       const data = JSON.parse(response.responseText);
            const count = Number(data?.data?.onlineCount);
            if (Number.isFinite(count) && count >= 0) {
              const label = `${count} hahmoa paikalla`;
              this.setPlaceholder(label);
              log.debug('Online count updated:', count);
            }
          } catch (e) {
            log.warn('Failed to parse online count:', e);
          }
        },
        onerror: (err) => {
          this.pendingRequest = false;
          log.warn('Failed to fetch online count:', err);
        },
      });
    },
  };

  // Module: Update Checker
  const UpdateChecker = {
    GREASYFORK_URL: 'https://update.greasyfork.org/scripts/542873/kuplafix.user.js',
    GREASYFORK_VIEW_URL: 'https://greasyfork.org/en/scripts/542873-kuplafix',
    CHECK_INTERVAL: 60 * 60 * 1000, // 1 hour
    UPDATE_KEY: 'kuplafix_last_update_check',
    NOTIFICATION_KEY: 'kuplafix_update_notification_shown',
    LATEST_VERSION_KEY: 'kuplafix_latest_version',
    latestVersion: null,

    async init() {
      try {
        log.info('UpdateChecker.init() starting...');
        await DOM.ready;
        log.info('DOM ready, loading cached version...');
        this.latestVersion = GM_getValue(this.LATEST_VERSION_KEY, null);
        log.info('Cached version loaded:', this.latestVersion);
        
        // Don't check for updates on page load (will check when menu opens)
        // Just show badge if we already know about an update from cache
        if (this.latestVersion && this.isNewerVersion(this.latestVersion, SCRIPT_VERSION)) {
          log.info('Update detected from cache:', this.latestVersion);
          this.showBadge(this.latestVersion);
          this.updateMenuHeader(this.latestVersion);
        } else {
          log.info('No cached update available');
        }
      } catch (err) {
        log.error('UpdateChecker.init() failed:', err);
      }
    },

    async checkForUpdates() {
      const lastCheck = GM_getValue(this.UPDATE_KEY, 0);
      const now = Date.now();
      const timeSinceLastCheck = now - lastCheck;
      const CHECK_THROTTLE = 60 * 1000; // 1 minute throttle
      
      log.info(`checkForUpdates called. Last check: ${lastCheck}, Now: ${now}, Difference: ${timeSinceLastCheck}ms (${Math.round(timeSinceLastCheck / 1000)}s)`);
      
      // Throttle to avoid hammering GreasyFork
      if (timeSinceLastCheck < CHECK_THROTTLE && lastCheck > 0) {
        log.info(`⏭️ Update check throttled - last check was ${Math.round(timeSinceLastCheck / 1000)}s ago`);
        return;
      }

      try {
        const url = this.GREASYFORK_URL + '?t=' + now;
        log.info('Fetching latest version from GreasyFork: ' + url);
        const self = this; // Preserve 'this' context
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
              'Cache-Control': 'no-cache'
            },
            onload: (response) => {
              log.info('GreasyFork response received, status: ' + response.status);
              GM_setValue(this.UPDATE_KEY, Date.now());
              self.parseAndNotifyUpdate(response.responseText);
              resolve();
            },
            onerror: (err) => {
              log.warn('Failed to check for updates:', err);
              reject(err);
            },
          });
        });
      } catch (err) {
        log.warn('Update check failed:', err);
      }
    },

    parseAndNotifyUpdate(html) {
      try {
        log.debug('parseAndNotifyUpdate called, response length:', html.length);
        
        // Look for version in GreasyFork metadata
        const versionMatch = html.match(/Version:\s*([0-9.]+)/i) || 
                           html.match(/@version\s+([0-9.]+)/);
        
        if (!versionMatch || !versionMatch[1]) {
          log.warn('Could not extract version from GreasyFork - checking response format');
          log.debug('First 500 chars of response:', html.substring(0, 500));
          return;
        }

        const latestVersion = versionMatch[1];
        const currentVersion = SCRIPT_VERSION;
        
        log.info(`Version extracted: latest=${latestVersion}, current=${currentVersion}`);
        
        // Store the latest version
        GM_setValue(this.LATEST_VERSION_KEY, latestVersion);
        this.latestVersion = latestVersion;

        const isNewer = this.isNewerVersion(latestVersion, currentVersion);
        log.info(`Version comparison result: isNewer=${isNewer}`);

        if (isNewer) {
          log.info(`Update available: ${currentVersion} → ${latestVersion}`);
          this.showBadge(latestVersion);
          this.updateMenuHeader(latestVersion);
          // Don't show a separate notification - just show in menu
        } else {
          log.debug(`Already on latest version (${currentVersion})`);
          GM_deleteValue('kuplafix_pending_update');
        }
      } catch (err) {
        log.warn('Error parsing update information:', err);
      }
    },

    isNewerVersion(latest, current) {
      const parseVersion = (v) => v.split('.').map(x => parseInt(x) || 0);
      const latestParts = parseVersion(latest);
      const currentParts = parseVersion(current);

      for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;
        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
      }
      return false;
    },

    showBadge() {
      // Badge on config button - disabled for now since it's too subtle
      // Users see the red UPDATE text in the menu which is much more visible
      log.debug('Update available, but relying on menu text visibility');
    },

    updateMenuHeader(latestVersion) {
      // Store version so UI can use it when rendering menu
      GM_setValue('kuplafix_pending_update', latestVersion);
      
      // If menu is open, update it (menu can live in iframe doc)
      const docs = [];
      if (UI && UI.buttonDoc) docs.push(UI.buttonDoc);
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      const seen = new Set();
      for (const docRef of docs) {
        if (!docRef || seen.has(docRef)) continue;
        seen.add(docRef);
        const menu = docRef.querySelector('.kuplafix-menu');
        if (menu) this.updateMenuHeaderLink(latestVersion, docRef);
      }
    },

    updateMenuHeaderLink(latestVersion, docRef = document) {
      const subtitle = docRef.querySelector('.kuplafix-menu-subtitle');
      if (!subtitle) return;

      const currentVersion = SCRIPT_VERSION;
      
      // Replace subtitle with clickable link
      subtitle.innerHTML = `
        <a href="${this.GREASYFORK_VIEW_URL}" target="_blank" style="
          color: #7cb1c8;
          text-decoration: none;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        " onmouseover="this.style.background='rgba(124, 177, 200, 0.1)'; this.style.border='1px solid #7cb1c8';"
           onmouseout="this.style.background='transparent'; this.style.border='1px solid transparent';">
          kuplafix ${currentVersion} → <span style="color: #4ade80;">${latestVersion}</span>
        </a>
      `;
      log.debug('Menu header updated');
    },

    showNotification() {
      // Notification disabled - menu text is more visible and consistent with design
      log.debug('Update notification skipped - relying on menu text visibility');
    },
  };

  // Module: GIF Blocker
  const GifBlocker = {
    pollingIntervals: [],
    monitoredDocs: new Set(),
    _observerByDoc: new WeakMap(),
    _debounceByDoc: new WeakMap(),
    
    async init() {
      log.debug('GifBlocker.init()');
      await DOM.ready;
      safe(() => this.startMonitoring(), 'GIF blocker monitoring');

      // Ensure we attach inside the Nitro iframe once its document is available (and after reloads).
      DOM.onNitroIframeDocReady((iframeDoc) => {
        try {
          if (iframeDoc && !this.monitoredDocs.has(iframeDoc)) {
            log.debug('[GifBlocker] Nitro iframe doc ready, setting up monitoring');
            this.monitorDocument(iframeDoc);
          }
        } catch (_) {
          // ignore
        }
      });
    },

    startMonitoring() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      docs.forEach((docRef) => {
        this.monitorDocument(docRef);
      });
    },

    monitorDocument(docRef) {
      // Skip if already monitoring this document
      if (this.monitoredDocs.has(docRef)) {
        log.debug('[GifBlocker] Already monitoring', docRef === document ? 'main' : 'iframe', 'document');
        return;
      }
      
      this.monitoredDocs.add(docRef);
      
      // Hide existing GIFs on page load
      this.updateVisibility(docRef);

      // MutationObserver + debounce is enough; avoid hot polling.
      try {
        const root = docRef.body || docRef.documentElement;
        if (!root) return;

        const schedule = () => {
          const existing = this._debounceByDoc.get(docRef);
          if (existing) return;
          const handle = setTimeout(() => {
            this._debounceByDoc.delete(docRef);
            this.updateVisibility(docRef);
          }, 150);
          this._debounceByDoc.set(docRef, handle);
        };

        const observer = new MutationObserver(() => schedule());
        observer.observe(root, {
          childList: true,
          subtree: true,
          attributes: false,
        });

        this._observerByDoc.set(docRef, observer);
        log.debug('[GifBlocker] MutationObserver started on', docRef === document ? 'main' : 'iframe', 'document');
      } catch (err) {
        log.debug('[GifBlocker] Could not set up MutationObserver:', err);
      }
    },

    updateVisibility(docRef) {
      if (!config.get('gifBlockerEnabled')) {
        // Show all hidden GIFs if feature is disabled
        const hidden = docRef.querySelectorAll('[data-gif-blocked="true"], .kuplafix-gif-spoiler');
        hidden.forEach((el) => {
          el.removeAttribute('data-gif-blocked');
          el.classList.remove('kuplafix-gif-spoiler');
          el.style.display = '';
          el.style.visibility = '';
          const overlay = el.querySelector('.kuplafix-gif-spoiler-overlay');
          if (overlay) overlay.remove();
        });
        
        // Restore spoiler GIFs that were replaced with placeholders
        const placeholders = docRef.querySelectorAll('.kuplafix-gif-spoiler-placeholder');
        placeholders.forEach((placeholder) => {
          const messageSpan = placeholder.closest('.message');
          if (messageSpan) {
            const gifImg = messageSpan.querySelector('img[src*=".gif"]');
            if (gifImg) {
              gifImg.style.display = '';
              placeholder.remove();
            }
          }
        });
        return;
      }

      const whitelist = config.get('gifBlockerWhitelist') || [];
      const gifBlockerMode = config.get('gifBlockerMode') || 'block-all';
      // Get all potential GIF containers
      let chatBubbles = Array.from(docRef.querySelectorAll('.chat-bubble.is-gif'));
      
      // Also search by GIF image src as fallback
      const gifImages = docRef.querySelectorAll('img[src*=".gif"]');
      gifImages.forEach(img => {
        const bubble = img.closest('.chat-bubble');
        if (bubble && !chatBubbles.includes(bubble)) {
          chatBubbles.push(bubble);
        }
      });
      
      log.debug(`[GifBlocker] Found ${chatBubbles.length} GIF bubbles`, { docRef: docRef === document ? 'main' : 'iframe', mode: gifBlockerMode, whitelisted: whitelist.length });

      chatBubbles.forEach((bubble) => {
        const username = this.extractUsername(bubble);
        const isWhitelisted = username ? whitelist.includes(username) : false;
        
        const container = bubble.closest('.bubble-container');
        const targetElement = container || bubble;
        
        // Clean up overlays and placeholders only when switching away from spoiler mode
        const overlay = targetElement.querySelector('.kuplafix-gif-spoiler-overlay');
        if (overlay) overlay.remove();
        
        // Only remove placeholders if we're NOT in spoiler mode
        if (gifBlockerMode !== 'spoiler') {
          const messageSpan = bubble.querySelector('.message');
          if (messageSpan) {
            const placeholders = messageSpan.querySelectorAll('.kuplafix-gif-spoiler-placeholder');
            placeholders.forEach(p => p.remove());
            // Also restore GIF visibility when removing placeholders
            const gifImg = messageSpan.querySelector('img[src*=".gif"]');
            if (gifImg) {
              gifImg.style.display = '';
              gifImg.dataset.gifSpoilerEnabled = '';
            }
          }
        }

        if (isWhitelisted) {
          // Always show if in whitelist - restore all GIFs
          targetElement.removeAttribute('data-gif-blocked');
          targetElement.classList.remove('kuplafix-gif-spoiler');
          targetElement.style.display = '';
          targetElement.style.visibility = '';
          // Restore GIF visibility
          const messageSpan = bubble.querySelector('.message');
          const gifImg = messageSpan?.querySelector('img[src*=".gif"]');
          if (gifImg) gifImg.style.display = '';
        } else if (gifBlockerMode === 'allow-selected') {
          // Standard block mode - hide all non-whitelisted
          targetElement.setAttribute('data-gif-blocked', 'true');
          targetElement.classList.remove('kuplafix-gif-spoiler');
          targetElement.style.display = 'none';
          targetElement.style.visibility = 'hidden';
        } else if (gifBlockerMode === 'spoiler') {
          // Spoiler mode - replace GIF with text placeholder
          targetElement.removeAttribute('data-gif-blocked');
          targetElement.classList.remove('kuplafix-gif-spoiler');
          targetElement.style.display = '';
          targetElement.style.visibility = '';
          
          // Find the GIF image in the chat bubble
          const gifImg = bubble.querySelector('img[src*=".gif"]');
          if (gifImg) {
            // Skip if already processed in spoiler mode
            if (gifImg.dataset.gifSpoilerEnabled === 'processed') {
              // Already processed, do nothing
            } else {
              // Mark as processed
              gifImg.dataset.gifSpoilerEnabled = 'processed';
              
              // Find message span - it's the parent of the img
              const messageSpan = gifImg.closest('.message');
              if (messageSpan) {
                log.debug('[GifBlocker] Creating spoiler placeholder for GIF');
                
                // Store original GIF for toggling
                const originalGif = gifImg.cloneNode(true);
                originalGif.dataset.gifSpoilerEnabled = 'processed';
                
                // Create placeholder text
                const placeholder = docRef.createElement('span');
                placeholder.className = 'kuplafix-gif-spoiler-placeholder';
                placeholder.textContent = '[näytä GIF]';
                
                // Create a wrapper for the GIF to display it on a new line
                const gifWrapper = docRef.createElement('div');
                gifWrapper.style.display = 'none';
                gifWrapper.style.marginTop = '4px';
                
                let isRevealed = false;
                
                placeholder.addEventListener('click', (e) => {
                  e.stopPropagation();
                  isRevealed = !isRevealed;
                  
                  if (isRevealed) {
                    // Show GIF on new line
                    gifImg.style.display = 'none';
                    placeholder.style.display = 'none';
                    gifWrapper.style.display = 'block';
                    if (!gifWrapper.contains(originalGif)) {
                      gifWrapper.appendChild(originalGif);
                    }
                    originalGif.style.display = '';
                  } else {
                    // Hide GIF, show placeholder
                    gifWrapper.style.display = 'none';
                    gifImg.style.display = '';
                    placeholder.style.display = '';
                  }
                });
                
                // Initially show placeholder, hide GIF
                gifImg.style.display = 'none';
                messageSpan.insertBefore(placeholder, gifImg);
                messageSpan.insertBefore(gifWrapper, gifImg);
                log.debug('[GifBlocker] Spoiler placeholder inserted');
              } else {
                log.debug('[GifBlocker] Could not find message span for GIF');
              }
            }
          }
        } else if (gifBlockerMode === 'block-all') {
          // Block all mode - hide all GIFs regardless
          targetElement.setAttribute('data-gif-blocked', 'true');
          targetElement.classList.remove('kuplafix-gif-spoiler');
          targetElement.style.display = 'none';
          targetElement.style.visibility = 'hidden';
        }
      });
    },

    extractUsername(bubble) {
      // Look for username in chat bubble structure
      let usernameEl = bubble.querySelector('.username');
      if (usernameEl) {
        const username = usernameEl.textContent.trim().replace(/:\s*$/, '');
        log.debug(`[GifBlocker] Found username via direct selector: "${username}"`);
        return username;
      }

      // Try parent containers if in history
      const parent = bubble.closest('.bubble-container, [data-index]');
      if (parent) {
        const nameEl = parent.querySelector('.username, b.username');
        if (nameEl) {
          const username = nameEl.textContent.trim().replace(/:\s*$/, '');
          log.debug(`[GifBlocker] Found username via parent selector: "${username}"`);
          return username;
        }
      }

      log.debug(`[GifBlocker] Failed to extract username from bubble`, { bubble });
      return null;
    },

    addToWhitelist(username) {
      if (!username) return;
      const whitelist = config.get('gifBlockerWhitelist') || [];
      if (!whitelist.includes(username)) {
        whitelist.push(username);
        config.set('gifBlockerWhitelist', whitelist);
        this.updateAllDocuments();
        log.debug('Added to GIF whitelist:', username);
      }
    },

    removeFromWhitelist(username) {
      if (!username) return;
      const whitelist = config.get('gifBlockerWhitelist') || [];
      const index = whitelist.indexOf(username);
      if (index !== -1) {
        whitelist.splice(index, 1);
        config.set('gifBlockerWhitelist', whitelist);
        this.updateAllDocuments();
        log.debug('Removed from GIF whitelist:', username);
      }
    },

    updateAllDocuments() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);

      docs.forEach((docRef) => {
        this.updateVisibility(docRef);
      });
    },

    toggleFeature(enabled) {
      config.set('gifBlockerEnabled', !!enabled);
      this.updateAllDocuments();
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // Room Lighting (Brightness & Temperature)
  // ─────────────────────────────────────────────────────────────────
  const RoomLighting = {
    observers: new Map(),
    pendingApply: new WeakMap(),

    clamp(value, min, max) {
      const n = Number.parseFloat(value);
      if (!Number.isFinite(n)) return min;
      return Math.min(max, Math.max(min, n));
    },

    isEnabled() {
      return !!config.get('roomLightingEnabled');
    },

    async init() {
      log.debug('RoomLighting.init()');
      await DOM.ready;
      this.setupObserversForDoc(document);
      this.applyToDoc(document);

      DOM.onNitroIframeDocReady((iframeDoc) => {
        log.debug('RoomLighting: iframe doc ready');
        this.setupObserversForDoc(iframeDoc);
        this.applyToDoc(iframeDoc);
      });
    },

    getDocs() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);
      return docs;
    },

    setupObserversForDoc(docRef) {
      if (this.observers.has(docRef)) return; // Already observing this doc
      
      const target = docRef.body || docRef.documentElement;
      if (!target) return;

      const observer = new MutationObserver(() => {
        if (!this.isEnabled()) return;
        const pending = this.pendingApply.get(docRef);
        if (pending) clearTimeout(pending);
        const handle = setTimeout(() => {
          this.pendingApply.delete(docRef);
          this.applyToDoc(docRef);
        }, 120);
        this.pendingApply.set(docRef, handle);
      });

      observer.observe(target, { childList: true, subtree: true });
      this.observers.set(docRef, observer);
      log.debug('RoomLighting observer attached to document');
    },

    teardown() {
      this.observers.forEach((obs) => obs.disconnect());
      this.observers.clear();
      this.pendingApply = new WeakMap();
    },

    refresh() {
      if (!this.isEnabled()) {
        this.clear();
        return;
      }
      this.applyFilters();
    },

    buildFilter() {
      const brightness = this.clamp(config.get('roomBrightness') ?? 1, 0.1, 1.5);
      const nightLight = this.clamp(config.get('roomTemperature') ?? 0, 0, 100) / 100; // 0..1
      
      // Yellowy Night Light (linux-night-light style):
      // - Sepia provides the yellow base (removing blue)
      // - Slight negative hue rotate to align with standard warm light (3000K-4000K)
      // - Saturation boost to keep it from looking gray/brown
      
      const sepia = 0.7 * nightLight;              // Good yellow base
      const hue = -10 * nightLight;                // Very slight warm shift
      const saturation = 1 + (0.5 * nightLight);   // Keep colors alive
      const brightnessAdj = 1 - (0.05 * nightLight); // Very slight dimming
      
      return `brightness(${brightness * brightnessAdj}) sepia(${sepia}) hue-rotate(${hue}deg) saturate(${saturation})`;
    },

    findTargets(docRef) {
      return Array.from(
        docRef.querySelectorAll(
          '.roomView-background canvas, canvas.roomView, canvas.room-view, canvas#nitro-room-canvas, canvas.nitro-room-canvas'
        )
      );
    },

    applyFilters() {
      const filter = this.buildFilter();
      this.getDocs().forEach((docRef) => this.applyToDoc(docRef, filter));
    },

    applyToDoc(docRef, filterStr = null) {
      if (!this.isEnabled()) return;
      const filter = filterStr || this.buildFilter();
      const targets = this.findTargets(docRef);
      if (targets.length === 0) return;

      targets.forEach((canvas) => {
        canvas.style.filter = filter;
        if (!canvas.style.transition?.includes('filter')) {
          canvas.style.transition = `${canvas.style.transition || ''} filter 0.15s ease`;
        }
        canvas.dataset.kuplafixRoomLighting = 'true';
      });
    },

    clear() {
      this.getDocs().forEach((docRef) => {
        this.findTargets(docRef).forEach((canvas) => {
          if (canvas.dataset.kuplafixRoomLighting) {
            canvas.style.removeProperty('filter');
            // Keep other transitions intact
            const transition = canvas.style.transition || '';
            if (transition.trim() === 'filter 0.15s ease') {
              canvas.style.removeProperty('transition');
            }
            delete canvas.dataset.kuplafixRoomLighting;
          }
        });
      });
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // LiveKit Integration Module
  // ─────────────────────────────────────────────────────────────────
  const LiveKit = {
    window: null,
    button: null,
    // Security: do not ship embedded JWTs in the userscript.
    // A token is fetched from `config.livekitTokenEndpoint` at runtime.
    baseUrl: 'https://meet.livekit.io/custom',
    wsUrl: 'wss://kuplafix-2tcupftb.livekit.cloud',
    iconUrl: 'https://kuplahotelli.com/client/dist/src/assets/images/gift/incognito.png',

    async init() {
      log.debug('LiveKit.init()');
      await DOM.ready;
      if (config.get('livekitEnabled')) {
        this.addButton();
      }

      // Re-add button if iframe reloads
      DOM.onNitroIframeDocReady(() => {
        if (config.get('livekitEnabled')) {
          this.addButton();
        }
      });
    },

    addButton() {
      // Wait for config button container
      const container = DOM.querySelector('#kuplafix-config-btn-container');
      if (!container) {
        setTimeout(() => this.addButton(), 500);
        return;
      }

      if (this.button && this.button.isConnected) return;

      // Check if we already have a livekit button container
      if (DOM.querySelector('#kuplafix-livekit-btn-container')) return;

      const btn = document.createElement('div');
      btn.id = 'kuplafix-livekit-btn';
      btn.className = 'cursor-pointer navigation-item nitro-toolbar-icon nitro-space-right sidebar-navigation-icon';
      
      btn.style.backgroundImage = `url('${this.iconUrl}')`;
      btn.style.backgroundSize = '24px';
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
      btn.style.scale = '1.5';
      btn.style.width = '32px';
      btn.style.height = '32px';
      btn.style.margin = '0 auto';
      btn.style.display = 'block';
      btn.style.cursor = 'pointer';
      btn.title = 'kupla Meetings (LiveKit)';
      
      // Add hover effect
      btn.addEventListener('mouseenter', () => (btn.style.opacity = '0.7'));
      btn.addEventListener('mouseleave', () => (btn.style.opacity = '1'));
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleWindow();
      });

      // Add label
      const labelRow = document.createElement('div');
      labelRow.className = 'w-100 text-center';
      labelRow.style.marginTop = '5px';
      
      const label = document.createElement('div');
      label.className = 'd-inline text-white fw-bold text-center nitro-small-size-text';
      label.textContent = 'LiveKit';
      labelRow.appendChild(label);

      // Create a wrapper for the button and label
      const wrapper = document.createElement('div');
      wrapper.id = 'kuplafix-livekit-btn-container';
      wrapper.className = 'text-center mb-4';
      wrapper.appendChild(btn);
      wrapper.appendChild(labelRow);

      // Insert after the config button container
      container.parentNode.insertBefore(wrapper, container.nextSibling);
      
      this.button = btn;
      log.info('✓ LiveKit button added');
    },

    removeButton() {
      const wrapper = DOM.querySelector('#kuplafix-livekit-btn-container');
      if (wrapper) {
        wrapper.remove();
        this.button = null;
      }
    },

    toggleWindow() {
      if (this.window && this.window.isConnected) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    },

    async openWindow() {
      if (this.window) return;

      const targetDoc = this.button ? this.button.ownerDocument : document;
      const win = targetDoc.createElement('div');
      win.className = 'kuplafix-livekit-window';
      
      // Header
      const header = targetDoc.createElement('div');
      header.className = 'kuplafix-livekit-header';
      header.innerHTML = `
        <span>kupla Meetings (LiveKit)</span>
        <button class="kuplafix-close-btn">✕</button>
      `;
      
      // Loading state
      const loading = targetDoc.createElement('div');
      loading.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 14px;';
      loading.textContent = 'Yhdistetään...';
      win.appendChild(loading);

      // Iframe (created but not appended yet)
      const iframe = targetDoc.createElement('iframe');
      iframe.className = 'kuplafix-livekit-iframe';
      iframe.allow = "camera; microphone; display-capture; autoplay; clipboard-write";
      
      win.appendChild(header);
      this.window = win;
      
      // Close button handler
      header.querySelector('.kuplafix-close-btn').addEventListener('click', () => this.closeWindow());
      
      // Draggable
      UI.makeDraggable(win, header, targetDoc);
      
      // Center it initially
      win.style.top = '50%';
      win.style.left = '50%';
      win.style.transform = 'translate(-50%, -50%)';

      // Append to document body
      (targetDoc.body || targetDoc.documentElement).appendChild(win);

      const endpoint = config.get('livekitTokenEndpoint');
      if (!endpoint) {
        loading.textContent = 'LiveKit-token endpoint puuttuu asetuksista.';
        return;
      }

      // Use a unique, non-identifying guest identity by default.
      const username = `guest-${Math.floor(Math.random() * 100000)}`;

      try {
        log.debug('Fetching LiveKit token for identity:', username);

        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `${endpoint}?identity=${encodeURIComponent(username)}&room=kuplafix`,
            onload: (res) => {
              try {
                if (res.status !== 200) return reject(new Error(`Status ${res.status}`));
                resolve(JSON.parse(res.responseText));
              } catch (e) {
                reject(e);
              }
            },
            onerror: reject,
          });
        });

        if (!response || !response.token) {
          throw new Error('Missing token in response');
        }

        const tokenUrl = `${this.baseUrl}?liveKitUrl=${encodeURIComponent(this.wsUrl)}&token=${encodeURIComponent(response.token)}&videoEnabled=false`;
        iframe.src = tokenUrl;
        log.info('✓ LiveKit token fetched successfully');
      } catch (err) {
        log.error('Failed to fetch LiveKit token:', err);
        loading.textContent = 'LiveKit-yhteys epäonnistui (token).';
        return;
      }

      // Append iframe after a short delay to ensure window is rendered
      setTimeout(() => {
        loading.remove();
        win.appendChild(iframe);
      }, 50);
    },

    closeWindow() {
      if (this.window) {
        this.window.remove();
        this.window = null;
      }
    }
  };

  // Module: Bubble Alerts
  const BubbleAlerts = {
    initialized: false,
    observer: null,
    managedAlerts: new WeakMap(),
    initializingPromise: null,
    
    // Store reference to rightSide element
    rightSideElement: null,
    
    // Clone-based persistence
    cloneContainer: null,
    clonedNotifications: new Map(), // Maps clone ID -> {clone, originalWrapper}
    cloneIdCounter: 0,
    clonedContentHashes: new Map(), // Track content hashes with timestamps to prevent duplicate clones within 10s

    iframeHookRegistered: false,

    async init() {
      if (!config.get('bubbleAlertsEnabled')) {
        if (this.initialized) {
          this.cleanup();
        }
        this.initializingPromise = null;
        return;
      }

      // Register iframe hook only once
      if (!this.iframeHookRegistered) {
        this.iframeHookRegistered = true;
        DOM.onNitroIframeDocReady(async () => {
          if (config.get('bubbleAlertsEnabled')) {
            log.debug('BubbleAlerts: re-initializing on iframe ready');
            this.initialized = false;
            await this.init();
          }
        });
      }

      if (this.initialized) {
        return;
      }

      if (this.initializingPromise) {
        return this.initializingPromise;
      }

      this.initializingPromise = (async () => {
        let rightSide = null;
        try {
          rightSide = await DOM.waitFor('.nitro-right-side', 5000);
        } catch (waitErr) {
          log.debug('BubbleAlerts: nitro-right-side not found within timeout');
          rightSide = null;
        }

        if (!config.get('bubbleAlertsEnabled')) {
          this.initializingPromise = null;
          return;
        }

        if (!rightSide) {
          log.debug('BubbleAlerts: nitro-right-side not available');
          this.initializingPromise = null;
          setTimeout(() => {
            if (config.get('bubbleAlertsEnabled')) {
              this.init();
            }
          }, 2000);
          return;
        }

        if (this.initialized) {
          this.initializingPromise = null;
          return;
        }

        this.setupAlertInterception(rightSide);
        this.initialized = true;
        log.debug('BubbleAlerts initialized');
        this.initializingPromise = null;
      })();

      return this.initializingPromise;
    },

    setupAlertInterception(rightSide) {
      // Store reference for later use
      this.rightSideElement = rightSide;
      
      // No more DOM prototype overrides needed!
      // We simply observe and clone - let React do what it wants with its elements
      const self = this;

      // Observer to detect new notifications
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Skip our own clone container and its children
                if (node.id === 'kuplafix-notification-clones' || 
                    node.closest?.('#kuplafix-notification-clones') ||
                    node.dataset?.kuplafixClone === 'true' ||
                    node.querySelector?.('[data-kuplafix-clone="true"]')) {
                  return;
                }
                
                // Direct notification bubbles
                if (node.classList?.contains('nitro-notification-bubble')) {
                  if (node.dataset?.kuplafixClone === 'true') return;
                  this.processAlert(node);
                  return; // Don't search for nested bubbles if this IS a bubble
                }
                
                // Containers with notifications inside
                if (node.classList?.contains('animate__animated')) {
                  // Search within added nodes for bubbles
                  const alerts = node.querySelectorAll?.('.nitro-notification-bubble');
                  if (alerts && alerts.length > 0) {
                    alerts.forEach(alert => {
                      if (alert.dataset?.kuplafixClone !== 'true') {
                        this.processAlert(alert);
                      }
                    });
                    return; // Found bubbles inside, don't process container itself
                  }
                  // If no bubbles found inside, try processing the container
                  this.processAlert(node);
                }
              }
            });
          }
        });
      });

      this.observer.observe(rightSide, {
        childList: true,
        subtree: true,
      });

      // Ensure clone container exists and is in the right place
      this.ensureCloneContainer();

      // Process existing notifications
      rightSide.querySelectorAll('.nitro-notification-bubble').forEach((bubble) => {
        this.processAlert(bubble);
      });

      log.debug('Bubble Alerts interception setup complete (clone-based)');
    },
    ensureCloneContainer() {
      // Create the clone container element once and reuse it
      if (!this.cloneContainer) {
        const container = document.createElement('div');
        container.id = 'kuplafix-notification-clones';
        container.className = 'd-flex flex-column';
        container.style.gap = '0.25rem';
        container.style.pointerEvents = 'none'; // Container shouldn't intercept events
        this.cloneContainer = container;
        log.debug('[CLONES] Created clone container element');
      }

      // If it's still in the DOM, just reuse it
      if (document.body.contains(this.cloneContainer)) {
        log.debug('[CLONES] Returning existing clone container already in DOM');
        return this.cloneContainer;
      }

      // If the element exists somewhere else in DOM (e.g. React recreated it), adopt that node
      const existingCloneContainer = document.getElementById('kuplafix-notification-clones');
      if (existingCloneContainer && existingCloneContainer !== this.cloneContainer) {
        log.debug('[CLONES] Found existing clone container in DOM, reusing it');
        this.cloneContainer = existingCloneContainer;
      }

      // Use stored rightSide reference if available, otherwise query for it
      let rightSide = this.rightSideElement;
      
      if (!rightSide) {
        rightSide = document.querySelector('.nitro-right-side');
      }
      
      if (!rightSide) {
        log.warn('[CLONES] nitro-right-side not found');
        return null;
      }
      log.debug('[CLONES] nitro-right-side found');

      // Navigate the hierarchy: nitro-right-side > d-flex.position-relative > d-flex.flex-column (contains notifications)
      // The structure is:
      // nitro-right-side
      //   └── d-flex.position-relative.flex-column (main container)
      //       ├── d-flex.flex-column.nitro-purse-container (purse)
      //       └── d-flex.flex-column (NATIVE NOTIFICATIONS - THIS ONE)
      
      const mainContainer = rightSide.querySelector(':scope > .d-flex.position-relative.flex-column');
      if (!mainContainer) {
        log.warn('[CLONES] Main flex container not found in nitro-right-side');
        log.debug('[CLONES] Main flex container not found. Available children:');
        Array.from(rightSide.children).forEach((child, idx) => {
          log.debug(`  [${idx}] ${child.className}`);
        });
        return null;
      }
      log.debug('[CLONES] Main container found');

      // If a clone container already exists within the main container, reuse it immediately
      const cloneContainersInMain = mainContainer.querySelectorAll(':scope > #kuplafix-notification-clones');
      if (cloneContainersInMain.length > 0) {
        const [primaryCloneContainer, ...extraCloneContainers] = Array.from(cloneContainersInMain);
        if (extraCloneContainers.length > 0) {
          log.warn(`[CLONES] Found ${extraCloneContainers.length} duplicate clone containers, removing extras`);
          extraCloneContainers.forEach(container => container.remove());
        }
        log.debug('[CLONES] Found existing clone container within main container');
        this.cloneContainer = primaryCloneContainer;
        return this.cloneContainer;
      }

      // Find the notification container (the second d-flex.flex-column, not the purse)
      const allFlexContainers = mainContainer.querySelectorAll(':scope > .d-flex.flex-column');
      log.debug(`[CLONES] Found ${allFlexContainers.length} flex-column children`);
      
      let notificationContainer = null;

      // Find the one that's NOT the purse container and NOT our clone container
      for (const container of allFlexContainers) {
        const isPurse = container.classList.contains('nitro-purse-container');
        const isCloneContainer = container.id === 'kuplafix-notification-clones';
        log.debug(`[CLONES]   Container: isPurse=${isPurse}, isClone=${isCloneContainer}, class=${container.className}`);
        if (!isPurse && !isCloneContainer) {
          notificationContainer = container;
          log.debug(`[CLONES] Found notification container: ${notificationContainer.className}`);
          break;
        }
      }

      // If no suitable container found, use the last one that's not our clone (it should be notifications)
      if (!notificationContainer && allFlexContainers.length > 0) {
        // Find the last flex-column that's not our clone
        for (let i = allFlexContainers.length - 1; i >= 0; i--) {
          if (allFlexContainers[i].id !== 'kuplafix-notification-clones') {
            notificationContainer = allFlexContainers[i];
            break;
          }
        }
        log.debug('[CLONES] Using fallback: last non-clone flex-column');
      }

      if (!notificationContainer) {
        log.warn('[CLONES] Could not find native notification container');
        return null;
      }

      // Remove any stray duplicate clone containers that might exist under mainContainer
      const duplicateCloneContainers = mainContainer.querySelectorAll(':scope > #kuplafix-notification-clones');
      if (duplicateCloneContainers.length > 0) {
        const [primaryCloneContainer, ...extras] = Array.from(duplicateCloneContainers);
        if (extras.length > 0) {
          log.warn(`[CLONES] Removing ${extras.length} duplicate clone containers`);
          extras.forEach(node => node.remove());
        }
        if (primaryCloneContainer !== this.cloneContainer) {
          log.debug('[CLONES] Primary clone container in DOM differs from instance, adopting it');
          this.cloneContainer = primaryCloneContainer;
        }
      }

      // Append our clone container if it's not already inside the main container
      if (this.cloneContainer.parentElement !== mainContainer) {
        mainContainer.appendChild(this.cloneContainer);
        log.debug('[CLONES] Clone container appended to main layout container');
      }

      return this.cloneContainer;
    },

    cloneNotification(wrapper, bubble) {
      try {
        log.debug('[CLONES] cloneNotification called');
        const container = this.ensureCloneContainer();
        if (!container) {
          log.warn('[CLONES] Cannot clone notification - container not available');
          return null;
        }
        
        log.debug(`[CLONES] Container exists, has ${container.children.length} children`);
        
        const cloneId = ++this.cloneIdCounter;
        log.debug(`[CLONES] Creating clone ${cloneId}`);
        
        // Get the actual notification bubble element
        // If wrapper IS the bubble (new structure), use it directly
        // Otherwise, find the bubble inside the wrapper
        let bubbleToClone = bubble;
        if (!bubbleToClone) {
          bubbleToClone = wrapper.querySelector?.('.nitro-notification-bubble');
        }
        
        if (!bubbleToClone) {
          log.warn('[CLONES] Could not find notification bubble');
          return null;
        }
        
        log.debug(`[CLONES] Found bubble to clone, cloning...`);
        // Clone the bubble element
        const clonedBubble = bubbleToClone.cloneNode(true);
        
        // Create a wrapper div to match native structure (animate__animated)
        const animWrapper = document.createElement('div');
        animWrapper.className = 'animate__animated';
        animWrapper.style.display = 'block'; // Ensure it displays
        
        // Mark clone for identification
        clonedBubble.dataset.kuplafixClone = 'true';
        clonedBubble.dataset.cloneId = cloneId;
        
        // Enable pointer events on clone (container has pointer-events: none)
        clonedBubble.style.pointerEvents = 'auto';
        clonedBubble.style.cursor = 'pointer';
        
        // Ensure visibility and proper display - animation handled by CSS
        clonedBubble.style.visibility = 'visible';
        clonedBubble.style.display = 'flex'; // Match native
        
        // Remove any fadeout animations from clone and all children
        const fadeClasses = [
          'animate__fadeOut',
          'animate__fadeOutDown',
          'animate__fadeOutUp',
          'animate__fadeOutLeft',
          'animate__fadeOutRight'
        ];
        
        const removeAnimations = (element) => {
          fadeClasses.forEach(cls => {
            if (element.classList?.contains(cls)) {
              element.classList.remove(cls);
            }
          });
          // Also remove from children
          Array.from(element.children || []).forEach(child => removeAnimations(child));
        };
        
        removeAnimations(clonedBubble);
        
        // Add click-to-dismiss on the clone
        const clickHandler = (e) => {
          if (e.shiftKey) {
            this.removeAllClones();
          } else {
            this.removeClone(cloneId);
          }
        };
        clonedBubble.addEventListener('click', clickHandler);
        
        // Assemble structure: wrapper > animWrapper > bubble
        animWrapper.appendChild(clonedBubble);
        
        // Store clone reference with content hash
        const contentHash = this.getNotificationContentHash(bubbleToClone);
        this.clonedNotifications.set(cloneId, {
          clone: animWrapper,
          originalWrapper: wrapper,
          clickHandler: clickHandler,
          contentHash: contentHash
        });
        
        // Add to container
        container.appendChild(animWrapper);
        log.debug(`[CLONES] Cloned notification ${cloneId}, container now has ${container.children.length} children`);
        
        return cloneId;
      } catch (e) {
        log.warn('[CLONES] Error cloning notification:', e);
        return null;
      }
    },

    removeClone(cloneId) {
      const data = this.clonedNotifications.get(cloneId);
      if (!data) return;
      
      const { clone, contentHash } = data;
      
      // Fade out with slight lift
      clone.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
      // force reflow to ensure transition applies before change
      void clone.offsetWidth;
      clone.style.opacity = '0';
      clone.style.transform = 'translateY(-6px)';
      
      setTimeout(() => {
        try {
          if (clone.parentElement) {
            clone.parentElement.removeChild(clone);
          }
          this.clonedNotifications.delete(cloneId);
          
          // Remove content hash timestamp so same notification can be cloned again after 10s
          if (contentHash) {
            this.clonedContentHashes.delete(contentHash);
          }
          
          log.debug(`Removed clone ${cloneId}`);
        } catch (e) {
          log.debug('Error removing clone:', e);
        }
      }, 260);
    },

    removeAllClones() {
      // Get all clone IDs first to avoid modifying map during iteration
      const cloneIds = Array.from(this.clonedNotifications.keys());
      log.debug(`[CLONES] removeAllClones: removing ${cloneIds.length} clones`);
      
      // Remove each clone with a slight stagger for visual effect
      cloneIds.forEach((cloneId, index) => {
        setTimeout(() => {
          this.removeClone(cloneId);
        }, index * 30); // 30ms stagger between each
      });
    },

    processAlert(alertElement) {
      try {
        // Safety check: never process our own clones
        if (alertElement.dataset?.kuplafixClone === 'true' || 
            alertElement.querySelector?.('[data-kuplafix-clone="true"]')) {
          return;
        }

        log.debug('[CLONES] processAlert called on element:', alertElement.className);
        const context = this.resolveAlertContext(alertElement);
        if (!context) {
          log.debug('[CLONES] resolveAlertContext returned null');
          return;
        }

        const { wrapper, bubble } = context;

        // Double check bubble is not a clone
        if (bubble.dataset?.kuplafixClone === 'true') return;

        // Skip if already processed
        if (this.managedAlerts.has(wrapper)) {
          log.debug('[CLONES] Alert already managed, skipping');
          return;
        }

        this.managedAlerts.set(wrapper, true);

        // Extract alert type and check if should persist
        const alertType = this.getAlertType(bubble);
        const shouldAutoDespawn = this.getAutoDespawnSetting(alertType);
        log.debug(`[CLONES] Alert type: ${alertType}, autoDispawn: ${shouldAutoDespawn}`);

        if (!shouldAutoDespawn) {
          // Generate content hash BEFORE adding timestamp
          const contentHash = this.getNotificationContentHash(bubble);
          const now = Date.now();
          const lastCloneTime = this.clonedContentHashes.get(contentHash);
          
          if (lastCloneTime && (now - lastCloneTime) < 10000) {
            log.debug(`[CLONES] Already cloned this content ${Math.floor((now - lastCloneTime) / 1000)}s ago, skipping duplicate`);
            return;
          }
          
          // Add timestamp if enabled (do this AFTER checking for duplicates)
          if (config.get('bubbleAlertsShowTimestamp')) {
            this.addTimestamp(bubble);
          }
          
          // REPLACE native notification: clone immediately, then hide native
          // This prevents the "notification appears twice" issue
          this.clonedContentHashes.set(contentHash, now);
          
          // Clone immediately as a replacement for native
          const cloneId = this.cloneNotification(wrapper, bubble);
          if (cloneId) {
            log.debug(`[CLONES] Created persistent replacement for ${alertType} notification`);
            
            // Hide the native notification since we have our clone
            // Use opacity to avoid layout shifts
            wrapper.style.opacity = '0';
            wrapper.style.pointerEvents = 'none';
            wrapper.style.height = '0';
            wrapper.style.overflow = 'hidden';
            wrapper.style.margin = '0';
            wrapper.style.padding = '0';
          }
        } else {
          // Add timestamp if enabled for auto-despawn notifications too (add to bubble not wrapper)
          if (config.get('bubbleAlertsShowTimestamp')) {
            this.addTimestamp(bubble);
          }
        }
      } catch (e) {
        log.warn('[CLONES] Error processing alert:', e);
      }
    },

    getNotificationContentHash(bubble) {
      // Create a hash from notification content to detect duplicates
      // Exclude timestamp elements to avoid false negatives
      if (!bubble) return '';
      
      // Clone the bubble temporarily to remove timestamp without affecting original
      const tempBubble = bubble.cloneNode(true);
      const timestamp = tempBubble.querySelector('.kuplafix-alert-timestamp');
      if (timestamp) {
        timestamp.remove();
      }
      
      const text = tempBubble.textContent?.trim() || '';
      const images = Array.from(tempBubble.querySelectorAll('img')).map(img => img.src).join('|');
      
      return `${text}::${images}`;
    },

    getAlertType(element) {
      if (!element) return 'info';
      
      const text = element.textContent?.toLowerCase() || '';
      const html = element.innerHTML?.toLowerCase() || '';
      
      // Finnish login/logout detection (kirjautui sisään = logged in, kirjautui ulos = logged out)
      if (text.includes('kirjautui sisään')) return 'friendonline';
      if (text.includes('kirjautui ulos')) return 'friendoffline';
      
      // Gift detection - both Finnish and English
      // Finnish: "lähetti sinulle lahjan" = sent you a gift / "0es lähetti sinulle lahjan"
      if (text.includes('lähetti') && text.includes('lahjan')) return 'gift';
      if (text.includes('gift.gif') || html.includes('gift.gif')) return 'gift';
      
      // Other alert types
      if (text.includes('saavutuksen')) return 'achievement';
      if (text.includes('badge') || text.includes('merkki')) return 'badge_received';
      if (text.includes('timanttia') || text.includes('pixeliä') || text.includes('kolikoita')) return 'currencies';
      if (text.includes('respektiä')) return 'respect';
      
      return 'info';
    },

    addTimestamp(alertElement) {
      // Add a timestamp display to the alert
      const timestamp = new Date();
      const timeStr = timestamp.toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const existing = alertElement.querySelector('.kuplafix-alert-timestamp');
      if (existing) {
        existing.remove();
      }

      const timestampEl = document.createElement('div');
      timestampEl.className = 'kuplafix-alert-timestamp';
      timestampEl.style.cssText = `
        font-size: 10px;
        color: #7cb1c8;
        margin-top: 4px;
        opacity: 0.7;
        text-align: right;
        padding: 0 8px;
      `;
      timestampEl.textContent = timeStr;
      alertElement.appendChild(timestampEl);
    },

    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      
      // Remove clone container
      if (this.cloneContainer && this.cloneContainer.parentElement) {
        this.cloneContainer.parentElement.removeChild(this.cloneContainer);
        this.cloneContainer = null;
      }
      
      // Clear all clones
      this.clonedNotifications.clear();
      this.clonedContentHashes.clear();
      
      this.initialized = false;
      this.managedAlerts = new WeakMap();
      this.initializingPromise = null;
      this.cloneIdCounter = 0;
      this.rightSideElement = null;
      log.debug('BubbleAlerts cleaned up');
    },

    resolveAlertContext(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      let wrapper = null;
      let bubble = null;

      if (element.classList?.contains('nitro-notification-bubble')) {
        bubble = element;
        // The bubble itself might be the wrapper in new structure
        wrapper = bubble;
      } else if (element.classList?.contains('animate__animated')) {
        wrapper = element;
        bubble = wrapper.querySelector?.('.nitro-notification-bubble') || null;
      } else {
        return null;
      }

      if (!bubble) {
        return null;
      }

      // Find the parent container - could be d-flex or similar structure
      let listContainer = wrapper?.parentElement;
      if (!listContainer) {
        return null;
      }

      // Find nitro-right-side - might be multiple levels up
      let rightSide = listContainer;
      let depth = 0;
      const maxDepth = 10; // Prevent infinite loops
      while (rightSide && !rightSide.classList?.contains('nitro-right-side') && depth < maxDepth) {
        rightSide = rightSide.parentElement;
        depth++;
      }

      if (!rightSide || !rightSide.classList?.contains('nitro-right-side')) {
        return null;
      }

      return { bubble, wrapper, listContainer, rightSide };
    },

    getAutoDespawnSetting(alertType) {
      const autoDispawnConfig = config.get('bubbleAlertsAutoDespawn') || {};
      if (Object.prototype.hasOwnProperty.call(autoDispawnConfig, alertType)) {
        return !!autoDispawnConfig[alertType];
      }

      const defaultAutoDispawn = defaultConfig.bubbleAlertsAutoDespawn || {};
      if (Object.prototype.hasOwnProperty.call(defaultAutoDispawn, alertType)) {
        return !!defaultAutoDispawn[alertType];
      }

      return true;
    },
  };

  // Module: Chat History UI (Custom Replacement)
  const ChatHistoryUI = {
    window: null,
    content: null,
    isVisible: false,
    button: null,
    targetDoc: null,
    _hijackObserver: null,
    _hijackDebounceHandle: null,

    async init() {
      log.debug('ChatHistoryUI.init()');
      if (!config.get('chatHistoryCacheEnabled')) {
        return;
      }
      await DOM.ready;
      this.createWindow();
      this.hijackButton();

      // React can re-render the toolbar; observe and re-hijack without polling.
      this._startHijackObserver();

      // If the iframe wasn't ready at init, re-run once it loads (and after reloads).
      if (!this.iframeHookRegistered) {
        this.iframeHookRegistered = true;
        DOM.onNitroIframeDocReady(() => {
          try {
            this.createWindow();
            this.hijackButton();
            this._startHijackObserver();
          } catch (_) {
            // ignore
          }
        });
      }
    },

    _startHijackObserver() {
      const schedule = () => {
        if (this._hijackDebounceHandle) return;
        this._hijackDebounceHandle = setTimeout(() => {
          this._hijackDebounceHandle = null;
          this.hijackButton();
        }, 250);
      };

      if (!this._hijackObserver) {
        this._hijackObserver = new MutationObserver(() => {
          if (config.get('chatHistoryCacheEnabled')) {
            schedule();
          }
        });
      }
      try {
        this._hijackObserver.observe(document.body || document.documentElement, {
          childList: true,
          subtree: true,
          attributes: false,
        });
      } catch (_) {}

      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc?.body) {
        try {
          this._hijackObserver.observe(iframeDoc.body, {
            childList: true,
            subtree: true,
            attributes: false,
          });
        } catch (_) {}
      }

      // Watchdog: Check every 2 seconds in case Observer misses it (e.g. rapid React updates)
      if (this.watchdogInterval) clearInterval(this.watchdogInterval);
      this.watchdogInterval = setInterval(() => {
        this.hijackButton();
      }, 2000);
    },

    createWindow() {
      const iframeDoc = DOM.getIframeDoc();
      const desiredDoc = iframeDoc || document;

      // Check if existing window is valid and in the desired document
      if (this.window && this.window.isConnected) {
          if (this.window.ownerDocument === desiredDoc) {
              return; // Already exists in the correct document
          }
          // Wrong document (e.g. was in main, now iframe is ready), remove and recreate
          this.window.remove();
          this.window = null;
          this.content = null;
      }

      this.targetDoc = desiredDoc;
      
      // Ensure styles are present in the target document
      if (!this.targetDoc.getElementById('kuplafix-styles')) {
          Styles.injectBaseStyles();
      }

      const win = this.targetDoc.createElement('div');
      win.className = 'kuplafix-chat-history-window';
      win.style.display = 'none';
      win.style.zIndex = '9999999'; // Ensure it's on top of everything

      const header = this.targetDoc.createElement('div');
      header.className = 'kuplafix-chat-history-header';
      header.innerHTML = `
        <div class="kuplafix-chat-history-title">Viestihistoria</div>
        <div class="kuplafix-chat-history-close">✕</div>
      `;

      const searchBar = this.targetDoc.createElement('div');
      searchBar.className = 'kuplafix-chat-history-search-bar';
      searchBar.innerHTML = `
        <input type="text" class="kuplafix-chat-history-search-input" placeholder="Etsi viestejä..." />
        <div style="display: flex; gap: 10px; margin-top: 6px; font-size: 11px; color: #ccc; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <input type="checkbox" id="kf-hide-system" /> Piilota järjestelmäviestit
          </label>
          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <input type="checkbox" id="kf-hide-bots" /> Piilota bottiviestit
          </label>
          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <input type="checkbox" id="kf-hide-wired" /> Piilota WIRED-viestit
          </label>
        </div>
      `;

      const content = this.targetDoc.createElement('div');
      content.className = 'kuplafix-chat-history-content nitro-chat-history'; // Add nitro class for potential global styles
      
      win.appendChild(header);
      win.appendChild(searchBar);
      win.appendChild(content);

      (this.targetDoc.body || this.targetDoc.documentElement).appendChild(win);

      this.window = win;
      this.content = content;

      // Event listeners
      header.querySelector('.kuplafix-chat-history-close').addEventListener('click', () => this.toggle(false));
      
      const searchInput = searchBar.querySelector('input');
      const hideSystem = searchBar.querySelector('#kf-hide-system');
      const hideBots = searchBar.querySelector('#kf-hide-bots');
      const hideWired = searchBar.querySelector('#kf-hide-wired');

      const updateFilter = () => {
        this.filterMessages(searchInput.value, hideSystem.checked, hideBots.checked, hideWired.checked);
      };

      searchInput.addEventListener('input', updateFilter);
      hideSystem.addEventListener('change', updateFilter);
      hideBots.addEventListener('change', updateFilter);
      hideWired.addEventListener('change', updateFilter);

      UI.makeDraggable(win, header, this.targetDoc);
    },

    filterMessages(query, hideSystem, hideBots, hideWired) {
      if (!this.content) return;
      
      const term = query.toLowerCase().trim();
      const messages = Array.from(this.content.children);
      
      messages.forEach(wrapper => {
        const textContent = wrapper.textContent || '';
        const bubble = wrapper.querySelector('.chat-bubble');
        const isSystem = bubble && bubble.classList.contains('bubble-1'); // Check class for system
        const isBot = bubble && bubble.classList.contains('bubble-2'); // Check class for bot
        const isWired = bubble && bubble.classList.contains('bubble-34'); // Check class for wired

        let visible = true;

        if (term && !textContent.toLowerCase().includes(term)) visible = false;
        if (hideSystem && isSystem) visible = false;
        if (hideBots && isBot) visible = false;
        if (hideWired && isWired) visible = false;

        if (visible) {
          wrapper.style.removeProperty('display');
        } else {
          wrapper.style.setProperty('display', 'none', 'important');
        }
      });
    },

    toggle(forceState) {
      // Ensure window exists and is in the right context
      this.createWindow();
      
      this.isVisible = typeof forceState === 'boolean' ? forceState : !this.isVisible;
      this.window.style.display = this.isVisible ? 'flex' : 'none';
      
      if (this.isVisible) {
        this.scrollToBottom();
        // Populate if empty (first open or recreated)
        if (this.content.children.length === 0) {
            ChatHistoryCache.restoreToUI();
        }
      }
    },

    scrollToBottom() {
      if (this.content) {
        this.content.scrollTop = this.content.scrollHeight;
      }
    },

    showTimestampPopup(event, isoDateTime) {
      const doc = this.targetDoc || document;
      
      // Remove any existing popup
      const existing = doc.querySelector('.kuplafix-timestamp-popup');
      if (existing) existing.remove();
      
      const date = new Date(isoDateTime);
      const formatted = date.toLocaleDateString('fi-FI', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const popup = doc.createElement('div');
      popup.className = 'kuplafix-timestamp-popup';
      popup.textContent = formatted;
      
      // Position near click
      popup.style.left = `${event.clientX + 10}px`;
      popup.style.top = `${event.clientY - 30}px`;
      
      (doc.body || doc.documentElement).appendChild(popup);
      
      // Auto-remove after 2.5s
      setTimeout(() => {
        if (popup.parentElement) popup.remove();
      }, 2500);
    },

    showSessionDivider(dateTime) {
      if (!this.content) return;
      
      const doc = this.targetDoc || document;
      const divider = doc.createElement('div');
      divider.className = 'kuplafix-session-divider';
      
      const date = new Date(dateTime);
      const formatted = date.toLocaleDateString('fi-FI', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      divider.innerHTML = `<span>Uusi sessio - ${formatted}</span>`;
      this.content.appendChild(divider);
    },

    lastMessageTime: null,

    addMessage(msg) {
      if (!this.content) return;
      
      // Check for session gap (30+ minutes between messages)
      const msgTime = msg.fullDateTime ? new Date(msg.fullDateTime).getTime() : 
                      msg.cachedAt ? msg.cachedAt : Date.now();
      
      if (this.lastMessageTime) {
        const gap = msgTime - this.lastMessageTime;
        const thirtyMinutes = 30 * 60 * 1000;
        if (gap >= thirtyMinutes) {
          this.showSessionDivider(new Date(msgTime).toISOString());
        }
      }
      this.lastMessageTime = msgTime;
      
      const el = this.renderMessage(msg);
      this.content.appendChild(el);
      
      // Apply current filters to the new message
      const searchInput = this.window?.querySelector('.kuplafix-chat-history-search-input');
      const hideSystem = this.window?.querySelector('#kf-hide-system');
      const hideBots = this.window?.querySelector('#kf-hide-bots');
      const hideWired = this.window?.querySelector('#kf-hide-wired');
      
      if (searchInput && hideSystem && hideBots && hideWired) {
        const term = searchInput.value.toLowerCase().trim();
        const bubble = el.querySelector('.chat-bubble');
        const isSystem = bubble && bubble.classList.contains('bubble-1');
        const isBot = bubble && bubble.classList.contains('bubble-2');
        const isWired = bubble && bubble.classList.contains('bubble-34');
        const textContent = el.textContent || '';

        let visible = true;
        if (term && !textContent.toLowerCase().includes(term)) visible = false;
        if (hideSystem.checked && isSystem) visible = false;
        if (hideBots.checked && isBot) visible = false;
        if (hideWired.checked && isWired) visible = false;

        if (!visible) {
          el.style.setProperty('display', 'none', 'important');
        }
      }
      
      // Auto-scroll if near bottom
      const isNearBottom = this.content.scrollHeight - this.content.scrollTop - this.content.clientHeight < 100;
      if (isNearBottom || !this.isVisible) {
        this.scrollToBottom();
      }
    },

    renderMessage(msg) {
      // Reconstruct the exact DOM structure of a chat bubble to match native history
      // <div class="d-flex gap-2 align-items-center p-1">
      //   <div class="d-inline text-white nitro-default-size-text">TIMESTAMP</div>
      //   <div class="bubble-container" style="position: relative">
      //     <div class="user-container-bg" style="background-color: ..."></div>
      //     <div class="chat-bubble bubble-X type-Y" style="max-width: 100%">
      //       <div class="user-container"><div class="user-image" style="..."></div></div>
      //       <div class="chat-content">...</div>
      //     </div>
      //   </div>
      // </div>

      const doc = this.targetDoc || document;
      
      // Outer wrapper
      const wrapper = doc.createElement('div');
      wrapper.className = 'd-flex gap-2 align-items-center p-1';
      if (msg.sessionId) wrapper.dataset.sessionId = msg.sessionId;
      
      // Store full datetime for click popup
      if (msg.fullDateTime || msg.cachedAt) {
        wrapper.dataset.fullDateTime = msg.fullDateTime || new Date(msg.cachedAt).toISOString();
        wrapper.addEventListener('click', (e) => this.showTimestampPopup(e, wrapper.dataset.fullDateTime));
      }
      
      // Timestamp
      const timestamp = doc.createElement('div');
      timestamp.className = 'd-inline text-white nitro-default-size-text';
      // Ensure timestamp uses colon separator
      timestamp.textContent = (msg.timestamp || '').replace('.', ':');
      wrapper.appendChild(timestamp);

      // Bubble Container
      const container = doc.createElement('div');
      container.className = 'bubble-container';
      container.style.position = 'relative';

      if (msg.styleId === 0 && msg.color) {
        const bg = doc.createElement('div');
        bg.className = 'user-container-bg';
        bg.style.backgroundColor = msg.color;
        container.appendChild(bg);
      }

      const bubble = doc.createElement('div');
      bubble.className = `chat-bubble ${msg.bubbleClass || ''}`;
      // Ensure we have the basic classes
      if (!bubble.classList.contains('chat-bubble')) bubble.classList.add('chat-bubble');
      bubble.style.maxWidth = '100%';
      
      // User container (avatar)
      const userContainer = doc.createElement('div');
      userContainer.className = 'user-container';
      // Hide avatar for bubble style 1 and 34
      if (msg.avatarUrl && msg.styleId !== 1 && msg.styleId !== 34) {
        const avatar = doc.createElement('div');
        avatar.className = 'user-image';
        avatar.style.backgroundImage = msg.avatarUrl;
        userContainer.appendChild(avatar);
      }

      // Content
      const chatContent = doc.createElement('div');
      chatContent.className = 'chat-content';
      
      const username = doc.createElement('b');
      username.className = 'username mr-1';
      username.innerHTML = (msg.username || '') + ': '; 
      
      const message = doc.createElement('span');
      message.className = 'message';
      message.innerHTML = msg.message || '';

      chatContent.appendChild(username);
      chatContent.appendChild(message);
      
      bubble.appendChild(chatContent);
      bubble.appendChild(userContainer);
      
      container.appendChild(bubble);
      wrapper.appendChild(container);

      return wrapper;
    },


    hijackButton() {
      // Strategy 1: Find by title attribute (most robust for this client)
      let nativeButton = DOM.querySelector('[title="Keskusteluhistoria"], [title="Chat History"]');
      
      // Strategy 2: SVG Path (New Robust Strategy)
      if (!nativeButton) {
        // Look for the specific SVG path of the chat history icon
        const path = DOM.querySelector('path[d^="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192"]');
        if (path) {
           // The button is the grandparent/great-grandparent of the path
           // path -> svg -> div (button)
           nativeButton = path.closest('.nitro-pointer');
        }
      }

      // Strategy 3: Find by structure based on user snapshot (v2.0.11 fix)
      // Selector: .nitro-toolbar > div > div > div > div:nth-child(2) > div:nth-child(3)
      if (!nativeButton) {
        nativeButton = DOM.querySelector('.nitro-toolbar > div > div > div > div:nth-child(2) > div:nth-child(3)');
      }

      // Strategy 3: Legacy structure fallback
      if (!nativeButton) {
        const firstView = DOM.querySelector('.nitro-toolbar-firstview');
        if (firstView) {
          // The buttons are in the second child of the main container
          // .nitro-toolbar-firstview > div > div:nth-child(2) > div
          const buttonsContainer = firstView.querySelector('div > div:nth-child(2)');
          if (buttonsContainer && buttonsContainer.children.length >= 3) {
             // 3rd button is usually chat history
             nativeButton = buttonsContainer.children[2];
          }
        }
      }

      if (nativeButton && !nativeButton.dataset.kuplafixHijacked) {
        log.debug('Found native chat history button, hijacking...');
        
        // Mark as hijacked
        nativeButton.dataset.kuplafixHijacked = 'true';
        
        // Add capture listener to intercept clicks BEFORE React sees them
        nativeButton.addEventListener('click', (e) => {
          if (config.get('chatHistoryCacheEnabled')) {
            // Feature enabled: Stop native behavior and open our window
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            log.debug('Intercepted chat history click');
            this.toggle();
          } else {
            // Feature disabled: Let event bubble to React (native behavior)
            log.debug('Chat history click passed through (feature disabled)');
          }
        }, { capture: true });
        
        // Ensure pointer cursor
        nativeButton.style.cursor = 'pointer';
        
        this.button = nativeButton;
        log.info('✓ Chat history button hijacked (listener attached)');
      }
    }
  };

  // Module: Chat History Cache Module
  const ChatHistoryCache = {
    CACHE_KEY: 'kuplafix_chat_cache',
    observer: null,
    cache: [],
    maxCacheSize: 1000,
    expiryTime: 7 * 24 * 60 * 60 * 1000,
    saveTimeout: null,
    currentWidget: null,
    currentSessionId: Date.now().toString(36),
    _widgetObserver: null,
    _widgetDebounceHandle: null,

    async init() {
      log.debug('ChatHistoryCache.init()');
      // Generate new session ID for this login
      this.currentSessionId = Date.now().toString(36);
      this.maxCacheSize = config.get('chatHistoryCacheSize') || 1000;
      this.expiryTime = config.get('chatHistoryCacheExpiry') || (7 * 24 * 60 * 60 * 1000);

      if (!config.get('chatHistoryCacheEnabled')) {
        return;
      }

      await DOM.ready;
      
      this.loadCache();
      this.setupWidgetWatcherForDoc(document);

      DOM.onNitroIframeDocReady((iframeDoc) => {
        try {
          this.setupWidgetWatcherForDoc(iframeDoc);
        } catch (_) {
          // ignore
        }
      });
    },

    loadCache() {
      try {
        const data = GM_getValue(this.CACHE_KEY);
        if (data && data.messages) {
          const now = Date.now();
          this.cache = data.messages.filter(m => (now - m.cachedAt) < this.expiryTime);
          log.debug(`Loaded ${this.cache.length} messages from cache`);
          
          // Restore if we have messages
          if (this.cache.length > 0) {
            this.restoreToUI();
          }
        }
      } catch (e) {
        log.warn('Failed to load chat cache:', e);
      }
    },

    saveCache() {
      try {
        const data = {
          version: '2.0',
          timestamp: Date.now(),
          messages: this.cache
        };
        GM_setValue(this.CACHE_KEY, data);
        // log.debug(`Saved ${this.cache.length} messages to cache`);
      } catch (e) {
        log.warn('Failed to save chat cache:', e);
      }
    },

    scheduleSave() {
      if (this.saveTimeout) clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => this.saveCache(), 2000);
    },

    _widgetWatchers: new Map(),

    setupWidgetWatcherForDoc(docRef) {
      if (this._widgetWatchers.has(docRef)) return; // Already watching
      
      // Check immediately
      this.checkWidget();

      const target = docRef.body || docRef.documentElement;
      if (!target) return;

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              if (node.classList?.contains('nitro-chat-widget')) {
                this.checkWidget();
                return;
              }
              if (node.querySelector?.('.nitro-chat-widget')) {
                this.checkWidget();
                return;
              }
            }
          }
        }
      });

      observer.observe(target, { childList: true, subtree: true });
      this._widgetWatchers.set(docRef, observer);
      log.debug('ChatHistoryCache widget watcher attached to document');
    },

    checkWidget() {
        const widget = DOM.querySelector('.nitro-chat-widget');
        if (widget && widget !== this.currentWidget) {
            log.info('New chat widget detected, attaching observer');
            this.currentWidget = widget;
            this.attachObserver(widget);
        }
    },

    attachObserver(widget) {
        if (this.observer) this.observer.disconnect();
        
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                  // Check for bubble-container
                  if (node.classList.contains('bubble-container')) {
                    this.processNewBubble(node);
                  }
                }
              });
            });
        });
        
        this.observer.observe(widget, { childList: true, subtree: false });
        log.debug('Chat widget observer attached');
    },

    processNewBubble(element) {
      // Wait a tick to ensure content is rendered?
      setTimeout(() => {
        try {
          const msgData = this.extractMessageData(element);
          if (msgData) {
            // Avoid duplicates (simple check by timestamp + content)
            const lastMsg = this.cache[this.cache.length - 1];
            if (lastMsg && lastMsg.message === msgData.message && lastMsg.username === msgData.username && (msgData.cachedAt - lastMsg.cachedAt < 2000)) {
                return;
            }

            this.cache.push(msgData);
            if (this.cache.length > this.maxCacheSize) {
              this.cache.shift();
            }
            this.scheduleSave();
            
            // Update UI if open
            ChatHistoryUI.addMessage(msgData);
            
            // Check for shared macro in chat message
            this.checkForSharedMacro(msgData);
          }
        } catch (e) {
          log.warn('Error processing bubble:', e);
        }
      }, 50);
    },
    
    checkForSharedMacro(msgData) {
        // Check if message contains KFM2: macro code
        if (!msgData || !msgData.message) return;
        
        // Strip HTML tags to get plain text
        const plainText = msgData.message.replace(/<[^>]*>/g, '');
        
        // Look for KFM2: marker
        const kfmIndex = plainText.indexOf('KFM2:');
        if (kfmIndex === -1) return;
        
        // Extract the base64 code after KFM2:
        let code = '';
        for (let i = kfmIndex + 5; i < plainText.length; i++) {
            const c = plainText[i];
            // Base64 chars + padding
            if (/[A-Za-z0-9+/=]/.test(c)) {
                code += c;
            } else {
                break;
            }
        }
        
        if (code.length < 10) return; // Too short to be valid
        
        const fullCode = 'KFM2:' + code;
        
        // Try to decode the macro
        if (typeof PacketBuilder === 'undefined' || !PacketBuilder.decodeMacro) return;
        
        const macro = PacketBuilder.decodeMacro(fullCode);
        if (!macro) {
            log.debug('ChatCache: Found KFM2 code but failed to decode');
            return;
        }
        
        // Get sharer name from message data
        const sharerName = msgData.username || 'Someone';
        
        log.info(`ChatCache: Detected shared macro "${macro.name}" from ${sharerName}`);
        
        // Show notification using PacketManager's function
        if (typeof PacketManager !== 'undefined' && PacketManager.showMacroShareNotification) {
            PacketManager.showMacroShareNotification(macro, fullCode, sharerName);
        }
    },

    extractMessageData(container) {
      // container is .bubble-container
      const bubble = container.querySelector('.chat-bubble');
      if (!bubble) return null;

      const usernameEl = bubble.querySelector('.username');
      const messageEl = bubble.querySelector('.message');
      const userImageEl = container.querySelector('.user-image');
      const bgEl = container.querySelector('.user-container-bg');
      
      if (!messageEl) return null; // Username might be hidden for some styles

      // Extract style classes
      // bubble-X, type-Y
      const classes = Array.from(bubble.classList).filter(c => c !== 'chat-bubble');
      
      const now = new Date();
      return {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        cachedAt: Date.now(),
        username: usernameEl ? usernameEl.textContent.replace(/:\s*$/, '') : '',
        message: messageEl.innerHTML,
        avatarUrl: userImageEl ? userImageEl.style.backgroundImage : null,
        color: bgEl ? bgEl.style.backgroundColor : null,
        bubbleClass: classes.join(' '),
        styleId: this.extractStyleId(classes),
        timestamp: now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
        fullDateTime: now.toISOString(),
        sessionId: this.currentSessionId
      };
    },
    
    extractStyleId(classes) {
        const match = classes.find(c => c.startsWith('bubble-'));
        return match ? parseInt(match.replace('bubble-', '')) : 0;
    },

    restoreToUI() {
      log.info(`Restoring ${this.cache.length} messages to UI...`);
      
      // Reset lastMessageTime to properly detect session gaps
      ChatHistoryUI.lastMessageTime = null;
      
      this.cache.forEach((msg, index) => {
        // addMessage will automatically insert session dividers for 30+ min gaps
        ChatHistoryUI.addMessage(msg);
      });
      // Ensure scroll is at bottom after restoring messages on login
      ChatHistoryUI.scrollToBottom();
      
      // Highlight the last message from the previous session (if any)
      if (ChatHistoryUI.content) {
        const doc = ChatHistoryUI.targetDoc || document;
        const currentSession = this.currentSessionId;
        const messageNodes = Array.from(ChatHistoryUI.content.querySelectorAll('[data-session-id]'));
        const previousSessionMsg = [...messageNodes].reverse().find((node) => {
          const sid = node.dataset.sessionId || '';
          return sid && sid !== currentSession;
        });

        if (previousSessionMsg) {
          previousSessionMsg.classList.add('kuplafix-last-message-highlight');
          previousSessionMsg.style.position = previousSessionMsg.style.position || 'relative';

          const tooltip = doc.createElement('div');
          tooltip.className = 'kuplafix-last-message-tooltip';
          tooltip.textContent = 'Viimeisin viesti viime kerraltasi kuplassa';
          previousSessionMsg.appendChild(tooltip);

          setTimeout(() => {
            previousSessionMsg.classList.remove('kuplafix-last-message-highlight');
            if (tooltip.parentElement) tooltip.remove();
          }, 5000);
        }
      }
    },
    
    clearCache() {
      this.cache = [];
      GM_deleteValue(this.CACHE_KEY);
      log.info('Chat cache cleared');
      if (ChatHistoryUI.content) {
          ChatHistoryUI.content.innerHTML = '';
      }
    }
  };

  // Module: Voice Messages (max 4s)
  const VoiceMessages = {
    PLAY_ICON: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
    PAUSE_ICON: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    fab: null,
    fabWrapper: null,
    mediaRecorder: null,
    chunks: [],
    isRecording: false,
    isSticky: false,
    wasCancelled: false,
    countdownHandle: null,
    recordingTimeout: null,
    clickTimeout: null,
    holdStarted: 0,
    justStoppedSticky: false,
    countdownEndsAt: 0,
    observers: new Map(),
    monitoredDocs: new Set(),

    removeFabFromDoc(docRef = document) {
      const doc = docRef || document;
      const selector = doc.getElementById('kuplafix-voice-selector');
      const holder = selector?.closest?.('.kuplafix-voice-holder');
      
      const container = doc.querySelector('.nitro-chat-input-container');
      if (container) container.classList.remove('has-voice-button');

      if (holder?.isConnected) holder.remove();
      else if (selector?.isConnected) selector.remove();

      // Fallback: remove any stray holder left behind
      const stray = doc.querySelectorAll?.('.kuplafix-voice-holder');
      stray?.forEach?.((el) => el.remove());

      if (this.fab && !this.fab.isConnected) this.fab = null;
      if (this.fabWrapper && !this.fabWrapper.isConnected) this.fabWrapper = null;
    },

    applyFabVisibility(docRef = document) {
      if (!config.get('voiceMessagesEnabled')) {
        this.removeFabFromDoc(docRef);
        return;
      }

      if (config.get('voiceHideRecordButton')) {
        this.removeFabFromDoc(docRef);
        return;
      }

      this.attachFab(docRef);
    },

    showHelpPopup(event, docRef = document) {
      const doc = docRef || document;
      const existing = doc.querySelector('.kuplafix-voice-help-popup');
      if (existing) existing.remove();

      const popup = doc.createElement('div');
      popup.className = 'kuplafix-timestamp-popup kuplafix-voice-help-popup';
      popup.textContent = 'Pidä pohjassa nauhoittaaksesi tai tuplaklikkaa lukitaksesi nauhoituksen.';
      
      // Position it above the button
      if (this.fab) {
        const rect = this.fab.getBoundingClientRect();
        const win = doc.defaultView || window;
        popup.style.position = 'fixed';
        popup.style.bottom = (win.innerHeight - rect.top + 10) + 'px';
        popup.style.right = (win.innerWidth - rect.right) + 'px';
        popup.style.left = 'auto';
        popup.style.display = 'block';
        popup.style.zIndex = '1000000';
      } else {
        const x = event.clientX || 0;
        const y = event.clientY || 0;
        popup.style.left = `${x - 180}px`;
        popup.style.top = `${y - 45}px`;
      }
      
      popup.style.pointerEvents = 'none';
      (doc.body || doc.documentElement).appendChild(popup);
      
      setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
          if (popup.parentElement) popup.remove();
        }, 300);
      }, 3000);
    },

    async init() {
      if (!config.get('voiceMessagesEnabled')) {
        this.teardown();
        return;
      }

      await DOM.ready;
      this.applyFabVisibility(document);
      this.startPlaybackObservers(document);
      DOM.onNitroIframeDocReady((iframeDoc) => {
        if (iframeDoc) {
          this.applyFabVisibility(iframeDoc.defaultView?.top === window ? document : iframeDoc);
          this.startPlaybackObservers(iframeDoc);
        }
      });
    },

    teardown() {
      this.stopRecording(true);
      this.removeFabFromDoc(document);
      const iframeDoc = DOM.getIframeDoc?.();
      if (iframeDoc) this.removeFabFromDoc(iframeDoc);
      this.fab = null;
      this.fabWrapper = null;
      this.clearCountdown();
      this.observers.forEach((obs) => obs.disconnect());
      this.observers.clear();
      this.monitoredDocs.clear();
    },

    attachFab(docRef = document) {
      const doc = docRef || document;
      if (!doc.body) return;

      if (config.get('voiceHideRecordButton')) {
        this.removeFabFromDoc(doc);
        return;
      }

      const container = doc.querySelector('.nitro-chat-input-container');
      const existing = doc.getElementById('kuplafix-voice-selector');
      if (existing) {
        this.fab = existing;
        const holder = existing.parentElement;
        if (holder?.classList?.contains('kuplafix-voice-holder')) {
          this.fabWrapper = holder;
        }

        if (container && (!this.fabWrapper || !container.contains(this.fabWrapper))) {
          container.classList.add('has-voice-button');
          if (this.fabWrapper?.isConnected) this.fabWrapper.remove();
          const wrapper = doc.createElement('div');
          wrapper.className = 'cursor-pointer kuplafix-voice-holder';
          wrapper.appendChild(existing);
          this.insertWrapper(container, wrapper);
          this.fabWrapper = wrapper;
        } else if (container) {
          container.classList.add('has-voice-button');
        }
        return;
      }

      const btn = doc.createElement('button');
      btn.id = 'kuplafix-voice-selector';
      btn.className = 'kuplafix-voice-selector';
      btn.type = 'button';
      btn.title = 'Klikkaa ohjeeseen, pidä pohjassa nauhoittaaksesi tai tuplaklikkaa lukitaksesi.';

      const progress = doc.createElement('div');
      progress.className = 'kuplafix-voice-progress';
      btn.appendChild(progress);

      const label = doc.createElement('div');
      label.className = 'kuplafix-voice-fab-label';
      label.textContent = 'REC ⚪';
      btn.appendChild(label);

      const start = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isSticky) {
          this.cancelRecording();
          this.isSticky = false;
          this.justStoppedSticky = true;
          return;
        }

        this.justStoppedSticky = false;
        this.holdStarted = Date.now();
        this.startRecording();
      };

      const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isSticky) return;
        if (this.justStoppedSticky) {
          this.justStoppedSticky = false;
          return;
        }

        const duration = Date.now() - this.holdStarted;
        if (duration < 300) {
          this.cancelRecording();
          if (this.clickTimeout) clearTimeout(this.clickTimeout);
          this.clickTimeout = setTimeout(() => {
            if (!this.isSticky && !this.justStoppedSticky) {
              this.showHelpPopup(e, doc);
            }
          }, 300);
        } else {
          this.stopRecording();
        }
      };

      btn.addEventListener('mousedown', start);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('touchend', stop);
      btn.addEventListener('mouseleave', () => {
        if (!this.isSticky) this.cancelRecording();
      });
      btn.addEventListener('touchcancel', () => {
        if (!this.isSticky) this.cancelRecording();
      });
      btn.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.clickTimeout) clearTimeout(this.clickTimeout);
        this.isSticky = true;
        if (!this.isRecording) this.startRecording();
      });
      btn.addEventListener('click', (e) => e.preventDefault());

      if (container) {
        container.classList.add('has-voice-button');
        const wrapper = doc.createElement('div');
        wrapper.className = 'cursor-pointer kuplafix-voice-holder';
        wrapper.appendChild(btn);
        this.insertWrapper(container, wrapper);
        this.fabWrapper = wrapper;
      }

      this.fab = btn;
    },

    insertWrapper(container, wrapper) {
      const gif = container.querySelector('.gif-selector');
      if (gif?.parentElement) {
        gif.insertAdjacentElement('afterend', wrapper);
        return;
      }
      const emoji = container.querySelector('.emoji-selector');
      if (emoji?.parentElement) {
        emoji.insertAdjacentElement('beforebegin', wrapper);
        return;
      }
      container.appendChild(wrapper);
    },

    setFabState(state) {
      if (!this.fab) return;
      if (state === 'recording') {
        this.fab.classList.add('recording');
        const label = this.fab.querySelector('.kuplafix-voice-fab-label');
        if (label) label.textContent = 'REC 🔴';
      } else {
        this.fab.classList.remove('recording');
        const label = this.fab.querySelector('.kuplafix-voice-fab-label');
        if (label) label.textContent = 'REC ⚪';
        this.setProgress(0);
      }
    },

    setProgress(percent) {
      if (!this.fab) return;
      const val = Math.max(0, Math.min(100, percent));
      this.fab.style.setProperty('--kuplafix-progress', val);
    },

    startCountdown(durationMs) {
      this.clearCountdown();
      this.countdownEndsAt = Date.now() + durationMs;
      const tick = () => {
        const now = Date.now();
        const elapsed = durationMs - Math.max(0, this.countdownEndsAt - now);
        const pct = (elapsed / durationMs) * 100;
        this.setProgress(pct);
        if (now >= this.countdownEndsAt || !this.isRecording) {
          this.clearCountdown();
        }
      };
      tick();
      this.countdownHandle = setInterval(tick, 80);
    },

    clearCountdown() {
      if (this.countdownHandle) {
        clearInterval(this.countdownHandle);
        this.countdownHandle = null;
      }
      this.setProgress(0);
    },

    async startRecording() {
      if (this.isRecording) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        UI.showToast('Mikrofonia ei voitu käyttää (getUserMedia ei tuettu).', 'error');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        this.wasCancelled = false;

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          try {
            stream.getTracks().forEach((t) => t.stop());
          } catch (_) {}
          const blob = new Blob(this.chunks, { type: 'audio/webm' });
          this.chunks = [];
          this.isRecording = false;
          this.setFabState('idle');
          if (!this.wasCancelled) {
            await this.handleRecordingStop(blob);
          } else {
            log.info('VoiceMessages: recording canceled');
          }
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        this.setFabState('recording');

        const maxDuration = Number(config.get('voiceMessageMaxDurationMs')) || 4000;
        this.startCountdown(maxDuration);
        
        if (this.recordingTimeout) clearTimeout(this.recordingTimeout);
        this.recordingTimeout = setTimeout(() => {
          if (this.isRecording) {
            this.stopRecording();
          }
        }, maxDuration + 50);
      } catch (err) {
        log.error('VoiceMessages: recording failed', err);
        UI.showToast('Äänitys epäonnistui. Tarkista mikrofonin käyttöoikeudet.', 'error');
        this.isRecording = false;
        this.setFabState('idle');
        this.clearCountdown();
      }
    },

    stopRecording(force = false) {
      if (!this.mediaRecorder) return;
      this.isRecording = false;
      this.isSticky = false;
      
      if (this.recordingTimeout) {
        clearTimeout(this.recordingTimeout);
        this.recordingTimeout = null;
      }

      this.clearCountdown();
      this.setFabState('idle');
      if (this.mediaRecorder.state === 'recording') {
        try {
          this.mediaRecorder.stop();
        } catch (e) {
          log.warn('VoiceMessages: stop failed', e);
        }
      } else if (force) {
        try {
          this.mediaRecorder.stop();
        } catch (_) {}
      }
    },

    cancelRecording() {
      if (!this.isRecording) return;
      this.wasCancelled = true;
      this.stopRecording(true);
    },

    async handleRecordingStop(blob) {
      if (!blob || !blob.size) {
        log.warn('VoiceMessages: empty recording');
        return;
      }

      try {
        const uploaded = await this.uploadRecording(blob);
        if (uploaded?.id) {
          this.injectIntoChat(`ref|${uploaded.id}`);
          return;
        }

        if (uploaded?.url) {
          this.injectIntoChat(`url:${uploaded.url}`);
          return;
        }

        UI.showToast('Ääniviestiä ei voitu lähettää (upload epäonnistui).', 'error');
      } catch (err) {
        log.error('VoiceMessages: failed to process audio', err);
      }
    },

    async encodeBlob(blob) {
      const arrayBuffer = await blob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let decoded;
      try {
        decoded = await audioCtx.decodeAudioData(arrayBuffer);
      } catch (err) {
        audioCtx.close();
        throw err;
      }

      const srcData = decoded.getChannelData(0);
      const limitChars = Number(config.get('voiceMessageCharLimit')) || 100;
      const maxBytes = Math.max(4, Math.floor(limitChars / 5) * 4); // encoding ratio: 4 bytes -> 5 chars
      const maxSamples = maxBytes * 2; // 4-bit ADPCM ~0.5 bytes per sample
      if (maxSamples < 4) {
        audioCtx.close();
        throw new Error('VoiceMessages: char limit too small to encode audio');
      }

      const durationMs = Number(config.get('voiceMessageMaxDurationMs')) || 4000;
      const durationSec = Math.max(0.1, durationMs / 1000);

      const baseTargetRate = Number(config.get('voiceMessageSampleRate')) || 8000;
      const MIN_PLAYABLE_RATE = 200; // allow up to ~0.8s at 100 chars while staying audible
      const rateByLimit = Math.max(MIN_PLAYABLE_RATE, Math.floor(maxSamples / durationSec));
      let rate = Math.max(MIN_PLAYABLE_RATE, Math.min(baseTargetRate, rateByLimit));

      const pcm = this.downsample(srcData, decoded.sampleRate, rate);
      // Trim to fit char budget; keep the start of the clip so context is preserved.
      const trimmed = pcm.length > maxSamples ? pcm.subarray(0, maxSamples) : pcm;
      const adpcm = this.encodeIMA4(trimmed);
      let encoded = this.encode85(adpcm);

      const prefix = (r) => {
        const safeRate = Math.max(MIN_PLAYABLE_RATE, Math.min(65535, Math.floor(r)));
        return `r${safeRate.toString(36)}|`;
      };

      // Safety: if we somehow still exceed the limit, fall back to hard trim of the payload.
      const prefixStr = prefix(rate);
      if (encoded.length + prefixStr.length > limitChars) {
        encoded = encoded.slice(0, Math.max(0, limitChars - prefixStr.length));
      }

      audioCtx.close();
      return {
        encoded,
        rate,
        payloadWithRate: `${prefixStr}${encoded}`
      };
    },

    async uploadRecording(blob) {
      const uploadUrl = config.get('voiceMessageUploadUrl');
      if (!uploadUrl) return null;
      try {
        const base64 = await this.blobToBase64(blob);
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mime: blob.type || 'audio/wav', data: base64 }),
        });
        if (!res.ok) throw new Error(`upload failed ${res.status}`);
        const json = await res.json();
        if (json?.url || json?.id) {
          return {
            url: json.url,
            id: json.id || this.extractIdFromUrl(json.url)
          };
        }
      } catch (err) {
        log.warn('VoiceMessages: upload failed, falling back to inline payload', err);
      }
      return null;
    },

    resolvePlaybackBase() {
      const uploadUrl = config.get('voiceMessageUploadUrl') || '';
      if (!uploadUrl) return null;
      return uploadUrl.replace(/\/upload.*$/i, '');
    },

    buildPlaybackUrl(id) {
      if (!id) return null;
      const base = this.resolvePlaybackBase();
      if (!base) return null;
      const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
      return `${normalized}/v/${id}`;
    },

    extractIdFromUrl(url) {
      if (!url) return null;
      try {
        const u = new URL(url);
        const parts = u.pathname.split('/').filter(Boolean);
        return parts.pop() || null;
      } catch (_) {
        return null;
      }
    },

    async blobToBase64(blob) {
      const buffer = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < buffer.length; i++) {
        binary += String.fromCharCode(buffer[i]);
      }
      return btoa(binary);
    },

    downsample(source, srcRate, targetRate) {
      if (targetRate >= srcRate) {
        const intData = new Int16Array(source.length);
        for (let i = 0; i < source.length; i++) {
          intData[i] = this.clamp16(source[i] * 32767);
        }
        return intData;
      }

      const ratio = srcRate / targetRate;
      const newLength = Math.max(1, Math.floor(source.length / ratio));
      const result = new Int16Array(newLength);
      for (let i = 0; i < newLength; i++) {
        const idx = Math.floor(i * ratio);
        result[i] = this.clamp16(source[idx] * 32767);
      }
      return result;
    },

    clamp16(value) {
      const v = Math.round(value);
      if (v > 32767) return 32767;
      if (v < -32768) return -32768;
      return v;
    },

    encodeIMA4(pcm) {
      const indexTable = [-1, -1, -1, -1, 2, 4, 6, 8];
      const stepTable = [
        7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
        19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
        50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
        130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
        337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
        876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
        2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
        5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
        15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
      ];

      let predictor = 0;
      let index = 0;
      let output = new Uint8Array(Math.ceil(pcm.length / 2));
      let outPos = 0;
      let bufferNibble = 0;
      let hasLowNibble = false;

      for (let i = 0; i < pcm.length; i++) {
        const sample = pcm[i];
        let step = stepTable[index];
        let diff = sample - predictor;
        let code = 0;
        if (diff < 0) {
          code = 8;
          diff = -diff;
        }

        if (diff >= step) {
          code |= 4;
          diff -= step;
        }
        if (diff >= step >> 1) {
          code |= 2;
          diff -= step >> 1;
        }
        if (diff >= step >> 2) {
          code |= 1;
        }

        let diffq = step >> 3;
        if (code & 4) diffq += step;
        if (code & 2) diffq += step >> 1;
        if (code & 1) diffq += step >> 2;
        if (code & 8) {
          predictor -= diffq;
        } else {
          predictor += diffq;
        }

        predictor = Math.max(-32768, Math.min(32767, predictor));
        index += indexTable[code & 7];
        index = Math.max(0, Math.min(88, index));

        if (hasLowNibble) {
          output[outPos++] = (code << 4) | bufferNibble;
          hasLowNibble = false;
        } else {
          bufferNibble = code & 0x0f;
          hasLowNibble = true;
        }
      }

      if (hasLowNibble) {
        output[outPos++] = bufferNibble;
      }

      return output.subarray(0, outPos);
    },

    encode85(bytes) {
      if (!bytes || !bytes.length) return '';
      const padding = (4 - (bytes.length % 4)) % 4;
      const padded = new Uint8Array(bytes.length + padding);
      padded.set(bytes);

      let out = '';
      for (let i = 0; i < padded.length; i += 4) {
        const value =
          (padded[i] << 24 >>> 0) +
          (padded[i + 1] << 16) +
          (padded[i + 2] << 8) +
          (padded[i + 3] >>> 0);

        let v = value >>> 0;
        const chars = new Array(5);
        for (let j = 4; j >= 0; j--) {
          chars[j] = (v % 85) + 33;
          v = Math.floor(v / 85);
        }
        out += String.fromCharCode(chars[0], chars[1], chars[2], chars[3], chars[4]);
      }

      return padding ? out.slice(0, out.length - padding) : out;
    },

    decode85(str) {
      if (!str) return new Uint8Array();
      const rem = str.length % 5;
      const paddedStr = rem ? str + 'u'.repeat(5 - rem) : str;
      const bytes = [];
      for (let i = 0; i < paddedStr.length; i += 5) {
        let value = 0;
        for (let j = 0; j < 5; j++) {
          value = value * 85 + ((paddedStr.charCodeAt(i + j) - 33) >>> 0);
        }
        bytes.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
      }
      const trim = rem ? (5 - rem) : 0;
      return new Uint8Array(bytes.slice(0, bytes.length - trim));
    },

    decodeIMA4(bytes) {
      const indexTable = [-1, -1, -1, -1, 2, 4, 6, 8];
      const stepTable = [
        7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
        19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
        50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
        130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
        337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
        876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
        2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
        5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
        15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
      ];

      let predictor = 0;
      let index = 0;
      const out = new Int16Array(bytes.length * 2);
      let pos = 0;

      for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        const nibbles = [b & 0x0f, (b >> 4) & 0x0f]; // low nibble first (matches encoder)
        for (let n = 0; n < 2; n++) {
          const code = nibbles[n];
          let step = stepTable[index];
          let diffq = step >> 3;
          if (code & 4) diffq += step;
          if (code & 2) diffq += step >> 1;
          if (code & 1) diffq += step >> 2;
          if (code & 8) {
            predictor -= diffq;
          } else {
            predictor += diffq;
          }
          predictor = Math.max(-32768, Math.min(32767, predictor));
          index += indexTable[code & 7];
          index = Math.max(0, Math.min(88, index));
          out[pos++] = predictor;
        }
      }

      return out.subarray(0, pos);
    },

    pcmToWav(pcm, sampleRate) {
      const numFrames = pcm.length;
      const headerSize = 44;
      const buffer = new ArrayBuffer(headerSize + numFrames * 2);
      const view = new DataView(buffer);
      let offset = 0;

      const writeString = (str) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset++, str.charCodeAt(i));
        }
      };

      writeString('RIFF');
      view.setUint32(offset, 36 + numFrames * 2, true); offset += 4;
      writeString('WAVE');
      writeString('fmt ');
      view.setUint32(offset, 16, true); offset += 4; // PCM chunk size
      view.setUint16(offset, 1, true); offset += 2; // PCM format
      view.setUint16(offset, 1, true); offset += 2; // channels
      view.setUint32(offset, sampleRate, true); offset += 4;
      view.setUint32(offset, sampleRate * 2, true); offset += 4; // byte rate
      view.setUint16(offset, 2, true); offset += 2; // block align
      view.setUint16(offset, 16, true); offset += 2; // bits per sample
      writeString('data');
      view.setUint32(offset, numFrames * 2, true); offset += 4;

      for (let i = 0; i < numFrames; i++) {
        view.setInt16(offset, pcm[i], true);
        offset += 2;
      }

      return new Uint8Array(buffer);
    },

    resamplePcm(pcm, fromRate, toRate) {
      if (!pcm || !pcm.length || fromRate <= 0 || toRate <= 0) return pcm;
      if (Math.abs(fromRate - toRate) < 1) return pcm;
      const duration = pcm.length / fromRate;
      const newLength = Math.max(1, Math.round(duration * toRate));
      const out = new Int16Array(newLength);
      for (let i = 0; i < newLength; i++) {
        const pos = (i / newLength) * (pcm.length - 1);
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const a = pcm[idx];
        const b = pcm[Math.min(idx + 1, pcm.length - 1)];
        out[i] = this.clamp16(a + (b - a) * frac);
      }
      return out;
    },

    injectIntoChat(encodedPayload) {
      const chatInput = DOM.querySelector('.nitro-chat-input-control');
      if (!chatInput) {
        log.warn('VoiceMessages: chat input not found');
        return;
      }
      const payload = `[voice:${encodedPayload}]`;
      chatInput.value = payload;
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      chatInput.focus();
      this.sendMessage(chatInput);
      chatInput.value = '';
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      log.info(`VoiceMessages: valmis (${encodedPayload.length} merkkiä)`);
    },

    sendMessage(chatInput) {
      const enterDown = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      chatInput.dispatchEvent(enterDown);

      const enterUp = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      chatInput.dispatchEvent(enterUp);
    },

    parsePayload(payload) {
      if (!payload) return { url: null, id: null };

      const normalize = (p) => p.trim();
      const raw = normalize(payload);

      // New masked form: ref|<id>
      if (raw.startsWith('ref|')) {
        const id = raw.slice(4);
        return { id, url: this.buildPlaybackUrl(id) };
      }

      // Legacy id: or token:
      if (raw.startsWith('id:') || raw.startsWith('token:')) {
        const id = raw.slice(raw.indexOf(':') + 1);
        return { id, url: this.buildPlaybackUrl(id) };
      }

      // Legacy id| form (avoid :id: emoji collisions)
      if (raw.startsWith('id|')) {
        const id = raw.slice(3);
        return { id, url: this.buildPlaybackUrl(id) };
      }

      if (raw.startsWith('url:')) return { url: raw.slice(4), id: this.extractIdFromUrl(raw.slice(4)) };
      if (/^https?:\/\//i.test(raw)) return { url: raw, id: this.extractIdFromUrl(raw) };
      return { url: null, id: null };
    },

    async playPayload(payload, docRef = document, chip = null) {
      try {
        const { url } = this.parsePayload(payload);

        if (url) {
          await this.playFromUrl(url, docRef, chip);
          return;
        }

        log.warn('VoiceMessages: payload missing URL');
      } catch (err) {
        log.error('VoiceMessages: playback failed', err);
      }
    },

    async playFromUrl(url, docRef = document, chip = null) {
      const AudioCtor = docRef.defaultView?.Audio || window.Audio;
      const AudioContextCtor = docRef.defaultView?.AudioContext || docRef.defaultView?.webkitAudioContext || window.AudioContext || window.webkitAudioContext;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const blob = await res.blob();

        // Pre-decode to get exact duration immediately if possible
        if (chip && AudioContextCtor) {
          const tempCtx = new AudioContextCtor();
          try {
            const arrayBuffer = await blob.arrayBuffer().catch(() => null);
            if (arrayBuffer) {
              const decoded = await tempCtx.decodeAudioData(arrayBuffer).catch(() => null);
              if (decoded && decoded.duration > 0) {
                chip.dataset.kuplafixVoiceDuration = String(decoded.duration);
              }
            }
          } catch (e) {
            // ignore pre-decode errors
          } finally {
            tempCtx.close().catch(() => {});
          }
        }

        const audioUrl = URL.createObjectURL(blob);
        const audio = new AudioCtor(audioUrl);
        
        const formatTime = (secs) => {
          const s = Number.isFinite(secs) ? Math.max(0, Math.floor(secs)) : 0;
          const m = Math.floor(s / 60);
          const r = s % 60;
          return `${m}:${r.toString().padStart(2, '0')}`;
        };

        if (chip) {
          chip._audio = audio;
          const playBtn = chip.querySelector('.kuplafix-voice-play');
          const waveformFg = chip.querySelector('.kuplafix-voice-waveform-fg');
          const status = chip.querySelector('.kuplafix-voice-status');
          
          chip.classList.add('playing');
          if (playBtn) playBtn.innerHTML = this.PAUSE_ICON;

          const setStatus = (text) => {
            if (status) status.textContent = text;
          };

          let rafHandle = null;
          const updateProgress = () => {
            const audioDur = audio.duration;
            const storedDur = Number(chip.dataset.kuplafixVoiceDuration);
            
            let dur = 0;
            if (Number.isFinite(audioDur) && audioDur > 0) {
              dur = audioDur;
            } else {
              dur = storedDur || 4;
            }

            if (dur > 0) {
              const pct = (audio.currentTime / dur) * 100;
              if (waveformFg) {
                const clipValue = `inset(0 ${Math.max(0, 100 - pct)}% 0 0)`;
                waveformFg.style.clipPath = clipValue;
                waveformFg.style.webkitClipPath = clipValue;
              }
            }
            
            setStatus(formatTime(audio.currentTime));

            if (!audio.paused && !audio.ended) {
              rafHandle = requestAnimationFrame(updateProgress);
            } else {
              rafHandle = null;
            }
          };

          // Once we know duration, show it while idle.
          audio.onloadedmetadata = () => {
            const dur = audio.duration;
            if (Number.isFinite(dur) && dur > 0) {
              chip.dataset.kuplafixVoiceDuration = String(dur);
              if (audio.paused) setStatus(formatTime(dur));
            }
          };
          
          audio.onplaying = () => {
            if (playBtn) playBtn.innerHTML = this.PAUSE_ICON;
            chip.classList.add('playing');
            if (!rafHandle) updateProgress();
          };

          audio.onplay = () => {
            if (playBtn) playBtn.innerHTML = this.PAUSE_ICON;
            chip.classList.add('playing');
            if (!rafHandle) updateProgress();
          };

          audio.ontimeupdate = () => {
            if (!rafHandle && !audio.paused) updateProgress();
          };

          audio.onpause = () => {
            if (playBtn) playBtn.innerHTML = this.PLAY_ICON;
            if (rafHandle) cancelAnimationFrame(rafHandle);
            rafHandle = null;
            setStatus(formatTime(audio.currentTime));
          };
          
          audio.onended = () => {
            chip.classList.remove('playing');
            if (playBtn) playBtn.innerHTML = this.PLAY_ICON;
            if (waveformFg) {
              waveformFg.style.clipPath = 'inset(0 100% 0 0)';
              waveformFg.style.webkitClipPath = 'inset(0 100% 0 0)';
            }
            if (rafHandle) cancelAnimationFrame(rafHandle);
            rafHandle = null;
            const storedDur = Number(chip.dataset.kuplafixVoiceDuration);
            setStatus(formatTime(storedDur || audio.duration));
            URL.revokeObjectURL(audioUrl);
            delete chip._audio;
          };
        }

        audio.play().then(() => {
          if (chip) updateProgress();
        }).catch((err) => {
          log.error('VoiceMessages: url audio play failed', err);
          URL.revokeObjectURL(audioUrl);
          if (chip) {
            chip.classList.remove('playing');
            delete chip._audio;
          }
        });
      } catch (err) {
        log.error('VoiceMessages: playFromUrl failed', err);
      }
    },

    startPlaybackObservers(docRef = document) {
      if (!docRef || this.monitoredDocs.has(docRef)) return;
      this.monitoredDocs.add(docRef);

      const scan = () => this.scanDoc(docRef);
      scan();

      try {
        const root = docRef.body || docRef.documentElement;
        const obs = new MutationObserver(() => scan());
        obs.observe(root, { childList: true, subtree: true });
        this.observers.set(docRef, obs);
      } catch (e) {
        log.warn('VoiceMessages: observer failed', e);
      }
    },

    scanDoc(docRef) {
      const nodes = docRef.querySelectorAll('.chat-bubble .message, .bubble-container .message, .chat-bubble .chat-content');
      nodes.forEach((node) => this.processNode(node, docRef));
    },

    processNode(node, docRef) {
      if (!node) return;

      // If we got the chat-content wrapper, dive into its message span to avoid wiping usernames
      if (node.classList?.contains('chat-content')) {
        const innerMessage = node.querySelector('.message');
        if (innerMessage) this.processNode(innerMessage, docRef);
        return;
      }

      if (node.dataset.kuplafixVoiceProcessed === 'true') return;

      const text = node.textContent || '';
      const doc = node.ownerDocument || document;
      const frag = doc.createDocumentFragment();
      let cursor = 0;
      let found = false;

      const createChip = (payload) => {
        const chip = doc.createElement('span');
        chip.className = 'kuplafix-voice-chip';

        const playBtn = doc.createElement('button');
        playBtn.className = 'kuplafix-voice-play';
        playBtn.type = 'button';
        playBtn.innerHTML = this.PLAY_ICON;
        playBtn.title = 'Kuuntele ääniviesti';
        
        const waveformContainer = doc.createElement('div');
        waveformContainer.className = 'kuplafix-voice-waveform-container';

        const waveformBg = doc.createElement('div');
        waveformBg.className = 'kuplafix-voice-waveform-bg';

        const waveformFg = doc.createElement('div');
        waveformFg.className = 'kuplafix-voice-waveform-fg';

        // Generate fake waveform bars
        const barCount = 35; 
        for (let i = 0; i < barCount; i++) {
          const height = 4 + Math.random() * 16; 
          
          const bgBar = doc.createElement('div');
          bgBar.className = 'kuplafix-voice-bar';
          bgBar.style.height = `${height}px`;
          waveformBg.appendChild(bgBar);

          const fgBar = doc.createElement('div');
          fgBar.className = 'kuplafix-voice-bar';
          fgBar.style.height = `${height}px`;
          waveformFg.appendChild(fgBar);
        }

        waveformContainer.appendChild(waveformBg);
        waveformContainer.appendChild(waveformFg);

        const status = doc.createElement('span');
        status.className = 'kuplafix-voice-status';
        status.textContent = '0:00';

        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (chip._audio) {
            if (chip._audio.paused) chip._audio.play();
            else chip._audio.pause();
            return;
          }
          this.playPayload(payload, docRef || doc, chip);
        });

        chip.appendChild(playBtn);
        chip.appendChild(waveformContainer);
        chip.appendChild(status);
        return chip;
      };

      while (true) {
        const start = text.indexOf('[voice:', cursor);
        if (start === -1) break;

        const nextSpaceRel = text.slice(start).search(/\s/);
        const spanEnd = nextSpaceRel === -1 ? text.length : start + nextSpaceRel;
        let close = text.lastIndexOf(']', spanEnd - 1);
        if (close < start) close = text.indexOf(']', start);
        if (close === -1) break;

        if (start > cursor) {
          frag.append(text.slice(cursor, start));
        }

        const payload = text.slice(start + 7, close);
        frag.appendChild(createChip(payload));
        found = true;
        cursor = close + 1;
      }

      if (cursor < text.length) {
        frag.append(text.slice(cursor));
      }

      if (!found) return;

      node.dataset.kuplafixVoiceProcessed = 'true';

      // Preserve original element wrapper and only replace its text content
      while (node.firstChild) node.removeChild(node.firstChild);
      node.appendChild(frag);
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // Packet Manager (Interception & Injection)
  // ─────────────────────────────────────────────────────────────────
  const PacketManager = {
    socket: null,
    loggingEnabled: false,
    outgoingHistory: [],
    incomingHistory: [],
    maxHistory: 50,
    ignoredOutgoingHeaders: new Set(),
    ignoredIncomingHeaders: new Set(),
    macros: [],
    macroExecuting: new Set(), // Prevent infinite loops
    
    // Known Header IDs (can be expanded)
    HEADERS: {
      OUTGOING: {
        "ACHIEVEMENT_LIST": 219,
        "AUTHENTICATION": -1,
        "BOT_CONFIGURATION": 1986,
        "BOT_PICKUP": 3323,
        "BOT_PLACE": 1592,
        "BOT_SKILL_SAVE": 2624,
        "GET_CLUB_OFFERS": 3285,
        "GET_CLUB_GIFT_INFO": 487,
        "GET_CATALOG_INDEX": 1195,
        "GET_CATALOG_PAGE": 412,
        "CATALOG_PURCHASE": 3492,
        "CATALOG_PURCHASE_GIFT": 1411,
        "GET_PRODUCT_OFFER": 2594,
        "CLIENT_LATENCY": 295,
        "CLIENT_LATENCY_MEASURE": 96,
        "CLIENT_POLICY": 26979,
        "CLIENT_PONG": 2596,
        "CLIENT_TOOLBAR_TOGGLE": 2313,
        "CLIENT_VARIABLES": 1053,
        "GET_CURRENT_TIMING_CODE": 2912,
        "DESKTOP_NEWS": 1827,
        "DESKTOP_VIEW": 105,
        "GET_BUNDLE_DISCOUNT_RULESET": 223,
        "EVENT_TRACKER": 3457,
        "FIND_NEW_FRIENDS": 516,
        "FURNITURE_ALIASES": 3898,
        "FURNITURE_FLOOR_UPDATE": 248,
        "FURNITURE_MULTISTATE": 99,
        "FURNITURE_PICKUP": 3456,
        "FURNITURE_PLACE": 1258,
        "FURNITURE_POSTIT_PLACE": 2248,
        "FURNITURE_POSTIT_SAVE_STICKY_POLE": 3283,
        "FURNITURE_RANDOMSTATE": 3617,
        "FURNITURE_WALL_MULTISTATE": 210,
        "FURNITURE_WALL_UPDATE": 168,
        "GAMES_INIT": 2914,
        "GAMES_LIST": 741,
        "ACCEPTGAMEINVITE": 3802,
        "GAMEUNLOADEDMESSAGE": 3207,
        "GETGAMEACHIEVEMENTSMESSAGE": 2399,
        "GETGAMESTATUSMESSAGE": 3171,
        "GETUSERGAMEACHIEVEMENTSMESSAGE": 389,
        "JOINQUEUEMESSAGE": 1458,
        "LEAVEQUEUEMESSAGE": 2384,
        "RESETRESOLUTIONACHIEVEMENTMESSAGE": 3144,
        "GETWEEKLYGAMEREWARDWINNERS": 1054,
        "GAME2GETACCOUNTGAMESTATUSMESSAGE": 11,
        "GAME2CHECKGAMEDIRECTORYSTATUSMESSAGE": 3259,
        "GAME2EXITGAMEMESSAGE": 1445,
        "GAME2GAMECHATMESSAGE": 2502,
        "GAME2LOADSTAGEREADYMESSAGE": 2415,
        "GAME2PLAYAGAINMESSAGE": 3196,
        "GAME2REQUESTFULLSTATUSUPDATEMESSAGE": 1598,
        "GAME2GETWEEKLYFRIENDSLEADERBOARD": 1232,
        "GAME2GETWEEKLYLEADERBOARD": 2565,
        "GET_GIFT_WRAPPING_CONFIG": 418,
        "GROUP_ADMIN_ADD": 2894,
        "GROUP_ADMIN_REMOVE": 722,
        "GROUP_CREATE_OPTIONS": 798,
        "GROUP_FAVORITE": 3549,
        "GET_FORUM_STATS": 3149,
        "GET_FORUM_THREADS": 873,
        "GET_FORUMS_LIST": 436,
        "GET_FORUM_MESSAGES": 232,
        "GET_FORUM_THREAD": 3900,
        "GET_UNREAD_FORUMS_COUNT": 2908,
        "FORUM_MODERATE_MESSAGE": 286,
        "FORUM_MODERATE_THREAD": 1397,
        "FORUM_POST_MESSAGE": 3529,
        "UPDATE_FORUM_READ_MARKER": 1855,
        "UPDATE_FORUM_SETTINGS": 2214,
        "FORUM_UPDATE_THREAD": 3045,
        "GROUP_INFO": 2991,
        "GROUP_DELETE": 1134,
        "GROUP_MEMBER_REMOVE_CONFIRM": 3593,
        "GROUP_MEMBER_REMOVE": 593,
        "GROUP_MEMBERS": 312,
        "GROUP_MEMBERSHIPS": 367,
        "GROUP_REQUEST": 998,
        "GROUP_REQUEST_ACCEPT": 3386,
        "GROUP_REQUEST_DECLINE": 1894,
        "GROUP_SETTINGS": 1004,
        "GROUP_PARTS": 813,
        "GROUP_BUY": 230,
        "GROUP_SAVE_INFORMATION": 3137,
        "GROUP_SAVE_BADGE": 1991,
        "GROUP_SAVE_COLORS": 1764,
        "GROUP_SAVE_PREFERENCES": 3435,
        "GROUP_BADGES": 21,
        "GROUP_UNBLOCK_MEMBER": 2864,
        "GET_BADGE_POINTS_LIMITS": 1371,
        "REQUESTABADGE": 3077,
        "GETISBADGEREQUESTFULFILLED": 1364,
        "ITEM_CLOTHING_REDEEM": 3374,
        "ITEM_COLOR_WHEEL_CLICK": 2144,
        "ITEM_DICE_CLICK": 1990,
        "ITEM_DICE_CLOSE": 1533,
        "ITEM_DIMMER_SAVE": 1648,
        "ITEM_DIMMER_SETTINGS": 2813,
        "ITEM_DIMMER_TOGGLE": 2296,
        "ITEM_EXCHANGE_REDEEM": 3115,
        "ITEM_PAINT": 711,
        "SET_OBJECT_DATA": 3608,
        "ITEM_STACK_HELPER": 3839,
        "ITEM_WALL_CLICK": 210,
        "ITEM_WALL_UPDATE": 168,
        "MARKETPLACE_CONFIG": 2597,
        "ACCEPT_FRIEND": 137,
        "MESSENGER_CHAT": 3567,
        "DECLINE_FRIEND": 2890,
        "FOLLOW_FRIEND": 3997,
        "MESSENGER_FRIENDS": 1523,
        "MESSENGER_INIT": 2781,
        "MESSENGER_RELATIONSHIPS": 2138,
        "SET_RELATIONSHIP_STATUS": 3768,
        "REMOVE_FRIEND": 1689,
        "REQUEST_FRIEND": 3157,
        "GET_FRIEND_REQUESTS": 2448,
        "SEND_ROOM_INVITE": 1276,
        "HABBO_SEARCH": 1210,
        "FRIEND_LIST_UPDATE": 1419,
        "MOD_TOOL_USER_INFO": 3295,
        "GET_USER_FLAT_CATS": 3027,
        "NAVIGATOR_INIT": 2110,
        "NAVIGATOR_SEARCH": 249,
        "NAVIGATOR_SEARCH_CLOSE": 1834,
        "NAVIGATOR_SEARCH_OPEN": 637,
        "NAVIGATOR_SEARCH_SAVE": 2226,
        "GET_USER_EVENT_CATS": 1782,
        "NAVIGATOR_SETTINGS_SAVE": 3159,
        "NAVIGATOR_CATEGORY_LIST_MODE": 1202,
        "NAVIGATOR_DELETE_SAVED_SEARCH": 1954,
        "PET_INFO": 2934,
        "PET_PICKUP": 1581,
        "PET_PLACE": 2647,
        "PET_RESPECT": 3202,
        "PET_RIDE": 1036,
        "PET_MOVE": 3449,
        "PET_OPEN_PACKAGE": 3698,
        "PET_SELECTED": 549,
        "PETS_BREED": 1638,
        "PET_CANCEL_BREEDING": 2713,
        "PET_CONFIRM_BREEDING": 3382,
        "GET_PET_TRAINING_PANEL": 2161,
        "RECYCLER_PRIZES": 398,
        "RECYCLER_STATUS": 1342,
        "RECYCLER_ITEMS": 2771,
        "RELEASE_VERSION": 4000,
        "CALL_FOR_HELP": 1691,
        "ROOM_AMBASSADOR_ALERT": 2996,
        "ROOM_BAN_GIVE": 1477,
        "ROOM_BAN_LIST": 2267,
        "ROOM_BAN_REMOVE": 992,
        "ROOM_CREATE": 2752,
        "ROOM_DELETE": 532,
        "ROOM_DOORBELL": 1644,
        "ROOM_ENTER": 2312,
        "ROOM_FAVORITE": 3817,
        "ROOM_FAVORITE_REMOVE": 309,
        "CAN_CREATE_ROOM": 2128,
        "CANCEL_ROOM_EVENT": 2725,
        "EDIT_ROOM_EVENT": 3991,
        "COMPETITION_ROOM_SEARCH": 433,
        "FORWARD_TO_RANDOM_PROMOTED_ROOM": 10,
        "FORWARD_TO_SOME_ROOM": 1703,
        "GET_CATEGORIES_WITH_USER_COUNT": 3782,
        "GET_GUEST_ROOM": 2230,
        "GET_OFFICIAL_ROOMS": 1229,
        "GET_POPULAR_ROOM_TAGS": 826,
        "GUILD_BASE_SEARCH": 2930,
        "MY_FAVOURITE_ROOMS_SEARCH": 2578,
        "MY_FREQUENT_ROOM_HISTORY_SEARCH": 1002,
        "MY_FRIENDS_ROOM_SEARCH": 2266,
        "MY_GUILD_BASES_SEARCH": 39,
        "MY_RECOMMENDED_ROOMS": 2537,
        "MY_ROOM_HISTORY_SEARCH": 2264,
        "MY_ROOM_RIGHTS_SEARCH": 272,
        "MY_ROOMS_SEARCH": 2277,
        "POPULAR_ROOMS_SEARCH": 2758,
        "ROOM_AD_EVENT_TAB_CLICKED": 2412,
        "ROOM_AD_EVENT_TAB_VIEWED": 2668,
        "ROOM_AD_SEARCH": 2809,
        "ROOM_TEXT_SEARCH": 3943,
        "ROOMS_WHERE_MY_FRIENDS_ARE": 1786,
        "ROOMS_WITH_HIGHEST_SCORE_SEARCH": 2939,
        "SET_ROOM_SESSION_TAGS": 3305,
        "UPDATE_ROOM_THUMBNAIL": 2468,
        "ROOM_KICK": 1320,
        "ROOM_LIKE": 3582,
        "ROOM_MODEL": 2300,
        "GET_OCCUPIED_TILES": 1687,
        "GET_ROOM_ENTRY_TILE": 3559,
        "ROOM_MODEL_SAVE": 875,
        "ROOM_MUTE": 3637,
        "ROOM_MUTE_USER": 3485,
        "ROOM_RIGHTS_GIVE": 808,
        "ROOM_RIGHTS_LIST": 3385,
        "ROOM_RIGHTS_REMOVE": 2064,
        "ROOM_RIGHTS_REMOVE_ALL": 2683,
        "ROOM_RIGHTS_REMOVE_OWN": 3182,
        "ROOM_SETTINGS": 3129,
        "ROOM_SETTINGS_SAVE": 1969,
        "ROOM_SETTINGS_UPDATE_ROOM_CATEGORY_AND_TRADE": 1265,
        "ROOM_STAFF_PICK": 1918,
        "ROOM_FILTER_WORDS": 1911,
        "ROOM_FILTER_WORDS_MODIFY": 3001,
        "MYSTERYBOXWAITINGCANCELEDMESSAGE": 2012,
        "MYSTERYBOX_OPEN_TROPHY": 3074,
        "SECURITY_MACHINE": 2490,
        "SECURITY_TICKET": 2419,
        "TRADE": 1481,
        "TRADE_ACCEPT": 3863,
        "TRADE_CANCEL": 2341,
        "TRADE_CLOSE": 2551,
        "TRADE_CONFIRM": 2760,
        "TRADE_ITEM": 3107,
        "TRADE_ITEM_REMOVE": 3845,
        "TRADE_ITEMS": 1263,
        "TRADE_UNACCEPT": 1444,
        "UNIT_ACTION": 2456,
        "UNIT_CHAT": 1314,
        "UNIT_CHAT_SHOUT": 2085,
        "UNIT_CHAT_WHISPER": 1543,
        "UNIT_DANCE": 2080,
        "UNIT_DROP_HAND_ITEM": 2814,
        "UNIT_GIVE_HANDITEM": 2941,
        "UNIT_LOOK": 3301,
        "UNIT_POSTURE": 2235,
        "UNIT_SIGN": 1975,
        "UNIT_TYPING": 1597,
        "UNIT_TYPING_STOP": 1474,
        "UNIT_WALK": 3320,
        "USER_BADGES": 2769,
        "USER_BADGES_CURRENT": 2091,
        "USER_BADGES_CURRENT_UPDATE": 644,
        "USER_BOTS": 3848,
        "USER_CURRENCY": 273,
        "USER_EFFECT_ACTIVATE": 2959,
        "USER_EFFECT_ENABLE": 1752,
        "USER_FIGURE": 2730,
        "USER_FURNITURE": 3150,
        "REQUESTFURNIINVENTORYWHENNOTINROOM": 3500,
        "USER_HOME_ROOM": 1740,
        "USER_INFO": 357,
        "USER_MOTTO": 2228,
        "USER_IGNORED": 3878,
        "USER_PETS": 3095,
        "USER_PROFILE": 3265,
        "USER_PROFILE_BY_NAME": 2249,
        "USER_RESPECT": 2694,
        "GET_SOUND_SETTINGS": 2388,
        "USER_SETTINGS_CAMERA": 1461,
        "USER_SETTINGS_CHAT_STYLE": 1030,
        "USER_SETTINGS_INVITES": 1086,
        "USER_SETTINGS_OLD_CHAT": 1262,
        "USER_SETTINGS_VOLUME": 1367,
        "USER_SUBSCRIPTION": 3166,
        "GET_WARDROBE": 2742,
        "SAVE_WARDROBE_OUTFIT": 800,
        "USER_TAGS": 17,
        "PEER_USERS_CLASSIFICATION": 1160,
        "USER_CLASSIFICATION": 2285,
        "VISIT_USER": 2970,
        "WIRED_ACTION_SAVE": 2281,
        "WIRED_APPLY_SNAPSHOT": 3373,
        "WIRED_CONDITION_SAVE": 3203,
        "WIRED_OPEN": 768,
        "WIRED_TRIGGER_SAVE": 1520,
        "GET_ITEM_DATA": 3964,
        "ONE_WAY_DOOR_CLICK": 2765,
        "REMOVE_WALL_ITEM": 3336,
        "SET_ITEM_DATA": 3666,
        "CATALOG_REDEEM_VOUCHER": 339,
        "ROOM_TONER_APPLY": 2880,
        "FRIEND_FURNI_CONFIRM_LOCK": 3775,
        "MANNEQUIN_SAVE_NAME": 2850,
        "MANNEQUIN_SAVE_LOOK": 2209,
        "PRESENT_OPEN_PRESENT": 3558,
        "CATALOG_SELECT_VIP_GIFT": 2276,
        "USER_IGNORE_ID": 3314,
        "USER_IGNORE": 1117,
        "USER_UNIGNORE": 2061,
        "MODTOOL_REQUEST_ROOM_INFO": 707,
        "MODTOOL_CHANGE_ROOM_SETTINGS": 3260,
        "MODTOOL_REQUEST_USER_CHATLOG": 1391,
        "MODTOOL_REQUEST_ROOM_CHATLOG": 2587,
        "MODTOOL_SANCTION_ALERT": 229,
        "MODTOOL_SANCTION_BAN": 2766,
        "MODTOOL_SANCTION_KICK": 2582,
        "MODTOOL_SANCTION_TRADELOCK": 3742,
        "MODTOOL_ALERTEVENT": 1840,
        "MODTOOL_SANCTION_MUTE": 1945,
        "MODTOOL_REQUEST_USER_ROOMS": 3526,
        "MODTOOL_ROOM_ALERT": 3842,
        "MODTOOL_PREFERENCES": 31,
        "CLOSE_ISSUE_DEFAULT_ACTION": 2717,
        "CLOSE_ISSUES": 2067,
        "DEFAULT_SANCTION": 1681,
        "GET_CFH_CHATLOG": 211,
        "MODTOOL_SANCTION": 1392,
        "PICK_ISSUES": 15,
        "RELEASE_ISSUES": 1572,
        "CONVERT_GLOBAL_ROOM_ID": 314,
        "REQUEST_SELL_ITEM": 848,
        "REQUEST_MARKETPLACE_ITEM_STATS": 3288,
        "MARKETPLACE_SELL_ITEM": 3447,
        "MARKETPLACE_REQUEST_OWN_ITEMS": 2105,
        "MARKETPLACE_TAKE_BACK_ITEM": 434,
        "MARKETPLACE_REDEEM_CREDITS": 2650,
        "MARKETPLACE_REQUEST_OFFERS": 2407,
        "MARKETPLACE_BUY_OFFER": 1603,
        "MARKETPLACE_BUY_TOKENS": 1866,
        "CATALOG_REQUESET_PET_BREEDS": 1756,
        "APPROVE_NAME": 2109,
        "UNIT_GIVE_HANDITEM_PET": 2768,
        "PET_MOUNT": 1036,
        "PET_SUPPLEMENT": 749,
        "FURNITURE_GROUP_INFO": 2651,
        "ACHIEVEMENT_RESOLUTION_OPEN": 359,
        "USE_PET_PRODUCT": 1328,
        "REMOVE_PET_SADDLE": 186,
        "TOGGLE_PET_RIDING": 1472,
        "TOGGLE_PET_BREEDING": 3379,
        "UNSEEN_RESET_CATEGORY": 3493,
        "UNSEEN_RESET_ITEMS": 2343,
        "COMMUNITY_GOAL_VOTE_COMPOSER": 3536,
        "GET_PROMO_ARTICLES": 1827,
        "ACCEPT_QUEST": 3604,
        "ACTIVATE_QUEST": 793,
        "CANCEL_QUEST": 3133,
        "FRIEND_REQUEST_QUEST_COMPLETE": 1148,
        "GET_COMMUNITY_GOAL_EARNED_PRIZES": 2688,
        "GET_COMMUNITY_GOAL_HALL_OF_FAME": 2167,
        "GET_COMMUNITY_GOAL_PROGRESS": 1145,
        "GET_CONCURRENT_USERS_GOAL_PROGRESS": 1343,
        "GET_CONCURRENT_USERS_REWARD": 3872,
        "GET_DAILY_QUEST": 2486,
        "GET_QUESTS": 3333,
        "GET_SEASONAL_QUESTS_ONLY": 1190,
        "OPEN_QUEST_TRACKER": 2750,
        "REDEEM_COMMUNITY_GOAL_PRIZE": 90,
        "REJECT_QUEST": 2397,
        "START_CAMPAIGN": 1697,
        "GET_BONUS_RARE_INFO": 957,
        "CRAFT": 3591,
        "CRAFT_SECRET": 1251,
        "GET_CRAFTABLE_PRODUCTS": 633,
        "GET_CRAFTING_RECIPE": 1173,
        "GET_CRAFTING_RECIPES_AVAILABLE": 3086,
        "PHOTO_COMPETITION": 3959,
        "PUBLISH_PHOTO": 2068,
        "PURCHASE_PHOTO": 2408,
        "RENDER_ROOM": 3226,
        "RENDER_ROOM_THUMBNAIL": 1982,
        "REQUEST_CAMERA_CONFIGURATION": 796,
        "ADD_JUKEBOX_DISK": 753,
        "GET_JUKEBOX_PLAYLIST": 1435,
        "GET_NOW_PLAYING": 1325,
        "GET_OFFICIAL_SONG_ID": 3189,
        "GET_SONG_INFO": 3082,
        "GET_SOUND_MACHINE_PLAYLIST": 3498,
        "GET_USER_SONG_DISKS": 2304,
        "REMOVE_JUKEBOX_DISK": 3050,
        "INTERSTITIAL_SHOWN": 1109,
        "GET_INTERSTITIAL": 2519,
        "CHANGE_USERNAME": 2977,
        "CHECK_USERNAME": 3950,
        "OPEN_CAMPAIGN_CALENDAR_DOOR_STAFF": 3889,
        "OPEN_CAMPAIGN_CALENDAR_DOOR": 2257,
        "BUILDERS_CLUB_PLACE_ROOM_ITEM": 1051,
        "BUILDERS_CLUB_PLACE_WALL_ITEM": 462,
        "BUILDERS_CLUB_QUERY_FURNI_COUNT": 2529,
        "GET_CATALOG_PAGE_EXPIRATION": 742,
        "GET_CATALOG_PAGE_WITH_EARLIEST_EXP": 3135,
        "GET_DIRECT_CLUB_BUY_AVAILABLE": 801,
        "GET_HABBO_BASIC_MEMBERSHIP_EXTEND_OFFER": 603,
        "GET_HABBO_CLUB_EXTEND_OFFER": 2462,
        "GET_IS_OFFER_GIFTABLE": 1347,
        "GET_LIMITED_OFFER_APPEARING_NEXT": 410,
        "GET_NEXT_TARGETED_OFFER": 596,
        "GET_ROOM_AD_PURCHASE_INFO": 1075,
        "GET_SEASONAL_CALENDAR_DAILY_OFFER": 3257,
        "GET_TARGETED_OFFER": 2487,
        "MARK_CATALOG_NEW_ADDITIONS_PAGE_OPENED": 2150,
        "PURCHASE_BASIC_MEMBERSHIP_EXTENSION": 2735,
        "PURCHASE_ROOM_AD": 777,
        "PURCHASE_TARGETED_OFFER": 1826,
        "PURCHASE_VIP_MEMBERSHIP_EXTENSION": 3407,
        "ROOM_AD_PURCHASE_INITIATED": 2283,
        "SET_TARGETTED_OFFER_STATE": 2041,
        "SHOP_TARGETED_OFFER_VIEWED": 3483,
        "HELPER_TALENT_TRACK": 196,
        "TALENT_TRACK_GET_LEVEL": 2127,
        "FORWARD_TO_A_COMPETITION_ROOM": 172,
        "FORWARD_TO_A_SUBMITTABLE_ROOM": 1450,
        "FORWARD_TO_RANDOM_COMPETITION_ROOM": 865,
        "GET_IS_USER_PART_OF_COMPETITION": 2077,
        "GET_SECONDS_UNTIL": 271,
        "ROOM_COMPETITION_INIT": 1334,
        "SUBMIT_ROOM_TO_COMPETITION": 2595,
        "VOTE_FOR_ROOM": 143,
        "GET_GIFT": 2436,
        "RESET_PHONE_NUMBER_STATE": 2741,
        "SET_PHONE_NUMBER_VERIFICATION_STATUS": 1379,
        "TRY_PHONE_NUMBER": 790,
        "VERIFY_CODE": 2721,
        "CONTROL_YOUTUBE_DISPLAY_PLAYBACK": 3005,
        "GET_YOUTUBE_DISPLAY_STATUS": 336,
        "SET_YOUTUBE_DISPLAY_PLAYLIST": 2069,
        "GO_TO_FLAT": 685,
        "CHANGE_QUEUE": 3093,
        "CALL_FOR_HELP_FROM_FORUM_MESSAGE": 1412,
        "CALL_FOR_HELP_FROM_FORUM_THREAD": 534,
        "CALL_FOR_HELP_FROM_IM": 2950,
        "CALL_FOR_HELP_FROM_PHOTO": 2492,
        "CALL_FOR_HELP_FROM_SELFIE": 2755,
        "CHAT_REVIEW_GUIDE_DECIDES": 3365,
        "CHAT_REVIEW_GUIDE_DETACHED": 2501,
        "CHAT_REVIEW_GUIDE_VOTE": 3961,
        "CHAT_REVIEW_SESSION_CREATE": 3060,
        "DELETE_PENDING_CALLS_FOR_HELP": 3605,
        "GET_CFH_STATUS": 2746,
        "GET_FAQ_CATEGORY": 3445,
        "GET_FAQ_TEXT": 1849,
        "GET_GUIDE_REPORTING_STATUS": 3786,
        "GET_PENDING_CALLS_FOR_HELP": 3267,
        "GET_QUIZ_QUESTIONS": 1296,
        "GUIDE_SESSION_CREATE": 3338,
        "GUIDE_SESSION_FEEDBACK": 477,
        "GUIDE_SESSION_GET_REQUESTER_ROOM": 1052,
        "GUIDE_SESSION_GUIDE_DECIDES": 1424,
        "GUIDE_SESSION_INVITE_REQUESTER": 234,
        "GUIDE_SESSION_IS_TYPING": 519,
        "GUIDE_SESSION_MESSAGE": 3899,
        "GUIDE_SESSION_ON_DUTY_UPDATE": 1922,
        "GUIDE_SESSION_REPORT": 3969,
        "GUIDE_SESSION_REQUESTER_CANCELS": 291,
        "GUIDE_SESSION_RESOLVED": 887,
        "POST_QUIZ_ANSWERS": 3720,
        "SEARCH_FAQS": 2031,
        "POLL_ANSWER": 3505,
        "POLL_REJECT": 1773,
        "POLL_START": 109,
        "DISCONNECT": 2445,
        "SCR_GET_KICKBACK_INFO": 869,
        "COMPOST_PLANT": 3835,
        "HARVEST_PET": 1521,
        "SET_CLOTHING_CHANGE_DATA": 924,
        "GROUP_UNFAVORITE": 1820,
        "NEW_USER_EXPERIENCE_GET_GIFTS": 1822,
        "NEW_USER_EXPERIENCE_SCRIPT_PROCEED": 1299,
        "HANDSHAKE_INIT_DIFFIE": 3110,
        "HANDSHAKE_COMPLETE_DIFFIE": 773,
        "WELCOME_OPEN_GIFT": 2638,
        "WELCOME_GIFT_CHANGE_EMAIL": 66,
        "EMAIL_GET_STATUS": 2557,
        "EMAIL_CHANGE": 3965,
        "APPROVE_ALL_MEMBERSHIP_REQUESTS": 882,
        "RENTABLE_SPACE_CANCEL_RENT": 1667,
        "RENTABLE_SPACE_RENT": 2946,
        "RENTABLE_SPACE_STATUS": 872,
        "TRACKING_PERFORMANCE_LOG": 3230,
        "TRACKING_LAG_WARNING_REPORT": 3847,
        "ROOM_DIRECTORY_ROOM_NETWORK_OPEN_CONNECTION": 3736,
        "RENTABLE_EXTEND_RENT_OR_BUYOUT_STRIP_ITEM": 2115,
        "RENTABLE_EXTEND_RENT_OR_BUYOUT_FURNI": 1071,
        "RENTABLE_GET_RENT_OR_BUYOUT_OFFER": 2518,
        "DELETE_ITEM": 10018
      },
      INCOMING: {
        "ACHIEVEMENT_LIST": 305,
        "AUTHENTICATED": 2491,
        "AUTHENTICATION": -1,
        "AVAILABILITY_STATUS": 2033,
        "BUILDERS_CLUB_EXPIRED": 1452,
        "CLUB_OFFERS": 2405,
        "CATALOG_PAGE": 804,
        "CATALOG_PAGE_LIST": 1032,
        "CATALOG_PURCHASE_OK": 869,
        "CATALOG_PURCHASE_ERROR": 1404,
        "CATALOG_PURCHASE_NOT_ALLOWED": 3770,
        "PRODUCT_OFFER": 3388,
        "LIMITED_SOLD_OUT": 377,
        "CATALOG_PUBLISHED": 1866,
        "CFH_RESULT_MESSAGE": 3635,
        "CLIENT_LATENCY": 10,
        "CLIENT_PING": 3928,
        "DESKTOP_CAMPAIGN": 1745,
        "DESKTOP_NEWS": 286,
        "DESKTOP_VIEW": 122,
        "BUNDLE_DISCOUNT_RULESET": 2347,
        "FIRST_LOGIN_OF_DAY": 793,
        "FURNITURE_ALIASES": 1723,
        "FURNITURE_DATA": 2547,
        "FURNITURE_FLOOR": 1778,
        "FURNITURE_FLOOR_ADD": 1534,
        "FURNITURE_FLOOR_REMOVE": 2703,
        "FURNITURE_FLOOR_UPDATE": 3776,
        "FURNITURE_ITEMDATA": 2202,
        "FURNITURE_STATE": 2376,
        "FURNITURE_GROUP_CONTEXT_MENU_INFO": 3293,
        "FURNITURE_POSTIT_STICKY_POLE_OPEN": 2366,
        "GAME_CENTER_ACHIEVEMENTS": 2265,
        "GAME_CENTER_GAME_LIST": 222,
        "GAME_CENTER_STATUS": 2893,
        "GAME_CENTER_IN_ARENA_QUEUE": 872,
        "GAME_CENTER_STOP_COUNTER": 3191,
        "GAME_CENTER_USER_LEFT_GAME": 3138,
        "GAME_CENTER_DIRECTORY_STATUS": 2246,
        "GAME_CENTER_STARTING_GAME_FAILED": 2142,
        "GAME_CENTER_JOINING_FAILED": 1730,
        "GAMESTATUSMESSAGE": 3805,
        "GAMEACHIEVEMENTS": 1689,
        "GAMEINVITE": 904,
        "JOININGQUEUEFAILED": 3035,
        "JOINEDQUEUEMESSAGE": 2260,
        "LEFTQUEUE": 1477,
        "LOAD_GAME_URL": 2624,
        "LOADGAME": 3654,
        "UNLOADGAME": 1715,
        "ACHIEVEMENTRESOLUTIONCOMPLETED": 740,
        "ACHIEVEMENTRESOLUTIONPROGRESS": 3370,
        "ACHIEVEMENTRESOLUTIONS": 66,
        "GENERIC_ALERT": 3801,
        "MODERATOR_MESSAGE": 2030,
        "GENERIC_ERROR": 1600,
        "GIFT_WRAPPER_CONFIG": 2234,
        "GROUP_BADGES": 2402,
        "GROUP_CREATE_OPTIONS": 2159,
        "GROUP_FORUM_DATA": 3011,
        "GROUP_FORUM_LIST": 3001,
        "GROUP_FORUM_THREADS": 1073,
        "GROUP_FORUM_POST": 2049,
        "GROUP_FORUM_POST_THREAD": 1862,
        "GROUP_FORUM_THREAD_MESSAGES": 509,
        "GROUP_FORUM_UNREAD_COUNT": 2379,
        "GROUP_FORUM_UPDATE_MESSAGE": 324,
        "GROUP_FORUM_UPDATE_THREAD": 2528,
        "GROUP_INFO": 1702,
        "GROUP_LIST": 420,
        "GROUP_MEMBER": 265,
        "GROUP_MEMBERS": 1200,
        "GROUP_MEMBERS_REFRESH": 2445,
        "GROUP_MEMBER_REMOVE_CONFIRM": 1876,
        "GROUP_PURCHASED": 2808,
        "GROUP_SETTINGS": 3965,
        "GROUP_BADGE_PARTS": 2238,
        "GROUP_MEMBERSHIP_REQUESTED": 1180,
        "GROUP_DETAILS_CHANGED": 1459,
        "GROUP_HABBO_JOIN_FAILED": 762,
        "GUILD_EDIT_FAILED": 3988,
        "GUILD_MEMBER_MGMT_FAILED": 818,
        "ITEM_DIMMER_SETTINGS": 2710,
        "ITEM_STACK_HELPER": 2816,
        "ITEM_WALL": 1369,
        "ITEM_WALL_ADD": 2187,
        "ITEM_WALL_REMOVE": 3208,
        "ITEM_WALL_UPDATE": 2009,
        "MARKETPLACE_CONFIG": 1823,
        "MESSENGER_ACCEPT_FRIENDS": 896,
        "MESSENGER_CHAT": 1587,
        "MESSENGER_FIND_FRIENDS": 1210,
        "MESSENGER_FOLLOW_FAILED": 3048,
        "MESSENGER_FRIEND_NOTIFICATION": 3082,
        "MESSENGER_FRIENDS": 3130,
        "MESSENGER_INIT": 1605,
        "MESSENGER_INSTANCE_MESSAGE_ERROR": 3359,
        "MESSENGER_INVITE": 3870,
        "MESSENGER_INVITE_ERROR": 462,
        "MESSENGER_MESSAGE_ERROR": 892,
        "MESSENGER_MINIMAIL_COUNT": 2803,
        "MESSENGER_MINIMAIL_NEW": 1911,
        "MESSENGER_RELATIONSHIPS": 2016,
        "MESSENGER_REQUEST": 2219,
        "MESSENGER_REQUEST_ERROR": 892,
        "MESSENGER_REQUESTS": 280,
        "MESSENGER_SEARCH": 973,
        "MESSENGER_UPDATE": 2800,
        "MODERATION_REPORT_DISABLED": 1651,
        "MODERATION_TOOL": 2696,
        "MODERATION_USER_INFO": 2866,
        "MOTD_MESSAGES": 2035,
        "NAVIGATOR_CATEGORIES": 1562,
        "NAVIGATOR_COLLAPSED": 1543,
        "NAVIGATOR_EVENT_CATEGORIES": 3244,
        "NAVIGATOR_LIFTED": 3104,
        "NAVIGATOR_METADATA": 3052,
        "NAVIGATOR_OPEN_ROOM_CREATOR": 2064,
        "NAVIGATOR_SEARCH": 2690,
        "NAVIGATOR_SEARCHES": 3984,
        "NAVIGATOR_SETTINGS": 518,
        "THUMBNAIL_UPDATE_RESULT": 1927,
        "CAN_CREATE_ROOM": 378,
        "CATEGORIES_WITH_VISITOR_COUNT": 1455,
        "COMPETITION_ROOMS_DATA": 3954,
        "CONVERTED_ROOM_ID": 1331,
        "GUEST_ROOM_SEARCH_RESULT": 52,
        "NOTIFICATION_LIST": 1992,
        "NOTIFICATION_OFFER_REWARD_DELIVERED": 2125,
        "NOTIFICATION_SIMPLE_ALERT": 5100,
        "NOTIFICATION_ELEMENT_POINTER": 1787,
        "PET_FIGURE_UPDATE": 1924,
        "PET_INFO": 2901,
        "PET_TRAINING_PANEL": 1164,
        "PET_LEVEL_UPDATE": 2824,
        "PET_SCRATCH_FAILED": 1130,
        "PET_OPEN_PACKAGE_REQUESTED": 2380,
        "PET_OPEN_PACKAGE_RESULT": 546,
        "PET_BREEDING": 1746,
        "PET_CONFIRM_BREEDING_RESULT": 1625,
        "PET_GO_TO_BREEDING_NEST_FAILURE": 2621,
        "PET_NEST_BREEDING_SUCCESS": 2527,
        "PET_CONFIRM_BREEDING_REQUEST": 634,
        "PET_BREEDING_RESULT": 1553,
        "RECYCLER_PRIZES": 3164,
        "RECYCLER_STATUS": 3433,
        "RECYCLER_FINISHED": 468,
        "ROOM_BAN_LIST": 1869,
        "ROOM_BAN_REMOVE": 3429,
        "ROOM_CREATED": 1304,
        "ROOM_DOORBELL": 2309,
        "ROOM_DOORBELL_ACCEPTED": 3783,
        "ROOM_DOORBELL_REJECTED": 878,
        "ROOM_ENTER": 758,
        "ROOM_ENTER_ERROR": 899,
        "ROOM_FORWARD": 160,
        "ROOM_HEIGHT_MAP": 2753,
        "ROOM_HEIGHT_MAP_UPDATE": 558,
        "ROOM_INFO": 687,
        "ROOM_INFO_OWNER": 749,
        "ROOM_MODEL": 1301,
        "ROOM_MODEL_BLOCKED_TILES": 3990,
        "ROOM_MODEL_DOOR": 1664,
        "ROOM_MODEL_NAME": 2031,
        "ROOM_MUTED": 2533,
        "ROOM_MUTE_USER": 826,
        "ROOM_PAINT": 2454,
        "ROOM_PROMOTION": 2274,
        "ROOM_QUEUE_STATUS": 2208,
        "ROOM_RIGHTS": 780,
        "ROOM_RIGHTS_CLEAR": 2392,
        "ROOM_RIGHTS_LIST": 1284,
        "ROOM_RIGHTS_LIST_ADD": 2088,
        "ROOM_RIGHTS_LIST_REMOVE": 1327,
        "ROOM_RIGHTS_OWNER": 339,
        "ROOM_ROLLING": 3207,
        "ROOM_SCORE": 482,
        "ROOM_SETTINGS": 1498,
        "ROOM_SETTINGS_CHAT": 1191,
        "ROOM_SETTINGS_SAVE": 948,
        "ROOM_SETTINGS_SAVE_ERROR": 1555,
        "ROOM_INFO_UPDATED": 3297,
        "ROOM_SPECTATOR": 1033,
        "ROOM_THICKNESS": 3547,
        "ROOM_GET_FILTER_WORDS": 2937,
        "ROOM_MESSAGE_NOTIFICATION": 1634,
        "ROOM_POPULAR_TAGS_RESULT": 2012,
        "INFO_FEED_ENABLE": 3284,
        "SECURITY_MACHINE": 1488,
        "MYSTERY_BOX_KEYS": 2833,
        "GOTMYSTERYBOXPRIZEMESSAGE": 3712,
        "CANCELMYSTERYBOXWAITMESSAGE": 596,
        "SHOWMYSTERYBOXWAITMESSAGE": 3201,
        "TRADE_ACCEPTED": 2568,
        "TRADE_CLOSED": 1373,
        "TRADE_COMPLETED": 1001,
        "TRADE_CONFIRMATION": 2720,
        "TRADE_LIST_ITEM": 2024,
        "TRADE_NOT_OPEN": 3128,
        "TRADE_OPEN": 2505,
        "TRADE_OPEN_FAILED": 217,
        "TRADE_OTHER_NOT_ALLOWED": 1254,
        "TRADE_YOU_NOT_ALLOWED": 3058,
        "TRADE_NO_SUCH_ITEM": 2873,
        "UNIT": 374,
        "UNIT_CHANGE_NAME": 2182,
        "UNIT_CHAT": 1446,
        "UNIT_CHAT_SHOUT": 1036,
        "UNIT_CHAT_WHISPER": 2704,
        "UNIT_DANCE": 2233,
        "UNIT_EFFECT": 1167,
        "UNIT_EXPRESSION": 1631,
        "UNIT_HAND_ITEM": 1474,
        "UNIT_IDLE": 1797,
        "UNIT_INFO": 3920,
        "UNIT_NUMBER": 2324,
        "UNIT_REMOVE": 2661,
        "UNIT_STATUS": 1640,
        "UNIT_TYPING": 1717,
        "UNSEEN_ITEMS": 2103,
        "USER_ACHIEVEMENT_SCORE": 1968,
        "USER_BADGES": 717,
        "USER_BADGES_ADD": 2493,
        "USER_BADGES_CURRENT": 1087,
        "USER_BOT_REMOVE": 233,
        "USER_BOTS": 3086,
        "USER_CHANGE_NAME": 118,
        "USER_CLOTHING": 1450,
        "USER_CREDITS": 3475,
        "USER_CURRENCY": 2018,
        "ACTIVITY_POINT_NOTIFICATION": 2275,
        "USER_EFFECTS": 340,
        "USER_FAVORITE_ROOM": 2524,
        "USER_FAVORITE_ROOM_COUNT": 151,
        "USER_FIGURE": 2429,
        "USER_FURNITURE": 994,
        "USER_FURNITURE_ADD": 104,
        "USER_FURNITURE_POSTIT_PLACED": 1501,
        "USER_FURNITURE_REFRESH": 3151,
        "USER_FURNITURE_REMOVE": 159,
        "USER_HOME_ROOM": 2875,
        "ROOM_EVENT_CANCEL": 3479,
        "ROOM_EVENT": 1840,
        "USER_IGNORED": 126,
        "USER_IGNORED_RESULT": 207,
        "USER_INFO": 2725,
        "USER_OUTFITS": 3315,
        "USER_PERKS": 2586,
        "USER_PERMISSIONS": 411,
        "USER_PET_ADD": 2101,
        "USER_PET_REMOVE": 3253,
        "USER_PETS": 3522,
        "USER_PROFILE": 3898,
        "USER_RESPECT": 2815,
        "USER_SANCTION_STATUS": 3679,
        "USER_SETTINGS": 513,
        "USER_SUBSCRIPTION": 954,
        "USER_WARDROBE_PAGE": 3315,
        "USER_CLASSIFICATION": 966,
        "GET_USER_TAGS": 1255,
        "WIRED_ACTION": 1434,
        "WIRED_CONDITION": 1108,
        "WIRED_ERROR": 156,
        "WIRED_OPEN": 1830,
        "WIRED_REWARD": 178,
        "WIRED_SAVE": 1155,
        "WIRED_TRIGGER": 383,
        "PLAYING_GAME": 448,
        "FURNITURE_STATE_2": 3431,
        "REMOVE_BOT_FROM_INVENTORY": 233,
        "ADD_BOT_TO_INVENTORY": 1352,
        "ACHIEVEMENT_PROGRESSED": 2107,
        "MODTOOL_ROOM_INFO": 1333,
        "MODTOOL_USER_CHATLOG": 3377,
        "MODTOOL_ROOM_CHATLOG": 3434,
        "MODTOOL_VISITED_ROOMS_USER": 1752,
        "MODERATOR_ACTION_RESULT": 2335,
        "ISSUE_DELETED": 3192,
        "ISSUE_INFO": 3609,
        "ISSUE_PICK_FAILED": 3150,
        "CFH_CHATLOG": 607,
        "MODERATOR_TOOL_PREFERENCES": 1576,
        "LOVELOCK_FURNI_START": 3753,
        "LOVELOCK_FURNI_FRIEND_COMFIRMED": 382,
        "LOVELOCK_FURNI_FINISHED": 770,
        "GIFT_RECEIVER_NOT_FOUND": 1517,
        "GIFT_OPENED": 56,
        "FLOOD_CONTROL": 566,
        "REMAINING_MUTE": 826,
        "USER_EFFECT_LIST": 340,
        "USER_EFFECT_LIST_ADD": 2867,
        "USER_EFFECT_LIST_REMOVE": 2228,
        "USER_EFFECT_ACTIVATE": 1959,
        "AVATAR_EFFECT_SELECTED": 3473,
        "CLUB_GIFT_INFO": 619,
        "REDEEM_VOUCHER_ERROR": 714,
        "REDEEM_VOUCHER_OK": 3336,
        "IN_CLIENT_LINK": 2023,
        "BOT_COMMAND_CONFIGURATION": 1618,
        "BOT_SKILL_LIST_UPDATE": 69,
        "BOT_FORCE_OPEN_CONTEXT_MENU": 296,
        "HAND_ITEM_RECEIVED": 354,
        "PET_PLACING_ERROR": 2913,
        "BOT_ERROR": 639,
        "MARKETPLACE_SELL_ITEM": 54,
        "MARKETPLACE_ITEM_STATS": 725,
        "MARKETPLACE_OWN_ITEMS": 3884,
        "MARKETPLACE_CANCEL_SALE": 3264,
        "MARKETPLACE_ITEM_POSTED": 1359,
        "MARKETPLACE_ITEMS_SEARCHED": 680,
        "MARKETPLACE_AFTER_ORDER_STATUS": 2032,
        "CATALOG_RECEIVE_PET_BREEDS": 3331,
        "CATALOG_APPROVE_NAME_RESULT": 1503,
        "OBJECTS_DATA_UPDATE": 1453,
        "PET_EXPERIENCE": 2156,
        "COMMUNITY_GOAL_VOTE_EVENT": 1435,
        "PROMO_ARTICLES": 286,
        "COMMUNITY_GOAL_EARNED_PRIZES": 3319,
        "COMMUNITY_GOAL_PROGRESS": 2525,
        "CONCURRENT_USERS_GOAL_PROGRESS": 2737,
        "QUEST_DAILY": 1878,
        "QUEST_CANCELLED": 3027,
        "QUEST_COMPLETED": 949,
        "COMMUNITY_GOAL_HALL_OF_FAME": 3005,
        "EPIC_POPUP": 3945,
        "SEASONAL_QUESTS": 1122,
        "QUESTS": 3625,
        "QUEST": 230,
        "BONUS_RARE_INFO": 1533,
        "CRAFTABLE_PRODUCTS": 1000,
        "CRAFTING_RECIPE": 2774,
        "CRAFTING_RECIPES_AVAILABLE": 2124,
        "CRAFTING_RESULT": 618,
        "CAMERA_PUBLISH_STATUS": 2057,
        "CAMERA_PURCHASE_OK": 2783,
        "CAMERA_STORAGE_URL": 3696,
        "CAMERA_SNAPSHOT": 463,
        "COMPETITION_STATUS": 133,
        "INIT_CAMERA": 3878,
        "THUMBNAIL_STATUS": 3595,
        "ACHIEVEMENT_NOTIFICATION": 806,
        "CLUB_GIFT_NOTIFICATION": 2188,
        "INTERSTITIAL_MESSAGE": 1808,
        "ROOM_AD_ERROR": 1759,
        "AVAILABILITY_TIME": 600,
        "HOTEL_CLOSED_AND_OPENS": 3728,
        "HOTEL_CLOSES_AND_OPENS_AT": 2771,
        "HOTEL_WILL_CLOSE_MINUTES": 1050,
        "HOTEL_MAINTENANCE": 1350,
        "JUKEBOX_PLAYLIST_FULL": 105,
        "JUKEBOX_SONG_DISKS": 34,
        "NOW_PLAYING": 469,
        "OFFICIAL_SONG_ID": 1381,
        "PLAYLIST": 1748,
        "PLAYLIST_SONG_ADDED": 1140,
        "TRAX_SONG_INFO": 3365,
        "USER_SONG_DISKS_INVENTORY": 2602,
        "CHECK_USER_NAME": 563,
        "CFH_SANCTION": 2782,
        "CFH_TOPICS": 325,
        "CFH_SANCTION_STATUS": 2221,
        "CAMPAIGN_CALENDAR_DATA": 2531,
        "CAMPAIGN_CALENDAR_DOOR_OPENED": 2551,
        "BUILDERS_CLUB_FURNI_COUNT": 3828,
        "BUILDERS_CLUB_SUBSCRIPTION": 1452,
        "CATALOG_PAGE_EXPIRATION": 2668,
        "CATALOG_EARLIEST_EXPIRY": 2515,
        "CLUB_GIFT_SELECTED": 659,
        "TARGET_OFFER_NOT_FOUND": 1237,
        "TARGET_OFFER": 119,
        "DIRECT_SMS_CLUB_BUY": 195,
        "ROOM_AD_PURCHASE": 2468,
        "NOT_ENOUGH_BALANCE": 3914,
        "LIMITED_OFFER_APPEARING_NEXT": 44,
        "IS_OFFER_GIFTABLE": 761,
        "CLUB_EXTENDED_OFFER": 3964,
        "SEASONAL_CALENDAR_OFFER": 1889,
        "COMPETITION_ENTRY_SUBMIT": 1177,
        "COMPETITION_VOTING_INFO": 3506,
        "COMPETITION_TIMING_CODE": 1745,
        "COMPETITION_USER_PART_OF": 3841,
        "COMPETITION_NO_OWNED_ROOMS": 2064,
        "COMPETITION_SECONDS_UNTIL": 3926,
        "BADGE_POINT_LIMITS": 2501,
        "BADGE_REQUEST_FULFILLED": 2998,
        "HELPER_TALENT_TRACK": 3406,
        "TALENT_TRACK_LEVEL": 1203,
        "TALENT_TRACK_LEVEL_UP": 638,
        "USER_BANNED": 1683,
        "BOT_RECEIVED": 3684,
        "PET_LEVEL_NOTIFICATION": 859,
        "PET_RECEIVED": 1111,
        "MODERATION_CAUTION": 1890,
        "YOUTUBE_CONTROL_VIDEO": 1554,
        "YOUTUBE_DISPLAY_PLAYLISTS": 1112,
        "YOUTUBE_DISPLAY_VIDEO": 1411,
        "CFH_DISABLED_NOTIFY": 1651,
        "QUESTION": 2665,
        "POLL_CONTENTS": 2997,
        "POLL_ERROR": 662,
        "POLL_OFFER": 3785,
        "POLL_START_ROOM": 5200,
        "QUESTION_ANSWERED": 2589,
        "QUESTION_FINISHED": 1066,
        "CFH_PENDING_CALLS": 1121,
        "GUIDE_ON_DUTY_STATUS": 1548,
        "GUIDE_SESSION_ATTACHED": 1591,
        "GUIDE_SESSION_DETACHED": 138,
        "GUIDE_SESSION_ENDED": 1456,
        "GUIDE_SESSION_ERROR": 673,
        "GUIDE_SESSION_INVITED_TO_GUIDE_ROOM": 219,
        "GUIDE_SESSION_MESSAGE": 841,
        "GUIDE_SESSION_PARTNER_IS_TYPING": 1016,
        "GUIDE_SESSION_REQUESTER_ROOM": 1847,
        "GUIDE_SESSION_STARTED": 3209,
        "GUIDE_TICKET_CREATION_RESULT": 3285,
        "GUIDE_TICKET_RESOLUTION": 2674,
        "GUIDE_REPORTING_STATUS": 3463,
        "HOTEL_MERGE_NAME_CHANGE": 1663,
        "ISSUE_CLOSE_NOTIFICATION": 934,
        "QUIZ_DATA": 2927,
        "QUIZ_RESULTS": 2772,
        "CFH_PENDING_CALLS_DELETED": 77,
        "CFH_REPLY": 3796,
        "CHAT_REVIEW_SESSION_DETACHED": 30,
        "CHAT_REVIEW_SESSION_OFFERED_TO_GUIDE": 735,
        "CHAT_REVIEW_SESSION_RESULTS": 3276,
        "CHAT_REVIEW_SESSION_STARTED": 143,
        "CHAT_REVIEW_SESSION_VOTING_STATUS": 1829,
        "SCR_SEND_KICKBACK_INFO": 3277,
        "PET_STATUS": 1907,
        "GROUP_DEACTIVATE": 3129,
        "PET_RESPECTED": 2788,
        "PET_SUPPLEMENT": 3441,
        "NOOBNESS_LEVEL": 3738,
        "DISCONNECT_REASON": 4000,
        "CAN_CREATE_ROOM_EVENT": 2599,
        "FAVORITE_GROUP_UDPATE": 3403,
        "NO_SUCH_FLAT": 84,
        "ROOM_SETTINGS_ERROR": 2897,
        "SHOW_ENFORCE_ROOM_CATEGORY": 3896,
        "CUSTOM_USER_NOTIFICATION": 909,
        "NEW_USER_EXPERIENCE_GIFT_OFFER": 3575,
        "RESTORE_CLIENT": 426,
        "FIREWORK_CHARGE_DATA": 5210,
        "NEW_USER_EXPERIENCE_NOT_COMPLETE": 3639,
        "CONNECTION_ERROR": 1004,
        "ACCOUNT_SAFETY_LOCK_STATUS_CHANGE": 1243,
        "PHONE_COLLECTION_STATE": 2890,
        "PHONE_TRY_NUMBER_RESULT": 800,
        "PHONE_TRY_VERIFICATION_CODE_RESULT": 91,
        "EXTENDED_PROFILE_CHANGED": 876,
        "WELCOME_GIFT_CHANGE_EMAIL_RESULT": 2293,
        "WELCOME_GIFT_STATUS": 2707,
        "HANDSHAKE_INIT_DIFFIE": 1347,
        "HANDSHAKE_COMPLETE_DIFFIE": 3885,
        "RENTABLE_SPACE_RENT_OK": 2046,
        "RENTABLE_SPACE_STATUS": 3559,
        "RENTABLE_SPACE_RENT_FAILED": 1868,
        "EMAIL_STATUS": 612,
        "CHANGE_EMAIL_RESULT": 1815,
        "WEEKLY_GAME_REWARD": 2641,
        "WEEKLY_GAME_REWARD_WINNERS": 3097,
        "WEEKLY_COMPETITIVE_LEADERBOARD": 3512,
        "WEEKLY_COMPETITIVE_FRIENDS_LEADERBOARD": 3560,
        "WEEKLY_GAME2_FRIENDS_LEADERBOARD": 2270,
        "WEEKLY_GAME2_LEADERBOARD": 2196,
        "RENTABLE_FURNI_RENT_OR_BUYOUT_OFFER": 35,
        "HANDSHAKE_IDENTITY_ACCOUNT": 3523
      }
    },

    types: {
        String: (v) => ({ type: 'String', value: String(v) }),
        Int: (v) => ({ type: 'Int', value: parseInt(v) || 0 }),
        Short: (v) => ({ type: 'Short', value: parseInt(v) || 0 }),
        Byte: (v) => ({ type: 'Byte', value: parseInt(v) || 0 }),
        Boolean: (v) => ({ type: 'Byte', value: v ? 1 : 0 })
    },

    async init() {
      log.debug('PacketManager.init()');
      this.loggingEnabled = !!config.get('packetLoggingEnabled');
      this.loadMacros();
      this.loadIgnoredHeaders();
      this.hijackWebSocket(window);
      
      // Also watch for iframes
      DOM.onNitroIframeDocReady((iframeDoc) => {
        const win = iframeDoc.defaultView;
        if (win) this.hijackWebSocket(win);
      });
    },

    loadMacros() {
      try {
        const saved = config.get('packetMacros');
        this.macros = saved ? JSON.parse(saved) : [];
        log.debug('PacketManager: Loaded', this.macros.length, 'macros');
      } catch (e) {
        log.error('PacketManager: Failed to load macros', e);
        this.macros = [];
      }
    },

    saveMacros() {
      try {
        config.set('packetMacros', JSON.stringify(this.macros));
        log.debug('PacketManager: Saved', this.macros.length, 'macros');
      } catch (e) {
        log.error('PacketManager: Failed to save macros', e);
      }
    },

    loadIgnoredHeaders() {
      try {
        const savedOut = config.get('ignoredOutgoingHeaders');
        const savedIn = config.get('ignoredIncomingHeaders');
        this.ignoredOutgoingHeaders = new Set(savedOut ? JSON.parse(savedOut) : []);
        this.ignoredIncomingHeaders = new Set(savedIn ? JSON.parse(savedIn) : []);
        log.debug('PacketManager: Loaded ignored headers - OUT:', this.ignoredOutgoingHeaders.size, 'IN:', this.ignoredIncomingHeaders.size);
      } catch (e) {
        log.error('PacketManager: Failed to load ignored headers', e);
        this.ignoredOutgoingHeaders = new Set();
        this.ignoredIncomingHeaders = new Set();
      }
    },

    saveIgnoredHeaders() {
      try {
        config.set('ignoredOutgoingHeaders', JSON.stringify([...this.ignoredOutgoingHeaders]));
        config.set('ignoredIncomingHeaders', JSON.stringify([...this.ignoredIncomingHeaders]));
        log.debug('PacketManager: Saved ignored headers');
      } catch (e) {
        log.error('PacketManager: Failed to save ignored headers', e);
      }
    },

    addIgnoredHeader(direction, headerId) {
      const set = direction === 'OUT' ? this.ignoredOutgoingHeaders : this.ignoredIncomingHeaders;
      set.add(headerId);
      this.saveIgnoredHeaders();
    },

    removeIgnoredHeader(direction, headerId) {
      const set = direction === 'OUT' ? this.ignoredOutgoingHeaders : this.ignoredIncomingHeaders;
      set.delete(headerId);
      this.saveIgnoredHeaders();
    },

    clearIgnoredHeaders(direction) {
      if (direction === 'OUT') {
        this.ignoredOutgoingHeaders.clear();
      } else {
        this.ignoredIncomingHeaders.clear();
      }
      this.saveIgnoredHeaders();
    },

    addMacro(macro) {
      macro.id = Date.now() + Math.random();
      macro.enabled = true;
      this.macros.push(macro);
      this.saveMacros();
      return macro;
    },

    updateMacro(id, updates) {
      const idx = this.macros.findIndex(m => m.id === id);
      if (idx !== -1) {
        this.macros[idx] = { ...this.macros[idx], ...updates };
        this.saveMacros();
      }
    },

    deleteMacro(id) {
      this.macros = this.macros.filter(m => m.id !== id);
      this.saveMacros();
    },

    toggleMacro(id) {
      const macro = this.macros.find(m => m.id === id);
      if (macro) {
        macro.enabled = !macro.enabled;
        this.saveMacros();
      }
    },

    hijackWebSocket(win) {
      if (!win || win.__kuplafix_ws_hijacked) return;
      win.__kuplafix_ws_hijacked = true;
      
      log.info('PacketManager: Hijacking WebSocket on', win === window ? 'top window' : 'iframe');

      const self = this;
      const OriginalWebSocket = win.WebSocket;
      
      // Hook prototype send to catch all sends
      const originalProtoSend = OriginalWebSocket.prototype.send;
      OriginalWebSocket.prototype.send = function(data) {
        if (this.url && this.url.includes('hanarchy.net')) {
             self.logPacket('OUT', data);
        }
        return originalProtoSend.call(this, data);
      };

      // Define the proxy class
      const WebSocketProxy = function(url, protocols) {
        // Only log if it looks interesting to avoid spam
        if (url.includes('hanarchy.net')) {
            log.info('PacketManager: new WebSocket called with', url);
        }
        
        const ws = new OriginalWebSocket(url, protocols);
        
        // Check if this is the game connection (Targeting hanarchy.net as requested)
        // NOTE: We filter for hanarchy.net to avoid hijacking the secondary 'nitro.kuplahotelli.com' socket
        // which is not the main game server.
        if (url.includes('hanarchy.net')) {
          log.info('PacketManager: Captured WebSocket connection to', url);
          self.socket = ws;
          window.kuplaSocket = ws;
          
          // Hook incoming
          ws.addEventListener('message', (event) => {
            self.logPacket('IN', event.data);
          });
        }
        
        return ws;
      };

      // Copy prototype and constants
      WebSocketProxy.prototype = OriginalWebSocket.prototype;
      WebSocketProxy.CONNECTING = OriginalWebSocket.CONNECTING;
      WebSocketProxy.OPEN = OriginalWebSocket.OPEN;
      WebSocketProxy.CLOSING = OriginalWebSocket.CLOSING;
      WebSocketProxy.CLOSED = OriginalWebSocket.CLOSED;

      // Apply the hijack
      try {
        win.WebSocket = WebSocketProxy;
      } catch (e) {
        log.error('PacketManager: Failed to assign WebSocket proxy', e);
      }
    },

    hookSocket(ws) {
       // Deprecated: We now hook prototype. 
       // Kept for compatibility if needed, but empty now.
    },

    logPacket(direction, data) {
      try {
        let buffer;
        const type = Object.prototype.toString.call(data);
        
        // Handle different data types
        if (data instanceof ArrayBuffer || type === '[object ArrayBuffer]') {
          buffer = data;
        } else if (ArrayBuffer.isView(data) || (data && data.buffer && (data.buffer instanceof ArrayBuffer || Object.prototype.toString.call(data.buffer) === '[object ArrayBuffer]'))) {
          // TypedArray (Uint8Array, etc.) - Handle views correctly
          // If it has a buffer property that is an ArrayBuffer, treat it as a view
          buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        } else if (data instanceof Blob || type === '[object Blob]') {
          // Blob is async - handle cross-frame Blob detection too
          const reader = new FileReader();
          reader.onload = () => {
              this.processBuffer(direction, reader.result);
          };
          reader.readAsArrayBuffer(data);
          return;
        } else {
          // Unknown or string
          // console.log('[PacketManager] Unknown data type:', type, data);
          return;
        }

        if (buffer) {
            this.processBuffer(direction, buffer);
        }
      } catch (e) {
        console.error('Error logging packet', e);
      }
    },

    processBuffer(direction, buffer) {
        if (buffer.byteLength >= 6) {
          const view = new DataView(buffer);
          const length = view.getInt32(0); // Big Endian
          const header = view.getInt16(4); // Big Endian
          
          // Check for shared macros in furniture packets (trophies)
          if (direction === 'IN') {
            this.checkForSharedMacro(header, buffer);
          }
          
          // Check macros
          this.checkMacros(direction, header, buffer);
          
          // Add to history
          this.addToHistory(direction, header, length, buffer);

          if (this.loggingEnabled) {
            // Find header name
            let headerName = 'Unknown';
            const headerMap = direction === 'OUT' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
            for (const [name, id] of Object.entries(headerMap)) {
                if (id === header) {
                    headerName = name;
                    break;
                }
            }

            console.log(`%c[PacketManager] ${direction} [${header}] ${headerName} Len:${length}`, 
              direction === 'OUT' ? 'color: #00aa00' : 'color: #00aaaa');
              
            // Hex dump for analysis
            const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(' ');
            console.log(`%c[PacketManager] ${direction} HEX: ${hex}`, 'color: #888');
          }
        }
    },

    checkMacros(direction, header, buffer) {
        const dir = direction === 'OUT' ? 'send' : 'receive';
        
        for (const macro of this.macros) {
            if (!macro.enabled) continue;
            if (macro.trigger.direction !== dir) continue;
            if (macro.trigger.header !== header) continue;
            
            // Prevent infinite loops
            const macroKey = `${macro.id}-${Date.now()}`;
            if (this.macroExecuting.has(macro.id)) continue;
            
            // Parse packet arguments for condition checking and variable substitution
            const parsedArgs = this.parsePacket(buffer);
            
            // Check conditions
            let conditionsMet = true;
            if (macro.trigger.conditions && macro.trigger.conditions.length > 0) {
                for (const cond of macro.trigger.conditions) {
                    const argIndex = parseInt(cond.argIndex);
                    if (argIndex >= 0 && argIndex < parsedArgs.length) {
                        const argValue = parsedArgs[argIndex].value;
                        const condValue = cond.value;
                        
                        switch (cond.operator) {
                            case 'eq':
                                conditionsMet = conditionsMet && (String(argValue) === String(condValue));
                                break;
                            case 'neq':
                                conditionsMet = conditionsMet && (String(argValue) !== String(condValue));
                                break;
                            case 'gt':
                                conditionsMet = conditionsMet && (Number(argValue) > Number(condValue));
                                break;
                            case 'gte':
                                conditionsMet = conditionsMet && (Number(argValue) >= Number(condValue));
                                break;
                            case 'lt':
                                conditionsMet = conditionsMet && (Number(argValue) < Number(condValue));
                                break;
                            case 'lte':
                                conditionsMet = conditionsMet && (Number(argValue) <= Number(condValue));
                                break;
                            case 'contains':
                                conditionsMet = conditionsMet && String(argValue).includes(String(condValue));
                                break;
                        }
                    } else {
                        conditionsMet = false;
                    }
                    if (!conditionsMet) break;
                }
            }
            
            if (!conditionsMet) continue;
            
            // Execute macro actions
            this.macroExecuting.add(macro.id);
            this.executeMacro(macro, parsedArgs);
            
            // Remove from executing set after a delay
            setTimeout(() => this.macroExecuting.delete(macro.id), 100);
        }
    },

    executeMacro(macro, triggerArgs) {
        log.debug('PacketManager: Executing macro', macro.name);
        
        // Execute each action in sequence
        const executeActions = async (actionIndex = 0) => {
            if (actionIndex >= macro.actions.length) return;
            
            const action = macro.actions[actionIndex];
            
            // Variable substitution: replace {{arg0}}, {{arg1}}, etc. with trigger packet args
            const substituteVars = (value) => {
                if (typeof value !== 'string') return value;
                return value.replace(/\{\{arg(\d+)\}\}/g, (match, idx) => {
                    const i = parseInt(idx);
                    if (i >= 0 && i < triggerArgs.length) {
                        return String(triggerArgs[i].value);
                    }
                    return match;
                });
            };
            
            if (action.type === 'send') {
                // Send a packet
                const args = action.args.map(arg => ({
                    type: arg.type,
                    value: substituteVars(arg.value)
                }));
                
                this.send(action.header, ...args.map(a => this.types[a.type](a.value)));
                
                // Show toast if configured
                if (action.showToast && action.toastMessage) {
                    UI.showToast(substituteVars(action.toastMessage), 'info');
                }
                
            } else if (action.type === 'inject') {
                // Inject an incoming packet (simulate server message)
                const args = action.args.map(arg => ({
                    type: arg.type,
                    value: substituteVars(arg.value)
                }));
                
                this.inject(action.header, ...args.map(a => this.types[a.type](a.value)));
                
                if (action.showToast && action.toastMessage) {
                    UI.showToast(substituteVars(action.toastMessage), 'info');
                }
                
            } else if (action.type === 'toast') {
                // Just show a toast
                UI.showToast(substituteVars(action.toastMessage), action.toastType || 'info');
                
            } else if (action.type === 'delay') {
                // Wait before next action
                await new Promise(resolve => setTimeout(resolve, parseInt(action.delay) || 100));
            }
            
            // Continue to next action
            executeActions(actionIndex + 1);
        };
        
        executeActions();
    },
    
    checkForSharedMacro(header, buffer) {
        // Check furniture update/add packets for shared macros (trophies)
        // 3776 = FURNITURE_FLOOR_UPDATE, 1534 = FURNITURE_FLOOR_ADD
        // Note: Chat messages are handled by ChatCache.checkForSharedMacro() via DOM observer
        if (header !== 3776 && header !== 1534) return;
        
        try {
            // Convert buffer to string and look for KFM2: marker
            const bytes = new Uint8Array(buffer);
            const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
            
            // Find KFM2: marker
            const kfmIndex = text.indexOf('KFM2:');
            if (kfmIndex === -1) return;
            
            // Extract the base64 code after KFM2:
            // It ends at next tab, newline, or non-base64 char
            let code = '';
            for (let i = kfmIndex + 5; i < text.length; i++) {
                const c = text[i];
                // Base64 chars + padding
                if (/[A-Za-z0-9+/=]/.test(c)) {
                    code += c;
                } else {
                    break;
                }
            }
            
            if (code.length < 10) return; // Too short to be valid
            
            const fullCode = 'KFM2:' + code;
            
            // Try to decode the macro
            const macro = PacketBuilder.decodeMacro(fullCode);
            if (!macro) {
                log.debug('PacketManager: Found KFM2 code but failed to decode');
                return;
            }
            
            // Try to extract sharer name
            let sharerName = 'Someone';
            
            // For chat messages (1446), we can't easily get the sender name from the packet
            // For trophies, the format is: username\tdate\ttext (within a length-prefixed string)
            if (header === 3776 || header === 1534) {
                // Find KFM2: and work backwards to extract the username
                // The trophy text format is: "username\tdate\tKFM2:..."
                const kfmPos = text.indexOf('KFM2:');
                if (kfmPos > 0) {
                    // Find the two tabs before KFM2:
                    let tab1 = -1, tab2 = -1;
                    for (let i = kfmPos - 1; i >= 0; i--) {
                        if (text.charCodeAt(i) === 9) { // tab
                            if (tab2 === -1) tab2 = i;
                            else { tab1 = i; break; }
                        }
                    }
                    
                    // Extract date between tabs to validate structure
                    if (tab1 >= 0 && tab2 > tab1) {
                        const datePart = text.substring(tab1 + 1, tab2);
                        // Date should look like "8-1-2026" or similar
                        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(datePart)) {
                            // Now find username - scan backwards from tab1
                            // The tricky part: the trophy text is preceded by a 2-byte length prefix
                            // which might include a byte that looks like a valid ASCII letter
                            let nameEnd = tab1;
                            let nameStart = tab1;
                            for (let i = tab1 - 1; i >= Math.max(0, tab1 - 25); i--) {
                                const c = text.charCodeAt(i);
                                // Check if PREVIOUS char (i-1) is a null byte - if so, we've hit the length prefix
                                if (i > 0 && text.charCodeAt(i - 1) === 0) {
                                    // Don't include this char - it's part of the length prefix
                                    break;
                                }
                                // Stop at null byte (0x00) directly
                                if (c === 0) {
                                    break;
                                }
                                // Valid username chars: alphanumeric, underscore, hyphen
                                if ((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 45) {
                                    nameStart = i;
                                } else {
                                    // Hit a non-username char, stop
                                    break;
                                }
                            }
                            
                            if (nameStart < nameEnd) {
                                const extractedName = text.substring(nameStart, nameEnd);
                                if (extractedName.length >= 2 && extractedName.length <= 20) {
                                    sharerName = extractedName;
                                }
                            }
                        }
                    }
                }
            }
            
            const source = 'trophy';
            log.info(`PacketManager: Found shared macro "${macro.name}" from ${sharerName} via ${source}`);
            
            // Show persistent notification with import option
            this.showMacroShareNotification(macro, fullCode, sharerName);
            
        } catch (e) {
            log.warn('PacketManager: Error checking for shared macro:', e);
        }
    },
    
    // Track active macro notifications to prevent duplicates (Set of cloneIds)
    activeMacroNotificationIds: new Set(),
    
    showMacroShareNotification(macro, code, sharerName) {
        // Check if user has opted in to accept all macros
        const acceptAll = config.get('acceptAllMacroNotifications') || false;
        
        // Check if this exact code is already being displayed
        const alreadyVisible = window.kupla_pendingMacroImports?.some(p => 
            p.code === code && this.activeMacroNotificationIds.has(p.cloneId)
        );
        if (alreadyVisible) {
            log.debug('PacketManager: Macro notification for this code already visible');
            return;
        }
        
        // Safety filter: only show macros from "0es" by default
        if (!acceptAll && sharerName !== '0es') {
            log.debug('PacketManager: Ignoring macro from', sharerName, '(not from 0es and acceptAll is disabled)');
            return;
        }
        
        // If there's already an active macro notification and user hasn't opted in, skip
        if (!acceptAll && this.activeMacroNotificationIds.size > 0) {
            log.debug('PacketManager: Macro notification already visible, skipping');
            return;
        }
        
        // Ensure clone container is ready
        if (typeof BubbleAlerts !== 'undefined' && BubbleAlerts.ensureCloneContainer) {
            BubbleAlerts.ensureCloneContainer();
        }
        
        // Use BubbleAlerts if available, otherwise create custom notification
        if (typeof BubbleAlerts !== 'undefined' && BubbleAlerts.cloneContainer) {
            // Get a clone ID from BubbleAlerts to properly integrate with the system
            const cloneId = ++BubbleAlerts.cloneIdCounter;
            const self = this;
            
            // Store the macro data for later import
            if (!window.kupla_pendingMacroImports) window.kupla_pendingMacroImports = [];
            const pendingImport = { macro, code, sharerName, timestamp: Date.now(), cloneId };
            window.kupla_pendingMacroImports.push(pendingImport);
            
            // Track this as an active macro notification
            this.activeMacroNotificationIds.add(cloneId);
            
            // Helper to remove the alert using BubbleAlerts system
            const removeAlert = () => {
                BubbleAlerts.removeClone(cloneId);
                // Remove from active notification tracker
                self.activeMacroNotificationIds.delete(cloneId);
                // Remove from pending imports
                const idx = window.kupla_pendingMacroImports?.findIndex(p => p.cloneId === cloneId);
                if (idx >= 0) window.kupla_pendingMacroImports.splice(idx, 1);
            };
            
            // Create wrapper matching native clone structure
            const wrapper = document.createElement('div');
            wrapper.className = 'animate__animated';
            wrapper.style.cssText = 'display: block;';
            
            // Create alert matching native notification structure exactly
            const alert = document.createElement('div');
            alert.className = 'd-flex overflow-hidden gap-2 align-items-center nitro-notification-bubble rounded';
            // Mark as a BubbleAlerts clone so it's properly tracked
            alert.dataset.kuplafixClone = 'true';
            alert.dataset.cloneId = cloneId;
            alert.style.pointerEvents = 'auto';
            alert.style.cursor = 'pointer';
            alert.style.visibility = 'visible';
            alert.style.display = 'flex';
            
            // Icon area - use gift.gif like native gift notifications
            const iconDiv = document.createElement('div');
            iconDiv.className = 'd-flex align-items-center justify-content-center bubble-image-container';
            const iconImg = document.createElement('img');
            iconImg.className = 'no-select';
            iconImg.src = 'https://images.habbo.com/c_images/stickers/sticker_walkingMechaDog.gif';
            iconImg.alt = '';
            iconImg.onerror = () => { iconImg.style.display = 'none'; iconDiv.textContent = '🎁'; };
            iconDiv.appendChild(iconImg);
            alert.appendChild(iconDiv);
            
            // Content area - matching native structure
            const contentDiv = document.createElement('div');
            contentDiv.className = 'd-inline text-white nitro-small-size-text text-wrap';
            
            const textSpan = document.createElement('span');
            textSpan.innerHTML = `<b>${sharerName}</b> jakoi makron:<br><b>${macro.name}</b>`;
            contentDiv.appendChild(textSpan);
            
            alert.appendChild(contentDiv);
            
            // Import button - matching event notification style
            const importBtn = document.createElement('button');
            importBtn.className = 'kuplafix-event-notification-button';
            importBtn.textContent = 'Lisää';
            importBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Import the macro
                self.importSharedMacro(macro, code);
                // Open Packet Builder to Macros tab
                if (typeof PacketBuilder !== 'undefined') {
                    PacketBuilder.activeTab = 'macros';
                    if (!PacketBuilder.isOpen) {
                        PacketBuilder.toggle();
                    } else {
                        PacketBuilder.renderContent();
                    }
                }
                removeAlert();
            });
            alert.appendChild(importBtn);
            
            wrapper.appendChild(alert);
            
            // Click handler - dismiss on click, but not when clicking button
            const clickHandler = (e) => {
                // Don't dismiss if clicking the import button
                if (e.target.closest('.kuplafix-event-notification-button')) return;
                
                if (e.shiftKey) {
                    BubbleAlerts.removeAllClones();
                } else {
                    removeAlert();
                }
            };
            alert.addEventListener('click', clickHandler);
            
            // Register with BubbleAlerts clone system so removeAllClones works
            BubbleAlerts.clonedNotifications.set(cloneId, {
                clone: wrapper,
                originalWrapper: null,
                clickHandler: clickHandler,
                contentHash: 'macro-share-' + Date.now()
            });
            
            // Add to container
            BubbleAlerts.cloneContainer.appendChild(wrapper);
            
            // No auto-dismiss - persist like other notifications until clicked
        } else {
            // Fallback: use toast with manual import
            UI.showToast(`🎁 ${sharerName} shared macro "${macro.name}" - Open Packet Builder > Macros to import`, 'success');
            
            // Store pending import for manual access
            if (!window.kupla_pendingMacroImports) window.kupla_pendingMacroImports = [];
            window.kupla_pendingMacroImports.push({ macro, code, sharerName, timestamp: Date.now() });
        }
    },
    
    importSharedMacro(macro, code) {
        // Check if macro with same name exists, add number suffix if needed
        let baseName = macro.name;
        let counter = 1;
        while (this.macros.find(m => m.name === macro.name)) {
            macro.name = `${baseName} ${counter}`;
            counter++;
        }
        
        // Add to macros
        this.macros.push(macro);
        this.saveMacros();
        
        UI.showToast(`✅ Imported macro "${macro.name}"`, 'success');
        
        // Refresh macros tab if open
        if (PacketBuilder.isOpen && PacketBuilder.activeTab === 'macros') {
            PacketBuilder.renderContent();
        }
    },
    
    addToHistory(direction, header, length, buffer) {
        // Only log if builder is open and not on macros tab
        if (!PacketBuilder.isOpen) return;
        if (PacketBuilder.activeTab === 'macros') return;

        // Check if header is ignored
        const ignoredSet = direction === 'OUT' ? this.ignoredOutgoingHeaders : this.ignoredIncomingHeaders;
        if (ignoredSet.has(header)) return;

        const packet = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            direction,
            header,
            length,
            buffer: buffer, // Store buffer for parsing
            hex: Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(' ')
        };
        
        const targetHistory = direction === 'OUT' ? this.outgoingHistory : this.incomingHistory;
        targetHistory.push(packet);
        if (targetHistory.length > this.maxHistory) {
            targetHistory.shift();
        }
        
        // Update UI if open and on the correct tab
        if (PacketBuilder.isOpen) {
            if (direction === 'OUT' && PacketBuilder.activeTab === 'history') {
                PacketBuilder.appendLog(packet);
            } else if (direction === 'IN' && PacketBuilder.activeTab === 'incoming') {
                PacketBuilder.appendIncomingLog(packet);
            }
        }
    },

    clearHistory() {
        this.outgoingHistory = [];
        if (PacketBuilder.isOpen && PacketBuilder.activeTab === 'history') {
            PacketBuilder.renderContent();
        }
    },

    clearIncomingHistory() {
        this.incomingHistory = [];
        if (PacketBuilder.isOpen && PacketBuilder.activeTab === 'incoming') {
            PacketBuilder.renderContent();
        }
    },

    // Improved Parser for Import
    parsePacket(buffer) {
        const args = [];
        if (buffer.byteLength < 6) return args;
        
        const view = new DataView(buffer);
        const payloadLen = buffer.byteLength - 6;
        let offset = 6;

        const getHex = (start, len) => {
            return Array.from(new Uint8Array(buffer, start, len))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
        };

        // Heuristic 1: If payload is a multiple of 4 and small (like UNIT_LOOK), 
        // it's almost certainly a sequence of Ints.
        if (payloadLen > 0 && payloadLen % 4 === 0 && payloadLen <= 32) {
            for (let i = 0; i < payloadLen; i += 4) {
                args.push({ 
                    type: 'Int', 
                    value: view.getInt32(offset + i),
                    hex: getHex(offset + i, 4)
                });
            }
            return args;
        }
        
        while (offset < buffer.byteLength) {
            const remaining = buffer.byteLength - offset;
            
            // 1. Try String (Heuristic: length > 0 and printable)
            if (remaining >= 2) {
                const strLen = view.getInt16(offset);
                if (strLen > 0 && strLen <= remaining - 2 && strLen < 2048) {
                    const strBytes = new Uint8Array(buffer, offset + 2, strLen);
                    let printable = true;
                    for (let i = 0; i < strLen; i++) {
                        const c = strBytes[i];
                        if (c < 32 && ![9, 10, 13].includes(c)) {
                            printable = false;
                            break;
                        }
                    }
                    if (printable) {
                        try {
                            const str = new TextDecoder().decode(strBytes);
                            args.push({ 
                                type: 'String', 
                                value: str,
                                hex: getHex(offset, 2 + strLen)
                            });
                            offset += 2 + strLen;
                            continue;
                        } catch (e) {}
                    }
                } else if (strLen === 0 && remaining === 2) {
                    // Empty string at the very end
                    args.push({ 
                        type: 'String', 
                        value: '',
                        hex: getHex(offset, 2)
                    });
                    offset += 2;
                    continue;
                }
            }
            
            // 2. Try Int (4 bytes)
            if (remaining >= 4) {
                args.push({ 
                    type: 'Int', 
                    value: view.getInt32(offset),
                    hex: getHex(offset, 4)
                });
                offset += 4;
                continue;
            }
            
            // 3. Try Short (2 bytes)
            if (remaining >= 2) {
                args.push({ 
                    type: 'Short', 
                    value: view.getInt16(offset),
                    hex: getHex(offset, 2)
                });
                offset += 2;
                continue;
            }
            
            // 4. Fallback to Byte
            args.push({ 
                type: 'Byte', 
                value: new Uint8Array(buffer)[offset],
                hex: getHex(offset, 1)
            });
            offset += 1;
        }
        return args;
    },

    // Binary Writer Helper
    createPacket(header, args) {
      const chunks = [];
      let totalLength = 0;

      const write = (buffer) => {
        chunks.push(buffer);
        totalLength += buffer.byteLength;
      };

      const writeByte = (val) => {
        const buf = new Uint8Array(1);
        buf[0] = val;
        write(buf);
      };

      const writeShort = (val) => {
        const buf = new Uint8Array(2);
        const view = new DataView(buf.buffer);
        view.setInt16(0, val); // Big Endian
        write(buf);
      };

      const writeInt = (val) => {
        const buf = new Uint8Array(4);
        const view = new DataView(buf.buffer);
        view.setInt32(0, val); // Big Endian
        write(buf);
      };

      const writeString = (val) => {
        const enc = new TextEncoder();
        const bytes = enc.encode(val);
        writeShort(bytes.length);
        write(bytes);
      };

      // 1. Write Header
      writeShort(header);

      // 2. Write Args
      for (const arg of args) {
        if (arg === null || arg === undefined) {
          // writeShort(0); // Should we write 0 for null? Or just skip? 
          // Usually null strings are empty strings (len 0).
          // Null numbers are 0.
          // Let's assume 0 int for safety if unknown.
          writeInt(0);
          continue;
        }

        if (typeof arg === 'object' && arg.type) {
          // Explicit Typed Argument
          switch (arg.type) {
            case 'Byte': writeByte(arg.value); break;
            case 'Short': writeShort(arg.value); break;
            case 'Int': writeInt(arg.value); break;
            case 'String': writeString(arg.value); break;
            default: console.warn('Unknown type', arg.type);
          }
        } else if (typeof arg === 'number') {
          // Default to Int for numbers
          writeInt(arg);
        } else if (typeof arg === 'boolean') {
          writeByte(arg ? 1 : 0);
        } else if (typeof arg === 'string') {
          writeString(arg);
        }
      }

      // 3. Combine Payload
      const payload = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        payload.set(new Uint8Array(chunk.buffer || chunk), offset);
        offset += chunk.byteLength;
      }

      // 4. Wrap with Length (Int)
      const finalBuf = new Uint8Array(4 + payload.byteLength);
      const finalView = new DataView(finalBuf.buffer);
      finalView.setInt32(0, payload.byteLength);
      finalBuf.set(payload, 4);

      return finalBuf.buffer;
    },

    // Public API: Send to Server
    send(header, ...values) {
      if (!this.socket) {
        const msg = 'PacketManager: Socket not captured yet.';
        log.error(msg);
        UI.showToast(msg, 'error');
        return;
      }
      
      if (this.socket.readyState !== WebSocket.OPEN) {
        const msg = `PacketManager: Socket not open (State: ${this.socket.readyState})`;
        log.error(msg);
        UI.showToast(msg, 'error');
        return;
      }

      try {
        const buffer = this.createPacket(header, values);
        this.socket.send(buffer);
        
        const msg = `Sent Packet [${header}]`;
        log.info(msg, values);
        
        // Hex dump for debug
        if (this.loggingEnabled) {
            const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(' ');
            console.log(`%c[PacketManager] SENT HEX: ${hex}`, 'color: #00aa00; font-weight: bold');
        }
        
        UI.showToast(msg, 'success');
      } catch (e) {
        log.error('PacketManager: Send error', e);
        UI.showToast('Packet Send Error', 'error');
      }
    },

    // Public API: Inject to Client (Simulate Incoming)
    inject(header, ...values) {
      if (!this.socket) {
        UI.showToast('Socket not captured', 'error');
        return;
      }
      try {
        const buffer = this.createPacket(header, values);
        
        // Create a MessageEvent without source (WebSocket is not a valid source for MessageEvent)
        const event = new MessageEvent('message', {
          data: buffer,
          origin: this.socket.url
        });
        
        // Dispatch it on the socket
        this.socket.dispatchEvent(event);
        
        // Fallback: Try calling onmessage directly if it exists
        if (this.socket.onmessage) {
          this.socket.onmessage(event);
        }
        
        const msg = `Injected Packet [${header}]`;
        log.info(msg, values);
        
        if (this.loggingEnabled) {
            const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(' ');
            console.log(`%c[PacketManager] INJECT HEX: ${hex}`, 'color: #00aaaa; font-weight: bold');
        }

        UI.showToast(msg, 'info');
      } catch (e) {
        log.error('Packet Injection Error', e);
        UI.showToast('Injection Error', 'error');
      }
    },
    
    // Alias for inject
    receive(header, ...values) {
      this.inject(header, ...values);
    },
    
    // Type helpers for console use
    types: {
      Byte: (v) => ({ type: 'Byte', value: v }),
      Short: (v) => ({ type: 'Short', value: v }),
      Int: (v) => ({ type: 'Int', value: v }),
      String: (v) => ({ type: 'String', value: v }),
    },
    
    debug() {
      console.log('PacketManager Debug:');
      console.log('- Socket:', this.socket);
      console.log('- ReadyState:', this.socket ? this.socket.readyState : 'N/A');
      console.log('- Logging:', this.loggingEnabled);
    },
    
    toggleLogging(state) {
      this.loggingEnabled = state !== undefined ? state : !this.loggingEnabled;
      config.set('packetLoggingEnabled', this.loggingEnabled);
      log.info(`PacketManager: Logging ${this.loggingEnabled ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Packet Builder UI
  // ─────────────────────────────────────────────────────────────────
  const PacketBuilder = {
    isOpen: false,
    window: null,
    activeTab: 'builder', // 'builder', 'history', 'incoming', or 'macros'
    lastPosition: null,
    editingMacro: null, // For macro editor
    
    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    },

    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      const win = document.createElement('div');
      win.className = 'kuplafix-menu'; // Reuse main menu class for styling
      
      const pos = this.lastPosition || { top: '100px', left: '100px' };
      
      Object.assign(win.style, {
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: '450px',
        height: 'auto',
        maxHeight: '650px',
        zIndex: '100001', // Higher than main menu (99999)
        transform: 'none', // Override centering from class
        display: 'flex',
        flexDirection: 'column',
        padding: '15px', // Match main menu padding
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      });

      // Header
      const header = document.createElement('div');
      header.className = 'kuplafix-menu-header';
      header.style.cursor = 'move';
      header.style.marginBottom = '15px';
      header.style.paddingRight = '40px'; // Space for close button
      header.innerHTML = `
        <div class="kuplafix-menu-subtitle" style="margin:0; font-weight:bold; color:#fff; text-transform:none; letter-spacing:normal; font-size:16px;">Packet Builder</div>
        <button class="kuplafix-close-btn">✕</button>
      `;
      header.querySelector('button').onclick = () => this.close();
      win.appendChild(header);

      // Tabs
      const tabs = document.createElement('div');
      tabs.style.display = 'flex';
      tabs.style.borderBottom = '1px solid var(--kuplafix-border)';
      tabs.style.background = 'rgba(12, 18, 22, 0.7)';
      tabs.style.margin = '0 -15px'; // Pull to edges
      
      const createTab = (id, label) => {
          const tab = document.createElement('div');
          tab.textContent = label;
          tab.style.flex = '1';
          tab.style.padding = '10px';
          tab.style.textAlign = 'center';
          tab.style.cursor = 'pointer';
          tab.style.fontSize = '12px';
          tab.style.fontWeight = '600';
          tab.style.textTransform = 'uppercase';
          tab.style.letterSpacing = '0.05em';
          tab.style.color = this.activeTab === id ? '#fff' : '#aaa';
          tab.style.background = this.activeTab === id ? 'rgba(23, 111, 143, 0.35)' : 'transparent';
          tab.style.borderBottom = this.activeTab === id ? '2px solid var(--kuplafix-accent)' : '2px solid transparent';
          tab.onclick = () => {
              this.activeTab = id;
              this.renderContent();
          };
          return tab;
      };
      
      tabs.appendChild(createTab('builder', 'Builder'));
      tabs.appendChild(createTab('history', 'Out Log'));
      tabs.appendChild(createTab('incoming', 'In Log'));
      tabs.appendChild(createTab('macros', 'Macros'));
      win.appendChild(tabs);

      // Content Area
      const content = document.createElement('div');
      content.id = 'pb-content';
      content.style.flex = '1';
      content.style.overflowY = 'auto';
      content.style.padding = '15px 0 0 0'; // Only top padding for spacing from tabs
      win.appendChild(content);

      document.body.appendChild(win);
      this.window = win;
      this.contentArea = content;

      // Make draggable
      this.makeDraggable(win, header);
      
      this.renderContent();
    },
    
    renderContent() {
        if (!this.window) return;
        
        // Update tabs styling
        const tabs = this.window.children[1].children;
        const tabIds = ['builder', 'history', 'incoming', 'macros'];
        for (let i = 0; i < tabs.length && i < tabIds.length; i++) {
            const isActive = this.activeTab === tabIds[i];
            tabs[i].style.color = isActive ? '#fff' : '#aaa';
            tabs[i].style.background = isActive ? 'rgba(23, 111, 143, 0.35)' : 'transparent';
            tabs[i].style.borderBottom = isActive ? '2px solid var(--kuplafix-accent)' : '2px solid transparent';
        }
        
        this.contentArea.innerHTML = '';
        this.contentArea.style.padding = '15px 15px 15px 0px';
        
        if (this.activeTab === 'builder') {
            this.renderBuilder();
        } else if (this.activeTab === 'history') {
            this.renderHistory();
        } else if (this.activeTab === 'incoming') {
            this.renderIncomingLog();
        } else if (this.activeTab === 'macros') {
            this.renderMacros();
        }
    },
    
    renderBuilder() {
      const content = this.contentArea;
      content.style.padding = '15px 15px 15px 0px';
      
      // Header Selection Row
      const headerRow = document.createElement('div');
      headerRow.className = 'kuplafix-options-row';
      headerRow.style.alignItems = 'flex-start';
      headerRow.innerHTML = `
        <div style="flex:2; position:relative;">
          <label class="kuplafix-options-label">Header (ID or Name)</label>
          <div class="pb-header-search-container">
            <input type="text" id="pb-header-search" placeholder="Search headers..." class="kuplafix-options-input" style="width:100%; box-sizing:border-box;">
            <div id="pb-header-dropdown" class="pb-header-dropdown"></div>
          </div>
          <input type="hidden" id="pb-header" value="1314">
        </div>
        <div style="flex:1">
          <label class="kuplafix-options-label">Direction</label>
          <select id="pb-direction" class="kuplafix-options-input">
            <option value="send">Send (OUT)</option>
            <option value="inject">Inject (IN)</option>
          </select>
        </div>
      `;
      content.appendChild(headerRow);

      const searchInput = headerRow.querySelector('#pb-header-search');
      const dropdown = headerRow.querySelector('#pb-header-dropdown');
      const hiddenInput = headerRow.querySelector('#pb-header');
      const dirSelect = headerRow.querySelector('#pb-direction');

      // Initialize search input with default
      const updateSearchFromId = (id, direction) => {
          const map = direction === 'send' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
          let name = 'Unknown';
          for (const [n, i] of Object.entries(map)) {
              if (i === parseInt(id)) {
                  name = n;
                  break;
              }
          }
          searchInput.value = name !== 'Unknown' ? `[${id}] ${name}` : id;
          hiddenInput.value = id;
          this.updatePayloadPreview();
      };

      updateSearchFromId(hiddenInput.value, dirSelect.value);

      searchInput.onfocus = () => {
          this.showDropdown(dropdown, searchInput.value, dirSelect.value);
      };

      searchInput.oninput = () => {
          this.showDropdown(dropdown, searchInput.value, dirSelect.value);
          // If user types a number directly, update hidden input
          if (/^\d+$/.test(searchInput.value)) {
              hiddenInput.value = searchInput.value;
              this.updatePayloadPreview();
          }
      };

      dirSelect.onchange = () => {
          updateSearchFromId(hiddenInput.value, dirSelect.value);
      };

      // Close dropdown on click outside
      const closeHandler = (e) => {
          if (!headerRow.contains(e.target)) {
              dropdown.classList.remove('open');
          }
      };
      document.addEventListener('mousedown', closeHandler);
      this.window._closeHandler = closeHandler; // Store for cleanup

      // Arguments Container
      const argsContainer = document.createElement('div');
      argsContainer.id = 'pb-args';
      argsContainer.style.display = 'flex';
      argsContainer.style.flexDirection = 'column';
      argsContainer.style.gap = '8px';
      argsContainer.style.marginTop = '15px';
      content.appendChild(argsContainer);

      // Add Argument Button
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Add Argument';
      addBtn.className = 'kuplafix-btn-secondary';
      addBtn.style.width = '100%';
      addBtn.style.marginTop = '10px';
      addBtn.onclick = () => {
          this.addArgumentRow(argsContainer);
          this.updatePayloadPreview();
      };
      content.appendChild(addBtn);

      // Payload Preview
      const previewSection = document.createElement('div');
      previewSection.style.marginTop = '15px';
      previewSection.innerHTML = `
          <div style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Payload Preview</div>
          <div id="pb-payload-preview" class="kuplafix-console-content" style="min-height: 40px; max-height: 80px; padding: 8px; font-family: monospace; font-size: 11px; word-break: break-all;"></div>
      `;
      content.appendChild(previewSection);

      // Actions
      const actions = document.createElement('div');
      actions.style.marginTop = '15px';
      
      const sendBtn = document.createElement('button');
      sendBtn.textContent = 'Execute Packet';
      sendBtn.className = 'kuplafix-btn';
      sendBtn.style.width = '100%';
      sendBtn.onclick = () => this.executePacket();
      actions.appendChild(sendBtn);
      
      content.appendChild(actions);
      
      // Add initial argument (String)
      this.addArgumentRow(argsContainer, 'String');
      
      // Initial preview update
      this.updatePayloadPreview();
    },

    showDropdown(dropdown, query, direction) {
        dropdown.innerHTML = '';
        const map = direction === 'send' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
        
        let showAll = !query;
        let search = query;
        const match = query.match(/^\[(\d+)\]\s*(.*)$/);
        if (match) {
            const selectedId = parseInt(match[1]);
            const selectedName = match[2];
            // If the name in the box matches the ID in the box, it's a "clean" selection
            // We show all entries to allow browsing when the user clicks a filled field
            if (map[selectedName] === selectedId) {
                showAll = true;
            }
            search = selectedName;
        }
        
        const items = Object.entries(map);
        const filtered = items.filter(([name, id]) => {
            if (showAll) return true;
            const q = search.toLowerCase();
            return name.toLowerCase().includes(q) || id.toString().includes(q);
        }).slice(0, 200);

        if (filtered.length === 0) {
            dropdown.classList.remove('open');
            return;
        }

        filtered.forEach(([name, id]) => {
            const item = document.createElement('div');
            item.className = 'pb-header-item';
            item.innerHTML = `
                <span>${name}</span>
                <span class="pb-header-item-id">${id}</span>
            `;
            item.onclick = (e) => {
                e.stopPropagation();
                const searchInput = document.getElementById('pb-header-search');
                const hiddenInput = document.getElementById('pb-header');
                searchInput.value = `[${id}] ${name}`;
                hiddenInput.value = id;
                dropdown.classList.remove('open');
                this.updatePayloadPreview();
            };
            dropdown.appendChild(item);
        });

        dropdown.classList.add('open');
    },
    
    renderHistory() {
        const content = this.contentArea;
        content.style.padding = '15px 15px 15px 0px';
        
        const consoleWrapper = document.createElement('div');
        consoleWrapper.className = 'kuplafix-console';
        
        const consoleHeader = document.createElement('div');
        consoleHeader.className = 'kuplafix-console-header';
        consoleHeader.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Outgoing Packets</span>
                    <button class="kuplafix-btn-secondary" style="padding: 2px 8px; font-size: 9px;">Clear Log</button>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <label style="font-size: 10px; color: #aaa; white-space: nowrap;">Ignore IDs:</label>
                    <input type="text" id="pb-ignore-outgoing" class="kuplafix-options-input" placeholder="e.g. 374, 1640, 1717" style="flex: 1; font-size: 10px; padding: 4px 8px;" value="${Array.from(PacketManager.ignoredOutgoingHeaders).join(', ')}">
                </div>
            </div>
        `;
        consoleHeader.querySelector('button').onclick = () => PacketManager.clearHistory();
        
        const ignoreInput = consoleHeader.querySelector('#pb-ignore-outgoing');
        ignoreInput.onchange = () => {
            const ids = ignoreInput.value.split(',').map(s => s.trim()).filter(s => s && !isNaN(s)).map(s => parseInt(s));
            PacketManager.ignoredOutgoingHeaders = new Set(ids);
            PacketManager.saveIgnoredHeaders();
            UI.showToast(`Ignoring ${ids.length} outgoing header(s)`, 'info');
        };
        
        const consoleContent = document.createElement('div');
        consoleContent.className = 'kuplafix-console-content';
        consoleContent.id = 'pb-console-content';
        
        if (PacketManager.outgoingHistory.length === 0) {
            consoleContent.innerHTML = '<div style="text-align:center; color:#5c707a; padding:20px; font-size: 10px;">Console ready. Waiting for packets...</div>';
        } else {
            PacketManager.outgoingHistory.forEach(p => {
                consoleContent.appendChild(this.createLogLine(p));
            });
        }
        
        consoleWrapper.appendChild(consoleHeader);
        consoleWrapper.appendChild(consoleContent);
        content.appendChild(consoleWrapper);
        
        // Scroll to bottom
        setTimeout(() => {
            consoleContent.scrollTop = consoleContent.scrollHeight;
        }, 10);
    },

    createLogLine(p, direction = 'OUT') {
        const line = document.createElement('div');
        line.className = 'kuplafix-console-line';
        
        // Find header name
        let headerName = 'Unknown';
        const headerMap = direction === 'OUT' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
        for (const [name, id] of Object.entries(headerMap)) {
            if (id === p.header) {
                headerName = name;
                break;
            }
        }
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'kuplafix-console-time';
        timeSpan.textContent = p.timestamp;
        
        const idSpan = document.createElement('span');
        idSpan.className = 'kuplafix-console-id';
        idSpan.textContent = `[${p.header}]`;
        idSpan.style.cursor = 'pointer';
        idSpan.title = 'Click to ignore this header';
        idSpan.onclick = (e) => {
            e.stopPropagation();
            PacketManager.addIgnoredHeader(direction, p.header);
            
            // Update input field
            const inputId = direction === 'OUT' ? 'pb-ignore-outgoing' : 'pb-ignore-incoming';
            const input = document.getElementById(inputId);
            const ignoredSet = direction === 'OUT' ? PacketManager.ignoredOutgoingHeaders : PacketManager.ignoredIncomingHeaders;
            if (input) {
                input.value = Array.from(ignoredSet).join(', ');
            }
            
            UI.showToast(`Ignoring header [${p.header}] ${headerName}`, 'info');
        };
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'kuplafix-console-name';
        nameSpan.textContent = headerName;
        nameSpan.style.cursor = 'pointer';
        nameSpan.title = 'Click to import to builder';
        nameSpan.onclick = () => this.importPacket(p, direction);
        
        const hexSpan = document.createElement('span');
        hexSpan.className = 'kuplafix-console-hex';
        hexSpan.textContent = p.hex;
        hexSpan.style.cursor = 'pointer';
        hexSpan.title = 'Click to import to builder';
        hexSpan.onclick = () => this.importPacket(p, direction);
        
        line.appendChild(timeSpan);
        line.appendChild(idSpan);
        line.appendChild(nameSpan);
        line.appendChild(hexSpan);
        
        return line;
    },

    appendLog(packet) {
        const consoleContent = document.getElementById('pb-console-content');
        if (!consoleContent) return;
        
        // Remove placeholder if it exists
        if (PacketManager.outgoingHistory.length === 1) {
            consoleContent.innerHTML = '';
        }
        
        const line = this.createLogLine(packet);
        consoleContent.appendChild(line);
        
        // Auto-scroll if near bottom
        const isNearBottom = consoleContent.scrollHeight - consoleContent.scrollTop - consoleContent.clientHeight < 50;
        if (isNearBottom) {
            consoleContent.scrollTop = consoleContent.scrollHeight;
        }
        
        // Keep max lines
        if (consoleContent.children.length > PacketManager.maxHistory) {
            consoleContent.removeChild(consoleContent.firstChild);
        }
    },

    renderIncomingLog() {
        const content = this.contentArea;
        content.style.padding = '15px 15px 15px 0px';
        
        const consoleWrapper = document.createElement('div');
        consoleWrapper.className = 'kuplafix-console';
        
        const consoleHeader = document.createElement('div');
        consoleHeader.className = 'kuplafix-console-header';
        consoleHeader.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Incoming Packets</span>
                    <button class="kuplafix-btn-secondary" style="padding: 2px 8px; font-size: 9px;">Clear Log</button>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <label style="font-size: 10px; color: #aaa; white-space: nowrap;">Ignore IDs:</label>
                    <input type="text" id="pb-ignore-incoming" class="kuplafix-options-input" placeholder="e.g. 374, 1640, 1717" style="flex: 1; font-size: 10px; padding: 4px 8px;" value="${Array.from(PacketManager.ignoredIncomingHeaders).join(', ')}">
                </div>
            </div>
        `;
        consoleHeader.querySelector('button').onclick = () => PacketManager.clearIncomingHistory();
        
        const ignoreInput = consoleHeader.querySelector('#pb-ignore-incoming');
        ignoreInput.onchange = () => {
            const ids = ignoreInput.value.split(',').map(s => s.trim()).filter(s => s && !isNaN(s)).map(s => parseInt(s));
            PacketManager.ignoredIncomingHeaders = new Set(ids);
            PacketManager.saveIgnoredHeaders();
            UI.showToast(`Ignoring ${ids.length} incoming header(s)`, 'info');
        };
        
        const consoleContent = document.createElement('div');
        consoleContent.className = 'kuplafix-console-content';
        consoleContent.id = 'pb-incoming-content';
        
        if (PacketManager.incomingHistory.length === 0) {
            consoleContent.innerHTML = '<div style="text-align:center; color:#5c707a; padding:20px; font-size: 10px;">Console ready. Waiting for packets...</div>';
        } else {
            PacketManager.incomingHistory.forEach(p => {
                consoleContent.appendChild(this.createLogLine(p, 'IN'));
            });
        }
        
        consoleWrapper.appendChild(consoleHeader);
        consoleWrapper.appendChild(consoleContent);
        content.appendChild(consoleWrapper);
        
        // Scroll to bottom
        setTimeout(() => {
            consoleContent.scrollTop = consoleContent.scrollHeight;
        }, 10);
    },

    appendIncomingLog(packet) {
        const consoleContent = document.getElementById('pb-incoming-content');
        if (!consoleContent) return;
        
        // Remove placeholder if it exists
        if (PacketManager.incomingHistory.length === 1) {
            consoleContent.innerHTML = '';
        }
        
        const line = this.createLogLine(packet, 'IN');
        consoleContent.appendChild(line);
        
        // Auto-scroll if near bottom
        const isNearBottom = consoleContent.scrollHeight - consoleContent.scrollTop - consoleContent.clientHeight < 50;
        if (isNearBottom) {
            consoleContent.scrollTop = consoleContent.scrollHeight;
        }
        
        // Keep max lines
        if (consoleContent.children.length > PacketManager.maxHistory) {
            consoleContent.removeChild(consoleContent.firstChild);
        }
    },
    
    importPacket(packet, direction = 'OUT') {
        this.activeTab = 'builder';
        this.renderContent();
        
        // Wait for render
        setTimeout(() => {
            const searchInput = document.getElementById('pb-header-search');
            const hiddenInput = document.getElementById('pb-header');
            const dirSelect = document.getElementById('pb-direction');
            
            // Set direction based on where packet came from
            if (dirSelect) dirSelect.value = direction === 'OUT' ? 'send' : 'inject';
            
            // Find name
            let name = 'Unknown';
            const headerMap = direction === 'OUT' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
            for (const [n, i] of Object.entries(headerMap)) {
                if (i === packet.header) {
                    name = n;
                    break;
                }
            }
            
            if (searchInput) searchInput.value = `[${packet.header}] ${name}`;
            if (hiddenInput) hiddenInput.value = packet.header;
            
            // Clear args
            const argsContainer = document.getElementById('pb-args');
            if (argsContainer) {
                argsContainer.innerHTML = '';
                
                // Try to parse arguments
                const parsedArgs = PacketManager.parsePacket(packet.buffer);
                
                if (parsedArgs.length > 0) {
                    parsedArgs.forEach(arg => {
                        this.addArgumentRow(argsContainer, arg.type, arg.value);
                    });
                    UI.showToast(`Imported ${parsedArgs.length} arguments (Auto-detected)`, 'success');
                } else {
                    UI.showToast('Header imported. Could not auto-detect arguments.', 'info');
                    this.addArgumentRow(argsContainer, 'String');
                }
            }
            
            // Update payload preview
            this.updatePayloadPreview();
        }, 50);
    },

    close() {
      if (this.window) {
        if (this.window._closeHandler) {
            document.removeEventListener('mousedown', this.window._closeHandler);
        }
        this.window.remove();
        this.window = null;
      }
      this.isOpen = false;
    },

    addArgumentRow(container, defaultType = 'String', defaultValue = '') {
      const row = document.createElement('div');
      row.className = 'pb-arg-row';
      row.style.display = 'flex';
      row.style.gap = '8px';
      
      const typeSelect = document.createElement('select');
      typeSelect.className = 'pb-arg-type kuplafix-options-input';
      typeSelect.style.width = '80px';
      
      ['String', 'Int', 'Short', 'Byte', 'Boolean'].forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        if (t === defaultType) opt.selected = true;
        typeSelect.appendChild(opt);
      });
      typeSelect.onchange = () => this.updatePayloadPreview();

      const valueInput = document.createElement('input');
      valueInput.className = 'pb-arg-value kuplafix-options-input';
      valueInput.placeholder = 'Value';
      valueInput.value = defaultValue;
      valueInput.style.flex = '1';
      valueInput.oninput = () => this.updatePayloadPreview();

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'kuplafix-btn';
      removeBtn.style.background = '#c0392b';
      removeBtn.style.width = '30px';
      removeBtn.style.padding = '0';
      removeBtn.onclick = () => {
          row.remove();
          this.updatePayloadPreview();
      };

      row.appendChild(typeSelect);
      row.appendChild(valueInput);
      row.appendChild(removeBtn);
      container.appendChild(row);
      
      // Update preview after adding row
      this.updatePayloadPreview();
    },

    updatePayloadPreview() {
      const preview = document.getElementById('pb-payload-preview');
      if (!preview) return;
      
      const headerEl = document.getElementById('pb-header');
      const headerId = headerEl ? parseInt(headerEl.value) : 0;
      const argRows = document.querySelectorAll('.pb-arg-row');
      
      if (isNaN(headerId) || headerId === 0) {
          preview.innerHTML = '<span style="color:#5c707a;">Select a header...</span>';
          return;
      }
      
      const args = [];
      argRows.forEach(row => {
          const type = row.querySelector('.pb-arg-type').value;
          const rawValue = row.querySelector('.pb-arg-value').value;
          let value;
          switch (type) {
              case 'String': value = rawValue; break;
              case 'Int': value = parseInt(rawValue) || 0; break;
              case 'Short': value = parseInt(rawValue) || 0; break;
              case 'Byte': value = parseInt(rawValue) || 0; break;
              case 'Boolean': value = (rawValue === 'true' || rawValue === '1'); break;
          }
          args.push(PacketManager.types[type](value));
      });
      
      try {
          const buffer = PacketManager.createPacket(headerId, args);
          const bytes = new Uint8Array(buffer);
          const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
          
          // Color-code: header (blue), payload (green)
          const headerHex = Array.from(bytes.slice(0, 6)).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
          const payloadHex = bytes.length > 6 ? Array.from(bytes.slice(6)).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ') : '';
          
          preview.innerHTML = `
              <span style="color:#3498db;" title="Length (4) + Header (2)">${headerHex}</span>${payloadHex ? ' ' : ''}
              <span style="color:#2ecc71;" title="Payload">${payloadHex}</span>
              <div style="margin-top:6px; font-size:10px; color:#888;">${bytes.length} bytes total</div>
          `;
      } catch (e) {
          preview.innerHTML = `<span style="color:#e74c3c;">Error: ${e.message}</span>`;
      }
    },

    executePacket() {
      const headerId = parseInt(document.getElementById('pb-header').value);
      const direction = document.getElementById('pb-direction').value;
      const argRows = document.querySelectorAll('.pb-arg-row');
      
      if (isNaN(headerId)) {
        UI.showToast('Invalid Header ID', 'error');
        return;
      }

      const args = [];
      
      argRows.forEach(row => {
        const type = row.querySelector('.pb-arg-type').value;
        const rawValue = row.querySelector('.pb-arg-value').value;
        let value;

        switch (type) {
          case 'String': value = rawValue; break;
          case 'Int': value = parseInt(rawValue) || 0; break;
          case 'Short': value = parseInt(rawValue) || 0; break;
          case 'Byte': value = parseInt(rawValue) || 0; break;
          case 'Boolean': value = (rawValue === 'true' || rawValue === '1'); break;
        }

        // Use explicit types helper
        args.push(PacketManager.types[type](value));
      });

      if (direction === 'send') {
        PacketManager.send(headerId, ...args);
      } else {
        PacketManager.inject(headerId, ...args);
      }
    },

    makeDraggable(element, handle) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      handle.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        
        // Restore text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        // Save position
        PacketBuilder.lastPosition = {
            top: element.style.top,
            left: element.style.left
        };
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // Macros Tab
    // ─────────────────────────────────────────────────────────────────
    renderMacros() {
        const content = this.contentArea;
        
        // If editing a macro, show editor
        if (this.editingMacro !== null) {
            this.renderMacroEditor();
            return;
        }
        
        // Safety setting for macro notifications
        const settingsRow = document.createElement('div');
        settingsRow.style.cssText = 'background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:8px 10px; margin-bottom:12px; display:flex; align-items:center;';
        
        const acceptAllEnabled = config.get('acceptAllMacroNotifications') || false;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'accept-all-macros';
        checkbox.checked = acceptAllEnabled;
        checkbox.className = 'kuplafix-macro-checkbox';
        checkbox.style.cssText = 'margin-right:8px;';
        checkbox.onchange = () => {
            config.set('acceptAllMacroNotifications', checkbox.checked);
            log.info('Receive all macro notifications:', checkbox.checked);
        };
        
        const label = document.createElement('label');
        label.htmlFor = 'accept-all-macros';
        label.style.cssText = 'color:rgba(255,255,255,0.8); font-size:11px; cursor:pointer; user-select:none;';
        label.textContent = 'Receive macros from all users (default: only 0es)';
        
        settingsRow.appendChild(checkbox);
        settingsRow.appendChild(label);
        content.appendChild(settingsRow);
        
        // Header with Add button
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;';
        headerDiv.innerHTML = `
            <div style="color:#fff; font-weight:600;">Macros (${PacketManager.macros.length})</div>
        `;
        
        const addBtn = document.createElement('button');
        addBtn.className = 'kuplafix-btn';
        addBtn.style.fontSize = '11px';
        addBtn.style.padding = '4px 10px';
        addBtn.textContent = '+ New Macro';
        addBtn.onclick = () => {
            this.editingMacro = {
                name: 'New Macro',
                enabled: true,
                trigger: {
                    direction: 'receive',
                    header: 0,
                    conditions: []
                },
                actions: []
            };
            this.renderContent();
        };
        headerDiv.appendChild(addBtn);
        content.appendChild(headerDiv);
        
        // Macro List
        if (PacketManager.macros.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'text-align:center; color:#5c707a; padding:30px 0;';
            empty.innerHTML = `
                <div style="font-size:24px; margin-bottom:8px;">📦</div>
                <div>No macros configured</div>
                <div style="font-size:11px; margin-top:4px;">Click "+ New Macro" to create one</div>
            `;
            content.appendChild(empty);
            return;
        }
        
        const list = document.createElement('div');
        list.style.cssText = 'display:flex; flex-direction:column; gap:8px;';
        
        for (const macro of PacketManager.macros) {
            const item = document.createElement('div');
            item.style.cssText = `
                background: rgba(12, 18, 22, 0.6);
                border: 1px solid var(--kuplafix-border);
                border-radius: 6px;
                padding: 10px 12px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            
            // Enable toggle
            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = macro.enabled;
            toggle.className = 'kuplafix-macro-checkbox';
            toggle.onchange = () => {
                PacketManager.toggleMacro(macro.id);
                this.renderContent();
            };
            
            // Info
            const info = document.createElement('div');
            info.style.cssText = 'flex:1; min-width:0;';
            
            const dirLabel = macro.trigger.direction === 'send' ? 'OUT' : 'IN';
            const headerName = this.getHeaderName(macro.trigger.header, macro.trigger.direction);
            
            info.innerHTML = `
                <div style="font-weight:600; color:${macro.enabled ? '#fff' : '#5c707a'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${macro.name}</div>
                <div style="font-size:11px; color:#5c707a;">
                    <span style="color:${macro.trigger.direction === 'send' ? '#2ecc71' : '#3498db'};">${dirLabel}</span> 
                    [${macro.trigger.header}] ${headerName}
                    ${macro.trigger.conditions.length > 0 ? `• ${macro.trigger.conditions.length} condition(s)` : ''}
                    • ${macro.actions.length} action(s)
                </div>
            `;
            
            // Buttons
            const btnGroup = document.createElement('div');
            btnGroup.style.cssText = 'display:flex; gap:4px;';
            
            const shareBtn = document.createElement('button');
            shareBtn.className = 'kuplafix-btn';
            shareBtn.style.cssText = 'padding:4px 8px; font-size:11px; background:#8e44ad;';
            shareBtn.textContent = '📤';
            shareBtn.title = 'Share macro';
            shareBtn.onclick = () => {
                const code = this.encodeMacro(macro);
                if (code) {
                    this.showShareDialog(code, macro.name);
                }
            };
            
            const editBtn = document.createElement('button');
            editBtn.className = 'kuplafix-btn';
            editBtn.style.cssText = 'padding:4px 8px; font-size:11px;';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                this.editingMacro = JSON.parse(JSON.stringify(macro)); // Deep copy
                this.renderContent();
            };
            
            const delBtn = document.createElement('button');
            delBtn.className = 'kuplafix-btn';
            delBtn.style.cssText = 'padding:4px 8px; font-size:11px; background:#c0392b;';
            delBtn.textContent = '×';
            delBtn.title = 'Delete macro';
            delBtn.onclick = () => {
                PacketManager.deleteMacro(macro.id);
                UI.showToast(`Deleted macro "${macro.name}"`, 'info');
                this.renderContent();
            };
            
            btnGroup.appendChild(shareBtn);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(delBtn);
            
            item.appendChild(toggle);
            item.appendChild(info);
            item.appendChild(btnGroup);
            list.appendChild(item);
        }
        
        content.appendChild(list);
        
        // Import section
        const importSection = document.createElement('div');
        importSection.style.cssText = 'margin-top:16px; padding-top:12px; border-top:1px solid var(--kuplafix-border);';
        importSection.innerHTML = `
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="text" id="macro-import-input" class="kuplafix-options-input" placeholder="Paste macro code (KFM2:...)..." style="flex:1; font-size:11px;">
                <button id="macro-import-btn" class="kuplafix-btn" style="font-size:11px; padding:4px 10px;">Import</button>
            </div>
            <div style="font-size:10px; color:#5c707a; margin-top:6px;">📤 Share via trophy text (300 chars) or chat (100 chars). Most macros fit!</div>
        `;
        content.appendChild(importSection);
        
        importSection.querySelector('#macro-import-btn').onclick = () => {
            const input = importSection.querySelector('#macro-import-input');
            const code = input.value.trim();
            if (!code) {
                UI.showToast('Please paste a macro code', 'error');
                return;
            }
            
            const macro = this.decodeMacro(code);
            if (macro) {
                PacketManager.addMacro(macro);
                UI.showToast(`Imported macro "${macro.name}"`, 'success');
                input.value = '';
                this.renderContent();
            } else {
                UI.showToast('Invalid macro code', 'error');
            }
        };
    },

    renderMacroEditor() {
        const content = this.contentArea;
        const macro = this.editingMacro;
        const isNew = !macro.id;
        
        // Header
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;';
        headerDiv.innerHTML = `<div style="color:#fff; font-weight:600;">${isNew ? 'New Macro' : 'Edit Macro'}</div>`;
        
        const backBtn = document.createElement('button');
        backBtn.className = 'kuplafix-btn';
        backBtn.style.cssText = 'font-size:11px; padding:4px 10px; background:#5c707a;';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => {
            this.editingMacro = null;
            this.renderContent();
        };
        headerDiv.appendChild(backBtn);
        content.appendChild(headerDiv);
        
        // Scrollable form
        const form = document.createElement('div');
        form.style.cssText = 'max-height:450px; overflow-y:auto; padding-right:5px;';
        
        // Name
        form.innerHTML += `
            <div class="kuplafix-options-row" style="margin-bottom:12px;">
                <div style="flex:1;">
                    <label class="kuplafix-options-label">Macro Name</label>
                    <input type="text" id="macro-name" class="kuplafix-options-input" value="${macro.name}" style="width:100%; box-sizing:border-box;">
                </div>
            </div>
        `;
        
        // Trigger Section
        const triggerDiv = document.createElement('div');
        triggerDiv.innerHTML = `
            <div style="color:#3498db; font-size:11px; font-weight:600; text-transform:uppercase; margin-bottom:8px; margin-top:12px;">Trigger</div>
            <div class="kuplafix-options-row" style="margin-bottom:8px;">
                <div style="flex:1;">
                    <label class="kuplafix-options-label">Direction</label>
                    <select id="macro-trigger-dir" class="kuplafix-options-input">
                        <option value="receive" ${macro.trigger.direction === 'receive' ? 'selected' : ''}>Receive (IN)</option>
                        <option value="send" ${macro.trigger.direction === 'send' ? 'selected' : ''}>Send (OUT)</option>
                    </select>
                </div>
                <div style="flex:2; position:relative;">
                    <label class="kuplafix-options-label">Header (select from log or type)</label>
                    <div id="macro-header-container" style="position:relative;"></div>
                </div>
            </div>
        `;
        form.appendChild(triggerDiv);
        
        // Build header dropdown from logged packets
        this.buildTriggerHeaderDropdown(form.querySelector('#macro-header-container'), macro);
        
        // Conditions
        form.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin:12px 0 8px 0;">
                <div style="color:#e67e22; font-size:11px; font-weight:600; text-transform:uppercase;">Conditions (optional)</div>
                <button id="add-condition-btn" class="kuplafix-btn" style="font-size:10px; padding:2px 6px;">+ Add</button>
            </div>
            <div id="macro-conditions" style="display:flex; flex-direction:column; gap:6px;"></div>
        `;
        
        // Actions
        form.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin:12px 0 8px 0;">
                <div style="color:#2ecc71; font-size:11px; font-weight:600; text-transform:uppercase;">Actions</div>
                <button id="add-action-btn" class="kuplafix-btn" style="font-size:10px; padding:2px 6px;">+ Add</button>
            </div>
            <div id="macro-actions" style="display:flex; flex-direction:column; gap:8px;"></div>
        `;
        
        // Save/Cancel buttons
        form.innerHTML += `
            <div style="display:flex; gap:8px; margin-top:16px; padding-top:12px; border-top:1px solid var(--kuplafix-border);">
                <button id="macro-save-btn" class="kuplafix-btn" style="flex:1;">Save Macro</button>
                <button id="macro-cancel-btn" class="kuplafix-btn" style="flex:1; background:#5c707a;">Cancel</button>
            </div>
        `;
        
        content.appendChild(form);
        
        // Bind events
        form.querySelector('#macro-name').oninput = (e) => macro.name = e.target.value;
        form.querySelector('#macro-trigger-dir').onchange = (e) => {
            macro.trigger.direction = e.target.value;
            // Rebuild header dropdown for new direction
            this.buildTriggerHeaderDropdown(form.querySelector('#macro-header-container'), macro);
        };
        
        // Render conditions
        const condContainer = form.querySelector('#macro-conditions');
        this.renderMacroConditions(condContainer, macro);
        
        form.querySelector('#add-condition-btn').onclick = () => {
            macro.trigger.conditions.push({ argIndex: '0', operator: 'eq', value: '' });
            this.renderMacroConditions(condContainer, macro);
        };
        
        // Render actions
        const actContainer = form.querySelector('#macro-actions');
        this.renderMacroActions(actContainer, macro);
        
        form.querySelector('#add-action-btn').onclick = () => {
            macro.actions.push({ type: 'send', header: 0, args: [], showToast: false, toastMessage: '' });
            this.renderMacroActions(actContainer, macro);
        };
        
        // Save/Cancel
        form.querySelector('#macro-save-btn').onclick = () => {
            if (!macro.name.trim()) {
                UI.showToast('Please enter a macro name', 'error');
                return;
            }
            if (!macro.trigger.header) {
                UI.showToast('Please select a trigger header', 'error');
                return;
            }
            if (macro.actions.length === 0) {
                UI.showToast('Please add at least one action', 'error');
                return;
            }
            
            if (isNew) {
                PacketManager.addMacro(macro);
                UI.showToast(`Macro "${macro.name}" created`, 'success');
            } else {
                PacketManager.updateMacro(macro.id, macro);
                UI.showToast(`Macro "${macro.name}" updated`, 'success');
            }
            
            this.editingMacro = null;
            this.renderContent();
        };
        
        form.querySelector('#macro-cancel-btn').onclick = () => {
            this.editingMacro = null;
            this.renderContent();
        };
    },

    renderMacroConditions(container, macro) {
        container.innerHTML = '';
        
        // Show sample args info if available
        if (macro.trigger.sampleArgs && macro.trigger.sampleArgs.length > 0) {
            const sampleDiv = document.createElement('div');
            sampleDiv.style.cssText = 'background:rgba(52, 152, 219, 0.15); border:1px solid rgba(52, 152, 219, 0.3); border-radius:4px; padding:8px; margin-bottom:8px; font-size:10px;';
            sampleDiv.innerHTML = `<div style="color:#3498db; font-weight:600; margin-bottom:4px;">Sample Args from Selected Packet:</div>`;
            
            macro.trigger.sampleArgs.forEach((arg, i) => {
                const val = String(arg.value);
                const preview = val.length > 30 ? val.substring(0, 30) + '...' : val;
                sampleDiv.innerHTML += `<div style="color:#aaa;"><span style="color:#e67e22;">arg[${i}]</span> (${arg.type}): <span style="color:#fff;">${preview}</span></div>`;
            });
            container.appendChild(sampleDiv);
        }
        
        if (macro.trigger.conditions.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'color:#5c707a; font-size:11px; padding:8px; text-align:center;';
            emptyDiv.textContent = 'No conditions - triggers on any packet with matching header';
            container.appendChild(emptyDiv);
            return;
        }
        
        macro.trigger.conditions.forEach((cond, idx) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; gap:4px; align-items:center; background:rgba(12,18,22,0.5); padding:6px; border-radius:4px;';
            
            // Get sample value for placeholder if available
            const sampleVal = macro.trigger.sampleArgs && macro.trigger.sampleArgs[parseInt(cond.argIndex)] 
                ? String(macro.trigger.sampleArgs[parseInt(cond.argIndex)].value) 
                : '';
            const placeholder = sampleVal ? `e.g. ${sampleVal.substring(0, 15)}` : 'value';
            
            row.innerHTML = `
                <span style="color:#888; font-size:10px;">arg[</span>
                <input type="number" class="cond-arg kuplafix-options-input" value="${cond.argIndex}" style="width:45px; font-size:11px; text-align:center;" min="0" max="${macro.trigger.sampleArgs ? macro.trigger.sampleArgs.length - 1 : 99}">
                <span style="color:#888; font-size:10px;">]</span>
                <select class="cond-op kuplafix-options-input" style="width:70px; font-size:11px;">
                    <option value="eq" ${cond.operator === 'eq' ? 'selected' : ''}>=</option>
                    <option value="neq" ${cond.operator === 'neq' ? 'selected' : ''}>≠</option>
                    <option value="gt" ${cond.operator === 'gt' ? 'selected' : ''}>&gt;</option>
                    <option value="gte" ${cond.operator === 'gte' ? 'selected' : ''}>≥</option>
                    <option value="lt" ${cond.operator === 'lt' ? 'selected' : ''}>&lt;</option>
                    <option value="lte" ${cond.operator === 'lte' ? 'selected' : ''}>≤</option>
                    <option value="contains" ${cond.operator === 'contains' ? 'selected' : ''}>contains</option>
                </select>
                <input type="text" class="cond-val kuplafix-options-input" value="${cond.value}" placeholder="${placeholder}" style="flex:1; font-size:11px;">
                <button class="cond-del kuplafix-btn" style="background:#c0392b; padding:2px 6px;">×</button>
            `;
            
            row.querySelector('.cond-arg').onchange = (e) => {
                cond.argIndex = e.target.value;
                this.renderMacroConditions(container, macro); // Re-render to update placeholder
            };
            row.querySelector('.cond-op').onchange = (e) => cond.operator = e.target.value;
            row.querySelector('.cond-val').oninput = (e) => cond.value = e.target.value;
            row.querySelector('.cond-del').onclick = () => {
                macro.trigger.conditions.splice(idx, 1);
                this.renderMacroConditions(container, macro);
            };
            
            container.appendChild(row);
        });
    },

    renderMacroActions(container, macro) {
        container.innerHTML = '';
        
        if (macro.actions.length === 0) {
            container.innerHTML = '<div style="color:#5c707a; font-size:11px; padding:8px; text-align:center;">No actions configured</div>';
            return;
        }
        
        macro.actions.forEach((action, idx) => {
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(12,18,22,0.5); padding:10px; border-radius:6px; border:1px solid var(--kuplafix-border);';
            
            // Action type selector, reorder buttons, and delete
            const headerRow = document.createElement('div');
            headerRow.style.cssText = 'display:flex; gap:8px; align-items:center; margin-bottom:8px;';
            headerRow.innerHTML = `
                <select class="act-type kuplafix-options-input" style="flex:1;">
                    <option value="send" ${action.type === 'send' ? 'selected' : ''}>Send Packet (OUT)</option>
                    <option value="inject" ${action.type === 'inject' ? 'selected' : ''}>Inject Packet (IN)</option>
                    <option value="toast" ${action.type === 'toast' ? 'selected' : ''}>Show Toast</option>
                    <option value="delay" ${action.type === 'delay' ? 'selected' : ''}>Delay (ms)</option>
                </select>
                <button class="act-up kuplafix-btn" style="background:#3498db; padding:4px 8px;" ${idx === 0 ? 'disabled' : ''} title="Move Up">↑</button>
                <button class="act-down kuplafix-btn" style="background:#3498db; padding:4px 8px;" ${idx === macro.actions.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
                <button class="act-del kuplafix-btn" style="background:#c0392b; padding:4px 8px;">×</button>
            `;
            card.appendChild(headerRow);
            
            // Action-specific content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'act-content';
            this.renderActionContent(contentDiv, action, idx, macro);
            card.appendChild(contentDiv);
            
            // Events
            headerRow.querySelector('.act-type').onchange = (e) => {
                action.type = e.target.value;
                // Reset action-specific props
                if (action.type === 'send' || action.type === 'inject') {
                    action.header = action.header || 0;
                    action.args = action.args || [];
                } else if (action.type === 'delay') {
                    action.delay = action.delay || 100;
                }
                this.renderActionContent(contentDiv, action, idx, macro);
            };
            
            headerRow.querySelector('.act-up').onclick = () => {
                if (idx > 0) {
                    [macro.actions[idx - 1], macro.actions[idx]] = [macro.actions[idx], macro.actions[idx - 1]];
                    this.renderMacroActions(container, macro);
                }
            };
            
            headerRow.querySelector('.act-down').onclick = () => {
                if (idx < macro.actions.length - 1) {
                    [macro.actions[idx], macro.actions[idx + 1]] = [macro.actions[idx + 1], macro.actions[idx]];
                    this.renderMacroActions(container, macro);
                }
            };
            
            headerRow.querySelector('.act-del').onclick = () => {
                macro.actions.splice(idx, 1);
                this.renderMacroActions(container, macro);
            };
            
            container.appendChild(card);
        });
    },

    renderActionContent(container, action, idx, macro) {
        container.innerHTML = '';
        
        if (action.type === 'send' || action.type === 'inject') {
            // Packet header input
            container.innerHTML = `
                <div style="margin-bottom:8px;">
                    <label class="kuplafix-options-label" style="font-size:10px;">Header</label>
                    <input type="text" class="act-header kuplafix-options-input" placeholder="Header ID or name" value="${action.header || ''}" style="width:100%; box-sizing:border-box;">
                </div>
                <div style="margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <label class="kuplafix-options-label" style="font-size:10px; margin:0;">Arguments</label>
                        <button class="add-arg-btn kuplafix-btn" style="font-size:9px; padding:1px 5px;">+ Arg</button>
                    </div>
                    <div class="act-args" style="display:flex; flex-direction:column; gap:4px;"></div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <input type="checkbox" class="act-toast-check" ${action.showToast ? 'checked' : ''} style="width:14px; height:14px;">
                    <input type="text" class="act-toast-msg kuplafix-options-input" placeholder="Toast message (use {{arg0}} for vars)" value="${action.toastMessage || ''}" style="flex:1; font-size:11px;">
                </div>
            `;
            
            container.querySelector('.act-header').oninput = (e) => {
                const val = e.target.value;
                const num = parseInt(val);
                if (!isNaN(num)) {
                    action.header = num;
                } else {
                    const map = action.type === 'send' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
                    const found = Object.entries(map).find(([name]) => name.toLowerCase() === val.toLowerCase());
                    if (found) action.header = found[1];
                }
            };
            
            // Render args
            const argsContainer = container.querySelector('.act-args');
            this.renderActionArgs(argsContainer, action);
            
            container.querySelector('.add-arg-btn').onclick = () => {
                action.args.push({ type: 'Int', value: '' });
                this.renderActionArgs(argsContainer, action);
            };
            
            container.querySelector('.act-toast-check').onchange = (e) => action.showToast = e.target.checked;
            container.querySelector('.act-toast-msg').oninput = (e) => action.toastMessage = e.target.value;
            
        } else if (action.type === 'toast') {
            container.innerHTML = `
                <div style="display:flex; gap:8px;">
                    <input type="text" class="toast-msg kuplafix-options-input" placeholder="Toast message..." value="${action.toastMessage || ''}" style="flex:1;">
                    <select class="toast-type kuplafix-options-input" style="width:80px;">
                        <option value="info" ${action.toastType === 'info' ? 'selected' : ''}>Info</option>
                        <option value="success" ${action.toastType === 'success' ? 'selected' : ''}>Success</option>
                        <option value="error" ${action.toastType === 'error' ? 'selected' : ''}>Error</option>
                    </select>
                </div>
            `;
            container.querySelector('.toast-msg').oninput = (e) => action.toastMessage = e.target.value;
            container.querySelector('.toast-type').onchange = (e) => action.toastType = e.target.value;
            
        } else if (action.type === 'delay') {
            container.innerHTML = `
                <div style="display:flex; gap:8px; align-items:center;">
                    <span style="color:#888; font-size:11px;">Wait</span>
                    <input type="number" class="delay-val kuplafix-options-input" value="${action.delay || 100}" style="width:80px;" min="0">
                    <span style="color:#888; font-size:11px;">ms before next action</span>
                </div>
            `;
            container.querySelector('.delay-val').oninput = (e) => action.delay = parseInt(e.target.value) || 100;
        }
    },

    renderActionArgs(container, action) {
        container.innerHTML = '';
        
        if (!action.args || action.args.length === 0) {
            container.innerHTML = '<div style="color:#5c707a; font-size:10px;">No arguments</div>';
            return;
        }
        
        action.args.forEach((arg, idx) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; gap:4px; align-items:center;';
            row.innerHTML = `
                <select class="arg-type kuplafix-options-input" style="width:70px; font-size:10px;">
                    <option value="String" ${arg.type === 'String' ? 'selected' : ''}>String</option>
                    <option value="Int" ${arg.type === 'Int' ? 'selected' : ''}>Int</option>
                    <option value="Short" ${arg.type === 'Short' ? 'selected' : ''}>Short</option>
                    <option value="Byte" ${arg.type === 'Byte' ? 'selected' : ''}>Byte</option>
                    <option value="Boolean" ${arg.type === 'Boolean' ? 'selected' : ''}>Bool</option>
                </select>
                <input type="text" class="arg-val kuplafix-options-input" value="${arg.value}" placeholder="Value or {{arg0}}" style="flex:1; font-size:10px;">
                <button class="arg-del kuplafix-btn" style="background:#c0392b; padding:1px 5px; font-size:10px;">×</button>
            `;
            
            row.querySelector('.arg-type').onchange = (e) => arg.type = e.target.value;
            row.querySelector('.arg-val').oninput = (e) => arg.value = e.target.value;
            row.querySelector('.arg-del').onclick = () => {
                action.args.splice(idx, 1);
                this.renderActionArgs(container, action);
            };
            
            container.appendChild(row);
        });
    },

    buildTriggerHeaderDropdown(container, macro) {
        container.innerHTML = '';
        
        const direction = macro.trigger.direction;
        const history = direction === 'send' ? PacketManager.outgoingHistory : PacketManager.incomingHistory;
        
        // Get unique packets from history with their parsed args for display
        const uniquePackets = new Map();
        for (const packet of history) {
            if (!uniquePackets.has(packet.header)) {
                const parsedArgs = PacketManager.parsePacket(packet.buffer);
                uniquePackets.set(packet.header, {
                    header: packet.header,
                    name: this.getHeaderName(packet.header, direction),
                    args: parsedArgs,
                    timestamp: packet.timestamp
                });
            }
        }
        
        // Create input with dropdown
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative;';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'macro-trigger-header';
        input.className = 'kuplafix-options-input';
        input.style.cssText = 'width:100%; box-sizing:border-box;';
        
        // Set initial value or placeholder
        if (macro.trigger.header) {
            const name = this.getHeaderName(macro.trigger.header, direction);
            input.value = `[${macro.trigger.header}] ${name}`;
            input.placeholder = 'Click to select different packet or edit...';
        } else {
            input.placeholder = uniquePackets.size > 0 ? 'Select from log or type header ID...' : 'Type header ID (e.g. 4000)...';
        }
        
        const dropdown = document.createElement('div');
        dropdown.className = 'pb-header-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: rgba(12, 18, 22, 0.98);
            border: 1px solid var(--kuplafix-border);
            border-radius: 0 0 6px 6px;
            z-index: 1000;
            display: none;
        `;
        
        // Build dropdown items from logged packets
        if (uniquePackets.size > 0) {
            for (const [headerId, packet] of uniquePackets) {
                const item = document.createElement('div');
                item.style.cssText = `
                    padding: 8px 10px;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    font-size: 11px;
                `;
                
                const argsPreview = packet.args.slice(0, 3).map(a => {
                    const val = String(a.value);
                    return val.length > 15 ? val.substring(0, 15) + '...' : val;
                }).join(', ');
                
                item.innerHTML = `
                    <div style="color:#fff; font-weight:500;">[${headerId}] ${packet.name}</div>
                    <div style="color:#5c707a; font-size:10px; margin-top:2px;">
                        ${packet.args.length} args: ${argsPreview || '(none)'}
                    </div>
                `;
                
                item.onmouseenter = () => item.style.background = 'rgba(23, 111, 143, 0.3)';
                item.onmouseleave = () => item.style.background = 'transparent';
                item.onclick = () => {
                    macro.trigger.header = headerId;
                    macro.trigger.sampleArgs = packet.args; // Store sample args for reference
                    input.value = `[${headerId}] ${packet.name}`;
                    dropdown.style.display = 'none';
                    
                    // Update conditions UI to show available args
                    const condContainer = document.getElementById('macro-conditions');
                    if (condContainer) {
                        this.renderMacroConditions(condContainer, macro);
                    }
                };
                
                dropdown.appendChild(item);
            }
        } else {
            const emptyItem = document.createElement('div');
            emptyItem.style.cssText = 'padding:12px; color:#5c707a; text-align:center; font-size:11px;';
            emptyItem.innerHTML = `
                <div>No packets logged for ${direction === 'send' ? 'Outgoing' : 'Incoming'}</div>
                <div style="margin-top:4px;">Switch to ${direction === 'send' ? 'Out Log' : 'In Log'} tab first to capture packets</div>
            `;
            dropdown.appendChild(emptyItem);
        }
        
        // Events
        input.onfocus = () => dropdown.style.display = 'block';
        input.onblur = () => setTimeout(() => dropdown.style.display = 'none', 150);
        input.oninput = (e) => {
            const val = e.target.value;
            const num = parseInt(val.replace(/\[(\d+)\].*/, '$1'));
            if (!isNaN(num)) {
                macro.trigger.header = num;
            } else {
                // Try to look up by name
                const map = direction === 'send' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
                const found = Object.entries(map).find(([name]) => 
                    name.toLowerCase().includes(val.toLowerCase())
                );
                if (found) macro.trigger.header = found[1];
            }
        };
        
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        container.appendChild(wrapper);
    },

    // ─────────────────────────────────────────────────────────────────
    // Macro Share Dialog
    // ─────────────────────────────────────────────────────────────────
    
    showShareDialog(code, macroName) {
        // Remove existing dialog if any
        const existing = document.getElementById('macro-share-dialog');
        if (existing) existing.remove();
        
        const len = code.length;
        const fitsChat = len <= 100;
        const fitsTrophy = len <= 300;
        
        const dialog = document.createElement('div');
        dialog.id = 'macro-share-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(12, 18, 22, 0.98);
            border: 1px solid var(--kuplafix-border);
            border-radius: 8px;
            padding: 16px;
            z-index: 100002;
            width: 380px;
            max-width: 90vw;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        `;
        
        dialog.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="color:#fff; font-weight:600;">Share: ${macroName}</div>
                <button id="share-close-btn" style="background:none; border:none; color:#888; font-size:18px; cursor:pointer;">✕</button>
            </div>
            <div style="margin-bottom:12px;">
                <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; color:#fff; font-weight:500;">${len} characters</span>
                    <span style="font-size:10px; padding:2px 6px; border-radius:3px; background:${fitsChat ? '#27ae60' : (fitsTrophy ? '#f39c12' : '#c0392b')}; color:#fff;">
                        ${fitsChat ? '✓ Fits chat' : (fitsTrophy ? '✓ Fits trophy' : '✗ Too long')}
                    </span>
                </div>
                <textarea id="share-code-text" readonly style="
                    width: 100%;
                    height: 80px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--kuplafix-border);
                    border-radius: 4px;
                    color: #fff;
                    font-family: monospace;
                    font-size: 11px;
                    padding: 8px;
                    resize: none;
                    box-sizing: border-box;
                ">${code}</textarea>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button id="share-copy-btn" class="kuplafix-btn" style="flex:1; min-width:120px;">📋 Copy to Clipboard</button>
                ${fitsChat ? '<button id="share-send-chat-btn" class="kuplafix-btn" style="flex:1; min-width:100px; background:#27ae60;">💬 Send to Chat</button>' : ''}
                ${fitsTrophy ? '<button id="share-buy-trophy-btn" class="kuplafix-btn" style="flex:1; min-width:100px; background:#8e44ad;">🏆 Buy Trophy</button>' : ''}
            </div>
            <div style="font-size:10px; color:#5c707a; margin-top:10px; line-height:1.4;">
                <strong>How to share:</strong><br>
                • <span style="color:${fitsChat ? '#27ae60' : '#888'};">Chat message</span> - paste in room chat (≤100 chars)<br>
                • <span style="color:${fitsTrophy ? '#27ae60' : '#888'};">Trophy text</span> - paste in trophy description (≤300 chars)<br>
                • Discord/external - any length works
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Events
        dialog.querySelector('#share-close-btn').onclick = () => dialog.remove();
        dialog.querySelector('#share-copy-btn').onclick = () => {
            navigator.clipboard.writeText(code).then(() => {
                UI.showToast('Copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback - select the text
                const textarea = dialog.querySelector('#share-code-text');
                textarea.select();
                document.execCommand('copy');
                UI.showToast('Copied!', 'success');
            });
        };
        // Send to Chat button
        const sendChatBtn = dialog.querySelector('#share-send-chat-btn');
        if (sendChatBtn) {
            sendChatBtn.onclick = () => {
                // Send UNIT_CHAT packet (header 1314) with the macro code
                // Format: String(message), Int(0) for trailing bytes
                PacketManager.send(1314, 
                    PacketManager.types.String(code),
                    PacketManager.types.Int(0)
                );
                UI.showToast('💬 Macro code sent to chat!', 'success');
                dialog.remove();
            };
        }
        
        // Buy Trophy button
        const buyTrophyBtn = dialog.querySelector('#share-buy-trophy-btn');
        if (buyTrophyBtn) {
            buyTrophyBtn.onclick = () => {
                // Send CATALOG_PURCHASE packet for a trophy with the macro code as text
                // Header: 3492, args: Int(pageId), Int(itemId), String(text), Int(amount)
                PacketManager.send(3492, 
                    PacketManager.types.Int(1635463920), // pageId
                    PacketManager.types.Int(283),        // itemId (bronze trophy)
                    PacketManager.types.String(code),    // trophy text (the macro code)
                    PacketManager.types.Int(1)           // amount
                );
                UI.showToast('🏆 Trophy purchase request sent! Check catalog if it fails.', 'info');
                dialog.remove();
            };
        }
        
        // Close on outside click
        const closeOnOutside = (e) => {
            if (!dialog.contains(e.target)) {
                dialog.remove();
                document.removeEventListener('mousedown', closeOnOutside);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closeOnOutside), 100);
    },

    // ─────────────────────────────────────────────────────────────────
    // Macro Encoding/Decoding for Sharing
    // Format v2: KFM2:<base64> - Ultra compact array-based format
    // [name, triggerDir, triggerHeader, [[condIdx,condOp,condVal]...], [[actType,actData...]...]]
    // ─────────────────────────────────────────────────────────────────
    
    encodeMacro(macro) {
        try {
            const typeMap = { 'String': 0, 'Int': 1, 'Short': 2, 'Byte': 3, 'Boolean': 4 };
            const opMap = { 'eq': 0, 'neq': 1, 'gt': 2, 'gte': 3, 'lt': 4, 'lte': 5, 'contains': 6 };
            
            // Ultra compact array format
            // [name, dir(0/1), header, conditions[], actions[]]
            const conditions = (macro.trigger.conditions || []).map(c => 
                [parseInt(c.argIndex), opMap[c.operator] || 0, c.value]
            );
            
            const actions = (macro.actions || []).map(act => {
                if (act.type === 'send' || act.type === 'inject') {
                    // [type(0/1), header, [[argType, argVal]...], showToast?, toastMsg?]
                    const args = (act.args || []).map(a => [typeMap[a.type] || 0, a.value]);
                    const arr = [act.type === 'send' ? 0 : 1, act.header, args];
                    if (act.showToast) arr.push(1, act.toastMessage || '');
                    return arr;
                } else if (act.type === 'toast') {
                    // [2, message, type(0=info,1=success,2=error)]
                    return [2, act.toastMessage || '', act.toastType === 'success' ? 1 : (act.toastType === 'error' ? 2 : 0)];
                } else if (act.type === 'delay') {
                    // [3, ms]
                    return [3, act.delay || 100];
                }
                return [0, 0, []];
            });
            
            const compact = [
                macro.name.substring(0, 32), // Name limit for share code size
                macro.trigger.direction === 'send' ? 1 : 0,
                macro.trigger.header,
                conditions,
                actions
            ];
            
            const json = JSON.stringify(compact);
            const base64 = btoa(unescape(encodeURIComponent(json)));
            return 'KFM2:' + base64;
        } catch (e) {
            log.error('Failed to encode macro', e);
            return null;
        }
    },
    
    decodeMacro(code) {
        try {
            // Support both v1 (KFM1) and v2 (KFM2) formats
            if (code.startsWith('KFM1:')) {
                return this.decodeMacroV1(code);
            }
            
            if (!code.startsWith('KFM2:')) {
                return null;
            }
            
            const base64 = code.substring(5);
            const json = decodeURIComponent(escape(atob(base64)));
            const [name, dir, header, conditions, actions] = JSON.parse(json);
            
            const typeMapRev = ['String', 'Int', 'Short', 'Byte', 'Boolean'];
            const opMapRev = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains'];
            
            const macro = {
                name: name || 'Imported Macro',
                enabled: true,
                trigger: {
                    direction: dir === 1 ? 'send' : 'receive',
                    header: header || 0,
                    conditions: (conditions || []).map(([i, o, v]) => ({
                        argIndex: String(i),
                        operator: opMapRev[o] || 'eq',
                        value: v || ''
                    }))
                },
                actions: (actions || []).map(arr => {
                    const type = arr[0];
                    if (type === 0 || type === 1) {
                        // send/inject
                        return {
                            type: type === 0 ? 'send' : 'inject',
                            header: arr[1] || 0,
                            args: (arr[2] || []).map(([t, v]) => ({
                                type: typeMapRev[t] || 'String',
                                value: v || ''
                            })),
                            showToast: arr[3] === 1,
                            toastMessage: arr[4] || ''
                        };
                    } else if (type === 2) {
                        // toast
                        return {
                            type: 'toast',
                            toastMessage: arr[1] || '',
                            toastType: arr[2] === 1 ? 'success' : (arr[2] === 2 ? 'error' : 'info')
                        };
                    } else if (type === 3) {
                        // delay
                        return { type: 'delay', delay: arr[1] || 100 };
                    }
                    return { type: 'delay', delay: 100 };
                })
            };
            
            return macro;
        } catch (e) {
            log.error('Failed to decode macro', e);
            return null;
        }
    },
    
    // Legacy v1 decoder for backward compatibility
    decodeMacroV1(code) {
        try {
            const base64 = code.substring(5);
            const json = decodeURIComponent(escape(atob(base64)));
            const compact = JSON.parse(json);
            
            const typeMapRev = ['String', 'Int', 'Short', 'Byte', 'Boolean'];
            const opMapRev = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains'];
            const actTypeMapRev = ['send', 'inject', 'toast', 'delay'];
            
            return {
                name: compact.n || 'Imported Macro',
                enabled: true,
                trigger: {
                    direction: compact.t.d === 1 ? 'send' : 'receive',
                    header: compact.t.h || 0,
                    conditions: (compact.t.c || []).map(c => ({
                        argIndex: String(c.i),
                        operator: opMapRev[c.o] || 'eq',
                        value: c.v || ''
                    }))
                },
                actions: (compact.a || []).map(a => {
                    const act = { type: actTypeMapRev[a.t] || 'send' };
                    if (act.type === 'send' || act.type === 'inject') {
                        act.header = a.h || 0;
                        act.args = (a.r || []).map(arg => ({
                            type: typeMapRev[arg.t] || 'String',
                            value: arg.v || ''
                        }));
                        act.showToast = !!a.s;
                        act.toastMessage = a.m || '';
                    } else if (act.type === 'toast') {
                        act.toastMessage = a.m || '';
                        act.toastType = a.y === 1 ? 'success' : (a.y === 2 ? 'error' : 'info');
                    } else if (act.type === 'delay') {
                        act.delay = a.l || 100;
                    }
                    return act;
                })
            };
        } catch (e) {
            log.error('Failed to decode v1 macro', e);
            return null;
        }
    },

    getHeaderName(headerId, direction) {
        const map = direction === 'send' ? PacketManager.HEADERS.OUTGOING : PacketManager.HEADERS.INCOMING;
        for (const [name, id] of Object.entries(map)) {
            if (id === headerId) return name;
        }
        return 'Unknown';
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // FastLoad - Preconnect & Preload for faster loading
  // ─────────────────────────────────────────────────────────────────
  // Based on HAR traffic analysis from kuplahotelli.com
  // Key insight: Assets are served from https://kuplahotelli.com/nitro-assets/
  const FastLoad = {
    _initialized: false,
    _cache: new Map(),
    
    // Asset base URL (from HAR: https://kuplahotelli.com/nitro-assets/)
    // Note: The game uses a double slash in many places, e.g., /nitro-assets//gamedata/
    ASSET_BASE: 'https://kuplahotelli.com/nitro-assets/',
    
    // Called IMMEDIATELY on script load (before config)
    earlyInit() {
      if (this._initialized) return;
      this._initialized = true;
      
      this.injectHints();
      this.preloadGamedata();
    },

    injectHints() {
      const origins = [
        'https://kuplahotelli.com',
        'https://kupla.hanarchy.net' // Web Socket domain
      ];
      origins.forEach(origin => {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
        
        const dns = document.createElement('link');
        dns.rel = 'dns-prefetch';
        dns.href = origin;
        document.head.appendChild(dns);
      });
    },

    async preloadGamedata() {
      // Critical JSON files
      const jsonFiles = [
        '/gamedata/FurnitureData.json',    // 26MB
        '/gamedata/FigureDataISO.json',   // 16MB
        '/gamedata/ProductData.json',      // 3.8MB
        '/gamedata/ExternalTexts.json',
        '/gamedata/UITexts.json',
        '/gamedata/FigureMapISO.json',
        '/gamedata/EffectMap.json',
        '/gamedata/HabboAvatarActions.json'
      ];
      
      const nitroAssets = [
        '/bundled/generic/place_holder.nitro',
        '/bundled/generic/room.nitro',
        '/bundled/generic/tile_cursor.nitro',
        '/bundled/generic/selection_arrow.nitro',
        '/bundled/generic/place_holder_wall.nitro',
        '/bundled/generic/place_holder_pet.nitro',
        '/bundled/generic/avatar_additions.nitro',
        '/bundled/generic/group_badge.nitro',
        '/bundled/generic/floor_editor.nitro',
        '/bundled/figure2/hh_human_body.nitro',
        '/bundled/figure2/hh_human_50_body.nitro',
        '/bundled/figure2/hh_human_item.nitro',
        '/bundled/effect/Dance1.nitro',
        '/bundled/effect/Dance2.nitro',
        '/bundled/effect/Dance3.nitro',
        '/bundled/effect/Dance4.nitro'
      ];

      const all = [...jsonFiles, ...nitroAssets];
      log.info(`[kuplafix] FastLoad: Starting Cache-Forwarding for ${all.length} assets`);

      all.forEach(file => {
        const url = `${this.ASSET_BASE}${file}`;
        const promise = fetch(url).then(async resp => {
          if (!resp.ok) throw new Error(`Status ${resp.status}`);
          const blob = await resp.blob();
          return {
            blob,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          };
        }).catch(err => {
          log.warn(`[kuplafix] FastLoad: Failed early fetch ${file}:`, err);
          return null;
        });
        this._cache.set(url, promise);
      });
    },

    // Try to get a response from our early cache
    async getCachedResponse(url) {
      const baseUrl = url.split('?')[0];
      const cached = this._cache.get(baseUrl);
      if (!cached) return null;

      try {
        const data = await cached;
        if (!data) return null;
        
        log.info(`[kuplafix] FastLoad: HIT early cache for ${baseUrl}`);

        // Strip encoding headers since the blob is already decompressed
        const headers = new Headers(data.headers);
        headers.delete('content-encoding');
        headers.delete('content-length');

        return new Response(data.blob, {
          status: data.status,
          statusText: data.statusText,
          headers: headers
        });
      } catch (e) {
        return null;
      }
    },
    
    // Returns config overrides
    getConfigOverrides() {
      return {};
    }
  };
  
  // Run FastLoad IMMEDIATELY (before everything else)
  FastLoad.earlyInit();

  // ─────────────────────────────────────────────────────────────────
  // Renderer Config Hijacker
  // ─────────────────────────────────────────────────────────────────
  const ConfigHijacker = {
    _initialized: false,
    async init() {
      if (this._initialized) return;
      this._initialized = true;
      
      log.debug('ConfigHijacker.init()');
      // Don't return early - we need to hijack for fastLoadEnabled OR rendererConfigHijackEnabled
      if (!config.get('rendererConfigHijackEnabled') && !config.get('fastLoadEnabled')) return;

      this.apply(window);
      
      // Also watch for iframes
      DOM.onNitroIframeDocReady((iframeDoc) => {
        const win = iframeDoc.defaultView;
        if (win) this.apply(win);
      });
    },

    apply(win) {
      if (!win || win.__kuplafix_hijacked) return;
      win.__kuplafix_hijacked = true;

      log.info('Applying renderer-config hijacker to window');

      const originalFetch = win.fetch;
      win.fetch = async (...args) => {
        let url = '';
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] instanceof URL) url = args[0].href;
        else if (args[0] && args[0].url) url = args[0].url;
        else if (args[0] && typeof args[0] === 'object' && args[0].toString().includes('Request')) url = args[0].url;
        
        const isRenderer = url && url.includes('renderer-config.json');
        const isUI = url && url.includes('ui-config.json');

        if (isRenderer || isUI) {
          const type = isRenderer ? 'renderer-config.json' : 'ui-config.json';
          const configKey = isRenderer ? 'rendererConfigOverrides' : 'uiConfigOverrides';
          
          log.info(`Hijacking ${type} fetch:`, url);
          try {
            const response = await originalFetch(...args);
            const data = await response.json();
            
            // Apply FastLoad overrides first (if enabled and this is renderer-config)
            if (isRenderer && config.get('fastLoadEnabled')) {
              const fastLoadOverrides = FastLoad.getConfigOverrides();
              for (const [key, value] of Object.entries(fastLoadOverrides)) {
                data[key] = value;
              }
              log.info('Applied FastLoad config overrides');
            }
            
            // Then apply user overrides (can override FastLoad settings)
            const overrides = config.get(configKey) || {};
            let changed = false;
            for (const [key, value] of Object.entries(overrides)) {
              data[key] = value;
              changed = true;
            }

            if (changed) {
              log.info(`Applied user overrides to ${type}`);
            }

            const modifiedResponse = new Response(JSON.stringify(data), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
            
            // Proxy the response to ensure .json() works if called again
            return modifiedResponse;
          } catch (err) {
            log.error(`Failed to hijack ${type}:`, err);
          }
        }
        return originalFetch(...args);
      };

      // Also handle XHR for older client versions
      const originalOpen = win.XMLHttpRequest.prototype.open;
      win.XMLHttpRequest.prototype.open = function(method, url) {
        this._url = (url instanceof URL) ? url.href : url;
        return originalOpen.apply(this, arguments);
      };

      const originalSend = win.XMLHttpRequest.prototype.send;
      win.XMLHttpRequest.prototype.send = function() {
        const url = this._url;
        const isRenderer = url && typeof url === 'string' && url.includes('renderer-config.json');
        const isUI = url && typeof url === 'string' && url.includes('ui-config.json');

        if (isRenderer || isUI) {
          const type = isRenderer ? 'renderer-config.json' : 'ui-config.json';
          const configKey = isRenderer ? 'rendererConfigOverrides' : 'uiConfigOverrides';

          log.info(`Hijacking ${type} XHR:`, url);
          
          const originalOnReadyStateChange = this.onreadystatechange;
          this.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              try {
                const data = JSON.parse(this.responseText);
                
                // Apply FastLoad overrides first (if enabled and this is renderer-config)
                if (isRenderer && config.get('fastLoadEnabled')) {
                  const fastLoadOverrides = FastLoad.getConfigOverrides();
                  for (const [key, value] of Object.entries(fastLoadOverrides)) {
                    data[key] = value;
                  }
                  log.info('Applied FastLoad config overrides (XHR)');
                }
                
                // Then apply user overrides
                const overrides = config.get(configKey) || {};
                let changed = false;
                for (const [key, value] of Object.entries(overrides)) {
                  data[key] = value;
                  changed = true;
                }
                if (changed) {
                  log.info(`Applied user overrides to ${type} (XHR)`);
                }
                
                // Always update if FastLoad is enabled or user overrides exist
                if ((isRenderer && config.get('fastLoadEnabled')) || changed) {
                  // Use Object.defineProperty to override read-only properties
                  Object.defineProperty(this, 'responseText', { value: JSON.stringify(data), configurable: true });
                  Object.defineProperty(this, 'response', { value: JSON.stringify(data), configurable: true });
                }
              } catch (err) {
                log.error(`Failed to hijack ${type} XHR response:`, err);
              }
            }
            if (originalOnReadyStateChange) originalOnReadyStateChange.apply(this, arguments);
          };
        }
        return originalSend.apply(this, arguments);
      };
    }
  };

  // Module: Event Invite Blocker
  // Blocks the intrusive event invite popup and shows a compact notification instead
  const EventInviteBlocker = {
    initialized: false,
    observer: null,
    iframeHookRegistered: false,
    
    async init() {
      // Register iframe hook only once
      if (!this.iframeHookRegistered) {
        this.iframeHookRegistered = true;
        DOM.onNitroIframeDocReady(async () => {
          log.debug('EventInviteBlocker: re-initializing on iframe ready');
          this.initialized = false;
          await this.init();
        });
      }

      if (this.initialized) return;
      
      // Wait for the draggable windows container
      let container = null;
      try {
        container = await DOM.waitFor('#draggable-windows-container', 5000);
      } catch (e) {
        log.debug('EventInviteBlocker: draggable-windows-container not found');
        return;
      }
      
      this.setupObserver(container);
      this.initialized = true;
      log.debug('EventInviteBlocker initialized');
    },
    
    setupObserver(container) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check for event invite popup (nitro-alert-hotel.event)
                const eventAlert = node.querySelector?.('.nitro-alert-hotel\\.event') || 
                                   (node.classList?.contains('nitro-alert-hotel.event') ? node : null);
                
                if (eventAlert) {
                  this.handleEventInvite(node, eventAlert);
                }
              }
            });
          }
        });
      });
      
      this.observer.observe(container, {
        childList: true,
        subtree: true
      });
    },
    
    handleEventInvite(wrapper, alertElement) {
      log.debug('[EventInvite] Detected event invite popup');
      
      // Extract event info
      const headerText = alertElement.querySelector('.nitro-card-header-text')?.textContent || 'Tapahtumakutsu';
      const contentText = alertElement.querySelector('.notification-text span')?.textContent || 'Sinut on kutsuttu tapahtumaan!';
      const buttonEl = alertElement.querySelector('.btn-primary');
      const buttonText = buttonEl?.textContent || 'Siirry';
      const eventImage = alertElement.querySelector('.content-area img')?.src;
      
      // Extract room navigation from button click (if available)
      let navigateAction = null;
      if (buttonEl) {
        // Clone the button's click behavior
        navigateAction = () => {
          buttonEl.click();
        };
      }
      
      // Hide the original popup
      wrapper.style.display = 'none';
      
      // Create compact notification
      this.createNotification(headerText, contentText, buttonText, eventImage, navigateAction, wrapper);
    },
    
    createNotification(title, text, buttonText, imageUrl, navigateAction, originalWrapper) {
      // Get the clone container from BubbleAlerts
      const container = BubbleAlerts.ensureCloneContainer();
      if (!container) {
        log.warn('[EventInvite] Could not get notification container');
        return;
      }
      
      const animWrapper = document.createElement('div');
      animWrapper.className = 'animate__animated';
      
      const notification = document.createElement('div');
      notification.className = 'kuplafix-event-notification';
      notification.dataset.kuplafixEventInvite = 'true';
      
      // Event icon/image
      if (imageUrl) {
        const icon = document.createElement('img');
        icon.className = 'kuplafix-event-notification-icon';
        icon.src = imageUrl;
        icon.alt = title;
        notification.appendChild(icon);
      } else {
        // Default icon
        const icon = document.createElement('div');
        icon.className = 'kuplafix-event-notification-icon';
        icon.innerHTML = '🎉';
        icon.style.fontSize = '24px';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        notification.appendChild(icon);
      }
      
      // Content
      const content = document.createElement('div');
      content.className = 'kuplafix-event-notification-content';
      
      const titleEl = document.createElement('div');
      titleEl.className = 'kuplafix-event-notification-title';
      titleEl.textContent = title;
      content.appendChild(titleEl);
      
      const textEl = document.createElement('div');
      textEl.className = 'kuplafix-event-notification-text';
      textEl.textContent = text;
      content.appendChild(textEl);
      
      notification.appendChild(content);
      
      // Action button
      if (buttonText && navigateAction) {
        const button = document.createElement('button');
        button.className = 'kuplafix-event-notification-button';
        button.textContent = buttonText;
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          navigateAction();
          // Remove notification after clicking
          animWrapper.style.transition = 'opacity 0.3s ease-out';
          animWrapper.style.opacity = '0';
          setTimeout(() => animWrapper.remove(), 300);
        });
        notification.appendChild(button);
      }
      
      // Click to dismiss (on the notification itself, not the button)
      notification.addEventListener('click', (e) => {
        if (e.target.closest('.kuplafix-event-notification-button')) return;
        animWrapper.style.transition = 'opacity 0.3s ease-out';
        animWrapper.style.opacity = '0';
        setTimeout(() => {
          animWrapper.remove();
          // Also close the original (hidden) popup
          if (originalWrapper) {
            const closeBtn = originalWrapper.querySelector('.nitro-card-header-close');
            if (closeBtn) closeBtn.click();
          }
        }, 300);
      });
      
      animWrapper.appendChild(notification);
      container.appendChild(animWrapper);
      
      log.debug('[EventInvite] Created compact notification');
    },
    
    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.initialized = false;
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // In-Game Browser
  // ─────────────────────────────────────────────────────────────────
  const Browser = {
    window: null,
    iframe: null,
    isOpen: false,
    lastPosition: null,
    button: null,

    async init() {
      log.debug('Browser.init()');
      await DOM.ready;
      
      if (config.get('browserEnabled')) {
        this.addButton();
      }

      // Re-add button if iframe reloads
      DOM.onNitroIframeDocReady(() => {
        if (config.get('browserEnabled')) {
          this.addButton();
        }
      });
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    addButton() {
      // Use DOM helper to find existing config button container
      const configContainer = DOM.querySelector('#kuplafix-config-btn-container');
      if (!configContainer) {
        log.debug('Browser: config container not found, retrying...');
        setTimeout(() => this.addButton(), 500);
        return;
      }

      if (this.button && this.button.isConnected) return;
      
      const doc = configContainer.ownerDocument;
      if (doc.getElementById('kuplafix-browser-btn-container')) return;

      const btn = doc.createElement('div');
      btn.id = 'kuplafix-browser-btn';
      btn.className = 'cursor-pointer navigation-item icon icon-house nitro-toolbar-icon nitro-space-right sidebar-navigation-icon';
      
      btn.style.width = '32px';
      btn.style.height = '32px';
      btn.style.margin = '0 auto';
      btn.style.display = 'block';
      btn.style.cursor = 'pointer';
      btn.title = 'Kupla Etusivu';
      
      btn.addEventListener('mouseenter', () => (btn.style.opacity = '0.7'));
      btn.addEventListener('mouseleave', () => (btn.style.opacity = '1'));
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });

      const labelRow = doc.createElement('div');
      labelRow.className = 'w-100 text-center';
      labelRow.style.marginTop = '5px';
      
      const label = doc.createElement('div');
      label.className = 'd-inline text-white fw-bold text-center nitro-small-size-text';
      label.textContent = 'Etusivu';
      labelRow.appendChild(label);

      const wrapper = doc.createElement('div');
      wrapper.id = 'kuplafix-browser-btn-container';
      wrapper.className = 'text-center mb-4';
      wrapper.appendChild(btn);
      wrapper.appendChild(labelRow);

      // Try to insert after LiveKit button, otherwise after Config button
      const livekitContainer = doc.getElementById('kuplafix-livekit-btn-container');
      const target = livekitContainer || configContainer;
      
      if (target && target.parentNode) {
        target.parentNode.insertBefore(wrapper, target.nextSibling);
        log.info('✓ Browser button added to sidebar');
      } else {
        log.error('Browser: failed to find insertion point');
      }
      
      this.button = btn;
    },

    removeButton() {
      const wrapper = DOM.querySelector('#kuplafix-browser-btn-container');
      if (wrapper) {
        wrapper.remove();
        this.button = null;
      }
    },

    handleClick(e) {
        // Disabled
    },

    open(url) {
        if (!this.window) {
            this.createWindow();
        }
        
        // If url is provided, navigate
        if (url) {
            this.iframe.src = url;
        } else if (!this.iframe.src || this.iframe.src === 'about:blank') {
             this.iframe.src = 'https://kuplahotelli.com';
        }

        this.window.style.display = 'flex';
        this.isOpen = true;
    },

    close() {
        if (this.window) {
            this.window.style.display = 'none';
            this.isOpen = false;
            this.iframe.src = 'about:blank';
        }
    },

    closeWindow() {
        this.close();
    },

    createWindow() {
        const win = document.createElement('div');
        win.className = 'kuplafix-browser';
        
        const pos = this.lastPosition || { top: '50px', left: '50px' };
        win.style.top = pos.top;
        win.style.left = pos.left;

        win.innerHTML = `
            <div class="kuplafix-browser-header">
                <span class="kuplafix-browser-title">kuplahotelli.com</span>
                <div style="display:flex; gap:8px;">
                     <button class="kuplafix-btn-secondary" style="padding:2px 8px;" id="kb-popout" title="Avaa uudessa välilehdessä">↗</button>
                    <button class="kuplafix-btn-secondary" style="padding:2px 8px;" id="kb-home">⌂</button>
                    <button class="kuplafix-close-btn" style="position:static;" id="kb-close">✕</button>
                </div>
            </div>
            <div class="kuplafix-browser-content">
                <iframe src="about:blank" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>
            </div>
        `;

        // Append to main doc or where convenient. 
        // If using iframe context, careful with context. 
        // For simple overlay, document.body is fine.
        document.body.appendChild(win);
        this.window = win;
        this.iframe = win.querySelector('iframe');

        // Handle scrollbar injection for same-origin pages
        this.iframe.onload = () => {
            try {
                const doc = this.iframe.contentDocument;
                if (doc) {
                    const style = doc.createElement('style');
                    style.textContent = `
                        ::-webkit-scrollbar { width: 8px; height: 8px; }
                        ::-webkit-scrollbar-track { background: #0c1216; }
                        ::-webkit-scrollbar-thumb { background: #364951; border-radius: 4px; }
                        ::-webkit-scrollbar-thumb:hover { background: #7cb1c8; }
                        body { background-color: #1a2429; color: #fff; } /* Dark default */
                    `;
                    doc.head.appendChild(style);
                }
            } catch (e) {
                // Cross-origin, cannot access contentDocument
            }
        };

        // Event listeners
        win.querySelector('#kb-close').onclick = () => this.close();
        win.querySelector('#kb-home').onclick = () => {
            this.iframe.src = 'https://kuplahotelli.com';
        };
        win.querySelector('#kb-popout').onclick = () => {
             if (this.iframe && this.iframe.src) {
                 window.open(this.iframe.src, '_blank');
             }
        };

        // Make draggable
        const header = win.querySelector('.kuplafix-browser-header');
        this.makeDraggable(win, header);
    },

    makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            // Remove transform if any to switch to top/left positioning
            element.style.transform = 'none';
            element.style.left = initialLeft + 'px';
            element.style.top = initialTop + 'px';
            
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
                
                // Save position
                this.lastPosition = {
                    top: element.style.top,
                    left: element.style.left
                };
            }
        });
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Initialization sequence
  // ─────────────────────────────────────────────────────────────────
  const FEATURE_MODULES = [
    Styles,
    UI,
    ChatHistoryUI,
    ChatEnhancements,
    ChatInputObserver,
    GifBlocker,
    RoomLighting,
    BubbleAlerts,
    UpdateChecker,
    LiveKit,
    ChatHistoryCache,
    EventInviteBlocker,
    VoiceMessages,
    ConfigHijacker,
    PacketManager,
    Browser
  ];

  async function startFeatureModules() {
    for (const module of FEATURE_MODULES) {
      if (typeof module?.init === 'function') {
        try {
          await module.init();
        } catch (err) {
          log.error(`Failed to initialize module:`, err);
        }
      }
    }
  }

  async function initialize() {
    try {
      log.info(`Initializing v${SCRIPT_VERSION}...`);

      // config.load() is now called immediately at the bottom
      await startFeatureModules();

      log.info('✓ All modules initialized successfully');
    } catch (err) {
      log.error('Initialization failed:', err);
    }
  }

  // Start initialization
  config.load();
  
  // Immediate hijacking for renderer-config (must be before client loads)
  // Also init if fastLoadEnabled is true (for config overrides)
  if (config.get('rendererConfigHijackEnabled') || config.get('fastLoadEnabled')) {
    ConfigHijacker.init();
  }

  // Immediate hijacking for WebSocket (must be before client loads)
  PacketManager.init();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }



  // Export to window for debugging
  if (typeof window !== 'undefined') {
    const targetWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    targetWindow.kuplafix = {
      version: SCRIPT_VERSION,
      config,
      log,
      ui: UI,
      openMenu: () => UI.openMenu(),
      reload: () => location.reload(),
      chat: ChatEnhancements,
      alerts: BubbleAlerts,
      chatCache: ChatHistoryCache,
      chatUI: ChatHistoryUI,
      packets: PacketManager,
      browser: Browser,
      builder: PacketBuilder,
      fastLoad: FastLoad,
      // Test helpers for update checker
      testUpdateNotification: (version) => {
        try {
          GM_setValue('kuplafix_latest_version', version);
          GM_setValue('kuplafix_pending_update', version);
          if (UpdateChecker) {
            UpdateChecker.latestVersion = version;
            UpdateChecker.showBadge(version);
            UpdateChecker.updateMenuHeaderLink(version);
          }
          log.info(`Test: Update notification set for version ${version}`);
        } catch (e) {
          console.error('Test update notification error:', e);
        }
      },
      clearUpdateCache: () => {
        try {
          GM_deleteValue('kuplafix_latest_version');
          GM_deleteValue('kuplafix_pending_update');
          GM_deleteValue('kuplafix_last_update_check');
          GM_deleteValue('kuplafix_update_notification_shown');
          log.info('Test: Update cache cleared');
        } catch (e) {
          console.error('Clear cache error:', e);
        }
      },
      checkUpdatesNow: () => {
        try {
          // Reset the last check time to force immediate check
          GM_deleteValue('kuplafix_last_update_check');
          if (UpdateChecker && UpdateChecker.checkForUpdates) {
            UpdateChecker.checkForUpdates();
            log.info('Test: Update check triggered');
          }
        } catch (e) {
          console.error('Check updates now error:', e);
        }
      },
    };
    log.debug('✓ kuplafix window object exported to unsafeWindow');
  }
})();