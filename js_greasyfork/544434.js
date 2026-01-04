// ==UserScript==
// @name         Bitcointalk Monthly Stats
// @namespace    https://bitcointalk.org
// @version      1.1
// @description  Insert stats box right below profile tabs inside #bodyarea on Bitcointalk profile page
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544434/Bitcointalk%20Monthly%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/544434/Bitcointalk%20Monthly%20Stats.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const boxId = 'monthlyStatsBox';
  const now = new Date();
  let currentMonthOffset = 0;

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  function addOneDayWithRandomSeconds(dateString) {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    const seconds = pad(Math.floor(Math.random() * 59) + 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:${seconds}`;
  }

  function getDateRange(monthOffset = 0) {
    const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const firstDay = `${year}-${pad(month)}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDate = `${year}-${pad(month)}-${pad(lastDay)}`;
    const label = `${date.toLocaleString('en', { month: 'long' })} ${year}`;
    return { from: firstDay, to: lastDate, label, y: year, m: month };
  }

  function extractUidAndUsername() {
    const uidMatch = location.href.match(/u=(\d+)/);
    const uid = uidMatch ? uidMatch[1] : null;
    const nameRow = Array.from(document.querySelectorAll('td')).find(td => td.textContent.trim() === 'Name:');
    const username = nameRow ? nameRow.nextElementSibling.textContent.trim() : null;
    return { uid, username };
  }

  async function fetchBoardData(username, from, to) {
    const url = `https://api.ninjastic.space/users/${username}/boards?from=${from}T00:00:00&to=${addOneDayWithRandomSeconds(to)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.result !== 'success') return null;
    return json.data;
  }

  async function fetchMerit(type, username, y, m) {
    const from = `${y}-${pad(m)}-01`;
    const to = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`;
    const param = type === 'received' ? 'to' : 'from';
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://bpip.org/smerit.aspx?&${param}=${username}&start=${from}&end=${to}`)}`;
    const res = await fetch(url);
    const htmlText = await res.text();
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const rows = Array.from(doc.querySelectorAll('table tbody tr'));
    if (!rows.length) return null;
    const data = {};
    let total = 0;
    rows.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length >= 4) {
        let name = tds[type === 'received' ? 1 : 2].innerText.trim();
        name = name.replace(/\s*\(Summary\)$/, '');
        const count = parseInt(tds[3].innerText.trim()) || 0;
        total += count;
        data[name] = (data[name] || 0) + count;
      }
    });
    return { total, data };
  }

  function createBox() {
    let existing = document.getElementById(boxId);
    if (existing) return existing;

    const container = document.createElement('div');
    container.id = boxId;
    container.style.background = '#222';
    container.style.color = '#fff';
    container.style.padding = '12px';
    container.style.marginTop = '10px';
    container.style.borderRadius = '12px';
    container.style.fontSize = '13px';
    container.style.maxWidth = '700px';
    container.style.boxShadow = '0 0 8px rgba(0,0,0,0.6)';
    container.style.fontFamily = 'Arial, sans-serif';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Hide Stats';
    toggleBtn.style.marginBottom = '10px';
    toggleBtn.style.padding = '5px 10px';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '8px';
    toggleBtn.style.background = '#555';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.onclick = () => {
      if (container.style.display !== 'none') {
        container.style.display = 'none';
        toggleBtn.textContent = 'Show Stats';
      } else {
        container.style.display = 'block';
        toggleBtn.textContent = 'Hide Stats';
      }
    };
    container.appendChild(toggleBtn);

    const statsContent = document.createElement('div');
    statsContent.id = `${boxId}-content`;
    statsContent.innerHTML = 'Loading...';
    container.appendChild(statsContent);

    const nav = document.createElement('div');
    nav.style.marginTop = '8px';
    nav.style.display = 'flex';
    nav.style.justifyContent = 'space-between';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous Month';
    prevBtn.style.flex = '1';
    prevBtn.style.marginRight = '4px';
    prevBtn.style.padding = '6px';
    prevBtn.style.border = 'none';
    prevBtn.style.borderRadius = '6px';
    prevBtn.style.background = '#444';
    prevBtn.style.color = '#fff';
    prevBtn.style.cursor = 'pointer';
    prevBtn.onclick = () => {
      currentMonthOffset--;
      renderStats();
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Month →';
    nextBtn.style.flex = '1';
    nextBtn.style.marginLeft = '4px';
    nextBtn.style.padding = '6px';
    nextBtn.style.border = 'none';
    nextBtn.style.borderRadius = '6px';
    nextBtn.style.background = '#444';
    nextBtn.style.color = '#fff';
    nextBtn.style.cursor = 'pointer';
    nextBtn.onclick = () => {
      if (currentMonthOffset < 0) {
        currentMonthOffset++;
        renderStats();
      }
    };

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    container.appendChild(nav);

    const bodyarea = document.getElementById('bodyarea');
    if (bodyarea) {
      bodyarea.insertBefore(container, bodyarea.firstChild);
    } else {
      // fallback
      document.body.insertBefore(container, document.body.firstChild);
    }

    return container;
  }

  async function renderStats() {
    const { uid, username } = extractUidAndUsername();
    if (!uid || !username) return;

    const box = createBox();
    const content = document.getElementById(`${boxId}-content`);
    content.innerHTML = '📊 Loading monthly data...';

    const { from, to, label, y, m } = getDateRange(currentMonthOffset);
    const boardData = await fetchBoardData(username, from, to);
    const meritReceived = await fetchMerit('received', username, y, m);
    const meritSent = await fetchMerit('sent', username, y, m);

    if (!boardData) {
      content.innerHTML = '❌ Error loading posts.';
      return;
    }

    let html = `🧮 <b>Statistics for ${label} – ${username}</b><br><br>`;
    html += `📝 <b>Posts written:</b> ${boardData.total_results_with_board}<br>`;
    boardData.boards.forEach(b => {
      html += `• ${b.name}: ${b.count}<br>`;
    });

    if (!meritReceived) {
      html += `<br>⭐ <b>Merits received:</b> Loading error.`;
    } else {
      html += `<br>⭐ <b>Merits received:</b> ${meritReceived.total}<br>`;
      Object.entries(meritReceived.data).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
        html += `• ${name}: ${count}<br>`;
      });
    }

    if (!meritSent) {
      html += `<br>🎁 <b>Merits sent:</b> Loading error.`;
    } else {
      html += `<br>🎁 <b>Merits sent:</b> ${meritSent.total}<br>`;
      Object.entries(meritSent.data).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
        html += `• ${name}: ${count}<br>`;
      });
    }

    content.innerHTML = html;
  }

  if (location.href.includes('action=profile')) {
    renderStats();
  }
})();