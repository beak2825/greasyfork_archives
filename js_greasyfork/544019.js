// ==UserScript==
// @name         Telegram Web Sort Panel + Chart + Lang (FIXED)
// @namespace    https://example.com
// @version      3.3.1
// @description  Fixed panel rendering & interaction for Telegram Web
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/k/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544019/Telegram%20Web%20Sort%20Panel%20%2B%20Chart%20%2B%20Lang%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544019/Telegram%20Web%20Sort%20Panel%20%2B%20Chart%20%2B%20Lang%20%28FIXED%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== wait for Telegram UI ===== */
  function waitForUI(cb) {
    const i = setInterval(() => {
      if (document.querySelector('#column-center, .chat')) {
        clearInterval(i);
        cb();
      }
    }, 500);
  }

  waitForUI(init);

  function init() {

    /* ===== load Chart.js safely ===== */
    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      s.onload = createPanel;
      document.head.appendChild(s);
    } else {
      createPanel();
    }

    function createPanel() {

      GM_addStyle(`
        #ua-panel {
          position: fixed;
          top: 120px;
          right: 20px;
          width: 300px;
          background: var(--tg-theme-bg-color, #fff);
          color: var(--tg-theme-text-color, #000);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,.4);
          padding: 8px;
          z-index: 2147483647; /* FIX */
          font-family: Arial,sans-serif;
        }
        #ua-panel-header {
          display:flex;
          justify-content:space-between;
          cursor:move;
          font-weight:bold;
        }
        #ua-buttons button, #ua-lang select {
          margin:2px;
          padding:4px 6px;
          border:none;
          border-radius:4px;
          background:#0d6efd;
          color:#fff;
          font-size:12px;
          cursor:pointer;
        }
        #ua-chart {height:200px;}
      `);

      if (document.getElementById('ua-panel')) return;

      const panel = document.createElement('div');
      panel.id = 'ua-panel';
      panel.innerHTML = `
        <div id="ua-panel-header">
          <span>🇺🇦 Telegram Panel</span>
          <span id="ua-hide">✖</span>
        </div>
        <div id="ua-buttons">
          <button data-sort="reactions">Reactions</button>
          <button data-sort="date_desc">Date ↓</button>
          <button data-sort="date_asc">Date ↑</button>
          <button data-sort="media">Media</button>
          <button data-sort="length">Length</button>
          <button data-action="refresh">Refresh</button>
        </div>
        <canvas id="ua-chart"></canvas>
      `;
      document.body.appendChild(panel);

      panel.querySelector('#ua-hide').onclick = () => panel.remove();

      /* ===== chart ===== */
      const ctx = panel.querySelector('#ua-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{ data: [], backgroundColor: [] }]
        },
        options: { responsive: true }
      });

      /* ===== message collector (FIXED) ===== */
      function collect() {
        return [...document.querySelectorAll(
          '.message, .Message, [data-message-id]'
        )].map(m => ({
          text: m.innerText || '',
          reactions: m.querySelectorAll('[class*="reaction"]').length,
          media: m.querySelectorAll('img,video').length
        }));
      }

      function update(type) {
        let data = collect().map(m => ({
          value:
            type === 'reactions' ? m.reactions :
            type === 'media' ? m.media :
            m.text.length
        })).sort((a,b)=>b.value-a.value);

        chart.data.labels = data.slice(0,10).map((_,i)=>i+1);
        chart.data.datasets[0].data = data.slice(0,10).map(d=>d.value);
        chart.data.datasets[0].backgroundColor =
          data.slice(0,10).map(()=>`hsl(${Math.random()*360},70%,50%)`);
        chart.update();
      }

      panel.querySelectorAll('button').forEach(b=>{
        b.onclick=()=>update(b.dataset.sort||'reactions');
      });

      setTimeout(()=>update('reactions'),2000);
    }
  }
})();
