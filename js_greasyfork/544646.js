// ==UserScript==
// @name         Shopee – Filtros e Ordenação Local (sem Infinite Scroll)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Filtra AND|OR|NOT e ordena client-side os produtos já carregados, sem infinite scroll. SPA-aware. Limpa filtros e usa preço lado a lado. Mais robusto e rápido.
// @author       Você
// @match        https://shopee.com.br/*
// @match        https://shopee.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544646/Shopee%20%E2%80%93%20Filtros%20e%20Ordena%C3%A7%C3%A3o%20Local%20%28sem%20Infinite%20Scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544646/Shopee%20%E2%80%93%20Filtros%20e%20Ordena%C3%A7%C3%A3o%20Local%20%28sem%20Infinite%20Scroll%29.meta.js
// ==/UserScript==
(function(){
  'use strict';

  // ====== Config ======
  const SELECTORS = {
    container: 'ul.shopee-search-item-result__items',
    item: 'li.shopee-search-item-result__item',
    title: '.line-clamp-2, [data-sqe="name"], [class*="title"], a[data-sqe="link"]',
    // múltiplos candidatos de preço — escolhemos o primeiro que bater
    priceCandidates: [
      '.flex.items-baseline span:nth-child(2)',
      '.shopee-item-card__current-price',
      '[data-sqe="price"]',
      '[class*="price"]'
    ],
    soldCandidates: [
      '.flex.items-center .truncate:nth-child(3)',
      '[data-sqe="sold"]',
      '[class*="sold"], [class*="vendid"]'
    ]
  };

  const STORAGE_KEY = 'tm_shopee_filter_state_v17';
  const DEBOUNCE_MS = 160; // equilíbrio entre responsividade e custo de DOM

  // ====== UI ======
  const panel = document.createElement('div');
  panel.id = 'tm-shopee-filter-panel';
  panel.innerHTML = `
    <div class="tm-shopee-filter-header">
      <span>Filtros Shopee</span>
      <div class="tm-actions">
        <button id="tm-toggle" title="Mostrar/ocultar resultados ocultos no DOM (só visual)">👁️</button>
        <button id="tm-clear" title="Limpar filtros">✕</button>
      </div>
    </div>
    <div class="tm-shopee-filter-content">
      <div class="tm-row">
        <label>Palavras (AND implícito, "|"=OR, "!"=NOT, "\"frase\""=frase):</label>
        <input type="text" id="tm-keywords" placeholder='ex: papel "sulfite a4" kit|folhas !glossy'>
      </div>
      <div class="tm-row tm-price">
        <label>Preço de (R$):</label>
        <input type="text" inputmode="decimal" id="tm-min" placeholder="0">
        <label>até:</label>
        <input type="text" inputmode="decimal" id="tm-max" placeholder="0">
      </div>
      <div class="tm-row">
        <label>Ordenar:</label>
        <select id="tm-sort">
          <option value="">Relevância (original)</option>
          <option value="sales,desc">Mais Vendidos</option>
          <option value="price,asc">Menor Preço</option>
          <option value="price,desc">Maior Preço</option>
        </select>
      </div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    #tm-shopee-filter-panel{position:fixed;bottom:20px;right:20px;width:310px;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.15);z-index:999999;font-family:system-ui,Arial,sans-serif;color:#222;border-radius:8px;}
    #tm-shopee-filter-panel *{box-sizing:border-box}
    .tm-shopee-filter-header{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#f5f5f5;border-bottom:1px solid #e5e5e5;font-weight:600;border-radius:8px 8px 0 0}
    .tm-actions{display:flex;gap:6px}
    .tm-actions button{background:none;border:1px solid #ccc;border-radius:6px;padding:2px 6px;cursor:pointer}
    .tm-shopee-filter-content{padding:10px}
    .tm-row{margin-bottom:10px}
    .tm-row label{display:block;font-size:12px;margin-bottom:4px;color:#444}
    .tm-row input,.tm-row select{width:100%;padding:6px 8px;font-size:12px;border:1px solid #ccc;border-radius:6px}
    .tm-price{display:flex;align-items:center;gap:6px}
    .tm-price label{margin:0;white-space:nowrap}
    .tm-hidden{display:none !important}
    /* ajuda visual para títulos que deram match */
    .tm-hitmark{outline:1px dashed rgba(0,0,0,.15);outline-offset:2px}
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  // ====== Helpers ======
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // cache leve por item
  const cache = new WeakMap();
  let origIndexSeed = 0;

  function norm(str){
    if (!str) return '';
    try{
      return str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
    }catch{ // fallback sem Unicode property escapes
      return str.toLowerCase();
    }
  }

  function parseBRDecimal(s){
    if (!s) return null;
    const cleaned = String(s).replace(/[^\d,\.]/g,'').replace(/\.(?=\d{3}(\D|$))/g,'') // remove pontuação de milhar
                              .replace(',', '.');
    const v = parseFloat(cleaned);
    return Number.isFinite(v) ? v : null;
  }

  function extractTitle(li){
    const c = cache.get(li) || {};
    if (c.title) return c.title;
    const el = $(SELECTORS.title, li);
    const text = norm(el?.textContent || '');
    cache.set(li, {...c, title: text});
    return text;
  }

  function extractPrice(li){
    const c = cache.get(li) || {};
    if (typeof c.price === 'number') return c.price;
    let txt = '';
    for (const sel of SELECTORS.priceCandidates){
      const el = $(sel, li);
      if (el && /\d/.test(el.textContent)) { txt = el.textContent; break; }
    }
    if (!txt){
      const any = $$("*", li).find(e => /R\$\s*\d|\d+,\d{2}/.test(e.textContent));
      txt = any?.textContent || '';
    }
    // pega todos os números; para faixa de preço, usamos o menor
    const matches = txt.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{2}))?/g);
    let val = null;
    if (matches){
      const nums = matches.map(x => parseBRDecimal(x)).filter(n => Number.isFinite(n));
      if (nums.length) val = Math.min(...nums);
    }
    cache.set(li, {...c, price: val});
    return val;
  }

  function extractSold(li){
    const c = cache.get(li) || {};
    if (typeof c.sold === 'number') return c.sold;
    let txt = '';
    for (const sel of SELECTORS.soldCandidates){
      const el = $(sel, li);
      if (el && el.textContent) { txt = el.textContent.toLowerCase(); break; }
    }
    if (!txt){
      const any = $$("*", li).find(e => /vendid|sold/i.test(e.textContent));
      txt = any?.textContent.toLowerCase() || '';
    }
    // 4,5 mil / 4.5k / 4500 etc.
    const km = txt.match(/([\d.,]+)\s*(k|mil)/i);
    let n = 0;
    if (km){
      const base = parseFloat(km[1].replace(/\./g,'').replace(',', '.'));
      if (Number.isFinite(base)) n = Math.round(base * 1000);
    } else {
      const digits = txt.replace(/[^\d]/g,'');
      n = parseInt(digits) || 0;
    }
    cache.set(li, {...c, sold: n});
    return n;
  }

  function getContainer(){ return $(SELECTORS.container) || null; }

  // armazena ordem original para reverter “Relevância”
  function ensureOrigIndex(li){
    if (!li.dataset.tmIdx){ li.dataset.tmIdx = String(origIndexSeed++); }
    return parseInt(li.dataset.tmIdx);
  }

  // ====== Parser de consulta (AND implícito, OR com |, NOT com !, frases com ") ======
  function parseQuery(raw){
    const tokens = [];
    // preserva frases entre aspas
    raw.replace(/"([^"]+)"|(\S+)/g, (_, phrase, word) => {
      tokens.push(phrase || word);
      return '';
    });

    const req = [], forbid = [], groups = [];
    for (let tok of tokens){
      tok = norm(tok.trim());
      if (!tok) continue;
      if (tok.startsWith('!')) { const t = tok.slice(1); if (t) forbid.push(t); continue; }
      if (tok.includes('|')) { groups.push(tok.split('|').map(norm)); continue; }
      req.push(tok);
    }
    return { req, forbid, groups };
  }

  // ====== Filtragem ======
  function applyFilter(state){
    const { req, forbid, groups, min, max, showHiddenOutline } = state;
    const cont = getContainer();
    if (!cont) return;

    $$(SELECTORS.item, cont).forEach(li => {
      ensureOrigIndex(li);
      const title = extractTitle(li);
      let hide = false;
      for (const k of forbid){ if (title.includes(k)) { hide = true; break; } }
      if (!hide){ for (const k of req){ if (!title.includes(k)) { hide = true; break; } } }
      if (!hide){ for (const arr of groups){ if (!arr.some(k => title.includes(k))) { hide = true; break; } } }

      const price = extractPrice(li);
      if (!hide && price != null){
        if (min != null && price < min) hide = true;
        if (max != null && max > 0 && price > max) hide = true;
      }

      li.classList.toggle('tm-hidden', hide);
      li.classList.toggle('tm-hitmark', !hide && showHiddenOutline && (req.length || groups.length));
    });
  }

  // ====== Ordenação ======
  function applySort(sort){
    const cont = getContainer();
    if (!cont) return;
    const items = $$(SELECTORS.item, cont).filter(li => !li.classList.contains('tm-hidden'));

    if (!sort){
      items.sort((a,b) => ensureOrigIndex(a) - ensureOrigIndex(b));
    } else {
      const [key, dir] = sort.split(',');
      items.sort((a,b) => {
        let va = 0, vb = 0;
        if (key === 'price') { va = extractPrice(a) ?? Number.POSITIVE_INFINITY; vb = extractPrice(b) ?? Number.POSITIVE_INFINITY; }
        else if (key === 'sales') { va = extractSold(a); vb = extractSold(b); }
        else { va = ensureOrigIndex(a); vb = ensureOrigIndex(b); }
        return dir === 'asc' ? (va - vb) : (vb - va);
      });
    }
    items.forEach(li => cont.appendChild(li));
  }

  // ====== Estado & Persistência ======
  function readStateFromUI(){
    const raw = norm($('#tm-keywords').value.trim());
    const { req, forbid, groups } = parseQuery(raw);
    const min = parseBRDecimal($('#tm-min').value);
    const max = parseBRDecimal($('#tm-max').value);
    const sort = $('#tm-sort').value || '';
    const showHiddenOutline = false;
    return { raw, req, forbid, groups, min, max, sort, showHiddenOutline };
  }

  function writeStateToUI(state){
    $('#tm-keywords').value = state.raw || '';
    $('#tm-min').value = state.min ?? '';
    $('#tm-max').value = state.max ?? '';
    $('#tm-sort').value = state.sort || '';
  }

  function saveState(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ raw: state.raw, min: state.min, max: state.max, sort: state.sort }));
  }

  function loadState(){
    try{
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { raw: s.raw || '', min: s.min ?? '', max: s.max ?? '', sort: s.sort || '' };
    }catch{ return { raw:'', min:'', max:'', sort:'' }; }
  }

  // ====== Debounce ======
  function debounce(fn, ms=DEBOUNCE_MS){
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null,args), ms); };
  }

  const reapply = debounce(() => {
    const state = readStateFromUI();
    saveState(state);
    applyFilter(state);
    applySort(state.sort);
  });

  // ====== Observers (SPA + itens injetados) ======
  function attachContainerObserver(){
    const cont = getContainer();
    if (!cont) return;
    // sempre que itens mudarem, reseta cache/índices (apenas dos novos)
    const mo = new MutationObserver(muts => {
      let needs = false;
      for (const m of muts){
        if (m.addedNodes && m.addedNodes.length){
          m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.matches?.(SELECTORS.item)) ensureOrigIndex(n); });
          needs = true;
        }
      }
      if (needs) reapply();
    });
    mo.observe(cont, { childList: true });
  }

  function hookHistory(){
    function fire(){ window.dispatchEvent(new Event('tm:locationchange')); }
    ['pushState','replaceState'].forEach(fn => {
      const orig = history[fn];
      history[fn] = function(){ const rv = orig.apply(this, arguments); fire(); return rv; };
    });
    window.addEventListener('popstate', fire);
    window.addEventListener('tm:locationchange', () => {
      // pequena espera para lista renderizar
      setTimeout(() => { attachContainerObserver(); reapply(); }, 200);
    });
  }

  // ====== UI events ======
  function bindUI(){
    const inputs = ['#tm-keywords','#tm-min','#tm-max'];
    inputs.forEach(sel => {
      const el = $(sel); ['input','change','keyup'].forEach(evt => el.addEventListener(evt, reapply));
    });
    $('#tm-sort').addEventListener('change', reapply);

    $('#tm-clear').addEventListener('click', () => {
      $('#tm-keywords').value = '';
      $('#tm-min').value = '';
      $('#tm-max').value = '';
      $('#tm-sort').value = '';
      localStorage.removeItem(STORAGE_KEY);
      reapply();
    });

    $('#tm-toggle').addEventListener('click', () => {
      const state = readStateFromUI();
      const newVal = !state.showHiddenOutline;
      // apenas efeito visual de destaque: alternamos classe em itens visíveis
      const cont = getContainer(); if (!cont) return;
      $$(SELECTORS.item, cont).forEach(li => li.classList.toggle('tm-hitmark', newVal && !li.classList.contains('tm-hidden')));
    });
  }

  // ====== Bootstrap ======
  (function init(){
    // restaura estado
    const s = loadState();
    writeStateToUI({ ...s });

    bindUI();
    hookHistory();
    attachContainerObserver();

    // primeira aplicação após leve atraso para garantir que a grade esteja montada
    setTimeout(reapply, 300);
  })();

})();
