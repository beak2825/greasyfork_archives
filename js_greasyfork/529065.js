// ==UserScript==
// @name         OMCStandingsSearch
// @namespace    yura1685
// @version      1.0.0
// @description  Onlinemathcontestの順位表ページでユーザー名を検索
// @match        https://onlinemathcontest.com/contests/*/standings
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529065/OMCStandingsSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/529065/OMCStandingsSearch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ratingColors = [
    { min: 1, max: 400, color: '#808080' },
    { min: 400, max: 800, color: '#804000' },
    { min: 800, max: 1200, color: '#008000' },
    { min: 1200, max: 1600, color: '#00c0c0' },
    { min: 1600, max: 2000, color: '#0000ff' },
    { min: 2000, max: 2400, color: '#c0c000' },
    { min: 2400, max: 2800, color: '#ff8000' },
    { min: 2800, max: 999999, color: '#ff0000' },
  ];

  function getColorByRating(rating) {
    if (rating === 0) return '#000000';
    for (const range of ratingColors) {
      if (rating >= range.min && rating < range.max) {
        return range.color;
      }
    }
    return '#000000';
  }

  function formatTime(seconds) {
    if (seconds === null) return '--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  const match = location.href.match(/contests\/([^/]+)\/standings/);
  if (!match) return;
  const contestName = match[1];
  const apiUrl = `https://onlinemathcontest.com/api/contests/${contestName}/standings?rated=0`;

  const searchDiv = document.createElement('div');
  searchDiv.style.marginBottom = '10px';
  searchDiv.innerHTML = `
    <label for="searchUser">ユーザー名検索： </label>
    <input type="text" id="searchUser" placeholder="ユーザー名を入力">
    <button id="clearSearch" style="margin-left: 5px; cursor: pointer;">×</button>
  `;

  const standingsDiv = document.getElementById('standings');
  if (standingsDiv) {
    standingsDiv.parentNode.insertBefore(searchDiv, standingsDiv);
  }

  fetch(apiUrl)
    .then(res => res.json())
    .then(json => {
      if (!standingsDiv) {
        console.warn('#standingsが見つかりません');
        return;
      }

      const tasks = json.tasks || [];
      const standings = json.standings;

      const taskHeaders = tasks.map((task, index) => {
        const problemChar = String.fromCharCode(65 + index);
        const point = task.admin_point ?? '';
        return `
          <th style="border:1px solid #ccc; padding:4px;">
            ${problemChar}<br>
            <span style="font-size: 0.8em; color: #888;">${point}</span>
          </th>`;
      }).join('');

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.margin = '0 auto';
      table.style.textAlign = 'center';
      table.style.border = '1px solid #ccc'; // 全体に境界線
      table.innerHTML = `
        <thead>
          <tr>
            <th style="border:1px solid #ccc; padding:4px;">Rank</th>
            <th style="border:1px solid #ccc; padding:4px;">User</th>
            <th style="border:1px solid #ccc; padding:4px;">Score</th>
            <th style="border:1px solid #ccc; padding:4px;">Penalty</th>
            <th style="border:1px solid #ccc; padding:4px;">Time</th>
            ${taskHeaders}
          </tr>
        </thead>
        <tbody></tbody>
      `;
      table.style.display = 'none'; // 初期状態では非表示
      standingsDiv.insertBefore(table, standingsDiv.firstChild);

      const tbody = table.querySelector('tbody');

      standings.forEach(userStand => {
        const tr = document.createElement('tr');
        const userName = userStand.user?.id || 'Unknown';
        const userRate = userStand.user?.rate ?? 0;
        const userColor = getColorByRating(userRate);
        const score = userStand.point ?? 0;
        const penalty = userStand.penalty ?? 0;
        const time = userStand.time ?? 0;

        const penaltyColor = penalty === 0 ? '#0000ff' : '#ff0000';
        const taskStatus = (userStand.tasks || []).map(task => task.time !== null ? '✔️' : '');

        const taskCells = tasks.map((_, i) => `
          <td style="text-align:center; border:1px solid #ccc; padding:4px;">
            <b>${taskStatus[i] || ''}</b>
          </td>`).join('');
         const userNameLink = `
           <a href="https://onlinemathcontest.com/users/${userName}"
             style="color:${userColor}; text-decoration:none;"
             target="_blank">
             <b>${userName}</b>
           </a>
         `;

         tr.innerHTML = `
           <td style="border:1px solid #ccc; padding:4px;"><b>${userStand.rank}</b></td>
           <td style="border:1px solid #ccc; padding:4px;">${userNameLink}</td>
           <td style="border:1px solid #ccc; padding:4px; color:#0000ff;"><b>${score}</b></td>
           <td style="border:1px solid #ccc; padding:4px; color:${penaltyColor};"><b>${penalty}</b></td>
           <td style="border:1px solid #ccc; padding:4px;"><b>${formatTime(time)}</b></td>
           ${taskCells}
         `;

        tbody.appendChild(tr);
      });

      const searchInput = document.getElementById('searchUser');
      const clearButton = document.getElementById('clearSearch');

      searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach(row => {
          const userNameElement = row.querySelector('td:nth-child(2)');
          row.style.display = userNameElement && userNameElement.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
        table.style.display = query ? '' : 'none';
      });

      clearButton.addEventListener('click', function() {
        searchInput.value = '';
        table.style.display = 'none';
      });
    })
    .catch(err => {
      console.error('APIからのデータ取得に失敗しました:', err);
    });
})();
