// ==UserScript==
// @name        1337x IMDb Rating Display
// @namespace   https://greasyfork.org/en/users/567951-stuart-saddler
// @version     1.1
// @description Show IMDb ratings next to Movie/TV torrents on 1337x. Robust ID detection with OMDb/IMDb fallbacks.
// @license     MIT
// @match       https://1337x.to/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     1337x.to
// @connect     imdb.com
// @connect     www.imdb.com
// @connect     m.imdb.com
// @connect     v2.sg.media-imdb.com
// @downloadURL https://update.greasyfork.org/scripts/546134/1337x%20IMDb%20Rating%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/546134/1337x%20IMDb%20Rating%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY = '';               // Optional OMDb key (fallbacks will still work without)
  const MAX_REQ_PER_5S = 10;
  let DEBUG = false;

  const TV_TAG = /\bS\d{1,2}E\d{1,2}(?:[-E]\d{1,2})?\b/i;
  const TV_SEASON_PACK = /\bS\d{1,2}\b(?!E\d)/i;
  const TV_DATE = /\b(19|20)\d{2}[ ._-](0[1-9]|1[0-2])[ ._-](0[1-9]|[12]\d|3[01])\b/;
  const VIDEO_MARK = /\b(?:2160|1080|720|480)p\b|\.mkv\b|\.mp4\b/i;
  const RELEASE_MARK = /\b(?:WEB(?:-?DL|-?Rip)?|Blu(?:-?Ray)?|HDTV|DVDRip|BRRip|BDRip|REMUX|WEB[-.\s]?HD|WEBDL|WEBRip|iT|AMZN|NF|MAX|ATV|MA|IMAX|HDR10\+?|DV)\b|\b(?:x264|x265|H\.?26[45]|HEVC|AV1)\b|\b(?:DDP? ?(?:5\.1|7\.1)|AC-?3|AAC|Opus|TrueHD|DTS(?:-HD)?(?: ?MA)?|Atmos)\b/i;
  const NEGATIVE = /\b(FLAC|MP3|APE|OGG|WAV|Vinyl|Album|Soundtrack|Deluxe\sEdition|24-96|24bit|16Bit|44\.1kHz|320kbps|EPUB|MOBI|PDF|CBR|CBZ|Magazine|Cookbook|Guide|Manual|Workbook|WSJ|Wall\sStreet\sJournal|Week\+|Comics?|APK|Android|x64|x86|Portable|Pre-Activated|Keygen|Crack(?:ed)?|Patch|Setup|Installer|Plug-?in|VST|Adobe|Topaz|MAGIX|VEGAS|Office|Windows|Premiere|After\sEffects|FitGirl|DLCs?|MULTi\d{1,2}|GOG|Steam|Codex|ElAmigos|Razor1911|Reloaded|Campaign|Zombies|Multiplayer)\b/i;

  function isMovieOrTV(title) {
    if (NEGATIVE.test(title)) return false;
    if (TV_TAG.test(title) || TV_SEASON_PACK.test(title) || TV_DATE.test(title)) return true;
    return VIDEO_MARK.test(title) && RELEASE_MARK.test(title);
  }

  function slugifyTitle(s){
    return (s||'').toLowerCase()
      .replace(/[\.\-_]+/g,' ')
      .replace(/[^a-z0-9 ]/g,'')
      .replace(/\s{2,}/g,' ')
      .trim();
  }

  const LANG_NOISE = /\b(ita|eng|en|es|spa|lat|por|pt|de|ger|deu|fr|fre|french|rus|jpn|kor|korean|hin|hindi|tam|tamil|tel|telugu|kan|kanada|multi|dual|dubbed|sub(?:s|bed)?|esub(?:s)?|nl|pl|tr|ar|he)\b/ig;

  function baseTitleForSuggest(original){
    let s = String(original).replace(/[\[\(\{][^\]\)\}]*[\]\)\}]/g,' ');
    const positions = [];
    const idxTag = s.search(TV_TAG);           if (idxTag >= 0) positions.push(idxTag);
    const idxSeason = s.search(TV_SEASON_PACK);if (idxSeason >= 0) positions.push(idxSeason);
    const idxDate = s.search(TV_DATE);         if (idxDate >= 0) positions.push(idxDate);
    const idxVideo = s.search(VIDEO_MARK);     if (idxVideo >= 0) positions.push(idxVideo);
    const idxRel = s.search(RELEASE_MARK);     if (idxRel >= 0) positions.push(idxRel);
    if (positions.length){ const cut = Math.min(...positions); if (cut > 0) s = s.slice(0, cut); }
    s = s.replace(LANG_NOISE, ' ').replace(/[.\-_]+/g,' ').replace(/\s{2,}/g,' ').trim();
    const noisy = /\b(?:1080p|720p|2160p|480p|web|webrip|webdl|blu(?:ray)?|hdtv|remux|x26[45]|h\.?26[45]|hevc|av1|ddp?|aac|ac3|opus|truehd|dts|atmos|hdr|imax|dv)\b/i;
    const toks = s.split(' '); const clean = [];
    for (const t of toks){ if (noisy.test(t)) break; clean.push(t); }
    s = slugifyTitle(clean.length ? clean.join(' ') : s);
    if (!s){ const m = String(original).match(/^[A-Za-z][A-Za-z ._-]{2,}/); s = slugifyTitle(m ? m[0] : original); }
    return s;
  }

  const logStore = [];
  const clog = (...a) => { if (DEBUG) console.log('%cIMDbDBG', 'color:#6a5acd;font-weight:bold', ...a); };

  GM_addStyle(`#imdbdbg{position:fixed;bottom:10px;right:10px;width:420px;max-height:55%;overflow:auto;background:#111;color:#eee;font:12px/1.35 system-ui,Arial,sans-serif;z-index:999999;border:1px solid #333;display:none;padding:8px;border-radius:6px}`);
  const panel = document.createElement('div'); panel.id='imdbdbg'; document.body.appendChild(panel);
  function escapeHtml(s){ s=(s==null)?'':String(s); return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function snippet(v){ if(v==null) return ''; if(typeof v==='string') return v.length>220? v.slice(0,220)+'…':v; try{return JSON.stringify(v)}catch{return String(v)}}
  function renderPanel(){
    panel.style.display = DEBUG ? 'block' : 'none';
    if(!DEBUG) return;
    panel.innerHTML = logStore.slice(-40).map(r =>
      `<div style="margin-bottom:8px">
        <div><b>${escapeHtml(r.title)}</b> [${r.status}]</div>
        <ul style="margin:4px 0 0 16px">${r.steps.map(s => `<li>${escapeHtml(s.label)}: <code>${escapeHtml(snippet(s.data))}</code></li>`).join('')}</ul>
      </div>`).join('');
  }
  function trace(title){ const r={title,steps:[],status:'pending'}; logStore.push(r); return r; }
  function step(rec,label,data){ rec.steps.push({label,data}); clog(`[${rec.title}] ${label}`, data??''); renderPanel(); }
  function end(rec,status){ rec.status=status; clog(`[${rec.title}] ▶ RESULT: ${status}`); renderPanel(); }

  let typed = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      typed = (typed + e.key.toUpperCase()).slice(-5);
      if (typed.endsWith('TRUE')) { DEBUG = true; renderPanel(); }
      if (typed.endsWith('FALSE')) { DEBUG = false; renderPanel(); }
    }
  });

  const reqTimes=[];
  async function limit(){
    const now=Date.now();
    while(reqTimes.length && now-reqTimes[0]>5000) reqTimes.shift();
    if(reqTimes.length>=MAX_REQ_PER_5S){ const wait=5000-(now-reqTimes[0])+20; await new Promise(r=>setTimeout(r,wait)); }
    reqTimes.push(Date.now());
  }

  function gmFetch(url, headers) {
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        headers: headers || {'Accept':'text/html,application/json;q=0.9','Accept-Language':'en-US,en;q=0.8'},
        timeout:15000,
        onload:r=> (r.status>=200 && r.status<300) ? resolve(r.responseText) : reject(new Error(`HTTP ${r.status} @ ${url}`)),
        onerror:()=>reject(new Error(`GM_xmlhttpRequest failed @ ${url}`)),
        ontimeout:()=>reject(new Error(`GM_xmlhttpRequest timeout @ ${url}`))
      });
    });
  }

  async function omdbById(imdbID, rec){
    step(rec,'OMDb lookup', imdbID);
    if (!API_KEY) throw new Error('OMDb key missing');
    await limit();
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await res.json();
    step(rec,'OMDb result', data);
    return data;
  }

  function fromJsonLd(html){
    const re=/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m; while((m=re.exec(html))!==null){
      try{
        const obj = JSON.parse(m[1].trim());
        const arr = Array.isArray(obj)?obj:[obj];
        for(const o of arr){
          const ag = o && o.aggregateRating;
          const val = ag && (ag.ratingValue || ag.rating);
          if (val && !isNaN(parseFloat(val))) return parseFloat(val);
        }
      }catch{}
    }
    const m2 = /"aggregateRating"\s*:\s*\{[^}]*?"ratingValue"\s*:\s*"?([\d.]+)"?/i.exec(html);
    if (m2){ const v = parseFloat(m2[1]); if(!isNaN(v)) return v; }
    return null;
  }
  function fromReference(html){
    let m = /ratingValue["'>:\s][^0-9]*([\d.]{1,3})/i.exec(html);
    if (m){ const v=parseFloat(m[1]); if(!isNaN(v)) return v; }
    m = /AggregateRatingButton__RatingScore[^>]*>([\d.]{1,3})</i.exec(html);
    if (m){ const v=parseFloat(m[1]); if(!isNaN(v)) return v; }
    return null;
  }
  function fromRatings(html){
    let m = /"ratingValue"\s*:\s*"?([\d.]+)"?/i.exec(html);
    if (m){ const v=parseFloat(m[1]); if(!isNaN(v)) return v; }
    m = /aggregate-rating__score[^>]*>\s*<span[^>]*>([\d.]+)<\/span>/i.exec(html);
    if (m){ const v=parseFloat(m[1]); if(!isNaN(v)) return v; }
    return null;
  }

  async function imdbScrapeRating(imdbID, rec){
    try{
      step(rec,'IMDb m.imdb.com', imdbID);
      const htmlM = await gmFetch(`https://m.imdb.com/title/${imdbID}/`);
      const vM = fromJsonLd(htmlM) || fromReference(htmlM) || fromRatings(htmlM);
      step(rec,'IMDb m value', vM);
      if (vM && !isNaN(vM)) return vM;
    }catch(e){ step(rec,'IMDb m error', e.message); }

    try{
      step(rec,'IMDb /reference', imdbID);
      const htmlR = await gmFetch(`https://www.imdb.com/title/${imdbID}/reference`);
      const vR = fromJsonLd(htmlR) || fromReference(htmlR) || fromRatings(htmlR);
      step(rec,'IMDb ref value', vR);
      if (vR && !isNaN(vR)) return vR;
    }catch(e){ step(rec,'IMDb ref error', e.message); }

    try{
      step(rec,'IMDb /ratings', imdbID);
      const htmlRa = await gmFetch(`https://www.imdb.com/title/${imdbID}/ratings`);
      const vRa = fromJsonLd(htmlRa) || fromRatings(htmlRa) || fromReference(htmlRa);
      step(rec,'IMDb ratings value', vRa);
      if (vRa && !isNaN(vRa)) return vRa;
    }catch(e){ step(rec,'IMDb ratings error', e.message); }

    try{
      step(rec,'IMDb main', imdbID);
      const html = await gmFetch(`https://www.imdb.com/title/${imdbID}/`);
      const v = fromJsonLd(html) || fromReference(html) || fromRatings(html);
      step(rec,'IMDb main value', v);
      if (v && !isNaN(v)) return v;
    }catch(e){ step(rec,'IMDb main error', e.message); }

    return null;
  }

  async function imdbSuggest(rawTitle, year, rec){
    const base = baseTitleForSuggest(rawTitle);
    step(rec,'Suggest base', {base, year});
    if (!base) return null;
    const first = base[0] || 'a';
    const url = `https://v2.sg.media-imdb.com/suggestion/${encodeURIComponent(first)}/${encodeURIComponent(base)}.json`;
    step(rec,'Suggest fetch', {url});
    const text = await gmFetch(url, {'Accept':'application/json'});
    let data; try{ data = JSON.parse(text); }catch{ step(rec,'Suggest parse error', text.slice(0,180)); return null; }
    step(rec,'Suggest results', {len:data?.d?.length||0});
    if (!data || !Array.isArray(data.d) || !data.d.length) return null;

    const wantYear = parseInt(year,10);
    const clean = base;

    let best=null, score=-1;
    for(const it of data.d){
      if(!it || !it.id || !/^tt\d+/.test(it.id)) continue;
      const t = slugifyTitle(it.l||'');
      const y = parseInt(it.y,10);
      let sc = 0;
      if (t === clean) sc += 5;
      else if (t.includes(clean) || clean.includes(t)) sc += 3;
      if (!isNaN(wantYear) && !isNaN(y)){
        const dy = Math.abs(wantYear - y);
        if (dy===0) sc+=3; else if (dy===1) sc+=2; else if (dy<=2) sc+=1;
      }
      if (TV_TAG.test(rawTitle) || TV_SEASON_PACK.test(rawTitle) || TV_DATE.test(rawTitle)) {
        if (it.q === 'tvSeries' || it.q === 'tvMiniSeries') sc += 2;
      } else {
        if (it.q === 'feature') sc += 2;
      }
      if (sc > score){ score = sc; best = it; }
    }
    step(rec,'Suggest pick', best ? {id:best.id, l:best.l, y:best.y, q:best.q, sc:score} : null);
    return best ? best.id : null;
  }

  function extractYearFromTitle(title){
    const ym = title.match(/\b(19|20)\d{2}\b/);
    return ym ? ym[0] : '';
  }

  async function fetchImdbIdFromTorrentPage(href, rawTitle, rec){
    step(rec,'Torrent fetch', href);
    const url = new URL(href, location.origin).href;
    const html = await gmFetch(url);
    const m = html.match(/imdb\.com\/title\/(tt\d{7,9})/i);
    const pageId = m ? m[1] : null;
    step(rec,'Torrent parse', pageId || '(no imdb link)');
    if (pageId) return pageId;
    const year = extractYearFromTitle(rawTitle);
    return await imdbSuggest(rawTitle, year, rec);
  }

  async function getRating(title, href){
    const rec = trace(title);
    if (!isMovieOrTV(title)) { step(rec,'Skipped (not Movie/TV)', title); end(rec,'fail'); return null; }

    let imdbID = null;
    try{ imdbID = await fetchImdbIdFromTorrentPage(href, title, rec); }
    catch(e){ step(rec,'Torrent error', e.message); }
    if (!imdbID){ end(rec,'fail'); return null; }

    try{
      const omdb = await omdbById(imdbID, rec);
      const n = parseFloat(omdb?.imdbRating);
      if (!isNaN(n)){ end(rec,'ok'); return `${n.toFixed(1)}/10`; }
      step(rec,'OMDb no numeric rating', omdb?.imdbRating);
    }catch(e){ step(rec,'OMDb error', e.message); }

    try{
      const v = await imdbScrapeRating(imdbID, rec);
      if (v && !isNaN(v)){ end(rec,'ok'); return `${v.toFixed(1)}/10`; }
      step(rec,'IMDb scrape empty', imdbID);
    }catch(e){ step(rec,'IMDb scrape error', e.message); }

    end(rec,'fail'); return null;
  }

  function render(el, rating){
    if (el.querySelector('.imdb-dot')) return;
    const n = parseFloat(rating);
    let c='gray'; if(n>7)c='green'; else if(n>=6)c='goldenrod'; else if(n>0)c='red';
    const span=document.createElement('span');
    span.className='imdb-dot';
    span.style='color:black;font-weight:bold;margin-left:5px;';
    span.innerHTML=`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};margin-right:4px"></span>${rating}`;
    el.appendChild(span);
    el.title = `IMDb: ${rating}`;
  }

  async function process(el){
    const t = el.textContent?.trim() || '';
    const href = el.getAttribute('href');
    const r = await getRating(t, href);
    if (r) render(el, r);
  }

  function scan(root=document){
    root.querySelectorAll('.table-list a[href^="/torrent/"]').forEach(process);
  }

  scan();
  new MutationObserver(m=>{
    m.forEach(mu=>mu.addedNodes.forEach(n=>{
      if (n.nodeType===1) scan(n);
    }));
  }).observe(document.body,{childList:true,subtree:true});
})();