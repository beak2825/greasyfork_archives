// ==UserScript==
// @name         Ultimate F95Zone
// @namespace    https://github.com/balu100/Ultimate-F95Zone
// @version      1.8
// @license      MIT
// @description  Ultimate F95 - Removed const reassignment error, prefix display.
// @author       balu100
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536432/Ultimate%20F95Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/536432/Ultimate%20F95Zone.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Constants and State Variables ---
    let currentPage = 1;
    let isLoading = false;
    let noMorePages = false;
    let currentFilters = '';
    let infiniteScrollInitialized = false;
    let itemsPerRow = 90;
    let siteOptions = { newTab: "true", version: "small", searchHighlight: "true" };
    let sitePrefixData = null; // To store latestUpdates.prefixes
    let prefixCache = {}; // Cache for getPrefixDetails

    const itemContainerSelector = 'div#latest-page_items-wrap_inner';
    const itemSelector = '.resource-tile';
    const originalPaginationSelector = '.sub-nav_paging';
    const AJAX_ENDPOINT_URL = 'https://f95zone.to/sam/latest_alpha/latest_data.php';

    // --- Helper Function Definitions ---
    const htmlEscape = (str) => {
        if (str === null || str === undefined) return '';
        return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '&#39;');
    };

    const highlightUnreadLinks = () => {
        try {
            document.querySelectorAll('a:not(.resource-item_row-hover_outer > a)').forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                const buttonTextEl = link.querySelector('.button-text');
                const buttonText = buttonTextEl ? buttonTextEl.textContent.trim().toLowerCase() : '';
                if (link.href.includes('/unread?new=1') || text === 'jump to new' || buttonText === 'jump to new') {
                    link.classList.add('highlight-unread');
                    if (buttonTextEl) buttonTextEl.classList.add('highlight-unread');
                }
            });
        } catch (e) { console.error("Error in highlightUnreadLinks:", e); }
    };

    const getCurrentPageFromUrl = () => {
        const match = (window.location.hash || '').match(/page=(\d+)/);
        return match && match[1] ? parseInt(match[1], 10) : 1;
    };

    const getCurrentFiltersFromUrl = () => {
        const defaultFilters = { cat: 'games', sort: 'date', tagtype: 'and', date: 0 };
        const parsedHashFilters = {}; const hash = window.location.hash;
        if (hash && hash.length > 1 && hash !== '#/') {
            let rhP = hash.substring(1); if (rhP.startsWith('/')) rhP = rhP.substring(1);
            rhP.split('/').forEach(part => {
                if (part.includes('=')) {
                    let [key, value] = part.split('='); value = decodeURIComponent(value);
                    if (key && value !== undefined && key !== 'page') parsedHashFilters[key] = value;
                }});
        }
        const finalFilterState = { ...defaultFilters, ...parsedHashFilters };
        const params = new URLSearchParams(); const arrayKeys = ['tags', 'notags', 'prefixes', 'noprefixes'];
        for (const key in finalFilterState) {
            if (finalFilterState.hasOwnProperty(key)) {
                const value = finalFilterState[key];
                if (arrayKeys.includes(key)) {
                    if (String(value).length > 0) String(value).split(',').filter(Boolean).forEach(sV => params.append(`${key}[]`, sV));
                } else if (key==='cat'||key==='sort'||(key==='tagtype'&&value!=='and')||(key==='date'&&Number(value)!==0)||(['search','creator'].includes(key)&&String(value).length>0)) {
                    params.set(key, String(value));
                }}}
        return params.toString();
    };

    function getPrefixDetails(prefixId, category) {
        const cacheKey = `${category}-${prefixId}`;
        if (prefixCache[cacheKey]) return prefixCache[cacheKey];
        if (!sitePrefixData || !sitePrefixData[category]) return false;
        for (const group of sitePrefixData[category]) {
            for (const prefix of group.prefixes) {
                if (String(prefix.id) === String(prefixId)) { // Compare as strings after ensuring they are numbers
                    const details = { id: prefix.id, name: prefix.name, class: prefix.class, parentId: group.id };
                    prefixCache[cacheKey] = details; return details;
                }
            }
        }
        return false;
    }

    function createItemElement(itemData_g) {
        const tile = document.createElement('div');
        let tileCls = ['resource-tile', 'userscript-generated-tile'];
        if(itemData_g.ignored)tileCls.push('resource-tile_ignored');
        itemData_g.new ? tileCls.push('resource-tile_new') : tileCls.push('resource-tile_update');
        const cat = (new URLSearchParams(currentFilters)).get('cat') || 'games';
        if(cat) { tileCls.push(`${cat}-item`, `resource-tile_${cat}`); }
        tile.className = tileCls.join(' ');
        tile.dataset.threadId=String(itemData_g.thread_id||'0');
        tile.dataset.tags=(itemData_g.tags||[]).join(',');
        tile.dataset.images=(itemData_g.screens&&itemData_g.screens.length?itemData_g.screens:[itemData_g.cover||'']).join(',');

        let tLink=`https://f95zone.to/threads/${htmlEscape(String(itemData_g.thread_id||'0'))}/`;
        let title=htmlEscape(itemData_g.title||'No Title');
        let titleAttr=htmlEscape(itemData_g.title||'No Title');
        let creator=htmlEscape(itemData_g.creator||'Unknown');
        let version=(itemData_g.version&&itemData_g.version!=="Unknown")?htmlEscape(itemData_g.version):"";
        let cover=htmlEscape(itemData_g.cover||'');
        let date=itemData_g.date||'N/A';
        const dM=String(date).match(/^([0-9]+ )?([A-Za-z ]+)$/i);
        let dH=dM?`<span class="tile-date_${htmlEscape(dM[2]).toLowerCase().replace(/ /g,"")}">${dM[1]?htmlEscape(dM[1].trim()):""}</span>`:htmlEscape(date);
        let views=String(itemData_g.views||0);
        if(itemData_g.views > 1E6)views=(itemData_g.views/1E6).toFixed(1)+"M"; else if(itemData_g.views > 1E3)views=Math.round(itemData_g.views/1E3)+"K";
        let likes=htmlEscape(String(itemData_g.likes||0));
        let rV=Number(itemData_g.rating)||0;
        let rD=rV===0?"-":rV.toFixed(1);
        let rW=20*rV;
        const newTab=(siteOptions.newTab==="true")?' target="_blank"':'';
        const smallVer=(siteOptions.version==="small");

        let prefixesLeftHTML = ""; let prefixesRightHTML = "";
        if (itemData_g.prefixes && sitePrefixData) {
            itemData_g.prefixes.forEach(prefixId => {
                const prefixInfo = getPrefixDetails(prefixId, cat);
                if (prefixInfo) {
                    const prefixDiv = `<div class="${htmlEscape(prefixInfo.class)}">${htmlEscape(prefixInfo.name)}</div>`;
                    if (String(prefixInfo.parentId) === "4") prefixesRightHTML += prefixDiv; // Status prefixes
                    else prefixesLeftHTML += prefixDiv;
                }
            });
        }

        tile.innerHTML = `
            <a href="${tLink}" class="resource-tile_link" rel="noopener"${newTab}>
                <div class="resource-tile_thumb-wrap"><div class="resource-tile_thumb" style="background-image:url(${cover?"'"+cover+"'":'none'})">${itemData_g.watched?'<i class="far fa-eye watch-icon"></i>':''}</div></div>
                <div class="resource-tile_body">
                    <div class="resource-tile_label-wrap">
                        <div class="resource-tile_label-wrap_left">${prefixesLeftHTML}</div>
                        <div class="resource-tile_label-wrap_right">${prefixesRightHTML}<div class="resource-tile_label-version">${(cat!=="assets"&&version&&smallVer)?version:""}</div></div>
                    </div>
                    <div class="resource-tile_info">
                        <header class="resource-tile_info-header"><div class="header_title-wrap"><h2 class="resource-tile_info-header_title">${title}</h2></div><div class="header_title-ver">${(cat!=="assets"&&version&&!smallVer)?version:""}</div><div class="resource-tile_dev fas fa-user">${(cat!=="assets")?` ${creator}`:""}</div></header>
                        <div class="resource-tile_info-meta"><div class="resource-tile_info-meta_time">${dH}</div><div class="resource-tile_info-meta_likes">${likes}</div><div class="resource-tile_info-meta_views">${views}</div>${(cat!=="assets"&&cat!=="comics")?`<div class="resource-tile_info-meta_rating">${rD}</div>`:""}<div class="resource-tile_rating"><span style="width:${rW}%"></span></div></div>
                    </div>
                </div>
            </a>`;
        return tile;
    }

    async function loadMoreItems() {
        if(isLoading||noMorePages)return;isLoading=true;
        const bP=Number(currentPage);
        if(isNaN(bP)){console.error("loadMoreItems: currentPage is NaN!",currentPage);isLoading=false;noMorePages=true;const elT=document.getElementById('infinite-scroll-trigger');if(elT)elT.classList.add('no-more');return;}
        const nP=bP+1;
        const lT=document.getElementById('infinite-scroll-trigger');if(lT)lT.classList.add('loading');
        console.log(`loadMoreItems: Attempting page ${nP}. Filters: '${currentFilters}'`);

        try{
            const p=new URLSearchParams(currentFilters);
            p.set('cmd','list');p.set('page',nP.toString());p.set('rows',itemsPerRow.toString());p.set('_',Date.now().toString());
            const url=`${AJAX_ENDPOINT_URL}?${p.toString()}`;
            // console.log(`loadMoreItems: Fetching URL: ${url}`);

            const r=await fetch(url,{method:'GET',headers:{'X-Requested-With':'XMLHttpRequest','Accept':'application/json, text/javascript, */*; q=0.01'}});
            if(!r.ok){console.error("loadMoreItems: Fetch fail",r.status,url);noMorePages=true;return;}
            const d=await r.json();
            if(d&&d.status==='ok'&&d.msg&&d.msg.data){
                const i=d.msg.data,c=document.querySelector(itemContainerSelector);
                if(i.length&&c){
                    const f=document.createDocumentFragment(),aE=[];
                    i.forEach(iD=>{const el=createItemElement(iD);if(el){f.appendChild(el);aE.push(el);}});
                    c.appendChild(f);
                    if(typeof XF!=='undefined'&&XF.activate)aE.forEach(el=>XF.activate(el));
                    currentPage=nP;
                    highlightUnreadLinks();
                    if(d.msg.pagination&&d.msg.pagination.page>=d.msg.pagination.total)noMorePages=true;
                }else{noMorePages=true;}
            }else{noMorePages=true;console.error("loadMoreItems: AJAX response error",d);}
        }catch(e){console.error('loadMoreItems: Error during AJAX/processing:',e);noMorePages=true;}
        finally{isLoading=false;if(lT&&!noMorePages)lT.classList.remove('loading');else if(lT)lT.classList.add('no-more');}
    }

    function handleSiteStateChange(eventSource = "unknown") {
        console.log(`handleSiteStateChange by: ${eventSource}. Hash: ${window.location.hash}`);
        const newPg = getCurrentPageFromUrl(); const newFi = getCurrentFiltersFromUrl();
        console.log(`StateChange Check: OldF('${currentFilters}') vs NewF('${newFi}')`);
        console.log(`StateChange Check: OldP(${currentPage}) vs NewHashP(${newPg})`);
        if (currentFilters !== newFi) {
            console.log(`State change ACTION. Resetting.`);
            currentPage = 1; currentFilters = newFi; noMorePages = false; isLoading = false;
            const lT = document.getElementById('infinite-scroll-trigger'); if (lT) lT.className = '';
            console.log(`State reset: curP=${currentPage}, curF='${currentFilters}'`);
        }
    }

    function actualInitInfiniteScroll() {
        if(infiniteScrollInitialized)return;const mA=document.querySelector(itemContainerSelector);
        if(!mA||!mA.querySelector(itemSelector)){console.warn('actualInit:No initial items.');return;}
        currentPage=getCurrentPageFromUrl();currentFilters=getCurrentFiltersFromUrl();
        if(isNaN(Number(currentPage))){currentPage=1;}
        infiniteScrollInitialized=true;console.log(`actualInit: p${currentPage}, f'${currentFilters}'`);
        if(typeof latestUpdates!=='undefined'&&latestUpdates.options){
            siteOptions=latestUpdates.options;itemsPerRow=parseInt(siteOptions.rows,10)||90;
            if (window.latestUpdates && window.latestUpdates.prefixes) { // Also grab prefix data here
                sitePrefixData = window.latestUpdates.prefixes;
                console.log("Site prefix data captured in actualInit.");
            }
        }
        const trg=document.createElement('div');trg.id='infinite-scroll-trigger';mA.insertAdjacentElement('afterend',trg);
        new IntersectionObserver(e=>{if(e[0].isIntersecting&&!isLoading&&!noMorePages)loadMoreItems();},{threshold:0.01}).observe(trg);
        window.addEventListener('hashchange', handleSiteStateChange, false);
        new MutationObserver(ml=>{for(const m of ml){if(m.type==='childList'&&m.removedNodes.length>0){handleSiteStateChange("MutationObserver (content cleared)");break;}}}).observe(mA,{childList:true});
    }

    const style = document.createElement('style');
    function adjustPageWidth() {
        const pbi=document.querySelector('.p-body-inner');const pni=document.querySelector('.p-nav-inner');
        const pc=document.querySelector('.pageContent');const nw=window.innerWidth*0.95;
        if(pbi)pbi.style.maxWidth=`${nw}px`;if(pni)pni.style.maxWidth=`${nw}px`;
        if(pc&&(pc.closest('.p-header-banner')||!pc.closest('footer')))pc.style.maxWidth=`${nw}px`;
    };
    style.innerHTML = `
        .pageContent {max-width: ${(window.innerWidth*0.95)}px !important;max-height:360px!important;transition:none!important;top:110px!important;margin-left:auto!important;margin-right:auto!important;}
        .p-body-inner,.p-nav-inner {max-width:${(window.innerWidth*0.95)}px !important;margin-left:auto!important;margin-right:auto!important;transition:none!important;box-sizing:border-box!important;}
        .cover-hasImage {height:360px!important;transition:none!important;}
        .p-sectionLinks,.uix_extendedFooter,.p-footer-inner,.view-thread.block--similarContents.block-container,.js-notices.notices--block.notices,${originalPaginationSelector}{display:none!important;}
        .highlight-unread {color:cyan;font-weight:bold;text-shadow:1px 1px 2px black;}
        .uix_contentWrapper {max-width:100%!important;padding-left:5px!important;padding-right:5px!important;box-sizing:border-box!important;}
        .p-body-main--withSideNav {display:flex!important;flex-direction:row!important;max-width:100%!important;padding:0!important;box-sizing:border-box!important;}
        main#latest-page_main-wrap {flex-grow:1!important;margin-left:0!important;margin-right:10px!important;min-width:0;box-sizing:border-box!important;}
        aside#latest-page_filter-wrap {flex-shrink:0!important;width:280px!important;margin-left:0!important;margin-right:0!important;box-sizing:border-box!important;}
        aside#latest-page_filter-wrap.filter-hidden,aside#latest-page_filter-wrap[style*="display:none"]{display:none!important;}
        main#latest-page_main-wrap:has(+ aside#latest-page_filter-wrap.filter-hidden),main#latest-page_main-wrap:has(+ aside#latest-page_filter_wrap[style*="display:none"]){margin-right:0!important;}
        div#latest-page_items-wrap {width:100%!important;margin-left:0!important;box-sizing:border-box!important;}
        ${itemContainerSelector}.resource-wrap-game.grid-normal {display:grid!important;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))!important;gap:15px!important;padding:0!important;box-sizing:border-box!important;}
        #infinite-scroll-trigger {padding:20px;text-align:center;font-size:1.2em;color:#777;border:1px solid transparent!important;min-height:40px!important;margin-top:10px!important;}
        #infinite-scroll-trigger.loading::after {content:"Loading more items...";} #infinite-scroll-trigger.no-more::after {content:"No more items to load.";}
        .userscript-generated-tile .resource-tile_thumb{background-size:cover;background-position:center;background-repeat:no-repeat;} .userscript-generated-tile .resource-tile_dev.fas.fa-user::before{margin-right:0.3em;}
    `;
    document.documentElement.appendChild(style);

    function onDomReady() {
        highlightUnreadLinks();
        adjustPageWidth();
        window.addEventListener('resize', adjustPageWidth);

        // Capture sitePrefixData as early as possible if latestUpdates exists
        if (typeof window.latestUpdates !== 'undefined' && window.latestUpdates.prefixes) {
            sitePrefixData = window.latestUpdates.prefixes;
            // console.log("Site prefix data captured on DOM ready.");
        }


        setTimeout(() => {
            const mainContentArea = document.querySelector(itemContainerSelector);
            if (mainContentArea && mainContentArea.querySelector(itemSelector)) {
                actualInitInfiniteScroll();
            } else { console.error("Initial items NOT found after 3s for init."); }
        }, 3000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onDomReady);
    else onDomReady();

})();
