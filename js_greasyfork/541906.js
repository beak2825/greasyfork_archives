// ==UserScript==
// @name         GeoGuessr Rated-Duels Rating History 
// @namespace    https://greasyfork.org/users/000000
// @version      5.1.3
// @description  Simple rating history in your profile. Can switch between rating vs days or vs duels.
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541906/GeoGuessr%20Rated-Duels%20Rating%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/541906/GeoGuessr%20Rated-Duels%20Rating%20History.meta.js
// ==/UserScript==

(() => {
  /* ------------ defaults ------------ */
  const DEFAULT_VAL  = 30;
  const DEFAULT_MODE = 'duels';          // change to "days" for default days
  const FETCH_DELAY  = 60;               // ms between duel fetches
  const PANEL_ID     = 'tm-rating-panel';

  /* ------------ colour scheme ------------ */
  const MODE_INFO = {
    duels:               { label: 'Move',    color: '#3CF2FF' }, // cyan
    nomoveduels:         { label: 'No Move', color: '#FF6EC7' }, // magenta
    nomovepanzoomduels:  { label: 'NMPZ',    color: '#FFC94D' }  // yellow-orange
  };
  const OVERALL_COLOR   = '#FFFFFF';      // bright white
  const OVERALL_WIDTH   = 3;              // thicker line
  const ALIAS           = { nomovepanzoom: 'nomovepanzoomduels',
                             standard: 'duels' };
  const EXTRA           = ['#7EC8E3','#F39F5A','#C77DFF','#55DD99','#FFA8A8'];

  /* ------------ helpers ------------ */
  const sleep  = ms => new Promise(r => setTimeout(r, ms));
  const onProf = p  => /^\/(?:me\/profile|profile\/[^/]+|user\/[^/]+)/.test(p);
  const uid = () =>
    JSON.parse(document.getElementById('__NEXT_DATA__').textContent)
      .props.accountProps.account.user.userId;
  const FEED = tok =>
    fetch(`https://www.geoguessr.com/api/v4/feed/private?count=26&paginationToken=${tok}`,
          { credentials: 'include' }).then(r => r.json());

  const canon = raw => {
    const k = (raw || '').toLowerCase();
    if (k.startsWith('standard')) return 'duels';
    return ALIAS[k] || k || 'duels';
  };

  const ratings = ply => {
    const rs = ply.progressChange?.rankedSystemProgress ?? {},
          cp = ply.progressChange?.competitiveProgress ?? {};
    return {
      overall : rs.ratingAfter ?? cp.ratingAfter
             ?? rs.ratingBefore ?? cp.ratingBefore
             ?? ply.rating ?? 0,
      modeKey : canon(rs.gameMode),
      modeRat : rs.gameModeRatingAfter ?? 0
    };
  };

  /* ------------ duel fetch ------------ */
  async function fetchDuel(me, id, fallbackTime) {
    try {
      const r = await fetch(`https://game-server.geoguessr.com/api/duels/${id}`,
                            { credentials: 'include' });
      if (!r.ok) return null;
      const j = await r.json(); if (!j.teams) return null;

      const team = j.teams.find(t => t.players.some(p => p.playerId === me));
      if (!team) return null;
      const ply  = team.players.find(p => p.playerId === me);
      const { overall, modeKey, modeRat } = ratings(ply);
      if (!overall && !modeRat) return null;            // ignore blanks

      const when = j.rounds?.at(-1)?.endTime
                || j.rounds?.at(-1)?.startTime
                || j.finished || j.created
                || fallbackTime;
      if (!when) return null;

      return { date: new Date(when),
               overall,
               modeKey,
               modeRating: modeRat || overall };
    } catch { return null; }
  }

  async function collectDuels(me, want) {
    let token = '', out = [], seen = new Set();
    while (out.length < want) {
      const { entries, paginationToken } = await FEED(token);
      if (!entries.length) break;

      for (const e of entries) {
        if (!e.payload) continue;
        const arr   = JSON.parse(e.payload),
              items = Array.isArray(arr) ? arr : [arr],
              duel  = items.find(it => it?.payload?.gameMode === 'Duels');
        if (!duel) continue;
        const id = duel.payload.gameId;
        if (!id || seen.has(id)) continue; seen.add(id);

        const obj = await fetchDuel(me, id, duel.time);
        if (obj) { out.push(obj); if (out.length >= want) break; }
        await sleep(FETCH_DELAY);
      }
      if (!paginationToken) break;
      token = paginationToken;
    }
    return out.reverse();
  }

  async function collectDays(me, days) {
    const cutoff = Date.now() - days * 864e5;
    let token = '', out = [], seen = new Set();

    while (true) {
      const { entries, paginationToken } = await FEED(token);
      if (!entries.length) break;

      for (const e of entries) {
        if (!e.payload) continue;
        const arr   = JSON.parse(e.payload),
              items = Array.isArray(arr) ? arr : [arr],
              duel  = items.find(it => it?.payload?.gameMode === 'Duels');
        if (!duel) continue;
        const id = duel.payload.gameId;
        if (!id || seen.has(id)) continue; seen.add(id);

        const obj = await fetchDuel(me, id, duel.time);
        if (!obj) { await sleep(FETCH_DELAY); continue; }
        if (obj.date.getTime() < cutoff) return out.reverse();
        out.push(obj); await sleep(FETCH_DELAY);
      }
      if (!paginationToken) break;
      token = paginationToken;
    }
    return out.reverse();
  }

  /* ------------ build chart data ------------ */
  async function build(mode, value) {
    const me = uid(); if (!me) return null;
    const raw = mode === 'duels'
      ? await collectDuels(me, value)
      : await collectDays (me, value);
    if (!raw.length) return null;

    const rows = mode === 'days'
      ? [...new Map(raw.map(r => [r.date.toISOString().slice(0, 10), r])).values()]
      : raw;

    const modes = [...new Set(rows.map(r => r.modeKey))];
    const col = {}, lbl = {}, extraIter = EXTRA.values();
    modes.forEach(k => {
      col[k] = MODE_INFO[k]?.color || extraIter.next().value;
      lbl[k] = MODE_INFO[k]?.label ||
               k.replace(/duels$/, '').replace(/^nomovepanzoom/, 'NMPZ') || k;
    });

    const labels = rows.map(r => mode === 'duels'
      ? r.date.toLocaleString()
      : r.date.toISOString().slice(0, 10));

    const overall = [], byMode = {};
    modes.forEach(k => byMode[k] = []);
    let lastO = null, lastM = {};
    rows.forEach(r => {
      if (r.overall) lastO = r.overall;
      overall.push(lastO);
      modes.forEach(k => {
        if (k === r.modeKey && r.modeRating) lastM[k] = r.modeRating;
        byMode[k].push(lastM[k] ?? null);
      });
    });

    /* overall dataset first so it renders underneath the coloured lines */
    const datasets = [{
      label: 'Overall',
      data: overall,
      borderColor: OVERALL_COLOR,
      backgroundColor: OVERALL_COLOR + '33',
      borderWidth: OVERALL_WIDTH,
      pointRadius: 3,
      tension: .15,
      fill: false
    }];
    modes.forEach(k => datasets.push({
      label: lbl[k],
      data: byMode[k],
      borderColor: col[k],
      backgroundColor: col[k] + '33',
      borderWidth: 2,
      pointRadius: 3,
      tension: .15,
      fill: false
    }));

    return { labels, datasets, rows, lbl };
  }

  /* ------------ Chart.js loader ------------ */
  async function lib() {
    if (window.Chart) return Chart;
    const src = await fetch('https://unpkg.com/chart.js@4.4.3/dist/chart.umd.js')
                       .then(r => r.text());
    eval(src); return Chart;
  }

  const anchor = () =>
    document.querySelector('div[id^="geostats"],#stats-root,.stats-container')
      ?.parentElement || document.querySelector('main') || document.body;

  /* ------------ CSV button ------------ */
  function setCsv(panel, pack) {
    panel.querySelector('#tm-csv').onclick = () => {
      const csv = ['date,overall,mode,rating',
        ...pack.rows.map(r =>
          `${r.date.toISOString()},${pack.lbl[r.modeKey]},${r.modeRating}`)]
        .join('\n');
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
        download: 'rating_history.csv'
      });
      a.click(); URL.revokeObjectURL(a.href);
    };
  }

  /* ------------ chart maker ------------ */
  function cfg(labels, datasets, mode) {
    return {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: mode === 'duels' ? 2.3 : 2.0,
        scales: {
          y: { grid: { color: '#3b3f59' }, ticks: { color: '#d0d7de' },
               title: { display: true, text: 'Rating', color: '#d0d7de' } },
          x: { grid: { color: '#3b3f59' }, ticks: { color: '#d0d7de' },
               title: {
                 display: true,
                 text: mode === 'duels' ? 'Date / time' : 'Date',
                 color: '#d0d7de'
               } }
        },
        plugins: { legend: { labels: { color: '#d0d7de' } } }
      }
    };
  }

  /* ------------ rendering ------------ */
  async function render(val = DEFAULT_VAL, mode = DEFAULT_MODE) {
    const panel = document.getElementById(PANEL_ID);
    if (!onProf(location.pathname)) { panel?.remove(); return; }
    panel?.querySelector('#tm-reload')?.setAttribute('disabled', '');

    const pack = await build(mode, val); if (!pack) { panel?.remove(); return; }
    const Chart = await lib();

    if (panel) {                        /* update existing */
      panel.querySelector('canvas').remove();
      const c = document.createElement('canvas');
      panel.insertBefore(c, panel.querySelector('#tm-csv').parentElement);
      new Chart(c.getContext('2d'), cfg(pack.labels, pack.datasets, mode));
      panel.querySelector('#tm-count').value = val;
      panel.querySelector('#tm-unit').value  = mode;
      panel.querySelector('#tm-reload').disabled = false;
      panel.querySelector('#tm-reload').textContent = 'Reload';
      setCsv(panel, pack);
      return;
    }

    /* create new panel */
    const wrap = document.createElement('section');
    wrap.id = PANEL_ID;
    wrap.innerHTML = `
      <h2 style="margin:32px 0 12px;text-align:center;font-weight:700;font-size:24px;color:#d0d7de">
        Rated Duels — Rating History</h2>
      <div style="text-align:center;margin-bottom:16px">
        Show last
        <input id="tm-count" type="number" min="1" max="365" value="${val}"
          style="width:80px;padding:4px;margin:0 4px;border:1px solid #889;
                 border-radius:4px;background:transparent;color:#d0d7de;text-align:right">
        <select id="tm-unit"
          style="padding:4px;border:1px solid #889;border-radius:4px;
                 background:transparent;color:#d0d7de;">
          <option value="days"${mode==='days'?'':' selected'}>days</option>
          <option value="duels"${mode==='duels'?' selected':''}>duels</option>
        </select>
        <button id="tm-reload"
          style="margin-left:8px;padding:4px 10px;border:1px solid #889;border-radius:6px;
                 background:transparent;color:#d0d7de;cursor:pointer">Reload</button>
      </div>
      <canvas style="max-width:100%;"></canvas>
      <div style="text-align:center">
        <button id="tm-csv"
          style="margin-top:12px;padding:6px 10px;border:1px solid #889;border-radius:6px;
                 background:transparent;color:#d0d7de;cursor:pointer">Download CSV</button>
      </div>`;
    Object.assign(wrap.style, {
      background: 'transparent',
      padding: '24px 16px',
      margin: '32px auto',
      width: '50vw',
      minWidth: '600px',
      textAlign: 'center'
    });
    anchor().insertAdjacentElement('afterend', wrap);

    new Chart(wrap.querySelector('canvas').getContext('2d'),
              cfg(pack.labels, pack.datasets, mode));

    setCsv(wrap, pack);

    wrap.querySelector('#tm-reload').onclick = async () => {
      const btn = wrap.querySelector('#tm-reload');
      btn.textContent = 'Reloading…'; btn.disabled = true;
      const v = Math.max(1, Math.min(365,
        +wrap.querySelector('#tm-count').value || DEFAULT_VAL));
      const u = wrap.querySelector('#tm-unit').value;
      await render(v, u);
    };
  }

  /* ------------ SPA navigation + init ------------ */
  (() => {
    let prev = location.pathname;
    const tick = () => {
      if (location.pathname !== prev) {
        prev = location.pathname;
        if (onProf(prev)) render();
        else document.getElementById(PANEL_ID)?.remove();
      }
    };
    ['pushState', 'replaceState'].forEach(m => {
      const o = history[m]; history[m] = function () { o.apply(this, arguments); tick(); };
    });
    window.addEventListener('popstate', tick);
    if (onProf(location.pathname)) render();
  })();

  GM_addStyle(`#${PANEL_ID}{display:block!important}`);
  GM_registerMenuCommand('Refresh Rating History', () => {
    document.getElementById(PANEL_ID)?.remove();
    if (onProf(location.pathname)) render();
  });
})();
