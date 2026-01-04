// ==UserScript==
// @name         Proxy Dashboard (Safe) — Multi-Source + Cache + Auto-Refresh + SwitchyOmega Export (UA)
// @namespace    proxy-helper
// @version      3.1
// @description  Стабильный виджет: сбор прокси из нескольких источников, кэш между сессиями, автообновление, TXT-экспорт, SwitchyOmega backup (PAC-профили Random/US/Mixed), тема (светлая/тёмная), таймер. Сделано в Украине 💙💛
// @author       Gemini
// @match        *://*/*
// @exclude      *://chrome.google.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      hidxxy.name
// @connect      free-proxy.cz
// @connect      free.geonix.com
// @connect      smallseotools.com
// @connect      geonode.com
// @connect      fineproxy.org
// @connect      iproyal.com
// @connect      proxyscrape.com
// @connect      free-proxy-list.net
// @connect      proxy-list.download
// @connect      api.ipify.org
// @connect      *
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546828/Proxy%20Dashboard%20%28Safe%29%20%E2%80%94%20Multi-Source%20%2B%20Cache%20%2B%20Auto-Refresh%20%2B%20SwitchyOmega%20Export%20%28UA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546828/Proxy%20Dashboard%20%28Safe%29%20%E2%80%94%20Multi-Source%20%2B%20Cache%20%2B%20Auto-Refresh%20%2B%20SwitchyOmega%20Export%20%28UA%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__PX_DASH_RUNNING__) return; // защита от двойного запуска
  window.__PX_DASH_RUNNING__ = true;

  // -------- Settings / keys --------
  var STORE_KEYS = {
    proxies: 'px_all_proxies_v31',
    ts: 'px_updated_ts_v31',
    theme: 'px_theme_v31',
    collapsed: 'px_collapsed_v31',
    refreshMin: 'px_refresh_min_v31'
  };
  var DEFAULT_REFRESH_MIN = 10;
  var EXPERIMENTAL_TEST = false; // в обычном TM параметр proxy для GM_xmlhttpRequest не работает

  // -------- State --------
  var ALL_PROXIES = [];
  var TIMER = null;
  var nextRefreshAt = 0;
  var widget = null;

  // -------- Utils --------
  function get(k, d){ try{ var v=GM_getValue(k); return (v===undefined)?d:v; }catch(e){ return d; } }
  function set(k, v){ try{ GM_setValue(k, v); }catch(e){} }
  function now(){ return Date.now(); }
  function minutes(m){ return m*60*1000; }
  function uniqueBy(arr, keyFn){
    var map = Object.create(null), out=[], i, k;
    for(i=0;i<arr.length;i++){ k = keyFn(arr[i]); if(!map[k]){ map[k]=1; out.push(arr[i]); } }
    return out;
  }
  function shuffle(a){
    var arr=a.slice(), i, j, t;
    for (i=arr.length-1;i>0;i--){ j=(Math.random()*(i+1))|0; t=arr[i]; arr[i]=arr[j]; arr[j]=t; }
    return arr;
  }

  // -------- Sources --------
  var sources = [
    { url: 'https://hidxxy.name/proxy-list/', parser: parseHidemyName },
    { url: 'http://free-proxy.cz/ru/', parser: parseFreeProxyCz },
    { url: 'https://free.geonix.com/ru/', parser: parseGeonix },
    { url: 'https://smallseotools.com/ru/free-proxy-list/', parser: parseSmallSeoTools },
    { url: 'https://geonode.com/free-proxy-list', parser: parseGeonode },
    { url: 'https://fineproxy.org/free-proxies/north-america/united-states/', parser: parseFineProxy },
    { url: 'https://iproyal.com/free-proxy-list/', parser: parseIproyal },
    { url: 'https://proxyscrape.com/free-proxy-list', parser: parseProxyScrape },
    { url: 'https://free-proxy-list.net/', parser: parseFreeProxyListNet },
    { url: 'https://www.proxy-list.download/api/v1/get?type=http&anon=elite&country=US', parser: parseProxyListDownloadUS }
  ];
  var IPIFY = 'https://api.ipify.org?format=json';

  // -------- Theme --------
  function currentTheme(){ return get(STORE_KEYS.theme, 'dark'); }
  function setTheme(t){
    try{
      document.documentElement.setAttribute('data-px-theme', t);
      set(STORE_KEYS.theme, t);
    }catch(e){}
  }

  // -------- Styles --------
  var css = `
  :root { --px-bg:#0f1220; --px-fg:#e9eef3; --px-muted:#9aa4b2; --px-accent:#2dd4bf; --px-border:#263042; --px-btn:#243147; --px-red:#ef4444; --px-orange:#f59e0b; --px-green:#22c55e; --px-blue:#3b82f6; }
  html[data-px-theme="light"] { --px-bg:#ffffff; --px-fg:#111827; --px-muted:#4b5563; --px-accent:#0891b2; --px-border:#e5e7eb; --px-btn:#f3f4f6; --px-red:#dc2626; --px-orange:#d97706; --px-green:#16a34a; --px-blue:#2563eb; }
  #px-root{position:fixed;top:84px;right:24px;width:360px;background:var(--px-bg);color:var(--px-fg);border:1px solid var(--px-border);border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.35);font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;z-index:2147483647;overflow:hidden}
  #px-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:linear-gradient(135deg,#0ea5e9,#22c55e)}
  #px-title{font-weight:800;font-size:15px;display:flex;align-items:center;gap:8px}
  #px-ua{display:flex;align-items:center;gap:6px;font-weight:800;background:#ffe15a;color:#0057b8;padding:3px 8px;border-radius:999px;border:1px solid #ffd24a;box-shadow:0 0 0 2px rgba(0,0,0,.05)}
  #px-body{padding:10px;display:block;max-height:480px;overflow:auto;background:var(--px-bg)}
  .px-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
  .px-input, .px-select{width:100%;background:transparent;border:1px solid var(--px-border);color:var(--px-fg);border-radius:10px;padding:8px 10px;outline:none}
  .px-btn{background:var(--px-btn);color:var(--px-fg);border:1px solid var(--px-border);border-radius:10px;padding:9px 10px;font-weight:700;cursor:pointer}
  .px-btn.primary{background:var(--px-blue);border-color:transparent;color:#fff}
  .px-btn.good{background:var(--px-green);border-color:transparent;color:#fff}
  .px-btn.warn{background:var(--px-orange);border-color:transparent;color:#111}
  .px-note{font-size:12px;color:var(--px-muted)}
  .px-badge{display:inline-flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--px-border);padding:4px 8px;border-radius:8px;font-size:12px}
  .px-proxy-list{font:12px/1.5 ui-monospace,Menlo,Consolas,monospace;background:rgba(0,0,0,.2);border:1px solid var(--px-border);border-radius:10px;padding:8px;color:var(--px-fg);white-space:pre-wrap;word-break:break-all;max-height:180px;overflow:auto}
  .px-right{display:flex;gap:6px;align-items:center}
  .px-toggle{appearance:none;width:42px;height:24px;background:var(--px-border);border-radius:999px;position:relative;outline:none;cursor:pointer;border:none}
  .px-toggle:after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
  .px-toggle:checked{background:var(--px-blue)}
  .px-toggle:checked:after{left:21px}
  #px-min{background:rgba(0,0,0,.15);border:1px solid var(--px-border);color:#fff}
  .px-progress{height:6px;background:rgba(0,0,0,.15);border-radius:999px;overflow:hidden;margin:8px 0}
  .px-progress > div{height:100%;background:var(--px-blue);width:0%}
  `;

  try { GM_addStyle(css); } catch(e){
    var st = document.createElement('style'); st.textContent = css; (document.head||document.documentElement).appendChild(st);
  }
  setTheme(currentTheme());

  // -------- UI --------
  function buildUI(){
    widget = document.createElement('div');
    widget.id = 'px-root';
    widget.innerHTML =
      '<div id="px-header">' +
        '<div id="px-title">🧭 Proxy Dashboard <span class="px-badge"><span id="px-count">0</span> proxies</span></div>' +
        '<div class="px-right">' +
          '<label class="px-note">Light</label><input id="px-theme" type="checkbox" class="px-toggle">' +
          '<button id="px-min" class="px-btn">—</button>' +
        '</div>' +
      '</div>' +
      '<div id="px-body">' +
        '<div class="px-note" style="display:flex;align-items:center;gap:8px;justify-content:space-between">' +
          '<span id="px-madeinua"><span id="px-ua" title="Сделано в Украине">🇺🇦 <span>Made in Ukraine</span></span></span>' +
          '<span class="px-badge">Кэш: <span id="px-updated">—</span></span>' +
        '</div>' +
        '<div class="px-row" style="margin-top:8px">' +
          '<div><label class="px-note">Интервал автообновления (мин)</label><input id="px-refresh" type="number" min="1" step="1" class="px-input" value="' + esc(get(STORE_KEYS.refreshMin, DEFAULT_REFRESH_MIN)) + '"></div>' +
          '<div><label class="px-note">Профиль/фильтр</label><select id="px-filter" class="px-select">' +
              '<option value="random">Random</option>' +
              '<option value="us">US only</option>' +
              '<option value="mixed">Mixed</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="px-row">' +
          '<button id="px-refresh-now" class="px-btn primary">🔄 Обновить сейчас</button>' +
          '<button id="px-copy" class="px-btn">📋 Скопировать всё</button>' +
        '</div>' +
        '<div class="px-row">' +
          '<button id="px-export-txt" class="px-btn">⬇️ Экспорт TXT</button>' +
          '<button id="px-export-omega" class="px-btn good">🧩 Export SwitchyOmega</button>' +
        '</div>' +
        '<div class="px-row">' +
          '<button id="px-test-one" class="px-btn warn">🧪 Тест (эксп.)</button>' +
          '<span class="px-badge">До обновления: <span id="px-eta">—</span></span>' +
        '</div>' +
        '<div class="px-progress"><div id="px-progress-bar"></div></div>' +
        '<div id="px-list" class="px-proxy-list">—</div>' +
        '<div class="px-note">Источники: ' + sources.length + ' (парсеры защищены — если разметка изменилась, источник пропускается).</div>' +
      '</div>' +
      '<div id="px-footer"><span class="px-note">IP-проверка: ' + (EXPERIMENTAL_TEST?'экспериментальная':'отключена') + '</span></div>';

    (document.body||document.documentElement).appendChild(widget);

    // Theme init & toggle
    var themeToggle = document.getElementById('px-theme');
    themeToggle.checked = (currentTheme()==='light');
    themeToggle.addEventListener('change', function(){
      setTheme(this.checked ? 'light' : 'dark');
    });

    // Collapse
    var body = document.getElementById('px-body');
    var collapsed = !!get(STORE_KEYS.collapsed, false);
    if (collapsed) body.style.display = 'none';
    var minBtn = document.getElementById('px-min');
    minBtn.textContent = collapsed ? '+' : '—';
    minBtn.addEventListener('click', function(){
      var hidden = body.style.display === 'none';
      body.style.display = hidden ? 'block' : 'none';
      minBtn.textContent = hidden ? '—' : '+';
      set(STORE_KEYS.collapsed, !hidden);
    });

    // Drag header
    var header = document.getElementById('px-header');
    var dragging=false,sx=0,sy=0,ox=0,oy=0;
    header.addEventListener('mousedown', function(e){
      if (e.target && e.target.id === 'px-theme') return;
      dragging = true; sx=e.clientX; sy=e.clientY;
      var r = widget.getBoundingClientRect(); ox=r.left; oy=r.top;
      document.body.style.userSelect='none';
    });
    document.addEventListener('mousemove', function(e){
      if(!dragging) return;
      widget.style.left = (ox + (e.clientX - sx)) + 'px';
      widget.style.top  = (oy + (e.clientY - sy)) + 'px';
      widget.style.right = 'auto';
    });
    document.addEventListener('mouseup', function(){
      if(!dragging) return; dragging=false; document.body.style.userSelect='';
    });

    // Buttons
    id('px-refresh-now').addEventListener('click', function(){ refreshAll(true); });
    id('px-copy').addEventListener('click', copyAll);
    id('px-export-txt').addEventListener('click', exportTXT);
    id('px-export-omega').addEventListener('click', exportSwitchyOmega);
    id('px-test-one').addEventListener('click', testOneProxy);

    // Refresh input
    id('px-refresh').addEventListener('change', function(){
      var v = parseInt(this.value,10); if (!v || v<1) v = DEFAULT_REFRESH_MIN;
      set(STORE_KEYS.refreshMin, v); scheduleNext();
    });

    // Load from cache
    var cached = get(STORE_KEYS.proxies, []);
    var ts = get(STORE_KEYS.ts, 0);
    if (cached && cached.length){
      ALL_PROXIES = cached;
      renderList();
      updateUpdated(ts);
    }

    scheduleNext();
    var refreshMin = get(STORE_KEYS.refreshMin, DEFAULT_REFRESH_MIN);
    var stale = !ts || (now()-ts > minutes(refreshMin));
    if (stale) refreshAll(true);
  }

  // -------- DOM helpers --------
  function id(s){ return document.getElementById(s); }
  function esc(s){ return String(s===undefined||s===null?'':s); }

  function updateProgress(pct){
    var bar = id('px-progress-bar'); if (bar) bar.style.width = (Math.max(0, Math.min(100, pct))+'%');
  }
  function updateUpdated(ts){
    var el = id('px-updated'); if (!el) return;
    el.textContent = ts ? new Date(ts).toLocaleString() : '—';
  }
  function renderList(){
    var list = id('px-list'), count = id('px-count');
    if (count) count.textContent = String(ALL_PROXIES.length||0);
    var lines = [];
    for (var i=0;i<ALL_PROXIES.length;i++){
      var p = ALL_PROXIES[i];
      lines.push(p.ip + ':' + p.port + (p.country ? (' # ' + p.country) : ''));
    }
    list.textContent = lines.length ? lines.join('\n') : '—';
  }
  function scheduleNext(){
    var mins = get(STORE_KEYS.refreshMin, DEFAULT_REFRESH_MIN);
    nextRefreshAt = now() + minutes(mins);
    if (TIMER) clearInterval(TIMER);
    TIMER = setInterval(function(){
      var etaEl = id('px-eta'); if (!etaEl) return;
      var d = nextRefreshAt - now();
      if (d<=0){ etaEl.textContent='0s'; clearInterval(TIMER); refreshAll(true); return; }
      var s = Math.ceil(d/1000), mm = Math.floor(s/60), ss=s%60;
      etaEl.textContent = mm + ':' + (ss<10?'0':'') + ss;
    }, 1000);
  }

  // -------- Refresh / parsers --------
  function refreshAll(withProgress){
    var total = sources.length, done = 0;
    updateProgress(0);
    var collected = [];
    var i;

    function onDone(){ done++; if (withProgress) updateProgress(100*done/total); if (done>=total) finalize(); }

    for (i=0;i<sources.length;i++){
      (function(src){
        GM_xmlhttpRequest({
          method: 'GET',
          url: src.url,
          timeout: 20000,
          onload: function(res){
            try{
              var list = src.parser(res.responseText || '');
              for (var j=0;j<list.length;j++){
                var raw = list[j];
                if (typeof raw === 'string'){
                  var parts = raw.split(':'); if (parts.length>=2) collected.push({ip:parts[0].trim(), port:parts[1].trim(), source:src.url});
                } else if (raw && raw.ip && raw.port){
                  collected.push({ip:raw.ip, port:raw.port, country:raw.country, source:src.url});
                }
              }
            }catch(e){ /* ignore */ }
            onDone();
          },
          onerror: onDone,
          ontimeout: onDone
        });
      })(sources[i]);
    }

    function finalize(){
      ALL_PROXIES = uniqueBy(collected, function(o){ return o.ip+':'+o.port; });
      set(STORE_KEYS.proxies, ALL_PROXIES);
      var ts = now(); set(STORE_KEYS.ts, ts); updateUpdated(ts);
      renderList(); scheduleNext();
    }
  }

  // ---- Parsers (максимально совместимые) ----
  function parseHidemyName(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var tds = rows[i].querySelectorAll('td');
      if (tds.length>=2){
        var ip = (tds[0].textContent||'').trim();
        var port = (tds[1].textContent||'').trim();
        if (ip && port) out.push({ip:ip,port:port});
      }
    }
    return out;
  }
  function parseFreeProxyCz(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('.fwp-list > table tr'), i;
    for (i=0;i<rows.length;i++){
      var ipCell = rows[i].querySelector('td:nth-of-type(1)');
      var portCell = rows[i].querySelector('td:nth-of-type(2)');
      if (ipCell && portCell){
        try{
          var sc = ipCell.querySelector('script');
          var enc = sc ? ((sc.textContent||'').match(/"(.*?)"/)||[])[1] : null;
          var ip = enc ? atob(enc) : (ipCell.textContent||'').trim();
          var port = (portCell.textContent||'').trim();
          if (ip && port) out.push({ip:ip,port:port});
        }catch(e){}
      }
    }
    return out;
  }
  function parseGeonix(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('.proxy-list tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var ip = (rows[i].querySelector('td:nth-of-type(1)')||{}).textContent;
      var port = (rows[i].querySelector('td:nth-of-type(2)')||{}).textContent;
      if (ip && port){ ip=ip.trim(); port=port.trim(); if(ip&&port) out.push({ip:ip,port:port}); }
    }
    return out;
  }
  function parseSmallSeoTools(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('#content-section table tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var ip = (rows[i].querySelector('td:nth-of-type(1)')||{}).textContent;
      var port = (rows[i].querySelector('td:nth-of-type(2)')||{}).textContent;
      if (ip && port){ ip=ip.trim(); port=port.trim(); if(ip&&port) out.push({ip:ip,port:port}); }
    }
    return out;
  }
  function parseGeonode(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('.list-container .list-row'), i;
    for (i=0;i<rows.length;i++){
      var ip = (rows[i].querySelector('p:nth-of-type(1)')||{}).textContent;
      var port = (rows[i].querySelector('p:nth-of-type(2)')||{}).textContent;
      if (ip && port){ ip=ip.trim(); port=port.trim(); if(ip&&port) out.push({ip:ip,port:port}); }
    }
    return out;
  }
  function parseFineProxy(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('#proxytable tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var tds = rows[i].querySelectorAll('td');
      if (tds.length>=2){
        var ip = (tds[0].textContent||'').trim();
        var port = (tds[1].textContent||'').trim();
        var country = (tds[3] && tds[3].textContent) ? tds[3].textContent.trim() : '';
        if (ip && port) out.push({ip:ip,port:port,country:country});
      }
    }
    return out;
  }
  function parseIproyal(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], ips=d.querySelectorAll('td.ip'), ports=d.querySelectorAll('td.port');
    var n = Math.min(ips.length, ports.length), i;
    for (i=0;i<n;i++){
      var ip=(ips[i].textContent||'').trim(); var port=(ports[i].textContent||'').trim();
      if (ip && port) out.push({ip:ip,port:port});
    }
    return out;
  }
  function parseProxyScrape(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('table.w-full.text-left.text-sm tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var ip = (rows[i].querySelector('td:nth-of-type(1)')||{}).textContent;
      var port = (rows[i].querySelector('td:nth-of-type(2)')||{}).textContent;
      if (ip && port){ ip=ip.trim(); port=port.trim(); if(ip&&port) out.push({ip:ip,port:port}); }
    }
    return out;
  }
  function parseFreeProxyListNet(html){
    var d = new DOMParser().parseFromString(html,'text/html'), out=[], rows=d.querySelectorAll('#proxylisttable tbody tr'), i;
    for (i=0;i<rows.length;i++){
      var ip = (rows[i].querySelector('td:nth-of-type(1)')||{}).textContent;
      var port = (rows[i].querySelector('td:nth-of-type(2)')||{}).textContent;
      var country = (rows[i].querySelector('td:nth-of-type(4)')||{}).textContent;
      if (ip && port){ ip=ip.trim(); port=port.trim(); if(ip&&port) out.push({ip:ip,port:port,country:country?country.trim():''}); }
    }
    return out;
  }
  function parseProxyListDownloadUS(text){
    var lines = String(text||'').split('\n'), out=[], i;
    for (i=0;i<lines.length;i++){
      var s = lines[i].trim(); if (!s) continue;
      var parts = s.split(':'); if (parts.length>=2){
        out.push({ip:parts[0].trim(), port:parts[1].trim(), country:'US'});
      }
    }
    return out;
  }

  // -------- Filters --------
  function filteredList(mode){
    var list = ALL_PROXIES.slice();
    if (mode==='us') {
      var us = [], i, p, c;
      for (i=0;i<list.length;i++){
        p = list[i]; c = (p.country||'') + ' ' + (p.source||'');
        if (/(^|\s)(US|United\s+States)(\s|$)/i.test(c) || /country=US/i.test(c)) us.push(p);
      }
      return us;
    }
    if (mode==='mixed'){
      var allUS = filteredList('us');
      var non = [];
      for (var j=0;j<list.length;j++){
        if (allUS.indexOf(list[j])===-1) non.push(list[j]);
      }
      var size = Math.min(list.length, 50), half = Math.floor(size/2);
      return shuffle(allUS).slice(0,half).concat(shuffle(non).slice(0,size-half));
    }
    return shuffle(list);
  }

  // -------- Export / copy --------
  function copyAll(){
    var mode = id('px-filter').value;
    var arr = filteredList(mode), out=[], i;
    for (i=0;i<arr.length;i++){ out.push(arr[i].ip+':'+arr[i].port); }
    navigator.clipboard.writeText(out.join('\n')).catch(function(){ alert('Не удалось скопировать в буфер.'); });
  }
  function exportTXT(){
    var mode = id('px-filter').value;
    var arr = filteredList(mode), out=[], i;
    for (i=0;i<arr.length;i++){ out.push(arr[i].ip+':'+arr[i].port); }
    blobDownload(out.join('\n'), 'proxies_'+mode+'_'+isoStamp()+'.txt', 'text/plain');
  }
  function exportSwitchyOmega(){
    function makePAC(arr){
      var list=[], i, lim=Math.min(arr.length, 200);
      for (i=0;i<lim;i++){ list.push(arr[i].ip+':'+arr[i].port); }
      var body = 'function FindProxyForURL(url, host){\n' +
        '  var L = ' + JSON.stringify(list) + ';\n' +
        '  if (!L || L.length===0) return "DIRECT";\n' +
        '  var i = Math.floor(Math.random()*L.length);\n' +
        '  return "PROXY " + L[i] + "; DIRECT";\n' +
        '}';
      return body;
    }
    var backup = {
      version: '3.0.0',
      time: Date.now(),
      schema: 'omega-profiles',
      profiles: [
        { name:'Random', type:'pac', profilePicture:'pac', pacScript: makePAC(filteredList('random')) },
        { name:'US',     type:'pac', profilePicture:'pac', pacScript: makePAC(filteredList('us')) },
        { name:'Mixed',  type:'pac', profilePicture:'pac', pacScript: makePAC(filteredList('mixed')) }
      ]
    };
    blobDownload(JSON.stringify(backup,null,2), 'SwitchyOmega_Backup_'+isoStamp()+'.json', 'application/json');
  }
  function blobDownload(content, filename, type){
    var blob = new Blob([content], {type:type});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download=filename;
    (document.body||document.documentElement).appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  }
  function isoStamp(){ return new Date().toISOString().slice(0,19).replace(/[:T]/g,'-'); }

  // -------- Test (informative only) --------
  function testOneProxy(){
    if (!EXPERIMENTAL_TEST){ alert('В стандартном Tampermonkey тест через сам прокси недоступен. Экспорт/кэш/обновления работают.'); return; }
    var mode = id('px-filter').value;
    var list = filteredList(mode);
    if (!list.length) return alert('Список пуст.');
    var pick = list[(Math.random()*list.length)|0];
    var proxyURL = 'http://' + pick.ip + ':' + pick.port;

    GM_xmlhttpRequest({
      method: 'GET',
      url: IPIFY,
      timeout: 8000,
      proxy: proxyURL, // скорее всего будет проигнорировано
      onload: function(res){
        try{ var data = JSON.parse(res.responseText||'{}'); alert('Ответ: ' + (data.ip||'—')); }catch(e){ alert('Ответ получен, но JSON не разобран.'); }
      },
      onerror: function(){ alert('Ошибка запроса (вероятно, TM проигнорировал proxy-поле).'); },
      ontimeout: function(){ alert('Таймаут/прокси медленный.'); }
    });
  }

  // -------- Boot --------
  try { buildUI(); } catch(e){ console.error('[PX] UI build error', e); }

})();
