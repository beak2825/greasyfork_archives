// ==UserScript==
// @name         Flowyer summary: Billable time quick-set buttons (with inline UI update)
// @namespace    https://www.flowyer.hu/
// @version      0.3.0
// @description  Adds buttons to quickly set billable time: zero, half, 2/3, or same as spent time
// @match        https://www.flowyer.hu/summary*
// @match        https://www.flowyer.hu/summary
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544375/Flowyer%20summary%3A%20Billable%20time%20quick-set%20buttons%20%28with%20inline%20UI%20update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544375/Flowyer%20summary%3A%20Billable%20time%20quick-set%20buttons%20%28with%20inline%20UI%20update%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitFor(condFn, {interval = 150, timeout = 15000} = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        try {
          if (condFn()) return resolve();
        } catch (e) {}
        if (Date.now() - start > timeout)
          return reject(new Error('Timeout waiting for condition'));
        setTimeout(tick, interval);
      };
      tick();
    });
  }

  function getCsrfTokens() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    const csrf = meta ? meta.getAttribute('content') : '';
    const xsrfCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('XSRF-TOKEN='));
    const xsrf = xsrfCookie
      ? decodeURIComponent(xsrfCookie.split('=')[1])
      : csrf;
    return {csrf, xsrf};
  }

  function createButton(rowId, type = 'zero') {
    const btn = document.createElement('button');
    btn.type = 'button';

    const configs = {
      zero: {
        text: '0',
        title: 'Számlázható perc = 0 és mentés',
        className: 'flowyer-zero-billable',
      },
      half: {
        text: '1/2',
        title: 'Számlázható perc = eltöltött idő / 2 és mentés',
        className: 'flowyer-half-billable',
      },
      twoThirds: {
        text: '2/3',
        title: 'Számlázható perc = eltöltött idő * 2/3 és mentés',
        className: 'flowyer-twothirds-billable',
      },
      same: {
        text: '=',
        title: 'Számlázható perc = eltöltött idő és mentés',
        className: 'flowyer-same-billable',
      },
    };

    const config = configs[type] || configs.zero;
    btn.textContent = config.text;
    btn.title = config.title;
    btn.style.cssText = 'padding:2px 6px; font-size:12px; line-height:1.4;';
    btn.className = `btn btn-sm btn-light ${config.className}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleBillableUpdate(rowId, btn, type);
    });
    return btn;
  }

  // Immediately reflect new value in UI within the target column cell
  function updateCellDisplay(rowId, newValue) {
    const table = document.getElementById('summary-workhours');
    if (!table) return;
    const body = table.querySelector('tbody');
    if (!body) return;

    const tr = body.querySelector(
      `tr[data-uniqueid="${rowId}"], tr[data-unique-id="${rowId}"]`,
    );
    if (!tr) return;

    const targetCell = getTargetCell(tr);
    if (!targetCell) return;

    const candidates = targetCell.querySelectorAll('span, strong, b, div, i');
    let updated = false;
    for (const el of candidates) {
      const txt = (el.textContent || '').trim();
      if (/^\d+([.,]\d+)?\s*(perc|p|m|min|óra|h)?$/i.test(txt)) {
        el.textContent = String(newValue);
        updated = true;
        break;
      }
    }

    if (!updated) {
      let marker = targetCell.querySelector('.flowyer-billable-inline');
      if (!marker) {
        marker = document.createElement('span');
        marker.className = 'flowyer-billable-inline ms-1';
        targetCell.appendChild(marker);
      }
      marker.textContent = String(newValue);
    }
  }

  // Helper function to get spent time from row
  function getSpentTimeFromRow(rowId) {
    const table = document.getElementById('summary-workhours');
    if (!table) return 0;
    const body = table.querySelector('tbody');
    if (!body) return 0;

    const tr = body.querySelector(
      `tr[data-uniqueid="${rowId}"], tr[data-unique-id="${rowId}"]`,
    );
    if (!tr) return 0;

    // Find "Eltöltött idő" column
    let spentTimeColIndex = table._flowyerSpentTimeColIndex;
    if (typeof spentTimeColIndex !== 'number') {
      const detected = findColumnIndexByHeaderText(table, 'Eltöltött idő');
      spentTimeColIndex = detected >= 0 ? detected : 5; // fallback to 6th column
      table._flowyerSpentTimeColIndex = spentTimeColIndex;
    }

    const cells = Array.from(tr.children).filter(
      (el) => el.tagName === 'TD' || el.tagName === 'TH',
    );
    if (cells.length <= spentTimeColIndex) return 0;

    const spentTimeCell = cells[spentTimeColIndex];
    const text = (spentTimeCell.textContent || '').trim();

    // Extract numeric value from text (handle both comma and dot as decimal separator)
    const match = text.match(/(\d+(?:[.,]\d+)?)/);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }

    return 0;
  }

  async function handleBillableUpdate(id, btnEl, type = 'zero') {
    if (!id) return;
    btnEl.disabled = true;
    const originalText = btnEl.textContent;
    btnEl.textContent = 'Feldolgozás...';

    try {
      const {csrf, xsrf} = getCsrfTokens();

      // Fetch current record (the provided curl shows multipart form; use POST)
      const getUrl = 'https://www.flowyer.hu/workhours/get';
      const getForm = new FormData();
      getForm.append('id', String(id));

      const getResp = await fetch(getUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-TOKEN': csrf,
          'X-XSRF-TOKEN': xsrf,
          Accept: 'application/json, text/plain, */*',
        },
        body: getForm,
      });

      if (!getResp.ok) throw new Error('GET failed: ' + getResp.status);
      const getJson = await getResp.json();
      if (!getJson || !getJson.data) throw new Error('Invalid response shape');

      const d = getJson.data;

      // Calculate new billable time based on type
      let newBillableMinutes = 0;
      let newBillableHours = 0;

      if (type !== 'zero') {
        const spentMinutes = parseFloat(d.minute || 0);
        const spentHours = parseFloat(d.hour || 0);
        const totalSpentMinutes = spentHours * 60 + spentMinutes;

        let calculatedMinutes = 0;
        switch (type) {
          case 'half':
            calculatedMinutes = totalSpentMinutes / 2;
            break;
          case 'twoThirds':
            calculatedMinutes =
              Math.round(((totalSpentMinutes * 2) / 3) * 100) / 100;
            break;
          case 'same':
            calculatedMinutes = totalSpentMinutes;
            break;
        }

        newBillableHours = Math.floor(calculatedMinutes / 60);
        newBillableMinutes = Math.round((calculatedMinutes % 60) * 100) / 100;
      }

      // Build update payload
      const updateForm = new FormData();
      updateForm.append('id', String(d.id ?? id));
      if (d.case_id != null) updateForm.append('caseId', String(d.case_id));
      if (d.client_id != null)
        updateForm.append('clientOrAdverseId', String(d.client_id));
      updateForm.append('clientOrAdverseType', 'c');
      if (d.client_name != null)
        updateForm.append('clientName', String(d.client_name));
      updateForm.append(
        'finalCaseNumber',
        d.final_case_number ?? d.case_final_number ?? '',
      );
      updateForm.append('subject', d.activity ?? d.subject ?? '');
      updateForm.append('date', d.date ?? '');
      if (d.user_id != null)
        updateForm.append('responsibleId', String(d.user_id));
      updateForm.append('responsibleName', d.responsible_name ?? '');
      updateForm.append('minute', String(d.minute ?? ''));
      updateForm.append('hour', String(d.hour ?? ''));
      updateForm.append('billablehour', String(newBillableHours));
      updateForm.append('billableminute', String(newBillableMinutes));

      const updUrl = 'https://www.flowyer.hu/workhours/update';
      const updResp = await fetch(updUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-TOKEN': csrf,
          'X-XSRF-TOKEN': xsrf,
          Accept: 'application/json, text/plain, */*',
        },
        body: updateForm,
      });

      if (!updResp.ok) {
        const t = await updResp.text();
        throw new Error('Update failed: ' + updResp.status + ' ' + t);
      }

      // Update UI immediately with the calculated value (convert to hours for display)
      const totalMinutes = newBillableHours * 60 + newBillableMinutes;
      const displayValue = (totalMinutes / 60).toFixed(2);
      updateCellDisplay(id, displayValue);

      // Optional background refresh to keep in sync
      tryRefreshTableRow(id);

      btnEl.textContent = 'Kész';
      setTimeout(() => {
        btnEl.textContent = originalText;
        btnEl.disabled = false;
      }, 1200);
    } catch (err) {
      console.error('Billable update failed', err);
      btnEl.textContent = 'Hiba';
      setTimeout(() => {
        btnEl.textContent = originalText;
        btnEl.disabled = false;
      }, 2000);
    }
  }

  function tryRefreshTableRow(id) {
    const table = document.getElementById('summary-workhours');
    if (!table) return;
    try {
      if (
        typeof window.$ !== 'undefined' &&
        window.$.fn &&
        window.$.fn.bootstrapTable
      ) {
        window
          .$('#summary-workhours')
          .bootstrapTable('refresh', {silent: true});
      }
    } catch (_) {}
  }

  function findColumnIndexByHeaderText(table, headerText) {
    const thead = table.querySelector('thead');
    if (!thead) return -1;
    const headerCells = Array.from(thead.querySelectorAll('th,td')).filter(
      Boolean,
    );
    const idx = headerCells.findIndex((th) =>
      (th.textContent || '').trim().includes(headerText),
    );
    return idx;
  }

  function getTargetCell(tr) {
    const table = tr.closest('table');
    if (!table) return null;

    let idx = table._flowyerTargetColIndex;
    if (typeof idx !== 'number') {
      const detected = findColumnIndexByHeaderText(table, 'Számlázható idő');
      idx = detected >= 0 ? detected : 6; // fallback to 7th column
      table._flowyerTargetColIndex = idx;
    }

    const cells = Array.from(tr.children).filter(
      (el) => el.tagName === 'TD' || el.tagName === 'TH',
    );
    if (cells.length <= idx) return null;
    return cells[idx];
  }

  function injectButtons() {
    const table = document.getElementById('summary-workhours');
    if (!table) return;
    const body = table.querySelector('tbody');
    if (!body) return;

    const rows = Array.from(body.querySelectorAll('tr'));
    for (const tr of rows) {
      const rowId =
        tr.getAttribute('data-uniqueid') ||
        tr.getAttribute('data-unique-id') ||
        tr.dataset.uniqueid ||
        tr.dataset.uniqueId;
      if (!rowId) continue;

      const targetCell = getTargetCell(tr);
      if (!targetCell) continue;

      // Check if buttons are already injected
      if (targetCell.querySelector('.flowyer-zero-billable')) continue;

      // Create all four buttons
      const zeroBtn = createButton(rowId, 'zero');
      const halfBtn = createButton(rowId, 'half');
      const twoThirdsBtn = createButton(rowId, 'twoThirds');
      const sameBtn = createButton(rowId, 'same');

      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.gap = '4px';
      wrapper.style.alignItems = 'center';
      wrapper.style.flexWrap = 'wrap';

      // Preserve original cell content
      const originalContent = document.createElement('span');
      while (targetCell.firstChild) {
        originalContent.appendChild(targetCell.firstChild);
      }

      wrapper.appendChild(originalContent);

      // Add all buttons
      wrapper.appendChild(zeroBtn);
      wrapper.appendChild(halfBtn);
      wrapper.appendChild(twoThirdsBtn);
      wrapper.appendChild(sameBtn);

      targetCell.appendChild(wrapper);
    }
  }

  async function init() {
    await waitFor(() => document.getElementById('summary-workhours'));
    const table = document.getElementById('summary-workhours');

    let attached = false;
    if (
      typeof window.$ !== 'undefined' &&
      window.$.fn &&
      window.$.fn.bootstrapTable
    ) {
      const $table = window.$('#summary-workhours');
      $table.on('post-body.bs.table', () => injectButtons());
      $table.on('reset-view.bs.table', () => injectButtons());
      attached = true;
    }

    if (!attached) {
      const observer = new MutationObserver(() => injectButtons());
      observer.observe(table, {childList: true, subtree: true});
    }

    injectButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
