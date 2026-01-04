// ==UserScript==
// @name         JanitorAI – Dump chat to file
// @namespace    gboy.jai.export
// @version      2.0.0
// @description  Adds "Dump chat to file" to the JanitorAI menu; exports full chat
// @author       Gboy
// @match        http*://janitorai.com/*
// @match        http*://www.janitorai.com/*
// @match        http*://*.janitorai.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547143/JanitorAI%20%E2%80%93%20Dump%20chat%20to%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/547143/JanitorAI%20%E2%80%93%20Dump%20chat%20to%20file.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //SPA stuff idk it works
  const onRoute = (() => {
    const subs = new Set();
    const fire = () => subs.forEach(fn => { try { fn(); } catch (e) { console.error('[jai]', e); } });
    const wrap = k => {
      const orig = history[k];
      history[k] = function (...args) {
        const rv = orig.apply(this, args);
        window.dispatchEvent(new Event('jai:route'));
        return rv;
      };
    };
    wrap('pushState'); wrap('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('jai:route')));
    window.addEventListener('jai:route', fire);
    return fn => subs.add(fn);
  })();

  const isChatPage = () => /\/chats\/\d+/.test(location.pathname);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  onRoute(() => { if (isChatPage()) ensureMenuInjector(true); });

  function boot() {
    if (!isChatPage()) return;
    ensureMenuInjector();
    console.debug('[jai] userscript active', location.href);
  }
//insert to menu
  function ensureMenuInjector(force = false) {
    if (ensureMenuInjector._ok && !force) return;
    ensureMenuInjector._ok = true;
    const ICON_SVG = `
      <svg stroke="currentColor" fill="currentColor" viewBox="0 0 493.525 493.525" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M246.763,273.005c8.441,0,15.562-3.01,21.366-9.042l95.22-95.22c5.521-5.52,8.277-11.896,8.277-19.126
          c0-7.23-2.759-13.419-8.277-18.559c-5.331-5.14-11.516-7.708-18.555-7.708c-7.043,0-13.229,2.568-18.559,7.708l-47.391,47.391
          V18.271c0-7.043-2.52-13.229-7.566-18.559C266.231,0.381,260.189,0,252.858,0c-7.332,0-13.419,0.381-18.274,1.152
          c-4.855,0.762-9.137,2.952-12.847,6.567c-3.72,3.613-5.57,8.231-5.57,13.846v161.178l-47.391-47.391
          c-5.52-5.14-11.706-7.708-18.556-7.708c-7.043,0-13.229,2.568-18.559,7.708c-5.52,5.14-8.277,11.329-8.277,18.559
          c0,7.23,2.759,13.606,8.277,19.126l95.225,95.22C231.387,269.995,238.511,273.005,246.763,273.005z"/>
        <path d="M473.086,311.218c-13.033-12.936-29.215-19.406-48.537-19.406H68.97c-19.32,0-35.5,6.471-48.537,19.406
          C7.403,324.149,0,340.333,0,359.66v73.091c0,19.318,7.403,35.5,20.433,48.533c13.037,12.939,29.217,19.404,48.537,19.404h355.579
          c19.322,0,35.503-6.465,48.537-19.404c13.037-13.033,20.439-29.215,20.439-48.533V359.66
          C493.525,340.333,486.123,324.149,473.086,311.218z M430.518,432.751c0,5.492-2.054,10.543-6.169,15.153
          c-4.109,4.61-9.092,6.912-14.935,6.912H84.1c-5.851,0-10.833-2.302-14.949-6.912c-4.117-4.61-6.171-9.661-6.171-15.153v-63.333
          c0-5.478,2.054-10.521,6.171-15.133c4.116-4.61,9.099-6.916,14.949-6.916h325.313c5.843,0,10.826,2.305,14.935,6.916
          c4.115,4.612,6.169,9.655,6.169,15.133V432.751z"/>
      </svg>`.replace(/\s+/g, ' '); //just the icon

    const MENU_LIST_SEL = '._menuList_162rw_8._open_162rw_22, ._menuList_162rw_8._open_';
    const TEXT_STREAM_ROW_SEL = '._menuItemSwitch_hs488_94';
    const MENU_ITEM_CLASS = '_menuItem_162rw_45';

    const mo = new MutationObserver(() => {
      document.querySelectorAll(MENU_LIST_SEL).forEach(menu => {
        if (menu.__jai_dump_added) return;
        const textRow = menu.querySelector(TEXT_STREAM_ROW_SEL);
        if (!textRow) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = MENU_ITEM_CLASS;
        btn.style.display = 'flex';
        btn.style.width = '100%';
        btn.innerHTML = `
          <span class="_menuItemIcon_162rw_81">${ICON_SVG}</span>
          <span class="_menuItemContent_162rw_96">Dump chat to file</span>
        `;
        btn.addEventListener('click', () => exportChat().catch(err => {
          console.error('[jai] export error', err);
          alert('Export failed: ' + (err?.message || err));
        }));
        textRow.insertAdjacentElement('afterend', btn);
        menu.__jai_dump_added = true;
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.__jai_menuMO = mo;
  }
//hud/userdisplay
  function hud() {
    if (hud.el) return hud;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; z-index:999999; right:8px; bottom:8px; font:12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background:#111C; color:#fff; padding:8px 10px; border:1px solid #444; border-radius:10px; backdrop-filter: blur(3px); max-width: 40vw; pointer-events:none;
      white-space:pre-wrap;
    `;
    document.documentElement.appendChild(el);
    hud.el = el;
    hud.tick = (obj) => { el.textContent = `[JAI Export]\n${Object.entries(obj).map(([k,v])=>`${k}: ${v}`).join('\n')}`; };
    hud.done = (msg='Done') => { el.textContent += `\n${msg}`; setTimeout(()=>el.remove(), 3000); hud.el = null; };
    return hud;
  }
//util funcs
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sel = s => document.querySelector(s);
  const selAll = s => Array.from(document.querySelectorAll(s));

  function getScroller() {
    return document.querySelector('[data-testid="virtuoso-scroller"][data-virtuoso-scroller="true"]');
  }
  function getItemList() {
    return document.querySelector('[data-testid="virtuoso-item-list"]');
  }
  function getAllItems() {
    const list = getItemList();
    return list ? Array.from(list.querySelectorAll('[data-index][data-item-index]')) : [];
  }
  function filenameFromHeader() {
    const who = document.querySelector('._customDivider_7bh05_1 ._customDividerText_7bh05_26');
    const name = (who?.textContent?.trim() || 'JanitorAI');
    const id = location.pathname.split('/').pop() || 'chat';
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    return `${name}_${id}_${stamp}.txt`;
  }
//viewport
  function applyViewportBoost(scroller, { enableZoom = true, zoomScale = 0.8, heightVH = 500 } = {}) {
    const prev = {
      bodyZoom: document.body.style.zoom || '',
      scrHeight: scroller.style.height || '',
      htmlScrollBehavior: document.documentElement.style.scrollBehavior || '',
    };
    if (enableZoom) document.body.style.zoom = String(zoomScale);     // emulate Cmd/-
    scroller.style.height = `${heightVH}vh`;                           // load more items per sweep
    document.documentElement.style.scrollBehavior = 'auto';            // avoid “pendulum” at edges
    return () => {
      document.body.style.zoom = prev.bodyZoom;
      scroller.style.height = prev.scrHeight;
      document.documentElement.style.scrollBehavior = prev.htmlScrollBehavior;
    };
  }
//sweep
  async function sweepAll({ dir = 'down', stepPx = 1600, idleLimit = 12, stallJiggle = 3, maxMs = 180000 } = {}) {
    const H = hud(); H.tick({ phase: 'sweep init', dir, stepPx, idleLimit });
    const scr = getScroller();
    if (!scr) throw new Error('Scroller not found');
    const off = applyViewportBoost(scr, { enableZoom: true, zoomScale: 0.8, heightVH: 500 });
    const start = performance.now();

    let lastMax = -1, idle = 0, totalSteps = 0;
    const seen = new Set();

    const getMaxIndex = () => {
      let max = -1;
      getAllItems().forEach(it => {
        const idx = Number(it.getAttribute('data-index'));
        if (!Number.isNaN(idx)) max = Math.max(max, idx);
        if (it.dataset._jai_seen !== '1') {
          it.dataset._jai_seen = '1';
          seen.add(idx);
        }
      });
      return max;
    };

    await sleep(50);
    lastMax = getMaxIndex();

    while (true) {
      if ((performance.now() - start) > maxMs) { H.tick({ phase:'sweep timeout', totalSteps, maxIndex:lastMax, seen:seen.size }); break; }
      totalSteps++;
      const nextTop = scr.scrollTop + (dir === 'down' ? stepPx : -stepPx);
      scr.scrollTo({ top: Math.max(0, nextTop) });
      await sleep(50);

      const maxIdx = getMaxIndex();
      if (maxIdx > lastMax) { idle = 0; lastMax = maxIdx; }
      else {
        idle++;
        if (idle % stallJiggle === 0) { scr.scrollBy({ top: -300 }); await sleep(30); scr.scrollBy({ top: +600 }); await sleep(30); }
      }

      const atBottom = Math.abs(scr.scrollHeight - (scr.scrollTop + scr.clientHeight)) < 4;
      const atTop = scr.scrollTop <= 2;

      H.tick({ phase:'sweeping', step: totalSteps, maxIndex: lastMax, idle, jiggles: Math.floor(idle/stallJiggle), atBottom, atTop, seen: seen.size });

      if ((dir === 'down' && atBottom && idle >= idleLimit) || (dir === 'up' && atTop && idle >= idleLimit)) {
        H.tick({ phase:'sweep complete', steps: totalSteps, maxIndex:lastMax, seen: seen.size });
        break;
      }
    }

    off();
    return { steps: totalSteps, maxIndex: lastMax, distinct: seen.size };
  }

//extraction
  function extractMessages() {
    const items = getAllItems();
    const out = [];
    for (const it of items) {
      const body = it.querySelector('._messageBody_cj98i_56');
      if (!body) continue;

      const nameNode = body.querySelector('._nameContainer_prxth_282 ._nameText_prxth_288');
      const name = (nameNode?.textContent || 'Unknown').trim();

      const contentRoot = body.querySelector('.css-ji4crq');
      if (!contentRoot) continue;

      const chunks = [];
      contentRoot.querySelectorAll(':scope > .css-0 > div').forEach(div => {
        const t = div.textContent;
        if (t && t.trim().length) chunks.push(t.replace(/\u00A0/g, ' ').trim());
      });
      let text = chunks.join('\n\n').trim();
      if (!text) continue;

      const header = `[${name}]:`;
      out.push(`${header}\n${text}\n`);
    }
    return out;
  }
//export entry
  async function exportChat() {
    const H = hud(); H.tick({ phase: 'start' });

    await sweepAll({ dir:'down', stepPx: 1800, idleLimit: 10, stallJiggle: 3, maxMs: 180000 });
    await sleep(80);
    await sweepAll({ dir:'up', stepPx: 1400, idleLimit: 8, stallJiggle: 2, maxMs: 60000 });

    const msgs = extractMessages();
    if (!msgs.length) throw new Error('No messages extracted');

    const header = `URL: ${location.href}\nExported: ${new Date().toString()}\nMessages: ${msgs.length}\n---\n\n`;
    const blob = new Blob([header + msgs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filenameFromHeader();
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    H.done('Saved.');
  }

})();
