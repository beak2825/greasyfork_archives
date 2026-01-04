// ==UserScript==
// @name         IMDb List → Send to Kodi via Fenlight (Button Action Choice)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Send or preview an entire IMDb list to Kodi (Fenlight) with button-based action selection when configured to ask each time.
// @match        https://www.imdb.com/list/ls*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544515/IMDb%20List%20%E2%86%92%20Send%20to%20Kodi%20via%20Fenlight%20%28Button%20Action%20Choice%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544515/IMDb%20List%20%E2%86%92%20Send%20to%20Kodi%20via%20Fenlight%20%28Button%20Action%20Choice%29.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  //
  // ─── KODI JSON-RPC SENDER ────────────────────────────────────────────────
  //
  function sendToKodi(url) {
    const ip   = GM_getValue('kodiIp','').trim();
    const port = GM_getValue('kodiPort','').trim();
    const user = GM_getValue('kodiUser','');
    const pass = GM_getValue('kodiPass','');
    if (!ip || !port) {
      alert('⚠️ Please configure Kodi IP & port in settings first.');
      return;
    }
    GM_xmlhttpRequest({
      method: 'POST',
      url:    `http://${ip}:${port}/jsonrpc`,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
      },
      data: JSON.stringify({
        jsonrpc: '2.0',
        id:      1,
        method:  'Player.Open',
        params:  { item: { file: url } }
      }),
      onerror(err) {
        console.error('Kodi RPC error', err);
        alert('❌ Failed to contact Kodi.');
      }
    });
  }

  //
  // ─── SETTINGS PANEL ──────────────────────────────────────────────────────
  //
  function showSettings() {
    if (document.getElementById('kodisettings-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'kodisettings-modal';
    Object.assign(overlay.style, {
      position: 'fixed', top:0, left:0, width:'100vw', height:'100vh',
      background:'rgba(0,0,0,0.8)', display:'flex',
      alignItems:'center', justifyContent:'center', zIndex:100000
    });

    const panel = document.createElement('div');
    panel.innerHTML = `
      <h2 style="margin:0 0 16px;color:#fff">Kodi Settings</h2>
      <label style="display:block;margin:8px 0 4px;color:#fff">Kodi IP:</label>
      <input id="kodiIp" style="width:100%;padding:6px" value="${GM_getValue('kodiIp','')}"/>
      <label style="display:block;margin:8px 0 4px;color:#fff">Kodi Port:</label>
      <input id="kodiPort" style="width:100%;padding:6px" value="${GM_getValue('kodiPort','')}"/>
      <label style="display:block;margin:8px 0 4px;color:#fff">Kodi User:</label>
      <input id="kodiUser" style="width:100%;padding:6px" value="${GM_getValue('kodiUser','')}"/>
      <label style="display:block;margin:8px 0 4px;color:#fff">Kodi Pass:</label>
      <input id="kodiPass" type="password" style="width:100%;padding:6px" value="${GM_getValue('kodiPass','')}"/>

      <label style="display:block;margin:12px 0 4px;color:#fff">Default Action:</label>
      <select id="kodiAction" style="width:100%;padding:6px;box-sizing:border-box">
        <option value="view">view</option>
        <option value="import">import</option>
        <option value="import_view">import_view</option>
        <option value="ask">Ask each time</option>
      </select>

      <button id="kodiSave" style="
        margin-top:16px;
        padding:8px 12px;
        background:#28a745;color:#fff;
        border:none;border-radius:4px;
        cursor:pointer;
      ">Save</button>

      <button id="kodiClose" style="
        position:absolute;top:8px;right:8px;
        background:none;border:none;color:#fff;
        font-size:18px;cursor:pointer;
      ">✖</button>
    `;
    Object.assign(panel.style, {
      background:'#222', padding:'24px',
      borderRadius:'8px', width:'360px',
      position:'relative', fontFamily:'sans-serif'
    });

    document.body.append(overlay);
    overlay.append(panel);

    panel.querySelector('#kodiAction').value = GM_getValue('kodiAction','import');

    panel.querySelector('#kodiSave').onclick = () => {
      GM_setValue('kodiIp',     panel.querySelector('#kodiIp').value);
      GM_setValue('kodiPort',   panel.querySelector('#kodiPort').value);
      GM_setValue('kodiUser',   panel.querySelector('#kodiUser').value);
      GM_setValue('kodiPass',   panel.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', panel.querySelector('#kodiAction').value);
      document.body.removeChild(overlay);
      alert('✅ Settings saved');
    };
    panel.querySelector('#kodiClose').onclick = () =>
      document.body.removeChild(overlay);
  }

  //
  // ─── JSON-LD SCRAPER ────────────────────────────────────────────────────
  //
  function extractItemList(html) {
    const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      try {
        const j = JSON.parse(m[1]);
        if (j['@type'] === 'ItemList') return j.itemListElement;
      } catch {}
    }
    return [];
  }

  async function gatherItems() {
    const origin   = location.origin;
    const basePath = location.pathname.replace(/\?.*$/,'');
    const sel      = document.getElementById('listPagination');
    const total    = sel ? sel.options.length : 1;

    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let page1 = null;
    for (const s of scripts) {
      try {
        const j = JSON.parse(s.textContent);
        if (j['@type'] === 'ItemList') { page1 = j.itemListElement; break; }
      } catch {}
    }
    if (!page1) { alert('⚠️ Failed to parse page 1 JSON-LD'); return null; }

    const urls = [];
    for (let p=2; p<=total; p++) urls.push(`${origin+basePath}?page=${p}`);
    const rest = await Promise.all(
      urls.map(u => fetch(u, {credentials:'include'})
                    .then(r => r.text())
                    .then(html => extractItemList(html)))
    );

    const all = page1.concat(...rest);
    return all.map(entry => {
      const media_id = (entry.item.url.match(/tt\d+/)||[])[0]||'';
      const rawType  = entry.item['@type']||'';
      let media_type;
      if (rawType==='Movie')        media_type='movie';
      else if (/^TV/.test(rawType)) media_type='tvshow';
      else                            media_type=rawType.toLowerCase();
      return { media_id, id_type:'imdb', media_type };
    });
  }

  //
  // ─── URL BUILDER (no id_type param) ─────────────────────────────────────
  //
  async function buildPluginUrl(action, limitCount) {
    const titleEl = document.querySelector('span.hero__primary-text[data-testid="hero__primary-text"]');
    const listName = titleEl
      ? titleEl.textContent.trim()
      : prompt('List name:','');
    if (!listName) { alert('❌ No list name'); return null; }

    let items = await gatherItems();
    if (!items) return null;

    if (Number.isInteger(limitCount) && limitCount > 0) {
      items = items.slice(0, limitCount);
    }

    return 'plugin://plugin.video.fenlight/' +
           '?mode=personal_lists.import_external' +
           `&action=${encodeURIComponent(action)}` +
           `&item_list=${encodeURIComponent(JSON.stringify(items))}` +
           `&list_name=${encodeURIComponent(listName)}`;
  }

  //
  // ─── ACTION SELECTION MODAL ─────────────────────────────────────────────
  //
  function chooseActionButton() {
    return new Promise(resolve => {
      if (document.getElementById('action-choose-modal')) return;
      const overlay = document.createElement('div');
      overlay.id = 'action-choose-modal';
      Object.assign(overlay.style, {
        position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
        background:'rgba(0,0,0,0.6)',display:'flex',
        alignItems:'center',justifyContent:'center',zIndex:100000
      });

      const panel = document.createElement('div');
      panel.innerHTML = `
        <h3 style="margin:0 0 12px;color:#fff">Select Action</h3>
        <div style="display:flex;gap:8px;justify-content:center">
          <button id="act-view"    style="padding:8px 12px;border:none;border-radius:4px;cursor:pointer">view</button>
          <button id="act-import"  style="padding:8px 12px;border:none;border-radius:4px;cursor:pointer">import</button>
          <button id="act-import_view" style="padding:8px 12px;border:none;border-radius:4px;cursor:pointer">import_view</button>
        </div>
      `;
      Object.assign(panel.style, {
        background:'#333', padding:'24px', borderRadius:'8px', fontFamily:'sans-serif', textAlign:'center'
      });

      overlay.append(panel);
      document.body.append(overlay);

      ['view','import','import_view'].forEach(act => {
        panel.querySelector(`#act-${act}`).onclick = () => {
          document.body.removeChild(overlay);
          resolve(act);
        };
      });
    });
  }

  //
  // ─── HANDLERS ───────────────────────────────────────────────────────────
  //
  async function onSendToKodi() {
    let action = GM_getValue('kodiAction','import');
    if (action === 'ask') {
      action = await chooseActionButton();
      if (!action) return;
    }

    const url = await buildPluginUrl(action);
    if (url) sendToKodi(url);
  }

  async function onShowUrl() {
    let input = prompt(
      "How many items to include from the top?\n" +
      "Enter a number (e.g. 4) or 'all' for entire list:",
      "all"
    );
    if (input === null) return;
    input = input.trim().toLowerCase();
    let limit = null;
    if (input !== 'all') {
      const n = parseInt(input, 10);
      if (isNaN(n) || n < 1) {
        alert('❌ Invalid number'); return;
      }
      limit = n;
    }

    const url = await buildPluginUrl('import', limit);
    if (!url) return;

    if (document.getElementById('url-preview-modal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'url-preview-modal';
    Object.assign(overlay.style, {
      position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
      background:'rgba(0,0,0,0.8)',display:'flex',
      alignItems:'center',justifyContent:'center',zIndex:100000
    });

    const panel = document.createElement('div');
    panel.innerHTML = `
      <h3 style="margin:0 0 12px;color:#fff">Preview Kodi Plugin URL</h3>
      <textarea readonly style="
        width:100%;height:120px;padding:8px;box-sizing:border-box;
        font-family:monospace;
      ">${url}</textarea>
      <button id="copyBtn" style="
        margin-top:12px;padding:8px 12px;background:#007bff;
        color:#fff;border:none;border-radius:4px;cursor:pointer;
      ">Copy to Clipboard</button>
      <button id="closePreview" style="
        position:absolute;top:8px;right:8px;background:none;
        border:none;color:#fff;font-size:18px;cursor:pointer;
      ">✖</button>
    `;
    Object.assign(panel.style, {
      background:'#222',padding:'24px',
      borderRadius:'8px',width:'80%',maxWidth:'720px',
      position:'relative',fontFamily:'sans-serif'
    });

    overlay.append(panel);
    document.body.append(overlay);

    panel.querySelector('#copyBtn').onclick = () => {
      const ta = panel.querySelector('textarea');
      ta.select();
      document.execCommand('copy');
      alert('✅ URL copied');
    };
    panel.querySelector('#closePreview').onclick = () =>
      document.body.removeChild(overlay);
  }

  //
  // ─── INJECT UI ──────────────────────────────────────────────────────────
  //
  function injectUI() {
    if (document.getElementById('kodiconnector-container')) return;

    const container = document.createElement('div');
    container.id = 'kodiconnector-container';
    Object.assign(container.style, {
      position:'fixed', top:'10px', right:'10px',
      zIndex:9999, display:'flex', gap:'8px'
    });

    const btnShow = document.createElement('button');
    btnShow.textContent = 'Show URL';
    Object.assign(btnShow.style,{
      padding:'8px 12px', background:'#888',
      color:'#fff', border:'none', borderRadius:'4px',
      cursor:'pointer'
    });
    btnShow.onclick = onShowUrl;
    container.append(btnShow);

    const btnSend = document.createElement('button');
    btnSend.textContent = 'Send to Kodi';
    Object.assign(btnSend.style,{
      padding:'8px 12px', background:'#f5c518',
      color:'#000', border:'none', borderRadius:'4px',
      cursor:'pointer'
    });
    btnSend.onclick = onSendToKodi;
    container.append(btnSend);

    const btnSettings = document.createElement('button');
    btnSettings.textContent = '⚙';
    Object.assign(btnSettings.style,{
      padding:'8px 12px', background:'#ccc',
      color:'#000', border:'none', borderRadius:'4px',
      cursor:'pointer'
    });
    btnSettings.onclick = showSettings;
    container.append(btnSettings);

    document.body.append(container);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
