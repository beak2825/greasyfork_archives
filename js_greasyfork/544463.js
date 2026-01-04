// ==UserScript==
// @name         NASA ADS Link on AAS/IOP pages (Robust DOI extraction)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a floating "NASA ADS" button to IOP/AAS article pages, robustly extracting DOI even for /pdf URLs
// @match        https://iopscience.iop.org/article/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544463/NASA%20ADS%20Link%20on%20AASIOP%20pages%20%28Robust%20DOI%20extraction%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544463/NASA%20ADS%20Link%20on%20AASIOP%20pages%20%28Robust%20DOI%20extraction%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const stopSegments = new Set(['pdf','abstract','full','epub','supp','supplementary','figures','references','full-text','text','download']);

  function cleanCandidate(c){
    if(!c) return null;
    c = c.split(/[?#]/)[0];            // strip query/hash
    c = c.replace(/\/+$/,'');          // strip trailing slashes
    return c;
  }

  function doiFromMeta(){
    const selectors = [
      'meta[name="citation_doi"]',
      'meta[name="dc.Identifier"]',
      'meta[name="DC.Identifier"]',
      'meta[name="dc.identifier"]',
      'meta[name="DOI"]',
      'meta[property="og:doi"]'
    ];
    for(const sel of selectors){
      const m = document.querySelector(sel);
      if(m && m.content) return cleanCandidate(m.content);
    }
    // fallback: canonical link may contain DOI
    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical && canonical.href){
      const match = canonical.href.match(/10\.\d{4,9}\/[-._;()\/:A-Z0-9]+/i);
      if(match) return cleanCandidate(match[0]);
    }
    return null;
  }

  function doiFromLinks(){
    const a = document.querySelector('a[href*="doi.org"], a[href*="/doi/"], a[href*="/article/10."]');
    if(a){
      const href = a.href;
      const match = href.match(/10\.\d{4,9}\/[-._;()\/:A-Z0-9]+/i);
      if(match) return cleanCandidate(match[0]);
    }
    return null;
  }

  function doiFromPath(path){
    if(!path) return null;
    const parts = path.split('/').filter(Boolean);
    // find 'article' segment OR first segment that starts with '10.'
    let idx = parts.indexOf('article');
    if(idx === -1) idx = parts.findIndex(p => p.startsWith('10.'));
    if(idx === -1) return null;
    const start = (parts[idx] === 'article') ? idx + 1 : idx;
    if(start >= parts.length) return null;
    const out = [];
    for(let i = start; i < parts.length; i++){
       const seg = parts[i];
       if(stopSegments.has(seg.toLowerCase())) break;
       out.push(seg);
    }
    if(out.length === 0) return null;
    const candidate = out.join('/');
    return (/10\.\d{4,9}\/\S+/.test(candidate)) ? cleanCandidate(candidate) : null;
  }

  function doiFromReferrer(){
    try{
      const ref = document.referrer;
      if(ref){
        const url = new URL(ref);
        const doi = doiFromPath(url.pathname) || (ref.match(/10\.\d{4,9}\/[-._;()\/:A-Z0-9]+/i) || [])[0];
        if(doi) return cleanCandidate(doi);
      }
    }catch(e){}
    return null;
  }

  // try sources in order of reliability
  let doi = null;
  try {
    doi = doiFromMeta() || doiFromLinks() || doiFromPath(window.location.pathname) || doiFromReferrer();
  } catch(e) {
    console.error('DOI extraction error', e);
  }

  if(!doi) return; // nothing we can do

  const adsUrl = `https://ui.adsabs.harvard.edu/abs/${doi}/abstract`;

  // floating button (bottom-right)
  const btn = document.createElement('a');
  btn.href = adsUrl;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.textContent = 'NASA ADS';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#003366',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    zIndex: '2147483647',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    cursor: 'pointer',
  });

  btn.addEventListener('mouseenter', ()=> btn.style.transform = 'translateY(-2px)');
  btn.addEventListener('mouseleave', ()=> btn.style.transform = 'translateY(0)');

  document.body.appendChild(btn);

})();