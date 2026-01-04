// ==UserScript==
// @name         Google Discover Toggle
// @namespace    https://github.com/ymhomer/ym_Userscript
// @version      1.3
// @description  Enable/disable Google Discover by toggling ?gl=nz. Adds a non-blocking prompt for first-time users with snooze/never options. Persists across sessions.
// @author       ymhomer
// @match        https://www.google.com/*
// @match        https://www.google.*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541203/Google%20Discover%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/541203/Google%20Discover%20Toggle.meta.js
// ==/UserScript==

;(async function () {
  'use strict';

  const STORAGE_KEY = 'discoverEnabled';
  const PROMPT_NEVER_KEY = 'discoverPromptNever';
  const SNOOZE_UNTIL_KEY = 'discoverSnoozeUntil';
  const GL_PARAM = 'gl';
  const DISCOVER_GL = 'nz';
  const SNOOZE_MS = 24 * 60 * 60 * 1000; // 1 day
  const REDIRECT_GUARD_KEY = 'gdt_last_redirect';
  const REDIRECT_GUARD_MS = 8000;

  const GMAPI = (typeof GM?.getValue === 'function')
    ? {
        get: (k, d) => GM.getValue(k, d),
        set: (k, v) => GM.setValue(k, v),
        menu: (label, cb) => GM.registerMenuCommand(label, cb),
      }
    : {
        get: (k, d) => Promise.resolve(GM_getValue(k, d)),
        set: (k, v) => Promise.resolve(GM_setValue(k, v)),
        menu: (label, cb) => GM_registerMenuCommand(label, cb),
      };

  const topWindow = (window.top === window.self);
  if (!topWindow) return;

  const path = location.pathname;
  const isEligiblePath = (path === '/' || path === '/search');

  function getGL(urlLike) {
    try {
      const u = new URL(urlLike || location.href);
      return u.searchParams.get(GL_PARAM);
    } catch {
      return null;
    }
  }

  function withGL(urlLike, value) {
    try {
      const u = new URL(urlLike || location.href);
      const sp = u.searchParams;
      if (value == null) {
        sp.delete(GL_PARAM);
      } else {
        sp.set(GL_PARAM, value);
      }
      return u.toString();
    } catch {
      return urlLike || location.href;
    }
  }

  function shouldGuardRedirect() {
    try {
      const last = sessionStorage.getItem(REDIRECT_GUARD_KEY);
      const now = Date.now();
      if (last && (now - Number(last) < REDIRECT_GUARD_MS)) return true;
      sessionStorage.setItem(REDIRECT_GUARD_KEY, String(now));
      return false;
    } catch {
      return false;
    }
  }

  // Persistent values
  const enabled = await GMAPI.get(STORAGE_KEY, undefined);
  const promptNever = await GMAPI.get(PROMPT_NEVER_KEY, false);
  const snoozeUntil = Number(await GMAPI.get(SNOOZE_UNTIL_KEY, 0)) || 0;

  // If user already enabled, enforce gl=nz if needed
  if (enabled === true) {
    const currentGL = getGL(location.href);
    if (currentGL !== DISCOVER_GL && !shouldGuardRedirect()) {
      location.replace(withGL(location.href, DISCOVER_GL));
      return;
    }
  }

  // Menu toggle
  const menuLabel = (() => {
    if (enabled === true) return 'Disable Google Discover';
    if (enabled === false) return 'Enable Google Discover';
    return 'Enable Google Discover (not set)';
  })();

  GMAPI.menu(menuLabel, async () => {
    const newState = !(enabled === true);
    await GMAPI.set(STORAGE_KEY, newState);
    if (newState) {
      if (getGL(location.href) !== DISCOVER_GL) {
        location.replace(withGL(location.href, DISCOVER_GL));
        return;
      }
    }
    // if disabling, do not touch current gl — just reload to apply menu label if needed
    location.reload();
  });

  // First-time prompt logic (only if no decision yet)
  const shouldPrompt =
    enabled === undefined &&
    !promptNever &&
    Date.now() >= snoozeUntil &&
    isEligiblePath;

  if (!shouldPrompt) return;

  // Wait for body to exist before injecting UI
  if (!document.body) {
    await new Promise((res) => {
      const obs = new MutationObserver(() => {
        if (document.body) {
          obs.disconnect();
          res();
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  // Render prompt (Shadow DOM)
  const host = document.createElement('div');
  host.setAttribute('data-gdt', 'host');
  host.style.position = 'fixed';
  host.style.top = '16px';
  host.style.right = '16px';
  host.style.zIndex = '2147483647';
  host.style.all = 'initial'; // avoid leaking styles
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });
  const wrap = document.createElement('div');

  const style = document.createElement('style');
  style.textContent = `
    :host, * { box-sizing: border-box; }
    .card {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.35;
      color: #1f1f1f;
      background: rgba(255,255,255,0.96);
      backdrop-filter: saturate(150%) blur(6px);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      width: 280px;
      padding: 12px 12px 10px;
    }
    @media (prefers-color-scheme: dark) {
      .card {
        color: #eaeaea;
        background: rgba(32,32,32,0.92);
        border-color: rgba(255,255,255,0.08);
        box-shadow: 0 8px 30px rgba(0,0,0,0.48);
      }
      .btn { color: #eaeaea; border-color: rgba(255,255,255,0.18); }
      .btn--primary { background: #1a73e8; color: white; border-color: transparent; }
    }
    .title { font-weight: 600; margin-bottom: 6px; }
    .desc  { opacity: 0.8; margin-bottom: 10px; }
    .row {
      display: flex; gap: 8px; justify-content: flex-end;
    }
    .btn {
      appearance: none;
      border: 1px solid rgba(0,0,0,0.18);
      background: transparent;
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
      font: inherit;
      transition: transform .06s ease, background .12s ease;
    }
    .btn:hover { background: rgba(0,0,0,0.04); }
    .btn:active { transform: translateY(1px); }
    .btn--primary {
      background: #1a73e8;
      color: white;
      border-color: transparent;
    }
    .sr { position:absolute; width:1px; height:1px; clip:rect(1px,1px,1px,1px); overflow:hidden; white-space:nowrap; }
  `;

  wrap.innerHTML = `
    <div class="card" role="dialog" aria-label="Google Discover setting">
      <div class="title">Enable Google Discover?</div>
      <div class="desc">Add <code>?gl=${DISCOVER_GL}</code> to keep Discover feed consistent on this device.</div>
      <div class="row">
        <button class="btn" data-action="never" aria-label="Never show again">Never</button>
        <button class="btn" data-action="later" aria-label="Not now">Not now</button>
        <button class="btn btn--primary" data-action="enable" aria-label="Enable">Enable</button>
      </div>
      <span class="sr">Use Tab to navigate buttons</span>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(wrap);

  function removePrompt() {
    try { host.remove(); } catch {}
  }

  async function onAction(action) {
    if (action === 'enable') {
      await GMAPI.set(STORAGE_KEY, true);
      removePrompt();
      if (getGL(location.href) !== DISCOVER_GL) {
        location.replace(withGL(location.href, DISCOVER_GL));
        return;
      }
      location.reload();
    } else if (action === 'later') {
      await GMAPI.set(SNOOZE_UNTIL_KEY, Date.now() + SNOOZE_MS);
      removePrompt();
    } else if (action === 'never') {
      await GMAPI.set(PROMPT_NEVER_KEY, true);
      await GMAPI.set(STORAGE_KEY, false);
      removePrompt();
    }
  }

  wrap.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const act = t.getAttribute('data-action');
    if (act) onAction(act);
  });

})();