// ==UserScript==
// @name         Anna's Archive 搜索结果增强器 v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @license MIT
// @description  年份/版本/格式/大小徽章 + 动态高亮连线：鼠标悬停时仅突出显示同书多版本，其余淡化；增强纯数字版本识别。
// @author       Assistant
// @match        *://*.annas-archive.org/*
// @match        *://annas-archive.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544094/Anna%27s%20Archive%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%A2%9E%E5%BC%BA%E5%99%A8%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/544094/Anna%27s%20Archive%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%A2%9E%E5%BC%BA%E5%99%A8%20v13.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /****************************
   * 1. CONFIGURATION
   ***************************/
  const CONFIG = {
    PREFERRED_FORMATS: ['pdf'],
    NON_PREFERRED_FORMATS: ['epub', 'fb2', 'mobi', 'azw3', 'djvu', 'cbz', 'cbr', 'rar', 'zip'],
    CURRENT_YEAR: new Date().getFullYear(),
    MIN_YEAR: 1900,
    NEW_YEAR_THRESHOLD: 10,

    COLORS: {
      PREFERRED: '#22c55e',
      WARNING: '#ef4444',
      NEUTRAL: '#64748b',
      SIZE: '#14b8a6',
      YEAR_NEW: ['#3b82f6', '#1d4ed8'],
      YEAR_OLD: ['#d1d5db', '#6b7280'],
      VERSION_NEW: ['#8b5cf6', '#7c3aed'],
      VERSION_OLD: ['#e5e7eb', '#9ca3af']
    },

    CLUSTER_COLORS: [
      '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#f87171', '#2dd4bf', '#facc15'
    ],

    TITLE_SIM_THRESHOLD: 0.8,
    TITLE_DIST_THRESHOLD: 5
  };

  /****************************
   * 2. UTILITIES
   ***************************/
  const clean = (t = '') => t.replace(/\s+/g, ' ').trim();
  const normTitle = (t = '') => t.toLowerCase().replace(/[^\w\s]/g, '').trim();

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const v0 = Array.from({ length: n + 1 }, (_, i) => i);
    const v1 = new Array(n + 1);
    for (let i = 0; i < m; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < n; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= n; j++) v0[j] = v1[j];
    }
    return v1[n];
  }

  function jaroWinkler(s1, s2) {
    if (s1 === s2) return 1;
    const len1 = s1.length, len2 = s2.length;
    if (!len1 || !len2) return 0;
    const range = Math.max(len1, len2) / 2 - 1;
    const s2Match = new Array(len2).fill(false);
    let matches = 0, transpositions = 0;

    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - range);
      const end = Math.min(i + range + 1, len2);
      for (let j = start; j < end; j++) {
        if (!s2Match[j] && s1[i] === s2[j]) { s2Match[j] = true; matches++; break; }
      }
    }
    if (!matches) return 0;
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (s1[i] === s2[[...s2Match.keys()].find(j => s2Match[j] && j >= k)]) {
        k = [...s2Match.keys()].find(j => s2Match[j] && j >= k) + 1;
      } else transpositions++;
    }
    transpositions /= 2;
    let sim = (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3;
    let l = 0; while (l < 4 && s1[l] === s2[l]) l++;
    return sim + l * 0.1 * (1 - sim);
  }

  function extractYear(text) {
    const years = (text.match(/\b(19|20)\d{2}\b/g) || []).map(Number).filter(y => y >= CONFIG.MIN_YEAR && y <= CONFIG.CURRENT_YEAR);
    return years.length ? Math.max(...years) : null;
  }

  function extractVersion(text) {
    const ordMap = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10 };
    let m;
    if (m = text.match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s*(edition|ed\.?)/i)) return ordMap[m[1].toLowerCase()];
    if (m = text.match(/\b(\d{1,3})(?:st|nd|rd|th)?\s*(edition|ed\.?|版)/i)) return m[1];
    if (m = text.match(/v(?:er\.?|ersion)?\s*(\d+(?:\.\d+)*)/i)) return m[1];
    if (m = text.match(/第\s*(\d+)\s*版/)) return m[1];
    // fallback: lone digit 1‑20 near year comma or in parentheses
    if (m = text.match(/[\(,\-]\s*(\d{1,2})\s*(?:[\),]|,\s*\d{4})/)) {
      const n = parseInt(m[1]); if (n >= 1 && n <= 20) return n;
    }
    return null;
  }

  function extractFormats(text) {
    const set = new Set();
    text.replace(/\b(pdf|epub|fb2|mobi|azw3|djvu|cbz|cbr|rar|zip)\b/gi, (_, f) => { set.add(f.toLowerCase()); return _; });
    return Array.from(set);
  }

  function extractSize(text) {
    const m = text.match(/(\d+(?:\.\d+)?)\s*(kb|mb|gb)/i); return m ? `${m[1]}${m[2].toUpperCase()}` : null;
  }

  const grad = c => Array.isArray(c) ? `linear-gradient(135deg, ${c[0]}, ${c[1]})` : c;

  function badge(label, cls, color, tip='') {
    const s = document.createElement('span');
    s.className = `aa-badge ${cls}`.trim(); s.textContent = label;
    s.style.background = grad(color); if (tip) s.title = tip; return s;
  }

  /****************************
   * 3. STYLE
   ***************************/
  function injectStyles() {
    if (document.getElementById('aa-style')) return;
    const css = `
      .aa-container{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;font-size:12px}
      .aa-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:12px;font-weight:600;color:#fff;line-height:1.2;text-shadow:0 1px 2px rgba(0,0,0,.25)}
      .aa-badge.format.preferred::before{content:'✔ ';font-weight:bold}
      .aa-badge.format.warning::before{content:'⚠ ';font-weight:bold}
      .aa-cluster-line{border-left:4px solid var(--cluster-color,transparent);padding-left:6px;opacity:.25;transition:opacity .2s ease}
      .aa-cluster-line.aa-active{opacity:1;}
    `;
    const style = document.createElement('style'); style.id='aa-style'; style.textContent = css; document.head.appendChild(style);
  }

  /****************************
   * 4. RESULT ENHANCEMENT
   ***************************/
  function enhanceResult(el) {
    if (el.querySelector('.aa-container')) return;
    const text = clean(el.textContent.toLowerCase());
    const year = extractYear(text); const ver = extractVersion(text); const size = extractSize(text); const formats = extractFormats(text);
    const wrap = document.createElement('div'); wrap.className='aa-container';
    if (year) { const isNew = CONFIG.CURRENT_YEAR - year <= CONFIG.NEW_YEAR_THRESHOLD; wrap.appendChild(badge(year,'year',isNew?CONFIG.COLORS.YEAR_NEW:CONFIG.COLORS.YEAR_OLD,`出版年份 ${year}`)); }
    if (ver){ const isLatest = parseFloat(ver)>=2; wrap.appendChild(badge(`v${ver}`,'version',isLatest?CONFIG.COLORS.VERSION_NEW:CONFIG.COLORS.VERSION_OLD,`版本 ${ver}`)); }
    if (size) wrap.appendChild(badge(size,'size',CONFIG.COLORS.SIZE,`文件大小 ${size}`));
    formats.forEach(f=>{ let col=CONFIG.COLORS.NEUTRAL,cls='format',tip=`格式 ${f.toUpperCase()}`; if(CONFIG.PREFERRED_FORMATS.includes(f)){col=CONFIG.COLORS.PREFERRED;cls+=' preferred';tip='推荐格式 '+f.toUpperCase();} else if(CONFIG.NON_PREFERRED_FORMATS.includes(f)){col=CONFIG.COLORS.WARNING;cls+=' warning';tip='不推荐格式 '+f.toUpperCase();} wrap.appendChild(badge(f.toUpperCase(),cls,col,tip)); });
    el.appendChild(wrap);
  }

  /****************************
   * 5. CLUSTERING WITH DYNAMIC HOVER
   ***************************/
  function clusterAndDecorate(items){
    const clusters=[];
    items.forEach(el=>{
      const tNode=el.querySelector('h3,h2,.title,.bookTitle'); if(!tNode) return; const title=normTitle(tNode.textContent);
      let c=null; for(const cl of clusters){ if(jaroWinkler(title,cl.rep)>=CONFIG.TITLE_SIM_THRESHOLD||levenshtein(title,cl.rep)<=CONFIG.TITLE_DIST_THRESHOLD){c=cl;break;} }
      if(!c){ c={rep:title,items:[],color:CONFIG.CLUSTER_COLORS[clusters.length%CONFIG.CLUSTER_COLORS.length]}; clusters.push(c);} c.items.push(el);
    });
    clusters.forEach((c,idx)=>{
      if(c.items.length<2) return; c.items.forEach(el=>{ el.classList.add('aa-cluster-line'); el.style.setProperty('--cluster-color',c.color); el.dataset.aaCluster=idx; });
    });
  }

  function attachHoverLogic(){
    document.addEventListener('mouseover',e=>{
      const target=e.target.closest('[data-aa-cluster]');
      document.querySelectorAll('.aa-cluster-line').forEach(el=>el.classList.remove('aa-active'));
      if(target){ const cluster=target.dataset.aaCluster; document.querySelectorAll(`[data-aa-cluster="${cluster}"]`).forEach(el=>el.classList.add('aa-active')); }
    });
  }

  /****************************
   * 6. FIND & ENHANCE
   ***************************/
  function findResults(){
    const sels=['[class*="result"]','[class*="item"]','[class*="book"]','[class*="entry"]','[class*="card"]','article','.search-result','.result-item','.book-item','[data-testid*="result"]'];
    let res=[]; sels.forEach(sel=>{const els=document.querySelectorAll(sel); if(els.length){ const f=[...els].filter(el=>{const t=el.textContent||''; return t.length>50&&(/[\.](pdf|epub|mobi)|MB|KB|GB|\d{4}/i.test(t));}); if(f.length>res.length) res=f;}}); return res;
  }

  function enhance(){ const items=findResults(); if(!items.length) return; items.forEach(enhanceResult); clusterAndDecorate(items); }

  /****************************
   * 7. INIT
   ***************************/
  function init(){ injectStyles(); enhance(); attachHoverLogic(); const obs=new MutationObserver(m=>{ if(m.some(x=>x.addedNodes.length)) setTimeout(enhance,300);}); obs.observe(document.body,{childList:true,subtree:true}); }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
