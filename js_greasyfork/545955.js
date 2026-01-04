// ==UserScript==
// @name         Personio: 08–17 + Pause 12–13
// @namespace    tm-personio-quickfill
// @version      1.4
// @license MIT
// @description  Fügt im geöffneten Tag einen Button ein und trägt 08–17 + Pause 12–13 ein.
// @match        https://*.app.personio.com/attendance/employee/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545955/Personio%3A%2008%E2%80%9317%20%2B%20Pause%2012%E2%80%9313.user.js
// @updateURL https://update.greasyfork.org/scripts/545955/Personio%3A%2008%E2%80%9317%20%2B%20Pause%2012%E2%80%9313.meta.js
// ==/UserScript==

(() => {
  const AUTOSAVE = false; // true = nach dem Eintragen automatisch speichern

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);

  const replaceSegmentText = async (el, text) => {
    if (!el) return false;
    text = String(text).padStart(2, '0');
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    // „echte“ Eingabe, damit die App reagiert
    document.execCommand('insertText', false, text);
    await sleep(10);
    el.blur();
    return el.textContent?.trim() === text;
  };

  const getTimeSegments = (groupEl) => {
    const segs = qsa('span[role="spinbutton"][contenteditable="true"]', groupEl);
    return { h: segs[0], m: segs[1] };
  };

  const setTimeGroup = async (groupEl, hh, mm) => {
    const { h, m } = getTimeSegments(groupEl);
    const a = await replaceSegmentText(h, hh);
    const b = await replaceSegmentText(m, mm);
    return a && b;
  };

  const setPeriodTimes = async (rowEl, sh, sm, eh, em) => {
    const start = $('[data-test-id$=".start"]', rowEl);
    const end   = $('[data-test-id$=".end"]', rowEl);
    const a = await setTimeGroup(start, sh, sm);
    const b = await setTimeGroup(end,   eh, em);
    return a && b;
  };

  const rowType = (rowEl) => {
    const sel = $('select', rowEl);
    const opt = sel?.querySelector('option[selected]') || sel?.options?.[sel.selectedIndex];
    return opt?.value || null; // "work" | "break"
  };

  const ensureRows = async (form) => {
    let rows = qsa('[data-test-id="timeEntryRow"]', form);
    let works = rows.filter(r => rowType(r) === 'work');
    let breaks = rows.filter(r => rowType(r) === 'break');

    if (works.length === 0) $('[data-test-id="timecard-add-work"]', form)?.click();
    if (breaks.length === 0) $('[data-test-id="timecard-add-break"]', form)?.click();
    await sleep(60);

    rows = qsa('[data-test-id="timeEntryRow"]', form);
    works = rows.filter(r => rowType(r) === 'work');
    breaks = rows.filter(r => rowType(r) === 'break');

    // Überzählige löschen
    const extras = works.slice(1).concat(breaks.slice(1));
    for (const ex of extras) {
      $('button[data-test-id^="timecard-delete-period"]', ex)?.click();
      await sleep(40);
    }

    rows = qsa('[data-test-id="timeEntryRow"]', form);
    works = rows.filter(r => rowType(r) === 'work');
    breaks = rows.filter(r => rowType(r) === 'break');
    return { work: works[0], brk: breaks[0] };
  };

  const fillCurrentDay = async (form) => {
    const { work, brk } = await ensureRows(form);
    if (!work || !brk) return false;
    const ok1 = await setPeriodTimes(work, 8, 0, 17, 0);
    const ok2 = await setPeriodTimes(brk, 12, 0, 13, 0);
    if (AUTOSAVE && ok1 && ok2) $('[data-test-id="timecard-save-button"]', form)?.click();
    return ok1 && ok2;
  };

  const injectButtonIfNeeded = (root) => {
    const addWork = $('[data-test-id="timecard-add-work"]', root);
    const addBreak = $('[data-test-id="timecard-add-break"]', root);
    if (!addWork || !addBreak) return;

    const bar = addWork.parentElement;
    if (!bar || $('#tm-quickfill', bar)) return;

    const btn = document.createElement('button');
    btn.id = 'tm-quickfill';
    btn.type = 'button';
    btn.className = addWork.className; // übernimmt Look
    btn.style.marginLeft = '8px';
    btn.textContent = '08–17 + Pause 12–13';
    btn.title = 'Zeiten eintragen (optional AUTOSAVE s.o.)';

    btn.addEventListener('click', async () => {
      const form = btn.closest('form[data-test-id="time-entry-form"]') || btn.closest('form');
      if (!form) return;
      btn.disabled = true;
      await fillCurrentDay(form);
      btn.disabled = false;
    });

    addBreak.parentElement.appendChild(btn);
  };

  const mo = new MutationObserver(() => {
    qsa('form[data-test-id="time-entry-form"]').forEach(form => injectButtonIfNeeded(form));
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  qsa('form[data-test-id="time-entry-form"]').forEach(form => injectButtonIfNeeded(form));
})();
