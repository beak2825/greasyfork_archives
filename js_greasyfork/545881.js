// ==UserScript==
// @name         Nitro Type WS Logger (UI only on /race)
// @namespace    https://nitrotype.com/
// @version      3.4
// @description  Captures all WS frames site-wide; shows roster panel ONLY on /race (with Copy WS)
// @match        *://www.nitrotype.com/race*
// @match        *://www.nitrotype.com/race/*
// @exclude      *://www.nitrotype.com/racer*
// @grant        none
// @run-at       document-idle
// @author       Day
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545881/Nitro%20Type%20WS%20Logger%20%28UI%20only%20on%20race%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545881/Nitro%20Type%20WS%20Logger%20%28UI%20only%20on%20race%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID = 'nt-ws-roster-panel';
  const CONTENT_ID = 'nt-ws-roster-content';
  const MAX_WS_LOG = 2000; // cap for raw frames

  // Live race bits we keep (nitros/errors only)
  const raceLive = new Map();   // uid -> { n, e }
  // Profiles from setup/joined
  const profiles = new Map();   // uid -> profile
  // Raw WS messages store (for Copy WS)
  const wsLog = [];             // {ts: number, data: string}

  let myUserId = null;
  let ui = null;
  let copyNote = null;

  // ---------- Route helpers (SPA-safe) ----------
  const isRace = () => location.pathname.startsWith('/race');

  function onRouteChange() {
    if (isRace()) mountPanel();
    else unmountPanel();
  }

  // watch pushState/replaceState + popstate
  (function hookHistory(){
    const ps = history.pushState, rs = history.replaceState;
    history.pushState = function() { const r = ps.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
    history.replaceState = function() { const r = rs.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
    window.addEventListener('popstate', () => queueMicrotask(onRouteChange));
  })();

  // also poll occasionally in case the app swaps without history events
  setInterval(() => { onRouteChange(); }, 750);

  // ---------- UI ----------
  function ensurePanelElement() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    Object.assign(panel.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '360px',
      maxHeight: '460px',
      background: '#000',
      color: '#0f0',
      fontSize: '11px',
      fontFamily: 'monospace',
      padding: '8px',
      border: '2px solid lime',
      borderRadius: '6px',
      zIndex: '999999',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.35',
      boxSizing: 'border-box',
    });

    const content = document.createElement('div');
    content.id = CONTENT_ID;
    content.textContent = '🟢 WS Logger Ready...\n(Waiting for roster & updates on /race)';
    panel.appendChild(content);

    // bottom toolbar
    const toolbar = document.createElement('div');
    Object.assign(toolbar.style, {
      position: 'sticky',
      bottom: '0',
      left: '0',
      right: '0',
      marginTop: '6px',
      paddingTop: '6px',
      background: 'linear-gradient(to top, #000, rgba(0,0,0,0.6))',
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      borderTop: '1px solid #0f0',
    });

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy WS';
    Object.assign(copyBtn.style, {
      background: '#0f0',
      color: '#000',
      border: 'none',
      padding: '4px 8px',
      fontFamily: 'monospace',
      fontSize: '11px',
      borderRadius: '4px',
      cursor: 'pointer',
    });
    copyBtn.addEventListener('click', copyAllWS);

    copyNote = document.createElement('span');
    Object.assign(copyNote.style, {
      color: '#9f9',
      fontSize: '10px',
      opacity: '0.9',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '220px',
    });
    copyNote.textContent = 'WS captured: 0';

    toolbar.appendChild(copyBtn);
    toolbar.appendChild(copyNote);
    panel.appendChild(toolbar);

    return panel;
  }

  function mountPanel() {
    if (!document.body) return;
    if (ui && document.body.contains(ui)) return;
    ui = ensurePanelElement();
    document.body.appendChild(ui);
    updateDisplay(); // render latest when (re)mounting
  }

  function unmountPanel() {
    if (ui && ui.parentNode) {
      ui.parentNode.removeChild(ui);
    }
  }

  const fmtNum = (n) => (typeof n === 'number' ? n.toLocaleString() : undefined);
  const asNum = (n) => (typeof n === 'number' ? n : undefined);

  function nameFor(uid) {
    const p = profiles.get(uid);
    if (p?.displayName && String(p.displayName).trim()) return String(p.displayName).trim();
    if (p?.username) return p.username;
    if (typeof uid === 'string' && uid.startsWith('robot')) return 'Bot';
    return String(uid);
  }

  function lineIf(label, v, suffix = '') {
    if (v === undefined || v === null || v === '') return null;
    return `  ${label}: ${v}${suffix}`;
  }

  function liveLine(uid) {
    const r = raceLive.get(uid) || {};
    const hasN = typeof r.n === 'number';
    const hasE = typeof r.e === 'number';
    if (!hasN && !hasE) return null;
    return `  This Race: ${hasN ? `${r.n} nitros` : ''}${hasN && hasE ? ', ' : ''}${hasE ? `${r.e} errors` : ''}`;
  }

  function extrasLine(p) {
    const extras = [];
    if (typeof p.avgAcc === 'number') extras.push(`Avg Acc ${p.avgAcc}%`);
    if (typeof p.wampusWins === 'number') extras.push(`${p.wampusWins} Wampus wins`);
    if (typeof p.consecDaysRaced === 'number') extras.push(`${p.consecDaysRaced} consec days`);
    if (!extras.length) return null;
    return `  ${extras.join(' · ')}`;
  }

  function updateDisplay() {
    if (!isRace()) return; // UI only on /race
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const content = document.getElementById(CONTENT_ID);
    if (!content) return;

    const uids = new Set([...profiles.keys(), ...raceLive.keys()]);

    // Sort: you first, then alphabetical
    const sorted = [...uids].sort((a, b) => {
      if (a === myUserId) return -1;
      if (b === myUserId) return 1;
      return nameFor(a).toLowerCase().localeCompare(nameFor(b).toLowerCase());
    });

    const out = ['📋 Race Roster (Account Stats + n/e)\n'];
    if (!sorted.length) {
      out.push('(waiting for WS setup/joined/update...)');
    } else {
      for (const uid of sorted) {
        const p = profiles.get(uid) || {};
        const you = uid === myUserId ? '🟩 You' : `👤 ${nameFor(uid)}`;
        out.push(you);

        const cls   = asNum(p.inClass);
        const sess  = asNum(p.sessionRaces);
        const avg   = asNum(p.avgSpeed);
        const hi    = asNum(p.highestSpeed);
        const total = asNum(p.racesPlayed);
        const longS = asNum(p.longestSession);

        const lines = [
          lineIf('Class', cls),
          lineIf('Session Races', fmtNum(sess)),
          lineIf('Avg WPM', fmtNum(avg)),
          lineIf('High WPM', fmtNum(hi)),
          lineIf('Total Races', fmtNum(total)),
          lineIf('Longest Session', fmtNum(longS)),
          extrasLine(p),
          liveLine(uid),
        ].filter(Boolean);

        if (lines.length) out.push(...lines);
        out.push('');
      }
    }

    content.innerHTML = out.join('\n');

    if (copyNote) copyNote.textContent = `WS captured: ${wsLog.length}`;
  }

  // ---------- Copy raw WS ----------
  async function copyAllWS() {
    const lines = wsLog.map(({ ts, data }) => `[${new Date(ts).toISOString()}] ${String(data)}`);
    const blob = lines.join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(blob);
      } else {
        const ta = document.createElement('textarea');
        ta.value = blob;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      if (copyNote) copyNote.textContent = `Copied ${lines.length} WS msgs`;
    } catch (e) {
      if (copyNote) copyNote.textContent = `Copy failed: ${e?.message || e}`;
    }
  }

  // ---------- WS hook (captures all pages) ----------
  const nativeAddEventListener = WebSocket.prototype.addEventListener;

  WebSocket.prototype.addEventListener = function (type, listener, options) {
    if (type === 'message') {
      const wrapped = function (event) {
        try {
          // store everything raw
          wsLog.push({ ts: Date.now(), data: event.data });
          if (wsLog.length > MAX_WS_LOG) wsLog.splice(0, wsLog.length - MAX_WS_LOG);

          // parse race frames for panel
          let raw = event.data;
          if (typeof raw === 'string' && (raw.startsWith('4') || raw.startsWith('5'))) {
            const body = raw.slice(1);
            let msg;
            try { msg = JSON.parse(body); } catch { /* not JSON */ }

            if (msg?.stream === 'race') {
              const { msg: kind, payload = {} } = msg;

              // setup/joined → harvest profiles
              if (kind === 'setup' && Array.isArray(payload.racers)) {
                for (const r of payload.racers) {
                  const uid = r.userID ?? r.u ?? r.profile?.userID;
                  if (uid != null && r.profile) profiles.set(uid, r.profile);
                }
                updateDisplay();
              }

              if (kind === 'joined' && payload) {
                const uid = payload.userID ?? payload.u ?? payload.profile?.userID;
                if (uid != null && payload.profile) profiles.set(uid, payload.profile);
                updateDisplay();
              }

              // update → keep n/e + learn myUserId
              if (kind === 'update' && Array.isArray(payload.racers)) {
                for (const r of payload.racers) {
                  if (r.u == null) continue;
                  const prev = raceLive.get(r.u) || {};
                  const next = {
                    n: typeof r.n === 'number' ? r.n : prev.n,
                    e: typeof r.e === 'number' ? r.e : prev.e
                  };
                  raceLive.set(r.u, next);
                  if (myUserId === null && typeof r.u === 'number') myUserId = r.u;
                }
                updateDisplay();
              }
            }
          }
        } catch {
          // never break the page/socket
        }

        return listener.call(this, event);
      };

      return nativeAddEventListener.call(this, type, wrapped, options);
    }
    return nativeAddEventListener.call(this, type, listener, options);
  };

  // Initial mount state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onRouteChange);
  } else {
    onRouteChange();
  }
})();

