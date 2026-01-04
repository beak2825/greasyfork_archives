// ==UserScript==
// @name         QQ/SB/SV Threadmarks Colorizer/Jump to next in series
// @description  Color‑code threadmarks, per-threadmark jumplist of all the chapters with a similar name.
// @namespace    https://greasyfork.org/users/1376767
// @author       C89sd
// @version      1.3
// @match        https://*.spacebattles.com/threads/*
// @match        https://*.questionablequesting.com/threads/*
// @match        https://*.sufficientvelocity.com/threads/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/537931/QQSBSV%20Threadmarks%20ColorizerJump%20to%20next%20in%20series.user.js
// @updateURL https://update.greasyfork.org/scripts/537931/QQSBSV%20Threadmarks%20ColorizerJump%20to%20next%20in%20series.meta.js
// ==/UserScript==

const COLORIZE_ALL = false;

(() => {
  // ───────────────────────── 0. constants ─────────────────────────
  const TM_SELECTORS = [
    '.threadmark_depth0 a',
    '.threadmark_depth1 a',
    '.blockLink.recent-threadmark .threadmark-text'
  ].join(',');

  const UPDATE_SELECTOR = '.threadmark-control--index, .threadmarks-pagenav--wrapper, [data-xf-click="threadmark-fetcher"], [data-xf-click="overlay"], menu-content:has(.recent-threadmark) > a:first-of-type, block-tabHeader--threadmarkCategoryTabs';

  const STOPWORDS = new Set(['a','an','and','the','my','no','end','start','finale','of','at','in','on']);

  // ───────────────────────── 1. helper fns ─────────────────────────

  const words = ['side','chapter','interlude','snippet','part','volume','pt','vol','chap','ch','act','cont'];
  const joined = '(?:' + words.join('|') + ')';
  const bothRegex = new RegExp('^\\s*(?:'+joined+'\\s+(\\d+)|(\\d+)\\s+'+joined+')\\s*','g');
  const token = s => {
    let a = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let b = a.replace(/(\d+)(?:\s*[.:,#%*_\-+&()\[\]]\s*\d+)*/g, '$1');
    b = b.replace(/^(\d+)(?:\s*[.:,#%*_\-+&()\[\]]\s*)*/, '');
    b = b.replace(/(\s\d+)$/g, '');
    let c = b.replace(/^(\w.*?)\([^)]*\)$/, '$1');
    let d = c.replace(/[^a-z0-9]+/g, ' ')
    let e = d.replace(bothRegex, '');
    e = e.replace(/\s+/g, ' ').trim();
    let toks = e.split(' ').filter(w => w && !STOPWORDS.has(w));
    // console.log(`|${s}|${a}|${b}|${c}|${d}|${e}|${toks.slice(0,2)}|`);
    return toks;
  };
  const keyOf   = t => token(t).slice(0,2).join(' ');

  const rmap = new Map();
  function rand(key) {
    if (rmap.has(key)) return rmap.get(key);
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h >>>= 0;
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    h >>>= 0;
    const r = h / 0x100000000;
    rmap.set(key, r);
    return r;
  }
  const Lmin = 0.40, Lmax = 0.85;
  const Cmin = 0.08, Cmax = 0.225;
  function color(s) {
    s = s+s
    const hue = rand(s)*360 % 360;
    const l01  = rand(s+'lum');
    const L    = Lmin + l01 * (Lmax - Lmin);
    const c01 = rand(s+'chr');
    const C    = Cmin + c01 * (Cmax - Cmin);
    return `oklch(${(L*100).toFixed(3)}% ${C.toFixed(3)} ${hue.toFixed(3)})`;
  }

  // ───────────────────────── 2. cache helpers ─────────────────────
  const VERSION = 1;
  const CACHE_KEY='_TMCache';
  const loadCache = () => {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    return c.version === VERSION ? c : { version: VERSION }; // reset on version change
  };
  const saveCache = (obj) => localStorage.setItem(CACHE_KEY, JSON.stringify(obj));

  // ───────────────────────── 3. highlight boxes ───────────────────
  function applyHighlights(){
    document.querySelectorAll(TM_SELECTORS).forEach(a=>{
      const k=keyOf(a.textContent);
      Object.assign(a.style,{backgroundColor:color(k),color:'#000',borderRadius:'3px'});
    });
  }

  // ───────────────────────── 4. link icons ────────────────────────
  function injectLinkIcons(){
    const MSG_HEADER_BTNS = '.message-cell--threadmark-header *:has(>.threadmark-control--index, >.threadmark-control--viewContent)'; // next to Threadmarks or View Content buttons.
    document.querySelectorAll(MSG_HEADER_BTNS).forEach(nav=>{
      const art=nav.closest('article');
      const pid=art?.id?.replace(/^js-?post-/,'');
      if(!pid) throw new Error('Threadmark‑HL: missing postId');

      const link=document.createElement('span');
      link.className='threadmark-control';
      link.textContent='🔗';
      link.title='Show earlier parts in this series';
      link.style.cursor='pointer';
      link.addEventListener('click',e=>popupForPost(e,pid,link));
      nav.prepend(link);
    });
  }

  // ───────────────────────── 5. threadmark crawler ────────────────
  const ficId = () => location.pathname.match(/\/threads\/[^\/]+\.(\d+)/)?.[1]||null;
  const base  = () => location.pathname.replace(/(\/threads\/[^\/]+\.\d+)(?:\/.*)?$/,'$1')+'/threadmarks?per_page=200';

  function getThreadmarkCount() {
    const link = document.querySelector('.menu-content:has(.recent-threadmark) .blockLink'); // “View all ### threadmarks”
    const m = /(\d+)/i.exec(link.textContent);
    return m ? m[1] : null;
  }


  let cache;
  async function fetchThreadmarksOrCached(anchor){
    const id=ficId(); if(!id) throw new Error('No fic ID');

    cache = loadCache();
    let count = getThreadmarkCount();
    if (!count) throw new Error('!getThreadmarkCount()');
    let entry = cache[id]
    let entry_count = entry?.count ?? 0;

    if(count === entry_count) return entry?.arr ?? [];

    // console.debug('[TM‑HL] fetching threadmark list');
    let url=base();
    const all=[]; // <=== store count as first elem, filtered over later
    let page=1;
    anchor.textContent='⏳0';


    while(url){
      const html=await (await fetch(url)).text();
      const doc=new DOMParser().parseFromString(html,'text/html');

      const chunk=[...doc.querySelectorAll('.threadmark_depth0 a, .threadmark_depth1 a')].map(a=>{
        const title=a?.textContent.trim()||'';
        const pv = a.getAttribute('data-preview-url')||'';
        const m  = pv.match(/posts\/(\d+)/);
        return {title,postId:m?m[1]:''};
      }).filter(it=>it.title && it.postId);

      all.push(...chunk);
      anchor.textContent='⏳'+all.length;
      // console.debug(`[TM‑HL] page ${page++}:`,chunk.length,'marks');

      url=doc.querySelector('.pageNav-jump--next')?.href||'';
    }

    cache[id]={ count: count, arr: all };
    saveCache(cache);
    anchor.textContent='🔗';
    return all;
  }

  // ───────────────────────── 6. popup logic ───────────────────────

  let firstCss = true;
  let disabled = false;
  async function popupForPost(e,pid,anchor){
    if (disabled) return;
    disabled = true;

    e.preventDefault();
    const popupId='tm-popup-'+pid;
    const existing=document.getElementById(popupId);
    if(existing){existing.remove();return;}

    let list=await fetchThreadmarksOrCached(anchor);


    let cur = list.find(it=>it.postId===pid);
    // console.log(list, cur)
    if(!cur){
      if (cache) {
        delete cache[ficId()];
        saveCache(cache);
      }
      list=await fetchThreadmarksOrCached(anchor);
      cur=list.find(it=>it.postId===pid);
      if(!cur) {
        anchor.textContent='Error fetching threadmarks.';
        return;
      }
    }

    if (firstCss) {
      firstCss = false;
      const style=document.createElement('style');
      style.textContent=`
        .tm-popup{position:absolute;z-index:9999;background:#111;color:#eee;border-radius:4px;font-size:90%;padding:6px 8px;max-height:60vh;overflow:auto;box-shadow:0 2px 6px rgba(0,0,0,.45);}
        .tm-popup a{display:block;color:#74b9ff;text-decoration:none;margin:2px 0;}
        .tm-popup a:hover{text-decoration:underline;}
      `;
      document.head.append(style);
    }

    const k=keyOf(cur.title);
    const prev=list.filter(it=>keyOf(it.title)===k) // && Number(it.postId)>=Number(pid))
                   .sort((a,b)=>a.postId-b.postId);

    let href = anchor.closest('.message-cell--threadmark-header').querySelector('.threadmark-control--index, .threadmark-control--viewContent').href; // sibling Threadmarks button
    let hrefBase = href.slice(0, href.lastIndexOf('/')); // slice /threadmarks

    const pop = document.createElement('div');
    pop.id = popupId;
    pop.className = 'tm-popup';
    pop.style.border = `2px solid ${color(k)}`;
    {
      let html = '';
      let arrowDone = false;

      for (const p of prev) {
        let arrow = '';
        let extra = '';
        if (p.postId == pid) {
         // arrow = '→ ';
          extra = 'font-weight:bold;"';
        }
        if (!arrowDone && p.postId > pid) {
          // arrow = '(next) ';
        }
        if (arrow) arrowDone = true;
        const gray  = p.postId <= pid ? ` style="color:gray;${extra}"` : '';

        html += `<a href="${hrefBase}/post-${p.postId}"${gray}>${arrow}${p.title}</a>`;
      }
      pop.innerHTML = html || '<em>No matching series found.</em>';
    }
    document.body.append(pop);

    const r=anchor.getBoundingClientRect();
    pop.style.left=r.left+window.scrollX+'px';
    pop.style.top =r.bottom+window.scrollY+'px';

    const close=ev=>{if(!pop.contains(ev.target)){pop.remove();document.removeEventListener('click',close);disabled = false;}};
    setTimeout(()=>document.addEventListener('click',close),0);

    disabled = false;
  }

  // ───────────────────────── 7. css + init ────────────────────────

  injectLinkIcons();
  if (COLORIZE_ALL) {
    applyHighlights();

    const deb=fn=>{let t;return()=>{clearTimeout(t);t=setTimeout(fn,100);};};
    const recolour=deb(applyHighlights);

    document.addEventListener('click', e => {
      if (e.target.closest(UPDATE_SELECTOR)) {
        const o = new MutationObserver((m, obs) =>
          m.some(r => [...r.addedNodes].some(n => n.nodeType === 1 && n.querySelector('.threadmark_depth0'))) &&
          (recolour(), obs.disconnect())
        );
        o.observe(document.body, { childList: 1, subtree: 1, attributes: 1 });
      }
    });
  }
})();

