// ==UserScript==
// @name         Rain.gg — LIVE RAIN TICKETS
// @namespace    https://rain.gg/
// @version      1.10
// @description  Adds an overlay to show tickets live during battles.
// @author       Steph
// @homepageURL  https://enhancr.gg
// @supportURL   https://enhancr.gg
// @match        https://rain.gg/*
// @run-at       document-start
// @grant        none
// @license Enhancr-UseOnly-NoRedistribution-1.0
// @downloadURL https://update.greasyfork.org/scripts/545703/Raingg%20%E2%80%94%20LIVE%20RAIN%20TICKETS.user.js
// @updateURL https://update.greasyfork.org/scripts/545703/Raingg%20%E2%80%94%20LIVE%20RAIN%20TICKETS.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.__rain_cb_fairness__) return;
  window.__rain_cb_fairness__ = true;

  const NativeWS = window.WebSocket;
  const textDecoder = new TextDecoder();

  const parts = () => location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const isDetail = () => {
    const p = parts();
    return p[0] === 'games' && p[1] === 'case-battles' && !!p[2];
  };
  const pathBattleId = () => {
    const p = parts();
    return (p[0] === 'games' && p[1] === 'case-battles') ? p[2] : null;
  };
  const isMenu = () => {
    const p = parts();
    return p[0] === 'games' && p[1] === 'case-battles' && !p[2];
  };

  let ACTIVE = isDetail();
  let currentBattleId = pathBattleId();

  const notifyNav = () => window.dispatchEvent(new Event('tm:nav'));
  const _push = history.pushState,
    _replace = history.replaceState;
  history.pushState = function() {
    const r = _push.apply(this, arguments);
    notifyNav();
    return r;
  };
  history.replaceState = function() {
    const r = _replace.apply(this, arguments);
    notifyNav();
    return r;
  };
  window.addEventListener('popstate', notifyNav);

  let host, shadow, card, els;
  let count = 0;
  let players = [];
  let autoRounds = null;
  let roundsObserver = null;
  let computeTimer = null;
  let lastSig = null;
  let fairness = {
    captured: false,
    firstServerSeed: null,
    firstClientSeed: null,
    battleId: null
  };
  let roundPoll = 0;
  let lastRoundSeen = null;
  const MAX_ROWS_VISIBLE = 50;
  const enc = new TextEncoder();
  let hmacKey = null;
  let hmacKeySeed = null;
  let launcher = null;
  const MIN_KEY = 'cb:min';
  const isMinimized = () => localStorage.getItem(MIN_KEY) === '1';
  const setMinimized = (v) => localStorage.setItem(MIN_KEY, v ? '1' : '0');
  let aboutPortal = null;

  function liveTicketPasses(v) {
    switch (liveTicketsFilter) {
      case 'off':
        return false;
      case 'all':
        return true;
      case 'p10':
        return v < 1000000;
      case 'p5':
        return v < 500000;
      case 'p1':
        return v < 100000;
      default:
        return false;
    }
  }

  function ensureAboutPortal() {
    if (aboutPortal) return aboutPortal;

    aboutPortal = document.createElement('div');
    aboutPortal.style.position = 'fixed';
    aboutPortal.style.inset = '0';
    aboutPortal.style.zIndex = '2147483647';
    aboutPortal.style.display = 'none';

    const sh = aboutPortal.attachShadow({
      mode: 'open'
    });

    const st = document.createElement('style');
    st.textContent = `
    :host { all: initial; }
    .backdrop { position: fixed; inset: 0; background: rgba(2,6,23,.7); backdrop-filter: blur(2px); }
    .modal {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
      width: min(92vw,560px);
      background: rgba(17,24,39,.98); color:#e5e7eb;
      border:1px solid rgba(148,163,184,.25); border-radius:14px;
      box-shadow:0 20px 60px rgba(0,0,0,.5);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", Arial;
    }
    header{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(148,163,184,.2)}
    header h3{margin:0;font-size:14px;font-weight:800}
    .beta{margin-left:6px;font-size:10px;font-weight:800;color:#0b1220;background:#38bdf8;padding:2px 6px;border-radius:999px}
    .close{all:unset;margin-left:auto;cursor:pointer;color:#94a3b8;font-size:18px;line-height:1;padding:2px 6px}
    .close:hover{color:#e2e8f0}
    .content{padding:12px 14px;font-size:12px;line-height:1.45}
    .content p{margin:0 0 8px}
	.content .bug-btn{
      display:inline-block; margin-top:6px; font-weight:800; font-size:12px;
      padding:6px 10px; border-radius:999px; text-decoration:none;
      background:#38bdf8; color:#0b1220; box-shadow:0 2px 8px rgba(0,0,0,.35);
    }
    .content .bug-btn:hover{ filter:brightness(1.08); }
	`;

    const wrap = document.createElement('div');
    wrap.className = 'backdrop';
    wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="cb-about-title">
      <header>
        <h3 id="cb-about-title">RAIN LIVE TICKETS</h3>
        <span class="beta">BETA</span>
        <button class="close" aria-label="Close">×</button>
      </header>
      <div class="content">
        <p>See live ticket numbers during a battle — directly on the page.</p>
        <p>Review each player’s tickets for your current battle.</p>
        <p>View the jackpot roll for the last round.</p>
        <p>Tip: open the battle before it starts so data is captured.</p>
		<p><a class="bug-btn" href="https://enhancr.gg/bug" target="_blank" rel="noopener noreferrer">Report a bug</a></p>
		<footer class="wm-foot" aria-hidden="true">
		  <span>Official build • Do not re-upload</span>
		  <a href="https://enhancr.gg" target="_blank" rel="noopener noreferrer">enhancr.gg</a>
		</footer>
      </div>
    </div>
  `;

    sh.append(st, wrap);
    document.documentElement.appendChild(aboutPortal);

    const close = sh.querySelector('.close');
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) hideAbout();
    });
    close.addEventListener('click', hideAbout);
    window.addEventListener('keydown', (e) => {
      if (aboutPortal.style.display !== 'none' && e.key === 'Escape') hideAbout();
    });

    return aboutPortal;
  }

  function showAbout() {
    ensureAboutPortal();
    aboutPortal.style.display = 'block';
  }

  function hideAbout() {
    if (aboutPortal) aboutPortal.style.display = 'none';
  }

  const SETTINGS_KEY_MINIMIZED = 'cb:startMin';
  const SETTINGS_KEY_JPBLUR = 'cb:blurJackpotDefault';

  const FILTER_KEY_LIVE = 'cb:liveTickets';
  let liveTicketsFilter = (localStorage.getItem(FILTER_KEY_LIVE) || 'off');
  let settingsPortal = null;

  function ensureSettingsPortal() {
    if (settingsPortal) return settingsPortal;

    settingsPortal = document.createElement('div');
    settingsPortal.style.position = 'fixed';
    settingsPortal.style.inset = '0';
    settingsPortal.style.zIndex = '2147483647';
    settingsPortal.style.display = 'none';
    const sh = settingsPortal.attachShadow({
      mode: 'open'
    });

    const st = document.createElement('style');
    st.textContent = `
    :host { all: initial; }
    .backdrop { position: fixed; inset: 0; background: rgba(2,6,23,.7); backdrop-filter: blur(2px); }
    .modal {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
      width: min(92vw, 520px);
      background: rgba(17,24,39,.98); color:#e5e7eb;
      border:1px solid rgba(148,163,184,.25); border-radius:14px;
      box-shadow:0 20px 60px rgba(0,0,0,.5);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", Arial;
    }
    header{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(148,163,184,.2)}
    header h3{margin:0;font-size:14px;font-weight:800}
    .close{all:unset;margin-left:auto;cursor:pointer;color:#94a3b8;font-size:18px;line-height:1;padding:2px 6px}
    .close:hover{color:#e2e8f0}
    .content{padding:12px 14px;font-size:12px;line-height:1.45}
    .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px dashed rgba(148,163,184,.18)}
    .row:last-child{border-bottom:0}
    label{display:flex;align-items:center;gap:8px}
    input[type="checkbox"]{width:16px;height:16px}
    .foot{display:flex;justify-content:flex-end;gap:8px;padding:10px 14px;border-top:1px solid rgba(148,163,184,.2)}
    .btn{all:unset;cursor:pointer;padding:6px 10px;border-radius:8px;color:#e5e7eb;border:1px solid rgba(148,163,184,.25)}
    .btn:hover{background:rgba(255,255,255,.06)}
    .btn.primary{font-weight:800;background:#38bdf8;color:#0b1220;border-color:transparent}
    .btn.primary:hover{filter:brightness(1.06)}
  `;

    const wrap = document.createElement('div');
    wrap.className = 'backdrop';
    wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="cb-settings-title">
      <header>
        <h3 id="cb-settings-title">Settings</h3>
        <button class="close" aria-label="Close">×</button>
      </header>
      <div class="content">
        <div class="row">
          <label for="st-startMin"><strong>Start minimized</strong></label>
          <input id="st-startMin" type="checkbox">
        </div>
        <div class="row">
          <label for="st-blurJackpot"><strong>Always blur jackpot roll</strong></label>
          <input id="st-blurJackpot" type="checkbox">
        </div>
		<div class="row">
  <label for="st-liveTickets"><strong>Live Tickets</strong></label>
  <select id="st-liveTickets">
    <option value="off">Off</option>
    <option value="all">All Tickets</option>
    <option value="p10">Top 10%</option>
    <option value="p5">Top 5%</option>
    <option value="p1">Top 1%</option>
  </select>
</div>
      </div>
      <div class="foot">
        <button class="btn" id="st-cancel">Cancel</button>
        <button class="btn primary" id="st-save">Save</button>
      </div>
    </div>
  `;

    sh.append(st, wrap);
    document.documentElement.appendChild(settingsPortal);

    const close = sh.querySelector('.close');
    const cancel = sh.querySelector('#st-cancel');
    close.addEventListener('click', hideSettings);
    cancel.addEventListener('click', hideSettings);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) hideSettings();
    });
    window.addEventListener('keydown', (e) => {
      if (settingsPortal.style.display !== 'none' && e.key === 'Escape') hideSettings();
    });

    sh.querySelector('#st-save').addEventListener('click', () => {
      const startMin = sh.querySelector('#st-startMin').checked;
      const blurJp = sh.querySelector('#st-blurJackpot').checked;

      const sel = sh.querySelector('#st-liveTickets');
      liveTicketsFilter = sel?.value || 'off';
      try {
        localStorage.setItem(FILTER_KEY_LIVE, liveTicketsFilter);
      } catch {}

      localStorage.setItem(SETTINGS_KEY_MINIMIZED, startMin ? '1' : '0');
      localStorage.setItem(SETTINGS_KEY_JPBLUR, blurJp ? '1' : '0');

      if (startMin) setMinimized(true);
      else setMinimized(false);
      applyMinState();

      if (els?.jackpotRoll) {
        els.jackpotRoll.setAttribute('data-blur', blurJp ? '1' : '0');
        els.jackpotRoll.title = blurJp ? 'Click to reveal' : 'Click to hide';
      }

      try {
        localStorage.setItem(FILTER_KEY_LIVE, liveTicketsFilter);
      } catch {}
      removeAllResultBadges();
      scanAndMark();

      hideSettings();
    });

    settingsPortal._preload = () => {
      const startMin = localStorage.getItem(SETTINGS_KEY_MINIMIZED) === '1';
      const blurJp = localStorage.getItem(SETTINGS_KEY_JPBLUR) === '1';
      sh.querySelector('#st-startMin').checked = startMin;
      sh.querySelector('#st-blurJackpot').checked = blurJp;

      try {
        liveTicketsFilter = localStorage.getItem(FILTER_KEY_LIVE) || 'off';
      } catch {}
      const sel = sh.querySelector('#st-liveTickets');
      if (sel) sel.value = liveTicketsFilter;
    };

    return settingsPortal;
  }

  function showSettings() {
    ensureSettingsPortal();
    settingsPortal._preload?.();
    settingsPortal.style.display = 'block';
  }

  function hideSettings() {
    if (settingsPortal) settingsPortal.style.display = 'none';
  }


  function ensureHost() {
    if (host) return;
    host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.zIndex = '2147483647';
    host.style.right = '0';
    host.style.top = '50%';
    host.style.pointerEvents = 'none';
    shadow = host.attachShadow({
      mode: 'open'
    });

    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
	  :host([data-min="1"]) .card { display: none !important; }
      .card {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Noto Sans", Arial;
        font-size: 12px; line-height: 1.25; color: #e5e7eb;
        background: rgba(17,24,39,.95); border: 1px solid rgba(148,163,184,.2);
        border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.4);
        padding: 10px 12px; min-width: 300px; max-width: 700px;
        max-height: 400px; overflow-y: auto; pointer-events: auto; user-select: text;
      }
	  .card.waiting { opacity:.9 }
	  .card { position: relative; } /* ensure absolute child anchors correctly */
	  .wm-corner{
		position:absolute; right:10px; bottom:8px;
		font-size:10px; letter-spacing:.06em; text-transform:uppercase;
		color:#94a3b8; opacity:.5; user-select:none; pointer-events:none;
	  }
      .row{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .grid{display:grid;grid-template-columns:1fr auto;gap:6px 10px}
      .title{font-weight:800;color:#f8fafc}
      .chip{font-weight:800;font-variant-numeric:tabular-nums;background:#38bdf8;color:#0b1220;padding:2px 8px;border-radius:999px}
	    .info {
    all: unset;
    width: 22px; height: 22px;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 999px;
    background: #38bdf8;  /* baby blue */
    color: #0b1220; font-weight: 900; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.35);
  }
  .info:hover { filter: brightness(1.08); }

  /* Centered modal */
  #cb-about.modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(2,6,23,.7);
    backdrop-filter: blur(2px);
    display: none;
    z-index: 999;
    pointer-events: auto;
  }
  #cb-about.show { display: block; }
  :host([data-min="1"]) #cb-about { display: none !important; }

  #cb-about .modal {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: min(92vw, 560px);
    background: rgba(17,24,39,.98);
    color: #e5e7eb;
    border: 1px solid rgba(148,163,184,.25);
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,.5);
  }
  #cb-about header {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(148,163,184,.2);
  }
  #cb-about header h3 {
    margin: 0; font-size: 14px; font-weight: 800; letter-spacing: .02em;
  }
  #cb-about .beta {
    margin-left: 6px;
    font-size: 10px; font-weight: 800;
    color: #0b1220; background: #38bdf8; /* baby blue */
    padding: 2px 6px; border-radius: 999px;
  }
  #cb-about .close {
    all: unset; margin-left: auto; cursor: pointer;
    color: #94a3b8; font-size: 18px; line-height: 1; padding: 2px 6px;
  }
  #cb-about .close:hover { color: #e2e8f0; }
  #cb-about .bug-btn{
    display:inline-block; margin-top:6px; font-weight:800; font-size:12px;
    padding:6px 10px; border-radius:999px; text-decoration:none;
    background:#38bdf8; color:#0b1220; box-shadow:0 2px 8px rgba(0,0,0,.35);
  }
  #cb-about .bug-btn:hover{ filter:brightness(1.08); }
  #cb-about .content { padding: 12px 14px; font-size: 12px; line-height: 1.45; }
  #cb-about .content p { margin: 0 0 8px; }
  #cb-about .wm-foot{
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  border-top:1px solid rgba(148,163,184,.2);
  padding:10px 14px; font-size:10px; text-transform:uppercase; letter-spacing:.06em;
  color:#94a3b8; opacity:.85; user-select:none;
  }
  #cb-about .wm-foot a{
	color:#a5b4fc; text-decoration:none;
  }
  #cb-about .wm-foot a:hover{ text-decoration:underline; }
      .muted{color:#94a3b8}.val{color:#f1f5f9;font-weight:600}.nowrap{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;text-align:right}
      .btn{all:unset;cursor:pointer;padding:2px 6px;border-radius:6px;color:#cbd5e1}.btn:hover{background:rgba(255,255,255,.08)}
	  .btn-group { display:flex; gap:6px; }
	  .btn.pill {
	  background: rgba(56,189,248,.15);
	  border: 1px solid rgba(148,163,184,.25);
	  padding: 4px 10px;
	  border-radius: 999px;
	  font-weight: 800;
	  }
	  .btn.pill:hover { background: rgba(56,189,248,.22); }
      .drag { cursor: move; user-select: none; touch-action: none; }
      .slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:10px}
      .slotbox{border:1px solid rgba(148,163,184,.2);background:rgba(2,6,23,.6);border-radius:10px;padding:8px}
	  .slotcard{border:1px solid rgba(148,163,184,.2);background:rgba(2,6,23,.6);border-radius:10px}
	  .slotcard > summary{
	  list-style:none; cursor:pointer; padding:8px 10px; display:flex; align-items:center; gap:10px
	  }
	  .slotcard > summary::-webkit-details-marker{display:none}
	  .slotcard .slotid{font-weight:700;color:#e2e8f0}
	  .slotcard .user{color:#cbd5e1;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
	  .slotcard .rows{max-height:240px;overflow:auto;border-top:1px dashed rgba(148,163,184,.2);padding:6px 10px}
	  .slotcard .foot{border-top:1px dashed rgba(148,163,184,.2);padding:6px 10px}
	  .slotcard[open]{box-shadow:0 6px 24px rgba(0,0,0,.25)}
      .rows{max-height:240px;overflow:auto;border-top:1px dashed rgba(148,163,184,.2);padding-top:6px}
      .rowitem{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 0}
      .rowitem .r{color:#94a3b8}
      .rowitem .v{font-variant-numeric:tabular-nums;font-weight:700}
	  #cb-jackpotRoll[data-blur="1"] {
  filter: blur(7px);
  transition: filter .18s ease;
  cursor: pointer;
}
#cb-jackpotRoll[data-blur="0"] {
  filter: none;
}
#cb-jackpotRoll:focus {
  outline: 2px solid rgba(148,163,184,.6);
  outline-offset: 2px;
}
    `;

    card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
<div class="row drag" id="cb-drag">
  <div class="title">Enhancr.gg - RAIN LIVE TICKETS</div>
  <div style="flex:1"></div>
  <div class="chip" id="cb-count" style="display:none"></div>
  <div class="btn-group">
    <button class="btn pill" id="cb-about" title="About">About</button>
    <button class="btn pill" id="cb-settings" title="Settings">Settings</button>
  </div>
  <button class="btn" id="cb-min" title="Minimize">–</button>
</div>

<div class="grid" style="margin-top:6px;">
  <div class="muted">State</div><div class="val nowrap" id="cb-state">—</div>
  <div class="muted">Players</div><div class="val" id="cb-players">—</div>
  <div class="muted">Battle ID</div><div class="val nowrap" id="cb-id">—</div>
  <div class="muted">Total rounds</div><div class="val" id="cb-rounds">—</div>
</div>

<div class="grid" style="margin-top:6px;">
  <div class="muted">clientSeed</div><div class="val nowrap" id="cb-clientSeed">—</div>
  <div class="muted">serverSeed</div><div class="val nowrap" id="cb-serverSeed">—</div>
  <div class="muted" id="cb-jackpotLabel" style="display:none">Jackpot roll</div>
  <div class="val nowrap" id="cb-jackpotRoll" style="display:none">—</div>
</div>

<div class="slots" id="cb-slots"></div>

<div class="wm-corner" aria-hidden="true">ENHANCR.GG • OFFICIAL BUILD</div>
`;

    const wrap = document.createElement('div');
    wrap.append(card);
    shadow.append(style, wrap);
    (document.documentElement || document.body).appendChild(host);
    ensureLauncher();
    applyMinState();
    if (isMinimized()) {
      card.classList.add('hidden');
      launcher.style.display = 'flex';
    } else {
      launcher.style.display = 'none';
    }

    const drag = shadow.getElementById('cb-drag');
    let dragging = false,
      sx = 0,
      sy = 0,
      startLeft = 0,
      startTop = 0,
      bw = 0,
      bh = 0;

    function isControlTarget(t) {
      return t.closest('#cb-min, button, a, input, textarea, select, [role="button"]');
    }

    const aboutBtn = shadow.getElementById('cb-about');
    aboutBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showAbout();
    });

    const settingsBtn = shadow.getElementById('cb-settings');
    settingsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showSettings();
    });

    drag.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || isControlTarget(e.target)) return;
      dragging = true;

      const r = host.getBoundingClientRect();
      host.style.left = r.left + 'px';
      host.style.top = r.top + 'px';
      host.style.right = 'auto';
      host.style.bottom = 'auto';
      host.style.transform = '';
      card.style.transform = '';

      sx = e.clientX;
      sy = e.clientY;
      startLeft = r.left;
      startTop = r.top;
      bw = r.width;
      bh = r.height;

      try {
        drag.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
    });

    drag.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;

      let left = startLeft + dx;
      let top = startTop + dy;

      left = Math.max(0, Math.min(left, window.innerWidth - bw));
      top = Math.max(0, Math.min(top, window.innerHeight - bh));

      host.style.left = left + 'px';
      host.style.top = top + 'px';
    });

    function endDrag(e) {
      dragging = false;
      try {
        drag.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
    drag.addEventListener('pointerup', endDrag);
    drag.addEventListener('pointercancel', endDrag);

    const minBtn = shadow.getElementById('cb-min');
    if (minBtn) {
      minBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeOverlay();
      });
    }

    els = {
      count: shadow.getElementById('cb-count'),
      state: shadow.getElementById('cb-state'),
      players: shadow.getElementById('cb-players'),
      id: shadow.getElementById('cb-id'),
      rounds: shadow.getElementById('cb-rounds'),
      clientSeed: shadow.getElementById('cb-clientSeed'),
      serverSeed: shadow.getElementById('cb-serverSeed'),
      jackpotLabel: shadow.getElementById('cb-jackpotLabel'),
      jackpotRoll: shadow.getElementById('cb-jackpotRoll'),
      slotsWrap: shadow.getElementById('cb-slots')
    };
    if (els?.jackpotRoll) {
      els.jackpotRoll.setAttribute('data-blur', '1');
      els.jackpotRoll.title = 'Click to reveal';
      els.jackpotRoll.setAttribute('role', 'button');
      els.jackpotRoll.setAttribute('tabindex', '0');

      const toggleBlur = () => {
        const isBlurred = els.jackpotRoll.getAttribute('data-blur') === '1';
        els.jackpotRoll.setAttribute('data-blur', isBlurred ? '0' : '1');
        els.jackpotRoll.title = isBlurred ? 'Click to hide' : 'Click to reveal';
      };

      els.jackpotRoll.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBlur();
      });

      els.jackpotRoll.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleBlur();
        }
      });
    }
    if (els?.count) els.count.style.setProperty('display', 'none', 'important');
    const infoBtn = shadow.getElementById('cb-info');
    infoBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showAbout();
    });
  }

  function ensureLauncher() {
    if (launcher) return;
    launcher = document.createElement('button');
    launcher.id = 'cb-launcher';
    launcher.type = 'button';
    launcher.title = 'Show Battle Info';

    Object.assign(launcher.style, {
      position: 'fixed',
      left: '12px',
      bottom: '12px',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: '1px solid rgba(148,163,184,.3)',
      background: 'rgba(17,24,39,.95)',
      color: '#e5e7eb',
      boxShadow: '0 10px 30px rgba(0,0,0,.4)',
      zIndex: '2147483647',
      cursor: 'pointer',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      lineHeight: '44px',
      textAlign: 'center',
      userSelect: 'none',
      backgroundImage: 'url("https://enhancr.gg/images/icon.png")',
      backgroundSize: '20px 20px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    });

    launcher.addEventListener('click', maximizeOverlay);
    (document.documentElement || document.body).appendChild(launcher);
  }

  function setWaitingUI() {
    ensureHost();
    if (!els) return;

    card && card.classList.remove('hidden');

    els.state.textContent = 'Waiting for a Battle';
    els.players.textContent = '—';
    els.id.textContent = '—';
    els.rounds.textContent = '—';
    els.clientSeed.textContent = '—';
    els.serverSeed.textContent = '—';

    if (els.jackpotLabel) els.jackpotLabel.style.display = '';
    if (els.jackpotRoll) {
      els.jackpotRoll.style.display = '';
      els.jackpotRoll.textContent = '—';
    }
    if (els?.jackpotRoll) els.jackpotRoll.setAttribute('data-blur', '1');

    if (els.slotsWrap) els.slotsWrap.innerHTML = '';
  }

  function applyMinState() {
    if (!host || !launcher) return;
    if (isMinimized()) {
      host.setAttribute('data-min', '1');
      launcher.style.display = 'flex';
    } else {
      host.removeAttribute('data-min');
      launcher.style.display = 'none';
    }
  }

  function minimizeOverlay() {
    setMinimized(true);
    ensureLauncher();
    applyMinState();
  }

  function maximizeOverlay() {
    setMinimized(false);
    applyMinState();
  }

  function showCard() {
    if (!host) return;
    if (!isMinimized()) card.classList.remove('hidden');
  }

  const roundsRe = /(\d+)\s*of\s*(\d+)/i;

  function readTotalRoundsFromRoundLabel() {
    const candidates = Array.from(document.querySelectorAll('span.sc-b060f5-0.huksxj, span'));
    let lastY = null;

    for (const el of candidates) {
      const txt = (el.textContent || '').trim();
      const m = txt.match(roundsRe);
      if (!m) continue;

      const prev = el.previousElementSibling;
      const prevTxt = (prev && prev.textContent || '').trim();
      if (!/^Round\b/i.test(prevTxt)) continue;

      const y = parseInt(m[2], 10);
      if (y > 0 && y <= 1000) lastY = y;
    }
    return lastY;
  }

  const tileWatchers = new Map();

  function isRainSpinTile(el) {
    if (!el) return false;
    const v = el.querySelector('video');
    if (!v) return false;
    const poster = v.getAttribute('poster') || '';
    if (poster.includes('rain-spin')) return true;
    for (const s of v.querySelectorAll('source')) {
      const src = s.getAttribute('src') || '';
      if (src.includes('rain-spin')) return true;
    }
    return false;
  }

  function watchUntilNotRainSpin(target) {
    if (!target || tileWatchers.has(target)) return;
    const obs = new MutationObserver(() => {
      if (!isRainSpinTile(target)) {
        const o = tileWatchers.get(target);
        if (o) {
          try {
            o.disconnect();
          } catch {}
          tileWatchers.delete(target);
        }
        setTimeout(scanAndMark, 0);
      }
    });
    obs.observe(target, {
      subtree: true,
      childList: true,
      attributes: true
    });
    tileWatchers.set(target, obs);
  }

  function ticketClassByValue(v) {
    if (v == null) return '';
    if (v < 10000) return 'gold glow';
    if (v < 100000) return 'gold';
    if (v < 500000) return 'red';
    if (v < 1000000) return 'pink';
    if (v < 1500000) return 'purple';
    if (v < 2000000) return 'blue';
    return '';
  }

  const RESULT_INDEX = 37;
  const TILE_SEL = 'div.sc-4a47b1b4-5.dmHfBH';
  const ROUND_TEXT_RE = /(\d+)\s*of\s*(\d+)/i;
  const TICKET_CACHE_MAX = 2000;

  function ticketCacheSet(key, value) {
    if (ticketCache.size >= TICKET_CACHE_MAX) {
      const first = ticketCache.keys().next().value;
      ticketCache.delete(first);
    }
    ticketCache.set(key, value);
  }

  let spinObs = null;
  let scanRaf = 0;
  let railsParent = null;
  let rails = [];
  const lastMarked = new Map();
  const ticketCache = new Map();

  (function injectResultStyle() {
    const s = document.createElement('style');
    s.textContent = `
    .__tm-pf-badge {
      position:absolute; top:6px; left:6px; padding:2px 6px;
      background:linear-gradient(90deg,#22d3ee,#4ade80); /* default (green-ish) */
      color:#0b1220; font-weight:800; font-size:11px; border-radius:999px;
      box-shadow:0 2px 8px rgba(0,0,0,.35); z-index:2
    }
    .__tm-pf-badge.blue   { background:#3b82f6; color:#06142b; }
    .__tm-pf-badge.purple { background:#a78bfa; color:#100a2b; }
    .__tm-pf-badge.pink   { background:#f472b6; color:#2b0f1e; }
    .__tm-pf-badge.red    { background:#f87171; color:#2b0f0f; }
    .__tm-pf-badge.gold   { background:#facc15; color:#1f1600; }
    .__tm-pf-badge.gold.glow {
      box-shadow:0 0 0 2px rgba(250,204,21,.5), 0 0 18px rgba(250,204,21,.9), 0 2px 8px rgba(0,0,0,.35);
    }
  `;
    document.documentElement.appendChild(s);
  })();

  function getCurrentRound() {
    const spans = document.querySelectorAll('span');
    for (let i = spans.length - 1; i >= 0; i--) {
      const t = (spans[i].textContent || '').trim();
      if (!t) continue;
      const m = t.match(ROUND_TEXT_RE);
      if (m && spans[i].previousElementSibling &&
        /^Round\b/i.test((spans[i].previousElementSibling.textContent || '').trim())) {
        const cur = parseInt(m[1], 10);
        return Number.isFinite(cur) ? cur : null;
      }
    }
    return null;
  }

  function findRailsParentAndRails() {
    const tiles = Array.from(document.querySelectorAll(TILE_SEL));
    if (!tiles.length) {
      rails = [];
      railsParent = null;
      return;
    }

    const counts = new Map();
    for (const t of tiles) {
      const p = t.parentElement;
      if (!p) continue;
      counts.set(p, (counts.get(p) || 0) + 1);
    }

    let candidates = Array.from(counts.entries())
      .filter(([, c]) => c >= RESULT_INDEX + 1)
      .map(([p]) => p);

    if (!candidates.length) {
      rails = [];
      railsParent = null;
      return;
    }

    const parentSet = new Set(candidates.map(r => r.parentElement).filter(Boolean));
    railsParent = parentSet.size ? parentSet.values().next().value : candidates[0].parentElement;

    const items = candidates.map(r => {
      const rect = r.getBoundingClientRect();
      return {
        r,
        x: rect.left || rect.x || 0,
        y: rect.top || rect.y || 0
      };
    });

    const TOL = 24;
    const rows = [];
    for (const it of items.sort((a, b) => a.y - b.y)) {
      let placed = false;
      for (const row of rows) {
        if (Math.abs(row.yRef - it.y) <= TOL) {
          row.items.push(it);
          row.yRef = (row.yRef * row.items.length + it.y) / (row.items.length + 1);
          placed = true;
          break;
        }
      }
      if (!placed) rows.push({
        yRef: it.y,
        items: [it]
      });
    }

    rows.sort((a, b) => a.yRef - b.yRef);
    for (const row of rows) row.items.sort((a, b) => a.x - b.x);

    rails = rows.flatMap(row => row.items.map(it => it.r));
  }

  async function getTicketCached(round, slot) {
    const server = fairness.firstServerSeed;
    const client = fairness.firstClientSeed;
    if (!server || !client) return null;

    const key = `${round}|${slot}|${server}|${client}`;
    if (ticketCache.has(key)) return ticketCache.get(key);
    const v = await roll(server, client, round, slot);
    ticketCacheSet(key, v);
    return v;
  }

  function unmarkRail(rail) {
    const prev = lastMarked.get(rail);
    if (!prev) return;
    const b = prev.querySelector(':scope > .__tm-pf-badge');
    if (b) b.remove();
    lastMarked.delete(rail);
    const ow = tileWatchers.get(prev);
    if (ow) {
      try {
        ow.disconnect();
      } catch {}
      tileWatchers.delete(prev);
    }
  }

  async function markRail(rail, idx) {
    const items = rail.querySelectorAll(TILE_SEL);
    if (!items || items.length <= RESULT_INDEX) {
      unmarkRail(rail);
      return;
    }

    const target = items[RESULT_INDEX];

    if (isRainSpinTile(target)) {
      unmarkRail(rail);
      watchUntilNotRainSpin(target);
      return;
    }

    if (lastMarked.get(rail) !== target) {
      unmarkRail(rail);
      lastMarked.set(rail, target);
    }

    const round = getCurrentRound();
    const slot = players[idx]?.slot;
    if (!round || slot == null) return;

    let ticket = null;
    try {
      ticket = await getTicketCached(round, slot);
    } catch {}

    if (liveTicketsFilter === 'off') {
      const existing = target.querySelector(':scope > .__tm-pf-badge');
      if (existing) existing.remove();
      return;
    }

    const reveal = (ticket != null) && liveTicketPasses(ticket);
    let badge = target.querySelector(':scope > .__tm-pf-badge');

    if (!reveal) {
      if (badge) badge.remove();
      return;
    }

    const label = `#${ticket}`;
    const cls = ticketClassByValue(ticket);

    if (!badge) {
      badge = document.createElement('div');
      badge.className = `__tm-pf-badge ${cls}`;
      badge.textContent = label;
      badge.style.position = 'absolute';
      badge.style.top = '20%';
      badge.style.left = '50%';
      badge.style.transform = 'translate(-50%, -50%)';
      target.style.position = target.style.position || 'relative';
      target.prepend(badge);
    } else {
      if (badge.textContent !== label) badge.textContent = label;
      const base = '__tm-pf-badge';
      const desired = cls ? `${base} ${cls}` : base;
      if (badge.className !== desired) badge.className = desired;
    }
  }

  function scanAndMark() {
    if (scanRaf) return;
    scanRaf = requestAnimationFrame(async () => {
      scanRaf = 0;

      if (!railsParent || !rails.length) {
        findRailsParentAndRails();
        if (!rails.length) return;

        if (spinObs) {
          try {
            spinObs.disconnect();
          } catch {}
        }
        spinObs = new MutationObserver(() => scanAndMark());
        spinObs.observe(railsParent, {
          subtree: true,
          childList: true
        });
      }

      for (let i = 0; i < rails.length; i++) {
        try {
          await markRail(rails[i], i);
        } catch {}
      }
    });
  }

  function startSpinHighlighter() {
    stopSpinHighlighter();
    ticketCache.clear();
    findRailsParentAndRails();
    startRoundWatch();
    setTimeout(scanAndMark, 0);

    if (!rails.length) {
      spinObs = new MutationObserver(() => scanAndMark());
      spinObs.observe(document.body, {
        subtree: true,
        childList: true
      });
    }
  }

  function stopSpinHighlighter() {
    stopRoundWatch();
    if (spinObs) {
      try {
        spinObs.disconnect();
      } catch {}
    }
    spinObs = null;
    railsParent = null;
    rails = [];
    lastMarked.forEach(el => {
      const b = el.querySelector(':scope > .__tm-pf-badge');
      if (b) b.remove();
    });
    lastMarked.clear();
    ticketCache.clear();
    if (scanRaf) {
      cancelAnimationFrame(scanRaf);
      scanRaf = 0;
    }
    for (const [, obs] of tileWatchers) {
      try {
        obs.disconnect();
      } catch {}
    }
    tileWatchers.clear();
  }

  function removeAllResultBadges() {
    try {
      document.querySelectorAll('.__tm-pf-badge').forEach(n => n.remove());
    } catch {}
  }

  function formatJackpot(v) {
    return Number.isFinite(v) ? v.toFixed(10) : '—';
  }

  async function computeAndShowJackpot() {
    if (!els?.jackpotRoll) return;

    const server = fairness.firstServerSeed;
    const eosBlockHash = fairness.firstClientSeed;
    const lastRoundNum = autoRounds;
    if (!server || !eosBlockHash || !Number.isFinite(lastRoundNum) || lastRoundNum <= 0) {
      els.jackpotRoll.textContent = '—';
      return;
    }

    try {
      const float = (await getFloats(server, eosBlockHash, `${lastRoundNum}:jackpot`, 1))[0];
      els.jackpotRoll.textContent = formatJackpot(float);
    } catch {
      els.jackpotRoll.textContent = '—';
    }
  }

  function startRoundWatch() {
    stopRoundWatch();
    lastRoundSeen = getCurrentRound();
    roundPoll = window.setInterval(() => {
      const r = getCurrentRound();
      if (!r) return;
      if (lastRoundSeen !== r) {
        lastRoundSeen = r;
        ticketCache.clear();
        scanAndMark();
      }
    }, 250);
  }

  function stopRoundWatch() {
    if (roundPoll) {
      clearInterval(roundPoll);
      roundPoll = 0;
    }
    lastRoundSeen = null;
  }

  let settleTimer = null;
  let settleMaxY = null;

  function setTotalRoundsLocked(y) {
    if (typeof y !== 'number' || y <= 0 || y > 1000) return;
    settleMaxY = Math.max(settleMaxY ?? 0, y);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (autoRounds == null && settleMaxY) {
        autoRounds = settleMaxY;
        if (els?.rounds) els.rounds.textContent = String(autoRounds);
        scheduleCompute();
        computeAndShowJackpot();
      }
      settleMaxY = null;
    }, 300);
  }

  function installRoundsObserver() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', installRoundsObserver, {
        once: true
      });
      return;
    }
    disconnectRoundsObserver();

    const initial = readTotalRoundsFromRoundLabel();
    if (initial) setTotalRoundsLocked(initial);

    let rafId = 0;
    const requestScan = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (autoRounds == null) {
          const y = readTotalRoundsFromRoundLabel();
          if (y) setTotalRoundsLocked(y);
        }
      });
    };

    roundsObserver = new MutationObserver((muts) => {
      if (autoRounds != null) return;
      for (const m of muts) {
        if (m.type === 'characterData' || (m.addedNodes && m.addedNodes.length) || m.type === 'attributes') {
          requestScan();
          break;
        }
      }
    });

    roundsObserver.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true
    });
  }

  function disconnectRoundsObserver() {
    if (roundsObserver) {
      try {
        roundsObserver.disconnect();
      } catch {}
    }
    roundsObserver = null;
    clearTimeout(settleTimer);
    settleTimer = null;
    settleMaxY = null;
  }

  function resetState(reason) {
    stopSpinHighlighter();
    stopRoundWatch();
    removeAllResultBadges();
    hmacKey = null;
    hmacKeySeed = null;
    count = 0;
    players = [];
    fairness = {
      captured: false,
      firstServerSeed: null,
      firstClientSeed: null,
      battleId: null
    };
    autoRounds = null;
    lastSig = null;
    clearTimeout(computeTimer);
    computeTimer = null;

    if (els) {
      els.count.textContent = '0';
      els.state.textContent = '—';
      els.players.textContent = '—';
      els.id.textContent = '—';
      els.clientSeed.textContent = '—';
      els.serverSeed.textContent = '—';
      els.rounds.textContent = '—';
      if (els.slotsWrap) els.slotsWrap.innerHTML = '';
      if (els.jackpotLabel) els.jackpotLabel.style.display = '';
      if (els.jackpotRoll) {
        els.jackpotRoll.style.display = '';
        els.jackpotRoll.textContent = '—';
      }
      if (els?.jackpotRoll) els.jackpotRoll.setAttribute('data-blur', '1');
    }
  }

  function scheduleCompute() {
    if (!ACTIVE || !els) return;

    if (
      fairness.firstServerSeed &&
      fairness.firstClientSeed &&
      Number.isFinite(autoRounds) && autoRounds > 0
    ) {
      computeAndShowJackpot();
    }

    if (!fairness.captured || !players.length || !autoRounds) return;

    const sig = [
      fairness.firstServerSeed,
      fairness.firstClientSeed,
      autoRounds,
      players.map(p => p.slot).join(',')
    ].join('|');

    if (sig === lastSig) return;
    lastSig = sig;

    clearTimeout(computeTimer);
    computeTimer = setTimeout(() => computeAndRender(autoRounds), 80);
  }

  function updateOverlay(evt) {
    ensureHost();
    if (ACTIVE) showCard();

    if (fairness.battleId && evt?._id && evt._id !== fairness.battleId) {
      disconnectRoundsObserver();
      resetState('event-changed-id');
      currentBattleId = evt._id;
      setTimeout(installRoundsObserver, 0);
    }
    if (els && evt?._id) els.id.textContent = evt._id;

    count++;
    if (els?.count) els.count.textContent = String(count);
    if (els?.state) els.state.textContent = evt?.state ?? '—';

    if (Array.isArray(evt?.players)) {
      const before = players.map(p => p.slot).join(',');
      const m = new Map();
      for (const p of evt.players) {
        if (typeof p?.slot === 'number' && !m.has(p.slot)) {
          m.set(p.slot, {
            slot: p.slot,
            username: p.username || `Slot ${p.slot}`
          });
        }
      }
      players = [...m.values()]
        .sort((a, b) => a.slot - b.slot)
        .slice(0, 6);

      if (els?.players) els.players.textContent = String(players.length);
      const after = players.map(p => p.slot).join(',');
      if (before !== after) scheduleCompute();
    }

    if (!fairness.captured) {
      const cs = evt?.fairness?.clientSeed;
      const ss = evt?.fairness?.serverSeed;
      if (typeof cs === 'string' && cs.length && typeof ss === 'string' && ss.length) {
        fairness.firstClientSeed = cs;
        fairness.firstServerSeed = ss;
        fairness.battleId = evt?._id || currentBattleId || null;
        fairness.captured = true;
        if (els) {
          els.clientSeed.textContent = trimMid(cs, 16);
          els.serverSeed.textContent = trimMid(ss, 16);
        }

        ticketCache.clear();
        scanAndMark();

        scheduleCompute();
      }
    }
  }
  const trimMid = (s, k = 12) => !s || s.length <= k * 2 + 3 ? (s || '—') : `${s.slice(0, k)}…${s.slice(-k)}`;

  async function hmacSha512Hex(keyStr, msgStr) {
    if (!hmacKey || hmacKeySeed !== keyStr) {
      hmacKey = await crypto.subtle.importKey('raw', enc.encode(keyStr), {
        name: 'HMAC',
        hash: 'SHA-512'
      }, false, ['sign']);
      hmacKeySeed = keyStr;
    }
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, enc.encode(msgStr)));
    let hex = '';
    hex = Array.from(sig, b => b.toString(16).padStart(2, '0')).join('');
    return hex;
  }
  async function getFloats(serverSeed, clientSeed, nonce, count) {
    const floats = [];
    let step = 0;
    let counter = 0;
    while (floats.length < count) {
      const hashHex = await hmacSha512Hex(serverSeed, `${clientSeed}:${nonce}:${step}`);
      while (counter < 16 && floats.length < count) {
        const bytes = [];
        for (let i = 0; i < 4; i++) {
          const start = i * 2 + counter * 8;
          bytes.push(parseInt(hashHex.substring(start, start + 2), 16));
        }
        const f = bytes.reduce((acc, v, i) => acc + v / Math.pow(256, i + 1), 0);
        floats.push(f);
        counter++;
      }
      counter = 0;
      step++;
    }
    return floats;
  }
  async function roll(serverSeed, clientSeed, roundNum, slot) {
    const float = (await getFloats(serverSeed, clientSeed, `${roundNum}:${slot}`, 1))[0];
    return Math.floor(float * 10000000 + 1);
  }

  async function tieBreakRoll(serverSeed, clientSeed, lastRoundNum, slot) {
    const float = (await getFloats(serverSeed, clientSeed, `${lastRoundNum}:${slot}:tie`, 1))[0];
    return Math.floor(float * (9999 - 1000 + 1) + 1000);
  }

  async function computeAndRender(rounds) {
    if (!els || !players.length) return;
    const server = fairness.firstServerSeed,
      client = fairness.firstClientSeed;
    els.slotsWrap.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (const p of players) {
      const id = `rows-${p.slot}`;
      const needsFoot = rounds > MAX_ROWS_VISIBLE;

      const details = document.createElement('details');
      details.className = 'slotcard';
      details.setAttribute('data-slot', String(p.slot));
      details.innerHTML = `
      <summary>
        <div class="slotid">Slot ${p.slot}</div>
        <div class="user" title="${escapeHtml(p.username)}">${escapeHtml(p.username)}</div>
        <div style="flex:1"></div>
        <div class="muted">click to open</div>
      </summary>
      <div class="rows" id="${id}"><pre style="margin:0"></pre></div>
      ${needsFoot ? `
        <div class="muted foot">
          Showing last ${MAX_ROWS_VISIBLE} of ${rounds} rounds —
          <button class="btn" data-full="${p.slot}">Show all</button>
        </div>` : ``}
    `;
      frag.appendChild(details);

      let rendered = false;
      const renderLastChunk = async () => {
        if (rendered) return;
        rendered = true;
        const pre = details.querySelector(`#${id} > pre`);
        const start = Math.max(1, rounds - MAX_ROWS_VISIBLE + 1);
        const lines = [];
        for (let r = start; r <= rounds; r++) {
          const v = await roll(server, client, r, p.slot);
          lines.push(`Round ${r}\t${v}`);
        }

        try {
          const tb = await tieBreakRoll(server, client, rounds, p.slot);
          lines.push(`Tiebreaker Roll:\t${tb}`);
        } catch {}

        pre.textContent = lines.join('\n');

        const btn = details.querySelector('button[data-full]');
        if (btn) {
          btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = 'Loading…';
            pre.textContent = '';
            const CHUNK = 200;
            let r = 1;
            const appendChunk = async () => {
              const to = Math.min(rounds, r + CHUNK - 1);
              const ls = [];
              for (; r <= to; r++) {
                const v = await roll(server, client, r, p.slot);
                ls.push(`R${r}\t${v}`);
              }
              pre.textContent += (pre.textContent ? '\n' : '') + ls.join('\n');

              if (r <= rounds) {
                setTimeout(appendChunk, 0);
              } else {
                try {
                  const tb = await tieBreakRoll(server, client, rounds, p.slot);
                  pre.textContent += `\nTiebreaker Roll:\t${tb}`;
                } catch {}
                btn.remove();
              }
            };
            appendChunk();
          });
        }
      };

      details.addEventListener('toggle', () => {
        const pre = details.querySelector(`#${id} > pre`);
        if (details.open) {
          if (!pre.textContent) renderLastChunk();
        } else {
          pre.textContent = '';
          rendered = false;
        }
      });
    }

    els.slotsWrap.appendChild(frag);
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    } [c]));
  }

  const parseMessage = async (data) => {
    try {
      if (typeof data === 'string') return JSON.parse(data);
      if (data instanceof Blob) return JSON.parse(await data.text());
      if (data instanceof ArrayBuffer) return JSON.parse(textDecoder.decode(new Uint8Array(data)));
      if (ArrayBuffer.isView(data)) return JSON.parse(textDecoder.decode(data));
      if (typeof data === 'object' && data) return data;
    } catch {}
    return null;
  };

  function extractEvent(parsed) {
    if (!parsed) return null;
    const payload = parsed.payload?.data || parsed.data || parsed.payload || parsed;
    return payload?.onCaseBattleEvent || null;
  }

  function WSWrapper(url, protocols) {
    const ws = protocols ? new NativeWS(url, protocols) : new NativeWS(url);

    ws.addEventListener('message', async (evt) => {
      const parsed = await parseMessage(evt.data);
      const eventObj = extractEvent(parsed);
      if (!eventObj) return;

      const onDetail = isDetail();
      const urlBattleId = pathBattleId();
      if (!onDetail || !urlBattleId) {

        return;
      }
      if (eventObj._id && eventObj._id !== urlBattleId) {
        return;
      }

      if (fairness.battleId && eventObj._id && fairness.battleId !== eventObj._id) {
        disconnectRoundsObserver();
        resetState('ws-event-different-id');
        currentBattleId = eventObj._id;
        stopSpinHighlighter();
        removeAllResultBadges();
        setTimeout(() => {
          installRoundsObserver();
          startSpinHighlighter();
        }, 0);
      }
      if (!fairness.battleId) {
        fairness.battleId = eventObj._id || currentBattleId || null;
      }
      if (ACTIVE) updateOverlay(eventObj);
    });

    return ws;
  }
  WSWrapper.prototype = NativeWS.prototype;
  Object.defineProperties(WSWrapper, {
    CONNECTING: {
      value: NativeWS.CONNECTING
    },
    OPEN: {
      value: NativeWS.OPEN
    },
    CLOSING: {
      value: NativeWS.CLOSING
    },
    CLOSED: {
      value: NativeWS.CLOSED
    }
  });
  window.WebSocket = WSWrapper;
  if ('MozWebSocket' in window) window.MozWebSocket = WSWrapper;

  window.addEventListener('tm:nav', () => {
    const wasDetail = ACTIVE;
    const prevId = currentBattleId;
    const nowDetail = isDetail();
    const nowMenu = isMenu();
    const newId = pathBattleId();

    if (nowDetail) {
      if (!wasDetail || newId !== prevId) {
        disconnectRoundsObserver();
        resetState('url-change-to-detail');
        currentBattleId = newId;
        if (isMinimized()) minimizeOverlay();
        else card.classList.remove('hidden');
        setTimeout(() => {
          installRoundsObserver();
          startSpinHighlighter();
          startRoundWatch();
        }, 0);
      }
      ACTIVE = true;
      return;
    }

    if (nowMenu) {
      disconnectRoundsObserver();
      stopSpinHighlighter();
      removeAllResultBadges();
      resetState('menu');
      setWaitingUI();
      ACTIVE = false;
      currentBattleId = null;
      return;
    }

    disconnectRoundsObserver();
    stopSpinHighlighter();
    removeAllResultBadges();
    resetState('left-detail');
    ACTIVE = false;
    currentBattleId = null;
    if (host && card) card.classList.add('hidden');
  });


  if (ACTIVE) {
    ensureHost();
    applyMinState();
    setTimeout(() => {
      installRoundsObserver();
      startSpinHighlighter();
      startRoundWatch();
    }, 0);
  }
})();