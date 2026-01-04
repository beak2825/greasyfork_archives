// ==UserScript==

// @name         Bitcointalk Monthly Stats + Merit Tracker (Mobile fix)

// @namespace    https://bitcointalk.org

// @version      1.4

// @description  Monthly post and merit stats (incl. sent/received) with mobile support via CORS proxy

// @author       *Ace*

// @match        https://bitcointalk.org/index.php?action=profile*

// @grant        none

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/544005/Bitcointalk%20Monthly%20Stats%20%2B%20Merit%20Tracker%20%28Mobile%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544005/Bitcointalk%20Monthly%20Stats%20%2B%20Merit%20Tracker%20%28Mobile%20fix%29.meta.js
// ==/UserScript==

(function () {

  'use strict';

  const uid = 'userid';

  const username = '*username'; // Username esatto

  const boxId = 'monthlyStatsBox';

  const now = new Date();

  let currentMonthOffset = 0;

  function pad(n) {

    return n.toString().padStart(2, '0');

  }

  function addOneDayWithRandomSeconds(dateString) {

    const d = new Date(dateString);

    d.setDate(d.getDate() + 1);

    const hours = '00';

    const minutes = '00';

    const seconds = pad(Math.floor(Math.random() * 59) + 1);

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${hours}:${minutes}:${seconds}`;

  }

  function getDateRange(monthOffset = 0) {

    const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

    const year = date.getFullYear();

    const month = date.getMonth() + 1;

    const firstDay = `${year}-${pad(month)}-01`;

    const lastDay = new Date(year, month, 0).getDate();

    const lastDate = `${year}-${pad(month)}-${lastDay}`;

    const label = `${date.toLocaleString('en', { month: 'long' })} ${year}`;

    return { from: firstDay, to: lastDate, label, y: year, m: month };

  }

  async function fetchBoardData(from, to) {

    const url = `https://api.ninjastic.space/users/${username}/boards?from=${from}T00:00:00&to=${addOneDayWithRandomSeconds(to)}`;

    try {

      const res = await fetch(url);

      const json = await res.json();

      if (json.result !== 'success') return null;

      return json.data;

    } catch {

      return null;

    }

  }

  async function proxyFetchHTML(url) {

    try {

      const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

      const res = await fetch(proxied);

      return await res.text();

    } catch {

      return null;

    }

  }

  async function fetchMeritReceived(y, m) {

    const from = `${y}-${pad(m)}-01`;

    const toDate = new Date(y, m, 0);

    const to = `${y}-${pad(m)}-${pad(toDate.getDate())}`;

    const url = `https://bpip.org/smerit.aspx?&to=${encodeURIComponent(username)}&start=${from}&end=${to}`;

    const htmlText = await proxyFetchHTML(url);

    if (!htmlText) return null;

    const parser = new DOMParser();

    const doc = parser.parseFromString(htmlText, 'text/html');

    const rows = Array.from(doc.querySelectorAll('table tbody tr'));

    if (!rows.length) return null;

    const fromData = {};

    let total = 0;

    rows.forEach(tr => {

      const tds = tr.querySelectorAll('td');

      if (tds.length >= 4) {

        const name = tds[1].innerText.trim().replace(/\s*\(Summary\)$/i, '');

        const count = parseInt(tds[3].innerText.trim()) || 0;

        total += count;

        fromData[name] = (fromData[name] || 0) + count;

      }

    });

    return { total, fromData };

  }

  async function fetchMeritSent(y, m) {

    const from = `${y}-${pad(m)}-01`;

    const to = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`;

    const url = `https://bpip.org/smerit.aspx?&from=${encodeURIComponent(username)}&start=${from}&end=${to}`;

    const htmlText = await proxyFetchHTML(url);

    if (!htmlText) return null;

    const doc = new DOMParser().parseFromString(htmlText, 'text/html');

    const rows = Array.from(doc.querySelectorAll('table tbody tr'));

    if (!rows.length) return null;

    const toData = {};

    let total = 0;

    rows.forEach(tr => {

      const tds = tr.querySelectorAll('td');

      if (tds.length >= 4) {

        const name = tds[2].innerText.trim().replace(/\s*\(Summary\)$/i, '');

        const count = parseInt(tds[3].innerText.trim()) || 0;

        total += count;

        toData[name] = (toData[name] || 0) + count;

      }

    });

    return { total, toData };

  }

  function createBox() {

    let box = document.getElementById(boxId);

    if (box) return box;

    box = document.createElement('div');

    box.id = boxId;

    box.style.position = 'fixed';

    box.style.left = '5px';

    box.style.top = '460px';

    box.style.background = '#222';

    box.style.color = '#fff';

    box.style.padding = '12px';

    box.style.borderRadius = '12px';

    box.style.fontSize = '13px';

    box.style.maxWidth = '340px';

    box.style.zIndex = '9999';

    box.style.boxShadow = '0 0 8px rgba(0,0,0,0.6)';

    box.style.fontFamily = 'Arial, sans-serif';

    const content = document.createElement('div');

    content.id = `${boxId}-content`;

    content.innerHTML = 'Loading...';

    box.appendChild(content);

    const nav = document.createElement('div');

    nav.style.marginTop = '8px';

    nav.style.display = 'flex';

    nav.style.justifyContent = 'space-between';

    const prevBtn = document.createElement('button');

    prevBtn.textContent = '← Previous';

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

    nextBtn.textContent = 'Next →';

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

    box.appendChild(nav);

    document.body.appendChild(box);

    return box;

  }

  async function renderStats() {

    const box = createBox();

    const content = document.getElementById(`${boxId}-content`);

    const { from, to, label, y, m } = getDateRange(currentMonthOffset);

    content.innerHTML = `📊 Loading for ${label}...<br><br>👁️ URLs:<br>` +

      `https://api.ninjastic.space/users/${username}/boards?from=${from}T00:00:00&to=${to}T23:59:59<br>` +

      `https://bpip.org/smerit.aspx?&to=${username}&start=${from}&end=${to}<br>` +

      `https://bpip.org/smerit.aspx?&from=${username}&start=${from}&end=${to}`;

    const boardData = await fetchBoardData(from, to);

    const meritReceived = await fetchMeritReceived(y, m);

    const meritSent = await fetchMeritSent(y, m);

    let html = `🧮 <b>Statistics for ${label}</b><br><br>`;

    if (!boardData) {

      content.innerHTML = '❌ Error loading posts.';

      return;

    }

    html += `📝 <b>Posts written:</b> ${boardData.total_results_with_board}<br>`;

    boardData.boards.forEach(b => {

      html += `• ${b.name}: ${b.count}<br>`;

    });

    if (!meritReceived) {

      html += `<br>⭐ <b>Merits received:</b> error`;

    } else {

      html += `<br>⭐ <b>Merits received:</b> ${meritReceived.total}<br>`;

      const sorted = Object.entries(meritReceived.fromData).sort((a, b) => b[1] - a[1]);

      sorted.forEach(([name, count]) => html += `• ${name}: ${count}<br>`);

    }

    if (!meritSent) {

      html += `<br>🎁 <b>Merits sent:</b> error`;

    } else {

      html += `<br>🎁 <b>Merits sent:</b> ${meritSent.total}<br>`;

      const sorted = Object.entries(meritSent.toData).sort((a, b) => b[1] - a[1]);

      sorted.forEach(([name, count]) => html += `• ${name}: ${count}<br>`);

    }

    content.innerHTML = html;

  }

  if (location.href.includes(`u=${uid}`)) {

    renderStats();

  }

})();