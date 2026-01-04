// ==UserScript==
// @name        Bitcointalk Tracker 2.2
// @namespace   https://bitcointalk.org
// @version     2.2.0
// @description Weekly post count + Merit received + custom goals + local board details + customizable excluded boards + theme selection
// @author      Ace
// @match       https://bitcointalk.org/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/543499/Bitcointalk%20Tracker%2022.user.js
// @updateURL https://update.greasyfork.org/scripts/543499/Bitcointalk%20Tracker%2022.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Lista degli ID delle board locali (per paese/lingua)
  const localBoardIds = [
    // Italiano
    28, 107, 132, 153, 162, 169, 171, 170, 115, 144, 145, 165, 175, 200, 205,
    // Portoghese
    29, 69, 131, 134, 135, 181, 206,
    // Spagnolo
    27, 101, 102, 103, 104, 105, 130, 151,
    // Cinese
    30, 117, 118, 119, 146, 196,
    // Russo
    10, 18, 20, 21, 22, 23, 55, 66, 72, 90, 91, 185, 236, 237, 248, 256,
    // Francese
    13, 47, 48, 49, 50, 54, 149, 183, 184, 186, 187, 188, 208, 210, 211, 258,
    // Tedesco
    16, 269, 36, 60, 61, 62, 63, 64, 139, 140, 152, 270,
    // Olandese
    79, 80, 94, 116, 143, 147, 148, 150,
    // Turco
    133, 155, 156, 157, 158, 174, 180, 189, 190, 230, 232, 235, 239, 265,
    // Polacco
    142, 163, 164, 263, 264,
    // Indonesiano
    191, 192, 193, 194, 276, 277, 278,
    // Croato
    201, 220, 221, 272, 273,
    // Filippino
    219, 243, 260, 268, 274,
    // Arabo
    241, 242, 253, 266, 267, 271,
    // Giapponese
    252, 255,
    // Nigeriano
    275, 279, 280,
    // Greco
    120, 136, 179, 195, 246, 247,
    // Ebraico
    95,
    // Rumeno
    108, 109, 110, 111, 112, 113, 114, 166, 259
  ];

  const usernames = ['*ace*', 'lillominato89'];
  let selectedUser = localStorage.getItem('btwk_user') || usernames[0];
  let startDayIndex = parseInt(localStorage.getItem(`btwk_dayIndex_${selectedUser}`)) || 5; // Friday
  let timezoneOffset = parseInt(localStorage.getItem(`btwk_tzOffset_${selectedUser}`)) || 0;
  let currentWeekOffset = 0;
  let collapsed = localStorage.getItem('btwk_collapsed') === 'true';
  let selectedTheme = localStorage.getItem('btwk_theme') || 'original';

  // Default excluded boards: Offtopic (9), Games & Rounds (71), Mega Threads (243), Services (52)
  const defaultExcludedBoards = { 9: true, 71: true, 243: true, 52: true, 145: true};

  // Available boards to exclude
  const availableBoards = [
    { id: 9, name: "Offtopic" },
    { id: 145, name: "Off-Topic (IT)"},
    { id: 71, name: "Games & Rounds" },
    { id: 243, name: "Mega Threads" },
    { id: 52, name: "Services" }
  ];

  const defaultGoals = {
    minGambling: 10,
    maxLocal: 5,
    maxValidPosts: 20,
    showMerits: true,
    excludedBoards: { ...defaultExcludedBoards },
    excludeLocalBoards: false
  };

  // Funzione per applicare il tema selezionato
  function applyTheme() {
    const style = document.createElement('style');
    if (selectedTheme === 'blocknotes') {
      style.textContent = `
        #btwk_box {
          background: #f9f9d1;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0, 0, 0, 0.1) 24px);
          border: 2px solid #b9b991;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
          color: #333;
        }
        #btwk_content {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4;
        }
        #btwk_box button {
          background: #d9d9b1;
          color: #333;
          border: 1px solid #b9b991;
        }
        #btwk_box button:hover {
          background: #e9e9c1;
        }
        #btwk_box select, #btwk_box input[type="number"] {
          background: #f0f0e0;
          color: #333;
          border: 1px solid #b9b991;
        }
      `;
    } else if (selectedTheme === 'windtail') {
      style.textContent = `
        #btwk_box {
          background: white;
          border-left: 4px solid #0066cc;
          border-top: 1px solid #999;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
          color: #000;
        }
        #btwk_content {
          font-family: 'MS Sans Serif', Arial, sans-serif;
          line-height: 1.4;
        }
        #btwk_box button {
          background: #c0c0c0;
          color: #000;
          border: 1px solid #999;
        }
        #btwk_box button:hover {
          background: #0066cc;
          color: white;
        }
        #btwk_box select, #btwk_box input[type="number"] {
          background: white;
          color: #000;
          border: 1px solid #999;
        }
      `;
    } else if (selectedTheme === 'darkmodern') {
      style.textContent = `
        #btwk_box {
          background: #121212;
          border: 1px solid #2a2a2a;
          box-shadow: 0 0 10px rgba(0, 122, 204, 0.3);
          color: #e0e0e0;
        }
        #btwk_content {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4;
        }
        #btwk_box button {
          background: #1e1e1e;
          color: #e0e0e0;
          border: 1px solid #007acc;
        }
        #btwk_box button:hover {
          background: #007acc;
        }
        #btwk_box select, #btwk_box input[type="number"] {
          background: #1e1e1e;
          color: #e0e0e0;
          border: 1px solid #007acc;
        }
      `;
    } else if (selectedTheme === 'neon') {
  style.textContent = `
    #btwk_box {
      background: #0a0a1a;
      border: 1px solid #00ffff;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
      color: #00ffff; /* Blu neon per le scritte */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    #btwk_content {
      line-height: 1.4;
    }
    /* Numeri in rosa neon */
    #btwk_stats b, #btwk_merits b {
      color: #ff00ff; /* Rosa neon per i numeri */
    }
    #btwk_box button {
      background: transparent;
      color: #00ffff; /* Blu neon per i pulsanti */
      border: 1px solid #00ffff;
    }
    #btwk_box button:hover {
      background: rgba(255, 0, 255, 0.2);
      color: #ff00ff; /* Rosa neon al passaggio del mouse */
    }
    #btwk_box select, #btwk_box input[type="number"] {
      background: #0a0a1a;
      color: #00ffff; /* Blu neon per i campi input */
      border: 1px solid #00ffff;
    }
    /* Numeri in rosa neon */
    #btwk_stats span, #btwk_merits span {
      color: #ff00ff;
    }
  `;
    } else if (selectedTheme === 'retro') {
      style.textContent = `
        #btwk_box {
          background: #000000;
          border: 1px solid #00ff00;
          color: #00ff00;
          font-family: monospace;
        }
        #btwk_content {
          line-height: 1.4;
        }
        #btwk_box button {
          background: transparent;
          color: #00ff00;
          border: 1px solid #00ff00;
        }
        #btwk_box button:hover {
          background: rgba(0, 255, 0, 0.1);
        }
        #btwk_box select, #btwk_box input[type="number"] {
          background: #000000;
          color: #00ff00;
          border: 1px solid #00ff00;
        }
      `;
    } else if (selectedTheme === 'nord') {
      style.textContent = `
        #btwk_box {
          background: #2e3440;
          border: 1px solid #3b4252;
          color: #eceff4;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #btwk_content {
          line-height: 1.4;
        }
        #btwk_box button {
          background: #3b4252;
          color: #eceff4;
          border: none;
        }
        #btwk_box button:hover {
          background: #5e81ac;
        }
        #btwk_box select, #btwk_box input[type="number"] {
          background: #3b4252;
          color: #eceff4;
          border: 1px solid #5e81ac;
        }
      `;
    } else {
      style.textContent = `
        #btwk_box {
          background: #222;
          color: #fff;
          border: none;
          box-shadow: 0 0 8px rgba(0,0,0,0.6);
        }
        #btwk_box button {
          background: #444;
          color: #fff;
          border: none;
        }
      `;
    }
    document.head.appendChild(style);
  }

  // --- Funzioni esistenti ---
  function getUserGoals(user) {
    const str = localStorage.getItem(`btwk_goals_${user}`);
    if (!str) return { ...defaultGoals };
    try {
      const goals = JSON.parse(str);
      if (!goals.excludedBoards) {
        goals.excludedBoards = { ...defaultExcludedBoards };
      }
      return goals;
    } catch (e) {
      console.error("Error parsing goals:", e);
      return { ...defaultGoals };
    }
  }

  function saveUserGoals(user, goals) {
    localStorage.setItem(`btwk_goals_${user}`, JSON.stringify(goals));
  }

  function getWeekRange(offset = 0) {
    const now = new Date();
    const utc = new Date(now.getTime() + timezoneOffset * 60 * 60 * 1000);
    const day = utc.getUTCDay();
    const daysSinceStart = (day + 7 - startDayIndex) % 7;
    const start = new Date(utc);
    start.setUTCDate(utc.getUTCDate() - daysSinceStart + offset * 7);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 7);
    end.setUTCHours(0, 0, 0, Math.floor(Math.random() * 1000));
    return {
      from: start.toISOString().split('.')[0],
      to: end.toISOString(),
      label: `${start.toISOString().slice(0, 10)} → ${new Date(end - 1).toISOString().slice(0, 10)} (UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset})`,
    };
  }

  function fetchBoardStats() {
    const { from, to, label } = getWeekRange(currentWeekOffset);
    const url = `https://api.ninjastic.space/users/${selectedUser}/boards?from=${from}&to=${to}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!json || json.result !== 'success' || !json.data) {
          renderStats(`❌ Error fetching data`);
          return;
        }
        const boards = json.data.boards || [];
        const totalWithBoard = json.data.total_results_with_board || 0;
        const totalAll = json.data.total_results || 0;
        const unclassified = totalAll - totalWithBoard;
        let gambling = 0;
        let local = 0;
        let excluded = 0;
        let localBoardsDetail = {};
        const otherBoards = [];
        const goals = getUserGoals(selectedUser);
        const excludedBoardIds = Object.keys(goals.excludedBoards)
          .filter(id => goals.excludedBoards[id])
          .map(Number);
        const excludeLocalBoards = goals.excludeLocalBoards;
        boards.forEach((b) => {
          if (!b || !b.key) return;
          if ([228, 56].includes(b.key)) {
            gambling += b.count;
          }
          else if (excludedBoardIds.includes(b.key)) {
            excluded += b.count;
            otherBoards.push({ name: `⛔ ${b.name}`, count: b.count });
          }
          else if (localBoardIds.includes(b.key)) {
            if (!excludeLocalBoards) {
              local += b.count;
              if (!localBoardsDetail[b.name]) {
                localBoardsDetail[b.name] = 0;
              }
              localBoardsDetail[b.name] += b.count;
            } else {
              excluded += b.count;
              otherBoards.push({ name: `⛔ ${b.name}`, count: b.count });
            }
          }
          else {
            otherBoards.push({ name: b.name, count: b.count });
          }
        });
        const validLocal = Math.min(local, goals.maxLocal);
        const excessLocal = local > goals.maxLocal ? local - goals.maxLocal : 0;
        const validTotal = totalAll - excluded - unclassified - excessLocal;
        const gamblingCheck = gambling >= goals.minGambling ? '✅' : '❌';
        const localCheck = (local === 0) ? '✔️' : (local >= goals.maxLocal ? '✅' : '☑️');
        let html = `<b>👤 Account:</b> ${selectedUser} <span id="btwk_settings_btn" style="cursor:pointer;">⚙️</span><br>`;
        html += `<b>📅 Week:</b><br>${label}<br><br>`;
        html += `🧮 <b>Post valid:</b> (${validTotal} / ${goals.maxValidPosts}) Total: ${totalAll}<br>`;
        html += `🧩 <b>Unclassified:</b> ${unclassified}<br>`;
        html += `🃏 <b>Gambling:</b> ${gambling} / min ${goals.minGambling} ${gamblingCheck}<br>`;
        html += `🌍 <b>Local:</b> ${local} / max ${goals.maxLocal} ${localCheck}<br>`;
        if (gamblingCheck === '✅' && localCheck === '✅') {
          html += `<div style="font-family: monospace; color: #00ff00; margin: 5px 0; font-weight: bold;">WELL DONE!</div>`;
        }
        if (Object.keys(localBoardsDetail).length > 0) {
          html += `<b>📌 Local boards:</b><br>`;
          for (const [boardName, count] of Object.entries(localBoardsDetail)) {
            html += `• ${boardName}: ${count}<br>`;
          }
        }
        html += `<br>`;
        if (otherBoards.length > 0) {
          html += `<b>📌 Other boards:</b><br>`;
          otherBoards.forEach((b) => {
            html += `• ${b.name}: ${b.count}<br>`;
          });
        }
        renderStats(html);
        addSettingsListener();
      })
      .catch((err) => {
        renderStats(`⚠️ Network error: ${err.message}`);
      });
  }

  function fetchMerits() {
    const { from, to } = getWeekRange(currentWeekOffset);
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://bpip.org/smerit.aspx?to=${selectedUser}&start=${from}&end=${to}`)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.contents) {
          renderMerits(`❌ Error loading Merits: No data received`);
          return;
        }
        const html = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        if (!table) {
          renderMerits(`❌ Error loading Merits: No table found`);
          return;
        }
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const fromMap = {};
        let total = 0;
        rows.forEach((row) => {
          const tds = row.querySelectorAll('td');
          if (tds.length >= 4) {
            const from = tds[1].innerText.replace('(Summary)', '').trim();
            const amount = parseInt(tds[3].innerText.trim());
            fromMap[from] = (fromMap[from] || 0) + amount;
            total += amount;
          }
        });
        let htmlOut = `<b>⭐ Merits received: ${total}</b><br>`;
        if (total === 0) {
          htmlOut += `No Merits received this week.`;
        } else {
          Object.entries(fromMap)
            .sort((a, b) => b[1] - a[1])
            .forEach(([from, count]) => {
              htmlOut += `• ${from}: ${count}<br>`;
            });
        }
        renderMerits(htmlOut);
      })
      .catch((err) => {
        renderMerits(`❌ Error loading Merits: ${err.message}`);
      });
  }

  function renderStats(html) {
    const div = document.getElementById('btwk_stats');
    if (div) div.innerHTML = html;
  }

  function renderMerits(html) {
    const div = document.getElementById('btwk_merits');
    if (div) div.innerHTML = html;
  }

  function addSettingsListener() {
    const btn = document.getElementById('btwk_settings_btn');
    if (!btn) return;
    btn.onclick = () => toggleSettingsBox();
  }

  function toggleSettingsBox() {
    let box = document.getElementById('btwk_settings_box');
    if (box) return box.remove();
    const goals = getUserGoals(selectedUser);
    const dayOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      .map((day, i) => `<option value="${i}" ${i === startDayIndex ? 'selected' : ''}>${day}</option>`)
      .join('');

    const excludedBoardsHTML = availableBoards.map(board => {
      const isChecked = goals.excludedBoards[board.id] ? 'checked' : '';
      return `
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="exclude_${board.id}" ${isChecked}> Exclude ${board.name}
        </label>
      `;
    }).join('');

    box = document.createElement('div');
    box.id = 'btwk_settings_box';
    box.style.marginTop = '8px';
    box.style.padding = '8px';
    box.style.background = selectedTheme === 'blocknotes' ? '#e9e9c1' :
                           selectedTheme === 'windtail' ? 'white' :
                           selectedTheme === 'darkmodern' ? '#1e1e1e' :
                           selectedTheme === 'neon' ? '#0a0a1a' :
                           selectedTheme === 'retro' ? '#000' :
                           selectedTheme === 'nord' ? '#3b4252' : '#333';
    box.style.color = selectedTheme === 'blocknotes' || selectedTheme === 'windtail' || selectedTheme === 'retro' ? '#333' :
                      selectedTheme === 'neon' ? '#0ff0fc' :
                      selectedTheme === 'nord' ? '#eceff4' : '#eee';
    box.style.borderRadius = '10px';
    box.style.border = selectedTheme === 'windtail' ? '1px solid #999' :
                       selectedTheme === 'retro' ? '1px solid #00ff00' : 'none';
    box.innerHTML = `
      <b>⚙️ Settings for <i>${selectedUser}</i></b><br><br>
      <label>Minimum Gambling:
        <input type="number" id="goalMinGambling" min="0" value="${goals.minGambling}" style="width:60px; margin-left:8px;">
      </label><br><br>
      <label>Maximum Local:
        <input type="number" id="goalMaxLocal" min="0" value="${goals.maxLocal}" style="width:60px; margin-left:18px;">
      </label><br><br>
      <label>Max Valid Posts:
        <input type="number" id="goalMaxValidPosts" min="0" value="${goals.maxValidPosts}" style="width:60px; margin-left:10px;">
      </label><br><br>
      <label>📅 Week starts on:
        <select id="btwk_day_select" style="margin-left:4px;">${dayOptions}</select>
      </label><br><br>
      <label>🕓 UTC
        <input type="number" id="btwk_tz_input" value="${timezoneOffset}" style="width:40px; margin-left:18px;">
      </label><br><br>
      <label>
        <input type="checkbox" id="btwk_show_merits" ${goals.showMerits ? 'checked' : ''}> Show Merits received
      </label><br><br>
      <label>🎨 Tema:
        <select id="btwk_theme_select" style="margin-left:18px;">
          <option value="original" ${selectedTheme === 'original' ? 'selected' : ''}>Originale</option>
          <option value="blocknotes" ${selectedTheme === 'blocknotes' ? 'selected' : ''}>Block Notes</option>
          <option value="windtail" ${selectedTheme === 'windtail' ? 'selected' : ''}>Windtail</option>
          <option value="darkmodern" ${selectedTheme === 'darkmodern' ? 'selected' : ''}>Dark Modern</option>
          <option value="neon" ${selectedTheme === 'neon' ? 'selected' : ''}>Neon Cyberpunk</option>
          <option value="retro" ${selectedTheme === 'retro' ? 'selected' : ''}>Retro Terminal</option>
          <option value="nord" ${selectedTheme === 'nord' ? 'selected' : ''}>Nord</option>
        </select>
      </label><br><br>
      <details style="margin-top: 10px; margin-bottom: 10px;">
        <summary style="cursor: pointer; font-weight: bold;">📋 Excluded Boards</summary>
        ${excludedBoardsHTML}
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="excludeLocalBoards" ${goals.excludeLocalBoards ? 'checked' : ''}> Exclude Local Boards
        </label>
      </details>
      <button id="saveGoalsBtn" style="padding:4px 10px; cursor:pointer;">💾 Save</button>
    `;
    const container = document.getElementById('btwk_content');
    container.appendChild(box);
    document.getElementById('saveGoalsBtn').onclick = () => {
      const newMin = parseInt(document.getElementById('goalMinGambling').value) || 0;
      const newMax = parseInt(document.getElementById('goalMaxLocal').value) || 0;
      const newMaxValidPosts = parseInt(document.getElementById('goalMaxValidPosts').value) || 0;
      const newDayIndex = parseInt(document.getElementById('btwk_day_select').value);
      const newTzOffset = parseInt(document.getElementById('btwk_tz_input').value) || 0;
      const newShowMerits = document.getElementById('btwk_show_merits').checked;
      const newExcludeLocalBoards = document.getElementById('excludeLocalBoards').checked;
      const newTheme = document.getElementById('btwk_theme_select').value;
      const newExcludedBoards = { ...defaultExcludedBoards };
      availableBoards.forEach(board => {
        newExcludedBoards[board.id] = document.getElementById(`exclude_${board.id}`).checked;
      });
      saveUserGoals(selectedUser, {
        minGambling: newMin,
        maxLocal: newMax,
        maxValidPosts: newMaxValidPosts,
        showMerits: newShowMerits,
        excludedBoards: newExcludedBoards,
        excludeLocalBoards: newExcludeLocalBoards
      });
      startDayIndex = newDayIndex;
      timezoneOffset = newTzOffset;
      selectedTheme = newTheme;
      localStorage.setItem(`btwk_dayIndex_${selectedUser}`, startDayIndex);
      localStorage.setItem(`btwk_tzOffset_${selectedUser}`, timezoneOffset);
      localStorage.setItem('btwk_theme', selectedTheme);
      box.remove();
      applyTheme();
      updateBoxContent();
      update();
    };
  }

  function renderBox() {
    if (document.getElementById('btwk_box')) return;

    const box = document.createElement('div');
    box.id = 'btwk_box';
    box.style.position = 'fixed';
    box.style.bottom = '10px';
    box.style.right = '10px';
    box.style.padding = '12px';
    box.style.borderRadius = '12px';
    box.style.fontSize = '13px';
    box.style.width = '280px';
    box.style.zIndex = '9999';

    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = collapsed ? '➕' : '➖';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = '5px';
    toggleBtn.style.right = '5px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.style.padding = '2px 6px';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.onclick = () => {
      collapsed = !collapsed;
      localStorage.setItem('btwk_collapsed', collapsed);
      updateBoxContent();
      toggleBtn.innerText = collapsed ? '➕' : '➖';
    };
    box.appendChild(toggleBtn);

    const content = document.createElement('div');
    content.id = 'btwk_content';
    box.appendChild(content);

    document.body.appendChild(box);
    applyTheme();
    updateBoxContent();
  }

  function updateBoxContent() {
    const container = document.getElementById('btwk_content');
    if (!container) return;
    const goals = getUserGoals(selectedUser);

    if (collapsed) {
      container.innerHTML = '<i style="opacity:0.7;">Tracker minimized</i>';
    } else {
      container.innerHTML = `
        <div style="margin-bottom:8px;">
          <label>👤
            <select id="btwk_user_select">${usernames.map((u) => `<option value="${u}"${u === selectedUser ? ' selected' : ''}>${u}</option>`).join('')}</select>
          </label>
        </div>
        <div style="margin-bottom:8px;">
          <button id="btwk_prev">⏪</button>
          <button id="btwk_next">⏩</button>
        </div>
        <div id="btwk_stats">⏳ Loading...</div>
        ${goals.showMerits ? '<hr><div id="btwk_merits">⏳ Loading Merits...</div>' : ''}
      `;

      document.getElementById('btwk_user_select').onchange = (e) => {
        selectedUser = e.target.value;
        localStorage.setItem('btwk_user', selectedUser);
        startDayIndex = parseInt(localStorage.getItem(`btwk_dayIndex_${selectedUser}`)) || 5;
        timezoneOffset = parseInt(localStorage.getItem(`btwk_tzOffset_${selectedUser}`)) || 0;
        update();
      };

      document.getElementById('btwk_prev').onclick = () => {
        currentWeekOffset--;
        update();
      };

      document.getElementById('btwk_next').onclick = () => {
        currentWeekOffset++;
        update();
      };

      update();
    }
  }

  function update() {
    if (!collapsed) {
      fetchBoardStats();
      const goals = getUserGoals(selectedUser);
      if (goals.showMerits) fetchMerits();
    }
  }

  renderBox();
  update();
})();
