// ==UserScript==
// @name         Custom Favicon Per Site
// @namespace    harry297.favicon
// @version      1.3.0
// @description  Safer per-domain favicon override with debounce & preflight.
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545413/Custom%20Favicon%20Per%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/545413/Custom%20Favicon%20Per%20Site.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const KEY = 'custom_favicon_rules_v14';

  // ---------- Rule model ----------
  // { scope: 'host' | 'domain' | 'prefix', key: string, icon: string }
  // host:   key = full hostname (e.g. 'app.site.com')
  // domain: key = registrable domain (rough heuristic: last 2 labels; allow override)
  // prefix: key = URL prefix like 'https://site.com/path/'
  function load(){ try{ return JSON.parse(GM_getValue(KEY, '[]')); }catch{ return []; } }
  function save(list){ GM_setValue(KEY, JSON.stringify(list)); }

  function getHostname(){ return location.hostname; }
  function getDomainHeuristic(host){
    const parts = host.split('.');
    if (parts.length <= 2) return host;
    // Heuristic: last 2 labels (note: .co.uk 等会不准，必要时自己改成 example.co.uk)
    return parts.slice(-2).join('.');
  }
  function getPrefix(){
    // standardize to trailing slash
    const u = new URL(location.href);
    let p = `${u.origin}${u.pathname}`;
    if (!p.endsWith('/')) p = p.replace(/[^/]+$/, '');
    return p;
  }

  function matchRule(rule){
    if (rule.scope === 'host') return getHostname() === rule.key;
    if (rule.scope === 'domain') return (getHostname() === rule.key) || getHostname().endsWith('.' + rule.key);
    if (rule.scope === 'prefix') return location.href.startsWith(rule.key);
    return false;
  }

  function bestRule(rules){
    // Priority: prefix > host > domain (更具体的优先)
    const candidates = rules.filter(matchRule);
    const score = r => r.scope === 'prefix' ? 3 : r.scope === 'host' ? 2 : 1;
    candidates.sort((a,b)=>score(b)-score(a));
    return candidates[0] || null;
  }

  // ---------- favicon ops ----------
  function isMixedContent(url){
    try{
      const u = new URL(url, location.href);
      return location.protocol === 'https:' && u.protocol === 'http:';
    }catch{ return false; }
  }
  function preflight(url, cb){
    if (/^data:/i.test(url)) return cb(true);
    if (isMixedContent(url)) return cb(false, 'Mixed content: use HTTPS icon on HTTPS pages.');
    try{
      GM_xmlhttpRequest({
        method: 'GET',
        url: new URL(url, location.href).toString(),
        timeout: 4000,
        onload: r => cb(r.status >= 200 && r.status < 400),
        onerror: () => cb(false, 'Network error'),
        ontimeout: () => cb(false, 'Timeout'),
      });
    }catch{ cb(false, 'Invalid URL'); }
  }

  function removeIcons(){
    if (!document.head) return;
    document.head.querySelectorAll(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
    ).forEach(n=>n.remove());
  }
  function addIcons(href){
    if (!document.head) return;
    const add = (rel, sizes) => {
      const l = document.createElement('link');
      l.rel = rel;
      if (sizes) l.sizes = sizes;
      l.href = href;
      document.head.appendChild(l);
    };
    add('icon');
    add('shortcut icon');
    add('apple-touch-icon','180x180');
  }

  let applied = null;
  const apply = (href) => {
    if (!href) return;
    removeIcons();
    addIcons(href);
    applied = href;
  };

  // 防抖，避免 SPA 频繁替换引发循环
  let timer = null;
  const debouncedApply = href => { clearTimeout(timer); timer = setTimeout(()=>apply(href), 60); };

  function watch(href){
    if (!document.head) return;
    const mo = new MutationObserver(()=>{
      // 如果站点又塞回了自己的 icon，我们再覆盖一次
      const siteIcon = document.head.querySelector("link[rel*='icon']");
      if (siteIcon && applied !== href) debouncedApply(href);
    });
    mo.observe(document.head, { childList: true, subtree: true });
  }

  // ---------- boot ----------
  const rules = load();
  const rule = bestRule(rules);
  if (rule) {
    const start = () => preflight(rule.icon, (ok,msg)=>{
      if (!ok) { console.warn('[favicon]', msg||'preflight failed'); return; }
      apply(rule.icon);
      watch(rule.icon);
      // 监听 pushState / popstate（单页应用内部跳转）
      const _pushState = history.pushState;
      history.pushState = function(){ const r = _pushState.apply(this, arguments); debouncedApply(rule.icon); return r; };
      window.addEventListener('popstate', ()=>debouncedApply(rule.icon));
    });
    if (document.head) start(); else document.addEventListener('DOMContentLoaded', start);
  }

  // ---------- menus ----------
  function addSetMenu(scope, labelBuilder){
    GM_registerMenuCommand(labelBuilder(), ()=>{
      const val = prompt(`Icon URL for scope "${scope}"\n(HTTPS SVG/PNG/ICO, or data: URL)`);
      if (!val) return;
      const icon = val.trim();
      preflight(icon, (ok,msg)=>{
        if (!ok) { alert('❌ ' + (msg||'Not usable')); return; }
        const list = load();
        let key = '';
        if (scope==='host')   key = getHostname();
        if (scope==='domain') key = getDomainHeuristic(getHostname());
        if (scope==='prefix') key = getPrefix();

        // replace existing same-scope+key rule
        const idx = list.findIndex(r=>r.scope===scope && r.key===key);
        if (idx>=0) list[idx].icon = icon; else list.push({scope,key,icon});
        save(list);
        apply(icon);
        alert(`✅ Set favicon for ${scope}: ${key}`);
      });
    });
  }
  function addRemoveMenu(scope, labelBuilder){
    GM_registerMenuCommand(labelBuilder(), ()=>{
      const list = load();
      let key = '';
      if (scope==='host')   key = getHostname();
      if (scope==='domain') key = getDomainHeuristic(getHostname());
      if (scope==='prefix') key = getPrefix();
      const idx = list.findIndex(r=>r.scope===scope && r.key===key);
      if (idx>=0){ list.splice(idx,1); save(list); location.reload(); }
      else alert(`No rule for ${scope}: ${key}`);
    });
  }

  const host = getHostname();
  const domain = getDomainHeuristic(host);
  const prefix = getPrefix();

  addSetMenu('host',   ()=>`Set favicon for host: ${host}`);
  addSetMenu('domain', ()=>`Set favicon for domain: *.${domain}`);
  addSetMenu('prefix', ()=>`Set favicon for prefix: ${prefix}`);

  addRemoveMenu('host',   ()=>`Remove host rule: ${host}`);
  addRemoveMenu('domain', ()=>`Remove domain rule: *.${domain}`);
  addRemoveMenu('prefix', ()=>`Remove prefix rule: ${prefix}`);

  GM_registerMenuCommand('Export rules (JSON)', ()=>prompt('Copy:', JSON.stringify(load(), null, 2)));
  GM_registerMenuCommand('Import rules (JSON)', ()=>{
    const txt = prompt('Paste JSON:'); if (!txt) return;
    try{ save(JSON.parse(txt)); alert('✅ Imported. Reload to apply.'); }
    catch{ alert('❌ Invalid JSON'); }
  });
})();