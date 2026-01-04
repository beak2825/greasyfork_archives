// ==UserScript==
// @name         Snooker Scores API
// @namespace    cz.snookerscores.table
// @version      2.0
// @description  Přidá tabulku nad JSON
// @license      MIT
// @author       JV
// @match        https://snookerscores.net/scoreboard/api/match/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547636/Snooker%20Scores%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/547636/Snooker%20Scores%20API.meta.js
// ==/UserScript==

(function() {
  'use strict';

  try {
    const raw  = document.body.textContent || document.body.innerText || '{}';
    const data = JSON.parse(raw);

    const match = data.match || {};
    const logs  = data.match_log && Array.isArray(data.match_log.log) ? data.match_log.log : [];
    const p1 = data.player_1 || {};
    const p2 = data.player_2 || {};

    const table = document.createElement('table');
    table.style.border = '1px solid #000';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '16px auto';
    table.style.background = '#fff';
    table.style.fontFamily = 'Arial, sans-serif';
    table.style.minWidth = '480px';

    function addHeader(title) {
      const row = table.insertRow();
      const th = document.createElement('th');
      th.colSpan = 2;
      th.textContent = title;
      th.style.border = '1px solid #000';
      th.style.padding = '6px';
      th.style.background = '#eee';
      th.style.textAlign = 'center';
      row.appendChild(th);
    }

    function addRow(label, value, id) {
      const row = table.insertRow();
      if (id) row.id = id;
      const td1 = row.insertCell();
      const td2 = row.insertCell();
      td1.textContent = label;
      td2.textContent = (value ?? '') !== '' ? value : '-';
      td1.style.border = '1px solid #000';
      td2.style.border = '1px solid #000';
      td1.style.padding = '5px';
      td2.style.padding = '5px';
    }

    // Zápas
    addHeader('Zápas');
    addRow('Turnaj', match.tournament_name, 'turnaj');
    addRow('Frame scores', match.frame_scores, 'frame-scores');
    addRow('Dokončeno', match.completed ? 'Ano' : 'Ne', 'dokonceno');
    if (match.match_end) addRow('Konec zápasu', match.match_end, 'konec-zapasu');

    // Status: match.in_progress == 1 → Probíhá; jinak pokud completed===true → Konec; jinak "-"
    let status = '-';
    if (Number(match.in_progress) === 1) {
      status = 'Probíhá';
    } else if (match.completed === true) {
      status = 'Konec zápasu';
    }
    addRow('Status', status, 'status');

    if (logs.length > 0) {
      const lastMsg = String(logs[0].message || '').replace(/<[^>]+>/g, '');
      addRow('Log', lastMsg, 'log');
    }

    // Home
    if (p1.first_name || p1.last_name) {
      addHeader('Home');
      addRow('Hráč', [p1.first_name, p1.last_name].filter(Boolean).join(' '), 'home-hrac');
      addRow('Frames', p1.frames, 'home-frames');
      addRow('Balls potted', p1.balls_potted, 'home-balls');
      addRow('Shot time', p1.average_shot_time, 'home-shot');
      addRow('Points start', p1.points_start, 'home-points');
    }

    // Away
    if (p2.first_name || p2.last_name) {
      addHeader('Away');
      addRow('Hráč', [p2.first_name, p2.last_name].filter(Boolean).join(' '), 'away-hrac');
      addRow('Frames', p2.frames, 'away-frames');
      addRow('Balls potted', p2.balls_potted, 'away-balls');
      addRow('Shot time', p2.average_shot_time, 'away-shot');
      addRow('Points start', p2.points_start, 'away-points');
    }

    // Vložit tabulku nad JSON
    document.body.prepend(table);
  } catch (e) {
    console.error('[SnookerScores] Chyba při parsování JSON:', e);
  }
})();
