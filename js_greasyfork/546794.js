// ==UserScript==
// @name         PL Pulselive API → tabulka zápasů
// @version      1.1
// @namespace    lukas.pl.tools
// @description  Na pulselive API stránkách vykreslí tabulku se zápasy + LIVE URL tlačítko
// @match        https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/*
// @author       LM
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546794/PL%20Pulselive%20API%20%E2%86%92%20tabulka%20z%C3%A1pas%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/546794/PL%20Pulselive%20API%20%E2%86%92%20tabulka%20z%C3%A1pas%C5%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const locale = navigator.language || 'cs-CZ';

  function css() {
    const s = document.createElement('style');
    s.textContent = `
      :root { --bg:#0b0f14; --card:#10161d; --text:#e9eef3; --muted:#a9b4bf; --accent:#3ddc84; --accentText:#0b0f14; --border:#1d2732; }
      html, body { background: var(--bg)!important; color: var(--text)!important; margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; }
      .pl-wrap { padding: 20px; max-width: 1100px; margin: 0 auto; }
      .pl-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
      .pl-title { font-size: 20px; font-weight: 700; }
      .pl-actions { display:flex; align-items:center; gap:8px; }
      .pl-btn {
        padding: 8px 12px; border-radius: 999px; border:1px solid var(--border);
        background: var(--card); color: var(--text); cursor:pointer; font-weight:600;
      }
      .pl-btn:hover { filter: brightness(1.08); }
      .pl-table {
        width: 100%; border-collapse: separate; border-spacing: 0; overflow: hidden;
        border:1px solid var(--border); border-radius: 14px; background: var(--card);
      }
      .pl-table th, .pl-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); text-align: left; }
      .pl-table thead th { position: sticky; top:0; background: #0f1520; z-index:1; }
      .pl-table tbody tr:nth-child(odd) { background: rgba(255,255,255,0.02); }
      .pl-live {
        display:inline-block; font-weight:800; text-decoration:none;
        padding: 8px 12px; border-radius: 10px; background: var(--accent);
        color: var(--accentText); border: 1px solid #2fb86d;
      }
      .pl-muted { color: var(--muted); font-size: 12px; }
      .pl-json { white-space: pre-wrap; word-break: break-word; background:#0f1520; border:1px solid var(--border); border-radius: 12px; padding: 12px; display:none; margin-top:12px; }
      .pl-count { font-size: 12px; color: var(--muted); }
      .pl-footnote { margin-top:10px; color: var(--muted); font-size: 12px; }
      .nowrap { white-space: nowrap; }
    `;
    document.documentElement.appendChild(s);
  }

  function parsePossiblyMillis(kickoff) {
    if (!kickoff) return null;
    if (typeof kickoff === 'number') return new Date(kickoff);
    if (typeof kickoff === 'string') {
      const t = Date.parse(kickoff);
      return isNaN(t) ? null : new Date(t);
    }
    if (kickoff.millis) return new Date(Number(kickoff.millis));
    if (kickoff.utc) {
      const t = Date.parse(kickoff.utc);
      if (!isNaN(t)) return new Date(t);
    }
    if (kickoff.label) {
      const t = Date.parse(kickoff.label);
      if (!isNaN(t)) return new Date(t);
    }
    return null;
  }

  function pickTeams(m) {
    let home = '', away = '';
    const teams = Array.isArray(m?.teams) ? m.teams : [];
    if (teams.length) {
      for (const t of teams) {
        const name = t?.team?.name || t?.team?.club?.name || t?.name || '';
        const isHome = t?.isHome === true || t?.home === true || t?.side === 'home' || t?.type === 'home';
        const isAway = t?.isHome === false || t?.away === true || t?.side === 'away' || t?.type === 'away';
        if (isHome) home = name;
        if (isAway) away = name;
      }
      if ((!home || !away) && teams.length === 2) {
        home = home || (teams[0]?.team?.name || teams[0]?.name || '');
        away = away || (teams[1]?.team?.name || teams[1]?.name || '');
      }
    } else {
      home = m?.homeTeam?.name || m?.home?.name || m?.homeTeamName || home;
      away = m?.awayTeam?.name || m?.away?.name || m?.awayTeamName || away;
    }
    return { home, away };
  }

  function pickMatchId(m) {
    return m?.id ?? m?.matchId ?? m?.fixtureId ?? m?.gameId ?? '';
  }

  function toLocalDT(d) {
    if (!(d instanceof Date) || isNaN(+d)) return '';
    return d.toLocaleString(locale, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function extractMatches(json) {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.content)) return json.content;
    if (Array.isArray(json?.matches)) return json.matches;
    if (Array.isArray(json?.data)) return json.data;
    return [];
  }

  async function getJsonFromPage() {
    const txt = (document.body && document.body.textContent || '').trim();
    if (txt.startsWith('{') || txt.startsWith('[')) {
      try { return JSON.parse(txt); } catch (_) {}
    }
    try {
      const r = await fetch(location.href, { credentials: 'include' });
      return await r.json();
    } catch (e) {
      console.error('Fetch/JSON parse failed', e);
      return null;
    }
  }

  function buildUI(matches, rawJson) {
    document.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'pl-wrap';

    const header = document.createElement('div');
    header.className = 'pl-header';

    const title = document.createElement('div');
    title.className = 'pl-title';
    title.textContent = 'Premier League – Přehled zápasů (z Pulselive API)';

    const actions = document.createElement('div');
    actions.className = 'pl-actions';

    const count = document.createElement('div');
    count.className = 'pl-count';
    count.textContent = `Nalezeno zápasů: ${matches.length}`;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'pl-btn';
    toggleBtn.textContent = 'Zobrazit RAW JSON';
    const rawBox = document.createElement('div');
    rawBox.className = 'pl-json';
    rawBox.textContent = (() => {
      try { return JSON.stringify(rawJson, null, 2); } catch { return '—'; }
    })();
    toggleBtn.addEventListener('click', () => {
      const vis = rawBox.style.display === 'block';
      rawBox.style.display = vis ? 'none' : 'block';
      toggleBtn.textContent = vis ? 'Zobrazit RAW JSON' : 'Skrýt RAW JSON';
    });

    actions.append(count, toggleBtn);
    header.append(title, actions);

    const table = document.createElement('table');
    table.className = 'pl-table';
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th class="nowrap">Datum & čas</th>
        <th>Domácí</th>
        <th>Hosté</th>
        <th class="nowrap">LIVE URL</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (const m of matches) {
      const id = String(pickMatchId(m) ?? '').trim();
      const dt = parsePossiblyMillis(m?.kickoff);
      const { home, away } = pickTeams(m);
      const liveHref = id ? `https://www.premierleague.com/en/match/${id}/?tab=preview` : '';

      const tr = document.createElement('tr');

      const tdDT = document.createElement('td');
      tdDT.textContent = toLocalDT(dt);

      const tdHome = document.createElement('td');
      tdHome.textContent = home || '';

      const tdAway = document.createElement('td');
      tdAway.textContent = away || '';

      const tdLink = document.createElement('td');
      if (liveHref) {
        const a = document.createElement('a');
        a.href = liveHref;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'pl-live';
        a.textContent = 'LIVE URL';
        tdLink.appendChild(a);
      } else {
        tdLink.innerHTML = '<span class="pl-muted">–</span>';
      }

      tr.append(tdDT, tdHome, tdAway, tdLink);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    const foot = document.createElement('div');
    foot.className = 'pl-footnote';
    foot.textContent = 'Tip: uprav query parametry v URL (competition, season, kickoff> / kickoff<, _limit atd.) a stránku obnov.';

    wrap.append(header, table, foot, rawBox);
    document.body.appendChild(wrap);
  }

  async function main() {
    css();
    const json = await getJsonFromPage();
    if (!json) {
      document.body.innerHTML = '<div class="pl-wrap">Nepodařilo se načíst JSON z této adresy.</div>';
      return;
    }
    const matches = extractMatches(json);
    buildUI(matches, json);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
