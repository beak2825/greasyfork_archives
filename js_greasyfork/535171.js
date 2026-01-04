// ==UserScript==
// @name         Milky Way Idle - Loot Drops Value Add-on
// @namespace    https://milkywayidle.com/
// @version      2.2
// @description  Add-on to KJay's Loot Drop overlay
// @author       notawhale
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535171/Milky%20Way%20Idle%20-%20Loot%20Drops%20Value%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/535171/Milky%20Way%20Idle%20-%20Loot%20Drops%20Value%20Add-on.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CUSTOM_SORT_KEY = 'lootDropsCustomSortPref';
  const SORT_MODES = ['name', 'value', 'quantity'];
  const SORT_LABELS = { name: 'Name', value: 'Value', quantity: 'Quantity' };
  const fixedValueChests = new Set([
    'small treasure chest', 'medium treasure chest', 'large treasure chest',
    'chimerical chest', 'sinister chest', 'enchanted chest', 'pirate chest'
  ]);

  let marketData = {};
  let dollarThreshold = null;
  let dollarTagEnabled = false;
  const viewModeState = {}; // Tracks view mode per player

  function formatCoins(value) {
    return `${Math.round(value).toLocaleString()} coin`;
  }

  function capitalizeEachWord(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  async function loadMarketData() {
    try {
      const res = await fetch('https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json');
      const json = await res.json();
      marketData = json.market || {};
      console.log('[ValueAdd] Market data loaded.');
    } catch (e) {
      console.error('[ValueAdd] Failed to load market data:', e);
    }
  }

  function getUnitValue(name) {
    const normalized = name.trim().toLowerCase();
    if (fixedValueChests.has(normalized) || normalized === 'coin') return 1;
    const entry = marketData[capitalizeEachWord(name)];
    return entry?.ask || 0;
  }

  function injectValuesAndSort() {
    const sortPref = localStorage.getItem(CUSTOM_SORT_KEY) || 'name';
    const playerSections = document.querySelectorAll('.ldt-player-stats-section');

    playerSections.forEach((section) => {
      const header = section.querySelector('.ldt-player-name-header');
      const playerName = header?.textContent?.split('(')[0]?.trim() || 'Unknown';

      // Clean up
      header.querySelectorAll('span[data-value-injected]').forEach(el => el.remove());

      const rows = Array.from(section.querySelectorAll('.ldt-loot-item-entry'));
      let total = 0;

      const itemData = rows.map((row) => {
        const nameEl = row.querySelector('.ldt-item-name');
        const countEl = row.querySelector('.ldt-item-count');
        const name = nameEl?.textContent.trim() || '';
        const count = parseInt(countEl?.textContent.replace(/\D/g, '') || '0', 10);
        const unitValue = getUnitValue(name);
        const itemValue = unitValue * count;
        total += itemValue;

        row.style.border = '';
        if (dollarTagEnabled && dollarThreshold && unitValue >= dollarThreshold) {
          row.style.border = '3px solid rgba(0, 255, 0, 0.5)';
        }

        return { row, name, count, value: itemValue, nameEl, countEl };
      });

      if (total > 0) {
        const span = document.createElement('span');
        span.style.color = 'gold';
        span.style.fontSize = '0.9em';
        span.style.fontWeight = 'normal';
        span.dataset.valueInjected = 'true';
        span.style.cursor = 'pointer';

        const container = document.getElementById('milt-loot-drops-display');
        const timerEl = container?.querySelector('.ldt-timer');
        const timeMatch = timerEl?.textContent?.match(/(\d+):(\d+):(\d+)/);
        let displayText = ` (${formatCoins(total)})`;

        if (!viewModeState[playerName]) {
          viewModeState[playerName] = 'total';
        }

        if (viewModeState[playerName] === 'hour' && timeMatch) {
          const [_, hh, mm, ss] = timeMatch.map(Number);
          const hoursElapsed = hh + mm / 60 + ss / 3600;
          if (hoursElapsed >= 0.01) {
            const avg = total / hoursElapsed;
            displayText = ` (${formatCoins(avg)}/hr)`;
            span.style.color = 'lightgreen';
          }
        }

        span.textContent = displayText;
        span.onclick = () => {
          viewModeState[playerName] = (viewModeState[playerName] === 'total') ? 'hour' : 'total';
        };

        header.appendChild(span);
      }

      // Sorting
      itemData.sort((a, b) => {
        if (sortPref === 'value') return b.value - a.value || b.count - a.count || a.name.localeCompare(b.name);
        if (sortPref === 'quantity') return b.count - a.count || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });

      const list = section.querySelector('.ldt-loot-list');
      if (!list) return;
      list.innerHTML = '';
      itemData.forEach(({ row }) => list.appendChild(row));
    });
  }

  function overrideSortButton() {
    const btn = document.querySelector('#milt-loot-drops-display-sortbtn');
    if (!btn || btn.dataset.customOverrideInjected) return;

    btn.dataset.customOverrideInjected = 'true';

    const updateLabel = () => {
      const current = localStorage.getItem(CUSTOM_SORT_KEY) || 'name';
      btn.textContent = `Sort: ${SORT_LABELS[current]}`;
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = localStorage.getItem(CUSTOM_SORT_KEY) || 'name';
      const next = SORT_MODES[(SORT_MODES.indexOf(current) + 1) % SORT_MODES.length];
      localStorage.setItem(CUSTOM_SORT_KEY, next);
      updateLabel();
      injectValuesAndSort();
    });

    updateLabel();
  }

  function setupControls() {
    if (document.getElementById('value-threshold-input')) return;

    const sortBtn = document.querySelector('#milt-loot-drops-display-sortbtn');
    if (!sortBtn) return;

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'value-threshold-input';
    input.placeholder = 'Value ≥';
    input.style.marginLeft = '8px';
    input.style.width = '80px';
    input.style.fontSize = '12px';

    const toggle = document.createElement('button');
    toggle.textContent = '💲 Off';
    toggle.style.marginLeft = '6px';
    toggle.style.fontSize = '12px';
    toggle.style.padding = '2px 6px';
    toggle.style.cursor = 'pointer';

    toggle.onclick = () => {
      dollarTagEnabled = !dollarTagEnabled;
      toggle.textContent = dollarTagEnabled ? '💲 On' : '💲 Off';
    };

    input.onchange = () => {
      const val = parseInt(input.value, 10);
      dollarThreshold = isNaN(val) ? null : val;
    };

    sortBtn.parentElement.appendChild(input);
    sortBtn.parentElement.appendChild(toggle);
  }

  async function main() {
    await loadMarketData();

    setInterval(() => {
      const overlay = document.getElementById('milt-loot-drops-display');
      if (!overlay || overlay.classList.contains('is-hidden')) return;
      overrideSortButton();
      setupControls();
      injectValuesAndSort();
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
