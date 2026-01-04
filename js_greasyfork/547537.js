// ==UserScript==
// @name         Nitro Type WS Logger - Day
// @namespace    https://nitrotype.com/
// @version      5.1
// @description  This Nitro Type script allows you to see everyone's race stats during a race. That includes everyone's current race session, avg speed, total races, etc. 
// @match        *://www.nitrotype.com/*
// @exclude      *://www.nitrotype.com/racer*
// @grant        none
// @run-at       document-start
// @author       Day
// @license      
// @downloadURL https://update.greasyfork.org/scripts/547537/Nitro%20Type%20WS%20Logger%20-%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/547537/Nitro%20Type%20WS%20Logger%20-%20Day.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID   = 'nt-rightcards-panel';
  const CONTENT_ID = 'nt-rightcards-content';
  const EVENTS_ID  = 'nt-rightcards-events';
  const MAX_WS_LOG = 2000;
  const MAX_EVENTS = 40;
  const MAX_SLOTS  = 5;

  const profiles  = new Map();   // uid -> profile
  const raceLive  = new Map();   // uid -> {n,e}
  const wsLog     = [];
  const eventsLog = [];
  const slotOf    = new Map();   // uid -> slot index
  const slotUID   = new Array(MAX_SLOTS).fill(null); // slot -> uid
  const freeSlots = [];          // queue of freed slot indexes (FIFO)

  let copyNote = null;
  let myUserId = null;

  const isRace = () => location.pathname.startsWith('/race');

  // ---------- routing ----------
  function onRouteChange() { isRace() ? mountPanel() : unmountPanel(); }
  (function hookHistory() {
    const ps = history.pushState, rs = history.replaceState;
    history.pushState    = function () { const r = ps.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
    history.replaceState = function () { const r = rs.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
    addEventListener('popstate', () => queueMicrotask(onRouteChange));
  })();
  setInterval(onRouteChange, 750);

  // ---------- ui ----------
  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    Object.assign(panel.style, {
      position: 'fixed',
      top: '30px',
      right: '0',
      width: '260px',
      height: '480px',
      background: 'linear-gradient(180deg,#d50000 0%, #5a0000 50%, #000000 100%)',
      color: '#fff',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: '10px',
      lineHeight: '1.2',
      padding: '6px 8px',
      borderLeft: '2px solid #fff',
      borderRadius: '8px 0 0 8px',
      boxShadow: '0 0 12px rgba(213,0,0,0.6)',
      zIndex: '999999',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    });

    const header = document.createElement('div');
    header.textContent = 'Race Roster (WS)';
    Object.assign(header.style, {
      fontWeight: '800',
      fontSize: '11px',
      paddingBottom: '4px',
      borderBottom: '1px solid rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#fff'
    });

    const spacer = document.createElement('div'); Object.assign(spacer.style, { flex: '1 1 auto' });

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    Object.assign(copyBtn.style, {
      background: '#fff', color: '#b50000', border: 'none', padding: '2px 5px',
      fontSize: '9px', borderRadius: '5px', cursor: 'pointer', fontWeight: '700'
    });
    copyBtn.addEventListener('click', copyAllWS);

    copyNote = document.createElement('div');
    copyNote.textContent = 'WS: 0';
    Object.assign(copyNote.style, { fontSize: '9px', opacity: '0.9', color: '#fff' });

    header.append(spacer, copyBtn, copyNote);

    const content = document.createElement('div');
    content.id = CONTENT_ID;
    Object.assign(content.style, {
      flex: '1 1 auto',
      overflowY: 'auto',
      paddingTop: '4px',
      paddingRight: '3px',
      scrollbarWidth: 'thin'
    });

    const events = document.createElement('div');
    events.id = EVENTS_ID;
    Object.assign(events.style, {
      borderTop: '1px solid rgba(255,255,255,0.5)',
      paddingTop: '4px',
      paddingBottom: '2px',
      fontSize: '9px',
      whiteSpace: 'nowrap',
      overflowX: 'auto',
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      color: '#fff'
    });
    const evLabel = document.createElement('div');
    evLabel.textContent = 'Events:';
    Object.assign(evLabel.style, { fontWeight: '700', color: '#fff' });
    events.appendChild(evLabel);

    panel.append(header, content, events);
    document.body.appendChild(panel);
  }

  function mountPanel() { if (!document.body) return; ensurePanel(); renderAll(); }
  function unmountPanel() {
    const p = document.getElementById(PANEL_ID);
    if (p && p.parentNode) p.parentNode.removeChild(p);
    slotOf.clear(); slotUID.fill(null); freeSlots.length = 0;
    profiles.clear(); raceLive.clear();
  }

  // ---------- rendering ----------
  const fmtNum = n => (typeof n === 'number' ? n.toLocaleString() : '—');
  const asNum  = n => (typeof n === 'number' ? n : undefined);
  function cleanDisplayName(str, fallback) {
    const s = (str ?? '').toString().trim();
    if (/^you$/i.test(s)) return fallback || '';
    return s || fallback || '';
  }
  function nameFor(uid) {
    const p = profiles.get(uid) || {};
    const user = (p.username || '').toString().trim();
    return cleanDisplayName(p.displayName, user || String(uid));
  }

  function cardHTML(uid) {
    const p    = profiles.get(uid) || {};
    const live = raceLive.get(uid) || {};
    const name = nameFor(uid);

    const avg  = fmtNum(asNum(p.avgSpeed));
    const hi   = fmtNum(asNum(p.highestSpeed));
    const cls  = (typeof p.inClass === 'number') ? p.inClass : '—';
    const sess = fmtNum(asNum(p.sessionRaces));
    const tot  = fmtNum(asNum(p.racesPlayed));
    const ne   = [(typeof live.n === 'number') ? `${live.n} nitros` : null,
                  (typeof live.e === 'number') ? `${live.e} errors` : null].filter(Boolean).join(' / ') || '—';

    return `
      <div style="margin:4px 0; padding:4px; border:1px solid rgba(255,255,255,0.3);
                  background: rgba(0,0,0,0.35); border-radius:6px;">
        <div style="font-weight:700; font-size:11px; margin-bottom:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;">${name}</div>
        <div>Avg ${avg} • High ${hi} • Class ${cls}</div>
        <div>Session ${sess} • Total ${tot}</div>
        <div>This Race (n/e): ${ne}</div>
      </div>
    `;
  }

  function renderAll() {
    const container = document.getElementById(CONTENT_ID);
    if (!container) return;
    const cards = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      const uid = slotUID[i];
      if (uid == null) {
        cards.push(`
          <div style="margin:4px 0; padding:4px; border:1px dashed rgba(255,255,255,0.3);
                      background: rgba(0,0,0,0.25); border-radius:6px; opacity:.65;">
            <div style="font-weight:700; color:#fff;">Slot ${i + 1}</div>
            <div>Waiting…</div>
          </div>`);
      } else {
        cards.push(cardHTML(uid));
      }
    }
    container.innerHTML = cards.join('');
    if (copyNote) copyNote.textContent = `WS: ${wsLog.length}`;
    renderEvents();
  }

  // ---------- slotting & recycling ----------
  function getOrAssignSlot(uid) {
    if (slotOf.has(uid)) return slotOf.get(uid);

    // Prefer reusing the exact freed slot
    let slot;
    if (freeSlots.length) {
      slot = freeSlots.shift();
    } else {
      for (let i = 0; i < MAX_SLOTS; i++) {
        if (slotUID[i] == null) { slot = i; break; }
      }
      if (slot == null) return -1; // already showing 5
    }
    slotUID[slot] = uid;
    slotOf.set(uid, slot);
    return slot;
  }

  function removeUID(uid) {
    if (!slotOf.has(uid)) return;
    const slot = slotOf.get(uid);
    slotOf.delete(uid);
    if (slotUID[slot] === uid) {
      slotUID[slot] = null;
      freeSlots.push(slot);       // record freed slot for the next joiner
    }
    raceLive.delete(uid);
  }

  // ---------- events ----------
  function pushEvent(kind, summary, ts = Date.now()) {
    eventsLog.push({ ts, kind, summary });
    if (eventsLog.length > MAX_EVENTS) eventsLog.splice(0, eventsLog.length - MAX_EVENTS);
    renderEvents();
  }
  function renderEvents() {
    const box = document.getElementById(EVENTS_ID);
    if (!box) return;
    while (box.children.length > 1) box.removeChild(box.lastChild);
    const last = eventsLog.slice(-12);
    for (const ev of last) {
      const chip = document.createElement('div');
      chip.textContent = `[${new Date(ev.ts).toLocaleTimeString()}] ${ev.kind}: ${ev.summary}`;
      Object.assign(chip.style, {
        padding: '1px 4px',
        background: 'rgba(213,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        fontSize: '9px',
        color: '#fff'
      });
      box.appendChild(chip);
    }
  }

  // ---------- clipboard ----------
  async function copyAllWS() {
    const blob = wsLog.map(({ ts, data }) => `[${new Date(ts).toISOString()}] ${data}`).join('\n');
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(blob);
      else { const ta = document.createElement('textarea'); ta.value = blob; document.body.appendChild(ta);
             ta.select(); document.execCommand('copy'); ta.remove(); }
    } finally {
      if (copyNote) copyNote.textContent = `Copied ${wsLog.length} WS msgs`;
    }
  }

  // ---------- ws capture ----------
  const origAddEventListener = WebSocket.prototype.addEventListener;
  const origOnMessageDesc   = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');

  function cleanProfile(uid, prof) {
    profiles.set(uid, {
      ...profiles.get(uid),
      ...prof,
      displayName: cleanDisplayName(prof?.displayName, prof?.username || String(uid)),
    });
  }

  // Heuristics to detect a "leave" inside update payloads
  function isLeaveObj(r) {
    if (!r) return false;
    if (r.left === true || r.left === 1) return true;
    if (r.l === true || r.l === 1) return true;
    if (typeof r.status === 'string' && r.status.toLowerCase() === 'left') return true;
    if (r.action === 'left' || r.event === 'left') return true;
    return false;
  }

  function handleRaceMsg(kind, payload) {
    // Full roster on setup
    if (kind === 'setup' && Array.isArray(payload?.racers)) {
      const present = new Set();
      freeSlots.length = 0; // new race cycle
      for (const r of payload.racers) {
        const uid = r.userID ?? r.u ?? r.profile?.userID;
        if (uid == null) continue;
        if (r.profile) cleanProfile(uid, r.profile);
        if (typeof r.n === 'number' || typeof r.e === 'number') {
          const prev = raceLive.get(uid) || {};
          raceLive.set(uid, { n: (typeof r.n === 'number' ? r.n : prev.n), e: (typeof r.e === 'number' ? r.e : prev.e) });
        }
        if (myUserId === null && typeof uid === 'number') myUserId = uid;
        present.add(uid);
      }
      // Assign/keep slots for everyone present
      for (const uid of present) getOrAssignSlot(uid);
      renderAll();
      return;
    }

    // A single racer joined → reuse freed slot if any
    if (kind === 'joined' && payload?.profile) {
      const uid = payload.userID ?? payload.u ?? payload.profile?.userID;
      if (uid != null) {
        cleanProfile(uid, payload.profile);
        getOrAssignSlot(uid);
        renderAll();
      }
      return;
    }

    // Periodic updates
    if (kind === 'update' && Array.isArray(payload?.racers)) {
      for (const r of payload.racers) {
        const uid = r.u ?? r.userID ?? r.profile?.userID;
        if (uid == null) continue;

        if (isLeaveObj(r)) {
          // free their slot so the next joiner inherits it
          removeUID(uid);
          continue;
        }

        // regular stat update
        const prev = raceLive.get(uid) || {};
        raceLive.set(uid, {
          n: (typeof r.n === 'number' ? r.n : prev.n),
          e: (typeof r.e === 'number' ? r.e : prev.e),
        });

        // If this racer wasn't slotted yet (e.g., joined quietly), slot them now
        if (!slotOf.has(uid)) getOrAssignSlot(uid);
      }
      renderAll();
      return;
    }

    // Explicit leave message (some servers send this)
    if ((kind === 'left' || kind === 'leave') && (payload?.u != null || payload?.userID != null)) {
      const uid = payload.u ?? payload.userID;
      removeUID(uid);
      renderAll();
      return;
    }

    // Include any top-level events
    const maybe = payload?.events ?? payload?.event ?? null;
    if (maybe) {
      const arr = Array.isArray(maybe) ? maybe : [maybe];
      for (const ev of arr) {
        const summary = (typeof ev === 'object') ? JSON.stringify(ev) : String(ev);
        pushEvent(kind, summary);
      }
    }
  }

  function handleMessageData(raw) {
    try {
      wsLog.push({ ts: Date.now(), data: raw });
      if (wsLog.length > MAX_WS_LOG) wsLog.splice(0, wsLog.length - MAX_WS_LOG);
      if (typeof raw !== 'string' || (!raw.startsWith('4') && !raw.startsWith('5'))) return;

      let msg; try { msg = JSON.parse(raw.slice(1)); } catch { return; }
      if (msg?.stream === 'race') handleRaceMsg(msg.msg, msg.payload || {});
      const root = msg?.events ?? msg?.event ?? null;
      if (root) {
        const arr = Array.isArray(root) ? root : [root];
        for (const ev of arr) {
          const summary = (typeof ev === 'object') ? JSON.stringify(ev) : String(ev);
          pushEvent(msg?.msg || 'event', summary);
        }
      }
      if (copyNote) copyNote.textContent = `WS: ${wsLog.length}`;
    } catch {}
  }

  WebSocket.prototype.addEventListener = function (type, listener, opts) {
    if (type === 'message') {
      const wrapped = (evt) => { handleMessageData(evt.data); return listener.call(this, evt); };
      return origAddEventListener.call(this, type, wrapped, opts);
    }
    return origAddEventListener.call(this, type, listener, opts);
  };
  Object.defineProperty(WebSocket.prototype, 'onmessage', {
    configurable: true, enumerable: true,
    get() { return origOnMessageDesc && origOnMessageDesc.get ? origOnMessageDesc.get.call(this) : this._nt_onmessage; },
    set(handler) {
      const wrapped = handler ? (evt) => { handleMessageData(evt.data); return handler.call(this, evt); } : null;
      if (origOnMessageDesc && origOnMessageDesc.set) origOnMessageDesc.set.call(this, wrapped);
      else this._nt_onmessage = wrapped;
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onRouteChange);
  else onRouteChange();
})();
