// ==UserScript==
// @name         Discord↔Torn Reviver (All-in-One v1.3.5 — Lean UI, blocklist only)
// @namespace    comfy.torn.tools.allinone
// @version      1.3.5
// @description  Lean UI: block by faction phrases (bots only, case-insensitive, exact phrase w/ flexible whitespace). Keeps Doctor-once, per-message/XID dedupe, 2s coalesce, and Torn auto-close.
// @match        https://discord.com/channels/*/*
// @match        https://ptb.discord.com/channels/*/*
// @match        https://canary.discord.com/channels/*/*
// @match        https://www.torn.com/profiles*
// @match        https://www.torn.com/hospitalview.php*
// @license      MIT
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545965/Discord%E2%86%94Torn%20Reviver%20%28All-in-One%20v135%20%E2%80%94%20Lean%20UI%2C%20blocklist%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545965/Discord%E2%86%94Torn%20Reviver%20%28All-in-One%20v135%20%E2%80%94%20Lean%20UI%2C%20blocklist%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const IS_DISCORD = /(?:^|\.)discord\.com$/i.test(location.hostname);
  const IS_TORN    = /(?:^|\.)torn\.com$/i.test(location.hostname);

  const log = (...a) => console.log('[Reviver]', ...a);
  const now = () => Date.now();

  // ---------- Shared helpers ----------
  function normalizeUrl(u) {
    u = (u || '').trim();
    while (/[.,);!?:\]}>\"']$/.test(u)) u = u.slice(0, -1);
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { return new URL(u).href; } catch { return u; }
  }
  function isTornProfile(url) {
    try {
      const u = new URL(url);
      const host = (u.hostname || '').toLowerCase();
      if (!(host === 'torn.com' || host.endsWith('.torn.com'))) return false;
      const path = (u.pathname || '').toLowerCase();
      if (path !== '/profiles.php') return false;
      const xidQ = u.searchParams.get('XID') || u.searchParams.get('xid');
      if (xidQ && /^\d+$/.test(xidQ)) return true;
      if (u.hash) {
        if (/#\/\d+/.test(u.hash)) return true;
        if (/[?&#]XID=(\d+)/i.test(u.hash)) return true;
      }
      return false;
    } catch { return false; }
  }
  function makeToken() { return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }
  function addToken(url, token) { try { const u = new URL(url); u.searchParams.set('tmc', token); return u.href; } catch { return url + (url.includes('?') ? '&' : '?') + 'tmc=' + token; } }

  // ==================================================
  //                 DISCORD SIDE
  // ==================================================
  if (IS_DISCORD) {
    const COALESCE_MS = 2000;
    const MAX_PER_MIN = 20;
    const PRUNE_KEEP  = 800;
    const CFG_KEY     = 'reviver_block_cfg_v135';

    // --- Lean config: only enable + phrases
    const defaultCfg = {
      enabled: true,
      // fixed behavior (not exposed in UI):
      // botsOnly=true, caseSensitive=false, exactPhrase=true, mode='any', applyToCommands=false
      words: []
    };
    let cfg = loadCfg();
    function loadCfg() {
      try {
        const raw = GM_getValue(CFG_KEY, null);
        const o = raw ? JSON.parse(raw) : null;
        if (!o) return { ...defaultCfg };
        return { ...defaultCfg, ...o, words: Array.isArray(o.words) ? o.words : [] };
      } catch { return { ...defaultCfg }; }
    }
    function saveCfg() { try { GM_setValue(CFG_KEY, JSON.stringify(cfg)); } catch {} }

    // Per-channel stores
    function getGuildAndChannel() {
      const m = location.pathname.match(/\/channels\/(\d+)\/(\d+)/);
      return m ? { guildId: m[1], channelId: m[2] } : { guildId: '', channelId: '' };
    }
    const { channelId } = getGuildAndChannel();

    const STORE_KEY    = 'revive_seen_' + channelId;         // per-message/XID dedupe
    const DOC_SEEN_KEY = 'revive_doctor_once_' + channelId;  // @Doctor handled once

    let seen = loadSeen();
    function loadSeen() { try { const j = localStorage.getItem(STORE_KEY); const o = j ? JSON.parse(j) : {}; return o && typeof o === 'object' ? o : {}; } catch { return {}; } }
    function saveSeen() {
      try {
        const keys = Object.keys(seen);
        if (keys.length > PRUNE_KEEP) {
          keys.sort((a,b)=>(seen[a].t||0)-(seen[b].t||0));
          for (let i=0;i<keys.length-PRUNE_KEEP;i++) delete seen[keys[i]];
        }
        localStorage.setItem(STORE_KEY, JSON.stringify(seen));
      } catch {}
    }
    function hasOpenedForMessage(mid, xid) { const r = seen[mid]; return !!(r && (r.xids||[]).includes(String(xid))); }
    function markOpenedForMessage(mid, xid) {
      if (!seen[mid]) seen[mid] = { xids: [], t: now() };
      const set = seen[mid].xids, sx = String(xid);
      if (!set.includes(sx)) set.push(sx);
      seen[mid].t = now();
      saveSeen();
    }

    let docOnce = loadDocOnce();
    function loadDocOnce() { try { const j = localStorage.getItem(DOC_SEEN_KEY); const o = j ? JSON.parse(j) : {}; return o && typeof o === 'object' ? o : {}; } catch { return {}; } }
    function saveDocOnce() {
      try {
        const MAX = 3000;
        const keys = Object.keys(docOnce);
        if (keys.length > MAX) {
          keys.sort((a,b)=>(docOnce[a]||0)-(docOnce[b]||0));
          for (let i=0;i<keys.length-MAX;i++) delete docOnce[keys[i]];
        }
        localStorage.setItem(DOC_SEEN_KEY, JSON.stringify(docOnce));
      } catch {}
    }
    function docAlreadyHandled(mid) { return !!docOnce[mid]; }
    function markDoctorHandled(mid) { docOnce[mid] = Date.now(); saveDocOnce(); }

    // Exposed testing helpers (collapsed in UI)
    const recentByXid = new Map();
    const rateTimes = [];
    function clearDoctorOnce() { try { localStorage.removeItem(DOC_SEEN_KEY); } catch {} docOnce = {}; }
    function clearSeenStore()  { try { localStorage.removeItem(STORE_KEY);  } catch {} seen = {}; }
    function clearCoalesceRate(){ try { recentByXid.clear(); } catch {} ; try { rateTimes.length = 0; } catch {} }
    function forceRescanNow()  { document.querySelectorAll('article,[role="article"],[data-list-item-id^="chat-messages"]').forEach(enqueue); }
    function insertTestMessage() {
      document.querySelectorAll('article[data-reviver-mock]').forEach(n => n.remove());
      const html = `
        <h3>WTF Bro?! <span class="botTag">APP</span></h3>
        <div class="messageContent_c19a55">
          <span class="mention">@Doctor</span>
          <div class="embedFieldName">Target</div>
          <div class="embedFieldValue">(The Expendables)</div>
          <div class="embedFieldName">Target Link</div>
          <div class="embedFieldValue">
            <a href="https://www.torn.com/profiles.php?XID=301482"
               title="https://www.torn.com/profiles.php?XID=301482"
               target="_blank">https://www.torn.com/profiles.php?XID=301482</a>
          </div>
        </div>`;
      const msg = document.createElement('article');
      msg.setAttribute('role', 'article');
      msg.setAttribute('data-reviver-mock','1');
      msg.style.cssText = 'margin:8px;padding:8px;border:1px dashed #555;border-radius:8px;';
      msg.innerHTML = html;
      (document.querySelector('[role="main"]') || document.body).appendChild(msg);
      console.log('[Reviver] Inserted mock message.');
      forceRescanNow();
    }
    window.reviverTest = { clearDoctorOnce, clearSeenStore, clearCoalesceRate, forceRescanNow, insertTestMessage };

    // --- Lean UI
    function makeUi() {
      const gear = document.createElement('button');
      gear.textContent = '⚙';
      Object.assign(gear.style, {
        position: 'fixed', right: '10px', top: '10px', zIndex: 999999,
        width: '26px', height: '26px', lineHeight: '26px', textAlign: 'center',
        borderRadius: '8px', border: '1px solid #444', background: 'rgba(28,30,33,.9)',
        color: '#eee', cursor: 'pointer'
      });
      document.body.appendChild(gear);

      const panel = document.createElement('div');
      Object.assign(panel.style, {
        position: 'fixed', right: '10px', top: '44px', zIndex: 999999,
        width: '360px', background: 'rgba(20,22,25,.96)', color: '#eaeaea',
        border: '1px solid #444', borderRadius: '10px', padding: '10px 12px',
        font: '12px system-ui,Segoe UI,Roboto,Arial', display: 'none',
        boxShadow: '0 8px 22px rgba(0,0,0,.35)'
      });

      panel.innerHTML = `
        <div style="font-weight:700;margin-bottom:8px">Reviver – Blocklist</div>
        <label style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
          <input type="checkbox" id="bl_enabled"> Enable blocklist
        </label>
        <div style="margin:6px 0 4px">Factions to BLOCK (one per line):</div>
        <textarea id="bl_words" rows="8" style="width:100%;resize:vertical;background:#111;border:1px solid #555;color:#eee;border-radius:6px;padding:6px" placeholder="The Expendables&#10;The Next Level&#10;Monarch Research"></textarea>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button id="bl_save"  style="padding:6px 10px;border-radius:6px;border:1px solid #2a7;background:#38d;color:#000;cursor:pointer">Save</button>
          <button id="bl_close" style="padding:6px 10px;border-radius:6px;border:1px solid #555;background:#ddd;color:#000;cursor:pointer">Close</button>
        </div>

        <div id="reviver-tools" style="margin-top:10px;border-top:1px solid #444;padding-top:8px">
          <button id="tools_toggle" style="padding:4px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;cursor:pointer">Testing tools ▸</button>
          <div id="tools_body" style="display:none;margin-top:8px;display:none">
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <button id="bl_clear_doc"  style="padding:6px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;cursor:pointer">Clear @Doctor handled IDs</button>
              <button id="bl_clear_seen" style="padding:6px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;cursor:pointer">Clear per-message/XID dedupe</button>
              <button id="bl_clear_all"  style="padding:6px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;cursor:pointer">Clear ALL (doctor+dedupe+coalesce)</button>
              <button id="bl_rescan"     style="padding:6px 8px;border-radius:6px;border:1px solid #2a7;background:#38d;color:#000;cursor:pointer">Re-scan messages now</button>
              <button id="bl_mock"       style="padding:6px 8px;border-radius:6px;border:1px solid #555;background:#444;color:#eee;cursor:pointer">Insert test ping</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);

      const elEnabled = panel.querySelector('#bl_enabled');
      const elWords   = panel.querySelector('#bl_words');

      function refreshUi() {
        elEnabled.checked = !!cfg.enabled;
        elWords.value = (cfg.words || []).join('\n');
      }
      refreshUi();

      function flash(text) {
        const el = document.createElement('div');
        el.textContent = text;
        Object.assign(el.style, {
          position: 'fixed', right: '12px', top: '12px', zIndex: 999999,
          background: 'rgba(20,20,22,.92)', color: '#eaeaea', padding: '6px 10px',
          borderRadius: '8px', border: '1px solid #444', font: '12px system-ui,Segoe UI,Roboto,Arial',
          boxShadow: '0 6px 16px rgba(0,0,0,.35)'
        });
        document.body.appendChild(el);
        setTimeout(() => { el.style.transition='opacity .25s'; el.style.opacity='0'; setTimeout(()=>el.remove(), 280); }, 900);
      }

      gear.addEventListener('click', () => { panel.style.display = 'block'; });
      panel.querySelector('#bl_close').addEventListener('click', () => { panel.style.display = 'none'; });
      panel.querySelector('#bl_save').addEventListener('click', () => {
        cfg.enabled = elEnabled.checked;
        cfg.words   = elWords.value.split('\n').map(s => s.trim()).filter(Boolean);
        saveCfg();
        panel.style.display = 'none';
        flash('Saved blocklist');
      });

      // Tools collapse
      const toolsBody = panel.querySelector('#tools_body');
      panel.querySelector('#tools_toggle').addEventListener('click', () => {
        const open = toolsBody.style.display !== 'none';
        toolsBody.style.display = open ? 'none' : 'block';
        panel.querySelector('#tools_toggle').textContent = open ? 'Testing tools ▸' : 'Testing tools ▾';
      });

      // Tool actions
      panel.querySelector('#bl_clear_doc' ).addEventListener('click', () => { clearDoctorOnce(); flash('Cleared @Doctor handled IDs'); });
      panel.querySelector('#bl_clear_seen').addEventListener('click', () => { clearSeenStore();  flash('Cleared per-message/XID dedupe'); });
      panel.querySelector('#bl_clear_all' ).addEventListener('click', () => { clearDoctorOnce(); clearSeenStore(); clearCoalesceRate(); flash('Cleared ALL caches'); });
      panel.querySelector('#bl_rescan'    ).addEventListener('click', () => { forceRescanNow(); flash('Re-scanned messages'); });
      panel.querySelector('#bl_mock'      ).addEventListener('click', () => { insertTestMessage(); });
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(makeUi, 0);
    else document.addEventListener('DOMContentLoaded', makeUi);

    // Channel-level coalesce + rate
    function coalesceOk(xid) { const t=now(), last=recentByXid.get(xid)||0; if (t-last<COALESCE_MS) return false; recentByXid.set(xid,t); return true; }
    function rateOk()        { const t=now(); while (rateTimes.length && t-rateTimes[0]>60_000) rateTimes.shift(); if (rateTimes.length>=MAX_PER_MIN) return false; rateTimes.push(t); return true; }

    // Open + cooperative close
    const tabMap = new Map();
    function openProfileXid(xid) {
      const url = 'https://www.torn.com/profiles.php?XID=' + String(xid);
      const withToken = addToken(url, makeToken());
      if (!rateOk()) return;
      if (typeof GM_openInTab === 'function') {
        const tkn = new URL(withToken).searchParams.get('tmc') || '';
        const tab = GM_openInTab(withToken, { active: true, insert: true, setParent: true });
        tabMap.set(tkn, tab);
        log('Opened profile', xid, withToken);
      } else {
        window.open(withToken, '_blank');
      }
    }
    try {
      GM_addValueChangeListener('tmc_close', (name, ov, nv, remote) => {
        if (!remote || !nv || !nv.token) return;
        const tab = tabMap.get(nv.token);
        if (tab && typeof tab.close === 'function') {
          try { tab.close(); } catch {}
          tabMap.delete(nv.token);
          try { GM_setValue('tmc_ack', { token: nv.token, when: Date.now() }); } catch {}
        }
      });
    } catch {}

    // Discord DOM helpers
    function nearestMessageContainer(node) {
      let el = node;
      while (el && el !== document.body) {
        if (el.getAttribute && (el.getAttribute('role') === 'article' || el.tagName === 'ARTICLE')) return el;
        if (el.getAttribute && (el.hasAttribute('data-list-item-id') && /message-\d{10,}/.test(el.getAttribute('data-list-item-id')))) return el;
        el = el.parentElement;
      }
      return null;
    }
    function getMessageId(container) {
      const anchors = container.querySelectorAll('a[href*="/channels/"]');
      for (const a of anchors) {
        const href = a.getAttribute('href') || '';
        const m = href && href.match(/\/channels\/\d+\/\d+\/(\d{10,})/);
        if (m) return m[1];
      }
      const idCandidates = [
        container.id || '',
        ...Array.from(container.querySelectorAll('[id]')).map(el => el.id || ''),
        ...Array.from(container.querySelectorAll('[data-list-item-id]')).map(el => el.getAttribute('data-list-item-id') || '')
      ];
      for (const v of idCandidates) {
        let m = v.match(/message-content-(\d{10,})/); if (m) return m[1];
        m = v.match(/message-(\d{10,})/); if (m) return m[1];
        m = v.match(/chat-messages-(\d{10,})/); if (m) return m[1];
        m = v.match(/(\d{10,})/); if (m) return m[1];
      }
      const author  = (container.querySelector('h3, header, [class*="header"]')?.textContent || '').trim();
      const time    = (container.querySelector('time')?.getAttribute('datetime') || '').trim();
      const content = (container.textContent || '').trim().slice(0, 50);
      const pseudo  = btoa(unescape(encodeURIComponent(author + '|' + time + '|' + content))).slice(0, 22);
      return 'pseudo_' + pseudo;
    }
    function extractMessageLines(container) {
      const lines = [];
      const blocks = container.querySelectorAll('span[class*="markup"], div[class*="messageContent"], div[data-slate-node="element"], span[data-slate-string="true"]');
      if (blocks && blocks.length) {
        for (const b of blocks) {
          const t = (b.textContent || '').trim();
          if (t) lines.push(...t.split(/\n+/));
        }
      } else {
        const txt = (container.textContent || '');
        lines.push(...txt.split(/\n+/));
      }
      return lines.map(s => s.trim()).filter(Boolean);
    }
    function extractAuthorXid(container) {
      const candidates = container.querySelectorAll('h3, header, span, a, strong');
      for (const el of candidates) {
        const t = (el.textContent || '');
        const m = t.match(/\[(\d{2,})\]/);
        if (m) return m[1];
      }
      const head = (container.textContent || '').slice(0, 200);
      const m = head.match(/\[(\d{2,})\]/);
      return m ? m[1] : null;
    }
    function extractTypedLinks(container) {
      const urls = new Set();
      const anchors = container.querySelectorAll('a[href*="torn.com/profiles.php"]');
      for (const a of anchors) {
        const href = normalizeUrl(a.getAttribute('href') || '');
        if (isTornProfile(href)) urls.add(href);
      }
      const txt = container.textContent || '';
      const rx  = /https?:\/\/(?:www\.)?torn\.com\/profiles\.php[^\s<>()"']+/ig;
      let m; rx.lastIndex = 0;
      while ((m = rx.exec(txt)) !== null) {
        const u = normalizeUrl(m[0]);
        if (isTornProfile(u)) urls.add(u);
      }
      return Array.from(urls);
    }
    function urlToXid(u) {
      try { const x = new URL(u).searchParams.get('XID'); if (x && /^\d+$/.test(x)) return x; } catch {}
      const m  = u.match(/#\/(\d+)/);       if (m)  return m[1];
      const m2 = u.match(/[?&#]XID=(\d+)/i); return m2 ? m2[1] : null;
    }

    // Blocklist evaluation (lean): bots only, case-insensitive, exact phrase, ANY phrase
    function isBotMessage(container) {
      const badge  = container.querySelector('[aria-label*="BOT"],[aria-label*="App"],[class*="botTag"],[class*="botText"]');
      if (badge) return true;
      const header = container.querySelector('h3, header, [class*="header"]');
      if (header) {
        const t = header.textContent || '';
        if (/\bBOT\b|\bAPP\b/.test(t)) return true;
      }
      return false;
    }
    function collectMessageText(container) {
      const parts = [];
      container.querySelectorAll('span[class*="markup"], div[class*="messageContent"], div[data-slate-node="element"], span[data-slate-string="true"]').forEach(n => {
        const t = (n.textContent || '').trim(); if (t) parts.push(t);
      });
      container.querySelectorAll('[class*="embedTitle"],[class*="embedDescription"],[class*="embedFieldName"],[class*="embedFieldValue"],[class*="embedAuthor"]').forEach(n => {
        const t = (n.textContent || '').trim(); if (t) parts.push(t);
      });
      if (!parts.length) {
        const t = (container.textContent || '').trim(); if (t) parts.push(t);
      }
      return parts.join('\n');
    }
    function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function blocklistTriggers(container) {
      if (!cfg.enabled) return false;
      if (!isBotMessage(container)) return false; // bots only
      const phrases = (cfg.words || []).filter(Boolean);
      if (!phrases.length) return false;

      const raw = collectMessageText(container);
      // exact phrase, whitespace tolerant, case-insensitive, ANY phrase
      const flags = 'i';
      const phraseRe = (p) => {
        const inner = escapeRegExp(p).replace(/\s+/g, '\\s+');
        return new RegExp(`(^|\\b)${inner}(\\b|$)`, flags);
      };
      return phrases.some(p => phraseRe(p).test(raw));
    }

    function hasDoctorMention(container) {
      const pills = container.querySelectorAll('span[class*="mention"], a[class*="mention"]');
      for (const el of pills) {
        const t = (el.textContent || '').trim();
        if (/^@?doctor$/i.test(t) || /@doctor/i.test(t)) return true;
      }
      const all = (container.textContent || '');
      if (/@doctor/i.test(all)) return true;
      return false;
    }

    // Process messages
    function processMessage(container) {
      const mid = getMessageId(container);
      const isDoctor = hasDoctorMention(container);
      if (isDoctor && docAlreadyHandled(mid)) { log('Skip @Doctor handled message', mid); return; }

      const lines = extractMessageLines(container);

      // Strict command detection (never blocked)
      const cmdTargets = [];
      let hasCommand = false;
      for (const line of lines) {
        if (line === '!r') {
          hasCommand = true;
          const authorXid = extractAuthorXid(container);
          if (authorXid) cmdTargets.push(authorXid);
        } else if (/^!r \d+$/.test(line)) {
          hasCommand = true;
          cmdTargets.push(line.slice(3));
        }
      }

      // Links in the message
      const linkTargets = [];
      for (const u of extractTypedLinks(container)) {
        const xid = urlToXid(u);
        if (xid) linkTargets.push(xid);
      }

      // Apply blocklist (but never to commands)
      if (blocklistTriggers(container) && !hasCommand) {
        log('Blocked by phrases; mid=', mid);
        return;
      }

      const targets = Array.from(new Set([...cmdTargets, ...linkTargets]));
      if (!targets.length) return;

      if (targets.length && !mid.startsWith('pseudo_')) {
        if (!seen[mid]) seen[mid] = { xids: [], t: now() };
      }

      let openedAny = 0;
      for (const xid of targets) {
        if (hasOpenedForMessage(mid, xid)) continue;
        if (!coalesceOk(xid)) continue;
        markOpenedForMessage(mid, xid);
        openProfileXid(xid);
        openedAny++;
      }
      if (openedAny && isDoctor) { markDoctorHandled(mid); log('Marked @Doctor message handled', mid, 'opened', openedAny); }
    }

    // Observe & enqueue
    const queue = new Set();
    function enqueue(container) {
      const mid = getMessageId(container);
      if (queue.has(mid)) return;
      queue.add(mid);
      setTimeout(() => { try { processMessage(container); } finally { queue.delete(mid); } }, 0);
    }
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) {
              const msg = nearestMessageContainer(n) || (n.querySelector ? n.querySelector('article,[role="article"],[data-list-item-id^="chat-messages"]') : null);
              if (msg) enqueue(msg);
              const anchors = n.querySelectorAll ? n.querySelectorAll('a[href*="torn.com/profiles.php"]') : [];
              for (const a of anchors) {
                const cont = nearestMessageContainer(a) || (a.closest && a.closest('article,[role="article"],[data-list-item-id^="chat-messages"]'));
                if (cont) enqueue(cont);
              }
            } else if (n.nodeType === 3) {
              const cont = n.parentElement && nearestMessageContainer(n.parentElement);
              if (cont) enqueue(cont);
            }
          }
        } else if (m.type === 'characterData') {
          const cont = m.target && m.target.parentElement && nearestMessageContainer(m.target.parentElement);
          if (cont) enqueue(cont);
        } else if (m.type === 'attributes') {
          const cont = m.target && nearestMessageContainer(m.target);
          if (cont) enqueue(cont);
        }
      }
    });

    function startDiscord() {
      const t = document.createElement('div');
      t.textContent = 'Reviver injected ✔';
      Object.assign(t.style, {
        position: 'fixed', right: '10px', top: '10px', zIndex: 999999,
        background: 'rgba(20,20,22,.9)', color: '#eaeaea', padding: '6px 10px',
        borderRadius: '8px', border: '1px solid #444', font: '12px system-ui,Segoe UI,Roboto,Arial',
        boxShadow: '0 6px 16px rgba(0,0,0,.35)'
      });
      document.body.appendChild(t);
      setTimeout(() => { t.style.transition='opacity .35s'; t.style.opacity='0'; setTimeout(()=>t.remove(), 400); }, 1200);

      document.querySelectorAll('article,[role="article"],[data-list-item-id^="chat-messages"]').forEach(enqueue);
      try { obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true }); } catch {}
      log('Discord watcher ready on channel', channelId, '(Lean blocklist, Doctor-once, per-XID dedupe, 2s coalesce).');
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startDiscord);
    else startDiscord();

    return; // end Discord branch
  }

  // ==================================================
  //                   TORN SIDE
  // ==================================================
  if (IS_TORN) {
    const STATUS_SEL = '.main-desc';
    const OK_RX      = /^\s*okay\b/i;
    const POS_KEY    = 'tmc_banner_pos';

    function getToken() { try { return new URL(location.href).searchParams.get('tmc') || ''; } catch { return ''; } }
    function textOf(el) { return (el && el.textContent || '').trim(); }
    function isOkayNow(){ return OK_RX.test(textOf(document.querySelector(STATUS_SEL))); }

    let banner, bStatus, bToken, bOkay, bAck;
    function makeBanner() {
      banner = document.createElement('div');
      Object.assign(banner.style, {
        position: 'fixed', right: '12px', bottom: '12px', zIndex: 99999,
        background: 'rgba(16,16,18,0.92)', color: '#e4e4e4', padding: '10px 12px',
        border: '1px solid #444', borderRadius: '10px', font: '12px system-ui,-apple-system,Segoe UI,Roboto,Arial',
        boxShadow: '0 8px 20px rgba(0,0,0,.35)', minWidth: '240px', userSelect: 'none'
      });
      const handle = document.createElement('div');
      handle.textContent = 'Revive Auto-Close';
      Object.assign(handle.style, { fontWeight: '700', marginBottom: '6px', cursor: 'move' });
      banner.appendChild(handle);

      const row = (label, id) => {
        const wrap = document.createElement('div');
        const l = document.createElement('span'); const v = document.createElement('span');
        l.textContent = label + ': '; l.style.color = '#aaa'; v.id = id;
        wrap.appendChild(l); wrap.appendChild(v); return wrap;
      };
      banner.appendChild(row('Token','tmc-token'));
      banner.appendChild(row('.main-desc','tmc-okay'));
      banner.appendChild(row('Status','tmc-status'));
      banner.appendChild(row('Ack','tmc-ack'));

      const btns = document.createElement('div');
      Object.assign(btns.style, { marginTop: '8px', display: 'flex', gap: '6px' });
      const sendBtn = document.createElement('button');
      sendBtn.textContent = 'Send close';
      Object.assign(sendBtn.style, { padding: '4px 6px', borderRadius: '6px', border: '1px solid #294', background: '#2d7', color: '#000', cursor: 'pointer' });
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'window.close()';
      Object.assign(closeBtn.style, { padding: '4px 6px', borderRadius: '6px', border: '1px solid #555', background: '#ddd', color: '#000', cursor: 'pointer' });
      sendBtn.addEventListener('click', () => sendCloseRequest());
      closeBtn.addEventListener('click', () => { try { window.close(); } catch {} });
      btns.appendChild(sendBtn); btns.appendChild(closeBtn);
      banner.appendChild(btns);

      document.body.appendChild(banner);

      bToken  = banner.querySelector('#tmc-token');
      bOkay   = banner.querySelector('#tmc-okay');
      bStatus = banner.querySelector('#tmc-status');
      bAck    = banner.querySelector('#tmc-ack');

      try {
        const pos = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
          banner.style.left = pos.x + 'px'; banner.style.top = pos.y + 'px';
          banner.style.right = 'auto'; banner.style.bottom = 'auto';
        }
      } catch {}

      // Dragging
      let dragging=false, offX=0, offY=0;
      handle.addEventListener('mousedown', (e) => {
        dragging = true; const r = banner.getBoundingClientRect(); offX = e.clientX - r.left; offY = e.clientY - r.top;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp, { once: true });
        e.preventDefault();
      });
      function onMove(e) {
        if (!dragging) return;
        const x = Math.max(0, Math.min(window.innerWidth  - 50, e.clientX - offX));
        const y = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - offY));
        banner.style.left = x + 'px'; banner.style.top = y + 'px';
        banner.style.right = 'auto'; banner.style.bottom = 'auto';
      }
      function onUp() {
        dragging = false; document.removeEventListener('mousemove', onMove);
        const r = banner.getBoundingClientRect();
        localStorage.setItem(POS_KEY, JSON.stringify({ x: r.left, y: r.top }));
      }
    }

    function updateBanner() {
      if (!banner) return;
      const tkn = getToken();
      bToken.textContent = tkn || '—';
      const ok = isOkayNow();
      bOkay.textContent = ok ? 'Okay' : (textOf(document.querySelector(STATUS_SEL)) || '—');
      bOkay.style.color = ok ? '#6f6' : '#f66';
    }

    function sendCloseRequest() {
      const tkn = getToken();
      if (!tkn) { bStatus.textContent = 'No token; opener cannot close'; bStatus.style.color = '#f66'; return; }
      try { GM_setValue('tmc_close', { token: tkn, when: Date.now() }); bStatus.textContent = 'Sent close request…'; bStatus.style.color = '#ffd166'; }
      catch { bStatus.textContent = 'Failed to send request'; bStatus.style.color = '#f66'; }
    }

    try {
      GM_addValueChangeListener('tmc_ack', (name, ov, nv, remote) => {
        if (!remote || !nv || !nv.token) return;
        const tkn = getToken(); if (!tkn || nv.token !== tkn) return;
        bAck.textContent = 'Ack received'; bAck.style.color = '#6f6';
        bStatus.textContent = 'Opener closed tab'; bStatus.style.color = '#6f6';
        setTimeout(() => { try { window.close(); } catch {} }, 50);
      });
    } catch {}

    function checkAndMaybeSend() { updateBanner(); if (isOkayNow()) sendCloseRequest(); }

    function startTorn() {
      makeBanner(); updateBanner();
      const mo = new MutationObserver(checkAndMaybeSend);
      try { mo.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: true }); } catch {}
      setInterval(checkAndMaybeSend, 300);
      if (isOkayNow()) sendCloseRequest();
      log('Torn closer ready (draggable banner).');
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startTorn);
    else startTorn();
  }
})();
