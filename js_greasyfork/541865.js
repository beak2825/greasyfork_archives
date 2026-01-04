// ==UserScript==
// @name         Torn: Find Good Race
// @namespace    torn.com
// @version      0.11.1
// @description  Filters and sorts races based on entry requirements and availability
// @license      MIT
// @author       YoYo
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541865/Torn%3A%20Find%20Good%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/541865/Torn%3A%20Find%20Good%20Race.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = 'find-good-race-btn';
  const SORT_BUTTON_ID = 'race-sort-toggle-btn';
  const SORT_STORAGE_KEY = 'torn-race-sort-mode'; // 'timeAsc' | 'driversDesc'
  const SORT_MODES = ['timeAsc', 'driversDesc'];

  // persistent sort mode
  function getSortMode() {
    const saved = localStorage.getItem(SORT_STORAGE_KEY);
    return SORT_MODES.includes(saved) ? saved : 'timeAsc';
  }
  function setSortMode(mode) {
    localStorage.setItem(SORT_STORAGE_KEY, mode);
  }
  function cycleSortMode() {
    const i = SORT_MODES.indexOf(getSortMode());
    const next = SORT_MODES[(i + 1) % SORT_MODES.length];
    setSortMode(next);
  }
  function modeLabel(mode = getSortMode()) {
    return mode === 'driversDesc' ? 'Sorting: Drivers ↓' : 'Sorting: Start Time ↑';
  }

  let lastSortable = [];   // cache of filtered races for quick re-sorting
  let lastUl = null;       // cache of list element for re-render

  const waitForTargets = setInterval(() => {
    const raceList = document.querySelector('#racingAdditionalContainer > div.custom-events-wrap > div.cont-black.bottom-round > ul');
    const controlDiv = document.querySelector('.cont-black.bottom-round .btn-wrap');
    if (raceList && controlDiv && !document.getElementById(BUTTON_ID)) {
      clearInterval(waitForTargets);
      injectFilterAndSortButtons(controlDiv, raceList);
    }
  }, 300);

  function injectFilterAndSortButtons(targetContainer, raceListUl) {
    // --- Find Good Race button (original) ---
    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.textContent = 'Find Good Race';
    btn.style.cssText = baseBtnCss();

    // --- Sort toggle button ---
    const sortBtn = document.createElement('button');
    sortBtn.id = SORT_BUTTON_ID;
    sortBtn.textContent = 'Sort';
    sortBtn.style.cssText = baseBtnCss() + 'margin-left: 8px;';
    sortBtn.title = modeLabel();

    sortBtn.addEventListener('click', () => {
      cycleSortMode();
      sortBtn.title = modeLabel();
      if (lastSortable.length && lastUl) {
        sortAndRender(lastUl, lastSortable, getSortMode());
      }
    });

    btn.addEventListener('click', () => {
      const ul = raceListUl;
      lastUl = ul;
      const allLis = Array.from(ul.querySelectorAll(':scope > li'));

      const allowedCars = ['any car', 'any class a car'];

      // Build sortable records while filtering/hiding the rest
      const sortableLis = allLis.map(li => {
        // ❌ Password protected
        if (li.querySelector('.event-info .password.protected')) {
          li.style.display = 'none';
          return null;
        }

        // ❌ Car restriction
        const carLi = li.querySelector('.event-info .car');
        const carText = carLi?.textContent?.toLowerCase() || '';
        const isAllowed = allowedCars.some(allowed => carText.includes(allowed));
        if (!isAllowed) {
          li.style.display = 'none';
          return null;
        }

        // ❌ Full or low-capacity; also capture current drivers for sorting
        const driverLi = li.querySelector('.body-container .drivers');
        const match = driverLi?.textContent?.match(/(\d+)\s*\/\s*(\d+)/);
        let current = NaN, max = NaN;
        if (match) {
          current = parseInt(match[1], 10);
          max = parseInt(match[2], 10);
          if (current >= max || max < 50) {
            li.style.display = 'none';
            return null;
          }
        }

        // ✅ Parse time
        const timeEl = li.querySelector('.body-container .startTime');
        if (!timeEl) {
          li.style.display = 'none';
          return null;
        }
        const rawText = (timeEl.textContent || '').trim();

        // show visible; keep metrics for sorting
        li.style.display = '';
        return {
          li,
          drivers: Number.isFinite(current) ? current : -1,
          timeText: rawText,
          seconds: parseTimeToSeconds(rawText)
        };
      }).filter(Boolean);

      lastSortable = sortableLis;

      // Apply current sort mode
      sortAndRender(ul, sortableLis, getSortMode());
      console.log(`✅ Done. ${sortableLis.length} races shown. (${modeLabel()})`);
    });

    // Insert both buttons after the "START A CUSTOM RACE" button row
    targetContainer.parentElement.appendChild(btn);
    targetContainer.parentElement.appendChild(sortBtn);
  }

  function baseBtnCss() {
    return `
      margin-top: 10px;
      height: 32px;
      padding: 0 12px;
      font-size: 14px;
      font-family: "Fjalla One", Arial, serif;
      text-transform: uppercase;
      border-radius: 5px;
      cursor: pointer;
      color: #EEE;
      background: linear-gradient(180deg, #111111 0%, #555555 25%, #333333 60%, #333333 78%, #111111 100%);
      border: 1px solid #111;
    `;
  }

  function sortAndRender(ul, items, mode) {
    if (!ul || !items?.length) return;

    if (mode === 'driversDesc') {
      items.sort((a, b) => {
        // more drivers first; tie-breaker earliest start time
        const d = (b.drivers ?? -1) - (a.drivers ?? -1);
        if (d !== 0) return d;
        return (a.seconds ?? Number.POSITIVE_INFINITY) - (b.seconds ?? Number.POSITIVE_INFINITY);
      });
      console.log('🔃 Sorting good races by number of drivers (desc)...');
    } else {
      // 'timeAsc'
      items.sort((a, b) => {
        // earliest start first; tie-breaker more drivers
        const t = (a.seconds ?? Number.POSITIVE_INFINITY) - (b.seconds ?? Number.POSITIVE_INFINITY);
        if (t !== 0) return t;
        return (b.drivers ?? -1) - (a.drivers ?? -1);
      });
      console.log('🔃 Sorting good races by start time (asc)...');
    }

    // Re-append in sorted order
    const frag = document.createDocumentFragment();
    for (const obj of items) frag.appendChild(obj.li);
    ul.appendChild(frag);
  }

  function parseTimeToSeconds(text) {
    if (!text) return Number.POSITIVE_INFINITY;
    const lower = text.toLowerCase();
    if (lower.includes('waiting')) return 999999;

    // Supports patterns like: "1h 23m", "45m", "2h"
    let total = 0;
    const hrMatch = text.match(/(\d+)\s*h/);
    const minMatch = text.match(/(\d+)\s*m/);
    if (hrMatch) total += parseInt(hrMatch[1], 10) * 3600;
    if (minMatch) total += parseInt(minMatch[1], 10) * 60;
    if (total === 0) return Number.POSITIVE_INFINITY;
    return total;
  }
})();
