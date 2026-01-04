// ==UserScript==
// @name         Amazon Enhancer: Monthly + ReviewMeta + Camel + Keepa + UI + Dark + Review Highlights (Enhanced)
// @namespace    Eliminater74
// @version      1.7.0
// @description  Faster, smarter Amazon enhancer. Strictly detects Amazon Monthly Payments (e.g., $xx/month for N months). No Affirm/Klarna/Prime Visa/financing noise. Lazy Camel/Keepa, SPA-aware, saved gear position, immediate monthly refresh + detector debug toggle.
// @author       Eliminater74
// @license      MIT
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.ca/*
// @match        https://smile.amazon.com/*
// @grant        GM_xmlhttpRequest
// @connect      reviewmeta.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538006/Amazon%20Enhancer%3A%20Monthly%20%2B%20ReviewMeta%20%2B%20Camel%20%2B%20Keepa%20%2B%20UI%20%2B%20Dark%20%2B%20Review%20Highlights%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538006/Amazon%20Enhancer%3A%20Monthly%20%2B%20ReviewMeta%20%2B%20Camel%20%2B%20Keepa%20%2B%20UI%20%2B%20Dark%20%2B%20Review%20Highlights%20%28Enhanced%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------------
  // Settings & utils
  // -----------------------------
  const SETTINGS_KEY = 'amazonEnhancerSettings';
  const GEAR_POS_KEY = 'amazonEnhancerGearPos';

  const defaultSettings = {
    showReviewMeta: true,
    showCamel: true,
    showKeepa: true,
    theme: 'auto',
    highlightBestReviews: true,
    hideAds: true,
    showSoldBy: true,
    stickyPriceBox: true,
    autoSortReviews: true,
    expandReviewsQA: true,

    // Monthly-payments
    highlightMonthlyPayments: true,
    filterOnlyMonthly: false,

    // extras
    hideFbtAndRecs: true,
    forceVerifiedPurchase: false,
    keyboardShortcut: true,
    primeOnlyFilter: false,

    // debugging
    debugMonthlyDetector: false
  };

  const $  = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const onIdle=(fn)=>(window.requestIdleCallback||setTimeout)(fn,0);
  const debounce=(fn,ms=200)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};};
  const throttle=(fn,ms=200)=>{let p=0;return(...a)=>{const n=Date.now();if(n-p>=ms){p=n;fn(...a);}};};

  const settings = Object.assign({}, defaultSettings, loadJSON(SETTINGS_KEY) || {});
  saveJSON(SETTINGS_KEY, settings);

  function loadJSON(k){ try{ return JSON.parse(localStorage.getItem(k)||'{}'); }catch{ return {}; } }
  function saveJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

  function getLocale(){
    const h=location.hostname;
    if(h.includes('.co.uk'))return'uk';
    if(h.includes('.de'))return'de';
    if(h.includes('.fr'))return'fr';
    if(h.includes('.es'))return'es';
    if(h.includes('.it'))return'it';
    if(h.includes('.ca'))return'ca';
    return'us';
  }
  const locale=getLocale();

  function detectASIN(){
    const m=location.href.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
    if(m) return m[1];
    const meta=$('input#ASIN')||$('[name="ASIN.0"]')||$('[name="ASIN"]');
    if(meta?.value) return meta.value;
    const body=document.body.getAttribute('data-asin')||document.body.getAttribute('data-asin-candidate');
    if(body && /^[A-Z0-9]{10}$/.test(body)) return body;
    const el=$('[data-asin]'); const g=el?.getAttribute('data-asin');
    return /^[A-Z0-9]{10}$/.test(g||'')?g:null;
  }
  let ASIN=detectASIN();

  // -----------------------------
  // Theme
  // -----------------------------
  applyTheme(settings.theme);
  function applyTheme(mode){
    const html=document.documentElement;
    const want=(mode==='auto')?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
    html.setAttribute('data-enhancer-theme',want);
    $('#amazon-enhancer-theme-style')?.remove();
    const style=document.createElement('style');
    style.id='amazon-enhancer-theme-style';
    style.textContent=`
      [data-enhancer-theme="dark"] .amazon-enhancer-box{background:#1d1d1d!important;color:#f0f0f0!important;border-color:#555!important}
      [data-enhancer-theme="dark"] .amazon-enhancer-box a{color:#7dddf2!important}
      [data-enhancer-theme="dark"] .amazon-enhancer-panel{background:#2c2c2c!important;color:#eee!important;border-color:#555!important}
      .highlighted-review{border:2px solid gold!important;background:#fffbea!important}
      
      /* New: CSS-based filtering */
      body.ae-filter-active .s-result-item:not(.ae-monthly-match) { display: none !important; }

      /* LOUD Highlight for the Product Card */
      .ae-monthly-match {
        border: 3px solid #ff9900 !important; /* Amazon Orange */
        background-color: #fff8e1 !important; /* Light Gold Wash */
        box-shadow: 0 0 12px rgba(255, 153, 0, 0.5) !important;
        transform: scale(1.01);
        z-index: 10;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      /* Dark mode card highlight */
      [data-enhancer-theme="dark"] .ae-monthly-match {
        background-color: #291e0a !important; /* Dark Gold/Brown Wash */
        border-color: #ff9900 !important;
      }

      /* LOUD Badge */
      .monthly-badge{
        position:absolute; top:8px; left:-6px; 
        background: #ff9900 !important; 
        color: #000 !important; /* Black text on Orange = Maximum Contrast */
        padding: 5px 12px; 
        font-weight: 800; font-size:13px; text-transform:uppercase; letter-spacing: 0.5px;
        border: 2px solid #fff;
        border-radius: 0 6px 6px 0; 
        box-shadow: 2px 3px 6px rgba(0,0,0,0.4);
        z-index: 2147483647 !important;
        animation: ae-pulse 2.5s infinite;
      }
      
      @keyframes ae-pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(255, 153, 0, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 153, 0, 0); }
      }
    `;
    document.head.appendChild(style);
  }

  // -----------------------------
  // UI (gear + panel)
  // -----------------------------
  createToggleUI();
  function createToggleUI(){
    const gear=document.createElement('div');
    gear.id='amazon-enhancer-gear';
    gear.textContent='⚙️';
    gear.style.cssText=`position:fixed;width:40px;height:40px;font-size:22px;background:#222;color:#fff;border:2px solid #888;border-radius:50%;
      display:flex;justify-content:center;align-items:center;cursor:move;box-shadow:0 0 12px rgba(0,0,0,.8);z-index:2147483647;`;
    restoreGearPosition(gear);

    const panel=document.createElement('div');
    panel.className='amazon-enhancer-panel';
    panel.style.cssText=`position:fixed;border:1px solid #ccc;padding:10px;border-radius:8px;z-index:2147483646;background:#fff;display:none;
      right:20px;bottom:70px;max-width:330px;font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:13px;line-height:1.3;`;

    const toggles=[
      ['showReviewMeta','ReviewMeta'],
      ['showCamel','CamelCamelCamel (lazy)'],
      ['showKeepa','Keepa (lazy)'],
      ['highlightBestReviews','Highlight Best Reviews'],
      ['hideAds','Hide Sponsored Ads'],
      ['showSoldBy','Highlight “Sold by” box'],
      ['stickyPriceBox','Sticky Price Box'],
      ['autoSortReviews','Auto Sort Reviews (recent)'],
      ['expandReviewsQA','Expand Q&A/Reviews'],
      ['highlightMonthlyPayments','Highlight Monthly Payments'],
      ['filterOnlyMonthly','Filter: Only Amazon Monthly Payments'],
      ['hideFbtAndRecs','Hide FBT & Recommendations'],
      ['forceVerifiedPurchase','Reviews: Verified Purchase only'],
      ['primeOnlyFilter','Search: Prime only'],
      ['keyboardShortcut','Keyboard Toggle (Alt+E)'],
      ['debugMonthlyDetector','Debug: Monthly detector → console']
    ];
    panel.innerHTML = `
      ${toggles.map(([k,l])=>`<label style="display:block;margin:4px 0;"><input type="checkbox" id="${k}" ${settings[k]?'checked':''}> ${l}</label>`).join('')}
      <label style="display:block;margin-top:6px;">Theme:
        <select id="themeSelect">
          <option value="auto" ${settings.theme==='auto'?'selected':''}>Auto</option>
          <option value="light" ${settings.theme==='light'?'selected':''}>Light</option>
          <option value="dark" ${settings.theme==='dark'?'selected':''}>Dark</option>
        </select>
      </label>
      <div style="margin-top:8px;">
        <button id="rescanMonthlyBtn" class="a-button a-button-primary" style="padding:6px 10px;">Rescan Monthly Now</button>
      </div>
    `;

    toggles.forEach(([key])=>{
      const el=panel.querySelector('#'+key);
      el.addEventListener('change', e=>{
        settings[key]=e.target.checked; saveJSON(SETTINGS_KEY, settings);
        if (key==='filterOnlyMonthly') { 
             document.body.classList.toggle('ae-filter-active', settings.filterOnlyMonthly);
             // Force a quick check in case we missed some items (though usually irrelevant if already tagged)
             if(settings.filterOnlyMonthly) rescanMonthly.force(); 
             return; 
        }
        if (key==='highlightMonthlyPayments' || key==='debugMonthlyDetector') { rescanMonthly.force(); return; }
        if (key==='primeOnlyFilter') { primeOnlyFilter(true); if(!settings.primeOnlyFilter) showAllResults(); return; }
        if (key==='hideAds' || key==='hideFbtAndRecs') { hideSponsored(); hideFbtAndRecs(); return; }
        if (key==='showReviewMeta' || key==='showCamel' || key==='showKeepa') { renderDataBoxes(); return; }
      });
    });
    panel.querySelector('#themeSelect').addEventListener('change', e=>{
      settings.theme=e.target.value; saveJSON(SETTINGS_KEY, settings); applyTheme(settings.theme);
    });
    panel.querySelector('#rescanMonthlyBtn').addEventListener('click', ()=> rescanMonthly(true));

    // drag/click
    let isDragging=false, startX=0, startY=0, moved=false;
    gear.addEventListener('mousedown', e=>{
      isDragging=true;moved=false;
      startX=e.clientX-gear.getBoundingClientRect().left;
      startY=e.clientY-gear.getBoundingClientRect().top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e=>{
      if(!isDragging)return;
      gear.style.left=(e.clientX-startX)+'px';
      gear.style.top=(e.clientY-startY)+'px';
      gear.style.right='auto'; gear.style.bottom='auto'; moved=true;
    });
    document.addEventListener('mouseup', ()=>{
      if(!isDragging)return; isDragging=false;
      if(moved) saveJSON(GEAR_POS_KEY, {left:gear.style.left, top:gear.style.top});
    });
    gear.addEventListener('click', ()=>{ if(moved)return; panel.style.display=panel.style.display==='none'?'block':'none'; });
    gear.ondragstart=()=>false;

    if (settings.keyboardShortcut) {
      document.addEventListener('keydown', e=>{
        if (e.altKey && (/^e$/i).test(e.key)) { e.preventDefault(); panel.style.display=panel.style.display==='none'?'block':'none'; }
      });
    }

    document.body.appendChild(gear);
    document.body.appendChild(panel);
  }
  function restoreGearPosition(gear){
    const pos=loadJSON(GEAR_POS_KEY);
    if(pos?.left && pos?.top){ gear.style.left=pos.left; gear.style.top=pos.top; gear.style.right='auto'; gear.style.bottom='auto'; }
    else { gear.style.bottom='20px'; gear.style.right='20px'; }
  }

  // -----------------------------
  // Data boxes (lazy)
  // -----------------------------
  function appendToTarget(el){
    const t = $('#unifiedPrice_feature_div') || $('#corePrice_feature_div') || $('#title')?.closest('.a-section');
    if (t) t.appendChild(el);
  }
  function renderDataBoxes(){
    $$('.amazon-enhancer-box').forEach(n=>n.remove());
    const asin=ASIN||detectASIN(); if(!asin) return;
    if (settings.showReviewMeta) injectReviewMeta(asin);
    if (settings.showCamel) injectCamelLazy(asin);
    if (settings.showKeepa) injectKeepaLazy(asin);
  }
  function injectCamelLazy(asin){
    const div=document.createElement('div');
    div.className='amazon-enhancer-box';
    div.style.cssText='margin-top:10px;padding:10px;border:1px solid #ccc;';
    div.innerHTML=`
      <b>CamelCamelCamel:</b>
      <div style="margin-top:6px;">
        <a href="https://${locale}.camelcamelcamel.com/product/${asin}" target="_blank" rel="noopener">
          <img data-src="https://charts.camelcamelcamel.com/${locale}/${asin}/amazon-new-used.png?force=1&zero=0&w=600&h=340"
               alt="Price history (Camel)" style="max-width:100%;height:auto;opacity:.001;">
        </a>
      </div>`;
    appendToTarget(div); lazyImageLoad($('img[data-src]',div));
  }
  function injectKeepaLazy(asin){
    const div=document.createElement('div');
    div.className='amazon-enhancer-box';
    div.style.cssText='margin-top:10px;padding:10px;border:1px solid #ccc;';
    div.innerHTML=`
      <b>Keepa:</b>
      <div style="margin-top:6px;">
        <a href="https://keepa.com/#!product/1-${asin}" target="_blank" rel="noopener">
          <img data-src="https://graph.keepa.com/pricehistory.png?used=1&amazon=1&new=1&domain=${locale}&asin=${asin}"
               alt="Price history (Keepa)" style="max-width:100%;height:auto;opacity:.001;">
        </a>
      </div>`;
    appendToTarget(div); lazyImageLoad($('img[data-src]',div));
  }
  function lazyImageLoad(img){
    if(!img)return;
    const io=new IntersectionObserver((es,o)=>{ es.forEach(e=>{ if(e.isIntersecting){ img.src=img.dataset.src; img.style.opacity='1'; img.removeAttribute('data-src'); o.unobserve(e.target); } }); },{rootMargin:'200px'});
    io.observe(img);
  }
  function injectReviewMeta(asin){
    const url=`https://reviewmeta.com/amazon${locale==='us'?'':'-'+locale}/${asin}`;
    GM_xmlhttpRequest({ method:'GET', url, onload: res=>{
      const doc=new DOMParser().parseFromString(res.responseText,'text/html');
      const stars=doc.querySelector('#adjusted-rating-large')?.textContent?.trim();
      const percent=Array.from(doc.querySelectorAll('small')).find(e=>/potentially unnatural/i.test(e.textContent||''))?.querySelector('span span')?.textContent?.trim();
      const div=document.createElement('div');
      div.className='amazon-enhancer-box';
      div.style.cssText='margin-top:10px;padding:10px;border:1px solid #ccc;';
      div.innerHTML = stars
        ? `<b>ReviewMeta Adjusted:</b> <span style="color:firebrick">${stars}/5</span><br><b>Fake Reviews:</b> <span style="color:firebrick">${percent||'—'}</span><br><a href="${url}" target="_blank" rel="noopener" style="color:green;">View on ReviewMeta</a>`
        : `<b style="color:red;">ReviewMeta data not found.</b><br><a href="${url}" target="_blank" rel="noopener">Submit product</a>`;
      appendToTarget(div);
    }});
  }

  // -----------------------------
  // PDP tweaks
  // -----------------------------
  function highlightReviews(){
    const reviews=$$('.review');
    reviews.sort((a,b)=>{
      const ha=parseInt((a.innerText.match(/(\d[\d,]*)\s+people?\s+found this helpful/i)||[])[1]?.replace(/,/g,'')||'0',10);
      const hb=parseInt((b.innerText.match(/(\d[\d,]*)\s+people?\s+found this helpful/i)||[])[1]?.replace(/,/g,'')||'0',10);
      return hb-ha;
    }).slice(0,3).forEach(el=>el.classList.add('highlighted-review'));
  }
  function autoSortReviews(){
    const sel=$('select[name="sortBy"]');
    if(sel){ if(sel.value!=='recent') sel.value='recent'; sel.dispatchEvent(new Event('change',{bubbles:true})); }
  }
  function forceVerifiedOnly(){
    if(!settings.forceVerifiedPurchase)return;
    const cb=$$('input[type=checkbox]').find(n=>/verified purchase/i.test(n.closest('label')?.textContent||''));
    if(cb && !cb.checked){ cb.click(); return; }
    const link=$$('a').find(a=>/verified purchase/i.test(a.textContent||'')); if(link) link.click();
  }
  function expandSections(){
    $$('.a-expander-prompt, .a-expander-prompt-content, .a-expander-header').forEach(e=>e.click());
    $$('span.a-expander-prompt, button[aria-label*="See more"]').forEach(b=>b.click());
  }
  function makeStickyPriceBox(){
    const box=$('#corePrice_feature_div')||$('#unifiedPrice_feature_div');
    if(box){ box.style.position='sticky'; box.style.top='0'; box.style.background='#fff'; box.style.zIndex=9999; box.style.borderBottom='2px solid #ccc'; }
  }
  function showSoldByBox(){ const el=$('#merchant-info'); if(el) el.style.border='2px dashed orange'; }

  // -----------------------------
  // Search: strict Amazon Monthly Payments detector (FIXED & DEBUGGABLE)
  // -----------------------------

  // currency sign pattern per locale
  const money = {
    us: '\\$',
    uk: '£',
    de: '€',
    fr: '€',
    es: '€',
    it: '€',
    ca: '\\$'
  }[locale] || '\\$';

  // Normalize whitespace + NBSP/zero-widths so “/ month” variants match
  const normalize = (s) => (s||'').replace(/[\u00A0\u2000-\u200B]/g, ' ')
                                  .replace(/\s+\/\s+/g, '/')
                                  .replace(/\s+/g,' ')
                                  .trim();

  // INCLUDE patterns:
  // 1) "$xx/(mo|month|monthly) for|x|over N months"
  //    (allows "Or $35.34/month for 3 months" and "… $35 monthly for 3 months")
  const RX_MAIN = new RegExp(
    `${money}\\s?\\d[\\d,]*(?:\\.\\d{2})?\\s*(?:\\/|\\s*per\\s+)?(?:mo|month|monthly)\\.?\\s*(?:for|x|over)\\s*\\d+\\s*(?:months|mos)\\b`,
    'i'
  );

  // 2) "3 monthly payments" / "5 interest-free monthly payments"
  const RX_PAYMENTS = /\b\d+\s+(?:interest[- ]?free\s+)?monthly\s+payments?\b/i;

  // 3) explicit Amazon label
  const RX_LABEL = /\bAmazon\s+Monthly\s+Payments?\b/i;

  // EXCLUDE: third-party credit/financing. (No blanket "interest" or "/month" exclusion.)
  const EXCLUDE = /\b(Affirm|Klarna|Afterpay|Zip|Prime\s*Visa|Store\s*Card|credit\s*card|APR|financ(?:e|ing)|lease|subscription)\b/i;

  // Build a single normalized string for the whole result (text + aria-labels)
  function resultText(result){
    const t1 = result.textContent || '';
    const t2 = Array.from(result.querySelectorAll('[aria-label]')).map(n=>n.getAttribute('aria-label')||'').join(' ');
    // Also check image alt text (sometimes payment info is in images?)
    // But textContent usually captures hidden text. 
    return normalize(`${t1} ${t2}`);
  }

  const rescanMonthly = (function(){
    function clearBadge(r){ $('.monthly-badge',r)?.remove(); }
    
    function addBadge(r){
      if($('.monthly-badge',r)) return;
      const b=document.createElement('div');
      b.className='monthly-badge';
      b.textContent='💳 Monthly';
      // ensure we position it relative to something valid
      const style = getComputedStyle(r);
      if(style.position==='static') r.style.position='relative';
      r.appendChild(b);
    }

    function run(){
      // Optimized selector: only items not yet processed OR items we want to re-check forced
      // But for simplicity/speed, we iterate all likely items, but skip expensive regex if "data-ae-processed" is present
      const results=$$('[data-component-type="s-search-result"], .s-result-item');
      if(!results.length) return;

      for(const r of results){
        // Optimization: Skip if already processed, unless we are debugging or forcing re-check
        // (If strictly "filterOnlyMonthly" changes, we handle that via CSS, so we just need to ensure tags are present)
        if(r.hasAttribute('data-ae-processed') && !settings.debugMonthlyDetector) {
            // Check if user turned on highlighting recently
            if(settings.highlightMonthlyPayments && r.classList.contains('ae-monthly-match')) addBadge(r);
            if(!settings.highlightMonthlyPayments) clearBadge(r);
            continue;
        }

        const t = resultText(r);
        const excluded = EXCLUDE.test(t);
        const matched = !excluded && (RX_MAIN.test(t) || RX_PAYMENTS.test(t) || RX_LABEL.test(t));

        if (settings.debugMonthlyDetector) {
          if (matched || excluded) {
            const asin = r.getAttribute('data-asin') || '(no-asin)';
            console.log(`[AmazonEnhancer] result asin=${asin} matched=${matched} excluded=${excluded}`);
          }
        }

        // Mark as processed
        r.setAttribute('data-ae-processed', 'true');

        if (matched){
          r.classList.add('ae-monthly-match');
          if (settings.highlightMonthlyPayments) addBadge(r);
        } else {
          r.classList.remove('ae-monthly-match');
          clearBadge(r);
        }
      }
    }
    const debounced=debounce(run,150);
    const api=(immediate=false)=> immediate?run():debounced();
    api.force=()=>{
         // clear processed cache to force re-regex
         $$('[data-ae-processed]').forEach(el=>el.removeAttribute('data-ae-processed'));
         run();
    };
    return api;
  })();

  function showAllResults(){
    $$('[data-component-type="s-search-result"], .s-result-item').forEach(r=> r.style.removeProperty('display'));
  }

  function primeOnlyFilter(immediate=false){
    const run=()=>{
      if(!settings.primeOnlyFilter){ showAllResults(); return; }
      const results=$$('[data-component-type="s-search-result"], .s-result-item');
      results.forEach(r=>{
        const prime = r.querySelector('i[aria-label*="Prime" i], span[aria-label*="Prime" i], svg[aria-label*="Prime" i]');
        r.style.display = prime ? '' : 'none';
      });
    };
    return immediate?run():onIdle(run);
  }

  function hideSponsored(){
    if(!settings.hideAds) return;
    const sels=[
      '[data-component-type="sp-sponsored-result"]',
      '[data-cel-widget^="sp_"]',
      'div.AdHolder',
      'div[data-ad-feedback]'
    ];
    sels.forEach(s=> $$(s).forEach(el=> el.style.display='none'));
    $$('div[aria-label*="Sponsored" i]').forEach(el=> el.style.display='none');
  }
  function hideFbtAndRecs(){
    if(!settings.hideFbtAndRecs) return;
    const labels=[/Frequently bought together/i,/Customers who bought/i,/Products related to this item/i,/Inspired by your browsing history/i];
    $$('h2, h3').forEach(h=>{
      if(labels.some(rx=>rx.test(h.textContent||''))){
        const cont=h.closest('.a-section')||h.parentElement; if(cont) cont.style.display='none';
      }
    });
  }

  // -----------------------------
  // SPA handling
  // -----------------------------
  function pageInit(){
    ASIN=detectASIN();
    renderDataBoxes();

    if(settings.highlightBestReviews) onIdle(highlightReviews);
    if(settings.hideAds) onIdle(hideSponsored);
    if(settings.showSoldBy) onIdle(showSoldByBox);
    if(settings.stickyPriceBox) onIdle(makeStickyPriceBox);
    if(settings.autoSortReviews) onIdle(autoSortReviews);
    if(settings.expandReviewsQA) onIdle(expandSections);
    if(settings.forceVerifiedPurchase) onIdle(forceVerifiedOnly);
    if(settings.hideFbtAndRecs) onIdle(hideFbtAndRecs);

    if(settings.filterOnlyMonthly) document.body.classList.add('ae-filter-active');
    rescanMonthly(true);
    if(settings.primeOnlyFilter) primeOnlyFilter(true);
  }

  const rescanAll = throttle(()=>{
    hideSponsored();
    hideFbtAndRecs();
    rescanMonthly(); // debounced
    if (settings.primeOnlyFilter) primeOnlyFilter(true);
  }, 400);

  const mo=new MutationObserver(()=>{ rescanAll(); });
  mo.observe(document.body, {childList:true, subtree:true});

  (function hookHistory(){
    const push=history.pushState;
    history.pushState=function(){ const r=push.apply(this,arguments); setTimeout(pageInit,50); return r; };
    window.addEventListener('popstate',()=> setTimeout(pageInit,50));
  })();

  // Start
  pageInit();
})();
