// ==UserScript==
// @name         PowerPyx Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Checklist with UI panel for trophy guides and persistent strikethrough for collectibles, locations, walkthroughs
// @match        https://www.powerpyx.com/*
// @icon         https://www.powerpyx.com/wp-content/uploads/cropped-favicon-2-32x32.jpg
// @grant        GM_addStyle
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/536064/PowerPyx%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/536064/PowerPyx%20Enhanced.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const url = location.href, path = location.pathname;
  const isRoadmap = url.includes('trophy-guide-roadmap');
  const isChecklist = /collectible|location|walkthrough/.test(url);

  GM_addStyle(`
    .trophy-checkbox { margin-right:10px; transform:scale(1.3); vertical-align:middle; }
    .strikethrough { text-decoration:line-through; color:rgba(0,0,0,0.4); }
    .trophy-details-hidden { display:none!important; }
    tr.click-target:hover { background-color:rgba(255,255,0,0.2); }
    .hidden-checkbox { display:none; }
    #ppPanel,#completedCounter {
      position:fixed; bottom:20px; right:20px;
      background:rgba(0,0,0,0.7); color:#fff;
      padding:10px; border-radius:8px;
      font-size:14px; z-index:9999;
      display:flex; flex-direction:column;
      width:160px; gap:5px;
    }
    .option-btn {
      padding:6px 10px; font-size:13px; border:none;
      border-radius:5px; color:#fff; cursor:pointer;
    }
    #resetBtn{background:#dc3545}#resetBtn:hover{background:#c82333}
    #checkAllBtn{background:#28a745}#checkAllBtn:hover{background:#218838}
    #scrollToTopBtn{background:#007bff}#scrollToTopBtn:hover{background:#0056b3}
    #moveRowsToggle{margin-right:6px}
  `);

  const weights = { bronze: 15, silver: 30, gold: 90, platinum: 0 };
  const selectors = 'li,p,h2,h3,h4,tr';

  if (isRoadmap) {
    const tbody = document.querySelector('table.zebra tbody');
    if (!tbody) return;

    const panel = document.createElement('div');
    panel.id = 'completedCounter';
    panel.innerHTML = `
      <div id="completedText"><strong>0/0 (0%)</strong></div>
      <button class="option-btn" id="resetBtn">Reset</button>
      <button class="option-btn" id="checkAllBtn">Check All</button>
      <button class="option-btn" id="scrollToTopBtn">To Roadmap</button>
      <label><input type="checkbox" id="moveRowsToggle"> Move Completed</label>
    `;
    document.body.appendChild(panel);

    const rows = [...tbody.querySelectorAll('tr')];
    const moveToggle = panel.querySelector('#moveRowsToggle');
    const resetBtn = panel.querySelector('#resetBtn');
    const checkAllBtn = panel.querySelector('#checkAllBtn');
    const scrollTopBtn = panel.querySelector('#scrollToTopBtn');
    const completedText = panel.querySelector('#completedText');

    moveToggle.checked = localStorage.getItem('moveRowsToggle') === 'true';

    const getType = src => src.includes('bronze') ? 'bronze' : src.includes('silver') ? 'silver' : src.includes('gold') ? 'gold' : src.includes('platinum') ? 'platinum' : null;

    let platinum = null;
    const trophies = [];

    rows.forEach((row, i) => {
      const nextRow = rows[i+1]?.cells.length === 1 ? rows[i+1] : null;
      const img = row.querySelector('td:nth-child(3) img');
      const type = img ? getType(img.src) : null;
      if (!type) return;

      const titleCell = row.children[1];
      const title = titleCell.innerText.split('\n')[0].trim();
      const key = `ppyx_${title}`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'trophy-checkbox';
      cb.dataset.type = type;
      cb.dataset.key = key;
      cb.checked = localStorage.getItem(key) === 'true';
      cb._timer = null;

      if (type === 'platinum') {
        cb.classList.add('hidden-checkbox');
        platinum = { cb, row, nextRow, key, i };
      } else {
        titleCell.prepend(cb);
      }

      row.dataset.origIndex = i;
      if (nextRow) nextRow.dataset.origIndex = i+1;

      row.classList.add('click-target');
      row.onclick = e => {
        if (e.target.tagName === 'INPUT') return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      };

      cb.onchange = () => {
        localStorage.setItem(key, cb.checked);
        titleCell.classList.toggle('strikethrough', cb.checked);
        if(nextRow) nextRow.classList.toggle('trophy-details-hidden', cb.checked);
        updateStats();
        if(type !== 'platinum' && moveToggle.checked) handleMove(cb, row, nextRow);
      };

      // Apply style initially
      titleCell.classList.toggle('strikethrough', cb.checked);
      if(nextRow) nextRow.classList.toggle('trophy-details-hidden', cb.checked);

      trophies.push({ cb, row, nextRow, type, key, i });
    });

    function handleMove(cb, row, nextRow) {
      if(cb._timer) clearTimeout(cb._timer);
      if(cb.checked) cb._timer = setTimeout(() => {
        if(cb.checked) moveToBottom(row, nextRow);
      }, 3000);
      else restoreOrder(row, nextRow);
    }

    function moveToBottom(row, nextRow) {
      tbody.appendChild(row);
      if(nextRow) tbody.appendChild(nextRow);
    }

    function restoreOrder(row, nextRow) {
      const all = [...tbody.children];
      const idx = +row.dataset.origIndex;
      const ref = all.find(r => +r.dataset.origIndex > idx) || null;
      tbody.insertBefore(row, ref);
      if(nextRow){
        const ref2 = all.find(r => +r.dataset.origIndex > +nextRow.dataset.origIndex) || null;
        tbody.insertBefore(nextRow, ref2);
      }
    }

    function restoreAll() {
      trophies.filter(t => t.type !== 'platinum').sort((a,b) => a.i - b.i).forEach(({row,nextRow}) => restoreOrder(row,nextRow));
    }

    function updateAllPositions(immediate=false) {
      trophies.filter(t => t.type !== 'platinum' && t.cb.checked).forEach(({cb,row,nextRow}) => {
        if(immediate) moveToBottom(row,nextRow);
        else cb._timer = setTimeout(() => moveToBottom(row,nextRow), 3000);
      });
    }

    function updateStats() {
      const nonPlat = trophies.filter(t => t.type !== 'platinum');
      const total = nonPlat.length + 1;
      const completed = nonPlat.filter(t => t.cb.checked).length;
      const earned = nonPlat.reduce((s,t) => s + (t.cb.checked ? weights[t.type] : 0), 0);
      const totalWeight = nonPlat.reduce((s,t) => s + weights[t.type], 0);
      const pct = totalWeight ? ((earned / totalWeight) * 100).toFixed(1) : '0';

      if(platinum){
        const unlock = completed === nonPlat.length;
        platinum.cb.checked = unlock;
        localStorage.setItem(platinum.key, unlock);
        const c = platinum.row.children[1];
        c.classList.toggle('strikethrough', unlock);
        if(platinum.nextRow) platinum.nextRow.classList.toggle('trophy-details-hidden', unlock);
        if(tbody.firstElementChild !== platinum.row){
          tbody.insertBefore(platinum.row, tbody.firstChild);
          if(platinum.nextRow) tbody.insertBefore(platinum.nextRow, platinum.row.nextSibling);
        }
      }

      const finalCount = completed + (platinum?.cb.checked ? 1 : 0);
      completedText.textContent = `${finalCount}/${total} (${pct}%)`;
    }

    resetBtn.onclick = () => {
      trophies.forEach(t => {
        t.cb.checked = false;
        localStorage.setItem(t.key, false);
        t.cb.dispatchEvent(new Event('change'));
      });
    };

    checkAllBtn.onclick = () => {
      trophies.forEach(t => {
        t.cb.checked = true;
        localStorage.setItem(t.key, true);
        t.cb.dispatchEvent(new Event('change'));
      });
    };

    moveToggle.onchange = () => {
      localStorage.setItem('moveRowsToggle', moveToggle.checked);
      if(moveToggle.checked) updateAllPositions(true);
      else restoreAll();
    };

    scrollTopBtn.onclick = () => {
      const el = [...document.querySelectorAll('h1,h2')].find(e => e.textContent.toLowerCase().includes('trophy guide'));
      if(el) window.scrollTo({top: el.offsetTop-30, behavior:'smooth'});
    };

    window.onload = () => {
      if(moveToggle.checked) updateAllPositions(true);
      updateStats();
    };

  } else if (isChecklist) {
    const toggleKey = 'pp_strikethrough_enabled';
    const isOn = () => localStorage.getItem(toggleKey) !== '0';
    const setOn = v => localStorage.setItem(toggleKey, v ? '1' : '0');

    const panel = document.createElement('div');
    panel.id = 'ppPanel';
    panel.innerHTML = `<label><input type="checkbox" id="ppChecklistMode"> Checklist Mode</label>`;
    document.body.appendChild(panel);

    const cb = panel.querySelector('#ppChecklistMode');
    cb.checked = isOn();
    cb.onchange = () => {
      setOn(cb.checked);
      cb.checked ? restore() : clear();
    };

    function restore() {
      [...document.querySelectorAll(selectors)].forEach((el,i) => {
        if(localStorage.getItem(`${path}::${i}`) === '1') el.classList.add('strikethrough');
      });
    }

    function clear() {
      [...document.querySelectorAll(selectors)].forEach(el => el.classList.remove('strikethrough'));
    }

    document.body.onclick = e => {
      if(!cb.checked || e.target.closest('a')) return;
      if(window.getSelection().toString().trim()) return;
      const el = e.target.closest(selectors);
      if(!el) return;
      const list = [...document.querySelectorAll(selectors)];
      const i = list.indexOf(el);
      const key = `${path}::${i}`;
      const struck = el.classList.toggle('strikethrough');
      struck ? localStorage.setItem(key,'1') : localStorage.removeItem(key);
    };

    if(cb.checked) restore();
  }
})();