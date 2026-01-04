// ==UserScript==
// @name         LogiTycoon km↔mi Converter & Price/unit
// @author       NoExtraSauce
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Toggle distance between km/mi & show £/unit on Trips page
// @match        https://www.logitycoon.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544662/LogiTycoon%20km%E2%86%94mi%20Converter%20%20Priceunit.user.js
// @updateURL https://update.greasyfork.org/scripts/544662/LogiTycoon%20km%E2%86%94mi%20Converter%20%20Priceunit.meta.js
// ==/UserScript==
(function(){
  'use strict';

  const KM_TO_MI = 0.621371;
  const STORAGE_KEY = 'logitycoonUnit';
  let unit = localStorage.getItem(STORAGE_KEY) || 'mi';

  //
  // 1) Inject the toggle button next to the logo
  //
  function createToggle(){
    const logo = document.querySelector('.page-logo');
    if(!logo) return;
    const btn = document.createElement('a');
    btn.id = 'unitToggle';
    btn.href = '#';
    btn.className = 'btn blue btn-outline btn-circle';
    btn.style.margin = '9px 0px 0px 1060px';
    btn.textContent = unit === 'mi' ? 'Unit: MI' : 'Unit: KM';
    btn.addEventListener('click', e => {
      e.preventDefault();
      unit = unit === 'mi' ? 'km' : 'mi';
      localStorage.setItem(STORAGE_KEY, unit);
      btn.textContent = unit === 'mi' ? 'Unit: MI' : 'Unit: KM';
      updateAll();
    });
    // insert right after the logo
    logo.insertAdjacentElement('afterend', btn);
  }

  //
  // 2) Reversible text-node conversion outside of Trips table
  //
  const origMap = new WeakMap();
  const anyUnitRe   = /[\d][\d,\.]*\s*(km|mi)\b/i;
  const kmRe        = /([\d][\d,\.]*)\s*km\b/gi;

  function updateTextNodes(root){
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      { acceptNode(node) {
          // skip anything inside the trips table
          if(node.parentElement.closest('#rectrips')) return NodeFilter.FILTER_REJECT;
          if(origMap.has(node))    return NodeFilter.FILTER_ACCEPT;
          if(anyUnitRe.test(node.nodeValue)) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    let node;
    while(node = walker.nextNode()){
      // record original only once
      if(!origMap.has(node) && /km\b/i.test(node.nodeValue)){
        origMap.set(node, node.nodeValue);
      }
      const original = origMap.get(node) || node.nodeValue;
      let updated = original;

      if(unit === 'mi'){
        updated = original.replace(kmRe, (_, raw) => {
          // handle thousands vs decimals
          let km = /^\d{1,3}(?:\.\d{3})+$/.test(raw)
                    ? parseFloat(raw.replace(/\./g, ''))
                    : parseFloat(raw.replace(/,/g, ''));
          if(isNaN(km)) return _;
          const mi = km * KM_TO_MI;
          // thousand-style → 2 dp, else 1 dp
          const dp = (/^\d{1,3}(?:\.\d{3})+$/.test(raw)) ? 2 : 1;
          return `${mi.toFixed(dp)} mi`;
        });
      } else {
        // reverting: use the stored original km text
        updated = original;
      }
      node.nodeValue = updated;
    }
  }

  //
  // 3) Trips-page: parse & store raw values, then display distance + £/unit
  //
  function initTrips(){
    const tbody = document.querySelector('#rectrips tbody');
    if(!tbody) return;

    // once per row: stash raw km & earnings
    tbody.querySelectorAll('tr').forEach(row => {
      if(row.dataset.rawKm === undefined){
        const distText = row.cells[4].textContent.trim();
        const dm = distText.match(/([\d][\d,\.]*)/);
        let rawKm = 0;
        if(dm){
          const r = dm[1];
          rawKm = /^\d{1,3}(?:\.\d{3})+$/.test(r)
                    ? parseFloat(r.replace(/\./g, ''))
                    : parseFloat(r.replace(/,/g, ''));
        }
        row.dataset.rawKm   = rawKm;
        // parse earnings “£ X,XXX”
        const em = row.cells[1].textContent.match(/£\s*([\d,\.]+)/);
        row.dataset.rawEarn = em
                              ? parseFloat(em[1].replace(/,/g, ''))
                              : 0;
      }
    });

    updateTripsRows();

    // watch for new rows
    new MutationObserver(updateTripsRows)
      .observe(tbody, { childList: true });
  }

  function updateTripsRows(){
    const tbody = document.querySelector('#rectrips tbody');
    if(!tbody) return;

    tbody.querySelectorAll('tr').forEach(row => {
      const rawKm   = parseFloat(row.dataset.rawKm);
      const rawEarn = parseFloat(row.dataset.rawEarn);
      if(!rawKm || !rawEarn) return;

      // 3a) distance display
      let disp;
      if(unit === 'mi'){
        disp = (rawKm * KM_TO_MI).toFixed(1);
      } else {
        disp = rawKm.toString();
      }

      // 3b) £ per unit
      const perUnit = unit === 'mi'
                        ? rawEarn / (rawKm * KM_TO_MI)
                        : rawEarn / rawKm;
      const price  = perUnit.toFixed(2);

      // inject back into the&nbsp;cell
      const cell = row.cells[4];
      cell.innerHTML = `
        ${disp} ${unit}
        <span class="unit-price"
              style="margin-left:4px;color:#888;font-size:0.9em;">
          (£${price}/${unit})
        </span>`;
    });
  }

  //
  // 4) Wire it all together
  //
  function updateAll(){
    updateTextNodes(document.body);
    initTrips();
  }

  function init(){
    createToggle();
    updateAll();

    // apply text-node changes on future AJAX loads
    new MutationObserver(muts => {
      for(const m of muts){
        m.addedNodes.forEach(n => {
          if(n.nodeType === 1)      updateTextNodes(n);
          else if(n.nodeType === 3) updateTextNodes(n.parentNode);
        });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
