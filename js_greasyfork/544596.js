// ==UserScript==
// @name         IMDb List → Send to Kodi via Fenlight (Ask-each-time fixed + omit action option)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Send an IMDb list to Kodi (Fenlight) as a personal list; pick a default action, have it ask each time with buttons, or omit the action key.
// @match        https://www.imdb.com/list/ls*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544596/IMDb%20List%20%E2%86%92%20Send%20to%20Kodi%20via%20Fenlight%20%28Ask-each-time%20fixed%20%2B%20omit%20action%20option%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544596/IMDb%20List%20%E2%86%92%20Send%20to%20Kodi%20via%20Fenlight%20%28Ask-each-time%20fixed%20%2B%20omit%20action%20option%29.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  // ─── Kodi JSON-RPC sender ───────────────────────────────────────────────
  function sendToKodi(url) {
    const ip   = GM_getValue('kodiIp','').trim();
    const port = GM_getValue('kodiPort','').trim();
    const user = GM_getValue('kodiUser','');
    const pass = GM_getValue('kodiPass','');
    if (!ip || !port) {
      alert('⚠️ Please configure Kodi IP & port in settings.');
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
        method:  'RunPlugin',       // ← use RunPlugin instead of Player.Open
        params:  { path: url }      // ← pass the plugin:// URL in "path"
      }),
      onerror() {
        alert('❌ Failed to contact Kodi.');
      }
    });
  }

  // ─── Settings panel ─────────────────────────────────────────────────────
  function showSettings() {
    if (document.getElementById('kodisettings')) return;
    const overlay = document.createElement('div');
    overlay.id = 'kodisettings';
    Object.assign(overlay.style, {
      position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
      background:'rgba(0,0,0,0.7)',display:'flex',
      alignItems:'center',justifyContent:'center',zIndex:99999
    });
    const panel = document.createElement('div');
    panel.innerHTML = `
      <h2 style="margin-bottom:16px;color:#fff">Kodi Settings</h2>
      <label style="color:#fff">Kodi IP:</label>
      <input id="kodiIp" value="${GM_getValue('kodiIp','')}" style="width:100%;margin-bottom:8px"/>
      <label style="color:#fff">Kodi Port:</label>
      <input id="kodiPort" value="${GM_getValue('kodiPort','')}" style="width:100%;margin-bottom:8px"/>
      <label style="color:#fff">Kodi User:</label>
      <input id="kodiUser" value="${GM_getValue('kodiUser','')}" style="width:100%;margin-bottom:8px"/>
      <label style="color:#fff">Kodi Pass:</label>
      <input id="kodiPass" type="password" value="${GM_getValue('kodiPass','')}" style="width:100%;margin-bottom:12px"/>
      <label style="color:#fff">Default Action:</label>
      <select id="kodiAction" style="width:100%;margin-bottom:16px">
        <option value="">Omit Action key</option>
        <option value="view">view</option>
        <option value="import">import</option>
        <option value="import_view">import_view</option>
        <option value="ask">Ask each time</option>
      </select>
      <div style="text-align:right">
        <button id="kodisave" style="margin-right:8px">Save</button>
        <button id="kodicancel">Cancel</button>
      </div>
    `;
    Object.assign(panel.style, {
      background:'#222', padding:'20px',
      borderRadius:'6px', width:'300px', boxSizing:'border-box'
    });
    overlay.append(panel);
    document.body.append(overlay);

    panel.querySelector('#kodiAction').value = GM_getValue('kodiAction','import');
    panel.querySelector('#kodisave').onclick = () => {
      GM_setValue('kodiIp',     panel.querySelector('#kodiIp').value.trim());
      GM_setValue('kodiPort',   panel.querySelector('#kodiPort').value.trim());
      GM_setValue('kodiUser',   panel.querySelector('#kodiUser').value);
      GM_setValue('kodiPass',   panel.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', panel.querySelector('#kodiAction').value);
      document.body.removeChild(overlay);
      alert('✅ Settings saved');
    };
    panel.querySelector('#kodicancel').onclick = () =>
      document.body.removeChild(overlay);
  }

  // ─── Grab JSON-LD itemList ──────────────────────────────────────────────
  function extractItemList(html) {
    const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      try {
        const j = JSON.parse(m[1]);
        if (j['@type']==='ItemList') return j.itemListElement;
      } catch {}
    }
    return [];
  }
  async function gatherItems() {
    const origin   = location.origin;
    const basePath = location.pathname.replace(/\?.*$/,'');
    const sel      = document.getElementById('listPagination');
    const total    = sel? sel.options.length : 1;

    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let page1 = null;
    for (const s of scripts) {
      try {
        const j = JSON.parse(s.textContent);
        if (j['@type']==='ItemList') { page1 = j.itemListElement; break; }
      } catch{}
    }
    if (!page1) { alert('⚠️ Failed page 1 parse'); return null; }

    const urls = [];
    for (let p=2; p<=total; p++) urls.push(`${origin+basePath}?page=${p}`);
    const rest = await Promise.all(
      urls.map(u=>fetch(u,{credentials:'include'})
                .then(r=>r.text())
                .then(html=>extractItemList(html)))
    );

    const all = page1.concat(...rest);
    return all.map(e => {
      const id  = (e.item.url.match(/tt\d+/)||[])[0]||'';
      const t   = e.item['@type']||'';
      const mt  = t==='Movie' ? 'movie' : /^TV/.test(t) ? 'tvshow' : t.toLowerCase();
      return { media_id:id, id_type:'imdb', media_type:mt };
    });
  }

  // ─── Build Fenlight URL ─────────────────────────────────────────────────
  async function buildPluginUrl(action, limit) {
    const hero = document.querySelector('span.hero__primary-text[data-testid="hero__primary-text"]');
    const listName = hero
      ? hero.textContent.trim()
      : prompt('List name:','');
    if (!listName) return null;

    let items = await gatherItems();
    if (!items) return null;
    if (Number.isInteger(limit) && limit > 0) {
      items = items.slice(0, limit);
    }

    const base = 'plugin://plugin.video.fenlight/' +
           '?mode=personal_lists.import_external';
    const actionPart = action ? `&action=${encodeURIComponent(action)}` : '';
    return base +
           actionPart +
           `&item_list=${encodeURIComponent(JSON.stringify(items))}` +
           `&list_name=${encodeURIComponent(listName)}`;
  }

  // ─── Ask-each-time modal ─────────────────────────────────────────────────
  function chooseAction() {
    return new Promise(resolve => {
      const o = document.createElement('div');
      Object.assign(o.style, {
        position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
        background:'rgba(0,0,0,0.7)',display:'flex',
        alignItems:'center',justifyContent:'center',zIndex:99999
      });
      const p = document.createElement('div');
      p.innerHTML = `
        <h3 style="margin-bottom:12px;color:#fff">Choose Action:</h3>
        <button data-act="">omit action key</button>
        <button data-act="view">view</button>
        <button data-act="import">import</button>
        <button data-act="import_view">import_view</button>
      `;
      Object.assign(p.style, {
        background:'#222',padding:'20px',borderRadius:'6px',
        display:'flex',flexDirection:'column',gap:'8px',alignItems:'stretch'
      });
      o.append(p);
      document.body.append(o);

      p.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const a = btn.getAttribute('data-act');
          document.body.removeChild(o);
          resolve(a);
        };
      });
    });
  }

  // ─── Handlers ────────────────────────────────────────────────────────────
  async function onSendToKodi() {
    let action = GM_getValue('kodiAction','import');
    if (action === 'ask') {
      action = await chooseAction();
      if (action === null || action === undefined) return;
    }
    const url = await buildPluginUrl(action);
    if (url) sendToKodi(url);
  }

  async function onShowUrl() {
    let resp = prompt("Top N items? Enter number or 'all':","all");
    if (resp===null) return;
    resp = resp.trim().toLowerCase();
    let limit = null;
    if (resp!=='all') {
      const n = parseInt(resp,10);
      if (isNaN(n)||n<1) { alert('❌ Invalid'); return; }
      limit = n;
    }
    const defaultAction = GM_getValue('kodiAction','import');
    let action = defaultAction;
    if (defaultAction === 'ask') {
      action = await chooseAction();
      if (action === null || action === undefined) return;
    }
    const url = await buildPluginUrl(action, limit);
    if (!url) return;

    const o = document.createElement('div');
    Object.assign(o.style, {
      position:'fixed',top:0,left:0,width:'100vw',height:'100vh',
      background:'rgba(0,0,0,0.7)',display:'flex',
      alignItems:'center',justifyContent:'center',zIndex:99998
    });
    const p = document.createElement('div');
    p.innerHTML = `
      <h3 style="margin-bottom:8px;color:#fff">Preview URL:</h3>
      <textarea readonly style="width:320px;height:120px">${url}</textarea>
      <button id="copyBtn" style="margin-top:8px">Copy to Clipboard</button>
      <button id="closeBtn" style="margin-left:8px">Close</button>
    `;
    Object.assign(p.style, {
      background:'#222',padding:'16px',borderRadius:'6px',textAlign:'center'
    });
    o.append(p);
    document.body.append(o);

    p.querySelector('#copyBtn').onclick = () => {
      const ta = p.querySelector('textarea');
      ta.select(); document.execCommand('copy');
      alert('✅ Copied');
    };
    p.querySelector('#closeBtn').onclick = () => document.body.removeChild(o);
  }

  // ─── Inject UI ──────────────────────────────────────────────────────────
  function injectUI() {
    if (document.getElementById('kodicont')) return;
    const c = document.createElement('div');
    c.id = 'kodicont';
    Object.assign(c.style, {
      position:'fixed',top:'10px',right:'10px',display:'flex',gap:'8px',zIndex:9999
    });
    const b1 = document.createElement('button');
    b1.textContent = 'Show URL'; b1.onclick = onShowUrl;
    const b2 = document.createElement('button');
    b2.textContent = 'Send to Kodi'; b2.onclick = onSendToKodi;
    const b3 = document.createElement('button');
    b3.textContent = '⚙'; b3.onclick = showSettings;
    [b1,b2,b3].forEach(b=>{
      Object.assign(b.style,{
        padding:'6px 12px',border:'none',borderRadius:'4px',cursor:'pointer'
      });
    });
    c.append(b1,b2,b3);
    document.body.append(c);
  }

  if (document.readyState==='loading') {
    window.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
