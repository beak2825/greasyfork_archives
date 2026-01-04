// ==UserScript==
// @name         Dead Frontier Auto Bank Standalone
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  Self-contained Auto Bank buttons with collapse/remember state (no QuickBuy dependency). Anchors under QuickBuy if present, else in the right column; graceful fallback to bottom-left if layout not found. Also restores last Marketplace search after banking.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534182/Dead%20Frontier%20Auto%20Bank%20Standalone.user.js
// @updateURL https://update.greasyfork.org/scripts/534182/Dead%20Frontier%20Auto%20Bank%20Standalone.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('[AutoBank] initializing');

  const origin = window.location.origin;
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const returnPage = params.get('originPage');
  const currentPage = params.get('page') || '';

  // --- RESTORE LAST MARKETPLACE SEARCH WHEN RETURNING FROM BANK ---
  if (currentPage === '35' && sessionStorage.getItem('df_auto_restore')) {
    window.addEventListener('load', () => {
      console.log('[AutoBank] Attempting to restore last Marketplace search');
      sessionStorage.removeItem('df_auto_restore');

      const last = localStorage.getItem('lastDFsearch');
      if (!last) {
        console.log('[AutoBank] No lastDFsearch found in localStorage');
        return;
      }

      // Try to find the marketplace search input with several fallback selectors
      let inp =
        document.getElementById('searchField') ||
        document.querySelector("input[name='searchField']") ||
        document.querySelector("#marketSearch") ||
        document.querySelector("input[type='text'][name='item_name']");

      if (inp) {
        inp.value = last;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        console.log('[AutoBank] Could not find Marketplace search input');
      }

      // Try to find the search button and click it
      let btn =
        document.getElementById('makeSearch') ||
        document.querySelector("#marketForm input[type='submit'], #marketForm input[type='button']");

      if (btn) {
        setTimeout(() => {
          console.log('[AutoBank] Clicking Marketplace search button');
          btn.click();
        }, 100);
      } else {
        console.log('[AutoBank] Search input restored, but search button not found.');
      }
    });
  }

  // --- 1) BANK PAGE HANDLER ---
  if (currentPage === '15' && params.has('scripts')) {
    console.log('[AutoBank] bank action:', params.get('scripts'));
    const action = params.get('scripts');
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (action === 'withdraw') {
          const amt = params.get('amount') || '50000';
          const input = document.querySelector('#withdraw');
          const btn = document.querySelector('#wBtn');
          if (input && btn) {
            input.value = amt;
            input.setAttribute('value', amt);
            ['input','change'].forEach(e => input.dispatchEvent(new Event(e, { bubbles:true })));
            (typeof withdraw==='function'? withdraw(): btn.click());
          }
        } else if (action === 'withdrawAll') {
          if (typeof withdraw==='function') withdraw(1);
          else document.querySelector("button[onclick='withdraw(1);']")?.click();
        } else if (action === 'deposit') {
          if (typeof deposit==='function') deposit(1);
          else document.querySelector("button[onclick='deposit(1);']")?.click();
        }
      }, 200);

      // Give the action a moment to complete, then return
      setTimeout(() => {
        if (returnPage === '35') sessionStorage.setItem('df_auto_restore','1');
        const back = returnPage || '';
        window.location.replace(`${origin}${path}?page=${back}`);
      }, 500);
    });
    return;
  }

  // --- 2) MAIN PAGE: INJECT PANEL (NO QuickBuy REQUIRED) ---
  let repositionObservers = [];
  function cleanupObservers(){
    repositionObservers.forEach(o => { try { o.disconnect(); } catch {} });
    repositionObservers = [];
  }

  function getRightColumnCell(){
    // Same selector QuickBuy uses
    return document.querySelector("td.design2010[style*='right_margin.jpg']");
  }

  function placePanel(panel, qb, rightTd){
    // Determine position: under QuickBuy if present; else default inside right column
    panel.style.position = 'absolute';
    panel.style.left = (qb && qb.style.left) || '10px';
    const topPx = qb ? (qb.offsetTop + qb.offsetHeight + 8) : 120;
    panel.style.top = `${topPx}px`;

    // If QuickBuy is present, keep following its size changes
    if (qb) {
      const ro = new ResizeObserver(() => {
        try {
          const t = qb.offsetTop + qb.offsetHeight + 8;
          panel.style.top = `${t}px`;
        } catch {}
      });
      ro.observe(qb);
      repositionObservers.push(ro);
    }
  }

  function ensurePanelPosition(panel){
    const qb = document.getElementById('quickbuy-fieldset');
    const rightTd = qb ? qb.parentElement : getRightColumnCell();

    if (rightTd) {
      rightTd.style.position = 'relative';
      if (!panel.parentElement || panel.parentElement !== rightTd) {
        try { rightTd.appendChild(panel); } catch {}
      }
      placePanel(panel, qb, rightTd);
      return true;
    }
    return false;
  }

  function createPanel(){
    const panel = document.createElement('div');
    panel.id = 'auto-bank-panel';
    Object.assign(panel.style, {
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid #666',
      borderRadius: '8px',
      color: '#ffd700',
      padding: '8px',
      width: '180px',
      zIndex: '10000'
    });

    const title = document.createElement('strong');
    title.textContent = 'Auto Bank';
    title.style.display = 'block';
    title.style.textAlign = 'center';
    title.style.marginBottom = '6px';
    panel.appendChild(title);

    return panel;
  }

  function buildButtons(panel) {
    if (panel.querySelector('#auto-bank-fieldset')) return;
    console.log('[AutoBank] Building buttons');

    const fieldset = document.createElement('fieldset');
    fieldset.id = 'auto-bank-fieldset';
    Object.assign(fieldset.style, {
      border: '1px solid #666', padding: '6px 10px', margin: '4px 0',
      background: 'rgba(0,0,0,0.35)', borderRadius: '6px'
    });
    panel.appendChild(fieldset);

    const legend = document.createElement('legend');
    legend.innerHTML = `<span>Controls</span> <button id="collapse-auto-bank" style="background:none;border:none;color:#ffd700;cursor:pointer;">[–]</button>`;
    Object.assign(legend.style,{fontSize:'12px',padding:'0 4px'});
    fieldset.appendChild(legend);

    const container = document.createElement('div');
    container.id = 'auto-bank-btn-container';
    Object.assign(container.style, { display:'flex', flexDirection:'column', gap:'4px', marginTop:'6px' });
    fieldset.appendChild(container);

    const collapse = legend.querySelector('#collapse-auto-bank');
    if (localStorage.getItem('autoBankCollapsed') === 'true') {
      container.style.display='none'; collapse.textContent='[+]';
    }
    collapse.addEventListener('click',()=>{
      const hidden = container.style.display==='none';
      container.style.display = hidden?'flex':'none';
      collapse.textContent = hidden?'[–]':'[+]';
      localStorage.setItem('autoBankCollapsed', hidden?'false':'true');
    });

    const defs = [
      ['autoWithdraw50k','Withdraw 50k','withdraw','50000'],
      ['autoWithdraw150k','Withdraw 150k','withdraw','150000'],
      ['autoWithdraw5M','Withdraw 5M','withdraw','5000000'],
      ['autoWithdrawAll','Withdraw All','withdrawAll',null],
      ['autoDepositAll','Deposit All','deposit',null]
    ];
    defs.forEach(([id,label,act,amt])=>{
      const btn = document.createElement('button'); btn.id=id; btn.textContent=label;
      Object.assign(btn.style,{
        width:'100%', padding:'4px 0', background:'#222', color:'#ffd700',
        border:'1px solid #666', borderRadius:'4px', fontSize:'12px', cursor:'pointer'
      });
      btn.addEventListener('click',()=>{
        if (currentPage === '35') {
          const si = document.getElementById('searchField');
          if (si) {
            localStorage.setItem('lastDFsearch', si.value);
            console.log('[AutoBank] Saved lastDFsearch:', si.value);
          }
        }
        let url = `${origin}${path}?page=15&scripts=${act}`;
        if (amt) url+=`&amount=${amt}`;
        if (currentPage) url+=`&originPage=${currentPage}`;
        window.location.replace(url);
      });
      container.appendChild(btn);
    });
  }

  function injectPanel(attempt=0){
    cleanupObservers();

    let panel = document.getElementById('auto-bank-panel');
    if (!panel) {
      panel = createPanel();
    }

    // Try to position in the right column (under QuickBuy if present)
    const anchored = ensurePanelPosition(panel);
    if (!anchored) {
      // Fallback after several attempts: fixed bottom-left so it's always usable
      if (attempt >= 20) {
        if (!panel.parentElement) document.body.appendChild(panel);
        Object.assign(panel.style, {
          position:'fixed', left:'8px', bottom:'8px'
        });
        console.warn('[AutoBank] Right column not found; using bottom-left fallback.');
        buildButtons(panel);
        return;
      }
      // Retry shortly (page might still be constructing)
      return setTimeout(()=>injectPanel(attempt+1), 200);
    }

    // Panel is in place; build UI once
    buildButtons(panel);

    // If QuickBuy appears later, reposition under it dynamically
    const mo = new MutationObserver(() => {
      const qb = document.getElementById('quickbuy-fieldset');
      if (qb) {
        ensurePanelPosition(panel);
      }
    });
    mo.observe(document.body, { childList:true, subtree:true });
    repositionObservers.push(mo);
  }

  // initialize
  function init(){ injectPanel(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
