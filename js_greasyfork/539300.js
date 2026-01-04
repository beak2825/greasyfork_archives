// ==UserScript==
// @name         Yandex Disk: Sorting + File choose + Autoscroll
// @namespace    nah
// @version      1.35
// @description  Date sorting, size sorting, name sorting, multichooser, chooser from date
// @author       Dicur3x + ChatGPT
// @license      MIT
// @match        https://disk.yandex.ru/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539300/Yandex%20Disk%3A%20Sorting%20%2B%20File%20choose%20%2B%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/539300/Yandex%20Disk%3A%20Sorting%20%2B%20File%20choose%20%2B%20Autoscroll.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let sortKey = localStorage.getItem('yadisk_sort_key') || 'modified';
  let sortOrder = localStorage.getItem('yadisk_sort_order') || 'desc';
  let lastData = [];
  let isCollapsed = true;
  let allResources = [];
  let preventScroll = false;
  let autoScrollActive = false;
  const selectedFileNames = new Set();

  const createStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    html.yadisk-panel-active .resources-action-bar__body {
      margin-left: var(--yadisk-panel-width, 400px);
      transition: margin-left 0.3s ease;
    }

    #yadisk-sort-panel-toggle {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 100000;
      background: #ffd54f;
      border: 1px solid #888;
      border-radius: 4px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 13px;
    }

    #yadisk-sort-panel-toggle.hidden {
      display: none;
    }

    #yadisk-sort-panel {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      background: white;
      border-right: 2px solid #ccc;
      z-index: 99999;
      font-family: sans-serif;
      font-size: 14px;
      padding: 10px;
      resize: horizontal;
      overflow: auto;
      min-width: 280px;
      max-width: 70vw;
      box-sizing: border-box;
      transition: transform 0.3s ease;
    }

    #yadisk-sort-panel.collapsed {
      transform: translateX(-100%);
    }

    .yd-button {
      display: block;
      margin-bottom: 6px;
      padding: 4px 6px;
      background: #e0e0e0;
      border: 1px solid #888;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s ease;
    }

    .yd-button:hover {
      background: #d0d0d0;
    }

    .yd-selectable:hover {
      background: #e0f7fa;
      cursor: pointer;
    }

    .yd-selectable.selected {
      background: #a7ffeb;
    }
  `;
  document.head.appendChild(style);
};


  const simulateFileClick = (fileName, multi = true) => {
    const real = Array.from(document.querySelectorAll('[aria-label]'))
      .find(n => n.getAttribute('aria-label') === fileName);
    if (real) {
      real.scrollIntoView({ block: 'center' });
      real.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        ctrlKey: multi,
        metaKey: multi
      }));
    }
  };

  const extractFiles = () => {
    const items = document.querySelectorAll('.listing-item');
    const files = [];
    items.forEach(item => {
      if (item.querySelector('.listing-item__icon_resource_dir')) return;
      const name = item.querySelector('[aria-label]')?.getAttribute('aria-label');
      const date = item.querySelector('.listing-item__column_date')?.textContent?.trim();
      const time = item.querySelector('.listing-item__column_time')?.textContent?.trim();
      const sizeText = item.querySelector('.listing-item__column_size')?.textContent?.trim();
      let size = parseFloat(sizeText?.replace(',', '.')) || 0;
      if (sizeText?.includes('ГБ')) size *= 1024;
      if (sizeText?.includes('КБ')) size /= 1024;
      if (!name || !date || !time || !date.includes('.') || !time.includes(':')) return;
      const [d, m, y] = date.split('.');
      const [hh, mm] = time.split(':');
      const dateStr = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`;
      const modified = new Date(dateStr).getTime() / 1000;
      if (!isNaN(modified)) {
        files.push({ name, modified, size, sizeText });
      }
    });
    allResources = files;
    lastData = [...files].sort((a, b) => {
      let valA = sortKey === 'name' ? a[sortKey].toLowerCase() : a[sortKey];
      let valB = sortKey === 'name' ? b[sortKey].toLowerCase() : b[sortKey];
      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  };

  const restoreSelection = () => {
    document.querySelectorAll('[aria-label]').forEach(el => {
      if (el.closest('.listing-item')?.classList.contains('listing-item_selected')) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    const names = Array.from(selectedFileNames);
    names.forEach((file, idx) => {
      setTimeout(() => simulateFileClick(file, idx !== 0), idx * 150);
    });
  };

  const clearSelection = () => {
    selectedFileNames.clear();
    document.querySelectorAll('[aria-label]').forEach(el => {
      if (el.closest('.listing-item')?.classList.contains('listing-item_selected')) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    renderPanel();
  };

  const renderToggle = () => {
    let btn = document.getElementById('yadisk-sort-panel-toggle');
    if (!btn) {
      btn = document.createElement('div');
      btn.id = 'yadisk-sort-panel-toggle';
      btn.textContent = '📂 Сортировка по дате';
      document.body.appendChild(btn);
    }
    btn.classList.remove('hidden');
    btn.onclick = () => {
      isCollapsed = false;
      renderPanel();
      const panel = document.getElementById('yadisk-sort-panel');
      panel.classList.remove('collapsed');
      document.documentElement.classList.add('yadisk-panel-active');
      btn.classList.add('hidden');
    };
  };

  const renderPanel = () => {
    extractFiles();
    let panel = document.getElementById('yadisk-sort-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'yadisk-sort-panel';
      document.body.appendChild(panel);
    }
    panel.className = isCollapsed ? 'collapsed' : '';

    const savedDate = document.getElementById('date-threshold')?.value || '';

    panel.innerHTML = `
      <div style="margin-bottom: 10px;">
        <button id="scroll-trigger" class="yd-button">⏬ Догрузить всё</button>
        <button id="scroll-stop" class="yd-button">⛔ Остановить автоскролл</button>
        <button id="restore-selection" class="yd-button">🔄 Вернуть выделение</button>
        <button id="clear-selection" class="yd-button">❌ Сбросить выделение</button>
        <label>Сортировать по: <select id="sort-by">
          <option value="modified" ${sortKey === 'modified' ? 'selected' : ''}>дате</option>
          <option value="size" ${sortKey === 'size' ? 'selected' : ''}>размеру</option>
          <option value="name" ${sortKey === 'name' ? 'selected' : ''}>имени</option>
        </select></label>
        <button id="order-toggle" class="yd-button">${sortOrder === 'desc' ? '🔽' : '🔼'}</button>
        <input id="date-threshold" type="datetime-local" style="width:100%;margin-top:8px;" value="${savedDate}" />
        <button id="select-from-date" class="yd-button">✅ Выделить с даты</button>
        <div id="collapse-arrow" style="cursor:pointer; text-align:right;">⬅️</div>
      </div>
      ${lastData.map(f => `
        <div class="yd-selectable${selectedFileNames.has(f.name) ? ' selected' : ''}" data-name="${f.name}" data-modified="${f.modified}" style="margin-bottom: 6px;">
          <strong>${f.name}</strong><br>
          <small>${new Date(f.modified * 1000).toLocaleString()} — ${f.sizeText}</small>
        </div>
      `).join('')}
    `;

    panel.querySelectorAll('.yd-selectable').forEach(el => {
      el.onclick = e => {
        const name = el.dataset.name;
        const wasSelected = selectedFileNames.has(name);
        if (wasSelected) {
          selectedFileNames.delete(name);
          el.classList.remove('selected');
        } else {
          selectedFileNames.add(name);
          el.classList.add('selected');
        }
        restoreSelection();
      };
    });

    document.getElementById('collapse-arrow').onclick = () => {
      isCollapsed = true;
      panel.classList.add('collapsed');
      document.documentElement.classList.remove('yadisk-panel-active');
      document.getElementById('yadisk-sort-panel-toggle')?.classList.remove('hidden');
    };

    document.getElementById('scroll-trigger').onclick = () => {
      autoScrollActive = true;
      preventScroll = false;
      const scroll = () => {
        if (!autoScrollActive || preventScroll) return;
        window.scrollBy(0, 9999);
        setTimeout(() => {
          extractFiles();
          renderPanel();
          scroll();
        }, 1000);
      };
      scroll();
    };

    document.getElementById('scroll-stop').onclick = () => {
      autoScrollActive = false;
    };

    document.getElementById('restore-selection').onclick = restoreSelection;
    document.getElementById('clear-selection').onclick = clearSelection;

    document.getElementById('sort-by').onchange = (e) => {
      sortKey = e.target.value;
      localStorage.setItem('yadisk_sort_key', sortKey);
      renderPanel();
    };

    document.getElementById('order-toggle').onclick = () => {
      sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      localStorage.setItem('yadisk_sort_order', sortOrder);
      renderPanel();
    };

    document.getElementById('select-from-date').onclick = () => {
      let inputEl = document.getElementById('date-threshold');
      let inputRaw = inputEl.value;
      if (!inputRaw || inputRaw.includes('--')) return;
      if (!inputRaw.includes('T')) inputRaw += 'T00:00';
      const dateObj = new Date(inputRaw);
      if (isNaN(dateObj)) return;
      const timestamp = dateObj.getTime() / 1000;
      inputEl.value = inputRaw.substring(0, 16); // сохраняем видимую дату с 00:00 если не было времени
      const eligible = lastData.filter(f => f.modified >= timestamp);
      eligible.forEach((f, i) => {
        selectedFileNames.add(f.name);
        setTimeout(() => simulateFileClick(f.name, i !== 0), i * 150);
      });
      renderPanel();
    };
  };

  const ready = setInterval(() => {
    if (document.body && !document.getElementById('yadisk-sort-panel-toggle')) {
      clearInterval(ready);
      try {
        createStyles();
        renderToggle();
        renderPanel();
      } catch (e) {
        console.error('Yadisk Sort Init Error:', e);
      }
    }
  }, 500);
})();
