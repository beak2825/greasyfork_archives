// ==UserScript==
// @name         BdRENExtended
// @namespace    shmVirus-scripts
// @description  Adds helpful features and improvements to BdREN pages.
// @version      0.0.1
// @author       shmVirus
// @license      MIT
// @match        https://*.bdren.net.bd/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545670/BdRENExtended.user.js
// @updateURL https://update.greasyfork.org/scripts/545670/BdRENExtended.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const routes = [{ match: /^\/faculty\/report\/participants/i, run: participantsPage }];
  const route = routes.find(r => r.match.test(location.pathname));
  if (!route) return;
  route.run();

  function participantsPage() {
    const CONFIG = {
      TABLE: '#classSchedules-table',
      MODE_KEY: 'tmkParseMode',
      TOAST_MS: 1600,                 // kept but unused; safe to remove later if you want
      COPY_BTN_ID: 'tmkCopyBtnText',
      MODES: {
        hyphen: { regex: /^\s*(\d{9})\s*-\s*(?=\S)/ }, // 9digits-Name
        any:    { regex: /(\d{9})(?!\d)/ }             // any 9 digits
      }
    };

    const q  = (s,r=document)=>r.querySelector(s);
    const qa = (s,r=document)=>[...r.querySelectorAll(s)];
    const dedupe = a => [...new Set(a)];

    let mode = localStorage.getItem(CONFIG.MODE_KEY) || 'hyphen';
    if (!CONFIG.MODES[mode]) mode = 'hyphen';
    const extractId = (t='') => (t.trim().match(CONFIG.MODES[mode].regex)?.[1] ?? null);

    let table, tbody, nameCol = 1, obs, rafScheduled = false, lastStats = null;

    const copyToClipboard = ids => {
      const txt = ids.join('\n');
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(txt).catch(()=>fallbackCopy(txt));
      } else {
        fallbackCopy(txt);
      }
    };

    const fallbackCopy = text => {
      const ta=document.createElement('textarea');
      ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    };

    const getNameColIndex = () => {
      const heads = qa('thead th', table).map(th => th.textContent.trim().toLowerCase());
      const i = heads.findIndex(t => t.includes('name'));
      return i >= 0 ? i : 1;
    };

    const ensureIdHeaderAndCells = () => {
      let idTh = qa('thead th', table).find(th =>
        th.classList.contains('tmk-id-col') || th.textContent.trim().toLowerCase() === 'id'
      );
      if (!idTh) {
        idTh = document.createElement('th');
        idTh.className = 'tmk-id-col';
        q('thead tr', table).appendChild(idTh);
      } else idTh.classList.add('tmk-id-col');

      qa('tbody tr', table).forEach(r => {
        if (!r.querySelector('td.tmk-id-col')) {
          const td = document.createElement('td');
          td.className = 'tmk-id-col';
          r.appendChild(td);
        }
      });

      if (!idTh.querySelector('.tmk-stack')) buildHeaderUI(idTh);
    };

    const buildHeaderUI = (idTh) => {
      idTh.textContent = '';
      idTh.style.textAlign = 'center';

      const stack = document.createElement('div'); stack.className = 'tmk-stack';

      // Top row: Non — [switch] — Formatted (always visible)
      const top = document.createElement('div'); top.className = 'tmk-top';
      const nonLabel = document.createElement('span'); nonLabel.className = 'tmk-toggle-side'; nonLabel.textContent = 'Non';
      const toggleWrap = document.createElement('label'); toggleWrap.className = 'tmk-toggle';
      const toggle = document.createElement('input'); toggle.type = 'checkbox'; toggle.className = 'tmk-toggle-input';
      toggle.checked = (mode === 'hyphen');
      const slider = document.createElement('span'); slider.className = 'tmk-toggle-slider';
      const fmtLabel = document.createElement('span'); fmtLabel.className = 'tmk-toggle-side'; fmtLabel.textContent = 'Formatted';

      toggle.onchange = () => {
        mode = toggle.checked ? 'hyphen' : 'any';
        localStorage.setItem(CONFIG.MODE_KEY, mode);
        scheduleRefresh();
      };
      toggleWrap.append(toggle, slider);
      top.append(nonLabel, toggleWrap, fmtLabel);

      // Bottom row: "Copy X/Y/Z IDs" button
      const row = document.createElement('div'); row.className = 'tmk-row';
      const copyBtn = document.createElement('button');
      copyBtn.id = CONFIG.COPY_BTN_ID;
      copyBtn.type = 'button';
      copyBtn.className = 'tmk-copy-btn';
      copyBtn.textContent = 'Copy 0/0/0 IDs';
      copyBtn.onclick = () => {
        const ids = lastStats?.unique ?? [];
        if (ids.length) copyToClipboard(ids);
        else console.warn('No student IDs found.');
      };

      row.append(copyBtn);
      stack.append(top, row);
      idTh.appendChild(stack);
    };

    const refreshAll = () => {
      nameCol = getNameColIndex();
      const rows = [...tbody.rows];
      const parsedList = [];

      for (const r of rows) {
        const id = extractId(r.cells[nameCol]?.innerText || '');
        if (id) parsedList.push(id);

        let cell = r.querySelector('td.tmk-id-col');
        if (!cell) { cell = document.createElement('td'); cell.className = 'tmk-id-col'; r.appendChild(cell); }
        if (cell.textContent !== (id || '')) cell.textContent = id || '';
      }

      const unique = dedupe(parsedList);
      lastStats = { unique, parsedList, total: rows.length };

      const btn = q('#'+CONFIG.COPY_BTN_ID);
      if (btn) btn.textContent = `Copy ${unique.length}/${parsedList.length}/${rows.length} IDs`;
    };

    const scheduleRefresh = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => { rafScheduled = false; refreshAll(); });
    };

    const startObserver = () => {
      obs?.disconnect();
      obs = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'childList' && ([...m.addedNodes, ...m.removedNodes].some(n => n.nodeName === 'TR'))) {
            scheduleRefresh(); return;
          }
        }
      });
      obs.observe(tbody, { childList: true });
    };

    const applyStyles = () => {
      const css = `
        /* widths: SL 5% · Name 50% · Email 30% · ID 15% */
        ${CONFIG.TABLE}{table-layout:fixed;width:100%}
        ${CONFIG.TABLE} th, ${CONFIG.TABLE} td{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
        ${CONFIG.TABLE} thead th{text-align:center;vertical-align:middle}

        /* Left-align Name & Email (headers + cells) */
        ${CONFIG.TABLE} thead th:nth-child(2),
        ${CONFIG.TABLE} thead th:nth-child(3),
        ${CONFIG.TABLE} tbody td:nth-child(2),
        ${CONFIG.TABLE} tbody td:nth-child(3){ text-align:left !important; }

        ${CONFIG.TABLE} thead th:nth-child(1), ${CONFIG.TABLE} tbody td:nth-child(1){width:5%;  text-align:center}
        ${CONFIG.TABLE} thead th:nth-child(2), ${CONFIG.TABLE} tbody td:nth-child(2){width:50%}
        ${CONFIG.TABLE} thead th:nth-child(3), ${CONFIG.TABLE} tbody td:nth-child(3){width:30%}
        ${CONFIG.TABLE} thead th:nth-child(4), ${CONFIG.TABLE} tbody td:nth-child(4){width:15%}
        ${CONFIG.TABLE} tbody td.tmk-id-col{ text-align:center }

        /* Make EVERY element inside the ID header look exactly like table headers (bold, same color/size) */
        ${CONFIG.TABLE} thead th.tmk-id-col,
        ${CONFIG.TABLE} thead th.tmk-id-col *{
          font-family: inherit !important;
          font-size:   inherit !important;
          font-weight: 600 !important;   /* make bold to match typical TH */
          color:       inherit !important;
          line-height: inherit !important;
        }
        /* smaller "Copy … IDs" button */
        ${CONFIG.TABLE} thead th.tmk-id-col .tmk-copy-btn{
          font-size:.85em !important;
          line-height:1.1 !important;
          padding:2px 6px !important;
          border-radius:6px !important;
        }
        ${CONFIG.TABLE} tbody td.tmk-id-col{
          font-family: inherit !important;
          font-size:   inherit !important;
          line-height: inherit !important;
        }

        /* header layout */
        .tmk-stack{display:inline-flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;max-width:100%}
        .tmk-top{
          display:grid;
          grid-template-columns:auto 28px auto; /* labels – switch – label */
          align-items:center; justify-content:center; column-gap:8px; white-space:nowrap
        }
        .tmk-row{display:inline-flex;align-items:center;justify-content:center}

        /* labels inherit header style; keep full opacity */
        .tmk-toggle-side{min-width:4ch;text-align:center;opacity:1}

        /* smaller iOS switch; push it further down to align with labels */
        .tmk-toggle{position:relative;width:28px;height:16px;display:inline-block;margin-top:6px}
        .tmk-toggle-input{opacity:0;width:0;height:0;position:absolute}
        .tmk-toggle-slider{
          position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;
          background:#c7c7c7;border-radius:999px;transition:background .18s ease
        }
        .tmk-toggle-slider::after{
          content:"";position:absolute;height:12px;width:12px;left:2px;top:2px;
          background:#fff;border-radius:50%;transition:transform .18s ease
        }
        .tmk-toggle-input:checked + .tmk-toggle-slider{background:#43a047}
        .tmk-toggle-input:checked + .tmk-toggle-slider::after{transform:translateX(12px)}

        /* "Copy X/Y/Z IDs" button — same bold header typography */
        .tmk-copy-btn{
          font: inherit !important;
          font-weight: 600 !important;
          line-height: 1.35;
          padding:3px 10px; border:1px solid #ccd; border-radius:8px;
          background:#f7f7f7; color:inherit; cursor:pointer;
        }
        .tmk-copy-btn:hover{background:#ededed}
        .tmk-copy-btn:active{transform:translateY(0.5px)}
      `;
      const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    };

    const init = (tbl) => {
      table = tbl; tbody = table.tBodies[0]; if (!tbody) return;
      applyStyles();
      ensureIdHeaderAndCells();
      refreshAll();
      startObserver();
    };

    const waitFor = (sel, cb) => {
      const el = q(sel); if (el) return cb(el);
      const mo = new MutationObserver(() => {
        const e = q(sel); if (e) { mo.disconnect(); cb(e); }
      });
      mo.observe(document.body, { childList:true, subtree:true });
    };
    waitFor(CONFIG.TABLE, init);
  }
})();