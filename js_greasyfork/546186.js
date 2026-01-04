// ==UserScript==
// @name         Assistant Director
// @namespace    https://greasyfork.org/users/your-username
// @version      0.3.6
// @description  Director's helper for Torn companies (ES5 hard-compat): popularity, environment, effectiveness, profit tips, per-role breakdown, retail pricing advisor. No async/await. Uses GM_xmlhttpRequest. Observer ignores panel & pauses while typing.
// @author       YourName
// @match        https://www.torn.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/546186/Assistant%20Director.user.js
// @updateURL https://update.greasyfork.org/scripts/546186/Assistant%20Director.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var CFG = {
    debug: false,
    panelId: 'assistant-director-panel',
    ls: {
      itemCosts: 'assistantDirector.itemCosts',
      collapse: 'assistantDirector.panelCollapsed',
      apiKey: 'assistantDirector.apiKey',
      lowEffThreshold: 'assistantDirector.lowEffThreshold',
      warnEffThreshold: 'assistantDirector.warnEffThreshold'
    },
    retail: {
      targetSellThroughDaily: 0.15,
      elasticityStepPctPerStep: 7,
      minFloorMarginPct: 5,
      maxNudgePct: 20,
      currencySymbol: '$'
    },
    staff: {
      lowEffDefault: 60,
      warnEffDefault: 75,
      inactivePhrases: ['inactive', 'days', 'weeks', 'month']
    },
    apiThrottleMs: 10000
  };

  // ---------- Utilities ----------
  function coalesce(a, b) { return (a !== undefined && a !== null) ? a : b; }
  function log(){ if (CFG.debug){ var a=[].slice.call(arguments); a.unshift('[AD v0.3.6]'); console.log.apply(console,a);} }
  function sleep(ms, cb){ return setTimeout(cb, ms); }
  function clamp(v, lo, hi){ return Math.min(hi, Math.max(lo, v)); }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return [].slice.call((root||document).querySelectorAll(sel)); }
  function getText(el){ return el ? el.textContent.trim() : ''; }

  function normalizeSpaces(str){
    return (str+'').replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g,' ')
                   .replace(/\s+/g,' ').trim();
  }
  function parseNumber(str){
    if (str==null) return null;
    var s = normalizeSpaces(str);
    var neg = /\(.*\)/.test(s);
    var n = parseFloat(s.replace(/[,$£€%]/g,'').replace(/[^\d.\-]/g,''));
    if (isNaN(n)) return null;
    return neg ? -n : n;
  }
  function percent(v,d){ return v==null ? '—' : (v.toFixed(d||0)+'%'); }
  function money(v,s){ return v==null ? '—' : ((s||CFG.retail.currencySymbol)+new Intl.NumberFormat().format(v)); }

  var store = {
    get: function(key,fallback){
      try{ var v = localStorage.getItem(key); return v==null ? (fallback===undefined?null:fallback) : JSON.parse(v); }
      catch(e){ return (fallback===undefined?null:fallback); }
    },
    set: function(key,val){ localStorage.setItem(key, JSON.stringify(val)); },
    del: function(key){ localStorage.removeItem(key); }
  };

  function detectCurrencySymbol(){
    var m = (document.body.innerText.match(/([£$€])\s?\d[\d,]*\.?\d*/) || [])[1];
    return m || CFG.retail.currencySymbol;
  }
  CFG.retail.currencySymbol = detectCurrencySymbol();

  function isTypingInPanel(){
    var panel = document.getElementById(CFG.panelId);
    var ae = document.activeElement;
    return !!(panel && ae && panel.contains(ae) && (/^(INPUT|TEXTAREA)$/).test(ae.tagName));
  }

  // ---------- HTTP ----------
  function httpGetJson(url){
    return new Promise(function(resolve,reject){
      try{
        GM_xmlhttpRequest({
          method:'GET', url:url, headers:{'Accept':'application/json'},
          onload:function(res){
            try{
              if (res.status<200 || res.status>=300) return reject(new Error('HTTP '+res.status));
              resolve(JSON.parse(res.responseText));
            }catch(e){ reject(e); }
          },
          onerror:function(){ reject(new Error('Network error')); },
          ontimeout:function(){ reject(new Error('Request timeout')); }
        });
      }catch(e){ reject(e); }
    });
  }

  // ---------- Torn API ----------
  function tornApiFetch(path,key){
    var url = 'https://api.torn.com/' + path + '&key=' + encodeURIComponent(key);
    return httpGetJson(url).then(function(data){
      if (data && data.error) throw new Error(data.error.error || 'API error');
      return data;
    });
  }

  function safeRevenue(fin){
    return (fin.revenue_daily !== undefined ? fin.revenue_daily :
           (fin.revenueDay !== undefined ? fin.revenueDay : null));
  }
  function safeProfit(fin){
    return (fin.profit_daily !== undefined ? fin.profit_daily :
           (fin.profitDay !== undefined ? fin.profitDay : null));
  }
  function computeMargin(fin){
    var rev = safeRevenue(fin);
    var prof = safeProfit(fin);
    if (rev==null || rev===0 || prof==null) return null;
    return (prof / rev) * 100;
  }

  function getCompanyViaApi(apiKey){
    return tornApiFetch('company/?selections=profile,employees,financials,upgrades,stock,newsales,settings', apiKey)
      .then(function(data){
        var c = data.company || data;
        var fin = c.financials || {};

        var summary = {
          popularity: (c.popularity !== undefined ? c.popularity : (c.company_popularity !== undefined ? c.company_popularity : null)),
          environment: (c.environment !== undefined ? c.environment : (c.company_environment !== undefined ? c.company_environment : null)),
          effectiveness: (c.effectiveness !== undefined ? c.effectiveness :
                          (c.employees && typeof c.employees.effectiveness === 'number' ? c.employees.effectiveness : null)),
          income: safeRevenue(fin),
          expenses: (fin.expenses_daily !== undefined ? fin.expenses_daily : (fin.expensesDay !== undefined ? fin.expensesDay : null)),
          profit: safeProfit(fin),
          margin: computeMargin(fin),
          vacancies: (c.positions_open !== undefined ? c.positions_open : (c.vacancies !== undefined ? c.vacancies : null))
        };

        var employees = [];
        if (Array.isArray(c.employees)){
          for (var i=0;i<c.employees.length;i++){
            var e1=c.employees[i];
            employees.push({
              name: (e1.name!==undefined?e1.name:(e1.playername!==undefined?e1.playername:'Unknown')),
              role: (e1.position!==undefined?e1.position:(e1.job!==undefined?e1.job:'Unknown')),
              effectiveness: (typeof e1.effectiveness==='number'?e1.effectiveness:(typeof e1.efficiency==='number'?e1.efficiency:null)),
              lastAction: (e1.last_action || e1.lastAction || '')
            });
          }
        } else if (c.employees && typeof c.employees==='object'){
          var keys = Object.keys(c.employees);
          for (var j=0;j<keys.length;j++){
            var e=c.employees[keys[j]];
            employees.push({
              name: (e.name!==undefined?e.name:(e.playername!==undefined?e.playername:'Unknown')),
              role: (e.position!==undefined?e.position:(e.job!==undefined?e.job:'Unknown')),
              effectiveness: (typeof e.effectiveness==='number'?e.effectiveness:(typeof e.efficiency==='number'?e.efficiency:null)),
              lastAction: (e.last_action || e.lastAction || '')
            });
          }
        }

        var stockRows = [];
        if (c.stock && typeof c.stock==='object'){
          var sKeys = Object.keys(c.stock);
          for (var k=0;k<sKeys.length;k++){
            var it=c.stock[sKeys[k]];
            stockRows.push({
              name: (it.name!==undefined?it.name:'Item'),
              price: (it.price!==undefined?it.price:null),
              stock: (it.in_stock!==undefined?it.in_stock:(it.stock!==undefined?it.stock:null)),
              soldToday: (it.sold_today!==undefined?it.sold_today:null),
              sold7d: (it.sold_week!==undefined?it.sold_week:(it.sold7d!==undefined?it.sold7d:null))
            });
          }
        }

        return { summary: summary, employees: employees, stockRows: stockRows };
      });
  }

  var lastApiTs = 0;
  function maybeGetApiData(apiKey){
    var now = Date.now();
    var needCompany = onCompanyPage() || !!isStaffTableVisible() || scrapeInventoryDOM().length>0;
    if (!apiKey || !needCompany) return Promise.resolve(null);
    if (now - lastApiTs < CFG.apiThrottleMs) return Promise.resolve(null);
    lastApiTs = now;
    return getCompanyViaApi(apiKey).catch(function(e){ console.warn('API error:', e.message); return null; });
  }

  // ---------- Panel & Styles ----------
  function injectStyles(){
    if (qs('#ad-shared-styles')) return;
    var css=document.createElement('style');
    css.id='ad-shared-styles';
    css.textContent=[
      '#'+CFG.panelId+'{',
      '  position: fixed; right: 16px; bottom: 40px; z-index: 9999;',
      '  width: 320px; max-height: 70vh; overflow: auto;',
      '  background: #0c0c0f; color: #e9e9ef; border: 1px solid #29292c; border-radius: 12px;',
      '  box-shadow: 0 8px 24px rgba(0,0,0,0.35); font-family: Arial, Helvetica, sans-serif;',
      '}',
      '#'+CFG.panelId+':focus{ outline:none; }',
      '#'+CFG.panelId+'.collapsed .ad-body, #'+CFG.panelId+'.collapsed .ad-footer{ display:none; }',
      '#'+CFG.panelId+'.collapsed{ height:auto; max-height:unset; }',
      '#'+CFG.panelId+' .ad-header{',
      '  display:flex; align-items:center; justify-content:space-between; gap:8px;',
      '  padding:10px 12px; border-bottom:1px solid #222; position:sticky; top:0; background:#0c0c0f;',
      '}',
      '#'+CFG.panelId+' .ad-title{ font-size:14px; font-weight:700; }',
      '#'+CFG.panelId+' .ad-controls button{',
      '  background:#18181b; color:#e9e9ef; border:1px solid #333; border-radius:8px; padding:4px 8px; cursor:pointer; font-size:12px;',
      '}',
      '#'+CFG.panelId+' .ad-controls button:hover{ background:#222; }',
      '#'+CFG.panelId+' .ad-body{ padding:10px 12px; }',
      '#'+CFG.panelId+' .ad-section{ border:1px solid #222; border-radius:10px; padding:8px; margin-bottom:10px; background:#101014; }',
      '#'+CFG.panelId+' .ad-section h3{ margin:0 0 6px; font-size:13px; font-weight:700; }',
      '#'+CFG.panelId+' .ad-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6px; }',
      '#'+CFG.panelId+' .ad-kv{ display:flex; justify-content:space-between; background:#121217; padding:6px; border-radius:6px; }',
      '#'+CFG.panelId+' .muted{ color:#a7a7b2; }',
      '#'+CFG.panelId+' .ok{ color:#7bd88f; } .warn{ color:#f2c14e; } .bad{ color:#ef6a6a; }',
      '#'+CFG.panelId+' .ad-chip{ display:inline-block; padding:1px 6px; border-radius:999px; background:#1d1d22; border:1px solid #333; font-size:10px; margin-left:6px; color:#9aa0a6; }',
      '#'+CFG.panelId+' .retail .item{ border-top:1px dashed #2a2a2f; padding-top:8px; margin-top:8px; }',
      '#'+CFG.panelId+' .retail .item h4{ margin:0 0 4px; font-size:12px; }',
      '#'+CFG.panelId+' .retail .row{ display:flex; justify-content:space-between; gap:8px; font-size:12px; margin:2px 0; }',
      '#'+CFG.panelId+' .retail input.cost{ width:110px; background:#0e0e12; color:#e9e9ef; border:1px solid #333; border-radius:6px; padding:2px 6px; font-size:12px; }',
      '#'+CFG.panelId+' .ad-footer{ padding:8px 12px; border-top:1px solid #222; font-size:11px; color:#a7a7b2; }',
      '#'+CFG.panelId+' .row{ display:flex; justify-content:space-between; gap:8px; font-size:12px; margin:2px 0; }',
      '#'+CFG.panelId+' input[type="password"], #'+CFG.panelId+' input[type="number"]{ background:#0e0e12; color:#e9e9ef; border:1px solid #333; border-radius:6px; padding:4px 6px; font-size:12px; }'
    ].join('\n');
    document.head.appendChild(css);
  }

  function ensurePanel(){
    injectStyles();
    var panel = qs('#'+CFG.panelId);
    if (!panel){
      panel = document.createElement('div');
      panel.id = CFG.panelId;
      panel.setAttribute('tabindex','0');
      panel.innerHTML=[
        '<div class="ad-header">',
        '  <div class="ad-title">Assistant Director <span class="ad-chip">v0.3.6</span></div>',
        '  <div class="ad-controls">',
        '    <button data-ad="refresh">Refresh</button>',
        '    <button data-ad="collapse">Collapse</button>',
        '  </div>',
        '</div>',
        '<div class="ad-body"></div>',
        '<div class="ad-footer">Read-only. Tips are heuristics; API key stored locally if you add it.</div>'
      ].join('\n');
      document.body.appendChild(panel);

      var collapsed = !!store.get(CFG.ls.collapse,false);
      if (collapsed) panel.classList.add('collapsed');
      updateCollapseButtonLabel(panel);

      panel.querySelector('[data-ad="collapse"]').addEventListener('click', function(){
        panel.classList.toggle('collapsed');
        store.set(CFG.ls.collapse, panel.classList.contains('collapsed'));
        updateCollapseButtonLabel(panel);
      });
      panel.querySelector('[data-ad="refresh"]').addEventListener('click', function(){ runAll(); });

      panel.addEventListener('input', function(e){
        if (e && e.target && e.target.id==='ad-api-key'){
          sessionStorage.setItem('ad.apiKey.draft', e.target.value);
        }
      });
    }
    return panel;
  }

  function updateCollapseButtonLabel(panel){
    var btn = qs('[data-ad="collapse"]', panel);
    if (!btn) return;
    btn.textContent = panel.classList.contains('collapsed') ? 'Expand' : 'Collapse';
  }

  function setPanelBody(html){
    var panel = ensurePanel();
    qs('.ad-body', panel).innerHTML = html;
  }

  function renderApiControls(){
    var draft = sessionStorage.getItem('ad.apiKey.draft');
    var saved = localStorage.getItem(CFG.ls.apiKey) || '';
    var apiKey = (draft !== null ? draft : saved);
    var lowDefault = store.get(CFG.ls.lowEffThreshold, CFG.staff.lowEffDefault);
    var warnDefault = store.get(CFG.ls.warnEffThreshold, CFG.staff.warnEffDefault);

    return [
      '<div class="ad-section">',
      '  <h3>Settings</h3>',
      '  <div class="row"><span class="muted">Torn API key (optional)</span><span><input id="ad-api-key" type="password" placeholder="Enter key" value="'+apiKey+'"></span></div>',
      '  <div class="row"><span class="muted">Low effectiveness threshold</span><span><input id="ad-low-thr" type="number" min="0" max="100" value="'+lowDefault+'">%</span></div>',
      '  <div class="row"><span class="muted">Warn effectiveness threshold</span><span><input id="ad-warn-thr" type="number" min="0" max="100" value="'+warnDefault+'">%</span></div>',
      '  <div class="row"><span></span><span><button id="ad-save-settings">Save</button></span></div>',
      '</div>'
    ].join('\n');
  }

  function wireSettings(){
    var panel = ensurePanel();
    var saveBtn = qs('#ad-save-settings', panel);
    if (!saveBtn) return;
    saveBtn.addEventListener('click', function(){
      var keyEl = qs('#ad-api-key', panel);
      var key = keyEl ? (keyEl.value||'').trim() : '';
      if (key) localStorage.setItem(CFG.ls.apiKey, key); else localStorage.removeItem(CFG.ls.apiKey);
      sessionStorage.removeItem('ad.apiKey.draft');

      var lowEl = qs('#ad-low-thr', panel);
      var warnEl = qs('#ad-warn-thr', panel);
      var low = parseNumber(lowEl ? lowEl.value : null);
      var warn = parseNumber(warnEl ? warnEl.value : null);
      if (low!=null) store.set(CFG.ls.lowEffThreshold, low);
      if (warn!=null) store.set(CFG.ls.warnEffThreshold, warn);
      runAll();
    });
  }

  // ---------- Page detectors ----------
  function onCompanyPage(){
    var url = location.pathname + location.search;
    return (/\/company\.php|\/companies\.php/i).test(url);
  }
  function isStaffTableVisible(){
    var tables = qsa('table, .table, .employees, .staff-list, .company-employees');
    for (var i=0;i<tables.length;i++){
      var tbl=tables[i], tr=qs('tr', tbl);
      var hdr = getText(tr||tbl).toLowerCase();
      if (/(\bemployee\b|name)/.test(hdr) && /(role|position)/.test(hdr) && /(effective|efficiency)/.test(hdr)) return tbl;
    }
    return null;
  }

  // ---------- DOM scraping (fallback) ----------
  function findByLabelNearby(label){
    var nodes = qsa('*').filter(function(el){
      var t = getText(el).toLowerCase();
      return t && t.indexOf(label)!==-1;
    });
    for (var i=0;i<nodes.length;i++){
      var el = nodes[i];
      var numHere = parseNumber(getText(el));
      if (numHere!=null) return numHere;
      var near = (el.closest && el.closest('tr,li,div')) || el.parentElement;
      if (near){
        var n1 = parseNumber(getText(qs('.value, .stat, .right, .bold, .number, ._value, ._stat, .t-green, .t-red', near)));
        if (n1!=null) return n1;
        var txt = getText(near);
        var p = /(-?\d[\d,]*\.?\d*)\s*%/.exec(txt);
        if (p) return parseNumber(p[1]);
        var m = /[$£€]\s*(-?\d[\d,]*\.?\d*)/.exec(txt);
        if (m) return parseNumber(m[1]);
      }
    }
    return null;
  }

  function scrapeCompanySummaryDOM(){
    var popularity = findByLabelNearby('popularity');
    var environment = findByLabelNearby('environment');
    var effectiveness = findByLabelNearby('effectiveness');
    var income = coalesce(findByLabelNearby('income'), findByLabelNearby('revenue'));
    var expenses = coalesce(findByLabelNearby('expenses'), findByLabelNearby('wages'));
    var profit = null, margin = null;
    if (income!=null && expenses!=null){
      profit = income - expenses;
      if (income>0) margin = (profit/income)*100;
    } else {
      var profitLbl = coalesce(findByLabelNearby('profit'), findByLabelNearby('net'));
      if (profitLbl!=null) profit = profitLbl;
    }
    var vacancies = coalesce(findByLabelNearby('vacancies'), null);
    return { popularity:popularity, environment:environment, effectiveness:effectiveness, income:income, expenses:expenses, profit:profit, margin:margin, vacancies:vacancies };
  }

  function arrayFindIndex(arr, predicate){
    for (var i=0;i<arr.length;i++){ if (predicate(arr[i], i, arr)) return i; }
    return -1;
  }
  function arrayFind(arr, predicate){
    for (var i=0;i<arr.length;i++){ if (predicate(arr[i], i, arr)) return arr[i]; }
    return undefined;
  }

  function scrapeEmployeesDOM(){
    var tbl = isStaffTableVisible();
    if (!tbl) return [];
    var rows = qsa('tr', tbl).slice(1);
    var out = [];
    rows.forEach(function(tr){
      var tds = qsa('td', tr);
      if (!tds.length) return;
      var name = getText(tds[0]) || 'Unknown';
      var role = '';
      var eff = null;
      var lastAction = '';
      for (var i=0;i<tds.length;i++){
        var td = tds[i];
        var t = getText(td).toLowerCase();
        if (!role && /(role|position)/.test(t)) role = getText(td);
        if (eff==null && /%/.test(t)){
          var p = /(-?\d[\d,]*\.?\d*)\s*%/.exec(getText(td));
          if (p) eff = parseNumber(p[1]);
        }
        if (!lastAction && /last action/i.test(getText(td))) lastAction = getText(td);
      }
      role = role || (getText(tds[1]) || '').trim();
      if (eff==null){
        var pctCell = arrayFind(tds, function(td){ return /%/.test(getText(td)); });
        eff = parseNumber(getText(pctCell || ''));
      }
      out.push({ name:name, role: role||'Unknown', effectiveness: eff, lastAction: lastAction });
    });
    return out.filter(function(e){ return e.role; });
  }

  function scrapeInventoryDOM(){
    var tables = qsa('table, .table, .inventory, .stock-list, .company-products, .items-list');
    var rows = [];
    for (var t=0;t<tables.length;t++){
      var tbl = tables[t];
      var trs = qsa('tr', tbl);
      if (trs.length<2) continue;
      var hdr = getText(trs[0]).toLowerCase();
      var looks = /(item|product|name)/.test(hdr) && /price/.test(hdr) && /(stock|qty|quantity)/.test(hdr);
      if (!looks) continue;
      for (var i=1;i<trs.length;i++){
        var tds = qsa('td', trs[i]);
        if (tds.length<3) continue;
        var name = getText(tds[0]);
        var price = parseNumber(getText(tds[1]));
        var stock = parseNumber(getText(tds[2]));
        if (!name || price==null || stock==null) continue;
var cellsText = [];
for (var c = 0; c < tds.length; c++) {
  cellsText.push(getText(tds[c]).toLowerCase());
}
        var idxToday = arrayFindIndex(cellsText, function(x){ return /sold.*today/.test(x); });
        var idx7d = arrayFindIndex(cellsText, function(x){ return /(7\s*d|week)/.test(x) || /sold.*7/.test(x); });
        var soldToday = idxToday>=0 ? parseNumber(getText(tds[idxToday])) : null;
        var sold7d = idx7d>=0 ? parseNumber(getText(tds[idx7d])) : null;
        rows.push({ name:name, price:price, stock:stock, soldToday:soldToday, sold7d:sold7d });
      }
    }
    return rows;
  }

  // ---------- Renderers ----------
  function renderCompanySummary(summary){
    var popularity=summary.popularity, environment=summary.environment, effectiveness=summary.effectiveness;
    var income=summary.income, expenses=summary.expenses, profit=summary.profit, margin=summary.margin, vacancies=summary.vacancies;

    function statClass(v, good, warn){
      if (v==null) return '';
      if (typeof v==='number' && !isNaN(v)){
        if (v>=good) return 'ok';
        if (v>=warn) return 'warn';
      }
      return 'bad';
    }

    var popCls=statClass(popularity,80,60);
    var envCls=statClass(environment,80,60);
    var effCls=statClass(effectiveness,80,60);
    var marCls=statClass(margin,20,10);

    var tips=[];
    if (vacancies!=null && vacancies>0) tips.push('You have <b>'+vacancies+'</b> vacancies — hire to lift popularity & effectiveness.');
    if (popularity!=null && popularity<70) tips.push('Consider ads/specials to boost <b>Popularity</b>.');
    if (environment!=null && environment<70) tips.push('Review upgrades/perks to improve <b>Environment</b>.');
    if (effectiveness!=null && effectiveness<75) tips.push('Check role fit & activity to raise <b>Effectiveness</b>.');
    if (margin!=null && margin<10) tips.push('Margin is low — review wages/ads/supplies, or nudge prices (see Retail Advisor).');
    if (!tips.length) tips.push('Looking solid. Maintain consistency to push for stars.');

    return [
      '<div class="ad-section">',
      '  <h3>Company Snapshot</h3>',
      '  <div class="ad-grid">',
      '    <div class="ad-kv"><span class="muted">Popularity</span><span class="'+popCls+'">'+(popularity==null?'—':percent(popularity,0))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Environment</span><span class="'+envCls+'">'+(environment==null?'—':percent(environment,0))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Effectiveness</span><span class="'+effCls+'">'+(effectiveness==null?'—':percent(effectiveness,0))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Daily Income</span><span>'+(income==null?'—':money(income))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Daily Expenses</span><span>'+(expenses==null?'—':money(expenses))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Daily Profit</span><span class="'+((profit!=null && profit<0)?'bad':'')+'">'+(profit==null?'—':money(profit))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Margin</span><span class="'+marCls+'">'+(margin==null?'—':percent(margin,1))+'</span></div>',
      '    <div class="ad-kv"><span class="muted">Vacancies</span><span>'+(vacancies==null?'—':vacancies)+'</span></div>',
      '  </div>',
      '</div>',
      renderApiControls()
    ].join('\n');
  }

  function loadItemCosts(){
    var costs = store.get(CFG.ls.itemCosts, {});
    if (!costs || typeof costs!=='object'){ costs={}; store.set(CFG.ls.itemCosts, costs); }
    return costs;
  }
  function saveItemCosts(m){ store.set(CFG.ls.itemCosts, m||{}); }

  function buildRetailAdvice(items){
    var costs = loadItemCosts();
    return items.map(function(it){
      var cost = costs[it.name];
      var margin = (cost!=null) ? ((it.price - cost)/Math.max(1,cost))*100 : null;
      var dailySold = (it.soldToday!=null) ? it.soldToday : ((it.sold7d!=null) ? it.sold7d/7 : null);
      var stockDaysLeft = dailySold ? (it.stock/Math.max(0.01,dailySold)) : null;
      var sellThroughPct = (dailySold && it.stock) ? Math.min(100,(dailySold/it.stock)*100) : null;

      var suggestion='Hold price', nudgePct=0;
      if (sellThroughPct!=null){
        var target = CFG.retail.targetSellThroughDaily*100;
        var diff = sellThroughPct - target;
        if (diff>5){
          var stepsUp = Math.ceil(diff/5);
          nudgePct = clamp(stepsUp*CFG.retail.elasticityStepPctPerStep, 0, CFG.retail.maxNudgePct);
          suggestion = 'Raise ~'+nudgePct.toFixed(0)+'%';
        } else if (diff<-5){
          var stepsDn = Math.ceil(Math.abs(diff)/5);
          nudgePct = -clamp(stepsDn*CFG.retail.elasticityStepPctPerStep, 0, CFG.retail.maxNudgePct);
          suggestion = 'Lower ~'+Math.abs(nudgePct).toFixed(0)+'%';
        }
      }

      var warnings=[];
      if (margin!=null && margin<CFG.retail.minFloorMarginPct) warnings.push('Low margin ('+percent(margin,0)+')');
      if (stockDaysLeft!=null && stockDaysLeft>30) warnings.push('Overstocked (>30 days)');

      var newPrice = nudgePct ? Math.max(0, Math.round(it.price*(1+nudgePct/100))) : it.price;

      return { name:it.name, price:it.price, stock:it.stock, soldToday:it.soldToday, sold7d:it.sold7d,
        cost:cost, margin:margin, dailySold:dailySold, stockDaysLeft:stockDaysLeft, sellThroughPct:sellThroughPct,
        suggestion:suggestion, nudgePct:nudgePct, newPrice:newPrice, warnings:warnings };
    });
  }

  function renderRetailSection(advice){
    if (!advice.length) return '';
    return [
      '<div class="ad-section retail">',
      '  <h3>Retail Pricing Advisor <span class="ad-chip">beta</span></h3>',
      advice.map(function(i){
        return [
          '<div class="item" data-name="'+i.name+'">',
          '  <h4>'+i.name+'</h4>',
          '  <div class="row"><span class="muted">Price</span><span>'+money(i.price)+'</span></div>',
          '  <div class="row"><span class="muted">Stock</span><span>'+i.stock+'</span></div>',
          (i.dailySold!=null ? '  <div class="row"><span class="muted">Sold/day</span><span>'+i.dailySold.toFixed(1)+'</span></div>' : ''),
          (i.sellThroughPct!=null ? '  <div class="row"><span class="muted">Sell-through</span><span>'+percent(i.sellThroughPct,1)+'</span></div>' : ''),
          (i.stockDaysLeft!=null ? '  <div class="row"><span class="muted">Days of stock</span><span>'+i.stockDaysLeft.toFixed(1)+'</span></div>' : ''),
          '  <div class="row"><span class="muted">Cost (edit)</span><span><input class="cost" type="number" step="1" min="0" placeholder="optional" value="'+(i.cost!=null?i.cost:'')+'" data-itemcost="'+i.name+'"></span></div>',
          (i.margin!=null ? '  <div class="row"><span class="muted">Margin</span><span>'+percent(i.margin,1)+'</span></div>' : ''),
          '  <div class="row"><span class="muted">Advice</span><span>'+i.suggestion+(i.newPrice!==i.price?(' → <b>'+money(i.newPrice)+'</b>'):'')+'</span></div>',
          (i.warnings.length ? '  <div class="row warn">⚠ '+i.warnings.join(' • ')+'</div>' : ''),
          '</div>'
        ].join('\n');
      }).join('\n'),
      '  <div class="muted" style="margin-top:6px;">Tip: set item costs to calculate margins & low-margin warnings.</div>',
      '</div>'
    ].join('\n');
  }

  function wireRetailCostInputs(){
    var container = qs('#'+CFG.panelId+' .retail');
    if (!container) return;
    var costs = loadItemCosts();
    qsa('input.cost[data-itemcost]', container).forEach(function(inp){
      inp.addEventListener('change', function(){
        var name = inp.getAttribute('data-itemcost');
        var val = parseNumber(inp.value);
        if (val==null){ delete costs[name]; } else { costs[name]=val; }
        saveItemCosts(costs);
        runAll();
      });
    });
  }

  function renderPerRoleTable(employees){
    if (!employees.length) return '';
    var lowThr = store.get(CFG.ls.lowEffThreshold, CFG.staff.lowEffDefault);
    var warnThr = store.get(CFG.ls.warnEffThreshold, CFG.staff.warnEffDefault);

    var byRole = new Map();
    employees.forEach(function(e){
      var key = e.role || 'Unknown';
      if (!byRole.has(key)) byRole.set(key, []);
      byRole.get(key).push(e);
    });

    var rows=[];
    byRole.forEach(function(list, role){
      var effs = list.map(function(l){ return (typeof l.effectiveness==='number'?l.effectiveness:null); }).filter(function(v){ return v!=null; });
      var avg = effs.length ? (effs.reduce(function(a,b){ return a+b; },0)/effs.length) : null;
      var lowCount = effs.filter(function(v){ return v<lowThr; }).length;
      var inactiveCount = list.filter(function(l){
        var la = (l.lastAction || '').toLowerCase();
        for (var i=0;i<CFG.staff.inactivePhrases.length;i++){ if (la.indexOf(CFG.staff.inactivePhrases[i])!==-1) return true; }
        return false;
      }).length;

      rows.push({ role:role, staff:list.length, avg:avg, low:lowCount, inactive:inactiveCount });
    });

    rows.sort(function(a,b){
      if (a.avg==null) return -1;
      if (b.avg==null) return 1;
      return b.avg - a.avg;
    });

    return [
      '<div class="ad-section">',
      '  <h3>Per-role Effectiveness</h3>',
      rows.map(function(r){
        var cls = (r.avg==null) ? '' : (r.avg>=warnThr ? (r.avg>=90?'ok':'warn') : 'bad');
        return '<div class="row"><span class="muted">'+r.role+' (Staff '+r.staff+')</span><span class="'+cls+'">'+(r.avg==null?'—':percent(r.avg,0))+' · Low '+r.low+' · Inactive '+r.inactive+'</span></div>';
      }).join('\n'),
      '  <div class="muted" style="margin-top:6px;">Thresholds: Low '+lowThr+'% · Warn '+warnThr+'% (adjust in Settings above).</div>',
      '</div>'
    ].join('\n');
  }

  // ---------- Main render ----------
  function runAll(){
    sleep(150, function(){
      var sections=[];
      var apiKey = localStorage.getItem(CFG.ls.apiKey) || '';
      var summary=null, employees=[], invRows=[];

      maybeGetApiData(apiKey).then(function(apiData){
        if (apiData){
          summary = apiData.summary || null;
          employees = apiData.employees || [];
          invRows = apiData.stockRows || [];
        }

        if (!summary && onCompanyPage()) summary = scrapeCompanySummaryDOM();
        if (!employees.length) employees = scrapeEmployeesDOM();
        if (!invRows.length) invRows = scrapeInventoryDOM();

        if (summary) sections.push(renderCompanySummary(summary));
        if (employees.length) sections.push(renderPerRoleTable(employees));
        if (invRows.length){
          var advice = buildRetailAdvice(invRows);
          sections.push(renderRetailSection(advice));
        }

        if (!sections.length){
          sections.push([
            '<div class="ad-section">',
            '  <h3>Assistant Director</h3>',
            '  <div class="muted">Enter your Torn API key (optional) and open Company/Staff/Inventory tabs to see data. The panel also works without API by reading the page.</div>',
            '</div>'
          ].join('\n'));
        }

        setPanelBody(sections.join('\n'));
        wireRetailCostInputs();
        wireSettings();
        updateCollapseButtonLabel(ensurePanel());
      });
    });
  }

  // ---------- Observer ----------
  var observer=null, observerTimer=null;
  function attachObserver(){
    if (observer) observer.disconnect();
    observer = new MutationObserver(function(mutations){
      var panel = ensurePanel();
      if (isTypingInPanel()) return;

      var relevant=false;
      for (var i=0;i<mutations.length;i++){
        var m = mutations[i];
        if (m.type!=='childList') continue;
        if (!panel){ relevant=true; break; }
        if (panel.contains(m.target)) continue;
        var skip=false, n;
        for (n=0;n<m.addedNodes.length;n++){ if (panel.contains(m.addedNodes[n])) { skip=true; break; } }
        if (skip) continue;
        for (n=0;n<m.removedNodes.length;n++){ if (panel.contains(m.removedNodes[n])) { skip=true; break; } }
        if (skip) continue;
        relevant=true; break;
      }
      if (!relevant) return;
      clearTimeout(observerTimer);
      observerTimer = setTimeout(runAll, 400);
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  // Boot
  ensurePanel();
  runAll();
  attachObserver();

})();
