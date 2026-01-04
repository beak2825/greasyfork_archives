// ==UserScript==
// @name         CR OC Helper
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  OC helper (priorities slider + bonuses + min CPR chips + below-min outlines + warning symbol color + join confirm + Google Sheet-backed config). Compact layout: chips under crime bonus, 3 lines max visual footprint.
// @author       Whiskey_Jack
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-idle
// @license      CC BY-NC-ND 4.0
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlHttpRequest
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      *.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/547002/CR%20OC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547002/CR%20OC%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DBG = (...a) => console.log('[CR OC Helper]', ...a);

  // ================================
  // Slider (filters only)
  // ================================
  const STORAGE_KEY = 'ocHighlighterEnabled';
  let enabled = (localStorage.getItem(STORAGE_KEY) ?? 'true') === 'true';

  function createToggleUI() {
    if (document.getElementById('oc-highlighter-toggle')) return;
    const header = document.querySelector('.content-title h4.left');
    if (!header) return;

    const wrap = document.createElement('span');
    wrap.id = 'oc-highlighter-toggle';
    wrap.style.display = 'inline-flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '6px';
    wrap.style.marginLeft = '12px';
    wrap.style.font = '13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    wrap.style.userSelect = 'none';

    const label = document.createElement('span');
    label.textContent = 'Only show Priority OCs';
    label.style.fontWeight = '600';
    label.style.color = 'var(--default-text, #ddd)';

    const sliderWrap = document.createElement('label');
    sliderWrap.style.position = 'relative';
    sliderWrap.style.display = 'inline-block';
    sliderWrap.style.width = '38px';
    sliderWrap.style.height = '20px';
    sliderWrap.style.cursor = 'pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = enabled;
    input.style.opacity = '0';
    input.style.width = '0';
    input.style.height = '0';

    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.top = '0';
    span.style.left = '0';
    span.style.right = '0';
    span.style.bottom = '0';
    span.style.background = enabled ? '#28a745' : '#888';
    span.style.transition = 'background 120ms ease';
    span.style.borderRadius = '999px';

    const knob = document.createElement('span');
    knob.style.position = 'absolute';
    knob.style.height = '14px';
    knob.style.width = '14px';
    knob.style.left = enabled ? '20px' : '4px';
    knob.style.top = '3px';
    knob.style.background = '#fff';
    knob.style.borderRadius = '50%';
    knob.style.transition = 'left 120ms ease';
    knob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.35)';

    span.appendChild(knob);
    sliderWrap.appendChild(input);
    sliderWrap.appendChild(span);

    input.addEventListener('change', () => {
      enabled = input.checked;
      localStorage.setItem(STORAGE_KEY, String(enabled));
      span.style.background = enabled ? '#28a745' : '#888';
      knob.style.left = enabled ? '20px' : '4px';
      if (!enabled) {
        resetAllOCs();
        labelOCStatusBadges();
      } else {
        highlightOCs();
      }
    });

    wrap.appendChild(label);
    wrap.appendChild(sliderWrap);
    header.appendChild(wrap);
  }

  function resetAllOCs() {
    const ocRows = document.querySelectorAll('div[data-oc-id], div[class^="wrapper__"][data-oc-id]');
    ocRows.forEach(row => {
      row.style.display = '';
      row.style.border = '';
      const oldLabel = row.querySelector('.oc-label');
      if (oldLabel) oldLabel.remove();
    });
  }

  // ================================
  // Data (sheet-driven)
  // ================================
  const CRIME_BONUS = {};
  const ROLE_BONUS  = {};
  const ROLE_MIN_CPR = {};

  // ================================
  // Helpers
  // ================================
  function addLabel(row, text, color) {
    const panelBody = row.querySelector('.panelBody___lWhwy,[class^="panelBody___"]');
    if (!panelBody) return;
    const oldLabel = panelBody.querySelector('.oc-label');
    if (oldLabel) oldLabel.remove();
    const linkIcon = panelBody.querySelector('.chainLink___pHkg9,[class^="chainLink___"]');
    const label = document.createElement('span');
    label.className = 'oc-label';
    label.textContent = text;
    label.style.marginLeft = '8px';
    label.style.fontWeight = 'bold';
    label.style.color = color;
    label.style.fontSize = '1em';
    label.style.background = '#222a';
    label.style.padding = '2px 8px';
    label.style.borderRadius = '6px';
    label.style.verticalAlign = 'middle';
    if (linkIcon && linkIcon.nextSibling) panelBody.insertBefore(label, linkIcon.nextSibling);
    else panelBody.appendChild(label);
  }

  // ===================================================
  // Linked crime helpers
  // ===================================================
  function getLinkedCrimeIdFromHash() {
    const hash = window.location.hash || '';
    const m = hash.match(/(?:^|[?&#])crimeId=(\d+)/i);
    return m ? m[1] : null;
  }
  function findLinkedRow() {
    const el = document.querySelector('div[data-oc-id].linked___D_B2i') ||
               document.querySelector('div[class^="wrapper__"][data-oc-id].linked___D_B2i');
    if (el) return el;
    const id = getLinkedCrimeIdFromHash();
    if (!id) return null;
    return document.querySelector(`div[data-oc-id="${id}"], div[class^="wrapper__"][data-oc-id="${id}"]`);
  }
  function applyLinkedSingleViewIfNeeded(rows) {
    if (!enabled) return false;
    const linkedRow = findLinkedRow();
    if (!linkedRow) return false;
    rows.forEach(row => { row.style.display = (row === linkedRow ? '' : 'none'); });
    return true;
  }

  // ================================
  // Sheet loader (UPDATED TIMEOUTS)
  // ================================
  const OC_REMOTE = {
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRY2rl3-AIgIRyPh5x7eozaywQqkh_ej8GRcSDSB1aZpR0yr_YHcbbH2E3gkSx8cOq_VnTyeDA7CIIe/pub?output=csv',
    cacheMs: 6 * 60 * 60 * 1000,
    storageKey: 'ocConfigSingleSheetV1',
    // more forgiving timeouts; Google can be slow
    requestTimeoutMsFresh: 8000,
    requestTimeoutMsBg: 8000,
    maxRetriesBg: 3,
  };

  function parseCSV(text) {
    const out = [];
    let i = 0, field = '', row = [], q = false;
    while (i < text.length) {
      const c = text[i], n = text[i+1];
      if (q) {
        if (c === '"' && n === '"') { field += '"'; i += 2; continue; }
        if (c === '"') { q = false; i++; continue; }
        field += c; i++; continue;
      }
      if (c === '"') { q = true; i++; continue; }
      if (c === ',') { row.push(field.trim()); field = ''; i++; continue; }
      if (c === '\n' || c === '\r') {
        if (field.length || row.length) { row.push(field.trim()); out.push(row); row = []; field = ''; }
        i++; continue;
      }
      field += c; i++;
    }
    if (field.length || row.length) { row.push(field.trim()); out.push(row); }
    return out;
  }

  function gmFetch(url, timeoutMs) {
    return new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => { if (!done) { done = true; reject(new Error('timeout')); } }, timeoutMs);
      const finalUrl = url + (url.includes('?') ? '&' : '?') + 'cbuster=' + Date.now();

      if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
        GM.xmlHttpRequest({
          method: 'GET',
          url: finalUrl,
          onload: r => { if (done) return; done = true; clearTimeout(timer);
            (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(new Error('status ' + r.status));
          },
          onerror: err => { if (done) return; done = true; clearTimeout(timer); reject(err); }
        });
      } else if (typeof GM_xmlHttpRequest === 'function') {
        GM_xmlHttpRequest({
          method: 'GET',
          url: finalUrl,
          onload: r => { if (done) return; done = true; clearTimeout(timer);
            (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(new Error('status ' + r.status));
          },
          onerror: err => { if (done) return; done = true; clearTimeout(timer); reject(err); }
        });
      } else {
        fetch(finalUrl, { cache: 'no-store' })
          .then(r => { if (!r.ok) throw new Error('status ' + r.status); return r.text(); })
          .then(t => { if (done) return; done = true; clearTimeout(timer); resolve(t); })
          .catch(e => { if (done) return; done = true; clearTimeout(timer); reject(e); });
      }
    });
  }

  function buildMapsFromCSV(rows) {
    if (!rows || !rows.length) {
      DBG('CSV parse: no rows');
      return { crimeBonus: {}, roleBonus: {}, roleMin: {}, version: null };
    }

    const header = rows.shift().map(h => h.trim().toLowerCase());
    const idx = {
      crime: header.indexOf('crime'),
      cbon:  header.indexOf('crimebonus'),
      role:  header.indexOf('role'),
      rbon:  header.indexOf('rolebonus'),
      min:   header.indexOf('mincpr'),
      ver:   header.indexOf('dataversion'),
    };

    const crimeBonus = {};
    const roleBonus  = {};
    const roleMin    = {};
    let version = null;

    for (const r of rows) {
      const crime = r[idx.crime]?.trim();
      if (!crime) continue;
      const role  = r[idx.role]?.trim();
      const cbon  = r[idx.cbon]?.trim();
      const rbon  = r[idx.rbon]?.trim();
      const min   = r[idx.min]?.trim();
      const ver   = idx.ver >= 0 ? (r[idx.ver]?.trim() || null) : null;

      if (cbon) crimeBonus[crime] = cbon;
      if (ver) version = ver;

      if (role) {
        (roleBonus[crime] ||= {})[role] = rbon ?? '';
        if (min !== undefined && min !== '' && !isNaN(+min)) {
          (roleMin[crime] ||= {})[role] = +min;
        }
      }
    }

    DBG('Parsed CSV rows:', rows.length, 'version:', version);
    return { crimeBonus, roleBonus, roleMin, version };
  }

  function mergeIntoLocals(maps) {
    for (const k of Object.keys(CRIME_BONUS)) delete CRIME_BONUS[k];
    for (const k of Object.keys(ROLE_BONUS)) delete ROLE_BONUS[k];
    for (const k of Object.keys(ROLE_MIN_CPR)) delete ROLE_MIN_CPR[k];

    Object.assign(CRIME_BONUS, maps.crimeBonus || {});
    Object.entries(maps.roleBonus || {}).forEach(([crime, roles]) => {
      ROLE_BONUS[crime] = { ...(ROLE_BONUS[crime] || {}), ...roles };
    });
    Object.entries(maps.roleMin || {}).forEach(([crime, roles]) => {
      ROLE_MIN_CPR[crime] = { ...(ROLE_MIN_CPR[crime] || {}), ...roles };
    });
  }

  function readCache() { try { return JSON.parse(localStorage.getItem(OC_REMOTE.storageKey) || 'null'); } catch { return null; } }
  function writeCache(payload) { try { localStorage.setItem(OC_REMOTE.storageKey, JSON.stringify(payload)); } catch {} }

  async function loadOCConfigPreferFresh() {
    try {
      const csv = await gmFetch(OC_REMOTE.csvUrl, OC_REMOTE.requestTimeoutMsFresh);
      const rows = parseCSV(csv);
      const maps = buildMapsFromCSV(rows);
      mergeIntoLocals(maps);
      writeCache({ ts: Date.now(), ...maps });
      DBG('Loaded sheet:', maps.version || '(no version)', maps);
      return 'fresh';
    } catch (e) {
      DBG('Sheet fresh fetch failed, using cache if available', e.toString());
      const cached = readCache();
      if (cached && cached.ts && (Date.now() - cached.ts < OC_REMOTE.cacheMs)) {
        mergeIntoLocals(cached);
        DBG('Loaded cached sheet:', cached.version || '(no version)');
      } else {
        DBG('No valid cache found, running with empty config');
      }
      backgroundRevalidate();
      return 'cached-or-default';
    }
  }

  function backgroundRevalidate(attempt = 0) {
    gmFetch(OC_REMOTE.csvUrl, OC_REMOTE.requestTimeoutMsBg)
      .then(csv => {
        const rows = parseCSV(csv);
        const maps = buildMapsFromCSV(rows);
        mergeIntoLocals(maps);
        writeCache({ ts: Date.now(), ...maps });
        DBG('Background refresh updated:', maps.version || '(no version)');

        replaceDescriptionsWithBonuses?.();
        addMinCPRToRoles?.();
        applyCPROutlines?.();
        setTimeout(applyWarningSymbols, 550);
      })
      .catch((err) => {
        DBG('Background refresh failed (attempt', attempt, '):', String(err));
        if (attempt < OC_REMOTE.maxRetriesBg) {
          setTimeout(() => backgroundRevalidate(attempt + 1), 900 * (attempt + 1));
        }
      });
  }

  // ================================
  // PRIORITY helpers
  // ================================
  function getHoursRemaining(row) {
    const planningClocks = row.querySelectorAll('div.planning___CjB09,[class^="planning___"]');
    if (!planningClocks.length) return null;

    // right-most clock is the one for the *current* lane
    const rightMostClock = planningClocks[planningClocks.length - 1];
    const bg = (rightMostClock && rightMostClock.style.background) ? rightMostClock.style.background : '';
    const compact = bg.replace(/\s/g, '');
    const isZero =
      compact === 'conic-gradient(var(--oc-clock-planning-bg)0deg,var(--oc-clock-bg)0deg)' ||
      bg === 'conic-gradient(var(--oc-clock-planning-bg) 0deg, var(--oc-clock-bg) 0deg)';
    if (isZero) return null;

    const m = bg.match(/([0-9.]+)deg/);
    if (!m) return null;
    const deg = parseFloat(m[1]);
    const progress = Math.min(Math.max(deg, 0), 360) / 360;
    const hoursPassed = 24 * progress;
    return Math.max(0, 24 - hoursPassed);
  }

  function deepenClockTint(row, hrsRemaining) {
    const planningClocks = row.querySelectorAll('div.planning___CjB09,[class^="planning___"]');
    if (!planningClocks.length) return;
    const rightMostClock = planningClocks[planningClocks.length - 1];

    let urgency;
    if (hrsRemaining <= 12) urgency = (12 - hrsRemaining) / 12;
    else if (hrsRemaining <= 24) urgency = 0.4 * ((24 - hrsRemaining) / 12);
    else urgency = 0;

    const sat = 1 + urgency * 1.2;
    const bright = 1 - urgency * 0.18;
    const contr = 1 + urgency * 0.25;

    rightMostClock.style.setProperty('filter', `saturate(${sat}) brightness(${bright}) contrast(${contr})`, 'important');
  }

  // ===================================================
  // Missing-item + planning helpers
  // ===================================================
  function getSlotElems(ocRow) {
    return Array.from(ocRow.querySelectorAll('button.slotHeader___K2BS_, button[class^="slotHeader___"]'));
  }
  function getClockDeg(el) {
    const clock = el.querySelector('div.planning___CjB09,[class^="planning___"]');
    if (!clock) return null;
    const bg = clock.style.background || '';
    const m = bg.match(/([0-9.]+)deg/);
    if (!m) return null;
    return parseFloat(m[1]); // 0..360
  }
  function findActiveSlotIndex(ocRow) {
    const slots = getSlotElems(ocRow);
    for (let i = 0; i < slots.length; i++) {
      const deg = getClockDeg(slots[i]);
      if (deg != null && deg > 0 && deg < 360) return i; // active progress
    }
    return -1;
  }
  function findMissingItemSlotIndex(ocRow) {
    const slots = getSlotElems(ocRow);
    for (let i = 0; i < slots.length; i++) {
      const header = slots[i];
      const wrap = header.closest('div.wrapper___Lpz_D, div[class^="wrapper___"]');
      if (!wrap) continue;

      const hasWaitingClass = /\bwaitingJoin___/.test(wrap.className);
      const timeBox = wrap.querySelector('.planningTime___AqKIJ,[class^="planningTime___"]');
      const timeText = (timeBox?.textContent || '').trim();
      const timeAria = (timeBox?.getAttribute('aria-label') || '').trim().toLowerCase();
      const shows24hrs = /24\s*hrs/i.test(timeText) || timeAria === '24 hours';
      const laneClock = wrap.querySelector('div.planning___CjB09,[class^="planning___"]');

      if ((hasWaitingClass || shows24hrs) && !laneClock) return i;
    }
    return -1;
  }

  /**
   * NEW (fixed):
   * - If planning is BEFORE the blocked lane → we DO show stall labels using the remaining time on the current lane.
   * - If planning is ON the blocked lane → "Needs item" (timing unknown).
   * - If planning is AFTER the blocked lane → normal labels.
   */
  // Helper: index of the right-most FILLED slot (has a body, no Join button)
  function findRightMostFilledIndex(ocRow) {
    const slots = Array.from(ocRow.querySelectorAll('button.slotHeader___K2BS_, button[class^="slotHeader___"]'));
    let rightMost = -1;
    slots.forEach((header, i) => {
      const wrap = header.closest('div.wrapper___Lpz_D, div[class^="wrapper___"]');
      if (!wrap) return;
      const body    = wrap.querySelector('.slotBody___oxizq, [class^="slotBody___"]');
      const hasJoin = !!wrap.querySelector('button.joinButton___Ikoyy, [class^="joinButton___"]');
      if (body && !hasJoin) rightMost = i;
    });
    return rightMost;
  }

  /**
   * Final policy:
   * 1) If the right-most FILLED slot has the orange "inactive" icon (needs item)
   *    and **no clock** in that lane → show "Needs item" (timing unknown).
   * 2) Else if the planning clock is on a lane that itself is "waiting" (no one joined)
   *    → also "Needs item" (rare but possible due to UI flaps).
   * 3) Otherwise: compute stall labels normally from the right-most clock.
   *
   * We never suppress labels merely because a later lane is waiting; the current
   * ticking lane still gives a correct “stalls in <…h” countdown.
   */
  function computeMissingItemPolicy(ocRow) {
    const slots = Array.from(ocRow.querySelectorAll('button.slotHeader___K2BS_, button[class^="slotHeader___"]'));
    if (!slots.length) return { suppress: false, needsItem: false };

    const rightFilled = findRightMostFilledIndex(ocRow);

    // Does the right-most filled lane show the orange "inactive" (needs item) icon
    // and lack a planning clock?
    if (rightFilled >= 0) {
      const header = slots[rightFilled];
      const wrap   = header.closest('div.wrapper___Lpz_D, div[class^="wrapper___"]');
      const hasInactiveIcon = !!wrap.querySelector('.inactive___Dpqh0 svg path,[class^="inactive___"] svg path');
      const hasClock        = !!wrap.querySelector('div.planning___CjB09,[class^="planning___"]');
      if (hasInactiveIcon && !hasClock) {
        return { suppress: true, needsItem: true };
      }
    }

    // Safety: if the active clock is somehow on a lane that is still a "waiting/join" shell,
    // we can't trust its timing → call it needs item.
    const activeIdx = findActiveSlotIndex(ocRow);
    if (activeIdx >= 0) {
      const activeWrap = slots[activeIdx]?.closest('div.wrapper___Lpz_D, div[class^="wrapper___"]');
      if (activeWrap) {
        const isWaiting = /\bwaitingJoin___/.test(activeWrap.className);
        const timeBox   = activeWrap.querySelector('.planningTime___AqKIJ,[class^="planningTime___"]');
        const shows24   = /24\s*hrs/i.test(timeBox?.textContent || '') ||
                          (timeBox?.getAttribute('aria-label') || '').trim().toLowerCase() === '24 hours';
        if (isWaiting || shows24) {
          return { suppress: true, needsItem: true };
        }
      }
    }

    // Otherwise show normal labels (we’ll compute hours from the right-most clock).
    return { suppress: false, needsItem: false };
  }

  // ================================
  // Labels-only when slider is OFF (Recruiting)
  // ================================
  function labelOCStatusBadges() {
    if (enabled) return;

    const activeTab = document.querySelector(
      'button.active___ImR61 .tabName___DdwH3,' +
      '[class^="active___"] .tabName___DdwH3,' +
      '[class^="active___"] [class^="tabName___"]'
    );
    if (!activeTab || activeTab.textContent.trim() !== 'Recruiting') return;

    const ocList = document.querySelector(
      '#faction-crimes-root .tt-oc2-list, ' +
      '#faction-crimes-root .page-head-delimiter + div:not([class])'
    );
    if (!ocList || getComputedStyle(ocList).display === 'none') return;

    const rows = Array.from(ocList.querySelectorAll('div[class^="wrapper__"][data-oc-id], div[data-oc-id]'));

    rows.forEach(row => {
      row.style.border = '';
      const oldLabel = row.querySelector('.oc-label');
      if (oldLabel) oldLabel.remove();

      if (row.querySelector('.iconContainer___TDZ9F[aria-label="paused"],[class^="iconContainer___"][aria-label="paused"]')) {
        const color = '#00c853';
        addLabel(row, 'Paused/Stalled', color);
        deepenClockTint(row, 0);
        return;
      }

      if (row.querySelector('[aria-label="recruiting"]')) {
        const color = '#ccff90';
        addLabel(row, 'Not Started', color);
        return;
      }

      const { suppress, needsItem } = computeMissingItemPolicy(row);
      if (needsItem) { addLabel(row, 'Needs item', '#ffca28'); return; }
      if (suppress) { return; }

      const hrs = getHoursRemaining(row);
      if (hrs == null) return;

      if (hrs <= 12) {
        const color = '#64dd17';
        addLabel(row, 'Stalls in <12h', color);
        deepenClockTint(row, hrs);
      } else if (hrs <= 24) {
        const color = '#dcedc8';
        addLabel(row, 'Stalls in <24h', color);
        deepenClockTint(row, hrs);
      }
    });
  }

  // ================================
  // PRIORITY highlighting (slider ON)
  // ================================
  function highlightOCs() {
    if (!enabled) {
      const activeTab = document.querySelector(
        'button.active___ImR61 .tabName___DdwH3,' +
        '[class^="active___"] .tabName___DdwH3,' +
        '[class^="active___"] [class^="tabName___"]'
      );
      if (!activeTab || activeTab.textContent.trim() !== 'Recruiting') {
        resetAllOCs();
        return;
      }

      const ocList = document.querySelector(
        '#faction-crimes-root .tt-oc2-list, ' +
        '#faction-crimes-root .page-head-delimiter + div:not([class])'
      );
      if (ocList && getComputedStyle(ocList).display !== 'none') {
        const rows = Array.from(ocList.querySelectorAll('div[class^="wrapper__"][data-oc-id], div[data-oc-id]'));
        rows.forEach(row => {
          row.style.display = '';
          row.style.border = '';
          const oldLabel = row.querySelector('.oc-label');
          if (oldLabel) oldLabel.remove();
        });
        labelOCStatusBadges();
      }
      return;
    }

    const activeTab = document.querySelector(
      'button.active___ImR61 .tabName___DdwH3,' +
      '[class^="active___"] .tabName___DdwH3,' +
      '[class^="active___"] [class^="tabName___"]'
    );
    if (!activeTab || activeTab.textContent.trim() !== 'Recruiting') {
      resetAllOCs();
      return;
    }

    const ocList = document.querySelector(
      '#faction-crimes-root .tt-oc2-list, ' +
      '#faction-crimes-root .page-head-delimiter + div:not([class])'
    );
    if (!ocList || getComputedStyle(ocList).display === 'none') return;

    const rows = Array.from(ocList.querySelectorAll('div[class^="wrapper__"][data-oc-id], div[data-oc-id]'));

    if (applyLinkedSingleViewIfNeeded(rows)) return;

    const stalled = [];
    const lt12 = [];
    const notStarted = [];
    const lt24 = [];
    const needsItem = [];

    rows.forEach(row => {
      row.style.display = '';
      row.style.border = '';
      const oldLabel = row.querySelector('.oc-label');
      if (oldLabel) oldLabel.remove();

      if (row.querySelector('.iconContainer___TDZ9F[aria-label="paused"],[class^="iconContainer___"][aria-label="paused"]')) {
        const color = '#00c853';
        row.style.setProperty('border', `3px solid ${color}`, 'important');
        addLabel(row, 'Paused/Stalled', color);
        deepenClockTint(row, 0);
        stalled.push({ row, hrs: 0 });
        return;
      }

      if (row.querySelector('[aria-label="recruiting"]')) {
        const color = '#ccff90';
        row.style.setProperty('border', `2px solid ${color}`, 'important');
        addLabel(row, 'Not Started', color);
        notStarted.push({ row, hrs: 999 });
        return;
      }

      const policy = computeMissingItemPolicy(row);
      if (policy.needsItem) {
        const brown = '#8D6E63';
        row.style.setProperty('border', `2px solid ${brown}`, 'important');
        addLabel(row, 'Needs item', '#ffca28');
        needsItem.push({ row, hrs: 1000 });
        return;
      }
      if (policy.suppress) { row.style.display = 'none'; return; }

      const hrs = getHoursRemaining(row);
      if (hrs == null) { row.style.display = 'none'; return; }

      if (hrs <= 12) {
        const color = '#64dd17';
        row.style.setProperty('border', `3px solid ${color}`, 'important');
        addLabel(row, 'Stalls in <12h', color);
        deepenClockTint(row, hrs);
        lt12.push({ row, hrs });
      } else if (hrs <= 24) {
        const color = '#dcedc8';
        row.style.setProperty('border', `2px solid ${color}`, 'important');
        addLabel(row, 'Stalls in <24h', color);
        deepenClockTint(row, hrs);
        lt24.push({ row, hrs });
      } else {
        row.style.display = 'none';
      }
    });

    lt12.sort((a, b) => a.hrs - b.hrs);
    lt24.sort((a, b) => a.hrs - b.hrs);
    const ordered = stalled.concat(lt12, notStarted, lt24, needsItem);
    ordered.forEach(({ row }) => ocList.appendChild(row));
  }

  // ==============================================
  // Mobile: uncollapse description helper (updated)
  // ==============================================
  function uncollapseDesc(el) {
    if (!el) return;

    // Remove collapsed___XXXX from the <p> itself
    el.className = el.className.replace(/\bcollapsed___\w+\b/g, '');
    el.style.setProperty('max-height', 'none', 'important');
    el.style.setProperty('overflow', 'visible', 'important');
    el.style.setProperty('-webkit-line-clamp', 'unset', 'important');
    el.style.setProperty('-webkit-box-orient', 'unset', 'important');
    el.style.setProperty('white-space', 'normal', 'important');
    el.style.setProperty('display', 'block', 'important');

    // Also unclamp the inner descriptionText span if Torn uses it
    const inner = el.querySelector('[class^="descriptionText___"]');
    if (inner) {
      inner.style.setProperty('max-height', 'none', 'important');
      inner.style.setProperty('overflow', 'visible', 'important');
      inner.style.setProperty('-webkit-line-clamp', 'unset', 'important');
      inner.style.setProperty('-webkit-box-orient', 'unset', 'important');
      inner.style.setProperty('white-space', 'normal', 'important');
      inner.style.setProperty('display', 'inline', 'important');

      // Strip the "latestWordInShortDesc" marker if present
      inner.querySelectorAll('[class*="latestWordInShortDesc___"]').forEach(s => {
        s.className = s.className.replace(/\blatestWordInShortDesc___\w+\b/g, '').trim();
      });
    }

    // Remove the "... Show more" control chunk if present
    const seeMoreBtn = el.querySelector('button.seeMoreBtn___NreiQ,[class^="seeMoreBtn___"]');
    if (seeMoreBtn) {
      const wrapperSpan = seeMoreBtn.closest('span');
      if (wrapperSpan && wrapperSpan.parentNode === el) {
        wrapperSpan.remove();
      } else {
        seeMoreBtn.remove();
      }
    }
  }

  // ================================
  // Compact bonus area
  // ================================
  function replaceDescriptionsWithBonuses() {
    const ocContainers = document.querySelectorAll('div[data-oc-id], div[class^="wrapper__"][data-oc-id]');
    ocContainers.forEach(container => {
      const titleEl = container.querySelector('.panelTitle___aoGuV,[class^="panelTitle___"]');
      if (!titleEl) return;

      const crimeName = (titleEl.textContent || '').trim();
      if (!crimeName || !CRIME_BONUS[crimeName]) return;

      const desc = container.querySelector('p.description___Eg9si,[class^="description___"]');
      if (!desc) return;

      // ensure full text is unlocked before we nuke it and put chips in
      uncollapseDesc(desc);

      if (desc.classList.contains('oc-bonus-desc-stackedchips')) {
        const l1 = desc.querySelector('.oc-line1');
        const chips = desc.querySelector('.oc-chips');
        if (l1) l1.style.marginBottom = '0';
        if (chips) { chips.style.marginTop = '0'; chips.style.gap = '2px 6px'; }
        return;
      }

      desc.classList.remove('oc-bonus-desc', 'oc-bonus-desc-inline', 'oc-bonus-desc-compact', 'oc-bonus-desc-three');
      desc.classList.add('oc-bonus-desc-stackedchips');
      desc.style.marginTop = '1px';
      desc.style.marginBottom = '1px';
      desc.style.lineHeight = '1.12';
      desc.innerHTML = '';

      const roleMap = ROLE_BONUS[crimeName] || {};
      const roleMin = ROLE_MIN_CPR[crimeName] || {};

      const line1 = document.createElement('div');
      line1.className = 'oc-line1';
      line1.style.display = 'flex';
      line1.style.flexWrap = 'wrap';
      line1.style.alignItems = 'center';
      line1.style.gap = '6px';
      line1.style.margin = '0';

      const crimeChip = document.createElement('span');
      crimeChip.style.display = 'inline-block';
      crimeChip.style.background = '#333';
      crimeChip.style.color = '#fff';
      crimeChip.style.fontWeight = '700';
      crimeChip.style.padding = '2px 8px';
      crimeChip.style.borderRadius = '6px';
      crimeChip.style.fontSize = '12px';
      crimeChip.textContent = `Crime bonus: ${CRIME_BONUS[crimeName]}`;
      line1.appendChild(crimeChip);
      desc.appendChild(line1);

      const chipsRow = document.createElement('div');
      chipsRow.className = 'oc-chips';
      chipsRow.style.display = 'flex';
      chipsRow.style.flexWrap = 'wrap';
      chipsRow.style.gap = '2px 6px';
      chipsRow.style.marginTop = '0';

      Object.entries(roleMap).forEach(([role, bonus]) => {
        const chip = document.createElement('div');
        chip.className = 'oc-chip-2line';
        chip.style.display = 'inline-flex';
        chip.style.flexDirection = 'column';
        chip.style.alignItems = 'flex-start';
        chip.style.background = '#333';
        chip.style.color = '#fff';
        chip.style.padding = '3px 7px';
        chip.style.borderRadius = '6px';
        chip.style.lineHeight = '1.12';
        chip.style.whiteSpace = 'nowrap';

        const top = document.createElement('span');
        top.style.fontWeight = '600';
        top.style.fontSize = '11px';
        top.textContent = `${role}: ${bonus}`;
        chip.appendChild(top);

        const min = roleMin?.[role];
        if (min !== undefined) {
          const bottom = document.createElement('span');
          bottom.style.opacity = '0.95';
          bottom.style.fontSize = '10.5px';
          bottom.textContent = `Min CPR: ${min}`;
          chip.appendChild(bottom);
        }

        chipsRow.appendChild(chip);
      });

      desc.appendChild(chipsRow);
    });
  }

  // ================================
  // Headers: keep base role only (no "(min)")
  // ================================
  function addMinCPRToRoles() {
    const ocContainers = document.querySelectorAll('div[data-oc-id], div[class^="wrapper__"][data-oc-id]');
    ocContainers.forEach(container => {
      container.querySelectorAll('button.slotHeader___K2BS_,[class^="slotHeader___"]').forEach(btn => {
        const roleSpan = btn.querySelector('.title___UqFNy,[class^="title___"]');
        if (!roleSpan) return;
        const baseRole = roleSpan.textContent.trim().replace(/\s*\(\d+\)\s*$/, '');
        roleSpan.textContent = baseRole;
      });
    });
  }

  // ================================
  // Outlines for filled slots below min CPR
  // ================================
  function applyCPROutlines() {
    document.querySelectorAll('button.slotHeader___K2BS_, button[class^="slotHeader___"]').forEach(headerBtn => {
      const slotWrapper = headerBtn.closest('div.wrapper___Lpz_D, div[class^="wrapper___"]');
      if (!slotWrapper) return;

      const roleSpan = headerBtn.querySelector('.title___UqFNy, [class^="title___"]');
      const scEl     = headerBtn.querySelector('.successChance___ddHsR, [class^="successChance___"]');
      if (!roleSpan || !scEl) return;

      const body    = slotWrapper.querySelector('.slotBody___oxizq, [class^="slotBody___"]');
      const hasJoin = !!slotWrapper.querySelector('button.joinButton___Ikoyy, [class^="joinButton___"]');
      const isFilled = !!body && !hasJoin;

      if (!isFilled) {
        slotWrapper.style.removeProperty('outline');
        slotWrapper.style.removeProperty('box-shadow');
        slotWrapper.removeAttribute('data-oc-outline');
        return;
      }

      const roleText = (roleSpan.textContent || '').trim();
      let minMatch = roleText.match(/\((\d+)\)\s*$/);
      let minCPR = minMatch ? parseInt(minMatch[1], 10) : NaN;

      if (!isFinite(minCPR)) {
        const ocContainer = slotWrapper.closest('div[data-oc-id], div[class^="wrapper__"][data-oc-id]');
        const crimeName = ocContainer?.querySelector('[class*="panelTitle___"]')?.textContent?.trim();
        const baseRole = roleText.replace(/\s*\(\d+\)$/, '');
        if (crimeName && ROLE_MIN_CPR?.[crimeName]?.[baseRole] !== undefined) {
          minCPR = ROLE_MIN_CPR[crimeName][baseRole];
        }
      }

      const myCPR = parseInt((scEl.textContent || '').replace(/[^\d]/g, ''), 10);
      if (!isFinite(minCPR) || !isFinite(myCPR)) return;

      const diff = minCPR - myCPR;
      let color = null;
      if (diff === 1) color = '#FFD54A';
      else if (diff === 2) color = '#FF9800';
      else if (diff >= 3) color = '#FF5252';

      if (!color) {
        slotWrapper.style.removeProperty('outline');
        slotWrapper.style.removeProperty('box-shadow');
        slotWrapper.setAttribute('data-oc-outline', '0');
        return;
      }

      slotWrapper.style.setProperty('position', 'relative', 'important');
      slotWrapper.style.setProperty('box-shadow', `0 0 0 2px ${color}`, 'important');
      slotWrapper.setAttribute('data-oc-outline', String(diff));
    });
  }

  // ================================
  // Styles (warning color + compact spacing)
  // ================================
  function ensureStyleSheet() {
    if (document.getElementById('oc-highlighter-style')) return;
    const style = document.createElement('style');
    style.id = 'oc-highlighter-style';
    style.textContent = `
      button.slotHeader___K2BS_[data-oc-warning="1"] .title___UqFNy,
      button[class^="slotHeader___"][data-oc-warning="1"] [class^="title___"] {
        color: #ff0000 !important;
      }
      p.description___Eg9si.oc-bonus-desc-stackedchips,
      [class^="description___"].oc-bonus-desc-stackedchips {
        margin-top: 1px !important;
        margin-bottom: 1px !important;
        line-height: 1.12 !important;
      }
      .oc-bonus-desc-stackedchips .oc-line1 { margin-bottom: 0 !important; }
      .oc-bonus-desc-stackedchips .oc-chips { margin-top: 0 !important; gap: 2px 6px !important; }
      .oc-chip-2line { border-radius: 6px !important; }
      .oc-chip-2line > span:first-child { font-weight: 600 !important; }

      p.description___Eg9si.oc-bonus-desc-stackedchips,
      [class^="description___"].oc-bonus-desc-stackedchips {
        display: block !important;
        max-height: none !important;
        overflow: visible !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: unset !important;
        white-space: normal !important;
      }
      p.description___Eg9si.oc-bonus-desc-stackedchips[class*="collapsed___"],
      [class^="description___"].oc-bonus-desc-stackedchips[class*="collapsed___"] {
        max-height: none !important;
        overflow: visible !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: unset !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ================================
  // Warning symbol recolor
  // ================================
  function applyWarningSymbols() {
    document.querySelectorAll('button.slotHeader___K2BS_, button[class^="slotHeader___"]').forEach(headerBtn => {
      const roleSpan = headerBtn.querySelector('.title___UqFNy,[class^="title___"]');
      if (!roleSpan) return;

      const iconPaths = headerBtn.querySelectorAll('svg path');
      let hasWarning = false;
      iconPaths.forEach(p => {
        const attrFill = (p.getAttribute('fill') || '').trim().toLowerCase();
        const cssFill = (p.style && p.style.fill) ? p.style.fill.toLowerCase() : '';
        if (attrFill === '#ff794c' || cssFill === '#ff794c') {
          hasWarning = true;
          p.style.setProperty('fill', '#ff0000', 'important');
        }
      });

      if (hasWarning) headerBtn.setAttribute('data-oc-warning', '1');
      else headerBtn.removeAttribute('data-oc-warning');
    });
  }

  // ================================
  // Join-guard (sheet-based min)
  // ================================
  const bypassOnce = new WeakSet();

  function ensureJoinGuard() {
    document.addEventListener('click', function (e) {
      const joinBtn = e.target.closest('button.joinButton___Ikoyy,[class^="joinButton___"]');
      if (!joinBtn) return;

      if (bypassOnce.has(joinBtn)) {
        bypassOnce.delete(joinBtn);
        return;
      }

      const slotWrapper = joinBtn.closest('div[class*="wrapper___"]');
      if (!slotWrapper) return;

      const headerBtn = slotWrapper.querySelector('button.slotHeader___K2BS_,[class^="slotHeader___"]');
      if (!headerBtn) return;

      const roleSpan = headerBtn.querySelector('.title___UqFNy,[class^="title___"]');
      const scEl     = headerBtn.querySelector('.successChance___ddHsR,[class^="successChance___"]');
      if (!roleSpan || !scEl) return;

      const roleText = (roleSpan.textContent || '').trim();
      const baseRole = roleText.replace(/\s*\(\d+\)\s*$/, '');

      const ocContainer = slotWrapper.closest('div[data-oc-id], div[class^="wrapper__"][data-oc-id]');
      const crimeName = ocContainer?.querySelector('.panelTitle___aoGuV,[class^="panelTitle___"]')?.textContent?.trim() || '';

      const myCPR  = parseInt((scEl.textContent || '').replace(/[^\d]/g, ''), 10);
      let minCPR   = ROLE_MIN_CPR?.[crimeName]?.[baseRole];

      if (!isFinite(myCPR) || !isFinite(minCPR)) return;
      if (myCPR >= minCPR) return;

      e.preventDefault();
      e.stopPropagation();

      showConfirmModal({
        message: `WARNING! Your CPR (${myCPR}) is below the minimum (${minCPR}). Join anyway?`,
        onYes: () => { bypassOnce.add(joinBtn); joinBtn.click(); },
        onNo: () => {},
      });
    }, true);
  }

  function showConfirmModal({ message, onYes, onNo }) {
    let overlay = document.getElementById('oc-join-guard-overlay');
    let yes, no, msg;

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'oc-join-guard-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.55)';
      overlay.style.zIndex = '999999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';

      const box = document.createElement('div');
      box.id = 'oc-join-guard-box';
      box.style.background = '#111';
      box.style.color = '#fff';
      box.style.padding = '16px 18px';
      box.style.borderRadius = '10px';
      box.style.minWidth = '320px';
      box.style.maxWidth = '90vw';
      box.style.boxShadow = '0 6px 30px rgba(0,0,0,0.5)';
      box.style.font = '14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

      msg = document.createElement('div');
      msg.id = 'oc-join-guard-msg';
      msg.style.marginBottom = '12px';
      msg.style.fontWeight = '700';
      msg.style.fontSize = '14px';
      box.appendChild(msg);

      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '10px';
      btnRow.style.justifyContent = 'flex-end';

      no = document.createElement('button');
      no.id = 'oc-join-guard-no';
      no.textContent = 'No';
      no.style.background = '#444';
      no.style.color = '#fff';
      no.style.border = 'none';
      no.style.padding = '6px 12px';
      no.style.borderRadius = '6px';
      no.style.cursor = 'pointer';

      yes = document.createElement('button');
      yes.id = 'oc-join-guard-yes';
      yes.textContent = 'Yes';
      yes.style.background = '#28a745';
      yes.style.color = '#fff';
      yes.style.border = 'none';
      yes.style.padding = '6px 12px';
      yes.style.borderRadius = '6px';
      yes.style.cursor = 'pointer';

      btnRow.appendChild(no);
      btnRow.appendChild(yes);
      box.appendChild(btnRow);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    } else {
      msg = document.getElementById('oc-join-guard-msg');
      yes = document.getElementById('oc-join-guard-yes');
      no  = document.getElementById('oc-join-guard-no');
    }

    msg.textContent = message;

    yes.onclick = () => { overlay.style.display = 'none'; onYes && onYes(); };
    no.onclick  = () => { overlay.style.display = 'none'; onNo && onNo(); };

    overlay.style.display = 'flex';
  }

  // ================================
  // Boot + intervals
  // ================================
  ensureStyleSheet();

  const uiObserver = new MutationObserver(() => {
    if (document.querySelector('.content-title h4.left')) {
      createToggleUI();
      uiObserver.disconnect();
    }
  });
  uiObserver.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('hashchange', () => {
    setTimeout(() => { highlightOCs(); }, 0);
  });

  (async () => {
    await loadOCConfigPreferFresh();

    replaceDescriptionsWithBonuses();
    addMinCPRToRoles();
    applyCPROutlines();
    setTimeout(applyWarningSymbols, 550);

    setInterval(highlightOCs, 1500);
    setInterval(labelOCStatusBadges, 1500);
    setInterval(replaceDescriptionsWithBonuses, 900);
    setInterval(addMinCPRToRoles, 900);
    setInterval(applyCPROutlines, 1000);
    setInterval(() => setTimeout(applyWarningSymbols, 550), 1100);

    ensureJoinGuard();

    // Watch for Torn re-applying 'collapsed___' on the description
    new MutationObserver(muts => {
      for (const m of muts) {
        const t = m.target;
        if (!(t instanceof HTMLElement)) continue;

        // If Torn tries to re-collapse either the <p> or inner descriptionText,
        // uncollapse the owning <p>.
        const isDescP = t.matches('p[class^="description___"]');
        const isInner = t.matches('[class^="descriptionText___"]');
        if (!isDescP && !isInner) continue;

        const cls = t.className || '';
        if (!/\bcollapsed___\w+\b/.test(cls)) continue;

        const rootP = isDescP ? t : t.closest('p[class^="description___"]');
        if (rootP) uncollapseDesc(rootP);
      }
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['class'] });
  })();
})();
