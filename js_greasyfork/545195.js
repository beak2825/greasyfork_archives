// ==UserScript==
// @name         Torn Church Prayer Streak Tracker (Web version only)
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Streak expiry in H:MM:SS (24h since last prayer, with ±30s grace), 24h count, consecutive days; pulse last 10m, red <1h; theme-aware; Refresh now; auto-refresh 5m & on visiting/leaving /church.php; history (last 10) with absolute dates; backfills up to 15 days; delta fetch; cached last prayer; gentle backoff; shows Expires/Expired at.
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545195/Torn%20Church%20Prayer%20Streak%20Tracker%20%28Web%20version%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545195/Torn%20Church%20Prayer%20Streak%20Tracker%20%28Web%20version%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Styles (theme-aware) ----------
  (function injectStyles() {
    if (document.getElementById('prayer-streak-style')) return;
    const style = document.createElement('style');
    style.id = 'prayer-streak-style';
    style.textContent = `
      @keyframes prayerPulse {
        0%   { transform: scale(1);   text-shadow: none; }
        50%  { transform: scale(1.03); text-shadow: 0 0 6px currentColor; }
        100% { transform: scale(1);   text-shadow: none; }
      }
      .prayer-pulse { animation: prayerPulse 1s infinite; }
      .prayer-warn { color: #d32f2f; }

      #prayerHistory { margin-top: 6px; }
      #prayerHistory ul { margin: 6px 0 0 0; padding-left: 16px; }
      #prayerHistory li { margin: 2px 0; }

      #prayerTracker .btn {
        color: inherit;
        background: color-mix(in srgb, currentColor 10%, transparent);
        border: 1px solid currentColor;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        transition: background-color 120ms ease, opacity 120ms ease, transform 50ms ease;
      }
      #prayerTracker .btn:hover {
        background: color-mix(in srgb, currentColor 18%, transparent);
      }
      #prayerTracker .btn:disabled {
        opacity: .6;
        cursor: default;
      }
      #prayerTracker .btn:active:not(:disabled) {
        transform: translateY(1px);
        background: color-mix(in srgb, currentColor 24%, transparent);
      }
      #prayerTracker .btn-row {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 6px;
      }
      #prayerTracker .meta {
        margin-top: 6px;
        font-size: 12px;
        opacity: .85;
      }
      #prayerTracker .meta .status {
        opacity: .9;
      }

      /* Flexbox layout to position the label and number side by side */
      .prayer-tracker-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .prayer-tracker-row .label {
        text-align: left;  /* Left-align label */
        flex: 1;
        padding-right: 10px;  /* Add space between label and value */
      }

      .prayer-tracker-row .value {
        text-align: right;  /* Right-align value */
        font-weight: bold;
        flex: 0 0 80px;  /* Ensure values have a fixed width to avoid overflow and misalignment */
      }

      /* Title styling */
      #prayerTracker > div:first-child {
        text-align: center;
        width: 100%;
        font-size: 16px;
        margin-bottom: 12px;
      }

      /* Ensure PDA layout displays properly */
      @media (max-width: 600px) {
        #prayerTracker {
          width: 100%;
          font-size: 14px;
          padding: 10px;
        }

        #prayerTracker .btn-row {
          flex-direction: column;
        }

        /* Position the tracker inside the sidebar */
        #prayerTracker {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: calc(100% - 20px); /* Full width with padding */
          z-index: 9999;  /* Ensures it's on top but behind main content */
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5); /* Add a shadow for visual clarity */
        }

        #prayerHistory {
          display: block;
          margin-top: 10px;
        }
      }

      /* Prevent the tracker from floating above all content */
      #prayerTracker {
        position: relative;
        z-index: 10;  /* Lower than main content, but above other background elements */
      }
    `;
    document.head.appendChild(style);
  })();

  // ---------- Local storage keys ----------
  const LS_KEY = 'tornApiKey';
  const LS_LAST_SEEN_TS = 'tornPrayerLastSeenTs';     // number (unix seconds)
  const LS_CACHE = 'tornPrayerCache';                 // JSON array of cached entries (subset)
  const LS_LAST_PRAYER_TS = 'tornPrayerLastPrayerTs'; // number (unix seconds)

  // ---------- Constants ----------
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const GRACE_MS   = 30 * 1000; // ±30 seconds grace

  // ---------- Utilities ----------
  const pad2 = n => n.toString().padStart(2, '0');
  function formatAbsolute(tsMs){
    const d = new Date(tsMs);
    const hh = pad2(d.getHours()), mm = pad2(d.getMinutes());
    const day = d.getDate();
    const month = d.toLocaleString(undefined, { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year} ${hh}:${mm}`;
  }
  function isPrayer(entry){
    const t = (entry.title||'').toString().toLowerCase();
    const c = (entry.category||'').toString().toLowerCase();
    return c==='church' || t.includes('church');
  }
  const nowSec = () => Math.floor(Date.now()/1000);

  // ---------- API key ----------
  let apiKey = localStorage.getItem(LS_KEY);
  function promptForApiKey() {
    const k = prompt("Enter your Torn API key (requires 'log' access):", apiKey || '');
    if (k && k.trim()) {
      apiKey = k.trim();
      localStorage.setItem(LS_KEY, apiKey);
      fetchPrayerLogs(true);
    }
  }

  // ---------- Panel ----------
  function createPanel() {
    if (document.getElementById('prayerTracker')) return;
    // Adjust sidebar selector based on PDA or Desktop version
    const sidebar = document.querySelector('#pda-sidebar') || document.querySelector('#sidebar') || document.body;

    const panel = document.createElement('div');
    panel.id = 'prayerTracker';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.alignItems = 'center';
    panel.style.padding = '6px 10px';
    panel.style.marginTop = 'auto'; // Push the panel downwards in the sidebar
    panel.style.width = 'calc(100% - 20px)';
    panel.style.paddingBottom = '20px'; // Ensure there's space at the bottom
    panel.style.marginBottom = '10px'; // Prevent panel from touching the very bottom of the sidebar

    panel.innerHTML =
      '<div>Church Prayer Tracker</div>' +  // Title aligned center
      '<div class="prayer-tracker-row"><span class="label">Pray Streak ends in:</span> <span class="value" id="prayerCountdown">Loading...</span></div>' +
      '<div class="prayer-tracker-row"><span class="label">Prayers in past 24h:</span> <span class="value" id="prayerCount">Loading...</span></div>' +
      '<div class="prayer-tracker-row"><span class="label">Streak (days):</span> <span class="value" id="prayerStreak">Loading...</span></div>' +
      '<div class="btn-row">' +
      '  <button id="toggleHistory" class="btn" type="button">Show pray history</button>' + // Moved to the top
      '  <button id="refreshNow" class="btn" type="button">Refresh now</button>' +          // Moved down
      '  <button id="resetApiKey" class="btn" type="button">Reset API Key</button>' +        // Moved last
      '</div>' +
      '<div class="meta">Last updated: <span id="lastUpdated">—</span> <span class="status" id="updateStatus"></span></div>' +
      '<div id="prayerHistory" style="display:none;">' +
      '  <div style="margin-top:6px; font-weight:600;">Recent prayers</div>' +
      '  <ul id="prayerHistoryList"></ul>' +
      '</div>';

    sidebar.appendChild(panel);

    document.getElementById('resetApiKey').addEventListener('click', () => {
      localStorage.removeItem(LS_KEY);
      apiKey = null;
      alert('API key cleared. Please enter a new one.');
      promptForApiKey();
    });
    document.getElementById('toggleHistory').addEventListener('click', () => {
      const box = document.getElementById('prayerHistory');
      const btn = document.getElementById('toggleHistory');
      const isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'block' : 'none';
      btn.textContent = isHidden ? 'Hide pray history' : 'Show pray history';
    });
    document.getElementById('refreshNow').addEventListener('click', () => {
      fetchPrayerLogs(true);
    });
  }

  // ---------- Countdown / UI ----------
  let countdownIntervalId = null;
  let isFetching = false;
  let retryTimeoutId = null;

  function setLastUpdated(statusText = '') {
    const t = document.getElementById('lastUpdated');
    if (t) t.textContent = new Date().toLocaleTimeString();
    const s = document.getElementById('updateStatus');
    if (s) s.textContent = statusText ? `— ${statusText}` : '';
  }

  function startCountdown(lastPrayerMs){
    const countdownEl = document.getElementById('prayerCountdown');
    if (!countdownEl) return;

    const nominalExpiry = lastPrayerMs + ONE_DAY_MS; // last prayer + 24h

    if (countdownIntervalId) clearInterval(countdownIntervalId);

    function tick(){
      const diff = nominalExpiry - Date.now();

      // Respect grace: treat as active until 30s past nominal expiry
      if (diff <= -GRACE_MS) {
        countdownEl.textContent = '0:00:00';
        countdownEl.classList.remove('prayer-pulse');
        countdownEl.classList.add('prayer-warn');
        return;
      }

      // Active — compute remaining (clamp at 0 for display if within grace overrun)
      const remaining = Math.max(0, diff);
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      countdownEl.textContent = `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

      if (remaining < 3600000) countdownEl.classList.add('prayer-warn'); else countdownEl.classList.remove('prayer-warn');
      if (remaining < 600000)  countdownEl.classList.add('prayer-pulse'); else countdownEl.classList.remove('prayer-pulse');
    }

    tick();
    countdownIntervalId = setInterval(tick, 1000);
  }

  function renderHistory(prayers){
    const list=document.getElementById('prayerHistoryList'); if(!list) return;
    list.innerHTML='';
    if (!prayers || prayers.length===0){ const li=document.createElement('li'); li.textContent='No prayers found.'; list.appendChild(li); return; }
    const recent=prayers.slice(0,10);
    for (const p of recent){
      const tsMs=p.timestamp*1000;
      const li=document.createElement('li');
      li.textContent = formatAbsolute(tsMs);
      li.title = new Date(tsMs).toLocaleString();
      list.appendChild(li);
    }
  }

  function applyLogs(prayers){
    createPanel();

    const countdownEl = document.getElementById('prayerCountdown');
    const countEl     = document.getElementById('prayerCount');
    const streakEl    = document.getElementById('prayerStreak');

    // Always sort newest -> oldest
    prayers.sort((a,b)=>b.timestamp-a.timestamp);

    renderHistory(prayers);

    if (prayers.length===0){
      if (countdownIntervalId) clearInterval(countdownIntervalId);
      countdownEl.textContent='No prayers found';
      countdownEl.classList.remove('prayer-pulse','prayer-warn');
      countEl.textContent='0';
      streakEl.textContent='0';
      return;
    }

    const lastTs = prayers[0].timestamp;
    localStorage.setItem(LS_LAST_PRAYER_TS, String(lastTs));

    const lastMs = lastTs*1000;
    startCountdown(lastMs);

    const nowMs=Date.now();
    // 24h count with grace
    countEl.textContent = String(prayers.filter(p => (nowMs - p.timestamp*1000) <= (ONE_DAY_MS + GRACE_MS)).length);

    // Streak (stop when gap > 24h + grace)
    let streak=1;
    for (let i=0;i<prayers.length-1;i++){
      const gapSec=prayers[i].timestamp - prayers[i+1].timestamp;
      if (gapSec <= (24*60*60) + (GRACE_MS/1000)) streak++;
      else break;
    }
    streakEl.textContent=String(streak);
  }

  // Use cached last prayer to keep countdown ticking even if API fails
  function applyFromCacheIfAvailable() {
    const cached = localStorage.getItem(LS_CACHE);
    const arr = cached ? JSON.parse(cached) : [];
    if (Array.isArray(arr) && arr.length) {
      applyLogs(arr);
      return true;
    }
    const lastTsStr = localStorage.getItem(LS_LAST_PRAYER_TS);
    if (lastTsStr) {
      const ts = Number(lastTsStr) || 0;
      if (ts > 0) {
        applyLogs([{ timestamp: ts, title: 'Church pray', category: 'Church' }]);
        return true;
      }
    }
    return false;
  }

  // ---------- Fetch with Delta + 15-day backfill if needed ----------
  async function fetchPrayerLogs(manual = false){
    if (!apiKey || isFetching) return;
    isFetching=true;

    const refreshBtn = document.getElementById('refreshNow');
    const prevLabel = refreshBtn ? refreshBtn.textContent : '';
    if (manual && refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Refreshing…';
    }

    // Clear any pending retry
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }

    try {
      const now = nowSec();
      const ONE_DAY = 24*60*60;
      const collected = new Map(); // `${timestamp}|${id}` -> entry

      // Start from cache so UI can render even before network completes
      const hadCache = applyFromCacheIfAvailable();

      // 1) DELTA FETCH: only ask for logs since last seen (with small overlap)
      const lastSeenStr = localStorage.getItem(LS_LAST_SEEN_TS);
      let lastSeen = lastSeenStr ? Number(lastSeenStr) : 0;
      if (Number.isFinite(lastSeen) && lastSeen > 0) {
        lastSeen = Math.max(0, lastSeen - 120); // 2-min overlap
      }

      function mergeList(list) {
        for (const e of list) if (isPrayer(e)) {
          collected.set(`${e.timestamp}|${e.log||''}`, e);
        }
      }

      if (!lastSeen) {
        const first = await fetch(`https://api.torn.com/user/0?selections=log&key=${apiKey}`).then(r=>r.json());
        if (first.error) throw new Error(first.error.error||'API error');
        mergeList(Object.values(first.log||{}));
      } else {
        const j = await fetch(`https://api.torn.com/user/0?selections=log&from=${lastSeen}&to=${now}&key=${apiKey}`).then(r=>r.json());
        if (j.error) throw new Error(j.error.error||'API error');
        mergeList(Object.values(j.log||{}));

        const cached = localStorage.getItem(LS_CACHE);
        if (cached) {
          try {
            const arr = JSON.parse(cached);
            if (Array.isArray(arr)) mergeList(arr);
          } catch {}
        }
      }

      // 2) If fewer than 10, backfill day-by-day up to 15 days
      const needMore = () => {
        let count = 0;
        for (const e of collected.values()) if (isPrayer(e)) count++;
        return count < 10;
      };

      for (let d = 0; d < 15 && needMore(); d++) {
        const toTs   = now - d*ONE_DAY;
        const fromTs = toTs - ONE_DAY;
        const url = `https://api.torn.com/user/0?selections=log&from=${fromTs}&to=${toTs}&key=${apiKey}`;
        const j = await fetch(url).then(r=>r.json());
        if (j.error) throw new Error(j.error.error||'API error');
        mergeList(Object.values(j.log||{}));
      }

      const merged = Array.from(collected.values()).filter(isPrayer).sort((a,b)=>b.timestamp-a.timestamp);

      // Update cache and lastSeen
      if (merged.length) {
        localStorage.setItem(LS_CACHE, JSON.stringify(merged.slice(0, 20)));
        localStorage.setItem(LS_LAST_SEEN_TS, String(merged[0].timestamp));
      }

      applyLogs(merged);
      setLastUpdated(hadCache ? 'synced' : 'ok');
    } catch (e){
      console.error('Prayer fetch error:', e);
      const msg = (e && e.message) ? e.message.toLowerCase() : '';
      if (msg.includes('access') || msg.includes('permission') || msg.includes('incorrect')) {
        alert(`Error fetching prayer logs: ${e.message||e}`);
        localStorage.removeItem(LS_KEY); apiKey=null; promptForApiKey();
      } else {
        // Silent failure: keep countdown using cache; schedule gentle retry
        applyFromCacheIfAvailable();
        setLastUpdated('error; retrying…');
        retryTimeoutId = setTimeout(() => fetchPrayerLogs(false), 60*1000);
      }
    } finally {
      isFetching=false;
      const refreshBtn = document.getElementById('refreshNow');
      if (manual && refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = prevLabel || 'Refresh now';
      }
    }
  }

  // ---------- Smart refresh ----------
  function setupAutoRefresh(){
    setInterval(() => fetchPrayerLogs(false), 5*60*1000);

    let lastPath=location.pathname;
    function onLocationChange(){
      const curr=location.pathname;
      if (curr==='/church.php') fetchPrayerLogs(false);
      if (lastPath==='/church.php' && curr!=='/church.php') fetchPrayerLogs(false);
      lastPath=curr;
    }

    // Adjust for Torn PDA's dynamic page updates
    window.addEventListener('popstate', onLocationChange); // Detect history navigation
    window.addEventListener('locationchange', onLocationChange); // Detect internal navigation
    if (location.pathname==='/church.php') fetchPrayerLogs(false);
  }

  // ---------- Boot ----------
  createPanel();
  if (!apiKey){ promptForApiKey(); } else {
    // Draw from cache immediately (snappy), then fetch
    applyFromCacheIfAvailable();
    fetchPrayerLogs(false);
  }
  setupAutoRefresh();
})();
