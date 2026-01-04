// ==UserScript==
// @name         CodePen.md - Copy as Markdown
// @namespace    https://github.com/AstroMash/userscripts
// @version      2.3.1
// @description  One-click (or hotkey) CodePen→Markdown: HTML/CSS/JS fences with optional attribution; raw or compiled output (SCSS→CSS, TS/Babel→JS); customizable shortcut; persistent preferences.
// @author       AstroMash
// @match        https://codepen.io/*/pen/*
// @match        https://cdpn.io/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @icon         https://raw.githubusercontent.com/astromash/userscripts/main/scripts/codepen-md/icon.png
// @downloadURL https://update.greasyfork.org/scripts/546076/CodePenmd%20-%20Copy%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/546076/CodePenmd%20-%20Copy%20as%20Markdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const APP_TITLE = 'CodePen.md';
    const NOTIFY_TAG = 'codepen-md-status';
    const ORIGIN_PARENT = 'https://codepen.io';
    const ORIGIN_CHILD = 'https://cdpn.io';
    const IS_PREVIEW = location.hostname.endsWith('cdpn.io');
    const IS_PARENT = location.hostname.endsWith('codepen.io');

    // Prefs
    const PREF = {
        processed: 'cpmd_processed', // '1'|'0'
        includeHeader: 'cpmd_include_header', // '1'|'0'
        shortcutEnabled: 'cpmd_shortcut_enabled', // '1'|'0'
        shortcutCombo: 'cpmd_shortcut_combo', // JSON string: {ctrl,alt,shift,meta,key,code}
    };

    // Default shortcut combo
    const DEFAULT_SHORTCUT = {
        alt: true,
        shift: true,
        ctrl: false,
        meta: false,
        key: 'x',
        code: 'KeyX',
    };

    // Initialize prefs
    if (localStorage.getItem(PREF.processed) == null)
        localStorage.setItem(PREF.processed, '0');
    if (localStorage.getItem(PREF.includeHeader) == null)
        localStorage.setItem(PREF.includeHeader, '1');
    if (localStorage.getItem(PREF.shortcutEnabled) == null)
        localStorage.setItem(PREF.shortcutEnabled, '1');
    if (localStorage.getItem(PREF.shortcutCombo) == null)
        localStorage.setItem(
            PREF.shortcutCombo,
            JSON.stringify(DEFAULT_SHORTCUT)
        );

    const getPref = (k) => localStorage.getItem(k);
    const setPref = (k, v) => localStorage.setItem(k, v);
    const isTrue = (k) => getPref(k) === '1';
    const getShortcutCombo = () => {
        try {
            return JSON.parse(getPref(PREF.shortcutCombo));
        } catch {
            return DEFAULT_SHORTCUT;
        }
    };

    // ---- Pref bus + menu refresh
    const CAN_UNREGISTER =
        typeof GM_unregisterMenuCommand === 'function' ||
        (typeof GM === 'object' &&
            typeof GM?.unregisterMenuCommand === 'function');

    const Menu = {
        // Commands are preferences and actions that can be toggled or executed
        // from the userscript menu in the browser extension. The `id` is set to
        // the return value of GM_registerMenuCommand, which can be used to
        // unregister the command later if needed (and if supported). Unregistering
        // then re-registering is useful for toggling checkmarks for preference commands.
        commands: {
            setProcessed: {
                id: null,
                pref: PREF.processed,
                caption: 'Use processed output (SCSS→CSS, etc)',
                commandFn: () =>
                    togglePref(PREF.processed, { toastLabel: 'Compiled code' }),
                accessKey: 'P',
            },
            setHeader: {
                id: null,
                pref: PREF.includeHeader,
                caption: 'Include source header',
                commandFn: () =>
                    togglePref(PREF.includeHeader, {
                        toastLabel: 'Attribution header',
                    }),
                accessKey: 'H',
            },
            setShortcut: {
                id: null,
                pref: PREF.shortcutEnabled,
                caption: 'Enable keyboard shortcut',
                commandFn: () =>
                    togglePref(PREF.shortcutEnabled, {
                        toastLabel: 'Keyboard shortcut',
                    }),
                accessKey: 'S',
            },
            execCopy: {
                id: null,
                pref: null, // not a pref, just a command
                caption: 'Copy CodePen as Markdown',
                commandFn: () => extractAndCopy({ userGesture: true }),
                accessKey: 'C',
            },
        },
        registered: false, // whether the menu commands are registered
    };

    const registerMenuCommands = (menu) => {
        if (typeof GM_registerMenuCommand !== 'function') return;
        if (menu.registered) return; // already registered
        if (!menu.commands || typeof menu.commands !== 'object') return;
        // Helper to add checkmark to preference captions
        const setCheckmark = (pref, label) =>
            `${isTrue(pref) ? '✓ ' : '  '}${label}`;

        Object.entries(menu.commands).forEach(([key, config]) => {
            let { caption, pref, commandFn, accessKey } = config;
            if (!caption || typeof commandFn !== 'function') return;
            if (pref) caption = setCheckmark(pref, caption); // only preferences need checkmarks
            if (!accessKey) {
                // default to first letter of key after stripping 'set' or 'exec'
                accessKey =
                    key.startsWith('set') || key.startsWith('exec')
                        ? key.slice(3)
                        : key;
            }
            if (accessKey.length > 1) {
                // if accessKey is more than one character, use first character
                accessKey = accessKey.charAt(0);
            }

            menu.commands[key].id = GM_registerMenuCommand(
                `${caption} [${accessKey.toUpperCase()}]`,
                commandFn,
                accessKey.toUpperCase()
            );
        });

        menu.registered = true;
    };

    const _unreg = (id) => {
        try {
            if (!id) return;
            if (typeof GM_unregisterMenuCommand === 'function')
                GM_unregisterMenuCommand(id);
            else if (
                typeof GM === 'object' &&
                typeof GM.unregisterMenuCommand === 'function'
            )
                GM.unregisterMenuCommand(id);
        } catch {}
    };

    function refreshMenu({ force = false } = {}) {
        if (!CAN_UNREGISTER && Menu.registered && !force) return;

        if (CAN_UNREGISTER) {
            Object.entries(Menu.commands).forEach(([key, cmd]) => {
                const { id } = cmd;
                if (id) {
                    _unreg(id);
                    cmd.id = null;
                }
            });
        }
        Menu.registered = false; // reset state

        registerMenuCommands(Menu);
    }

    function emitPref(key, value) {
        try {
            window.dispatchEvent(
                new CustomEvent('cpmd:prefs', { detail: { key, value } })
            );
        } catch {}
    }

    function togglePref(key, { toastLabel } = {}) {
        const next = isTrue(key) ? '0' : '1';
        setPref(key, next);
        emitPref(key, next);
        refreshMenu(); // re-label menu
        broadcastPrefs(); // sync to preview
        if (toastLabel) {
            toast(`${toastLabel} ${next === '1' ? 'enabled' : 'disabled'}.`, {
                type: 'info',
            });
        }
    }

    // ---------- Styles (parent only) ----------
    if (IS_PARENT && typeof GM_addStyle === 'function') {
        GM_addStyle(`
    /* Main button wrapper */
    .cpmd-wrap {
      position: fixed;
      right: 24px;
      bottom: 32px;
      z-index: 2147483647;
      display: flex;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,.4), 0 2px 10px rgba(0,0,0,.2);
      backdrop-filter: blur(20px) saturate(180%);
    }

    /* Main copy button */
    .cpmd-btn-main {
      padding: 14px 18px;
      border: 0;
      background: rgba(17, 24, 39, 0.95);
      color: #e5e7eb;
      font: 500 14px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.08);
      border-right: 0;
    }
    .cpmd-btn-main::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      right: 100%;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.15), transparent);
      transition: left 0.5s ease, right 0.5s ease;
    }
    .cpmd-btn-main:hover::before { left: 100%; right: -100%; }
    .cpmd-btn-main:hover { background: rgba(17, 24, 39, 0.98); color: #f3f4f6; }
    .cpmd-btn-main span { position: relative; z-index: 1; letter-spacing: -0.01em; }
    .cpmd-btn-main.is-busy { opacity: .7; cursor: wait; }
    .cpmd-btn-main.is-busy span::after {
      content: '';
      display: inline-block;
      width: 8px;height: 8px;margin-left: 8px;
      border: 2px solid rgba(102, 126, 234, 0.3); border-top-color: #667eea; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Gear button */
    .cpmd-btn-gear {
      width: 44px; min-width: 44px; border: 0; border-left: 1px solid rgba(255,255,255,.08);
      background: rgba(17, 24, 39, 0.95);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s ease; position: relative;
      border: 1px solid rgba(255,255,255,.08); border-left: 0;
    }
    .cpmd-btn-gear:hover { background: rgba(30, 41, 59, 0.95); }
    .cpmd-btn-gear[aria-expanded="true"] { background: rgba(30, 41, 59, 0.98); border-color: rgba(102, 126, 234, 0.3); }
    .cpmd-gear-ic { width: 18px; height: 18px; display: block; transition: transform .3s cubic-bezier(.4,0,.2,1); opacity: .8; }
    .cpmd-btn-gear:hover .cpmd-gear-ic { opacity: 1; }
    .cpmd-btn-gear[aria-expanded="true"] .cpmd-gear-ic { transform: rotate(60deg); opacity: 1; }

    /* Toast notifications */
    .cpxt-toast-wrap {
      position: fixed; z-index: 2147483647; right: 24px; top: 24px;
      display: flex; flex-direction: column; gap: 10px;
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }
    .cpxt-toast {
      min-width: 280px; max-width: 420px; padding: 14px 16px; border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,.3), 0 2px 10px rgba(0,0,0,.2);
      background: rgba(17, 24, 39, 0.98); backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255,255,255,.08); color: #e5e7eb;
      opacity: 0; transform: translateY(-10px) scale(0.95);
      transition: all .3s cubic-bezier(.4,0,.2,1);
    }
    .cpxt-toast.show { opacity: 1; transform: translateY(0) scale(1); }
    .cpxt-toast .cpxt-title { font-weight: 600; margin-bottom: 4px; color: #f3f4f6; letter-spacing: -0.01em; }
    .cpxt-toast.info { border-left: 3px solid #60a5fa; background: linear-gradient(to right, rgba(59,130,246,.08), rgba(17,24,39,.98)); }
    .cpxt-toast.warn { border-left: 3px solid #fbbf24; background: linear-gradient(to right, rgba(245,158,11,.08), rgba(17,24,39,.98)); }
    .cpxt-toast.error{ border-left: 3px solid #f87171; background: linear-gradient(to right, rgba(239,68,68,.08), rgba(17,24,39,.98)); }
    .cpxt-toast.success{border-left: 3px solid #34d399; background: linear-gradient(to right, rgba(16,185,129,.08), rgba(17,24,39,.98));}
    .cpxt-toast details{margin-top:8px;}
    .cpxt-toast summary{cursor:pointer;user-select:none;font-size:13px;color:#9ca3af;transition:color .2s ease;}
    .cpxt-toast summary:hover{color:#e5e7eb;}

    /* Options panel */
    .cpmd-panel {
      position: fixed; right: 24px; bottom: 84px;
      z-index: 2147483646; width: 380px;
      background: rgba(17, 24, 39, 0.98); backdrop-filter: blur(20px) saturate(180%);
      color: #e5e7eb; border: 1px solid rgba(255,255,255,.1); border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.3);
      padding: 0; display: none; overflow: hidden; animation: panelSlideUp .3s cubic-bezier(.4,0,.2,1);
    }
    @keyframes panelSlideUp { from{opacity:0;transform:translateY(10px) scale(.95);} to{opacity:1;transform:translateY(0) scale(1);} }
    .cpmd-panel.show { display: block; }
    .cpmd-panel h3 { margin:0; padding:18px 20px; font:600 16px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
      background: linear-gradient(135deg, rgba(102,126,234,.1), rgba(118,75,162,.1));
      border-bottom:1px solid rgba(255,255,255,.08); letter-spacing:-.01em; }
    .cpmd-panel-body{ padding:16px 20px 20px; }
    .cpmd-opt{ display:flex; gap:12px; align-items:flex-start; margin:0; padding:12px; border-radius:8px; font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif; transition:background .2s ease; cursor:pointer; }
    .cpmd-opt:hover{ background: rgba(255,255,255,.05); }
    .cpmd-opt + .cpmd-opt { margin-top:8px; }
    .cpmd-opt input[type="checkbox"]{ margin-top:2px; width:18px; height:18px; accent-color:#667eea; cursor:pointer; }
    .cpmd-opt-label{ flex:1; cursor:pointer; }
    .cpmd-opt-title{ font-weight:600; color:#f3f4f6; margin-bottom:2px; }
    .cpmd-opt-desc{ font-size:13px; color:#9ca3af; line-height:1.4; }
    .cpmd-separator{ height:1px; background:rgba(255,255,255,.08); margin:16px -20px; }

    /* Shortcut section wrapper */
    .cpmd-shortcut-wrapper {
      margin-top: 8px;
    }

    /* Collapsed shortcut row */
    .cpmd-shortcut-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .cpmd-shortcut-row:hover {
      background: rgba(255,255,255,.05);
    }

    .cpmd-shortcut-row input[type="checkbox"] {
      margin: 0;
      width: 18px;
      height: 18px;
      accent-color: #667eea;
      cursor: pointer;
      pointer-events: auto;
    }

    .cpmd-shortcut-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cpmd-shortcut-label {
      font-weight: 600;
      color: #f3f4f6;
      font-size: 14px;
      pointer-events: auto;
    }

    .cpmd-shortcut-badge {
      padding: 4px 10px;
      background: rgba(102, 126, 234, 0.12);
      border: 1px solid rgba(102, 126, 234, 0.2);
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      color: #93c5fd;
      font-weight: 500;
    }

    .cpmd-shortcut-row.disabled .cpmd-shortcut-badge {
      opacity: 0.5;
    }

    .cpmd-edit-btn {
      padding: 6px 12px;
      background: transparent;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 6px;
      color: #9ca3af;
      font: 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cpmd-edit-btn:hover {
      background: rgba(255,255,255,.05);
      color: #e5e7eb;
      border-color: rgba(102, 126, 234, 0.3);
    }

    .cpmd-edit-btn.is-editing {
      color: #60a5fa;
      border-color: rgba(102, 126, 234, 0.4);
      background: rgba(102, 126, 234, 0.08);
    }

    .cpmd-shortcut-row.disabled .cpmd-edit-btn {
      opacity: 0.4;
      pointer-events: none;
    }

    /* Expandable config section */
    .cpmd-shortcut-expand {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cpmd-shortcut-expand.show {
      max-height: 300px;
    }

    .cpmd-shortcut-config {
      padding: 12px;
      margin: 0 12px 12px;
      border: 1px solid rgba(255,255,255,.06);
      border-radius: 10px;
      background: rgba(255,255,255,.02);
      animation: fadeInConfig 0.2s ease;
    }

    @keyframes fadeInConfig {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Modifier keys row */
    .cpmd-modifier-row {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }

    .cpmd-mod-key {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 4px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .cpmd-mod-key:hover {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.12);
    }

    .cpmd-mod-key.active {
      background: rgba(102, 126, 234, 0.12);
      border-color: rgba(102, 126, 234, 0.35);
    }

    .cpmd-mod-key input {
      margin: 0;
      width: 14px;
      height: 14px;
      accent-color: #667eea;
    }

    .cpmd-mod-key span {
      user-select: none;
      font-weight: 500;
    }

    /* Main key capture section */
    .cpmd-key-section {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 10px;
    }

    .cpmd-key-capture {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 6px;
      background: rgba(255,255,255,.03);
      color: #e5e7eb;
      cursor: pointer;
      font: 13px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cpmd-key-capture:hover {
      background: rgba(255,255,255,.06);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .cpmd-key-capture.is-capturing {
      background: rgba(102, 126, 234, 0.12);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
    }

    .cpmd-key-capture-label {
      color: #9ca3af;
      font-size: 12px;
    }

    .cpmd-key-value {
      padding: 3px 8px;
      background: rgba(102, 126, 234, 0.15);
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      font-weight: 500;
      color: #93c5fd;
    }

    .cpmd-key-capture.is-capturing .cpmd-key-value {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Bottom row with reset and done */
    .cpmd-shortcut-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .cpmd-reset-btn {
      padding: 6px 12px;
      background: transparent;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 6px;
      color: #9ca3af;
      font: 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cpmd-reset-btn:hover {
      background: rgba(255,255,255,.05);
      color: #e5e7eb;
      border-color: rgba(255,255,255,.15);
    }

    .cpmd-done-btn {
      padding: 6px 14px;
      background: rgba(102, 126, 234, 0.15);
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 6px;
      color: #93c5fd;
      font: 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cpmd-done-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.35);
    }

    /* Overlay for copy dialog */
    .cpmd-overlay { position: fixed; inset: 0; z-index: 2147483647; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; animation: fadeIn .2s ease; }
    @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
    .cpmd-card { background: rgba(17, 24, 39, 0.98); backdrop-filter: blur(20px) saturate(180%); color: #e5e7eb;
      min-width: 380px; max-width: 480px; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,.1);
      box-shadow: 0 30px 80px rgba(0,0,0,.5), 0 10px 40px rgba(0,0,0,.3); text-align: center; animation: cardSlideUp .3s cubic-bezier(.4,0,.2,1); }
    @keyframes cardSlideUp { from{opacity:0;transform:translateY(20px) scale(.9);} to{opacity:1;transform:translateY(0) scale(1);} }
    .cpmd-card h2 { margin: 0 0 12px; font: 600 22px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif; color: #f3f4f6; letter-spacing: -0.02em; }
    .cpmd-card p { margin: 0 0 24px; font: 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif; color: #9ca3af; }
    .cpmd-cta { display:inline-flex; align-items:center; gap:10px; font:500 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
      padding:12px 20px; border-radius:8px; border:1px solid rgba(102,126,234,.3); background:rgba(102,126,234,.15); color:#e5e7eb; cursor:pointer; transition:all .2s ease; letter-spacing:-.01em; }
    .cpmd-cta:hover{ background: rgba(102,126,234,.25); border-color: rgba(102,126,234,.5); transform: translateY(-1px); }
    .cpmd-cta:active{ transform: translateY(0); }
    .cpmd-ghost{ margin-left:12px; background:transparent; color:#9ca3af; border:1px solid rgba(229,231,235,.15); }
    .cpmd-ghost:hover{ background:rgba(255,255,255,.05); color:#e5e7eb; border-color:rgba(229,231,235,.25); }
  `);
    }

    // ---------- Toasts (parent only) ----------
    function ensureToastWrap() {
        if (!IS_PARENT) return;
        if (!document.querySelector('.cpxt-toast-wrap')) {
            const wrap = document.createElement('div');
            wrap.className = 'cpxt-toast-wrap';
            document.body.appendChild(wrap);
        }
    }
    function toast(msg, { type = 'info', title = APP_TITLE, details } = {}) {
        if (!IS_PARENT) return;
        ensureToastWrap();
        const wrap = document.querySelector('.cpxt-toast-wrap');
        const el = document.createElement('div');
        el.className = `cpxt-toast ${type}`;
        el.innerHTML = `
      ${title ? `<div class="cpxt-title">${title}</div>` : ''}
      <div>${msg}</div>
      ${
          details?.length
              ? `<details><summary>Details</summary><ul style="margin:6px 0 0 18px">${details
                    .map((d) => `<li>${d}</li>`)
                    .join('')}</ul></details>`
              : ''
      }
    `;
        wrap.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 200);
        }, 4000);
    }

    // ---------- Desktop notifications (parent only) ----------
    function notifyDesktop({
        text,
        title = APP_TITLE,
        timeout = 5000,
        tag = NOTIFY_TAG,
        highlight = false,
        url,
        onclick,
        ondone,
        image,
        silent,
    } = {}) {
        if (!IS_PARENT) return;
        const api =
            (typeof GM_notification === 'function' &&
                ((o) => GM_notification(o))) ||
            (typeof GM === 'object' && (GM.notification || GM.notify));
        if (!api) return;
        try {
            api({
                text,
                title,
                timeout,
                tag,
                highlight,
                url,
                onclick,
                ondone,
                image,
                silent,
            });
        } catch {}
    }

    // ---------- Shared helpers ----------
    const rootWin = (() => {
        try {
            const uw =
                typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            return uw.top || uw;
        } catch {
            return window;
        }
    })();

    function hasFocus() {
        try {
            return document.hasFocus();
        } catch {
            return true;
        }
    }
    function onReady(fn) {
        if (
            document.readyState === 'complete' ||
            document.readyState === 'interactive'
        ) {
            fn();
        } else window.addEventListener('DOMContentLoaded', fn, { once: true });
    }
    async function waitFor(
        predicate,
        { timeout = 15000, interval = 120 } = {}
    ) {
        const start = performance.now();
        return new Promise((resolve) => {
            (function tick() {
                try {
                    const v = predicate();
                    if (v) return resolve(v);
                } catch {}
                if (performance.now() - start >= timeout) return resolve(null);
                setTimeout(tick, interval);
            })();
        });
    }

    function formatShortcutDisplay(combo = getShortcutCombo()) {
        const parts = [];
        if (combo.ctrl) parts.push('Ctrl');
        if (combo.alt) parts.push('Alt');
        if (combo.shift) parts.push('Shift');
        if (combo.meta)
            parts.push(
                /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : '⊞'
            );
        const last = (() => {
            if (combo.code && !/^Key[A-Z]$/.test(combo.code))
                return combo.code.toUpperCase();
            return (combo.key || '').toString().toUpperCase();
        })();
        parts.push(last);
        return parts.join('+');
    }

    function bindShortcut(handler) {
        if (!isTrue(PREF.shortcutEnabled)) return;

        const combo = getShortcutCombo();
        let cooldown = false;
        const match = (e) => {
            if (!!combo.alt !== !!e.altKey) return false;
            if (!!combo.shift !== !!e.shiftKey) return false;
            if (!!combo.ctrl !== !!e.ctrlKey) return false;
            if (!!combo.meta !== !!e.metaKey) return false;
            const k = (e.key || '').toLowerCase();
            const c = e.code || '';
            return k === (combo.key || '').toLowerCase() || c === combo.code;
        };
        const listener = (e) => {
            if (cooldown || e.repeat) return;
            if (match(e)) {
                e.preventDefault();
                e.stopPropagation();
                cooldown = true;
                setTimeout(() => (cooldown = false), 600);
                handler(e);
            }
        };
        window.addEventListener('keydown', listener, true);
        document.addEventListener('keydown', listener, true);

        return () => {
            window.removeEventListener('keydown', listener, true);
            document.removeEventListener('keydown', listener, true);
        };
    }

    // ---------- CP-first extraction (parent only) ----------
    function usernameFromProfiled(pen, prof) {
        if (prof?.id && pen?.user_id && prof.id === pen.user_id) {
            return (
                (prof.base_url || '').replace(/^\/|\/$/g, '') ||
                prof.name ||
                null
            );
        }
        return null;
    }
    function usernameFromURL() {
        return location.pathname.split('/')[1] || null || null;
    }

    // NOTE: if processed, always return normal languages.
    function fenceLang(kind, pen = rootWin.CP?.pen || {}, processed = false) {
        if (processed) return kind === 'js' ? 'javascript' : kind;
        if (
            kind === 'css' &&
            pen.css_pre_processor &&
            pen.css_pre_processor !== 'none'
        )
            return pen.css_pre_processor;
        if (
            kind === 'js' &&
            pen.js_pre_processor &&
            pen.js_pre_processor !== 'none'
        )
            return pen.js_pre_processor === 'babel'
                ? 'javascript'
                : pen.js_pre_processor;
        return kind === 'js' ? 'javascript' : kind;
    }

    async function getCodeFromCP({ preferProcessed = false } = {}) {
        const CP = rootWin.CP;
        if (!CP) return null;
        const pen = CP.pen || {};
        let html = '',
            css = '',
            js = '';
        let source = 'raw';

        if (
            preferProcessed &&
            typeof CP.getProcessedBodyByType === 'function'
        ) {
            try {
                if (CP.ensureProcessingRunOnce) {
                    try {
                        await CP.ensureProcessingRunOnce();
                    } catch {}
                }
                [html, css, js] = await Promise.all(
                    ['html', 'css', 'js'].map((t) =>
                        CP.getProcessedBodyByType(t).catch(() => '')
                    )
                );
                source = 'processed';
            } catch {}
        }
        if (!html && !css && !js) {
            html = pen.html || '';
            css = pen.css || '';
            js = pen.js || '';
            source = 'raw';
        }

        const profUser = usernameFromProfiled(pen, CP.profiled);
        const username = profUser || usernameFromURL();
        const id =
            pen.hashid ||
            pen.slug_hash ||
            location.pathname.split('/')[3] ||
            null;
        const url =
            username && id
                ? `https://codepen.io/${username}/pen/${id}`
                : location.href;

        return {
            html,
            css,
            js,
            source,
            meta: {
                title:
                    pen.title ||
                    document.title.replace(/\s*-\s*CodePen\s*$/i, '') ||
                    'Untitled Pen',
                username,
                displayName: CP.profiled?.name || username || '',
                id,
                url,
                pen,
                processed: source === 'processed',
            },
        };
    }
    function safeGetEditor(util, type) {
        try {
            return util?.getEditorByType?.(type) || null;
        } catch {
            return null;
        }
    }
    function readEditorText(ed) {
        try {
            if (!ed) return '';
            if (typeof ed.value === 'string') return ed.value;
            if (typeof ed.getValue === 'function') return ed.getValue();
            if (ed.getDoc && typeof ed.getDoc === 'function') {
                const doc = ed.getDoc();
                if (doc?.getValue) return doc.getValue();
            }
            const s = ed.view?.state?.doc ?? ed.state?.doc ?? ed._state?.doc;
            if (s?.toString) return s.toString();
        } catch {}
        return '';
    }
    async function getViaUtil({ timeout = 7000 } = {}) {
        const util = await waitFor(() => rootWin.CodeEditorsUtil, { timeout });
        if (!util) return null;
        return {
            html: readEditorText(safeGetEditor(util, 'html')),
            css: readEditorText(safeGetEditor(util, 'css')),
            js: readEditorText(safeGetEditor(util, 'js')),
            source: 'util',
            meta: {
                title:
                    document.querySelector('meta[property="og:title"]')
                        ?.content ||
                    document.title.replace(/\s*-\s*CodePen\s*$/i, '') ||
                    'Untitled Pen',
                username: usernameFromURL(),
                displayName: usernameFromURL() || '',
                id: location.pathname.split('/')[3] || null,
                url: location.href,
                pen: {},
                processed: false,
            },
        };
    }

    function toMarkdown({ html, css, js, meta }) {
        const includeHeader = isTrue(PREF.includeHeader);
        const processed = !!meta?.processed;
        const blocks = [];
        if (html)
            blocks.push(
                `\`\`\`${fenceLang(
                    'html',
                    meta?.pen,
                    processed
                )}\n${html}\n\`\`\``
            );
        if (css)
            blocks.push(
                `\`\`\`${fenceLang(
                    'css',
                    meta?.pen,
                    processed
                )}\n${css}\n\`\`\``
            );
        if (js)
            blocks.push(
                `\`\`\`${fenceLang('js', meta?.pen, processed)}\n${js}\n\`\`\``
            );
        const header =
            includeHeader && meta?.url
                ? `> Source: [${meta.title} by ${meta.displayName}](${meta.url})\n\n`
                : '';
        return header + blocks.join('\n\n') + (blocks.length ? '\n' : '');
    }

    async function generateMarkdownForPage() {
        const params = new URLSearchParams(location.search);
        const preferProcessed =
            params.get('processed') === '1' || isTrue(PREF.processed);
        let data = await getCodeFromCP({ preferProcessed });
        if (!data || (!data.html && !data.css && !data.js)) {
            toast('Falling back to editor API.', { type: 'warn' });
            data = (await getViaUtil({ timeout: 15000 })) || {
                html: '',
                css: '',
                js: '',
                meta: null,
            };
        } else {
            toast(
                `Using ${
                    data.source === 'processed' ? 'compiled' : 'raw'
                } code via CP.`,
                { type: 'info' }
            );
        }
        return { md: toMarkdown(data), meta: data.meta };
    }

    // ---------- Copy helpers (parent) ----------
    function focusAnyEditor() {
        try {
            const util = rootWin.CodeEditorsUtil;
            util?.getEditorByType?.('html')?.focus?.() ||
                util?.getEditorByType?.('css')?.focus?.() ||
                util?.getEditorByType?.('js')?.focus?.();
        } catch {}
    }
    async function copyMarkdown(md, { userGesture = false } = {}) {
        if (!md || !md.trim()) throw new Error('Nothing to copy');
        if (!userGesture && typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(md);
            return 'GM_setClipboard';
        }
        if (userGesture && hasFocus() && navigator.clipboard?.writeText) {
            focusAnyEditor();
            await navigator.clipboard.writeText(md);
            return 'native API';
        }
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(md);
            return 'GM_setClipboard';
        }
        throw new Error('No clipboard method available');
    }

    // Big center overlay for "needs click"
    function showCopyOverlay(md) {
        closePanel();
        const wrap = document.createElement('div');
        wrap.className = 'cpmd-overlay';
        wrap.innerHTML = `
      <div class="cpmd-card" role="dialog" aria-modal="true">
        <h2>Click to copy Markdown</h2>
        <p>Your browser blocked clipboard access. One click will finish copying your CodePen.</p>
        <div>
          <button class="cpmd-cta" id="cpmd-do-copy" type="button"><span>Copy to clipboard</span></button>
          <button class="cpmd-cta cpmd-ghost" id="cpmd-cancel" type="button"><span>Cancel</span></button>
        </div>
      </div>`;

        function cleanup() {
            document.removeEventListener('keydown', onKey, true);
            wrap.remove();
        }
        function onKey(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                cleanup();
            }
        }

        wrap.addEventListener(
            'pointerdown',
            (e) => {
                if (e.target === wrap) cleanup();
            },
            true
        );
        document.addEventListener('keydown', onKey, true);
        wrap.querySelector('#cpmd-cancel').onclick = cleanup;

        wrap.querySelector('#cpmd-do-copy').onclick = async () => {
            try {
                if (navigator.clipboard?.writeText)
                    await navigator.clipboard.writeText(md);
                else if (typeof GM_setClipboard !== 'undefined')
                    GM_setClipboard(md);
                toast('Successfully copied Markdown to clipboard!', {
                    type: 'success',
                });
            } catch (e) {
                console.error(e);
                toast('Failed to copy. Check console for details.', {
                    type: 'error',
                });
            } finally {
                cleanup();
            }
        };

        document.body.appendChild(wrap);
        wrap.querySelector('#cpmd-do-copy').focus();
    }

    // ---------- Panel control helpers (parent only) ----------
    function isPanelOpen() {
        const panel = document.getElementById('cpmd-panel');
        return !!panel && panel.classList.contains('show');
    }
    function closePanel() {
        const panel = document.getElementById('cpmd-panel');
        if (panel?.classList.contains('show')) {
            panel.classList.remove('show');
            document
                .getElementById('cpmd-btn-gear')
                ?.setAttribute('aria-expanded', 'false');
        }
    }

    // ---------- Parent UI & flow ----------
    function setBusy(b) {
        const btn = document.getElementById('cpmd-btn-main');
        if (!btn) return;
        btn.disabled = !!b;
        const span = btn.querySelector('span');
        if (span)
            span.textContent = b ? 'Copying…' : 'Copy CodePen as Markdown';
        btn.classList.toggle('is-busy', !!b);
    }

    async function extractAndCopy({ userGesture = false } = {}) {
        closePanel();
        setBusy(true);
        const { md } = await generateMarkdownForPage();
        if (!md.trim()) {
            toast('No content to copy.', { type: 'warn' });
            notifyDesktop({ text: 'No content found.' });
            setBusy(false);
            return;
        }
        try {
            const method = await copyMarkdown(md, { userGesture });
            toast('Copied Markdown.', { type: 'success' });
            notifyDesktop({ text: `Copied via ${method}.` });
        } catch {
            showCopyOverlay(md);
        } finally {
            setBusy(false);
        }
    }

    // ----- Options panel (parent only) -----
    function buildOptionsPanel() {
        if (!IS_PARENT) return;
        if (document.getElementById('cpmd-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'cpmd-panel';
        panel.className = 'cpmd-panel';

        const combo = getShortcutCombo();
        const shortcutEnabled = isTrue(PREF.shortcutEnabled);
        const isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');

        panel.innerHTML = `
      <h3>Options</h3>
      <div class="cpmd-panel-body">
        <label class="cpmd-opt">
          <input type="checkbox" id="cpmd-opt-processed">
          <div class="cpmd-opt-label">
            <div class="cpmd-opt-title">Copy compiled code</div>
            <div class="cpmd-opt-desc">Use processed output (e.g. SCSS→CSS, TypeScript→JS)</div>
          </div>
        </label>
        <label class="cpmd-opt">
          <input type="checkbox" id="cpmd-opt-header" checked>
          <div class="cpmd-opt-label">
            <div class="cpmd-opt-title">Add attribution header</div>
            <div class="cpmd-opt-desc">Include pen title, author name, and link to original</div>
          </div>
        </label>

        <div class="cpmd-separator"></div>

        <div class="cpmd-shortcut-wrapper">
          <div class="cpmd-shortcut-row ${shortcutEnabled ? '' : 'disabled'}">
            <input type="checkbox" id="cpmd-opt-shortcut-enabled" ${
                shortcutEnabled ? 'checked' : ''
            }>
            <div class="cpmd-shortcut-info">
              <label class="cpmd-shortcut-label" for="cpmd-opt-shortcut-enabled">Keyboard shortcut</label>
              <span class="cpmd-shortcut-badge" id="cpmd-shortcut-badge">${formatShortcutDisplay(
                  combo
              )}</span>
            </div>
            <button type="button" class="cpmd-edit-btn" id="cpmd-edit-shortcut">
              <span id="cpmd-edit-text">Edit</span>
            </button>
          </div>

          <div class="cpmd-shortcut-expand" id="cpmd-shortcut-expand">
            <div class="cpmd-shortcut-config">
              <div class="cpmd-modifier-row">
                <label class="cpmd-mod-key ${
                    combo.ctrl ? 'active' : ''
                }" id="mod-ctrl">
                  <input type="checkbox" id="cpmd-key-ctrl" ${
                      combo.ctrl ? 'checked' : ''
                  }>
                  <span>Ctrl</span>
                </label>
                <label class="cpmd-mod-key ${
                    combo.alt ? 'active' : ''
                }" id="mod-alt">
                  <input type="checkbox" id="cpmd-key-alt" ${
                      combo.alt ? 'checked' : ''
                  }>
                  <span>Alt</span>
                </label>
                <label class="cpmd-mod-key ${
                    combo.shift ? 'active' : ''
                }" id="mod-shift">
                  <input type="checkbox" id="cpmd-key-shift" ${
                      combo.shift ? 'checked' : ''
                  }>
                  <span>Shift</span>
                </label>
                <label class="cpmd-mod-key ${
                    combo.meta ? 'active' : ''
                }" id="mod-meta">
                  <input type="checkbox" id="cpmd-key-meta" ${
                      combo.meta ? 'checked' : ''
                  }>
                  <span>${isMac ? '⌘' : '⊞'}</span>
                </label>
              </div>

              <div class="cpmd-key-section">
                <button type="button" class="cpmd-key-capture" id="cpmd-key-capture">
                  <span class="cpmd-key-capture-label">Press to set key</span>
                  <span class="cpmd-key-value" id="cpmd-key-label" data-code="${
                      combo.code || ''
                  }">${(combo.key || 'X').toUpperCase()}</span>
                </button>
              </div>

              <div class="cpmd-shortcut-footer">
                <button type="button" class="cpmd-reset-btn" id="cpmd-reset-shortcut">Reset</button>
                <button type="button" class="cpmd-done-btn" id="cpmd-done-editing">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(panel);

        let editingShortcut = false;

        const syncPanel = () => {
            panel.querySelector('#cpmd-opt-processed').checked = isTrue(
                PREF.processed
            );
            panel.querySelector('#cpmd-opt-header').checked = isTrue(
                PREF.includeHeader
            );
            panel.querySelector('#cpmd-opt-shortcut-enabled').checked = isTrue(
                PREF.shortcutEnabled
            );

            const combo = getShortcutCombo();
            panel.querySelector('#cpmd-key-ctrl').checked = combo.ctrl;
            panel.querySelector('#cpmd-key-alt').checked = combo.alt;
            panel.querySelector('#cpmd-key-shift').checked = combo.shift;
            panel.querySelector('#cpmd-key-meta').checked = combo.meta;

            // Update active states
            panel
                .querySelector('#mod-ctrl')
                .classList.toggle('active', combo.ctrl);
            panel
                .querySelector('#mod-alt')
                .classList.toggle('active', combo.alt);
            panel
                .querySelector('#mod-shift')
                .classList.toggle('active', combo.shift);
            panel
                .querySelector('#mod-meta')
                .classList.toggle('active', combo.meta);

            const keyLabel = panel.querySelector('#cpmd-key-label');
            keyLabel.textContent = (combo.key || 'X').toUpperCase();
            keyLabel.dataset.code = combo.code || '';

            const enabled = isTrue(PREF.shortcutEnabled);
            panel
                .querySelector('.cpmd-shortcut-row')
                .classList.toggle('disabled', !enabled);
            panel.querySelector('#cpmd-shortcut-badge').textContent =
                formatShortcutDisplay(combo);
        };
        syncPanel();

        // Toggle expand/collapse
        const toggleShortcutEdit = (show) => {
            editingShortcut = show;
            const expandEl = panel.querySelector('#cpmd-shortcut-expand');
            const editBtn = panel.querySelector('#cpmd-edit-shortcut');
            const editText = panel.querySelector('#cpmd-edit-text');

            expandEl.classList.toggle('show', show);
            editBtn.classList.toggle('is-editing', show);
            editText.textContent = show ? 'Close' : 'Edit';
        };

        // Edit button click
        panel
            .querySelector('#cpmd-edit-shortcut')
            .addEventListener('click', () => {
                if (!isTrue(PREF.shortcutEnabled)) return;
                toggleShortcutEdit(!editingShortcut);
            });

        // Done button
        panel
            .querySelector('#cpmd-done-editing')
            .addEventListener('click', () => {
                toggleShortcutEdit(false);
            });

        // Option change handlers
        panel
            .querySelector('#cpmd-opt-processed')
            .addEventListener('change', () => {
                togglePref(PREF.processed, { toastLabel: 'Compiled code' });
            });

        panel
            .querySelector('#cpmd-opt-header')
            .addEventListener('change', () => {
                togglePref(PREF.includeHeader, {
                    toastLabel: 'Attribution header',
                });
            });

        // Shortcut enabled toggle
        panel
            .querySelector('#cpmd-opt-shortcut-enabled')
            .addEventListener('change', (e) => {
                const enabled = e.target.checked;
                setPref(PREF.shortcutEnabled, enabled ? '1' : '0');
                panel
                    .querySelector('.cpmd-shortcut-row')
                    .classList.toggle('disabled', !enabled);

                if (!enabled) {
                    toggleShortcutEdit(false);
                }

                if (window.cpmdCleanupShortcut) {
                    window.cpmdCleanupShortcut();
                    window.cpmdCleanupShortcut = null;
                }
                if (enabled) {
                    window.cpmdCleanupShortcut = bindShortcut(() =>
                        extractAndCopy({ userGesture: true })
                    );
                }

                broadcastPrefs();
                toast(
                    `Keyboard shortcut ${enabled ? 'enabled' : 'disabled'}.`,
                    { type: 'info' }
                );
            });

        // --- Key capture + update ---
        function labelForKey(ev) {
            if (/^F\d{1,2}$/.test(ev.key)) return ev.key.toUpperCase();
            if (ev.key === ' ') return 'SPACE';
            if (ev.key.length === 1) return ev.key.toUpperCase();
            return (ev.code || ev.key || '').toUpperCase().replace(/^KEY/, '');
        }

        function readComboFromUI() {
            const ctrl = panel.querySelector('#cpmd-key-ctrl').checked;
            const alt = panel.querySelector('#cpmd-key-alt').checked;
            const shift = panel.querySelector('#cpmd-key-shift').checked;
            const meta = panel.querySelector('#cpmd-key-meta').checked;
            const keyEl = panel.querySelector('#cpmd-key-label');
            const key = (keyEl.textContent || 'X').toUpperCase();
            const code =
                keyEl.dataset.code ||
                (/^[A-Z]$/.test(key)
                    ? 'Key' + key
                    : /^\d$/.test(key)
                    ? 'Digit' + key
                    : key);
            return { ctrl, alt, shift, meta, key: key.toLowerCase(), code };
        }

        const keyBtn = panel.querySelector('#cpmd-key-capture');
        const keyLabel = panel.querySelector('#cpmd-key-label');
        const captureLabel = panel.querySelector('.cpmd-key-capture-label');
        let capturing = false;

        function stopCapture() {
            capturing = false;
            keyBtn.classList.remove('is-capturing');
            captureLabel.textContent = 'Press to set key';
            document.removeEventListener('keydown', onCapture, true);
        }

        function onCapture(e) {
            e.preventDefault();
            e.stopPropagation();
            if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
            keyLabel.textContent = labelForKey(e);
            keyLabel.dataset.code = e.code || '';
            stopCapture();
            updateShortcut();
        }

        keyBtn.addEventListener('click', () => {
            if (capturing) {
                stopCapture();
                return;
            }
            capturing = true;
            keyBtn.classList.add('is-capturing');
            captureLabel.textContent = 'Press any key...';
            document.addEventListener('keydown', onCapture, true);
        });

        const updateShortcut = () => {
            const combo = readComboFromUI();
            if (!combo.ctrl && !combo.alt && !combo.shift && !combo.meta) {
                toast('At least one modifier key required!', { type: 'warn' });
                return;
            }

            setPref(PREF.shortcutCombo, JSON.stringify(combo));
            panel.querySelector('#cpmd-shortcut-badge').textContent =
                formatShortcutDisplay(combo);

            if (isTrue(PREF.shortcutEnabled)) {
                if (window.cpmdCleanupShortcut) window.cpmdCleanupShortcut();
                window.cpmdCleanupShortcut = bindShortcut(() =>
                    extractAndCopy({ userGesture: true })
                );
            }
            broadcastPrefs();
        };

        // Wire up modifier checkboxes
        ['ctrl', 'alt', 'shift', 'meta'].forEach((mod) => {
            const checkbox = panel.querySelector(`#cpmd-key-${mod}`);
            const label = panel.querySelector(`#mod-${mod}`);

            checkbox.addEventListener('change', () => {
                label.classList.toggle('active', checkbox.checked);
                updateShortcut();
            });
        });

        // Reset button
        panel
            .querySelector('#cpmd-reset-shortcut')
            .addEventListener('click', () => {
                setPref(PREF.shortcutCombo, JSON.stringify(DEFAULT_SHORTCUT));
                syncPanel();
                if (isTrue(PREF.shortcutEnabled)) {
                    if (window.cpmdCleanupShortcut)
                        window.cpmdCleanupShortcut();
                    window.cpmdCleanupShortcut = bindShortcut(() =>
                        extractAndCopy({ userGesture: true })
                    );
                }
                broadcastPrefs();
                toast('Shortcut reset to Alt+Shift+X', { type: 'info' });
            });

        // Listen for external changes
        window.addEventListener('cpmd:prefs', () => {
            syncPanel();
        });

        // Click-away close
        const onAway = (ev) => {
            if (!isPanelOpen()) return;
            const wrap = document.getElementById('cpmd-wrap');
            if (panel.contains(ev.target) || wrap?.contains(ev.target)) return;
            closePanel();
        };
        document.addEventListener('pointerdown', onAway, true);
        document.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 'Escape') {
                    if (editingShortcut) {
                        e.preventDefault();
                        toggleShortcutEdit(false);
                    } else if (isPanelOpen()) {
                        e.preventDefault();
                        closePanel();
                    }
                }
            },
            true
        );
    }

    function addSplitButton() {
        if (!IS_PARENT) return;
        if (document.getElementById('cpmd-wrap')) return;

        const wrap = document.createElement('div');
        wrap.id = 'cpmd-wrap';
        wrap.className = 'cpmd-wrap';

        const main = document.createElement('button');
        main.id = 'cpmd-btn-main';
        main.type = 'button';
        main.className = 'cpmd-btn-main';
        main.innerHTML = '<span>Copy CodePen as Markdown</span>';
        main.addEventListener('click', () =>
            extractAndCopy({ userGesture: true })
        );

        const gear = document.createElement('button');
        gear.id = 'cpmd-btn-gear';
        gear.type = 'button';
        gear.className = 'cpmd-btn-gear';
        gear.setAttribute('aria-label', 'CodePen.md options');
        gear.setAttribute('aria-haspopup', 'dialog');
        gear.setAttribute('aria-expanded', 'false');
        gear.innerHTML = `
    <svg class="cpmd-gear-ic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <path d="M0 0h48v48H0z" fill="none"></path> <g id="Shopicon"> <path d="M8.706,37.027c2.363-0.585,4.798-1.243,6.545-1.243c0.683,0,1.261,0.101,1.688,0.345c1.474,0.845,2.318,4.268,3.245,7.502 C21.421,43.866,22.694,44,24,44c1.306,0,2.579-0.134,3.816-0.368c0.926-3.234,1.771-6.657,3.244-7.501 c0.427-0.245,1.005-0.345,1.688-0.345c1.747,0,4.183,0.658,6.545,1.243c1.605-1.848,2.865-3.99,3.706-6.333 c-2.344-2.406-4.872-4.891-4.872-6.694c0-1.804,2.528-4.288,4.872-6.694c-0.841-2.343-2.101-4.485-3.706-6.333 c-2.363,0.585-4.798,1.243-6.545,1.243c-0.683,0-1.261-0.101-1.688-0.345c-1.474-0.845-2.318-4.268-3.245-7.502 C26.579,4.134,25.306,4,24,4c-1.306,0-2.579,0.134-3.816,0.368c-0.926,3.234-1.771,6.657-3.245,7.501 c-0.427-0.245-1.005-0.345-1.688-0.345c-1.747,0-4.183,0.658-6.545,1.243C7.101,12.821,5.841,14.962,5,17.306 C7.344,19.712,9.872,22.196,9.872,24c0,1.804-2.527,4.288-4.872,6.694C5.841,33.037,7.101,35.179,8.706,37.027z M18,24 c0-3.314,2.686-6,6-6s6,2.686,6,6s-2.686,6-6,6S18,27.314,18,24z"></path> </g> </g></svg>
    `;

        gear.addEventListener('click', () => {
            buildOptionsPanel();
            const panel = document.getElementById('cpmd-panel');
            const isOpen = panel.classList.toggle('show');
            if (isOpen) {
                panel.querySelector('#cpmd-opt-processed').checked = isTrue(
                    PREF.processed
                );
                panel.querySelector('#cpmd-opt-header').checked = isTrue(
                    PREF.includeHeader
                );
            }
            gear.setAttribute('aria-expanded', String(isOpen));
        });

        wrap.appendChild(main);
        wrap.appendChild(gear);
        document.body.appendChild(wrap);
    }

    // ---------- Pref sync (parent <-> preview) ----------
    function currentPrefs() {
        return {
            processed: isTrue(PREF.processed),
            includeHeader: isTrue(PREF.includeHeader),
            shortcutEnabled: isTrue(PREF.shortcutEnabled),
            shortcutCombo: getShortcutCombo(),
        };
    }
    function broadcastPrefs() {
        document
            .querySelectorAll('iframe[src*="//cdpn.io/"]')
            .forEach((ifr) => {
                try {
                    ifr.contentWindow?.postMessage(
                        { type: 'CPMD_PREFS_STATE', prefs: currentPrefs() },
                        ORIGIN_CHILD
                    );
                } catch {}
            });
    }

    // ---------- Preview agent (cdpn.io) ----------
    if (IS_PREVIEW) {
        // apply pushed prefs and (re)bind shortcut
        function applyPrefsInChild(p) {
            try {
                localStorage.setItem(PREF.processed, p.processed ? '1' : '0');
                localStorage.setItem(
                    PREF.includeHeader,
                    p.includeHeader ? '1' : '0'
                );
                localStorage.setItem(
                    PREF.shortcutEnabled,
                    p.shortcutEnabled ? '1' : '0'
                );
                localStorage.setItem(
                    PREF.shortcutCombo,
                    JSON.stringify(p.shortcutCombo || DEFAULT_SHORTCUT)
                );

                if (window.cpmdCleanupShortcut) {
                    window.cpmdCleanupShortcut();
                    window.cpmdCleanupShortcut = null;
                }
                if (p.shortcutEnabled) {
                    window.cpmdCleanupShortcut = bindShortcut(async () => {
                        try {
                            const md = await requestMarkdownFromParent();
                            if (!md) return;
                            if (navigator.clipboard?.writeText)
                                await navigator.clipboard.writeText(md);
                            else if (typeof GM_setClipboard !== 'undefined')
                                GM_setClipboard(md);
                            window.parent.postMessage(
                                {
                                    type: 'CPMD_NOTIFY',
                                    level: 'success',
                                    msg: 'Copied from Preview.',
                                },
                                ORIGIN_PARENT
                            );
                        } catch (e) {
                            window.parent.postMessage(
                                {
                                    type: 'CPMD_NOTIFY',
                                    level: 'error',
                                    msg: 'Preview copy failed.',
                                },
                                ORIGIN_PARENT
                            );
                        }
                    });
                }
            } catch {}
        }

        // ask parent for prefs at startup
        window.parent.postMessage(
            { type: 'CPMD_PREFS_REQUEST' },
            ORIGIN_PARENT
        );

        // listen for pushes
        window.addEventListener(
            'message',
            (ev) => {
                const d = ev.data || {};
                if (
                    ev.origin === ORIGIN_PARENT &&
                    d.type === 'CPMD_PREFS_STATE'
                )
                    applyPrefsInChild(d.prefs || {});
            },
            true
        );

        if (isTrue(PREF.shortcutEnabled)) {
            // bind with whatever's currently in localStorage until parent replies
            window.cpmdCleanupShortcut = bindShortcut(async () => {
                try {
                    const md = await requestMarkdownFromParent();
                    if (!md) return;
                    if (navigator.clipboard?.writeText)
                        await navigator.clipboard.writeText(md);
                    else if (typeof GM_setClipboard !== 'undefined')
                        GM_setClipboard(md);
                    window.parent.postMessage(
                        {
                            type: 'CPMD_NOTIFY',
                            level: 'success',
                            msg: 'Copied from Preview.',
                        },
                        ORIGIN_PARENT
                    );
                } catch (e) {
                    window.parent.postMessage(
                        {
                            type: 'CPMD_NOTIFY',
                            level: 'error',
                            msg: 'Preview copy failed.',
                        },
                        ORIGIN_PARENT
                    );
                    console.error('[CodePen.md] Preview copy failed', e);
                }
            });
        }

        // Close panel from preview clicks/Esc
        let _lastSignal = 0;
        function signalParent(t) {
            const now = Date.now();
            if (now - _lastSignal < 120) return;
            _lastSignal = now;
            window.parent.postMessage({ type: t }, ORIGIN_PARENT);
        }
        window.addEventListener(
            'pointerdown',
            (e) => {
                if (e.isTrusted && e.button === 0)
                    signalParent('CPMD_PREVIEW_POINTER');
            },
            true
        );
        window.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 'Escape') signalParent('CPMD_PREVIEW_ESC');
            },
            true
        );

        async function requestMarkdownFromParent() {
            const id = Math.random().toString(36).slice(2);
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    window.removeEventListener('message', onMsg, true);
                    reject(new Error('Timed out waiting for Markdown'));
                }, 7000);
                function onMsg(ev) {
                    if (ev.origin !== ORIGIN_PARENT) return;
                    const d = ev.data || {};
                    if (d.type === 'CPMD_COPY_PAYLOAD' && d.id === id) {
                        clearTimeout(timeout);
                        window.removeEventListener('message', onMsg, true);
                        resolve(d.md || '');
                    }
                }
                window.addEventListener('message', onMsg, true);
                window.parent.postMessage(
                    { type: 'CPMD_COPY_REQUEST', id },
                    ORIGIN_PARENT
                );
            });
        }

        return; // agent stops here
    }

    // ---------- Parent: message bridge for preview agent ----------
    if (IS_PARENT) {
        window.addEventListener('message', async (ev) => {
            const d = ev.data || {};
            if (ev.origin === ORIGIN_CHILD && d.type === 'CPMD_COPY_REQUEST') {
                try {
                    const { md } = await generateMarkdownForPage();
                    ev.source?.postMessage(
                        { type: 'CPMD_COPY_PAYLOAD', id: d.id, md },
                        ORIGIN_CHILD
                    );
                } catch {
                    ev.source?.postMessage(
                        { type: 'CPMD_COPY_PAYLOAD', id: d.id, md: '' },
                        ORIGIN_CHILD
                    );
                }
            } else if (ev.origin === ORIGIN_CHILD && d.type === 'CPMD_NOTIFY') {
                toast(d.msg || '', {
                    type:
                        d.level === 'success'
                            ? 'success'
                            : d.level === 'warn'
                            ? 'warn'
                            : 'error',
                });
            } else if (
                ev.origin === ORIGIN_CHILD &&
                (d.type === 'CPMD_PREVIEW_POINTER' ||
                    d.type === 'CPMD_PREVIEW_ESC')
            ) {
                closePanel();
            } else if (
                ev.origin === ORIGIN_CHILD &&
                d.type === 'CPMD_PREFS_REQUEST'
            ) {
                ev.source?.postMessage(
                    { type: 'CPMD_PREFS_STATE', prefs: currentPrefs() },
                    ORIGIN_CHILD
                );
            }
        });

        // Menu (register once; labels auto-refresh when supported)
        refreshMenu({ force: true });

        // UI + shortcut
        if (isTrue(PREF.shortcutEnabled)) {
            window.cpmdCleanupShortcut = bindShortcut(() =>
                extractAndCopy({ userGesture: true })
            );
        }

        onReady(() => {
            setTimeout(addSplitButton, 2000);
            setTimeout(broadcastPrefs, 2500); // let preview load, then push prefs
            const params = new URLSearchParams(location.search);
            if (params.get('copy') === '1')
                setTimeout(() => extractAndCopy({ userGesture: false }), 3000);
        });
    }
})();
