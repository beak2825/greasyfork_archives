// ==UserScript==
// @name         TesterTV_NewGoogleButtons
// @namespace    https://greasyfork.org/ru/scripts/488646-testertv-newgooglebuttons
// @version      2025-08-31
// @description  Remove Google's standard buttons and add fixed ones (Web, Images, Videos, Map, Translate, News).
// @author       TesterTV
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488646/TesterTV_NewGoogleButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/488646/TesterTV_NewGoogleButtons.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const $  = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const params = new URLSearchParams(location.search);
  const tbm = params.get('tbm');

  const styles = `
    .ttv-container{height:60px;display:flex;align-items:center;gap:6px}
    .ttv-btn{height:35px;border-radius:15px;background:#202124;color:#f1f3f4;border:1px solid #3c4043;padding:0 15px;cursor:pointer}
    .ttv-btn:hover{background:#1eaaf0}
    .ttv-btn:active{background:#1782b7}
  `;

  function injectStyleOnce() {
    if ($('#ttv-style')) return;
    const st = document.createElement('style');
    st.id = 'ttv-style';
    st.textContent = styles;
    document.head.appendChild(st);
  }

  function getQuery() {
    const inp = $('input[name="q"]');
    const v = inp?.value?.trim();
    return encodeURIComponent(v || params.get('q') || '');
  }

  const mkUrl = {
    Web:       q => `https://www.google.com/search?q=${q}`,
    Images:    q => `https://www.google.com/search?tbm=isch&q=${q}`,
    Videos:    q => `https://www.google.com/search?tbm=vid&q=${q}`,
    Map:       q => `https://www.google.com/maps/search/${q}`,
    Translate: q => `https://translate.google.com/?sl=auto&tl=en&text=${q}`,
    News:      q => `https://www.google.com/search?tbm=nws&q=${q}`,
  };

  function makeBar(top = -10) {
    const bar = document.createElement('div');
    bar.className = 'ttv-container';
    bar.style.marginTop = `${top}px`;

    Object.keys(mkUrl).forEach(lbl => {
      const btn = document.createElement('button');
      btn.className = 'ttv-btn';
      btn.textContent = lbl;

      btn.addEventListener('click', () => location.href = mkUrl[lbl](getQuery()));
      btn.addEventListener('auxclick', e => {
        if (e.button === 1) window.open(mkUrl[lbl](getQuery()), '_blank');
      });

      bar.appendChild(btn);
    });

    return bar;
  }

  function clearNode(el) {
    if (!el) return;
    // Remove all children (native buttons)
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function run() {
    injectStyleOnce();

    // Prevent duplicates
    if ($('.ttv-container')) return;

    let anchor = null;
    let top = -10;

    if (tbm === 'isch') {
      // Images
      anchor = $('.T47uwc');
      top = 10;
      clearNode(anchor);
    } else if (tbm === 'vid' || tbm === 'nws') {
      // Videos / News
      const first = $('.XIzzdf:nth-of-type(1)');
      // Remove duplicates and side extras
      $$('.XIzzdf:nth-of-type(n+2)').forEach(n => n.remove());
      $('.fKmH1e')?.remove();
      anchor = first || $('div[role="navigation"]');
      clearNode(anchor);
    } else {
      // Regular web search (or sca_esv)
      anchor = $('.crJ18e') || $('.IUOThf') || $('div[role="navigation"]');
      clearNode(anchor);
    }

    if (!anchor) return;
    anchor.appendChild(makeBar(top));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();