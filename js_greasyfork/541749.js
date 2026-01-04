// ==UserScript==
// @name         MAL Turbo Jump
// @namespace    mal_jumper
// @version      2.1
// @description  One‑click (and now fully automated) jump from RU anime sites → Shikimori → MyAnimeList. Fast, ad‑skipping, with UI‑lock overlay.
// @author       Kotaytqee
// @match        https://animego.me/*
// @match        https://jut.su/*
// @match        https://duckduckgo.com/*
// @match        https://shikimori.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        GM_openInTab
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541749/MAL%20Turbo%C2%A0Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/541749/MAL%20Turbo%C2%A0Jump.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /*=============================================================
     | CONSTANTS & SHORTCUTS
     *===========================================================*/
    const MAL_BLUE     = '#2E51A2';
    const SHIKI_FILTER = 'site:shikimori.one/animes';          // hop‑1
    const MAL_FILTER   = 'site:myanimelist.net';               // hop‑2

    const log = (...m) => console.debug('[MAL]', ...m);

    /*=============================================================
     | STYLE & OVERLAY
     *===========================================================*/
    function injectStyles() {
  if (document.getElementById('mal-styles')) return;
  const s = document.createElement('style');
  s.id = 'mal-styles';
  s.textContent = `
    .mal-btn {
      background: ${MAL_BLUE};
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .mal-btn:hover {
      background-color: #294693; /* чуть темнее для эффекта hover */
    }
    #mal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      color: #fff;
      font: 20px/1.4 sans-serif;
      pointer-events: all;
    }
  `;
  document.head.appendChild(s);
}

    /** Show blocking overlay with msg; returns remover fn */
    function showOverlay (msg='Подождите…') {
        injectStyles();
        const o = document.createElement('div');
        o.id  = 'mal‑overlay';
        o.textContent = `⏳ ${msg}`;
        document.body.appendChild(o);
        return () => o.remove();
    }

    const buildURL = (filter, title) =>
        `https://duckduckgo.com/?q=${encodeURIComponent(`${filter} ${title}`)}`;

    /*=============================================================
     | animego / jut.su  (RU source sites)
     *===========================================================*/
    const SOURCES = {
        'animego.me': {
            anchor: () => document.querySelector('.anime-title > div'),
            title : () => document.querySelector('.anime-title h1')?.textContent?.trim()
        },
        'jut.su': {
            anchor: () => document.querySelector('h1.header_video'),
            title : () => {
                const t = document.querySelector('h1.header_video span[itemprop="name"]')?.textContent || '';
                return t.replace(/Смотреть\s*/i,'').replace(/\s*\d+\s*серия/i,'').trim();
            },
            center:true
        }
    };
    /**
 * Поиск прямой ссылки на MyAnimeList через публичный Shikimori API.
 * @param {string} title — название аниме для поиска
 * @returns {Promise<string|null>} — URL на myanimelist.net или null, если не найдено
 */
async function fetchMalByShikiApi(title) {
  try {
    // 1) Поиск anime-id по названию
    const searchUrl = `https://shikimori.one/api/animes?search=${encodeURIComponent(title)}`;
    const searchResp = await fetch(searchUrl, { headers: { 'User-Agent': 'MAL-Turbo-Jump/2.0' } });
    if (!searchResp.ok) return null;
    const list = await searchResp.json();
    if (!Array.isArray(list) || list.length === 0) return null;
    const animeId = list[0].id;

    // 2) Запрос подробной информации с external_links
    const infoUrl = `https://shikimori.one/api/animes/${animeId}`;
    const infoResp = await fetch(infoUrl, { headers: { 'User-Agent': 'MAL-Turbo-Jump/2.0' } });
    if (!infoResp.ok) return null;
    const info = await infoResp.json();

    // 3) Извлечение ссылки на MAL
    if (!Array.isArray(info.external_links)) return null;
    const malLinkObj = info.external_links.find(link =>
      link.site.toLowerCase().includes('myanimelist')
    );
    return malLinkObj ? malLinkObj.url : null;

  } catch (e) {
    console.error('fetchMalByShikiApi error:', e);
    return null;
  }
}


    function enhanceSourceSite () {
    const key = Object.keys(SOURCES).find(k => location.hostname.endsWith(k));
    if (!key) return;
    const cfg    = SOURCES[key];
    const anchor = cfg.anchor();
    const title  = cfg.title();
    if (!anchor || !title) {
        log('title/anchor missing');
        return;
    }

    injectStyles();
    const btn = document.createElement('button');
    btn.className = 'mal-btn';
    btn.textContent = 'MAL';
    btn.title = title;
    if (cfg.center) {
        btn.style.display = 'block';
        btn.style.margin = '10px auto';
    }

    // Вот тут вешаем новый, «надстройочный» сценарий:
    btn.onclick = async () => {
        const removeOverlay = showOverlay('Поиск через Shikimori API…');
        try {
            const malUrl = await fetchMalByShikiApi(title);
            removeOverlay();

            if (malUrl) {
                // Нашли прямой MAL-URL — открываем его
                GM_openInTab(malUrl, { active: true });
            } else {
                // Не нашли — возвращаемся к старому сценарию через DuckDuckGo
                const remove2 = showOverlay('Перевод на MAL (фоллбэк)…');
                GM_openInTab(buildURL(MAL_FILTER, title), { active: true });
                setTimeout(remove2, 2000);
            }

        } catch (err) {
            removeOverlay();
            console.error('Ошибка поиска по Shikimori API:', err);
            const remove2 = showOverlay('Перевод на MAL (фоллбэк)…');
            GM_openInTab(buildURL(MAL_FILTER, title), { active: true });
            setTimeout(remove2, 2000);
        }
    };

    anchor.appendChild(btn);
    log('Button added on', key);
}

    /*=============================================================
     | Shikimori  →  auto hop to MAL
     *===========================================================*/
    function getJPTitle(){
        const h1=document.querySelector('h1');
        if(!h1) return null;
        const parts=h1.textContent.split('/');
        return parts[1]?.trim()||null;
    }

    function handleShikimori(){
        const jp=getJPTitle();
        if(!jp){log('JP title missing');return;}

        injectStyles();
        const h1=document.querySelector('h1');
        const btn=document.createElement('button');
        btn.className='mal‑btn';
        btn.textContent='MAL';
        btn.title=jp;
        btn.style.marginLeft='10px';
        btn.onclick=()=>GM_openInTab(buildURL(MAL_FILTER,jp),{active:true});
        h1.appendChild(btn);

        // auto‑redirect once per session
        if(!sessionStorage.getItem('mal_autohop')){
            sessionStorage.setItem('mal_autohop','1');
            showOverlay('Перенаправляем на MAL…');
            location.replace(buildURL(MAL_FILTER,jp));
        }
        log('Shikimori processed');
    }

    /*=============================================================
     | DuckDuckGo  (ad‑skip & fast redirect)
     *===========================================================*/
    function ctxFromQuery(){
        const q=new URLSearchParams(location.search).get('q')||'';
        if(q.includes(SHIKI_FILTER)) return {domain:'shikimori.one'};
        if(q.includes(MAL_FILTER))   return {domain:'myanimelist.net'};
        return null;
    }

    function tryRedirect(domain){
        const items=[
          ...document.querySelectorAll('li[data-layout="organic"]'),
          ...document.querySelectorAll('#links .result')
        ];
        for(const it of items){
            if(it.querySelector('.badge--ad')) continue;
            const a=it.querySelector('a[data-testid="result-title-a"],a.result__a');
            if(a&&a.href.includes(domain)){
                log('→',a.href);
                showOverlay('Загружаем…');
                location.href=a.href;
                return true;
            }
        }
        return false;
    }

    async function handleDDG(){
        const ctx=ctxFromQuery();
        if(!ctx) return;
        log('DDG context',ctx.domain);
        if(tryRedirect(ctx.domain)) return; // immediate DOM pass
        const obsSel='ol.react-results--main,#links';
        const ok=await new Promise(r=>{
            const to=setTimeout(()=>r(false),4000); // shorter timeout
            const obs=new MutationObserver(()=>{
                if(tryRedirect(ctx.domain)){clearTimeout(to);obs.disconnect();r(true);} });
            obs.observe(document.documentElement,{childList:true,subtree:true});
        });
        if(!ok) log('No redirect found');
    }

    /*=============================================================
     | ROUTER
     *===========================================================*/
    if(location.hostname.endsWith('duckduckgo.com'))      handleDDG();
    else if(location.hostname.endsWith('shikimori.one'))  handleShikimori();
    else                                                   enhanceSourceSite();
})();
