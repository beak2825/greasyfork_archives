// ==UserScript==
// @name         ActualGUMS
// @namespace    shmVirus-scripts
// @description  Because the original felt more like a group project gone wrong!
// @version      0.0.9
// @author       shmVirus
// @license      MIT
// @match        https://gums.green.edu.bd/*
// @require      https://update.greasyfork.org/scripts/545671/1640830/ActualGUMS-SyllabusData.js
// @require      https://update.greasyfork.org/scripts/545672/1709847/ActualGUMS-BatchConfig.js
// @match        https://*.bdren.net.bd/*
// @require      https://update.greasyfork.org/scripts/545670/1640825/BdRENExtended.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545675/ActualGUMS.user.js
// @updateURL https://update.greasyfork.org/scripts/545675/ActualGUMS.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Core = (() => {
    const q = (sel, root = document) => root.querySelector(sel);
    const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

    const html = (strings, ...vals) => strings.reduce((acc, s, i) => acc + s + (vals[i] ?? ''), '');

    const once = (fn) => {
      let done = false;
      return (...args) => {
        if (done) return;
        done = true;
        return fn(...args);
      };
    };

    const rafThrottle = (fn) => {
      let queued = false;
      let lastArgs = null;
      return (...args) => {
        lastArgs = args;
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          fn(...(lastArgs || []));
        });
      };
    };

    const copyText = async (text) => {
      const s = String(text ?? '');
      const fallback = () => {
        try {
          const ta = document.createElement('textarea');
          ta.value = s;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          ta.style.top = '0';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          let ok = false;
          try { ok = document.execCommand('copy'); } catch { ok = false; }
          ta.remove();
          return ok;
        } catch {
          return false;
        }
      };

      try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
          await navigator.clipboard.writeText(s);
          return true;
        }
      } catch {}
      return fallback();
    };

    const injectCSSOnce = (css, id) => {
      if (id && document.getElementById(id)) return;
      const style = document.createElement('style');
      if (id) style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
    };

    const waitFor = (selector, cb, { root = document.body, timeout = 20_000 } = {}) => {
      const immediate = q(selector);
      if (immediate) return cb(immediate);

      const obs = new MutationObserver(() => {
        const el = q(selector);
        if (!el) return;
        obs.disconnect();
        cb(el);
      });
      obs.observe(root, { childList: true, subtree: true });

      setTimeout(() => obs.disconnect(), timeout);
    };

    const getPRM = () => window.Sys?.WebForms?.PageRequestManager?.getInstance?.() || null;

    const hookPRMOnce = (key, fn) => {
      const prm = getPRM();
      if (!prm) return false;
      if (prm[key]) return true;
      prm[key] = true;
      prm.add_endRequest(() => fn());
      return true;
    };

    const observeOnce = (key, root, fn) => {
      const host = root || document.documentElement;
      if (!host) return false;
      if (host[key]) return true;
      host[key] = true;
      const obs = new MutationObserver(rafThrottle(() => fn()));
      obs.observe(host, { childList: true, subtree: true });
      return true;
    };

    const normalizeWS = (s) => String(s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    const normCode = (s) => String(s || '').replace(/\s+/g, '').toUpperCase();

    const normalizeBDPhone = (v) => {
      let s = String(v ?? '').trim();
      if (!s) return '';

      s = s.replace(/[^\d+]/g, '');

      if (/^\+?8801\d{9}$/.test(s)) return s.replace(/^\+?880/, '0');
      if (/^01\d{9}$/.test(s)) return s;
      if (/^1\d{9}$/.test(s)) return '0' + s;

      return s;
    };

    return {
      q, qa, on, html, once, rafThrottle, copyText, injectCSSOnce, waitFor,
      getPRM, hookPRMOnce, observeOnce, normalizeWS, normCode, normalizeBDPhone
    };
  })();

  const Theme = (() => {
    const ensureBaseTheme = Core.once(() => {
      Core.injectCSSOnce(
        `
        :root{
          --ActualGUMS-green:#0c7a5f;
          --ActualGUMS-red:#c62424;
          --ActualGUMS-bg:#f2fff9;
          --ActualGUMS-border:#0c7a5f;
          --ActualGUMS-muted:#6b7280;
          --ActualGUMS-action:#3b7f8f;
        }
        @media(prefers-color-scheme:dark){
          :root{
            --ActualGUMS-green:#68d6be;
            --ActualGUMS-red:#ff7171;
            --ActualGUMS-bg:#0d2a26;
            --ActualGUMS-border:#68d6be;
            --ActualGUMS-muted:#94a3b8;
            --ActualGUMS-action:#3b7f8f;
          }
        }

        .ActualGUMS-card{
          font-family:"Segoe UI",system-ui,sans-serif;
          border:2px solid var(--ActualGUMS-border);
          border-radius:8px;
          background:var(--ActualGUMS-bg);
        }

        .ActualGUMS-chip{
          background:#fff;
          border:1px solid var(--ActualGUMS-border);
          border-radius:4px;
          padding:2px 6px;
          font-size:13px;
          white-space:nowrap;
        }

        .ActualGUMS-grade-badge{
          display:inline-block;
          min-width:28px;
          padding:0 6px;
          border-radius:999px;
          border:1px solid currentColor;
          font:700 11px/18px "Segoe UI",system-ui;
          color:currentColor;
          background:transparent;
        }

        .ActualGUMS-repeat-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          border-radius:999px;
          padding:1px 8px;
          font-size:12px;
          font-weight:800;
          border:1px solid rgba(0,0,0,.14);
          background:#fff;
          color:#111;
          white-space:nowrap;
        }
        @media(prefers-color-scheme:dark){
          .ActualGUMS-repeat-badge{
            background:rgba(255,255,255,.06);
            border-color:rgba(255,255,255,.18);
            color:rgba(255,255,255,.88);
            box-shadow:0 1px 10px rgba(0,0,0,.35);
          }
        }

        .ActualGUMS-input{
          width:100%;
          padding:8px 10px;
          border:1px solid rgba(12,122,95,.35);
          border-radius:8px;
          outline:none;
          background:#fff;
          box-sizing:border-box;
        }
        .ActualGUMS-input:focus{
          box-shadow:0 0 0 2px rgba(12,122,95,.12);
        }

        .mi, .ActualGUMS-mi{ font-family:'Material Icons'; }

        .ActualGUMS-btn{
          height:34px;
          padding:0 14px;
          display:inline-flex;
          align-items:center;
          gap:8px;
          border:0 !important;
          border-radius:9999px;
          background:var(--ActualGUMS-btn-accent, var(--ActualGUMS-green)) !important;
          color:#fff !important;
          box-shadow:0 1px 2px rgba(0,0,0,.12);
          font-weight:700;
          cursor:pointer;
          user-select:none;
          white-space:nowrap;
        }
        .ActualGUMS-btn:hover{ filter:brightness(.98); }
        .ActualGUMS-btn:active{ transform:translateY(1px); }
        .ActualGUMS-btn[disabled]{ opacity:.65; cursor:not-allowed; transform:none; }
        .ActualGUMS-btn .glyphicon{ color:#fff !important; top:0; }
        .ActualGUMS-btn-count{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-width:22px;
          height:22px;
          padding:0 7px;
          border-radius:9999px;
          background:rgba(255,255,255,.22);
          color:#fff !important;
          font-weight:800;
          font-size:11px;
          line-height:22px;
        }
        `,
        'ActualGUMSThemeBase'
      );
    });

    const ensureMaterialIcons = Core.once(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      document.head.appendChild(link);
    });

    return { ensureBaseTheme, ensureMaterialIcons };
  })();

  const PageAdvisorDashboard = (() => {
    const CFG = { TABLE_ID: 'ctl00_MainContainer_GvStudentList' };

    const H = (() => {
      const getTable = () => document.getElementById(CFG.TABLE_ID) || Core.q('#' + CFG.TABLE_ID);

      const isVisibleRow = (r) => {
        if (!r) return false;
        if (r.style && r.style.display === 'none') return false;
        const cs = getComputedStyle(r);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        return true;
      };

      const flashCopied = (btn, ok) => {
        const LABEL_DEFAULT = 'Copy Students Info';
        const textEl = btn?.querySelector?.('.ActualGUMS-btn-text');
        if (!btn || !textEl) return;
        textEl.textContent = ok ? 'Copied' : 'Copy Failed';
        clearTimeout(btn._ActualGUMSFlashT);
        btn._ActualGUMSFlashT = setTimeout(() => {
          const t = btn.querySelector?.('.ActualGUMS-btn-text');
          if (t) t.textContent = LABEL_DEFAULT;
        }, 900);
      };

      const emitTableChanged = () => {
        try { document.dispatchEvent(new Event('ActualGUMS:adv:tableChanged')); } catch { }
      };

      return { getTable, isVisibleRow, flashCopied, emitTableChanged };
    })();

    const featureCopyStudentsInfo = (() => {
      const UI = {
        SEP: '\t',
        BTN_ID: 'ActualGUMSCopyStudentInfoBtn',
        WRAP_ID: 'ActualGUMSCopyWrap',
        POPOVER_ID: 'ActualGUMSCopyColsPopover',
        BAR_ATTR: 'data-ActualGUMS-bar',
        COUNT_ID: 'ctl00_MainContainer_lblCount',
        CSS_ID: 'ActualGUMSAdvCopyCSS',
        PREF_KEY: 'ActualGUMS:adv:copyCols:v2',
      };

      const getRows = (tbl) =>
        Array.from(tbl.querySelectorAll('tbody tr'))
          .filter(r => r.classList.contains('hoverable') && r.querySelector('td') && H.isVisibleRow(r));

      const getHeadRow = (tbl) =>
        tbl.querySelector('thead tr') ||
        tbl.querySelector('tr:first-child') ||
        null;

      const colLabel = (th, i) => {
        const t = Core.normalizeWS(th?.textContent || '');
        return t || `Col ${i + 1}`;
      };

      const getColumnMeta = (tbl) => {
        const head = getHeadRow(tbl);
        const ths = head ? Array.from(head.children).filter(n => n.tagName === 'TH' || n.tagName === 'TD') : [];
        return ths.map((th, i) => ({ idx: i, label: colLabel(th, i) }));
      };

      const loadSelectedIdx = () => {
        try {
          const raw = localStorage.getItem(UI.PREF_KEY);
          const arr = JSON.parse(raw || '[]');
          return Array.isArray(arr) ? new Set(arr.map(Number).filter(Number.isFinite)) : new Set();
        } catch {
          return new Set();
        }
      };

      const saveSelectedIdx = (set) => {
        try { localStorage.setItem(UI.PREF_KEY, JSON.stringify([...set])); } catch { }
      };

      const ensureStyles = () => {
        Core.injectCSSOnce(
          `
          [${UI.BAR_ATTR}="1"]{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:nowrap}
          @media (max-width:768px){[${UI.BAR_ATTR}="1"]{flex-wrap:wrap}}

          #${UI.WRAP_ID}{display:flex;align-items:center;gap:8px;margin-left:auto;position:relative}

          .ActualGUMS-btn{
            height:32px;
            padding:0 10px;
            border-radius:9999px;
            font-size:16px;
            font-weight:800;
            line-height:1;
            border:1px solid rgba(0,0,0,.12);
            background:var(--ActualGUMS-btn-accent, #3b7f8f);
            color:#fff;
            display:inline-flex;
            align-items:center;
            gap:8px;
            cursor:pointer;
            user-select:none;
          }
          .ActualGUMS-btn:disabled{opacity:.55;cursor:not-allowed}
          .ActualGUMS-btn .glyphicon{font-size:16px}
          .ActualGUMS-btn .ActualGUMS-btn-text{font-size:16px}
          .ActualGUMS-btn .ActualGUMS-btn-count{
            height:20px;min-width:20px;
            padding:0 6px;
            font-size:12px;
            border-radius:999px;
            display:inline-flex;align-items:center;justify-content:center;
            background:rgba(255,255,255,.16);
            border:1px solid rgba(255,255,255,.25);
          }

          .ActualGUMS-btn .ActualGUMS-btn-gear{
            margin-left:8px;
            padding-left:10px;
            height:100%;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            border-left:1px solid rgba(255,255,255,.35);
            cursor:pointer;
            user-select:none;
          }
          .ActualGUMS-btn .ActualGUMS-btn-gear .glyphicon{font-size:16px}
          .ActualGUMS-btn .ActualGUMS-btn-gear:hover{filter:brightness(.98)}
          .ActualGUMS-btn .ActualGUMS-btn-gear:active{transform:translateY(1px)}

          #${UI.POPOVER_ID}{
            position:absolute;right:0;top:38px;z-index:99999;
            width:270px;max-width:min(320px, 92vw);
            border:1px solid rgba(0,0,0,.12);
            border-radius:12px;background:#fff;
            box-shadow:0 14px 30px rgba(0,0,0,.14);
            padding:10px 10px 8px;
            display:none;
            font:13px/1.25 "Segoe UI",system-ui,sans-serif;
            color:#111827;
          }
          #${UI.POPOVER_ID}[data-open="1"]{display:block}
          #${UI.POPOVER_ID} .title{font-weight:900;margin:0 0 8px;color:var(--ActualGUMS-green)}
          #${UI.POPOVER_ID} [data-cols="1"]{max-height:140px;overflow:auto;padding-right:6px}
          #${UI.POPOVER_ID} .ActualGUMS-col-row{display:flex;align-items:center;gap:8px;height:28px;margin:0}
          #${UI.POPOVER_ID} .ActualGUMS-col-row label{cursor:pointer;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px}
          #${UI.POPOVER_ID} .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
          #${UI.POPOVER_ID} button{
            border-radius:999px;border:1px solid rgba(0,0,0,.12);
            background:#fff;padding:6px 10px;cursor:pointer;font-weight:800
          }
          #${UI.POPOVER_ID} button.primary{
            border-color:rgba(12,122,95,.25);color:#fff;background:var(--ActualGUMS-green);
          }
          `,
          UI.CSS_ID
        );
      };

      const getHeaderBar = () => {
        const label = document.getElementById(UI.COUNT_ID);
        if (!label) return null;
        const bar = label.parentElement;
        if (!bar) return null;
        bar.setAttribute(UI.BAR_ATTR, '1');
        return bar;
      };

      const ensureDefaultCols = (tbl) => {
        let sel = loadSelectedIdx();
        if (sel.size) return sel;

        const cols = getColumnMeta(tbl);
        const wanted = ['id', 'name', 'email', 'phone'];
        cols.forEach(c => {
          const k = c.label.toLowerCase();
          if (wanted.some(w => k === w || k.includes(w))) sel.add(c.idx);
        });
        if (!sel.size) cols.forEach(c => sel.add(c.idx));
        saveSelectedIdx(sel);
        return sel;
      };

      const buildPayload = (tbl, { withHeader = false } = {}) => {
        const cols = getColumnMeta(tbl);
        const sel = ensureDefaultCols(tbl);

        const selected = cols.filter(c => sel.has(c.idx)).sort((a, b) => a.idx - b.idx);
        if (!selected.length) return '';

        const headLine = selected.map(c => c.label).join(UI.SEP);
        const lines = getRows(tbl).map(tr => {
          const vals = selected.map(c => {
            const raw = tr.cells?.[c.idx]?.innerText || '';
            const isPhone = /phone/i.test(c.label || '');
            return isPhone ? Core.normalizeBDPhone(raw) : Core.normalizeWS(raw);
          });
          return vals.join(UI.SEP);
        });

        return (withHeader ? headLine + '\n' : '') + lines.join('\n');
      };

      const ensurePopover = (wrap, tbl) => {
        let pop = document.getElementById(UI.POPOVER_ID);
        if (pop) return pop;

        pop = document.createElement('div');
        pop.id = UI.POPOVER_ID;
        pop.dataset.open = '0';
        pop.style.display = 'none';
        pop.innerHTML = `
          <div class="title">Select columns to copy</div>
          <div data-cols="1"></div>
          <div class="actions">
            <button type="button" data-none="1">None</button>
            <button type="button" data-all="1">All</button>
            <button type="button" class="primary" data-close="1">Done</button>
          </div>
        `;
        wrap.appendChild(pop);

        const render = () => {
          const cols = getColumnMeta(tbl);
          const sel = ensureDefaultCols(tbl);
          const host = pop.querySelector('[data-cols="1"]');
          host.innerHTML = '';

          cols.forEach(c => {
            const row = document.createElement('div');
            row.className = 'ActualGUMS-col-row';
            const id = `ActualGUMSCopyCol_${c.idx}`;
            row.innerHTML = `
              <input type="checkbox" id="${id}" ${sel.has(c.idx) ? 'checked' : ''}>
              <label for="${id}">${c.label}</label>
            `;
            const cb = row.querySelector('input');
            cb.addEventListener('change', () => {
              const now = ensureDefaultCols(tbl);
              if (cb.checked) now.add(c.idx);
              else now.delete(c.idx);
              saveSelectedIdx(now);
            });
            host.appendChild(row);
          });
        };

        pop._render = render;
        render();

        pop.querySelector('[data-all="1"]').addEventListener('click', () => {
          const cols = getColumnMeta(tbl);
          const s = new Set(cols.map(c => c.idx));
          saveSelectedIdx(s);
          pop._render();
        });

        pop.querySelector('[data-none="1"]').addEventListener('click', () => {
          saveSelectedIdx(new Set());
          pop._render();
        });

        pop.querySelector('[data-close="1"]').addEventListener('click', () => {
          pop.dataset.open = '0';
          pop.style.display = 'none';
        });

        document.addEventListener('mousedown', (e) => {
          if (pop.dataset.open !== '1') return;
          if (pop.contains(e.target)) return;
          const btn = document.getElementById(UI.BTN_ID);
          if (btn && btn.contains(e.target)) return;
          pop.dataset.open = '0';
          pop.style.display = 'none';
        });

        document.addEventListener('keydown', (e) => {
          if (e.key !== 'Escape') return;
          if (pop.dataset.open !== '1') return;
          pop.dataset.open = '0';
          pop.style.display = 'none';
        });

        return pop;
      };

      const togglePopover = (pop) => {
        if (!pop) return;
        pop._render && pop._render();
        const open = pop.dataset.open === '1' ? '0' : '1';
        pop.dataset.open = open;
        pop.style.display = open === '1' ? 'block' : 'none';
      };

      const refresh = () => {
        const btn = document.getElementById(UI.BTN_ID);
        const tbl = H.getTable();
        if (!btn || !tbl) return;

        const count = getRows(tbl).length;

        const accent = 'var(--ActualGUMS-action, #3b7f8f)';
        btn.className = 'ActualGUMS-btn';
        btn.style.setProperty('--ActualGUMS-btn-accent', accent);

        btn.disabled = count === 0;

        btn.innerHTML = `
          <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
          <span class="ActualGUMS-btn-text">Copy Students Info</span>
          <span class="ActualGUMS-btn-count">${count}</span>
          <span class="ActualGUMS-btn-gear" data-gear="1" title="Choose columns">
            <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
          </span>
        `;

        btn.title = count === 0 ? 'No visible students to copy' : 'Click to copy selected columns';
      };

      const ensure = () => { ensureStyles(); };

      const mount = () => {
        const bar = getHeaderBar();
        if (!bar) return;

        const tbl = H.getTable();
        if (!tbl) return;

        if (document.getElementById(UI.BTN_ID)) return;

        const wrap = document.createElement('span');
        wrap.id = UI.WRAP_ID;
        bar.appendChild(wrap);

        const btn = document.createElement('button');
        btn.id = UI.BTN_ID;
        btn.type = 'button';
        wrap.appendChild(btn);

        ensurePopover(wrap, tbl);
      };

      const bind = () => {
        const btn = document.getElementById(UI.BTN_ID);
        if (!btn || btn._ActualGUMSBound) return;
        btn._ActualGUMSBound = true;

        btn.addEventListener('click', async (e) => {
          const t = H.getTable();
          if (!t) return;

          const pop = document.getElementById(UI.POPOVER_ID);

          if (e.target && e.target.closest && e.target.closest('[data-gear="1"]')) {
            e.preventDefault();
            e.stopPropagation();
            if (pop) togglePopover(pop);
            return;
          }

          const rowsCount = getRows(t).length;
          if (rowsCount === 0) return;

          const text = buildPayload(t, { withHeader: e.shiftKey });
          if (!text) return;

          if (pop) { pop.dataset.open = '0'; pop.style.display = 'none'; }

          const ok = await Core.copyText(text);
          H.flashCopied(btn, ok);
        });

        if (!document.documentElement._ActualGUMSCopyInfoSync) {
          document.documentElement._ActualGUMSCopyInfoSync = true;

          document.addEventListener('ActualGUMS:adv:tableChanged', () => refresh());

          document.addEventListener('input', (e) => {
            if (e && e.target && e.target.id === 'myInput') setTimeout(refresh, 0);
          }, true);
        }
      };

      const sync = () => {
        if (!document.getElementById(UI.BTN_ID)) mount();
        bind();
        refresh();
      };

      const run = () => { ensure(); sync(); };
      return { run, refresh };
    })();

    const featureEnhancedSearch = (() => {
      const UP5_ID = 'ctl00_MainContainer_UpdatePanel5';
      const SEARCH_WRAP_ID = 'ctl00_MainContainer_DivSearch';
      const SEARCH_INPUT_ID = 'myInput';

      const SEARCH_BOX_ID = 'ActualGUMSAdvSearchBox';
      const CLEAR_BTN_ID = 'ActualGUMSAdvSearchClear';
      const CSS_ID = 'ActualGUMSAdvSearchClearCSS';

      const GRID_ROWS_SEL = `#${CFG.TABLE_ID} tbody tr.hoverable`;
      const HIDE_SEL = '#ctl00_MainContainer_DivAdvisorPanel,#ctl00_MainContainer_UpdatePanel02';

      const STORE = {
        KEY: 'ActualGUMS:adv:searchTerm',
        get() { try { return sessionStorage.getItem(this.KEY) || ''; } catch { return ''; } },
        set(v) { try { sessionStorage.setItem(this.KEY, v || ''); } catch { } },
      };

      const ensureStyles = () => {
        Core.injectCSSOnce(
          `
          #${SEARCH_BOX_ID}{position:relative;width:100%}
          #${SEARCH_BOX_ID} #${SEARCH_INPUT_ID}{padding-right:44px}

          #${CLEAR_BTN_ID}{
            position:absolute;right:8px;top:50%;
            transform:translateY(-50%);
            width:28px;height:28px;
            display:none;align-items:center;justify-content:center;
            border-radius:9999px;
            border:1px solid rgba(0,0,0,.15);
            background:#fff;
            color: var(--ActualGUMS-red, #dc2626) !important;
            cursor:pointer;
            user-select:none;
            z-index:2;
            font:800 18px/1 "Segoe UI",system-ui,sans-serif;
          }
          #${SEARCH_BOX_ID}[data-has="1"] #${CLEAR_BTN_ID}{display:flex}
          #${CLEAR_BTN_ID}:hover{filter:brightness(.98); color: var(--ActualGUMS-red, #b91c1c) !important;}
          #${CLEAR_BTN_ID}:active{transform:translateY(-50%) scale(.98); color: var(--ActualGUMS-red, #991b1b) !important;}
          `,
          CSS_ID
        );
      };

      const applyRowVisibility = (tr) => {
        const byFilter = tr._ActualGUMSByFilter === 1;
        const bySearch = tr._ActualGUMSBySearch === 1;
        tr.style.display = (byFilter || bySearch) ? 'none' : '';
      };

      const fallbackFilter = (q) => {
        const term = (q || '').trim().toLowerCase();
        document.querySelectorAll(GRID_ROWS_SEL).forEach(tr => {
          const match = !term || tr.textContent.toLowerCase().includes(term);
          tr._ActualGUMSBySearch = match ? 0 : 1;
          applyRowVisibility(tr);
        });
      };

      const runSearch = (q) => {
        if (typeof window.Search === 'function') {
          try { window.Search(q); } catch { }
        }
        fallbackFilter(q);
      };

      const buildSearchCol = () => {
        const wrap = document.createElement('div');
        wrap.id = SEARCH_WRAP_ID;
        wrap.className = 'col-lg-9 col-md-8 col-sm-12';
        wrap.style.marginTop = '10px';
        wrap.innerHTML = `
          <div id="${SEARCH_BOX_ID}" data-has="0">
            <input type="text" class="form-control" id="${SEARCH_INPUT_ID}"
                   placeholder="🔎 Search students..." title="Type something"
                   style="height:38px;width:100%;">
            <button type="button" id="${CLEAR_BTN_ID}" aria-label="Clear search" title="Clear">×</button>
          </div>
        `;
        return wrap;
      };

      const findTitleCol = (up5) => {
        const cols = Array.from(up5.children).filter(el =>
          el.classList && (el.classList.contains('col-lg-6') || el.classList.contains('col-sm-12'))
        );
        return cols.find(el => /Advisor\s+Dashboard/i.test(el.textContent)) || cols[0] || null;
      };

      const ensureSearchAlive = () => {
        const up5 = document.getElementById(UP5_ID);
        if (!up5) return;

        ensureStyles();

        const titleCol = findTitleCol(up5);
        if (titleCol) {
          ['col-lg-6', 'col-md-6', 'col-sm-6'].forEach(c => titleCol.classList.remove(c));
          titleCol.classList.add('col-lg-3', 'col-md-4', 'col-sm-12');
        }

        let wrap = document.getElementById(SEARCH_WRAP_ID);
        if (!wrap) {
          wrap = buildSearchCol();
          if (titleCol && titleCol.nextSibling) up5.insertBefore(wrap, titleCol.nextSibling);
          else up5.appendChild(wrap);
        } else {
          wrap.className = 'col-lg-9 col-md-8 col-sm-12';
          wrap.style.marginTop = '10px';

          let box = wrap.querySelector('#' + SEARCH_BOX_ID);
          if (!box) {
            box = document.createElement('div');
            box.id = SEARCH_BOX_ID;
            box.dataset.has = '0';
            wrap.prepend(box);
          }
          Array.from(wrap.children).forEach(ch => { if (ch !== box) ch.remove(); });

          let input = box.querySelector('#' + SEARCH_INPUT_ID);
          if (!input) {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = SEARCH_INPUT_ID;
            box.appendChild(input);
          }

          let clearBtn = box.querySelector('#' + CLEAR_BTN_ID);
          if (!clearBtn) {
            clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.id = CLEAR_BTN_ID;
            clearBtn.setAttribute('aria-label', 'Clear search');
            clearBtn.title = 'Clear';
            clearBtn.textContent = '×';
            box.appendChild(clearBtn);
          }

          Array.from(box.children).forEach(ch => { if (ch !== input && ch !== clearBtn) ch.remove(); });
        }

        const box = wrap.querySelector('#' + SEARCH_BOX_ID);
        const input = box ? box.querySelector('#' + SEARCH_INPUT_ID) : null;
        const clearBtn = box ? box.querySelector('#' + CLEAR_BTN_ID) : null;
        if (!box || !input || !clearBtn) return;

        input.placeholder = '🔎 Search students...';
        input.style.height = '38px';
        input.style.width = '100%';
        input.title = 'Type something';

        const syncClearUI = () => {
          box.dataset.has = ((input.value || '').trim().length > 0) ? '1' : '0';
        };

        if (!input._ActualGUMSRestored) {
          input._ActualGUMSRestored = true;
          const saved = STORE.get();
          if (saved) {
            input.value = saved;
            runSearch(saved);
          }
        }

        if (!input._ActualGUMSBound) {
          input._ActualGUMSBound = true;
          const handler = () => {
            const val = input.value || '';
            STORE.set(val);
            runSearch(val);
            syncClearUI();
          };
          input.addEventListener('input', handler);
          input.addEventListener('keyup', handler);
        }

        if (!clearBtn._ActualGUMSBound) {
          clearBtn._ActualGUMSBound = true;
          clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!input.value) return;
            input.value = '';
            try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch { }
            input.focus();
          });
        }

        syncClearUI();
      };

      const hideAdvisorPanel = () => {
        document.querySelectorAll(HIDE_SEL).forEach(el => el && (el.style.display = 'none'));
      };

      const hookUpdatePanel = () => {
        try {
          const prm = Core.getPRM();
          if (prm && !prm._ActualGUMSRestoreSearch) {
            prm._ActualGUMSRestoreSearch = true;
            prm.add_endRequest(() => { ensureSearchAlive(); hideAdvisorPanel(); });
          }
        } catch { }
      };

      const observeDom = () => {
        if (document.documentElement._ActualGUMSAdvSearchObs) return;
        document.documentElement._ActualGUMSAdvSearchObs = true;
        new MutationObserver(Core.rafThrottle(() => { ensureSearchAlive(); hideAdvisorPanel(); }))
          .observe(document.documentElement, { childList: true, subtree: true });
      };

      const ensure = () => { ensureStyles(); };
      const mount = () => { ensureSearchAlive(); hideAdvisorPanel(); };
      const bind = () => { hookUpdatePanel(); observeDom(); };
      const sync = () => { ensureSearchAlive(); hideAdvisorPanel(); };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureEnhancedFilters = (() => {
      const COLUMN_LABELS = {
        si: 'SN', status: 'Status', id: 'ID', name: 'Name',
        finalReg: 'Confirmation', phone: 'Phone', email: 'Email',
        regStatus: 'Registration', regDate: 'Date', regCredit: 'Registered',
        gpa: 'GPA', cgpa: 'CGPA', completedCredit: 'Completed',
        openPreReg: 'PreRegistration', registration: 'Registration',
        result: 'Result', billHistory: 'Bill History'
      };

      const KEY_STATUS = 'ActualGUMSFilterMode_status';
      const KEY_FINAL = 'ActualGUMSFilterMode_final';
      const KEY_REGSTATE = 'ActualGUMSFilterMode_regstate';

      let modeStatus = (() => { try { return localStorage.getItem(KEY_STATUS) || 'all'; } catch { return 'all'; } })();
      let modeFinal = (() => { try { return localStorage.getItem(KEY_FINAL) || 'all'; } catch { return 'all'; } })();
      let modeRegState = (() => { try { return localStorage.getItem(KEY_REGSTATE) || 'all'; } catch { return 'all'; } })();

      const text = (el) => (el?.textContent || '').trim();

      const getRowsAll = () => {
        const t = H.getTable();
        return t ? Core.qa('tr.hoverable', t) : [];
      };

      const getVisibleRows = () => getRowsAll().filter(H.isVisibleRow);

      const getColIdx = () => {
        const tbl = H.getTable();
        const heads = tbl ? Core.qa('tr:first-child th', tbl) : [];
        const find = (re, fallback) => {
          for (let i = 0; i < heads.length; i++) {
            const L = Core.normalizeWS(heads[i].textContent);
            if (re.test(L)) return i;
          }
          return fallback;
        };
        return {
          si: find(/^(SI\.?|SN)$/i, 0),
          status: find(/^(?:Students?\s*)?Status$/i, 1),
          id: find(/^(?:Students?\s*)?ID\b/i, 2),
          name: find(/^(?:Students?\s*)?Name$/i, 3),
          finalReg: find(/(?:Student\s*)?Final\s*Reg|Reg\.?\s*Confirm|Confirmation/i, 4),
          phone: find(/^(?:Students?\s*)?Phone$/i, 5),
          email: find(/^(?:Students?\s*)?Email$/i, 6),
          regStatus: find(/^Registration\s*Status$|^Registration$/i, 7),
          regDate: find(/Registration\s*(?:Done\s*)?Date|Reg\.?\s*Date|^Date$/i, 8),
          regCredit: find(/Registered\s*Credit|^Registered$/i, 9),
          gpa: find(/^GPA\b/i, 10),
          cgpa: find(/^CGPA\b/i, 11),
          completedCredit: find(/Completed\s*Credit|^Completed$/i, 12),
          openPreReg: find(/Open\s*(?:And|&)\s*Pre\.?Reg|Pre\s*Registration|PreReg/i, 13),
          registration: find(/^Registration$/i, 14),
          result: find(/^Result$/i, 15),
          billHistory: find(/Bill\s*History/i, 16)
        };
      };

      const setHeaderLabel = (th, newLabel) => {
        if (!th || newLabel == null) return;

        const strong = th.querySelector('a strong') || th.querySelector('strong');
        const icon = th.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';

        if (strong) { strong.innerHTML = iconHTML ? `${newLabel}&nbsp;${iconHTML}` : newLabel; return; }

        const a = th.querySelector('a');
        if (a) {
          const i = a.querySelector('i');
          if (i) {
            const iHTML = i.outerHTML;
            i.remove();
            a.innerHTML = `${newLabel}&nbsp;${iHTML}`;
          } else a.textContent = newLabel;
          return;
        }

        th.textContent = newLabel;
      };

      const renameHeaders = () => {
        const tbl = H.getTable();
        if (!tbl) return;

        const heads = Core.qa('tr:first-child th', tbl);
        const idx = getColIdx();

        setHeaderLabel(heads[idx.si], COLUMN_LABELS.si);
        setHeaderLabel(heads[idx.status], COLUMN_LABELS.status);
        setHeaderLabel(heads[idx.id], COLUMN_LABELS.id);
        setHeaderLabel(heads[idx.name], COLUMN_LABELS.name);
        setHeaderLabel(heads[idx.finalReg], COLUMN_LABELS.finalReg);
        setHeaderLabel(heads[idx.phone], COLUMN_LABELS.phone);
        setHeaderLabel(heads[idx.email], COLUMN_LABELS.email);
        setHeaderLabel(heads[idx.regStatus], COLUMN_LABELS.regStatus);
        setHeaderLabel(heads[idx.regDate], COLUMN_LABELS.regDate);
        setHeaderLabel(heads[idx.regCredit], COLUMN_LABELS.regCredit);
        setHeaderLabel(heads[idx.gpa], COLUMN_LABELS.gpa);
        setHeaderLabel(heads[idx.cgpa], COLUMN_LABELS.cgpa);
        setHeaderLabel(heads[idx.completedCredit], COLUMN_LABELS.completedCredit);
        setHeaderLabel(heads[idx.openPreReg], COLUMN_LABELS.openPreReg);
        setHeaderLabel(heads[idx.registration], COLUMN_LABELS.registration);
        setHeaderLabel(heads[idx.result], COLUMN_LABELS.result);
        setHeaderLabel(heads[idx.billHistory], COLUMN_LABELS.billHistory);
      };

      const ensureStyles = () => {
        Core.injectCSSOnce(
          `
          #${CFG.TABLE_ID} th{padding:6px 8px!important;vertical-align:top!important;text-align:center!important;font-weight:700!important;font-size:12.5px!important;white-space:nowrap}
          #${CFG.TABLE_ID} th>a,#${CFG.TABLE_ID} th>strong{display:flex;align-items:center;justify-content:center;gap:6px;line-height:1.1}
          #${CFG.TABLE_ID} th .ActualGUMS-seg3-wrap{margin-top:4px}
          #${CFG.TABLE_ID} td{text-align:center;vertical-align:middle}
          #${CFG.TABLE_ID} td.ActualGUMS-td-left{text-align:left!important}

          #${CFG.TABLE_ID} th.ActualGUMS-w-xs,#${CFG.TABLE_ID} td.ActualGUMS-w-xs{width:44px;min-width:44px;max-width:60px}
          #${CFG.TABLE_ID} th.ActualGUMS-w-s,#${CFG.TABLE_ID} td.ActualGUMS-w-s{width:90px;min-width:80px;max-width:120px}
          #${CFG.TABLE_ID} th.ActualGUMS-w-m,#${CFG.TABLE_ID} td.ActualGUMS-w-m{width:120px;min-width:100px;max-width:160px}
          #${CFG.TABLE_ID} th.ActualGUMS-w-l,#${CFG.TABLE_ID} td.ActualGUMS-w-l{width:220px;min-width:180px;max-width:320px}
          #${CFG.TABLE_ID} th.ActualGUMS-w-num,#${CFG.TABLE_ID} td.ActualGUMS-w-num{width:70px;min-width:64px;max-width:90px;text-align:center}

          #${CFG.TABLE_ID}{--ActualGUMS-zebra-even:transparent;--ActualGUMS-zebra-odd:transparent}
          #${CFG.TABLE_ID} tr.hoverable.ActualGUMS-even>td{background-color:var(--ActualGUMS-zebra-even)!important}
          #${CFG.TABLE_ID} tr.hoverable.ActualGUMS-odd>td{background-color:var(--ActualGUMS-zebra-odd)!important}

          #${CFG.TABLE_ID} tr.hoverable{transition:filter .12s ease}
          #${CFG.TABLE_ID} tr.hoverable:hover{filter:brightness(.97)!important}

          .ActualGUMS-seg3-wrap{display:flex;justify-content:center}
          .ActualGUMS-seg3{--accent:var(--ActualGUMS-accent,rgb(47,111,169));--w:114px;--h:20px;position:relative;width:var(--w);height:var(--h);background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.35);border-radius:9999px;user-select:none;cursor:pointer}
          .ActualGUMS-narrow .ActualGUMS-seg3{--w:88px;--h:18px}
          .ActualGUMS-seg3 .knob{position:absolute;top:1px;left:1px;width:calc(33.333% - 2px);height:calc(100% - 2px);background:#fff;border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.22);transition:left .18s ease;z-index:0}
          .ActualGUMS-ico{position:absolute;top:50%;transform:translateY(-50%);width:11px;height:11px;z-index:1;color:rgba(255,255,255,.95)}
          .ActualGUMS-ico svg{display:block;width:100%;height:100%;fill:currentColor}
          .ActualGUMS-ico.left{left:10px}
          .ActualGUMS-ico.mid{left:50%;transform:translate(-50%,-50%)}
          .ActualGUMS-ico.right{right:10px}
          .ActualGUMS-seg3[data-pos="0"] .knob{left:1px}
          .ActualGUMS-seg3[data-pos="1"] .knob{left:calc(33.333% + 1px)}
          .ActualGUMS-seg3[data-pos="2"] .knob{left:calc(66.666% + 1px)}
          #${CFG.TABLE_ID} tr.hoverable:hover > td{font-weight:800!important}
          #${CFG.TABLE_ID} tr.hoverable:hover td *{font-weight:inherit!important}
          `,
          'ActualGUMSAdvFiltersCSS'
        );
      };

      const markLeftAlignedCells = () => {
        const idx = getColIdx();
        const left = [idx.name, idx.phone, idx.email].filter(i => i != null);
        for (const tr of getRowsAll()) left.forEach(ci => tr.cells?.[ci]?.classList.add('ActualGUMS-td-left'));
      };

      const applyColumnWidths = () => {
        const idx = getColIdx();
        const tbl = H.getTable();
        if (!tbl) return;

        const head = tbl.querySelector('tr:first-child');
        const rows = getRowsAll();

        const map = [
          [idx.si, 'ActualGUMS-w-xs'],
          [idx.status, 'ActualGUMS-w-s ActualGUMS-narrow'],
          [idx.id, 'ActualGUMS-w-s'],
          [idx.name, 'ActualGUMS-w-l'],
          [idx.finalReg, 'ActualGUMS-w-s ActualGUMS-narrow'],
          [idx.phone, 'ActualGUMS-w-m'],
          [idx.email, 'ActualGUMS-w-l'],
          [idx.regStatus, 'ActualGUMS-w-m ActualGUMS-narrow'],
          [idx.regDate, 'ActualGUMS-w-m'],
          [idx.regCredit, 'ActualGUMS-w-s'],
          [idx.gpa, 'ActualGUMS-w-num'],
          [idx.cgpa, 'ActualGUMS-w-num'],
          [idx.completedCredit, 'ActualGUMS-w-m']
        ];

        for (const [i, cls] of map) {
          if (i == null) continue;
          const classes = cls.split(/\s+/);
          if (head?.children[i]) head.children[i].classList.add(...classes);
          rows.forEach(tr => tr.cells?.[i]?.classList.add(...classes));
        }
      };

      let zebraPalette = null;

      const normalizeColor = (c) => {
        const x = (c || '').trim().toLowerCase();
        if (!x) return '';
        if (x === 'transparent' || x === 'rgba(0, 0, 0, 0)') return '';
        return x.replace(/\s+/g, '');
      };

      const rowBg = (tr) => {
        if (!tr) return '';
        const td = tr.cells?.[0] || tr.querySelector?.('td') || tr;
        const c1 = normalizeColor(getComputedStyle(td).backgroundColor);
        if (c1) return c1;
        return normalizeColor(getComputedStyle(tr).backgroundColor);
      };

      const pickPalette = (allRows) => {
        const freq = new Map();
        for (const tr of (allRows || [])) {
          const c = rowBg(tr);
          if (!c) continue;
          freq.set(c, (freq.get(c) || 0) + 1);
        }
        const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
        if (ranked.length === 0) return null;
        if (ranked.length === 1) return [ranked[0], ranked[0]];
        return [ranked[0], ranked[1]];
      };

      const clearZebra = () => {
        for (const tr of getRowsAll()) tr.classList.remove('ActualGUMS-even', 'ActualGUMS-odd');
      };

      const applyZebra = () => {
        const tbl = H.getTable();
        if (!tbl) return;

        const all = getRowsAll();
        const vis = getVisibleRows();

        const anyHidden = all.some(r => !H.isVisibleRow(r));
        if (!anyHidden) {
          clearZebra();
          return;
        }

        if (!zebraPalette) zebraPalette = pickPalette(all);

        if (zebraPalette) {
          tbl.style.setProperty('--ActualGUMS-zebra-even', zebraPalette[0]);
          tbl.style.setProperty('--ActualGUMS-zebra-odd', zebraPalette[1]);
        }

        clearZebra();
        let odd = false;
        for (const tr of vis) {
          tr.classList.add(odd ? 'ActualGUMS-odd' : 'ActualGUMS-even');
          odd = !odd;
        }
      };

      const buildSeg3 = (th, idSuffix, pos, icons, setMode) => {
        const q = (sel, root) => Core.q(sel, root || document);
        if (!th || q(`#ActualGUMS-seg3-${idSuffix}`, th)) return;

        const thBg = getComputedStyle(th).backgroundColor || 'rgb(47,111,169)';

        const labels =
          idSuffix === 'status'
            ? { left: 'All', mid: 'Active', right: 'Inactive' }
            : idSuffix === 'final'
              ? { left: 'All', mid: 'Yes', right: 'No' }
              : { left: 'All', mid: 'Done', right: 'Pending' };

        const wrap = document.createElement('div');
        wrap.className = 'ActualGUMS-seg3-wrap';
        wrap.innerHTML = `
          <div id="ActualGUMS-seg3-${idSuffix}" class="ActualGUMS-seg3" data-pos="${pos}" tabindex="0"
               title="${labels.left} • ${labels.mid} • ${labels.right}"
               aria-label="${labels.left}, ${labels.mid}, ${labels.right}">
            <span class="knob"></span>
            <span class="ActualGUMS-ico left"  title="${labels.left}"  aria-label="${labels.left}">${icons.left}</span>
            <span class="ActualGUMS-ico mid"   title="${labels.mid}"   aria-label="${labels.mid}">${icons.mid}</span>
            <span class="ActualGUMS-ico right" title="${labels.right}" aria-label="${labels.right}">${icons.right}</span>
          </div>
        `;
        th.appendChild(wrap);

        const seg = q(`#ActualGUMS-seg3-${idSuffix}`, wrap);
        seg.style.setProperty('--ActualGUMS-accent', thBg);

        const paint = () => {
          const s = seg.getAttribute('data-pos');
          const L = q('.ActualGUMS-ico.left', seg), M = q('.ActualGUMS-ico.mid', seg), R = q('.ActualGUMS-ico.right', seg);
          [L, M, R].forEach(x => x && (x.style.color = 'rgba(255,255,255,.95)'));
          const tgt = (s === '0' ? L : s === '1' ? M : R);
          if (tgt) tgt.style.color = 'var(--accent)';
        };
        paint();

        seg.addEventListener('click', (e) => {
          const r = seg.getBoundingClientRect();
          const x = e.clientX - r.left;
          const np = x < r.width / 3 ? 0 : (x < 2 * r.width / 3 ? 1 : 2);
          seg.setAttribute('data-pos', String(np));
          paint();
          setMode(np);
        });

        seg.addEventListener('keydown', (e) => {
          let cur = +seg.getAttribute('data-pos');
          if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cur = (cur + 1) % 3; }
          if (e.key === 'ArrowLeft') { e.preventDefault(); cur = (cur + 2) % 3; }
          if (e.key === '1') cur = 0;
          if (e.key === '2') cur = 1;
          if (e.key === '3') cur = 2;
          seg.setAttribute('data-pos', String(cur));
          paint();
          setMode(cur);
        });
      };

      let scheduled = false;
      let scheduledSilent = true;

      const scheduleApply = (silent = false) => {
        if (scheduled) {
          if (!silent) scheduledSilent = false;
          return;
        }
        scheduled = true;
        scheduledSilent = !!silent;

        requestAnimationFrame(() => {
          const runSilent = scheduledSilent;
          scheduled = false;
          scheduledSilent = true;
          applyAll(runSilent);
        });
      };

      const ensureHeaderFilters = () => {
        ensureStyles();

        const tbl = H.getTable();
        if (!tbl) return;

        const idx = getColIdx();
        const headRow = tbl.querySelector('tr:first-child');
        if (!headRow) return;

        const ICONS = {
          left: `<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>`,
          ok: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.7 12.3l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z"/></svg>`,
          no: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-2.9 5.5L12 10.4l2.9-2.9 1.4 1.4L13.4 11.8l2.9 2.9-1.4 1.4L12 13.2l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4z"/></svg>`,
          pend: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11H11V7h2v4h2v2h-2z"/></svg>`
        };

        buildSeg3(
          headRow.children[idx.status],
          'status',
          modeStatus === 'active' ? 1 : modeStatus === 'inactive' ? 2 : 0,
          { left: ICONS.left, mid: ICONS.ok, right: ICONS.no },
          pos => {
            modeStatus = pos === 1 ? 'active' : pos === 2 ? 'inactive' : 'all';
            try { localStorage.setItem(KEY_STATUS, modeStatus); } catch { }
            scheduleApply(false);
          }
        );

        buildSeg3(
          headRow.children[idx.finalReg],
          'final',
          modeFinal === 'yes' ? 1 : modeFinal === 'no' ? 2 : 0,
          { left: ICONS.left, mid: ICONS.ok, right: ICONS.no },
          pos => {
            modeFinal = pos === 1 ? 'yes' : pos === 2 ? 'no' : 'all';
            try { localStorage.setItem(KEY_FINAL, modeFinal); } catch { }
            scheduleApply(false);
          }
        );

        buildSeg3(
          headRow.children[idx.regStatus],
          'reg',
          modeRegState === 'done' ? 1 : modeRegState === 'pending' ? 2 : 0,
          { left: ICONS.left, mid: ICONS.ok, right: ICONS.pend },
          pos => {
            modeRegState = pos === 1 ? 'done' : pos === 2 ? 'pending' : 'all';
            try { localStorage.setItem(KEY_REGSTATE, modeRegState); } catch { }
            scheduleApply(false);
          }
        );

        renameHeaders();
      };

      const filterRows = () => {
        const idx = getColIdx();

        for (const tr of getRowsAll()) {
          const statusTxt = text(tr.cells?.[idx.status]).toLowerCase();
          const isInactive = /in-?active/.test(statusTxt);
          const isActive = /(^|\s)active(\s|$)/.test(statusTxt) && !isInactive;

          const finalTxt = text(tr.cells?.[idx.finalReg]).toLowerCase();
          const isYes = /yes/.test(finalTxt);
          const isNo = /no/.test(finalTxt);

          const regTxt = text(tr.cells?.[idx.regStatus]).toLowerCase();
          const isPending = /pending/.test(regTxt);
          const isDone = /(done|complete|completed)/.test(regTxt);

          let show = true;
          if (modeStatus === 'active') show = show && isActive;
          if (modeStatus === 'inactive') show = show && isInactive;
          if (modeFinal === 'yes') show = show && isYes;
          if (modeFinal === 'no') show = show && isNo;
          if (modeRegState === 'done') show = show && isDone;
          if (modeRegState === 'pending') show = show && isPending;

          tr._ActualGUMSByFilter = show ? 0 : 1;

          const bySearch = tr._ActualGUMSBySearch === 1;
          tr.style.display = (!show || bySearch) ? 'none' : '';
        }
      };

      const renumber = () => {
        const idx = getColIdx();
        let n = 1;
        for (const tr of getVisibleRows()) {
          const si = tr.cells?.[idx.si];
          if (si) si.innerHTML = `<b>${n++}</b>`;
        }
      };

      const updateCounts = () => {
        const idx = getColIdx();
        const rows = getVisibleRows();

        let done = 0, pending = 0, confirmed = 0;
        for (const tr of rows) {
          const regTxt = (tr.cells?.[idx.regStatus]?.textContent || '').toLowerCase();
          const finalTxt = (tr.cells?.[idx.finalReg]?.textContent || '').toLowerCase();

          if (/pending/.test(regTxt)) pending++;
          else if (/(done|complete|completed)/.test(regTxt)) done++;

          if (/yes/.test(finalTxt)) confirmed++;
        }

        const lbl = document.getElementById('ctl00_MainContainer_lblCount');
        if (lbl) lbl.textContent = `Confirmed : ${confirmed} • Pending : ${pending} • Registered : ${done} • Total : ${rows.length}`;
      };

      const hookSearchSync = () => {
        const input = document.getElementById('myInput');
        if (input && !input._ActualGUMSSyncCounts) {
          input._ActualGUMSSyncCounts = true;
          let t;
          const sync = () => {
            clearTimeout(t);
            t = setTimeout(() => {
              renumber();
              updateCounts();
              applyZebra();
            }, 60);
          };
          input.addEventListener('input', sync);
          input.addEventListener('keyup', sync);
        }
      };

      const applyAll = (silent = false) => {
        if (!H.getTable()) return;
        ensureHeaderFilters();
        filterRows();
        renumber();
        updateCounts();
        hookSearchSync();
        markLeftAlignedCells();
        applyColumnWidths();
        applyZebra();
        if (!silent) H.emitTableChanged();
      };

      const observe = () => {
        const root = document.getElementById('ctl00_MainContainer_UpdatePanel3') || document.body;
        if (root._ActualGUMSAdvObs) return;
        root._ActualGUMSAdvObs = true;
        new MutationObserver(() => scheduleApply(true)).observe(root, { childList: true, subtree: true });
      };

      const ensure = () => { ensureStyles(); };
      const mount = () => { ensureHeaderFilters(); };
      const bind = () => { observe(); hookSearchSync(); };
      const sync = () => { applyAll(false); };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const init = (flags = {}) => {
      Theme.ensureBaseTheme();

      const run = () => {
        if (flags.featureCopyStudentsInfo) featureCopyStudentsInfo.run();
        if (flags.featureEnhancedSearch) featureEnhancedSearch.run();
        if (flags.featureEnhancedFilters) featureEnhancedFilters.run();
      };

      run();

      const prm = Core.getPRM();
      if (prm && !prm._ActualGUMSAdvHooked) {
        prm._ActualGUMSAdvHooked = true;
        prm.add_endRequest(() => { run(); });
      } else {
        const tbl = H.getTable();
        if (tbl && !tbl._ActualGUMSAdvFallbackObs) {
          tbl._ActualGUMSAdvFallbackObs = true;
          new MutationObserver(Core.rafThrottle(() => {
            if (flags.featureCopyStudentsInfo) featureCopyStudentsInfo.refresh();
          })).observe(tbl, { childList: true, subtree: true });
        }
      }
    };

    return { init };
  })();

  const PageRegistrationPanel = (() => {
    const CFG = {
      IDS: {
        regTable: 'ctl00_MainContainer_gvCourseRegistration',
        popupTable: 'ctl00_MainContainer_GridViewSection',
        topStatus: 'ctl00_MainContainer_Label1',
        popupHeader: 'ctl00_MainContainer_lblSectionCourse',
        hdnPrevSection: 'ctl00_MainContainer_hdnPreviousSectionName',
        hdnPrevFormal: 'ctl00_MainContainer_hdnPreviousFormalCode',
        lblRoll: 'ctl00_MainContainer_lblRoll',
        lblBatch: 'ctl00_MainContainer_lblBatch',
        btnPrint: 'ctl00_MainContainer_btnPrint',
        btnRegistration: 'ctl00_MainContainer_btnRegistration',
        btnRegistrationConfirm: 'ctl00_MainContainer_btnRegistrationConfirm',
      },
      DAYS: ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      dayMap: { Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday' },
      LINE_RE: /^([A-Za-z]{3})\s*-\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*:?\s*([AP])M[^-]*-\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*:?\s*([AP])M.*\(([^)]*)\)/i,
      SECTION_RE: /Section\s*:\s*([0-9]{3})\s*[_-]?\s*([DE])\s*(\d{1,2})/i,
      COLORS: { GREEN: 'var(--ActualGUMS-green)', RED: 'var(--ActualGUMS-red)' },
    };

    const H = (() => {
      const safe = (v, fb) => (v && String(v).trim()) ? String(v).trim() : fb;

      const splitLinesFromHTML = (raw) => String(raw || '')
        .replace(/<br\s*\/?>/gi, '|')
        .split('|')
        .map(s => s.replace(/&nbsp;/gi, ' ').trim())
        .filter(Boolean);

      const toMin = (h, m, ap) => {
        h = +h; m = +m; ap = String(ap || '').toUpperCase();
        if (ap === 'P' && h !== 12) h += 12;
        if (ap === 'A' && h === 12) h = 0;
        return h * 60 + m;
      };

      const getSection = (nodeOrText, { compact = false } = {}) => {
        const txt = (typeof nodeOrText === 'string') ? nodeOrText : (nodeOrText?.textContent || '');
        const m = String(txt).match(CFG.SECTION_RE);
        if (!m) return '';
        const val = `${m[1]}_${m[2].toUpperCase()}${m[3]}`;
        return compact ? val.replace('_', '') : val;
      };

      const overlap = (a0, a1, b0, b1) => Math.max(0, Math.min(a1, b1) - Math.max(a0, b0)) > 0;

      const getRegTable = () =>
        document.getElementById(CFG.IDS.regTable) ||
        Core.q(`table[id$="${CFG.IDS.regTable}"]`);

      const waitForRegTable = (cb) => {
        const t = getRegTable();
        if (t) return cb(t);
        Core.waitFor(`table[id$="${CFG.IDS.regTable}"]`, () => cb(getRegTable()));
      };

      const findField = (re) => {
        const nodes = Array.from(document.querySelectorAll('span, td, th, label'));
        const lab = nodes.find(s => re.test((s.textContent || '').trim()));
        if (!lab) return null;

        const parentRow = lab.closest('tr') || lab.parentElement;
        let valueNode = null;

        if (parentRow?.tagName === 'TR') {
          const cells = Array.from(parentRow.children);
          const i = cells.findIndex(c => c.contains(lab));
          if (i >= 0) {
            for (let j = i + 1; j < cells.length; j++) {
              const txt = (cells[j].textContent || '').trim();
              if (txt) { valueNode = cells[j]; break; }
            }
          }
        }

        if (!valueNode) {
          let n = lab.nextElementSibling;
          while (n && !(n.textContent || '').trim()) n = n.nextElementSibling;
          valueNode = n || lab;
        }

        return { labelNode: lab, valueNode };
      };

      const getTopStatusOrig = () => {
        const top = document.getElementById(CFG.IDS.topStatus);
        if (!top) return { top: null, origText: '', origHTML: '', isYes: false };

        const isOverridden = top._ActualGUMSPayWarn === true;

        if (!top._ActualGUMSOrigHTML) {
          top._ActualGUMSOrigHTML = top.innerHTML;
          top._ActualGUMSOrigText = (top.textContent || '').trim();
        }

        if (!isOverridden) {
          top._ActualGUMSOrigHTML = top.innerHTML;
          top._ActualGUMSOrigText = (top.textContent || '').trim();
        }

        const origText = top._ActualGUMSOrigText || '';
        const origHTML = top._ActualGUMSOrigHTML || '';

        return { top, origText, origHTML, isYes: /\bYes\b/i.test(origText) };
      };

      const getOutstandingBalance = () => {
        const field = findField(/^\s*Outstanding\s*Balance\s*:/i);

        const parseMoney = (txt) => {
          const m = String(txt || '').replace(/[,৳]/g, '').match(/-?\d+(\.\d+)?/);
          return m ? parseFloat(m[0]) : 0;
        };

        const due = field?.valueNode ? parseMoney(field.valueNode.textContent) : 0;
        return { field, due };
      };

      const hookPRMOnce = (key, fn) => {
        if (typeof Core.hookPRMOnce === 'function') return Core.hookPRMOnce(key, fn);

        const prm = Core.getPRM?.();
        if (!prm) return false;
        if (prm[key]) return true;
        prm[key] = true;
        prm.add_endRequest(() => fn());
        return true;
      };

      const observeOnce = (key, root, fn) => {
        if (typeof Core.observeOnce === 'function') return Core.observeOnce(key, root || document.documentElement, fn);

        const host = root || document.documentElement;
        if (host[key]) return true;
        host[key] = true;
        const obs = new MutationObserver(Core.rafThrottle(() => {
          try { obs.disconnect(); } catch {}
          fn();
        }));
        obs.observe(host, { childList: true, subtree: true });
        return true;
      };

      return {
        safe, splitLinesFromHTML, toMin, getSection, overlap,
        getRegTable, waitForRegTable,
        findField, getTopStatusOrig,
        getOutstandingBalance,
        hookPRMOnce, observeOnce
      };
    })();

    const featureBase = (() => {
      const ensure = Core.once(() => {
        Core.injectCSSOnce(
          `
          #${CFG.IDS.topStatus}{white-space:nowrap}
          @media (min-width: 992px){ .ActualGUMS-mid-left-tweak{transform: translateX(15%);} }
          `,
          'ActualGUMSRegBaseCSS'
        );
      });

      const mount = () => {};
      const bind = () => {};
      const sync = () => {};

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureEnhancedTopHeader = (() => {
      const ensure = () => {};
      const mount = () => {
        const top = document.getElementById(CFG.IDS.topStatus);
        if (!top) return;

        const row = top.closest('.col-sm-12');
        if (!row || row._ActualGUMSSized === true) return;

        const cols = Array.from(row.children).filter(el => /\bcol-(lg|md|sm)-\d+\b/.test(el.className));
        if (cols.length < 3) return;

        const [left, mid, right] = cols;

        const setCols = (el, lg, md, sm) => {
          ['lg', 'md', 'sm'].forEach(sz => {
            for (let i = 1; i <= 12; i++) el.classList.remove(`col-${sz}-${i}`);
            const v = { lg, md, sm }[sz];
            el.classList.add(`col-${sz}-${v}`);
          });
        };

        setCols(left, 3, 3, 3);
        setCols(mid, 6, 6, 6);
        setCols(right, 3, 3, 3);

        const title = left.querySelector('b');
        if (title) title.style.fontSize = '20px';

        mid.style.textAlign = 'center';
        right.style.textAlign = 'right';

        [mid, right].forEach(c => c.firstElementChild?.tagName === 'BR' && c.firstElementChild.remove());
        mid.classList.add('ActualGUMS-mid-left-tweak');

        row._ActualGUMSSized = true;
      };
      const bind = () => {};
      const sync = () => { mount(); };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureCheckPayment = (() => {
      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};

      const sync = () => {
        const { RED } = CFG.COLORS;

        const { field: balance, due } = H.getOutstandingBalance();

        if (balance) {
          [balance.labelNode, balance.valueNode].forEach(n => {
            if (!n) return;
            n.style.removeProperty('color');
            n.style.removeProperty('font-weight');
          });

          if (due > 0) {
            [balance.labelNode, balance.valueNode].forEach(n => {
              if (!n) return;
              n.style.color = RED;
              n.style.fontWeight = '700';
            });
          }
        }

        const { top, origHTML } = H.getTopStatusOrig();
        if (!top) return;

        top.style.fontWeight = '700';
        top.style.whiteSpace = 'nowrap';

        if (due > 0) {
          top._ActualGUMSPayWarn = true;
          top.style.removeProperty('color');

          const warn = document.createElement('span');
          warn.style.cssText = `color:${RED};font-weight:700`;
          warn.textContent = 'payment not completed';

          const sep = document.createElement('span');
          sep.style.cssText = 'color:inherit';
          sep.textContent = ' | ';

          const keep = document.createElement('span');
          keep.style.cssText = 'font-weight:700';
          keep.innerHTML = origHTML;

          top.replaceChildren(warn, sep, keep);
          return;
        }

        if (top._ActualGUMSPayWarn === true) {
          top._ActualGUMSPayWarn = false;
          top.innerHTML = origHTML;
          top.style.removeProperty('color');
        }
      };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureCheckConfirmation = (() => {
      const CONFIRM_RE = /^\s*Student\s*Final\s*Registration\s*Confirm\s*:/i;

      const readConfirmState = () => {
        const confirm = H.findField(CONFIRM_RE);
        if (!confirm?.valueNode) return null;

        const combo = (
          (confirm.labelNode?.textContent || '') +
          ' ' +
          (confirm.valueNode?.textContent || '')
        ).toLowerCase();

        if (/\byes\b/i.test(confirm.valueNode.textContent || '') || /:\s*yes\b/i.test(combo)) return true;
        if (/\bno\b/i.test(confirm.valueNode.textContent || '') || /:\s*no\b/i.test(combo)) return false;

        return null;
      };

      const ensure = () => {};
      const mount = () => {};

      const bind = () => {
        const bindBtn = (id) => {
          const btn = document.getElementById(id);
          if (!btn || btn._ActualGUMSWarnNoConfirm === true) return;

          btn._ActualGUMSWarnNoConfirm = true;

          btn.addEventListener('click', (e) => {
            const state = readConfirmState();
            if (state !== false) return;

            const ok = window.confirm(
              'Student Final Registration Confirm is NO.\n\nDo you want to continue completing registration?'
            );

            if (!ok) {
              e.preventDefault();
              e.stopPropagation();
              if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
              return false;
            }
          }, true);
        };

        bindBtn(CFG.IDS.btnRegistration);
        bindBtn(CFG.IDS.btnRegistrationConfirm);
      };

      const sync = () => {
        const { GREEN, RED } = CFG.COLORS;

        const confirm = H.findField(CONFIRM_RE);

        if (confirm) {
          [confirm.labelNode, confirm.valueNode].forEach(n => {
            if (!n) return;
            n.style.removeProperty('color');
            n.style.removeProperty('font-weight');
          });
        }

        const confirmYes = readConfirmState();

        if (confirm?.valueNode && confirmYes !== null) {
          const c = confirmYes ? GREEN : RED;

          confirm.valueNode.style.color = c;
          confirm.valueNode.style.fontWeight = '700';

          if (confirm.labelNode && confirm.labelNode !== confirm.valueNode) {
            confirm.labelNode.style.color = c;
            confirm.labelNode.style.fontWeight = '700';
          }
        }

        const { due } = H.getOutstandingBalance();
        if (due > 0) return;

        const { top, origHTML, isYes } = H.getTopStatusOrig();
        if (!top) return;

        if (top._ActualGUMSPayWarn === true) {
          top._ActualGUMSPayWarn = false;
          top.innerHTML = origHTML;
          top.style.removeProperty('color');
        }

        const yesForTop = (confirmYes === null) ? isYes : confirmYes;

        top.style.fontWeight = '700';
        top.style.whiteSpace = 'nowrap';
        top.style.color = yesForTop ? GREEN : RED;
      };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureIncorrectSection = (() => {
      const M = {
        CSS_ID: 'ActualGUMSRegMismatchCSS',
        CLASS: 'ActualGUMS-sec-mismatch',
        BAD_BG: '#ffd6d6',
      };

      const ensureStyles = Core.once(() => {
        Core.injectCSSOnce(
          `
          #${CFG.IDS.regTable} tr.${M.CLASS} td{background-color:${M.BAD_BG}!important;background:${M.BAD_BG}!important}
          #${CFG.IDS.regTable} tr.${M.CLASS}:hover td{background-color:${M.BAD_BG}!important;background:${M.BAD_BG}!important}
          `,
          M.CSS_ID
        );
      });

      const paintRow = (row, isBad) => {
        const tds = row.querySelectorAll('td');
        for (const td of tds) {
          if (isBad) {
            td.style.setProperty('background-color', M.BAD_BG, 'important');
            td.style.setProperty('background', M.BAD_BG, 'important');
          } else {
            td.style.removeProperty('background-color');
            td.style.removeProperty('background');
          }
        }
      };

      const getStudentPrefix = () => {
        const roll = document.getElementById(CFG.IDS.lblRoll)?.textContent ?? '';
        const m1 = String(roll).match(/\d{3}/);
        if (m1) return m1[0];

        const batch = document.getElementById(CFG.IDS.lblBatch)?.textContent ?? '';
        const m2 = String(batch).match(/\d{3}/);
        return m2 ? m2[0] : null;
      };

      const findSectionColIndex = (table) => {
        const headRow =
          table.querySelector('thead tr:last-child') ||
          table.querySelector('tbody > tr:first-child') ||
          table.querySelector('tr');

        if (!headRow) return 5;

        const cells = headRow.querySelectorAll('th,td');
        for (let i = 0; i < cells.length; i++) {
          const t = Core.normalizeWS(cells[i].textContent).toLowerCase();
          if (t.includes('section name')) return i;
        }
        return 5;
      };

      const parseSectionPrefix = (txt) => {
        const s = Core.normalizeWS(String(txt || '').replace(/\u00a0/g, ' '));
        const m = s.match(/section\s*[:：]?\s*([0-9]{3,})/i);
        return m ? m[1] : null;
      };

      const ensure = () => { ensureStyles(); };
      const mount = () => {};
      const bind = () => {};

      const sync = () => {
        const idPrefix = getStudentPrefix();
        if (!idPrefix) return;

        const table = H.getRegTable();
        if (!table) return;

        const colIdx = findSectionColIndex(table);
        const rows = table.querySelectorAll('tbody > tr');

        rows.forEach(row => {
          if (!row.querySelector('td')) return;

          const tds = row.querySelectorAll('td');
          if (tds.length <= colIdx) return;

          const secPrefix = parseSectionPrefix(tds[colIdx].textContent || '');
          const mismatch = !!secPrefix && secPrefix !== idPrefix;

          row.classList.toggle(M.CLASS, mismatch);
          paintRow(row, mismatch);
          if (!secPrefix) {
            row.classList.remove(M.CLASS);
            paintRow(row, false);
          }
        });
      };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureSectionConflict = (() => {
      const C = {
        CSS_ID: 'ActualGUMSRegConflictCSS',
        CONFLICT_CLASS: 'ActualGUMS-conflict',
        NOTE_CLASS: 'ActualGUMS-conflict-note',
        RED: 'var(--ActualGUMS-red)',
      };

      const ensureStyles = Core.once(() => {
        Core.injectCSSOnce(
          `
          #${CFG.IDS.popupTable} tr.${C.CONFLICT_CLASS}{
            background:#ffeaea !important;
            font-weight:700 !important;
          }
          `,
          C.CSS_ID
        );
      });

      const getRegisteredRanges = () => {
        const tbl = H.getRegTable();
        const ranges = Object.create(null);
        if (!tbl) return ranges;

        const add = (day, s, e, code, section) => (ranges[day] ||= []).push({ s, e, code, section });

        tbl.querySelectorAll('tbody tr').forEach(tr => {
          const codeText = tr.querySelector('span[id$="lblFormalCode"]')?.textContent || '';
          const mCode = codeText.match(/^[A-Z]{2,4}\s*\d{3}/i);
          const codeBase = mCode ? mCode[0].replace(/\s+/g, '').toUpperCase() : '';

          const sp = tr.querySelector('span[id$="lblSection"]');
          const sectionRaw = H.getSection(sp, { compact: false });
          const sectionNice = sectionRaw.replace('_', '');

          const chunks = H.splitLinesFromHTML(tr.innerHTML);
          chunks.forEach(line => {
            const m = String(line).match(CFG.LINE_RE);
            if (!m) return;

            const day = CFG.dayMap[m[1]];
            if (!day) return;

            const s = H.toMin(m[2], m[3], m[4]);
            const e = H.toMin(m[5], m[6], m[7]);
            if (s < e) add(day, s, e, codeBase, sectionNice);
          });
        });

        return ranges;
      };

      const popupCourseBase = () => {
        const t = document.getElementById(CFG.IDS.popupHeader)?.textContent || '';
        const m = t.match(/Course\s*:\s*([A-Z]{2,4}\s*\d{3})/i);
        return m ? m[1].replace(/\s+/g, '').toUpperCase() : '';
      };

      const parsePopupRowTimes = (row) => {
        const times = [];
        const cell = row.querySelector('td:nth-child(4)') || row;
        const chunks = H.splitLinesFromHTML(cell.innerHTML);

        chunks.forEach(line => {
          const m = String(line).match(CFG.LINE_RE);
          if (!m) return;

          const day = CFG.dayMap[m[1]];
          if (!day) return;

          const s = H.toMin(m[2], m[3], m[4]);
          const e = H.toMin(m[5], m[6], m[7]);
          if (s < e) times.push({ day, s, e });
        });

        return times;
      };

      const updatePopupCourseHeader = () => {
        const label = document.getElementById(CFG.IDS.popupHeader);
        if (!label) return;
        if (/\|\s*Section\s*:/.test(label.textContent)) return;

        let section = (document.getElementById(CFG.IDS.hdnPrevSection)?.value || '').replace(/\s+/g, '');

        if (!section) {
          const formal = document.getElementById(CFG.IDS.hdnPrevFormal)?.value || '';
          if (formal) {
            const tbl = H.getRegTable();
            const target = Core.normCode(formal);

            for (const tr of tbl?.querySelectorAll('tbody tr') || []) {
              const fc = tr.querySelector('span[id$="lblFormalCode"]')?.textContent || '';
              if (Core.normCode(fc) === target) {
                section = H.getSection(tr.querySelector('span[id$="lblSection"]'), { compact: false });
                break;
              }
            }
          }
        }

        if (section) label.textContent = `${label.textContent} | Section : ${section}`;
      };

      const clearMarks = (secTbl) => {
        secTbl.querySelectorAll('tbody tr').forEach(tr => {
          tr.classList.remove(C.CONFLICT_CLASS);
          tr.querySelector('.' + C.NOTE_CLASS)?.remove();
          tr.querySelectorAll('td,span,a,button,input').forEach(n => {
            n.style.removeProperty('color');
            n.style.removeProperty('pointer-events');
            n.style.removeProperty('opacity');
            n.removeAttribute('title');
          });
        });
      };

      const ensure = () => { ensureStyles(); };
      const mount = () => {};
      const bind = () => {};

      const sync = () => {
        const secTbl = document.getElementById(CFG.IDS.popupTable);
        if (!secTbl) return;

        clearMarks(secTbl);

        const reg = getRegisteredRanges();
        if (!Object.keys(reg).length) return;

        const popupCode = popupCourseBase();

        secTbl.querySelectorAll('tbody tr').forEach(tr => {
          if (!tr.querySelector('td')) return;

          const slots = parsePopupRowTimes(tr);
          const hits = [];

          slots.forEach(({ day, s, e }) => {
            (reg[day] || []).forEach(({ s: rs, e: re, code, section }) => {
              if (H.overlap(s, e, rs, re) && code !== popupCode) {
                hits.push(`${code}${section ? ` - ${section}` : ''}`);
              }
            });
          });

          const uniqueHits = [...new Set(hits)];
          if (!uniqueHits.length) return;

          tr.classList.add(C.CONFLICT_CLASS);
          [tr, ...tr.querySelectorAll('td,span,a')].forEach(n =>
            n.style.setProperty('color', C.RED, 'important')
          );

          const selectBtn = tr.querySelector('a,button,input[type="button"]');
          if (selectBtn) {
            selectBtn.style.pointerEvents = 'none';
            selectBtn.style.opacity = '0.5';
            selectBtn.title = 'This section conflicts with your registered courses';
          }

          const secCell = tr.querySelector('td:nth-child(2)');
          if (secCell && !secCell.querySelector('.' + C.NOTE_CLASS)) {
            const box = document.createElement('div');
            box.className = C.NOTE_CLASS;
            box.style.cssText = `margin-top:4px;font-weight:700;font-size:12px;color:${C.RED}`;
            uniqueHits.forEach(hit => {
              const line = document.createElement('div');
              line.textContent = `conflicts : ${hit}`;
              box.appendChild(line);
            });
            secCell.appendChild(box);
          }
        });

        updatePopupCourseHeader();
      };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureRoutineGrid = (() => {
      const R = {
        CSS_ID: 'ActualGUMSRegRoutineCSS',
        WRAP_CLASS: 'ActualGUMSRoutineWrap',
        TABLE_ID: 'ActualGUMSRoutine',
        FALLBACKS: { CODE: 'COURSE', SECTION: 'SECTION', ROOM: 'ROOM' },
        SLOTS: ['08:30-10:00', '10:00-11:30', '11:30-01:00', '01:00-01:30', '01:30-03:00', '03:00-04:30'],
        BREAK: '01:00-01:30',
        SLOT_RANGE: {
          '08:30-10:00': [510, 600], '10:00-11:30': [600, 690], '11:30-01:00': [690, 780],
          '01:00-01:30': [780, 810], '01:30-03:00': [810, 900], '03:00-04:30': [900, 990]
        },
        NOTE_KEY_PREFIX: 'ActualGUMS_routine_note_blocks_v6',
        NOTE_BG: '#eeeeee',
      };

      const ensureStyles = Core.once(() => {
        Core.injectCSSOnce(
          `
          .${R.WRAP_CLASS}{margin:22px 0;overflow-x:auto}

          #${R.TABLE_ID}{
            table-layout:fixed;border-collapse:collapse;width:100%;min-width:860px;
            font:13px "Segoe UI",system-ui;border:1px solid var(--ActualGUMS-border)
          }
          #${R.TABLE_ID} col.day{width:110px}
          #${R.TABLE_ID} col.breakcol{width:120px}
          #${R.TABLE_ID} col.slot{width:calc((100% - 110px - 120px)/5)}

          #${R.TABLE_ID} th,#${R.TABLE_ID} td{
            height:56px;padding:6px 4px;vertical-align:middle;border:1px solid #c9d4d9;
            white-space:nowrap;overflow:hidden;background:#fff;text-align:center!important
          }

          #${R.TABLE_ID} thead th{background:var(--ActualGUMS-green);color:#fff;font-weight:700!important}
          #${R.TABLE_ID} thead th:not(.ActualGUMS-daytime){
            vertical-align:top!important;
            padding-top:6px!important;
            padding-bottom:0!important;
            line-height:1.1;
          }

          #${R.TABLE_ID} .day{background:var(--ActualGUMS-green);color:#fff;text-align:left!important;padding-left:8px;font-weight:700!important}

          #${R.TABLE_ID} tbody td:not(.break):not(.ActualGUMS-note-cell){background-color:#fff!important}
          #${R.TABLE_ID} tbody tr{background-color:#fff!important}
          #${R.TABLE_ID} tbody tr:hover td:not(.break):not(.ActualGUMS-note-cell){background-color:#fff!important}

          #${R.TABLE_ID} td.break{background-color:#ffeaea!important;font-weight:700!important}
          #${R.TABLE_ID} td.break:hover{background-color:#ffeaea!important}

          #${R.TABLE_ID} th.ActualGUMS-daytime{position:relative;padding:0!important;overflow:hidden}
          #${R.TABLE_ID} th.ActualGUMS-daytime::after{
            content:"";position:absolute;inset:-2px;pointer-events:none;
            background:linear-gradient(to top right,
              transparent 49.2%,
              rgba(255,255,255,.95) 50%,
              transparent 50.8%
            );
          }
          #${R.TABLE_ID} th.ActualGUMS-daytime .ActualGUMS-day{
            position:absolute;left:8px;bottom:6px;color:#fff;font-weight:800;line-height:1;
          }
          #${R.TABLE_ID} th.ActualGUMS-daytime .ActualGUMS-time{
            position:absolute;right:8px;top:6px;color:#fff;font-weight:800;line-height:1;
          }

          #${R.TABLE_ID} td.ActualGUMS-slot{cursor:pointer;position:relative;user-select:none}
          #${R.TABLE_ID} td.ActualGUMS-multi{box-shadow: inset 0 0 0 2px rgba(0,0,0,.18)}

          #${R.TABLE_ID} td.ActualGUMS-note-cell{background-color:${R.NOTE_BG}!important;background:${R.NOTE_BG}!important}
          #${R.TABLE_ID} td.ActualGUMS-note-cell:hover{background-color:${R.NOTE_BG}!important;background:${R.NOTE_BG}!important}

          #${R.TABLE_ID} .ActualGUMS-note{
            display:block;font-size:12px;font-style:italic;color:#333;
            white-space:normal;line-height:1.2;padding-right:18px;
          }
          #${R.TABLE_ID} .ActualGUMS-note-clear{
            position:absolute;top:4px;right:4px;width:16px;height:16px;border:0;border-radius:8px;
            background:rgba(0,0,0,.10);color:#111;font-size:13px;line-height:16px;padding:0;cursor:pointer;
          }
          #${R.TABLE_ID} .ActualGUMS-note-clear:hover{background:rgba(0,0,0,.18)}

          #ActualGUMSNoteModalOverlay{
            position:fixed;inset:0;display:none;align-items:center;justify-content:center;
            background:rgba(0,0,0,.35);z-index:2147483647;
          }
          #ActualGUMSNoteModal{
            width:min(520px,calc(100vw - 24px));
            background:#fff;border-radius:12px;
            box-shadow:0 18px 60px rgba(0,0,0,.28);
            font:13px "Segoe UI",system-ui;color:#111;
          }
          #ActualGUMSNoteModal .ActualGUMS-hd{
            display:flex;align-items:center;justify-content:space-between;
            padding:12px 14px;border-bottom:1px solid #e7e7e7;
          }
          #ActualGUMSNoteModal .ActualGUMS-ttl{font-weight:800;font-size:14px}
          #ActualGUMSNoteModal .ActualGUMS-x{
            width:28px;height:28px;border:0;border-radius:8px;cursor:pointer;
            background:rgba(0,0,0,.06);font-size:18px;line-height:28px;padding:0;color:#111;
          }
          #ActualGUMSNoteModal .ActualGUMS-x:hover{background:rgba(0,0,0,.10)}
          #ActualGUMSNoteModal .ActualGUMS-bd{padding:12px 14px}
          #ActualGUMSNoteModal textarea{
            width:100%;min-height:92px;resize:vertical;
            border:1px solid #cfd8dc;border-radius:10px;
            padding:10px 10px;font:13px "Segoe UI",system-ui;
            outline:none;
          }
          #ActualGUMSNoteModal textarea:focus{border-color:#7aa7c7;box-shadow:0 0 0 3px rgba(122,167,199,.22)}
          #ActualGUMSNoteModal .ActualGUMS-ft{
            display:flex;gap:10px;justify-content:flex-end;
            padding:12px 14px;border-top:1px solid #e7e7e7;
          }
          #ActualGUMSNoteModal .ActualGUMS-btn{
            border:0;border-radius:10px;padding:8px 12px;cursor:pointer;
            font-weight:700;font:13px "Segoe UI",system-ui;
          }
          #ActualGUMSNoteModal .ActualGUMS-cancel{
            background:#eaeaea!important;
            color:#111827!important;
            border:1px solid #d1d5db!important;
            box-shadow:none!important;
          }
          #ActualGUMSNoteModal .ActualGUMS-cancel:hover{ background:#e2e2e2!important; }
          #ActualGUMSNoteModal .ActualGUMS-cancel:active{ background:#dcdcdc!important; }

          #ActualGUMSNoteModal .ActualGUMS-ok{
            background:var(--ActualGUMS-green)!important;
            color:#fff!important;
          }
          #ActualGUMSNoteModal .ActualGUMS-ok{background:var(--ActualGUMS-green);color:#fff}
          #ActualGUMSNoteModal .ActualGUMS-ok:hover{filter:brightness(.95)}
          `,
          R.CSS_ID
        );
      });

      const rowsEqual = (a, b) =>
        a.length === b.length && a.every((v, i) =>
          v.code === b[i].code && v.section === b[i].section && v.room === b[i].room
        );

      const view = (o) =>
        `${H.safe(o.code, R.FALLBACKS.CODE)}<br>${H.safe(o.section, R.FALLBACKS.SECTION)}  ॥  ${H.safe(o.room, R.FALLBACKS.ROOM)}`;

      const getStudentIdForNotes = () =>
        (document.getElementById(CFG.IDS.lblRoll)?.textContent || '').trim() || 'anon';

      const notesKey = () => `${R.NOTE_KEY_PREFIX}:${getStudentIdForNotes()}`;

      const loadBlocks = () => {
        try {
          const raw = localStorage.getItem(notesKey());
          const arr = raw ? JSON.parse(raw) : null;
          return Array.isArray(arr) ? arr.filter(b => b && typeof b === 'object') : [];
        } catch {
          return [];
        }
      };

      const saveBlocks = (blocks) => {
        try { localStorage.setItem(notesKey(), JSON.stringify(Array.isArray(blocks) ? blocks : [])); } catch {}
      };

      const breakIdx = R.SLOTS.indexOf(R.BREAK);
      const keyOf = (di, si) => `${di},${si}`;

      const cover = (b, di, si) => di >= b.d0 && di <= b.d1 && si >= b.s0 && si <= b.s1;
      const findBlockCovering = (blocks, di, si) => blocks.find(b => cover(b, di, si)) || null;
      const isTopLeft = (b, di, si) => b && di === b.d0 && si === b.s0;

      const normalizeBlock = (b) => {
        const d0 = Math.min(b.d0, b.d1), d1 = Math.max(b.d0, b.d1);
        const s0 = Math.min(b.s0, b.s1), s1 = Math.max(b.s0, b.s1);
        return { ...b, d0, d1, s0, s1 };
      };

      const collect = (srcTable) => {
        const grid = Object.fromEntries(
          CFG.DAYS.map(d => [d, Object.fromEntries(R.SLOTS.map(s => [s, []]))])
        );

        let foundAny = false;

        srcTable.querySelectorAll('tbody tr').forEach(tr => {
          let code = tr.querySelector('span[id$="lblFormalCode"]')
            ?.textContent.match(/^[A-Z]{2,4}\s*\d{3}/)?.[0]?.replace(/\s+/g, '');
          code = H.safe(code, R.FALLBACKS.CODE);

          const secSpan = tr.querySelector('span[id$="lblSection"]');
          if (!secSpan) return;

          let section = H.getSection(secSpan, { compact: true });
          section = H.safe(section, R.FALLBACKS.SECTION);

          const lines = H.splitLinesFromHTML(secSpan.innerHTML);
          lines.forEach(line => {
            const m = String(line).match(CFG.LINE_RE);
            if (!m) return;

            const day = CFG.dayMap[m[1]];
            if (!day) return;

            const start = H.toMin(m[2], m[3], m[4]);
            const end = H.toMin(m[5], m[6], m[7]);
            if (!(start < end)) return;

            let room = ((m[8] || '').trim().split(/\s+/)[0] || '').replace(/[^A-Za-z0-9]/g, '');
            room = H.safe(room, R.FALLBACKS.ROOM);

            R.SLOTS.forEach(slot => {
              const [r0, r1] = R.SLOT_RANGE[slot];
              if (start < r1 && end > r0) {
                grid[day][slot].push({ code, section, room });
                foundAny = true;
              }
            });
          });
        });

        return foundAny ? grid : null;
      };

      const isEmptySlotAt = (grid, di, si) => {
        const day = CFG.DAYS[di];
        const slot = R.SLOTS[si];
        if (!day || !slot || slot === R.BREAK) return false;
        return (grid[day]?.[slot] || []).length === 0;
      };

      const canUseForNoteRect = (grid, blocks, d0, d1, s0, s1) => {
        if (breakIdx >= 0 && s0 < breakIdx && s1 > breakIdx) return false;
        for (let di = d0; di <= d1; di++) {
          for (let si = s0; si <= s1; si++) {
            if (R.SLOTS[si] === R.BREAK) return false;
            if (!isEmptySlotAt(grid, di, si)) return false;
            if (findBlockCovering(blocks, di, si)) return false;
          }
        }
        return true;
      };

      const buildTableHTML = (grid, blocks) => {
        const bid = (b) => `d${b.d0}-${b.d1}_s${b.s0}-${b.s1}`;

        let out = `<table id="${R.TABLE_ID}"><colgroup><col class="day">`;
        R.SLOTS.forEach(s => out += (s === R.BREAK ? '<col class="breakcol">' : '<col class="slot">'));
        out += `</colgroup><thead><tr>`;
        out += `<th class="day ActualGUMS-daytime"><span class="ActualGUMS-day">Day</span><span class="ActualGUMS-time">Time</span></th>`;
        R.SLOTS.forEach(s => out += `<th>${String(s)}</th>`);
        out += `</tr></thead><tbody>`;

        for (let di = 0; di < CFG.DAYS.length; di++) {
          const day = CFG.DAYS[di];
          out += `<tr><th class="day" style="font-weight:700">${day}</th>`;

          for (let si = 0; si < R.SLOTS.length; si++) {
            const slot = R.SLOTS[si];

            if (slot === R.BREAK) {
              if (di === 0) out += `<td class="break" rowspan="${CFG.DAYS.length}">BREAK</td>`;
              continue;
            }

            const b = findBlockCovering(blocks, di, si);
            if (b) {
              if (!isTopLeft(b, di, si)) continue;

              const rowspan = b.d1 - b.d0 + 1;
              const colspan = b.s1 - b.s0 + 1;
              const text = (b.t || '').trim();
              const id = bid(b);

              out += `<td class="ActualGUMS-slot ActualGUMS-note-cell" style="background-color:${R.NOTE_BG}!important;background:${R.NOTE_BG}!important" data-note="1" data-bid="${id}" data-di="${b.d0}" data-si="${b.s0}" data-d0="${b.d0}" data-d1="${b.d1}" data-s0="${b.s0}" data-s1="${b.s1}" rowspan="${rowspan}" colspan="${colspan}">`;
              out += `<button type="button" class="ActualGUMS-note-clear" data-clear="${id}" aria-label="Clear">×</button>`;
              out += `<span class="ActualGUMS-note">${text ? String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : ''}</span>`;
              out += `</td>`;

              si += (colspan - 1);
              continue;
            }

            const cell = grid[day][slot];
            let span = 1;

            while (
              cell.length > 0 &&
              si + span < R.SLOTS.length &&
              R.SLOTS[si + span] !== R.BREAK &&
              (grid[day][R.SLOTS[si + span]] || []).length > 0 &&
              rowsEqual(cell, grid[day][R.SLOTS[si + span]])
            ) span++;

            const empty = cell.length === 0;
            const inner = empty ? '' : cell.map(view).join('<br><br>');

            out += `<td class="ActualGUMS-slot ${empty ? 'ActualGUMS-empty' : 'ActualGUMS-filled'}" data-di="${di}" data-si="${si}" data-span="${span}" data-empty="${empty ? '1' : '0'}"${span > 1 ? ` colspan="${span}"` : ''}>${inner}</td>`;
            si += span - 1;
          }

          out += `</tr>`;
        }

        return out + `</tbody></table>`;
      };

      let coordMap = new Map();
      let sel = new Set();
      let suppressNextClick = false;
      let selDirty = false;

      const live = { wrap: null, grid: null, dragging: false };

      const buildCoordMap = (wrap) => {
        coordMap = new Map();

        wrap.querySelectorAll(`#${R.TABLE_ID} td.ActualGUMS-slot`).forEach(td => {
          const di = parseInt(td.dataset.di || '0', 10);
          const si = parseInt(td.dataset.si || '0', 10);

          let d0 = di, d1 = di, s0 = si, s1 = si;

          if (td.dataset.note === '1') {
            d0 = parseInt(td.dataset.d0 || String(di), 10);
            d1 = parseInt(td.dataset.d1 || String(di), 10);
            s0 = parseInt(td.dataset.s0 || String(si), 10);
            s1 = parseInt(td.dataset.s1 || String(si), 10);
          } else {
            const span = Math.max(1, parseInt(td.dataset.span || '1', 10));
            s1 = s0 + span - 1;
          }

          for (let d = d0; d <= d1; d++) {
            for (let s = s0; s <= s1; s++) {
              if (R.SLOTS[s] === R.BREAK) continue;
              coordMap.set(keyOf(d, s), td);
            }
          }
        });
      };

      const clearSelectionStyles = (wrap) => {
        wrap.querySelectorAll(`#${R.TABLE_ID} td.ActualGUMS-slot.ActualGUMS-multi`).forEach(td => td.classList.remove('ActualGUMS-multi'));
      };

      const applySelectionStyles = (wrap) => {
        clearSelectionStyles(wrap);
        if (!sel.size) return;

        const touched = new Set();
        for (const k of sel) {
          const td = coordMap.get(k);
          if (!td) continue;
          if (touched.has(td)) continue;
          touched.add(td);
          td.classList.add('ActualGUMS-multi');
        }
      };

      const selectionRect = () => {
        if (!sel.size) return null;
        let d0 = Infinity, d1 = -Infinity, s0 = Infinity, s1 = -Infinity;
        for (const k of sel) {
          const [d, s] = k.split(',').map(x => parseInt(x, 10));
          if (d < d0) d0 = d;
          if (d > d1) d1 = d;
          if (s < s0) s0 = s;
          if (s > s1) s1 = s;
        }
        return { d0, d1, s0, s1 };
      };

      const rectIsComplete = (rect) => {
        if (!rect) return false;
        const need = (rect.d1 - rect.d0 + 1) * (rect.s1 - rect.s0 + 1);
        if (sel.size !== need) return false;
        for (let di = rect.d0; di <= rect.d1; di++) {
          for (let si = rect.s0; si <= rect.s1; si++) {
            if (!sel.has(keyOf(di, si))) return false;
          }
        }
        return true;
      };

      const NoteModal = (() => {
        let overlay, modal, ttl, ta, btnCancel, btnOk, btnX;
        let resolver = null;

        const ensure = () => {
          if (overlay) return;

          overlay = document.createElement('div');
          overlay.id = 'ActualGUMSNoteModalOverlay';

          modal = document.createElement('div');
          modal.id = 'ActualGUMSNoteModal';
          modal.innerHTML = `
            <div class="ActualGUMS-hd">
              <div class="ActualGUMS-ttl"></div>
              <button type="button" class="ActualGUMS-x" aria-label="Close">×</button>
            </div>
            <div class="ActualGUMS-bd">
              <textarea spellcheck="false"></textarea>
            </div>
            <div class="ActualGUMS-ft">
              <button type="button" class="ActualGUMS-btn ActualGUMS-cancel">Cancel</button>
              <button type="button" class="ActualGUMS-btn ActualGUMS-ok">Save</button>
            </div>
          `;

          overlay.appendChild(modal);
          document.body.appendChild(overlay);

          ttl = modal.querySelector('.ActualGUMS-ttl');
          ta = modal.querySelector('textarea');
          ta.addEventListener('keydown', (e) => {
            if (!resolver) return;
            if (e.key !== 'Enter') return;
            if (e.shiftKey || e.ctrlKey || e.metaKey) return;
            e.preventDefault(); e.stopPropagation();
            close(String(ta.value || ''));
          }, true);
          btnCancel = modal.querySelector('.ActualGUMS-cancel');
          btnOk = modal.querySelector('.ActualGUMS-ok');
          btnX = modal.querySelector('.ActualGUMS-x');

          const close = (val) => {
            overlay.style.display = 'none';
            const r = resolver;
            resolver = null;
            if (r) r(val);
          };

          const onCancel = () => close(null);
          const onOk = () => close(String(ta.value || ''));

          btnCancel.addEventListener('click', onCancel, true);
          btnX.addEventListener('click', onCancel, true);
          btnOk.addEventListener('click', onOk, true);

          overlay.addEventListener('mousedown', (e) => {
            if (e.target === overlay) onCancel();
          }, true);

          document.addEventListener('keydown', (e) => {
            if (!resolver) return;
            if (e.key === 'Escape') {
              e.preventDefault(); e.stopPropagation();
              close(null);
            }
          }, true);
        };

        const open = (title, initial = '') => {
          ensure();
          ttl.textContent = String(title || 'Note');
          ta.value = String(initial || '');
          overlay.style.display = 'flex';
          setTimeout(() => ta.focus(), 0);

          return new Promise((resolve) => { resolver = resolve; });
        };

        return { open };
      })();

      const promptNote = async (title, initial = '') => {
        const v = await NoteModal.open(title, initial);
        if (v === null) return null;
        return String(v).trim();
      };

      const clearBlockById = (id) => {
        const blocks = loadBlocks();
        const nx = blocks.filter(b => `d${b.d0}-${b.d1}_s${b.s0}-${b.s1}` !== id);
        saveBlocks(nx);
      };

      const editOrCreateSingle = async (grid, di, si) => {
        const blocks = loadBlocks();
        const hit = findBlockCovering(blocks, di, si);

        if (hit) {
          const next = await promptNote('Edit Planned Section Note', hit.t || '');
          if (next === null) return false;
          if (!next) {
            saveBlocks(blocks.filter(b => b !== hit));
            return true;
          }
          hit.t = next;
          saveBlocks(blocks);
          return true;
        }

        if (!isEmptySlotAt(grid, di, si)) return false;

        const t = await promptNote('Planned Section Note');
        if (t === null || !t) return false;

        blocks.push({ d0: di, d1: di, s0: si, s1: si, t });
        saveBlocks(blocks);
        return true;
      };

      const applyNoteToSelection = async () => {
        if (!selDirty || sel.size < 2) return false;
        if (!live.wrap || !live.grid) return false;
        if (live.dragging) return false;

        const grid = live.grid;
        const blocks = loadBlocks();
        const rect = selectionRect();

        const t = await promptNote('Planned Section Note');
        selDirty = false;

        if (t === null || !t) return false;

        if (rect && rectIsComplete(rect) && canUseForNoteRect(grid, blocks, rect.d0, rect.d1, rect.s0, rect.s1)) {
          blocks.push(normalizeBlock({ d0: rect.d0, d1: rect.d1, s0: rect.s0, s1: rect.s1, t }));
          saveBlocks(blocks);
          sel.clear();
          apply();
          return true;
        }

        for (const k of sel) {
          const [di, si] = k.split(',').map(x => parseInt(x, 10));
          if (!isEmptySlotAt(grid, di, si)) continue;
          if (findBlockCovering(blocks, di, si)) continue;
          blocks.push({ d0: di, d1: di, s0: si, s1: si, t });
        }

        saveBlocks(blocks);
        sel.clear();
        apply();
        return true;
      };

      const bindGlobalCtrlKeyOnce = () => {
        const root = document.documentElement;
        if (root._ActualGUMSRoutineCtrlKey6) return;
        root._ActualGUMSRoutineCtrlKey6 = true;

        document.addEventListener('keyup', (e) => {
          const isCtrl = e.key === 'Control' || e.keyCode === 17;
          if (!isCtrl) return;
          applyNoteToSelection().catch(() => {});
        }, true);
      };

      const bindInteractions = (wrap, grid) => {
        if (!wrap || wrap._ActualGUMSRoutineGridBound6) return;
        wrap._ActualGUMSRoutineGridBound6 = true;

        bindGlobalCtrlKeyOnce();

        let dragging = false;
        let dragStart = null;
        let dragMoved = false;

        const tdFromPoint = (x, y) => {
          const el = document.elementFromPoint(x, y);
          return el?.closest?.(`#${R.TABLE_ID} td.ActualGUMS-slot`) || null;
        };

        const setRectSelection = (a, b) => {
          const d0 = Math.min(a.di, b.di);
          const d1 = Math.max(a.di, b.di);
          const s0 = Math.min(a.si, b.si);
          const s1 = Math.max(a.si, b.si);

          sel.clear();
          for (let di = d0; di <= d1; di++) {
            for (let si = s0; si <= s1; si++) {
              if (R.SLOTS[si] === R.BREAK) continue;
              sel.add(keyOf(di, si));
            }
          }
          selDirty = true;
        };

        const createFromDragRect = async () => {
          const rect = selectionRect();
          if (!rect || !rectIsComplete(rect)) return false;

          const blocks = loadBlocks();
          if (!canUseForNoteRect(grid, blocks, rect.d0, rect.d1, rect.s0, rect.s1)) return false;

          const t = await promptNote('Planned Section Note');
          selDirty = false;

          if (t === null || !t) return false;

          blocks.push(normalizeBlock({ d0: rect.d0, d1: rect.d1, s0: rect.s0, s1: rect.s1, t }));
          saveBlocks(blocks);
          sel.clear();
          apply();
          return true;
        };

        const onMove = (e) => {
          if (!dragging || !dragStart) return;
          const td = tdFromPoint(e.clientX, e.clientY);
          if (!td) return;

          const di = parseInt(td.dataset.di || '0', 10);
          const si = parseInt(td.dataset.si || '0', 10);

          if (di !== dragStart.di || si !== dragStart.si) dragMoved = true;

          setRectSelection(dragStart, { di, si });
          applySelectionStyles(wrap);

          e.preventDefault();
          e.stopPropagation();
        };

        const onUp = () => {
          if (!dragging) return;

          dragging = false;
          live.dragging = false;

          document.removeEventListener('mousemove', onMove, true);
          document.removeEventListener('mouseup', onUp, true);

          if (dragMoved) {
            suppressNextClick = true;
            createFromDragRect().catch(() => {});
            dragStart = null;
            dragMoved = false;
            return;
          }

          dragStart = null;
          dragMoved = false;
        };

        wrap.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;

          const clearBtn = e.target?.closest?.(`#${R.TABLE_ID} .ActualGUMS-note-clear[data-clear]`);
          if (clearBtn) return;

          const td = e.target?.closest?.(`#${R.TABLE_ID} td.ActualGUMS-slot`);
          if (!td) return;

          const di = parseInt(td.dataset.di || '0', 10);
          const si = parseInt(td.dataset.si || '0', 10);

          if (R.SLOTS[si] === R.BREAK) return;

          if (e.ctrlKey) {
            if (td.dataset.note === '1') return;
            if (td.dataset.empty !== '1') return;

            const k = keyOf(di, si);
            if (sel.has(k)) sel.delete(k);
            else sel.add(k);

            selDirty = true;
            applySelectionStyles(wrap);

            e.preventDefault();
            e.stopPropagation();
            return;
          }

          dragging = true;
          live.dragging = true;

          dragStart = { di, si };
          dragMoved = false;

          sel.clear();
          selDirty = false;
          applySelectionStyles(wrap);

          document.addEventListener('mousemove', onMove, true);
          document.addEventListener('mouseup', onUp, true);

          e.preventDefault();
          e.stopPropagation();
        }, true);

        wrap.addEventListener('click', (e) => {
          const btn = e.target?.closest?.(`#${R.TABLE_ID} .ActualGUMS-note-clear[data-clear]`);
          if (btn) {
            e.preventDefault();
            e.stopPropagation();

            const id = btn.getAttribute('data-clear') || '';
            clearBlockById(id);
            sel.clear();
            selDirty = false;
            apply();
            return;
          }

          if (suppressNextClick) {
            e.preventDefault();
            e.stopPropagation();
            suppressNextClick = false;
            return;
          }

          if (e.ctrlKey) return;

          const td = e.target?.closest?.(`#${R.TABLE_ID} td.ActualGUMS-slot`);
          if (!td) {
            if (sel.size) {
              sel.clear();
              selDirty = false;
              applySelectionStyles(wrap);
            }
            return;
          }

          const di = parseInt(td.dataset.di || '0', 10);
          const si = parseInt(td.dataset.si || '0', 10);

          if (R.SLOTS[si] === R.BREAK) return;
          if (sel.size >= 2) return;

          e.preventDefault();
          e.stopPropagation();

          (async () => {
            const changed = await editOrCreateSingle(grid, di, si);
            if (changed) apply();
          })().catch(() => {});
        }, true);
      };

      const apply = () => {
        ensureStyles();

        const src = H.getRegTable();
        if (!src) return;

        Core.q('#' + R.TABLE_ID)?.closest('.' + R.WRAP_CLASS)?.remove();
        src.parentElement?.querySelector('.' + R.WRAP_CLASS + '[data-noclass="1"]')?.remove();

        const text = src.textContent || '';
        const hasNoDataRow = /No\s*data\s*found/i.test(text);
        const hasRows = !hasNoDataRow && !!src.querySelector('span[id$="lblFormalCode"]');
        if (!hasRows) return;

        const grid = collect(src);
        if (!grid) {
          const msg = document.createElement('div');
          msg.className = R.WRAP_CLASS;
          msg.dataset.noclass = '1';
          msg.style.cssText = 'margin:8px 0;color:#666;font:bold italic 16px Segoe UI,system-ui;text-align:center';
          msg.textContent = 'No on-campus classes detected.';
          src.insertAdjacentElement('afterend', msg);
          return;
        }

        const blocks = loadBlocks();

        const wrap = document.createElement('div');
        wrap.className = R.WRAP_CLASS;
        wrap.innerHTML = buildTableHTML(grid, blocks);
        src.insertAdjacentElement('afterend', wrap);

        live.wrap = wrap;
        live.grid = grid;

        buildCoordMap(wrap);
        bindInteractions(wrap, grid);
        applySelectionStyles(wrap);
      };

      const ensure = () => { ensureStyles(); };
      const mount = () => {};
      const bind = () => {};
      const sync = () => { apply(); };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureRegSlipDownload = (() => {
      let shouldAuto = false;

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {
        const form = document.querySelector('form');
        if (!form) return;

        const getStudentId = () => (document.getElementById(CFG.IDS.lblRoll)?.textContent || '').trim();

        async function postWithSubmitterAndSave(submitterName, submitterValue, filename) {
          const fd = new FormData(form);
          fd.set('__EVENTTARGET', '');
          fd.set('__EVENTARGUMENT', '');
          fd.set(submitterName, submitterValue);

          const body = new URLSearchParams();
          for (const [k, v] of fd.entries()) body.append(k, v);

          const url = form.getAttribute('action')
            ? new URL(form.getAttribute('action'), location.href).href
            : location.href;

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: body.toString(),
          });

          const ct = (res.headers.get('content-type') || '').toLowerCase();
          if (!res.ok || /text\/html|application\/json/.test(ct)) {
            const preview = await res.text().catch(() => '');
            console.warn('[ActualGUMS] Slip fetch unexpected:', res.status, ct, preview.slice(0, 400));
            alert('Could not fetch the PDF. Please try again.');
            return;
          }

          const blob = await res.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(a.href);
          a.remove();
        }

        const downloadSlipRenamed = () => {
          const sid = getStudentId();
          if (!sid) return alert('Student ID not found on the page.');

          const btn = document.getElementById(CFG.IDS.btnPrint);
          const submitterName = btn?.name || 'ctl00$MainContainer$btnPrint';
          const submitterValue = btn?.value || 'Download Registration Slip';

          postWithSubmitterAndSave(submitterName, submitterValue, `${sid}.pdf`).catch(console.error);
        };

        const printBtn = document.getElementById(CFG.IDS.btnPrint);
        if (printBtn && printBtn._ActualGUMSSlipBound2 !== true) {
          printBtn._ActualGUMSSlipBound2 = true;
          printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadSlipRenamed();
          }, true);
        }

        const regBtn = document.getElementById(CFG.IDS.btnRegistration);
        if (regBtn && regBtn._ActualGUMSAutoBound !== true) {
          regBtn._ActualGUMSAutoBound = true;
          regBtn.addEventListener('click', () => { shouldAuto = true; });
        }

        const regConfirm = document.getElementById(CFG.IDS.btnRegistrationConfirm);
        if (regConfirm && regConfirm._ActualGUMSAutoBound !== true) {
          regConfirm._ActualGUMSAutoBound = true;
          regConfirm.addEventListener('click', () => { shouldAuto = true; });
        }

        try {
          const prm = Core.getPRM();
          if (prm && !prm._ActualGUMSSlipAuto2) {
            prm._ActualGUMSSlipAuto2 = true;
            prm.add_endRequest(() => {
              if (!shouldAuto) return;
              shouldAuto = false;
              setTimeout(downloadSlipRenamed, 250);
            });
          }
        } catch { }

        const statusEl = document.getElementById(CFG.IDS.topStatus);
        if (statusEl && !statusEl._ActualGUMSSlipObs2) {
          statusEl._ActualGUMSSlipObs2 = true;
          new MutationObserver(() => {
            if (shouldAuto && /confirm\s*:\s*yes/i.test(statusEl.textContent || '')) {
              shouldAuto = false;
              setTimeout(downloadSlipRenamed, 250);
            }
          }).observe(statusEl, { childList: true, subtree: true, characterData: true });
        }
      };

      const sync = () => {};
      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const init = (flags = {}) => {
      Theme.ensureBaseTheme();

      const run = () => {
        featureBase.run();
        if (flags.featureEnhancedTopHeader) featureEnhancedTopHeader.run();
        if (flags.featureCheckPayment) featureCheckPayment.run();
        if (flags.featureCheckConfirmation) featureCheckConfirmation.run();
        if (flags.featureIncorrectSection) featureIncorrectSection.run();
        if (flags.featureSectionConflict) featureSectionConflict.run();
        if (flags.featureRoutineGrid) featureRoutineGrid.run();
        if (flags.featureRegSlipDownload) featureRegSlipDownload.run();
      };

      H.waitForRegTable(() => {
        run();
        if (!H.hookPRMOnce('_ActualGUMSRegHooked', run)) {
          H.observeOnce('_ActualGUMSRegObs', document.documentElement, run);
        }
      });
    };

    return { init };
  })();

  const PageStudentCourseHistory = (() => {
    const CFG = {
      TABLE_ID: 'ctl00_MainContainer_gvRegisteredCourse',
      TABLE_SEL: '#ctl00_MainContainer_gvRegisteredCourse',
      CATALOGUE_ANCHOR_SEL: '#ctl00_MainContainer_UpdatePanel6',
      TOTAL_CREDITS_TARGET: 144,
      CSS_LOCAL_ID: 'ActualGUMSStudentCourseHistoryCSS',

      COL: { COURSE_CODE: 2, CREDIT: 4, GRADE: 6, STATUS: 8 },

      COLOR: { PASS: '#c9f7d5', SOFT: '#e9fbef', RUN: '#fffbe4', FAIL: '#ffeaea' },

      PASS_GRADES: new Set(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D']),
      HIGH_GRADES: new Set(['A+', 'A', 'A-', 'B+']),
      FAIL_GRADES: new Set(['F', 'I', 'AB', 'W']),

      GRADE_RANK: {
        'A+': 13, 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
        'C+': 7, 'C': 6, 'D': 5, 'F': 4, 'I': 3, 'AB': 2, 'W': 1, '': 0
      },

      TABLE_ENHANCER_DEFAULTS: { hideCols: [5], sort: true, search: true, toggles: true },
      ATTEMPT_LINE_LABEL_W: '150px',
      MISSING_MSG: 'Syllabus or Batch config missing'
    };

    const H = (() => {
      const upper = (s) => String(s || '').trim().toUpperCase();
      const isEmpty = (s) => String(s || '').trim() === '';
      const num = (s) => parseFloat(String(s || '').replace(/[^\d.]/g, '') || '0');

      const stripRepeat = (s) => String(s || '').replace(/\s*[×x]\s*\d+\s*$/i, '').trim();

      const canonCourse = (s) => stripRepeat(String(s || ''))
        .split('(')[0].trim()
        .replace(/-[A-Z]{2,}$/, '')
        .replace(/([A-Z]{2,})\s*-\s*(\d{2,3})\b/g, '$1 $2')
        .replace(/([A-Z]{2,})(\d{2,3})\b/g, '$1 $2')
        .replace(/\s+/g, ' ');

      const gradeRank = (g) => CFG.GRADE_RANK[upper(g)] ?? 0;

      const ensureHead = (table) => {
        if (!table) return null;
        const thead = table.tHead || table.createTHead();
        if (!thead.rows.length && table.rows[0]) thead.appendChild(table.rows[0]);
        return thead;
      };

      const getTable = () => document.getElementById(CFG.TABLE_ID) || Core.q(CFG.TABLE_SEL);

      const makeClearable = (input) => {
        if (!input || input.parentElement?.classList?.contains('ActualGUMS-clear-wrap')) return;

        const wrap = document.createElement('div');
        wrap.className = 'ActualGUMS-clear-wrap';

        const btn = document.createElement('span');
        btn.className = 'ActualGUMS-mi ActualGUMS-clear-btn';
        btn.textContent = 'close';
        btn.style.display = 'none';

        const parent = input.parentNode;
        parent.insertBefore(wrap, input);
        wrap.appendChild(input);
        wrap.appendChild(btn);

        const sync = () => { btn.style.display = String(input.value || '').length ? '' : 'none'; };
        Core.on(input, 'input', sync);

        Core.on(btn, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!input.value) return;
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        });

        sync();
      };

      const getRoll = () => (Core.q('#ctl00_MainContainer_lblRoll')?.textContent || '').trim();
      const getBatchRow = () => Core.q('#ctl00_MainContainer_lblBatch')?.parentElement?.parentElement || null;

      const clearRow = (tr) => { Array.from(tr?.cells || []).forEach(td => td?.style?.removeProperty('background-color')); };
      const paintRow = (tr, col) => { Array.from(tr?.cells || []).forEach(td => td && td.style.setProperty('background-color', col, 'important')); };

      return {
        upper, isEmpty, num, stripRepeat, canonCourse, gradeRank,
        ensureHead, getTable, makeClearable, getRoll, getBatchRow,
        clearRow, paintRow
      };
    })();

    const state = {
      ROLL: '',
      SYL_TRIED: false,
      SYL_OK: false,
      SYL_CODE: '',
      REQ: [],
      ALL: [],
      MAP: {},
      PASSED: new Set(),
      ATTEMPTED_NOT_PASSED: new Set(),
      GRADE: Object.create(null),
      WAIVED: new Set(),
      WAIVED_MAP: Object.create(null)
    };

    const isSatisfied = (code) => state.PASSED.has(code) || state.WAIVED.has(code);

    const resetSyllabusState = () => {
      state.SYL_TRIED = false;
      state.SYL_OK = false;
      state.SYL_CODE = '';
      state.REQ = [];
      state.ALL = [];
      state.MAP = {};
      state.WAIVED = new Set();
      state.WAIVED_MAP = Object.create(null);
    };

    const injectLocalCSS = (() => {
      const ensure = Core.once(() => {
        Core.injectCSSOnce(
          `
          #ActualGUMSToggleBtn{
            font-family:'Material Icons';
            font-size:28px; line-height:1;
            color:var(--ActualGUMS-border);
            cursor:pointer; user-select:none;
            display:inline-flex; align-items:center; justify-content:center;
            margin-left:8px; border-radius:50%;
            transition:background .15s;
          }
          #ActualGUMSToggleBtn:hover{ background:rgba(12,122,95,.08); }
          #ActualGUMSCourseCatalogue table tbody tr:hover{ background:rgba(12,122,95,.06); }
          #ActualGUMSCourseCatalogue table tbody tr{ border-bottom:1px dashed rgba(12,122,95,.22); }
          #ActualGUMSCourseCatalogue table tbody tr:last-child{ border-bottom:none; }

          .ActualGUMS-clear-wrap{ position:relative; width:100%; }
          .ActualGUMS-clear-wrap > input{ width:100%; padding-right:36px; }
          .ActualGUMS-clear-btn{
            position:absolute; right:10px; top:50%;
            transform:translateY(-50%);
            cursor:pointer; user-select:none;
            font-size:18px; line-height:1;
            opacity:.45;
            padding:4px; border-radius:50%;
            transition:opacity .12s, background .12s;
          }
          .ActualGUMS-clear-btn:hover{ opacity:.85; background:rgba(12,122,95,.08); }

          .ActualGUMS-sort-ind{
            font-size:16px;
            margin-left:6px;
            opacity:.35;
            vertical-align:middle;
            user-select:none;
          }
          .ActualGUMS-sort-ind.ActualGUMS-sort-active{ opacity:.85; }
          `,
          CFG.CSS_LOCAL_ID
        );
      });

      const mount = () => {};
      const bind = () => {};
      const sync = () => {};
      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const loadDataset = (() => {
      const build = () => {
        const roll = H.getRoll();
        if (!roll) return false;

        if (state.ROLL && state.ROLL !== roll) resetSyllabusState();
        state.ROLL = roll;
        state.SYL_TRIED = true;

        const AG = window.ActualGUMS || window[('ACTUAL_' + 'GU' + 'MS')] || {};
        const SYLLABI = AG.SYLLABI || {};
        const BATCHES = AG.BATCHES || AG.BATCH_CONFIG || {};

        if (!Object.keys(SYLLABI).length || !Object.keys(BATCHES).length) {
          state.SYL_OK = false;
          return false;
        }

        const batchCode = roll.slice(0, 3);
        const batch = BATCHES[batchCode] || null;
        if (!batch) {
          state.SYL_OK = false;
          return false;
        }

        const syllabus = SYLLABI[batch.syllabus] || null;
        if (!syllabus) {
          state.SYL_OK = false;
          return false;
        }

        state.SYL_OK = true;
        state.SYL_CODE = batch.syllabus || '';

        const batchRow = H.getBatchRow();
        if (batchRow && state.SYL_CODE) {
          const already = Array.from(batchRow.parentElement?.children || [])
            .some(n => /Syllabus\s*:/.test(n?.textContent || ''));
          if (!already) {
            const clone = batchRow.cloneNode(true);
            const spans = clone.querySelectorAll('span');
            if (spans[0]) spans[0].textContent = 'Syllabus : ';
            if (spans[1]) spans[1].textContent = state.SYL_CODE;
            spans.forEach(s => s.id && (s.id = ''));
            batchRow.parentElement?.insertBefore(clone, batchRow.nextSibling);
          }
        }

        const needsEAP = batch?.eap009?.includes(roll) ?? false;
        const needsMAT = batch?.mat009?.includes(roll) ?? false;

        const groups = JSON.parse(JSON.stringify(syllabus.groups || []));
        const remedial = groups.find(g => g.name === 'Remedial');

        if (remedial) {
          remedial.courses = (remedial.courses || []).filter(c =>
            (c.code === 'EAP 009' && needsEAP) || (c.code === 'MAT 009' && needsMAT)
          );
          remedial.courses.forEach(c => (c.reqType = 'MANDATORY'));
          remedial.coursesNeeded = remedial.courses.length;
          remedial.creditsNeeded = remedial.courses.reduce((s, c) => s + (c.credits || 0), 0);
          if (!remedial.coursesNeeded) groups.splice(groups.indexOf(remedial), 1);
        }

        state.REQ = groups;
        state.ALL = groups.flatMap(g => g.courses || []);
        state.MAP = Object.fromEntries(state.ALL.map(c => [c.code, c]));
        return true;
      };

      const ensureData = () => {
        const roll = H.getRoll();
        if (!roll) return false;
        if (state.ROLL && state.ROLL !== roll) resetSyllabusState();
        if (!state.SYL_TRIED) build();
        return state.SYL_OK;
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => ensureData();
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run, ensureData };
    })();

    const featureMoveWaivedBelow = (() => {
      const IDS = {
        WAIVED_PANEL: 'ctl00_MainContainer_UpdatePanel05',
        HISTORY_PANEL: 'ctl00_MainContainer_UpdatePanel04'
      };

      const closestCol = (el) =>
        el && (el.closest('.col-md-12') || el.closest('.col-lg-12') || el.parentElement);

      const insertAfter = (ref, node) => {
        const p = ref?.parentElement;
        if (!p) return false;
        const next = ref.nextElementSibling;
        if (next === node) return true;
        if (next) p.insertBefore(node, next);
        else p.appendChild(node);
        return true;
      };

      const apply = () => {
        const waivedPanel = document.getElementById(IDS.WAIVED_PANEL);
        const historyPanel = document.getElementById(IDS.HISTORY_PANEL);
        if (!waivedPanel || !historyPanel) return;

        const waivedCol = closestCol(waivedPanel);
        const historyCol = closestCol(historyPanel);
        if (!waivedCol || !historyCol) return;

        if (historyCol.nextElementSibling === waivedCol) return;

        if (historyCol.parentElement) {
          insertAfter(historyCol, waivedCol);
          return;
        }

        const row = historyCol.closest('.row');
        if (row) row.appendChild(waivedCol);
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => apply();
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run };
    })();

    const featureWaivedDataset = (() => {
      const TBL_ID = 'ctl00_MainContainer_gvWaiVeredCourse';
      const COL = { CODE: 1, CREDIT: 3 };

      const read = () => {
        const table = document.getElementById(TBL_ID);

        state.WAIVED = new Set();
        state.WAIVED_MAP = Object.create(null);

        if (!table) return false;

        const rows = Array.from(table.querySelectorAll('tbody tr'))
          .filter(tr => tr.cells && tr.cells.length >= 4 && !tr.querySelector('th'));

        rows.forEach(tr => {
          const code = H.canonCourse(tr.cells[COL.CODE]?.textContent || '');
          if (!code) return;
          const cr = H.num(tr.cells[COL.CREDIT]?.textContent || '');
          state.WAIVED.add(code);
          state.WAIVED_MAP[code] = Math.max(state.WAIVED_MAP[code] || 0, cr || 0);
        });

        return state.WAIVED.size > 0;
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => read();
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run };
    })();

    const featureTableEnhancer = (() => {
      const ensureSearchRow = (table) => {
        if (!table || table.dataset.ActualGUMSSearchRow === '1') return;
        table.dataset.ActualGUMSSearchRow = '1';

        const thead = H.ensureHead(table);
        const headRow = thead?.rows?.[thead.rows.length - 1];
        if (!headRow) return;

        const row = thead.insertRow(0);
        const cell = row.insertCell(0);
        cell.colSpan = headRow.cells.length;

        const box = document.createElement('input');
        box.type = 'search';
        box.placeholder = 'Search…';
        box.className = 'ActualGUMS-input';
        cell.appendChild(box);

        H.makeClearable(box);

        Core.on(box, 'input', () => {
          const q = (box.value || '').trim().toUpperCase();
          const rows = Array.from(table.tBodies[0]?.rows || []);
          rows.forEach(r => { r.style.display = (!q || r.textContent.toUpperCase().includes(q)) ? '' : 'none'; });
        });
      };

      const makeSortable = (table) => {
        if (!table || table.dataset.ActualGUMSSortable === '1') return;
        table.dataset.ActualGUMSSortable = '1';

        const coll = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        const thead = H.ensureHead(table);
        const head = thead?.rows?.[thead.rows.length - 1];
        if (!head) return;

        const dir = Object.create(null);
        const body = table.tBodies[0];
        if (!body) return;

        const rows = () => Array.from(body.rows);

        const sortIcons = [];
        const iconByIdx = new Map();

        const ensureSortIcon = (th, idx) => {
          let icon = th._ActualGUMSSortIcon;
          if (icon && icon.isConnected) {
            iconByIdx.set(idx, icon);
            return icon;
          }
          icon = document.createElement('span');
          icon.className = 'ActualGUMS-mi ActualGUMS-sort-ind';
          icon.setAttribute('data-ActualGUMSSort', '1');
          icon.textContent = 'unfold_more';
          th.appendChild(icon);
          th._ActualGUMSSortIcon = icon;
          iconByIdx.set(idx, icon);
          sortIcons.push(icon);
          return icon;
        };

        const setActiveIcon = (idx, asc) => {
          sortIcons.forEach(i => {
            i.textContent = 'unfold_more';
            i.classList.remove('ActualGUMS-sort-active');
          });
          const icon = iconByIdx.get(idx) || head.cells[idx]?._ActualGUMSSortIcon;
          if (!icon) return;
          icon.textContent = asc ? 'arrow_upward' : 'arrow_downward';
          icon.classList.add('ActualGUMS-sort-active');
        };

        const strip = (s) => H.stripRepeat(String(s || ''));

        Array.from(head.cells).forEach((th, idx) => {
          th.style.cursor = 'pointer';
          ensureSortIcon(th, idx);

          Core.on(th, 'click', (e) => {
            if (e?.target?.closest?.('[data-ActualGUMSEye="1"], .ActualGUMS-unhide')) return;

            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            dir[idx] = !dir[idx];

            const label = (th.textContent || '').trim().toUpperCase();
            const type =
              label.includes('GRADE') ? 'grade' :
                label.includes('COURSE CODE') ? 'code' :
                  'auto';

            const sorted = rows().sort((a, b) => {
              const A0 = a.cells[idx]?.textContent.trim() ?? '';
              const B0 = b.cells[idx]?.textContent.trim() ?? '';
              const A = strip(A0);
              const B = strip(B0);

              if (type === 'grade') {
                const ra = CFG.GRADE_RANK[H.upper(A)] ?? 0;
                const rb = CFG.GRADE_RANK[H.upper(B)] ?? 0;
                return (dir[idx] ? 1 : -1) * (ra - rb);
              }

              if (type === 'code') {
                const aa = strip(A).split('(')[0].split('-')[0].trim();
                const bb = strip(B).split('(')[0].split('-')[0].trim();
                return (dir[idx] ? 1 : -1) * coll.compare(aa, bb);
              }

              const aN = parseFloat(A.replace(/[^\d.-]/g, ''));
              const bN = parseFloat(B.replace(/[^\d.-]/g, ''));
              const cmp = (!Number.isNaN(aN) && !Number.isNaN(bN)) ? (aN - bN) : coll.compare(A, B);

              return (dir[idx] ? 1 : -1) * cmp;
            });

            sorted.forEach(r => body.appendChild(r));
            setActiveIcon(idx, dir[idx]);
          }, true);
        });
      };

      const setColHidden = (table, idx, hidden) => {
        if (!table || idx == null || idx < 0) return;

        const key = 'col' + idx;
        const cur = table.dataset[key] === '1';
        if (cur === !!hidden) return;

        table.dataset[key] = hidden ? '1' : '0';
        Core.qa('tr', table).forEach(r => {
          if (!r.cells[idx]) return;
          r.cells[idx].style.display = hidden ? 'none' : '';
        });
      };

      const unhideButtons = (table) => {
        table.querySelectorAll('.ActualGUMS-unhide').forEach(n => n.remove());

        const ths = Array.from(table.querySelectorAll('thead tr:last-child th'));
        let i = 0;

        while (i < ths.length) {
          while (i < ths.length && table.dataset['col' + i] !== '1') i++;
          if (i >= ths.length) break;

          const start = i;
          while (i < ths.length && table.dataset['col' + i] === '1') i++;
          const end = i - 1;

          const host = ths[start > 0 ? start - 1 : end];
          if (!host) continue;
          host.style.position = 'relative';

          const btn = document.createElement('span');
          btn.className = 'ActualGUMS-mi ActualGUMS-unhide';
          btn.textContent = 'chevron_right';
          Object.assign(btn.style, {
            position: 'absolute', right: '-8px', top: '50%',
            transform: 'translateY(-50%)', background: '#fff',
            border: '1px solid rgba(12,122,95,.35)', borderRadius: '50%',
            fontSize: '14px', cursor: 'pointer', padding: '2px', zIndex: '3'
          });

          Core.on(btn, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            for (let j = start; j <= end; j++) setColHidden(table, j, false);
            unhideButtons(table);
          });

          host.appendChild(btn);
        }
      };

      const addColumnToggles = (table, hideCols = []) => {
        if (!table || table.dataset.ActualGUMSColToggles === '1') return;
        table.dataset.ActualGUMSColToggles = '1';

        const thead = H.ensureHead(table);
        const head = thead?.rows?.[thead.rows.length - 1];
        if (!head) return;

        const addEye = (th, i) => {
          if (th.querySelector('[data-ActualGUMSEye="1"]')) return;
          const eye = document.createElement('span');
          eye.className = 'ActualGUMS-mi';
          eye.dataset.ActualGUMSEye = '1';
          eye.textContent = 'visibility';
          Object.assign(eye.style, { cursor: 'pointer', fontSize: '16px', marginLeft: '4px', opacity: '.35' });
          th.appendChild(eye);

          Core.on(eye, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const nowHidden = table.dataset['col' + i] !== '1';
            setColHidden(table, i, nowHidden);
            unhideButtons(table);
          });
        };

        Array.from(head.cells).forEach((th, i) => addEye(th, i));
        hideCols.forEach(i => setColHidden(table, i, true));
        unhideButtons(table);
      };

      const ensureScrollWrap = (table) => {
        if (!table || table.parentElement?.dataset?.ActualGUMSScrollWrap) return;
        const holder = document.createElement('div');
        holder.dataset.ActualGUMSScrollWrap = '1';
        holder.style.cssText = 'width:100%;overflow-x:auto';
        table.parentNode.insertBefore(holder, table);
        holder.appendChild(table);
      };

      const enhance = (table, opts = {}) => {
        if (!table) return;
        const { hideCols = [], sort = true, search = true, toggles = true } = opts;
        H.ensureHead(table);
        if (search) ensureSearchRow(table);
        if (sort) makeSortable(table);
        if (toggles) addColumnToggles(table, hideCols);
        ensureScrollWrap(table);
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => {
        const table = H.getTable();
        if (!table) return;
        enhance(table, CFG.TABLE_ENHANCER_DEFAULTS);
      };
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run, enhance };
    })();

    const featureSummaryCard = (() => {
      const isPassAttempt = (t) => CFG.PASS_GRADES.has(H.upper(t.grade));

      const isRunningAttempt = (t) =>
        H.isEmpty(t.grade) && /RUNNING(\s*COURSE)?\b/.test(H.upper(t.status));

      const isFailedAttempt = (t) => {
        const g = H.upper(t.grade);
        const st = H.upper(t.status);
        if (CFG.FAIL_GRADES.has(g)) return true;
        return H.isEmpty(t.grade) && st === 'W';
      };

      const isDroppedAttempt = (t) =>
        H.isEmpty(t.grade) && /^DP\b/.test(H.upper(t.status));

      const isDroppedOnlyCourse = (tries = []) =>
        tries.length > 0 && tries.every(isDroppedAttempt);

      const bucketForCourse = (tries = []) => {
        if (tries.some(isPassAttempt)) return null;
        if (tries.some(isRunningAttempt)) return 'Running';
        if (tries.some(isFailedAttempt)) return 'Failed';
        if (!isDroppedOnlyCourse(tries)) return 'Others';
        return 'Dropped';
      };

      const chips = (codes) => {
        const uniq = Array.from(new Set(codes || [])).sort();
        if (!uniq.length) return `<span style="color:var(--ActualGUMS-muted)">None</span>`;
        return uniq.map(cd => `<span class="ActualGUMS-chip">${cd}</span>`).join('');
      };

      const groupsHTML = (attempts, codes) => {
        const groups = { Running: [], Failed: [], Dropped: [], Others: [] };

        (codes || []).forEach(code => {
          const b = bucketForCourse(attempts[code] || []);
          if (!b) return;
          (groups[b] ||= []).push(code);
        });

        const line = (label, list) => Core.html`
          <div style="display:grid;grid-template-columns:${CFG.ATTEMPT_LINE_LABEL_W} 1fr;column-gap:10px;align-items:start;margin:6px 0 10px">
            <div style="font-weight:800;color:var(--ActualGUMS-muted);white-space:nowrap">${label} (${(list || []).length}) :</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px 8px;margin-top:1px">${chips(list)}</div>
          </div>
        `;

        return (
          line('Running', groups.Running) +
          line('Failed', groups.Failed) +
          line('Dropped', groups.Dropped) +
          line('Others', groups.Others)
        );
      };

      const mount = (table, completedCredits, attempts) => {
        if (!table) return;

        const existing = Core.q('#ActualGUMSSummaryPanel');
        if (existing) existing.remove();

        const completed = completedCredits || 0;
        const left = Math.max(0, CFG.TOTAL_CREDITS_TARGET - completed).toFixed(2);

        const attemptedNotPassedUniq = Object.keys(attempts || {}).filter(code => !isSatisfied(code));
        const count = attemptedNotPassedUniq.length;

        const wrap = document.createElement('div');
        wrap.id = 'ActualGUMSSummaryPanel';
        wrap.className = 'ActualGUMS-card';
        wrap.style.cssText = 'margin:15px 0;padding:14px 18px;color:var(--ActualGUMS-green)';

        const missingLine = !state.SYL_OK
          ? `<div style="margin:10px 0 8px;font-weight:900;color:var(--ActualGUMS-red)">${CFG.MISSING_MSG}</div>`
          : '';

        const remainingBlock = (() => {
          if (!state.SYL_OK) return '';

          const remainingMandatory = state.ALL.filter(c =>
            c.reqType === 'MANDATORY' && !isSatisfied(c.code)
          );

          const unmetPools = state.REQ.reduce((acc, g) => {
            const doneCr = (g.courses || [])
              .filter(c => isSatisfied(c.code))
              .reduce((s, c) => s + (c.credits || 0), 0);
            const need = (g.creditsNeeded || 0) - doneCr;
            if (need > 0 && (g.courses || []).some(c => c.reqType === 'ELECTIVE')) acc.push({ name: g.name, credits: need });
            return acc;
          }, []);

          const items = [
            ...remainingMandatory.map(c => c.code),
            ...unmetPools.map(p => p.name)
          ];

          return Core.html`
            <div style="margin-top:20px">
              <b>Remaining Mandatory Courses:</b>
              <div style="display:flex;flex-wrap:wrap;gap:4px 8px;margin:6px 0 8px">
                ${items.map(s => `<span class="ActualGUMS-chip">${s}</span>`).join('') || 'All satisfied!'}
              </div>
            </div>
          `;
        })();

        wrap.innerHTML = Core.html`
          <div style="display:flex;gap:12px;align-items:center;font-size:15px">
            <span style="background:var(--ActualGUMS-green);color:#fff;padding:2px 8px;border-radius:14px;font-weight:700;font-size:13px">
              ${completed.toFixed(2)} cr completed
            </span>
            <span style="background:${left === '0.00' ? 'var(--ActualGUMS-green)' : 'var(--ActualGUMS-red)'};color:#fff;padding:2px 8px;border-radius:14px;font-weight:700;font-size:13px">
              ${left} cr left
            </span>
          </div>
          ${missingLine}
          ${remainingBlock}

          <div style="margin-top:20px">
            <b>Incomplete Attempted Courses: ${count}</b>
            <div style="margin-top:6px">
              ${groupsHTML(attempts, attemptedNotPassedUniq)}
            </div>
          </div>
        `;

        table.parentElement?.insertBefore(wrap, table);
      };

      const ensure = () => {};
      const bind = () => {};
      const sync = () => {};
      const run = () => { ensure(); bind(); sync(); };

      return { run, mount, isPassAttempt, isRunningAttempt, isFailedAttempt, isDroppedAttempt, isDroppedOnlyCourse };
    })();

    const featureSyllabusCatalogue = (() => {
      const tone = (code) =>
        isSatisfied(code) ? 'var(--ActualGUMS-green)' :
          state.ATTEMPTED_NOT_PASSED.has(code) ? 'var(--ActualGUMS-red)' :
            'var(--ActualGUMS-muted)';

      const buildMissingHTML = () => Core.html`
        <div style="display:flex;align-items:center;justify-content:space-between">
          <h3 style="margin:4px 0 8px;font:800 20px/1.15 'Segoe UI',system-ui;color:var(--ActualGUMS-green)">
            All Required Courses
          </h3>
        </div>
        <div style="margin:8px 0 2px;font-weight:900;color:var(--ActualGUMS-red)">${CFG.MISSING_MSG}</div>
      `;

      const buildHTML = () => {
        if (!state.SYL_OK) return buildMissingHTML();

        let out = Core.html`
          <div style="display:flex;align-items:center;justify-content:space-between">
            <h3 style="margin:4px 0 8px;font:800 20px/1.15 'Segoe UI',system-ui;color:var(--ActualGUMS-green)">
              All Required Courses${state.SYL_CODE ? ` (${state.SYL_CODE} SYLLABUS)` : ''}
            </h3>
            <span id="ActualGUMSToggleBtn" class="ActualGUMS-mi" title="Collapse/Expand all">remove_circle_outline</span>
          </div>
          <input id="ActualGUMSCatalogueSearch" class="ActualGUMS-input" placeholder="Search…" style="margin:4px 0 10px">
          <div style="display:grid;grid-template-columns:1fr 90px 90px;font-weight:700;border-bottom:2px solid var(--ActualGUMS-border);padding:6px 0;margin-bottom:4px;color:var(--ActualGUMS-muted)">
            <div>Category</div><div style="text-align:center">Courses</div><div style="text-align:right">Credits</div>
          </div>
        `;

        for (const g of state.REQ) {
          const done = (g.courses || []).filter(c => isSatisfied(c.code));
          const doneCr = done.reduce((s, c) => s + (c.credits || 0), 0);

          out += Core.html`
            <details open>
              <summary style="display:grid;grid-template-columns:1fr 90px 90px;align-items:center;padding:8px 2px;font-size:14px;cursor:pointer;color:var(--ActualGUMS-muted);font-weight:800">
                <span>${g.name}</span>
                <span style="text-align:center">${done.length}/${g.coursesNeeded}</span>
                <span style="text-align:right">${doneCr}/${g.creditsNeeded}</span>
              </summary>

              <table style="width:100%;border-collapse:collapse;font-size:14px;margin:4px 0 6px;table-layout:fixed">
                <colgroup>
                  <col style="width:90px">
                  <col>
                  <col style="width:64px">
                  <col style="width:70px">
                </colgroup>
                <tbody>
                  ${(g.courses || []).map(c => Core.html`
                    <tr style="color:${tone(c.code)}">
                      <td style="white-space:nowrap">${c.code}</td>
                      <td>${c.title}</td>
                      <td style="text-align:right;padding-right:8px">
                        ${state.GRADE[c.code] ? `<span class="ActualGUMS-grade-badge">${state.GRADE[c.code]}</span>` : ''}
                      </td>
                      <td style="text-align:right">${c.credits}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </details>
          `;
        }
        return out;
      };

      const mount = () => {
        const anchor = Core.q(CFG.CATALOGUE_ANCHOR_SEL);
        if (!anchor) return;

        let box = Core.q('#ActualGUMSCourseCatalogue');
        if (!box) {
          box = document.createElement('div');
          box.id = 'ActualGUMSCourseCatalogue';
          box.className = 'ActualGUMS-card';
          box.style.cssText = 'margin:20px 0;padding:14px;border-style:dashed;background:#fff';
          anchor.insertAdjacentElement('afterend', box);
        }

        box.innerHTML = buildHTML();

        if (!state.SYL_OK) return;

        const search = box.querySelector('#ActualGUMSCatalogueSearch');
        H.makeClearable(search);

        Core.on(search, 'input', (e) => {
          const q = (e.target.value || '').trim().toUpperCase();
          box.querySelectorAll('details').forEach(det => {
            let hit = det.querySelector('summary')?.textContent.toUpperCase().includes(q) || false;
            det.querySelectorAll('tbody tr').forEach(tr => {
              const ok = tr.textContent.toUpperCase().includes(q);
              tr.style.display = ok ? '' : 'none';
              hit ||= ok;
            });
            det.style.display = hit ? '' : 'none';
            det.open = q ? hit : det.open;
          });
        });

        const toggle = box.querySelector('#ActualGUMSToggleBtn');
        Core.on(toggle, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const all = Array.from(box.querySelectorAll('details'));
          const anyOpen = all.some(d => d.open);
          all.forEach(d => (d.open = !anyOpen));
          toggle.textContent = anyOpen ? 'add_circle_outline' : 'remove_circle_outline';
        });
      };

      const ensure = () => {};
      const bind = () => {};
      const sync = () => {};
      const run = () => { ensure(); bind(); sync(); };

      return { run, mount };
    })();

    const featureHistoryAnalyzer = (() => {
      const readAttempts = (table) => {
        const rows = Array.from(table.querySelectorAll('tbody tr'))
          .filter(r => r.cells.length > 1 && (r.cells[0].textContent || '').trim() !== 'SL.');

        const attempts = Object.create(null);

        rows.forEach(tr => {
          const td = tr.cells;
          const rawCode = td[CFG.COL.COURSE_CODE]?.textContent || '';
          const code = H.canonCourse(rawCode);
          (attempts[code] ||= []).push({
            tr,
            credit: H.num(td[CFG.COL.CREDIT]?.textContent || ''),
            grade: String(td[CFG.COL.GRADE]?.textContent || '').trim(),
            status: String(td[CFG.COL.STATUS]?.textContent || '').trim()
          });
        });

        return attempts;
      };

      const addRepeatBadge = (tries) => {
        const n = (tries || []).length;
        (tries || []).forEach(t => {
          const td = t?.tr?.cells?.[CFG.COL.COURSE_CODE];
          if (!td) return;
          td.querySelectorAll('[data-ActualGUMSRepeat="1"]').forEach(x => x.remove());
          if (n <= 1) return;

          const b = document.createElement('span');
          b.dataset.ActualGUMSRepeat = '1';
          b.className = 'ActualGUMS-repeat-badge';
          b.textContent = '×' + n;
          b.style.marginLeft = '8px';
          b.style.cssText = 'margin-left:6px;font-size:12px;padding:1px 6px;opacity:.85';
          td.appendChild(b);
        });
      };

      const courseLabel = (tries) => {
        const up = (s) => H.upper(s);

        const bestPass = tries
          .filter(t => CFG.PASS_GRADES.has(up(t.grade)))
          .reduce((best, t) => (H.gradeRank(t.grade) > H.gradeRank(best?.grade) ? t : best), null);

        if (bestPass?.grade) return up(bestPass.grade);
        if (tries.some(featureSummaryCard.isRunningAttempt)) return 'RUNNING';
        if (tries.some(t => CFG.FAIL_GRADES.has(up(t.grade)))) return up(tries.find(t => CFG.FAIL_GRADES.has(up(t.grade)))?.grade || '');
        if (tries.every(featureSummaryCard.isDroppedAttempt)) return 'DP';
        return up(tries[0]?.grade) || up(tries[0]?.status) || '';
      };

      const apply = (table, flags) => {
        if (!table) return;

        const attempts = readAttempts(table);

        let completedCredits = 0;
        const passed = new Set();
        state.GRADE = Object.create(null);

        for (const [code, tries] of Object.entries(attempts)) {
          tries.forEach(t => H.clearRow(t.tr));

          const bestPass = tries
            .filter(featureSummaryCard.isPassAttempt)
            .reduce((best, t) => (H.gradeRank(t.grade) > H.gradeRank(best?.grade) ? t : best), null);

          if (flags.featureHistoryAnalyzer) {
            let courseColor = '';
            if (bestPass) {
              courseColor = CFG.HIGH_GRADES.has(H.upper(bestPass.grade)) ? CFG.COLOR.PASS : CFG.COLOR.SOFT;
            } else if (tries.some(featureSummaryCard.isRunningAttempt)) {
              courseColor = CFG.COLOR.RUN;
            } else if (tries.some(featureSummaryCard.isFailedAttempt)) {
              courseColor = CFG.COLOR.FAIL;
            } else if (featureSummaryCard.isDroppedOnlyCourse(tries)) {
              courseColor = CFG.COLOR.RUN;
            }

            if (courseColor) tries.forEach(t => H.paintRow(t.tr, courseColor));
            addRepeatBadge(tries);
          }

          if (bestPass) {
            passed.add(code);
            const credit = tries.reduce((mx, t) => Math.max(mx, t.credit || 0), 0);
            completedCredits += credit;
          }

          state.GRADE[code] = courseLabel(tries);
        }

        state.PASSED = passed;

        let waivedCredits = 0;
        state.WAIVED.forEach(code => {
          if (state.PASSED.has(code)) return;
          const cr = state.WAIVED_MAP[code] || state.MAP?.[code]?.credits || 0;
          waivedCredits += cr;
        });
        completedCredits += waivedCredits;

        state.WAIVED.forEach(code => {
          if (!state.GRADE[code]) state.GRADE[code] = 'WAIVED';
        });

        if (state.SYL_OK) {
          state.ATTEMPTED_NOT_PASSED = new Set(
            state.ALL
              .filter(c => attempts[c.code] && !isSatisfied(c.code))
              .map(c => c.code)
          );
        } else {
          state.ATTEMPTED_NOT_PASSED = new Set(Object.keys(attempts).filter(code => !isSatisfied(code)));
        }

        if (flags.featureSummaryCard) featureSummaryCard.mount(table, completedCredits, attempts);
        if (flags.featureSyllabusCatalogue) featureSyllabusCatalogue.mount();
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => {};
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run, apply };
    })();

    const init = (flags = {}) => {
      Theme.ensureBaseTheme();
      Theme.ensureMaterialIcons();
      injectLocalCSS.run();

      const run = () => {
        if (flags.featureMoveWaivedBelow) featureMoveWaivedBelow.run();

        const needsSyllabus = !!(flags.featureSummaryCard || flags.featureSyllabusCatalogue);
        if (needsSyllabus) loadDataset.run();

        featureWaivedDataset.run();

        const table = H.getTable();
        if (!table) return;

        const needsAnalysis = !!(flags.featureHistoryAnalyzer || flags.featureSummaryCard || flags.featureSyllabusCatalogue);
        if (needsAnalysis) featureHistoryAnalyzer.apply(table, flags);

        if (flags.featureTableEnhancer) featureTableEnhancer.enhance(table, CFG.TABLE_ENHANCER_DEFAULTS);
      };

      run();

      if (!Core.hookPRMOnce('_ActualGUMSSCHHooked', run)) {
        Core.observeOnce('_ActualGUMSSCHObs', document.documentElement, run);
      }
    };

    return { init };
  })();

  const PageAttendanceEntry = (() => {
    const CFG = {
      TABLE_ID: 'ctl00_MainContainer_gvStudentlists',
      CSS_ID: 'ActualGUMSAttendCSS',
    };

    const H = (() => {
      const getTable = () =>
        document.getElementById(CFG.TABLE_ID) ||
        Core.q(`table[id$="${CFG.TABLE_ID}"]`);

      const getHeaderRow = (tbl) =>
        tbl?.querySelector('tbody > tr:first-child') ||
        tbl?.querySelector('tr:first-child') ||
        null;

      const getDataRows = (tbl, idSel) =>
        Array.from(tbl?.querySelectorAll('tbody tr') || []).filter(r => r.querySelector(idSel));

      const applyAccentVars = () => {
        const pickByText = (needle) => {
          const all = Array.from(document.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"]'));
          const n = String(needle || '').trim().toLowerCase();
          return all.find(el => {
            const t = (el.tagName === 'INPUT' ? el.value : el.textContent) || '';
            return String(t).trim().toLowerCase() === n;
          }) || null;
        };

        const btn =
          document.getElementById('ctl00_MainContainer_btnLoadStudent') ||
          document.getElementById('ctl00_MainContainer_btnLoadStudents') ||
          Core.q('input[type="submit"][value="Load Students"]') ||
          pickByText('Load Students') ||
          null;

        if (!btn) return;

        const cs = getComputedStyle(btn);
        const bg = cs.backgroundColor;
        const br = cs.borderColor;

        if (bg && bg !== 'rgba(0, 0, 0, 0)') document.documentElement.style.setProperty('--ActualGUMS-attend-accent', bg);
        if (br && br !== 'rgba(0, 0, 0, 0)') document.documentElement.style.setProperty('--ActualGUMS-attend-accent-border', br);
      };

      const ensureStyles = Core.once(() => {
        Core.injectCSSOnce(
          `
          #ActualGUMSCopyStudentsInfoBtn{
            height:34px;
            padding:0 14px;
            display:inline-flex;
            align-items:center;
            gap:8px;
            border:0 !important;
            border-radius:9999px;
            background:var(--ActualGUMS-attend-accent, #3b7f8f) !important;
            color:#fff !important;
            box-shadow:0 1px 2px rgba(0,0,0,.12);
            font-weight:700;
            cursor:pointer;
            user-select:none;
            white-space:nowrap;
            margin-right:12px;
          }
          #ActualGUMSCopyStudentsInfoBtn:hover{ filter:brightness(.98); }
          #ActualGUMSCopyStudentsInfoBtn:active{ transform:translateY(1px); }
          #ActualGUMSCopyStudentsInfoBtn[disabled]{
            opacity:.65;
            cursor:not-allowed;
            transform:none;
          }
          #ActualGUMSCopyStudentsInfoBtn .glyphicon{ color:#fff !important; top:0; }
          #ActualGUMSCopyStudentsInfoBtn .ActualGUMS-btn-count{
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-width:22px;
            height:22px;
            padding:0 7px;
            border-radius:9999px;
            background:rgba(255,255,255,.22);
            color:#fff !important;
            font-weight:800;
            font-size:11px;
            line-height:22px;
          }

          .ActualGUMS-attend{ margin-top:8px; }
          #ActualGUMSMarkBtn{ font-weight:600; }
          #ActualGUMSMarkBtn[disabled]{ opacity:.75; cursor:not-allowed; }
          .ActualGUMS-att-td, .ActualGUMS-att-th{ text-align:center; }

          .ActualGUMS-attend .ActualGUMS-attend-wrap{ position:relative; width:100%; }
          .ActualGUMS-attend .ActualGUMS-attend-inp{ width:100%; padding-right:260px; }
          .ActualGUMS-attend .ActualGUMS-attend-actions{
            position:absolute;
            right:6px;
            top:50%;
            transform:translateY(-50%);
            display:flex;
            align-items:center;
            gap:6px;
          }
          .ActualGUMS-attend .ActualGUMS-inbtn{
            height:32px;
            line-height:30px;
            padding:0 12px;
            display:inline-flex;
            align-items:center;
            gap:8px;
            border:1px solid rgba(0,0,0,.12);
            border-radius:9999px;
            box-shadow:0 1px 1px rgba(0,0,0,.06);
            background:#fff;
          }
          .ActualGUMS-attend .ActualGUMS-inbtn:active{ box-shadow:none; }
          .ActualGUMS-attend .ActualGUMS-inbtn .glyphicon{ top:0; }

          .ActualGUMS-attend .ActualGUMS-clear{
            width:34px;
            padding:0;
            justify-content:center;
            border-radius:8px;
          }
          .ActualGUMS-attend .ActualGUMS-attend-wrap.ActualGUMS-empty .ActualGUMS-clear{ display:none; }

          #ActualGUMSMarkBtn.ActualGUMS-mark{
            background:var(--ActualGUMS-attend-accent, #0c7a5f) !important;
            border-color:var(--ActualGUMS-attend-accent-border, rgba(0,0,0,.12)) !important;
            color:#fff !important;
          }
          #ActualGUMSMarkBtn.ActualGUMS-mark:hover{ filter:brightness(.96); }
          #ActualGUMSMarkBtn.ActualGUMS-mark:active{ filter:brightness(.92); }

          #ActualGUMSMarkBtn .ActualGUMS-btn-count{
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-width:22px;
            height:22px;
            padding:0 7px;
            border-radius:9999px;
            background:rgba(255,255,255,.22);
            font-weight:700;
            font-size:11px;
            line-height:22px;
          }
          @media (max-width:520px){
            .ActualGUMS-attend .ActualGUMS-attend-inp{ padding-right:140px; }
            #ActualGUMSMarkBtn .ActualGUMS-btn-text{ display:none; }
          }
          `,
          CFG.CSS_ID
        );
        applyAccentVars();
      });

      const waitForTable = (cb) => {
        const t = getTable();
        if (t) return cb(t);
        Core.waitFor(`table[id$="${CFG.TABLE_ID}"]`, () => cb(getTable()));
      };

      return { getTable, getHeaderRow, getDataRows, ensureStyles, waitForTable, applyAccentVars };
    })();

    const featureCopyStudentsInfo = (() => {
      const CSS_ID = "ActualGUMSCopyStudentsInfoCSS";
      const BTN_ID = "ActualGUMSCopyStudentsInfoBtn";
      const HOST_ID = "ActualGUMSCopyStudentsInfoHost";
      const TABLE_ID = "ctl00_MainContainer_gvStudentlists";
      const TOP_TOTAL_SPAN_ID = "ctl00_MainContainer_lblPresentCount";

      const ensure = () => {
        if (document.getElementById(CSS_ID)) return;
        const style = document.createElement("style");
        style.id = CSS_ID;
        style.textContent = `
          #${HOST_ID}{
            display:flex;
            align-items:center;
            justify-content:flex-start;
            margin-top:5px;
          }
        `;
        document.head.appendChild(style);
      };

      const mount = () => {};
      const bind = () => {};

      const normalizeName = (s) => String(s || "").replace(/\s+/g, " ").trim();

      const isVisibleRow = (r) => {
        if (!r) return false;
        if (r.style && r.style.display === 'none') return false;
        const cs = getComputedStyle(r);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        return true;
      };

      const getStudents = () => {
        const table = document.getElementById(TABLE_ID);
        if (!table) return [];
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        const out = [];
        for (const tr of rows) {
          if (!isVisibleRow(tr)) continue;
          const rollEl = tr.querySelector('span[id$="lblStudentRoll"]');
          const nameEl = tr.querySelector('span[id$="lblFullName"]');
          if (!rollEl || !nameEl) continue;
          const id = String(rollEl.textContent || "").trim();
          const name = normalizeName(nameEl.textContent);
          if (!id || !name) continue;
          out.push({ id, name, email: `${id}@student.green.ac.bd` });
        }
        return out;
      };

      const buildTSV = () => {
        const students = getStudents();
        return students.map(s => `${s.id}\t${s.name}\t${s.email}`).join("\n");
      };

      const flashButton = (btn, ok) => {
        const textEl = btn?.querySelector?.(".ActualGUMS-btn-text");
        if (!btn || !textEl) return;

        if (!btn.dataset.ActualGUMSDefaultText) {
          const te = btn.querySelector(".ActualGUMS-btn-text");
          btn.dataset.ActualGUMSDefaultText = String(te?.textContent || "Copy Students Info").trim() || "Copy Students Info";
        }

        textEl.textContent = ok ? "Copied" : "Copy Failed";

        clearTimeout(btn.__ActualGUMSFlashT);
        btn.__ActualGUMSFlashT = setTimeout(() => {
          textEl.textContent = btn.dataset.ActualGUMSDefaultText || "Copy Students Info";
        }, 900);
      };

      const updateCount = (btn) => {
        const cntEl = btn.querySelector(".ActualGUMS-btn-count");
        if (cntEl) cntEl.textContent = String(getStudents().length);
      };

      const ensureButton = () => {
        let btn = document.getElementById(BTN_ID);
        if (!btn) {
          btn = document.createElement("button");
          btn.id = BTN_ID;
          btn.type = "button";
          btn.title = "Copy ID, Name, Email";
          btn.innerHTML = `
            <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
            <span class="ActualGUMS-btn-text">Copy Students Info</span>
            <span class="ActualGUMS-btn-count">0</span>
          `;
        } else {
          btn.type = "button";
        }

        if (!btn.__ActualGUMSBound) {
          btn.addEventListener("click", async () => {
            updateCount(btn);
            const ok = await Core.copyText(buildTSV());
            flashButton(btn, ok);
          });
          btn.__ActualGUMSBound = true;
        }
        return btn;
      };

      const getLeftColHost = () => {
        const totalSpan = document.getElementById(TOP_TOTAL_SPAN_ID);
        if (!totalSpan) return null;

        const outerFormRow = totalSpan.closest(".form-group.row") || totalSpan.closest(".row");
        if (!outerFormRow) return null;

        const cols = Array.from(outerFormRow.children).filter((el) =>
          /\bcol-md-4\b/.test(el.className || "")
        );
        const leftCol = cols[0] || outerFormRow.querySelector(".col-md-4") || outerFormRow;
        if (!leftCol) return null;

        let host = document.getElementById(HOST_ID);
        if (!host) {
          host = document.createElement("div");
          host.id = HOST_ID;
          leftCol.insertBefore(host, leftCol.firstChild);
        } else if (host.parentElement !== leftCol) {
          leftCol.insertBefore(host, leftCol.firstChild);
        }
        return host;
      };

      const placeButton = (btn) => {
        const host = getLeftColHost();
        if (!host) return;
        if (btn.parentElement !== host) host.appendChild(btn);
      };

      const installObserver = (() => {
        let installed = false;
        return () => {
          if (installed) return;
          installed = true;

          const tick = (() => {
            if (typeof Core.rafThrottle === 'function') return Core.rafThrottle;
            let t = 0;
            return (fn) => () => {
              clearTimeout(t);
              t = setTimeout(fn, 60);
            };
          })();

          const watch = () => {
            const btn = document.getElementById(BTN_ID);
            const table = document.getElementById(TABLE_ID);
            const totalSpan = document.getElementById(TOP_TOTAL_SPAN_ID);
            if (!btn || !table || !totalSpan) return;

            placeButton(btn);
            updateCount(btn);

            if (!table.__ActualGUMSObs) {
              table.__ActualGUMSObs = true;
              const obs = new MutationObserver(tick(() => {
                placeButton(btn);
                updateCount(btn);
              }));
              obs.observe(table, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
            }
          };

          const root = document.querySelector(".panel-body") || document.body;
          const obs = new MutationObserver(tick(watch));
          obs.observe(root, { childList: true, subtree: true });
          watch();
        };
      })();

      const sync = () => {
        ensure();
        const btn = ensureButton();
        placeButton(btn);
        updateCount(btn);
        installObserver();
      };

      const run = () => { ensure(); mount(); bind(); sync(); };
      return { run };
    })();

    const featureMarksPresented = (() => {
      const M = {
        BOX_ID: 'ActualGUMSAttendTools',
        INPUT_ID: 'ActualGUMSIdsInput',
        BTN_CLEAR_ID: 'ActualGUMSClearBtn',
        BTN_MARK_ID: 'ActualGUMSMarkBtn',
        DDL_CLASS_TYPE_ID: 'ctl00_MainContainer_ddlClassType',
        ROW_ID_SEL: 'span[id$="lblStudentRoll"]',
      };

      const click = (el) => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const parseIDs = (raw) => new Set((String(raw || '').match(/\b\d{6,}\b/g) || []).map(s => s.replace(/^0+/, '')));
      const BTN_LABEL = 'Mark IDs Presented';

      const getAbsentAllRadio = (tbl) => {
        if (!tbl) return null;

        const lab = Array.from(tbl.querySelectorAll('label')).find(l => /\bAbsent\s*All\b/i.test(l.textContent));
        if (lab) {
          const forId = lab.getAttribute('for');
          if (forId && document.getElementById(forId)) return document.getElementById(forId);
          const prev = lab.previousElementSibling;
          if (prev && prev.tagName === 'INPUT') return prev;
        }

        const group = tbl.querySelector(`table[id$="rdoStatusAll"]`);
        if (group) {
          const byLabel = Array.from(group.querySelectorAll('label')).find(l => /Absent/i.test(l.textContent));
          if (byLabel) {
            const id = byLabel.getAttribute('for');
            if (id && document.getElementById(id)) return document.getElementById(id);
          }
          const radios = group.querySelectorAll('input[type="radio"]');
          if (radios.length >= 2) return radios[1];
        }

        return null;
      };

      const getPresentRadioInRow = (row) => {
        const lab = Array.from(row.querySelectorAll('label')).find(l => /^\s*Present\s*$/i.test(l.textContent));
        if (lab) {
          const id = lab.getAttribute('for');
          if (id && document.getElementById(id)) return document.getElementById(id);
          const prev = lab.previousElementSibling;
          if (prev && prev.tagName === 'INPUT') return prev;
        }
        return row.querySelector('input[type="radio"][id$="_rdoStatus_0"]') || row.querySelector('input[type="radio"][value="1"]');
      };

      const getAbsentRadioInRow = (row) => {
        const lab = Array.from(row.querySelectorAll('label')).find(l => /^\s*Absent\s*$/i.test(l.textContent));
        if (lab) {
          const id = lab.getAttribute('for');
          if (id && document.getElementById(id)) return document.getElementById(id);
          const prev = lab.previousElementSibling;
          if (prev && prev.tagName === 'INPUT') return prev;
        }
        return row.querySelector('input[type="radio"][id$="_rdoStatus_1"]') || row.querySelector('input[type="radio"][value="0"]');
      };

      const markAllAbsentLocal = (tbl) => {
        const rows = H.getDataRows(tbl, M.ROW_ID_SEL);
        rows.forEach(r => {
          const a = getAbsentRadioInRow(r);
          if (a && !a.checked) click(a);
        });
      };

      const markIDsPresentLocal = (tbl, ids) => {
        const rows = H.getDataRows(tbl, M.ROW_ID_SEL);
        rows.forEach(r => {
          const id = r.querySelector(M.ROW_ID_SEL)?.textContent.trim();
          if (!id) return;
          if (ids.has(id)) {
            const p = getPresentRadioInRow(r);
            if (p && !p.checked) click(p);
          }
        });
      };

      let box = null;
      let pending = null;
      let fallbackTimer = null;

      const buildUI = () => {
        if (box) return box;

        box = document.createElement('div');
        box.id = M.BOX_ID;
        box.className = 'ActualGUMS-attend';

        box.innerHTML = `
          <label for="${M.INPUT_ID}" class="control-label" style="font-weight:600;">Attended IDs</label>
          <div class="ActualGUMS-attend-wrap ActualGUMS-empty">
            <input id="${M.INPUT_ID}" class="form-control ActualGUMS-attend-inp"
                   placeholder="Paste IDs separated by commas, spaces, or new lines. I’ll set Absent All first, then mark these as Present"
                   title="Paste IDs separated by commas, spaces, or new lines. I’ll set Absent All first, then mark these as Present.">
            <div class="ActualGUMS-attend-actions">
              <button id="${M.BTN_CLEAR_ID}" type="button" class="ActualGUMS-inbtn ActualGUMS-clear" title="Clear">
                <span class="glyphicon glyphicon-remove"></span>
                <span class="sr-only">Clear</span>
              </button>
              <button id="${M.BTN_MARK_ID}" type="button" class="ActualGUMS-inbtn ActualGUMS-mark">
                <span class="glyphicon glyphicon-ok"></span>
                <span class="ActualGUMS-btn-text">Mark IDs Presented</span>
                <span class="ActualGUMS-btn-count">0</span>
              </button>
            </div>
          </div>
        `;

        const wrap = box.querySelector('.ActualGUMS-attend-wrap');
        const input = box.querySelector('#' + M.INPUT_ID);
        const clearBtn = box.querySelector('#' + M.BTN_CLEAR_ID);
        const markBtn = box.querySelector('#' + M.BTN_MARK_ID);
        const txt = markBtn?.querySelector('.ActualGUMS-btn-text');
        const badge = markBtn?.querySelector('.ActualGUMS-btn-count');

        const updateCount = () => {
          const idsCount = parseIDs(input?.value).size;

          if (badge) badge.textContent = String(idsCount);
          if (txt) txt.textContent = BTN_LABEL;

          const empty = !String(input?.value || '').trim();
          if (wrap) wrap.classList.toggle('ActualGUMS-empty', empty);

          const busy = markBtn?.dataset?.ActualGUMSBusy === '1';
          if (markBtn) markBtn.disabled = busy || idsCount === 0;
        };

        box.addEventListener('input', (e) => {
          if (e.target && e.target.id === M.INPUT_ID) updateCount();
        });

        clearBtn?.addEventListener('click', () => {
          if (!input) return;
          input.value = '';
          updateCount();
          input.focus();
        });

        markBtn?.addEventListener('click', () => {
          if (!input || !markBtn || !txt) return;

          const ids = parseIDs(input.value);
          if (!ids.size) return;

          pending = { ids };
          markBtn.dataset.ActualGUMSBusy = '1';
          markBtn.disabled = true;
          txt.textContent = `Marking ${ids.size} ID${ids.size === 1 ? '' : 's'}…`;

          const tbl = H.getTable();
          if (!tbl) {
            markBtn.dataset.ActualGUMSBusy = '0';
            updateCount();
            alert('Student list not found.');
            return;
          }

          const absAll = getAbsentAllRadio(tbl);
          if (absAll && !absAll.checked) {
            click(absAll);
            if (fallbackTimer) clearTimeout(fallbackTimer);
            fallbackTimer = setTimeout(() => continuePending(), 3000);
            return;
          }

          markAllAbsentLocal(tbl);
          markIDsPresentLocal(tbl, ids);
          pending = null;
          markBtn.dataset.ActualGUMSBusy = '0';
          updateCount();
        });

        updateCount();
        return box;
      };

      const findHost = () => {
        const ddl = document.getElementById(M.DDL_CLASS_TYPE_ID);
        if (!ddl) return null;

        const row = ddl.closest('.row');
        if (!row) return null;

        let hostRow = row.nextElementSibling;
        if (!hostRow || !hostRow.classList.contains('ActualGUMS-attend-row')) {
          hostRow = document.createElement('div');
          hostRow.className = 'row ActualGUMS-attend-row';
          const col = document.createElement('div');
          col.className = 'col-sm-12';
          hostRow.appendChild(col);
          row.parentNode.insertBefore(hostRow, row.nextSibling);
        }

        row.querySelectorAll('.col-lg-4, .col-md-4, .col-sm-4').forEach(c => { c.style.display = ''; });
        return hostRow.querySelector('.col-sm-12') || hostRow;
      };

      const ensurePlaced = () => {
        const host = findHost();
        if (!host) return;

        buildUI();
        if (box && !box.isConnected) host.appendChild(box);

        const tbl = H.getTable();
        const hasRows = !!(tbl && tbl.querySelector(`tbody tr ${M.ROW_ID_SEL}`));
        if (box) box.style.display = hasRows ? '' : 'none';
      };

      const continuePending = () => {
        if (!pending?.ids) return;

        const tbl = H.getTable();
        if (!tbl) return;

        markAllAbsentLocal(tbl);
        markIDsPresentLocal(tbl, pending.ids);

        pending = null;
        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = null;

        const btn = document.getElementById(M.BTN_MARK_ID);
        const input = document.getElementById(M.INPUT_ID);
        const txt = btn?.querySelector('.ActualGUMS-btn-text');
        const badge = btn?.querySelector('.ActualGUMS-btn-count');

        if (btn && txt && input) {
          btn.dataset.ActualGUMSBusy = '0';
          txt.textContent = BTN_LABEL;
          if (badge) badge.textContent = String(parseIDs(input.value).size);
          btn.disabled = parseIDs(input.value).size === 0;
        }
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => { ensurePlaced(); continuePending(); };
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run };
    })();

    const featureAttendanceMarks = (() => {
      const A = {
        CSS_ID: 'ActualGUMSAttendMarksHeadCSS',
        INPUT_CLASSES: 'ActualGUMSAttend_totalClasses',
        INPUT_MARKS: 'ActualGUMSAttend_totalMarks',
        BTN_COPY: 'ActualGUMSAttend_copyMarks',
        PREF_KEY_PREFIX: 'ActualGUMS:attMarks',
        MOUNT_KEY: 'ActualGUMSAttHdrMounted',
      };

      const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
      const num = (s) => {
        const t = String(s ?? '').trim();
        const m = t.match(/-?\d+(\.\d+)?/);
        return m ? Number(m[0]) : 0;
      };

      const keyFor = (tbl) => {
        const course = Core.q('span[id$="_lblCourseCode"]', tbl)?.textContent.trim() || 'unknown';
        return `${A.PREF_KEY_PREFIX}:${location.host}${location.pathname}:${course}`;
      };

      const loadPrefs = (tbl) => { try { return JSON.parse(localStorage.getItem(keyFor(tbl)) || '{}') || {}; } catch { return {}; } };
      const savePrefs = (tbl, prefs) => { try { localStorage.setItem(keyFor(tbl), JSON.stringify(prefs || {})); } catch { } };

      const findAbsentIndex = (headRow) => {
        const ths = [...headRow.children];
        for (let i = 0; i < ths.length; i++) {
          if (ths[i].textContent.trim().toLowerCase().includes('absent count')) return i;
        }
        return -1;
      };

      const buildMarksPayload = (tbl) => {
        const rows = Array.from(tbl.querySelectorAll("tbody > tr")).slice(1);
        const lines = [];

        for (const tr of rows) {
          const id =
            (tr.querySelector('span[id$="_lblStudentRoll"]') ||
              tr.querySelector('span[id$="lblStudentRoll"]'))
              ?.textContent?.trim() || "";
          if (!id) continue;

          const mkRaw = (tr.querySelector('td[data-att-marks]')?.textContent || "");
          const mk = mkRaw.trim();

          lines.push(mk === "-" ? "" : mk);
        }

        return lines.join("\n");
      };

      const ensureStyles = Core.once(() => {
        Core.injectCSSOnce(
          `
          table[id$="${CFG.TABLE_ID}"] th[data-att-pct],
          table[id$="${CFG.TABLE_ID}"] th[data-att-marks]{
            text-align:center;
            vertical-align:middle;
          }

          table[id$="${CFG.TABLE_ID}"] td[data-att-pct],
          table[id$="${CFG.TABLE_ID}"] td[data-att-marks]{
            text-align:center;
          }

          .ActualGUMS-att-hwrap{
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:6px;
            white-space:nowrap;
          }
          .ActualGUMS-att-htitle{
            font-weight:inherit;
            line-height:1.1;
          }
          .ActualGUMS-att-hctrl{
            display:flex;
            align-items:center;
            justify-content:center;
            gap:6px;
            white-space:nowrap;
          }
          .ActualGUMS-att-lbl{
            font-size:12px;
            font-weight:inherit;
            line-height:1;
          }

          .ActualGUMS-att-inp{
            width:7ch;
            min-width:7ch;
            max-width:7ch;
            height:22px;
            padding:1px 4px;
            font-size:12px;
            text-align:center;
            line-height:1.1;
            border-radius:3px;
            border:1px solid rgba(0,0,0,.25);
            box-shadow:none;
            background:#fff !important;
            color:#111 !important;
            caret-color:#111;
          }

          .ActualGUMS-att-inp::placeholder{
            color:rgba(0,0,0,.45) !important;
          }

          .ActualGUMS-att-copybtn{
            height:22px;
            padding:1px 8px;
            font-size:12px;
            line-height:1.1;
            border-radius:3px;
            background:transparent;
            border:1px solid rgba(255,255,255,.92);
            color:#fff;
          }
          .ActualGUMS-att-copybtn:hover{
            background:rgba(255,255,255,.14);
            color:#fff;
          }
          .ActualGUMS-att-copybtn .glyphicon{ top:0; }
          `,
          A.CSS_ID
        );
      });

      const ensureHeaderCols = (tbl) => {
        const headRow = H.getHeaderRow(tbl);
        if (!headRow) return;

        const idxAbsent = findAbsentIndex(headRow);
        if (idxAbsent < 0) return;

        if (!headRow.children[idxAbsent + 1]?.dataset?.attPct) {
          const thPct = document.createElement('th');
          thPct.dataset.attPct = '1';
          thPct.className = 'ActualGUMS-att-th';
          thPct.style.width = '100px';
          thPct.textContent = 'Attendance %';
          headRow.children[idxAbsent].insertAdjacentElement('afterend', thPct);
        }

        if (!headRow.children[idxAbsent + 2]?.dataset?.attMarks) {
          const thMarks = document.createElement('th');
          thMarks.dataset.attMarks = '1';
          thMarks.className = 'ActualGUMS-att-th';
          thMarks.style.width = '100px';
          thMarks.textContent = 'Attendance Marks';
          headRow.children[idxAbsent + 1].insertAdjacentElement('afterend', thMarks);
        }
      };

      const ensureRowCols = (tbl) => {
        const spans = Array.from(tbl.querySelectorAll('span[id$="_lblAbsentCount"], span[id$="lblAbsentCount"]'));
        for (const sp of spans) {
          const tdAbsent = sp.closest('td');
          if (!tdAbsent) continue;

          let tdPct = tdAbsent.nextElementSibling;
          if (!tdPct || !tdPct.dataset.attPct) {
            tdPct = document.createElement('td');
            tdPct.dataset.attPct = '1';
            tdPct.className = 'ActualGUMS-att-td';
            tdAbsent.insertAdjacentElement('afterend', tdPct);
          }

          let tdMarks = tdPct.nextElementSibling;
          if (!tdMarks || !tdMarks.dataset.attMarks) {
            tdMarks = document.createElement('td');
            tdMarks.dataset.attMarks = '1';
            tdMarks.className = 'ActualGUMS-att-td';
            tdPct.insertAdjacentElement('afterend', tdMarks);
          }
        }
      };

      const ceilToStep = (x, step = 0.25) => {
        const k = 1 / step;
        return Math.ceil((x + 1e-9) * k) / k;
      };

      const fmtMarks = (x) => {
        if (x == null || Math.abs(x) < 1e-9) return '-';
        const v = Math.round(x * 100) / 100;
        return v.toFixed(2).replace(/\.?0+$/, '');
      };

      const compute = (tbl, prefs) => {
        const T = Math.floor(Number(prefs.totalClasses || 0));
        const M = Number(prefs.totalMarks || 0);

        const rows = Array.from(tbl.querySelectorAll('tbody > tr')).slice(1);

        for (const tr of rows) {
          const sp = tr.querySelector('span[id$="_lblAbsentCount"], span[id$="lblAbsentCount"]');
          if (!sp) continue;

          const tdAbsent = sp.closest('td');
          const tdPct = tdAbsent?.nextElementSibling;
          const tdMarks = tdPct?.nextElementSibling;
          if (!tdPct || !tdMarks) continue;

          if (!T || T <= 0 || !isFinite(T) || !M || M <= 0 || !isFinite(M)) {
            tdPct.textContent = '-';
            tdMarks.textContent = '-';
            continue;
          }

          const absent = num(sp.textContent);
          const attended = clamp(T - absent, 0, T);
          const pct = (attended / T) * 100;

          tdPct.textContent = Math.round(pct) + '%';

          let marks;
          if (pct >= 90) marks = M;
          else if (pct < 40) marks = 0;
          else {
            const raw = ((pct - 40) / 50) * M;
            const rounded = ceilToStep(raw, 0.25);
            const cap = M - 0.25;
            marks = Math.min(rounded, cap);
            marks = Math.max(0, Math.min(M, marks));
          }
          tdMarks.textContent = fmtMarks(marks);
        }
      };

      const initTooltips = (els) => {
        const $ = window.jQuery;
        if (!$ || !$.fn || typeof $.fn.tooltip !== 'function') return;
        els.forEach(el => {
          try { $(el).tooltip('dispose'); } catch { }
          try { $(el).tooltip({ container: 'body', trigger: 'hover focus' }); } catch { }
        });
      };

      const flashCopyBtn = (btn, ok) => {
        if (!btn) return;

        const textEl =
          btn.querySelector('.ActualGUMS-btn-text') ||
          btn.querySelector('span:not(.glyphicon)');

        if (!textEl) return;

        if (!btn.dataset.ActualGUMSDefaultText || /copied|failed/i.test(btn.dataset.ActualGUMSDefaultText)) {
          const cur = String(textEl.textContent || '').trim();
          btn.dataset.ActualGUMSDefaultText = /copied|failed/i.test(cur) ? 'Copy' : (cur || 'Copy');
        }

        textEl.textContent = ok ? 'Copied' : 'Copy Failed';

        clearTimeout(btn.__ActualGUMSFlashT);
        btn.__ActualGUMSFlashT = setTimeout(() => {
          const base = btn.dataset.ActualGUMSDefaultText || 'Copy';
          textEl.textContent = base;
        }, 900);
      };

      const mountHeaderControls = (tbl, prefs) => {
        const headRow = H.getHeaderRow(tbl);
        if (!headRow) return;

        const thPct = headRow.querySelector('th[data-att-pct]');
        const thMarks = headRow.querySelector('th[data-att-marks]');
        if (!thPct || !thMarks) return;

        if (thPct.dataset[A.MOUNT_KEY] === '1' && thMarks.dataset[A.MOUNT_KEY] === '1') return;

        thPct.innerHTML = `
          <div class="ActualGUMS-att-hwrap">
            <div class="ActualGUMS-att-htitle">Attendance %</div>
            <div class="ActualGUMS-att-hctrl">
              <span class="ActualGUMS-att-lbl">Classes:</span>
              <input id="${A.INPUT_CLASSES}" class="ActualGUMS-att-inp"
                     type="text" inputmode="numeric"
                     data-toggle="tooltip" title="Total Classes" aria-label="Total Classes">
            </div>
          </div>
        `;

        thMarks.innerHTML = `
          <div class="ActualGUMS-att-hwrap">
            <div class="ActualGUMS-att-htitle">Attendance Marks</div>
            <div class="ActualGUMS-att-hctrl">
              <span class="ActualGUMS-att-lbl">Marks:</span>
              <input id="${A.INPUT_MARKS}" class="ActualGUMS-att-inp"
                     type="text" inputmode="decimal"
                     data-toggle="tooltip" title="Total Marks" aria-label="Total Marks">
              <button id="${A.BTN_COPY}" type="button"
                      class="ActualGUMS-att-copybtn"
                      data-toggle="tooltip" title="Copy attendance marks">
                <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
                <span class="ActualGUMS-btn-text">Copy</span>
              </button>
            </div>
          </div>
        `;

        const t = document.getElementById(A.INPUT_CLASSES);
        const m = document.getElementById(A.INPUT_MARKS);
        const b = document.getElementById(A.BTN_COPY);
        if (!t || !m || !b) return;

        if (!b.dataset.ActualGUMSDefaultText) {
          const te = b.querySelector('.ActualGUMS-btn-text') || b.querySelector('span:not(.glyphicon)');
          b.dataset.ActualGUMSDefaultText = String(te?.textContent || 'Copy').trim() || 'Copy';
        }

        t.value = prefs.totalClasses ? String(prefs.totalClasses) : '';
        m.value = prefs.totalMarks ? String(prefs.totalMarks) : '';

        t.oninput = () => {
          prefs.totalClasses = Math.floor(num(t.value) || 0);
          savePrefs(tbl, prefs);
          compute(tbl, prefs);
        };

        m.oninput = () => {
          prefs.totalMarks = num(m.value) || 0;
          savePrefs(tbl, prefs);
          compute(tbl, prefs);
        };

        b.onclick = async () => {
          const payload = buildMarksPayload(tbl);
          const ok = await Core.copyText(payload);
          flashCopyBtn(b, ok);
        };

        initTooltips([t, m, b]);
        thPct.dataset[A.MOUNT_KEY] = '1';
        thMarks.dataset[A.MOUNT_KEY] = '1';
      };

      const ensureFeature = () => {
        const tbl = H.getTable();
        if (!tbl) return;

        ensureStyles();

        const prefs = Object.assign({ totalClasses: 0, totalMarks: 0 }, loadPrefs(tbl));

        ensureHeaderCols(tbl);
        ensureRowCols(tbl);
        mountHeaderControls(tbl, prefs);
        compute(tbl, prefs);

        savePrefs(tbl, prefs);
        tbl.dataset.ActualGUMSAttendMarksInjected = '1';
      };

      const ensure = () => {};
      const mount = () => {};
      const bind = () => {};
      const sync = () => ensureFeature();
      const run = () => { ensure(); mount(); bind(); sync(); };

      return { run };
    })();

    const init = (flags = {}) => {
      Theme.ensureBaseTheme();
      H.ensureStyles();

      const run = () => {
        H.applyAccentVars();

        if (flags.featureCopyStudentsInfo) featureCopyStudentsInfo.run();
        if (flags.featureMarksPresented) featureMarksPresented.run();
        if (flags.featureAttendanceMarks) featureAttendanceMarks.run();
      };

      run();

      if (!Core.hookPRMOnce('_ActualGUMSAttendHooked', run)) {
        Core.observeOnce('_ActualGUMSAttendObs', document.documentElement, run);
      }

      H.waitForTable(() => run());
    };

    return { init };
  })();

  const ActualGUMSFooter = (() => {
    const CFG = {
      CSS_ID: 'ActualGUMSFooterCSS',
      NOTE_ID: 'ActualGUMSFooterNote',
      FOOTER_SEL: '.footer',
      AUTHOR_URL: 'https://github.com/shmVirus',
      REMOVE_EXISTING: true
    };

    const ensure = Core.once(() => {
      Core.injectCSSOnce(
        `
        :root{
          --ActualGUMS-footer-h:0px;
          --ActualGUMS-footer-pad-y:4px;
          --ActualGUMS-footer-pad-x:10px;
          --ActualGUMS-footer-fade:min(clamp(120px, 48vw, 1200px), 49vw);
        }

        ${CFG.FOOTER_SEL}{
          position:fixed !important;
          left:0 !important;
          right:0 !important;
          bottom:0 !important;
          width:100% !important;
          margin:0 !important;
          height:auto !important;
          min-height:0 !important;
          max-height:none !important;
          box-sizing:border-box !important;
          z-index:2147483646 !important;

          padding:var(--ActualGUMS-footer-pad-y) var(--ActualGUMS-footer-pad-x) !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          text-align:center !important;

          background:transparent !important;
          isolation:isolate !important;
          overflow:hidden !important;

          border-top:1px solid rgba(59,127,143,.22) !important;
          box-shadow:0 -10px 26px rgba(0,0,0,.10) !important;
        }

        ${CFG.FOOTER_SEL}::before{
          content:"";
          position:absolute;
          inset:0;
          z-index:0;
          background:rgba(255,255,255,.97);
          backdrop-filter:blur(14px) saturate(140%);
          -webkit-backdrop-filter:blur(14px) saturate(140%);
          -webkit-mask-image:linear-gradient(
            90deg,
            transparent 0,
            #000 var(--ActualGUMS-footer-fade),
            #000 calc(100% - var(--ActualGUMS-footer-fade)),
            transparent 100%
          );
          mask-image:linear-gradient(
            90deg,
            transparent 0,
            #000 var(--ActualGUMS-footer-fade),
            #000 calc(100% - var(--ActualGUMS-footer-fade)),
            transparent 100%
          );
        }

        body{
          padding-bottom:var(--ActualGUMS-footer-h) !important;
        }

        #${CFG.NOTE_ID}{
          position:relative !important;
          z-index:1 !important;

          margin:0 !important;
          padding:0 !important;
          border:0 !important;

          font:600 12px/1.2 "Segoe UI",system-ui,sans-serif !important;
          color:var(--ActualGUMS-muted);

          cursor:text !important;
          pointer-events:auto !important;
          -webkit-user-select:text !important;
          user-select:text !important;

          text-align:center !important;
          text-shadow:none !important;
          filter:none !important;
          -webkit-text-fill-color:currentColor !important;
        }

        #${CFG.NOTE_ID}, #${CFG.NOTE_ID} *{
          pointer-events:auto !important;
          -webkit-user-select:text !important;
          user-select:text !important;
          text-shadow:none !important;
          filter:none !important;
          -webkit-text-fill-color:currentColor !important;
        }

        #${CFG.NOTE_ID} .ActualGUMS-footer-strong{
          color:var(--ActualGUMS-green);
          font-weight:900;
        }

        #${CFG.NOTE_ID} a.ActualGUMS-footer-link{
          text-decoration:none !important;
          cursor:pointer !important;
          padding:0 5px;
          border-radius:6px;
          background:rgba(59,127,143,.10);
          color:var(--ActualGUMS-action);
          font-weight:900;
          white-space:nowrap;
        }

        #${CFG.NOTE_ID} a.ActualGUMS-footer-link::after{
          content:"↗";
          font-weight:900;
          font-size:11px;
          margin-left:4px;
          opacity:.75;
        }

        #${CFG.NOTE_ID} a.ActualGUMS-footer-link:hover{
          background:rgba(59,127,143,.18);
        }

        #${CFG.NOTE_ID} a.ActualGUMS-footer-link:focus-visible{
          outline:2px solid rgba(59,127,143,.35);
          outline-offset:2px;
        }

        @media (prefers-color-scheme:dark){
          ${CFG.FOOTER_SEL}{
            border-top:1px solid rgba(104,214,190,.18) !important;
            box-shadow:0 -12px 28px rgba(0,0,0,.42) !important;
          }
          ${CFG.FOOTER_SEL}::before{
            background:rgba(15,23,42,.90);
          }
          #${CFG.NOTE_ID}{
            color:rgba(226,232,240,.92);
          }
        }
        `,
        CFG.CSS_ID
      );
    });

    const forceSelectable = (el) => {
      if (!el) return;
      el.style.setProperty('user-select', 'text', 'important');
      el.style.setProperty('-webkit-user-select', 'text', 'important');
      el.style.setProperty('pointer-events', 'auto', 'important');
      el.style.setProperty('cursor', 'text', 'important');
      el.onselectstart = null;
      el.oncopy = null;
      el.oncut = null;
      el.oncontextmenu = null;
    };

    const stopBlockersInside = (el) => {
      if (!el || el._ActualGUMSFooterBound) return;
      el._ActualGUMSFooterBound = true;
      ['selectstart', 'copy', 'cut', 'contextmenu', 'mousedown', 'mouseup', 'keydown', 'pointerdown'].forEach((t) => {
        el.addEventListener(t, (e) => { e.stopPropagation(); }, true);
      });
    };

    const hideExistingFooterContent = (footer, note) => {
      if (!CFG.REMOVE_EXISTING) return;
      Array.from(footer.children).forEach((ch) => { if (ch !== note) ch.style.display = 'none'; });
    };

    const syncFooterPadding = Core.rafThrottle(() => {
      const footer = document.querySelector(CFG.FOOTER_SEL);
      if (!footer) return;
      const h = Math.ceil(footer.getBoundingClientRect().height || 0);
      document.documentElement.style.setProperty('--ActualGUMS-footer-h', `${h}px`);
    });

    const mount = () => {
      const footer = document.querySelector(CFG.FOOTER_SEL);
      if (!footer) return;

      ensure();

      let note = document.getElementById(CFG.NOTE_ID);
      if (!note) {
        note = document.createElement('div');
        note.id = CFG.NOTE_ID;
      }

      const html = `
        <span class="ActualGUMS-footer-strong">ActualGUMS</span> — made broken GUMS usable with thoughtful choices.<br>
        A script by <a class="ActualGUMS-footer-link" href="${CFG.AUTHOR_URL}" target="_blank" rel="noopener" title="Open Sabbir">@Sabbir</a> — because someone had to care.
      `;
      if (note.innerHTML !== html) note.innerHTML = html;
      if (note.parentElement !== footer) footer.appendChild(note);

      forceSelectable(footer);
      forceSelectable(note);
      stopBlockersInside(note);
      hideExistingFooterContent(footer, note);
      syncFooterPadding();
    };

    const bind = Core.once(() => {
      const prm = Core.getPRM?.();
      if (prm && !prm._ActualGUMSFooterHooked) {
        prm._ActualGUMSFooterHooked = true;
        prm.add_endRequest(() => { mount(); });
      }

      if (!document.documentElement._ActualGUMSFooterObs) {
        document.documentElement._ActualGUMSFooterObs = true;
        new MutationObserver(Core.rafThrottle(() => { mount(); }))
          .observe(document.documentElement, { childList: true, subtree: true });
      }

      if (!window._ActualGUMSFooterResize) {
        window._ActualGUMSFooterResize = true;
        window.addEventListener('resize', syncFooterPadding, { passive: true });
      }
    });

    const run = () => { mount(); bind(); };
    return { run };
  })();

  (function bootActualGUMS () {
    Theme.ensureBaseTheme();
    ActualGUMSFooter.run();

    const FEATURES = {
      PageAdvisorDashboard: {
        featureCopyStudentsInfo: true,
        featureEnhancedSearch: true,
        featureEnhancedFilters: true,
      },
      PageRegistrationPanel: {
        featureEnhancedTopHeader: true,
        featureCheckPayment: true,
        featureCheckConfirmation: true,
        featureIncorrectSection: true,
        featureSectionConflict: true,
        featureRoutineGrid: true,
        featureRegSlipDownload: true,
      },
      PageStudentCourseHistory: {
        featureMoveWaivedBelow: true,
        featureTableEnhancer: true,
        featureHistoryAnalyzer: true,
        featureSummaryCard: true,
        featureSyllabusCatalogue: true,
      },
      PageAttendanceEntry: {
        featureCopyStudentsInfo: true,
        featureMarksPresented: true,
        featureAttendanceMarks: true,
      }
    };

    const ROUTES = {
      PageAdvisorDashboard:       { match: /\/Registration\/AdvisorDashboard\.aspx$/i,          init: PageAdvisorDashboard.init },
      PageRegistrationPanel:      { match: /\/Registration\/Registration\.aspx$/i,              init: PageRegistrationPanel.init },
      PageStudentCourseHistory:   { match: /\/Student\/StudentCourseHistory\.aspx$/i,           init: PageStudentCourseHistory.init },
      PageAttendanceEntry:        { match: /\/ClassAttendance\/ClassAttendanceEntry\.aspx$/i,   init: PageAttendanceEntry.init },
    };

    const path = location.pathname || '';
    for (const [id, r] of Object.entries(ROUTES)) {
      if (!r.match.test(path)) continue;
      const flags = FEATURES[id] || {};
      r.init(flags);
      break;
    }
  })();

})();