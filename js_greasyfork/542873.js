// ==UserScript==
// @name         kuplafix
// @namespace    kuplafix
// @version      2.0.9
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
  const SCRIPT_VERSION = '2.0.9';
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
    livekitEnabled: true,
    livekitTokenEndpoint: 'https://kuplafix-livekit-auth.kuplafix.workers.dev/', // URL to Cloudflare Worker
    voiceMessagesEnabled: true,
    voiceHideRecordButton: false,
    voiceMessageCharLimit: 100,
    voiceMessageMaxDurationMs: 4000,
    voiceMessageSampleRate: 8000,
    voiceMessageUploadUrl: 'https://kuplafix-voice-worker.kuplafix.workers.dev/upload',
    chatHistoryCacheEnabled: true,
    chatHistoryCacheSize: 1000,
    chatHistoryCacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    roomLightingEnabled: true,
    roomBrightness: 1,
    roomTemperature: 0, // 0-100 yövalo (päivänvalo lämmin) aste
    featureOrder: ['online-count', 'gif-blocker', 'bubble-alerts', 'room-lighting', 'livekit', 'chat-history', 'voice-messages'],
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

        .kuplafix-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--kuplafix-bg);
          border: 1px solid var(--kuplafix-border);
          border-radius: 8px;
          color: white;
          padding: 18px;
          width: 92%;
          max-width: 440px;
          z-index: 99999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          max-height: 80vh;
          overflow-y: scroll;
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
          top: 8px;
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
        }

        @keyframes kuplafix-popup-appear {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
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
      if (pendingUpdate && SCRIPT_VERSION !== pendingUpdate) {
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
      };

      // Generate HTML based on order
      let featureOrder = config.get('featureOrder') || ['online-count', 'gif-blocker', 'bubble-alerts', 'room-lighting', 'livekit', 'chat-history'];
      
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
              <label class="kuplafix-toggle" title="Ota ominaisuus käyttöön tai pois">
                <input type="checkbox" id="${f.toggleId}" ${isEnabled ? 'checked' : ''}>
                <span class="kuplafix-toggle-slider"></span>
              </label>
              <button class="kuplafix-minimize-btn" title="${isCollapsed ? 'Laajenna' : 'Pienennä'}">▼</button>
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

        <div class="kuplafix-menu-footer">
          <button class="kuplafix-btn" id="kuplafix-reset-btn" style="width: 100%; background: #7f8c8d; cursor: pointer;">Palauta oletukset</button>
        </div>
      `;

      (targetDoc.body || targetDoc.documentElement).appendChild(menu);
      this.configMenu = menu;
      log.info('✓ Config menu opened');

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

      const onlineCount = menu.querySelector('#kf-online-count');
      if (onlineCount) {
        onlineCount.addEventListener('change', (e) => {
          config.set('onlineCountEnabled', e.target.checked);
          ChatEnhancements.refreshState(true);
        });
      }

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

      const gifBlockerToggle = menu.querySelector('#kf-gif-blocker');
      if (gifBlockerToggle) {
        gifBlockerToggle.addEventListener('change', (e) => {
          GifBlocker.toggleFeature(e.target.checked);
        });
      }

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

      if (roomLightingToggle) {
        roomLightingToggle.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          config.set('roomLightingEnabled', enabled);
          if (enabled) {
            RoomLighting.refresh();
          } else {
            RoomLighting.clear();
          }
        });
      }

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
      const bubbleAlertsToggle = menu.querySelector('#kf-bubble-alerts');
      if (bubbleAlertsToggle) {
        bubbleAlertsToggle.addEventListener('change', (e) => {
          config.set('bubbleAlertsEnabled', e.target.checked);
          BubbleAlerts.init();
        });
      }

      // LiveKit handler
      const livekitToggle = menu.querySelector('#kf-livekit');
      if (livekitToggle) {
        livekitToggle.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          config.set('livekitEnabled', enabled);
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
      }

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
          alert('LiveKit-tokenin päätepiste tallennettu.');
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
      const chatHistoryToggle = menu.querySelector('#kf-chat-history');
      if (chatHistoryToggle) {
        chatHistoryToggle.addEventListener('change', (e) => {
          config.set('chatHistoryCacheEnabled', e.target.checked);
          if (e.target.checked) {
            ChatHistoryCache.init();
            ChatHistoryUI.init();
          }
        });
      }

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
        });
      }
      
      if (chatClearBtn) {
        chatClearBtn.addEventListener('click', () => {
          if (confirm('Haluatko varmasti tyhjentää viestihistorian välimuistin?')) {
            ChatHistoryCache.clearCache();
            alert('Välimuisti tyhjennetty.');
          }
        });
      }

      // Voice messages toggle
      const voiceToggle = menu.querySelector('#kf-voice-messages');
      if (voiceToggle) {
        voiceToggle.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          config.set('voiceMessagesEnabled', enabled);
          if (enabled) {
            VoiceMessages.init();
          } else {
            VoiceMessages.teardown?.();
          }
        });
      }

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
        });
      }
      
      log.debug('Config menu event handlers attached');
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
      this.refresh();
      this.setupObservers();

      DOM.onNitroIframeDocReady(() => {
        log.debug('RoomLighting: reapplying filters on iframe ready');
        this.refresh();
        this.setupObservers();
      });
    },

    getDocs() {
      const docs = [];
      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc) docs.push(iframeDoc);
      docs.push(document);
      return docs;
    },

    setupObservers() {
      this.teardown();
      this.getDocs().forEach((docRef) => {
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
      });
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
        const clickHandler = () => {
          this.removeClone(cloneId);
        };
        clonedBubble.addEventListener('click', clickHandler, { once: true });
        
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
      this.startObserving();

      // The chat widget is inside the Nitro iframe; re-check and ensure observers attach after iframe loads/reloads.
      DOM.onNitroIframeDocReady(() => {
        try {
          this.startObserving();
          this.checkWidget();
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

    async startObserving() {
      this.checkWidget();

      const schedule = () => {
        if (this._widgetDebounceHandle) return;
        this._widgetDebounceHandle = setTimeout(() => {
          this._widgetDebounceHandle = null;
          this.checkWidget();
        }, 250);
      };

      if (!this._widgetObserver) {
        this._widgetObserver = new MutationObserver(() => schedule());
      }
      try {
        this._widgetObserver.observe(document.body || document.documentElement, {
          childList: true,
          subtree: true,
          attributes: false,
        });
      } catch (_) {}

      const iframeDoc = DOM.getIframeDoc();
      if (iframeDoc?.body) {
        try {
          this._widgetObserver.observe(iframeDoc.body, {
            childList: true,
            subtree: true,
            attributes: false,
          });
        } catch (_) {}
      }
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
          }
        } catch (e) {
          log.warn('Error processing bubble:', e);
        }
      }, 50);
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
    wasCancelled: false,
    countdownHandle: null,
    recordingTimeout: null,
    countdownEndsAt: 0,
    observers: new Map(),
    monitoredDocs: new Set(),

    removeFabFromDoc(docRef = document) {
      const doc = docRef || document;
      const selector = doc.getElementById('kuplafix-voice-selector');
      const holder = selector?.closest?.('.kuplafix-voice-holder');
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
          if (this.fabWrapper?.isConnected) this.fabWrapper.remove();
          const wrapper = doc.createElement('div');
          wrapper.className = 'cursor-pointer kuplafix-voice-holder';
          wrapper.appendChild(existing);
          this.insertWrapper(container, wrapper);
          this.fabWrapper = wrapper;
        }
        return;
      }

      const btn = doc.createElement('button');
      btn.id = 'kuplafix-voice-selector';
      btn.className = 'kuplafix-voice-selector';
      btn.type = 'button';
      btn.title = 'Pidä pohjassa nauhoittaaksesi (max 4s / 100 merkkiä)';

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
        if (!this.isRecording) {
          this.startRecording();
        }
      };

      const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.isRecording) {
          this.stopRecording();
        }
      };

      btn.addEventListener('mousedown', start);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('mouseleave', () => this.cancelRecording());
      btn.addEventListener('touchend', stop);
      btn.addEventListener('touchcancel', () => this.cancelRecording());
      btn.addEventListener('click', (e) => e.preventDefault());

      if (container) {
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
        alert('Mikrofonia ei voitu käyttää (getUserMedia ei tuettu).');
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
        alert('Äänitys epäonnistui. Tarkista mikrofonin käyttöoikeudet.');
        this.isRecording = false;
        this.setFabState('idle');
        this.clearCountdown();
      }
    },

    stopRecording(force = false) {
      if (!this.mediaRecorder) return;
      this.isRecording = false;
      
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

        alert('Ääniviestiä ei voitu lähettää (upload epäonnistui).');
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

      config.load();

      await startFeatureModules();

      log.info('✓ All modules initialized successfully');
    } catch (err) {
      log.error('Initialization failed:', err);
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }



  // Export to window for debugging
  if (typeof window !== 'undefined') {
    window.kuplafix = {
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
      // Test helpers for update checker
      testUpdateNotification: (version) => {
        try {
          GM_setValue('kuplafix_latest_version', version);
          GM_setValue('kuplafix_pending_update', version);
          if (UpdateChecker) {
            UpdateChecker.latestVersion = version;
            UpdateChecker.showBadge(version);
            UpdateChecker.updateMenuHeaderLink(version);
            UpdateChecker.showNotification(version);
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
    log.debug('✓ kuplafix window object exported');
  }
})();
